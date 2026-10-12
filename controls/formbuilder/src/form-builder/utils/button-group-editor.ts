import { L10n, createElement } from '@syncfusion/ej2-base';
import { Grid } from '@syncfusion/ej2-grids';
import { Button, CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { TextBox, ChangeEventArgs as TextBoxChangeArgs, ChangeEventArgs as CheckBoxChangeArgs } from '@syncfusion/ej2-inputs';

/** @private */
export interface ButtonGroupItem {
    label: string;
    type?: 'button' | 'submit' | 'reset';
    style?: 'primary' | 'flat' | 'information' | 'error' | 'success' | 'warning';
    iconCss?: string;
    iconPosition?: 'Left' | 'Right';
    disabled?: boolean;
}

/** @private */
export interface ButtonGroupEditorOptions {
    host: HTMLElement;
    buttons: ButtonGroupItem[];
    l10n: L10n;
    onChange: (value: ButtonGroupItem[]) => void;
    enableRtl?: boolean;
}

/** @private */
interface ButtonRow {
    id: number;
    index: number;
    label: string;
    type: 'button' | 'submit' | 'reset';
    style: 'primary' | 'flat' | 'information' | 'error' | 'success' | 'warning';
    iconCss: string;
    iconPosition: 'Left' | 'Right';
    disabled: boolean;
}

/** @private */
const BUTTON_TYPES: Array<'button' | 'submit' | 'reset'> = ['button', 'submit', 'reset'];
/** @private */
const BUTTON_STYLES: Array<'primary' | 'flat' | 'information' | 'error' | 'success' | 'warning'> = ['primary', 'flat', 'information', 'error', 'success', 'warning'];
/** @private */
const ICON_POSITIONS: Array<'Left' | 'Right'> = ['Left', 'Right'];

/** @private */
export class ButtonGroupEditor {
    private host: HTMLElement;
    private buttons: ButtonGroupItem[];
    private l10n: L10n;
    private onChange: (value: ButtonGroupItem[]) => void;
    private rows: ButtonRow[];
    private nextId: number;
    private grid: Grid | null;
    private destroyed: boolean;
    private gridHost: HTMLElement | null;
    private addButton: Button | null;
    private addButtonListener: ((event: Event) => void) | null;
    private templateId: string;
    private textBoxInstances: Map<string, TextBox>;
    private dropDownInstances: Map<string, DropDownList>;
    private checkBoxInstances: Map<string, CheckBox>;
    private textBoxKeydownListeners: Map<string, { element: HTMLElement; handler: (event: Event) => void }>;
    private deleteButtonKeydownListeners: Map<number, { element: HTMLButtonElement; handler: (event: Event) => void }>;
    private props: ButtonGroupEditorOptions;
    constructor(opts: ButtonGroupEditorOptions) {
        this.host = opts.host;
        this.props = opts;
        this.buttons = Array.isArray(opts.buttons) ? opts.buttons.slice() : [];
        this.l10n = opts.l10n;
        this.onChange = opts.onChange;
        this.rows = this.normalizeRows(this.buttons);
        this.nextId = this.rows.reduce((max: number, row: ButtonRow) => Math.max(max, row.id + 1), 0);
        this.grid = null;
        this.destroyed = false;
        this.gridHost = null;
        this.addButton = null;
        this.addButtonListener = null;
        this.templateId = '';
        this.textBoxInstances = new Map();
        this.dropDownInstances = new Map();
        this.checkBoxInstances = new Map();
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

        const rowTemplateId: string = `button-row-template-${Date.now()}`;
        this.templateId = rowTemplateId;
        const templateElement: HTMLElement = createElement('script', {
            id: rowTemplateId
        });
        (templateElement as any).type = 'text/x-template';
        templateElement.innerHTML = `<tr>
            <td class="e-rowcell e-templatecell">
              <input type="text" class="e-input label-input" data-id="\${id}" value="\${label}" placeholder="Enter button label" />
            </td>
            <td class="e-rowcell e-templatecell">
              <input type="text" class="e-input type-input" data-id="\${id}" value="\${type}" placeholder="Button type" />
            </td>
            <td class="e-rowcell e-templatecell">
              <input type="text" class="style-input" data-id="\${id}" value="\${style}" placeholder="Button style" />
            </td>
            <td class="e-rowcell e-templatecell">
              <input type="text" class="e-input icon-css-input" data-id="\${id}" value="\${iconCss}" placeholder="e.g., e-icon-close" />
            </td>
            <td class="e-rowcell e-templatecell">
              <input type="text" class="e-input icon-position-input" data-id="\${id}" value="\${iconPosition}" placeholder="Left" />
            </td>
            <td class="e-rowcell e-templatecell">
              <input type="checkbox" class="disabled-check" data-id="\${id}" />
            </td>
            <td class="e-rowcell e-templatecell">
                <button type="button" class="e-btn e-flat delete-btn" data-id="\${id}" title="Delete this button" aria-label="Delete this button">
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
            dataSource: this.rows.slice(),
            enableRtl: this.props.enableRtl,
            allowPaging: false,
            height: height,
            cssClass: cssClass,
            allowSelection: false,
            rowTemplate: `#${rowTemplateId}`,
             columns: [
                { field: 'label', headerText: this.l10n.getConstant('buttonLabel') || 'Button Label', width: '150px', allowSorting: false },
                { field: 'type', headerText: this.l10n.getConstant('buttonType') || 'Button Type', width: '120px', allowSorting: false },
                { field: 'style', headerText: this.l10n.getConstant('buttonStyle') || 'Button Style', width: '120px', allowSorting: false },
                { field: 'iconCss', headerText: this.l10n.getConstant('iconCss') || 'Icon CSS', width: '130px', allowSorting: false },
                { field: 'iconPosition', headerText: this.l10n.getConstant('iconPosition') || 'Icon Position', width: '110px', allowSorting: false },
                { field: 'disabled', headerText: this.l10n.getConstant('disabled') || 'Disabled', width: '80px', textAlign: 'Center', allowSorting: false },
                { headerText: this.l10n.getConstant('action') || 'Action', width: '80px', textAlign: 'Center', allowSorting: false }
            ],
            dataBound: () => this.onGridDataBound(rowTemplateId)
        });
        this.grid.appendTo(this.gridHost);
        try {
            this.grid.hideSpinner();
        } catch { /* best-effort */ }

        const actions: HTMLElement = createElement('div', {
            className: 'options-actions'
        });
        actions.style.marginTop = '12px';

        const addButtonHost: HTMLElement = document.createElement('button');
        addButtonHost.id = 'add-button-btn';
        actions.appendChild(addButtonHost);
        this.host.appendChild(actions);

        this.addButton = new Button({
            enableRtl: this.props.enableRtl,
            content: this.l10n.getConstant('addButton') || 'Add Button',
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

        try {
            this.grid.hideSpinner();
        } catch { /* best-effort */ }

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
                change: (args: TextBoxChangeArgs) => this.handleLabelChange(id, String(args.value || ''))
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

        const typeInputs: NodeListOf<Element> = contentTable.querySelectorAll('.type-input');
        typeInputs.forEach((input: Element) => {
            const inputElement = input as HTMLInputElement;
            const id: number = parseInt(inputElement.getAttribute('data-id') || '0', 10);
            const dropDownList: DropDownList = new DropDownList({
                enableRtl: this.props.enableRtl,
                dataSource: BUTTON_TYPES.slice(),
                value: inputElement.value || 'button',
                change: (args: any) => this.handleTypeChange(id, args.value || 'button')
            });
            dropDownList.appendTo(input as HTMLElement);
            this.dropDownInstances.set(`type-${id}`, dropDownList);
        });

        const styleInputs: NodeListOf<Element> = contentTable.querySelectorAll('.style-input');
        styleInputs.forEach((input: Element) => {
            const inputElement = input as HTMLInputElement;
            const id: number = parseInt(inputElement.getAttribute('data-id') || '0', 10);
            const dropDownList: DropDownList = new DropDownList({
                enableRtl: this.props.enableRtl,
                dataSource: BUTTON_STYLES.slice(),
                value: inputElement.value || 'primary',
                change: (args: any) => this.handleStyleChange(id, args.value || 'primary')
            });
            dropDownList.appendTo(input as HTMLElement);
            this.dropDownInstances.set(`style-${id}`, dropDownList);
        });

        const iconCssInputs: NodeListOf<Element> = contentTable.querySelectorAll('.icon-css-input');
        iconCssInputs.forEach((input: Element) => {
            const inputElement = input as HTMLInputElement;
            const id: number = parseInt(inputElement.getAttribute('data-id') || '0', 10);
            const textBox: TextBox = new TextBox({
                enableRtl: this.props.enableRtl,
                value: inputElement.value,
                placeholder: inputElement.placeholder,
                change: (args: TextBoxChangeArgs) => this.handleIconCssChange(id, String(args.value || ''))
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
                this.textBoxKeydownListeners.set(`icon-css-${id}`, {
                    element: textBox.element,
                    handler: keydownHandler
                });
            }
            this.textBoxInstances.set(`icon-css-${id}`, textBox);
        });

        const iconPositionInputs: NodeListOf<Element> = contentTable.querySelectorAll('.icon-position-input');
        iconPositionInputs.forEach((input: Element) => {
            const inputElement = input as HTMLInputElement;
            const id: number = parseInt(inputElement.getAttribute('data-id') || '0', 10);
            const dropDownList: DropDownList = new DropDownList({
                enableRtl: this.props.enableRtl,
                dataSource: ICON_POSITIONS.slice(),
                value: inputElement.value || 'Left',
                change: (args: any) => this.handleIconPositionChange(id, args.value || 'Left')
            });
            dropDownList.appendTo(input as HTMLElement);
            this.dropDownInstances.set(`icon-position-${id}`, dropDownList);
        });

        const disabledChecks: NodeListOf<Element> = contentTable.querySelectorAll('.disabled-check');
        disabledChecks.forEach((input: Element) => {
            const inputElement = input as HTMLInputElement;
            const id: number = parseInt(inputElement.getAttribute('data-id') || '0', 10);
            const currentRow: ButtonRow | undefined = this.rows.find((row: ButtonRow) => row.id === id);
            const checkBox: CheckBox = new CheckBox({
                enableRtl: this.props.enableRtl,
                checked: !!(currentRow && currentRow.disabled),
                change: (args: any) => {
                    this.handleDisabledChange(id, !!args.checked);
                }
            });
            checkBox.appendTo(input as HTMLElement);
            this.checkBoxInstances.set(`disabled-${id}`, checkBox);
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

    private clearListeners(): void {
        if (this.addButton && this.addButton.element && this.addButtonListener) {
            try {
                this.addButton.element.onclick = null;
                this.addButton.element.removeEventListener('click', this.addButtonListener);
                this.addButtonListener = null;
                this.addButton.destroy();
            } catch { /* best-effort */ }
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
            try { textBox.destroy(); } catch { /* best-effort */ }
        });
        this.textBoxInstances.clear();

        this.dropDownInstances.forEach((dropDownList: DropDownList) => {
            try { dropDownList.destroy(); } catch { /* best-effort */ }
        });
        this.dropDownInstances.clear();

        this.checkBoxInstances.forEach((checkBox: CheckBox) => {
            try { checkBox.destroy(); } catch { /* best-effort */ }
        });
        this.checkBoxInstances.clear();

        if (this.templateId) {
            const templateElement: Element | null = document.getElementById(this.templateId);
            if (templateElement && templateElement.parentElement) {
                templateElement.parentElement.removeChild(templateElement);
            }
        }
    }

    private normalizeRows(buttons: ButtonGroupItem[]): ButtonRow[] {
        if (!Array.isArray(buttons) || buttons.length === 0) {
            return [];
        }

        return buttons.map((button: ButtonGroupItem, idx: number) => {
            const buttonType: 'button' | 'submit' | 'reset' = (button && (button as any).type) || (button && (button as any).buttonType) || 'button';
            const buttonStyle: 'primary' | 'flat' | 'information' | 'error' | 'success' | 'warning' = (button && button.style) || 'primary';
            const iconPosition: 'Left' | 'Right' = (button && button.iconPosition) || 'Left';
            return {
                id: idx,
                index: idx + 1,
                label: (button && button.label) || '',
                type: buttonType,
                style: buttonStyle,
                iconCss: (button && button.iconCss) || '',
                iconPosition: iconPosition,
                disabled: !!(button && button.disabled)
            };
        });
    }

    private updateButtons(newRows: ButtonRow[]): void {
        const updatedButtons: ButtonGroupItem[] = newRows.map((row: ButtonRow) => ({
            label: row.label || '',
            type: row.type || 'button',
            style: row.style || 'primary',
            iconCss: row.iconCss || '',
            iconPosition: row.iconPosition || 'Left',
            disabled: !!row.disabled
        }));

        this.rows = newRows;
        this.buttons = updatedButtons.slice();
        this.onChange(updatedButtons.slice());

        if (this.grid) {
            this.grid.dataSource = this.rows.slice();
            this.grid.height = this.rows.length >= 3 ? 184 : this.rows.length === 2 ? 126 : this.rows.length <= 1 ? 68 : 184;
            this.grid.cssClass = this.rows.length > 3 ? 'options-grid' : 'options-grid no-scroll';
        }
    }

    private handleAddRow(): void {
        const newId: number = this.nextId++;
        const newIndex: number = this.rows.length + 1;
        const newRow: ButtonRow = {
            id: newId,
            index: newIndex,
            label: `Button ${newIndex}`,
            type: 'button',
            style: 'primary',
            iconCss: '',
            iconPosition: 'Left',
            disabled: false
        };
        const newRows: ButtonRow[] = this.rows.concat(newRow);
        this.updateButtons(newRows);
    }

    private handleDeleteRow(id: number): void {
        const newRows: ButtonRow[] = this.rows.filter((row: ButtonRow) => row.id !== id).map((row: ButtonRow, idx: number) => ({
            ...row,
            index: idx + 1
        }));
        this.updateButtons(newRows);
    }

    private handleLabelChange(id: number, newLabel: string): void {
        const currentRow: ButtonRow | undefined = this.rows.find((row: ButtonRow) => row.id === id);
        if (currentRow && currentRow.label === newLabel) {
            return;
        }
        const newRows: ButtonRow[] = this.rows.map((row: ButtonRow) => row.id === id ? { ...row, label: newLabel } : row);
        this.updateButtons(newRows);
    }

    private handleTypeChange(id: number, newType: 'button' | 'submit' | 'reset'): void {
        const currentRow: ButtonRow | undefined = this.rows.find((row: ButtonRow) => row.id === id);
        if (currentRow && currentRow.type === newType) {
            return;
        }
        const newRows: ButtonRow[] = this.rows.map((row: ButtonRow) => row.id === id ? { ...row, type: newType } : row);
        this.updateButtons(newRows);
    }

    private handleStyleChange(id: number, newStyle: 'primary' | 'flat' | 'information' | 'error' | 'success' | 'warning'): void {
        const currentRow: ButtonRow | undefined = this.rows.find((row: ButtonRow) => row.id === id);
        if (currentRow && currentRow.style === newStyle) {
            return;
        }
        const newRows: ButtonRow[] = this.rows.map((row: ButtonRow) => row.id === id ? { ...row, style: newStyle } : row);
        this.updateButtons(newRows);
    }

    private handleIconCssChange(id: number, newIconCss: string): void {
        const currentRow: ButtonRow | undefined = this.rows.find((row: ButtonRow) => row.id === id);
        if (currentRow && currentRow.iconCss === newIconCss) {
            return;
        }
        const newRows: ButtonRow[] = this.rows.map((row: ButtonRow) => row.id === id ? { ...row, iconCss: newIconCss } : row);
        this.updateButtons(newRows);
    }

    private handleIconPositionChange(id: number, newPosition: 'Left' | 'Right'): void {
        const currentRow: ButtonRow | undefined = this.rows.find((row: ButtonRow) => row.id === id);
        if (currentRow && currentRow.iconPosition === newPosition) {
            return;
        }
        const newRows: ButtonRow[] = this.rows.map((row: ButtonRow) => row.id === id ? { ...row, iconPosition: newPosition } : row);
        this.updateButtons(newRows);
    }

    private handleDisabledChange(id: number, isDisabled: boolean): void {
        const currentRow: ButtonRow | undefined = this.rows.find((row: ButtonRow) => row.id === id);
        if (currentRow && currentRow.disabled === isDisabled) {
            return;
        }
        const newRows: ButtonRow[] = this.rows.map((row: ButtonRow) => row.id === id ? { ...row, disabled: isDisabled } : row);
        this.updateButtons(newRows);
    }
}
