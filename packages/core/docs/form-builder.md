# Form Builder

The form builder is the main helper/service that converts your [inputs](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/inputs.md) into a [`Form`](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/form-controls.md#Form) object.

There is one main method, that is expected to be used in your application regularly:
* [`build`](#build)

There are also some other helper methods, that are only provided to help you extend this library if needed. However, these would be only be used in very rare cases. For more information, please see the source file [here](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/src/builders/form.ts).
* `buildFormGroup`
* `buildFormArray`
* `buildFormControl`


## <a name="build"></a>build()

The build method should be used when converting your [inputs](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/inputs.md) into a [`Form`](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/form-controls.md#Form) object.

```tsx
import { FormBuilder } from '@reaciveforms/core';
import { TextInput } from './my-inputs.ts';

const buildForm = () => {
  return FormBuilder.build([
    new TextInput({
      name: 'first_name'
    }),
    new TextInput({
      name: 'last_name'
    })
  ]);
}
```

For a more elaborated example, please see [here](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/examples/simple-form.md)

## Previous form state

Sometimes, we may need to re-build a form, but also preserve the previous state of that form that the user may have already interacted with (some fields been touched/updated).

You can simply achieve this by passing the previous `form` state as the second argument, and the form builder will consider this in the final `Form` object that's built.

```tsx
import { Form, FormBuilder, useForm } from '@reaciveforms/core';

const buildForm = (prevState: Form) => {
  return FormBuilder.build([
    new TextInput({
      name: 'first_name'
    }),
    new TextInput({
      name: 'last_name'
    })
  ], prevState);
}

```