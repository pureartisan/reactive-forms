export const isEvent = (obj: unknown): boolean => {
  return Boolean(
    obj && (obj as any).stopPropagation && (obj as any).preventDefault
  );
};
