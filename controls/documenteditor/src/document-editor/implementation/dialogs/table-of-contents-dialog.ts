import { L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CheckBox, Button, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { ListView, SelectEventArgs } from '@syncfusion/ej2-lists';
import { TableOfContentsSettings } from '../index';
import { TabLeader } from '../../base/types';
import { DocumentHelper } from '../viewer';
/**
 * The Table of contents dialog is used to insert or edit table of contents at selection.
 */
export class TableOfContentsDialog {
    private target: HTMLElement;
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    private pageNumber: CheckBox;
    private rightAlign: CheckBox;
    private tabLeader: DropDownList;
    private showLevel: NumericTextBox;
    private hyperlink: CheckBox;
    private style: CheckBox;
    private heading1: HTMLInputElement;
    private heading2: HTMLInputElement;
    private heading3: HTMLInputElement;
    private heading4: HTMLInputElement;
    private heading5: HTMLInputElement;
    private heading6: HTMLInputElement;
    private heading7: HTMLInputElement;
    private heading8: HTMLInputElement;
    private heading9: HTMLInputElement;
    private normal: HTMLInputElement;
    private outline: CheckBox;
    private textBoxInput: HTMLInputElement;
    private listViewInstance: ListView;
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    private getModuleName(): string {
        return 'TableOfContentsDialog';
    }
    /* eslint-disable   */
    /**
     * @private
     * @param {L10n} localValue - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    public initTableOfContentDialog(locale: L10n, isRtl?: boolean): void {
        let instance: TableOfContentsDialog = this;
        let ownerId: string = this.documentHelper.owner.containerId;
        let id: string = ownerId + '_toc_dialog';
        this.target = createElement('div', { id: id, className: 'e-de-toc-dlg-container' });

        let generalDiv: HTMLDivElement = createElement('div', { id: 'general_div', className: 'e-de-toc-dlg-sub-container' }) as HTMLDivElement;
        this.target.appendChild(generalDiv);

        let genLabel: HTMLElement = createElement('div', { id: ownerId + '_genLabel', className: 'e-de-toc-dlg-main-heading', styles: 'margin-bottom: 13px;', innerHTML: locale.getConstant('General') });
        generalDiv.appendChild(genLabel);
        let leftGeneralDivStyles: string;
        let rightBottomGeneralDivStyles: string;
        if (isRtl) {
            leftGeneralDivStyles = 'float:right;'
            rightBottomGeneralDivStyles = 'float:left;position:relative;';
        } else {
            leftGeneralDivStyles = 'float:left;'
            rightBottomGeneralDivStyles = 'float:right;';
        }


        let topContainer: HTMLDivElement = createElement('div', { id: 'general_top_container', styles: 'display:inline-flex' }) as HTMLDivElement;
        let leftGeneralDiv: HTMLDivElement = createElement('div', { id: 'left_general', styles: leftGeneralDivStyles + 'position:relative;' }) as HTMLDivElement;
        topContainer.appendChild(leftGeneralDiv);

        let rightGeneralDiv: HTMLDivElement = createElement('div', { className: 'e-de-toc-dlg-right-general-div' }) as HTMLDivElement;
        topContainer.appendChild(rightGeneralDiv);
        generalDiv.appendChild(topContainer);

        let bottomContainer: HTMLDivElement = createElement('div', { id: 'general_bottom_container', styles: 'display:inline-flex' }) as HTMLDivElement;
        let leftBottomGeneralDiv: HTMLDivElement = createElement('div', { id: 'leftBottom_general', styles: 'float:left;' }) as HTMLDivElement;
        bottomContainer.appendChild(leftBottomGeneralDiv);

        let rightBottomGeneralDiv: HTMLDivElement = createElement('div', { className: 'e-de-toc-dlg-right-sub-container', styles: rightBottomGeneralDivStyles }) as HTMLDivElement;
        bottomContainer.appendChild(rightBottomGeneralDiv);
        generalDiv.appendChild(bottomContainer);

        let pageNumberDiv: HTMLDivElement = createElement('div', { id: 'pageNumber_div', className: 'e-de-toc-dlg-sub-container' }) as HTMLDivElement;
        let pageNumber: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_pageNumber'
        });
        pageNumberDiv.appendChild(pageNumber);

        let rightAlignDiv: HTMLDivElement = createElement('div', { id: 'rightAlign_div', className: 'e-de-toc-dlg-sub-container' }) as HTMLDivElement;
        let rightAlign: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_rightAlign'
        });
        rightAlignDiv.appendChild(rightAlign);


        this.pageNumber = new CheckBox({ label: locale.getConstant('Show page numbers'), enableRtl: isRtl, checked: true, change: this.changePageNumberValue });

        this.rightAlign = new CheckBox({ label: locale.getConstant('Right align page numbers'), enableRtl: isRtl, checked: true, change: this.changeRightAlignValue });
        this.pageNumber.appendTo(pageNumber); this.rightAlign.appendTo(rightAlign);

        let tabDiv: HTMLDivElement = createElement('div', { id: 'tab_div', className: 'e-de-toc-dlg-tab-div' }) as HTMLDivElement;

        let tabLeaderLabelDiv: HTMLDivElement = createElement('div', { id: 'tabLeaderLabel_div' }) as HTMLDivElement;

        let tabLeaderLabel: HTMLElement = createElement('label', { id: ownerId + '_tabLeaderLabel', className: 'e-de-toc-dlg-heading', innerHTML: locale.getConstant('Tab leader') + ':' });
        tabLeaderLabelDiv.appendChild(tabLeaderLabel);
        let tabLeaderDiv: HTMLDivElement = createElement('div', { id: 'tabLeader_div' }) as HTMLDivElement;
        let tabLeader: HTMLElement = createElement('select', {
            id: ownerId + '_tabLeader',
            innerHTML: '<option value="None">' + '(' + locale.getConstant('None').toLocaleLowerCase() + ')' +
                '</option><option value="Dot" selected>' + '....................' +
                '</option><option value="Hyphen">' + '-------------------' +
                '</option><option value="Underscore">' + '____________' + '</option>'
        }) as HTMLSelectElement;
        tabLeaderDiv.appendChild(tabLeader); tabDiv.appendChild(tabLeaderLabelDiv); tabDiv.appendChild(tabLeaderDiv);
        leftGeneralDiv.appendChild(pageNumberDiv);

        leftGeneralDiv.appendChild(rightAlignDiv);
        leftGeneralDiv.appendChild(tabDiv);

        this.tabLeader = new DropDownList({ width: 210, enableRtl: isRtl }); this.tabLeader.appendTo(tabLeader);

        let hyperlink: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_hyperlink'
        });
        rightGeneralDiv.appendChild(hyperlink);

        this.hyperlink = new CheckBox({ label: locale.getConstant('Use hyperlinks instead of page numbers'), cssClass: 'e-de-toc-label', enableRtl: isRtl, checked: true });
        this.hyperlink.appendTo(hyperlink);

        let showDiv: HTMLDivElement = createElement('div', { id: 'show_div', className: 'e-de-toc-dlg-style-label' }) as HTMLDivElement;

        let showLevelLabelDiv: HTMLDivElement = createElement('div', { id: 'showLevelLabel_div', className: 'e-de-toc-dlg-show-level-div' }) as HTMLDivElement;

        let showLevelLabel: HTMLElement = createElement('label', { id: ownerId + '_showLevelLabel', className: 'e-de-toc-dlg-heading', innerHTML: locale.getConstant('Show levels') + ':' });
        showLevelLabelDiv.appendChild(showLevelLabel);

        let showLevelDiv: HTMLDivElement = createElement('div', { id: 'showLevel_div', className: 'e-de-toc-dlg-showlevel-div' }) as HTMLDivElement;

        let showLevel: HTMLInputElement = createElement('input', { id: ownerId + '_showLevel', attrs: { 'type': 'text' } }) as HTMLInputElement;
        showLevelDiv.appendChild(showLevel); showDiv.appendChild(showLevelLabelDiv); showDiv.appendChild(showLevelDiv);
        rightGeneralDiv.appendChild(showDiv);
        this.showLevel = new NumericTextBox({ format: '#', value: 3, min: 1, max: 9, width: 210, change: this.changeShowLevelValue.bind(this) });
        this.showLevel.appendTo(showLevel);
        if (isRtl) {
            this.hyperlink.cssClass = 'e-de-toc-label-rtl';
            showLevelLabelDiv.classList.add('e-de-rtl');
            showLevelDiv.classList.add('e-de-rtl');
            rightBottomGeneralDiv.classList.add('e-de-rtl');
        }


        let buildTableDiv: HTMLDivElement = createElement('div', { id: 'buildTable_div', className: 'e-de-toc-dlg-sub-container' }) as HTMLDivElement;

        let buildTableLabel: HTMLElement = createElement('div', { id: ownerId + '_buildTableLabel', className: 'e-de-toc-dlg-main-heading e-de-toc-dlg-build-table', styles: 'margin-bottom: 13px;', innerHTML: locale.getConstant('Build table of contents from') + ':' });
        leftBottomGeneralDiv.appendChild(buildTableDiv);
        leftBottomGeneralDiv.appendChild(buildTableLabel);

        let style: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_style',
        });
        leftBottomGeneralDiv.appendChild(style);
        this.style = new CheckBox({ label: locale.getConstant('Styles'), enableRtl: isRtl, checked: true, change: this.changeStyleValue });
        this.style.appendTo(style);

        let table: HTMLTableElement = <HTMLTableElement>createElement('TABLE', { styles: 'margin-top:3px;' });
        let tr1: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        let td1: HTMLTableCellElement = <HTMLTableCellElement>createElement('td', { styles: 'width:120px;padding-left:10px;' });
        let availableLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {

            innerHTML: locale.getConstant('Available styles'), className: 'e-de-toc-dlg-main-heading e-de-toc-dlg-sub-level-heading', id: this.target.id + '_availableLabel'
        });
        td1.appendChild(availableLabel);
        let td2: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        let tocLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('TOC level') + ':', className: 'e-de-toc-dlg-main-heading e-de-toc-dlg-sub-level-heading',
            id: this.target.id + '_tocLabel'
        });
        td2.appendChild(tocLabel);
        tr1.appendChild(td1); tr1.appendChild(td2);
        table.appendChild(tr1);


        let tableDiv: HTMLDivElement = createElement('div', { id: 'table_div', className: 'e-de-toc-table-div' }) as HTMLDivElement;
        let table1: HTMLTableElement = <HTMLTableElement>createElement('TABLE');
        let tr2: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        let td3: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        let heading1Label: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Heading') + ' 1',
            className: 'e-de-toc-dlg-sub-heading', id: this.target.id + '_heading1Label'
        });
        td3.appendChild(heading1Label);
        let td4: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        this.heading1 = createElement('input', { id: '_heading1', className: 'e-input e-de-toc-dlg-toc-level' }) as HTMLInputElement;
        this.heading1.value = '1';
        this.heading1.addEventListener('keyup', this.changeStyle);
        td4.appendChild(this.heading1);
        tr2.appendChild(td3); tr2.appendChild(td4);

        let tr3: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        let td5: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        let heading2Label: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Heading') + ' 2',
            className: 'e-de-toc-dlg-sub-heading', id: this.target.id + '_heading2Label'
        });
        td5.appendChild(heading2Label);
        let td6: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        this.heading2 = createElement('input', { id: '_heading2', className: 'e-input e-de-toc-dlg-toc-level' }) as HTMLInputElement;
        this.heading2.value = '2';
        this.heading2.addEventListener('keyup', this.changeStyle);
        td6.appendChild(this.heading2);
        tr3.appendChild(td5); tr3.appendChild(td6);

        let tr4: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        let td7: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        let heading3Label: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Heading') + ' 3',
            className: 'e-de-toc-dlg-sub-heading', id: this.target.id + '_heading3Label'
        });
        td7.appendChild(heading3Label);
        let td8: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        this.heading3 = createElement('input', { id: '_heading3', className: 'e-input e-de-toc-dlg-toc-level' }) as HTMLInputElement;
        this.heading3.value = '3';
        this.heading3.addEventListener('keyup', this.changeStyle);
        td8.appendChild(this.heading3);
        tr4.appendChild(td7); tr4.appendChild(td8);

        let tr5: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        let td9: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        let heading4Label: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Heading') + ' 4',
            className: 'e-de-toc-dlg-sub-heading', id: this.target.id + '_heading4Label'
        });
        td9.appendChild(heading4Label);
        let td10: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        this.heading4 = createElement('input', { id: '_heading4', className: 'e-input e-de-toc-dlg-toc-level' }) as HTMLInputElement;
        this.heading4.addEventListener('keyup', this.changeStyle);
        td10.appendChild(this.heading4);
        tr5.appendChild(td9); tr5.appendChild(td10);

        let tr6: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        let td11: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        let heading5Label: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Heading') + ' 5',
            className: 'e-de-toc-dlg-sub-heading', id: this.target.id + '_heading5Label'
        });
        td11.appendChild(heading5Label);
        let td12: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        this.heading5 = createElement('input', { id: '_heading5', className: 'e-input e-de-toc-dlg-toc-level' }) as HTMLInputElement;
        this.heading5.addEventListener('keyup', this.changeStyle);
        td12.appendChild(this.heading5);
        tr6.appendChild(td11); tr6.appendChild(td12);

        let tr7: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        let td13: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        let heading6Label: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Heading') + ' 6',
            className: 'e-de-toc-dlg-sub-heading', id: this.target.id + '_heading6Label'
        });
        td13.appendChild(heading6Label);
        let td14: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        this.heading6 = createElement('input', { id: '_heading6', className: 'e-input e-de-toc-dlg-toc-level' }) as HTMLInputElement;
        this.heading6.addEventListener('keyup', this.changeStyle);
        td14.appendChild(this.heading6);
        tr7.appendChild(td13); tr7.appendChild(td14);

        let tr8: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        let td15: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        let heading7Label: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Heading') + ' 7',
            className: 'e-de-toc-dlg-sub-heading', id: this.target.id + '_heading7Label'
        });
        td15.appendChild(heading7Label);
        let td16: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        this.heading7 = createElement('input', { id: '_heading7', className: 'e-input e-de-toc-dlg-toc-level' }) as HTMLInputElement;
        this.heading7.addEventListener('keyup', this.changeStyle);
        td16.appendChild(this.heading7);
        tr8.appendChild(td15); tr8.appendChild(td16);

        let tr9: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        let td17: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        let heading8Label: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Heading') + ' 8',
            className: 'e-de-toc-dlg-sub-heading', id: this.target.id + '_heading8Label'
        });
        td17.appendChild(heading8Label);
        let td18: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        this.heading8 = createElement('input', { id: '_heading8', className: 'e-input e-de-toc-dlg-toc-level' }) as HTMLInputElement;
        this.heading8.addEventListener('keyup', this.changeStyle);
        td18.appendChild(this.heading8);
        tr9.appendChild(td17); tr9.appendChild(td18);

        let tr10: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        let td19: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        let heading9Label: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Heading') + ' 9',
            className: 'e-de-toc-dlg-sub-heading', id: this.target.id + '_heading9Label'
        });
        td19.appendChild(heading9Label);
        let td20: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        this.heading9 = createElement('input', { id: '_heading9', className: 'e-input e-de-toc-dlg-toc-level' }) as HTMLInputElement;
        this.heading9.addEventListener('keyup', this.changeStyle);
        td20.appendChild(this.heading9);
        tr10.appendChild(td19); tr10.appendChild(td20);

        let tr12: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        let td23: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        let normalLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: locale.getConstant('Normal'),
            className: 'e-de-toc-dlg-sub-heading', id: this.target.id + '_normalLabel'
        });
        td23.appendChild(normalLabel);
        let td24: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        this.normal = createElement('input', { id: '_normal', className: 'e-input e-de-toc-dlg-toc-level' }) as HTMLInputElement;
        this.normal.addEventListener('keyup', this.changeHeadingStyle);
        td24.appendChild(this.normal);
        tr12.appendChild(td23); tr12.appendChild(td24);
        if (isRtl) {
            this.normal.classList.add('e-de-rtl');
            this.heading1.classList.add('e-de-rtl');
            this.heading2.classList.add('e-de-rtl');
            this.heading3.classList.add('e-de-rtl');
            this.heading4.classList.add('e-de-rtl');
            this.heading5.classList.add('e-de-rtl');
            this.heading6.classList.add('e-de-rtl');
            this.heading7.classList.add('e-de-rtl');
            this.heading8.classList.add('e-de-rtl');
            this.heading9.classList.add('e-de-rtl');
        }

        table1.appendChild(tr2); table1.appendChild(tr3); table1.appendChild(tr4); table1.appendChild(tr5);
        table1.appendChild(tr6); table1.appendChild(tr7); table1.appendChild(tr8); table1.appendChild(tr9);
        table1.appendChild(tr10); table1.appendChild(tr12);
        tableDiv.appendChild(table1);
        let stylesLevelDiv: HTMLElement = createElement('div', { className: 'e-de-toc-styles-table-div' });
        stylesLevelDiv.appendChild(table);
        stylesLevelDiv.appendChild(tableDiv);
        leftBottomGeneralDiv.appendChild(stylesLevelDiv);
        //leftBottomGeneralDiv.appendChild(table); leftBottomGeneralDiv.appendChild(tableDiv);

        let fieldsDiv: HTMLDivElement = createElement('div', { id: 'fields_div', styles: 'display: flex;' }) as HTMLDivElement;
        leftBottomGeneralDiv.appendChild(fieldsDiv);
        let outDiv: HTMLDivElement = createElement('div', { id: 'out_div' }) as HTMLDivElement;

        let outlineDiv: HTMLDivElement = createElement('div', { id: 'outline_div', className: 'e-de-toc-dlg-sub-container e-de-toc-dlg-outline-levels' }) as HTMLDivElement;
        let outline: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: '_outline'
        });
        outlineDiv.appendChild(outline);
        outDiv.appendChild(outlineDiv);
        fieldsDiv.appendChild(outDiv);
        this.outline = new CheckBox({
            label: locale.getConstant('Outline levels'),
            enableRtl: isRtl, checked: true, cssClass: 'e-de-outline-rtl'
        });
        this.outline.appendTo(outline);

        let resetButtonDiv: HTMLElement = createElement('div', { className: 'e-de-toc-reset-button' });
        fieldsDiv.appendChild(resetButtonDiv);
        let resetElement: HTMLElement = createElement('button', {
            innerHTML: locale.getConstant('Reset'), id: 'reset',
            attrs: { type: 'button' }
        });
        resetButtonDiv.appendChild(resetElement);
        let resetButton: Button = new Button({ cssClass: 'e-btn e-flat' });
        resetButton.appendTo(resetElement);
        resetElement.addEventListener('click', this.reset);


        let tocStylesDiv: HTMLDivElement = createElement('div', { id: 'tocStyles_div', className: 'e-de-toc-dlg-sub-container' }) as HTMLDivElement;

        let tocStylesLabel: HTMLElement = createElement('div', {
            id: ownerId + '_tocStylesLabel', className: 'e-de-toc-dlg-main-heading e-de-toc-dlg-styles',
            innerHTML: locale.getConstant('Styles') + ':'
        });
        rightBottomGeneralDiv.appendChild(tocStylesDiv);
        rightBottomGeneralDiv.appendChild(tocStylesLabel);

        let textBoxDiv: HTMLElement = createElement('div', { className: 'e-de-toc-dlg-style-input' });
        rightBottomGeneralDiv.appendChild(textBoxDiv);
        this.textBoxInput = createElement('input', { className: 'e-input', id: 'toclist' }) as HTMLInputElement;
        this.textBoxInput.setAttribute('type', 'text');
        textBoxDiv.appendChild(this.textBoxInput);

        let listViewDiv: HTMLElement = createElement('div', { className: 'e-de-toc-list-view' });
        let styleLocale: string[] = ['TOC 1', 'TOC 2', 'TOC 3', 'TOC 4', 'TOC 5', 'TOC 6', 'TOC 7', 'TOC 8', 'TOC 9'];
        let styleValues: string[] = this.styleLocaleValue(styleLocale, locale);
        this.listViewInstance = new ListView({ dataSource: styleValues, cssClass: 'e-toc-list-view' });
        this.listViewInstance.appendTo(listViewDiv);
        this.listViewInstance.addEventListener('select', this.selectHandler);
        rightBottomGeneralDiv.appendChild(listViewDiv);

        let modifyButtonDiv: HTMLElement = createElement('div', { className: 'e-de-toc-modify-button' });
        rightBottomGeneralDiv.appendChild(modifyButtonDiv);
        let modifyElement: HTMLElement = createElement('button', {
            innerHTML: locale.getConstant('Modify') + '...', id: 'modify',
            attrs: { type: 'button' }
        });
        modifyButtonDiv.appendChild(modifyElement);
        let modifyButton: Button = new Button({ cssClass: 'e-btn e-flat' });
        modifyButton.appendTo(modifyElement);
        modifyElement.addEventListener('click', this.showStyleDialog);
        if (isRtl) {
            resetButtonDiv.classList.add('e-de-rtl');
            tocStylesLabel.classList.add('e-de-rtl');
            textBoxDiv.classList.add('e-de-rtl');
            listViewDiv.classList.add('e-de-rtl');
            modifyButtonDiv.classList.add('e-de-rtl');
        }
    }
    private styleLocaleValue(styleLocale: string[], localValue: L10n): string[] {
        let styleName: string[] = [];
        for (let index: number = 0; index < styleLocale.length; index++) {
            styleName.push(localValue.getConstant(styleLocale[index]));
        }
        return styleName;
    }
    /**
     * @private
     */
    public show(): void {
        let localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initTableOfContentDialog(localValue, this.documentHelper.owner.enableRtl);
        }
        this.documentHelper.dialog3.header = localValue.getConstant('Table of Contents');
        this.documentHelper.dialog3.position = { X: 'center', Y: 'center' };
        this.documentHelper.dialog3.width = 'auto';
        this.documentHelper.dialog3.height = 'auto';
        this.documentHelper.dialog3.content = this.target;
        this.documentHelper.dialog3.beforeOpen = this.loadTableofContentDialog;
        this.documentHelper.dialog3.close = this.closeTableOfContentDialog;
        this.documentHelper.dialog3.buttons = [{
            click: this.applyTableOfContentProperties,
            buttonModel: { content: localValue.getConstant('Ok'), cssClass: 'e-flat e-toc-okay', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: localValue.getConstant('Cancel'), cssClass: 'e-flat e-toc-cancel' }
        }];
        this.documentHelper.dialog3.dataBind();
        this.documentHelper.dialog3.show();
    }
    /**
     * @private
     * @returns {void}
     */
    public loadTableofContentDialog = (): void => {
        this.documentHelper.updateFocus();
        this.pageNumber.checked = true;
        this.rightAlign.disabled = false;
        this.rightAlign.checked = true;
        this.tabLeader.enabled = true;
        this.hyperlink.checked = true;
        this.style.checked = true;
        this.outline.checked = true;
        this.outline.disabled = false;
        this.showLevel.enabled = true;
    }
    /**
     * @private
     * @returns {void}
     */
    public closeTableOfContentDialog = (): void => {
        this.unWireEventsAndBindings();
        this.documentHelper.updateFocus();
    }
    /**
     * @private
     * @returns {void}
     */
    public onCancelButtonClick = (): void => {
        this.documentHelper.dialog3.hide();
        this.unWireEventsAndBindings();
        this.documentHelper.updateFocus();
    }
    /**
     * @param {SelectEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    private selectHandler = (args: SelectEventArgs): void => {
        (this.textBoxInput as HTMLInputElement).value = args.text;
        let value: any = document.getElementById('toclist');
        value.setSelectionRange(0, (args.text as string).length);
        value.focus();
    }
    /**
     * @private
     * @returns {void}
     */
    private showStyleDialog = (): void => {
        if (!isNullOrUndefined(this.documentHelper.owner.styleDialogModule)) {
            this.documentHelper.owner.styleDialogModule.show((this.textBoxInput as HTMLInputElement).value);
        }
    }
    private changeShowLevelValue(event: any): void {
        let levels: number = event.value as number;
        let values: string[] = [];
        switch (levels) {
            case 1:
                values = ['1', null, null, null, null, null, null, null, null];
                this.changeByValue(values);
                break;
            case 2:
                values = ['1', '2', null, null, null, null, null, null, null];
                this.changeByValue(values);
                break;
            case 3:
                values = ['1', '2', '3', null, null, null, null, null, null];
                this.changeByValue(values);
                break;
            case 4:
                values = ['1', '2', '3', '4', null, null, null, null, null];
                this.changeByValue(values);
                break;
            case 5:
                values = ['1', '2', '3', '4', '5', null, null, null, null];
                this.changeByValue(values);
                break;
            case 6:
                values = ['1', '2', '3', '4', '5', '6', null, null, null];
                this.changeByValue(values);
                break;
            case 7:
                values = ['1', '2', '3', '4', '5', '6', '7', null, null];
                this.changeByValue(values);
                break;
            case 8:
                values = ['1', '2', '3', '4', '5', '6', '7', '8', null];
                this.changeByValue(values);
                break;
            case 9:
                values = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
                this.changeByValue(values);
                break;
        }
    }

    private changeByValue(headings: string[]): void {
        this.heading1.value = headings[0];
        this.heading2.value = headings[1];
        this.heading3.value = headings[2];
        this.heading4.value = headings[3];
        this.heading5.value = headings[4];
        this.heading6.value = headings[5];
        this.heading7.value = headings[6];
        this.heading8.value = headings[7];
        this.heading9.value = headings[8];
    }
    /**
     * @returns {void}
     */
    private reset = (): void => {
        this.showLevel.enabled = true;
        this.showLevel.value = 3;
        this.outline.disabled = false;
        this.outline.checked = true;
        let values: string[] = ['1', '2', '3', null, null, null, null, null, null];
        this.changeByValue(values);
        this.normal.value = null;
    }
    /**
     * @param {KeyboardEvent} args - Specifies the event args.
     * @returns {void}
     */
    private changeStyle = (args: KeyboardEvent): void => {
        let headingValue: string = (args.srcElement as HTMLInputElement).value;
        let value = this.getElementValue(args.srcElement as HTMLInputElement);
        if (headingValue !== value && headingValue !== '') {
            this.showLevel.enabled = false;
        } else {
            this.showLevel.enabled = true;
            this.checkLevel();
        }
    }
    private checkLevel(): void {
        if (this.heading1.value !== '') {
            this.showLevel.value = 1;
        }
        if (this.heading2.value !== '') {
            this.showLevel.value = 2;
        }
        if (this.heading3.value !== '') {
            this.showLevel.value = 3;
        }
        if (this.heading4.value !== '') {
            this.showLevel.value = 4;
        }
        if (this.heading5.value !== '') {
            this.showLevel.value = 5;
        }
        if (this.heading6.value !== '') {
            this.showLevel.value = 6;
        }
        if (this.heading7.value !== '') {
            this.showLevel.value = 7;
        }
        if (this.heading8.value !== '') {
            this.showLevel.value = 8;
        }
        if (this.heading9.value !== '') {
            this.showLevel.value = 9;
        }
    }
    private getElementValue(element: HTMLInputElement): string {
        switch (element) {
            case this.heading1:
                return '1';
            case this.heading2:
                return '2';
            case this.heading3:
                return '3';
            case this.heading4:
                return '4';
            case this.heading5:
                return '5';
            case this.heading6:
                return '6';
            case this.heading7:
                return '7';
            case this.heading8:
                return '8';
            case this.heading9:
                return '9';
            default:
                return '1';
        }
    }
    /**
     * @param {KeyboardEvent} args - Specifies the event args.
     * @returns {void}
     */
    private changeHeadingStyle = (args: KeyboardEvent): void => {
        let headingValue = (args.srcElement as HTMLInputElement).value;
        if (headingValue === '') {
            this.showLevel.enabled = true;
        } else {
            this.showLevel.enabled = false;
        }
        if (this.normal === (args.srcElement as HTMLInputElement)) {
            this.outline.checked = false;
            this.outline.disabled = true;
        }
    }
    /**
     * @param {ChangeEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    public changePageNumberValue = (args: ChangeEventArgs): void => {
        if (args.checked) {
            this.rightAlign.checked = true;
            this.rightAlign.disabled = false;
            this.tabLeader.enabled = true;
        } else {
            this.rightAlign.disabled = true;
            this.tabLeader.enabled = false;
        }
    }
    /**
     * @param {ChangeEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    public changeRightAlignValue = (args: ChangeEventArgs): void => {
        if (args.checked) {
            this.tabLeader.enabled = true;
        } else {
            this.tabLeader.enabled = false;
        }
    }
    /**
     * @param {ChangeEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    public changeStyleValue = (args: ChangeEventArgs): void => {
        if (args.checked) {
            this.heading1.disabled = false;
            this.heading2.disabled = false;
            this.heading3.disabled = false;
            this.heading4.disabled = false;
            this.heading5.disabled = false;
            this.heading6.disabled = false;
            this.heading7.disabled = false;
            this.heading8.disabled = false;
            this.heading9.disabled = false;
            this.normal.disabled = false;
        } else {
            this.heading1.disabled = true;
            this.heading2.disabled = true;
            this.heading3.disabled = true;
            this.heading4.disabled = true;
            this.heading5.disabled = true;
            this.heading6.disabled = true;
            this.heading7.disabled = true;
            this.heading8.disabled = true;
            this.heading9.disabled = true;
            this.normal.disabled = true;
        }
    }
    private getHeadingLevel(index: number): number {
        switch (index) {
            case 1:
                return parseInt(this.heading1.value);
            case 2:
                return parseInt(this.heading2.value);
            case 3:
                return parseInt(this.heading3.value);
            case 4:
                return parseInt(this.heading4.value);
            case 5:
                return parseInt(this.heading5.value);
            case 6:
                return parseInt(this.heading6.value);
            case 7:
                return parseInt(this.heading7.value);
            case 8:
                return parseInt(this.heading8.value);
            case 9:
                return parseInt(this.heading9.value);
            default:
                return 0;
        }

    }
    private applyLevelSetting(tocSettings: TableOfContentsSettings): void {
        tocSettings.levelSettings = {};
        let headingPrefix: string = 'Heading ';
        let newStartLevel: number = 0;
        let newEndLevel: number = 0;
        let isEndLevel: boolean = false;
        for (let i: number = 1; i <= tocSettings.endLevel; i++) {
            let outlineLevel: number = this.getHeadingLevel(i);
            if (i === outlineLevel) {
                if (newStartLevel === 0) {
                    newStartLevel = i;
                    isEndLevel = false;
                }
                if (!isEndLevel) {
                    newEndLevel = i;
                }
            } else {
                isEndLevel = true;
                if (outlineLevel !== 0) {
                    let headingStyle: string = headingPrefix + i.toString();
                    tocSettings.levelSettings[headingStyle] = outlineLevel;
                }
            }
        }
        tocSettings.startLevel = newStartLevel;
        tocSettings.endLevel = newEndLevel;
        if (this.normal.value !== '') {
            tocSettings.levelSettings['Normal'] = +this.normal.value;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public applyTableOfContentProperties = (): void => {
        let tocSettings: TableOfContentsSettings = {
            startLevel: 1,
            endLevel: this.showLevel.value,
            includeHyperlink: this.hyperlink.checked,
            includePageNumber: this.pageNumber.checked,
            rightAlign: this.rightAlign.checked,
            tabLeader: this.tabLeader.value as TabLeader,
            includeOutlineLevels: this.outline.checked
        };
        this.applyLevelSetting(tocSettings);
        this.documentHelper.owner.editorModule.insertTableOfContents(tocSettings);
        this.documentHelper.dialog3.hide();
        this.documentHelper.updateFocus();
    }
    /**
     * @private
     * @returns {void}
     */
    public unWireEventsAndBindings = (): void => {
        this.pageNumber.checked = false;
        this.rightAlign.checked = false;
        this.tabLeader.value = '';
        this.hyperlink.checked = false;
        this.style.checked = false;
        this.outline.checked = false;
        this.normal.value = '';
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.pageNumber) {
            this.pageNumber.destroy();
            this.pageNumber = undefined;
        }
        if (this.rightAlign) {
            this.rightAlign.destroy();
            this.rightAlign = undefined;
        }
        if (this.tabLeader) {
            this.tabLeader.destroy();
            this.tabLeader = undefined;
        }
        if (this.showLevel) {
            this.showLevel.destroy();
            this.showLevel = undefined;
        }
        if (this.hyperlink) {
            this.hyperlink.destroy();
            this.hyperlink = undefined;
        }
        if (this.style) {
            this.style.destroy();
            this.style = undefined;
        }
        if (this.outline) {
            this.outline.destroy();
            this.outline = undefined;
        }
        if (this.listViewInstance) {
            this.listViewInstance.destroy();
            this.listViewInstance = undefined;
        }
        this.heading1 = undefined;
        this.heading2 = undefined;
        this.heading3 = undefined;
        this.heading4 = undefined;
        this.heading5 = undefined;
        this.heading6 = undefined;
        this.heading7 = undefined;
        this.heading8 = undefined;
        this.heading9 = undefined;
        this.normal = undefined;
        this.textBoxInput = undefined;
        this.documentHelper = undefined;
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let count: number = 0; count < this.target.childNodes.length; count++) {
                this.target.removeChild(this.target.childNodes[count]);
                count--;
            }
            this.target = undefined;
        }
    }
}

