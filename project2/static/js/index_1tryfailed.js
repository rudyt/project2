
///////// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

function sendMessage(){
    console.log("called sendMessage");
    var chl = localStorage.getItem('curchnl')
    var message = document.querySelector('#textmsg').value;
    var timestamp = Date();
    var dispnm = localStorage.getItem('displayname')
    //let data = {'message': message},{'dispnm':dispnm},{'timestamp':timestamp},{'channel':chl}
    socket.emit('sendMessage', message,dispnm,timestamp,chl);
    console.log('sent message='+message +'displayname='+dispnm+'timestamp='+timestamp+'channel='+chl );
};

//Channel stuff below
function setChannel(){
    console.log("called setChannel");
    var newchannel = document.querySelector('#chname').value;
    socket.emit('setChannel', {'chName': newchannel});
    console.log('set newchannel='+newchannel);

};

function GoToChannel(ch){
    localStorage.setItem('chnlname', ch);
    localStorage.setItem('curchnl', ch);
    console.log("set onclick of url curchnl= " + ch);
};

var ch;
socket.on('chExists', function(data) {
    document.getElementById('error-container').innerHTML = data;
    document.getElementsByClassName('cruser')[0].style.visibility='hidden';
    document.getElementsByClassName('cruser')[1].style.visibility='hidden';
    document.getElementsByClassName('crchannel')[0].style.visibility='visible';
    document.getElementsByClassName('crchannel')[1].style.visibility='visible';
    });

socket.on('addCh', function(data) {
    console.log("called addCh with data= " + data);
    document.getElementById('error-container').innerHTML="";
    document.querySelector('#displayname').innerHTML="You have successfully added the channel "+data;
    document.querySelector('#chatcontinue').innerHTML="Continue chatting on this channel " +data+ " created below";
    const li = document.createElement('li');
    li.innerHTML = data;
    document.querySelector('#channels').append(li);
    localStorage.setItem('chnlname', data);
    localStorage.setItem('curchnl', data);
    document.getElementsByClassName('cruser')[0].style.visibility='hidden';
    document.getElementsByClassName('cruser')[1].style.visibility='hidden';
    document.getElementsByClassName('crchannel')[0].style.visibility='visible';
    document.getElementsByClassName('crchannel')[1].style.visibility='visible';
});
//User stuff below
function setUsername() {
        console.log("called setUsername");
        var name = document.querySelector('#name').value;
        socket.emit('setUsername', {'userName': name});
    };


    var user;
    socket.on('userExists', function(data) {
        document.getElementById('error-container').innerHTML = data;
        document.getElementsByClassName('cruser')[0].style.visibility='visible';
        document.getElementsByClassName('cruser')[1].style.visibility='visible';
        document.getElementsByClassName('crchannel')[0].style.visibility='hidden';
        document.getElementsByClassName('crchannel')[1].style.visibility='hidden';
    });


    socket.on('addUser', function(data) {
        console.log("called addUser with data= " + data);
        document.getElementById('error-container').innerHTML="";
        document.querySelector('#displayname').innerHTML="Hello "+data;
        localStorage.setItem('displayname', data);
        document.querySelector('#prompt').innerHTML="Create your own channel below.";
        document.querySelector('#chsuggest').innerHTML=" Join a channel by clicking on the link";
        document.getElementsByClassName('cruser')[0].style.visibility='hidden';
        document.getElementsByClassName('cruser')[1].style.visibility='hidden';
        document.getElementsByClassName('crchannel')[0].style.visibility='visible';
        document.getElementsByClassName('crchannel')[1].style.visibility='visible';
    });


document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('#sendmsg')){
            document.querySelector('#sendmsg').disabled = true;
        };
    // Enable button only if there is text in the input field
    if(document.querySelector('#textmsg')){
        document.querySelector('#textmsg').onkeyup = () => {
                if (document.querySelector('#textmsg').value.length > 0)
                    document.querySelector('#sendmsg').disabled = false;
                else
                    document.querySelector('#sendmsg').disabled = true;
                };
    };


    //Check if localstorage already has displayname
    if (localStorage.getItem('displayname') != null) {
       if (document.getElementsByClassName('message')[1]){
           document.getElementsByClassName('message')[0].style.visibility='visible';
           document.getElementsByClassName('message')[1].style.visibility='visible';
       }
       if (document.getElementsByClassName('cruser')[1]){
           document.getElementsByClassName('cruser')[0].style.visibility='hidden';
           document.getElementsByClassName('cruser')[1].style.visibility='hidden';
       }
       if (document.getElementsByClassName('crchannel')[1]){
           document.getElementsByClassName('crchannel')[0].style.visibility='visible';
           document.getElementsByClassName('crchannel')[1].style.visibility='visible';
           var y = localStorage.getItem('displayname');
           document.querySelector('#displayname').innerHTML="Hello Again "+y;
           document.querySelector('#prompt').innerHTML="Create your own channel below.";
       }
    } else {
        document.getElementsByClassName('cruser')[0].style.visibility='visible';
        document.getElementsByClassName('cruser')[1].style.visibility='visible';
        document.getElementsByClassName('crchannel')[0].style.visibility='hidden';
        document.getElementsByClassName('crchannel')[1].style.visibility='hidden';
        document.getElementsByClassName('message')[0].style.display='none';
        document.getElementsByClassName('message')[1].style.display='none';
    }
    
    if(document.querySelector('#chcreate')) {
        document.querySelector('#chcreate').disabled = true;
    }
    // Enable button only if there is text in the input field
    if(document.querySelector('#chname')){
    document.querySelector('#chname').onkeyup = () => {
        if (document.querySelector('#chname').value.length > 0)
            document.querySelector('#chcreate').disabled = false;
        else
            document.querySelector('#chcreate').disabled = true;
        };
    };

    // By default, submit button is disabled
    if(document.querySelector('#uscreate')){
    document.querySelector('#uscreate').disabled = true;
    };
    // Enable button only if there is text in the input field
    if(document.querySelector('#name')){
    document.querySelector('#name').onkeyup = () => {
        if (document.querySelector('#name').value.length > 0)
            document.querySelector('#uscreate').disabled = false;
        else
            document.querySelector('#uscreate').disabled = true;
        };
    };
    // get display name when submit button is clicked
    if(document.querySelector('#cruser')) {
        document.querySelector('#cruser').onsubmit = () => {
            // Update displayname
            var x = document.querySelector('#name').value;
            document.querySelector('#displayname').innerHTML="Hello "+x;
            localStorage.setItem('displayname', x);
            document.getElementsByClassName('message')[0].style.display='none';
            document.getElementsByClassName('message')[1].style.display='none';
            document.querySelector('#prompt').innerHTML="Create your own channel below.";
            document.querySelector('#channels').innerHTML=" Join a channel by clicking on the link";

            document.getElementsByClassName('cruser')[0].style.visibility='hidden';
            document.getElementsByClassName('cruser')[1].style.visibility='hidden';
            document.getElementsByClassName('crchannel')[0].style.visibility='visible';
            document.getElementsByClassName('crchannel')[1].style.visibility='visible';
            document.querySelector('#prompt').innerHTML="Create your own channel by filling in and submitting the.chan below. Or join a channel by clicking on the link";
            // Stop.chan from submitting
            return false;
        }
    };

    ///////// Connect to websocket
//    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
                
    // When a new vote is announced, add to the unordered list
    socket.on('announce newchannel', data => {
        const li = document.createElement('li');
        li.innerHTML = `New Channel: ${data.selection}`; 
        document.querySelector('#channels').append(li);
    }); 
});//////Socket starts below


 

    