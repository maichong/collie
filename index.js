/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-19
 * @author Liang <liang@maichong.it>
 */

'use strict';

module.exports = function collie(obj, method) {
  var original = obj[method];
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

  var Method = method.replace(/^\w/, function (match) {
    return match.toUpperCase();
  });

  var preMethod = 'pre' + Method;
  var postMethod = 'post' + Method;

  obj[method] = function () {
    var promise = Promise.resolve();

    function exec(fn, args) {
      promise = promise.then(function () {
        return new Promise(function (resolve, reject) {
          try {
            var result = fn.apply(obj, args);
            if (result && result.then) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch (err) {
            reject(err);
          }
        });
      });
    }

    var args = arguments;
    var results = [];

    for (var i in obj._hooks[method].pre) {
      exec(obj._hooks[method].pre[i], args);
    }

    if (obj[preMethod]) {
      exec(obj[preMethod], args);
    }

    exec(original, args);

    promise = promise.then(function (result) {
      results.push(result);
      return Promise.resolve();
    });

    if (obj[postMethod]) {
      exec(obj[postMethod], results);
    }

    for (var i in obj._hooks[method].post) {
      exec(obj._hooks[method].post[i], results);
    }

    return promise.then(function () {
      return Promise.resolve(results[0]);
    });
  };
};

module.exports.default = module.exports;
