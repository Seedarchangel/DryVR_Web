import React, { Component } from 'react';
import { Select } from 'antd';
import 'antd/dist/antd.css';
//import Combobox from 'react-widgets'
import { Input } from 'antd';
import { InputNumber } from 'antd';
import { Upload, message, Button, Icon } from 'antd';
import EdgeComponent from "./edgeCompo"
import VariableComponent from "./varCompo"

class App extends Component {

  render() {
  const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

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
    <div className='UnsafeSet'>
      <label>Unsafe Set </label>
    </div>
    <div className='UnsafeSetInput'>
      <Input placeholder="Reset" 
            style={{ width: "12%"}}
      />
    </div>
    <div className='TimeHorizon'>
      <label>Time Horizon </label>
    </div>
    <div className='TimeHorizonInput'>
      <InputNumber placeholder="TimeHorizon" 
           style={{ width: "12%"}}
    />
    </div>
<label>Upload: </label>
<div>
  <Upload {...props}>
    <Button
    style = {{width: 600,
              height: 50
    }}
    >
      <Icon type="upload" /> Click to Upload Your Python Model
    </Button>
  </Upload>
</div>
      </div>
    );
  }
}

export default App;
