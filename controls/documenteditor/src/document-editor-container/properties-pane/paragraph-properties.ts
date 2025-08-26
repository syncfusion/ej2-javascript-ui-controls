import { createElement, isNullOrUndefined, classList, L10n, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { DocumentEditor, ListLevelPattern, ParagraphWidget, WAbstractList, WList, WListLevel, WStyle } from '../../document-editor/index';
import { ComboBox } from '@syncfusion/ej2-dropdowns';
import { Button } from '@syncfusion/ej2-buttons';
import { ItemModel, DropDownButton, SplitButton, SplitButtonModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Query } from '@syncfusion/ej2-data';
import { DocumentEditorContainer } from '../document-editor-container';
import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { BulletListHelper } from '../helper/bullet-list-helper';
import { LineSpacingHelper } from '../helper/line-spacing-helper';
import { StylesHelper } from '../helper/styles-helper';
import { ElementsMap } from '../helper/ribbon-interfaces';
/**
 * Paragraph Properties
 *
 * @private
 */
export class Paragraph {
    private container: DocumentEditorContainer;
    //EJ2 Components
    private showHiddenMarksBtn: Button;
    private leftAlignmentBtn: Button;
    private rightAlignmentBtn: Button;
    private centerAlignmentBtn: Button;
    private justifyBtn: Button;
    private increaseIndentBtn: Button;
    private decreaseIndentBtn: Button;
    private lineSpacing: DropDownButton;
    private style: ComboBox;
    private bulletListBtn: SplitButton;
    private numberedListBtn: SplitButton;
    private bordersBtn: Button;
    //HTML Elements
    private textProperties: HTMLElement;
    private leftAlignment: HTMLElement;
    private rightAlignment: HTMLElement;
    private centerAlignment: HTMLElement;
    private justify: HTMLElement;
    private increaseIndent: HTMLElement;
    private decreaseIndent: HTMLElement;
    private showHiddenMarks: HTMLElement;
    private noneNumberTag: HTMLElement;
    private numberList: HTMLElement;
    private lowLetter: HTMLElement;
    private upLetter: HTMLElement;
    private lowRoman: HTMLElement;
    private upRoman: HTMLElement;
    private noneBulletTag: HTMLElement;
    private dotBullet: HTMLElement;
    private circleBullet: HTMLElement;
    private squareBullet: HTMLElement;
    private flowerBullet: HTMLElement;
    private arrowBullet: HTMLElement;
    private tickBullet: HTMLElement;
    private borders: HTMLElement;
    private paragraphDiv: HTMLElement;
    private label: HTMLElement;
    private styleDiv: HTMLElement;
    private styleSelect: HTMLSelectElement;
    private indentWholeDiv: HTMLElement;
    private indentDiv: HTMLElement;
    private incDecIndentDiv: HTMLElement;
    private listDiv: HTMLElement;
    private paraDiv: HTMLElement;
    private lineHeight: HTMLElement;
    private listDropDown: HTMLElement;
    private bulletButton: HTMLElement;
    private numberingList: HTMLElement;
    private numberListDropDiv: HTMLElement;
    private numberListDropUlTag: HTMLElement;

    //Event Handlers
    private numberedAndBulletNoneClickHandler: EventListenerOrEventListenerObject = this.numberedNoneClick.bind(this);

    private numberedNumberDotClickHandler: EventListenerOrEventListenerObject = this.numberedNumberDotClick.bind(this);
    private numberedLowLetterClickHandler: EventListenerOrEventListenerObject = this.numberedLowLetterClick.bind(this);
    private numberedUpLetterClickHandler: EventListenerOrEventListenerObject = this.numberedUpLetterClick.bind(this);
    private numberedLowRomanClickHandler: EventListenerOrEventListenerObject = this.numberedLowRomanClick.bind(this);
    private numberedUpRomanClickHandler: EventListenerOrEventListenerObject = this.numberedUpRomanClick.bind(this);
    private numberSplitButtonBeforeOpenHandler: EventListenerOrEventListenerObject = this.numberSplitButtonBeforeOpen.bind(this);
    private bulletDotClickHandler: EventListenerOrEventListenerObject = this.bulletDotClick.bind(this);
    private bulletCircleClickHandler: EventListenerOrEventListenerObject = this.bulletCircleClick.bind(this);
    private bulletSquareClickHandler: EventListenerOrEventListenerObject = this.bulletSquareClick.bind(this);
    private bulletFlowerClickHandler: EventListenerOrEventListenerObject = this.bulletFlowerClick.bind(this);
    private bulletArrowClickHandler: EventListenerOrEventListenerObject = this.bulletArrowClick.bind(this);
    private bulletTickClickHandler: EventListenerOrEventListenerObject = this.bulletTickClick.bind(this);
    private onrightAlignmentClickHandler: EventListenerOrEventListenerObject = this.onrightAlignmentClick.bind(this);


    private isRetrieving: boolean = false;
    private styleName: string;
    public appliedBulletStyle: string = 'dot';
    public appliedNumberingStyle: string = 'arabic';
    public appliedLineSpacing: string = '';

    public localObj: L10n;
    private isRtl: boolean;
    private splitButtonClass: string = 'e-de-prop-splitbutton';

    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }
    public constructor(container: DocumentEditorContainer) {
        this.container = container;
    }

    public initializeParagraphPropertiesDiv(wholeDiv: HTMLElement, isRtl?: boolean): void {
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        this.isRtl = isRtl;
        if (this.isRtl) {
            this.splitButtonClass = 'e-rtl ' + this.splitButtonClass;
        }
        this.textProperties = wholeDiv;
        const element: string = this.documentEditor.element.id + '_font_properties';
        this.paragraphDiv = this.createDivElement(element + '_paragraph', wholeDiv, '');
        classList(this.paragraphDiv, ['e-de-cntr-pane-padding'], []);
        this.label = createElement('label', { className: 'e-de-ctnr-prop-label' });
        this.label.innerHTML = this.localObj.getConstant('Paragraph');
        this.paragraphDiv.appendChild(this.label);
        this.styleDiv = this.createDivElement(element + '_styleDiv', this.paragraphDiv);
        this.styleDiv.classList.add('e-de-ctnr-segment', 'e-de-ctnr-style-div');
        this.styleSelect = createElement('input', { id: element + '_style', styles: 'width:248px;letter-spacing: 0.05px;' }) as HTMLSelectElement;
        this.styleDiv.appendChild(this.styleSelect);
        this.createStyleDropDownList(this.styleSelect);
        this.indentWholeDiv = this.createDivElement(element + '_indentWholeDiv', this.paragraphDiv);
        this.indentWholeDiv.style.display = 'flex';
        this.indentWholeDiv.classList.add('e-de-ctnr-segment');
        if (isRtl) {
            classList(this.indentWholeDiv, ['e-de-ctnr-segment-rtl'], []);
        }
        this.indentDiv = this.createDivElement(element + '_indentDiv', this.indentWholeDiv, 'display:flex;');
        let indentClassName: string = 'e-de-ctnr-group-btn e-de-char-fmt-btn-left e-btn-group';
        if (isRtl) {
            indentClassName = 'e-rtl ' + indentClassName;
        }
        this.indentDiv.className = indentClassName;
        this.leftAlignment = this.createButtonTemplate(element + '_leftIndent', 'e-de-ctnr-alignleft e-icons', this.indentDiv, 'e-de-prop-indent-button', '40.5', 'Align left Tooltip');
        this.centerAlignment = this.createButtonTemplate(element + '_centerIndent', 'e-de-ctnr-aligncenter e-icons', this.indentDiv, 'e-de-prop-indent-button', '40.5', 'Center Tooltip');
        this.rightAlignment = this.createButtonTemplate(element + '_rightIndent', 'e-de-ctnr-alignright e-icons', this.indentDiv, 'e-de-prop-indent-button', '40.5', 'Align right Tooltip');
        this.justify = this.createButtonTemplate(element + '_justify', 'e-de-ctnr-justify e-icons', this.indentDiv, 'e-de-prop-indent-last-button', '40.5', 'Justify Tooltip');
        let increaseIndentIconCss: string = 'e-de-ctnr-increaseindent e-icons';
        let decreaseIndentIconCss: string = 'e-de-ctnr-decreaseindent e-icons';
        this.incDecIndentDiv = this.createDivElement(element + '_lineindentDiv', this.indentWholeDiv, 'display:flex;');
        indentClassName = 'e-de-ctnr-group-btn e-de-char-fmt-btn-right e-btn-group';
        if (isRtl) {
            indentClassName = 'e-rtl ' + indentClassName;
            increaseIndentIconCss += ' e-de-flip';
            decreaseIndentIconCss += ' e-de-flip';
        }
        this.incDecIndentDiv.className = indentClassName;
        this.decreaseIndent = this.createButtonTemplate(element + '_decreaseIndent', decreaseIndentIconCss, this.incDecIndentDiv, 'e-de-prop-indent-button', '37', 'Decrease indent');
        this.increaseIndent = this.createButtonTemplate(element + '_increaseIndent', increaseIndentIconCss, this.incDecIndentDiv, 'e-de-prop-indent-last-button', '37', 'Increase indent');
        this.listDiv = this.createDivElement(element + '_listDiv', this.paragraphDiv, 'display:flex;');
        this.paraDiv = this.createDivElement(element + '_paraDiv', this.paragraphDiv, 'display:flex');
        classList(this.listDiv, ['e-de-ctnr-segment', 'e-de-ctnr-group-btn'], []);
        classList(this.paraDiv, ['e-de-ctnr-segment', 'e-de-ctnr-group-btn'], []);
        if (isRtl) {
            classList(this.listDiv, ['e-de-ctnr-segment-rtl', 'e-de-ctnr-group-btn'], []);
            classList(this.paraDiv, ['e-de-ctnr-segment-rtl', 'e-de-ctnr-group-btn'], []);
        }
        this.lineHeight = createElement('button', { id: element + '_lineHeight', attrs: { type: 'button' } });
        this.listDiv.appendChild(this.lineHeight);
        this.lineSpacing = this.createLineSpacingDropdown(this.lineHeight);

        this.listDropDown = this.createDivElement(element + '_listDropDiv', this.listDiv);
        classList(this.listDropDown, ['de-split-button', 'e-de-ctnr-segment-list'], []);
        if (isRtl) {
            classList(this.listDropDown, ['e-de-ctnr-segment-list-rtl'], []);
        }

        this.bulletButton = createElement('button', { id: element + '_bullet', attrs: { type: 'button' } });
        this.listDropDown.appendChild(this.bulletButton);
        this.numberingList = createElement('button', { id: element + '_numberingList', attrs: { type: 'button' } });
        this.listDropDown.appendChild(this.numberingList);
        let bulletIconCss: string = 'e-de-ctnr-bullets e-icons';
        let numberIconCss: string = 'e-de-ctnr-numbering e-icons';
        if (isRtl) {
            bulletIconCss += ' e-de-flip';
            numberIconCss += ' e-de-flip';
        }
        this.createBulletListDropButton(bulletIconCss, this.bulletButton);
        this.createNumberListDropButton(numberIconCss, this.numberingList);
        this.borders = this.createButtonTemplate(element + '_borders', 'e-de-ctnr-borders e-icons', this.paraDiv, 'e-de-ctnr-group-btn', '37', 'Borders');
        this.showHiddenMarks = this.createButtonTemplate(element + '_paraMark', 'e-de-e-paragraph-mark e-icons', this.paraDiv, 'e-de-ctnr-group-btn', '37', 'ShowHiddenMarks Tooltip');
    }
    private createSeparator(parentDiv: HTMLElement): void {
        const separator: HTMLElement = createElement('div', { className: 'e-de-prop-vline' });
        parentDiv.appendChild(separator);
    }
    private createDivElement(id: string, parentDiv: HTMLElement, style?: string): HTMLElement {
        let element: HTMLElement;
        if (style) {
            element = createElement('div', { id: id, styles: style });
        } else {
            element = createElement('div', { id: id });
        }
        parentDiv.appendChild(element);
        return element;

    }
    /* eslint-disable-next-line max-len */
    private createButtonTemplate(id: string, iconcss: string, div: HTMLElement, buttonClass: string, width: string, toolTipText: string): HTMLButtonElement {
        const buttonElement: HTMLButtonElement = createElement('Button', { id: id, attrs: { type: 'button' } }) as HTMLButtonElement;
        // buttonElement.style.width = width + 'px';
        // buttonElement.style.height = 32 + 'px';
        div.appendChild(buttonElement);
        const btn: Button = new Button({
            cssClass: buttonClass, iconCss: iconcss
        });
        btn.appendTo(buttonElement);
        buttonElement.setAttribute('title', this.localObj.getConstant(toolTipText));
        buttonElement.setAttribute('aria-label', this.localObj.getConstant(toolTipText));
        if (this.localObj.getConstant(toolTipText) !== 'Decrease indent' && this.localObj.getConstant(toolTipText) !== 'Increase indent' && this.localObj.getConstant(toolTipText) !== 'Borders') {
            buttonElement.setAttribute('aria-pressed', 'false');
        }
        switch (toolTipText) {
        case 'Align left Tooltip':
            this.leftAlignmentBtn = btn;
            break;
        case 'Align right Tooltip':
            this.rightAlignmentBtn = btn;
            break;
        case 'Justify Tooltip':
            this.justifyBtn = btn;
            break;
        case 'Decrease indent':
            this.decreaseIndentBtn = btn;
            break;
        case 'Increase indent':
            this.increaseIndentBtn = btn;
            break;
        case 'Borders':
            this.bordersBtn = btn;
            break;
        case 'ShowHiddenMarks Tooltip':
            this.showHiddenMarksBtn = btn;
            break;
        default:
            this.centerAlignmentBtn = btn;
        }
        return buttonElement;
    }
    private createLineSpacingDropdown(button: HTMLElement): DropDownButton {
        const dropdown: DropDownButton = new DropDownButton({
            items: LineSpacingHelper.getLineSpacingItems(this.localObj),
            iconCss: 'e-de-ctnr-linespacing e-icons',
            enableRtl: this.isRtl,
            select: this.lineSpacingAction.bind(this),
            cssClass: this.splitButtonClass,
            beforeItemRender: (args: MenuEventArgs) => {
                LineSpacingHelper.customizeLineSpacingItem(args, this.appliedLineSpacing);
            }
        });
        dropdown.appendTo(button);
        button.setAttribute('title', this.localObj.getConstant('Line spacing'));
        return dropdown;
    }

    private createNumberListDropButton(iconcss: string, button: HTMLElement): void {
        this.numberListDropDiv = createElement('div', { id: 'target', styles: 'width: 211px;height: auto;display:none' });
        this.numberListDropUlTag = createElement('ul', {
            styles: 'display: block; outline: 0px;',
            id: 'listMenu',
            className: 'e-de-floating-menu e-de-bullets-menu e-de-list-container e-de-list-thumbnail'
        });
        this.numberListDropDiv.appendChild(this.numberListDropUlTag);
        this.noneNumberTag = this.createNumberNoneListTag(this.numberListDropUlTag);
        this.noneNumberTag.addEventListener('click', this.numberedAndBulletNoneClickHandler);
        this.numberList = this.createNumberListTag(this.numberListDropUlTag, '1.', '2.', '3.');
        this.numberList.addEventListener('click', this.numberedNumberDotClickHandler);
        this.lowLetter = this.createNumberListTag(this.numberListDropUlTag, 'a.', 'b.', 'c.');
        this.lowLetter.addEventListener('click', this.numberedLowLetterClickHandler);
        this.upLetter = this.createNumberListTag(this.numberListDropUlTag, 'A.', 'B.', 'C.');
        this.upLetter.addEventListener('click', this.numberedUpLetterClickHandler);
        this.lowRoman = this.createNumberListTag(this.numberListDropUlTag, 'i.', 'ii.', 'iii.');
        this.lowRoman.addEventListener('click', this.numberedLowRomanClickHandler);
        this.upRoman = this.createNumberListTag(this.numberListDropUlTag, 'I.', 'II.', 'III.');
        this.upRoman.addEventListener('click', this.numberedUpRomanClickHandler);
        const menuOptions: SplitButtonModel = {
            target: this.numberListDropDiv,
            iconCss: iconcss,
            cssClass: this.splitButtonClass,
            beforeOpen: this.numberSplitButtonBeforeOpen.bind(this),
            beforeClose: this.numberSplitButtonBeforeClose.bind(this)
        };
        this.numberedListBtn = new SplitButton(menuOptions);
        this.numberedListBtn.click = (): void => {
            this.applyLastAppliedNumbering();
        };
        this.numberedListBtn.appendTo(button);
        button.parentElement.setAttribute('title', this.localObj.getConstant('Numbering'));
        button.parentElement.setAttribute('aria-label', this.localObj.getConstant('Numbering'));
    }
    private numberSplitButtonBeforeClose(): void {
        this.numberListDropDiv.style.display = 'none';
        this.removeSelectedList();
    }
    private numberSplitButtonBeforeOpen(): void {
        this.numberListDropDiv.style.display = 'block';
        let levelPattern: string = 'None';
        if (!isNullOrUndefined(this.documentEditor.selectionModule.paragraphFormat)) {
            if (isNullOrUndefined(this.documentEditor.selectionModule.paragraphFormat.listId)
                || this.documentEditor.selectionModule.paragraphFormat.listId === -1) {
                levelPattern = 'None';
            }
            else {
                const list: WList = this.documentEditor.documentHelper.getListById(
                    this.documentEditor.selectionModule.paragraphFormat.listId);
                const abstractList: WAbstractList = this.documentEditor.documentHelper.getAbstractListById(list.abstractListId);
                const startParagraph: ParagraphWidget = this.documentEditor.selectionModule.isForward ?
                    this.documentEditor.selectionModule.start.paragraph : this.documentEditor.selectionModule.end.paragraph;
                const level: WListLevel = abstractList.levels[startParagraph.paragraphFormat.listFormat.listLevelNumber];
                levelPattern = level.listLevelPattern;
            }
        }
        this.updateSelectedNumberedListType(levelPattern);
    }
    private updateSelectedBulletListType(listText: string): void {
        // Create a map of bullet elements
        const bulletElements: ElementsMap = {
            'none': this.noneBulletTag,
            'dot': this.dotBullet,
            'circle': this.circleBullet,
            'square': this.squareBullet,
            'flower': this.flowerBullet,
            'arrow': this.arrowBullet,
            'tick': this.tickBullet
        };
        BulletListHelper.updateSelectedBulletListType(listText, bulletElements);
    }
    private updateSelectedNumberedListType(listText: string): void {
        // Create a map of number elements
        const numberElements: ElementsMap = {
            'none': this.noneNumberTag,
            'number': this.numberList,
            'lowletter': this.lowLetter,
            'upletter': this.upLetter,
            'lowroman': this.lowRoman,
            'uproman': this.upRoman
        };
        BulletListHelper.updateSelectedNumberedListType(listText, numberElements);
    }
    private removeSelectedList(): void {
        const elements: ElementsMap = {
            'noneNumber': this.noneNumberTag,
            'number': this.numberList,
            'lowletter': this.lowLetter,
            'upletter': this.upLetter,
            'lowroman': this.lowRoman,
            'uproman': this.upRoman,
            'noneBullet': this.noneBulletTag,
            'dot': this.dotBullet,
            'circle': this.circleBullet,
            'square': this.squareBullet,
            'flower': this.flowerBullet,
            'arrow': this.arrowBullet,
            'tick': this.tickBullet
        };
        BulletListHelper.removeSelectedList(elements);
    }
    /**
     * @private
     * @returns {void}
     */
    public applyLastAppliedNumbering(): void {
        switch (this.appliedNumberingStyle) {
        case 'arabic': this.numberedNumberDotClick(); break;
        case 'lowletter': this.numberedLowLetterClick(); break;
        case 'upletter': this.numberedUpLetterClick(); break;
        case 'lowroman': this.numberedLowRomanClick(); break;
        case 'uproman': this.numberedUpRomanClick(); break;
        }
    }
    private applyLastAppliedBullet(): void {
        this.applyBullet(this.appliedBulletStyle);
    }
    private createBulletListDropButton(iconcss: string, button: HTMLElement): void {
        const div: HTMLElement = createElement('div', { id: 'bullet_list', styles: 'width: 196px;height: auto;display:none' });
        const ulTag: HTMLElement = createElement('ul', {
            styles: 'display: block; outline: 0px;', id: 'listMenu',
            className: 'e-de-floating-menu e-de-bullets-menu e-de-list-container e-de-list-thumbnail'
        });
        div.appendChild(ulTag);
        this.noneBulletTag = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-none e-icons e-de-ctnr-list', true);
        this.noneBulletTag.addEventListener('click', this.numberedAndBulletNoneClickHandler);
        this.dotBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-dot e-icons e-de-ctnr-list', false);
        this.dotBullet.addEventListener('click', this.bulletDotClickHandler);
        this.circleBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-circle e-icons e-de-ctnr-list', false);
        this.circleBullet.addEventListener('click', this.bulletCircleClickHandler);
        this.squareBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-square e-icons e-de-ctnr-list', false);
        this.squareBullet.addEventListener('click', this.bulletSquareClickHandler);
        this.flowerBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-flower e-icons e-de-ctnr-list', false);
        this.flowerBullet.addEventListener('click', this.bulletFlowerClickHandler);
        this.arrowBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-arrow e-icons e-de-ctnr-list', false);
        this.arrowBullet.addEventListener('click', this.bulletArrowClickHandler);
        this.tickBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-tick e-icons e-de-ctnr-list', false);
        this.tickBullet.addEventListener('click', this.bulletTickClickHandler);
        const menuOptions: SplitButtonModel = {
            target: div,
            iconCss: iconcss,
            cssClass: this.splitButtonClass,
            beforeOpen: (): void => {
                div.style.display = 'block';
                if (isNullOrUndefined(this.documentEditor.selectionModule.paragraphFormat.listId) ||
                    this.documentEditor.selectionModule.paragraphFormat.listId === -1) {
                    this.updateSelectedBulletListType(this.documentEditor.selectionModule.paragraphFormat.listText);
                } else {
                    const startParagraph: ParagraphWidget = this.documentEditor.selectionModule.isForward ?
                        this.documentEditor.selectionModule.start.paragraph : this.documentEditor.selectionModule.end.paragraph;
                    this.updateSelectedBulletListType(startParagraph.paragraphFormat.listFormat.listLevel.numberFormat);
                }
            },
            beforeClose: (): void => {
                div.style.display = 'none';
                this.removeSelectedList();
            }
        };
        this.bulletListBtn = new SplitButton(menuOptions);
        this.bulletListBtn.click = (): void => {
            this.applyLastAppliedBullet();
        };
        this.bulletListBtn.appendTo(button);
        button.parentElement.setAttribute('title', this.localObj.getConstant('Bullets'));
        button.parentElement.setAttribute('aria-label', this.localObj.getConstant('Bullets'));
    }
    private createNumberListTag(ulTag: HTMLElement, text1: string, text2: string, text3: string): HTMLElement {
        return BulletListHelper.createNumberListTag(ulTag, text1, text2, text3);
    }
    private createNumberNoneListTag(ulTag: HTMLElement): HTMLElement {
        return BulletListHelper.createNumberNoneListTag(ulTag, this.localObj);
    }
    private createBulletListTag(ulTag: HTMLElement, iconCss: string, isNone: boolean): HTMLElement {
        return BulletListHelper.createBulletListTag(ulTag, iconCss, isNone, this.localObj);
    }
    private createStyleDropDownList(selectElement: HTMLElement): void {
        this.style = new ComboBox({
            dataSource: [{ StyleName: 'Normal', IconClass: 'e-de-e-paragraph-mark e-icons' }],
            cssClass: 'e-de-prop-dropdown',
            popupHeight: '240px',
            enableRtl: this.isRtl,
            allowFiltering: true,
            query: new Query().select(['StyleName', 'Style', 'IconClass']),
            fields: { text: 'StyleName', value: 'StyleName' },
            showClearButton: false,
            change: this.selectStyleValue.bind(this)
        });
        let itemTemplate: string | Function = '';
        // const instance: Paragraph = this;
        this.style.open = this.updateOptions.bind(this);
        if (!this.container.enableCsp) {
            if (this.isRtl) {
                itemTemplate = initializeCSPTemplate(
                    function (data: any): string {
                        return `<span style="${data.Style}">${data.StyleName}</span><span class="${data.IconClass}"></span>`;
                    }
                );
            } else {
                itemTemplate = initializeCSPTemplate(
                    function (data: any): string {
                        return `<span class="${data.IconClass}"></span><span style="${data.Style}">${data.StyleName}</span>`;
                    }
                );
            }
            this.style.itemTemplate = itemTemplate;
            this.style.isStringTemplate = true;
        }
        this.style.footerTemplate = initializeCSPTemplate(
            (data: any): string => {
                return `<span class="e-de-ctnr-dropdown-ftr">
                ${this.localObj.getConstant('Manage Styles')}...</span>`;
            }
        );
        this.style.appendTo(selectElement);
        this.style.focus = (): void => {
            this.isRetrieving = false;
            (this.style.element as HTMLInputElement).select();
        };
        selectElement.parentElement.setAttribute('title', this.localObj.getConstant('Styles'));
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private updateOptions(args: any): void {
        args.popup.element.getElementsByClassName('e-de-ctnr-dropdown-ftr')[0].addEventListener('click', this.createStyle.bind(this));
    }
    /* eslint-disable */
    public updateStyleNames(): void {
        this.styleName = StylesHelper.updateStyleNames(this.documentEditor, this.style, this.localObj);
        this.onSelectionChange();
    }
    private createStyle(): void {
        this.style.hidePopup();
        if (!this.documentEditor.isReadOnly) {
            this.documentEditor.showDialog('Styles');
        }
    }
    private onrightAlignmentClick(): void {
        this.leftAlignmentAction();
    };
    public wireEvent(): void {
        this.leftAlignment.addEventListener('click', this.onrightAlignmentClickHandler);
        this.rightAlignment.addEventListener('click', (): void => {
            this.rightAlignmentAction();
        });
        this.centerAlignment.addEventListener('click', (): void => {
            this.centerAlignmentAction();
        });
        this.justify.addEventListener('click', (): void => {
            this.justifyAction();
        });
        this.increaseIndent.addEventListener('click', (): void => {
            this.increaseIndentAction();
        });
        this.showHiddenMarks.addEventListener('click', (): void => {
            this.container.documentEditorSettings.showHiddenMarks = !this.container.documentEditorSettings.showHiddenMarks;
            this.toggleHiddenMarks();
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        });
        this.decreaseIndent.addEventListener('click', (): void => {
            this.decreaseIndentAction();
        });
        this.lineSpacing.addEventListener('select', (args: MenuEventArgs): void => {
            this.lineSpacingAction(args);
        });
        this.borders.addEventListener('click', (): void => {
            this.documentEditor.showBordersAndShadingDialog();
        });
    }
    public unwireEvents(): void {
        this.leftAlignment.removeEventListener('click', this.onrightAlignmentClickHandler);
        this.rightAlignment.click = undefined;
        this.centerAlignment.click = undefined;
        this.justify.click = undefined;
        this.increaseIndent.click = undefined;
        this.decreaseIndent.click = undefined;
        this.lineSpacing.select = undefined;
        this.style.select = undefined;
    }
    /**
     * @private
     */
    public toggleHiddenMarks(): void {
        if (this.container.documentEditorSettings.showHiddenMarks) {
            classList(this.showHiddenMarks, ['e-btn-toggle'], []);
            this.showHiddenMarks.setAttribute('aria-pressed', 'true');
        } else {
            classList(this.showHiddenMarks, [], ['e-btn-toggle']);
            this.showHiddenMarks.setAttribute('aria-pressed', 'false');
        }
    }
    private leftAlignmentAction(): void {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editorModule) {
            this.documentEditor.editorModule.toggleTextAlignment('Left');
            this.documentEditor.focusIn();
        }
    }
    private lineSpacingAction(args: any): void {
        if (this.isRetrieving) {
            return;
        }
        const appliedSpacing = { value: this.appliedLineSpacing };
        LineSpacingHelper.applyLineSpacing(this.documentEditor, args.item.text, appliedSpacing, this.localObj);
        this.appliedLineSpacing = appliedSpacing.value;
    }
    private setLineSpacing(): void {
        this.appliedLineSpacing = LineSpacingHelper.getCurrentLineSpacing(this.documentEditor, this.localObj);
    }
    private selectStyleValue(args: any): void {
        if (this.container) {
            if (this.isRetrieving || !args.isInteracted) {
                return;
            }
            setTimeout((): void => {
                this.applyStyleValue(args);
            }, 10);
        }
    }
    private applyStyleValue(args: any): void {
        if (!this.documentEditor.isReadOnly && this.documentEditor.editorModule) {
            StylesHelper.applyStyleValue(this.documentEditor, args);
        }
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    private rightAlignmentAction(): void {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editorModule) {
            this.documentEditor.editorModule.toggleTextAlignment('Right');
            this.documentEditor.focusIn();
        }
    }
    private centerAlignmentAction(): void {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editorModule) {
            this.documentEditor.editorModule.toggleTextAlignment('Center');
            this.documentEditor.focusIn();
        }
    }

    private justifyAction(): void {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editorModule) {
            this.documentEditor.editorModule.toggleTextAlignment('Justify');
            this.documentEditor.focusIn();
        }
    }
    private increaseIndentAction(): void {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editorModule) {
            this.documentEditor.editorModule.increaseIndent();
            this.documentEditor.focusIn();
        }
    }
    private decreaseIndentAction(): void {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editorModule) {
            this.documentEditor.editorModule.decreaseIndent();
            this.documentEditor.focusIn();
        }
    }
    private numberedNoneClick(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editorModule) {
            this.documentEditor.editorModule.clearList();
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    private applyNumbering(pattern: ListLevelPattern, style: string): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editorModule) {
            this.appliedNumberingStyle = style;
            this.documentEditor.editorModule.applyNumbering(
                BulletListHelper.getLevelFormatNumber(this.documentEditor),
                pattern
            );
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    private numberedNumberDotClick(): void {
        this.applyNumbering('Arabic', 'arabic');

    }
    private numberedUpRomanClick(): void {
        this.applyNumbering('UpRoman', 'uproman');
    }
    private numberedUpLetterClick(): void {
        this.applyNumbering('UpRoman', 'uproman');
    }
    private numberedLowLetterClick(): void {
        this.applyNumbering('LowLetter', 'lowletter');
    }
    private numberedLowRomanClick(): void {
        this.applyNumbering('LowRoman', 'lowroman');
    }
    private applyBullet(style: string): void {
        if (this.isRetrieving) {
            return;
        }
        const appliedStyle = { value: this.appliedBulletStyle };
        BulletListHelper.applyBulletStyle(this.documentEditor, style, appliedStyle);
        this.appliedBulletStyle = appliedStyle.value;
    }
    private bulletDotClick(): void {
        this.applyBullet('dot');
    }
    private bulletCircleClick(): void {
        this.applyBullet('circle');
    }
    private bulletSquareClick(): void {
        this.applyBullet('square');
    }
    private bulletFlowerClick(): void {
        this.applyBullet('flower');


    }
    private bulletArrowClick(): void {
        this.applyBullet('arrow');

    }
    private bulletTickClick(): void {
        this.applyBullet('tick');

    }
    public onSelectionChange(): void {
        this.isRetrieving = true;
        if (this.documentEditor.editorModule) {
            //#region paragraph format
            let style: string = this.documentEditor.selectionModule.characterFormat.styleName;
            if (this.documentEditor.selectionModule.characterFormat.styleName === "Default Paragraph Font") {
                style = this.documentEditor.selectionModule.paragraphFormat.styleName;
            }
            if (style) {
                let localeValue: string = this.localObj.getConstant(style);
                this.style.value = (isNullOrUndefined(localeValue) || localeValue == '') ? style : localeValue;
                // this.style.dataBind();
            } else {
                this.style.value = null;
            }
            classList(this.leftAlignment, [], ['e-btn-toggle']);
            classList(this.rightAlignment, [], ['e-btn-toggle']);
            classList(this.centerAlignment, [], ['e-btn-toggle']);
            classList(this.justify, [], ['e-btn-toggle']);
            if (this.documentEditor.selectionModule.paragraphFormat.textAlignment === 'Left') {
                classList(this.leftAlignment, ['e-btn-toggle'], []);
                this.leftAlignment.setAttribute('aria-pressed', 'true');
                this.rightAlignment.setAttribute('aria-pressed', 'false');
                this.centerAlignment.setAttribute('aria-pressed', 'false');
                this.justify.setAttribute('aria-pressed', 'false');
            } else if (this.documentEditor.selectionModule.paragraphFormat.textAlignment === 'Right') {
                classList(this.rightAlignment, ['e-btn-toggle'], []);
                this.leftAlignment.setAttribute('aria-pressed', 'false');
                this.rightAlignment.setAttribute('aria-pressed', 'true');
                this.centerAlignment.setAttribute('aria-pressed', 'false');
                this.justify.setAttribute('aria-pressed', 'false');
            } else if (this.documentEditor.selectionModule.paragraphFormat.textAlignment === 'Center') {
                classList(this.centerAlignment, ['e-btn-toggle'], []);
                this.leftAlignment.setAttribute('aria-pressed', 'false');
                this.rightAlignment.setAttribute('aria-pressed', 'false');
                this.centerAlignment.setAttribute('aria-pressed', 'true');
                this.justify.setAttribute('aria-pressed', 'false');
            } else if (this.documentEditor.selectionModule.paragraphFormat.textAlignment === 'Justify') {
                classList(this.justify, ['e-btn-toggle'], []);
                this.leftAlignment.setAttribute('aria-pressed', 'false');
                this.rightAlignment.setAttribute('aria-pressed', 'false');
                this.centerAlignment.setAttribute('aria-pressed', 'false');
                this.justify.setAttribute('aria-pressed', 'true');
            }
            this.toggleHiddenMarks();
        }
        this.setLineSpacing();
        this.isRetrieving = false;
    }
    private removeHTMLElements() {
        this.leftAlignment.remove();
        this.leftAlignment = null;
        this.rightAlignment.remove();
        this.rightAlignment = null;
        this.centerAlignment.remove();
        this.centerAlignment = null;
        this.justify.remove();
        this.justify = null;
        this.increaseIndent.remove();
        this.increaseIndent = null;
        this.decreaseIndent.remove();
        this.decreaseIndent = null;
        this.showHiddenMarks.remove();
        this.showHiddenMarks = null;

        this.noneNumberTag.remove();
        this.noneNumberTag = null;
        this.numberList.remove();
        this.numberList = null;
        this.lowLetter.remove();
        this.lowLetter = null;
        this.upLetter.remove();
        this.upLetter = null;
        this.lowRoman.remove();
        this.lowRoman = null;
        this.upRoman.remove();
        this.upRoman = null;
        this.noneBulletTag.remove();
        this.noneBulletTag = null;
        this.dotBullet.remove();
        this.dotBullet = null;
        this.circleBullet.remove();
        this.circleBullet = null;
        this.squareBullet.remove();
        this.squareBullet = null;
        this.flowerBullet.remove();
        this.flowerBullet = null;
        this.arrowBullet.remove();
        this.arrowBullet = null;
        this.tickBullet.remove();
        this.tickBullet = null;
        this.borders.remove();
        this.borders = null;
        this.paragraphDiv.remove();
        this.paragraphDiv = null
        this.label.remove();
        this.label = null;
        // this.styleDiv.remove();
        // this.styleDiv = null;
        // this.styleSelect.remove();
        // this.styleSelect = null;
        this.indentWholeDiv.remove();
        this.indentWholeDiv = null;
        this.indentDiv.remove();
        this.indentDiv = null;
        this.incDecIndentDiv.remove();
        this.incDecIndentDiv = null;
        this.listDiv.remove();
        this.listDiv = null;
        this.paraDiv.remove();
        this.paraDiv = null;
        this.lineHeight.remove();
        this.lineHeight = null;
        this.listDropDown.remove();
        this.listDropDown = null;
        this.bulletButton.remove();
        this.bulletButton = null;
        this.numberingList.remove();
        this.numberingList = null;
        this.numberListDropDiv.remove();
        this.numberListDropDiv = null;
        this.numberListDropUlTag.remove();
        this.numberListDropUlTag = null;
    }
    public destroy(): void {
        this.container = undefined;
        this.unwireEvents();
        this.removeHTMLElements();
        if (this.lineSpacing) {
            this.lineSpacing.destroy();
            this.lineSpacing = undefined;
        }
        // if (this.style) {
        //     //this.style.destroy();
        //     if(this.style.element) {
        //         this.style.element.remove();
        //     }
        //     this.style.element = null;
        //     this.style = undefined;
        //}
        if (this.bulletListBtn) {
            this.bulletListBtn.destroy();
            this.bulletListBtn = undefined;
        }
        if (this.numberedListBtn) {
            this.numberedListBtn.destroy();
            this.numberedListBtn = undefined;
        }
        if (this.leftAlignmentBtn) {
            this.leftAlignmentBtn.destroy();
            this.leftAlignmentBtn = undefined;
        }
        if (this.rightAlignmentBtn) {
            this.rightAlignmentBtn.destroy();
            this.rightAlignmentBtn = undefined;
        }
        if (this.centerAlignmentBtn) {
            this.centerAlignmentBtn.destroy();
            this.centerAlignmentBtn = undefined;
        }
        if (this.showHiddenMarksBtn) {
            this.showHiddenMarksBtn.destroy();
            this.showHiddenMarksBtn = undefined;
        }
        if (this.justifyBtn) {
            this.justifyBtn.destroy();
            this.justifyBtn = undefined;
        }
        if (this.decreaseIndentBtn) {
            this.decreaseIndentBtn.destroy();
            this.decreaseIndentBtn = undefined;
        }
        if (this.increaseIndentBtn) {
            this.increaseIndentBtn.destroy();
            this.increaseIndentBtn = undefined;
        }
        if (this.bordersBtn) {
            this.bordersBtn.destroy();
            this.bordersBtn = undefined;
        }
        if (this.showHiddenMarksBtn) {
            this.showHiddenMarksBtn.destroy();
            this.showHiddenMarksBtn = undefined;
        }
    }
}
