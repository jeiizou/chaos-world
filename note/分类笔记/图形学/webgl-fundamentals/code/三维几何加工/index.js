'use strict';

const svg = 'm44,434c18,-33 19,-66 15,-111c-4,-45 -37,-104 -39,-132c-2,-28 11,-51 16,-81c5,-30 3,-63 -36,-63';

// ---- 辅助的工具和方法 ----

// ___
// 44, 371,   |
// 62, 338,   | 第一个曲线
// 63, 305,___|__
// 59, 260,___|  |
// 55, 215,      | 第二个曲线
// 22, 156,______|__
// 20, 128,______|  |
// 18, 100,         | 第三个曲线
// 31,  77,_________|__
// 36,  47,_________|  |
// 41,  17,            | 第四个曲线
// 39, -16,            |
//  0, -16,____________|
// 从给定的SVG路径中解析出对应的点, 假定给定我们的是一条连续的线
function parseSVGPath(svg) {
  const points = [];
  let delta = false;
  let keepNext = false;
  let need = 0;
  let value = '';
  let values = [];
  let lastValues = [0, 0];
  let nextLastValues = [0, 0];

  function addValue() {
    if (value.length > 0) {
      values.push(parseFloat(value));
      if (values.length === 2) {
        if (delta) {
          values[0] += lastValues[0];
          values[1] += lastValues[1];
        }
        points.push(values);
        if (keepNext) {
          nextLastValues = values.slice();
        }
        --need;
        if (!need) {
          lastValues = nextLastValues;
        }
        values = [];
      }
      value = '';
    }
  }

  svg.split('').forEach((c) => {
    if ((c >= '0' && c <= '9') || 'c' === '.') {
      value += c;
    } else if (c === '-') {
      addValue();
      value = '-';
    } else if (c === 'm') {
      addValue();
      keepNext = true;
      need = 1;
      delta = true;
    } else if (c === 'c') {
      addValue();
      keepNext = true;
      need = 3;
      delta = true;
    } else if (c === 'M') {
      addValue();
      keepNext = true;
      need = 1;
      delta = false;
    } else if (c === 'C') {
      addValue();
      keepNext = true;
      need = 3;
      delta = false;
    } else if (c === ',') {
      addValue();
    } else if (c === ' ') {
      addValue();
    }
  });
  addValue();
  let min = points[0].slice();
  let max = points[0].slice();
  for (let i = 1; i < points.length; ++i) {
    min = v2.min(min, points[i]);
    max = v2.max(max, points[i]);
  }
  let range = v2.sub(max, min);
  let halfRange = v2.mult(range, 0.5);
  for (let i = 0; i < points.length; ++i) {
    const p = points[i];
    p[0] = p[0] - min[0];
    p[1] = p[1] - min[0] - halfRange[1];
  }
  return points;
}

// 检查一个数字是否是2的幂
function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

// 创建一个纹理, 传入图片参数, 当纹理创建完成会调用callback回调
// 初始时会使用1X1的蓝色像素填充纹理, 直到图片加载完成
function loadImageAndCreateTextureInfo(gl, url, callback) {
  // 创建纹理
  var tex = gl.createTexture();
  // 绑定纹理
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // 从1x1的蓝色像素填充纹理空间
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255]),
  );

  var textureInfo = {
    width: 1, // 直到图片数据加载完成之前, 是不知道具体的纹理尺寸的
    height: 1,
    texture: tex,
  };
  var img = new Image();
  img.addEventListener('load', function () {
    // 设置纹理的尺寸
    textureInfo.width = img.width;
    textureInfo.height = img.height;

    // 绑定纹理
    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    // 检查图像在两个维度上是否都是2的幂
    if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
      // 是2的幂, 直接生成矩阵纹理
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // 不是2的幂, 则需要转换纹理
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    if (callback) {
      callback();
    }
  });
  img.src = url;

  return textureInfo;
}

// 判断给定的点是否足够平滑
function flatness(points, offset) {
  const p1 = points[offset + 0];
  const p2 = points[offset + 1];
  const p3 = points[offset + 2];
  const p4 = points[offset + 3];

  let ux = 3 * p2[0] - 2 * p1[0] - p4[0];
  ux *= ux;
  let uy = 3 * p2[1] - 2 * p1[1] - p4[1];
  uy *= uy;
  let vx = 3 * p3[0] - 2 * p4[0] - p1[0];
  vx *= vx;
  let vy = 3 * p3[1] - 2 * p4[1] - p1[1];
  vy *= vy;

  if (ux < vx) {
    ux = vx;
  }

  if (uy < vy) {
    uy = vy;
  }

  return ux + uy;
}

// 从贝塞尔曲线上获取点坐标
// 这个算法在获取曲线的点的过程中可以确保点的数量比较长租, 但是不能很好的排除不必要的点.
function getPointsOnBezierCurveWithSplitting(points, offset, tolerance, newPoints) {
  const outPoints = newPoints || [];
  if (flatness(points, offset) < tolerance) {
    // 如果不锐利, 就把它加入到点的队列中
    outPoints.push(points[offset + 0]);
    outPoints.push(points[offset + 3]);
  } else {
    // 拆分
    const t = 0.5;
    const p1 = points[offset + 0];
    const p2 = points[offset + 1];
    const p3 = points[offset + 2];
    const p4 = points[offset + 3];

    const q1 = v2.lerp(p1, p2, t);
    const q2 = v2.lerp(p2, p3, t);
    const q3 = v2.lerp(p3, p4, t);

    const r1 = v2.lerp(q1, q2, t);
    const r2 = v2.lerp(q2, q3, t);

    const red = v2.lerp(r1, r2, t);

    // 求前半段的点
    getPointsOnBezierCurveWithSplitting([p1, q1, r1, red], 0, tolerance, outPoints);
    // 求后半段的点
    getPointsOnBezierCurveWithSplitting([red, r2, q3, p4], 0, tolerance, outPoints);
  }
  return outPoints;
}

// 获取所有线段上的点
// 之前我们知道有四段曲线
function getPointsOnBezierCurves(points, tolerance) {
  const newPoints = [];
  const numSegments = (points.length - 1) / 3;
  for (let i = 0; i < numSegments; ++i) {
    // 每次都偏移3个位置
    const offset = i * 3;
    // 每次返回的点都会推入到newPoints中
    getPointsOnBezierCurveWithSplitting(points, offset, tolerance, newPoints);
  }
  return newPoints;
}

// Ramer Douglas Peucker algorithm
// 简化曲线上不必要的点
function simplifyPoints(points, start, end, epsilon, newPoints) {
  const outPoints = newPoints || [];

  // 找到离最后两点距离最远的点
  const s = points[start];
  const e = points[end - 1];
  let maxDistSq = 0;
  let maxNdx = 1;
  for (let i = start + 1; i < end - 1; ++i) {
    const distSq = v2.distanceToSegmentSq(points[i], s, e);
    if (distSq > maxDistSq) {
      maxDistSq = distSq;
      maxNdx = i;
    }
  }

  // 如果具体太远
  if (Math.sqrt(maxDistSq) > epsilon) {
    // 拆分
    simplifyPoints(points, start, maxNdx + 1, epsilon, outPoints);
    simplifyPoints(points, maxNdx, end, epsilon, outPoints);
  } else {
    // 添加最后两个点
    outPoints.push(s, e);
  }

  return outPoints;
}

//  ---- 主流程 ----

function main() {
  // 解析出12个坐标带你
  const curvePoints = parseSVGPath(svg);

  // 初始化上下文
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    return;
  }

  const data = {
    tolerance: 0.15, // 表示容忍度, 越低, 则曲线越平滑
    distance: 0.4,
    divisions: 16,
    startAngle: 0,
    endAngle: Math.PI * 2,
    capStart: true,
    capEnd: true,
    triangles: true, // 控制是否显示纹理
  };

  // 生成网格
  function generateMesh(bufferInfo) {
    // 根据给定的svg上的点的坐标, 和容忍度的值生成点坐标
    const tempPoints = getPointsOnBezierCurves(curvePoints, data.tolerance);
    // 简化这些点中不必要的点
    const points = simplifyPoints(
      tempPoints,
      0,
      tempPoints.length,
      data.distance, // 控制点之间的距离, 这个值越小, 点就越多, 曲线就岳平滑.
    );
    const arrays = lathePoints(
      points,
      data.startAngle,
      data.endAngle,
      data.divisions,
      data.capStart,
      data.capEnd,
    );
    const extents = getExtents(arrays.position);
    if (!bufferInfo) {
      // calls gl.createBuffer, gl.bindBuffer, and gl.bufferData for each array
      bufferInfo = webglUtils.createBufferInfoFromArrays(gl, arrays);
    } else {
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.a_position.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays.position), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.a_texcoord.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays.texcoord), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrays.indices), gl.STATIC_DRAW);
      bufferInfo.numElements = arrays.indices.length;
    }
    return {
      bufferInfo: bufferInfo,
      extents: extents,
    };
  }

  // 设置program
  // compiles shaders, links program and looks up locations
  const programInfo = webglUtils.createProgramInfo(gl, ['vertex-shader-3d', 'fragment-shader-3d']);

  // 创建纹理
  const texInfo = loadImageAndCreateTextureInfo(gl, '../assets/uv-grid.png', render);

  // 世界坐标矩阵
  let worldMatrix = m4.identity();
  let projectionMatrix;
  let extents;
  let bufferInfo;

  function update() {
    // 根据缓冲数据生成网格
    // 第一次进来, buffer是空的
    const info = generateMesh(bufferInfo);
    extents = info.extents;
    bufferInfo = info.bufferInfo;
    // 渲染当前的帧
    render();
  }

  update();

  function render() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas, window.devicePixelRatio);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);

    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute the projection matrix
    const fieldOfViewRadians = Math.PI * 0.25;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    const midY = lerp(extents.min[1], extents.max[1], 0.5);
    const sizeToFitOnScreen = (extents.max[1] - extents.min[1]) * 0.6;
    const distance = sizeToFitOnScreen / Math.tan(fieldOfViewRadians * 0.5);
    const cameraPosition = [0, midY, distance];
    const target = [0, midY, 0];
    const up = [0, -1, 0]; // we used 2d points as input which means orientation is flipped
    const cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    const viewMatrix = m4.inverse(cameraMatrix);

    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    gl.useProgram(programInfo.program);

    // Setup all the needed attributes.
    // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer for each attribute
    webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);

    // Set the uniforms
    // calls gl.uniformXXX, gl.activeTexture, gl.bindTexture
    webglUtils.setUniforms(programInfo, {
      u_matrix: m4.multiply(viewProjectionMatrix, worldMatrix),
      u_texture: texInfo.texture,
    });

    // calls gl.drawArrays or gl.drawElements.
    webglUtils.drawBufferInfo(gl, bufferInfo, data.triangles ? gl.TRIANGLE : gl.LINES);
  }

  function getExtents(positions) {
    const min = positions.slice(0, 3);
    const max = positions.slice(0, 3);
    for (let i = 3; i < positions.length; i += 3) {
      min[0] = Math.min(positions[i + 0], min[0]);
      min[1] = Math.min(positions[i + 1], min[1]);
      min[2] = Math.min(positions[i + 2], min[2]);
      max[0] = Math.max(positions[i + 0], max[0]);
      max[1] = Math.max(positions[i + 1], max[1]);
      max[2] = Math.max(positions[i + 2], max[2]);
    }
    return {
      min: min,
      max: max,
    };
  }

  // 现在我们有了曲线上的点, 只要让他们绕Y轴旋转就可以了.
  function lathePoints(
    points,
    startAngle, // 起始角 (例如 0)
    endAngle, // 终止角 (例如 Math.PI * 2)
    numDivisions, // 这中间生成多少块
    capStart, // true 就封闭起点
    capEnd, // true 就封闭重点
  ) {
    const positions = [];
    const texcoords = [];
    const indices = [];

    const vOffset = capStart ? 1 : 0;
    const pointsPerColumn = points.length + vOffset + (capEnd ? 1 : 0);
    const quadsDown = pointsPerColumn - 1;

    // 生成 v 值
    let vcoords = [];

    // 先计算出每一点对应的长度
    let length = 0;
    for (let i = 0; i < points.length - 1; ++i) {
      vcoords.push(length);
      length += v2.distance(points[i], points[i + 1]);
    }
    vcoords.push(length); // 最后一个点

    // 除以总长
    vcoords = vcoords.map((v) => v / length);

    // 开始生成点
    for (let division = 0; division <= numDivisions; ++division) {
      const u = division / numDivisions;
      const angle = lerp(startAngle, endAngle, u);
      const mat = m4.yRotation(angle);
      if (capStart) {
        // 在开始处添加一个 Y 轴上的点
        positions.push(0, points[0][1], 0);
        texcoords.push(u, 0);
      }
      points.forEach((p, ndx) => {
        const tp = m4.transformPoint(mat, [...p, 0]);
        positions.push(tp[0], tp[1], tp[2]);
        texcoords.push(u, vcoords[ndx]);
      });
      if (capEnd) {
        // 在终点处添加一个 Y 轴上的点
        positions.push(0, points[points.length - 1][1], 0);
        texcoords.push(u, 1);
      }
    }

    // 创建索引
    for (let division = 0; division < numDivisions; ++division) {
      const column1Offset = division * pointsPerColumn;
      const column2Offset = column1Offset + pointsPerColumn;
      for (let quad = 0; quad < quadsDown; ++quad) {
        indices.push(column1Offset + quad, column1Offset + quad + 1, column2Offset + quad);
        indices.push(column1Offset + quad + 1, column2Offset + quad + 1, column2Offset + quad);
      }
    }

    return {
      position: positions,
      texcoord: texcoords,
      indices: indices,
    };
  }

  /* eslint brace-style: 0 */
  gl.canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startRotateCamera(e);
  });
  window.addEventListener('mouseup', stopRotateCamera);
  window.addEventListener('mousemove', rotateCamera);
  gl.canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startRotateCamera(e.touches[0]);
  });
  window.addEventListener('touchend', (e) => {
    stopRotateCamera(e.touches[0]);
  });
  window.addEventListener('touchmove', (e) => {
    rotateCamera(e.touches[0]);
  });

  let lastPos;
  let moving;
  function startRotateCamera(e) {
    lastPos = getRelativeMousePosition(gl.canvas, e);
    moving = true;
  }

  function rotateCamera(e) {
    if (moving) {
      const pos = getRelativeMousePosition(gl.canvas, e);
      const size = [4 / gl.canvas.width, 4 / gl.canvas.height];
      const delta = v2.mult(v2.sub(lastPos, pos), size);

      // this is bad but it works for a basic case so phffttt
      worldMatrix = m4.multiply(m4.xRotation(delta[1] * 5), worldMatrix);
      worldMatrix = m4.multiply(m4.yRotation(delta[0] * 5), worldMatrix);

      lastPos = pos;

      render();
    }
  }

  function stopRotateCamera(e) {
    moving = false;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function getRelativeMousePosition(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
    const y = ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;
    return [
      (x - canvas.width / 2) / window.devicePixelRatio,
      (y - canvas.height / 2) / window.devicePixelRatio,
    ];
  }
}

const v2 = (function () {
  // adds 1 or more v2s
  function add(a, ...args) {
    const n = a.slice();
    [...args].forEach((p) => {
      n[0] += p[0];
      n[1] += p[1];
    });
    return n;
  }

  function sub(a, ...args) {
    const n = a.slice();
    [...args].forEach((p) => {
      n[0] -= p[0];
      n[1] -= p[1];
    });
    return n;
  }

  function mult(a, s) {
    if (Array.isArray(s)) {
      let t = s;
      s = a;
      a = t;
    }
    if (Array.isArray(s)) {
      return [a[0] * s[0], a[1] * s[1]];
    } else {
      return [a[0] * s, a[1] * s];
    }
  }

  function lerp(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  }

  function min(a, b) {
    return [Math.min(a[0], b[0]), Math.min(a[1], b[1])];
  }

  function max(a, b) {
    return [Math.max(a[0], b[0]), Math.max(a[1], b[1])];
  }

  // compute the distance squared between a and b
  function distanceSq(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return dx * dx + dy * dy;
  }

  // compute the distance between a and b
  function distance(a, b) {
    return Math.sqrt(distanceSq(a, b));
  }

  // compute the distance squared from p to the line segment
  // formed by v and w
  function distanceToSegmentSq(p, v, w) {
    const l2 = distanceSq(v, w);
    if (l2 === 0) {
      return distanceSq(p, v);
    }
    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return distanceSq(p, lerp(v, w, t));
  }

  // compute the distance from p to the line segment
  // formed by v and w
  function distanceToSegment(p, v, w) {
    return Math.sqrt(distanceToSegmentSq(p, v, w));
  }

  return {
    add: add,
    sub: sub,
    max: max,
    min: min,
    mult: mult,
    lerp: lerp,
    distance: distance,
    distanceSq: distanceSq,
    distanceToSegment: distanceToSegment,
    distanceToSegmentSq: distanceToSegmentSq,
  };
})();

main();
