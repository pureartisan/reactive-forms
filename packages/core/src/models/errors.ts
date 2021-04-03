export type Errors = {
    [key: string]: any;
};

export type ErrorTranslator<T> = (
    key: string,
    meta?: T
) => string | undefined;

export interface ErrorTranslators {
    [key: string]: ErrorTranslator<any>;
}
