import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { TextInputBase } from '../models/input-base';

import { PrimeCalendarField } from './helpers/PrimeCalendarField';

export class DateInput extends TextInputBase<Date> {
    icon?: any;

    constructor(options: Partial<DateInput>) {
        super(options);
        const defaultProps = this.defaultProps<DateInput>();
        this.icon = options.icon ?? defaultProps.icon;
    }
}

export const DateField = forwardRef((props: BaseInputComponentProps<any, DateInput>, ref: any) => {
    return (
        <PrimeCalendarField
            {...props}
            ref={ref}
            selectionMode="single"
            inputType="DateField"
            icon={props.input?.icon}
        />
    );
});

DateField.displayName = 'DateField';
