# 异常监控

## [js错误]

### **window.onerror** 通过事件对象获取错误信息，比如**e.message** , **e.filename**

## [资源加载错误]

### **window.onerror** 先判断 **e.target && e.target.src || e.target.href** 如果没有才是脚本内容出错

### **e.target.tagName** 获取出错元素

## [promise错误]

### 监听**unhandlerRejection**事件

### 通过**e.reason / e.reason.meaasge**获取错误信息 获取错误所在位置（行，列）

## [接口异常]

### 重写 XMLHttpRequest 构造函数的原型对象的 open 方法和 send 方法

#### **window.XMLHttpRequest.prototype.open**

#### **window.XMLHttpRequest.prototype.send**

### 在 open 方法中收集请求信息

### 在 send 方法中监听 xhr 实例的 **load error abort**事件

### 他们使用同一个回调函数，接收的参数是监听的事件类型，根据不同的事件类型上传不同的请求信息

### 上传信息包括请求持续时间，事件类型，接口地址等等

# 业务监控

## [pv用户停留时间]

### **使用 navigator.connection 获取用户登录网站之后的连接信息**，比如 effectiveType 4g 5g

### **rtt**：往返时间 表示从发送端发送数据开始，到发送端收到来自接收端的确认

### 记录用户访问页面的时间点

### 然后监听**unload**事件

### 在回调中获取当前时间，然后去减掉用户访问页面的时间点得到**用户在这个页面的停留时间**

# 性能监控

## [监控白屏]

### 1. **document 对象有一个 elementFromPoint 方法**能够获取到当前视口内指定坐标处，由里到外排列的所有元素

### 2. **x 轴取十个坐标点 y 轴取十个坐标点** 将每个坐标点传入这个函数，得到的返回值都是一个数组，

### 3. **查看数组第一个元素**，如果这个元素是**body 或者 html**则说明当前这个**这个坐标点还没渲染出**来，

### 4. 则变量 emptyPoints 加一，当统计完成之后，**如果空的坐标点的个数 emptyPoints**,**等于我们所埋的点的个 ### 数**，则说明白屏了，

### 5. 则进行数据上报，以便分析白屏原因

## [监控性能指标]
### **PerformanceObserver** FP FCP LCP FID
```js
//FP
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName("first-paint")) {
    console.log("fp", entry); //entry为一个对象
    // fp PerformancePaintTiming
    // {
    //   name: 'first-paint',
    //   entryType: 'paint',
    //   startTime: 445.5,
    //   duration: 0
    // }
  }
}).observe({ type: "paint", buffered: true });
```
### **NavigationTiming**
```js
{
      // 关键时间点
      FP: responseEnd - fetchStart,
      TTI: domInteractive - fetchStart,
      DomReady: domContentLoadedEventEnd - fetchStart,
      Load: loadEventStart - fetchStart,
      FirstByte: responseStart - domainLookupStart,
      // 关键时间段
      DNS: domainLookupEnd - domainLookupStart,
      TCP: connectEnd - connectStart,
      SSL: secureConnectionStart ? connectEnd - secureConnectionStart : 0,
      TTFB: responseStart - requestStart,
      Trans: responseEnd - responseStart,
      DomParse: domInteractive - responseEnd,
      Res: loadEventStart - domContentLoadedEventEnd,
}
```

## [监控卡顿]
### 1. p = new PerformanceObserver((list)=>{})
### 2. p.observe({entryType:['longtask']})
### 3. 使用 requestIdleCallback 进行数据上报
```js
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.duration > 100) {
      let lastEvent = getLastEvent();
      requestIdleCallback(() => {
        tracker.send({
          kind: "experience",
          type: "longTask",
          eventType: lastEvent.type,
          startTime: formatTime(entry.startTime), // 开始时间
          duration: formatTime(entry.duration), // 持续时间
          selector: lastEvent
            ? getSelector(lastEvent.path || lastEvent.target)
            : "",
        });
      });
    }
  });
}).observe({ entryTypes: ["longtask"] });
```
