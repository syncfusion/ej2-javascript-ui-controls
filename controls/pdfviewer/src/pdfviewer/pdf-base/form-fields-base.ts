import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfDocument, PdfPage, PdfForm, PdfTextBoxField, PdfFormFieldVisibility, PdfTextAlignment, PdfSignatureField, PdfField, PdfFreeTextAnnotation, PdfFontFamily, PdfStandardFont, PdfAnnotationFlag, PdfRubberStampAnnotation, PdfImage, PdfBitmap, PdfGraphics, PdfGraphicsState, PdfFontStyle as FontStyle, PdfCheckBoxField, PdfComboBoxField, PdfListBoxField, PdfListFieldItem, PdfRadioButtonListField, PdfRadioButtonListItem, PdfRotationAngle, PdfFontStyle, PdfFont, PdfTemplate, PdfInkAnnotation, PdfTrueTypeFont, PdfAnnotationCollection, PdfAnnotation, _PdfReference, _PdfDictionary, PdfPath} from '@syncfusion/ej2-pdf';
import { PdfViewer, PdfViewerBase, PageRenderer, PageRotation } from '../index';
import { getArialFontData } from '../pdf-base/fontData';
import { Rect } from '@syncfusion/ej2-drawings';
import { PdfViewerUtils } from '../base/pdfviewer-utlis';

/**
 * FormFieldsBase
 *
 * @hidden
 */
export class FormFieldsBase {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private formFieldLoadedDocument: PdfDocument;
    private defaultAppearanceFields: string[];
    private pageRenderer: PageRenderer;
    /**
     * @private
     */
    public mIsDigitalSignaturePresent: boolean;
    /**
     * @private
     */
    public showDigitalSignatureAppearance: boolean;
    /**
     * @private
     */
    public hideEmptyDigitalSignatureFields: boolean;
    /**
     * @private
     */
    public PdfRenderedFormFields: PdfRenderedFields[] = [];

    /**
     * @param {PdfViewer} pdfViewer - The PdfViewer.
     * @param {PdfViewerBase} pdfViewerBase - The PdfViewerBase.
     * @param {boolean} digitalSignatruePresent - The digitalSignatruePresent
     * @private
     * @returns {void}
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase, digitalSignatruePresent?: boolean) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
        this.formFieldLoadedDocument = this.pdfViewer.pdfRendererModule.loadedDocument;
        this.mIsDigitalSignaturePresent = digitalSignatruePresent;
    }

    /**
     * @private
     * @param {any} textSignature - This is textSignature
     * @param {any} loadedDocument - loadedDocument
     * @param {boolean} isAnnotationFlattern - isAnnotationFlattern
     * @returns {void}
     */
    public drawFreeTextAnnotations(textSignature: any, loadedDocument: any, isAnnotationFlattern: boolean): void {
        const stampObjects: any = textSignature.data;
        const textData: string = stampObjects.replace(/"/g, '');
        const boundsObject: Rect = JSON.parse(textSignature.bounds);
        const page: PdfPage = loadedDocument.getPage(textSignature.pageIndex);
        if (stampObjects !== '') {
            const left: number = this.convertPixelToPoint(boundsObject.left);
            const top: number = this.convertPixelToPoint(boundsObject.top);
            const width: number = this.convertPixelToPoint(boundsObject.width);
            const height: number = this.convertPixelToPoint(boundsObject.height);
            const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(left, top, width, height);
            annotation._dictionary.set('NM', textSignature.signatureName.toString());
            let fontSize: number = textSignature.fontSize;
            annotation.border.width = 0;
            let fontFamilyEnum: PdfFontFamily = PdfFontFamily.helvetica;
            const fontName: string = textSignature.fontFamily.toString();
            if (!isNullOrUndefined(fontName)) {
                const family: string = fontName.toString();
                if (family.includes('Times New Roman')) {
                    fontFamilyEnum = PdfFontFamily.timesRoman;
                }
                else if (family.includes('Courier')) {
                    fontFamilyEnum = PdfFontFamily.courier;
                }
                else if (family.includes('Symbol')) {
                    fontFamilyEnum = PdfFontFamily.symbol;
                }
                else if (family.includes('ZapfDingbats')) {
                    fontFamilyEnum = PdfFontFamily.zapfDingbats;
                }
            }
            fontSize = Math.floor(this.convertPixelToPoint(fontSize));
            const fontStyle: FontStyle = FontStyle.regular;
            annotation.font = new PdfStandardFont(fontFamilyEnum, fontSize, fontStyle);
            annotation.text = textData;
            annotation.borderColor = [0, 0, 0];
            annotation.textAlignment = PdfTextAlignment.center;
            annotation._annotFlags = PdfAnnotationFlag.print;
            if (isAnnotationFlattern) {
                const rotateAngle: number = this.getRotateAngle(page.rotation);
                annotation.rotationAngle = Math.abs(rotateAngle);
            }
            annotation.setValues('AnnotationType', 'Signature');
            if (isAnnotationFlattern) {
                annotation.flatten = true;
            }
            annotation.setAppearance(true);
            page.annotations.add(annotation);
        }
    }

    private getRotateAngle(angleString: PdfRotationAngle): number {
        let angle: number = 0;
        switch (angleString) {
        case PdfRotationAngle.angle0:
            angle = 0;
            break;
        case PdfRotationAngle.angle180:
            angle = 2;
            break;
        case PdfRotationAngle.angle270:
            angle = 3;
            break;
        case PdfRotationAngle.angle90:
            angle = 1;
            break;
        }
        return angle;
    }

    /**
     * @private
     * @param {any} signatureImage - signatureImage
     * @param {any} loadedDocument - loadedDocument
     * @param {boolean} isAnnotationFlattern - isAnnotationFlattern
     * @returns {void}
     */
    public drawImage(signatureImage: any, loadedDocument: any, isAnnotationFlattern: boolean): void {
        const stampObjects: any = signatureImage.data;
        const boundsObject: Rect = JSON.parse(signatureImage.bounds);
        const page: PdfPage = loadedDocument.getPage(signatureImage.pageIndex);
        if (stampObjects !== '') {
            const imageUrl: string = (stampObjects.toString()).split(',')[1];
            const left: number = this.convertPixelToPoint(boundsObject.left);
            const top: number = this.convertPixelToPoint(boundsObject.top);
            let width: number = this.convertPixelToPoint(boundsObject.width);
            let height: number = this.convertPixelToPoint(boundsObject.height);
            if (page.rotation === PdfRotationAngle.angle90 || page.rotation === PdfRotationAngle.angle270) {
                [width, height] = [height, width];
            }
            const rubberStampAnnotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(left, top, width, height);
            const bitmap: PdfImage = new PdfBitmap(imageUrl);
            const graphics: PdfGraphics = page.graphics;
            const appearance: PdfTemplate = rubberStampAnnotation.appearance.normal;
            rubberStampAnnotation._dictionary.set('NM', signatureImage.signatureName.toString());
            const rotationAngle: number = this.getRotateAngle(page.rotation);
            rubberStampAnnotation.rotationAngle = Math.abs(rotationAngle);
            if (isAnnotationFlattern) {
                rubberStampAnnotation.flatten = true;
            }
            if (!isAnnotationFlattern) {
                const state: PdfGraphicsState = graphics.save();
                appearance.graphics.drawImage(bitmap, 0, 0, width, height);
                appearance.graphics.restore(state);
            }
            else {
                appearance.graphics.drawImage(bitmap, 0, 0, width, height);
            }
            page.annotations.add(rubberStampAnnotation);
        }
    }

    /**
     * @private
     * @param {any} jsonObject - jsonObject
     * @returns {void}
     */
    public saveFormFieldsDesignerData(jsonObject: any): void {
        if (Object.prototype.hasOwnProperty.call(jsonObject, 'formDesigner')) {
            const formFields: string = jsonObject['formDesigner'];
            if (!isNullOrUndefined(formFields)) {
                const data: any = JSON.parse(formFields);
                const myList: number[] = [];
                const formFieldsPageList: any = Object.prototype.hasOwnProperty.call(jsonObject, 'formFieldsPageList') ? JSON.parse(jsonObject['formFieldsPageList']) : myList;
                //Removing form fields from the page.
                if (!isNullOrUndefined(this.formFieldLoadedDocument.form)) {
                    const initialCount: number = this.formFieldLoadedDocument.form._fields.length;
                    //Get the loaded form.
                    const loadedForm: PdfForm = this.formFieldLoadedDocument.form;
                    for (let k: number = initialCount - 1; k >= 0; k--) {
                        const formFieldPage: PdfField = loadedForm.fieldAt(k);
                        let signField: PdfSignatureField = null;
                        if (formFieldPage instanceof PdfSignatureField) {
                            signField = formFieldPage as PdfSignatureField;
                        }
                        const signed: boolean = !isNullOrUndefined(signField) ? signField.isSigned : true;
                        //Removing the formfields from a page
                        // if (formFieldsPageList.includes(pageNumber + 1) && (signField === null || !signed)) {
                        // formFieldsPageList is did not removed  when delete non rendered pages form fields.
                        if (signField == null || !signed) {
                            loadedForm.removeField(loadedForm.fieldAt(k));
                        }
                    }
                }
                for (let i: number = 0; i < data.length; i++) {
                    this.addFormFieldsToDocument(data[parseInt(i.toString(), 10)].FormField);
                }
            }
            if (!isNullOrUndefined(this.formFieldLoadedDocument.form)) {
                if (!isNullOrUndefined(this.defaultAppearanceFields)) {
                    for (let i: number = 0; i < this.formFieldLoadedDocument.form.count; i++) {
                        const field: PdfField = this.formFieldLoadedDocument.form.fieldAt(i);
                        if (this.defaultAppearanceFields.indexOf(field.name) === -1) {
                            field.setAppearance(true);
                        }
                    }
                    this.defaultAppearanceFields = null;
                } else {
                    this.formFieldLoadedDocument.form.setDefaultAppearance(false);
                }
            }
        }
    }

    private setFont(field: any, currentField: any): void {
        const pdfFontStyle: PdfFontStyle = this.getFontStyle(field);
        currentField._dictionary.set('FontStyle', pdfFontStyle);
        // eslint-disable-next-line
        const hasUnicode: boolean = /[^\u0000-\u007F]/.test(currentField.text);
        if (hasUnicode) {
            currentField.font = this.getTrueFont(field.fontSize, pdfFontStyle);

        } else {
            currentField.font = new PdfStandardFont(this.getFontFamily(field.FontFamily),
                                                    this.convertPixelToPoint(field.fontSize), pdfFontStyle);
        }
    }

    /**
     * @private
     * @param {any} jsonObject - jsonObject
     * @returns {void}
     */
    public saveFormFieldsData(jsonObject: any): void {
        if (Object.prototype.hasOwnProperty.call(jsonObject, 'fieldsData')) {
            const formFields: string = jsonObject['fieldsData'];
            const data: any = JSON.parse(formFields);
            if (!isNullOrUndefined(data) && Object.keys(data).length > 0 && !isNullOrUndefined(this.formFieldLoadedDocument.form)) {
                if (this.formFieldLoadedDocument.form._fields.length > 0) {
                    this.formFieldLoadedDocument.form.setDefaultAppearance(false);
                }
                for (let i: number = 0; i < this.formFieldLoadedDocument.form._fields.length; i++) {
                    const currentField: PdfField = this.formFieldLoadedDocument.form.fieldAt(i);
                    let currentFieldName: string = '';
                    let actualFieldName: string = '';
                    if (!isNullOrUndefined(currentField.name)) {
                        currentFieldName = currentField.name.replace(/[^0-9a-zA-Z]+/g, '').replace(/\s+/g, '');
                        actualFieldName = currentField.name;
                    }
                    if (currentField instanceof PdfTextBoxField) {
                        if (!(currentField as PdfTextBoxField).password) {
                            if ((Object.prototype.hasOwnProperty.call(data, currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (Object.prototype.hasOwnProperty.call(data, actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                                if (Object.prototype.hasOwnProperty.call(data, actualFieldName)) {
                                    currentFieldName = actualFieldName;
                                }
                                const field: any = data[`${currentFieldName}`];
                                if (!isNullOrUndefined(field) && Object.prototype.hasOwnProperty.call(field, 'isReadOnly')) {
                                    (currentField as PdfTextBoxField).text = field['fieldValue'];
                                    (currentField as PdfTextBoxField).readOnly = field['isReadOnly'] === 'true' ? true : false;
                                }
                                this.setFont(field, currentField);
                            }
                        } else {
                            if ((Object.prototype.hasOwnProperty.call(data, currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (Object.prototype.hasOwnProperty.call(data, actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                                if (Object.prototype.hasOwnProperty.call(data, actualFieldName)) {
                                    currentFieldName = actualFieldName;
                                }
                                const field: any = data[`${currentFieldName}`];
                                if (!isNullOrUndefined(field) && Object.prototype.hasOwnProperty.call(field, 'isReadOnly')) {
                                    (currentField as PdfTextBoxField).text = field['fieldValue'];
                                    (currentField as PdfTextBoxField).readOnly = field['isReadOnly'] === 'true' ? true : false;
                                }
                                this.setFont(field, currentField);
                            }
                        }
                    } else if (currentField instanceof PdfComboBoxField) {
                        if ((Object.prototype.hasOwnProperty.call(data, currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (Object.prototype.hasOwnProperty.call(data, actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                            if (Object.prototype.hasOwnProperty.call(data, actualFieldName)) {
                                currentFieldName = actualFieldName;
                            }
                            const field: any = data[`${currentFieldName}`];
                            const count: number = currentField.itemsCount;
                            let fieldName: string = '';
                            if (!isNullOrUndefined(field)) {
                                if (Object.prototype.hasOwnProperty.call(field, 'isReadOnly')) {
                                    currentField.readOnly = field['isReadOnly'] === 'true' ? true : false;
                                }
                                if (!isNullOrUndefined(field['fieldValue'])) {
                                    fieldName = field['fieldValue'];
                                }
                            }
                            let isExists: boolean = false;
                            for (let j: number = 0; j < count; j++) {
                                let optionArray: any;
                                let text: string;
                                if (currentField._dictionary.has('Opt')){
                                    optionArray = currentField._dictionary.get('Opt');
                                    text = optionArray[parseInt(j.toString(), 10)];
                                }else if (!isNullOrUndefined(currentField.itemAt(j))){
                                    text = currentField.itemAt(j).text;
                                }
                                if (text === fieldName || (text && text.length > 0 && text[1] === fieldName)) {
                                    currentField.selectedIndex = j;
                                    isExists = true;
                                }
                            }
                            if (currentField.editable && !isExists) {
                                currentField.selectedValue = fieldName;
                            }
                            this.setFont(field, currentField);
                        }
                    } else if (currentField instanceof PdfCheckBoxField) {
                        if ((Object.prototype.hasOwnProperty.call(data, currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (Object.prototype.hasOwnProperty.call(data, actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                            if (Object.prototype.hasOwnProperty.call(data, actualFieldName)) {
                                currentFieldName = actualFieldName;
                            }
                            const field: any = data[`${currentFieldName}`];
                            const fields: boolean = field['isSelected'];
                            const fieldValueString: string = fields.toString();
                            const fieldValue: string = field['fieldValue'];
                            if (!isNullOrUndefined(fieldValue)){
                                (currentField as PdfCheckBoxField)._dictionary.set('ExportValue', fieldValue);
                            }
                            if (fieldValueString.toLowerCase() === 'true' || fieldValueString.toLowerCase() === 'false') {
                                (currentField as PdfCheckBoxField).checked = fields;
                                if (!isNullOrUndefined(field) && Object.prototype.hasOwnProperty.call(field, 'isReadOnly')) {
                                    (currentField as PdfCheckBoxField).readOnly = field.readonly;
                                }
                                if (fieldValueString.toLowerCase() === 'false') {
                                    const checkBoxField: PdfCheckBoxField = currentField as PdfCheckBoxField;
                                    for (let k: number = 0; k < checkBoxField.itemsCount; k++) {
                                        checkBoxField.itemAt(k).checked = false;
                                    }
                                    (currentField as PdfCheckBoxField).checked = false;
                                }
                            }
                            else {
                                const integerValue: number = isNullOrUndefined(fieldValueString) ? -1 : parseInt(fieldValueString, 10);
                                const checkBoxField: PdfCheckBoxField = currentField as PdfCheckBoxField;
                                if (checkBoxField.itemsCount > 0) {
                                    if (integerValue === -1) {
                                        for (let n: number = 0; n < checkBoxField.itemsCount; n++) {
                                            checkBoxField.itemAt(n).checked = false;
                                        }
                                        (currentField as PdfCheckBoxField).checked = false;
                                    }
                                    else if (!isNullOrUndefined(checkBoxField.itemAt(integerValue))) {
                                        checkBoxField.itemAt(integerValue).checked = true;
                                    }
                                }
                            }
                        }
                    } else if (currentField instanceof PdfListBoxField) {
                        if ((Object.prototype.hasOwnProperty.call(data, currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (Object.prototype.hasOwnProperty.call(data, actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                            if (Object.prototype.hasOwnProperty.call(data, actualFieldName)) {
                                currentFieldName = actualFieldName;
                            }
                            const table: any = data[`${currentFieldName}`];
                            const count: number = currentField.itemsCount;
                            let fieldName: string = '';
                            if (!isNullOrUndefined(table)) {
                                if (Object.prototype.hasOwnProperty.call(table, 'fieldValue') && !isNullOrUndefined(table['fieldValue'])) {
                                    fieldName = table['fieldValue'];
                                }
                                if (Object.prototype.hasOwnProperty.call(table, 'isReadOnly')) {
                                    currentField.readOnly = table['isReadOnly'] === 'true' ? true : false;
                                }
                            }
                            fieldName = JSON.parse(fieldName) [0].replace(/[^0-9a-zA-Z]+/g, '');
                            const selectedIndexes: number[] = [];
                            for (let k: number = 0; k < count; k++) {
                                const text: string = currentField.itemAt(k).text;
                                if (text === fieldName) {
                                    selectedIndexes.push(k);
                                }
                            }
                            currentField.selectedIndex = selectedIndexes;
                            this.setFont(table, currentField);
                        }
                    } else if (currentField instanceof PdfRadioButtonListField) {
                        if ((Object.prototype.hasOwnProperty.call(data, currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (Object.prototype.hasOwnProperty.call(data, actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                            if (Object.prototype.hasOwnProperty.call(data, actualFieldName)) {
                                currentFieldName = actualFieldName;
                            }
                            const field: any = data[`${currentFieldName}`];
                            if (!isNullOrUndefined(field) && Object.prototype.hasOwnProperty.call(field, 'isReadOnly')) {
                                const selectedValue: string = field['fieldValue'];
                                if (selectedValue) {
                                    for (let i: number = 0; i < currentField.itemsCount; i++) {
                                        const item: PdfRadioButtonListItem = currentField.itemAt(i);
                                        if (item && (item.value === selectedValue || item._optionValue === selectedValue)) {
                                            currentField.selectedIndex = i;
                                            break;
                                        }
                                    }
                                }
                                currentField.readOnly = field['isReadOnly'] === 'true' ? true : false;
                            }
                        }
                    }
                    else if ( currentField instanceof PdfSignatureField){
                        if ((Object.prototype.hasOwnProperty.call(data, currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (Object.prototype.hasOwnProperty.call(data, actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))){
                            if (Object.prototype.hasOwnProperty.call(data, actualFieldName)){
                                currentFieldName = actualFieldName;
                            }
                            const signatureFields: PdfSignatureField = currentField as PdfSignatureField;
                            if (Object.prototype.hasOwnProperty.call(data, currentFieldName + 'fontName')){
                                this.drawFieldFreeTextAnnotations(data[`${currentFieldName}`], signatureFields, currentFieldName, data[currentFieldName + 'bounds'], data[currentFieldName + 'fontName'], data[currentFieldName + 'fontSize']);
                            }else if (Object.prototype.hasOwnProperty.call(data, currentFieldName + 'ImageData')){
                                this.drawFieldImage(data[`${currentFieldName}`], signatureFields, currentFieldName, data[currentFieldName + 'bounds']);
                            }
                            else if (Object.prototype.hasOwnProperty.call(data, currentFieldName + 'bounds')){
                                this.drawFieldPath(data[`${currentFieldName}`], signatureFields, currentFieldName, data[currentFieldName + 'bounds']);
                            }
                            const signatureFieldListCount: any = signatureFields.itemsCount;
                            if (signatureFieldListCount > 0){
                                for (let k: number = 0; k < signatureFieldListCount; k++ ){
                                    if (Object.prototype.hasOwnProperty.call(data, currentFieldName + 'fontName' + '_' + k)){
                                        this.drawFieldFreeTextAnnotations(data[`${currentFieldName}`], signatureFields, currentFieldName, data[currentFieldName + 'bounds' + '_' + k], data[currentFieldName + 'fontName' + '_' + k], data[currentFieldName + 'fontSize' + '_' + k]);
                                    }else if (Object.prototype.hasOwnProperty.call(data, currentFieldName + 'ImageData' + '_' + k)){
                                        this.drawFieldImage(data[`${currentFieldName}`], signatureFields, currentFieldName, data[currentFieldName + 'bounds' + '_' + k]);
                                    }
                                    else if (Object.prototype.hasOwnProperty.call(data, currentFieldName + 'bounds' + '_' + k)){
                                        this.drawFieldPath(data[`${currentFieldName}`], signatureFields, currentFieldName, data[currentFieldName + 'bounds' + '_' + k]);
                                    }
                                }
                            }
                        }
                        if (Object.prototype.hasOwnProperty.call(data, currentFieldName + 'isReadOnly') || Object.prototype.hasOwnProperty.call(data, actualFieldName + 'isReadOnly')){
                            if (Object.prototype.hasOwnProperty.call(data, actualFieldName + 'isReadOnly')){
                                currentFieldName = actualFieldName;
                            }
                            (currentField as PdfSignatureField).readOnly = data['isReadOnly'] === 'true' ? true : false;
                        }
                    }
                }
            }
        }
    }

    private addFormFieldsToDocument(formFieldAttributes: any): void {
        const loadedPage: PdfPage = this.formFieldLoadedDocument.getPage(formFieldAttributes.pageNumber - 1) as PdfPage;
        let field: PdfField;
        switch (formFieldAttributes.formFieldAnnotationType) {
        case 'Textbox':
        case 'PasswordField':
            //Create a password and text box field for name
            field = this.saveTextBoxField(loadedPage, formFieldAttributes);
            break;
        case 'Checkbox':
            // Create Check Box field.
            field = this.SaveCheckBoxField(loadedPage, formFieldAttributes);
            break;
        case 'RadioButton':
            field = this.saveRadioButtonField(formFieldAttributes);
            break;
        case 'DropdownList':
            // Create Drop Down field.
            field = this.saveDropDownField(loadedPage, formFieldAttributes);
            break;
        case 'ListBox':
            field = this.saveListBoxField(loadedPage, formFieldAttributes);
            break;
        case 'SignatureField':
        case 'InitialField':
            //Create PDF Signature and Initial field.
            field = this.saveSignatureField(loadedPage, formFieldAttributes);
            break;
        }
        if (field) {
            this.formFieldLoadedDocument.form.add(field);
        }
    }

    private setFontFromKeys(text: any, field: PdfTextBoxField | PdfComboBoxField | PdfListBoxField,
                            textFont: { [key: string]: any }, fontSize: number, hasUnicode: boolean, fontStyle: PdfFontStyle): void {
        const font: PdfTrueTypeFont = PdfViewerUtils.tryGetFontFromKeys(textFont,
                                                                        text.toString(), fontSize, fontStyle);
        if (!isNullOrUndefined(font)) {
            field.font = font;
            field.setAppearance(true);
        }
        else {
            if (hasUnicode) {
                const trueTypeFont: PdfFont = this.getTrueFont(fontSize, fontStyle);
                const isGlyphPresent: boolean = PdfViewerUtils.isSupportedFont(text, font);
                if (isGlyphPresent) {
                    field.font = trueTypeFont;
                } else {
                    this.disableFieldAppearance(field);
                }
            } else {
                this.disableFieldAppearance(field);
            }
        }
    }

    private setFontAppearance(text: string, fontFamily: string, fontSize: number,
                              field: PdfTextBoxField | PdfComboBoxField | PdfListBoxField, textFont: any,
                              hasUnicode: boolean, fontStyle: PdfFontStyle): void {
        if (!isNullOrUndefined(textFont) && Object.keys(textFont).length > 0) {
            const fontKey: any = PdfViewerUtils.getFontKey(textFont, fontFamily.toLowerCase());
            if (!isNullOrUndefined(fontKey)) {
                let fontStream: any = textFont[`${fontKey}`];
                fontStream = PdfViewerUtils.processFontStream(fontStream);
                const font: PdfTrueTypeFont = new PdfTrueTypeFont(fontStream, this.convertPixelToPoint(fontSize), fontStyle);
                const glyphPresent: boolean = PdfViewerUtils.isSupportedFont(text, font);
                field.setAppearance(glyphPresent);
                if (glyphPresent) {
                    field.font = font;
                } else {
                    this.setFontFromKeys(text, field, textFont, fontSize, hasUnicode, fontStyle);
                }
            } else {
                this.setFontFromKeys(text, field, textFont, fontSize, hasUnicode, fontStyle);
            }
        } else {
            try {
                field.font.measureString(text.toString());
            } catch (e) {
                if (hasUnicode) {
                    const trueTypeFont: PdfFont = this.getTrueFont(fontSize, fontStyle);
                    const isGlyphPresent: boolean = PdfViewerUtils.isSupportedFont(text, trueTypeFont as PdfTrueTypeFont);
                    if (isGlyphPresent) {
                        field.font = trueTypeFont;
                    } else {
                        this.disableFieldAppearance(field);
                    }
                } else {
                    this.disableFieldAppearance(field);
                }
            }
        }
    }

    private disableFieldAppearance(field: PdfTextBoxField | PdfComboBoxField | PdfListBoxField): void {
        field.setAppearance(false);
        if (isNullOrUndefined(this.defaultAppearanceFields)) {
            this.defaultAppearanceFields = [];
        }
        this.defaultAppearanceFields.push(field.name);
    }

    private saveTextBoxField(loadedPage: PdfPage, formFieldAttributes: any): PdfTextBoxField {
        const textboxName: string = isNullOrUndefined(formFieldAttributes.name) ? formFieldAttributes.type === 'Password' ? 'passwordTextbox' : 'textbox' : formFieldAttributes.name;
        const textBounds: any = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: any = this.getBounds(textBounds, loadedPage.size[1], loadedPage.size[0], rotationAngle, isFieldRotated);
        const bound: any = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        //Create a new text box field
        const textbox: PdfTextBoxField = new PdfTextBoxField(loadedPage, textboxName, bound);
        textbox.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g,
            formFieldAttributes.backgroundColor.b];
        if (formFieldAttributes.backgroundColor.r === 0 && formFieldAttributes.backgroundColor.g === 0 &&
            formFieldAttributes.backgroundColor.b === 0 && formFieldAttributes.backgroundColor.a === 0) {
            textbox.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g,
                formFieldAttributes.backgroundColor.b, formFieldAttributes.backgroundColor.a];
        }
        textbox.maxLength = formFieldAttributes.maxLength;
        textbox.insertSpaces = formFieldAttributes.insertSpaces;
        textbox.readOnly = formFieldAttributes.isReadonly;
        textbox.required = formFieldAttributes.isRequired;
        textbox.textAlignment = this.getTextAlignment(formFieldAttributes.textAlign);
        textbox.visibility = this.getFormFieldsVisibility(formFieldAttributes.visibility);
        textbox.text = isNullOrUndefined(formFieldAttributes.value) ? '' : formFieldAttributes.value;
        textbox.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? '' : formFieldAttributes.tooltip;
        textbox.color = [formFieldAttributes.fontColor.r, formFieldAttributes.fontColor.g, formFieldAttributes.fontColor.b];
        textbox.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g, formFieldAttributes.borderColor.b];
        // eslint-disable-next-line
        if (formFieldAttributes.borderColor.r == 0 && formFieldAttributes.borderColor.g == 0 &&
             // eslint-disable-next-line
             formFieldAttributes.borderColor.b == 0 && formFieldAttributes.borderColor.a == 0) {
            textbox.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g,
                formFieldAttributes.borderColor.b, formFieldAttributes.borderColor.a];
        }
        textbox.border.width = formFieldAttributes.thickness;
        textbox.multiLine = formFieldAttributes.Multiline;
        const pdfFontStyle: PdfFontStyle = this.getFontStyle(formFieldAttributes);
        textbox._dictionary.set('FontStyle', pdfFontStyle);
        // eslint-disable-next-line
        const hasUnicode: boolean = /[^\u0000-\u007F]/.test(textbox.text);
        const fontFamily: string = formFieldAttributes.FontFamily ? formFieldAttributes.FontFamily : formFieldAttributes.fontFamily;
        textbox.font = new PdfStandardFont(this.getFontFamily(fontFamily),
                                           this.convertPixelToPoint(formFieldAttributes.fontSize), pdfFontStyle);
        if (!isNullOrUndefined(textbox.text.toString())) {
            const textFont: any = this.pdfViewer.pdfRenderer.FallbackFontCollection;
            this.setFontAppearance(textbox.text.toString(), formFieldAttributes.fontFamily,
                                   formFieldAttributes.fontSize, textbox, textFont, hasUnicode, pdfFontStyle);
        }
        if (formFieldAttributes.formFieldAnnotationType === 'PasswordField') {
            textbox.password = true;
        }
        if (!isFieldRotated) {
            textbox.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        if (!isNullOrUndefined(formFieldAttributes.customData)) {
            const customData: string = JSON.stringify(formFieldAttributes.customData);
            textbox._dictionary.set('CustomData', customData);
        }
        return textbox;
    }

    private saveDropDownField(loadedPage: PdfPage, formFieldAttributes: any): PdfComboBoxField {
        const dropdownListName: string = isNullOrUndefined(formFieldAttributes.name) ? 'dropdownList' : formFieldAttributes.name;
        const dropDownListbounds: {X: number, Y: number, Width: number, Height: number} = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: any = this.getBounds(dropDownListbounds, loadedPage.size[1], loadedPage.size[0], rotationAngle, isFieldRotated);
        const bound: any = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        const comboBox: PdfComboBoxField = new PdfComboBoxField(loadedPage, dropdownListName, bound);
        let hasUnicode: boolean = false;
        for (let i: number = 0; i < formFieldAttributes.option.length; i++) {
            const item: PdfListFieldItem = new PdfListFieldItem(formFieldAttributes.option[parseInt(i.toString(), 10)].itemName,
                                                                formFieldAttributes.option[parseInt(i.toString(), 10)].itemValue);
            comboBox.addItem(item);
            // eslint-disable-next-line
            const flag: boolean = /[^\u0000-\u007F]/.test(formFieldAttributes.option[parseInt(i.toString(), 10)].itemName);
            if (flag)
            {
                hasUnicode = true;
            }
        }
        comboBox.textAlignment = this.getTextAlignment(formFieldAttributes.textAlign);
        const pdfFontStyle: PdfFontStyle = this.getFontStyle(formFieldAttributes);
        comboBox._dictionary.set('FontStyle', pdfFontStyle);
        const fontFamily: string = formFieldAttributes.FontFamily ? formFieldAttributes.FontFamily : formFieldAttributes.fontFamily;
        comboBox.font = new PdfStandardFont(this.getFontFamily(fontFamily),
                                            this.convertPixelToPoint(formFieldAttributes.fontSize), pdfFontStyle);
        for (let i: number = 0; i < formFieldAttributes.option.length; i++) {
            const comboBoxText: string = formFieldAttributes.option[parseInt(i.toString(), 10)].itemName.toString();
            if (!isNullOrUndefined(comboBoxText)) {
                const textFont: any = this.pdfViewer.pdfRenderer.FallbackFontCollection;
                this.setFontAppearance(comboBoxText, formFieldAttributes.fontFamily, formFieldAttributes.fontSize,
                                       comboBox, textFont, hasUnicode, pdfFontStyle);
                break;
            }
        }
        if (comboBox.itemsCount > 0) {
            if (formFieldAttributes.selectedIndex.length > 0) {
                comboBox.selectedIndex = formFieldAttributes.selectedIndex[0];
            } else {
                comboBox.selectedIndex = 0;
            }
        }
        comboBox.required = formFieldAttributes.isRequired;
        comboBox.readOnly = formFieldAttributes.isReadonly;
        comboBox.visibility = this.getFormFieldsVisibility(formFieldAttributes.visibility);
        comboBox.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g,
            formFieldAttributes.backgroundColor.b];
        if (formFieldAttributes.backgroundColor.r === 0 && formFieldAttributes.backgroundColor.g === 0 &&
            formFieldAttributes.backgroundColor.b === 0 && formFieldAttributes.backgroundColor.a === 0) {
            comboBox.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g,
                formFieldAttributes.backgroundColor.b, formFieldAttributes.backgroundColor.a];
        }
        comboBox.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g, formFieldAttributes.borderColor.b];
        // eslint-disable-next-line
        if (formFieldAttributes.borderColor.r == 0 && formFieldAttributes.borderColor.g == 0 &&
            // eslint-disable-next-line
            formFieldAttributes.borderColor.b == 0 && formFieldAttributes.borderColor.a == 0) {
            comboBox.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g,
                formFieldAttributes.borderColor.b, formFieldAttributes.borderColor.a];
        }
        comboBox.border.width = formFieldAttributes.thickness;
        comboBox.color = [formFieldAttributes.fontColor.r, formFieldAttributes.fontColor.g, formFieldAttributes.fontColor.b];
        if (!isFieldRotated) {
            comboBox.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        comboBox.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? '' : formFieldAttributes.tooltip;
        if (!isNullOrUndefined(formFieldAttributes.customData)) {
            const customData: string = JSON.stringify(formFieldAttributes.customData);
            comboBox._dictionary.set('CustomData', customData);
        }
        return comboBox;
    }

    private SaveCheckBoxField(loadedPage: PdfPage, formFieldAttributes: any): PdfCheckBoxField {
        const checkboxFieldName: string = isNullOrUndefined(formFieldAttributes.name) && formFieldAttributes.name === '' ? 'checkboxField' : formFieldAttributes.name;
        const checkBounds: any = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: any = this.getBounds(checkBounds, loadedPage.size[1], loadedPage.size[0], rotationAngle, isFieldRotated);
        const bound: any = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        //Create a new Check box field
        const checkBoxField: PdfCheckBoxField = new PdfCheckBoxField(checkboxFieldName, bound, loadedPage);
        checkBoxField.readOnly = formFieldAttributes.isReadonly;
        checkBoxField.required = formFieldAttributes.isRequired;
        checkBoxField.checked = formFieldAttributes.isChecked;
        checkBoxField.visibility = this.getFormFieldsVisibility(formFieldAttributes.visibility);
        checkBoxField._dictionary.set('ExportValue', formFieldAttributes.value);
        checkBoxField.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g,
            formFieldAttributes.backgroundColor.b];
        if (formFieldAttributes.backgroundColor.r === 0 && formFieldAttributes.backgroundColor.g === 0 &&
            formFieldAttributes.backgroundColor.b === 0 && formFieldAttributes.backgroundColor.a === 0) {
            checkBoxField.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g,
                formFieldAttributes.backgroundColor.b, formFieldAttributes.backgroundColor.a];
        }
        checkBoxField.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g,
            formFieldAttributes.borderColor.b];
        if (formFieldAttributes.borderColor.r === 0 && formFieldAttributes.borderColor.g === 0 && formFieldAttributes.borderColor.b === 0
             && formFieldAttributes.borderColor.a === 0) {
            checkBoxField.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g,
                formFieldAttributes.borderColor.b, formFieldAttributes.borderColor.a];
        }
        checkBoxField.border.width = formFieldAttributes.thickness;
        checkBoxField.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? '' : formFieldAttributes.tooltip;
        if (!isFieldRotated) {
            checkBoxField.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        if (!isNullOrUndefined(formFieldAttributes.customData)) {
            const customData: string = JSON.stringify(formFieldAttributes.customData);
            checkBoxField._dictionary.set('CustomData', customData);
        }
        return checkBoxField;
    }

    private saveListBoxField(loadedPage: PdfPage, formFieldAttributes: any): PdfListBoxField {
        const listBoxName: string = isNullOrUndefined(formFieldAttributes.name) ? 'listBox' : formFieldAttributes.name;
        const listBounds: any = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: any = this.getBounds(listBounds, loadedPage.size[1], loadedPage.size[0], rotationAngle, isFieldRotated);
        const bound: any = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        const listBox: PdfListBoxField = new PdfListBoxField(loadedPage, listBoxName, bound);
        let flag: boolean = false;
        let hasUnicode: boolean = false;
        for (let i: number = 0; i < formFieldAttributes.option.length; i++) {
            const item: PdfListFieldItem = new PdfListFieldItem(formFieldAttributes.option[parseInt(i.toString(), 10)].itemName,
                                                                formFieldAttributes.option[parseInt(i.toString(), 10)].itemValue);
            listBox.addItem(item);
            // eslint-disable-next-line
            const unicode: boolean = /[^\u0000-\u007F]/.test(formFieldAttributes.option[parseInt(i.toString(), 10)].itemName);
            if (unicode)
            {
                hasUnicode = true;
            }
            if (!isNullOrUndefined(item && item._dictionary && !flag)) {
                item.textAlignment = this.getTextAlignment(formFieldAttributes.textAlign);
                flag = true;
            }
        }
        if (listBox.itemsCount > 0) {
            const count: number = formFieldAttributes.selectedIndex.length;
            if (Array.isArray(formFieldAttributes.selectedIndex) && count > 0) {
                if (count === 1) {
                    listBox.selectedIndex = formFieldAttributes.selectedIndex[0];
                } else {
                    const selectedIndexes: number[] = [];
                    for (let j: number = 0; j < count; j++) {
                        selectedIndexes.push(formFieldAttributes.selectedIndex[parseInt(j.toString(), 10)]);
                    }
                    listBox.selectedIndex = selectedIndexes;
                }
            } else {
                listBox.selectedIndex = 0;
            }
        }
        listBox.textAlignment = this.getTextAlignment(formFieldAttributes.textAlign);
        listBox.multiSelect = true;
        listBox.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g,
            formFieldAttributes.backgroundColor.b];
        if (formFieldAttributes.backgroundColor.r === 0 && formFieldAttributes.backgroundColor.g === 0 &&
            formFieldAttributes.backgroundColor.b === 0 && formFieldAttributes.backgroundColor.a === 0) {
            listBox.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g,
                formFieldAttributes.backgroundColor.b, formFieldAttributes.backgroundColor.a];
        }
        listBox.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g, formFieldAttributes.borderColor.b];
        // eslint-disable-next-line
        if (formFieldAttributes.borderColor.r == 0 && formFieldAttributes.borderColor.g == 0 &&
            // eslint-disable-next-line
            formFieldAttributes.borderColor.b == 0 && formFieldAttributes.borderColor.a == 0) {
            listBox.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g,
                formFieldAttributes.borderColor.b, formFieldAttributes.borderColor.a];
        }
        listBox.border.width = formFieldAttributes.thickness;
        const pdfFontStyle: PdfFontStyle = this.getFontStyle(formFieldAttributes);
        listBox._dictionary.set('FontStyle', pdfFontStyle);
        const fontFamily: string = formFieldAttributes.FontFamily ? formFieldAttributes.FontFamily : formFieldAttributes.fontFamily;
        listBox.font = new PdfStandardFont(this.getFontFamily(fontFamily),
                                           this.convertPixelToPoint(formFieldAttributes.fontSize), pdfFontStyle);
        for (let i: number = 0; i < formFieldAttributes.option.length; i++) {
            const listBoxText: string = formFieldAttributes.option[parseInt(i.toString(), 10)].itemName.toString();
            if (!isNullOrUndefined(listBoxText)) {
                const textFont: any = this.pdfViewer.pdfRenderer.FallbackFontCollection;
                this.setFontAppearance(listBoxText, formFieldAttributes.fontFamily, formFieldAttributes.fontSize,
                                       listBox, textFont, hasUnicode, pdfFontStyle);
                break;
            }
        }
        listBox.readOnly = formFieldAttributes.isReadonly;
        listBox.required = formFieldAttributes.isRequired;
        listBox.visibility = this.getFormFieldsVisibility(formFieldAttributes.visibility);
        listBox.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? '' : formFieldAttributes.tooltip;
        if (!isFieldRotated) {
            listBox.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        if (!isNullOrUndefined(formFieldAttributes.customData)) {
            const customData: string = JSON.stringify(formFieldAttributes.customData);
            listBox._dictionary.set('CustomData', customData);
        }
        return listBox;
    }

    private saveRadioButtonField(formFieldAttributes: any): PdfRadioButtonListField {
        const loadedPage: PdfPage = this.formFieldLoadedDocument.getPage(formFieldAttributes.pageNumber - 1) as PdfPage;
        const fieldName: string = isNullOrUndefined(formFieldAttributes.radiobuttonItem[0].name) ? 'radiobuttonField' : formFieldAttributes.radiobuttonItem[0].name;
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(loadedPage, fieldName);
        let selectedIndex: number = 0;
        let isSelectedItem: boolean = false;
        let isReadOnly: boolean = false;
        let isRequired: boolean = false;
        for (let i: number = 0; i < formFieldAttributes.radiobuttonItem.length; i++) {
            const radiobuttonItem: any = formFieldAttributes.radiobuttonItem[parseInt(i.toString(), 10)];
            const page: PdfPage = this.formFieldLoadedDocument.getPage(radiobuttonItem.pageNumber - 1) as PdfPage;
            const radioButtonName: string = !(isNullOrUndefined(radiobuttonItem.value) || radiobuttonItem.value === '') ? radiobuttonItem.value : fieldName;
            const rotationAngle: number = this.getRotateAngle(page.rotation);
            const bounds: any = this.convertFieldBounds(radiobuttonItem);
            let isFieldRotated: boolean = false;
            if (formFieldAttributes.rotation !== 0) {
                isFieldRotated = true;
            }
            const fieldBounds: any = this.getBounds(bounds, page.size[1], page.size[0], rotationAngle, isFieldRotated);
            const bound: any = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
            const radioButtonItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(radioButtonName, bound, page);
            if (isFieldRotated) {
                radioButtonItem.rotationAngle = this.GetRotateAngle(page.rotation);
            }
            if (radiobuttonItem.isReadonly) {
                isReadOnly = true;
            }
            if (radiobuttonItem.isRequired) {
                isRequired = true;
            }
            radioButtonItem.borderColor = [radiobuttonItem.borderColor.r, radiobuttonItem.borderColor.g, radiobuttonItem.borderColor.b];
            // eslint-disable-next-line
            if (radiobuttonItem.borderColor.r == 0 && radiobuttonItem.borderColor.g == 0 &&
                // eslint-disable-next-line
                radiobuttonItem.borderColor.b == 0 && radiobuttonItem.borderColor.a == 0) {
                radioButtonItem.borderColor = [radiobuttonItem.borderColor.r, radiobuttonItem.borderColor.g,
                    radiobuttonItem.borderColor.b, radiobuttonItem.borderColor.a];
            }
            radioButtonItem.border.width = radiobuttonItem.thickness;
            radioButtonItem.backColor = [radiobuttonItem.backgroundColor.r, radiobuttonItem.backgroundColor.g,
                radiobuttonItem.backgroundColor.b];
            if (radiobuttonItem.backgroundColor.r === 0 && radiobuttonItem.backgroundColor.g === 0 &&
                 radiobuttonItem.backgroundColor.b === 0 && radiobuttonItem.backgroundColor.a === 0) {
                radioButtonItem.backColor = [radiobuttonItem.backgroundColor.r, radiobuttonItem.backgroundColor.g,
                    radiobuttonItem.backgroundColor.b, radiobuttonItem.backgroundColor.a];
            }
            radioButtonItem.visibility = this.getFormFieldsVisibility(radiobuttonItem.visibility);
            field.add(radioButtonItem);
            if (radiobuttonItem.isSelected) {
                selectedIndex = i;
                isSelectedItem = true;
            }
        }
        field.readOnly = isReadOnly;
        field.required = isRequired;
        field.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? '' : formFieldAttributes.tooltip;
        if (isSelectedItem)
        {field.selectedIndex = selectedIndex; }
        if (!isNullOrUndefined(formFieldAttributes.radiobuttonItem[0].customData)) {
            const customData: string = JSON.stringify(formFieldAttributes.radiobuttonItem[0].customData);
            field._dictionary.set('CustomData', customData);
        }
        else if (!isNullOrUndefined(formFieldAttributes.customData))
        {
            const customData: string = JSON.stringify(formFieldAttributes.customData);
            field._dictionary.set('CustomData', customData);
        }
        return field;
    }

    private saveSignatureField(loadedPage: PdfPage, formFieldAttributes: any): PdfSignatureField {
        const signatureFieldName: string = isNullOrUndefined(formFieldAttributes.name) ? 'signatureField' : formFieldAttributes.name;
        const signatureFieldBounds: any = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: any = this.getBounds(signatureFieldBounds, loadedPage.size[1], loadedPage.size[0],
                                                rotationAngle, isFieldRotated);
        const bound: any = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        const signatureField: PdfSignatureField = new PdfSignatureField(loadedPage, signatureFieldName, bound);
        //let page: PdfPage = signatureField.page;
        signatureField.toolTip = formFieldAttributes.tooltip;
        signatureField.required = formFieldAttributes.isRequired;
        signatureField.readOnly = formFieldAttributes.isReadonly;
        if (formFieldAttributes.formFieldAnnotationType === 'InitialField') {
            signatureField._dictionary.set('InitialField', true);
        }
        if (formFieldAttributes.value === '') {
            signatureField.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g,
                formFieldAttributes.backgroundColor.b];
            if (formFieldAttributes.backgroundColor.r === 0 && formFieldAttributes.backgroundColor.g === 0 &&
                formFieldAttributes.backgroundColor.b === 0 && formFieldAttributes.backgroundColor.a === 0) {
                signatureField.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g,
                    formFieldAttributes.backgroundColor.b, formFieldAttributes.backgroundColor.a];
            }
        }
        signatureField.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g,
            formFieldAttributes.borderColor.b];
        if (formFieldAttributes.borderColor.r === 0 && formFieldAttributes.borderColor.g === 0 &&
            formFieldAttributes.borderColor.b === 0 && formFieldAttributes.borderColor.a === 0) {
            signatureField.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g,
                formFieldAttributes.borderColor.b, formFieldAttributes.borderColor.a];
        }
        signatureField.border.width = formFieldAttributes.thickness;
        if (formFieldAttributes.visibility === 'hidden') {
            signatureField.visible = false;
        }
        else if (formFieldAttributes.visibility === 'visible') {
            signatureField.visible = true;
        }
        if (formFieldAttributes.signatureType === 'Text') {
            this.drawDesignerFieldFreeTextAnnotations(signatureField, signatureFieldName, formFieldAttributes);
        } else if (formFieldAttributes.signatureType === 'Image') {
            this.drawDesignerFieldImage(signatureField, signatureFieldName, formFieldAttributes);
        } else if (formFieldAttributes.signatureType === 'Path') {
            if (!isNullOrUndefined(formFieldAttributes.value) && formFieldAttributes.value !== '') {
                this.drawDesignerFieldPath(signatureField, signatureFieldName, formFieldAttributes);
            }
        }
        if (!isFieldRotated) {
            signatureField.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        if (!isNullOrUndefined(formFieldAttributes.customData)) {
            const customData: string = JSON.stringify(formFieldAttributes.customData);
            signatureField._dictionary.set('CustomData', customData);
        }
        return signatureField;

    }

    private drawDesignerFieldFreeTextAnnotations(signatureField: PdfSignatureField, currentFieldName: string,
                                                 formFieldAttributes: any): void {
        const boundsObjects: any = { X: formFieldAttributes.signatureBound.x, Y: formFieldAttributes.signatureBound.y,
            Width: formFieldAttributes.signatureBound.width, Height: formFieldAttributes.signatureBound.height };
        const page: PdfPage = signatureField.page;
        const pageRotationAngle: number = page.rotation;
        const zoomvalue: number = formFieldAttributes.zoomValue;
        let signBounds: any = { X: this.convertPixelToPoint(boundsObjects.X / zoomvalue),
            Y: this.convertPixelToPoint(boundsObjects.Y / zoomvalue), Width: this.convertPixelToPoint(boundsObjects.Width / zoomvalue),
            Height: this.convertPixelToPoint(boundsObjects.Height / zoomvalue) };
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        signBounds = this.getBounds(signBounds, page.size[1], page.size[0], pageRotationAngle, isFieldRotated);
        if (!isNullOrUndefined(formFieldAttributes)) {
            const left: number = signBounds.X;
            const top: number = signBounds.Y;
            const width: number = signBounds.Width;
            const height: number = signBounds.Height;
            const freeTextBounds: any = { X: left, Y: top, Width: width, Height: height };
            const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(left, top, width, height);
            annotation.setAppearance(true);
            annotation._dictionary.set('T', currentFieldName);
            const font: number = formFieldAttributes.fontSize;
            let fontFamilyEnum: PdfFontFamily = PdfFontFamily.helvetica;
            if (!isNullOrUndefined(formFieldAttributes.fontFamily)) {
                fontFamilyEnum = this.getFontFamily(formFieldAttributes.fontFamily);
            }
            const fontStyle: PdfFontStyle = this.getFontStyle(formFieldAttributes);
            // eslint-disable-next-line
            const hasUnicode: boolean = /[^\u0000-\u007F]/.test(formFieldAttributes.value);
            if (hasUnicode) {
                annotation.font = this.getTrueFont(this.convertPixelToPoint(font), fontStyle);
            } else {
                annotation.font = new PdfStandardFont(fontFamilyEnum, this.convertPixelToPoint(formFieldAttributes.fontSize), fontStyle);
            }
            annotation.text = formFieldAttributes.value;
            this.setFontSize(this.convertPixelToPoint(font), annotation.font, formFieldAttributes.value, freeTextBounds,
                             fontFamilyEnum, fontStyle);
            annotation.border.width = 0;
            annotation.textAlignment = PdfTextAlignment.center;
            annotation.flags = PdfAnnotationFlag.print;
            if (formFieldAttributes.visibility === 'hidden') {
                annotation.flags = PdfAnnotationFlag.hidden;
            }
            if (!isFieldRotated) {
                annotation.rotationAngle = Math.abs(this.getRotateAngle(page.rotation));
            }
            annotation.setValues('AnnotationType', 'Signature');
            annotation.setAppearance(true);
            page.annotations.add(annotation);
        }

    }

    private drawDesignerFieldImage(signatureField: PdfSignatureField, currentFieldName: string, formFieldAttributes: any): void {
        const boundsObjects: any = { X: formFieldAttributes.signatureBound.x, Y: formFieldAttributes.signatureBound.y,
            Width: formFieldAttributes.signatureBound.width, Height: formFieldAttributes.signatureBound.height };
        const page: PdfPage = signatureField.page;
        const pageRotationAngle: number = page.rotation;
        const zoomvalue: number = formFieldAttributes.zoomValue;
        let signBounds: any = { X: this.convertPixelToPoint(boundsObjects.X / zoomvalue),
            Y: this.convertPixelToPoint(boundsObjects.Y / zoomvalue), Width: this.convertPixelToPoint(boundsObjects.Width / zoomvalue),
            Height: this.convertPixelToPoint(boundsObjects.Height / zoomvalue) };
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        signBounds = this.getBounds(signBounds, page.size[1], page.size[0], pageRotationAngle, isFieldRotated);
        if (!isNullOrUndefined(formFieldAttributes)) {
            const left: number = signBounds.X;
            const top: number = signBounds.Y;
            const width: number = signBounds.Width;
            const height: number = signBounds.Height;
            const imageUrl: string = (formFieldAttributes.value.toString()).split(',')[1];
            const rubberStampAnnotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(left, top, width, height);
            const bitmap: PdfImage = new PdfBitmap(imageUrl);
            rubberStampAnnotation.appearance.normal.graphics.drawImage(bitmap, 0, 0, width, height);
            if (!isFieldRotated) {
                rubberStampAnnotation.rotationAngle = Math.abs(this.getRotateAngle(page.rotation));
            }
            rubberStampAnnotation._dictionary.set('T', currentFieldName);
            rubberStampAnnotation.flags = PdfAnnotationFlag.print;
            if (formFieldAttributes.visibility === 'hidden') {
                rubberStampAnnotation.flags = PdfAnnotationFlag.hidden;
            }
            page.annotations.add(rubberStampAnnotation);
        }
    }

    private drawDesignerFieldPath(signatureField: PdfSignatureField, currentFieldName: string, formFieldAttributes: any): void {
        const stampObjects: any = JSON.parse(formFieldAttributes.value);
        const boundsObjects: any = { X: formFieldAttributes.signatureBound.x, Y: formFieldAttributes.signatureBound.y,
            Width: formFieldAttributes.signatureBound.width, Height: formFieldAttributes.signatureBound.height };
        const page: PdfPage = signatureField.page;
        const pageRotationAngle: number = page.rotation;
        const zoomvalue: number = formFieldAttributes.zoomValue;
        let signBounds: any = { X: this.convertPixelToPoint(boundsObjects.X / zoomvalue),
            Y: this.convertPixelToPoint(boundsObjects.Y / zoomvalue), Width: this.convertPixelToPoint(boundsObjects.Width / zoomvalue),
            Height: this.convertPixelToPoint(boundsObjects.Height / zoomvalue) };
        signBounds = this.getBounds(signBounds, page.size[1], page.size[0], pageRotationAngle, false);
        let pageNumber: number = 0;
        for (let k: number = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
            if (page === this.formFieldLoadedDocument.getPage(k)) {
                break;
            }
            pageNumber++;
        }
        // Need to check and implement the logic of skia sharp to reduced the ink annotation thickness
        if (stampObjects.length > 0) {
            const left: number = signBounds.X;
            const top: number = signBounds.Y;
            const width: number = signBounds.Width;
            const height: number = signBounds.Height;
            let minimumX: number = -1;
            let minimumY: number = -1;
            let maximumX: number = -1;
            let maximumY: number = -1;
            const drawingPath: PdfPath = new PdfPath();
            for (let p: number = 0; p < stampObjects.length; p++) {
                const val: any = stampObjects[parseInt(p.toString(), 10)];
                drawingPath.addLine(val.x, val.y, 0, 0);
            }
            for (let p: number = 0; p <  drawingPath._points.length; p += 2) {
                const value: number[] = drawingPath._points[parseInt(p.toString(), 10)];
                if (minimumX === -1) {
                    minimumX = value[0];
                    minimumY = value[1];
                    maximumX = value[0];
                    maximumY = value[1];
                }
                else {
                    const point1: number = value[0];
                    const point2: number = value[1];
                    if (minimumX >= point1) {
                        minimumX = point1;
                    }
                    if (minimumY >= point2) {
                        minimumY = point2;
                    }
                    if (maximumX <= point1) {
                        maximumX = point1;
                    }
                    if (maximumY <= point2) {
                        maximumY = point2;
                    }
                }

            }
            const newDifferenceX: number = (maximumX - minimumX) / width;
            const newDifferenceY: number = (maximumY - minimumY) / height;
            let linePoints: number[] = [];
            let isNewValues: number = 0;
            if (pageRotationAngle !== 0) {
                for (let j: number = 0; j < stampObjects.length; j++) {
                    const value: any = stampObjects[parseInt(j.toString(), 10)];
                    const path: string = value.command.toString();
                    if (path === 'M' && j !== 0) {
                        isNewValues = j;
                        break;
                    }
                    linePoints.push(parseFloat(value.x));
                    linePoints.push(parseFloat(value.y));
                }
                linePoints = [];
                for (let z: number = 0; z < stampObjects.length; z++) {
                    const value: any = stampObjects[parseInt(z.toString(), 10)];
                    linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                    linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - ((parseFloat(value.y) - minimumY) /
                    newDifferenceY) - top);
                }
            } else {
                for (let k: number = 0; k < stampObjects.length; k++) {
                    const value: any = stampObjects[parseInt(k.toString(), 10)];
                    const path: string = value.command.toString();
                    if (path === 'M' && k !== 0) {
                        isNewValues = k;
                        break;
                    }
                    linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                    const newX: number = ((parseFloat(value.y) - minimumY) / newDifferenceY);
                    linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - newX - top);

                }
            }
            const inkAnnotation: PdfInkAnnotation = new PdfInkAnnotation([left, top, width, height], linePoints);
            inkAnnotation.flags = PdfAnnotationFlag.print;
            if (formFieldAttributes.visibility === 'hidden') {
                inkAnnotation.flags = PdfAnnotationFlag.hidden;
            }
            inkAnnotation.bounds = { x: signBounds.X, y: signBounds.Y, width: signBounds.Width, height: signBounds.Height };
            inkAnnotation.border.width = 0;
            inkAnnotation.color = [0, 0, 0];
            inkAnnotation.setValues('annotationSignature', 'annotationSignature');
            linePoints = [];
            if (pageRotationAngle !== 0) {
                const pathCollection: any[] = [];
                for (let t: number = isNewValues; t < stampObjects.length; t++) {
                    const value: any = stampObjects[parseInt(t.toString(), 10)];
                    const path: string = value.command.toString();
                    if (path === 'M' && t !== isNewValues) {
                        pathCollection.push(linePoints);
                        linePoints = [];
                    }
                    linePoints.push(parseFloat(value.x));
                    linePoints.push(parseFloat(value.y));
                }
                if (linePoints.length > 0) {
                    pathCollection.push(linePoints);
                }
                for (let w: number = 0; w < pathCollection.length; w++) {
                    const pointsCollections: any = pathCollection[parseInt(w.toString(), 10)];
                    linePoints = [];
                    if (pointsCollections.length > 0) {
                        for (let z: number = 0; z < stampObjects.length; z++) {
                            const value: any = stampObjects[parseInt(z.toString(), 10)];
                            linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                            linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - ((parseFloat(value.y) -
                            minimumY) / newDifferenceY) - top);
                        }
                        inkAnnotation.inkPointsCollection.push(linePoints);
                    }
                    linePoints = [];
                }
            } else {
                for (let r: number = 0; r < stampObjects.length; r++) {
                    const value: any = stampObjects[parseInt(r.toString(), 10)];
                    const path: string = value.command.toString();
                    if (path === 'M' && r !== 0) {
                        inkAnnotation.inkPointsCollection.push(linePoints);
                        linePoints = [];
                    }
                    linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                    const newX: number = ((parseFloat(value.y) - minimumY) / newDifferenceY);
                    linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - newX - top);
                }
                if (linePoints.length > 0) {
                    inkAnnotation.inkPointsCollection.push(linePoints);
                }
            }
            inkAnnotation._dictionary.set('T', currentFieldName);
            inkAnnotation.setAppearance(true);
            inkAnnotation.rotationAngle = Math.abs(this.getRotateAngle(page.rotation));
            this.formFieldLoadedDocument.getPage(pageNumber).annotations.add(inkAnnotation);
        }
    }

    private setFontSize(fontSize: number, font: PdfFont, text: string, freeTextBounds: any, fontFamilyEnum: PdfFontFamily,
                        fontStyle: PdfFontStyle): void {
        const minimumFontSize: number = 0.25;
        font = new PdfStandardFont(fontFamilyEnum, fontSize, fontStyle);
        do {
            fontSize = fontSize - 0.001;
            font._size = fontSize;
            if (fontSize < minimumFontSize) {
                font._size = minimumFontSize;
                break;
            }
            const sizeF: number[] = font.measureString(text);
            if (sizeF[0] < freeTextBounds.Width && sizeF[1] < freeTextBounds.height) {
                font._size = fontSize;
                break;
            }
        } while (fontSize > minimumFontSize);

    }

    private getTrueFont( fontSize: number, fontStyle: PdfFontStyle): PdfFont{
        const font: PdfFont = new PdfTrueTypeFont(getArialFontData(), this.convertPixelToPoint(fontSize), fontStyle);
        return font;
    }

    private convertFieldBounds(formFieldAttributes: any): { X: number, Y: number, Width: number, Height: number } {
        const zoomvalue: number = formFieldAttributes.zoomValue;
        return { X: this.convertPixelToPoint(formFieldAttributes.lineBound.X / zoomvalue),
            Y: this.convertPixelToPoint(formFieldAttributes.lineBound.Y / zoomvalue),
            Width: this.convertPixelToPoint(formFieldAttributes.lineBound.Width / zoomvalue),
            Height: this.convertPixelToPoint(formFieldAttributes.lineBound.Height / zoomvalue) };
    }

    private getFontFamily(font: string): PdfFontFamily {
        let fontFamily: PdfFontFamily = PdfFontFamily.helvetica;
        switch (font) {
        case 'Courier':
            fontFamily = PdfFontFamily.courier;
            break;
        case 'Times New Roman':
            fontFamily = PdfFontFamily.timesRoman;
            break;
        case 'Symbol':
            fontFamily = PdfFontFamily.symbol;
            break;
        case 'ZapfDingbats':
            fontFamily = PdfFontFamily.zapfDingbats;
            break;
        }
        return fontFamily;
    }

    //Need to calculate bound for all rotation
    private getBounds(bounds: any, pageHeight: number, pageWidth: number, pageRotation: number, isFieldRotated: boolean): any {
        let bound: any = {};
        if (pageRotation === 0) {
            bound = { X: bounds.X, Y: bounds.Y, Width: bounds.Width, Height: bounds.Height };
        }
        else if (pageRotation === 1) {
            if (isFieldRotated) {
                bound = { X: bounds.Y - (bounds.Width / 2 - bounds.Height / 2),
                    Y: pageHeight - bounds.X - bounds.Height - (bounds.Width / 2 - bounds.Height / 2),
                    Width: bounds.Width, Height: bounds.Height };
            } else {
                bound = { X: bounds.Y, Y: pageHeight - bounds.X - bounds.Width, Width: bounds.Height, Height: bounds.Width };
            }
        }
        else if (pageRotation === 2) {
            bound = { X: pageWidth - bounds.X - bounds.Width, Y: pageHeight - bounds.Y - bounds.Height,
                Width: bounds.Width, Height: bounds.Height };
        }
        else if (pageRotation === 3) {
            if (isFieldRotated) {
                bound = { X: pageWidth - bounds.Y - bounds.Height - (bounds.Width / 2 - bounds.Height / 2),
                    Y: bounds.X + (bounds.Width / 2 - bounds.Height / 2), Width: bounds.Width, Height: bounds.Height };
            }
            else {
                bound = { X: pageWidth - bounds.Y - bounds.Height, Y: bounds.X, Width: bounds.Height, Height: bounds.Width };
            }
        }
        return bound;
    }

    private getFormfieldRotation(rotation: number): number {
        let angle: number = 0;
        switch (rotation) {
        case 1:
            angle = 90;
            break;
        case 2:
            angle = 180;
            break;
        case 3:
            angle = 270;
            break;
        case 4:
            angle = 360;
            break;
        }
        return angle;
    }

    //Need to check the form field textAlignment property
    private getTextAlignment(alignment: string): PdfTextAlignment {
        let textAlignment: PdfTextAlignment;
        switch (alignment.toLowerCase()) {
        case 'left':
            textAlignment = PdfTextAlignment.left;
            break;
        case 'right':
            textAlignment = PdfTextAlignment.right;
            break;
        case 'center':
            textAlignment = PdfTextAlignment.center;
            break;
        case 'justify':
            textAlignment = PdfTextAlignment.justify;
            break;
        }
        return textAlignment;
    }

    //Need to check the form field visibility property
    private getFormFieldsVisibility(visibility: string): PdfFormFieldVisibility {
        let fieldVisibility: PdfFormFieldVisibility;
        switch (visibility) {
        case 'visible':
            fieldVisibility = PdfFormFieldVisibility.visible;
            break;
        case 'hidden':
            fieldVisibility = PdfFormFieldVisibility.hidden;
            break;
        case 'visibleNotPrintable':
            fieldVisibility = PdfFormFieldVisibility.visibleNotPrintable;
            break;
        case 'hiddenPrintable':
            fieldVisibility = PdfFormFieldVisibility.hiddenPrintable;
            break;
        }
        return fieldVisibility;
    }

    private getFontStyle(formFieldAttributes?: any): FontStyle {
        let fontStyle: PdfFontStyle;
        fontStyle = PdfFontStyle.regular;
        if ( !isNullOrUndefined(formFieldAttributes) && !isNullOrUndefined(formFieldAttributes.font)) {
            if (formFieldAttributes.font.isBold) {
                fontStyle |= PdfFontStyle.bold;
            }
            if (formFieldAttributes.font.isItalic) {
                fontStyle |= PdfFontStyle.italic;
            }
            if (formFieldAttributes.font.isUnderline) {
                fontStyle |= PdfFontStyle.underline;
            }
            if (formFieldAttributes.font.isStrikeout) {
                fontStyle |= PdfFontStyle.strikeout;
            }
        }
        return fontStyle;
    }

    private convertPixelToPoint(value: number): number {
        return (value * 72 / 96);
    }

    private convertPointtoPixel(value: number): number {
        return (value * 96 / 72);
    }

    private fontConvert(font: PdfFont): any {
        return {
            Bold: font.isBold,
            FontFamily: this.getFontFamilyString((font as PdfStandardFont).fontFamily),
            Height: font.height,
            Italic: font.isItalic,
            Name: this.getFontFamilyString((font as PdfStandardFont).fontFamily).toString(),
            Size: font.size,
            Strikeout: font.isStrikeout,
            Underline: font.isUnderline,
            Style: font.style
        };
    }

    private parseFontStyle(numberValue: number, fontObject: any): any {
        if ((numberValue & PdfFontStyle.underline) > 0) {
            fontObject.Underline = true;
        }
        if ((numberValue & PdfFontStyle.strikeout) > 0) {
            fontObject.Strikeout = true;
        }
        if ((numberValue & PdfFontStyle.bold) > 0) {
            fontObject.Bold = true;
        }
        if ((numberValue & PdfFontStyle.italic) > 0) {
            fontObject.Italic = true;
        }
        return fontObject;
    }

    /**
     * @private
     * @returns {void}
     */
    public GetFormFields(): void {
        this.PdfRenderedFormFields = [];
        const loadedForm: PdfForm = this.formFieldLoadedDocument.form;
        if (!isNullOrUndefined(loadedForm) && !isNullOrUndefined(loadedForm._fields)) {
            loadedForm.orderFormFields();
            for (let i: number = 0; i < loadedForm.count; i++) {
                const field: PdfField = loadedForm.fieldAt(i) as PdfField;
                const page: PdfPage = field.page;
                let pageNumber: number = 0;
                for (let j: number = 0; j < this.formFieldLoadedDocument.pageCount; j++) {
                    if (page === this.formFieldLoadedDocument.getPage(j)) {
                        break;
                    }
                    pageNumber++;
                }
                if (!isNullOrUndefined(field.page)) {
                    if (field instanceof PdfTextBoxField) {
                        const textBox: PdfTextBoxField = field as PdfTextBoxField;
                        if (textBox.itemsCount > 0) {
                            this.addTextBoxFieldItems(textBox);
                        } else {
                            this.addTextBoxField(textBox, pageNumber, textBox.bounds, null);
                        }

                    } else if (field instanceof PdfComboBoxField) {
                        const comboBoxField: PdfComboBoxField = loadedForm.fieldAt(i) as PdfComboBoxField;
                        this.addComboBoxField(comboBoxField, pageNumber);
                    }
                    else if (field instanceof PdfCheckBoxField) {
                        const checkbox: PdfCheckBoxField = field as PdfCheckBoxField;
                        if (checkbox.itemsCount > 1) {
                            this.addCheckBoxFieldItems(checkbox);
                        } else {
                            this.addCheckBoxField(checkbox, pageNumber, checkbox.bounds, null);
                        }
                    } else if (field instanceof PdfListBoxField) {
                        const listBoxField: PdfListBoxField = field as PdfListBoxField;
                        this.addListBoxField(listBoxField, pageNumber);
                    } else if (field instanceof PdfRadioButtonListField) {
                        for (let i: number = 0; i < field.itemsCount; i++) {
                            const item: PdfRadioButtonListItem = field.itemAt(i);
                            if (item) {
                                const page: PdfPage = item.page;
                                if (page) {
                                    this.addRadioButtonField(item, page._pageIndex, field.name);
                                }
                            }
                        }
                    }else if (loadedForm.fieldAt(i) instanceof PdfSignatureField) {
                        const signatureField: PdfSignatureField = loadedForm.fieldAt(i) as PdfSignatureField;
                        if (signatureField.isSigned && this.showDigitalSignatureAppearance) {
                            this.mIsDigitalSignaturePresent = true;
                            signatureField.flatten = true;
                        }
                        else if (!signatureField.isSigned || !this.hideEmptyDigitalSignatureFields) {
                            if (signatureField.itemsCount > 0) {
                                this.addSigntureFieldItems(signatureField);
                            } else {
                                this.addSignatureField(signatureField, pageNumber, signatureField.bounds);
                            }
                        }
                    }
                }

            }
        }
        this.retrieveInkAnnotation(this.formFieldLoadedDocument);
    }

    private addTextBoxFieldItems(field: PdfField): void {
        if (field instanceof PdfTextBoxField) {
            const textBoxField: PdfTextBoxField = field as PdfTextBoxField;
            if (textBoxField.itemsCount > 0) {
                for (let i: number = 0; i < textBoxField.itemsCount; i++) {
                    const item: PdfPage = textBoxField.itemAt(i).page;
                    if (!isNullOrUndefined(item)) {
                        let j: number = 0;
                        for (let k: number = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
                            if (item === this.formFieldLoadedDocument.getPage(j)) {
                                break;
                            }
                            j++;
                        }
                        this.addTextBoxField(textBoxField, j, textBoxField.itemAt(i).bounds, textBoxField.itemAt(i).font);
                    }

                }
            }
        }
    }

    private addTextBoxField(textBox: PdfTextBoxField, pageNumber: number, bounds: any, font?: PdfFont): void {
        const formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.FieldName = textBox.name;
        formFields.ActualFieldName = textBox.name;
        if (textBox.password) {
            formFields.Name = 'Password';
        } else {
            formFields.Name = 'Textbox';
        }
        formFields.ToolTip = textBox.toolTip;
        if (!isNullOrUndefined(bounds)) {
            formFields.LineBounds = { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height };
        } else {
            formFields.LineBounds = { X: textBox.bounds.x, Y: textBox.bounds.y, Width: textBox.bounds.width,
                Height: textBox.bounds.height };
        }
        formFields.TabIndex = textBox.tabIndex;
        formFields.PageIndex = pageNumber;
        formFields.BorderWidth = textBox.border.width;
        formFields.BorderStyle = textBox.border.style;
        if (!isNullOrUndefined(textBox.backColor)) {
            formFields.BackColor = { R: textBox.backColor[0], G: textBox.backColor[1], B: textBox.backColor[2] };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.Alignment = textBox.textAlignment;
        formFields.MaxLength = textBox.maxLength;
        formFields.Visible = textBox.visibility;
        formFields.InsertSpaces = textBox.insertSpaces;
        if (!isNullOrUndefined(font)){
            formFields.Font = this.fontConvert(font);
        }else{
            formFields.Font = this.fontConvert(textBox.font);
        }
        if (textBox._dictionary.has('FontStyle')){
            const fontStyle: any = textBox._dictionary.get('FontStyle');
            formFields.Font = this.parseFontStyle(fontStyle, formFields.Font);
        }
        formFields.Rotation = textBox.rotationAngle;
        formFields.IsReadonly = textBox.readOnly;
        formFields.IsRequired = textBox.required;
        if (!isNullOrUndefined(textBox.color)) {
            formFields.FontColor = { R: textBox.color[0], G: textBox.color[1], B: textBox.color[2] };
        }
        if (!isNullOrUndefined(textBox.borderColor)) {
            formFields.BorderColor = { R: textBox.borderColor[0], G: textBox.borderColor[1], B: textBox.borderColor[2] };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.Text = textBox.text ? textBox.text.replace('"', '') : '';
        formFields.Multiline = textBox.multiLine;
        formFields.RotationAngle = this.GetRotateAngle(textBox.page.rotation);
        if (textBox._dictionary.has('CustomData')) {
            formFields.CustomData = JSON.parse(textBox._dictionary.get('CustomData'));
        }
        formFields.TextList = [];
        this.PdfRenderedFormFields.push(formFields);
    }

    private addComboBoxField(comboBoxField: PdfComboBoxField, pageNumber: number): void {
        const formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.Name = 'DropDown';
        formFields.ToolTip = comboBoxField.toolTip;
        formFields.FieldName = comboBoxField.name;
        formFields.Font = this.fontConvert(comboBoxField.font);
        formFields.IsAutoSize = comboBoxField._isAutoFontSize;
        formFields.Selected = comboBoxField.editable;
        if (comboBoxField._dictionary.has('FontStyle')) {
            const fontStyle: number = comboBoxField._dictionary.get('FontStyle');
            formFields.Font = this.parseFontStyle(fontStyle, formFields.Font );
        }
        formFields.ActualFieldName = comboBoxField.name;
        formFields.SelectedValue = comboBoxField.selectedValue as string;
        if (comboBoxField._options.length > 0 && (typeof comboBoxField._options[0] !== 'string')){
            const selectedValue: string[][] = comboBoxField._options.filter((option: string[]) => option[0] === formFields.SelectedValue);
            if (selectedValue && selectedValue[0]) {
                formFields.SelectedValue = selectedValue[0][1];
            }
        }
        formFields.selectedIndex = comboBoxField.selectedIndex as number;
        formFields.LineBounds = { X: comboBoxField.bounds.x, Y: comboBoxField.bounds.y, Width: comboBoxField.bounds.width,
            Height: comboBoxField.bounds.height };
        formFields.TabIndex = comboBoxField.tabIndex;
        formFields.PageIndex = pageNumber;
        if (!isNullOrUndefined(comboBoxField.backColor)) {
            formFields.BackColor = { R: comboBoxField.backColor[0], G: comboBoxField.backColor[1], B: comboBoxField.backColor[2] };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.BorderWidth = comboBoxField.border.width;
        formFields.BorderStyle = comboBoxField.border.style;
        if (!isNullOrUndefined(comboBoxField.borderColor)) {
            formFields.BorderColor = { R: comboBoxField.borderColor[0], G: comboBoxField.borderColor[1], B: comboBoxField.borderColor[2] };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.FontColor = { R: comboBoxField.color[0], G: comboBoxField.color[1], B: comboBoxField.color[2] };
        formFields.Rotation = comboBoxField.rotationAngle;
        formFields.IsRequired = comboBoxField.required;
        formFields.IsReadonly = comboBoxField.readOnly;
        formFields.Visible = comboBoxField.visibility;
        formFields.RotationAngle = this.GetRotateAngle(comboBoxField.page.rotation);
        formFields.Alignment = comboBoxField.textAlignment;
        if (comboBoxField._dictionary.has('CustomData')) {
            formFields.CustomData = JSON.parse(comboBoxField._dictionary.get('CustomData'));
        }
        formFields.TextList = [];
        if (comboBoxField._dictionary.has('Opt')) {
            const options: string[] = comboBoxField._dictionary.get('Opt');
            if (options.length > 0){
                formFields.ComboBoxList = options.map((item: string | [string, string]) => { return (typeof item === 'string' ?
                    {itemName: item, itemValue: item} : (typeof item === 'object' ?
                        {itemName: item[1], itemValue: item[0] }  : {itemName: '', itemValue: ''})); });
            }
        }
        if (formFields.TextList.length === 0 ){
            for (let i: number = 0; i < comboBoxField.itemsCount; i++) {
                const item: PdfListFieldItem = comboBoxField.itemAt(i);
                if (item) {
                    formFields.TextList.push(item.text);
                    if (i === 0) {
                        formFields.Alignment = item.textAlignment;
                    }
                }
            }
        }
        this.PdfRenderedFormFields.push(formFields);
    }

    private addCheckBoxFieldItems(field: PdfField): void {
        if (field instanceof PdfCheckBoxField) {
            const checkBoxField: PdfCheckBoxField = field as PdfCheckBoxField;
            if (checkBoxField.itemsCount > 0) {
                for (let i: number = 0; i < checkBoxField.itemsCount; i++) {
                    const item: PdfPage = checkBoxField.itemAt(i).page;
                    if (!isNullOrUndefined(item)) {
                        let j: number = 0;
                        for (let k: number = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
                            if (item === this.formFieldLoadedDocument.getPage(j)) {
                                break;
                            }
                            j++;
                        }
                        this.addCheckBoxField(checkBoxField, j, checkBoxField.itemAt(i).bounds, i.toString());
                    }

                }
            }
        }
    }

    private addCheckBoxField(chkField: PdfCheckBoxField, index: number, bounds: any, checkBoxIndex: string): void {
        const formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.Name = 'CheckBox';
        formFields.ToolTip = chkField.toolTip;
        if (!bounds.IsEmpty) {
            formFields.LineBounds = { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height };
        }
        else {
            formFields.LineBounds = { X: chkField.bounds.x, Y: chkField.bounds.y, Width: chkField.bounds.width,
                Height: chkField.bounds.height };
        }
        formFields.Selected = chkField.checked;
        formFields.TabIndex = chkField.tabIndex;
        formFields.GroupName = chkField.name.replace(/[^0-9a-zA-Z]+/g, '');
        formFields.ActualFieldName = chkField.name;
        formFields.PageIndex = index;
        formFields.BorderWidth = chkField.border.width;
        if (!isNullOrUndefined(chkField.backColor)) {
            formFields.BackColor = { R: chkField.backColor[0], G: chkField.backColor[1], B: chkField.backColor[2] };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.BorderStyle = chkField.border.style;
        if (!isNullOrUndefined(chkField.borderColor)) {
            formFields.BorderColor = { R: chkField.borderColor[0], G: chkField.borderColor[1], B: chkField.borderColor[2] };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.RotationAngle = this.GetRotateAngle(chkField.page.rotation);
        formFields.IsReadonly = chkField.readOnly;
        formFields.IsRequired = chkField.required;
        formFields.Visible = chkField.visibility;
        const value: string = chkField._dictionary._get('ExportValue');
        if (chkField._dictionary._get('ExportValue') && !isNullOrUndefined(value)) {
            formFields.Value = value;
        }
        if (!isNullOrUndefined(checkBoxIndex)) {
            formFields.CheckBoxIndex = checkBoxIndex;
            const chekckboxField: any = chkField.itemAt(parseInt(checkBoxIndex, 10));
            if (!isNullOrUndefined(chekckboxField)) {
                formFields.Selected = chekckboxField.checked;
            }
        }
        formFields.RotationAngle = this.GetRotateAngle(chkField.page.rotation);
        if (chkField._dictionary.has('CustomData')) {
            formFields.CustomData = JSON.parse(chkField._dictionary.get('CustomData'));
        }
        this.PdfRenderedFormFields.push(formFields);
    }

    private addListBoxField(listBoxField: PdfListBoxField, pageNumber: number): void {
        const formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.Name = 'ListBox';
        formFields.ToolTip = listBoxField.toolTip;
        formFields.Text = listBoxField.name.replace(/[^0-9a-zA-Z]+/g, '');
        formFields.ActualFieldName = listBoxField.name;
        const itemCount: number = listBoxField.itemsCount;
        if (itemCount > 0) {
            const selectedIndex: number | number[] = listBoxField.selectedIndex;
            if (Array.isArray(selectedIndex)) {
                for (let i: number = 0; i < selectedIndex.length; i++) {
                    formFields.SelectedList.push(selectedIndex[parseInt(i.toString(), 10)]);
                }
            } else {
                formFields.SelectedList.push(selectedIndex as number);
            }
        }
        formFields.Font = this.fontConvert(listBoxField.font);
        if (listBoxField._dictionary.has('FontStyle')) {
            const fontStyle: number = listBoxField._dictionary.get('FontStyle');
            formFields.Font = this.parseFontStyle(fontStyle, formFields.Font);
        }
        formFields.LineBounds = { X: listBoxField.bounds.x, Y: listBoxField.bounds.y, Width: listBoxField.bounds.width,
            Height: listBoxField.bounds.height };
        formFields.TabIndex = listBoxField.tabIndex;
        formFields.PageIndex = pageNumber;
        formFields.BorderWidth = listBoxField.border.width;
        formFields.BorderStyle = listBoxField.border.style;
        if (!isNullOrUndefined(listBoxField.backColor)) {
            formFields.BackColor = { R: listBoxField.backColor[0], G: listBoxField.backColor[1], B: listBoxField.backColor[2] };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.FontColor = { R: listBoxField.color[0], G: listBoxField.color[1], B: listBoxField.color[2] };
        if (!isNullOrUndefined(listBoxField.borderColor)) {
            formFields.BorderColor = { R: listBoxField.borderColor[0], G: listBoxField.borderColor[1], B: listBoxField.borderColor[2] };
        }
        formFields.Rotation = listBoxField.rotationAngle;
        formFields.IsReadonly = listBoxField.readOnly;
        formFields.IsRequired = listBoxField.required;
        formFields.Visible = listBoxField.visibility;
        formFields.MultiSelect = listBoxField.multiSelect;
        //Need to implement selected value
        if (itemCount > 0) {
            if (Array.isArray(listBoxField.selectedIndex) && Array.isArray(listBoxField.selectedValue)) {
                formFields.selectedIndex = listBoxField.selectedIndex[0];
                formFields.SelectedValue = listBoxField.selectedValue[0];
            }
        }
        for (let i: number = 0; i < itemCount; i++) {
            const item: any = listBoxField._kidsCount > 0 ? listBoxField.itemAt(i) : listBoxField._options[parseInt(i.toString(), 10)];
            if (item) {
                formFields.TextList.push(listBoxField._kidsCount > 0 ? item.text : item);
                if (i === 0) {
                    formFields.Alignment = listBoxField.textAlignment;
                }
            }
        }
        formFields.RotationAngle = this.GetRotateAngle(listBoxField.page.rotation);
        if (listBoxField._dictionary.has('CustomData')) {
            formFields.CustomData = JSON.parse(listBoxField._dictionary.get('CustomData'));
        }
        this.PdfRenderedFormFields.push(formFields);
    }

    private addRadioButtonField(item: PdfRadioButtonListItem, index: number, radioButtonName: string): void {
        const parent: PdfRadioButtonListField = item._field as PdfRadioButtonListField;
        const formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.Name = 'RadioButton';
        formFields.ToolTip = parent.toolTip;
        if (!isNullOrUndefined(parent.actualName)) {
            formFields.GroupName = parent.actualName.replace(/[^0-9a-zA-Z]+/g, '');
            formFields.ActualFieldName = radioButtonName;
        }
        formFields.TabIndex = parent.tabIndex;
        formFields.Selected = item.selected;
        formFields.LineBounds = { X: item.bounds.x, Y: item.bounds.y, Width: item.bounds.width, Height: item.bounds.height };
        formFields.Value = item.value;
        formFields.PageIndex = index;
        if (!isNullOrUndefined(item.backColor)) {
            formFields.BackColor = { R: item.backColor[0], G: item.backColor[1], B: item.backColor[2] };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.BorderWidth = item.border.width;
        formFields.BorderStyle = item.border.style;
        formFields.BorderColor =  { R: parent.borderColor[0], G: parent.borderColor[1], B: parent.borderColor[2] };
        formFields.Rotation = parent.rotationAngle;
        formFields.IsRequired = parent.required;
        formFields.IsReadonly = parent.readOnly;
        formFields.Visible = parent.visibility;
        formFields.RotationAngle = this.GetRotateAngle(item.page.rotation);
        if (parent._dictionary.has('CustomData')) {
            formFields.CustomData = JSON.parse(parent._dictionary.get('CustomData'));
        }
        this.PdfRenderedFormFields.push(formFields);
    }

    private checkTransparent(backColor: any): boolean {
        let IsTransparent: boolean = false;
        if (backColor.R === 0 && backColor.G === 0 && backColor.B === 0) {
            IsTransparent = true;
        }
        return IsTransparent;
    }

    private GetRotateAngle(angleString: number): number {
        let angle: number = 0;
        switch (angleString) {
        case 0:
            angle = 0;
            break;
        case 1:
            angle = -90;
            break;
        case 2:
            angle = -180;
            break;
        case 3:
            angle = -270;
            break;
        }
        return angle;

    }

    private drawFieldFreeTextAnnotations(resultObjects: string, signatureFields: PdfSignatureField, currentFieldName: string,
                                         signatureBounds: string, fontName: string, fontSizes: number): void {
        const stampObjects: string = JSON.parse(resultObjects);
        const boundsObjects: any = JSON.parse(signatureBounds);
        const page: PdfPage = signatureFields.page;
        let pageNumber: number = 0;
        for (let k: number = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
            if (page === this.formFieldLoadedDocument.getPage(k)) {
                break;
            }
            pageNumber++;
        }
        if (!isNullOrUndefined(stampObjects) && stampObjects !== '') {
            const left: number = this.convertPixelToPoint(boundsObjects['x']);
            const top: number = this.convertPixelToPoint(boundsObjects['y']);
            const width: number = this.convertPixelToPoint(boundsObjects['width']);
            const height: number = this.convertPixelToPoint(boundsObjects['height']);
            const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(left, top, width, height);
            annotation.setAppearance(true);
            annotation._dictionary.set('T', currentFieldName);
            const fontSize: number = fontSizes > 0 ? fontSizes : height / 2;
            let fontFamilyEnum: PdfFontFamily = PdfFontFamily.helvetica;
            if (!isNullOrUndefined(fontName)) {
                const family: string = fontName;
                if (family.includes('Times New Roman')) {
                    fontFamilyEnum = PdfFontFamily.timesRoman;
                } else if (family.includes('Courier')) {
                    fontFamilyEnum = PdfFontFamily.courier;
                } else if (family.includes('Symbol')) {
                    fontFamilyEnum = PdfFontFamily.symbol;
                } else if (family.includes('ZapfDingbats')) {
                    fontFamilyEnum = PdfFontFamily.zapfDingbats;
                }
            }
            const fontStyle: PdfFontStyle = this.getFontStyle();
            annotation.font = new PdfStandardFont(fontFamilyEnum, this.convertPixelToPoint(fontSize), fontStyle);
            annotation.text = stampObjects;
            annotation.rotationAngle = this.getRotateAngle(page.rotation);
            annotation.flags = PdfAnnotationFlag.print;
            annotation.setValues('AnnotationType', 'Signature');
            annotation.setAppearance(true);
            page.annotations.add(annotation);
        }

    }

    private drawFieldImage(resultObjects: string, signatureFields: PdfSignatureField, currentFieldName: string,
                           signatureBounds: string): void{
        const stampObjects: string = JSON.parse(resultObjects);
        const boundsObjects: any = JSON.parse(signatureBounds);
        const page: PdfPage = signatureFields.page;
        let pageNumber: number = 0;
        for (let k: number = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
            if (page === this.formFieldLoadedDocument.getPage(k)) {
                break;
            }
            pageNumber++;
        }
        if (!isNullOrUndefined(stampObjects) && stampObjects !== ''){
            const imageUrl: string = (stampObjects.toString()).split(',')[1];
            const left: number = this.convertPixelToPoint(boundsObjects['x']);
            const top: number = this.convertPixelToPoint(boundsObjects['y']);
            const width: number = this.convertPixelToPoint(boundsObjects['width']);
            const height: number = this.convertPixelToPoint(boundsObjects['height']);
            const rubberStampAnnotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(left, top, width, height);
            const bitmap: PdfImage = new PdfBitmap(imageUrl);
            rubberStampAnnotation.appearance.normal.graphics.drawImage(bitmap, 0, 0, width, height);
            rubberStampAnnotation.rotationAngle = this.getRotateAngle(page.rotation);
            rubberStampAnnotation._dictionary.set('T', currentFieldName);
            rubberStampAnnotation.flags = PdfAnnotationFlag.print;
            rubberStampAnnotation.setAppearance(true);
            page.annotations.add(rubberStampAnnotation);
        }
    }

    private drawFieldPath(resultObjects: string, signatureFields: PdfSignatureField, currentFieldName: string,
                          signatureBounds: string): void{
        const stampObjects: any = JSON.parse(resultObjects);
        const boundsObjects: any = JSON.parse(signatureBounds);
        const page: PdfPage = signatureFields.page;
        let pageNumber: number = 0;
        for (let k: number = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
            if (page === this.formFieldLoadedDocument.getPage(k)) {
                break;
            }
            pageNumber++;
        }
        if (stampObjects.length > 0){
            const rotationAngle: number = this.GetRotateAngle(page.rotation);
            let left: number = this.convertPixelToPoint(boundsObjects['x']);
            let top: number = this.convertPixelToPoint(boundsObjects['y']);
            let width: number = this.convertPixelToPoint(boundsObjects['width']);
            let height: number = this.convertPixelToPoint(boundsObjects['height']);
            if (rotationAngle !== 0){
                left = this.convertPixelToPoint(signatureFields.bounds.x);
                top = this.convertPixelToPoint(signatureFields.bounds.y);
                width = this.convertPixelToPoint(signatureFields.bounds.width);
                height = this.convertPixelToPoint(signatureFields.bounds.height);
            }
            let minimumX: number = -1;
            let minimumY: number = -1;
            let maximumX: number = -1;
            let maximumY: number = -1;
            for (let p: number = 0; p < stampObjects.length; p++) {
                const value: any = stampObjects[parseInt(p.toString(), 10)];
                if (minimumX === -1) {
                    minimumX = value.x;
                    minimumY = value.y;
                    maximumX = value.x;
                    maximumY = value.y;
                }
                else {
                    const point1: number = value.x;
                    const point2: number = value.y;
                    if (minimumX >= point1) {
                        minimumX = point1;
                    }
                    if (minimumY >= point2) {
                        minimumY = point2;
                    }
                    if (maximumX <= point1) {
                        maximumX = point1;
                    }
                    if (maximumY <= point2) {
                        maximumY = point2;
                    }
                }
            }
            const newDifferenceX: number = (maximumX - minimumX) / width;
            const newDifferenceY: number = (maximumY - minimumY) / height;
            let linePoints: number[] = [];
            let isNewValues: number = 0;
            if (rotationAngle !== 0) {
                for (let j: number = 0; j < stampObjects.length; j++) {
                    const value: any = stampObjects[parseInt(j.toString(), 10)];
                    const path: string = value.command.toString();
                    if (path === 'M' && j !== 0) {
                        isNewValues = j;
                        break;
                    }
                    linePoints.push(parseFloat(value.x));
                    linePoints.push(parseFloat(value.y));
                }
                linePoints = [];
                for (let z: number = 0; z < stampObjects.length; z++) {
                    const value: any = stampObjects[parseInt(z.toString(), 10)];
                    linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                    linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - ((parseFloat(value.y) - minimumY) /
                     newDifferenceY) - top);
                }
            } else {
                for (let k: number = 0; k < stampObjects.length; k++) {
                    const value: any = stampObjects[parseInt(k.toString(), 10)];
                    const path: string = value.command.toString();
                    if (path === 'M' && k !== 0) {
                        isNewValues = k;
                        break;
                    }
                    linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                    const newX: number = ((parseFloat(value.y) - minimumY) / newDifferenceY);
                    linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - newX - top);

                }
            }
            const inkAnnotation: PdfInkAnnotation = new PdfInkAnnotation([left, top, width, height], linePoints);
            inkAnnotation.flags = PdfAnnotationFlag.print;
            const bounds: any = { x: inkAnnotation.bounds.x, y: (page.size[1] -
                (inkAnnotation.bounds.y + inkAnnotation.bounds.height)), width: inkAnnotation.bounds.width,
            height: inkAnnotation.bounds.height};
            inkAnnotation.bounds = bounds;
            inkAnnotation.border.width = 0;
            linePoints = [];
            if (rotationAngle !== 0) {
                const pathCollection: any[] = [];
                for (let t: number = isNewValues; t < stampObjects.length; t++) {
                    const value: any = stampObjects[parseInt(t.toString(), 10)];
                    const path: string = value.command.toString();
                    if (path === 'M' && t !== isNewValues) {
                        pathCollection.push(linePoints);
                        linePoints = [];
                    }
                    linePoints.push(parseFloat(value.x));
                    linePoints.push(parseFloat(value.y));
                }
                if (linePoints.length > 0) {
                    pathCollection.push(linePoints);
                }
                for (let w: number = 0; w < pathCollection.length; w++) {
                    const pointsCollections: any = pathCollection[parseInt(w.toString(), 10)];
                    linePoints = [];
                    if (pointsCollections.length > 0) {
                        for (let z: number = 0; z < stampObjects.length; z++) {
                            const value: any = stampObjects[parseInt(z.toString(), 10)];
                            linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                            linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] -
                            ((parseFloat(value.y) - minimumY) / newDifferenceY) - top);
                        }
                        inkAnnotation.inkPointsCollection.push(linePoints);
                    }
                    linePoints = [];
                }
            } else {
                for (let r: number = 0; r < stampObjects.length; r++) {
                    const value: any = stampObjects[parseInt(r.toString(), 10)];
                    const path: string = value.command.toString();
                    if (path === 'M' && r !== 0) {
                        inkAnnotation.inkPointsCollection.push(linePoints);
                        linePoints = [];
                    }
                    linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                    const newX: number = ((parseFloat(value.y) - minimumY) / newDifferenceY);
                    linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - newX - top);
                }
                if (linePoints.length > 0) {
                    inkAnnotation.inkPointsCollection.push(linePoints);
                }
            }
            inkAnnotation._dictionary.set('T', currentFieldName);
            inkAnnotation.setAppearance(true);
            this.formFieldLoadedDocument.getPage(pageNumber).annotations.add(inkAnnotation);
        }
    }

    private addSigntureFieldItems(field: PdfField): void {
        if (field instanceof PdfSignatureField) {
            const signatureField: PdfSignatureField = field as PdfSignatureField;
            if (signatureField.itemsCount > 0) {
                for (let i: number = 0; i < signatureField.itemsCount; i++) {
                    if (!isNullOrUndefined(signatureField.itemAt(i).page)) {
                        const item: PdfPage = signatureField.itemAt(i).page;
                        let j: number = 0;
                        for (let k: number = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
                            if (item === this.formFieldLoadedDocument.getPage(j)) {
                                break;
                            }
                            j++;
                        }
                        this.addSignatureField(signatureField, j, signatureField.itemAt(i).bounds);
                    }
                }
            }
        }
    }

    private addSignatureField(signatureField: PdfSignatureField, index: number, bounds: any): void {
        const formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.Name = 'SignatureField';
        formFields.ToolTip = signatureField.toolTip;
        formFields.FieldName = signatureField.name;
        formFields.ActualFieldName = signatureField.name;
        if (!bounds.IsEmpty) {
            formFields.LineBounds = { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height };
        }
        else {
            formFields.LineBounds = { X: signatureField.bounds.x, Y: signatureField.bounds.y,
                Width: signatureField.bounds.width, Height: signatureField.bounds.height };
        }
        formFields.PageIndex = index;
        formFields.TabIndex = signatureField.tabIndex;
        formFields.BorderWidth = signatureField.border.width;
        formFields.BorderStyle = signatureField.border.style;
        formFields.IsReadonly = signatureField.readOnly;
        formFields.IsRequired = signatureField.required;
        formFields.Visible = signatureField.visibility;
        if (!isNullOrUndefined(signatureField.backColor)) {
            formFields.BackColor = { R: signatureField.backColor[0], G: signatureField.backColor[1], B: signatureField.backColor[2] };
        }
        else if (formFields.IsReadonly) {
            formFields.IsTransparent = true;
        }
        formFields.IsSignatureField = true;
        formFields.Rotation = signatureField.rotationAngle;
        formFields.RotationAngle = this.GetRotateAngle(signatureField.page.rotation);
        const initialField: any = signatureField._dictionary.get('InitialField');
        if (!isNullOrUndefined(initialField)) {
            formFields.IsInitialField = initialField;
        }
        if (signatureField._dictionary.has('CustomData')) {
            formFields.CustomData = JSON.parse(signatureField._dictionary.get('CustomData'));
        }
        this.PdfRenderedFormFields.push(formFields);
    }

    private retrieveInkAnnotation(loadedDocument: any): void {
        let count: number = 1;
        for (let i: number = 0; i < loadedDocument.pageCount; i++) {
            const loadedPage: PdfPage = loadedDocument.getPage(i);
            const oldPageAnnotations: PdfAnnotationCollection = loadedPage.annotations;
            const totalAnnotation: number = parseInt(oldPageAnnotations.count.toString(), 10);
            for (let j: number = 0; j < totalAnnotation; j++) {
                const annotation: PdfAnnotation = oldPageAnnotations.at(j);
                if (annotation instanceof PdfInkAnnotation) {
                    let outputstring: string = '';
                    const inkAnnot: PdfInkAnnotation = annotation as PdfInkAnnotation;
                    const inkListX: any = [];
                    const inkListY: any = [];
                    if (inkAnnot._dictionary.has('T') && !inkAnnot._dictionary.has('NM')) {
                        if (!isNullOrUndefined(inkAnnot.inkPointsCollection)) {
                            for (let m: number = 0; m < inkAnnot.inkPointsCollection.length; m++) {
                                const inkList: number[] = inkAnnot.inkPointsCollection[parseInt(m.toString(), 10)];
                                for (let k: number = 0; k < inkList.length; k += 2) {
                                    let x: number;
                                    let y: number;
                                    if (loadedPage.rotation === PdfRotationAngle.angle90) {
                                        x = inkList[k + 1];
                                        y = inkList[parseInt(k.toString(), 10)];
                                    } else if (loadedPage.rotation === PdfRotationAngle.angle180) {
                                        x = loadedPage.size[0] - inkList[k + 1];
                                        y = inkList[k + 1];
                                    } else if (loadedPage.rotation === PdfRotationAngle.angle270) {
                                        x = loadedPage.size[0] - inkList[k + 1];
                                        y = loadedPage.size[1] - inkList[parseInt(k.toString(), 10)];
                                    } else {
                                        x = inkList[parseInt(k.toString(), 10)];
                                        y = loadedPage.size[1] - inkList[k + 1];
                                    }
                                    if (k === 0) {
                                        outputstring += 'M' + x + ',' + y + ' ';
                                    } else {
                                        outputstring += 'L' + x + ',' + y + ' ';
                                    }
                                    inkListX.push(x);
                                    inkListY.push(y);
                                }
                            }
                        }
                        const formFields: PdfRenderedFields = new PdfRenderedFields();
                        if (inkAnnot._dictionary.has('T')){
                            formFields.FieldName = inkAnnot._dictionary.get('T');
                        }
                        formFields.FieldName = formFields.FieldName + '_' + count;
                        formFields.Name = 'ink';
                        const rotationAngle: number = loadedPage.rotation;
                        let isFieldRotated: boolean = false;
                        if (annotation.rotationAngle !== 0){
                            isFieldRotated = true;
                        }
                        const bounds: any = {X: inkAnnot.bounds.x, Y: inkAnnot.bounds.y, Width: inkAnnot.bounds.width,
                            Height: inkAnnot.bounds.height};
                        formFields.LineBounds = this.getBounds(bounds, loadedPage.size[1], loadedPage.size[0], rotationAngle,
                                                               !isFieldRotated);
                        formFields.Value = outputstring;
                        formFields.PageIndex = i;
                        formFields.BorderColor = [inkAnnot.color[0], inkAnnot.color[1], inkAnnot.color[2]];
                        formFields.Rotation = annotation.rotationAngle;
                        this.PdfRenderedFormFields.push(formFields);
                        count++;
                    }
                }else if (annotation instanceof PdfFreeTextAnnotation){
                    const inkAnnot: PdfFreeTextAnnotation = annotation as PdfFreeTextAnnotation;
                    if (inkAnnot._dictionary.has('T') && ! inkAnnot._dictionary.has('NM') && ! inkAnnot._dictionary.has('M')){
                        const formFields: PdfRenderedFields = new PdfRenderedFields();
                        formFields.FieldName = inkAnnot._dictionary.get('T') + '_' + count;
                        const bounds: any = {X: inkAnnot.bounds.x, Y: inkAnnot.bounds.y, Width: inkAnnot.bounds.width,
                            Height: inkAnnot.bounds.height};
                        formFields.LineBounds = bounds;
                        formFields.Name = 'SignatureText';
                        formFields.FontFamily = this.getFontFamilyString((inkAnnot.font as PdfStandardFont)._fontFamily);
                        formFields.FontSize = this.convertPointtoPixel(inkAnnot.font.size);
                        formFields.Value = inkAnnot.text;
                        formFields.PageIndex = i;
                        formFields.BorderColor = inkAnnot.borderColor;
                        this.PdfRenderedFormFields.push(formFields);
                        count ++;
                    }
                } else if (annotation instanceof PdfRubberStampAnnotation) {
                    const stampAnnotation: PdfRubberStampAnnotation = annotation as PdfRubberStampAnnotation;
                    const pdfRenderedFormFields: any[] = [];
                    for (const formfield of this.PdfRenderedFormFields) {
                        if (formfield.ActualFieldName === stampAnnotation._dictionary._map.T) {
                            pdfRenderedFormFields.push(formfield);
                            break;
                        }
                    }
                    if (stampAnnotation._dictionary.has('T') && !stampAnnotation._dictionary.has('NM') && !stampAnnotation._dictionary.has('M')
                        && pdfRenderedFormFields.length > 0 && this.pdfViewerBase.isSignatureWithInRect(
                        this.pdfViewerBase.canvasRectArray(pdfRenderedFormFields[0].LineBounds),
                        this.pdfViewerBase.canvasRectArray(stampAnnotation.bounds))) {
                        const formFields: PdfRenderedFields = new PdfRenderedFields();
                        formFields.FieldName = stampAnnotation._dictionary.get('T') + '_' + count;
                        const dictionary: any = annotation._dictionary.get('AP');
                        const pageRender: PageRenderer = new PageRenderer(this.pdfViewer, this.pdfViewerBase);
                        formFields.LineBounds = {
                            X: stampAnnotation.bounds.x, Y: stampAnnotation.bounds.y,
                            Width: stampAnnotation.bounds.width, Height: stampAnnotation.bounds.height
                        };
                        formFields.Name = 'SignatureImage';
                        formFields.PageIndex = i;
                        count++;
                        if (isNullOrUndefined(dictionary)) {
                            const pdfReference: any = annotation._dictionary.get('AP');
                            if (!isNullOrUndefined(pdfReference) && !isNullOrUndefined(pdfReference.dictionary as _PdfDictionary) && pdfReference.dictionary.has('N')) {
                                const apDictionary: _PdfDictionary = pdfReference.dictionary as _PdfDictionary;
                                if (!isNullOrUndefined(apDictionary)) {
                                    pageRender.findStampImage(annotation);
                                }
                            }
                        } else if (dictionary.has('N')) {
                            const template: PdfTemplate = annotation.createTemplate();
                            if (template.size[0] === 0 || template.size[1] === 0 || isNullOrUndefined(template._appearance)) {
                                pageRender.findStampImage(annotation);
                            }
                            else {
                                formFields.PageIndex = i;
                                pageRender.findStampTemplate(
                                    annotation,
                                    formFields,
                                    formFields.Rotation,
                                    pageRender.annotationOrder.length - 1,
                                    true,
                                    formFields.FieldName,
                                    this.PdfRenderedFormFields,
                                    formFields.PageIndex
                                );
                            }
                        }
                    }
                }
            }
        }
    }

    private getFontFamilyString(fontFamily: PdfFontFamily): string {
        switch (fontFamily) {
        case PdfFontFamily.helvetica:
            return 'Helvetica';
        case PdfFontFamily.timesRoman:
            return 'Times New Roman';
        case PdfFontFamily.courier:
            return 'Courier';
        case PdfFontFamily.symbol:
            return 'Symbol';
        case PdfFontFamily.zapfDingbats:
            return 'ZapfDingbats';
        default:
            return 'Helvetica';
        }
    }
}

/**
 * @private
 */
export class PdfRenderedFields {
    public LineBounds: any;
    public Name: string;
    public FieldName: string;
    public CheckBoxIndex: string;
    public ComboBoxList: object[];
    public ActualFieldName: string;
    public CheckBoxGroupName: string;
    public GroupName: string;
    public Text: string;
    public IsTransparent: boolean;
    public ToolTip: string;
    public Multiline: boolean;
    public MultiSelect: boolean;
    public Selected: boolean;
    public PageIndex: number;
    public Visible: number;
    public Alignment: number;
    public Value: string;
    public FontStyle: PdfFontStyle;
    public selectedIndex: number;
    public IsSignatureField: boolean;
    public IsInitialField: boolean;
    public TextList: string[];
    public SelectedList: number[];
    public SelectedValue: string;
    public BackColor: any;
    public BorderColor: any;
    public Foreground: number[];
    public Font: any;
    public FontColor: any;
    public BorderStyle: any;
    public BorderWidth: number;
    public MaxLength: number;
    public FontSize: number;
    public InsertSpaces: boolean;
    public IsRequired: boolean;
    public Rotation: number;
    public IsReadonly: boolean;
    public RotationAngle: number;
    public IsAutoSize: boolean;
    public TabIndex: number;
    public FontFamily: string;
    public CustomData: object;
    constructor() {
        this.ActualFieldName = null;
        this.FontColor = { R: 0, G: 0, B: 0 };
        this.BackColor = {R: 0, G: 0, B: 0};
        this.BorderColor = {R: 0, G: 0, B: 0};
        this.CheckBoxGroupName = null;
        this.Alignment = 0;
        this.BorderStyle = 0;
        this.BorderWidth = 0;
        this.CheckBoxGroupName = null;
        this.CheckBoxIndex = null;
        this.ComboBoxList = [];
        this.FieldName = null;
        this.Font = null;
        this.FontFamily = null;
        this.FontSize = 0;
        this.FontStyle = 0;
        this.GroupName = null;
        this.InsertSpaces = false;
        this.IsAutoSize = false;
        this.IsInitialField = false;
        this.IsReadonly = false;
        this.IsRequired = false;
        this.IsSignatureField = false;
        this.IsTransparent = false;
        this.MaxLength = 0;
        this.MultiSelect = false;
        this.Multiline = false;
        this.Name = null;
        this.PageIndex = 0;
        this.Rotation = 0;
        this.RotationAngle = 0;
        this.Selected = false;
        this.SelectedList = [];
        this.SelectedValue = null;
        this.TabIndex = 0;
        this.Text = null;
        this.TextList = [];
        this.ToolTip = null;
        this.Value = null;
        this.Visible = 0;
        this.CustomData = null;
    }
}
