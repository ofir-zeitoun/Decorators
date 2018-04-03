import { expect } from 'chai'
import { decorate, ClassMixinDecorator } from '../../src'

class AddedFunctionsClass {
  
  addedFunction() {

  }
}

@decorate(ClassMixinDecorator)(AddedFunctionsClass)
class TestDecorated {

}

describe('ClassMixinDecorator', function () {

  it('method "addedFunction" should be added', function () {
    let t = new TestDecorated()
    expect(t).to.have.property('addedFunction')
  })
  
})