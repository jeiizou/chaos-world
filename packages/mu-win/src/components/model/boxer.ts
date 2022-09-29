import { Container } from './container';
import { nanoid } from 'nanoid';

export class Boxer {
    public id: string;
    private container: Container | null = null;

    public width: number;
    public height: number;

    constructor(dom: HTMLDivElement) {
        this.id = nanoid();
        this.width = dom.clientWidth;
        this.height = dom.clientHeight;
    }

    register(container: Container) {
        container.addWindow(this);

        this.container = container;
    }

    focus() {
        this.container?.focus(this);
    }

    get level() {
        return this.container?.getLevel(this);
    }
}
