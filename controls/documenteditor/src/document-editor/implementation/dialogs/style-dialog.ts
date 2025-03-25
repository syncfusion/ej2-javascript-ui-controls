import { createElement, isNullOrUndefined, L10n, initializeCSPTemplate, attributes, updateCSSText } from '@syncfusion/ej2-base';
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

    private container: HTMLElement;
    private properties: HTMLElement;
    private styleNameTypeDiv: HTMLElement;
    private nameWholeDiv: HTMLElement;
    private nameValue: HTMLInputElement;
    private styleTypeWholeDiv: HTMLElement;
    private styleTypeDivElement: HTMLElement;
    private styleTypeValue: HTMLSelectElement;
    private styleBasedParaDiv: HTMLElement;
    private styleBasedOnWholeDiv: HTMLElement;
    private styleBasedOnDivElement: HTMLElement;
    private styleBasedOnValue: HTMLInputElement;
    private styleParagraphWholeDiv: HTMLElement;
    private styleParagraphDivElement: HTMLElement;
    private styleParagraphValue: HTMLInputElement;
    private formatting: HTMLElement;
    private optionsDiv: HTMLElement;
    private fontOptionsDiv: HTMLElement;
    private paragraphOptionsDiv: HTMLElement;
    private formatBtn: HTMLElement;
    private fontFamilyElement: HTMLElement;
    private fontSizeElement: HTMLElement;
    private fontGroupButton: HTMLElement;
    private fontColorElement: HTMLElement;
    private alignmentDiv: HTMLElement;
    private lineSpacingDiv: HTMLElement;
    private spacingDiv: HTMLElement;
    private beforeSpacingEle: HTMLElement;
    private afterSpacingEle: HTMLElement;
    private indentingDiv: HTMLElement;
    private decreaseIndent: HTMLElement;
    private increaseindent: HTMLElement;

    private setLeftAlignmentClickHandler: EventListenerOrEventListenerObject = this.onSetLeftAlignmentClick.bind(this);
    private setCenterAlignmentClickHandler: EventListenerOrEventListenerObject = this.onSetCenterAlignmentClick.bind(this);
    private setRightAlignmentClickHandler: EventListenerOrEventListenerObject = this.onSetRightAlignmentClick.bind(this);
    private setJustifyAlignmentClickHandler: EventListenerOrEventListenerObject = this.onSetJustifyAlignmentClick.bind(this);
    private setSingleLineSpacingClickHandler: EventListenerOrEventListenerObject = this.setSingleLineSpacing.bind(this);
    private setOnePointFiveLineSpacingClickHandler: EventListenerOrEventListenerObject = this.setOnePointFiveLineSpacing.bind(this);
    private setDoubleLineSpacingClickHandler: EventListenerOrEventListenerObject = this.setDoubleLineSpacing.bind(this);
    private increaseIndentValueHandler: EventListenerOrEventListenerObject = this.increaseIndentValue.bind(this);
    private decreaseIndentValueHandler: EventListenerOrEventListenerObject = this.decreaseIndentValue.bind(this);
    private increaseBeforeAfterSpacingValueHandler: EventListenerOrEventListenerObject = this.onIncreaseBeforeAfterSpacing.bind(this);
    private decreaseBeforeAfterSpacingValueHandler: EventListenerOrEventListenerObject = this.onDecreaseBeforeAfterSpacing.bind(this);
    private setUnderlinePropertyHandler: EventListenerOrEventListenerObject = this.onSetUnderlineProperty.bind(this);
    private setItalicPropertyHandler: EventListenerOrEventListenerObject = this.onSetItalicProperty.bind(this);
    private setBoldPropertyHandler: EventListenerOrEventListenerObject = this.onSetBoldProperty.bind(this);
    private openDialogHandler: EventListener = this.onOpenDialog.bind(this);
    private updateOkButtonClickHandler: EventListenerOrEventListenerObject = this.onUpdateOkButtonClick.bind(this);
    private updateNextStyleHandler: EventListenerOrEventListenerObject = this.onUpdateNextStyle.bind(this);

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
        this.container = createElement('div');

        this.properties = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: localValue.getConstant('Properties') });
        this.container.appendChild(this.properties);
        this.styleNameTypeDiv = createElement('div', { className: 'e-de-container-row' });
        this.container.appendChild(this.styleNameTypeDiv);
        this.nameWholeDiv = createElement('div', { className: 'e-de-subcontainer-left' });
        this.styleNameTypeDiv.appendChild(this.nameWholeDiv);
        // let name: HTMLElement = createElement('div', { className: 'e-de-style-name', innerHTML: localValue.getConstant('Name') + ':' });
        // nameWholeDiv.appendChild(name);

        this.nameValue = createElement('input', { className: 'e-input e-de-style-dlg-name-input' }) as HTMLInputElement;
        this.nameValue.addEventListener('keyup', this.updateOkButtonClickHandler);
        this.nameValue.addEventListener('input', this.updateOkButtonClickHandler);
        this.nameValue.addEventListener('blur', this.updateNextStyleHandler);
        this.nameWholeDiv.appendChild(this.nameValue);
        new TextBox({placeholder: localValue.getConstant('Name') + ':', floatLabelType: 'Always' }, this.nameValue);
        this.styleTypeWholeDiv = createElement('div', {className : 'e-de-subcontainer-right'});
        this.styleNameTypeDiv.appendChild(this.styleTypeWholeDiv);

        // let styleType: HTMLElement = createElement('div', { className: 'e-de-style-styletype', innerHTML:  });
        // styleTypeWholeDiv.appendChild(styleType);
        this.styleTypeDivElement = createElement('div');
        this.styleTypeValue = createElement('select') as HTMLSelectElement;

        this.styleTypeValue.innerHTML = '<option value="Paragraph">' + localValue.getConstant('Paragraph') + '</option><option value="Character">' + localValue.getConstant('Character') + '</option><option value="Linked Style">' + localValue.getConstant('Linked Style') + '</option>';
        this.styleTypeDivElement.appendChild(this.styleTypeValue);
        this.styleType = new DropDownList({
            change: this.styleTypeChange,
            popupHeight: '253px', enableRtl: isRtl,
            placeholder: localValue.getConstant('Style type') + ':', floatLabelType: 'Always'
        });
        this.styleType.appendTo(this.styleTypeValue);
        this.styleTypeWholeDiv.appendChild(this.styleTypeDivElement);

        this.styleBasedParaDiv = createElement('div', { className: 'e-de-container-row' });
        this.container.appendChild(this.styleBasedParaDiv);
        this.styleBasedOnWholeDiv = createElement('div', { className: 'e-de-subcontainer-left' });
        this.styleBasedParaDiv.appendChild(this.styleBasedOnWholeDiv);

        //let styleBasedOn: HTMLElement = createElement('div', { className: 'e-de-style-style-based-on', innerHTML:  });
        //styleBasedOnWholeDiv.appendChild(styleBasedOn);
        this.styleBasedOnDivElement = createElement('div', { className: 'e-de-style-style-based-on-div' });

        this.styleBasedOnValue = createElement('input') as HTMLInputElement;
        //styleBasedOnValue.innerHTML = '<option>Normal</option><option>Heading 1</option><option>Heading 2</option><option>Heading 3</option><option>Heading 4</option><option>Heading 5</option><option>Heading 6</option>';
        this.styleBasedOnDivElement.appendChild(this.styleBasedOnValue);

        this.styleBasedOn = new DropDownList({
            dataSource: [], select: this.styleBasedOnChange, popupHeight: '253px', enableRtl: isRtl,
            placeholder: localValue.getConstant('Style based on') + ':', floatLabelType: 'Always'
        });
        this.styleBasedOn.appendTo(this.styleBasedOnValue);
        this.styleBasedOnWholeDiv.appendChild(this.styleBasedOnDivElement);

        this.styleParagraphWholeDiv = createElement('div', { className: 'e-de-subcontainer-right' });
        this.styleBasedParaDiv.appendChild(this.styleParagraphWholeDiv);
        if (isRtl) {
            this.nameWholeDiv.classList.add('e-de-rtl');
            this.styleBasedOnWholeDiv.classList.add('e-de-rtl');
            this.styleParagraphWholeDiv.classList.add('e-de-rtl');
        }

        //let styleParagraph: HTMLElement = createElement('div', { className: 'e-de-style-style-paragraph', innerHTML: });
        //styleParagraphWholeDiv.appendChild(styleParagraph);
        this.styleParagraphDivElement = createElement('div');

        this.styleParagraphValue = createElement('input') as HTMLInputElement;

        //styleParagraphValue.innerHTML = '<option>Normal</option><option>Heading 1</option><option>Heading 2</option><option>Heading 3</option><option>Heading 4</option><option>Heading 5</option><option>Heading 6</option>';
        this.styleParagraphDivElement.appendChild(this.styleParagraphValue);

        this.styleParagraph = new DropDownList({
            dataSource: [], select: this.styleParagraphChange, popupHeight: '253px', enableRtl: isRtl,
            placeholder: localValue.getConstant('Style for following paragraph') + ':', floatLabelType: 'Always'
        });
        this.styleParagraph.appendTo(this.styleParagraphValue);
        this.styleParagraphWholeDiv.appendChild(this.styleParagraphDivElement);
        this.formatting = createElement('div', { className: 'e-de-para-dlg-heading', innerHTML: localValue.getConstant('Formatting') });
        this.container.appendChild(this.formatting);
        this.optionsDiv = createElement('div', { className: 'e-de-style-options-div' });
        this.container.appendChild(this.optionsDiv);
        this.fontOptionsDiv = createElement('div', { styles: 'display:flex;margin-bottom: 14px;' });
        this.optionsDiv.appendChild(this.fontOptionsDiv);
        this.createFontOptions(this.fontOptionsDiv, isRtl);
        this.paragraphOptionsDiv = createElement('div', { styles: 'display:flex', className: 'e-style-paragraph' });
        this.optionsDiv.appendChild(this.paragraphOptionsDiv);
        this.createParagraphOptions(this.paragraphOptionsDiv);


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
        this.createFormatDropdown(this.container, localValue, isRtl);
        this.target.appendChild(this.container);
    }
    private createFormatDropdown(parentDiv: HTMLElement, localValue: L10n, isRtl?: boolean): void {
        this.formatBtn = createElement('button', {
            id: 'style_format_dropdown', innerHTML: localValue.getConstant('Format'),
            attrs: { type: 'button' }
        });
        this.formatBtn.style.height = '31px';
        parentDiv.appendChild(this.formatBtn);
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
        this.styleDropdwn.appendTo(this.formatBtn);
        this.styleDropdwn.addEventListener('select', this.openDialogHandler);
    }
    private onOpenDialog(args: MenuEventArgs): void {
        this.openDialog(args);
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
        this.fontFamilyElement = createElement('input', {
            id: this.target.id + '_fontName',
        });
        let fontStyle: { [key: string]: Object; }[];
        let isStringTemplate: boolean = true;        
        let itemTemplate: string | Function = initializeCSPTemplate(
            function (data: any): string { return `<span style="font-family: ${data.FontName};">${data.FontName}</span>`; }
        );
        parentDiv.appendChild(this.fontFamilyElement);
        this.fontFamily = new ComboBox({
            dataSource: fontStyle, query: new Query().select(['FontName']), fields: { text: 'FontName', value: 'value' },
            allowCustom: true, width: '123px', popupWidth: '123px',
            cssClass: 'e-style-font-fmaily-right', enableRtl: isRtl, change: this.fontFamilyChanged,
            showClearButton: false, itemTemplate: itemTemplate
        });
        this.fontFamily.appendTo(this.fontFamilyElement);
        this.fontFamily.isStringTemplate = isStringTemplate;
        let fontFamilyValue: string[] = this.documentHelper.owner.documentEditorSettings.fontFamilies;
        for (let i: number = 0; i < fontFamilyValue.length; i++) {
            let fontValue: string = fontFamilyValue[i];
            let fontStyleValue: { [key: string]: Object; } = { 'FontName': fontValue, 'value': fontValue };
            this.fontFamily.addItem(fontStyleValue, i);
        }
        this.fontFamily.focus = (): void => { (this.fontFamily.element as HTMLInputElement).select(); };
        this.fontFamily.element.parentElement.setAttribute('title', this.localObj.getConstant('Font'));
        this.fontSizeElement = createElement('input');
        parentDiv.appendChild(this.fontSizeElement);
        let sizeDataSource: number[] = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
        this.fontSize = new ComboBox({
            dataSource: sizeDataSource, width: '73px', cssClass: 'e-style-font-fmaily-right',
            enableRtl: isRtl, change: this.fontSizeUpdate
        });
        this.fontSize.showClearButton = false;
        this.fontSize.appendTo(this.fontSizeElement);
        this.fontGroupButton = createElement('div', { className: 'e-de-style-font-group-button' });
        parentDiv.appendChild(this.fontGroupButton);

        this.bold = this.createButtonElement(this.fontGroupButton, 'e-de-bold', 'e-de-style-bold-button-size', this.documentHelper.owner.containerId + '_style_bold');
        this.bold.setAttribute('aria-label','bold');
        this.bold.addEventListener('click', this.setBoldPropertyHandler);

        this.italic = this.createButtonElement(this.fontGroupButton, 'e-de-italic', 'e-de-style-icon-button-size', this.documentHelper.owner.containerId + '_style_italic');
        this.italic.setAttribute('aria-label','italic');
        this.italic.addEventListener('click', this.setItalicPropertyHandler);

        this.underline = this.createButtonElement(this.fontGroupButton, 'e-de-underline', 'e-de-style-icon-button-size', this.documentHelper.owner.containerId + '_style_underline');
        this.underline.setAttribute('aria-label','underline');
        this.underline.addEventListener('click', this.setUnderlinePropertyHandler);
        this.fontColorElement = createElement('input', { attrs: { type: 'color' }, className: 'e-de-style-icon-button-size' });
        parentDiv.appendChild(this.fontColorElement);
        const {columns , createPopupOnClick  , disabled , enablePersistence , enableRtl , inline , mode , modeSwitcher , noColor , presetColors , showButtons} = this.documentHelper.owner.documentEditorSettings.colorPickerSettings;
        this.fontColor = new ColorPicker({ cssClass: 'e-de-style-font-color-picker', enableRtl: isRtl, change: this.fontColorUpdate, locale: this.documentHelper.owner.locale, enableOpacity: false , mode:mode , modeSwitcher:modeSwitcher , showButtons: showButtons , columns:columns , createPopupOnClick : createPopupOnClick , disabled : disabled , enablePersistence : enablePersistence , inline : inline , noColor : noColor , presetColors : presetColors });
        this.documentHelper.fontColor = this.fontColor;
        this.fontColor.appendTo(this.fontColorElement);
    }
    private onSetBoldProperty(): void {
        this.setBoldProperty();
    }
    /**
     * @private
     * @returns {void}
     */
    private setBoldProperty = (): void => {
        this.characterFormat.bold = !this.characterFormat.bold;
        this.fontButtonClicked();
    }
    private onSetItalicProperty(): void {
        this.setItalicProperty();
    }
    /**
     * @private
     * @returns {void}
     */
    private setItalicProperty = (): void => {
        this.characterFormat.italic = !this.characterFormat.italic;
        this.fontButtonClicked();
    }
    private onSetUnderlineProperty(): void {
        this.setUnderlineProperty();
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
        this.alignmentDiv = createElement('div', { className: 'e-de-style-paragraph-group-button' });
        parentDiv.appendChild(this.alignmentDiv);
        this.leftAlign = this.createButtonElement(this.alignmentDiv, 'e-de-align-left', 'e-de-style-icon-button-size');
        this.leftAlign.setAttribute('aria-label','leftAlign');
        this.leftAlign.addEventListener('click', this.setLeftAlignmentClickHandler);
        this.centerAlign = this.createButtonElement(this.alignmentDiv, 'e-de-align-center', 'e-de-style-icon-button-size');
        this.centerAlign.setAttribute('aria-label','centerAlign');
        this.centerAlign.addEventListener('click', this.setCenterAlignmentClickHandler);
        this.rightAlign = this.createButtonElement(this.alignmentDiv, 'e-de-align-right', 'e-de-style-icon-button-size');
        this.rightAlign.setAttribute('aria-label','rightAlign');
        this.rightAlign.addEventListener('click', this.setRightAlignmentClickHandler);
        this.justify = this.createButtonElement(this.alignmentDiv, 'e-de-justify', 'e-de-style-icon-button-last-size');
        this.justify.setAttribute('aria-label','justify');
        this.justify.addEventListener('click', this.setJustifyAlignmentClickHandler);
        this.lineSpacingDiv = createElement('div', { className: 'e-de-style-paragraph-group-button' });
        parentDiv.appendChild(this.lineSpacingDiv);
        this.singleLineSpacing = this.createButtonElement(this.lineSpacingDiv, 'e-de-single-spacing', 'e-de-style-icon-button-first-size');
        this.singleLineSpacing.setAttribute('aria-label','singleLineSpacing');
        this.singleLineSpacing.addEventListener('click', this.setSingleLineSpacingClickHandler);

        this.onePointFiveLineSpacing = this.createButtonElement(this.lineSpacingDiv, 'e-de-one-point-five-spacing', 'e-de-style-icon-button-size');
        this.onePointFiveLineSpacing.setAttribute('aria-label','onePointFiveLineSpacing');
        this.onePointFiveLineSpacing.addEventListener('click', this.setOnePointFiveLineSpacingClickHandler);
        this.doubleLineSpacing = this.createButtonElement(this.lineSpacingDiv, 'e-de-double-spacing', 'e-de-style-icon-button-last-size');
        this.doubleLineSpacing.setAttribute('aria-label','doubleLineSpacing');
        this.doubleLineSpacing.addEventListener('click', this.setDoubleLineSpacingClickHandler);
        this.spacingDiv = createElement('div', { className: 'e-de-style-paragraph-group-button' });
        parentDiv.appendChild(this.spacingDiv);
        this.beforeSpacingEle = this.createButtonElement(this.spacingDiv, 'e-de-before-spacing', 'e-de-style-icon-button-first-size');
        this.beforeSpacingEle.setAttribute('aria-label','beforeSpacing');
        this.afterSpacingEle = this.createButtonElement(this.spacingDiv, 'e-de-after-spacing', 'e-de-style-icon-button-last-size');
        this.afterSpacingEle.setAttribute('aria-label','afterSpacing');
        this.beforeSpacingEle.addEventListener('click', this.increaseBeforeAfterSpacingValueHandler);
        this.afterSpacingEle.addEventListener('click', this.decreaseBeforeAfterSpacingValueHandler);
        this.indentingDiv = createElement('div', { className: 'e-de-style-paragraph-indent-group-button' });
        parentDiv.appendChild(this.indentingDiv);
        this.decreaseIndent = this.createButtonElement(this.indentingDiv, 'e-de-indent', 'e-de-style-icon-button-first-size');
        this.decreaseIndent.setAttribute('aria-label','decreaseIndent');
        this.decreaseIndent.addEventListener('click', this.decreaseIndentValueHandler);
        this.increaseindent = this.createButtonElement(this.indentingDiv, 'e-de-outdent', 'e-de-style-icon-button-size');
        this.increaseindent.setAttribute('aria-label','increaseindent');
        this.increaseindent.addEventListener('click', this.increaseIndentValueHandler);
    }
    private setSingleLineSpacing(): void {
        this.lineSpacing = 1;
        this.updateParagraphFormat();
    }
    private setOnePointFiveLineSpacing(): void {
        this.lineSpacing = 1.5;
        this.updateParagraphFormat();
    }
    private setDoubleLineSpacing(): void {
        this.lineSpacing = 2;
        this.updateParagraphFormat();
    }
    private increaseIndentValue(): void {
        this.leftIndent += 36;
    }
    private decreaseIndentValue(): void {
        if (this.leftIndent >= 36) {
            this.leftIndent -= 36;
        } else {
            this.leftIndent = 0;
        }
    }
    private onSetLeftAlignmentClick(): void {
        this.setLeftAlignment();
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
    private onSetRightAlignmentClick(): void {
        this.setRightAlignment();
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
    private onSetCenterAlignmentClick(): void {
        this.setCenterAlignment();
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
    private onSetJustifyAlignmentClick(): void {
        this.setJustifyAlignment();
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
    private onIncreaseBeforeAfterSpacing(): void {
        this.increaseBeforeAfterSpacing();
    }
    /**
     * @private
     * @returns {void}
     */
    private increaseBeforeAfterSpacing = (): void => {
        this.beforeSpacing += 6;
        this.afterSpacing += 6;
    }
    private onDecreaseBeforeAfterSpacing(): void {
        this.decreaseBeforeAfterSpacing();
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
            const cssText: string = 'display:flex;pointer-events:none;opacity:0.5';
            this.styleParagraph.enabled = false;

            updateCSSText(this.target.getElementsByClassName('e-style-paragraph').item(0) as HTMLElement, cssText);
        } else {
            const cssText: string = 'display:flex';
            this.styleParagraph.enabled = true;
            this.target.getElementsByClassName('e-style-paragraph').item(0).removeAttribute('style');
            updateCSSText(this.target.getElementsByClassName('e-style-paragraph').item(0) as HTMLElement, cssText);
        }
        this.styleBasedOn.enabled = true;
    }
    private onUpdateNextStyle(args: FocusEvent): void {
        this.updateNextStyle(args);
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
    private onUpdateOkButtonClick(): void {
        this.updateOkButton();
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
                tmpStyle.characterFormat=this.characterFormat;
                tmpStyle.paragraphFormat=this.paragraphFormat;
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
        this.removeEvents();
        this.removeElements();
        this.documentHelper = undefined;
    }
    private removeEvents(): void {
        if (this.nameValue) {
            this.nameValue.removeEventListener('input', this.updateOkButtonClickHandler);
            this.nameValue.removeEventListener('keyup', this.updateOkButtonClickHandler);
            this.nameValue.removeEventListener('blur', this.updateNextStyleHandler);
        }
        if (this.styleDropdwn) {
            this.styleDropdwn.removeEventListener('select', this.openDialogHandler);
        }
        if (this.bold) {
            this.bold.removeEventListener('click', this.setBoldPropertyHandler);
        }
        if (this.italic) {
            this.italic.removeEventListener('click', this.setItalicPropertyHandler);
        }
        if (this.underline) {
            this.underline.removeEventListener('click', this.setUnderlinePropertyHandler);
        }
        if (this.leftAlign) {
            this.leftAlign.removeEventListener('click', this.setLeftAlignmentClickHandler);
        }
        if (this.centerAlign) {
            this.centerAlign.removeEventListener('click', this.setCenterAlignmentClickHandler);
        }
        if (this.rightAlign) {
            this.rightAlign.removeEventListener('click', this.setRightAlignmentClickHandler);
        }
        if (this.justify) {
            this.justify.removeEventListener('click', this.setJustifyAlignmentClickHandler);
        }
        if (this.singleLineSpacing) {
            this.singleLineSpacing.removeEventListener('click', this.setSingleLineSpacingClickHandler);
        }
        if (this.onePointFiveLineSpacing) {
            this.onePointFiveLineSpacing.removeEventListener('click', this.setOnePointFiveLineSpacingClickHandler);
        }
        if (this.doubleLineSpacing) {
            this.doubleLineSpacing.removeEventListener('click', this.setDoubleLineSpacingClickHandler);
        }
        if (this.beforeSpacingEle) {
            this.beforeSpacingEle.removeEventListener('click', this.increaseBeforeAfterSpacingValueHandler);
        }
        if (this.afterSpacingEle) {
            this.afterSpacingEle.removeEventListener('click', this.decreaseBeforeAfterSpacingValueHandler);
        }
        if (this.decreaseIndent) {
            this.decreaseIndent.removeEventListener('click', this.decreaseIndentValueHandler);
        }
        if (this.increaseindent) {
            this.increaseindent.removeEventListener('click', this.increaseIndentValueHandler);
        }
    }
    private removeElements(): void {
        if (this.container) {
            this.container.remove();
            this.container = undefined;
        }
        if (this.properties) {
            this.properties.remove();
            this.properties = undefined;
        }
        if (this.styleNameTypeDiv) {
            this.styleNameTypeDiv.remove();
            this.styleNameTypeDiv = undefined;
        }
        if (this.nameWholeDiv) {
            this.nameWholeDiv.remove();
            this.nameWholeDiv = undefined;
        }
        if (this.nameValue) {
            this.nameValue.remove();
            this.nameValue = undefined;
        }
        if (this.styleTypeWholeDiv) {
            this.styleTypeWholeDiv.remove();
            this.styleTypeWholeDiv = undefined;
        }
        if (this.styleTypeDivElement) {
            this.styleTypeDivElement.remove();
            this.styleTypeDivElement = undefined;
        }
        if (this.styleTypeValue) {
            this.styleTypeValue.remove();
            this.styleTypeValue = undefined;
        }
        if (this.styleBasedParaDiv) {
            this.styleBasedParaDiv.remove();
            this.styleBasedParaDiv = undefined;
        }
        if (this.styleBasedOnWholeDiv) {
            this.styleBasedOnWholeDiv.remove();
            this.styleBasedOnWholeDiv = undefined;
        }
        if (this.styleBasedOnDivElement) {
            this.styleBasedOnDivElement.remove();
            this.styleBasedOnDivElement = undefined;
        }
        if (this.styleBasedOnValue) {
            this.styleBasedOnValue.remove();
            this.styleBasedOnValue = undefined;
        }
        if (this.styleParagraphWholeDiv) {
            this.styleParagraphWholeDiv.remove();
            this.styleParagraphWholeDiv = undefined;
        }
        if (this.styleParagraphDivElement) {
            this.styleParagraphDivElement.remove();
            this.styleParagraphDivElement = undefined;
        }
        if (this.styleParagraphValue) {
            this.styleParagraphValue.remove();
            this.styleParagraphValue = undefined;
        }
        if (this.formatting) {
            this.formatting.remove();
            this.formatting = undefined;
        }
        if (this.optionsDiv) {
            this.optionsDiv.remove();
            this.optionsDiv = undefined;
        }
        if (this.fontOptionsDiv) {
            this.fontOptionsDiv.remove();
            this.fontOptionsDiv = undefined;
        }
        if (this.paragraphOptionsDiv) {
            this.paragraphOptionsDiv.remove();
            this.paragraphOptionsDiv = undefined;
        }
        if (this.formatBtn) {
            this.formatBtn.remove();
            this.formatBtn = undefined;
        }
        if (this.fontFamilyElement) {
            this.fontFamilyElement.remove();
            this.fontFamilyElement = undefined;
        }
        if (this.fontSizeElement) {
            this.fontSizeElement.remove();
            this.fontSizeElement = undefined;
        }
        if (this.fontGroupButton) {
            this.fontGroupButton.remove();
            this.fontGroupButton = undefined;
        }
        if (this.fontColorElement) {
            this.fontColorElement.remove();
            this.fontColorElement = undefined;
        }
        if (this.alignmentDiv) {
            this.alignmentDiv.remove();
            this.alignmentDiv = undefined;
        }
        if (this.lineSpacingDiv) {
            this.lineSpacingDiv.remove();
            this.lineSpacingDiv = undefined;
        }
        if (this.spacingDiv){
            this.spacingDiv.remove();
            this.spacingDiv = undefined;
        }
        if (this.beforeSpacingEle) {
            this.beforeSpacingEle.remove();
            this.beforeSpacingEle = undefined;
        }
        if (this.afterSpacingEle) {
            this.afterSpacingEle.remove();
            this.afterSpacingEle = undefined;
        }
        if (this.indentingDiv) {
            this.indentingDiv.remove();
            this.indentingDiv = undefined;
        }
        if (this.decreaseIndent) {
            this.decreaseIndent.remove();
            this.decreaseIndent = undefined;
        }
        if (this.increaseindent) {
            this.increaseindent.remove();
            this.increaseindent = undefined;
        }
    }
}