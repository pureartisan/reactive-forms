import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { BaseInputComponentProps, InputBase, BaseControl, getFirstErrorMsg } from '@reactiveforms/core';

import { BooleanInputBase } from '../../models/input-base';

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
        if (value === props.input?.value) {
            props.control?.markAsPristine({ emitEvent: false });
        } else {
            props.control?.markAsDirty({ emitEvent: false });
        }
        props.control?.emitEvents();
    };

    const helpText = firstError || props.input?.helpText;

    const Input = props.component;

    return (
        <div
            className={clsx(
                `rf-field rf-field-${props.inputType}`,
                props.className,
                props.input?.className,
                { 'p-col-12': !props.input?.className }
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
                    {props.input.label}
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
