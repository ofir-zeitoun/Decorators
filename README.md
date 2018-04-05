# OZ-Decorators
These decorators classes helps you focus on your logic and hides the issues regarding decorators.

----

With this module you can decorate classes, methods, members and accessors (properties with get and or set).
* [API](#api)
* [Usage](#usage)
  * [Add behavior to method](#add-behavior-to-method)
  * [Add functionality to class](#add-functionality-to-class)
  * [Dispatcher class](#dispatcher-class)

## API

```typescript
// Decorates the code (class, function) and returns afactory method to an instance of the specified DecoratorBase (any argument will be passed to the constructor)

// usage: @decorate(MergeClassesDecorator)(ConsoleLogger, ExtraLog)
export default function decorate(decoratorCtor: Constructor<BaseDecorator>)

// Shared decorator API (no need to implement, next classes are the real bases)
interface BaseDecorator {
  decorate(...args: any[]): any
}

// base for decorating classes
abstract class ClassDecorator {
  // Once decorated, this method is called with new class construtcor (cls parameter).
  // Here is where the class modification should take place
  protected abstract onCreated(cls: Constructor)
}

type DecoratingMethodHandler = (target: any, propertyKey: string, descriptor: PropertyDescriptor, ...args: any[]) => any

type WrapingMethodHandler = (key: string, invoker : Function, ...args: InputParameter[]) => void

// class to decorate a field member 
class MemberDecorator  {
  
  constructor(
    onDecoratingMethod: DecoratingMethodHandler, // called when decorated
    wrapingGetMethod: WrapingMethodHandler, // wrapping method for getting member value
    wrapingSetMethod?: WrapingMethodHandler // wrapping method for setting member value
    ) {...}
}

// class to decorate a accessor (property with get and or set)
class AccessorDecorator {
  
  constructor(
    onDecoratingMethod: DecoratingMethodHandler, // called when decorated
    wrapingGetMethod: WrapingMethodHandler, // wrapping method for getting member value
    wrapingSetMethod?: WrapingMethodHandler // wrapping method for setting member value
    ) {...}
}

// class to decorte methods (functions)
class MethodDecorator {
  constructor(
    onDecoratingMethod: DecoratingMethodHandler, // called when decorated
    wrapingMethod?: WrapingMethodHandler, // extends the calling of the decorated method
    ...args:any[]
  ) {...}
}

// class to decorte methods parameters (functions arguments)
class MethodParameterDecorator {

  // can be overriden
  /*virtual*/ onParamMetaData(
    paramName: string, 
    methodName: string,  
    index: number // parameter's index in the arguments list
  )
}
```

## Usage

### Add behavior to method

To wrap method with extra behavior you can use MethodDecorator
This is how to add log on methods

```typescript
function onDecorating(target: any, propertyKey: string, descriptor: PropertyDescriptor) : any {
}

function wrapingMethod(key: string, invoker : Function, ...args:InputParameter[]){
  console.log(`calling ${key} in wrapingMethod`)
  invoker()  
}

class Test {
  @decorate(MethodDecorator)(onDecorating, wrapingMethod)
  foo() {
    console.log('foo')
  }
}
```

Now let's call it
```typescript
let t = new Test()
t.foo()
```

output will be
```
calling foo in wrapingMethod
foo
```

### Add functionality to class

Here is how to add log functionality to Test class.

First, we'll declare a class that will have the logging functionality
```typescript
class Logger {
  log(level: number, message: string) {
    console.log(`${level}: ${message}`)
  }

  logDebug(message: string) {
    this.log(0, message)
  }

  logWarn(message: string) {
    this.log(1, message)
  }

  logError(message: string) {
    this.log(2, message)
  }
}
```
For ease of use (and 'compile time' error), we'll merge types:

```typescript
interface Test extends Logger {}
```

Now let's decorate Test class (merge it with Logger):
```typescript
@decorate(ClassMixinDecorator)(Logger)
class Test {
  @decorate(MethodDecorator)(onDecorating, wrapingMethod)
  foo() {
    console.log('foo')
    this.logDebug('debugging foo')
  }
}
```

We'll get:
```
calling foo in wrapingMethod
foo
0: debugging foo
```

### Dispatcher class

Here is how to use decorators and Dispatcher class to dispatch actions in run-time:

First we'll declare an Action class like so:

```typescript
class Action {
  id: number

  inputParam1?: string
  inputParam2?: string
}
```
Now let's declare a dispatcher class that will call methods accordingly.

Two methods must be defined:
1. getKey - this returns the key from the dispatched object
1. getParamFromDispatched - this returns a value from the dispatched object to be injected to a parameter on the target method.

```typescript
class ActionDispatcher extends Dispatcher<number, Action> {
  
  protected getKey(obj: Action): number {
    return obj.id
  }
  
  protected getParamFromDispatched(meta: InputParameter, obj: Action) {
    return obj[meta.name]
  }
}
```
Method will be "dispatchable" after decorating with *@classDispacher()*.

*Actual dispatched methods can be private.*

```typescript
@classDispacher()
class ActionDispatcher {

  ...

  @methodDispatcher(1)
  private action1() {
    console.log("in action1")
  }

  @methodDispatcher(2)
  private action2(@paramDispatcher() inputParam1: string) {
    console.log(`in action2: ${inputParam1}`)
  }

  @methodDispatcher()
  private defaultAction(@paramDispatcher() inputParam1: string,
    @paramDispatcher() inputParam2: string) {
    console.log(`in defaultAction: ${inputParam1}, ${inputParam2}`)
  }
}
```

Usage:

```typescript
let ad = new ActionDispatcher()

ad.dispatch({ id:1 }) // action1 will be invoked

ad.dispatch({ id:2, inputParam1: 'value2' })  // action2 will be invoked with 'value2' injected to inputParam1 parameter

ad.dispatch({ id: 100, inputParam1: 'value101', inputParam2: 'value102' }) // defaultAction will be invoked
```

output:
```
in action1
in action2: value2
in defaultAction: value101, value102
```

