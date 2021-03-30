

import React from 'react';

import { ReactiveForm, AbstractControl } from '@reactiveforms/core';

interface StyledFormProps {
    type?: keyof JSX.IntrinsicElements;
    children?: any
    className?: any;
}

const StyledForm = (props: StyledFormProps) => {
    const FormTag = (props.type ?? 'form') as keyof JSX.IntrinsicElements;
    return (
      <FormTag
          {...props}
          className="p-fluid p-formgrid p-grid"
      />
    );
};


interface PrimeReactiveFormProps {
    form?: AbstractControl<any, any>
    className?: string;
    style?: any;
}


export const PrimeReactiveForm = (props: PrimeReactiveFormProps): JSX.Element => {
    return (
        <ReactiveForm
            {...props}
            component={StyledForm}
        />
    );
};
