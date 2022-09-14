import React, {forwardRef} from 'react';

import {BaseInputComponentProps} from '@reactiveforms/core';

import {TextInputBase} from '../models/input-base';

import {PrimePasswordField} from "./helpers/PrimePasswordField";

export class PasswordInput extends TextInputBase<string> {
    panelClassName?: string;
    promptLabel?: string;
    weakLabel?: string;
    mediumLabel?: string;
    strongLabel?: string;
    mediumRegex?: string;
    strongRegex?: string;
    feedback?: boolean;
    toggleMask?: boolean;
    feedbackHeader?: any;
    feedbackContent?: any;
    feedbackFooter?: any;

    constructor(options: Partial<PasswordInput>) {
        super(options);

        const defaultProps = this.defaultProps<PasswordInput>();

        this.panelClassName = options.panelClassName ?? defaultProps.panelClassName;
        this.promptLabel = options.promptLabel ?? defaultProps.promptLabel;
        this.weakLabel = options.weakLabel ?? defaultProps.weakLabel;
        this.mediumLabel = options.mediumLabel ?? defaultProps.mediumLabel;
        this.strongLabel = options.strongLabel ?? defaultProps.strongLabel;
        this.mediumRegex = options.mediumRegex ?? defaultProps.mediumRegex;
        this.strongRegex = options.strongRegex ?? defaultProps.strongRegex;
        this.feedback = options.feedback ?? defaultProps.feedback;
        this.toggleMask = options.toggleMask ?? defaultProps.toggleMask;
        this.feedbackHeader = options.feedbackHeader ?? defaultProps.feedbackHeader;
        this.feedbackContent = options.feedbackContent ?? defaultProps.feedbackContent;
        this.feedbackFooter = options.feedbackFooter ?? defaultProps.feedbackFooter;
    }
}

export const PasswordField = forwardRef((props: BaseInputComponentProps<string, PasswordInput>, ref: any) => {
    return (
        <PrimePasswordField
            {...props}
            ref={ref}
            inputType="PasswordField"
            panelClassName={props.input?.panelClassName}
            promptLabel={props.input?.promptLabel}
            weakLabel={props.input?.weakLabel}
            mediumLabel={props.input?.mediumLabel}
            strongLabel={props.input?.strongLabel}
            mediumRegex={props.input?.mediumRegex}
            strongRegex={props.input?.strongRegex}
            feedback={props.input?.feedback}
            toggleMask={props.input?.toggleMask}
        />
    );
});

PasswordField.displayName = 'PasswordField';
