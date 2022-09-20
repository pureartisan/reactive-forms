import { BaseInputComponentProps } from "../models/inputs";
import { ErrorTranslators } from '../models/errors';
import { ValidationErrorTranslators } from "./error-translators";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const translateErrorMsg = (key: string, meta?: any, errorTranslators?: ErrorTranslators): string | undefined => {
    if (errorTranslators) {
        const translator = errorTranslators[key];
        if (translator) {
            return translator(key, meta);
        }
    }

    // check global translators
    return ValidationErrorTranslators.translate(key, meta) || key;
};


export const getFirstErrorMsg = <V>(props: BaseInputComponentProps<V>, onlyIfNotPristine?: boolean): string | undefined => {

    const errorsOnlyIfNotPristine = props.errorsOnlyIfNotPristine ?? onlyIfNotPristine ?? true;
    if (errorsOnlyIfNotPristine && props.control?.pristine) {
        return undefined;
    }

    const errors = props.control?.errors;
    if (!errors) {
        return undefined;
    }

    const errorKeys = Object.keys(errors);
    if (!errorKeys.length) {
        return undefined;
    }

    const firstErrorKey = errorKeys[0];
    const meta = errors[firstErrorKey];
    return translateErrorMsg(firstErrorKey, meta, props.errorTranslators);

};
