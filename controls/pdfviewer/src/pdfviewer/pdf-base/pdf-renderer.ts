import { PageRenderer, FormFieldsBase, AnnotationRenderer, PdfRenderedFields, SignatureBase, BookmarkStyles, BookmarkDestination, BookmarkBase, AnnotBounds } from './index';
import { Browser, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataFormat, PdfAnnotationExportSettings, PdfBookmark, PdfBookmarkBase, PdfDocument, PdfPage, PdfRotationAngle, PdfTextStyle, PdfDocumentLinkAnnotation, PdfTextWebLinkAnnotation, PdfUriAnnotation, PdfDestination, PdfPermissionFlag,PdfFormFieldExportSettings,_bytesToString, _encode, PdfPageSettings } from '@syncfusion/ej2-pdf';
import { PdfViewer, PdfViewerBase } from '../index';
import { Rect, Size } from '@syncfusion/ej2-drawings';

/**
 * PdfRenderer
 *
 * @hidden
 */
export class PdfRenderer {
    /**
     * @private
     **/
    public loadedDocument: PdfDocument;
    private pageCount: number;
    /**
     * @private
     **/
    public bookmarkStyles: BookmarkStyles[] = [];
    /**
     * @private
     **/
    public bookmarkCollection: BookmarkBase[] = [];
    /**
     * @private
     **/
    public pageRotationCollection: number[] = [];
    /**
     * @private
     **/
    public bookmarkDictionary: { [key: string]: BookmarkDestination } = {};
    renderer: PageRenderer;
    m_formFields: FormFieldsBase;
    m_Signature: SignatureBase;
    m_annotationRenderer: AnnotationRenderer;
    private annotationDetailCollection: { [key: string]: Annotations; } = {};
    pageSizes: { [key: string]: Size; } = {};
    private m_zoomFactor: number;
    private m_isCompletePageSizeNotReceieved: boolean = true;
    m_hashID: string;
    private x: number = 0;
    private y: number = 0;
    private zoom: number = 1;
    private id: number = 0;
    private pageIndex: number = 0;
    private scaleFactor: number = 1.5;
    private static IsLinuxOS: boolean = false;
    private static IsWindowsOS: boolean = false;
    private restrictionList: string[] = [];
    private securityList: string[] =  [ 'Print', 'EditContent', 'CopyContent', 'EditAnnotations', 'FillFields', 'AccessibilityCopyContent', 'AssembleDocument', 'FullQualityPrint' ];
    private _fallbackFontCollection: { [key: string]: any; } = {};
    /**
     * @private
     */
    public get PageCount(): number {
        return this.pageCount;
    }
    private m_referencePath: string;
    /**
     * @private
     */
    public get ReferencePath(): string {
        return this.m_referencePath;
    }
    /**
     * @private
     */
    public set referencePath(v: string) {
        this.m_referencePath = v;
    }
    /**
     * @private
     */
    public get ScaleFactor(): number {
        return this.scaleFactor;
    }
    /**
     * @private
     */
    public set ScaleFactor(v: number) {
        this.scaleFactor = v;
        if (this.scaleFactor <= 0) {
            this.scaleFactor = 1;
        }
    }
    /**
     * @private
     */
    public get FallbackFontCollection(): { [key: string]: any; } {
        return this._fallbackFontCollection;
        ;
    }
    /**
     * @private
     */
    public set FallbackFontCollection(v: { [key: string]: any; }) {
        this._fallbackFontCollection = v;
    }
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private digitialByteArray: Uint8Array;
    private loadedBase64String: string;
    private password: string;
    private isDummyInserted: boolean = false;


    /**
     * @param {PdfViewer} pdfViewer - The PdfViewer.
     * @param {PdfViewerBase} pdfViewerBase - The PdfViewerBase.
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @private
     */
    public load(documentData: string, documentId: string, password: string, jsonObject: any): string {
        try {
            if (jsonObject.action !== "VirtualLoad") {
            this.loadedDocument = new PdfDocument(documentData, password ? password : '');
                this.loadedBase64String = documentData;
                this.password = password;
                this.m_isCompletePageSizeNotReceieved = true;
        }
        }
        catch (error) {
            if(error.message === 'Invalid PDF structure.') {
                return '3';
            }
            else if(error.message === 'Cannot open an encrypted document. The password is invalid.') {
                return '4';
            }
            else if(error.message === 'Invalid cross reference') {
                return '4';
            }
            else{
                return error.message;
            }
        }
        const jsonResult: object = this.loadDocument(documentData, documentId, password, jsonObject);
        this.bookmarkStyles = [];
        this.bookmarkCollection = [];
        this.bookmarkDictionary = {};
        return JSON.stringify(jsonResult);
    }

    /**
     * @private
     */
    public loadDocument(documentData: string, documentId: string, password: string, jsonObject: any): object {
        if(jsonObject.hasOwnProperty("isCompletePageSizeNotReceived")){
            this.m_isCompletePageSizeNotReceieved = !jsonObject.isCompletePageSizeNotReceived;
        }
        this.pageCount = this.loadedDocument.pageCount;
        this.pageSizes = this.getPageSizes(this.pageCount);
        let pdfRenderedFormFields: PdfRenderedFields[] = [];
        let isDigitalSignaturePresent: boolean = false;
        let isTaggedPdf: boolean = false; //Need to check and set if loaddocument is tagged pdf
        this.m_formFields = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase, isDigitalSignaturePresent);
        this.restrictionList = [];
        if (!isNullOrUndefined(this.loadedDocument)) {
            this.documentSecurity(password);
        }
        if(!isNullOrUndefined(this.loadedDocument)){
            if(jsonObject.hasOwnProperty("hideEmptyDigitalSignatureFields")){
               this.m_formFields.hideEmptyDigitalSignatureFields = jsonObject["hideEmptyDigitalSignatureFields"];
            }
            if(jsonObject.hasOwnProperty("showDigitalSignatureAppearance")){
                this.m_formFields.showDigitalSignatureAppearance = jsonObject["showDigitalSignatureAppearance"];
            }
        }
        if (!isNullOrUndefined(this.m_formFields) && this.pageSizes && Object.keys(this.pageSizes).length <=100) {
            this.m_formFields.GetFormFields();
            pdfRenderedFormFields = this.m_formFields.PdfRenderedFormFields;
        }
        if(this.m_formFields.m_isDigitalSignaturePresent){
            this.digitialByteArray = this.loadedDocument.save();
       }
        // eslint-disable-next-line max-len
        return { pageCount: this.pageCount, pageSizes: this.pageSizes, uniqueId: documentId, PdfRenderedFormFields: pdfRenderedFormFields, RestrictionSummary : this.restrictionList, documentData: documentData, isDigitalSignaturePresent : this.m_formFields.m_isDigitalSignaturePresent, digitialSignatureFile: this.digitialByteArray? _encode(this.digitialByteArray): "", isTaggedPdf: isTaggedPdf, pageRotation: this.pageRotationCollection };
    }

    private documentSecurity(password: string): void {
        // eslint-disable-next-line max-len
        const isOwnerPassword: boolean = this.loadedDocument.isEncrypted && (!this.loadedDocument.isUserPassword  || this.loadedDocument._hasUserPasswordOnly);
        if (!isNullOrUndefined(password) && password !== '' && isOwnerPassword) {
            this.restrictionSummary( password, true);
        }
        else {
            this.restrictionSummary(password, false);
        }
    }

    private restrictionSummary(password: string, isOwner: boolean): void{
        const ownerPassword: string = password ? password : ''; //Need to set owner password from loaded document
        const userPassword: string = password ? password : ''; //Need to set user password from loaded document
        const permissionList: string[] = this.getPermissionArray(this.loadedDocument.permissions);
        const isEncrypted: boolean = this.loadedDocument.isEncrypted;
        if ((!(permissionList.length === 1 && permissionList[0] === 'Default')) || (isEncrypted && ownerPassword === '' && userPassword === '')){
            for (let i: number = 0; i < this.securityList.length; i++){
                let isExist: boolean = false;
                for (let j: number = 0; j < permissionList.length; j++){
                    if (permissionList[parseInt(j.toString(), 10)].trim() === this.securityList[parseInt(i.toString(), 10)].trim()){
                        isExist = true;
                        break;
                    }
                }
                if (!isExist && !isOwner){
                    this.restrictionList.push(this.securityList[parseInt(i.toString(), 10)].trim());
                }
            }
        }
        else if (permissionList.length === 1 && permissionList[0] === 'Default' && isEncrypted && !isOwner){
            for (let i: number = 0; i < this.securityList.length; i++){
                this.restrictionList.push(this.securityList[parseInt(i.toString(), 10)].trim());
            }
        }
    }

    private getPermissionArray(permission: PdfPermissionFlag): string[] {
        const permissionArray: string[] = [];
        const length: number = !isNullOrUndefined((permission as any).count) ? (permission as any).count : 1;
        for (let i: number = 0; i < length; i++) { 
            switch (permission) {
            case PdfPermissionFlag.fullQualityPrint:
                permissionArray.push('FullQualityPrint');
                break;
            case PdfPermissionFlag.assembleDocument:
                permissionArray.push('AssembleDocument');
                break;
            case PdfPermissionFlag.accessibilityCopyContent:
                permissionArray.push('AccessibilityCopyContent');
                break;
            case PdfPermissionFlag.fillFields:
                permissionArray.push('FillFields');
                break;
            case PdfPermissionFlag.editAnnotations:
                permissionArray.push('EditAnnotations');
                break;
            case PdfPermissionFlag.copyContent:
                permissionArray.push('CopyContent');
                break;
            case PdfPermissionFlag.editContent:
                permissionArray.push('EditContent');
                break;
            case PdfPermissionFlag.print:
                permissionArray.push('Print');
                break;
            case PdfPermissionFlag.default:
                permissionArray.push('Default');
                break;
            }
        }
        return permissionArray;
    }

    private getPageSizes(pageCount: number): { [key: string]: Size; } {
        const pageSizes: { [key: string]: Size } = {};
        let pageLimit: number = pageCount;
        if (pageCount > 100) {
            pageLimit = 100;
        }
        if (this.m_isCompletePageSizeNotReceieved) {
            for (let i: number = 0; i < pageLimit; i++) {
                pageSizes[i.toString()] = this.getPageSize(i);
                let page: PdfPage = this.loadedDocument.getPage(i);
                let rotation : PdfRotationAngle = page.rotation % 4;
                this.pageRotationCollection.push(rotation);
            }
        }
        else {
            for (let i: number = pageLimit; i < pageCount; i++) {
                pageSizes[i.toString()] = this.getPageSize(i);
                let page: PdfPage = this.loadedDocument.getPage(i);
                let rotation : PdfRotationAngle = page.rotation % 4;
                this.pageRotationCollection.push(rotation);
            }
        }
        return pageSizes;
    }

    /**
     * @private
     */
    public getPageSize(pageNumber: number): Size {
        const page: PdfPage = this.loadedDocument.getPage(pageNumber);
        const size: number[] = page.size;
        const rotation : PdfRotationAngle = page.rotation % 4;
        // eslint-disable-next-line max-len
        if (rotation === PdfRotationAngle.angle0 || rotation === PdfRotationAngle.angle180) {
            return new Size(this.convertPointToPixel(size[0]), this.convertPointToPixel(size[1]));
        } else {
            return new Size(this.convertPointToPixel(size[1]), this.convertPointToPixel(size[0]));
        }
    }

    private convertPointToPixel(number: number): number {
        return number * 96 / 72;
    }

    private convertPixelToPoint(value: number): number {
        return (value * (72 / 96));
    }

    /**
     * @private
     */
    public getDocumentAsBase64(jsonObject: { [key: string]: string }): string {
        const base64string: string = null;
        this.loadedDocument = new PdfDocument(this.loadedBase64String, this.password);
        if (jsonObject.hasOwnProperty('digitalSignatureDocumentEdited') && !jsonObject.digitalSignatureDocumentEdited) {
            return "data:application/pdf;base64," + _encode(this.loadedDocument.save());
        }
        else {
            this.deletePdfPages(jsonObject);
            this.insertPdfPages(jsonObject);
            this.rotatePages(jsonObject);
            if (this.isDummyInserted) {
                this.loadedDocument.removePage(this.loadedDocument.pageCount - 1);
                this.isDummyInserted = false;
            }
            const annotationRenderer: AnnotationRenderer = new AnnotationRenderer(this.pdfViewer, this.pdfViewerBase);
            const formfields: FormFieldsBase = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase);
            const signatureModule: SignatureBase = new SignatureBase(this.pdfViewer, this.pdfViewerBase);
            // create object for form fields signature
            annotationRenderer.removeSignatureTypeAnnot(jsonObject, this.loadedDocument);
            this.orderAnnotations(jsonObject);
            return "data:application/pdf;base64," + _encode(this.loadedDocument.save());
        }
    }

    private rotatePages(jsonObject: { [key: string]: string }): void {
        if (jsonObject.hasOwnProperty('organizePages')) {
            let organizePages: any = JSON.parse(jsonObject.organizePages);
            for (let i: number = 0; i < organizePages.length; i++) {
                let pageNumber: number = organizePages[parseInt(i.toString(), 10)].pageIndex;
                let currentPageNumber: number = organizePages[parseInt(i.toString(), 10)].currentPageIndex;
                let isDeleted: boolean = organizePages[parseInt(i.toString(), 10)].isDeleted;
                let isInserted: boolean = organizePages[parseInt(i.toString(), 10)].isInserted;
                let rotation: number = organizePages[parseInt(i.toString(), 10)].rotateAngle;
                if (!isNullOrUndefined(currentPageNumber) && !isNullOrUndefined(rotation) && !isDeleted && !isInserted && pageNumber !== -1) {
                    let page: PdfPage = this.loadedDocument.getPage(currentPageNumber);
                    page.rotation = this.getPdfRotationAngle(rotation);
                }
            }
        }
    }
    private insertPdfPages(jsonObject: { [key: string]: string }): void {
        if (jsonObject.hasOwnProperty('organizePages')) {
            let organizePages: any = JSON.parse(jsonObject.organizePages);
            for (let i: number = 0; i < organizePages.length; i++) {
                let pageNumber: number = organizePages[parseInt(i.toString(), 10)].pageIndex;
                let currentPageNumber: number = organizePages[parseInt(i.toString(), 10)].currentPageIndex;
                let isDeleted: boolean = organizePages[parseInt(i.toString(), 10)].isDeleted;
                let isInserted: boolean = organizePages[parseInt(i.toString(), 10)].isInserted;
                let pageSize: number[];
                if(!isNullOrUndefined(organizePages[parseInt(i.toString(), 10)].pageSize)){
                    pageSize = [this.convertPixelToPoint(organizePages[parseInt(i.toString(), 10)].pageSize.width), this.convertPixelToPoint(organizePages[parseInt(i.toString(), 10)].pageSize.height)];
                }
                if (!isNullOrUndefined(currentPageNumber) && !isDeleted && isInserted && pageNumber === -1) {
                    let rotation: number = organizePages[parseInt(i.toString(), 10)].rotateAngle;
                    let pageSettings: PdfPageSettings = new PdfPageSettings();
                    pageSettings.rotation = this.getPdfRotationAngle(rotation);
                    if(!isNullOrUndefined(pageSize)){
                        pageSettings.size = pageSize;
                    }
                    this.loadedDocument.addPage(currentPageNumber, pageSettings);
                }
            }
        }
    }
    private deletePdfPages(jsonObject: { [key: string]: string }): void {
        if (jsonObject.hasOwnProperty('organizePages')) {
            let organizePages: any = JSON.parse(jsonObject.organizePages);
            let deleteCount = 0;
            const initialPageCount: number = this.loadedDocument.pageCount;
            for (let i: number = 0; i < organizePages.length; i++) {
                let pageNumber: number = organizePages[parseInt(i.toString(), 10)].pageIndex;
                let isDeleted: boolean = organizePages[parseInt(i.toString(), 10)].isDeleted;
                let isInserted: boolean = organizePages[parseInt(i.toString(), 10)].isInserted;
                if (!isNullOrUndefined(pageNumber) && isDeleted && !isInserted) {
                    if (deleteCount + 1 === initialPageCount) {
                        this.loadedDocument.addPage();
                        this.isDummyInserted = true;
                    }
                    this.loadedDocument.removePage(pageNumber - deleteCount);
                    deleteCount++;
                }
            }
        }
    }

    private getPdfRotationAngle(rotation: number): PdfRotationAngle {
        switch (rotation) {
            case 0:
                return PdfRotationAngle.angle0;
            case 90:
                return PdfRotationAngle.angle90;
            case 180:
                return PdfRotationAngle.angle180;
            case 270:
                return PdfRotationAngle.angle270;
            default:
                return PdfRotationAngle.angle0;
        }
    }

    /**
     * @private
     */
    public importAnnotations(jsonObject: any): any {
        try {
            const annotationRenderer: AnnotationRenderer = new AnnotationRenderer(this.pdfViewer, this.pdfViewerBase);
            let annotData: string = jsonObject['importedData'];
            annotationRenderer.removeSignatureTypeAnnot(jsonObject, this.loadedDocument);
            const annotationDataFormat = jsonObject['annotationDataFormat'];
            if (typeof annotationDataFormat === 'string') {
                this.loadedDocument._allowImportCustomData = true;
                switch (annotationDataFormat.toLowerCase()) {
                case 'json':
                    this.loadedDocument.importAnnotations(annotData, DataFormat.json);
                    break;
                case 'xfdf':
                    this.loadedDocument.importAnnotations(annotData, DataFormat.xfdf);
                    break;
                default:
                    break;
                }
                for (let i: number = 0; i < this.loadedDocument.pageCount; i++) {
                    let pageNumber: number = i;
                    let pageSize: Size = this.getPageSize(pageNumber);
                    let renderer: PageRenderer = new PageRenderer(this.pdfViewer, this.pdfViewerBase);
                    renderer.exportAnnotationComments(pageNumber, pageSize);
                    this.annotationDetailCollection[i.toString()] = new Annotations();
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].textMarkupAnnotation = renderer.textMarkupAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].shapeAnnotation = renderer.shapeAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].measureShapeAnnotation = renderer.measureAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].stampAnnotations = renderer.rubberStampAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].stickyNotesAnnotation = renderer.stickyAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].freeTextAnnotation = renderer.freeTextAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].signatureAnnotation = renderer.signatureAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].signatureInkAnnotation = renderer.signatureInkAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].annotationOrder = renderer.annotationOrder;
                    this.removeAnnotationsFromCollection(renderer);
                }
                let returnAnnot = JSON.parse(JSON.stringify(this.annotationDetailCollection))
                if (jsonObject.hasOwnProperty('uniqueId')) {
                    return { pdfAnnotation: returnAnnot, uniqueId: jsonObject['uniqueId'] }
                }
                else {
                    return { pdfAnnotation: returnAnnot }
                }
            }
        }
        catch (e) {
            return e.message;
        }
    }    

    private removeAnnotationsFromCollection(renderer: PageRenderer) {
        renderer.textMarkupAnnotationList = [];
        renderer.shapeAnnotationList = [];
        renderer.measureAnnotationList = [];
        renderer.rubberStampAnnotationList = [];
        renderer.stickyAnnotationList = [];
        renderer.freeTextAnnotationList = [];
        renderer.signatureAnnotationList = [];
        renderer.signatureInkAnnotationList = [];
        renderer.annotationOrder = [];
    }

    /**
     * @private
     */
    public exportAnnotation(jsonObject: { [key: string]: string }, isObject: boolean): string {
        const annotationRenderer: AnnotationRenderer = new AnnotationRenderer(this.pdfViewer, this.pdfViewerBase);
        annotationRenderer.removeSignatureTypeAnnot(jsonObject, this.loadedDocument);
        this.orderAnnotations(jsonObject);
        let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
        const annotationDataFormat = jsonObject['annotationDataFormat'];
        let fileName: string;
        let exportObject: Uint8Array;
        if (typeof annotationDataFormat === 'string') {
            switch (annotationDataFormat.toLowerCase()) {
                case 'json':
                    settings.dataFormat = DataFormat.json;
                    if (isObject) {
                        settings.exportAppearance = isObject;
                        exportObject = this.loadedDocument.exportAnnotations(settings);
                        return "data:application/json;base64," + _encode(this.loadedDocument.exportAnnotations(settings));
                    } else {
                        fileName = this.changeFileExtension(this.pdfViewer.fileName, 'json');
                        return "data:application/json;base64," + _encode(this.loadedDocument.exportAnnotations(settings));
                    }
                case 'xfdf':
                    settings.dataFormat = DataFormat.xfdf;
                    if (isObject) {
                        settings.exportAppearance = isObject;
                        exportObject = this.loadedDocument.exportAnnotations(settings);
                        return "data:application/json;base64," + _encode(this.loadedDocument.exportAnnotations(settings));

                    } else {
                        fileName = this.changeFileExtension(this.pdfViewer.fileName, 'xfdf');
                        return "data:application/json;base64," + _encode(this.loadedDocument.exportAnnotations(settings));
                    }
                // Add more cases for other supported formats as needed
                default:
                    break;
            }
        }
        return '';

    }

    private  changeFileExtension(filename: string, newExtension: string): string {
        const lastDotIndex = filename.lastIndexOf('.');

        if (lastDotIndex === -1) {
            // No extension found in the filename
            return filename + '.' + newExtension;
        }

        const nameWithoutExtension = filename.slice(0, lastDotIndex);
        return nameWithoutExtension + '.' + newExtension;
    }

    private orderAnnotations(jsonObject: { [key: string]: string }) {

        const annotationRenderer: AnnotationRenderer = new AnnotationRenderer(this.pdfViewer, this.pdfViewerBase);
        const formfields: FormFieldsBase = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase);
        const signatureModule: SignatureBase = new SignatureBase(this.pdfViewer, this.pdfViewerBase);

        if (jsonObject.hasOwnProperty('isAnnotationsExist') && jsonObject.isAnnotationsExist) {
            if (jsonObject.hasOwnProperty('annotationCollection')) {
                const annotationDetails: any = JSON.parse(jsonObject.annotationCollection);
                const count: number = annotationDetails.length;
                for (let i: number = 0; i < count; i++) {
                    let annotationType = annotationDetails[parseInt(i.toString(), 10)].shapeAnnotationType;
                    let details = annotationDetails[parseInt(i.toString(), 10)];
                    if (details.hasOwnProperty('calibrate') && (details['shapeAnnotationType'] === 'Circle' || details['shapeAnnotationType'] === 'Line' || details['shapeAnnotationType'] === 'Polygon' || details['shapeAnnotationType'] === 'Polyline')) {
                        annotationType = 'measureShapes';
                    }
                    else if (!(details.hasOwnProperty('calibrate')) && (details['shapeAnnotationType'] === 'Line' || details['shapeAnnotationType'] === 'Circle' || details['shapeAnnotationType'] === 'Polygon' || details['shapeAnnotationType'] === 'Square')) {
                        annotationType = 'shapeAnnotation';
                    }
                    switch (annotationType) {
                    case 'textMarkup':
                    if (jsonObject.hasOwnProperty('textMarkupAnnotations')) {
                        const textMarkupDetails: any = JSON.parse(jsonObject.textMarkupAnnotations);
                        const pageNumber: string = details['pageNumber'].toString();
                        const annotationCount: { [key: string]: object } = textMarkupDetails[parseInt(pageNumber, 10)];
                        const pageAnnotations: any = annotationCount;
                        const textMarkup: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                        if (textMarkup) {
                            details = textMarkup;
                            annotationRenderer.addTextMarkup(details, this.loadedDocument);
                        }
                    }
                    break;
                    case 'shapeAnnotation':
                        if (jsonObject.hasOwnProperty('shapeAnnotations')) {
                            const shapeDetails: any = JSON.parse(jsonObject.shapeAnnotations);
                            const pageNumber: string = details['pageNumber'].toString();
                            const annotationCount: { [key: string]: object } = shapeDetails[parseInt(pageNumber, 10)];
                            const pageAnnotations: any = annotationCount;
                            const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                            const shape: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                            if (shape) {
                                details = shape;
                                annotationRenderer.addShape(details, page);
                            }
                        }
                        break;

                    case 'stamp':
                        if (jsonObject.hasOwnProperty('stampAnnotations')) {
                            const stampdetails: any = JSON.parse(jsonObject.stampAnnotations);
                            const pageNumber: string = details['pageNumber'].toString();
                            const annotationCount: { [key: string]: object } = stampdetails[parseInt(pageNumber, 10)];
                            const pageAnnotations: any = annotationCount;
                            const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                            const stamp: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                            if (stamp) {
                                details = stamp;
                                annotationRenderer.addCustomStampAnnotation(details, page);
                            }
                        }
                        break;

                    case 'measureShapes':
                        if (jsonObject.hasOwnProperty('measureShapeAnnotations')) {
                            const shapeDetails: any = JSON.parse(jsonObject.measureShapeAnnotations);
                            const pageNumber: string = details['pageNumber'].toString();
                            const annotationCount: { [key: string]: object } = shapeDetails[parseInt(pageNumber, 10)];
                            const pageAnnotations: any = annotationCount;
                            const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                            const shape: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                            if (shape) {
                                details = shape;
                                annotationRenderer.addMeasure(details, page);
                            }
                        }
                        break;

                    case 'sticky':
                        if (jsonObject.hasOwnProperty('stickyNotesAnnotation')) {
                            const shapeDetails: any = JSON.parse(jsonObject.stickyNotesAnnotation);
                            const pageNumber: string = details['pageNumber'].toString();
                            const annotationCount: { [key: string]: object } = shapeDetails[parseInt(pageNumber, 10)];
                            const pageAnnotations: any = annotationCount;
                            const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                            const shape: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                            if (shape) {
                                details = shape;
                                annotationRenderer.addStickyNotes(details, page);
                            }
                        }
                        break;
                    case "Ink":
                        if (jsonObject.hasOwnProperty('inkSignatureData')) {
                            const shapeDetails: any = JSON.parse(jsonObject.inkSignatureData);
                            const pageNumber: string = details['pageNumber'].toString();
                            const annotationCount: { [key: string]: object } = shapeDetails[parseInt(pageNumber, 10)];
                            const pageAnnotations: any = annotationCount;
                            const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                            const shape: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                            if (shape) {
                                details = shape;
                                annotationRenderer.saveInkSignature(details, page);
                            }
                        }
                        break;
                    case 'FreeText':
                        if(jsonObject.hasOwnProperty('freeTextAnnotation')) {
                            const freeTextDetails: any = JSON.parse(jsonObject.freeTextAnnotation);
                            const pageNumber: string = details['pageNumber'].toString();
                            const annotationCount: { [key: string]: object } = freeTextDetails[parseInt(pageNumber, 10)];
                            const pageAnnotations: any = annotationCount;
                            const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                            const freeText: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                            if (!isNullOrUndefined(freeText)) {
                                details = freeText;
                                    if(!isNullOrUndefined(this.FallbackFontCollection) && this.FallbackFontCollection.length !== 0) {
                                    annotationRenderer.addFreeText(details, page, this.FallbackFontCollection);
                                }
                                else{
                                    annotationRenderer.addFreeText(details, page);
                                }
                            }
                        }
                        break;
                    default:
                        break;
                    }
                }
                if (jsonObject.signatureData) {
                    if (jsonObject.isSignatureEdited) {
                        signatureModule.saveSignatureAsAnnotatation(jsonObject, this.loadedDocument);
                    }
                    else {
                        signatureModule.saveSignatureData(jsonObject, this.loadedDocument);
                    }
                }
            }
        }
        if (jsonObject.hasOwnProperty('isFormFieldAnnotationsExist') && jsonObject.isFormFieldAnnotationsExist) {
            if (jsonObject.hasOwnProperty('formDesigner')) {
                formfields.saveFormFieldsDesignerData(jsonObject);
            }
            else if (jsonObject.hasOwnProperty('fieldsData')) {
                formfields.saveFormFieldsData(jsonObject);
            }
        }
    }

    /**
     * @private
     */
    public getAnnotationComments(jsonObject: any): any {
        try {
            let loadedDocument: PdfDocument = this.loadedDocument;
            if (jsonObject.hasOwnProperty('pageStartIndex') && !isNullOrUndefined(jsonObject.pageStartIndex)) {
                const pageStartIndex: number = parseInt(jsonObject.pageStartIndex, 10);
                const pageEndIndex: number = parseInt(jsonObject.pageEndIndex, 10);
                const annotationDetails : { [key: string]: object } = {};
                for (let i: number = pageStartIndex; i < pageEndIndex; i++) {
                    const pageNumber: number = i;
                    let pageSize: Size = this.getPageSize(pageNumber);
                    this.renderer = new PageRenderer(this.pdfViewer, this.pdfViewerBase);
                    annotationDetails[pageNumber.toString()] = this.renderer.exportAnnotationComments(pageNumber, pageSize);
                }
                // eslint-disable-next-line max-len
                return {uniqueId: jsonObject.uniqueId , annotationDetails: annotationDetails , startPageIndex: pageStartIndex, endPageIndex: pageEndIndex, isAnnotationPresent: this.renderer.isAnnotationPresent};
            }
            return '';

        } catch (error) {
            return error.message;
        }
    }

    /**
     * @private
     */
    public getBookmarks(jsonObject: any): any {
        try {
            const bookmark: PdfBookmarkBase = this.loadedDocument.bookmarks;
            if (!isNullOrUndefined(bookmark) && jsonObject.hasOwnProperty('bookmarkStyles')) {
                for (let i: number = 0; i < bookmark.count; i++) {
                    this.retrieveFontStyles(bookmark.at(i), false);
                }
            }

            // eslint-disable-next-line max-len
            if (isNullOrUndefined(bookmark) || isNullOrUndefined(bookmark.count) || bookmark.count === 0 ) {
                return null;
            }
            else{
                for(let i:number=0; i < bookmark.count; i++){
                    let pdfLoadedBookmark: PdfBookmark = bookmark.at(i);
                    const parentBookmarkDestination: BookmarkDestination = new BookmarkDestination();
                    // eslint-disable-next-line max-len
                    let bookmarkDestination: PdfDestination = pdfLoadedBookmark.destination ? pdfLoadedBookmark.destination : pdfLoadedBookmark.namedDestination ? pdfLoadedBookmark.namedDestination.destination ? pdfLoadedBookmark.namedDestination.destination : null : null;
                    // eslint-disable-next-line max-len
                    parentBookmarkDestination.X = !isNullOrUndefined(bookmarkDestination) ? bookmarkDestination.location[0] : 0;
                    // eslint-disable-next-line max-len
                    parentBookmarkDestination.PageIndex = !isNullOrUndefined(bookmarkDestination) ? bookmarkDestination.pageIndex : 0;
                    // eslint-disable-next-line max-len
                    parentBookmarkDestination.Zoom = !isNullOrUndefined(bookmarkDestination) ? bookmarkDestination.zoom : 0;

                    // eslint-disable-next-line max-len
                    const  parentBookmark: BookmarkBase = new BookmarkBase();
                    parentBookmark.Id = ++this.id;
                    parentBookmark.Title = pdfLoadedBookmark.title;
                    parentBookmark.Child = [];
                    parentBookmark.FileName = !isNullOrUndefined((pdfLoadedBookmark as any).action) ? (pdfLoadedBookmark as any).action.toString() : '';

                    if (!isNullOrUndefined(bookmarkDestination)){
                        if (bookmarkDestination.page.rotation === PdfRotationAngle.angle90){
                        // eslint-disable-next-line max-len
                            parentBookmarkDestination.Y =  this.convertPointToPixel(bookmarkDestination.page.size[0]) - this.convertPointToPixel(Math.abs(bookmarkDestination.location[1]));
                        }
                        else if (bookmarkDestination.page.rotation === PdfRotationAngle.angle270){
                            parentBookmarkDestination.Y = this.convertPointToPixel(Math.abs(bookmarkDestination.location[1]));
                        }
                        else{
                            // eslint-disable-next-line max-len
                            parentBookmarkDestination.Y = this.convertPointToPixel(bookmarkDestination.page.size[1]) - this.convertPointToPixel(Math.abs(bookmarkDestination.location[1]));
                        }
                    }
                    else {
                        parentBookmarkDestination.Y = 0;
                    }
                    this.bookmarkDictionary[this.id.toString()] = parentBookmarkDestination;
                    parentBookmark.Child = this.getChildrenBookmark(pdfLoadedBookmark);
                    if (parentBookmark.Child.length > 0){
                        parentBookmark.HasChild = true;
                    }
                    this.bookmarkCollection.push(parentBookmark);
                }
            }
            if (jsonObject.hasOwnProperty('uniqueId')){
                return { Bookmarks : JSON.parse(JSON.stringify(this.bookmarkCollection)), BookmarksDestination : JSON.parse(JSON.stringify(this.bookmarkDictionary)), uniqueId : jsonObject['uniqueId'].toString(), Bookmarkstyles : JSON.parse(JSON.stringify(this.bookmarkStyles))};
            }
            else{
                // eslint-disable-next-line max-len
                return { Bookmarks : JSON.parse(JSON.stringify(this.bookmarkCollection)), BookmarksDestination : JSON.parse(JSON.stringify(this.bookmarkDictionary)), Bookmarkstyles : JSON.parse(JSON.stringify(this.bookmarkStyles))};
            }
        }
        catch (error) {
            return error.message;
        }
    }

    private retrieveFontStyles(listElement: PdfBookmarkBase, isChild: boolean): void {
        const currentElement: PdfBookmark = listElement as PdfBookmark;
        const currentStyles: BookmarkStyles = new BookmarkStyles();
        if (!isNullOrUndefined(currentElement)){
            if (!isNullOrUndefined(currentElement.color)){
                currentStyles.Color = 'rgba(' + currentElement.color[0] + ',' + currentElement.color[1] + ',' + currentElement.color[2] + ',' + 1 + ')';
            }
            currentStyles.FontStyle = this.getPdfTextStyleString(currentElement.textStyle);
            currentStyles.Text = currentElement.title;
            currentStyles.IsChild = isChild;
            this.bookmarkStyles.push(currentStyles);
            this.getChildrenStyles(listElement);
        }
    }

    private getPdfTextStyleString(textStyle: PdfTextStyle): string{
        switch (textStyle){
        case PdfTextStyle.bold:
            return 'Bold';
        case PdfTextStyle.italic:
            return 'Italic';
        case PdfTextStyle.regular:
            return 'Regular';
        default:
            return 'Regular';
        }
    }

    private getChildrenStyles(bookmarks: PdfBookmarkBase): void{
        for (let i: number = 0; i < bookmarks.count; i++){
            this.retrieveFontStyles(bookmarks.at(i), true);
        }
    }

    private getChildrenBookmark( pdfLoadedBookmark: PdfBookmark): BookmarkBase[]{
        const childBookmarkCollection: BookmarkBase[] = [];
        if (!isNullOrUndefined(pdfLoadedBookmark) && !isNullOrUndefined(pdfLoadedBookmark.count) && pdfLoadedBookmark.count > 0){
            for (let i: number = 0; i < pdfLoadedBookmark.count; i++){
                const child: PdfBookmark = pdfLoadedBookmark.at(i);
                // eslint-disable-next-line max-len
                let childBookmarkDestination: PdfDestination = child.destination ? child.destination : child.namedDestination ? child.namedDestination.destination ? child.namedDestination.destination : null : null;
                this.id++;
                const title: string = child.title;
                this.pageIndex = !isNullOrUndefined(childBookmarkDestination) ? childBookmarkDestination.pageIndex : 0;
                this.x = !isNullOrUndefined(childBookmarkDestination) ? childBookmarkDestination.location[0] : 0;
                const yPosition: number = !isNullOrUndefined(childBookmarkDestination) ? Math.abs(childBookmarkDestination.location[1]) : 0;
                if (!isNullOrUndefined(childBookmarkDestination)){
                    if (childBookmarkDestination.page.rotation === PdfRotationAngle.angle90){
                        this.y = this.convertPointToPixel(childBookmarkDestination.page.size[0]) - this.convertPointToPixel(yPosition);
                    }
                    else if (childBookmarkDestination.page.rotation === PdfRotationAngle.angle270){
                        this.y = this.convertPointToPixel(yPosition);
                    }
                    else{
                        this.y = this.convertPointToPixel(childBookmarkDestination.page.size[1]) - this.convertPointToPixel(yPosition);
                    }
                    this.zoom = childBookmarkDestination.zoom;
                }
                else {
                    this.y = 0;
                    this.zoom = 0;
                }
                const childrenBookmark: BookmarkBase = new BookmarkBase();
                childrenBookmark.Title = title;
                childrenBookmark.Id = this.id;
                childrenBookmark.Child = [];
                childrenBookmark.FileName = !isNullOrUndefined((child as any).action) ? (child as any).action.toString() : '';

                const childrenBookmarkDestination: BookmarkDestination = new BookmarkDestination();
                childrenBookmarkDestination.X = this.x;
                childrenBookmarkDestination.Y = this.y;
                childrenBookmarkDestination.PageIndex = this.pageIndex;
                childrenBookmarkDestination.Zoom = this.zoom;
                this.bookmarkDictionary[this.id.toString()] = childrenBookmarkDestination;
                childBookmarkCollection.push(childrenBookmark);
                childrenBookmark.Child = this.getChildrenBookmark(child);
                if (childrenBookmark.Child.length > 0){
                    childrenBookmark.HasChild = true;
                }
            }
        }
        return childBookmarkCollection;
    }

    /**
     * @private
     */
    public getHyperlinks(pageIndex: number): any {
        if(isNullOrUndefined(this.renderer)) {
            this.renderer = new PageRenderer(this.pdfViewer, this.pdfViewerBase);
        }
        if (isNullOrUndefined(this.renderer.hyperlinks)){
            this.renderer.hyperlinks = [];
        }
        this.exportHyperlinks(pageIndex ,this.getPageSize(pageIndex), false, true);
        return{hyperlinks: this.renderer.hyperlinks, hyperlinkBounds: this.renderer.hyperlinkBounds, linkAnnotation:this.renderer.annotationList , linkPage:this.renderer.annotationDestPage, annotationLocation: this.renderer.annotationYPosition};
    }
    
    private exportHyperlinks(pageIndex: number, pageSize: Size, isExport: boolean, isAnnotationNeeded: boolean): void {
        let page: PdfPage = this.loadedDocument.getPage(pageIndex);
        this.renderer.hyperlinks = [];
        this.renderer.hyperlinkBounds = [];
        this.renderer.annotationDestPage = [];
        this.renderer.annotationList = [];
        this.renderer.annotationYPosition = [];

        for (let i = 0; i < page.annotations.count; i++) {
            if (page.annotations.at(i) instanceof PdfUriAnnotation){
                let pdfLoadedUriAnnotation: PdfUriAnnotation = page.annotations.at(i) as PdfUriAnnotation;
                let rectangle: AnnotBounds = this.getHyperlinkBounds(pdfLoadedUriAnnotation.bounds as Rect, pageSize, page.rotation);
                if (isNullOrUndefined(this.renderer.hyperlinks)){
                    this.renderer.hyperlinks = [];
                    this.renderer.hyperlinkBounds = [];
                }
                this.renderer.hyperlinks.push(pdfLoadedUriAnnotation.uri);
                this.renderer.hyperlinkBounds.push(rectangle);
            }
            else if(page.annotations.at(i) instanceof PdfTextWebLinkAnnotation) {
                let pdfLoadedTextWebLinkAnnotation: PdfTextWebLinkAnnotation = page.annotations.at(i) as PdfTextWebLinkAnnotation;
                let rectangle: AnnotBounds = this.getHyperlinkBounds(pdfLoadedTextWebLinkAnnotation.bounds as Rect, pageSize, page.rotation);
                if (isNullOrUndefined(this.renderer.hyperlinks)){
                    this.renderer.hyperlinks = [];
                    this.renderer.hyperlinkBounds = [];
                }
                this.renderer.hyperlinks.push(pdfLoadedTextWebLinkAnnotation.url);
                this.renderer.hyperlinkBounds.push(rectangle);
            }
            else if(page.annotations.at(i) instanceof PdfDocumentLinkAnnotation) {
                let pdfLoadedDocumentLinkAnnotation: PdfDocumentLinkAnnotation = page.annotations.at(i) as PdfDocumentLinkAnnotation;
                let rectangle: AnnotBounds = this.getHyperlinkBounds(pdfLoadedDocumentLinkAnnotation.bounds as Rect, pageSize, page.rotation);
                if (isNullOrUndefined(this.renderer.annotationDestPage)){
                    this.renderer.annotationDestPage = [];
                    this.renderer.annotationList = [];
                    this.renderer.annotationYPosition = [];
                }
                if(!isNullOrUndefined(pdfLoadedDocumentLinkAnnotation.destination)){
                    let linkPageIndex: number = pdfLoadedDocumentLinkAnnotation.destination.pageIndex;
                    this.renderer.annotationDestPage.push(linkPageIndex);
                    this.renderer.annotationList.push(rectangle);
                    if(page.rotation === PdfRotationAngle.angle180){
                        this.renderer.annotationYPosition.push(this.convertPointToPixel(Math.abs(pdfLoadedDocumentLinkAnnotation.destination.location[1])));
                    }
                    else if(page.rotation === PdfRotationAngle.angle90 || page.rotation === PdfRotationAngle.angle270){
                        this.renderer.annotationYPosition.push(pageSize.width - this.convertPointToPixel(Math.abs(pdfLoadedDocumentLinkAnnotation.destination.location[1])));
                    }
                    else{
                        this.renderer.annotationYPosition.push(pageSize.height - this.convertPointToPixel(Math.abs(pdfLoadedDocumentLinkAnnotation.destination.location[1])));
                    }
                }
            }
        }
    }

    private getHyperlinkBounds(bounds: Rect, pageSize: Size, pageRotation: PdfRotationAngle): AnnotBounds {
        let bound: AnnotBounds;
        if(pageRotation === PdfRotationAngle.angle0){
            bound = new AnnotBounds(this.convertPointToPixel(bounds.x), this.convertPointToPixel(bounds.y), this.convertPointToPixel(bounds.width), this.convertPointToPixel(bounds.height));
        }
        else if(pageRotation === PdfRotationAngle.angle90){
            bound = new AnnotBounds(pageSize.width - this.convertPointToPixel(bounds.y - bounds.height), this.convertPointToPixel(bounds.x), this.convertPointToPixel(bounds.height), this.convertPointToPixel(bounds.width));
        }
        else if(pageRotation === PdfRotationAngle.angle180){
            bound = new AnnotBounds(pageSize.width - this.convertPointToPixel(bounds.x - bounds.width), pageSize.height - this.convertPointToPixel(bounds.y - bounds.height), this.convertPointToPixel(bounds.width), this.convertPointToPixel(bounds.height));
        }
        else if(pageRotation === PdfRotationAngle.angle270){
            bound = new AnnotBounds(this.convertPointToPixel(bounds.y), pageSize.height - this.convertPointToPixel(bounds.x - bounds.width), this.convertPointToPixel(bounds.height), this.convertPointToPixel(bounds.width));
        }
        return bound;
    }
    
    /**
     * @private
     */
    public exportFormFields(jsonObject: any, isObjects: boolean) {
        const formFields: FormFieldsBase = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase);
        formFields.saveFormFieldsData(jsonObject);
        formFields.saveFormFieldsDesignerData(jsonObject);
        if (!jsonObject.hasOwnProperty("fileName")) {
            jsonObject["fileName"] = "undefined.pdf";
        }
        this.loadedDocument.form.exportEmptyFields = true;
        let dataFormat: DataFormat = DataFormat.json;
        if (jsonObject.hasOwnProperty("formFieldDataFormat")) {
            dataFormat = this.exportDataFormat(jsonObject["formFieldDataFormat"]);
        }
        let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
        let fileName: string;
        let exportFormFieldObject: Uint8Array
        settings.dataFormat = dataFormat;
        if (isObjects) {
            exportFormFieldObject = this.loadedDocument.exportFormData(settings);
            return _bytesToString(exportFormFieldObject);
        } else {
            fileName = this.changeFileExtension(this.pdfViewer.fileName, this.fileFormat(dataFormat));
            return "data:application/json;base64," + _encode(this.loadedDocument.exportFormData(settings));
        }
    }
    
    /**
     * @private
     */
    public importFormFields(jsonObject: any) {
        try {
            let formFields: FormFieldsBase = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase);
            formFields.saveFormFieldsDesignerData(jsonObject);
            let dataFormat: DataFormat = this.exportDataFormat(jsonObject["formFieldDataFormat"]);
            if (!this.isBase64(jsonObject["data"]) && !this.isUint8Array(jsonObject["data"])) {
                if (jsonObject["formFieldDataFormat"] === "Json") {
                    jsonObject["data"] = JSON.parse(jsonObject["data"]);
                }
                const encoder = new TextEncoder();
                const uint8ArrayLike = encoder.encode(jsonObject["data"]);
                jsonObject["data"] = new Uint8Array(uint8ArrayLike);
            }
            if (jsonObject.hasOwnProperty("formFieldDataFormat")) {
                this.loadedDocument.importFormData(jsonObject["data"], dataFormat);
            }
            formFields = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase);
            formFields.GetFormFields();
            let PdfRenderedFormFields: PdfRenderedFields[] = [];
            PdfRenderedFormFields = formFields.PdfRenderedFormFields;
            return { PdfRenderedFormFields };
        } catch (e) {
            return null;
        }
    }

    private isUint8Array(value: any): boolean {
        return value instanceof Uint8Array;
    }

    private isBase64(str: string): boolean {
        // Base64 regular expression pattern
        /* eslint-disable-next-line security/detect-unsafe-regex */
        const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        return base64Regex.test(str);
    }
    
    private exportDataFormat(format: string) {
        let exportFormat: DataFormat;
        switch (format) {
            case "Json":
                exportFormat = DataFormat.json;
                break;
            case "Xfdf":
                exportFormat = DataFormat.xfdf;
                break;
            case "Fdf":
                exportFormat = DataFormat.fdf;
                break;
            case "Xml":
                exportFormat = DataFormat.xml;
                break;
        }
        return exportFormat;
    }

    private fileFormat(value: number) {
        let fileExtention: string;
        switch (value) {
            case 0:
                fileExtention = "fdf";
                break;
            case 1:
                fileExtention = "xfdf";
                break;
            case 2:
                fileExtention = "json";
                break;
            case 3:
                fileExtention = "xml";
                break;
        }
        return fileExtention;
    }

    public exportAsImage(pageIndex: number): Promise<string> {
        return new Promise((resolve: Function, reject: Function) => {
            resolve(this.pdfiumExportAsImage(pageIndex));
        });
    }

    public exportAsImages(startIndex: number, endIndex: number): Promise<string[]> {
        return new Promise((resolve: Function, reject: Function) => {
            resolve(this.pdfiumExportAsImages(startIndex, endIndex));
        });
    }

    private pdfiumExportAsImage(pageIndex: number): Promise<string> {
        return new Promise((resolve: Function, reject: Function) => {
            if (!isNullOrUndefined(this.pdfViewerBase.pdfViewerRunner) && !isNullOrUndefined(this.loadedDocument)) {
                this.pdfViewerBase.pdfViewerRunner.postMessage({ pageIndex: pageIndex, message: 'extractImage', zoomFactor: this.pdfViewer.magnificationModule.zoomFactor, isTextNeed: false });
                this.pdfViewerBase.pdfViewerRunner.onmessage = function (event) {
                    if (event.data.message === 'imageExtracted') {
                        let canvas: HTMLCanvasElement = document.createElement('canvas');
                        let { value, width, height } = event.data;
                        canvas.width = width;
                        canvas.height = height;
                        const canvasContext = canvas.getContext('2d');
                        const imageData = canvasContext.createImageData(width, height);
                        imageData.data.set(value);
                        canvasContext.putImageData(imageData, 0, 0);
                        let imageUrl: string = canvas.toDataURL();
                        resolve(imageUrl);
                    }
                }
            }
            else {
                resolve(null);
            }
        });
    }

    private pdfiumExportAsImages(startIndex: number, endIndex: number): Promise<string[]> {
        return new Promise((resolve: Function, reject: Function) => {
            if (!isNullOrUndefined(this.pdfViewerBase.pdfViewerRunner) && !isNullOrUndefined(this.loadedDocument)) {
                if (startIndex < 0) {
                    startIndex = 0;
                }
                if (endIndex > this.loadedDocument.pageCount - 1) {
                    endIndex = this.loadedDocument.pageCount - 1;
                }
                if (startIndex > endIndex) {
                    reject('Invalid page index');
                }
                let imageUrls: string[] = [];
                let count = endIndex - startIndex + 1;
                for (let i = startIndex; i <= endIndex; i++) {
                    this.pdfViewerBase.pdfViewerRunner.postMessage({ pageIndex: i, message: 'extractImage', zoomFactor: this.pdfViewer.magnificationModule.zoomFactor, isTextNeed: false });
                }
                this.pdfViewerBase.pdfViewerRunner.onmessage = function (event) {
                    if (event.data.message === 'imageExtracted') {
                        let canvas: HTMLCanvasElement = document.createElement('canvas');
                        let { value, width, height } = event.data;
                        canvas.width = width;
                        canvas.height = height;
                        const canvasContext = canvas.getContext('2d');
                        const imageData = canvasContext.createImageData(width, height);
                        imageData.data.set(value);
                        canvasContext.putImageData(imageData, 0, 0);
                        let imageUrl: string = canvas.toDataURL();
                        imageUrls.push(imageUrl);
                        if (imageUrls.length === count) {
                            resolve(imageUrls);
                        }
                    }
                }
            }
            else {
                resolve(null);
            }
        });
    }

    public extractText(pageIndex: number, isLayout?: boolean): Promise<{ textDataCollection: TextData[], extractedText: string }> {
        return new Promise((resolve: Function, reject: Function) => {
            resolve(this.textExtraction(pageIndex, !isNullOrUndefined(isLayout) ? isLayout : true));
        });
    }

    // eslint-disable-next-line max-len
    private textExtraction(pageIndex: number, isLayout: boolean, isRenderText?: boolean): Promise<any> {
        return new Promise((resolve: Function, reject: Function) => {
            if (!isNullOrUndefined(this.pdfViewerBase.pdfViewerRunner)) {
                this.pdfViewerBase.pdfViewerRunner.postMessage({ pageIndex: pageIndex, message: 'extractText', zoomFactor: this.pdfViewer.magnificationModule.zoomFactor, isTextNeed: true });
            }
            else {
                resolve(null);
            }
        });
    }

    /**
     * @private
     */
    public textExtractionOnmessage(event: any) {
        let extractedText: string = '';
        let textDataCollection: TextData[] = [];
        return new Promise((resolve: Function, reject: Function) => {
            if (event.data.message === 'textExtracted') {
                const characterDetails: any = event.data.characterBounds;
                for (let i: number = 0; i < characterDetails.length; i++) {
                    if (!event.data.isLayout && (characterDetails[parseInt(i.toString(), 10)].Text as string).indexOf('\r') !== -1) {
                        extractedText += '';
                    }
                    else {
                        extractedText += characterDetails[parseInt(i.toString(), 10)].Text;
                    }
                    const cropBox: number[] = this.loadedDocument.getPage(event.data.pageIndex).cropBox;
                    // eslint-disable-next-line max-len
                    const bound: AnnotBounds = new AnnotBounds(this.convertPixelToPoint(characterDetails[parseInt(i.toString(), 10)].X), this.convertPixelToPoint(characterDetails[parseInt(i.toString(), 10)].Y + cropBox[1]), this.convertPixelToPoint(characterDetails[parseInt(i.toString(), 10)].Width), this.convertPixelToPoint(characterDetails[parseInt(i.toString(), 10)].Height));
                    textDataCollection.push(new TextData(characterDetails[parseInt(i.toString(), 10)].Text, bound));
                }
                let result: any = {};
                if (event.data.isRenderText) {
                    result.extractedTextDetails = { textDataCollection: textDataCollection, extractedText: extractedText };
                    result.textBounds = event.data.textBounds;
                    result.textContent = event.data.textContent;
                    result.rotation = event.data.rotation;
                    result.pageText = event.data.pageText;
                    result.characterBounds = event.data.characterBounds;
                }
                else{
                    result = { textDataCollection: textDataCollection, extractedText: extractedText };
                }
                resolve(result);
            }
        });
    }

    public extractTextWithPageSize(pageIndex: number): Promise<{[key: number]: PageTextData}>{
        return new Promise((resolve: Function, reject: Function) => {
            resolve(this.extractTextDetailsWithPageSize(pageIndex));
        });
    }

    private extractTextDetailsWithPageSize(pageIndex: number, isRenderText? : boolean): Promise<any>{
        let pageTextDataCollection: {[key: number]: PageTextData} = {};
        return new Promise((resolve: Function, reject: Function) => {
            // eslint-disable-next-line max-len
            this.textExtraction(pageIndex, true, isRenderText).then((textData: any) => {
                if (!isNullOrUndefined(textData)){
                    let textDetails : any = textData;
                    if(isRenderText){
                        textDetails = textData.extractedTextDetails;
                    }
                    // eslint-disable-next-line security/detect-object-injection
                    pageTextDataCollection[pageIndex] = new PageTextData( new SizeBase(this.getPageSize(pageIndex).width, this.getPageSize(pageIndex).height), textDetails.textDataCollection, textDetails.extractedText);
                    if (isRenderText){
                        // eslint-disable-next-line max-len
                        resolve({pageTextDataCollection: pageTextDataCollection, textBounds: textData.textBounds, textContent: textData.textContent, rotation: textData.rotation, characterBounds: textData.characterBounds});
                    }
                    else{
                        resolve(pageTextDataCollection);
                    }
                }
                else{
                    resolve(null);
                }
            });
        });
    }

    /**
     * @private
     */
    public getDocumentText(jsonObject: any): Promise<any>{
        let pageStartIndex: number = !isNullOrUndefined(jsonObject.pageStartIndex) ? jsonObject.pageStartIndex : jsonObject.pageIndex;
        let pageEndIndex: number = !isNullOrUndefined(jsonObject.pageEndIndex) ? jsonObject.pageEndIndex : jsonObject.pageIndex + 1;
        let pageCount: number = this.loadedDocument.pageCount;
        let documentTextCollection: {[key: number]: PageTextData}[] = [];
        return new Promise((resolve: Function, reject: Function) => {
            for (let pageIndex: number = pageStartIndex; pageIndex < pageEndIndex; pageIndex++) {
                this.extractTextDetailsWithPageSize(pageIndex, true).then((value: any) => {
                    documentTextCollection.push(value.pageTextDataCollection);
                    if (documentTextCollection.length === pageEndIndex - pageStartIndex){
                        resolve({ uniqueId : jsonObject.uniqueId,
                            documentTextCollection : documentTextCollection,
                            pageStartIndex : pageStartIndex,
                            pageEndIndex : pageEndIndex,
                            textBounds : value.textBounds,
                            textContent : value.textContent,
                            rotation : value.rotation,
                            characterBounds : value.characterBounds });
                    }
                });
            }
        });
    }
}

class TextData{
    public Text: string;
    public Bounds: AnnotBounds;
    constructor(text: string, bounds: AnnotBounds){
        this.Text = text;
        this.Bounds = bounds;
    }
}

class PageTextData{
    public PageSize: SizeBase;
    public TextData: TextData[];
    public PageText: string;
    constructor(pageSize: SizeBase, textData: TextData[], pageText: string){
        this.PageSize = pageSize;
        this.TextData = textData;
        this.PageText = pageText;
    }
}

/**
 *
 * @hidden
 */
export class SizeBase {
    public Width: number;
    public Height: number;
    public IsEmpty: boolean = true;
    constructor(_Width: number, _Height: number) {
        this.Width = _Width;
        this.Height = _Height;
        this.IsEmpty = false;
    }
}

/**
 * 
 * @hidden
 */
export class Annotations {
    public textMarkupAnnotation: any;
    public shapeAnnotation: any;
    public measureShapeAnnotation: any;
    public stampAnnotations: any;
    public stickyNotesAnnotation: any;
    public freeTextAnnotation: any;
    public signatureAnnotation: any;
    public signatureInkAnnotation: any;
    public annotationOrder: any;
}
