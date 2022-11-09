import { injectJsError } from './lib/jsError'  //监控错误
import { injectXHR } from './lib/xhr';  //监控接口异常
import { blankScreen } from './lib/blankScreen'; //监控白屏
import { timing } from './lib/timing'; //监控性能指标
import { longTask } from './lib/longTask'; //监控页面卡顿
import { pv } from './lib/pv'; //业务监控 监控用户在页面的停留时间

injectJsError();
injectXHR();
blankScreen();
timing();
longTask();
pv();
// pv();