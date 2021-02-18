# Validation

// TODO


### Asynchronous Validation

Image the scenario where you want to validate the user input with your server via an API. In this case, you would use the `asyncValidators` property instead of the `validators` property. You can of course, mix and match; include both `validators` and `asyncValidators` together for a given field too.

This package does not contain any pre-built asynchronous validators, since each validator will depend on your project alone.

Similar to the validators, you can pass multiple asynchronous avalidators, or individual ones (as shown in the example below).

NOTE: An "asynchronous validator" is expected to return a `Promise`, and the

Let's have a quick look:

```tsx
// -------------------
// my-sign-up-form.ts
// -------------------

import { InputGroup, Validators } from '@reactiveforms/core';
import { TextInput } from './my-inputs.ts';

cosnt myApiService = getApiService();

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