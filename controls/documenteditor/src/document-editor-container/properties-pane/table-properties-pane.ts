import { DocumentEditor, ContextType, BorderSettings, BorderType, LineStyle } from '../../document-editor';
import { createElement, KeyboardEventArgs, classList, L10n } from '@syncfusion/ej2-base';
import { Tab, TabItemModel } from '@syncfusion/ej2-navigations';
import { TextProperties } from './text-properties-pane';
import { ImageProperties } from './image-properties-pane';
import { Button, IconPosition } from '@syncfusion/ej2-buttons';
import { ItemModel, DropDownButton, DropDownButtonModel } from '@syncfusion/ej2-splitbuttons';
import { NumericTextBox, ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { DocumentEditorContainer } from '../document-editor-container';
/**
 * Represents table properties
 * @private
 */
export class TableProperties {
    private container: DocumentEditorContainer;
    private tableProperties: HTMLElement;
    public propertiesTab: Tab;
    private elementId: string;
    public tableTextProperties: TextProperties;
    public imageProperty: ImageProperties;
    private shadingBtn: ColorPicker;
    private borderBtn: ColorPicker;
    private borderSize: DropDownButton;

    private tableOutlineBorder: Button;
    private tableAllBorder: Button;
    private tableCenterBorder: Button;
    private tableLeftBorder: Button;
    private tableCenterVerticalBorder: Button;
    private tableRightBorder: Button;
    private tableTopBorder: Button;
    private tableCenterHorizontalBorder: Button;
    private tableBottomBorder: Button;
    private horizontalMerge: Button;

    private insertRowAbove: Button;
    private insertRowBelow: Button;
    private insertColumnLeft: Button;
    private insertColumnRight: Button;
    private deleteRow: Button;
    private deleteColumn: Button;

    private topMargin: NumericTextBox;
    private bottomMargin: NumericTextBox;
    private leftMargin: NumericTextBox;
    private rightMargin: NumericTextBox;

    private alignBottom: Button;
    private alignCenterHorizontal: Button;
    private alignTop: Button;

    private borderSizeColorElement: HTMLCollectionOf<Element>;
    public element: HTMLElement;
    private prevContext: ContextType;
    private textProperties: TextProperties;
    private isTopMarginApply: boolean = false;
    private isRightMarginApply: boolean = false;
    private isBottomMarginApply: boolean = false;
    private isLeftMarginApply: boolean = false;
    private borderColor: string = '#000000';
    private parentElement: HTMLElement;
    public localObj: L10n;
    private isRtl: boolean;


    get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }
    constructor(container: DocumentEditorContainer, imageProperty: ImageProperties, textProperties: TextProperties, isRtl?: boolean) {
        this.container = container;
        this.isRtl = isRtl;
        this.tableTextProperties = new TextProperties(container, 'textProperties', true, this.isRtl);
        this.imageProperty = imageProperty;
        this.elementId = this.documentEditor.element.id;
        this.initializeTablePropPane();
        this.prevContext = this.documentEditor.selection.contextType;
        this.textProperties = textProperties;
    }
    private initializeTablePropPane = (): void => {
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        this.tableProperties = createElement('div', { id: this.elementId + '_tableProperties', styles: 'width:269px;' });
        this.initFillColorDiv();
        this.initBorderStylesDiv();
        this.initCellDiv();
        this.initInsertOrDelCell();
        this.initCellMargin();
        this.initAlignText();
        this.addTablePropertyTab();
        // wire fnt property
        this.wireEvent();
    }
    private addTablePropertyTab = (): void => {
        // tslint:disable-next-line:max-line-length
        this.parentElement = createElement('div', { styles: 'width:269px;height:100%;overflow:auto;display:none' });
        this.element = createElement('div', { id: this.elementId + '_propertyTabDiv', className: 'e-de-property-tab', styles: 'width:269px' });
        // tslint:disable-next-line:max-line-length
        let items: TabItemModel[] = [{ header: { text: this.localObj.getConstant('Table') }, content: this.tableProperties }, { header: { text: this.localObj.getConstant('Text') }, content: this.tableTextProperties.element }] as TabItemModel[];
        this.propertiesTab = new Tab({ items: items, animation: { previous: { effect: 'None' }, next: { effect: 'None' } }, selected: this.onTabSelection }, this.element);
        this.parentElement.appendChild(this.element);
        this.container.propertiesPaneContainer.appendChild(this.parentElement);
    }
    private onTabSelection = (): void => {
        this.documentEditor.resize();
    }
    private wireEvent = (): void => {
        this.shadingBtn.addEventListener('change', this.changeBackgroundColor);
        // tslint:disable-next-line:max-line-length
        this.borderBtn.addEventListener('change', (args: ColorPickerEventArgs): void => { setTimeout((): void => { this.borderColor = args.currentValue.hex; this.tableOutlineBorder.element.focus(); }, 10); });
        this.tableOutlineBorder.element.addEventListener('click', this.onOutlineBorder);
        this.tableAllBorder.element.addEventListener('click', this.onAllBorder);
        this.tableCenterBorder.element.addEventListener('click', this.onInsideBorder);
        this.tableLeftBorder.element.addEventListener('click', this.onLeftBorder);
        this.tableCenterVerticalBorder.element.addEventListener('click', this.onVerticalBorder);
        this.tableRightBorder.element.addEventListener('click', this.onRightBorder);
        this.tableTopBorder.element.addEventListener('click', this.onTopBorder);
        this.tableCenterHorizontalBorder.element.addEventListener('click', this.onHorizontalBorder);
        this.tableBottomBorder.element.addEventListener('click', this.onBottomBorder);
        this.insertRowAbove.element.addEventListener('click', this.onInsertRowAbove);
        this.insertRowBelow.element.addEventListener('click', this.onInsertRowBelow);
        this.insertColumnLeft.element.addEventListener('click', this.onInsertColumnLeft);
        this.insertColumnRight.element.addEventListener('click', this.onInsertColumnRight);
        this.deleteRow.element.addEventListener('click', this.onDeleteRow);
        this.deleteColumn.element.addEventListener('click', this.onDeleteColumn);
        this.horizontalMerge.element.addEventListener('click', this.onMergeCell);
        this.alignTop.element.addEventListener('click', this.applyAlignTop);
        this.alignBottom.element.addEventListener('click', this.applyAlignBottom);
        this.alignCenterHorizontal.element.addEventListener('click', this.applyAlignCenterHorizontal);
        this.topMargin.element.addEventListener('click', (): void => { this.isTopMarginApply = true; });
        this.rightMargin.element.addEventListener('click', (): void => { this.isRightMarginApply = true; });
        this.leftMargin.element.addEventListener('click', (): void => { this.isLeftMarginApply = true; });
        this.bottomMargin.element.addEventListener('click', (): void => { this.isBottomMarginApply = true; });
        this.topMargin.element.addEventListener('keydown', this.onTopMargin);
        this.rightMargin.element.addEventListener('keydown', this.onRightMargin);
        this.leftMargin.element.addEventListener('keydown', this.onLeftMargin);
        this.bottomMargin.element.addEventListener('keydown', this.onBottomMargin);
        this.topMargin.element.addEventListener('blur', (): void => { this.applyTopMargin(); this.isTopMarginApply = false; });
        this.rightMargin.element.addEventListener('blur', (): void => { this.applyRightMargin(); this.isRightMarginApply = false; });
        this.leftMargin.element.addEventListener('blur', (): void => { this.applyLeftMargin(); this.isLeftMarginApply = false; });
        this.bottomMargin.element.addEventListener('blur', (): void => { this.applyBottomMargin(); this.isBottomMarginApply = false; });
    }
    private getBorder = (border: BorderType): BorderSettings => {
        let lineWidth: number = (this.borderSize.content.indexOf('No Border') >= 0) ? 0 : parseInt(this.borderSize.content, 0);
        let linestyle: LineStyle = (lineWidth === 0) ? 'Cleared' : 'Single';
        let borderSettings: BorderSettings = {
            type: border,
            borderColor: this.borderColor,
            lineWidth: lineWidth,
            borderStyle: linestyle
        };
        return borderSettings;
    }
    private onOutlineBorder = (): void => {
        this.documentEditor.editor.applyBorders(this.getBorder('OutsideBorders'));
    }
    private onAllBorder = (): void => {
        this.documentEditor.editor.applyBorders(this.getBorder('AllBorders'));
    }
    private onInsideBorder = (): void => {
        this.documentEditor.editor.applyBorders(this.getBorder('InsideBorders'));
    }
    private onLeftBorder = (): void => {
        this.documentEditor.editor.applyBorders(this.getBorder('LeftBorder'));
    }
    private onVerticalBorder = (): void => {
        this.documentEditor.editor.applyBorders(this.getBorder('InsideVerticalBorder'));
    }
    private onRightBorder = (): void => {
        this.documentEditor.editor.applyBorders(this.getBorder('RightBorder'));
    }
    private onTopBorder = (): void => {
        this.documentEditor.editor.applyBorders(this.getBorder('TopBorder'));
    }
    private onHorizontalBorder = (): void => {
        this.documentEditor.editor.applyBorders(this.getBorder('InsideHorizontalBorder'));
    }
    private onBottomBorder = (): void => {
        this.documentEditor.editor.applyBorders(this.getBorder('BottomBorder'));
    }
    private onTopMargin = (e: KeyboardEventArgs): void => {
        if (e.keyCode === 13) {
            setTimeout((): void => { this.applyTopMargin(); this.isTopMarginApply = false; }, 30);
        }
    }
    private onBottomMargin = (e: KeyboardEventArgs): void => {
        if (e.keyCode === 13) {
            setTimeout((): void => { this.applyBottomMargin(); this.isBottomMarginApply = false; }, 30);
        }
    }
    private onLeftMargin = (e: KeyboardEventArgs): void => {
        if (e.keyCode === 13) {
            setTimeout((): void => { this.applyLeftMargin(); this.isLeftMarginApply = false; }, 30);
        }
    }
    private onRightMargin = (e: KeyboardEventArgs): void => {
        if (e.keyCode === 13) {
            setTimeout((): void => { this.applyRightMargin(); this.isRightMarginApply = false; }, 30);
        }
    }
    private applyTopMargin = (): void => {
        if (!this.isTopMarginApply) {
            return;
        }
        this.documentEditor.selection.cellFormat.topMargin = (this.topMargin.value > this.topMargin.max)
            ? this.topMargin.max : this.topMargin.value;
    }
    private applyBottomMargin = (): void => {
        if (!this.isBottomMarginApply) {
            return;
        }
        this.documentEditor.selection.cellFormat.bottomMargin = (this.bottomMargin.value > this.bottomMargin.max)
            ? this.bottomMargin.max : this.bottomMargin.value;
    }
    private applyLeftMargin = (): void => {
        if (!this.isLeftMarginApply) {
            return;
        }
        this.documentEditor.selection.cellFormat.leftMargin = (this.leftMargin.value > this.leftMargin.max)
            ? this.leftMargin.max : this.leftMargin.value;
    }
    private applyRightMargin = (): void => {
        if (!this.isRightMarginApply) {
            return;
        }
        this.documentEditor.selection.cellFormat.rightMargin = (this.rightMargin.value > this.rightMargin.max)
            ? this.rightMargin.max : this.rightMargin.value;
    }
    private applyAlignTop = (): void => {
        this.documentEditor.selection.cellFormat.verticalAlignment = 'Top';
    }
    private applyAlignBottom = (): void => {
        this.documentEditor.selection.cellFormat.verticalAlignment = 'Bottom';
    }
    private applyAlignCenterHorizontal = (): void => {
        this.documentEditor.selection.cellFormat.verticalAlignment = 'Center';
    }
    private onMergeCell = (): void => {
        this.documentEditor.editor.mergeCells();
    }
    private onInsertRowAbove = (): void => {
        this.documentEditor.editor.insertRow(true);
    }
    private onInsertRowBelow = (): void => {
        this.documentEditor.editor.insertRow(false);
    }
    private onInsertColumnLeft = (): void => {
        this.documentEditor.editor.insertColumn(true);
    }
    private onInsertColumnRight = (): void => {
        this.documentEditor.editor.insertColumn(false);
    }
    private onDeleteRow = (): void => {
        this.documentEditor.editor.deleteRow();
    }
    private onDeleteColumn = (): void => {
        this.documentEditor.editor.deleteColumn();
    }
    public onSelectionChange = (): void => {
        if (this.documentEditor.selection) {
            if (this.documentEditor.editor && this.documentEditor.editor.canMergeCells()) {
                this.horizontalMerge.disabled = false;
            } else {
                this.horizontalMerge.disabled = true;
            }
            if (this.documentEditor.selection.contextType === 'TableText' || this.documentEditor.selection.contextType === 'TableImage') {
                this.shadingBtn.value = this.documentEditor.selection.cellFormat.background;
            }
            // tslint:disable-next-line:max-line-length
            this.topMargin.value = this.documentEditor.selection.cellFormat.topMargin ? this.documentEditor.selection.cellFormat.topMargin : 0;
            // tslint:disable-next-line:max-line-length
            this.bottomMargin.value = this.documentEditor.selection.cellFormat.bottomMargin ? this.documentEditor.selection.cellFormat.bottomMargin : 0;
            // tslint:disable-next-line:max-line-length
            this.rightMargin.value = this.documentEditor.selection.cellFormat.rightMargin ? this.documentEditor.selection.cellFormat.rightMargin : 0;
            // tslint:disable-next-line:max-line-length
            this.leftMargin.value = this.documentEditor.selection.cellFormat.leftMargin ? this.documentEditor.selection.cellFormat.leftMargin : 0;
        }
    }
    private changeBackgroundColor = (args: ColorPickerEventArgs): void => {
        if (!this.documentEditor.isReadOnly) {
            //Handle API for shading.
            this.documentEditor.selection.cellFormat.background = args.currentValue.hex;
            setTimeout((): void => { this.documentEditor.focusIn(); }, 10);
        }
    }
    private initFillColorDiv = (): void => {
        // tslint:disable-next-line:max-line-length
        let fillDiv: HTMLElement = createElement('div', { id: this.elementId + '_fillColorDiv', className: 'e-de-property-div-padding de-tbl-fill-clr' });
        this.tableProperties.appendChild(fillDiv);
        let label: HTMLElement = createElement('label', { className: 'e-de-prop-sub-label', styles: 'margin-left:6px;margin-right:8px' });
        label.textContent = this.localObj.getConstant('Fill');
        fillDiv.appendChild(label);
        let buttonStyle: string = 'width:92px;display:inline-flex;padding:3px';
        // tslint:disable-next-line:max-line-length
        this.shadingBtn = this.createColorPickerTemplate(this.elementId + '_tableShading', fillDiv, this.localObj.getConstant('Fill color'));
        // tslint:disable-next-line:max-line-length
        classList((fillDiv.lastElementChild.lastElementChild.lastElementChild.firstChild as HTMLElement), ['e-de-ctnr-cellbg-clr-picker'], ['e-caret']);
    }
    private initBorderStylesDiv = (): void => {
        let borderStyleDiv: HTMLElement = createElement('div', { className: 'e-de-property-div-padding' });
        this.tableProperties.appendChild(borderStyleDiv);
        let label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        label.textContent = this.localObj.getConstant('Border Style');
        borderStyleDiv.appendChild(label);
        let parentDivMargin: string;
        if (!this.isRtl) {
            parentDivMargin = 'margin-right:9px;';
        } else {
            parentDivMargin = 'margin-left:9px;';
        }
        // tslint:disable-next-line:max-line-length
        let parentDiv: HTMLElement = createElement('div', { id: this.elementId + '_borderStyleDiv', styles: 'display:inline-flex;margin-bottom:3px;' + parentDivMargin });
        let styleDiv: HTMLElement = createElement('div', { styles: 'width:120px;' });
        let div1: HTMLElement = createElement('div', { className: 'e-de-ctnr-group-btn e-btn-group e-de-ctnr-group-btn-top' });
        styleDiv.appendChild(div1);
        let div2: HTMLElement = createElement('div', { className: 'e-de-ctnr-group-btn e-btn-group e-de-ctnr-group-btn-middle' });
        styleDiv.appendChild(div2);
        let div3: HTMLElement = createElement('div', { className: 'e-de-ctnr-group-btn e-btn-group e-de-ctnr-group-btn-bottom' });
        styleDiv.appendChild(div3);
        let btnStyle: string = 'width:' + 40 + 'px;';
        // tslint:disable-next-line:max-line-length
        this.tableOutlineBorder = this.createButtonTemplate(this.elementId + '_tableOutlineBorder', 'e-de-ctnr-outsideborder e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Outside borders'));
        this.tableAllBorder = this.createButtonTemplate(this.elementId + '_tableAllBorder', 'e-de-ctnr-allborders e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('All borders'));
        // tslint:disable-next-line:max-line-length
        this.tableCenterBorder = this.createButtonTemplate(this.elementId + '_tableCenterBorder', 'e-de-ctnr-insideborders e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Inside borders'));
        this.tableLeftBorder = this.createButtonTemplate(this.elementId + '_tableLeftBorder', 'e-de-ctnr-leftborders e-icons', div2, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Left border'));
        // tslint:disable-next-line:max-line-length
        this.tableCenterVerticalBorder = this.createButtonTemplate(this.elementId + '_tableCenterVBorder', 'e-de-ctnr-insideverticalborder e-icons', div2, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Inside vertical border'));
        this.tableRightBorder = this.createButtonTemplate(this.elementId + '_tableRightBorder', 'e-de-ctnr-rightborder e-icons', div2, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Right border'));
        // tslint:disable-next-line:max-line-length
        this.tableTopBorder = this.createButtonTemplate(this.elementId + '_tableTopBorder', 'e-de-ctnr-topborder e-icons', div3, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Top border'));
        this.tableCenterHorizontalBorder = this.createButtonTemplate(this.elementId + '_tableCenterHBorder', 'e-de-ctnr-insidehorizondalborder e-icons', div3, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Inside horizontal border'));
        // tslint:disable-next-line:max-line-length
        this.tableBottomBorder = this.createButtonTemplate(this.elementId + '_tableBottomBorder', 'e-de-ctnr-bottomborder e-icons', div3, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Bottom border'));
        parentDiv.appendChild(styleDiv);
        let styleTypeDivPadding: string;
        if (!this.isRtl) {
            styleTypeDivPadding = 'padding-left:12px;';
        } else {
            styleTypeDivPadding = 'padding-right:12px;';
        }
        // tslint:disable-next-line:max-line-length
        let styleTypeDiv: HTMLElement = createElement('div', { styles: 'width:120px;' + styleTypeDivPadding, className: 'de-tbl-fill-clr' });
        this.borderBtn = this.createColorPickerTemplate(this.elementId + '_tableBorderColor', styleTypeDiv, this.localObj.getConstant('Border color'));
        this.borderBtn.value = '#000000';
        (styleTypeDiv.firstElementChild.lastElementChild.lastElementChild as HTMLElement).style.width = '30px';
        (styleTypeDiv.firstElementChild.lastElementChild.firstElementChild.firstElementChild as HTMLElement).style.width = '60px';
        // tslint:disable-next-line:max-line-length
        classList((styleTypeDiv.lastElementChild.lastElementChild.lastElementChild.firstChild as HTMLElement), ['e-de-ctnr-highlightcolor'], ['e-caret']);
        let borderSizeButton: HTMLElement = createElement('button', { id: this.elementId + '_tableBorderSize', styles: 'width:100px;height:28px;margin-top:8px;font-size:10px;padding:0px;' });
        styleTypeDiv.appendChild(borderSizeButton);
        this.borderSize = this.createBorderSizeDropDown('e-de-ctnr-strokesize e-icons', borderSizeButton);
        parentDiv.appendChild(styleTypeDiv);
        this.borderSizeColorElement = document.getElementsByClassName('e-de-border-width');
        borderStyleDiv.appendChild(parentDiv);
    }
    private initCellDiv = (): void => {
        let cellDiv: HTMLElement = createElement('div', { className: 'e-de-property-div-padding' });
        this.tableProperties.appendChild(cellDiv);
        let label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        label.textContent = this.localObj.getConstant('Cell');
        cellDiv.appendChild(label);
        let parentDiv: HTMLElement = createElement('div', { className: 'e-de-ctnr-group-btn' });
        let btnStyle: string = 'width:' + 38 + 'px;';
        // tslint:disable-next-line:max-line-length
        this.horizontalMerge = this.createButtonTemplate(this.elementId + '_tableOutlineBorder', 'e-de-ctnr-mergecell e-icons', parentDiv, 'e-de-prop-font-button', btnStyle, 'Merge cells');
        //this.verticalMerge = this.createButtonTemplate(this.elementId + '_tableAllBorder', 'e-de-icon-merge-column e-icons', parentDiv, 'e-de-prop-font-button', btnStyle, 'Vertical Merge');
        cellDiv.appendChild(parentDiv);
    }
    private initInsertOrDelCell = (): void => {
        let tableOperationDiv: HTMLElement = createElement('div', { className: 'e-de-property-div-padding' });
        this.tableProperties.appendChild(tableOperationDiv);
        let label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        label.textContent = this.localObj.getConstant('Insert / Delete');
        tableOperationDiv.appendChild(label);
        let parentDiv: HTMLElement = createElement('div', { styles: 'display:inline-flex' });
        let div1: HTMLElement = createElement('div', { className: 'e-de-ctnr-group-btn e-btn-group' });
        parentDiv.appendChild(div1);
        let div2: HTMLElement = createElement('div', { className: 'e-de-ctnr-group-btn e-btn-group' });
        parentDiv.appendChild(div2);
        let btnStyle: string = 'width:' + 38 + 'px;';
        // tslint:disable-next-line:max-line-length
        this.insertColumnLeft = this.createButtonTemplate(this.elementId + '_insertColumnLeft', 'e-de-ctnr-insertleft e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Insert columns to the left'));
        this.insertColumnRight = this.createButtonTemplate(this.elementId + '_insertColumnRight', 'e-de-ctnr-insertright e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Insert columns to the right'));
        // tslint:disable-next-line:max-line-length
        this.insertRowAbove = this.createButtonTemplate(this.elementId + '_insertRowAbove', 'e-de-ctnr-insertabove e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Insert rows above'));
        this.insertRowBelow = this.createButtonTemplate(this.elementId + '_insertRowBelow', 'e-de-ctnr-insertbelow e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Insert rows below'));
        // tslint:disable-next-line:max-line-length
        this.deleteRow = this.createButtonTemplate(this.elementId + '_deleteRow', 'e-de-ctnr-deleterows e-icons', div2, 'e-de-prop-font-button', btnStyle + 'margin-left:9px', this.localObj.getConstant('Delete rows'));
        this.deleteColumn = this.createButtonTemplate(this.elementId + '_deleteColumn', 'e-de-ctnr-deletecolumns e-icons', div2, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Delete columns'));
        tableOperationDiv.appendChild(parentDiv);
    }
    private initCellMargin = (): void => {
        let cellMarginDiv: HTMLElement = createElement('div', { className: 'e-de-property-div-padding e-de-cellmargin-text' });
        this.tableProperties.appendChild(cellMarginDiv);
        let label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        label.textContent = this.localObj.getConstant('Cell Margin');
        cellMarginDiv.appendChild(label);
        let parentDiv: HTMLElement = createElement('div', { styles: 'height: 60px;display:inline-flex' });
        let textboxDivStyle: string = 'width:' + 50 + 'px';
        let textboxParentDivStyle: string = 'width:' + 50 + 'px;float:left;margin-right:' + 9 + 'px';
        // tslint:disable-next-line:max-line-length
        this.topMargin = this.createCellMarginTextBox(this.localObj.getConstant('Top'), this.elementId + '_topMargin', parentDiv, textboxDivStyle, textboxParentDivStyle, 500, 'Top margin');
        // tslint:disable-next-line:max-line-length
        this.bottomMargin = this.createCellMarginTextBox(this.localObj.getConstant('Bottom'), this.elementId + '_bottomMargin', parentDiv, textboxDivStyle, textboxParentDivStyle, 500, 'Bottom margin');
        // tslint:disable-next-line:max-line-length
        this.leftMargin = this.createCellMarginTextBox(this.localObj.getConstant('Left'), this.elementId + '_leftMargin', parentDiv, textboxDivStyle, textboxParentDivStyle, 500, 'Left margin');
        // tslint:disable-next-line:max-line-length
        this.rightMargin = this.createCellMarginTextBox(this.localObj.getConstant('Right'), this.elementId + '_rightMargin', parentDiv, textboxDivStyle, textboxParentDivStyle, 500, 'Right margin');
        cellMarginDiv.appendChild(parentDiv);
    }
    private initAlignText = (): void => {
        let alignmentDiv: HTMLElement = createElement('div', { className: 'e-de-property-div-padding', styles: 'border-bottom-width:0px' });
        this.tableProperties.appendChild(alignmentDiv);
        let label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        label.textContent = this.localObj.getConstant('Align Text');
        alignmentDiv.appendChild(label);
        let parentDiv: HTMLElement = createElement('div', { styles: 'margin-bottom: 10px;' });
        let div: HTMLElement = createElement('div', { className: 'e-de-ctnr-group-btn e-btn-group' });
        parentDiv.appendChild(div);
        let btnStyle: string = 'width:' + 38 + 'px;';
        // tslint:disable-next-line:max-line-length
        this.alignTop = this.createButtonTemplate(this.elementId + '_alignTop', 'e-de-ctnr-aligntop e-icons', div, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Align top'));
        // tslint:disable-next-line:max-line-length
        // this.alignCenterVertical = this.createButtonTemplate(this.elementId + '_alignCenterVertical', 'e-de-icon-merge-column e-icons', parentDiv, 'e-de-prop-font-button', btnStyle, 'Align Center Vertical');
        // tslint:disable-next-line:max-line-length
        // this.alignRight = this.createButtonTemplate(this.elementId + '_alignRight', 'e-de-icon-merge-column e-icons', parentDiv, 'e-de-prop-font-button', btnStyle, 'Align Right');
        this.alignBottom = this.createButtonTemplate(this.elementId + '_alignBottom', 'e-de-ctnr-alignbottom e-icons', div, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Align bottom'));
        // tslint:disable-next-line:max-line-length
        // this.alignCenterHorizontal = this.createButtonTemplate(this.elementId + '_alignCenterHorizontal', 'e-de-icon-merge-column e-icons', parentDiv, 'e-de-prop-font-button', btnStyle, 'Align Center Horizontal');
        this.alignCenterHorizontal = this.createButtonTemplate(this.elementId + '_alignCenterHorizontal', 'e-de-ctnr-aligncenter-table e-icons', div, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Align center'));
        this.alignCenterHorizontal.addEventListener('click', this.applyAlignCenterHorizontal);
        alignmentDiv.appendChild(parentDiv);
    }
    // tslint:disable-next-line:max-line-length
    private createCellMarginTextBox = (textboxLabel: string, textboxId: string, parentDiv: HTMLElement, styles: string, parentStyle: string, maxValue: number, toolTipText: string): NumericTextBox => {
        let cellMarginParentDiv: HTMLElement = createElement('div', { styles: parentStyle });
        let cellMarginLabel: HTMLElement = createElement('label', { className: 'e-de-prop-sub-label' });
        cellMarginLabel.textContent = textboxLabel;
        cellMarginParentDiv.appendChild(cellMarginLabel);
        // tslint:disable-next-line:max-line-length
        let cellMarginTextbox: HTMLInputElement = createElement('input', { className: 'e-textbox', id: textboxId, styles: styles }) as HTMLInputElement;
        cellMarginParentDiv.appendChild(cellMarginTextbox);
        // tslint:disable-next-line:max-line-length
        let cellMarginNumericText: NumericTextBox = new NumericTextBox({ showSpinButton: false, min: 0, format: 'n0', max: maxValue, enableRtl: this.isRtl }, cellMarginTextbox);
        parentDiv.appendChild(cellMarginParentDiv);
        cellMarginTextbox.setAttribute('title', toolTipText);
        return cellMarginNumericText;
    }
    private createBorderSizeDropDown = (iconcss: string, button: HTMLElement): DropDownButton => {
        let div: HTMLElement = createElement('div', { id: 'borderSizeTarget', styles: 'display:none' });
        let ulTag: HTMLElement = createElement('ul', {
            styles: 'display: block; outline: 0px; width: 120px; height: auto;',
            id: 'borderSizeListMenu'
        });
        div.appendChild(ulTag);
        let noneOption: HTMLElement = this.createDropdownOption(ulTag, this.localObj.getConstant('No Border'));
        noneOption.addEventListener('click', (): void => { this.onBorderSizeChange('No Border'); });
        let oneOption: HTMLElement = this.createDropdownOption(ulTag, '1px');
        oneOption.addEventListener('click', (): void => { this.onBorderSizeChange('1px'); });
        let oneHalfOption: HTMLElement = this.createDropdownOption(ulTag, '1.5px');
        oneHalfOption.addEventListener('click', (): void => { this.onBorderSizeChange('1.5px'); });
        let twoOption: HTMLElement = this.createDropdownOption(ulTag, '2px');
        twoOption.addEventListener('click', (): void => { this.onBorderSizeChange('2px'); });
        let threeOption: HTMLElement = this.createDropdownOption(ulTag, '3px');
        threeOption.addEventListener('click', (): void => { this.onBorderSizeChange('3px'); });
        let fourOption: HTMLElement = this.createDropdownOption(ulTag, '4px');
        fourOption.addEventListener('click', (): void => { this.onBorderSizeChange('4px'); });
        let fiveOption: HTMLElement = this.createDropdownOption(ulTag, '5px');
        fiveOption.addEventListener('click', (): void => { this.onBorderSizeChange('5px'); });
        let menuOptions: DropDownButtonModel = {
            target: div,
            iconCss: iconcss,
            cssClass: 'e-de-prop-bordersize',
            enableRtl: this.isRtl,
            content: '1.5px',
        };
        let dropdown: DropDownButton = new DropDownButton(menuOptions);
        dropdown.beforeOpen = (): void => {
            div.style.display = 'block';
            for (let i: number = 0; i < this.borderSizeColorElement.length; i++) {
                // tslint:disable-next-line:max-line-length
                (this.borderSizeColorElement[i] as HTMLElement).style.borderBottomColor = this.borderColor;
            }
        };
        dropdown.beforeClose = (): void => { div.style.display = 'none'; };
        dropdown.appendTo(button);
        dropdown.element.setAttribute('title', this.localObj.getConstant('Border width'));
        return dropdown;
    }
    private onBorderSizeChange = (value: string): void => {
        this.borderSize.content = value;
        setTimeout((): void => { this.tableOutlineBorder.element.focus(); }, 10);
    }
    private createDropdownOption = (ulTag: HTMLElement, text: string): HTMLElement => {
        let liTag: HTMLElement = createElement('li', {
            styles: 'display:block',
            className: 'ui-wfloating-menuitem ui-wfloating-menuitem-md de-list-items  de-list-item-size'
        });
        ulTag.appendChild(liTag);
        let innerHTML: string;
        if (text === 'No Border') {
            innerHTML = '<div>' + text + '</div>';
        } else if (text === '1.5px') {
            // tslint:disable-next-line:max-line-length
            innerHTML = '<div>' + text + '<span class="ui-list-line e-de-border-width"  style="margin-left:10px;border-bottom-width:' + text + ';border-bottom-color:' + this.borderColor + '"' + '></span></div>';
        } else {
            // tslint:disable-next-line:max-line-length
            innerHTML = '<div>' + text + '<span class="ui-list-line e-de-border-width" style="margin-left:20px;border-bottom-width:' + text + ';border-bottom-color:' + this.borderColor + '"' + '></span></div>';
        }
        let liInnerDiv: HTMLElement = createElement('div', {
            className: 'ui-list-header-presetmenu',
            id: 'ui-zlist0', innerHTML: innerHTML
        });
        liTag.appendChild(liInnerDiv);
        return liTag;
    }
    // tslint:disable-next-line:max-line-length
    public createDropDownButton = (id: string, styles: string, parentDiv: HTMLElement, iconCss: string, content: string, items?: ItemModel[], target?: HTMLElement): DropDownButton => {
        let buttonElement: HTMLButtonElement = createElement('button', { id: id, styles: styles }) as HTMLButtonElement;
        parentDiv.appendChild(buttonElement);
        // tslint:disable-next-line:max-line-length
        let dropDownBtn: DropDownButton = new DropDownButton({ iconCss: iconCss, content: content, enableRtl: this.isRtl, cssClass: 'e-de-prop-splitbutton' }, buttonElement);
        if (items) {
            dropDownBtn.items = items;
        }
        if (target) {
            dropDownBtn.target = target;
        }
        return dropDownBtn;
    }
    // tslint:disable-next-line:max-line-length
    private createButtonTemplate(id: string, iconcss: string, div: HTMLElement, buttonClass: string, styles: string, toolTipText: string, content?: string, iconPos?: string): Button {
        let buttonElement: HTMLButtonElement = createElement('Button', { id: id, styles: styles }) as HTMLButtonElement;
        div.appendChild(buttonElement);
        let btn: Button = new Button({
            cssClass: buttonClass, iconCss: iconcss, enableRtl: this.isRtl, iconPosition: (iconPos ? iconPos as IconPosition : 'Left'),
            content: content ? content : ''
        });
        btn.appendTo(buttonElement);
        buttonElement.setAttribute('title', toolTipText);
        return btn;
    }
    private createColorPickerTemplate = (id: string, divElement: HTMLElement, toolTipText: string): ColorPicker => {
        let inputElement: HTMLInputElement = createElement('input', { id: id }) as HTMLInputElement;
        divElement.appendChild(inputElement);
        // tslint:disable-next-line:max-line-length
        let colorPicker: ColorPicker = new ColorPicker({ showButtons: true, cssClass: 'e-de-prop-font-button e-de-prop-font-colorpicker', enableRtl: this.isRtl, locale: this.container.locale }, inputElement);
        inputElement.parentElement.setAttribute('title', toolTipText);
        return colorPicker;
    }
    public showTableProperties = (isShow: boolean): void => {
        if (isShow) {
            if (this.prevContext !== this.documentEditor.selection.contextType) {
                this.propertiesTab.selectedItem = 0;
                this.tableTextProperties.appliedHighlightColor = this.textProperties.appliedHighlightColor;
                this.tableTextProperties.appliedBulletStyle = this.textProperties.appliedBulletStyle;
                this.tableTextProperties.appliedNumberingStyle = this.textProperties.appliedNumberingStyle;
            }
            this.onSelectionChange();
            this.tableTextProperties.onSelectionChange();
            this.textProperties.appliedHighlightColor = this.tableTextProperties.appliedHighlightColor;
            this.textProperties.appliedBulletStyle = this.tableTextProperties.appliedBulletStyle;
            this.textProperties.appliedNumberingStyle = this.tableTextProperties.appliedNumberingStyle;
        }
        if (!isShow && this.parentElement.style.display === 'none' || (isShow && this.parentElement.style.display === 'block')) {
            return;
        }
        this.parentElement.style.display = isShow ? 'block' : 'none';
        this.documentEditor.resize();
        this.prevContext = this.documentEditor.selection.contextType;
    }
    public destroy(): void {
        this.container = undefined;
        if (this.tableTextProperties) {
            this.tableTextProperties.destroy();
            this.tableTextProperties = undefined;
        }
        if (this.propertiesTab) {
            this.propertiesTab.destroy();
            this.propertiesTab = undefined;
        }
        if (this.shadingBtn) {
            this.shadingBtn.destroy();
            this.shadingBtn = undefined;
        }
        if (this.borderBtn) {
            this.borderBtn.destroy();
            this.borderBtn = undefined;
        }
        if (this.borderSize) {
            this.borderSize.destroy();
            this.borderSize = undefined;
        }
        if (this.topMargin) {
            this.topMargin.destroy();
            this.topMargin = undefined;
        }
        if (this.bottomMargin) {
            this.bottomMargin.destroy();
            this.bottomMargin = undefined;
        }
        if (this.leftMargin) {
            this.leftMargin.destroy();
            this.leftMargin = undefined;
        }
        if (this.rightMargin) {
            this.rightMargin.destroy();
            this.rightMargin = undefined;
        }
    }
}