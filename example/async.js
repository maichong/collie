/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-19
 * @author Liang <liang@maichong.it>
 */

'use strict';

const collie = require('../index');

let obj = {
  preAdd: async function (m, n) {
    console.log('preAdd', m, n);
    return [m + 1, n + 1];
  },
  add: async function (m, n) {
    console.log('add', m, n);
    return m + n;
  },
  postAdd: async function (res) {
    console.log('postAdd', res);
  }
};

collie(obj, 'add');

obj.pre('add', function (m, n) {
  console.log('pre add', m, n);
});

obj.pre('add', function (m, n) {
  console.log('other pre add', m, n);
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve([m + 1, n + 1]);
    }, 1000);
  });
});

obj.post('add', async function (res) {
  console.log('post add', res);
});

obj.add(1, 2).then(function (res) {
  console.log('done', res);
}, function (err) {
  console.log('error:', err);
});
