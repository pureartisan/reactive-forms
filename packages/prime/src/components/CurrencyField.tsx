import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { TextInputBase } from '../models/input-base';

import { PrimeTextField } from './helpers/PrimeTextField';

export class CurrencyInput extends TextInputBase<string> {

    currencyIcon?: any;
    alignIcon?: 'left' | 'right';

    constructor(options: Partial<CurrencyInput>) {
        super(options);

        const defaultProps = this.defaultProps<CurrencyInput>();

        this.currencyIcon = options.currencyIcon ?? defaultProps.currencyIcon;
        this.alignIcon = options.alignIcon ?? defaultProps.alignIcon ?? 'left';
    }
}

export const CurrencyField = forwardRef((props: BaseInputComponentProps<string, CurrencyInput>, ref: any) => {

    const showIcon = Boolean(props.input?.currencyIcon);

    return (
        <PrimeTextField
            {...props}
            ref={ref}
            type="text"
            inputType="CurrencyField"
            leftIcon={showIcon && props.input?.alignIcon === 'left' && (
                props.input?.currencyIcon
            )}
            rightIcon={showIcon && props.input?.alignIcon === 'right' && (
                props.input?.currencyIcon
            )}
            leftIconClassName="currency-symbol"
            rightIconClassName="currency-symbol"
        />
    );
});

CurrencyField.displayName = 'CurrencyField';
