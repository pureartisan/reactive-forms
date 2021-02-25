import React from 'react';
import { FormGroup as MuiFormGroup } from '@material-ui/core';

interface FormGroupProps {
    children?: any
}

export const FormGroup = (props: FormGroupProps): JSX.Element => {
    return (
        <MuiFormGroup
            row
            {...props}
        />
    );
};
