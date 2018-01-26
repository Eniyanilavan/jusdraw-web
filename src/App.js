import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Tab from './component/tab';

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
    }
  }

upload = ()=>{
  
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
    let reader = new FileReader();
    let file = document.getElementById('myFile').files[0];
    reader.onloadend = () => {
      this.setState({
        url: reader.result
      },function (){
        this.setState({display:true,innerTEXT:'none'})
        }
      );
    }

    reader.readAsDataURL(file)
  }
  render() {
    return (
      <div className="main" style={{height:"700px"}}>
        <header className="header">
            <div style={{color:'#339933',fontSize:'50px'}}>First Cut<sub>-just as simple</sub></div>
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
            <button id="upload" onClick={this.upload}>UPLOAD</button>
          </div>
          <div style={{width:"50%",float:'left' }}>
            <nav style={{background:"#339933",height:"45px"}}>
              <Tab button="JSON" title="json file"onclick={this.a}/>
              <Tab button="UI VIEW" title="UI design"onclick={this.c}/>
            </nav>
            <textarea name="textjson" style={{display:this.state.text,height:"100%",width:"99 %"}}></textarea>
            <textarea name="textjs" style={{display:this.state.ui,height:"100%",width:"99%"}}></textarea>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
