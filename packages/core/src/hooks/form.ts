import {useState, useEffect, DependencyList, useRef} from "react";

import { Form } from "../models/forms";
import { Subscription } from '../models/observable';

type Builder = (...args: any[]) => Form | null;

type Options = {
    valueChanges?: <T>(form: Form<T>) => void;
    statusChanges?: <T>(form: Form<T>) => void;
    stateChanges?: <T>(form: Form<T>) => void;
    anythingChanges?: <T>(form: Form<T>) => void;
};

export const useForm = <T = any>(
    builder: Builder,
    deps?: DependencyList,
    opts?: Options
): {
    form: Form<T> | undefined,
    reset: () => void;
} => {
    const subscriptions = useRef<Subscription<any>[]>([]);
    const [form, setForm] = useState<Form<T> | undefined>(undefined);

    // reset any previous subscriptions
    const unsubscribeAllSubscriptions = () => subscriptions.current?.forEach(s => s.unsubscribe());

    const buildForm = () => {
        unsubscribeAllSubscriptions();
        const f = builder();

        if (f) {
            subscriptions.current = [];

            if (opts?.valueChanges) {
                subscriptions.current.push(f.valueChanges?.subscribe(() => {
                    opts?.valueChanges && opts.valueChanges(f);
                }));
            }
            if (opts?.statusChanges) {
                subscriptions.current.push(f.statusChanges?.subscribe(() => {
                    opts?.statusChanges && opts.statusChanges(f);
                }));
            }
            if (opts?.stateChanges) {
                subscriptions.current.push(f.stateChanges?.subscribe(() => {
                    opts?.stateChanges && opts.stateChanges(f);
                }));
            }
            if (opts?.anythingChanges) {
                subscriptions.current.push(f.anythingChanges?.subscribe(() => {
                    opts?.anythingChanges && opts.anythingChanges(f);
                }));
            }

            setForm(f);
        }

        return f;
    }

    const reset = () => {
        buildForm();
    }

    useEffect(() => {
        buildForm();
        return unsubscribeAllSubscriptions;
    }, deps);

    return {
        form,
        reset
    };
};
