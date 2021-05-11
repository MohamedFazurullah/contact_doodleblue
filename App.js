import React from 'react';
import { StyleSheet, Text, View, PermissionsAndroid,Platform,FlatList,
  TouchableOpacity,ToastAndroid,Alert,TextInput,ActivityIndicator} from 'react-native';

//third party library  
import Contacts from 'react-native-contacts';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from 'react-native-check-box';
import {SafeAreaView,SafeAreaProvider} from 'react-native-safe-area-context';
import CallDetectorManager from 'react-native-call-detection';
import { PureComponent } from 'react';

 class App extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      contact: [],
      isChecked : [],
      status : "Not Selected",
      selectedItemList : [],
      flag : false,
      Arraylist_phone : [],
      Arraylist_filter_ph : [],
      filteredDataSource :[],
      masterDataSource : [],
      search : "",
     }

     this.startListenerTapped();
   }

   //call detection handler
   startListenerTapped() {
    this.callDetector = new CallDetectorManager((event, phoneNumber)=> {
   
    
     if(this.state.selectedItemList != ""){
      for(let i=0;i<this.state.selectedItemList.length;i++){
        if(this.state.selectedItemList[i].number == phoneNumber){
          Alert.alert(  
            event,  
            "Name : "+this.state.selectedItemList[i].name+"\n"+"Number : "+phoneNumber,  
            [  
            {text: 'OK', onPress: () => console.log('OK Pressed')},  
            ]  
        );  
          console.log("arraylist :"+JSON.stringify(this.state.selectedItemList));
        }else{

          Alert.alert(  
            event,  
            phoneNumber +" is a New Number, details not in the stack..",  
            [  

                {text: 'OK', onPress: () => console.log('OK Pressed')},  
            ]  
        );  
          console.log(phoneNumber +" is a New Number, details not in the stack.." );
        }
    }
 
    }else{

      Alert.alert(  
        "Alert",  
        "No contacts is selected, stack is empty..",  
        [  

            {text: 'OK', onPress: () => console.log('OK Pressed')},  
        ]  
    );  
      console.log("No contacts is selected, stack is empty..");
    }
    
},
true, 
()=>{}, 
{
title: 'Phone State Permission',
message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.'
})}

  componentDidMount() {

   let initialCheck = this.state.contact.map(() => false);
    this.setState({isChecked : initialCheck})
  
    //get all contacts from phone
    try{
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
              title: 'Contacts',
              message: ' This app would like to see your contacts'
          }
      ).then(() => {
         Contacts.getAll()
        .then((contacts) => {
          this.setState({contact : contacts });
          this.setState({filteredDataSource : contacts});
          this.setState({masterDataSource : contacts});
          this.setState({flag : true});
          console.log("Length1 : "+contacts.length);
          console.log("Length2 : "+this.state.filteredDataSource.length);
          console.log("Length3 : "+this.state.masterDataSource.length);
      for(let i=0;i<contacts.length;i++){
        this.state.Arraylist_phone.push({number:this.state.filteredDataSource[i].phoneNumbers[0].number,name:this.state.filteredDataSource[i].displayName});
        }     
       })
      })
      } 
     }catch(e){
      console.log("error : "+e);
  }
}

 searchFilterFunction = (text) => {
  console.log("search_text :"+text);
  if (text) {
   const newData = this.state.masterDataSource.filter(
      function (item) {
        const itemData = item.displayName
          ? item.displayName.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
    });
    this.setState({filteredDataSource : newData});
    this.setState({search : text});
    
  } else {
    
this.setState({masterDataSource : this.state.masterDataSource});
    this.setState({search : text});
    
  }
};
 
 getItem = (item) => {
  alert('ContactName : ' + item.displayName);
};

 showToast = (ph) => {
  ToastAndroid.show(""+ph, ToastAndroid.SHORT);
};

isIconCheckedOrNot = (item,index) => {
  console.log("isIconCheckedOrNot clicked...");
let { isChecked,selectedItemList} = this.state;
    isChecked[index] = !isChecked[index];
    this.setState({ isChecked : isChecked});
   
    console.log("Attempt1");
    for(var i=0;i<this.state.Arraylist_phone.length;i++){
     
if(this.state.Arraylist_phone[i].name == item.displayName){
  console.log("Attempt2");
if(isChecked[index] == true){
  selectedItemList.push({id : index,name : item.displayName,number:this.state.Arraylist_phone[i].number});
  this.showToast("Checked : "+JSON.stringify(selectedItemList));
 }
 else{          
  console.log("Attempt3");
selectedItemList.pop({id : index,name : item.displayName,number:this.state.Arraylist_phone[i].number});
this.showToast("Unchecked : "+JSON.stringify(selectedItemList));

}}}}


 renderItem = ({item,index}) => (
  <TouchableOpacity onPress={() => this.getItem(item)}>
<View style = {{margin:10,padding:10,backgroundColor:"#C9C4C5",borderRadius:20,elevation: 20}}>
<View style={{justifyContent:"flex-start",flexDirection:'row'}}>

<Text style= {{fontSize:20,fontWeight:'normal'}}>Name : </Text>
<Text style={{color:"#000000",fontSize:20,fontWeight:'bold'}}>
    {item.displayName}
</Text>

</View>
<View >
{
 item.phoneNumbers.map(phone =>  (
    <TouchableOpacity>
<View style={{flexDirection:'row'}}>
    <Text style={{fontSize:20,fontWeight:'normal'}}>{phone.label} : </Text>
    <Text style={{fontSize:20,fontWeight:'bold',color:'#C70039'}}>{phone.number}</Text>
</View>
 </TouchableOpacity>
))}
</View>
<CheckBox
          value={this.state.isChecked[index]}
          onClick={() => this.isIconCheckedOrNot(item,index)}
          style={{flex: 1, padding: 0}}
        />
</View>
</TouchableOpacity>
)

   render() {
      return (

        <SafeAreaView>
<View  style = {{backgroundColor:'#fff'}}>
<TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => this.searchFilterFunction(text)}
          value={this.state.search}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        />

{
  !this.state.flag ? 
<View style = {{justifyContent:'center',alignItems:'center',width :'100%',height:'100%'}}>
<ActivityIndicator size="large" color="#BC093C" />
<Text style={{fontSize:18,fontWeight:'bold',color:'#BC093C'}}>Fetching Contacts....</Text>
  </View>
    :

<FlatList
           style = {{marginBottom : 50}}
                    data={this.state.filteredDataSource}
                    renderItem={this.renderItem}
                    //Setting the number of column
                    numColumns={1}
                    keyExtractor={(item, index) => index
                  }
                  
                />
}

           
         </View>
        </SafeAreaView>
         
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
   textInputStyle: {
    height: 40,
    borderWidth: 1.5,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#B90529',
    backgroundColor: '#FFFFFF',
    elevation : 10,
    fontSize :18,
  },
});

export default App;