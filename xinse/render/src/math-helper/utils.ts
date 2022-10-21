export function getRadiusFromAngle(angle: number) {
  return (Math.PI * angle) / 180.0;
}

export function isPowerOf2(value: number) {
  return (value & (value - 1)) === 0;
}
