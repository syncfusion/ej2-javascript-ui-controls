import { L10n, createElement } from '@syncfusion/ej2-base';
import { Grid, Page } from '@syncfusion/ej2-grids';
import { TextBox, ChangedEventArgs } from '@syncfusion/ej2-inputs';
import { Button } from '@syncfusion/ej2-buttons';

Grid.Inject(Page);

/** @private */
export interface OptionsEditorOptions {
    host: HTMLElement;
    options: string[];
    type?: string;
    l10n: L10n;
    onChange: (value: string[]) => void;
    enableRtl?: boolean;
}

/** @private */
interface OptionRow {
    id: number;
    index: number;
    label: string;
}

/** @private */
export class OptionsEditor {

    private host: HTMLElement;
    private props: OptionsEditorOptions;
    private options: string[];
    private l10n: L10n;
    private onChange: (value: string[]) => void;
    private rows: OptionRow[];
    private nextId: number;
    private grid: Grid | null;
    private destroyed: boolean;
    private gridHost: HTMLElement | null;
    private addButton: Button | null;
    private addButtonListener: ((event: Event) => void) | null;
    private templateId: string;
    private textBoxInstances: Map<string, TextBox>;
    private textBoxKeydownListeners: Map<string, { element: HTMLElement; handler: (event: Event) => void }>;
    private deleteButtonKeydownListeners: Map<number, { element: HTMLButtonElement; handler: (event: Event) => void }>;
    private type: string;

    constructor(opts: OptionsEditorOptions) {
        this.host = opts.host;
        this.props = opts;
        this.options = Array.isArray(opts.options) ? opts.options.slice() : [];
        this.l10n = opts.l10n;
        this.onChange = opts.onChange;
        this.type = opts.type || 'options';
        this.rows = this.normalizeRows(this.options);
        this.nextId = this.rows.reduce((max: number, row: OptionRow) => Math.max(max, row.id + 1), 0);
        this.grid = null;
        this.destroyed = false;
        this.gridHost = null;
        this.addButton = null;
        this.addButtonListener = null;
        this.templateId = '';
        this.textBoxInstances = new Map();
        this.textBoxKeydownListeners = new Map();
        this.deleteButtonKeydownListeners = new Map();
    }

    /** @private */
    public render(): void {
        if (this.destroyed) {
            return;
        }

        this.clearListeners();
        this.host.innerHTML = '';

        const rowTemplateId: string = `row-template-${Date.now()}`;
        this.templateId = rowTemplateId;
        const templateElement: HTMLElement = createElement('script', {
            id: rowTemplateId
        });
        (templateElement as any).type = 'text/x-template';
        templateElement.innerHTML = `<tr>
            <td class="e-rowcell e-templatecell">
                <input type="text" class="e-input label-input" data-id="\${id}" value="\${label}" placeholder="${this.type === 'tabs' ? 'Enter tab label' : 'Enter option label'}" />
            </td>
            <td class="e-rowcell e-templatecell">
                <button type="button" class="e-btn e-flat delete-btn" data-id="\${id}" title="Delete this option" aria-label="Delete this option">
                    <span class="e-btn-icon e-icons e-trash"></span>
                </button>
            </td>
        </tr>`;
        document.body.appendChild(templateElement);

        this.gridHost = createElement('div', {
            className: 'options-editor-grid'
        });
        this.host.appendChild(this.gridHost);

        const height: number = this.rows.length >= 3 ? 167 : this.rows.length === 2 ? 112 : this.rows.length <= 1 ? 56 : 167;
        const cssClass: string = this.rows.length > 2 ? 'options-grid' : 'options-grid no-scroll';
        this.grid = new Grid({
            dataSource: this.rows.slice(),
            enableRtl: this.props.enableRtl,
            allowPaging: false,
            height: height,
            cssClass: cssClass,
            allowSelection: false,
            rowTemplate: `#${rowTemplateId}`,
            columns: [
                { field: 'label', headerText: this.type === 'tabs' ? (this.l10n.getConstant('tabLabel') || 'Tab Label') : (this.l10n.getConstant('optionLabel') || 'Option Label'), width: 'auto', allowSorting: false },
                { headerText: this.l10n.getConstant('action') || 'Action', width: '80', textAlign: 'Center', allowSorting: false }
            ],
            dataBound: () => this.onGridDataBound(rowTemplateId)
        });
        this.grid.appendTo(this.gridHost);

        const actions: HTMLElement = createElement('div', {
            className: 'options-actions'
        });
        actions.style.marginTop = '12px';
        const addButtonHost: HTMLElement = document.createElement('button');
        addButtonHost.id = 'add-option-btn';
        actions.appendChild(addButtonHost);
        this.host.appendChild(actions);

        this.addButton = new Button({
            enableRtl: this.props.enableRtl,
            content: this.type === 'tabs'
                ? (this.l10n.getConstant('addNewTab') || '+ Add New Tab')
                : (this.l10n.getConstant('addNewOption') || '+ Add New Option'),
            cssClass: 'e-outlined'
        });
        this.addButton.appendTo(addButtonHost);
        this.addButtonListener = () => this.handleAddRow();
        this.addButton.element.onclick = this.addButtonListener;
    }

    private onGridDataBound(templateId: string): void {
        if (!this.grid) {
            return;
        }

        const contentTable: Element | null = this.grid.getContentTable();
        if (!contentTable) {
            return;
        }

        const labelInputs: NodeListOf<Element> = contentTable.querySelectorAll('.label-input');
        labelInputs.forEach((input: Element) => {
            const inputElement = input as HTMLInputElement;
            const id: number = parseInt(inputElement.getAttribute('data-id') || '0', 10);
            const textBox: TextBox = new TextBox({
                enableRtl: this.props.enableRtl,
                value: inputElement.value,
                placeholder: inputElement.placeholder,
                change: (args: ChangedEventArgs) => {
                    this.handleLabelChange(id, args.value || '');
                }
            });
            textBox.appendTo(input as HTMLElement);

            if (textBox.element) {
                const keydownHandler = (event: Event) => {
                    const keyEvent = event as any;
                    if (keyEvent.ctrlKey && keyEvent.key === 'a') {
                        event.preventDefault();
                        (event.currentTarget as HTMLInputElement).select();
                    }
                };
                textBox.element.addEventListener('keydown', keydownHandler);
                this.textBoxKeydownListeners.set(`label-${id}`, {
                    element: textBox.element,
                    handler: keydownHandler
                });
            }

            this.textBoxInstances.set(`label-${id}`, textBox);
        });

        const deleteButtons: NodeListOf<Element> = contentTable.querySelectorAll('.delete-btn');
        deleteButtons.forEach((button: Element) => {
            const buttonElement = button as HTMLButtonElement;
            const id: number = parseInt(buttonElement.getAttribute('data-id') || '0', 10);
            buttonElement.onclick = () => this.handleDeleteRow(id);
            const keydownHandler = (event: Event) => {
                if ((event as any).code === 'Enter') {
                    this.handleDeleteRow(id);
                }
            };
            buttonElement.addEventListener('keydown', keydownHandler);
            this.deleteButtonKeydownListeners.set(id, {
                element: buttonElement,
                handler: keydownHandler
            });
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
            try { this.grid.destroy(); } catch { /* best-effort */ }
            this.grid = null;
        }

        this.host.innerHTML = '';
        this.gridHost = null;
        this.addButton = null;
        this.addButtonListener = null;
    }

    private clearGridWidgets(): void {
        this.textBoxKeydownListeners.forEach((entry: { element: HTMLElement; handler: (event: Event) => void }) => {
            entry.element.removeEventListener('keydown', entry.handler);
        });
        this.textBoxKeydownListeners.clear();

        this.deleteButtonKeydownListeners.forEach((entry: { element: HTMLButtonElement; handler: (event: Event) => void }) => {
            entry.element.removeEventListener('keydown', entry.handler);
            entry.element.onclick = null;
        });
        this.deleteButtonKeydownListeners.clear();

        this.textBoxInstances.forEach((textBox: TextBox) => {
            try {
                textBox.destroy();
            } catch { /* best-effort */ }
        });
        this.textBoxInstances.clear();
    }

    private clearListeners(): void {
        if (this.addButton && this.addButton.element && this.addButtonListener) {
            try {
                this.addButton.element.onclick = null;
                this.addButton.element.removeEventListener('click', this.addButtonListener);
                this.addButtonListener = null;
                this.addButton.destroy();
            } catch { /* best-effort */ }
        }

        this.clearGridWidgets();

        if (this.templateId) {
            const templateElement: Element | null = document.getElementById(this.templateId);
            if (templateElement && templateElement.parentElement) {
                templateElement.parentElement.removeChild(templateElement);
            }
        }
    }

    private normalizeRows(options: string[]): OptionRow[] {
        if (!Array.isArray(options) || options.length === 0) {
            return [];
        }

        return options.map((option: string, idx: number) => ({
            id: idx,
            index: idx + 1,
            label: this.l10n.getConstant(option) || option
        }));
    }

    private updateOptions(newRows: OptionRow[]): void {
        const updatedOptions: string[] = newRows.map((row: OptionRow) => row.label || '');
        this.rows = newRows;
        this.options = updatedOptions.slice();
        this.onChange(updatedOptions.slice());

        if (this.grid) {
            this.clearGridWidgets();
            this.grid.dataSource = this.rows.slice();
            this.grid.height = this.rows.length >= 3 ? 167 : this.rows.length === 2 ? 112 : this.rows.length <= 1 ? 56 : 167;
            this.grid.cssClass = this.rows.length > 3 ? 'options-grid' : 'options-grid no-scroll';
        }
    }

    private handleAddRow(): void {
        const newId: number = this.nextId++;
        const newIndex: number = this.rows.length + 1;
        const defaultLabel: string = this.type === 'tabs'
            ? `${this.l10n.getConstant('tab') || 'Tab'} ${newIndex}`
            : `${this.l10n.getConstant('option') || 'Option'} ${newIndex}`;
        const newRow: OptionRow = {
            id: newId,
            index: newIndex,
            label: defaultLabel
        };
        const newRows: OptionRow[] = this.rows.concat(newRow);
        this.updateOptions(newRows);
    }

    private handleDeleteRow(id: number): void {
        const newRows: OptionRow[] = this.rows.filter((row: OptionRow) => row.id !== id).map((row: OptionRow, idx: number) => ({
            ...row,
            index: idx + 1
        }));
        this.updateOptions(newRows);
    }

    private handleLabelChange(id: number, newLabel: string): void {
        const currentRow: OptionRow | undefined = this.rows.find((row: OptionRow) => row.id === id);
        if (currentRow && currentRow.label === newLabel) {
            return;
        }
        const newRows: OptionRow[] = this.rows.map((row: OptionRow) => row.id === id ? {
            ...row,
            label: newLabel
        } : row);
        this.updateOptions(newRows);
    }
}
