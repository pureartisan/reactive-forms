import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { Dropdown } from 'primereact/dropdown';

import {BaseInputComponentProps, InputBase, BaseControl, getFirstErrorMsg, fieldCssCls} from '@reactiveforms/core';

import { SelectInputBase } from '../../models/input-base';
import { getHelpText } from '../../utils/helpers';

interface PrimeSelectFieldProps<V extends string, I extends InputBase<V> = any, C extends BaseControl<V> = BaseControl<V>> extends BaseInputComponentProps<V, I, C> {
    type?: string;
    inputType?: string;
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

    const helpText = getHelpText(props.input, props.control, firstError);

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
            className={clsx('w-full', props.input?.inputClassName)}
            panelClassName="PrimeSelectFieldPanel"
            ref={ref}
        />
    );

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
            {inputSection}
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

PrimeSelectField.displayName = 'PrimeSelectField';
