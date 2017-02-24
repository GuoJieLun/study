window.onload = function () {
    var hichat = new HiChat();
    hichat.init();
};


var HiChat = function () {
    this.socket = null;
};

HiChat.prototype = {
    init: function () {
        var self = this;
        self.info = document.getElementById('info');
        self.nickWrap = document.getElementById('nickWrap');
        self.nickName = document.getElementById('nickName');
        self.nickBtn = document.getElementById('nickBtn');
        self.loginWrap = document.getElementById('loginWrap');
        self.messageInput = document.getElementById('messageInput');
        self.chatWindow  = document.getElementById('chatWindow');
        self.status = document.getElementById('status');
        self.sendBtn = document.getElementById('sendBtn');

        self._socketEven();
        self.nickBtn.addEventListener('click', function () {
            var val = self.nickName.value;
            if (!!val) {
                self.socket.emit('login', val);
            } else {
                self.nickName.focus();
            }
        }, false);

        self.sendBtn.addEventListener('click',function(){
                var msg = self.messageInput.value;
                self.messageInput.value = '';
                self.messageInput.focus();
                if(!!msg){
                    self.socket.emit('postMsg',msg);
                    self._displayNewMsg('我',msg);
                }
        },false)
    },
    _socketEven:function(){
        var self = this;
        this.socket = io.connect();
        this.socket.on('connect', function () {
            self.info.textContent = '请输入你的名称';
            self.nickWrap.style.display = 'block';
            self.nickBtn.focus();
        });
        this.socket.on('nickExisted', function () {
            self.info.textContent = '昵称已被使用,请重新输入';
        });
        this.socket.on('loginSuccess', function () {
            self.loginWrap.style.display = 'none';
            self.messageInput.focus();
        });
        this.socket.on('system', function (nickname, num, type) {
            var msg = nickname + (type == 'login' ? '进入' : '离开');
            self._displayNewMsg('系统提示:',msg,'red');
            self.status.textContent = num;
        });
        this.socket.on('newMsg',function(name,msg){
            self._displayNewMsg(name,msg);
        });
    },
    _displayNewMsg:function(user,msg,color){
        var self = this;
        var msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0,8);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
        self.chatWindow.appendChild(msgToDisplay);
        self.chatWindow.scrollTop = self.chatWindow.scrollHeight;
    }
};

