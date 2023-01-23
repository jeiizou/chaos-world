interface GeometryConfig {
  /**
   * 坐标位置
   */
  position: [number, number, number];
  /**
   * 位置矩阵
   */
  matrix: Array<number>;
  /**
   * 纹理设置
   */
  texture: {
    img: {
      // TODO: 枚举
      type: string;
    };
  };

  // 自定义着色器
  fs: string;
  // 自定义订单着色
  vs: string;
}

export class Geometry {
  constructor(config: GeometryConfig) {}
}
