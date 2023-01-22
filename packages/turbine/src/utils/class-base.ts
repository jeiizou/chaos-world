export interface SingleBaseConfig {
  [key: string]: any;
}

export class SingleBase {
  static instance: SingleBase;
  static create(config: SingleBaseConfig) {
    if (!this.instance) {
      this.instance = new SingleBase(config);
    }
    return this.instance;
  }

  constructor(_config: SingleBaseConfig) {}
}
