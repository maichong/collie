# collie

async hook

## Example

```javascript

const collie = require('collie');

let obj = {
  preAdd: function (m, n) {
    console.log('preAdd', m, n);
    return [m + 1, n + 1];
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

obj.post('add', function (res) {
  console.log('post add', res);
});

obj.add(1, 2).then(function (res) {
  console.log('done', res);
}, function (err) {
  console.log('error:', err);
});

//pre add 1 2

//other pre add 1 2

//preAdd 2 3

//add 3 4

//postAdd 7

//post add 7

//done 7

```

## Contribute
[Maichong Software](http://maichong.it)

[Liang Xingchen](https://github.com/liangxingchen)

## License

This project is licensed under the terms of the MIT license
