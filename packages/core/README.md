# Reactive Forms - Core

Reactive Forms for React, insprired by [Angular Reactive Forms](https://angular.io/guide/reactive-forms).

This library replicates the basic implemenation of Anuglar Reactive Forms, but at the same time streamlines building model driven forms.

It is expected that `@reactiveforms/core` package is used along with a "UI implemenation" to build forms easily using objects.

## Recommendations

`@reactiveforms` includes an implemenation of the Material UI form elements [`@reactiveforms/mui`](https://www.npmjs.com/package/@reactiveforms/mui), using the popular [Reactive Material UI](https://material-ui.com/) library.

## Installation

```
npm install @reactiveforms/core
```

## Dependencies

This package requires the importing project to install `react` and `react-dom`; they are defined as "peer dependencies". React 16.8+ is supported; this package uses "react hooks" under the hood.

The package source is written in [TypeScript](https://www.typescriptlang.org/), and all type definitions are included when installing the package. However, it's not required that your needs to use TypeScript, you can use ES5/ES6 along with this package if you wish.

## Documentation

The documentation covers the following areas:
* [Inputs](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/inputs.md)
* [Form Controls](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/form-controls.md)
* [Validation](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/validation.md)
