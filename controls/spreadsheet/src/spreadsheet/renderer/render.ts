import { initialLoad, ribbon, formulaBar, IRenderer, beforeVirtualContentLoaded, getSiblingsHeight, setAriaOptions } from '../common/index';
import { SheetRender, RowRenderer, CellRenderer } from './index';
import { Spreadsheet } from '../base/index';
import { remove } from '@syncfusion/ej2-base';
import { CellModel, SheetModel, getSheetName, getRowsHeight, getColumnsWidth } from '../../workbook/base/index';
import { getCellAddress, getCellIndexes } from '../../workbook/common/index';
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
        if (!this.parent.isMobileView()) {
            this.parent.notify(ribbon, null);
            this.parent.notify(formulaBar, null);
        }
        let sheetPanel: HTMLElement = this.parent.createElement('div', {
            id: this.parent.element.id + '_sheet_panel', className: 'e-sheet-panel'
        });
        if (this.parent.enableRtl) { sheetPanel.classList.add('e-rtl'); }
        this.parent.element.appendChild(sheetPanel);
        this.parent.notify(sheetTabs, null);
        if (this.parent.isMobileView()) {
            this.parent.notify(formulaBar, null);
            this.parent.notify(ribbon, null);
        }
        this.setSheetPanelSize();
        this.renderSheet(sheetPanel);
        this.checkTopLeftCell();
    }

    private checkTopLeftCell(): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (!this.parent.scrollSettings.enableVirtualization || sheet.topLeftCell === 'A1') {
            this.refreshUI();
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

    public refreshUI(args: RefreshArgs = { rowIndex: 0, colIndex: 0, refresh: 'All' }, address?: string): void {
        let sheetModule: IRenderer = <IRenderer>this.parent.serviceLocator.getService('sheet');
        let sheet: SheetModel = this.parent.getActiveSheet();
        let sheetName: string = getSheetName(this.parent);
        this.parent.showSpinner();
        if (!address) {
            address = this.parent.scrollSettings.enableVirtualization ? this.getAddress(args.rowIndex, args.colIndex) :
                `A1:${getCellAddress(sheet.rowCount - 1, sheet.colCount - 1)}`;
        }
        if (args.refresh === 'All') { this.parent.trigger(beforeDataBound, {}); }
        setAriaOptions(this.parent.getMainContent() as HTMLElement, { busy: true });
        this.parent.getData(`${sheetName}!${address}`).then((values: Map<string, CellModel>): void => {
            let lastCellIdx: number = getCellIndexes(address.split(':')[1])[1];
            switch (args.refresh) {
                case 'All':
                    sheetModule.renderTable(values, args.rowIndex, args.colIndex, lastCellIdx, args.top, args.left);
                    break;
                case 'Row':
                    sheetModule.refreshRowContent(values, args.colIndex, lastCellIdx);
                    break;
                case 'Column':
                    sheetModule.refreshColumnContent(values, args.rowIndex, args.colIndex, lastCellIdx);
                    break;
                case 'RowPart':
                    sheetModule.updateRowContent(values, args.colIndex, lastCellIdx, args.direction);
                    break;
                case 'ColumnPart':
                    sheetModule.updateColContent(values, args.rowIndex, args.colIndex, lastCellIdx, args.direction);
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

    private getAddress(rowIndex: number, colIndex: number): string {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let lastRowIdx: number = rowIndex + this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2);
        let count: number = sheet.rowCount - 1;
        if (this.parent.scrollSettings.isFinite && lastRowIdx > count) {
            lastRowIdx = count;
        }
        let lastColIdx: number = colIndex + this.parent.viewport.colCount + (this.parent.getThreshold('col') * 2);
        count = sheet.colCount - 1;
        if (this.parent.scrollSettings.isFinite && lastColIdx > count) {
            lastColIdx = count;
        }
        return `${getCellAddress(rowIndex, colIndex)}:${getCellAddress(lastRowIdx, lastColIdx)}`;
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
            height -= 30;
        }
        this.parent.viewport.height = height;
        this.parent.viewport.width = offset.width;
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
        this.parent.serviceLocator.register('row', new RowRenderer(this.parent));
        this.parent.serviceLocator.register('cell', new CellRenderer(this.parent));
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

