import React, { forwardRef, useState } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { TextInputBase } from '../models/input-base';

import { PrimeTextField } from './helpers/PrimeTextField';

export class PasswordInput extends TextInputBase<string> {

    showPasswordIcon?: any;
    hidePasswordIcon?: any;
    showPasswordByDefault?: boolean;

    constructor(options: Partial<PasswordInput>) {
        super(options);

        const defaultProps = this.defaultProps<PasswordInput>();

        this.showPasswordIcon = options.showPasswordIcon ?? defaultProps.showPasswordIcon;
        this.hidePasswordIcon = options.hidePasswordIcon ?? defaultProps.hidePasswordIcon;
        this.showPasswordByDefault = options.showPasswordByDefault ?? defaultProps.showPasswordByDefault;
    }
}

export const PasswordField = forwardRef((props: BaseInputComponentProps<string, PasswordInput>, ref: any) => {

    const [passwordVisible, setPasswordVisible] = useState(Boolean(props.input?.showPasswordByDefault));

    const togglePasswordShow = () => setPasswordVisible(!passwordVisible);

    const showPassword = props.input?.showPasswordIcon || props.input?.hidePasswordIcon;

    return (
        <PrimeTextField
            {...props}
            ref={ref}
            type="password"
            inputType="PasswordField"
            onRightIconClick={togglePasswordShow}
            rightIcon={showPassword && (
              passwordVisible ? props.input?.hidePasswordIcon : props.input?.showPasswordIcon
            )}
            rightIconClassName="show-password-button"
        />
    );
});

PasswordField.displayName = 'PasswordField';