import React from "react";

import { Form, FormGroup, AbstractControl } from "../models/forms";

import { Field } from "./fields";

interface ReactiveFormProps {
  form?: Form | AbstractControl<any>;
  component?: any;
  className?: string;
  style?: any;
}

const DefaultForm = (props: any) => <form {...props} />;

export const ReactiveForm = (props: ReactiveFormProps): JSX.Element | null => {
  if (!props.form) {
    return null;
  }

  const { form, component, ...rest } = props;
  const F = component ?? DefaultForm;

  let inputs;
  if (form instanceof Form) {
    inputs = form?.inputs;
  } else if (form instanceof FormGroup) {
    inputs = form?.group?.inputs;
  }

  return (
    <F {...rest}>
      {inputs?.map((inp) => {
        const ctrl = inp?.name ? props.form?.get(inp.name) : undefined;
        return <Field key={inp?.name} input={inp} control={ctrl} />;
      })}
    </F>
  );
};
