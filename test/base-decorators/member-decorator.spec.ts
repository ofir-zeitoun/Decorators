import { expect } from 'chai'
import { decorate, MemberDecorator } from '../../src'

let decorated = false
function onDecorating(target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
  decorated = true
}

class TestDecorated {
  @decorate(MemberDecorator)(onDecorating)
  shouldBeDecorated: boolean
}

describe('MemberDecorator', function () {

  it('member should be decorated', function () {
    expect(decorated).to.be.true
  })
  
})