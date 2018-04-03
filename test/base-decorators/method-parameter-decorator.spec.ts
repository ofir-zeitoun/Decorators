import { expect } from 'chai'
import { decorate, MethodParameterDecorator, getDecoratedValuedParams } from '../../src'


class TestDecorated {
  
  test(@decorate(MethodParameterDecorator)() shouldBeDecorated: number) {

  }
}

describe('MethodParameterDecorator', function () {

  let t = new TestDecorated()
  let p = getDecoratedValuedParams(t, 'test')

  it('method param should be decorated', function () {
    expect(p).to.have.length(1)
  })
  
  it('method param should be "shouldBeDecorated"', function () {
    expect(p[0]).to.have.property('name', 'shouldBeDecorated')
  })
  
})