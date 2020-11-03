import os,time

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

MAXSIZE=100

#chgtellist is formatted as list of lists with each list item as [channel,[msg,displayname,timestamp]]
chnlsdictoflists={"techsupport":["Type your question here","admin","0000-00-00 00:00:00"]}
channels = ['AllUsers','help']
#channels = ['techsupport',soccer','swim',tennis]
#users=["root","admin"]
users={"root","admin"}
#messages is  implemented as dictionary(messages) of list(channels) of dictionaries(user:user,msg:msg,time:time)
messages ={
#	'soccer':[
#     {'user':'root','msg':'kickoff','time':'0'},
#     {'user':'admin','msg':'final whistle','time':'90'}
#     ],
#     'tennis':[
#     {'user':'admin','msg':'start','time':'5'}
#     ],
     'AllUsers':[
     {'user':'admin','msg':'Welcome to Flack','time':'0'}
    ]
}

@app.route("/")
def index():
    return render_template("login.html")


@app.route('/login', methods=['POST','GET'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        channel = 'AllUsers'
        print ("in post")
        return render_template("login.html")       
    else:
        username = request.args.get('username')
        channel = request.args.get('channel')
        return loadpage(username,channel,text1='Loggedin Successfully')

@app.route('/createchannel', methods=['POST'])
def createchannel():
    newchannel = request.form.get('newchannel')
    username = request.form.get('username')
    if newchannel in channels:
        text1 = "Channel already exists"
    else:
        channels.append(newchannel)
        messages[newchannel] = []
        text1 = "Channel Added Successfully"
    return loadpage(username,newchannel,text1)

def loadpage(username,channel,text1=''):
    return render_template('index.html',channels=channels,channel=channel,user=username,text1=text1)


@app.route('/getmsg/<string:channel>',methods=['GET'])
def getmsg(channel):
    try:
        msgs = messages[channel]
    except KeyError:
        pass
    return jsonify({'msgs':msgs})

    
@app.route('/uploader',methods=['POST'])
def uploader():
    f = request.files['file']
    f.save(os.path.join('uploads/',f.filename))
    user = request.form.get('user')
    channel = request.form.get('channel')
    filePath = 'uploads/' + f.filename
    filelink = filePath + f.filename
    print("request="+str(request))
    msg = {'user':user,'msg':filelink,'time':time.ctime()}
    print("msg=" + str(msg))
    print("channel=" + channel)
    print("messages=" + str(messages))
    messages[channel].append(msg)
    text1 = 'File Uploaded Succesfully'
    return loadpage(user,channel,text1)


@app.route('/sendmessage',methods=['POST'])
def sendmessage():
    user = request.form.get('user')
    channel = request.form.get('channel')
    message = request.form.get('msgText')
    print("request="+str(request))
    msg = {'user':user,'msg':message,'time':time.ctime()}
    print("msg=" + str(msg))
    print("channel=" + channel)
    print("messages=" + str(messages))
    messages[channel].append(msg)
    text1 = 'Message sent Succesfully'
    return loadpage(user,channel,text1)



app.run(host='127.0.0.1', port=5000)