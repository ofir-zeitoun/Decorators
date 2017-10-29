import { DecoratorBase, InputParameter } from './../decorator-base'
import { LoggerDecorator, Logger } from './logger-decorator';

function testWithParameter(par:number = 0) {
  let decorator = new DecoratorBase()
  return decorator.decorateParams(par)
}
// function testWithParameter(par:number = 0) {
//   let decorator = new DecoratorBase()
//   //decorator.decoratorArguments.push(arguments)
//   //decorator.decoratingClass = Logger
//   return decorator.decorateParams(par)
//   // return function(this: any, ...args: any[]): any {
//   //   return decorator.decorate(args)
//   // }
// }

function test(this: any, ...args: any[]): any {
  let decorator = new DecoratorBase()
  decorator.decoratingClass = OldLogger
  decorator.decoratingMethod = function(key: string, invoke : Function, ...input: InputParameter[]) {
    console.log(`in decoratingMethod ${key}`)
    invoke()
  }
  return decorator.decorate(args)
}

function log(this: any, ...args: any[]): any {
  let decorator = new LoggerDecorator()
  return decorator.decorate(args)
}

export function as<T>(obj: any): T {
  return <T>(obj)
}

class OldLogger {
  log(message: string) {
    console.log(message)
  }

  run() {}
}

@log
//@test
class Demo {

  @log
  @test
  run(@testWithParameter(123456) x: number, @log @test text: string) {
    console.log(`x: ${x}, text: ${text}`)
    as<OldLogger>(this).log("in run")
    this.logDebug('in run')
  }
}

interface Demo extends Logger {
}
let d = new Demo()
d.run(123, "456")
//as<OldLogger>(d).log("Ofir")
d.log(2, "1234567")
//console.log(d)
