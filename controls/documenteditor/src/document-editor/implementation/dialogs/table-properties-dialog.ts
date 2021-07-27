import { Dialog } from '@syncfusion/ej2-popups';
import { createElement, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { WTableFormat, WRowFormat, WCellFormat } from '../format/index';
import { TableAlignment, WidthType, HeightType, CellVerticalAlignment } from '../../base/types';
import { Selection } from '../index';
import { CheckBox, RadioButton, ChangeArgs } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Tab, TabItemModel } from '@syncfusion/ej2-navigations';
import { SelectionRowFormat, SelectionTableFormat, SelectionCellFormat } from '../index';
import { TableWidget, TableCellWidget } from '../viewer/page';
import { classList } from '@syncfusion/ej2-base';
import { HelperMethods } from '../editor/editor-helper';
import { EditorHistory } from '../editor-history/index';
import { TextPosition } from '../selection';
import { DocumentHelper } from '../viewer';

/**
 * The Table properties dialog is used to modify properties of selected table.
 */
export class TablePropertiesDialog {
    private dialog: Dialog;
    private target: HTMLElement;
    private cellAlignment: HTMLDivElement;
    private tableAlignment: HTMLDivElement;
    public documentHelper: DocumentHelper;
    private preferCheckBox: CheckBox;
    private tableWidthType: DropDownList;
    private preferredWidth: HTMLInputElement;
    private rowHeightType: DropDownList;
    private rowHeightCheckBox: CheckBox;
    private rowHeight: HTMLInputElement;
    private cellWidthType: DropDownList;
    private preferredCellWidthCheckBox: CheckBox;
    private preferredCellWidth: HTMLInputElement;
    private tableTab: HTMLDivElement;
    private rowTab: HTMLDivElement;
    private cellTab: HTMLDivElement;
    private left: HTMLDivElement;
    private center: HTMLDivElement;
    private right: HTMLDivElement;
    private leftIndent: HTMLInputElement;
    private allowRowBreak: CheckBox;
    private repeatHeader: CheckBox;
    private cellTopAlign: HTMLDivElement;
    private cellCenterAlign: HTMLDivElement;
    private cellBottomAlign: HTMLDivElement;
    private indentingLabel: HTMLLabelElement;

    private hasTableWidth: boolean = false;
    private hasCellWidth: boolean = false;
    private bidi: boolean = false;
    /**
     * @private
     */
    public isTableBordersAndShadingUpdated: boolean = false;
    /**
     * @private
     */
    public isCellBordersAndShadingUpdated: boolean = false;
    private tableFormatIn: WTableFormat;
    private rowFormatInternal: WRowFormat;
    private cellFormatIn: WCellFormat;
    private tableWidthBox: NumericTextBox;
    private rowHeightBox: NumericTextBox;
    private cellWidthBox: NumericTextBox;
    private leftIndentBox: NumericTextBox;
    private bordersAndShadingButton: HTMLButtonElement;
    private tableOptionButton: HTMLButtonElement;
    private cellOptionButton: HTMLButtonElement;
    private rowHeightValue: number;
    private tabObj: Tab = undefined;
    private rtlButton: RadioButton;
    private ltrButton: RadioButton;
    private localValue: L10n = undefined;
    /**
     * @private
     */
    public isCellOptionsUpdated: boolean = false;
    /**
     * @private
     */
    public isTableOptionsUpdated: boolean = false;

    private get cellFormat(): WCellFormat {
        if (isNullOrUndefined(this.cellFormatIn)) {
            return this.cellFormatIn = new WCellFormat();
        }
        return this.cellFormatIn;
    }

    private set cellFormat(value: WCellFormat) {
        this.cellFormatIn = value;
    }

    private get tableFormat(): WTableFormat {
        if (isNullOrUndefined(this.tableFormatIn)) {
            this.tableFormatIn = new WTableFormat();
            return this.tableFormatIn;
        }
        return this.tableFormatIn;
    }

    private set tableFormat(value: WTableFormat) {
        this.tableFormatIn = value;
    }

    private get rowFormat(): WRowFormat {
        if (isNullOrUndefined(this.rowFormatInternal)) {
            this.rowFormatInternal = new WRowFormat();
            return this.rowFormatInternal;
        }
        return this.rowFormatInternal;
    }
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    private getModuleName(): string {
        return 'TablePropertiesDialog';
    }
    /**
     * @private
     * @param {L10n} localValue - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    public initTablePropertyDialog(localValue: L10n, isRtl?: boolean): void {
        this.localValue = localValue;
        const id: string = this.documentHelper.owner.containerId + '_TablePropertiesDialog';
        this.target = createElement('div', { id: id, className: 'e-de-table-properties-dlg' });
        const ejtabContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_TabContainer' });
        this.target.appendChild(ejtabContainer);
        this.tableTab = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_TablePropertiesContentDialogTab', className: 'e-de-table-ppty-dlg-tabs'
        });
        this.rowTab = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_RowPropertiesDialogTab', className: 'e-de-table-ppty-dlg-tabs'
        });
        this.cellTab = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_CellPropertiesDialogTab', className: 'e-de-table-ppty-dlg-tabs'
        });
        const separatorLine: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dialog-separator-line' });
        const ejtab: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_TablePropertiesDialogTab', className: 'e-de-table-ppty-tab' });
        const headerContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-tab-header' });
        const tableHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_tableHeader', innerHTML: localValue.getConstant('Table')
        });
        const rowHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_rowHeader', innerHTML: localValue.getConstant('Row')
        });
        const cellHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_cellHeader', innerHTML: localValue.getConstant('Cell')
        });
        headerContainer.appendChild(tableHeader); headerContainer.appendChild(rowHeader);
        headerContainer.appendChild(cellHeader);
        const tableContent: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_tableContent' });
        const rowContent: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_rowContent' });
        const cellContent: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_cellContent' });
        const items: TabItemModel[] = [
            { header: { text: tableHeader }, content: tableContent },
            { header: { text: rowHeader }, content: rowContent },
            { header: { text: cellHeader }, content: cellContent }];
        tableContent.appendChild(this.tableTab);
        rowContent.appendChild(this.rowTab);
        cellContent.appendChild(this.cellTab);
        ejtabContainer.appendChild(ejtab);
        this.initTableProperties(this.tableTab, localValue, this.documentHelper.owner.enableRtl);
        this.initTableRowProperties(this.rowTab, localValue, this.documentHelper.owner.enableRtl);
        this.initTableCellProperties(this.cellTab, localValue, this.documentHelper.owner.enableRtl);
        this.tabObj = new Tab({ items: items, enableRtl: isRtl }, ejtab);
        this.tabObj.isStringTemplate = true;
        this.target.appendChild(separatorLine);
        const alignMentButtons: HTMLCollectionOf<Element> = this.tableTab.getElementsByClassName(this.tableTab.id + 'e-de-table-alignment');
        for (let i: number = 0; i < alignMentButtons.length; i++) {
            (alignMentButtons[i] as HTMLElement).addEventListener('click', this.changeTableAlignment);
        }
        const cellAlignment: HTMLCollectionOf<Element> = this.cellTab.getElementsByClassName(this.cellTab.id + 'e-de-table-cell-alignment');
        for (let i: number = 0; i < cellAlignment.length; i++) {
            cellAlignment[i].addEventListener('click', this.changeCellAlignment);
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        const localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initTablePropertyDialog(localValue, this.documentHelper.owner.enableRtl);
        }

        if (this.documentHelper.selection.caret.style.display !== 'none') {
            this.documentHelper.selection.caret.style.display = 'none';
        }
        this.documentHelper.dialog2.header = localValue.getConstant('Table Properties');
        this.documentHelper.dialog2.position = { X: 'center', Y: 'center' };
        this.documentHelper.dialog2.width = 'auto';
        this.documentHelper.dialog2.height = 'auto';
        this.documentHelper.dialog2.content = this.target;
        this.documentHelper.dialog2.beforeOpen = this.onBeforeOpen;
        this.documentHelper.dialog2.close = this.onCloseTablePropertyDialog;
        this.documentHelper.dialog2.open = this.wireEvent.bind(this);
        this.documentHelper.dialog2.buttons = [{
            click: this.applyTableProperties,
            buttonModel: { content: localValue.getConstant('Ok'), cssClass: 'e-flat e-table-ppty-okay', isPrimary: true }
        },
        {
            click: this.closeTablePropertiesDialog,
            buttonModel: { content: localValue.getConstant('Cancel'), cssClass: 'e-flat e-table-ppty-cancel' }
        }];
        //this.tabObj.select(0);
        this.documentHelper.dialog2.dataBind();
        this.documentHelper.dialog2.show();
    }
    /**
     * @returns {void}
     */
    private onBeforeOpen = (): void => {
        this.documentHelper.updateFocus();
        this.loadTableProperties();
    };
    /**
     * @private
     * @returns {void}
     */
    public onCloseTablePropertyDialog = (): void => {
        this.unWireEvent.bind(this);
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     * @returns {void}
     */
    public applyTableProperties = (): void => {
        const selection: Selection = this.documentHelper.selection;
        if (!this.preferCheckBox.checked && !this.preferCheckBox.indeterminate) {
            if (isNullOrUndefined(selection.tableFormat.preferredWidth) || selection.tableFormat.preferredWidth !== 0) {
                this.tableFormat.preferredWidth = 0;
                this.tableFormat.preferredWidthType = 'Point';
            }
        }
        if (this.tableFormat.hasValue('tableAlignment') && this.tableFormat.tableAlignment !== 'Left') {
            if (isNullOrUndefined(selection.tableFormat.leftIndent) || selection.tableFormat.leftIndent !== 0) {
                this.tableFormat.leftIndent = 0;
            }
        }
        if (!this.rowHeightCheckBox.checked && !this.rowHeightCheckBox.indeterminate) {
            if (isNullOrUndefined(selection.rowFormat.height) || selection.rowFormat.height !== 0) {
                this.rowFormat.heightType = 'AtLeast';
                this.rowFormat.height = 0;
            }
        }
        if (!this.preferredCellWidthCheckBox.checked && !this.preferredCellWidthCheckBox.indeterminate) {
            if (isNullOrUndefined(selection.cellFormat.preferredWidth) || selection.cellFormat.preferredWidth === 0) {
                this.cellFormat.preferredWidthType = 'Point';
                this.cellFormat.preferredWidth = 0;
            }
        } else {
            if (this.cellFormat.preferredWidthType === 'Percent') {
                if (!this.tableFormat.hasValue('preferredWidth') && !this.tableFormat.hasValue('preferredWidthType')
                    && this.documentHelper.selection.start.paragraph.associatedCell.ownerTable.tableFormat.preferredWidth === 0) {
                    /* eslint-disable-next-line max-len */
                    const containerWidth: number = this.documentHelper.selection.start.paragraph.associatedCell.ownerTable.getOwnerWidth(true);
                    /* eslint-disable-next-line max-len */
                    const tableWidth: number = this.documentHelper.selection.start.paragraph.associatedCell.ownerTable.getTableClientWidth(containerWidth);
                    this.tableFormat.preferredWidthType = 'Percent';
                    /* eslint-disable-next-line max-len */
                    this.tableFormat.preferredWidth = tableWidth / HelperMethods.convertPixelToPoint(this.documentHelper.owner.viewer.clientArea.width) * 100;
                }
            }
        }
        if (this.rowHeightValue) {
            this.rowFormat.height = this.rowHeightValue;
        }
        this.documentHelper.owner.editorModule.initComplexHistory('TableProperties');
        this.documentHelper.owner.editorModule.onTableFormat(this.tableFormat);
        this.documentHelper.owner.editorModule.onRowFormat(this.rowFormat);
        this.documentHelper.owner.editorModule.onCellFormat(this.cellFormat);
        this.documentHelper.owner.editorHistory.updateComplexHistory();
        this.closeTablePropertiesDialog();
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     * @param {TableWidget} table - Specifies the table widget.
     * @returns {void}
     */
    public calculateGridValue(table: TableWidget): void {
        table.calculateGrid();
        table.isGridUpdated = false;
        table.buildTableColumns();
        table.isGridUpdated = true;
        this.documentHelper.selection.owner.isLayoutEnabled = true;
        this.documentHelper.layout.reLayoutTable(table);
        this.documentHelper.owner.editorModule.reLayout(this.documentHelper.selection);
        this.documentHelper.owner.editorModule.updateSelectionTextPosition(true);
        const history: EditorHistory = this.documentHelper.owner.editorHistory;
        if (history && history.currentBaseHistoryInfo) {
            if (history.currentBaseHistoryInfo.modifiedProperties.length > 0) {
                history.currentBaseHistoryInfo.updateSelection();
            }
            history.updateHistory();
        }
        this.documentHelper.owner.editorModule.fireContentChange();
    }
    /**
     * @private
     * @returns {void}
     */
    public applyTableSubProperties = (): void => {
        if (this.isCellOptionsUpdated) {
            const cellFormat: WCellFormat = this.documentHelper.owner.cellOptionsDialogModule.cellFormat;
            this.documentHelper.owner.cellOptionsDialogModule.applySubCellOptions(cellFormat);
        }
        if (this.isTableOptionsUpdated) {
            const tableFormat: WTableFormat = this.documentHelper.owner.tableOptionsDialogModule.tableFormat;
            this.documentHelper.owner.tableOptionsDialogModule.applySubTableOptions(tableFormat);
        }
        this.isCellOptionsUpdated = false;
        this.isTableOptionsUpdated = false;
    };
    /**
     * @private
     * @returns {void}
     */
    public loadTableProperties(): void {
        this.setTableProperties();
        this.setTableRowProperties();
        this.setTableCellProperties();
        if (!this.documentHelper.owner.bordersAndShadingDialogModule) {
            this.bordersAndShadingButton.disabled = true;
        } else {
            this.bordersAndShadingButton.disabled = false;
        }
        // if (!this.documentHelper.owner.tableOptionsDialogModule) {
        //     this.tableOptionButton.disabled = true;
        // } else {
        this.tableOptionButton.disabled = false;
        // }
        // if (!this.documentHelper.owner.cellOptionsDialogModule) {
        //     this.cellOptionButton.disabled = true;
        // } else {
        this.cellOptionButton.disabled = false;
        // }
    }
    /**
     * @private
     * @returns {void}
     */
    public unWireEvent = (): void => {
        //Table Format
        this.preferCheckBox.change = undefined;
        this.tableWidthBox.change = undefined;
        this.tableWidthType.change = undefined;
        this.leftIndentBox.change = undefined;
        //Row Format
        this.rowHeightCheckBox.change = undefined;
        this.rowHeightBox.change = undefined;
        this.rowHeightType.change = undefined;
        this.repeatHeader.change = undefined;
        this.allowRowBreak.change = undefined;
        //Cell Format
        this.preferredCellWidthCheckBox.change = undefined;
        this.cellWidthBox.change = undefined;
        this.cellWidthType.change = undefined;
        this.cellFormat.destroy();
        this.rowFormat.destroy();
        this.tableFormat.destroy();
        this.rowHeightValue = undefined;
        this.documentHelper.dialog2.open = this.documentHelper.selection.hideCaret.bind(this.documentHelper.owner.viewer);
    };
    /**
     * @private
     * @returns {void}
     */
    public wireEvent(): void {
        this.documentHelper.selection.hideCaret();
        //Table Format
        this.preferCheckBox.change = this.changeTableCheckBox.bind(this);
        this.tableWidthBox.change = this.onTableWidthChange.bind(this);
        this.tableWidthType.change = this.onTableWidthTypeChange.bind(this);
        this.leftIndentBox.change = this.onLeftIndentChange.bind(this);
        //Row Format
        this.rowHeightCheckBox.change = this.changeTableRowCheckBox.bind(this);
        this.rowHeightBox.change = this.onRowHeightChange.bind(this);
        this.rowHeightType.change = this.onRowHeightTypeChange.bind(this);
        this.allowRowBreak.change = this.onAllowBreakAcrossPage.bind(this);
        this.repeatHeader.change = this.onRepeatHeader.bind(this);
        //Cell Format
        this.preferredCellWidthCheckBox.change = this.changeTableCellCheckBox.bind(this);
        this.cellWidthBox.change = this.onCellWidthChange.bind(this);
        this.cellWidthType.change = this.onCellWidthTypeChange.bind(this);
    }
    /**
     * @private
     * @returns {void}
     */
    public closeTablePropertiesDialog = (): void => {
        this.documentHelper.dialog2.hide();
        this.documentHelper.updateFocus();
    };
    //#region Table Format
    private initTableProperties(element: HTMLDivElement, localValue: L10n, isRtl?: boolean): void {
        const container: HTMLDivElement = <HTMLDivElement>createElement('div', { id: element.id + '_table_TabContainer' });
        const sizeHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: container.id + '_sizeLabel', innerHTML: localValue.getConstant('Size'),
            styles: 'width:100%;margin:0px;', className: 'e-de-table-dialog-options-label e-de-table-dialog-size-label'
        });
        const parentContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'display: inline-flex;' });
        const childContainer1: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'float: left;',
            className: 'e-de-table-container-div'
        });
        const childContainer2: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-table-ppty-dlg-preferred-width-div'
        });
        const child1: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'display: inline;',
            className: 'e-de-table-ppty-dlg-measure-div'
        });
        const child2: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'display: inline;position: absolute;',
            className: 'e-de-table-ppty-dlg-measure-drop-down-div'
        });
        const childContainer3: HTMLDivElement = <HTMLDivElement>createElement('div');
        const preferCheckBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            id: element.id + '_Prefer_Width_CheckBox', attrs: { 'type': 'checkbox' }
        });
        this.preferredWidth = <HTMLInputElement>createElement('input', { id: element.id + 'preferred_Width' });
        const controlDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const tableWidthType: HTMLSelectElement = createElement('select', {
            innerHTML: '<option value="Points">' + localValue.getConstant('Points') +
                '</option><option value="Percent">' + localValue.getConstant('Percent') + '</option>', id: element.id + '_width_dropdown'
        }) as HTMLSelectElement;
        const labeltext: HTMLInputElement = <HTMLInputElement>createElement('span', {
            innerHTML: localValue.getConstant('Measure in'), styles: 'width: 60px;',
            className: 'e-de-table-measure-lbl'
        });
        const alignmentHeader: HTMLDivElement = createElement('div', {
            innerHTML: localValue.getConstant('Alignment'), className: 'e-de-table-dialog-options-label',
            styles: 'width: 100%;margin: 0px;'
        }) as HTMLDivElement;
        const alignmentContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'height:85px;display:inline-flex', className: 'e-de-tbl-prop-sub-cntr' });
        const classDivName: string = element.id + 'e-de-table-alignment';
        const leftAlignDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dia-align-div' });
        this.left = createElement('div', {
            className: 'e-icons e-de-table-properties-alignment e-de-table-left-alignment ' + classDivName,
            id: element.id + '_left_alignment', styles: 'width:54px;height:54px;margin:2px'
        }) as HTMLDivElement;
        leftAlignDiv.appendChild(this.left);
        const centerAlignDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dia-align-div' });
        this.center = createElement('div', {
            className: 'e-icons e-de-table-properties-alignment  e-de-table-center-alignment ' + classDivName,
            id: element.id + '_center_alignment', styles: 'width:54px;height:54px;margin:2px'
        }) as HTMLDivElement;
        centerAlignDiv.appendChild(this.center);
        this.right = createElement('div', {
            styles: 'width:54px;height:54px;margin:2px', id: element.id + '_right_alignment',
            className: 'e-icons e-de-table-properties-alignment  e-de-table-right-alignment ' + classDivName
        }) as HTMLDivElement;
        const rightAlignDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dia-align-div' });
        rightAlignDiv.appendChild(this.right);
        const leftlabel: HTMLLabelElement = createElement('label', {
            innerHTML: localValue.getConstant('Left'), className: 'e-de-table-dia-align-label'
        }) as HTMLLabelElement;
        const centerlabel: HTMLLabelElement = createElement('label', {
            innerHTML: localValue.getConstant('Center'), className: 'e-de-table-dia-align-label'
        }) as HTMLLabelElement;
        const rightlabel: HTMLLabelElement = createElement('label', {
            innerHTML: localValue.getConstant('Right'), className: 'e-de-table-dia-align-label'
        }) as HTMLLabelElement;
        const leftIndenetContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-table-ppty-dlg-left-indent-container'
        });
        let leftIndentLabelMargin: string;
        let leftIndentBoxMargin: string;
        if (isRtl) {
            leftIndentLabelMargin = 'left: 45px;';
            leftIndentBoxMargin = 'left: 45px;';
        } else {
            leftIndentLabelMargin = 'right: 45px;';
            leftIndentBoxMargin = 'right: 45px;';
        }
        this.indentingLabel = createElement('label', {
            innerHTML: localValue.getConstant('Indent from left'),
            styles: leftIndentLabelMargin,
            className: 'e-de-tbl-indent-lbl'
        }) as HTMLLabelElement;
        const leftIndentBox: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'margin-top: 15px;position: relative;' + leftIndentBoxMargin
        });
        this.leftIndent = <HTMLInputElement>createElement('input', { id: element.id + '_left_indent' });
        const tableDirHeader: HTMLDivElement = createElement('div', {
            innerHTML: localValue.getConstant('Table direction'), className: 'e-de-table-dialog-options-label',
            styles: 'width: 100%;margin: 0px;padding-top:14px;'
        }) as HTMLDivElement;
        const tableDirContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'display:flex' });
        const rtlDiv: HTMLElement = createElement('div', { id: element.id + '_TableDirDiv', className: 'e-de-tbl-rtl-btn-div' });
        const rtlInputELe: HTMLElement = createElement('input', { id: element.id + '_rtlEle' });
        rtlDiv.appendChild(rtlInputELe);
        tableDirContainer.appendChild(rtlDiv);
        const ltrDiv: HTMLElement = createElement('div', { id: element.id + '_DirDiv', className: 'e-de-tbl-ltr-btn-div' });
        const ltrInputELe: HTMLElement = createElement('input', { id: element.id + '_ltrEle' });
        ltrDiv.appendChild(ltrInputELe);
        tableDirContainer.appendChild(ltrDiv);
        this.rtlButton = new RadioButton({
            label: localValue.getConstant('Right-to-left'),
            value: 'rtl', cssClass: 'e-small', change: this.changeBidirectional,
            enableRtl: isRtl
        });
        this.rtlButton.appendTo(rtlInputELe);
        this.ltrButton = new RadioButton({
            label: localValue.getConstant('Left-to-right'),
            value: 'ltr', cssClass: 'e-small', change: this.changeBidirectional,
            enableRtl: isRtl
        });
        this.ltrButton.appendTo(ltrInputELe);
        const tableOptionContiner: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-tbl-dlg-border-btn'
        });
        if (isRtl) {
            tableOptionContiner.style.cssFloat = 'left';
        }
        this.bordersAndShadingButton = createElement('button', {
            innerHTML: localValue.getConstant('Borders and Shading') + '...',
            id: element.id + '_borders_and_shadings', className: 'e-control e-btn e-flat e-de-ok-button',
            attrs: { type: 'button' }
        }) as HTMLButtonElement;
        this.tableOptionButton = createElement('button', {
            className: 'e-control e-btn e-flat', innerHTML: localValue.getConstant('Options') + '...',
            id: element.id + '_table_cellmargin', attrs: { type: 'button' }
        }) as HTMLButtonElement;
        this.tableOptionButton.addEventListener('click', this.showTableOptionsDialog);
        this.bordersAndShadingButton.addEventListener('click', this.showBordersShadingsPropertiesDialog);
        tableOptionContiner.appendChild(this.bordersAndShadingButton);
        tableOptionContiner.appendChild(this.tableOptionButton);
        leftIndenetContainer.appendChild(this.indentingLabel); leftIndentBox.appendChild(this.leftIndent);
        leftIndenetContainer.appendChild(leftIndentBox); alignmentContainer.appendChild(leftAlignDiv);
        alignmentContainer.appendChild(centerAlignDiv); alignmentContainer.appendChild(rightAlignDiv);
        leftAlignDiv.appendChild(leftlabel); centerAlignDiv.appendChild(centerlabel);
        rightAlignDiv.appendChild(rightlabel); alignmentContainer.appendChild(leftIndenetContainer);
        container.appendChild(sizeHeader); element.appendChild(container);
        childContainer1.appendChild(preferCheckBox); parentContainer.appendChild(childContainer1);
        childContainer2.appendChild(this.preferredWidth); parentContainer.appendChild(childContainer2);
        controlDiv.appendChild(tableWidthType); child1.appendChild(labeltext);
        child2.appendChild(controlDiv); childContainer3.appendChild(child1);
        childContainer3.appendChild(child2); parentContainer.appendChild(childContainer3);
        element.appendChild(parentContainer); element.appendChild(alignmentHeader);
        element.appendChild(alignmentContainer); element.appendChild(tableDirHeader);
        element.appendChild(tableDirContainer); element.appendChild(tableOptionContiner);
        this.tableWidthBox = new NumericTextBox({
            value: 0, decimals: 2, min: 0, max: 1584, width: 120, enablePersistence: false
        });
        this.tableWidthBox.appendTo(this.preferredWidth);
        this.leftIndentBox = new NumericTextBox({
            value: 0, decimals: 2, min: -1584, max: 1584, width: 140, enablePersistence: false
        });
        this.leftIndentBox.appendTo(this.leftIndent);
        this.preferCheckBox = new CheckBox({
            label: localValue.getConstant('Preferred Width'), enableRtl: isRtl
        });
        this.preferCheckBox.appendTo(preferCheckBox);
        this.tableWidthType = new DropDownList({ width: '120px', enableRtl: isRtl });
        this.tableWidthType.appendTo(tableWidthType);
        if (isRtl) {
            rtlDiv.classList.add('e-de-rtl');
            childContainer2.classList.add('e-de-rtl');
            child1.classList.add('e-de-rtl');
            child2.classList.add('e-de-rtl');
            leftIndenetContainer.classList.add('e-de-rtl');
            tableOptionContiner.classList.add('e-de-rtl');
            this.bordersAndShadingButton.classList.add('e-de-rtl');
            leftAlignDiv.classList.add('e-de-rtl');
            centerAlignDiv.classList.add('e-de-rtl');
            rightAlignDiv.classList.add('e-de-rtl');
        }
    }
    /**
     * @private
     * @param {Event} event - Specified the event.
     * @returns {void}
     */
    private changeBidirectional = (event: ChangeArgs): void => {
        if (event.value === 'ltr') {
            this.rtlButton.checked = !this.ltrButton.checked;
            this.tableFormat.bidi = false;

        } else {
            this.ltrButton.checked = !this.rtlButton.checked;
            this.tableFormat.bidi = true;
        }
        if (this.tableFormat.bidi && this.tableFormat.tableAlignment === 'Left') {
            this.tableFormat.tableAlignment = 'Right';
        } else if (!this.tableFormat.bidi && this.tableFormat.tableAlignment === 'Right') {
            this.tableFormat.tableAlignment = 'Left';
        }
        this.activeTableAlignment(this.tableFormat, true);
    };
    /**
     * @private
     * @returns {void}
     */
    public onTableWidthChange(): void {
        this.tableFormat.preferredWidth = this.tableWidthBox.value;
    }
    /**
     * @private
     * @returns {void}
     */
    public onTableWidthTypeChange(): void {
        let value: number;
        //const table: TableWidget = this.documentHelper.selection.start.paragraph.associatedCell.ownerTable;
        const width: number = HelperMethods.convertPixelToPoint(this.documentHelper.owner.viewer.clientArea.width);
        if (this.tableWidthType.text === 'Percent' && this.documentHelper.selection.tableFormat.preferredWidthType !== 'Percent') {
            value = this.tableWidthBox.value / width * 100;
            this.formatNumericTextBox(this.tableWidthBox, 'Percent', value);
        } else if (this.tableWidthType.text === 'Points' && this.documentHelper.selection.tableFormat.preferredWidthType !== 'Point') {
            value = width / 100 * this.tableWidthBox.value;
            this.formatNumericTextBox(this.tableWidthBox, 'Point', value);
        } else {
            if (this.tableWidthBox.format === '#\'%\'') {
                if (this.tableWidthType.text === 'Points') {
                    value = width / 100 * this.tableWidthBox.value;
                } else {
                    value = this.tableWidthBox.value;
                }
            } else {
                if (this.tableWidthType.text === 'Percent') {
                    value = this.tableWidthBox.value / width * 100;
                } else {
                    value = this.tableWidthBox.value;
                }
            }
            this.formatNumericTextBox(this.tableWidthBox, (this.tableWidthType.text === 'Points') ? 'Point' : this.tableWidthType.text as WidthType, value);
        }

        this.tableFormat.preferredWidthType = (this.tableWidthType.text === 'Points') ? 'Point' : this.tableWidthType.text as WidthType;
    }
    /**
     * @private
     * @returns {void}
     */
    public onLeftIndentChange(): void {
        this.tableFormat.leftIndent = this.leftIndentBox.value;
    }
    private setTableProperties(): void {
        //instance of Table Property values
        const tableFormat: SelectionTableFormat = this.documentHelper.selection.tableFormat;
        const tableHasWidth: boolean = tableFormat.preferredWidth > 0;
        let preferredWidth: number = tableFormat.preferredWidth;
        if (isNullOrUndefined(tableFormat.preferredWidth)) {
            this.preferCheckBox.indeterminate = true;
            const startTable: TableWidget = this.documentHelper.selection.start.paragraph.associatedCell.ownerTable;
            const table: TableWidget = startTable.combineWidget(this.documentHelper.owner.viewer) as TableWidget;
            preferredWidth = table.tableFormat.preferredWidth;
        } else {
            this.preferCheckBox.checked = tableHasWidth;
        }
        this.tableWidthBox.enabled = tableHasWidth;
        this.tableWidthType.enabled = tableHasWidth;

        this.formatNumericTextBox(this.tableWidthBox, tableFormat.preferredWidthType, preferredWidth);
        if (tableFormat.preferredWidthType === 'Auto' || tableFormat.preferredWidthType === 'Point') {
            this.tableWidthType.index = 0;
        } else {
            this.tableWidthType.index = 1;
        }
        this.activeTableAlignment(tableFormat, false);
        if (tableFormat.bidi) {
            this.rtlButton.checked = true;
            this.ltrButton.checked = false;
        } else {
            this.ltrButton.checked = true;
            this.rtlButton.checked = false;
        }
    }
    private activeTableAlignment(tableFormat: SelectionTableFormat | WTableFormat, isChanged: boolean): void {
        let tableAlignment: TableAlignment = isChanged ? this.tableFormat.tableAlignment : undefined;
        // Consider the TableAlignment based on the Bidirectional property.
        if (isNullOrUndefined(tableAlignment)) {
            if (tableFormat.bidi) {
                if (tableFormat.tableAlignment === 'Left') {
                    tableAlignment = 'Right';
                } else if (tableFormat.tableAlignment === 'Right') {
                    tableAlignment = 'Left';
                }
            } else {
                tableAlignment = tableFormat.tableAlignment;
            }
        }
        if (tableFormat.bidi) {
            this.leftIndentBox.enabled = tableAlignment === 'Right';
            this.indentingLabel.innerHTML = this.localValue.getConstant('Indent from right');
        } else {
            this.leftIndentBox.enabled = tableAlignment === 'Left';
            this.indentingLabel.innerHTML = this.localValue.getConstant('Indent from left');
        }

        this.leftIndentBox.value = tableFormat.leftIndent;

        classList(this.left, [], ['e-de-table-alignment-active']);
        classList(this.right, [], ['e-de-table-alignment-active']);
        classList(this.center, [], ['e-de-table-alignment-active']);

        if (tableAlignment === 'Left') {
            this.left.classList.add('e-de-table-alignment-active');
        } else if (tableAlignment === 'Center') {
            this.center.classList.add('e-de-table-alignment-active');
        } else if (tableAlignment === 'Right') {
            this.right.classList.add('e-de-table-alignment-active');
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public changeTableCheckBox = (): void => {
        const enable: boolean = (this.preferCheckBox.checked || this.preferCheckBox.indeterminate);
        this.tableWidthBox.enabled = enable;
        this.tableWidthType.enabled = enable;
        if (enable) {
            this.tableFormat.preferredWidthType = (this.tableWidthType.value === 'Points') ?
                'Point' : this.tableWidthType.value as WidthType;
        } else {
            this.tableFormat.preferredWidthType = this.documentHelper.selection.tableFormat.preferredWidthType;
        }
    };
    /**
     * @private
     * @param {Event} event - Specified the event.
     * @returns {void}
     */
    public changeTableAlignment = (event: Event): void => {
        this.updateClassForAlignmentProperties(this.tableTab);
        const element: HTMLElement = (event.target as HTMLElement);
        classList(element, ['e-de-table-alignment-active'], ['e-de-table-properties-alignment']);
        const bidi: boolean = this.tableFormat.bidi || this.rtlButton.checked;
        if ((element.classList.contains('e-de-table-left-alignment') && !bidi) ||
            (element.classList.contains('e-de-table-right-alignment') && bidi)) {
            this.leftIndentBox.enabled = true;
        } else {
            this.leftIndentBox.enabled = false;
        }
        this.tableFormat.tableAlignment = this.getTableAlignment() as TableAlignment;
    };

    /**
     * @private
     * @returns {string} Resturns table alignment
     */
    public getTableAlignment(): string {
        const id: string = this.tableTab.id;
        const groupButtons: HTMLCollectionOf<Element> = this.tableTab.getElementsByClassName(id + 'e-de-table-alignment');
        for (let j: number = 0; j < groupButtons.length; j++) {
            const groupButton: HTMLElement = groupButtons[j] as HTMLElement;
            if (groupButton.classList.contains('e-de-table-alignment-active')) {
                if (j === 0) {
                    return this.ltrButton.checked ? 'Left' : 'Right';
                } else if (j === 1) {
                    return 'Center';
                } else {
                    return this.ltrButton.checked ? 'Right' : 'Left';
                }
            }
        }
        return undefined;
    }

    private updateClassForAlignmentProperties(element: HTMLElement): void {
        const id: string = element.id;
        const groupButtons: HTMLCollectionOf<Element> = element.getElementsByClassName(id + 'e-de-table-alignment');
        for (let j: number = 0; j < groupButtons.length; j++) {
            const groupButton: HTMLElement = groupButtons[j] as HTMLElement;
            if (groupButton.classList.contains('e-de-table-alignment-active')) {
                classList(groupButton, ['e-de-table-properties-alignment'], ['e-de-table-alignment-active']);
            }
        }
    }

    //#endregion

    //#region Row Format
    private initTableRowProperties(element: HTMLDivElement, localValue: L10n, isRtl?: boolean): void {
        const rowDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'width: 100%;' });
        const sizeLabeldiv: HTMLDivElement = <HTMLDivElement>createElement('div', {
            innerHTML: localValue.getConstant('Size'),
            styles: 'width: 100%;',
            className: 'e-de-table-dialog-options-label e-de-table-dialog-size-label'
        });
        const parentDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'display: inline-flex;width: 100%;' });
        // let childDiv1Float: string;
        // if (isRtl) {
        //     childDiv1Float = 'float: right;';
        // } else {
        //     childDiv1Float = 'float: left;';
        // }
        const childDiv1: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-table-header-div', styles: 'margin-top:6px'
        });
        const rowHeightCheckBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: element.id + '_height_CheckBox'
        });
        const childdiv2: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-row-ht-top'
        });
        this.rowHeight = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }, 'id': element.id + '_table_row_height'
        });
        //let child2Float: string;
        // if (isRtl) {
        //     child2Float = 'float: left;';
        // } else {
        //     child2Float = 'float: right;';
        // }
        const child2: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-ht-wdth-type' });
        const child3: HTMLDivElement = createElement('div') as HTMLDivElement;
        const child4: HTMLDivElement = createElement('div') as HTMLDivElement;
        const controlDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const rowHeightType: HTMLSelectElement = createElement('select', {
            innerHTML: '<option value="At least">' + localValue.getConstant('At least')
                + '</option><option value="Exactly">' + localValue.getConstant('Exactly') + '</option>',
            id: element.id + '_height_type'
        }) as HTMLSelectElement;
        const labeltext: HTMLLabelElement = <HTMLLabelElement>createElement('span', {
            innerHTML: localValue.getConstant('Row height is'),
            className: 'e-de-table-measure-lbl'
        });
        rowDiv.appendChild(sizeLabeldiv); element.appendChild(rowDiv); childDiv1.appendChild(rowHeightCheckBox);
        parentDiv.appendChild(childDiv1); childdiv2.appendChild(this.rowHeight); parentDiv.appendChild(childdiv2);
        controlDiv.appendChild(rowHeightType); child3.appendChild(labeltext); child4.appendChild(controlDiv);
        child2.appendChild(child3); child2.appendChild(child4); parentDiv.appendChild(child2); element.appendChild(parentDiv);
        const alignmentDiv: HTMLDivElement = createElement('div', {
            innerHTML: localValue.getConstant('Options') + '...', styles: 'width: 100%;',
            className: 'e-de-table-dialog-options-label'
        }) as HTMLDivElement;
        const allowRowContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-ppty-options-break' });
        const repeatHeaderContaniner: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-ppty-options-header-row' });
        const allowRowBreak: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: element.id + '_allow_row_break'
        });
        const repeatHeader: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, 'id': element.id + '_repeat_header'
        });
        allowRowContainer.appendChild(allowRowBreak); repeatHeaderContaniner.appendChild(repeatHeader);
        element.appendChild(alignmentDiv); element.appendChild(allowRowContainer);
        element.appendChild(repeatHeaderContaniner);
        this.rowHeightBox = new NumericTextBox({
            value: 0, decimals: 2, min: 0, max: 1584, width: 120, enablePersistence: false
        });
        this.rowHeightBox.appendTo(this.rowHeight);
        this.rowHeightCheckBox = new CheckBox({
            label: localValue.getConstant('Specify height'),
            enableRtl: isRtl
        });
        this.rowHeightCheckBox.appendTo(rowHeightCheckBox);
        this.rowHeightType = new DropDownList({ width: '120px', enableRtl: isRtl });
        this.rowHeightType.appendTo(rowHeightType);
        this.allowRowBreak = new CheckBox({
            label: localValue.getConstant('Allow row to break across pages'),
            enableRtl: isRtl
        });
        this.allowRowBreak.appendTo(allowRowBreak);
        this.repeatHeader = new CheckBox({
            label: localValue.getConstant('Repeat as header row at the top of each page'),
            enableRtl: isRtl
        });
        this.repeatHeader.appendTo(repeatHeader);
        if (isRtl) {
            child3.classList.add('e-de-rtl');
            child4.classList.add('e-de-rtl');
            childdiv2.classList.add('e-de-rtl');
        }
    }
    private setTableRowProperties(): void {
        const rowFormat: SelectionRowFormat = this.documentHelper.selection.rowFormat;
        let enableRowHeight: boolean = (rowFormat.height > 0 || rowFormat.heightType === 'Exactly');
        //instance of table row values
        if (enableRowHeight) {
            this.rowHeightCheckBox.checked = true;
        } else {
            if (rowFormat.heightType === undefined) {
                this.rowHeightCheckBox.indeterminate = true;
                enableRowHeight = true;
            } else {
                this.rowHeightCheckBox.checked = false;
            }
        }

        this.rowHeightBox.enabled = enableRowHeight;
        this.rowHeightType.enabled = enableRowHeight;

        const enabledHeader: boolean = this.enableRepeatHeader() ? false : true;

        if (isNullOrUndefined(this.documentHelper.selection.rowFormat.isHeader)) {
            this.repeatHeader.indeterminate = true;
            this.repeatHeader.disabled = true;
        } else if (this.documentHelper.selection.rowFormat.isHeader) {
            this.repeatHeader.checked = !enabledHeader;
            this.repeatHeader.indeterminate = enabledHeader;
            this.repeatHeader.disabled = enabledHeader;
        } else {
            this.repeatHeader.checked = false;
            this.repeatHeader.indeterminate = false;
            this.repeatHeader.disabled = enabledHeader;
        }

        if (isNullOrUndefined(rowFormat.allowBreakAcrossPages)) {
            this.allowRowBreak.indeterminate = true;
        } else {
            this.allowRowBreak.checked = rowFormat.allowBreakAcrossPages;
        }

        this.rowHeightBox.value = rowFormat.height;

        if (rowFormat.heightType === 'Auto' || rowFormat.heightType === 'AtLeast') {
            this.rowHeightType.index = 0;
        } else {
            this.rowHeightType.index = 1;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public onRowHeightChange(): void {
        this.rowHeightValue = this.rowHeightBox.value;
    }
    /**
     * @private
     * @returns {void}
     */
    public onRowHeightTypeChange(): void {
        this.rowFormat.heightType = this.rowHeightType.text as HeightType;
    }
    /**
     * @private
     * @returns {void}
     */
    public changeTableRowCheckBox = (): void => {
        this.rowHeightType.enabled = this.rowHeightCheckBox.checked;
        this.rowHeightBox.enabled = this.rowHeightCheckBox.checked;
        if (this.rowHeightType.enabled) {
            this.rowFormat.heightType = this.rowHeightType.value as HeightType;
        } else {
            this.rowFormat.heightType = this.documentHelper.selection.rowFormat.heightType;
        }
    };

    private onAllowBreakAcrossPage(): void {
        this.rowFormat.allowBreakAcrossPages = this.allowRowBreak.checked;
    }

    private onRepeatHeader(): void {
        this.rowFormat.isHeader = this.repeatHeader.checked;
    }

    /**
     * @private
     * @returns {boolean} Returns enable repeat header
     */
    public enableRepeatHeader(): boolean {
        const selection: Selection = this.documentHelper.selection;
        let start: TextPosition = selection.start;
        let end: TextPosition = selection.end;
        if (!selection.isForward) {
            start = selection.end;
            end = selection.start;
        }
        const startCell: TableCellWidget = start.paragraph.associatedCell;
        const endCell: TableCellWidget = end.paragraph.associatedCell;
        return startCell.ownerRow.index === 0 && endCell.ownerTable.equals(startCell.ownerTable);
    }
    //#endregion

    //#region Cell Format
    private initTableCellProperties(element: HTMLDivElement, localValue: L10n, isRtl?: boolean): void {
        const sizeDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'width: 100%;' });
        const div: HTMLDivElement = createElement('div', {
            innerHTML: localValue.getConstant('Size'), className: 'e-de-table-dialog-options-label e-de-table-dialog-size-label',
            styles: 'width: 100%;'
        }) as HTMLDivElement;
        const parentdiv: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'width: 100%;display: inline-flex;' });
        // let childdiv1Float: string;
        // if (isRtl) {
        //     childdiv1Float = 'float: right';
        // } else {
        //     childdiv1Float = 'float: left';
        // }
        const childdiv1: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-table-cell-header-div', styles: 'margin-top:9px'
        });
        const preferredCellWidthCheckBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: element.id + '_Prefer_Width_CheckBox_cell'
        });
        const childdiv2: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-cell-ht-top'
        });
        this.preferredCellWidth = <HTMLInputElement>createElement('input', {
            id: element.id + 'tablecell_Width_textBox', attrs: { 'type': 'text' }
        });
        // let child2Float: string;
        // if (isRtl) {
        //     child2Float = 'float: left;';
        // } else {
        //     child2Float = 'float: right;';
        // }
        const child2: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-ht-wdth-type'
        });
        const child3: HTMLDivElement = <HTMLDivElement>createElement('div');
        // let child4Float: string;
        // if (isRtl) {
        //     child4Float = 'float: left;';
        // } else {
        //     child4Float = 'float: right;';
        // }
        const child4: HTMLDivElement = <HTMLDivElement>createElement('div');
        const controlDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const cellWidthType: HTMLSelectElement = createElement('select', {
            innerHTML: '<option value="Points">' + localValue.getConstant('Points') + '</option><option value="Percent">' +
                localValue.getConstant('Percent') + '</option>', 'id': element.id + '_measure_type_cell'
        }) as HTMLSelectElement;
        const labeltext: HTMLLabelElement = createElement('span', {
            innerHTML: localValue.getConstant('Measure in'),
            className: 'e-de-table-measure-lbl'
        }) as HTMLLabelElement;
        sizeDiv.appendChild(div); element.appendChild(sizeDiv); childdiv1.appendChild(preferredCellWidthCheckBox);
        parentdiv.appendChild(childdiv1); childdiv2.appendChild(this.preferredCellWidth);
        parentdiv.appendChild(childdiv2); controlDiv.appendChild(cellWidthType); child3.appendChild(labeltext);
        child4.appendChild(controlDiv); child2.appendChild(child3); child2.appendChild(child4);
        parentdiv.appendChild(child2); element.appendChild(parentdiv);
        const alignmentDiv: HTMLDivElement = createElement('div', {
            innerHTML: localValue.getConstant('Vertical alignment'),
            styles: 'width: 100%;margin: 0px;',
            className: 'e-de-table-dialog-options-label'
        }) as HTMLDivElement;
        const classDivName: string = element.id + 'e-de-table-cell-alignment';
        const divAlignment: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'width: 100%;height: 100px;'
        });
        const divStyle: string = 'width:54px;height:54px;margin:2px;border-style:solid;border-width:1px';
        const topAlignDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dia-align-div' });
        this.cellTopAlign = createElement('div', {
            styles: divStyle, id: element.id + '_cell_top-alignment',
            className: 'e-icons e-de-tablecell-alignment  e-de-tablecell-top-alignment ' + classDivName
        }) as HTMLDivElement;
        topAlignDiv.appendChild(this.cellTopAlign);
        const centerAlignDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dia-align-div' });
        this.cellCenterAlign = createElement('div', {
            styles: divStyle, id: element.id + '_cell_center-alignment',
            className: 'e-icons e-de-tablecell-alignment  e-de-tablecell-center-alignment ' + classDivName
        }) as HTMLDivElement;
        centerAlignDiv.appendChild(this.cellCenterAlign);
        const bottomAlignDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dia-align-div' });
        this.cellBottomAlign = createElement('div', {
            styles: divStyle, id: element.id + '_cell_bottom-alignment',
            className: 'e-icons e-de-tablecell-alignment e-de-tablecell-bottom-alignment  ' + classDivName
        }) as HTMLDivElement;
        bottomAlignDiv.appendChild(this.cellBottomAlign);
        const topLabel: HTMLLabelElement = createElement('label', {
            innerHTML: localValue.getConstant('Top'), className: 'e-de-table-dia-align-label'
        }) as HTMLLabelElement;
        const centerLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: localValue.getConstant('Center'), className: 'e-de-table-dia-align-label'
        });
        const bottomLabel: HTMLLabelElement = createElement('label', {
            innerHTML: localValue.getConstant('Bottom'), className: 'e-de-table-dia-align-label'
        }) as HTMLLabelElement;
        this.cellOptionButton = createElement('button', {
            innerHTML: localValue.getConstant('Options') + '...', id: element.id + '_table_cellmargin',
            className: 'e-control e-btn e-flat', attrs: { type: 'button' }
        }) as HTMLButtonElement;
        this.cellOptionButton.style.cssFloat = isRtl ? 'left' : 'right';
        divAlignment.appendChild(topAlignDiv); divAlignment.appendChild(centerAlignDiv);
        divAlignment.appendChild(bottomAlignDiv); topAlignDiv.appendChild(topLabel);
        centerAlignDiv.appendChild(centerLabel); bottomAlignDiv.appendChild(bottomLabel);
        element.appendChild(alignmentDiv); element.appendChild(divAlignment); element.appendChild(this.cellOptionButton);
        this.cellOptionButton.addEventListener('click', this.showCellOptionsDialog);
        this.cellWidthBox = new NumericTextBox({
            value: 0, decimals: 2, min: 0, max: 1584, width: 120, enablePersistence: false
        });
        this.cellWidthBox.appendTo(this.preferredCellWidth);
        this.preferredCellWidthCheckBox = new CheckBox({ label: localValue.getConstant('Preferred Width'), enableRtl: isRtl });
        this.preferredCellWidthCheckBox.appendTo(preferredCellWidthCheckBox);
        this.cellWidthType = new DropDownList({ width: '120px', enableRtl: isRtl });
        this.cellWidthType.appendTo(cellWidthType);
        if (isRtl) {
            childdiv2.classList.add('e-de-rtl');
            child3.classList.add('e-de-rtl');
            child4.classList.add('e-de-rtl');
            this.cellOptionButton.classList.add('e-de-rtl');
            topAlignDiv.classList.add('e-de-rtl');
            centerAlignDiv.classList.add('e-de-rtl');
            bottomAlignDiv.classList.add('e-de-rtl');
        }
    }
    private setTableCellProperties(): void {
        const cellFormat: SelectionCellFormat = this.documentHelper.selection.cellFormat;
        //instance of table cell Values
        this.hasCellWidth = cellFormat.preferredWidth > 0;
        let preferredWidth: number = cellFormat.preferredWidth;
        if (isNullOrUndefined(cellFormat.preferredWidth)) {
            this.preferredCellWidthCheckBox.indeterminate = true;
            preferredWidth = this.documentHelper.selection.start.paragraph.associatedCell.cellFormat.preferredWidth;
        } else {
            this.preferredCellWidthCheckBox.checked = this.hasCellWidth;
        }
        this.cellWidthBox.enabled = this.hasCellWidth;
        this.cellWidthType.enabled = this.hasCellWidth;

        if (cellFormat.preferredWidthType === 'Auto' || cellFormat.preferredWidthType === 'Point') {
            this.cellWidthType.index = 0;
        } else {
            this.cellWidthType.index = 1;
        }
        this.formatNumericTextBox(this.cellWidthBox, cellFormat.preferredWidthType, preferredWidth);
        classList(this.cellTopAlign, ['e-de-tablecell-alignment'], ['e-de-table-alignment-active']);
        classList(this.cellCenterAlign, ['e-de-tablecell-alignment'], ['e-de-table-alignment-active']);
        classList(this.cellBottomAlign, ['e-de-tablecell-alignment'], ['e-de-table-alignment-active']);

        if (cellFormat.verticalAlignment === 'Top') {
            this.cellTopAlign.classList.add('e-de-table-alignment-active');
        } else if (cellFormat.verticalAlignment === 'Center') {
            this.cellCenterAlign.classList.add('e-de-table-alignment-active');
        } else if (cellFormat.verticalAlignment === 'Bottom') {
            this.cellBottomAlign.classList.add('e-de-table-alignment-active');
        }
    }

    private updateClassForCellAlignment(element: HTMLElement): void {
        const cellAlignments: HTMLCollectionOf<Element> = element.getElementsByClassName(element.id + 'e-de-table-cell-alignment');
        for (let j: number = 0; j < cellAlignments.length; j++) {
            const cellAlignment: HTMLElement = cellAlignments[j] as HTMLElement;
            if (cellAlignment.classList.contains('e-de-table-alignment-active')) {
                classList(cellAlignment, ['e-de-tablecell-alignment'], ['e-de-table-alignment-active']);
            }
        }
    }

    private formatNumericTextBox(textBox: NumericTextBox, format: WidthType, value: number): void {
        if (format === 'Auto' || format === 'Point') {
            textBox.format = 'n2';
        } else {
            textBox.format = '#\'%\'';
        }
        textBox.step = 1;
        textBox.decimals = 2;
        textBox.value = value;
    }
    /**
     * @private
     * @returns {string} - Returns the alignement.
     */
    public getCellAlignment(): string {
        const id: string = this.cellTab.id;
        const groupButtons: HTMLCollectionOf<Element> = this.cellTab.getElementsByClassName(id + 'e-de-table-cell-alignment');
        for (let j: number = 0; j < groupButtons.length; j++) {
            const groupButton: HTMLElement = groupButtons[j] as HTMLElement;
            if (groupButton.classList.contains('e-de-table-alignment-active')) {
                if (j === 0) {
                    return 'Top';
                } else if (j === 1) {
                    return 'Center';
                } else {
                    return 'Bottom';
                }
            }
        }
        return this.documentHelper.selection.cellFormat.verticalAlignment;
    }
    /**
     * @private
     * @returns {void}
     */
    public changeTableCellCheckBox = (): void => {
        this.cellWidthType.enabled = this.preferredCellWidthCheckBox.checked;
        this.cellWidthBox.enabled = this.preferredCellWidthCheckBox.checked;
    };
    /**
     * @private
     * @returns {void}
     */
    public onCellWidthChange(): void {
        this.cellFormat.preferredWidth = this.cellWidthBox.value;
    }
    /**
     * @private
     * @returns {void}
     */
    public onCellWidthTypeChange(): void {
        let value: number;
        const table: TableWidget = this.documentHelper.selection.start.paragraph.associatedCell.ownerTable;
        const containerWidth: number = table.getOwnerWidth(true);
        const tableWidth: number = table.getTableClientWidth(containerWidth);
        if (this.cellWidthType.text === 'Percent' && this.documentHelper.selection.cellFormat.preferredWidthType !== 'Percent') {
            value = this.cellWidthBox.value / tableWidth * 100;
            this.formatNumericTextBox(this.cellWidthBox, 'Percent', value);
        } else if (this.cellWidthType.text === 'Points' && this.documentHelper.selection.cellFormat.preferredWidthType !== 'Point') {
            value = tableWidth / 100 * this.cellWidthBox.value;
            this.formatNumericTextBox(this.cellWidthBox, 'Point', value);
        } else {
            if (this.cellWidthBox.format === '#\'%\'') {
                if (this.cellWidthType.text === 'Points') {
                    value = tableWidth / 100 * this.cellWidthBox.value;
                } else {
                    value = this.cellWidthBox.value;
                }
            } else {
                if (this.cellWidthType.text === 'Percent') {
                    value = this.cellWidthBox.value / tableWidth * 100;
                } else {
                    value = this.cellWidthBox.value;
                }
            }
            this.formatNumericTextBox(this.cellWidthBox, (this.cellWidthType.text === 'Points') ? 'Point' : this.cellWidthType.text as WidthType, value);
        }
        this.cellFormat.preferredWidthType = (this.cellWidthType.text === 'Points') ? 'Point' : this.cellWidthType.text as WidthType;
    }
    /**
     * @private
     * @param {Event} event - Specified the event
     * @returns {void}
     */
    public changeCellAlignment = (event: Event): void => {
        this.updateClassForCellAlignment(this.cellTab);
        const element: HTMLElement = (event.target as HTMLElement);
        classList(element, ['e-de-table-alignment-active'], ['e-de-tablecell-alignment']);
        this.cellFormat.verticalAlignment = this.getCellAlignment() as CellVerticalAlignment;
    };
    //#endregion
    /**
     * @private
     *
     * @returns {void}
     */
    public showTableOptionsDialog = (): void => {
        this.documentHelper.owner.tableOptionsDialogModule.show();
        this.documentHelper.dialog2.element.style.pointerEvents = 'none';
    };
    /**
     * @private
     *
     * @returns {void}
     */
    public showBordersShadingsPropertiesDialog = (): void => {
        this.documentHelper.owner.bordersAndShadingDialogModule.show();
        this.documentHelper.dialog2.element.style.pointerEvents = 'none';
    };
    /**
     * @private
     *
     * @returns {void}
     */
    public showCellOptionsDialog = (): void => {
        this.documentHelper.owner.cellOptionsDialogModule.show();
        this.documentHelper.dialog2.element.style.pointerEvents = 'none';
    };
    /**
     * @private
     *
     * @returns {void}
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let s: number = 0; s < this.target.childNodes.length; s++) {
                this.target.removeChild(this.target.childNodes[s]);
                s--;
            }
            this.target = undefined;
        }
        this.dialog = undefined;
        this.target = undefined;
        this.cellAlignment = undefined;
        this.tableAlignment = undefined;
        this.documentHelper = undefined;
        this.preferCheckBox = undefined;
        this.tableWidthType = undefined;
        this.preferredWidth = undefined;
        this.rowHeightType = undefined;
        this.rowHeightCheckBox = undefined;
        this.rowHeight = undefined;
        this.cellWidthType = undefined;
        this.preferredCellWidthCheckBox = undefined;
        this.preferredCellWidth = undefined;
        this.tableTab = undefined;
        this.rowTab = undefined;
        this.cellTab = undefined;
        this.left = undefined;
        this.center = undefined;
        this.right = undefined;
        this.leftIndent = undefined;
        this.allowRowBreak = undefined;
        this.repeatHeader = undefined;
        this.cellTopAlign = undefined;
        this.cellCenterAlign = undefined;
        this.cellBottomAlign = undefined;
        this.tableFormat.destroy();
        this.cellFormat.destroy();
        this.tableFormat = undefined;
        this.cellFormat = undefined;
    }
}
