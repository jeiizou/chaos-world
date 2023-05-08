export interface CinoAppInfo {
  /**
   * 应用名称
   */
  name: string;
  /**
   * 应用ID, 唯一值, 可选
   */
  id?: string;
  /**
   * 渲染类型
   */
  renderType?: 'iframe' | 'html' | 'react' | 'micro-app';
  /**
   * 资源地址
   */
  source: string;
}
