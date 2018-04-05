import { BaseDecorator, InputParameter } from "./base-decorator"

let _parametersNames = new Map<string, string[]>()
let _parameters = new Map<string, InputParameter[]>()

function getParameterKey(target: any, methodName: string) {
  return `${target.constructor.name}-${methodName}`
}

function getParametersNames(target: any, methodName: string) : string[] {
  const paramKey = getParameterKey(target, methodName)
  let res = _parametersNames.get(paramKey)
  if (!res) {
    res = target[methodName].toString().match(/\((.*)\)/)[1].split(/\s*,\s*/g)
    _parametersNames.set(paramKey, res)
  }
  return res  
}

function updateParameters(target: any, methodName: string, param: InputParameter) {
  const paramKey = getParameterKey(target, methodName)
  let res = _parameters.get(paramKey)
  if (!res) {
    res = []
    _parameters.set(paramKey, res)
  }
  res.unshift(param)
}

function getParameters(target: any, methodName: string): InputParameter[] {
  const paramKey = getParameterKey(target, methodName)
  return _parameters.get(paramKey) || []
}
export class MethodParameterDecorator implements BaseDecorator {
  
  decorate(target: any, methodName: string, index: number) {
    let paramNames = getParametersNames(target, methodName)
    const param = { index, name: paramNames[index], value: undefined }
    
    updateParameters(target, methodName, param)

    this.onParamMetaData(param.name, methodName, index)
  }

  onParamMetaData(paramName: string, methodName: string, index: number): void {
    // sould be overriden
  }
}

export function getDecoratedValuedParams(target: any, methodName: string, ...args: any[]): InputParameter[] {
  const $params = getParameters(target, methodName)
  let decoratedValuedParams = args.map((value, index)=> {return { value, index }})
  for (let decoratedParam of $params) {
    decoratedValuedParams[decoratedParam.index] = Object.assign({}, decoratedParam, decoratedValuedParams[decoratedParam.index])
  }
  return decoratedValuedParams
}
