package recall;

import java.net.*;
import java.io.*;
import java.util.ArrayList;

import com.google.gson.Gson;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

import javax.net.ssl.*;
import java.security.cert.*;
import java.security.*;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Attribute;
import org.jsoup.nodes.Attributes;
import org.jsoup.select.Elements;

import recall.util.XTrustManager;
import recall.entity.RecallReport;
import recall.entity.Recall;
import recall.entity.Repair;

@WebServlet("/GetReport")
public class ServiceServlet extends HttpServlet {

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		response.setContentType("text/plain; charset=utf-8");
		PrintWriter out = response.getWriter();
		try {
			//response.setContentType("text/plain; charset=utf-8");
			//PrintWriter out = response.getWriter();

			//리콜 사이트 오류시 접속을 시도하지 않고 바로 실패를 넘겨줌 (임시...2022년 4월 15일)
			//RecallReport report = new RecallReport();
			//report.success=0;
			//Gson gSon = new Gson();
			//out.println(gSon.toJson(report));


			String carNo = URLDecoder.decode(request.getParameter("carNo"),"utf-8");

			int cTime=8;
			int rTime=8;
			if(request.getParameterMap().containsKey("ctime"))
				cTime = Integer.parseInt(request.getParameter("ctime"));
			if(request.getParameterMap().containsKey("rtime"))
				rTime = Integer.parseInt(request.getParameter("rtime"));

			URL url = new URL("https://car.go.kr/ri/recall/list.do");

			XTrustManager trustAllCerts[] = new XTrustManager[]{new XTrustManager()};
			SSLContext context = SSLContext.getInstance("SSL");
			context.init(null,trustAllCerts, new SecureRandom());

			HttpsURLConnection.setDefaultSSLSocketFactory(context.getSocketFactory());
			HttpsURLConnection sconnection = (HttpsURLConnection)url.openConnection();
			sconnection.setDoOutput(true);
			sconnection.setDoInput(true);

			sconnection.setConnectTimeout(cTime*1000);
			sconnection.setReadTimeout(rTime*1000);

			sconnection.setRequestMethod("POST");
			sconnection.setRequestProperty("Content-Type","application/x-www-form-urlencoded; charset=utf-8");

			OutputStream webServiceOut = sconnection.getOutputStream();

			//String queryString = "srchFlg=Y&vehicleIdFlag=1&vehicleIdNumber="+request.getParameter("carNo");
			String queryString = "srchFlg=Y&vehicleIdFlag=1&vehicleIdNumber="+carNo;

			webServiceOut.write(queryString.getBytes("utf-8"));
			webServiceOut.flush();

			InputStream in = sconnection.getInputStream();
			byte[] data = new byte[1024*32];
			int size;
			StringBuilder html = new StringBuilder();

			while((size=in.read(data))!=-1)
				html.append(new String(data,0,size,"utf-8"));

			Document document = Jsoup.parse(html.toString());
			Element element = document.select("div.latest-recall").first();

			if(element==null) {
				RecallReport report = new RecallReport();
				report.success=0;
				Gson gSon = new Gson();
				out.println(gSon.toJson(report));
				return;
			}

			Element recallElement = element.clone();
			html=null;
			element=null;

			//리콜이나 무상수리가 있는 경우 모든 element 가져옴. 없으면 갯수가 0임
			Elements aTags = recallElement.select("a[href*=#]");
			RecallReport report = new RecallReport();
			ArrayList<Recall> recalls = new ArrayList<>();
			ArrayList<Repair> repairs = new ArrayList<>();
			report.success=1;

			//리콜과 무상수리에 대한 모든 Element에 대해 반복 (없으면 반복하지 않음)
			for(Element aTag : aTags) {
				Recall recall = this.getRecall(aTag);
				if(recall!=null)
					recalls.add(recall);

				//무상수리 내역은 현재 사용하지 않음(사용할 경우 주석만 해제하면 됨)
				Repair repair = this.getRepair(aTag);
				if(repair!=null)
					repairs.add(repair);
			}

			report.recalls=recalls;
			report.repairs=repairs;

			Gson gSon = new Gson();
			out.println(gSon.toJson(report));
		}catch(Exception e) {
			RecallReport report = new RecallReport();
			report.success=0;
			Gson gSon = new Gson();
			out.println(gSon.toJson(report));
		}
	}






	//리콜이 있을 경우 Recall객체 리턴 없으면 null
	private Recall getRecall(Element element) {
		Attributes attrs = element.attributes();
		for(Attribute attr : attrs) {
			String attrName = attr.getKey();
			if(attrName.equals("onclick")) {
				String attrValue = attr.getValue();
				//리콜이 있을 경우
				if(attrValue.contains("statDetailView")) {
					Recall recall = new Recall();
					Elements tags = element.children();
					//리콜에 대한 제목과 내용을 가져옴(strong-제목, p-내용)
					for(Element tag : tags) {
						if(tag.tagName().equals("strong")) {
							recall.title=tag.text();
							if(tag.childrenSize()>0) {
								Element completeTag = tag.child(0);
								Attributes atts = completeTag.attributes();
								//리콜완료 여부 가져옴
								for(Attribute att : atts)
									if(att.getKey().equals("class") && att.getValue().contains("complete"))
										recall.complete=1;
							}
						}
						if(tag.tagName().equals("p"))
							recall.content=tag.text();
					}
					//리콜에 대한 날짜 가져옴
					for(Element tag : element.nextElementSiblings()) {
						Element e = tag.select("span.count").first();
						if(e!=null)
							recall.startDate=e.text().substring(3);
					}
					return recall;
				}
			}
		}
		return null;
	}


	//무상수리가 있을 경우 Repair객체 리턴 없으면 null
	private Repair getRepair(Element element) {
		Attributes attrs = element.attributes();
		for(Attribute attr : attrs) {
			String attrName = attr.getKey();
			if(attrName.equals("onclick")) {
				String attrValue = attr.getValue();
				//무상수리가 있을 경우
				if(attrValue.contains("grtsDetailView")) {
					Repair repair = new Repair();
					Elements tags = element.children();
					//무상수리에 대한 제목과 내용 가져옴
					for(Element tag : tags) {
						if(tag.tagName().equals("strong"))
							repair.title=tag.text();
						if(tag.tagName().equals("p"))
							repair.content=tag.text();
					}
					//무상수리에 대한 날짜 가져옴
					for(Element tag : element.nextElementSiblings()) {
						Element e = tag.select("span.count").first();
						if(e!=null)
							repair.startDate=e.text().substring(3);
					}
					return repair;
				}
			}
		}
		return null;
	}
}