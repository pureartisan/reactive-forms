import React, { forwardRef } from 'react';
import {Checkbox} from 'primereact/checkbox';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { BooleanInputBase } from '../models/input-base';

import { PrimeBooleanField } from './helpers/PrimeBooleanField';

import './styles.scss';

export class CheckboxInput extends BooleanInputBase {
}

export const CheckboxField = forwardRef((props: BaseInputComponentProps<boolean, CheckboxInput>, ref: any) => {
    return (
        <PrimeBooleanField
            {...props}
            ref={ref}
            component={Checkbox}
            inputType="CheckboxField"
            className="field-checkbox"
        />
    );
});

CheckboxField.displayName = 'CheckboxField';
