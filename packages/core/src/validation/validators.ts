import { Observable } from "../models/observable";
import { nonEmpty } from "../utils/collections";
import { BaseControl, Errors } from "../models/controls";
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

const executeValidators = <V, T extends BaseControl<V>>(
  control: T,
  validators: ValidatorFn<V, T>[]
): Array<Errors | null> => {
  return validators.map((validator) => validator(control));
};

const executeAsyncValidators = <V, T extends BaseControl<V>>(
  control: T,
  validators: AsyncValidatorFn<V, T>[]
): Array<Errors | null> => {
  return validators.map((validator) => validator(control));
};

const EMAIL_REGEXP = /^(([^<>()\\[\\]\\.,;:\s@"]+(\.[^<>()\\[\\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// export type Validator = (control: Abs)

export class Validators {
  /**
   * Validator that requires controls to have a value greater than a number.
   */
  static min<
    V extends string | number = string | number,
    T extends BaseControl<V> = BaseControl<V>
  >(min: number): ValidatorFn<V, T> | null {
    return (control: T) => {
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
    V extends string | number = string | number,
    T extends BaseControl<V> = BaseControl<V>
  >(max: number): ValidatorFn<V, T> | null {
    return (control: T) => {
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
    V extends string | number = string | number,
    T extends BaseControl = BaseControl<V>
  >(minLength: number): ValidatorFn<V, T> | null {
    return (control: T) => {
      if (isEmptyValue(control.value)) {
        return null; // don't validate empty values to allow optional controls
      }
      const length = control.value?.length || 0;
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
    V extends string | number = string | number,
    T extends BaseControl = BaseControl<V>
  >(maxLength: number): ValidatorFn<V, T> | null {
    return (control: T) => {
      if (isEmptyValue(control.value)) {
        return null; // don't validate empty values to allow optional controls
      }
      const length = control.value?.length || 0;
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
    V extends string | number = string | number,
    T extends BaseControl = BaseControl<V>
  >(pattern: string | RegExp): ValidatorFn<V, T> | null {
    if (!pattern) {
      return null;
    }
    let regex: RegExp;
    let regexStr: string;

    if (typeof pattern === "string") {
      regexStr = `^${pattern}$`;
      regex = new RegExp(regexStr);
    } else {
      regexStr = pattern.toString();
      regex = pattern;
    }

    return (control) => {
      if (isEmptyValue(control.value)) {
        return null; // don't validate empty values to allow optional controls
      }
      if (regex.test(control.value)) {
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
  static compose<V, T extends BaseControl<V>>(
    validators: ValidatorFn<V, T>[] | null
  ): ValidatorFn<V, T> | null {
    if (!validators) {
      return null;
    }
    const nonEmptyValidators = validators.filter(nonEmpty);
    if (nonEmptyValidators.length === 0) {
      return null;
    }
    return (control: T) => {
      const errors = executeValidators(control, nonEmptyValidators);
      return mergeErrors(errors);
    };
  }

  /**
   * Compose multiple validators into a single function that returns the union
   * of the individual error maps.
   * @param {(Function|null|undefined)[]|null} validators
   * @return {Function|null}
   */
  static composeAsync<V, T extends BaseControl<V>>(
    validators: AsyncValidatorFn<V, T>[] | null
  ): AsyncValidatorFn<V, T> | null {
    if (!validators) {
      return null;
    }
    const nonEmptyValidators = validators.filter(nonEmpty);
    if (nonEmptyValidators.length === 0) {
      return null;
    }
    return (control: T) => {
      const observables = executeAsyncValidators(control, nonEmptyValidators);
      return Observable.fromPromise(Promise.all(observables), mergeErrors);
    };
  }
}