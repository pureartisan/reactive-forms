import { useState, useEffect, DependencyList } from "react";

import { Form } from "../models/forms";

type Builder = (...args: any[]) => Form;

type Options = {
  valueChanges?: <T>(form: Form<T>) => void;
};

export const useForm = <T = any>(
  builder: Builder,
  opts?: Options,
  deps?: DependencyList
): Form<T> | undefined => {
  const [form, setForm] = useState<Form<T>>();

  useEffect(() => {
    const f = builder();
    const subscription = f?.valueChanges?.subscribe(() => {
      if (opts?.valueChanges) {
        opts.valueChanges(f);
      }
    });
    setForm(f);
    return () => subscription.unsubscribe();
  }, deps);

  return form;
};
