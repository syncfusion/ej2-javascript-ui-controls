import { Spreadsheet } from '../base/index';
import { DialogBeforeOpenEventArgs } from '../common/interface';
import { FormControlModel, ExtendedSheet, SheetModel, addDPRValue, getCellAddress, getRangeIndexes, importModelUpdate, isLocked, getColumn } from '../../workbook/index';
import { activeSheetChanged, cMenuBeforeOpen, cellSave, contentLoaded, dialog, getColIdxFromClientX, getRowIdxFromClientY, insertFormControl, locale, virtualContentLoaded, getCellPosition, updateUndoRedoCollection, formControlUndoRedo, editAlert } from '../common/index';
import { CheckBox, ChangeEventArgs as CBChangeArgs } from '@syncfusion/ej2-buttons';
import { RadioButton, ChangeEventArgs as RBChangeArgs } from '@syncfusion/ej2-buttons';
import { DropDownList, ChangeEventArgs as DDLChangeArgs } from '@syncfusion/ej2-dropdowns';
import { getUniqueID, L10n } from '@syncfusion/ej2-base';
import { Dialog as DialogService } from '../services/index';
import { MenuItemModel } from '@syncfusion/ej2-navigations';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { FormControlType, ExtendedFormControl } from '../../workbook/index';

const FC_MIN_W: number = 20;
const FC_MIN_H: number = 14;
const FC_CLASS: string = 'e-ss-form-control';
const FC_SEL_CLASS: string = 'e-ss-fc-selected';

const HANDLE_DIRECTIONS: ReadonlyArray<string> = [
    'top-left',
    'top',
    'top-right',
    'right',
    'bottom-right',
    'bottom',
    'bottom-left',
    'left'
];

export class SpreadsheetFormControl {
    private parent: Spreadsheet;
    private formControls: Map<string, FormControlModel> = new Map();
    private ejComponents: Map<string, CheckBox | RadioButton | DropDownList> = new Map();
    private selectedControl: string | null = null;
    private clipboardFormControl: ExtendedFormControl | null = null;
    private clipboardMode: 'copy' | 'cut' | null = null;
    private _refreshPending: boolean = false;
    private _isUndoRedo: boolean = false;
    private _contextMenuFc: FormControlModel | null = null;
    private _fcMenuActive: boolean = false;
    private drag: {
        element: HTMLElement; fc: FormControlModel;
        startX: number; startY: number; origLeft: number; origTop: number;
    } | null = null;
    private resize: {
        element: HTMLElement; fc: FormControlModel; direction: string;
        startX: number; startY: number; origW: number; origH: number; origL: number; origT: number;
    } | null = null;
    private controlNameCounters: Map<string, number> = new Map();

    private _onDocMove: (e: MouseEvent) => void;
    private _onDocUp: (e: MouseEvent) => void;
    private _onDocClick: (e: MouseEvent) => void;
    private _onDocKey: (e: KeyboardEvent) => void;
    private _onCtxMenuItemSelect: (args: { item: { id: string }; cancel: boolean }) => void;

    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.initializeSheetCollections();
        this.addEventListener();
        this.registerDocumentHandlers();
    }

    private initializeSheetCollections(): void {
        this.parent.sheets.forEach((sheet: ExtendedSheet, sheetIndex: number): void => {
            if (!sheet.formControls) {
                sheet.formControls = [];
            }
            sheet.formControls.forEach((control: ExtendedFormControl): void => {
                this.updateControlNameCounter(control, sheetIndex);
            });
        });
    }

    private registerDocumentHandlers(): void {
        this._onDocMove = this.onDocumentMouseMove.bind(this);
        this._onDocUp = this.onDocumentMouseUp.bind(this);
        this._onDocClick = this.onDocumentClick.bind(this);
        this._onDocKey = this.onDocumentKeyDown.bind(this);
        document.addEventListener('mousemove', this._onDocMove);
        document.addEventListener('mouseup', this._onDocUp);
        document.addEventListener('click', this._onDocClick, true);
        document.addEventListener('keydown', this._onDocKey, true);
        this._onCtxMenuItemSelect = this.onContextMenuItemSelect.bind(this);
        this.parent.addEventListener('contextMenuItemSelect', this._onCtxMenuItemSelect as Function);
    }

    public getModuleName(): string {
        return 'spreadsheetFormControl';
    }

    private insertFormControl(type: FormControlType, range: string, sheetIndex?: number, formControl?: FormControlModel): string {
        const idx: number = (sheetIndex !== undefined && sheetIndex !== null) ? sheetIndex : this.parent.activeSheetIndex;
        const sheet: ExtendedSheet = this.parent.sheets[idx as number] as ExtendedSheet;
        if (!sheet || ['CheckBox', 'RadioButton', 'DropDown'].indexOf(type) === -1) {
            return '';
        }
        let top: number;
        let left: number;
        let rowIndex: number;
        let colIndex: number;
        if (formControl) {
            top = formControl.top === undefined ? 0 : formControl.top;
            left = formControl.left === undefined ? 0 : formControl.left;
            if (typeof top !== 'number' || typeof left !== 'number' || !isFinite(top) || !isFinite(left) || top < 0 || left < 0) {
                return '';
            }
            if (idx === this.parent.activeSheetIndex) {
                const rowArgs: { clientY: number; isImage: boolean } = { clientY: top, isImage: true };
                const colArgs: { clientX: number; isImage: boolean } = { clientX: left, isImage: true };
                this.parent.notify(getRowIdxFromClientY, rowArgs);
                this.parent.notify(getColIdxFromClientX, colArgs);
                rowIndex = rowArgs.clientY;
                colIndex = colArgs.clientX;
            } else {
                rowIndex = 0;
                colIndex = 0;
            }
        } else {
            if (!range) {
                return '';
            }
            const indexes: number[] = getRangeIndexes(range);
            rowIndex = indexes[0];
            colIndex = indexes[1];
            if (!Number.isInteger(rowIndex) || !Number.isInteger(colIndex) || rowIndex < 0 || colIndex < 0 ||
                rowIndex >= sheet.rowCount || colIndex >= sheet.colCount) {
                return '';
            }
            const position: { top: number; left: number } = this.calcPosition(sheet as SheetModel, indexes);
            top = position.top;
            left = position.left;
        }
        const id: string = this.generateId(type, idx);
        const size: { width: number; height: number } = this.defaultSize(type);
        const defaults: object = this.defaultProps(type, idx);
        const fc: ExtendedFormControl = Object.assign(
            {
                id,
                type,
                sheetIndex: idx,
                top,
                left,
                width: size.width,
                height: size.height,
                rowIndex,
                colIndex,
                cellLink: ''
            },
            defaults,
            formControl || {},
            {
                id,
                type,
                sheetIndex: idx,
                top,
                left,
                rowIndex,
                colIndex
            }
        ) as ExtendedFormControl;
        if (typeof fc.width !== 'number' || !isFinite(fc.width) || fc.width < FC_MIN_W) {
            fc.width = size.width;
        }
        if (typeof fc.height !== 'number' || !isFinite(fc.height) || fc.height < FC_MIN_H) {
            fc.height = size.height;
        }
        if (type === 'RadioButton' && sheet.formControls && (!formControl || formControl.cellLink === undefined)) {
            const linkedRadioButton: ExtendedFormControl | undefined =
                sheet.formControls.find(
                    (control: ExtendedFormControl): boolean => {
                        return control.type === 'RadioButton' && !!(control.cellLink || '').trim();
                    }
                );
            if (linkedRadioButton) {
                fc.cellLink = linkedRadioButton.cellLink;
            }
        }
        this.updateControlNameCounter(fc, idx);
        this.formControls.set(id, fc);
        if (!sheet.formControls) {
            sheet.formControls = [];
        }
        sheet.formControls.push(fc);
        if (idx === this.parent.activeSheetIndex) {
            this.renderFormControl(fc);
            this.enterDesignMode(id);
        }
        if (!this._isUndoRedo) {
            this.parent.notify(updateUndoRedoCollection, {
                args: {
                    action: 'insertFormControl',
                    eventArgs: {
                        fcId: id,
                        fcModel: this.getFormControlCopy(fc),
                        sheetIdx: idx
                    }
                }
            });
        }
        return id;
    }

    private onActiveSheetChanged(): void {
        this.exitDesignMode();
        this.scheduleRefresh();
    }

    private destroyEjComponent(id: string): void {
        const comp: CheckBox | RadioButton | DropDownList | undefined = this.ejComponents.get(id);
        if (comp) {
            if (!comp.isDestroyed) {
                comp.destroy();
            }
            this.ejComponents.delete(id);
        }
    }

    private refreshFormControls(): void {
        if (!this.parent) {
            return;
        }
        this.formControls.forEach((_fc: FormControlModel, id: string) => {
            this.destroyEjComponent(id);
            const el: HTMLElement | null = document.getElementById(id);
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        this.formControls.clear();
        const sheetIdx: number = this.parent.activeSheetIndex;
        const sheet: ExtendedSheet = this.parent.sheets[sheetIdx as number] as ExtendedSheet;
        if (!sheet || !sheet.formControls || !sheet.formControls.length) {
            return;
        }
        for (let i: number = 0; i < sheet.formControls.length; i++) {
            const fc: ExtendedFormControl = sheet.formControls[i as number];
            const rowArgs: { clientY: number; isImage: boolean } = { clientY: fc.top, isImage: true };
            const colArgs: { clientX: number; isImage: boolean } = { clientX: fc.left, isImage: true };
            this.parent.notify(getRowIdxFromClientY, rowArgs);
            this.parent.notify(getColIdxFromClientX, colArgs);
            fc.rowIndex = rowArgs.clientY;
            fc.colIndex = colArgs.clientX;
            this.formControls.set(fc.id, fc);
            this.renderFormControl(fc);
        }
    }

    private onContentLoaded(): void {
        const sheetIdx: number = this.parent.activeSheetIndex;
        const sheet: ExtendedSheet = this.parent.sheets[sheetIdx as number] as ExtendedSheet;
        if (!sheet || !sheet.formControls || !sheet.formControls.length) {
            return;
        }
        let needsRefresh: boolean = false;
        for (let i: number = 0; i < sheet.formControls.length; i++) {
            if (!document.getElementById((sheet.formControls[i as number] as ExtendedFormControl).id)) {
                needsRefresh = true;
                break;
            }
        }
        if (needsRefresh) {
            this.scheduleRefresh();
        }
    }

    private updateFormControlsFromSheet(): void {
        this.parent.sheets.forEach((sheet: ExtendedSheet, idx: number): void => {
            if (!sheet.formControls) {
                sheet.formControls = [];
                return;
            }
            sheet.formControls.forEach((fc: ExtendedFormControl): void => {
                if (!fc.id) {
                    fc.id = this.generateId(fc.type, idx);
                }
                this.updateControlNameCounter(fc, idx);
            });
        });
        this.scheduleRefresh();
    }

    private scheduleRefresh(): void {
        if (this._refreshPending) {
            return;
        }
        this._refreshPending = true;
        requestAnimationFrame((): void => {
            requestAnimationFrame((): void => {
                this._refreshPending = false;
                this.refreshFormControls();
            });
        });
    }

    private renderFormControl(fc: ExtendedFormControl): void {
        const horizontalPosition: string = this.parent.enableRtl ?
            'right:' + Number(addDPRValue(fc.left).toFixed(2)) + 'px' :
            'left:' + Number(addDPRValue(fc.left).toFixed(2)) + 'px';
        const div: HTMLElement = this.parent.createElement('div', {
            id: fc.id,
            attrs: { class: FC_CLASS, tabindex: '0', dir: this.parent.enableRtl ? 'rtl' : 'ltr' },
            styles: [
                'width:' + fc.width + 'px',
                'height:' + fc.height + 'px',
                'top:' + Number(addDPRValue(fc.top).toFixed(2)) + 'px',
                horizontalPosition
            ].join(';')
        });
        this.renderHandles(div);
        this.attachEvents(div, fc);
        const container: Element = this.parent.getMainContent();
        container.appendChild(div);
        this.renderContent(div, fc);
    }

    private renderContent(el: HTMLElement, fc: FormControlModel): void {
        const wrap: HTMLElement = this.parent.createElement('div', {
            className: 'e-ss-fc-content'
        });
        el.appendChild(wrap);
        switch (fc.type) {
        case 'CheckBox':
            this.renderCheckBox(wrap, fc);
            break;
        case 'RadioButton':
            this.renderRadioButton(wrap, fc);
            break;
        case 'DropDown':
            this.renderDropDown(wrap, fc);
            break;
        }
    }

    private renderCheckBox(wrap: HTMLElement, fc: ExtendedFormControl): void {
        const holder: HTMLElement = this.parent.createElement('div', {
            className: 'e-ss-fc-choice-container'
        });
        wrap.appendChild(holder);
        const checkInput: HTMLElement = this.parent.createElement('input', {
            id: fc.id + '_input',
            className: 'e-ss-fc-checkbox-input',
            attrs: { type: 'checkbox' }
        });
        holder.appendChild(checkInput);
        const cb: CheckBox = new CheckBox({
            label: fc.text || 'Check Box',
            checked: fc.value === 'Checked',
            indeterminate: fc.value === 'Mixed',
            cssClass: 'e-ss-fc-checkbox',
            enableRtl: this.parent.enableRtl,
            change: (e: CBChangeArgs): void => {
                fc.value = e.checked ? 'Checked' : 'Unchecked';
                this.updateLinkedCell(fc);
            }
        });
        cb.createElement = this.parent.createElement;
        cb.appendTo(checkInput);
        this.ejComponents.set(fc.id, cb);
    }

    private renderRadioButton(wrap: HTMLElement, fc: ExtendedFormControl): void {
        const holder: HTMLElement = this.parent.createElement('div', {
            className: 'e-ss-fc-choice-container'
        });
        wrap.appendChild(holder);
        const groupName: string = this.parent.element.id + '_rb_sheet_' + fc.sheetIndex;
        const l10n: L10n = this.parent.serviceLocator.getService(locale) as L10n;
        const radioInput: HTMLElement = this.parent.createElement('input', {
            id: fc.id + '_input',
            className: 'e-ss-fc-radio-input',
            attrs: { type: 'radio' }
        });
        holder.appendChild(radioInput);
        const rb: RadioButton = new RadioButton({
            label: fc.text || l10n.getConstant('OptionButton'),
            checked: fc.value === 'Checked',
            name: groupName,
            value: fc.id,
            cssClass: 'e-ss-fc-radio-button',
            enableRtl: this.parent.enableRtl,
            change: (_e: RBChangeArgs): void => {
                if (!rb.checked) {
                    return;
                }
                const selectedIndex: number = this.getRadioGroupIndex(fc);
                this.updateRadioGroupState(fc, selectedIndex);
                this.updateLinkedCell(fc);
            }
        });
        rb.createElement = this.parent.createElement;
        rb.appendTo(radioInput);
        this.ejComponents.set(fc.id, rb);
    }

    private renderDropDown(wrap: HTMLElement, fc: ExtendedFormControl): void {
        const holder: HTMLElement = this.parent.createElement('div', {
            className: 'e-ss-fc-dropdown-container'
        });
        wrap.appendChild(holder);
        const data: string[] = this.getDropDownData(fc.inputRange);
        const initIndex: number | null = fc.selectedIndex !== undefined && fc.selectedIndex >= 0 ? fc.selectedIndex : null;
        const ddl: DropDownList = new DropDownList({
            dataSource: data,
            index: initIndex,
            cssClass: 'e-ss-fc-dropdown-list',
            width: '100%',
            enableRtl: this.parent.enableRtl,
            change: (_e: DDLChangeArgs): void => {
                fc.selectedIndex = ddl.index === null ? -1 : ddl.index;
                this.updateLinkedCell(fc);
            }
        });
        ddl.appendTo(holder);
        this.ejComponents.set(fc.id, ddl);
    }

    private getDropDownData(inputRange: string): string[] {
        const data: string[] = [];
        if (!inputRange) {
            return data;
        }
        try {
            const hasSheet: boolean = inputRange.indexOf('!') > -1;
            const rawRange: string = (hasSheet ? inputRange.split('!')[1] : inputRange).replace(/\$/g, '');
            const parts: string[] = rawRange.split(':');
            if (parts.length < 2) {
                return data;
            }
            const start: number[] = getRangeIndexes(parts[0]);
            const end: number[] = getRangeIndexes(parts[1]);
            const sheet: SheetModel = this.parent.getActiveSheet();
            for (let row: number = start[0]; row <= end[0]; row++) {
                for (let col: number = start[1]; col <= end[1]; col++) {
                    const cellRef: any = sheet.rows && sheet.rows[row as number] &&
                        sheet.rows[row as number].cells && sheet.rows[row as number].cells[col as number];
                    data.push(cellRef ? String(cellRef.value) : '');
                }
            }
        } catch (_e) { /* ignore */ }
        return data;
    }

    private renderHandles(el: HTMLElement): void {
        HANDLE_DIRECTIONS.forEach((direction: string): void => {
            const handle: HTMLElement = this.parent.createElement('div', {
                className: 'e-ss-fc-resize-handle e-ss-fc-resize-handle-' + direction
            });
            handle.addEventListener('mousedown', (e: MouseEvent): void => {
                if (e.button !== 0) {
                    return;
                }
                e.stopPropagation();
                e.preventDefault();
                const textEditor: HTMLInputElement | null = el.querySelector<HTMLInputElement>('.e-ss-fc-text-editor');
                if (textEditor) {
                    textEditor.blur();
                }
                const selectedElement: HTMLElement | null = document.getElementById(this.selectedControl);
                if (!selectedElement) {
                    return;
                }
                const fc: FormControlModel | undefined = this.formControls.get(this.selectedControl);
                if (!fc) {
                    return;
                }
                this.resize = {
                    element: selectedElement,
                    fc,
                    direction,
                    startX: e.clientX,
                    startY: e.clientY,
                    origW: selectedElement.offsetWidth,
                    origH: selectedElement.offsetHeight,
                    origL: parseFloat(selectedElement.style.left),
                    origT: parseFloat(selectedElement.style.top)
                };
            });
            el.appendChild(handle);
        });
    }

    private closeOpenContextMenu(): void {
        const openPopup: HTMLElement | null = document.getElementById(this.parent.element.id + '_contextmenu');
        if (openPopup) {
            openPopup.classList.remove('e-popup-open');
            openPopup.style.display = 'none';
        }
    }

    private isFormControlInteractionAllowed(fc: ExtendedFormControl): boolean {
        const sheet: SheetModel = this.parent.sheets[fc.sheetIndex] as SheetModel;
        if (!sheet || !sheet.isProtected) {
            return true;
        }
        const rowIndex: number = fc.rowIndex;
        const colIndex: number = fc.colIndex;
        const cell: any = sheet.rows && sheet.rows[rowIndex as number] &&
            sheet.rows[rowIndex as number].cells ?
            sheet.rows[rowIndex as number].cells[colIndex as number] : undefined;
        if (isLocked(cell, getColumn(sheet, colIndex))) {
            this.parent.notify(editAlert, null);
            return false;
        }
        return true;
    }

    private isLabelPointerPosition(event: MouseEvent, element: HTMLElement, fc: ExtendedFormControl): boolean {
        if (fc.type !== 'CheckBox' && fc.type !== 'RadioButton') {
            return false;
        }
        const labelSelector: string = fc.type === 'CheckBox' ?
            '.e-checkbox-wrapper .e-label' :
            '.e-radio-wrapper .e-label';
        const label: HTMLElement | null = element.querySelector<HTMLElement>(labelSelector);
        if (!label) {
            return false;
        }
        const labelRect: DOMRect = label.getBoundingClientRect() as DOMRect;
        return event.clientX >= labelRect.left &&
            event.clientX <= labelRect.right &&
            event.clientY >= labelRect.top &&
            event.clientY <= labelRect.bottom;
    }

    private attachEvents(el: HTMLElement, fc: ExtendedFormControl): void {
        let isLabelEditClick: boolean = false;
        let labelPointerDownX: number = 0;
        let labelPointerDownY: number = 0;
        el.addEventListener('mousedown', (e: MouseEvent): void => {
            if (e.button !== 0 || e.ctrlKey || this.selectedControl === fc.id) {
                return;
            }
            const target: HTMLElement = e.target as HTMLElement;
            if (target.closest('.e-ss-fc-text-editor') || target.closest('.e-ss-fc-resize-handle')) {
                return;
            }
            if ((fc.type === 'CheckBox' || fc.type === 'RadioButton') &&
                !this.isFormControlInteractionAllowed(fc)) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }, true);
        el.addEventListener('mousedown', (e: MouseEvent): void => {
            if (e.button !== 0) {
                if (e.button === 2) {
                    e.stopPropagation();
                }
                return;
            }
            const target: HTMLElement = e.target as HTMLElement;
            if (target.closest('.e-ss-fc-text-editor')) {
                return;
            }
            this.closeOpenContextMenu();
            e.stopPropagation();
            if (this.selectedControl !== fc.id) {
                return;
            }
            if (target.classList.contains('e-ss-fc-resize-handle')) {
                return;
            }
            const textEditor: HTMLInputElement | null = el.querySelector<HTMLInputElement>('.e-ss-fc-text-editor');
            if (textEditor) {
                textEditor.blur();
            }
            if (this.isLabelPointerPosition(e, el, fc)) {
                isLabelEditClick = true;
                labelPointerDownX = e.clientX;
                labelPointerDownY = e.clientY;
                e.preventDefault();
                return;
            }
            isLabelEditClick = false;
            e.preventDefault();
            this.drag = {
                element: el, fc,
                startX: e.clientX, startY: e.clientY,
                origLeft: parseFloat(el.style.left) || 0,
                origTop: parseFloat(el.style.top) || 0
            };
        });
        el.addEventListener('mousedown', (e: MouseEvent): void => {
            const target: HTMLElement = e.target as HTMLElement;
            if (target.closest('.e-ss-fc-text-editor')) {
                return;
            }
            if (e.ctrlKey && e.button === 0) {
                e.preventDefault();
                e.stopPropagation();
                this.enterDesignMode(fc.id);
            }
        });
        el.addEventListener('mousemove', (e: MouseEvent): void => {
            if (isLabelEditClick && e.buttons === 1) {
                const horizontalMovement: number =
                    Math.abs(e.clientX - labelPointerDownX);
                const verticalMovement: number =
                    Math.abs(e.clientY - labelPointerDownY);

                if (horizontalMovement > 3 || verticalMovement > 3) {
                    isLabelEditClick = false;
                }
            }
            if (this.selectedControl !== fc.id ||
                (fc.type !== 'CheckBox' && fc.type !== 'RadioButton') ||
                this.drag ||
                this.resize ||
                el.querySelector('.e-ss-fc-text-editor')) {
                return;
            }
            el.style.cursor = this.isLabelPointerPosition(e, el, fc) ?
                'text' : 'move';
        });
        el.addEventListener('mouseleave', (): void => {
            if (!el.querySelector('.e-ss-fc-text-editor')) {
                el.style.removeProperty('cursor');
            }
        });
        el.addEventListener('click', (e: MouseEvent): void => {
            if (this.selectedControl !== fc.id ||
                !isLabelEditClick ||
                !this.isLabelPointerPosition(e, el, fc)) {
                isLabelEditClick = false;
                return;
            }
            isLabelEditClick = false;
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            el.style.removeProperty('cursor');
            this.startInlineTextEdit(fc);
        }, true);
        el.addEventListener('click', (e: MouseEvent): void => {
            if ((fc.type !== 'CheckBox' && fc.type !== 'RadioButton') ||
                this.selectedControl === fc.id) {
                return;
            }
            const target: HTMLElement = e.target as HTMLElement;
            if (target.closest('.e-checkbox-wrapper') ||
                target.closest('.e-radio-wrapper') ||
                target.closest('.e-ss-fc-checkbox-input') ||
                target.closest('.e-ss-fc-radio-input') ||
                target.closest('.e-ss-fc-resize-handle') ||
                target.closest('.e-ss-fc-text-editor')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            if (!this.isFormControlInteractionAllowed(fc)) {
                return;
            }
            const component: CheckBox | RadioButton | DropDownList | undefined = this.ejComponents.get(fc.id);
            if (fc.type === 'CheckBox' && component instanceof CheckBox) {
                const isChecked: boolean = fc.value !== 'Checked';
                fc.value = isChecked ? 'Checked' : 'Unchecked';
                component.indeterminate = false;
                component.checked = isChecked;
                component.dataBind();
                this.updateLinkedCell(fc);
            } else if (fc.type === 'RadioButton' && component instanceof RadioButton) {
                if (fc.value === 'Checked') {
                    return;
                }
                const selectedIndex: number = this.getRadioGroupIndex(fc);
                this.updateRadioGroupState(fc, selectedIndex);
                this.updateLinkedCell(fc);
            }
        });
        el.addEventListener('contextmenu', (e: MouseEvent): void => {
            const target: HTMLElement = e.target as HTMLElement;
            if (target.closest('.e-ss-fc-text-editor')) {
                return;
            }
            isLabelEditClick = false;
            e.preventDefault();
            e.stopPropagation();
            this._contextMenuFc = fc;
            this._fcMenuActive = true;
            this.enterDesignMode(fc.id);
            const activeEl: HTMLElement | null = this.parent.element.querySelector('.e-active-cell') as HTMLElement;
            if (activeEl) {
                activeEl.dispatchEvent(new MouseEvent('contextmenu', {
                    bubbles: true,
                    cancelable: true,
                    clientX: e.clientX,
                    clientY: e.clientY
                }));
            }
        });
    }

    private cMenuBeforeOpenHandler(args: { target: string; items: MenuItemModel[] }): void {
        if (!this._fcMenuActive || args.target !== 'Content') {
            this._fcMenuActive  = false;
            this._contextMenuFc = null;
            return;
        }
        this._fcMenuActive = false;
        const id: string = this.parent.element.id + '_cmenu';
        const l10n: L10n = this.parent.serviceLocator.getService(locale) as L10n;
        const fc: FormControlModel = this._contextMenuFc;
        const hasPaste: boolean = this.clipboardFormControl !== null;
        const toRemove: string[] = [
            id + '_pastespecial', id + '_filter', id + '_sort', id + '_newComment', id + '_comment', id + '_deleteComment',
            id + '_newReply', id + '_addNote', id + '_editNote', id + '_deleteNote', id + '_showHideNote',
            id + '_hyperlink', id + '_editHyperlink', id + '_openHyperlink', id + '_removeHyperlink'
        ];
        toRemove.forEach((itemId: string) => {
            try { this.parent.removeContextMenuItems([itemId], true); } catch (_e) { /* absent */ }
        });
        const menuUL: HTMLElement | null = document.getElementById(this.parent.element.id + '_contextmenu');
        if (menuUL) {
            menuUL.querySelectorAll('.e-separator').forEach((sep: Element) => {
                sep.remove();
            });
        }
        this.parent.enableContextMenuItems([l10n.getConstant('Paste')], hasPaste);
        if (fc.type === 'CheckBox' || fc.type === 'RadioButton') {
            this.parent.addContextMenuItems([{
                text: l10n.getConstant('EditText'),
                id: id + '_fc_edit_text',
                iconCss: 'e-icons e-text-annotation'
            }], id + '_paste', true, true);
        }
        this.parent.addContextMenuItems([{
            text: l10n.getConstant('FormatControl'),
            id: id + '_format_control',
            iconCss: 'e-icons e-format-paint'
        }], id + '_paste', true, true);
    }

    private onContextMenuItemSelect(args: { item: { id: string }; cancel: boolean }): void {
        const id: string = this.parent.element.id + '_cmenu';
        if (args.item.id === id + '_paste' && this.clipboardFormControl) {
            args.cancel = true;
            this.pasteFormControl();
            return;
        }
        const fc: ExtendedFormControl | null = this._contextMenuFc;
        this._contextMenuFc = null;
        if (!fc) {
            return;
        }
        switch (args.item.id) {
        case id + '_cut':
            args.cancel = true;
            this.cutFormControl(fc.id);
            break;
        case id + '_copy':
            args.cancel = true;
            this.copyFormControl(fc.id);
            break;
        case id + '_format_control':
            args.cancel = true;
            this.showFormatControlDialog(fc);
            break;
        case id + '_fc_edit_text':
            args.cancel = true;
            this.startInlineTextEdit(fc);
            break;
        default:
            break;
        }
    }

    private enterDesignMode(id: string): void {
        if (this.selectedControl && this.selectedControl !== id) {
            this.exitDesignMode();
        }
        this.selectedControl = id;
        const el: HTMLElement | null = document.getElementById(id);
        if (!el) {
            return;
        }
        el.classList.add(FC_SEL_CLASS);
        el.focus();
    }

    private exitDesignMode(): void {
        if (!this.selectedControl) {
            return;
        }
        const el: HTMLElement | null = document.getElementById(this.selectedControl);
        if (el) {
            el.classList.remove(FC_SEL_CLASS);
            el.style.removeProperty('cursor');
            const content: HTMLElement | null =
                el.querySelector<HTMLElement>('.e-ss-fc-content');
            if (content) {
                content.style.removeProperty('pointer-events');
            }
        }
        this.selectedControl = null;
    }

    private onDocumentMouseMove(e: MouseEvent): void {
        if (this.drag) {
            this.closeOpenContextMenu();
            this._contextMenuFc = null;
            this._fcMenuActive = false;

            const dx: number = e.clientX - this.drag.startX;
            const dy: number = e.clientY - this.drag.startY;
            this.drag.element.style.left = String(Math.max(0, this.drag.origLeft + dx)) + 'px';
            this.drag.element.style.top  = String(Math.max(0, this.drag.origTop  + dy)) + 'px';
            return;
        }
        if (this.resize) {
            const { direction: dir, startX, startY, origW, origH, origL, origT, element: el } = this.resize;
            const dx: number = e.clientX - startX;
            const dy: number = e.clientY - startY;
            let w: number = origW;
            let h: number = origH;
            let l: number = origL;
            let t: number = origT;
            if (dir.indexOf('right')  > -1) {
                w = Math.max(FC_MIN_W, origW + dx);
            }
            if (dir.indexOf('bottom') > -1) {
                h = Math.max(FC_MIN_H, origH + dy);
            }
            if (dir.indexOf('left')   > -1) {
                w = Math.max(FC_MIN_W, origW - dx);
                l = origL + (origW - w);
            }
            if (dir.indexOf('top')    > -1) {
                h = Math.max(FC_MIN_H, origH - dy);
                t = origT + (origH - h);
            }
            el.style.width = w + 'px'; el.style.height = h + 'px';
            el.style.left = l + 'px'; el.style.top = t + 'px';
        }
    }

    private onDocumentMouseUp(_e: MouseEvent): void {
        if (this.drag) {
            const fc: ExtendedFormControl = this.drag.fc;
            const prevLeft:     number = fc.left;
            const prevTop:      number = fc.top;
            const prevRowIndex: number = fc.rowIndex;
            const prevColIndex: number = fc.colIndex;
            fc.left = parseFloat(this.drag.element.style.left);
            fc.top = parseFloat(this.drag.element.style.top);
            const rowArgs: { clientY: number; isImage: boolean } = { clientY: fc.top,  isImage: true };
            const colArgs: { clientX: number; isImage: boolean } = { clientX: fc.left, isImage: true };
            this.parent.notify(getRowIdxFromClientY, rowArgs);
            this.parent.notify(getColIdxFromClientX, colArgs);
            fc.rowIndex = rowArgs.clientY;
            fc.colIndex = colArgs.clientX;
            if (fc.left !== prevLeft || fc.top !== prevTop) {
                this.parent.notify(updateUndoRedoCollection, {
                    args: {
                        action: 'formControlRefresh',
                        eventArgs: {
                            fcId: fc.id, sheetIdx: fc.sheetIndex,
                            prevLeft,  prevTop,
                            prevWidth:  fc.width, prevHeight: fc.height,
                            prevRowIndex, prevColIndex,
                            newLeft:  fc.left, newTop: fc.top,
                            newWidth: fc.width, newHeight: fc.height,
                            newRowIndex: fc.rowIndex, newColIndex: fc.colIndex,
                            isResize: false, isFormat: false
                        }
                    }
                });
            }
            this.drag = null;
        }
        if (this.resize) {
            const fc: ExtendedFormControl = this.resize.fc;
            const el: HTMLElement = this.resize.element;
            const prevLeft: number = this.resize.origL;
            const prevTop: number = this.resize.origT;
            const prevWidth: number = this.resize.origW;
            const prevHeight: number = this.resize.origH;
            const prevRowIndex: number = fc.rowIndex;
            const prevColIndex: number = fc.colIndex;
            fc.width = el.offsetWidth;
            fc.height = el.offsetHeight;
            fc.left = parseFloat(el.style.left);
            fc.top = parseFloat(el.style.top);
            const rowArgs: { clientY: number; isImage: boolean } = { clientY: fc.top,  isImage: true };
            const colArgs: { clientX: number; isImage: boolean } = { clientX: fc.left, isImage: true };
            this.parent.notify(getRowIdxFromClientY, rowArgs);
            this.parent.notify(getColIdxFromClientX, colArgs);
            fc.rowIndex    = rowArgs.clientY;
            fc.colIndex = colArgs.clientX;
            if (fc.left !== prevLeft || fc.top !== prevTop || fc.width !== prevWidth || fc.height !== prevHeight) {
                this.parent.notify(updateUndoRedoCollection, {
                    args: {
                        action: 'formControlRefresh',
                        eventArgs: {
                            fcId: fc.id, sheetIdx: fc.sheetIndex,
                            prevLeft,  prevTop,  prevWidth,  prevHeight,
                            prevRowIndex, prevColIndex,
                            newLeft:  fc.left, newTop:  fc.top,
                            newWidth: fc.width, newHeight: fc.height,
                            newRowIndex: fc.rowIndex, newColIndex: fc.colIndex,
                            isResize: true, isFormat: false
                        }
                    }
                });
            }
            this.resize = null;
        }
    }

    private onDocumentClick(e: MouseEvent): void {
        if (!this.selectedControl) {
            return;
        }
        const el: HTMLElement | null = document.getElementById(this.selectedControl);
        if (el && !el.contains(e.target as Node) &&
            !(e.target as HTMLElement).closest('.e-spreadsheet-contextmenu') &&
            !(e.target as HTMLElement).closest('.e-ss-fc-dialog') &&
            !(e.target as HTMLElement).closest('.e-dialog')) {
            this.exitDesignMode();
            this._contextMenuFc = null;
            this._fcMenuActive  = false;
        }
    }

    private onDocumentKeyDown(e: KeyboardEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        if (target && target.classList && target.classList.contains('e-ss-fc-text-editor')) {
            return;
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V') && this.clipboardFormControl) {
            this.pasteFormControl();
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
        }
        if (!this.selectedControl) {
            if (e.key === 'Tab' && this.parent.element.contains(document.activeElement)) {
                const moved: boolean = this.navigateFormControls(!e.shiftKey);
                if (moved) {
                    e.preventDefault();
                }
            }
            return;
        }
        const el: HTMLElement | null = document.getElementById(this.selectedControl);
        const fc: FormControlModel | undefined = this.formControls.get(this.selectedControl);
        if (!el || !fc) {
            return;
        }
        const step: number = e.shiftKey ? 8 : 1;
        switch (e.key) {
        case 'Escape':
            this.exitDesignMode();
            e.preventDefault();
            e.stopImmediatePropagation();
            break;
        case 'Delete':
            this.deleteFormControl(this.selectedControl);
            e.preventDefault();
            e.stopImmediatePropagation();
            break;
        case 'ArrowLeft':
            el.style.left = String(Math.max(0, (parseFloat(el.style.left) || 0) - step)) + 'px';
            fc.left = parseFloat(el.style.left);
            e.preventDefault();
            e.stopImmediatePropagation();
            break;
        case 'ArrowRight':
            el.style.left = String((parseFloat(el.style.left) || 0) + step) + 'px';
            fc.left = parseFloat(el.style.left);
            e.preventDefault();
            e.stopImmediatePropagation();
            break;
        case 'ArrowUp':
            el.style.top = String(Math.max(0, (parseFloat(el.style.top) || 0) - step)) + 'px';
            fc.top = parseFloat(el.style.top);
            e.preventDefault();
            e.stopImmediatePropagation();
            break;
        case 'ArrowDown':
            el.style.top = String((parseFloat(el.style.top) || 0) + step) + 'px';
            fc.top = parseFloat(el.style.top);
            e.preventDefault();
            e.stopImmediatePropagation();
            break;
        case 'c': case 'C':
            if (e.ctrlKey || e.metaKey) {
                this.copyFormControl(this.selectedControl);
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            break;
        case 'x': case 'X':
            if (e.ctrlKey || e.metaKey) {
                this.cutFormControl(this.selectedControl);
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            break;
        case 'v': case 'V':
            if ((e.ctrlKey || e.metaKey) && this.clipboardFormControl) {
                this.pasteFormControl();
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            break;
        case 'Tab':
            this.navigateFormControls(!e.shiftKey);
            e.preventDefault();
            e.stopImmediatePropagation();
            break;
        }
    }

    private navigateFormControls(forward: boolean): boolean {
        const sheet: ExtendedSheet = this.parent.sheets[this.parent.activeSheetIndex] as ExtendedSheet;
        const all: FormControlModel[]  = sheet.formControls;
        if (all.length === 0) {
            return false;
        }
        let nextIdx: number = 0;
        if (this.selectedControl) {
            const cur: number = all.findIndex((fc: ExtendedFormControl) => fc.id === this.selectedControl);
            if (cur !== -1) {
                nextIdx = forward ? (cur + 1) % all.length : (cur - 1 + all.length) % all.length;
            }
        }
        this.enterDesignMode((all[nextIdx as number] as ExtendedFormControl).id);
        return true;
    }

    private updateLinkedCell(fc: FormControlModel): void {
        const link: string = (fc.cellLink || '').trim();
        if (!link) {
            return;
        }
        const address: string = link.indexOf('!') > -1 ? link : (this.parent.getActiveSheet().name + '!' + link);
        switch (fc.type) {
        case 'CheckBox': {
            const cbState: string = fc.value;
            if (cbState === 'Mixed') {
                this.parent.updateCell({ value: '#N/A' as any }, address);
                return;
            }
            this.parent.updateCell({ value: (cbState === 'Checked') as any }, address);
            return;
        }
        case 'RadioButton': {
            if (fc.value !== 'Checked') {
                return;
            }
            const rbIdx: number = this.getRadioGroupIndex(fc);
            if (rbIdx > 0) {
                this.parent.updateCell({ value: rbIdx as any }, address);
            }
            return;
        }
        case 'DropDown': {
            const selectedIndex: number = fc.selectedIndex;
            const value: number | string = selectedIndex === undefined ? 1 : selectedIndex < 0 ? '' : selectedIndex + 1;
            this.parent.updateCell({ value: value as any }, address);
            return;
        }
        }
    }

    private getRadioGroup(fc: ExtendedFormControl): ExtendedFormControl[] {
        const sheet: ExtendedSheet = this.parent.sheets[fc.sheetIndex] as ExtendedSheet;
        if (!sheet || !sheet.formControls) {
            return [];
        }
        return sheet.formControls.filter((control: ExtendedFormControl): boolean => {
            return control.type === 'RadioButton';
        });
    }

    private getRadioGroupIndex(fc: ExtendedFormControl): number {
        const group: ExtendedFormControl[] = this.getRadioGroup(fc);
        const index: number = group.findIndex((control: ExtendedFormControl): boolean => {
            return control.id === fc.id;
        });
        return index > -1 ? index + 1 : 0;
    }

    private updateRadioGroupState(fc: ExtendedFormControl, selectedIndex: number): void {
        const group: ExtendedFormControl[] = this.getRadioGroup(fc);
        group.forEach((control: ExtendedFormControl, index: number): void => {
            const isChecked: boolean = index + 1 === selectedIndex;
            control.value = isChecked ? 'Checked' : 'Unchecked';
            const component: CheckBox | RadioButton | DropDownList | undefined = this.ejComponents.get(control.id);
            if (component && component instanceof RadioButton) {
                component.checked = isChecked;
                component.dataBind();
            }
        });
    }

    private updateRadioGroupCellLink(fc: ExtendedFormControl, cellLink: string): void {
        const group: ExtendedFormControl[] = this.getRadioGroup(fc);
        group.forEach((control: ExtendedFormControl): void => {
            control.cellLink = cellLink;
        });
    }

    private onCellValueChanged(args: any): void {
        if (args.rowIdx === undefined || args.colIdx === undefined) {
            return;
        }
        const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        if (!sheet.formControls || !sheet.formControls.length) {
            return;
        }
        const address: string = getCellAddress(args.rowIdx, args.colIdx).toUpperCase();
        const value: any = args.cell.value;
        const synchronizedRadioGroups: { [key: string]: boolean } = {};
        sheet.formControls.forEach((fc: ExtendedFormControl): void => {
            const cellLink: string = (fc.cellLink || '').trim();
            if (!cellLink) {
                return;
            }
            const normalizedLink: string = (
                cellLink.indexOf('!') > -1 ? cellLink.split('!')[1] : cellLink
            ).replace(/\$/g, '').toUpperCase();
            if (normalizedLink !== address) {
                return;
            }
            const component: CheckBox | RadioButton | DropDownList | undefined = this.ejComponents.get(fc.id);
            switch (fc.type) {
            case 'CheckBox': {
                const isNotAvailable: boolean =
                    value === '#N/A' || (value && typeof value === 'object' && value.error === '#N/A');
                fc.value = isNotAvailable ? 'Mixed' : value === true ? 'Checked' : 'Unchecked';
                if (component && component instanceof CheckBox) {
                    component.indeterminate = fc.value === 'Mixed';
                    component.checked = fc.value === 'Checked';
                    component.dataBind();
                }
                break;
            }
            case 'RadioButton': {
                const groupKey: string = String(fc.sheetIndex) + ':' + normalizedLink;
                if (synchronizedRadioGroups[groupKey as string]) {
                    break;
                }
                synchronizedRadioGroups[groupKey as string] = true;
                const selectedIndex: number = Number(value);
                this.updateRadioGroupState(
                    fc,
                    Number.isInteger(selectedIndex) && selectedIndex > 0 ? selectedIndex : 0
                );
                break;
            }
            case 'DropDown': {
                const linkedValue: number = Number(value);
                const selectedIndex: number =
                    value !== null && value !== '' && !isNaN(linkedValue) && linkedValue >= 1 ? linkedValue - 1 : -1;
                fc.selectedIndex = selectedIndex;
                if (component && component instanceof DropDownList) {
                    component.index = selectedIndex >= 0 ? selectedIndex : null;
                    if (selectedIndex < 0) {
                        component.value = null;
                        component.text = null;
                    }
                    component.dataBind();
                }
                break;
            }
            }
        });
    }

    private startInlineTextEdit(fc: ExtendedFormControl): void {
        const el: HTMLElement | null = document.getElementById(fc.id);
        if (!el) {
            return;
        }
        if (fc.type !== 'CheckBox' && fc.type !== 'RadioButton') {
            return;
        }
        if (el.querySelector('.e-ss-fc-text-editor')) {
            return;
        }
        const typedFc: FormControlModel = fc;
        const originalText: string = typedFc.text;
        const comp: CheckBox | RadioButton | DropDownList | undefined = this.ejComponents.get(fc.id);
        const inp: HTMLInputElement = document.createElement('input');
        inp.type = 'text';
        inp.value = originalText;
        inp.className = 'e-ss-fc-text-editor';
        el.appendChild(inp);
        inp.focus();
        inp.select();
        let isEditCompleted: boolean = false;
        const focusActiveCell: () => void = (): void => {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const indexes: number[] = getRangeIndexes(sheet.activeCell);
            const activeCell: HTMLElement | null =
                this.parent.getCell(indexes[0], indexes[1]);
            if (activeCell) {
                activeCell.focus();
            } else {
                this.parent.element.focus();
            }
        };
        const completeEdit: (cancel: boolean) => void =
            (cancel: boolean): void => {
                if (isEditCompleted) {
                    return;
                }
                isEditCompleted = true;
                const finalText: string = cancel ? originalText : inp.value;
                if (!cancel) {
                    typedFc.text = finalText;
                }
                if (inp.parentNode) {
                    inp.parentNode.removeChild(inp);
                }
                if (comp && (comp instanceof CheckBox || comp instanceof RadioButton)) {
                    comp.label = finalText ||
                        (fc.type === 'CheckBox' ? 'Check Box' : 'Option Button');
                    comp.dataBind();
                }
                if (cancel) {
                    this.exitDesignMode();
                    focusActiveCell();
                } else {
                    this.enterDesignMode(fc.id);
                }
            };
        inp.addEventListener('mousedown', (ev: MouseEvent): void => {
            ev.stopPropagation();
        });
        inp.addEventListener('click', (ev: MouseEvent): void => {
            ev.stopPropagation();
        });
        inp.addEventListener('dblclick', (ev: MouseEvent): void => {
            ev.stopPropagation();
        });
        inp.addEventListener('blur', (): void => {
            completeEdit(false);
        });
        inp.addEventListener('keydown', (ev: KeyboardEvent): void => {
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            if (ev.key === 'Enter') {
                ev.preventDefault();
                return;
            }
            if (ev.key === 'Escape') {
                ev.preventDefault();
                completeEdit(false);
                this.exitDesignMode();
                focusActiveCell();
            }
        });
    }

    private showFormatControlDialog(fc: FormControlModel): void {
        const dialogInst: DialogService = this.parent.serviceLocator.getService(dialog) as DialogService;
        const l10n: L10n = this.parent.serviceLocator.getService(locale) as L10n;
        const content: HTMLElement = this.parent.createElement('div', {
            className: 'e-ss-fc-dialog-content'
        });
        const tabEl: HTMLElement = this.buildControlTab(fc);
        if ((tabEl as any).__getDlgRbs) {
            (content as any).__getDlgRbs = (tabEl as any).__getDlgRbs;
        }
        content.appendChild(tabEl);
        dialogInst.show({
            width: 460,
            isModal: true,
            showCloseIcon: true,
            cssClass: 'e-ss-fc-dialog',
            enableRtl: this.parent.enableRtl,
            header: l10n.getConstant('FormatControl'),
            content: content as any,
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'FormatControlDialog',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
            },
            buttons: [
                {
                    buttonModel: { content: l10n.getConstant('Ok'), isPrimary: true },
                    click: (): void => {
                        this.applyDialog(fc, content);
                        dialogInst.hide();
                        if (fc.type === 'DropDown') {
                            this.exitDesignMode();
                        }
                    }
                }
            ]
        });
    }

    private buildControlTab(fc: FormControlModel): HTMLElement {
        if (fc.type === 'CheckBox' || fc.type === 'RadioButton') {
            return this.buildCheckRadioControl(fc);
        }
        if (fc.type === 'DropDown') {
            return this.buildDropDownControl(fc);
        }
        return this.parent.createElement('div', {});
    }

    private buildCheckRadioControl(fc: ExtendedFormControl): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale) as L10n;
        const wrap: HTMLElement = this.parent.createElement('div', { className: 'e-ss-fc-dialog-control-section' });
        const valueSection: HTMLElement = this.parent.createElement('div', { className: 'e-ss-fc-dialog-section' });
        const valueTitle: HTMLElement = this.parent.createElement('div', { className: 'e-ss-fc-dialog-section-title' });
        valueTitle.textContent = l10n.getConstant('Value');
        valueSection.appendChild(valueTitle);
        const isCheckBox: boolean = fc.type === 'CheckBox';
        const options: string[] = isCheckBox ? ['Unchecked', 'Checked', 'Mixed'] : ['Unchecked', 'Checked'];
        const currentValue: string = fc.value || 'Unchecked';
        const dialogRadioButtons: RadioButton[] = [];
        const hiddenMount: HTMLElement = this.parent.createElement('div', { className: 'e-ss-fc-hidden-mount' });
        hiddenMount.appendChild(valueSection);
        this.parent.element.appendChild(hiddenMount);
        const optionsRow: HTMLElement = this.parent.createElement('div', { className: 'e-ss-fc-dialog-options' });
        valueSection.appendChild(optionsRow);
        options.forEach((option: string): void => {
            const optionContainer: HTMLElement = this.parent.createElement('div', {
                className: 'e-ss-fc-dialog-option'
            });
            optionsRow.appendChild(optionContainer);
            const radioInput: HTMLElement = this.parent.createElement('input', {
                id: 'fc_dlg_val_' + fc.id + '_' + option,
                className: 'e-ss-fc-dialog-radio-input',
                attrs: { type: 'radio' }
            });
            optionContainer.appendChild(radioInput);
            const radioButton: RadioButton = new RadioButton({
                label: option,
                name: 'fc_dlg_val_' + fc.id,
                value: option,
                checked: currentValue === option,
                cssClass: 'e-ss-fc-dialog-radio-button'
            });
            radioButton.createElement = this.parent.createElement;
            radioButton.appendTo(radioInput);
            dialogRadioButtons.push(radioButton);
        });
        wrap.appendChild(valueSection);
        this.parent.element.removeChild(hiddenMount);
        wrap.appendChild(this.buildCellLinkRow(fc));
        (wrap as any).__getDlgRbs = (): RadioButton[] => dialogRadioButtons;
        return wrap;
    }

    private buildDropDownControl(fc: FormControlModel): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale) as L10n;
        const wrap: HTMLElement = this.parent.createElement('div', { className: 'e-ss-fc-dialog-dropdown-section' });
        const inputRangeRow: HTMLElement = this.parent.createElement('div', { className: 'e-cellrange' });
        const inputRangeLabel: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
        inputRangeLabel.innerText = l10n.getConstant('InputRange');
        const inputRangeInput: HTMLElement = this.parent.createElement('input', {
            className: 'e-input',
            attrs: { value: fc.inputRange || '', 'aria-label': l10n.getConstant('InputRange'), 'data-fc-field': 'inputRange' }
        });
        inputRangeRow.appendChild(inputRangeLabel);
        inputRangeRow.appendChild(inputRangeInput);
        wrap.appendChild(inputRangeRow);
        wrap.appendChild(this.buildCellLinkRow(fc));
        return wrap;
    }

    private buildCellLinkRow(fc: FormControlModel): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale) as L10n;
        const row: HTMLElement = this.parent.createElement('div', { className: 'e-cellrange' });
        const lbl: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
        lbl.innerText = l10n.getConstant('CellLink');
        const inp: HTMLElement = this.parent.createElement('input', {
            className: 'e-input',
            attrs: { value: fc.cellLink || '', 'aria-label': l10n.getConstant('CellLink'), 'data-fc-field': 'cellLink' }
        });
        row.appendChild(lbl);
        row.appendChild(inp);
        return row;
    }

    private getFormControlCopy(fc: ExtendedFormControl): ExtendedFormControl {
        return { type: fc.type, top: fc.top, left: fc.left, cellLink: fc.cellLink, width: fc.width, height: fc.height, text: fc.text,
            value: fc.value, inputRange: fc.inputRange, selectedIndex: fc.selectedIndex, id: fc.id, sheetIndex: fc.sheetIndex,
            rowIndex: fc.rowIndex, colIndex: fc.colIndex };
    }

    private applyDialog(fc: ExtendedFormControl, content: HTMLElement): void {
        const prevModel: FormControlModel = this.getFormControlCopy(fc);
        let isCellLinkChanged: boolean = false;
        content.querySelectorAll<HTMLInputElement>('[data-fc-field]').forEach(
            (inp: HTMLInputElement): void => {
                switch (inp.dataset['fcField']) {
                case 'cellLink': {
                    const cellLink: string = inp.value.trim();
                    isCellLinkChanged = (fc.cellLink || '').trim() !== cellLink;
                    if (fc.type === 'RadioButton') {
                        this.updateRadioGroupCellLink(fc, cellLink);
                    } else {
                        fc.cellLink = cellLink;
                    }
                    break;
                }
                case 'inputRange':
                    if (fc.type === 'DropDown') {
                        const inputRange: string = inp.value.trim();
                        const isRangeChanged: boolean = fc.inputRange !== inputRange;
                        fc.inputRange = inputRange;
                        const comp: CheckBox | RadioButton | DropDownList | undefined = this.ejComponents.get(fc.id);
                        if (comp && comp instanceof DropDownList) {
                            comp.dataSource = this.getDropDownData(inputRange) as any;
                            if (isRangeChanged) {
                                fc.selectedIndex = -1;
                                comp.index = null;
                                comp.value = null;
                                comp.text = null;
                            }
                            comp.refresh();
                        }
                    }
                    break;
                }
            });
        const getRbs: (() => RadioButton[]) | undefined = (content as any).__getDlgRbs;
        if (getRbs) {
            const rbs: RadioButton[] = getRbs();
            const checkedRb: RadioButton | undefined = rbs.filter((rb: RadioButton): boolean => rb.checked)[0];
            if (checkedRb) {
                const newVal: string = checkedRb.label;
                if (fc.type === 'CheckBox') {
                    fc.value = newVal as 'Checked' | 'Unchecked' | 'Mixed';
                } else if (fc.type === 'RadioButton') {
                    if (newVal === 'Checked') {
                        this.updateRadioGroupState(fc, this.getRadioGroupIndex(fc));
                    } else {
                        const wasChecked: boolean = fc.value === 'Checked';
                        fc.value = 'Unchecked';
                        const component: CheckBox | RadioButton | DropDownList | undefined = this.ejComponents.get(fc.id);
                        if (component && component instanceof RadioButton) {
                            component.checked = false;
                            component.dataBind();
                        }
                        if (wasChecked && fc.cellLink) {
                            const address: string = fc.cellLink.indexOf('!') > -1 ?
                                fc.cellLink : this.parent.getActiveSheet().name + '!' + fc.cellLink;
                            this.parent.updateCell({ value: 0 as any }, address);
                        }
                    }
                }
            }
            rbs.forEach((rb: RadioButton): void => {
                if (!rb.isDestroyed) {
                    rb.destroy();
                }
            });
        }
        this.refreshFormControlVisual(fc.id);
        if (fc.type === 'RadioButton') {
            const group: ExtendedFormControl[] = this.getRadioGroup(fc);
            const checkedControl: ExtendedFormControl | undefined =
                group.find((control: ExtendedFormControl): boolean => {
                    return control.value === 'Checked';
                });
            if (checkedControl && checkedControl.cellLink) {
                this.updateLinkedCell(checkedControl);
            } else if (fc.cellLink) {
                const address: string = fc.cellLink.indexOf('!') > -1 ?
                    fc.cellLink : this.parent.getActiveSheet().name + '!' + fc.cellLink;
                this.parent.updateCell({ value: isCellLinkChanged ? '' as any : 0 as any }, address);
            }
        } else if (fc.cellLink) {
            this.updateLinkedCell(fc);
        }
        this.parent.notify(updateUndoRedoCollection, {
            args: {
                action: 'formControlRefresh',
                eventArgs: {
                    fcId: fc.id,
                    sheetIdx: fc.sheetIndex,
                    prevModel,
                    newModel: this.getFormControlCopy(fc),
                    isFormat: true,
                    isResize: false
                }
            }
        });
    }

    private refreshFormControlVisual(id: string): void {
        const fc: FormControlModel | undefined = this.formControls.get(id);
        if (!fc) {
            return;
        }
        const el: HTMLElement | null = document.getElementById(id);
        if (!el) {
            return;
        }
        this.destroyEjComponent(id);
        const oldContent: HTMLElement | null = el.querySelector<HTMLElement>('.e-ss-fc-content');
        if (oldContent && oldContent.parentNode) {
            oldContent.parentNode.removeChild(oldContent);
        }
        this.renderContent(el, fc);
    }

    private copyFormControl(id: string): void {
        const fc: FormControlModel | undefined = this.formControls.get(id);
        if (fc) {
            this.clipboardFormControl = this.getFormControlCopy(fc);
            this.clipboardMode = 'copy';
        }
    }

    private cutFormControl(id: string): void {
        const fc: FormControlModel | undefined = this.formControls.get(id);
        if (!fc) {
            return;
        }
        this.clipboardFormControl = this.getFormControlCopy(fc);
        this.clipboardMode = 'cut';
        const el: HTMLElement | null = document.getElementById(id);
        if (el) {
            el.style.opacity = '0.5';
        }
    }

    private pasteFormControl(): void {
        if (!this.clipboardFormControl) {
            return;
        }
        const clipboardModel: ExtendedFormControl = JSON.parse(JSON.stringify(this.clipboardFormControl));
        const isCut: boolean = this.clipboardMode === 'cut';
        const sourceModel: ExtendedFormControl | null = isCut ? JSON.parse(JSON.stringify(clipboardModel)) : null;
        const sourceId: string = clipboardModel.id;
        const previousUndoRedoState: boolean = this._isUndoRedo;
        let newId: string = '';
        let targetModel: ExtendedFormControl | null = null;
        if (isCut) {
            this._isUndoRedo = true;
        }
        try {
            const sheet: SheetModel = this.parent.getActiveSheet();
            newId = this.insertFormControl(clipboardModel.type, sheet.activeCell, this.parent.activeSheetIndex);
            const newFc: ExtendedFormControl | undefined = this.formControls.get(newId);
            if (!newFc) {
                return;
            }
            newFc.width = clipboardModel.width;
            newFc.height = clipboardModel.height;
            newFc.cellLink = clipboardModel.cellLink;
            newFc.text = clipboardModel.text;
            if (newFc.type === 'CheckBox' || newFc.type === 'RadioButton') {
                newFc.value = clipboardModel.value;
            } else if (newFc.type === 'DropDown') {
                newFc.inputRange = clipboardModel.inputRange;
                newFc.selectedIndex = clipboardModel.selectedIndex;
            }
            const el: HTMLElement | null = document.getElementById(newId);
            if (el) {
                el.style.width = newFc.width + 'px';
                el.style.height = newFc.height + 'px';
                const contentEl: HTMLElement | null = el.querySelector('.e-ss-fc-content');
                if (contentEl && contentEl.parentNode) {
                    contentEl.parentNode.removeChild(contentEl);
                }
                this.destroyEjComponent(newId);
                this.renderContent(el, newFc);
            }
            targetModel = JSON.parse(JSON.stringify(newFc));
            if (isCut && sourceModel) {
                this.deleteFormControl(sourceId, sourceModel);
                this.clipboardFormControl = null;
                this.clipboardMode = null;
            }
        } finally {
            this._isUndoRedo = previousUndoRedoState;
        }
        if (isCut && sourceModel && targetModel) {
            this.parent.notify(updateUndoRedoCollection, {
                args: {
                    action: 'cutPasteFormControl',
                    eventArgs: {
                        sourceId,
                        targetId: newId,
                        sourceModel,
                        targetModel
                    }
                }
            });
        }
        if (newId) {
            this.enterDesignMode(newId);
        }
    }

    private deleteFormControl(id: string, controlModel?: ExtendedFormControl): void {
        let fc: ExtendedFormControl | undefined = controlModel || this.formControls.get(id) as ExtendedFormControl;
        if (!fc) {
            for (let sheetIndex: number = 0; sheetIndex < this.parent.sheets.length; sheetIndex++) {
                const sheet: ExtendedSheet = this.parent.sheets[sheetIndex as number] as ExtendedSheet;
                if (!sheet.formControls) {
                    continue;
                }
                fc = sheet.formControls.find(
                    (control: ExtendedFormControl): boolean => control.id === id
                );
                if (fc) {
                    break;
                }
            }
        }
        if (!fc) {
            return;
        }
        const fcSnapshot: FormControlModel = this.getFormControlCopy(fc);
        const isActiveSheetControl: boolean = fc.sheetIndex === this.parent.activeSheetIndex;
        if (this.selectedControl === id) {
            this.exitDesignMode();
        }
        if (isActiveSheetControl) {
            this.destroyEjComponent(id);
            const fcEl: HTMLElement | null = document.getElementById(id);
            if (fcEl && fcEl.parentNode) {
                fcEl.parentNode.removeChild(fcEl);
            }
            this.formControls.delete(id);
        }
        const sheet: ExtendedSheet = this.parent.sheets[fc.sheetIndex] as ExtendedSheet;
        if (sheet && sheet.formControls) {
            const index: number = sheet.formControls.findIndex((control: ExtendedFormControl): boolean => control.id === id);
            if (index > -1) {
                sheet.formControls.splice(index, 1);
            }
        }
        if (!this._isUndoRedo) {
            this.parent.notify(updateUndoRedoCollection, {
                args: {
                    action: 'deleteFormControl',
                    eventArgs: {
                        fcId: id,
                        fcModel: fcSnapshot,
                        sheetIdx: fc.sheetIndex
                    }
                }
            });
        }
    }

    private onFormControlUndoRedo(args: { action: string; eventArgs: any; isUndo: boolean }): void {
        this._isUndoRedo = true;
        const eventArgs: any = args.eventArgs;
        try {
            switch (args.action) {
            case 'insertFormControl':
                if (args.isUndo) {
                    this.deleteFormControl(
                        eventArgs.fcId,
                        eventArgs.fcModel as ExtendedFormControl
                    );
                } else {
                    this.reinsertFormControl(
                        JSON.parse(JSON.stringify(eventArgs.fcModel))
                    );
                }
                break;
            case 'deleteFormControl':
                if (args.isUndo) {
                    this.reinsertFormControl(
                        JSON.parse(JSON.stringify(eventArgs.fcModel))
                    );
                } else {
                    this.deleteFormControl(
                        eventArgs.fcId,
                        eventArgs.fcModel as ExtendedFormControl
                    );
                }
                break;
            case 'cutPasteFormControl': {
                const sourceModel: ExtendedFormControl = JSON.parse(JSON.stringify(eventArgs.sourceModel));
                const targetModel: ExtendedFormControl = JSON.parse(JSON.stringify(eventArgs.targetModel));
                if (args.isUndo) {
                    this.deleteFormControl(eventArgs.targetId, targetModel);
                    this.reinsertFormControl(sourceModel);
                    if (sourceModel.sheetIndex === this.parent.activeSheetIndex) {
                        this.enterDesignMode(sourceModel.id);
                    } else if (this.selectedControl === eventArgs.targetId) {
                        this.exitDesignMode();
                    }
                } else {
                    this.deleteFormControl(eventArgs.sourceId, sourceModel);
                    this.reinsertFormControl(targetModel);
                    if (targetModel.sheetIndex === this.parent.activeSheetIndex) {
                        this.enterDesignMode(targetModel.id);
                    } else if (this.selectedControl === eventArgs.sourceId) {
                        this.exitDesignMode();
                    }
                }
                break;
            }
            case 'formControlRefresh': {
                const target: ExtendedFormControl = (args.isUndo ? eventArgs.prevModel : eventArgs.newModel) as ExtendedFormControl;
                const sheetIndex: number = target && target.sheetIndex !== undefined ? target.sheetIndex : eventArgs.sheetIdx;
                const sheet: ExtendedSheet = this.parent.sheets[sheetIndex as number] as ExtendedSheet;
                let fc: ExtendedFormControl | undefined = this.formControls.get(eventArgs.fcId) as ExtendedFormControl;
                if (!fc && sheet && sheet.formControls) {
                    fc = sheet.formControls.find((control: ExtendedFormControl): boolean => control.id === eventArgs.fcId);
                }
                if (!fc) {
                    return;
                }
                if (eventArgs.isFormat) {
                    const target: ExtendedFormControl = (args.isUndo ? eventArgs.prevModel : eventArgs.newModel) as ExtendedFormControl;
                    Object.assign(fc, target);
                    if (fc.sheetIndex === this.parent.activeSheetIndex) {
                        this.refreshFormControlVisual(eventArgs.fcId);
                    }
                    this.updateLinkedCell(fc);
                } else {
                    if (args.isUndo) {
                        fc.left = eventArgs.prevLeft;
                        fc.top = eventArgs.prevTop;
                        fc.width = eventArgs.prevWidth;
                        fc.height = eventArgs.prevHeight;
                        fc.rowIndex = eventArgs.prevRowIndex;
                        fc.colIndex = eventArgs.prevColIndex;
                    } else {
                        fc.left = eventArgs.newLeft;
                        fc.top = eventArgs.newTop;
                        fc.width = eventArgs.newWidth;
                        fc.height = eventArgs.newHeight;
                        fc.rowIndex = eventArgs.newRowIndex;
                        fc.colIndex = eventArgs.newColIndex;
                    }
                    if (fc.sheetIndex === this.parent.activeSheetIndex) {
                        const element: HTMLElement | null = document.getElementById(eventArgs.fcId);
                        if (element) {
                            const horizontalProperty: string = this.parent.enableRtl ? 'right' : 'left';
                            element.style.removeProperty(
                                this.parent.enableRtl ? 'left' : 'right'
                            );
                            element.style[horizontalProperty as any] = Number(addDPRValue(fc.left).toFixed(2)) + 'px';
                            element.style.top = Number(addDPRValue(fc.top).toFixed(2)) + 'px';
                            element.style.width = fc.width + 'px';
                            element.style.height = fc.height + 'px';
                        }
                    }
                }
                break;
            }
            }
        } finally {
            this._isUndoRedo = false;
        }
    }

    private reinsertFormControl(fc: ExtendedFormControl): void {
        const sheet: ExtendedSheet = this.parent.sheets[fc.sheetIndex] as ExtendedSheet;
        if (!sheet) {
            return;
        }
        if (!sheet.formControls) {
            sheet.formControls = [];
        }
        const alreadyExists: boolean = sheet.formControls.some((control: ExtendedFormControl): boolean => control.id === fc.id);
        if (!alreadyExists) {
            sheet.formControls.push(fc);
        }
        if (fc.sheetIndex !== this.parent.activeSheetIndex) {
            return;
        }
        this.formControls.set(fc.id, fc);
        this.destroyEjComponent(fc.id);
        const oldElement: HTMLElement | null = document.getElementById(fc.id);
        if (oldElement && oldElement.parentNode) {
            oldElement.parentNode.removeChild(oldElement);
        }
        this.renderFormControl(fc);
    }

    private calcPosition(sheet: SheetModel, indexes: number[]): { top: number; left: number } {
        const frozenRow: number = this.parent.frozenRowCount(sheet);
        const frozenCol: number = this.parent.frozenColCount(sheet);
        const pos: { top: number; dprTop: number; left: number } = getCellPosition(
            sheet, indexes, frozenRow, frozenCol,
            this.parent.viewport.beforeFreezeHeight || 0,
            this.parent.viewport.beforeFreezeWidth  || 0,
            this.parent.sheetModule.colGroupWidth   || 0,
            true
        );
        return { top: pos.top, left: pos.left };
    }

    private defaultSize(type: FormControlType): { width: number; height: number } {
        switch (type) {
        case 'CheckBox':
            return { width: 120, height: 25 };
        case 'RadioButton':
            return { width: 140, height: 25 };
        case 'DropDown':
            return { width: 120, height: 30 };
        default:
            return { width: 120, height: 22 };
        }
    }

    private getControlBaseName(type: FormControlType): string {
        switch (type) {
        case 'CheckBox':
            return 'Check Box';
        case 'RadioButton':
            return 'Option Button';
        case 'DropDown':
            return 'Drop Down';
        default:
            return 'Form Control';
        }
    }

    private updateControlNameCounter(control: ExtendedFormControl, sheetIndex: number): void {
        const baseName: string = this.getControlBaseName(control.type);
        const controlText: string = (control.text || '').trim();
        const match: RegExpMatchArray | null = controlText.match(/^(.+?)\s+(\d+)$/);
        if (!match || match[1].toLocaleLowerCase() !== baseName.toLocaleLowerCase()) {
            return;
        }
        const controlCount: number = parseInt(match[2], 10);
        const counterKey: string = sheetIndex + ':' + control.type;
        const currentCount: number = this.controlNameCounters.get(counterKey) || 0;
        if (controlCount > currentCount) {
            this.controlNameCounters.set(counterKey, controlCount);
        }
    }

    private getNextControlName(type: FormControlType, sheetIndex: number): string {
        const counterKey: string = sheetIndex + ':' + type;
        const nextCount: number = (this.controlNameCounters.get(counterKey) || 0) + 1;
        this.controlNameCounters.set(counterKey, nextCount);
        return this.getControlBaseName(type) + ' ' + nextCount;
    }

    private defaultProps(type: FormControlType, sheetIndex: number): object {
        switch (type) {
        case 'CheckBox':
            return {
                value: 'Unchecked',
                text: this.getNextControlName(type, sheetIndex)
            };
        case 'RadioButton':
            return {
                value: 'Unchecked',
                text: this.getNextControlName(type, sheetIndex)
            };
        case 'DropDown':
            return {
                inputRange: '',
                selectedIndex: -1,
                text: this.getNextControlName(type, sheetIndex)
            };
        default:
            return {};
        }
    }

    private generateId(type: FormControlType, sheetIdx: number): string {
        return this.parent.element.id + '_FC_' + type + '_' + sheetIdx + '_' + getUniqueID('fc');
    }

    private addEventListener(): void {
        this.parent.on(insertFormControl, (args: { formControl?: FormControlModel[]; type?: FormControlType; range?: string;
            sheetIndex?: number; }): void => {
            if (!args) {
                return;
            }
            if (args.type && args.range) {
                this.insertFormControl(args.type, args.range, args.sheetIndex);
                return;
            }
            if (!Array.isArray(args.formControl) || !args.formControl.length) {
                return;
            }
            const sheetIndex: number = args.sheetIndex !== undefined ? args.sheetIndex : this.parent.activeSheetIndex;
            const sheet: SheetModel = this.parent.sheets[sheetIndex as number];
            if (!sheet) {
                return;
            }
            args.formControl.forEach(
                (control: FormControlModel): void => {
                    if (!control || ['CheckBox', 'RadioButton', 'DropDown'].indexOf(control.type) === -1) {
                        return;
                    }
                    this.insertFormControl(control.type, '', sheetIndex, control);
                }
            );
        });
        this.parent.on(cellSave, this.onCellValueChanged, this);
        this.parent.on(activeSheetChanged, this.onActiveSheetChanged, this);
        this.parent.on(contentLoaded, this.onContentLoaded, this);
        this.parent.on(virtualContentLoaded, this.onContentLoaded, this);
        this.parent.on(importModelUpdate, this.updateFormControlsFromSheet, this);
        this.parent.on(cMenuBeforeOpen, this.cMenuBeforeOpenHandler, this);
        this.parent.on(formControlUndoRedo, this.onFormControlUndoRedo, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(insertFormControl);
            this.parent.off(cellSave, this.onCellValueChanged);
            this.parent.off(activeSheetChanged, this.onActiveSheetChanged);
            this.parent.off(contentLoaded, this.onContentLoaded);
            this.parent.off(virtualContentLoaded, this.onContentLoaded);
            this.parent.off(importModelUpdate, this.updateFormControlsFromSheet);
            this.parent.off(cMenuBeforeOpen, this.cMenuBeforeOpenHandler);
            this.parent.off(formControlUndoRedo, this.onFormControlUndoRedo);
            if (this._onCtxMenuItemSelect) {
                this.parent.removeEventListener('contextMenuItemSelect', this._onCtxMenuItemSelect as Function);
            }
        }
    }

    public destroy(): void {
        document.removeEventListener('mousemove', this._onDocMove);
        document.removeEventListener('mouseup', this._onDocUp);
        document.removeEventListener('click', this._onDocClick, true);
        document.removeEventListener('keydown', this._onDocKey, true);
        this.removeEventListener();
        this.formControls.forEach((_fc: FormControlModel, id: string) => {
            this.destroyEjComponent(id);
        });
        this.ejComponents.clear();
        this.formControls.clear();
        this.controlNameCounters.clear();
        this.selectedControl = null;
        this.clipboardFormControl = null;
        this.clipboardMode = null;
        this.drag = null;
        this.resize = null;
        this._contextMenuFc = null;
        this._fcMenuActive = false;
        this.parent = null;
    }
}
