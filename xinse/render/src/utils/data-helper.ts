import { Vector3Row } from '@/math-helper/vector';

export function fillPointsToLines(pointData: Vector3Row[]) {
  let resPointsData: Vector3Row[] = [];
  for (let i = 0; i < pointData.length; i++) {
    const element = pointData[i];
    resPointsData.push(element);
    if (i > 0) {
      resPointsData.push(element);
    }
  }
  resPointsData.push(pointData[0]);
  return resPointsData;
}
