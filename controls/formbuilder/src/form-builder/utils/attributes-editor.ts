import { L10n, createElement } from '@syncfusion/ej2-base';
import { Grid } from '@syncfusion/ej2-grids';
import { TextBox, ChangedEventArgs } from '@syncfusion/ej2-inputs';
import { Button } from '@syncfusion/ej2-buttons';

/** @private */
export interface AttributeModel {
    key: string;
    value: string;
}

/** @private */
export interface AttributesEditorOptions {
    host: HTMLElement;
    attributes: AttributeModel[];
    l10n: L10n;
    onChange: (value: AttributeModel[]) => void;
    enableRtl?: boolean;
}

/** @private */
interface AttributeRow {
    id: number;
    index: number;
    attrKey: string;
    value: string;
}

/** @private */
export class AttributesEditor {
    private host: HTMLElement;
    private attributes: AttributeModel[];
    private l10n: L10n;
    private onChange: (value: AttributeModel[]) => void;
    private rows: AttributeRow[];
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
    private props: AttributesEditorOptions;

    constructor(opts: AttributesEditorOptions) {
        this.host = opts.host;
        this.attributes = Array.isArray(opts.attributes) ? opts.attributes.slice() : [];
        this.l10n = opts.l10n;
        this.props = opts;
        this.onChange = opts.onChange;
        this.rows = this.normalizeRows(this.attributes);
        this.nextId = this.rows.reduce((max: number, row: AttributeRow) => Math.max(max, row.id + 1), 0);
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
              <input type="text" class="e-input key-input" data-id="\${id}" value="\${attrKey}" placeholder="e.g., data-test, aria-label" />
            </td>
            <td class="e-rowcell e-templatecell">
                <input type="text" class="e-input value-input" data-id="\${id}" value="\${value}" placeholder="e.g., value for the attribute" />
            </td>
            <td class="e-rowcell e-templatecell">
                <button type="button" class="e-btn e-flat delete-btn" data-id="\${id}" title="Delete this attribute" aria-label="Delete this attribute">
                    <span class="e-icons e-trash"></span>
                </button>
            </td>
        </tr>`;
        document.body.appendChild(templateElement);

        this.gridHost = createElement('div', {
            className: 'options-editor-grid'
        });
        this.host.appendChild(this.gridHost);

        const height: number = this.rows.length >= 3 ? 184 : this.rows.length === 2 ? 126 : this.rows.length <= 1 ? 68 : 184;
        const cssClass: string = this.rows.length > 3 ? 'options-grid' : 'options-grid no-scroll';

        this.grid = new Grid({
            enableRtl: this.props.enableRtl,
            dataSource: this.rows.slice(),
            allowPaging: false,
            height: height,
            cssClass: cssClass,
            allowSelection: false,
            rowTemplate: `#${rowTemplateId}`,
            columns: [
                { field: 'attrKey', headerText: this.l10n.getConstant('attributeName') || 'Attribute Name', width: '200px' },
                { field: 'value', headerText: this.l10n.getConstant('attributeValue') || 'Attribute Value', width: '200px' },
                { headerText: this.l10n.getConstant('action') || 'Action', width: '80', textAlign: 'Right' }
            ],
            dataBound: () => this.onGridDataBound(rowTemplateId)
        });
        this.grid.appendTo(this.gridHost);

        const actions: HTMLElement = createElement('div', {
            className: 'options-actions'
        });
        actions.style.marginTop = '12px';
        const addButtonHost: HTMLElement = document.createElement('button');
        addButtonHost.id = 'add-attribute-btn';
        actions.appendChild(addButtonHost);
        this.host.appendChild(actions);
        
        this.addButton = new Button({
            enableRtl: this.props.enableRtl,
            content: this.l10n.getConstant('addAttribute') || 'Add attribute',
            cssClass: 'e-outlined'
        });
        this.addButton.appendTo(addButtonHost);
        this.addButtonListener = this.handleAddRow.bind(this);
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

        const keyInputs: NodeListOf<Element> = contentTable.querySelectorAll('.key-input');
        keyInputs.forEach((input: Element) => {
            const inputElement = input as HTMLInputElement;
            const id: number = parseInt(inputElement.getAttribute('data-id') || '0', 10);
            
            const textBox: TextBox = new TextBox({
                enableRtl: this.props.enableRtl,
                value: inputElement.value,
                placeholder: inputElement.placeholder,
                change: (args: ChangedEventArgs) => {
                    this.handleKeyChange(id, args.value || '');
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
                this.textBoxKeydownListeners.set(`key-${id}`, {
                    element: textBox.element,
                    handler: keydownHandler
                });
            }
            
            this.textBoxInstances.set(`key-${id}`, textBox);
        });

        const valueInputs: NodeListOf<Element> = contentTable.querySelectorAll('.value-input');
        valueInputs.forEach((input: Element) => {
            const inputElement = input as HTMLInputElement;
            const id: number = parseInt(inputElement.getAttribute('data-id') || '0', 10);
            
            const textBox: TextBox = new TextBox({
                enableRtl: this.props.enableRtl,
                value: inputElement.value,
                placeholder: inputElement.placeholder,
                change: (args: ChangedEventArgs) => {
                    this.handleValueChange(id, args.value || '');
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
                this.textBoxKeydownListeners.set(`value-${id}`, {
                    element: textBox.element,
                    handler: keydownHandler
                });
            }
            
            this.textBoxInstances.set(`value-${id}`, textBox);
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

    public destroy(): void {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        this.clearListeners();
        if (this.grid) {
            try { this.grid.destroy(); } catch { /* ignore */ }
            this.grid = null;
        }
        this.host.innerHTML = '';
        this.gridHost = null;
        this.addButton = null;
        this.addButtonListener = null;
    }

    private clearListeners(): void {
        if (this.addButton && this.addButton.element && this.addButtonListener) {
            try {
                this.addButton.element.onclick = null;
                this.addButton.element.removeEventListener('click', this.addButtonListener);
                this.addButtonListener = null;
                this.addButton.destroy();
            } catch { /* ignore */ }
        }

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
            } catch { /* ignore */ }
        });
        this.textBoxInstances.clear();

        if (this.templateId) {
            const templateElement: Element | null = document.getElementById(this.templateId);
            if (templateElement && templateElement.parentElement) {
                templateElement.parentElement.removeChild(templateElement);
            }
        }
    }

    private normalizeRows(attributes: AttributeModel[]): AttributeRow[] {
        if (!Array.isArray(attributes) || attributes.length === 0) {
            return [];
        }

        return attributes.map((attribute: AttributeModel, idx: number) => ({
            id: idx,
            index: idx + 1,
            attrKey: attribute && attribute.key ? attribute.key : '',
            value: attribute && attribute.value ? attribute.value : ''
        }));
    }

    private updateAttributes(newRows: AttributeRow[]): void {
        const updatedAttributes: AttributeModel[] = newRows.map((row: AttributeRow) => ({
            key: row.attrKey || '',
            value: row.value || ''
        }));
        this.rows = newRows;
        this.attributes = updatedAttributes.slice();
        this.onChange(updatedAttributes.slice());

        if (this.grid) {
            this.grid.dataSource = this.rows.slice();
            this.grid.height = this.rows.length >= 3 ? 184 : this.rows.length === 2 ? 126 : this.rows.length <= 1 ? 68 : 184;
            this.grid.cssClass = this.rows.length > 3 ? 'options-grid' : 'options-grid no-scroll';
        }
    }

    private handleAddRow(): void {
        const newId: number = this.nextId++;
        const newIndex: number = this.rows.length + 1;
        const newRow: AttributeRow = {
            id: newId,
            index: newIndex,
            attrKey: '',
            value: ''
        };
        const newRows: AttributeRow[] = this.rows.concat(newRow);
        this.updateAttributes(newRows);
    }

    private handleDeleteRow(id: number): void {
        const newRows: AttributeRow[] = this.rows.filter((row: AttributeRow) => row.id !== id).map((row: AttributeRow, idx: number) => ({
            ...row,
            index: idx + 1
        }));
        this.updateAttributes(newRows);
    }

    private handleKeyChange(id: number, newKey: string): void {
        const currentRow: AttributeRow | undefined = this.rows.find((row: AttributeRow) => row.id === id);
        if (currentRow && currentRow.attrKey === newKey) {
            return;
        }
        const newRows: AttributeRow[] = this.rows.map((row: AttributeRow) => row.id === id ? {
            ...row,
            attrKey: newKey
        } : row);
        this.updateAttributes(newRows);
    }

    private handleValueChange(id: number, newValue: string): void {
        const currentRow: AttributeRow | undefined = this.rows.find((row: AttributeRow) => row.id === id);
        if (currentRow && currentRow.value === newValue) {
            return;
        }
        const newRows: AttributeRow[] = this.rows.map((row: AttributeRow) => row.id === id ? {
            ...row,
            value: newValue
        } : row);
        this.updateAttributes(newRows);
    }
}
