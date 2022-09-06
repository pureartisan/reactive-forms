import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { TextInputBase } from '../models/input-base';

import { PrimeCalendarField } from './helpers/PrimeCalendarField';

export class DateInput extends TextInputBase<Date> {
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
    showTime?: boolean;
    hourFormat?: number;

    constructor(options: Partial<DateInput>) {
        super(options);
        const defaultProps = this.defaultProps<DateInput>();
        this.icon = options.icon ?? defaultProps.icon;
        this.showDefaultIcon = options.showDefaultIcon ?? defaultProps.showDefaultIcon;
        this.minDate = options.minDate ?? defaultProps.minDate;
        this.maxDate = options.maxDate ?? defaultProps.maxDate;
        this.maxDateCount = options.maxDateCount ?? defaultProps.maxDateCount;
        this.disabledDates = options.disabledDates ?? defaultProps.disabledDates;
        this.disabledDays = options.disabledDays ?? defaultProps.disabledDays;
        this.showButtonBar = options.showButtonBar ?? defaultProps.showButtonBar;
        this.showOnFocus = options.showOnFocus ?? defaultProps.showOnFocus;
        this.showWeek = options.showWeek ?? defaultProps.showWeek;
        this.dateFormat = options.dateFormat ?? defaultProps.dateFormat;
        this.showTime = options.showTime ?? defaultProps.showTime;
        this.hourFormat = options.hourFormat ?? defaultProps.hourFormat;
    }
}

export const DateField = forwardRef((props: BaseInputComponentProps<any, DateInput>, ref: any) => {
    return (
        <PrimeCalendarField
            {...props}
            ref={ref}
            selectionMode="single"
            inputType="DateField"
            icon={props.input?.icon}
            showDefaultIcon={props.input?.showDefaultIcon}
            disabledDates={props.input?.disabledDates}
            disabledDays={props.input?.disabledDays}
            showButtonBar={props.input?.showButtonBar}
            showOnFocus={props.input?.showOnFocus}
            showWeek={props.input?.showWeek}
            dateFormat={props.input?.dateFormat}
            maxDateCount={props.input?.maxDateCount}
            showTime={props.input?.showTime}
            hourFormat={props.input?.hourFormat}
        />
    );
});

DateField.displayName = 'DateField';
