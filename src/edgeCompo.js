import 'antd/dist/antd.css';
import { Button, Icon ,Input} from 'antd';
import Graph from "react-graph-vis";
import randomColor from "randomcolor"
import React from 'react';



export default class EdgeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
            name: '',
            vertex: [{ name: ''}],
            edge: [{ name: '' }],
            guard: [{ name: '' }],
            reset: [{ name: '' }]

    };
    this.creategraph = this.creategraph.bind(this)
    this.createoptions = this.createoptions.bind(this)
    this.createevents = this.createevents.bind(this)
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
      var arr = oneEdge.name.split(",");
      edgeArray.push(
        {key:idx, from: arr[0], to: arr[1], label: "Guard: "+this.state.guard[idx].name+"\n"+"Reset: "+this.state.reset[idx].name}
      )
    })
    var graph = {
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
    const newShareholders = this.state.guard.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, name: evt.target.value };
    });

    this.setState({ guard: newShareholders });
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
      guard: this.state.guard.concat([{ name: '' }]),
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
      guard: this.state.guard.filter((s, sidx) => idx !== sidx),
      reset: this.state.reset.filter((s, sidx) => idx !== sidx),
    });
  }

  handleRemoveVertex = (idx) => () => {
    this.setState({
      vertex: this.state.vertex.filter((s, sidx) => idx !== sidx),
    });
  }

  render() {
    return (
      <div>
        {/* ... */}
              <div>
        {/* ... */}
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
        {this.state.guard.map((shareholder, idx) => (
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
      <Graph graph={this.creategraph()} options={this.createoptions()} events={this.createevents()} style={{ height: "300px", width: "500"}} />
      </div>
    )
  }
}