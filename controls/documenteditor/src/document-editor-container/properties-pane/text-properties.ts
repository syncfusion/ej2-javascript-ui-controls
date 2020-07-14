import { createElement, L10n, classList } from '@syncfusion/ej2-base';
import { DocumentEditor, HighlightColor } from '../../document-editor/index';
import { ComboBox } from '@syncfusion/ej2-dropdowns';
import { Button } from '@syncfusion/ej2-buttons';
import { SplitButton } from '@syncfusion/ej2-splitbuttons';
import { ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { Query } from '@syncfusion/ej2-data';
import { DocumentEditorContainer } from '../document-editor-container';
/**
 * Text Properties
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
    private fontColor: HTMLElement;
    private highlightColor: SplitButton;
    private highlightColorElement: HTMLElement;
    private fontColorInputElement: ColorPicker;
    private highlightColorInputElement: HTMLElement;
    private clearFormat: HTMLElement;
    private fontSize: ComboBox;
    private fontFamily: ComboBox;
    private isRetrieving: boolean = false;
    public appliedHighlightColor: string = 'rgb(255, 255, 0)';
    public localObj: L10n;
    private isRtl: boolean;

    get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    constructor(container: DocumentEditorContainer, isRtl?: boolean) {
        this.container = container;
        this.isRtl = isRtl;
    }

    public initializeTextPropertiesDiv(wholeDiv: HTMLElement, isRtl?: boolean): void {
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        this.textProperties = wholeDiv;
        let element: string = 'font_properties';
        let textDiv: HTMLElement = this.createDiv(element + '_text', wholeDiv);
        classList(textDiv, ['e-de-cntr-pane-padding', 'e-de-prop-separator-line'], []);
        let label: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label' });
        label.innerHTML = this.localObj.getConstant('Text');
        textDiv.appendChild(label);
        let fontDiv: HTMLElement = this.createDiv(element + '_sizeStyle', textDiv, 'display:inline-flex;');
        classList(fontDiv, ['e-de-ctnr-segment'], []);
        if (isRtl) {
            classList(fontDiv, ['e-de-ctnr-segment-rtl'], []);
        }
        let fontFamilyDiv: HTMLElement = this.createDiv(element + '_fontFamilyDiv', fontDiv);
        let fontFamily: HTMLElement = createElement('input', {
            id: element + '_fontFamily',
            className: 'e-prop-font-style'
        });
        fontFamilyDiv.appendChild(fontFamily);
        classList(fontFamilyDiv, ['e-de-panel-left-width'], []);
        this.createDropDownListForFamily(fontFamily);
        let fontSizeDiv: HTMLElement = this.createDiv(element + '_fontSizeDiv', fontDiv);
        let divClassName: string = 'e-de-ctnr-group-btn e-de-char-fmt-btn-left e-btn-group';
        if (isRtl) {
            divClassName = 'e-rtl ' + divClassName;
        }
        let fontSize: HTMLInputElement = createElement('input', {
            id: element + '_fontSize',
            innerHTML: 'type:number',
            className: 'e-prop-font-style',
        }) as HTMLInputElement;
        fontSizeDiv.appendChild(fontSize);
        classList(fontSizeDiv, ['e-de-panel-right-width'], []);
        this.createDropDownListForSize(fontSize);

        let propertiesDiv: HTMLElement = createElement('div', {
            id: element + '_properties',
            styles: 'display:inline-flex;',
            className: 'e-de-ctnr-segment'
        });
        if (isRtl) {
            classList(propertiesDiv, ['e-de-ctnr-segment-rtl'], []);
        }
        textDiv.appendChild(propertiesDiv);
        let leftDiv: HTMLElement = createElement('div', {
            id: element + '_leftDiv',
            className: divClassName, styles: 'display:inline-flex;'
        });
        propertiesDiv.appendChild(leftDiv);
        // tslint:disable-next-line:max-line-length
        this.bold = this.createButtonTemplate(element + '_bold', 'e-de-ctnr-bold e-icons', leftDiv, 'e-de-prop-font-button', '40.5', this.localObj.getConstant('Bold Tooltip'));
        // tslint:disable-next-line:max-line-length
        this.italic = this.createButtonTemplate(element + '_italic', 'e-de-ctnr-italic e-icons', leftDiv, 'e-de-prop-font-button', '40.5', this.localObj.getConstant('Italic Tooltip'));
        // tslint:disable-next-line:max-line-length
        this.underline = this.createButtonTemplate(element + '_underline', 'e-de-ctnr-underline e-icons', leftDiv, 'e-de-prop-font-button', '40.5', this.localObj.getConstant('Underline Tooltip'));
        // tslint:disable-next-line:max-line-length
        this.strikethrough = this.createButtonTemplate(element + '_strikethrough', 'e-de-ctnr-strikethrough e-icons', leftDiv, 'e-de-prop-font-last-button', '40.5', this.localObj.getConstant('Strikethrough'));
        divClassName = 'e-de-ctnr-group-btn e-de-char-fmt-btn-right e-btn-group';
        if (isRtl) {
            divClassName = 'e-rtl ' + divClassName;
        }
        // tslint:disable-next-line:max-line-length
        let rightDiv: HTMLElement = createElement('div', { id: element + '_rightDiv', className: divClassName, styles: 'display:inline-flex;' });
        propertiesDiv.appendChild(rightDiv);
        // tslint:disable-next-line:max-line-length
        this.superscript = this.createButtonTemplate(element + '_superscript', 'e-de-ctnr-superscript e-icons', rightDiv, 'e-de-prop-font-button', '38.5', this.localObj.getConstant('Superscript Tooltip'));
        // tslint:disable-next-line:max-line-length
        this.subscript = this.createButtonTemplate(element + '_subscript', 'e-de-ctnr-subscript e-icons', rightDiv, 'e-de-prop-font-last-button', '38.5', this.localObj.getConstant('Subscript Tooltip'));
        // tslint:disable-next-line:max-line-length
        let leftDiv2: HTMLElement = createElement('div', { id: element + '_color', className: 'e-de-font-clr-picker e-de-ctnr-group-btn', styles: 'display:inline-flex;' });
        if (isRtl) {
            classList(leftDiv2, ['e-rtl'], []);
        }
        textDiv.appendChild(leftDiv2);
        // tslint:disable-next-line:max-line-length
        this.fontColor = this.createFontColorPicker(element + '_textColor', 40.5, leftDiv2, this.localObj.getConstant('Font color'));
        classList(leftDiv2.firstElementChild.lastElementChild.lastElementChild.firstChild as HTMLElement, ['e-de-ctnr-fontcolor', 'e-icons'], ['e-caret']);
        this.initializeHighlightColorElement();
        // tslint:disable-next-line:max-line-length
        this.highlightColor = this.createHighlightColorSplitButton(element + '_highlightColor', 34.5, leftDiv2, this.localObj.getConstant('Text highlight color'));
        classList(this.highlightColor.element.nextElementSibling.firstElementChild, ['e-de-ctnr-highlight', 'e-icons'], ['e-caret']);
        this.highlightColorInputElement = this.highlightColor.element.firstChild as HTMLElement;
        // tslint:disable-next-line:max-line-length
        this.clearFormat = this.createButtonTemplate(element + '_clearFormat', 'e-de-ctnr-clearall e-icons', leftDiv2, 'e-de-prop-font-last-button', '40.5', this.localObj.getConstant('Clear all formatting'));
    }
    private createHighlightColorSplitButton = (id: string, width: number, divElement: HTMLElement, toolTipText: string): SplitButton => {
        let buttonElement: HTMLButtonElement = createElement('button', { id: id, attrs: { type: 'button' } }) as HTMLButtonElement;
        // buttonElement.style.width = width + 'px';
        // buttonElement.style.padding = '1px';
        // buttonElement.style.height = 30 + 'px';
        divElement.appendChild(buttonElement);
        let hgltSplitObj: SplitButton = new SplitButton({
            cssClass: 'e-de-btn-hghlclr',
            iconCss: 'e-de-ctnr-hglt-color',
            target: this.highlightColorElement, close: this.closePopup, beforeOpen: this.openPopup, enableRtl: this.isRtl
        });
        hgltSplitObj.appendTo(buttonElement);
        hgltSplitObj.click = (): void => {
            this.applyHighlightColor(this.highlightColorInputElement.style.backgroundColor);
        };
        (hgltSplitObj.element.firstChild as HTMLElement).style.backgroundColor = 'rgb(255, 255, 0)';
        hgltSplitObj.element.parentElement.setAttribute('title', toolTipText);
        return hgltSplitObj;
    }
    private openPopup = (): void => {
        this.highlightColorElement.style.display = 'block';
    }
    private closePopup = (): void => {
        this.highlightColorElement.style.display = 'none';
    }
    private initializeHighlightColorElement(): void {
        this.highlightColorElement = createElement('div', {
            id: 'highlight_color_ppty',
            styles: 'display:none;width:157px',
            className: 'e-de-cntr-highlight-pane'
        });
        let yellowDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#ffff00', 'yellowDiv');
        let brightGreenDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#00ff00', 'brightGreenDiv');
        let turquoiseDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#00ffff', 'turquoiseDiv');
        let hotPinkDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#ff00ff', 'hotPinkDiv');
        let blueDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#0000ff', 'blueDiv');
        let redDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#ff0000', 'redDiv');
        let darkBlueDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#000080', 'darkBlueDiv');
        let tealDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#008080', 'tealDiv');
        let greenDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#008000', 'greenDiv');
        let violetDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#800080', 'violetDiv');
        let darkRedDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#800000', 'darkRedDiv');
        let darkYellowDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#808000', 'darkYellowDiv');
        let gray50Div: HTMLDivElement = this.createHightlighColorPickerDiv('#808080', 'gray50Div');
        let gray25Div: HTMLDivElement = this.createHightlighColorPickerDiv('#c0c0c0', 'gray25Div');
        let blackDiv: HTMLDivElement = this.createHightlighColorPickerDiv('#000000', 'blackDiv');
        let nocolor: HTMLElement = createElement('div', { className: 'e-hglt-no-color' });
        this.highlightColorElement.appendChild(nocolor);
        // tslint:disable-next-line:max-line-length
        let nocolorDiv: HTMLElement = createElement('div', { styles: 'width:24px;height:24px;background-color:#ffffff;margin:3px;', id: 'noColorDiv' });
        nocolor.appendChild(nocolorDiv);
        let nocolorDivValue: HTMLElement = createElement('div', { innerHTML: 'No color', className: 'e-de-ctnr-hglt-no-color' });
        nocolorDiv.appendChild(nocolorDivValue);
        yellowDiv.addEventListener('click', this.onHighLightColor);
        brightGreenDiv.addEventListener('click', this.onHighLightColor);
        turquoiseDiv.addEventListener('click', this.onHighLightColor);
        hotPinkDiv.addEventListener('click', this.onHighLightColor);
        blueDiv.addEventListener('click', this.onHighLightColor);
        redDiv.addEventListener('click', this.onHighLightColor);
        darkBlueDiv.addEventListener('click', this.onHighLightColor);
        tealDiv.addEventListener('click', this.onHighLightColor);
        greenDiv.addEventListener('click', this.onHighLightColor);
        violetDiv.addEventListener('click', this.onHighLightColor);
        darkRedDiv.addEventListener('click', this.onHighLightColor);
        darkYellowDiv.addEventListener('click', this.onHighLightColor);
        gray50Div.addEventListener('click', this.onHighLightColor);
        gray25Div.addEventListener('click', this.onHighLightColor);
        blackDiv.addEventListener('click', this.onHighLightColor);
        nocolor.addEventListener('click', this.onHighLightColor);
    }
    private createHightlighColorPickerDiv(backgroundColor: string, id: string): HTMLDivElement {
        let colorDiv: HTMLDivElement = createElement('div', { className: 'e-de-ctnr-hglt-btn', id: id }) as HTMLDivElement;
        colorDiv.style.backgroundColor = backgroundColor;
        this.highlightColorElement.appendChild(colorDiv);
        return colorDiv;
    }
    /* tslint:disable:no-any */
    private onHighLightColor = (event: any): void => {
        if (this.documentEditor.selection) {
            this.applyHighlightColor(event.currentTarget.style.backgroundColor);
            this.highlightColor.toggle();
        }
    }
    private applyHighlightColorAsBackground = (color: HighlightColor): void => {
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
    private removeSelectedColorDiv = (): void => {
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
    private applyHighlightColor = (color: string): void => {
        this.appliedHighlightColor = color;
        let hgltColor: HighlightColor = this.getHighLightColor(color);
        this.documentEditor.selection.characterFormat.highlightColor = hgltColor as HighlightColor;
    }
    private getHighLightColor = (color: string): HighlightColor => {
        switch (color) {
            case 'rgb(255, 255, 0)':
                return 'Yellow';
            case 'rgb(0, 255, 0)':
                return 'BrightGreen';
            case 'rgb(0, 255, 255)':
                return 'Turquoise';
            case 'rgb(255, 0, 255)':
                return 'Pink';
            case 'rgb(0, 0, 255)':
                return 'Blue';
            case 'rgb(255, 0, 0)':
                return 'Red';
            case 'rgb(0, 0, 128)':
                return 'DarkBlue';
            case 'rgb(0, 128, 128)':
                return 'Teal';
            case 'rgb(0, 128, 0)':
                return 'Green';
            case 'rgb(128, 0, 128)':
                return 'Violet';
            case 'rgb(128, 0, 0)':
                return 'DarkRed';
            case 'rgb(128, 128, 0)':
                return 'DarkYellow';
            case 'rgb(128, 128, 128)':
                return 'Gray50';
            case 'rgb(192, 192, 192)':
                return 'Gray25';
            case 'rgb(0, 0, 0)':
                return 'Black';
            default:
                return 'NoColor';
        }
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
    // tslint:disable-next-line:max-line-length
    private createButtonTemplate(id: string, iconcss: string, div: HTMLElement, buttonClass: string, width: string, toolTipText: string): HTMLButtonElement {
        let button: HTMLButtonElement = createElement('Button', { id: id, attrs: { type: 'button' } }) as HTMLButtonElement;
        // button.style.width = width + 'px';
        // buttonElement.style.height = 32 + 'px';
        div.appendChild(button);
        let btn: Button = new Button({
            cssClass: buttonClass, iconCss: iconcss, enableRtl: this.isRtl
        });
        btn.appendTo(button);
        button.setAttribute('title', toolTipText);
        return button;
    }
    private createFontColorPicker = (id: string, width: number, divElement: HTMLElement, toolTipText: string): HTMLInputElement => {
        let inputElement: HTMLInputElement = createElement('input', { id: id, attrs: { 'type': 'color' } }) as HTMLInputElement;
        inputElement.style.width = width + 'px';
        divElement.appendChild(inputElement);
        // tslint:disable-next-line:max-line-length
        this.fontColorInputElement = new ColorPicker({ value: '#000000', showButtons: true, enableRtl: this.isRtl, locale: this.container.locale }, inputElement);
        this.fontColorInputElement.element.parentElement.setAttribute('title', toolTipText);
        return inputElement;
    }
    /**
     * Adds file colot elements to parent div.
     */
    private createColorTypeInput(elemId: string): HTMLInputElement {
        let colorType: HTMLInputElement = createElement('input', {
            id: elemId,
            attrs: { 'type': 'color' }, styles: 'position:fixed; left:-100em'
        }) as HTMLInputElement;
        this.documentEditor.getDocumentEditorElement().parentElement.appendChild(colorType);
        return colorType;
    }
    private createDropDownListForSize(fontSelectElement: HTMLElement): void {
        let fontSize: string[] = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72', '96'];
        this.fontSize = new ComboBox({
            dataSource: fontSize, popupHeight: '180px',
            cssClass: 'e-de-prop-dropdown',
            allowCustom: true,
            showClearButton: false,
            enableRtl: this.isRtl
        });
        this.fontSize.focus = (): void => { this.isRetrieving = false; (this.fontSize.element as HTMLInputElement).select(); };
        this.fontSize.value = this.documentEditor.selection.characterFormat.fontSize.toString();
        this.fontSize.appendTo(fontSelectElement);
        this.fontSize.element.parentElement.setAttribute('title', this.localObj.getConstant('Font Size'));
    }

    private createDropDownListForFamily(fontSelectElement: HTMLElement): void {
        let fontStyle: { [key: string]: Object; }[];
        let isStringTemplate: boolean = false;
        let itemTemplate: string = '';
        if (!this.container.enableCsp) {
            itemTemplate = '<span style="font-family: ${FontName};">${FontName}</span>';
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
            itemTemplate: itemTemplate,
        });
        this.fontFamily.appendTo(fontSelectElement);
        this.fontFamily.isStringTemplate = isStringTemplate;
        let fontFamilyValue: string[] = this.container.documentEditorSettings.fontFamilies;
        for (let i: number = 0; i < fontFamilyValue.length; i++) {
            let fontValue: string = fontFamilyValue[i];
            let fontStyleValue: { [key: string]: Object; } = { 'FontName': fontValue, 'FontValue': fontValue };
            this.fontFamily.addItem(fontStyleValue, i);
        }
        this.fontFamily.focus = (): void => { this.isRetrieving = false; (this.fontFamily.element as HTMLInputElement).select(); };
        this.fontFamily.element.parentElement.setAttribute('title', this.localObj.getConstant('Font'));
    }
    public wireEvent(): void {
        this.fontFamily.addEventListener('change', (): void => { this.changeFontFamily(); });
        this.fontSize.addEventListener('change', (): void => { this.changeFontSize(); });
        this.bold.addEventListener('click', (): void => { this.isRetrieving = false; this.boldAction(); });
        this.italic.addEventListener('click', (): void => { this.isRetrieving = false; this.italicAction(); });
        this.underline.addEventListener('click', (): void => { this.isRetrieving = false; this.underlineAction(); });
        this.strikethrough.addEventListener('click', (): void => { this.isRetrieving = false; this.strikethroughAction(); });
        this.superscript.addEventListener('click', (): void => { this.isRetrieving = false; this.superscriptAction(); });
        this.subscript.addEventListener('click', (): void => { this.isRetrieving = false; this.subscriptAction(); });
        /* tslint:disable-next-line:max-line-length */
        this.fontColorInputElement.addEventListener('change', (args: ColorPickerEventArgs): void => { this.isRetrieving = false; this.changeFontColor(args); });
        this.clearFormat.addEventListener('click', (): void => { this.isRetrieving = false; this.clearFormatAction(); });
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
    }
    private boldAction = (): void => {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.toggleBold();
        }
    }
    private italicAction = (): void => {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.toggleItalic();
        }
    }
    private underlineAction = (): void => {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.toggleUnderline('Single');
        }
    }
    private strikethroughAction = (): void => {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.toggleStrikethrough();
        }
    }
    private clearFormatAction = (): void => {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.clearFormatting();
        }
    }
    private subscriptAction = (): void => {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.toggleSubscript();
        }
    }
    private superscriptAction = (): void => {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.toggleSuperscript();
        }
    }
    private changeFontColor = (arg: ColorPickerEventArgs): void => {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.selection) {
            this.documentEditor.selection.characterFormat.fontColor = arg.currentValue.hex;
            setTimeout((): void => { this.documentEditor.focusIn(); }, 30);
        }
    }
    private changeFontFamily = (): void => {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.selection && this.fontFamily.value !== '') {
            setTimeout((): void => { this.documentEditor.selection.characterFormat.fontFamily = this.fontFamily.value as string; }, 10);
        }
    }
    private changeFontSize = (): void => {
        if (this.isRetrieving) {
            return;
        }
        if (!this.documentEditor.isReadOnly && this.documentEditor.selection && this.fontSize.value !== '') {
            setTimeout((): void => { this.documentEditor.selection.characterFormat.fontSize = this.fontSize.value as number; }, 10);
        }
    }
    public onSelectionChange(): void {
        this.isRetrieving = true;
        if (this.documentEditor.selection) {
            //#region character format
            if (this.documentEditor.selection.characterFormat.fontFamily) {
                this.fontFamily.value = this.documentEditor.selection.characterFormat.fontFamily;
                this.fontFamily.dataBind();
            } else {
                this.fontFamily.value = '';
            }
            if (this.documentEditor.selection.characterFormat.fontSize) {
                this.fontSize.value = this.documentEditor.selection.characterFormat.fontSize.toString();
                this.fontSize.dataBind();
            } else {
                this.fontSize.value = '';
            }
            if (this.documentEditor.selection.characterFormat.bold) {
                if (!this.bold.classList.contains('e-btn-toggle')) {
                    this.bold.classList.add('e-btn-toggle');
                }
            } else {
                if (this.bold.classList.contains('e-btn-toggle')) {
                    this.bold.classList.remove('e-btn-toggle');
                }
            }
            if (this.documentEditor.selection.characterFormat.italic) {
                if (!this.italic.classList.contains('e-btn-toggle')) {
                    this.italic.classList.add('e-btn-toggle');
                }
            } else {
                if (this.italic.classList.contains('e-btn-toggle')) {
                    this.italic.classList.remove('e-btn-toggle');
                }
            }
            if (this.documentEditor.selection.characterFormat.underline
                && this.documentEditor.selection.characterFormat.underline !== 'None') {
                if (!this.underline.classList.contains('e-btn-toggle')) {
                    this.underline.classList.add('e-btn-toggle');
                }
            } else {
                if (this.underline.classList.contains('e-btn-toggle')) {
                    this.underline.classList.remove('e-btn-toggle');
                }
            }
            if (this.documentEditor.selection.characterFormat.strikethrough
                && this.documentEditor.selection.characterFormat.strikethrough !== 'None') {
                if (!this.strikethrough.classList.contains('e-btn-toggle')) {
                    this.strikethrough.classList.add('e-btn-toggle');
                }
            } else {
                if (this.strikethrough.classList.contains('e-btn-toggle')) {
                    this.strikethrough.classList.remove('e-btn-toggle');
                }
            }
            if (this.documentEditor.selection.characterFormat.baselineAlignment
                && this.documentEditor.selection.characterFormat.baselineAlignment === 'Subscript') {
                if (!this.subscript.classList.contains('e-btn-toggle')) {
                    this.subscript.classList.add('e-btn-toggle');
                }
            } else {
                if (this.subscript.classList.contains('e-btn-toggle')) {
                    this.subscript.classList.remove('e-btn-toggle');
                }
            }
            if (this.documentEditor.selection.characterFormat.baselineAlignment
                && this.documentEditor.selection.characterFormat.baselineAlignment === 'Superscript') {
                if (!this.superscript.classList.contains('e-btn-toggle')) {
                    this.superscript.classList.add('e-btn-toggle');
                }
            } else {
                if (this.superscript.classList.contains('e-btn-toggle')) {
                    this.superscript.classList.remove('e-btn-toggle');
                }
            }
            if (this.documentEditor.selection.characterFormat.fontColor) {
                this.fontColorInputElement.value = this.documentEditor.selection.characterFormat.fontColor;
            }
            if (this.documentEditor.selection.characterFormat.highlightColor) {
                this.highlightColorInputElement.style.backgroundColor = this.appliedHighlightColor;
                this.applyHighlightColorAsBackground(this.documentEditor.selection.characterFormat.highlightColor);
            }
            //#endregion
        }
    }

    public destroy(): void {
        this.container = undefined;
        if (this.highlightColor) {
            this.highlightColor.destroy();
            this.highlightColor = undefined;
        }
        if (this.fontColorInputElement) {
            this.fontColorInputElement.destroy();
            this.fontColorInputElement = undefined;
        }
        if (this.fontSize) {
            this.fontSize.destroy();
            this.fontSize = undefined;
        }
        if (this.fontFamily) {
            this.fontFamily.destroy();
            this.fontFamily = undefined;
        }
    }
}