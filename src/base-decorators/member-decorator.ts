import { BaseDecorator, doNothing } from './base-decorator'
import { WrapingMethodHandler, DecoratingMethodHandler } from './method-decorator'

export class MemberDecorator implements BaseDecorator {
  
  constructor(onDecoratingMethod: DecoratingMethodHandler = doNothing, wrapingGetMethod: WrapingMethodHandler, wrapingSetMethod?: WrapingMethodHandler) {
    this.decorate = this.decorate.bind(this, onDecoratingMethod, wrapingGetMethod, wrapingSetMethod || wrapingGetMethod)
  }

  decorate(onDecoratingMethod: DecoratingMethodHandler, wrapingGetMethod: WrapingMethodHandler, wrapingSetMethod: WrapingMethodHandler, target: any, propertyKey: string) {

    onDecoratingMethod(target, propertyKey, undefined)
    
    let memberValue = target[propertyKey]
    
    Object.defineProperty(target, propertyKey, {
      get: function get() {
        let metaData = { index: 0, name: 'value', value: memberValue }
        wrapingGetMethod.apply(this, [propertyKey, doNothing, metaData])
        return metaData.value
      },
      set: function set(value: any) {
        let metaData = { index: 0, name: 'value' , value}
        wrapingSetMethod.apply(this, [propertyKey, doNothing, metaData])
        memberValue = metaData.value
      },
      enumerable: true,
      configurable: true
    })
  }
}