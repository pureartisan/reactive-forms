# Example: Simple Form

The following exmaple demonstrates a simple "user info" form.

```tsx
import React from 'react';

import { Form, FormBuilder, Validators, useForm } from '@reaciveforms/core';
import { MuiReactiveForm, TextInput, EmailInput } from '@admin/forms/mui';

interface UserModel {
  firstName: string;
  lastName: string;
  email: string;
}

// e.g. you API requires this
interface MyFormModel {
  first_name: string;
  last_name: string;
  email: string;
}

const buildForm = (user?: UserModel): Form => FormBuilder.build([
  new TextInput({
    name: 'first_name',
    label: 'First Name',
    placeholder: 'Enter first name',
    value: user?.firstName,
    validators: Validators.required
  }),
  new TextInput({
    name: 'last_name',
    label: 'Last Name',
    placeholder: 'Enter last name',
    value: user?.lastName,
    validators: Validators.required
  }),
  new EmailInput({
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email',
    value: user?.email,
    validators: [ Validators.required, Validators.email ]
  })
]);

interface UserInfoProps {
  user?: UserModel
}

export const UserInfoComponent = (props: UserInfoProps) => {

  const { user } = props;

  // build the form whenever the `user` changes.
  // (the syntax is very similar to the `useEffect` hook)
  const form = useForm<MyFormModel>(() => buildForm(user), [user]);

  return (
    <MuiReactiveForm form={form} />
  );
};
```

The `useForm` hook also takes an optional third argument, that gives access to some event handlers at a form level.

```tsx

  const form = useForm(
    // build form method
    () => buildForm(user),
    // build/rebuild form when the following variables change
    // similar to `useEffect` hook
    [user],
    // other event handlers for the form
    {
      // triggered when any of the values changed
      valueChanges: (f: Form) => {
        console.log('form values changed', {
          value: f.value,
          isValid: f.valid,
          isDirty: f.dirty
        })
      },
      statusChanges: (f: Form) => {
        console.log('form status changed', {
          value: f.value,
          isValid: f.valid,
          isDirty: f.dirty
        })
      }
    }
  );

```

Let's add a submit button and only allow submitting the form if it's valid according to the validators.

```tsx

import { useState } from 'react';

export const UserInfoComponent = (props: UserInfoProps) => {

  const { user } = props;

  const [ canSubmit, setCanSubmit ] = useState(true);

  // build the form whenever the `user` changes.
  // (the syntax is very similar to the `useEffect` hook)
  const form = useForm<MyFormModel>(
    () => buildForm(user),
    [user],
    {
      statusChanges: (f: Form) => {
        setCanSubmit(Boolean(f?.valid));
      }
    }
  );

  const handleSubmit = () => {
    const formToSubmit: MyFormModel = form.value;
    // submit form via API, but for now let's just log it to console
    console.log('formToSubmit', formToSubmit);
  };

  return (
    <div className="my-simple-form">
      <MuiReactiveForm form={form} />
      <button disabled={!canSubmit} onClick={handleSubmit}>Submit</button>
    </div>
  );
};

```
