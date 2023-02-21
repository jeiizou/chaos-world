export interface CinoApplicationConfig {
  /**
   * application name
   */
  name: string;
  /**
   * application id
   */
  id: string;
  /**
   * application resources
   */
  resources: string;
}

export class CinoApplication {
  constructor(config: CinoApplicationConfig) {}
}
