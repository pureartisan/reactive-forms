import React, { forwardRef } from 'react';
// import mobile from 'is-mobile';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { SelectInputBase } from '../models/input-base';

import { PrimeSelectField } from './helpers/PrimeSelectField';

// const isMobile = mobile();

export class SelectInput extends SelectInputBase<string, string> {
    constructor(options: Partial<SelectInput>) {
        super(options);
    }
}

export const SelectField = forwardRef((props: BaseInputComponentProps<string, SelectInput>, ref: any) => {
    return (
        <PrimeSelectField
            {...props}
            ref={ref}
            type="text"
            inputType="SelectField"
        />
    );
});

SelectField.displayName = 'SelectField';
