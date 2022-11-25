import {InputBase} from "../models/inputs";

export const fieldCssCls = <T = any>(input?: InputBase<T>|null, type?: string) =>
        `rf-field ${type ? 'rf-field-'+type : ''} ${input?.name ? 'rf-field-name-'+input?.name : ''}`;
