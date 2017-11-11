import { DecoratorBase, InputParameter } from './decorator-base'

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
    this.decoratingClass = Dispatcher
    this.decoratingMethodMetadata = this.addMethodToDispatch
  }

  addMethodToDispatch(target: Function, methodName: string, args : InputParameter[], keys: TKey[]) {
    
    target.constructor.prototype[getDispatcherName(keys[0])] = function(dispatched: TDisp) {
      const params = args.map(p=>this.getParamFromDispatched(p, dispatched))
      this[methodName].call(this, ...params)
    }
  }

}

export abstract class Dispatcher<TKey, TDisp> {

  dispatch(obj: TDisp) : any {
    const keyAndDefaultKey = [this.getKey(obj), null]
    for (let key of keyAndDefaultKey) {
      let func = this[getDispatcherName(key)]
      if (func) {
        return func.call(this, obj)
      }
    }
    
    throw new Error(`cannot invoke ${JSON.stringify(obj, null, 2)}`)
  }

  protected abstract getKey(obj: TDisp) : TKey 

  protected abstract getParamFromDispatched(meta: InputParameter, dispatched: TDisp) : any 
}