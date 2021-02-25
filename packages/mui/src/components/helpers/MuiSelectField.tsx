import React, { forwardRef, ChangeEvent, ReactNode } from 'react';

import { TextField } from '@material-ui/core';

import { BaseInputComponentProps, InputBase, BaseControl } from '@reactiveforms/core';

import { SelectInputBase } from '../../models/input-base';
import { getFirstErrorMsg } from '../../utils/errors';

interface MuiSelectFieldProps<V, I extends InputBase<V> = any, C extends BaseControl<V> = BaseControl<V>> extends BaseInputComponentProps<V, I, C> {
    native?: boolean;
    children?: ReactNode | ReactNode[];
}

export const MuiSelectField = forwardRef(<V, I extends SelectInputBase<V, V>, C extends BaseControl<V>>(props: MuiSelectFieldProps<V, I, C>) => {
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
    const selectProps = props.input?.muiSelectProps ?? {};
    return (
        <TextField
            id={props.input?.id}
            label={props.input?.label}
            placeholder={props.input?.placeholder}
            disabled={props.control?.disabled}
            value={props.control?.value}
            onChange={handleChange}
            fullWidth={props.input?.muiFullWidth}
            select={true}
            error={Boolean(firstError)}
            helperText={firstError}
            classes={props.input?.muiClasses}
            variant={props.input?.muiVariant}
            size={props.input?.muiSize}
            margin={props.input?.muiMargin}
            SelectProps={{
                ...selectProps,
                native: props.native,
                // inputProps: {
                //     ...(selectProps.inputProps || {}),
                //     inputRef: ref
                // }
            }}
            InputLabelProps={props.input?.muiInputLabelProps}
            FormHelperTextProps={props.input?.muiFormHelperTextProps}
        >
            {props.children}
        </TextField>
    );
});

MuiSelectField.displayName = 'MuiSelectField';
