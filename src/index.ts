import { DecoratorBase, InputParameter, DecoratingMethodType } from './decorator-base'
import { opCode, OprationInvoker, Operation } from './usage/opcodes';
import { dispatcher, Dispatcher } from './dispatcher-decorator';
export { DecoratorBase, InputParameter, DecoratingMethodType }


@opCode()
export class OperationsModule {
  
  @opCode(123)
  private operationNumber123(@opCode() inputParam1: string) {
    console.log(`param1: ${inputParam1}`)
  }

  @opCode(456)
  private anotherTest(@opCode() inputParam2: string) {
    console.log(`param1: ${inputParam2}`)
    
  }
}

export interface OperationsModule extends OprationInvoker {}

let om = new OperationsModule()

om.callOperation({
  opCode: 123,
  inputParam1: '1234567890'
})

om.callOperation({
  opCode: 456,
  inputParam2: 'qazedc'
})

@dispatcher()
class NewDisp extends Dispatcher<number, Operation> {
  
  protected getKey(obj: Operation): number {
    return obj.opCode
  }
  
  protected getParamByName(name: string, obj: Operation) {
    return obj[name]
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
  private defaultOp(@dispatcher() inputParam1: string, @dispatcher() inputParam2: string) {
    console.log(`in defaultOp, ${inputParam1}, ${inputParam2}`)        
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