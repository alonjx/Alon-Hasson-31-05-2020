import AppDispatcher from '../dispatcher/AppDispatcher';

import $ from 'jquery';

class MessageActions {

	sendMessage(sender, receiver, subject, content) {
		$.ajax({
			type:    "POST",
			dataType: "json",
			url:     "/send",
			data:    { "sender": sender, "receiver" : receiver, "subject": subject, "content": content},
			success: function(response) {
		    	if (response === "done")
		    	{
		        	AppDispatcher.dispatch({type: "MESSAGE_SENT"});
		    		AppDispatcher.dispatch({type:"NOTIFICATION", variant: "success", content: "Message Sent!"});
		    	}

		        else
		        	AppDispatcher.dispatch({ type: "danger", value: "Error: " + response.responseText });
		       },
			error: function(jqXHR, textStatus, errorThrown) {
			    alert("Error, status = " + textStatus + ", " +
				    "error thrown: " + errorThrown
				);
			}
		});
	}

    removeMessage(id)
    {
		$.ajax({
			type:    "POST",
			dataType: "json",
			url:     "/delete",
			data:    {"message_id": id},
			success: function(response) {
		    	if (response === "done") {
		        	AppDispatcher.dispatch({type: "MESSAGE_DELETED"});
		        	AppDispatcher.dispatch({type:"NOTIFICATION", variant: "success", content: "Message deleted!"});
		        }
		        else
		        	AppDispatcher.dispatch({type:"NOTIFICATION", variant: "danger", content: "Error: " + response});
		   	},
			error: function(jqXHR, textStatus, errorThrown) {
			    alert("Error, status = " + textStatus + ", " +
				    "error thrown: " + errorThrown
				);
			}
		});

    }

    loadData(user_id) {
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/messages",
			data: {user_id:user_id},
			success: function(response) {
				AppDispatcher.dispatch({ type: "MESSAGES_FETCHED", messages: response });
			},
			error: function(jqXHR, textStatus, errorThrown) {
			    alert("Error, status = " + textStatus + ", " +
				    "error thrown: " + errorThrown
				);
			}
		});
	}
}

  

export default new MessageActions()