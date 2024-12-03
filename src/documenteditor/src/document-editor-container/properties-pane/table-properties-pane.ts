import { DocumentEditor, ContextType, BorderSettings, BorderType, LineStyle } from '../../document-editor';
import { createElement, KeyboardEventArgs, classList, L10n, remove } from '@syncfusion/ej2-base';
import { Tab, TabItemModel, SelectingEventArgs } from '@syncfusion/ej2-navigations';
import { TextProperties } from './text-properties-pane';
import { ImageProperties } from './image-properties-pane';
import { Button, IconPosition } from '@syncfusion/ej2-buttons';
import { ItemModel, DropDownButton, DropDownButtonModel } from '@syncfusion/ej2-splitbuttons';
import { NumericTextBox, ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { DocumentEditorContainer } from '../document-editor-container';
/**
 * Represents table properties
 *
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
    private borderSizeButton: HTMLElement;
    private borderStyleDiv: HTMLElement;
    public element: HTMLElement;
    private prevContext: ContextType;
    private isTopMarginApply: boolean = false;
    private isRightMarginApply: boolean = false;
    private isBottomMarginApply: boolean = false;
    private isLeftMarginApply: boolean = false;
    private borderColor: string = '#000000';
    private parentElement: HTMLElement;
    public localObj: L10n;
    private isRtl: boolean;
    private groupButtonClass: string = 'e-de-ctnr-group-btn e-btn-group';

    //Event Handler
    private onOutlineBorderClickHandler: EventListenerOrEventListenerObject = this.onOutlineBorder.bind(this);
    private onAllBorderHandler: EventListenerOrEventListenerObject = this.onAllBorder.bind(this);
    private onInsideBorderHandler: EventListenerOrEventListenerObject = this.onInsideBorder.bind(this);
    private onLeftBorderHandler: EventListenerOrEventListenerObject = this.onLeftBorder.bind(this);
    private onVerticalBorderHandler: EventListenerOrEventListenerObject = this.onVerticalBorder.bind(this);
    private onRightBorderHandler: EventListenerOrEventListenerObject = this.onRightBorder.bind(this);
    private onTopBorderHandler: EventListenerOrEventListenerObject = this.onTopBorder.bind(this);
    private onHorizontalBorderHandler: EventListenerOrEventListenerObject = this.onHorizontalBorder.bind(this);
    private onBottomBorderHandler: EventListenerOrEventListenerObject = this.onBottomBorder.bind(this);
    private onInsertRowAboveHandler: EventListenerOrEventListenerObject = this.onInsertRowAbove.bind(this);
    private onInsertRowBelowHandler: EventListenerOrEventListenerObject = this.onInsertRowBelow.bind(this);
    private onInsertColumnLeftHandler: EventListenerOrEventListenerObject = this.onInsertColumnLeft.bind(this);
    private onInsertColumnRightHandler: EventListenerOrEventListenerObject = this.onInsertColumnRight.bind(this);
    private onDeleteRowHandler: EventListenerOrEventListenerObject = this.onDeleteRow.bind(this);
    private onDeleteColumnHandler: EventListenerOrEventListenerObject = this.onDeleteColumn.bind(this);
    private onMergeCellHandler: EventListenerOrEventListenerObject = this.onMergeCell.bind(this);
    private applyAlignTopHandler: EventListenerOrEventListenerObject = this.applyAlignTop.bind(this);
    private applyAlignBottomHandler: EventListenerOrEventListenerObject = this.applyAlignBottom.bind(this);
    private applyAlignCenterHorizontalHandler: EventListenerOrEventListenerObject = this.applyAlignCenterHorizontal.bind(this);
    private onTopMarginHandler: EventListenerOrEventListenerObject = this.onTopMargin.bind(this);
    private onRightMarginHandler: EventListenerOrEventListenerObject = this.onRightMargin.bind(this);
    private onLeftMarginHandler: EventListenerOrEventListenerObject = this.onLeftMargin.bind(this);
    private onBottomMarginHandler: EventListenerOrEventListenerObject = this.onBottomMargin.bind(this);
    private onTopMarginClickHandler: EventListenerOrEventListenerObject = this.onTopMarginClick.bind(this);
    private onTopMarginBlurHandler: EventListenerOrEventListenerObject = this.onTopMarginBlur.bind(this);
    private onRightMarginClickHandler: EventListenerOrEventListenerObject = this.onRightMarginClick.bind(this);
    private onRightMarginBlurHandler: EventListenerOrEventListenerObject = this.onRightMarginBlur.bind(this);
    private onLeftMarginClickHandler: EventListenerOrEventListenerObject = this.onLeftMarginClick.bind(this);
    private onLeftMarginBlurHandler: EventListenerOrEventListenerObject = this.onLeftMarginBlur.bind(this);
    private onBottomMarginClickHandler: EventListenerOrEventListenerObject = this.onBottomMarginClick.bind(this);
    private onBottomMarginBlurHandler: EventListenerOrEventListenerObject = this.onBottomMarginBlur.bind(this);

    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    public constructor(container: DocumentEditorContainer, imageProperty: ImageProperties, isRtl?: boolean) {
        this.container = container;
        this.isRtl = isRtl;
        if (this.isRtl) {
            this.groupButtonClass = 'e-rtl ' + this.groupButtonClass;
        }
        this.tableTextProperties = new TextProperties(container, 'textProperties', true, this.isRtl);
        this.imageProperty = imageProperty;
        this.elementId = this.documentEditor.element.id;
        this.initializeTablePropPane();
        this.prevContext = this.documentEditor.selectionModule.contextType;
    }
    private initializeTablePropPane(): void {
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        this.tableProperties = createElement('div', { className: 'e-de-scrollbar-hide', styles: 'overflow: auto' });
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

    /**
     * @private
     * @param {boolean} enable - enable/disable table properties pane.
     * @returns {void}
     */
    public enableDisableElements(enable: boolean): void {
        if (enable) {
            classList(this.element, [], ['e-de-overlay']);
        } else {
            classList(this.element, ['e-de-overlay'], []);
        }
    }
    private addTablePropertyTab(): void {
        const tableHeader: HTMLElement = createElement('div', { innerHTML: this.localObj.getConstant('Table') });
        const textHeader: HTMLElement = createElement('div', { innerHTML: this.localObj.getConstant('Text') });
        this.parentElement = createElement('div', { styles: 'height:100%;overflow:auto;display:none', className: 'e-de-prop-pane e-de-scrollbar-hide' });
        this.element = createElement('div', { id: this.elementId + '_propertyTabDiv', className: 'e-de-property-tab' });
        /* eslint-disable-next-line max-len */
        const items: TabItemModel[] = [{ header: { text: textHeader }, content: this.tableTextProperties.element }, { header: { text: tableHeader }, content: this.tableProperties }] as TabItemModel[];
        this.propertiesTab = new Tab({ items: items, animation: { previous: { effect: 'None' }, next: { effect: 'None' } }, selected: this.onTabSelection.bind(this) });
        this.propertiesTab.isStringTemplate = true;
        this.propertiesTab.appendTo(this.element);
        this.parentElement.appendChild(this.element);
        this.container.propertiesPaneContainer.appendChild(this.parentElement);
    }
    private onTabSelection(args: SelectingEventArgs): void {
        args.preventFocus = true;
        this.documentEditor.resize();
        if (this.documentEditor.enableAutoFocus)
        {
            this.documentEditor.focusIn();
        }

    }
    private wireEvent(): void {
        this.shadingBtn.addEventListener('change', this.changeBackgroundColor.bind(this));
        this.borderBtn.addEventListener('change', (args: ColorPickerEventArgs): void => {
            setTimeout((): void => {
                this.borderColor = args.currentValue.hex; this.tableOutlineBorder.element.focus();
            }, 10);
        });
        this.tableOutlineBorder.element.addEventListener('click', this.onOutlineBorderClickHandler);
        this.tableAllBorder.element.addEventListener('click', this.onAllBorderHandler);
        this.tableCenterBorder.element.addEventListener('click', this.onInsideBorderHandler);
        this.tableLeftBorder.element.addEventListener('click', this.onLeftBorderHandler);
        this.tableCenterVerticalBorder.element.addEventListener('click', this.onVerticalBorderHandler);
        this.tableRightBorder.element.addEventListener('click', this.onRightBorderHandler);
        this.tableTopBorder.element.addEventListener('click', this.onTopBorderHandler);
        this.tableCenterHorizontalBorder.element.addEventListener('click', this.onHorizontalBorderHandler);
        this.tableBottomBorder.element.addEventListener('click', this.onBottomBorderHandler);
        this.insertRowAbove.element.addEventListener('click', this.onInsertRowAboveHandler);
        this.insertRowBelow.element.addEventListener('click', this.onInsertRowBelowHandler);
        this.insertColumnLeft.element.addEventListener('click', this.onInsertColumnLeftHandler);
        this.insertColumnRight.element.addEventListener('click', this.onInsertColumnRightHandler);
        this.deleteRow.element.addEventListener('click', this.onDeleteRowHandler);
        this.deleteColumn.element.addEventListener('click', this.onDeleteColumnHandler);
        this.horizontalMerge.element.addEventListener('click', this.onMergeCellHandler);
        this.alignTop.element.addEventListener('click', this.applyAlignTopHandler);
        this.alignBottom.element.addEventListener('click', this.applyAlignBottomHandler);
        this.alignCenterHorizontal.element.addEventListener('click', this.applyAlignCenterHorizontalHandler);
        this.topMargin.htmlAttributes = {'aria-label': 'top-margin'};
        this.bottomMargin.htmlAttributes = {'aria-label': 'bottom-margin'};
        this.leftMargin.htmlAttributes = {'aria-label': 'left-margin'};
        this.rightMargin.htmlAttributes = {'aria-label': 'right-Margin'};
        this.topMargin.element.addEventListener('click', this.onTopMarginClickHandler);
        this.rightMargin.element.addEventListener('click', this.onRightMarginClickHandler);
        this.leftMargin.element.addEventListener('click', this.onLeftMarginClickHandler);
        this.bottomMargin.element.addEventListener('click', this.onBottomMarginClickHandler);
        this.topMargin.element.addEventListener('keydown', this.onTopMarginHandler);
        this.rightMargin.element.addEventListener('keydown', this.onRightMarginHandler);
        this.leftMargin.element.addEventListener('keydown', this.onLeftMarginHandler);
        this.bottomMargin.element.addEventListener('keydown', this.onBottomMarginHandler);
        this.topMargin.element.addEventListener('blur', this.onTopMarginBlurHandler);
        this.rightMargin.element.addEventListener('blur', this.onRightMarginBlurHandler);
        this.leftMargin.element.addEventListener('blur', this.onLeftMarginBlurHandler);
        this.bottomMargin.element.addEventListener('blur', this.onBottomMarginBlurHandler);
    }

    private unWireEvent(): void {
        //Event Handler
        this.shadingBtn.removeEventListener('change', this.changeBackgroundColor);
        this.tableOutlineBorder.element.removeEventListener('click', this.onOutlineBorderClickHandler);
        this.tableAllBorder.element.removeEventListener('click', this.onAllBorderHandler);

        this.tableCenterBorder.element.removeEventListener('click', this.onInsideBorderHandler);
        this.tableLeftBorder.element.removeEventListener('click', this.onLeftBorderHandler);
        this.tableCenterVerticalBorder.element.removeEventListener('click', this.onVerticalBorderHandler);
        this.tableRightBorder.element.removeEventListener('click', this.onRightBorderHandler);
        this.tableTopBorder.element.removeEventListener('click', this.onTopBorderHandler);
        this.tableCenterHorizontalBorder.element.removeEventListener('click', this.onHorizontalBorderHandler);
        this.tableBottomBorder.element.removeEventListener('click', this.onBottomBorderHandler);
        this.insertRowAbove.element.removeEventListener('click', this.onInsertRowAboveHandler);
        this.insertRowBelow.element.removeEventListener('click', this.onInsertRowBelowHandler);
        this.insertColumnLeft.element.removeEventListener('click', this.onInsertColumnLeftHandler);
        this.insertColumnRight.element.removeEventListener('click', this.onInsertColumnRightHandler);
        this.deleteRow.element.removeEventListener('click', this.onDeleteRowHandler);
        this.deleteColumn.element.removeEventListener('click', this.onDeleteColumnHandler);
        this.horizontalMerge.element.removeEventListener('click', this.onMergeCellHandler);
        this.alignTop.element.removeEventListener('click', this.applyAlignTopHandler);
        this.alignBottom.element.removeEventListener('click', this.applyAlignBottomHandler);
        this.alignCenterHorizontal.element.removeEventListener('click', this.applyAlignCenterHorizontalHandler);

        this.topMargin.element.removeEventListener('click', this.onTopMarginClickHandler);
        this.rightMargin.element.removeEventListener('click', this.onRightMarginClickHandler);
        this.leftMargin.element.removeEventListener('click', this.onLeftMarginClickHandler);
        this.bottomMargin.element.removeEventListener('click', this.onBottomMarginClickHandler);

        this.topMargin.element.removeEventListener('keydown', this.onTopMarginHandler);
        this.rightMargin.element.removeEventListener('keydown', this.onRightMarginHandler);
        this.leftMargin.element.removeEventListener('keydown', this.onLeftMarginHandler);
        this.bottomMargin.element.removeEventListener('keydown', this.onBottomMarginHandler);
        this.topMargin.element.removeEventListener('blur', this.onTopMarginBlurHandler);
        this.rightMargin.element.removeEventListener('blur', this.onRightMarginBlurHandler);
        this.leftMargin.element.removeEventListener('blur', this.onLeftMarginBlurHandler);
        this.bottomMargin.element.removeEventListener('blur', this.onBottomMarginBlurHandler);
    }

    private onTopMarginClick(): void {
        this.isTopMarginApply = true;
    }
    private onTopMarginBlur(): void {
        this.applyTopMargin(); this.isTopMarginApply = false;
    }
    private onRightMarginClick(): void {
        this.isRightMarginApply = true;
    }
    private onRightMarginBlur(): void {
        this.applyRightMargin(); this.isRightMarginApply = false;
    }
    private onLeftMarginClick(): void {
        this.isLeftMarginApply = true;
    }
    private onLeftMarginBlur(): void {
        this.applyLeftMargin(); this.isLeftMarginApply = false;
    }
    private onBottomMarginClick(): void {
        this.isBottomMarginApply = true;
    }
    private onBottomMarginBlur(): void {
        this.applyBottomMargin(); this.isBottomMarginApply = false;
    }
    private getBorder(border: BorderType): BorderSettings {
        const lineWidth: number = (this.borderSize.content.indexOf('No Border') >= 0) ? 0 : parseFloat(this.borderSize.content);
        const linestyle: LineStyle = (lineWidth === 0) ? 'Cleared' : 'Single';
        const borderSettings: BorderSettings = {
            type: border,
            borderColor: this.borderColor,
            lineWidth: lineWidth,
            borderStyle: linestyle
        };
        return borderSettings;
    }
    private onOutlineBorder(): void {
        this.documentEditor.editorModule.applyBorders(this.getBorder('OutsideBorders'));
    }
    private onAllBorder(): void {
        this.documentEditor.editorModule.applyBorders(this.getBorder('AllBorders'));
    }
    private onInsideBorder(): void {
        this.documentEditor.editorModule.applyBorders(this.getBorder('InsideBorders'));
    }
    private onLeftBorder(): void {
        this.documentEditor.editorModule.applyBorders(this.getBorder('LeftBorder'));
    }
    private onVerticalBorder(): void {
        this.documentEditor.editorModule.applyBorders(this.getBorder('InsideVerticalBorder'));
    }
    private onRightBorder(): void {
        this.documentEditor.editorModule.applyBorders(this.getBorder('RightBorder'));
    }
    private onTopBorder(): void {
        this.documentEditor.editorModule.applyBorders(this.getBorder('TopBorder'));
    }
    private onHorizontalBorder(): void {
        this.documentEditor.editorModule.applyBorders(this.getBorder('InsideHorizontalBorder'));
    }
    private onBottomBorder(): void {
        this.documentEditor.editorModule.applyBorders(this.getBorder('BottomBorder'));
    }
    private onTopMargin(e: KeyboardEventArgs): void {
        if (e.keyCode === 13) {
            setTimeout((): void => {
                this.applyTopMargin(); this.isTopMarginApply = false;
            }, 30);
        }
    }
    private onBottomMargin(e: KeyboardEventArgs): void {
        if (e.keyCode === 13) {
            setTimeout((): void => {
                this.applyBottomMargin(); this.isBottomMarginApply = false;
            }, 30);
        }
    }
    private onLeftMargin(e: KeyboardEventArgs): void {
        if (e.keyCode === 13) {
            setTimeout((): void => {
                this.applyLeftMargin(); this.isLeftMarginApply = false;
            }, 30);
        }
    }
    private onRightMargin(e: KeyboardEventArgs): void {
        if (e.keyCode === 13) {
            setTimeout((): void => {
                this.applyRightMargin(); this.isRightMarginApply = false;
            }, 30);
        }
    }
    private applyTopMargin(): void {
        if (!this.isTopMarginApply) {
            return;
        }
        this.documentEditor.selectionModule.cellFormat.topMargin = (this.topMargin.value > this.topMargin.max)
            ? this.topMargin.max : this.topMargin.value;
    }
    private applyBottomMargin(): void {
        if (!this.isBottomMarginApply) {
            return;
        }
        this.documentEditor.selectionModule.cellFormat.bottomMargin = (this.bottomMargin.value > this.bottomMargin.max)
            ? this.bottomMargin.max : this.bottomMargin.value;
    }
    private applyLeftMargin(): void {
        if (!this.isLeftMarginApply) {
            return;
        }
        this.documentEditor.selectionModule.cellFormat.leftMargin = (this.leftMargin.value > this.leftMargin.max)
            ? this.leftMargin.max : this.leftMargin.value;
    }
    private applyRightMargin(): void {
        if (!this.isRightMarginApply) {
            return;
        }
        this.documentEditor.selectionModule.cellFormat.rightMargin = (this.rightMargin.value > this.rightMargin.max)
            ? this.rightMargin.max : this.rightMargin.value;
    }
    private applyAlignTop(): void {
        this.documentEditor.selectionModule.cellFormat.verticalAlignment = 'Top';
    }
    private applyAlignBottom(): void {
        this.documentEditor.selectionModule.cellFormat.verticalAlignment = 'Bottom';
    }
    private applyAlignCenterHorizontal(): void {
        this.documentEditor.selectionModule.cellFormat.verticalAlignment = 'Center';
    }
    private onMergeCell(): void {
        this.documentEditor.editorModule.mergeCells();
    }
    private onInsertRowAbove(): void {
        this.documentEditor.editorModule.insertRow(true);
    }
    private onInsertRowBelow(): void {
        this.documentEditor.editorModule.insertRow(false);
    }
    private onInsertColumnLeft(): void {
        this.documentEditor.editorModule.insertColumn(true);
    }
    private onInsertColumnRight(): void {
        this.documentEditor.editorModule.insertColumn(false);
    }
    private onDeleteRow(): void {
        this.documentEditor.editorModule.deleteRow();
        this.documentEditor.focusIn();
    }
    private onDeleteColumn(): void {
        this.documentEditor.editorModule.deleteColumn();
        this.documentEditor.focusIn();
    }
    public onSelectionChange(): void {
        if (this.documentEditor.selectionModule) {
            if (this.documentEditor.editorModule && this.documentEditor.editorModule.canMergeCells()) {
                this.horizontalMerge.disabled = false;
            } else {
                this.horizontalMerge.disabled = true;
            }
            if (this.documentEditor.selectionModule.contextType === 'TableText' || this.documentEditor.selectionModule.contextType === 'TableImage') {
                this.shadingBtn.value = this.documentEditor.selectionModule.cellFormat.background ? this.documentEditor.selectionModule.cellFormat.background : '';
            }
            /* eslint-disable-next-line max-len */
            this.topMargin.value = this.documentEditor.selectionModule.cellFormat.topMargin ? this.documentEditor.selectionModule.cellFormat.topMargin : 0;
            /* eslint-disable-next-line max-len */
            this.bottomMargin.value = this.documentEditor.selectionModule.cellFormat.bottomMargin ? this.documentEditor.selectionModule.cellFormat.bottomMargin : 0;
            /* eslint-disable-next-line max-len */
            this.rightMargin.value = this.documentEditor.selectionModule.cellFormat.rightMargin ? this.documentEditor.selectionModule.cellFormat.rightMargin : 0;
            /* eslint-disable-next-line max-len */
            this.leftMargin.value = this.documentEditor.selectionModule.cellFormat.leftMargin ? this.documentEditor.selectionModule.cellFormat.leftMargin : 0;
        }
    }
    private changeBackgroundColor(args: ColorPickerEventArgs): void {
        if (!this.documentEditor.isReadOnly) {
            //Handle API for shading.
            this.documentEditor.selectionModule.cellFormat.background = args.currentValue.hex;
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 10);
        }
    }
    private initFillColorDiv(): void {
        const fillDiv: HTMLElement = createElement('div', { id: this.elementId + '_fillColorDiv', className: 'e-de-property-div-padding de-tbl-fill-clr' });
        this.tableProperties.appendChild(fillDiv);
        const label: HTMLElement = createElement('label', { className: 'e-de-prop-sub-label' });
        label.classList.add('e-de-prop-fill-label');
        if (this.isRtl) {
            label.classList.add('e-de-rtl');
        }
        label.textContent = this.localObj.getConstant('Fill');
        fillDiv.appendChild(label);
        // const buttonStyle: string = 'width:92px;display:inline-flex;padding:3px';
        this.shadingBtn = this.createColorPickerTemplate(this.elementId + '_tableShading', fillDiv, this.localObj.getConstant('Fill color'), false);
        classList((fillDiv.lastElementChild.lastElementChild.lastElementChild.firstChild as HTMLElement), ['e-de-ctnr-cellbg-clr-picker'], ['e-caret']);
        this.documentEditor.documentHelper.shadingBtn = this.shadingBtn;
    }
    private initBorderStylesDiv(): void {
        this.borderStyleDiv = createElement('div', { className: 'e-de-property-div-padding' });
        this.tableProperties.appendChild(this.borderStyleDiv);
        const label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        //label.classList.add('e-de-table-prop-label');
        label.textContent = this.localObj.getConstant('Border Style');
        this.borderStyleDiv.appendChild(label);
        const parentDiv: HTMLElement = createElement('div', { styles: 'display:inline-flex;' });
        const styleDiv: HTMLElement = createElement('div', { styles: 'width:min-content;height:126px', className: 'e-de-grp-btn-ctnr' });
        const div1: HTMLElement = createElement('div', { className: this.groupButtonClass + ' e-de-ctnr-group-btn-top' });
        styleDiv.appendChild(div1);
        const div2: HTMLElement = createElement('div', { className: this.groupButtonClass + ' e-de-ctnr-group-btn-middle' });
        styleDiv.appendChild(div2);
        const div3: HTMLElement = createElement('div', { className: this.groupButtonClass + ' e-de-ctnr-group-btn-bottom' });
        styleDiv.appendChild(div3);
        if (this.isRtl) {
            div1.classList.add('e-de-rtl');
            div3.classList.add('e-de-rtl');
            parentDiv.classList.add('e-de-rtl');
            label.classList.add('e-de-rtl');
        }
        const btnStyle: string = '';
        this.tableOutlineBorder = this.createButtonTemplate(this.elementId + '_tableOutlineBorder', 'e-de-ctnr-outsideborder e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Outside borders'));
        this.tableAllBorder = this.createButtonTemplate(this.elementId + '_tableAllBorder', 'e-de-ctnr-allborders e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('All borders'));
        this.tableCenterBorder = this.createButtonTemplate(this.elementId + '_tableCenterBorder', 'e-de-ctnr-insideborders e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Inside borders'));
        this.tableLeftBorder = this.createButtonTemplate(this.elementId + '_tableLeftBorder', 'e-de-ctnr-leftborders e-icons', div2, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Left border'));
        this.tableCenterVerticalBorder = this.createButtonTemplate(this.elementId + '_tableCenterVBorder', 'e-de-ctnr-insideverticalborder e-icons', div2, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Inside vertical border'));
        this.tableRightBorder = this.createButtonTemplate(this.elementId + '_tableRightBorder', 'e-de-ctnr-rightborder e-icons', div2, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Right border'));
        this.tableTopBorder = this.createButtonTemplate(this.elementId + '_tableTopBorder', 'e-de-ctnr-topborder e-icons', div3, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Top border'));
        this.tableCenterHorizontalBorder = this.createButtonTemplate(this.elementId + '_tableCenterHBorder', 'e-de-ctnr-insidehorizondalborder e-icons', div3, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Inside horizontal border'));
        this.tableBottomBorder = this.createButtonTemplate(this.elementId + '_tableBottomBorder', 'e-de-ctnr-bottomborder e-icons', div3, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Bottom border'));
        parentDiv.appendChild(styleDiv);
        const styleTypeDiv: HTMLElement = createElement('div', { className: 'de-tbl-fill-clr' });
        if (!this.isRtl) {
            styleTypeDiv.classList.add('e-de-stylediv');
        } else {
            styleTypeDiv.classList.add('e-de-stylediv-rtl');
        }
        this.borderBtn = this.createColorPickerTemplate(this.elementId + '_tableBorderColor', styleTypeDiv, this.localObj.getConstant('Border color'), true);
        this.documentEditor.documentHelper.borderBtn = this.borderBtn;
        this.borderBtn.value = '#000000';
        (styleTypeDiv.firstElementChild.lastElementChild.lastElementChild as HTMLElement).style.width = '30px';
        (styleTypeDiv.firstElementChild.lastElementChild.firstElementChild.firstElementChild as HTMLElement).style.width = '100%';
        classList((styleTypeDiv.lastElementChild.lastElementChild.lastElementChild.firstChild as HTMLElement), ['e-de-ctnr-highlightcolor'], ['e-caret']);
        this.borderSizeButton = createElement('button', { id: this.elementId + '_tableBorderSize', className: 'e-de-border-size-button', styles: 'font-size:10px;padding:0px;', attrs: { type: 'button' } });
        styleTypeDiv.appendChild( this.borderSizeButton);
        this.borderSize = this.createBorderSizeDropDown('e-de-ctnr-strokesize e-icons',  this.borderSizeButton);
        parentDiv.appendChild(styleTypeDiv);
        this.borderSizeColorElement = document.getElementsByClassName('e-de-border-width');
        this.borderStyleDiv.appendChild(parentDiv);
    }
    private initCellDiv(): void {
        const cellDiv: HTMLElement = createElement('div', { className: 'e-de-property-div-padding' });
        this.tableProperties.appendChild(cellDiv);
        const label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        //label.classList.add('e-de-table-prop-label');
        label.textContent = this.localObj.getConstant('Cell');
        cellDiv.appendChild(label);
        const parentDiv: HTMLElement = createElement('div', { className: 'e-de-ctnr-group-btn' });
        parentDiv.classList.add('e-de-cell-div');
        if (this.isRtl) {
            parentDiv.classList.add('e-de-rtl');
            label.classList.add('e-de-rtl');
        }
        const btnStyle: string = '';
        this.horizontalMerge = this.createButtonTemplate(this.elementId + '_tableOutlineBorder', 'e-de-ctnr-mergecell e-icons', parentDiv, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Merge cells'));
        //this.verticalMerge = this.createButtonTemplate(this.elementId + '_tableAllBorder', 'e-de-icon-merge-column e-icons', parentDiv, 'e-de-prop-font-button', btnStyle, 'Vertical Merge');
        cellDiv.appendChild(parentDiv);
    }
    private initInsertOrDelCell(): void {
        const tableOperationDiv: HTMLElement = createElement('div', { className: 'e-de-property-div-padding' });
        this.tableProperties.appendChild(tableOperationDiv);
        const label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        //label.classList.add('e-de-table-prop-label');
        label.textContent = this.localObj.getConstant('Insert Or Delete');
        tableOperationDiv.appendChild(label);
        const parentDiv: HTMLElement = createElement('div', { className: 'e-de-insert-del-cell', styles: 'display:inline-flex' });
        const div1: HTMLElement = createElement('div', { className: this.groupButtonClass });
        parentDiv.appendChild(div1);
        const div2: HTMLElement = createElement('div', { className: this.groupButtonClass });
        if (!this.isRtl) {
            div2.style.marginLeft = '12px';
        } else {
            div2.style.marginRight = '12px';
            parentDiv.classList.add('e-de-rtl');
            label.classList.add('e-de-rtl');
        }
        parentDiv.appendChild(div2);
        const btnStyle: string = '';
        this.insertColumnLeft = this.createButtonTemplate(this.elementId + '_insertColumnLeft', 'e-de-ctnr-insertleft e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Insert columns to the left'));
        this.insertColumnRight = this.createButtonTemplate(this.elementId + '_insertColumnRight', 'e-de-ctnr-insertright e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Insert columns to the right'));
        this.insertRowAbove = this.createButtonTemplate(this.elementId + '_insertRowAbove', 'e-de-ctnr-insertabove e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Insert rows above'));
        this.insertRowBelow = this.createButtonTemplate(this.elementId + '_insertRowBelow', 'e-de-ctnr-insertbelow e-icons', div1, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Insert rows below'));
        this.deleteRow = this.createButtonTemplate(this.elementId + '_deleteRow', 'e-de-ctnr-deleterows e-icons', div2, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Delete rows'));
        this.deleteColumn = this.createButtonTemplate(this.elementId + '_deleteColumn', 'e-de-ctnr-deletecolumns e-icons', div2, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Delete columns'));
        tableOperationDiv.appendChild(parentDiv);
    }
    private initCellMargin(): void {
        const cellMarginDiv: HTMLElement = createElement('div', { className: 'e-de-property-div-padding e-de-cellmargin-text' });
        this.tableProperties.appendChild(cellMarginDiv);
        const label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        //label.classList.add('e-de-table-prop-label');
        label.textContent = this.localObj.getConstant('Cell Margin');
        cellMarginDiv.appendChild(label);
        const parentDiv: HTMLElement = createElement('div', { styles: 'display:inline-flex' });
        if (this.isRtl) {
            label.classList.add('e-de-rtl');
        }
        const textboxDivStyle: string = 'width:' + 48 + 'px';
        const textboxParentDivStyle: string = 'width:' + 50 + 'px;float:left;';
        this.topMargin = this.createCellMarginTextBox(this.localObj.getConstant('Top'), this.elementId + '_topMargin', parentDiv, textboxDivStyle, textboxParentDivStyle, 500, this.localObj.getConstant('Top margin'));
        this.bottomMargin = this.createCellMarginTextBox(this.localObj.getConstant('Bottom'), this.elementId + '_bottomMargin', parentDiv, textboxDivStyle, textboxParentDivStyle, 500, this.localObj.getConstant('Bottom margin'));
        this.leftMargin = this.createCellMarginTextBox(this.localObj.getConstant('Left'), this.elementId + '_leftMargin', parentDiv, textboxDivStyle, textboxParentDivStyle, 500, this.localObj.getConstant('Left margin'));
        this.rightMargin = this.createCellMarginTextBox(this.localObj.getConstant('Right'), this.elementId + '_rightMargin', parentDiv, textboxDivStyle, textboxParentDivStyle, 500, this.localObj.getConstant('Right margin'), true);
        cellMarginDiv.appendChild(parentDiv);
    }
    private initAlignText(): void {
        const alignmentDiv: HTMLElement = createElement('div', { className: 'e-de-property-div-padding', styles: 'border-bottom-width:0px' });
        this.tableProperties.appendChild(alignmentDiv);
        const label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        //label.classList.add('e-de-table-prop-label');
        label.textContent = this.localObj.getConstant('Align Text');
        alignmentDiv.appendChild(label);
        const parentDiv: HTMLElement = createElement('div');
        if (this.isRtl) {
            parentDiv.classList.add('e-de-rtl');
            label.classList.add('e-de-rtl');
        }
        const div: HTMLElement = createElement('div', { className: this.groupButtonClass });
        parentDiv.appendChild(div);
        const btnStyle: string = '';
        this.alignTop = this.createButtonTemplate(this.elementId + '_alignTop', 'e-de-ctnr-aligntop e-icons', div, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Align top'));
        // this.alignCenterVertical = this.createButtonTemplate(this.elementId + '_alignCenterVertical', 'e-de-icon-merge-column e-icons', parentDiv, 'e-de-prop-font-button', btnStyle, 'Align Center Vertical');
        // this.alignRight = this.createButtonTemplate(this.elementId + '_alignRight', 'e-de-icon-merge-column e-icons', parentDiv, 'e-de-prop-font-button', btnStyle, 'Align Right');
        this.alignBottom = this.createButtonTemplate(this.elementId + '_alignBottom', 'e-de-ctnr-alignbottom e-icons', div, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Align bottom'));
        // this.alignCenterHorizontal = this.createButtonTemplate(this.elementId + '_alignCenterHorizontal', 'e-de-icon-merge-column e-icons', parentDiv, 'e-de-prop-font-button', btnStyle, 'Align Center Horizontal');
        this.alignCenterHorizontal = this.createButtonTemplate(this.elementId + '_alignCenterHorizontal', 'e-de-ctnr-aligncenter-table e-icons', div, 'e-de-prop-font-button', btnStyle, this.localObj.getConstant('Align center'));
        this.alignCenterHorizontal.addEventListener('click', this.applyAlignCenterHorizontal.bind(this));
        alignmentDiv.appendChild(parentDiv);
    }
    /* eslint-disable-next-line max-len */
    private createCellMarginTextBox(textboxLabel: string, textboxId: string, parentDiv: HTMLElement, styles: string, parentStyle: string, maxValue: number, toolTipText: string, isRight?: boolean): NumericTextBox {
        const cellMarginParentDiv: HTMLElement = createElement('div', { styles: parentStyle });
        if (!isRight) {
            cellMarginParentDiv.classList.add('e-de-cell-text-box');
        }
        const cellMarginLabel: HTMLElement = createElement('label', { className: 'e-de-prop-sub-label' });
        cellMarginLabel.textContent = textboxLabel;
        cellMarginParentDiv.appendChild(cellMarginLabel);
        const cellMarginTextbox: HTMLInputElement = createElement('input', { className: 'e-textbox', id: textboxId, styles: styles }) as HTMLInputElement;
        cellMarginParentDiv.appendChild(cellMarginTextbox);
        const cellMarginNumericText: NumericTextBox = new NumericTextBox({ showSpinButton: false, min: 0, format: 'n0', max: maxValue, enableRtl: this.isRtl }, cellMarginTextbox);
        parentDiv.appendChild(cellMarginParentDiv);
        cellMarginTextbox.setAttribute('title', toolTipText);
        return cellMarginNumericText;
    }
    private createBorderSizeDropDown(iconcss: string, button: HTMLElement): DropDownButton {
        const div: HTMLElement = createElement('div', { id: 'borderSizeTarget', styles: 'display:none' });
        const ulTag: HTMLElement = createElement('ul', {
            styles: 'display: block; outline: 0px; width: 126px; height: auto;',
            id: 'borderSizeListMenu'
        });
        div.appendChild(ulTag);
        const noneOption: HTMLElement = this.createDropdownOption(ulTag, this.localObj.getConstant('No Border'));
        noneOption.addEventListener('click', (): void => {
            this.onBorderSizeChange('No Border');
        });
        const pixel: string = this.localObj.getConstant('px');
        const quaterOption: HTMLElement = this.createDropdownOption(ulTag, '.25' + pixel);
        quaterOption.addEventListener('click', (): void => {
            this.onBorderSizeChange('.25px');
        });
        const halfOption: HTMLElement = this.createDropdownOption(ulTag, '.5' + pixel);
        halfOption.addEventListener('click', (): void => {
            this.onBorderSizeChange('.5px');
        });
        const threeQuatersOption: HTMLElement = this.createDropdownOption(ulTag, '.75' + pixel);
        threeQuatersOption.addEventListener('click', (): void => {
            this.onBorderSizeChange('.75px');
        });
        const oneOption: HTMLElement = this.createDropdownOption(ulTag, '1' + pixel);
        oneOption.addEventListener('click', (): void => {
            this.onBorderSizeChange('1px');
        });
        const oneHalfOption: HTMLElement = this.createDropdownOption(ulTag, '1.5' + pixel);
        oneHalfOption.addEventListener('click', (): void => {
            this.onBorderSizeChange('1.5px');
        });
        const twoOption: HTMLElement = this.createDropdownOption(ulTag, '2' + pixel);
        twoOption.addEventListener('click', (): void => {
            this.onBorderSizeChange('2px');
        });
        const threeOption: HTMLElement = this.createDropdownOption(ulTag, '3' + pixel);
        threeOption.addEventListener('click', (): void => {
            this.onBorderSizeChange('3px');
        });
        const fourOption: HTMLElement = this.createDropdownOption(ulTag, '4' + pixel);
        fourOption.addEventListener('click', (): void => {
            this.onBorderSizeChange('4px');
        });
        const fiveOption: HTMLElement = this.createDropdownOption(ulTag, '5' + pixel);
        fiveOption.addEventListener('click', (): void => {
            this.onBorderSizeChange('5px');
        });
        const sixOption: HTMLElement = this.createDropdownOption(ulTag, '6' + pixel);
        sixOption.addEventListener('click', (): void => {
            this.onBorderSizeChange('6px');
        });
        const menuOptions: DropDownButtonModel = {
            target: div,
            iconCss: iconcss,
            cssClass: 'e-de-prop-bordersize',
            enableRtl: this.isRtl,
            content: '1.5px'
        };
        const dropdown: DropDownButton = new DropDownButton(menuOptions);
        dropdown.beforeOpen = (): void => {
            div.style.display = 'block';
            for (let i: number = 0; i < this.borderSizeColorElement.length; i++) {
                (this.borderSizeColorElement[parseInt(i.toString(), 10)] as HTMLElement).style.borderBottomColor = this.borderColor;
            }
        };
        dropdown.beforeClose = (): void => {
            div.style.display = 'none';
        };
        dropdown.appendTo(button);
        dropdown.element.setAttribute('title', this.localObj.getConstant('Border width'));
        return dropdown;
    }
    private onBorderSizeChange(value: string): void {
        this.borderSize.content = value;
        setTimeout((): void => {
            this.tableOutlineBorder.element.focus();
        }, 10);
    }
    private createDropdownOption(ulTag: HTMLElement, text: string): HTMLElement {
        const liTag: HTMLElement = createElement('li', {
            styles: 'display:block',
            className: 'e-de-floating-menuitem e-de-floating-menuitem-md e-de-list-items  e-de-list-item-size'
        });
        ulTag.appendChild(liTag);
        let innerHTML: string;
        if (text === 'No Border') {
            innerHTML = '<div>' + text + '</div>';
        } else if (text === '1.5px') {
            innerHTML = '<div>' + text + '<span class="e-de-list-line e-de-border-width"  style="margin-left:10px;border-bottom-width:' + text + ';' + '"' + '></span></div>';
        } else {
            innerHTML = '<div>' + text + '<span class="e-de-list-line e-de-border-width" style="margin-left:20px;border-bottom-width:' + text + ';' + '"' + '></span></div>';
        }
        const liInnerDiv: HTMLElement = createElement('div', {
            className: 'e-de-list-header-presetmenu',
            innerHTML: innerHTML
        });
        liTag.appendChild(liInnerDiv);
        return liTag;
    }
    /* eslint-disable-next-line max-len */
    public createDropDownButton(id: string, styles: string, parentDiv: HTMLElement, iconCss: string, content: string, items?: ItemModel[], target?: HTMLElement): DropDownButton {
        const buttonElement: HTMLButtonElement = createElement('button', { id: id, styles: styles, attrs: { type: 'button' } }) as HTMLButtonElement;
        parentDiv.appendChild(buttonElement);
        let splitButtonClass: string = 'e-de-prop-splitbutton';
        if (this.isRtl) {
            splitButtonClass = 'e-rtl ' + splitButtonClass;
        }
        /* eslint-disable-next-line max-len */
        const dropDownBtn: DropDownButton = new DropDownButton({ iconCss: iconCss, content: content, enableRtl: this.isRtl, cssClass: splitButtonClass }, buttonElement);
        if (items) {
            dropDownBtn.items = items;
        }
        if (target) {
            dropDownBtn.target = target;
        }
        return dropDownBtn;
    }
    /* eslint-disable-next-line max-len */
    private createButtonTemplate(id: string, iconcss: string, div: HTMLElement, buttonClass: string, styles: string, toolTipText: string, content?: string, iconPos?: string): Button {
        const buttonElement: HTMLButtonElement = createElement('Button', { id: id, styles: styles, attrs: { type: 'button' } }) as HTMLButtonElement;
        div.appendChild(buttonElement);
        const btn: Button = new Button({
            cssClass: buttonClass, iconCss: iconcss, enableRtl: this.isRtl, iconPosition: (iconPos ? iconPos as IconPosition : 'Left'),
            content: content ? content : ''
        });
        btn.appendTo(buttonElement);
        buttonElement.setAttribute('title', toolTipText);
        buttonElement.setAttribute('aria-label', toolTipText);
        return btn;
    }
    private createColorPickerTemplate(id: string, divElement: HTMLElement, toolTipText: string, isBorderWidth: boolean): ColorPicker {
        const {columns , createPopupOnClick , disabled , enablePersistence , inline ,
            mode , modeSwitcher , noColor , presetColors , showButtons } = this.documentEditor.documentEditorSettings.colorPickerSettings;
        const inputElement: HTMLInputElement = createElement('input', { id: id }) as HTMLInputElement;
        divElement.appendChild(inputElement);
        let cssClass: string = 'e-de-prop-font-button e-de-prop-font-colorpicker';
        if (isBorderWidth) {
            cssClass = cssClass + ' e-de-border-clr-picker';
        }
        /* eslint-disable-next-line max-len */
        const colorPicker: ColorPicker = new ColorPicker({ cssClass: cssClass, enableRtl: this.isRtl, locale: this.container.locale, enableOpacity: false ,
            mode: mode , modeSwitcher: modeSwitcher , showButtons: showButtons , columns: columns ,
            createPopupOnClick : createPopupOnClick , disabled : disabled , enablePersistence : enablePersistence , inline : inline ,
            noColor : noColor , presetColors : presetColors}, inputElement);
        inputElement.parentElement.setAttribute('title', toolTipText);
        inputElement.parentElement.setAttribute('aria-label', toolTipText);
        return colorPicker;
    }
    public showTableProperties(isShow: boolean, propertyType: string): void {
        if (isShow) {
            if (propertyType === 'text') {
                this.propertiesTab.hideTab(1, true);
            } else {
                this.propertiesTab.hideTab(1, false);
                if (this.prevContext !== this.documentEditor.selectionModule.contextType) {
                    this.propertiesTab.selectedItem = 1;
                }
            }
            this.prevContext = this.documentEditor.selectionModule.contextType;
            this.onSelectionChange();
            this.tableTextProperties.onSelectionChange();
        }
        if (!isShow && this.parentElement.style.display === 'none' || (isShow && this.parentElement.style.display === 'block')) {
            return;
        }
        this.parentElement.style.display = isShow ? 'block' : 'none';
        if (isShow) {
            this.updateTabContainerHeight();
        }
        this.documentEditor.resize();
        this.prevContext = this.documentEditor.selectionModule.contextType;
    }
    /**
     * @private
     * @returns {void} - Update tab container height.
     */
    public updateTabContainerHeight(): void {
        if (this.parentElement && this.parentElement.style.display === 'block') {
            const tabHeaderHeight: HTMLElement = (this.parentElement.getElementsByClassName('e-tab-header')[0] as HTMLElement);
            if (tabHeaderHeight) {
                const paneHeight: number = this.parentElement.offsetHeight - tabHeaderHeight.offsetHeight;
                this.tableProperties.style.height = paneHeight + 'px';
                this.tableTextProperties.element.style.height = paneHeight + 'px';
            }
        }
    }
    private removeHTMLDomElement(): void {
        if (this.borderSizeButton) {
            this.borderSizeButton.remove();
            this.borderSizeButton = null;
        }

        if (this.borderStyleDiv) {
            this.borderStyleDiv.childNodes.forEach((element: HTMLElement) => {
                this.borderStyleDiv.removeChild(element);
                element = null;
            });
            this.borderStyleDiv.innerHTML = '';
            this.borderStyleDiv.remove();
            this.borderStyleDiv = null;
        }
        if (this.tableProperties) {
            this.tableProperties.childNodes.forEach((element: HTMLElement) => {
                this.tableProperties.removeChild(element);
                element = null;
            });
            this.tableProperties.innerHTML = '';
            this.tableProperties.remove();
            this.tableProperties = null;
        }
    }
    public destroy(): void {
        this.unWireEvent();

        this.container = undefined;
        if (this.shadingBtn) {
            this.shadingBtn.destroy();
            this.shadingBtn.element.remove();
            this.shadingBtn.element = null;
            this.shadingBtn = undefined;
        }
        if (this.borderBtn) {
            this.borderBtn.destroy();
            this.borderBtn.element.remove();
            this.borderBtn.element = null;
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
            remove(this.rightMargin.element);
            this.rightMargin.destroy();
            this.rightMargin = undefined;
        }
        if (this.tableTextProperties) {
            this.tableTextProperties.destroy();
            this.tableTextProperties = undefined;
        }
        if (this.propertiesTab) {
            this.propertiesTab.destroy();
            this.propertiesTab = undefined;
        }
        if (this.imageProperty) {
            this.imageProperty = null;
        }
        if (this.tableOutlineBorder) {
            this.tableOutlineBorder.destroy();
        }
        this.tableOutlineBorder = undefined;
        if (this.tableAllBorder) {
            this.tableAllBorder.destroy();
        }
        this.tableAllBorder = undefined;
        if (this.tableCenterBorder) {
            this.tableCenterBorder.destroy();
        }
        this.tableCenterBorder = undefined;
        if (this.tableLeftBorder) {
            this.tableLeftBorder.destroy();
        }
        this.tableLeftBorder = undefined;
        if (this.tableCenterVerticalBorder) {
            this.tableCenterVerticalBorder.destroy();
        }
        this.tableCenterVerticalBorder = undefined;
        if (this.tableRightBorder) {
            this.tableRightBorder.destroy();
        }
        this.tableRightBorder = undefined;
        if (this.tableTopBorder) {
            this.tableTopBorder.destroy();
        }
        remove(this.tableTopBorder.element);
        this.tableTopBorder = undefined;
        if (this.tableCenterHorizontalBorder) {
            this.tableCenterHorizontalBorder.destroy();
        }
        remove(this.tableCenterHorizontalBorder.element);
        this.tableCenterHorizontalBorder = undefined;

        if (this.tableBottomBorder) {
            this.tableBottomBorder.destroy();
        }
        remove(this.tableBottomBorder.element);
        this.tableBottomBorder = undefined;
        if (this.horizontalMerge) {
            this.horizontalMerge.destroy();
        }
        remove(this.horizontalMerge.element);
        this.horizontalMerge = undefined;
        if (this.insertRowAbove) {
            this.insertRowAbove.destroy();
        }
        remove(this.insertRowAbove.element);
        this.insertRowAbove = undefined;
        if (this.insertRowBelow) {
            this.insertRowBelow.destroy();
        }
        remove(this.insertRowBelow.element);
        this.insertRowBelow = undefined;
        if (this.insertColumnLeft) {
            this.insertColumnLeft.destroy();
        }
        remove(this.insertColumnLeft.element);
        this.insertColumnLeft = undefined;
        if (this.insertColumnRight) {
            this.insertColumnRight.destroy();
        }
        remove(this.insertColumnRight.element);
        this.insertColumnRight = undefined;
        if (this.deleteRow) {
            this.deleteRow.destroy();
        }
        remove(this.deleteRow.element);
        this.deleteRow = undefined;
        if (this.deleteColumn) {
            this.deleteColumn.destroy();
        }
        remove(this.deleteColumn.element);
        this.deleteColumn = undefined;
        if (this.alignBottom) {
            this.alignBottom.destroy();
        }
        this.alignBottom = undefined;
        if (this.alignCenterHorizontal) {
            this.alignCenterHorizontal.destroy();
        }
        this.alignCenterHorizontal = undefined;
        if (this.alignTop) {
            this.alignTop.destroy();
        }
        this.removeHTMLDomElement();
        this.alignTop = undefined;
        this.groupButtonClass = undefined;
        this.borderColor = undefined;
        this.elementId = undefined;
    }
}
