import 'antd/dist/antd.css';
import React, { Component } from 'react';
import { Select } from 'antd';
import {VariableComponent, EdgeComponent, UploadJson} from "./componentLib"
import Verify from "./verify"

class App extends Component {

  render() {
    //const Option = Select.Option
    return (
      <div className="App">
          <h1 className="App-title">DRYVR</h1>
          <h2 className="description">Data-driven Verification and compositional reasoning for automotive systems</h2>
          <label>Bloating Method </label>

    <div className='Edge'>
      <EdgeComponent></EdgeComponent>
    </div>
    <div className='VariableInput'>
      <VariableComponent></VariableComponent>
    </div>
<div>
<UploadJson></UploadJson>
</div>
      <Verify />
      </div>
    );
  }
}

export default App;
