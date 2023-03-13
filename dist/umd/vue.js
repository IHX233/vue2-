(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    function observe(data) {
      console.log(data);
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
      data = typeof data == 'function' ? data.call(vm) : data;
      observe(data);
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        var vm = this;
        vm.$options = options;
        //初始化状态（将数据做一个初始化劫持，当改变数据时更新视图）
        initState(vm);
      };
    }

    function Vue(options) {
      this._init(options);
    }
    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
