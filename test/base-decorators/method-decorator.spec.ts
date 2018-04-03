import { expect } from 'chai'
import { decorate, MethodDecorator } from '../../src'

let decorated = false
function onDecorating(target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
  decorated = true
}

class TestDecorated {
  @decorate(MethodDecorator)(onDecorating)
  shouldBeDecorated() {

  }
}

describe('MethodDecorator', function () {

  it('method should be decorated', function () {
    expect(decorated).to.be.true
  })
  
})