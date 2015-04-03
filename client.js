var SockJS = require('sockjs-client');
var vkey   = require('vkey');

var messages = document.querySelector('.messages');
var topic    = document.querySelector('.topic');
var input    = document.querySelector('input');

var isImg = false;

var sock = new SockJS('http://192.168.1.79:9999/chat');

sock.onmessage = function(ev) {
  var obj = JSON.parse(ev.data);

  if (obj.type === 'emote') {
    obj.user = ' * ';
  }

  if (obj.topic) {
    topic.innerText = topic.innerText.split(':')[0] + ': '+obj.topic;
  }

  if (obj.msg.indexOf('/bg') === 0) {
    document.body.style.background = "url(" + obj.msg.slice(4) + ")";
  } else if (!!~obj.msg.indexOf('.png')  ||
             !!~obj.msg.indexOf('.jpeg') ||
             !!~obj.msg.indexOf('.jpg')) {
    isImg = true;
  }

  var li = document.createElement('li');
  li.className = 'bb b--lightest-pink msg';

  var strong = document.createElement('strong');
  strong.innerText = obj.user + ' :';
  li.appendChild(strong);

  var p = document.createElement('p');
  p.className = obj.type !== 'chat' ? 'bg-lightest-teal' : '';
  p.innerText = obj.msg;
  li.appendChild(p);

  if (isImg) {
    var img = document.createElement('img');
    img.src = obj.msg;
    li.appendChild(img);
    isImg = false;
  }

  messages.appendChild(li);
  li.scrollIntoViewIfNeeded();
};

document.body.addEventListener('keydown', function(ev) {
  if (vkey[ev.keyCode].toLowerCase() === '<enter>') {
    sock.send(input.value);
    input.value = '';
  }
}, false);