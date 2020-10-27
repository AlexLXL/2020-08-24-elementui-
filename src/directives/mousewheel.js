// 抹平浏览器中滚动的差异
import normalizeWheel from 'normalize-wheel';

const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

// FF使用DOMMouseScroll，其他浏览器都是用mousewheel
const mousewheel = function(element, callback) {
  if (element && element.addEventListener) {
    element.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', function(event) {
      const normalized = normalizeWheel(event);
      callback && callback.apply(this, [event, normalized]);
    });
  }
};

export default {
  bind(el, binding) {
    mousewheel(el, binding.value);
  }
};
