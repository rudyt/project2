
///////// Connect to websocket
//RT1101
//var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

if (localStorage.getItem('username') && localStorage.getItem('channel') ){
    var username = localStorage.getItem('username');
    var channel = localStorage.getItem('channel');
    var ur1 =  location.protocol + '//' + location.hostname + ':' + location.port + '/login?username=' + username + '&channel=' + channel 
    window.location.assign(ur1)
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('form').onsubmit = callchannels;

})

callchannels = () => {

    var channel = 'AllUsers';
    var username = document.querySelector('input').value;

    //username = username.charAt(0).toUpperCase() + username.slice(1,username.length);

    localStorage.setItem('username',username);
    localStorage.setItem('channel',channel);
    //1101
    //socket.emit('user connected',{'username':username,'channel':channel});
    //RT1101
};