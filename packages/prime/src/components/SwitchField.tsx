import React, { forwardRef } from 'react';
import {InputSwitch} from 'primereact/inputswitch';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { BooleanInputBase } from '../models/input-base';

import { PrimeBooleanField } from './helpers/PrimeBooleanField';

export class SwitchInput extends BooleanInputBase {
}

export const SwitchField = forwardRef((props: BaseInputComponentProps<boolean, SwitchInput>, ref: any) => {
    return (
        <PrimeBooleanField
            {...props}
            ref={ref}
            component={InputSwitch}
            inputType="SwitchField"
            className="p-field-checkbox"
        />
    );
});

SwitchField.displayName = 'SwitchField';
