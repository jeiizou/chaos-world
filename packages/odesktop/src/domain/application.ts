export class Application {
    constructor(
        public id: string,
        public info: {
            name: string;
            icon?: string;
        },
    ) {}
}
