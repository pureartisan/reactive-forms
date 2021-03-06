import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { Calendar } from 'primereact/calendar';

import { BaseInputComponentProps, InputBase, BaseControl, getFirstErrorMsg } from '@reactiveforms/core';

import { TextInputBase } from '../../models/input-base';

type SelectionMode = 'single' | 'multiple' | 'range';

interface PrimeCalendarFieldProps<V extends any, I extends InputBase<V> = any, C extends BaseControl<V> = BaseControl<V>> extends BaseInputComponentProps<V, I, C> {
    inputType?: string;
    selectionMode?: SelectionMode;
    helperText?: string;
    icon?: any;
    showDefaultIcon?: boolean;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
    disabledDays?: number[];
    showButtonBar?: boolean;
    showOnFocus?: boolean;
    showWeek?: boolean;
    dateFormat?: string;
    maxDateCount?: number;
}

export const PrimeCalendarField = forwardRef(<V, I extends TextInputBase<V>>(props: PrimeCalendarFieldProps<V, I>, ref: any) => {
    const firstError = getFirstErrorMsg(props);

    const handleChange = (event: any) => {
        const value = event.value as unknown as V;
        const date = value as unknown as Date;
        const prevDate = props.input?.value as unknown as Date;
        props.control?.setValue(value, { emitEvent: false });
        if ((!date && !props.input?.value) || date?.getTime() === prevDate?.getTime()) {
            props.control?.markAsPristine({ emitEvent: false });
        } else {
            props.control?.markAsDirty({ emitEvent: false });
        }
        props.control?.emitEvents();
    };

    const helpText = firstError || props.input?.helpText;

    const inputSection = (
        <Calendar
            id={props.input?.id}
            placeholder={props.input?.placeholder}
            readOnlyInput={props.input?.readonly}
            disabled={props.control?.disabled}
            value={props.control?.value as any}
            onChange={handleChange}
            className={props.input?.inputClassName}
            selectionMode={props.selectionMode}
            showIcon={Boolean(props.icon || props.showDefaultIcon)}
            icon={props.icon}
            showOnFocus={props.showOnFocus}
            showWeek={props.showWeek}
            dateFormat={props.dateFormat}
            maxDateCount={props.maxDateCount}
            minDate={props.minDate}
            maxDate={props.maxDate}
            disabledDates={props.disabledDates}
            disabledDays={props.disabledDays}
            showButtonBar={props.showButtonBar}
            panelClassName="PrimeCalendarFieldPanel"
            ref={ref}
        />
    );

    return (
        <div
            className={clsx(
                `rf-field rf-field-${props.inputType} p-field`,
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

PrimeCalendarField.displayName = 'PrimeCalendarField';
