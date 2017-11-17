import { DecoratorBase, InputParameter } from './decorator-base'

export interface Logger {
  log(loglevel: number, message: string) : void
  logDebug(message: string) : void
  logSilly(message: string) : void
}

class ConsoleLogger implements Logger{

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

const loggerDecorator = new DecoratorBase()
loggerDecorator.decoratingClass = ConsoleLogger
loggerDecorator.decoratingMethod = function(key: string, invoker : Function, ...args:InputParameter[]) {
  this.logSilly(`before calling ${key} with parameters: ${JSON.stringify(args, null, 2)}`)
  invoker()
}

export function log(...args: any[]): any {
  return loggerDecorator.decorate(args)
}