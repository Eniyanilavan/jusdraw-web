import React, { Component } from 'react';
import './App.css';
import Tab from './component/tab';
import {Button, Icon,Row,Input,Footer} from 'react-materialize';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
var AWS = require('aws-sdk');
AWS.config.update({
            region:'us-east-1',
            credentials: {
                accessKeyId: 'AKIAI3KSWCPHFQOJ46DQ',
                secretAccessKey: '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',
            }
        });

var s3 = new AWS.S3({apiVersion: '2006-03-01'});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const POOL_DATA = {
  ClientId : '70qhoo3a6365msckj66ck02fbn',
  UserPoolId : 'us-east-1_h7Lxkjzd8',
}
const userPool = new CognitoUserPool(POOL_DATA);
var currentuser = userPool.getCurrentUser();
let reader = new FileReader();
class App extends Component {
  constructor()
  {
    super();
    this.state={
      text: 'none',
      ui: 'none',
      display:'none',
      url:'',
      innerTEXT:true,
      main:'none',
      islogin:true,
      confirm:'none',
    };
  }

upload = ()=>{
    let file = document.getElementById('myFile').files[0];

    var params = {
    Body: file,
    Bucket: "com.jusdraw/"+currentuser['username'],
    Key: file['name'],
    ServerSideEncryption: "AES256",
    Tagging: "key1=value1&key2=value2"
   };
   s3.putObject(params, function(err, data) {
     if (err) alert(err);
     else{
      alert("Image upload successful");
      var params = {
      MessageBody: currentuser['username']+"/"+file['name'],
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/362071517917/jusdraw',
      DelaySeconds: 0,
      };
      sqs.sendMessage(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log(data);
      });
     }
   });
}


signUp =()=> {

    const parm = {
      uname : document.getElementById('Username').value,
      email : document.getElementById('Emailid').value,
      pass : document.getElementById('Password').value,
    }
    var attributeList = [];

    var dataEmail = {
            Name : 'email',
            Value : parm.email,
    };

    var attributeEmail = new CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);
    const that = this;
    userPool.signUp(parm.uname, parm.pass, attributeList, null, function(err, result){
        if (err) {
            alert(err);
            return;
        }
        var cognitouser = result.user;
        console.log('user name is ' + cognitouser.getUsername());
        alert("successfully created account confirm in email to continue\n"+'user name is ' + cognitouser.getUsername());
        that.setState({confirm:true,islogin:'none'});
    });
}
confirm = ()=>{

  var userData = {
    Username: document.getElementById('username').value,
    Pool: userPool,
  }

  const cognitUser = new CognitoUser(userData);
  cognitUser.confirmRegistration(document.getElementById('confirm').value, true, (err,result)=>{
    if(err)
    {
      alert(err);
      return;
    }
    alert('successfully conformed email');
    this.setState({confirm:'none',main:true});
  })
}

toconfirm=()=>{
    this.setState({confirm:true,islogin:'none'});
}

signIn=()=>{
  const that = this;
  var authenticationData = {
     Username : document.getElementById('signinname').value,
     Password : document.getElementById('signinpassword').value,
   }

 var authenticationDetails = new AuthenticationDetails(authenticationData);
 var userData = {
   Username: document.getElementById('signinname').value,
   Pool: userPool,
 }
 var cognitoUser = new CognitoUser(userData);
 cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            alert('LOGIN SUCCESSFULL');
            that.setState({main:true,islogin:'none'});
          }.bind(this),
        onFailure: function(err){
          alert(err);
        }
          });
  }

a = ()=>{
  this.setState({text:false,ui:'none'});
}
c = ()=>{
  this.setState({text:'none',ui:false});
}

browse = ()=>{
  var a = document.getElementById('myFile');
  a.click();
}
x=()=>{
  let file = document.getElementById('myFile').files[0];
  reader.onloadend = () => {
    this.setState({
      url: reader.result
    },function (){
      this.setState({display:true,innerTEXT:'none'})
      }
    );
  }
  reader.readAsDataURL(file);
}

componentDidMount(){
  const that = this;
  if(!currentuser)
  {

  }
  else {
    currentuser.getSession((err, session)=>{
      if(err){

      }
      else{
        if(session.isValid()){
          that.setState({main:true,islogin:'none'});
        }
      }
    })
  }
}
componentDidUpdate(){
  currentuser = userPool.getCurrentUser();
}

signout = ()=>{
  currentuser.signOut();
  this.setState({main:'none',islogin:true,display:'none',innerTEXT:true});
}


render() {
  return (
    <div>
      <div className="main" style={{height:"700px",display:this.state.main}}>
        <header className="header">
            <button className="upload" style={{fontSize:"10px",marginLeft:"1200px"}} onClick={this.signout}>SIGN OUT</button>
            <div style={{color:'#339933',fontSize:'50px'}}>
              First Cut<sub>-just as simple</sub>
            </div>
        </header>
        <div>
          <div style={{width:"50%",float:'left'}}>
            <div style={{background:'#339933',height:"45px"}}>
              <div style={{width:"75%",height:"100%",float:"left",textAlign:'center',padding:"10px 0px 0px 110px",color:"white"}}>
                Image
              </div>
              <button id="img" title="add image" onClick={this.browse}>+</button>
              <input type="file" id="myFile" name="myFile" style={{display:'none'}} onChange={this.x}/>
            </div>
            <div style={{marginTop:"7px",border:"3px dashed gray",width:"75%",marginLeft:"100px",textAlign:"center"}}>
              <img src={this.state.url} style={{display:this.state.display,width:"100%",height:"100%"}} alt="Uploaded image"/>
              <p style={{color:"gray",display:this.state.innerTEXT,paddingTop:"60%"}}>IMAGE</p>
            </div>
            <button className="upload" onClick={this.upload}>UPLOAD</button>
          </div>
          <div style={{width:"50%",float:'left' }}>
            <nav style={{background:"#339933",height:"45px"}}>
              <button className="Disp" title="json file" onClick={this.a}>JSON</button>
              <button className="Disp" title="UI design" onClick={this.c}>UI VIEW</button>
            </nav>
            <textarea name="textjson" style={{display:this.state.text,height:"100%",width:"99%"}}></textarea>
            <textarea name="textjs" style={{display:this.state.ui,height:"100%",width:"99%"}}></textarea>
          </div>
        </div>
      </div>
      <div style={{display:this.state.islogin}}>
        <div className="app">
          <header className="app-header">
            <img src="http://www.myiconfinder.com/uploads/iconsets/a4907a7eba6cd4ac85f0762f94fa48e4.png" className="app-logo" alt="logo" />
            <h1 className="app-title">Welcome to JusDraw</h1>
            <p className="app-intro">
              Draw() Develop() Deploy()
            </p>
          </header>
          <div className = "MainDiv">
            <div className = "SignUpDiv">
              <Row>
                  <b>SIGNUP</b>
              </Row>
              <Row>
                  <Input  id= "Username" s={12} label="User Name" validate><Icon>contacts</Icon></Input>
              </Row>
              <Row>
                  <Input  id="Emailid" s={12} label="Email" validate type='email'><Icon>email</Icon></Input>
              </Row>
              <Row>
                  <Input  id="Password" s={12} label="Password" validate type = 'password'><Icon>lock</Icon></Input>
              </Row>
              <Row>
                  <Button waves='light' onClick = {this.signUp}>SIGNUP</Button>
              </Row>
            </div>
            <div className = "SignInDiv">
              <Row>
                  <b>SIGNIN</b>
              </Row>
              <Row>
                  <Input  id="signinname" s={12} label="Username" validate><Icon>contacts</Icon></Input>
              </Row>
              <Row>
                  <Input  id="signinpassword" s={12} label="Password" validate type = 'password'><Icon>lock</Icon></Input>
              </Row>
              <br/><br/><br/><br/>
              <Row>
                  <Button waves='light' onClick = {this.signIn}>button</Button>
              </Row>
            </div>
          </div>
        </div>
        <Button waves='light' onClick = {this.toconfirm} style={{marginLeft:"650px"}}>CONFIRM USER</Button>
      </div>
      <div style={{display:this.state.confirm}}>
        <div className="app">
          <header className="app-header">
          <img src="http://www.myiconfinder.com/uploads/iconsets/a4907a7eba6cd4ac85f0762f94fa48e4.png" className="app-logo" alt="logo" />
          <h1 className="app-title">Welcome to JusDraw</h1>
          <p className="App-intro">
            Draw() Develop() Deploy()
          </p>
          </header>
          <div className = "MainDiv">
            <div style={{marginTop:"10px",width:"500px"}}>
              <br/>
              <Row>
                  <b>CONFIRMATION</b>
              </Row>
              <Row>
                  <Input  id= "username" s={12} label="User Name" validate><Icon>contacts</Icon></Input>
              </Row>
              <Row>
                  <Input  id="confirm" s={12} label="confirmation code" validate type = 'text'><Icon>lock</Icon></Input>
              </Row>
              <Row>
                  <Button waves='light' onClick = {this.confirm}>CONFIRM</Button>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
}
export default App;
