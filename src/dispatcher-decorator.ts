import { DecoratorBase } from './decorator-base'

export function dispatcher<TKey, TDisp>(key: TKey|null = null) {
  let disp = new DispatcherDecorator<TKey, TDisp>()
  return disp.decorateParams(key)
}

function getDispatcherName(key:any) {
  return `__disp__${key}__`
}
class DispatcherDecorator<TKey, TDisp> extends DecoratorBase {
  constructor() {
    super()
    this.decoratingClass = Dispatcher;
    this.decoratingMethodMetadata = this.addMethodToDispatch
  }

  addMethodToDispatch(target: Function, methodName: string, keys: TKey[]) {
    const args = target[this.getMetadataKey(methodName)] || []
    
    target.constructor.prototype[getDispatcherName(keys[0])] = function(dispatched: TDisp) {
      const params = args.map(p=>this.getParamByName(p.name, dispatched))
      this[methodName].call(this, ...params)
    }
  }

}

export abstract class Dispatcher<TKey, TDisp> {

  dispatch(obj: TDisp) {
    const key = this.getKey(obj)
    this[getDispatcherName(key)](obj)
  }

  protected abstract getKey(obj: TDisp) : TKey 

  protected abstract getParamByName(name: string, obj: TDisp) : any 
}