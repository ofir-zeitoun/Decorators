import { DecoratorBase } from '.././decorator-base'

// dispatcher<T>
export function opCode(code : number = NaN) {
  let decorator = new OpCodeDecorator()
  return decorator.decorateParams(code)
}

// class DispatcherDecorator
class OpCodeDecorator extends DecoratorBase {
  constructor() {
    super()
    this.decoratingClass = OprationInvoker
    this.decoratingMethodMetadata = this.wrapMethodMetadata
  }
  
  wrapMethodMetadata(target: Function, key: string, opCode: number[]) {
    const args = target[this.getMetadataKey(key)]
    target.constructor.prototype[`op${opCode[0]}`] = function(operation: Operation) {
      let params = args.map(p=>operation[p.name])
      this[key].call(this, ...params)
    }
  }
}

// class Dispatcher
export class OprationInvoker {

  callOperation(operation: Operation) {
    this[`op${operation.opCode}`](operation)
  }

}

// T
export class Operation {
  opCode: number

  inputParam1?: string
  inputParam2?: string
}
