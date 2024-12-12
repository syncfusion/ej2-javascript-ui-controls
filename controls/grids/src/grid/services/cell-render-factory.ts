import { isNullOrUndefined, getEnumValue } from '@syncfusion/ej2-base';
import { ICellRenderer } from '../base/interface';
import { CellType } from '../base/enum';


/**
 * CellRendererFactory
 *
 * @hidden
 */
export class CellRendererFactory {

    public cellRenderMap: { [c: string]: ICellRenderer<{}> } = {};

    public addCellRenderer(name: string | CellType, type: ICellRenderer<{}>): void {
        name = typeof name === 'string' ? name : <string>getEnumValue(CellType, <CellType>name);

        if (isNullOrUndefined(this.cellRenderMap[`${name}`])) {
            this.cellRenderMap[`${name}`] = type;
        }
    }

    public getCellRenderer(name: string | CellType): ICellRenderer<{}> {
        name = typeof name === 'string' ? name : <string>getEnumValue(CellType, <CellType>name);

        if (isNullOrUndefined(this.cellRenderMap[`${name}`])) {
            // eslint-disable-next-line no-throw-literal
            throw `The cellRenderer ${name} is not found`;
        } else {
            return this.cellRenderMap[`${name}`];
        }
    }
}
