import React, {forwardRef, useState, useRef, useEffect} from 'react';
import clsx from 'clsx';

import { BaseInputComponentProps, InputBase, BaseControl, getFirstErrorMsg } from '@reactiveforms/core';

import { FileInputBase } from '../../models/input-base';
import { getHelpText } from '../../utils/helpers';
import {FileData} from "../../models/files";

interface PrimeImageFieldProps<V extends FileData, I extends InputBase<V> = any, C extends BaseControl<V> = BaseControl<V>> extends BaseInputComponentProps<V, I, C> {

}

export const PrimeImageField = forwardRef(<V extends string, I extends FileInputBase<V>>(props: PrimeImageFieldProps<V, I>, ref: any) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const firstError = getFirstErrorMsg(props);

    const value = props.control?.value as FileData;

    useEffect(() => {
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(value?.url ?? null);
        }
    }, [value?.url, file]);

    const helpText = getHelpText(props.input, props.control, firstError);

    const handleFileChange = (event: any) => {
        const f = event.target.files[0] as File;
        setFile(f);

        props.control?.setValue({
            url: value?.url,
            raw: f
        }, { emitEvent: false });
        props.control?.markAsDirty({ emitEvent: false });
        props.control?.emitEvents();
    };

    const handleImageClick = () => {
        fileInputRef?.current?.click();
    };

    return (
        <div
            className={clsx(
                `rf-field rf-field-image rf-field-name-${props.input?.name} p-field`,
                props.input?.className,
                {
                    'p-col-12': !props.input?.className,
                    'input-empty': !props.control?.value
                }
            )}
        >
            {props.input?.label && (
                <label htmlFor={props.input?.id} className={props.input?.labelClassName}>
                    {props.input.label}
                </label>
            )}
            <div
                className={clsx('image-input', props.input?.inputClassName)}
                onClick={handleImageClick}
            >
                {previewUrl && (
                    <img className="preview" src={previewUrl} alt="Preview" />
                )}
                <input
                    ref={fileInputRef}
                    id={props.input?.id}
                    style={{
                        width: 1,
                        height: 1,
                        visibility: 'hidden',
                        position: "fixed",
                        left: -10,
                        top: -10
                    }}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
            {helpText && (
                <small
                    className={clsx(
                        "rf-helper-text p-d-block",
                        { 'p-error': firstError },
                        props.input?.hintClassName
                    )}
                >
                    {helpText}
                </small>
            )}
        </div>
    );
});

PrimeImageField.displayName = 'PrimeImageField';
