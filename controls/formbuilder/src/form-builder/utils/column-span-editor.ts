import { L10n, createElement } from '@syncfusion/ej2-base';
import { Grid } from '@syncfusion/ej2-grids';
import { NumericTextBox } from '@syncfusion/ej2-inputs';

/** @private */
export interface ColumnWidthRow {
    id: number;
    index: number;
    columnName: string;
    width: string;
}

/** @private */
export interface ColumnSpanEditorOptions {
    host: HTMLElement;
    columnCount: number;
    initialWidths?: (number | null)[];
    l10n: L10n;
    onChange: (widths: (number | null)[]) => void;
    enableRtl: boolean;
}

/** @private */
export class ColumnSpanEditor {
    private host: HTMLElement;
    private columnCount: number;
    private initialWidths: (number | null)[];
    private l10n: L10n;
    private onChange: (widths: (number | null)[]) => void;
    private rows: ColumnWidthRow[];
    private grid: Grid | null;
    private destroyed: boolean;
    private gridHost: HTMLElement | null;
    private templateId: string;
    private numericTextBoxes: Map<number, NumericTextBox>;
    private inputKeydownListeners: Map<number, { element: HTMLElement; handler: (event: Event) => void }>;
    private props: ColumnSpanEditorOptions;
    constructor(opts: ColumnSpanEditorOptions) {
        this.host = opts.host;
        this.props = opts;
        this.columnCount = opts.columnCount || 2;
        this.initialWidths = opts.initialWidths || [];
        this.l10n = opts.l10n;
        this.onChange = opts.onChange;
        this.rows = [];
        this.grid = null;
        this.destroyed = false;
        this.gridHost = null;
        this.templateId = '';
        this.numericTextBoxes = new Map();
        this.inputKeydownListeners = new Map();

        this.rows = this.normalizeRows();
    }

    /** @private */
    public render(): void {
        if (this.destroyed) {
            return;
        }

        this.clearListeners();
        this.host.innerHTML = '';

        if (this.columnCount < 1 || this.columnCount > 12) {
            var errorDiv: HTMLElement = createElement('div', {
                className: 'column-span-editor-error'
            });
            errorDiv.innerHTML = '\u26A0\uFE0F Invalid column count: ' + this.columnCount;
            this.host.appendChild(errorDiv);
            return;
        }

        var rowTemplateId: string = 'col-width-row-template-' + Date.now();
        this.templateId = rowTemplateId;
        var templateElement: HTMLElement = createElement('script', {
            id: rowTemplateId
        });
        (templateElement as any).type = 'text/x-template';
        templateElement.innerHTML = '<tr>' +
            '<td class="e-rowcell e-templatecell">' +
            '  <span class="column-name">${columnName}</span>' +
            '</td>' +
            '<td class="e-rowcell e-templatecell">' +
            '  <div>' +
            '    <input class="e-input width-input" data-id="${id}" value="${width}" placeholder="Width %" />' +
            '  </div>' +
            '</td>' +
            '</tr>';
        document.body.appendChild(templateElement);

        this.gridHost = createElement('div', {
            className: 'options-editor-grid'
        });
        this.host.appendChild(this.gridHost);

        var height: number = this.calculateHeight(this.rows.length);

        this.grid = new Grid({
            enableRtl: this.props.enableRtl,
            dataSource: this.rows.slice(),
            allowPaging: false,
            height: height,
            cssClass: 'options-grid table-col',
            allowSelection: false,
            rowTemplate: '#' + rowTemplateId,
            columns: [
                { field: 'columnName', headerText: this.l10n.getConstant('columns') || 'Columns', width: '80px', allowSorting: false },
                { field: 'width', headerText: (this.l10n.getConstant('width') || 'Width') + ' (%)', width: 'auto', allowSorting: false }
            ],
            dataBound: () => this.onGridDataBound(rowTemplateId)
        });
        this.grid.appendTo(this.gridHost);
    }

    private onGridDataBound(templateId: string): void {
        if (!this.grid) {
            return;
        }

        var contentTable: Element | null = this.grid.getContentTable();
        if (!contentTable) {
            return;
        }

        var widthInputs: NodeListOf<Element> = contentTable.querySelectorAll('.width-input');
        var self: ColumnSpanEditor = this;
        widthInputs.forEach((input: Element) => {
            var inputEl: HTMLInputElement = input as HTMLInputElement;
            var dataId: string | null = inputEl.getAttribute('data-id');
            if (!dataId) {
                return;
            }

            var rowId: number = parseInt(dataId, 10);
            var currentRow: ColumnWidthRow | undefined = self.rows.find((r: ColumnWidthRow) => r.id === rowId);
            if (!currentRow) {
                return;
            }

            var maxValue: number = self.calculateMaxForField(rowId);
            var numericTextBox: NumericTextBox = new NumericTextBox({
                enableRtl: self.props.enableRtl,
                value: currentRow.width ? parseFloat(currentRow.width) : undefined,
                min: 0,
                max: maxValue,
                format: 'n',
                change: (args: { value: number | null }) => {
                    self.handleInputChange(rowId, args.value, numericTextBox);
                }
            });
            numericTextBox.appendTo(inputEl);
            self.numericTextBoxes.set(rowId, numericTextBox);

            var keydownHandler: (event: Event) => void = (event: Event) => {
                var keyEvent: KeyboardEvent = event as KeyboardEvent;
                if (keyEvent.ctrlKey && keyEvent.key === 'a') {
                    keyEvent.preventDefault();
                    numericTextBox.element.select();
                }
            };
            numericTextBox.element.addEventListener('keydown', keydownHandler);
            self.inputKeydownListeners.set(rowId, { element: numericTextBox.element, handler: keydownHandler });
        });
    }

    private handleInputChange(id: number, value: number | null, numericTextBox: NumericTextBox): void {
        if (value === null || value === undefined || isNaN(value)) {
            var rowIndex: number = this.rows.findIndex((r: ColumnWidthRow) => r.id === id);
            if (rowIndex >= 0) {
                this.rows[rowIndex as number].width = '';
            }
        } else {
            var maxForThisField: number = this.calculateMaxForField(id);
            var parsedWidth: number = Math.max(0, Math.min(value, maxForThisField));
            if (value !== parsedWidth) {
                numericTextBox.value = parsedWidth;
            }

            var rowIndex2: number = this.rows.findIndex((r: ColumnWidthRow) => r.id === id);
            if (rowIndex2 >= 0) {
                this.rows[rowIndex2 as number].width = String(parsedWidth);
            }
        }

        this.updateAllInputMaxValues();

        this.triggerChange();
    }

    private updateAllInputMaxValues(): void {
        var self: ColumnSpanEditor = this;
            this.numericTextBoxes.forEach((numericTextBox: NumericTextBox, rowId: number) => {
                var maxForField: number = self.calculateMaxForField(rowId);
                numericTextBox.max = maxForField;
                numericTextBox.dataBind();
        });
    }

    /** @private */
    public destroy(): void {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        this.clearListeners();
        if (this.grid) {
            try {
                this.grid.destroy();
            } catch (e) {
                // ignore
            }
        }
        this.host.innerHTML = '';
        this.gridHost = null;
    }

    private clearListeners(): void {
        this.inputKeydownListeners.forEach((entry: { element: HTMLElement; handler: (event: Event) => void }) => {
            entry.element.removeEventListener('keydown', entry.handler);
        });
        this.inputKeydownListeners.clear();
        this.numericTextBoxes.forEach((numericTextBox: NumericTextBox) => {
            try {
                numericTextBox.destroy();
            } catch (e) {
                // ignore
            }
        });
        this.numericTextBoxes.clear();
    }

    private normalizeRows(): ColumnWidthRow[] {
        var rows: ColumnWidthRow[] = [];
        var hasInitialWidths: boolean = this.initialWidths && this.initialWidths.length > 0 && 
                                        this.initialWidths.some((w: number | null) => w !== null && w !== undefined);
        var defaultWidth: number = Math.round(100 / this.columnCount);
        for (var i: number = 0; i < this.columnCount; i++) {
            var width: number | null | undefined = null;
            if (hasInitialWidths && this.initialWidths[i as number] !== null && this.initialWidths[i as number] !== undefined) {
                width = this.initialWidths[i as number];
            } else {
                width = defaultWidth;
            }
            
            rows.push({
                id: i,
                index: i,
                columnName: String(i + 1),
                width: width ? String(width) : ''
            });
        }
        return rows;
    }

    private calculateMaxForField(fieldId: number): number {
        var totalFilled: number = 0;
        this.rows.forEach((row: ColumnWidthRow) => {
            if (row.id !== fieldId && row.width) {
                var val: number = parseFloat(row.width);
                if (!isNaN(val) && val > 0) {
                    totalFilled = totalFilled + val;
                }
            }
        });
        return Math.max(0, 100 - totalFilled);
    }

    private triggerChange(): void {
        var widths: (number | null)[] = this.rows.map((row: ColumnWidthRow) =>
            row.width ? parseFloat(row.width) : null
        );
        this.onChange(widths);
    }

    private calculateHeight(rowCount: number): number {
        var baseHeight: number = 58;  // Header + padding
        var rowHeight: number = 42;
        return baseHeight + (rowCount * rowHeight);
    }
}
