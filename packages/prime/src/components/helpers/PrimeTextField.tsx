import React, { forwardRef, ChangeEvent } from 'react';
import clsx from 'clsx';

import { InputText } from 'primereact/inputtext';

import { BaseInputComponentProps, InputBase, BaseControl } from '@reactiveforms/core';

import { TextInputBase } from '../../models/input-base';
import { getFirstErrorMsg } from '../../utils/errors';

interface PrimeTextFieldProps<V extends string, I extends InputBase<V> = any, C extends BaseControl<V> = BaseControl<V>> extends BaseInputComponentProps<V, I, C> {
    type?: string;
    helperText?: string;
    leftIcon?: any;
    rightIcon?: any;
    onLeftIconClick?: () => void;
    onRightIconClick?: () => void;
}

export const PrimeTextField = forwardRef(<V extends string, I extends TextInputBase<V>>(props: PrimeTextFieldProps<V, I>, ref: any) => {
    const firstError = getFirstErrorMsg(props);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target?.value as unknown as V;
        props.control?.setValue(value);
        if (value === props.input?.value) {
            props.control?.markAsPristine();
        } else {
            props.control?.markAsDirty();
        }
    }

    const helpText = firstError || props.input?.helpText;

    const leftIcon = props.leftIcon ?? props.input?.leftIcon;
    const rightIcon = props.rightIcon ?? props.input?.rightIcon;
    return (
      <div
        className={clsx(
          "rf-field p-field",
          props.input?.className,
          {
            'p-col-12': !props.input?.className,
            'p-input-icon-left': leftIcon,
            'p-input-icon-right': rightIcon,
          }
        )}
      >
        {props.input?.label && (
          <label htmlFor={props.input?.id} className={props.input?.labelClassName}>
            {props.input.label}
          </label>
        )}
        {leftIcon && (
          <i className="rf-field-left-icon" onClick={props.onLeftIconClick}>
            {leftIcon}
          </i>
        )}
        {rightIcon && (
          <i className="rf-field-right-icon" onClick={props.onLeftIconClick}>
            {rightIcon}
          </i>
        )}
        <InputText
          id={props.input?.id}
          placeholder={props.input?.placeholder}
          disabled={props.control?.disabled}
          value={props.control?.value}
          onChange={handleChange}
          type={props.type}
          className={props.input?.inputClassName}
          ref={ref}
        />
        {helpText && (
          <small
            className={clsx(
              "p-d-block",
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

PrimeTextField.displayName = 'PrimeTextField';
