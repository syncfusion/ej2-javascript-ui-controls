import { IEditCell, IGrid } from '../base/interface';

/**
 * `TemplateEditCell` is used to handle template cell.
 *
 * @hidden
 */
export class TemplateEditCell implements IEditCell {
    private parent: IGrid;

    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public read(element: Element, value: string): string {
        return value;
    }

    public write(): void {
        //
    }

    public destroy(): void {
        //
    }
}
