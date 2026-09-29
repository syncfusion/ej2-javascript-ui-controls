import { EventHandler, L10n, getUniqueID, isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextEditorUI } from '../richtexteditor-ui';
import { DialogType } from '../../common/enum';
import { EditorDialog, EditorDialogModel } from '../../base/renderer/editor-dialog';
import { TablePopup } from '../../base/renderer/table-popup';
import { BaseModule } from './base-module';
import { BaseQuickToolbar } from '../../base/renderer/base-quick-toolbar';
import { EditorController } from '../../controller/editor-controller';
import { tableLocale } from '../model/default-locale';
import * as events from '../../common/constant';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import * as constant from '../../common/constant';

// Manages table insertion, quick toolbar actions, and related UI.
export class TableModule extends BaseModule {
    private tablePopup: TablePopup | null = null;
    public tableDialog: EditorDialog | null = null;
    private currentAnchor: HTMLElement | null = null;
    private columnTextBox: NumericTextBox | null = null;
    private rowTextBox: NumericTextBox | null = null;
    private isTableinsertion: boolean = false;

    constructor(parent: RichTextEditorUI, locale: L10n) {
        super(parent, locale);
        this.parent.tableModule = this;
    }

    public getModuleName(): string {
        return 'table';
    }

    private tableInsertCallback?: () => void;

    protected addEventListener(): void {
        EventHandler.add(document, 'keydown', this.onDocumentKeyDown, this);
        this.parent.on(events.insertTable, this.onTableClick, this);
        this.parent.on(events.editorKeydown, this.onKeyboardShortcut, this);
        this.parent.on(events.editorMouseup, this.editorMouseUpHandler, this);
        this.parent.on(events.insertCompleted, this.insertCompletedHandler, this);
        this.parent.on(events.closeTableDialog, this.closeTableDialog, this);
    }

    protected removeEventListener(): void {
        EventHandler.remove(document, 'keydown', this.onDocumentKeyDown);
        this.parent.off(events.insertTable, this.onTableClick);
        this.parent.off(events.editorKeydown, this.onKeyboardShortcut);
        this.parent.off(events.editorMouseup, this.editorMouseUpHandler);
        this.parent.off(events.insertCompleted, this.insertCompletedHandler);
        this.parent.off(events.closeTableDialog, this.closeTableDialog);
    }

    /**
     * Document-level keydown bridge. Reads the current popup reference and
     * forwards to `TablePopup.handleKeyDown` when the popup is visible.
     * Bound to the module instance via the `bindTo` argument on
     * `EventHandler.add`, so `this.tablePopup` resolves to the correct
     * module field at call time.
     *
     * @param {KeyboardEvent} e - The DOM keyboard event bubbling to document.
     * @returns {void}
     */
    private onDocumentKeyDown(e: KeyboardEvent): void {
        if (this.tablePopup && this.tablePopup.isVisible()) {
            this.tablePopup.handleKeyDown(e);
        }
    }

    private closeTableDialog(): void {
        if (this.tableDialog && this.tableDialog.element &&
            this.parent.element.ownerDocument.contains(this.tableDialog.element)) {
            this.tableDialog.hide();
        }
    }
    protected destroyModule(): void {
        if (this.tablePopup) {
            this.tablePopup.destroy();
            this.tablePopup = null;
        }
        if (this.tableDialog) {
            this.tableDialog.hide();
            this.tableDialog.destroy();
            this.tableDialog = null;
        }
        this.columnTextBox?.destroy();
        this.rowTextBox?.destroy();

        this.columnTextBox = null;
        this.rowTextBox = null;
        this.removeEventListener();
    }


    /*
     * Shows the table popup and stores the insert callback.
     *
     * @param {{ callBack?: () => void }} args - Table action arguments.
     * @returns {void}
     */
    public onTableClick(args: { callBack?: () => void }): void {
        if (this.tablePopup && this.tablePopup.isVisible()) {
            this.tablePopup.hide();
            return;
        }
        // Capture callback coming from EditorController
        if ((args as { callBack?: () => void }).callBack) {
            this.tableInsertCallback = (args as { callBack?: () => void }).callBack;
        }
        if (!this.currentAnchor && this.parent.toolbarModule && this.parent.toolbarModule.element) {
            this.currentAnchor = this.parent.toolbarModule.element.querySelector(
                '#' + this.parent.element.id + '_toolbar_Table'
            );
        }
        this.tablePopup = new TablePopup(this.parent, this.locale, this.currentAnchor, {
            onInsert: (rows: number, cols: number) => this.commitInsert({ rows: rows, columns: cols }),
            onOpenDialog: () => this.openInsertDialog(this.currentAnchor as HTMLElement),
            resolve: (key: string) => this.resolveKey(key)
        });
        this.tablePopup.show();
    }

    // Opens the Insert Table dialog from a keyboard shortcut.
    private onKeyboardShortcut(args: { originalEvent?: KeyboardEvent; action?: string }): void {
        if (!this.parent.enable) {
            return;
        }
        if (this.parent.readonly) {
            return;
        }
        if (!this.parent.isSelectionInRTE()) {
            return;
        }
        if (!args || args.action !== 'table') {
            return;
        }
        const event: KeyboardEvent | undefined = args.originalEvent;
        if (!event) {
            return;
        }
        if (typeof event.preventDefault === 'function') {
            event.preventDefault();
        }
        // anchor is currently set.
        let anchor: HTMLElement | null = this.currentAnchor;
        if (!anchor && this.parent.toolbarModule && this.parent.toolbarModule.element) {
            anchor = this.parent.toolbarModule.element.querySelector(
                '#' + this.parent.element.id + '_toolbar_Table'
            );
        }
        this.currentAnchor = anchor;
        this.openInsertDialog(anchor);
    }

    /*
     * Routes the insertion through `EditorController.execute`, which fans out
     * to the `Table` core plugin and the headless `insertTableCommand`.
     *
     * @param {{rows: number; columns: number}} payload - The dimensions the user selected.
     * @returns {void}
     */
    private commitInsert(payload: { rows: number; columns: number }): void {
        const controller: EditorController = this.parent.editorController;
        controller.execute('insertTable', payload, this.parent);
        if (this.tableInsertCallback) {
            this.tableInsertCallback();
            this.tableInsertCallback = undefined;
        }
    }

    /**
     * Render the Insert Table dialog with two numeric inputs and Insert /
     * Cancel buttons. Insert is gated by the bound numeric validation.
     *
     * @param {HTMLElement} anchor - The toolbar anchor element used for focus return.
     * @returns {void}
     */
    private openInsertDialog(anchor: HTMLElement): void {
        const id: string = getUniqueID(this.parent.element.id + '_InsertTableDialog');
        const dialogHeader: string = this.resolveKey('tabledialogHeader');
        const columnPlaceholder: string = this.resolveKey('columns');
        const rowPlaceholder: string = this.resolveKey('rows');
        const insertLabel: string = this.resolveKey('dialogInsert');
        const cancelLabel: string = this.resolveKey('dialogCancel');
        const content: string =
    '<div id="' + id + '_col_parent" class="e-rte-field">' +
        '<input type="text" id="' + id + '_col" data-role="none" />' +
    '</div>' +
    '<div id="' + id + '_row_parent" class="e-rte-field">' +
        '<input type="text" id="' + id + '_row" data-role="none" />' +
    '</div>';
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self: TableModule = this;
        const isTesting: boolean = this.parent.element && this.parent.element.dataset && this.parent.element.dataset.rteUnitTesting === 'true';
        const dialogModel: EditorDialogModel = {
            subType: DialogType.InsertTable,
            header: dialogHeader,
            content: content,
            width: '290px',
            cssClass: 'e-rte-ui-insert-table-dialog',
            animationSettings: isTesting ? { effect: 'None', duration: 0 } : { effect: 'None' },
            buttons: [
                {
                    click: (eventArgs: { element?: HTMLElement }) => self.applyInsert(eventArgs),
                    buttonModel: {
                        content: insertLabel,
                        cssClass: 'e-flat e-insert-table',
                        isPrimary: true
                    }
                },
                {
                    click: (eventArgs: { element?: HTMLElement }) => self.cancel(eventArgs),
                    buttonModel: {
                        content: cancelLabel,
                        cssClass: 'e-flat e-cancel'
                    }
                }
            ]
        };
        const target: HTMLElement = this.parent.element;
        this.tableDialog = new EditorDialog(this.parent, id, target, dialogModel);
        const root: HTMLElement | null = document.getElementById(id);

        if (root) {

            this.columnTextBox = new NumericTextBox({
                format: 'n0',
                min: 1,
                max: 50,
                value: 3,
                placeholder: columnPlaceholder,
                floatLabelType: 'Auto',
                enableRtl: this.parent.enableRtl,
                locale: this.parent.locale,
                cssClass: this.parent.getCssClass()
            });

            this.columnTextBox.isStringTemplate = true;
            this.columnTextBox.appendTo(
                root.querySelector('#' + id + '_col') as HTMLElement
            );

            this.rowTextBox = new NumericTextBox({
                format: 'n0',
                min: 1,
                max: 100,
                value: 3,
                placeholder: rowPlaceholder,
                floatLabelType: 'Auto',
                enableRtl: this.parent.enableRtl,
                locale: this.parent.locale,
                cssClass: this.parent.getCssClass()
            });

            this.rowTextBox.isStringTemplate = true;
            this.rowTextBox.appendTo(
                root.querySelector('#' + id + '_row') as HTMLElement
            );

            this.bindNumericGating();
        }
        this.tableDialog.show();
        this.tableDialog.dialog.element.style.maxHeight = 'none';
    }

    /**
     * Disables the Insert dialog button while either numeric input is empty
     * or non-positive.
     *
     * @param {HTMLElement} root - The dialog content element.
     * @param {string} id - The unique id prefix shared by the inputs.
     * @returns {void}
     */

    private bindNumericGating(): void {
        const validate: () => void = () => {
            const colVal: number = this.columnTextBox.value;
            const rowVal: number = this.rowTextBox.value;
            const ok: boolean =
                !isNaN(colVal) &&
                !isNaN(rowVal) &&
                colVal > 0 &&
                rowVal > 0;

            this.setPrimaryEnabled(ok);
        };
        this.columnTextBox.addEventListener('change', validate);
        this.rowTextBox.addEventListener('change', validate);
        validate();
    }
    /**
     * Toggles the Insert button on the active dialog.
     *
     * @param {boolean} enabled - `true` enables the button.
     * @returns {void}
     */
    private setPrimaryEnabled(enabled: boolean): void {
        const root: HTMLElement | null = document.getElementById(this.tableDialog.id);
        const btn: HTMLButtonElement | null = root.querySelector('button.e-insert-table');
        btn.disabled = !enabled;
    }

    /*
     * Dialog Insert action. Reads the current numeric inputs, performs
     * the controller commit, and closes the dialog.
     *
     * @returns {void}
     */
    private applyInsert(_e?: { element?: HTMLElement }): void {
        const cols: number = this.columnTextBox.value;
        const rows: number = this.rowTextBox.value;
        this.commitInsert({ rows: rows, columns: cols });
        this.tableDialog.hide();
        this.tableDialog.destroy();
        this.tableDialog = null;
    }

    /*
     * Dialog Cancel action. Closes the dialog without committing.
     *
     * @returns {void}
     */
    private cancel(_e?: { element?: HTMLElement }): void {
        this.tableDialog.hide();
        this.tableDialog.destroy();
        this.tableDialog = null;
        this.columnTextBox.destroy();
        this.rowTextBox.destroy();

        this.columnTextBox = null;
        this.rowTextBox = null;
    }

    /**
     * Resolves a localization key from the editor's `L10n` instance first,
     * then falls back to the default English table locale.
     *
     * @param {string} key - The locale key (e.g. `'tabledialogHeader'`).
     * @returns {string} The resolved string for the key.
     */
    private resolveKey(key: string): string {
        const fromEditor: string = this.locale.getConstant(key);
        if (fromEditor) {
            return fromEditor;
        }
        const map: { [key: string]: string } = tableLocale;
        return map[key as string];
    }

    // Show the Table Quick Toolbar when the cursor is in a table.
    private editorMouseUpHandler(args: { originalEvent?: MouseEvent }): void {
        this.showTableQuickToolbar(args && args.originalEvent);
    }

    // Show the Table Quick Toolbar after inserting a table.
    private insertCompletedHandler(args: {
        args?: { action?: string };
        event?: MouseEvent | KeyboardEvent;
    }): void {
        // Only handle table insert actions.
        if (!args || !args.args || args.args.action !== 'table') {
            return;
        }
        this.isTableinsertion = true;
        this.showTableQuickToolbar(args.event);
    }

    // Show or hide the Table Quick Toolbar based on the current table selection.
    private showTableQuickToolbar(originalEvent?: MouseEvent | KeyboardEvent): void {
        if (!this.parent.toolbarSettings.enable) {
            return;
        }
        const tableElement: HTMLTableElement | null = this.selectedTableElement();
        const tableToolbar: BaseQuickToolbar | null = this.parent.quickToolbarModule.getToolbar('Table');
        if (!tableElement && tableToolbar && document.body.contains(tableToolbar.element)) {
            tableToolbar.hidePopup();
        } else if (tableElement) {
            tableToolbar.showPopup(tableElement, originalEvent);
        }
    }

    // Returns the table containing the current selection, if any.
    private selectedTableElement(): HTMLTableElement | null {
        let selectedBlock: HTMLElement = this.parent.editorController.getSelectedBlockElem();
        if (selectedBlock.nodeName === 'P' && selectedBlock.nextElementSibling && this.isTableinsertion) {
            selectedBlock = selectedBlock.nextElementSibling as HTMLElement;
            this.isTableinsertion = false;
        }
        const tableWrapper: HTMLElement | null = selectedBlock.classList?.contains('tableWrapper') ? selectedBlock : selectedBlock.closest('.tableWrapper');
        if (!tableWrapper) {
            return null;
        }
        return tableWrapper.querySelector('table');
    }
}
