import { BaseInputComponentProps } from "../models/inputs";

export const getFirstErrors = <T>(
  props: BaseInputComponentProps<T>
): string | undefined => {
  return props?.control?.errors
    ? Object.keys(props?.control?.errors)[0]
    : undefined;
};
