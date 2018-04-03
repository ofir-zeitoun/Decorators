import { BaseDecorator, InputParameter, doNothing } from "./base-decorator"
import { WrapingMethodHandler, DecoratingMethodHandler } from "./method-decorator"

export class AccessorDecorator implements BaseDecorator {
  
  constructor(onDecoratingMethod: DecoratingMethodHandler = doNothing, wrapingGetMethod: WrapingMethodHandler, wrapingSetMethod?: WrapingMethodHandler) {
    this.decorate = this.decorate.bind(this, onDecoratingMethod, wrapingGetMethod, wrapingSetMethod || wrapingGetMethod)
  }
  
  decorate(onDecoratingMethod: DecoratingMethodHandler, wrapingGetMethod: WrapingMethodHandler, wrapingSetMethod: WrapingMethodHandler, 
      target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let newDescriptor: any = Object.assign({}, descriptor)

    onDecoratingMethod(target, propertyKey, newDescriptor)

    if (newDescriptor.hasOwnProperty('get')) {
      newDescriptor.get = function get(this: any) {
        let value = descriptor.get.call(this)
        let metadata: InputParameter = { index: 0, name: 'value', value }
        wrapingGetMethod.apply(this, [propertyKey, doNothing, metadata])
        return metadata.value
      }
    }
    if (newDescriptor.hasOwnProperty('get')) {
      newDescriptor.set = function set(this: any, value: any) {
        let metadata: InputParameter = { index: 0, name: 'value', value }
        wrapingSetMethod.apply(this, [propertyKey, doNothing, metadata])
        descriptor.set.call(this, metadata.value)
      }
    }

    return newDescriptor
    
  }
}