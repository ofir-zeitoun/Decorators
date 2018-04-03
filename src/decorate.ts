import { AbstractConstructor, BaseDecorator, Constructor } from './base-decorators/base-decorator'
import ClassDecorator from './base-decorators/class-decorator'
import { MethodDecorator } from './base-decorators/method-decorator'
import { MethodParameterDecorator } from './base-decorators/method-parameter-decorator'
import { MemberDecorator } from './base-decorators/member-decorator'
import { AccessorDecorator } from './base-decorators/accessor-decorator'

// // usage: @decorate(MergeClassesDecorator, ConsoleLogger, ExtraLog)
// export function decorate(decoratorCtor: Constructor<BaseDecorator>, ...decoratorArgs: any[]){
  
//   return function (...args:any[]) {
//     const decorator = new decoratorCtor(...decoratorArgs)

//     if (!decorator.isFit(args)) {
//       const error = `Cannot decorate. This is not a ${decorator.constructor['__proto__'].name}`
//       throw error
//     }
    
//     return decorator.decorate(...args)
//   }
// }

const argsValidations = new Map<AbstractConstructor<BaseDecorator>,(args: any[]) => boolean>([
  [ClassDecorator, (args: any[]) => args.length === 1],
  [MemberDecorator, (args: any[]) => args.length === 2 || typeof args[2] === "undefined"],
  [AccessorDecorator, (args: any[]) => isPropertyDescriptor(args[2])],
  [MethodParameterDecorator, (args: any[]) => typeof args[2] === "number"],
  [MethodDecorator, (args: any[]) => args.length === 3],
])

function isPropertyDescriptor(obj: any) : boolean {
  return obj.hasOwnProperty('get') || obj.hasOwnProperty('set')
}

function validate(decorator: BaseDecorator, args: any[]) {
  let error = `Cannot decorate. Decorator ${decorator.constructor.name} does not derive from BaseDecorator`

  for (let [type, isValid] of argsValidations){
    if (decorator instanceof type) {
      if (isValid(args)){
        return
      }
      error = `Cannot decorate. Decorator ${decorator.constructor.name}, of type ${type.name} cannot be here, wrong arguments`
      break
    }
  }
  throw Error(error)
}

// usage: @decorate(MergeClassesDecorator)(ConsoleLogger, ExtraLog)
export default function decorate(decoratorCtor: Constructor<BaseDecorator>) {
  
  return function decotatorFactory(...decoratorArgs: any[]) {
    const decorator = new decoratorCtor(...decoratorArgs)
    
    return function actualDecorate (...args:any[]) {
  
      validate(decorator, args)
      
      return decorator.decorate(...args)
    }
  }
}

