import 'antd/dist/antd.css';
import React, { Component } from 'react';
import {message, Button, Icon, Input, InputNumber, Select } from 'antd';
import {VariableComponent, EdgeComponent, UploadJson} from "./componentLib"
import Verify from "./verify"

class App extends Component {

  render() {
    const Option = Select.Option
    return (
      <div className="App">
          <h1 className="App-title">DRYVR</h1>
          <h2 className="description">Data-driven Verification and compositional reasoning for automotive systems</h2>
          <label>Bloating Method </label>
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Select a Method"
      optionFilterProp="children"
      value="Global"
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
      <Option value="Global">Global</Option>
      <Option value="PW">PW</Option>
    </Select>
    <label> Determinism </label>
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Select a Method"
      optionFilterProp="children"
      value="Deterministic"
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      <Option value="Deterministic">Deterministic</Option>
      <Option value="Non-Deterministic">Non-Deterministic</Option>
    </Select>
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
