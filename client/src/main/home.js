import React, { Component , PureComponent } from 'react';
import { ScrollView, Pressable, TextInput, ImageBackground, View, Text, 
    Image, FlatList, TouchableOpacity, Modal, Animated, BackHandler, Alert, NativeModules } from 'react-native';

import Constant from "../util/constatnt_variables";
import WebServiceManager from "../util/webservice_manager";

import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CarIcon from 'react-native-vector-icons/Ionicons';
import { styles } from "../styles/home";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            repairsContent:"",
            recallsContent:"",
            carNo:"",
        };
    }

    componentDidMount() {
        SplashScreen.hide();
        BackHandler.addEventListener("hardwareBackPress", this.backPressed); //뒤로가기 이벤트
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    }    


    // 자동차번호인식 카메라로 이동
    goCameraButtonClicked = () => {
        this.props.navigation.push("CarNoCamera", { onResultListener: this.carNoInfo });
    }

    carNoInfo=(carNo, repairsContent, recallsContent)=>{
        this.setState({carNo:carNo, repairsContent:repairsContent, recallsContent:recallsContent });
    }

    //뒤로가기 했을 때 앱 종료
    backPressed = () => {
        Alert.alert(
            '',
            '앱을 종료하시겠습니까?',
            [
                { text: '취소', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: '확인', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false });
        return true;
    }

    render() {
        return (
            <>
                <View style={styles.totalContainer}>
                   
                    <View style={styles.headerView}>
                       
                        <View style={styles.titleView}>
                        <Text style={styles.titleText}>내 자동차</Text>
                        
                        </View>
                        <View style={{flexDirection:'row'}}>
                        <Text style={styles.secondTitleText}> 손쉽게 리콜 조회</Text>
                        <Icon  name='build-circle' size={45} color={'lightgrey'}></Icon>
                        </View>
                        
                    
                        <Text style={{paddingLeft:'8%',paddingTop:'2%'}}>차량번호판 사진으로 </Text>
                        <Text style={{paddingLeft:'8%'}}>바로 검색이 가능합니다.</Text>
                    </View>
               
                    <View style={{ backgroundColor: 'white', height: "10%", width: "100%",borderTopStartRadius:30,borderTopEndRadius:30}}>
                        <View style={styles.searchView}>
                            {/* 카메라로 검색 */}
                            <View style={styles.searchInputView}>
                                <TextInput>
                                <Text style={styles.confirmsmallText}>{this.state.carNo}{"\n"}</Text>
                                </TextInput>
                            </View>
                            <TouchableOpacity
                                style={styles.cameraSearchButton}
                                onPress={this.goCameraButtonClicked}>
                                <Image
                                    source={require('../images/icon/camera-icon/camera-icon.png')}
                                />
                            </TouchableOpacity> 
                        </View>
                      
                    </View>
                    <ScrollView style={{width:"100%",backgroundColor:'white',marginTop:'5%',marginBottom:'5%'}}>
                        <View style={styles.bodyView}>              
                                <View style={styles.recallTitleView}>
                                    <Text style={styles.confirmbigText}>리콜현황</Text>
                                </View>
                                <Text >{this.state.recallsContent}{"\n"}</Text>
                                <View style={styles.recallTitleView}>
                                <Text style={styles.confirmbigText}>무상점검수리</Text>
                                </View>
                                <Text>{this.state.repairsContent}{"\n"}</Text>
                        </View>
                    </ScrollView>
                 
                </View>
            </>
        );
    }
}

export default Home;