import { InputParameter } from '../base-decorators/base-decorator'
import decorate from '../decorate'
import { ClassMixinDecorator } from '../decorator-examples/class-mixin-decorator'
import { MethodDecorator } from '../base-decorators/method-decorator'
import { MethodParameterDecorator, getDecoratedValuedParams } from '../base-decorators/method-parameter-decorator'

function getDispatcherName(key: any) {
  return `__disp__${key}__`
}

export abstract class Dispatcher<TDisp> {

  public dispatch(obj: any): any {
    const keyOrDefault = [this.getKey(obj), undefined]
    for (let key of keyOrDefault) {
      let func = this[getDispatcherName(key)]
      if (func) {
        return func.call(this, obj)
      }
    }
  }

  protected abstract getKey(obj: TDisp): any

  protected abstract getParamFromDispatched(meta: InputParameter, dispatched: TDisp): any

}

function addMethodToDispatch(target: any, methodName: string, descriptor: PropertyDescriptor, key: any, ...args: any[]): any {

  target.constructor.prototype[getDispatcherName(key)] = function (dispatched: any) {
    let decoratedValuedParams = getDecoratedValuedParams(target, methodName)
    const params = decoratedValuedParams.map(p => this.getParamFromDispatched(p, dispatched))
    return this[methodName].call(this, ...params)
  }
}

export const classDispacher = () => decorate(ClassMixinDecorator)(Dispatcher)

export const methodDispatcher = (...args: any[]) => decorate(MethodDecorator)(addMethodToDispatch, null, ...args)

export const paramDispatcher = (...args: any[]) => decorate(MethodParameterDecorator)(...args)