import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">hello word</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}



// class App extends Component {

//   returninfo (N) {
//     let hinfo =<span>有({N})条未读消息</span>
//     let ninfo =<span>没有未读消息</span>
//     return N>0 ? hinfo : ninfo
//   }

//   render () {
//     // TODO
//     const num = 0;
    
//     return(
//       <div>
//         <span>{this.returninfo(num)}</span>
//       </div>
//     )
//   }
// }

export default App;
