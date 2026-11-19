import { InkAnnotationSettings } from './../pdfviewer';
import { AllowedInteraction, IAnnotation, IPoint, IRect, ISize, PdfViewer } from '../index';
import { PdfViewerBase, IPageAnnotations } from '../index';
import { PdfAnnotationBaseModel, PdfBoundsModel, PdfFormFieldBaseModel } from '../drawing/pdf-annotation-model';
import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { AnnotationSelectorSettingsModel, InkAnnotationSettingsModel } from '../pdfviewer-model';
import { splitArrayCollection, processPathData, getPathString, PointModel, PathElement } from './../ej2-drawings/index';
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { cloneObject } from '../drawing/drawing-util';
import { resolveAppearanceImage } from './appearance-util';
import { AnnotationStatus } from '../base/pdfviewer-utlis';
import { DrawingElement } from '../ej2-drawings';

/**
 * @hidden
 *
 * Local alias for the snapshot shape captured by `drawingSessionSettings`
 * and held by `pendingSessionSettings`. Mirrors the inline shape already
 * declared on `drawingSessionSettings` so both snapshots share one type.
 *
 * Kept local (not exported) to avoid expanding the public surface.
 */
type InkSessionSettings = {
    enableInkHighlight: boolean;
    thickness: number;
    opacity: number;
    subject: string;
    strokeColor: string;
};

/**
 * @hidden
 *
 * Local alias for a path point emitted by `processPathData`. The function
 * returns `Object[]` but each element is a `{ command, x, y }` triple.
 */
type InkPathPoint = { command: string; x: number; y: number };

/**
 * @hidden
 */
export interface IInkAnnotation extends IAnnotation {
    id: string,
    bounds: any;
    pageIndex: number,
    data: string,
    customData: object,
    thickness: number,
    notes: string,
    isPrint: boolean,
    allowedInteractions: AllowedInteraction[],
    isLocked?: boolean,
    initialZoom?: number,
    enableInkHighlight?: boolean
    hasPdfAppearance?: boolean;
    templateAppearanceImage?: HTMLImageElement;
    templateAppearanceId?: string;
    isAppearanceStale?: boolean;
}
export class InkAnnotation {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    public newObject: any = [];
    /**
     * @private
     */
    public outputString: string = '';
    /**
     * @private
     */
    public mouseX: number;
    /**
     * @private
     */
    public mouseY: number;
    /**
     * @private
     */
    public inkAnnotationindex: any = [];
    /**
     * @private
     */
    public isAddAnnotationProgramatically: boolean = false;
    /**
     * @private
     */
    public currentPageNumber: string = '';
    /**
     * @private
     */
    public inkAnnotationInitialZoom: number = 1;
    /**
     * @private
     */
    public inkPathDataCollection: IInkPathDataCollection[] = [];
    /**
     * Snapshot of the previously mouseUp-ed stroke and its paint settings.
     *
     * Between mouseUp (which calls storePathData -> convertToPath,
     * clearing newObject and populating outputString) and addInk()
     * (which adds the annotation to pageObjects / nameTable), the previous
     * stroke is NOT visible to the EJ2 repaint primitives. If the user
     * starts a new stroke that crosses the old one's pixels, the regional
     * clear wipes them and repaintIntersectingAnnotations cannot restore
     * them -- the annotation has not yet been committed.
     *
     * pendingOutputString holds the geometry and pendingSessionSettings
     * holds the paint settings (thickness, opacity, strokeColor) captured
     * from drawingSessionSettings at the time of mouseUp. The drawing-
     * session settings are snapshotted because they are overwritten when
     * the NEXT session's first stroke runs (gated on newObject.length
     * === 0 in drawInkInCanvas); without the snapshot the restore would
     * use whatever the property panel shows at the next mouseDown rather
     * than what the old stroke was actually painted with.
     *
     * Cleared by addInk() once the annotation is committed, and by the
     * zoom-change guard when the zoom changes between the previous
     * mouseUp and the next mouseDown (the path coordinates would then
     * be stale).
     *
     * @private
     */
    public pendingOutputString: string = '';
    public pendingSessionSettings: Pick<InkSessionSettings, 'thickness' | 'opacity' | 'strokeColor'> | null = null;
    /**
     * Drawing-session snapshot of inkAnnotationSettings, captured in
     * drawInkInCanvas() on the first stroke of a new drawing session
     * (gated on newObject.length === 0). addInk() reads from this snapshot
     * so the committed annotation carries the state that existed when
     * drawing actually started.
     *
     * Capturing on the first stroke (rather than in drawInk() at tool
     * activation) preserves property-panel changes made between tool
     * activation and drawing start — e.g. the user selects Freehand
     * Highlight, sets opacity to 1.0 in the property panel, then draws; the
     * committed annotation must carry opacity 1.0, not the FH tool default
     * 0.33.
     *
     * The snapshot still freezes state for the whole session, so a tool
     * switch after drawing has begun (e.g. clicking Ink before mouse-up)
     * cannot alter the in-progress annotation's committed properties.
     *
     * Null when no stroke has been drawn yet. In that case addInk() falls
     * back to the live inkAnnotationSettings, preserving prior behavior.
     * Cleared at the end of each commit.
     */
    private drawingSessionSettings: {
        enableInkHighlight: boolean;
        thickness: number;
        opacity: number;
        subject: string;
        strokeColor: string;
    } | null = null;
    /**
     * Snapshot of the user's plain-Ink settings, captured by the Freehand
     * Highlight toolbar case in `annotation-toolbar.ts` BEFORE it overwrites
     * `pdfViewer.inkAnnotationSettings` with the FH runtime defaults. Held so
     * that an Ink → Freehand Highlight → Ink round-trip can restore the
     * user's previously-configured plain-Ink values (thickness, opacity,
     * subject, strokeColor) instead of leaving them stuck at the FH defaults
     * (thickness 12, opacity 0.33, subject 'Freehand Highlight').
     *
     * Only `thickness`, `opacity`, `subject`, and `strokeColor` are snapshotted
     * because those are the only `inkAnnotationSettings` properties the FH
     * toolbar case mutates. Other Ink settings (isLock, author, customData,
     * isPrint, allowedInteractions) are not overwritten by FH activation and
     * continue to be read live from `pdfViewer.inkAnnotationSettings` by
     * `addInk()`.
     *
     * Lifecycle:
     *   - `null` until the user activates Freehand Highlight at least once
     *     while plain-Ink settings are in effect.
     *   - Written by the FH toolbar case, just before it applies the FH
     *     runtime defaults, only if no snapshot is already present (so a
     *     rapid FH ↔ FH sequence doesn't race with the Ink case's restore).
     *   - Read and cleared by the Ink toolbar case, only on Ink activation
     *     where a snapshot exists.
     *
     * @private
     */
    public userInkSettingsBeforeFreehand: {
        thickness: number;
        opacity: number;
        subject: string;
        strokeColor: string;
    } | null = null;
    /**
     * @private
     */
    public eraserPath: PointModel[] = [];
    /**
     * @private
     */
    public eraserPreviewPageIndex: number = -1;
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @private
     * @returns {void}
     */
    public drawInk(): void {
        // NOTE: the drawing-session snapshot is intentionally NOT captured here.
        // drawInk() runs at tool activation, which is before the user has a
        // chance to adjust Ink/FH properties in the property panel. Capturing
        // at this point froze the tool defaults (e.g. FH opacity 0.33) and
        // discarded user changes made between tool activation and drawing
        // start. The snapshot is captured in drawInkInCanvas() on the first
        // stroke instead, gated on newObject.length === 0.
        this.pdfViewerBase.disableTextSelectionMode();
        this.pdfViewer.tool = 'Ink';
    }

    public drawInkAnnotation(pageNumber?: number): void {
        if (this.pdfViewerBase.isToolbarInkClicked) {
            this.pdfViewerBase.isInkAdded = true;
            this.pdfViewer.annotationModule.isFormFieldShape = false;
            const pageIndex: number = !isNaN(pageNumber) ? pageNumber : this.pdfViewerBase.currentPageNumber - 1;
            if ((this.outputString && this.outputString !== '') || this.inkPathDataCollection.length > 0) {
                const currentAnnot: PdfAnnotationBaseModel = this.addInk(pageIndex);
                this.pdfViewer.renderDrawing(undefined, pageIndex);
                this.pdfViewer.clearSelection(pageIndex);
                this.pdfViewer.select([currentAnnot.id], currentAnnot.annotationSelectorSettings);
                if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableSignaturePropertiesTools(true);
                }
                if (Browser.isDevice && !this.pdfViewer.enableDesktopMode &&
                     this.pdfViewer.enableToolbar && this.pdfViewer.enableAnnotationToolbar) {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.createPropertyTools('Ink');
                }
            } else {
                this.outputString = '';
                this.newObject = [];
                this.pdfViewerBase.isToolbarInkClicked = false;
                this.pdfViewer.tool = '';
                this.inkPathDataCollection = [];
                // Defensive: drop any pending pre-commit snapshot.
                this.pendingOutputString = '';
                this.pendingSessionSettings = null;
            }
            this.pdfViewerBase.isInkAdded = false;
        }
    }

    /**
     * @private
     * @returns {any} - any
     */
    public updateInkDataWithZoom(): string {
        let updatedPathData: string = '';
        if (this.outputString !== '') {
            this.inkPathDataCollection.push({ pathData: this.outputString, zoomFactor: this.inkAnnotationInitialZoom });
        }
        if (this.inkPathDataCollection.length > 0) {
            //for loop to get the path data from the collection with path zoom factor
            for (let i: number = 0; i < this.inkPathDataCollection.length; i++) {
                updatedPathData += this.updatePathDataWithZoom(this.inkPathDataCollection[parseInt(i.toString(), 10)].pathData,
                                                               this.inkPathDataCollection[parseInt(i.toString(), 10)].zoomFactor);
            }
        } else {
            updatedPathData += this.updatePathDataWithZoom(this.outputString, this.inkAnnotationInitialZoom);
        }
        return updatedPathData;
    }

    private updatePathDataWithZoom(pathData: any, pathZoomFactor: number): string {
        let pathString: string = '';
        const zoom: number = this.pdfViewerBase.getZoomFactor();
        const collectionData: Object[] = processPathData(pathData);
        const csData: Object[] = splitArrayCollection(collectionData);
        for (let j: number = 0; j < csData.length; j++) {
            const pathValue: any = csData[parseInt(j.toString(), 10)];
            pathString += pathValue.command + pathValue.x * (zoom / pathZoomFactor) + ',' + pathValue.y * (zoom / pathZoomFactor) + ' ';
        }
        return pathString;
    }

    /**
     * @private
     * @returns {void}
     */
    public storePathData(): void {
        this.convertToPath(this.newObject);
        // Snapshot the previous stroke's geometry and the settings that
        // paint it. Between mouseUp (which calls storePathData) and the
        // next addInk, this.outputString is the ONLY available source of
        // truth for the previous stroke: newObject was just cleared, and
        // the annotation has not yet been added to pageObjects / nameTable.
        // If the user starts a new stroke that crosses the old one's
        // pixels, the regional clear will wipe them, and the EJ2 repaint
        // primitives cannot find the annotation. The pending snapshot is
        // the fallback that lets drawInkInCanvas restore the old stroke
        // directly from the canvas API.
        //
        // drawingSessionSettings holds the properties frozen at the first
        // stroke of the old session; it is overwritten when the NEXT
        // session's first stroke runs (gated on newObject.length === 0 in
        // drawInkInCanvas). Snapshot it here so the restore uses the
        // thickness / opacity / color the old stroke was actually painted
        // with, not whatever the property panel happens to show at the
        // time of the next mouseDown.
        this.pendingOutputString = this.outputString;
        this.pendingSessionSettings = this.drawingSessionSettings
            ? {
                thickness: this.drawingSessionSettings.thickness,
                opacity: this.drawingSessionSettings.opacity,
                strokeColor: this.drawingSessionSettings.strokeColor
            }
            : null;
        this.newObject = [];
    }

    /**
     * @param {any} position - It describes about the position of the annotation
     * @param {number} pageIndex - It describes about the page index value
     * @private
     * @returns {void}
     */
    public drawInkInCanvas(position: any, pageIndex: number): void {
        if (this.pdfViewer.magnificationModule && this.pdfViewer.magnificationModule.isPinchZoomed && this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.addInkAnnotation();
            return;
        }
        if (this.currentPageNumber !== '' && parseInt(this.currentPageNumber, 10) !== pageIndex) {
            this.drawInkAnnotation(parseInt(this.currentPageNumber, 10));
            this.pdfViewerBase.isToolbarInkClicked = true;
            this.pdfViewer.tool = 'Ink';
        }
        // R-18 Phase 3 follow-up: capture the drawing-session snapshot on the
        // FIRST stroke of a new drawing session, gated on newObject.length === 0.
        // Capturing here (rather than in drawInk() at tool activation) preserves
        // property-panel changes made between tool activation and drawing start
        // (e.g. user selects Freehand Highlight, sets opacity to 1.0 in the
        // property panel, then draws — the committed annotation must carry
        // opacity 1.0, not the tool default 0.33).
        //
        // The snapshot still freezes the state for the duration of the session,
        // so a tool switch after drawing has begun (e.g. user clicks Ink before
        // releasing the mouse) cannot alter the in-progress annotation's
        // committed properties. Subsequent strokes do not re-capture because
        // newObject.length is non-zero.
        if (this.newObject.length === 0) {
            const sessionSettings: InkAnnotationSettingsModel = this.pdfViewer.inkAnnotationSettings;
            this.drawingSessionSettings = {
                enableInkHighlight: !!(sessionSettings && sessionSettings.enableInkHighlight),
                thickness: sessionSettings && sessionSettings.thickness ? sessionSettings.thickness : 1,
                opacity: sessionSettings && !isNullOrUndefined(sessionSettings.opacity) ? sessionSettings.opacity : 1,
                subject: sessionSettings && sessionSettings.subject ? sessionSettings.subject : 'Ink',
                strokeColor: sessionSettings && sessionSettings.strokeColor ? sessionSettings.strokeColor : '#ff0000'
            };
        }
        const zoom: number = this.pdfViewerBase.getZoomFactor();
        // Zoom-change guard: if the zoom at which the first stroke was drawn
        // differs from the current zoom, this.newObject holds points in a
        // stale coordinate system. The canvas backing store was resized by
        // the zoom handler and refreshCanvasDiagramLayer already repainted
        // all committed annotations. Skip the regional clear/repaint (which
        // would operate on stale coordinates) and reset the in-progress
        // state so the next stroke starts fresh. Matches the behaviour of
        // other tools that don't survive a zoom change mid-action.
        const zoomChanged: boolean = this.newObject.length > 0 &&
            this.inkAnnotationInitialZoom !== null &&
            Math.abs(this.inkAnnotationInitialZoom - zoom) > 0.001;
        if (zoomChanged) {
            this.newObject = [];
            this.outputString = '';
            this.inkPathDataCollection = [];
            // Drop the pending snapshot too: its path coordinates are in
            // the old zoom's coordinate space, so they would render at the
            // wrong scale if restored now.
            this.pendingOutputString = '';
            this.pendingSessionSettings = null;
        }
        this.inkAnnotationInitialZoom = zoom;
        const ratio: number = this.pdfViewerBase.getWindowDevicePixelRatio();
        // R-18: Freehand Highlight live preview routes to the highlight blend canvas
        // so the user sees the blend effect immediately while drawing. The blend
        // canvas is created lazily by createBlendAnnotationsIntoCanvas() if it does
        // not yet exist on this page (mirror of the getHighlightCanvasContext()
        // pattern in text-markup-annotation.ts:745 and the commit-time render
        // path in renderExistingInkSignature). For plain Ink, the regular
        // _annotationCanvas_ is used.
        const enableInkHighlight: boolean = this.pdfViewer.inkAnnotationSettings && this.pdfViewer.inkAnnotationSettings.enableInkHighlight;
        let canvas: HTMLElement | undefined;
        if (enableInkHighlight) {
            const blendCanvasId: string = '_blendAnnotationsIntoCanvas_' + pageIndex;
            canvas = this.pdfViewerBase.getElement(blendCanvasId);
            if (isNullOrUndefined(canvas)) {
                const pageDiv: HTMLElement = document.getElementById(
                    this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
                const pageSize: ISize = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
                if (pageDiv && pageSize && pageSize.width && pageSize.height) {
                    canvas = this.pdfViewer.annotationModule.createBlendAnnotationsIntoCanvas(pageDiv, pageSize.width, pageSize.height,
                                                                                              pageIndex);
                }
            }
        } else {
            canvas = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', pageIndex);
        }
        const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d');
        const thickness: number = this.pdfViewer.inkAnnotationSettings.thickness ? this.pdfViewer.inkAnnotationSettings.thickness : 1;
        const opacity: number = !isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.opacity) ?
            this.pdfViewer.inkAnnotationSettings.opacity : 1;
        const strokeColor: string = this.pdfViewer.inkAnnotationSettings.strokeColor ? this.pdfViewer.inkAnnotationSettings.strokeColor : '#ff0000';
        if (!Browser.isDevice || (Browser.isDevice && zoom <= 0.7)) {
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        }
        // Regional clear & redraw: when at least one segment is already
        // committed to the canvas from the previous mouse-move, clear only
        // the bounding box of the in-progress stroke (not the whole canvas)
        // and repaint any committed annotations that intersect that box.
        // Then stroke the full cumulative path in a single pass. This
        // eliminates the per-segment alpha accumulation that produced visible
        // "stamps" at high thickness / low opacity, while preserving
        // committed annotations and avoiding the full-canvas flicker of the
        // earlier renderAnnotations approach.
        const isFirstStroke: boolean = this.newObject.length === 0;
        if (!isFirstStroke && this.newObject.length >= 4) {
            const region: IRect = this.getInProgressStrokeBounds();
            if (region && region.width > 0 && region.height > 0) {
                // clearRect runs under the DPR-only transform set above
                // (region is in page coordinates, which is the live-preview
                // space).
                context.clearRect(region.x, region.y, region.width, region.height);
                // refreshDiagramElements / renderer.renderElement read wrapper
                // geometry in annotation units and expect the transform that
                // the canonical renderer uses -- setTransform(zoomRatio, ...)
                // where zoomRatio = zoom * devicePixelRatio. Without the
                // temporary transform swap, repainted wrappers would draw at
                // 1/zoom scale and appear in the top-left corner.
                context.save();
                if (!Browser.isDevice || (Browser.isDevice && zoom <= 0.7)) {
                    context.setTransform(ratio * zoom, 0, 0, ratio * zoom, 0, 0);
                } else {
                    context.setTransform(zoom, 0, 0, zoom, 0, 0);
                }
                context.beginPath();
                context.rect(
                    region.x / zoom,
                    region.y / zoom,
                    region.width / zoom,
                    region.height / zoom
                );
                context.clip();
                this.repaintIntersectingAnnotations(canvas as HTMLCanvasElement, region, pageIndex, enableInkHighlight);
                context.restore();
                // Restore the pre-commit previous stroke directly from the
                // canvas API, using pendingOutputString as the geometry
                // source. This closes the gap between mouseUp and addInk,
                // when the annotation is not yet in pageObjects / nameTable
                // and the EJ2 repaint primitives cannot find it. The call
                // runs under the DPR-only transform (the default in this
                // scope after the inner restore).
                this.restorePreviousStroke(context, region);
            }
        }
        context.beginPath();
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = thickness * zoom > 1 ? thickness * zoom : thickness;
        context.strokeStyle = strokeColor;
        context.globalAlpha = opacity;
        // After the addition of a TextMarkup annotation, a LineDash value was introduced. To eliminate it, the value was cleared.
        context.setLineDash([]);
        if (isFirstStroke) {
            // No previous segment to redraw: draw one segment only. With
            // opacity, a single sub-pixel stroke cannot accumulate, so the
            // stamps artefact cannot appear here.
            context.moveTo(position.prevPosition.x, position.prevPosition.y);
            context.lineTo(position.currentPosition.x, position.currentPosition.y);
            context.stroke();
        } else {
            // Stroke the full cumulative path once. lineJoin = 'round' makes
            // adjacent segments blend continuously so the visible stroke is a
            // single smooth curve with a single alpha application.
            if (this.newObject.length >= 2) {
                context.moveTo(this.newObject[0], this.newObject[1]);
                for (let i: number = 2; i < this.newObject.length; i += 2) {
                    context.lineTo(this.newObject[parseInt(i.toString(), 10)],
                                   this.newObject[parseInt((i + 1).toString(), 10)]);
                }
                context.lineTo(position.currentPosition.x, position.currentPosition.y);
                context.stroke();
            }
        }
        context.closePath();
        this.pdfViewerBase.prevPosition = position.currentPosition;
        this.newObject.push(position.currentPosition.x, position.currentPosition.y);
        this.currentPageNumber = pageIndex.toString();
    }

    /**
     * Computes the bounding rect of the in-progress stroke in canvas
     * coordinates, expanded by half the rendered stroke width on each side.
     *
     * * Coordinate space: this.newObject is stored in PAGE coordinates (the
     * same space the live preview draws with -- see drawInkInCanvas's
     * `setTransform(ratio, 0, 0, ratio, 0, 0)` where ratio is DPR only).
     * context.clearRect expects page coordinates, so no zoom transformation
     * is applied here. The returned region is ready to pass directly to
     * `clearRect`.
     *
     * @private
     * @returns {IRect | null} - The stroke bounding rect or null when fewer
     * than two points have been accumulated.
     */
    private getInProgressStrokeBounds(): IRect | null {
        if (!this.newObject || this.newObject.length < 4) {
            return null;
        }
        let minX: number = this.newObject[0];
        let minY: number = this.newObject[1];
        let maxX: number = minX;
        let maxY: number = minY;
        for (let i: number = 2; i < this.newObject.length; i += 2) {
            const x: number = this.newObject[parseInt(i.toString(), 10)];
            const y: number = this.newObject[parseInt((i + 1).toString(), 10)];
            if (x < minX) { minX = x; }
            if (x > maxX) { maxX = x; }
            if (y < minY) { minY = y; }
            if (y > maxY) { maxY = y; }
        }
        const thickness: number = this.pdfViewer.inkAnnotationSettings.thickness ?
            this.pdfViewer.inkAnnotationSettings.thickness : 1;
        const zoom: number = this.pdfViewerBase.getZoomFactor();
        // Stroke half-width in page coordinates matches the lineWidth used by
        // drawInkInCanvas (thickness * zoom > 1 ? thickness * zoom : thickness).
        const strokeHalfWidth: number = thickness * zoom > 1 ? (thickness * zoom) / 2 : thickness / 2;
        return {
            x: minX - strokeHalfWidth,
            y: minY - strokeHalfWidth,
            width: (maxX - minX) + (2 * strokeHalfWidth),
            height: (maxY - minY) + (2 * strokeHalfWidth)
        };
    }

    /**
     * Restores the previously mouseUp-ed stroke inside the dirty region, using
     * `pendingOutputString` as the geometry source and the snapshotted
     * session settings as the paint source.
     *
     * Why this exists:
     * Between mouseUp (which calls `storePathData`, clearing `newObject` and
     * populating `outputString`) and `addInk()` (which adds the annotation to
     * `pageObjects` / `nameTable`), the previous stroke is NOT visible to the
     * EJ2 repaint primitives. If the user starts a new stroke that crosses
     * the old one's pixels, the regional clear wipes them and
     * `repaintIntersectingAnnotations` cannot restore them — the annotation
     * has not yet been committed. This helper closes that gap by restoring
     * the previous stroke directly from the canvas API, using the
     * snapshotted thickness / opacity / color so the restore matches the
     * original paint exactly.
     *
     * Coordinate space: pendingOutputString was captured by storePathData
     * from `convertToPath(this.newObject)`, whose coordinates are in the
     * same CSS-pixel space as the live preview (the live-preview transform
     * is DPR-only and the mouse positions are CSS pixels). The restore
     * therefore runs under the DPR-only transform in the same coordinate
     * space as the original paint.
     *
     * The intersection test between the dirty region and the previous
     * stroke's AABB is a cheap pre-filter: if the previous stroke does not
     * touch the region, we have nothing to restore and the restore is a
     * no-op.
     *
     * @private
     * @param {any} context - The canvas 2D context. The caller has already
     * set the DPR-only transform; this helper just strokes inside the
     * existing clip (if any).
     * @param {any} region - The dirty region in page coordinates (CSS px).
     * @returns {void}
     */
    private restorePreviousStroke(context: CanvasRenderingContext2D, region: IRect): void {
        if (!context || !region || region.width <= 0 || region.height <= 0) {
            return;
        }
        if (!this.pendingOutputString || this.pendingOutputString === '') {
            return;
        }
        // Cheap pre-filter: parse the previous stroke's AABB from
        // pendingOutputString and bail early if it cannot possibly intersect
        // the dirty region. The common case (a small new stroke segment
        // somewhere far from the previous one) hits this fast path.
        const pendingPoints: Object[] = processPathData(this.pendingOutputString);
        let pMinX: number = Number.POSITIVE_INFINITY;
        let pMinY: number = Number.POSITIVE_INFINITY;
        let pMaxX: number = Number.NEGATIVE_INFINITY;
        let pMaxY: number = Number.NEGATIVE_INFINITY;
        for (let p: number = 0; p < pendingPoints.length; p++) {
            const pt: InkPathPoint = pendingPoints[parseInt(p.toString(), 10)] as InkPathPoint;
            if (pt && !isNaN(pt.x) && !isNaN(pt.y)) {
                if (pt.x < pMinX) { pMinX = pt.x; }
                if (pt.x > pMaxX) { pMaxX = pt.x; }
                if (pt.y < pMinY) { pMinY = pt.y; }
                if (pt.y > pMaxY) { pMaxY = pt.y; }
            }
        }
        if (pMinX === Number.POSITIVE_INFINITY) {
            return;
        }
        // AABB intersection in page coordinates.
        if (pMaxX < region.x ||
            region.x + region.width < pMinX ||
            pMaxY < region.y ||
            region.y + region.height < pMinY) {
            return;
        }
        // Restore the previous stroke at its original paint settings. The
        // caller has set the DPR-only transform and (optionally) established
        // a clip; this helper just strokes inside that scope.
        const pendingSettings: Pick<InkSessionSettings, 'thickness' | 'opacity' | 'strokeColor'> = this.pendingSessionSettings || {
            thickness: 1, opacity: 1, strokeColor: '#ff0000'
        };
        const pThickness: number = !isNullOrUndefined(pendingSettings.thickness) ?
            pendingSettings.thickness : 1;
        const pOpacity: number = !isNullOrUndefined(pendingSettings.opacity) ?
            pendingSettings.opacity : 1;
        const pColor: string = pendingSettings.strokeColor || '#ff0000';
        const zoom: number = this.pdfViewerBase.getZoomFactor();
        context.save();
        // Replay the previous stroke. SVG path data is absolute (M..L..);
        // building it via moveTo/lineTo in the canvas context uses the
        // canvas's own coordinate system, so it matches the original paint.
        const firstPt: InkPathPoint = pendingPoints[0] as InkPathPoint;
        context.beginPath();
        context.rect(
            region.x,
            region.y,
            region.width,
            region.height
        );
        context.clip();
        context.beginPath();
        for (let i: number = 1; i < pendingPoints.length; i++) {
            const pt: InkPathPoint = pendingPoints[parseInt(i.toString(), 10)] as InkPathPoint;
            if (!pt || isNaN(pt.x) || isNaN(pt.y)) {
                continue;
            }
            switch (pt.command) {
            case 'M':
                context.moveTo(pt.x, pt.y);
                break;
            case 'L':
                context.lineTo(pt.x, pt.y);
                break;
            }
        }
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = pThickness * zoom > 1 ? pThickness * zoom : pThickness;
        context.strokeStyle = pColor;
        context.globalAlpha = pOpacity;
        context.setLineDash([]);
        context.stroke();
        context.restore();
    }

    /**
     * Repaints every committed annotation on the page that intersects the
     * cleared region. Uses Drawing.repaintAnnotations, which wraps the
     * existing EJ2 repaint primitive `refreshDiagramElements` to render a
     * list of wrappers to a canvas WITHOUT clearing the canvas first. This
     * is the same primitive used by Drawing.refreshCanvasDiagramLayer for
     * the canonical full-page repaint, so every annotation type is already
     * supported.
     *
     * Two canvas modes:
     *  - Annotation canvas (_annotationCanvas_): repaint everything on the
     *    page EXCEPT FH wrappers. FH lives on the blend canvas, so an FH
     *    wrapper must never be drawn onto the annotation canvas where it
     *    would darken the page text.
     *  - Blend canvas (_blendAnnotationsIntoCanvas_): repaint only FH
     *    wrappers. Nothing else lives on the blend canvas.
     *
     * @private
     * @param {HTMLCanvasElement} canvas - The canvas to repaint onto.
     * @param {any} region - The cleared region in canvas coordinates.
     * @param {number} pageIndex - The page being repainted.
     * @param {boolean} isBlendCanvas - True when canvas is the blend canvas.
     * @returns {void}
     */
    private repaintIntersectingAnnotations(canvas: HTMLCanvasElement, region: any, pageIndex: number,
                                           isBlendCanvas: boolean): void {
        const pageObjects: (PdfAnnotationBaseModel)[] = this.pdfViewer.drawing.getPageObjects(pageIndex);
        if (!pageObjects || pageObjects.length === 0) {
            return;
        }
        const intersectingWrappers: DrawingElement[] = [];
        for (let i: number = 0; i < pageObjects.length; i++) {
            const obj: PdfAnnotationBaseModel = pageObjects[parseInt(i.toString(), 10)];
            if (!obj || !obj.id) {
                continue;
            }
            const isFH: boolean = obj.enableInkHighlight === true ||
                (obj.shapeAnnotationType === 'Ink' &&
                 !isNullOrUndefined(obj.subject) &&
                 /Free\s*Hand\s*Highlight/i.test(obj.subject));
            // Canvas-mode filter: exclude wrappers that don't belong on this
            // canvas. An FH wrapper drawn onto the annotation canvas would
            // darken the page text; a non-FH wrapper drawn onto the blend
            // canvas would render on a multiply-blended layer that doesn't
            // apply to it.
            if (isBlendCanvas && !isFH) {
                continue;
            }
            if (!isBlendCanvas && isFH) {
                continue;
            }
            const nameTable: Record<string, PdfAnnotationBaseModel | PdfFormFieldBaseModel> = this.pdfViewer.nameTable;
            const wrapper: DrawingElement = nameTable[obj.id] ? (nameTable[obj.id] as PdfAnnotationBaseModel).wrapper : null;
            if (!wrapper) {
                continue;
            }
            if (!this.annotationWrapperIntersectsRegion(wrapper, region)) {
                continue;
            }
            intersectingWrappers.push(wrapper);
        }
        if (intersectingWrappers.length === 0) {
            return;
        }
        this.pdfViewer.drawing.repaintAnnotations(canvas, intersectingWrappers);
    }

    /**
     * Tests whether an annotation wrapper's bounding rect intersects the
     * cleared region. Uses wrapper.bounds (kept in sync by Drawing.updateBounds
     * on every measure/arrange), multiplied by the current zoom to convert
     * from annotation units to canvas coordinates. For rotated wrappers we
     * fall back to wrapper.actualSize placed at the wrapper's offset, which
     * is a generous AABB approximation -- overestimating the intersection
     * never causes a visual regression, it just means an extra annotation
     * gets redrawn.
     *
     * @private
     * @param {any} wrapper - The annotation wrapper to test.
     * @param {any} region - The cleared region in canvas coordinates.
     * @returns {boolean} - True if the wrapper intersects the region.
     */
    private annotationWrapperIntersectsRegion(wrapper: DrawingElement, region: IRect): boolean {
        const zoom: number = this.pdfViewerBase.getZoomFactor();
        let x: number; let y: number; let w: number; let h: number;
        if (wrapper.bounds && wrapper.bounds.width > 0 && wrapper.bounds.height > 0) {
            x = wrapper.bounds.x * zoom;
            y = wrapper.bounds.y * zoom;
            w = wrapper.bounds.width * zoom;
            h = wrapper.bounds.height * zoom;
        } else {
            x = (wrapper.offsetX - wrapper.actualSize.width * wrapper.pivot.x) * zoom;
            y = (wrapper.offsetY - wrapper.actualSize.height * wrapper.pivot.y) * zoom;
            w = wrapper.actualSize.width * zoom;
            h = wrapper.actualSize.height * zoom;
        }
        // AABB intersection test in canvas coordinates.
        return !(x + w < region.x ||
                 region.x + region.width < x ||
                 y + h < region.y ||
                 region.y + region.height < y);
    }

    /**
     * @param {any} position - It describes about the position of the annotation
     * @private
     * @returns {void}
     */
    public addEraserPath(position: any): void {
        this.eraserPath.push({ x: position.currentPosition.x, y: position.currentPosition.y });
    }

    /**
     * Draws a temporary preview stroke during eraser movement.
     * Shows a black semi-transparent line that follows the cursor.
     * @param {number} pageIndex - The page on which the preview should be drawn
     * @param {number} eraserSize - The diameter of the eraser
     * @private
     * @returns {void}
     */
    public drawEraserPreview(pageIndex: number, eraserSize: number): void {
        const ratio: number = this.pdfViewerBase.getWindowDevicePixelRatio();
        const canvas: any = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', pageIndex);
        const context: any = canvas.getContext('2d');
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.beginPath();
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = eraserSize;
        context.strokeStyle = '#D3D3D333';
        const pts: any = this.eraserPath;
        if (pts.length > 0) {
            context.moveTo(pts[0].x, pts[0].y);
            for (let i: number = 1; i < pts.length; i++) {
                context.lineTo(pts[(i as number)].x, pts[(i as number)].y);
            }
        }
        context.setLineDash([]);
        context.stroke();
        context.closePath();
        this.eraserPreviewPageIndex = pageIndex;
    }

    private convertToPath(newObject: any): void {
        this.movePath(newObject[0], newObject[1]);
        this.linePath(newObject[0], newObject[1]);
        for (let n: number = 2; n < newObject.length; n = n + 2) {
            this.linePath(newObject[parseInt(n.toString(), 10)], newObject[n + 1]);
        }
    }

    private linePath(x: number, y: number): void {
        if (!isNullOrUndefined(x) && !isNullOrUndefined(y)) {
            this.outputString += 'L' + x + ',' + y + ' ';
        }
    }

    private movePath(x: number, y: number): void {
        if (!isNullOrUndefined(x) && !isNullOrUndefined(y)) {
            this.outputString += 'M' + x + ',' + y + ' ';
        }
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {any} - any
     */
    public addInk(pageNumber?: number): any {
        this.outputString = this.updateInkDataWithZoom();
        const currentBounds: any = this.calculateInkSize(this.outputString);
        let annot: any;
        if (this.pdfViewerBase.isToolbarInkClicked) {
            const annotationName: string = this.pdfViewer.annotation.createGUID();
            const modifiedDate: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            const pageIndex: number = !isNaN(pageNumber) ? pageNumber : this.pdfViewerBase.currentPageNumber - 1;
            // R-3 / R-18: Freehand Highlight commit. The tool selection case in
            // onToolbarClicked sets enableInkHighlight = true and the Freehand Highlight
            // defaults (thickness 12, opacity 0.33, subject 'Freehand Highlight') on
            // inkAnnotationSettings before drawInk() runs. addInk reads those values
            // transparently — the same code path handles plain Ink and Freehand
            // Highlight with no special-case branching. The enableInkHighlight flag is
            // propagated onto the in-memory annotObject (IInkAnnotation) so:
            //   1. The render path (renderExistingInkSignature) can route the stroke
            //      to the blend canvas.
            //   2. The save path (saveInkSignature in pdf-base/annotation-renderer.ts)
            //      can write the EJ2 PDF marker ('IT' = 'InkHighlight') onto the
            //      PdfInkAnnotation dictionary. This marker survives Save → Export
            //      → Import → Reload and is the single source of truth for the
            //      Freehand Highlight identification on subsequent lifecycle
            //      operations.
            // R-18 Phase 3 follow-up: read commit values from the drawing-session
            // snapshot captured in drawInkInCanvas() on the first stroke rather
            // than from the live inkAnnotationSettings. The snapshot freezes the
            // state at drawing-start, which (a) preserves property-panel changes
            // made after tool activation but before drawing begins (e.g. the user
            // sets FH opacity to 1.0 before drawing), and (b) prevents a tool
            // switch after drawing has begun (e.g. the user clicks Ink before
            // releasing the mouse) from committing the in-progress annotation
            // with the new tool's settings.
            // Falls back to live inkAnnotationSettings when no snapshot exists
            // (e.g. no stroke has been drawn yet).
            const session: InkSessionSettings | InkAnnotationSettingsModel =
                this.drawingSessionSettings || this.pdfViewer.inkAnnotationSettings;
            const enableInkHighlight: boolean = !!(session && session.enableInkHighlight);
            const thickness: number = session && session.thickness ? session.thickness : 1;
            const opacity: number = session && !isNullOrUndefined(session.opacity) ?
                session.opacity : 1;
            const strokeColor: string = session && session.strokeColor ? session.strokeColor : '#ff0000';
            const sessionSubject: string = session && session.subject ? session.subject : '';
            const isLock: boolean = this.pdfViewer.inkAnnotationSettings.isLock ?
                this.pdfViewer.inkAnnotationSettings.isLock : this.pdfViewer.annotationSettings.isLock;
            const author: string = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.inkAnnotationSettings.author ? this.pdfViewer.inkAnnotationSettings.author : 'Guest';
            const subject: string = (this.pdfViewer.annotationSettings.subject !== '' && !isNullOrUndefined(this.pdfViewer.annotationSettings.subject)) ? this.pdfViewer.annotationSettings.subject :
                sessionSubject || (this.pdfViewer.inkAnnotationSettings.subject ? this.pdfViewer.inkAnnotationSettings.subject : 'Ink');
            const customData: object = !isNullOrUndefined(this.pdfViewer.annotationSettings.customData) ?
                this.pdfViewer.annotationSettings.customData : this.pdfViewer.inkAnnotationSettings.customData ?
                    this.pdfViewer.inkAnnotationSettings.customData : null;
            const isPrint: boolean = this.pdfViewer.inkAnnotationSettings.isPrint;
            const allowedInteractions: any = this.pdfViewer.inkAnnotationSettings.allowedInteractions ?
                this.pdfViewer.inkAnnotationSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
            const annotationSettings: any = this.pdfViewer.annotationModule.updateAnnotationSettings(this.pdfViewer.inkAnnotationSettings);
            if (isLock) {
                annotationSettings.isLock = true;
            }
            annot = {
                id: 'ink' + this.pdfViewerBase.inkCount, bounds: { x: currentBounds.x, y: currentBounds.y, width: currentBounds.width, height: currentBounds.height }, pageIndex: pageIndex, data: this.outputString, customData: customData,
                shapeAnnotationType: 'Ink', opacity: opacity, strokeColor: strokeColor, thickness: thickness, annotName: annotationName, comments: [],
                author: author, subject: subject, notes: '',
                review: { state: '', stateModel: '', modifiedDate: modifiedDate, author: author },
                annotationSelectorSettings: this.getSelector('Ink', ''), modifiedDate: modifiedDate, annotationSettings: annotationSettings,
                isPrint: isPrint, allowedInteractions: allowedInteractions, isCommentLock: false, isLocked: isLock
                // enableInkHighlight is intentionally NOT on annot (PdfAnnotationBaseModel
                // is a strict EJ2 base interface and does not allow extra properties).
                // The flag is propagated only onto annotObject below (IInkAnnotation),
                // which is what gets stored in the in-memory collection and read by
                // renderExistingInkSignature to route the stroke to the blend canvas.
            };
            const annotObject: IInkAnnotation = {
                id: 'ink' + this.pdfViewerBase.inkCount, bounds: { x: currentBounds.x, y: currentBounds.y, width: currentBounds.width, height: currentBounds.height }, pageIndex: pageIndex, data: this.outputString, customData: customData,
                shapeAnnotationType: 'Ink', opacity: opacity, strokeColor: strokeColor, thickness: thickness, annotName: annotationName, comments: [],
                author: author, subject: subject, notes: '',
                review: { state: '', stateModel: '', modifiedDate: modifiedDate, author: author },
                annotationSelectorSettings: this.getSelector('Ink', ''), modifiedDate: modifiedDate, annotationSettings: annotationSettings,
                isPrint: isPrint, allowedInteractions: allowedInteractions, isCommentLock: false,
                isLocked: isLock, status: AnnotationStatus.NewlyAdded, initialZoom: this.inkAnnotationInitialZoom,
                enableInkHighlight: enableInkHighlight
            };
            const annotation: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
            // R-18 / Phase 2 Fix 7: Freehand Highlight lifecycle — the marker
            // 'IT' = 'InkHighlight' is a PDF-dictionary entry on the
            // @syncfusion/ej2-pdf PdfInkAnnotation object, NOT on the EJ2
            // Syncfusion base wrapper returned by pdfViewer.add(). The PDF
            // PdfInkAnnotation instance is constructed later in the lifecycle
            // by AnnotationRenderer.saveInkSignature / updateInkSignature
            // (src/pdfviewer/pdf-base/annotation-renderer.ts:1918 and :2145),
            // which is where setValues('IT', 'InkHighlight') actually lives.
            //
            // Two earlier Phase 2 attempts called setValues on the EJ2 base
            // model in addInk() (Fix 5 and Fix 6). Both failed at runtime
            // because PdfAnnotationBaseModel is a strict EJ2 base interface
            // with no setValues method. The cast through `as any` hid the
            // error from TypeScript but did not prevent the runtime
            // TypeError.
            //
            // The correct architecture is:
            //   1. In-memory: annotObject (IInkAnnotation) carries
            //      enableInkHighlight: true. storeAnnotations() persists it.
            //      renderExistingInkSignature() reads it and routes the
            //      stroke to the blend canvas. (Already done — see Fix 2.)
            //   2. EJ2 wrapper: annotation (PdfAnnotationBaseModel) is the
            //      Syncfusion base wrapper. We do NOT call setValues here.
            //      Instead, we propagate the flag as a plain property on the
            //      wrapper so downstream lifecycle code (addAction, undo/redo,
            //      property panel, cloneObject) can read it without throwing.
            //   3. PDF dictionary: AnnotationRenderer.saveInkSignature /
            //      updateInkSignature read inkSignatureAnnotation.enableInkHighlight
            //      (passed via the JSON-serialized in-memory collection) and
            //      call setValues('IT', 'InkHighlight') on the real
            //      PdfInkAnnotation. (Already done — Fix 5.)
            //
            // This block does (2): plain property on the EJ2 wrapper.
            if (enableInkHighlight && annotation) {
                annotation.enableInkHighlight = true;
            }
            const bounds: any = { left: annot.bounds.x, top: annot.bounds.y, width: annot.bounds.width, height: annot.bounds.height };
            const settings: any = {
                opacity: annot.opacity, strokeColor: annot.strokeColor, thickness: annot.thickness, modifiedDate: annot.modifiedDate,
                width: annot.bounds.width, height: annot.bounds.height, data: this.outputString
            };
            this.pdfViewerBase.inkCount++;
            const commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('ink', (annot.pageIndex + 1), annot.shapeAnnotationType, undefined, annot.subject);
            if (commentsDivid) {
                const commentElement: HTMLElement = (this.pdfViewer.element as HTMLElement).querySelector('[id="' + commentsDivid + '"]');
                if (commentElement) {
                    commentElement.id = annotationName;
                }
            }
            annot.annotName = annotationName;
            this.pdfViewer.annotation.addAction(pageIndex, null, annotation, 'Addition', '', annotation, annotation);
            this.pdfViewer.annotationModule.storeAnnotations(pageIndex, annotObject, '_annotations_ink');
            this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'Ink', bounds, settings);
            if (this.pdfViewerBase.isInkAdded) {
                this.outputString = '';
                this.newObject = [];
                this.inkPathDataCollection = [];
            }
            // Clear the drawing-session snapshot so the next addInk() reads
            // fresh values from inkAnnotationSettings until drawInk() captures
            // a new snapshot for the next drawing session.
            this.drawingSessionSettings = null;
            // Clear the pending pre-commit snapshot too. The annotation is
            // now in pageObjects / nameTable, so future regional repaints
            // can find it via the EJ2 repaint primitives; the pending
            // fallback is no longer needed.
            this.pendingOutputString = '';
            this.pendingSessionSettings = null;
            this.pdfViewerBase.isToolbarInkClicked = false;
            this.pdfViewer.tool = '';
        }
        return annot;
    }

    /**
     * @private
     * @returns {void}
     */
    public setAnnotationMode(): void {
        if (this.pdfViewerBase.isToolbarInkClicked) {
            this.drawInkAnnotation();
        } else {
            this.pdfViewerBase.isToolbarInkClicked = true;
            this.drawInk();
        }
    }
    public saveInkSignature(): string {
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_ink');
        const annotations: Array<any> = [];
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[parseInt(j.toString(), 10)] = [];
        }
        if (storeObject && !this.pdfViewer.annotationSettings.skipDownload) {
            let annotationCollection: IPageAnnotations[] = JSON.parse(JSON.stringify(storeObject)) as IPageAnnotations[];
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: any[] = [];
                const pageAnnotationObject: IPageAnnotations = annotationCollection[parseInt(i.toString(), 10)];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        if (this.pdfViewer.printModule && this.pdfViewer.printModule.canPrint &&
                            pageAnnotationObject.annotations[parseInt(z.toString(), 10)].isPrint === false) {
                            pageAnnotationObject.annotations.splice(parseInt(z.toString(), 10), 1);
                            z--;
                            continue;
                        }
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[parseInt(z.toString(), 10)]);
                        const strokeColorString: string = pageAnnotationObject.annotations[parseInt(z.toString(), 10)].strokeColor;
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].strokeColor =
                         JSON.stringify(this.pdfViewerBase.signatureModule.getRgbCode(strokeColorString));
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds =
                         JSON.stringify(this.pdfViewer.annotation.
                             getInkBounds(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].bounds,
                                          pageAnnotationObject.pageIndex));
                        const collectionData: any = processPathData(pageAnnotationObject.annotations[parseInt(z.toString(), 10)].data);
                        const csData: Object[] = splitArrayCollection(collectionData);
                        pageAnnotationObject.annotations[parseInt(z.toString(), 10)].data = JSON.stringify(csData);
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
            annotationCollection = null;
        }
        return JSON.stringify(annotations);
    }

    /**
     * @param {number} pageNumber - It describes about the page number value
     * @param {any} annotationBase - It describes about the annotation base
     * @private
     * @returns {void}
     */
    public addInCollection(pageNumber: number, annotationBase: any): void {
        if (annotationBase) {
            const pageAnnotations: any[] = this.getAnnotations(pageNumber, null);
            if (pageAnnotations) {
                pageAnnotations.push(annotationBase);
            }
            this.manageInkAnnotations(pageAnnotations, pageNumber);
        }
    }

    /**
     * @private
     * @param {string} data - data
     * @returns {any} - points
     */
    public calculateInkSize(data: string): any {
        let minimumX: number = -1;
        let minimumY: number = -1;
        let maximumX: number = -1;
        let maximumY: number = -1;
        const collectionData: Object[] = processPathData(data);
        const zoomvalue: number = this.pdfViewerBase.getZoomFactor();
        for (let k: number = 0; k < collectionData.length; k++) {
            const val: any = collectionData[parseInt(k.toString(), 10)];
            if (minimumX === -1) {
                minimumX = (val['x']);
                maximumX = (val['x']);
                minimumY = (val['y']);
                maximumY = (val['y']);
            } else {
                const point1: any = (val['x']);
                const point2: any = (val['y']);
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
        let newdifferenceX: number = maximumX - minimumX;
        let newdifferenceY: number = maximumY - minimumY;
        if (newdifferenceX === 0) {
            newdifferenceX = 1;
        } else if (newdifferenceY === 0) {
            newdifferenceY = 1;
        }
        return { x: (minimumX / zoomvalue), y: (minimumY / zoomvalue),
            width: (newdifferenceX / zoomvalue), height: (newdifferenceY / zoomvalue) };
    }

    /**
     * @param {any} annotationCollection - It describes about the annotation collection
     * @param {number} pageIndex - page index value
     * @param {boolean} isImport - It ensures whether the isImport is true or not
     * @param {boolean} isAnnotOrderAction - It ensures whether the isAnnotOrderAction is true or not
     * @param {boolean} isLastAnnot - It ensures whether the isLastAnnot is true or not
     * @private
     * @returns {void}
     */
    public renderExistingInkSignature(annotationCollection: any, pageIndex: number, isImport: boolean, isAnnotOrderAction?: boolean,
                                      isLastAnnot?: boolean): void {
        let annot: PdfAnnotationBaseModel;
        let isinkAnnotationAdded: boolean = false;
        if (!isImport) {
            for (let p: number = 0; p < this.inkAnnotationindex.length; p++) {
                if (this.inkAnnotationindex[parseInt(p.toString(), 10)] === pageIndex) {
                    isinkAnnotationAdded = true;
                    break;
                }
            }
        }
        if (annotationCollection && (!isinkAnnotationAdded || isAnnotOrderAction)) {
            if (annotationCollection.length > 0 && this.inkAnnotationindex.indexOf(pageIndex) === -1) {
                this.inkAnnotationindex.push(pageIndex);
            }
            for (let n: number = 0; n < annotationCollection.length; n++) {
                const currentAnnotation: any = annotationCollection[parseInt(n.toString(), 10)];
                if (currentAnnotation) {
                    let data: any = currentAnnotation.PathData;
                    if (isImport && data) {
                        if (typeof (data) === 'object' && data.length > 1) {
                            data = getPathString(data);
                        } else {
                            if (!(currentAnnotation.IsPathData || (data.split('command').length <= 1))) {
                                data = getPathString(JSON.parse(data));
                            }
                        }
                    }
                    this.outputString = data;
                    const calculateInkPosition: any = this.calculateInkSize(this.outputString);
                    this.outputString = '';
                    let rectDiff: number = 0;
                    let rectDifference: number = 1;
                    const bounds: any = currentAnnotation.Bounds;
                    if (calculateInkPosition) {
                        if (calculateInkPosition.height < 1) {
                            rectDiff = bounds.Height ? bounds.Height : bounds.height;
                            rectDifference = bounds.Height ? bounds.Height : bounds.height;
                        } else if (calculateInkPosition.width < 1) {
                            rectDiff = bounds.Width ? bounds.Width : bounds.width;
                            rectDifference = bounds.Width ? bounds.Width : bounds.width;
                        }
                    }
                    const currentLeft: number = !isNullOrUndefined(bounds.X) ? bounds.X + (rectDiff / 2) : bounds.x + (rectDiff / 2);
                    const currentTop: number = !isNullOrUndefined(bounds.Y) ? bounds.Y + (rectDiff / 2) : bounds.y + (rectDiff / 2);
                    const currentWidth: number = bounds.Width ? bounds.Width - (rectDifference - 1) : bounds.width - (rectDifference - 1);
                    const currentHeight: number = bounds.Height ? bounds.Height - (rectDifference - 1) :
                        bounds.height - (rectDifference - 1);
                    let isLock: boolean = currentAnnotation.AnnotationSettings ? currentAnnotation.AnnotationSettings.isLock : false;
                    const selectorSettings: any = currentAnnotation.AnnotationSelectorSettings ? typeof (currentAnnotation.AnnotationSelectorSettings) === 'string' ? JSON.parse(currentAnnotation.AnnotationSelectorSettings) : currentAnnotation.AnnotationSelectorSettings : this.getSelector(currentAnnotation, 'Ink');
                    const customData: object = this.pdfViewer.annotation.getCustomData(currentAnnotation);
                    let isPrint: boolean = true;
                    if (currentAnnotation.AnnotationSettings) {
                        isPrint = currentAnnotation.AnnotationSettings.isPrint;
                    } else {
                        isPrint = this.pdfViewer.inkAnnotationSettings.isPrint;
                    }
                    isPrint = !isNullOrUndefined(currentAnnotation.IsPrint) ? currentAnnotation.IsPrint : true;
                    if (currentAnnotation.IsLocked) {
                        isLock = currentAnnotation.IsLocked;
                    }
                    if (currentAnnotation.Subject === 'Highlight' && currentAnnotation.Opacity === 1) {
                        currentAnnotation.Opacity = currentAnnotation.Opacity / 2;
                    }
                    currentAnnotation.allowedInteractions = currentAnnotation.AllowedInteractions ?
                        currentAnnotation.AllowedInteractions : this.pdfViewer.annotationModule.
                            updateAnnotationAllowedInteractions(currentAnnotation);
                    currentAnnotation.AnnotationSettings = currentAnnotation.AnnotationSettings ?
                        currentAnnotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(currentAnnotation);
                    currentAnnotation.State = currentAnnotation.State ? currentAnnotation.State : '';
                    currentAnnotation.StateModel = currentAnnotation.StateModel ? currentAnnotation.StateModel : '';
                    let status: AnnotationStatus;
                    if (this.pdfViewerBase.isAnnotationImport) {
                        status = AnnotationStatus.NewlyAdded;
                    }
                    // R-18: Freehand Highlight in-memory marker. For newly committed
                    // annotations the flag is set by addInk; for imported annotations
                    // the detection helper (Phase 3) will set it on the in-memory
                    // object before renderExistingInkSignature is called.
                    const enableInkHighlight: boolean = !isNullOrUndefined(currentAnnotation.enableInkHighlight) ?
                        currentAnnotation.enableInkHighlight : false;
                    annot = {
                        id: 'ink' + this.pdfViewerBase.inkCount, annotationIndex: currentAnnotation.AnnotationIndex, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                        shapeAnnotationType: 'Ink', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, annotName: currentAnnotation.AnnotName,

                        comments: this.pdfViewer.annotationModule.
                            getAnnotationComments(currentAnnotation.Comments, currentAnnotation, currentAnnotation.Author),
                        author: currentAnnotation.Author, allowedInteractions: currentAnnotation.allowedInteractions,
                        subject: currentAnnotation.Subject, modifiedDate: currentAnnotation.ModifiedDate,

                        review: { state: currentAnnotation.State, stateModel: currentAnnotation.StateModel,
                            modifiedDate: currentAnnotation.ModifiedDate, author: currentAnnotation.Author }, notes:
                                currentAnnotation.Note, annotationSettings: currentAnnotation.AnnotationSettings,
                        annotationSelectorSettings: selectorSettings, customData: customData, isPrint: isPrint,
                        isCommentLock: currentAnnotation.IsCommentLock, status: !isNullOrUndefined(currentAnnotation.Status) ?
                            currentAnnotation.Status : status,
                        hasPdfAppearance: currentAnnotation.hasPdfAppearance,
                        templateAppearanceImage: currentAnnotation.templateAppearanceImage,
                        templateAppearanceId: currentAnnotation.templateAppearanceId,
                        isAppearanceStale: currentAnnotation.isAppearanceStale
                    };
                    const annotObject: IInkAnnotation = {
                        id: 'ink' + this.pdfViewerBase.inkCount, annotationIndex: currentAnnotation.AnnotationIndex, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                        shapeAnnotationType: 'Ink', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, annotName: currentAnnotation.AnnotName,

                        comments: this.pdfViewer.annotationModule.
                            getAnnotationComments(currentAnnotation.Comments, currentAnnotation, currentAnnotation.Author),
                        author: currentAnnotation.Author, allowedInteractions: currentAnnotation.allowedInteractions,
                        subject: currentAnnotation.Subject, modifiedDate: currentAnnotation.ModifiedDate,

                        review: { state: currentAnnotation.State, stateModel: currentAnnotation.StateModel,
                            modifiedDate: currentAnnotation.ModifiedDate, author: currentAnnotation.Author }, notes:
                                currentAnnotation.Note, annotationSettings: currentAnnotation.AnnotationSettings,
                        annotationSelectorSettings: selectorSettings, customData: customData, isPrint: isPrint,
                        isCommentLock: currentAnnotation.IsCommentLock,
                        originalName: currentAnnotation.OriginalName ? currentAnnotation.OriginalName : null,
                        status: !isNullOrUndefined(currentAnnotation.Status) ? currentAnnotation.Status : status,
                        hasPdfAppearance: currentAnnotation.hasPdfAppearance,
                        templateAppearanceImage: currentAnnotation.templateAppearanceImage,
                        templateAppearanceId: currentAnnotation.templateAppearanceId,
                        isAppearanceStale: currentAnnotation.isAppearanceStale,
                        enableInkHighlight: enableInkHighlight
                    };
                    const previousAnnot: any = (this.pdfViewer.nameTable as any)[annot.id];
                    const addedAnnot: PdfAnnotationBaseModel = this.pdfViewer.add(annot as PdfAnnotationBase);
                    if (isImport) {
                        this.pdfViewer.annotationModule.skipAppearanceForImport(annotObject.annotName);
                        addedAnnot.hasPdfAppearance = false;
                        addedAnnot.templateAppearanceImage = null;
                        addedAnnot.templateAppearanceId = null;
                        addedAnnot.isAppearanceStale = false;
                        annotObject.hasPdfAppearance = false;
                        annotObject.templateAppearanceImage = null;
                        annotObject.templateAppearanceId = null;
                        annotObject.isAppearanceStale = false;
                    }
                    else if (!addedAnnot.templateAppearanceImage) {
                        const resolvedImage: HTMLImageElement = resolveAppearanceImage(annotObject) ||
                            (previousAnnot ? previousAnnot.templateAppearanceImage : null);
                        if (resolvedImage) {
                            addedAnnot.templateAppearanceImage = resolvedImage;
                            addedAnnot.hasPdfAppearance = true;
                            annotObject.templateAppearanceImage = resolvedImage;
                            annotObject.hasPdfAppearance = true;
                        }
                    }
                    const canvasPageIndex: any = currentAnnotation.pageIndex ? currentAnnotation.pageIndex : currentAnnotation.PageNumber;
                    // R-18: Freehand Highlight render routing — mirror of the
                    // text-markup highlight canvas-routing ternary at
                    // annotation.ts:1220,1484. When enableInkHighlight is set, the
                    // stroke is drawn on the highlight blend canvas so the
                    // underlying page content remains visible. The blend canvas
                    // is created lazily by createBlendAnnotationsIntoCanvas() if
                    // it does not yet exist on this page (mirror of the
                    // getHighlightCanvasContext() pattern in text-markup-annotation.ts).
                    let canvass: any;
                    if (enableInkHighlight) {
                        const blendCanvasId: string = '_blendAnnotationsIntoCanvas_' + canvasPageIndex;
                        canvass = this.pdfViewerBase.getElement(blendCanvasId);
                        if (isNullOrUndefined(canvass)) {
                            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + canvasPageIndex);
                            const pageSize: ISize = this.pdfViewerBase.pageSize[parseInt(canvasPageIndex.toString(), 10)];
                            if (pageDiv && pageSize && pageSize.width && pageSize.height) {
                                canvass = this.pdfViewer.annotationModule.createBlendAnnotationsIntoCanvas(pageDiv,
                                                                                                           pageSize.width,
                                                                                                           pageSize.height,
                                                                                                           canvasPageIndex);
                            }
                        }
                    } else {
                        canvass = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', canvasPageIndex);
                    }
                    const isNeedToRender: boolean = ((isImport && isLastAnnot) || isNullOrUndefined(isImport) ||
                    !isImport) ? true : false;
                    if (isNeedToRender) {
                        this.pdfViewer.renderDrawing(canvass as any, annot.pageIndex);
                    }
                    this.pdfViewer.annotationModule.storeAnnotations(annot.pageIndex, annotObject, '_annotations_ink');
                    if (this.isAddAnnotationProgramatically) {
                        const settings: any = {
                            opacity: annot.opacity, strokeColor: annot.strokeColor, thickness: annot.thickness,
                            modifiedDate: annot.modifiedDate,
                            width: annot.bounds.width, height: annot.bounds.height, data: this.outputString
                        };
                        this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'Ink', bounds, settings);
                    }
                    this.pdfViewerBase.currentSignatureAnnot = null;
                    this.pdfViewerBase.signatureCount++;
                    this.pdfViewerBase.inkCount++;
                    if (this.pdfViewerBase.navigationPane && this.pdfViewerBase.navigationPane.annotationMenuObj &&
                         this.pdfViewer.isSignatureEditable) {

                        this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], true);

                        this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export XFDF')], true);
                    }
                }
            }
        }
    }

    // To save the imported annotations while downloading or exporting for the page above 10 without a scroll (EJ2-63924)
    /**
     * @param {any} annotation - This is annotation
     * @param {number} pageNumber - This is page number
     * @private
     * @returns {void}
     */
    public saveImportedInkAnnotation(annotation: any, pageNumber: number): void {
        let annotationObject: any = null;
        const currentBounds: any = annotation.Bounds;
        const bounds: any = { x: currentBounds.X, y: currentBounds.Y, width: currentBounds.Width, height: currentBounds.Height };
        const allowedInteractions: any = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        const customData: object = this.pdfViewer.annotation.getCustomData(annotation);
        const comments: any = this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author);
        const review: any = { state: annotation.State, stateModel: annotation.StateModel,
            modifiedDate: annotation.ModifiedDate, author: annotation.Author };
        const annotationSettings: any = annotation.AnnotationSettings ? annotation.AnnotationSettings :
            this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
        const annotationSelectorSettings: AnnotationSelectorSettingsModel = this.getSettings(annotation);
        let data: any = annotation.PathData;
        if (typeof (data) === 'object' && data.length > 1) {
            data = getPathString(data);
        }
        else {
            if (!annotation.IsPathData && data.split('command').length > 1) {
                data = getPathString(JSON.parse(data));
            }
        }
        annotationObject = {
            allowedInteractions: allowedInteractions, annotName: annotation.AnnotName,
            annotationSelectorSettings: annotationSelectorSettings,
            annotationSettings: annotationSettings, author: annotation.Author, bounds: bounds,
            customData: customData, comments: comments, data: data,
            id: 'Ink', isCommentLock: annotation.IsCommentLock, isLocked: annotation.IsLocked, isPrint: annotation.IsPrint, modifiedDate: annotation.ModifiedDate,
            note: annotation.Note, opacity: annotation.Opacity, pageIndex: pageNumber, review: review,
            shapeAnnotationType: annotation.AnnotationType,
            strokeColor: annotation.StrokeColor, subject: annotation.Subject, thickness: annotation.Thickness, status: annotation.status
        };
        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_ink', true);
    }

    // To get the annotation selector settings
    private getSettings(annotation: any): AnnotationSelectorSettingsModel {
        let selector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
        if (annotation.AnnotationSelectorSettings) {
            selector = annotation.AnnotationSelectorSettings;
        }
        else {
            selector = this.getSelector(annotation.ShapeAnnotationType, annotation.Subject);
        }
        return selector;
    }

    /**
     * @param {number} pageNumber - It describes about the page number value
     * @param {any} annotations - It describes about the annotations
     * @private
     * @returns {void}
     */
    public storeInkSignatureData(pageNumber: number, annotations: any): void {
        this.pdfViewer.annotation.addAction(annotations.pageIndex, null, annotations as PdfAnnotationBase, 'Addition', '', annotations as PdfAnnotationBase, annotations);
        let annotation: any = null;
        let left: number = annotations.bounds.left ? annotations.bounds.left : annotations.bounds.x;
        let top: number = annotations.bounds.top ? annotations.bounds.top : annotations.bounds.y;
        if (annotations.wrapper && annotations.wrapper.bounds) {
            left = annotations.wrapper.bounds.left;
            top = annotations.wrapper.bounds.top;
        }
        annotation = {
            id: annotations.id, bounds: { x: left, y: top, width: annotations.bounds.width, height: annotations.bounds.height },
            shapeAnnotationType: 'Ink', opacity: annotations.opacity, thickness: annotations.thickness, strokeColor: annotations.strokeColor, pageIndex: annotations.pageIndex, data: annotations.data,
            annotName: annotations.annotName,
            comments: annotations.comments, author: annotations.author, subject: annotations.subject,
            modifiedDate: annotations.modifiedDate,
            review: { state: '', stateModel: '', modifiedDate: annotations.modifiedDate, author: annotations.author }, notes: annotations.notes,
            annotationSelectorSettings: this.getSelector(annotations, 'Ink'), isCommentLock: annotations.isCommentLock
        };
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_ink');
        let index: number = 0;
        if (!storeObject) {
            const shapeAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
            shapeAnnotation.annotations.push(annotation);
            index = shapeAnnotation.annotations.indexOf(annotation);
            const annotationCollection: IPageAnnotations[] = [];
            annotationCollection.push(shapeAnnotation);
            this.pdfViewer.annotationsCollection.set(this.pdfViewerBase.documentId + '_annotations_ink', annotationCollection);
        } else {
            this.pdfViewer.annotationsCollection.delete(this.pdfViewerBase.documentId + '_annotations_ink');
            const pageIndex: number = this.pdfViewer.annotationModule.getPageCollection(storeObject, pageNumber);
            if (pageIndex != null && storeObject[parseInt(pageIndex.toString(), 10)]) {
                (storeObject[parseInt(pageIndex.toString(), 10)] as IPageAnnotations).annotations.push(annotation);
                index = (storeObject[parseInt(pageIndex.toString(), 10)] as IPageAnnotations).annotations.indexOf(annotation);
            } else {
                const markupAnnotation: IPageAnnotations = { pageIndex: pageNumber, annotations: [] };
                markupAnnotation.annotations.push(annotation);
                index = markupAnnotation.annotations.indexOf(annotation);
                storeObject.push(markupAnnotation);
            }
            this.pdfViewer.annotationsCollection.set(this.pdfViewerBase.documentId + '_annotations_ink', storeObject);
        }
    }

    public getSelector(type: string, subject: string): AnnotationSelectorSettingsModel {
        let selector: AnnotationSelectorSettingsModel = this.pdfViewer.annotationSelectorSettings;
        if ((type === 'Ink' || subject === 'Ink' ) && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
            selector = cloneObject(this.pdfViewer.annotationSelectorSettings);
            this.pdfViewerBase.updateSelector(selector, type);
        }
        return selector;
    }

    private getAnnotations(pageIndex: number, shapeAnnotations: any[]): any[] {
        let annotationCollection: any[];
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_ink');
        if (storeObject) {
            const index: number = this.pdfViewer.annotationModule.getPageCollection(storeObject, pageIndex);
            if (index != null && storeObject[parseInt(index.toString(), 10)]) {
                annotationCollection = storeObject[parseInt(index.toString(), 10)].annotations;
            } else {
                annotationCollection = shapeAnnotations;
            }
        } else {
            annotationCollection = shapeAnnotations;
        }
        return annotationCollection;
    }

    /**
     * @param {string} property - It describes about the property
     * @param {number} pageNumber - It describes about the page number
     * @param {any} annotationBase - It is about the annotation base
     * @private
     * @returns {any} - any
     */
    public modifySignatureInkCollection(property: string, pageNumber: number, annotationBase: any): any {
        if (!isNullOrUndefined(annotationBase.formFieldAnnotationType) && annotationBase.formFieldAnnotationType !== '') {
            this.pdfViewer.annotationModule.isFormFieldShape = true;
        }
        else {
            this.pdfViewer.annotationModule.isFormFieldShape = false;
        }
        this.pdfViewerBase.updateDocumentEditedProperty(true);
        let currentAnnotObject: any = null;
        const pageAnnotations: any[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[parseInt(i.toString(), 10)].id) {
                    if (property === 'bounds') {
                        this.pdfViewerBase.isBounds =
                        this.pdfViewerBase.boundsCalculation(pageAnnotations[parseInt(i.toString(), 10)].bounds,
                                                             annotationBase.wrapper.bounds);
                        if (this.pdfViewerBase.isBounds) {
                            pageAnnotations[parseInt(i.toString(), 10)].bounds = {
                                x: annotationBase.wrapper.bounds.left,
                                y: annotationBase.wrapper.bounds.top, width: annotationBase.bounds.width,
                                height: annotationBase.bounds.height
                            };
                        }
                        if (annotationBase.hasPdfAppearance) {
                            pageAnnotations[parseInt(i.toString(), 10)].hasPdfAppearance = annotationBase.hasPdfAppearance;
                            pageAnnotations[parseInt(i.toString(), 10)].isAppearanceStale = annotationBase.isAppearanceStale;
                            pageAnnotations[parseInt(i.toString(), 10)].templateAppearanceImage = annotationBase.templateAppearanceImage;
                            pageAnnotations[parseInt(i.toString(), 10)].templateAppearanceId = annotationBase.templateAppearanceId;
                        }
                    } else if (property === 'stroke') {
                        pageAnnotations[parseInt(i.toString(), 10)].strokeColor = annotationBase.wrapper.children[0].style.strokeColor;
                    } else if (property === 'opacity') {
                        pageAnnotations[parseInt(i.toString(), 10)].opacity = annotationBase.wrapper.children[0].style.opacity;
                    } else if (property === 'thickness') {
                        pageAnnotations[parseInt(i.toString(), 10)].thickness = annotationBase.wrapper.children[0].style.strokeWidth;
                    } else if (property === 'notes') {
                        pageAnnotations[parseInt(i.toString(), 10)].notes = annotationBase.notes;
                    }
                    if (property === 'stroke' || property === 'opacity' || property === 'thickness') {
                        this.pdfViewer.annotationModule.invalidateAppearanceImage(annotationBase);
                        this.pdfViewer.annotationModule.invalidateAppearanceImage(pageAnnotations[parseInt(i.toString(), 10)]);
                    }
                    else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        // Preserve the position in annotation module map for re-insertion during collaborative modify
                        if (currentAnnotObject && currentAnnotObject.annotName && this.pdfViewer.annotation.isModifyAction) {
                            this.pdfViewer.annotation.storedAnnotationIndexes.set(currentAnnotObject.annotName, i);
                        }
                        break;
                    }
                    if (this.pdfViewerBase.isBounds) {
                        pageAnnotations[parseInt(i.toString(), 10)].modifiedDate =
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                    }
                    if (annotationBase.hasPdfAppearance || annotationBase.templateAppearanceId || annotationBase.templateAppearanceImage) {
                        pageAnnotations[(i as number)].hasPdfAppearance = annotationBase.hasPdfAppearance;
                        pageAnnotations[(i as number)].isAppearanceStale = annotationBase.isAppearanceStale;
                        pageAnnotations[(i as number)].templateAppearanceImage = annotationBase.templateAppearanceImage;
                        pageAnnotations[(i as number)].templateAppearanceId = annotationBase.templateAppearanceId;
                    }
                    if (pageAnnotations[parseInt(i.toString(), 10)].status !== 'NewlyAdded') {
                        pageAnnotations[parseInt(i.toString(), 10)].status = AnnotationStatus.ExistingModified;
                    }
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[parseInt(i.toString(), 10)], pageNumber);
                }
            }
            this.manageInkAnnotations(pageAnnotations, pageNumber);
        }
        return currentAnnotObject;
    }

    private manageInkAnnotations(pageAnnotations: any[], pageNumber: number): void {
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_ink');
        if (storeObject) {
            this.pdfViewer.annotationsCollection.delete(this.pdfViewerBase.documentId + '_annotations_ink');
            const index: number = this.pdfViewer.annotationModule.getPageCollection(storeObject, pageNumber);
            if (index != null && storeObject[parseInt(index.toString(), 10)]) {
                storeObject[parseInt(index.toString(), 10)].annotations = pageAnnotations;
            }
            this.pdfViewer.annotationsCollection.set(this.pdfViewerBase.documentId + '_annotations_ink', storeObject);
        }
    }

    /**
     * Processes ink erasing using geometry-based midpoint detection (reference sample logic).
     * Converts SVG path to point arrays, fragments based on eraser geometry, converts back to SVG.
     * @param {any} inkAnnotation - The ink annotation to erase from
     * @param {PointModel[]} eraserPath - Array of eraser positions during drag
     * @param {number} eraserSize - Diameter of eraser
     * @returns {string} - Fragmented path data string with M commands separating fragments
     * @private
     */
    public processInkErase(inkAnnotation: any, eraserPath: PointModel[], eraserSize: number): string {
        if (!eraserPath || eraserPath.length < 1) {
            return inkAnnotation.data;
        }
        const pathData: string = inkAnnotation.data;
        const collectionData: Object[] = processPathData(pathData);
        if (!collectionData || collectionData.length < 1) {
            return inkAnnotation.data;
        }
        const zoom: number = this.pdfViewerBase.getZoomFactor();
        const rawThickness: number = inkAnnotation.thickness || this.pdfViewer.inkAnnotationSettings.thickness || 1;
        const strokeThickness: number = rawThickness * zoom > 1 ? rawThickness * zoom : rawThickness;
        const hitRadius: number = eraserSize / 2 + strokeThickness / 2;
        const distToSeg: any = (p: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }): number => {
            const dx: number = b.x - a.x;
            const dy: number = b.y - a.y;
            const lenSq: number = dx * dx + dy * dy;
            const t: number = lenSq
                ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq))
                : 0;
            return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
        };
        const isErased: any = (p: { x: number; y: number }): boolean => {
            if ((eraserPath as any).length === 1) {
                return Math.hypot(p.x - (eraserPath as any)[0].x, p.y - (eraserPath as any)[0].y) <= hitRadius;
            }
            for (let i: number = 0; i < (eraserPath as any).length - 1; i++) {
                if (distToSeg(p, (eraserPath as any)[(i as any)], (eraserPath as any)[i + 1]) <= hitRadius) {
                    return true;
                }
            }
            return false;
        };
        const paths: Array<Array<{ x: number; y: number }>> = [];
        let current: Array<{ x: number; y: number }> = [];
        for (let k: number = 0; k < collectionData.length; k++) {
            const pt: any = collectionData[(k as any)];
            if (pt.command === 'M') {
                if (current.length > 1) {
                    paths.push(current);
                }
                current = [{ x: pt.x, y: pt.y }];
            } else if (pt.command === 'L') {
                current.push({ x: pt.x, y: pt.y });
            }
        }
        if (current.length > 1) {
            paths.push(current);
        }
        // Subdivide each ink segment into ~2 px steps for pixel-level erase accuracy
        const STEP: number = 2;
        const segmentedPathData: Array<Array<{ x: number; y: number }>> = [];
        for (let pi: number = 0; pi < paths.length; pi++) {
            const path: Array<{ x: number; y: number }> = paths[(pi as any)];
            let fragment: Array<{ x: number; y: number }> = [];
            for (let i: number = 0; i < path.length - 1; i++) {
                const a: { x: number; y: number } = path[(i as any)];
                const b: { x: number; y: number } = path[i + 1];
                const dx: number = b.x - a.x;
                const dy: number = b.y - a.y;
                const steps: number = Math.max(1, Math.ceil(Math.hypot(dx, dy) / STEP));
                for (let s: number = 0; s < steps; s++) {
                    const p0: { x: number; y: number } = {
                        x: a.x + dx * (s / steps),
                        y: a.y + dy * (s / steps)
                    };
                    const p1: { x: number; y: number } = {
                        x: a.x + dx * ((s + 1) / steps),
                        y: a.y + dy * ((s + 1) / steps)
                    };
                    if (!isErased(p0) && !isErased(p1)) {
                        if (fragment.length === 0) {
                            fragment.push(p0);
                        }
                        fragment.push(p1);
                    } else {
                        if (fragment.length > 1) {
                            segmentedPathData.push(fragment);
                        }
                        fragment = [];
                    }
                }
            }
            if (fragment.length > 1) {
                segmentedPathData.push(fragment);
            }
        }
        if (segmentedPathData.length === 0) {
            return '';
        }
        const uniquePath: Set<string> = new Set<string>();
        for (let fi: number = 0; fi < segmentedPathData.length; fi++) {
            const frag: Array<{ x: number; y: number }> = segmentedPathData[(fi as any)];
            if (frag.length > 1) {
                let str: string = `M${Math.round(frag[0].x)},${Math.round(frag[0].y)}`;
                for (let i: number = 1; i < frag.length; i++) {
                    str += ` L${Math.round(frag[(i as any)].x)},${Math.round(frag[(i as any)].y)}`;
                }
                if (!uniquePath.has(str)) {
                    uniquePath.add(str);
                }
            }
        }
        return uniquePath.size > 0 ? Array.from(uniquePath).join(' ') : '';
    }

    /**
     * Restores ink annotation pathData from a snapshot (for undo/redo).
     * Updates both the annotation collection and the SVG wrapper element.
     * @param {any} annotationSnapshot - Snapshot with id, data, bounds
     * @param {number} pageIndex - Page containing the annotation
     * @private
     * @returns {void}
     */
    public restoreInkPathData(annotationSnapshot: any, pageIndex: number): void {
        const pageAnnotations: any[] = this.getAnnotations(pageIndex, null);
        if (pageAnnotations) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (pageAnnotations[(i as number)].id === annotationSnapshot.id) {
                    pageAnnotations[(i as number)].data = annotationSnapshot.data;
                    pageAnnotations[(i as number)].bounds = annotationSnapshot.bounds;
                    this.pdfViewer.add(pageAnnotations[(i as number)]);
                    break;
                }
            }
            annotationSnapshot.modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        }
        this.manageInkAnnotations(pageAnnotations, pageIndex);
        this.pdfViewer.renderDrawing(undefined, pageIndex);
        this.pdfViewer.clearSelection(pageIndex);
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.newObject = null;
        this.outputString = null;
        this.mouseX = null;
        this.mouseY = null;
        this.inkAnnotationindex = null;
        this.isAddAnnotationProgramatically = null;
        this.currentPageNumber = null;
        this.inkAnnotationInitialZoom = null;
        this.inkPathDataCollection = null;
    }

    /**
     * @param {any} currentAnnotation - It describes about the current annotation
     * @param {number} pageIndex - It describes about the page index value
     * @param {boolean} isImport - It ensures whether the isImport is true or not
     * @private
     * @returns {any} - any
     */
    public updateInkCollections(currentAnnotation: any, pageIndex: number, isImport?: boolean): any {
        let annot: any;
        if (currentAnnotation) {
            const bounds: any = currentAnnotation.Bounds;
            const currentLeft: number = (bounds.X);
            const currentTop: number = (bounds.Y);
            const currentWidth: number = (bounds.Width);
            const currentHeight: number = (bounds.Height);
            const customData: object = currentAnnotation.customData;
            const isPrint: boolean = currentAnnotation.isPrint;
            currentAnnotation.AllowedInteractions = currentAnnotation.AllowedInteractions ?
                currentAnnotation.AllowedInteractions : this.pdfViewer.annotationModule.
                    updateAnnotationAllowedInteractions(currentAnnotation);
            currentAnnotation.AnnotationSettings = currentAnnotation.AnnotationSettings ?
                currentAnnotation.AnnotationSettings : this.pdfViewer.inkAnnotationSettings ?
                    this.pdfViewer.inkAnnotationSettings : this.pdfViewer.annotationSettings;
            if (currentAnnotation.IsLocked) {
                currentAnnotation.AnnotationSettings.isLock = currentAnnotation.IsLocked;
            }
            let data: any = currentAnnotation.PathData;
            if (isImport) {
                data = getPathString(JSON.parse(currentAnnotation.PathData));
            }
            annot = {
                id: 'ink' + this.pdfViewerBase.signatureCount, annotationIndex: currentAnnotation.AnnotationIndex,
                bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                shapeAnnotationType: 'Ink', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, annotationId: currentAnnotation.AnnotName,
                customData: customData, comments: this.pdfViewer.annotationModule.
                    getAnnotationComments(currentAnnotation.Comments, currentAnnotation, currentAnnotation.Author),
                author: currentAnnotation.Author, allowedInteractions: currentAnnotation.AllowedInteractions,
                subject: currentAnnotation.Subject, modifiedDate: currentAnnotation.ModifiedDate,
                review: { state: '', stateModel: '', modifiedDate: currentAnnotation.ModifiedDate, author: currentAnnotation.Author }, notes: currentAnnotation.Note, isPrint: isPrint, isCommentLock: currentAnnotation.IsCommentLock, annotationSettings: currentAnnotation.AnnotationSettings, isLocked: currentAnnotation.AnnotationSettings.isLock

            };
            return annot;
        }
    }

    /**
     * This method used to add annotations with using program.
     *
     * @param {InkAnnotationSettings} annotationObject - It describes type of annotation object
     * @param {IPoint} offset - It describes about the annotation bounds or location
     * @param {number} pageNumber - It describes about the annotation page number
     * @returns {object} - onject
     * @private
     */
    public updateAddAnnotationDetails(annotationObject: InkAnnotationSettings, offset: IPoint, pageNumber: number): Object {
        //Creating new object if annotationObject is null
        if (!annotationObject) {
            annotationObject = { offset: { x: 10, y: 10 }, pageNumber: 0, width: undefined, height: undefined } as InkAnnotationSettings;
            offset = annotationObject.offset;
        }
        else if (!annotationObject.offset)
        {offset = { x: 10, y: 10 }; }
        else
        {offset = annotationObject.offset; }
        //Creating the CurrentDate and Annotation name
        const currentDateString: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        //Creating annotation settings
        const annotationSelectorSettings: any = this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings;
        this.pdfViewerBase.updateSelectorSettings(annotationSelectorSettings);
        const annotationSettings: any = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.inkAnnotationSettings);
        annotationObject.author = annotationObject.author ? annotationObject.author : this.pdfViewer.annotationModule.updateAnnotationAuthor('ink', annotationSettings.AnnotationType);
        const allowedInteractions: any = this.pdfViewer.inkAnnotationSettings.allowedInteractions ?
            this.pdfViewer.inkAnnotationSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
        annotationSettings.isLock = annotationObject.isLock ? annotationObject.isLock : annotationSettings.isLock;
        annotationObject.width = annotationObject.width ? annotationObject.width : 150;
        annotationObject.height = annotationObject.height ? annotationObject.height : 60;
        let pathData: string = annotationObject.path ? annotationObject.path : '';
        if (!isNullOrUndefined(pathData)) {
            // Check whether the given path of the ink annotation is starts with Move path or Line path.
            if (pathData[0] === 'M' || pathData[0] === 'L') {
                const collectionData: Object[] = processPathData(pathData);
                const csData: Object[] = splitArrayCollection(collectionData);
                pathData = JSON.stringify(csData);
            }
            else {
                pathData = getPathString(JSON.parse(pathData));
            }
        }
        annotationObject.path = pathData;
        // R-17: Programmatic add path — mirror of the addInk branch. When
        // enableInkHighlight is passed in, apply the same Freehand Highlight defaults
        // (subject 'Freehand Highlight', opacity 0.33, thickness 12) so that
        // toolbar-created and programmatically-created highlights are
        // indistinguishable.
        const enableInkHighlight: boolean = !isNullOrUndefined(annotationObject.enableInkHighlight) ?
            annotationObject.enableInkHighlight : false;
        //Creating Annotation objects with it's proper properties
        const signatureInkAnnotation: any = [];
        const ink: any =
        {
            AllowedInteractions: annotationObject.allowedInteractions ? annotationObject.allowedInteractions : allowedInteractions,
            AnnotName: annotationName,
            AnnotType: 'ink',
            AnnotationFlags: null,
            AnnotationSelectorSettings: annotationObject.annotationSelectorSettings ?
                annotationObject.annotationSelectorSettings : annotationSelectorSettings,
            AnnotationSettings: annotationSettings,
            AnnotationType: 'Ink',
            Author: annotationObject.author ? annotationObject.author : 'Guest',
            Bounds: { X: offset.x, Y: offset.y, Width: annotationObject.width, Height: annotationObject.height,
                Left: offset.x, Top: offset.y, Location: { X: offset.x, Y: offset.y },
                Size: { Height: annotationObject.height, IsEmpty: false, Width: annotationObject.width } },
            Comments: null,
            CreatedDate: currentDateString,
            CustomData: annotationObject.customData ? annotationObject.customData : null,
            ExistingCustomData: null,
            IsCommentLock: false,
            IsLock: annotationObject.isLock ? annotationObject.isLock : false,
            IsPrint: !isNullOrUndefined(annotationObject.isPrint) ? annotationObject.isPrint : true,
            ModifiedDate: '',
            Note: '',
            Opacity: enableInkHighlight ? 1 : (!isNullOrUndefined(annotationObject.opacity) ? annotationObject.opacity : 1),
            PathData: annotationObject.path,
            PageNumber: pageNumber,
            State: '',
            StateModel: '',
            Status: AnnotationStatus.NewlyAdded,
            StrokeColor: annotationObject.strokeColor ? annotationObject.strokeColor : 'rgba(255,0,0,1)',
            SubType: null,
            Subject: enableInkHighlight ? 'Freehand Highlight' : (annotationObject.subject ? annotationObject.subject : 'Ink'),
            Type: null,
            Thickness: enableInkHighlight ? 12 : (annotationObject.thickness ? annotationObject.thickness : 1),
            enableInkHighlight: enableInkHighlight
        };
        //Adding the annotation object to an array and return it
        signatureInkAnnotation[0] = ink;
        return { signatureInkAnnotation };
    }
    /**
     * Prepare ink annotation for XFDF export by applying save transformations
     * @param {any} annotation - annotation object
     * @private
     * @returns {void}
     */
    public stringifyInkAnnotation(annotation: any): void {
        const strokeColorString: string = annotation.strokeColor;
        annotation.strokeColor = JSON.stringify(this.pdfViewerBase.signatureModule.getRgbCode(strokeColorString));
        annotation.bounds = JSON.stringify(this.pdfViewer.annotation.getInkBounds(annotation.bounds, annotation.pageIndex));
        const collectionData: any = processPathData(annotation.data);
        const csData: Object[] = splitArrayCollection(collectionData);
        annotation.data = JSON.stringify(csData);
    }
}

/**
 * Defines the FormFields Bound properties
 *
 * @hidden
 */
export interface IInkPathDataCollection {
    pathData: any;
    zoomFactor: number;
}
