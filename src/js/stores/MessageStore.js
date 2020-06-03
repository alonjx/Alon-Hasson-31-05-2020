import AppDispatcher from '../dispatcher/AppDispatcher'
import {store} from 'react-notifications-component'
var EventEmitter = require('events').EventEmitter;

class MessageStore extends EventEmitter {
    constructor() {
        super();
        this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this));
    }
    emitChange(eventName) {
        this.emit(eventName);
    }

	getAll() {
	    return this.messages;
	}

	getAllReceived(user_id) {
        var filtered = {};

        if (this.messages) {
    		Object.filter = (obj, predicate) => 
                      Object.fromEntries(Object.entries(obj).filter(predicate));
            filtered = Object.filter(this.messages, ([name, obj]) => obj.receiver === user_id); 
        }
		return filtered;
	}

	getAllSent(user_id) {
        var filtered = {};
        if (this.messages) {
    		Object.filter = (obj, predicate) => 
                      Object.fromEntries(Object.entries(obj).filter(predicate));
            filtered = Object.filter(this.messages, ([name, obj]) => obj.sender === user_id); 
        }
		return filtered;
	}

	dispatcherCallback(action) {
        switch (action.type) {
            case "MESSAGES_FETCHED":
            	this.messages = action.messages;
        		break;
            case "NOTIFICATION":
                this.handleNotification(action.variant, action.content);
                break;
        	default:
        		break;
        }

		this.emitChange(action.type);

        return true;
    }

    addChangeListener(eventName, callback) {
        this.on(eventName, callback);
    }
 
    removeChangeListener(eventName, callback) {
        this.removeListener(eventName, callback);
    }

    handleNotification(variant, content) {
        store.addNotification({
              message: content,
              type: variant,
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 2500,
              }
        });
    }
 
}
export default new MessageStore();