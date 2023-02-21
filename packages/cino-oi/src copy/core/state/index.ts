/**
 * CoreState
 * 核心状态管理
 */
class CoreState extends SingletonClass {
  constructor() {
    super();
  }
  state: Record<string, any> = {};
  setState(key: string, value: any) {
    this.state[key] = value;
  }
  getState(key: string) {
    return this.state[key];
  }
}
