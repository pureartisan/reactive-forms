import { useState, useEffect, DependencyList } from "react";

import { Form } from "../models/forms";

type Builder = (...args: any[]) => Form;

type Options = {
  valueChanges?: <T>(form: Form<T>) => void;
  statusChanges?: <T>(form: Form<T>) => void;
};

export const useForm = <T = any>(
  builder: Builder,
  deps?: DependencyList,
  opts?: Options
): Form<T> | undefined => {
  const [form, setForm] = useState<Form<T>>();

  useEffect(() => {
    const f = builder();

    const valueChangesSubs = f?.valueChanges?.subscribe(() => {
      if (opts?.valueChanges) {
        opts.valueChanges(f);
      }
    });
    const statusChangesSubs = f?.stateChanges?.subscribe(() => {
      if (opts?.statusChanges) {
        opts.statusChanges(f);
      }
    });

    setForm(f);

    return () => {
      valueChangesSubs.unsubscribe();
      statusChangesSubs.unsubscribe();
    };
  }, deps);

  return form;
};
