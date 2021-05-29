import { useState, useEffect, DependencyList } from "react";

import { Form } from "../models/forms";

type Builder = (...args: any[]) => Form | null;

type Options = {
  valueChanges?: <T>(form: Form<T>) => void;
  statusChanges?: <T>(form: Form<T>) => void;
  stateChanges?: <T>(form: Form<T>) => void;
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
        const valueChangesSubs = f.valueChanges?.subscribe(() => {
            if (opts?.valueChanges) {
                opts.valueChanges(f);
            }
        });
        const statusChangesSubs = f.statusChanges?.subscribe(() => {
            if (opts?.statusChanges) {
                opts.statusChanges(f);
            }
        });
        const stateChangesSubs = f.stateChanges?.subscribe(() => {
            if (opts?.stateChanges) {
                opts.stateChanges(f);
            }
        });

        setForm(f);

        return () => {
            valueChangesSubs.unsubscribe();
            statusChangesSubs.unsubscribe();
            stateChangesSubs.unsubscribe();
        };
    }
  }, deps);

  return form;
};
