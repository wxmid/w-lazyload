export function scroll(container, distance, direction, callback) { // dom: 滚动容器，distance：距离滚动方向距离，direction：滚动方向（'top'、 'bottom'、 'left'、 'right',默认bottom）
    // 初始化调用一次
    // callback(true)
    // 距离底部距离 = 滚动内容高度 - 滚动条距离上面的距离 - 滚动条的高度
    let containerRect
    let listenerContainer = container
    if ([window, document, document.documentElement, null, undefined, ''].includes(container)) {
        containerRect = {
            top: 0,
            right: window.innerWidth,
            bottom: window.innerHeight,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
        };
        listenerContainer = window
        container = document.documentElement || document.body
    } else {
        containerRect = container.getBoundingClientRect()
    }
    // bool变量, 用于阻止滚动到底部连续触发多次
    let isBottom = false
    let result
    listenerContainer.addEventListener('scroll', (e) => {
        // 避免内存泄漏 直接使用container可能会导致内存泄漏
        switch (direction) {
            case 'top':
                result = container.scrollTop <= distance
                break
            case 'bottom':
                result = container.scrollHeight - containerRect.height - container.scrollTop <= distance
                break
            case 'left':
                result = container.scrollLeft <= distance
                break
            case 'right':
                result = container.scrollWidth - containerRect.width - container.scrollLeft <= distance
                break
            default:
                result = container.scrollHeight - containerRect.height - container.scrollTop <= distance
                break
        }
        // 检测滚动条高度变化判断是否再次触发加载(此方法只适用加载模块无渲染判断条件情况，若有隐藏不渲染条件，特殊情况如新加载的数据全部隐藏会导致后续不会再返回触发，再如网络不好导致请求无响应)
        // 所以此处不检测滚动条高度直接判断
        if (result) {
            if (isBottom) {
                isBottom = false
                callback(true)
            }
        } else {
            isBottom = true
        }
    })
}
// 图片懒加载 首屏自动加载，适用于上下左右滑动懒加载，container：懒加载容器，threshold：懒加载容器扩展阈值单位像素
export function lazyLoad(container, threshold) {
    threshold = Number(threshold) || 0
    let containerRect
    let listenerContainer = container
    if ([window, document, document.documentElement, null, undefined, ''].includes(container)) {
        containerRect = {
            top: 0,
            right: window.innerWidth,
            bottom: window.innerHeight,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
        };
        listenerContainer = window
        container = document.documentElement || document.body
    } else {
        containerRect = container.getBoundingClientRect()
    }
    const visible = (dom) => {
        let ptop = containerRect.top
        let pleft = containerRect.left
        let ph = containerRect.height
        let pw = containerRect.width

        let top = dom.getBoundingClientRect().top
        let left = dom.getBoundingClientRect().left
        let h = dom.offsetHeight
        let w = dom.offsetWidth

        if ((top < (ptop + ph + threshold) && (top + h + threshold) > ptop) && (left < (pleft + pw + threshold) && (left +w + threshold) > pleft)) {
            return true
        } else {
            return false
        }
    }
    const isShow = () => {
        let imgs = container.querySelectorAll('img')
        imgs.forEach((item, index) => {
            if (visible(item)) {
                // console.log(111)
                item.src = item.dataset.url
                // item.class
            } else {
                // console.log(222)
                // item.removeAttribute('src')
            }
        })
    }
    isShow()
    listenerContainer.addEventListener('scroll', throttle(isShow, 200, 100))
}
// 函数节流
export function throttle(method, delay, duration) {
    let timer = null
    let begin = new Date()
    return () => {
        let context = this, args = arguments
        let current = new Date()
        clearTimeout(context)
        if (current - begin > duration) {
            method.apply(context, args)
            begin = current
            console.log('render1===')
        } else {
            timer = setTimeout(() => {
                method.apply(context, args)
                console.log('render')
            }, delay)
        }
    }
}
// 去抖动函数
export function debounce(method, context) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function() {
        method.call(context || window)
    }, 200)
}