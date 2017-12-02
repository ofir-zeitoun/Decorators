import { DecoratorBase, InputParameter, DecoratingMethodType } from './decorator-base'
export { DecoratorBase, InputParameter, DecoratingMethodType }
import { dispatcher, Dispatcher } from './dispatcher-decorator';
import { Logger, log } from './logger-decorator';


// T
class Action {
  id: number

  inputParam1?: string
  inputParam2?: string
}

//@dispatcher()
class ActionDispatcher extends Dispatcher<number, Action> {
  
  protected getKey(obj: Action): number {
    return obj.id
  }
  
  protected getParamFromDispatched(meta: InputParameter, obj: Action) {
    return obj[meta.name]
  }

  @dispatcher(1)
  private action1() {
    console.log(`in op1`)
  }

  @dispatcher(2)
  private action2(@dispatcher() inputParam1: string) {
    console.log(`in op2, ${inputParam1}`)    
  }

  @dispatcher()
  private defaultAction(@dispatcher(1003) inputParam1: string, @dispatcher() inputParam2: string) {
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

let ad = new ActionDispatcher()

ad.dispatch({
  id:1
})

ad.dispatch({
  id:2,
  inputParam1: 'asdfghjkl'
})

ad.dispatch({
  id: 100,
  inputParam1: '123456',
  inputParam2: 'abcdef',
})

ad.temp = 10002
console.log(ad.temp)

ad.bar = true
console.log(ad.bar)



@log
class Demo {

  @log
  run(x: number, @log text: string) {
    console.log(`x: ${x}, text: ${text}`)
    this.logDebug('in run')
  }
}

interface Demo extends Logger { }

let d = new Demo()
d.run(123, "456")
d.log(2, "1234567")
