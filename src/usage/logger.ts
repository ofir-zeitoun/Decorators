import { MethodDecorator, ClassMixinDecorator, InputParameter, decorate, MethodParameterDecorator } from '../'

class ConsoleLogger {

  log(loglevel: number, message: string) {
    console.log(`${loglevel}: ${message}`)    
  }

  logDebug(message: string) {
    this.log(0, message)
  }

  logSilly(message: string): void {
    this.log(6, message)
  }
}

class ExtraLog {
  superLog(msg: string) {
    console.log(`--->${msg}`)
  }
}

//// Usage ////
interface Dummy extends ConsoleLogger, ExtraLog { }

function onDecorating(target: any, propertyKey: string, descriptor: PropertyDescriptor) : any {
  console.log(target, propertyKey, descriptor)
}

function wrapingMethod(key: string, invoker : Function, ...args:InputParameter[]){
  //args[0].value = 987654
  invoker()  
}

@decorate(ClassMixinDecorator)(ConsoleLogger, ExtraLog)
class Dummy{
  
  @decorate(MethodDecorator)(onDecorating, wrapingMethod)
  doSomething(){
    this.logDebug('hello')
    this.superLog('there')
  }

  @decorate(MethodDecorator)(onDecorating, wrapingMethod)
  doAnotherThing(@decorate(MethodParameterDecorator)() x: number, @decorate(MethodParameterDecorator)() y: string) : boolean {
    this.logSilly(`x: ${x}, y: ${y}`)
    return true
  }
}

let d = new Dummy()
d.doSomething()
d.doAnotherThing(123, '456')