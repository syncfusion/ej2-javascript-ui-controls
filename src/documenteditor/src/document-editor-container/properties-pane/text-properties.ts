/* eslint-disable */
import { createElement, L10n, classList, isNullOrUndefined, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { DocumentEditor, HighlightColor, SelectionCharacterFormat } from '../../document-editor/index';
import { ComboBox } from '@syncfusion/ej2-dropdowns';
import { Button } from '@syncfusion/ej2-buttons';
import { DropDownButton, SplitButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { Query } from '@syncfusion/ej2-data';
import { DocumentEditorContainer } from '../document-editor-container';
import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { FontHelper } from '../helper/font-helper';
/**
 * Text Properties
 *
 * @private
 */
export class Text {
    private container: DocumentEditorContainer;
    private textProperties: HTMLElement;
    private bold: HTMLElement;
    private italic: HTMLElement;
    private underline: HTMLElement;
    private strikethrough: HTMLElement;
    private subscript: HTMLElement;
    private superscript: HTMLElement;
    private boldBtn: Button;
    private italicBtn: Button;
    private underlineBtn: Button;
    private strikethroughBtn: Button;
    private subscriptBtn: Button;
    private superscriptBtn: Button;
    private clearFormatBtn: Button;
    private fontColor: HTMLElement;
    private highlightColor: SplitButton;
    private highlightColorElement: HTMLElement;
    private fontColorInputElement: ColorPicker;
    private highlightColorInputElement: HTMLElement;
    private clearFormat: HTMLElement;
    private fontSize: ComboBox;
    public fontFamily: ComboBox;
    private isRetrieving: boolean = false;
    public appliedHighlightColor: string = 'rgb(255, 255, 0)';
    public localObj: L10n;
    private isRtl: boolean;
    private changeCaseDropdown: DropDownButton;

    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }
    /**
     * Initialize text properties.
     *
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance.
     * @param {boolean} isRtl - Specifies the RTL layout.
     */
    public constructor(container: DocumentEditorContainer, isRtl?: boolean) {
        this.container = container;
        this.isRtl = isRtl;
    }
    public initializeTextPropertiesDiv(wholeDiv: HTMLElement, isRtl?: boolean): void {
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        this.textProperties = wholeDiv;
        const element: string = this.documentEditor.element.id + '_font_properties';
        const textDiv: HTMLElement = this.createDiv(element + '_text', wholeDiv);
        classList(textDiv, ['e-de-cntr-pane-padding', 'e-de-prop-separator-line'], []);
        const fontDiv: HTMLElement = this.createDiv(element + '_sizeStyle', textDiv, 'display:inline-flex;');
        classList(fontDiv, ['e-de-ctnr-segment'], []);
        if (isRtl) {
            classList(fontDiv, ['e-de-ctnr-segment-rtl'], []);
        }
        const fontFamilyDiv: HTMLElement = this.createDiv(element + '_fontFamilyDiv', fontDiv);
        const fontFamily: HTMLElement = createElement('input', {
            id: element + '_fontFamily', className: 'e-prop-font-style'
        });
        fontFamilyDiv.appendChild(fontFamily);
        classList(fontFamilyDiv, ['e-de-panel-left-width'], []);
        this.createDropDownListForFamily(fontFamily);
        const fontSizeDiv: HTMLElement = this.createDiv(element + '_fontSizeDiv', fontDiv);
        let divClassName: string = 'e-de-ctnr-group-btn e-de-char-fmt-btn-left e-btn-group';
        if (isRtl) {
            divClassName = 'e-rtl ' + divClassName;
        }
        const fontSize: HTMLInputElement = createElement('input', {
            id: element + '_fontSize', innerHTML: 'type:number', className: 'e-prop-font-style'
        }) as HTMLInputElement;
        fontSizeDiv.appendChild(fontSize);
        classList(fontSizeDiv, ['e-de-panel-right-width'], []);
        this.createDropDownListForSize(fontSize);

        const propertiesDiv: HTMLElement = createElement('div', {
            id: element + '_properties', styles: 'display:inline-flex;', className: 'e-de-ctnr-segment'
        });
        if (isRtl) {
            classList(propertiesDiv, ['e-de-ctnr-segment-rtl'], []);
        }
        textDiv.appendChild(propertiesDiv);
        const leftDiv: HTMLElement = createElement('div', {
            id: element + '_leftDiv', className: divClassName, styles: 'display:inline-flex;'
        });
        propertiesDiv.appendChild(leftDiv);
        this.bold = this.createButtonTemplate(element + '_bold', 'e-de-ctnr-bold e-icons', leftDiv, 'e-de-prop-font-button', '40.5', 'Bold Tooltip');
        this.italic = this.createButtonTemplate(element + '_italic', 'e-de-ctnr-italic e-icons', leftDiv, 'e-de-prop-font-button', '40.5', 'Italic Tooltip');
        this.underline = this.createButtonTemplate(element + '_underline', 'e-de-ctnr-underline e-icons', leftDiv, 'e-de-prop-font-button', '40.5', 'Underline Tooltip');
        this.strikethrough = this.createButtonTemplate(element + '_strikethrough', 'e-de-ctnr-strikethrough e-icons', leftDiv, 'e-de-prop-font-last-button', '40.5', 'Strikethrough');
        divClassName = 'e-de-ctnr-group-btn e-de-char-fmt-btn-right e-btn-group';
        if (isRtl) {
            divClassName = 'e-rtl ' + divClassName;
        }
        const rightDiv: HTMLElement = createElement('div', { id: element + '_rightDiv', className: divClassName, styles: 'display:inline-flex;' });
        propertiesDiv.appendChild(rightDiv);
        this.superscript = this.createButtonTemplate(element + '_superscript', 'e-de-ctnr-superscript e-icons', rightDiv, 'e-de-prop-font-button', '38.5', 'Superscript Tooltip');
        this.subscript = this.createButtonTemplate(element + '_subscript', 'e-de-ctnr-subscript e-icons', rightDiv, 'e-de-prop-font-last-button', '38.5', 'Subscript Tooltip');
        const colorDiv: HTMLElement = createElement('div', {
            id: element + '_colorDiv', styles: 'display:inline-flex;', className: 'e-de-ctnr-segment'
        });
        if (isRtl) {
            classList(propertiesDiv, ['e-de-ctnr-segment-rtl'], []);
        }

        const leftDiv2: HTMLElement = createElement('div', { id: element + '_color', className: 'e-de-font-clr-picker e-de-ctnr-group-btn', styles: 'display:inline-flex;' });
        if (isRtl) {
            classList(leftDiv2, ['e-rtl'], []);
        }
        colorDiv.appendChild(leftDiv2);
        textDiv.appendChild(colorDiv);
        this.fontColor = this.createFontColorPicker(element + '_textColor', 40.5, leftDiv2, this.localObj.getConstant('Font color'));
        classList(leftDiv2.firstElementChild.lastElementChild.lastElementChild.firstChild as HTMLElement, ['e-de-ctnr-fontcolor', 'e-icons'], ['e-caret']);
        this.initializeHighlightColorElement();
        this.highlightColor = this.createHighlightColorSplitButton(element + '_highlightColor', 34.5, leftDiv2, this.localObj.getConstant('Text highlight color'));
        classList(this.highlightColor.element.nextElementSibling.firstElementChild, ['e-de-ctnr-highlight', 'e-icons'], ['e-caret']);
        this.highlightColorInputElement = this.highlightColor.element.firstChild as HTMLElement;
        this.clearFormat = this.createButtonTemplate(element + '_clearFormat', 'e-de-ctnr-clearall e-icons', leftDiv2, 'e-de-prop-font-last-button', '40.5', 'Clear all formatting');
        const rightDiv2: HTMLElement = createElement('div', {
            id: element + '_rightDiv2', className: divClassName.replace('e-btn-group', ''), styles: 'display:inline-flex;'
        });
        if (isRtl) {
            classList(rightDiv2, ['e-rtl'], []);
        }
        rightDiv2.setAttribute('title', this.container.localObj.getConstant('Change case Tooltip'));
        textDiv.appendChild(rightDiv2);
        this.createChangecase(rightDiv2);
    }
    private createChangecase = (container: HTMLElement): void => {
        const items: ItemModel[] = FontHelper.getChangeCaseItems(this.localObj, container.id);
        this.changeCaseDropdown = new DropDownButton({
            items: items,
            iconCss: 'e-icons e-de-ctnr-change-case',
            enableRtl: this.isRtl
        });
        const changeCaseContainer: HTMLElement = createElement('div', {
            id: container.id + '_changeCase', className: 'e-de-ctnr-group-btn'
        });
        const buttonElement: HTMLButtonElement = createElement('button', {
            id: changeCaseContainer.id + '_dropdownBtn',
            attrs: { type: 'button' }
        }) as HTMLButtonElement;
        changeCaseContainer.appendChild(buttonElement);
        container.appendChild(changeCaseContainer);
        this.changeCaseDropdown.appendTo(buttonElement);
    }

    private createHighlightColorSplitButton(id: string, width: number, divElement: HTMLElement, toolTipText: string): SplitButton {
        const buttonElement: HTMLButtonElement = createElement('button', { id: id, attrs: { type: 'button' } }) as HTMLButtonElement;
        // buttonElement.style.width = width + 'px';
        // buttonElement.style.padding = '1px';
        // buttonElement.style.height = 30 + 'px';
        divElement.appendChild(buttonElement);
        const hgltSplitObj: SplitButton = new SplitButton({
            cssClass: 'e-de-btn-hghlclr',
            iconCss: 'e-de-ctnr-hglt-color',
            /* eslint-disable-next-line max-len */
            target: this.highlightColorElement, close: this.closePopup.bind(this), beforeOpen: this.openPopup.bind(this), enableRtl: this.isRtl
        });
        hgltSplitObj.appendTo(buttonElement);
        hgltSplitObj.click = (): void => {
            this.applyHighlightColor(this.highlightColorInputElement.style.backgroundColor);
        };
        (hgltSplitObj.element.firstChild as HTMLElement).style.backgroundColor = 'rgb(255, 255, 0)';
        hgltSplitObj.element.parentElement.setAttribute('title', toolTipText);
        hgltSplitObj.element.parentElement.setAttribute('aria-label', toolTipText);
        return hgltSplitObj;
    }
    private openPopup(): void {
        this.highlightColorElement.style.display = 'block';
    }
    private closePopup(): void {
        this.highlightColorElement.style.display = 'none';
    }
    private initializeHighlightColorElement(): void {
        this.highlightColorElement = createElement('div', {
            styles: 'display:none;width:157px',
            className: 'e-de-cntr-highlight-pane'
        });
        const yellowDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#ffff00', 'yellowDiv');
        const brightGreenDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#00ff00', 'brightGreenDiv');
        const turquoiseDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#00ffff', 'turquoiseDiv');
        const hotPinkDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#ff00ff', 'hotPinkDiv');
        const blueDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#0000ff', 'blueDiv');
        const redDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#ff0000', 'redDiv');
        const darkBlueDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#000080', 'darkBlueDiv');
        const tealDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#008080', 'tealDiv');
        const greenDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#008000', 'greenDiv');
        const violetDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#800080', 'violetDiv');
        const darkRedDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#800000', 'darkRedDiv');
        const darkYellowDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#808000', 'darkYellowDiv');
        const gray50Div: HTMLDivElement = this.createHightlighColorPickerDiv('#808080', 'gray50Div');
        const gray25Div: HTMLDivElement = this.createHightlighColorPickerDiv('#c0c0c0', 'gray25Div');
        const blackDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#000000', 'blackDiv');
        const nocolor: HTMLElement = createElement('div', { className: 'e-hglt-no-color' });
        this.highlightColorElement.appendChild(nocolor);
        const nocolorDiv: HTMLElement = createElement('div', { styles: 'width:24px;height:24px;background-color:#ffffff;margin:3px;', id: 'noColorDiv' });
        nocolor.appendChild(nocolorDiv);
        const nocolorDivValue: HTMLElement = createElement('div', { innerHTML: this.localObj.getConstant('No color'), className: 'e-de-ctnr-hglt-no-color' });
        nocolorDiv.appendChild(nocolorDivValue);
        yellowDiv.addEventListener('click', this.onHighLightColor.bind(this));
        brightGreenDiv.addEventListener('click', this.onHighLightColor.bind(this));
        turquoiseDiv.addEventListener('click', this.onHighLightColor.bind(this));
        hotPinkDiv.addEventListener('click', this.onHighLightColor.bind(this));
        blueDiv.addEventListener('click', this.onHighLightColor.bind(this));
        redDiv.addEventListener('click', this.onHighLightColor.bind(this));
        darkBlueDiv.addEventListener('click', this.onHighLightColor.bind(this));
        tealDiv.addEventListener('click', this.onHighLightColor.bind(this));
        greenDiv.addEventListener('click', this.onHighLightColor.bind(this));
        violetDiv.addEventListener('click', this.onHighLightColor.bind(this));
        darkRedDiv.addEventListener('click', this.onHighLightColor.bind(this));
        darkYellowDiv.addEventListener('click', this.onHighLightColor.bind(this));
        gray50Div.addEventListener('click', this.onHighLightColor.bind(this));
        gray25Div.addEventListener('click', this.onHighLightColor.bind(this));
        blackDiv.addEventListener('click', this.onHighLightColor.bind(this));
        nocolor.addEventListener('click', this.onHighLightColor.bind(this));
    }
    private createHightlighColorPickerDiv(backgroundColor: string, id: string): HTMLDivElement {
        const colorDiv: HTMLDivElement = createElement('div', { className: 'e-de-ctnr-hglt-btn', id: id }) as HTMLDivElement;
        colorDiv.style.backgroundColor = backgroundColor;
        this.highlightColorElement.appendChild(colorDiv);
        return colorDiv;
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private onHighLightColor(event: any): void {
        if (this.documentEditor.selectionModule) {
            this.applyHighlightColor(event.currentTarget.style.backgroundColor);
            this.highlightColor.toggle();
        }
    }
    private applyHighlightColorAsBackground(color: HighlightColor): void {
        this.removeSelectedColorDiv();
        if (color === 'NoColor') {
            this.highlightColorElement.querySelector('#noColorDiv').classList.add('e-color-selected');
        } else if (color === 'Yellow') {
            this.highlightColorElement.querySelector('#yellowDiv').classList.add('e-color-selected');
        } else if (color === 'BrightGreen') {
            this.highlightColorElement.querySelector('#brightGreenDiv').classList.add('e-color-selected');
        } else if (color === 'Turquoise') {
            this.highlightColorElement.querySelector('#turquoiseDiv').classList.add('e-color-selected');
        } else if (color === 'Pink') {
            this.highlightColorElement.querySelector('#hotPinkDiv').classList.add('e-color-selected');
        } else if (color === 'Red') {
            this.highlightColorElement.querySelector('#redDiv').classList.add('e-color-selected');
        } else if (color === 'DarkBlue') {
            this.highlightColorElement.querySelector('#darkBlueDiv').classList.add('e-color-selected');
        } else if (color === 'Teal') {
            this.highlightColorElement.querySelector('#tealDiv').classList.add('e-color-selected');
        } else if (color === 'Green') {
            this.highlightColorElement.querySelector('#greenDiv').classList.add('e-color-selected');
        } else if (color === 'Violet') {
            this.highlightColorElement.querySelector('#violetDiv').classList.add('e-color-selected');
        } else if (color === 'DarkRed') {
            this.highlightColorElement.querySelector('#darkRedDiv').classList.add('e-color-selected');
        } else if (color === 'DarkYellow') {
            this.highlightColorElement.querySelector('#darkYellowDiv').classList.add('e-color-selected');
        } else if (color === 'Gray50') {
            this.highlightColorElement.querySelector('#gray50Div').classList.add('e-color-selected');
        } else if (color === 'Gray25') {
            this.highlightColorElement.querySelector('#gray25Div').classList.add('e-color-selected');
        } else if (color === 'Black') {
            this.highlightColorElement.querySelector('#blackDiv').classList.add('e-color-selected');
        } else if (color === 'Blue') {
            this.highlightColorElement.querySelector('#blueDiv').classList.add('e-color-selected');
        }
    }
    private removeSelectedColorDiv(): void {
        this.highlightColorElement.querySelector('#noColorDiv').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#yellowDiv').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#brightGreenDiv').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#turquoiseDiv').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#hotPinkDiv').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#redDiv').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#darkBlueDiv').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#tealDiv').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#greenDiv').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#violetDiv').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#darkRedDiv').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#darkYellowDiv').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#gray50Div').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#gray25Div').classList.remove('e-color-selected');
        this.highlightColorElement.querySelector('#blackDiv').classList.remove('e-color-selected');
    }
    private applyHighlightColor(color: string): void {
        this.appliedHighlightColor = FontHelper.applyHighlightColor(this.documentEditor, color);
    }
    private getHighLightColor(color: string): HighlightColor {
        return FontHelper.getHighlightColor(color);
    }
    private createDiv(id: string, parentDiv: HTMLElement, style?: string): HTMLElement {
        let div: HTMLElement;
        if (style) {
            div = createElement('div', { id: id, styles: style });
        } else {
            div = createElement('div', { id: id });
        }
        parentDiv.appendChild(div);
        return div;

    }
    /* eslint-disable-next-line max-len */
    private createButtonTemplate(id: string, iconcss: string, div: HTMLElement, buttonClass: string, width: string, toolTipText: string): HTMLButtonElement {
        const button: HTMLButtonElement = createElement('Button', { id: id, attrs: { type: 'button' } }) as HTMLButtonElement;
        // button.style.width = width + 'px';
        // buttonElement.style.height = 32 + 'px';
        div.appendChild(button);
        const btn: Button = new Button({
            cssClass: buttonClass, iconCss: iconcss, enableRtl: this.isRtl
        });
        btn.appendTo(button);
        button.setAttribute('title', this.localObj.getConstant(toolTipText));
        button.setAttribute('aria-label', this.localObj.getConstant(toolTipText));
        button.setAttribute('aria-pressed', 'false');
        switch (toolTipText) {
            case 'Bold Tooltip':
                this.boldBtn = btn;
                break;
            case 'Italic Tooltip':
                this.italicBtn = btn;
                break;
            case 'Underline Tooltip':
                this.underlineBtn = btn;
                break;
            case 'Strikethrough':
                this.strikethroughBtn = btn;
                break;
            case 'Superscript Tooltip':
                this.superscriptBtn = btn;
                break;
            case 'Subscript Tooltip':
                this.subscriptBtn = btn;
                break;
            default:
                this.clearFormatBtn = btn;
        }
        return button;
    }
    private createFontColorPicker(id: string, width: number, divElement: HTMLElement, toolTipText: string): HTMLInputElement {
        const { columns, createPopupOnClick, cssClass, disabled, enablePersistence, inline, mode, modeSwitcher, noColor, presetColors, showButtons } = this.documentEditor.documentEditorSettings.colorPickerSettings;
        const inputElement: HTMLInputElement = createElement('input', { id: id, attrs: { 'type': 'color' } }) as HTMLInputElement;
        inputElement.style.width = width + 'px';
        divElement.appendChild(inputElement);

        this.fontColorInputElement = new ColorPicker({ value: '#000000', enableRtl: this.isRtl, locale: this.container.locale, enableOpacity: false, mode: mode, modeSwitcher: modeSwitcher, showButtons: showButtons, columns: columns, createPopupOnClick: createPopupOnClick, cssClass: cssClass, disabled: disabled, enablePersistence: enablePersistence, inline: inline, noColor: noColor, presetColors: presetColors }, inputElement);
        this.fontColorInputElement.element.parentElement.setAttribute('title', toolTipText);
        this.fontColorInputElement.element.parentElement.setAttribute('aria-label', toolTipText);
        this.documentEditor.documentHelper.fontColorInputElement = this.fontColorInputElement;
        return inputElement;
    }

    private createDropDownListForSize(fontSelectElement: HTMLElement): void {
        this.fontSize = new ComboBox({
            dataSource: FontHelper.getFontSizeItems(), popupHeight: '180px',
            popupWidth: '80px',
            cssClass: 'e-de-prop-dropdown',
            allowCustom: true,
            showClearButton: false,
            enableRtl: this.isRtl
        });
        this.fontSize.focus = (): void => {
            this.isRetrieving = false; (this.fontSize.element as HTMLInputElement).select();
        };
        const format: SelectionCharacterFormat = this.documentEditor.selectionModule.characterFormat;
        this.fontSize.value = (format.bidi || format.complexScript) ? format.fontSizeBidi.toString() : format.fontSize.toString();
        this.fontSize.appendTo(fontSelectElement);
        this.fontSize.element.parentElement.setAttribute('title', this.localObj.getConstant('Font Size'));
    }

    private createDropDownListForFamily(fontSelectElement: HTMLElement): void {
        /* eslint-disable */
        let fontStyle: { [key: string]: any }[];
        let isStringTemplate: boolean = false;
        let itemTemplate: string | Function = '';
        if (!this.container.enableCsp) {
            itemTemplate = initializeCSPTemplate(
                function (data: any): string { return `<span style="font-family: ${data.FontName};">${data.FontName}</span>`; }
            );
            isStringTemplate = true;
        }
        this.fontFamily = new ComboBox({
            dataSource: fontStyle,
            query: new Query().select(['FontName']),
            fields: { text: 'FontName', value: 'FontValue' },
            popupHeight: '150px',
            cssClass: 'e-de-prop-dropdown',
            allowCustom: true,
            showClearButton: false,
            enableRtl: this.isRtl,
            itemTemplate: itemTemplate
        });
        this.fontFamily.appendTo(fontSelectElement);
        this.fontFamily.isStringTemplate = isStringTemplate;
        const fontFamilyValue: string[] = this.container.documentEditorSettings.fontFamilies;
        for (let i: number = 0; i < fontFamilyValue.length; i++) {
            const fontValue: string = fontFamilyValue[i];
            const fontStyleValue: { [key: string]: any } = { 'FontName': fontValue, 'FontValue': fontValue };
            this.fontFamily.addItem(fontStyleValue, i);
        }
        this.fontFamily.focus = (): void => {
            this.isRetrieving = false; (this.fontFamily.element as HTMLInputElement).select();
        };
        this.fontFamily.element.parentElement.setAttribute('title', this.localObj.getConstant('Font'));
    }
    /* eslint-enable */
    public wireEvent(): void {
        this.fontFamily.addEventListener('change', (): void => {
            this.changeFontFamily();
        });
        this.fontSize.addEventListener('change', (): void => {
            this.changeFontSize();
        });
        this.bold.addEventListener('click', (): void => {
            this.isRetrieving = false; this.boldAction();
        });
        this.italic.addEventListener('click', (): void => {
            this.isRetrieving = false; this.italicAction();
        });
        this.underline.addEventListener('click', (): void => {
            this.isRetrieving = false; this.underlineAction();
        });
        this.strikethrough.addEventListener('click', (): void => {
            this.isRetrieving = false; this.strikethroughAction();
        });
        this.superscript.addEventListener('click', (): void => {
            this.isRetrieving = false; this.superscriptAction();
        });
        this.subscript.addEventListener('click', (): void => {
            this.isRetrieving = false; this.subscriptAction();
        });
        this.fontColorInputElement.addEventListener('change', (args: ColorPickerEventArgs): void => {
            this.isRetrieving = false; this.changeFontColor(args);
        });
        this.clearFormat.addEventListener('click', (): void => {
            this.isRetrieving = false; this.clearFormatAction();
        });
        this.changeCaseDropdown.addEventListener('select', (args: MenuEventArgs): void => {
            this.isRetrieving = false; this.changeCase(args);
        });
    }
    public unwireEvents(): void {
        this.fontFamily.change = undefined;
        this.fontSize.change = undefined;
        this.bold.click = undefined;
        this.italic.click = undefined;
        this.underline.click = undefined;
        this.strikethrough.click = undefined;
        this.superscript.click = undefined;
        this.subscript.click = undefined;
        this.fontColorInputElement.change = undefined;
        this.highlightColorElement.click = undefined;
        this.highlightColor.click = undefined;
        this.clearFormat.click = undefined;
        this.changeCaseDropdown.select = undefined;
    }
    private boldAction(): void {
        if (this.isRetrieving) {
            return;
        }
        FontHelper.applyFontFormatting(this.documentEditor, 'bold');
    }

    // Replace italicAction method with:
    private italicAction(): void {
        if (this.isRetrieving) {
            return;
        }
        FontHelper.applyFontFormatting(this.documentEditor, 'italic');
    }

    // Replace underlineAction method with:
    private underlineAction(): void {
        if (this.isRetrieving) {
            return;
        }
        FontHelper.applyFontFormatting(this.documentEditor, 'underline');
    }

    // Replace strikethroughAction method with:
    private strikethroughAction(): void {
        if (this.isRetrieving) {
            return;
        }
        FontHelper.applyFontFormatting(this.documentEditor, 'strikethrough');
    }

    // Replace superscriptAction method with:
    private superscriptAction(): void {
        if (this.isRetrieving) {
            return;
        }
        FontHelper.applyFontFormatting(this.documentEditor, 'superscript');
    }

    // Replace subscriptAction method with:
    private subscriptAction(): void {
        if (this.isRetrieving) {
            return;
        }
        FontHelper.applyFontFormatting(this.documentEditor, 'subscript');
    }

    // Replace clearFormatAction method with:
    private clearFormatAction(): void {
        if (this.isRetrieving) {
            return;
        }
        FontHelper.applyFontFormatting(this.documentEditor, 'clearFormat');
    }

    // Replace changeCase method with:
    private changeCase(args: MenuEventArgs): void {
        if (this.isRetrieving) {
            return;
        }
        FontHelper.applyChangeCase(this.documentEditor, this.localObj, args.item.text);
    }

    // Replace changeFontFamily method with:
    private changeFontFamily(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.fontFamily.value !== '') {
            setTimeout((): void => {
                FontHelper.changeFontFamily(this.documentEditor, SanitizeHtmlHelper.sanitize(this.fontFamily.value as string));
            }, 10);
            this.documentEditor.focusIn();
        }
    }

    // Replace changeFontSize method with:
    private changeFontSize(): void {
        if (this.isRetrieving) {
            return;
        }
        if (this.fontSize.value !== '') {
            setTimeout((): void => {
                FontHelper.changeFontSize(this.documentEditor, this.fontSize.value as number);
            }, 10);
            this.documentEditor.focusIn();
        }
    }

    // Replace changeFontColor method with:
    private changeFontColor(arg: ColorPickerEventArgs): void {
        if (this.isRetrieving) {
            return;
        }
        FontHelper.changeFontColor(this.documentEditor, arg.currentValue.hex);
        setTimeout((): void => {
            this.documentEditor.focusIn();
        }, 30);
    }
    public onSelectionChange(): void {
        this.isRetrieving = true;
        if (this.documentEditor.selectionModule) {
            //#region character format
            if (this.documentEditor.selectionModule.characterFormat.fontFamily) {
                let fontFamily: string;
                if (!isNullOrUndefined(this.documentEditor.selectionModule.characterFormat.renderedFontFamily)
                    && !isNullOrUndefined(this.documentEditor.selectionModule.characterFormat.fontFamily)) {
                    fontFamily = this.documentEditor.selectionModule.characterFormat.renderedFontFamily;
                } else {
                    fontFamily = this.documentEditor.selectionModule.characterFormat.fontFamily;
                }
                this.fontFamily.value = fontFamily;
                this.fontFamily.dataBind();
                if (isNullOrUndefined(this.fontFamily.getDataByValue(fontFamily))) {
                    const fontStyleValue: { [key: string]: any } = { 'FontName': fontFamily, 'FontValue': fontFamily };
                    this.fontFamily.addItem(fontStyleValue);
                }
            } else {
                this.fontFamily.value = '';
            }
            if (this.documentEditor.selectionModule.characterFormat.fontSize) {
                const format: SelectionCharacterFormat = this.documentEditor.selectionModule.characterFormat;
                this.fontSize.value = (format.bidi || format.complexScript) ? (!isNullOrUndefined(format.fontSizeBidi) ? format.fontSizeBidi.toString() : '') : format.fontSize.toString();
                this.fontSize.dataBind();
            } else {
                this.fontSize.value = '';
            }
            if (this.documentEditor.selectionModule.characterFormat.bold) {
                if (!this.bold.classList.contains('e-btn-toggle')) {
                    this.bold.classList.add('e-btn-toggle');
                    this.bold.setAttribute('aria-pressed', 'true');
                }
            } else {
                if (this.bold.classList.contains('e-btn-toggle')) {
                    this.bold.classList.remove('e-btn-toggle');
                    this.bold.setAttribute('aria-pressed', 'false');
                }
            }
            if (this.documentEditor.selectionModule.characterFormat.italic) {
                if (!this.italic.classList.contains('e-btn-toggle')) {
                    this.italic.classList.add('e-btn-toggle');
                    this.italic.setAttribute('aria-pressed', 'true');
                }
            } else {
                if (this.italic.classList.contains('e-btn-toggle')) {
                    this.italic.classList.remove('e-btn-toggle');
                    this.italic.setAttribute('aria-pressed', 'false');
                }
            }
            if (this.documentEditor.selectionModule.characterFormat.underline
                && this.documentEditor.selectionModule.characterFormat.underline !== 'None') {
                if (!this.underline.classList.contains('e-btn-toggle')) {
                    this.underline.classList.add('e-btn-toggle');
                    this.underline.setAttribute('aria-pressed', 'true');
                }
            } else {
                if (this.underline.classList.contains('e-btn-toggle')) {
                    this.underline.classList.remove('e-btn-toggle');
                    this.underline.setAttribute('aria-pressed', 'false');
                }
            }
            if (this.documentEditor.selectionModule.characterFormat.strikethrough
                && this.documentEditor.selectionModule.characterFormat.strikethrough !== 'None') {
                if (!this.strikethrough.classList.contains('e-btn-toggle')) {
                    this.strikethrough.classList.add('e-btn-toggle');
                    this.strikethrough.setAttribute('aria-pressed', 'true');
                }
            } else {
                if (this.strikethrough.classList.contains('e-btn-toggle')) {
                    this.strikethrough.classList.remove('e-btn-toggle');
                    this.strikethrough.setAttribute('aria-pressed', 'false');
                }
            }
            if (this.documentEditor.selectionModule.characterFormat.baselineAlignment
                && this.documentEditor.selectionModule.characterFormat.baselineAlignment === 'Subscript') {
                if (!this.subscript.classList.contains('e-btn-toggle')) {
                    this.subscript.classList.add('e-btn-toggle');
                    this.subscript.setAttribute('aria-pressed', 'true');
                }
            } else {
                if (this.subscript.classList.contains('e-btn-toggle')) {
                    this.subscript.classList.remove('e-btn-toggle');
                    this.subscript.setAttribute('aria-pressed', 'false');
                }
            }
            if (this.documentEditor.selectionModule.characterFormat.baselineAlignment
                && this.documentEditor.selectionModule.characterFormat.baselineAlignment === 'Superscript') {
                if (!this.superscript.classList.contains('e-btn-toggle')) {
                    this.superscript.classList.add('e-btn-toggle');
                    this.superscript.setAttribute('aria-pressed', 'true');
                }
            } else {
                if (this.superscript.classList.contains('e-btn-toggle')) {
                    this.superscript.classList.remove('e-btn-toggle');
                    this.superscript.setAttribute('aria-pressed', 'false');
                }
            }
            if (this.documentEditor.selectionModule.characterFormat.fontColor) {
                let fontColor: string = this.documentEditor.selectionModule.characterFormat.fontColor;
                // "empty" is old value used for auto color till v19.2.49. It is maintained for backward compatibility.
                if (fontColor === 'empty' || fontColor === '#00000000') {
                    fontColor = '#000000';
                }
                this.fontColorInputElement.value = fontColor;
            }
            if (this.documentEditor.selectionModule.characterFormat.highlightColor) {
                this.highlightColorInputElement.style.backgroundColor = this.appliedHighlightColor;
                this.applyHighlightColorAsBackground(this.documentEditor.selectionModule.characterFormat.highlightColor);
            }
            //#endregion
        }
    }
    public removeHTMLElement(): void {
        this.bold.remove();
        this.bold = null;
        this.italic.remove();
        this.italic = null;
        this.underline.remove();
        this.underline = null;
        this.strikethrough.remove();
        this.strikethrough = null;
        this.subscript.remove();
        this.subscript = null;
        this.superscript.remove();
        this.superscript = null;
        this.clearFormat.remove();
        this.clearFormat = null;
        this.fontColor.remove();
        this.fontColor = null;
        this.highlightColorInputElement.childNodes.forEach((element: HTMLElement) => {
            this.highlightColorInputElement.removeChild(element);
        });
        this.highlightColorInputElement.remove();
        this.highlightColorInputElement = null;
        this.highlightColorElement.childNodes.forEach((element: HTMLElement) => {
            this.highlightColorElement.removeChild(element);
        });
        this.highlightColorElement.remove();
        this.highlightColorElement = null;
    }
    public destroy(): void {
        this.unwireEvents();
        this.removeHTMLElement();
        if (this.highlightColor) {
            this.highlightColor.destroy();
            this.highlightColor = undefined;
        }
        if (this.fontColorInputElement) {
            this.fontColorInputElement.destroy();
            this.fontColorInputElement.element.remove();
            this.fontColorInputElement.element = null;
            this.fontColorInputElement = undefined;
        }
        if (this.fontSize) {
            this.fontSize.destroy();
            if (this.fontSize.element) {
                this.fontSize.element.remove();
                this.fontSize.element = undefined;
            }
            this.fontSize = undefined;
        }
        if (this.fontFamily) {
            this.fontFamily.destroy();
            if (this.fontFamily.element) {
                this.fontFamily.element.remove();
                this.fontFamily.element = undefined;
            }
            this.fontFamily = undefined;
        }
        if (this.changeCaseDropdown) {
            this.changeCaseDropdown.destroy();
            this.changeCaseDropdown = undefined;
        }
        if (this.boldBtn) {
            this.boldBtn.destroy();
            this.boldBtn = undefined;
        }
        if (this.italicBtn) {
            this.italicBtn.destroy();
            this.italicBtn = undefined;
        }
        if (this.underlineBtn) {
            this.underlineBtn.destroy();
            this.underlineBtn = undefined;
        }
        if (this.strikethroughBtn) {
            this.strikethroughBtn.destroy();
            this.strikethroughBtn = undefined;
        }
        if (this.subscriptBtn) {
            this.subscriptBtn.destroy();
            this.subscriptBtn = undefined;
        }
        if (this.superscriptBtn) {
            this.superscriptBtn.destroy();
            this.superscriptBtn = undefined;
        }
        if (this.clearFormatBtn) {
            this.clearFormatBtn.destroy();
            this.clearFormatBtn = undefined;
        }
        this.container = undefined;
    }
}
