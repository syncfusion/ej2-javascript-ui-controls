import { LayoutViewer } from '../index';
import { createElement, isNullOrUndefined, L10n, setCulture } from '@syncfusion/ej2-base';
import { Tab } from '@syncfusion/ej2-navigations';
import { ListLevelPattern } from '../../base/types';
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { WListFormat } from '../../implementation/format/list-format';
/**
 * The Bullets and Numbering dialog is used to apply list format for a paragraph style.
 */
/* tslint:disable:no-any */
export class BulletsAndNumberingDialog {
    private owner: LayoutViewer;
    private target: HTMLElement;
    private isBullet: boolean = false;
    private symbol: string;
    private fontFamily: string;
    private numberFormat: string;
    private listLevelPattern: ListLevelPattern;
    private listFormat: WListFormat;
    private abstractList: WAbstractList;
    /**
     * @private
     */
    constructor(layoutViewer: LayoutViewer) {
        this.owner = layoutViewer;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'BulletsAndNumberingDialog';
    }
    /**
     * @private
     */
    public initNumberingBulletDialog(locale: L10n): void {
        let instance: BulletsAndNumberingDialog = this;
        let id: string = this.owner.owner.containerId;
        this.target = createElement('div', { id: id + '_insertNumberBulletDialog', className: 'e-de-number-bullet-dlg' });
        let tabTarget: HTMLElement = createElement('div', { id: id + '_tabNumberBulletDialog', className: 'e-de-tab-number-bullet-dlg' });
        this.target.appendChild(tabTarget);
        this.createNumberList(id);
        this.createBulletList(id);
        //Initialize Tab component
        let tabObj: Tab = new Tab({
            items: [
                {
                    header: { 'text': locale.getConstant('Numbering') },
                    /* tslint:disable-next-line:max-line-length */
                    content: ('#' + id + '_Number'),

                },
                {
                    header: { 'text': locale.getConstant('Bullets') },
                    /* tslint:disable-next-line:max-line-length */
                    content: ('#' + id + '_Bullet'),
                },
            ],
            heightAdjustMode: 'None',
            width: 272,
        });
        //Render initialized Tab component
        tabObj.appendTo(tabTarget);
        this.owner.owner.element.appendChild(this.target);
        tabObj.refresh();
    }
    private createNumberList(id: string): void {
        let numberListDiv: HTMLElement = createElement('div', { className: 'e-de-style-numbered-list', id: id + '_Number' });
        numberListDiv.style.display = 'none';
        numberListDiv.style.height = '270px';
        let ulTag: HTMLElement = createElement('ul', {
            styles: 'display: block; outline: 0px;',
            id: 'listMenu',
            className: 'e-de-ui-wfloating-menu e-de-ui-bullets-menu e-de-list-container e-de-list-thumbnail'
        });
        numberListDiv.appendChild(ulTag);
        let numberedNone: HTMLElement = this.createNumberNoneListTag(ulTag);
        let numberedNumberDot: HTMLElement = this.createNumberListTag(ulTag, '1.', '2.', '3.', 'e-de-list-numbered-number-dot');
        let numberedNumberBrace: HTMLElement = this.createNumberListTag(ulTag, '1)', '2)', '3)', 'e-de-list-numbered-number-brace');
        let numberedUpRoman: HTMLElement = this.createNumberListTag(ulTag, 'I.', 'II.', 'III.', 'e-de-list-numbered-up-roman');
        let numberedUpLettter: HTMLElement = this.createNumberListTag(ulTag, 'A.', 'B.', 'C.', 'e-de-list-numbered-up-letter');
        let numberedLowLetterDot: HTMLElement = this.createNumberListTag(ulTag, 'a.', 'b.', 'c.', 'e-de-numbered-low-letter-dot');
        let numberedLowLetterBrace: HTMLElement = this.createNumberListTag(ulTag, 'a)', 'b)', 'c)', 'e-de-list-numbered-low-letter-brace');
        let numberedLowRoman: HTMLElement = this.createNumberListTag(ulTag, 'i.', 'ii.', 'iii.', 'e-de-list-numbered-low-roman');
        numberedNone.addEventListener('click', this.numberListClick);
        numberedNumberDot.addEventListener('click', this.numberListClick);
        numberedNumberBrace.addEventListener('click', this.numberListClick);
        numberedUpRoman.addEventListener('click', this.numberListClick);
        numberedUpLettter.addEventListener('click', this.numberListClick);
        numberedLowLetterBrace.addEventListener('click', this.numberListClick);
        numberedLowLetterDot.addEventListener('click', this.numberListClick);
        numberedLowRoman.addEventListener('click', this.numberListClick);
        this.target.appendChild(numberListDiv);
    }

    private createNumberListTag(ulTag: HTMLElement, text1: string, text2: string, text3: string, className: string): HTMLElement {
        let liTag: HTMLElement = createElement('li', {
            styles: 'display:block',
            className: 'e-de-ui-wfloating-menuitem e-de-ui-wfloating-menuitem-md e-de-list-items  e-de-list-item-size ' + className
        });
        ulTag.appendChild(liTag);
        /* tslint:disable-next-line:max-line-length */
        let innerHTML: string = '<div>' + text1 + '<span class="e-de-ui-list-line"></span></div><div>' + text2 + '<span class="e-de-ui-list-line">';
        innerHTML += '</span></div><div>' + text3 + '<span class="e-de-ui-list-line"> </span></div >';
        let liInnerDiv: HTMLElement = createElement('div', {
            className: 'e-de-ui-list-header-presetmenu',
            id: 'e-de-ui-zlist0', innerHTML: innerHTML
        });
        liTag.style.cssFloat = 'left';
        liTag.appendChild(liInnerDiv);
        return liTag;
    }
    private createNumberNoneListTag(ulTag: HTMLElement): HTMLElement {
        let liTag: HTMLElement = createElement('li', {
            styles: 'display:block',
            /* tslint:disable-next-line:max-line-length */
            className: 'e-de-ui-wfloating-menuitem e-de-ui-wfloating-menuitem-md e-de-list-items  e-de-list-item-size e-de-list-numbered-none'
        });
        ulTag.appendChild(liTag);
        let innerHTML: string = '<div class="e-de-ui-bullets e-de-bullet-icons">None</div>';
        let liInnerDiv: HTMLElement = createElement('div', {
            className: 'e-de-ui-list-header-presetmenu',
            id: 'e-de-ui-zlist0', innerHTML: innerHTML
        });
        liTag.style.cssFloat = 'left';
        liTag.appendChild(liInnerDiv);
        return liTag;
    }
    private createBulletListTag(ulTag: HTMLElement, iconCss: string, className: string): HTMLElement {
        let liTag: HTMLElement = createElement('li', {
            styles: 'display:block;',
            className: 'e-de-ui-wfloating-menuitem e-de-ui-wfloating-bullet-menuitem-md e-de-list-items  e-de-list-item-size ' + className
        });
        ulTag.appendChild(liTag);
        /* tslint:disable-next-line:max-line-length */
        let liInnerDiv: HTMLElement = createElement('div', { className: 'e-de-ui-bullet-list-header-presetmenu e-de-bullet-icon-size', id: 'e-de-ui-zlist0' });
        let liNextDiv: HTMLElement = createElement('div', { className: iconCss});
        liInnerDiv.appendChild(liNextDiv);
        liTag.appendChild(liInnerDiv);
        return liTag;
    }
    private createBulletList(id: string): void {
        let bulletListDiv: HTMLElement = createElement('div', { className: 'e-de-ui-bullet-list-header-presetmenu', id: id + '_Bullet' });
        bulletListDiv.style.display = 'none';
        bulletListDiv.style.height = '270px';
        let ulTag: HTMLElement = createElement('ul', {
            styles: 'display: block; outline: 0px;', id: 'listMenu',
            className: 'e-de-ui-wfloating-menu e-de-ui-bullets-menu e-de-list-container e-de-list-thumbnail'
        });
        bulletListDiv.appendChild(ulTag);
        let bulletNone: HTMLElement = this.createBulletListTag(ulTag, 'e-de-icon-bullet-list-none e-de-bullet-icons', 'e-bullet-none');
        let bulletDot: HTMLElement = this.createBulletListTag(ulTag, 'e-de-icon-bullet-list-dot e-de-bullet-icons', 'e-bullet-dot');
        /* tslint:disable-next-line:max-line-length */
        let bulletCircle: HTMLElement = this.createBulletListTag(ulTag, 'e-de-icon-bullet-list-circle e-de-bullet-icons', 'e-bullet-circle');
        let bulletSquare: HTMLElement = this.createBulletListTag(ulTag, 'e-de-icon-bullet-list-square e-de-bullet-icons', 'e-bullet-square');
        /* tslint:disable-next-line:max-line-length */
        let bulletFlower: HTMLElement = this.createBulletListTag(ulTag, 'e-de-icon-bullet-list-flower e-de-bullet-icons', 'e-bullet-flower');
        let bulletArrow: HTMLElement = this.createBulletListTag(ulTag, 'e-de-icon-bullet-list-arrow e-de-bullet-icons', 'e-bullet-arrow');
        let bulletTick: HTMLElement = this.createBulletListTag(ulTag, 'e-de-icon-bullet-list-tick e-de-bullet-icons', 'e-bullet-tick');
        bulletNone.addEventListener('click', this.bulletListClick);
        bulletDot.addEventListener('click', this.bulletListClick);
        bulletCircle.addEventListener('click', this.bulletListClick);
        bulletSquare.addEventListener('click', this.bulletListClick);
        bulletFlower.addEventListener('click', this.bulletListClick);
        bulletArrow.addEventListener('click', this.bulletListClick);
        bulletTick.addEventListener('click', this.bulletListClick);

        // bulletListDiv.appendChild(table1);        
        this.target.appendChild(bulletListDiv);
    }
    /**
     * @private
     */
    public showNumberBulletDialog(listFormat: WListFormat, abstractList: WAbstractList): void {
        if (!isNullOrUndefined(listFormat)) {
            this.listFormat = listFormat;
        } else {
            this.listFormat = new WListFormat();
        }
        if (isNullOrUndefined(this.listFormat.list)) {
            this.listFormat.list = new WList();
        }
        if (!isNullOrUndefined(abstractList)) {
            this.abstractList = abstractList;
        } else {
            this.abstractList = new WAbstractList();
        }
        let locale: L10n = new L10n('documenteditor', this.owner.owner.defaultLocale);
        locale.setLocale(this.owner.owner.locale);
        setCulture(this.owner.owner.locale);
        if (!this.target) {
            this.initNumberingBulletDialog(locale);
        }
        this.owner.dialog.header = locale.getConstant('Numbering and Bullets');
        this.owner.dialog.width = 'auto';
        this.owner.dialog.height = 'auto';
        this.owner.dialog.content = this.target;
        this.owner.dialog.beforeOpen = this.loadNumberingBulletDialog;
        this.owner.dialog.close = this.closeNumberingBulletDialog;
        this.owner.dialog.position = { X: 'center', Y: 'center' };
        this.owner.dialog.buttons = [{
            click: this.onOkButtonClick,
            buttonModel: { content: locale.getConstant('Ok'), cssClass: 'e-flat e-numbering-bullet-okay', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: locale.getConstant('Cancel'), cssClass: 'e-flat e-numbering-bullet-cancel' }
        }];
        this.owner.dialog.dataBind();
        this.owner.dialog.show();
    }
    /**
     * @private
     */
    public numberListClick = (args: any): void => {
        this.isBullet = false;
        this.setActiveElement(args);
        if (args.currentTarget.classList.contains('e-de-list-numbered-none')) {
            this.numberFormat = undefined;
            this.listLevelPattern = undefined;
        } else if (args.currentTarget.classList.contains('e-de-list-numbered-number-dot')) {
            this.numberFormat = '%1.';
            this.listLevelPattern = 'Arabic';
        } else if (args.currentTarget.classList.contains('e-de-list-numbered-number-brace')) {
            this.numberFormat = '%1)';
            this.listLevelPattern = 'Arabic';
        } else if (args.currentTarget.classList.contains('e-de-list-numbered-up-roman')) {
            this.numberFormat = '%1.';
            this.listLevelPattern = 'UpRoman';
        } else if (args.currentTarget.classList.contains('e-de-list-numbered-up-letter')) {
            this.numberFormat = '%1.';
            this.listLevelPattern = 'UpLetter';
        } else if (args.currentTarget.classList.contains('e-de-list-numbered-low-letter-brace')) {
            this.numberFormat = '%1)';
            this.listLevelPattern = 'LowLetter';
        } else if (args.currentTarget.classList.contains('e-de-numbered-low-letter-dot')) {
            this.numberFormat = '%1.';
            this.listLevelPattern = 'LowLetter';
        } else if (args.currentTarget.classList.contains('e-de-list-numbered-low-roman')) {
            this.numberFormat = '%1.';
            this.listLevelPattern = 'LowRoman';
        }
    }

    private setActiveElement(args: any): void {
        let html: HTMLElement = args.currentTarget.parentElement;
        for (let i: number = 0; i < html.childElementCount; i++) {
            if ((html.childNodes[i] as HTMLElement).classList.contains('e-de-list-active')) {
                (html.childNodes[i] as HTMLElement).classList.remove('e-de-list-active');
            }
        }
        args.currentTarget.classList.add('e-de-list-active');
    }
    /**
     * @private
     */
    public bulletListClick = (args: any): void => {
        this.isBullet = true;
        this.setActiveElement(args);
        if (args.currentTarget.classList.contains('e-bullet-none')) {
            this.symbol = undefined;
            this.fontFamily = undefined;
        } else if (args.currentTarget.classList.contains('e-bullet-dot')) {
            this.symbol = '\uf0b7';
            this.fontFamily = 'Symbol';
        } else if (args.currentTarget.classList.contains('e-bullet-circle')) {
            this.symbol = '\uf06f' + '\u0020';
            this.fontFamily = 'Symbol';
        } else if (args.currentTarget.classList.contains('e-bullet-square')) {
            this.symbol = '\uf0a7';
            this.fontFamily = 'Wingdings';
        } else if (args.currentTarget.classList.contains('e-bullet-flower')) {
            this.symbol = '\uf076';
            this.fontFamily = 'Wingdings';
        } else if (args.currentTarget.classList.contains('e-bullet-arrow')) {
            this.symbol = '\uf0d8';
            this.fontFamily = 'Wingdings';
        } else if (args.currentTarget.classList.contains('e-bullet-tick')) {
            this.symbol = '\uf0fc';
            this.fontFamily = 'Wingdings';
        }
    }
    /**
     * @private
     */
    public loadNumberingBulletDialog = (): void => {
        //Load 
        this.owner.updateFocus();
    }
    /**
     * @private
     */
    public closeNumberingBulletDialog = (): void => {
        this.unWireEventsAndBindings();
        this.owner.updateFocus();
    }
    /**
     * @private
     */
    public onCancelButtonClick = (): void => {
        this.isBullet = false;
        this.listLevelPattern = undefined;
        this.numberFormat = undefined;
        this.symbol = undefined;
        this.fontFamily = undefined;
        this.owner.dialog.hide();
        this.unWireEventsAndBindings();
    }
    /**
     * @private
     */
    public onOkButtonClick = (): void => {
        if (this.owner.owner.viewer.lists.length > 0) {
            this.listFormat.list.listId = this.owner.owner.viewer.lists[this.owner.owner.viewer.lists.length - 1].listId + 1;
            this.listFormat.listId = this.listFormat.list.listId;
        } else {
            this.listFormat.list.listId = 0;
            this.listFormat.listId = 0;
        }

        if (this.owner.owner.viewer.abstractLists.length > 0) {
            /* tslint:disable-next-line:max-line-length */
            this.abstractList.abstractListId = this.owner.owner.viewer.abstractLists[this.owner.owner.viewer.abstractLists.length - 1].abstractListId + 1;
        } else {
            this.abstractList.abstractListId = 0;
        }
        this.listFormat.list.abstractListId = this.abstractList.abstractListId;
        let listLevel: WListLevel = new WListLevel(this.abstractList);
        listLevel.listLevelPattern = !isNullOrUndefined(this.listLevelPattern) ? this.listLevelPattern : 'Bullet';
        listLevel.numberFormat = this.isBullet ? this.symbol : this.numberFormat;
        if (listLevel.listLevelPattern !== 'Bullet') {
            listLevel.startAt = 1;
        }
        listLevel.characterFormat.fontFamily = !isNullOrUndefined(this.fontFamily) ? this.fontFamily : 'Verdana';
        listLevel.paragraphFormat.leftIndent = 36;
        listLevel.paragraphFormat.firstLineIndent = -18;
        this.abstractList.levels.push(listLevel);
        this.listFormat.listLevelNumber = 0;
        this.listFormat.list.abstractList = this.abstractList;
        this.owner.dialog.hide();
    }
    /**
     * @private
     */
    public unWireEventsAndBindings(): void {
        //Unwire events
    }
    /**
     * @private
     */
    public destroy(): void {
        this.owner = undefined;
        if (this.listFormat) {
            this.listFormat.destroy();
            this.listFormat = undefined;
        }
        if (this.abstractList) {
            this.abstractList.destroy();
            this.abstractList = undefined;
        }
        if (this.target && this.target.parentElement) {
            this.target.parentElement.removeChild(this.target);
            for (let m: number = 0; m < this.target.childNodes.length; m++) {
                this.target.removeChild(this.target.childNodes[m]);
                m--;
            }
            this.target = undefined;
        }
    }
}
/* tslint:enable:no-any */