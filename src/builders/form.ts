import {
  InputBase,
  InputGroup,
  InputElement,
  InputArray,
} from "../models/inputs";
import {
  Form,
  FormGroup,
  FormControl,
  FormArray,
  AbstractControl,
} from "../models/forms";
import { BaseControl } from "../models/controls";

interface ControlMap {
  [key: string]: AbstractControl<any, any>;
}

export class FormBuilder {
  static build(inputs: InputElement[], prevState?: Form): Form {
    const controls: ControlMap = {};
    inputs?.forEach((input) => {
      if (input.name) {
        const prevValue = this.getPreviousValue(input.name, prevState);
        const control = this.buildAbstractControl(input, prevValue);
        if (control) {
          controls[input.name] = control;
        }
      }
    });
    return new Form(inputs, controls);
  }

  static buildFormGroup<T>(
    group: InputGroup,
    prevState?: FormGroup<T>
  ): FormGroup<T> {
    const controls: ControlMap = {};
    group.inputs
      ?.filter((inp) => this.canBeAnAbstractControl(inp))
      ?.forEach((input) => {
        if (input.name) {
          const prevValue = this.getPreviousValue(input.name, prevState);
          const control = this.buildAbstractControl(input, prevValue);
          if (control) {
            controls[input.name] = control;
          }
        }
      });
    return new FormGroup(
      group,
      controls,
      group.validators,
      group.asyncValidators
    );
  }

  static buildFormArray(array: InputArray, prevState?: FormArray): FormArray {
    const controls =
      array.inputs
        ?.filter((inp) => this.canBeAnAbstractControl(inp))
        ?.map((input, index: number) => {
          const prevValue = this.getPreviousArrayValue(index, prevState);
          return this.buildAbstractControl(input, prevValue);
        }) ?? [];
    return new FormArray(
      array,
      controls,
      array.validators,
      array.asyncValidators
    );
  }

  static buildFormControl<V, T extends BaseControl<V>>(
    input: InputBase<V>,
    prevState?: V
  ): FormControl<V, T> {
    return new FormControl<V, T>(
      input,
      {
        value: prevState ?? input.value,
        disabled: input.disabled,
      },
      input.validators,
      input.asyncValidators
    );
  }

  private static canBeAnAbstractControl(input: InputElement): boolean {
    // NOTE: static elements are skipped, since they are just
    // rendered without considering a "form state"
    return (
      (Boolean(input) && input instanceof InputGroup) ||
      input instanceof InputArray ||
      input instanceof InputBase
    );
  }

  private static buildAbstractControl(
    input: InputElement,
    prevState?: any
  ): AbstractControl<any, any> {
    if (input instanceof InputGroup) {
      return this.buildFormGroup(input, prevState);
    } else if (input instanceof InputArray) {
      return this.buildFormArray(input, prevState);
    }
    return this.buildFormControl(input as InputBase, prevState);
  }

  private static getPreviousValue(
    name: string,
    prevState?: any
  ): any | undefined {
    return prevState?.value ? prevState.value[name] : undefined;
  }

  private static getPreviousArrayValue(
    index: number,
    prevState?: any
  ): any | undefined {
    if (!prevState?.value) {
      return undefined;
    }
    if (Array.isArray(prevState.value)) {
      return prevState.value[index] ?? undefined;
    }
    return undefined;
  }
}
