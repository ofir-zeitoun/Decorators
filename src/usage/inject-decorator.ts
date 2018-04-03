// import { DecoratorBase, InputParameter } from './decorator-base'

// const _map = new Map()

// export type ResolveMethod = (key: string) => any

// export class InjectorDecorator extends DecoratorBase {

//   public resolve : ResolveMethod = this.simpleResolve.bind(this)

//   constructor() { 
//     super()
//     this.decoratingMethodMetadata = this.addMethodToDispatch
//     const injector = this
//     this.decoratingMethod = function(key: string, invoker : Function, ...args:InputParameter[]) {
//       let parameters = args.map(a=>typeof a.value === 'undefined' ? 
//                                 injector.resolve(_map.get(`${key}:${a.name}`) || a.args[0]) : 
//                                 a.value)
//       invoker(...parameters)
//     }
//   }

//   addMethodToDispatch(target: Function, methodName: string, args : InputParameter[], keys: string[]) {
//     for (let arg of args) {
//       let resolveKey =  arg.args[0] || arg.name
//       _map.set(`${methodName}:${arg.name}`, resolveKey)
//     }
//   }

//   private readonly cache = new Map()

//   simpleResolve(key: string) : any {
//     return this.cache.get(key)
//   }
// }

// const resolved = new Map<string,any>([
//   ['aaa', 'ofir'],
//   ['tempValue', 555],
//   ['barValue', true],
// ])

// export function inject(key?: string) {
//   const injector = new InjectorDecorator()
//   injector.resolve = (k: string) => resolved.get(k)
//   return injector.decorateParams(key)
// }