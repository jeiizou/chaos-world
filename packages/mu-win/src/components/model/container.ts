import { Boxer } from './boxer';

export class Container {
    private windows: Boxer[] = [];
    // boxer id list
    private zLevel: string[] = [];

    constructor(private dom: HTMLDivElement) {}

    addWindow(window: Boxer): void {
        this.windows.push(window);
        this.zLevel.push(window.id);
    }

    getBoundingBox(): [number, number, number, number] {
        return [0, 0, this.dom.clientWidth || 0, this.dom.clientHeight || 0];
    }

    focus(box: Boxer): void {
        const { id } = box;
        let index = this.zLevel.indexOf(id);

        if (index == -1) {
            console.error('boxer is not register in current container');
        }

        this.zLevel.splice(index, 1);
        this.zLevel.unshift(id);
    }

    getLevel(box: Boxer): number {
        const { id } = box;
        return this.zLevel.length - this.zLevel.indexOf(id);
    }
}
