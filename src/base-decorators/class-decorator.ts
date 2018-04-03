import { BaseDecorator, Constructor } from "./base-decorator"

export default abstract class ClassDecorator implements BaseDecorator {

  protected args: any[]

  constructor(...args: any[]) {
    this.args = args
  }

  protected abstract onCreated(cls: Constructor)

  public decorate(cls: Constructor) : any {
    let newClass = class DecoratedClass extends cls { }
    
    this.onCreated(newClass)

    return newClass
  }
}