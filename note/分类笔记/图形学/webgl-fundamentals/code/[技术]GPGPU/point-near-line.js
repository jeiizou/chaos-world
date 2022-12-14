'use strict';

/* eslint no-alert: 0 */

function main() {
  const closestLineVS = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
  `;

  function closestLineFS(numLineSegments) {
    return `
precision highp float;

uniform sampler2D pointsTex;
uniform vec2 pointsTexDimensions;
uniform sampler2D linesTex;
uniform vec2 linesTexDimensions;

vec4 getAs1D(sampler2D tex, vec2 dimensions, float index) {
  float y = floor(index / dimensions.x);
  float x = mod(index, dimensions.x);
  vec2 texcoord = (vec2(x, y) + 0.5) / dimensions;
  return texture2D(tex, texcoord);
}

// from https://stackoverflow.com/a/6853926/128511
// a is the point, b,c is the line segment
float distanceFromPointToLine(in vec3 a, in vec3 b, in vec3 c) {
  vec3 ba = a - b;
  vec3 bc = c - b;
  float d = dot(ba, bc);
  float len = length(bc);
  float param = 0.0;
  if (len != 0.0) {
    param = clamp(d / (len * len), 0.0, 1.0);
  }
  vec3 r = b + bc * param;
  return distance(a, r);
}

void main() {
  // gl_FragCoord is the coordinate of the pixel that is being set by the fragment shader.
  // It is the center of the pixel so the bottom left corner pixel will be (0.5, 0.5).
  // the pixel to the left of that is (1.5, 0.5), The pixel above that is (0.5, 1.5), etc...
  // so we can compute back into a linear index 
  float ndx = floor(gl_FragCoord.y) * pointsTexDimensions.x + floor(gl_FragCoord.x); 
  
  // find the closest line segment
  float minDist = 10000000.0; 
  float minIndex = -1.0;
  vec3 point = getAs1D(pointsTex, pointsTexDimensions, ndx).xyz;
  for (int i = 0; i < ${numLineSegments}; ++i) {
    vec3 lineStart = getAs1D(linesTex, linesTexDimensions, float(i * 2)).xyz;
    vec3 lineEnd = getAs1D(linesTex, linesTexDimensions, float(i * 2 + 1)).xyz;
    float dist = distanceFromPointToLine(point, lineStart, lineEnd);
    if (dist < minDist) {
      minDist = dist;
      minIndex = float(i);
    }
  }
  
  // convert to 8bit color. The canvas defaults to RGBA 8bits per channel
  // so take our integer index (minIndex) and convert to float values that
  // will end up as the same 32bit index when read via readPixels as
  // 32bit values.
  gl_FragColor = vec4(
    mod(minIndex, 256.0),
    mod(floor(minIndex / 256.0), 256.0),
    mod(floor(minIndex / (256.0 * 256.0)), 256.0) ,
    floor(minIndex / (256.0 * 256.0 * 256.0))) / 255.0;
}
`;
  }

  const drawLinesVS = `
  attribute float a_id;
  uniform sampler2D linesTex;
  uniform vec2 linesTexDimensions;
  uniform mat4 matrix;

  vec4 getAs1D(sampler2D tex, vec2 dimensions, float index) {
    float y = floor(index / dimensions.x);
    float x = mod(index, dimensions.x);
    vec2 texcoord = (vec2(x, y) + 0.5) / dimensions;
    return texture2D(tex, texcoord);
  }

  void main() {
    // pull the position from the texture
    vec4 position = getAs1D(linesTex, linesTexDimensions, a_id);

    // do the common matrix math
    gl_Position = matrix * vec4(position.xy, 0, 1);
  }
  `;

  const drawLinesFS = `
  precision highp float;
  void main() {
    gl_FragColor = vec4(vec3(0.8), 1);
  }
  `;

  const drawPointsVS = `
  attribute float a_id;
  uniform float numPoints;
  uniform sampler2D pointsTex;
  uniform vec2 pointsTexDimensions;
  uniform mat4 matrix;

  varying vec4 v_color;

  vec4 getAs1D(sampler2D tex, vec2 dimensions, float index) {
    float y = floor(index / dimensions.x);
    float x = mod(index, dimensions.x);
    vec2 texcoord = (vec2(x, y) + 0.5) / dimensions;
    return texture2D(tex, texcoord);
  }

  vec3 hsv2rgb(vec3 c) {
    c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    // pull the position from the texture
    vec4 position = getAs1D(pointsTex, pointsTexDimensions, a_id);

    // do the common matrix math
    gl_Position = matrix * vec4(position.xy, 0, 1);
    gl_PointSize = 5.0;

    float hue = a_id / numPoints;
    v_color = vec4(hsv2rgb(vec3(hue, 1, 1)), 1);
  }
  `;

  const drawClosestLinesVS = `
  attribute float a_id;
  uniform float numPoints;
  uniform sampler2D closestLinesTex;
  uniform vec2 closestLinesTexDimensions;
  uniform sampler2D linesTex;
  uniform vec2 linesTexDimensions;
  uniform mat4 matrix;

  varying vec4 v_color;

  vec4 getAs1D(sampler2D tex, vec2 dimensions, float index) {
    float y = floor(index / dimensions.x);
    float x = mod(index, dimensions.x);
    vec2 texcoord = (vec2(x, y) + 0.5) / dimensions;
    return texture2D(tex, texcoord);
  }

  vec3 hsv2rgb(vec3 c) {
    c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    // pull the position from the texture
    float pointId = floor(a_id / 2.0);
    vec4 lineCode = getAs1D(closestLinesTex, closestLinesTexDimensions, pointId);
    float lineId = dot(lineCode, vec4(255, 256 * 255, 256 * 256 * 255, 256 * 256 * 256 * 255));
    float linePointId = lineId * 2.0 + mod(a_id, 2.0);
    vec4 position = getAs1D(linesTex, linesTexDimensions, linePointId);

    // do the common matrix math
    gl_Position = matrix * vec4(position.xy, 0, 1);
    gl_PointSize = 5.0;

    float hue = pointId / numPoints;
    v_color = vec4(hsv2rgb(vec3(hue, 1, 1)), 1);
  }
  `;

  const drawClosestPointsLinesFS = `
  precision highp float;
  varying vec4 v_color;
  void main() {
    gl_FragColor = v_color;
  }
  `;

  const updatePositionFS = `
  precision highp float;

  uniform sampler2D positionTex;
  uniform sampler2D velocityTex;
  uniform vec2 texDimensions;
  uniform vec2 canvasDimensions;
  uniform float deltaTime;

  vec2 euclideanModulo(vec2 n, vec2 m) {
  	return mod(mod(n, m) + m, m);
  }

  void main() {
    // there will be one velocity per position
    // so the velocity texture and position texture
    // are the same size.

    // further, we're generating new positions
    // so we know our destination is the same size
    // as our source so we only need one set of 
    // shared texture dimensions

    // compute texcoord from gl_FragCoord;
    vec2 texcoord = gl_FragCoord.xy / texDimensions;
    
    vec2 position = texture2D(positionTex, texcoord).xy;
    vec2 velocity = texture2D(velocityTex, texcoord).xy;
    vec2 newPosition = euclideanModulo(position + velocity * deltaTime, canvasDimensions);

    gl_FragColor = vec4(newPosition, 0, 1);
  }
  `;

  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    return;
  }
  // check we can use floating point textures
  const ext1 = gl.getExtension('OES_texture_float');
  if (!ext1) {
    alert('Need OES_texture_float');
    return;
  }
  // check we can render to floating point textures
  const ext2 = gl.getExtension('WEBGL_color_buffer_float');
  if (!ext2) {
    alert('Need WEBGL_color_buffer_float');
    return;
  }
  // check we can use textures in a vertex shader
  if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) < 2) {
    alert('Can not use textures in vertex shaders');
    return;
  }

  // we're going to base the initial positions on the size
  // of the canvas so lets update the size of the canvas
  // to the initial size we want
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  function createPoints(numPoints, ranges) {
    const points = [];
    for (let i = 0; i < numPoints; ++i) {
      points.push(...ranges.map((range) => r(...range)), 0, 0); // RGBA
    }
    return points;
  }

  const r = (min, max) => min + Math.random() * (max - min);

  const points = createPoints(8, [
    [0, gl.canvas.width],
    [0, gl.canvas.height],
  ]);
  const lines = createPoints(125 * 2, [
    [0, gl.canvas.width],
    [0, gl.canvas.height],
  ]);
  const numPoints = points.length / 4;
  const numLineSegments = lines.length / 4 / 2;

  const pointVelocities = createPoints(numPoints, [
    [-20, 20],
    [-20, 20],
  ]);
  const lineVelocities = createPoints(numLineSegments * 2, [
    [-20, 20],
    [-20, 20],
  ]);

  const { tex: pointsTex1, dimensions: pointsTexDimensions1 } = createDataTexture(gl, points, gl.FLOAT);
  const { tex: linesTex1, dimensions: linesTexDimensions1 } = createDataTexture(gl, lines, gl.FLOAT);
  const { tex: pointsTex2, dimensions: pointsTexDimensions2 } = createDataTexture(gl, points, gl.FLOAT);
  const { tex: linesTex2, dimensions: linesTexDimensions2 } = createDataTexture(gl, lines, gl.FLOAT);

  const { tex: pointVelocityTex, dimensions: pointVelocityTexDimensions } = createDataTexture(
    gl,
    pointVelocities,
    gl.FLOAT,
  );
  const { tex: lineVelocityTex, dimensions: lineVelocityTexDimensions } = createDataTexture(
    gl,
    lineVelocities,
    gl.FLOAT,
  );

  const pointsFB1 = createFramebuffer(gl, pointsTex1);
  const pointsFB2 = createFramebuffer(gl, pointsTex2);
  const linesFB1 = createFramebuffer(gl, linesTex1);
  const linesFB2 = createFramebuffer(gl, linesTex2);

  let oldPointsLines = {
    pointsFB: pointsFB1,
    linesFB: linesFB1,
    pointsTex: pointsTex1,
    linesTex: linesTex1,
  };
  let newPointsLines = {
    pointsFB: pointsFB2,
    linesFB: linesFB2,
    pointsTex: pointsTex2,
    linesTex: linesTex2,
  };

  function createDataTexture(gl, data, type) {
    const numElements = data.length / 4;

    // compute a size that will hold all of our data
    const width = Math.ceil(Math.sqrt(numElements));
    const height = Math.ceil(numElements / width);

    const bin = type === gl.FLOAT ? new Float32Array(width * height * 4) : new Uint8Array(width * height * 4);
    bin.set(data);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0, // mip level
      gl.RGBA, // internal format
      width,
      height,
      0, // border
      gl.RGBA, // format
      type, // type
      bin,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return { tex, dimensions: [width, height] };
  }

  const closestLinePrgInfo = webglUtils.createProgramInfo(gl, [
    closestLineVS,
    closestLineFS(numLineSegments),
  ]);
  const drawLinesPrgInfo = webglUtils.createProgramInfo(gl, [drawLinesVS, drawLinesFS]);
  const drawPointsPrgInfo = webglUtils.createProgramInfo(gl, [drawPointsVS, drawClosestPointsLinesFS]);
  const drawClosestLinesPrgInfo = webglUtils.createProgramInfo(gl, [
    drawClosestLinesVS,
    drawClosestPointsLinesFS,
  ]);
  const updatePositionPrgInfo = webglUtils.createProgramInfo(gl, [closestLineVS, updatePositionFS]);

  // setup a full canvas clip space quad
  const quadBufferInfo = webglUtils.createBufferInfoFromArrays(gl, {
    position: {
      numComponents: 2,
      data: [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1],
    },
  });

  // setup an id buffer
  const numIds = Math.max(numPoints, numLineSegments * 2);
  const ids = new Array(numIds).fill(0).map((_, i) => i);
  const idBufferInfo = webglUtils.createBufferInfoFromArrays(gl, {
    id: {
      numComponents: 1,
      data: ids,
    },
  });

  // create a texture for the results
  const { tex: closestLinesTex, dimensions: closestLinesTexDimensions } = createDataTexture(
    gl,
    new Array(numPoints * 4),
    gl.UNSIGNED_BYTE,
  );

  function createFramebuffer(gl, tex) {
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return fb;
  }

  // create a framebuffer so we can write to the closestLinesTex
  const closestLineFB = createFramebuffer(gl, closestLinesTex);

  const pointsTexDimensions = pointsTexDimensions1;
  const linesTexDimensions = linesTexDimensions1;

  let then = 0;
  function render(time) {
    // convert to seconds
    time *= 0.001;
    // Subtract the previous time from the current time
    const deltaTime = time - then;
    // Remember the current time for the next frame.
    then = time;

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // update the point positions
    gl.bindFramebuffer(gl.FRAMEBUFFER, newPointsLines.pointsFB);
    gl.viewport(0, 0, ...pointsTexDimensions);
    webglUtils.setBuffersAndAttributes(gl, updatePositionPrgInfo, quadBufferInfo);
    gl.useProgram(updatePositionPrgInfo.program);
    webglUtils.setUniforms(updatePositionPrgInfo, {
      positionTex: oldPointsLines.pointsTex,
      texDimensions: pointsTexDimensions,
      velocityTex: pointVelocityTex,
      canvasDimensions: [gl.canvas.width, gl.canvas.height],
      deltaTime,
    });
    gl.drawArrays(gl.TRIANGLES, 0, 6); // draw the clip space quad so we get one result for each pixel

    // update the line positions
    gl.bindFramebuffer(gl.FRAMEBUFFER, newPointsLines.linesFB);
    gl.viewport(0, 0, ...linesTexDimensions);
    webglUtils.setBuffersAndAttributes(gl, updatePositionPrgInfo, quadBufferInfo);
    gl.useProgram(updatePositionPrgInfo.program);
    webglUtils.setUniforms(updatePositionPrgInfo, {
      positionTex: oldPointsLines.linesTex,
      texDimensions: linesTexDimensions,
      velocityTex: lineVelocityTex,
      canvasDimensions: [gl.canvas.width, gl.canvas.height],
      deltaTime,
    });
    gl.drawArrays(gl.TRIANGLES, 0, 6); // draw the clip space quad so we get one result for each pixel

    // now that we've moved the points and lines
    // compute the closest lines

    const { linesTex, pointsTex } = newPointsLines;

    gl.bindFramebuffer(gl.FRAMEBUFFER, closestLineFB);
    gl.viewport(0, 0, ...closestLinesTexDimensions);

    // setup our attributes to tell WebGL how to pull
    // the data from the buffer above to the position attribute
    // this buffer just contains a -1 to +1 quad for rendering
    // to every pixel
    webglUtils.setBuffersAndAttributes(gl, closestLinePrgInfo, quadBufferInfo);
    gl.useProgram(closestLinePrgInfo.program);
    webglUtils.setUniforms(closestLinePrgInfo, {
      pointsTex,
      pointsTexDimensions,
      linesTex,
      linesTexDimensions,
    });
    gl.drawArrays(gl.TRIANGLES, 0, 6); // draw the clip space quad so we get one result for each pixel

    // draw all the lines in gray
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const matrix = m4.orthographic(0, gl.canvas.width, 0, gl.canvas.height, -1, 1);

    webglUtils.setBuffersAndAttributes(gl, drawLinesPrgInfo, idBufferInfo);
    gl.useProgram(drawLinesPrgInfo.program);
    webglUtils.setUniforms(drawLinesPrgInfo, {
      linesTex,
      linesTexDimensions,
      matrix,
    });

    gl.drawArrays(gl.LINES, 0, numLineSegments * 2);

    // draw the closest lines
    webglUtils.setBuffersAndAttributes(gl, drawClosestLinesPrgInfo, idBufferInfo);
    gl.useProgram(drawClosestLinesPrgInfo.program);
    webglUtils.setUniforms(drawClosestLinesPrgInfo, {
      numPoints,
      closestLinesTex,
      closestLinesTexDimensions,
      linesTex,
      linesTexDimensions,
      matrix,
    });

    // there is one closest line for each point, 2 vertices per line
    gl.drawArrays(gl.LINES, 0, numPoints * 2);

    // draw the points
    webglUtils.setBuffersAndAttributes(gl, drawPointsPrgInfo, idBufferInfo);
    gl.useProgram(drawPointsPrgInfo.program);
    webglUtils.setUniforms(drawPointsPrgInfo, {
      numPoints,
      pointsTex,
      pointsTexDimensions,
      matrix,
    });
    gl.drawArrays(gl.POINTS, 0, numPoints);

    // swap old and new for next frame
    {
      const temp = oldPointsLines;
      oldPointsLines = newPointsLines;
      newPointsLines = temp;
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
