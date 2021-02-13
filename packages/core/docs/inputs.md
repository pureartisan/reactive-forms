# Input Elements

The `@reactiveforms/core` package provides four basic types of element [definitions](../src/models/inputs.ts) that you can begin with:
* [InputBase](#InputBase)
* [InputGroup](#InputGroup)
* [InputArray](#InputArray)
* [StaticElement](#StaticElement)

NOTE: We will refer to any them as an `InputElement` (a union of `InputBase | InputGroup | InputArray | StaticElement`).

The most important thing to remember is that each element type requires a `component` (React/JSX element) definition that will be used to render the element at runtime. You can find more details about it below in the [Render Component](#RenderComponent) section.

## <a name="InputBase"></a>InputBase

The `InputBase` is an abstract class that has some basic properties you would expect from a user input field. This class can be extended to define inputs such as text inputs, select dropdowns, sliders, or even more complex input elements like a whole WYSIWYG editors.

The types of input fields depend on the application and the UI library you would use, therefore this package only includes the base class and leaves it up to you to define how you want your inputs rendered.

NOTE: [`@reactiveforms/mui`](https://www.npmjs.com/package/@reactiveforms/mui) package has a pre-built set of inputs fields using the popular [Reactive Material UI](https://material-ui.com/) library.

The base class has some basic properties like `name`, `value` (the initial value), `label`, `placeholder`, `validators`, etc.

Let's look at a simple example of defining some easy inputs field and how to use them.

```
// ------------
// my-inputs.ts
// ------------

import { BaseInput } from '@reactiveforms/core';

// NOTE: the `string` defines what kind of `value` this input will handle
class TextInput extends InputBase<string> {
  private foo: Foo; // you can extend the inputs as you like

  constructor(options: Partial<TextInput>) {
    super(options);
    this.foo = options.foo;
  }
}

interface DateRangeValue {
  from: Date
  to: Date
}

class DateRangeInput extends InputBase<DateRangeValue> {
  constructor(options: Partial<TextInput>) {
    super(options);
  }
}

// ----------
// my-form.ts
// ----------

// as mentioned, we are building model driven forms.
// so you can get this model from anywhere, e.g. from the server via an API.
const myModel = getUserModel();

const firstNameField = new TextInput({
  name: 'first_name',
  label: 'First Name',
  value: data.firstName,
  placeholder: 'Please enter your first name',
  foo: someMethodToGetFoo()
});

const bookingDates = new DateRangeInput({
  name: 'booking_dates',
  label: 'Booking Dates',
  value: {
    from: myModel.start_date,
    to: myModel.end_date
  }
});

```

## <a name="InputGroup"></a>InputGroup

So far, we've looked at how to define individual input fields. Now it's time to look at how we can group them. The `InputGroup` class is *not* an abstract class, so it can be used directly. However, you're more than welcome to extend it as you see fit.

The way to look at an input group is that it holds a list of other input elements and groups them together. What's interesting is that these input elements can be any of the `InputElement` types, so this gives us the ability to have nested groups.

Let's jump into a quick example:
```
// ------------------
// my-grouped-form.ts
// ------------------

import { InputGroup } from '@reactiveforms/core';
import { TextInput } from './my-inputs.ts';

const passengerData = getPassengerData();

const passenger1 = new InputGroup({
  name: 'passenger_1',
  inputs: [
    new TextInput({
      name: 'first_name',
      value: passengerData.mainPassenger.firstName
    }),
     new TextInput({
      name: 'last_name',
      value: passengerData.mainPassenger.lastName
    })
  ]
})

const passenger2 = new InputGroup({
  name: 'passenger_2',
  inputs: [
    new TextInput({
      name: 'first_name',
      value: passengerData.otherPassenger.firstName
    }),
     new TextInput({
      name: 'last_name',
      value: passengerData.otherPassenger.lastName
    })
  ]
})

// NOTE: we are nesting groups here
const formInputs = new InputGroup({
  name: 'passengers',
  inputs: [ passenger1, passenger2 ]
});

```

## <a name="InputArray"></a>InputArray

`InputArray` elements are very similar to `InputGroup`, but the main difference is that `InputArray` corresponds to [`FromArray`](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/src/models/forms.ts) which give access to "array-like" methods (e.g. `at(index)`, etc).

`InputArray` can also be directly used, without having to extend. However, the class can be extended to suit your needs.

Most grouping can be handled using an `InputGroup`, but there are times when have a list of arbitarary groups might be useful.

Let's look at an example where we want to store a list of music albums.

```
// ----------------------
// my-music-collection.ts
// ----------------------

import { InputGroup, InputArray } from '@reactiveforms/core';
import { TextInput } from './my-inputs.ts';

const buildAlbumGroup = (album) => {
  return new InputGroup({
    name: 'album',
    inputs: [
      new TextInput({
        name: 'title',
        value: album.title
      }),
      new TextInput({
        name: 'artist',
        value: album.artistName
      })
    ]
  })
}

const myMusicCollection = getMusicCollection();

const albums = new InputArray({
  name: 'albums',
  inputs: myMusicCollection.albums.map(
    album => buildAlbumGroup(album)
  )
});

```

## <a name="StaticElement"></a>StaticElement

A `StaticElement` is special, since it's actually *not* an "input". The `StaticElement` was intrduced purely for one purpose; to allow dynamic forms to have an arbitarary component rendered within form fields.

This may seem like a bit of overkill to render a "simple component", but in fact, this is a very powerful part of the Reactive Forms. Especially since the forms are model driven.

The `StaticElement` mainly focuses on the `content` property (which is a method that returns a React/JSX element) since this defines which component is rendererd at runtime.

Let's continue with our music album:

```
// ---------------
// my-album-art.ts
// ---------------

const AlbumArt = (props) => (
  <div className="album-art">
    <img src={props.imageURL} alt={title} />
  </div>
);

// ----------------------
// my-music-collection.ts
// ----------------------

import { InputGroup, StaticElement } from '@reactiveforms/core';
import { TextInput } from './my-inputs.ts';
import { AlbumArt } from './my-album-art.ts';

// NOTE: let's extend the previous example

const buildAlbumGroup = (album) => {
  return new InputGroup({
    name: 'album',
    inputs: [
      new TextInput({
        name: 'title',
        value: album.title
      }),
      new StaticElement({
        content: () => ( // NOTE: this is a method
          <AlbumArt
            imageURL={album.image}
            title={album.title}
          />
        )
      }),
      new TextInput({
        name: 'artist',
        value: album.artistName
      })
    ]
  })
}

```

## <a name="Validators"></a>Validators

All input elements (expect `StaticElement`) supports passing validators.

```
// -------------------
// my-personal-info.ts
// -------------------

import { InputGroup, Validators } from '@reactiveforms/core';
import { TextInput } from './my-inputs.ts';

const user = new InputGroup({
  name: 'user',
  inputs: [
    new TextInput({
      name: 'first_name',
      label: 'First Name',
      validators: Validators.required <-- single validator
    }),
    new TextInput({
      name: 'email',
      label: 'Email',
      validators: [                   <-- multiple validators
        Validators.required,
        Validators.email
      ]
    }),
    new TextInput({
      name: 'age',
      label: 'Age',
      validators: Validators.min(18)  <-- dynamic validator
    })
  ]
})

```

The above are examples of simple validators that are included with this package. However, you can define custom validators to suit your project. More information can be found in the [Validation](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/validation.md) section.


## <a name="RenderComponent"></a>Render Component

All `InputElement` types support the `component` property and is one of the most important properties. This property takes in a React component (reference).

NOTE: Element references can be forwarded using `React.forwardRef`.

The component will have two main `props` passed to it:
* `input`: The input element object that we defined
* `control`: The [Form Control](https://github.com/pureartisan/reactive-forms/tree/master/packages/core/docs/form-controls.md) used by this input

```
// -----------------------
// my-input-components.tsx
// -----------------------

import { InputGroup } from '@reactiveforms/core';
import { TextInput } from './my-inputs.ts';

cosnt MyTextField = (props) => {
  const { input, control } = props;

  let classNames = '';
  if (control.invalid) {
    classNames += ' error';
  }

  const firstError = getFirstErrorMsg(control);

  const handleChange = (event) => {
      const value = event.target.value;

      // update control value
      // this will trigger any validations
      control.setValue(value);

      // check if the value is different to the
      // initial value that as loaded
      if (value === input.value) {
          // assume there are no changes to the field
          control.markAsPristine();
      } else {
          // assume we have unsaved changes
          control.markAsDirty();
      }
  }

  return (
    <div className={classNames}>
      {input.label && (
        <label>{input.label}</label>
      )}

      <input
        value={control.value}
        onChange={handleChange}
      />

      {firstError && (
        <div className="error-msg">
          {firstError}
        </div>
      )}
    </div>
  );
}

// ----------
// my-form.ts
// ----------

import { TextInput } from './my-inputs.ts';
import { MyTextField } from './my-input-components.ts';

const myModel = getMyModelFromSomeWhere();

const firstName = new TextInput({
  name: 'first_name',
  value: myModel.firstName,
  component: MyTextField
})

```

NOTE: Looking at the exmaple, you'll quickly realise that having to define the `component` for each input can add a lot of "noise" in your code. Therefore it is highly recommended to set "default values" for each input element type. See [Default Values](#DefaultValues) section below for more details.


## <a name="DefaultValues"></a>Default Values (Default Props)

All `InputElement` types have a magic methods to setup default values/props. Sticking as close as possible to `defaultProps` static property used by React, the method is called `updateDefaultProps()`.

All these methods can be accessed by your Input classes as long as they extend the `BaseInput` abstract class provided. Similarly the other `InputElement` types (`InputGroup`, `InputArray` and `StaticElement`) also have the following methods:
* [`updateDefaultProps()`](#DefaultValues-updateDefaultProps)
* [`defaultProps()`](#DefaultValues-defaultProps)
* [`resetDefaultProps()`](#DefaultValues-resetDefaultProps)

### <a name="DefaultValues-updateDefaultProps"></a>updateDefaultProps()

This method helps you set default props/values for each input type. This method can be called as many times as you want, it merges the previous values already set.

```
TextInput.updateDefaultProps({
  foo: 'foo',
  bar: 'bar'
});
TextInput.updateDefaultProps({
  baz: 'baz'
});

// NOTE: The above will set the following default props:

{
  foo: 'foo',
  bar: 'bar',
  baz: 'baz'
}

// setting the same property will however override the value
TextInput.updateDefaultProps({
  foo: 'foo',
  bar: 'bar'
});
TextInput.updateDefaultProps({
  foo: 'new foo'
});

// NOTE: The above will set the following default props:

{
  foo: 'new foo',
  bar: 'bar'
}

```

NOTE: Setting a property to `undefined` after it was previous set will have *no* effect. In order to get rid of that value, either set it to `null` or simple *clear* the whole default props and set them again.

### <a name="DefaultValues-defaultProps"></a>defaultProps()

This method can only be accessed by the extending classes since it has a `protected` access modifer.

```
class TextInput extends InputBase<string> {
  private foo: Foo; // you can extend the inputs as you like

  constructor(options: Partial<TextInput>) {
    super(options);
    const defaultProps = this.defaultProps<string>();
    this.foo = options.foo ?? defaultProps.foo;
  }
}
```

### <a name="DefaultValues-resetDefaultProps"></a>resetDefaultProps()

For those rare chances that you want to reset those default props, you can use the `resetDefaultProps()` method.

### Example

Let's go back to our TextInput we defined in the examples above:
```
// ------------
// my-inputs.ts
// ------------

import { BaseInput } from '@reactiveforms/core';

class TextInput extends InputBase<string> {
  private foo: Foo; // you can extend the inputs as you like

  constructor(options: Partial<TextInput>) {
    super(options);
    const defaultProps = this.defaultProps<string>();
    this.foo = options.foo ?? defaultProps.foo;
  }
}

// -----------------
// my-init-inputs.ts
// -----------------

// NOTE: Assuming the application run this once during starting up

TextInput.updateDefaultProps({
  component: MyTextField
});


// ----------
// my-form.ts
// ----------

const firstName = new TextInput({
  name: 'first_name'
});

// NOTE: since the default props were set, you can skip the setting of the `component` everytime now. However, you can still override that property on individual cases.

const cardHolderName = new TextInput({
  name: 'card_holder_name'
});

const cardNumber = new TextInput({
  name: 'card_number',
  component: MyFancyCreditCardNumberField
});

```
