import { FreeLayout } from './free-layout';
import { nanoid } from 'nanoid';

export class Window {
    public id: string;
    private container: FreeLayout | null = null;

    constructor(private dom: HTMLDivElement) {
        this.id = nanoid();
    }

    register(container: FreeLayout) {
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
