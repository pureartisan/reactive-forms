import React from 'react';
import clsx from "clsx";

import { ReactiveForm, Form, AbstractControl, ErrorTranslators } from '@reactiveforms/core';

interface StyledFormProps {
    elementType?: any;
    children?: any
    className?: any;
}

const StyledForm = (props: StyledFormProps) => {
    const FormTag = (props.elementType ?? 'div') as keyof JSX.IntrinsicElements;
    return (
        <FormTag
            {...props}
            className={clsx("formgrid grid", props.className)}
        />
    );
};

interface PrimeReactiveFormProps {
    form?: Form<any> | AbstractControl<any>
    className?: string;
    style?: any;
    elementType?: any;
    errorsOnlyIfNotPristine?: boolean;
    errorTranslators?: ErrorTranslators;
}


export const PrimeReactiveForm = (props: PrimeReactiveFormProps): JSX.Element => {
    return (
        <ReactiveForm
            {...props}
            component={StyledForm}
        />
    );
};

PrimeReactiveForm.displayName = 'PrimeReactiveForm';
