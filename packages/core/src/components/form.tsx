import React, { useEffect } from "react";

import { ErrorTranslators } from '../models/errors';
import { Form, FormGroup, AbstractControl } from "../models/forms";
import { useForceUpdate } from "../hooks/force-update";

import { Field } from "./fields";

interface ReactiveFormProps {
  form?: Form | AbstractControl<any>;
  component?: any;
  className?: string;
  style?: any;
  errorTranslators?: ErrorTranslators;
}

const DefaultForm = (props: any) => <form {...props} />;

export const ReactiveForm = (props: ReactiveFormProps): JSX.Element | null => {
    const forceUpdate = useForceUpdate();

    const { form, component, errorTranslators, ...rest } = props;

    if (!form) {
        return null;
    }

    // TODO ensure we batch the forceUpdates to increase performance

    useEffect(() => {
        const subscription = form?.stateChanges.subscribe(forceUpdate);
        return () => subscription?.unsubscribe();
    }, [form]);

    useEffect(() => {
        const subscription = form?.statusChanges.subscribe(forceUpdate);
        return () => subscription?.unsubscribe();
    }, [form]);

    useEffect(() => {
        const subscription = form?.valueChanges.subscribe(forceUpdate);
        return () => subscription?.unsubscribe();
    }, [form]);

    const F = component ?? DefaultForm;

    let inputs;
    if (form instanceof Form) {
        inputs = form?.inputs;
    } else if (form instanceof FormGroup) {
        inputs = form?.group?.inputs;
    }

    return (
        <F {...rest}>
            {inputs?.map((inp) => {
                const ctrl = inp?.name ? props.form?.get(inp.name) : undefined;

                if (inp?.hidden && inp.hidden(form)) {
                    return null;
                }

                return (
                    <Field
                        key={inp?.name}
                        input={inp}
                        control={ctrl}
                        errorTranslators={errorTranslators}
                    />
                );
            })}
        </F>
    );
};
