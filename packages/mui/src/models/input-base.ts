import { InputBase } from '@reactiveforms/core';

export type MuiColor = 'inherit' | 'primary' | 'secondary' | 'default';
export type MuiVariant = 'standard' | 'outlined' | 'filled';
export type MuiSize = 'medium' | 'small';
export type MuiMargin = 'dense' | 'none' | 'normal';

export abstract class TextInputBase<T> extends InputBase<T> {
    id?: string;

    muiVariant?: MuiVariant;
    muiColor?: MuiColor;
    muiSize?: MuiSize;
    muiMargin?: MuiMargin;
    muiFullWidth?: boolean;
    muiClasses?: any;
    muiAutoComplete?: string;
    muiAutoFocus?: boolean;
    muiInputProps?: any;
    muiInputLabelProps?: any;
    muiFormHelperTextProps?: any;

    constructor(options: Partial<TextInputBase<T>>) {
        super(options);
        const defaultProps = this.defaultProps<TextInputBase<T>>();

        this.id = options.id ?? defaultProps.id;

        this.muiVariant = options.muiVariant ?? defaultProps.muiVariant;
        this.muiColor = options.muiColor ?? defaultProps.muiColor;
        this.muiSize = options.muiSize ?? defaultProps.muiSize;
        this.muiMargin = options.muiMargin ?? defaultProps.muiMargin;
        this.muiFullWidth = options.muiFullWidth ?? defaultProps.muiFullWidth;
        this.muiClasses = options.muiClasses ?? defaultProps.muiClasses;
        this.muiAutoComplete = options.muiAutoComplete ?? defaultProps.muiAutoComplete;
        this.muiAutoFocus = options.muiAutoFocus ?? defaultProps.muiAutoFocus;
        this.muiInputProps = options.muiInputProps ?? defaultProps.muiInputProps;
        this.muiInputLabelProps = options.muiInputLabelProps ?? defaultProps.muiInputLabelProps;
        this.muiFormHelperTextProps = options.muiFormHelperTextProps ?? defaultProps.muiFormHelperTextProps;
    }
}

export interface OptionItem<T> {
    value?: T | null;
    label?: string;
}

export abstract class SelectInputBase<O, T = O | O[]> extends InputBase<T> {
    id?: string;
    options?: OptionItem<O>[];

    muiVariant?: MuiVariant;
    muiColor?: MuiColor;
    muiSize?: MuiSize;
    muiMargin?: MuiMargin;
    muiFullWidth?: boolean;
    muiClasses?: any;
    muiInputLabelProps?: any;
    muiSelectProps?: any;
    muiFormHelperTextProps?: any;

    constructor(options: Partial<SelectInputBase<O, T>>) {
        super(options);
        const defaultProps = this.defaultProps<SelectInputBase<O, T>>();

        this.id = options.id ?? defaultProps.id;
        this.options = (options.options ?? defaultProps.options ) || [];

        this.muiVariant = options.muiVariant ?? defaultProps.muiVariant;
        this.muiColor = options.muiColor ?? defaultProps.muiColor;
        this.muiSize = options.muiSize ?? defaultProps.muiSize;
        this.muiMargin = options.muiMargin ?? defaultProps.muiMargin;
        this.muiFullWidth = options.muiFullWidth ?? defaultProps.muiFullWidth;
        this.muiClasses = options.muiClasses ?? defaultProps.muiClasses;
        this.muiInputLabelProps = options.muiInputLabelProps ?? defaultProps.muiInputLabelProps;
        this.muiSelectProps = options.muiSelectProps ?? defaultProps.muiSelectProps;
        this.muiFormHelperTextProps = options.muiFormHelperTextProps ?? defaultProps.muiFormHelperTextProps;
    }
}

export abstract class SliderInputBase<T extends number | number[]> extends InputBase<T> {
    min?: number;
    max?: number;
    step?: number;
    scale?: (x: number) => number;

    constructor(options: Partial<SliderInputBase<T>>) {
        super(options);
        const defaultProps = this.defaultProps<SliderInputBase<T>>();
        this.min = options.min ?? defaultProps.min;
        this.max = options.max ?? defaultProps.max;
        this.step = options.step ?? defaultProps.step;
        this.scale = options.scale ?? defaultProps.scale;
    }
}
