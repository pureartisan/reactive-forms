// import React, { forwardRef } from 'react';

// import { BaseInputComponentProps } from '@reactiveforms/core';

// import { TextInputBase } from '../models/input-base';

// import { PrimeTextField } from './helpers/PrimeTextField';

// export class TextAreaInput extends TextInputBase<string> {
//     rows?: number | string
//     rowsMax?: number | string

//     constructor(options: Partial<TextAreaInput>) {
//         super(options);
//         const defaultProps = this.defaultProps<TextAreaInput>();
//         this.rows = options.rows ?? defaultProps.rows;
//         this.rowsMax = options.rowsMax ?? defaultProps.rowsMax;
//     }
// }

// export const TextAreaField = forwardRef((props: BaseInputComponentProps<string, TextAreaInput>, ref: any) => {
//     return (
//         <PrimeTextField
//             {...props}
//             ref={ref}
//             type="textarea"
//             multiline={true}
//         />
//     );
// });

// TextAreaField.displayName = 'TextAreaField';