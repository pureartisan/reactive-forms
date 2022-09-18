import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { TextInputBase } from '../models/input-base';

import { PrimeCalendarField } from './helpers/PrimeCalendarField';

export type HourFormat = '12' | '24';

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
    locale?: string;
    dateFormat?: string;
    maxDateCount?: number;
    showTime?: boolean;
    hourFormat?: HourFormat;
    baseZIndex?: number;

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
        this.locale = options.locale ?? defaultProps.locale;
        this.dateFormat = options.dateFormat ?? defaultProps.dateFormat;
        this.showTime = options.showTime ?? defaultProps.showTime;
        this.hourFormat = options.hourFormat ?? defaultProps.hourFormat;
        this.baseZIndex = options.baseZIndex ?? defaultProps.baseZIndex;
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
            locale={props.input?.locale}
            dateFormat={props.input?.dateFormat}
            minDate={props.input?.minDate}
            maxDate={props.input?.maxDate}
            maxDateCount={props.input?.maxDateCount}
            showTime={props.input?.showTime}
            hourFormat={props.input?.hourFormat}
            baseZIndex={props.input?.baseZIndex}
        />
    );
});

DateField.displayName = 'DateField';
