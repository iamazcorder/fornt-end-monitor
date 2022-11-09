import tracker from '../util/tracker';
import onload from '../util/onload';
// - 埋点方案

// 1. 垂直埋点
// 2. 交叉埋点 
// 3. 交叉垂直埋点

// - 如何埋点

// 1. **document对象有一个elementFromPoint方法**能够获取到当前视口内指定坐标处，由里到外排列的所有元素
// 2. **x轴取十个坐标点 y轴取十个坐标点** 将每个坐标点传入这个函数，得到的返回值都是一个数组，
// 3. **查看数组第一个元素**，如果这个元素是**body或者html**则说明当前这个**这个坐标点还没渲染出**来，
// 4. 则变量emptyPoints加一，当统计完成之后，**如果空的坐标点的个数emptyPoints****,**等于我们所埋的点的个数******，则说明白屏了，
// 5. 则进行数据上报，以便分析白屏原因

// - 什么时候埋点

// 1. 在发送请求之后
// 2. 监听document.readyState
// 3. dom加载完成之后
// 4. 监听window.load事件

// - 白屏就是页面上什么都没有

function getSelector(element) {
    var selector;
    if (element.id) {
        selector = `#${element.id}`;
    } else if (element.className && typeof element.className === 'string') {
        selector = '.' + element.className.split(' ').filter(function (item) { return !!item }).join('.');
    } else {
        selector = element.nodeName.toLowerCase();
    }
    return selector;
}
export function blankScreen() {
    const wrapperSelectors = ['body', 'html', '#container', '.content'];
    let emptyPoints = 0;
    function isWrapper(element) {
        let selector = getSelector(element);
        if (wrapperSelectors.indexOf(selector) >= 0) {
            emptyPoints++;
        }
    }
    onload(function () {
        let xElements, yElements;
        for (let i = 1; i <= 9; i++) {
            xElements = document.elementsFromPoint(window.innerWidth * i / 10, window.innerHeight / 2)
            yElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight * i / 10)
            isWrapper(xElements[0]);
            isWrapper(yElements[0]);
        }
        if (emptyPoints >= 0) {
            let centerElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2)
            tracker.send({
                kind: 'stability',
                type: 'blank',
                emptyPoints: "" + emptyPoints,
                screen: window.screen.width + "x" + window.screen.height,
                viewPoint: window.innerWidth + 'x' + window.innerHeight,
                selector: getSelector(centerElements[0]),
            })
        }
    });
}
//screen.width  屏幕的宽度   screen.height 屏幕的高度
//window.innerWidth 去除工具条与滚动条的窗口宽度 window.innerHeight 去除工具条与滚动条的窗口高度