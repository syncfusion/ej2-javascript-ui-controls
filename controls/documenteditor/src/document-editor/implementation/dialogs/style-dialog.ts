import { createElement, isNullOrUndefined, L10n, setCulture } from '@syncfusion/ej2-base';
import { DropDownList, ComboBox } from '@syncfusion/ej2-dropdowns';
import { RadioButton, Button } from '@syncfusion/ej2-buttons';
import { WStyle, WCharacterStyle, WParagraphStyle } from '../../implementation/format/style';
import { StyleType } from '../../base';
import { BulletsAndNumberingDialog } from './index';
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { LayoutViewer, WCharacterFormat, WParagraphFormat } from '../index';
import { ColorPicker } from '@syncfusion/ej2-inputs';
import { DropDownButton, ItemModel } from '@syncfusion/ej2-splitbuttons';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';

/**
 * The Style dialog is used to create or modify styles.
 */
export class StyleDialog {
    private owner: LayoutViewer;
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

    /**
     * @private
     */
    constructor(viewer: LayoutViewer) {
        this.owner = viewer;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'StyleDialog';
    }
    /**
     * @private
     */
    //tslint:disable: max-func-body-length
    public initStyleDialog(localValue: L10n): void {
        let instance: StyleDialog = this;
        let id: string = this.owner.owner.containerId + '_style';
        this.target = createElement('div', { id: id, className: 'e-de-style-dialog' });
        let container: HTMLElement = createElement('div');
        // tslint:disable-next-line:max-line-length
        let properties: HTMLElement = createElement('div', { className: 'e-de-style-properties', innerHTML: localValue.getConstant('Properties') });
        container.appendChild(properties);
        let styleNameTypeDiv: HTMLElement = createElement('div', { styles: 'display:flex', className: 'e-de-style-nametype-div' });
        container.appendChild(styleNameTypeDiv);
        let nameWholeDiv: HTMLElement = createElement('div', { className: 'e-de-style-left-div' });
        styleNameTypeDiv.appendChild(nameWholeDiv);
        let name: HTMLElement = createElement('div', { className: 'e-de-style-name', innerHTML: localValue.getConstant('Name') + ':' });
        nameWholeDiv.appendChild(name);
        // tslint:disable-next-line:max-line-length
        let nameValue: HTMLInputElement = createElement('input', { id: this.owner.owner.containerId + '_style_name', styles: 'width:210px;', className: 'e-input e-de-style-dlg-name-input' }) as HTMLInputElement;
        nameValue.addEventListener('keyup', this.updateOkButton);
        nameValue.addEventListener('input', this.updateOkButton);
        nameValue.addEventListener('blur', this.updateNextStyle);
        nameWholeDiv.appendChild(nameValue);
        let styleTypeWholeDiv: HTMLElement = createElement('div');
        styleNameTypeDiv.appendChild(styleTypeWholeDiv);
        // tslint:disable-next-line:max-line-length
        let styleType: HTMLElement = createElement('div', { className: 'e-de-style-styletype', innerHTML: localValue.getConstant('Style type') + ':' });
        styleTypeWholeDiv.appendChild(styleType);
        let styleTypeDivElement: HTMLElement = createElement('div', { className: 'e-de-style-style-type-div' });
        let styleTypeValue: HTMLSelectElement = createElement('select', { id: 'e-de-style-style-type' }) as HTMLSelectElement;
        // tslint:disable-next-line:max-line-length
        styleTypeValue.innerHTML = '<option>Paragraph</option><option>Character</option><option>Linked(Paragraph and Character)</option>'; //<option>Linked(Paragraph and Character)</option><option>Table</option><option>List</option>';
        styleTypeDivElement.appendChild(styleTypeValue);
        this.styleType = new DropDownList({ change: this.styleTypeChange, popupHeight: '253px', width: '210px' });
        this.styleType.appendTo(styleTypeValue);
        styleTypeWholeDiv.appendChild(styleTypeDivElement);
        // tslint:disable-next-line:max-line-length
        let styleBasedParaDiv: HTMLElement = createElement('div', { styles: 'display:flex', className: 'e-de-style-based-para-div' });
        container.appendChild(styleBasedParaDiv);
        let styleBasedOnWholeDiv: HTMLElement = createElement('div', { className: 'e-de-style-left-div' });
        styleBasedParaDiv.appendChild(styleBasedOnWholeDiv);
        // tslint:disable-next-line:max-line-length
        let styleBasedOn: HTMLElement = createElement('div', { className: 'e-de-style-style-based-on', innerHTML: localValue.getConstant('Style based on') + ':' });
        styleBasedOnWholeDiv.appendChild(styleBasedOn);
        let styleBasedOnDivElement: HTMLElement = createElement('div', { className: 'e-de-style-style-based-on-div' });
        // tslint:disable-next-line:max-line-length
        let styleBasedOnValue: HTMLInputElement = createElement('input', { id: 'e-de-style-style-based-on-value' }) as HTMLInputElement;
        //styleBasedOnValue.innerHTML = '<option>Normal</option><option>Heading 1</option><option>Heading 2</option><option>Heading 3</option><option>Heading 4</option><option>Heading 5</option><option>Heading 6</option>';
        styleBasedOnDivElement.appendChild(styleBasedOnValue);
        this.styleBasedOn = new DropDownList({ dataSource: [], select: this.styleBasedOnChange, popupHeight: '253px', width: '210px' });
        this.styleBasedOn.appendTo(styleBasedOnValue);
        styleBasedOnWholeDiv.appendChild(styleBasedOnDivElement);

        let styleParagraphWholeDiv: HTMLElement = createElement('div', { className: 'e-de-style-left-div' });
        styleBasedParaDiv.appendChild(styleParagraphWholeDiv);
        // tslint:disable-next-line:max-line-length
        let styleParagraph: HTMLElement = createElement('div', { className: 'e-de-style-style-paragraph', innerHTML: localValue.getConstant('Style for following paragraph') + ':' });
        styleParagraphWholeDiv.appendChild(styleParagraph);
        let styleParagraphDivElement: HTMLElement = createElement('div', { className: 'e-de-style-style-paragraph-div' });
        // tslint:disable-next-line:max-line-length
        let styleParagraphValue: HTMLInputElement = createElement('input', { id: 'e-de-style-style-paragraph-value' }) as HTMLInputElement;
        // tslint:disable-next-line:max-line-length
        //styleParagraphValue.innerHTML = '<option>Normal</option><option>Heading 1</option><option>Heading 2</option><option>Heading 3</option><option>Heading 4</option><option>Heading 5</option><option>Heading 6</option>';
        styleParagraphDivElement.appendChild(styleParagraphValue);
        this.styleParagraph = new DropDownList({ dataSource: [], select: this.styleParagraphChange, popupHeight: '253px', width: '210px' });
        this.styleParagraph.appendTo(styleParagraphValue);
        styleParagraphWholeDiv.appendChild(styleParagraphDivElement);
        // tslint:disable-next-line:max-line-length
        let formatting: HTMLElement = createElement('div', { className: 'e-de-style-formatting', innerHTML: localValue.getConstant('Formatting') });
        container.appendChild(formatting);
        let optionsDiv: HTMLElement = createElement('div', { className: 'e-de-style-options-div' });
        container.appendChild(optionsDiv);
        let fontOptionsDiv: HTMLElement = createElement('div', { styles: 'display:flex;margin-bottom: 15px;' });
        optionsDiv.appendChild(fontOptionsDiv);
        this.createFontOptions(fontOptionsDiv);
        let paragraphOptionsDiv: HTMLElement = createElement('div', { styles: 'display:flex', className: 'e-style-paragraph' });
        optionsDiv.appendChild(paragraphOptionsDiv);
        this.createParagraphOptions(paragraphOptionsDiv);


        // let radioOptionsDiv: HTMLElement = createElement('div', { styles: 'display:flex' });
        // container.appendChild(radioOptionsDiv);
        // let onlyThisDocumentDiv: HTMLElement = createElement('div', { className: 'e-de-style-radio-button' });
        // tslint:disable-next-line:max-line-length
        // let onlyThisDocument: HTMLInputElement = createElement('input', { className: 'e-de-style-only-this-doc', attrs: { type: 'radio' } }) as HTMLInputElement;
        // onlyThisDocumentDiv.appendChild(onlyThisDocument);
        // tslint:disable-next-line:max-line-length
        // this.onlyThisDocument = new RadioButton({ label: 'Only in this document', value: 'only in this document', checked: true, name: 'styles' });
        // this.onlyThisDocument.appendTo(onlyThisDocument);
        // radioOptionsDiv.appendChild(onlyThisDocumentDiv);

        // let templateDiv: HTMLElement = createElement('div', { className: 'e-de-style-radio-button' });
        // tslint:disable-next-line:max-line-length
        // let template: HTMLInputElement = createElement('input', { className: 'e-de-style-temp', attrs: { type: 'radio' } }) as HTMLInputElement;
        // templateDiv.appendChild(template);
        // this.template = new RadioButton({ label: 'Template', value: 'template', name: 'styles' });
        // this.template.appendTo(template);
        // radioOptionsDiv.appendChild(templateDiv);
        this.createFormatDropdown(container, localValue);
        this.target.appendChild(container);
    }
    private createFormatDropdown(parentDiv: HTMLElement, localValue: L10n): void {
        let formatBtn: HTMLElement = createElement('button', { id: 'style_format_dropdown', innerHTML: localValue.getConstant('Format') });
        formatBtn.style.height = '35px';
        parentDiv.appendChild(formatBtn);
        let items: ItemModel[] = [{ text: localValue.getConstant('Font') + '..', id: 'style_font' },
        { text: localValue.getConstant('Paragraph') + '..', id: 'style_paragraph' },
        { text: localValue.getConstant('Numbering') + '..', id: 'style_numbering' }];
        let dropDownbtn: DropDownButton = new DropDownButton({
            items: items, cssClass: 'e-de-style-format-dropdwn',
            beforeItemRender: (args: MenuEventArgs) => {
                if (this.styleType.value === 'Character') {
                    if (args.item.text === 'Paragraph') {
                        args.element.classList.add('e-disabled');
                    }

                    if (args.item.text === 'Numbering') {
                        args.element.classList.add('e-disabled');
                    }
                } else {
                    if (args.item.text === 'Paragraph') {
                        args.element.classList.remove('e-disabled');
                    }

                    if (args.item.text === 'Numbering') {
                        args.element.classList.remove('e-disabled');
                    }
                }
            }
        });
        dropDownbtn.appendTo(formatBtn);
        dropDownbtn.addEventListener('select', this.openDialog);
    }
    /* tslint:disable-next-line:no-any */
    private openDialog = (args: any): void => {
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
    private createFontOptions(parentDiv: HTMLElement): void {
        let fontFamilyElement: HTMLSelectElement = createElement('select', { id: this.target.id + '_fontName' }) as HTMLSelectElement;
        fontFamilyElement.innerHTML = '<option>Arial</option><option>Calibri</option><option>Candara</option>' +
            '<option>Comic Sans MS</option><option>Consolas</option><option>Constantia</option><option>Corbel</option>' +
            '<option>Courier New</option><option>Ebrima</option><option>Franklin Gothic</option>' +
            '<option>Gabriola</option><option>Gadugi</option><option>Georgia</option><option>Impact</option>' +
            '<option>Javanese Text</option><option>Microsoft Sans Serif</option><option>MS Gothic</option><option>MS UI Gothic</option>' +
            '<option>Segoe Print</option><option>Times New Roman</option><option>Verdana</option><option>Segoe UI</option>' +
            '<option>Algerian</option><option>Cambria</option><option>Georgia</option><option>Consolas</option>';
        parentDiv.appendChild(fontFamilyElement);
        this.fontFamily = new ComboBox({
            width: '123px', popupWidth: '123px',
            cssClass: 'e-style-font-fmaily-right', change: this.fontFamilyChanged
        });
        this.fontFamily.showClearButton = false;
        this.fontFamily.appendTo(fontFamilyElement);
        let fontSizeElement: HTMLElement = createElement('input');
        parentDiv.appendChild(fontSizeElement);
        let sizeDataSource: number[] = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
        this.fontSize = new ComboBox({
            dataSource: sizeDataSource, width: '73px', cssClass: 'e-style-font-fmaily-right',
            change: this.fontSizeUpdate
        });
        this.fontSize.showClearButton = false;
        this.fontSize.appendTo(fontSizeElement);
        let fontGroupButton: HTMLElement = createElement('div', { className: 'e-de-style-font-group-button' });
        parentDiv.appendChild(fontGroupButton);
        // tslint:disable-next-line:max-line-length
        this.bold = this.createButtonElement(fontGroupButton, 'e-de-bold', 'e-de-style-bold-button-size', this.owner.owner.containerId + '_style_bold');
        this.bold.addEventListener('click', this.setBoldProperty);
        // tslint:disable-next-line:max-line-length
        this.italic = this.createButtonElement(fontGroupButton, 'e-de-italic', 'e-de-style-icon-button-size', this.owner.owner.containerId + '_style_italic');
        this.italic.addEventListener('click', this.setItalicProperty);
        // tslint:disable-next-line:max-line-length
        this.underline = this.createButtonElement(fontGroupButton, 'e-de-underline', 'e-de-style-icon-button-size', this.owner.owner.containerId + '_style_underline');
        this.underline.addEventListener('click', this.setUnderlineProperty);
        let fontColorElement: HTMLElement = createElement('input', { attrs: { type: 'color' }, className: 'e-de-style-icon-button-size' });
        parentDiv.appendChild(fontColorElement);
        this.fontColor = new ColorPicker({ cssClass: 'e-de-style-font-color-picker', change: this.fontColorUpdate });
        this.fontColor.appendTo(fontColorElement);
    }
    private setBoldProperty = (): void => {
        this.characterFormat.bold = !this.characterFormat.bold;
        this.fontButtonClicked(undefined);
    }
    private setItalicProperty = (): void => {
        this.characterFormat.italic = !this.characterFormat.italic;
        this.fontButtonClicked(undefined);
    }
    private setUnderlineProperty = (): void => {
        this.characterFormat.underline = this.characterFormat.underline === 'None' ? 'Single' : 'None';
        this.fontButtonClicked(undefined);
    }
    /* tslint:disable-next-line:no-any */
    private fontButtonClicked = (args: any): void => {
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
    /* tslint:disable-next-line:no-any */
    private fontSizeUpdate = (args: any): void => {
        this.characterFormat.fontSize = args.value;
    }
    /* tslint:disable-next-line:no-any */
    private fontFamilyChanged = (args: any): void => {
        this.characterFormat.fontFamily = args.value;
    }
    /* tslint:disable-next-line:no-any */
    private fontColorUpdate = (args: any): void => {
        this.characterFormat.fontColor = args.currentValue.rgba;
    }
    private createParagraphOptions(parentDiv: HTMLElement): void {
        let alignmentDiv: HTMLElement = createElement('div', { className: 'e-de-style-paragraph-group-button' });
        parentDiv.appendChild(alignmentDiv);
        this.leftAlign = this.createButtonElement(alignmentDiv, 'e-de-align-left', 'e-de-style-icon-button-size');
        this.leftAlign.addEventListener('click', this.setLeftAlignment);
        this.centerAlign = this.createButtonElement(alignmentDiv, 'e-de-align-center', 'e-de-style-icon-button-size');
        this.centerAlign.addEventListener('click', this.setCenterAlignment);
        this.rightAlign = this.createButtonElement(alignmentDiv, 'e-de-align-right', 'e-de-style-icon-button-size');
        this.rightAlign.addEventListener('click', this.setRightAlignment);
        this.justify = this.createButtonElement(alignmentDiv, 'e-de-justify', 'e-de-style-icon-button-last-size');
        this.justify.addEventListener('click', this.setJustifyAlignment);
        let lineSpacingDiv: HTMLElement = createElement('div', { className: 'e-de-style-paragraph-group-button' });
        parentDiv.appendChild(lineSpacingDiv);
        this.singleLineSpacing = this.createButtonElement(lineSpacingDiv, 'e-de-single-spacing', 'e-de-style-icon-button-first-size');
        this.singleLineSpacing.addEventListener('click', () => {
            this.paragraphFormat.lineSpacing = 1;
            this.updateParagraphFormat();
        });
        // tslint:disable-next-line:max-line-length
        this.onePointFiveLineSpacing = this.createButtonElement(lineSpacingDiv, 'e-de-one-point-five-spacing', 'e-de-style-icon-button-size');
        this.onePointFiveLineSpacing.addEventListener('click', () => {
            this.paragraphFormat.lineSpacing = 1.5;
            this.updateParagraphFormat();
        });
        this.doubleLineSpacing = this.createButtonElement(lineSpacingDiv, 'e-de-double-spacing', 'e-de-style-icon-button-last-size');
        this.doubleLineSpacing.addEventListener('click', () => {
            this.paragraphFormat.lineSpacing = 2;
            this.updateParagraphFormat();
        });
        let spacingDiv: HTMLElement = createElement('div', { className: 'e-de-style-paragraph-group-button' });
        parentDiv.appendChild(spacingDiv);
        let beforeSpacing: HTMLElement = this.createButtonElement(spacingDiv, 'e-de-before-spacing', 'e-de-style-icon-button-first-size');
        let afterSpacing: HTMLElement = this.createButtonElement(spacingDiv, 'e-de-after-spacing', 'e-de-style-icon-button-last-size');
        beforeSpacing.addEventListener('click', this.increaseBeforeAfterSpacing);
        afterSpacing.addEventListener('click', this.decreaseBeforeAfterSpacing);
        let indentingDiv: HTMLElement = createElement('div', { className: 'e-de-style-paragraph-indent-group-button' });
        parentDiv.appendChild(indentingDiv);
        let decreaseIndent: HTMLElement = this.createButtonElement(indentingDiv, 'e-de-indent', 'e-de-style-icon-button-first-size');
        decreaseIndent.addEventListener('click', () => {
            if (this.paragraphFormat.leftIndent >= 36) {
                this.paragraphFormat.leftIndent -= 36;
            } else {
                this.paragraphFormat.leftIndent = 0;
            }
        });
        let increaseindent: HTMLElement = this.createButtonElement(indentingDiv, 'e-de-outdent', 'e-de-style-icon-button-size');
        increaseindent.addEventListener('click', () => {
            this.paragraphFormat.leftIndent += 36;
        });
    }
    private setLeftAlignment = (): void => {
        if (this.paragraphFormat.textAlignment === 'Left') {
            this.paragraphFormat.textAlignment = 'Justify';
        } else {
            this.paragraphFormat.textAlignment = 'Left';
        }
        this.updateParagraphFormat();
    }
    private setRightAlignment = (): void => {
        if (this.paragraphFormat.textAlignment === 'Right') {
            this.paragraphFormat.textAlignment = 'Left';
        } else {
            this.paragraphFormat.textAlignment = 'Right';
        }
        this.updateParagraphFormat();
    }
    private setCenterAlignment = (): void => {
        if (this.paragraphFormat.textAlignment === 'Center') {
            this.paragraphFormat.textAlignment = 'Left';
        } else {
            this.paragraphFormat.textAlignment = 'Center';
        }
        this.updateParagraphFormat();
    }
    private setJustifyAlignment = (): void => {
        if (this.paragraphFormat.textAlignment === 'Justify') {
            this.paragraphFormat.textAlignment = 'Left';
        } else {
            this.paragraphFormat.textAlignment = 'Justify';
        }
        this.updateParagraphFormat();
    }
    private createButtonElement(parentDiv: HTMLElement, iconCss: string, className: string, id?: string): HTMLElement {
        let buttonElement: HTMLElement = createElement('button');
        if (!isNullOrUndefined(id)) {
            buttonElement.id = id;
        }
        parentDiv.appendChild(buttonElement);
        let button: Button = new Button({ iconCss: iconCss, cssClass: className });

        button.appendTo(buttonElement);
        return buttonElement;

    }
    private increaseBeforeAfterSpacing = (): void => {
        this.paragraphFormat.beforeSpacing += 6;
        this.paragraphFormat.afterSpacing += 6;
    }
    private decreaseBeforeAfterSpacing = (): void => {
        if (this.paragraphFormat.beforeSpacing >= 6) {
            this.paragraphFormat.beforeSpacing -= 6;
        } else {
            this.paragraphFormat.beforeSpacing = 0;
        }
        if (this.paragraphFormat.afterSpacing >= 6) {
            this.paragraphFormat.afterSpacing -= 6;
        } else {
            this.paragraphFormat.afterSpacing = 0;
        }
    }
    private toggleDisable(): void {
        if (this.styleType.value === 'Character') {
            this.styleParagraph.enabled = false;
            // tslint:disable-next-line:max-line-length
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
     */
    public updateNextStyle = (args: FocusEvent): void => {
        let typedName: string = (args.srcElement as HTMLInputElement).value;
        if (this.getTypeValue() === 'Paragraph' && !isNullOrUndefined(typedName) && typedName !== '' && !this.isUserNextParaUpdated) {
            let styles: string[] = this.owner.owner.viewer.styles.getStyleNames(this.getTypeValue());
            if (this.isEdit) {
                styles = styles.filter((e: string) => e !== this.editStyleName);
            }
            styles.push(typedName);
            this.styleParagraph.dataSource = styles;
            this.styleParagraph.index = null;
            this.styleParagraph.index = styles.indexOf(typedName);
            this.styleParagraph.dataBind();
        }
    }
    /**
     * @private
     */
    public updateOkButton = (): void => {
        let styleName: string = (this.target.getElementsByClassName('e-input e-de-style-dlg-name-input').item(0) as HTMLInputElement).value;
        this.enableOrDisableOkButton();
    }
    /**
     * @private
     */
    /* tslint:disable-next-line:no-any */
    public styleTypeChange = (args: any): void => {
        if (args.isInteracted) {
            let type: StyleType;
            if (args.value === 'Character') {
                this.style = new WCharacterStyle();
                type = 'Character';
            }
            if (args.value === 'Paragraph' || args.value === 'Linked(Paragraph and Character)') {
                this.style = new WParagraphStyle();
                type = 'Paragraph';
            }
            this.toggleDisable();
            this.updateStyleNames(type as StyleType);
        }
    }
    /* tslint:disable-next-line:no-any */
    private styleBasedOnChange = (args: any): void => {
        //Based on change
    }
    /**
     * @private
     */
    /* tslint:disable-next-line:no-any */
    public styleParagraphChange = (args: any): void => {
        if (args.isInteracted) {
            this.isUserNextParaUpdated = true;
        }
        //Next change
    }

    /**
     * @private
     */
    public showFontDialog = (): void => {
        if (!isNullOrUndefined(this.owner.owner.fontDialogModule)) {
            this.owner.owner.showFontDialog(this.characterFormat);
        }
        this.updateCharacterFormat();
    }
    /**
     * @private
     */
    public showParagraphDialog = (): void => {
        if (!isNullOrUndefined(this.owner.owner.paragraphDialogModule)) {
            this.owner.owner.showParagraphDialog(this.paragraphFormat);
        }
    }
    /**
     * @private
     */
    public showNumberingBulletDialog = (): void => {
        this.numberingBulletDialog = new BulletsAndNumberingDialog(this.owner.owner.viewer);
        if (this.style instanceof WParagraphStyle && (!isNullOrUndefined(this.style.paragraphFormat))) {
            // tslint:disable-next-line:max-line-length
            this.numberingBulletDialog.showNumberBulletDialog((this.style as WParagraphStyle).paragraphFormat.listFormat, this.abstractList);
        }
    }
    /**
     * @private
     */
    public show(styleName?: string, header?: string): void {
        let localObj: L10n = new L10n('documenteditor', this.owner.owner.defaultLocale);
        this.isEdit = (!isNullOrUndefined(styleName) && styleName.length > 0) ? true : false;
        this.editStyleName = styleName;
        this.abstractList = new WAbstractList();
        // tslint:disable-next-line:max-line-length
        let style: WCharacterStyle | WParagraphStyle = this.owner.owner.viewer.styles.findByName(styleName) as WCharacterStyle | WParagraphStyle;
        this.style = !this.isEdit ? new WParagraphStyle() : style ? style : this.getStyle(styleName) as WCharacterStyle | WParagraphStyle;
        localObj.setLocale(this.owner.owner.locale);
        setCulture(this.owner.owner.locale);
        if (!this.target) {
            this.initStyleDialog(localObj);
        }
        if (isNullOrUndefined(header)) {
            header = localObj.getConstant('Create New Style');
        }
        this.owner.owner.viewer.dialog2.header = header;
        this.owner.owner.viewer.dialog2.height = 'auto';
        this.owner.owner.viewer.dialog2.width = 'auto';
        this.owner.owner.viewer.dialog2.content = this.target;
        this.owner.owner.viewer.dialog2.buttons = [{
            click: this.onOkButtonClick,
            buttonModel: { content: localObj.getConstant('Ok'), cssClass: 'e-flat e-style-okay', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: localObj.getConstant('Cancel'), cssClass: 'e-flat e-style-cancel' }
        }];
        this.toggleDisable();
        this.owner.owner.viewer.dialog2.dataBind();
        this.owner.owner.viewer.dialog2.beforeOpen = this.loadStyleDialog;
        this.owner.owner.viewer.dialog2.close = this.closeStyleDialog;
        this.owner.owner.viewer.dialog2.position = { X: 'center', Y: 'center' };
        this.owner.owner.viewer.dialog2.show();
    }
    /**
     * @private
     */
    public onOkButtonClick = (): void => {
        let styleName: string = this.styleNameElement.value;
        if (styleName.length > 0) {
            let style: WStyle = this.owner.owner.viewer.styles.findByName(styleName) as WStyle;
            let name: string;
            if (!isNullOrUndefined(style)) {
                this.style.type = this.getTypeValue();
                this.style.basedOn = this.owner.owner.viewer.styles.findByName(this.styleBasedOn.value as string) as WStyle;
                if (this.styleType.value === 'Paragraph' || this.styleType.value === 'Linked(Paragraph and Character)') {
                    this.style.next = this.owner.owner.viewer.styles.findByName(this.styleParagraph.value as string) as WStyle;
                    (this.style as WParagraphStyle).characterFormat.mergeFormat((style as WParagraphStyle).characterFormat);
                    (this.style as WParagraphStyle).paragraphFormat.mergeFormat((style as WParagraphStyle).paragraphFormat);
                    this.updateList();
                    // tslint:disable-next-line:max-line-length
                    this.style.link = (this.styleType.value === 'Linked(Paragraph and Character)') ? this.createLinkStyle(styleName, this.isEdit) : undefined;
                }

                //Updating existing style implementation
                this.style.name = style.name;
                name = style.name;
                style = this.style;

                this.owner.owner.isShiftingEnabled = true;
                this.owner.owner.editorModule.layoutWholeDocument();
                this.owner.owner.isShiftingEnabled = false;
            } else {
                /* tslint:disable-next-line:no-any */
                let basedOn: any = this.owner.owner.viewer.styles.findByName(this.styleBasedOn.value as string) as WStyle;
                if (this.styleType.value === 'Paragraph' || this.styleType.value === 'Linked(Paragraph and Character)') {
                    if (styleName === this.styleParagraph.value) {
                        this.style.next = this.style;
                    } else {
                        this.style.next = this.owner.owner.viewer.styles.findByName(this.styleParagraph.value as string) as WStyle;
                    }
                    this.updateList();
                }
                // tslint:disable-next-line:max-line-length
                this.style.link = (this.styleType.value === 'Linked(Paragraph and Character)') ? this.createLinkStyle(styleName) : undefined;
                this.style.type = this.getTypeValue();
                this.style.name = styleName;
                this.style.basedOn = basedOn;
                /* tslint:disable-next-line:no-any */
                this.owner.owner.viewer.styles.push(this.style as any);
                name = styleName;
                this.owner.owner.editorModule.applyStyle(name);
            }
            this.owner.owner.viewer.dialog2.hide();
        } else {
            throw new Error('Enter valid Style name');
        }
        if (this.style) {
            //this.style.destroy();
        }
    }
    private updateList(): void {
        let listId: number = (this.style as WParagraphStyle).paragraphFormat.listFormat.listId;
        if (listId > -1) {
            if (this.owner.owner.viewer.lists.filter((a: WList) => (a.listId === listId)).length === 0) {
                this.owner.owner.viewer.lists.push((this.style as WParagraphStyle).paragraphFormat.listFormat.list);
            } else {
                this.owner.owner.viewer.lists = this.owner.owner.viewer.lists.filter((a: WList) => (a.listId !== listId));
                this.owner.owner.viewer.lists.push((this.style as WParagraphStyle).paragraphFormat.listFormat.list);
            }
        }
        if (this.abstractList.abstractListId !== -1) {
            this.owner.owner.viewer.abstractLists.push(this.abstractList);
        }
    }
    private createLinkStyle(name: string, isEdit?: boolean): WStyle {
        let charStyle: WCharacterStyle;
        if (isEdit) {
            charStyle = this.owner.owner.viewer.styles.findByName((name + ' Char'), 'Character') as WCharacterStyle;
        } else {
            charStyle = new WCharacterStyle();
        }
        charStyle.type = 'Character';
        charStyle.name = name + ' Char';
        charStyle.characterFormat = this.style.characterFormat.cloneFormat();
        charStyle.basedOn = this.style.basedOn;
        if (!isEdit) {
            this.owner.owner.viewer.styles.push(charStyle);
        }
        return this.owner.owner.viewer.styles.findByName(charStyle.name, 'Character') as WStyle;
    }
    /* tslint:disable-next-line:no-any */
    private loadStyleDialog = (args: any): void => {
        this.owner.owner.viewer.updateFocus();
        this.isUserNextParaUpdated = false;
        /* tslint:disable-next-line:max-line-length */
        this.styleNameElement = this.target.getElementsByClassName('e-input e-de-style-dlg-name-input').item(0) as HTMLInputElement;
        this.styleNameElement.value = null;
        if (!this.isEdit) {
            this.styleType.index = 0; //Set to paragraph            
        }
        let name: string;
        if (this.isEdit) {
            this.styleNameElement.value = this.editStyleName;
            name = this.editStyleName;
        }
        /* tslint:disable-next-line:max-line-length */
        this.okButton = this.owner.dialog2.element.getElementsByClassName('e-flat e-style-okay').item(0) as HTMLButtonElement;
        this.enableOrDisableOkButton();
        this.updateStyleNames(this.getTypeValue(), name);
        this.updateCharacterFormat(this.style.characterFormat);
        this.updateParagraphFormat((this.style as WParagraphStyle).paragraphFormat);
    }
    /**
     * @private
     */
    public updateCharacterFormat(characterFormat?: WCharacterFormat): void {
        if (!isNullOrUndefined(characterFormat)) {
            this.characterFormat = characterFormat;
        }
        this.fontFamily.value = this.characterFormat.fontFamily;
        this.fontSize.value = this.characterFormat.fontSize;
        this.fontColor.value = this.characterFormat.fontColor;
        this.fontButtonClicked(undefined);
    }

    /**
     * @private
     */
    public updateParagraphFormat(paragraphFOrmat?: WParagraphFormat): void {
        if (!isNullOrUndefined(paragraphFOrmat)) {
            this.paragraphFormat = paragraphFOrmat;
        }
        if (this.paragraphFormat.textAlignment === 'Left') {
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
        } else if (this.paragraphFormat.textAlignment === 'Right') {
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
        } else if (this.paragraphFormat.textAlignment === 'Center') {
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
        } else if (this.paragraphFormat.textAlignment === 'Justify') {
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
        if (this.paragraphFormat.lineSpacing === 1) {
            this.singleLineSpacing.classList.add('e-active');
            this.onePointFiveLineSpacing.classList.remove('e-active');
            this.doubleLineSpacing.classList.remove('e-active');
        } else if (this.paragraphFormat.lineSpacing === 1.5) {
            this.singleLineSpacing.classList.remove('e-active');
            this.onePointFiveLineSpacing.classList.add('e-active');
            this.doubleLineSpacing.classList.remove('e-active');
        } else if (this.paragraphFormat.lineSpacing === 2) {
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
    private getTypeValue(): StyleType {
        let type: StyleType;
        if (this.styleType.value === 'Linked(Paragraph and Character)' || this.styleType.value === 'Paragraph') {
            return 'Paragraph';
        } else {
            return 'Character';
        }
    }
    private updateStyleNames(type: StyleType, name?: string): void {
        let styles: string[] = this.owner.owner.viewer.styles.getStyleNames(type);
        this.styleParagraph.dataSource = styles;
        this.styleParagraph.index = null;
        if (name) {
            this.styleBasedOn.dataSource = styles.filter((e: string) => e !== name);
            this.styleBasedOn.index = null;
            let style: WStyle = this.getStyle(name);
            if (style.basedOn instanceof String || isNullOrUndefined(style.basedOn)) {
                this.styleBasedOn.enabled = false;
            } else {
                /* tslint:disable-next-line:max-line-length */
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
            this.styleBasedOn.dataSource = styles;
            this.styleBasedOn.index = null;
            let basedOnIndex: number = 0;
            if (this.owner.owner.selectionModule) {
                let styleName: string;
                if (type === 'Character') {
                    styleName = this.owner.owner.selection.characterFormat.styleName;
                } else {
                    styleName = this.owner.owner.selection.paragraphFormat.styleName;
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
        this.styleBasedOn.dataBind();
        this.styleParagraph.dataBind();
    }

    private getStyle(styleName: string): WStyle {
        /* tslint:disable-next-line:max-line-length */
        if (isNullOrUndefined(this.owner.owner.viewer.styles.findByName(styleName))) {
            /* tslint:disable-next-line:max-line-length */
            this.owner.owner.editor.createStyle(this.owner.owner.viewer.preDefinedStyles.get(styleName));
        }
        return this.owner.owner.viewer.styles.findByName(styleName) as WStyle;
    }
    /**
     * @private
     */
    public onCancelButtonClick = (): void => {
        if (!this.isEdit && this.style) {
            this.style.destroy();
        }
        this.owner.owner.viewer.dialog2.hide();
    }
    /**
     * @private
     */
    public closeStyleDialog = (): void => {
        this.owner.owner.viewer.updateFocus();
    }
    /**
     * @private
     */
    public destroy(): void {
        this.owner = undefined;
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
        if (this.styleType) {
            this.styleType.destroy();
        }
        this.styleType = undefined;
        if (this.styleBasedOn) {
            this.styleBasedOn.destroy();
        }
        this.styleBasedOn = undefined;
        if (this.styleParagraph) {
            this.styleParagraph.destroy();
        }
        this.styleParagraph = undefined;
        if (this.onlyThisDocument) {
            this.onlyThisDocument.destroy();
        }
        this.onlyThisDocument = undefined;
        if (this.template) {
            this.template.destroy();
        }
        this.template = undefined;
        if (this.style) {
            this.style = undefined;
        }
        if (this.abstractList) {
            this.abstractList = undefined;
        }
        if (this.numberingBulletDialog) {
            this.numberingBulletDialog.destroy();
        }
        this.numberingBulletDialog = undefined;
    }
}