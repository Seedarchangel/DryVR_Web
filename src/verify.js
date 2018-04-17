import React from 'react';
import io from 'socket.io-client'
import axios from 'axios';
import { Button } from 'antd'


export default class Verify extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			output:"",
			verifyHash:""
		}
		this.handleVerify = this.handleVerify.bind(this)
	}

	componentDidMount(){
		const socket = io('ws://localhost:8080')
		socket.on('foo', function(data){
			if(data.verifyHash == this.state.verifyHash){
				this.setState({
					output:data.output
				})
			}
		}.bind(this))

	}

	handleVerify(){
		const hash = Math.random().toString()
		this.setState({
			verifyHash:hash
		})
		axios.post(`http://localhost:8080/api/verify`, { verifyHash:hash })
		.then(res => {
			console.log(res);
	    })

	}

	render(){
		return (
			<div>
				This is verify component
				<Button onClick={this.handleVerify}> Verify </Button>
				{this.state.output}
			</div>
		)
	}
}