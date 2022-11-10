import onload from '../util/onload';
import tracker from '../util/tracker';

export function timing() {
  onload(function () {
    setTimeout(() => {
      const {
        fetchStart,
        connectStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        domLoading,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart } = performance.timing;
      tracker.send({
        kind: 'experience',
        type: 'timing',
        connectTime: connectEnd - connectStart,//TCP连接耗时
        ttfbTime: responseStart - requestStart,//ttfb
        responseTime: responseEnd - responseStart,//Response响应耗时
        parseDOMTime: loadEventStart - domLoading,//DOM解析渲染耗时
        domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,//DOMContentLoaded事件回调耗时
        timeToInteractive: domInteractive - fetchStart,//首次可交互时间
        loadTime: loadEventStart - fetchStart//完整的加载时间
      });

    }, 3000);
  });
}


//PerformanceObserver

let timing =
  // W3C Level2  PerformanceNavigationTiming
  // 使用了High-Resolution Time，时间精度可以达毫秒的小数点好几位。
  performance.getEntriesByType('navigation').length > 0
    ? performance.getEntriesByType('navigation')[0]
    : performance.timing; // W3C Level1  (目前兼容性高，仍然可使用，未来可能被废弃)。



//FP
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName('first-paint')) {
    console.log('fp', entry);  //entry为一个对象 
    // fp PerformancePaintTiming 
    // {
    //   name: 'first-paint',
    //   entryType: 'paint',
    //   startTime: 445.5,
    //   duration: 0
    // }
  }
}).observe({ type: 'paint', buffered: true });

//FCP
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
    console.log('fcp', entry);
  }
}).observe({ type: 'paint', buffered: true });

//LC
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const entry = entries[entries.length - 1];
  console.log('lcp', entry);
}).observe({ type: 'largest-contentful-paint', buffered: true });

//FID
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const entry = entries[entries.length - 1];
  const delay = entry.processingStart - entry.startTime;  //开始响应的时间-开始操作时间
  console.log('FID:', delay, entry);
}).observe({ type: 'first-input', buffered: true });


//navigationTiming
// 获取 NT
const getNavigationTiming = () => {
  const resolveNavigationTiming = (entry) => {
    const {
      domainLookupStart,
      domainLookupEnd,
      connectStart,
      connectEnd,
      secureConnectionStart,
      requestStart,
      responseStart,
      responseEnd,
      domInteractive,
      domContentLoadedEventEnd,
      loadEventStart,
      fetchStart,
    } = entry;  //navigation对象

    return {
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
    };
  };

  const navigation =
    // W3C Level2  PerformanceNavigationTiming
    // 使用了High-Resolution Time，时间精度可以达毫秒的小数点好几位。
    performance.getEntriesByType('navigation').length > 0
      ? performance.getEntriesByType('navigation')[0]
      : performance.timing; // W3C Level1  (目前兼容性高，仍然可使用，未来可能被废弃)。
  
  
  return resolveNavigationTiming(navigation);
};

