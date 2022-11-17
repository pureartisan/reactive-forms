import React, { useEffect, useLayoutEffect } from "react";
import clsx from "clsx";

import {
    AbstractControl,
    FormControl,
    FormGroup,
    FormArray,
    Form,
} from "../models/forms";
import {
    StaticElement,
    InputElement,
    InputBase,
    InputGroup,
    InputArray,
} from "../models/inputs";
import { ErrorTranslators } from "../models/errors";
import { useForceUpdate } from "../hooks/force-update";

const inputHasControl = (input: InputElement): boolean => {
    // NOTE: static elements are skipped, since they are just
    // rendered without considering a "form state"
    return (
        (Boolean(input) && input instanceof InputGroup) ||
        input instanceof InputArray ||
        input instanceof InputBase
    );
};

interface FieldProps {
    form?: Form<any> | AbstractControl<any>;
    control?: AbstractControl<any>;
    input?: InputElement;
    errorTranslators?: ErrorTranslators;
    errorsOnlyIfNotPristine?: boolean;
    onEnableChanged?: () => void;
}

export const Field = (props: FieldProps): JSX.Element | null => {
    const { input, control, form } = props;

    const isHidden = input?.hidden && input.hidden(form);
    const isDisabled = input?.disabledOn && input.disabledOn(form);

    const forceUpdate = useForceUpdate();

    const setInputDisabled = (value?: boolean): void => {
        const opts = { emitEvent: false, form };
        if (value) {
            control?.disable(opts);
        } else {
            control?.enable(opts);
        }

        forceUpdate();
        if (props.onEnableChanged) {
            props.onEnableChanged();
        }
    };

    useLayoutEffect(() => {
        if (isHidden === undefined && isDisabled === undefined) {
            return;
        }

        setInputDisabled(isHidden || isDisabled);
    }, [isHidden, isDisabled]);

    useEffect(() => {
        if (isDisabled === undefined) {
            return;
        }

        setInputDisabled(isDisabled);
    }, [])

    if (!input || isHidden) {
        return null;
    }

    if (input instanceof InputBase) {
        return (
            <FieldControl
                input={input}
                control={control as FormControl<any>}
                errorTranslators={props.errorTranslators}
                errorsOnlyIfNotPristine={props.errorsOnlyIfNotPristine}
            />
        );
    } else if (input instanceof InputGroup) {
        return (
            <FieldGroup
                form={form}
                input={input}
                control={control as FormGroup<any>}
                errorTranslators={props.errorTranslators}
                errorsOnlyIfNotPristine={props.errorsOnlyIfNotPristine}
                onEnableChanged={props.onEnableChanged}
            />
        );
    } else if (input instanceof InputArray) {
        return (
            <FieldArray
                form={form}
                input={input}
                control={control as FormArray}
                errorTranslators={props.errorTranslators}
                errorsOnlyIfNotPristine={props.errorsOnlyIfNotPristine}
                onEnableChanged={props.onEnableChanged}
            />
        );
    } else if (input instanceof StaticElement) {
        return <StaticComponent form={form} input={input} />;
    }

    // unknown case
    return null;
};

Field.displayName = "Field";

interface FieldControlProps<V> {
    control?: FormControl<V>;
    input?: InputBase<V>;
    errorTranslators?: ErrorTranslators;
    errorsOnlyIfNotPristine?: boolean;
}

export const FieldControl = <V,>(
    props: FieldControlProps<V>
): JSX.Element | null => {
    const C = props.input?.component;
    if (!C) {
        return null;
    }

    return (
        <C
            control={props.control}
            input={props.input}
            errorTranslators={props.errorTranslators}
            errorsOnlyIfNotPristine={props.errorsOnlyIfNotPristine}
        />
    );
};

FieldControl.displayName = "FieldControl";

interface FieldGroupProps<V> {
    form?: Form<any> | AbstractControl<any>;
    control?: FormGroup<V>;
    input?: InputGroup;
    errorTranslators?: ErrorTranslators;
    errorsOnlyIfNotPristine?: boolean;
    onEnableChanged?: () => void;
}

export const FieldGroup = <V,>(
    props: FieldGroupProps<V>
): JSX.Element | null => {
    const C = props.input?.component;
    if (!C) {
        return null;
    }

    return (
        <C control={props.control} input={props.input}>
            {props.input?.inputs?.map((inp) => {
                const ctrl = inp?.name
                    ? props.control?.get(inp.name)
                    : undefined;
                return (
                    <Field
                        key={inp?.name}
                        form={props.form}
                        input={inp}
                        control={ctrl}
                        errorTranslators={props.errorTranslators}
                        errorsOnlyIfNotPristine={props.errorsOnlyIfNotPristine}
                        onEnableChanged={props.onEnableChanged}
                    />
                );
            })}
        </C>
    );
};

FieldGroup.displayName = "FieldGroup";

interface FieldArrayProps {
    form?: Form<any> | AbstractControl<any>;
    control?: FormArray;
    input?: InputArray;
    errorTranslators?: ErrorTranslators;
    errorsOnlyIfNotPristine?: boolean;
    onEnableChanged?: () => void;
}

export const FieldArray = (props: FieldArrayProps): JSX.Element | null => {
    const C = props.input?.component;
    if (!C) {
        return null;
    }

    let controlIndex = -1;

    return (
        <C control={props.control} input={props.input}>
            {props.input?.inputs?.map((inp) => {
                if (inputHasControl(inp)) {
                    controlIndex++;
                }
                return (
                    <Field
                        key={inp?.name}
                        input={inp}
                        form={props.form}
                        control={props.control?.at(controlIndex)}
                        errorTranslators={props.errorTranslators}
                        errorsOnlyIfNotPristine={props.errorsOnlyIfNotPristine}
                        onEnableChanged={props.onEnableChanged}
                    />
                );
            })}
        </C>
    );
};

FieldArray.displayName = "FieldArray";

interface StaticComponentProps {
    form?: Form<any> | AbstractControl<any>;
    input?: StaticElement;
    className?: string;
}

export const StaticComponent = (
    props: StaticComponentProps
): JSX.Element | null => {
    const C = props.input?.component;
    if (!C) {
        return null;
    }

    const { form, input, className, ...rest } = props;

    return (
        <C
            {...rest}
            className={clsx(`rf-static-element rf-${input?.name}`, className)}
        >
            {input?.content && input.content(form)}
        </C>
    );
};

StaticComponent.displayName = "StaticComponent";
