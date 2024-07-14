export function generateId(): string {
  return (Math.floor(Math.random() * 10 ** 13) + Date.now())
    .toString(36)
    .substring(2);
}

export function pick<T extends object, P extends keyof T>(
  obj: T,
  properties: P | P[]
): Pick<T, P> {
  const propertyNames = !Array.isArray(properties) ? [properties] : properties;

  return propertyNames.reduce<Pick<T, P>>(
    (res, key) => {
      if (key in obj) {
        res[key] = obj[key];
      }
      return res;
    },
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter -- required for type safety
    {} as Pick<T, P>
  );
}

export function pickResult<T extends object, P extends keyof T>(
  obj: T,
  properties: P | P[]
): [Pick<T, P>, Omit<T, P>] {
  const propertyNames = !Array.isArray(properties) ? [properties] : properties;

  const picked = {} as Pick<T, P>;
  const remain = { ...obj } as Omit<T, P>;

  propertyNames.forEach(prop => {
    if (prop in obj) {
      picked[prop] = obj[prop];
      // @ts-expect-error -- intended behavior
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- intended behavior
      delete remain[prop];
    }
  });

  return [picked, remain];
}
