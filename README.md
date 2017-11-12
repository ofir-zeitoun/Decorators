# Decorators
Decorators utilities for seperate decorators logic form infrastructure logic.

With this class you can decorate classes, methods, members and accessors (properties with get and or set).
## API

```typescript
class DecoratorBase { // wraps up all work on decorators
  // public members
  decoratingClass : any //  class to merge on the decorated class
  decoratingMethod : DecoratingMethodType // method to wrap decorated method
  decoratingMethodMetadata : DecoratingMetaMethodType // method to get metadata on decorated method

  // public methods
  decorate(args : any[]) // used to decorate without parameters
  decorateParams(...inputArgs : any[]) // used to decorate with parameter
}
```

## Usage

To wrap method with extra behavior you can use DecoratorBase:

to add console log to methods, here is how:

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

Now let's decorate a method:
```typescript
class Test {
  @log
  call1() {
    console.log('call1')
  }
}
```

We'll get:
```
calling call1 in decoratingMethod
call1
```

Now we'll add log functionality to Test class:

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
    this.log(1: message)
  }

  logError(message: string) {
    this.log(2: message)
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
Now for ease of use, we'll merge types:

```typescript
interface Test extends Logger {}
```

Now let's decorate Test class:
```typescript
@log //this line adds the Logger functionality
class Test {
  @log
  call1() {
    console.log('call1')
    this.logDebug('debugging call1')
  }
}
```

We'll get:
```
calling call1 in decoratingMethod
call1
debugging call1
```

## to be continued...