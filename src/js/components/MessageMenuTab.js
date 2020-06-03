import React from 'react'
import {Modal, Button} from "react-bootstrap"



class MessageMenuTab extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onRemoveConfirm = this.onRemoveConfirm.bind(this);
        this.state = {show: false};
        this.handleClose = () => this.setState({show: false});
		this.handleShow = () => this.setState({show: true});
    }

    onClick() {
        this.props.onClick(this.props.id);
    }
    onRemoveConfirm() {
    	this.props.onRemove(this.props.id);
    }
    render() {
        return <li className="list-group-item message-tab" onClick={this.onClick}>
					<Modal show={this.state.show} onHide={this.handleClose} size="sm">
						<Modal.Header closeButton>
						<Modal.Title>Are you sure?</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Button variant="secondary" onClick={this.handleClose} >
								Cancel
							</Button>{' '}
							<Button variant="primary" onClick={this.onRemoveConfirm}>
								Yes
							</Button>
						</Modal.Body>
					</Modal>
	            <div className="data p-2">
	                {this.props.data.subject}
	                <div className="date">{this.props.data.creation_date}</div>
	            </div>
           		<div className="icon"><i className="fa fa-remove" onClick={this.handleShow}></i></div>
        </li>
    }
}

export default MessageMenuTab;