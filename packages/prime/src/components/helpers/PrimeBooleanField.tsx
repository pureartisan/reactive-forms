import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { BaseInputComponentProps, InputBase, BaseControl, getFirstErrorMsg } from '@reactiveforms/core';

import { BooleanInputBase } from '../../models/input-base';
import { getHelpText } from '../../utils/helpers';

interface PrimeBooleanFieldProps<I extends InputBase<boolean> = any, C extends BaseControl<boolean> = BaseControl<boolean>> extends BaseInputComponentProps<boolean, I, C> {
    className?: string;
    inputType?: string;
    component: any
    valueGetter?: (event: any) => boolean;
}

export const PrimeBooleanField = forwardRef(<I extends BooleanInputBase>(props: PrimeBooleanFieldProps<I>, ref: any) => {
    const firstError = getFirstErrorMsg(props);

    const handleChange = (event: any) => {
        const checked = props.valueGetter ? props.valueGetter(event) : (event.checked || event.value);
        props.control?.setValue(checked, { emitEvent: false });
        if (checked === props.input?.value) {
            props.control?.markAsPristine({ emitEvent: false });
        } else {
            props.control?.markAsDirty({ emitEvent: false });
        }
        props.control?.emitEvents();
    };

    const helpText = getHelpText(props.input, props.control, firstError);

    const Input = props.component;

    return (
        <div
            className={clsx(
                `rf-field rf-field-${props.inputType} rf-field-name-${props.input?.name}`,
                props.className,
                props.input?.className,
                {
                    'col-12': !props.input?.className,
                    'boolean-true': props.control?.value,
                    'boolean-false': !props.control?.value
                }
            )}
        >
            <Input
                inputId={props.input?.id}
                disabled={props.control?.disabled}
                readOnly={props.input?.readonly}
                checked={props.control?.value}
                onChange={handleChange}
                className={clsx(props.input?.inputClassName, {
                    'p-invalid': firstError
                })}
                ref={ref}
            />
            {props.input?.label && (
                <label
                    htmlFor={props.input?.id}
                    className={props.input?.labelClassName}
                >
                    {props.input.label as any}
                </label>
            )}
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

PrimeBooleanField.displayName = 'PrimeBooleanField';
