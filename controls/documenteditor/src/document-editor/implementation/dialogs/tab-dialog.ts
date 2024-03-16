import { ListView } from '@syncfusion/ej2-lists';
import { Button, RadioButton } from '@syncfusion/ej2-buttons';
import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DocumentHelper, TabStopListInfo } from '../viewer';
import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { HelperMethods } from '../editor/editor-helper';
import { TabJustification, TabLeader } from '../../base/types';
import { WTabStop } from '../format/paragraph-format';

export class TabDialog {
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    private target: HTMLElement;
    private listviewInstance: ListView;
    private textBoxInput: HTMLInputElement;
    private defaultTabStopIn: any;
    private left: RadioButton;
    private right: RadioButton;
    private center: RadioButton;
    private decimal: RadioButton;
    private bar: RadioButton;
    private none: RadioButton;
    private dotted: RadioButton;
    private single: RadioButton;
    private Hyphen: RadioButton;
    private underscore: RadioButton;
    private setButton: Button;
    private clearButton: Button;
    private clearAllButton: Button;
    private selectedTabStop: TabStopListInfo | { [key: string]: Object };
    private isBarClicked: boolean = false;
    private removedItems: TabStopListInfo[] = [];
    private tabStopList: { [key: string]: Object }[] | TabStopListInfo[] = [];
    private isAddUnits: boolean = true;
    private displayDiv: HTMLElement;
    private localeValue: L10n;

    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    private getModuleName(): string {
        return 'TabDialog';
    }

    /**
     * @private
     * @returns {void}
     */
    public applyParagraphFormat = (): void => {
        if (this.defaultTabStopIn.value !== this.documentHelper.defaultTabWidth) {
            this.documentHelper.defaultTabWidth = this.defaultTabStopIn.value;
        }
        if (this.removedItems.length > 0) {
            let values: WTabStop[] = [];
            for (let i = 0; i < this.removedItems.length; i++) {
                values.push(this.removedItems[parseInt(i.toString(), 10)].value as WTabStop);
            }
            this.documentHelper.owner.editorModule.removeTabStops(this.documentHelper.selection.getParagraphsInSelection(), values);
        }
        const tab: WTabStop = !isNullOrUndefined(this.selectedTabStop) ? this.selectedTabStop.value as WTabStop: new WTabStop();
        tab.deletePosition = 0;
        tab.tabJustification = this.getTabAlignmentValue();
        tab.tabLeader = this.getTabLeaderValue();
        const values: WTabStop[] = [];
        for (let i: number = 0; i < this.tabStopList.length; i++) {
            values.push(this.tabStopList[parseInt(i.toString(), 10)].value as WTabStop);
        }
        if (isNullOrUndefined(this.selectedTabStop)) {
            let value: number = HelperMethods.getNumberFromString(this.textBoxInput.value);
            if (value.toString() !== 'NaN') {
                tab.position = value;
                values.push(tab);
            }
        }
        this.documentHelper.owner.editorModule.onApplyParagraphFormat('tabStop', values, false, false);
        this.closeTabDialog();
    }
    private textBoxInputChange = (args: any) => {
        let value: number = HelperMethods.getNumberFromString(this.textBoxInput.value);
        for (let i: number = 0; i < this.tabStopList.length; i++) {
            let tabValue: number = HelperMethods.getNumberFromString(this.tabStopList[parseInt(i.toString(), 10)].displayText as string);
            if (tabValue === value) {
                this.selectedTabStop = this.tabStopList[parseInt(i.toString(), 10)];
                break;
            } else {
                this.selectedTabStop = undefined;
            }
        }
        this.isAddUnits = false;
        const index: number = (this.listviewInstance.dataSource as { [key: string]: Object }[]).indexOf(this.selectedTabStop as { [key: string]: Object });
        const item: { [key: string]: Object } = index >= 0? this.listviewInstance.dataSource[parseInt(index.toString(), 10)]: undefined;
        this.listviewInstance.selectItem(item);
        this.isAddUnits = true;
    }

    private setButtonClick = (args: any): void => {
        if (!isNullOrUndefined(this.selectedTabStop)) {
            let value: WTabStop = this.selectedTabStop.value as WTabStop;
            value.tabJustification = this.getTabAlignmentValue();
            value.tabLeader = this.getTabLeaderValue();
        } else {
            let value: number = parseFloat(HelperMethods.getNumberFromString(this.textBoxInput.value).toFixed(2));
            if (value.toString() === 'NaN') {
                return;
            }
            let tabStop: WTabStop = new WTabStop();
            tabStop.position = value;
            tabStop.tabJustification = this.getTabAlignmentValue();
            tabStop.tabLeader = this.getTabLeaderValue();
            tabStop.deletePosition = 0;
            let tempCollection: WTabStop[] = [];
            for (let i = 0; i < this.tabStopList.length; i++) {
                tempCollection.push(this.tabStopList[parseInt(i.toString(), 10)].value as WTabStop);
            }
            let index: number = this.documentHelper.owner.editorModule.addTabStopToCollection(tempCollection, tabStop, true);
            let tabStopListObj: TabStopListInfo = { 'displayText': parseFloat(value.toFixed(2)) + ' pt', 'value': tabStop};
            this.tabStopList.splice(index, 0, tabStopListObj);
            this.selectedTabStop = tabStopListObj;
            this.listviewInstance.dataSource = this.tabStopList as { [key: string]: Object }[];
            this.listviewInstance.refresh();
            this.listviewInstance.selectItem(this.selectedTabStop as any);
        }
    }

    private clearAllButtonClick = (args: any) => {
        for (let i = 0; i < this.tabStopList.length; i++) {
            this.removedItems.push(this.tabStopList[parseInt(i.toString(), 10)] as TabStopListInfo);
        }
        this.displayDiv.innerText = this.localeValue.getConstant('All');
        this.tabStopList = [];
        this.listviewInstance.dataSource = [];
        this.listviewInstance.refresh();
        this.selectedTabStop = undefined;
        this.textBoxInput.value = '';
        this.updateButtons();
    }

    private clearButtonClick = (args: any) => {
        this.removedItems.push(this.selectedTabStop as TabStopListInfo);
        if (this.displayDiv.innerText !== this.localeValue.getConstant('All')) {
            if (this.displayDiv.innerText !== '') {
                this.displayDiv.innerText += ', ';
            }
            this.displayDiv.innerText += (this.selectedTabStop as TabStopListInfo).displayText;
        }
        let index: number = (this.tabStopList as TabStopListInfo[]).indexOf(this.selectedTabStop as TabStopListInfo);
        
        if (index === this.tabStopList.length - 1) {
            this.tabStopList.splice(index, 1);
            this.selectedTabStop = this.tabStopList[index - 1];
        } else if (this.tabStopList.length === 0) {
            this.selectedTabStop = undefined;
        } else {
            this.tabStopList.splice(index, 1);
            this.selectedTabStop = this.tabStopList[parseInt(index.toString(), 10)];
        }
        this.listviewInstance.refresh();
        if (!isNullOrUndefined(this.selectedTabStop)) {
            this.textBoxInput.value = !isNullOrUndefined(this.selectedTabStop) && this.tabStopList.length > 0 ? (this.selectedTabStop.displayText as string) : '';
        } else {
            this.textBoxInput.value = '';
        }
        this.updateButtons();
    }

    /**
     * @private
     * @returns {void}
     */
    public closeTabDialog = (): void => {
        this.documentHelper.hideDialog();
    };

    /* eslint-disable */
    /**
     * @private
     * @param {L10n} locale - Specifies the locale.
     * @param {boolean} enableRtl - Specifies is rtl.
     * @returns {void}
     */
    public initTabsDialog(localeValue: L10n, enableRtl: boolean) {
        let ownerId: string = this.documentHelper.owner.containerId;
        this.target = createElement('div', { id: ownerId + '_tab', className: 'e-de-tab' });

        const commonDiv: HTMLElement = createElement('div', { className: 'e-de-container-row' });
        this.target.appendChild(commonDiv);

        const tabStopLabelDiv: HTMLElement = createElement('div', { innerHTML: localeValue.getConstant('Tab stop position') + ':', className: 'e-de-para-dlg-heading' });

        const tabStopDiv: HTMLElement = createElement('div', { className: 'e-de-subcontainer-left' });
        tabStopDiv.appendChild(tabStopLabelDiv);
        const tabListDiv: HTMLElement = createElement('div', { className: 'e-tab-list' });
        tabStopDiv.appendChild(tabListDiv);
        if (enableRtl) {
            tabListDiv.classList.add('e-de-rtl');
        }
        const textBoxDiv: HTMLElement = createElement('div', { className: 'e-bookmark-textboxdiv' });
        tabListDiv.appendChild(textBoxDiv);

        this.textBoxInput = createElement('input', { className: 'e-input e-tab-textbox-input', attrs: { autofocus: 'true' } }) as HTMLInputElement;
        this.textBoxInput.setAttribute('type', 'text');
        this.textBoxInput.setAttribute('aria-label', localeValue.getConstant('Tab stop position'));
        textBoxDiv.appendChild(this.textBoxInput);
        textBoxDiv.addEventListener('keyup', this.textBoxInputChange);
        this.textBoxInput.value = !isNullOrUndefined(this.tabStopList) && this.tabStopList.length > 0 ? this.tabStopList[0].displayText as string : '';

        const listviewDiv: HTMLElement = createElement('div', { className: 'e-tab-listViewDiv', attrs: { tabindex: '-1' } });
        listviewDiv.setAttribute('aria-label', localeValue.getConstant('TabMarkList'));
        tabListDiv.appendChild(listviewDiv);

        this.listviewInstance = new ListView({
            dataSource: this.tabStopList as { [key: string]: Object }[],
            fields: { text: 'displayText' },
            cssClass: 'e-bookmark-listview'
        });
        this.listviewInstance.appendTo(listviewDiv);
        this.listviewInstance.addEventListener('select', this.selectHandler);

        commonDiv.appendChild(tabStopDiv);

        const defaultTablabelDiv: HTMLElement = createElement('div', { innerHTML: localeValue.getConstant('Default tab stops') + ':', className: 'e-de-para-dlg-heading' });

        const defaultTabDiv: HTMLElement = createElement('div', { className: 'e-de-subcontainer-right' });
        
        commonDiv.appendChild(defaultTabDiv);
        const defaultTabStopDiv: HTMLElement = createElement('div', { className: 'e-de-dlg-container' });
        let defaultTabStop: HTMLInputElement = createElement('input', { attrs: { 'type': 'text' } }) as HTMLInputElement;
        defaultTabStopDiv.appendChild(defaultTablabelDiv);
        defaultTabStopDiv.appendChild(defaultTabStop);
        defaultTabDiv.appendChild(defaultTabStopDiv);

        this.defaultTabStopIn = new NumericTextBox({
            format: '# pt', value: this.documentHelper.defaultTabWidth, min: 0, max: 1584, step: 1, enablePersistence: false, placeholder: localeValue.getConstant('Default tab stops'),
            //change: this.changeDefaultTabStop,
            //focus: this.focusDefaultTabStop,
            //blur: this.blurDefaultTabStop,
        });
        this.defaultTabStopIn.appendTo(defaultTabStop);

        const defaultTabWarningDiv: HTMLElement = createElement('div', { innerHTML: localeValue.getConstant('Tab stops to be cleared') + ':', className: 'e-de-dlg-container' });
        defaultTabDiv.appendChild(defaultTabWarningDiv);

        this.displayDiv = createElement('div', { className: 'e-defaultTablabelDiv' });
        if (this.documentHelper.owner.enableRtl) {
            this.displayDiv.style.marginRight = '20px';
        } else {
            this.displayDiv.style.marginLeft = '20px';
        }
        defaultTabDiv.appendChild(this.displayDiv);

        const alignmentDiv: HTMLElement = createElement('div', { className: 'e-de-dlg-container' });
        this.target.appendChild(alignmentDiv);
        const alignmentLabelDiv: HTMLElement = createElement('div', { innerHTML: localeValue.getConstant('Alignment') + ':', className: 'e-de-para-dlg-heading' });
        alignmentDiv.appendChild(alignmentLabelDiv);

        const alignmentPropertyDiv: HTMLElement = createElement('div', { styles: 'display: flex;' });
        alignmentDiv.appendChild(alignmentPropertyDiv);
        const alignmentPropertyDiv1: HTMLElement = createElement('div', { styles: 'display: flex; flex-direction: column; width: 33.33%' });
        const leftDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const leftRadioBtn: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }
        });
        const decimalDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const decimalRadioBtn: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }
        });


        leftDiv.appendChild(leftRadioBtn);
        decimalDiv.appendChild(decimalRadioBtn);
        alignmentPropertyDiv1.appendChild(leftDiv);
        alignmentPropertyDiv1.appendChild(decimalDiv);

        alignmentPropertyDiv.appendChild(alignmentPropertyDiv1);

        this.left = new RadioButton({ label: localeValue.getConstant('Left'), name: 'alignment', value: 'left', cssClass: 'e-small', checked: true, enableRtl: enableRtl, change: this.onTabAlignmentButtonClick });
        this.decimal = new RadioButton({ label: localeValue.getConstant('Decimal'), name: 'alignment', value: 'decimal', cssClass: 'e-small', enableRtl: enableRtl, change: this.onTabAlignmentButtonClick });

        this.left.appendTo(leftRadioBtn);
        this.decimal.appendTo(decimalRadioBtn);

        leftRadioBtn.setAttribute('aria-label', localeValue.getConstant('Left'));
        decimalRadioBtn.setAttribute('aria-label', localeValue.getConstant('Decimal'));

        const alignmentPropertyDiv2: HTMLElement = createElement('div', { styles: 'display: flex; flex-direction: column; width: 33.33%' });
        const centerDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const centerRadioBtn: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }
        });
        const barDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const barRadioBtn: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }
        });

        barDiv.appendChild(barRadioBtn);
        centerDiv.appendChild(centerRadioBtn);
        alignmentPropertyDiv2.appendChild(centerDiv);
        alignmentPropertyDiv2.appendChild(barDiv);

        this.bar = new RadioButton({ label: localeValue.getConstant('Bar'), name: 'alignment', value: 'bar', cssClass: 'e-small', enableRtl: enableRtl, change: this.onBarClick });
        this.center = new RadioButton({ label: localeValue.getConstant('Center'), name: 'alignment', value: 'center', cssClass: 'e-small', enableRtl: enableRtl, change: this.onTabAlignmentButtonClick });
        this.bar.appendTo(barRadioBtn);
        this.center.appendTo(centerRadioBtn);

        barRadioBtn.setAttribute('aria-label', localeValue.getConstant('Bar'));
        centerRadioBtn.setAttribute('aria-label', localeValue.getConstant('Center'));
        alignmentPropertyDiv.appendChild(alignmentPropertyDiv2);

        const alignmentPropertyDiv3: HTMLElement = createElement('div', { styles: 'display: flex; flex-direction: column;width: 33.33%' });
        const rightDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const rightRadioBtn: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }
        });
        rightDiv.appendChild(rightRadioBtn);
        alignmentPropertyDiv3.appendChild(rightDiv);
        this.right = new RadioButton({ label: localeValue.getConstant('Right'), name: 'alignment', value: 'right', cssClass: 'e-small', enableRtl: enableRtl, change: this.onTabAlignmentButtonClick });
        this.right.appendTo(rightRadioBtn);
        rightRadioBtn.setAttribute('aria-label', localeValue.getConstant('Right'));

        alignmentPropertyDiv.appendChild(alignmentPropertyDiv3);

        const tabLeaderDiv: HTMLElement = createElement('div', { className: 'e-de-dlg-container' });

        const tabLeaderLabelDiv: HTMLElement = createElement('div', { innerHTML: localeValue.getConstant('Leader') + ':', className: 'e-de-para-dlg-heading' });
        tabLeaderDiv.appendChild(tabLeaderLabelDiv);
        this.target.appendChild(tabLeaderDiv);

        const tabLeaderPropertyDiv: HTMLElement = createElement('div', { styles: 'display: flex;' });
        tabLeaderDiv.appendChild(tabLeaderPropertyDiv);

        const tabLeaderPropertyDiv1: HTMLElement = createElement('div', { styles: 'display: flex; flex-direction: column; width: 33.33%' });

        const noneDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const noneRadioBtn: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }
        });
        const underscoreDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const underscoreRadioBtn: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }
        });
        noneDiv.appendChild(noneRadioBtn);
        underscoreDiv.appendChild(underscoreRadioBtn);
        tabLeaderPropertyDiv1.appendChild(noneDiv);
        tabLeaderPropertyDiv1.appendChild(underscoreDiv);

        this.none = new RadioButton({ label: '1 ' + localeValue.getConstant('None'), name: 'tabLeader', value: 'none', cssClass: 'e-small', checked: true, enableRtl: enableRtl });
        this.underscore = new RadioButton({ label: '4 _____', name: 'tabLeader', value: 'underscore', cssClass: 'e-small', enableRtl: enableRtl });

        this.none.appendTo(noneRadioBtn);
        this.underscore.appendTo(underscoreRadioBtn);

        tabLeaderPropertyDiv.appendChild(tabLeaderPropertyDiv1);

        const tabLeaderPropertyDiv2: HTMLElement = createElement('div', { styles: 'display: flex; flex-direction: column; width: 33.33%' });

        const dottedDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const dottedRadioBtn: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }
        });
        const singleDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const singleRadioBtn: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }
        });

        dottedDiv.appendChild(dottedRadioBtn);
        singleDiv.appendChild(singleRadioBtn);
        this.dotted = new RadioButton({ label: '2 .......', name: 'tabLeader', value: 'dotted', cssClass: 'e-small', enableRtl: enableRtl });
        this.single = new RadioButton({ label: '5 -------', name: 'tabLeader', value: 'single', cssClass: 'e-small', enableRtl: enableRtl });
        this.dotted.appendTo(dottedRadioBtn);
        this.single.appendTo(singleRadioBtn);

        tabLeaderPropertyDiv2.appendChild(dottedDiv);
        tabLeaderPropertyDiv2.appendChild(singleDiv);
        tabLeaderPropertyDiv.appendChild(tabLeaderPropertyDiv2);

        const tabLeaderPropertyDiv3: HTMLElement = createElement('div', { styles: 'display: flex; flex-direction: column; width: 33.33%' });

        const HyphenDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        const HyphenRadioBtn: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'radiobutton' }
        });

        HyphenDiv.appendChild(HyphenRadioBtn);
        tabLeaderPropertyDiv3.appendChild(HyphenDiv);
        this.Hyphen = new RadioButton({ label: '3 -------', name: 'tabLeader', value: 'hyphen', cssClass: 'e-small', enableRtl: enableRtl });
        this.Hyphen.appendTo(HyphenRadioBtn);

        tabLeaderPropertyDiv.appendChild(tabLeaderPropertyDiv3);

        const buttonDiv: HTMLElement = createElement('div', { className: 'e-de-tab-button', styles: 'display: flex;' });
        this.target.appendChild(buttonDiv);
        let tableElement: HTMLTableElement = createElement('table') as HTMLTableElement;
        buttonDiv.appendChild(tableElement);
        tableElement.style.width = '100%';
        let row: HTMLTableRowElement = tableElement.insertRow();
        let cell: HTMLTableCellElement = row.insertCell();
        const setbuttonDiv: HTMLElement = createElement('div', { className: 'e-de-tab-setBtn' });
        buttonDiv.appendChild(setbuttonDiv);
        const setButtonElement: HTMLElement = createElement('button', {
            innerHTML: localeValue.getConstant('Set'),
            attrs: { type: 'button' }
        });
        setButtonElement.setAttribute('aria-label', localeValue.getConstant('Set'));
        setbuttonDiv.appendChild(setButtonElement);
        this.setButton = new Button({ cssClass: 'e-button-custom' });
        this.setButton.appendTo(setButtonElement);
        cell.appendChild(setbuttonDiv);
        setButtonElement.addEventListener('click', this.setButtonClick);
        
        //setButtonElement.addEventListener('click', this.setTabStop);

        cell.style.width = '33.33%';
        cell.style.display = 'table-cell';
        cell = row.insertCell();
        const clearbuttonDiv: HTMLElement = createElement('div', { className: 'e-de-tab-clearBtn' });
        buttonDiv.appendChild(clearbuttonDiv);
        const clearButtonElement: HTMLElement = createElement('button', {
            innerHTML: localeValue.getConstant('Clear'),
            attrs: { type: 'button' }
        });
        clearButtonElement.setAttribute('aria-label', localeValue.getConstant('Clear'));
        clearbuttonDiv.appendChild(clearButtonElement);
        this.clearButton = new Button({ cssClass: 'e-button-custom' });
        this.clearButton.appendTo(clearButtonElement);
        clearButtonElement.addEventListener('click', this.clearButtonClick);

        //clearButtonElement.addEventListener('click', this.clearTabStop);
        cell.appendChild(clearbuttonDiv);

        cell.style.width = '33.33%';
        cell.style.display = 'table-cell';
        cell = row.insertCell();
        const clearAllbuttonDiv: HTMLElement = createElement('div', { className: 'e-de-tab-clearAllBtn' });
        buttonDiv.appendChild(clearAllbuttonDiv);
        const clearAllButtonElement: HTMLElement = createElement('button', {
            innerHTML: localeValue.getConstant('Clear All'),
            attrs: { type: 'button' }
        });
        clearAllButtonElement.setAttribute('aria-label', localeValue.getConstant('Clear All'));
        clearAllbuttonDiv.appendChild(clearAllButtonElement);
        this.clearAllButton = new Button({ cssClass: 'e-button-custom' });
        this.clearAllButton.appendTo(clearAllButtonElement);
        clearAllButtonElement.addEventListener('click', this.clearAllButtonClick);

        //clearButtonElement.addEventListener('click', this.clearTabStop);
        cell.appendChild(clearAllbuttonDiv);
        cell.style.width = '33.33%';
        cell.style.display = 'table-cell';

        this.selectedTabStop = !isNullOrUndefined(this.tabStopList) && this.tabStopList.length > 0 ? this.tabStopList[0] as TabStopListInfo : undefined;
        this.updateButtons();
    }

    private getTabAlignmentValue(): TabJustification {
        if (this.left.checked) {
            return 'Left';
        } else if (this.center.checked) {
            return 'Center';
        } else if (this.right.checked) {
            return 'Right';
        } else if (this.decimal.checked) {
            return 'Decimal';
        } else if (this.bar.checked) {
            return 'Bar';
        }
        return 'Left';
    }
    private getTabLeaderValue(): TabLeader {
        if (this.none.checked) {
            return 'None';
        } else if (this.dotted.checked) {
            return 'Dot';
        } else if (this.Hyphen.checked) {
            return 'Hyphen';
        } else if (this.underscore.checked) {
            return 'Underscore';
        } else if (this.single.checked) {
            return 'Single';
        }
        return 'None';
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private selectHandler = (args: any): void => {
        if (this.isAddUnits) {
            this.focusTextBox(args.text);
        }
        this.selectedTabStop = args.data;
        if (!isNullOrUndefined(this.selectedTabStop) && (this.selectedTabStop.value as WTabStop).tabJustification === 'Bar') {
            this.isBarClicked = true;
        }
        this.updateButtons();
    };
    private updateButtons(): void {
        if (!isNullOrUndefined(this.selectedTabStop)) {
            this.updateTabAlignmentButton((this.selectedTabStop.value as WTabStop).tabJustification);
            this.updateTabLeaderButton((this.selectedTabStop.value as WTabStop).tabLeader);
        } else {
            this.updateTabAlignmentButton('Left');
            this.updateTabLeaderButton('None');
        }
    }
    private onBarClick = (args: any): void => {
        this.clearTabLeaderButton();
        this.disableOrEnableTabLeaderButton(true);
        this.isBarClicked = true;
    }
    private onTabAlignmentButtonClick = (args: any): void => {
        this.disableOrEnableTabLeaderButton(false);
        if (this.isBarClicked) {
            this.updateTabLeaderButton('None');
            this.isBarClicked = false;
        }
    }
    private updateTabLeaderButton(value: TabLeader): void {
        this.clearTabLeaderButton();
        if (this.getTabAlignmentValue() === 'Bar') {
            return;
        }
        switch (value) {
            case 'None':
                this.none.checked = true;
                break;
            case 'Single':
                this.single.checked = true;
                break;
            case 'Dot':
                this.dotted.checked = true;
                break;
            case 'Hyphen':
                this.Hyphen.checked = true;
                break;
            case 'Underscore':
                this.underscore.checked = true;
                break;
            default:
                this.none.checked = true;
                break;
        }
    }
    private updateTabAlignmentButton(value: TabJustification): void {
        this.clearTabAlignmentButton();
        switch (value) {
            case 'Left':
                this.left.checked = true;
                break;
            case 'Center':
                this.center.checked = true;
                break;
            case 'Right':
                this.right.checked = true;
                break;
            case 'Decimal':
                this.decimal.checked = true;
                break;
            case 'Bar':
                this.bar.checked = true;
                this.clearTabLeaderButton();
                this.disableOrEnableTabLeaderButton(true);
                return;
            default:
                break;
        }
        this.disableOrEnableTabLeaderButton(false);
    }
    private clearTabLeaderButton(): void {
        this.none.checked = false;
        this.single.checked = false;
        this.dotted.checked = false;
        this.Hyphen.checked = false;
        this.underscore.checked = false;
    }
    private disableOrEnableTabLeaderButton(isDisable: boolean): void {
        this.none.disabled = isDisable;
        this.single.disabled = isDisable;
        this.dotted.disabled = isDisable;
        this.Hyphen.disabled = isDisable;
        this.underscore.disabled = isDisable;
    }
    private clearTabAlignmentButton(): void {
        this.left.checked = false;
        this.center.checked = false;
        this.right.checked = false;
        this.decimal.checked = false;
        this.bar.checked = false;
    }
    private focusTextBox(text: string): void {
        (this.textBoxInput as HTMLInputElement).value = text;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const value: any = this.textBoxInput;
        value.setSelectionRange(0, (text as string).length);
        value.focus();
    }

    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        const localObj: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localObj.setLocale(this.documentHelper.owner.locale);
        this.localeValue = localObj;
        let tabs: WTabStop[] = this.documentHelper.owner.editorModule.getTabsInSelection();
        this.tabStopList = [];
        for (let i = 0; i < tabs.length; i++) {
            let value: string = parseFloat((tabs[i].position).toFixed(2)) + ' pt';
            let objectValue = { 'displayText': value, 'value': tabs[i].clone() };
            this.tabStopList.push(objectValue);
        }
        this.initTabsDialog(localObj, this.documentHelper.owner.enableRtl);
        this.documentHelper.dialog.header = localObj.getConstant('Tabs');
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = this.documentHelper.updateFocus;
        this.documentHelper.dialog.close = this.documentHelper.updateFocus;
        this.documentHelper.dialog.buttons = [{
            click: this.applyParagraphFormat,
            buttonModel: { content: localObj.getConstant('Ok'), cssClass: 'e-flat e-para-okay', isPrimary: true }
        },
        {
            click: this.closeTabDialog,
            buttonModel: { content: localObj.getConstant('Cancel'), cssClass: 'e-flat e-para-cancel' }
        }
        ];
        this.documentHelper.dialog.show();
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.target = undefined;
        this.textBoxInput = undefined;
        this.defaultTabStopIn = undefined;
        this.left = undefined;
        this.right = undefined;
        this.center = undefined;
        this.decimal = undefined;
        this.bar = undefined;
        this.none = undefined;
        this.dotted = undefined;
        this.single = undefined;
        this.Hyphen = undefined;
        this.setButton = undefined;
        this.clearButton = undefined;
        this.clearAllButton = undefined;
        if (this.listviewInstance) {
            this.listviewInstance.destroy();
            this.listviewInstance = undefined;
        }
        this.selectedTabStop = undefined;
        this.isBarClicked = undefined;
        this.removedItems = undefined;
        this.tabStopList = undefined;
        this.localeValue = undefined;
    }


}