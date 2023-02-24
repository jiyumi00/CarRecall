//Home Style
import { Dimensions, StyleSheet } from 'react-native';
export const styles = StyleSheet.create({ //export를 해주어야 다른 곳에서 사용할 수 있음


  totalContainer:{
    flex:1,
    alignItems: 'center' ,
    backgroundColor: 'white'
  },
  headerView:{
    backgroundColor: '#F0F6FF', 
    height: 200, 
    width: "100%", 
    justifyContent: 'center',
     alignContent: 'center', 
     
     paddingTop:'10%',
     //borderWidth:1,
  },
  titleView:{
    flexDirection:'row',
    width:'40%',
    paddingLeft:'10%',
    backgroundColor:'#D4E2F7'
  },
  titleText:{
    fontSize: 25, 
    color: 'blue',
     fontWeight:'100',
     fontWeight:'100'
  },
  secondTitleText:{
    fontSize: 30, 
    color: 'black', 
    fontWeight:'150',
    paddingLeft:'8%'
  },
  
  searchView:{
    flexDirection:'row',
    justifyContent:'flex-end',
    marginRight:'10%'
  },
  searchInputView:{
    borderWidth:2,
     width:'70%',
     marginTop:10,
     borderRadius:10,
     borderColor:'#D1D1D1',
     alignItems:'center',
     justifyContent:'center'
  },
  bodyView:{

    paddingHorizontal:'8%',
    backgroundColor:'white',
    width: "100%",
  },
  cameraSearchButton: {
    marginTop:10,
    marginLeft: 10,
    width: 54,
    height: 54,
    backgroundColor: '#4B89DC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  recallTitleView:{
    flexDirection: 'row', 
    width:'30%',
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10,
    backgroundColor:'#E3E3E3'
  },
  recallText:{
    fontFamily: "Cochin",
    fontSize:15,
    color: 'black',
    marginTop:"5%"
  },
  confirmbigText:{
    fontSize: 15,
    color: "black", 
    fontWeight: 'bold'
  },
  confirmsmallText:{
    marginTop:"1%",
    fontSize: 16,
    marginLeft: "2%", 
    color: "black", 
    fontWeight: 'bold'
  }
});