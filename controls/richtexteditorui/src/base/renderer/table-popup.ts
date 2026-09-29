import { EventHandler, L10n, detach, getUniqueID } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { Popup, PopupModel } from '@syncfusion/ej2-popups';
import { RichTextEditorUI } from '../../richtexteditor-ui/richtexteditor-ui';
import * as classes from '../../common/classes';
import { tableLocale } from '../../richtexteditor-ui/model/default-locale';
import * as constant from '../../common/constant';

/**
 * Grid dimensions rendered inside the Table insertion popup.
 */
export const TABLE_POPUP_ROWS: number = 3;
export const TABLE_POPUP_COLS: number = 10;

/**
 * Public callback contract the parent module wires up when constructing a
 * `TablePopup`. The popup never mutates the contenteditable descendants —
 * it reports decision events to the module, which routes through the
 * controller and the headless `insertTableCommand`.
 */
export interface TablePopupCallbacks {
    /**
     * Fires when the user clicks a grid cell, presses `Enter`, or otherwise
     * commits a dimensions selection. Indices are 1-indexed.
     */
    onInsert(row: number, col: number): void;

    /**
     * Fires when the user activates the bottom Insert Table button.
     */
    onOpenDialog(): void;

    /**
     * Fires when the popup wants to resolve a localized string. The module
     * supplies this so callers can override the default table locale.
     */
    resolve(key: string): string;
}

/**
 * Row × column grid selection popup used by the Toolbar's `Table` button.
 * Renders a 3 × 10 grid, a dimension header, and an Insert Table button,
 * hosted inside a Syncfusion `Popup` for positioning and collision
 * handling.
 *
 * The popup is owned by the Table module and destroyed when the editor is
 * destroyed.
 */
export class TablePopup {
    private parent: RichTextEditorUI;
    private locale: L10n;
    private anchor: HTMLElement | null;
    private callbacks: TablePopupCallbacks;
    private root: HTMLElement | null = null;
    private header: HTMLElement | null = null;
    private grid: HTMLElement | null = null;
    private insertBtnInstance: Button | null = null;
    private documentClickHandler: (e: Event) => void;
    private focusableCells: HTMLElement[] = [];
    private isShown: boolean = false;
    private focusedCell: { row: number; col: number } = { row: 0, col: 0 };
    private isDestroyed: boolean = false;
    private popup: Popup | null = null;

    constructor(parent: RichTextEditorUI, locale: L10n, anchor: HTMLElement | null, callbacks: TablePopupCallbacks) {
        this.parent = parent;
        this.locale = locale;
        this.anchor = anchor;
        this.callbacks = callbacks;
        this.documentClickHandler = this.onDocumentClick.bind(this);
    }

    /**
     * Renders and shows the popup anchored to the toolbar item. Idempotent
     * — calling `show` when already shown is a no-op.
     *
     * @returns {void}
     */
    public show(): void {
        this.render();
        const tableItem: HTMLElement = this.parent.toolbarModule.element.querySelector('#' + this.parent.element.id + '_toolbar_Table');
        const popupModel: PopupModel = {
            targetType: 'relative',
            relateTo: tableItem,
            collision: { X: 'fit', Y: 'none' },
            offsetY: 8,
            viewPortElement: this.parent.element,
            position: { X: 'left', Y: 'bottom' },
            enableRtl: !!this.parent.enableRtl,
            zIndex: 10001,
            close: () => this.teardown()
        };
        this.parent.toolbarModule.element.parentElement.appendChild(this.root);
        this.popup = new Popup(this.root, popupModel);
        this.popup.show();
        this.popup.refreshPosition(tableItem);
        this.isShown = true;
        this.parent.on(constant.documentMouseDown, this.documentClickHandler, this);
        if (this.grid && this.focusableCells.length > 0) {
            this.focusableCells[0].focus();
            this.focusableCells[0].classList.add('e-active');
        }
    }

    /**
     * Removes the popup and returns focus to the anchor.
     *
     * @returns {void}
     */
    public hide(): void {
        if (this.popup) {
            detach(this.popup.element);
            this.popup.hide();
        }
        this.isShown = false;
        this.parent.off(constant.documentMouseDown, this.documentClickHandler);
        if (this.anchor && typeof this.anchor.focus === 'function') {
            this.anchor.focus({ preventScroll: true });
        }
    }

    /**
     * Detaches all listeners, tears down the underlying `Popup`, removes
     * the popup from the DOM, and disables the instance for further use.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.teardown();
        this.isDestroyed = true;
    }

    /**
     * Indicates whether the popup is currently attached.
     *
     * @returns {boolean} `true` when the popup is shown.
     */
    public isVisible(): boolean {
        return this.isShown;
    }

    private teardown(): void {
        this.parent.off(constant.documentMouseDown, this.documentClickHandler);
        this.removeAllCellListeners();
        if (this.popup) {
            this.popup.destroy();
            this.popup = null;
        }
        if (this.insertBtnInstance) {
            this.insertBtnInstance.destroy();
            this.insertBtnInstance = null;
        }
        this.grid = null;
        this.header = null;
        this.root = null;
        this.focusableCells = [];
    }

    private render(): void {
        const id: string = getUniqueID(this.parent.element.id + '_TablePopup');
        this.root = this.parent.createElement('div', {
            id: id
        });
        this.root.classList.add(
            classes.CLS_RTE_UI_TABLE_POPUP, 'e-rte-ui-elements'
        );
        this.header = this.parent.createElement('div', {
            className: classes.CLS_RTE_UI_TABLE_POPUP_HEADER
        });
        this.header.textContent = '1 x 1';
        this.root.appendChild(this.header);
        this.grid = this.parent.createElement('div', {
            className: classes.CLS_RTE_UI_TABLE_POPUP_GRID
        });
        this.grid.setAttribute('role', 'grid');
        this.root.appendChild(this.grid);
        this.renderGrid();
        this.root.appendChild(this.parent.createElement('span', {
            className: 'e-span-border'
        }));
        this.renderInsertButton();
    }

    private renderGrid(): void {
        for (let r: number = 0; r < TABLE_POPUP_ROWS; r++) {
            const rowEl: HTMLElement = this.parent.createElement('div', {
                className: 'e-rte-table-row'
            });
            for (let c: number = 0; c < TABLE_POPUP_COLS; c++) {
                const cell: HTMLElement = this.parent.createElement('div', {
                    className: classes.CLS_RTE_UI_TABLE_POPUP_GRIDCELL
                });
                cell.setAttribute('role', 'gridcell');
                cell.setAttribute('tabindex', '-1');
                cell.setAttribute('data-row', String(r));
                cell.setAttribute('data-col', String(c));
                EventHandler.add(cell, 'mousemove', this.onCellMouseMove, this);
                EventHandler.add(cell, 'mouseup', this.onCellMouseUp, this);
                rowEl.appendChild(cell);
                this.focusableCells.push(cell);
            }
            this.grid.appendChild(rowEl);
        }
    }

    private renderInsertButton(): void {
        const btnWrapper: HTMLButtonElement = this.parent.createElement('button', {
            className: 'e-insert-table-btn',
            attrs: { type: 'button', tabindex: '0' }
        }) as HTMLButtonElement;
        const localized: string = this.callbacks.resolve('inserttablebtn');
        this.root.appendChild(btnWrapper);
        // Wrap with Syncfusion Button for consistent theming and lifecycle support.
        this.insertBtnInstance = new Button({
            iconCss: 'e-icons e-table',
            iconPosition: 'Left',
            cssClass: 'e-flat',
            content: localized,
            enableRtl: !!this.parent.enableRtl
        });
        this.insertBtnInstance.appendTo(btnWrapper);
        EventHandler.add(btnWrapper, 'click', this.onInsertButtonClick, this);
    }

    private onCellMouseMove(e: { target: HTMLElement }): void {
        const cell: HTMLElement = e.target;
        const r: number = parseInt(cell.getAttribute('data-row'), 10);
        const c: number = parseInt(cell.getAttribute('data-col'), 10);
        this.focusedCell = { row: r, col: c };
        this.activeFocusedCell(r, c);
    }

    private onCellMouseUp(e: { target: HTMLElement }): void {
        const cell: HTMLElement = e.target;
        const r: number = parseInt(cell.getAttribute('data-row'), 10);
        const c: number = parseInt(cell.getAttribute('data-col'), 10);
        this.commitInsert(r + 1, c + 1);
    }

    private onInsertButtonClick(): void {
        this.hide();
        this.callbacks.onOpenDialog();
    }

    private onDocumentClick(e: Event): void {
        const target: Node = (e as any).originalEvent.target as Node;
        if (this.root && target && this.root.contains(target)) {
            return;
        }
        this.hide();
    }

    private activeFocusedCell(row: number, col: number): void {
        if (this.header) {
            this.header.textContent = (col + 1) + ' x ' + (row + 1);
        }
        for (let r: number = 0; r < TABLE_POPUP_ROWS; r++) {
            for (let c: number = 0; c < TABLE_POPUP_COLS; c++) {
                const idx: number = r * TABLE_POPUP_COLS + c;
                const cell: HTMLElement = this.focusableCells[idx as number];
                if (r <= row && c <= col) {
                    if (cell.className.indexOf(classes.CLS_ACTIVE) === -1) {
                        cell.className += ' ' + classes.CLS_ACTIVE;
                    }
                } else if (cell.className.indexOf(classes.CLS_ACTIVE) !== -1) {
                    cell.className = cell.className.replace(' ' + classes.CLS_ACTIVE, '');
                }
            }
        }
    }

    private removeAllCellListeners(): void {
        for (let i: number = 0; i < this.focusableCells.length; i++) {
            EventHandler.remove(this.focusableCells[i as number], 'mousemove', this.onCellMouseMove);
            EventHandler.remove(this.focusableCells[i as number], 'mouseup', this.onCellMouseUp);
        }
    }

    private commitInsert(rows: number, cols: number): void {
        this.hide();
        this.callbacks.onInsert(rows, cols);
    }

    private keyDownHandler(e: KeyboardEvent): void {
        const key: string = e.key;
        if (key === 'ArrowRight' && this.focusedCell.col < TABLE_POPUP_COLS - 1) {
            this.focusedCell.col++;
        } else if (key === 'ArrowLeft' && this.focusedCell.col > 0) {
            this.focusedCell.col--;
        } else if (key === 'ArrowDown' && this.focusedCell.row < TABLE_POPUP_ROWS - 1) {
            this.focusedCell.row++;
        } else if (key === 'ArrowUp' && this.focusedCell.row > 0) {
            this.focusedCell.row--;
        } else if (key === 'Enter') {
            this.commitInsert(this.focusedCell.row + 1, this.focusedCell.col + 1);
            return;
        } else if (key === 'Escape') {
            this.hide();
            return;
        } else if (key === 'Tab') {
            if (this.insertBtnInstance && this.insertBtnInstance.element) {
                this.insertBtnInstance.element.focus();
            }
            e.preventDefault();
            return;
        } else {
            return;
        }
        e.preventDefault();
        this.activeFocusedCell(this.focusedCell.row, this.focusedCell.col);
        const nextCell: HTMLElement = this.focusableCells[this.focusedCell.row * TABLE_POPUP_COLS + this.focusedCell.col];
        if (nextCell) {
            nextCell.focus();
        }
    }

    /**
     * Forwards the keyboard event to the popup's keydown handler. The
     * module only pipes events while the popup is shown.
     *
     * @param {KeyboardEvent} e - The DOM keyboard event.
     * @returns {void}
     */
    public handleKeyDown(e: KeyboardEvent): void {
        this.keyDownHandler(e);
    }
}
