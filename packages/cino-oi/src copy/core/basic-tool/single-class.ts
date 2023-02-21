// Singleton Class
class SingletonClass {
  // 静态单例变量
  private static instance: SingletonClass | null = null;
  static getInstance(params?: any): SingletonClass {
    if (!this.instance) {
      this.instance = new SingletonClass(params);
    }
    return this.instance;
  }

  constructor(params?: any) {}
}
