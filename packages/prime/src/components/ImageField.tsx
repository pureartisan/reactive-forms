import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { FileInputBase } from '../models/input-base';

import { PrimeImageField } from './helpers/PrimeImageField';
import {FileData} from "../models/files";

export class ImageInput extends FileInputBase<FileData> {
    allowPreview?: boolean;

    constructor(options: Partial<ImageInput>) {
        super(options);

        const defaultProps = this.defaultProps<ImageInput>();

        this.allowPreview = options.allowPreview ?? defaultProps.allowPreview;
    }
}

export const ImageField = forwardRef((props: BaseInputComponentProps<FileData, ImageInput>, ref: any) => {
    return (
        <PrimeImageField
            {...props}
            allowPreview={props.input?.allowPreview}
            ref={ref}
        />
    );
});

ImageField.displayName = 'ImageField';
