/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-19
 * @author Liang <liang@maichong.it>
 */

'use strict';

/**
 * @param obj
 * @param method
 */
function collie(obj, method) {
  //记录原始函数
  var original = obj[method];

  //存放hooks函数
  obj._hooks = obj._hooks || {};
  obj._hooks[method] = obj._hooks[method] || {pre: [], post: []};

  obj.pre = function pre(name, fn) {
    if (!obj._hooks[name]) {
      throw new Error('collie: can not hook method "' + name + '"');
    }
    obj._hooks[name].pre.push(fn);
  };

  obj.post = function post(name, fn) {
    if (!obj._hooks[name]) {
      throw new Error('collie: can not hook method "' + name + '"');
    }
    obj._hooks[name].post.push(fn);
  };

  //大写字母开头的方法名称
  var Method = method.replace(/^\w/, function (match) {
    return match.toUpperCase();
  });

  var preMethod = 'pre' + Method;
  var postMethod = 'post' + Method;

  //覆盖原有方法
  obj[method] = function () {

    var args = arguments;
    var results = [];

    let preHooks = [];

    //异步执行pre hooks
    obj._hooks[method].pre.forEach(function (fn) {
      preHooks.push(fn);
    });

    if (obj[preMethod]) {
      //异步执行对象preMethod方法
      preHooks.push(obj[preMethod]);
    }

    //异步执行原始方法
    preHooks.push(original);
    var promise = compose(preHooks, args, obj);

    //记录下方法的返回值
    promise = promise.then(function (result) {
      results.push(result);
      return Promise.resolve();
    });

    let postHooks = [];

    if (obj[postMethod]) {
      //异步执行对象postMethod方法
      postHooks.push(obj[postMethod]);
    }

    //异步执行post hooks
    obj._hooks[method].post.forEach(function (fn) {
      postHooks.push(fn);
    });

    if (postHooks.length) {
      promise = promise.then(function () {
        return compose(postHooks, results, obj);
      });
    }

    return promise.then(function () {
      //异步返回原始函数返回值
      return Promise.resolve(results[0]);
    });
  };
}

/**
 * 将多个hook函数合并为一个异步函数
 * @param hooks
 * @param args
 * @param scope
 * @returns {Promise}
 */
function compose(hooks, args, scope) {
  if (!Array.isArray(hooks)) throw new TypeError('Hooks stack must be an array!');
  var promise = Promise.resolve();

  var temp = {
    args: args
  };

  hooks.forEach(function (fn) {
    if (typeof fn !== 'function') throw new TypeError('Hooks must be composed of functions!');
    promise = promise.then(function () {
      return new Promise(function (resolve, reject) {
        function callback(res) {
          if (Array.isArray(res)) {
            temp.args = res;
          }
          resolve(res);
        }

        try {
          var res = fn.apply(scope, temp.args);
          if (res && res.then) {
            res.then(callback, reject);
          } else {
            callback(res);
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  return promise;
}

collie.default = collie;
collie.compose = compose;
module.exports = collie;
