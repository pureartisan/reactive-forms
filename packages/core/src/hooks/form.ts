import { useState, useEffect, DependencyList } from "react";

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
): Form<T> | undefined => {
  const [form, setForm] = useState<Form<T> | undefined>(undefined);

  useEffect(() => {
    const f = builder();

    if (f) {
        const subs: Subscription<any>[] = [];

        if (opts?.valueChanges) {
            subs.push(f.valueChanges?.subscribe(() => {
                opts?.valueChanges && opts.valueChanges(f);
            }));
        }
        if (opts?.statusChanges) {
            subs.push(f.statusChanges?.subscribe(() => {
                opts?.statusChanges && opts.statusChanges(f);
            }));
        }
        if (opts?.stateChanges) {
            subs.push(f.stateChanges?.subscribe(() => {
                opts?.stateChanges && opts.stateChanges(f);
            }));
        }
        if (opts?.anythingChanges) {
            subs.push(f.anythingChanges?.subscribe(() => {
                opts?.anythingChanges && opts.anythingChanges(f);
            }));
        }

        setForm(f);

        return () => subs.forEach(s => s.unsubscribe());
    }
  }, deps);

  return form;
};
