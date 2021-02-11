import React, { useEffect } from "react";
import clsx from "clsx";

import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormArray,
} from "../models/forms";
import {
  StaticElement,
  InputElement,
  InputBase,
  InputGroup,
  InputArray,
} from "../models/inputs";
import { BaseControl } from "../models/controls";
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
  control?: AbstractControl<any, any>;
  input?: InputElement;
}

export const Field = (props: FieldProps): JSX.Element | null => {
  const { input, control } = props;
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const subscription = control?.stateChanges.subscribe(forceUpdate);
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
      <FieldControl input={input} control={control as FormControl<any, any>} />
    );
  } else if (input instanceof InputGroup) {
    return (
      <FieldGroup input={input} control={control as FormGroup<any, any>} />
    );
  } else if (input instanceof InputArray) {
    return <FieldArray input={input} control={control as FormArray} />;
  } else if (input instanceof StaticElement) {
    return <StaticComponent input={input} />;
  }

  // unknown case
  return null;
};

interface FieldControlProps<V, T extends BaseControl<V>> {
  control?: FormControl<V, T>;
  input?: InputBase<V>;
}

export const FieldControl = <V, T extends BaseControl<V>>(
  props: FieldControlProps<V, T>
): JSX.Element | null => {
  const C = props.input?.component;
  if (!C) {
    return null;
  }

  return <C control={props.control} input={props.input} />;
};

interface FieldGroupProps<V, T extends BaseControl<V>> {
  control?: FormGroup<V, T>;
  input?: InputGroup;
}

export const FieldGroup = <V, T extends BaseControl<V>>(
  props: FieldGroupProps<V, T>
): JSX.Element | null => {
  const C = props.input?.component;
  if (!C) {
    return null;
  }

  return (
    <C control={props.control} input={props.input}>
      {props.input?.inputs?.map((inp) => {
        const ctrl = inp?.name ? props.control?.get(inp.name) : undefined;
        return <Field key={inp?.name} input={inp} control={ctrl} />;
      })}
    </C>
  );
};

interface FieldArrayProps {
  control?: FormArray;
  input?: InputArray;
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
          />
        );
      })}
    </C>
  );
};

interface StaticComponentProps {
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

  return (
    <C
      {...props}
      className={clsx(
        props.className,
        `ReactiveForms-StaticElement-${props.input?.name}`
      )}
    >
      {props.input?.content && props.input.content()}
    </C>
  );
};
