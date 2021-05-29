import React, { useEffect } from "react";
import clsx from 'clsx';

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
import { ErrorTranslators } from '../models/errors';
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
    form?: Form<any>,
    control?: AbstractControl<any>;
    input?: InputElement;
    errorTranslators?: ErrorTranslators;
}

export const Field = (props: FieldProps): JSX.Element | null => {
    const { input, control, form } = props;
    const forceUpdate = useForceUpdate();

    // TODO ensure we batch the forceUpdates to increase performance

    useEffect(() => {
        const subscription = control?.stateChanges.subscribe(forceUpdate);
        return () => subscription?.unsubscribe();
    }, [control]);

    useEffect(() => {
        const subscription = control?.statusChanges.subscribe(forceUpdate);
        return () => subscription?.unsubscribe();
    }, [control]);

    useEffect(() => {
        const subscription = control?.valueChanges.subscribe(forceUpdate);
        return () => subscription?.unsubscribe();
    }, [control]);

    if (!input) {
        return null;
    }

    if (input instanceof InputBase) {
        return (
            <FieldControl
                form={form}
                input={input}
                control={control as FormControl<any>}
                errorTranslators={props.errorTranslators}
            />
        );
    } else if (input instanceof InputGroup) {
        return (
            <FieldGroup
                form={form}
                input={input}
                control={control as FormGroup<any>}
                errorTranslators={props.errorTranslators}
            />
        );
    } else if (input instanceof InputArray) {
        return (
            <FieldArray
                form={form}
                input={input}
                control={control as FormArray}
                errorTranslators={props.errorTranslators}
            />
        );
    } else if (input instanceof StaticElement) {
        return (
            <StaticComponent
                form={form}
                input={input}
            />
        );
    }

    // unknown case
    return null;
};

interface FieldControlProps<V> {
    form?: Form<any>;
    control?: FormControl<V>;
    input?: InputBase<V>;
    errorTranslators?: ErrorTranslators;
}

export const FieldControl = <V,>(
    props: FieldControlProps<V>
): JSX.Element | null => {
    const C = props.input?.component;
    if (!C) {
        return null;
    }

    if (props.input?.hidden && props.input.hidden(props.form)) {
        return null;
    }

    return (
        <C
            control={props.control}
            input={props.input}
            errorTranslators={props.errorTranslators}
        />
    );
};

interface FieldGroupProps<V> {
    form?: Form<any>;
    control?: FormGroup<V>;
    input?: InputGroup;
    errorTranslators?: ErrorTranslators;
}

export const FieldGroup = <V,>(
    props: FieldGroupProps<V>
): JSX.Element | null => {
    const C = props.input?.component;
    if (!C) {
        return null;
    }

    if (props.input?.hidden && props.input.hidden(props.form)) {
        return null;
    }

    return (
        <C control={props.control} input={props.input}>
            {props.input?.inputs?.map((inp) => {
                const ctrl = inp?.name ? props.control?.get(inp.name) : undefined;
                return (
                    <Field
                        key={inp?.name}
                        input={inp}
                        control={ctrl}
                        errorTranslators={props.errorTranslators}
                    />
                );
            })}
        </C>
    );
};

interface FieldArrayProps {
    form?: Form<any>;
  control?: FormArray;
  input?: InputArray;
  errorTranslators?: ErrorTranslators;
}

export const FieldArray = (props: FieldArrayProps): JSX.Element | null => {
    const C = props.input?.component;
    if (!C) {
        return null;
    }

    if (props.input?.hidden && props.input.hidden(props.form)) {
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
                        control={props.control?.at(controlIndex)}
                        errorTranslators={props.errorTranslators}
                    />
                );
            })}
        </C>
    );
};

interface StaticComponentProps {
    form?: Form<any>;
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

    if (props.input?.hidden && props.input.hidden(props.form)) {
        return null;
    }

    return (
        <C
            {...props}
            className={clsx(`ReactiveForms-StaticElement-${props.input?.name}`, props.className)}
        >
            {props.input?.content && props.input.content()}
        </C>
    );
};
