import { Container } from './container';
import { nanoid } from 'nanoid';

export class Boxer {
    public id: string;
    private container: Container | null = null;

    constructor(private dom: HTMLDivElement) {
        this.id = nanoid();
    }

    register(container: Container) {
        container.addWindow(this);

        this.container = container;
    }

    focus() {
        this.container?.focus(this);
    }

    getSize() {
        return {
            width: this.dom.clientWidth,
            height: this.dom.clientHeight,
        };
    }

    get level() {
        return this.container?.getLevel(this);
    }
}
