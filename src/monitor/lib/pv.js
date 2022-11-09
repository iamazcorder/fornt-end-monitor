import tracker from '../util/tracker';

// **使用navigator.connection获取用户登录网站之后的连接信息**，比如effectiveType 4g 5g

// rtt：往返时间 表示从发送端发送数据开始，到发送端收到来自接收端的确认

// 然后监听unload事件

// 在回调中获取当前时间，然后去减掉用户访问页面的时间点得到**用户在这个页面的停留时间**

export function pv() {
  var connection = navigator.connection;
  tracker.send({
    kind: 'business',
    type: 'pv',
    effectiveType: connection.effectiveType, //网络环境
    rtt: connection.rtt,//往返时间
    screen: `${window.screen.width}x${window.screen.height}`//设备分辨率
  });
  let startTime = Date.now();
  window.addEventListener('unload', () => {
    let stayTime = Date.now() - startTime;
    tracker.send({
      kind: 'business',
      type: 'stayTime',
      stayTime
    });
  }, false);
}