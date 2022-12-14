let host = 'cn-beijing.log.aliyuncs.com';
let project = 'zhufengmonitor';
let logstore = 'zhufengmonitor-store';
var userAgent = require('user-agent')

function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name
  };
}

//对xhr的封装
class SendTracker {
  constructor() {
    this.url = `http://${project}.${host}/logstores/${logstore}/track`;
    this.xhr = new XMLHttpRequest();
  }
  send(data = {}, callback) {
    let extraData = getExtraData();
    let logs = { ...extraData, ...data };
    for (let key in logs) {
      if (typeof logs[key] === 'number') {
        logs[key] = "" + logs[key];
      }
    }
    console.log(logs);
    console.log(JSON.stringify(logs, null, 2));
    let body = JSON.stringify({
      __logs__: [logs]
    });
    this.xhr.open("POST", this.url, true);
    this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    this.xhr.setRequestHeader('x-log-apiversion', '0.6.0');
    this.xhr.setRequestHeader('x-log-bodyrawsize', body.length);
    this.xhr.onload = function () {
      if ((this.status >= 200 && this.status <= 300) || this.status == 304) {
        callback && callback();
      }
    }
    this.xhr.onerror = function (error) {
      console.log('error', error);
    }
    this.xhr.send(body);
  }
}

export default new SendTracker();