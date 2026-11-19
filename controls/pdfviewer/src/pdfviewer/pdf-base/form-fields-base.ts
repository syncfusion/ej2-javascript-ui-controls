import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfDocument, PdfPage, PdfForm, PdfTextBoxField, PdfFormFieldVisibility, PdfTextAlignment, PdfSignatureField, PdfField, PdfFreeTextAnnotation, PdfFontFamily, PdfStandardFont, PdfAnnotationFlag, PdfRubberStampAnnotation, PdfImage, PdfBitmap, PdfGraphics, PdfGraphicsState, PdfFontStyle as FontStyle, PdfCheckBoxField, PdfComboBoxField, PdfListBoxField, PdfListFieldItem, PdfRadioButtonListField, PdfRadioButtonListItem, PdfRotationAngle, PdfFontStyle, PdfFont, PdfTemplate, PdfInkAnnotation, PdfTrueTypeFont, PdfAnnotationCollection, PdfAnnotation, _PdfReference, _PdfDictionary, _PdfName, PdfPath, Rectangle, Point, Size, PdfButtonField, PdfJavaScriptAction, PdfStateItem, PdfWidgetAnnotation, PdfBorderStyle, PdfColor, PdfDestination, PdfDestinationMode, PdfGoToAction, PdfAction, PdfBrush, PdfBarcodeField, PdfBarcodeSymbology, PdfBarcodeValueFormat, PdfQRErrorCorrectionLevel, PdfBarcodeOptions, Pdf417ErrorCorrectionLevel} from '@syncfusion/ej2-pdf';
import { PdfViewer, PdfViewerBase, PageRenderer, PageRotation, AnnotationRenderer, Path, PdfAnnotationBaseModel, IAnnotationList, IFormFieldCollection, PdfFormFieldBaseModel, IFormField, IFormFieldBound, IPdfRectBounds, IRadiobuttonItem, PdfFontModel, AnnotColor, SignatureIndicatorSettingsModel, RGBA, ActionsSettingsModel, BarcodeSymbology, QRErrorCorrectionLevel, Pdf417ErrorCorrectionLevel as Pdf417ErrorCorrection, BarcodeValueFormat } from '../index';
import { getArialFontData } from '../pdf-base/fontData';
import { PathSegment, Rect } from './../ej2-drawings/index';
import { PdfViewerUtils } from '../base/pdfviewer-utlis';
import { readActionScript } from '../base/af-format';

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
     * @param {PdfAnnotationBaseModel} textSignature - This is textSignature
     * @param {PdfDocument} loadedDocument - loadedDocument
     * @param {boolean} isAnnotationFlattern - isAnnotationFlattern
     * @returns {void}
     */
    public drawFreeTextAnnotations(
        textSignature: PdfAnnotationBaseModel, loadedDocument: PdfDocument, isAnnotationFlattern: boolean): void {
        const stampObjects: string = textSignature.data as string;
        const textData: string = stampObjects.replace(/"/g, '');
        const boundsObject: Rect = JSON.parse(textSignature.bounds as string);
        const page: PdfPage = loadedDocument.getPage(textSignature.pageIndex as number);
        if (stampObjects !== '') {
            const left: number = this.convertPixelToPoint(boundsObject.left);
            const top: number = this.convertPixelToPoint(boundsObject.top);
            const width: number = this.convertPixelToPoint(boundsObject.width);
            const height: number = this.convertPixelToPoint(boundsObject.height);
            const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({x: left, y: top, width: width, height: height});
            annotation._dictionary.set('NM', (textSignature.signatureName as string).toString());
            let fontSize: number = textSignature.fontSize as number;
            annotation.border.width = 0;
            let fontFamilyEnum: PdfFontFamily = PdfFontFamily.helvetica;
            const fontName: string = (textSignature.fontFamily as string).toString();
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
            annotation.borderColor = {r: 0, g: 0, b: 0};
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

    /**
     * @private
     * @param {PdfAnnotationBaseModel} textSignature - This is textSignature
     * @param {PdfDocument} loadedDocument - loadedDocument
     * @param {boolean} isAnnotationFlattern - isAnnotationFlattern
     * @returns {void}
     */
    public updateFreeTextAnnotations(
        textSignature: PdfAnnotationBaseModel, loadedDocument: PdfDocument, isAnnotationFlattern: boolean): void {
        const stampObjects: string = textSignature.data as string;
        const annotationIndex: number = textSignature.annotationIndex as number;
        const textData: string = stampObjects.replace(/"/g, '');
        const boundsObject: Rect = JSON.parse(textSignature.bounds as string);
        const page: PdfPage = loadedDocument.getPage(textSignature.pageIndex as number);
        let signatureAnnotation: PdfAnnotation;
        const pdfAnnotations: PdfAnnotationCollection = page.annotations;
        const matchedAnnotation: IAnnotationList | undefined =
            this.pdfViewerBase.pdfAnnotationList.find((item: IAnnotationList) => item.annotationIndex === annotationIndex);
        for (let i: number = 0; i < pdfAnnotations.count; i++) {
            const currentAnnotation: PdfAnnotation = page.annotations.at(i);
            if (!isNullOrUndefined(matchedAnnotation) && currentAnnotation._dictionary.objId
                === (matchedAnnotation as IAnnotationList).annotation._dictionary.objId) {
                signatureAnnotation = currentAnnotation;
                break;
            }
        }
        if (stampObjects !== '') {
            const left: number = this.convertPixelToPoint(boundsObject.left);
            const top: number = this.convertPixelToPoint(boundsObject.top);
            const width: number = this.convertPixelToPoint(boundsObject.width);
            const height: number = this.convertPixelToPoint(boundsObject.height);
            if (signatureAnnotation instanceof PdfFreeTextAnnotation) {
                const annotation: PdfFreeTextAnnotation = signatureAnnotation;
                annotation.bounds = {x: left, y: top, width: width, height: height};
                annotation._dictionary.set('NM', (textSignature.signatureName as string).toString());
                let fontSize: number = textSignature.fontSize as number;
                annotation.border.width = 0;
                let fontFamilyEnum: PdfFontFamily = PdfFontFamily.helvetica;
                const fontName: string = (textSignature.fontFamily as string).toString();
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
                annotation.borderColor = {r: 0, g: 0, b: 0};
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
                annotation._dictionary._updated = true;
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.formFieldLoadedDocument = null;
        this.defaultAppearanceFields = null;
        this.pageRenderer = null;
        this.mIsDigitalSignaturePresent = null;
        this.showDigitalSignatureAppearance = null;
        this.hideEmptyDigitalSignatureFields = null;
        this.PdfRenderedFormFields = null;
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
     * @param {PdfAnnotationBaseModel} signatureImage - signatureImage
     * @param {PdfDocument} loadedDocument - loadedDocument
     * @param {boolean} isAnnotationFlattern - isAnnotationFlattern
     * @returns {void}
     */
    public drawImage(signatureImage: PdfAnnotationBaseModel, loadedDocument: PdfDocument, isAnnotationFlattern: boolean): void {
        const stampObjects: string = signatureImage.data as string;
        const boundsObject: Rect = JSON.parse(signatureImage.bounds as string);
        const page: PdfPage = loadedDocument.getPage(signatureImage.pageIndex as number);
        if (stampObjects !== '') {
            const imageUrl: string = (stampObjects.toString()).split(',')[1];
            const left: number = this.convertPixelToPoint(boundsObject.left);
            const top: number = this.convertPixelToPoint(boundsObject.top);
            let width: number = this.convertPixelToPoint(boundsObject.width);
            let height: number = this.convertPixelToPoint(boundsObject.height);
            if (page.rotation === PdfRotationAngle.angle90 || page.rotation === PdfRotationAngle.angle270) {
                [width, height] = [height, width];
            }
            const rubberStampAnnotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(
                {x: left, y: top, width: width, height: height});
            const bitmap: PdfImage = new PdfBitmap(imageUrl);
            const graphics: PdfGraphics = page.graphics;
            const appearance: PdfTemplate = rubberStampAnnotation.appearance.normal;
            rubberStampAnnotation._dictionary.set('NM', (signatureImage.signatureName as string).toString());
            const rotationAngle: number = this.getRotateAngle(page.rotation);
            rubberStampAnnotation.rotationAngle = Math.abs(rotationAngle);
            const bounds: Rectangle = {
                x: 0,
                y: 0,
                width: width,
                height: height
            };
            if (isAnnotationFlattern) {
                rubberStampAnnotation.flatten = true;
            }
            if (!isAnnotationFlattern) {
                const state: PdfGraphicsState = graphics.save();
                appearance.graphics.drawImage(bitmap, bounds);
                appearance.graphics.restore(state);
            }
            else {
                appearance.graphics.drawImage(bitmap, bounds);
            }
            page.annotations.add(rubberStampAnnotation);
        }
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} signatureImage - signatureImage
     * @param {PdfDocument} loadedDocument - loadedDocument
     * @param {boolean} isAnnotationFlattern - isAnnotationFlattern
     * @returns {void}
     */
    public updateImage(signatureImage: PdfAnnotationBaseModel, loadedDocument: PdfDocument, isAnnotationFlattern: boolean): void {
        const stampObjects: string = signatureImage.data as string;
        const annotationIndex: number = signatureImage.annotationIndex as number;
        const boundsObject: Rect = JSON.parse(signatureImage.bounds as string);
        const page: PdfPage = loadedDocument.getPage(signatureImage.pageIndex as number);
        let signatureAnnotation: PdfAnnotation;
        const pdfAnnotations: PdfAnnotationCollection = page.annotations;
        const matchedAnnotation: IAnnotationList | undefined =
            this.pdfViewerBase.pdfAnnotationList.find((item: IAnnotationList) => item.annotationIndex === annotationIndex);
        for (let i: number = 0; i < pdfAnnotations.count; i++) {
            const currentAnnotation: PdfAnnotation = page.annotations.at(i);
            if (!isNullOrUndefined(matchedAnnotation) && currentAnnotation._dictionary.objId
                === (matchedAnnotation as IAnnotationList).annotation._dictionary.objId) {
                signatureAnnotation = currentAnnotation;
                break;
            }
        }
        if (stampObjects !== '') {
            const imageUrl: string = (stampObjects.toString()).split(',')[1];
            const left: number = this.convertPixelToPoint(boundsObject.left);
            const top: number = this.convertPixelToPoint(boundsObject.top);
            let width: number = this.convertPixelToPoint(boundsObject.width);
            let height: number = this.convertPixelToPoint(boundsObject.height);
            if (page.rotation === PdfRotationAngle.angle90 || page.rotation === PdfRotationAngle.angle270) {
                [width, height] = [height, width];
            }
            if (signatureAnnotation instanceof PdfRubberStampAnnotation) {
                const rubberStampAnnotation: PdfRubberStampAnnotation = signatureAnnotation;
                rubberStampAnnotation.bounds = {x: left, y: top, width: width, height: height};
                const bitmap: PdfImage = new PdfBitmap(imageUrl);
                const graphics: PdfGraphics = page.graphics;
                const appearance: PdfTemplate = rubberStampAnnotation.appearance.normal;
                rubberStampAnnotation._dictionary.set('NM', (signatureImage.signatureName as string).toString());
                const rotationAngle: number = this.getRotateAngle(page.rotation);
                rubberStampAnnotation.rotationAngle = Math.abs(rotationAngle);
                if (isAnnotationFlattern) {
                    rubberStampAnnotation.flatten = true;
                }
                const bounds: Rectangle = {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height
                };
                if (!isAnnotationFlattern) {
                    const state: PdfGraphicsState = graphics.save();
                    appearance.graphics.drawImage(bitmap, bounds);
                    appearance.graphics.restore(state);
                }
                else {
                    appearance.graphics.drawImage(bitmap, bounds);
                }
                rubberStampAnnotation._dictionary._updated = true;
            }
        }
    }

    /**
     * @private
     * @param {Object} jsonObject - jsonObject
     * @returns {void}
     */
    public saveFormFieldsDesignerData(jsonObject: { [key: string]: string | boolean }): void {
        if (Object.prototype.hasOwnProperty.call(jsonObject, 'formDesigner')) {
            const formFields: string = jsonObject['formDesigner'] as string;
            if (!isNullOrUndefined(formFields)) {
                const data: IFormFieldCollection[] = JSON.parse(formFields);
                const myList: number[] = [];
                const formFieldsPageList: Array<number> = Object.prototype.hasOwnProperty.call(jsonObject, 'formFieldsPageList') ? JSON.parse(jsonObject['formFieldsPageList'] as string) : myList;
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
                    this.addFormFieldsToDocument(data[parseInt(i.toString(), 10)].FormField as IFormField);
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

    private setFont(
        field: Record<string, string | number | boolean>, currentField: PdfTextBoxField | PdfListBoxField | PdfComboBoxField
    ): void {
        const pdfFontStyle: PdfFontStyle = this.getFontStyle();
        currentField._dictionary.set('FontStyle', pdfFontStyle);
        // eslint-disable-next-line
        const hasUnicode: boolean = /[^\u0000-\u007F]/.test((currentField as PdfTextBoxField).text);
        if (hasUnicode) {
            currentField.font = this.getTrueFont((field.fontSize as number), pdfFontStyle);

        } else {
            if (field.FontFamily && field.fontSize) {
                currentField.font = new PdfStandardFont(this.getFontFamily(field.FontFamily as string),
                                                        this.convertPixelToPoint(field.fontSize as number), pdfFontStyle);
            }
        }
    }

    /**
     * @private
     * @param {Object} jsonObject - jsonObject
     * @returns {void}
     */
    public saveFormFieldsData(jsonObject: { [key: string]: string | boolean }): void {
        if (Object.prototype.hasOwnProperty.call(jsonObject, 'fieldsData')) {
            const formFields: string = jsonObject['fieldsData'] as string;
            const data: Record<string, {}> = JSON.parse(formFields);
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
                                const field: Record<string, string | number | boolean> = data[`${currentFieldName}`];
                                if (!isNullOrUndefined(field) && Object.prototype.hasOwnProperty.call(field, 'isReadOnly')) {
                                    (currentField as PdfTextBoxField).text = field['fieldValue'] as string;
                                    (currentField as PdfTextBoxField).readOnly = field['isReadOnly'] === true ? true : false;
                                }
                                this.setFont(field, currentField);
                            }
                        } else {
                            if ((Object.prototype.hasOwnProperty.call(data, currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (Object.prototype.hasOwnProperty.call(data, actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                                if (Object.prototype.hasOwnProperty.call(data, actualFieldName)) {
                                    currentFieldName = actualFieldName;
                                }
                                const field: Record<string, string | number | boolean> = data[`${currentFieldName}`];
                                if (!isNullOrUndefined(field) && Object.prototype.hasOwnProperty.call(field, 'isReadOnly')) {
                                    (currentField as PdfTextBoxField).text = field['fieldValue'] as string;
                                    (currentField as PdfTextBoxField).readOnly = field['isReadOnly'] === true ? true : false;
                                }
                                this.setFont(field, currentField);
                            }
                        }
                    } else if (currentField instanceof PdfComboBoxField) {
                        if ((Object.prototype.hasOwnProperty.call(data, currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (Object.prototype.hasOwnProperty.call(data, actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                            if (Object.prototype.hasOwnProperty.call(data, actualFieldName)) {
                                currentFieldName = actualFieldName;
                            }
                            const field: Record<string, string | number | boolean> = data[`${currentFieldName}`];
                            const count: number = currentField.itemsCount;
                            let fieldName: string = '';
                            if (!isNullOrUndefined(field)) {
                                if (Object.prototype.hasOwnProperty.call(field, 'isReadOnly')) {
                                    currentField.readOnly = field['isReadOnly'] === 'true' ? true : false;
                                }
                                if (!isNullOrUndefined(field['fieldValue'])) {
                                    fieldName = field['fieldValue'] as string;
                                }
                            }
                            let isExists: boolean = false;
                            for (let j: number = 0; j < count; j++) {
                                let optionArray: Array<string>;
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
                            const field: Record<string, string | number | boolean> = data[`${currentFieldName}`];
                            const fields: boolean = field['isSelected'] as boolean;
                            const fieldValueString: string = fields.toString();
                            const fieldValue: string = field['fieldValue'] as string;
                            currentField.exportValue = fieldValue;
                            if (fieldValueString.toLowerCase() === 'true' || fieldValueString.toLowerCase() === 'false') {
                                (currentField as PdfCheckBoxField).checked = fields;
                                if (!isNullOrUndefined(field) && Object.prototype.hasOwnProperty.call(field, 'isReadOnly')) {
                                    (currentField as PdfCheckBoxField).readOnly = field.readonly as boolean;
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
                            const table: Record<string, string | number | boolean> = data[`${currentFieldName}`];
                            const count: number = currentField.itemsCount;
                            let fieldName: string = '';
                            if (!isNullOrUndefined(table)) {
                                if (Object.prototype.hasOwnProperty.call(table, 'fieldValue') && !isNullOrUndefined(table['fieldValue'])) {
                                    fieldName = table['fieldValue'] as string;
                                }
                                if (Object.prototype.hasOwnProperty.call(table, 'isReadOnly')) {
                                    currentField.readOnly = table['isReadOnly'] === 'true' ? true : false;
                                }
                            }
                            fieldName = !isNullOrUndefined(JSON.parse(fieldName) [0]) ? JSON.parse(fieldName) [0].itemName.replace(/[^0-9a-zA-Z]+/g, '') : '';
                            const selectedIndexes: number[] = [];
                            for (let k: number = 0; k < count; k++) {
                                const text: string = currentField.itemAt(k).text.replace(/[^0-9a-zA-Z]+/g, '');
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
                            const field: Record<string, string | number | boolean> = data[`${currentFieldName}`];
                            if (!isNullOrUndefined(field) && Object.prototype.hasOwnProperty.call(field, 'isReadOnly')) {
                                const selectedValue: string = field['fieldValue'] as string;
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
                                this.drawFieldFreeTextAnnotations(data[`${currentFieldName}`] as string, signatureFields, currentFieldName, data[`${currentFieldName}` + 'bounds'] as string, data[currentFieldName + 'fontName'] as string, data[currentFieldName + 'fontSize'] as number);
                            }else if (Object.prototype.hasOwnProperty.call(data, currentFieldName + 'ImageData')){
                                this.drawFieldImage(data[`${currentFieldName}`] as string, signatureFields, currentFieldName, data[currentFieldName + 'bounds'] as string);
                            }
                            else if (Object.prototype.hasOwnProperty.call(data, currentFieldName + 'bounds')){
                                this.drawFieldPath(data[`${currentFieldName}`] as string, signatureFields, currentFieldName, data[currentFieldName + 'bounds'] as string);
                            }
                            const signatureFieldListCount: number = signatureFields.itemsCount;
                            if (signatureFieldListCount > 0){
                                for (let k: number = 0; k < signatureFieldListCount; k++ ){
                                    if (Object.prototype.hasOwnProperty.call(data, currentFieldName + 'fontName' + '_' + k)){
                                        this.drawFieldFreeTextAnnotations(data[`${currentFieldName}`] as string, signatureFields, currentFieldName, data[currentFieldName + 'bounds' + '_' + k] as string, data[currentFieldName + 'fontName' + '_' + k] as string, data[currentFieldName + 'fontSize' + '_' + k] as number);
                                    }else if (Object.prototype.hasOwnProperty.call(data, currentFieldName + 'ImageData' + '_' + k)){
                                        this.drawFieldImage(data[`${currentFieldName}`] as string, signatureFields, currentFieldName, data[currentFieldName + 'bounds' + '_' + k] as string);
                                    }
                                    else if (Object.prototype.hasOwnProperty.call(data, currentFieldName + 'bounds' + '_' + k)){
                                        this.drawFieldPath(data[`${currentFieldName}`] as string, signatureFields, currentFieldName, data[currentFieldName + 'bounds' + '_' + k] as string);
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

    private addFormFieldsToDocument(formFieldAttributes: IFormField): void {
        const loadedPage: PdfPage = this.formFieldLoadedDocument.getPage((formFieldAttributes.pageNumber as number) - 1) as PdfPage;
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
        case 'ButtonField':
        case 'Button':
            // Designer session stores internal annotation type 'Button'; public API uses 'ButtonField'.
            field = this.saveButtonField(loadedPage, formFieldAttributes);
            break;
        case 'BarcodeField':
            field = this.saveBarcodeField(loadedPage, formFieldAttributes);
            break;

        }
        if (field) {
            this.formFieldLoadedDocument.form.add(field);
        }
    }

    private setFontFromKeys(text: string, field: PdfTextBoxField | PdfComboBoxField | PdfListBoxField,
                            textFont: { [key: string]: Uint8Array }, fontSize: number, hasUnicode: boolean, fontStyle: PdfFontStyle): void {
        const font: PdfTrueTypeFont = PdfViewerUtils.tryGetFontFromKeys(textFont, text.toString(), fontSize, fontStyle) as PdfTrueTypeFont;
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
                              field: PdfTextBoxField | PdfComboBoxField | PdfListBoxField, textFont: { [key: string]: Uint8Array },
                              hasUnicode: boolean, fontStyle: PdfFontStyle): void {
        const defaultFonts: string[] = ['Helvetica', 'Times New Roman', 'Courier', 'Symbol', 'ZapfDingbats'];
        if (!isNullOrUndefined(textFont) && Object.keys(textFont).length > 0 && defaultFonts.indexOf(fontFamily) === -1) {
            const fontKey: string | undefined = PdfViewerUtils.getFontKey(textFont, fontFamily.toLowerCase());
            if (!isNullOrUndefined(fontKey)) {
                let fontStream: Uint8Array = textFont[`${fontKey}`];
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

    private saveTextBoxField(loadedPage: PdfPage, formFieldAttributes: IFormField): PdfTextBoxField {
        const textboxName: string = isNullOrUndefined(formFieldAttributes.name) ?
            (formFieldAttributes.type === 'Password' ? 'passwordTextbox' : 'textbox') :
            formFieldAttributes.name as string;
        const textBounds: IFormFieldBound = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: IFormFieldBound = this.getBounds(textBounds, loadedPage.size.height, loadedPage.size.width,
                                                            rotationAngle, isFieldRotated);
        const bound: IPdfRectBounds = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        //Create a new text box field
        const textbox: PdfTextBoxField = new PdfTextBoxField(loadedPage, textboxName, bound);
        const isTransparentBg: boolean = formFieldAttributes.backgroundColor.a === 0 ? true : false;
        textbox.backColor = {r: formFieldAttributes.backgroundColor.r, g: formFieldAttributes.backgroundColor.g,
            b: formFieldAttributes.backgroundColor.b};
        if (formFieldAttributes.backgroundColor.r === 0 && formFieldAttributes.backgroundColor.g === 0 &&
            formFieldAttributes.backgroundColor.b === 0 && formFieldAttributes.backgroundColor.a === 0) {
            textbox.backColor = {r: formFieldAttributes.backgroundColor.r, g: formFieldAttributes.backgroundColor.g,
                b: formFieldAttributes.backgroundColor.b, isTransparent: isTransparentBg};
        }
        textbox.maxLength = formFieldAttributes.maxLength as number;
        textbox.insertSpaces = formFieldAttributes.insertSpaces as boolean;
        textbox.readOnly = formFieldAttributes.isReadonly as boolean;
        textbox.required = formFieldAttributes.isRequired as boolean;
        textbox.textAlignment = this.getTextAlignment(formFieldAttributes.textAlign as string);
        textbox.visibility = this.getFormFieldsVisibility(formFieldAttributes.visibility as string);
        textbox.text = isNullOrUndefined(formFieldAttributes.value) ? '' : formFieldAttributes.value as string;
        textbox.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? '' : formFieldAttributes.tooltip as string;
        textbox.color = {r: formFieldAttributes.fontColor.r, g: formFieldAttributes.fontColor.g, b: formFieldAttributes.fontColor.b};
        textbox.borderColor = {r: formFieldAttributes.borderColor.r, g: formFieldAttributes.borderColor.g,
            b: formFieldAttributes.borderColor.b};
        const isTransparent: boolean = formFieldAttributes.borderColor.a === 0 ? true : false;
        // eslint-disable-next-line
        if (formFieldAttributes.borderColor.r == 0 && formFieldAttributes.borderColor.g == 0 &&
             // eslint-disable-next-line
             formFieldAttributes.borderColor.b == 0 && formFieldAttributes.borderColor.a == 0) {
            textbox.borderColor = {r: formFieldAttributes.borderColor.r, g: formFieldAttributes.borderColor.g,
                b: formFieldAttributes.borderColor.b, isTransparent: isTransparent};
        }
        textbox.border.width = formFieldAttributes.thickness as number;
        textbox.multiLine = formFieldAttributes.isMultiline as boolean;
        const pdfFontStyle: PdfFontStyle = this.getFontStyle(formFieldAttributes);
        textbox._dictionary.set('FontStyle', pdfFontStyle);
        // eslint-disable-next-line
        const hasUnicode: boolean = /[^\u0000-\u007F]/.test(textbox.text);
        const fontFamily: string = formFieldAttributes.fontFamily as string;
        textbox.font = new PdfStandardFont(this.getFontFamily(fontFamily),
                                           this.convertPixelToPoint(formFieldAttributes.fontSize as number), pdfFontStyle);
        if (!isNullOrUndefined(textbox.text.toString())) {
            const textFont: { [key: string]: Uint8Array } = this.pdfViewer.pdfRenderer.FallbackFontCollection;
            this.setFontAppearance(textbox.text.toString(), (formFieldAttributes.fontFamily as string),
                                   (formFieldAttributes.fontSize as number), textbox, textFont, hasUnicode, pdfFontStyle);
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
        // DateTime textbox: persist AF format script on PdfTextBoxField.actions.format
        this.applyDateTimeFormatActions(textbox, formFieldAttributes);
        return textbox;
    }
    /**
     * Attaches AF format + keystroke actions to a textbox field on save.
     *
     * Handles all six AF categories:
     *  - Date / Time (the legacy path): emits the format / keystroke / validate triad.
     *  - Number / Percentage / Special / Arbitrary Mask: writes the format and keystroke
     *    scripts verbatim from the field model (no validate script).
     *  - None: clears viewer-owned actions only when the dialog / API explicitly cleared
     *    them. Unsupported scripts (e.g. `app.alert`) are preserved verbatim so a third
     *    party PDF reader can still consume them.
     *
     * @param {PdfTextBoxField} textbox - PDF textbox field
     * @param {any} formFieldAttributes - viewer form field attributes
     * @returns {void}
     */
    private applyDateTimeFormatActions(textbox: PdfTextBoxField, formFieldAttributes: IFormField): void {
        const isDateField: boolean = !!(formFieldAttributes as IFormField & { isDateField?: boolean }).isDateField;
        const actions: any = (formFieldAttributes as IFormField & { actions?: any }).actions;
        let script: string = this.pdfViewerBase.getActionsFormatScript(actions);
        if (!isDateField && !script) {
            return;
        }
        // Derive date/time sub-type from the format script only;
        // the legacy `type` field has been removed.
        const isTimeField: boolean = !!(script && /AFTime_Format(?:Ex)?\s*\(/i.test(script));
        const keystrokeScript: string = this.pdfViewerBase.getActionsKeyPressedScript(actions);
        if (!isDateField && !script && !keystrokeScript) {
            script = isTimeField
                ? 'AFTime_FormatEx("HH:MM")'
                : 'AFDate_FormatEx("m/d/yy")';
        }
        try {
            // Skip when the PDF action surface is unavailable for the field instance
            // (ej2-pdf declares PdfTextBoxField.actions as readonly, so it can only be
            // populated when the loaded field already exposes it).
            if (!textbox.actions) {
                return;
            }
            // Date / Time use the legacy triad (format + keystroke + validate). Number,
            // Percentage, Special and Arbitrary Mask do not have a validate counterpart,
            // so the format and keystroke are written verbatim from the field model.
            if (isDateField) {
                let patternArg: string = 'm/d/yy';
                const patternMatch: RegExpMatchArray = script.match(/AF(?:Date|Time)_Format(?:Ex)?\s*\(\s*"([^"]*)"\s*\)/i);
                if (patternMatch && patternMatch[1]) {
                    patternArg = patternMatch[1];
                } else if (isTimeField) {
                    patternArg = 'HH:MM';
                }
                const isTime: boolean = isTimeField || /AFTime_Format(?:Ex)?\s*\(/i.test(script);
                const ks: string = isTime
                    ? 'AFTime_KeystrokeEx("' + patternArg + '")'
                    : 'AFDate_KeystrokeEx("' + patternArg + '")';
                const validateScript: string = isTime
                    ? 'AFTime_Validate("' + patternArg + '")'
                    : 'AFDate_Validate("' + patternArg + '")';
                textbox.actions.format = new PdfJavaScriptAction(script);
                textbox.actions.keyPressed = new PdfJavaScriptAction(ks);
                textbox.actions.validate = new PdfJavaScriptAction(validateScript);
                return;
            }
            // Non-date path: only write the scripts the field model actually carries.
            // An unsupported / malformed script survives verbatim so a host can still
            // persist it; we never invent a keystroke or validate here.
            if (script) {
                textbox.actions.format = new PdfJavaScriptAction(script);
            }
            if (keystrokeScript) {
                textbox.actions.keyPressed = new PdfJavaScriptAction(keystrokeScript);
            }
        } catch (e) {
            // Ignore when PDF action surface is unavailable for the field instance.
        }
    }

    /**
     * Promotes loaded textbox to date field when AFDate/AFTime format script is present.
     *
     * @param {PdfTextBoxField} textBox - loaded PDF textbox
     * @param {PdfRenderedFields} formFields - rendered field payload
     * @returns {void}
     */
    private promoteDateTimeFromFormatAction(textBox: PdfTextBoxField, formFields: PdfRenderedFields): void {
        let script: string = '';
        let keystroke: string = '';
        try {
            script = readActionScript(textBox.actions, 'format');
            keystroke = readActionScript(textBox.actions, 'keyPressed');
        } catch (e) {
            script = '';
            keystroke = '';
        }
        if (!script && !keystroke) {
            return;
        }
        const isAfDateTime: boolean = /AF(?:Date|Time)_Format(?:Ex)?\s*\(/i.test(script);
        if (isAfDateTime) {
            formFields.IsDateField = true;
            const isTimeOnly: boolean = /AFTime_Format(?:Ex)?\s*\(/i.test(script);
            formFields.DateFieldType = isTimeOnly ? 'time' : 'date';
        }
        const actions: { format?: { script: string }, keyPressed?: { script: string } } = {};
        if (script) {
            actions.format = { script: script };
        }
        if (keystroke) {
            actions.keyPressed = { script: keystroke };
        }
        formFields.Actions = actions;
    }

    private saveDropDownField(loadedPage: PdfPage, formFieldAttributes: IFormField): PdfComboBoxField {
        const dropdownListName: string = isNullOrUndefined(formFieldAttributes.name) ? 'dropdownList' : formFieldAttributes.name as string;
        const dropDownListbounds: {X: number, Y: number, Width: number, Height: number} = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: IFormFieldBound = this.getBounds(dropDownListbounds, loadedPage.size.height,
                                                            loadedPage.size.width, rotationAngle,
                                                            isFieldRotated);
        const bound: IPdfRectBounds = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        const comboBox: PdfComboBoxField = new PdfComboBoxField(loadedPage, dropdownListName, bound);
        let hasUnicode: boolean = false;
        for (let i: number = 0; i < formFieldAttributes.option.length; i++) {
            const item: PdfListFieldItem = new PdfListFieldItem(formFieldAttributes.option[parseInt(i.toString(), 10)].itemName as string,
                                                                formFieldAttributes.option[parseInt(i.toString(), 10)].itemValue as string);
            comboBox.addItem(item);
            // eslint-disable-next-line
            const flag: boolean = /[^\u0000-\u007F]/.test(formFieldAttributes.option[parseInt(i.toString(), 10)].itemName as string);
            if (flag)
            {
                hasUnicode = true;
            }
        }
        comboBox.textAlignment = this.getTextAlignment(formFieldAttributes.textAlign as string);
        const pdfFontStyle: PdfFontStyle = this.getFontStyle(formFieldAttributes);
        comboBox._dictionary.set('FontStyle', pdfFontStyle);
        const fontFamily: string = formFieldAttributes.fontFamily as string;
        comboBox.font = new PdfStandardFont(this.getFontFamily(fontFamily),
                                            this.convertPixelToPoint(formFieldAttributes.fontSize as number), pdfFontStyle);
        for (let i: number = 0; i < formFieldAttributes.option.length; i++) {
            const comboBoxText: string = (formFieldAttributes.option[parseInt(i.toString(), 10)].itemName as string).toString();
            if (!isNullOrUndefined(comboBoxText)) {
                const textFont: { [key: string]: Uint8Array } = this.pdfViewer.pdfRenderer.FallbackFontCollection;
                this.setFontAppearance(comboBoxText, formFieldAttributes.fontFamily as string, formFieldAttributes.fontSize,
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
        comboBox.required = formFieldAttributes.isRequired as boolean;
        comboBox.readOnly = formFieldAttributes.isReadonly as boolean;
        comboBox.visibility = this.getFormFieldsVisibility(formFieldAttributes.visibility as string);
        comboBox.backColor = {r: formFieldAttributes.backgroundColor.r, g: formFieldAttributes.backgroundColor.g,
            b: formFieldAttributes.backgroundColor.b};
        const isTransparentBg: boolean = formFieldAttributes.backgroundColor.a === 0 ? true : false;
        if (formFieldAttributes.backgroundColor.r === 0 && formFieldAttributes.backgroundColor.g === 0 &&
            formFieldAttributes.backgroundColor.b === 0 && formFieldAttributes.backgroundColor.a === 0) {
            comboBox.backColor = {r: formFieldAttributes.backgroundColor.r, g: formFieldAttributes.backgroundColor.g,
                b: formFieldAttributes.backgroundColor.b, isTransparent: isTransparentBg};
        }
        comboBox.borderColor = {r: formFieldAttributes.borderColor.r, g: formFieldAttributes.borderColor.g,
            b: formFieldAttributes.borderColor.b};
        const isTransparent: boolean = formFieldAttributes.borderColor.a === 0 ? true : false;
        // eslint-disable-next-line
        if (formFieldAttributes.borderColor.r == 0 && formFieldAttributes.borderColor.g == 0 &&
            // eslint-disable-next-line
            formFieldAttributes.borderColor.b == 0 && formFieldAttributes.borderColor.a == 0) {
            comboBox.borderColor = {r: formFieldAttributes.borderColor.r, g: formFieldAttributes.borderColor.g,
                b: formFieldAttributes.borderColor.b, isTransparent: isTransparent};
        }
        comboBox.border.width = formFieldAttributes.thickness as number;
        comboBox.color = {r: formFieldAttributes.fontColor.r, g: formFieldAttributes.fontColor.g, b: formFieldAttributes.fontColor.b};
        if (!isFieldRotated) {
            comboBox.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        comboBox.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? '' : formFieldAttributes.tooltip as string;
        if (!isNullOrUndefined(formFieldAttributes.customData)) {
            const customData: string = JSON.stringify(formFieldAttributes.customData);
            comboBox._dictionary.set('CustomData', customData);
        }
        return comboBox;
    }

    private SaveCheckBoxField(loadedPage: PdfPage, formFieldAttributes: IFormField): PdfCheckBoxField {
        const checkboxFieldName: string = isNullOrUndefined(formFieldAttributes.name) || formFieldAttributes.name === '' ?
            'checkboxField' : formFieldAttributes.name as string;
        const checkBounds: IFormFieldBound = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: IFormFieldBound = this.getBounds(checkBounds, loadedPage.size.height, loadedPage.size.width,
                                                            rotationAngle, isFieldRotated);
        const bound: IPdfRectBounds = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        //Create a new Check box field
        const checkBoxField: PdfCheckBoxField = new PdfCheckBoxField(checkboxFieldName, bound, loadedPage);
        checkBoxField.readOnly = formFieldAttributes.isReadonly as boolean;
        checkBoxField.required = formFieldAttributes.isRequired as boolean;
        checkBoxField.checked = formFieldAttributes.isChecked as boolean;
        checkBoxField.visibility = this.getFormFieldsVisibility(formFieldAttributes.visibility as string);
        checkBoxField.exportValue = formFieldAttributes.value as string;
        checkBoxField.backColor = {r: formFieldAttributes.backgroundColor.r, g: formFieldAttributes.backgroundColor.g,
            b: formFieldAttributes.backgroundColor.b};
        if (formFieldAttributes.backgroundColor.r === 0 && formFieldAttributes.backgroundColor.g === 0 &&
            formFieldAttributes.backgroundColor.b === 0 && formFieldAttributes.backgroundColor.a === 0) {
            checkBoxField.backColor = {r: formFieldAttributes.backgroundColor.r, g: formFieldAttributes.backgroundColor.g,
                b: formFieldAttributes.backgroundColor.b, isTransparent: true};
        }
        checkBoxField.borderColor = {r: formFieldAttributes.borderColor.r, g: formFieldAttributes.borderColor.g,
            b: formFieldAttributes.borderColor.b};
        if (formFieldAttributes.borderColor.r === 0 && formFieldAttributes.borderColor.g === 0 && formFieldAttributes.borderColor.b === 0
             && formFieldAttributes.borderColor.a === 0) {
            checkBoxField.borderColor = {r: formFieldAttributes.borderColor.r, g: formFieldAttributes.borderColor.g,
                b: formFieldAttributes.borderColor.b, isTransparent: true};
        }
        checkBoxField.border.width = formFieldAttributes.thickness as number;
        checkBoxField.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? '' : formFieldAttributes.tooltip as string;
        if (!isFieldRotated) {
            checkBoxField.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        if (!isNullOrUndefined(formFieldAttributes.customData)) {
            const customData: string = JSON.stringify(formFieldAttributes.customData);
            checkBoxField._dictionary.set('CustomData', customData);
        }
        return checkBoxField;
    }

    private saveListBoxField(loadedPage: PdfPage, formFieldAttributes: IFormField): PdfListBoxField {
        const listBoxName: string = isNullOrUndefined(formFieldAttributes.name) ? 'listBox' : formFieldAttributes.name as string;
        const listBounds: IFormFieldBound = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: IFormFieldBound = this.getBounds(listBounds, loadedPage.size.height, loadedPage.size.width,
                                                            rotationAngle, isFieldRotated);
        const bound: IPdfRectBounds = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        const listBox: PdfListBoxField = new PdfListBoxField(loadedPage, listBoxName, bound);
        let flag: boolean = false;
        let hasUnicode: boolean = false;
        for (let i: number = 0; i < formFieldAttributes.option.length; i++) {
            const item: PdfListFieldItem = new PdfListFieldItem(formFieldAttributes.option[parseInt(i.toString(), 10)].itemName as string,
                                                                formFieldAttributes.option[parseInt(i.toString(), 10)].itemValue as string);
            listBox.addItem(item);
            // eslint-disable-next-line
            const unicode: boolean = /[^\u0000-\u007F]/.test(formFieldAttributes.option[parseInt(i.toString(), 10)].itemName as string);
            if (unicode)
            {
                hasUnicode = true;
            }
            if (!isNullOrUndefined(item && item._dictionary && !flag)) {
                item.textAlignment = this.getTextAlignment(formFieldAttributes.textAlign as string);
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
        listBox.textAlignment = this.getTextAlignment(formFieldAttributes.textAlign as string);
        listBox.multiSelect = true;
        listBox.backColor = {r: formFieldAttributes.backgroundColor.r, g: formFieldAttributes.backgroundColor.g,
            b: formFieldAttributes.backgroundColor.b};
        if (formFieldAttributes.backgroundColor.r === 0 && formFieldAttributes.backgroundColor.g === 0 &&
            formFieldAttributes.backgroundColor.b === 0 && formFieldAttributes.backgroundColor.a === 0) {
            listBox.backColor = {r: formFieldAttributes.backgroundColor.r, g: formFieldAttributes.backgroundColor.g,
                b: formFieldAttributes.backgroundColor.b, isTransparent: true};
        }
        listBox.borderColor = {r: formFieldAttributes.borderColor.r, g: formFieldAttributes.borderColor.g,
            b: formFieldAttributes.borderColor.b};
        // eslint-disable-next-line
        if (formFieldAttributes.borderColor.r == 0 && formFieldAttributes.borderColor.g == 0 &&
            // eslint-disable-next-line
            formFieldAttributes.borderColor.b == 0 && formFieldAttributes.borderColor.a == 0) {
            listBox.borderColor = {r: formFieldAttributes.borderColor.r, g: formFieldAttributes.borderColor.g,
                b: formFieldAttributes.borderColor.b, isTransparent: true};
        }
        listBox.color = {r: formFieldAttributes.fontColor.r, g: formFieldAttributes.fontColor.g, b: formFieldAttributes.fontColor.b};
        listBox.border.width = formFieldAttributes.thickness as number;
        const pdfFontStyle: PdfFontStyle = this.getFontStyle(formFieldAttributes);
        listBox._dictionary.set('FontStyle', pdfFontStyle);
        const fontFamily: string = formFieldAttributes.fontFamily as string;
        listBox.font = new PdfStandardFont(this.getFontFamily(fontFamily),
                                           this.convertPixelToPoint(formFieldAttributes.fontSize as number), pdfFontStyle);
        for (let i: number = 0; i < formFieldAttributes.option.length; i++) {
            const listBoxText: string = (formFieldAttributes.option[parseInt(i.toString(), 10)].itemName as string).toString();
            if (!isNullOrUndefined(listBoxText)) {
                const textFont: { [key: string]: Uint8Array } = this.pdfViewer.pdfRenderer.FallbackFontCollection;
                this.setFontAppearance(listBoxText, formFieldAttributes.fontFamily as string, formFieldAttributes.fontSize as number,
                                       listBox, textFont, hasUnicode, pdfFontStyle);
                break;
            }
        }
        listBox.readOnly = formFieldAttributes.isReadonly as boolean;
        listBox.required = formFieldAttributes.isRequired as boolean;
        listBox.visibility = this.getFormFieldsVisibility(formFieldAttributes.visibility as string);
        listBox.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? '' : formFieldAttributes.tooltip as string;
        if (!isFieldRotated) {
            listBox.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        if (!isNullOrUndefined(formFieldAttributes.customData)) {
            const customData: string = JSON.stringify(formFieldAttributes.customData);
            listBox._dictionary.set('CustomData', customData);
        }
        return listBox;
    }

    private saveRadioButtonField(formFieldAttributes: IFormField): PdfRadioButtonListField {
        const loadedPage: PdfPage = this.formFieldLoadedDocument.getPage((formFieldAttributes.pageNumber as number) - 1) as PdfPage;
        const fieldName: string = isNullOrUndefined(formFieldAttributes.radiobuttonItem[0].name) ? 'radiobuttonField' : formFieldAttributes.radiobuttonItem[0].name;
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(loadedPage, fieldName);
        let selectedIndex: number = 0;
        let isSelectedItem: boolean = false;
        let isReadOnly: boolean = false;
        let isRequired: boolean = false;
        for (let i: number = 0; i < formFieldAttributes.radiobuttonItem.length; i++) {
            const radiobuttonItem: IRadiobuttonItem = formFieldAttributes.radiobuttonItem[parseInt(i.toString(), 10)];
            const page: PdfPage = this.formFieldLoadedDocument.getPage(radiobuttonItem.pageNumber - 1) as PdfPage;
            const radioButtonName: string = !(isNullOrUndefined(radiobuttonItem.value) || radiobuttonItem.value === '') ? radiobuttonItem.value : fieldName;
            const rotationAngle: number = this.getRotateAngle(page.rotation);
            const bounds: IFormFieldBound = this.convertFieldBounds(radiobuttonItem);
            let isFieldRotated: boolean = false;
            if (formFieldAttributes.rotation !== 0) {
                isFieldRotated = true;
            }
            const fieldBounds: IFormFieldBound = this.getBounds(bounds, page.size.height, page.size.width, rotationAngle, isFieldRotated);
            const bound: IPdfRectBounds = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
            const radioButtonItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(radioButtonName, bound, page);
            if (!isFieldRotated) {
                radioButtonItem.rotate = this.getFormfieldRotation(page.rotation);
            }
            if (radiobuttonItem.isReadonly) {
                isReadOnly = true;
            }
            if (radiobuttonItem.isRequired) {
                isRequired = true;
            }
            radioButtonItem.borderColor = {r: radiobuttonItem.borderColor.r, g: radiobuttonItem.borderColor.g,
                b: radiobuttonItem.borderColor.b};
            // eslint-disable-next-line
            if (radiobuttonItem.borderColor.r == 0 && radiobuttonItem.borderColor.g == 0 &&
                // eslint-disable-next-line
                radiobuttonItem.borderColor.b == 0 && radiobuttonItem.borderColor.a == 0) {
                radioButtonItem.borderColor = {r: radiobuttonItem.borderColor.r, g: radiobuttonItem.borderColor.g,
                    b: radiobuttonItem.borderColor.b, isTransparent: true};
            }
            radioButtonItem.border.width = radiobuttonItem.thickness;
            radioButtonItem.backColor = {r: radiobuttonItem.backgroundColor.r, g: radiobuttonItem.backgroundColor.g,
                b: radiobuttonItem.backgroundColor.b};
            if (radiobuttonItem.backgroundColor.r === 0 && radiobuttonItem.backgroundColor.g === 0 &&
                 radiobuttonItem.backgroundColor.b === 0 && radiobuttonItem.backgroundColor.a === 0) {
                radioButtonItem.backColor = {r: radiobuttonItem.backgroundColor.r, g: radiobuttonItem.backgroundColor.g,
                    b: radiobuttonItem.backgroundColor.b, isTransparent: true};
            }
            radioButtonItem.visibility = this.getFormFieldsVisibility(radiobuttonItem.visibility);
            field.add(radioButtonItem);
            const selectedRadios: IRadiobuttonItem[] = formFieldAttributes.radiobuttonItem
                .filter((item: IRadiobuttonItem) => item.isUnisonSelected === true);
            if (selectedRadios.length > 0) {
                field.allowUnisonSelection = true;
            }
            if (radiobuttonItem.isSelected) {
                selectedIndex = i;
                isSelectedItem = true;
            }
        }
        field.readOnly = isReadOnly;
        field.required = isRequired;
        field.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? '' : formFieldAttributes.tooltip as string;
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

    private saveSignatureField(loadedPage: PdfPage, formFieldAttributes: IFormField): PdfSignatureField {
        const signatureFieldName: string = isNullOrUndefined(formFieldAttributes.name) ? 'signatureField' : formFieldAttributes.name as string;
        const signatureFieldBounds: IFormFieldBound = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: IFormFieldBound = this.getBounds(signatureFieldBounds, loadedPage.size.height, loadedPage.size.width,
                                                            rotationAngle, isFieldRotated);
        const bound: IPdfRectBounds = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        const signatureField: PdfSignatureField = new PdfSignatureField(loadedPage, signatureFieldName, bound);
        //let page: PdfPage = signatureField.page;
        signatureField.toolTip = formFieldAttributes.tooltip as string;
        signatureField.required = formFieldAttributes.isRequired as boolean;
        signatureField.readOnly = formFieldAttributes.isReadonly as boolean;
        if (formFieldAttributes.formFieldAnnotationType === 'InitialField') {
            signatureField._dictionary.set('InitialField', true);
        }
        const isTransparentBG: boolean = formFieldAttributes.backgroundColor.a === 0 ? true : false;
        if (formFieldAttributes.value === '') {
            signatureField.backColor = {r: formFieldAttributes.backgroundColor.r, g: formFieldAttributes.backgroundColor.g,
                b: formFieldAttributes.backgroundColor.b};
            if (formFieldAttributes.backgroundColor.r === 0 && formFieldAttributes.backgroundColor.g === 0 &&
                formFieldAttributes.backgroundColor.b === 0 && formFieldAttributes.backgroundColor.a === 0) {
                signatureField.backColor = {r: formFieldAttributes.backgroundColor.r, g: formFieldAttributes.backgroundColor.g,
                    b: formFieldAttributes.backgroundColor.b, isTransparent: isTransparentBG};
            }
        }
        signatureField.borderColor = {r: formFieldAttributes.borderColor.r, g: formFieldAttributes.borderColor.g,
            b: formFieldAttributes.borderColor.b};
        const isTransparent: boolean = formFieldAttributes.borderColor.a === 0 ? true : false;
        if (formFieldAttributes.borderColor.r === 0 && formFieldAttributes.borderColor.g === 0 &&
            formFieldAttributes.borderColor.b === 0 && formFieldAttributes.borderColor.a === 0) {
            signatureField.borderColor = {r: formFieldAttributes.borderColor.r, g: formFieldAttributes.borderColor.g,
                b: formFieldAttributes.borderColor.b, isTransparent: isTransparent};
        }
        signatureField.border.width = formFieldAttributes.thickness as number;
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
        } else if (formFieldAttributes.signatureType === 'Path' || formFieldAttributes.signatureType === 'Draw') {
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
                                                 formFieldAttributes: IFormField): void {
        const boundsObjects: IFormFieldBound = { X: formFieldAttributes.signatureBound.x, Y: formFieldAttributes.signatureBound.y,
            Width: formFieldAttributes.signatureBound.width, Height: formFieldAttributes.signatureBound.height };
        const page: PdfPage = signatureField.page;
        const pageRotationAngle: number = page.rotation;
        const zoomvalue: number = formFieldAttributes.zoomValue as number;
        let signBounds: IFormFieldBound = { X: this.convertPixelToPoint(boundsObjects.X / zoomvalue),
            Y: this.convertPixelToPoint(boundsObjects.Y / zoomvalue), Width: this.convertPixelToPoint(boundsObjects.Width / zoomvalue),
            Height: this.convertPixelToPoint(boundsObjects.Height / zoomvalue) };
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        signBounds = this.getBounds(signBounds, page.size.height, page.size.width, pageRotationAngle, isFieldRotated);
        if (!isNullOrUndefined(formFieldAttributes)) {
            const left: number = signBounds.X;
            const top: number = signBounds.Y;
            const width: number = signBounds.Width;
            const height: number = signBounds.Height;
            const freeTextBounds: IFormFieldBound = { X: left, Y: top, Width: width, Height: height };
            const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({x: left, y: top, width: width, height: height});
            annotation.setAppearance(true);
            annotation._dictionary.set('T', currentFieldName);
            const font: number = formFieldAttributes.fontSize as number;
            let fontFamilyEnum: PdfFontFamily = PdfFontFamily.helvetica;
            if (!isNullOrUndefined(formFieldAttributes.fontFamily)) {
                fontFamilyEnum = this.getFontFamily(formFieldAttributes.fontFamily as string);
            }
            const fontStyle: PdfFontStyle = this.getFontStyle(formFieldAttributes);
            // eslint-disable-next-line
            const hasUnicode: boolean = /[^\u0000-\u007F]/.test(formFieldAttributes.value as string);
            if (hasUnicode) {
                annotation.font = this.getTrueFont(this.convertPixelToPoint(font), fontStyle);
            } else {
                annotation.font = new PdfStandardFont(fontFamilyEnum,
                                                      this.convertPixelToPoint(formFieldAttributes.fontSize as number),
                                                      fontStyle);
            }
            annotation.text = formFieldAttributes.value as string;
            this.setFontSize(this.convertPixelToPoint(font), annotation.font, formFieldAttributes.value as string, freeTextBounds,
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

    private drawDesignerFieldImage(signatureField: PdfSignatureField, currentFieldName: string, formFieldAttributes: IFormField): void {
        const boundsObjects: IFormFieldBound = { X: formFieldAttributes.signatureBound.x, Y: formFieldAttributes.signatureBound.y,
            Width: formFieldAttributes.signatureBound.width, Height: formFieldAttributes.signatureBound.height };
        const page: PdfPage = signatureField.page;
        const pageRotationAngle: number = page.rotation;
        const zoomvalue: number = formFieldAttributes.zoomValue as number;
        let signBounds: IFormFieldBound = { X: this.convertPixelToPoint(boundsObjects.X / zoomvalue),
            Y: this.convertPixelToPoint(boundsObjects.Y / zoomvalue), Width: this.convertPixelToPoint(boundsObjects.Width / zoomvalue),
            Height: this.convertPixelToPoint(boundsObjects.Height / zoomvalue) };
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        signBounds = this.getBounds(signBounds, page.size.height, page.size.width, pageRotationAngle, isFieldRotated);
        if (!isNullOrUndefined(formFieldAttributes)) {
            const left: number = signBounds.X;
            const top: number = signBounds.Y;
            const width: number = signBounds.Width;
            const height: number = signBounds.Height;
            const imageUrl: string = ((formFieldAttributes.value as string).toString()).split(',')[1];
            const rubberStampAnnotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(
                {x: left, y: top, width: width, height: height});
            const bitmap: PdfImage = new PdfBitmap(imageUrl);
            const bounds: Rectangle = {
                x: 0,
                y: 0,
                width: width,
                height: height
            };
            rubberStampAnnotation.appearance.normal.graphics.drawImage(bitmap, bounds);
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

    private drawDesignerFieldPath(signatureField: PdfSignatureField, currentFieldName: string, formFieldAttributes: IFormField): void {
        const stampObjects: PathSegment[] = JSON.parse(formFieldAttributes.value as string);
        const boundsObjects: IFormFieldBound = { X: formFieldAttributes.signatureBound.x, Y: formFieldAttributes.signatureBound.y,
            Width: formFieldAttributes.signatureBound.width, Height: formFieldAttributes.signatureBound.height };
        const page: PdfPage = signatureField.page;
        const pageRotationAngle: number = page.rotation;
        const zoomvalue: number = formFieldAttributes.zoomValue as number;
        let signBounds: IFormFieldBound = { X: this.convertPixelToPoint(boundsObjects.X / zoomvalue),
            Y: this.convertPixelToPoint(boundsObjects.Y / zoomvalue), Width: this.convertPixelToPoint(boundsObjects.Width / zoomvalue),
            Height: this.convertPixelToPoint(boundsObjects.Height / zoomvalue) };
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        signBounds = this.getBounds(signBounds, page.size.height, page.size.width, pageRotationAngle, false);
        const annotationRenderer: AnnotationRenderer = new AnnotationRenderer(this.pdfViewer, this.pdfViewerBase);
        const pageRotateAngle: number = annotationRenderer.getInkRotateAngle(page.rotation.toString());
        const fieldRotateAngle: number = isFieldRotated
            ? formFieldAttributes.rotation : 0;
        const rotationAngle: number = pageRotateAngle + fieldRotateAngle;
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
                const val: PathSegment = stampObjects[parseInt(p.toString(), 10)];
                drawingPath.addLine({x: val.x as number, y: val.y as number}, {x: 0, y: 0});
            }
            const rotatedPath: Path = annotationRenderer.getRotatedPathForMinMax(drawingPath._points, rotationAngle);
            for (let k: number = 0; k < rotatedPath.points.length; k += 2) {
                const value: [number, number] = rotatedPath.points[parseInt(k.toString(), 10)];
                if (minimumX === -1) {
                    minimumX = value[0];
                    minimumY = value[1];
                    maximumX = value[0];
                    maximumY = value[1];
                } else {
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
            let linePoints: Point[] = [];
            let isNewValues: number = 0;
            const pageHeight: number = this.formFieldLoadedDocument.getPage(pageNumber).size.height;
            if (rotationAngle !== 0) {
                for (let j: number = 0; j < stampObjects.length; j++) {
                    const value: PathSegment = stampObjects[parseInt(j.toString(), 10)];
                    const path: string = (value.command as string).toString();
                    if (path === 'M' && j !== 0) {
                        isNewValues = j;
                        break;
                    }
                    linePoints.push({x: parseFloat((value.x as number).toString()), y: parseFloat((value.y as number).toString())});
                }
                const rotatedPoints: PdfPath = annotationRenderer.getRotatedPath(linePoints, rotationAngle);
                linePoints = [];
                for (let z: number = 0; z < rotatedPoints._points.length; z += 2) {
                    const rotatedPoint: Point = rotatedPoints._points[parseInt(z.toString(), 10)];
                    linePoints.push({
                        x: (rotatedPoint.x - minimumX) / newDifferenceX + left,
                        y: pageHeight - (rotatedPoint.y - minimumY) / newDifferenceY - top
                    });
                }
            } else {
                for (let k: number = 0; k < stampObjects.length; k++) {
                    const value: PathSegment = stampObjects[parseInt(k.toString(), 10)];
                    const path: string = (value.command as string).toString();
                    if (path === 'M' && k !== 0) {
                        isNewValues = k;
                        break;
                    }
                    const newX: number = ((parseFloat((value.y as number).toString()) - minimumY) / newDifferenceY);
                    linePoints.push({
                        x: ((parseFloat((value.x as number).toString()) - minimumX) / newDifferenceX) + left,
                        y: pageHeight - newX - top
                    });
                }
            }
            const inkAnnotation: PdfInkAnnotation = new PdfInkAnnotation({x: left, y: top, width: width, height: height}, linePoints);
            inkAnnotation.flags = PdfAnnotationFlag.print;
            if (formFieldAttributes.visibility === 'hidden') {
                inkAnnotation.flags = PdfAnnotationFlag.hidden;
            }
            inkAnnotation.bounds = { x: signBounds.X, y: signBounds.Y, width: signBounds.Width, height: signBounds.Height };
            inkAnnotation.border.width = 0;
            inkAnnotation.color = {r: 0, g: 0, b: 0};
            inkAnnotation.setValues('annotationSignature', 'annotationSignature');
            linePoints = [];
            if (isNewValues > 0) {
                if (rotationAngle !== 0) {
                    const pathCollection: Point[][] = [];
                    for (let t: number = isNewValues; t < stampObjects.length; t++) {
                        const value: PathSegment = stampObjects[parseInt(t.toString(), 10)];
                        const path: string = (value.command as string).toString();
                        if (path === 'M' && t !== isNewValues) {
                            pathCollection.push(linePoints);
                            linePoints = [];
                        }
                        linePoints.push({
                            x: parseFloat((value.x as number).toString()),
                            y: parseFloat((value.y as number).toString())
                        });
                    }
                    if (linePoints.length > 0) {
                        pathCollection.push(linePoints);
                    }
                    // Process each additional stroke: rotate then normalize
                    for (let w: number = 0; w < pathCollection.length; w++) {
                        const pointsCollections: Point[] = pathCollection[parseInt(w.toString(), 10)];
                        linePoints = [];
                        if (pointsCollections.length > 0) {
                            const rotatedPoints: PdfPath = annotationRenderer.getRotatedPath(pointsCollections, rotationAngle);
                            for (let z: number = 0; z < rotatedPoints._points.length; z += 2) {
                                const rotatedPoint: Point = rotatedPoints._points[parseInt(z.toString(), 10)];
                                linePoints.push({
                                    x: (rotatedPoint.x - minimumX) / newDifferenceX + left,
                                    y: pageHeight - (rotatedPoint.y - minimumY) / newDifferenceY - top
                                });
                            }
                            inkAnnotation.inkPointsCollection.push(linePoints);
                        }
                    }
                } else {
                    // Non-rotated case: collect and normalize directly
                    for (let r: number = 0; r < stampObjects.length; r++) {
                        const value: PathSegment = stampObjects[parseInt(r.toString(), 10)];
                        const path: string = (value.command as string).toString();
                        if (path === 'M' && r !== 0) {
                            inkAnnotation.inkPointsCollection.push(linePoints);
                            linePoints = [];
                        }
                        const newX: number = ((parseFloat((value.y as number).toString()) - minimumY) / newDifferenceY);
                        linePoints.push({
                            x: ((parseFloat((value.x as number).toString()) - minimumX) / newDifferenceX) + left,
                            y: pageHeight - newX - top
                        });
                    }
                    if (linePoints.length > 0) {
                        inkAnnotation.inkPointsCollection.push(linePoints);
                    }
                }
            }
            inkAnnotation._dictionary.set('T', currentFieldName);
            inkAnnotation.setAppearance(true);
            inkAnnotation.rotationAngle = Math.abs(this.getRotateAngle(page.rotation));
            this.formFieldLoadedDocument.getPage(pageNumber).annotations.add(inkAnnotation);
        }
    }

    private setFontSize(fontSize: number, font: PdfFont, text: string, freeTextBounds: IFormFieldBound, fontFamilyEnum: PdfFontFamily,
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
            const sizeF: Size = font.measureString(text);
            if (sizeF.width < freeTextBounds.Width && sizeF.height < freeTextBounds.Height) {
                font._size = fontSize;
                break;
            }
        } while (fontSize > minimumFontSize);

    }

    private getTrueFont( fontSize: number, fontStyle: PdfFontStyle): PdfFont{
        const font: PdfFont = new PdfTrueTypeFont(this.pdfViewer.getArialFontValue(), this.convertPixelToPoint(fontSize), fontStyle);
        return font;
    }

    private convertFieldBounds(formFieldAttributes: IFormField | IRadiobuttonItem): IFormFieldBound {
        const zoomValue: number = formFieldAttributes.zoomValue as number;
        const lineBound: IFormFieldBound = formFieldAttributes.lineBound as IFormFieldBound;
        return { X: this.convertPixelToPoint(lineBound.X / zoomValue),
            Y: this.convertPixelToPoint(lineBound.Y / zoomValue),
            Width: this.convertPixelToPoint(lineBound.Width / zoomValue),
            Height: this.convertPixelToPoint(lineBound.Height / zoomValue) };
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
    private getBounds(bounds: IFormFieldBound, pageHeight: number, pageWidth: number,
                      pageRotation: number, isFieldRotated: boolean): IFormFieldBound {
        let bound: IFormFieldBound = { X: 0, Y: 0, Width: 0, Height: 0 };
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

    private getFontStyle(formFieldAttributes?: IFormField): FontStyle {
        let fontStyle: PdfFontStyle;
        fontStyle = PdfFontStyle.regular;
        if (!isNullOrUndefined(formFieldAttributes)) {
            const fontModel: PdfFontModel = formFieldAttributes.font as PdfFontModel;
            if (!isNullOrUndefined(fontModel)) {
                if (fontModel.isBold) {
                    fontStyle |= PdfFontStyle.bold;
                }
                if (fontModel.isItalic) {
                    fontStyle |= PdfFontStyle.italic;
                }
                if (fontModel.isUnderline) {
                    fontStyle |= PdfFontStyle.underline;
                }
                if (fontModel.isStrikeout) {
                    fontStyle |= PdfFontStyle.strikeout;
                }
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

    private fontConvert(font: PdfFont, field: PdfTextBoxField | PdfComboBoxField | PdfListBoxField | PdfButtonField): FormFieldFont {
        const fontKey: string = field.itemAt(0) && field.itemAt(0)._obtainFontDetails() && field.itemAt(0)._obtainFontDetails().name;
        const fontFamily: string = this.getFontFamilyString((font as PdfStandardFont).fontFamily,
                                                            this.formFieldLoadedDocument.form, fontKey).toString();
        return {
            Bold: font.isBold,
            FontFamily: fontFamily,
            Height: font.height,
            Italic: font.isItalic,
            Name: fontFamily,
            Size: font.size,
            Strikeout: font.isStrikeout,
            Underline: font.isUnderline,
            Style: font.style
        };
    }

    private parseFontStyle(numberValue: number, fontObject: FormFieldFont): FormFieldFont {
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
                        if (comboBoxField._kidsCount > 1) {
                            this.addComboBoxFieldItems(comboBoxField);
                        } else {
                            this.addComboBoxField(comboBoxField, pageNumber);
                        }
                    }
                    else if (field instanceof PdfCheckBoxField) {
                        const checkbox: PdfCheckBoxField = field as PdfCheckBoxField;
                        if (checkbox.itemsCount > 1) {
                            this.addCheckBoxFieldItems(checkbox);
                        } else {
                            this.addCheckBoxField(checkbox, pageNumber, checkbox, null);
                        }
                    } else if (field instanceof PdfListBoxField) {
                        const listBoxField: PdfListBoxField = field as PdfListBoxField;
                        if (listBoxField._kidsCount > 1) {
                            this.addListBoxFieldItems(listBoxField);
                        } else {
                            this.addListBoxField(listBoxField, pageNumber);
                        }
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
                                this.addSignatureField(signatureField, pageNumber, signatureField);
                            }
                        }
                    } else if (field instanceof PdfBarcodeField) {
                        const barcodeField: PdfBarcodeField = field as PdfBarcodeField;
                        if (barcodeField.itemsCount > 0) {
                            this.addBarcodeFieldItems(barcodeField);
                        } else {
                            this.addBarcodeField(barcodeField, pageNumber);
                        }
                    } else if (field instanceof PdfButtonField) {
                        const buttonField: PdfButtonField = field;
                        if (buttonField.itemsCount > 0) {
                            this.addButtonFieldItems(buttonField);
                        }
                        else {
                            this.addButtonField(buttonField, pageNumber, null);
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

    private addTextBoxField(textBox: PdfTextBoxField, pageNumber: number, bounds: Rectangle, font?: PdfFont): void {
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
            formFields.BackColor = { R: textBox.backColor.r, G: textBox.backColor.g, B: textBox.backColor.b };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.Alignment = textBox.textAlignment;
        formFields.MaxLength = textBox.maxLength;
        formFields.Visible = textBox.visibility;
        formFields.InsertSpaces = textBox.insertSpaces;
        if (!isNullOrUndefined(font)){
            formFields.Font = this.fontConvert(font as PdfFont, textBox);
        }else{
            formFields.Font = this.fontConvert(textBox.font, textBox);
        }
        if (textBox._dictionary.has('FontStyle')){
            const fontStyle: number = textBox._dictionary.get('FontStyle');
            formFields.Font = this.parseFontStyle(fontStyle, formFields.Font);
        }
        if (textBox._dictionary.has('Id')) {
            formFields.Id = textBox._dictionary.get('Id');
        }
        formFields.Rotation = textBox.rotationAngle;
        formFields.IsReadonly = textBox.readOnly;
        formFields.IsRequired = textBox.required;
        if (!isNullOrUndefined(textBox.color)) {
            formFields.FontColor = { R: textBox.color.r, G: textBox.color.g, B: textBox.color.b };
        }
        if (!isNullOrUndefined(textBox.borderColor)) {
            formFields.BorderColor = { R: textBox.borderColor.r, G: textBox.borderColor.g, B: textBox.borderColor.b };
        }
        else {
            formFields.IsTransparent = true;
        }
        // Promote AFDate/AFTime format scripts to date-capable textbox payload.
        this.promoteDateTimeFromFormatAction(textBox, formFields);
        formFields.Text = textBox.text ? textBox.text : '';
        formFields.Multiline = textBox.multiLine;
        formFields.RotationAngle = this.GetRotateAngle(textBox.page.rotation);
        if (textBox._dictionary.has('CustomData')) {
            formFields.CustomData = JSON.parse(textBox._dictionary.get('CustomData'));
        }
        formFields.TextList = [];
        this.PdfRenderedFormFields.push(formFields);
    }

    private addComboBoxFieldItems(field: PdfComboBoxField): void {
        if (field instanceof PdfComboBoxField) {
            const comboBoxField: PdfComboBoxField = field;
            if (comboBoxField._kidsCount > 1) {
                for (let i: number = 0; i < comboBoxField._kidsCount; i++) {
                    const item: PdfPage = comboBoxField.itemAt(i).page;
                    if (!isNullOrUndefined(item)) {
                        let j: number = 0;
                        for (let k: number = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
                            if (item === this.formFieldLoadedDocument.getPage(j)) {
                                break;
                            }
                            j++;
                        }
                        this.addComboBoxField(comboBoxField, j, comboBoxField.itemAt(i).bounds);
                    }
                }
            }
        }
    }

    private addComboBoxField(comboBoxField: PdfComboBoxField, pageNumber: number, bounds?: Rectangle): void {
        const formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.Name = 'DropDown';
        formFields.ToolTip = comboBoxField.toolTip;
        formFields.FieldName = comboBoxField.name;
        formFields.Font = this.fontConvert(comboBoxField.font, comboBoxField);
        formFields.IsAutoSize = comboBoxField._isAutoFontSize;
        formFields.Selected = comboBoxField.editable;
        if (comboBoxField._dictionary.has('FontStyle')) {
            const fontStyle: number = comboBoxField._dictionary.get('FontStyle');
            formFields.Font = this.parseFontStyle(fontStyle, formFields.Font );
        }
        if (comboBoxField._dictionary.has('Id')) {
            formFields.Id = comboBoxField._dictionary.get('Id');
        }
        formFields.ActualFieldName = comboBoxField.name;
        formFields.SelectedValue = comboBoxField.selectedValue as string;
        if (Array.isArray(comboBoxField.selectedValue) && comboBoxField.selectedValue.length === 0) {
            formFields.SelectedValue = '';
        }
        if (comboBoxField._options.length > 0 && (typeof comboBoxField._options[0] !== 'string')){
            const selectedValue: string[][] = comboBoxField._options.filter((option: string[]) => option[0] === formFields.SelectedValue);
            if (selectedValue && selectedValue[0]) {
                formFields.SelectedValue = selectedValue[0][1];
            }
        }
        formFields.selectedIndex = comboBoxField.selectedIndex as number;
        if (!isNullOrUndefined(bounds)) {
            formFields.LineBounds = { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height };
        } else {
            formFields.LineBounds = { X: comboBoxField.bounds.x, Y: comboBoxField.bounds.y, Width: comboBoxField.bounds.width,
                Height: comboBoxField.bounds.height };
        }
        formFields.TabIndex = comboBoxField.tabIndex;
        formFields.PageIndex = pageNumber;
        if (!isNullOrUndefined(comboBoxField.backColor)) {
            formFields.BackColor = { R: comboBoxField.backColor.r, G: comboBoxField.backColor.g, B: comboBoxField.backColor.b };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.BorderWidth = comboBoxField.border.width;
        formFields.BorderStyle = comboBoxField.border.style;
        if (!isNullOrUndefined(comboBoxField.borderColor)) {
            formFields.BorderColor = { R: comboBoxField.borderColor.r, G: comboBoxField.borderColor.g, B: comboBoxField.borderColor.b };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.FontColor = { R: comboBoxField.color.r, G: comboBoxField.color.g, B: comboBoxField.color.b };
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
                        {itemName: !isNullOrUndefined(item[1]) ? item[1] : '', itemValue: !isNullOrUndefined(item[0]) ? item[0] : '' }
                        : {itemName: '', itemValue: ''})); });
            }
        }
        for (let i: number = 0; i < comboBoxField._options.length; i++) {
            const item: string[] = comboBoxField._options[parseInt(i.toString(), 10)];
            if (item) {
                if (!formFields.TextList) {
                    formFields.TextList = [];
                }
                formFields.TextList.push({ itemName: !isNullOrUndefined(item[1]) ? item[1] : '',
                    itemValue: !isNullOrUndefined(item[0]) ? item[0] : '' });
                if (i === 0) {
                    formFields.Alignment = comboBoxField.textAlignment;
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
                        this.addCheckBoxField(checkBoxField, j, checkBoxField.itemAt(i), i.toString());
                    }
                }
            }
        }
    }

    private addCheckBoxField(chkField: PdfCheckBoxField, index: number,
                             chkitem: PdfStateItem | PdfCheckBoxField, checkBoxIndex: string): void {
        const formFields: PdfRenderedFields = new PdfRenderedFields();
        const bounds: Rectangle = chkitem.bounds;
        formFields.Name = 'CheckBox';
        formFields.ToolTip = chkField.toolTip;
        if (!isNullOrUndefined(chkitem)) {
            formFields.LineBounds = { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height };
        }
        else {
            formFields.LineBounds = { X: chkField.bounds.x, Y: chkField.bounds.y, Width: chkField.bounds.width,
                Height: chkField.bounds.height };
        }
        formFields.Selected = chkitem.checked;
        formFields.TabIndex = chkField.tabIndex;
        formFields.GroupName = chkField.name;
        formFields.ActualFieldName = chkField.name;
        formFields.PageIndex = index;
        formFields.BorderWidth = chkitem.border.width;
        if (!isNullOrUndefined(chkitem.backColor)) {
            formFields.BackColor = { R: chkitem.backColor.r, G: chkitem.backColor.g, B: chkitem.backColor.b };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.BorderStyle = chkitem.border.style;
        if (!isNullOrUndefined(chkitem.borderColor)) {
            formFields.BorderColor = { R: chkitem.borderColor.r, G: chkitem.borderColor.g, B: chkitem.borderColor.b };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.RotationAngle = this.GetRotateAngle(chkField.page.rotation);
        formFields.Rotation = chkField.rotationAngle;
        formFields.IsReadonly = chkField.readOnly;
        formFields.IsRequired = chkField.required;
        formFields.Visible = chkitem.visibility;
        formFields.Value = chkitem.exportValue;
        if (!isNullOrUndefined(checkBoxIndex)) {
            formFields.CheckBoxIndex = checkBoxIndex;
            const chekckboxField: PdfStateItem = chkField.itemAt(parseInt(checkBoxIndex, 10));
            if (!isNullOrUndefined(chekckboxField)) {
                formFields.Selected = chekckboxField.checked;
            }
        }
        formFields.RotationAngle = this.GetRotateAngle(chkField.page.rotation);
        if (chkField._dictionary.has('CustomData')) {
            formFields.CustomData = JSON.parse(chkField._dictionary.get('CustomData'));
        }
        if (chkField._dictionary.has('Id')) {
            formFields.Id = chkField._dictionary.get('Id');
        }
        this.PdfRenderedFormFields.push(formFields);
    }

    private addListBoxFieldItems(field: PdfListBoxField): void {
        if (field instanceof PdfListBoxField) {
            const listBoxField: PdfListBoxField = field;
            if (listBoxField._kidsCount > 1) {
                for (let i: number = 0; i < listBoxField._kidsCount; i++) {
                    const item: PdfPage = listBoxField.itemAt(i).page;
                    if (!isNullOrUndefined(item)) {
                        let j: number = 0;
                        for (let k: number = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
                            if (item === this.formFieldLoadedDocument.getPage(j)) {
                                break;
                            }
                            j++;
                        }
                        this.addListBoxField(listBoxField, j, listBoxField.itemAt(i).bounds);
                    }
                }
            }
        }
    }

    private addListBoxField(listBoxField: PdfListBoxField, pageNumber: number, bounds?: Rectangle): void {
        const formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.Name = 'ListBox';
        formFields.ToolTip = listBoxField.toolTip;
        formFields.Text = listBoxField.name;
        formFields.ActualFieldName = listBoxField.name;
        formFields.SelectedValue = listBoxField.selectedValue as string ? listBoxField.selectedValue as string : '';
        if (Array.isArray(listBoxField.selectedValue) && listBoxField.selectedValue.length === 0) {
            formFields.SelectedValue = '';
        }
        if (listBoxField._options.length > 0 && (typeof listBoxField._options[0] !== 'string')){
            const selectedValue: string[][] = listBoxField._options.filter((option: string[]) => option[0] === formFields.SelectedValue);
            if (selectedValue && selectedValue[0]) {
                formFields.SelectedValue = selectedValue[0][1];
            }
        }
        formFields.selectedIndex = listBoxField.selectedIndex as number;
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
        formFields.Font = this.fontConvert(listBoxField.font, listBoxField);
        if (listBoxField._dictionary.has('FontStyle')) {
            const fontStyle: number = listBoxField._dictionary.get('FontStyle');
            formFields.Font = this.parseFontStyle(fontStyle, formFields.Font);
        }
        if (!isNullOrUndefined(bounds)) {
            formFields.LineBounds = { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height };
        } else {
            formFields.LineBounds = { X: listBoxField.bounds.x, Y: listBoxField.bounds.y, Width: listBoxField.bounds.width,
                Height: listBoxField.bounds.height };
        }
        formFields.TabIndex = listBoxField.tabIndex;
        formFields.PageIndex = pageNumber;
        formFields.BorderWidth = listBoxField.border.width;
        formFields.BorderStyle = listBoxField.border.style;
        if (!isNullOrUndefined(listBoxField.backColor)) {
            formFields.BackColor = { R: listBoxField.backColor.r, G: listBoxField.backColor.g, B: listBoxField.backColor.b };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.FontColor = { R: listBoxField.color.r, G: listBoxField.color.g, B: listBoxField.color.b };
        if (!isNullOrUndefined(listBoxField.borderColor)) {
            formFields.BorderColor = { R: listBoxField.borderColor.r, G: listBoxField.borderColor.g, B: listBoxField.borderColor.b };
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
        for (let i: number = 0; i < listBoxField._options.length; i++) {
            const item: string | string[] = listBoxField._options[parseInt(i.toString(), 10)];
            if (item) {
                if (!formFields.TextList) {
                    formFields.TextList = [];
                }
                if (Array.isArray(item)) {
                    formFields.TextList.push({ itemName: item[1], itemValue: item[0] });
                } else if (typeof item === 'string') {
                    formFields.TextList.push({ itemName: item, itemValue: item });
                }
                if (i === 0) {
                    formFields.Alignment = listBoxField.textAlignment;
                }
            }
        }
        formFields.RotationAngle = this.GetRotateAngle(listBoxField.page.rotation);
        if (listBoxField._dictionary.has('CustomData')) {
            formFields.CustomData = JSON.parse(listBoxField._dictionary.get('CustomData'));
        }
        if (listBoxField._dictionary.has('Id')) {
            formFields.Id = listBoxField._dictionary.get('Id');
        }
        this.PdfRenderedFormFields.push(formFields);
    }

    private addRadioButtonField(item: PdfRadioButtonListItem, index: number, radioButtonName: string): void {
        const parent: PdfRadioButtonListField = item._field as PdfRadioButtonListField;
        const formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.Name = 'RadioButton';
        formFields.IsUnisonSelected = parent.allowUnisonSelection;
        formFields.ToolTip = parent.toolTip;
        if (!isNullOrUndefined(parent.actualName)) {
            formFields.GroupName = parent.actualName;
            formFields.ActualFieldName = radioButtonName;
        }
        formFields.TabIndex = parent.tabIndex;
        formFields.Selected = item.checked ? item.checked : item.selected;
        formFields.LineBounds = { X: item.bounds.x, Y: item.bounds.y, Width: item.bounds.width, Height: item.bounds.height };
        formFields.Value = item.value;
        formFields.PageIndex = index;
        if (!isNullOrUndefined(item.backColor)) {
            formFields.BackColor = { R: item.backColor.r, G: item.backColor.g, B: item.backColor.b };
        }
        else {
            formFields.IsTransparent = true;
        }
        formFields.BorderWidth = item.border.width;
        formFields.BorderStyle = item.border.style;
        formFields.BorderColor =  { R: parent.borderColor.r, G: parent.borderColor.g, B: parent.borderColor.b };
        formFields.Rotation = parent.rotationAngle;
        formFields.IsRequired = parent.required;
        formFields.IsReadonly = parent.readOnly;
        formFields.Visible = parent.visibility;
        formFields.RotationAngle = this.GetRotateAngle(item.page.rotation);
        if (parent._dictionary.has('CustomData')) {
            formFields.CustomData = JSON.parse(parent._dictionary.get('CustomData'));
        }
        if (parent._dictionary.has('Id')) {
            formFields.Id = parent._dictionary.get('Id');
        }
        this.PdfRenderedFormFields.push(formFields);
    }

    /**
     * Maps the engine symbology back onto the viewer symbology string.
     *
     * @param {PdfBarcodeSymbology} symbology - The engine symbology.
     * @returns {BarcodeSymbology} The viewer symbology.
     */
    private getBarcodeSymbologyName(symbology: PdfBarcodeSymbology): BarcodeSymbology {
        switch (symbology) {
        case PdfBarcodeSymbology.QR:
            return BarcodeSymbology.QRCode;
        case PdfBarcodeSymbology.DataMatrix:
            return BarcodeSymbology.DataMatrix;
        default:
            return BarcodeSymbology.PDF417;
        }
    }

    /**
     * Maps the engine value format back onto the viewer value format string.
     *
     * @param {PdfBarcodeValueFormat} valueFormat - The engine value format.
     * @returns {BarcodeValueFormat} The viewer value format (`TabDelimited` | `Xml` | `CustomValue`).
     */
    private getBarcodeValueFormatName(valueFormat: PdfBarcodeValueFormat): BarcodeValueFormat {
        switch (valueFormat) {
        case PdfBarcodeValueFormat.XML:
            return BarcodeValueFormat.Xml;
        case PdfBarcodeValueFormat.CustomScript:
            return BarcodeValueFormat.CustomValue;
        default:
            return BarcodeValueFormat.TabDelimited;
        }
    }

    /**
     * Maps the engine error correction level back onto the viewer level string.
     *
     * @param {PdfBarcodeSymbology} symbology - The engine symbology.
     * @param {number} level - The engine error correction level.
     * @returns {QRErrorCorrectionLevel | Pdf417ErrorCorrection} The viewer error correction level.
     */
    private getBarcodeErrorCorrectionName(symbology: PdfBarcodeSymbology, level: number): QRErrorCorrectionLevel | Pdf417ErrorCorrection {
        if (symbology === PdfBarcodeSymbology.QR) {
            switch (level) {
            case PdfQRErrorCorrectionLevel.Low:
                return QRErrorCorrectionLevel.Low;
            case PdfQRErrorCorrectionLevel.Quartile:
                return QRErrorCorrectionLevel.Quartile;
            case PdfQRErrorCorrectionLevel.High:
                return QRErrorCorrectionLevel.High;
            default:
                return QRErrorCorrectionLevel.Medium;
            }
        }
        switch (level) {
        case Pdf417ErrorCorrectionLevel.Level0:
            return Pdf417ErrorCorrection.Level0;
        case Pdf417ErrorCorrectionLevel.Level1:
            return Pdf417ErrorCorrection.Level1;
        case Pdf417ErrorCorrectionLevel.Level2:
            return Pdf417ErrorCorrection.Level2;
        case Pdf417ErrorCorrectionLevel.Level3:
            return Pdf417ErrorCorrection.Level3;
        case Pdf417ErrorCorrectionLevel.Level4:
            return Pdf417ErrorCorrection.Level4;
        case Pdf417ErrorCorrectionLevel.Level5:
            return Pdf417ErrorCorrection.Level5;
        case Pdf417ErrorCorrectionLevel.Level6:
            return Pdf417ErrorCorrection.Level6;
        case Pdf417ErrorCorrectionLevel.Level7:
            return Pdf417ErrorCorrection.Level7;
        case Pdf417ErrorCorrectionLevel.Level8:
            return Pdf417ErrorCorrection.Level8;
        default:
            return Pdf417ErrorCorrection.Level5;
        }
    }

    private addBarcodeFieldItems(field: PdfField): void {
        if (field instanceof PdfBarcodeField) {
            const barcode: PdfBarcodeField = field as PdfBarcodeField;
            if (barcode.itemsCount > 0) {
                for (let i: number = 0; i < barcode.itemsCount; i++) {
                    const item: PdfPage = barcode.itemAt(i).page;
                    if (!isNullOrUndefined(item)) {
                        let j: number = 0;
                        for (let k: number = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
                            if (item === this.formFieldLoadedDocument.getPage(j)) {
                                break;
                            }
                            j++;
                        }
                        this.addBarcodeField(barcode, j);
                    }
                }
            }
        }
    }

    private addBarcodeField(barcodeField: PdfBarcodeField, index: number): void {
        const formFields: PdfRenderedFields = new PdfRenderedFields();
        const bounds: Rectangle = barcodeField.bounds;
        formFields.Name = 'Barcode';
        formFields.ToolTip = barcodeField.toolTip;
        formFields.FieldName = barcodeField.name;
        formFields.LineBounds = { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height };
        formFields.TabIndex = barcodeField.tabIndex;
        formFields.GroupName = barcodeField.name.replace(/[^0-9a-zA-Z]+/g, '');
        formFields.ActualFieldName = barcodeField.name;
        formFields.PageIndex = index;
        formFields.RotationAngle = this.GetRotateAngle(barcodeField.page.rotation);
        formFields.Rotation = barcodeField.rotationAngle;
        formFields.IsReadonly = barcodeField.readOnly;
        formFields.IsRequired = barcodeField.required;
        formFields.Visible = barcodeField.visibility;
        formFields.Value = barcodeField.text;
        formFields.Text = barcodeField.text;
        if (!isNullOrUndefined(barcodeField.backColor)) {
            formFields.BackColor = { R: barcodeField.backColor.r, G: barcodeField.backColor.g,
                B: barcodeField.backColor.b };
        } else {
            formFields.IsTransparent = true;
        }
        formFields.BorderWidth = barcodeField.border.width;
        if (!isNullOrUndefined(barcodeField.borderColor)) {
            formFields.BorderColor = { R: barcodeField.borderColor.r, G: barcodeField.borderColor.g,
                B: barcodeField.borderColor.b };
            if ((barcodeField.borderColor as any).isTransparent === true) {
                formFields.IsTansparentBorderColor = true;
            }
        } else {
            formFields.IsTransparent = true;
        }
        const barcodeOptions: PdfBarcodeOptions = barcodeField.barcodeOptions;
        const symbology: PdfBarcodeSymbology = isNullOrUndefined(barcodeOptions) || isNullOrUndefined(barcodeOptions.symbology)
            ? PdfBarcodeSymbology.PDF417 : barcodeOptions.symbology;
        formFields.Symbology = this.getBarcodeSymbologyName(symbology);
        formFields.XDimension = isNullOrUndefined(barcodeOptions) || isNullOrUndefined(barcodeOptions.xDimention)
            ? 4 : barcodeOptions.xDimention;
        formFields.ErrorCorrectionLevel = isNullOrUndefined(barcodeOptions) || isNullOrUndefined(barcodeOptions.errorCorrectionLevel)
            ? this.getBarcodeErrorCorrectionName(symbology, symbology === PdfBarcodeSymbology.QR
                ? PdfQRErrorCorrectionLevel.Medium : Pdf417ErrorCorrectionLevel.Level5)
            : this.getBarcodeErrorCorrectionName(symbology, barcodeOptions.errorCorrectionLevel as number);
        formFields.ValueFormat = this.getBarcodeValueFormatName(barcodeField.valueFormat);
        formFields.IncludeFieldNames = barcodeField.includeFieldNames;
        formFields.Fields = barcodeField.fields;
        formFields.Caption = barcodeField.caption;
        formFields.CompressData = barcodeField.compressData;
        const script: string = barcodeField.customCalculationScript || '';
        formFields.CustomCalculationScript = script;
        if (formFields.ValueFormat === 'CustomValue') {
            formFields.CustomValue = barcodeField.text;
        }
        if (barcodeField._dictionary.has('CustomData')) {
            formFields.CustomData = JSON.parse(barcodeField._dictionary.get('CustomData'));
        }
        this.PdfRenderedFormFields.push(formFields);
    }

    private addButtonFieldItems(field: PdfField): void {
        if (field instanceof PdfButtonField) {
            const btn: PdfButtonField = field as PdfButtonField;
            if (btn.itemsCount > 0) {
                for (let i: number = 0; i < btn.itemsCount; i++) {
                    const item: PdfPage = btn.itemAt(i).page;
                    if (!isNullOrUndefined(item)) {
                        let j: number = 0;
                        for (let k: number = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
                            if (item === this.formFieldLoadedDocument.getPage(j)) {
                                break;
                            }
                            j++;
                        }
                        // I6/I7: pass the widget index so addButtonField can build a stable
                        // per-widget FieldUniqueKey when multiple widgets share a FieldName.
                        this.addButtonField(btn, j, btn.itemAt(i).font, i);
                    }
                }
            }
        }
    }

    private addButtonField(btnField: PdfButtonField, index: number, font?: PdfFont, widgetIndex?: number): void {
        const formFields: PdfRenderedFields = new PdfRenderedFields();
        const bounds: Rectangle = btnField.bounds;
        formFields.Name = 'Button';
        formFields.ToolTip = btnField.toolTip;
        formFields.FieldName = btnField.name;
        // I6/I7: when multiple widgets share a FieldName (same page or different pages),
        // distinguish them with a per-widget index + stable unique key.
        const safeIndex: number = (typeof widgetIndex === 'number' && widgetIndex >= 0) ? widgetIndex : 0;
        formFields.WidgetIndex = safeIndex;
        formFields.FieldUniqueKey = (btnField.name || 'button') + '#' + safeIndex;
        formFields.LineBounds = { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height };
        formFields.TabIndex = btnField.tabIndex;
        formFields.GroupName = btnField.name.replace(/[^0-9a-zA-Z]+/g, '');
        formFields.ActualFieldName = btnField.name;
        formFields.PageIndex = index;
        formFields.BorderWidth = btnField.border.width;
        if (!isNullOrUndefined(font)) {
            formFields.Font = this.fontConvert(btnField.font, btnField);
        }
        else {
            formFields.Font = this.fontConvert(btnField.font, btnField);
        }
        // Appearance round-trip: FontStyle dict carries bold/italic/underline/strikeout (same as text/combo/list).
        if (btnField._dictionary && btnField._dictionary.has('FontStyle')) {
            const fontStyle: number = btnField._dictionary.get('FontStyle');
            formFields.Font = this.parseFontStyle(fontStyle, formFields.Font);
        }
        // I4: only mark transparent when fill is explicitly transparent; missing border color alone must not wipe fill.
        if (!isNullOrUndefined(btnField.backColor)) {
            formFields.BackColor = { R: btnField.backColor.r, G: btnField.backColor.g, B: btnField.backColor.b };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const backAny: any = btnField.backColor as any;
            if (backAny && (backAny.isTransparent === true || backAny.a === 0)) {
                formFields.IsTransparent = true;
            }
        }
        formFields.BorderStyle = btnField.border.style;
        if (!isNullOrUndefined(btnField.borderColor)) {
            formFields.BorderColor = { R: btnField.borderColor.r, G: btnField.borderColor.g, B: btnField.borderColor.b };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const borderAny: any = btnField.borderColor as any;
            if (borderAny && (borderAny.isTransparent === true || borderAny.a === 0)) {
                formFields.IsTansparentBorderColor = true;
            }
        }
        // I4: font color + alignment must load for appearance round-trip (render/designer).
        if (!isNullOrUndefined(btnField.color)) {
            formFields.FontColor = { R: btnField.color.r, G: btnField.color.g, B: btnField.color.b };
        }
        if (!isNullOrUndefined(btnField.textAlignment)) {
            formFields.Alignment = btnField.textAlignment as number;
        }
        formFields.RotationAngle = this.GetRotateAngle(btnField.page.rotation);
        formFields.Rotation = btnField.rotationAngle;
        formFields.IsReadonly = btnField.readOnly;
        formFields.IsRequired = btnField.required;
        formFields.Visible = btnField.visibility;
        formFields.Value = btnField.text;
        formFields.RotationAngle = this.GetRotateAngle(btnField.page.rotation);
        formFields.Text = btnField.text;
        formFields.IsPrint = true;
        formFields.Actions = this.parseButtonFieldActions(btnField);
        if (btnField._dictionary.has('CustomData')) {
            formFields.CustomData = JSON.parse(btnField._dictionary.get('CustomData'));
        }
        if (btnField._dictionary.has('Id')) {
            formFields.Id = btnField._dictionary.get('Id');
        }
        this.PdfRenderedFormFields.push(formFields);
    }

    /**
     * Parses PdfButtonField AA slots into runtime ActionsSettings (GoTo only).
     *
     * @param {PdfButtonField} btnField - button field from loaded PDF
     * @returns {ActionsSettingsModel} serializable actions map
     */
    private parseButtonFieldActions(btnField: PdfButtonField): ActionsSettingsModel {
        const result: ActionsSettingsModel = {};
        try {
            if (isNullOrUndefined(btnField)) {
                return result;
            }
            const slotKeys: { slot: string; key: string }[] = [
                { slot: 'mouseEnter', key: 'E' },
                { slot: 'mouseLeave', key: 'X' },
                { slot: 'mouseUp', key: 'U' },
                { slot: 'mouseDown', key: 'D' },
                { slot: 'gotFocus', key: 'Fo' },
                { slot: 'lostFocus', key: 'Bl' }
            ];
            for (let i: number = 0; i < slotKeys.length; i++) {
                const entry: { slot: string; key: string } = slotKeys[parseInt(i.toString(), 10)];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let pdfAction: any = null;
                if (!isNullOrUndefined(btnField.actions)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    pdfAction = (btnField.actions as any)[entry.slot];
                }
                let mapped: object = this.mapPdfActionToGoToSettings(pdfAction);
                // Fallback: read widget AA directly when getters/instanceof miss.
                if (isNullOrUndefined(mapped)) {
                    mapped = this.mapWidgetAaGoToSettings(btnField, entry.key);
                }
                if (!isNullOrUndefined(mapped)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (result as any)[entry.slot] = mapped;
                }
            }
        } catch (e) {
            // Fail-silent: ignore invalid AA dictionaries
        }
        return result;
    }

    /**
     * Maps a PDF action to runtime GoTo action payload. Non-GoTo actions are ignored.
     *
     * @param {PdfAction} pdfAction - field AA action
     * @returns {object} GoTo action settings or null
     */
    private mapPdfActionToGoToSettings(pdfAction: PdfAction): object {
        if (isNullOrUndefined(pdfAction)) {
            return null;
        }
        // Prefer instanceof; duck-type destination if package identity differs.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const goTo: any = pdfAction as any;
        const isGoTo: boolean = pdfAction instanceof PdfGoToAction ||
            (!isNullOrUndefined(goTo.destination) &&
                (isNullOrUndefined(goTo._dictionary) ||
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ((goTo._dictionary as any).has && (goTo._dictionary as any).has('S') &&
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (goTo._dictionary as any).get('S') && (goTo._dictionary as any).get('S').name === 'GoTo')));
        if (!isGoTo || isNullOrUndefined(goTo.destination)) {
            return null;
        }
        return this.mapDestinationToGoToSettings(goTo.destination as PdfDestination);
    }

    /**
     * Reads a single widget AA key and maps GoTo destination without relying on getters.
     *
     * @param {PdfButtonField} btnField - button field
     * @param {string} aaKey - AA dictionary key (U/D/E/X/Fo/Bl)
     * @returns {object} GoTo action settings or null
     */
    private mapWidgetAaGoToSettings(btnField: PdfButtonField, aaKey: string): object {
        try {
            if (isNullOrUndefined(btnField) || isNullOrUndefined(btnField.itemsCount) || btnField.itemsCount <= 0) {
                return null;
            }
            const widget: PdfWidgetAnnotation = btnField.itemAt(0) as PdfWidgetAnnotation;
            if (isNullOrUndefined(widget) || isNullOrUndefined(widget._dictionary) || !widget._dictionary.has('AA')) {
                return null;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const aa: any = widget._dictionary.get('AA');
            if (isNullOrUndefined(aa) || !aa.has || !aa.has(aaKey)) {
                return null;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const actionDict: any = aa.get(aaKey);
            if (isNullOrUndefined(actionDict) || !actionDict.has || !actionDict.has('S')) {
                return null;
            }
            const type: { name?: string } = actionDict.get('S');
            if (isNullOrUndefined(type) || type.name !== 'GoTo' || !actionDict.has('D')) {
                return null;
            }
            if (!actionDict._crossReference && widget._crossReference) {
                actionDict._crossReference = widget._crossReference;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dValue: any = actionDict.get('D');
            return this.mapDestinationArrayToGoToSettings(dValue);
        } catch (e) {
            return null;
        }
    }

    /**
     * Maps a PDF destination array [pageRef, XYZ, x, y, zoom] to GoTo settings.
     *
     * @param {any} dValue - destination array or object
     * @returns {object} GoTo action settings or null
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapDestinationArrayToGoToSettings(dValue: any): object {
        if (isNullOrUndefined(dValue)) {
            return null;
        }
        let pageIndex: number = -1;
        let x: number = 0;
        let y: number = 0;
        let zoom: number = 0;
        if (Array.isArray(dValue)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pageRef: any = dValue[0];
            if (!isNullOrUndefined(this.formFieldLoadedDocument) && !isNullOrUndefined(pageRef)) {
                for (let k: number = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
                    const page: PdfPage = this.formFieldLoadedDocument.getPage(k);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (!isNullOrUndefined(page) && (page as any)._ref === pageRef) {
                        pageIndex = k;
                        // Library writes Y as page.size.height for top; convert like _obtainDestination.
                        if (typeof dValue[3] === 'number' && !isNullOrUndefined(page.size)) {
                            y = page.size.height - dValue[3];
                        }
                        break;
                    }
                    // Compare by objectNumber if present
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (!isNullOrUndefined(page) && !isNullOrUndefined((page as any)._ref) && !isNullOrUndefined(pageRef) &&
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (page as any)._ref.objectNumber === pageRef.objectNumber) {
                        pageIndex = k;
                        if (typeof dValue[3] === 'number' && !isNullOrUndefined(page.size)) {
                            y = page.size.height - dValue[3];
                        }
                        break;
                    }
                }
            }
            if (typeof dValue[2] === 'number') {
                x = dValue[2];
            }
            if (pageIndex < 0 && typeof dValue[3] === 'number') {
                y = dValue[3];
            }
            if (typeof dValue[4] === 'number') {
                zoom = dValue[4];
            }
        }
        if (pageIndex < 0) {
            return null;
        }
        return {
            action: 'GoTo',
            destinationPageNumber: pageIndex + 1,
            destinationLocation: { x: x, y: y },
            zoomValue: zoom
        };
    }

    /**
     * Maps PdfDestination to runtime flat GoToAction payload.
     *
     * @param {PdfDestination} destination - destination from GoTo action
     * @returns {object} GoTo action settings or null
     */
    private mapDestinationToGoToSettings(destination: PdfDestination): object {
        if (isNullOrUndefined(destination)) {
            return null;
        }
        let pageIndex: number = -1;
        if (!isNullOrUndefined(destination.pageIndex) && typeof destination.pageIndex === 'number') {
            pageIndex = destination.pageIndex;
        }
        // Loaded destinations may only expose private _index until page objects rehydrate.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (pageIndex < 0 && !isNullOrUndefined((destination as any)._index) &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            typeof (destination as any)._index === 'number') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pageIndex = (destination as any)._index as number;
        }
        if (pageIndex < 0 && !isNullOrUndefined(destination.page) && !isNullOrUndefined(this.formFieldLoadedDocument)) {
            for (let k: number = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
                if (destination.page === this.formFieldLoadedDocument.getPage(k)) {
                    pageIndex = k;
                    break;
                }
            }
        }
        if (pageIndex < 0) {
            return null;
        }
        const location: Point = destination.location;
        return {
            action: 'GoTo',
            destinationPageNumber: pageIndex + 1,
            destinationLocation: !isNullOrUndefined(location) ? { x: location.x, y: location.y } : { x: 0, y: 0 },
            zoomValue: !isNullOrUndefined(destination.zoom) ? destination.zoom : 0
        };
    }

    /**
     * Writes runtime ActionsSettings GoTo slots onto PdfButtonField widget AA.
     * ej2-pdf PdfFieldActions._updateAction replaces the entire widget AA with a
     * single key on each setter call, so multi-slot (and reliable single-slot)
     * persistence requires one merged AA dictionary write on the widget.
     *
     * @param {PdfButtonField} button - target PDF button field
     * @param {ActionsSettingsModel | object} actions - runtime actions map
     * @returns {void}
     */
    private applyButtonFieldActions(button: PdfButtonField, actions: ActionsSettingsModel | object): void {
        if (isNullOrUndefined(button) || isNullOrUndefined(actions)) {
            return;
        }
        // Slot → PDF widget AA key (PdfFieldActions mouse*/focus setters).
        const slotKeys: { slot: string; key: string }[] = [
            { slot: 'mouseEnter', key: 'E' },
            { slot: 'mouseLeave', key: 'X' },
            { slot: 'mouseUp', key: 'U' },
            { slot: 'mouseDown', key: 'D' },
            { slot: 'gotFocus', key: 'Fo' },
            { slot: 'lostFocus', key: 'Bl' }
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pending: { key: string; goTo: PdfGoToAction; page: PdfPage; destination: PdfDestination }[] = [];
        for (let i: number = 0; i < slotKeys.length; i++) {
            const entry: { slot: string; key: string } = slotKeys[parseInt(i.toString(), 10)];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const action: any = (actions as any)[entry.slot];
            if (isNullOrUndefined(action)) {
                continue;
            }
            // Flat GoToAction or legacy nested goToAction.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const goToAction: any = !isNullOrUndefined(action.goToAction) ? action.goToAction : action;
            const kind: string = !isNullOrUndefined(action.action) ? action.action :
                (!isNullOrUndefined(action.actionType) ? action.actionType : 'GoTo');
            if ((kind !== 'GoTo' && kind !== 'goto') || isNullOrUndefined(goToAction)) {
                continue;
            }
            // Public API uses 1-based destinationPageNumber; legacy destinationPageIndex was 0-based.
            let pageIndex: number = -1;
            if (!isNullOrUndefined(goToAction.destinationPageNumber) &&
                typeof goToAction.destinationPageNumber === 'number') {
                pageIndex = goToAction.destinationPageNumber - 1;
            } else if (!isNullOrUndefined(goToAction.destinationPageIndex) &&
                typeof goToAction.destinationPageIndex === 'number') {
                pageIndex = goToAction.destinationPageIndex;
            }
            if (pageIndex < 0 || pageIndex >= this.formFieldLoadedDocument.pageCount) {
                continue;
            }
            try {
                const destPage: PdfPage = this.formFieldLoadedDocument.getPage(pageIndex);
                const loc: { x?: number; y?: number } = goToAction.destinationLocation;
                const location: Point = {
                    x: !isNullOrUndefined(loc) && !isNullOrUndefined(loc.x) ? loc.x : 0,
                    y: !isNullOrUndefined(loc) && !isNullOrUndefined(loc.y) ? loc.y : 0
                };
                // Prefer page+location ctor (library samples); then mode/zoom.
                const destination: PdfDestination = new PdfDestination(destPage, location);
                destination.mode = PdfDestinationMode.location;
                destination.zoom = !isNullOrUndefined(goToAction.zoomValue) ? goToAction.zoomValue : 0;
                const goTo: PdfGoToAction = new PdfGoToAction(destination);
                pending.push({ key: entry.key, goTo: goTo, page: destPage, destination: destination });
                // Keep in-memory actions cache in sync for same-session readback.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (button.actions as any)['_' + entry.slot] = goTo;
            } catch (e) {
                // Fail-silent invalid GoTo build
            }
        }
        if (pending.length === 0) {
            return;
        }
        try {
            // Ensure widget kid exists (new PdfButtonField normally creates one).
            if (isNullOrUndefined(button.itemsCount) || button.itemsCount <= 0) {
                return;
            }
            const widget: PdfWidgetAnnotation = button.itemAt(0) as PdfWidgetAnnotation;
            if (isNullOrUndefined(widget) || isNullOrUndefined(widget._dictionary)) {
                return;
            }
            // Merge-safe AA: preserve sibling keys (unlike sequential _updateAction wipes).
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let aaDictionary: any = widget._dictionary.has('AA') ? widget._dictionary.get('AA') : null;
            if (isNullOrUndefined(aaDictionary) || !(aaDictionary instanceof _PdfDictionary)) {
                aaDictionary = new _PdfDictionary();
            }
            for (let j: number = 0; j < pending.length; j++) {
                const item: { key: string; goTo: PdfGoToAction; page: PdfPage; destination: PdfDestination } =
                    pending[parseInt(j.toString(), 10)];
                // Mirror ej2-pdf _updateAction D array for location mode so load path
                // (_getPdfAction → _PdfDestinationHelper) can rebuild PdfGoToAction.
                // Y uses page.size.height to match library write convention.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const actionDict: any = (item.goTo as any)._dictionary;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const pageRef: any = (item.page as any)._ref;
                if (!isNullOrUndefined(actionDict) && !isNullOrUndefined(pageRef)) {
                    const zoom: number = !isNullOrUndefined(item.destination.zoom) ? item.destination.zoom : 0;
                    const x: number = !isNullOrUndefined(item.destination.location) ? item.destination.location.x : 0;
                    // PDF user-space Y is bottom-up; _obtainDestination converts with
                    // page.size.height - top. Write top so viewer reload restores location.y.
                    const locY: number = !isNullOrUndefined(item.destination.location) ?
                        item.destination.location.y : 0;
                    const top: number = !isNullOrUndefined(item.page.size) ?
                        (item.page.size.height - locY) : locY;
                    actionDict.update('D', [pageRef, new _PdfName('XYZ'), x, top, zoom]);
                }
                aaDictionary.set(item.key, actionDict);
                if (!isNullOrUndefined(actionDict)) {
                    actionDict._updated = true;
                }
            }
            aaDictionary._updated = true;
            widget._dictionary.update('AA', aaDictionary);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (widget._dictionary as any)._updated = true;
        } catch (e) {
            // Fail-silent AA merge write
        }
    }

    private saveButtonField(loadedPage: PdfPage, formFieldAttributes: IFormField): PdfButtonField {
        const buttonName: string = isNullOrUndefined(formFieldAttributes.name) || formFieldAttributes.name === '' ?
            'buttonField' : formFieldAttributes.name as string;
        const buttonBounds: IFormFieldBound = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: IFormFieldBound = this.getBounds(buttonBounds, loadedPage.size.height, loadedPage.size.width,
                                                            rotationAngle, isFieldRotated);
        const bound: IPdfRectBounds = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        const button: PdfButtonField = new PdfButtonField(loadedPage, buttonName, bound);
        button.text = isNullOrUndefined(formFieldAttributes.value) ? '' : formFieldAttributes.value as string;
        button.readOnly = formFieldAttributes.isReadonly as boolean;
        button.required = formFieldAttributes.isRequired as boolean;
        button.visibility = this.getFormFieldsVisibility(formFieldAttributes.visibility as string);
        button.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? '' : formFieldAttributes.tooltip as string;
        if (!isNullOrUndefined(formFieldAttributes.backgroundColor)) {
            const isTransparentBg: boolean = formFieldAttributes.backgroundColor.a === 0 ? true : false;
            button.backColor = {
                r: formFieldAttributes.backgroundColor.r, g: formFieldAttributes.backgroundColor.g,
                b: formFieldAttributes.backgroundColor.b
            };
            if (formFieldAttributes.backgroundColor.r === 0 && formFieldAttributes.backgroundColor.g === 0 &&
                formFieldAttributes.backgroundColor.b === 0 && formFieldAttributes.backgroundColor.a === 0) {
                button.backColor = {
                    r: formFieldAttributes.backgroundColor.r, g: formFieldAttributes.backgroundColor.g,
                    b: formFieldAttributes.backgroundColor.b, isTransparent: isTransparentBg
                };
            }
        }
        if (!isNullOrUndefined(formFieldAttributes.borderColor)) {
            const isTransparent: boolean = formFieldAttributes.borderColor.a === 0 ? true : false;
            button.borderColor = {
                r: formFieldAttributes.borderColor.r, g: formFieldAttributes.borderColor.g,
                b: formFieldAttributes.borderColor.b
            };
            // eslint-disable-next-line
            if (formFieldAttributes.borderColor.r == 0 && formFieldAttributes.borderColor.g == 0 &&
                // eslint-disable-next-line
                formFieldAttributes.borderColor.b == 0 && formFieldAttributes.borderColor.a == 0) {
                button.borderColor = {
                    r: formFieldAttributes.borderColor.r, g: formFieldAttributes.borderColor.g,
                    b: formFieldAttributes.borderColor.b, isTransparent: isTransparent
                };
            }
        }
        if (!isNullOrUndefined(formFieldAttributes.thickness)) {
            button.border.width = formFieldAttributes.thickness as number;
        }
        if (!isNullOrUndefined(formFieldAttributes.fontColor)) {
            button.color = {
                r: formFieldAttributes.fontColor.r, g: formFieldAttributes.fontColor.g,
                b: formFieldAttributes.fontColor.b
            };
        }
        if (!isNullOrUndefined(formFieldAttributes.fontFamily) && !isNullOrUndefined(formFieldAttributes.fontSize)) {
            const pdfFontStyle: PdfFontStyle = this.getFontStyle(formFieldAttributes);
            button._dictionary.set('FontStyle', pdfFontStyle);
            button.font = new PdfStandardFont(this.getFontFamily(formFieldAttributes.fontFamily as string),
                                              this.convertPixelToPoint(formFieldAttributes.fontSize as number), pdfFontStyle);
        }
        if (!isNullOrUndefined(formFieldAttributes.textAlign)) {
            button.textAlignment = this.getTextAlignment(formFieldAttributes.textAlign as string);
        }
        if (!isFieldRotated) {
            button.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        if (!isNullOrUndefined(formFieldAttributes.customData)) {
            const customData: string = JSON.stringify(formFieldAttributes.customData);
            button._dictionary.set('CustomData', customData);
        }
        // Designer/API: camelCase actions; loaded/rendered payloads may use PascalCase Actions.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const actions: any = !isNullOrUndefined((formFieldAttributes as any).actions) ?
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (formFieldAttributes as any).actions :
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (formFieldAttributes as any).Actions;
        this.applyButtonFieldActions(button, actions);
        return button;
    }

    private checkTransparent(backColor: AnnotColor): boolean {
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
        const boundsObjects: Rectangle = JSON.parse(signatureBounds);
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
            const annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({x: left, y: top, width: width, height: height});
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
        const boundsObjects: Rectangle = JSON.parse(signatureBounds);
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
            const rubberStampAnnotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(
                {x: left, y: top, width: width, height: height});
            const bitmap: PdfImage = new PdfBitmap(imageUrl);
            const bounds: Rectangle = {
                x: 0,
                y: 0,
                width: width,
                height: height
            };
            rubberStampAnnotation.appearance.normal.graphics.drawImage(bitmap, bounds);
            rubberStampAnnotation.rotationAngle = this.getRotateAngle(page.rotation);
            rubberStampAnnotation._dictionary.set('T', currentFieldName);
            rubberStampAnnotation.flags = PdfAnnotationFlag.print;
            rubberStampAnnotation.setAppearance(true);
            page.annotations.add(rubberStampAnnotation);
        }
    }

    private drawFieldPath(resultObjects: string, signatureFields: PdfSignatureField, currentFieldName: string,
                          signatureBounds: string): void{
        const stampObjects: PathSegment[] = JSON.parse(resultObjects);
        const boundsObjects: Rectangle = JSON.parse(signatureBounds);
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
                const value: PathSegment = stampObjects[parseInt(p.toString(), 10)];
                if (minimumX === -1) {
                    minimumX = value.x as number;
                    minimumY = value.y as number;
                    maximumX = value.x as number;
                    maximumY = value.y as number;
                }
                else {
                    const point1: number = value.x as number;
                    const point2: number = value.y as number;
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
            let linePoints: Point[] = [];
            let isNewValues: number = 0;
            if (rotationAngle !== 0) {
                for (let j: number = 0; j < stampObjects.length; j++) {
                    const value: PathSegment = stampObjects[parseInt(j.toString(), 10)];
                    const path: string = (value.command as string).toString();
                    if (path === 'M' && j !== 0) {
                        isNewValues = j;
                        break;
                    }
                    linePoints.push({
                        x: parseFloat((value.x as number).toString()),
                        y: parseFloat((value.y as number).toString())
                    });
                }
                linePoints = [];
                for (let z: number = 0; z < stampObjects.length; z++) {
                    const value: PathSegment = stampObjects[parseInt(z.toString(), 10)];
                    linePoints.push({
                        x: ((parseFloat((value.x as number).toString()) - minimumX) / newDifferenceX) + left,
                        y: this.formFieldLoadedDocument.getPage(pageNumber).size.height -
                        ((parseFloat((value.y as number).toString()) - minimumY) / newDifferenceY) - top
                    });
                }
            } else {
                for (let k: number = 0; k < stampObjects.length; k++) {
                    const value: PathSegment = stampObjects[parseInt(k.toString(), 10)];
                    const path: string = (value.command as string).toString();
                    if (path === 'M' && k !== 0) {
                        isNewValues = k;
                        break;
                    }
                    const newX: number = ((parseFloat((value.y as number).toString()) - minimumY) / newDifferenceY);
                    linePoints.push({
                        x: ((parseFloat((value.x as number).toString()) - minimumX) / newDifferenceX) + left,
                        y: this.formFieldLoadedDocument.getPage(pageNumber).size.height - newX - top
                    });
                }
            }
            const inkAnnotation: PdfInkAnnotation = new PdfInkAnnotation({x: left, y: top, width: width, height: height}, linePoints);
            inkAnnotation.flags = PdfAnnotationFlag.print;
            const bounds: Rectangle = { x: inkAnnotation.bounds.x, y: (page.size.height -
                (inkAnnotation.bounds.y + inkAnnotation.bounds.height)), width: inkAnnotation.bounds.width,
            height: inkAnnotation.bounds.height};
            inkAnnotation.bounds = bounds;
            inkAnnotation.border.width = 0;
            linePoints = [];
            if (rotationAngle !== 0) {
                const pathCollection: Point[][] = [];
                for (let t: number = isNewValues; t < stampObjects.length; t++) {
                    const value: PathSegment = stampObjects[parseInt(t.toString(), 10)];
                    const path: string = (value.command as string).toString();
                    if (path === 'M' && t !== isNewValues) {
                        pathCollection.push(linePoints);
                        linePoints = [];
                    }
                    linePoints.push({x: parseFloat((value.x as number).toString()), y: parseFloat((value.y as number).toString())});
                }
                if (linePoints.length > 0) {
                    pathCollection.push(linePoints);
                }
                for (let w: number = 0; w < pathCollection.length; w++) {
                    const pointsCollections: Point[] = pathCollection[parseInt(w.toString(), 10)];
                    linePoints = [];
                    if (pointsCollections.length > 0) {
                        for (let z: number = 0; z < stampObjects.length; z++) {
                            const value: PathSegment = stampObjects[parseInt(z.toString(), 10)];
                            linePoints.push({
                                x: ((parseFloat((value.x as number).toString()) - minimumX) / newDifferenceX) + left,
                                y: this.formFieldLoadedDocument.getPage(pageNumber).size.height -
                                ((parseFloat((value.y as number).toString()) - minimumY) / newDifferenceY) - top
                            });
                        }
                        inkAnnotation.inkPointsCollection.push(linePoints);
                    }
                    linePoints = [];
                }
            } else {
                for (let r: number = 0; r < stampObjects.length; r++) {
                    const value: PathSegment = stampObjects[parseInt(r.toString(), 10)];
                    const path: string = (value.command as string).toString();
                    if (path === 'M' && r !== 0) {
                        inkAnnotation.inkPointsCollection.push(linePoints);
                        linePoints = [];
                    }
                    const newX: number = ((parseFloat((value.y as number).toString()) - minimumY) / newDifferenceY);
                    linePoints.push({
                        x: ((parseFloat((value.x as number).toString()) - minimumX) / newDifferenceX) + left,
                        y: this.formFieldLoadedDocument.getPage(pageNumber).size.height - newX - top
                    });
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
                        this.addSignatureField(signatureField, j, signatureField.itemAt(i));
                    }
                }
            }
        }
    }

    private addSignatureField(signatureField: PdfSignatureField, index: number,
                              signatureFieldItem: PdfSignatureField | PdfWidgetAnnotation): void {
        const formFields: PdfRenderedFields = new PdfRenderedFields();
        const bounds: Rectangle = signatureFieldItem.bounds;
        formFields.Name = 'SignatureField';
        formFields.ToolTip = signatureField.toolTip;
        formFields.FieldName = signatureField.name;
        formFields.ActualFieldName = signatureField.name;
        if (!isNullOrUndefined(signatureFieldItem)) {
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
        if (!isNullOrUndefined(signatureField.borderColor)) {
            formFields.BorderColor = {
                R: signatureField.borderColor.r, G: signatureField.borderColor.g,
                B: signatureField.borderColor.b
            };
        }
        if (!isNullOrUndefined(signatureField.backColor)) {
            formFields.BackColor = { R: signatureField.backColor.r, G: signatureField.backColor.g, B: signatureField.backColor.b };
        }
        else if (formFields.IsReadonly) {
            formFields.IsTransparent = true;
        }
        formFields.IsSignatureField = true;
        formFields.Rotation = signatureField.rotationAngle;
        formFields.RotationAngle = this.GetRotateAngle(signatureField.page.rotation);
        const initialField: boolean = signatureField._dictionary.get('InitialField');
        if (!isNullOrUndefined(initialField)) {
            formFields.IsInitialField = initialField;
        }
        if (signatureField._dictionary.has('CustomData')) {
            formFields.CustomData = JSON.parse(signatureField._dictionary.get('CustomData'));
        }
        if (signatureField._dictionary.has('Id')) {
            formFields.Id = signatureField._dictionary.get('Id');
        }
        this.PdfRenderedFormFields.push(formFields);
    }

    private retrieveInkAnnotation(loadedDocument: PdfDocument): void {
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
                    const inkListX: number[] = [];
                    const inkListY: number[] = [];
                    if (inkAnnot._dictionary.has('T') && !inkAnnot._dictionary.has('NM')) {
                        if (!isNullOrUndefined(inkAnnot.inkPointsCollection)) {
                            for (let m: number = 0; m < inkAnnot.inkPointsCollection.length; m++) {
                                const inkList: Point[] = inkAnnot.inkPointsCollection[parseInt(m.toString(), 10)];
                                for (let k: number = 0; k < inkList.length; k++) {
                                    let x: number;
                                    let y: number;
                                    if (loadedPage.rotation === PdfRotationAngle.angle90) {
                                        x = inkList[k as number].y;
                                        y = inkList[k as number].x;
                                    } else if (loadedPage.rotation === PdfRotationAngle.angle180) {
                                        x = loadedPage.size.width - inkList[k as number].x;
                                        y = inkList[k as number].y;
                                    } else if (loadedPage.rotation === PdfRotationAngle.angle270) {
                                        x = loadedPage.size.width - inkList[k as number].y;
                                        y = loadedPage.size.height - inkList[k as number].x;
                                    } else {
                                        x = inkList[k as number].x;
                                        y = loadedPage.size.height - inkList[k as number].y;
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
                        const bounds: IFormFieldBound = {X: inkAnnot.bounds.x, Y: inkAnnot.bounds.y, Width: inkAnnot.bounds.width,
                            Height: inkAnnot.bounds.height};
                        formFields.LineBounds = this.getBounds(bounds, loadedPage.size.height, loadedPage.size.width, rotationAngle,
                                                               !isFieldRotated);
                        formFields.Value = outputstring;
                        formFields.PageIndex = i;
                        formFields.BorderColor = !isNullOrUndefined(inkAnnot.color) ?
                            {r: inkAnnot.color.r, g: inkAnnot.color.g, b: inkAnnot.color.b} : { R: 0, G: 0, B: 0 };
                        formFields.Rotation = annotation.rotationAngle;
                        this.PdfRenderedFormFields.push(formFields);
                        count++;
                    }
                }else if (annotation instanceof PdfFreeTextAnnotation){
                    const inkAnnot: PdfFreeTextAnnotation = annotation as PdfFreeTextAnnotation;
                    if (inkAnnot._dictionary.has('T') && ! inkAnnot._dictionary.has('NM') && ! inkAnnot._dictionary.has('M')){
                        const formFields: PdfRenderedFields = new PdfRenderedFields();
                        formFields.FieldName = inkAnnot._dictionary.get('T') + '_' + count;
                        const bounds: IFormFieldBound = {X: inkAnnot.bounds.x, Y: inkAnnot.bounds.y, Width: inkAnnot.bounds.width,
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
                    const pdfRenderedFormFields: PdfRenderedFields[] = [];
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
                        const dictionary: _PdfDictionary = annotation._dictionary.get('AP');
                        const pageRender: PageRenderer = new PageRenderer(this.pdfViewer, this.pdfViewerBase);
                        formFields.LineBounds = {
                            X: stampAnnotation.bounds.x, Y: stampAnnotation.bounds.y,
                            Width: stampAnnotation.bounds.width, Height: stampAnnotation.bounds.height
                        };
                        formFields.Name = 'SignatureImage';
                        formFields.PageIndex = i;
                        this.PdfRenderedFormFields.push(formFields);
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
                            if (template.size.width === 0 || template.size.height === 0 || isNullOrUndefined(template._appearance)) {
                                pageRender.findStampImage(annotation);
                            }
                            else {
                                formFields.PageIndex = i;
                                pageRender.findStampTemplate(
                                    annotation,
                                    formFields,
                                    formFields.Rotation,
                                    pageRender.annotationOrder.length - 1,
                                    template,
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

    private getFontFamilyString(fontFamily: PdfFontFamily, form?: PdfForm, fontKey?: string): string {
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
            if (form && form._dictionary.has('DR')) {
                let baseFontName: string;
                const resources: any = form._dictionary.get('DR');
                if (resources && resources.has('Font')) {
                    const fontResources: any = resources.get('Font');
                    if (fontResources && fontResources.has(fontKey)) {
                        const fontDictionary: any = fontResources.get(fontKey);
                        if (fontDictionary && fontDictionary.has('BaseFont')) {
                            baseFontName = fontDictionary.get('BaseFont').name;
                            if (baseFontName.indexOf('+') !== -1) {
                                baseFontName = baseFontName.substring(
                                    baseFontName.indexOf('+') + 1
                                );
                            }
                            if (baseFontName.endsWith('-Regular')) {
                                baseFontName = baseFontName.slice(0, -8);
                            }
                            return baseFontName;
                        }
                    }
                }
            }
            return 'Helvetica';
        }
    }

    /**
     * Maps the viewer symbology string onto the PDF engine symbology.
     *
     * @param {string} symbology - The viewer symbology.
     * @returns {PdfBarcodeSymbology} The engine symbology.
     */
    private getBarcodeSymbology(symbology: string): PdfBarcodeSymbology {
        switch (symbology) {
        case 'QRCode':
            return PdfBarcodeSymbology.QR;
        case 'DataMatrix':
            return PdfBarcodeSymbology.DataMatrix;
        default:
            return PdfBarcodeSymbology.PDF417;
        }
    }

    /**
     * Maps the viewer value format string onto the PDF engine value format.
     *
     * @param {string} valueFormat - The viewer value format.
     * @returns {PdfBarcodeValueFormat} The engine value format.
     */
    private getBarcodeValueFormat(valueFormat: string): PdfBarcodeValueFormat {
        switch (valueFormat) {
        case 'Xml':
            return PdfBarcodeValueFormat.XML;
        case 'CustomValue':
            return PdfBarcodeValueFormat.CustomScript;
        default:
            return PdfBarcodeValueFormat.TabDelimited;
        }
    }

    /**
     * Maps the viewer error correction string onto the PDF417 engine level.
     *
     * @param {string} level - The viewer error correction level.
     * @returns {Pdf417ErrorCorrectionLevel} The engine level.
     */
    private getPdf417ErrorCorrectionLevel(level: string): Pdf417ErrorCorrectionLevel {
        switch (level) {
        case 'Level0':
            return Pdf417ErrorCorrectionLevel.Level0;
        case 'Level1':
            return Pdf417ErrorCorrectionLevel.Level1;
        case 'Level2':
            return Pdf417ErrorCorrectionLevel.Level2;
        case 'Level3':
            return Pdf417ErrorCorrectionLevel.Level3;
        case 'Level4':
            return Pdf417ErrorCorrectionLevel.Level4;
        case 'Level5':
            return Pdf417ErrorCorrectionLevel.Level5;
        case 'Level6':
            return Pdf417ErrorCorrectionLevel.Level6;
        case 'Level7':
            return Pdf417ErrorCorrectionLevel.Level7;
        case 'Level8':
            return Pdf417ErrorCorrectionLevel.Level8;
        default:
            return Pdf417ErrorCorrectionLevel.Level5;
        }
    }

    /**
     * Maps the viewer error correction string onto the QR Code engine level.
     *
     * @param {string} level - The viewer error correction level.
     * @returns {PdfQRErrorCorrectionLevel} The engine level.
     */
    private getQrErrorCorrectionLevel(level: string): PdfQRErrorCorrectionLevel {
        switch (level) {
        case 'Low':
            return PdfQRErrorCorrectionLevel.Low;
        case 'Quartile':
            return PdfQRErrorCorrectionLevel.Quartile;
        case 'High':
            return PdfQRErrorCorrectionLevel.High;
        default:
            return PdfQRErrorCorrectionLevel.Medium;
        }
    }

    /**
     * Persists a barcode field as a native `PdfBarcodeField`.
     *
     * @param {PdfPage} loadedPage - The page the field belongs to.
     * @param {any} formFieldAttributes - The stored form field attributes.
     * @returns {PdfBarcodeField} The barcode field.
     */
    private saveBarcodeField(loadedPage: PdfPage, formFieldAttributes: any): PdfBarcodeField {
        const barcodeName: string = isNullOrUndefined(formFieldAttributes.name) ? 'barcode' : formFieldAttributes.name;
        const textBounds: any = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: any = this.getBounds(textBounds, loadedPage.size.height, loadedPage.size.width,
                                                rotationAngle, isFieldRotated);
        const bound: any = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        const symbology: string = isNullOrUndefined(formFieldAttributes.symbology) ? 'PDF417' : formFieldAttributes.symbology;
        const barcodeOptions: PdfBarcodeOptions = { symbology: this.getBarcodeSymbology(symbology) };
        if (!isNullOrUndefined(formFieldAttributes.xDimension) && formFieldAttributes.xDimension > 1) {
            barcodeOptions.xDimention = formFieldAttributes.xDimension;
        }
        const errorLevel: string = formFieldAttributes.errorCorrectionLevel;
        if (!isNullOrUndefined(errorLevel)) {
            barcodeOptions.errorCorrectionLevel = symbology === 'PDF417'
                ? this.getPdf417ErrorCorrectionLevel(errorLevel)
                : this.getQrErrorCorrectionLevel(errorLevel);
        }
        const valueFormat: PdfBarcodeValueFormat = this.getBarcodeValueFormat(formFieldAttributes.valueFormat);
        const customScript: string = valueFormat === PdfBarcodeValueFormat.CustomScript
            ? this.wrapCustomValueAsScript(formFieldAttributes.customValue)
            : (isNullOrUndefined(formFieldAttributes.customCalculationScript)
                ? '' : formFieldAttributes.customCalculationScript);
        const barcodeField: PdfBarcodeField = new PdfBarcodeField(loadedPage, barcodeName, bound, {
            barcodeOptions: barcodeOptions,
            valueFormat: valueFormat,
            includeFieldNames: formFieldAttributes.includeFieldNames !== false,
            fields: Array.isArray(formFieldAttributes.fields) ? formFieldAttributes.fields : [],
            caption: isNullOrUndefined(formFieldAttributes.caption) ? '' : formFieldAttributes.caption,
            compressData: formFieldAttributes.compressData === true,
            customCalculationScript: customScript
        });
        barcodeField.readOnly = true;
        if (!isNullOrUndefined(formFieldAttributes.backgroundColor)) {
            barcodeField.backColor = {r: formFieldAttributes.backgroundColor.r,
                g: formFieldAttributes.backgroundColor.g, b: formFieldAttributes.backgroundColor.b};
        }
        if (!isNullOrUndefined(formFieldAttributes.borderColor)) {
            const isTransparentBorder: boolean = formFieldAttributes.borderColor.a === 0 ? true : false;
            barcodeField.borderColor = {r: formFieldAttributes.borderColor.r,
                g: formFieldAttributes.borderColor.g, b: formFieldAttributes.borderColor.b,
                isTransparent: isTransparentBorder};
        }
        if (!isNullOrUndefined(formFieldAttributes.thickness)) {
            barcodeField.border.width = formFieldAttributes.thickness as number;
        }
        barcodeField.required = formFieldAttributes.isRequired;
        barcodeField.visibility = this.getFormFieldsVisibility(formFieldAttributes.visibility);
        barcodeField.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? '' : formFieldAttributes.tooltip;
        if (!isNullOrUndefined(formFieldAttributes.customData)) {
            barcodeField._dictionary.set('CustomData', JSON.stringify(formFieldAttributes.customData));
        }
        return barcodeField;
    }

    /**
     *
     * @param {string} customValue - The viewer-side custom value.
     * @returns {string} The wrapped script.
     */
    private wrapCustomValueAsScript(customValue: string): string {
        const payload: string = isNullOrUndefined(customValue) ? '' : customValue;
        return 'event.value = ' + JSON.stringify(payload) + ';';
    }

}

/**
 * @private
 */
export class PdfRenderedFields {
    public LineBounds: IFormFieldBound;
    public Bounds: IFormFieldBound;
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
    public Id: string;
    public FontStyle: PdfFontStyle;
    public selectedIndex: number;
    public IsSignatureField: boolean;
    public IsInitialField: boolean;
    public TextList: TextItem[];
    public SelectedList: number[];
    public SelectedValue: string;
    public BackColor: FormFieldColor;
    public BorderColor: FormFieldColor | PdfColor;
    public Foreground: number[];
    public Font: FormFieldFont;
    public FontColor: FormFieldColor;
    public BorderStyle: PdfBorderStyle;
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
    public uniqueID: string;
    public IsTansparentBorderColor: boolean;
    public IsPrint: boolean;
    public Actions?: ActionsSettingsModel | object;
    public IsUnisonSelected?: boolean;
    public SignatureType?: string;
    public SignatureIndicatorSettings?: SignatureIndicatorSettingsModel;
    public zIndex?: number;
    public Opacity?: number;
    /** DateTime textbox flag (Textbox + isDateField). */
    public IsDateField?: boolean;
    /** DateTime semantic type: date | time | text. */
    public DateFieldType?: string;
    // I6/I7: per-widget index within a multi-widget button field (PDF 1.7 §12.7.4
    // allows multiple widgets to share a single FieldName on one or more pages).
    public WidgetIndex?: number;
    // I6/I7: stable id used by the runtime to distinguish widgets that share a
    // FieldName (same name + page or same name + different pages).
    public FieldUniqueKey?: string;
    public Symbology?: BarcodeSymbology;
    public XDimension?: number;
    public ErrorCorrectionLevel?: Pdf417ErrorCorrection | QRErrorCorrectionLevel;
    public ValueFormat?: BarcodeValueFormat;
    public IncludeFieldNames?: boolean;
    public Fields?: string[];
    public Caption?: string;
    public CompressData?: boolean;
    public CustomValue?: string;
    public CustomCalculationScript?: string;
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

/**
 * @private
 */
export interface FormFieldFont {
    Bold: boolean;
    FontFamily : string;
    Height: number;
    Italic: boolean;
    Name: string;
    Size: number;
    Strikeout: boolean;
    Style: PdfFontStyle;
    Underline: boolean;
}

/**
 * @private
 */
export interface FormFieldColor {
    R: number;
    G: number;
    B: number;
}

/**
 * @private
 */
export interface TextItem {
    itemName: string;
    itemValue: string;
}
