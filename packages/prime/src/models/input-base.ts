import { InputBase } from '@reactiveforms/core';

export type ClassNameMap = any;

export type PrimeInputBase =
    TextInputBase<any> |
    BooleanInputBase |
    SelectInputBase<any, any>;

export abstract class TextInputBase<T> extends InputBase<T> {
    helpText?: string;
    helpTextComponent?: any;

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
        this.helpTextComponent = options.helpTextComponent ?? defaultProps.helpTextComponent;

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
    helpTextComponent?: any;

    className?: string | ClassNameMap;
    inputClassName?: string | ClassNameMap;
    labelClassName?: string | ClassNameMap;
    hintClassName?: string | ClassNameMap;

    constructor(options: Partial<BooleanInputBase>) {
        super(options);
        const defaultProps = this.defaultProps<BooleanInputBase>();

        this.helpText = options.helpText ?? defaultProps.helpText;
        this.helpTextComponent = options.helpTextComponent ?? defaultProps.helpTextComponent;

        this.className = options.className ?? defaultProps.className;
        this.inputClassName = options.inputClassName ?? defaultProps.inputClassName;
        this.labelClassName = options.labelClassName ?? defaultProps.labelClassName;
        this.hintClassName = options.hintClassName ?? defaultProps.hintClassName;
    }
}

export interface OptionItem<T> {
    value?: T | null;
    label?: string;
}

export abstract class SelectInputBase<O, T> extends InputBase<O> {
    id?: string;
    options?: OptionItem<O>[];

    helpText?: string;
    helpTextComponent?: any;

    className?: string | ClassNameMap;
    inputClassName?: string | ClassNameMap;
    labelClassName?: string | ClassNameMap;
    hintClassName?: string | ClassNameMap;

    constructor(options: Partial<SelectInputBase<O, T>>) {
        super(options);
        const defaultProps = this.defaultProps<SelectInputBase<O, T>>();

        this.id = options.id ?? defaultProps.id;
        this.options = (options.options ?? defaultProps.options ) || [];

        this.helpText = options.helpText ?? defaultProps.helpText;
        this.helpTextComponent = options.helpTextComponent ?? defaultProps.helpTextComponent;

        this.className = options.className ?? defaultProps.className;
        this.inputClassName = options.inputClassName ?? defaultProps.inputClassName;
        this.labelClassName = options.labelClassName ?? defaultProps.labelClassName;
        this.hintClassName = options.hintClassName ?? defaultProps.hintClassName;
    }
}

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
