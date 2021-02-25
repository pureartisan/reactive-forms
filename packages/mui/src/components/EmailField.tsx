import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { TextInputBase } from '../models/input-base';

import { MuiTextField } from './helpers/MuiTextField';

export class EmailInput extends TextInputBase<string> {
    constructor(options: Partial<EmailInput>) {
        super(options);
    }
}

export const EmailField = forwardRef((props: BaseInputComponentProps<string, EmailInput>, ref: any) => {
    return (
        <MuiTextField
            {...props}
            ref={ref}
            type="email"
        />
    );
});

EmailField.displayName = 'EmailField';
