import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { TextInputBase } from '../models/input-base';

import { PrimeTextField } from './helpers/PrimeTextField';

export class EmailInput extends TextInputBase<string> {
    constructor(options: Partial<EmailInput>) {
        super(options);
    }
}

export const EmailField = forwardRef((props: BaseInputComponentProps<string, EmailInput>, ref: any) => {
    return (
        <PrimeTextField
            {...props}
            ref={ref}
            type="email"
        />
    );
});

EmailField.displayName = 'EmailField';
