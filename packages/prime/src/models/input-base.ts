import { InputBase } from '@reactiveforms/core';

export type ClassNameMap = any;

export abstract class TextInputBase<T> extends InputBase<T> {
    helpText?: string;

    className?: string | ClassNameMap;
    inputClassName?: string | ClassNameMap;
    labelClassName?: string | ClassNameMap;
    hintClassName?: string | ClassNameMap;

    leftIcon?: any;
    rightIcon?: any;

    pKeyFilter?: any;
    pValidateOnly?: any;
    pTooltip?: any;
    pTooltipOptions?: any;

    constructor(options: Partial<TextInputBase<T>>) {
        super(options);
        const defaultProps = this.defaultProps<TextInputBase<T>>();

        this.helpText = options.helpText ?? defaultProps.helpText;

        this.className = options.className ?? defaultProps.className;
        this.inputClassName = options.inputClassName ?? defaultProps.inputClassName;
        this.labelClassName = options.labelClassName ?? defaultProps.labelClassName;
        this.hintClassName = options.hintClassName ?? defaultProps.hintClassName;

        this.leftIcon = options.leftIcon ?? defaultProps.leftIcon;
        this.rightIcon = options.rightIcon ?? defaultProps.rightIcon;

        this.pKeyFilter = options.pKeyFilter ?? defaultProps.pKeyFilter;
        this.pValidateOnly = options.pValidateOnly ?? defaultProps.pValidateOnly;
        this.pTooltip = options.pTooltip ?? defaultProps.pTooltip;
        this.pTooltipOptions = options.pTooltipOptions ?? defaultProps.pTooltipOptions;
    }
}

export abstract class BooleanInputBase extends InputBase<boolean> {
    helpText?: string;

    className?: string | ClassNameMap;
    inputClassName?: string | ClassNameMap;
    labelClassName?: string | ClassNameMap;
    hintClassName?: string | ClassNameMap;

    constructor(options: Partial<BooleanInputBase>) {
        super(options);
        const defaultProps = this.defaultProps<BooleanInputBase>();

        this.helpText = options.helpText ?? defaultProps.helpText;
    }
}

// export interface OptionItem<T> {
//     value?: T | null;
//     label?: string;
// }

// export abstract class SelectInputBase<O, T = O | O[]> extends InputBase<T> {
//     id?: string;
//     options?: OptionItem<O>[];

//     muiFullWidth?: boolean;
//     muiClasses?: any;
//     muiInputLabelProps?: any;
//     muiSelectProps?: any;
//     muiFormHelperTextProps?: any;

//     constructor(options: Partial<SelectInputBase<O, T>>) {
//         super(options);
//         const defaultProps = this.defaultProps<SelectInputBase<O, T>>();

//         this.id = options.id ?? defaultProps.id;
//         this.options = (options.options ?? defaultProps.options ) || [];

//         this.muiFullWidth = options.muiFullWidth ?? defaultProps.muiFullWidth;
//         this.muiClasses = options.muiClasses ?? defaultProps.muiClasses;
//         this.muiInputLabelProps = options.muiInputLabelProps ?? defaultProps.muiInputLabelProps;
//         this.muiSelectProps = options.muiSelectProps ?? defaultProps.muiSelectProps;
//         this.muiFormHelperTextProps = options.muiFormHelperTextProps ?? defaultProps.muiFormHelperTextProps;
//     }
// }

// export abstract class SliderInputBase<T extends number | number[]> extends InputBase<T> {
//     min?: number;
//     max?: number;
//     step?: number;
//     scale?: (x: number) => number;

//     constructor(options: Partial<SliderInputBase<T>>) {
//         super(options);
//         const defaultProps = this.defaultProps<SliderInputBase<T>>();
//         this.min = options.min ?? defaultProps.min;
//         this.max = options.max ?? defaultProps.max;
//         this.step = options.step ?? defaultProps.step;
//         this.scale = options.scale ?? defaultProps.scale;
//     }
// }
