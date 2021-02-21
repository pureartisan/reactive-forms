# Example: Split Form

The following example demonstrates how a form can be split into multiple parts for rendering purposes.

```tsx
import React from 'react';

import { Form, FormBuilder, Validators, useForm, InputGroup } from '@reaciveforms/core';
import { MuiReactiveForm, TextInput } from '@reaciveforms/mui';

interface UserModel {
  firstName: string;
  lastName: string;
  address: {
    line1: string
    line2: string
  }
}

const buildForm = (user?: UserModel): Form => FormBuilder.build([
  new InputGroup({
    name: 'name',
    inputs: [
      new TextInput({
        name: 'first_name',
        label: 'First Name',
        value: user?.firstName
      }),
      new TextInput({
        name: 'last_name',
        label: 'Last Name'
        value: user?.lastName
      })
    ]
  }),
  new InputGroup({
    name: 'address',
    inputs: [
      new TextInput({
        name: 'line_1',
        label: 'Line 1'
        value: user?.address?.line1
      }),
      new TextInput({
        name: 'line_2',
        label: 'Line 2',
        value: user?.address?.line2
      })
    ]
  }),
]);

interface UserInfoProps {
  user?: UserModel
}

export const UserInfoComponent = (props: UserInfoProps) => {

  const { user } = props;

  // form contains both `name` and `address` groups, so all
  // value changes and statuses are considered as one form
  const form = useForm<MyFormModel>(() => buildForm(user), [user]);

  return (
    <MyGrid>
      <MyColumn>
        <MuiReactiveForm form={form.get('name')} />
      </MyColumn>
      <MyColumn>
        <MuiReactiveForm form={form.get('address')} />
      </MyColumn>
    </MyGrid>
  );
};
```
