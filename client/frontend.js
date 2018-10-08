
$(document).ready(function () {

    // for better performance - to avoid searching in DOM
    var content = $('#content');
    let input = $('#input');
    var status = $('#status');

    // my name sent to the server
    let myName = "";

    // open connection
    let socket = io.connect();

    socket.on('connect', function () {
        // first we want users to enter their names
        console.log('connected');
        input.removeAttr('disabled');
        status.text('Choose name:');
    });
    socket.on('disconnect', function () {
        console.log('disconnected')
    });

    socket.on('error', function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                + 'connection or the server is down.' } ));
    });

    socket.on('new_message', function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.

        try {
            var json = JSON.parse(message);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', e);
            return;
        }
        // from now user can start sending messages
        if (json.type === 'history') { // entire message history
            // insert every single message to the chat window
            for (let i=0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text, new Date(json.data[i].time));
            }

        } else if (json.type === 'message') { // it's a single message
            input.removeAttr('disabled'); // let the user write another message
            addMessage(json.data.author, json.data.text, new Date(json.data.time));

        } else {
            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        }
    });

     //Send message when user presses Enter key

    input.keydown(function(e) {
        if (e.keyCode === 13) {
            let msg = $(this).val();
            if (!msg) {
                return;
            }
            if (myName === "") {
                // send the message as an ordinary text
                socket.emit('user_name', { clientMsg: msg});
                myName = msg;
            } else {
                socket.emit('message', { clientMsg: msg, userName: myName});
            }
            $(this).val('');
            status.text('Enter message:');
        }
    });


    function addMessage(author, message, dt) {
        content.prepend(author + '</span> @ ' +
            + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
            + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
            + ': ' + message + '</p>');
    }
});