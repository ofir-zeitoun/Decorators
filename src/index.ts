import { DecoratorBase, InputParameter, DecoratingMethodType } from './decorator-base'
import { dispatcher, Dispatcher } from './dispatcher-decorator';
export { DecoratorBase, InputParameter, DecoratingMethodType }



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

