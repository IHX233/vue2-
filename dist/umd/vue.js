(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
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
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
      text = text.replace(/\s/g, ''); //去掉空格
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

  var defaultTagRe = /\{\{((?:.|\r?\n)+?)\}\}/g; //匹配双大括号和里面的内容
  function genProps(attrs) {
    var str = '';
    var _loop = function _loop() {
      var attr = attrs[i];
      if (attr.name === 'style') {
        //对样式的特殊处理
        var obj = {};
        attr.value.split(';').foreach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          obj[key] = value;
        });
        attr.value = obj;
      }
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    return "{".concat(str.slice(0, -1), "}");
  }
  function gen(node) {
    if (node.type == 1) {
      return generate(node); //生成元素节点的字符串
    } else {
      var text = node.text; //获取文本
      //_v('hello{{world}}') => _v('hello'+_s(world))
      if (!defaultTagRe.test(text)) {
        //如果是普通文本，不带{{}}
        return "_v(".concat(JSON.stringify(text), ")");
      }
      var tokens = [];
      var lastIndex = defaultTagRe.lastIndex = 0; //如果正则是全局模式，需要每次使用前设置为0
      var match, index;
      while (match = defaultTagRe.exec(text)) {
        index = match.index; //保存匹配到的索引
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return "_v(".concat(tokens.join('+'), ")");
    }
  }
  function genChildren(el) {
    var children = el.children;
    if (children) {
      //将转换后的儿子用逗号拼接起来
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }
  function generate(el) {
    var children = genChildren(el); //儿子的生成 
    var code = "_c('".concat(el.tag, "',").concat(el.attrs ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunctions(template) {
    //1.将html转化为ast语法树
    var ast = parseHtml(template);

    //2.优化静态节点

    //3.通过这棵树重新生成代码
    var code = generate(ast);

    //4.将字符串变成函数 限制取值范围 通过with进行取值 之后通过render函数就可以改变this 让这个函数内部取到结果
    var render = new Function("with(this){return ".concat(code, "}"));
    return render;
  }

  function patch(oldVnode, vnode) {
    console.log(oldVnode, vnode);
    //虚拟dom转换为真实dom
    var el = createElm(vnode); //产生真实dom
    var parentElm = oldVnode.parentNode;
    parentElm.insertBefore(el, oldVnode.nextSibling); //将新的节点插在老的节点前面
    parentElm.removeChild(oldVnode); //删除老的节点
  }

  function createElm(vnode) {
    var tag = vnode.tag,
      children = vnode.children;
      vnode.key;
      vnode.data;
      var text = vnode.text;
    if (typeof tag == "string") {
      vnode.el = document.createElement(tag);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    vm._update(vm._render());
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
      vm.$el = el;
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
      mountComponent(vm);
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      //创建虚拟dom元素
      return createElement.apply(void 0, arguments);
    };
    Vue.prototype._s = function (val) {
      //stringify
      return val == null ? '' : _typeof(val) == 'object' ? JSON.stringify(val) : val;
    };
    Vue.prototype._v = function (text) {
      //创建虚拟dom文本元素
      return createTextVnode(text);
    };
    Vue.prototype._render = function () {
      //_render = render
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      return vnode;
    };
  }
  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }
    return vnode(tag, data, data.key, children);
  }
  function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }
  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function Vue(options) {
    this._init(options);
  }
  //对原型进行拓展
  initMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
