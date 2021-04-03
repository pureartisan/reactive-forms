import { Observable } from "./observable";
import { BaseControl, Errors } from "./controls";

export type ValidatorFn<V> = (
  control: BaseControl<V>,
  form: any
) => Errors | null;

export type AsyncValidatorFn<V> = (
  control: BaseControl<V>,
  form: any
) => Promise<Errors | null> | Observable<Errors | null>;

export type PossibleValidatorFn<V = any> = ValidatorFn<V> | ValidatorFn<V>[] | null;

export type PossibleAsyncValidatorFn<V> = AsyncValidatorFn<V> | AsyncValidatorFn<V>[] | null;

export interface Validator<V> {
  validate: ValidatorFn<V>;
}

export interface AsyncValidator<V> {
  validate: AsyncValidatorFn<V>;
}
