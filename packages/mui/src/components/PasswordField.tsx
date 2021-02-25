import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { TextInputBase } from '../models/input-base';

import { MuiTextField } from './helpers/MuiTextField';

export class PasswordInput extends TextInputBase<string> {
    constructor(options: Partial<PasswordInput>) {
        super(options);
    }
}

export const PasswordField = forwardRef((props: BaseInputComponentProps<string, PasswordInput>, ref: any) => {
    return (
        <MuiTextField
            {...props}
            ref={ref}
            type="password"
        />
    );
});

PasswordField.displayName = 'PasswordField';