import { ForwardRefExoticComponent, FC, ReactNode } from "react";

import { BaseControl } from "./controls";
import { ValidatorFn, AsyncValidatorFn } from "./validators";
import { ErrorTranslators } from "./errors";

export type FormHooks = "change" | "blur" | "submit";

export type InputElement =
    | InputBase<any>
    | InputGroup
    | InputArray
    | StaticElement;

export interface BaseInputComponentProps<
    V,
    I extends InputBase<V> = InputBase<V>,
    C extends BaseControl<V> = BaseControl<V>
> {
    input?: I;
    control?: C;
    errorTranslators?: ErrorTranslators;
    errorsOnlyIfNotPristine?: boolean;
}

export type HiddenResolver = (form: any) => boolean;

export type DisabledResolver = (form: any) => boolean;

interface InputBaseConstructor<T extends InputBase = any> {
    new (...args: any[]): T;
}

export abstract class InputBase<T = any> {
    private static globalElementCount = 0;
    private static _defaultProps = new Map<
        InputBaseConstructor,
        Partial<InputBase>
    >();

    id?: string;
    name?: string;
    placeholder?: string;
    label?: string | ForwardRefExoticComponent<any> | ReactNode;
    value?: T;
    readonly?: boolean;
    disabled?: boolean;
    validators?: ValidatorFn<T> | ValidatorFn<T>[] | null;
    asyncValidators?: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null;
    updateOn?: FormHooks;
    component?: ForwardRefExoticComponent<
        BaseInputComponentProps<T, InputBase<T>, BaseControl<T>>
    >;
    hidden?: HiddenResolver;
    disabledOn?: DisabledResolver;

    constructor(options: Partial<InputBase<T>>) {
        const defaultProps = this.defaultProps();
        this.id = options.id ?? this.buildGlobalName();
        this.value = options.value ?? defaultProps.value;
        this.name = options.name ?? defaultProps.name;
        this.placeholder = options.placeholder ?? defaultProps.placeholder;
        this.label = options.label ?? defaultProps.label;
        this.readonly = options.readonly ?? defaultProps.readonly;
        this.disabled = options.disabled ?? defaultProps.disabled;
        this.validators = options.validators ?? defaultProps.validators;
        this.asyncValidators =
            options.asyncValidators ?? defaultProps.asyncValidators;
        this.updateOn = options.updateOn ?? defaultProps.updateOn;
        this.component = options.component ?? defaultProps.component;
        this.hidden = options.hidden ?? defaultProps.hidden;
        this.disabledOn = options.disabledOn ?? defaultProps.disabledOn;
    }

    protected defaultProps<I extends InputBase<T> = InputBase<T>>(): Readonly<
        Partial<I>
    > {
        return (
            (InputBase._defaultProps.get(
                this.constructor as InputBaseConstructor
            ) as Partial<I>) || {}
        );
    }

    private buildGlobalName(): string {
        return `input_${InputBase.globalElementCount++}`;
    }

    static updateDefaultProps<T extends InputBase = InputBase>(
        this: new (...args: any[]) => T,
        props: Partial<T>
    ): void {
        const existing = InputBase._defaultProps.get(this) || {};
        InputBase._defaultProps.set(this, {
            ...existing,
            ...props,
        });
    }

    static resetDefaultProps<T extends InputBase = InputBase>(
        this: new (...args: any[]) => T
    ): void {
        InputBase._defaultProps.set(this, {});
    }
}

interface InputGroupConstructor<T extends InputGroup = InputGroup> {
    new (...args: any[]): T;
}

export class InputGroup {
    private static _defaultProps = new Map<
        InputGroupConstructor,
        Partial<InputGroup>
    >();

    name?: string;
    inputs?: InputElement[];
    label?: string;
    validators?: ValidatorFn<any> | ValidatorFn<any>[] | null;
    asyncValidators?: AsyncValidatorFn<any> | AsyncValidatorFn<any>[] | null;
    updateOn?: FormHooks;
    component?: ForwardRefExoticComponent<any> | FC<any>;
    hidden?: HiddenResolver;
    disabledOn?: DisabledResolver;

    constructor(options: Partial<InputGroup>) {
        const defaultProps = this.defaultProps();
        this.name = options.name ?? defaultProps.name;
        this.label = options.label ?? defaultProps.label;
        this.inputs = (options.inputs ?? defaultProps.inputs) || [];
        this.component = options.component ?? defaultProps.component;
        this.hidden = options.hidden ?? defaultProps.hidden;
        this.disabledOn = options.disabledOn ?? defaultProps.disabledOn;
    }

    protected defaultProps<T extends InputGroup = InputGroup>(): Readonly<
        Partial<T>
    > {
        return (
            (InputGroup._defaultProps.get(
                this.constructor as InputGroupConstructor
            ) as Partial<T>) || {}
        );
    }

    static updateDefaultProps<T extends InputGroup = InputGroup>(
        this: new (...args: any[]) => T,
        props: Partial<T>
    ): void {
        const existing = InputGroup._defaultProps.get(this) || {};
        InputGroup._defaultProps.set(this, {
            ...existing,
            ...props,
        });
    }

    static resetDefaultProps<T extends InputGroup = InputGroup>(
        this: new (...args: any[]) => T
    ): void {
        InputGroup._defaultProps.set(this, {});
    }
}

interface InputArrayConstructor<T extends InputArray = InputArray> {
    new (...args: any[]): T;
}

export class InputArray {
    private static _defaultProps = new Map<
        InputArrayConstructor,
        Partial<InputArray>
    >();

    name?: string;
    inputs?: InputElement[];
    label?: string;
    validators?: ValidatorFn<any> | ValidatorFn<any>[] | null;
    asyncValidators?: AsyncValidatorFn<any> | AsyncValidatorFn<any>[] | null;
    updateOn?: FormHooks;
    component?: ForwardRefExoticComponent<any>;
    hidden?: HiddenResolver;
    disabledOn?: DisabledResolver;

    constructor(options: Partial<InputArray>) {
        const defaultProps = this.defaultProps();
        this.name = options.name ?? defaultProps.name;
        this.label = options.label ?? defaultProps.label;
        this.inputs = (options.inputs ?? defaultProps.inputs) || [];
        this.component = options.component ?? defaultProps.component;
        this.hidden = options.hidden ?? defaultProps.hidden;
        this.disabledOn = options.disabledOn ?? defaultProps.disabledOn;
    }

    protected defaultProps<T extends InputArray = InputArray>(): Readonly<
        Partial<T>
    > {
        return (
            (InputArray._defaultProps.get(
                this.constructor as InputArrayConstructor
            ) as Partial<T>) || {}
        );
    }

    static updateDefaultProps<T extends InputArray = InputArray>(
        this: new (...args: any[]) => T,
        props: Partial<T>
    ): void {
        const existing = InputArray._defaultProps.get(this) || {};
        InputArray._defaultProps.set(this, {
            ...existing,
            ...props,
        });
    }

    static resetDefaultProps<T extends InputArray = InputArray>(
        this: new (...args: any[]) => T
    ): void {
        InputArray._defaultProps.set(this, {});
    }
}

interface StaticElementConstructor<T extends StaticElement = StaticElement> {
    new (...args: any[]): T;
}

export class StaticElement {
    private static globalElementCount = 0;
    private static _defaultProps = new Map<
        StaticElementConstructor,
        Partial<StaticElement>
    >();

    readonly name: string;
    component?: ForwardRefExoticComponent<any> | any;
    content?: (form?: any) => any;
    hidden?: HiddenResolver;
    disabledOn?: DisabledResolver;

    constructor(options: Partial<StaticElement>) {
        const defaultProps = this.defaultProps();
        this.name = options.name ?? this.buildGlobalName();
        this.content = options.content ?? defaultProps.content;
        this.component = options.component ?? defaultProps.component;
        this.hidden = options.hidden ?? defaultProps.hidden;
        this.disabledOn = options.disabledOn ?? defaultProps.disabledOn;
    }

    protected defaultProps<T extends StaticElement = StaticElement>(): Readonly<
        Partial<T>
    > {
        return (
            (StaticElement._defaultProps.get(
                this.constructor as StaticElementConstructor
            ) as Partial<T>) || {}
        );
    }

    private buildGlobalName(): string {
        return `static_element_${StaticElement.globalElementCount++}`;
    }

    static updateDefaultProps<T extends StaticElement = StaticElement>(
        this: new (...args: any[]) => T,
        props: Partial<T>
    ): void {
        const existing = StaticElement._defaultProps.get(this) || {};
        StaticElement._defaultProps.set(this, {
            ...existing,
            ...props,
        });
    }

    static resetDefaultProps<T extends StaticElement = StaticElement>(
        this: new (...args: any[]) => T
    ): void {
        StaticElement._defaultProps.set(this, {});
    }
}
