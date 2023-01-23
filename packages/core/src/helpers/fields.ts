import {InputBase} from "../models/inputs";
import {Validators} from "../validation/validators";

export const fieldCssCls = <T = any>(input?: InputBase<T>|null, type?: string) =>
        `rf-field ${type ? 'rf-field-'+type : ''} ${input?.name ? 'rf-field-name-'+input?.name : ''} ${hasRequiredValidator(input) ? 'has-required' : ''}`;

export const hasRequiredValidator = <T>(input?: InputBase<T>|null): boolean => {
    if (Array.isArray(input?.validators)) {
        return input?.validators.some((validator: any) => validator === Validators.required) ?? false;
    }
    return input?.validators === Validators.required;
};
