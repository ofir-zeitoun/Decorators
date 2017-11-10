export type InputParameter = {index:number, name:string, value:any, args:any[]}
export type DecoratingMethodType = (key: string, invoker : Function, ...args:InputParameter[]) => void

const VoidDecoratingMethod : DecoratingMethodType = (key: string, invoker : Function, ...args:InputParameter[]) => {} 
const doNothing = () => {}

export class DecoratorBase {
  
  public decoratingClass : any
  public decoratingMethod : DecoratingMethodType = VoidDecoratingMethod
  public decoratingMethodMetadata : Function = VoidDecoratingMethod
  private decoratorArguments : any[] = []


  public decorate(args : any[]) : any {
    let handler : Function

    for (let [predicate, result] of this.decorateMethodFactory) {
      if (predicate(args)) {
        handler = result
        break
      }
    }

    return handler.apply(this, args)
  }

  public decorateParams(...inputArgs : any[]) {
    const decoratorThis = this
    decoratorThis.decoratorArguments.push(...inputArgs)
    return function(this: any, ...args: any[]): any {
      return decoratorThis.decorate(args)
    }
  }

  private readonly decorateMethodFactory = new Map<(args: any[]) => boolean, Function>([
    // order is critical
    [(args: any[]) => args.length === 0, this.noHandler],
    [(args: any[]) => args.length === 1, this.classHandler],
    [(args: any[]) => args.length === 2, this.memberHandler],
    // we can assume args count is three and up
    [(args: any[]) => typeof args[2] === "undefined", this.memberHandler],
    [(args: any[]) => typeof args[2] === "number", this.methodParameterHandler],
    [(args: any[]) => this.isPropertyDescriptor(args[2]), this.accessorHandler],
    [(args: any[]) => args.length === 3, this.methodHandler],
    
    // default
    [(args: any[]) => true, this.noHandler],
    
  ])

  /// helper methods

  private isPropertyDescriptor(obj: any) : boolean {
    return obj.hasOwnProperty('get') || obj.hasOwnProperty('set')
  }  

  public getMetadataKey(key: string) {
    return `${this.constructor.name}_${key}_parameters`
  }

  private mergeClass(newClass : any, constructor : any) {

    // merge classes
    for (let p of Object.getOwnPropertyNames(this.decoratingClass.prototype).
                        filter(name => !constructor.prototype.hasOwnProperty(name))) {
      newClass.prototype[p] = this.decoratingClass.prototype[p]
    }
  }

  private noHandler(args: any[]) {
    throw new Error("Decorators are not valid here!")
  }

  private classHandler<T extends { new(...args: any[]): {} }>(constructor: T) {

    if (!this.decoratingClass) {
      return constructor
    }

    let newClass = class extends constructor {}

    this.mergeClass(newClass, constructor)

    return newClass
  }

  private methodHandler(target: Function, key: string, descriptor: PropertyDescriptor) {
    
    this.decoratingMethodMetadata(target, key, this.decoratorArguments)
    
    if (this.decoratingMethod === VoidDecoratingMethod) {
      return descriptor
    }
    
    const decoratorThis = this
    const metadataKey = decoratorThis.getMetadataKey(key)

    return {
      value: function (this: any, ...args: any[]) {

        let methodResult
        const callerThis = this
        const originMethodInvoker : Function = () => {
          methodResult = descriptor.value.apply(callerThis, args)
        }

        const $params = this[metadataKey]
        let valuedParameters = []
        if (Array.isArray($params)) {
          valuedParameters = $params.map(p => Object.assign({}, p, { value: args[p.index]}))
        }

        decoratorThis.decoratingMethod.apply(callerThis, [key, originMethodInvoker, ...valuedParameters])

        return methodResult
      }
    }
  }

  private methodParameterHandler(target: any, key: string, index: number) {
    const metadataKey = this.getMetadataKey(key)
    const params = target[key].toString().match(/\(.*\)/)[0].replace(/\(|\)/g, '').split(/\s*,\s*/g)
    const param = { index, name: params[index], args: this.decoratorArguments }
    if (!Array.isArray(target[metadataKey])) {
      target[metadataKey] = []
    }
    target[metadataKey].unshift(param)
  }

  private memberHandler(target: any, key: string) {    
    let memberWrapper = target[key]

    const decoratorThis = this

    const getter = function () {
      decoratorThis.decoratingMethod.apply(this, [key, doNothing])
      return memberWrapper
    }

    const setter = function (value: any) {
      let p: InputParameter = { index: 0, name: 'value', value, args: decoratorThis.decoratorArguments }
      decoratorThis.decoratingMethod.apply(this, [key, doNothing, p])
      memberWrapper = value
    }

    // Delete property.
    if (delete target[key]) {
      Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
      })
    }
  }

  // property with get / set
  private accessorHandler(target: any, key: string, descriptor: PropertyDescriptor) {
    const decoratorThis = this
    
    // copy descriptor
    let newDescriptor: any = Object.assign({}, descriptor)

    if (descriptor.hasOwnProperty('get')) {
      const originGetter = <Function>descriptor.get
      const getter = function (this: any) {
        decoratorThis.decoratingMethod.apply(this, [key, doNothing])
        return originGetter.call(this)
      }
      newDescriptor.get = getter
    }

    if (descriptor.hasOwnProperty('set')) {
      const originSetter = <Function>descriptor.set
      const setter = function (this: any, value: any) {
        let p: InputParameter = { index: 0, name: 'value', value, args: decoratorThis.decoratorArguments }
        decoratorThis.decoratingMethod.apply(this, [key, doNothing, p])
        originSetter.call(this, value)
      }
      newDescriptor.set = setter
    }

    return newDescriptor
  }

}
