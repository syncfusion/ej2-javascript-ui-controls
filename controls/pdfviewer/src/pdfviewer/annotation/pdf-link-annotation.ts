import {
    PdfViewer, PdfViewerBase, IRectangle, IPageAnnotations, IPoint,
    AnnotationType, IAnnotation,
    PdfAnnotationBaseModel,
    PdfAnnotationBase
} from '../../index';
import { isNullOrUndefined, createElement, Browser, isBlazor } from '@syncfusion/ej2-base';
import { cloneObject } from '../drawing/drawing-util';
import { LinkAnnotation } from './link-annotation';
import { Dialog } from '@syncfusion/ej2-popups';
import { ColorPicker, Slider } from '@syncfusion/ej2-inputs';
import { Button, RadioButton } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { AnnotationStatus } from '../base/pdfviewer-utlis';

/**
 * @hidden
 * Interface for Link Annotation - Matches the storage structure used by annotation system
 */
export interface ILinkAnnotation extends IAnnotation {
    id: string;
    annotationType?: 'Link';
    pageNumber: number;
    bounds: IRectangle;
    destinationPageIndex?: number;
    destinationLocation?: IPoint;
    zoomValue: number;
    url?: string;
    thickness?: number;
}

/**
 * @hidden
 * PdfLinkAnnotation class for handling programmatic link annotations add, edit and delete
 */
export class PdfLinkAnnotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;

    /**
     * @private
     */
    public isAddAnnotationProgramatically: boolean = false;

    /**
     * @private
     */
    public linkAnnotationCount: number = 0;
    public linkStrokeColor: string;
    public linkThickness: number;
    private linkDialog: Dialog;
    private linkDialogUrlRadio: RadioButton;
    private linkDialogPageRadio: RadioButton;
    private linkDialogContentArea: HTMLElement;
    private linkDialogUrlInput: HTMLInputElement;
    private linkDialogPageInput: HTMLInputElement;
    private linkDialogXInput: HTMLInputElement;
    private linkDialogYInput: HTMLInputElement;
    private linkDialogZoomDropDown: DropDownList;
    private linkDialogStrokeColorPicker: ColorPicker;
    private linkDialogThicknessSlider: Slider;
    private linkDialogUrlStrokeColor: string = '#0A7EE4';
    private linkDialogUrlStrokeThickness: number = 1;
    private linkDialogPageStrokeColor: string = '#0A7EE4';
    private linkDialogPageStrokeThickness: number = 1;
    private get linkDialogStrokeColor(): string {
        return this.linkDialogEditIsUrl ?
            this.linkDialogUrlStrokeColor : this.linkDialogPageStrokeColor;
    }
    private set linkDialogStrokeColor(v: string) {
        if (this.linkDialogEditIsUrl) {
            this.linkDialogUrlStrokeColor = v;
        } else {
            this.linkDialogPageStrokeColor = v;
        }
    }
    private get linkDialogThickness(): number {
        return this.linkDialogEditIsUrl ?
            this.linkDialogUrlStrokeThickness : this.linkDialogPageStrokeThickness;
    }
    private set linkDialogThickness(v: number) {
        if (this.linkDialogEditIsUrl) {
            this.linkDialogUrlStrokeThickness = v;
        } else {
            this.linkDialogPageStrokeThickness = v;
        }
    }
    private linkDialogEditMode: boolean = false;
    private linkDialogEditAnnotName: string = null;
    private linkDialogEditPageIndex: number = -1;
    private linkDialogEditIsUrl: boolean = true;
    private linkDialogEditUrl: string = '';
    private linkDialogEditPageNumber: number;
    private linkDialogEditX: number;
    private linkDialogEditY: number;
    private linkDialogEditZoom: number = 25;
    private linkPropertiesContainer: HTMLElement;
    private linkContentContainer: HTMLElement;
    private linkFooterContainer: HTMLElement;
    /**
     * @private
     */
    public currentContextMenuLinkAnnotName: string = null;
    /**
     * @private
     */
    public currentContextMenuLinkPageIndex: number = -1;

    constructor(pdfviewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfviewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    private initializeLinkProperties(linkType: 'WebLink' | 'DocumentLink'): void {
        if (linkType === 'WebLink' && this.pdfViewer.webLinkSettings) {
            this.linkStrokeColor = this.pdfViewer.webLinkSettings.strokeColor || 'rgba(0, 0, 0, 0)';
            // null/undefined check — honour a configured `0` thickness instead of coercing to `1`.
            this.linkThickness = isNullOrUndefined(this.pdfViewer.webLinkSettings.thickness) ?
                1 : this.pdfViewer.webLinkSettings.thickness;
        } else if (linkType === 'DocumentLink' && this.pdfViewer.documentLinkSettings) {
            this.linkStrokeColor = this.pdfViewer.documentLinkSettings.strokeColor || 'rgba(0, 0, 0, 0)';
            this.linkThickness = isNullOrUndefined(this.pdfViewer.documentLinkSettings.thickness) ?
                1 : this.pdfViewer.documentLinkSettings.thickness;
        } else {
            this.linkStrokeColor = 'rgba(0, 0, 0, 0)';
            this.linkThickness = 1;
        }
    }

    /**
     * @param {any} options - It describes about the annotation
     * @param {IPoint} offset - It describes about the offset value of annotation
     * @private
     * @returns {Object} - Object
     */
    public updateAddAnnotationDetails(options: any, offset: IPoint): Object {
        if (!options) {
            options = { offset: { x: 10, y: 10 }, pageNumber: 0, width: undefined, height: undefined };
            offset = options.offset;
        }
        else if (!options.offset) { offset = { x: 10, y: 10 }; }
        else { offset = options.offset; }
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        options.width = options.width ? options.width : 150;
        options.height = options.height ? options.height : 75;
        const linkAnnotation: any = [];
        const annotation: any = {
            AnnotName: annotationName,
            AnnotType: 'link',
            Bounds: {
                X: offset.x, Y: offset.y, Width: options.width,
                Height: options.height, Left: offset.x, Top: offset.y,
                Location: { X: offset.x, Y: offset.y }, Size: {
                    Height: options.height,
                    IsEmpty: false, Width: options.width
                }
            },
            DestinationPageIndex: options.destinationPageIndex,
            DestinationLocation: {
                X: !isNullOrUndefined(options.destinationLocation) ? options.destinationLocation.x : null,
                Y: !isNullOrUndefined(options.destinationLocation) ? options.destinationLocation.y : null
            },
            ZoomValue: options.zoomValue,
            Url: options.url,
            StrokeColor: options.strokeColor ? options.strokeColor : '#0A7EE4',
            Thickness: options.thickness ? options.thickness : 1,
            Subject: options.subject ? options.subject : 'Link',
            Status: AnnotationStatus.NewlyAdded
        };
        linkAnnotation[0] = annotation;
        return { linkAnnotation };
    }

    /**
     * @param {any} linkAnnotations - It describes about the link annotation
     * @param {number} pageNumber - It describes about the page number
     * @param {boolean} isImportAcion - It describes about import action
     * @param {boolean} isAnnotOrderAction - It describes about the isAnnotOrderAction
     * @private
     * @returns {void} - void
     */
    public renderLinkAnnotations(linkAnnotations: any, pageNumber: number, isImportAcion?: boolean, isAnnotOrderAction?: boolean): void {
        if (linkAnnotations) {
            if (linkAnnotations.length >= 1) {
                if (!this.pdfViewerBase.clientSideRendering) {
                    return;
                }
                const linkAnnots: any[] = this.pdfViewer.annotation.getStoredAnnotations(
                    pageNumber,
                    linkAnnotations,
                    '_annotations_link'
                );
                if (!linkAnnots || isAnnotOrderAction || isImportAcion) {
                    for (let i: number = 0; i < linkAnnotations.length; i++) {
                        const annotation: any = linkAnnotations[parseInt(i.toString(), 10)];
                        const annotId: string = annotation.id || annotation.Id || ('link' + (++this.linkAnnotationCount));

                        // Extract bounds values
                        let boundLeft: number = 0;
                        let boundTop: number = 0;
                        let boundWidth: number = 100;
                        let boundHeight: number = 50;

                        if (annotation.bounds) {
                            boundLeft = annotation.bounds.left || 0;
                            boundTop = annotation.bounds.top || 0;
                            boundWidth = annotation.bounds.width || 100;
                            boundHeight = annotation.bounds.height || 50;
                        } else if (annotation.Bounds) {
                            boundLeft = annotation.Bounds.X || annotation.Bounds.x || 0;
                            boundTop = annotation.Bounds.Y || annotation.Bounds.y || 0;
                            boundWidth = annotation.Bounds.Width || annotation.Bounds.width || 100;
                            boundHeight = annotation.Bounds.Height || annotation.Bounds.height || 50;
                        }
                        const left: number = !isNullOrUndefined(annotation.DestinationLocation) ?
                            (!isNullOrUndefined(annotation.DestinationLocation.X) ? annotation.DestinationLocation.X :
                                annotation.DestinationLocation.x) : undefined;
                        const top: number = !isNullOrUndefined(annotation.DestinationLocation) ?
                            (!isNullOrUndefined(annotation.DestinationLocation.Y) ? annotation.DestinationLocation.Y :
                                annotation.DestinationLocation.y) : undefined;
                        if (!isNullOrUndefined(annotation.DestinationPageIndex) && annotation.DestinationPageIndex < 0 &&
                            annotation.DestinationPageIndex >= this.pdfViewer.pageCount) {
                            annotation.DestinationPageIndex = 0;
                        }
                        let status: AnnotationStatus;
                        // Create annotation object following shape annotation pattern
                        const linkAnnotation: ILinkAnnotation = {
                            id: annotId,
                            shapeAnnotationType: 'Link',
                            annotName: annotation.AnnotName,
                            annotationIndex: annotation.AnnotationIndex,
                            pageNumber: pageNumber,
                            bounds: {
                                left: boundLeft,
                                top: boundTop,
                                width: boundWidth,
                                height: boundHeight,
                                right: boundLeft + boundWidth,
                                bottom: boundTop + boundHeight
                            },
                            destinationPageIndex: annotation.DestinationPageIndex,
                            destinationLocation: {
                                x: left, y: top
                            },
                            zoomValue: annotation.ZoomValue,
                            url: annotation.Url,
                            strokeColor: this.pdfViewer.annotation.rgbaToHex(annotation.StrokeColor),
                            thickness: annotation.Thickness,
                            subject: annotation.Subject,
                            status: !isNullOrUndefined(annotation.Status) ? annotation.Status : status
                        };
                        const annot: PdfAnnotationBaseModel = {
                            id: annotId, annotationIndex: annotation.AnnotationIndex, shapeAnnotationType: 'Link', annotName: linkAnnotation.annotName,
                            bounds: {
                                x: linkAnnotation.bounds.left, y: linkAnnotation.bounds.top,
                                width: linkAnnotation.bounds.width, height: linkAnnotation.bounds.height
                            },
                            subject: linkAnnotation.subject,
                            strokeColor: linkAnnotation.strokeColor,
                            thickness: linkAnnotation.thickness,
                            destinationPageIndex: linkAnnotation.destinationPageIndex,
                            destinationLocation: linkAnnotation.destinationLocation,
                            zoomValue: linkAnnotation.zoomValue,
                            url: linkAnnotation.url,
                            pageIndex: linkAnnotation.pageNumber,
                            status: !isNullOrUndefined(annotation.Status) ? annotation.Status : status
                        };
                        const addedAnnot: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
                        // Store annotation in the annotation collection
                        this.pdfViewer.annotation.storeAnnotations(pageNumber, linkAnnotation, '_annotations_link', isImportAcion);
                        this.renderLinkElement(linkAnnotation, pageNumber, annotId);
                        if (this.isAddAnnotationProgramatically) {
                            const settings: any = {
                                opacity: annot.opacity, strokeColor: annot.strokeColor, thickness: annot.thickness,
                                width: annot.bounds.width, height: annot.bounds.height
                            };
                            this.pdfViewer.annotation.addAction(annot.pageIndex, null , annot as PdfAnnotationBase, 'Addition', '', annot as PdfAnnotationBase, annot);
                            this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, annotation.ShapeAnnotationType,
                                                             annot.bounds, settings);
                        }
                    }
                }
            }
            else if (linkAnnotations.shapeAnnotationType) {
                const annotationObject: ILinkAnnotation = this.createAnnotationObject(linkAnnotations);
                this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_link', isImportAcion);
                this.renderLinkElement(annotationObject, pageNumber, annotationObject.id);
                this.pdfViewer.annotationModule.triggerAnnotationAdd(linkAnnotations);
            }
        }
    }

    private createAnnotationObject(annotationModel: PdfAnnotationBaseModel): ILinkAnnotation {
        let bound: IRectangle;
        let destinationBounds: IPoint;
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        annotationModel.annotName = annotationName;
        if (annotationModel.wrapper.bounds) {
            bound = {
                left: annotationModel.wrapper.bounds.x, top: annotationModel.wrapper.bounds.y,
                height: annotationModel.wrapper.bounds.height, width: annotationModel.wrapper.bounds.width,
                right: annotationModel.wrapper.bounds.right, bottom: annotationModel.wrapper.bounds.bottom
            };
        } else {
            bound = { left: 0, top: 0, height: 0, width: 0, right: 0, bottom: 0 };
        }
        if (annotationModel.destinationLocation) {
            destinationBounds = {
                x: annotationModel.destinationLocation.x, y: annotationModel.destinationLocation.y
            };
        }
        if (!isNullOrUndefined(annotationModel.destinationPageIndex) && annotationModel.destinationPageIndex < 0 &&
            annotationModel.destinationPageIndex >= this.pdfViewer.pageCount) {
            annotationModel.destinationPageIndex = 0;
        }
        return {
            id: annotationModel.id, shapeAnnotationType: 'Link',
            subject: annotationModel.subject, destinationPageIndex: annotationModel.destinationPageIndex,
            destinationLocation: destinationBounds as IPoint, zoomValue: annotationModel.zoomValue,
            strokeColor: annotationModel.strokeColor, annotName: annotationName, url: annotationModel.url,
            thickness: annotationModel.thickness, pageNumber: annotationModel.pageIndex,
            bounds: bound, status: AnnotationStatus.NewlyAdded
        };
    }

    /**
     * @param {ILinkAnnotation} linkAnnotation - It describes about the link annotation
     * @param {number} pageNumber - It describes about the page number
     * @param {string} idPrefix - idPrefix of link annotation
     * @private
     * @returns {void} - void
     */
    public renderLinkElement(linkAnnotation: ILinkAnnotation, pageNumber: number, idPrefix?: string): void {
        const linkAnnotationModule: LinkAnnotation = this.pdfViewer.linkAnnotationModule;
        if (isNullOrUndefined(linkAnnotationModule)) {
            return;
        }

        if (!isNullOrUndefined(linkAnnotation.url) && linkAnnotation.url.trim() !== '') {
            const rect: any = linkAnnotation.bounds;
            const hyperlinksBounds: any = {
                Left: rect.left,
                Top: rect.top,
                Width: rect.width,
                Height: rect.height
            };
            linkAnnotationModule.renderWebLink(
                [linkAnnotation.url],
                [hyperlinksBounds],
                pageNumber,
                idPrefix
            );
        } else if (!isNullOrUndefined(linkAnnotation.destinationPageIndex)) {
            const rect: any = linkAnnotation.bounds;
            const linkAnnotationBounds: any = {
                Left: rect.left,
                Top: rect.top,
                Width: rect.width,
                Height: rect.height
            };
            const destPageIndex: number = linkAnnotation.destinationPageIndex;
            const destPageSize: any = this.pdfViewerBase.pageSize[parseInt(destPageIndex.toString(), 10)];
            const destPageHeight: number = destPageSize ? destPageSize.height : 0;
            const topDownY: number = linkAnnotation.destinationLocation && linkAnnotation.destinationLocation.y !== undefined ?
                linkAnnotation.destinationLocation.y : 0;
            const annotationY: number = topDownY === 0 ? 0 : destPageHeight - topDownY;
            const annotationX: number = linkAnnotation.destinationLocation && linkAnnotation.destinationLocation.x !== undefined ?
                linkAnnotation.destinationLocation.x : 0;
            linkAnnotationModule.renderDocumentLink(
                [linkAnnotationBounds],
                [destPageIndex],
                [annotationY],
                pageNumber,
                [annotationX],
                [linkAnnotation.zoomValue],
                idPrefix
            );
        } else {
            const rect: any = linkAnnotation.bounds;
            const placeholderBounds: any = {
                Left: rect.left,
                Top: rect.top,
                Width: rect.width,
                Height: rect.height
            };
            linkAnnotationModule.renderEmptyLink(
                placeholderBounds,
                pageNumber,
                idPrefix
            );
        }
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {any} - any
     */
    public saveImportedlinkAnnotations(annotation: any, pageNumber: number): any {
        let annotationObject: ILinkAnnotation = null;
        const left: number = !isNullOrUndefined(annotation.destinationLocation) ?
            (!isNullOrUndefined(annotation.destinationLocation.X) ? annotation.destinationLocation.X :
                annotation.destinationLocation.x) : undefined;
        const top: number = !isNullOrUndefined(annotation.destinationLocation) ?
            (!isNullOrUndefined(annotation.destinationLocation.Y) ? annotation.destinationLocation.Y :
                annotation.destinationLocation.y) : undefined;
        annotationObject = {
            id: 'link', shapeAnnotationType: annotation.ShapeAnnotationType, subject: annotation.Subject, pageNumber: pageNumber, strokeColor: annotation.StrokeColor, thickness: annotation.Thickness,
            bounds: {
                left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width,
                height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom
            }, annotName: annotation.AnnotName,
            destinationPageIndex: annotation.DestinationPageIndex,
            destinationLocation: {
                x: left, y: top
            },
            zoomValue: annotation.ZoomValue,
            url: annotation.Url, status: annotation.status,
            annotationIndex: annotation.AnnotationIndex
        };
        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_link', true);
    }

    /**
     * @private
     * @returns {string} - string
     */
    public saveLinkAnnotations(): string {
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_link');
        const annotations: Array<any> = [];
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[parseInt(j.toString(), 10)] = [];
        }
        if (storeObject && !this.pdfViewer.annotationSettings.skipDownload) {
            let annotationCollection: IPageAnnotations[] = JSON.parse(JSON.stringify(storeObject)) as IPageAnnotations[];
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: ILinkAnnotation[] = [];
                const pageAnnotationObject: IPageAnnotations = annotationCollection[parseInt(i.toString(), 10)];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        if (!this.pdfViewerBase.checkFormFieldCollection(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].id)) {
                            if (this.pdfViewer.printModule && this.pdfViewer.printModule.canPrint &&
                                pageAnnotationObject.annotations[parseInt(z.toString(), 10)].isPrint === false) {
                                pageAnnotationObject.annotations.splice(parseInt(z.toString(), 10), 1);
                                z--;
                                continue;
                            }
                            if (this.pdfViewerBase.isJsonExported) {
                                const pageDetails: any = this.pdfViewerBase.pageSize[pageAnnotationObject.pageIndex];
                                if (pageDetails) {
                                    pageAnnotationObject.annotations[parseInt(z.toString(), 10)].annotationRotation =
                                        pageDetails.rotation;
                                }
                            }
                            pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds =
                                JSON.stringify(this.pdfViewer.annotation.getBounds(pageAnnotationObject.
                                    annotations[parseInt(z.toString(), 10)].bounds, pageAnnotationObject.pageIndex));
                            if (!isNullOrUndefined(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].destinationLocation) &&
                                !isNullOrUndefined(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].destinationPageIndex)) {
                                pageAnnotationObject.annotations[parseInt(z.toString(), 10)].destinationLocation =
                                    JSON.stringify(this.pdfViewer.annotation.getLocation(pageAnnotationObject.
                                        annotations[parseInt(z.toString(), 10)].destinationLocation, pageAnnotationObject.
                                        annotations[parseInt(z.toString(), 10)].destinationPageIndex));
                            }
                            const strokeColorString: string = pageAnnotationObject.annotations[parseInt(z.toString(), 10)].strokeColor;
                            pageAnnotationObject.annotations[parseInt(z.toString(), 10)].strokeColor =
                                JSON.stringify(this.getRgbCode(strokeColorString));
                        } else {
                            pageAnnotationObject.annotations[parseInt(z.toString(), 10)] = '';
                        }
                    }
                    pageAnnotationObject.annotations = pageAnnotationObject.annotations.filter((item: any) => item);
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
            annotationCollection = null;
        }
        return JSON.stringify(annotations);
    }

    private getRgbCode(colorString: string): any {
        // eslint-disable-next-line
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorString = this.pdfViewer.annotationModule.nameToHash(colorString);
        }
        let stringArray: string[] = colorString.split(',');
        if (isNullOrUndefined(stringArray[1])) {
            colorString = this.pdfViewer.annotationModule.getValue(colorString, 'rgba');
            stringArray = colorString.split(',');
        }
        const r: number = parseInt(stringArray[0].split('(')[1], 10);
        const g: number = parseInt(stringArray[1], 10);
        const b: number = parseInt(stringArray[2], 10);
        const a: number = parseFloat(stringArray[3]);
        return { r: r, g: g, b: b, a: a };
    }

    /**
     * Remove all existing <a> link elements for a given page from the DOM,
     * then re-render every stored link annotation for that page.
     * @param {number} pageNumber - The 0-based page index.
     * @private
     * @returns {void}
     */
    public refreshLinkElements(pageNumber: number): void {
        const pageDiv: HTMLElement = document.getElementById(
            this.pdfViewer.element.id + '_pageDiv_' + pageNumber
        );
        if (pageDiv) {
            const anchors: HTMLCollectionOf<HTMLAnchorElement> = pageDiv.getElementsByTagName('a');
            const toRemove: HTMLAnchorElement[] = [];
            for (let i: number = 0; i < anchors.length; i++) {
                const anchor: HTMLAnchorElement = anchors[parseInt(i.toString(), 10)];
                const id: string = anchor.id || '';
                if (id.indexOf('linkdiv_') !== -1 || id.indexOf('weblinkdiv_') !== -1 || id.indexOf('emptylinkdiv_') !== -1) {
                    toRemove.push(anchor);
                }
            }
            for (let i: number = 0; i < toRemove.length; i++) {
                toRemove[parseInt(i.toString(), 10)].parentNode.removeChild(toRemove[parseInt(i.toString(), 10)]);
            }
        }
        this.rerenderStoredLinkElements(pageNumber);
    }

    /**
     * Move the <a> overlay of a single link annotation to the pageDiv of a new page.
     *
     * refreshLinkElements() can only rebuild the anchors of ONE page, so it cannot by
     * itself relocate an anchor across pages: the source page loses its anchors and the
     * destination page re-renders only what its own store still holds. After a cross-page
     * move the destination store is populated only in client-side rendering mode, so in
     * server-side mode the destination anchor would never be created.
     *
     * This method therefore relocates the anchor explicitly: it clears the source page's
     * anchors, then renders a fresh anchor for the destination page from the stored link
     * annotation, which renderLinkElement() appends into the destination pageDiv. Because
     * it never consults the destination page store, it works in Standalone and server-side
     * modes alike (Bug #272683, R9 — link interaction after cross-page move).
     *
     * @param {number} currentPageNumber - The 0-based page index the link is moving from.
     * @param {number} newPageNumber - The 0-based page index the link is moving to.
     * @param {any} annotation - The link annotation that was moved.
     * @private
     * @returns {void}
     */
    public relocateLinkElement(currentPageNumber: number, newPageNumber: number, annotation: any): void {
        if (isNullOrUndefined(annotation) || currentPageNumber === newPageNumber) {
            return;
        }
        const storedAnnotation: ILinkAnnotation = this.findStoredLinkAnnotation(annotation, currentPageNumber);
        if (isNullOrUndefined(storedAnnotation)) {
            return;
        }
        const pageDiv: HTMLElement = document.getElementById(
            this.pdfViewer.element.id + '_pageDiv_' + currentPageNumber
        );
        if (pageDiv) {
            const anchors: HTMLCollectionOf<HTMLAnchorElement> = pageDiv.getElementsByTagName('a');
            const toRemove: HTMLAnchorElement[] = [];
            let anchor: HTMLAnchorElement;
            for (let i: number = 0; i < anchors.length; i++) {
                anchor = anchors[parseInt(i.toString(), 10)];
                const id: string = anchor.id || '';
                if (id.includes(storedAnnotation.id)) {
                    toRemove.push(anchor);
                    break;
                }
            }
            for (let i: number = 0; i < toRemove.length; i++) {
                if (anchor) {
                    anchor.removeChild(toRemove[parseInt(i.toString(), 10)]);
                }
            }
            const newPageDiv: HTMLElement = document.getElementById(
                this.pdfViewer.element.id + '_pageDiv_' + newPageNumber
            );
            newPageDiv.appendChild(toRemove[0]);
        }
    }

    /**
     * Looks up the stored link annotation matching the moved drawing-model annotation in
     * the _annotations_link store for the given page. Returns null when nothing matches.
     *
     * @param {any} annotation - The moved drawing-model link annotation.
     * @param {number} pageNumber - The 0-based page index whose store entry is searched.
     * @private
     * @returns {ILinkAnnotation} The stored link annotation, or null when not found.
     */
    private findStoredLinkAnnotation(annotation: any, pageNumber: number): ILinkAnnotation {
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(
            this.pdfViewerBase.documentId + '_annotations_link'
        );
        if (!storeObject) {
            return null;
        }
        const index: number = this.pdfViewer.annotationModule.getPageCollection(storeObject, pageNumber);
        if (isNullOrUndefined(index) || !storeObject[parseInt(index.toString(), 10)]) {
            return null;
        }
        const annotations: ILinkAnnotation[] = storeObject[parseInt(index.toString(), 10)].annotations;
        if (!annotations || annotations.length === 0) {
            return null;
        }
        // The drawing-model annotation identifies itself by annotName; the stored entry
        // records the same identifier as annotationId. This mirrors the matcher already
        // used by getAnnotations() in this module.
        const targetAnnotName: string = annotation.annotName || annotation.annotationId || annotation.id;
        for (let i: number = 0; i < annotations.length; i++) {
            const stored: ILinkAnnotation = annotations[parseInt(i.toString(), 10)];
            if (stored && ((stored as any).annotName === targetAnnotName || stored.id === targetAnnotName)) {
                return stored;
            }
        }
        return null;
    }

    /**
     * Re-render stored link elements for a page after it is recreated by virtualization.
     * Called from onPageRender whenever a pageDiv is (re)added to the DOM.
     * @param {number} pageNumber - The 0-based page index whose link elements need re-rendering.
     * @private
     * @returns {void}
     */
    public rerenderStoredLinkElements(pageNumber: number): void {
        if (!this.pdfViewerBase.clientSideRendering) {
            return;
        }
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(
            this.pdfViewerBase.documentId + '_annotations_link'
        );
        if (!storeObject) {
            return;
        }
        const index: number = this.pdfViewer.annotationModule.getPageCollection(storeObject, pageNumber);
        if (isNullOrUndefined(index) || !storeObject[parseInt(index.toString(), 10)]) {
            return;
        }
        const annotations: ILinkAnnotation[] = storeObject[parseInt(index.toString(), 10)].annotations;
        if (!annotations || annotations.length === 0) {
            return;
        }
        for (let i: number = 0; i < annotations.length; i++) {
            const storedAnnot: ILinkAnnotation = annotations[parseInt(i.toString(), 10)];
            this.renderLinkElement(storedAnnot, pageNumber, storedAnnot.id);
        }
    }


    /**
     * Delete a link annotation from the store and the DOM by its annotName (annotation ID).
     * Removes the entry from _annotations_link, clears the <a> elements for the page,
     * and re-renders remaining link annotations.
     * @param {any} annotation - annotation
     * @returns {void} - true if a matching annotation was found and deleted, false otherwise.
     * @private
     */
    public deleteLinkAnnotationById(annotation: any): void {
        const pageAnnotations: any = this.getAnnotations(annotation.pageIndex, null);
        if (pageAnnotations !== null) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (pageAnnotations[parseInt(i.toString(), 10)].annotName === annotation.annotName) {
                    this.pdfViewer.annotation.undoCommentsElement.push(pageAnnotations[parseInt(i.toString(), 10)]);
                }
            }
        }
        this.pdfViewer.annotationModule.updateImportAnnotationCollection(annotation, annotation.pageIndex, 'linkAnnotation');
        const undoElement: any = this.modifyInCollection(annotation, 'delete');
        this.pdfViewer.annotation.addAction(annotation.pageIndex, null, annotation, 'Link Delete', '', undoElement, annotation);
        this.pdfViewer.annotationModule.updateAnnotationCollection(annotation);
        this.pdfViewer.remove(annotation);
        this.pdfViewer.renderDrawing();
        this.pdfViewer.clearSelection(annotation.pageIndex);
        this.pdfViewerBase.updateDocumentEditedProperty(true);
        this.pdfViewer.fireAnnotationRemove(annotation.pageIndex, annotation.annotationId, 'Link', annotation.bounds);
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateUndoRedoButtons();
        }
        if (this.pdfViewer.annotationModule.actionCollection && this.pdfViewer.annotationModule.actionCollection.length === 0) {
            this.pdfViewerBase.updateDocumentEditedProperty(false);
        } else {
            this.pdfViewerBase.updateDocumentEditedProperty(true);
        }
        this.pdfViewerBase.updateDocumentEditedProperty(true);
    }

    /**
     * @param {PdfAnnotationBaseModel} annotation - annotation
     * @param {string} property - property
     * @param {number} pageNumber - pageNumber
     * @private
     * @returns {any} - any
     */
    public modifyInCollection(annotation: PdfAnnotationBaseModel, property: string, pageNumber?: number): any {
        let currentAnnotObject: ILinkAnnotation = null;
        const pageIndex: number = !isNullOrUndefined(pageNumber) ? pageNumber : annotation.pageIndex;
        const pageAnnotations: ILinkAnnotation[] = this.getAnnotations(pageIndex, null);
        if (pageAnnotations != null && annotation) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                const storedAnnot: ILinkAnnotation = pageAnnotations[parseInt(i.toString(), 10)];
                if (annotation.id === storedAnnot.id ||
                    (annotation.annotName && (annotation.annotName === storedAnnot.annotName ||
                        annotation.annotName === (storedAnnot as any).annotationId))) {
                    if (property === 'bounds') {
                        this.pdfViewerBase.isBounds =
                            this.pdfViewerBase.boundsCalculation(pageAnnotations[parseInt(i.toString(), 10)].bounds,
                                                                 annotation.wrapper.bounds);
                        if (this.pdfViewerBase.isBounds) {
                            pageAnnotations[parseInt(i.toString(), 10)].bounds = {
                                left: annotation.bounds.x,
                                top: annotation.bounds.y, width: annotation.bounds.width,
                                height: annotation.bounds.height, right: annotation.bounds.right,
                                bottom: annotation.bounds.bottom
                            };
                        }
                    }
                    else if (property === 'stroke') {
                        pageAnnotations[parseInt(i.toString(), 10)].strokeColor = annotation.wrapper.children[0].style.strokeColor;
                    } else if (property === 'thickness') {
                        pageAnnotations[parseInt(i.toString(), 10)].thickness = annotation.wrapper.children[0].style.strokeWidth;
                    }
                    else if (property === 'url') {
                        pageAnnotations[parseInt(i.toString(), 10)].url = annotation.url;
                    }
                    else if (property === 'destinationPageIndex') {
                        pageAnnotations[parseInt(i.toString(), 10)].destinationPageIndex = annotation.destinationPageIndex;
                    }
                    else if (property === 'destinationLocation') {
                        if (!isNullOrUndefined(annotation.destinationLocation)) {
                            pageAnnotations[parseInt(i.toString(), 10)].destinationLocation = {
                                x: annotation.destinationLocation.x,
                                y: annotation.destinationLocation.y
                            };
                        }
                    }
                    else if (property === 'zoomValue') {
                        pageAnnotations[parseInt(i.toString(), 10)].zoomValue = annotation.zoomValue;
                    }
                    else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    }
                    if (pageAnnotations[parseInt(i.toString(), 10)].status !== 'NewlyAdded') {
                        pageAnnotations[parseInt(i.toString(), 10)].status = AnnotationStatus.ExistingModified;
                    }
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[parseInt(i.toString(), 10)],
                                                                               pageIndex);
                }
            }
            this.manageAnnotations(pageAnnotations, pageIndex);
        }
        if (this.pdfViewer.annotationModule.isUndoRedoAction && property === 'delete') {
            this.pdfViewer.annotationModule.updateAnnotationCollection(annotation);
        }
        this.refreshLinkElements(pageIndex);
        return currentAnnotObject;
    }

    private getAnnotations(pageIndex: number, linkAnnotations: any[]): any[] {
        let annotationCollection: any[];
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_link');
        if (storeObject) {
            const index: number = this.pdfViewer.annotationModule.getPageCollection(storeObject, pageIndex);
            if (index != null && storeObject[parseInt(index.toString(), 10)]) {
                annotationCollection = storeObject[parseInt(index.toString(), 10)].annotations;
            } else {
                annotationCollection = linkAnnotations;
            }
        } else {
            annotationCollection = linkAnnotations;
        }
        return annotationCollection;
    }

    private manageAnnotations(pageAnnotations: ILinkAnnotation[], pageNumber: number): void {
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_link');
        if (storeObject) {
            this.pdfViewer.annotationsCollection.delete(this.pdfViewerBase.documentId + '_annotations_link');
            const index: number = this.pdfViewer.annotationModule.getPageCollection(storeObject, pageNumber);
            if (index != null && storeObject[parseInt(index.toString(), 10)]) {
                storeObject[parseInt(index.toString(), 10)].annotations = pageAnnotations;
            }
            this.pdfViewer.annotationsCollection.set(this.pdfViewerBase.documentId + '_annotations_link', storeObject);
        }
    }
    /**
     * @param {number} pageNumber - It describes about the page number
     * @param {ILinkAnnotation} annotationBase - It describes about the annotation base
     * @private
     * @returns {void}
     */
    public addInCollection(pageNumber: number, annotationBase: ILinkAnnotation): void {
        const pageAnnotations: ILinkAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            pageAnnotations.push(annotationBase);
        }
        this.manageAnnotations(pageAnnotations, pageNumber);
    }

    /**
     * @param {any} annotation - It describes about the annotation
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {any} - any
     */
    public updateLinkAnnotationCollections(annotation: any, pageNumber: number): any {
        let annotationObject: any = null;
        annotationObject = {
            id: 'link', shapeAnnotationType: annotation.ShapeAnnotationType, annotationIndex: annotation.AnnotationIndex,
            subject: annotation.Subject, strokeColor: annotation.StrokeColor,
            thickness: annotation.Thickness, annotationId: annotation.AnnotName,
            bounds: {
                left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width,
                height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom
            },
            pageNumber: pageNumber, destinationLocation: {
                x: !isNullOrUndefined(annotation.destinationLocation) ?
                    annotation.destinationLocation.X : null, y: !isNullOrUndefined(annotation.destinationLocation) ?
                    annotation.destinationLocation.Y : null
            }, destinationPageIndex: annotation.DestinationPageIndex,
            url: annotation.Url, zoomValue: annotation.ZoomValue
        };
        return annotationObject;
    }

    /**
     * Build and open the Insert Link dialog.
     * @private
     * @returns {void}
     */
    public openLinkDialog(): void {
        // Reset both per-type buckets to the documented defaults so each
        // link type starts from `#0A7EE4` / `1` rather than inheriting
        // values from a previous dialog session.
        this.linkDialogUrlStrokeColor = '#0A7EE4';
        this.linkDialogUrlStrokeThickness = 1;
        this.linkDialogPageStrokeColor = '#0A7EE4';
        this.linkDialogPageStrokeThickness = 1;
        this.linkDialogEditMode = false;
        this.linkDialogEditAnnotName = null;
        this.linkDialogEditPageIndex = -1;
        this.createLinkDialog();
        if (this.linkDialogThicknessSlider) {
            this.linkDialogThicknessSlider.value = this.linkDialogThickness;
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.linkDialog.show();
        }
    }

    private createLinkDialog(): void {
        this.destroyLinkDialog();
        const elementID: string = this.pdfViewer.element.id;
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            const dialogDiv: HTMLElement = createElement('div', {
                id: elementID + '_dialog',
                className: 'e-dialog e-lib e-pv-link-annotation-dialog e-dlg-modal e-popup e-control e-popup-open'
            });
            const contentEl: HTMLElement = this.buildLinkDialogContent();
            this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
            const height: string = '354px';
            this.linkDialog = new Dialog({
                header: this.linkDialogEditMode ? this.pdfViewer.localeObj.getConstant('Edit Link') : this.pdfViewer.localeObj.getConstant('Insert Link'),
                showCloseIcon: true,
                closeOnEscape: true,
                isModal: true,
                width: '500px',
                minHeight: height,
                target: this.pdfViewer.element,
                content: contentEl,
                allowDragging: true,
                close: () => {
                    this.destroyLinkDialog();
                    this.deselectLinkAnnotationItem();
                }
            });

            this.linkDialog.buttons = [
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') },
                    click: this.onLinkDialogCancelClick.bind(this)
                },
                {
                    buttonModel: { content: this.linkDialogEditMode ? this.pdfViewer.localeObj.getConstant('Update') : this.pdfViewer.localeObj.getConstant('Insert'), isPrimary: true },
                    click: this.onLinkDialogInsertClick.bind(this)
                }
            ];

            this.linkDialog.appendTo(dialogDiv);
            const linkItem: HTMLElement = this.pdfViewer.toolbarModule.annotationToolbarModule.linkAnnotationItem;
            if (linkItem) {
                linkItem.blur();
            }
        }
        else {
            this.linkPropertiesContainer = createElement('div', { id: this.pdfViewer.element.id + '_linkPanel', className: 'e-pv-link-property-panel-mobile' });
            this.pdfViewerBase.mainContainer.appendChild(this.linkPropertiesContainer);
            if (this.pdfViewer.enableRtl) {
                this.linkPropertiesContainer.style.left = 0 + 'px';
            } else {
                this.linkPropertiesContainer.style.right = 0 + 'px';
            }
            this.linkPropertiesContainer.style.bottom = 0 + 'px';
            this.linkPropertiesContainer.style.zIndex = '1001';
            this.createLinkPanelTitleContainer();
            this.linkContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_linkcontentcontainer', className: 'e-pv-link-content-container' });
            this.linkPropertiesContainer.appendChild(this.linkContentContainer);
            this.linkContentContainer.appendChild(this.buildLinkDialogContentFrMobile());
            this.linkFooterContainer = createElement('div', {
                className: 'e-pv-link-footer'
            });
            const cancelBtn: Button = new Button({
                content: this.pdfViewer.localeObj.getConstant('Cancel')
            });
            cancelBtn.appendTo(createElement('button'));
            cancelBtn.element.onclick = this.onLinkDialogCancelClick.bind(this);
            const updateBtn: Button = new Button({
                content: this.linkDialogEditMode ?
                    this.pdfViewer.localeObj.getConstant('Update') :
                    this.pdfViewer.localeObj.getConstant('Insert'),
                isPrimary: true
            });
            updateBtn.appendTo(createElement('button'));
            updateBtn.element.onclick = this.onLinkDialogInsertClick.bind(this);
            this.linkFooterContainer.appendChild(cancelBtn.element);
            this.linkFooterContainer.appendChild(updateBtn.element);
            this.linkPropertiesContainer.appendChild(this.linkFooterContainer);
            const viewer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_viewerMainContainer');
            viewer.insertBefore(this.linkPropertiesContainer,
                                this.pdfViewer.toolbarModule.toolbarElement);
        }
    }

    private createLinkPanelTitleContainer(): void {
        const commentPanelTitleContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentPanelTitleContainer', className: 'e-pv-link-panel-title-container' });
        const commentpanelTilte: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_LinkPanelTitle', className: 'e-pv-link-panel-title', attrs: { 'tabindex': '-1' } });
        commentpanelTilte.innerText = this.linkDialogEditMode ? this.pdfViewer.localeObj.getConstant('Edit Link') : this.pdfViewer.localeObj.getConstant('Insert Link');
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode && !isBlazor()) {
            const commentCloseIconDiv: HTMLElement = createElement('button');
            commentCloseIconDiv.setAttribute('aria-label', 'annotation button');
            commentCloseIconDiv.setAttribute('type', 'button');
            commentCloseIconDiv.style.borderColor = 'transparent';
            commentCloseIconDiv.style.paddingTop = '11px';
            commentCloseIconDiv.style.paddingBottom = '11px';
            commentCloseIconDiv.style.backgroundColor = 'transparent';
            commentCloseIconDiv.addEventListener('click', this.closeLinkPanelContainer.bind(this));
            commentpanelTilte.style.left = '52px';
            const commentCloseIcon: HTMLElement = createElement('span', { className: 'e-pv-annotation-tools-close-icon e-pv-icon' });
            commentCloseIconDiv.appendChild(commentCloseIcon);
            commentPanelTitleContainer.appendChild(commentCloseIconDiv);
        }
        commentPanelTitleContainer.appendChild(commentpanelTilte);
        this.linkPropertiesContainer.appendChild(commentPanelTitleContainer);
    }

    private closeLinkPanelContainer(): void {
        const commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_linkPanel');
        if (commentPanel) {
            commentPanel.style.display = 'none';
            commentPanel.remove();
            if (this.pdfViewerBase) {
                this.pdfViewerBase.updateZoomValue();
            }
        }
        this.deselectLinkAnnotationItem();
    }

    /**
     * Remove the `e-pv-select` class from the Link toolbar item so the
     * annotation toolbar reflects that the Link tool is no longer active.
     * @private
     * @returns {void}
     */
    private deselectLinkAnnotationItem(): void {
        if (this.pdfViewer.toolbarModule &&
            this.pdfViewer.toolbarModule.annotationToolbarModule &&
            this.pdfViewer.toolbarModule.annotationToolbarModule.primaryToolbar) {
            this.pdfViewer.toolbarModule.annotationToolbarModule.primaryToolbar
                .deSelectItem(this.pdfViewer.toolbarModule.annotationToolbarModule.linkAnnotationItem);
        }
    }

    private buildLinkDialogContent(): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;
        const wrapper: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-wrapper' });
        const isUrlRadio: boolean = !this.linkDialogEditMode || this.linkDialogEditIsUrl;
        const radioRow: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-radio-row' });

        const urlRadioEl: HTMLElement = createElement('input', {
            id: elementID + '_link_radio_url',
            attrs: { type: 'radio', name: elementID + '_link_type' }
        });
        radioRow.appendChild(urlRadioEl);
        this.linkDialogUrlRadio = new RadioButton({
            label: this.pdfViewer.localeObj.getConstant('URL'),
            name: elementID + '_link_type',
            value: 'url',
            checked: isUrlRadio,
            change: this.onLinkTypeChanged.bind(this),
            enableRtl: this.pdfViewer.enableRtl
        });
        this.linkDialogUrlRadio.appendTo(urlRadioEl);

        const pageRadioEl: HTMLElement = createElement('input', {
            id: elementID + '_link_radio_page',
            attrs: { type: 'radio', name: elementID + '_link_type' }
        });
        radioRow.appendChild(pageRadioEl);
        this.linkDialogPageRadio = new RadioButton({
            label: this.pdfViewer.localeObj.getConstant('Page'),
            name: elementID + '_link_type',
            value: 'page',
            checked: !isUrlRadio,
            change: this.onLinkTypeChanged.bind(this),
            enableRtl: this.pdfViewer.enableRtl
        });
        this.linkDialogPageRadio.appendTo(pageRadioEl);

        wrapper.appendChild(radioRow);
        this.linkDialogContentArea = createElement('div', { className: 'e-pv-link-dialog-content-area' });
        wrapper.appendChild(this.linkDialogContentArea);

        if (isUrlRadio) {
            this.renderLinkDialogUrlContent();
        } else {
            this.renderLinkDialogPageContent();
        }
        return wrapper;
    }

    private buildLinkDialogContentFrMobile(): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;
        const wrapper: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-wrapper-mobile' });
        const isUrlRadio: boolean = !this.linkDialogEditMode || this.linkDialogEditIsUrl;
        const radioRow: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-radio-row-mobile' });

        const urlRadioEl: HTMLElement = createElement('input', {
            id: elementID + '_link_radio_url',
            attrs: { type: 'radio', name: elementID + '_link_type' }
        });
        radioRow.appendChild(urlRadioEl);
        this.linkDialogUrlRadio = new RadioButton({
            label: this.pdfViewer.localeObj.getConstant('URL'),
            name: elementID + '_link_type',
            value: 'url',
            checked: isUrlRadio,
            change: this.onLinkTypeChanged.bind(this),
            enableRtl: this.pdfViewer.enableRtl
        });
        this.linkDialogUrlRadio.appendTo(urlRadioEl);

        const pageRadioEl: HTMLElement = createElement('input', {
            id: elementID + '_link_radio_page',
            attrs: { type: 'radio', name: elementID + '_link_type' }
        });
        radioRow.appendChild(pageRadioEl);
        this.linkDialogPageRadio = new RadioButton({
            label: this.pdfViewer.localeObj.getConstant('Page'),
            name: elementID + '_link_type',
            value: 'page',
            checked: !isUrlRadio,
            change: this.onLinkTypeChanged.bind(this),
            enableRtl: this.pdfViewer.enableRtl
        });
        this.linkDialogPageRadio.appendTo(pageRadioEl);

        wrapper.appendChild(radioRow);
        this.linkDialogContentArea = createElement('div', { className: 'e-pv-link-dialog-content-area-mobile' });
        wrapper.appendChild(this.linkDialogContentArea);

        if (isUrlRadio) {
            this.renderLinkDialogUrlContentForMobile();
        } else {
            this.renderLinkDialogPageContentForMobile();
        }
        return wrapper;
    }

    private renderLinkDialogUrlContent(): void {
        this.linkDialogContentArea.innerHTML = '';
        const elementID: string = this.pdfViewer.element.id;

        const label: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-label' });
        label.textContent = this.pdfViewer.localeObj.getConstant('Enter URL');
        this.linkDialogContentArea.appendChild(label);

        const inputWrapper: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-input-wrapper' });
        this.linkDialogUrlInput = createElement('input', {
            id: elementID + '_link_url_input',
            attrs: { type: 'text', placeholder: 'https://www.syncfusion.com' }
        }) as HTMLInputElement;
        this.linkDialogUrlInput.className = 'e-input e-pv-link-url-input';
        // Pre-fill the URL when in edit mode.
        if (this.linkDialogEditMode) {
            this.linkDialogUrlInput.value = this.linkDialogEditUrl || '';
        }
        inputWrapper.appendChild(this.linkDialogUrlInput);
        this.linkDialogContentArea.appendChild(inputWrapper);
        this.linkDialogContentArea.appendChild(this.buildLinkDialogCommonProperties(true));
    }

    private renderLinkDialogUrlContentForMobile(): void {
        this.linkDialogContentArea.innerHTML = '';
        const elementID: string = this.pdfViewer.element.id;

        const label: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-label' });
        label.textContent = this.pdfViewer.localeObj.getConstant('Enter URL');
        this.linkDialogContentArea.appendChild(label);

        const inputWrapper: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-input-wrapper' });
        this.linkDialogUrlInput = createElement('input', {
            id: elementID + '_link_url_input',
            attrs: { type: 'text', placeholder: 'https://www.syncfusion.com' }
        }) as HTMLInputElement;
        this.linkDialogUrlInput.className = 'e-input e-pv-link-url-input';
        // Pre-fill the URL when in edit mode.
        if (this.linkDialogEditMode) {
            this.linkDialogUrlInput.value = this.linkDialogEditUrl || '';
        }
        inputWrapper.appendChild(this.linkDialogUrlInput);
        this.linkDialogContentArea.appendChild(inputWrapper);
        this.linkDialogContentArea.appendChild(this.buildLinkDialogCommonPropertiesForMobile(true));
    }

    private renderLinkDialogPageContent(): void {
        this.linkDialogContentArea.innerHTML = '';
        const elementID: string = this.pdfViewer.element.id;

        // Page number label + input
        const pageLabel: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-label' });
        pageLabel.textContent = this.pdfViewer.localeObj.getConstant('Enter the Page number');
        this.linkDialogContentArea.appendChild(pageLabel);

        const pageInputEl: HTMLInputElement = createElement('input', {
            id: elementID + '_link_page_input',
            attrs: { type: 'text', placeholder: '1' }
        }) as HTMLInputElement;
        pageInputEl.className = 'e-input e-pv-link-page-input';
        pageInputEl.value = this.linkDialogEditMode ?
            (!isNullOrUndefined(this.linkDialogEditPageNumber) ?
                String(this.linkDialogEditPageNumber) : '') : '';
        pageInputEl.addEventListener('input', this.onLinkDialogPageInputInput.bind(this));
        this.linkDialogContentArea.appendChild(pageInputEl);
        this.linkDialogPageInput = pageInputEl;
        // Properties heading
        const propertiesHeading: HTMLElement = createElement('div', {
            className: 'e-pv-link-dialog-section-title'
        });
        propertiesHeading.textContent = this.pdfViewer.localeObj.getConstant('Properties');
        this.linkDialogContentArea.appendChild(propertiesHeading);
        // Main row containing Position and Zoom sections
        const propertiesRow: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-properties-row' });
        const positionContainer: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-position-container' });
        const positionLabel: HTMLElement = createElement('span', { className: 'e-pv-link-dialog-field-label' });
        positionLabel.textContent = this.pdfViewer.localeObj.getConstant('Position');
        positionContainer.appendChild(positionLabel);

        const positionRow: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-position-row' });

        // X field
        const xGroup: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-field-group' });
        const xLabel: HTMLElement = createElement('span', { className: 'e-pv-link-dialog-field-label' });
        xLabel.textContent = 'X:';
        xGroup.appendChild(xLabel);

        const xInputEl: HTMLInputElement = createElement('input', {
            id: elementID + '_link_x_input',
            attrs: { type: 'text', placeholder: '1' }
        }) as HTMLInputElement;
        xInputEl.className = 'e-input e-pv-link-position-input';
        xInputEl.value = this.linkDialogEditMode ? (!isNullOrUndefined(this.linkDialogEditX) ? String(this.linkDialogEditX) : '') : '';
        xInputEl.addEventListener('input', this.onLinkDialogPageInputInput.bind(this));
        xGroup.appendChild(xInputEl);

        this.linkDialogXInput = xInputEl;
        positionRow.appendChild(xGroup);

        // Y field
        const yGroup: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-field-group' });
        const yLabel: HTMLElement = createElement('span', { className: 'e-pv-link-dialog-field-label' });
        yLabel.textContent = 'Y:';
        yGroup.appendChild(yLabel);
        const yInputEl: HTMLInputElement = createElement('input', {
            id: elementID + '_link_y_input',
            attrs: { type: 'text', placeholder: '1' }
        }) as HTMLInputElement;
        yInputEl.className = 'e-input e-pv-link-position-input';
        yInputEl.value = this.linkDialogEditMode ? (!isNullOrUndefined(this.linkDialogEditY) ? String(this.linkDialogEditY) : '') : '';
        yInputEl.addEventListener('input', this.onLinkDialogPageInputInput.bind(this));
        yGroup.appendChild(yInputEl);
        this.linkDialogYInput = yInputEl;
        positionRow.appendChild(yGroup);

        positionContainer.appendChild(positionRow);

        const zoomRow: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-zoom-row' });
        const zoomLabel: HTMLElement = createElement('span', { className: 'e-pv-link-dialog-field-label' });
        zoomLabel.textContent = this.pdfViewer.localeObj.getConstant('Zoom');
        zoomRow.appendChild(zoomLabel);
        const zoomSelectEl: HTMLElement = createElement('input', {
            id: elementID + '_link_zoom_input',
            attrs: { type: 'text' }
        });
        zoomRow.appendChild(zoomSelectEl);
        const zoomValues: { [key: string]: Object }[] = [
            { text: '10%', value: 10 },
            { text: '25%', value: 25 },
            { text: '50%', value: 50 },
            { text: '75%', value: 75 },
            { text: '100%', value: 100 },
            { text: '125%', value: 125 },
            { text: '150%', value: 150 },
            { text: '200%', value: 200 },
            { text: '400%', value: 400 }
        ];
        const zoomDefault: number = this.linkDialogEditMode && !this.linkDialogEditIsUrl ?
            (this.linkDialogEditZoom * 100 || this.pdfViewerBase.getZoomFactor() * 100) : 25;
        this.linkDialogZoomDropDown = new DropDownList({
            dataSource: zoomValues,
            fields: { text: 'text', value: 'value' },
            value: zoomDefault,
            cssClass: 'e-pv-link-zoom-dropdown',
            enableRtl: this.pdfViewer.enableRtl
        });
        this.linkDialogZoomDropDown.appendTo(zoomSelectEl);
        // Add sections to main row
        propertiesRow.appendChild(positionContainer);
        propertiesRow.appendChild(zoomRow);
        this.linkDialogContentArea.appendChild(propertiesRow);

        this.linkDialogContentArea.appendChild(this.buildLinkDialogCommonProperties(false));
    }

    private renderLinkDialogPageContentForMobile(): void {
        this.linkDialogContentArea.innerHTML = '';
        const elementID: string = this.pdfViewer.element.id;

        // Page number label + input
        const pageLabel: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-label' });
        pageLabel.textContent = this.pdfViewer.localeObj.getConstant('Enter the Page number');
        this.linkDialogContentArea.appendChild(pageLabel);

        const pageInputEl: HTMLInputElement = createElement('input', {
            id: elementID + '_link_page_input',
            attrs: { type: 'text', placeholder: '1' }
        }) as HTMLInputElement;
        pageInputEl.className = 'e-input e-pv-link-page-input';
        pageInputEl.value = this.linkDialogEditMode ?
            (!isNullOrUndefined(this.linkDialogEditPageNumber) ?
                String(this.linkDialogEditPageNumber) : '') : '';
        pageInputEl.addEventListener('input', this.onLinkDialogPageInputInput.bind(this));
        this.linkDialogContentArea.appendChild(pageInputEl);
        this.linkDialogPageInput = pageInputEl;
        // Properties heading
        const propertiesHeading: HTMLElement = createElement('div', {
            className: 'e-pv-link-dialog-section-title-mobile-mobile'
        });
        propertiesHeading.textContent = this.pdfViewer.localeObj.getConstant('Properties');
        this.linkDialogContentArea.appendChild(propertiesHeading);
        // Main row containing Position and Zoom sections
        const propertiesRow: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-properties-row-mobile' });
        const positionContainer: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-position-container-mobile' });
        const positionLabel: HTMLElement = createElement('span', { className: 'e-pv-link-dialog-field-label-mobile' });
        positionLabel.textContent = this.pdfViewer.localeObj.getConstant('Position');
        positionContainer.appendChild(positionLabel);

        const positionRow: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-position-row-mobile' });

        // X field
        const xGroup: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-field-group-mobile' });
        const xLabel: HTMLElement = createElement('span', { className: 'e-pv-link-dialog-field-label-mobile' });
        xLabel.textContent = 'X:';
        xGroup.appendChild(xLabel);

        const xInputEl: HTMLInputElement = createElement('input', {
            id: elementID + '_link_x_input',
            attrs: { type: 'text', placeholder: '1' }
        }) as HTMLInputElement;
        xInputEl.className = 'e-input e-pv-link-position-input';
        xInputEl.value = this.linkDialogEditMode ? (!isNullOrUndefined(this.linkDialogEditX) ? String(this.linkDialogEditX) : '') : '';
        xInputEl.addEventListener('input', this.onLinkDialogPageInputInput.bind(this));
        xGroup.appendChild(xInputEl);

        this.linkDialogXInput = xInputEl;
        positionRow.appendChild(xGroup);

        // Y field
        const yGroup: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-field-group-mobile' });
        const yLabel: HTMLElement = createElement('span', { className: 'e-pv-link-dialog-field-label-mobile' });
        yLabel.textContent = 'Y:';
        yGroup.appendChild(yLabel);
        const yInputEl: HTMLInputElement = createElement('input', {
            id: elementID + '_link_y_input',
            attrs: { type: 'text', placeholder: '1' }
        }) as HTMLInputElement;
        yInputEl.className = 'e-input e-pv-link-position-input';
        yInputEl.value = this.linkDialogEditMode ? (!isNullOrUndefined(this.linkDialogEditY) ? String(this.linkDialogEditY) : '') : '';
        yInputEl.addEventListener('input', this.onLinkDialogPageInputInput.bind(this));
        yGroup.appendChild(yInputEl);
        this.linkDialogYInput = yInputEl;
        positionRow.appendChild(yGroup);

        positionContainer.appendChild(positionRow);

        const zoomRow: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-zoom-row-mobile' });
        const zoomLabel: HTMLElement = createElement('span', { className: 'e-pv-link-dialog-field-label-mobile' });
        zoomLabel.textContent = this.pdfViewer.localeObj.getConstant('Zoom');
        zoomRow.appendChild(zoomLabel);
        const zoomSelectEl: HTMLElement = createElement('input', {
            id: elementID + '_link_zoom_input',
            attrs: { type: 'text' }
        });
        zoomRow.appendChild(zoomSelectEl);
        const zoomValues: { [key: string]: Object }[] = [
            { text: '10%', value: 10 },
            { text: '25%', value: 25 },
            { text: '50%', value: 50 },
            { text: '75%', value: 75 },
            { text: '100%', value: 100 },
            { text: '125%', value: 125 },
            { text: '150%', value: 150 },
            { text: '200%', value: 200 },
            { text: '400%', value: 400 }
        ];
        const zoomDefault: number = this.linkDialogEditMode && !this.linkDialogEditIsUrl ?
            (this.linkDialogEditZoom * 100 || this.pdfViewerBase.getZoomFactor() * 100) : 25;
        this.linkDialogZoomDropDown = new DropDownList({
            dataSource: zoomValues,
            fields: { text: 'text', value: 'value' },
            value: zoomDefault,
            cssClass: 'e-pv-link-zoom-dropdown',
            enableRtl: this.pdfViewer.enableRtl
        });
        this.linkDialogZoomDropDown.appendTo(zoomSelectEl);
        // Add sections to main row
        propertiesRow.appendChild(positionContainer);
        propertiesRow.appendChild(zoomRow);
        this.linkDialogContentArea.appendChild(propertiesRow);

        this.linkDialogContentArea.appendChild(this.buildLinkDialogCommonPropertiesForMobile(false));
    }

    private buildLinkDialogCommonProperties(showTitle: boolean = true): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;

        const section: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-common-props' });
        if (showTitle) {
            const title: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-section-title' });
            title.textContent = this.pdfViewer.localeObj.getConstant('Properties');
            section.appendChild(title);
        }
        const propsRow: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-props-row' });

        const colorGroup: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-prop-group' });
        const colorLabel: HTMLElement = createElement('span', { className: 'e-pv-link-dialog-field-label' });
        colorLabel.textContent = this.pdfViewer.localeObj.getConstant('Stroke Color');
        colorGroup.appendChild(colorLabel);

        const colorPickerContainer: HTMLElement = createElement('div', {
            className: 'e-colorpicker-container e-hide-opacity e-pv-link-stroke-color'
        });
        const colorInputEl: HTMLElement = createElement('input', {
            id: elementID + '_link_stroke_color'
        });
        colorPickerContainer.appendChild(colorInputEl);
        this.linkDialogStrokeColorPicker = new ColorPicker({
            mode: 'Picker',
            enableOpacity: false,
            value: this.linkDialogStrokeColor,
            showButtons: false,
            modeSwitcher: false,
            enableRtl: this.pdfViewer.enableRtl,
            change: this.onLinkDialogStrokeColorChange.bind(this)
        });
        this.linkDialogStrokeColorPicker.appendTo(colorInputEl);
        colorGroup.appendChild(colorPickerContainer);
        propsRow.appendChild(colorGroup);
        const thicknessGroup: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-prop-group' });
        const thicknessLabel: HTMLElement = createElement('span', { className: 'e-pv-link-dialog-field-label' });
        thicknessLabel.textContent = this.pdfViewer.localeObj.getConstant('Stroke Thickness');
        thicknessGroup.appendChild(thicknessLabel);

        const sliderContainer: HTMLElement = createElement('div', {
            id: elementID + '_link_thickness_slider',
            className: 'e-pv-link-thickness-slider'
        });
        thicknessGroup.appendChild(sliderContainer);
        this.linkDialogThicknessSlider = new Slider({
            type: 'MinRange',
            min: 0,
            max: 10,
            change: this.onLinkDialogThicknessChange.bind(this)
        });
        this.linkDialogThicknessSlider.appendTo(sliderContainer);
        propsRow.appendChild(thicknessGroup);

        section.appendChild(propsRow);
        return section;
    }

    private buildLinkDialogCommonPropertiesForMobile(showTitle: boolean = true): HTMLElement {
        const elementID: string = this.pdfViewer.element.id;

        const section: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-common-props-mobile' });
        if (showTitle) {
            const title: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-section-title-mobile' });
            title.textContent = this.pdfViewer.localeObj.getConstant('Properties');
            section.appendChild(title);
        }
        const propsRow: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-props-row-mobile' });

        const colorGroup: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-prop-group-mobile' });
        const colorLabel: HTMLElement = createElement('span', { className: 'e-pv-link-stroke-field-label-mobile' });
        colorLabel.textContent = this.pdfViewer.localeObj.getConstant('Stroke Color');
        colorGroup.appendChild(colorLabel);

        const colorPickerContainer: HTMLElement = createElement('div', {
            className: 'e-colorpicker-container e-hide-opacity e-pv-link-stroke-color'
        });
        const colorInputEl: HTMLElement = createElement('input', {
            id: elementID + '_link_stroke_color'
        });
        colorPickerContainer.appendChild(colorInputEl);
        this.linkDialogStrokeColorPicker = new ColorPicker({
            mode: 'Picker',
            enableOpacity: false,
            value: this.linkDialogStrokeColor,
            showButtons: false,
            modeSwitcher: false,
            enableRtl: this.pdfViewer.enableRtl,
            change: this.onLinkDialogStrokeColorChange.bind(this)
        });
        this.linkDialogStrokeColorPicker.appendTo(colorInputEl);
        colorGroup.appendChild(colorPickerContainer);
        propsRow.appendChild(colorGroup);
        const thicknessGroup: HTMLElement = createElement('div', { className: 'e-pv-link-dialog-prop-group-mobile' });
        const thicknessLabel: HTMLElement = createElement('span', { className: 'e-pv-link-thickness-field-label-mobile' });
        thicknessLabel.textContent = this.pdfViewer.localeObj.getConstant('Stroke Thickness');
        thicknessGroup.appendChild(thicknessLabel);

        const sliderContainer: HTMLElement = createElement('div', {
            id: elementID + '_link_thickness_slider',
            className: 'e-pv-link-thickness-slider'
        });
        thicknessGroup.appendChild(sliderContainer);
        this.linkDialogThicknessSlider = new Slider({
            type: 'MinRange',
            min: 0,
            max: 10,
            change: this.onLinkDialogThicknessChange.bind(this)
        });
        this.linkDialogThicknessSlider.appendTo(sliderContainer);
        propsRow.appendChild(thicknessGroup);

        section.appendChild(propsRow);
        return section;
    }

    private onLinkTypeChanged(): void {
        this.linkDialogEditIsUrl = !!(this.linkDialogUrlRadio && this.linkDialogUrlRadio.checked);
        if (!this.linkDialogEditMode) {
            if (this.linkDialogEditIsUrl) {
                this.linkDialogUrlStrokeColor = '#0A7EE4';
                this.linkDialogUrlStrokeThickness = 1;
            } else {
                this.linkDialogPageStrokeColor = '#0A7EE4';
                this.linkDialogPageStrokeThickness = 1;
            }
        }
        if (this.linkDialogEditIsUrl) {
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.renderLinkDialogUrlContentForMobile();
            }
            else {
                this.renderLinkDialogUrlContent();
            }
        } else {
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.renderLinkDialogPageContentForMobile();
            }
            else {
                this.renderLinkDialogPageContent();
            }
        }
        if (this.linkDialogStrokeColorPicker) {
            this.linkDialogStrokeColorPicker.value = this.linkDialogStrokeColor;
        }
        if (this.linkDialogThicknessSlider) {
            this.linkDialogThicknessSlider.value = this.linkDialogThickness;
        }
    }

    private onLinkDialogStrokeColorChange(args: any): void {
        if (args && args.currentValue && args.currentValue.hex) {
            this.linkDialogStrokeColor = args.currentValue.hex;
        }
    }

    private onLinkDialogThicknessChange(args: any): void {
        if (args && !isNullOrUndefined(args.value)) {
            this.linkDialogThickness = args.value as number;
        }
    }

    private onLinkDialogPageInputInput(e: Event): void {
        const target: HTMLInputElement = e.target as HTMLInputElement;
        if (!target) {
            return;
        }
        const sanitized: string = target.value.replace(/[^0-9]/g, '');
        if (sanitized !== target.value) {
            target.value = sanitized;
        }
    }


    private onLinkDialogCancelClick(): void {
        if ((!Browser.isDevice || this.pdfViewer.enableDesktopMode) && this.linkDialog) {
            this.linkDialog.hide();
        }
        else {
            this.closeLinkPanelContainer();
        }
    }

    private onLinkDialogInsertClick(): void {
        const isUrlMode: boolean = !!(this.linkDialogUrlRadio && this.linkDialogUrlRadio.checked);

        if (this.linkDialogEditMode) {
            // ── Edit existing link — update in-place, no draw tool ───────
            let pageNumber: number = !isUrlMode && this.linkDialogPageInput && this.linkDialogPageInput.value !== '' ?
                parseFloat(this.linkDialogPageInput.value) : undefined;
            const xValue: number = !isUrlMode && this.linkDialogXInput && this.linkDialogXInput.value !== '' ? parseFloat(this.linkDialogXInput.value) : undefined;
            const yValue: number = !isUrlMode && this.linkDialogYInput && this.linkDialogYInput.value !== '' ? parseFloat(this.linkDialogYInput.value) : undefined;
            const zoomValue: number = !isUrlMode && this.linkDialogZoomDropDown ?
                (this.linkDialogZoomDropDown.value as number) / 100 : 1;
            const url: string = this.linkDialogUrlInput && isUrlMode ? this.linkDialogUrlInput.value.trim() : '';
            if (!isNullOrUndefined(pageNumber)) {
                pageNumber = pageNumber - 1;
            }
            this.updateLinkAnnotation(
                this.linkDialogEditAnnotName,
                this.linkDialogEditPageIndex,
                url,
                pageNumber,
                { x: xValue, y: yValue },
                zoomValue,
                this.linkDialogStrokeColor,
                this.linkDialogThickness
            );
        } else if (isUrlMode) {
            // ── URL / WebLink ─────────────────────────────────────────────
            const url: string = this.linkDialogUrlInput ? this.linkDialogUrlInput.value.trim() : '';
            // Prime the drawingObject so the rectangle drawn next carries all WebLink details.
            this.setAnnotationType(
                'Link',
                'WebLink',
                url,
                undefined,
                undefined,
                undefined,
                this.linkDialogStrokeColor,
                this.linkDialogThickness
            );
        } else {
            // ── Page / DocumentLink ───────────────────────────────────────
            const pageNumber: number = this.linkDialogPageInput && this.linkDialogPageInput.value !== '' ? parseFloat(this.linkDialogPageInput.value) : undefined;
            const xValue: number = this.linkDialogXInput && this.linkDialogXInput.value !== '' ? parseFloat(this.linkDialogXInput.value) : undefined;
            const yValue: number = this.linkDialogYInput && this.linkDialogYInput.value !== '' ? parseFloat(this.linkDialogYInput.value) : undefined;
            const zoomValue: number = this.linkDialogZoomDropDown ?
                (this.linkDialogZoomDropDown.value as number) / 100 : 1;
            // Prime the drawingObject so the rectangle drawn next carries all DocumentLink details.
            this.setAnnotationType(
                'Link',
                'DocumentLink',
                undefined,
                pageNumber - 1,
                { x: xValue, y: yValue },
                zoomValue,
                this.linkDialogStrokeColor,
                this.linkDialogThickness
            );
        }

        if ((!Browser.isDevice || this.pdfViewer.enableDesktopMode) && this.linkDialog) {
            this.linkDialog.hide();
        }
        else {
            this.closeLinkPanelContainer();
        }
    }

    /**
     * Set annotation type to Link and prime the drawingObject with all link-specific details
     * so they are carried through to renderLinkAnnotations / createAnnotationObject when
     * the user finishes drawing the rectangle.
     *
     * @param {AnnotationType} type                    - The annotation type (must be 'Link').
     * @param {string}         linkType                - 'WebLink' for URL links, 'DocumentLink' for page links.
     * @param {string}         [url]                   - Destination URL (WebLink only).
     * @param {number}         [destinationPageIndex]  - 0-based destination page index (DocumentLink only).
     * @param {IPoint}         [destinationLocation]   - Destination X/Y position on the target page (DocumentLink only).
     * @param {number}         [zoomValue]             - Zoom percentage to apply when navigating (DocumentLink only).
     * @param {string}         [strokeColor]           - Stroke colour override (hex string).
     * @param {number}         [thickness]             - Stroke thickness override (points).
     * @returns {void}
     * @private
     */
    public setAnnotationType(
        type: AnnotationType,
        linkType?: 'WebLink' | 'DocumentLink',
        url?: string,
        destinationPageIndex?: number,
        destinationLocation?: IPoint,
        zoomValue?: number,
        strokeColor?: string,
        thickness?: number
    ): void {
        if (type === 'Link') {
            this.initializeLinkProperties(linkType);

            // Allow callers to override the stroke colour / thickness sourced from settings.
            if (!isNullOrUndefined(strokeColor)) {
                this.linkStrokeColor = strokeColor;
            }
            if (!isNullOrUndefined(thickness)) {
                this.linkThickness = thickness;
            }

            this.pdfViewer.drawingObject = {
                shapeAnnotationType: 'Link',
                strokeColor: this.linkStrokeColor,
                thickness: this.linkThickness,
                subject: 'Link',
                // ── WebLink ──────────────────────────────────────────────
                url: linkType === 'WebLink' ? (url || '') : undefined,
                // ── DocumentLink ─────────────────────────────────────────
                destinationPageIndex: linkType === 'DocumentLink' ? destinationPageIndex : undefined,
                destinationLocation: linkType === 'DocumentLink' ? destinationLocation : undefined,
                zoomValue: linkType === 'DocumentLink' ? zoomValue : undefined
            };
            this.pdfViewer.tool = 'DrawTool';
        }
    }

    private isSamePoint(a: IPoint, b: IPoint): boolean {
        if (isNullOrUndefined(a) && isNullOrUndefined(b)) {
            return true;
        }
        if (isNullOrUndefined(a) || isNullOrUndefined(b)) {
            return false;
        }
        return a.x === b.x && a.y === b.y;
    }

    /**
     * Update the existing link annotation identified by `annotName` on `pageIndex`
     *
     * @param {string}  annotName              - AnnotName of the link to update.
     * @param {number}  pageIndex              - 0-based page index.
     * @param {string}  [url]                  - New URL (WebLink only).
     * @param {number}  [destinationPageIndex] - 0-based destination page index (DocumentLink only).
     * @param {IPoint}  [destinationLocation]  - New destination X/Y (DocumentLink only).
     * @param {number}  [zoomValue]            - New zoom value (DocumentLink only).
     * @param {string}  [strokeColor]          - New stroke color (hex).
     * @param {number}  [thickness]            - New stroke thickness.
     * @returns {void}
     * @private
     */
    public updateLinkAnnotation(
        annotName: string,
        pageIndex: number,
        url?: string,
        destinationPageIndex?: number,
        destinationLocation?: IPoint,
        zoomValue?: number,
        strokeColor?: string,
        thickness?: number
    ): void {
        const link: PdfAnnotationBase = (this.pdfViewer.nameTable as any)[`${annotName}`];
        if (!link) {
            return;
        }

        if (!isNullOrUndefined(strokeColor) && link.strokeColor !== strokeColor) {
            const clonedObject: PdfAnnotationBaseModel = cloneObject(link);
            const redoClonedObject: PdfAnnotationBaseModel = cloneObject(link);
            redoClonedObject.strokeColor = strokeColor;
            if (link.status !== 'NewlyAdded') {
                link.status = AnnotationStatus.ExistingModified;
            }
            this.pdfViewer.nodePropertyChange(link, { strokeColor: strokeColor });
            this.modifyInCollection(link, 'stroke');
            this.pdfViewer.annotationModule.triggerAnnotationPropChange(link, false, true, false, false);
            this.pdfViewer.annotation.addAction(link.pageIndex, null, link, 'Shape Stroke', '', clonedObject, redoClonedObject);
            this.pdfViewer.renderDrawing();
            this.pdfViewerBase.updateDocumentEditedProperty(true);
        }
        if (!isNullOrUndefined(thickness) && link.thickness !== thickness) {
            const clonedObject: PdfAnnotationBaseModel = cloneObject(link);
            const redoClonedObject: PdfAnnotationBaseModel = cloneObject(link);
            redoClonedObject.thickness = thickness;
            if (link.status !== 'NewlyAdded') {
                link.status = AnnotationStatus.ExistingModified;
            }
            this.pdfViewer.nodePropertyChange(link, { thickness: thickness });
            this.modifyInCollection(link, 'thickness');
            this.pdfViewer.annotationModule.triggerAnnotationPropChange(link, false, false, true, false);
            this.pdfViewer.annotation.addAction(link.pageIndex, null, link, 'Shape Thickness', '', clonedObject, redoClonedObject);
            this.pdfViewer.renderDrawing();
            this.pdfViewerBase.updateDocumentEditedProperty(true);
        }
        if (!isNullOrUndefined(url) && url !== link.url) {
            const clonedObject: PdfAnnotationBaseModel = cloneObject(link);
            const redoClonedObject: PdfAnnotationBaseModel = cloneObject(link);
            redoClonedObject.url = url;
            if (link.status !== 'NewlyAdded') {
                link.status = AnnotationStatus.ExistingModified;
            }
            this.pdfViewer.nodePropertyChange(link, { url: url });
            this.modifyInCollection(link, 'url');
            this.pdfViewer.annotationModule.triggerAnnotationPropChange(link, false, false, false, false);
            this.pdfViewer.annotation.addAction(link.pageIndex, null, link, 'Link url', '', clonedObject, redoClonedObject);
            this.pdfViewer.renderDrawing();
            this.pdfViewerBase.updateDocumentEditedProperty(true);
        }
        if (!isNullOrUndefined(destinationPageIndex) &&
            destinationPageIndex !== link.destinationPageIndex) {
            const clonedObject: PdfAnnotationBaseModel = cloneObject(link);
            const redoClonedObject: PdfAnnotationBaseModel = cloneObject(link);
            redoClonedObject.destinationPageIndex = destinationPageIndex;
            if (link.status !== 'NewlyAdded') {
                link.status = AnnotationStatus.ExistingModified;
            }
            this.pdfViewer.nodePropertyChange(link, { destinationPageIndex: destinationPageIndex });
            this.modifyInCollection(link, 'destinationPageIndex');
            this.pdfViewer.annotationModule.triggerAnnotationPropChange(link, false, false, false, false);
            this.pdfViewer.annotation.addAction(link.pageIndex, null, link, 'Link DestinationPageIndex', '', clonedObject, redoClonedObject);
            this.pdfViewer.renderDrawing();
            this.pdfViewerBase.updateDocumentEditedProperty(true);
        }
        if (!isNullOrUndefined(destinationLocation) &&
            !this.isSamePoint(destinationLocation, (link.destinationLocation) as IPoint)) {
            const clonedObject: PdfAnnotationBaseModel = cloneObject(link);
            const redoClonedObject: PdfAnnotationBaseModel = cloneObject(link);
            redoClonedObject.destinationLocation = destinationLocation;
            link.destinationLocation = destinationLocation;
            if (link.status !== 'NewlyAdded') {
                link.status = AnnotationStatus.ExistingModified;
            }
            this.pdfViewer.nodePropertyChange(link, { destinationLocation: destinationLocation });
            this.modifyInCollection(link, 'destinationLocation');
            this.pdfViewer.annotationModule.triggerAnnotationPropChange(link, false, false, false, false);
            this.pdfViewer.annotation.addAction(link.pageIndex, null, link, 'Link DestinationLocation', '', clonedObject, redoClonedObject);
            this.pdfViewer.renderDrawing();
            this.pdfViewerBase.updateDocumentEditedProperty(true);
        }
        if (!isNullOrUndefined(zoomValue) && zoomValue !== link.zoomValue) {
            const clonedObject: PdfAnnotationBaseModel = cloneObject(link);
            const redoClonedObject: PdfAnnotationBaseModel = cloneObject(link);
            redoClonedObject.zoomValue = zoomValue;
            if (link.status !== 'NewlyAdded') {
                link.status = AnnotationStatus.ExistingModified;
            }
            this.pdfViewer.nodePropertyChange(link, { zoomValue: zoomValue });
            this.modifyInCollection(link, 'zoomValue');
            this.pdfViewer.annotationModule.triggerAnnotationPropChange(link, false, false, false, false);
            this.pdfViewer.annotation.addAction(link.pageIndex, null, link, 'Link zoomValue', '', clonedObject, redoClonedObject);
            this.pdfViewer.renderDrawing();
            this.pdfViewerBase.updateDocumentEditedProperty(true);
        }
        this.refreshLinkElements(pageIndex);
    }

    /**
     * Edit-button click handler: re-opens the link dialog so the user can
     * update the link details. The next "Insert" will update the existing
     * annotation via the `editAnnotation` API rather than creating a new one.
     * @private
     * @returns {void}
     */
    public editLinkAnnotationByContextMenu(): void {
        const annotName: string = this.currentContextMenuLinkAnnotName;
        const pageIndex: number = this.currentContextMenuLinkPageIndex;
        if (isNullOrUndefined(annotName) || pageIndex < 0) {
            return;
        }
        this.openLinkDialogForEdit(annotName, pageIndex);
    }

    /**
     * Delete-button click handler: deletes the link annotation by id.
     * @private
     * @returns {void}
     */
    public deleteLinkAnnotationByContextMenu(): void {
        const annotName: string = this.currentContextMenuLinkAnnotName;
        const pageIndex: number = this.currentContextMenuLinkPageIndex;
        if (isNullOrUndefined(annotName) || pageIndex < 0) {
            return;
        }
        const annotation: any = this.pdfViewer.annotationCollection.find((annotation: any) => annotation.uniqueKey === annotName);
        const annotationId: string = annotation ? annotation.annotationId : undefined;
        if (annotationId && this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.deleteAnnotationById(annotationId);
        }
    }

    /**
     * Called by the context-menu module when the user right-clicks on a link
     * annotation. Walks up the DOM from the event target to find the link
     * `<a>` element, parses the page index and the link id prefix from its
     * id, and stores them for the Select/Edit/Delete context-menu actions.
     * @param {HTMLElement} target - The element under the mouse when the
     * context menu opened.
     * @private
     * @returns {void}
     */
    public setContextMenuTarget(target: HTMLElement): void {
        const link: { annotName: string, pageIndex: number } | null = this.findLinkUnderTarget(target);
        if (link) {
            this.currentContextMenuLinkAnnotName = link.annotName;
            this.currentContextMenuLinkPageIndex = link.pageIndex;
        } else {
            this.currentContextMenuLinkAnnotName = null;
            this.currentContextMenuLinkPageIndex = -1;
        }
    }

    private findLinkUnderTarget(target: HTMLElement): { annotName: string, pageIndex: number } | null {
        if (isNullOrUndefined(target) || !target.closest) {
            return null;
        }
        // Link annotation anchors use the `e-pv-hyperlink` class.
        const anchor: HTMLElement = target.closest('a.e-pv-hyperlink') as HTMLElement;
        if (!anchor || !anchor.id) {
            return null;
        }
        const id: string = anchor.id;
        const weblinkMatch: RegExpMatchArray = /(.*)_weblinkdiv_\d+_(\d+)$/.exec(id);
        const docLinkMatch: RegExpMatchArray = /(.*)_linkdiv_\d+_(\d+)$/.exec(id);
        const emptyLinkMatch: RegExpMatchArray = /(.*)_emptylinkdiv_\d+_(\d+)$/.exec(id);
        const match: RegExpMatchArray = weblinkMatch || docLinkMatch || emptyLinkMatch;
        if (!match) {
            return null;
        }
        return {
            annotName: match[1],
            pageIndex: parseInt(match[2], 10)
        };
    }

    /**
     * Context-menu `Select` handler: resolves the link under the right-click
     * target and selects it via the annotation module so the link becomes
     * the current selection.
     * @private
     * @returns {void}
     */
    public selectLinkAnnotationByContextMenu(): void {
        const annotName: string = this.currentContextMenuLinkAnnotName;
        const pageIndex: number = this.currentContextMenuLinkPageIndex;
        if (isNullOrUndefined(annotName) || pageIndex < 0) {
            return;
        }
        const link: any = this.pdfViewer.annotationCollection.find(
            (annotation: any) => annotation.uniqueKey === annotName
        );
        if (link && this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.selectAnnotation(link);
        }
    }


    /**
     * Returns `true` when a link annotation was the target of the most
     * recent context-menu open. Used by the central item-dispatcher in
     * `pdfviewer-base.ts` to know whether the right-click originated on a
     * link (in which case the Select/Edit/Delete items are routed to the
     * link module rather than the generic annotation flow).
     * @private
     * @returns {boolean} - boolean
     */
    public hasContextMenuLinkTarget(): boolean {
        return !isNullOrUndefined(this.currentContextMenuLinkAnnotName) &&
            this.currentContextMenuLinkPageIndex >= 0;
    }

    /**
     * Reset the cached link target used by the context-menu actions.
     * @private
     * @returns {void}
     */
    public resetContextMenuLinkTarget(): void {
        this.currentContextMenuLinkAnnotName = null;
        this.currentContextMenuLinkPageIndex = -1;
    }

    private openLinkDialogForEdit(annotName: string, pageIndex: number): void {
        const link: ILinkAnnotation = this.pdfViewer.annotationCollection.find((annotation: any) => annotation.uniqueKey === annotName);
        if (!link) {
            this.linkDialogEditMode = false;
            return;
        }
        this.linkDialogEditMode = true;
        this.linkDialogEditAnnotName = annotName;
        this.linkDialogEditPageIndex = pageIndex;
        this.linkDialogEditIsUrl = !isNullOrUndefined(link.url) && link.url !== '';
        this.linkDialogEditUrl = link.url || '';
        this.linkDialogEditPageNumber = !this.linkDialogEditIsUrl && !isNullOrUndefined(link.destinationPageIndex) ?
            (link.destinationPageIndex + 1) : null;
        this.linkDialogEditX = !this.linkDialogEditIsUrl && (!isNullOrUndefined(this.linkDialogEditPageNumber)
            && link.destinationLocation && !isNullOrUndefined(link.destinationLocation.x)) ? link.destinationLocation.x : null;
        this.linkDialogEditY = !this.linkDialogEditIsUrl && (!isNullOrUndefined(this.linkDialogEditPageNumber)
            && link.destinationLocation && !isNullOrUndefined(link.destinationLocation.y)) ? link.destinationLocation.y : null;
        this.linkDialogEditZoom = !this.linkDialogEditIsUrl && !isNullOrUndefined(link.zoomValue) ?
            (link.zoomValue as number) : this.pdfViewerBase.getZoomFactor();
        this.linkDialogStrokeColor = isNullOrUndefined(link.strokeColor) ? '#0A7EE4' : link.strokeColor;
        this.linkDialogThickness = isNullOrUndefined(link.thickness) ? 1 : link.thickness;
        if (this.linkDialogEditIsUrl) {
            this.linkDialogPageStrokeColor = '#0A7EE4';
            this.linkDialogPageStrokeThickness = 1;
        } else {
            this.linkDialogUrlStrokeColor = '#0A7EE4';
            this.linkDialogUrlStrokeThickness = 1;
        }
        this.createLinkDialog();
        if (this.linkDialogThicknessSlider) {
            this.linkDialogThicknessSlider.value = this.linkDialogThickness;
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.linkDialog.show();
        }
    }

    private destroyLinkDialog(): void {
        if (!isNullOrUndefined(this.linkDialogStrokeColorPicker)) {
            this.linkDialogStrokeColorPicker.destroy();
            this.linkDialogStrokeColorPicker = null;
        }
        if (!isNullOrUndefined(this.linkDialogThicknessSlider)) {
            this.linkDialogThicknessSlider.destroy();
            this.linkDialogThicknessSlider = null;
        }
        if (!isNullOrUndefined(this.linkDialogUrlRadio)) {
            this.linkDialogUrlRadio.destroy();
            this.linkDialogUrlRadio = null;
        }
        if (!isNullOrUndefined(this.linkDialogPageRadio)) {
            this.linkDialogPageRadio.destroy();
            this.linkDialogPageRadio = null;
        }
        if (!isNullOrUndefined(this.linkDialogPageInput)) {
            this.linkDialogPageInput = null;
        }
        if (!isNullOrUndefined(this.linkDialogXInput)) {
            this.linkDialogXInput = null;
        }
        if (!isNullOrUndefined(this.linkDialogYInput)) {
            this.linkDialogYInput = null;
        }
        if (!isNullOrUndefined(this.linkDialogZoomDropDown)) {
            this.linkDialogZoomDropDown.destroy();
            this.linkDialogZoomDropDown = null;
        }
        if (!isNullOrUndefined(this.linkDialog)) {
            this.linkDialog.destroy();
            this.linkDialog = null;
            const dialogEl: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_link_dialog');
            if (dialogEl) {
                dialogEl.parentNode.removeChild(dialogEl);
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.destroyLinkDialog();
        this.currentContextMenuLinkAnnotName = null;
        this.currentContextMenuLinkPageIndex = -1;
        this.linkAnnotationCount = null;
        this.isAddAnnotationProgramatically = null;
        this.linkDialogStrokeColor = null;
        this.linkDialogThickness = null;
        this.linkDialogEditMode = null;
        this.linkDialogEditPageNumber = null;
        this.linkDialogEditX = null;
        this.linkDialogEditY = null;
        this.linkDialogEditZoom = null;
        this.linkDialogEditIsUrl = null;
    }

    /**
     * @param {string} annotationType - It describes about the type of the annotation
     * @private
     * @returns {boolean} - boolean
     */
    public isLinkAnnotation(annotationType: string): boolean {
        return annotationType === 'Link';
    }
}
