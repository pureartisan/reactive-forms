import React, { forwardRef } from 'react';

import { BaseInputComponentProps } from '@reactiveforms/core';

import { FileInputBase } from '../models/input-base';

import { PrimeImageField } from './helpers/PrimeImageField';
import {FileData} from "../models/files";

export class ImageInput extends FileInputBase<FileData> {
    allowPreview?: boolean;
    resetLabel?: string;
    altLabel?: string;

    constructor(options: Partial<ImageInput>) {
        super(options);

        const defaultProps = this.defaultProps<ImageInput>();

        this.allowPreview = options.allowPreview ?? defaultProps.allowPreview;
        this.resetLabel = options.resetLabel ?? defaultProps.resetLabel;
        this.altLabel = options.altLabel ?? defaultProps.altLabel;
    }
}

export const ImageField = forwardRef((props: BaseInputComponentProps<FileData, ImageInput>, ref: any) => {
    return (
        <PrimeImageField
            {...props}
            ref={ref}
            inputType="ImageField"
            allowPreview={props.input?.allowPreview}
            resetLabel={props.input?.resetLabel}
            altLabel={props.input?.altLabel}
        />
    );
});

ImageField.displayName = 'ImageField';
