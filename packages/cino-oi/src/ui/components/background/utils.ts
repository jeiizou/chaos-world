import { DesktopBackGround } from './type';

export function handleBackGround(cfg: DesktopBackGround) {
  switch (cfg.type) {
    case 'image':
      return {};

    default:
      break;
  }
}
