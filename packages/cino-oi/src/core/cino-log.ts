export class CinoLog {
  static logPrefix = 'CINO: ';

  static handleMessage(msg: string): string {
    return `${this.logPrefix} ${msg}`;
  }
  static warn(msg: string): void {
    console.warn(this.handleMessage(msg));
  }
}
