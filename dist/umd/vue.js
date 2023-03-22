(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[data][key];
      },
      set: function set(newValue) {
        vm[data][key] = newValue;
      }
    });
  }
  function defineProperty(target, key, value) {
    Object.defineProperty(target, key, {
      enumerable: false,
      //不能被枚举
      configurable: false,
      value: value
    });
  }

  var oldArrayProtoMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ['push', 'pop', 'shift', 'shift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
        arg[_key] = arguments[_key];
      }
      var result = oldArrayProtoMethods[method].apply(this, arg);
      var inserted;
      var ob = this._ob_;
      switch (method) {
        case 'push':
        case 'unshift':
          //两个都是增加，内容 可能是对象，需要劫持
          inserted = arg;
          break;
        case 'splice':
          //$set原理
          inserted = arg.slice(2);
      }
      if (inserted) {
        ob.observeArray(inserted);
      }
      return result;
    };
  });

  var Observe = /*#__PURE__*/function () {
    function Observe(value) {
      _classCallCheck(this, Observe);
      //判断一个属性是否是被观测过，看它有没有_ob_属性
      defineProperty(value, '_ob_', this);
      if (Array.isArray(value)) {
        value.__proto__ = arrayMethods;
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }
    _createClass(Observe, [{
      key: "observeArray",
      value: function observeArray(value) {
        value.forEach(function (item) {
          observe(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);
    return Observe;
  }();
  function defineReactive(data, key, value) {
    observe(value); //如果值为对象，继续监控
    Object.defineProperty(data, key, {
      get: function get() {
        console.log('get', data, key);
        return value;
      },
      set: function set(newValue) {
        console.log("set", data, key, newValue);
        if (value === newValue) return;
        observe(newValue); //如果新值设置为对象，继续监控
        value = newValue;
      }
    });
  }
  function observe(data) {
    if (_typeof(data) !== "object" || data == null) {
      return data;
    }
    if (data._ob_) {
      return data;
    }
    return new Observe(data);
  }

  function initState(vm) {
    var opt = vm.$options;
    if (opt.props) ;
    if (opt.data) {
      initData(vm);
    }
    if (opt.methods) ;
    if (opt.computed) ;
    if (opt.watch) ;
  }
  function initData(vm) {
    var data = vm.$options.data;
    vm._data = data = typeof data == 'function' ? data.call(vm) : data;
    for (var key in data) {
      proxy(vm, '_data', key);
    }
    observe(data);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); //标签开头的正则，捕获的是标签名
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); //匹配标签结尾
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>']+)))?/; //匹配属性
  var startTagClose = /^\s*(\/?)>/; //匹配标签结束
  function parseHtml(html) {
    function creatASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        children: [],
        attrs: attrs,
        parent: null
      };
    }
    //被解析的根元素
    var root;
    //当前在被解析的元素
    var currentParent;
    //用于对比标签是否符合规范，即有开始标签也有结束标签
    var stack = [];
    function start(tagName, attrs) {
      var element = creatASTElement(tagName, attrs);
      if (!root) {
        root = element;
      }
      currentParent = element;
      stack.push(element); //将生成的ast元素放到栈中
    }

    function end() {
      var element = stack.pop(); //取出栈里最后一个，即该标签解析结束
      currentParent = stack[stack.length - 1]; //更新当前解析的标签
      if (currentParent) {
        //当一个标签解析完成，就可以知道其父标签  
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }
    function chars(text) {
      text = text.replace(/\s/g, '');
      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }
    while (html) {
      var textEnd = html.indexOf('<');
      if (textEnd == 0) {
        //是标签的开始标记
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }
      var text = void 0;
      if (textEnd > 0) {
        //是文本
        text = html.substring(0, textEnd);
      }
      if (text) {
        advance(text.length);
        chars(text);
      }
    }
    return root;
    function advance(n) {
      //截取更新html
      html = html.substring(n);
    }
    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); //删除开始标签
        //不是标签结束标记且有属性
        var _end;
        var attr;
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }
        if (_end) {
          //匹配到标签结束标记，删除标签并结束一轮的开始标签信息解析
          advance(_end[0].length);
          return match;
        }
      }
    }
  }
  function compileToFunctions(template) {
    var ast = parseHtml(template);
    console.log(ast);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      //初始化状态（将数据做一个初始化劫持，当改变数据时更新视图）
      initState(vm);
      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
    Vue.prototype.$mount = function (el) {
      //挂载操作
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);
      if (!options.render) {
        //没有render，把template转换成render方法
        var template = options.template;
        if (!template && el) {
          template = el.outerHTML;
        }
        //将模编译成render函数
        var render = compileToFunctions(template);
        options.render = render;
      }
    };
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
