import React, { forwardRef } from 'react';
import clsx from 'clsx';

import {InputNumber, InputNumberChangeParams} from "primereact/inputnumber";

import {BaseInputComponentProps, InputBase, BaseControl, getFirstErrorMsg, fieldCssCls} from '@reactiveforms/core';

import { TextInputBase } from '../../models/input-base';
import { getHelpText } from '../../utils/helpers';

interface PrimeNumberFieldProps<V extends number, I extends InputBase<V> = any, C extends BaseControl<V> = BaseControl<V>> extends BaseInputComponentProps<V, I, C> {
    inputType?: string;
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
}

export const PrimeNumberField = forwardRef(<V extends number, I extends TextInputBase<V>>(props: PrimeNumberFieldProps<V, I>, ref: any) => {
    const firstError = getFirstErrorMsg(props);

    const handleChange = (event: InputNumberChangeParams) => {
        const value = event?.value as unknown as V;
        props.control?.setValue(value, { emitEvent: false });
        if (value === props.input?.value) {
            props.control?.markAsPristine({ emitEvent: false });
        } else {
            props.control?.markAsDirty({ emitEvent: false });
        }
        props.control?.emitEvents();
    };

    const helpText = getHelpText(props.input, props.control, firstError);

    return (
        <div
            className={clsx(
                'field',
                fieldCssCls(props.input, props.inputType),
                props.input?.className,
                {
                    'col-12': !props.input?.className,
                    'input-empty': !props.control?.value
                }
            )}
        >
            {props.input?.label && (
                <label htmlFor={props.input?.id} className={props.input?.labelClassName}>
                    {props.input.label as any}
                </label>
            )}
            <InputNumber
                id={props.input?.id}
                placeholder={props.input?.placeholder}
                readOnly={props.input?.readonly}
                disabled={props.control?.disabled}
                value={props.control?.value}
                onChange={handleChange}
                currency={props.currency}
                currencyDisplay={props.currencyDisplay}
                useGrouping={props.useGrouping}
                min={props.min}
                max={props.max}
                minFractionDigits={props.minFractionDigits}
                maxFractionDigits={props.maxFractionDigits}
                mode={props.mode}
                locale={props.locale}
                prefix={props.prefix}
                suffix={props.suffix}
                className={clsx('w-full', props.input?.inputClassName)}
                ref={ref}
            />
            {helpText && (
                <small
                    className={clsx(
                        "rf-helper-text block",
                        { 'p-error': firstError },
                        props.input?.hintClassName
                    )}
                >
                    {helpText}
                </small>
            )}
        </div>
    );
});

PrimeNumberField.displayName = 'PrimeNumberField';
