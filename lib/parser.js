/**
 * Created by clude on 1/8/18.
 */

var _ = require('underscore');

class ConfigParser {
  _parseValue(keyArr, value, target) {
    const REGEX_ARRAY_KEY = /\[\d*\]/;

    let keyName = keyArr[0];
    // 如果是[0]这样的数组格式的话，target应该是一个数组，此时需对target对应的index赋值
    if(REGEX_ARRAY_KEY.test(keyName)) {
      keyName = parseInt(keyName.substr(1, keyName.length - 2));
    }
    // keyArr.length = 1代表已经到叶子节点，直接对对象赋值（对象可能是个hash也可能是数组的某个位置
    if(keyArr.length == 1){
      target[keyName] = value;
    } else if(keyArr.length >= 2) {
      const nextKey = keyArr[1];
      const emptyValue = REGEX_ARRAY_KEY.test(nextKey) ? [] : {};
      target[keyName] = target[keyName] || emptyValue;
      this._parseValue(keyArr.slice(1), value, target[keyName])
    }
  }

  parse(properties) {
    let rst = {};
    _.each(properties, (value, key) => {
      const arr = key.split('.');
      this._parseValue(arr, value, rst)
    });
    return rst;
  }
}

module.exports = new ConfigParser();

// var c = module.exports;
// var properties = {
//   'a.b.c.d': 100,
//   "k.c": 300,
//   "f.[0]": 1,
//   "f.[1]": 2,
//   "g.a.[0]": 50,
//   "g.a.[1]": 50,
//   "g.b.[0].name": 'nm',
//   "g.b.[0].age": '18',
//   "g.b.[1].name": 'jack',
//   "g.b.[1].age": '11',
//   "g.c": 'ddd',
//   "e": 100,
// }
//
// var rst2 = c.parse(properties)
//
// console.log(rst2)

