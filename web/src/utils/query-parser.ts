export const parseEnum = <T extends readonly string[]>(
  value: string | null,
  allowed: T
): T[number] | undefined => {
  if (!value) return undefined;
  return allowed.includes(value as T[number])
    ? (value as T[number])
    : undefined;
};
