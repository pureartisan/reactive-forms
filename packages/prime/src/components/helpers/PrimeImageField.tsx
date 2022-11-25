import React, {forwardRef, useState, useRef, useEffect} from 'react';
import clsx from 'clsx';
import { Image } from 'primereact/image';
import {Button} from "primereact/button";

import {BaseInputComponentProps, InputBase, BaseControl, getFirstErrorMsg, fieldCssCls} from '@reactiveforms/core';

import { FileInputBase } from '../../models/input-base';
import { getHelpText } from '../../utils/helpers';
import {FileData} from "../../models/files";

const DEFAULT_IMG = 'data:image/svg+xml,%3C%3Fxml version="1.0" encoding="utf-8"%3F%3E%3Csvg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 200 200" style="enable-background:new 0 0 200 200;" xml:space="preserve"%3E%3Crect width="200" height="200" fill="%23CFCFCE"/%3E%3Cpath class="st1" fill="%236D6D6D" d="M135.3,104.6c-2.2,0-4,1.8-4,4v1.5l-6-6c-4.4-4.4-11.5-4.4-15.9,0l-2.8,2.8l-10-10C92,92.7,85,92.7,80.5,97 l-6,6V80.3c0-2.2,1.8-4,4-4h28.3c2.2,0,4-1.8,4-4s-1.8-4-4-4H78.6c-6.7,0-12.1,5.4-12.1,12.1v48.6c0,6.7,5.4,12.1,12.1,12.1h48.6 c6.7,0,12.1-5.4,12.1-12.1v-20.2C139.3,106.4,137.5,104.6,135.3,104.6z M78.6,132.9c-2.2,0-4-1.8-4-4v-14.5l11.7-11.7 c1.2-1.2,3.2-1.2,4.4,0l12.8,12.8l0,0l17.4,17.4H78.6z M131.2,128.9c0,0.8-0.3,1.5-0.7,2.1l-18.3-18.3l2.8-2.8 c1.2-1.2,3.2-1.2,4.4,0c0,0,0,0,0,0l11.7,11.8V128.9z M150.3,69.3l-12.1-12.1c-0.4-0.4-0.8-0.7-1.3-0.9c-1-0.4-2.1-0.4-3.1,0 c-0.5,0.2-1,0.5-1.3,0.9l-12.1,12.1c-1.6,1.6-1.6,4.2,0,5.7c1.6,1.6,4.2,1.6,5.7,0l5.2-5.3v22.6c0,2.2,1.8,4,4,4c2.2,0,4-1.8,4-4 V69.8l5.2,5.3c1.6,1.6,4.1,1.6,5.7,0c0,0,0,0,0,0C151.9,73.5,151.9,70.9,150.3,69.3C150.3,69.3,150.3,69.3,150.3,69.3z"/%3E%3C/svg%3E';

interface PrimeImageFieldProps<V extends FileData, I extends InputBase<V> = any, C extends BaseControl<V> = BaseControl<V>> extends BaseInputComponentProps<V, I, C> {
    allowPreview?: boolean;
    altLabel?: string;
    selectLabel?: string;
    resetLabel?: string;
    selectBtnClassName?: string;
    className?: string;
    inputType?: string;
}

export const PrimeImageField = forwardRef(<I extends FileInputBase<FileData>>(props: PrimeImageFieldProps<FileData, I>, ref: any) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const firstError = getFirstErrorMsg(props);

    const value = props.control?.value;

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

    const selectFile = () => {
        fileInputRef?.current?.click();
    };

    const handleReset = () => {
        setFile(null);

        props.control?.setValue({
            url: value?.url
        }, { emitEvent: false });
        props.control?.markAsPristine({ emitEvent: false });
        props.control?.emitEvents();
    };

    const hasPreview = Boolean(previewUrl);

    return (
        <div
            className={clsx(
                'field',
                fieldCssCls(props.input, props.inputType),
                props.className,
                props.input?.className,
                {
                    'col-12': !props.input?.className,
                    'input-empty': !hasPreview
                }
            )}
        >
            {props.input?.label && (
                <label htmlFor={props.input?.id} className={props.input?.labelClassName}>
                    {props.input.label as any}
                </label>
            )}
            <div className={clsx('rf-image-input', props.input?.inputClassName)}>
                <Image
                    ref={ref}
                    src={previewUrl ?? DEFAULT_IMG}
                    alt={props.altLabel}
                    preview={hasPreview && props.allowPreview}
                />
                <input
                    ref={fileInputRef}
                    id={props.input?.id}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <div className="rf-actions">
                    <Button className={clsx('rf-select-file', props.selectBtnClassName)} onClick={selectFile}>{props.selectLabel}</Button>
                    {props.control?.dirty && props.resetLabel && (
                        <Button className="rf-reset p-button-link" onClick={handleReset}>{props.resetLabel}</Button>
                    )}
                </div>
            </div>
            {helpText && (
                <small
                    className={clsx(
                        "rf-helper-text block",
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
