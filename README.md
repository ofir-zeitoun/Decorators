# Decorators
These decorators classes helps you focus on your logic and hides the issues regarding decorators.

----
# I will update readme.md soon...

----

With this class you can decorate classes, methods, members and accessors (properties with get and or set).
* [API](#api)
* [Usage](#usage)
  * [Add behavior to method](#add-behavior-to-method)
  * [Add functionality to class](#add-functionality-to-class)
  * [Dispatcher class](#dispatcher-class)

## API

```typescript
// wraps up all work on decorators
class DecoratorBase { 
  // public members
  decoratingClass : any //  class to merge with the decorated class
  decoratingMethod : DecoratingMethodType // method that wraps the decorated method, called when calling the decorated metod
  decoratingMethodMetadata : DecoratingMetaMethodType // method to get metadata on decorated method, called once when accessing the class

  // public methods
  decorate(args : any[]) // used to decorate without parameters
  decorateParams(...inputArgs : any[]) // used to decorate with parameter
}
```

## Usage

### Add behavior to method

To wrap method with extra behavior you can use DecoratorBase
This is how to add log on methods

```typescript
// this is the decorator
function log(...args: any[]): any {
  let decorator = new DecoratorBase()
  decorator.decoratingMethod = function(key: string, invoke : Function, ...input: InputParameter[]) {
    console.log(`calling ${key} in decoratingMethod`)
    invoke()
  }
  return decorator.decorate(args)
}
```

Now let's decorate a method and call it
```typescript
class Test {
  @log
  foo() {
    console.log('foo')
  }
}

let t = new Test()
t.foo()
```

output will be
```
calling foo in decoratingMethod
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
Next, we'll add this class to declaringClass member:
```typescript
function log(...args: any[]): any {
  let decorator = new DecoratorBase()
  decorator.decoratingClass = Logger
  decorator.decoratingMethod = function(key: string, invoke : Function, ...input: InputParameter[]) {
    console.log(`calling ${key} in decoratingMethod`)
    invoke()
  }
  return decorator.decorate(args)
}
```
For ease of use (and 'compile time' error), we'll merge types:

```typescript
interface Test extends Logger {}
```

Now let's decorate Test class (merge it with Logger):
```typescript
@log
class Test {
  @log
  foo() {
    console.log('foo')
    this.logDebug('debugging foo')
  }
}
```

We'll get:
```
calling foo in decoratingMethod
foo
debugging foo
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
Method will be "dispatchable" after decorating with *@dispatcher(\<key>)*. Key should be a value in the dispatched object (match to getKey method).

*Actual dispatched methods can be private.*

```typescript
class ActionDispatcher extends Dispatcher<number, Action> {
  ...

  @dispatcher(1)
  private action1() {
    console.log(`in action1`)
  }

  @dispatcher(2)
  private action2(@dispatcher() inputParam1: string) {
    console.log(`in action2, ${inputParam1}`)    
  }

  @dispatcher()
  private defaultAction(@dispatcher() inputParam1: string, @dispatcher() inputParam2: string) {
    console.log(`in defaultAction, ${inputParam1}, ${inputParam2}`)        
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
in action2, value2
in defaultAction, value101, value102
```
## to be continued...
