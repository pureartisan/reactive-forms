import { Validators } from "../validation/validators";

import { Observable, Subscription } from "./observable";
import {
  ValidatorFn,
  AsyncValidatorFn,
  Validator,
  AsyncValidator,
  PossibleValidatorFn,
  PossibleAsyncValidatorFn,
} from "./validators";
import { Errors } from './errors';
import { InputElement, InputGroup, InputArray, InputBase } from "./inputs";
import { Status, BaseControl, ControlChangeOpts } from "./controls";

interface FormGroupValue {
  [key: string]: any;
}

type ControlOptionsObject<V> = {
  validators?: PossibleValidatorFn<V>;
  asyncValidators?: PossibleAsyncValidatorFn<V>;
};

type ValidatorOrOpts<V> =
  | PossibleValidatorFn<V>
  | ControlOptionsObject<V>;

interface NamedControlsMap {
  [name: string]: AbstractControl<any>;
}

/**
 * @param {AbstractControl} control
 * @param {(String|Number)[]|String} path
 * @param {String} delimiter
 */
const find = <V>(
  control: AbstractControl<V>,
  path: Array<string | number> | string,
  delimiter: string
): AbstractControl<V> | undefined => {
  if (path === null || path === undefined) {
    return undefined;
  }
  if (!(path instanceof Array)) {
    path = path.split(delimiter);
  }
  if (path instanceof Array && path.length === 0) {
    return undefined;
  }
  return path.reduce(
    (v: AbstractControl<V> | undefined, nameOrIndex: string | number) => {
      if (v instanceof FormGroup) {
        return v.controls[nameOrIndex] || undefined;
      }
      if (v instanceof FormArray) {
        return v.at<V>(nameOrIndex as number) || undefined;
      }
      return undefined;
    },
    control
  );
};

const isOptionsObj = <V>(
  obj: any
): obj is ControlOptionsObject<V> => {
  return Boolean(obj && !Array.isArray(obj) && typeof obj === "object");
};

const isValidator = <
  V,
  S = Validator<V> | AsyncValidator<V>
>(
  obj: any
): obj is S => {
  return Boolean(obj && "validate" in obj);
};

/**
 * @param {Function} validator
 * @return {Function}
 */
function normalizeValidator<V>(
  validator: Validator<V> | ValidatorFn<V>
): ValidatorFn<V> {
  if (isValidator<V, Validator<V>>(validator)) {
    return (control: BaseControl<V>, form: any) => validator.validate(control, form);
  }
  return validator;
}

/**
 * @param {Function} validator
 * @return {Function}
 */
function normalizeAsyncValidator<V>(
  validator: AsyncValidator<V> | AsyncValidatorFn<V>
): AsyncValidatorFn<V> {
  if (isValidator<V, AsyncValidator<V>>(validator)) {
    return (control: BaseControl<V>, form: any) => validator.validate(control, form);
  }
  return validator;
}

/**
 * @param {Function[]} validators
 * @return {Function|null}
 */
const composeValidators = <V>(
  validators: ValidatorFn<V>[]
): ValidatorFn<V> | null => {
  return Validators.compose(validators.map(normalizeValidator));
};

/**
 * @param {Function[]} validators
 * @return {Function|null}
 */
const composeAsyncValidators = <V>(
  validators: AsyncValidatorFn<V>[]
): AsyncValidatorFn<V> | null => {
  return Validators.composeAsync(validators.map(normalizeAsyncValidator));
};

const coerceToValidator = <V>(
  validatorOrOpts?: ValidatorOrOpts<V>
): ValidatorFn<V> | null => {
  const validator = isOptionsObj(validatorOrOpts)
    ? (validatorOrOpts.validators as PossibleValidatorFn<V>)
    : (validatorOrOpts as PossibleValidatorFn<V>);

  if (!validator) {
    return null;
  }

  return Array.isArray(validator) ? composeValidators(validator) : validator;
};

const coerceToAsyncValidator = <V>(
  asyncValidator?: AsyncValidatorFn<V> | AsyncValidatorFn<V>[] | null,
  validatorOrOpts?: ValidatorOrOpts<V>
): AsyncValidatorFn<V> | null => {
  const origAsyncValidator = isOptionsObj(validatorOrOpts)
    ? (validatorOrOpts.asyncValidators as PossibleAsyncValidatorFn<V>)
    : (asyncValidator as PossibleAsyncValidatorFn<V>);

  if (!origAsyncValidator) {
    return null;
  }

  return Array.isArray(origAsyncValidator)
    ? composeAsyncValidators(origAsyncValidator)
    : origAsyncValidator;
};

/**
 * This is the base class for `FormControl`, `FormGroup`, and
 * `FormArray`.
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 */
export abstract class AbstractControl<V>
  implements BaseControl<V> {
  value?: V;

  status!: Status;

  /**
   * A control is marked `touched` once the user has triggered
   * a `blur` event on it.
   */
  touched: boolean;

  /**
   * A control is `pristine` if the user has not yet changed
   * the value in the UI.
   *
   * Note that programmatic changes to a control's value will
   * *not* mark it dirty.
   */
  pristine: boolean;

  errors: Errors | null;

  validator: ValidatorFn<V> | null;
  asyncValidator: AsyncValidatorFn<V> | null;

  valueChanges!: Observable<V>;
  statusChanges!: Observable<Status>;
  stateChanges!: Observable<any>;
  anythingChanges!: Observable<any>;

  protected _parent?: FormGroup<any> | FormArray;
  protected pendingChange: boolean;
  protected pendingDirty: boolean;
  protected pendingTouched: boolean;

  private onCollectionChange?: () => void;

  private asyncValidationSubscription?: Subscription;

  /**
   * @param {Function|null} validator
   * @param {Function|null} asyncValidator
   */
  constructor(
    validator: ValidatorFn<V> | null,
    asyncValidator: AsyncValidatorFn<V> | null
  ) {
    this.validator = validator;
    this.asyncValidator = asyncValidator;
    /**
     * A control is marked `touched` once the user has triggered
     * a `blur` event on it.
     */
    this.touched = false;
    /**
     * A control is `pristine` if the user has not yet changed
     * the value in the UI.
     *
     * Note that programmatic changes to a control's value will
     * *not* mark it dirty.
     */
    this.pristine = true;

    this.errors = null;

    this.pendingChange = false;
    this.pendingDirty = false;
    this.pendingTouched = false;

    // this.hasError = this.hasError.bind(this);
    // this.getError = this.getError.bind(this);
    // this.reset = this.reset.bind(this);
    // this.get = this.get.bind(this);
    // this.patchValue = this.patchValue.bind(this);
    // this.setValue = this.setValue.bind(this);
  }

  abstract getRawValue(): any;

  /**
   * A control is `dirty` if the user has changed the value
   * in the UI.
   *
   * Note that programmatic changes to a control's value will
   * *not* mark it dirty.
   * @return {Boolean}
   */
  get dirty(): boolean {
    return !this.pristine;
  }

  /**
   * A control is `valid` when its `status === VALID`.
   *
   * In order to have this status, the control must have passed all its
   * validation checks.
   * @return {Boolean}
   */
  get valid(): boolean {
    return this.status === "VALID";
  }

  /**
   * A control is `invalid` when its `status === INVALID`.
   *
   * In order to have this status, the control must have failed
   * at least one of its validation checks.
   * @return {Boolean}
   */
  get invalid(): boolean {
    return this.status === "INVALID";
  }

  /**
   * A control is `pending` when its `status === PENDING`.
   *
   * In order to have this status, the control must be in the
   * middle of conducting a validation check.
   */
  get pending(): boolean {
    return this.status === "PENDING";
  }

  /**
   * The parent control.
   * * @return {FormGroup|FormArray}
   */
  get parent(): FormGroup<any> | FormArray | undefined {
    return this._parent;
  }

  /**
   * A control is `untouched` if the user has not yet triggered
   * a `blur` event on it.
   * @return {Boolean}
   */
  get untouched(): boolean {
    return !this.touched;
  }

  /**
   * A control is `enabled` as long as its `status !== DISABLED`.
   *
   * In other words, it has a status of `VALID`, `INVALID`, or
   * `PENDING`.
   * @return {Boolean}
   */
  get enabled(): boolean {
    return this.status !== "DISABLED";
  }

  /**
   * A control is disabled if it's status is `DISABLED`
   */
  get disabled(): boolean {
    return this.status === "DISABLED";
  }

  /**
   * Retrieves the top-level ancestor of this control.
   * @return {AbstractControl}
   */
  get root(): AbstractControl<any> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let x: AbstractControl<any> = this;
    while (x._parent) {
      x = x._parent;
    }
    return x;
  }

  setInitialStatus(): void {
    if (this.disabled) {
      this.status = "DISABLED";
    } else {
      this.status = "VALID";
    }
  }

  emitEvents(onlySelf?: boolean): void {
    this.stateChanges?.next();
    this.statusChanges?.next(this.status);
    this.valueChanges?.next(this.value);
    this.anythingChanges?.next();

    if (this._parent && !onlySelf) {
        this._parent.emitEvents();
    }
  }

  /**
   * Disables the control. This means the control will be exempt from validation checks and
   * excluded from the aggregate value of any parent. Its status is `DISABLED`.
   *
   * If the control has children, all children will be disabled to maintain the model.
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
   * @return {void}
   */
  disable(opts: ControlChangeOpts = {}): void {
    this.status = "DISABLED";
    this.errors = null;
    this.forEachChild((control) => {
      control.disable({
        emitEvent: false,
        onlySelf: true,
      });
    });
    this.updateValueAndValidity({
        onlySelf: true,
        emitEvent: opts.emitEvent,
    });
    this.updateAncestors(opts.onlySelf, opts.emitEvent);
  }

  /**
   * Enables the control. This means the control will be included in validation checks and
   * the aggregate value of its parent. Its status is re-calculated based on its value and
   * its validators.
   *
   * If the control has children, all children will be enabled.
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
   * @return {void}
   */
  enable(opts: ControlChangeOpts = {}): void {
    this.status = "VALID";
    this.forEachChild((control) => {
      control.enable({
        emitEvent: false,
        onlySelf: true,
      });
    });
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: opts.emitEvent,
    });
    this.updateAncestors(opts.onlySelf, opts.emitEvent);
  }

  /**
   * Re-calculates the value and validation status of the control.
   *
   * By default, it will also update the value and validity of its ancestors.
   * @param {{onlySelf: Boolean, emitEvent: Booelan}} options
   */
  updateValueAndValidity(opts: ControlChangeOpts = {}): void {
    this.setInitialStatus();
    this.updateValue();
    if (this.enabled) {
      this.cancelExistingSubscription();
      this.errors = this.runValidator();
      this.status = this.calculateStatus();
      if (this.status === "VALID" || this.status === "PENDING") {
        this.runAsyncValidator(opts.emitEvent !== false);
      }
    }
    if (opts.emitEvent !== false) {
      this.emitEvents(opts.onlySelf);
    }
    if (this._parent && !opts.onlySelf) {
      this._parent.updateValueAndValidity(opts);
    }
  }

  /**
   * Marks the control as `touched`.
   *
   * This will also mark all direct ancestors as `touched` to maintain
   * the model.
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
   * @return {void}
   */
  markAsTouched(opts: ControlChangeOpts = {}): void {
    this.touched = true;
    if (this._parent && !opts.onlySelf) {
      this._parent.markAsTouched(opts);
    }
    if (opts.emitEvent) {
      this.stateChanges?.next();
    }
  }

  /**
   * Marks the control as `pristine`.
   *
   * If the control has any children, it will also mark all children as `pristine`
   * to maintain the model, and re-calculate the `pristine` status of all parent
   * controls.
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
   * @return {void}
   */
  markAsPristine(opts: ControlChangeOpts = {}): void {
    this.pristine = true;
    this.pendingDirty = false;
    if (opts.emitEvent) {
      this.stateChanges?.next();
    }
    this.forEachChild((control) => {
      control.markAsPristine({
        onlySelf: true,
      });
    });
    if (this._parent && !opts.onlySelf) {
      this._parent.updatePristine(opts);
    }
  }

  /**
   * Marks the control as `untouched`.
   *
   * If the control has any children, it will also mark all children as `untouched`
   * to maintain the model, and re-calculate the `touched` status of all parent
   * controls.
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
   * @return {void}
   */
  markAsUntouched(opts: ControlChangeOpts = {}): void {
    this.touched = false;
    this.pendingTouched = false;
    this.forEachChild((control) => {
      control.markAsUntouched({
        onlySelf: true,
      });
    });
    if (this._parent && !opts.onlySelf) {
      this._parent.updateTouched(opts);
    }
    if (opts.emitEvent) {
      this.stateChanges.next();
    }
  }

  /**
   * Marks the control as `dirty`.
   *
   * This will also mark all direct ancestors as `dirty` to maintain
   * the model.
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
   * @return {void}
   */
  markAsDirty(opts: ControlChangeOpts = {}): void {
    this.pristine = false;
    if (opts.emitEvent) {
      this.stateChanges?.next();
    }
    if (this._parent && !opts.onlySelf) {
      this._parent.markAsDirty(opts);
    }
  }

  /**
   * Marks the control as `pending`.
   * @param {{onlySelf: Boolean}} opts
   * @return {void}
   */
  markAsPending(opts: ControlChangeOpts = {}): void {
    this.status = "PENDING";

    if (this._parent && !opts.onlySelf) {
      this._parent.markAsPending(opts);
    }
  }

  /**
   * Sets the synchronous validators that are active on this control.  Calling
   * this will overwrite any existing sync validators.
   * @param {Function|Function[]|null} newValidator
   * @return {void}
   */
  setValidators(newValidator: ValidatorFn<any> | ValidatorFn<any>[] | null): void {
    this.validator = coerceToValidator(newValidator);
  }

  /**
   * Sets the async validators that are active on this control. Calling this
   * will overwrite any existing async validators.
   */
  setAsyncValidators(
    newValidator: AsyncValidatorFn<any> | AsyncValidatorFn<any>[] | null
  ): void {
    this.asyncValidator = coerceToAsyncValidator(newValidator);
  }

  /**
   * Sets errors on a form control.
   *
   * This is used when validations are run manually by the user, rather than automatically.
   *
   * Calling `setErrors` will also update the validity of the parent control.
   *
   * ### Example
   *
   * ```
   * const login = new FormControl("someLogin");
   * login.setErrors({
   *   "notUnique": true
   * });
   *
   * ```
   * @param {{onlySelf: boolean}} opts
   * @return {void}
   */
  setErrors(errors?: Errors | null, opts: ControlChangeOpts = {}): void {
    this.errors = errors ?? null;
    this.updateControlsErrors(opts.emitEvent !== false);
  }

  /**
   * Retrieves a child control given the control's name or path.
   *
   * Paths can be passed in as an array or a string delimited by a dot.
   *
   * To get a control nested within a `person` sub-group:
   *
   * * `this.form.get('person.name');`
   *
   * -OR-
   *
   * * `this.form.get(['person', 'name']);`
   * @param {(String|Number)[]|String} path
   * @return {AbstractControl|null}
   */
  get(
    path: string | Array<string | number>
  ): AbstractControl<V> | undefined {
    return find(this, path, ".");
  }

  /**
   * Returns error data if the control with the given path has the error specified. Otherwise
   * returns null or undefined.
   *
   * If no path is given, it checks for the error on the present control.
   * @param {String} errorCode
   * @param {(String|Number)[]|String} path
   */
  getError(
    errorCode: string,
    path: string | Array<string | number>
  ): any | null {
    const control: AbstractControl<V> | undefined = path
      ? this.get(path)
      : this;
    return control?.errors ? control.errors[errorCode] : null;
  }

  /**
   * Returns true if the control with the given path has the error specified. Otherwise
   * returns false.
   *
   * If no path is given, it checks for the error on the present control.
   * @param {String} errorCode
   * @param {(String|Number)[]|String} path
   * @return {Booelan}
   */
  hasError(errorCode: string, path: string | Array<string | number>): boolean {
    return Boolean(this.getError(errorCode, path));
  }

  /**
   * Empties out the sync validator list.
   */
  clearValidators(): void {
    this.validator = null;
  }

  /**
   * Empties out the async validator list.
   */
  clearAsyncValidators(): void {
    this.asyncValidator = null;
  }

  /**
   * @param {FormGroup|FormArray} parent
   * @return {Void}
   */
  setParent(parent: FormGroup<any> | FormArray): void {
    this._parent = parent;
  }

  /**
   * @param {Boolean} onlySelf
   */
  protected updateAncestors(onlySelf?: boolean, emitEvent?: boolean): void {
    if (this._parent && !onlySelf) {
      const opts = { emitEvent };
      this._parent.updateValueAndValidity(opts);
      this._parent.updatePristine(opts);
      this._parent.updateTouched(opts);
    }
  }

  /**
   * @param {String} status
   * @return {Booelan}
   */
  protected anyControlsHaveStatus(status: Status): boolean {
    return this.anyControls((control) => control.status === status);
  }

  /**
   * @return {String}
   */
  protected calculateStatus(): Status {
    if (this.allControlsDisabled()) {
      return "DISABLED";
    }
    if (this.errors) {
      return "INVALID";
    }
    if (this.anyControlsHaveStatus("PENDING")) {
      return "PENDING";
    }
    if (this.anyControlsHaveStatus("INVALID")) {
      return "INVALID";
    }
    return "VALID";
  }

  protected runValidator(): any | null {
    return this.validator ? this.validator((this as unknown) as BaseControl<V>, this.root) : null;
  }

  /**
   * @param {Booelan} emitEvent
   * @return {void}
   */
  protected runAsyncValidator(emitEvent: boolean): void {
    if (this.asyncValidator) {
      this.status = "PENDING";
      const obs = Observable.toObservable(
        this.asyncValidator((this as unknown) as BaseControl<V>, this.root)
      );
      this.asyncValidationSubscription = obs.subscribe((errors) =>
        this.setErrors(errors, { emitEvent })
      );
    }
  }

  protected cancelExistingSubscription(): void {
    this.asyncValidationSubscription?.unsubscribe();
  }

  /**
   * @param {{onlySelf: boolean}} opts
   * @return {void}
   */
  updatePristine(opts: ControlChangeOpts = {}): void {
    this.pristine = !this.anyControlsDirty();
    if (this._parent && !opts.onlySelf) {
      this._parent.updatePristine(opts);
    }
  }

  /**
   * @param {{onlySelf: boolean}} opts
   * @return {void}
   */
  updateTouched(opts: ControlChangeOpts = {}): void {
    this.touched = this.anyControlsTouched();
    if (this._parent && !opts.onlySelf) {
      this._parent.updateTouched(opts);
    }
  }

  /**
   * @return {Boolean}
   */
  protected anyControlsDirty(): boolean {
    return this.anyControls((control) => control.dirty);
  }

  /**
   * @return {Boolean}
   */
  protected anyControlsTouched(): boolean {
    return this.anyControls((control) => control.touched);
  }

  /**
   * @param {Booelan} emitEvent
   * @return {void}
   */
  updateControlsErrors(emitEvent: boolean): void {
    this.status = this.calculateStatus();
    if (emitEvent) {
      this.statusChanges?.next();
      this.stateChanges?.next();
      this.anythingChanges?.next();
    }
    if (this._parent) {
      this._parent.updateControlsErrors(emitEvent);
    }
  }

  protected initObservables(): void {
    this.valueChanges = new Observable<V>();
    this.statusChanges = new Observable<Status>();
    this.stateChanges = new Observable<any>();
    this.anythingChanges = new Observable<any>();
  }

  abstract reset(formState: unknown, opts?: ControlChangeOpts): void;

  abstract setValue(value?: V, opts?: ControlChangeOpts): void;
  abstract patchValue(value?: V, opts?: ControlChangeOpts): void;

  protected abstract updateValue(): void;

  protected abstract forEachChild(
    callback: (
      control: AbstractControl<V>,
      nameOrIndex?: string | number
    ) => void
  ): void;

  protected abstract allControlsDisabled(): boolean;

  protected abstract anyControls(
    callback: (control: AbstractControl<V>) => boolean
  ): boolean;

  registerOnCollectionChange(fn: () => void = () => {}): void {
    this.onCollectionChange = fn;
  }

  triggerOnCollectionChange(): void {
    if (this.onCollectionChange) {
      this.onCollectionChange();
    }
  }
}

export class FormControl<V> extends AbstractControl<V> {
  input: InputBase<V>;

  active: boolean;

  private pendingValue?: V;

  constructor(
    input: InputBase<V>,
    formState: unknown,
    validatorOrOpts?: ValidatorOrOpts<V>,
    asyncValidator?: AsyncValidatorFn<V> | AsyncValidatorFn<V>[] | null
  ) {
    super(
      coerceToValidator(validatorOrOpts),
      coerceToAsyncValidator<V>(asyncValidator, validatorOrOpts)
    );
    this.input = input;
    this.applyFormState(formState);
    this.pendingChange = true;
    this.pendingDirty = false;
    this.pendingTouched = false;

    /**
     * A control is `active` when its focused.
     */
    this.active = false;

    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: false,
    });
    this.initObservables();
  }

  /**
   * A control is `inactive` when its not focused.
   * @return {Boolean}
   */
  get inactive(): boolean {
    return !this.active;
  }

  getRawValue(): V | undefined {
    return this.value;
  }

  /**
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} options
   * @return {void}
   */
  setValue(value?: V, options: ControlChangeOpts = {}): void {
    this.value = this.pendingValue = value;
    this.updateValueAndValidity(options);
  }

  /**
   * Patches the value of a control.
   *
   * This function is functionally the same as setValue at this level.
   * It exists for symmetry with patchValue on `FormGroups` and
   * `FormArrays`, where it does behave differently.
   * @param {any} value
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} options
   * @return {void}
   */
  patchValue(value?: V, options: ControlChangeOpts = {}): void {
    this.setValue(value, options);
  }

  /**
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} options
   * @return {void}
   */
  reset(formState: any = null, options: ControlChangeOpts = {}): void {
    this.applyFormState(formState);
    this.markAsPristine(options);
    this.markAsUntouched(options);
    this.setValue(this.value as V, options);
    this.pendingChange = false;
  }

  protected updateValue(): void {
    // do nothing
  }

  protected forEachChild(_: unknown): void {
    // do nothing
  }

  /**
   * @param {Function} condition
   * @return {Boolean}
   */
  protected anyControls(_: unknown): boolean {
    return false;
  }

  /**
   * @return {Boolean}
   */
  protected allControlsDisabled(): boolean {
    return this.disabled;
  }

  /**
   * @return {Boolean}
   */
  private isBoxedValue(formState: any) {
    return (
      typeof formState === "object" &&
      formState !== null &&
      Object.keys(formState).length === 2 &&
      "value" in formState &&
      "disabled" in formState
    );
  }

  private applyFormState(formState: any) {
    if (this.isBoxedValue(formState)) {
      this.value = this.pendingValue = formState.value;
      if (formState.disabled) {
        this.disable({
          onlySelf: true,
          emitEvent: false,
        });
      } else {
        this.enable({
          onlySelf: true,
          emitEvent: false,
        });
      }
    } else {
      this.value = this.pendingValue = formState;
    }
  }
}

export class FormGroup<
  V extends FormGroupValue
> extends AbstractControl<V> {
  group: InputGroup;
  controls: NamedControlsMap;

  constructor(
    group: InputGroup,
    controls: NamedControlsMap,
    validatorOrOpts?: ValidatorOrOpts<V>,
    asyncValidator?: AsyncValidatorFn<any> | AsyncValidatorFn<any>[] | null
  ) {
    super(
      coerceToValidator(validatorOrOpts),
      coerceToAsyncValidator<V>(asyncValidator, validatorOrOpts)
    );
    this.group = group || {};
    this.controls = controls || {};
    this.initObservables();
    this.setUpControls();
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: false,
    });
  }

  /**
   * Check whether there is an enabled control with the given name in the group.
   *
   * It will return false for disabled controls. If you'd like to check for existence in the group
   * only, use `AbstractControl` get instead.
   * @param {String} controlName
   * @return {Boolean}
   */
  contains(controlName: string): boolean {
    return Boolean(this.controls[controlName]?.enabled);
  }

  /**
   * Registers a control with the group's list of controls.
   *
   * This method does not update the value or validity of the control, so for most cases you'll want
   * to use addControl instead.
   * @param {String} name
   * @param {AbstractControl} control
   * @return {AbstractControl}
   */
  registerControl<V>(
    name: string,
    control: AbstractControl<V>
  ): AbstractControl<V> {
    if (this.controls[name]) return this.controls[name];
    this.controls[name] = control;
    control.setParent(this as any);
    control.registerOnCollectionChange(this._onCollectionChange);
    return control;
  }

  /**
   * Add a control to this group.
   * @param {String} name
   * @param {AbstractControl} control
   * @return {void}
   */
  addControl<V>(
    name: string,
    control: AbstractControl<V>
  ): void {
    this.registerControl(name, control);
    this.updateValueAndValidity();
    this._onCollectionChange();
  }

  /**
   * Remove a control from this group.
   * @param {String} name
   * @return {void}
   */
  removeControl(name: string): void {
    if (this.controls[name]) this.controls[name].registerOnCollectionChange();
    delete this.controls[name];
    this.updateValueAndValidity();
    this._onCollectionChange();
  }

  /**
   * Replace an existing control.
   * @param {String} name
   * @param {AbstractControl} control
   * @return {void}
   */
  setControl<V>(
    name: string,
    control: AbstractControl<V>
  ): void {
    if (this.controls[name]) {
      this.controls[name].registerOnCollectionChange();
      delete this.controls[name];
    }
    if (control) {
      this.registerControl(name, control);
    }
    this.updateValueAndValidity();
    this._onCollectionChange();
  }

  /**
   * Sets the value of the FormGroup. It accepts an object that matches
   * the structure of the group, with control names as keys.
   *
   * This method performs strict checks, so it will throw an error if you try
   * to set the value of a control that doesn't exist or if you exclude the
   * value of a control.
   *
   *  ### Example
   *  form.setValue({first: 'Jon', last: 'Snow'});
   *  console.log(form.value);   // {first: 'Jon', last: 'Snow'}
   * @param {{[key: string]: any}} value
   * @param {{onlySelf: boolean, emitEvent: boolean}} options
   * @return {void}
   */
  setValue(value?: V, options: ControlChangeOpts = {}): void {
    this.checkAllValuesPresent(value);
    if (value) {
      Object.keys(value).forEach((name) => {
        this.throwIfControlMissing(name);
        this.controls[name].setValue(value[name], {
          onlySelf: true,
          emitEvent: options.emitEvent,
        });
      });
    }
    this.updateValueAndValidity(options);
  }

  /**
   * Resets the `FormGroup`.
   * @param {any} value
   * @param {{onlySelf: boolean, emitEvent: boolean}} options
   * @return {void}
   */
  reset(value?: unknown, options: ControlChangeOpts = {}): void {
    const v = value as any;
    this.forEachChild((control, name) => {
      control.reset(name && v ? v[name] : null, {
        onlySelf: true,
        emitEvent: options.emitEvent,
      });
    });
    this.updateValueAndValidity(options);
    this.updatePristine(options);
    this.updateTouched(options);
  }

  /**
   *  Patches the value of the FormGroup. It accepts an object with control
   *  names as keys, and will do its best to match the values to the correct controls
   *  in the group.
   *
   *  It accepts both super-sets and sub-sets of the group without throwing an error.
   *
   *  ### Example
   *  ```
   *  console.log(form.value);   // {first: null, last: null}
   *
   *  form.patchValue({first: 'Jon'});
   *  console.log(form.value);   // {first: 'Jon', last: null}
   *
   *  ```
   * @param {{[key: string]: any}} value
   * @param {{onlySelf: boolean, emitEvent: boolean}} options
   * @return {void}
   */
  patchValue(value?: V, options: ControlChangeOpts = {}): void {
    if (value) {
      Object.keys(value).forEach((name) => {
        if (this.controls[name]) {
          this.controls[name].patchValue(value[name], {
            onlySelf: true,
            emitEvent: options.emitEvent,
          });
        }
      });
    }
    this.updateValueAndValidity(options);
  }

  /**
   * The aggregate value of the FormGroup, including any disabled controls.
   *
   * If you'd like to include all values regardless of disabled status, use this method.
   * Otherwise, the `value` property is the best way to get the value of the group.
   */
  getRawValue(): any {
    return this.reduceChildren({} as any, (acc, control, name) => {
      acc[name] = control.getRawValue();
      return acc;
    });
  }

  /**
   * @param {{(v: any, k: String) => void}} callback
   * @return {void}
   */
  forEachChild(
    callback: (control: AbstractControl<V>, name?: string) => void
  ): void {
    Object.keys(this.controls).forEach((name) =>
      callback(this.controls[name], name)
    );
  }

  /**
   * Enables the control. This means the control will be included in validation checks and
   * the aggregate value of its parent. Its status is re-calculated based on its value and
   * its validators.
   *
   * If the control has children, all children will be enabled.
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
   * @return {void}
   */
  enable(opts: ControlChangeOpts = {}): void {
        this.status = "VALID";
        const isHidden = this.group?.hidden?.(opts.form);
        this.forEachChild((control) => {
            const childOpts = {
                emitEvent: false,
                onlySelf: true,
                form: opts.form
            };
            if (isHidden) {
                control.disable(childOpts);
            } else {
                control.enable(childOpts);
            }
        });
        this.updateValueAndValidity({
            onlySelf: true,
            emitEvent: opts.emitEvent,
        });
        this.updateAncestors(opts.onlySelf, opts.emitEvent);
  }

  // TODO, do we need this?
  private _onCollectionChange(): void {
    // do nothing
  }

  /**
   * @param {Function} condition
   * @return {Boolean}
   */
  anyControls(callback: (control: AbstractControl<V>) => boolean): boolean {
    let res = false;
    this.forEachChild((control, name) => {
      res = res || Boolean(name && this.contains(name) && callback(control));
    });
    return res;
  }

  updateValue(): void {
    this.value = this.reduceValue();
  }

  private reduceValue(): V {
    return this.reduceChildren({} as any, (value, control, name) => {
      if (control.enabled || this.disabled) {
        value[name] = control.value;
      }
      return value;
    });
  }

  /**
   * @param {Function} fn
   */
  private reduceChildren<U = any>(
    initValue: U,
    fn: (accumilated: U, control: AbstractControl<any>, name: string) => U
  ): U {
    let res = initValue;
    this.forEachChild((control, name) => {
      res = fn(res, control, name as string);
    });
    return res;
  }

  private setUpControls(): void {
    this.forEachChild((control) => {
      control.setParent(this as any);
      control.registerOnCollectionChange(this._onCollectionChange);
    });
  }

  /**
   * @return {Boolean}
   */
  protected allControlsDisabled(): boolean {
    for (const controlName of Object.keys(this.controls)) {
      if (this.controls[controlName].enabled) {
        return false;
      }
    }
    return Object.keys(this.controls).length > 0 || this.disabled;
  }

  private checkAllValuesPresent(value: any) {
    this.forEachChild((control, name) => {
      if (value[name as string] === undefined) {
        throw new Error(
          `Must supply a value for form control with name: '${name}'.`
        );
      }
    });
  }

  private throwIfControlMissing(name: string): void {
    if (!Object.keys(this.controls).length) {
      throw new Error(
        "There are no form controls registered with this group yet."
      );
    }
    if (!this.controls[name]) {
      throw new Error(`Cannot find form control with name: ${name}.`);
    }
  }
}

export class FormArray extends AbstractControl<any> {
  inputArray: InputArray;
  controls: AbstractControl<any>[];

  constructor(
    inputArray: InputArray,
    controls: AbstractControl<any>[],
    validatorOrOpts?: ValidatorOrOpts<any>,
    asyncValidator?: AsyncValidatorFn<any> | AsyncValidatorFn<any>[] | null
  ) {
    super(
      coerceToValidator(validatorOrOpts),
      coerceToAsyncValidator(asyncValidator, validatorOrOpts)
    );
    this.inputArray = inputArray || {};
    this.controls = controls || [];
    this.initObservables();
    this.setUpControls();
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: false,
    });
  }

  /**
   * Get the `AbstractControl` at the given `index` in the array.
   * @param {Number} index
   * @return {AbstractControl}
   */
  at<V>(
    index: number
  ): AbstractControl<V> | undefined {
    return this.controls[index];
  }

  /**
   * Insert a new `AbstractControl` at the end of the array.
   * @param {AbstractControl} control
   * @return {Void}
   */
  push<V>(control: AbstractControl<V>): void {
    this.controls.push(control);
    this.registerControl(control);
    this.updateValueAndValidity();
    this._onCollectionChange();
  }

  /**
   * Insert a new `AbstractControl` at the given `index` in the array.
   * @param {Number} index
   * @param {AbstractControl} control
   */
  insert<V>(
    index: number,
    control: AbstractControl<V>
  ): void {
    this.controls.splice(index, 0, control);
    this.registerControl(control);
    this.updateValueAndValidity();
    this._onCollectionChange();
  }

  /**
   * Remove the control at the given `index` in the array.
   * @param {Number} index
   */
  removeAt(index: number): void {
    if (!this.controls[index]) {
      return;
    }
    this.controls[index].registerOnCollectionChange();
    this.controls.splice(index, 1);
    this.updateValueAndValidity();
    this._onCollectionChange();
  }

  /**
   * Replace an existing control.
   * @param {Number} index
   * @param {AbstractControl} control
   */
  setControl<V>(
    index: number,
    control: AbstractControl<V>
  ): void {
    if (this.controls[index]) {
      this.controls[index].registerOnCollectionChange();
    }
    this.controls.splice(index, 1);

    if (control) {
      this.controls.splice(index, 0, control);
      this.registerControl(control);
    }

    this.updateValueAndValidity();
    this._onCollectionChange();
  }

  /**
   * Length of the control array.
   * @return {Number}
   */
  get length(): number {
    return this.controls.length;
  }

  /**
   * Sets the value of the `FormArray`. It accepts an array that matches
   * the structure of the control.
   * @param {any[]} value
   * @param {{onlySelf?: boolean, emitEvent?: boolean}} options
   */
  setValue<T>(value: T[], options: ControlChangeOpts = {}): void {
    this.checkAllValuesPresent(value);
    value.forEach((newValue, index) => {
      this.throwIfControlMissing(index);
      this.at(index)?.setValue(newValue, {
        onlySelf: true,
        emitEvent: options.emitEvent,
      });
    });
    this.updateValueAndValidity(options);
  }

  /**
   *  Patches the value of the `FormArray`. It accepts an array that matches the
   *  structure of the control, and will do its best to match the values to the correct
   *  controls in the group.
   * @param {any[]} value
   * @param {{onlySelf?: boolean, emitEvent?: boolean}} options
   */
  patchValue<T>(value: T[], options: ControlChangeOpts = {}): void {
    value.forEach((newValue, index) => {
      this.at(index)?.patchValue(newValue, {
        onlySelf: true,
        emitEvent: options.emitEvent,
      });
    });
    this.updateValueAndValidity(options);
  }

  /**
   * Resets the `FormArray`.
   * @param {any[]} value
   * @param {{onlySelf?: boolean, emitEvent?: boolean}} options
   */
  reset(value = [], options: ControlChangeOpts = {}): void {
    this.forEachChild((control, index) => {
      control.reset(value[index as number], {
        onlySelf: true,
        emitEvent: options.emitEvent,
      });
    });
    this.updateValueAndValidity(options);
    this.updatePristine(options);
    this.updateTouched(options);
  }

  /**
   * The aggregate value of the array, including any disabled controls.
   *
   * If you'd like to include all values regardless of disabled status, use this method.
   * Otherwise, the `value` property is the best way to get the value of the array.
   * @return {any[]}
   */
  getRawValue(): any[] {
    return this.controls.map((control) => control.getRawValue());
  }

  /**
   * Enables the control. This means the control will be included in validation checks and
   * the aggregate value of its parent. Its status is re-calculated based on its value and
   * its validators.
   *
   * If the control has children, all children will be enabled.
   * @param {{onlySelf: Boolean, emitEvent: Boolean}} opts
   * @return {void}
   */
  enable(opts: ControlChangeOpts = {}): void {
        this.status = "VALID";
        const isHidden = this.inputArray?.hidden?.(opts.form);
        this.forEachChild((control) => {
            const childOpts = {
                emitEvent: false,
                onlySelf: true,
                form: opts.form
            };
            if (isHidden) {
                control.disable(childOpts);
            } else {
                control.enable(childOpts);
            }
        });
        this.updateValueAndValidity({
            onlySelf: true,
            emitEvent: opts.emitEvent,
        });
        this.updateAncestors(opts.onlySelf, opts.emitEvent);
  }

  private throwIfControlMissing(index: number): void {
    if (!this.controls.length) {
      throw new Error(
        "There are no form controls registered with this array yet."
      );
    }
    if (!this.at(index)) {
      throw new Error(`Cannot find form control at index ${index}`);
    }
  }

  protected forEachChild(
    callback: (control: AbstractControl<any>, index?: number) => void
  ): void {
    this.controls.forEach((control, index) => {
      callback(control, index);
    });
  }

  protected updateValue(): void {
    this.value = this.controls
      .filter((control) => control.enabled || this.disabled)
      .map((control) => control.value);
  }

  protected anyControls(
    callback: (control: AbstractControl<any>) => boolean
  ): boolean {
    return this.controls.some(
      (control) => control.enabled && callback(control)
    );
  }

  private setUpControls() {
    this.forEachChild((control) => this.registerControl(control));
  }

  private checkAllValuesPresent(value: any[]) {
    this.forEachChild((control, index) => {
      if (value[index as number] === undefined) {
        throw new Error(
          `Must supply a value for form control at index: ${index}.`
        );
      }
    });
  }

  protected allControlsDisabled(): boolean {
    for (const control of this.controls) {
      if (control.enabled) {
        return false;
      }
    }
    return this.controls.length > 0 || this.disabled;
  }

  private registerControl(control: AbstractControl<any>): void {
    control.setParent(this);
    control.registerOnCollectionChange(this._onCollectionChange);
  }

  _onCollectionChange(): void {
    // do nothing
  }
}

export class Form<T = any> extends FormGroup<T> {
  inputs: InputElement[];

  constructor(
    inputs: InputElement[],
    controls: NamedControlsMap,
    validatorOrOpts?: ValidatorOrOpts<any>,
    asyncValidator?: AsyncValidatorFn<any> | AsyncValidatorFn<any>[] | null
  ) {
    super(
      (null as unknown) as InputGroup,
      controls,
      validatorOrOpts,
      asyncValidator
    );
    this.inputs = inputs;
  }
}
