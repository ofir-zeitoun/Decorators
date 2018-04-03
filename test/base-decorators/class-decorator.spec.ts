import { expect } from 'chai'
import { decorate, ClassDecorator } from '../../src'

let decorated = false

class TestClassDecorator extends ClassDecorator {

  protected onCreated(cls: new (...args: any[]) => {}) {
    decorated = true  
  }
  
}

@decorate(TestClassDecorator)()
class TestDecorated {
  
}

describe('ClassDecorator', function () {

  it('class should be decorated', function () {
    expect(decorated).to.be.true
  })
  
})