export type Constructor<T = {}> = new (...args: any[]) => T
export type AbstractConstructor<T> = Function & { prototype: T }
export type InputParameter = { index:number, name?:string, value:any }

export const doNothing = () => {/**/}

export interface BaseDecorator {
  decorate(...args: any[]): any
}
