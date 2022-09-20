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
  errorsOnlyIfNotPristine?: boolean;
  errorTranslators?: ErrorTranslators;
}

const DefaultForm = (props: any) => <form {...props} />;

export const ReactiveForm = (props: ReactiveFormProps): JSX.Element | null => {
    const forceUpdate = useForceUpdate();

    const { form, component, errorTranslators, errorsOnlyIfNotPristine, ...rest } = props;

    useEffect(() => {
        const subscription = form?.anythingChanges.subscribe(forceUpdate);
        return () => subscription?.unsubscribe();
    }, [form]);

    if (!form) {
        return null;
    }

    const F = component ?? DefaultForm;

    const handleEnableChanged = () => form?.emitEvents();

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

                return (
                    <Field
                        key={inp?.name}
                        form={form}
                        input={inp}
                        control={ctrl}
                        errorTranslators={errorTranslators}
                        errorsOnlyIfNotPristine={errorsOnlyIfNotPristine}
                        onEnableChanged={handleEnableChanged}
                    />
                );
            })}
        </F>
    );
};
