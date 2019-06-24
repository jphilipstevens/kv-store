export const isNil = (x?: any): boolean => x == null;
export const isDefined = <T>(x?: T): x is T => isNil(x) === false;
