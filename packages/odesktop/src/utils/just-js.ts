export function styleMap(obj: Record<string, boolean>) {
  return Object.keys(obj).reduce((str, i) => (obj[i] ? str + ' ' + i : str), '');
}
