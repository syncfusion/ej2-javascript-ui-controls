import { createElement, isNullOrUndefined, classList, L10n } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../document-editor/index';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Button } from '@syncfusion/ej2-buttons';
import { ItemModel, DropDownButton, SplitButton, SplitButtonModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Query } from '@syncfusion/ej2-data';
import { DocumentEditorContainer } from '../document-editor-container';
/**
 * Paragraph Properties
 *
 * @private
 */
export class Paragraph {
    private container: DocumentEditorContainer;
    private textProperties: HTMLElement;
    private leftAlignment: HTMLElement;
    private rightAlignment: HTMLElement;
    private centerAlignment: HTMLElement;
    private justify: HTMLElement;
    private increaseIndent: HTMLElement;
    private decreaseIndent: HTMLElement;
    private lineSpacing: DropDownButton;
    private style: DropDownList;
    private isRetrieving: boolean = false;
    private styleName: string;
    public appliedBulletStyle: string = 'dot';
    public appliedNumberingStyle: string = 'arabic';
    public appliedLineSpacing: string = '';
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
    public localObj: L10n;
    private isRtl: boolean;
    private splitButtonClass: string = 'e-de-prop-splitbutton';
    private bulletListBtn: SplitButton;
    private numberedListBtn: SplitButton;
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
        const paragraphDiv: HTMLElement = this.createDivElement(element + '_paragraph', wholeDiv, '');
        classList(paragraphDiv, ['e-de-cntr-pane-padding'], []);
        const label: HTMLElement = createElement('label', { styles: 'width:26px;', className: 'e-de-ctnr-prop-label' });
        label.innerHTML = this.localObj.getConstant('Paragraph');
        paragraphDiv.appendChild(label);
        const styleDiv: HTMLElement = this.createDivElement(element + '_styleDiv', paragraphDiv);
        styleDiv.classList.add('e-de-ctnr-segment', 'e-de-ctnr-style-div');
        const styleSelect: HTMLSelectElement = createElement('input', { id: element + '_style', styles: 'width:248px;font-size: 12px;letter-spacing: 0.05px;' }) as HTMLSelectElement;
        styleDiv.appendChild(styleSelect);
        this.createStyleDropDownList(styleSelect);
        const indentWholeDiv: HTMLElement = this.createDivElement(element + '_indentWholeDiv', paragraphDiv);
        indentWholeDiv.style.display = 'flex';
        indentWholeDiv.classList.add('e-de-ctnr-segment');
        if (isRtl) {
            classList(indentWholeDiv, ['e-de-ctnr-segment-rtl'], []);
        }
        const indentDiv: HTMLElement = this.createDivElement(element + '_indentDiv', indentWholeDiv, 'display:flex;');
        let indentClassName: string = 'e-de-ctnr-group-btn e-de-char-fmt-btn-left e-btn-group';
        if (isRtl) {
            indentClassName = 'e-rtl ' + indentClassName;
        }
        indentDiv.className = indentClassName;
        this.leftAlignment = this.createButtonTemplate(element + '_leftIndent', 'e-de-ctnr-alignleft e-icons', indentDiv, 'e-de-prop-indent-button', '40.5', this.localObj.getConstant('Align left Tooltip'));
        this.centerAlignment = this.createButtonTemplate(element + '_centerIndent', 'e-de-ctnr-aligncenter e-icons', indentDiv, 'e-de-prop-indent-button', '40.5', this.localObj.getConstant('Center Tooltip'));
        this.rightAlignment = this.createButtonTemplate(element + '_rightIndent', 'e-de-ctnr-alignright e-icons', indentDiv, 'e-de-prop-indent-button', '40.5', this.localObj.getConstant('Align right Tooltip'));
        this.justify = this.createButtonTemplate(element + '_justify', 'e-de-ctnr-justify e-icons', indentDiv, 'e-de-prop-indent-last-button', '40.5', this.localObj.getConstant('Justify Tooltip'));
        let increaseIndentIconCss: string = 'e-de-ctnr-increaseindent e-icons';
        let decreaseIndentIconCss: string = 'e-de-ctnr-decreaseindent e-icons';
        const incDecIndentDiv: HTMLElement = this.createDivElement(element + '_indentDiv', indentWholeDiv, 'display:flex;');
        indentClassName = 'e-de-ctnr-group-btn e-de-char-fmt-btn-right e-btn-group';
        if (isRtl) {
            indentClassName = 'e-rtl ' + indentClassName;
            increaseIndentIconCss += ' e-de-flip';
            decreaseIndentIconCss += ' e-de-flip';
        }
        incDecIndentDiv.className = indentClassName;
        this.decreaseIndent = this.createButtonTemplate(element + '_decreaseIndent', decreaseIndentIconCss, incDecIndentDiv, 'e-de-prop-indent-button', '37', this.localObj.getConstant('Decrease indent'));
        this.increaseIndent = this.createButtonTemplate(element + '_increaseIndent', increaseIndentIconCss, incDecIndentDiv, 'e-de-prop-indent-last-button', '37', this.localObj.getConstant('Increase indent'));
        const listDiv: HTMLElement = this.createDivElement(element + '_listDiv', paragraphDiv, 'display:flex;');
        classList(listDiv, ['e-de-ctnr-segment', 'e-de-ctnr-group-btn'], []);
        if (isRtl) {
            classList(listDiv, ['e-de-ctnr-segment-rtl', 'e-de-ctnr-group-btn'], []);
        }
        const lineHeight: HTMLElement = createElement('button', { id: element + '_lineHeight', attrs: { type: 'button' } });
        listDiv.appendChild(lineHeight);
        this.lineSpacing = this.createLineSpacingDropdown(lineHeight);

        const listDropDown: HTMLElement = this.createDivElement(element + '_listDropDiv', listDiv);
        listDropDown.className = 'de-split-button';
        const bulletButton: HTMLElement = createElement('button', { id: element + '_bullet', attrs: { type: 'button' } });
        listDropDown.appendChild(bulletButton);
        const numberingList: HTMLElement = createElement('button', { id: element + '_numberingList', attrs: { type: 'button' } });
        listDropDown.appendChild(numberingList);
        let bulletIconCss: string = 'e-de-ctnr-bullets e-icons';
        let numberIconCss: string = 'e-de-ctnr-numbering e-icons';
        if (isRtl) {
            bulletIconCss += ' e-de-flip';
            numberIconCss += ' e-de-flip';
        }
        this.createBulletListDropButton(bulletIconCss, bulletButton);
        this.createNumberListDropButton(numberIconCss, numberingList);
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
        buttonElement.setAttribute('title', toolTipText);
        return buttonElement;
    }
    private createLineSpacingDropdown(button: HTMLElement): DropDownButton {
        const items: ItemModel[] = [{
            text: this.localObj.getConstant('Single')
        }, {
            text: '1.15'
        }, {
            text: '1.5'
        }, {
            text: this.localObj.getConstant('Double')
        }];
        const dropdown: DropDownButton = new DropDownButton({
            items: items,
            iconCss: 'e-de-ctnr-linespacing e-icons',
            enableRtl: this.isRtl,
            select: this.lineSpacingAction.bind(this),
            cssClass: this.splitButtonClass,
            beforeItemRender: (args: MenuEventArgs) => {
                args.element.innerHTML = '<span></span>' + args.item.text;
                const span: HTMLElement = args.element.children[0] as HTMLElement;
                if (args.item.text === this.appliedLineSpacing) {
                    span.style.marginRight = '10px';
                    span.setAttribute('class', 'e-de-selected-item e-icons e-de-linespacing');
                } else {
                    (args.element.children[0] as HTMLElement).style.marginRight = '25px';
                    (args.element.children[0] as HTMLElement).classList.remove('e-de-selected-item');
                }
            }
        });
        dropdown.appendTo(button);
        button.setAttribute('title', this.localObj.getConstant('Line spacing'));
        return dropdown;
    }

    private createNumberListDropButton(iconcss: string, button: HTMLElement): void {
        const div: HTMLElement = createElement('div', { id: 'target', styles: 'width: 211px;height: auto;display:none' });
        const ulTag: HTMLElement = createElement('ul', {
            styles: 'display: block; outline: 0px;',
            id: 'listMenu',
            className: 'e-de-floating-menu e-de-bullets-menu e-de-list-container e-de-list-thumbnail'
        });
        div.appendChild(ulTag);
        this.noneNumberTag = this.createNumberNoneListTag(ulTag);
        this.noneNumberTag.addEventListener('click', this.numberedNoneClick.bind(this));
        this.numberList = this.createNumberListTag(ulTag, '1.', '2.', '3.');
        this.numberList.addEventListener('click', this.numberedNumberDotClick.bind(this));
        this.lowLetter = this.createNumberListTag(ulTag, 'a.', 'b.', 'c.');
        this.lowLetter.addEventListener('click', this.numberedLowLetterClick.bind(this));
        this.upLetter = this.createNumberListTag(ulTag, 'A.', 'B.', 'C.');
        this.upLetter.addEventListener('click', this.numberedUpLetterClick.bind(this));
        this.lowRoman = this.createNumberListTag(ulTag, 'i.', 'ii.', 'iii.');
        this.lowRoman.addEventListener('click', this.numberedLowRomanClick.bind(this));
        this.upRoman = this.createNumberListTag(ulTag, 'I.', 'II.', 'III.');
        this.upRoman.addEventListener('click', this.numberedUpRomanClick.bind(this));
        const menuOptions: SplitButtonModel = {
            target: div,
            iconCss: iconcss,
            cssClass: this.splitButtonClass,
            beforeOpen: (): void => {
                div.style.display = 'block';
                this.updateSelectedNumberedListType(this.documentEditor.selection.paragraphFormat.listText);
            },
            beforeClose: (): void => {
                div.style.display = 'none';
                this.removeSelectedList();
            }
        };
        this.numberedListBtn = new SplitButton(menuOptions);
        this.numberedListBtn.click = (): void => {
            this.applyLastAppliedNumbering();
        };
        this.numberedListBtn.appendTo(button);
        button.parentElement.setAttribute('title', this.localObj.getConstant('Numbering'));
    }
    private updateSelectedBulletListType(listText: string): void {
        switch (listText) {
        case '\uf0b7':
            this.dotBullet.classList.add('de-list-item-selected');
            break;
        case '\uf06f' + '\u0020':
            this.circleBullet.classList.add('de-list-item-selected');
            break;
        case '\uf0a7':
            this.squareBullet.classList.add('de-list-item-selected');
            break;
        case '\uf076':
            this.flowerBullet.classList.add('de-list-item-selected');
            break;
        case '\uf0d8':
            this.arrowBullet.classList.add('de-list-item-selected');
            break;
        case '\uf0fc':
            this.tickBullet.classList.add('de-list-item-selected');
            break;
        default:
            this.noneBulletTag.classList.add('de-list-item-selected');
            break;
        }
    }
    private updateSelectedNumberedListType(listText: string): void {
        switch (listText) {
        case '1.':
            this.numberList.classList.add('de-list-item-selected');
            break;
        case 'I.':
            this.upRoman.classList.add('de-list-item-selected');
            break;
        case 'A.':
            this.upLetter.classList.add('de-list-item-selected');
            break;
        case 'a.':
            this.lowLetter.classList.add('de-list-item-selected');
            break;
        case 'i.':
            this.lowRoman.classList.add('de-list-item-selected');
            break;
        default:
            this.noneNumberTag.classList.add('de-list-item-selected');
            break;
        }
    }
    private removeSelectedList(): void {
        const className: string = 'de-list-item-selected';
        this.noneNumberTag.classList.remove(className);
        this.numberList.classList.remove(className);
        this.lowLetter.classList.remove(className);
        this.upLetter.classList.remove(className);
        this.lowRoman.classList.remove(className);
        this.upRoman.classList.remove(className);
        this.noneBulletTag.classList.remove(className);

        this.dotBullet.classList.remove(className);
        this.circleBullet.classList.remove(className);
        this.squareBullet.classList.remove(className);
        this.flowerBullet.classList.remove(className);
        this.arrowBullet.classList.remove(className);
        this.tickBullet.classList.remove(className);

    }
    private applyLastAppliedNumbering(): void {
        switch (this.appliedNumberingStyle) {
        case 'arabic': this.numberedNumberDotClick(); break;
        case 'lowletter': this.numberedLowLetterClick(); break;
        case 'upletter': this.numberedUpLetterClick(); break;
        case 'lowroman': this.numberedLowRomanClick(); break;
        case 'uproman': this.numberedUpRomanClick(); break;
        }
    }
    private applyLastAppliedBullet(): void {
        switch (this.appliedBulletStyle) {
        case 'dot': this.bulletDotClick(); break;
        case 'circle': this.bulletCircleClick(); break;
        case 'square': this.bulletSquareClick(); break;
        case 'arrow': this.bulletArrowClick(); break;
        case 'tick': this.bulletTickClick(); break;
        case 'flower': this.bulletFlowerClick(); break;
        }
    }
    private createBulletListDropButton(iconcss: string, button: HTMLElement): void {
        const div: HTMLElement = createElement('div', { id: 'bullet_list', styles: 'width: 196px;height: auto;display:none' });
        const ulTag: HTMLElement = createElement('ul', {
            styles: 'display: block; outline: 0px;', id: 'listMenu',
            className: 'e-de-floating-menu e-de-bullets-menu e-de-list-container e-de-list-thumbnail'
        });
        div.appendChild(ulTag);
        this.noneBulletTag = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-none e-icons e-de-ctnr-list');
        this.noneBulletTag.addEventListener('click', this.numberedNoneClick.bind(this));
        this.dotBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-dot e-icons e-de-ctnr-list');
        this.dotBullet.addEventListener('click', this.bulletDotClick.bind(this));
        this.circleBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-circle e-icons e-de-ctnr-list');
        this.circleBullet.addEventListener('click', this.bulletCircleClick.bind(this));
        this.squareBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-square e-icons e-de-ctnr-list');
        this.squareBullet.addEventListener('click', this.bulletSquareClick.bind(this));
        this.flowerBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-flower e-icons e-de-ctnr-list');
        this.flowerBullet.addEventListener('click', this.bulletFlowerClick.bind(this));
        this.arrowBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-arrow e-icons e-de-ctnr-list');
        this.arrowBullet.addEventListener('click', this.bulletArrowClick.bind(this));
        this.tickBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-tick e-icons e-de-ctnr-list');
        this.tickBullet.addEventListener('click', this.bulletTickClick.bind(this));
        const menuOptions: SplitButtonModel = {
            target: div,
            iconCss: iconcss,
            cssClass: this.splitButtonClass,
            beforeOpen: (): void => {
                div.style.display = 'block';
                this.updateSelectedBulletListType(this.documentEditor.selection.paragraphFormat.listText);
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
    }
    private createNumberListTag(ulTag: HTMLElement, text1: string, text2: string, text3: string): HTMLElement {
        const liTag: HTMLElement = createElement('li', {
            styles: 'display:block',
            className: 'e-de-floating-menuitem e-de-floating-menuitem-md e-de-list-items  e-de-list-item-size'
        });
        ulTag.appendChild(liTag);
        let innerHTML: string = '<div>' + text1 + '<span class="e-de-list-line"></span></div><div>' + text2 + '<span class="e-de-list-line">';
        innerHTML += '</span></div><div>' + text3 + '<span class="e-de-list-line"> </span></div >';
        const liInnerDiv: HTMLElement = createElement('div', {
            className: 'e-de-list-header-presetmenu',
            id: 'ui-zlist0', innerHTML: innerHTML
        });
        liTag.appendChild(liInnerDiv);
        return liTag;
    }
    private createNumberNoneListTag(ulTag: HTMLElement): HTMLElement {
        const liTag: HTMLElement = createElement('li', {
            styles: 'display:block;',
            className: 'e-de-floating-menuitem e-de-floating-menuitem-md e-de-list-items  e-de-list-item-size'
        });
        ulTag.appendChild(liTag);
        const innerHTML: string = '<div><span class="e-de-bullets">None</span></div>';
        const liInnerDiv: HTMLElement = createElement('div', {
            className: 'e-de-list-header-presetmenu', styles: 'position:relative;left:11px;top:13px',
            id: 'ui-zlist0', innerHTML: innerHTML
        });
        liTag.appendChild(liInnerDiv);
        return liTag;
    }
    private createBulletListTag(ulTag: HTMLElement, iconCss: string): HTMLElement {
        const liTag: HTMLElement = createElement('li', {
            styles: 'display:block;',
            className: 'e-de-floating-menuitem e-de-floating-bullet-menuitem-md e-de-list-items  e-de-list-item-size'
        });
        ulTag.appendChild(liTag);
        const liInnerDiv: HTMLElement = createElement('div', { className: 'e-de-bullet-list-header-presetmenu', id: 'ui-zlist0' });
        const spanDiv: HTMLElement = createElement('div');
        liInnerDiv.appendChild(spanDiv);
        const span: HTMLElement = createElement('span', { className: iconCss });
        spanDiv.appendChild(span);
        liTag.appendChild(liInnerDiv);
        return liTag;
    }
    private createStyleDropDownList(selectElement: HTMLElement): void {
        this.style = new DropDownList({
            dataSource: [{ StyleName: 'Normal', Class: 'e-icons e-edit-font' }],
            cssClass: 'e-de-prop-dropdown',
            popupHeight: '240px',
            enableRtl: this.isRtl,
            query: new Query().select(['StyleName', 'Style']),
            fields: { text: 'StyleName', value: 'StyleName' },
            change: this.selectStyleValue.bind(this)
        });
        if (!this.container.enableCsp) {
            this.style.open = this.updateOptions.bind(this);
            this.style.itemTemplate = '<span style="${Style}">${StyleName}</span>';
            this.style.footerTemplate = '<span class="e-de-ctnr-dropdown-ftr">'
                + this.localObj.getConstant('Manage Styles') + '...' + '</span>';
            this.style.isStringTemplate = true;
        }
        this.style.appendTo(selectElement);
        selectElement.parentElement.setAttribute('title', this.localObj.getConstant('Styles'));
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private updateOptions(args: any): void {
        this.updateStyleNames();
        args.popup.element.getElementsByClassName('e-de-ctnr-dropdown-ftr')[0].addEventListener('click', this.createStyle.bind(this));
    }
    public updateStyleNames(): void {
        this.styleName = !isNullOrUndefined((this.style as any).itemData) ? (this.style as any).itemData.StyleName : undefined;
        this.style.dataSource = this.constructStyleDropItems(this.documentEditor.getStyles('Paragraph'));
        this.style.dataBind();
        this.onSelectionChange();
    }
    private createStyle(): void {
        this.style.hidePopup();
        if (!this.documentEditor.isReadOnly) {
            this.documentEditor.showDialog('Styles');
        }
    }
    private constructStyleDropItems(styles: unknown[]): any {
        const collection: any = [];
        for (const styleObj of styles) {
            const obj: any = {};
            obj.StyleName = (styleObj as any).name;
            obj.Style = this.parseStyle((styleObj as any).style as string);
            collection.push(obj);
        }
        return collection;
    }
    private parseStyle(style: string): string {
        let domStyle: string = '';
        const styleObj: any = JSON.parse(style);
        let textDecoration: string = '';
        if (!isNullOrUndefined(styleObj.characterFormat.baselineAlignment) && styleObj.characterFormat.baselineAlignment !== 'Normal') {
            let vAlign: string = '';
            switch (styleObj.characterFormat.baselineAlignment) {
            case 'Superscript':
                vAlign = 'super';
                break;
            case 'Subscript':
                vAlign = 'sub';
                break;
            }
            if (vAlign.length > 1) {
                domStyle += 'vertical-align:' + vAlign + ';';
            }
        }
        if (!isNullOrUndefined(styleObj.characterFormat.underline) && styleObj.characterFormat.underline !== 'None') {
            textDecoration += 'underline ';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.strikethrough) && styleObj.characterFormat.strikethrough !== 'None') {
            textDecoration += 'line-through ';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.fontSize)) {
            domStyle += 'font-size:' + styleObj.characterFormat.fontSize + 'px;';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.fontFamily)) {
            domStyle += 'font-family:' + styleObj.characterFormat.fontFamily + ';';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.bold) && styleObj.characterFormat.bold) {
            domStyle += 'font-weight:bold;';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.italic) && styleObj.characterFormat.italic) {
            domStyle += 'font-style:italic;';
        }
        // if (!isNullOrUndefined(styleObj.characterFormat.fontColor)) {
        //     domStyle += 'color: ' + styleObj.characterFormat.fontColor + ';';
        // }
        if (textDecoration.length > 1) {
            domStyle += 'text-decoration:' + textDecoration + ';';
        }
        return domStyle;
    }
    public wireEvent(): void {
        this.leftAlignment.addEventListener('click', (): void => {
            this.leftAlignmentAction();
        });
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
        this.decreaseIndent.addEventListener('click', (): void => {
            this.decreaseIndentAction();
        });
        this.lineSpacing.addEventListener('select', (args: MenuEventArgs): void => {
            this.lineSpacingAction(args);
        });
    }
    public unwireEvents(): void {
        this.leftAlignment.click = undefined;
        this.rightAlignment.click = undefined;
        this.centerAlignment.click = undefined;
        this.justify.click = undefined;
        this.increaseIndent.click = undefined;
        this.decreaseIndent.click = undefined;
        this.lineSpacing.select = undefined;
        this.style.select = undefined;
    }
    private leftAlignmentAction(): void {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.toggleTextAlignment('Left');
        }
    }
    private lineSpacingAction(args: any): void {
        if (this.isRetrieving) {
            return;
        }
        const text: string = args.item.text;
        switch (text) {
        case this.localObj.getConstant('Single'):
            this.documentEditor.selection.paragraphFormat.lineSpacing = 1;
            break;
        case '1.15':
            this.documentEditor.selection.paragraphFormat.lineSpacing = 1.15;
            break;
        case '1.5':
            this.documentEditor.selection.paragraphFormat.lineSpacing = 1.5;
            break;
        case this.localObj.getConstant('Double'):
            this.documentEditor.selection.paragraphFormat.lineSpacing = 2;
            break;
        }
        setTimeout((): void => {
            this.documentEditor.focusIn();
        }, 30);
    }
    private setLineSpacing(): void {
        const lineSpacing: number = this.documentEditor.selection.paragraphFormat.lineSpacing;
        if (lineSpacing === 1) {
            this.appliedLineSpacing = this.localObj.getConstant('Single');
        } else if (lineSpacing === 1.15) {
            this.appliedLineSpacing = '1.15';
        } else if (lineSpacing === 1.5) {
            this.appliedLineSpacing = '1.5';
        } else if (lineSpacing === 2) {
            this.appliedLineSpacing = this.localObj.getConstant('Double');
        } else {
            this.appliedLineSpacing = '';
        }
    }
    private selectStyleValue(args: any): void {
        if (this.isRetrieving || !args.isInteracted) {
            return;
        }
        setTimeout((): void => {
            this.applyStyleValue(args);
        }, 10);
    }
    private applyStyleValue(args: any): void {
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.applyStyle(args.itemData.StyleName, true);
        }
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    private rightAlignmentAction(): void {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.toggleTextAlignment('Right');
        }
    }
    private centerAlignmentAction(): void {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.toggleTextAlignment('Center');
        }
    }

    private justifyAction(): void {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.toggleTextAlignment('Justify');
        }
    }
    private increaseIndentAction(): void {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.increaseIndent();
        }
    }
    private decreaseIndentAction(): void {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.decreaseIndent();
        }
    }
    private numberedNoneClick(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editor) {
            this.documentEditor.editor.clearList();
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    private numberedNumberDotClick(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editor) {
            this.appliedNumberingStyle = 'arabic';
            this.documentEditor.editor.applyNumbering('%1.', 'Arabic');
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    private numberedUpRomanClick(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editor) {
            this.appliedNumberingStyle = 'uproman';
            this.documentEditor.editor.applyNumbering('%1.', 'UpRoman');
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    private numberedUpLetterClick(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editor) {
            this.appliedNumberingStyle = 'upletter';
            this.documentEditor.editor.applyNumbering('%1.', 'UpLetter');
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    private numberedLowLetterClick(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editor) {
            this.appliedNumberingStyle = 'lowletter';
            this.documentEditor.editor.applyNumbering('%1.', 'LowLetter');
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    private numberedLowRomanClick(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editor) {
            this.appliedNumberingStyle = 'lowroman';
            this.documentEditor.editor.applyNumbering('%1.', 'LowRoman');
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    private bulletDotClick(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editor) {
            this.appliedBulletStyle = 'dot';
            this.documentEditor.editor.applyBullet('\uf0b7', 'Symbol');
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    private bulletCircleClick(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editor) {
            this.appliedBulletStyle = 'circle';
            this.documentEditor.editor.applyBullet('\uf06f' + '\u0020', 'Symbol');
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    private bulletSquareClick(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editor) {
            this.appliedBulletStyle = 'square';
            this.documentEditor.editor.applyBullet('\uf0a7', 'Wingdings');
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    private bulletFlowerClick(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editor) {
            this.appliedBulletStyle = 'flower';
            this.documentEditor.editor.applyBullet('\uf076', 'Wingdings');
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    private bulletArrowClick(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editor) {
            this.appliedBulletStyle = 'arrow';
            this.documentEditor.editor.applyBullet('\uf0d8', 'Wingdings');
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    private bulletTickClick(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.documentEditor.editor) {
            this.appliedBulletStyle = 'tick';
            this.documentEditor.editor.applyBullet('\uf0fc', 'Wingdings');
            setTimeout((): void => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }
    public onSelectionChange(): void {
        this.isRetrieving = true;
        if (this.documentEditor.editor) {
            //#region paragraph format
            const style: string = this.documentEditor.selection.paragraphFormat.styleName;
            if (style) {
                this.style.value = style;
                this.style.dataBind();
            } else {
                this.style.value = null;
            }
            classList(this.leftAlignment, [], ['e-btn-toggle']);
            classList(this.rightAlignment, [], ['e-btn-toggle']);
            classList(this.centerAlignment, [], ['e-btn-toggle']);
            classList(this.justify, [], ['e-btn-toggle']);
            if (this.documentEditor.selection.paragraphFormat.textAlignment === 'Left') {
                classList(this.leftAlignment, ['e-btn-toggle'], []);
            } else if (this.documentEditor.selection.paragraphFormat.textAlignment === 'Right') {
                classList(this.rightAlignment, ['e-btn-toggle'], []);
            } else if (this.documentEditor.selection.paragraphFormat.textAlignment === 'Center') {
                classList(this.centerAlignment, ['e-btn-toggle'], []);
            } else if (this.documentEditor.selection.paragraphFormat.textAlignment === 'Justify') {
                classList(this.justify, ['e-btn-toggle'], []);
            }
            //#endregion
        }
        this.setLineSpacing();
        this.isRetrieving = false;
    }
    public destroy(): void {
        this.container = undefined;
        if (this.lineSpacing) {
            this.lineSpacing.destroy();
            this.lineSpacing = undefined;
        }
        if (this.style) {
            this.style.destroy();
            this.style = undefined;
        }
        if (this.bulletListBtn) {
            this.bulletListBtn.destroy();
            this.bulletListBtn = undefined;
        }
        if (this.numberedListBtn) {
            this.numberedListBtn.destroy();
            this.numberedListBtn = undefined;
        }
    }
}
