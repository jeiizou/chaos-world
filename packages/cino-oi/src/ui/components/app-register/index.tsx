import { AppBootstrapApp } from '@/basic-application/app-bootstrap';
import { SysSettingApp } from '@/basic-application/sys-setting';
import { BingSearchApp } from '@/basic-application/web-bing-search';
import { CinoModel } from '@/ui/hooks/use-cino';
import React, { useEffect } from 'react';

type AppRegisterProps = {
  // HOLD
};

export default function AppRegister({}: AppRegisterProps): React.ReactElement {
  const { cino } = CinoModel.useContext();

  useEffect(() => {
    if (cino) {
      cino.install(AppBootstrapApp);
      cino.install(SysSettingApp);
      cino.install(BingSearchApp);
    }
  }, [cino]);

  return <></>;
}
