import { Errors } from "./errors";

export type Status = "VALID" | "INVALID" | "DISABLED" | "PENDING";

export interface SelfOnlyOpts {
    onlySelf?: boolean;
}

export interface EmitEventOpts {
    emitEvent?: boolean;
}

export interface FormEventOpts {
    form?: any;
}

export interface ControlChangeOpts
    extends SelfOnlyOpts,
        EmitEventOpts,
        FormEventOpts {}

export interface BaseControl<T = any> {
    readonly value?: T;
    readonly status: Status;
    readonly pristine: boolean;
    readonly dirty: boolean;
    readonly valid: boolean;
    readonly invalid: boolean;
    readonly pending: boolean;
    readonly untouched: boolean;
    readonly touched: boolean;
    readonly enabled: boolean;
    readonly disabled: boolean;
    readonly root: BaseControl<any>;
    readonly errors: Errors | null;

    updateValueAndValidity: (options: ControlChangeOpts) => void;
    markAsTouched: (opts?: ControlChangeOpts) => void;
    markAsPristine: (opts?: ControlChangeOpts) => void;
    markAsUntouched: (opts?: ControlChangeOpts) => void;
    markAsDirty: (opts?: ControlChangeOpts) => void;
    markAsPending: (opts?: ControlChangeOpts) => void;
    setErrors: (errors?: Errors | null, opts?: ControlChangeOpts) => void;
    getError: (
        errorCode: string,
        path: string | Array<string | number>
    ) => any | null;
    hasError: (
        errorCode: string,
        path: string | Array<string | number>
    ) => boolean;
    updatePristine: (opts?: ControlChangeOpts) => void;
    updateTouched: (opts?: ControlChangeOpts) => void;
    reset: (formState: any, opts?: ControlChangeOpts) => void;
    setValue: (value?: T, opts?: ControlChangeOpts) => void;
    patchValue: (value?: T, opts?: ControlChangeOpts) => void;
    emitEvents: (onlySelf?: boolean) => void;
}
