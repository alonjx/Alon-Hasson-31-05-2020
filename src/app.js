import React from 'react'
import MessageStore from './js/stores/MessageStore'
import MessageActions from './js/actions/MessageActions';
import AddWindow from './js/components/AddWindow'
import MessageMenuTab from './js/components/MessageMenuTab'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import "./App.css";


class MessageView extends React.Component {
    render() {
        return <div className="card p-5">
                        <header><h3>{this.props.data.subject}</h3></header>
                        <div className=""><h6>From: {this.props.data.sender}</h6><h6>to: {this.props.data.receiver}</h6></div><br />
                        <div><h5>{this.props.data.content}</h5></div>
                </div>;
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {user_id: "aaa@gmail.com", selected_message: "", message_type: "received", messages: {}, sent_messages: {}, received_messages: {}};
        this.onChangeMessages = this.onChangeMessages.bind(this);
        this.messageTabClick = this.messageTabClick.bind(this);
        this.onRemoveMessage = this.onRemoveMessage.bind(this);
        this.displaySentMessages = this.changeMessageType.bind(this, "sent");
        this.displayReceivedMessages = this.changeMessageType.bind(this, "received");
        this.onMessageAction = this.onMessageAction.bind(this);
    }
    
    onMessageAction() {
        MessageActions.loadData(this.state.user_id);
    }

    onChangeMessages() {
        if (this.state.message_type === "received")
            this.setState({messages: MessageStore.getAllReceived(this.state.user_id), selected_message: ""});
        else 
            this.setState({messages: MessageStore.getAllSent(this.state.user_id), selected_message: ""});
    }

    changeMessageType(t) {
        if (t === "received" && this.state.message_type !== "received") 
            this.setState({selected_message: "", messages: MessageStore.getAllReceived(this.state.user_id), message_type: "received"});
        else if (t === "sent" && this.state.message_type !== "sent") 
            this.setState({selected_message: "", messages: MessageStore.getAllSent(this.state.user_id), message_type: "sent"});
    }

    componentWillUnmount() {
        MessageStore.removeChangeListener("MESSAGES_FETCHED", this.onChangeMessages);
        MessageStore.removeChangeListener("MESSAGE_DELETED", this.onMessageAction);
        MessageStore.removeChangeListener("MESSAGE_SENT", this.onMessageAction);
    }

    componentDidMount() {
        MessageStore.addChangeListener("MESSAGES_FETCHED", this.onChangeMessages);
        MessageStore.addChangeListener("MESSAGE_DELETED", this.onMessageAction);
        MessageStore.addChangeListener("MESSAGE_SENT", this.onMessageAction);
        MessageActions.loadData(this.state.user_id);
    }

    userIdChange(e) {
        this.setState({user_id: e.target.value});
        MessageActions.loadData(e.target.value);

    }
    messageTabClick(i) {
        this.setState({selected_message: i});
    }

    onRemoveMessage(i) {
        MessageActions.removeMessage(i);
    }

    render() {
        const listItems = Object.keys(this.state.messages).map((i) =>
         <MessageMenuTab onClick={this.messageTabClick} onRemove={this.onRemoveMessage} key={i} id={i} data={this.state.messages[i]} />);
        return <div className="wrapper"><ReactNotification />
                    
                    <nav id="sidebar" className="d-flex flex-column">

                        <li className="list-group-item">Who are you? <input type="text" className="form-control" id="userid" onChange={this.userIdChange.bind(this)} value={this.state.user_id} /></li>
                        <div className="list-group list-group-horizontal d-flex">
                          <button id="receivedbtn"  onClick={this.displayReceivedMessages}
                           className={`list-group-item flex-fill rounded-0 ${this.state.message_type === "received" ? 'active' : ''}`}> Received 
                            <span className="badge">{Object.keys(MessageStore.getAllReceived(this.state.user_id)).length}</span>
                          </button>
                          <button href="#" id="sentbtn" onClick={this.displaySentMessages}
                          className={`list-group-item flex-fill rounded-0 ${this.state.message_type === "sent" ? 'active' : ''}`}> Sent 
                            <span className="badge">{Object.keys(MessageStore.getAllSent(this.state.user_id)).length}</span>
                          </button>
                        </div>
                        {listItems} 
                        
                    </nav>
                <div className="content">
                    {this.state.selected_message ? <MessageView data={this.state.messages[this.state.selected_message]} /> : <div className="banner">Simple Message</div>}
                    <AddWindow sender={this.state.user_id}/>
                </div>
            </div>;
    }
}

export default App;