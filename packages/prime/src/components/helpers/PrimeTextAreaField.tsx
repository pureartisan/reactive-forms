import React, { forwardRef, ChangeEvent } from 'react';
import clsx from 'clsx';

import { InputTextarea } from 'primereact/inputtextarea';

import { BaseInputComponentProps, InputBase, BaseControl, getFirstErrorMsg } from '@reactiveforms/core';

import { TextInputBase } from '../../models/input-base';
import { getHelpText } from '../../utils/helpers';

interface PrimeTextAreaFieldProps<V extends string, I extends InputBase<V> = any, C extends BaseControl<V> = BaseControl<V>> extends BaseInputComponentProps<V, I, C> {
    cols?: number;
    rows?: number;
    rowsMax?: number;
    autoResize?: boolean;
}

export const PrimeTextAreaField = forwardRef(<V extends string, I extends TextInputBase<V>>(props: PrimeTextAreaFieldProps<V, I>, ref: any) => {
    const firstError = getFirstErrorMsg(props);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target?.value as unknown as V;
        props.control?.setValue(value, { emitEvent: false });
        if (value === props.input?.value) {
            props.control?.markAsPristine({ emitEvent: false });
        } else {
            props.control?.markAsDirty({ emitEvent: false });
        }
        props.control?.emitEvents();
    };

    const helpText = getHelpText(props.input, props.control, firstError);

    const inputSection = (
        <InputTextarea
            id={props.input?.id}
            placeholder={props.input?.placeholder}
            readOnly={props.input?.readonly}
            disabled={props.control?.disabled}
            value={props.control?.value}
            rows={props.rows}
            cols={props.cols}
            autoResize={props.autoResize}
            onChange={handleChange}
            className={props.input?.inputClassName}
            ref={ref}
        />
    );

    return (
        <div
            className={clsx(
                `rf-field rf-field-textarea rf-field-name-${props.input?.name} p-field`,
                props.input?.className,
                {
                    'p-col-12': !props.input?.className,
                    'input-empty': !props.control?.value
                }
            )}
        >
            {props.input?.label && (
                <label htmlFor={props.input?.id} className={props.input?.labelClassName}>
                    {props.input.label}
                </label>
            )}
            {inputSection}
            {helpText && (
                <small
                    className={clsx(
                        "rf-helper-text p-d-block",
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

PrimeTextAreaField.displayName = 'PrimeTextAreaField';
