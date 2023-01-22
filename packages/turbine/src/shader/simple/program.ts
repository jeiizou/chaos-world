import { createProgramInfo } from 'twgl.js';
import baseFs from './simple.fs';
import baseVs from './simple.vs';

import { memoize } from 'lodash-es';

function getProgramInfo(gl: GLRendingContext) {
  return createProgramInfo(gl, [baseVs, baseFs]);
}

export const getProgramInfoM = memoize(getProgramInfo);
