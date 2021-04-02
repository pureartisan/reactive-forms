import { Observable } from "./observable";
import { BaseControl, Errors } from "./controls";

export type ValidatorFn<V, T extends BaseControl<V> = BaseControl<V>> = (
  control: T
) => Errors | null;

export type AsyncValidatorFn<
  V,
  T extends BaseControl<V> = BaseControl<V>
> = (control: T) => Promise<Errors | null> | Observable<Errors | null>;

export type PossibleValidatorFn<
  V = any,
  T extends BaseControl<V> = BaseControl<V>
> = ValidatorFn<V, T> | ValidatorFn<V, T>[] | null;

export type PossibleAsyncValidatorFn<
  V,
  T extends BaseControl<V> = BaseControl<V>
> = AsyncValidatorFn<V, T> | AsyncValidatorFn<V, T>[] | null;

export interface Validator<V = any, T extends BaseControl<V> = BaseControl<V>> {
  validate: ValidatorFn<V, T>;
}

export interface AsyncValidator<
  V,
  T extends BaseControl<V> = BaseControl<V>
> {
  validate: AsyncValidatorFn<V, T>;
}
