import { BaseInputComponentProps, ValidationErrorTranslators } from '@reactiveforms/core';

export const getFirstErrorMsg = <V>(props: BaseInputComponentProps<V>, onlyIfNotPristine = true): string | undefined => {
    if (onlyIfNotPristine && props.control?.pristine) {
        return undefined;
    }
    if (!props.control?.errors) {
        return undefined;
    }
    const errorKeys = Object.keys(props.control?.errors);
    if (!errorKeys.length) {
        return undefined;
    }
    const firstErrorKey = errorKeys[0];
    const meta = props.control?.errors[firstErrorKey];
    return ValidationErrorTranslators.translate(firstErrorKey, meta) || firstErrorKey;
};
