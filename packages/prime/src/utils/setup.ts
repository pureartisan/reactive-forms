
import { InputGroup, StaticElement } from '@reactiveforms/core';

import { FormGroup } from '../components/FormGroup';
import { EmailInput, EmailField } from '../components/EmailField';
import { TextAreaInput, TextAreaField } from '../components/TextAreaField';
import { CurrencyInput, CurrencyField } from '../components/CurrencyField';
import { TextInput, TextField } from '../components/TextField';
import { PasswordInput, PasswordField } from '../components/PasswordField';
import { CheckboxInput, CheckboxField } from '../components/CheckboxField';
import { SwitchInput, SwitchField } from '../components/SwitchField';
import { SelectInput, SelectField } from '../components/SelectField';
import { DateInput, DateField } from '../components/DateField';
import {ImageField, ImageInput} from "../components/ImageField";
import { StaticComponent } from '../components/StaticComponent';

export const setDefaults = (): void => {

    InputGroup.updateDefaultProps({ component: FormGroup });
    StaticElement.updateDefaultProps({ component: StaticComponent });

    EmailInput.updateDefaultProps({ component: EmailField });
    CurrencyInput.updateDefaultProps({ component: CurrencyField });
    TextInput.updateDefaultProps({ component: TextField });
    TextAreaInput.updateDefaultProps({ component: TextAreaField });
    PasswordInput.updateDefaultProps({ component: PasswordField });

    ImageInput.updateDefaultProps({
        component: ImageField,
        resetLabel: 'Reset',
        altLabel: 'Preview',
        selectLabel: 'Select Image'
    });

    SelectInput.updateDefaultProps({ component: SelectField });

    DateInput.updateDefaultProps({ component: DateField });

    CheckboxInput.updateDefaultProps({ component: CheckboxField });
    SwitchInput.updateDefaultProps({ component: SwitchField });

};
