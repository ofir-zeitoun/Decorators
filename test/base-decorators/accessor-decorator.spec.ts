import { expect } from 'chai'
import { decorate, AccessorDecorator, InputParameter } from '../../src'

const OVERRIDE_VALUE = 'OVERRIDE'

let decorated = false
function onDecorating(target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
  decorated = true
}

function wrapingMethod(key: string, invoker: Function, ...args: InputParameter[]) {
  args[0].value = OVERRIDE_VALUE
  invoker()
}

class TestAccessorDecorator {

  private _value: string

  @decorate(AccessorDecorator)(onDecorating, wrapingMethod)
  public get value(): string {
    return this._value
  }

  public set value(v: string) {
    this._value = v
  }

}

describe('AccessorDecorator', function () {

  it('property value should be decorated', function () {
    expect(decorated).to.be.true
  })
  
  it('property value should have value overriden', function () {
    let test = new TestAccessorDecorator()
    test.value = 'something'
    expect(test.value).to.be.equal(OVERRIDE_VALUE)
  })

})

