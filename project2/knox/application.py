import os

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

MAXSIZE=100
#channellist is formatted as list of lists with each list item as [channel,[msg,displayname,timestamp]]
chnlsdictoflists={"techsupport":["Type your question here","admin","0000-00-00 00:00:00"]}
users=["root","admin"]

@app.route("/")
def signin():
    return render_template("signin.html",channelsdict=chnlsdictoflists)

@app.route("/<channel>")
def viewchannel(channel):
    print('channel= '+str(channel))
    return render_template("channel.html",channel=chnlsdictoflists[channel])

@socketio.on("sendMessage")
def newMsg(data):
	msg=data["message"]
	displayname=data["displayname"]
	timestamp=data["timestamp"]
	channel=data["channel"]
	msglist = chnlsdictoflists[channel]
	if len(msglist)==100:
		chnlsdictoflists[channel].pop(0)
	newchatentry = [msg,displayname,timestamp]
	chnlsdictoflists[channel].append(newchatentry)
	emit('newMessage',channel,msg,displayname,timestamp,broadcast=True)

@socketio.on("setUsername")
def newUser(data):
	user = data["userName"]
	if user in users:
		emit("userExists", user + ' username is taken! Try some other username.')
		print('tried to use existing username ' + user)
	else:
		users.append(user)
		emit('addUser',user)
		emit('userAdded',user,broadcast=True)
		print('added username ' + user)
		print('users= '+str(users))

@socketio.on("setChannel")
def newCh(data):
	ch = data["chName"]
	chdictitem={ch:[None,None,None]}
	print('ch= '+str(ch))
	print('chdictitem= '+str(chdictitem))
	if ch in chnlsdictoflists.keys():
		emit("chExists", ch + ' channel is taken! Try some other channel name.')
		print('tried to use existing channel name ' + ch)
	else:
		chnlsdictoflists.update(chdictitem)
		emit('addCh',ch)
		emit('chAdded',ch,broadcast=True)
		print('added channel ' + ch)
		print('chnlsdictoflists= '+str(chnlsdictoflists))
