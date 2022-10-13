import { Window } from './window';

export class FreeLayout {
    private windows: Window[] = [];
    // boxer id list
    public zLevel: string[] = [];

    constructor(private dom: HTMLDivElement) {}

    addWindow(window: Window): void {
        this.windows.push(window);
        this.zLevel.push(window.id);
    }

    getBoundingBox(): [number, number, number, number] {
        return [0, 0, this.dom.clientWidth || 0, this.dom.clientHeight || 0];
    }

    focus(box: Window): void {
        const { id } = box;
        let index = this.zLevel.indexOf(id);

        if (index == -1) {
            console.error('boxer is not register in current container');
        }

        this.zLevel.splice(index, 1);
        this.zLevel.unshift(id);
    }

    getLevel(box: Window): number {
        const { id } = box;
        return this.zLevel.length - this.zLevel.indexOf(id);
    }

    getWindows() {
        console.log(this.windows);
        return this.windows;
    }
}
