import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfDocument, PdfPage, PdfForm, PdfTextBoxField, PdfFormFieldVisibility, PdfTextAlignment, PdfSignatureField, PdfField, PdfFreeTextAnnotation, PdfFontFamily, PdfStandardFont, PdfAnnotationFlag, PdfRubberStampAnnotation, PdfImage, PdfBitmap, PdfGraphics, PdfGraphicsState, PdfFontStyle as FontStyle, PdfCheckBoxField, PdfComboBoxField, PdfListBoxField, PdfListFieldItem, PdfRadioButtonListField, PdfRadioButtonListItem, PdfRotationAngle, PdfFontStyle, PdfFont, PdfTemplate, PdfInkAnnotation, PdfTrueTypeFont, PdfAnnotationCollection, PdfAnnotation, _PdfReference, _PdfDictionary, _PdfPath} from '@syncfusion/ej2-pdf';
import { PdfViewer, PdfViewerBase, PageRenderer } from '../index';
import { getArialFontData } from '../pdf-base/fontData';
import { Rect } from '@syncfusion/ej2-drawings';

/**
 * FormFieldsBase
 *
 * @hidden
 */
export class FormFieldsBase {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private formFieldLoadedDocument: PdfDocument;
    private pageRenderer: PageRenderer;
    /**
     * @private
     **/
    public m_isDigitalSignaturePresent: boolean;
    /**
     * @private
     **/
    public showDigitalSignatureAppearance: boolean;
    /**
     * @private
     **/
    public hideEmptyDigitalSignatureFields: boolean;
    /**
     * @private
     */
    public PdfRenderedFormFields: PdfRenderedFields[] = [];

    /**
     * @param {PdfViewer} pdfViewer - The PdfViewer.
     * @param {PdfViewerBase} pdfViewerBase - The PdfViewerBase.
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase, digitalSignatruePresent?: boolean) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
        this.formFieldLoadedDocument = this.pdfViewer.pdfRendererModule.loadedDocument;
        this.m_isDigitalSignaturePresent = digitalSignatruePresent;
    }

    /**
     * @private
     * @param textSignature 
     * @param isAnnotationFlattern 
     */
    public drawFreeTextAnnotations(textSignature: any, loadedDocument: any, isAnnotationFlattern: boolean): void {
        let stampObjects: any = textSignature.data;
        let textData: string = stampObjects.replace(/"/g, '');
        const boundsObject: Rect = JSON.parse(textSignature.bounds);

        let page: PdfPage = loadedDocument.getPage(textSignature.pageIndex);

        if (stampObjects != "") {
            let left: number = this.convertPixelToPoint(boundsObject.left);
            let top: number = this.convertPixelToPoint(boundsObject.top);
            let width: number = this.convertPixelToPoint(boundsObject.width);
            let height: number = this.convertPixelToPoint(boundsObject.height);
            let annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(left, top, width, height);
            annotation._dictionary.set('NM', textSignature.signatureName.toString());
            let fontSize: number = textSignature.fontSize;
            annotation.border.width = 0;
            let fontFamilyEnum: PdfFontFamily = PdfFontFamily.helvetica;
            let fontName: string = textSignature.fontFamily.toString();
            if (!isNullOrUndefined(fontName)) {
                let family = fontName.toString();
                if (family.includes("Times New Roman")) {
                    fontFamilyEnum = PdfFontFamily.timesRoman;
                }
                else if (family.includes("Courier")) {
                    fontFamilyEnum = PdfFontFamily.courier;
                }
                else if (family.includes("Symbol")) {
                    fontFamilyEnum = PdfFontFamily.symbol;
                }
                else if (family.includes("ZapfDingbats")) {
                    fontFamilyEnum = PdfFontFamily.zapfDingbats;
                }
            }
            fontSize = Math.floor(this.convertPixelToPoint(fontSize));
            let fontStyle: FontStyle = FontStyle.regular;
            annotation.font = new PdfStandardFont(fontFamilyEnum, fontSize, fontStyle);
            annotation.text = textData;
            annotation.borderColor = [0, 0, 0];
            annotation.textAlignment = PdfTextAlignment.center;
            annotation._annotFlags = PdfAnnotationFlag.print;
            if (isAnnotationFlattern) {
                let rotateAngle: number = this.getRotateAngle(page.rotation);
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
     * @param textSignature 
     * @param isAnnotationFlattern 
     */
    public drawImage(signatureImage: any, loadedDocument: any, isAnnotationFlattern: boolean): void {
        let stampObjects: any = signatureImage.data;
        const boundsObject: Rect = JSON.parse(signatureImage.bounds);
        let page: PdfPage = loadedDocument.getPage(signatureImage.pageIndex);
        if (stampObjects != '') {
            let imageUrl: string = (stampObjects.toString()).split(',')[1];
            let left: number = this.convertPixelToPoint(boundsObject.left);
            let top: number = this.convertPixelToPoint(boundsObject.top);
            let width: number = this.convertPixelToPoint(boundsObject.width);
            let height: number = this.convertPixelToPoint(boundsObject.height);
            let rectangle: Rect = new Rect(left, top, width, height);
            let rubberStampAnnotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(left, top, width, height);
            let bitmap: PdfImage = new PdfBitmap(imageUrl);
            const graphics: PdfGraphics = page.graphics;
            let appearance: PdfTemplate = rubberStampAnnotation.appearance.normal;
            rubberStampAnnotation._dictionary.set('NM', signatureImage.signatureName.toString());
            if (isAnnotationFlattern) {
                let rotationAngle: number = this.getRotateAngle(page.rotation);
                rubberStampAnnotation.rotationAngle = Math.abs(rotationAngle);
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
     * @param jsonObject
     */
    public saveFormFieldsDesignerData(jsonObject: any) {
        if (jsonObject.hasOwnProperty("formDesigner")) {
            let formFields: string = jsonObject["formDesigner"];
            if (!isNullOrUndefined(formFields)) {
                let data: any = JSON.parse(formFields);
                const myList: number[] = [];
                let formFieldsPageList: any = jsonObject.hasOwnProperty("formFieldsPageList") ? JSON.parse(jsonObject["formFieldsPageList"]) : myList;
                //Removing form fields from the page.
                if (!isNullOrUndefined(this.formFieldLoadedDocument.form)) {
                    let initialCount: number = this.formFieldLoadedDocument.form._fields.length;
                    //Get the loaded form.
                    let loadedForm: PdfForm = this.formFieldLoadedDocument.form;
                    for (let k = initialCount - 1; k >= 0; k--) {
                        let formFieldPage: any = loadedForm.fieldAt(k);
                        let pageNumber: number = formFieldPage.page._pageIndex;
                        let signField: PdfSignatureField = null;
                        if (formFieldPage instanceof PdfSignatureField) {
                            signField = formFieldPage as PdfSignatureField;
                        }
                        let signed: boolean = !isNullOrUndefined(signField)? signField.isSigned : true;
                        //Removing the formfields from a page
                        // if (formFieldsPageList.includes(pageNumber + 1) && (signField === null || !signed)) {
                        // formFieldsPageList is did not removed  when delete non rendered pages form fields.
                        if ((signField === null || !signed)) {
                            loadedForm.removeField(loadedForm.fieldAt(k));
                        }
                    }
                }
                for (let i = 0; i < data.length; i++) {
                    this.addFormFieldsToDocument(data[parseInt(i.toString(), 10)].FormField);
                }
            }
            if (!isNullOrUndefined(this.formFieldLoadedDocument.form)) {
                this.formFieldLoadedDocument.form.setDefaultAppearance(false);
            }
        }
    }

    /**
     * @private
     * @param jsonObject
     */
    public saveFormFieldsData(jsonObject: any) {
        if (jsonObject.hasOwnProperty("fieldsData")) {
            let formFields: string = jsonObject["fieldsData"];
            let data: any = JSON.parse(formFields);
            if (!isNullOrUndefined(data) && Object.keys(data).length > 0 && !isNullOrUndefined(this.formFieldLoadedDocument.form)) {
                if (this.formFieldLoadedDocument.form._fields.length > 0) {
                    this.formFieldLoadedDocument.form.setDefaultAppearance(false);
                }
                for (let i = 0; i < this.formFieldLoadedDocument.form._fields.length; i++) {
                    let currentField: any = this.formFieldLoadedDocument.form.fieldAt(i);
                    let currentFieldName: string = "";
                    let actualFieldName: string = "";
                    if (!isNullOrUndefined(currentField.name)) {
                        currentFieldName = currentField.name.replace(/[^0-9a-zA-Z]+/g, "").replace(/\s+/g, "");
                        actualFieldName = currentField.name;
                    }
                    if (currentField instanceof PdfTextBoxField) {
                        if (!(currentField as PdfTextBoxField).password) {
                            if ((data.hasOwnProperty(currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (data.hasOwnProperty(actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                                if (data.hasOwnProperty(actualFieldName)) {
                                    currentFieldName = actualFieldName;
                                }
                                let field: any = data[`${currentFieldName}`];
                                if (!isNullOrUndefined(field) && field.hasOwnProperty("isReadOnly")) {
                                    (currentField as PdfTextBoxField).text = field["fieldValue"];
                                    (currentField as PdfTextBoxField).readOnly = field["isReadOnly"] === 'true' ? true : false;
                                }
                            }
                        } else {
                            if ((data.hasOwnProperty(currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (data.hasOwnProperty(actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                                if (data.hasOwnProperty(actualFieldName)) {
                                    currentFieldName = actualFieldName;
                                }
                                let field: any = data[`${currentFieldName}`];
                                if (!isNullOrUndefined(field) && field.hasOwnProperty("isReadOnly")) {
                                    (currentField as PdfTextBoxField).text = field["fieldValue"];
                                    (currentField as PdfTextBoxField).readOnly = field["isReadOnly"] === 'true' ? true : false;
                                }
                            }
                        }
                    } else if (currentField instanceof PdfComboBoxField) {
                        if ((data.hasOwnProperty(currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (data.hasOwnProperty(actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                            if (data.hasOwnProperty(actualFieldName)) {
                                currentFieldName = actualFieldName;
                            }
                            let field: any = data[`${currentFieldName}`];
                            const count: number = currentField.itemsCount;
                            let fieldName: string = '';
                            if (!isNullOrUndefined(field)) {
                                if (field.hasOwnProperty('isReadOnly')) {
                                    currentField.readOnly = field["isReadOnly"] === 'true' ? true : false;
                                }
                                if (!isNullOrUndefined(field["fieldValue"])) {
                                    fieldName = field["fieldValue"];
                                }
                            }
                            let isExists: boolean = false;
                            for (let j: number = 0; j < count; j++) {
                                let optionArray: any;
                                let text: string; 
                                if(currentField._dictionary.has('Opt')){
                                    optionArray = currentField._dictionary.get('Opt');
                                    text = optionArray[parseInt(j.toString(), 10)];
                                }else if(!isNullOrUndefined(currentField.itemAt(j))){
                                   text = currentField.itemAt(j).text;
                                }
                                if (text === fieldName) {
                                    currentField.selectedIndex = j;
                                    isExists = true;
                                }
                            }
                            if (currentField.editable && !isExists) {
                                currentField.selectedValue = fieldName;
                            }
                        }
                    } else if (currentField instanceof PdfCheckBoxField) {
                        if ((data.hasOwnProperty(currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (data.hasOwnProperty(actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                            if (data.hasOwnProperty(actualFieldName)) {
                                currentFieldName = actualFieldName;
                            }
                            let field: any = data[`${currentFieldName}`];
                            let fields: boolean = field["isSelected"];
                            let fieldValueString: string = fields.toString();
                            let fieldValue: string = field["fieldValue"];
                            if (!isNullOrUndefined(fieldValue)){
                                (currentField as PdfCheckBoxField)._dictionary.set("ExportValue", fieldValue);
                            }
                            if (fieldValueString.toLowerCase() === "true" || fieldValueString.toLowerCase() === "false") {
                                (currentField as PdfCheckBoxField).checked = fields;
                                if (!isNullOrUndefined(field) && field.hasOwnProperty("isReadOnly")) {
                                    (currentField as PdfCheckBoxField).readOnly = field.readonly;
                                }
                                if (fieldValueString.toLowerCase() === "false") {
                                    var checkBoxField = currentField as PdfCheckBoxField;
                                    for (let k = 0; k < checkBoxField.itemsCount; k++) {
                                        checkBoxField.itemAt(k).checked = false;
                                    }
                                    (currentField as PdfCheckBoxField).checked = false;
                                }
                            }
                            else {
                                let integerValue: number = isNullOrUndefined(fields) ? -1 : 0;
                                let checkBoxField = currentField as PdfCheckBoxField;
                                if (checkBoxField.itemsCount > 0) {
                                    if (integerValue == -1) {
                                        for (var n = 0; n < checkBoxField.itemsCount; n++) {
                                            checkBoxField.itemAt(n).checked = false;
                                        }
                                        (currentField as PdfCheckBoxField).checked = false
                                    }
                                    else if (!isNullOrUndefined(checkBoxField.itemAt(integerValue))) {
                                        checkBoxField.itemAt(integerValue).checked = true;
                                    }
                                }
                            }
                        }
                    } else if (currentField instanceof PdfListBoxField) {
                        if ((data.hasOwnProperty(currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (data.hasOwnProperty(actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                            if (data.hasOwnProperty(actualFieldName)) {
                                currentFieldName = actualFieldName;
                            }
                            let table: any = data[`${currentFieldName}`];
                            const count: number = currentField.itemsCount;
                            let fieldName: string = '';
                            if (!isNullOrUndefined(table)) {
                                if (table.hasOwnProperty('fieldValue') && !isNullOrUndefined(table["fieldValue"])) {
                                    fieldName = table["fieldValue"];
                                }
                                if (table.hasOwnProperty('isReadOnly')) {
                                    currentField.readOnly = table["isReadOnly"] === 'true' ? true : false;
                                }
                            }
                            fieldName = JSON.parse(fieldName) [0].replace(/[^0-9a-zA-Z]+/g, '');
                            let selectedIndexes: number[] = [];
                            for (let k: number = 0; k < count; k++) {
                                const text: string = currentField.itemAt(k).text;
                                if (text === fieldName) {
                                    selectedIndexes.push(k);
                                }
                            }
                            currentField.selectedIndex = selectedIndexes;
                        }
                    } else if (currentField instanceof PdfRadioButtonListField) {
                        if ((data.hasOwnProperty(currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (data.hasOwnProperty(actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))) {
                            if (data.hasOwnProperty(actualFieldName)) {
                                currentFieldName = actualFieldName;
                            }
                            const field: any = data[`${currentFieldName}`];
                            if (!isNullOrUndefined(field) && field.hasOwnProperty('isReadOnly')) {
                                const selectedValue: string = field["fieldValue"];
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
                    else if( currentField instanceof PdfSignatureField){
                        if ((data.hasOwnProperty(currentFieldName) && !isNullOrUndefined(data[`${currentFieldName}`])) || (data.hasOwnProperty(actualFieldName) && !isNullOrUndefined(data[`${actualFieldName}`]))){
                            if (data.hasOwnProperty(actualFieldName)){
                                currentFieldName = actualFieldName;
                            }
                            let signatureFields: PdfSignatureField = currentField as PdfSignatureField;
                            if(data.hasOwnProperty(currentFieldName + "fontName")){
                                this.drawFieldFreeTextAnnotations(data[`${currentFieldName}`], signatureFields, currentFieldName, data[currentFieldName + "bounds"], data[currentFieldName + "fontName"], data[currentFieldName + "fontSize"])
                            }else if (data.hasOwnProperty(currentFieldName + "ImageData")){
                                this.drawFieldImage(data[`${currentFieldName}`], signatureFields, currentFieldName, data[currentFieldName + "bounds"]);
                            }
                            else if(data.hasOwnProperty(currentFieldName + "bounds")){
                                this.drawFieldPath(data[`${currentFieldName}`], signatureFields, currentFieldName, data[currentFieldName + "bounds"])
                            }
                            let signatureFieldListCount: any = signatureFields.itemsCount;
                            if(signatureFieldListCount > 0){
                                for(let k = 0; k < signatureFieldListCount; k++ ){
                                    if(data.hasOwnProperty(currentFieldName + "fontName" + "_" + k)){
                                        this.drawFieldFreeTextAnnotations(data[`${currentFieldName}`], signatureFields, currentFieldName, data[currentFieldName + "bounds"+ "_" + k], data[currentFieldName + "fontName"+ "_" + k], data[currentFieldName + "fontSize" + "_" + k])
                                    }else if (data.hasOwnProperty(currentFieldName + "ImageData" + "_"+ k)){
                                        this.drawFieldImage(data[`${currentFieldName}`], signatureFields, currentFieldName, data[currentFieldName + "bounds" + "_" + k]);
                                    }
                                    else if(data.hasOwnProperty(currentFieldName + "bounds"+ "_"+ k)){
                                        this.drawFieldPath(data[`${currentFieldName}`], signatureFields, currentFieldName, data[currentFieldName + "bounds" + "_" + k])
                                    } 
                                }
                            }
                        }
                        if(data.hasOwnProperty(currentFieldName + "isReadOnly") || data.hasOwnProperty(actualFieldName + "isReadOnly")){
                            if(data.hasOwnProperty(actualFieldName + "isReadOnly")){
                                currentFieldName = actualFieldName;
                            }
                            (currentField as PdfSignatureField).readOnly = data["isReadOnly"] === 'true' ? true : false;
                        }
                    }
                }
            }
        }
    }

    private addFormFieldsToDocument(formFieldAttributes: any) {
        let loadedPage: PdfPage = this.formFieldLoadedDocument.getPage(formFieldAttributes.pageNumber - 1) as PdfPage;
        let field: PdfField;
        switch (formFieldAttributes.formFieldAnnotationType) {
            case "Textbox":
            case "PasswordField":
                //Create a password and text box field for name
                field = this.saveTextBoxField(loadedPage, formFieldAttributes);
                break;
            case "Checkbox":
                // Create Check Box field.
                field = this.SaveCheckBoxField(loadedPage, formFieldAttributes);
                break;
            case "RadioButton":
                field = this.saveRadioButtonField(formFieldAttributes);
                break;
            case "DropdownList":
                // Create Drop Down field.
                field = this.saveDropDownField(loadedPage, formFieldAttributes);
                break;
            case "ListBox":
                field = this.saveListBoxField(loadedPage, formFieldAttributes);
                break;
            case "SignatureField":
            case "InitialField":
                //Create PDF Signature and Initial field.
                field = this.saveSignatureField(loadedPage, formFieldAttributes)
                break;

        }
        if (field) {
            this.formFieldLoadedDocument.form.add(field);
        }
    }
    private saveTextBoxField(loadedPage: PdfPage, formFieldAttributes: any) {
        let textboxName: string = isNullOrUndefined(formFieldAttributes.name) ? formFieldAttributes.type === 'Password' ? 'passwordTextbox' : "textbox" : formFieldAttributes.name;
        let textBounds: any = this.convertFieldBounds(formFieldAttributes);
        let rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        let fieldBounds: any = this.getBounds(textBounds, loadedPage.size[1], loadedPage.size[0], rotationAngle, isFieldRotated)
        let bound: any = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        //Create a new text box field
        let textbox: PdfTextBoxField = new PdfTextBoxField(loadedPage, textboxName, bound);
        textbox.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g, formFieldAttributes.backgroundColor.b];
        if (formFieldAttributes.backgroundColor.r == 0 && formFieldAttributes.backgroundColor.g == 0 && formFieldAttributes.backgroundColor.b == 0 && formFieldAttributes.backgroundColor.a == 0) {
            textbox.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g, formFieldAttributes.backgroundColor.b, formFieldAttributes.backgroundColor.a];
        }
        textbox.maxLength = formFieldAttributes.maxLength;
        textbox.insertSpaces = formFieldAttributes.insertSpaces;
        textbox.readOnly = formFieldAttributes.isReadonly;
        textbox.required = formFieldAttributes.isRequired;
        textbox.textAlignment = this.getTextAlignment(formFieldAttributes.textAlign);
        textbox.visibility = this.getFormFieldsVisibility(formFieldAttributes.visibility);
        textbox.text = isNullOrUndefined(formFieldAttributes.value) ? "" : formFieldAttributes.value;
        textbox.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? "" : formFieldAttributes.tooltip;
        textbox.color = [formFieldAttributes.fontColor.r, formFieldAttributes.fontColor.g, formFieldAttributes.fontColor.b];
        textbox.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g, formFieldAttributes.borderColor.b];
        if (formFieldAttributes.borderColor.r == 0 && formFieldAttributes.borderColor.g == 0 && formFieldAttributes.borderColor.b == 0 && formFieldAttributes.borderColor.a == 0) {
            textbox.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g, formFieldAttributes.borderColor.b, formFieldAttributes.borderColor.a];
        }
        textbox.border.width = formFieldAttributes.thickness;
        textbox.multiLine = formFieldAttributes.Multiline;
        let pdfFontStyle: PdfFontStyle = this.getFontStyle(formFieldAttributes);
        textbox._dictionary.set('FontStyle', pdfFontStyle);
        const hasUnicode: boolean = /[^\u0000-\u007F]/.test(textbox.text);
        if(hasUnicode){
            textbox.font = this.getTrueFont(formFieldAttributes.fontSize, pdfFontStyle )

        }else{
            textbox.font = new PdfStandardFont(this.getFontFamily(formFieldAttributes.FontFamily), this.convertPixelToPoint(formFieldAttributes.fontSize), pdfFontStyle)
        }
        if (formFieldAttributes.formFieldAnnotationType === 'PasswordField') {
            textbox.password = true;
        }
        if (!isFieldRotated) {
            textbox.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        return textbox;
    }
    private saveDropDownField(loadedPage: PdfPage, formFieldAttributes: any): PdfComboBoxField {
        let dropdownListName: string = isNullOrUndefined(formFieldAttributes.name) ? 'dropdownList' : formFieldAttributes.name;
        const dropDownListbounds: {X: number, Y: number, Width: number, Height: number} = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: any = this.getBounds(dropDownListbounds, loadedPage.size[1], loadedPage.size[0], rotationAngle, isFieldRotated);
        const bound: any = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        let comboBox: PdfComboBoxField = new PdfComboBoxField(loadedPage, dropdownListName, bound);
        let hasUnicode: boolean = false;
        for (let i: number = 0; i < formFieldAttributes.option.length; i++) {
            const item: PdfListFieldItem = new PdfListFieldItem(formFieldAttributes.option[parseInt(i.toString(), 10)].itemName, formFieldAttributes.option[parseInt(i.toString(), 10)].itemValue);
            comboBox.addItem(item);
            const flag: boolean = /[^\u0000-\u007F]/.test(formFieldAttributes.option[parseInt(i.toString(), 10)].itemName);
            if (flag)
            {
                hasUnicode = true;
            }
        }
        comboBox.textAlignment = this.getTextAlignment(formFieldAttributes.textAlign);
        const pdfFontStyle: PdfFontStyle = this.getFontStyle(formFieldAttributes);
        comboBox._dictionary.set('FontStyle', pdfFontStyle);
        if (hasUnicode) {
            comboBox.font = this.getTrueFont(formFieldAttributes.FontSize, pdfFontStyle);
        } else {
            comboBox.font = new PdfStandardFont(this.getFontFamily(formFieldAttributes.FontFamily), this.convertPixelToPoint(formFieldAttributes.FontSize), pdfFontStyle);
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
        comboBox.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g, formFieldAttributes.backgroundColor.b];
        if (formFieldAttributes.backgroundColor.r == 0 && formFieldAttributes.backgroundColor.g == 0 && formFieldAttributes.backgroundColor.b == 0 && formFieldAttributes.backgroundColor.a == 0) {
            comboBox.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g, formFieldAttributes.backgroundColor.b, formFieldAttributes.backgroundColor.a];
        }
        comboBox.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g, formFieldAttributes.borderColor.b];
        if (formFieldAttributes.borderColor.r == 0 && formFieldAttributes.borderColor.g == 0 && formFieldAttributes.borderColor.b == 0 && formFieldAttributes.borderColor.a == 0) {
            comboBox.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g, formFieldAttributes.borderColor.b, formFieldAttributes.borderColor.a];
        }
        comboBox.border.width = formFieldAttributes.thickness;
        comboBox.color = [formFieldAttributes.fontColor.r, formFieldAttributes.fontColor.g, formFieldAttributes.fontColor.b];
        if (!isFieldRotated) {
            comboBox.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        comboBox.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? '' : formFieldAttributes.tooltip;
        comboBox._font = new PdfStandardFont(this.getFontFamily(formFieldAttributes.fontFamily), this.convertPixelToPoint(formFieldAttributes.fontSize), pdfFontStyle);
        return comboBox;
    }
    private SaveCheckBoxField(loadedPage: PdfPage, formFieldAttributes: any) {
        let checkboxFieldName: string = isNullOrUndefined(formFieldAttributes.name) && formFieldAttributes.name === '' ? "checkboxField" : formFieldAttributes.name;
        let checkBounds = this.convertFieldBounds(formFieldAttributes);
        let rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        let fieldBounds: any = this.getBounds(checkBounds, loadedPage.size[1], loadedPage.size[0], rotationAngle, isFieldRotated)
        let bound: any = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        //Create a new Check box field
        let checkBoxField: PdfCheckBoxField = new PdfCheckBoxField(checkboxFieldName, bound, loadedPage);
        checkBoxField.readOnly = formFieldAttributes.isReadonly;
        checkBoxField.required = formFieldAttributes.isRequired;
        checkBoxField.checked = formFieldAttributes.isChecked;
        checkBoxField.visibility = this.getFormFieldsVisibility(formFieldAttributes.visibility);
        checkBoxField._dictionary.set('ExportValue', formFieldAttributes.value);
        checkBoxField.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g, formFieldAttributes.backgroundColor.b];
        if (formFieldAttributes.backgroundColor.r === 0 && formFieldAttributes.backgroundColor.g === 0 && formFieldAttributes.backgroundColor.b === 0 && formFieldAttributes.backgroundColor.a === 0) {
            checkBoxField.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g, formFieldAttributes.backgroundColor.b, formFieldAttributes.backgroundColor.a];
        }
        checkBoxField.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g, formFieldAttributes.borderColor.b];
        if (formFieldAttributes.borderColor.r == 0 && formFieldAttributes.borderColor.g == 0 && formFieldAttributes.borderColor.b == 0 && formFieldAttributes.borderColor.a == 0) {
            checkBoxField.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g, formFieldAttributes.borderColor.b, formFieldAttributes.borderColor.a];
        }
        checkBoxField.border.width = formFieldAttributes.thickness;
        checkBoxField.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? "" : formFieldAttributes.tooltip;
        if (!isFieldRotated) {
            checkBoxField.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        return checkBoxField;
    }
    private saveListBoxField(loadedPage: PdfPage, formFieldAttributes: any) {
        let listBoxName: string = isNullOrUndefined(formFieldAttributes.name) ? 'listBox' : formFieldAttributes.name;
        let listBounds: any = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: any = this.getBounds(listBounds, loadedPage.size[1], loadedPage.size[0], rotationAngle, isFieldRotated);
        const bound: any = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        let listBox: PdfListBoxField = new PdfListBoxField(loadedPage, listBoxName, bound);
        let flag: boolean = false;
        let hasUnicode: boolean = false;
        for (let i: number = 0; i < formFieldAttributes.option.length; i++) {
            const item: PdfListFieldItem = new PdfListFieldItem(formFieldAttributes.option[parseInt(i.toString(), 10)].itemName, formFieldAttributes.option[parseInt(i.toString(), 10)].itemValue);
            listBox.addItem(item);
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
                    let selectedIndexes: number[] = [];
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
        listBox.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g, formFieldAttributes.backgroundColor.b];
        if (formFieldAttributes.backgroundColor.r == 0 && formFieldAttributes.backgroundColor.g == 0 && formFieldAttributes.backgroundColor.b == 0 && formFieldAttributes.backgroundColor.a == 0) {
            listBox.backColor = [formFieldAttributes.backgroundColor.r, formFieldAttributes.backgroundColor.g, formFieldAttributes.backgroundColor.b, formFieldAttributes.backgroundColor.a];
        }
        listBox.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g, formFieldAttributes.borderColor.b];
        if (formFieldAttributes.borderColor.r == 0 && formFieldAttributes.borderColor.g == 0 && formFieldAttributes.borderColor.b == 0 && formFieldAttributes.borderColor.a == 0) {
            listBox.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g, formFieldAttributes.borderColor.b, formFieldAttributes.borderColor.a];
        }
        listBox.border.width = formFieldAttributes.thickness;
        const pdfFontStyle: PdfFontStyle = this.getFontStyle(formFieldAttributes);
        listBox._dictionary.set('FontStyle', pdfFontStyle);
        if (hasUnicode)
        {
            listBox.font = this.getTrueFont(formFieldAttributes.FontSize, pdfFontStyle);
        }else{
            listBox.font = new PdfStandardFont(this.getFontFamily(formFieldAttributes.fontFamily), this.convertPixelToPoint(formFieldAttributes.fontSize), pdfFontStyle);
        }
        listBox.readOnly = formFieldAttributes.isReadonly;
        listBox.required = formFieldAttributes.isRequired;
        listBox.visibility = this.getFormFieldsVisibility(formFieldAttributes.visibility);
        listBox.toolTip = isNullOrUndefined(formFieldAttributes.tooltip) ? "" : formFieldAttributes.tooltip;
        if (!isFieldRotated) {
            listBox.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        return listBox;
    }
    private saveRadioButtonField(formFieldAttributes: any): PdfRadioButtonListField {
        let loadedPage: PdfPage = this.formFieldLoadedDocument.getPage(formFieldAttributes.pageNumber - 1) as PdfPage;
        const fieldName: string = isNullOrUndefined(formFieldAttributes.name) ? 'radiobuttonField' : formFieldAttributes.name;
        const field: PdfRadioButtonListField = new PdfRadioButtonListField(loadedPage, fieldName);
        let selectedIndex: number = 0;
        let isSelectedItem: boolean = false;
        let isReadOnly: boolean = false;
        let isRequired: boolean = false;
        for (let i: number = 0; i < formFieldAttributes.radiobuttonItem.length; i++) {
            let radiobuttonItem:any = formFieldAttributes.radiobuttonItem[parseInt(i.toString(), 10)];
            let page: PdfPage = this.formFieldLoadedDocument.getPage(radiobuttonItem.pageNumber - 1) as PdfPage;
            let radioButtonName: string = !(isNullOrUndefined(radiobuttonItem.value) || radiobuttonItem.value === '') ? radiobuttonItem.value : fieldName;
            let rotationAngle: number = this.getRotateAngle(page.rotation);
            let bounds: any = this.convertFieldBounds(radiobuttonItem);
            let isFieldRotated: boolean = false;
            if (formFieldAttributes.rotation != 0) {
                isFieldRotated = true;
            }
            let fieldBounds: any = this.getBounds(bounds, page.size[1], page.size[0], rotationAngle, isFieldRotated);
            const bound: any = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
            let radioButtonItem: PdfRadioButtonListItem = new PdfRadioButtonListItem(radioButtonName, bound, page);
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
            if (radiobuttonItem.borderColor.r == 0 && radiobuttonItem.borderColor.g == 0 && radiobuttonItem.borderColor.b == 0 && radiobuttonItem.borderColor.a == 0) {
                radioButtonItem.borderColor = [radiobuttonItem.borderColor.r, radiobuttonItem.borderColor.g, radiobuttonItem.borderColor.b, radiobuttonItem.borderColor.a];
            }
            radioButtonItem.border.width = radiobuttonItem.thickness;
            radioButtonItem.backColor = [radiobuttonItem.backgroundColor.r, radiobuttonItem.backgroundColor.g, radiobuttonItem.backgroundColor.b];
            if (radiobuttonItem.backgroundColor.r == 0 && radiobuttonItem.backgroundColor.g == 0 && radiobuttonItem.backgroundColor.b == 0 && radiobuttonItem.backgroundColor.a == 0) {
                radioButtonItem.backColor = [radiobuttonItem.backgroundColor.r, radiobuttonItem.backgroundColor.g, radiobuttonItem.backgroundColor.b, radiobuttonItem.backgroundColor.a];
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
            field.selectedIndex = selectedIndex;
        return field;
    }

    private saveSignatureField(loadedPage: PdfPage, formFieldAttributes: any) {
        let signatureFieldName: string = isNullOrUndefined(formFieldAttributes.name) ? 'signatureField' : formFieldAttributes.name;
        let signatureFieldBounds: any = this.convertFieldBounds(formFieldAttributes);
        const rotationAngle: number = loadedPage.rotation;
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        const fieldBounds: any = this.getBounds(signatureFieldBounds, loadedPage.size[1], loadedPage.size[0], rotationAngle, isFieldRotated);
        const bound: any = { x: fieldBounds.X, y: fieldBounds.Y, width: fieldBounds.Width, height: fieldBounds.Height };
        let signatureField: PdfSignatureField = new PdfSignatureField(loadedPage, signatureFieldName, bound);
        //let page: PdfPage = signatureField.page;
        signatureField.toolTip = formFieldAttributes.tooltip;
        signatureField.required = formFieldAttributes.isRequired;
        signatureField.readOnly = formFieldAttributes.isReadonly;
        if (formFieldAttributes.formFieldAnnotationType === "InitialField") {
            signatureField._dictionary.set("InitialField", true)
        }
        signatureField.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g, formFieldAttributes.borderColor.b];
        if (formFieldAttributes.borderColor.r == 0 && formFieldAttributes.borderColor.g == 0 && formFieldAttributes.borderColor.b == 0 && formFieldAttributes.borderColor.a == 0) {
            signatureField.borderColor = [formFieldAttributes.borderColor.r, formFieldAttributes.borderColor.g, formFieldAttributes.borderColor.b, formFieldAttributes.borderColor.a];
        }
        signatureField.border.width = formFieldAttributes.thickness;
        if (formFieldAttributes.visibility === "hidden") {
            signatureField.visible = false;
        }
        else if (formFieldAttributes.visibility === "visible") {
            signatureField.visible = true;
        }
        if (formFieldAttributes.signatureType === "Text") {
            this.drawDesignerFieldFreeTextAnnotations(signatureField, signatureFieldName, formFieldAttributes)
        } else if (formFieldAttributes.signatureType === "Image") {
            this.drawDesignerFieldImage(signatureField, signatureFieldName, formFieldAttributes)
        } else if (formFieldAttributes.signatureType = "Path") {
            if (!isNullOrUndefined(formFieldAttributes.value) && formFieldAttributes.value !== "") {
                this.drawDesignerFieldPath(signatureField, signatureFieldName, formFieldAttributes);
            }
        }
        if (!isFieldRotated) {
            signatureField.rotate = this.getFormfieldRotation(loadedPage.rotation);
        }
        return signatureField;

    }

    private drawDesignerFieldFreeTextAnnotations(signatureField: PdfSignatureField, currentFieldName: string, formFieldAttributes: any) {
        let boundsObjects: any = { X: formFieldAttributes.signatureBound.x, Y: formFieldAttributes.signatureBound.y, Width: formFieldAttributes.signatureBound.width, Height: formFieldAttributes.signatureBound.height };
        let page: PdfPage = signatureField.page;
        let pageRotationAngle: number = page.rotation;
        const zoomvalue: number = formFieldAttributes.zoomValue;
        let signBounds: any = { X: this.convertPixelToPoint(boundsObjects.X / zoomvalue), Y: this.convertPixelToPoint(boundsObjects.Y / zoomvalue), Width: this.convertPixelToPoint(boundsObjects.Width / zoomvalue), Height: this.convertPixelToPoint(boundsObjects.Height / zoomvalue) };
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        signBounds = this.getBounds(signBounds, page.size[1], page.size[0], pageRotationAngle, isFieldRotated);
        if (!isNullOrUndefined(formFieldAttributes)) {
            let left: number = signBounds.X;
            let top: number = signBounds.Y;
            let width: number = signBounds.Width;
            let height: number = signBounds.Height;
            let freeTextBounds = { X: left, Y: top, Width: width, Height: height };
            let annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(left, top, width, height);
            annotation.setAppearance(true);
            annotation._dictionary.set("T", currentFieldName);
            let font: number = formFieldAttributes.fontSize;
            let fontFamilyEnum: PdfFontFamily = PdfFontFamily.helvetica;
            if (!isNullOrUndefined(formFieldAttributes.fontFamily)) {
                fontFamilyEnum = this.getFontFamily(formFieldAttributes.fontFamily);
            }
            let fontStyle: PdfFontStyle = this.getFontStyle(formFieldAttributes);
            const hasUnicode: boolean = /[^\u0000-\u007F]/.test(formFieldAttributes.value);
            if (hasUnicode) {
                annotation.font = this.getTrueFont(this.convertPixelToPoint(font), fontStyle)

            } else {
                annotation.font = new PdfStandardFont(fontFamilyEnum, this.convertPixelToPoint(formFieldAttributes.fontSize), fontStyle)
            }
            annotation.text = formFieldAttributes.value;
            this.setFontSize(this.convertPixelToPoint(font), annotation.font, formFieldAttributes.value, freeTextBounds, fontFamilyEnum, fontStyle)
            annotation.border.width = 0;
            annotation.textAlignment = PdfTextAlignment.center;
            annotation.flags = PdfAnnotationFlag.print;
            if (!isFieldRotated) {
                annotation.rotationAngle = Math.abs(this.getRotateAngle(page.rotation));
            }
            annotation.setValues("AnnotationType", "Signature");
            annotation.setAppearance(true);
            page.annotations.add(annotation);
        }

    }

    private drawDesignerFieldImage(signatureField: PdfSignatureField, currentFieldName: string, formFieldAttributes: any) {
        let boundsObjects: any = { X: formFieldAttributes.signatureBound.x, Y: formFieldAttributes.signatureBound.y, Width: formFieldAttributes.signatureBound.width, Height: formFieldAttributes.signatureBound.height };
        let page: PdfPage = signatureField.page;
        let pageRotationAngle: number = page.rotation;
        const zoomvalue: number = formFieldAttributes.zoomValue;
        let signBounds: any = { X: this.convertPixelToPoint(boundsObjects.X / zoomvalue), Y: this.convertPixelToPoint(boundsObjects.Y / zoomvalue), Width: this.convertPixelToPoint(boundsObjects.Width / zoomvalue), Height: this.convertPixelToPoint(boundsObjects.Height / zoomvalue) };
        let isFieldRotated: boolean = false;
        if (formFieldAttributes.rotation !== 0) {
            isFieldRotated = true;
        }
        signBounds = this.getBounds(signBounds, page.size[1], page.size[0], pageRotationAngle, isFieldRotated);
        if (!isNullOrUndefined(formFieldAttributes)) {
            let left: number = signBounds.X;
            let top: number = signBounds.Y;
            let width: number = signBounds.Width;
            let height: number = signBounds.Height;
            const imageUrl: string = (formFieldAttributes.value.toString()).split(',')[1];
            let rubberStampAnnotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(left, top, width, height);
            const bitmap: PdfImage = new PdfBitmap(imageUrl);
            rubberStampAnnotation.appearance.normal.graphics.drawImage(bitmap, 0, 0, width, height);
            if (!isFieldRotated) {
                rubberStampAnnotation.rotationAngle = Math.abs(this.getRotateAngle(page.rotation));
            }
            rubberStampAnnotation._dictionary.set("T", currentFieldName);
            rubberStampAnnotation.flags = PdfAnnotationFlag.print;
            page.annotations.add(rubberStampAnnotation);
        }
    }

    private drawDesignerFieldPath(signatureField: PdfSignatureField, currentFieldName: string, formFieldAttributes: any) {
        let stampObjects: any = JSON.parse(formFieldAttributes.value);
        let boundsObjects: any = { X: formFieldAttributes.signatureBound.x, Y: formFieldAttributes.signatureBound.y, Width: formFieldAttributes.signatureBound.width, Height: formFieldAttributes.signatureBound.height };
        let page: PdfPage = signatureField.page;
        let pageRotationAngle: number = page.rotation;
        const zoomvalue: number = formFieldAttributes.zoomValue;
        let signBounds: any = { X: this.convertPixelToPoint(boundsObjects.X / zoomvalue), Y: this.convertPixelToPoint(boundsObjects.Y / zoomvalue), Width: this.convertPixelToPoint(boundsObjects.Width / zoomvalue), Height: this.convertPixelToPoint(boundsObjects.Height / zoomvalue) };
        signBounds = this.getBounds(signBounds, page.size[1], page.size[0], pageRotationAngle, false);
        let pageNumber: number = 0;
        for (let k = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
            if (page === this.formFieldLoadedDocument.getPage(k)) {
                break;
            }
            pageNumber++;
        }
        // Need to check and implement the logic of skia sharp to reduced the ink annotation thickness
        if (stampObjects.length > 0) {
            let left: number = signBounds.X;
            let top: number = signBounds.Y;
            let width: number = signBounds.Width;
            let height: number = signBounds.Height;
            let minimumX: number = -1;
            let minimumY: number = -1;
            let maximumX: number = -1;
            let maximumY: number = -1;
            let drawingPath: _PdfPath = new _PdfPath();
            for (let p = 0; p < stampObjects.length; p++) {
                let val: any = stampObjects[parseInt(p.toString(), 10)];
                drawingPath._addLine(val.x, val.y, 0, 0);
            }
            for (let p: number = 0; p <  drawingPath._points.length; p+=2) {
                const value = drawingPath._points[parseInt(p.toString(), 10)];
                if (minimumX == -1) {
                    minimumX = value[0];
                    minimumY = value[1];
                    maximumX = value[0];
                    maximumY = value[1];
                }
                else {
                    let point1: number = value[0];
                    let point2: number = value[1];
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
            let newDifferenceX: number = (maximumX - minimumX) / width;
            let newDifferenceY: number = (maximumY - minimumY) / height;
            let linePoints: number[] = [];
            let isNewValues = 0;
            if (pageRotationAngle !== 0) {
                for (let j = 0; j < stampObjects.length; j++) {
                    const value = stampObjects[parseInt(j.toString(), 10)];
                    let path: any = value.command.toString();

                    if (path == "M" && j !== 0) {
                        isNewValues = j;
                        break;
                    }
                    linePoints.push(parseFloat(value.x));
                    linePoints.push(parseFloat(value.y));
                }
                linePoints = [];
                for (let z = 0; z < stampObjects.length; z++) {
                    const value = stampObjects[parseInt(z.toString(), 10)];
                    linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                    linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - ((parseFloat(value.y) - minimumY) / newDifferenceY) - top);
                }
            } else {
                for (let k = 0; k < stampObjects.length; k++) {
                    const value = stampObjects[parseInt(k.toString(), 10)];
                    let path: any = value.command.toString();

                    if (path == "M" && k !== 0) {
                        isNewValues = k;
                        break;
                    }
                    linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                    let newX = ((parseFloat(value.y) - minimumY) / newDifferenceY);
                    linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - newX - top)

                }
            }
            let inkAnnotation: PdfInkAnnotation = new PdfInkAnnotation([left, top, width, height], linePoints);
            inkAnnotation.flags = PdfAnnotationFlag.print;
            inkAnnotation.bounds = { x: signBounds.X, y: signBounds.Y, width: signBounds.Width, height: signBounds.Height };
            inkAnnotation.border.width = 0;
            inkAnnotation.color = [0,0,0];
            inkAnnotation.setValues("annotationSignature", "annotationSignature");
            linePoints = [];
            if (pageRotationAngle !== 0) {
                let pathCollection: any[] = [];
                for (var t = isNewValues; t < stampObjects.length; t++) {
                    const value = stampObjects[parseInt(t.toString(), 10)];
                    let path: any = value.command.toString();
                    if (path === "M" && t !== isNewValues) {
                        pathCollection.push(linePoints);
                        linePoints = [];
                    }
                    linePoints.push(parseFloat(value.x));
                    linePoints.push(parseFloat(value.y));
                }
                if (linePoints.length > 0) {
                    pathCollection.push(linePoints);
                }
                for (let w = 0; w < pathCollection.length; w++) {
                    let pointsCollections: any = pathCollection[parseInt(w.toString(), 10)];
                    linePoints = [];
                    if (pointsCollections.length > 0) {
                        for (let z = 0; z < stampObjects.length; z++) {
                            const value = stampObjects[parseInt(z.toString(), 10)];
                            linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                            linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - ((parseFloat(value.y) - minimumY) / newDifferenceY) - top);
                        }
                        inkAnnotation.inkPointsCollection.push(linePoints)
                    }
                    linePoints = [];
                }
            } else {
                for (let r = 0; r < stampObjects.length; r++) {
                    const value = stampObjects[parseInt(r.toString(), 10)];
                    let path: any = value.command.toString();

                    if (path == "M" && r !== 0) {
                        inkAnnotation.inkPointsCollection.push(linePoints);
                        linePoints = [];

                    }
                    linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                    let newX = ((parseFloat(value.y) - minimumY) / newDifferenceY);
                    linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - newX - top);
                }
                if (linePoints.length > 0) {
                    inkAnnotation.inkPointsCollection.push(linePoints)
                }
            }
            inkAnnotation._dictionary.set("T", currentFieldName);
            inkAnnotation.setAppearance(true);
            inkAnnotation.rotationAngle = Math.abs(this.getRotateAngle(page.rotation));
            this.formFieldLoadedDocument.getPage(pageNumber).annotations.add(inkAnnotation);
        }
    }

    private setFontSize(fontSize: number, font: PdfFont, text: string, freeTextBounds: any, fontFamilyEnum: PdfFontFamily, fontStyle: PdfFontStyle): void {
        const minimumFontSize: number = 0.25;
        font = new PdfStandardFont(fontFamilyEnum, fontSize, fontStyle)
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
        let font: PdfFont = new PdfTrueTypeFont(getArialFontData(), this.convertPixelToPoint(fontSize), fontStyle)
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
    private getBounds(bounds: any, pageHeight: number, pageWidth: number, pageRotation: number, isFieldRotated: boolean) {
        let bound: any = {};
        if (pageRotation === 0) {
            bound = { X: bounds.X, Y: bounds.Y, Width: bounds.Width, Height: bounds.Height };
        }
        else if (pageRotation === 1) {
            if (isFieldRotated) {
                bound = { X: bounds.Y - (bounds.Width / 2 - bounds.Height / 2), Y: pageHeight - bounds.X - bounds.Height - (bounds.Width / 2 - bounds.Height / 2), Width: bounds.Width, Height: bounds.Height }
            } else {
                bound = { X: bounds.Y, Y: pageHeight - bounds.X - bounds.Width, Width: bounds.Height, Height: bounds.Width };
            }
        }
        else if (pageRotation === 2) {
            bound = { X: pageWidth - bounds.X - bounds.Width, Y: pageHeight - bounds.Y - bounds.Height, Width: bounds.Width, Height: bounds.Height };
        }
        else if (pageRotation === 3) {
            if (isFieldRotated) {
                bound = { X: pageWidth - bounds.Y - bounds.Height - (bounds.Width / 2 - bounds.Height / 2), Y: bounds.X + (bounds.Width / 2 - bounds.Height / 2), Width: bounds.Width, Height: bounds.Height };
            }
            else {
                bound = { X: pageWidth - bounds.Y - bounds.Height, Y: bounds.X, Width: bounds.Height, Height: bounds.Width };
            }
        }
        return bound;
    }

    private getFormfieldRotation(rotation: number) {
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
    private getTextAlignment(alignment: string) {
        let textAlignment: PdfTextAlignment;
        switch (alignment) {
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
    private getFormFieldsVisibility(visibility: string) {
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

    private getFontStyle(formFieldAttributes?: any) {
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

    private fontConvert(font: PdfFont){
        return {
            Bold: font.isBold,
            FontFamily: this.getFontFamilyString((font as PdfStandardFont).fontFamily),
            Height: font.height,
            Italic: font.isItalic,
            Name: this.getFontFamilyString((font as PdfStandardFont).fontFamily).toString(),
            Size: font.size,
            Strikeout: font.isStrikeout,
            Underline: font.isUnderline,
            Style: font.style,
        }
    }
    
    private parseFontStyle(numberValue: number, fontObject: any) {
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
     */
    public GetFormFields(): void {
        this.PdfRenderedFormFields = [];
        let loadedForm = this.formFieldLoadedDocument.form;
        if (!isNullOrUndefined(loadedForm) && !isNullOrUndefined(loadedForm._fields)) {
            loadedForm.orderFormFields();
            for (let i = 0; i < loadedForm.count; i++) {
                const field: PdfField = loadedForm.fieldAt(i) as PdfField;
                let page: PdfPage = field.page;
                let pageNumber: number = 0;
                for (let j = 0; j < this.formFieldLoadedDocument.pageCount; j++) {
                    if (page === this.formFieldLoadedDocument.getPage(j)) {
                        break;
                    }
                    pageNumber++;
                }
                if (!isNullOrUndefined(field.page)) {
                    if (field instanceof PdfTextBoxField) {
                        let textBox: PdfTextBoxField = field as PdfTextBoxField;
                        if (textBox.itemsCount > 0) {
                            this.addTextBoxFieldItems(textBox);
                        } else {
                            this.addTextBoxField(textBox, pageNumber, textBox.bounds, null)
                        }

                    } else if (field instanceof PdfComboBoxField) {
                        let comboBoxField: PdfComboBoxField = loadedForm.fieldAt(i) as PdfComboBoxField;
                        this.addComboBoxField(comboBoxField, pageNumber);
                    }
                    else if (field instanceof PdfCheckBoxField) {
                        let checkbox: PdfCheckBoxField = field as PdfCheckBoxField;
                        if (checkbox.itemsCount > 1) {
                            this.addCheckBoxFieldItems(checkbox);
                        } else {
                            this.addCheckBoxField(checkbox, pageNumber, checkbox.bounds, null)
                        }
                    } else if (field instanceof PdfListBoxField) {
                        let listBoxField: PdfListBoxField = field as PdfListBoxField;
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
                        let signatureField: PdfSignatureField = loadedForm.fieldAt(i) as PdfSignatureField;
                        if (signatureField.isSigned && this.showDigitalSignatureAppearance) {
                            this.m_isDigitalSignaturePresent = true;
                            signatureField.flatten = true;
                            
                        }
                        else if (!signatureField.isSigned || !this.hideEmptyDigitalSignatureFields) {
                            if (signatureField.itemsCount > 0) {
                                this.addSigntureFieldItems(signatureField)
                            } else {
                                this.addSignatureField(signatureField, pageNumber, signatureField.bounds)
                            }
                        }
                    }
                }

            }
        }
        this.retrieveInkAnnotation(this.formFieldLoadedDocument)
    }

    private addTextBoxFieldItems(field: PdfField) {
        if (field instanceof PdfTextBoxField) {
            let textBoxField: PdfTextBoxField = field as PdfTextBoxField;
            if (textBoxField.itemsCount > 0) {
                for (let i = 0; i < textBoxField.itemsCount; i++) {
                    let item: any = textBoxField.itemAt(i).page;
                    if (!isNullOrUndefined(item)) {
                        let j: number = 0;
                        for (let k = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
                            if (item == this.formFieldLoadedDocument.getPage(j)) {
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
    private addTextBoxField(textBox: PdfTextBoxField, pageNumber: number, bounds: any, font?: PdfFont) {
        let formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.FieldName = textBox.name;
        formFields.ActualFieldName = textBox.name;
        if (textBox.password) {
            formFields.Name = "Password";
        } else {
            formFields.Name = "Textbox";
        }
        formFields.ToolTip = textBox.toolTip;
        if (!isNullOrUndefined(bounds)) {
            formFields.LineBounds = { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height };
        } else {
            formFields.LineBounds = { X: textBox.bounds.x, Y: textBox.bounds.y, Width: textBox.bounds.width, Height: textBox.bounds.height };
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
        if(!isNullOrUndefined(font)){
            formFields.Font = this.fontConvert(font);
        }else{
            formFields.Font = this.fontConvert(textBox.font);
        }
        if(textBox._dictionary.has("FontStyle")){
            let fontStyle = textBox._dictionary.get("FontStyle");
            formFields.Font = this.parseFontStyle(fontStyle, formFields.Font);
        }
        formFields.Rotation = textBox.rotationAngle;
        formFields.IsReadonly = textBox.readOnly;
        formFields.IsRequired = textBox.required;
        if (!isNullOrUndefined(textBox.color)) {
            formFields.FontColor = { R: textBox.color[0], G: textBox.color[1], B: textBox.color[2] };;
        }
        formFields.BorderColor = { R: textBox.borderColor[0], G: textBox.borderColor[1], B: textBox.borderColor[2] };
        formFields.Text = textBox.text ? textBox.text.replace("\"", "") : '';
        formFields.Multiline = textBox.multiLine;
        formFields.RotationAngle = this.GetRotateAngle(textBox.page.rotation);
        formFields.TextList = [];
        this.PdfRenderedFormFields.push(formFields);
    }
    private addComboBoxField(comboBoxField: PdfComboBoxField, pageNumber: number): void {
        let formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.Name = 'DropDown';
        formFields.ToolTip = comboBoxField.toolTip;
        formFields.FieldName = comboBoxField.name;
        formFields.Font = this.fontConvert(comboBoxField.font);
        formFields.IsAutoSize = comboBoxField._isAutoFontSize;
        formFields.Selected = comboBoxField.editable;
        if (comboBoxField._dictionary.has('FontStyle')) {
            let fontStyle: number = comboBoxField._dictionary.get('FontStyle');
            formFields.Font = this.parseFontStyle(fontStyle, formFields.Font )
        }
        formFields.ActualFieldName = comboBoxField.name;
        formFields.SelectedValue = comboBoxField.selectedValue as string;
        formFields.selectedIndex = comboBoxField.selectedIndex as number;
        formFields.LineBounds = { X: comboBoxField.bounds.x, Y: comboBoxField.bounds.y, Width: comboBoxField.bounds.width, Height: comboBoxField.bounds.height };
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
        formFields.BorderColor = { R: comboBoxField.borderColor[0], G: comboBoxField.borderColor[1], B: comboBoxField.borderColor[2] };
        formFields.FontColor = { R: comboBoxField.color[0], G: comboBoxField.color[1], B: comboBoxField.color[2] };
        formFields.Rotation = comboBoxField.rotationAngle;
        formFields.IsRequired = comboBoxField.required;
        formFields.IsReadonly = comboBoxField.readOnly;
        formFields.Visible = comboBoxField.visibility;
        formFields.RotationAngle = this.GetRotateAngle(comboBoxField.page.rotation);
        formFields.Alignment = comboBoxField.textAlignment;
        formFields.TextList = [];
        if (comboBoxField._dictionary.has('Opt')) {
            let options: string[] = comboBoxField._dictionary.get('Opt');
            if(options.length > 0){
                formFields.TextList = options.map(item => (typeof item === "string" ? item : (typeof item === "object" ? item[0] : "")));
            }
        }
        if(formFields.TextList.length === 0 ){
            for (let i: number = 0; i < comboBoxField.itemsCount; i++) {
                const item: PdfListFieldItem = comboBoxField.itemAt(i);
                if (item) {
                    formFields.TextList.push(item.text);
                    if (i == 0) {
                        formFields.Alignment = item.textAlignment;
                    }
                }
            }
        }
        this.PdfRenderedFormFields.push(formFields);
    }
    private addCheckBoxFieldItems(field: PdfField) {
        let page: PdfPage = field.page;
        if (field instanceof PdfCheckBoxField) {
            let checkBoxField: PdfCheckBoxField = field as PdfCheckBoxField;
            if (checkBoxField.itemsCount > 0) {
                for (let i = 0; i < checkBoxField.itemsCount; i++) {
                    let item: PdfPage = checkBoxField.itemAt(i).page;
                    if (!isNullOrUndefined(item)) {
                        let j: number = 0;
                        for (let k = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
                            if (item == this.formFieldLoadedDocument.getPage(j)) {
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
    private addCheckBoxField(chkField: PdfCheckBoxField, index: number, bounds: any, checkBoxIndex: string) {
        let formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.Name = "CheckBox";
        formFields.ToolTip = chkField.toolTip;
        if (!bounds.IsEmpty) {
            formFields.LineBounds = { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height };
        }
        else {
            formFields.LineBounds = { X: chkField.bounds.x, Y: chkField.bounds.y, Width: chkField.bounds.width, Height: chkField.bounds.height };
        }
        formFields.Selected = chkField.checked;
        formFields.TabIndex = chkField.tabIndex;
        formFields.GroupName = chkField.name.replace(/[^0-9a-zA-Z]+/g, "");
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
        formFields.BorderColor = { R: chkField.borderColor[0], G: chkField.borderColor[1], B: chkField.borderColor[2] };
        formFields.RotationAngle = this.GetRotateAngle(chkField.page.rotation);
        formFields.IsReadonly = chkField.readOnly;
        formFields.IsRequired = chkField.required;
        formFields.Visible = chkField.visibility;
        let value: string = chkField._dictionary._get("ExportValue");
        if (chkField._dictionary._get("ExportValue") && !isNullOrUndefined(value)) {
            formFields.Value = value;
        }
        if (!isNullOrUndefined(checkBoxIndex)) {
            formFields.CheckBoxIndex = checkBoxIndex;
            let chekckboxField: any = chkField.itemAt(parseInt(checkBoxIndex));
            if (!isNullOrUndefined(chekckboxField)) {
                formFields.Selected = chekckboxField.checked;
            }
        }
        formFields.RotationAngle = this.GetRotateAngle(chkField.page.rotation);
        this.PdfRenderedFormFields.push(formFields);
    }
    private addListBoxField(listBoxField: PdfListBoxField, pageNumber: number) {
        let formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.Name = 'ListBox';
        formFields.ToolTip = listBoxField.toolTip;
        formFields.Text = listBoxField.name.replace(/[^0-9a-zA-Z]+/g, '');
        formFields.ActualFieldName = listBoxField.name;
        const itemCount: number = listBoxField.itemsCount;
        if (itemCount > 0) {
            const selectedIndex: any = listBoxField.selectedIndex;
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
            let fontStyle: number = listBoxField._dictionary.get('FontStyle');
            formFields.Font = this.parseFontStyle(fontStyle, formFields.Font)
        }
        formFields.LineBounds = { X: listBoxField.bounds.x, Y: listBoxField.bounds.y, Width: listBoxField.bounds.width, Height: listBoxField.bounds.height };
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
        formFields.BorderColor = { R: listBoxField.borderColor[0], G: listBoxField.borderColor[1], B: listBoxField.borderColor[2] };
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
            const item: PdfListFieldItem = listBoxField.itemAt(i);
            if (item) {
                formFields.TextList.push(item.text);
                if (i === 0) {
                    formFields.Alignment = listBoxField.textAlignment;
                }
            }
        }
        formFields.RotationAngle = this.GetRotateAngle(listBoxField.page.rotation);
        this.PdfRenderedFormFields.push(formFields);
    }
    private addRadioButtonField(item: PdfRadioButtonListItem, index: number, radioButtonName: string): void {
        const parent: PdfRadioButtonListField = item._field as PdfRadioButtonListField;
        let formFields: PdfRenderedFields = new PdfRenderedFields();
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
        this.PdfRenderedFormFields.push(formFields);
    }
    private checkTransparent(backColor: any): boolean {
        let IsTransparent: boolean = false;
        if (backColor.R === 0 && backColor.G === 0 && backColor.B === 0) {
            IsTransparent = true;
        }
        return IsTransparent;
    }

    private GetRotateAngle(angleString: number) {
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

    private drawFieldFreeTextAnnotations(resultObjects: string, signatureFields: PdfSignatureField, currentFieldName: string, signatureBounds: string, fontName: string, fontSizes: number) {
        let stampObjects: string = JSON.parse(resultObjects);
        let boundsObjects: any = JSON.parse(signatureBounds);
        let page: PdfPage = signatureFields.page;
        let pageNumber = 0;
        for (let k = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
            if (page == this.formFieldLoadedDocument.getPage(k)) {
                break;
            }
            pageNumber++;
        }
        if (!isNullOrUndefined(stampObjects) && stampObjects !== "") {
            let left: number = this.convertPixelToPoint(boundsObjects["x"]);
            let top: number = this.convertPixelToPoint(boundsObjects["y"]);
            let width: number = this.convertPixelToPoint(boundsObjects["width"]);
            let height: number = this.convertPixelToPoint(boundsObjects["height"]);
            let annotation: PdfFreeTextAnnotation = new PdfFreeTextAnnotation(left, top, width, height);
            annotation.setAppearance(true);
            annotation._dictionary.set("T", currentFieldName);
            let fontSize = fontSizes > 0 ? fontSizes : height / 2;
            let fontFamilyEnum: PdfFontFamily = PdfFontFamily.helvetica;
            if (!isNullOrUndefined(fontName)) {
                var family = fontName;
                if (family.includes("Times New Roman")) {
                    fontFamilyEnum = PdfFontFamily.timesRoman;
                } else if (family.includes("Courier")) {
                    fontFamilyEnum = PdfFontFamily.courier;
                } else if (family.includes("Symbol")) {
                    fontFamilyEnum = PdfFontFamily.symbol;
                } else if (family.includes("ZapfDingbats")) {
                    fontFamilyEnum = PdfFontFamily.zapfDingbats;
                }
            }
            let fontStyle: PdfFontStyle = this.getFontStyle();
            annotation.font = new PdfStandardFont(fontFamilyEnum, this.convertPixelToPoint(fontSize), fontStyle);
            annotation.text = stampObjects;
            annotation.rotationAngle = this.getRotateAngle(page.rotation);
            annotation.flags = PdfAnnotationFlag.print;
            annotation.setValues("AnnotationType", "Signature");
            annotation.setAppearance(true);
            page.annotations.add(annotation);
        }

    }

    private drawFieldImage(resultObjects: string, signatureFields: PdfSignatureField, currentFieldName: string, signatureBounds: string){
        let stampObjects: string = JSON.parse(resultObjects);
        let boundsObjects: any = JSON.parse(signatureBounds);
        let page: PdfPage = signatureFields.page;
        let pageNumber = 0;
        for (let k = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
            if (page == this.formFieldLoadedDocument.getPage(k)) {
                break;
            }
            pageNumber++;
        }
        if (!isNullOrUndefined(stampObjects) && stampObjects !== ""){
            const imageUrl: string = (stampObjects.toString()).split(',')[1];
            let left: number = this.convertPixelToPoint(boundsObjects["x"]);
            let top: number = this.convertPixelToPoint(boundsObjects["y"]);
            let width: number = this.convertPixelToPoint(boundsObjects["width"]);
            let height: number = this.convertPixelToPoint(boundsObjects["height"]);
            let rubberStampAnnotation: PdfRubberStampAnnotation = new PdfRubberStampAnnotation(left, top, width, height);
            const bitmap: PdfImage = new PdfBitmap(imageUrl);
            rubberStampAnnotation.appearance.normal.graphics.drawImage(bitmap, 0, 0, width, height);
            rubberStampAnnotation.rotationAngle = this.getRotateAngle(page.rotation);
            rubberStampAnnotation._dictionary.set("T", currentFieldName);
            rubberStampAnnotation.flags = PdfAnnotationFlag.print;
            rubberStampAnnotation.setAppearance(true);
            page.annotations.add(rubberStampAnnotation);
        }
    }

    private drawFieldPath(resultObjects: string, signatureFields: PdfSignatureField, currentFieldName: string, signatureBounds: string){
        let stampObjects: any = JSON.parse(resultObjects);
        let boundsObjects: any = JSON.parse(signatureBounds);
        let page: PdfPage = signatureFields.page;
        let pageNumber = 0;
        for (let k = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
            if (page == this.formFieldLoadedDocument.getPage(k)) {
                break;
            }
            pageNumber++;
        }
        if(stampObjects.length > 0){
            let rotationAngle = this.GetRotateAngle(page.rotation);
            let left: number = this.convertPixelToPoint(boundsObjects["x"]);
            let top: number = this.convertPixelToPoint(boundsObjects["y"]);
            let width: number = this.convertPixelToPoint(boundsObjects["width"]);
            let height: number = this.convertPixelToPoint(boundsObjects["height"]);
            if(rotationAngle != 0){
              left = this.convertPixelToPoint(signatureFields.bounds.x);
              top = this.convertPixelToPoint(signatureFields.bounds.y);
              width = this.convertPixelToPoint(signatureFields.bounds.width);
              height = this.convertPixelToPoint(signatureFields.bounds.height);
            }
            let minimumX: number = -1;
            let minimumY: number = -1;
            let maximumX: number = -1;
            let maximumY: number = -1;
            for (let p = 0; p < stampObjects.length; p++) {
                const value = stampObjects[parseInt(p.toString(), 10)];
                if (minimumX == -1) {
                    minimumX = value.x;
                    minimumY = value.y;
                    maximumX = value.x;
                    maximumY = value.y;
                }
                else {
                    let point1: number = value.x;
                    let point2: number = value.y; 
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
            let newDifferenceX: number = (maximumX - minimumX) / width;
            let newDifferenceY: number = (maximumY - minimumY) / height;
            let linePoints: number[] = [];
            let isNewValues = 0;
            if (rotationAngle !== 0) {
                for (let j = 0; j < stampObjects.length; j++) {
                    const value = stampObjects[parseInt(j.toString(), 10)];
                    let path: any = value.command.toString();

                    if (path == "M" && j !== 0) {
                        isNewValues = j;
                        break;
                    }
                    linePoints.push(parseFloat(value.x));
                    linePoints.push(parseFloat(value.y));
                }
                linePoints = [];
                for (let z = 0; z < stampObjects.length; z++) {
                    const value = stampObjects[parseInt(z.toString(), 10)];
                    linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                    linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - ((parseFloat(value.y) - minimumY) / newDifferenceY) - top);
                }
            } else {
                for (let k = 0; k < stampObjects.length; k++) {
                    const value = stampObjects[parseInt(k.toString(), 10)];
                    let path: any = value.command.toString();

                    if (path == "M" && k !== 0) {
                        isNewValues = k;
                        break;
                    }
                    linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                    let newX = ((parseFloat(value.y) - minimumY) / newDifferenceY);
                    linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - newX - top)

                }
            }
            let inkAnnotation: PdfInkAnnotation = new PdfInkAnnotation([left, top, width, height], linePoints);
            inkAnnotation.flags = PdfAnnotationFlag.print;
            let bounds: any = { x: inkAnnotation.bounds.x, y: (page.size[1] - (inkAnnotation.bounds.y + inkAnnotation.bounds.height)), width: inkAnnotation.bounds.width, height: inkAnnotation.bounds.height}
            inkAnnotation.bounds = bounds;
            inkAnnotation.border.width = 0;
            inkAnnotation.color = inkAnnotation.color;
            linePoints = [];
            if (rotationAngle !== 0) {
                let pathCollection: any[] = [];
                for (var t = isNewValues; t < stampObjects.length; t++) {
                    const value = stampObjects[parseInt(t.toString(), 10)];
                    let path: any = value.command.toString();
                    if (path === "M" && t !== isNewValues) {
                        pathCollection.push(linePoints);
                        linePoints = [];
                    }
                    linePoints.push(parseFloat(value.x));
                    linePoints.push(parseFloat(value.y));
                }
                if (linePoints.length > 0) {
                    pathCollection.push(linePoints);
                }
                for (let w = 0; w < pathCollection.length; w++) {
                    let pointsCollections: any = pathCollection[parseInt(w.toString(), 10)];
                    linePoints = [];
                    if (pointsCollections.length > 0) {
                        for (let z = 0; z < stampObjects.length; z++) {
                            const value = stampObjects[parseInt(z.toString(), 10)];
                            linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                            linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - ((parseFloat(value.y) - minimumY) / newDifferenceY) - top);
                        }
                        inkAnnotation.inkPointsCollection.push(linePoints)
                    }
                    linePoints = [];
                }
            } else {
                for (let r = 0; r < stampObjects.length; r++) {
                    const value = stampObjects[parseInt(r.toString(), 10)];
                    let path: any = value.command.toString();

                    if (path == "M" && r !== 0) {
                        inkAnnotation.inkPointsCollection.push(linePoints);
                        linePoints = [];

                    }
                    linePoints.push(((parseFloat(value.x) - minimumX) / newDifferenceX) + left);
                    let newX = ((parseFloat(value.y) - minimumY) / newDifferenceY);
                    linePoints.push(this.formFieldLoadedDocument.getPage(pageNumber).size[1] - newX - top);
                }
                if (linePoints.length > 0) {
                    inkAnnotation.inkPointsCollection.push(linePoints)
                }
            }
            inkAnnotation._dictionary.set("T", currentFieldName);
            inkAnnotation.setAppearance(true);
            this.formFieldLoadedDocument.getPage(pageNumber).annotations.add(inkAnnotation);
        }
    }

    private addSigntureFieldItems(field: PdfField) {
        let page: PdfPage = field.page;
        if (field instanceof PdfSignatureField) {
            let signatureField: PdfSignatureField = field as PdfSignatureField;
            if (signatureField.itemsCount > 0) {
                for (let i = 0; i < signatureField.itemsCount; i++) {
                    if (!isNullOrUndefined(signatureField.itemAt(i).page)) {
                        let item: PdfPage = signatureField.itemAt(i).page;
                        let j: number = 0;
                        for (let k = 0; k < this.formFieldLoadedDocument.pageCount; k++) {
                            if (item == this.formFieldLoadedDocument.getPage(j)) {
                                break;
                            }
                            j++;
                        }
                        this.addSignatureField(signatureField, j, signatureField.itemAt(i).bounds)
                    }
                }
            }
        }
    }

    private addSignatureField(signatureField: PdfSignatureField, index: number, bounds: any) {
        let formFields: PdfRenderedFields = new PdfRenderedFields();
        formFields.Name = "SignatureField";
        formFields.ToolTip = signatureField.toolTip;
        formFields.FieldName = signatureField.name.replace(/[^0-9a-zA-Z]+/g, "");
        formFields.ActualFieldName = signatureField.name;
        if (!bounds.IsEmpty) {
            formFields.LineBounds = { X: bounds.x, Y: bounds.y, Width: bounds.width, Height: bounds.height };
        }
        else {
            formFields.LineBounds = { X: signatureField.bounds.x, Y: signatureField.bounds.y, Width: signatureField.bounds.width, Height: signatureField.bounds.height };
        }
        formFields.PageIndex = index;
        formFields.TabIndex = signatureField.tabIndex;
        formFields.BorderWidth = signatureField.border.width;
        formFields.BorderStyle = signatureField.border.style;
        formFields.IsReadonly = signatureField.readOnly;
        formFields.IsRequired = signatureField.required;
        formFields.Visible = signatureField.visibility
        formFields.IsSignatureField = true;
        formFields.Rotation = signatureField.rotationAngle;
        formFields.RotationAngle = this.GetRotateAngle(signatureField.page.rotation);
        let initialField = signatureField._dictionary.get("InitialField");
        if (!isNullOrUndefined(initialField)) {
            formFields.IsInitialField = initialField;
        }
        this.PdfRenderedFormFields.push(formFields);
    } 

    private retrieveInkAnnotation(loadedDocument: any) {
        let count: number = 1;
        for (let i = 0; i < loadedDocument.pageCount; i++) {
            let loadedPage: PdfPage = loadedDocument.getPage(i);
            const oldPageAnnotations: PdfAnnotationCollection = loadedPage.annotations;
            const totalAnnotation: number = parseInt(oldPageAnnotations.count.toString(), 10);
            for (let j = 0; j < totalAnnotation; j++) {
                const annotation: PdfAnnotation = oldPageAnnotations.at(j);
                if (annotation instanceof PdfInkAnnotation) {
                    let outputstring: string = "";
                    let inkAnnot: PdfInkAnnotation = annotation as PdfInkAnnotation;
                    let inkListX: any = [];
                    let inkListY: any = [];
                    if (inkAnnot._dictionary.has("T") && !inkAnnot._dictionary.has("NM")) {
                        let annotColor = inkAnnot.color;
                        if (!isNullOrUndefined(inkAnnot.inkPointsCollection)) {
                            for (let m = 0; m < inkAnnot.inkPointsCollection.length; m++) {
                                let inkList = inkAnnot.inkPointsCollection[parseInt(m.toString(), 10)];
                                for (let k = 0; k < inkList.length; k += 2) {
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
                                    if (k == 0) {
                                        outputstring += "M" + x + "," + y + " ";
                                    } else {
                                        outputstring += "L" + x + "," + y + " ";
                                    }
                                    inkListX.push(x);
                                    inkListY.push(y)
                                }
                            }
                        }
                        let formFields: PdfRenderedFields = new PdfRenderedFields();
                        if(inkAnnot._dictionary.has("T")){
                           formFields.FieldName = inkAnnot._dictionary.get("T");
                        }
                        formFields.FieldName = formFields.FieldName + "_"+ count;
                        formFields.Name = "ink";
                        let rotationAngle: number = loadedPage.rotation;
                        let isFieldRotated: boolean = false;
                        if(annotation.rotationAngle !== 0){
                            isFieldRotated = true
                        }
                        let bounds: any = {X:inkAnnot.bounds.x, Y: inkAnnot.bounds.y, Width: inkAnnot.bounds.width, Height: inkAnnot.bounds.height}
                        formFields.LineBounds = this.getBounds(bounds, loadedPage.size[1], loadedPage.size[0], rotationAngle, !isFieldRotated);
                        formFields.Value = outputstring;
                        formFields.PageIndex = i;
                        formFields.BorderColor = [inkAnnot.color[0], inkAnnot.color[1], inkAnnot.color[2]];
                        formFields.Rotation = annotation.rotationAngle;
                        this.PdfRenderedFormFields.push(formFields);
                        count++;
                    }
                }else if(annotation instanceof PdfFreeTextAnnotation){
                    let inkAnnot: PdfFreeTextAnnotation = annotation as PdfFreeTextAnnotation;
                    if(inkAnnot._dictionary.has("T") && ! inkAnnot._dictionary.has("NM") && ! inkAnnot._dictionary.has("M")){
                        let formFields: PdfRenderedFields = new PdfRenderedFields();
                        formFields.FieldName = inkAnnot._dictionary.get("T") + "_" + count;
                        let bounds: any = {X:inkAnnot.bounds.x, Y: inkAnnot.bounds.y, Width: inkAnnot.bounds.width, Height: inkAnnot.bounds.height}
                        formFields.LineBounds = bounds;
                        formFields.Name = "SignatureText";
                        formFields.FontFamily = this.getFontFamilyString((inkAnnot.font as PdfStandardFont)._fontFamily);
                        formFields.FontSize = this.convertPointtoPixel(inkAnnot.font.size);
                        formFields.Value = inkAnnot.text;
                        formFields.PageIndex = i;
                        formFields.BorderColor = inkAnnot.borderColor;
                        this.PdfRenderedFormFields.push(formFields);
                        count ++;
                    }
                } else if (annotation instanceof PdfRubberStampAnnotation) {
                    let stampAnnotation: PdfRubberStampAnnotation = annotation as PdfRubberStampAnnotation;
                    if (stampAnnotation._dictionary.has("T") && !stampAnnotation._dictionary.has("NM") && !stampAnnotation._dictionary.has("M")) {
                        let formFields: PdfRenderedFields = new PdfRenderedFields();
                        formFields.FieldName = stampAnnotation._dictionary.get("T") + "_" + count;
                        let dictionary: any = annotation._dictionary.get("AP");
                        let pageRender: PageRenderer = new PageRenderer(this.pdfViewer, this.pdfViewerBase);
                        if (isNullOrUndefined(dictionary)) {
                            let pdfReference: any = annotation._dictionary.get("AP");
                            if (!isNullOrUndefined(pdfReference) && !isNullOrUndefined(pdfReference.dictionary as _PdfDictionary) && pdfReference.dictionary.has("N")) {
                                let ap_Dictionary: _PdfDictionary = pdfReference.dictionary as _PdfDictionary;
                                if (!isNullOrUndefined(ap_Dictionary)) {
                                    pageRender.findStampImage(annotation);
                                }
                            }
                        } else if (dictionary.has("N")) {
                            pageRender.findStampImage(annotation);
                        }
                        formFields.LineBounds = { X: stampAnnotation.bounds.x, Y: stampAnnotation.bounds.y, Width: stampAnnotation.bounds.width, Height: stampAnnotation.bounds.height };
                        formFields.Value = pageRender.Imagedata;
                        formFields.Name = "SignatureImage";
                        formFields.PageIndex = i;
                        this.PdfRenderedFormFields.push(formFields);
                        count++;
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
                return 'TimesRoman';
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
        this.FieldName = null;
        this.Font = null;
        this.FontFamily = null;
        this.FontSize = 0;
        this.FontStyle = 0;
        this.GroupName = null;
        this.InsertSpaces = false;
        this.IsAutoSize = false,
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
    }
}