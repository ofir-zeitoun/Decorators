import decorate from './decorate'
import { InputParameter, Constructor, AbstractConstructor } from './base-decorators/base-decorator'
import { WrapingMethodHandler, DecoratingMethodHandler } from "./base-decorators/method-decorator"
import { AccessorDecorator } from './base-decorators/accessor-decorator'
import ClassDecorator from './base-decorators/class-decorator'
import { MemberDecorator } from './base-decorators/member-decorator'
import { MethodDecorator } from './base-decorators/method-decorator'
import { MethodParameterDecorator, getDecoratedValuedParams } from './base-decorators/method-parameter-decorator'
import { ClassMixinDecorator } from './decorator-examples/class-mixin-decorator'
import { Dispatcher, classDispacher, methodDispatcher, paramDispatcher } from './decorator-examples/dispatcher-decorator'

export { decorate }
export { InputParameter, Constructor, AbstractConstructor } 
export { WrapingMethodHandler, DecoratingMethodHandler } 
export { AccessorDecorator } 
export { ClassDecorator } 
export { MemberDecorator } 
export { MethodDecorator } 
export { MethodParameterDecorator, getDecoratedValuedParams } 
export { ClassMixinDecorator } 
export { Dispatcher, classDispacher, methodDispatcher, paramDispatcher } 

