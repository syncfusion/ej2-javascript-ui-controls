import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';
import { DocumentEditor } from '../../../document-editor/document-editor';
import { createElement, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';
import { ParagraphWidget, WAbstractList, WList, WListLevel } from '../../../document-editor/implementation';
import { ItemModel } from '@syncfusion/ej2-splitbuttons';
import { RibbonItemModel, RibbonItemSize, RibbonSplitButtonSettingsModel } from '@syncfusion/ej2-ribbon';
import { BulletListHelper } from '../../helper/bullet-list-helper';
import { ListLevelPattern } from '../../../document-editor/base';
import { ElementsMap } from '../../helper/ribbon-interfaces';

// Numbering list constants
export const NUMBER_LIST_ID: string = '_number_list';

/**
 * NumberingGroup class for handling numbering list operations in Document Editor ribbon
 * @private
 */
export class NumberingGroup {
    // Track the last applied numbering style
    private appliedNumberingStyle: string = 'arabic';
    private container: DocumentEditorContainer;
    private ribbonId: string;
    private localObj: L10n;

    // HTML Elements for numbering options
    private numberListDropDiv: HTMLElement;
    private numberListDropUlTag: HTMLElement;
    private noneNumberTag: HTMLElement;
    private numberList: HTMLElement;
    private lowLetter: HTMLElement;
    private upLetter: HTMLElement;
    private lowRoman: HTMLElement;
    private upRoman: HTMLElement;

    // Element map for easier management
    private numberElements: ElementsMap;

    // Event handlers for numbering options
    private numberedAndBulletNoneClickHandler: EventListenerOrEventListenerObject = this.bulletNoneClick.bind(this);
    private numberedNumberDotClickHandler: EventListenerOrEventListenerObject = this.numberedNumberDotClick.bind(this);
    private numberedLowLetterClickHandler: EventListenerOrEventListenerObject = this.numberedLowLetterClick.bind(this);
    private numberedUpLetterClickHandler: EventListenerOrEventListenerObject = this.numberedUpLetterClick.bind(this);
    private numberedLowRomanClickHandler: EventListenerOrEventListenerObject = this.numberedLowRomanClick.bind(this);
    private numberedUpRomanClickHandler: EventListenerOrEventListenerObject = this.numberedUpRomanClick.bind(this);

    /**
     * Constructor for NumberingGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.ribbonId = this.container.element.id + RIBBON_ID;
        this.localObj = this.container.localObj;
    }

    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    /**
     * Get the numbering list split button item configuration
     * @returns {RibbonItemModel} - Numbering list split button item configuration
     * @private
     */
    public getNumberingListItem(): RibbonItemModel {
        const id: string = this.ribbonId;

        return {
            type: 'SplitButton',
            keyTip: 'N',
            allowedSizes: RibbonItemSize.Small,
            splitButtonSettings: this.createNumberingSplitButton(),
            id: id + NUMBER_LIST_ID,
            ribbonTooltipSettings: { content: this.localObj.getConstant('Numbering') }
        };
    }

    private createNumberingSplitButton(): RibbonSplitButtonSettingsModel {
        let numberIconCss: string = 'e-de-ctnr-numbering e-icons';
        if (this.container.enableRtl) {
            numberIconCss += ' e-de-flip';
        }

        // Create the HTML template for numbering dropdown
        const numberListDropDiv: HTMLElement = createElement('div', {
            id: this.ribbonId + '_number_list_div',
            styles: 'width: 211px;height: auto;visibility: hidden'
        });

        const numberListDropUlTag: HTMLElement = createElement('ul', {
            styles: 'visibility: visible; outline: 0px;',
            id: this.ribbonId + '_numberListMenu',
            className: 'e-de-floating-menu e-de-bullets-menu e-de-list-container e-de-list-thumbnail'
        });

        numberListDropDiv.appendChild(numberListDropUlTag);

        // Create numbering list options using BulletListHelper
        this.noneNumberTag = BulletListHelper.createNumberNoneListTag(numberListDropUlTag, this.localObj);
        this.noneNumberTag.addEventListener('click', this.numberedAndBulletNoneClickHandler);

        this.numberList = BulletListHelper.createNumberListTag(numberListDropUlTag, '1.', '2.', '3.');
        this.numberList.addEventListener('click', this.numberedNumberDotClickHandler);

        this.lowLetter = BulletListHelper.createNumberListTag(numberListDropUlTag, 'a.', 'b.', 'c.');
        this.lowLetter.addEventListener('click', this.numberedLowLetterClickHandler);

        this.upLetter = BulletListHelper.createNumberListTag(numberListDropUlTag, 'A.', 'B.', 'C.');
        this.upLetter.addEventListener('click', this.numberedUpLetterClickHandler);

        this.lowRoman = BulletListHelper.createNumberListTag(numberListDropUlTag, 'i.', 'ii.', 'iii.');
        this.lowRoman.addEventListener('click', this.numberedLowRomanClickHandler);

        this.upRoman = BulletListHelper.createNumberListTag(numberListDropUlTag, 'I.', 'II.', 'III.');
        this.upRoman.addEventListener('click', this.numberedUpRomanClickHandler);

        // Initialize element map for easier management
        this.numberElements = {
            'none': this.noneNumberTag,
            'number': this.numberList,
            'lowletter': this.lowLetter,
            'upletter': this.upLetter,
            'lowroman': this.lowRoman,
            'uproman': this.upRoman
        };

        return {
            target: numberListDropDiv,
            iconCss: numberIconCss,
            items: this.getNumberingItems(),
            content: this.localObj.getConstant('Numbering'),
            select: this.handleNumberingSelection.bind(this),
            beforeOpen: (): void => {
                numberListDropDiv.style.visibility = 'visible';
                const levelPattern: string = BulletListHelper.getCurrentListPattern(this.documentEditor);
                this.updateSelectedNumberedListType(levelPattern);
            },
            beforeClose: (): void => {
                numberListDropDiv.style.visibility = 'hidden';
                this.removeSelectedList();
            },
            click: () => {
                this.applyLastAppliedNumbering();
            },
            close: (): void => {
                this.refreshHomeSelection();
            }
        };
    }

    private getNumberingItems(): ItemModel[] {
        return [
            { id: this.ribbonId + '_number-none', text: this.localObj.getConstant('None') },
            { id: this.ribbonId + '_number-arabic', text: this.localObj.getConstant('Arabic') },
            { id: this.ribbonId + '_number-lowletter', text: this.localObj.getConstant('Lower Letter') },
            { id: this.ribbonId + '_number-upletter', text: this.localObj.getConstant('Upper Letter') },
            { id: this.ribbonId + '_number-lowroman', text: this.localObj.getConstant('Lower Roman') },
            { id: this.ribbonId + '_number-uproman', text: this.localObj.getConstant('Upper Roman') }
        ];
    }

    private removeSelectedList(): void {
        BulletListHelper.removeSelectedList(this.numberElements);
    }

    private updateSelectedNumberedListType(listPattern: string): void {
        BulletListHelper.updateSelectedNumberedListType(listPattern, this.numberElements);
    }

    /**
     * Apply the last used numbering style
     * @returns {void}
     * @private
     */
    public applyLastAppliedNumbering(): void {
        switch (this.appliedNumberingStyle) {
        case 'arabic': this.numberedNumberDotClick(); break;
        case this.ribbonId + '_lowroman': this.numberedLowRomanClick(); break;
        case this.ribbonId + '_uproman': this.numberedUpRomanClick(); break;
        case this.ribbonId + '_lowletter': this.numberedLowLetterClick(); break;
        case this.ribbonId + '_upletter': this.numberedUpLetterClick(); break;
        default: this.numberedNumberDotClick(); break;
        }
    }

    private handleNumberingSelection(args: any): void {

        switch (args.item.id) {
        case this.ribbonId + '_number-none':
            this.bulletNoneClick();
            break;
        case this.ribbonId + '_number-arabic':
            this.numberedNumberDotClick();
            break;
        case this.ribbonId + '_number-lowroman':
            this.numberedLowRomanClick();
            break;
        case this.ribbonId + '_number-uproman':
            this.numberedUpRomanClick();
            break;
        case this.ribbonId + '_number-lowletter':
            this.numberedLowLetterClick();
            break;
        case this.ribbonId + '_number-upletter':
            this.numberedUpLetterClick();
            break;
        }
    }

    private bulletNoneClick(): void {
        BulletListHelper.clearList(this.documentEditor);
        this.refreshHomeSelection();
    }

    private numberedNumberDotClick(): void {
        this.applyNumbering('Arabic', 'arabic');
    }

    private numberedLowLetterClick(): void {
        this.applyNumbering('LowLetter', 'lowletter');
    }

    private numberedUpLetterClick(): void {
        this.applyNumbering('UpLetter', 'upletter');
    }

    private numberedLowRomanClick(): void {
        this.applyNumbering('LowRoman', 'lowroman');
    }

    private numberedUpRomanClick(): void {
        this.applyNumbering('UpRoman', 'uproman');
    }

    private applyNumbering(pattern: ListLevelPattern, style: string): void {
        if (!this.documentEditor.isReadOnly && this.documentEditor.editorModule) {
            this.appliedNumberingStyle = style;
            const format: string = BulletListHelper.getLevelFormatNumber(this.documentEditor);
            this.documentEditor.editorModule.applyNumbering(format, pattern);
            setTimeout((): void => {
                this.documentEditor.focusIn();
                this.refreshHomeSelection();
            }, 30);
        }
    }
    private refreshHomeSelection(): void {
        const ribbonModule: any = (this.container as any).ribbonModule;
        if (ribbonModule && ribbonModule.tabManager && ribbonModule.tabManager.homeTab) {
            ribbonModule.tabManager.homeTab.updateSelection();
        }
    }

    public destroy(): void {
        // Remove event listeners for numbering tags
        if (this.noneNumberTag) {
            this.noneNumberTag.removeEventListener('click', this.numberedAndBulletNoneClickHandler);
        }

        if (this.numberList) {
            this.numberList.removeEventListener('click', this.numberedNumberDotClickHandler);
        }

        if (this.lowLetter) {
            this.lowLetter.removeEventListener('click', this.numberedLowLetterClickHandler);
        }

        if (this.upLetter) {
            this.upLetter.removeEventListener('click', this.numberedUpLetterClickHandler);
        }

        if (this.lowRoman) {
            this.lowRoman.removeEventListener('click', this.numberedLowRomanClickHandler);
        }

        if (this.upRoman) {
            this.upRoman.removeEventListener('click', this.numberedUpRomanClickHandler);
        }

        // Clear references
        this.noneNumberTag = null;
        this.numberList = null;
        this.lowLetter = null;
        this.upLetter = null;
        this.lowRoman = null;
        this.upRoman = null;
    }
}
