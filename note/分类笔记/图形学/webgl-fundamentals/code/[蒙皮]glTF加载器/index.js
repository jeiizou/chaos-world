'use strict';

async function main() {
  // 获取WebGL的上下文
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    return;
  }
  const ext = gl.getExtension('OES_texture_float');
  if (!ext) {
    return; // the extension doesn't exist on this device
  }

  // compiles and links the shaders, looks up attribute and uniform locations
  const skinProgramInfo = webglUtils.createProgramInfo(gl, ['skinVS', 'fs']);
  const meshProgramInfo = webglUtils.createProgramInfo(gl, ['meshVS', 'fs']);

  // 蒙皮
  class Skin {
    constructor(joints, inverseBindMatrixData) {
      this.joints = joints;
      this.inverseBindMatrices = [];
      this.jointMatrices = [];
      // 为每个关节分配足够的空间
      this.jointData = new Float32Array(joints.length * 16);
      // 为每个关节和绑定逆矩阵创建视图
      for (let i = 0; i < joints.length; ++i) {
        this.inverseBindMatrices.push(
          new Float32Array(
            inverseBindMatrixData.buffer,
            inverseBindMatrixData.byteOffset + Float32Array.BYTES_PER_ELEMENT * 16 * i,
            16,
          ),
        );
        this.jointMatrices.push(
          new Float32Array(this.jointData.buffer, Float32Array.BYTES_PER_ELEMENT * 16 * i, 16),
        );
      }
      // 创建存储关节矩阵的纹理
      this.jointTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.jointTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    update(node) {
      const globalWorldInverse = m4.inverse(node.worldMatrix);
      // 遍历每个关节获取当前世界矩阵
      // 计算绑定矩阵的逆
      // 在纹理中存储整个结果
      for (let j = 0; j < this.joints.length; ++j) {
        const joint = this.joints[j];
        const dst = this.jointMatrices[j];
        m4.multiply(globalWorldInverse, joint.worldMatrix, dst);
        m4.multiply(dst, this.inverseBindMatrices[j], dst);
      }
      gl.bindTexture(gl.TEXTURE_2D, this.jointTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, this.joints.length, 0, gl.RGBA, gl.FLOAT, this.jointData);
    }
  }

  // 场景图
  class TRS {
    constructor(position = [0, 0, 0], rotation = [0, 0, 0, 1], scale = [1, 1, 1]) {
      this.position = position;
      this.rotation = rotation;
      this.scale = scale;
    }
    getMatrix(dst) {
      dst = dst || new Float32Array(16);
      m4.compose(this.position, this.rotation, this.scale, dst);
      return dst;
    }
  }

  class Node {
    constructor(source, name) {
      this.name = name;
      this.source = source;
      this.parent = null;
      this.children = [];
      this.localMatrix = m4.identity();
      this.worldMatrix = m4.identity();
      this.drawables = [];
    }
    setParent(parent) {
      if (this.parent) {
        this.parent._removeChild(this);
        this.parent = null;
      }
      if (parent) {
        parent._addChild(this);
        this.parent = parent;
      }
    }
    updateWorldMatrix(parentWorldMatrix) {
      const { source } = this;
      if (source) {
        source.getMatrix(this.localMatrix);
      }

      if (parentWorldMatrix) {
        // a matrix was passed in so do the math
        m4.multiply(parentWorldMatrix, this.localMatrix, this.worldMatrix);
      } else {
        // no matrix was passed in so just copy local to world
        m4.copy(this.localMatrix, this.worldMatrix);
      }

      // now process all the children
      const { worldMatrix } = this;
      for (const child of this.children) {
        child.updateWorldMatrix(worldMatrix);
      }
    }
    traverse(fn) {
      fn(this);
      for (const child of this.children) {
        child.traverse(fn);
      }
    }
    _addChild(child) {
      this.children.push(child);
    }
    _removeChild(child) {
      const ndx = this.children.indexOf(child);
      this.children.splice(ndx, 1);
    }
  }

  // 蒙皮的渲染器
  class SkinRenderer {
    constructor(mesh, skin) {
      this.mesh = mesh;
      this.skin = skin;
    }
    render(node, projection, view, sharedUniforms) {
      const { skin, mesh } = this;
      skin.update(node);
      gl.useProgram(skinProgramInfo.program);
      for (const primitive of mesh.primitives) {
        webglUtils.setBuffersAndAttributes(gl, skinProgramInfo, primitive.bufferInfo);
        webglUtils.setUniforms(skinProgramInfo, {
          u_projection: projection,
          u_view: view,
          u_world: node.worldMatrix,
          u_jointTexture: skin.jointTexture,
          u_numJoints: skin.joints.length,
        });
        webglUtils.setUniforms(skinProgramInfo, primitive.material.uniforms);
        webglUtils.setUniforms(skinProgramInfo, sharedUniforms);
        webglUtils.drawBufferInfo(gl, primitive.bufferInfo);
      }
    }
  }

  // 网格的渲染器
  class MeshRenderer {
    constructor(mesh) {
      this.mesh = mesh;
    }
    render(node, projection, view, sharedUniforms) {
      const { mesh } = this;
      gl.useProgram(meshProgramInfo.program);
      for (const primitive of mesh.primitives) {
        webglUtils.setBuffersAndAttributes(gl, meshProgramInfo, primitive.bufferInfo);
        webglUtils.setUniforms(meshProgramInfo, {
          u_projection: projection,
          u_view: view,
          u_world: node.worldMatrix,
        });
        webglUtils.setUniforms(meshProgramInfo, primitive.material.uniforms);
        webglUtils.setUniforms(meshProgramInfo, sharedUniforms);
        webglUtils.drawBufferInfo(gl, primitive.bufferInfo);
      }
    }
  }

  function throwNoKey(key) {
    throw new Error(`no key: ${key}`);
  }

  const accessorTypeToNumComponentsMap = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16,
  };

  function accessorTypeToNumComponents(type) {
    return accessorTypeToNumComponentsMap[type] || throwNoKey(type);
  }

  const glTypeToTypedArrayMap = {
    5120: Int8Array, // gl.BYTE
    5121: Uint8Array, // gl.UNSIGNED_BYTE
    5122: Int16Array, // gl.SHORT
    5123: Uint16Array, // gl.UNSIGNED_SHORT
    5124: Int32Array, // gl.INT
    5125: Uint32Array, // gl.UNSIGNED_INT
    5126: Float32Array, // gl.FLOAT
  };

  // 给定一个GL类型返回需要的类型
  function glTypeToTypedArray(type) {
    return glTypeToTypedArrayMap[type] || throwNoKey(type);
  }

  // 给定一个访问器下标返回访问器和缓冲正确部分的类型化数组
  function getAccessorTypedArrayAndStride(gl, gltf, accessorIndex) {
    const accessor = gltf.accessors[accessorIndex];
    const bufferView = gltf.bufferViews[accessor.bufferView];
    const TypedArray = glTypeToTypedArray(accessor.componentType);
    const buffer = gltf.buffers[bufferView.buffer];
    return {
      accessor,
      array: new TypedArray(
        buffer,
        bufferView.byteOffset + (accessor.byteOffset || 0),
        accessor.count * accessorTypeToNumComponents(accessor.type),
      ),
      stride: bufferView.byteStride || 0,
    };
  }

  // Given an accessor index return a WebGLBuffer and a stride
  function getAccessorAndWebGLBuffer(gl, gltf, accessorIndex) {
    const accessor = gltf.accessors[accessorIndex];
    const bufferView = gltf.bufferViews[accessor.bufferView];
    if (!bufferView.webglBuffer) {
      const buffer = gl.createBuffer();
      const target = bufferView.target || gl.ARRAY_BUFFER;
      const arrayBuffer = gltf.buffers[bufferView.buffer];
      const data = new Uint8Array(arrayBuffer, bufferView.byteOffset, bufferView.byteLength);
      gl.bindBuffer(target, buffer);
      gl.bufferData(target, data, gl.STATIC_DRAW);
      bufferView.webglBuffer = buffer;
    }
    return {
      accessor,
      buffer: bufferView.webglBuffer,
      stride: bufferView.stride || 0,
    };
  }

  async function loadGLTF(url) {
    const gltf = await loadJSON(url);

    // load all the referenced files relative to the gltf file
    const baseURL = new URL(url, location.href);
    gltf.buffers = await Promise.all(
      gltf.buffers.map((buffer) => {
        const url = new URL(buffer.uri, baseURL.href);
        return loadBinary(url.href);
      }),
    );

    const defaultMaterial = {
      uniforms: {
        u_diffuse: [0.5, 0.8, 1, 1],
      },
    };

    // setup meshes
    gltf.meshes.forEach((mesh) => {
      mesh.primitives.forEach((primitive) => {
        const attribs = {};
        let numElements;
        for (const [attribName, index] of Object.entries(primitive.attributes)) {
          const { accessor, buffer, stride } = getAccessorAndWebGLBuffer(gl, gltf, index);
          numElements = accessor.count;
          attribs[`a_${attribName}`] = {
            buffer,
            type: accessor.componentType,
            numComponents: accessorTypeToNumComponents(accessor.type),
            stride,
            offset: accessor.byteOffset | 0,
          };
        }

        const bufferInfo = {
          attribs,
          numElements,
        };

        if (primitive.indices !== undefined) {
          const { accessor, buffer } = getAccessorAndWebGLBuffer(gl, gltf, primitive.indices);
          bufferInfo.numElements = accessor.count;
          bufferInfo.indices = buffer;
          bufferInfo.elementType = accessor.componentType;
        }

        primitive.bufferInfo = bufferInfo;

        // save the material info for this primitive
        primitive.material = (gltf.materials && gltf.materials[primitive.material]) || defaultMaterial;
      });
    });

    const skinNodes = [];
    const origNodes = gltf.nodes;
    gltf.nodes = gltf.nodes.map((n) => {
      const { name, skin, mesh, translation, rotation, scale } = n;
      const trs = new TRS(translation, rotation, scale);
      const node = new Node(trs, name);
      const realMesh = gltf.meshes[mesh];
      // 如果有skin属性, 就创建一个skin
      if (skin !== undefined) {
        skinNodes.push({ node, mesh: realMesh, skinNdx: skin });
      } else if (realMesh) {
        node.drawables.push(new MeshRenderer(realMesh));
      }
      return node;
    });

    // 设置蒙皮
    gltf.skins = gltf.skins.map((skin) => {
      const joints = skin.joints.map((ndx) => gltf.nodes[ndx]);
      const { array } = getAccessorTypedArrayAndStride(gl, gltf, skin.inverseBindMatrices);
      return new Skin(joints, array);
    });

    // 给蒙皮节点添加SkinRenderers
    for (const { node, mesh, skinNdx } of skinNodes) {
      node.drawables.push(new SkinRenderer(mesh, gltf.skins[skinNdx]));
    }

    // arrange nodes into graph
    gltf.nodes.forEach((node, ndx) => {
      const { children } = origNodes[ndx];
      if (children) {
        addChildren(gltf.nodes, node, children);
      }
    });

    // setup scenes
    for (const scene of gltf.scenes) {
      scene.root = new Node(new TRS(), scene.name);
      addChildren(gltf.nodes, scene.root, scene.nodes);
    }

    return gltf;
  }

  function addChildren(nodes, node, childIndices) {
    childIndices.forEach((childNdx) => {
      const child = nodes[childNdx];
      child.setParent(node);
    });
  }

  async function loadFile(url, typeFunc) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`could not load: ${url}`);
    }
    return await response[typeFunc]();
  }

  async function loadBinary(url) {
    return loadFile(url, 'arrayBuffer');
  }

  async function loadJSON(url) {
    return loadFile(url, 'json');
  }

  const gltf = await loadGLTF('../assets/whale.CYCLES.gltf');

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  const origMatrices = new Map();
  function animSkin(skin, a) {
    for (let i = 0; i < skin.joints.length; ++i) {
      const joint = skin.joints[i];
      // 如果这个关节并没有存储矩阵
      if (!origMatrices.has(joint)) {
        // 为关节存储一个矩阵
        origMatrices.set(joint, joint.source.getMatrix());
      }
      // 获取原始的矩阵
      const origMatrix = origMatrices.get(joint);
      // 旋转它
      const m = m4.xRotate(origMatrix, a);
      // 分解回关节的位置, 旋转量以及缩放量
      m4.decompose(m, joint.source.position, joint.source.rotation, joint.source.scale);
    }
  }

  function render(time) {
    time *= 0.001; // convert to seconds

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfViewRadians = degToRad(60);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    const cameraPosition = [10, 0, -5];
    const target = [0, 0, -10];
    // for debugging .. see article
    // const cameraPosition = [5, 0, 5];
    // const target = [0, 0, 0];
    const up = [0, 1, 0];
    // Compute the camera's matrix using look at.
    const camera = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    const view = m4.inverse(camera);

    animSkin(gltf.skins[0], Math.sin(time) * 0.5);

    const sharedUniforms = {
      u_lightDirection: m4.normalize([-1, 3, 5]),
    };

    function renderDrawables(node) {
      for (const drawable of node.drawables) {
        drawable.render(node, projection, view, sharedUniforms);
      }
    }

    for (const scene of gltf.scenes) {
      // updatte all world matices in the scene.
      scene.root.updateWorldMatrix();
      // walk the scene and render all renderables
      scene.root.traverse(renderDrawables);
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
