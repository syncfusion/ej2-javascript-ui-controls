import { remove } from '@syncfusion/ej2-base';
import { Grid } from '../base/grid';
import { ISelectedCell, NotifyArgs } from '../base/interface';
import {
    initialEnd, uiUpdate, destroy, contentReady, batchCancel, batchAdd, cellEdit, actionComplete,
    rowSelected, rowDeselected, cellSelected, cellDeselected
} from '../base/constant';
import { StatusBarItemConfigModel, StatusBarPanelParamsModel } from '../models/status-bar-settings-model';
import { StatusBarContext, StatusBarPanelType, StatusBarValueFormatterParams } from '../models/status-bar-settings';
import { Column } from '../models/column';
import { Row } from '../models/row';

interface CountState {
    total: number;
    filtered: number;
}

interface AggregateState {
    sum: number;
    count: number;
    min: number;
    max: number;
}

/** Manages the Grid's opt-in Status Bar panel shells. */
export class StatusBar {
    private parent: Grid;
    private element: HTMLElement;
    private panels: { [key: string]: HTMLElement } = Object.create(null);
    private countState: CountState = { total: 0, filtered: 0 };
    private aggregateState: AggregateState = { sum: 0, count: 0, min: 0, max: 0 };
    private pendingCountRefresh: boolean = false;
    private pendingSelectionRefresh: boolean = false;
    private refreshScheduled: boolean = false;
    private selectionRefreshHandler: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private pendingAsyncTemplates: Map<string, Promise<any>> = new Map();

    constructor(parent: Grid) {
        this.parent = parent;
        this.selectionRefreshHandler = this.scheduleSelectionRefresh.bind(this);
        this.parent.on(initialEnd, this.render, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(contentReady, this.onContentReady, this);
        this.parent.on('recordsAdded', this.scheduleCountRefresh, this);
        this.parent.on('recordsDeleted', this.scheduleCountRefresh, this);
        this.parent.on('recordUpadated', this.scheduleCountRefresh, this);
        this.parent.on('filterAfterOpen', this.scheduleCountRefresh, this);
        this.parent.on('searchComplete', this.scheduleCountRefresh, this);
        this.parent.on('dataReady', this.scheduleCountRefresh, this);
        this.parent.addEventListener(rowSelected, this.selectionRefreshHandler);
        this.parent.addEventListener(rowDeselected, this.selectionRefreshHandler);
        this.parent.addEventListener(cellSelected, this.selectionRefreshHandler);
        this.parent.addEventListener(cellDeselected, this.selectionRefreshHandler);
        this.parent.on('recordDoubleClick', this.scheduleSelectionRefresh, this);
        this.parent.on(cellEdit, this.scheduleSelectionRefresh, this);
        this.parent.on(batchAdd, this.scheduleSelectionRefresh, this);
        this.parent.on(batchCancel, this.scheduleSelectionRefresh, this);
        this.parent.on(actionComplete, this.onActionComplete, this);
    }

    private onActionComplete(args: NotifyArgs): void {
        if (args && args.requestType && (args.requestType === 'save' || (args.requestType as string) === 'batchSave')) {
            this.scheduleSelectionRefresh();
        }
    }

    /**
     * Returns the injection module name.
     *
     * @returns {string} The module name.
     * @hidden
     */
    public getModuleName(): string {
        return 'statusBar';
    }

    /**
     * Returns the rendered panel for a key, or null when unavailable.
     *
     * @param {string} key - The configured panel key.
     * @returns {HTMLElement} The panel element, or null.
     */
    public getStatusPanel(key: string): HTMLElement | null {
        // eslint-disable-next-line security/detect-object-injection
        return this.panels[key] || null;
    }

    private onPropertyChanged(args: NotifyArgs): void {
        if (args.module === this.getModuleName()) {
            this.render();
        } else if (args.module === 'aggregate') {
            this.schedulePositionUpdate();
        }
    }

    private render(): void {
        this.removePanel();
        if (!this.parent.enableStatusBar || this.parent.isDestroyed) { return; }
        this.element = this.parent.createElement('div', {
            className: 'e-statusbar',
            attrs: { role: 'status', 'aria-label': 'Status Bar', 'aria-live': 'polite' }
        });
        const positions: string[] = ['Left', 'Center', 'Right'];
        const zones: HTMLElement[] = [];
        for (const position of positions) {
            const zone: HTMLElement = this.parent.createElement('div', { className: 'e-statusbar-' + position.toLowerCase() });
            zones.push(zone);
            this.element.appendChild(zone);
        }
        const items: StatusBarItemConfigModel[] = this.parent.statusBarSettings.items;
        for (const item of items) {
            if (typeof item.key !== 'string' || !item.key.length || this.panels[item.key]) { continue; }
            const panelClass: string = item.type === 'SelectedCellAggregates' ?
                'e-statusbar-agg-panel' : 'e-statusbar-panel';
            const panel: HTMLElement = this.parent.createElement('div', { className: panelClass });
            this.panels[item.key] = panel;
            const position: number = positions.indexOf(item.position);
            zones[position < 0 ? positions.length - 1 : position].appendChild(panel);
        }
        this.parent.element.appendChild(this.element);
        this.positionElement();
        this.schedulePositionUpdate();
        this.scheduleCountRefresh();
        this.updateBuiltInPanels();
    }

    private onContentReady(): void {
        this.schedulePositionUpdate();
        this.scheduleCountRefresh();
    }

    private schedulePositionUpdate(): void {
        Promise.resolve().then(() => {
            if (!this.parent.isDestroyed && this.parent.enableStatusBar) {
                this.positionElement();
            }
        });
    }

    private positionElement(): void {
        if (!this.element || this.element.parentElement !== this.parent.element) { return; }
        let footer: Element | null = null;
        let pager: Element | null = null;
        for (let i: number = 0; i < this.parent.element.children.length; i++) {
            const child: Element = this.parent.element.children[parseInt(i.toString(), 10)];
            if (!footer && child.classList.contains('e-gridfooter')) {
                footer = child;
            } else if (!pager && child.classList.contains('e-gridpager')) {
                pager = child;
            }
        }
        if (footer) {
            const nextSibling: Element | null = footer.nextElementSibling;
            if (nextSibling !== this.element) {
                this.parent.element.insertBefore(this.element, nextSibling);
            }
        } else if (pager) {
            if (pager.previousElementSibling !== this.element) {
                this.parent.element.insertBefore(this.element, pager);
            }
        } else if (this.parent.element.lastChild !== this.element) {
            this.parent.element.appendChild(this.element);
        }
    }

    private scheduleCountRefresh(): void {
        this.pendingCountRefresh = true;
        this.scheduleUpdate();
    }

    private scheduleSelectionRefresh(): void {
        this.pendingSelectionRefresh = true;
        this.scheduleUpdate();
    }

    private scheduleUpdate(): void {
        if (this.refreshScheduled) { return; }
        this.refreshScheduled = true;
        Promise.resolve().then(() => {
            this.refreshScheduled = false;
            if (!this.parent.isDestroyed && this.parent.enableStatusBar) {
                if (this.pendingCountRefresh) {
                    this.pendingCountRefresh = false;
                    this.updateCountState();
                }
                if (this.pendingSelectionRefresh) {
                    this.pendingSelectionRefresh = false;
                    this.updateAggregateState();
                }
                this.updateBuiltInPanels();
            }
        });
    }

    private updateCountState(): void {
        if (!this.isLocalDataSource()) { return; }
        let data: Object[] = [];
        if (this.parent.dataSource instanceof Array) {
            data = this.parent.dataSource;
        } else if (this.parent.dataSource && typeof this.parent.dataSource === 'object' && 'dataSource' in this.parent.dataSource) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dm: any = this.parent.dataSource;
            if (dm.dataSource instanceof Array) {
                data = dm.dataSource;
            }
        }
        this.countState.total = data.length;
        this.countState.filtered = this.getFilteredRowCount();
    }

    private isLocalDataSource(): boolean {
        if (!this.parent.dataSource) { return false; }
        if (this.parent.dataSource instanceof Array) { return true; }
        if (this.parent.dataSource && typeof this.parent.dataSource === 'object' && 'dataSource' in this.parent.dataSource) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dm: any = this.parent.dataSource;
            if (dm.dataSource instanceof Array) { return true; }
        }
        return false;
    }

    private getFilteredRowCount(): number {
        try {
            const records: number = this.parent.getFilteredRecords() && (this.parent.getFilteredRecords() as Object[]) ?
                (this.parent.getFilteredRecords() as Object[]).length : 0;
            return records ? records : 0;
        } catch (e) {
            return this.countState.total;
        }
    }

    private updateAggregateState(): void {
        const selectedCells: ISelectedCell[] = this.parent.getSelectedRowCellIndexes();
        this.aggregateState = { sum: 0, count: 0, min: Infinity, max: -Infinity };
        if (!selectedCells || selectedCells.length === 0) { return; }
        const values: number[] = [];
        for (const cell of selectedCells) {
            let rowObj: Row<Column>;
            try {
                const row: Element = this.parent.getRowByIndex(cell.rowIndex);
                if (!row) { continue; }
                rowObj = this.parent.getRowObjectFromUID(row.getAttribute('data-uid'));
            } catch (e) {
                continue;
            }
            if (!rowObj || !rowObj.data || !cell.cellIndexes) { continue; }
            for (const cellIndex of cell.cellIndexes) {
                try {
                    const column: Column = this.parent.getColumnByIndex(cellIndex);
                    if (!column || !column.field) { continue; }
                    let cellValue: string | number | boolean | Date;
                    if (rowObj.changes && column.field in rowObj.changes) {
                        cellValue = rowObj.changes[column.field];
                    } else {
                        cellValue = rowObj.data[column.field];
                    }
                    if (typeof cellValue === 'number' && isFinite(cellValue)) {
                        values.push(cellValue);
                    }
                } catch (e) {
                    // Skip cells that cannot be resolved
                }
            }
        }
        if (values.length === 0) { return; }
        this.aggregateState.count = values.length;
        this.aggregateState.sum = values.reduce((a: number, b: number) => a + b, 0);
        this.aggregateState.min = Math.min(...values);
        this.aggregateState.max = Math.max(...values);
    }

    private updateBuiltInPanels(): void {
        const items: StatusBarItemConfigModel[] = this.parent.statusBarSettings.items;
        if (!items) { return; }
        for (const item of items) {
            const panel: HTMLElement = this.panels[item.key];
            if (!panel) { continue; }
            if (item.type === 'SelectedCellAggregates') {
                this.renderAggregatePanel(item, panel);
                continue;
            }
            let labelText: string = '';
            let valueText: string = '';
            if (item.type === 'TotalRowCount') {
                labelText = 'Total Rows: ';
                valueText = this.formatPanelValue(item, item.type, this.countState.total);
            } else if (item.type === 'FilteredRowCount') {
                const hasFilter: boolean | undefined = this.parent.filterSettings &&
                    this.parent.filterSettings.columns &&
                    this.parent.filterSettings.columns.length > 0;
                if (hasFilter) {
                    labelText = 'Filtered Rows: ';
                    valueText = this.formatPanelValue(item, item.type, this.countState.filtered);
                }
            } else if (item.type === 'TotalAndFilteredRowCount') {
                labelText = 'Filtered/Total Rows: ';
                valueText = this.formatPanelValue(item, item.type, this.countState.filtered) +
                    ' of ' + this.formatPanelValue(item, item.type, this.countState.total);
            } else if (item.type === 'SelectedRowCount') {
                const selectedRows: number[] = this.parent.getSelectedRowIndexes();
                if (selectedRows && selectedRows.length > 0) {
                    labelText = 'Selected Rows: ';
                    valueText = this.formatPanelValue(item, item.type, selectedRows.length);
                }
            } else if (item.type === 'Custom') {
                this.renderCustomTemplate(item, panel);
                continue;
            }
            panel.textContent = '';
            if (!valueText) {
                this.setPanelVisibility(panel, false);
                continue;
            }
            this.setPanelVisibility(panel, true);
            if (labelText) {
                const label: HTMLElement = this.parent.createElement('span', { className: 'e-statusbar-label' });
                label.textContent = labelText;
                panel.appendChild(label);
            }
            if (valueText) {
                const value: HTMLElement = this.parent.createElement('span', { className: 'e-statusbar-value' });
                value.textContent = valueText;
                panel.appendChild(value);
            }
        }
    }

    private formatPanelValue(
        item: StatusBarItemConfigModel, panelType: StatusBarPanelType, value: number, defaultValue?: string
    ): string {
        const valueFormatter: ((params: StatusBarValueFormatterParams) => string) | undefined
            = item.statusPanelParams && item.statusPanelParams.valueFormatter;
        if (typeof valueFormatter === 'function') {
            const params: StatusBarValueFormatterParams = {
                value: value,
                panelType: panelType,
                locale: this.parent.locale,
                grid: this.parent
            };
            return valueFormatter(params);
        }
        return defaultValue !== undefined ? defaultValue : value.toString();
    }

    private renderAggregatePanel(item: StatusBarItemConfigModel, panel: HTMLElement): void {
        panel.textContent = '';
        const selectedCells: ISelectedCell[] = this.parent.getSelectedRowCellIndexes();
        const defaultAggFuncs: Array<'Count' | 'Sum' | 'Min' | 'Max' | 'Avg'> = [
            'Sum', 'Avg', 'Count', 'Min', 'Max'
        ];
        const aggregateFunctions: Array<'Count' | 'Sum' | 'Min' | 'Max' | 'Avg'> =
            item.statusPanelParams && item.statusPanelParams.aggregateFunctions !== null &&
            item.statusPanelParams.aggregateFunctions !== undefined ?
                item.statusPanelParams.aggregateFunctions : defaultAggFuncs;
        if (!selectedCells || selectedCells.length === 0 || !aggregateFunctions.length || !this.aggregateState.count) {
            this.setPanelVisibility(panel, false);
            return;
        }

        const avg: number = this.aggregateState.sum / this.aggregateState.count;
        for (const aggFunc of aggregateFunctions) {
            let numericValue: number = 0;
            let defaultValue: string = '';
            switch (aggFunc) {
            case 'Sum':
                numericValue = this.aggregateState.sum;
                defaultValue = numericValue.toString();
                break;
            case 'Avg':
                numericValue = avg;
                defaultValue = avg.toFixed(2);
                break;
            case 'Count':
                numericValue = this.aggregateState.count;
                defaultValue = numericValue.toString();
                break;
            case 'Min':
                numericValue = this.aggregateState.min;
                defaultValue = numericValue.toString();
                break;
            case 'Max':
                numericValue = this.aggregateState.max;
                defaultValue = numericValue.toString();
                break;
            default:
                continue;
            }
            const value: string = this.formatPanelValue(item, 'SelectedCellAggregates', numericValue, defaultValue);
            const aggregatePanel: HTMLElement = this.parent.createElement('div', {
                className: 'e-statusbar-' + aggFunc.toLowerCase() + '-agg-panel'
            });
            const label: HTMLElement = this.parent.createElement('span', { className: 'e-statusbar-label' });
            label.textContent = aggFunc + ': ';
            const aggregateValue: HTMLElement = this.parent.createElement('span', { className: 'e-statusbar-value' });
            aggregateValue.textContent = value;
            aggregatePanel.appendChild(label);
            aggregatePanel.appendChild(aggregateValue);
            panel.appendChild(aggregatePanel);
        }
        this.setPanelVisibility(panel, panel.childElementCount > 0);
    }

    private setPanelVisibility(panel: HTMLElement, visible: boolean): void {
        panel.style.display = visible ? '' : 'none';
    }

    private renderCustomTemplate(item: StatusBarItemConfigModel, panel: HTMLElement): void {
        panel.textContent = '';
        this.pendingAsyncTemplates.delete(item.key);
        const params: StatusBarPanelParamsModel | undefined = item.statusPanelParams;
        const template: string | ((context: StatusBarContext) => string | HTMLElement |
        Promise<string | HTMLElement>) | undefined = params && params.template;
        if (!template) {
            this.setPanelVisibility(panel, false);
            return;
        }
        if (params && params.label) {
            const label: HTMLElement = this.parent.createElement('span', { className: 'e-statusbar-label' });
            label.textContent = params.label;
            panel.appendChild(label);
        }
        const contentHost: HTMLElement = this.parent.createElement('span', { className: 'e-statusbar-value' });
        panel.appendChild(contentHost);
        if (typeof template === 'string') {
            this.setCustomTemplateContent(panel, contentHost, template);
            return;
        }
        const context: StatusBarContext = {
            grid: this.parent,
            totalCount: this.countState.total,
            filteredCount: this.countState.filtered,
            selectedCount: this.parent.getSelectedRowIndexes().length,
            selectedCellData: this.parent.getSelectedCellRecords()
        };
        try {
            const result: string | HTMLElement | Promise<string | HTMLElement> = template(context);
            if (typeof result === 'string' || result instanceof HTMLElement) {
                this.setCustomTemplateContent(panel, contentHost, result);
            } else if (result && typeof (result as Promise<string | HTMLElement>).then === 'function') {
                contentHost.textContent = 'Loading...';
                this.setPanelVisibility(panel, true);
                this.pendingAsyncTemplates.set(item.key, result);
                result.then((content: string | HTMLElement) => {
                    if (this.pendingAsyncTemplates.get(item.key) === result && !this.parent.isDestroyed) {
                        this.setCustomTemplateContent(panel, contentHost, content);
                    }
                }).catch(() => {
                    if (this.pendingAsyncTemplates.get(item.key) === result && !this.parent.isDestroyed) {
                        contentHost.textContent = 'Error loading template';
                        this.setPanelVisibility(panel, true);
                    }
                });
            } else {
                panel.removeChild(contentHost);
                this.setPanelVisibility(panel, false);
            }
        } catch (e) {
            contentHost.textContent = 'Error loading template';
            this.setPanelVisibility(panel, true);
        }
    }

    private setCustomTemplateContent(panel: HTMLElement, contentHost: HTMLElement, content: string | HTMLElement): void {
        contentHost.textContent = '';
        if (typeof content === 'string' && content.trim().length > 0) {
            contentHost.textContent = content;
            this.setPanelVisibility(panel, true);
        } else if (content instanceof HTMLElement) {
            contentHost.appendChild(content);
            this.setPanelVisibility(panel, true);
        } else {
            panel.removeChild(contentHost);
            this.setPanelVisibility(panel, false);
        }
    }

    private removePanel(): void {
        if (this.element) {
            remove(this.element);
            this.element = null;
        }
        this.panels = Object.create(null);
    }

    /**
     * Removes owned DOM and all controller subscriptions.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.parent.off(initialEnd, this.render);
        this.parent.off(uiUpdate, this.onPropertyChanged);
        this.parent.off(destroy, this.destroy);
        this.parent.off(contentReady, this.onContentReady);
        this.parent.off('recordsAdded', this.scheduleCountRefresh);
        this.parent.off('recordsDeleted', this.scheduleCountRefresh);
        this.parent.off('recordUpadated', this.scheduleCountRefresh);
        this.parent.off('filterAfterOpen', this.scheduleCountRefresh);
        this.parent.off('searchComplete', this.scheduleCountRefresh);
        this.parent.off('dataReady', this.scheduleCountRefresh);
        this.parent.removeEventListener(rowSelected, this.selectionRefreshHandler);
        this.parent.removeEventListener(rowDeselected, this.selectionRefreshHandler);
        this.parent.removeEventListener(cellSelected, this.selectionRefreshHandler);
        this.parent.removeEventListener(cellDeselected, this.selectionRefreshHandler);
        this.parent.off('recordDoubleClick', this.scheduleSelectionRefresh);
        this.parent.off(cellEdit, this.scheduleSelectionRefresh);
        this.parent.off(batchAdd, this.scheduleSelectionRefresh);
        this.parent.off(batchCancel, this.scheduleSelectionRefresh);
        this.parent.off(actionComplete, this.onActionComplete);
        this.removePanel();
    }
}
