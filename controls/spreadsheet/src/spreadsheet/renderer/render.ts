import { initialLoad, ribbon, formulaBar, IRenderer, beforeVirtualContentLoaded, getSiblingsHeight, setAriaOptions } from '../common/index';
import { SheetRender, RowRenderer, CellRenderer } from './index';
import { Spreadsheet } from '../base/index';
import { remove } from '@syncfusion/ej2-base';
import { CellModel, SheetModel, getSheetName, getRowsHeight, getColumnsWidth } from '../../workbook/base/index';
import { getCellAddress, getCellIndexes, workbookFormulaOperation } from '../../workbook/common/index';
import { dataRefresh, RefreshArgs, sheetTabs, onContentScroll, deInitProperties, beforeDataBound } from '../common/index';
import { spreadsheetDestroyed } from '../common/index';

/**
 * Render module is used to render the spreadsheet
 * @hidden
 */
export class Render {
    private parent: Spreadsheet;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    public render(): void {
        this.parent.activeSheetIndex = this.parent.skipHiddenSheets(this.parent.activeSheetIndex);
        if (!this.parent.isMobileView()) {
            this.parent.notify(ribbon, null);
            this.parent.notify(formulaBar, null);
        }
        let sheetPanel: HTMLElement = this.parent.createElement('div', {
            id: this.parent.element.id + '_sheet_panel', className: 'e-sheet-panel'
        });
        if (this.parent.enableRtl) { sheetPanel.classList.add('e-rtl'); }
        this.parent.element.appendChild(sheetPanel);
        if (this.parent.showSheetTabs) {
            this.parent.notify(sheetTabs, null);
        } else { // for formula calculation
            let sheetName: string = getSheetName(this.parent, 0);
            let arg: { [key: string]: Object } = { action: 'addSheet', sheetName: 'Sheet1', index: 1, visibleName: sheetName };
            this.parent.notify(workbookFormulaOperation, arg);
            this.parent.notify(workbookFormulaOperation, { action: 'initiateDefinedNames' });
        }
        if (this.parent.isMobileView()) {
            this.parent.notify(formulaBar, null);
            this.parent.notify(ribbon, null);
        }
        this.setSheetPanelSize();
        this.renderSheet(sheetPanel);
        this.checkTopLeftCell(true);
    }

    private checkTopLeftCell(initLoad?: boolean): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (!this.parent.scrollSettings.enableVirtualization || sheet.topLeftCell === 'A1') {
            this.refreshUI({ rowIndex: 0, colIndex: 0, refresh: 'All' }, null, initLoad);
        } else {
            let indexes: number[] = getCellIndexes(sheet.topLeftCell);
            let top: number = indexes[0] ? getRowsHeight(sheet, 0, indexes[0] - 1) : 0;
            let left: number = indexes[1] ? getColumnsWidth(sheet, 0, indexes[1] - 1) : 0;
            this.parent.notify(onContentScroll, { scrollLeft: left, scrollTop: top, preventScroll: true });
            let threshold: number = this.parent.getThreshold('row');
            let rowIndex: number = indexes[0] > threshold ? indexes[0] - threshold : 0;
            threshold = this.parent.getThreshold('col');
            let colIndex: number = indexes[1] > threshold ? indexes[1] - threshold : 0;
            this.refreshUI({ rowIndex: rowIndex, colIndex: colIndex, refresh: 'All', top: top, left: left });
        }
    }

    private renderSheet(panel: HTMLElement = document.getElementById(this.parent.element.id + '_sheet_panel')): void {
        panel.appendChild(this.parent.createElement('div', { className: 'e-sheet', id: this.parent.element.id + '_sheet' }));
        (this.parent.serviceLocator.getService('sheet') as IRenderer).renderPanel();
    }

    public refreshUI(args: RefreshArgs, address?: string, initLoad?: boolean): void {
        let sheetModule: IRenderer = <IRenderer>this.parent.serviceLocator.getService('sheet');
        let sheet: SheetModel = this.parent.getActiveSheet();
        let sheetName: string = getSheetName(this.parent);
        this.parent.showSpinner();
        if (!address) {
            if (this.parent.scrollSettings.enableVirtualization) {
                let lastRow: number = args.rowIndex + this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2);
                let count: number = sheet.rowCount - 1;
                if (this.parent.scrollSettings.isFinite && lastRow > count) { lastRow = count; }
                let lastCol: number = args.colIndex + this.parent.viewport.colCount + (this.parent.getThreshold('col') * 2);
                count = sheet.colCount - 1;
                if (this.parent.scrollSettings.isFinite && lastCol > count) { lastCol = count; }
                let indexes: number[] = this.parent.skipHidden(args.rowIndex, lastRow);
                let startRow: number = args.rowIndex;
                if (args.rowIndex !== indexes[0]) {
                    let topLeftCell: number[] = getCellIndexes(sheet.topLeftCell);
                    if (topLeftCell[0] === args.rowIndex) {
                        sheet.topLeftCell = getCellAddress(indexes[0], topLeftCell[1]);
                    }
                    args.rowIndex = indexes[0];
                }
                lastRow = indexes[1];
                indexes = this.parent.skipHidden(args.colIndex, lastCol, 'columns');
                let startCol: number = args.colIndex;
                if (args.colIndex !== indexes[0]) {
                    let topLeftCell: number[] = getCellIndexes(sheet.topLeftCell);
                    if (topLeftCell[1] === args.colIndex) {
                        sheet.topLeftCell = getCellAddress(topLeftCell[0], indexes[0]);
                    }
                    args.colIndex = indexes[0];
                }
                lastCol = indexes[1];
                this.parent.viewport.topIndex = args.rowIndex; this.parent.viewport.bottomIndex = lastRow;
                this.parent.viewport.leftIndex = args.colIndex; this.parent.viewport.rightIndex = lastCol;
                address = `${getCellAddress(startRow, startCol)}:${getCellAddress(lastRow, lastCol)}`;
            } else {
                address = `A1:${getCellAddress(sheet.rowCount - 1, sheet.colCount - 1)}`;
            }
        }
        if (args.refresh === 'All') {
            this.parent.trigger(beforeDataBound, {});
        }
        setAriaOptions(this.parent.getMainContent() as HTMLElement, { busy: true });
        this.parent.getData(`${sheetName}!${address}`).then((values: Map<string, CellModel>): void => {
            let indexes: number[] = [args.rowIndex, args.colIndex, ...getCellIndexes(address.split(':')[1])];
            switch (args.refresh) {
                case 'All':
                    sheetModule.renderTable({ cells: values, indexes: indexes, top: args.top, left: args.left, initLoad: initLoad });
                    break;
                case 'Row':
                    sheetModule.refreshRowContent({ cells: values, indexes: indexes, skipUpdateOnFirst: args.skipUpdateOnFirst });
                    break;
                case 'Column':
                    sheetModule.refreshColumnContent({ cells: values, indexes: indexes, skipUpdateOnFirst: args.skipUpdateOnFirst });
                    break;
                case 'RowPart':
                    sheetModule.updateRowContent({
                        cells: values, indexes: indexes, direction: args.direction, skipUpdateOnFirst: args.skipUpdateOnFirst });
                    break;
                case 'ColumnPart':
                    sheetModule.updateColContent({
                        cells: values, indexes: indexes, direction: args.direction, skipUpdateOnFirst: args.skipUpdateOnFirst });
                    break;
            }
        });
        this.parent.notify(beforeVirtualContentLoaded, { refresh: args.refresh });
    }

    private removeSheet(): void {
        remove(document.getElementById(this.parent.element.id + '_sheet'));
    }

    /**
     * Refresh the active sheet
     */
    public refreshSheet(): void {
        this.removeSheet();
        this.renderSheet();
        this.parent.notify(deInitProperties, {});
        this.checkTopLeftCell();
    }

    /**
     * Used to set sheet panel size.
     */
    public setSheetPanelSize(): void {
        let panel: HTMLElement = document.getElementById(this.parent.element.id + '_sheet_panel');
        let offset: ClientRect = this.parent.element.getBoundingClientRect();
        let height: number;
        if (this.parent.height === 'auto') {
            panel.style.height = '260px';
            height = 230;
        } else {
            height = offset.height - getSiblingsHeight(panel);
            panel.style.height = `${height}px`;
            height -= 32;
        }
        this.parent.viewport.height = height;
        this.parent.viewport.width = offset.width - 32;
        this.parent.viewport.rowCount = this.roundValue(height, 20);
        this.parent.viewport.colCount = this.roundValue(offset.width, 64);
    }

    private roundValue(size: number, threshold: number): number {
        let value: number = size / threshold; let roundedValue: number = Math.round(value);
        return Math.abs(value - roundedValue) < 0.5 ? roundedValue : roundedValue - 1;
    }

    /**
     * Registing the renderer related services.
     */
    private instantiateRenderer(): void {
        this.parent.serviceLocator.register('cell', new CellRenderer(this.parent));
        this.parent.serviceLocator.register('row', new RowRenderer(this.parent));
        this.parent.serviceLocator.register('sheet', new SheetRender(this.parent));
    }

    /** 
     * Destroy the Render module. 
     * @return {void} 
     */
    public destroy(): void {
        this.removeEventListener(); this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(initialLoad, this.instantiateRenderer, this);
        this.parent.on(dataRefresh, this.refreshSheet, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.off(initialLoad, this.instantiateRenderer);
        this.parent.off(dataRefresh, this.refreshSheet);
        this.parent.off(spreadsheetDestroyed, this.destroy);
    }
}

