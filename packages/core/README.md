# Reactive Forms - Core

![npm](https://img.shields.io/npm/v/@reactiveforms/core) ![license](https://img.shields.io/badge/License-MIT-blue)

Reactive Forms for [React](https://reactjs.org/).

This library, insprired by [Angular Reactive Forms](https://angular.io/guide/reactive-forms), replicates the basic implemenation of Anuglar Reactive Forms, but at the same time streamlines building model driven forms.

It is expected that `@reactiveforms/core` package is used along with a "UI implemenation" (pre-built or custom) to build forms easily using models.

## Recommendations

`@reactiveforms` includes an implemenation of the Material UI form elements [`@reactiveforms/mui`](https://www.npmjs.com/package/@reactiveforms/mui), using the popular [Reactive Material UI](https://material-ui.com/) library. However, you can use your own custom implementations too.

## Installation

```
npm install @reactiveforms/core
```

## Dependencies

This package requires your application to install `react` and `react-dom`; they are defined as "peer dependencies". React 16.8+ is supported; this package uses "react hooks" under the hood.

The package source is written in [TypeScript](https://www.typescriptlang.org/), and all type definitions are included when installing the package. However, it is not required that you need to use TypeScript, you can use ES5/ES6 along with this package if you wish.

## Usage

The examples use the material implementation to make things easier, but as mentioned above, you can use your own implementation of the input elements.

* [Simple Form](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/examples/simple-form.md)
* [Split Form](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/examples/split-form.md)
* [Static Elements](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/examples/static-elements.md)
* [Validation](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/examples/validation.md)

## Documentation

The documentation covers the following areas:
* [Inputs](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/inputs.md)
* [Form Controls](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/form-controls.md)
* [Validation](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/validation.md)
* [Form Builder](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/form-builder.md)
