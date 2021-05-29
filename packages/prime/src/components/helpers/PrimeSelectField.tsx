import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { Dropdown } from 'primereact/dropdown';

import { BaseInputComponentProps, InputBase, BaseControl, getFirstErrorMsg } from '@reactiveforms/core';

import { SelectInputBase } from '../../models/input-base';

interface PrimeSelectFieldProps<V extends string, I extends InputBase<V> = any, C extends BaseControl<V> = BaseControl<V>> extends BaseInputComponentProps<V, I, C> {
    type?: string;
    inputType?: string;
    helperText?: string;
}

export const PrimeSelectField = forwardRef(<V extends string, I extends SelectInputBase<V, V>>(props: PrimeSelectFieldProps<V, I>, ref: any) => {
    const firstError = getFirstErrorMsg(props);

    const handleChange = (event: any) => {
        const value = event.value as unknown as V;
        props.control?.setValue(value, { emitEvent: false });
        if (value === props.input?.value) {
            props.control?.markAsPristine({ emitEvent: false });
        } else {
            props.control?.markAsDirty({ emitEvent: false });
        }
        props.control?.emitEvents();
    };

    const helpText = firstError || props.input?.helpText;

    const inputSection = (
        <Dropdown
            id={props.input?.id}
            placeholder={props.input?.placeholder}
            disabled={props.control?.disabled}
            value={props.control?.value}
            optionLabel="label"
            optionValue="value"
            options={props.input?.options}
            onChange={handleChange}
            className={props.input?.inputClassName}
            panelClassName="PrimeSelectFieldPanel"
            ref={ref}
        />
    );

    return (
        <div
            className={clsx(
                `rf-field rf-field-${props.inputType} p-field`,
                props.input?.className,
                {
                    'p-col-12': !props.input?.className
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

PrimeSelectField.displayName = 'PrimeSelectField';
