import { createElement, isNullOrUndefined, L10n, initializeCSPTemplate, attributes } from '@syncfusion/ej2-base';
import { DropDownList, ComboBox, SelectEventArgs, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { RadioButton, Button } from '@syncfusion/ej2-buttons';
import { WStyle, WCharacterStyle, WParagraphStyle } from '../../implementation/format/style';
import { internalStyleCollectionChange, StyleType, TextAlignment } from '../../base/index';
import { BulletsAndNumberingDialog } from './index';
import { WList } from '../list/list';
import { Query } from '@syncfusion/ej2-data';
import { WAbstractList } from '../list/abstract-list';
import { WCharacterFormat, WParagraphFormat } from '../index';
import { ColorPicker, ColorPickerEventArgs, TextBox } from '@syncfusion/ej2-inputs';
import { DropDownButton, ItemModel, MenuEventArgs as DropDownButtonMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { DocumentHelper } from '../viewer';
import { SanitizeHtmlHelper } from '@syncfusion/ej2-base';

// eslint-disable-next-line valid-jsdoc
/**
 * The Style dialog is used to create or modify styles.
 */
export class StyleDialog {
    public documentHelper: DocumentHelper;
    private target: HTMLElement = undefined;
    private styleType: DropDownList = undefined;
    private styleBasedOn: DropDownList = undefined;
    private styleParagraph: DropDownList = undefined;
    private onlyThisDocument: RadioButton = undefined;
    private template: RadioButton = undefined;
    private isEdit: boolean;
    private editStyleName: string;
    private style: WCharacterStyle | WParagraphStyle;
    private abstractList: WAbstractList;
    private numberingBulletDialog: BulletsAndNumberingDialog;
    private okButton: HTMLButtonElement;
    private styleNameElement: HTMLInputElement;
    private isUserNextParaUpdated: boolean;
    private fontFamily: DropDownList = undefined;
    private fontSize: ComboBox = undefined;
    private characterFormat: WCharacterFormat = undefined;
    private paragraphFormat: WParagraphFormat = undefined;
    private textAlignment : TextAlignment = undefined;
    private lineSpacing: number = undefined;
    private leftIndent: number = undefined;
    private beforeSpacing: number = undefined;
    private afterSpacing: number = undefined;
    private localObj: L10n;

    //Font Properties

    private bold: HTMLElement;
    private italic: HTMLElement;
    private underline: HTMLElement;
    private fontColor: ColorPicker;
    private leftAlign: HTMLElement;
    private rightAlign: HTMLElement;
    private centerAlign: HTMLElement;
    private justify: HTMLElement;
    private singleLineSpacing: HTMLElement;
    private doubleLineSpacing: HTMLElement;
    private onePointFiveLineSpacing: HTMLElement;
    private styleDropdwn: DropDownButton;

    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    /**
     * @private
     * @returns {string} Returns module name
     */
    public getModuleName(): string {
        return 'StyleDialog';
    }
    /**
     * @private
     * @param {L10n} localValue - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    /* eslint-disable  */
    public initStyleDialog(localValue: L10n, isRtl?: boolean): void {
        let instance: StyleDialog = this;
        this.localObj = localValue;
        this.target = createElement('div', { className: 'e-de-style-dialog' });
        let container: HTMLElement = createElement('div');

        let properties: HTMLElement = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: localValue.getConstant('Properties') });
        container.appendChild(properties);
        let styleNameTypeDiv: HTMLElement = createElement('div', { className: 'e-de-container-row' });
        container.appendChild(styleNameTypeDiv);
        let nameWholeDiv: HTMLElement = createElement('div', { className: 'e-de-subcontainer-left' });
        styleNameTypeDiv.appendChild(nameWholeDiv);
        // let name: HTMLElement = createElement('div', { className: 'e-de-style-name', innerHTML: localValue.getConstant('Name') + ':' });
        // nameWholeDiv.appendChild(name);

        let nameValue: HTMLInputElement = createElement('input', { className: 'e-input e-de-style-dlg-name-input' }) as HTMLInputElement;
        nameValue.addEventListener('keyup', this.updateOkButton);
        nameValue.addEventListener('input', this.updateOkButton);
        nameValue.addEventListener('blur', this.updateNextStyle);
        nameWholeDiv.appendChild(nameValue);
        new TextBox({placeholder: localValue.getConstant('Name') + ':', floatLabelType: 'Always' }, nameValue);
        let styleTypeWholeDiv: HTMLElement = createElement('div', {className : 'e-de-subcontainer-right'});
        styleNameTypeDiv.appendChild(styleTypeWholeDiv);

        // let styleType: HTMLElement = createElement('div', { className: 'e-de-style-styletype', innerHTML:  });
        // styleTypeWholeDiv.appendChild(styleType);
        let styleTypeDivElement: HTMLElement = createElement('div');
        let styleTypeValue: HTMLSelectElement = createElement('select') as HTMLSelectElement;

        styleTypeValue.innerHTML = '<option value="Paragraph">' + localValue.getConstant('Paragraph') + '</option><option value="Character">' + localValue.getConstant('Character') + '</option><option value="Linked Style">' + localValue.getConstant('Linked Style') + '</option>';
        styleTypeDivElement.appendChild(styleTypeValue);
        this.styleType = new DropDownList({
            change: this.styleTypeChange,
            popupHeight: '253px', enableRtl: isRtl,
            placeholder: localValue.getConstant('Style type') + ':', floatLabelType: 'Always'
        });
        this.styleType.appendTo(styleTypeValue);
        styleTypeWholeDiv.appendChild(styleTypeDivElement);

        let styleBasedParaDiv: HTMLElement = createElement('div', { className: 'e-de-container-row' });
        container.appendChild(styleBasedParaDiv);
        let styleBasedOnWholeDiv: HTMLElement = createElement('div', { className: 'e-de-subcontainer-left' });
        styleBasedParaDiv.appendChild(styleBasedOnWholeDiv);

        //let styleBasedOn: HTMLElement = createElement('div', { className: 'e-de-style-style-based-on', innerHTML:  });
        //styleBasedOnWholeDiv.appendChild(styleBasedOn);
        let styleBasedOnDivElement: HTMLElement = createElement('div', { className: 'e-de-style-style-based-on-div' });

        let styleBasedOnValue: HTMLInputElement = createElement('input') as HTMLInputElement;
        //styleBasedOnValue.innerHTML = '<option>Normal</option><option>Heading 1</option><option>Heading 2</option><option>Heading 3</option><option>Heading 4</option><option>Heading 5</option><option>Heading 6</option>';
        styleBasedOnDivElement.appendChild(styleBasedOnValue);

        this.styleBasedOn = new DropDownList({
            dataSource: [], select: this.styleBasedOnChange, popupHeight: '253px', enableRtl: isRtl,
            placeholder: localValue.getConstant('Style based on') + ':', floatLabelType: 'Always'
        });
        this.styleBasedOn.appendTo(styleBasedOnValue);
        styleBasedOnWholeDiv.appendChild(styleBasedOnDivElement);

        let styleParagraphWholeDiv: HTMLElement = createElement('div', { className: 'e-de-subcontainer-right' });
        styleBasedParaDiv.appendChild(styleParagraphWholeDiv);
        if (isRtl) {
            nameWholeDiv.classList.add('e-de-rtl');
            styleBasedOnWholeDiv.classList.add('e-de-rtl');
            styleParagraphWholeDiv.classList.add('e-de-rtl');
        }

        //let styleParagraph: HTMLElement = createElement('div', { className: 'e-de-style-style-paragraph', innerHTML: });
        //styleParagraphWholeDiv.appendChild(styleParagraph);
        let styleParagraphDivElement: HTMLElement = createElement('div');

        let styleParagraphValue: HTMLInputElement = createElement('input') as HTMLInputElement;

        //styleParagraphValue.innerHTML = '<option>Normal</option><option>Heading 1</option><option>Heading 2</option><option>Heading 3</option><option>Heading 4</option><option>Heading 5</option><option>Heading 6</option>';
        styleParagraphDivElement.appendChild(styleParagraphValue);

        this.styleParagraph = new DropDownList({
            dataSource: [], select: this.styleParagraphChange, popupHeight: '253px', enableRtl: isRtl,
            placeholder: localValue.getConstant('Style for following paragraph') + ':', floatLabelType: 'Always'
        });
        this.styleParagraph.appendTo(styleParagraphValue);
        styleParagraphWholeDiv.appendChild(styleParagraphDivElement);
        let formatting: HTMLElement = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: localValue.getConstant('Formatting') });
        container.appendChild(formatting);
        let optionsDiv: HTMLElement = createElement('div', { className: 'e-de-style-options-div' });
        container.appendChild(optionsDiv);
        let fontOptionsDiv: HTMLElement = createElement('div', { styles: 'display:flex;margin-bottom: 14px;' });
        optionsDiv.appendChild(fontOptionsDiv);
        this.createFontOptions(fontOptionsDiv, isRtl);
        let paragraphOptionsDiv: HTMLElement = createElement('div', { styles: 'display:flex', className: 'e-style-paragraph' });
        optionsDiv.appendChild(paragraphOptionsDiv);
        this.createParagraphOptions(paragraphOptionsDiv);


        // let radioOptionsDiv: HTMLElement = createElement('div', { styles: 'display:flex' });
        // container.appendChild(radioOptionsDiv);
        // let onlyThisDocumentDiv: HTMLElement = createElement('div', { className: 'e-de-style-radio-button' });

        // let onlyThisDocument: HTMLInputElement = createElement('input', { className: 'e-de-style-only-this-doc', attrs: { type: 'radio' } }) as HTMLInputElement;
        // onlyThisDocumentDiv.appendChild(onlyThisDocument);

        // this.onlyThisDocument = new RadioButton({ label: 'Only in this document', value: 'only in this document', checked: true, name: 'styles' });
        // this.onlyThisDocument.appendTo(onlyThisDocument);
        // radioOptionsDiv.appendChild(onlyThisDocumentDiv);

        // let templateDiv: HTMLElement = createElement('div', { className: 'e-de-style-radio-button' });

        // let template: HTMLInputElement = createElement('input', { className: 'e-de-style-temp', attrs: { type: 'radio' } }) as HTMLInputElement;
        // templateDiv.appendChild(template);
        // this.template = new RadioButton({ label: 'Template', value: 'template', name: 'styles' });
        // this.template.appendTo(template);
        // radioOptionsDiv.appendChild(templateDiv);
        this.createFormatDropdown(container, localValue, isRtl);
        this.target.appendChild(container);
    }
    private createFormatDropdown(parentDiv: HTMLElement, localValue: L10n, isRtl?: boolean): void {
        let formatBtn: HTMLElement = createElement('button', {
            id: 'style_format_dropdown', innerHTML: localValue.getConstant('Format'),
            attrs: { type: 'button' }
        });
        formatBtn.style.height = '31px';
        parentDiv.appendChild(formatBtn);
        let items: ItemModel[] = [{ text: localValue.getConstant('Font') + '...', id: 'style_font' },
        { text: localValue.getConstant('Paragraph') + '...', id: 'style_paragraph' },
        { text: localValue.getConstant('Numbering') + '...', id: 'style_numbering' }];
        this.styleDropdwn = new DropDownButton({
            items: items, cssClass: 'e-de-style-format-dropdwn', enableRtl: isRtl,
            beforeItemRender: (args: MenuEventArgs) => {
                if (this.styleType.value === localValue.getConstant('Character')) {
                    if (args.item.id === "style_paragraph") {
                        args.element.classList.add('e-disabled');
                    }

                    if (args.item.id === 'style_numbering') {
                        args.element.classList.add('e-disabled');
                    }
                } else {
                    if (args.item.id === "style_paragraph") {
                        args.element.classList.remove('e-disabled');
                    }

                    if (args.item.id === 'style_numbering') {
                        args.element.classList.remove('e-disabled');
                    }
                }
            },
        });
        this.styleDropdwn.appendTo(formatBtn);
        this.styleDropdwn.addEventListener('select', this.openDialog);
    }
    /**
     * 
     * @param {DropDownButtonMenuEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    private openDialog = (args: DropDownButtonMenuEventArgs): void => {
        switch (args.item.id) {
            case 'style_font':
                this.showFontDialog();
                break;
            case 'style_paragraph':
                this.showParagraphDialog();
                break;
            case 'style_numbering':
                this.showNumberingBulletDialog();
                break;
        }
    }
    private createFontOptions(parentDiv: HTMLElement, isRtl?: boolean): void {
        let fontFamilyElement: HTMLElement = createElement('input', {
            id: this.target.id + '_fontName',
        });
        let fontStyle: { [key: string]: Object; }[];
        let isStringTemplate: boolean = true;        
        let itemTemplate: string | Function = initializeCSPTemplate(
            function (data: any): string { return `<span style="font-family: ${data.FontName};">${data.FontName}</span>`; }
        );
        parentDiv.appendChild(fontFamilyElement);
        this.fontFamily = new ComboBox({
            dataSource: fontStyle, query: new Query().select(['FontName']), fields: { text: 'FontName', value: 'value' },
            allowCustom: true, width: '123px', popupWidth: '123px',
            cssClass: 'e-style-font-fmaily-right', enableRtl: isRtl, change: this.fontFamilyChanged,
            showClearButton: false, itemTemplate: itemTemplate
        });
        this.fontFamily.appendTo(fontFamilyElement);
        this.fontFamily.isStringTemplate = isStringTemplate;
        let fontFamilyValue: string[] = this.documentHelper.owner.documentEditorSettings.fontFamilies;
        for (let i: number = 0; i < fontFamilyValue.length; i++) {
            let fontValue: string = fontFamilyValue[i];
            let fontStyleValue: { [key: string]: Object; } = { 'FontName': fontValue, 'value': fontValue };
            this.fontFamily.addItem(fontStyleValue, i);
        }
        this.fontFamily.focus = (): void => { (this.fontFamily.element as HTMLInputElement).select(); };
        this.fontFamily.element.parentElement.setAttribute('title', this.localObj.getConstant('Font'));
        let fontSizeElement: HTMLElement = createElement('input');
        parentDiv.appendChild(fontSizeElement);
        let sizeDataSource: number[] = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
        this.fontSize = new ComboBox({
            dataSource: sizeDataSource, width: '73px', cssClass: 'e-style-font-fmaily-right',
            enableRtl: isRtl, change: this.fontSizeUpdate
        });
        this.fontSize.showClearButton = false;
        this.fontSize.appendTo(fontSizeElement);
        let fontGroupButton: HTMLElement = createElement('div', { className: 'e-de-style-font-group-button' });
        parentDiv.appendChild(fontGroupButton);

        this.bold = this.createButtonElement(fontGroupButton, 'e-de-bold', 'e-de-style-bold-button-size', this.documentHelper.owner.containerId + '_style_bold');
        this.bold.setAttribute('aria-label','bold');
        this.bold.addEventListener('click', this.setBoldProperty);

        this.italic = this.createButtonElement(fontGroupButton, 'e-de-italic', 'e-de-style-icon-button-size', this.documentHelper.owner.containerId + '_style_italic');
        this.italic.setAttribute('aria-label','italic');
        this.italic.addEventListener('click', this.setItalicProperty);

        this.underline = this.createButtonElement(fontGroupButton, 'e-de-underline', 'e-de-style-icon-button-size', this.documentHelper.owner.containerId + '_style_underline');
        this.underline.setAttribute('aria-label','underline');
        this.underline.addEventListener('click', this.setUnderlineProperty);
        let fontColorElement: HTMLElement = createElement('input', { attrs: { type: 'color' }, className: 'e-de-style-icon-button-size' });
        parentDiv.appendChild(fontColorElement);
        const {columns , createPopupOnClick  , disabled , enablePersistence , enableRtl , inline , mode , modeSwitcher , noColor , presetColors , showButtons} = this.documentHelper.owner.documentEditorSettings.colorPickerSettings;
        this.fontColor = new ColorPicker({ cssClass: 'e-de-style-font-color-picker', enableRtl: isRtl, change: this.fontColorUpdate, locale: this.documentHelper.owner.locale, enableOpacity: false , mode:mode , modeSwitcher:modeSwitcher , showButtons: showButtons , columns:columns , createPopupOnClick : createPopupOnClick , disabled : disabled , enablePersistence : enablePersistence , inline : inline , noColor : noColor , presetColors : presetColors });
        this.documentHelper.fontColor = this.fontColor;
        this.fontColor.appendTo(fontColorElement);
    }
    /**
     * @private
     * @returns {void}
     */
    private setBoldProperty = (): void => {
        this.characterFormat.bold = !this.characterFormat.bold;
        this.fontButtonClicked();
    }
    /**
     * @private
     * @returns {void}
     */
    private setItalicProperty = (): void => {
        this.characterFormat.italic = !this.characterFormat.italic;
        this.fontButtonClicked();
    }
    /**
     * @private
     * @returns {void}
     */
    private setUnderlineProperty = (): void => {
        this.characterFormat.underline = this.characterFormat.underline === 'None' ? 'Single' : 'None';
        this.fontButtonClicked();
    }
    /**
     * @private
     * @returns {void}
     */
    private fontButtonClicked = (): void => {
        if (this.characterFormat.bold) {
            if (!this.bold.classList.contains('e-active')) {
                this.bold.classList.add('e-active');
            }
        } else {
            if (this.bold.classList.contains('e-active')) {
                this.bold.classList.remove('e-active');
            }
        }
        if (this.characterFormat.italic) {
            if (!this.italic.classList.contains('e-active')) {
                this.italic.classList.add('e-active');
            }
        } else {
            if (this.italic.classList.contains('e-active')) {
                this.italic.classList.remove('e-active');
            }
        }
        if (this.characterFormat.underline !== undefined && this.characterFormat.underline !== 'None') {
            if (!this.underline.classList.contains('e-active')) {
                this.underline.classList.add('e-active');
                this.characterFormat.underline = 'Single';
            }
        } else {
            if (this.underline.classList.contains('e-active')) {
                this.underline.classList.remove('e-active');
                this.characterFormat.underline = 'None';
            }
        }
    }
    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    private fontSizeUpdate = (args: ChangeEventArgs): void => {
        this.characterFormat.fontSize = args.value as number;
    }
    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    private fontFamilyChanged = (args: ChangeEventArgs): void => {
        this.characterFormat.fontFamily = args.value.toString();
    }
    /**
     * @private
     * @param {ColorPickerEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    private fontColorUpdate = (args: ColorPickerEventArgs): void => {
        this.characterFormat.fontColor = args.currentValue.hex;
    }
    private createParagraphOptions(parentDiv: HTMLElement): void {
        let alignmentDiv: HTMLElement = createElement('div', { className: 'e-de-style-paragraph-group-button' });
        parentDiv.appendChild(alignmentDiv);
        this.leftAlign = this.createButtonElement(alignmentDiv, 'e-de-align-left', 'e-de-style-icon-button-size');
        this.leftAlign.setAttribute('aria-label','leftAlign');
        this.leftAlign.addEventListener('click', this.setLeftAlignment);
        this.centerAlign = this.createButtonElement(alignmentDiv, 'e-de-align-center', 'e-de-style-icon-button-size');
        this.centerAlign.setAttribute('aria-label','centerAlign');
        this.centerAlign.addEventListener('click', this.setCenterAlignment);
        this.rightAlign = this.createButtonElement(alignmentDiv, 'e-de-align-right', 'e-de-style-icon-button-size');
        this.rightAlign.setAttribute('aria-label','rightAlign');
        this.rightAlign.addEventListener('click', this.setRightAlignment);
        this.justify = this.createButtonElement(alignmentDiv, 'e-de-justify', 'e-de-style-icon-button-last-size');
        this.justify.setAttribute('aria-label','justify');
        this.justify.addEventListener('click', this.setJustifyAlignment);
        let lineSpacingDiv: HTMLElement = createElement('div', { className: 'e-de-style-paragraph-group-button' });
        parentDiv.appendChild(lineSpacingDiv);
        this.singleLineSpacing = this.createButtonElement(lineSpacingDiv, 'e-de-single-spacing', 'e-de-style-icon-button-first-size');
        this.singleLineSpacing.setAttribute('aria-label','singleLineSpacing');
        this.singleLineSpacing.addEventListener('click', () => {
            this.lineSpacing = 1;
            this.updateParagraphFormat();
        });

        this.onePointFiveLineSpacing = this.createButtonElement(lineSpacingDiv, 'e-de-one-point-five-spacing', 'e-de-style-icon-button-size');
        this.onePointFiveLineSpacing.setAttribute('aria-label','onePointFiveLineSpacing');
        this.onePointFiveLineSpacing.addEventListener('click', () => {
            this.lineSpacing = 1.5;
            this.updateParagraphFormat();
        });
        this.doubleLineSpacing = this.createButtonElement(lineSpacingDiv, 'e-de-double-spacing', 'e-de-style-icon-button-last-size');
        this.doubleLineSpacing.setAttribute('aria-label','doubleLineSpacing');
        this.doubleLineSpacing.addEventListener('click', () => {
            this.lineSpacing = 2;
            this.updateParagraphFormat();
        });
        let spacingDiv: HTMLElement = createElement('div', { className: 'e-de-style-paragraph-group-button' });
        parentDiv.appendChild(spacingDiv);
        let beforeSpacing: HTMLElement = this.createButtonElement(spacingDiv, 'e-de-before-spacing', 'e-de-style-icon-button-first-size');
        beforeSpacing.setAttribute('aria-label','beforeSpacing');
        let afterSpacing: HTMLElement = this.createButtonElement(spacingDiv, 'e-de-after-spacing', 'e-de-style-icon-button-last-size');
        afterSpacing.setAttribute('aria-label','afterSpacing');
        beforeSpacing.addEventListener('click', this.increaseBeforeAfterSpacing);
        afterSpacing.addEventListener('click', this.decreaseBeforeAfterSpacing);
        let indentingDiv: HTMLElement = createElement('div', { className: 'e-de-style-paragraph-indent-group-button' });
        parentDiv.appendChild(indentingDiv);
        let decreaseIndent: HTMLElement = this.createButtonElement(indentingDiv, 'e-de-indent', 'e-de-style-icon-button-first-size');
        decreaseIndent.setAttribute('aria-label','decreaseIndent');
        decreaseIndent.addEventListener('click', () => {
            if (this.leftIndent >= 36) {
                this.leftIndent -= 36;
            } else {
                this.leftIndent = 0;
            }
        });
        let increaseindent: HTMLElement = this.createButtonElement(indentingDiv, 'e-de-outdent', 'e-de-style-icon-button-size');
        increaseindent.setAttribute('aria-label','increaseindent');
        increaseindent.addEventListener('click', () => {
            this.leftIndent += 36;
        });
    }
    /**
     * @private
     * @returns {void}
     */
    private setLeftAlignment = (): void => {
        if (this.textAlignment === 'Left') {
            this.textAlignment = 'Justify';
        } else {
            this.textAlignment = 'Left';
        }
        this.updateParagraphFormat();
    }
    /**
     * @private
     * @returns {void}
     */
    private setRightAlignment = (): void => {
        if (this.textAlignment === 'Right') {
            this.textAlignment = 'Left';
        } else {
            this.textAlignment = 'Right';
        }
        this.updateParagraphFormat();
    }
    /**
     * @private
     * @returns {void}
     */
    private setCenterAlignment = (): void => {
        if (this.textAlignment === 'Center') {
            this.textAlignment = 'Left';
        } else {
            this.textAlignment = 'Center';
        }
        this.updateParagraphFormat();
    }
    /**
     * @private
     * @returns {void}
     */
    private setJustifyAlignment = (): void => {
        if (this.textAlignment === 'Justify') {
            this.textAlignment = 'Left';
        } else {
            this.textAlignment = 'Justify';
        }
        this.updateParagraphFormat();
    }
    private createButtonElement(parentDiv: HTMLElement, iconCss: string, className: string, id?: string): HTMLElement {
        let buttonElement: HTMLElement = createElement('button', { attrs: { type: 'button' } });
        if (!isNullOrUndefined(id)) {
            buttonElement.id = id;
        }
        parentDiv.appendChild(buttonElement);
        let button: Button = new Button({ iconCss: iconCss, cssClass: className });

        button.appendTo(buttonElement);
        return buttonElement;

    }
    /**
     * @private
     * @returns {void}
     */
    private increaseBeforeAfterSpacing = (): void => {
        this.beforeSpacing += 6;
        this.afterSpacing += 6;
    }
    /**
     * @private
     * @returns {void}
     */
    private decreaseBeforeAfterSpacing = (): void => {
        if (this.beforeSpacing >= 6) {
            this.beforeSpacing -= 6;
        } else {
            this.beforeSpacing = 0;
        }
        if (this.afterSpacing >= 6) {
            this.afterSpacing -= 6;
        } else {
            this.afterSpacing = 0;
        }
    }
    private toggleDisable(): void {
        if (this.styleType.value === this.localObj.getConstant('Character')) {
            this.styleParagraph.enabled = false;

            this.target.getElementsByClassName('e-style-paragraph').item(0).setAttribute('style', 'display:flex;pointer-events:none;opacity:0.5');
        } else {
            this.styleParagraph.enabled = true;
            this.target.getElementsByClassName('e-style-paragraph').item(0).removeAttribute('style');
            this.target.getElementsByClassName('e-style-paragraph').item(0).setAttribute('style', 'display:flex');
        }
        this.styleBasedOn.enabled = true;
    }
    /**
     * @private
     * @returns {void}
     */
    public updateNextStyle = (args: FocusEvent): void => {
        let typedName: string = (args.srcElement as HTMLInputElement).value;

        if (this.getTypeValue() === this.localObj.getConstant('Paragraph') && !isNullOrUndefined(typedName) && typedName !== '' && !this.isUserNextParaUpdated) {
            let styles: string[] = this.documentHelper.styles.getStyleNames(this.getTypeValue());
            if (this.isEdit) {
                styles = styles.filter((e: string) => e !== this.editStyleName);
            }
            styles.push(typedName);
            this.styleParagraph.dataSource = styles;
            this.styleParagraph.index = null;
            this.styleParagraph.index = styles.indexOf(typedName);
            // this.styleParagraph.dataBind();
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public updateOkButton = (): void => {
        let styleName: string = (this.target.getElementsByClassName('e-input e-de-style-dlg-name-input').item(0) as HTMLInputElement).value;
        this.enableOrDisableOkButton();
    }
    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    public styleTypeChange = (args: ChangeEventArgs): void => {
        if (args.isInteracted) {
            let type: StyleType;
            if (args.value === 'Character') {
                this.style = new WCharacterStyle();
                type = 'Character';
            }

            if (args.value === 'Paragraph' || args.value === 'Linked Style') {
                this.style = new WParagraphStyle();
                type = 'Paragraph';
            }
            this.toggleDisable();
            this.updateStyleNames(type as StyleType);
        }
    }
    /**
     * @returns {void}
     */
    private styleBasedOnChange = (): void => {
        //Based on change
    }
    /**
     * @private
     * @param {SelectEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    public styleParagraphChange = (args: SelectEventArgs): void => {
        if (args.isInteracted) {
            this.isUserNextParaUpdated = true;
        }
        //Next change
    }

    /**
     * @private
     * @returns {void}
     */
    public showFontDialog = (): void => {
        if (!isNullOrUndefined(this.documentHelper.owner.fontDialogModule)) {
            this.documentHelper.owner.showFontDialog(this.characterFormat);
        }
        this.updateCharacterFormat();
    }
    /**
     * @private
     * @returns {void}
     */
    public showParagraphDialog = (): void => {
        if (!isNullOrUndefined(this.documentHelper.owner.paragraphDialogModule)) {
            this.documentHelper.owner.showParagraphDialog(this.paragraphFormat);
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public showNumberingBulletDialog = (): void => {
        this.numberingBulletDialog = new BulletsAndNumberingDialog(this.documentHelper);
        if (this.style instanceof WParagraphStyle && (!isNullOrUndefined(this.style.paragraphFormat))) {

            this.numberingBulletDialog.showNumberBulletDialog((this.style as WParagraphStyle).paragraphFormat.listFormat, this.abstractList);
        }
    }
    /**
     * @private
     * @param {string} styleName - Specifies the style name.
     * @param {string} header - Specifies the header.
     * @returns {void}
     */
    public show(styleName?: string, header?: string): void {
        let localObj: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        this.isEdit = (!isNullOrUndefined(styleName) && styleName.length > 0) ? true : false;
        this.editStyleName = styleName;
        this.abstractList = new WAbstractList();

        let style: WCharacterStyle | WParagraphStyle = this.documentHelper.styles.findByName(styleName) as WCharacterStyle | WParagraphStyle;
        this.style = !this.isEdit ? new WParagraphStyle() : style ? style : this.getStyle(styleName) as WCharacterStyle | WParagraphStyle;
        localObj.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initStyleDialog(localObj, this.documentHelper.owner.enableRtl);
        }
        if (!this.isEdit) {
            this.styleType.value = 'Paragraph';
        } else {
            this.styleType.value = this.style instanceof WCharacterStyle ? 'Character' : 'Paragraph';
        }
        if (isNullOrUndefined(header)) {
            header = localObj.getConstant('Create New Style');
        }
        this.documentHelper.dialog2.header = header;
        this.documentHelper.dialog2.height = 'auto';
        this.documentHelper.dialog2.width = 'auto';
        this.documentHelper.dialog2.content = this.target;
        this.documentHelper.dialog2.buttons = [{
            click: this.onOkButtonClick,
            buttonModel: { content: localObj.getConstant('Ok'), cssClass: 'e-flat e-style-okay', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: localObj.getConstant('Cancel'), cssClass: 'e-flat e-style-cancel' }
        }];
        this.toggleDisable();
        this.documentHelper.dialog2.dataBind();
        this.documentHelper.dialog2.beforeOpen = this.loadStyleDialog;
        this.documentHelper.dialog2.close = this.closeStyleDialog;
        this.documentHelper.dialog2.position = { X: 'center', Y: 'center' };
        this.documentHelper.dialog2.show();
    }
    /**
     * @private
     * @returns {void}
     */
    public onOkButtonClick = (): void => {
        let styleName: string = this.documentHelper.owner.stylesDialogModule.getStyleName(SanitizeHtmlHelper.sanitize(this.styleNameElement.value));
        if (styleName.length > 0) {
            let style: WStyle = this.documentHelper.styles.findByName(styleName) as WStyle;
            let name: string;
            if (!isNullOrUndefined(style)) {
                this.documentHelper.owner.editorHistoryModule.initializeHistory('ModifyStyle');
                if (this.styleType.value === 'Paragraph' || this.styleType.value === 'Linked Style') {
                    this.updateList();
                }
                if (this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo && this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo.action === 'ModifyStyle') {
                    let listId: number = style instanceof WParagraphStyle ? (style as WParagraphStyle).paragraphFormat.listFormat.listId : -1;
                    let styleObject = this.documentHelper.owner.getStyleObject(style, listId);
                    this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo.modifiedProperties.push(styleObject);
                    this.applyParagraphFormat();
                }
                this.documentHelper.owner.editorHistoryModule.updateHistory();
                this.style.type = this.getTypeValue();
                this.style.basedOn = this.documentHelper.styles.findByName(this.documentHelper.owner.stylesDialogModule.getStyleName(this.styleBasedOn.value as string)) as WStyle;

                if (this.styleType.value === 'Paragraph' || this.styleType.value === 'Linked Style') {
                    this.style.next = this.documentHelper.styles.findByName(this.documentHelper.owner.stylesDialogModule.getStyleName(this.styleParagraph.value as string)) as WStyle;
                    (this.style as WParagraphStyle).characterFormat.assignFormat(this.characterFormat);
                    (this.style as WParagraphStyle).paragraphFormat.assignFormat(this.paragraphFormat, true);
                    this.style.link = (this.styleType.value === 'Linked Style') ? this.createLinkStyle(styleName, this.isEdit) : undefined;
                }

                //Updating existing style implementation
                this.style.name = style.name;
                name = style.name;
                style = this.style;
                let listId: number = this.style instanceof WParagraphStyle ? (this.style as WParagraphStyle).paragraphFormat.listFormat.listId : -1;
                this.documentHelper.owner.setStyleData(name, listId);

                this.documentHelper.owner.isShiftingEnabled = true;
                this.documentHelper.owner.editorModule.isSkipOperationsBuild = this.documentHelper.owner.enableCollaborativeEditing;
                this.documentHelper.owner.editorModule.layoutWholeDocument();
                this.documentHelper.owner.editorModule.isSkipOperationsBuild = false;
                this.documentHelper.owner.isShiftingEnabled = false;
            } else {
                let tmpStyle: any = this.getTypeValue() === 'Paragraph' ? new WParagraphStyle() : new WCharacterStyle;
                tmpStyle.copyStyle(this.style);
                if (this.getTypeValue() === 'Character') {
                    (tmpStyle as WCharacterStyle).characterFormat.copyFormat(this.characterFormat);
                }
                let basedOn: any = this.documentHelper.styles.findByName(this.documentHelper.owner.stylesDialogModule.getStyleName(this.styleBasedOn.value as string)) as WStyle;
                if (this.styleType.value === 'Paragraph' || this.styleType.value === 'Linked Style') {
                    if (styleName === this.documentHelper.owner.stylesDialogModule.getStyleName(this.styleParagraph.value as string)) {
                        tmpStyle.next = tmpStyle;
                    } else {
                        tmpStyle.next = this.documentHelper.styles.findByName(this.documentHelper.owner.stylesDialogModule.getStyleName(this.styleParagraph.value as string)) as WStyle;
                    }
                    this.updateList();
                }

                tmpStyle.link = (this.styleType.value === 'Linked Style') ? this.createLinkStyle(styleName) : undefined;
                tmpStyle.type = this.getTypeValue();
                tmpStyle.name = styleName;
                tmpStyle.basedOn = basedOn;
                this.documentHelper.styles.push(tmpStyle as any);
                this.documentHelper.addToStylesMap(tmpStyle);
                name = styleName;
                this.documentHelper.owner.editorHistoryModule.initializeHistory('ModifyStyle');
                if (this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo && this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo.action === 'ModifyStyle') {
                    let listId: number = tmpStyle instanceof WParagraphStyle ? (tmpStyle as WParagraphStyle).paragraphFormat.listFormat.listId : -1;
                    let styleObject = this.documentHelper.owner.getStyleObject(tmpStyle, listId);
                    styleObject["isNew"] = true;
                    this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo.modifiedProperties.push(styleObject);
                    this.applyParagraphFormat();
                }
                this.documentHelper.owner.editorHistoryModule.updateHistory();
                let listId: number = this.style instanceof WParagraphStyle ? (this.style as WParagraphStyle).paragraphFormat.listFormat.listId : -1;
                this.documentHelper.owner.setStyleData(name, listId);
                this.documentHelper.owner.editorModule.isSkipOperationsBuild = this.styleType.value === 'Character' && this.documentHelper.owner.enableCollaborativeEditing;
                this.documentHelper.owner.editorModule.applyStyle(name,true);
                this.documentHelper.owner.editorModule.isSkipOperationsBuild = false;
                this.documentHelper.owner.notify(internalStyleCollectionChange, {});
            }
            this.documentHelper.dialog2.hide();
            this.documentHelper.updateFocus();
        } else {
            throw new Error('Enter valid Style name');
        }
        if (this.style) {
            //this.style.destroy();
        }
        this.documentHelper.updateFocus();
    }
    private updateList(): void {
        let listId: number = (this.style as WParagraphStyle).paragraphFormat.listFormat.listId;
        if (listId > -1) {
            if (this.documentHelper.lists.filter((a: WList) => (a.listId === listId)).length === 0) {
                this.documentHelper.lists.push((this.style as WParagraphStyle).paragraphFormat.listFormat.list);
            } else {
                this.documentHelper.lists = this.documentHelper.lists.filter((a: WList) => (a.listId !== listId));
                this.documentHelper.lists.push((this.style as WParagraphStyle).paragraphFormat.listFormat.list);
            }
        }
        if (this.abstractList.abstractListId !== -1) {
            this.documentHelper.abstractLists.push(this.abstractList);
        }
    }
    private createLinkStyle(name: string, isEdit?: boolean): WStyle {
        let charStyle: WCharacterStyle;
        if (isEdit) {
            charStyle = this.documentHelper.styles.findByName((name + ' Char'), 'Character') as WCharacterStyle;
        } else {
            charStyle = new WCharacterStyle();
        }
        charStyle.type = 'Character';
        charStyle.name = name + ' Char';
        charStyle.characterFormat = this.style.characterFormat.cloneFormat();
        charStyle.basedOn = this.style.basedOn;
        if (!isEdit) {
            this.documentHelper.styles.push(charStyle);
        }
        return this.documentHelper.styles.findByName(charStyle.name, 'Character') as WStyle;
    }
    /**
     * @private
     * @returns {void}
     */
    private loadStyleDialog = (): void => {
        this.documentHelper.updateFocus();
        this.isUserNextParaUpdated = false;

        this.styleNameElement = this.target.getElementsByClassName('e-input e-de-style-dlg-name-input').item(0) as HTMLInputElement;
        this.styleNameElement.value = null;
        if (!this.isEdit) {
            this.styleType.index = 0; //Set to paragraph            
        }
        let name: string;
        if (this.isEdit) {
            let localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
            localValue.setLocale(this.documentHelper.owner.locale);
            let styleName: string = localValue.getConstant(this.editStyleName);
            if(styleName === ''){
                styleName = this.editStyleName;
            }
            this.styleNameElement.value = styleName;
            name = this.editStyleName;
        }

        this.okButton = this.documentHelper.dialog2.element.getElementsByClassName('e-flat e-style-okay').item(0) as HTMLButtonElement;
        this.enableOrDisableOkButton();
        this.updateStyleNames(this.getTypeValue(), name);
        this.updateCharacterFormat(this.style.characterFormat);
        this.updateParagraphFormat((this.style as WParagraphStyle).paragraphFormat);
    }
    /**
     * @private
     * @param {L10n} characterFormat - Specifies the character format
     * @returns {void}
     */
    public updateCharacterFormat(characterFormat?: WCharacterFormat): void {
        if (!isNullOrUndefined(characterFormat)) {
            this.characterFormat = characterFormat.cloneFormat();
        }
        this.fontFamily.value = this.characterFormat.fontFamily;
        this.fontSize.value = this.characterFormat.fontSize;
        let color: string = this.characterFormat.fontColor;
        // "empty" is old value used for auto color till v19.2.49. It is maintained for backward compatibility.
        this.fontColor.value = (color === 'empty' || color === '#00000000') ? '#000000' : color;
        this.fontButtonClicked();
    }
    
    private applyParagraphFormat = (): void => {
        if (isNullOrUndefined(this.paragraphFormat)) {
            this.paragraphFormat = new WParagraphFormat();
        }
        if (!isNullOrUndefined(this.textAlignment)) {
            this.paragraphFormat.textAlignment = this.textAlignment;
        }
        if (!isNullOrUndefined(this.beforeSpacing)) {
            this.paragraphFormat.beforeSpacing = this.beforeSpacing;
        }
        if (!isNullOrUndefined(this.afterSpacing)) {
            this.paragraphFormat.afterSpacing = this.afterSpacing;
        }
        if (!isNullOrUndefined(this.leftIndent)) {
            this.paragraphFormat.leftIndent = this.leftIndent;
        }
        if (!isNullOrUndefined(this.lineSpacing)) {
            this.paragraphFormat.lineSpacing = this.lineSpacing;
        }
        this.updateParagraphFormat();
    }
    /**
     * @private
     * @returns {void}
     */
    public updateParagraphFormat(paragraphFOrmat?: WParagraphFormat): void {
        if (!isNullOrUndefined(paragraphFOrmat)) {
            this.paragraphFormat = paragraphFOrmat.cloneFormat();
            this.textAlignment = paragraphFOrmat.textAlignment;
            this.lineSpacing = paragraphFOrmat.lineSpacing;
        }
        if (isNullOrUndefined(this.paragraphFormat)) {
            return;
        }
        if (this.textAlignment === 'Left') {
            if (!this.leftAlign.classList.contains('e-active')) {
                this.leftAlign.classList.add('e-active');
            }
            if (this.rightAlign.classList.contains('e-active')) {
                this.rightAlign.classList.remove('e-active');
            }
            if (this.centerAlign.classList.contains('e-active')) {
                this.centerAlign.classList.remove('e-active');
            }
            if (this.justify.classList.contains('e-active')) {
                this.justify.classList.remove('e-active');
            }
        } else if (this.textAlignment === 'Right') {
            if (this.leftAlign.classList.contains('e-active')) {
                this.leftAlign.classList.remove('e-active');
            }
            if (!this.rightAlign.classList.contains('e-active')) {
                this.rightAlign.classList.add('e-active');
            }
            if (this.centerAlign.classList.contains('e-active')) {
                this.centerAlign.classList.remove('e-active');
            }
            if (this.justify.classList.contains('e-active')) {
                this.justify.classList.remove('e-active');
            }
        } else if (this.textAlignment === 'Center') {
            if (this.leftAlign.classList.contains('e-active')) {
                this.leftAlign.classList.remove('e-active');
            }
            if (this.rightAlign.classList.contains('e-active')) {
                this.rightAlign.classList.remove('e-active');
            }
            if (!this.centerAlign.classList.contains('e-active')) {
                this.centerAlign.classList.add('e-active');
            }
            if (this.justify.classList.contains('e-active')) {
                this.justify.classList.remove('e-active');
            }
        } else if (this.textAlignment === 'Justify') {
            if (this.leftAlign.classList.contains('e-active')) {
                this.leftAlign.classList.remove('e-active');
            }
            if (this.rightAlign.classList.contains('e-active')) {
                this.rightAlign.classList.remove('e-active');
            }
            if (this.centerAlign.classList.contains('e-active')) {
                this.centerAlign.classList.remove('e-active');
            }
            if (!this.justify.classList.contains('e-active')) {
                this.justify.classList.add('e-active');
            }
        }
        if (this.lineSpacing === 1) {
            this.singleLineSpacing.classList.add('e-active');
            this.onePointFiveLineSpacing.classList.remove('e-active');
            this.doubleLineSpacing.classList.remove('e-active');
        } else if (this.lineSpacing === 1.5) {
            this.singleLineSpacing.classList.remove('e-active');
            this.onePointFiveLineSpacing.classList.add('e-active');
            this.doubleLineSpacing.classList.remove('e-active');
        } else if (this.lineSpacing === 2) {
            this.singleLineSpacing.classList.remove('e-active');
            this.onePointFiveLineSpacing.classList.remove('e-active');
            this.doubleLineSpacing.classList.add('e-active');
        } else {
            this.singleLineSpacing.classList.remove('e-active');
            this.onePointFiveLineSpacing.classList.remove('e-active');
            this.doubleLineSpacing.classList.remove('e-active');
        }
    }

    private enableOrDisableOkButton(): void {
        if (!isNullOrUndefined(this.okButton)) {
            this.okButton.disabled = (this.styleNameElement.value === '');
        }
    }
    /**
     * @private
     */
    public getTypeValue(type?: string): StyleType {
        let value = !isNullOrUndefined(type)? type : this.styleType.value;
        if (value === 'Linked Style' || value === 'Paragraph') {
            return 'Paragraph';
        } else {
            return 'Character';
        }
    }
    private updateStyleNames(type: StyleType, name?: string): void {
        let localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        let styles: string[] = this.documentHelper.styles.getStyleNames(type);
        let finalList: string[] = [];
        for (let i: number = 0; i < styles.length; i++) {
            let styleName: string = localValue.getConstant(styles[parseInt(i.toString(), 10)]);
            if(styleName === '') {
                styleName = styles[parseInt(i.toString(), 10)];
            }
            finalList.push(styleName);
        }
        this.styleParagraph.dataSource = finalList;
        this.styleParagraph.index = null;
        if (name) {
            this.styleBasedOn.dataSource = finalList.filter((e: string) => e !== name);
            this.styleBasedOn.index = null;
            let style: WStyle = this.getStyle(name);
            if (style.basedOn instanceof String || isNullOrUndefined(style.basedOn)) {
                this.styleBasedOn.enabled = false;
            } else {

                this.styleBasedOn.index = styles.indexOf(style.basedOn.name) > -1 ? styles.indexOf(style.basedOn.name) : 0;
            }
            if (style.type === 'Paragraph') {
                if (!isNullOrUndefined(style.link)) {
                    this.styleType.index = 2;
                } else {
                    this.styleType.index = 0;
                }
            } else {
                this.styleType.index = 1;
            }
            if (!isNullOrUndefined(style.next)) {
                let nxtName: string = style.next.name;
                let index: number = 0;
                if (styles.indexOf(nxtName) > -1) {
                    index = styles.indexOf(nxtName);
                }
                this.styleParagraph.index = index;
                this.isUserNextParaUpdated = (nxtName === name) ? false : true;
            }
        } else {
            this.styleBasedOn.dataSource = finalList;
            this.styleBasedOn.index = null;
            let basedOnIndex: number = 0;
            if (this.documentHelper.owner.selectionModule) {
                let styleName: string;
                if (type === 'Character') {
                    styleName = this.documentHelper.owner.selectionModule.characterFormat.styleName;
                } else {
                    styleName = this.documentHelper.owner.selectionModule.paragraphFormat.styleName;
                }
                basedOnIndex = styles.indexOf(styleName);
            }
            this.styleBasedOn.index = basedOnIndex;
            this.styleParagraph.index = 0;
        }
        if (this.isEdit) {
            this.styleType.enabled = false;
        } else {
            this.styleType.enabled = true;
        }
        // this.styleBasedOn.dataBind();
        // this.styleParagraph.dataBind();
    }

    private getStyle(styleName: string): WStyle {

        if (isNullOrUndefined(this.documentHelper.styles.findByName(styleName))) {

            this.documentHelper.owner.editorModule.createStyle(this.documentHelper.preDefinedStyles.get(styleName));
        }
        return this.documentHelper.styles.findByName(styleName) as WStyle;
    }
    /**
     * @private
     * @returns {void}
     */
    public onCancelButtonClick = (): void => {
        // if (!this.isEdit && this.style) {
            this.style = undefined;
            this.characterFormat = undefined;
            this.paragraphFormat = undefined;
            this.textAlignment = undefined;
            this.lineSpacing = undefined;
            this.leftIndent = undefined;
            this.beforeSpacing = undefined;
            this.afterSpacing = undefined;
        // }
        this.documentHelper.dialog2.hide();
        this.documentHelper.updateFocus();
    }
    /**
     * @private
     * @returns {void}
     */
    public closeStyleDialog = (): void => {
        this.documentHelper.updateFocus();
        this.textAlignment = undefined;
        this.lineSpacing = undefined;
        this.leftIndent = undefined;
        this.beforeSpacing = undefined;
        this.afterSpacing = undefined;
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let n: number = 0; n < this.target.childNodes.length; n++) {
                this.target.removeChild(this.target.childNodes[n]);
                n--;
            }
            this.target = undefined;
        }
        if (this.characterFormat) {
            this.characterFormat.destroy();
            this.characterFormat = undefined;
        }
        if (this.paragraphFormat) {
            this.paragraphFormat.destroy();
            this.paragraphFormat = undefined;
        }
        if (this.fontColor) {
            this.fontColor.destroy();
            this.fontColor = undefined;
        }
        if (this.fontSize) {
            this.fontSize.destroy();
            this.fontSize = undefined;
        }
        if (this.fontFamily) {
            this.fontFamily.destroy();
            this.fontFamily = undefined;
        }
        if (this.styleType) {
            this.styleType.destroy();
            this.styleType = undefined;
        }
        if (this.styleBasedOn) {
            this.styleBasedOn.destroy();
            this.styleBasedOn = undefined;
        }
        if (this.styleParagraph) {
            this.styleParagraph.destroy();
            this.styleParagraph = undefined;
        }
        if (this.onlyThisDocument) {
            this.onlyThisDocument.destroy();
        }
        this.onlyThisDocument = undefined;
        if (this.template) {
            this.template.destroy();
            this.template = undefined;
        }
        if (this.style) {
            this.style.destroy();
            this.style = undefined;
        }
        if (this.abstractList) {
            this.abstractList.destroy();
            this.abstractList = undefined;
        }
        if (this.numberingBulletDialog) {
            this.numberingBulletDialog.destroy();
            this.numberingBulletDialog = undefined;
        }
        if (this.styleDropdwn) {
            this.styleDropdwn.destroy();
            this.styleDropdwn = undefined;
        }
        if (this.textAlignment) {
            this.textAlignment = undefined;
        }
        if (this.lineSpacing) {
            this.lineSpacing = undefined;
        }
        if (this.leftIndent) {
            this.leftIndent = undefined;
        }
        if (this.beforeSpacing) {
            this.beforeSpacing = undefined;
        }
        if (this.afterSpacing) {
            this.afterSpacing = undefined;
        }
        this.documentHelper = undefined;
    }
}