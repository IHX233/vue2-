(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('rollup')) :
  typeof define === 'function' && define.amd ? define(['rollup'], factory) :
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
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
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
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
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

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.subs = [];
      this.id = id$1++;
    }
    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        //dep存放watch，watch也存放dep
        Dep.target.addDep(this);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);
    return Dep;
  }();
  Dep.target = null;
  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }
  //多对多的关系，一个属性有一个dep来收集watcher
  //dep可以存多个watch
  //一个watch可以对应多个dep

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
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed '];
  var strats = {};
  strats.components = function (parentVal, childVal) {
    var res = Object.create(parentVal); //res._proto_ = parentVal
    if (childVal) {
      for (var key in childVal) {
        res[key] = childVal[key];
      }
    }
    return res;
  };
  // strats.data = function(parentVal,childVal){
  //     return childVal
  // }
  // strats.computed = function(){

  // }
  // strats.watch = function(){

  // }
  function mergeHook(parentVal, childValue) {
    if (childValue) {
      if (parentVal) {
        return parentVal.concat(childValue); //父亲和儿子拼接
      } else {
        return [childValue]; //儿子转换为数组
      }
    } else {
      return parentVal; //不合并，用父亲的
    }
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });
  function mergeOptions$1(parent, child) {
    var options = {};
    //遍历父亲
    for (var key in parent) {
      //父亲和儿子都有的在这处理
      mergeField(key);
    }
    //儿子有父亲没有的在这处理
    for (var _key in child) {
      //将儿子多的赋予到父亲上
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }
    function mergeField(key) {
      //合并字段

      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
      } else {
        if (child[key]) {
          options[key] = child[key];
        } else {
          options[key] = parent[key];
        }
      }
    }
    return options;
  }
  var callbacks = [];
  var pending$1 = false;
  function flushCallbacks() {
    while (callbacks.length) {
      var cb = callbacks.pop();
      cb();
    }
    // callbacks.forEach(cb=>cb())
    // callbacks = []
    pending$1 = false;
  }
  var timerFunc;
  //兼容处理
  if (Promise) {
    timerFunc = function timerFunc() {
      Promise.resolve().then(flushCallbacks);
    };
  } else if (MutationObserver) {
    //可以监控dom变化，监控完毕异步更新
    var observe$1 = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(1);
    observe$1.observe(textNode, {
      characterData: true
    });
    timerFunc = function timerFunc() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timerFunc = function timerFunc() {
      setImmediate(flushCallbacks);
    };
  } else {
    timerFunc = function timerFunc() {
      setTimeout(flushCallbacks);
    };
  }
  function nextTick(cb) {
    callbacks.push(cb);
    if (!pending$1) {
      timerFunc(); //这个是异步方法，做了兼容处理
      pending$1 = true;
    }
  }
  function makeMap() {
    var mapping = {};
    var list = str.split(",");
    for (var i = 0; i < list.length; i++) {
      mapping[list[i]] = true;
    }
    return function (key) {
      return mapping[key];
    };
  }
  var isReservedTag = makeMap();

  var oldArrayProtoMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      //当调用数组劫持的七个方法时触发更新
      var result = oldArrayProtoMethods[method].apply(this, args);
      var inserted;
      var ob = this._ob_;
      switch (method) {
        case 'push':
        case 'unshift':
          //两个都是增加，内容 可能是对象，需要劫持
          inserted = args;
          break;
        case 'splice':
          //$set原理
          inserted = args.slice(2);
      }
      if (inserted) {
        ob.observeArray(inserted);
      }
      ob.dep.notify(); //通知数组更新
      return result;
    };
  });

  var Observe = /*#__PURE__*/function () {
    function Observe(value) {
      _classCallCheck(this, Observe);
      this.dep = new Dep(); //为了把dep放ob属性上，这样数组方法触发时才能用到dep的更新方法
      //判断一个属性是否是被观测过，看它有没有_ob_属性
      defineProperty(value, '_ob_', this);
      if (Array.isArray(value)) {
        value.__proto__ = arrayMethods;
        this.observeArray(value); //数组中普通类型是不做观测的
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
    //获取数组对应的dep
    var childDep = observe(value); //如果值为对象，继续监控
    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        //依赖收集
        if (Dep.target) {
          //让这个属性记住这个watcher
          dep.depend();
          if (_typeof(childDep) == "object") {
            //可能是数组，也可能是对象
            childDep.dep.depend(); //这样才能收集数组的watch并在调用数组方法时触发更新
          }
        }

        return value;
      },
      set: function set(newValue) {
        //依赖更新
        if (value === newValue) return;
        observe(newValue); //如果新值设置为对象，继续监控
        value = newValue;
        dep.notify();
      }
    });
  }
  function observe(data) {
    if (_typeof(data) !== "object" || data == null) {
      return;
    }
    if (data._ob_) {
      return data;
    }
    return new Observe(data);
  }

  var id = 0;
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      _classCallCheck(this, Watcher);
      this.vm = vm;
      this.exprOrFn = exprOrFn;
      this.cb = cb;
      this.options = options;
      this.user = options.user; //用户watcher标识
      this.isWatcher = typeof options === "boolean"; //是渲染watch
      this.lazy = options.lazy; //如果watcher上有lazy属性，就是一个计算属性
      this.dirty = this.lazy; //ditty代表取值时是否执行用户的方法
      this.id = id++; //watcher的唯一标识
      this.deps = []; //watcher记录有多少dep依赖它
      this.depsid = new Set();
      if (typeof exprOrFn == "function") {
        this.getter = exprOrFn;
      } else {
        this.getter = function () {
          var path = exprOrFn.split('.');
          var obj = vm;
          for (var i = 0; i < path.length; i++) {
            obj = obj[path[i]];
          }
          return obj;
        };
      }
      this.value = this.lazy ? 0 : this.get();
    }
    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
        if (!this.depsid.has(id)) {
          this.deps.push(dep);
          this.depsid.add(id);
          dep.addSub(this);
        }
      }
    }, {
      key: "get",
      value: function get() {
        //组件挂载的时候会调用一次get，此时getter是渲染页面，会触发definedProperty的get方法收集watcher依赖，所以要在这之前pushTarget然后再popTarget
        pushTarget(this); //当前watcher实例
        var result = this.getter.call(this.vm);
        popTarget();
        return result;
      }
    }, {
      key: "run",
      value: function run() {
        //用户watcher时取新老值
        var newValue = this.get();
        var oldValue = this.value;
        this.value = newValue;
        if (this.user) {
          this.cb.call(this.vm, newValue, oldValue);
        }
      }
    }, {
      key: "update",
      value: function update() {
        // this.get()//重新渲染
        if (this.lazy) {
          //计算属性watcher不用更新页面
          this.dirty = true; //页面重新渲染就能获取最新的值 
        } else {
          queueWatcher(this);
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;
        while (i--) {
          this.deps[i].depend();
        }
      }
    }]);
    return Watcher;
  }();
  var queue = []; //将需要批处理更新的watcher存到一个队列中，稍后让watcher执行
  var has = {};
  var pending = false;
  function flushSchedulerQueue() {
    queue.forEach(function (watcher) {
      watcher.run();
      if (watcher.isWatcher) {
        watcher.cb();
      }
    });
    queue = [];
    has = {};
    pending = false;
  }
  function queueWatcher(watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      queue.push(watcher);
      has[id] = true;
      if (!pending) {
        nextTick(flushSchedulerQueue);
        pending = true;
      }
    }
  }

  function initState(vm) {
    var opt = vm.$options;
    if (opt.props) ;
    if (opt.data) {
      initData(vm);
    }
    if (opt.methods) ;
    if (opt.computed) {
      initComputed(vm);
    }
    if (opt.watch) {
      initWatch(vm);
    }
  }
  function initData(vm) {
    var data = vm.$options.data;
    vm._data = data = typeof data == 'function' ? data.call(vm) : data;
    for (var key in data) {
      proxy(vm, '_data', key);
    }
    observe(data); //让对象重新定义set、get方法
  }
  function initComputed(vm) {
    //需要有watcher 还需要通过defineProperty dirty
    var computed = vm.$options.computed;
    var watchers = vm._computedWatchers = {};
    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef == "function" ? userDef : userDef.get;
      watchers[key] = new Watcher(vm, getter, function () {}, {
        lazy: true
      });
      defineComputed(vm, key, userDef);
    }
  }
  function defineComputed(target, key, userDef) {
    var sharedPropertyDefiniton = {
      enumerable: true,
      configurable: true,
      get: function get() {},
      set: function set() {}
    };
    if (typeof userDef == "function") {
      sharedPropertyDefiniton.get = createComputedGetter(key);
    } else {
      sharedPropertyDefiniton.get = createComputedGetter(key);
      sharedPropertyDefiniton.set = userDef.set;
    }
    Object.defineProperty(target, key, sharedPropertyDefiniton);
  }
  function createComputedGetter(key) {
    return function () {
      var watcher = this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          //说明还有渲染watcher，应该一起收集起来
          watcher.depend(); //计算属性watcher
        }

        return watcher.value;
      }
    };
  }
  function initWatch(vm) {
    var watch = vm.$options.watch;
    var _loop = function _loop(key) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        //数组
        handler.forEach(function (handle) {
          createWatcher(vm, key, handle);
        });
      } else {
        //字符串、对象、函数
        createWatcher(vm, key, handler);
      }
    };
    for (var key in watch) {
      _loop(key);
    }
  }
  function createWatcher(vm, exprOrFn, handler) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    //options可以用来标识是用户watcher
    if (_typeof(handler) == "object") {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler == "string") {
      handler = vm[handler];
    }
    return vm.$watch(exprOrFn, handler, options);
  }
  function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (cb) {
      nextTick(cb);
    };
    Vue.prototype.$watch = function (exprOrFn, cb, options) {
      new Watcher(this, exprOrFn, cb, _objectSpread2(_objectSpread2({}, options), {}, {
        user: true
      }));
      if (options.immediate) {
        cb();
      }
    };
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
    //创建当前被解析html标签的ast语法结构
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
        attr.value.split(';').forEach(function (item) {
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
    if (oldVnode.nodeType == 1) {
      //真实节点
      //虚拟dom转换为真实dom
      var el = createElm(vnode); //产生真实dom
      var parentElm = oldVnode.parentNode;
      parentElm.insertBefore(el, oldVnode.nextSibling); //将新的节点插在老的节点前面
      parentElm.removeChild(oldVnode); //删除老的节点
      return el;
    } else {
      //在更新的时候拿老的虚拟节点和新的虚拟节点做对比，将不同的地方更新
      //1.比较两个元素的标签，标签不一样直接替换掉
      if (oldVnode.tag !== vnode.tag) {
        return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
      }
      //2.标签一样，比对文本，文本节点的tag都是undefined
      if (!oldVnode.tag) {
        if (oldVnode.text !== vnode.text) {
          // oldVnode.el.data = vnode.text
          // oldVnode.el.nodeValue = vnode.text
          // oldVnode.el.textContent = vnode.text
          return oldVnode.el.textContent = vnode.text;
        }
      }
      //3.标签一样，并且需要开始比对标签的属性和儿子
      //标签一样直接复用即可
      var _el = vnode.el = oldVnode.el;
      //更新属性，用新的虚拟节点的属性和老的比较，去更新节点
      //新老属性对比
      updateProperties(vnode, oldVnode.data);
      var oldChildren = oldVnode.children || [];
      var newChildren = vnode.children || [];
      if (oldChildren.length > 0 && newChildren.length > 0) {
        //新老都有孩子
        updateChildren(oldChildren, newChildren, _el);
      } else if (oldChildren.length > 0) {
        //新的没有
        _el.innerHTML = '';
      } else if (newChildren.length > 0) {
        //老的没有
        for (var i = 0; i < newChildren.length; i++) {
          var child = newChildren[i];
          _el.appendChild(createElm(child));
        }
      }
    }
  }
  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag == newVnode.tag && oldVnode.key == newVnode.key;
  }
  function makeInedexByKey(children) {
    var map = {};
    children.forEach(function (item, index) {
      if (item.key) {
        map[item.key] = index;
      }
    });
    return map;
  }
  function updateChildren(oldChildren, newChildren, parent) {
    var oldStartIndex = 0;
    var oldStartVnode = oldChildren[0];
    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldEndIndex];
    var newStartIndex = 0;
    var newStartVnode = newChildren[0];
    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newEndIndex];
    var map = makeInedexByKey(oldChildren);
    //做一个循环，同时循环老的和新的，哪个先结束，循环就停止，将多余的删除或添加进去
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (!oldStartVnode) {
        //null
        oldStartVnode = oldChildren[++oldStartIndex];
      }
      //头头比
      else if (isSameVnode(oldStartVnode, newStartVnode)) {
        //如果是同一个元素，比对儿子
        patch(oldStartVnode, newStartVnode); //更新属性，递归更新儿子
        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
        //尾尾比
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
        //头尾比
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        patch(oldStartVnode, newEndVnode);
        //将当前元素插到尾部的下一个元素前面
        parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        patch(oldEndVnode, newStartVnode);
        parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else {
        //暴力对比
        var moveIndex = map[newStartVnode.key];
        if (moveIndex == undefined) {
          parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          var moveVNode = oldChildren[moveIndex];
          oldChildren[moveIndex] = null;
          parent.insertBefore(moveVNode.el, oldStartVnode.el);
          patch(moveVNode, newStartVnode);
        }
        newStartVnode = newChildren[++newStartIndex];
      }
    }
    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        //将新的多的插入
        parent.appendChild(createElm(newChildren[i]));
      }
    }
    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        var child = oldChildren[_i];
        if (child != undefined) {
          parent.removeChild(child.el);
        }
      }
    }
  }
  function createComponent$1(vnode) {
    //调用hook中的init方法
    var i = vnode.data;
    if ((i = i.hook) && (i = i.init)) {
      i(vnode);
    }
    if (vnode.componentInstance) {
      return true;
    }
  }
  function createElm(vnode) {
    var tag = vnode.tag,
      children = vnode.children;
      vnode.key;
      vnode.data;
      var text = vnode.text;
    if (typeof tag == "string") {
      if (createComponent$1(vnode)) {
        return vnode.componentInstance.$el;
      }
      vnode.el = document.createElement(tag);
      updateProperties(vnode);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }
  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {};
    var el = vnode.el;
    //老的有新的没有需要删除属性
    for (var key in oldProps) {
      if (!newProps[key]) {
        el.removeAttribute(key);
      }
    }

    //样式处理  老的：style={color:red}   新的：style={background:red}
    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {};
    for (var _key in oldStyle) {
      if (!newStyle[_key]) {
        el.style[_key] = "";
      }
    }

    //新的有，直接用新的更新就行
    for (var _key2 in newProps) {
      if (_key2 == "style") {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 == "class") {
        el.className = newProps["class"];
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var prevVnode = vm._vnode;
      //是否是首次渲染
      if (!prevVnode) {
        //用新创建的元素，替换老的vm.$el
        vm.$el = patch(vm.$el, vnode);
        vm._vnode = vnode;
      } else {
        vm.$el = patch(prevVnode, vnode);
      }
    };
  }
  function mountComponent(vm, el) {
    callHook(vm, 'beforeMount');
    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };
    //初始化创建watcher
    new Watcher(vm, updateComponent, function () {
      callHook(vm, 'updated');
    }, true);
    // watcher.get()
    callHook(vm, 'mounted');
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = mergeOptions$1(vm.constructor.options, options);
      callHook(vm, 'beforeCreate');
      //初始化状态（将数据做一个初始化劫持，当改变数据时更新视图）
      initState(vm);
      callHook(vm, 'created');
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
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
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
  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    //如果是组件 产生虚拟节点时需要把组件的构造函数传入
    if (isReservedTag(tag)) {
      return vnode(tag, data, data.key, children);
    } else {
      vm.$option.components[tag];
      //创建组件的虚拟节点 children是插槽
      return createComponent(vm, tag, data, data.key);
    }
  }
  function createComponent() {
    var baseCtor = vm.$options._base;
    if ((typeof Ctor === "undefined" ? "undefined" : _typeof(Ctor)) == "object") {
      Ctor = baseCtor.extend(Ctor);
    }
    //给组件增加生命周期
    data.hook = {
      init: function init() {}
    };
    return vnode("vue-component-".concat(Ctor.cid, "-").concat(tag), data, data.key, undefined, undefined, {
      Ctor: Ctor,
      children: children
    });
  }
  function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }
  function vnode(tag, data, key, children, text, componentOptions) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      componentOptions: componentOptions
    };
  }

  function initExtend(Vue) {
    var cid = 0;
    Vue.extend = function (extendOptions) {
      var Super = this;
      var Sub = function VueComponent(options) {
        this._init(options);
      };
      Sub.cid = cid++;
      //子类继承父类原型上的方法
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOptions(Super.options, extendOptions);
      Sub.components = Super.components;
      return Sub;
    };
  }

  function initGlobalApi(Vue) {
    Vue.options = {};
    Vue.mixin = function (mixin) {
      this.options = mergeOptions$1(this.options, mixin);
    };
    Vue.options._base = Vue; //_base 最终的Vue的构造函数保留在options对象中
    Vue.options.components = {};
    initExtend(Vue);
    Vue.component = function (id, definition) {
      definition.name = definition.name || id;
      definition = this.options._base.extend(definition);
      Vue.options.components[id] = definition;
    };
  }

  function Vue(options) {
    this._init(options);
  }
  //对原型进行拓展 原型方法
  initMixin(Vue); //init方法
  lifecycleMixin(Vue); //_update
  renderMixin(Vue); //_render
  stateMixin(Vue);

  //静态方法
  initGlobalApi(Vue);

  // import { compileToFunctions } from "./compiler/index";
  // import {createElm, patch} from "./vdom/patch"
  // let vm1 = new Vue({data:{name:'ihx'}})
  // let render1 = compileToFunctions(`<div>
  //     <li style="background:red">A</li>
  //     <li style="background:pink">B</li>
  //     <li style="background:yellow">C</li>
  //     <li style="background:green">D</li>
  // </div>`)
  // let vnode1 = render1.call(vm1)
  // document.body.appendChild(createElm(vnode1))
  // let vm2 = new Vue({data:{name:'gf'}})
  // let render2 = compileToFunctions(`<div>
  // <li style="background:purple">A</li>
  // <li style="background:pink">B</li>
  // <li style="background:yellow">C</li>
  // <li style="background:green">D</li>
  // <li style="background:blue">E</li>
  // </div>`)
  // let vnode2 = render2.call(vm2)
  // setTimeout(()=>{
  //     patch(vnode1,vnode2)
  // },1000)

  return Vue;

}));
//# sourceMappingURL=vue.js.map
