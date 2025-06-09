export function createSlug<T extends string | undefined>(
  text: T,
): T extends string ? string : undefined {
  if (typeof text === 'string') {
    return text
      .replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, '-')
      .toLocaleLowerCase() as any;
  }

  return undefined as any;
}
