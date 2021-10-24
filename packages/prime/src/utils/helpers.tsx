import React from 'react';

import { BaseControl } from '@reactiveforms/core';

import { PrimeInputBase } from '../models/input-base';

export const getHelpText = (input?: PrimeInputBase, control?: BaseControl<any>, firstError?: any): any => {
    if (firstError) {
        return firstError;
    }
    if (input?.helpTextComponent) {
        const C = input?.helpTextComponent;
        return <C input={input} control={control} />
    }
    return input?.helpText ?? null;
}
