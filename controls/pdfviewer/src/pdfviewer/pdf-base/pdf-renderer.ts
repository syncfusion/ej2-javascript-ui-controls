import { PageRenderer, FormFieldsBase, AnnotationRenderer, PdfRenderedFields, SignatureBase, BookmarkStyles, BookmarkDestination, BookmarkBase, AnnotBounds } from './index';
import { Browser, createElement, isBlazor, isNullOrUndefined, initializeTelemetryFeature } from '@syncfusion/ej2-base';
import { DataFormat, PdfAnnotationExportSettings, PdfBookmark, PdfBookmarkBase, PdfDocument, PdfPage, PdfRotationAngle, PdfTextStyle, PdfDocumentLinkAnnotation, PdfTextWebLinkAnnotation, PdfUriAnnotation, PdfDestination, PdfPermissionFlag, PdfFormFieldExportSettings, _bytesToString, _encode, PdfPageSettings, PdfSignatureField, PdfForm, PdfPageImportOptions, _decode, PdfAnnotationCollection, PdfAnnotation } from '@syncfusion/ej2-pdf';
import { Dialog } from '@syncfusion/ej2-popups';
import { ExtractTextOption, PdfViewer, PdfViewerBase, SearchResultModel, IOrganizePageAction, ISize } from '../index';
import { TextDataSettingsModel } from '../pdfviewer-model';
import { Rect, Size } from './../ej2-drawings/index';
import { AnnotationStatus, OrganizeDetails, OrganizePageActionType, PdfViewerUtils, TaskPriorityLevel } from '../base/pdfviewer-utlis';
import { PdfRedactor } from '@syncfusion/ej2-pdf-data-extract';

/**
 * PdfRenderer
 *
 * @hidden
 */
export class PdfRenderer {
    /**
     * @private
     */
    public loadedDocument: PdfDocument;
    /**
     * @private
     */
    public loadImportedDocument: PdfDocument;
    private pageCount: number;
    /**
     * @private
     */
    public bookmarkStyles: BookmarkStyles[] = [];
    /**
     * @private
     */
    public bookmarkCollection: BookmarkBase[] = [];
    /**
     * @private
     */
    public pageRotationCollection: number[] = [];
    /**
     * @private
     */
    public bookmarkDictionary: { [key: string]: BookmarkDestination } = {};
    renderer: PageRenderer;
    formFieldsBase: FormFieldsBase;
    signatureBase: SignatureBase;
    annotationRenderer: AnnotationRenderer;
    private annotationDetailCollection: { [key: string]: Annotations; } = {};
    /**
     * @private
     */
    public documentTextCollection: { [key: number]: PageTextData }[] = [];
    pageSizes: { [key: string]: Size; } = {};
    private isCompletePageSizeNotReceieved: boolean = true;
    hashID: string;
    private x: number = 0;
    private y: number = 0;
    private zoom: number = 1;
    private id: number = 0;
    private pageIndex: number = 0;
    private textCollections: any = [];
    private scaleFactor: number = 1.5;
    private static IsLinuxOS: boolean = false;
    private static IsWindowsOS: boolean = false;
    private restrictionList: string[] = [];
    private securityList: string[] = ['Print', 'EditContent', 'CopyContent', 'EditAnnotations', 'FillFields', 'AccessibilityCopyContent', 'AssembleDocument', 'FullQualityPrint'];
    private _fallbackFontCollection: { [key: string]: any; } = {};
    private document: PdfDocument = null;
    /**
     * @private
     */
    public searchResults: any = {};
    /**
     * @private
     * @returns {void}
     */
    public get PageCount(): number {
        return this.pageCount;
    }
    private mReferencePath: string;
    /**
     * @private
     * @returns {void}
     */
    public get ReferencePath(): string {
        return this.mReferencePath;
    }
    /**
     * @private
     * @param {string} v - v
     * @returns {void}
     */
    public set referencePath(v: string) {
        this.mReferencePath = v;
    }
    /**
     * @private
     * @returns {void}
     */
    public get ScaleFactor(): number {
        return this.scaleFactor;
    }
    /**
     * @private
     * @param {string} v - v
     */
    public set ScaleFactor(v: number) {
        this.scaleFactor = v;
        if (this.scaleFactor <= 0) {
            this.scaleFactor = 1;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public get FallbackFontCollection(): { [key: string]: any; } {
        return this._fallbackFontCollection;
    }
    /**
     * @private
     * @param {string} v - v
     */
    public set FallbackFontCollection(v: { [key: string]: any; }) {
        this._fallbackFontCollection = v;
    }
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
     */
    public digitialByteArray: Uint8Array;
    private loadedByteArray: Uint8Array;
    private loadImportedBase64String: string;
    /**
     * @private
     */
    public password: string;
    private importedDocpassword: string;
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
     * @param {string} documentData - documentData
     * @param {string} documentId - documentId
     * @param {string} password - password
     * @param {any} jsonObject - jsonObject
     * @private
     * @returns {void}
     */
    public load(documentData: any, documentId: string, password: string, jsonObject: any): string {
        try {
            if (jsonObject.action !== 'VirtualLoad') {
                this.loadedDocument = new PdfDocument(documentData, password ? password : '');
                this.loadedDocument._allowDeepParsingFromPages = true;
                this.loadedByteArray = documentData;
                this.password = password;
                this.isCompletePageSizeNotReceieved = true;
            }
        }
        catch (error) {
            if (error.message === 'Invalid PDF structure.') {
                return '3';
            }
            else if (error.message === 'Cannot open an encrypted document. The password is invalid.') {
                return '4';
            }
            else if (error.message === 'Invalid cross reference') {
                return '4';
            }
            else {
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
     * @param {string} documentData - documentData
     * @param {string} documentId - documentId
     * @param {string} password - password
     * @param {any} jsonObject - jsonObject
     * @private
     * @returns {void}
     */
    public loadImportDocument(documentData: any, documentId: string, password: string, jsonObject: any): string {
        try {
            if (jsonObject.action !== 'VirtualLoad') {
                this.loadImportedDocument = new PdfDocument(documentData, password ? password : '');
                this.loadImportedBase64String = documentData;
                this.importedDocpassword = password;
            }
        }
        catch (error) {
            if (error.message === 'Invalid PDF structure.') {
                return '3';
            }
            else if (error.message === 'Cannot open an encrypted document. The password is invalid.') {
                return '4';
            }
            else if (error.message === 'Invalid cross reference') {
                return '4';
            }
            else {
                return error.message;
            }
        }
        const jsonResult: object = { uniqueId: documentId, password: this.importedDocpassword};
        this.loadImportedDocument.destroy();
        this.loadImportedDocument = null;
        return JSON.stringify(jsonResult);
    }

    /**
     * @param {string} documentData - documentData
     * @param {string} documentId - documentId
     * @param {string} password - password
     * @param {any} jsonObject - jsonObject
     * @private
     * @returns {void}
     */
    public loadDocument(documentData: string, documentId: string, password: string, jsonObject: any): object {
        if (Object.prototype.hasOwnProperty.call(jsonObject, 'isCompletePageSizeNotReceived')) {
            this.isCompletePageSizeNotReceieved = !jsonObject.isCompletePageSizeNotReceived;
        }
        this.pageCount = this.loadedDocument.pageCount;
        this.pageSizes = this.getPageSizes(this.pageCount);
        let pdfRenderedFormFields: PdfRenderedFields[] = [];
        const isDigitalSignaturePresent: boolean = false;
        const isTaggedPdf: boolean = false; //Need to check and set if loaddocument is tagged pdf
        this.formFieldsBase = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase, isDigitalSignaturePresent);
        this.restrictionList = [];
        if (!isNullOrUndefined(this.loadedDocument)) {
            this.documentSecurity(password);
        }
        if (!isNullOrUndefined(this.loadedDocument)) {
            if (Object.prototype.hasOwnProperty.call(jsonObject, 'hideEmptyDigitalSignatureFields')) {
                this.formFieldsBase.hideEmptyDigitalSignatureFields = jsonObject['hideEmptyDigitalSignatureFields'];
            }
            if (Object.prototype.hasOwnProperty.call(jsonObject, 'showDigitalSignatureAppearance')) {
                this.formFieldsBase.showDigitalSignatureAppearance = jsonObject['showDigitalSignatureAppearance'];
            }
        }
        if (!isNullOrUndefined(this.formFieldsBase) && this.pageSizes && jsonObject.action === 'Load') {
            this.formFieldsBase.GetFormFields();
            pdfRenderedFormFields = this.formFieldsBase.PdfRenderedFormFields;
        }
        return { pageCount: this.pageCount, pageSizes: this.pageSizes, uniqueId: documentId,
            PdfRenderedFormFields: pdfRenderedFormFields, RestrictionSummary: this.restrictionList,
            isDigitalSignaturePresent: this.formFieldsBase.mIsDigitalSignaturePresent,
            digitialSignatureFile: this.digitialByteArray ? true : false,
            isTaggedPdf: isTaggedPdf, pageRotation: this.pageRotationCollection };
    }

    private documentSecurity(password: string): void {
        const isOwnerPassword: boolean = this.loadedDocument.isEncrypted &&
            (!this.loadedDocument.isUserPassword || this.loadedDocument._hasUserPasswordOnly);
        if (!isNullOrUndefined(password) && password !== '' && isOwnerPassword) {
            this.restrictionSummary(password, true);
        }
        else {
            this.restrictionSummary(password, false);
        }
    }

    private restrictionSummary(password: string, isOwner: boolean): void {
        const ownerPassword: string = password ? password : ''; //Need to set owner password from loaded document
        const userPassword: string = password ? password : ''; //Need to set user password from loaded document
        const permissionList: string[] = this.getPermissionArray(this.loadedDocument.permissions);
        const isEncrypted: boolean = this.loadedDocument.isEncrypted;
        if ((!(permissionList.length === 1 && permissionList[0] === 'Default')) || (isEncrypted && ownerPassword === '' && userPassword === '')) {
            for (let i: number = 0; i < this.securityList.length; i++) {
                let isExist: boolean = false;
                for (let j: number = 0; j < permissionList.length; j++) {
                    if (permissionList[parseInt(j.toString(), 10)].trim() === this.securityList[parseInt(i.toString(), 10)].trim()) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist && !isOwner) {
                    this.restrictionList.push(this.securityList[parseInt(i.toString(), 10)].trim());
                }
            }
        }
        else if (permissionList.length === 1 && permissionList[0] === 'Default' && isEncrypted && !isOwner) {
            for (let i: number = 0; i < this.securityList.length; i++) {
                this.restrictionList.push(this.securityList[parseInt(i.toString(), 10)].trim());
            }
        }
    }

    private getPermissionArray(permission: PdfPermissionFlag): string[] {
        const permissionArray: string[] = [];
        if (permission === PdfPermissionFlag.default) {
            permissionArray.push('Default');
        } else {
            if (permission & PdfPermissionFlag.fullQualityPrint) {
                permissionArray.push('FullQualityPrint');
            }
            if (permission & PdfPermissionFlag.assembleDocument) {
                permissionArray.push('AssembleDocument');
            }
            if (permission & PdfPermissionFlag.accessibilityCopyContent) {
                permissionArray.push('AccessibilityCopyContent');
            }
            if (permission & PdfPermissionFlag.fillFields) {
                permissionArray.push('FillFields');
            }
            if (permission & PdfPermissionFlag.editAnnotations) {
                permissionArray.push('EditAnnotations');
            }
            if (permission & PdfPermissionFlag.copyContent) {
                permissionArray.push('CopyContent');
            }
            if (permission & PdfPermissionFlag.editContent) {
                permissionArray.push('EditContent');
            }
            if (permission & PdfPermissionFlag.print) {
                permissionArray.push('Print');
            }
        }
        return permissionArray;
    }

    private getPageSizes(pageCount: number): { [key: string]: Size; } {
        const pageSizes: { [key: string]: Size } = {};
        for (let i: number = 0; i < pageCount; i++) {
            const page: PdfPage = this.loadedDocument.getPage(i);
            const size: any = page.size;
            const rotation: PdfRotationAngle = page.rotation % 4;
            this.pageRotationCollection.push(rotation);
            if (rotation === PdfRotationAngle.angle0 || rotation === PdfRotationAngle.angle180) {
                pageSizes[i.toString()] = new Size(this.convertPointToPixel(size.width), this.convertPointToPixel(size.height));
            } else {
                pageSizes[i.toString()] = new Size(this.convertPointToPixel(size.height), this.convertPointToPixel(size.width));
            }
        }
        return pageSizes;
    }

    /**
     * @param {number} pageNumber - pageNumber
     * @private
     * @returns {void}
     */
    public getPageSize(pageNumber: number): Size {
        let newSize: Size = new Size();
        if (pageNumber >= 0 && pageNumber < this.loadedDocument.pageCount) {
            const page: PdfPage = this.loadedDocument.getPage(pageNumber);
            const size: any = page.size;
            const rotation: PdfRotationAngle = page.rotation % 4;
            if (rotation === PdfRotationAngle.angle0 || rotation === PdfRotationAngle.angle180) {
                newSize = new Size(this.convertPointToPixel(size.width), this.convertPointToPixel(size.height));
            } else {
                newSize = new Size(this.convertPointToPixel(size.height), this.convertPointToPixel(size.width));
            }
        }
        return newSize;
    }

    private convertPointToPixel(number: number): number {
        return number * 96 / 72;
    }

    private convertPixelToPoint(value: number): number {
        return (value * (72 / 96));
    }

    /**
     * @param {string} jsonObject - jsonObject
     * @private
     * @returns {void}
     */
    public getDocumentAsUint8Array(jsonObject: { [key: string]: string | boolean }): Uint8Array {
        this.loadedDocument = new PdfDocument(this.loadedByteArray, this.password);
        let clonedDocument: PdfDocument = null;
        if (Object.prototype.hasOwnProperty.call(jsonObject, 'digitalSignatureDocumentEdited') &&
            !jsonObject.digitalSignatureDocumentEdited ||
            (Object.prototype.hasOwnProperty.call(jsonObject, 'isPdfEdited') && !jsonObject.isPdfEdited)) {
            initializeTelemetryFeature('Download', 'PDFViewer');
            return this.loadedByteArray;
        }
        else {
            const annotationRenderer: AnnotationRenderer = new AnnotationRenderer(this.pdfViewer, this.pdfViewerBase);
            const formfields: FormFieldsBase = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase);
            // create object for form fields signature
            this.updateAnnotations(jsonObject);
            annotationRenderer.removeSignatureTypeAnnot(jsonObject, this.loadedDocument);
            this.orderAnnotations(jsonObject);
            if (Object.prototype.hasOwnProperty.call(jsonObject, 'isFormFieldAnnotationsExist') && jsonObject.isFormFieldAnnotationsExist) {
                if (Object.prototype.hasOwnProperty.call(jsonObject, 'formDesigner') && !isNullOrUndefined(jsonObject['formDesigner'])) {
                    formfields.saveFormFieldsDesignerData(jsonObject);
                }
                else if (Object.prototype.hasOwnProperty.call(jsonObject, 'fieldsData')) {
                    formfields.saveFormFieldsData(jsonObject);
                }
            }
            if (Object.prototype.hasOwnProperty.call(jsonObject, 'organizePages')) {
                const savedBase64String: any = this.loadedDocument.save();
                clonedDocument = new PdfDocument(savedBase64String, this.password);
                const organizePages: any = JSON.parse(jsonObject.organizePages as string);
                if (organizePages.length > 0) {
                    initializeTelemetryFeature('Organize Pages', 'PDFViewer');
                    const reorderedPages: number[] = this.rearrangePages(organizePages);
                    this.deletePdfPages(organizePages, reorderedPages);
                    this.insertPdfPages(organizePages);
                    this.copyPages(organizePages, clonedDocument);
                    this.rotatePages(organizePages);
                    this.importPages(organizePages);
                    if (this.isDummyInserted) {
                        this.loadedDocument.removePage(this.loadedDocument.pageCount - 1);
                        this.isDummyInserted = false;
                    }
                }
                clonedDocument.destroy();
                clonedDocument = null;
            }
            if (Object.prototype.hasOwnProperty.call(jsonObject, 'canRedact')) {
                const canRedact: boolean = JSON.parse(jsonObject.canRedact as string);
                if (canRedact === true) {
                    initializeTelemetryFeature('Redaction', 'PDFViewer');
                    // Initialize a new instance of the `PdfRedactor` class
                    const redactor: PdfRedactor = new PdfRedactor(this.loadedDocument);
                    // Apply redactions on the PDF document
                    redactor.redactSync();
                }
            }
            if (Object.prototype.hasOwnProperty.call(jsonObject, 'canPrint') && (!Browser.isDevice && this.pdfViewerBase.clientSideRendering)) {
                const canPrint: boolean = JSON.parse(jsonObject.canPrint as string);
                if (this.pdfViewer.enablePrintRotation && canPrint === true) {
                    for (let i: number = 0; i < this.pdfViewer.pageCount; i++) {
                        const pageSize: Size = this.pdfViewer.pdfRendererModule.getPageSize(i);
                        const page: PdfPage = this.loadedDocument.getPage(i);
                        const currentRotation: number = this.pdfViewer.pdfRendererModule.pageRotationCollection[parseInt(i.toString(), 10)];
                        if (pageSize.width > pageSize.height) {
                            page.rotation = PdfRotationAngle.angle270;
                        } else {
                            switch (currentRotation) {
                            case PdfRotationAngle.angle90:
                                page.rotation = PdfRotationAngle.angle0;
                                break;
                            case PdfRotationAngle.angle270:
                                page.rotation = PdfRotationAngle.angle180;
                                break;
                            }
                        }
                    }
                }
            }
            if (!Object.prototype.hasOwnProperty.call(jsonObject, 'organizePages') && !Object.prototype.hasOwnProperty.call(jsonObject, 'canRedact') && Object.prototype.hasOwnProperty.call(jsonObject, 'canPrint') && JSON.parse(jsonObject.canPrint as string) === false) {
                initializeTelemetryFeature('Download', 'PDFViewer');
            }
            const documentSaved: any = this.loadedDocument.save();
            if (this.document != null) {
                this.document.destroy();
                this.document = null;
            }
            return documentSaved;
        }
    }

    private rearrangePages(organizePages: any): number[] {
        let reorderedPageIndices: number[] = [];
        if (organizePages.length > 0) {
            const clonedCollection: any = JSON.parse(JSON.stringify(organizePages));
            const sortedCollection: any = clonedCollection.sort((a: any, b: any) => this.pdfViewer.pageOrganizer.sorting(a['currentPageIndex'], b['currentPageIndex']));
            for (let i: number = 0; i < sortedCollection.length; i++) {
                const currentPageDetails: any = sortedCollection[parseInt(i.toString(), 10)];
                if (!currentPageDetails.isInserted && !currentPageDetails.isCopied && !currentPageDetails.isImportedDoc && currentPageDetails['currentPageIndex'] !== null && currentPageDetails['pageIndex'] !== null && parseInt(currentPageDetails['pageIndex'].toString(), 10) >= 0) {
                    reorderedPageIndices.push(parseInt(currentPageDetails['pageIndex'].toString(), 10));
                }
            }
            // eslint-disable-next-line
            const deltetedPages: any = sortedCollection.filter(function (item: any) { return item.isDeleted && item['currentPageIndex'] === null; });
            for (let i: number = 0; i < deltetedPages.length; i++) {
                const deletedPage: any = deltetedPages[parseInt(i.toString(), 10)];
                reorderedPageIndices = [...reorderedPageIndices.slice(0, deletedPage.pageIndex), deletedPage.pageIndex,
                    ...reorderedPageIndices.slice(deletedPage.pageIndex)];
            }
            if (reorderedPageIndices.length > 0) {
                this.loadedDocument.reorderPages(reorderedPageIndices);
            }
        }
        return reorderedPageIndices;
    }

    private rotatePages(organizePages: any): void {
        if (organizePages.length > 0) {
            let importPageCount: number = 0;
            for (let i: number = 0; i < organizePages.length; i++) {
                const pageNumber: number = organizePages[parseInt(i.toString(), 10)].pageIndex;
                const currentPageNumber: number = organizePages[parseInt(i.toString(), 10)].currentPageIndex;
                const isDeleted: boolean = organizePages[parseInt(i.toString(), 10)].isDeleted;
                const isInserted: boolean = organizePages[parseInt(i.toString(), 10)].isInserted;
                const isCopied: boolean = organizePages[parseInt(i.toString(), 10)].isCopied;
                const isImportedDoc: boolean = organizePages[parseInt(i.toString(), 10)].isImportedDoc;
                const rotation: number = organizePages[parseInt(i.toString(), 10)].rotateAngle;
                if (isImportedDoc) {
                    importPageCount++;
                }
                if (!isNullOrUndefined(currentPageNumber) && !isNullOrUndefined(rotation) &&
                    !isDeleted && !isInserted && !isCopied && !isImportedDoc && pageNumber !== -1) {
                    const nativeRotation: number = !isNullOrUndefined(organizePages[parseInt(i.toString(), 10)].pageSize) &&
                        !isNullOrUndefined(organizePages[parseInt(i.toString(), 10)].pageSize.rotation) ?
                        organizePages[parseInt(i.toString(), 10)].pageSize.rotation : 0;
                    const totalRotation: number = (nativeRotation + this.getPdfRotationAngle(rotation)) % 4;
                    const page: PdfPage = this.loadedDocument.getPage(currentPageNumber - importPageCount);
                    page.rotation = totalRotation;
                }
            }
        }
    }
    private insertPdfPages(organizePages: any): void {
        if (organizePages.length > 0) {
            let copiedPageCount: number = 0;
            for (let i: number = 0; i < organizePages.length; i++) {
                const pageNumber: number = organizePages[parseInt(i.toString(), 10)].pageIndex;
                const currentPageNumber: number = organizePages[parseInt(i.toString(), 10)].currentPageIndex;
                const isDeleted: boolean = organizePages[parseInt(i.toString(), 10)].isDeleted;
                const isInserted: boolean = organizePages[parseInt(i.toString(), 10)].isInserted;
                const isCopied: boolean = organizePages[parseInt(i.toString(), 10)].isCopied;
                const isImportedDoc: boolean = organizePages[parseInt(i.toString(), 10)].isImportedDoc;
                let pageSize: any;
                if (!isNullOrUndefined(organizePages[parseInt(i.toString(), 10)].pageSize)) {
                    pageSize = {
                        width: this.convertPixelToPoint(organizePages[parseInt(i.toString(), 10)].pageSize.width),
                        height: this.convertPixelToPoint(organizePages[parseInt(i.toString(), 10)].pageSize.height)
                    };
                }
                if (isCopied || isImportedDoc) {
                    copiedPageCount++;
                }
                if (!isNullOrUndefined(currentPageNumber) && !isDeleted && isInserted && pageNumber === -1) {
                    const rotation: number = organizePages[parseInt(i.toString(), 10)].rotateAngle;
                    const pageSettings: PdfPageSettings = new PdfPageSettings();
                    pageSettings.rotation = this.getPdfRotationAngle(rotation);
                    if (!isNullOrUndefined(pageSize)) {
                        pageSettings.size = pageSize;
                    }
                    this.loadedDocument.addPage(currentPageNumber - copiedPageCount, pageSettings);
                }
            }
        }
    }
    private copyPages(organizePages: any, clonedDocument: PdfDocument): void {
        if (organizePages.length > 0) {
            let importPageCount: number = 0;
            for (let i: number = 0; i < organizePages.length; i++) {
                const pageNumber: number = organizePages[parseInt(i.toString(), 10)].pageIndex;
                const currentPageNumber: number = organizePages[parseInt(i.toString(), 10)].currentPageIndex;
                const copiedPageIndex: number = organizePages[parseInt(i.toString(), 10)].copiedPageIndex;
                const isDeleted: boolean = organizePages[parseInt(i.toString(), 10)].isDeleted;
                const isInserted: boolean = organizePages[parseInt(i.toString(), 10)].isInserted;
                const isCopied: boolean = organizePages[parseInt(i.toString(), 10)].isCopied;
                const isImportedDoc: boolean = organizePages[parseInt(i.toString(), 10)].isImportedDoc;
                const rotation: number = organizePages[parseInt(i.toString(), 10)].rotateAngle;
                if (isImportedDoc) {
                    importPageCount++;
                }
                if (!isNullOrUndefined(currentPageNumber) && !isDeleted && !isInserted && !isImportedDoc && isCopied && pageNumber === -1) {
                    const nativeRotation: number = !isNullOrUndefined(organizePages[parseInt(i.toString(), 10)].pageSize) &&
                        !isNullOrUndefined(organizePages[parseInt(i.toString(), 10)].pageSize.rotation) ?
                        organizePages[parseInt(i.toString(), 10)].pageSize.rotation : 0;
                    const totalRotation: number = (nativeRotation + this.getPdfRotationAngle(rotation)) % 4;
                    const pageToImport: PdfPage = clonedDocument.getPage(copiedPageIndex);
                    pageToImport.rotation = totalRotation;
                    const options: PdfPageImportOptions = new PdfPageImportOptions();
                    options.targetIndex = currentPageNumber - importPageCount;
                    options.groupFormFields = true;
                    this.loadedDocument.importPage(pageToImport, clonedDocument, options);
                }
            }
        }
    }
    private importPages(organizePages: any): void {
        if (organizePages.length > 0) {
            for (let i: number = organizePages.length - 1; i >= 0 ; i--) {
                const pageNumber: number = organizePages[parseInt(i.toString(), 10)].pageIndex;
                const currentPageNumber: number = organizePages[parseInt(i.toString(), 10)].currentPageIndex;
                const isDeleted: boolean = organizePages[parseInt(i.toString(), 10)].isDeleted;
                const isInserted: boolean = organizePages[parseInt(i.toString(), 10)].isInserted;
                const isCopied: boolean = organizePages[parseInt(i.toString(), 10)].isCopied;
                const isImportedDoc: boolean = organizePages[parseInt(i.toString(), 10)].isImportedDoc;
                let documentData: any = organizePages[parseInt(i.toString(), 10)].documentData;
                const password: string = organizePages[parseInt(i.toString(), 10)].password;
                if (!isNullOrUndefined(currentPageNumber) && !isDeleted && !isInserted && !isCopied  && isImportedDoc &&
                pageNumber === -1) {
                    let importedDocCountBefore: number = 0;
                    for (let j: number = 0; j < i; j++) {
                        if (organizePages[parseInt(j.toString(), 10)].isImportedDoc) {
                            importedDocCountBefore++;
                        }
                    }
                    documentData = this.pdfViewerBase.convertBase64(documentData);
                    this.document = null;
                    this.document = new PdfDocument(documentData, password);
                    const options: PdfPageImportOptions = new PdfPageImportOptions();
                    options.targetIndex = currentPageNumber - importedDocCountBefore;
                    options.groupFormFields = true;
                    this.loadedDocument.importPageRange(this.document, 0, this.document.pageCount - 1, options);
                }
            }
        }
    }
    private deletePdfPages(organizePages: any, reorderedPages: number[]): void {
        if (organizePages.length > 0) {
            const clonedCollection: any = JSON.parse(JSON.stringify(organizePages));
            const sortedCollection: any = [];
            let deleteCount: number = 0;
            const initialPageCount: number = this.loadedDocument.pageCount;
            for (let i: number = 0; i < clonedCollection.length; i++) {
                if (clonedCollection.
                    find((item: any) => { return item.pageIndex === reorderedPages[parseInt(i.toString(), 10)]; })) {
                    sortedCollection[parseInt(i.toString(), 10)] = clonedCollection.
                        find((item: any) => { return item.pageIndex === reorderedPages[parseInt(i.toString(), 10)]; });
                }
            }
            for (let i: number = sortedCollection.length - 1; i >= 0; i--) {
                let count: number = 0;
                const pageNumber: number = sortedCollection[parseInt(i.toString(), 10)].pageIndex;
                const isDeleted: boolean = sortedCollection[parseInt(i.toString(), 10)].isDeleted;
                if (!isNullOrUndefined(pageNumber) && isDeleted) {
                    if (deleteCount + 1 === initialPageCount) {
                        this.loadedDocument.addPage();
                        this.isDummyInserted = true;
                    }
                    for (let j: number = i - 1; j >= 0; j--) {
                        if (!(i === sortedCollection[parseInt(i.toString(), 10)].pageIndex)){
                            count++;
                        }
                    }
                    if (count > sortedCollection[parseInt(i.toString(), 10)].pageIndex){
                        count = count - sortedCollection[parseInt(i.toString(), 10)].pageIndex;
                        this.loadedDocument.removePage(pageNumber + count);
                    }
                    else{
                        this.loadedDocument.removePage(pageNumber);
                    }
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
     * Applies the recorded Organize Pages action log to the current document and reloads the viewer.
     *
     * @param {string} actions - JSON-string action log from the `pageOrganizerSaved` event.
     * @param {boolean} [showPopup=true] - When `true`, prompt the user before applying; set `false` only if consent was already obtained.
     * @returns {void} No-op when `actions` is missing, empty, or not a JSON array.
     */
    public applyPageOrganizerActions(actions: string, showPopup: boolean = true): void {
        const parsedActions: IOrganizePageAction[] = this.parseOrganizePageActions(actions);
        if (!parsedActions || parsedActions.length === 0) {
            return;
        }
        if (showPopup) {
            this.showApplyActionsConfirmationPopup(parsedActions);
        } else {
            this.applyOrganizeActionsToDocument(parsedActions);
        }
    }

    /**
     * Parses the JSON-string action log into a typed `IOrganizePageAction[]`.
     * @param {string} actions - The JSON-string action log.
     * @returns {IOrganizePageAction[]} Parsed actions, or `[]` when input is empty, malformed, or not an array.
     * @private
     */
    private parseOrganizePageActions(actions: string): IOrganizePageAction[] {
        if (isNullOrUndefined(actions) || actions === '') {
            return [];
        }
        try {
            const parsed: any = JSON.parse(actions);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Shows a modal confirmation dialog before applying the action log.
     * `Cancel` (or close) discards actions; `Reload Document` applies them.
     *
     * When `isRedact` is `true`, the dialog is re-purposed for the collaborative
     * redaction flow: a peer has applied redactions to the shared document.
     * Confirming reload invokes the public `viewer.annotation.redact()` API on
     * the local viewer so the local document reflects the peer's redactions;
     * cancelling just closes the popup and leaves the local document untouched.
     *
     * @param {IOrganizePageAction[]} actions - Parsed actions awaiting confirmation.
     * @param {boolean} [isRedact] - When `true`, render the redact-mode dialog content/wiring.
     * @returns {void}
     * @private
     */
    public showApplyActionsConfirmationPopup(actions: IOrganizePageAction[], isRedact?: boolean): void {
        if (!this.pdfViewer || !this.pdfViewer.element) {
            return;
        }
        const elementID: string = this.pdfViewer.element.id;
        const dialogDiv: HTMLElement = createElement('div', {
            id: elementID + '_applyActions_dialog',
            className: 'e-pv-apply-actions-confirmation-popup'
        });
        if (this.pdfViewerBase && this.pdfViewerBase.pageContainer) {
            this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
        } else if (this.pdfViewer.element) {
            this.pdfViewer.element.appendChild(dialogDiv);
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: PdfRenderer = this;
        const header: string = isRedact ? this.pdfViewer.localeObj.getConstant('Apply Redaction') : this.pdfViewer.localeObj.getConstant('Apply Organize Actions');
        const applyDialog: Dialog = new Dialog({
            header: header,
            showCloseIcon: true,
            content: '<span class="e-pv-apply-actions-confirmation-text">' +
                this.pdfViewer.localeObj.getConstant('The document was modified and is now in read-only mode. Reload the page to fix this.') +
                '</span>',
            target: this.pdfViewer.element,
            isModal: true,
            animationSettings: { effect: 'None' },
            buttons: [
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') },
                    click: (): void => {
                        // Cancel in redact mode simply dismisses the popup; the local
                        // document is left untouched. For organize mode, signal the
                        // caller that the user opted out of applying the recorded actions
                        // by propagating a status string instead of the action log.
                        if (!isRedact) {
                            proxy.pdfViewer.firePageOrganizerSavedEventArgs(
                                proxy.pdfViewer.fileName, null,
                                JSON.stringify({ action: 'applyCancelled' }));
                        }
                        else {
                            proxy.pdfViewer.annotationModule.fireAnnotationChangedEvent(null, null);
                        }
                        applyDialog.hide();
                    }
                },
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Reload Document'), isPrimary: true },
                    click: (): void => {
                        if (isRedact) {
                            if (proxy.pdfViewer && proxy.pdfViewer.annotationModule) {
                                proxy.pdfViewer.annotation.redact();
                            }
                        } else {
                            proxy.applyOrganizeActionsToDocument(actions);
                        }
                        applyDialog.hide();
                    }
                }
            ],
            close: (): void => {
                if (dialogDiv && dialogDiv.parentElement) {
                    dialogDiv.parentElement.removeChild(dialogDiv);
                }
                applyDialog.destroy();
            }
        });
        applyDialog.appendTo(dialogDiv);
    }

    /**
     * Rebuilds a full `OrganizeDetails[]` from a modified-only action log and the source document.
     *
     * Algorithm:
     *  1. Seed a passthrough entry per source page (size/rotation from `pdfViewerBase.pageSize`).
     *  2. Apply each action: `delete`, `insert`, `rotate`, `rearrange`, `copy`, `importPages`.
     *  3. Re-stamp `currentPageIndex` to match the final array position.
     *
     * @param {IOrganizePageAction[]} actions - The modified-only action log.
     * @param {number} pageCount - The number of pages in the source document.
     * @param {any} pdfViewerBase - The PDF viewer's base context (provides `pageSize`).
     * @returns {OrganizeDetails[]} A full `OrganizeDetails[]` mirror.
     * @private
     */
    private rebuildOrganizePagesCollection(actions: IOrganizePageAction[], pageCount: number, pdfViewerBase: any): OrganizeDetails[] {
        // Seed one passthrough entry per source page; copy pageSize/rotation from the live document.
        const working: OrganizeDetails[] = [];
        for (let i: number = 0; i < pageCount; i++) {
            const sizeCopy: any = (pdfViewerBase && pdfViewerBase.pageSize &&
                pdfViewerBase.pageSize[parseInt(i.toString(), 10)]) ?
                JSON.parse(JSON.stringify(pdfViewerBase.pageSize[parseInt(i.toString(), 10)])) : null;
            working.push(new OrganizeDetails(
                i, i, null, false, false, false, false, false, false,
                0, sizeCopy,
                false, null, null, null
            ));
        }

        // Tracks source index -> current slot. Synthetic keys (>= pageCount) are used for
        // inserted/copied/imported pages so they cannot collide with a real source index.
        const map: Map<number, number> = new Map<number, number>();
        for (let i: number = 0; i < pageCount; i++) {
            map.set(i, i);
        }
        let insertedKey: number = pageCount;

        for (let k: number = 0; k < actions.length; k++) {
            const action: IOrganizePageAction = actions[parseInt(k.toString(), 10)];
            if (!action) {
                continue;
            }
            const targetIndex: number = action.targetIndex;
            switch (action.action) {
            case OrganizePageActionType.delete: {
                // Mark the entry as deleted and remove it from `working` so subsequent
                // actions index the post-delete layout; shift trailing slots down by 1.
                const cur: number = map.get(action.originalPageIndex);
                if (cur === undefined || cur < 0 || cur >= working.length) {
                    break;
                }
                const entry: OrganizeDetails = working[parseInt(cur.toString(), 10)];
                if (entry) {
                    entry.isDeleted = true;
                    entry.currentPageIndex = null;
                }
                working.splice(cur, 1);
                map.delete(action.originalPageIndex);
                map.forEach((value: number, key: number) => {
                    if (value > cur) {
                        map.set(key, value - 1);
                    }
                });
                break;
            }
            case OrganizePageActionType.insert: {
                // Splice a new entry at targetIndex and shift trailing slots up by 1.
                const newEntry: OrganizeDetails = new OrganizeDetails(
                    targetIndex, -1, null, true, false, false, false, false, false,
                    action.rotateAngle || 0,
                    action.pageSize, false, null, null, null
                );
                const insertAt: number = Math.min(Math.max(targetIndex, 0), working.length);
                working.splice(insertAt, 0, newEntry);
                map.set(insertedKey, insertAt);
                const nextKey: number = insertedKey;
                map.forEach((value: number, key: number) => {
                    if (key !== nextKey && value >= insertAt) {
                        map.set(key, value + 1);
                    }
                });
                insertedKey++;
                break;
            }
            case OrganizePageActionType.rotate: {
                // Update the rotation angle on the entry at the current slot.
                const cur: number = map.get(action.originalPageIndex);
                if (cur === undefined || cur < 0 || cur >= working.length) {
                    break;
                }
                const entry: OrganizeDetails = working[parseInt(cur.toString(), 10)];
                if (entry && action.rotateAngle !== undefined && action.rotateAngle !== null) {
                    entry.rotateAngle = action.rotateAngle;
                }
                break;
            }
            case OrganizePageActionType.rearrange: {
                // Layout-only move: relocate the entry to targetIndex; re-point shifted slots.
                const cur: number = map.get(action.originalPageIndex);
                if (cur === undefined || cur < 0 || cur >= working.length) {
                    break;
                }
                if (targetIndex === cur) {
                    break;
                }
                const safeTarget: number = Math.min(Math.max(targetIndex, 0), working.length - 1);
                const moved: OrganizeDetails = working.splice(cur, 1)[0];
                moved.rotateAngle = action.rotateAngle;
                working.splice(safeTarget, 0, moved);
                // Rotation is owned by the separate `rotate` action; preserve rotateAngle on the moved entry.
                map.set(action.originalPageIndex, safeTarget);
                // Re-point the entries in the shifted window so subsequent actions address the right slots.
                if (safeTarget < cur) {
                    map.forEach((value: number, key: number) => {
                        if (key !== action.originalPageIndex && value >= safeTarget && value < cur) {
                            map.set(key, value + 1);
                        }
                    });
                } else if (safeTarget > cur) {
                    map.forEach((value: number, key: number) => {
                        if (key !== action.originalPageIndex && value > cur && value <= safeTarget) {
                            map.set(key, value - 1);
                        }
                    });
                }
                break;
            }
            case OrganizePageActionType.copy: {
                // Splice a copied entry at targetIndex and shift trailing slots up by 1.
                const newEntry: OrganizeDetails = new OrganizeDetails(
                    targetIndex, -1,
                    action.sourceOriginalPageIndex !== undefined ? action.sourceOriginalPageIndex : action.originalPageIndex,
                    false, false, true, false, false, false,
                    action.rotateAngle || 0, action.pageSize,
                    false, null, null, null
                );
                const insertAt: number = Math.min(Math.max(targetIndex, 0), working.length);
                working.splice(insertAt, 0, newEntry);
                map.set(insertedKey, insertAt);
                const nextKey: number = insertedKey;
                map.forEach((value: number, key: number) => {
                    if (key !== nextKey && value >= insertAt) {
                        map.set(key, value + 1);
                    }
                });
                insertedKey++;
                break;
            }
            case OrganizePageActionType.importPages: {
                // Splice an imported-page entry at targetIndex and shift trailing slots up by 1.
                const newEntry: OrganizeDetails = new OrganizeDetails(
                    targetIndex, -1, null, false, false, false, false, false, false,
                    action.rotateAngle || 0, null,
                    true,
                    action.documentName || null,
                    action.password || null,
                    action.documentData || null
                );
                const insertAt: number = Math.min(Math.max(targetIndex, 0), working.length);
                working.splice(insertAt, 0, newEntry);
                map.set(insertedKey, insertAt);
                const nextKey: number = insertedKey;
                map.forEach((value: number, key: number) => {
                    if (key !== nextKey && value >= insertAt) {
                        map.set(key, value + 1);
                    }
                });
                insertedKey++;
                break;
            }
            default:
                break;
            }
        }

        // Re-stamp currentPageIndex to match the final position of each non-deleted entry.
        for (let i: number = 0; i < working.length; i++) {
            const entry: OrganizeDetails = working[parseInt(i.toString(), 10)];
            if (entry && !entry.isDeleted) {
                entry.currentPageIndex = i;
            }
        }
        return working;
    }

    /**
     * Applies the action log to the loaded document and reloads the viewer.
     *
     *  1. Rebuilds a full `OrganizeDetails[]` via {@link rebuildOrganizePagesCollection}.
     *  2. Mirrors it onto `pageOrganizer.organizePagesCollection` and flags the document as modified.
     *  3. Saves through the same code path as the organizer's Save button and reloads the viewer.
     *
     * @param {IOrganizePageAction[]} actions - The modified-only action log.
     * @returns {void}
     * @private
     */
    private applyOrganizeActionsToDocument(actions: IOrganizePageAction[]): void {
        const pdfViewerBase: any = this.pdfViewerBase;
        const pageCount: number = this.pdfViewer.pageCount;
        if (!pageCount || pageCount < 1) {
            return;
        }
        // Rebuild the full OrganizeDetails mirror, then assign it and run the existing save flow.
        const mirror: OrganizeDetails[] = this.rebuildOrganizePagesCollection(actions, pageCount, pdfViewerBase);
        this.pdfViewer.pageOrganizer.organizePagesCollection = JSON.parse(JSON.stringify(mirror));
        this.pdfViewer.pageOrganizer.isDocumentModified = true;
        this.pdfViewer.pageOrganizer.totalCheckedCount = 0;
        pdfViewerBase.isOrganizePageSaveAction = true;
        this.pdfViewer.saveAsBlob().then((data: any) => {
            pdfViewerBase.isOrganizePageSaveAction = false;
            if (!isNullOrUndefined(data) && data.length > 0) {
                this.pdfViewer.loadDocInternally(data, null, false);
                this.pdfViewerBase.updateDocumentEditedProperty(true);
            }
        });
    }

    /**
     * @param {any} jsonObject - jsonObject
     * @private
     * @returns {any} - any
     */
    public importAnnotations(jsonObject: any): any {
        try {
            const annotationRenderer: AnnotationRenderer = new AnnotationRenderer(this.pdfViewer, this.pdfViewerBase);
            const annotData: string = jsonObject['importedData'];
            if (this.pdfViewer.annotation.isApplyingRemoteUpdate && this.pdfViewer.annotation.isModifyAction) {
                // Extract page and annotation name from XFDF modify element
                const { pageIndex, annotationName } = this.extractModifyElementData(annotData);
                if (pageIndex !== null && annotationName && this.loadedDocument) {
                    const page: PdfPage = this.loadedDocument.getPage(pageIndex);
                    if (page && page.annotations && page.annotations.count > 0) {
                        // Iterate in reverse to safely remove items
                        for (let j: number = page.annotations.count - 1; j >= 0; j--) {
                            const annotation: any = page.annotations.at(j);
                            if (annotation && annotation.name === annotationName) {
                                page.annotations.removeAt(j);
                                break; // Remove only the matching annotation
                            }
                        }
                    }
                }
            }
            annotationRenderer.removeSignatureTypeAnnot(jsonObject, this.loadedDocument);
            const annotationDataFormat: any = jsonObject['annotationDataFormat'];
            if (typeof annotationDataFormat === 'string') {
                this.loadedDocument._allowImportCustomData = true;
                switch (annotationDataFormat.toLowerCase()) {
                case 'json':
                    this.loadedDocument.importAnnotations(annotData, DataFormat.json);
                    break;
                case 'xfdf':
                    if (typeof annotData === 'string' && !this.isBase64(annotData)) {
                        this.loadedDocument.importAnnotations(new TextEncoder().encode(annotData), DataFormat.xfdf);
                    }
                    else {
                        this.loadedDocument.importAnnotations(annotData, DataFormat.xfdf);
                    }
                    break;
                default:
                    break;
                }
                for (let i: number = 0; i < this.loadedDocument.pageCount; i++) {
                    const pageNumber: number = i;
                    const pageSize: Size = this.getPageSize(pageNumber);
                    const renderer: PageRenderer = new PageRenderer(this.pdfViewer, this.pdfViewerBase);
                    renderer.exportAnnotationComments(pageNumber, pageSize, true);
                    this.annotationDetailCollection[i.toString()] = new Annotations();
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].textMarkupAnnotation = renderer.textMarkupAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].shapeAnnotation = renderer.shapeAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].measureShapeAnnotation = renderer.measureAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].stampAnnotations = renderer.rubberStampAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].stickyNotesAnnotation = renderer.stickyAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].freeTextAnnotation = renderer.freeTextAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].signatureAnnotation = renderer.signatureAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].signatureInkAnnotation =
                        renderer.signatureInkAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].redactionAnnotation =
                        renderer.redactionAnnotationList;
                    this.annotationDetailCollection[parseInt(i.toString(), 10)].annotationOrder = renderer.annotationOrder;
                    this.removeAnnotationsFromCollection(renderer);
                }
                const returnAnnot: any = JSON.parse(JSON.stringify(this.annotationDetailCollection));
                if (Object.prototype.hasOwnProperty.call(jsonObject, 'uniqueId')) {
                    return { pdfAnnotation: returnAnnot, uniqueId: jsonObject['uniqueId'] };
                }
                else {
                    return { pdfAnnotation: returnAnnot };
                }
            }
        }
        catch (e) {
            return e.message;
        }
    }

    private removeAnnotationsFromCollection(renderer: PageRenderer): void {
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
     * @param {string} jsonObject - jsonObject
     * @param {boolean} isObject - isObject
     * @private
     * @returns {void}
     */
    public exportAnnotation(jsonObject: { [key: string]: string | boolean }, isObject: boolean): Uint8Array {
        const annotationRenderer: AnnotationRenderer = new AnnotationRenderer(this.pdfViewer, this.pdfViewerBase);
        annotationRenderer.removeSignatureTypeAnnot(jsonObject, this.loadedDocument);
        this.orderAnnotations(jsonObject);
        const settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
        const annotationDataFormat: string = jsonObject['annotationDataFormat'] as string;
        let fileName: string;
        let exportObject: Uint8Array;
        if (typeof annotationDataFormat === 'string') {
            switch (annotationDataFormat.toLowerCase()) {
            case 'json':
                settings.dataFormat = DataFormat.json;
                if (isObject) {
                    settings.exportAppearance = isObject;
                    exportObject = this.loadedDocument.exportAnnotations(settings);
                    return exportObject;
                } else {
                    fileName = this.changeFileExtension(this.pdfViewer.fileName, 'json');
                    return this.loadedDocument.exportAnnotations(settings);
                }
            case 'xfdf':
                settings.dataFormat = DataFormat.xfdf;
                if (isObject) {
                    settings.exportAppearance = isObject;
                    exportObject = this.loadedDocument.exportAnnotations(settings);
                    return exportObject;

                } else {
                    fileName = this.changeFileExtension(this.pdfViewer.fileName, 'xfdf');
                    return this.loadedDocument.exportAnnotations(settings);
                }
                // Add more cases for other supported formats as needed
            default:
                break;
            }
        }
        return null;

    }

    private extractModifyElementData(xfdfData: string): { pageIndex: number | null; annotationName: string | null } {
        try {
            const parser: DOMParser = new DOMParser();
            const xmlDoc: XMLDocument = parser.parseFromString(xfdfData, 'text/xml');
            if (xmlDoc.documentElement.nodeName === 'parsererror') {
                return { pageIndex: null, annotationName: null };
            }
            // Extract from pure XFDF with <annots> element
            // The annotData is always a pure XFDF string with <annots> containing annotation elements
            const annotsElement: Element = this.getDirectChildElement(xmlDoc.documentElement, 'annots');
            if (annotsElement && annotsElement.children.length > 0) {
                // Get the first annotation element (square, circle, highlight, text, etc.)
                const firstAnnotation: Element = annotsElement.firstElementChild;
                if (firstAnnotation) {
                    const pageStr: string = firstAnnotation.getAttribute('page');
                    const annotName: string = firstAnnotation.getAttribute('name');
                    const pageIndex: number = pageStr ? parseInt(pageStr, 10) : null;
                    return { pageIndex, annotationName: annotName };
                }
            }
            return { pageIndex: null, annotationName: null };
        } catch (error) {
            return { pageIndex: null, annotationName: null };
        }
    }

    private getDirectChildElement(parent: Element, elementName: string): Element {
        // Matches the pattern in annotation.ts for consistency
        if (isNullOrUndefined(parent)) {
            return null;
        }
        for (let i: number = 0; i < parent.childNodes.length; i++) {
            const childNode: Node = parent.childNodes[parseInt(i.toString(), 10)];
            if (childNode.nodeType === 1 && childNode.nodeName.toLowerCase() === elementName.toLowerCase()) {
                return childNode as Element;
            }
        }
        return null;
    }

    private changeFileExtension(filename: string, newExtension: string): string {
        const lastDotIndex: number = filename.lastIndexOf('.');
        if (lastDotIndex === -1) {
            // No extension found in the filename
            return filename + '.' + newExtension;
        }
        const nameWithoutExtension: string = filename.slice(0, lastDotIndex);
        return nameWithoutExtension + '.' + newExtension;
    }

    private orderAnnotations(jsonObject: { [key: string]: string | boolean }): void {
        const annotationRenderer: AnnotationRenderer = new AnnotationRenderer(this.pdfViewer, this.pdfViewerBase);
        const signatureModule: SignatureBase = new SignatureBase(this.pdfViewer, this.pdfViewerBase);
        if (Object.prototype.hasOwnProperty.call(jsonObject, 'isAnnotationsExist') && jsonObject.isAnnotationsExist) {
            if (Object.prototype.hasOwnProperty.call(jsonObject, 'annotationCollection')) {
                const annotationDetails: any = JSON.parse(jsonObject.annotationCollection as string);
                if (Object.prototype.hasOwnProperty.call(jsonObject, 'newAnnotations')) {
                    // Extract modifiedLinkPageEntries from jsonObject (computed once in constructJsonDownload)
                    const modifiedLinkPageEntries: { pageIndex: number; annotationIndex: number | null }[] =
                        (Object.prototype.hasOwnProperty.call(jsonObject, 'modifiedLinkPageEntries') &&
                         jsonObject['modifiedLinkPageEntries'])
                            ? JSON.parse(jsonObject['modifiedLinkPageEntries'] as string)
                            : [];
                    const modifiedPages: Set<number> = new Set<number>(
                        modifiedLinkPageEntries.map((e: { pageIndex: number; annotationIndex: number | null }) => e.pageIndex)
                    );
                    let newAnnotations: any;
                    if (jsonObject['action'] === 'ExportAnnotations') {
                        newAnnotations = annotationDetails;
                    }
                    else {
                        newAnnotations = JSON.parse(jsonObject.newAnnotations as string);
                    }
                    for (let details of newAnnotations) {
                        let annotationType: any = details.shapeAnnotationType;
                        if (Object.prototype.hasOwnProperty.call(details, 'calibrate') && (details['shapeAnnotationType'] === 'Circle' || details['shapeAnnotationType'] === 'Line' || details['shapeAnnotationType'] === 'Polygon' || details['shapeAnnotationType'] === 'Polyline')) {
                            annotationType = 'measureShapes';
                        }
                        else if (!(Object.prototype.hasOwnProperty.call(details, 'calibrate')) && (details['shapeAnnotationType'] === 'Line' || details['shapeAnnotationType'] === 'Circle' || details['shapeAnnotationType'] === 'Polygon' || details['shapeAnnotationType'] === 'Square' || details['shapeAnnotationType'] === 'Polyline')) {
                            annotationType = 'shapeAnnotation';
                        }
                        switch (annotationType) {
                        case 'textMarkup':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'textMarkupAnnotations')) {
                                const textMarkupDetails: any = JSON.parse(jsonObject.textMarkupAnnotations as string);
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
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'shapeAnnotations')) {
                                const shapeDetails: any = JSON.parse(jsonObject.shapeAnnotations as string);
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = shapeDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const shape: any = this.findAnnotationById(pageAnnotations, details['annotationId']);
                                if (shape) {
                                    details = shape;
                                    annotationRenderer.addShape(details, page);
                                }
                            }
                            break;
                        case 'Link':
                            if (jsonObject['action'] !== 'ExportAnnotations' && !isNullOrUndefined(details) &&
                                !isNullOrUndefined(details.pageNumber) &&
                                !modifiedPages.has(parseInt(details.pageNumber.toString(), 10))) {
                                break;
                            }
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'linkAnnotations')) {
                                const linkDetails: any = JSON.parse(jsonObject.linkAnnotations as string);
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = linkDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const link: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                                if (link) {
                                    details = link;
                                    annotationRenderer.addLink(details, page, this.loadedDocument);
                                }
                            }
                            break;
                        case 'Redaction':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'redactionAnnotations')) {
                                const redactionDetails: any = JSON.parse(jsonObject.redactionAnnotations as string);
                                const canRedact: boolean = jsonObject.canRedact ? JSON.parse(jsonObject.canRedact as string) : false;
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = redactionDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const redact: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                                if (redact) {
                                    details = redact;
                                    annotationRenderer.addRedact(details, page, canRedact);
                                }
                            }
                            break;
                        case 'stamp':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'stampAnnotations')) {
                                const stampdetails: any = JSON.parse(jsonObject.stampAnnotations as string);
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
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'measureShapeAnnotations')) {
                                const shapeDetails: any = JSON.parse(jsonObject.measureShapeAnnotations as string);
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = shapeDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const shape: any = this.findAnnotationById(pageAnnotations, details['annotationId']);
                                if (shape) {
                                    details = shape;
                                    annotationRenderer.addMeasure(details, page);
                                }
                            }
                            break;
                        case 'sticky':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'stickyNotesAnnotation')) {
                                const shapeDetails: any = JSON.parse(jsonObject.stickyNotesAnnotation as string);
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = shapeDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const shape: any = this.findAnnotationById(pageAnnotations, details['annotationId']);
                                if (shape) {
                                    details = shape;
                                    annotationRenderer.addStickyNotes(details, page);
                                }
                            }
                            break;
                        case 'Ink':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'inkSignatureData')) {
                                const shapeDetails: any = JSON.parse(jsonObject.inkSignatureData as string);
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = shapeDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const shape: any = this.findAnnotationById(pageAnnotations, details['annotationId']);
                                if (shape) {
                                    details = shape;
                                    annotationRenderer.saveInkSignature(details, page);
                                }
                            }
                            break;
                        case 'FreeText':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'freeTextAnnotation')) {
                                const freeTextDetails: any = JSON.parse(jsonObject.freeTextAnnotation as string);
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = freeTextDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const defaultFonts: string[] = ['Helvetica', 'Times New Roman', 'Courier', 'Symbol', 'ZapfDingbats'];
                                const freeText: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                                if (!isNullOrUndefined(freeText)) {
                                    details = freeText;
                                    if (!isNullOrUndefined(this.FallbackFontCollection) &&
                                        Object.keys(this.FallbackFontCollection).length !== 0 &&
                                        defaultFonts.indexOf(details.fontFamily) === -1) {
                                        annotationRenderer.addFreeText(details, page, this.FallbackFontCollection);
                                    }
                                    else {
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
        }
    }

    private findAnnotationById(pageAnnotations: any[], annotationId: any): any {
        if (isNullOrUndefined(pageAnnotations) || isNullOrUndefined(annotationId)) {
            return undefined;
        }
        const id: string = annotationId.toString();
        return pageAnnotations.find((obj: any) =>
            !isNullOrUndefined(obj) && !isNullOrUndefined(obj['annotName']) && obj['annotName'].toString() === id);
    }

    private updateAnnotations(jsonObject: { [key: string]: string | boolean }): void {
        const annotationRenderer: AnnotationRenderer = new AnnotationRenderer(this.pdfViewer, this.pdfViewerBase);
        const signatureModule: SignatureBase = new SignatureBase(this.pdfViewer, this.pdfViewerBase);
        if (Object.prototype.hasOwnProperty.call(jsonObject, 'isAnnotationsExist') && jsonObject.isAnnotationsExist) {
            if (Object.prototype.hasOwnProperty.call(jsonObject, 'annotationCollection')) {
                const annotationDetails: any = JSON.parse(jsonObject.annotationCollection as string);
                if (Object.prototype.hasOwnProperty.call(jsonObject, 'modifiedAnnotations')) {
                    const updatedAnnotations: any = JSON.parse(jsonObject.modifiedAnnotations as string);
                    for (let details of updatedAnnotations) {
                        let annotationType: any = details.shapeAnnotationType;
                        if (Object.prototype.hasOwnProperty.call(details, 'calibrate') && (details['shapeAnnotationType'] === 'Circle' || details['shapeAnnotationType'] === 'Line' || details['shapeAnnotationType'] === 'Polygon' || details['shapeAnnotationType'] === 'Polyline')) {
                            annotationType = 'measureShapes';
                        }
                        else if (!(Object.prototype.hasOwnProperty.call(details, 'calibrate')) && (details['shapeAnnotationType'] === 'Line' || details['shapeAnnotationType'] === 'Circle' || details['shapeAnnotationType'] === 'Polygon' || details['shapeAnnotationType'] === 'Square' || details['shapeAnnotationType'] === 'Polyline')) {
                            annotationType = 'shapeAnnotation';
                        }
                        switch (annotationType) {
                        case 'textMarkup':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'textMarkupAnnotations')) {
                                const textMarkupDetails: any = JSON.parse(jsonObject.textMarkupAnnotations as string);
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = textMarkupDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const textMarkup: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                                if (textMarkup) {
                                    details = textMarkup;
                                    if (details.status === AnnotationStatus.ExistingModified) {
                                        annotationRenderer.updateTextMarkup(details, this.loadedDocument);
                                    }
                                }
                            }
                            break;
                        case 'shapeAnnotation':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'shapeAnnotations')) {
                                const shapeDetails: any = JSON.parse(jsonObject.shapeAnnotations as string);
                                const pageNumber: string = details['pageNumber'].toString();
                                const previousPageNumber: string = details['previousPageNumer']  && details['previousPageNumer'].toString();
                                const annotationCount: { [key: string]: object } = shapeDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const shape: any = this.findAnnotationById(pageAnnotations, details['annotationId']);
                                if (shape) {
                                    details = shape;
                                    if (details.status === AnnotationStatus.ExistingModified) {
                                        if (!isNullOrUndefined(previousPageNumber)) {
                                            const previousPage: PdfPage = this.loadedDocument.getPage(parseInt(previousPageNumber, 10));
                                            const annotationIndex: number = parseInt(details['annotationIndex'].toString(), 10);
                                            const pdfAnnotations: PdfAnnotationCollection = previousPage.annotations;
                                            const matchedAnnotation: any = this.pdfViewerBase.pdfAnnotationList.find(
                                                function (item: any): boolean {
                                                    return item.annotationIndex === annotationIndex &&
                                                        (item.pageIndex === parseInt(previousPageNumber, 10));
                                                });
                                            if (previousPage) {
                                                for (let i: number = 0; i < pdfAnnotations.count; i++) {
                                                    const currentAnnotation: PdfAnnotation = pdfAnnotations.at(i);
                                                    if (currentAnnotation._dictionary.objId ===
                                                        matchedAnnotation.annotation._dictionary.objId) {
                                                        pdfAnnotations.remove(currentAnnotation);
                                                        break;
                                                    }
                                                }
                                            }
                                            annotationRenderer.addShape(details, page);
                                        }
                                        else {
                                            annotationRenderer.updateShape(details, page);
                                        }
                                    }
                                }
                            }
                            break;
                        case 'Redaction':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'redactionAnnotations')) {
                                const redactionDetails: any = JSON.parse(jsonObject.redactionAnnotations as string);
                                const canRedact: boolean = jsonObject.canRedact as boolean;
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = redactionDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const redact: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                                if (redact) {
                                    details = redact;
                                    if (details.status === AnnotationStatus.ExistingModified) {
                                        annotationRenderer.updateRedact(details, page, canRedact);
                                    }
                                }
                            }
                            break;
                        case 'stamp':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'stampAnnotations')) {
                                const stampdetails: any = JSON.parse(jsonObject.stampAnnotations as string);
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = stampdetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const stamp: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                                if (stamp) {
                                    details = stamp;
                                    if (details.status === AnnotationStatus.ExistingModified) {
                                        annotationRenderer.updateCustomStampAnnotation(details, page);
                                    }
                                }
                            }
                            break;
                        case 'measureShapes':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'measureShapeAnnotations')) {
                                const shapeDetails: any = JSON.parse(jsonObject.measureShapeAnnotations as string);
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = shapeDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const shape: any = this.findAnnotationById(pageAnnotations, details['annotationId']);
                                if (shape) {
                                    details = shape;
                                    if (details.status === AnnotationStatus.ExistingModified) {
                                        annotationRenderer.updateMeasure(details, page);
                                    }
                                }
                            }
                            break;
                        case 'sticky':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'stickyNotesAnnotation')) {
                                const shapeDetails: any = JSON.parse(jsonObject.stickyNotesAnnotation as string);
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = shapeDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const shape: any = this.findAnnotationById(pageAnnotations, details['annotationId']);
                                if (shape) {
                                    details = shape;
                                    if (details.status === AnnotationStatus.ExistingModified) {
                                        annotationRenderer.updateStickyNotes(details, page);
                                    }
                                }
                            }
                            break;
                        case 'Ink':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'inkSignatureData')) {
                                const shapeDetails: any = JSON.parse(jsonObject.inkSignatureData as string);
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = shapeDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const shape: any = this.findAnnotationById(pageAnnotations, details['annotationId']);
                                if (shape) {
                                    details = shape;
                                    if (details.status === AnnotationStatus.ExistingModified) {
                                        annotationRenderer.updateInkSignature(details, page);
                                    }
                                }
                            }
                            break;
                        case 'FreeText':
                            if (Object.prototype.hasOwnProperty.call(jsonObject, 'freeTextAnnotation')) {
                                const freeTextDetails: any = JSON.parse(jsonObject.freeTextAnnotation as string);
                                const pageNumber: string = details['pageNumber'].toString();
                                const annotationCount: { [key: string]: object } = freeTextDetails[parseInt(pageNumber, 10)];
                                const pageAnnotations: any = annotationCount;
                                const page: PdfPage = this.loadedDocument.getPage(parseInt(pageNumber, 10));
                                const defaultFonts: string[] = ['Helvetica', 'Times New Roman', 'Courier', 'Symbol', 'ZapfDingbats'];
                                const freeText: any = pageAnnotations.find((obj: any) => obj['annotName'].toString() === details['annotationId'].toString());
                                if (!isNullOrUndefined(freeText)) {
                                    details = freeText;
                                    if (details.status === AnnotationStatus.ExistingModified) {
                                        if (!isNullOrUndefined(this.FallbackFontCollection) &&
                                            Object.keys(this.FallbackFontCollection).length !== 0 &&
                                            defaultFonts.indexOf(details.fontFamily) === -1) {
                                            annotationRenderer.updateFreeText(details, page, this.FallbackFontCollection);
                                        }
                                        else {
                                            annotationRenderer.updateFreeText(details, page);
                                        }
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
                            signatureModule.updateSignatureAsAnnotatation(jsonObject, this.loadedDocument);
                        }
                        else {
                            signatureModule.updateSignatureData(jsonObject, this.loadedDocument);
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {any} jsonObject - jsonObject
     * @private
     * @returns {void}
     */
    public getAnnotationComments(jsonObject: any): any {
        try {
            if (Object.prototype.hasOwnProperty.call(jsonObject, 'pageStartIndex') && !isNullOrUndefined(jsonObject.pageStartIndex)) {
                const pageStartIndex: number = parseInt(jsonObject.pageStartIndex, 10);
                const pageEndIndex: number = parseInt(jsonObject.pageEndIndex, 10);
                const annotationDetails: { [key: string]: object } = {};
                for (let i: number = pageStartIndex; i < pageEndIndex; i++) {
                    const pageNumber: number = i;
                    const pageSize: Size = this.getPageSize(pageNumber);
                    this.renderer = new PageRenderer(this.pdfViewer, this.pdfViewerBase);
                    annotationDetails[pageNumber.toString()] = this.renderer.exportAnnotationComments(pageNumber, pageSize);
                }
                return {uniqueId: jsonObject.uniqueId , annotationDetails: annotationDetails ,
                    startPageIndex: pageStartIndex, endPageIndex: pageEndIndex, isAnnotationPresent: this.renderer.isAnnotationPresent};
            }
            return '';
        } catch (error) {
            return error.message;
        }
    }

    /**
     * @param {any} jsonObject - jsonObject
     * @private
     * @returns {void}
     */
    public getBookmarks(jsonObject: any): any {
        try {
            const bookmark: PdfBookmarkBase = this.loadedDocument.bookmarks;
            if (!isNullOrUndefined(bookmark) && Object.prototype.hasOwnProperty.call(jsonObject, 'bookmarkStyles')) {
                this.bookmarkStyles = [];
                for (let i: number = 0; i < bookmark.count; i++) {
                    this.retrieveFontStyles(bookmark.at(i), false);
                }
            }
            if (isNullOrUndefined(bookmark) || isNullOrUndefined(bookmark.count) || bookmark.count === 0) {
                return null;
            }
            else {
                this.bookmarkCollection = [];
                this.bookmarkDictionary = {};
                for (let i: number = 0; i < bookmark.count; i++) {
                    const pdfLoadedBookmark: PdfBookmark = bookmark.at(i);
                    const parentBookmarkDestination: BookmarkDestination = new BookmarkDestination();
                    const bookmarkDestination: PdfDestination = pdfLoadedBookmark.destination ?
                        pdfLoadedBookmark.destination : pdfLoadedBookmark.namedDestination ?
                            pdfLoadedBookmark.namedDestination.destination ? pdfLoadedBookmark.namedDestination.destination : null : null;
                    parentBookmarkDestination.X = !isNullOrUndefined(bookmarkDestination) ? bookmarkDestination.location.x : 0;
                    parentBookmarkDestination.PageIndex = !isNullOrUndefined(bookmarkDestination) ?
                        (!isNullOrUndefined(bookmarkDestination.pageIndex) ? bookmarkDestination.pageIndex : 0) : 0;
                    parentBookmarkDestination.Zoom = !isNullOrUndefined(bookmarkDestination) ? bookmarkDestination.zoom : 0;
                    const parentBookmark: BookmarkBase = new BookmarkBase();
                    parentBookmark.Id = ++this.id;
                    parentBookmark.Title = pdfLoadedBookmark.title;
                    parentBookmark.Child = [];
                    parentBookmark.FileName = !isNullOrUndefined((pdfLoadedBookmark as any).action) ? (pdfLoadedBookmark as any).action.toString() : '';
                    if (!isNullOrUndefined(bookmarkDestination) && !isNullOrUndefined(bookmarkDestination.page)) {
                        if (bookmarkDestination.page.rotation === PdfRotationAngle.angle90) {
                            parentBookmarkDestination.Y = this.convertPointToPixel(bookmarkDestination.page.size.width) -
                                this.convertPointToPixel(Math.abs(bookmarkDestination.location.y));
                        }
                        else if (bookmarkDestination.page.rotation === PdfRotationAngle.angle270) {
                            parentBookmarkDestination.Y = this.convertPointToPixel(Math.abs(bookmarkDestination.location.y));
                        }
                        else {
                            parentBookmarkDestination.Y = this.convertPointToPixel(bookmarkDestination.page.size.height) -
                                this.convertPointToPixel(Math.abs(bookmarkDestination.location.y));
                        }
                    }
                    else {
                        parentBookmarkDestination.Y = 0;
                    }
                    this.bookmarkDictionary[this.id.toString()] = parentBookmarkDestination;
                    parentBookmark.Child = this.getChildrenBookmark(pdfLoadedBookmark);
                    if (parentBookmark.Child.length > 0) {
                        parentBookmark.HasChild = true;
                    }
                    this.bookmarkCollection.push(parentBookmark);
                }
            }
            if (Object.prototype.hasOwnProperty.call(jsonObject, 'uniqueId')) {
                return { Bookmarks: JSON.parse(JSON.stringify(this.bookmarkCollection)), BookmarksDestination: JSON.parse(JSON.stringify(this.bookmarkDictionary)), uniqueId: jsonObject['uniqueId'].toString(), Bookmarkstyles: JSON.parse(JSON.stringify(this.bookmarkStyles)) };
            }
            else {
                return { Bookmarks : JSON.parse(JSON.stringify(this.bookmarkCollection)), BookmarksDestination :
                    JSON.parse(JSON.stringify(this.bookmarkDictionary)), Bookmarkstyles : JSON.parse(JSON.stringify(this.bookmarkStyles))};
            }
        }
        catch (error) {
            return error.message;
        }
    }

    private retrieveFontStyles(listElement: PdfBookmarkBase, isChild: boolean): void {
        const currentElement: PdfBookmark = listElement as PdfBookmark;
        const currentStyles: BookmarkStyles = new BookmarkStyles();
        if (!isNullOrUndefined(currentElement)) {
            if (!isNullOrUndefined(currentElement.color)) {
                currentStyles.Color = 'rgba(' + currentElement.color.r + ',' + currentElement.color.g + ',' + currentElement.color.b + ',' + 1 + ')';
            }
            currentStyles.FontStyle = this.getPdfTextStyleString(currentElement.textStyle);
            currentStyles.Text = currentElement.title;
            currentStyles.IsChild = isChild;
            this.bookmarkStyles.push(currentStyles);
            this.getChildrenStyles(listElement);
        }
    }

    private getPdfTextStyleString(textStyle: PdfTextStyle): string {
        switch (textStyle) {
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

    private getChildrenStyles(bookmarks: PdfBookmarkBase): void {
        for (let i: number = 0; i < bookmarks.count; i++) {
            this.retrieveFontStyles(bookmarks.at(i), true);
        }
    }

    private getChildrenBookmark(pdfLoadedBookmark: PdfBookmark): BookmarkBase[] {
        const childBookmarkCollection: BookmarkBase[] = [];
        if (!isNullOrUndefined(pdfLoadedBookmark) && !isNullOrUndefined(pdfLoadedBookmark.count) && pdfLoadedBookmark.count > 0) {
            for (let i: number = 0; i < pdfLoadedBookmark.count; i++) {
                const child: PdfBookmark = pdfLoadedBookmark.at(i);
                const childBookmarkDestination: PdfDestination = child.destination ? child.destination :
                    child.namedDestination ? child.namedDestination.destination ? child.namedDestination.destination : null : null;
                this.id++;
                const title: string = child.title;
                this.pageIndex = !isNullOrUndefined(childBookmarkDestination) ? childBookmarkDestination.pageIndex : 0;
                this.x = !isNullOrUndefined(childBookmarkDestination) ? childBookmarkDestination.location.x : 0;
                const yPosition: number = !isNullOrUndefined(childBookmarkDestination) ? Math.abs(childBookmarkDestination.location.y) : 0;
                if (!isNullOrUndefined(childBookmarkDestination) && !isNullOrUndefined(childBookmarkDestination.page)) {
                    if (childBookmarkDestination.page.rotation === PdfRotationAngle.angle90) {
                        this.y = this.convertPointToPixel(childBookmarkDestination.page.size.width) - this.convertPointToPixel(yPosition);
                    }
                    else if (childBookmarkDestination.page.rotation === PdfRotationAngle.angle270) {
                        this.y = this.convertPointToPixel(yPosition);
                    }
                    else {
                        this.y = this.convertPointToPixel(childBookmarkDestination.page.size.height) - this.convertPointToPixel(yPosition);
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
                if (childrenBookmark.Child.length > 0) {
                    childrenBookmark.HasChild = true;
                }
            }
        }
        return childBookmarkCollection;
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.loadedDocument) {
            this.loadedDocument.destroy();
            this.loadedDocument = null;
        }
        if (this.loadImportedDocument) {
            this.loadImportedDocument.destroy();
            this.loadImportedDocument = null;
        }
        if (this.document) {
            this.document.destroy();
            this.document = null;
        }
        this.loadedByteArray = null;
        this.digitialByteArray = null;
        this.loadImportedBase64String = null;
        this.password = null;
        this.importedDocpassword = null;
        this.pageSizes = {};
        this.documentTextCollection = [];
        this.bookmarkStyles = [];
        this.bookmarkCollection = [];
        this.pageRotationCollection = [];
        this.bookmarkDictionary = {};
        this.annotationDetailCollection = {};
        this.textCollections = [];
        this.restrictionList = [];
        this._fallbackFontCollection = {};
        this.searchResults = {};
        this.renderer = null;
        this.formFieldsBase = null;
        this.signatureBase = null;
        this.annotationRenderer = null;
    }

    /**
     * @param {number} pageIndex - pageIndex
     * @private
     * @returns {void}
     */
    public getHyperlinks(pageIndex: number): any {
        if (isNullOrUndefined(this.renderer)) {
            this.renderer = new PageRenderer(this.pdfViewer, this.pdfViewerBase);
        }
        if (isNullOrUndefined(this.renderer.hyperlinks)) {
            this.renderer.hyperlinks = [];
        }
        this.exportHyperlinks(pageIndex, this.getPageSize(pageIndex), false, true);
        return{hyperlinks: this.renderer.hyperlinks, hyperlinkBounds: this.renderer.hyperlinkBounds,
            linkAnnotations: this.renderer.annotationList , linkPage: this.renderer.annotationDestPage,
            annotationLocationY: this.renderer.annotationYPosition, annotationLocationX: this.renderer.annotationXPosition,
            linkPageZoom: this.renderer.linkPageZoom};
    }

    private exportHyperlinks(pageIndex: number, pageSize: Size, isExport: boolean, isAnnotationNeeded: boolean): void {
        if (pageIndex >= 0 && pageIndex < this.loadedDocument.pageCount) {
            const page: PdfPage = this.loadedDocument.getPage(pageIndex);
            this.renderer.hyperlinks = [];
            this.renderer.hyperlinkBounds = [];
            this.renderer.annotationDestPage = [];
            this.renderer.annotationList = [];
            this.renderer.annotationYPosition = [];
            this.renderer.annotationXPosition = [];
            this.renderer.linkPageZoom = [];
            for (let i: number = 0; i < page.annotations.count; i++) {
                if (page.annotations.at(i) instanceof PdfUriAnnotation) {
                    const pdfLoadedUriAnnotation: PdfUriAnnotation = page.annotations.at(i) as PdfUriAnnotation;
                    const rectangle: AnnotBounds = this.getHyperlinkBounds(pdfLoadedUriAnnotation.bounds as Rect, pageSize, page.rotation);
                    if (isNullOrUndefined(this.renderer.hyperlinks)) {
                        this.renderer.hyperlinks = [];
                        this.renderer.hyperlinkBounds = [];
                    }
                    this.renderer.hyperlinks.push(pdfLoadedUriAnnotation.uri);
                    this.renderer.hyperlinkBounds.push(rectangle);
                }
                else if (page.annotations.at(i) instanceof PdfTextWebLinkAnnotation) {
                    const pdfLoadedTextWebLinkAnnotation: PdfTextWebLinkAnnotation = page.annotations.at(i) as PdfTextWebLinkAnnotation;
                    const rectangle: AnnotBounds = this.getHyperlinkBounds(pdfLoadedTextWebLinkAnnotation.bounds as Rect,
                                                                           pageSize, page.rotation);
                    if (isNullOrUndefined(this.renderer.hyperlinks)) {
                        this.renderer.hyperlinks = [];
                        this.renderer.hyperlinkBounds = [];
                    }
                    this.renderer.hyperlinks.push(pdfLoadedTextWebLinkAnnotation.url);
                    this.renderer.hyperlinkBounds.push(rectangle);
                }
                else if (page.annotations.at(i) instanceof PdfDocumentLinkAnnotation) {
                    const pdfLoadedDocumentLinkAnnotation: PdfDocumentLinkAnnotation = page.annotations.at(i) as PdfDocumentLinkAnnotation;
                    const rectangle: AnnotBounds = this.getHyperlinkBounds(pdfLoadedDocumentLinkAnnotation.bounds as Rect,
                                                                           pageSize, page.rotation);
                    if (isNullOrUndefined(this.renderer.annotationDestPage)) {
                        this.renderer.annotationDestPage = [];
                        this.renderer.annotationList = [];
                        this.renderer.annotationYPosition = [];
                        this.renderer.annotationXPosition = [];
                        this.renderer.linkPageZoom = [];
                    }
                    if (!isNullOrUndefined(pdfLoadedDocumentLinkAnnotation.destination)) {
                        const linkPageIndex: number = !isNullOrUndefined(pdfLoadedDocumentLinkAnnotation.destination.pageIndex) ?
                            pdfLoadedDocumentLinkAnnotation.destination.pageIndex : pageIndex;
                        const linkPageZoom: number = !isNullOrUndefined(pdfLoadedDocumentLinkAnnotation.destination.zoom) ?
                            pdfLoadedDocumentLinkAnnotation.destination.zoom : this.pdfViewerBase.getZoomFactor();
                        if (linkPageIndex >= 0 && linkPageIndex < this.loadedDocument.pageCount) {
                            this.renderer.annotationDestPage.push(linkPageIndex);
                            this.renderer.linkPageZoom.push(linkPageZoom);
                            this.renderer.annotationList.push(rectangle);
                            // Use destination page rotation and size for correct coordinate conversion.
                            // annotationYPosition must be a "from-bottom" pixel value on the rendered dest page
                            // so that renderDocumentLink's formula (destH - annotationY) yields from-top offset.
                            const destPage: PdfPage = this.loadedDocument.getPage(linkPageIndex);
                            const destPageSize: Size = this.getPageSize(linkPageIndex);
                            const destRotation: PdfRotationAngle = destPage.rotation;
                            const destLocX: number = this.convertPointToPixel(
                                Math.abs(pdfLoadedDocumentLinkAnnotation.destination.location.x));
                            const destLocY: number = this.convertPointToPixel(
                                Math.abs(pdfLoadedDocumentLinkAnnotation.destination.location.y));
                            if (destRotation === PdfRotationAngle.angle180) {
                                this.renderer.annotationYPosition.push(destPageSize.height - destLocY);
                                this.renderer.annotationXPosition.push(destPageSize.width - destLocX);
                            }
                            else if (destRotation === PdfRotationAngle.angle90) {
                                this.renderer.annotationYPosition.push(destPageSize.height - destLocX);
                                this.renderer.annotationXPosition.push(destLocY);
                            }
                            else if (destRotation === PdfRotationAngle.angle270) {
                                this.renderer.annotationYPosition.push(destLocX);
                                this.renderer.annotationXPosition.push(destLocY);
                            }
                            else {
                                this.renderer.annotationYPosition.push(destPageSize.height - destLocY);
                                this.renderer.annotationXPosition.push(destLocX);
                            }
                        }
                    }
                }
            }
        }
    }

    private getHyperlinkBounds(bounds: Rect, pageSize: Size, pageRotation: PdfRotationAngle): AnnotBounds {
        let bound: AnnotBounds;
        if (pageRotation === PdfRotationAngle.angle0){
            bound = new AnnotBounds(this.convertPointToPixel(bounds.x), this.convertPointToPixel(bounds.y),
                                    this.convertPointToPixel(bounds.width), this.convertPointToPixel(bounds.height));
        }
        else if (pageRotation === PdfRotationAngle.angle90){
            bound = new AnnotBounds(pageSize.width - this.convertPointToPixel(bounds.y + bounds.height),
                                    this.convertPointToPixel(bounds.x), this.convertPointToPixel(bounds.height),
                                    this.convertPointToPixel(bounds.width));
        }
        else if (pageRotation === PdfRotationAngle.angle180){
            bound = new AnnotBounds(pageSize.width - this.convertPointToPixel(bounds.x + bounds.width),
                                    pageSize.height - this.convertPointToPixel(bounds.y + bounds.height),
                                    this.convertPointToPixel(bounds.width), this.convertPointToPixel(bounds.height));
        }
        else if (pageRotation === PdfRotationAngle.angle270){
            bound = new AnnotBounds(this.convertPointToPixel(bounds.y), pageSize.height -
            this.convertPointToPixel(bounds.x + bounds.width), this.convertPointToPixel(bounds.height),
                                    this.convertPointToPixel(bounds.width));
        }
        return bound;
    }

    /**
     * @param {any} jsonObject - jsonObject
     * @param {boolean} isObjects - isObjects
     * @private
     * @returns {void}
     */
    public exportFormFields(jsonObject: any, isObjects: boolean): Uint8Array {
        const formFields: FormFieldsBase = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase);
        formFields.saveFormFieldsData(jsonObject);
        formFields.saveFormFieldsDesignerData(jsonObject);
        if (!Object.prototype.hasOwnProperty.call(jsonObject, 'fileName')) {
            jsonObject['fileName'] = 'undefined.pdf';
        }
        this.loadedDocument.form.exportEmptyFields = true;
        let dataFormat: DataFormat = DataFormat.json;
        if (Object.prototype.hasOwnProperty.call(jsonObject, 'formFieldDataFormat')) {
            dataFormat = this.exportDataFormat(jsonObject['formFieldDataFormat']);
        }
        const settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
        let fileName: string;
        let exportFormFieldObject: Uint8Array;
        settings.dataFormat = dataFormat;
        if (isObjects) {
            exportFormFieldObject = this.loadedDocument.exportFormData(settings);
            return exportFormFieldObject;
        } else {
            fileName = this.changeFileExtension(this.pdfViewer.fileName, this.fileFormat(dataFormat));
            return this.loadedDocument.exportFormData(settings);
        }
    }

    /**
     * @param {any} jsonObject - jsonObject
     * @private
     * @returns {any} - any
     */
    public importFormFields(jsonObject: any): any {
        try {
            let formFields: FormFieldsBase = new FormFieldsBase(this.pdfViewer, this.pdfViewerBase);
            formFields.saveFormFieldsDesignerData(jsonObject);
            const dataFormat: DataFormat = this.exportDataFormat(jsonObject['formFieldDataFormat']);
            if (!this.isBase64(jsonObject['data']) && !this.isUint8Array(jsonObject['data'])) {
                if (jsonObject['formFieldDataFormat'] === 'Json') {
                    jsonObject['data'] = JSON.parse(jsonObject['data']);
                }
                const encoder: TextEncoder = new TextEncoder();
                const uint8ArrayLike: Uint8Array = encoder.encode(jsonObject['data']);
                jsonObject['data'] = new Uint8Array(uint8ArrayLike);

            }
            if (Object.prototype.hasOwnProperty.call(jsonObject, 'formFieldDataFormat')) {
                this.loadedDocument.importFormData(jsonObject['data'], dataFormat);
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
        const base64Regex: RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        return base64Regex.test(str);
    }

    private exportDataFormat(format: string): DataFormat {
        let exportFormat: DataFormat;
        switch (format) {
        case 'Json':
            exportFormat = DataFormat.json;
            break;
        case 'Xfdf':
            exportFormat = DataFormat.xfdf;
            break;
        case 'Fdf':
            exportFormat = DataFormat.fdf;
            break;
        case 'Xml':
            exportFormat = DataFormat.xml;
            break;
        }
        return exportFormat;
    }

    private fileFormat(value: number): string {
        let fileExtention: string;
        switch (value) {
        case 0:
            fileExtention = 'fdf';
            break;
        case 1:
            fileExtention = 'xfdf';
            break;
        case 2:
            fileExtention = 'json';
            break;
        case 3:
            fileExtention = 'xml';
            break;
        }
        return fileExtention;
    }

    /**
     * @param {number} pageIndex - It sets the page index
     * @private
     * @returns {Promise<string>} - promise
     */
    public exportAsImage(pageIndex: number): Promise<string> {
        return new Promise((resolve: Function, reject: Function) => {
            resolve(this.pdfiumExportAsImage(pageIndex));
        });
    }

    /**
     * @param {number} startIndex - It gets the start index value
     * @param {number} endIndex - It gets the end index value
     * @private
     * @returns { Promise<string[]>} - Promise
     */
    public exportAsImages(startIndex: number, endIndex: number): Promise<string[]> {
        return new Promise((resolve: Function, reject: Function) => {
            resolve(this.pdfiumExportAsImages(startIndex, endIndex));
        });
    }

    /**
     * @param {number} pageIndex - It gets the start index value
     * @param {Size} size - It gets the size value
     * @private
     * @returns { Promise<string[]>} - Promise
     */
    public exportAsImagewithSize(pageIndex: number, size: Size): Promise<string> {
        return new Promise((resolve: Function, reject: Function) => {
            resolve(this.pdfiumExportAsImage(pageIndex, size));
        });
    }

    /**
     * @param {number} startIndex - It gets the start index value
     * @param {number} endIndex - It gets the end index value
     * @param {Size} size - It gets the size value
     * @private
     * @returns { Promise<string[]>} - Promise
     */
    public exportAsImagesWithSize(startIndex: number, endIndex: number, size: Size): Promise<string[]> {
        return new Promise((resolve: Function, reject: Function) => {
            resolve(this.pdfiumExportAsImages(startIndex, endIndex, size));
        });
    }

    private pdfiumExportAsImage(pageIndex: number, size?: Size): Promise<string> {
        // eslint-disable-next-line
        const proxy: PdfRenderer = this;
        return new Promise((resolve: Function, reject: Function) => {
            if (!isNullOrUndefined(this.pdfViewerBase.pdfViewerRunner) && !isNullOrUndefined(this.loadedDocument)) {
                size = !isNullOrUndefined(size) ? size : null;
                const msgTag: string = 'extractImage_' + PdfViewerUtils.createGUID();
                this.pdfViewerBase.pdfViewerRunner.addTask({ pageIndex: pageIndex, message: msgTag,
                    zoomFactor: this.pdfViewer.magnificationModule.zoomFactor, isTextNeed: false, size: size }, TaskPriorityLevel.Medium);
                this.pdfViewerBase.pdfViewerRunner.onMessage(msgTag, function (event: any): void {
                    if (event.data.message === msgTag) {
                        const canvas: HTMLCanvasElement = document.createElement('canvas');
                        const { value, width, height } = event.data;
                        canvas.width = width;
                        canvas.height = height;
                        const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d');
                        const imageData: ImageData = canvasContext.createImageData(width, height);
                        imageData.data.set(value);
                        canvasContext.putImageData(imageData, 0, 0);
                        const imageUrl: string = canvas.toDataURL();
                        proxy.pdfViewerBase.releaseCanvas(canvas);
                        resolve(imageUrl);
                    }
                });
            }
            else {
                resolve(null);
            }
        });
    }

    private pdfiumExportAsImages(startIndex: number, endIndex: number, size?: Size): Promise<string[]> {
        // eslint-disable-next-line
        const proxy: PdfRenderer = this;
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
                size = !isNullOrUndefined(size) ? size : null;
                const imageUrls: string[] = [];
                const count: number = endIndex - startIndex + 1;
                const msgTag: string = 'extractImages_' + PdfViewerUtils.createGUID();
                for (let i: number = startIndex; i <= endIndex; i++) {
                    this.pdfViewerBase.pdfViewerRunner.addTask({ pageIndex: i, message: msgTag,
                        zoomFactor: this.pdfViewer.magnificationModule.zoomFactor, isTextNeed: false,
                        size: size }, TaskPriorityLevel.Medium);
                }
                this.pdfViewerBase.pdfViewerRunner.onMessage(msgTag, function (event: any): void {
                    if (event.data.message === msgTag) {
                        const canvas: HTMLCanvasElement = document.createElement('canvas');
                        const { value, width, height } = event.data;
                        canvas.width = width;
                        canvas.height = height;
                        const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d');
                        const imageData: ImageData = canvasContext.createImageData(width, height);
                        imageData.data.set(value);
                        canvasContext.putImageData(imageData, 0, 0);
                        const imageUrl: string = canvas.toDataURL();
                        proxy.pdfViewerBase.releaseCanvas(canvas);
                        imageUrls.push(imageUrl);
                        if (imageUrls.length === count) {
                            resolve(imageUrls);
                        }
                    }
                });
            }
            else {
                resolve(null);
            }
        });
    }

    /**
     * @param {any} event - event
     * @param {Function} [resolve] - An optional resolve function to complete a Promise when extraction is complete.
     * @param {number} [count] - An optional count of total expected results used for resolving multiple extractions.
     * @param {any[]} [textCollections] - An optional array for accumulating text data results when processing in bulk.
     * @private
     * @returns {any} - any
     */
    public textExtractionOnmessage(event: any, resolve?: Function, count?: number): any {
        let pageText: string = '';
        const textData: TextData[] = [];
        if ((event.data.message.indexOf('extractText') !== -1) || event.data.message === 'renderThumbnail' || event.data.message === 'renderPreviewTileImage') {
            const characterDetails: any = event.data.characterBounds;
            for (let i: number = 0; i < characterDetails.length; i++) {
                if (!event.data.isLayout && (characterDetails[parseInt(i.toString(), 10)].Text as string).indexOf('\r') !== -1) {
                    pageText += '';
                }
                else {
                    pageText += characterDetails[parseInt(i.toString(), 10)].Text;
                }
                const bound: AnnotBounds = new AnnotBounds(this.convertPixelToPoint(characterDetails[parseInt(i.toString(), 10)].X),
                                                           this.convertPixelToPoint(characterDetails[parseInt(i.toString(), 10)].Y),
                                                           this.convertPixelToPoint(characterDetails[parseInt(i.toString(), 10)].Width),
                                                           this.convertPixelToPoint(characterDetails[parseInt(i.toString(), 10)].Height));
                textData.push(new TextData(characterDetails[parseInt(i.toString(), 10)].Text, bound));
            }
            if (!event.data.isAPI) {
                let result: any = {};
                if (event.data.isRenderText) {
                    result.extractedTextDetails = { textDataCollection: textData, extractedText: pageText };
                    result.textBounds = event.data.textBounds;
                    result.textContent = event.data.textContent;
                    result.rotation = event.data.rotation;
                    result.pageText = event.data.pageText;
                    result.characterBounds = event.data.characterBounds;
                    result.isRenderText = event.data.isRenderText;
                    result.pageIndex = event.data.pageIndex;
                    result.jsonObject = event.data.jsonObject;
                    result.requestType = event.data.requestType;
                    result.annotationObject = event.data.annotationObject;
                    result.isNeedToRender = event.data.isNeedToRender;
                }
                else {
                    result = { textDataCollection: textData, extractedText: pageText,
                        isRenderText: event.data.isRenderText, pageIndex: event.data.pageIndex,
                        jsonObject: event.data.jsonObject, requestType: event.data.requestType,
                        annotationObject: event.data.annotationObject, isNeedToRender: event.data.isNeedToRender };
                }
                const pageTextDataCollection: {[key: number]: PageTextData} = this.getPageTextDataCollection(result);
                const documentTextCollection: any = this.getDocumentTextCollection(pageTextDataCollection);
                if (!isNullOrUndefined(documentTextCollection)) {
                    if (documentTextCollection.requestType === 'pageTextRequest') {
                        this.pdfViewerBase.pageTextRequestSuccess(documentTextCollection, documentTextCollection.pageIndex);
                    }
                    else if (documentTextCollection.requestType === 'textRequest') {
                        this.pdfViewerBase.textRequestSuccess(documentTextCollection, documentTextCollection.pageIndex,
                                                              documentTextCollection.annotationObject);
                    }
                    else if (documentTextCollection.requestType === 'pdfTextSearchRequest') {
                        this.pdfViewer.textSearchModule.pdfTextSearchRequestSuccess(documentTextCollection,
                                                                                    documentTextCollection.pageStartIndex,
                                                                                    documentTextCollection.pageEndIndex);
                    }
                }
            } else {
                if ((event.data.message.indexOf('extractText') !== -1)) {
                    pageText = event.data.pageText;
                    const result: any = () => {
                        if (event.data.options === ExtractTextOption.BoundsOnly) {
                            return { textData };
                        }
                        else if (event.data.options === ExtractTextOption.TextOnly) {
                            return { pageText };
                        }
                        else {
                            return { textData, pageText };
                        }
                    };
                    this.textCollections.push(result());
                    if (count === 1) {
                        resolve(result());
                        this.textCollections = [];
                    }
                    else if (this.textCollections.length === count) {
                        resolve(this.textCollections);
                        this.textCollections = [];
                    }
                }
            }
        }
    }

    /**
     * Handles the word text extraction message from the worker for a single page.
     * Extracts word-level data and bounds from worker response.
     *
     * @param {any} event - The message event from the worker containing word text data.
     * @param {Function} resolve - Promise resolve function.
     * @private
     * @returns {any} - any
     */
    public wordTextExtractionOnmessage(event: any, resolve?: Function): any {
        if ((event.data.message.indexOf('extractText') !== -1)) {
            // Return words and bounds directly without looping
            const words: string[] = event.data.textContent || [];
            const wordBounds: any[] = event.data.textBounds || [];
            const result: any = { words, wordBounds };
            resolve(result);
        }
    }

    /**
     * Extracts text data and additional details from a range of pages in the PDF document.
     *
     * This method performs text extraction on multiple pages defined by the start and end indices,
     * and returns a promise that resolves to an object containing the extracted text data and page text.
     *
     * @param {number} startIndex - The index of the first page from which to start text extraction.
     * @param {number} endIndex - The index of the last page up to which text extraction should be performed.
     * @param {ExtractTextOption} options - Specifies options for text extraction, which may include bounds, text only, etc.
     * @param {boolean} isLayout - Get the isLayout value.
     * @private
     * @returns {Promise<{ textData: TextDataSettingsModel[], pageText: string }>} - A promise that resolves with an object containing
     * an array of text data models representing extracted content and the combined page text of the specified page range.
     */
    public extractsText(startIndex: number, endIndex: number, options: ExtractTextOption, isLayout: boolean):
    Promise<{ textData: TextDataSettingsModel[], pageText: string }> {
        return new Promise((resolve: Function, reject: Function) => {
            resolve(this.textExtraction(startIndex, endIndex, options, true, isLayout));
        });
    }

    private extractTextFromCharacterDetails(characterDetails: any[], cropBox: number[], isLayout: boolean, options?: ExtractTextOption,
                                            documentPageText?: string): any {
        let pageText: string = '';
        const textData: TextData[] = [];
        if (characterDetails.length > 0) {
            for (const detail of characterDetails) {
                const text: string = detail.Text;
                if (options !== ExtractTextOption.BoundsOnly) {
                    if (!isLayout && text.indexOf('\r') !== -1) {
                        pageText += '';
                    } else {
                        pageText += text;
                    }
                }
                if (options !== ExtractTextOption.TextOnly) {
                    const bound: AnnotBounds = new AnnotBounds(
                        this.convertPointToPixel(detail.X ? detail.X : detail.Bounds.X),
                        this.convertPointToPixel((detail.Y ? detail.Y : detail.Bounds.Y) + cropBox[1]),
                        this.convertPointToPixel(detail.Width ? detail.Width : detail.Bounds.Width),
                        this.convertPointToPixel(detail.Height ? detail.Height : detail.Bounds.Height)
                    );
                    textData.push(new TextData(text, bound));
                }
            }
        }
        if (documentPageText) {
            pageText = documentPageText;
        }
        if (options === ExtractTextOption.BoundsOnly) {
            return { textData };
        }
        else if (options === ExtractTextOption.TextOnly) {
            return { pageText };
        }
        else {
            return { textData, pageText };
        }
    }

    private textExtraction(startIndex: number, endIndex: number, options: ExtractTextOption, isAPI: boolean, isLayout?: boolean,
                           isRenderText?: boolean, jsonObject?: any, requestType?: string, annotationObject?: any):
        Promise<{ textData: TextDataSettingsModel[]; pageText: string } | { pageText: string } | { textData: TextDataSettingsModel[] }> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: PdfRenderer = this;
        const isSkipCharacterBounds: boolean = !isAPI ?
            ((this.pdfViewer.extractTextOption === ExtractTextOption.None ||
                this.pdfViewer.extractTextOption === ExtractTextOption.TextOnly) ? true : false) : false;
        if (!isAPI) {
            this.documentTextCollection = [];
        }
        return new Promise(function (resolve: Function, reject: Function): void {
            if (isNullOrUndefined(proxy.pdfViewerBase.pdfViewerRunner)) {
                resolve(null);
                return;
            }

            endIndex = Math.min(endIndex, proxy.pdfViewer.pageCount - 1);
            const count: number = endIndex - startIndex + 1;
            const fetchTextCollection: any = (i: number) =>
                proxy.pdfViewerBase.documentTextCollection[parseInt(i.toString(), 10)]
                    // eslint-disable-next-line max-len
                    ? proxy.pdfViewerBase.documentTextCollection[parseInt(i.toString(), 10)][parseInt(i.toString(), 10)]
                    : null;
            const processPage: any = (i: number, msg: string) => {
                const documentTextCollection: any = fetchTextCollection(i);

                if (isNullOrUndefined(documentTextCollection) || (!isNullOrUndefined(documentTextCollection) &&
                    (((options === ExtractTextOption.BoundsOnly || options === ExtractTextOption.TextAndBounds) &&
                        (!isNullOrUndefined(documentTextCollection.TextData) && documentTextCollection.TextData.length === 0) ||
                        isNullOrUndefined(documentTextCollection.TextData))) || ((options === ExtractTextOption.TextOnly &&
                            (!isNullOrUndefined(documentTextCollection.PageText) && documentTextCollection.PageText === '') ||
                            (isNullOrUndefined(documentTextCollection.PageText)))))) {
                    proxy.pdfViewerBase.pdfViewerRunner.addTask({
                        pageIndex: i,
                        message: msg,
                        zoomFactor: proxy.pdfViewer.magnificationModule.zoomFactor,
                        isTextNeed: true,
                        isLayout: isLayout,
                        isSkipCharacterBounds: isSkipCharacterBounds,
                        options: options,
                        isRenderText: isRenderText,
                        jsonObject: jsonObject,
                        requestType: requestType,
                        annotationObject: annotationObject,
                        isAPI: isAPI
                    }, !isAPI ? TaskPriorityLevel.Low : TaskPriorityLevel.Medium);
                    proxy.pdfViewerBase.pdfViewerRunner.onMessage(msg, (event: any) => {
                        if ((event.data.message.indexOf('extractText') !== -1)) {
                            proxy.textExtractionOnmessage(event, resolve, count);
                        }
                    });
                } else {
                    const cropBox: any = proxy.loadedDocument.getPage(i).cropBox;
                    const result: any = proxy.extractTextFromCharacterDetails(documentTextCollection.TextData, cropBox,
                                                                              isLayout, options, documentTextCollection.PageText);
                    proxy.textCollections.push(result);
                    if (count === 1) {
                        resolve(result);
                        proxy.textCollections = [];
                    }
                    else if (proxy.textCollections.length === count) {
                        resolve(proxy.textCollections);
                        proxy.textCollections = [];
                    }
                }
            };
            let msg: string = 'extractText';
            if (isAPI) {
                msg = 'extractText_' + PdfViewerUtils.createGUID();
            }
            if ((!isAPI && proxy.pdfViewer.extractTextOption !== ExtractTextOption.None) || isAPI) {
                for (let i: number = startIndex; i <= endIndex; i++) {
                    processPage(i, msg);
                }
            }
        });
    }

    /**
     * Extracts word-level text data from a single page using the worker process.
     *
     * @param {number} pageIndex - The page index to extract word data from.
     * @param {boolean} isLayout - Whether to use layout mode.
     * @private
     * @returns {Promise<{ wordData: TextDataSettingsModel[], pageText: string }>} - Promise resolving with word data and page text.
     */
    public wordTextExtraction(pageIndex: number, isLayout: boolean):
    Promise<{ wordData: TextDataSettingsModel[], pageText: string }> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: PdfRenderer = this;

        return new Promise(function (resolve: Function, reject: Function): void {
            if (isNullOrUndefined(proxy.pdfViewerBase.pdfViewerRunner)) {
                resolve(null);
                return;
            }

            const validPageIndex: number = Math.min(pageIndex, proxy.pdfViewer.pageCount - 1);
            const msg: string = 'extractText_' + PdfViewerUtils.createGUID();

            proxy.pdfViewerBase.pdfViewerRunner.addTask({
                pageIndex: validPageIndex,
                message: msg,
                zoomFactor: proxy.pdfViewer.magnificationModule.zoomFactor,
                isTextNeed: true,
                isLayout: isLayout,
                isAPI: true
            }, TaskPriorityLevel.Medium);
            proxy.pdfViewerBase.pdfViewerRunner.onMessage(msg, (event: any) => {
                if ((event.data.message.indexOf('extractText') !== -1)) {
                    proxy.wordTextExtractionOnmessage(event, resolve);
                }
            });
        });
    }

    private getCharacterBounds(pageIndex: number): any {
        const documentIndex: any =
        this.pdfViewerBase.documentTextCollection[parseInt(pageIndex.toString(), 10)][parseInt(pageIndex.toString(), 10)];
        return documentIndex.textData || documentIndex.TextData;
    }


    /**
     * @param {any} textData - It describes about the text data
     * @private
     * @returns {any} - any
     */
    public getPageTextDataCollection(textData: any): any {
        const pageTextDataCollection: { [key: number]: PageTextData } = {};
        if (!isNullOrUndefined(textData)) {
            let textDetails: any = textData;
            if (textData.isRenderText) {
                textDetails = textData.extractedTextDetails;
                textDetails.extractedText = textData.pageText;
            }
            pageTextDataCollection[textData.pageIndex] =
            new PageTextData(new SizeBase(this.getPageSize(textData.pageIndex).width,
                                          this.getPageSize(textData.pageIndex).height), textDetails.textDataCollection,
                             textDetails.extractedText);
            if (textData.isRenderText) {
                return ({ pageTextDataCollection: pageTextDataCollection, textBounds: textData.textBounds,
                    textContent: textData.textContent, rotation: textData.rotation, characterBounds: textData.characterBounds,
                    jsonObject: textData.jsonObject, requestType: textData.requestType, pageIndex: textData.pageIndex,
                    annotationObject: textData.annotationObject, isNeedToRender: textData.isNeedToRender });
            }
            else {
                return (pageTextDataCollection);
            }
        }
        else {
            return (null);
        }
    }

    /**
     * @param {any} value - It describes about the value
     * @private
     * @returns {any} - any
     */
    public getDocumentTextCollection(value: any): any {
        const pageStartIndex: number = !isNullOrUndefined(value.jsonObject.pageStartIndex) ? value.jsonObject.pageStartIndex :
            value.jsonObject.pageIndex;
        const pageEndIndex: number = !isNullOrUndefined(value.jsonObject.pageEndIndex) ? value.jsonObject.pageEndIndex :
            value.jsonObject.pageIndex + 1;
        const pageCount: number = this.loadedDocument.pageCount;
        const endNumber: number = !isNullOrUndefined(value.jsonObject.pageStartIndex) ? (pageEndIndex - pageStartIndex) : (pageCount);
        if (!isNullOrUndefined(value)) {
            const collection: any = value.isNeedToRender ? this.pdfViewer.textSearchModule.findTextDocumentCollection :
                this.documentTextCollection;
            collection.push(value.pageTextDataCollection);
            if (collection.length === endNumber) {
                return({ uniqueId : value.jsonObject.uniqueId,
                    documentTextCollection: collection,
                    pageStartIndex: pageStartIndex,
                    pageEndIndex: !isNullOrUndefined(value.jsonObject.pageEndIndex) ? pageEndIndex : pageCount,
                    textBounds: value.textBounds,
                    textContent: value.textContent,
                    rotation: value.rotation,
                    characterBounds: value.characterBounds,
                    requestType: value.requestType,
                    pageIndex: value.pageIndex,
                    annotationObject: value.annotationObject,
                    isNeedToRender: value.isNeedToRender

                });
            }
        }
        else {
            return (null);
        }
    }

    /**
     * @param {number} pageIndex - It describes about the page index value
     * @private
     * @returns {Promise} - Promise
     */
    public extractTextWithPageSize(pageIndex: number): Promise<{ [key: number]: PageTextData }> {
        return new Promise((resolve: Function, reject: Function) => {
            resolve(this.extractTextDetailsWithPageSize(pageIndex));
        });
    }

    private extractTextDetailsWithPageSize(pageIndex: number, isRenderText?: boolean, jsonObject?: any, requestType?: string,
                                           annotationObject?: any): void {
        const pageTextDataCollection: { [key: number]: PageTextData } = {};
        this.textExtraction(pageIndex, pageIndex, null, false, true, isRenderText, jsonObject, requestType, annotationObject);
    }


    /**
     * @param {any} jsonObject - jsonObject
     * @param {string} requestType - It describes about the request type
     * @param {any} annotationObject - It describes about the annotation object
     * @private
     * @returns {void}
     */
    public getDocumentText(jsonObject: any, requestType?: string, annotationObject?: any): void {
        const pageStartIndex: number = !isNullOrUndefined(jsonObject.pageStartIndex) ? jsonObject.pageStartIndex : jsonObject.pageIndex;
        const pageEndIndex: number = !isNullOrUndefined(jsonObject.pageEndIndex) ? jsonObject.pageEndIndex : jsonObject.pageIndex + 1;
        const pageCount: number = this.loadedDocument.pageCount;
        if (this.pdfViewer.extractTextOption !== ExtractTextOption.None) {
            for (let pageIndex: number = pageStartIndex; pageIndex < pageEndIndex; pageIndex++) {
                this.extractTextDetailsWithPageSize(pageIndex, true, jsonObject, requestType, annotationObject);
            }
        } else {
            this.pdfViewer.fireTextExtractionCompleted([]);
        }
    }
}

class TextData {
    public Text: string;
    public Bounds: AnnotBounds;
    constructor(text: string, bounds: AnnotBounds) {
        this.Text = text;
        this.Bounds = bounds;
    }
}

class PageTextData {
    public PageSize: SizeBase;
    public TextData: TextData[];
    public PageText: string;
    constructor(pageSize: SizeBase, textData: TextData[], pageText: string) {
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
    public redactionAnnotation: any;
    public annotationOrder: any;
}

/**
 * The `IAnnotationCollection` type.
 *
 * @hidden
 */
export type AnnotationsType = keyof Annotations;
