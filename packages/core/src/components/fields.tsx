import React from "react";
import clsx from 'clsx';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormArray,
  Form
} from "../models/forms";
import {
  StaticElement,
  InputElement,
  InputBase,
  InputGroup,
  InputArray,
} from "../models/inputs";
import { ErrorTranslators } from '../models/errors';

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
}

export const Field = (props: FieldProps): JSX.Element | null => {
    const { input, control } = props;

    if (!input) {
        return null;
    }

    if (input instanceof InputBase) {
        return (
            <FieldControl
                input={input}
                control={control as FormControl<any>}
                errorTranslators={props.errorTranslators}
            />
        );
    } else if (input instanceof InputGroup) {
        return (
            <FieldGroup
                input={input}
                control={control as FormGroup<any>}
                errorTranslators={props.errorTranslators}
            />
        );
    } else if (input instanceof InputArray) {
        return (
            <FieldArray
                input={input}
                control={control as FormArray}
                errorTranslators={props.errorTranslators}
            />
        );
    } else if (input instanceof StaticElement) {
        return (
            <StaticComponent
                form={props.form}
                input={input}
            />
        );
    }

    // unknown case
    return null;
};

interface FieldControlProps<V> {
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

    return (
        <C
            control={props.control}
            input={props.input}
            errorTranslators={props.errorTranslators}
        />
    );
};

interface FieldGroupProps<V> {
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
  control?: FormArray;
  input?: InputArray;
  errorTranslators?: ErrorTranslators;
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
                        control={props.control?.at(controlIndex)}
                        errorTranslators={props.errorTranslators}
                    />
                );
            })}
        </C>
    );
};

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
            className={clsx(`ReactiveForms-StaticElement-${input?.name}`, className)}
        >
            {input?.content && input.content(form)}
        </C>
    );
};
