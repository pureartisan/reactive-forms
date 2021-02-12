export type Observer<T = any> = (obj?: T) => void;

export class Subscription<T = any> {
  private observer: Observer<T>;
  private observable: Observable<T>;

  constructor(observer: Observer<T>, observable: Observable<T>) {
    this.observer = observer;
    this.observable = observable;
  }

  unsubscribe(): void {
    this.observable.unsubscribe(this.observer);
  }
}

export class Observable<T = any> {
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): Subscription<T> {
    this.observers.push(observer);
    return new Subscription(observer, this);
  }

  unsubscribe(observer?: Observer<T>): void {
    if (observer) {
      this.observers = this.observers.filter((obs) => obs !== observer);
    } else {
      this.observers = [];
    }
  }

  next(obj?: T, thisObj?: unknown): void {
    const scope = thisObj || window;
    this.observers.forEach((obs) => {
      obs.call(scope, obj);
    });
  }

  static fromPromise<T>(
    promise: Promise<T>,
    callback?: (value: any) => T
  ): Observable<T> {
    const observable = new Observable<T>();

    promise
      .then(
        (value) => {
          const mappedValue = (value: T) =>
            callback ? callback(value) : value;
          observable.next(mappedValue(value));
        },
        (error) => {
          observable.next(error);
        }
      )
      .then(null, (error) => {
        throw error;
      });

    return observable;
  }

  static toObservable<T>(obj: Observable<T> | Promise<T>): Observable<T> {
    return obj && obj instanceof Promise ? this.fromPromise(obj) : obj;
  }

  static isObservable(obj: unknown): boolean {
    return Boolean(obj && obj instanceof Observable);
  }
}
