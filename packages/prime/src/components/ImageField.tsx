import React, { forwardRef, useState } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { FileInputBase } from '../models/input-base';

import { PrimeImageField } from './helpers/PrimeImageField';
import {FileData} from "../models/files";

export class ImageInput extends FileInputBase<FileData> {
}

export const ImageField = forwardRef((props: BaseInputComponentProps<string, ImageInput>, ref: any) => {
    return (
        <PrimeImageField
            {...props}
            ref={ref}
        />
    );
});

ImageField.displayName = 'ImageField';