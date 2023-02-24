import React, { Component } from 'react';
import { View, LogBox} from 'react-native';

import CameraX from '../util/camera_x';
import WebServiceManager from "../util/webservice_manager";
import Constant from "../util/constatnt_variables";

import { styles } from "../styles/visioncamera_style";

// 오류구문 무시
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default class CarNoCamera extends Component {
    constructor(props) {
        super(props);

        this.carNo="";
        this.repairsContent="";
        this.recallsContent="";

        this.cutImageStyle={
            position:'absolute',
            top:'30%', 
            left:'15%',
            right:'15%',
            bottom:'30%', 
            zIndex:2, 
            borderWidth:1,
            borderColor:'white',
        };       
    }

    //Web Service 시작
    //사진으로부터 자동차번호 가져오는 API
    async callCarNoAPI(imageData) {
        let manager = new WebServiceManager(Constant.carNoURL, "post");
        manager.addBinaryData("file", imageData);

        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }
    //자동차번호로부터 자동차리콜정보 파싱 API
    async callGetReportAPI(carNo) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetReport?carNo=" + carNo);
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }
    
    onCapturedListener=(uri)=> {
        console.log('original image : ',uri);
    }

    onCutImageListener=(uri) => {
        console.log('cut image : ',uri);
        const carNoData = {
            uri: uri,
            type: "image/jpeg",
            name: 'photo.jpg',
        }

        this.callCarNoAPI(carNoData).then((response) => {
            if (response.success == 0) {
                console.log("자동차번호가져오기실패");
                this.carNo="차량번호인식 실패";
                this.props.route.params.onResultListener(this.carNo, "", "");
            }
            else {
                console.log("자동차번호", response.carNo);
                this.carNo = response.carNo;

                this.callGetReportAPI(response.carNo).then((response) => {
                    if(response.success==0){
                        console.log("자동차리콜정보 가져오기 실패");
                    }
                    else {
                        console.log("자동차리콜정보 전체", response);
                        if (response.recalls.length == 0) {
                            this.recallsContent = "리콜정보가 없습니다.";
                            this.repairsContent = response.repairs[0].content;
                        }
                        else if (response.repairs.length == 0) {
                            this.repairsContent = "무상점검 수리내역이 없습니다.";
                            this.recallsContent = response.recalls[0].content;
                        }
                        else  if (response.recalls.length == 0 && response.repairs.length == 0) {
                            this.reacallsContent = "리콜정보가 없습니다.";
                            this.repairsContent = "무상점검 수리내역이 없습니다.";
                        }
                        else {
                            this.recallsContent = response.recalls[0].content;
                            this.repairsContent = response.repairs[0].content;
                        }
                    }

                    this.props.route.params.onResultListener(this.carNo, this.repairsContent, this.recallsContent);
                });
            }
        });
    }

    render() {
        return(
            <View style={styles.background_view}>
                <CameraX autoClose={true} navigation={this.props.navigation} cutImageStyle={this.cutImageStyle} onCapturedListener={this.onCapturedListener} onCutImageListener={this.onCutImageListener} />
            </View>
        );
    }
}