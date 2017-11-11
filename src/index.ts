import { DecoratorBase, InputParameter, DecoratingMethodType } from './decorator-base'
import { dispatcher, Dispatcher } from './dispatcher-decorator';
export { DecoratorBase, InputParameter, DecoratingMethodType }
import { LoggerDecorator, Logger } from './logger-decorator';


// T
export class Operation {
  opCode: number

  inputParam1?: string
  inputParam2?: string
}

@dispatcher()
class NewDisp extends Dispatcher<number, Operation> {
  
  protected getKey(obj: Operation): number {
    return obj.opCode
  }
  
  protected getParamFromDispatched(meta: InputParameter, obj: Operation) {
    return obj[meta.name]
  }

  @dispatcher(1)
  private op1() {
    console.log(`in op1`)
  }

  @dispatcher(2)
  private op2(@dispatcher() inputParam1: string) {
    console.log(`in op2, ${inputParam1}`)    
  }

  @dispatcher()
  private defaultOp(@dispatcher(1003) inputParam1: string, @dispatcher() inputParam2: string) {
    console.log(`in defaultOp, ${inputParam1}, ${inputParam2}`)        
  }

  @dispatcher(1000)
  temp: number

  private _bar:boolean = false
  @dispatcher(123)
  get bar():boolean {
      return this._bar
  }
  set bar(theBar:boolean) {
      this._bar = theBar
  }
}

let nd = new NewDisp()

nd.dispatch({
  opCode:1
})

nd.dispatch({
  opCode:2,
  inputParam1: 'asdfghjkl'
})

nd.dispatch({
  opCode: 100,
  inputParam1: '123456',
  inputParam2: 'abcdef',
})

nd.temp = 10002
console.log(nd.temp)

nd.bar = true
console.log(nd.bar)



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
