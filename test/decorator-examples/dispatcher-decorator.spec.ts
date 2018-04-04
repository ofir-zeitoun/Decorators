import { expect } from 'chai'
import { decorate, Dispatcher, classDispacher, methodDispatcher, paramDispatcher, InputParameter } from '../../src'

// T
class Action {
  id: number

  inputParam1?: string
  inputParam2?: string
}

interface ActionDispatcher extends Dispatcher<Action> { }

@classDispacher()
class ActionDispatcher {

  protected getKey(obj: Action): number {
    return obj.id
  }

  protected getParamFromDispatched(meta: InputParameter, obj: Action) {
    return obj[meta.name]
  }

  @methodDispatcher(1)
  private action1(): string {
    return "action1"
  }

  @methodDispatcher(2)
  private action2(@paramDispatcher() inputParam1: string): string {
    return `action2: ${inputParam1}`
  }

  @methodDispatcher()
  private defaultAction(@paramDispatcher() inputParam1: string,
    @paramDispatcher() inputParam2: string): string {
    return `defaultAction: ${inputParam1}, ${inputParam2}`
  }
}

describe('DispatcherDecorator', function () {

  let t = new ActionDispatcher()

  it('classDispatcher should add "dispatch" function', function () {
    expect(t).to.have.property('dispatch')
  })

  it('methodDispatcher should add 1,2 & undefined functions', function () {
    expect(t).to.have.property('__disp__1__')
    expect(t).to.have.property('__disp__2__')
    expect(t).to.have.property('__disp__undefined__')
  })

  it('action1 sould be called', function () {
    let res = t.dispatch({ id: 1 })
    expect(res).to.be.equal('action1')
  })

  it('action2 sould be called with param#1', function () {
    let res = t.dispatch({
      id: 2,
      inputParam1: "param#1"
    })
    expect(res).to.be.equal('action2: param#1')
  })

  it('defaultAction sould be called with param#1 and param#2', function () {
    let res = t.dispatch({
      id: 1000,
      inputParam1: "param#1",
      inputParam2: "param#2",
    })
    expect(res).to.be.equal('defaultAction: param#1, param#2')
  })
})