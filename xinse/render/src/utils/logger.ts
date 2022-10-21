const PREFIX = '[XINSE]';

export function XError(error: any) {
  return new Error(`${PREFIX}${error.toString()}`);
}

export function XWarn(message: any) {
  console.warn(`${PREFIX}${message}`);
}
