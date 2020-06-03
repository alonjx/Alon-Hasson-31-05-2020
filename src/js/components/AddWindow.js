import React from 'react'
import MessageActions from '../actions/MessageActions';
import MessageStore from '../stores/MessageStore'
import {Modal, Button} from "react-bootstrap"

class AddWindow extends React.Component {

	constructor() {
		super();
		this.handleClose = () => this.setState({show: false});
		this.handleShow = () => this.setState({show: true});
		this.state = {receiver:"", subject:"", content:"", show:false, error: ""};
		this.handleChange = this.handleChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.cleanForm = this.cleanForm.bind(this);
	}
	onSubmit(e) {
		e.preventDefault();
		if (this.state.receiver === "")
			this.setState({error:"Receiver ID must not be empty"})
		else if (this.state.subject === "")
			this.setState({error:"Subject must not be empty"})
		else if (this.state.content.length < 5)
			this.setState({error:"Message content must contain at least 5 chars"})
		else
			MessageActions.sendMessage(this.props.sender, this.state.receiver, this.state.subject, this.state.content);

	}
	cleanForm() {
		this.handleClose();
		this.setState({receiver:"", subject:"", content:"", error:""});
	}
	handleChange(e) {
		this.setState({[e.target.id]: e.target.value})
	}

    componentDidMount() {
        MessageStore.addChangeListener("MESSAGE_SENT", this.cleanForm);
    }

	render() {
		return <div>
			<div className="fa fa-plus-circle fa-4x" variant="primary" onClick={this.handleShow}></div>
			<Modal show={this.state.show} onHide={this.handleClose}>
				<Modal.Header closeButton>
				<Modal.Title>New Message</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<input type="text" onChange={this.handleChange} maxlength="16" id="receiver" className="form-control mb-3" placeholder="Receiver ID" value={this.state.receiver} />
						<input type="text" onChange={this.handleChange} maxlength="30" id="subject" className="form-control mb-3" placeholder="Subject" value={this.state.subject} />
						<textarea className="form-control mb-3"  onChange={this.handleChange} id="content" value={this.state.content} placeholder="Message content..." id="content"></textarea>
					</form>
					<div className="float-left text-danger">{this.state.error && "* " +this.state.error }</div>

				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={this.handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={this.onSubmit}>
						Send
					</Button>

				</Modal.Footer>
			</Modal>
		</div>;
	}

}

export default AddWindow;