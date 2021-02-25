import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { TextInputBase } from '../models/input-base';

import { MuiTextField } from './helpers/MuiTextField';

export class TextInput extends TextInputBase<string> {
    constructor(options: Partial<TextInput>) {
        super(options);
    }
}

export const TextField = forwardRef((props: BaseInputComponentProps<string, TextInput>, ref: any) => {
    return (
        <MuiTextField
            {...props}
            ref={ref}
            type="text"
        />
    );
});

TextField.displayName = 'TextField';