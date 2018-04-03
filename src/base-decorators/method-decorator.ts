import { BaseDecorator, InputParameter, doNothing } from "./base-decorator"
import { getDecoratedValuedParams } from "./method-parameter-decorator"

export type DecoratingMethodHandler = (target: any, propertyKey: string, descriptor: PropertyDescriptor, ...args: any[]) => any
export type WrapingMethodHandler = (key: string, invoker : Function, ...args: InputParameter[]) => void

export class MethodDecorator implements BaseDecorator {

  private onDecoratingMethod: DecoratingMethodHandler

  public _args: any[]

  constructor(onDecoratingMethod: DecoratingMethodHandler = doNothing, wrapingMethod?: WrapingMethodHandler, ...args:any[]) {
    this._args = args
    this.onDecoratingMethod = onDecoratingMethod
    this.buildDescriptor = wrapingMethod ? 
                            this.buildDescriptor.bind(this, wrapingMethod) : 
                            doNothing
  }

  decorate(target: any, propertyKey: string, originDescriptor: PropertyDescriptor) {
    let descriptor = Object.assign({}, originDescriptor)
    this.onDecoratingMethod(target, propertyKey, descriptor, ...this._args)
    
    this.buildDescriptor.apply(this, [descriptor])
    
    return descriptor
  }
    
  private buildDescriptor(wrapingMethod: WrapingMethodHandler, descriptor: PropertyDescriptor): void {
    const originMethod = descriptor.value
    const propertyKey = originMethod.name
    descriptor.value = function wrapDecoratedMethod (this: any, ...args: any[]) {
      const decoratedObject = this

      let decoratedValuedParams = getDecoratedValuedParams(decoratedObject, propertyKey, ...args)
      let methodResult
      //let invoked = false
      wrapingMethod(propertyKey, ()=> {
        //invoked = true
        //let updatedArgs = decoratedValuedParams.map(i=>i.value) // args can be ovveride on user request
        methodResult = originMethod.apply(decoratedObject, args)
      }, ...decoratedValuedParams)
      // if (!invoked) {
      //   // user did not call origin function when imlementing onDecoratingMethod 
      // }
      return methodResult
    }
  }
}