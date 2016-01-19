/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-19
 * @author Liang <liang@maichong.it>
 */

'use strict';

const collie = require('collie');

let obj = {
  preAdd: function (m, n) {
    console.log('preAdd', m, n);
  },
  add: function (m, n) {
    console.log('add', m, n);
    return m + n;
  },
  postAdd: function (res) {
    console.log('postAdd', res);
  }
};

collie(obj, 'add');

obj.pre('add', function (m, n) {
  console.log('pre save', m, n);
});

obj.pre('add', function (m, n) {
  console.log('other pre save', m, n);
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, 1000);
  });
});

obj.post('add', function (res) {
  console.log('post add', res);
});

obj.add(1, 2).then(function (res) {
  console.log('done', res);
}, function (err) {
  console.log('error:', err);
});
