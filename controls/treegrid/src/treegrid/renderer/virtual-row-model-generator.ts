import { VirtualRowModelGenerator } from '@syncfusion/ej2-grids';
import { NotifyArgs, Row, Column, IGrid } from '@syncfusion/ej2-grids';
import { ITreeData } from '../base';
import * as events from '../base/constant';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * RowModelGenerator is used to generate grid data rows.
 * @hidden
 */
export class TreeVirtualRowModelGenerator extends VirtualRowModelGenerator {
    private visualData: ITreeData[];
    constructor(parent: IGrid) {
        super(parent);
        this.addEventListener();
    }
    public addEventListener() : void {
        this.parent.on(events.dataListener, this.getDatas, this);
    }
    private getDatas(args: {data: ITreeData[]}): void {
        this.visualData = args.data;
    }
    public generateRows(data: Object[], notifyArgs?: NotifyArgs): Row<Column>[] {
        if (!isNullOrUndefined(notifyArgs.requestType) && notifyArgs.requestType.toString() === 'collapseAll') {
            notifyArgs.requestType = 'refresh';
        }
        let rows: Row<Column>[] = super.generateRows(data, notifyArgs);
        for (let r: number = 0; r < rows.length; r++) {
            rows[r].index = (<ITreeData[]>(this.visualData)).indexOf(rows[r].data);
        }
        return rows;
    }
    public checkAndResetCache(action: string): boolean {
        let clear: boolean = ['paging', 'refresh', 'sorting', 'filtering', 'searching', 'virtualscroll', 'reorder',
                            'save', 'delete'].some((value: string) => action === value);
        if (clear) {
            this.cache = {}; this.data = {}; this.groups = {};
        }
        return clear;
    }
}