# Hooks

This library depends on react hooks and provides one main hook: `useForm`.

The `useForm` hook takes in the following arguments:
* [`form build method` (required)](#form-build-method)
* [`dependency list` (optional)](#dependency-list)
* [`callbacks` (optional)](#callbacks)

### <a name="form-build-method"></a>`form build method`

This is the main part of the hook. It expects a method that will be called to generate the [`Form`](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/form-controls.md#Form) object.

```tsx
import React from 'react';

import { ReactiveForm, Form, useForm } from '@reaciveforms/core';
import { TextInput } from './my-inputs';

const buildForm = (): Form => FormBuilder.build([
  new TextInput({
    name: 'first_name'
  }),
  new TextInput({
    name: 'last_name'
  }),
  new EmailInput({
    name: 'email'
  })
]);

const MyComponent = () => {
  const form = useForm(() => buildForm());

  return (
    <ReactiveForm form={form} />
  );
}
```

NOTE: By default, the form will be rebuild every time the component is rendered (rendering values are calculated). However, this may not be necessary and we may only want to build it only once or only when some other variable changes. Please see the [`dependency list` (optional)](#dependency-list) section for more information.

### <a name="dependency-list"></a>`dependency list`

The dependency list works in the exact way the dependency list works in the built-in react [`useEffect` hook](https://reactjs.org/docs/hooks-effect.html).

So if the form needs to only be built once, then pass in an empty array as the second argument to the `useForm` hook:

```tsx
const MyComponent = () => {
  const form = useForm(() => buildForm(), []);

  return (
    ...
  );
}
```

However, there maybe times when the form needs to be re-built whenever another variable changes. Let's have a look at the example below:

```tsx
interface UserModel {
  firstName: string;
  lastName: string;
  email: string;
}

// form depends on the given `user` model
const buildForm = (user?: UserModel): Form => FormBuilder.build([
  new TextInput({
    name: 'first_name',
    value: user?.firstName
  }),
  new TextInput({
    name: 'last_name',
    value: user?.lastName
  }),
  new EmailInput({
    name: 'email',
    value: user?.email
  })
]);

interface Props {
  user?: UserModel;
}

const MyComponent = (props: Props) => {
  const { user } = props;

  // the form needs to be rebuilt whenever the `user` changes
  const form = useForm(() => buildForm(user), [user]);

  return (
    ...
  );
}
```

### <a name="callbacks"></a>`callbacks`

The third argument, which is optional, accepts an object in the shape:
```tsx
type Options = {
  valueChanges?: <T>(form: Form<T>) => void;
  statusChanges?: <T>(form: Form<T>) => void;
};
```

The appropriate *callback* get triggered whenever the form *values* or the *state* changes.

```tsx

const MyComponent = (props) => {
  const { user } = props;

  const form = useForm(
    () => buildForm(user),
    [user],
    {
      valueChanges: (f: Form) => {
        // some field has changed,
        // therefore the form value has changed
        console.log(f.value, f.valid, f.dirty);
      },
      statusChanges: (f: Form) => {
        // some field has changed/touched,
        // therefore the form status has changed
        console.log(f.value, f.valid, f.dirty);
      }
    }
  );

  ...
}

```

NOTE: These callbacks can be used to show the user visual feedback such as a notification, or an error message, etc.

## TypeScript type validation

The `useForm` provides a *generic* interface so that the returned `Form` object's value can be of a particular type. The following example covers this:

```tsx

interface UserModel {
  firstName: string;
  lastName: string;
  email: string;
}

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
}

// form values would fulfill the `UserFormData` interface
const buildForm = (user?: UserModel): Form<UserFormData> => FormBuilder.build([
  new TextInput({
    name: 'first_name', // satisfies `UserFormData`
    value: user?.firstName
  }),
  new TextInput({
    name: 'last_name', // satisfies `UserFormData`
    value: user?.lastName
  }),
  new EmailInput({
    name: 'email', // satisfies `UserFormData`
    value: user?.email
  })
]);

const MyComponent = (props: Props) => {
  const { user } = props;

  // NOTE: calling `form.value` will return an object of type `UserFormData`
  const form: Form<UserFormData> = useForm(
    () => buildForm(user),
    [user]
  );

  return (
    ...
  );
}
```