

import React from 'react';

import { ReactiveForm, AbstractControl } from '@reactiveforms/core';

interface StyledFormProps {
    children?: any
}

const StyledForm = (props: StyledFormProps) => {
    return (
        <form
            className="p-fluid p-formgrid p-grid"
            {...props}
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
