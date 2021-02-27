# use-synchronous-state
A custom React Hook that provides a synchronous way to read and update a state variable. Becuase `useState()` is asynchronous, this means that you cannot set a state variable and then, very shortly thereafter, check that variable's value to perform further logic.  Setting a state variable, then checking that variable immediately thereafter, will result in the code reading the old/previous state value.  Consider the following example:

```javascript
   const useHookWithState = () => {
      const [firstFieldIsValid, setFirstFieldIsValid] = useState(false);
      const [secondFieldIsValid, setSecondFieldIsValid] = useState(false);
      const [formIsValid, setFormIsValid] = useState(false);
      
      const validateFirstField = (newValue = '') => {
         setFirstFieldIsValid(newValue !== '');
         validateForm();
      }
      
      const validateForm = () => setFormIsValid(firstFieldIsValid && secondFieldIsValid);
      
      const validateSecondField = (newValue = '') => {
         setSecondFieldIsValid(newValue !== '');
         validateForm();
      }

      return {
         formIsValid,
         validateFirstField,
         validateSecondField,
      };
   }
   
   const TestComponent = () => {
      const hookWithState = useHookWithState();
      useEffect(() => {
         hookWithState.validateFirstField('an acceptable value');
         hookWithState.validateSecondField('another acceptable value');
         console.log(hookWithState.formIsValid); // returns FALSE, 
         // even though both fields have received valid values
      }, []);
      return <></>;
   }
```

This code contains two validation functions that check two separate form fields.  After checking any individual form field, the code then triggers `validateForm()`.  But `validateForm()` does not operate properly because it is seeing the _old_ values for `firstFieldIsValid` and `secondFieldIsValid`.

To put this in simpler terms, the asynchronous nature of state can lead to code that contains this seemingly illogical result:

```javascript
const [value, setValue] = useState(true);
setValue(false);
if (value)
   console.log(`this shouldn't be reached - but it is`);
```

## Methodology

This Hook works by storing _two_ values.  The first is the "traditional" state value.  The second is a plain ol' regular variable.  Both variables contain the same value.

## Usage

```javascript
const [value, setValue] = useSynchronousState(true);
setValue(false);
if (value())
   console.log(`this shouldn't be reached - and it isn't reached`);
```

## Methods

### useSynchronousState()

Like `useState()`, `useSynchronousState()` accepts an optional inital value for the state variable.  Like `useState()`, `useSynchronousState()` returns an array of two values.  Like `useState()`, the _second_ value is a setter function for the state variable.

_Unlike_ `useState()`, the _first_ value returned is not a simple value.  Rather, it's a getter function.  This means that every reference to the variable will be a function call, whether you're using the getter (read) or setter (write).

```javascript
const API = {
   arguments: {
      initialValue: {
         optional,
         format: any,
      },
   },
   returns: [
      get: Function,
      set: Function,
   ],
}
```

**Examples:**

```javascript
const SomeComponent = () => {
   const [counter, setCounter] = useSynchronousState(0);
   
   return <>
      Counter: {counter()}
      <div>
         <button
            onClick={() => setCounter(counter() + 1)}
         >Increment</button>
      </div>   
   </>;
}
```

The biggest syntactic difference between `useState()` and `useSynchronousState()` is that the `useSynchronousState()` value must always be referenced with a function call like this:

```javascript
console.log('counter value = ', counter());
```

_Not_ like this:

```javascript
console.log('counter value = ', counter);
```

This also means that there's no need to reference the alternative syntax for updating a state variable, because `counter()` will always returns _the most recent value_ of the `counter` variable.

It may be more intuitive for you to name the read function as a "getter" when it's destructured out of the `useSynchronousState()` call. That would look like this:

```javascript
const SomeComponent = () => {
   const [getCounter, setCounter] = useSynchronousState(0);
   
   return <>
      Counter: {getCounter()}
      <div>
         <button
            onClick={() => setCounter(getCounter() + 1)}
         >Increment
         </button>
      </div>
   </>;
}
```
