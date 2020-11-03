
///////// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener('DOMContentLoaded', () => {
    var template = Handlebars.compile(document.querySelector('#chatscript').innerHTML)

    clearText = () => {
        document.querySelector('h5').innerHTML = '';
    }
    var clsText = setTimeout(clearText,5000);
    Handlebars.registerHelper('if_equal',function(a,b,options) {
        if (a === b){
            // alert('check users ' + a + ' ' + b );
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

document.querySelector('#uploadForm').onsubmit = () =>{
        document.querySelector('#uploadUser').value = localStorage.getItem('username');
        document.querySelector('#uploadChannel').value = localStorage.getItem('channel');
}

document.querySelectorAll('.channel').forEach( channel => {
        channel.onclick = () => {
            document.querySelector('#chatbox').innerHTML = '';
            document.querySelector('#channelname').innerHTML = channel.dataset.channel;
            document.querySelector('#formchannel').style.display = 'none';
            //document.querySelector('.container').className = "container x-open-sidebar";
            localStorage.setItem('channel',channel.dataset.channel);
            load_msg(channel.dataset.channel);
            return false;
        }
    });

    delmsg = () => {
        document.querySelectorAll('.del-btn').forEach(icon => {
            icon.onclick = function() {
                let data = {
                    'channel' : localStorage.getItem('channel'),
                    'username' : localStorage.getItem('username'),
                    'msg' : this.parentElement.querySelector('.msg').innerHTML,
                    'time' : this.parentElement.querySelector('.time-stamp').innerHTML
                }
        
                socket.emit('del-msg',data);
                
                this.parentElement.remove();
            }
        })

    }

    load_msg = (channel) => {

        var req = new XMLHttpRequest();

        req.open('GET',`/getmsg/${channel}`)

        req.onload = () => {
            var resp = JSON.parse(req.responseText);
            var content = template({'msgs':resp.msgs,'username':localStorage.getItem('username')});
            document.querySelector('#chatbox').innerHTML += content;
            document.querySelector('#chatbox').scrollTop = document.querySelector('#chatbox').scrollHeight;
            delmsg();
            //pvtChat();
        }

        req.send();
    }
    
    load_msg(localStorage.getItem('channel'));


document.querySelector('#newChannelSubmit').onclick = () => {
        let newChannelName = document.querySelector('#newChannelName').value;
        if (newChannelName != ''){
            localStorage.setItem('channel',newChannelName);
        }
    }

socket.on('del-msg done',(msg) => {
        if (localStorage.getItem('channel') == msg.channel ){
            document.querySelectorAll('.messages').forEach(msgDiv => {
                if (msgDiv.querySelector('.time-stamp').innerHTML == msg.time && msgDiv.querySelector('.msg').innerHTML == msg.msg && msgDiv.querySelector('.chatbubbleUserName').innerHTML == msg.user ){
                    msgDiv.remove();
                }
            });
        }
    });
    
});