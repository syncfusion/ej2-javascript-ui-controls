import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { SfGrid } from './sf-grid-fn';
import { Column } from './interfaces';
import { formatUnit } from '@syncfusion/ej2-base';
import { parentsUntil } from './util';

/**
 * ColumnWidthService
 * @hidden
 */
export class ColumnWidthService {
    private parent: SfGrid;

    constructor(parent: SfGrid) {
        this.parent = parent;
    }

    public setMinwidthBycalculation(tWidth?: number): void {
        let difference: number = 0;
        let collection: Column[] = this.parent.getColumns().filter((a: Column) => {
            return isNullOrUndefined(a.width) || a.width === 'auto';
        });
        if (collection.length) {
            if (!isNullOrUndefined(this.parent.options.width) && this.parent.options.width !== 'auto') {
                difference = (typeof this.parent.options.width === 'string' ? parseInt(this.parent.options.width, 10) : this.parent.options.width) - tWidth;
            }
            let tmWidth: number = 0;
            for (let cols of collection) {

                tmWidth += !isNullOrUndefined(cols.minWidth) ?
                    ((typeof cols.minWidth === 'string' ? parseInt(cols.minWidth, 10) : cols.minWidth)) : 0;
            }
            for (let i: number = 0; i < collection.length; i++) {
                if (tWidth === 0 && this.parent.options.allowResizing && this.isWidthUndefined() && (i !== collection.length - 1)) {
                    this.setUndefinedColumnWidth(collection);
                }
                if (tWidth !== 0 && difference < tmWidth) {
                    this.setWidth(collection[i].minWidth, this.parent.getColumnIndexByField(collection[i].field));
                } else if (tWidth !== 0 && difference > tmWidth) {
                    this.setWidth('', this.parent.getColumnIndexByField(collection[i].field), true);
                }
            }
        }
    }

    public setUndefinedColumnWidth(collection?: Column[]): void {
        for (let k: number = 0; k < collection.length; k++) {
            if (k !== collection.length - 1) {
                collection[k].width = 200;
                this.setWidth(200, this.parent.getColumnIndexByField(collection[k].field));
            }
        }
    }

    public setColumnWidth(column: Column, index?: number, module?: string): void {
        if (this.parent.getColumns().length < 1) {
            return;
        }
        let columnIndex: number = isNullOrUndefined(index) ? this.parent.getNormalizedColumnIndex(column.uid) : index;
        let cWidth: string | number = this.getWidth(column);
        let tgridWidth: number = this.getTableWidth(this.parent.getColumns());
        if (cWidth !== null) {
            this.setWidth(cWidth, columnIndex);
            if (this.parent.options.width !== 'auto' && this.parent.options.width.toString().indexOf('%') === -1) {
                this.setMinwidthBycalculation(tgridWidth);
            }
            if ((this.parent.options.allowResizing && module === 'resize') || (this.parent.options.frozenColumns && this.parent.options.allowResizing)) {
                this.setWidthToTable();
            }
            this.parent.dotNetRef.invokeMethodAsync("ColumnWidthChanged", { index: columnIndex, width: cWidth, columnUid: column.uid });
        }
    }

    public setWidth(width: string | number, index: number, clear?: boolean): void {
        let chrome: string = 'chrome';
        let webstore: string = 'webstore';
        if (typeof (width) === 'string' && width.indexOf('%') !== -1 &&
            !(Boolean(window[chrome]) && Boolean(window[chrome][webstore])) && this.parent.options.allowGrouping) {
            let elementWidth: number = this.parent.element.offsetWidth;
            width = parseInt(width, 10) / 100 * (elementWidth);
        }
        let header: Element = this.parent.getHeaderTable();
        let content: Element = this.parent.getContentTable();
        let fWidth: string = formatUnit(width);
        let headerCol: HTMLTableColElement;
        let frzCols: number = this.parent.options.frozenColumns;
        let mHdr: Element = this.parent.getHeaderContent().querySelector('.e-movableheader');
        let mCont: HTMLElement = <HTMLTableColElement>this.parent.getContent().querySelector('.e-movablecontent');
        if (frzCols && index >= frzCols && mHdr && mHdr.querySelector('colgroup')) {
            headerCol = (<HTMLTableColElement>mHdr.querySelector('colgroup').children[index - frzCols]);
        } else if (this.parent.options.enableColumnVirtualization && frzCols && mHdr.scrollLeft > 0) {
            let colGroup: HTMLElement = mHdr.querySelector('colgroup');
            headerCol = (<HTMLTableColElement>colGroup.children[(colGroup.children.length - 1) - index]);
        } else {
            headerCol = (<HTMLTableColElement>header.querySelector('colgroup').children[index]);
        }
        if (headerCol && !clear) {
            headerCol.style.width = fWidth;
        } else if (headerCol && clear) {
            headerCol.style.width = ' ';
        }
        let contentCol: HTMLTableColElement;
        if (frzCols && index >= frzCols) {
            contentCol = (<HTMLTableColElement>this.parent.getContent().querySelector('.e-movablecontent')
                .querySelector('colgroup').children[index - frzCols]);
        } else if (this.parent.options.enableColumnVirtualization && frzCols && mCont.scrollLeft > 0) {
            let colGroup: HTMLElement = this.parent.getContent().querySelector('.e-movablecontent')
                .querySelector('colgroup');
            contentCol = (<HTMLTableColElement>colGroup.children[(colGroup.children.length - 1) - index]);
        } else {
            contentCol = (<HTMLTableColElement>content.querySelector('colgroup').children[index]);
        }
        if (contentCol && !clear) {
            contentCol.style.width = fWidth;
        } else if (contentCol && clear) {
            contentCol.style.width = ' ';
        }

        if (this.parent.options.aggregatesCount != 0) {
            let footerCol: HTMLTableColElement;
            if (frzCols && index >= frzCols) {
                let fmContent: Element = this.parent.getFooterContent().querySelector('.e-movablefootercontent');
                let fmColgroup: Element = !isNullOrUndefined(fmContent) ? fmContent.querySelector('colgroup') : null;
                footerCol = !isNullOrUndefined(fmColgroup) ? <HTMLTableColElement>fmColgroup.children[index - frzCols] : null;
            }
            else {
                let tcolGroup: Element = this.parent.getFooterContent().querySelector('colgroup');
                footerCol = !isNullOrUndefined(tcolGroup) ? <HTMLTableColElement>tcolGroup.children[index] : null;
            }

            if (contentCol && footerCol && !clear) {
                footerCol.style.width = fWidth;
            } else if (contentCol && footerCol && clear) {
                footerCol.style.width = ' ';
            }
        }

        let edit: NodeListOf<Element> = this.parent.element.querySelectorAll('.e-table.e-inline-edit');
        let editTableCol: HTMLTableColElement[] = [];
        for (let i: number = 0; i < edit.length; i++) {
            if (parentsUntil(edit[i], 'e-grid').id === this.parent.element.id) {
                for (let j: number = 0; j < edit[i].querySelector('colgroup').children.length; j++) {
                    editTableCol.push((<HTMLTableColElement>edit[i].querySelector('colgroup').children[j]));
                }
            }
        }
        if (edit.length && editTableCol.length) {
            editTableCol[index].style.width = fWidth;
        }
    }

    public isWidthUndefined(): boolean {
        let isWidUndefCount: number = this.parent.getColumns().filter((col: Column) => {
            return isNullOrUndefined(col.width) && isNullOrUndefined(col.minWidth);
        }).length;
        return (this.parent.getColumns().length === isWidUndefCount);
    }

    public getWidth(column: Column): string | number {
        
        //TODO: move it to c# side

        // if (isNullOrUndefined(column.width) && this.parent.options.allowResizing
        //     && isNullOrUndefined(column.minWidth) && !this.isWidthUndefined()) {
        //     column.width = 200;
        // }
        // if (this.parent.options.frozenColumns && isNullOrUndefined(column.width) &&
        //     column.index < this.parent.options.frozenColumns) {
        //     column.width = 200;
        // }
        if (!column.width) { return null; }
        let width: number = parseInt(column.width.toString(), 10);
        if (column.minWidth && width < parseInt(column.minWidth.toString(), 10)) {
            return column.minWidth;
        } else if ((column.maxWidth && width > parseInt(column.maxWidth.toString(), 10))) {
            return column.maxWidth;
        } else {
            return column.width;
        }
    }

    public getTableWidth(columns: Column[]): number {
        let tWidth: number = 0;
        for (let column of columns) {
            let cWidth: string | number = this.getWidth(column);
            if (column.width === 'auto') {
                cWidth = 0;
            }
            if (column.visible !== false && cWidth !== null) {
                tWidth += parseInt(cWidth.toString(), 10);
            }
        }
        return tWidth;
    }

    private calcMovableOrFreezeColWidth(tableType: String): string {
        let columns: Column[] = this.parent.getColumns().slice();
        if (tableType === 'movable') {
            columns.splice(0, this.parent.options.frozenColumns);
        } else if (tableType === 'freeze') {
            columns.splice(this.parent.options.frozenColumns, columns.length);
        }
        return formatUnit(this.getTableWidth(columns));
    }

    private setWidthToFrozenTable(): void {
        let freezeWidth: string = this.calcMovableOrFreezeColWidth('freeze');
        (this.parent.getHeaderTable() as HTMLTableElement).style.width = freezeWidth;
        (this.parent.getContentTable() as HTMLTableElement).style.width = freezeWidth;
        if (this.parent.getFooterContent() && this.parent.getFooterContent().querySelector('.e-frozenfootercontent').firstElementChild) {
            (this.parent.getFooterContent().querySelector('.e-frozenfootercontent').firstElementChild as HTMLElement).style.width = freezeWidth;
        }
    }

    private setWidthToMovableTable(): void {
        let movableWidth: string = '';
        let isColUndefined: boolean = this.parent.getColumns().filter((a: Column) => { return isNullOrUndefined(a.width); }).length >= 1;
        let isWidthAuto: boolean = this.parent.getColumns().filter((a: Column) => { return (a.width === 'auto'); }).length >= 1;
        if (typeof this.parent.options.width === 'number' && !isColUndefined && !isWidthAuto) {
            movableWidth = formatUnit(this.parent.options.width - parseInt(this.calcMovableOrFreezeColWidth('freeze').split('px')[0], 10) - 5);
        } else if (!isColUndefined && !isWidthAuto) {
            movableWidth = this.calcMovableOrFreezeColWidth('movable');
        }
        if (this.parent.getHeaderContent().querySelector('.e-movableheader').firstElementChild) {
            (this.parent.getHeaderContent().querySelector('.e-movableheader').firstElementChild as HTMLTableElement).style.width
                = movableWidth;
        }

        if (this.parent.getFooterContent() && this.parent.getFooterContent().querySelector('.e-movablefootercontent').firstElementChild) {
            (<HTMLElement>this.parent.getFooterContent().querySelector('.e-movablefootercontent').firstElementChild).style.width = movableWidth;
        }

        (this.parent.getContent().querySelector('.e-movablecontent').firstElementChild as HTMLTableElement).style.width =
            movableWidth;
    }
    private setWidthToFrozenEditTable(): void {
        let freezeWidth: string = this.calcMovableOrFreezeColWidth('freeze');
        (this.parent.element.querySelectorAll('.e-table.e-inline-edit')[0] as HTMLTableElement).style.width = freezeWidth;
    }
    private setWidthToMovableEditTable(): void {
        let movableWidth: string = this.calcMovableOrFreezeColWidth('movable');
        (this.parent.element.querySelectorAll('.e-table.e-inline-edit')[1] as HTMLTableElement).style.width = movableWidth;
    }
    public setWidthToTable(): void {
        let tWidth: string = formatUnit(this.getTableWidth(<Column[]>this.parent.getColumns()));
        if (this.parent.options.frozenColumns) {
            this.setWidthToFrozenTable();
            this.setWidthToMovableTable();
        } else {
            if (this.parent.options.hasDetailTemplate) {
                //this.setColumnWidth(new Column({ width: '30px' }));
                this.setWidth('30', 0);
            }
            (this.parent.getHeaderTable() as HTMLTableElement).style.width = tWidth;
            (this.parent.getContentTable() as HTMLTableElement).style.width = tWidth;
            if (this.parent.options.aggregatesCount != 0) {
                (this.parent.getFooterContent().querySelector(".e-table") as HTMLTableElement).style.width = tWidth;
            }
        }
        let edit: HTMLTableElement = <HTMLTableElement>this.parent.element.querySelector('.e-table.e-inline-edit');
        if (edit && this.parent.options.frozenColumns) {
            this.setWidthToFrozenEditTable();
            this.setWidthToMovableEditTable();
        } else if (edit) {
            edit.style.width = tWidth;
        }
    }
}