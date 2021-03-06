import 'antd/dist/antd.css';
import { message, Upload, Button, Icon ,Input, InputNumber, Select, Spin} from 'antd';
import Graph from "react-graph-vis";
import Console from "react-console-component"
import randomColor from "randomcolor"
import React from 'react';
import File from 'file-saver';
import io from 'socket.io-client'
import axios from 'axios';

export class EdgeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
            bloatingMethod: 'GLOBAL',
            determinism: 'Deterministic',
            vertex: [{ name: ''}],
            edge: [{ name: '' }],
            guards: [{ name: '' }],
            reset: [{ name: '' }],

    };
    updateEdgeCompo = updateEdgeCompo.bind(this) //TODO: for future updating information
    this.creategraph = this.creategraph.bind(this)
    this.createoptions = this.createoptions.bind(this)
    this.createevents = this.createevents.bind(this)
    generateRemoteJson = generateRemoteJson.bind(this)
    saveFile = saveFile.bind(this)
    getBloatingStatus = getBloatingStatus.bind(this)
  }

  creategraph(){
    var nodeArray = []
    var edgeArray = []
    this.state.vertex.map((oneVertex, idx)=> {
      nodeArray.push(
        {id:idx, key:idx, label: oneVertex.name, color: randomColor({hue: 'blue', count: 18})}
      )
    })
    this.state.edge.map((oneEdge, idx)=> {
      if (oneEdge.name!==undefined)
      {
        var arr = oneEdge.name.split(",");
        edgeArray.push(
            {key:idx, from: arr[0], to: arr[1], minlen: "10", fontsize: 5, label: "Guard: "+this.state.guards[idx].name+"\n"+"Reset: "+this.state.reset[idx].name}
        )
      }
    })
    var graph = {
      overlap: false,
      nodes: nodeArray,
      edges: edgeArray
    };
    return graph
  }

  createoptions(){
    var options = {
      autoResize: true,
      layout: {
        hierarchical: false
      },
      edges: {
        color: "#000000",
        
      }
    };
    return options
  }

  createevents(){
    var events = {
        select: function(event) {
            //var { nodes, edges } = event;
        }
    }
    return events
  }

  handleVertexNameChange = (idx) => (evt) => {
    const newShareholders = this.state.vertex.map((shareholder, sidx) => {
    if (idx !== sidx) return shareholder;
      return { ...shareholder, name: evt.target.value };
    });
    this.setState({ vertex: newShareholders });
  }

  handleEdgeNameChange = (idx) => (evt) => {
    const newShareholders = this.state.edge.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, name: evt.target.value };
    });

    this.setState({ edge: newShareholders });
  }

  handleGuardNameChange = (idx) => (evt) => {
    const newShareholders = this.state.guards.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, name: evt.target.value };
    });

    this.setState({ guards: newShareholders });
  }

  handleResetNameChange = (idx) => (evt) => {
    const newShareholders = this.state.reset.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, name: evt.target.value };
    });

    this.setState({ reset: newShareholders });
  }

  handleAddEdge = () => {
    this.setState({
      edge: this.state.edge.concat([{ name: '' }]),
      guards: this.state.guards.concat([{ name: '' }]),
      reset: this.state.reset.concat([{ name: '' }])
    });
  }

  handleAddVertex = () => {
    this.setState({
      vertex: this.state.vertex.concat([{ name: '' }]),
    });
  }

  handleRemoveEdge = (idx) => () => {
    this.setState({
      edge: this.state.edge.filter((s, sidx) => idx !== sidx),
      guards: this.state.guards.filter((s, sidx) => idx !== sidx),
      reset: this.state.reset.filter((s, sidx) => idx !== sidx),
    });
  }

  handleRemoveVertex = (idx) => () => {
    this.setState({
      vertex: this.state.vertex.filter((s, sidx) => idx !== sidx),
    });
  }

  handleChangeDeterminism = (val) => () => {
      console.log(val)
      console.log(this.state.determinism)
      if (this.state.determinism == "Deterministic")
      this.setState({
          determinism: "Non-Deterministic"
      })
      else
      this.setState({
          determinism: "Deterministic"
      })
  }

    handleChangeBloating = (val) => () => {
    //console.log(val)
      if (this.state.bloatingMethod == "GLOBAL")
      this.setState({
          bloatingMethod: "PW"
      })
      else
      this.setState({
          bloatingMethod: "GLOBAL"
      })
  }

  render() {
    return (
      <div>
        {/* ... */}
              <div>
        {/* ... */}
        <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a Method"
            optionFilterProp="children"
            defaultValue="GLOBAL"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange = {this.handleChangeBloating()}
                        >
            <Select.Option value="GLOBAL">Global</Select.Option>
            <Select.Option value="PW">PW</Select.Option>
        </Select>
        <label> Determinism </label>
        <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a Method"
            optionFilterProp="children"
            defaultValue="Deterministic"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange = {this.handleChangeDeterminism()}
        >
        <Select.Option value="Deterministic">Deterministic</Select.Option>
        <Select.Option value="Non-Deterministic">Non-Deterministic</Select.Option>
        </Select>
        <br/>
        <label>Vertex: </label>
        <Button type="button" onClick={this.handleAddVertex} className="small">
        Add Vertex
        </Button>
        <br/>
        {this.state.vertex.map((shareholder, idx) => (
          <view>
            <Input
              style={{width:"10%",
              }}
              type="text"
              value={shareholder.name}
              onChange={this.handleVertexNameChange(idx)}
            />
            <Button type="button" onClick={this.handleRemoveVertex(idx)} className="small">
              <Icon type="delete"/>
            </Button>
            {"   "}
          </view>
        ))}
      </div>
        <label>Edge: </label>
        <Button type="button" onClick={this.handleAddEdge} className="small">Add Edge</Button>
        <br/>
        {this.state.edge.map((shareholder, idx) => (
          <view>
            <Input
              style={{width:"10%",
              }}
              type="text"
              value={shareholder.name}
              onChange={this.handleEdgeNameChange(idx)}
            />
            <Button type="button" onClick={this.handleRemoveEdge(idx)} className="small">
              <Icon type="delete"/>
            </Button>
            {"   "}
          </view>
        ))}
        <br/>
        <label>Guard: </label>
        <br/>
        {this.state.guards.map((shareholder, idx) => (
          <view>
            <Input
              style={{width:"10%",
              }}
              type="text"
              value={shareholder.name}
              onChange={this.handleGuardNameChange(idx)}
            />
            <Button type="button" onClick={this.handleRemoveEdge(idx)} className="small">
              <Icon type="delete"/>
            </Button>
            {"              "}
          </view>
        ))}
        <br/>
          <label>Reset</label>
        <br/>
        {this.state.reset.map((shareholder, idx) => (
          <view>
            <Input
              style={{width:"10%",
              }}
              type="text"
              value={shareholder.name}
              onChange={this.handleResetNameChange(idx)}
            />
            <Button type="button" onClick={this.handleRemoveEdge(idx)} className="small">
              <Icon type="delete"/>
            </Button>
            {"            "}
          </view>
        ))}
      <br/>
      <Graph graph={this.creategraph()} options={this.createoptions()} events={this.createevents()} style={{ height: "500px", width: "500"}} />
      </div>
    )
  }
}

function getBloatingStatus()
{
  return this.state.bloatingMethod
}

export class VariableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      variables: [{ name: '' }],
      initialLeft: [{name: ''}],
      initialRight: [{name: ''}],
      kvalue: [{name: ''}],
      unsafeSet: '',
      timeHorizon: '',
      directory: 'examples/cars'
    };
    getVariableState = getVariableState.bind(this)
    updateVariableCompo = updateVariableCompo.bind(this)
    saveFile = saveFile.bind(this)
  }



  handleShareholderNameChange = (idx) => (evt) => {
    const newShareholders = this.state.variables.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, name: evt.target.value };
    });

    this.setState({ variables: newShareholders });
  }

  handleLeftNameChange = (idx) => (evt) => {
    const newShareholders = this.state.initialLeft.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, name: evt.target.value };
    });

    this.setState({ initialLeft: newShareholders });
  }

  handleKvalue = (idx) => (evt) => {
    const newShareholders = this.state.kvalue.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, name: evt.target.value };
    });

    this.setState({ kvalue: newShareholders });
    
  }

  handleRightNameChange = (idx) => (evt) => {
    const newShareholders = this.state.initialRight.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, name: evt.target.value };
    });

    this.setState({ initialRight: newShareholders });
  }

  handleSubmit = (evt) => {
    const { name, variables } = this.state;
    alert(`Incorporated: ${name} with ${variables.length} shareholders`);
  }

  handleAddShareholder = () => {
    this.setState({
      variables: this.state.variables.concat([{ name: '' }]),
      initialLeft: this.state.initialLeft.concat([{ name: '' }]),
      initialRight: this.state.initialRight.concat([{ name: '' }]),
      kvalue: this.state.kvalue.concat([{ name: '' }]),
      
    });
  }

  handleRemoveShareholder = (idx) => () => {
    this.setState({
      variables: this.state.variables.filter((s, sidx) => idx !== sidx),
      initialLeft: this.state.initialLeft.filter((s, sidx) => idx !== sidx),
      initialRight: this.state.initialRight.filter((s, sidx) => idx !== sidx),
      kvalue: this.state.kvalue.filter((s, sidx) => idx !== sidx)

    });

  }

  render() {
    return (
      <div>
        {/* ... */}
        <label>
          Variable:
        </label>
        <Button type="button" onClick={this.handleAddShareholder} className="small">Add Variable</Button>
        <br/>
        {this.state.variables.map((shareholder, idx) => (
          <view >
            <Input
              style={{width:"10%",
              }}
              type="text"
              value={shareholder.name}
              onChange={this.handleShareholderNameChange(idx)}
            />
            <Button type="button" onClick={this.handleRemoveShareholder(idx)} className="small">
              <Icon type="delete"/>
            </Button>
            {"   "}
          </view>
        ))}
        <br/>
          <label>
            Initial Set:
          </label>
        <br/>
         {this.state.variables.map((shareholder, idx) => (
          <view>
            <Input
              style={{width:"5.6%",
              }}
              type="text"
              value={this.state.initialLeft[idx].name}
              onChange={this.handleLeftNameChange(idx)}
            />
              <label>
                {"  <  "+shareholder.name+"  <  "}
              </label>
            <Input
              style={{width:"5.6%",
              }}
              type="text"
              value={this.state.initialRight[idx].name}
              onChange={this.handleRightNameChange(idx)}
            />

            {"   "}
          </view>
        ))}
        <br/>
        Kvalue
        <br/>
        {this.state.kvalue.map((shareholder, idx) => (
          <view>
            <Input
              style={{width:"10%",
              }}
              type="text"
              value={this.state.kvalue[idx].name}
              onChange={this.handleKvalue(idx)}
            />
            <Button type="button" onClick={this.handleRemoveShareholder(idx)} className="small">
              <Icon type="delete"/>
            </Button>
            {"   "}
          </view>
        ))}
        <br/>
        <label>Unsafe Set </label>
        <br/>
         <Input placeholder="Unsafe Set" 
            value={this.state.unsafeSet}
            style={{ width: "12%"}}
        />
        <br/>
        <label>Time Horizon </label>
        <br/>
        <InputNumber placeholder="TimeHorizon" 
           value={this.state.timeHorizon}
           style={{ width: "12%"}}
        />
        
      </div>
    )
  }
}

function updateVariableCompo(text) {
    const reader = new FileReader();
    reader.onload = e => {
        try{
        JSON.parse(reader.result)
    }
        catch(err) {
        message.error(`You did not upload a valid DryVR input file.`)
        return
    }
        var dict = JSON.parse(reader.result)
        const newVariable = dict["variables"].map((eachVariable, sidx) => {
            return { name: eachVariable };
        });
        const newLeft = dict["initialSet"][0].map((eachLeft, sidx) => {
            return { name: eachLeft };
        })
        const newRight = dict["initialSet"][1].map((eachRight, sidx) => {
            return { name: eachRight };
        })

        this.setState({ 
        variables: newVariable,
        unsafeSet: dict["unsafeSet"],
        timeHorizon: dict["timeHorizon"],
        initialLeft: newLeft,
        initialRight: newRight,
         })
        //console.log(this.state)

    }
    
    reader.readAsText(text)
    
}

//Tricky...Global function to pass states
function updateEdgeCompo(text) {
    const reader = new FileReader();
    reader.onload = e => {
        try{
        JSON.parse(reader.result)
    }
        catch(err) {
        message.error(`You did not upload a valid DryVR input file.`)
        return
    }
        var dict = JSON.parse(reader.result)
        const newVertex = dict["vertex"].map((eachVertex, sidx) => {
            return { name: eachVertex };
        });
        const newEdge = dict["edge"].map((eachEdge, sidx) => {
            return { name: String(eachEdge[0])+","+String(eachEdge[1]) };
        })
        const newGuard = dict["guards"].map((eachGuard, sidx) => {
            return { name: eachGuard };
        })
        if (dict.resets!==undefined)
        {
            const newReset = dict.resets.map((eachReset, sidx) => {
                return { name: eachReset };
        })
            this.setState({ 
            vertex: newVertex,
            edge: newEdge,
            guards: newGuard,
            reset: newReset
         });
        }   
        else
        {
            this.setState({ 
            vertex: newVertex,
            edge: newEdge,
            guards: newGuard,
            reset: dict["edge"].map((eachEdge, sidx) => {
                return { name: "" };
        })
         })
        }
        //console.log(this.state)

    }
    
    reader.readAsText(text)
}

export class UploadJson extends React.Component {
    render()
    {
        const props = {
        accept: ".json",
        name: 'file',
        action: '//jsonplaceholder.typicode.com/posts/',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            updateEdgeCompo(info.file.originFileObj);
            updateVariableCompo(info.file.originFileObj);
            } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
            }
        },
        };
        return(
            <div>
            <label>Json Upload</label>
            {"   "}
            <DownloadJson></DownloadJson>
            {"     "}
            <br/>
            <Upload {...props}>
                <Button
                style = {{width: 600,
                        height: 50
                }}
                >
                <Icon type="upload" /> Click to Upload Your Json File
                </Button>
            </Upload>
            </div>
            )
    }
}

function getVariableState(){
    return this.state
}

function saveFile(){
    var edge = this.state
    var variable = getVariableState()
    //console.log(typeof(variable))
    var json = Object.assign({},edge, variable);
    var formatChange = Object.keys(json).map(function(key) {
      if (key=="vertex")
      {
        var vertex = json["vertex"].map((oneVertex, idx)=> {
          return oneVertex.name
        })
        json["vertex"] =vertex
      }

      if (key=="edge")
      {
        var edge = json["edge"].map((oneVertex, idx)=> {
          return oneVertex.name.split(",").map(Number)
        })
        json["edge"] = edge
      }

      if (key=="guards")
      {
        var guard = json["guards"].map((oneVertex, idx)=> {
          return oneVertex.name
        })
        json["guards"] = guard
      }

      if (key=="reset")
      {
        var reset = json["reset"].map((oneVertex, idx)=> {
          return oneVertex.name
        })
        json["reset"] = reset
      }

      if (key=="variables")
      {
        var variable = json["variables"].map((oneVertex, idx)=> {
          return oneVertex.name
        })
        json["variables"] = variable
      }

      if (key=="determinism")
      {
        if(json["determinism"]=="Deterministic")
        json["determinism"] = true
        else
        json["determinism"] = false
      }
      
      if (key=="initialLeft")
      {
        var eachLeft = json["initialLeft"].map((oneVertex, idx)=> {
          return oneVertex.name
        })
        var eachRight = json["initialRight"].map((oneVertex, idx)=> {
          return oneVertex.name
        })
        json["initialSet"] = [eachLeft,eachRight]
        delete json["initialLeft"]
        delete json["initialRight"]
      }

    });
    var json = JSON.stringify(json, null, 5)
    var blob = new Blob([json], {type: "text/plain;charset=utf-8"});
    File.saveAs(blob, "data.json");
}

function generateRemoteJson(){
    var edge = this.state
    var variable = getVariableState()
    //console.log(typeof(variable))
    var json = Object.assign({},edge, variable);
    var formatChange = Object.keys(json).map(function(key) {
      if (key=="vertex")
      {
        var vertex = json["vertex"].map((oneVertex, idx)=> {
          return oneVertex.name
        })
        json["vertex"] =vertex
      }

      if (key=="edge")
      {
        var edge = json["edge"].map((oneVertex, idx)=> {
          return oneVertex.name.split(",").map(Number)
        })
        json["edge"] = edge
      }

      if (key=="guards")
      {
        var guard = json["guards"].map((oneVertex, idx)=> {
          return oneVertex.name
        })
        json["guards"] = guard
      }

      if (key=="reset")
      {
        var reset = json["reset"].map((oneVertex, idx)=> {
          return oneVertex.name
        })
        json["reset"] = reset
      }

      if (key=="variables")
      {
        var variable = json["variables"].map((oneVertex, idx)=> {
          return oneVertex.name
        })
        json["variables"] = variable
      }

      if (key=="determinism")
      {
        if(json["determinism"]=="Deterministic")
        json["determinism"] = true
        else
        json["determinism"] = false
      }
      
      if (key=="initialLeft")
      {
        var eachLeft = json["initialLeft"].map((oneVertex, idx)=> {
          return oneVertex.name
        })
        var eachRight = json["initialRight"].map((oneVertex, idx)=> {
          return oneVertex.name
        })
        json["initialSet"] = [eachLeft,eachRight]
        delete json["initialLeft"]
        delete json["initialRight"]
      }

    });
    var json = JSON.stringify(json, null, 5)
    return json
}


export class DownloadJson extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      bloatingMethod: '',
      Determinism: '',
      vertex: [{ name: '' }],
      edge: [{name: ''}],
      guards: [{name: ''}],
      reset: [{name: ''}],
      variable: [{name: ''}],
      initialLeft: [{name: ''}],
      initialRight: [{name: ''}],
      unsafeSet: '',
      timeHorizon: '',
    };
    
  }
  render()
  { 
      return (
      <Button type="primary" icon="download" size={'small'} onClick={saveFile}>Save Input</Button>
      )
  }

  
}

export class UploadPython extends React.Component {
    render()
    {
        const props = {
        name: 'file',
        accept: ".py,text/directory",
        action: '//jsonplaceholder.typicode.com/posts/',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            insertBlob(info.file.originFileObj, info.file.name)
            } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
            }
        },
        };
        return(
          <div>
            <label>Upload Model</label>
            <br/>
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
            )
    }
}

export class Verify extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
      loading: false,
			output:"",
			verifyHash:"",
      jsonContent:"",
      pythonBlob:"",
      pyModelName:""
		}
		this.handleVerify = this.handleVerify.bind(this)
    insertBlob = insertBlob.bind(this)
	}

	componentDidMount(){
		const socket = io('ws://localhost:8080')
		socket.on('foo', function(data){
			if(data.verifyHash == this.state.verifyHash){
				this.setState({
          loading:false,
					output:data.output
				})
			}
		}.bind(this))

	}

	handleVerify(){
    var json = generateRemoteJson()
		const hash = Math.random().toString()
    if (this.state.pyModelName.trim() == "")
    {
      message.error("You must upload a python model")
    }

    else{
      this.setState({
      loading: true,
			verifyHash:hash
		})
    //console.log(json)
		axios.post(`http://localhost:8080/api/verify`, { verifyHash:hash, jsonContent: json, pythonBlob: this.state.pythonBlob,
    pyModelName: this.pyModelName
   })
		.then(res => {
			//console.log(res);
	    })
    }


	}

	render(){
    console.log(this.state.output)
		return (
			<div>
				Verify

        <br/>
        <Spin spinning={this.state.loading}>
				<Button onClick={this.handleVerify}> Verify </Button>
        <Console ref="console"
        handler={this.state.output}
        />
				{this.state.output}
        </Spin>
			</div>
		)
	}
}

function insertBlob(blob, name) {
  {
    const reader = new FileReader();
    reader.onload = e => {
        var text = reader.result
        this.setState({ 
        pythonBlob: text,
        pyModelName: name,
         })
        //console.log(this.state)

    }
    
    reader.readAsText(blob)
    
}
  
}

/*export class EchoConsole extends React.Component{
  echo(text) {
    this.refs.console.log(text);
    this.refs.console.return();
  }
  render(){
    return (<Console ref="console"
            handler={this.echo}
            autofocus={true}
            />
            )
  }
}*/