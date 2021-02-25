import React, { forwardRef, ChangeEvent } from 'react';

import { TextField } from '@material-ui/core';

import { BaseInputComponentProps, InputBase, BaseControl } from '@reactiveforms/core';

import { TextInputBase } from '../../models/input-base';
import { getFirstErrorMsg } from '../../utils/errors';

interface MuiTextFieldProps<V extends string, I extends InputBase<V> = any, C extends BaseControl<V> = BaseControl<V>> extends BaseInputComponentProps<V, I, C> {
    type?: string;
    multiline?: boolean;
    select?: boolean;
}

export const MuiTextField = forwardRef(<V extends string, I extends TextInputBase<V>>(props: MuiTextFieldProps<V, I>, ref: any) => {
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
    return (
        <TextField
            id={props.input?.id}
            label={props.input?.label}
            placeholder={props.input?.placeholder}
            disabled={props.control?.disabled}
            value={props.control?.value}
            onChange={handleChange}
            type={props.type}
            multiline={props.multiline}
            fullWidth={props.input?.muiFullWidth}
            select={props.select}
            error={Boolean(firstError)}
            helperText={firstError}
            autoComplete={props.input?.muiAutoComplete}
            autoFocus={props.input?.muiAutoFocus}
            classes={props.input?.muiClasses}
            variant={props.input?.muiVariant}
            size={props.input?.muiSize}
            margin={props.input?.muiMargin}
            InputProps={props.input?.muiInputProps}
            InputLabelProps={props.input?.muiInputLabelProps}
            FormHelperTextProps={props.input?.muiFormHelperTextProps}
            inputRef={ref}
        />
    );
});

MuiTextField.displayName = 'MuiTextField';
