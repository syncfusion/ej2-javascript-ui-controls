import { LayoutViewer } from '../index';
import { Dialog } from '@syncfusion/ej2-popups';
import { createElement, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { WTableFormat, WRowFormat, WCellFormat } from '../format/index';
import { TableAlignment, WidthType, HeightType, CellVerticalAlignment } from '../../base/types';
import { Selection } from '../index';
import { CheckBox, RadioButton, ChangeArgs } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Tab } from '@syncfusion/ej2-navigations';
import { SelectionRowFormat, SelectionTableFormat, SelectionCellFormat } from '../index';
import { TableWidget, TableCellWidget } from '../viewer/page';
import { classList } from '@syncfusion/ej2-base';
import { HelperMethods } from '../editor/editor-helper';
import { EditorHistory } from '../editor-history/index';
import { TextPosition } from '../selection';

/**
 * The Table properties dialog is used to modify properties of selected table.
 */
export class TablePropertiesDialog {
    private dialog: Dialog;
    private target: HTMLElement;
    private cellAlignment: HTMLDivElement;
    private tableAlignment: HTMLDivElement;
    private owner: LayoutViewer;
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
    public isCellOptionsUpdated: Boolean = false;
    /**
     * @private
     */
    public isTableOptionsUpdated: Boolean = false;
    /**
     * @private
     */
    get cellFormat(): WCellFormat {
        if (isNullOrUndefined(this.cellFormatIn)) {
            return this.cellFormatIn = new WCellFormat();
        }
        return this.cellFormatIn;
    }
    /**
     * @private
     */
    set cellFormat(value: WCellFormat) {
        this.cellFormatIn = value;
    }
    /**
     * @private
     */
    get tableFormat(): WTableFormat {
        if (isNullOrUndefined(this.tableFormatIn)) {
            this.tableFormatIn = new WTableFormat();
            return this.tableFormatIn;
        }
        return this.tableFormatIn;
    }
    /**
     * @private
     */
    set tableFormat(value: WTableFormat) {
        this.tableFormatIn = value;
    }
    /**
     * @private
     */
    get rowFormat(): WRowFormat {
        if (isNullOrUndefined(this.rowFormatInternal)) {
            this.rowFormatInternal = new WRowFormat();
            return this.rowFormatInternal;
        }
        return this.rowFormatInternal;
    }
    /**
     * @private
     */
    constructor(viewer: LayoutViewer) {
        this.owner = viewer;
    }

    private getModuleName(): string {
        return 'TablePropertiesDialog';
    }
    /**
     * @private
     */
    public initTablePropertyDialog(localValue: L10n, isRtl?: boolean): void {
        this.localValue = localValue;
        let id: string = this.owner.owner.containerId + '_TablePropertiesDialog';
        this.target = createElement('div', { id: id, className: 'e-de-table-properties-dlg' });
        let ejtabContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_TabContainer' });
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
        let separatorLine: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dialog-separator-line' });
        // tslint:disable-next-line:max-line-length
        let ejtab: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_TablePropertiesDialogTab', className: 'e-de-table-ppty-tab' });
        let headerContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-tab-header' });
        let tableHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_tableHeader', innerHTML: localValue.getConstant('Table')
        });
        let rowHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_rowHeader', innerHTML: localValue.getConstant('Row')
        });
        let cellHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_cellHeader', innerHTML: localValue.getConstant('Cell')
        });
        headerContainer.appendChild(tableHeader); headerContainer.appendChild(rowHeader);
        headerContainer.appendChild(cellHeader);
        let contentContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-content' });
        let tableContent: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_tableContent' });
        let rowContent: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_rowContent' });
        let cellContent: HTMLDivElement = <HTMLDivElement>createElement('div', { id: this.target.id + '_cellContent' });
        tableContent.appendChild(this.tableTab); rowContent.appendChild(this.rowTab);
        cellContent.appendChild(this.cellTab); contentContainer.appendChild(tableContent);
        contentContainer.appendChild(rowContent); contentContainer.appendChild(cellContent);
        ejtab.appendChild(headerContainer); ejtab.appendChild(contentContainer);
        ejtabContainer.appendChild(ejtab);
        this.initTableProperties(this.tableTab, localValue, this.owner.owner.enableRtl);
        this.initTableRowProperties(this.rowTab, localValue, this.owner.owner.enableRtl);
        this.initTableCellProperties(this.cellTab, localValue, this.owner.owner.enableRtl);
        this.tabObj = new Tab({ enableRtl: isRtl }, ejtab);
        this.target.appendChild(separatorLine);
        let alignMentButtons: NodeListOf<Element> = this.tableTab.getElementsByClassName(this.tableTab.id + 'e-de-table-alignment');
        for (let i: number = 0; i < alignMentButtons.length; i++) {
            (alignMentButtons[i] as HTMLElement).addEventListener('click', this.changeTableAlignment);
        }
        let cellAlignment: NodeListOf<Element> = this.cellTab.getElementsByClassName(this.cellTab.id + 'e-de-table-cell-alignment');
        for (let i: number = 0; i < cellAlignment.length; i++) {
            cellAlignment[i].addEventListener('click', this.changeCellAlignment);
        }

        // let tableTabHeader: HTMLElement = this.tabObj.element.getElementsByClassName('e-item e-toolbar-item')[0] as HTMLElement;
        // let tableTabHeaderItem: HTMLElement = tableTabHeader.getElementsByClassName('e-tab-wrap')[0] as HTMLElement;

        // let rowTabHeader: HTMLElement = this.tabObj.element.getElementsByClassName('e-item e-toolbar-item')[1] as HTMLElement;
        // let rowTabHeaderItem: HTMLElement = rowTabHeader.getElementsByClassName('e-tab-wrap')[0] as HTMLElement;
        // rowTabHeaderItem.classList.add('e-de-table-ppty-dlg-row-header');

        // let cellTabHeader: HTMLElement = this.tabObj.element.getElementsByClassName('e-item e-toolbar-item')[2] as HTMLElement;
        // let cellTabHeaderItem: HTMLElement = cellTabHeader.getElementsByClassName('e-tab-wrap')[0] as HTMLElement;
        // cellTabHeaderItem.classList.add('e-de-table-ppty-dlg-cell-header');
        // if (isRtl) {
        //     tableTabHeaderItem.classList.add('e-de-rtl');
        //     (this.tabObj.element.getElementsByClassName('e-indicator')[0] as HTMLElement).style.left = '155px';
        // } else {
        //     (this.tabObj.element.getElementsByClassName('e-indicator')[0] as HTMLElement).style.right = '155px';
        // }
    }
    /**
     * @private
     */
    public show(): void {
        let localValue: L10n = new L10n('documenteditor', this.owner.owner.defaultLocale);
        localValue.setLocale(this.owner.owner.locale);
        if (!this.target) {
            this.initTablePropertyDialog(localValue, this.owner.owner.enableRtl);
        }

        if (this.owner.selection.caret.style.display !== 'none') {
            this.owner.selection.caret.style.display = 'none';
        }
        this.owner.dialog2.header = localValue.getConstant('Table Properties');
        this.owner.dialog2.position = { X: 'center', Y: 'center' };
        this.owner.dialog2.width = 'auto';
        this.owner.dialog2.height = 'auto';
        this.owner.dialog2.content = this.target;
        this.owner.dialog2.beforeOpen = this.onBeforeOpen;
        this.owner.dialog2.close = this.onCloseTablePropertyDialog;
        this.owner.dialog2.open = this.wireEvent.bind(this);
        this.owner.dialog2.buttons = [{
            click: this.applyTableProperties,
            buttonModel: { content: localValue.getConstant('Ok'), cssClass: 'e-flat e-table-ppty-okay', isPrimary: true }
        },
        {
            click: this.closeTablePropertiesDialog,
            buttonModel: { content: localValue.getConstant('Cancel'), cssClass: 'e-flat e-table-ppty-cancel' }
        }];
        //this.tabObj.select(0);
        this.owner.dialog2.dataBind();
        this.owner.dialog2.show();
    }
    private onBeforeOpen = (): void => {
        this.owner.updateFocus();
        this.loadTableProperties();
    }
    /**
     * @private
     */
    public onCloseTablePropertyDialog = (): void => {
        this.unWireEvent.bind(this);
        this.owner.updateFocus();
    }
    /**
     * @private
     */
    public applyTableProperties = (): void => {
        let selection: Selection = this.owner.selection;
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
                    && this.owner.selection.start.paragraph.associatedCell.ownerTable.tableFormat.preferredWidth === 0) {
                    // tslint:disable-next-line:max-line-length
                    let containerWidth: number = this.owner.selection.start.paragraph.associatedCell.ownerTable.getOwnerWidth(true);
                    let tableWidth: number = this.owner.selection.start.paragraph.associatedCell.ownerTable.getTableClientWidth(containerWidth);
                    this.tableFormat.preferredWidthType = 'Percent';
                    this.tableFormat.preferredWidth = tableWidth / HelperMethods.convertPixelToPoint(this.owner.clientArea.width) * 100;
                }
            }
        }
        if (this.rowHeightValue) {
            this.rowFormat.height = this.rowHeightValue;
        }
        this.owner.owner.editorModule.initComplexHistory('TableProperties');
        this.owner.owner.editorModule.onTableFormat(this.tableFormat);
        this.owner.owner.editorModule.onRowFormat(this.rowFormat);
        this.owner.owner.editorModule.onCellFormat(this.cellFormat);
        this.owner.owner.editorHistory.updateComplexHistory();
        this.closeTablePropertiesDialog();
        this.owner.updateFocus();
    }
    /**
     * @private
     */
    public calculateGridValue(table: TableWidget): void {
        table.calculateGrid();
        table.isGridUpdated = false;
        table.buildTableColumns();
        table.isGridUpdated = true;
        this.owner.selection.owner.isLayoutEnabled = true;
        this.owner.layout.reLayoutTable(table);
        this.owner.owner.editorModule.reLayout(this.owner.selection);
        this.owner.owner.editorModule.updateSelectionTextPosition(true);
        let history: EditorHistory = this.owner.owner.editorHistory;
        if (history && history.currentBaseHistoryInfo) {
            if (history.currentBaseHistoryInfo.modifiedProperties.length > 0) {
                history.currentBaseHistoryInfo.updateSelection();
            }
            history.updateHistory();
        }
        this.owner.owner.editorModule.fireContentChange();
    }
    /**
     * @private
     */
    public applyTableSubProperties = (): void => {
        if (this.isCellOptionsUpdated) {
            let cellFormat: WCellFormat = this.owner.owner.cellOptionsDialogModule.cellFormat;
            this.owner.owner.cellOptionsDialogModule.applySubCellOptions(cellFormat);
        }
        if (this.isTableOptionsUpdated) {
            let tableFormat: WTableFormat = this.owner.owner.tableOptionsDialogModule.tableFormat;
            this.owner.owner.tableOptionsDialogModule.applySubTableOptions(tableFormat);
        }
        this.isCellOptionsUpdated = false;
        this.isTableOptionsUpdated = false;
    }
    /**
     * @private
     */
    public loadTableProperties(): void {
        this.setTableProperties();
        this.setTableRowProperties();
        this.setTableCellProperties();
        if (!this.owner.owner.bordersAndShadingDialogModule) {
            this.bordersAndShadingButton.disabled = true;
        } else {
            this.bordersAndShadingButton.disabled = false;
        }
        // if (!this.owner.owner.tableOptionsDialogModule) {
        //     this.tableOptionButton.disabled = true;
        // } else {
        this.tableOptionButton.disabled = false;
        // }
        // if (!this.owner.owner.cellOptionsDialogModule) {
        //     this.cellOptionButton.disabled = true;
        // } else {
        this.cellOptionButton.disabled = false;
        // }
    }
    /**
     * @private
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
        this.owner.dialog2.open = this.owner.selection.hideCaret.bind(this.owner);
    }
    /**
     * @private
     */
    public wireEvent(): void {
        this.owner.selection.hideCaret();
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
     */
    public closeTablePropertiesDialog = (): void => {
        this.owner.dialog2.hide();
        this.owner.updateFocus();
    }
    //#region Table Format
    /**
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public initTableProperties(element: HTMLDivElement, localValue: L10n, isRtl?: boolean): void {
        let container: HTMLDivElement = <HTMLDivElement>createElement('div', { id: element.id + '_table_TabContainer' });
        let sizeHeader: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: container.id + '_sizeLabel', innerHTML: localValue.getConstant('Size'),
            styles: 'width:100%;margin:0px;', className: 'e-de-table-dialog-options-label'
        });
        let parentContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'display: inline-flex;' });
        let childContainer1: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'float: left;',
            className: 'e-de-table-container-div'
        });
        let childContainer2: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-table-ppty-dlg-preferred-width-div'
        });
        let child1: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'display: inline;',
            className: 'e-de-table-ppty-dlg-measure-div'
        });
        let child2: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'display: inline;position: absolute;',
            className: 'e-de-table-ppty-dlg-measure-drop-down-div'
        });
        let childContainer3: HTMLDivElement = <HTMLDivElement>createElement('div');
        let preferCheckBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            id: element.id + '_Prefer_Width_CheckBox', attrs: { 'type': 'checkbox' }
        });
        this.preferredWidth = <HTMLInputElement>createElement('input', { id: element.id + 'preferred_Width' });
        let controlDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        let tableWidthType: HTMLSelectElement = createElement('select', {
            innerHTML: '<option>' + localValue.getConstant('Points') +
                '</option><option>' + localValue.getConstant('Percent') + '</option>', id: element.id + '_width_dropdown'
        }) as HTMLSelectElement;
        let labeltext: HTMLInputElement = <HTMLInputElement>createElement('label', {
            innerHTML: localValue.getConstant('Measure in'), styles: 'width: 60px;font-size: 11px; font-weight: normal;'
        });
        let alignmentHeader: HTMLDivElement = createElement('div', {
            innerHTML: localValue.getConstant('Alignment'), className: 'e-de-table-dialog-options-label',
            styles: 'width: 100%;margin: 0px;'
        }) as HTMLDivElement;
        let alignmentContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'height:85px;display:inline-flex' });
        let classDivName: string = element.id + 'e-de-table-alignment';
        let leftAlignDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dia-align-div' });
        this.left = createElement('div', {
            className: 'e-icons e-de-table-properties-alignment e-de-table-left-alignment ' + classDivName,
            id: element.id + '_left_alignment', styles: 'width:54px;height:54px;margin:2px'
        }) as HTMLDivElement;
        leftAlignDiv.appendChild(this.left);
        let centerAlignDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dia-align-div' });
        this.center = createElement('div', {
            className: 'e-icons e-de-table-properties-alignment  e-de-table-center-alignment ' + classDivName,
            id: element.id + '_center_alignment', styles: 'width:54px;height:54px;margin:2px'
        }) as HTMLDivElement;
        centerAlignDiv.appendChild(this.center);
        this.right = createElement('div', {
            styles: 'width:54px;height:54px;margin:2px', id: element.id + '_right_alignment',
            className: 'e-icons e-de-table-properties-alignment  e-de-table-right-alignment ' + classDivName
        }) as HTMLDivElement;
        let rightAlignDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dia-align-div' });
        rightAlignDiv.appendChild(this.right);
        let leftlabel: HTMLLabelElement = createElement('label', {
            innerHTML: localValue.getConstant('Left'), className: 'e-de-table-dia-align-label'
        }) as HTMLLabelElement;
        let centerlabel: HTMLLabelElement = createElement('label', {
            innerHTML: localValue.getConstant('Center'), className: 'e-de-table-dia-align-label'
        }) as HTMLLabelElement;
        let rightlabel: HTMLLabelElement = createElement('label', {
            innerHTML: localValue.getConstant('Right'), className: 'e-de-table-dia-align-label'
        }) as HTMLLabelElement;
        let leftIndenetContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
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
            // tslint:disable-next-line:max-line-length
            styles: 'font-weight: normal;font-size: 11px;position:relative;display:block;margin-bottom:18px;top:10px;' + leftIndentLabelMargin
        }) as HTMLLabelElement;
        let leftIndentBox: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'margin-top: 15px;position: relative;' + leftIndentBoxMargin
        });
        this.leftIndent = <HTMLInputElement>createElement('input', { id: element.id + '_left_indent' });
        let tableDirHeader: HTMLDivElement = createElement('div', {
            innerHTML: localValue.getConstant('Table direction'), className: 'e-de-table-dialog-options-label',
            styles: 'width: 100%;margin: 0px;padding-top:14px;'
        }) as HTMLDivElement;
        let tableDirContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'display:flex' });
        let rtlDiv: HTMLElement = createElement('div', { id: element.id + '_TableDirDiv', className: 'e-de-tbl-rtl-btn-div' });
        let rtlInputELe: HTMLElement = createElement('input', { id: element.id + '_rtlEle' });
        rtlDiv.appendChild(rtlInputELe);
        tableDirContainer.appendChild(rtlDiv);
        let ltrDiv: HTMLElement = createElement('div', { id: element.id + '_DirDiv', className: 'e-de-tbl-ltr-btn-div' });
        let ltrInputELe: HTMLElement = createElement('input', { id: element.id + '_ltrEle' });
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
        let tableOptionContiner: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-tbl-dlg-border-btn'
        });
        if (isRtl) {
            tableOptionContiner.style.cssFloat = 'left';
        }
        this.bordersAndShadingButton = createElement('button', {
            innerHTML: localValue.getConstant('Borders and Shading'),
            id: element.id + '_borders_and_shadings', className: 'e-control e-btn e-flat e-de-ok-button',
            attrs: { type: 'button' }
        }) as HTMLButtonElement;
        this.tableOptionButton = createElement('button', {
            className: 'e-control e-btn e-flat', innerHTML: localValue.getConstant('Options'),
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
    }
    /**
     * @private
     */
    public onTableWidthChange(): void {
        this.tableFormat.preferredWidth = this.tableWidthBox.value;
    }
    /**
     * @private
     */
    public onTableWidthTypeChange(): void {
        let value: number;
        let table: TableWidget = this.owner.selection.start.paragraph.associatedCell.ownerTable;
        let width: number = HelperMethods.convertPixelToPoint(this.owner.clientArea.width);
        if (this.tableWidthType.text === 'Percent' && this.owner.selection.tableFormat.preferredWidthType !== 'Percent') {
            value = this.tableWidthBox.value / width * 100;
            this.formatNumericTextBox(this.tableWidthBox, 'Percent', value);
        } else if (this.tableWidthType.text === 'Points' && this.owner.selection.tableFormat.preferredWidthType !== 'Point') {
            value = width / 100 * this.tableWidthBox.value;
            this.formatNumericTextBox(this.tableWidthBox, 'Point', value);
        } else {
            if (this.tableWidthBox.format === '#\'\%\'') {
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
            // tslint:disable-next-line:max-line-length
            this.formatNumericTextBox(this.tableWidthBox, (this.tableWidthType.text === 'Points') ? 'Point' : this.tableWidthType.text as WidthType, value);
        }

        this.tableFormat.preferredWidthType = (this.tableWidthType.text === 'Points') ? 'Point' : this.tableWidthType.text as WidthType;
    }
    /**
     * @private
     */
    public onLeftIndentChange(): void {
        this.tableFormat.leftIndent = this.leftIndentBox.value;
    }
    private setTableProperties(): void {
        //instance of Table Property values
        let tableFormat: SelectionTableFormat = this.owner.selection.tableFormat;
        let tableHasWidth: boolean = tableFormat.preferredWidth > 0;
        let preferredWidth: number = tableFormat.preferredWidth;
        if (isNullOrUndefined(tableFormat.preferredWidth)) {
            this.preferCheckBox.indeterminate = true;
            let startTable: TableWidget = this.owner.selection.start.paragraph.associatedCell.ownerTable;
            let table: TableWidget = startTable.combineWidget(this.owner) as TableWidget;
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
     */
    public changeTableCheckBox = (): void => {
        let enable: boolean = (this.preferCheckBox.checked || this.preferCheckBox.indeterminate);
        this.tableWidthBox.enabled = enable;
        this.tableWidthType.enabled = enable;
        if (enable) {
            this.tableFormat.preferredWidthType = (this.tableWidthType.value === 'Points') ?
                'Point' : this.tableWidthType.value as WidthType;
        } else {
            this.tableFormat.preferredWidthType = this.owner.selection.tableFormat.preferredWidthType;
        }
    }
    /**
     * @private
     */
    public changeTableAlignment = (event: Event): void => {
        this.updateClassForAlignmentProperties(this.tableTab);
        let element: HTMLElement = (event.target as HTMLElement);
        classList(element, ['e-de-table-alignment-active'], ['e-de-table-properties-alignment']);
        let bidi: boolean = this.tableFormat.bidi || this.rtlButton.checked;
        if ((element.classList.contains('e-de-table-left-alignment') && !bidi) ||
            (element.classList.contains('e-de-table-right-alignment') && bidi)) {
            this.leftIndentBox.enabled = true;
        } else {
            this.leftIndentBox.enabled = false;
        }
        this.tableFormat.tableAlignment = this.getTableAlignment() as TableAlignment;
    }
    /**
     * @private
     */
    public getTableAlignment(): string {
        let id: string = this.tableTab.id;
        let groupButtons: NodeListOf<Element> = this.tableTab.getElementsByClassName(id + 'e-de-table-alignment');
        for (let j: number = 0; j < groupButtons.length; j++) {
            let groupButton: HTMLElement = groupButtons[j] as HTMLElement;
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

    /**
     * @private
     */
    public updateClassForAlignmentProperties(element: HTMLElement): void {
        let id: string = element.id;
        let groupButtons: NodeListOf<Element> = element.getElementsByClassName(id + 'e-de-table-alignment');
        for (let j: number = 0; j < groupButtons.length; j++) {
            let groupButton: HTMLElement = groupButtons[j] as HTMLElement;
            if (groupButton.classList.contains('e-de-table-alignment-active')) {
                classList(groupButton, ['e-de-table-properties-alignment'], ['e-de-table-alignment-active']);
            }
        }
    }

    //#endregion

    //#region Row Format
    /**
     * @private
     */
    public initTableRowProperties(element: HTMLDivElement, localValue: L10n, isRtl?: boolean): void {
        let rowDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'width: 100%;' });
        let sizeLabeldiv: HTMLDivElement = <HTMLDivElement>createElement('div', {
            innerHTML: localValue.getConstant('Size'),
            styles: 'width: 100%;',
            className: 'e-de-table-dialog-options-label'
        });
        let parentDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'display: inline-flex;width: 100%;' });
        let childDiv1Float: string;
        if (isRtl) {
            childDiv1Float = 'float: right;';
        } else {
            childDiv1Float = 'float: left;';
        }
        let childDiv1: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-table-header-div', styles: 'margin-top:6px'
        });
        let rowHeightCheckBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: element.id + '_height_CheckBox'
        });
        let childdiv2: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-row-ht-top'
        });
        this.rowHeight = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }, 'id': element.id + '_table_row_height'
        });
        let child2Float: string;
        if (isRtl) {
            child2Float = 'float: left;';
        } else {
            child2Float = 'float: right;';
        }
        let child2: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-ht-wdth-type' });
        let child3: HTMLDivElement = createElement('div') as HTMLDivElement;
        let child4: HTMLDivElement = createElement('div') as HTMLDivElement;
        let controlDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        let rowHeightType: HTMLSelectElement = createElement('select', {
            innerHTML: '<option>' + localValue.getConstant('At least')
                + '</option><option>' + localValue.getConstant('Exactly') + '</option>',
            id: element.id + '_height_type'
        }) as HTMLSelectElement;
        // tslint:disable-next-line:max-line-length
        let labeltext: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: localValue.getConstant('Row height is'), styles: 'font-size: 11px;font-weight: normal;width: 75px;display:block;margin-bottom:8px'
        });
        rowDiv.appendChild(sizeLabeldiv); element.appendChild(rowDiv); childDiv1.appendChild(rowHeightCheckBox);
        parentDiv.appendChild(childDiv1); childdiv2.appendChild(this.rowHeight); parentDiv.appendChild(childdiv2);
        controlDiv.appendChild(rowHeightType); child3.appendChild(labeltext); child4.appendChild(controlDiv);
        child2.appendChild(child3); child2.appendChild(child4); parentDiv.appendChild(child2); element.appendChild(parentDiv);
        let alignmentDiv: HTMLDivElement = createElement('div', {
            innerHTML: localValue.getConstant('Options'), styles: 'width: 100%;',
            className: 'e-de-table-dialog-options-label'
        }) as HTMLDivElement;
        // tslint:disable-next-line:max-line-length
        let allowRowContainer: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-ppty-options-break' });
        let repeatHeaderContaniner: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-ppty-options-header-row' });
        let allowRowBreak: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: element.id + '_allow_row_break'
        });
        let repeatHeader: HTMLInputElement = <HTMLInputElement>createElement('input', {
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
        let rowFormat: SelectionRowFormat = this.owner.selection.rowFormat;
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

        let enabledHeader: boolean = this.enableRepeatHeader() ? false : true;

        if (isNullOrUndefined(this.owner.selection.rowFormat.isHeader)) {
            this.repeatHeader.indeterminate = true;
            this.repeatHeader.disabled = true;
        } else if (this.owner.selection.rowFormat.isHeader) {
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
     */
    public onRowHeightChange(): void {
        this.rowHeightValue = this.rowHeightBox.value;
    }
    /**
     * @private
     */
    public onRowHeightTypeChange(): void {
        this.rowFormat.heightType = this.rowHeightType.text as HeightType;
    }
    /**
     * @private
     */
    public changeTableRowCheckBox = (): void => {
        this.rowHeightType.enabled = this.rowHeightCheckBox.checked;
        this.rowHeightBox.enabled = this.rowHeightCheckBox.checked;
        if (this.rowHeightType.enabled) {
            this.rowFormat.heightType = this.rowHeightType.value as HeightType;
        } else {
            this.rowFormat.heightType = this.owner.selection.rowFormat.heightType;
        }
    }
    /**
     * @private
     */
    public onAllowBreakAcrossPage(): void {
        this.rowFormat.allowBreakAcrossPages = this.allowRowBreak.checked;
    }
    /**
     * @private
     */
    public onRepeatHeader(): void {
        this.rowFormat.isHeader = this.repeatHeader.checked;
    }
    /**
     * @private
     */
    public enableRepeatHeader(): boolean {
        let selection: Selection = this.owner.selection;
        let start: TextPosition = selection.start;
        let end: TextPosition = selection.end;
        if (!selection.isForward) {
            start = selection.end;
            end = selection.start;
        }
        let startCell: TableCellWidget = start.paragraph.associatedCell;
        let endCell: TableCellWidget = end.paragraph.associatedCell;
        return startCell.ownerRow.index === 0 && endCell.ownerTable.equals(startCell.ownerTable);
    }
    //#endregion

    //#region Cell Format
    /**
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public initTableCellProperties(element: HTMLDivElement, localValue: L10n, isRtl?: boolean): void {
        let sizeDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'width: 100%;' });
        let div: HTMLDivElement = createElement('div', {
            innerHTML: localValue.getConstant('Size'), className: 'e-de-table-dialog-options-label',
            styles: 'width: 100%;',
        }) as HTMLDivElement;
        let parentdiv: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'width: 100%;display: inline-flex;' });
        let childdiv1Float: string;
        if (isRtl) {
            childdiv1Float = 'float: right';
        } else {
            childdiv1Float = 'float: left';
        }
        let childdiv1: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-table-cell-header-div', styles: 'margin-top:9px'
        });
        let preferredCellWidthCheckBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: element.id + '_Prefer_Width_CheckBox_cell'
        });
        let childdiv2: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'padding:0px 20px',
        });
        this.preferredCellWidth = <HTMLInputElement>createElement('input', {
            id: element.id + 'tablecell_Width_textBox', attrs: { 'type': 'text' }
        });
        let child2Float: string;
        if (isRtl) {
            child2Float = 'float: left;';
        } else {
            child2Float = 'float: right;';
        }
        let child2: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-ht-wdth-type'
        });
        let child3: HTMLDivElement = <HTMLDivElement>createElement('div');
        let child4Float: string;
        if (isRtl) {
            child4Float = 'float: left;';
        } else {
            child4Float = 'float: right;';
        }
        let child4: HTMLDivElement = <HTMLDivElement>createElement('div');
        let controlDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        let cellWidthType: HTMLSelectElement = createElement('select', {
            innerHTML: '<option>' + localValue.getConstant('Points') + '</option><option>' +
                localValue.getConstant('Percent') + '</option>', 'id': element.id + '_measure_type_cell'
        }) as HTMLSelectElement;
        let labeltext: HTMLLabelElement = createElement('label', {
            innerHTML: localValue.getConstant('Measure in'),
            styles: 'font-size: 11px;font-weight: normal;display:block;margin-bottom:8px'
        }) as HTMLLabelElement;
        sizeDiv.appendChild(div); element.appendChild(sizeDiv); childdiv1.appendChild(preferredCellWidthCheckBox);
        parentdiv.appendChild(childdiv1); childdiv2.appendChild(this.preferredCellWidth);
        parentdiv.appendChild(childdiv2); controlDiv.appendChild(cellWidthType); child3.appendChild(labeltext);
        child4.appendChild(controlDiv); child2.appendChild(child3); child2.appendChild(child4);
        parentdiv.appendChild(child2); element.appendChild(parentdiv);
        let alignmentDiv: HTMLDivElement = createElement('div', {
            innerHTML: localValue.getConstant('Vertical alignment'),
            styles: 'width: 100%;margin: 0px;',
            className: 'e-de-table-dialog-options-label'
        }) as HTMLDivElement;
        let classDivName: string = element.id + 'e-de-table-cell-alignment';
        let divAlignment: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'width: 100%;height: 100px;'
        });
        let divStyle: string = 'width:54px;height:54px;margin:2px;border-style:solid;border-width:1px';
        let topAlignDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dia-align-div' });
        this.cellTopAlign = createElement('div', {
            styles: divStyle, id: element.id + '_cell_top-alignment',
            className: 'e-icons e-de-tablecell-alignment  e-de-tablecell-top-alignment ' + classDivName
        }) as HTMLDivElement;
        topAlignDiv.appendChild(this.cellTopAlign);
        let centerAlignDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dia-align-div' });
        this.cellCenterAlign = createElement('div', {
            styles: divStyle, id: element.id + '_cell_center-alignment',
            className: 'e-icons e-de-tablecell-alignment  e-de-tablecell-center-alignment ' + classDivName
        }) as HTMLDivElement;
        centerAlignDiv.appendChild(this.cellCenterAlign);
        let bottomAlignDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { className: 'e-de-table-dia-align-div' });
        this.cellBottomAlign = createElement('div', {
            styles: divStyle, id: element.id + '_cell_bottom-alignment',
            className: 'e-icons e-de-tablecell-alignment e-de-tablecell-bottom-alignment  ' + classDivName
        }) as HTMLDivElement;
        bottomAlignDiv.appendChild(this.cellBottomAlign);
        let topLabel: HTMLLabelElement = createElement('label', {
            innerHTML: localValue.getConstant('Top'), className: 'e-de-table-dia-align-label'
        }) as HTMLLabelElement;
        let centerLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: localValue.getConstant('Center'), className: 'e-de-table-dia-align-label'
        });
        let bottomLabel: HTMLLabelElement = createElement('label', {
            innerHTML: localValue.getConstant('Bottom'), className: 'e-de-table-dia-align-label'
        }) as HTMLLabelElement;
        this.cellOptionButton = createElement('button', {
            innerHTML: localValue.getConstant('Options'), id: element.id + '_table_cellmargin',
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
        let cellFormat: SelectionCellFormat = this.owner.selection.cellFormat;
        //instance of table cell Values
        this.hasCellWidth = cellFormat.preferredWidth > 0;
        let preferredWidth: number = cellFormat.preferredWidth;
        if (isNullOrUndefined(cellFormat.preferredWidth)) {
            this.preferredCellWidthCheckBox.indeterminate = true;
            preferredWidth = this.owner.selection.start.paragraph.associatedCell.cellFormat.preferredWidth;
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
    /**
     * @private
     */
    public updateClassForCellAlignment(element: HTMLElement): void {
        let cellAlignments: NodeListOf<Element> = element.getElementsByClassName(element.id + 'e-de-table-cell-alignment');
        for (let j: number = 0; j < cellAlignments.length; j++) {
            let cellAlignment: HTMLElement = cellAlignments[j] as HTMLElement;
            if (cellAlignment.classList.contains('e-de-table-alignment-active')) {
                classList(cellAlignment, ['e-de-tablecell-alignment'], ['e-de-table-alignment-active']);
            }
        }
    }
    /**
     * @private
     */
    public formatNumericTextBox(textBox: NumericTextBox, format: WidthType, value: number): void {
        if (format === 'Auto' || format === 'Point') {
            textBox.format = 'n2';
        } else {
            textBox.format = '#\'\%\'';
        }
        textBox.step = 1;
        textBox.decimals = 2;
        textBox.value = value;
    }
    /**
     * @private
     */
    public getCellAlignment(): string {
        let id: string = this.cellTab.id;
        let groupButtons: NodeListOf<Element> = this.cellTab.getElementsByClassName(id + 'e-de-table-cell-alignment');
        for (let j: number = 0; j < groupButtons.length; j++) {
            let groupButton: HTMLElement = groupButtons[j] as HTMLElement;
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
        return this.owner.selection.cellFormat.verticalAlignment;
    }
    /**
     * @private
     */
    public changeTableCellCheckBox = (): void => {
        this.cellWidthType.enabled = this.preferredCellWidthCheckBox.checked;
        this.cellWidthBox.enabled = this.preferredCellWidthCheckBox.checked;
    }
    /**
     * @private
     */
    public onCellWidthChange(): void {
        this.cellFormat.preferredWidth = this.cellWidthBox.value;
    }
    /**
     * @private
     */
    public onCellWidthTypeChange(): void {
        let value: number;
        let table: TableWidget = this.owner.selection.start.paragraph.associatedCell.ownerTable;
        let containerWidth: number = table.getOwnerWidth(true);
        let tableWidth: number = table.getTableClientWidth(containerWidth);
        if (this.cellWidthType.text === 'Percent' && this.owner.selection.cellFormat.preferredWidthType !== 'Percent') {
            value = this.cellWidthBox.value / tableWidth * 100;
            this.formatNumericTextBox(this.cellWidthBox, 'Percent', value);
        } else if (this.cellWidthType.text === 'Points' && this.owner.selection.cellFormat.preferredWidthType !== 'Point') {
            value = tableWidth / 100 * this.cellWidthBox.value;
            this.formatNumericTextBox(this.cellWidthBox, 'Point', value);
        } else {
            if (this.cellWidthBox.format === '#\'\%\'') {
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
            // tslint:disable-next-line:max-line-length
            this.formatNumericTextBox(this.cellWidthBox, (this.cellWidthType.text === 'Points') ? 'Point' : this.cellWidthType.text as WidthType, value);
        }
        this.cellFormat.preferredWidthType = (this.cellWidthType.text === 'Points') ? 'Point' : this.cellWidthType.text as WidthType;
    }
    /**
     * @private
     */
    public changeCellAlignment = (event: Event): void => {
        this.updateClassForCellAlignment(this.cellTab);
        let element: HTMLElement = (event.target as HTMLElement);
        classList(element, ['e-de-table-alignment-active'], ['e-de-tablecell-alignment']);
        this.cellFormat.verticalAlignment = this.getCellAlignment() as CellVerticalAlignment;
    }
    //#endregion
    /**
     * @private
     */
    public showTableOptionsDialog = (): void => {
        this.owner.owner.tableOptionsDialogModule.show();
        this.owner.dialog2.element.style.pointerEvents = 'none';
    }
    /**
     * @private
     */
    public showBordersShadingsPropertiesDialog = (): void => {
        this.owner.owner.bordersAndShadingDialogModule.show();
        this.owner.dialog2.element.style.pointerEvents = 'none';
    }
    /**
     * @private
     */
    public showCellOptionsDialog = (): void => {
        this.owner.owner.cellOptionsDialogModule.show();
        this.owner.dialog2.element.style.pointerEvents = 'none';
    }
    /**
     * @private
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
        this.owner = undefined;
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