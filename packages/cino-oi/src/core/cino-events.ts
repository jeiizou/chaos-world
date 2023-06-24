/**
 * eventBus
 */
export class CinoEventBus<T extends string | number, U extends Record<T, any>> {
  // 存储自定义事件
  private _events: {
    [keyName: string]: Function[] | null;
  };
  constructor() {
    this._events = {};
  }

  /**
   * 注册事件和对应的处理函数
   * @param event 事件
   * @param fn 处理函数
   */
  on<K extends T>(event: K, fn: U[K]) {
    if (Array.isArray(event)) {
      for (let i = 0; i < event.length; i++) {
        this.on(event[i], fn);
      }
    } else {
      // 存在直接push, 不存在则创建为空数组, 然后再push
      this._events[event] || (this._events[event] = [] as Function[]).push(fn);
    }
  }

  off<K extends T>(event?: T, fn?: U[K]) {
    // 什么参数都不传, 表示清理所有事件
    if (!arguments.length) {
      this._events = {};
    }

    // 数组循环清空
    if (Array.isArray(event)) {
      for (let i = 0; i < event.length; i++) {
        this.off(event[i], fn);
      }
      return;
    } else if (typeof event === 'string') {
      const cbs = this._events[event];
      if (!cbs) {
        return;
      }

      // 不传第二个参数表示清空某个事件的所有监听函数
      if (arguments.length == 1) {
        this._events[event] = null;
      }
      let i = cbs.length;
      while (i--) {
        // type callFunction = Function | {fn:Function}
        let cb: any = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break;
        }
      }
    }
  }

  /**
   * 注册事件和处理函数, 触发一次后销毁
   * @param event
   * @param fn
   */
  once(event: T, fn: U[T]) {
    let _self = this;
    const handler = function (...params: Parameters<U[T]>) {
      _self.off(event, handler);
      // emit 里面调用时会给on方法传递参数
      fn.apply(null, params);
    } as U[T];
    handler.fn = fn;
    this.on(event, handler);
  }

  /**
   * 触发某事件所有回调并带参数
   * @param event
   * @returns
   */
  emit(event: T, ...params: Parameters<U[T]>) {
    if (!this._events[event]) {
      return;
    } else {
      let cbs = [...(this._events[event] as Function[])];
      if (cbs) {
        for (let i = 0; i < cbs.length; i++) {
          try {
            cbs[i].apply(null, [...params]);
          } catch (e) {
            new Error(`EventBus: Event handler for "${event}"\n${e}`);
          }
        }
      }
    }
  }
}
