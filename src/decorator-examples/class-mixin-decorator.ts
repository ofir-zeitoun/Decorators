import ClassDecorator from '../base-decorators/class-decorator'
import { Constructor } from '../base-decorators/base-decorator'

export class ClassMixinDecorator extends ClassDecorator {

  private mergeWith: Constructor<{}>[]
  constructor(...classes: Constructor<{}>[]) {
    super()
    this.mergeWith = classes
  }

  onCreated(newClass: Constructor<{}>) {
    for (let { prototype } of this.mergeWith) {
      for (let p of Object.getOwnPropertyNames(prototype).
        filter(name => !newClass.prototype.hasOwnProperty(name))) {
        newClass.prototype[p] = prototype[p]
      }
    } 
  }
}