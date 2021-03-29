// import React, { forwardRef } from 'react';
// import mobile from 'is-mobile';
// import { MenuItem } from '@material-ui/core';

// import { BaseInputComponentProps } from '@reactiveforms/core';

// import { SelectInputBase } from '../models/input-base';

// import { MuiSelectField } from './helpers/MuiSelectField';

// const isMobile = mobile();

// const Option = (props: any) => {
//     if (isMobile) {
//         return <option {...props} />
//     }
//     return <MenuItem {...props} />
// }

// export class SelectInput<O, T = O | O[]> extends SelectInputBase<O, T> {
//     allowEmpty?: boolean;
//     emptyLabel?: string;

//     constructor(options: Partial<SelectInput<O, T>>) {
//         super(options);
//         const defaultProps = this.defaultProps<SelectInput<O, T>>();
//         this.emptyLabel = options.emptyLabel ?? defaultProps.emptyLabel;
//         this.allowEmpty = options.allowEmpty ?? defaultProps.allowEmpty;
//     }
// }

// export const SelectField = forwardRef(<T,>(props: BaseInputComponentProps<T, SelectInput<T, T>>, ref: any) => {
//     return (
//         <MuiSelectField
//             {...props}
//             native={isMobile}
//             ref={ref}
//         >
//             {props.input?.allowEmpty && (
//                 <Option aria-label="None" value="">
//                     {props.input.emptyLabel || null}
//                 </Option>
//             )}
//             {props.input?.options?.map(opt => {
//                 const val = `${opt.value}`;
//                 return (
//                     <Option key={val} value={val}>
//                         {opt.label}
//                     </Option>
//                 );
//             })}
//         </MuiSelectField>
//     );
// });

// SelectField.displayName = 'SelectField';