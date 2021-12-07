import { Dialog } from '@syncfusion/ej2-popups';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { LayoutViewer } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

import { WCharacterFormat, WParagraphFormat } from '../format/index';
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { WLevelOverride } from '../list/level-override';
import { FollowCharacterType, ListLevelPattern } from '../../base/index';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { Tooltip } from '@syncfusion/ej2-popups';
import { ListViewModel } from './list-view-model';
import { DocumentHelper } from '../viewer';
/**
 * The List dialog is used to create or modify lists.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export class ListDialog {
    /**
     * @private
     */
    public dialog: Dialog = undefined;
    private target: HTMLElement = undefined;
    /**
     * @private
     */
    public documentHelper: DocumentHelper = undefined;
    private viewModel: ListViewModel = undefined;
    private startAt: NumericTextBox = undefined;
    private textIndent: NumericTextBox = undefined;
    private alignedAt: NumericTextBox = undefined;
    private listLevelElement: DropDownList = undefined;
    private followNumberWith: DropDownList = undefined;
    private numberStyle: DropDownList = undefined;
    private numberFormat: HTMLInputElement = undefined;
    private restartBy: DropDownList = undefined;
    private formatInfoToolTip: Tooltip;
    private numberFormatDiv: HTMLElement;
    /**
     * @private
     */
    public isListCharacterFormat: boolean = false;

    /**
     * @private
     * @returns {WListLevel} Returns list level
     */
    public get listLevel(): WListLevel {
        if (!isNullOrUndefined(this.viewModel)) {
            return this.viewModel.listLevel;
        }
        return undefined;
    }

    /**
     * @private
     * @returns {WList} Returns list
     */
    public get list(): WList {
        if (!isNullOrUndefined(this.viewModel)) {
            return this.viewModel.list;
        }
        return undefined;
    }

    /**
     * @private
     * @returns {number} Returns level number
     */
    public get levelNumber(): number {
        if (this.listLevel.ownerBase instanceof WLevelOverride) {
            return (this.listLevel.ownerBase as WLevelOverride).levelNumber;
        /* eslint-disable-next-line max-len */
        } else if (this.listLevel.ownerBase instanceof WAbstractList && !isNullOrUndefined((this.listLevel.ownerBase as WAbstractList).levels)) {
            return (this.listLevel.ownerBase as WAbstractList).levels.indexOf(this.listLevel);
        } else {
            return -1;
        }
    }
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
        this.viewModel = new ListViewModel();
    }
    private get owner(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }

    /**
     * @private
     * @returns {string} Returns module name
     */
    public getModuleName(): string {
        return 'ListDialog';
    }
    /**
     * @private
     * @returns {void}
     */
    public showListDialog(): void {
        const locale: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        locale.setLocale(this.documentHelper.owner.locale);

        if (!this.target) {
            this.initListDialog(locale, this.documentHelper.owner.enableRtl);
        }
        this.isListCharacterFormat = true;
        this.documentHelper.dialog2.header = locale.getConstant('Define new Multilevel list');
        this.documentHelper.dialog2.height = 'auto';
        this.documentHelper.dialog2.width = 'auto';
        this.documentHelper.dialog2.content = this.target;
        let buttonClass: string;
        const isRtl: boolean = this.documentHelper.owner.enableRtl;
        if (isRtl) {
            buttonClass = 'e-flat e-list-dlg-font e-de-dlg-target.e-de-rtl e-font-rtl';
        } else {
            buttonClass = 'e-flat e-list-dlg-font e-font';
        }
        this.documentHelper.dialog2.buttons = [{
            click: this.showFontDialog,
            buttonModel: { content: locale.getConstant('Font'), cssClass: buttonClass }
        }, {
            click: this.onApplyList,
            buttonModel: { content: locale.getConstant('Ok'), cssClass: 'e-flat e-list-dlg', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: locale.getConstant('Cancel'), cssClass: 'e-flat e-list-dlg' }
        }];
        this.documentHelper.dialog2.dataBind();
        this.wireAndBindEvent(locale, isRtl);
        this.documentHelper.dialog2.beforeOpen = this.loadListDialog;
        this.documentHelper.dialog2.close = this.closeListDialog;
        this.documentHelper.dialog2.position = { X: 'center', Y: 'top' };
        this.documentHelper.dialog2.show();
    }
    /**
     * Shows the table properties dialog
     *
     * @private
     * @param {L10n} locale - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    public initListDialog(locale: L10n, isRtl?: boolean): void {
        const containerId: string = this.documentHelper.owner.containerId;
        const id: string = containerId + '_insert_list';
        this.target = createElement('div', { id: id, className: 'e-de-list-dlg' });

        const listLevelDiv: HTMLElement = createElement('div', { innerHTML: '<label id="' + containerId + '_listLevellabel" style="display:block;" class=e-de-list-ddl-header-list-level>' + locale.getConstant('List level') + '</label><label id="' + containerId + '_modifyLabel" style="display:block;" class=e-de-list-ddl-subheader>' + locale.getConstant('Choose level to modify') + '</label><select style="height:20px;width:43%" id="' + containerId + '_listLevel"><option>' + locale.getConstant('Level') + ' 1' + '</option><option>' + locale.getConstant('Level') + ' 2' + '</option><option>' + locale.getConstant('Level') + ' 3' + '</option><option>' + locale.getConstant('Level') + ' 4' + '</option><option>' + locale.getConstant('Level') + ' 5' + '</option><option>' + locale.getConstant('Level') + ' 6' + '</option><option>' + locale.getConstant('Level') + ' 7' + '</option><option>' + locale.getConstant('Level') + ' 8' + '</option><option>' + locale.getConstant('Level') + ' 9' + '</option></select>' });
        this.target.appendChild(listLevelDiv);
        const div: HTMLElement = createElement('div');
        let divStyle: string;
        if (isRtl) {
            divStyle = '<div style="float:right;display:block;width:241px;">';
        } else {
            divStyle = '<div style="float:left;display:block;">';
        }

        const numberStyleDiv: HTMLElement = createElement('div', { innerHTML: divStyle + '<label id="' + containerId + '_numberFormatLabel" style="display:block;" class=e-de-list-ddl-header>' + locale.getConstant('Number format') + '</label><label id="' + containerId + '_numberStyleLabel" style="display:block;" class=e-de-list-ddl-subheader>' + locale.getConstant('Number style for this level') + '</label><select style="height:20px;width:100%" id="' + containerId + '_numberStyle"><option>' + locale.getConstant('Arabic') + '</option><option>' + locale.getConstant('UpRoman') + '</option><option>' + locale.getConstant('LowRoman') + '</option><option>' + locale.getConstant('UpLetter') + '</option><option>' + locale.getConstant('LowLetter') + '</option><option>' + locale.getConstant('Number') + '</option><option>' + locale.getConstant('Leading zero') + '</option><option>' + locale.getConstant('Bullet') + '</option><option>' + locale.getConstant('Ordinal') + '</option><option>' + locale.getConstant('Ordinal Text') + '</option><option>' + locale.getConstant('Special') + '</option><option>' + locale.getConstant('For East') + '</option></select><label id="' + containerId + '_startAtLabel" style="display:block;" class=e-de-list-ddl-subheaderbottom>' + locale.getConstant('Start at') + '</label><input type="text" id="' + containerId + '_startAt">' });
        div.appendChild(numberStyleDiv);

        this.numberFormatDiv = createElement('div', { className: 'e-de-list-dlg-subdiv', innerHTML: '<div><div><label id="' + containerId + '_formatLabel" style="display:inline-block;width:86%" class=e-de-list-ddl-subheader>' + locale.getConstant('Enter formatting for number') + '</label><button type="button" id="' + containerId + '_list_info" class="e-control e-btn e-primary e-de-list-format-info">i</button></div><input style=width:180px; type="text" id="' + containerId + '_numberFormat" class=e-input></div><label id="' + containerId + '_restartLabel" style="display:block;" class=e-de-list-ddl-subheaderbottom>' + locale.getConstant('Restart list after') + '</label><select style="height:20px;width:100%" id="' + containerId + '_restartBy"><option>' + locale.getConstant('No Restart') + '</option></select></div>' });
        div.appendChild(this.numberFormatDiv);
        this.target.appendChild(div);
        let indentsDivLabelStyle: string;
        if (isRtl) {
            indentsDivLabelStyle = 'display:block;position:relative; ';
        } else {
            indentsDivLabelStyle = 'display:block; ';
        }

        const indentsDiv: HTMLElement = createElement('div', { innerHTML: divStyle + '<label id="' + containerId + '_IndentsLabel" style=' + indentsDivLabelStyle + 'class=e-de-list-ddl-header>' + locale.getConstant('Position') + '</label><label id="' + containerId + '_textIndentLabel" style=' + indentsDivLabelStyle + 'class=e-de-list-ddl-subheader>' + locale.getConstant('Text indent at') + '</label><input type="text" id="' + containerId + '_textIndent"><label id="' + containerId + '_followCharacterLabel" style=' + indentsDivLabelStyle + 'class=e-de-list-ddl-subheaderbottom>' + locale.getConstant('Follow number with') + '</label><select style="height:20px;width:100%" id="' + containerId + '_followCharacter"><option>' + locale.getConstant('Tab character') + '</option><option>' + locale.getConstant('Space') + '</option><option>' + locale.getConstant('Nothing') + '</option></select></div><div id="e-de-list-dlg-div" class="e-de-list-dlg-div"><label id="' + containerId + '_alignedAtLabel" style="display:block;" class=e-de-list-ddl-subheader>' + locale.getConstant('Aligned at') + '</label><input type="text" id="' + containerId + '_alignedAt"></div>' });
        this.target.appendChild(indentsDiv);

    }
    private wireAndBindEvent(locale: L10n, isRtl: boolean): void {
        const containerId: string = this.documentHelper.owner.containerId;
        if (isRtl) {
            document.getElementById('e-de-list-dlg-div').classList.add('e-de-rtl');
            this.numberFormatDiv.classList.add('e-de-rtl');
        }
        const startAtTextBox: HTMLInputElement = document.getElementById(containerId + '_startAt') as HTMLInputElement;
        const textIndentAtTextBox: HTMLInputElement = document.getElementById(containerId + '_textIndent') as HTMLInputElement;
        const alignedAtTextBox: HTMLInputElement = document.getElementById(containerId + '_alignedAt') as HTMLInputElement;
        this.startAt = new NumericTextBox({
            format: '#',
            decimals: 0,
            min: 0,
            max: 50,
            width: '180px',
            enablePersistence: false
        });
        this.startAt.addEventListener('change', this.onStartValueChanged);
        this.startAt.appendTo(startAtTextBox);
        this.textIndent = new NumericTextBox({
            format: '#',
            decimals: 0,
            min: 0,
            max: 1584,
            width: '180px',
            step: 4,
            enablePersistence: false
        });
        this.textIndent.addEventListener('change', this.onTextIndentChanged);
        this.textIndent.appendTo(textIndentAtTextBox);
        this.alignedAt = new NumericTextBox({
            format: '#',
            max: 1584,
            step: 6,
            width: '180px',
            enablePersistence: false
        });
        this.alignedAt.addEventListener('change', this.onAlignedAtValueChanged);
        this.alignedAt.appendTo(alignedAtTextBox);
        const listLevel: HTMLSelectElement = document.getElementById(containerId + '_listLevel') as HTMLSelectElement;

        this.listLevelElement = new DropDownList({ popupHeight: '150px', width: '180px', enableRtl: isRtl, change: this.onListLevelValueChanged });
        this.listLevelElement.appendTo(listLevel);
        const followCharacterElement: HTMLSelectElement = document.getElementById(containerId + '_followCharacter') as HTMLSelectElement;

        this.followNumberWith = new DropDownList({ popupHeight: '150px', width: '180px', enableRtl: isRtl, change: this.onFollowCharacterValueChanged });
        this.followNumberWith.appendTo(followCharacterElement);
        const numberStyleEle: HTMLSelectElement = document.getElementById(containerId + '_numberStyle') as HTMLSelectElement;

        this.numberStyle = new DropDownList({ popupHeight: '150px', width: '180px', enableRtl: isRtl, change: this.onLevelPatternValueChanged });
        this.numberStyle.appendTo(numberStyleEle);
        this.numberFormat = document.getElementById(containerId + '_numberFormat') as HTMLInputElement;
        this.numberFormat.addEventListener('change', this.onNumberFormatChanged);
        const restartElement: HTMLSelectElement = document.getElementById(containerId + '_restartBy') as HTMLSelectElement;
        this.restartBy = new DropDownList({ popupHeight: '150px', width: '180px', enableRtl: isRtl });
        this.restartBy.appendTo(restartElement);
        const button: HTMLElement = document.getElementById(containerId + '_list_info');
        this.formatInfoToolTip = new Tooltip({ width: 200 });

        this.formatInfoToolTip.content = locale.getConstant('Number format tooltip information');
        this.formatInfoToolTip.position = 'RightTop';
        this.formatInfoToolTip.appendTo(button);
    }
    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies the change event args.
     * @returns {void}
     */
    private onTextIndentChanged = (args: ChangeEventArgs): void => {
        this.viewModel.listLevel.paragraphFormat.leftIndent = args.value as number;
    };
    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies the change event args.
     * @returns {void}
     */
    private onStartValueChanged = (args: ChangeEventArgs): void => {
        if (!isNullOrUndefined(this.viewModel) && !isNullOrUndefined(this.viewModel.listLevel)) {
            this.viewModel.listLevel.startAt = args.value as number;
        }
    };
    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies the change event args.
     * @returns {void}
     */
    private onListLevelValueChanged = (args: ChangeEventArgs): void => {
        this.viewModel.levelNumber = parseInt((args.value as string).slice((args.value as string).length - 1), 10) - 1;
        if (isNullOrUndefined(this.listLevel)) {
            return;
        }
        if (isNullOrUndefined(this.listLevel.characterFormat)) {
            this.listLevel.characterFormat = new WCharacterFormat(this.viewModel.listLevel);
        }
        if (!isNullOrUndefined(this.listLevel.paragraphFormat)) {
            this.listLevel.paragraphFormat = new WParagraphFormat(this.viewModel.listLevel);
        }
        this.updateDialogValues();
        this.updateRestartLevelBox();
    };
    /**
     * @private
     * @param {any} args - Specifies the change event args.
     * @returns {void}
     */
    private onNumberFormatChanged = (args: any): void => {
        this.viewModel.listLevel.numberFormat = args.target.value;
    };
    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies the change event args.
     * @returns {void}
     */
    private onAlignedAtValueChanged = (args: ChangeEventArgs): void => {
        this.viewModel.listLevel.paragraphFormat.firstLineIndent = args.value as number;
    };
    private updateRestartLevelBox(): void {
        const containerId: string = this.documentHelper.owner.containerId;
        const listLevel: HTMLSelectElement = document.getElementById(containerId + '_listLevel') as HTMLSelectElement;
        const restartBy: HTMLSelectElement = document.getElementById(containerId + '_restartBy') as HTMLSelectElement;
        for (let i: number = 0; i < restartBy.options.length; i) {
            restartBy.options.remove(i);
        }
        if (listLevel.selectedIndex === 0) {
            const option: HTMLOptionElement = document.createElement('option') as HTMLOptionElement;
            option.value = 'No Restart';
            option.innerHTML = 'No Restart';
            restartBy.appendChild(option);
        } else {
            for (let i: number = listLevel.selectedIndex; i > 0; i--) {
                const option: HTMLOptionElement = document.createElement('option') as HTMLOptionElement;
                option.value = 'Level ' + i;
                option.innerHTML = 'Level ' + i;
                restartBy.appendChild(option);
            }
            const option: HTMLOptionElement = document.createElement('option') as HTMLOptionElement;
            option.value = 'No Restart';
            option.innerHTML = 'No Restart';
            restartBy.appendChild(option);
        }
        restartBy.selectedIndex = 0;
    }
    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies the change event args.
     * @returns {void}
     */
    private onFollowCharacterValueChanged = (args: ChangeEventArgs): void => {
        if (args.value) {
            this.viewModel.followCharacter = args.value as FollowCharacterType;
        }
    };
    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies the change event args.
     * @returns {void}
     */
    private onLevelPatternValueChanged = (args: ChangeEventArgs): void => {
        this.viewModel.listLevelPattern = args.value as ListLevelPattern;
        const numberFormat: string = '%' + (this.levelNumber + 1).toString();

        const numberFormatTextBox: HTMLInputElement = document.getElementById(this.documentHelper.owner.containerId + '_numberFormat') as HTMLInputElement;

        if (this.listLevel.listLevelPattern === 'Bullet') {
            this.listLevel.numberFormat = '\uf0b7';
            numberFormatTextBox.value = this.listLevel.numberFormat;
            this.listLevel.characterFormat.fontFamily = 'Wingdings';
        } else {
            if (this.listLevel.listLevelPattern === 'None') {
                this.listLevel.numberFormat = '';
            }
            if (!this.listLevel.numberFormat.match(numberFormat) && this.listLevel.listLevelPattern !== 'None') {
                this.listLevel.numberFormat = numberFormat + '.';
            }
            numberFormatTextBox.value = this.listLevel.numberFormat;
        }
    };
    private listPatternConverter(listLevelPattern: ListLevelPattern): number {
        switch (listLevelPattern) {
        case 'Arabic': return 0;
        case 'LowLetter': return 1;
        case 'LowRoman': return 2;
        case 'UpLetter': return 3;
        case 'UpRoman': return 4;
        case 'Number': return 5;
        case 'LeadingZero': return 6;
        case 'Bullet': return 7;
        case 'Ordinal': return 8;
        case 'OrdinalText': return 9;
        case 'Special': return 10;
        case 'FarEast': return 11;
        default: return 12;
        }
    }
    private followCharacterConverter(followCharacter: FollowCharacterType): number {
        switch (followCharacter) {
        case 'Tab':
            return 0;
        case 'Space':
            return 1;
        default:
            return 2;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    private loadListDialog = (): void => {
        this.documentHelper.updateFocus();
        if (isNullOrUndefined(this.documentHelper.owner)) {
            return;
        }
        this.viewModel = new ListViewModel();
        this.viewModel.dialog = this;
        if (this.documentHelper.selection.paragraphFormat.listLevelNumber > 0) {
            this.viewModel.levelNumber = this.documentHelper.selection.paragraphFormat.listLevelNumber;
        }
        this.viewModel.list = this.documentHelper.selection.paragraphFormat.getList();
        if (isNullOrUndefined(this.listLevel)) {
            return;
        }
        if (isNullOrUndefined(this.listLevel.characterFormat)) {
            this.listLevel.characterFormat = new WCharacterFormat(this.viewModel.listLevel);
        }
        if (isNullOrUndefined(this.listLevel.paragraphFormat)) {
            this.listLevel.paragraphFormat = new WParagraphFormat(this.viewModel.listLevel);
        }
        this.updateDialogValues();
        if (this.documentHelper.selection.caret.style.display !== 'none') {
            this.documentHelper.selection.caret.style.display = 'none';
        }
    };
    private updateDialogValues(): void {

        //const restartByTextBox: HTMLSelectElement = document.getElementById(this.documentHelper.owner.containerId + '_restartBy') as HTMLSelectElement;
        if (!isNullOrUndefined(this.viewModel) && !isNullOrUndefined(this.viewModel.listLevel)) {
            this.startAt.value = this.viewModel.listLevel.startAt;
            this.textIndent.value = this.viewModel.listLevel.paragraphFormat.leftIndent;
            this.alignedAt.value = this.viewModel.listLevel.paragraphFormat.firstLineIndent;
            this.followNumberWith.index = this.followCharacterConverter(this.viewModel.followCharacter);
            this.numberFormat.value = this.viewModel.listLevel.numberFormat;
            this.numberStyle.index = this.listPatternConverter(this.viewModel.listLevelPattern);
            this.listLevelElement.index = this.viewModel.levelNumber;
            //this.viewModel.levelNumber = this.viewModel.levelNumber;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    private showFontDialog = (): void => {
        this.documentHelper.owner.fontDialogModule.showFontDialog(this.listLevel.characterFormat);
    };
    /**
     * @private
     * @returns {void}
     */
    private onApplyList = (): void => {
        if (!isNullOrUndefined(this.owner)) {
            this.documentHelper.selection.paragraphFormat.setList(this.list);
        }
        this.documentHelper.dialog2.hide();
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     * @returns {void}
     */
    private onCancelButtonClick = (): void => {
        this.disposeBindingForListUI();
        this.documentHelper.dialog2.hide();
        this.documentHelper.updateFocus();
        this.isListCharacterFormat = false;
    };
    /**
     * @private
     * @returns {void}
     */
    private closeListDialog = (): void => {
        this.disposeBindingForListUI();
        this.documentHelper.updateFocus();
        this.isListCharacterFormat = false;
    };
    private disposeBindingForListUI(): void {
        this.followNumberWith.index = -1;
        this.numberFormat.value = ' ';
        this.numberStyle.index = -1;
        this.listLevelElement.index = -1;
        this.restartBy.index = -1;
        this.viewModel.destroy();
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.alignedAt) {
            this.alignedAt.destroy();
        }
        this.alignedAt = undefined;
        this.dialog = undefined;
        if (this.followNumberWith) {
            this.followNumberWith.destroy();
        }
        this.followNumberWith = undefined;
        if (this.listLevelElement) {
            this.listLevelElement.destroy();
        }
        this.listLevelElement = undefined;
        if (this.textIndent) {
            this.textIndent.destroy();
        }
        this.textIndent = undefined;
        if (this.startAt) {
            this.startAt.destroy();
        }
        this.startAt = undefined;
        if (this.numberStyle) {
            this.numberStyle.destroy();
        }
        this.numberStyle = undefined;
        this.numberFormat = undefined;
        if (this.restartBy) {
            this.restartBy.destroy();
        }
        this.restartBy = undefined;
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let l: number = 0; l < this.target.childNodes.length; l++) {
                this.target.removeChild(this.target.childNodes[l]);
                l--;
            }
            this.target = undefined;
        }
        this.documentHelper = undefined;
        this.viewModel = undefined;
    }

}
/* eslint-enable @typescript-eslint/no-explicit-any */
