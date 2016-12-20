var expect = require('chai').expect;
var mylib = require('../dist/WsJmsLib.min.js');

describe('TestClass', function () {
  it('is contained within WsJmsLib as CommonJS', function () {
    expect(mylib).to.be.an('object');
    expect(mylib.TestClass).to.not.be.null;
  });

  it('can be instantiated', function () {
    var t = new mylib.TestClass('foo');
    expect(t).to.be.defined;
  });
});
