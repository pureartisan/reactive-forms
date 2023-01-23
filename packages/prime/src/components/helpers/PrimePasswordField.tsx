import React, { forwardRef, ChangeEvent } from 'react';
import clsx from 'clsx';

import { Password } from 'primereact/password';

import {BaseInputComponentProps, InputBase, BaseControl, getFirstErrorMsg, fieldCssCls} from '@reactiveforms/core';

import { TextInputBase } from '../../models/input-base';
import {getHelpText} from '../../utils/helpers';

interface PrimePasswordFieldProps<V extends string, I extends InputBase<V> = any, C extends BaseControl<V> = BaseControl<V>> extends BaseInputComponentProps<V, I, C> {
    inputType?: string;
    panelClassName?: string;
    promptLabel?: string;
    weakLabel?: string;
    mediumLabel?: string;
    strongLabel?: string;
    mediumRegex?: string;
    strongRegex?: string;
    feedback?: boolean;
    toggleMask?: boolean;
}

export const PrimePasswordField = forwardRef(<V extends string, I extends TextInputBase<V>>(props: PrimePasswordFieldProps<V, I>, ref: any) => {
    const firstError = getFirstErrorMsg(props);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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

    return (
        <div
            className={clsx(
                'field',
                fieldCssCls(props.input, props.inputType),
                props.input?.className,
                {
                    'col-12': !props.input?.className,
                    'input-empty': !props.control?.value,
                }
            )}
        >
            {props.input?.label && (
                <label htmlFor={props.input?.id} className={props.input?.labelClassName}>
                    {props.input.label as any}
                </label>
            )}
            <Password
                id={props.input?.id}
                placeholder={props.input?.placeholder}
                readOnly={props.input?.readonly}
                disabled={props.control?.disabled}
                toggleMask={props.toggleMask}
                feedback={props.feedback}
                panelClassName={props.panelClassName}
                promptLabel={props.promptLabel}
                weakLabel={props.weakLabel}
                mediumLabel={props.mediumLabel}
                strongLabel={props.strongLabel}
                mediumRegex={props.mediumRegex}
                strongRegex={props.strongRegex}
                value={props.control?.value}
                onChange={handleChange}
                inputClassName="w-full"
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

PrimePasswordField.displayName = 'PrimePasswordField';
