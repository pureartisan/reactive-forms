import { Observable } from "../models/observable";
import { nonEmpty } from "../utils/collections";
import { Errors } from "../models/errors";
import { BaseControl } from "../models/controls";
import { ValidatorFn, AsyncValidatorFn } from "../models/validators";

const isEmptyValue = (value?: string | number): boolean => {
  if (value === undefined || value === null || value === "") {
    return true;
  }
  // special case: number: 0
  if (value === 0) {
    return false;
  }
  return !value;
};

const mergeErrors = (arrayOfErrors: Array<Errors | null>): Errors | null => {
  const res: Errors = arrayOfErrors.reduce(
    (res: Errors, errors: Errors | null) => {
      if (!errors) {
        return res;
      }
      return {
        ...res,
        ...errors,
      };
    },
    {} as Errors
  );
  return Object.keys(res).length ? res : null;
};

const executeValidators = <V>(
  control: BaseControl<V>,
  form: any,
  validators: ValidatorFn<V>[]
): Array<Errors | null> => {
  return validators.map((validator) => validator(control, form));
};

const executeAsyncValidators = <V>(
  control: BaseControl<V>,
  form: any,
  validators: AsyncValidatorFn<V>[]
): Array<Errors | null> => {
  return validators.map((validator) => validator(control, form));
};

const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// export type Validator = (control: Abs)

export class Validators {
  /**
   * Validator that requires controls to have a value greater than a number.
   */
  static min<
    V extends string | number = string | number
  >(min: number): ValidatorFn<V> {
    return (control: BaseControl<V>) => {
      if (isEmptyValue(control.value) || isEmptyValue(min)) {
        return null; // don't validate empty values to allow optional controls
      }
      const parsedValue = parseFloat(control.value as string);
      if (isNaN(parsedValue) || parsedValue >= min) {
        return null;
      }
      return {
        min: {
          min,
          actual: parsedValue,
        },
      } as Errors;
    };
  }

  /**
   * Validator that requires controls to have a value less than a number.
   */
  static max<
    V extends string | number = string | number
  >(max: number): ValidatorFn<V> {
    return (control: BaseControl<V>) => {
      if (isEmptyValue(control.value) || isEmptyValue(max)) {
        return null; // don't validate empty values to allow optional controls
      }
      const parsedValue = parseFloat(control.value as string);
      if (isNaN(parsedValue) || parsedValue <= max) {
        return null;
      }
      return {
        max: {
          max,
          actual: parsedValue,
        },
      };
    };
  }

  /**
   * Validator that requires controls to have a non-empty value.
   */
  static required<V = any, T extends BaseControl = BaseControl<V>>(
    control: T
  ): Errors | null {
    if (!isEmptyValue(control.value)) {
      return null;
    }
    return {
      required: true,
    };
  }

  /**
   * Validator that requires control value to be true.
   */
  static requiredTrue<V = any, T extends BaseControl = BaseControl<V>>(
    control: T
  ): Errors | null {
    if (control.value === true) {
      return null;
    }
    return {
      required: true,
    };
  }

  /**
   * Validator that performs email validation.
   */
  static email<V = any, T extends BaseControl = BaseControl<V>>(
    control: T
  ): Errors | null {
    if (isEmptyValue(control.value) || EMAIL_REGEXP.test(control.value)) {
      return null;
    }
    return {
      email: true,
    };
  }

  /**
   * Validator that requires controls to have a value of a minimum length.
   */
  static minLength<
    V extends string | number = string | number
  >(minLength: number): ValidatorFn<V> {
    return (control: BaseControl<V>) => {
      if (isEmptyValue(control.value)) {
        return null; // don't validate empty values to allow optional controls
      }
      const value = control.value as any;
      const length = value?.length || 0;
      if (length >= minLength) {
        return null;
      }
      return {
        minLength: {
          requiredLength: minLength,
          actualLength: length,
        },
      };
    };
  }

  /**
   * Validator that requires controls to have a value of a maximum length.
   */
  static maxLength<
    V extends string | number = string | number
  >(maxLength: number): ValidatorFn<V> {
    return (control: BaseControl<V>) => {
      if (isEmptyValue(control.value)) {
        return null; // don't validate empty values to allow optional controls
      }
      const value = control.value as any;
      const length = value?.length || 0;
      if (length <= maxLength) {
        return null;
      }
      return {
        maxLength: {
          requiredLength: maxLength,
          actualLength: length,
        },
      };
    };
  }

  /**
   * Validator that requires a control to match a regex to its value.
   */
  static pattern<
    V extends string | number = string | number
  >(pattern: string | RegExp): ValidatorFn<V> {

    let regex: RegExp;
    let regexStr: string;

    if (pattern) {
        if (typeof pattern === "string") {
            regexStr = `^${pattern}$`;
            regex = new RegExp(regexStr);
        } else {
            regexStr = pattern.toString();
            regex = pattern;
        }
    }

    return (control) => {
      if (!pattern) {
        return null;
      }
      if (isEmptyValue(control.value)) {
        return null; // don't validate empty values to allow optional controls
      }
      if (regex.test(control.value as any)) {
        return null;
      }
      return {
        pattern: {
          requiredPattern: regexStr,
          actualValue: control.value,
        },
      };
    };
  }

  /**
   * Compose multiple validators into a single function that returns the union
   * of the individual error maps.
   * @param {(Function|null|undefined)[]|null} validators
   * @return {Function|null}
   */
  static compose<V>(
    validators: ValidatorFn<V>[] | null
  ): ValidatorFn<V> | null {
    if (!validators) {
      return null;
    }
    const nonEmptyValidators = validators.filter(nonEmpty);
    if (nonEmptyValidators.length === 0) {
      return null;
    }
    return (control: BaseControl<V>, form: any) => {
      const errors = executeValidators(control, form, nonEmptyValidators);
      return mergeErrors(errors);
    };
  }

  /**
   * Compose multiple validators into a single function that returns the union
   * of the individual error maps.
   * @param {(Function|null|undefined)[]|null} validators
   * @return {Function|null}
   */
  static composeAsync<V>(
    validators: AsyncValidatorFn<V>[] | null
  ): AsyncValidatorFn<V> | null {
    if (!validators) {
      return null;
    }
    const nonEmptyValidators = validators.filter(nonEmpty);
    if (nonEmptyValidators.length === 0) {
      return null;
    }
    return (control: BaseControl<V>, form: any) => {
      const observables = executeAsyncValidators(control, form, nonEmptyValidators);
      return Observable.fromPromise(Promise.all(observables), mergeErrors);
    };
  }
}
