import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { TextInputBase } from '../models/input-base';

import { PrimeTextField } from './helpers/PrimeTextField';

export class TextInput extends TextInputBase<string> {
    constructor(options: Partial<TextInput>) {
        super(options);
    }
}

export const TextField = forwardRef((props: BaseInputComponentProps<string, TextInput>, ref: any) => {
    return (
        <PrimeTextField
            {...props}
            ref={ref}
            type="text"
            inputType="TextField"
        />
    );
});

TextField.displayName = 'TextField';