import { BaseDecorator, InputParameter } from "./base-decorator"

function getMetadataKey(key: string) {
  return `__${key}-parameters`
}

export class MethodParameterDecorator implements BaseDecorator {
  
  decorate(target: any, methodName: string, index: number) {
    const metadataKey = getMetadataKey(methodName)
    const names = `${metadataKey}-names`
    let params = target[names] || 
        (target[names] = target[methodName].toString().match(/\((.*)\)/)[1].split(/\s*,\s*/g))
    const param = { index, name: params[index] }
    if (!Array.isArray(target[metadataKey])) {
      target[metadataKey] = []
    }
    target[metadataKey].unshift(param)
    this.onParamMetaData(param.name, methodName, index)
  }

  onParamMetaData(paramName: string, methodName: string, index: number): void {
    // sould be overriden
  }
}

export function getDecoratedValuedParams(target: any, methodName: string, ...args: any[]): InputParameter[] {
  const metadataKey = getMetadataKey(methodName)
  const $params = target[metadataKey]
  let decoratedValuedParams = args.map((v, i)=> {return {value:v, index:i }})
  if (Array.isArray($params)) {
    for (let decoratedParam of $params) {
      decoratedValuedParams[decoratedParam.index] = Object.assign({}, decoratedParam, decoratedValuedParams[decoratedParam.index])
    }
  }
  return decoratedValuedParams
}
