# Validation

Validation is an important part of forms, since we want to ensure user input is fits the expected input for our application.

This library comes with some basic built-in validation helpers, but it's easily extendable to add your custom validation with custom logic. For more information, please see the [`Built-in Validators`](#builtin-validators) section.

There are two main types of validators that can be used:
* [`Synchronous Validators`](#synchronous-validators)
* [`Asynchronous Validators`](#asynchronous-validators)

Inputs are designed to take in a single validator or an array of validators, to make it clean and easier to define our inputs.

```tsx
import { Validators } from '@reaciveforms/core';
import { TextInput } from './my-inputs.ts';

const inputs = [
  new TextInput({
    name: 'first_name',
    // usage: single validator
    validators: Validators.required
  }),
  new TextInput({
    name: 'last_name',
    // usage: array of validators
    validators: [ Validators.required ]
  }),
  new TextInput({
    name: 'age',
    // usage: multiple validators
    validators: [ Validators.required, Validators.min(18) ]
  })
];

```

## <a name="synchronous-validators"></a>Synchronous Validators

The basic type of validators are the `synchronous validators`. A synchronous validator is a simple function that receives a [control instance](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/form-controls.md) and returns an `Errors` object when the value is *invalid* or `null` if the value is *valid*.

An `Errors` object basically is like a map (contains `key`/`value` pairs):
```tsx
const myErrors = {
  min: {
    expected: 15,
    value: 8
  },
  foo: true,
  bar: {
    barData: 'bar'
  }
}
```

These errors will be passed to the components, and the `ErrorTranslator` can be used to convert these to *user friendly* error messages.

Let's look at a simple example validator:
```tsx
// should return `true` is the value is non-empty;
const myFancyRequiredValidator = (control: AbstractControl) => {
  const value = control.value;
  if (value === undefined) {
    return {
      required: 'undefined'
    };
  }
  if (value === undefined) {
    return {
      required: 'null'
    };
  }
  if (value === '') {
    return {
      required: 'empty'
    };
  }
  // otherwise it's valid; so no errors and should return null
  return null;
}
```

NOTE: This means, you can define your custom validators in the same way.

## <a name="builtin-validators"></a>Built-in Validators

The `@reactiveforms/core` library comes with some basic validators, so let's have a look. For more details usages, please see the source file [here](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/src/validation/validators.ts)

```tsx
import { Validators } from '@reaciveforms/core';

// already a function
const required = Validators.required;

// returns a function
const min100 = Validators.min(100);

// returns a function
const max355 = Validators.min(355);

// already a function
// NOTE: value should specifically be `true` (boolean value)
const requiredTrue = Validators.requiredTrue;

// already a function
const email = Validators.email;

// returns a function
const minLength10 = Validators.minLength(10);

// returns a function
const minLength34 = Validators.maxLength(34);

// returns a function
// NOTE: both strings and regex objects can be used
const patternPositiveInts = Validators.pattern('\d+'); // string
const patternNegativeInts = Validators.pattern(/-\d+/); // regex
```

## <a name="asynchronous-validators"></a>Asynchronous Validators

Imagine the scenario where you want to validate the user input with your server via an API. In this case, you would use the `asyncValidators` property instead of the `validators` property. You can of course, mix and match; include both `validators` and `asyncValidators` together for a given field too.

This package does not contain any pre-built asynchronous validators, since each validator will depend on your application alone.

Similar to the synchronous validators, you can pass multiple asynchronous validators, or individual ones.

NOTE: An "asynchronous validator" is expected to return a `Promise` that resolves to an `Errors` object or `null`.

Let's have a quick look:

```tsx
// -------------------
// my-sign-up-form.ts
// -------------------

import { InputGroup, Validators } from '@reactiveforms/core';
import { TextInput } from './my-inputs.ts';

const myApiService = getApiService();

// NOTE: this method returns a promise;
//       that talks to an API.
const uniqueUsernameValidator = (control) => {
  return new Promise((resolve) => {
    const username = control.value;

    const resolveWithError = () => {
      resolve({
        'username': 'not_unique' <--- custom error
      });
    };

    const resolveWithNoError = () => resolve(null);

    myApiService.checkUniqueUserName(username).then(success => {
      if (success) {
        resolveWithNoError();
      } else {
        resolveWithError();
      }
    }).catch(resolveWithNoError);
  });
}

const user = new InputGroup({
  name: 'user',
  inputs: [
    new TextInput({
      name: 'first_name',
      label: 'First Name',
      validators: Validators.required
    }),
    new TextInput({
      name: 'username',
      label: 'Username',
      validators: Validators.required,
      asyncValidators: uniqueUsernameValidator
    })
  ]
})

```