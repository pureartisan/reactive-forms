import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { TextInputBase } from '../models/input-base';

import { PrimeTextAreaField } from './helpers/PrimeTextAreaField';

export class TextAreaInput extends TextInputBase<string> {
    cols?: number
    rows?: number
    rowsMax?: number
    autoResize?: boolean

    constructor(options: Partial<TextAreaInput>) {
        super(options);
        const defaultProps = this.defaultProps<TextAreaInput>();
        this.cols = options.cols ?? defaultProps.cols;
        this.rows = options.rows ?? defaultProps.rows;
        this.rowsMax = options.rowsMax ?? defaultProps.rowsMax;
        this.autoResize = options.autoResize ?? defaultProps.autoResize;
    }
}

export const TextAreaField = forwardRef((props: BaseInputComponentProps<string, TextAreaInput>, ref: any) => {
    return (
        <PrimeTextAreaField
            {...props}
            ref={ref}
        />
    );
});

TextAreaField.displayName = 'TextAreaField';
