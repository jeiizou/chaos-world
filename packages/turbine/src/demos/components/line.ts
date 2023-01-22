import { Turbine } from '@/index';

export default function init(containerId: string) {
  const turbine = Turbine.create({
    refQuery: containerId,
  });

  // turbine.shader({
  //   vs: ,
  //   fs: ,
  // })
}
