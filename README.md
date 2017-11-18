# Decorators
These decorators classes helps you focus on your logic and hides the issues regarding decorators.


With this class you can decorate classes, methods, members and accessors (properties with get and or set).
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

### To wrap method with extra behavior you can use DecoratorBase:

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
t.call1()
```

output will be
```
calling foo in decoratingMethod
foo
```

### Here is how to add log functionality to Test class

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

## to be continued...