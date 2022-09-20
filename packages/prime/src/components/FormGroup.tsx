import React from 'react';

interface FormGroupProps {
    children?: any
}

export const FormGroup = (props: FormGroupProps): JSX.Element => {
    return (
        <>
          {props.children}
        </>
    );
};

FormGroup.displayName = 'FormGroup';
