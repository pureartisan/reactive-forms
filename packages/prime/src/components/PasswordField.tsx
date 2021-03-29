import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { TextInputBase } from '../models/input-base';

import { PrimeTextField } from './helpers/PrimeTextField';

export class PasswordInput extends TextInputBase<string> {
    constructor(options: Partial<PasswordInput>) {
        super(options);
    }
}

export const PasswordField = forwardRef((props: BaseInputComponentProps<string, PasswordInput>, ref: any) => {
    return (
        <PrimeTextField
            {...props}
            ref={ref}
            type="password"
        />
    );
});

PasswordField.displayName = 'PasswordField';