import tracker from '../util/tracker';
import formatTime from '../util/formatTime';
import getLastEvent from '../util/getLastEvent';
import getSelector from '../util/getSelector';

//PerformanceObserver
//requestIdleCallback 回调的执行的前提条件是当前浏览器处于空闲状态  批量发送
export function longTask() {
    new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
            if (entry.duration > 100) {
                let lastEvent = getLastEvent();
                requestIdleCallback(() => {
                    tracker.send({
                        kind: 'experience',
                        type: 'longTask',
                        eventType: lastEvent.type,
                        startTime: formatTime(entry.startTime),// 开始时间
                        duration: formatTime(entry.duration),// 持续时间
                        selector: lastEvent ? getSelector(lastEvent.path || lastEvent.target) : ''
                    });
                });
            }
        });
    }).observe({ entryTypes: ["longtask"] });
}