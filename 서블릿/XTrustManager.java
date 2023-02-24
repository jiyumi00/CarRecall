package recall.util;

import javax.net.ssl.*;
import java.security.cert.*;
import java.security.*;

public class XTrustManager implements X509TrustManager {
			@Override
			public X509Certificate[] getAcceptedIssuers() {
				return null;
			}
			@Override
			public void checkClientTrusted(X509Certificate[] certs, String authType) throws CertificateException {}
			@Override
			public void checkServerTrusted(X509Certificate[] certs, String authType) throws CertificateException {}
}