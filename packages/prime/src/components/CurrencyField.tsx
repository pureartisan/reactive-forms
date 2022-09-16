import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { TextInputBase } from '../models/input-base';

import { PrimeNumberField } from './helpers/PrimeNumberField';

export class CurrencyInput extends TextInputBase<number> {
    currency?: string;
    currencyDisplay?: string;
    useGrouping?: boolean;
    min?: number;
    max?: number;
    minFractionDigits?: number;
    maxFractionDigits?: number;
    mode?: string;
    locale?: string;
    prefix?: string;
    suffix?: string;

    constructor(options: Partial<CurrencyInput>) {
        super(options);

        const defaultProps = this.defaultProps<CurrencyInput>();

        this.currency = options.currency ?? defaultProps.currency;
        this.currencyDisplay = options.currencyDisplay ?? defaultProps.currencyDisplay;
        this.useGrouping = options.useGrouping ?? defaultProps.useGrouping;
        this.min = options.min ?? defaultProps.min;
        this.max = options.max ?? defaultProps.max;
        this.minFractionDigits = options.minFractionDigits ?? defaultProps.minFractionDigits;
        this.maxFractionDigits = options.maxFractionDigits ?? defaultProps.maxFractionDigits;
        this.mode = options.mode ?? defaultProps.mode;
        this.locale = options.locale ?? defaultProps.locale;
        this.prefix = options.prefix ?? defaultProps.prefix;
        this.suffix = options.suffix ?? defaultProps.suffix;
    }
}

export const CurrencyField = forwardRef((props: BaseInputComponentProps<number, CurrencyInput>, ref: any) => {
    return (
        <PrimeNumberField
            {...props}
            ref={ref}
            inputType="CurrencyField"
            currency={props.input?.currency}
            currencyDisplay={props.input?.currencyDisplay}
            useGrouping={props.input?.useGrouping}
            min={props.input?.min}
            max={props.input?.max}
            minFractionDigits={props.input?.minFractionDigits}
            maxFractionDigits={props.input?.maxFractionDigits}
            mode={props.input?.mode}
            locale={props.input?.locale}
            prefix={props.input?.prefix}
            suffix={props.input?.suffix}
        />
    );
});

CurrencyField.displayName = 'CurrencyField';
