import { L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { DocumentEditor } from '../../document-editor';
//import { DocumentEditorRulerModel } from '../ruler-settings-model';
import { Ruler } from '../ruler/index';
import { HelperMethods, Point } from '../editor/editor-helper';
import { ParagraphWidget } from '../viewer';
import { WTabStop } from '../format/paragraph-format';
import { TabJustification } from '../../base/types';
import { TableWidget, TableRowWidget, TableCellWidget, IWidget } from '../viewer/page';
import { TextPosition } from '../selection';
import { WColumnFormat, WSectionFormat } from '../format';
import { Size } from './size';
/* eslint-disable */
/**
 * defines the helper methods for the ruler
 * @private
 */
export class RulerHelper {
    private tabStopStwitch: HTMLElement;

    private currentTabStopElement: HTMLElement;

    private position: TextPosition;

    private hRulerBottom: HTMLElement;
    /**
     * @private
     */
    public vRulerBottom: HTMLElement;

    private locale: L10n;

    private documentEditor: DocumentEditor;
    private resizerEnabled: boolean = false;
    private isDraggingRender: boolean = false;
    private isDraggingIndents1: boolean = false;
    private isDraggingIndents2: boolean = false;
    private isDraggingIndents3: boolean = false;
    private isDraggingIndents4: boolean = false;
    private isDraggingForTab: boolean = false;
    private isDraggingVertical: boolean = false;
    private isHorizontalScroll: boolean = false;
    private currentTabStop: WTabStop = undefined;
    private currrentParagraph: ParagraphWidget;
    private tabIndex: number = 0;
    private tabStopOffset: number;
    private rightLineOffset: number;
    private leftLineOffset: number;
    private firstIndentInitialValue: number;

    private diff: number;
    private minLimit2: number;
    private maxLimit2: number;
    private isHangingIndent: boolean;
    private hangingLineOffset: number;
    private hangingIndentInitialValue: number;
    private minLimit1: number;
    private maxLimit1: number;
    private leftIndent1: HTMLElement;
    private tabStopElement: HTMLElement;
    private justification: string

    private isLeftRulerMargin: boolean = undefined;
    private isLeftMultiColumn: boolean = false;
    private isRightMultiColumn: boolean = false;
    private multiColumnElement: HTMLElement;
    private hRuler: HTMLElement;
    private vRuler: HTMLElement;
    private columnInitialValue: number;
    private initialValue: number;
    private indentInitialValue: number;
    private tabInitialValue: number;
    private renderInitialValue: number;
    private currentScrollLeft: number;
    private initialRightMargin: number;
    private finalmouseXRelativeToDiv: number;
    private mouseDownTabValue: number;
    private mouseUpTabValue: number;

    //HTML elements
    private overlap: HTMLElement;
    private markIndicator: HTMLElement;
    private hangingIndentRuler: HTMLElement;
    private firstLineIndentRuler: HTMLElement;
    private rulerDiv: HTMLElement;
    private rulerOverlap: HTMLElement;
    private rulerMarginDiv: HTMLElement;
    private verticalRulerMarginDiv: HTMLElement;
    private firstLineIndent: HTMLElement;
    private hangingIndent: HTMLElement;
    private leftIndent: HTMLElement;
    private rightIndent: HTMLElement;
    private leftTab: HTMLElement;
    private centerTab: HTMLElement;
    private rightTab: HTMLElement;
    private decimalTab: HTMLElement;
    private barTab: HTMLElement;
    private rulerSpaceDiv: HTMLElement
    private parentRulerDiv: HTMLElement;

    //SVG Elements
    private hSvg: SVGElement;
    private vLine: SVGElement;
    private vSvg: SVGElement;
    private hLine: SVGElement;
    private firstLineIndentSvg: SVGElement;
    private firstLineIndentPath: SVGElement;
    private hangingIndentSvg: SVGElement;
    private hangingIndentPath: SVGElement;
    private rightIndentSvg: SVGElement;
    private rightIndentPath: SVGElement;
    private leftIndentSvg: SVGElement;
    private leftIndentPath: SVGElement;

    //Event handler
    private onmarkIndicatorClickHandler = this.onMarkIndicatorClick.bind(this);

    private onHorizontalRulerMouseMoveHandler = this.onHorizontalRulerMouseMoved.bind(this);

    private onHRulerMouseEnterHandler = this.onHRulerMouseEnter.bind(this);

    private onHRulerMouseLeaveHandler = this.onHRulerMouseLeave.bind(this);

    private onHRulerMouseDownHandler = this.onHRulerMouseDown.bind(this);

    private onHRulerMouseUpHandler = this.onHRulerMouseUp.bind(this);

    private onRulerDblClickHandler = this.onRulerDblClick.bind(this);

    private onDoubleClickHandler = this.onDoubleClick.bind(this);

    private onRulerMouseUpHandler = this.onRularMouseUp.bind(this);

    private onVMouseMoveHandler = this.onVMouseMove.bind(this);

    private onVMouseDownHandler = this.onVMouseDown.bind(this);

    private onVMouseUpHandler = this.onVMouseUp.bind(this);

    private onDocumentIntentTrueChangeHandler = this.onDocumentIntentTrue.bind(this);

    private onDocumentIntentFalseChangeHandler = this.onDocumentIntentFalse.bind(this);

    private onFirstLineIndentMouseDownHandler = this.onFirstLineIndentMouseDown.bind(this);

    private onIndentMouseMoveHandler = this.onIndentMouseMove.bind(this);

    private onIndentMouseUpHandler = this.onIndentMouseUp.bind(this);

    private onHangIndentMouseDownHandler = this.onHangIndentMouseDown.bind(this);

    private onHangIndentMouseMoveHandler = this.onHangIndentMouseMove.bind(this);

    private onHangIndentMouseUpHandler = this.onHangIndentMouseUp.bind(this);

    private onLeftIndentMouseDownHandler = this.onLeftIndentMouseDown.bind(this);

    private onLeftIndentMouseMoveHandler = this.onLeftIndentMouseMove.bind(this);

    private onLeftIndentMouseUpHandler = this.onLeftIndentMouseUp.bind(this);

    private onRightIndentMouseDownHandler = this.onRightIndentMouseDown.bind(this);

    private onRightIndentMouseMoveHandler = this.onRightIndentMouseMove.bind(this);

    private onRightIndentMouseUpHandler = this.onRightIndentMouseUp.bind(this);

    private onTabStopMouseDownHandler = this.onTabStopMouseDown.bind(this);

    private onTabStopMouseUpHandler = this.onTabStopMouseUp.bind(this);

    private onTabStopMouseMoveHandler = this.onTabStopMouseMove.bind(this);

    private onRenderTabStopMouseUpHandler = this.onRenderTabStopMouseUp.bind(this);

    private onTabStopDblClickHandler = this.onTabStopDblClick.bind(this);

    //Event handler methods
    private onMarkIndicatorClick() {
        const divElements: HTMLElement = document.querySelector('.e-de-ruler-markIndicator') as HTMLElement;
        for (let i: number = 0; i < divElements.childNodes.length; i++) {
            const currentDiv: HTMLElement = divElements.childNodes[parseInt(i.toString(), 10)] as HTMLElement;
            if (currentDiv.style.display === 'block') {
                currentDiv.style.display = 'none';
                const nextIndex: number = (i + 1) % divElements.childNodes.length;
                (divElements.childNodes[parseInt(nextIndex.toString(), 10)] as HTMLElement).style.display = 'block';
                break;
            }
        }
    }

    // private onHorizontalRulerMouseMove(e: MouseEvent): void {
    //     if (this.documentEditor.isDestroyed || !this.documentEditor.documentEditorSettings.showRuler) {
    //         return;
    //     }
    //     const divRect: DOMRect = this.hRuler.getBoundingClientRect() as DOMRect;
    //     const leftMargin: number = this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin
    //         * this.documentEditor.zoomFactor;
    //     const rightMargin: number = (HelperMethods.convertPixelToPoint(divRect.width) -
    //         this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin * this.documentEditor.zoomFactor);
    //     let pixelValue: number = Math.round(e.clientX - divRect.left);
    //     let mouseXRelativeToDiv: number = HelperMethods.convertPixelToPoint(pixelValue);
    //     if (!this.isDragging) {
    //         if (this.documentEditor.isOnIndent) {
    //             this.hRuler.style.cursor = 'default';
    //             if (this.hRuler.hasAttribute('title')) {
    //                 this.hRuler.removeAttribute('title');
    //             }
    //             this.resizerEnabled = false;
    //         } else if (((leftMargin - 3) <= mouseXRelativeToDiv) && ((leftMargin + 3) >= mouseXRelativeToDiv)) {
    //             if (this.documentEditor.layoutType === 'Pages') {
    //                 this.hRuler.style.cursor = 'e-resize';
    //                 this.hRuler.setAttribute('title', this.locale.getConstant('Left Margin'));
    //                 this.resizerEnabled = true;
    //                 this.isLeftRulerMargin = true;
    //             }
    //         } else if ((((rightMargin - 3) <= mouseXRelativeToDiv) && ((rightMargin + 3) >= mouseXRelativeToDiv))) {
    //             if (this.documentEditor.layoutType === 'Pages') {
    //                 this.hRuler.style.cursor = 'e-resize';
    //                 this.hRuler.setAttribute('title', this.locale.getConstant('Right Margin'));
    //                 this.resizerEnabled = true;
    //                 this.isLeftRulerMargin = false;
    //             }
    //         } else if (this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.columns.length > 0) {
    //             const columns: WColumnFormat[] = this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.columns;
    //             if (this.documentEditor.layoutType === 'Pages') {
    //                 for (let i: number = 1; i <= columns.length; i++) {
    //                     const rulerMarginDiv: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_Margin' + i);
    //                     const maginLeft: number = rulerMarginDiv.getBoundingClientRect().left;
    //                     const width: number = rulerMarginDiv.getBoundingClientRect().width;
    //                     if (((maginLeft - 3) <= e.clientX) && ((maginLeft + 3) >= e.clientX)) {
    //                         this.hRuler.style.cursor = 'e-resize';
    //                         this.multiColumnElement = rulerMarginDiv;
    //                         this.hRuler.setAttribute('title', this.locale.getConstant('Left Margin'));
    //                         this.isLeftMultiColumn = true;
    //                         this.resizerEnabled = true;
    //                         break;
    //                     } else if (((maginLeft + width - 3) <= e.clientX) && ((maginLeft + width + 3) >= e.clientX)) {
    //                         this.hRuler.style.cursor = 'e-resize';
    //                         this.multiColumnElement = rulerMarginDiv;
    //                         this.hRuler.setAttribute('title', this.locale.getConstant('Right Margin'));
    //                         this.isRightMultiColumn = true;
    //                         this.resizerEnabled = true;
    //                         break;
    //                     } else {
    //                         this.hRuler.style.cursor = 'default';
    //                         if (this.hRuler.hasAttribute('title')) {
    //                             this.hRuler.removeAttribute('title');
    //                         }
    //                         this.isLeftMultiColumn = false;
    //                         this.isRightMultiColumn = false;
    //                         this.resizerEnabled = false;
    //                     }
    //                 }
    //             }
    //         }
    //         else {
    //             this.hRuler.style.cursor = 'default';
    //             if (this.hRuler.hasAttribute('title')) {
    //                 this.hRuler.removeAttribute('title');
    //             }
    //             this.resizerEnabled = false;
    //         }
    //     }
    //     if (this.isDragging) {
    //         const rulerZeroPoint: number = HelperMethods.convertPointToPixel(
    //             1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin) * this.documentEditor.zoomFactor;
    //         const pageWidth: number = this.documentEditor.selectionModule.sectionFormat.pageWidth;
    //         const rightMarginValue: number = this.documentEditor.selectionModule.sectionFormat.rightMargin;
    //         let rightIndentValue: number = this.documentEditor.selectionModule.paragraphFormat.rightIndent;
    //         rightIndentValue = rightIndentValue > 0 ? rightIndentValue : 0;
    //         const minimumValue: number = 42;
    //         let firstLineIndent: number = this.documentEditor.selectionModule.paragraphFormat.firstLineIndent;
    //         const leftMarginValue: number = this.documentEditor.selectionModule.sectionFormat.leftMargin;
    //         firstLineIndent = firstLineIndent >= 0 ? firstLineIndent : 0;
    //         const leftIndent: number = this.documentEditor.selectionModule.paragraphFormat.leftIndent;
    //         if (this.isLeftRulerMargin) {
    //             const leftMaxLimit: number = rulerZeroPoint + (
    //                 HelperMethods.convertPointToPixel(pageWidth - rightMarginValue -
    //                     rightIndentValue - minimumValue - firstLineIndent - leftIndent) * this.documentEditor.zoomFactor);
    //             const leftMinLimit: number = rulerZeroPoint;
    //             if (pixelValue + rulerZeroPoint > leftMaxLimit) {
    //                 pixelValue = leftMaxLimit - rulerZeroPoint;
    //                 mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
    //             } else if (pixelValue + rulerZeroPoint < leftMinLimit) {
    //                 pixelValue = leftMinLimit - rulerZeroPoint;
    //                 mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
    //             }
    //         } else {
    //             const rightMinLimit: number = rulerZeroPoint + (HelperMethods.convertPointToPixel(
    //                 leftMarginValue + leftIndent + firstLineIndent + minimumValue + rightIndentValue) * this.documentEditor.zoomFactor);
    //             const rightMaxLimit: number = rulerZeroPoint + (HelperMethods.convertPointToPixel(
    //                 pageWidth) * this.documentEditor.zoomFactor);
    //             if (pixelValue + rulerZeroPoint > rightMaxLimit) {
    //                 pixelValue = rightMaxLimit - rulerZeroPoint;
    //                 mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
    //             } else if (pixelValue + rulerZeroPoint < rightMinLimit) {
    //                 pixelValue = rightMinLimit - rulerZeroPoint;
    //                 mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
    //             }
    //         }
    //         this.finalmouseXRelativeToDiv = mouseXRelativeToDiv;
    //         const currentRightMargin: number = (HelperMethods.convertPixelToPoint(divRect.width)
    //             - (this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin * this.documentEditor.zoomFactor));
    //         if (this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.numberOfColumns <= 1) {
    //             this.resizeRulerMargins(this.isLeftRulerMargin, this.initialValue,
    //                 this.currentScrollLeft, currentRightMargin, this.hRuler, mouseXRelativeToDiv, true, this.documentEditor);
    //         }
    //         const rightIndent: HTMLElement = document.getElementById(this.documentEditor.element.id + '_rightIndent');
    //         if (this.isLeftRulerMargin) {
    //             const difference: number = mouseXRelativeToDiv - this.initialValue;
    //             rightIndent.style.left = (this.initialRightMargin - HelperMethods.convertPointToPixel(difference)) + 'px';
    //         } else {
    //             const difference: number = mouseXRelativeToDiv - this.initialValue;
    //             rightIndent.style.left = (this.initialRightMargin + HelperMethods.convertPointToPixel(difference)) + 'px';
    //         }
    //         const startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.x;
    //         const indicatorLineValue: number = startValue + pixelValue;
    //         const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
    //         lineSvg.style.left = indicatorLineValue + 'px';
    //     }
    // }

    public onHRulerMouseEnter(): void {
        if (!isNullOrUndefined(this.currentTabStopElement)) {
            this.currentTabStopElement.style.display = 'block';
        }
    }

    private onHRulerMouseLeave(): void {
        if (!isNullOrUndefined(this.currentTabStopElement)) {
            this.currentTabStopElement.style.display = 'none';
            //this.currentTabStopElement = undefined;
        }
    }
    private onRulerDblClick(): void {
        this.documentEditor.showDialog('PageSetup');
    }
    private onHRulerMouseDown(e: MouseEvent): void {
        const divRect: DOMRect = this.hRuler.getBoundingClientRect() as DOMRect;
        const leftMargin: number = this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin
            * this.documentEditor.zoomFactor;
        const rightMargin: number = (HelperMethods.convertPixelToPoint(divRect.width) -
        this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin * this.documentEditor.zoomFactor);
        let pixelValue: number = Math.round(e.clientX - divRect.left);
        let mouseXRelativeToDiv: number = HelperMethods.convertPixelToPoint(pixelValue);
        this.updateHRulerCursor(leftMargin, rightMargin, mouseXRelativeToDiv, e.clientX);
        if (this.resizerEnabled && !this.documentEditor.isTableMarkerDragging) {
            this.isHorizontalScroll = true;
            this.isDraggingRender = true;
            if (this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.columns.length > 0) {
                if (this.isLeftMultiColumn) {
                    this.columnInitialValue = this.multiColumnElement.getBoundingClientRect().left;
                } else if (this.isRightMultiColumn) {
                    this.columnInitialValue = this.multiColumnElement.getBoundingClientRect().left
                        + this.multiColumnElement.getBoundingClientRect().width;
                }
            }
            this.renderInitialValue = HelperMethods.convertPixelToPoint(Math.round(e.clientX - divRect.left));
            this.currentScrollLeft = this.hRuler.scrollLeft;
            const rightIndent: HTMLElement = document.getElementById(this.documentEditor.element.id + '_rightIndent');
            this.initialRightMargin = HelperMethods.getNumberFromString(rightIndent.style.left);

            const pixelValue: number = Math.round(e.clientX - divRect.left);
            const startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.x;
            const indicatorLineValue: number = startValue + pixelValue;

            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
            lineSvg.style.left = indicatorLineValue + 'px';
            lineSvg.style.display = 'block';
        }

        if (divRect.y + (divRect.height / 2) <= e.clientY) {
            this.mouseDownTabValue = e.clientX - this.hRuler.getBoundingClientRect().left;
            if (this.documentEditor.layoutType === 'Pages') {
                this.mouseDownTabValue = HelperMethods.convertPixelToPoint(
                    this.mouseDownTabValue - HelperMethods.convertPointToPixel(
                        this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin) *
                        this.documentEditor.zoomFactor);
                if (this.position.paragraph.paragraphFormat.bidi) {
                    let paraWidth: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['width'].toString()) : this.position.paragraph.width;
                    paraWidth = HelperMethods.convertPixelToPoint(paraWidth * this.documentEditor.zoomFactor);
                    this.mouseDownTabValue = paraWidth - this.mouseDownTabValue;
                }
            } else if (this.documentEditor.layoutType === 'Continuous') {
                if (this.position.paragraph.paragraphFormat.bidi) {
                    this.mouseDownTabValue = HelperMethods.convertPixelToPoint((this.mouseDownTabValue) - 20);
                    let paraWidth: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['width'].toString()) : this.position.paragraph.width;
                    paraWidth = HelperMethods.convertPixelToPoint(paraWidth * this.documentEditor.zoomFactor);
                    this.mouseDownTabValue = paraWidth - this.mouseDownTabValue;
                } else {
                    this.mouseDownTabValue = HelperMethods.convertPixelToPoint((this.mouseDownTabValue) - 20);
                }
            }
        }
    }

    private onHRulerMouseUp(e: MouseEvent): void {
        const container: HTMLElement = document.getElementById(this.documentEditor.element.id + '_markIndicator');
        const divRect: DOMRect = this.hRuler.getBoundingClientRect() as DOMRect;

        if (divRect.y + (divRect.height / 2) <= e.clientY) {
            this.mouseUpTabValue = e.clientX - this.hRuler.getBoundingClientRect().left;
            if (this.documentEditor.layoutType === 'Pages') {
                this.mouseUpTabValue = HelperMethods.convertPixelToPoint(this.mouseUpTabValue -
                    HelperMethods.convertPointToPixel(
                        this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin)
                    * this.documentEditor.zoomFactor);
                if (this.position.paragraph.paragraphFormat.bidi) {
                    let paraWidth: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['width'].toString()) : this.position.paragraph.width;
                    paraWidth = HelperMethods.convertPixelToPoint(paraWidth * this.documentEditor.zoomFactor);
                    this.mouseUpTabValue = paraWidth - this.mouseUpTabValue;
                }
            } else if (this.documentEditor.layoutType === 'Continuous') {
                if (this.position.paragraph.paragraphFormat.bidi) {
                    this.mouseUpTabValue = HelperMethods.convertPixelToPoint((this.mouseUpTabValue) - 20);
                    let paraWidth: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['width'].toString()) : this.position.paragraph.width;
                    paraWidth = HelperMethods.convertPixelToPoint(paraWidth * this.documentEditor.zoomFactor);
                    this.mouseUpTabValue = paraWidth - this.mouseUpTabValue;
                } else {
                    this.mouseUpTabValue = HelperMethods.convertPixelToPoint((this.mouseUpTabValue) - 20);
                }
            }
            const rightIndent: HTMLElement = document.getElementById(this.documentEditor.element.id + '_rightIndent');
            const rightIndentValue: number = HelperMethods.getNumberFromString(rightIndent.style.left);
            const maxValue: number = rightIndentValue;
            if (this.mouseUpTabValue > 0 && this.mouseUpTabValue < maxValue && this.mouseDownTabValue === this.mouseUpTabValue) {
                if (!isNullOrUndefined(container)) {
                    const visibleElement: Element = container.querySelector('.e-de-ruler-marker[style*="display: block;"]');
                    if (!isNullOrUndefined(visibleElement)) {
                        this.mouseUpTabValue /= this.documentEditor.zoomFactor;
                        const dataNameValue: string = visibleElement.getAttribute('data-name');
                        if (dataNameValue === 'LeftTab' || dataNameValue === 'CenterTab'
                            || dataNameValue === 'RightTab' || dataNameValue === 'DecimalTab' || dataNameValue === 'BarTab') {
                            const tabStop: WTabStop = new WTabStop();
                            tabStop.position = this.mouseUpTabValue;
                            tabStop.tabJustification = this.getTabJustification(dataNameValue);
                            tabStop.deletePosition = 0;
                            tabStop.tabLeader = 'None';
                            this.documentEditor.editorModule.onApplyParagraphFormat('tabStop', [tabStop], false, false);
                        } else if (dataNameValue === 'FirstLineIndent' || dataNameValue === 'HangingIndent') {
                            const property: string = 'firstLineIndent';
                            if (dataNameValue === 'HangingIndent') {
                                const initialValue: number = this.documentEditor.selectionModule.paragraphFormat.firstLineIndent;
                                const differenceValue: number = this.mouseUpTabValue + initialValue;
                                let currentValue: number =
                                this.documentEditor.selectionModule.start.paragraph.paragraphFormat.firstLineIndent;
                                this.documentEditor.editorModule.onApplyParagraphFormat('firstLineIndent', currentValue - differenceValue, false, false);
                                const leftIndentCurrentValue: number =
                                this.documentEditor.selectionModule.start.paragraph.paragraphFormat.leftIndent + currentValue;
                                currentValue = currentValue - differenceValue;
                                this.documentEditor.editorModule.onApplyParagraphFormat('leftIndent', leftIndentCurrentValue - currentValue, false, false, true);
                            }
                            else {
                                this.documentEditor.editorModule.onApplyParagraphFormat(property, this.mouseDownTabValue, false, false);
                            }
                        }
                    }
                }
            }
        }
    }

    private onRularMouseUp(e: MouseEvent): void {
        if (this.isDraggingRender && !this.documentEditor.isTableMarkerDragging && !this.isDraggingVertical) {
            this.isHorizontalScroll = false;
            const divRect: DOMRect = this.hRuler.getBoundingClientRect() as DOMRect;
            const mouseXRelativeToDiv: number = this.finalmouseXRelativeToDiv; // HelperMethods.convertPixelToPoint(Math.round(e.clientX - divRect.left));
            // const currentLeftMargin = documentEditor.hRuler.startMargin * documentEditor.zoomFactor;
            // const currentScrollLeft = hRuler.scrollLeft;
            // const currentRightMargin = (HelperMethods.convertPixelToPoint(divRect.width) - (documentEditor.selection.end.paragraph.bodyWidget.sectionFormat.rightMargin * documentEditor.zoomFactor));
            // resizeRulerMargins(isLeftRulerMargin, currentLeftMargin, currentScrollLeft, currentRightMargin, hRuler, mouseXRelativeToDiv, true, documentEditor);
            // if (hRuler) {
            //     rulerObj.scrollLeft = rulerObj.scrollLeft - HelperMethods.convertPointToPixel((documentEditor.hRuler.leftMargin < mouseXRelativeToDiv) ? (mouseXRelativeToDiv - documentEditor.hRuler.leftMargin) : (documentEditor.hRuler.leftMargin - mouseXRelativeToDiv));
            // }
            // updateRuler(documentEditor, documentEditor.hRuler, true);
            if (this.isLeftMultiColumn || this.isRightMultiColumn) {
                let finalvalue: number = 0;
                finalvalue = e.clientX - this.columnInitialValue;
                const secFormat: WSectionFormat =
                this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.cloneFormat();
                const pageWidth: number = this.documentEditor.selectionModule.sectionFormat.pageWidth
                    - this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin -
                    this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin;
                const columnSpace: number = this.isLeftMultiColumn ? (secFormat.columns[0].space +
                    ((HelperMethods.convertPixelToPoint(finalvalue))))
                    : (secFormat.columns[0].space - ((HelperMethods.convertPixelToPoint(finalvalue))));
                for (let i: number = 0; i < secFormat.columns.length; i++) {
                    const col: WColumnFormat = secFormat.columns[parseInt(i.toString(), 10)];
                    if (columnSpace >= 0 && col.width >= 36) {
                        const widthCal: number = HelperMethods.convertPointToPixel(
                            (pageWidth - (HelperMethods.convertPixelToPoint(
                                columnSpace) * (secFormat.numberOfColumns - 1))) / (secFormat.numberOfColumns));
                        col.width = widthCal;
                        if (i < secFormat.columns.length - 1) {
                            col.space = columnSpace;
                        }
                    } else {
                        col[0].space = col[1].space;
                    }
                }
                this.documentEditor.editorModule.onApplySectionFormat(undefined, secFormat);
                this.isLeftMultiColumn = false;
                this.isRightMultiColumn = false;
            } else if (this.isLeftRulerMargin) {
                this.documentEditor.hRuler.startMargin = (mouseXRelativeToDiv / this.documentEditor.zoomFactor);
                this.documentEditor.selectionModule.sectionFormat.leftMargin = mouseXRelativeToDiv / this.documentEditor.zoomFactor;
            } else {
                const rightMargin: number = HelperMethods.convertPixelToPoint(
                    this.rulerGeometry.width) - (mouseXRelativeToDiv / this.documentEditor.zoomFactor);
                // documentEditor.hRuler.endMargin = rightMargin;
                this.documentEditor.selectionModule.sectionFormat.rightMargin = rightMargin;
            }

            this.resizerEnabled = false;
            this.isDraggingRender = false;
            this.isLeftRulerMargin = undefined;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
            lineSvg.style.display = 'none';
        }
    }

    private onVMouseMove(e: MouseEvent): void {
        if (this.documentEditor.isDestroyed || !this.documentEditor.documentEditorSettings.showRuler) {
            return;
        }
        const divRect: DOMRect = this.vRuler.getBoundingClientRect() as DOMRect;
        const topMargin: number = this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin
            * this.documentEditor.zoomFactor;
        const bottomMargin: number = (HelperMethods.convertPixelToPoint(
            divRect.height) - this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.bottomMargin
            * this.documentEditor.zoomFactor);
        const mouseXRelativeToDiv: number = HelperMethods.convertPixelToPoint(Math.round(e.clientY - divRect.top));
        let pixelValue: number = Math.round(e.clientY - divRect.top);
        if (!this.isDraggingRender) {
            if (((topMargin - 3) <= mouseXRelativeToDiv) && ((topMargin + 3) >= mouseXRelativeToDiv)) {
                this.vRuler.style.cursor = 'n-resize';
                this.vRuler.setAttribute('title', this.locale.getConstant('Top Margin'));
                this.resizerEnabled = true;
                this.isTopRulerMargin = true;

            } else if ((((bottomMargin - 3) <= mouseXRelativeToDiv) && ((bottomMargin + 3) >= mouseXRelativeToDiv))) {
                this.vRuler.style.cursor = 'n-resize';
                this.vRuler.setAttribute('title', this.locale.getConstant('Bottom Margin'));
                this.resizerEnabled = true;
                this.isTopRulerMargin = false;
            }
            else {
                this.vRuler.style.cursor = 'default';
                if (this.vRuler.hasAttribute('title')) {
                    this.vRuler.removeAttribute('title');
                }
                this.resizerEnabled = false;
            }
        }
        if (this.isDraggingRender) {
            let mouseXRelativeToDiv: number = HelperMethods.convertPixelToPoint(Math.round(e.clientY - divRect.top));
            const rulerZeroPoint: number = HelperMethods.convertPointToPixel(
                1584 - this.documentEditor.selectionModule.sectionFormat.topMargin)
                * this.documentEditor.zoomFactor;
            const pageHeight: number = this.documentEditor.selectionModule.sectionFormat.pageHeight;
            const minimumValue: number = 12;
            const bottomMarginValue: number = this.documentEditor.selectionModule.sectionFormat.bottomMargin;
            const topMarginValue: number = this.documentEditor.selectionModule.sectionFormat.topMargin;
            if (this.isTopRulerMargin) {
                const topMinLimit: number = rulerZeroPoint;
                const topMaxLimit: number = rulerZeroPoint + (HelperMethods.convertPointToPixel(
                    pageHeight - bottomMarginValue - minimumValue) * this.documentEditor.zoomFactor);
                if (pixelValue + rulerZeroPoint > topMaxLimit) {
                    pixelValue = topMaxLimit - rulerZeroPoint;
                    mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                } else if (pixelValue + rulerZeroPoint < topMinLimit) {
                    pixelValue = topMinLimit - rulerZeroPoint;
                    mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                }
            } else {
                const bottomMinLimit: number = rulerZeroPoint + (HelperMethods.convertPointToPixel(
                    topMarginValue + minimumValue) * this.documentEditor.zoomFactor);
                const bottomMaxLimit: number = rulerZeroPoint + (HelperMethods.convertPointToPixel(
                    pageHeight) * this.documentEditor.zoomFactor);
                if (pixelValue + rulerZeroPoint > bottomMaxLimit) {
                    pixelValue = bottomMaxLimit - rulerZeroPoint;
                    mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                } else if (pixelValue + rulerZeroPoint < bottomMinLimit) {
                    pixelValue = bottomMinLimit - rulerZeroPoint;
                    mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                }
            }
            const currentBottomMargin: number = (HelperMethods.convertPixelToPoint(divRect.height) -
                (this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.bottomMargin * this.documentEditor.zoomFactor));
            if (this.isDraggingVertical) {
                this.resizeVRulerMargins(this.isTopRulerMargin, this.initialYValue, this.currentScrollTop,
                    currentBottomMargin, this.vRuler, mouseXRelativeToDiv, this.documentEditor);
            }
           

            const startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.y * this.documentEditor.zoomFactor;
            const indicatorLineValue: number = startValue + pixelValue; // + 15;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_vRuler_indicator_svg');
            lineSvg.style.top = indicatorLineValue + 'px';
        }

    }

    private onVMouseDown(e: MouseEvent): void {
        if (this.resizerEnabled) {
            this.isDraggingRender = true;
            this.isDraggingVertical = true;
            const divRect: DOMRect = this.vRuler.getBoundingClientRect() as DOMRect;
            this.initialYValue = HelperMethods.convertPixelToPoint(Math.round(e.clientY - divRect.top));
            this.currentScrollTop = this.vRuler.scrollTop;

            const pixelValue: number = Math.round(e.clientY - divRect.top);
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_vRuler_indicator_svg');
            const startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.y * this.documentEditor.zoomFactor;
            const indicatorLineValue: number = (startValue + pixelValue); // + 15;
            lineSvg.style.top = indicatorLineValue + 'px';
            lineSvg.style.display = 'block';
        }
    }

    private onVMouseUp(e: MouseEvent): void {
        if (this.isDraggingRender) {
            this.isDraggingVertical = false;
            const divRect: DOMRect = this.vRuler.getBoundingClientRect() as DOMRect;
            const mouseXRelativeToDiv: number = HelperMethods.convertPixelToPoint(Math.round(e.clientY - divRect.top));
            // const currentTopMargin = documentEditor.hRuler.startMargin * documentEditor.zoomFactor;
            // const currentScrollTop = vRuler.scrollTop;
            // const currentBottomMargin = (HelperMethods.convertPixelToPoint(divRect.height) - (documentEditor.selection.end.paragraph.bodyWidget.sectionFormat.bottomMargin * documentEditor.zoomFactor));
            // resizeVRulerMargins(isTopRulerMargin, currentTopMargin, currentScrollTop, currentBottomMargin, vRuler, mouseXRelativeToDiv, documentEditor);
            // if (hRuler) {
            //     rulerObj.scrollLeft = rulerObj.scrollLeft - HelperMethods.convertPointToPixel((documentEditor.hRuler.leftMargin < mouseXRelativeToDiv) ? (mouseXRelativeToDiv - documentEditor.hRuler.leftMargin) : (documentEditor.hRuler.leftMargin - mouseXRelativeToDiv));
            // }
            // updateRuler(documentEditor, documentEditor.hRuler, true);
            if (this.isTopRulerMargin) {
                this.documentEditor.vRuler.startMargin = (mouseXRelativeToDiv / this.documentEditor.zoomFactor);
                this.documentEditor.selectionModule.sectionFormat.topMargin = mouseXRelativeToDiv / this.documentEditor.zoomFactor;
            } else {
                const bottomtMargin: number = HelperMethods.convertPixelToPoint(
                    this.rulerGeometry.height) - (mouseXRelativeToDiv / this.documentEditor.zoomFactor);
                this.documentEditor.vRuler.endMargin = bottomtMargin;
                this.documentEditor.selectionModule.sectionFormat.bottomMargin = bottomtMargin;
            }

            this.resizerEnabled = false;
            this.isDraggingRender = false;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_vRuler_indicator_svg');
            lineSvg.style.display = 'none';
            this.isTopRulerMargin = undefined;
        }
    }

    private onDocumentIntentTrue(): void {
        this.documentEditor.isOnIndent = true;
    }

    private onDocumentIntentFalse(): void {
        this.documentEditor.isOnIndent = false;
    }

    private onDoubleClick(event: MouseEvent): void {
        this.documentEditor.showDialog('Paragraph');
        event.stopPropagation();
    }

    private onFirstLineIndentMouseDown(e: MouseEvent): void {
        this.isDraggingIndents1 = true;
        this.firstLineOffset = e.clientX - this.firstLineIndent.getBoundingClientRect().left;
        this.indentInitialValue = HelperMethods.getNumberFromString(this.firstLineIndent.style.left);
        let rulerZeroPoint: number = HelperMethods.convertPointToPixel(
            1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin) * this.documentEditor.zoomFactor;
        if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
            rulerZeroPoint = HelperMethods.convertPointToPixel(
                1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin -
                (this.documentEditor.selectionModule.sectionFormat.pageWidth -
                    this.documentEditor.selectionModule.sectionFormat.leftMargin -
                    this.documentEditor.selectionModule.sectionFormat.rightMargin)) * this.documentEditor.zoomFactor;
        }
        if (this.documentEditor.layoutType === 'Continuous') {
            rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) - 20;
            if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
                rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) -
                    20 - (this.documentEditor.viewer.clientArea.width * this.documentEditor.zoomFactor);
            }
        }
        const value: number = rulerZeroPoint + e.clientX - this.firstLineOffset - this.hRuler.getBoundingClientRect().left;
        let startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.x;
        startValue = this.documentEditor.layoutType === 'Continuous' ? 0 : startValue;
        const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
        const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
        lineSvg.style.left = indicatorLineValue + 'px';
        lineSvg.style.display = 'block';
        e.stopPropagation();
    }

    private onIndentMouseMove(e: MouseEvent): void {
        if (this.isDraggingIndents1) {
            let rulerZeroPoint: number;
            let maxValue: number;
            let minValue: number;
            const rightIndent: HTMLElement = document.getElementById(this.documentEditor.element.id + '_rightIndent');
            const rightIndentValue: number = HelperMethods.getNumberFromString(rightIndent.style.left);
            if (this.documentEditor.layoutType === 'Pages') {
                if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
                    rulerZeroPoint = HelperMethods.convertPointToPixel(
                        1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin -
                        (this.documentEditor.selectionModule.sectionFormat.pageWidth -
                            this.documentEditor.selectionModule.sectionFormat.leftMargin -
                            this.documentEditor.selectionModule.sectionFormat.rightMargin)) * this.documentEditor.zoomFactor;
                    maxValue = rulerZeroPoint - 6 + (HelperMethods.convertPointToPixel(
                        this.documentEditor.selectionModule.sectionFormat.pageWidth) * this.documentEditor.zoomFactor);
                    minValue = rightIndentValue + HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor;
                } else {
                    rulerZeroPoint = HelperMethods.convertPointToPixel(
                        1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin)
                        * this.documentEditor.zoomFactor;
                    minValue = rulerZeroPoint - 6;
                    maxValue = rightIndentValue - HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor;
                }
            } else if (this.documentEditor.layoutType === 'Continuous') {
                if (this.position.paragraph.paragraphFormat.bidi) {
                    rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) -
                        20 - (this.documentEditor.viewer.clientArea.width * this.documentEditor.zoomFactor);
                    maxValue = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) - 20 + 40 - 6;
                    minValue = rightIndentValue + (HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor);
                } else {
                    rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) - 20;
                    minValue = rulerZeroPoint - 6;
                    maxValue = rightIndentValue - (HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor);
                }
            }
            let value: number = rulerZeroPoint + e.clientX - this.firstLineOffset - this.hRuler.getBoundingClientRect().left;
            if (value < minValue) {
                value = minValue;
            } else if (value > maxValue) {
                value = maxValue;
            }
            this.firstLineIndent.style.left = value + 'px';
            let startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.x;
            startValue = this.documentEditor.layoutType === 'Continuous' ? 0 : startValue;
            const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
            lineSvg.style.left = indicatorLineValue + 'px';
        }
    }

    private onIndentMouseUp(e: MouseEvent): void {
        if (this.isDraggingIndents1) {
            this.isDraggingIndents1 = false;
            let finalValue: number = HelperMethods.getNumberFromString(this.firstLineIndent.style.left);
            if (parseInt(this.firstLineIndent.style.left.replace('px', ''), 10) < 0) {
                finalValue *= -1;
            }
            if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
                this.documentEditor.editorModule.applyRulerMarkerValues('firstLineIndent', finalValue, this.indentInitialValue);
            } else {
                this.documentEditor.editorModule.applyRulerMarkerValues('firstLineIndent', this.indentInitialValue, finalValue);
            }
            this.indentInitialValue = finalValue;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
            lineSvg.style.display = 'none';
        }
    }

    private onHangIndentMouseDown(e: MouseEvent): void {
        this.isDraggingIndents2 = true;
        this.hangingLineOffset = e.clientX - this.hangingIndent.getBoundingClientRect().left;
        this.hangingIndentInitialValue = HelperMethods.getNumberFromString(this.hangingIndent.style.left);
        const rightIndent: HTMLElement = document.getElementById(this.documentEditor.element.id + '_rightIndent');
        const rightPosition: number = HelperMethods.getNumberFromString(rightIndent.style.left);
        let rulerZeroPoint: number;
        if (this.documentEditor.layoutType === 'Pages') {
            if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
                rulerZeroPoint = HelperMethods.convertPointToPixel(
                    1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin -
                    (this.documentEditor.selectionModule.sectionFormat.pageWidth -
                        this.documentEditor.selectionModule.sectionFormat.leftMargin -
                        this.documentEditor.selectionModule.sectionFormat.rightMargin)) * this.documentEditor.zoomFactor;
                this.minLimit1 = rightPosition + (HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor);
                this.maxLimit1 = rulerZeroPoint - 6 + (HelperMethods.convertPointToPixel(
                    this.documentEditor.selectionModule.sectionFormat.pageWidth) * this.documentEditor.zoomFactor);
            } else {
                rulerZeroPoint = HelperMethods.convertPointToPixel(
                    1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin) * this.documentEditor.zoomFactor;
                this.minLimit1 = rulerZeroPoint - 6;
                this.maxLimit1 = (rightPosition - HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor);
            }
        } else if (this.documentEditor.layoutType === 'Continuous') {
            if (this.position.paragraph.paragraphFormat.bidi) {
                rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) -
                    20 - (this.documentEditor.viewer.clientArea.width * this.documentEditor.zoomFactor);
                this.maxLimit1 = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) - 20 + 40 - 6;
                this.minLimit1 = rightPosition + (HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor);
            } else {
                rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) - 20;
                this.minLimit1 = rulerZeroPoint - 6;
                this.maxLimit1 = (rightPosition - HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor);
            }
        }
        this.leftIndent1 = document.getElementById(this.documentEditor.element.id + '_leftIndent');
        const value: number = rulerZeroPoint + e.clientX - this.hangingLineOffset - this.hRuler.getBoundingClientRect().left;
        let startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.x;
        startValue = this.documentEditor.layoutType === 'Continuous' ? 0 : startValue;
        const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
        const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
        lineSvg.style.left = indicatorLineValue + 'px';
        lineSvg.style.display = 'block';
        e.stopPropagation();
    }

    private onHangIndentMouseMove(e:MouseEvent): void {
        if (this.isDraggingIndents2) {
            let rulerZeroPoint: number;
            if (this.documentEditor.layoutType === 'Pages') {
                if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
                    rulerZeroPoint = HelperMethods.convertPointToPixel(
                        1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin -
                        (this.documentEditor.selectionModule.sectionFormat.pageWidth -
                            this.documentEditor.selectionModule.sectionFormat.leftMargin -
                            this.documentEditor.selectionModule.sectionFormat.rightMargin)) * this.documentEditor.zoomFactor;
                } else {
                    rulerZeroPoint = HelperMethods.convertPointToPixel(
                        1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin) * this.documentEditor.zoomFactor;
                }
            } else if (this.documentEditor.layoutType === 'Continuous') {
                if (this.position.paragraph.paragraphFormat.bidi) {
                    rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) -
                        20 - (this.documentEditor.viewer.clientArea.width * this.documentEditor.zoomFactor);
                } else {
                    rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) - 20;
                }
            }
            let value: number = rulerZeroPoint + e.clientX - this.hangingLineOffset - this.hRuler.getBoundingClientRect().left;
            if ((value) > this.maxLimit1) {
                value = this.maxLimit1;
            } else if (value < this.minLimit1) {
                value = this.minLimit1;
            }
            this.leftIndent1.style.left = value + 'px';
            this.hangingIndent.style.left = value + 'px';
            let startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.x;
            startValue = this.documentEditor.layoutType === 'Continuous' ? 0 : startValue;
            const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
            lineSvg.style.left = indicatorLineValue + 'px';
        }
    }

    private onHangIndentMouseUp(e: MouseEvent): void {
        if (this.isDraggingIndents2) {
            this.isDraggingIndents2 = false;
            let finalValue: number = HelperMethods.getNumberFromString(this.hangingIndent.style.left);
            if (parseInt(this.hangingIndent.style.left.replace('px', ''), 10) < 0) {
                finalValue *= -1;
            }
            if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
                this.documentEditor.editorModule.applyRulerMarkerValues('hangingIndent', finalValue, this.hangingIndentInitialValue);
            } else {
                this.documentEditor.editorModule.applyRulerMarkerValues('hangingIndent', this.hangingIndentInitialValue, finalValue);
            }
            this.hangingIndentInitialValue = finalValue;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
            lineSvg.style.display = 'none';
        }
    }

    private onLeftIndentMouseDown(e: MouseEvent): void {
        let rulerZeroPoint: number;
        this.isDraggingIndents3 = true;
        this.leftLineOffset = e.clientX - this.leftIndent.getBoundingClientRect().left;
        this.indentInitialValue = HelperMethods.getNumberFromString(this.leftIndent.style.left);
        this.firstIndentInitialValue = HelperMethods.getNumberFromString(this.firstLineIndent.style.left);
        this.diff = this.firstIndentInitialValue - this.indentInitialValue;
        this.firstLineIndent = document.getElementById(this.documentEditor.element.id + '_firstLineIndent');
        const rightIndent: HTMLElement = document.getElementById(this.documentEditor.element.id + '_rightIndent');
        const rightPosition: number = HelperMethods.getNumberFromString(rightIndent.style.left);
        if (this.documentEditor.layoutType === 'Pages') {
            if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
                rulerZeroPoint = HelperMethods.convertPointToPixel(
                    1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin -
                    (this.documentEditor.selectionModule.sectionFormat.pageWidth -
                        this.documentEditor.selectionModule.sectionFormat.leftMargin -
                        this.documentEditor.selectionModule.sectionFormat.rightMargin)) * this.documentEditor.zoomFactor;
                this.minLimit2 = (rightPosition + HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor);
                this.maxLimit2 = rulerZeroPoint - 6 + (HelperMethods.convertPointToPixel(
                    this.documentEditor.selectionModule.sectionFormat.pageWidth) * this.documentEditor.zoomFactor);
                this.isHangingIndent = (HelperMethods.getNumberFromString(this.hangingIndent.style.left) - rightPosition)
                    <= (HelperMethods.getNumberFromString(this.firstLineIndent.style.left) - rightPosition);
            } else {
                rulerZeroPoint = HelperMethods.convertPointToPixel(
                    1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin) * this.documentEditor.zoomFactor;
                this.minLimit2 = rulerZeroPoint - 6;
                this.maxLimit2 = (rightPosition - HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor);
                this.isHangingIndent = (rightPosition - HelperMethods.getNumberFromString(this.hangingIndent.style.left))
                    <= (rightPosition - HelperMethods.getNumberFromString(this.firstLineIndent.style.left));
            }
        } else if (this.documentEditor.layoutType === 'Continuous') {
            if (this.position.paragraph.paragraphFormat.bidi) {
                rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) -
                    20 - (this.documentEditor.viewer.clientArea.width * this.documentEditor.zoomFactor);
                this.maxLimit2 = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) - 20 + 40 - 6;
                this.minLimit2 = rightPosition + (HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor);
                this.isHangingIndent = (HelperMethods.getNumberFromString(this.hangingIndent.style.left) - rightPosition)
                    <= (HelperMethods.getNumberFromString(this.firstLineIndent.style.left) - rightPosition);
            } else {
                rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) - 20;
                this.minLimit2 = rulerZeroPoint - 6;
                this.maxLimit2 = (rightPosition - HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor);
                this.isHangingIndent = (rightPosition - HelperMethods.getNumberFromString(this.hangingIndent.style.left))
                    <= (rightPosition - HelperMethods.getNumberFromString(this.firstLineIndent.style.left));
            }
        }
        const value: number = rulerZeroPoint + e.clientX - this.leftLineOffset - this.hRuler.getBoundingClientRect().left;
        let startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.x;
        startValue = this.documentEditor.layoutType === 'Continuous' ? 0 : startValue;
        const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
        const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
        lineSvg.style.left = indicatorLineValue + 'px';
        lineSvg.style.display = 'block';
        e.stopPropagation();
    }

    private onLeftIndentMouseMove(e: MouseEvent): void {
        if (this.isDraggingIndents3) {
            let rulerZeroPoint: number;
            let value: number;
            if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
                if (this.documentEditor.layoutType === 'Pages') {
                    rulerZeroPoint = HelperMethods.convertPointToPixel(
                        1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin -
                        (this.documentEditor.selectionModule.sectionFormat.pageWidth -
                            this.documentEditor.selectionModule.sectionFormat.leftMargin
                            - this.documentEditor.selectionModule.sectionFormat.rightMargin)) * this.documentEditor.zoomFactor;
                } else if (this.documentEditor.layoutType === 'Continuous') {
                    rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) -
                        20 - (this.documentEditor.viewer.clientArea.width * this.documentEditor.zoomFactor);
                }
                value = rulerZeroPoint + e.clientX - this.leftLineOffset - this.hRuler.getBoundingClientRect().left;
                if (this.isHangingIndent) {
                    if ((value + this.diff) > this.maxLimit2) {
                        value = this.maxLimit2 - this.diff;
                    }
                } else {
                    if ((value) > this.maxLimit2) {
                        value = this.maxLimit2;
                    }
                }
                if (this.isHangingIndent) {
                    if (value < this.minLimit2) {
                        value = this.minLimit2;
                    }
                } else {
                    if ((value + this.diff) < this.minLimit2) {
                        value = this.minLimit2 - this.diff;
                    }
                }
            } else {
                if (this.documentEditor.layoutType === 'Pages') {
                    rulerZeroPoint = HelperMethods.convertPointToPixel(
                        1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin) * this.documentEditor.zoomFactor;
                } else if (this.documentEditor.layoutType === 'Continuous') {
                    rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) - 20;
                }
                value = rulerZeroPoint + e.clientX - this.leftLineOffset - this.hRuler.getBoundingClientRect().left;
                if (this.isHangingIndent) {
                    if ((value) > this.maxLimit2) {
                        value = this.maxLimit2;
                    }
                } else {
                    if ((value + this.diff) > this.maxLimit2) {
                        value = this.maxLimit2 - this.diff;
                    }
                }
                if (this.isHangingIndent) {
                    if ((value + this.diff) < this.minLimit2) {
                        value = this.minLimit2 - this.diff;
                    }
                } else {
                    if (value < this.minLimit2) {
                        value = this.minLimit2;
                    }
                }
            }
            this.hangingIndent.style.left = value + 'px';
            this.leftIndent.style.left = value + 'px';
            this.firstLineIndent.style.left = (this.firstIndentInitialValue + (value - this.indentInitialValue)) + 'px';
            let startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.x;
            startValue = this.documentEditor.layoutType === 'Continuous' ? 0 : startValue;
            const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
            lineSvg.style.left = indicatorLineValue + 'px';
        }
    }

    private onLeftIndentMouseUp(e: MouseEvent): void {
        if (this.isDraggingIndents3) {
            this.isDraggingIndents3 = false;
            let finalValue: number = HelperMethods.getNumberFromString(this.leftIndent.style.left);
            if (parseInt(this.leftIndent.style.left.replace('px', ''), 10) < 0) {
                finalValue *= -1;
            }
            if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
                this.documentEditor.editorModule.applyRulerMarkerValues('leftIndent', finalValue, this.indentInitialValue);
            } else {
                this.documentEditor.editorModule.applyRulerMarkerValues('leftIndent', this.indentInitialValue, finalValue);
            }
            this.indentInitialValue = finalValue;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
            lineSvg.style.display = 'none';
        }
    }

    private onRightIndentMouseDown(e: MouseEvent): void {
        this.isDraggingIndents4 = true;
        this.rightLineOffset = e.clientX - this.rightIndent.getBoundingClientRect().left;
        this.indentInitialValue = HelperMethods.getNumberFromString(this.rightIndent.style.left);
        let rulerZeroPoint: number = HelperMethods.convertPointToPixel(
            1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin) * this.documentEditor.zoomFactor;
        if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
            rulerZeroPoint = HelperMethods.convertPointToPixel(
                1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin -
                (this.documentEditor.selectionModule.sectionFormat.pageWidth - this.documentEditor.selectionModule.sectionFormat.leftMargin -
                    this.documentEditor.selectionModule.sectionFormat.rightMargin)) * this.documentEditor.zoomFactor;
        }
        if (this.documentEditor.layoutType === 'Continuous') {
            rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) - 20;
            if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
                rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) -
                    20 - (this.documentEditor.viewer.clientArea.width * this.documentEditor.zoomFactor);
            }
        }
        const value: number = rulerZeroPoint + e.clientX - this.rightLineOffset - this.hRuler.getBoundingClientRect().left;
        let startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.x;
        startValue = this.documentEditor.layoutType === 'Continuous' ? 0 : startValue;
        const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
        const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
        lineSvg.style.left = indicatorLineValue + 'px';
        lineSvg.style.display = 'block';
        e.stopPropagation();
    }

    private onRightIndentMouseMove(e: MouseEvent): void {
        if (this.isDraggingIndents4) {
            let rulerZeroPoint: number;
            let value: number;
            const leftIndent: HTMLElement = document.getElementById(this.documentEditor.element.id + '_leftIndent');
            const firstLineIndent: HTMLElement = document.getElementById(this.documentEditor.element.id + '_firstLineIndent');
            let maxValue: number;
            let minValue: number;
            if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
                if (this.documentEditor.layoutType === 'Pages') {
                    rulerZeroPoint = HelperMethods.convertPointToPixel(
                        1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin -
                        (this.documentEditor.selectionModule.sectionFormat.pageWidth -
                            this.documentEditor.selectionModule.sectionFormat.leftMargin -
                            this.documentEditor.selectionModule.sectionFormat.rightMargin)) * this.documentEditor.zoomFactor;
                } else if (this.documentEditor.layoutType === 'Continuous') {
                    rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor)
                        - 20 - (this.documentEditor.viewer.clientArea.width * this.documentEditor.zoomFactor);
                }
                value = rulerZeroPoint + e.clientX - this.rightLineOffset - this.hRuler.getBoundingClientRect().left;
                const nearestElement: HTMLElement = (HelperMethods.getNumberFromString(
                    leftIndent.style.left) - value) <= (HelperMethods.getNumberFromString(
                    firstLineIndent.style.left) - value) ? leftIndent : firstLineIndent;
                const indentValue: number = HelperMethods.getNumberFromString(nearestElement.style.left);
                maxValue = indentValue - (HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor);
                minValue = rulerZeroPoint - 6;
            } else {
                if (this.documentEditor.layoutType === 'Pages') {
                    rulerZeroPoint = HelperMethods.convertPointToPixel(
                        1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin) * this.documentEditor.zoomFactor;
                } else if (this.documentEditor.layoutType === 'Continuous') {
                    rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) - 20;
                }
                value = rulerZeroPoint + e.clientX - this.rightLineOffset - this.hRuler.getBoundingClientRect().left;
                const nearestElement: HTMLElement = (value - HelperMethods.getNumberFromString(leftIndent.style.left))
                    <= (value - HelperMethods.getNumberFromString(firstLineIndent.style.left)) ? leftIndent : firstLineIndent;
                const indentValue: number = HelperMethods.getNumberFromString(nearestElement.style.left);
                maxValue = rulerZeroPoint + (this.documentEditor.documentHelper.currentPage.boundingRectangle.width
                    * this.documentEditor.zoomFactor) - 6;
                minValue = indentValue + (HelperMethods.convertPointToPixel(42) * this.documentEditor.zoomFactor);
            }
            if (value < minValue) {
                value = minValue;
            } else if (value > maxValue) {
                value = maxValue;
            }
            this.rightIndent.style.left = value + 'px';
            let startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.x;
            startValue = this.documentEditor.layoutType === 'Continuous' ? 0 : startValue;
            const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
            lineSvg.style.left = indicatorLineValue + 'px';
        }
    }

    private onRightIndentMouseUp(e: MouseEvent): void {
        if (this.isDraggingIndents4) {
            this.isDraggingIndents4 = false;
            const finalValue: number = HelperMethods.getNumberFromString(this.rightIndent.style.left);
            if (this.documentEditor.selectionModule.paragraphFormat.bidi) {
                this.documentEditor.editorModule.applyRulerMarkerValues('rightIndent', this.indentInitialValue, finalValue);
            } else {
                this.documentEditor.editorModule.applyRulerMarkerValues('rightIndent', finalValue, this.indentInitialValue);
            }
            this.indentInitialValue = finalValue;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
            lineSvg.style.display = 'none';
        }
    }

    private onTabStopMouseDown(e: MouseEvent): void {
        e.stopPropagation();
        this.isDraggingForTab = true;
        this.tabStopOffset = e.clientX - this.tabStopElement.getBoundingClientRect().left;
        this.tabInitialValue = HelperMethods.getNumberFromString(this.tabStopElement.style.left);
        this.tabIndex = parseInt(this.tabStopElement.id.split('_')[this.tabStopElement.id.split('_').length - 1], 10);
        this.currentTabStop = this.currrentParagraph.paragraphFormat.tabs[parseInt(this.tabIndex.toString(), 10)];
        this.currentTabStopElement = this.tabStopElement;
        let rulerZeroPoint: number = HelperMethods.convertPointToPixel(
            1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin)
            * this.documentEditor.zoomFactor;
        if (this.documentEditor.layoutType === 'Continuous') {
            rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) - 20;
            if (this.position.paragraph.paragraphFormat.bidi) {
                rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor)
                    - 20 - (this.documentEditor.viewer.clientArea.width * this.documentEditor.zoomFactor);
            }
        }
        const value: number = rulerZeroPoint + e.clientX - this.tabStopOffset - this.hRuler.getBoundingClientRect().left;
        let startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.x;
        startValue = this.documentEditor.layoutType === 'Continuous' ? 0 : startValue;
        const indicatorLineValue: number = startValue + (value - rulerZeroPoint);
        const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
        lineSvg.style.left = indicatorLineValue + 'px';
        lineSvg.style.display = 'block';
    }

    private onTabStopMouseUp(e: MouseEvent): void {
        if (!isNullOrUndefined(this.currentTabStopElement)) {
            this.currentTabStopElement = undefined;
        }
    }

    private onTabStopMouseMove(e: MouseEvent): void {
        if (this.isDraggingForTab) {
            let rulerZeroPoint: number;
            if (this.documentEditor.layoutType === 'Continuous') {
                rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) - 20;
                if (this.position.paragraph.paragraphFormat.bidi) {
                    rulerZeroPoint = (this.documentEditor.hRuler.zeroPosition * this.documentEditor.zoomFactor) -
                        20 - (this.documentEditor.viewer.clientArea.width * this.documentEditor.zoomFactor);
                }
            } else if (this.documentEditor.layoutType === 'Pages') {
                rulerZeroPoint = HelperMethods.convertPointToPixel(1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin)
                    * this.documentEditor.zoomFactor;
                if (this.position.paragraph.bidi) {
                    rulerZeroPoint = HelperMethods.convertPointToPixel(
                        1584 + this.documentEditor.selectionModule.sectionFormat.rightMargin
                        - this.documentEditor.selectionModule.sectionFormat.pageWidth) * this.documentEditor.zoomFactor;
                }
            }
            let value: number = rulerZeroPoint + e.clientX - this.tabStopOffset - this.hRuler.getBoundingClientRect().left;
            let minValue: number = rulerZeroPoint;
            const rightIndent: HTMLElement = document.getElementById(this.documentEditor.element.id + '_rightIndent');
            const rightIndentValue: number = HelperMethods.getNumberFromString(rightIndent.style.left);
            let maxValue: number = rightIndentValue;
            const leftIndent: HTMLElement = document.getElementById(this.documentEditor.element.id + '_leftIndent');
            const leftIndentValue: number = HelperMethods.getNumberFromString(leftIndent.style.left);
            minValue = leftIndentValue;
            if (this.position.paragraph.paragraphFormat.bidi) {
                minValue = rightIndentValue;
                maxValue = leftIndentValue;
            }
            if (this.justification === 'CenterTab' || this.justification === 'DecimalTab') {
                maxValue += 4;
            }
            else if (this.justification === 'RightTab') {
                maxValue += 5.5;
            }
            else {
                maxValue += 1.5;
            }
            if (value < minValue) {
                value = minValue;
            } else if (value > maxValue) {
                value = maxValue;
            }
            this.tabStopElement.style.left = value + 'px';
            let startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.x;
            startValue = this.documentEditor.layoutType === 'Continuous' ? 0 : startValue;
            const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
            lineSvg.style.left = indicatorLineValue + 'px';
        }
    }

    private onRenderTabStopMouseUp(e: MouseEvent): void {
        if (this.isDraggingForTab && !isNullOrUndefined(this.currentTabStop)) {
            if (!isNullOrUndefined(this.currentTabStopElement) && this.currentTabStopElement.style.display === 'none') {
                this.documentEditor.editorModule.removeTabStops([this.currrentParagraph], [this.currentTabStop]);
                this.currentTabStopElement.parentNode.removeChild(this.currentTabStopElement);
            } else {
                let finalValue: number = HelperMethods.getNumberFromString(this.tabStopElement.style.left);
                this.tabInitialValue = finalValue;
                this.documentEditor.editorModule.removeTabStops([this.currrentParagraph], [this.currentTabStop]);
                finalValue = HelperMethods.convertPixelToPoint(finalValue / this.documentEditor.zoomFactor) - 1584;
                finalValue = this.currrentParagraph.paragraphFormat.bidi ? finalValue * -1 : finalValue;
                this.currentTabStop.position = finalValue;
                this.documentEditor.editorModule.updateTabStopCollection(this.currrentParagraph, [this.currentTabStop]);
            }
            this.updateTabStopMarkers(this.documentEditor);
            this.isDraggingForTab = false;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
            lineSvg.style.display = 'none';
            this.currentTabStopElement = undefined;
        }
    }

    private onTabStopDblClick(event: MouseEvent): void {
        this.documentEditor.showTabDialog();
        event.stopPropagation();
    }
    /**
     * @private
     */
    public hideTabStopSwitch(show: boolean): void {
        if (this.tabStopStwitch) {
            this.showHideElement(show, this.tabStopStwitch);
        }
    }
    /**
     * @private
     */
    public hideRulerBottom(show: boolean): void {
        if (this.hRulerBottom) {
            this.showHideElement(show, this.hRulerBottom);
        }
        if (this.vRulerBottom) {
            this.showHideElement(show, this.vRulerBottom);
        }
    }
    private showHideElement(show: boolean, element: HTMLElement): void {
        if (show) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }
    /* eslint-enable */
    /**
     * createHtmlElement method \
     *
     * @returns {SVGSVGElement} createHtmlElement method .\
     * @param { string } elementType - provide the diagramId  value.
     * @param { Object } attribute - provide the diagramId  value.
     * @private
     */
    public createHtmlElement(elementType: string, attribute: Object): HTMLElement {
        const element: HTMLElement = createElement(elementType, attribute);
        this.setAttributeHtml(element, attribute);
        return element;
    }

    /**
     * createSvgElement method \
     *
     * @returns {SVGSVGElement} createSvgElement method .\
     * @param { string } elementType - provide the elementType  value.
     * @param { Object } attribute - provide the attribute  value.
     * @private
     */
    public createSvgElement(elementType: string, attribute: Object): SVGElement {
        const element: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', elementType);
        this.setAttributeSvg(element, attribute);
        return element;
    }

    /**
     * applyStyleAgainstCsp method   \
     *
     * @returns {void} applyStyleAgainstCsp method .\
     * @param { SVGElement } svg - provide the svg  value.
     * @param { string } attributes - provide the boolean  value.
     * @private
     */
    public applyStyleAgainstCsp(svg: SVGElement | HTMLElement, attributes: string): void {
        const keys: string[] = attributes.split(';');
        for (let i: number = 0; i < keys.length; i++) {
            const attribute: string[] = keys[parseInt(i.toString(), 10)].split(':');
            if (attribute.length === 2) {
                svg.style[attribute[0].trim()] = attribute[1].trim();
            }
        }
    }
    /**
     * setAttributeSvg method.
     *
     * @returns {void} setAttributeSvg method .\
     * @param { SVGElement } svg - provide the svg  value.
     * @param { Object } attributes - provide the boolean  value.
     * @private
     */
    public setAttributeSvg(svg: SVGElement, attributes: Object): void {
        const keys: string[] = Object.keys(attributes);
        for (let i: number = 0; i < keys.length; i++) {
            // Added below condition to check whether svg is undefined or not
            if (svg && keys[parseInt(i.toString(), 10)] !== 'style') {
                svg.setAttribute(keys[parseInt(i.toString(), 10)], attributes[keys[parseInt(i.toString(), 10)]]);
            } else {
                this.applyStyleAgainstCsp(svg, attributes[keys[parseInt(i.toString(), 10)]]);
            }
        }
    }

    /**
     * setAttributeHtml method   \
     *
     * @returns {void} setAttributeHtml method .\
     * @param { HTMLElement } element - provide the svg  value.
     * @param { Object } attributes - provide the boolean  value.
     * @private
     */
    public setAttributeHtml(element: HTMLElement, attributes: Object): void {
        const keys: string[] = Object.keys(attributes);
        for (let i: number = 0; i < keys.length; i++) {
            if (keys[parseInt(i.toString(), 10)] !== 'style') {
                element.setAttribute(keys[parseInt(i.toString(), 10)], attributes[keys[parseInt(i.toString(), 10)]]);
            } else {
                this.applyStyleAgainstCsp(element, attributes[keys[parseInt(i.toString(), 10)]]);
            }
        }
    }
    /**
     * renderOverlapElement method \
     *
     * @returns {void} renderOverlapElement method .\
     * @param { DocumentEditor} documentEditor - provide the content  value.
     * @private
     */
    public renderOverlapElement(documentEditor: DocumentEditor): HTMLElement {
        const rulerSize: Size = this.getRulerSize(documentEditor);
        const attributes: Object = {
            'id': documentEditor.element.id + '_overlapRuler',
            style: 'height:' + rulerSize.height + 'px;width:' + rulerSize.width + 'px;position:absolute;margin-left:0;margin-top:0;diplay:none',
            class: 'e-ruler-overlap'
        };
        this.overlap = this.createHtmlElement('div', attributes);
        const element: HTMLElement = document.getElementById(documentEditor.element.id + '_viewerContainer');
        element.insertBefore(this.overlap, element.firstChild);
        return this.overlap;
    }
    public renderRulerMarkerIndicatorElement(documentEditor: DocumentEditor): void {
        if (!documentEditor.enableSelection) {
            return;
        }
        const rulerSize: Size = this.getRulerSize(documentEditor);
        const attributes: Object = {
            'id': documentEditor.element.id + '_markIndicator',
            style: 'height:' + rulerSize.height + 'px;width:' + rulerSize.width + 'px;position:absolute;margin-left:0;margin-top:0;z-index:5;border:1px solid #ccc;display:' + (documentEditor.layoutType === 'Pages' ? 'block;' : 'none;'),
            class: 'e-de-ruler-markIndicator'
        };
        this.markIndicator = this.createHtmlElement('div', attributes);
        this.tabStopStwitch = this.markIndicator;
        const element: HTMLElement = document.getElementById(documentEditor.element.id + '_viewerContainer');
        element.insertBefore(this.markIndicator, element.firstChild);
        const ownerId: string = documentEditor.element.id;
        this.firstLineIndentRuler = document.getElementById(ownerId + '_firstLineIndent').cloneNode(true) as HTMLElement;
        this.hangingIndentRuler = document.getElementById(ownerId + '_hangingIndent').cloneNode(true) as HTMLElement;
        this.firstLineIndentRuler.style.left = '1px';
        this.firstLineIndentRuler.style.top = rulerSize.height / 2 - 3 + 'px';
        this.firstLineIndentRuler.style.display = 'none';
        this.firstLineIndentRuler.classList.add('e-de-ruler-marker');
        this.firstLineIndentRuler.setAttribute('id', ownerId + '_firstLineIndent_-1');
        this.hangingIndentRuler.style.left = '1px';
        this.hangingIndentRuler.style.top = rulerSize.height / 2 - 3 + 'px';
        this.hangingIndentRuler.style.display = 'none';
        this.hangingIndentRuler.classList.add('e-de-ruler-marker');
        this.hangingIndentRuler.setAttribute('id', ownerId + '_hangingIndent_-1');
        this.markIndicator.appendChild(this.hangingIndentRuler);
        this.markIndicator.appendChild(this.firstLineIndentRuler);
        const justification: string[] = ['Left', 'Center', 'Right', 'Decimal', 'Bar'];
        const locale: L10n = new L10n('documenteditor', documentEditor.defaultLocale);
        locale.setLocale(documentEditor.locale);
        for (let i: number = 0; i < 5; i++) {
            this.renderTab(documentEditor, rulerSize, undefined, justification[parseInt(i.toString(), 10)] as TabJustification, -1, locale);
            const element: HTMLElement = document.getElementById(documentEditor.element.id + '_' + justification[parseInt(i.toString(), 10)] + 'Tab_-1');
            if (!isNullOrUndefined(element)) {
                element.classList.remove('e-de-ruler-tab');
                element.classList.add('e-de-ruler-marker');
                element.style.display = i === 0 ? 'block' : 'none';
                element.style.position = 'absolute';
                element.style.margin = '4px 3px';
                this.markIndicator.appendChild(element);
            }

        }

        this.markIndicator.addEventListener('click', this.onmarkIndicatorClickHandler);

    }
    private rulerGeometry: Size;
    private isTopRulerMargin: boolean = false;
    private initialYValue: number;
    private currentScrollTop: number;
    private firstLineOffset: number;
    /**
     * renderRuler method \
     *
     * @returns {void} renderRuler method .\
     * @param { DocumentEditor} documentEditor - provide the content  value.
     * @param { boolean} isHorizontal - provide the content  value.
     * @private
     */
    public renderRuler(documentEditor: DocumentEditor, isHorizontal: boolean): void {
        this.documentEditor = documentEditor;
        if (!documentEditor.enableSelection) {
            return;
        }
        this.rulerDiv = document.getElementById(documentEditor.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
        const rulerSize: Size = this.getRulerSize(documentEditor);
        this.rulerGeometry = this.getRulerGeometry(documentEditor);
        const height: number = isHorizontal ? documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.x
            : (documentEditor.selectionModule.getPageTop(documentEditor.selectionModule.end.paragraph.bodyWidget.page));
        const margin: string = isHorizontal ? ('margin-left:' + height + 'px;') : ('margin-top:' + height + 'px;');
        if (documentEditor.selectionModule.isForward) {
            this.position = documentEditor.selectionModule.start;
        } else {
            this.position = documentEditor.selectionModule.end;
        }
        // const margin: string = isHorizontal ? ('margin-left:' + (pixelsToPoints(documentEditor.selection.end.paragraph.bodyWidget.page.boundingRectangle.x)) + 'px;') : ('margin-top:' + rulerSize.height + 'px;');
        if (!this.rulerDiv) {
            const style: string = 'height:' + (isHorizontal ? rulerSize.height : this.rulerGeometry.height) + 'px;overflow:hidden;width:' +
                (isHorizontal ? this.rulerGeometry.width : rulerSize.width) + 'px;position:absolute;font-size:9px;text-align: left;z-index: 4;user-select:none;' + margin;
            const attributes: Object = {
                'id': documentEditor.element.id + (isHorizontal ? '_hRuler' : '_vRuler'),
                style: style, class: (isHorizontal ? 'e-de-hRuler' : 'e-de-vRuler')
            };
            this.rulerDiv = this.createHtmlElement('div', attributes);
        }
        this.rulerDiv.addEventListener('dblclick', this.onRulerDblClickHandler);
        const pageElement: HTMLElement = document.getElementById(documentEditor.element.id + '_pageContainer');
        const style: string = 'height:' + (isHorizontal ? rulerSize.height : pageElement.getBoundingClientRect().height) + 'px;overflow:hidden;width:' +
            (isHorizontal ? pageElement.getBoundingClientRect().width : rulerSize.width) + 'px;position:absolute;z-index: 3;';
        const attributes: Object = {
            'id': documentEditor.element.id + (isHorizontal ? '_hRulerBottom' : '_vRulerBottom'),
            style: style, class: (isHorizontal ? 'e-de-hRuler' : 'e-de-vRuler')
        };
        this.rulerOverlap = this.createHtmlElement('div', attributes);
        // isHorizontal ? (this.hRulerBottom = overlap) : (this.vRulerBottom = overlap);
        if (isHorizontal) {
            this.hRulerBottom = this.rulerOverlap;
        }
        else {
            this.vRulerBottom = this.rulerOverlap;
        }
        const parentElement: HTMLElement = document.getElementById(documentEditor.element.id + '_viewerContainer');
        parentElement.insertBefore(this.rulerOverlap, parentElement.firstChild);
        const element: HTMLElement = isHorizontal ? document.getElementById(documentEditor.element.id + '_hRulerBottom') : document.getElementById(documentEditor.element.id + '_vRulerBottom');
        element.insertBefore(this.rulerDiv, element.firstChild);
        this.renderRulerMargins(documentEditor, isHorizontal, this.rulerDiv);
        //const documentEditorRuler: DocumentEditorRulerModel = isHorizontal ? documentEditor.documentEditorSettings.rulerSettings.horizontalRuler : documentEditor.documentEditorSettings.rulerSettings.verticalRuler;
        const ruler: Ruler = new Ruler(this.rulerDiv, this);
        ruler.orientation = isHorizontal ? 'Horizontal' : 'Vertical';
        this.updateMargin(ruler, documentEditor, isHorizontal);
        // ruler.pageWidth = documentEditor.selection.end.paragraph.bodyWidget.page.boundingRectangle.width;
        // ruler.pageHeight = documentEditor.selection.end.paragraph.bodyWidget.page.boundingRectangle.height;
        // ruler.length = (isHorizontal ? rulerGeometry.width : rulerGeometry.height) + documentEditorRuler.segmentWidth;
        ruler.length = ruler.zeroPosition * 2;
        ruler.appendTo();
        // eslint-disable-next-line
        isHorizontal ? documentEditor.hRuler = ruler : documentEditor.vRuler = ruler;
        this.updateRulerPosition(documentEditor, isHorizontal);
        const rulerObj: HTMLElement = document.getElementById(documentEditor.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
        // eslint-disable-next-line
        isHorizontal ? documentEditor.hRuler.element = rulerObj : documentEditor.vRuler.element = rulerObj;
        if (rulerObj) {
            // Set the scrollLeft property to the desired value (e.g., 100 pixels)
            if (isHorizontal) {
                rulerObj.scrollLeft = ruler.zeroPosition -
                    HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin);
            } else {
                rulerObj.scrollTop = ruler.zeroPosition -
                    HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin);
            }

        }
        this.locale = new L10n('documenteditor', documentEditor.defaultLocale);
        if (isHorizontal) {
            this.renderIndents(documentEditor, isHorizontal, rulerSize, this.rulerGeometry, this.locale);
        }
        this.hRuler = document.getElementById(documentEditor.element.id + '_hRuler');
        if (isHorizontal) {
            document.addEventListener('mousemove', this.onHorizontalRulerMouseMoveHandler);
            this.hRuler.addEventListener('mouseenter', this.onHRulerMouseEnterHandler);
            this.hRuler.addEventListener('mouseleave', this.onHRulerMouseLeaveHandler);
            this.hRuler.addEventListener('mousedown', this.onHRulerMouseDownHandler);
            this.hRuler.addEventListener('mouseup', this.onHRulerMouseUpHandler);

            document.addEventListener('mouseup', this.onRulerMouseUpHandler);

        }
        //Vertical Ruler Resizing

        this.vRuler = document.getElementById(documentEditor.element.id + '_vRuler');
        this.isTopRulerMargin = false;
        if (!isHorizontal) {
            document.addEventListener('mousemove', this.onVMouseMoveHandler);
            this.vRuler.addEventListener('mousedown', this.onVMouseDownHandler);

            document.addEventListener('mouseup', this.onVMouseUpHandler);

        }
    }
    private updateHRulerCursor(leftMargin: number, rightMargin: number, mouseXRelativeToDiv: number, clientX: number): void {
        if (!this.isDraggingRender) {
            if (this.documentEditor.isOnIndent) {
                this.setDefaultCursor();
                this.resizerEnabled = false;
            } else if ((leftMargin - 3 <= mouseXRelativeToDiv) && (leftMargin + 3 >= mouseXRelativeToDiv)) {
                if (this.documentEditor.layoutType === 'Pages') {
                    this.setResizeCursor(this.locale.getConstant('Left Margin'));
                    this.resizerEnabled = true;
                    this.isLeftRulerMargin = true;
                }
            } else if ((rightMargin - 3 <= mouseXRelativeToDiv) && (rightMargin + 3 >= mouseXRelativeToDiv)) {
                if (this.documentEditor.layoutType === 'Pages') {
                    this.setResizeCursor(this.locale.getConstant('Right Margin'));
                    this.resizerEnabled = true;
                    this.isLeftRulerMargin = false;
                }
            } else if (this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.columns.length > 0) {
                const columns: WColumnFormat[] = this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.columns;
                if (this.documentEditor.layoutType === 'Pages') {
                    for (let i: number = 1; i <= columns.length; i++) {
                        const rulerMarginDiv: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_Margin' + i);
                        const marginLeft: number = rulerMarginDiv.getBoundingClientRect().left;
                        const width: number = rulerMarginDiv.getBoundingClientRect().width;
                        if ((marginLeft - 3 <= clientX) && (marginLeft + 3 >= clientX)) {
                            this.setResizeCursor(this.locale.getConstant('Left Margin'));
                            this.multiColumnElement = rulerMarginDiv;
                            this.isLeftMultiColumn = true;
                            this.resizerEnabled = true;
                            break;
                        } else if ((marginLeft + width - 3 <= clientX) && (marginLeft + width + 3 >= clientX)) {
                            this.setResizeCursor(this.locale.getConstant('Right Margin'));
                            this.multiColumnElement = rulerMarginDiv;
                            this.isRightMultiColumn = true;
                            this.resizerEnabled = true;
                            break;
                        } else {
                            this.setDefaultCursor();
                            this.isLeftMultiColumn = false;
                            this.isRightMultiColumn = false;
                            this.resizerEnabled = false;
                        }
                    }
                }
            } else {
                this.setDefaultCursor();
                this.resizerEnabled = false;
            }
        }
    }
    private setResizeCursor(title: string): void {
        this.hRuler.style.cursor = 'e-resize';
        this.hRuler.setAttribute('title', title);
    }
    private setDefaultCursor(): void {
        this.hRuler.style.cursor = 'default';
        if (this.hRuler.hasAttribute('title')) {
            this.hRuler.removeAttribute('title');
        }
    }
    public onHorizontalRulerMouseMoved(e: MouseEvent): void {
        if (this.documentEditor.isDestroyed || !this.documentEditor.documentEditorSettings.showRuler) {
            return;
        }
        const divRect: DOMRect = this.hRuler.getBoundingClientRect() as DOMRect;
        const leftMargin: number = this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin
            * this.documentEditor.zoomFactor;
        const rightMargin: number = (HelperMethods.convertPixelToPoint(divRect.width) -
        this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin * this.documentEditor.zoomFactor);
        let pixelValue: number = Math.round(e.clientX - divRect.left);
        let mouseXRelativeToDiv: number = HelperMethods.convertPixelToPoint(pixelValue);
        this.updateHRulerCursor(leftMargin, rightMargin, mouseXRelativeToDiv, e.clientX);
        if (this.isDraggingRender) {
            const rulerZeroPoint: number = HelperMethods.convertPointToPixel(
                1584 - this.documentEditor.selectionModule.sectionFormat.leftMargin) * this.documentEditor.zoomFactor;
            const pageWidth: number = this.documentEditor.selectionModule.sectionFormat.pageWidth;
            const rightMarginValue: number = this.documentEditor.selectionModule.sectionFormat.rightMargin;
            let rightIndentValue: number = this.documentEditor.selectionModule.paragraphFormat.rightIndent;
            rightIndentValue = rightIndentValue > 0 ? rightIndentValue : 0;
            const minimumValue: number = 42;
            let firstLineIndent: number = this.documentEditor.selectionModule.paragraphFormat.firstLineIndent;
            const leftMarginValue: number = this.documentEditor.selectionModule.sectionFormat.leftMargin;
            firstLineIndent = firstLineIndent >= 0 ? firstLineIndent : 0;
            const leftIndent: number = this.documentEditor.selectionModule.paragraphFormat.leftIndent;
            if (this.isLeftRulerMargin) {
                const leftMaxLimit: number = rulerZeroPoint + (
                    HelperMethods.convertPointToPixel(pageWidth - rightMarginValue -
                        rightIndentValue - minimumValue - firstLineIndent - leftIndent) * this.documentEditor.zoomFactor);
                const leftMinLimit: number = rulerZeroPoint;
                if (pixelValue + rulerZeroPoint > leftMaxLimit) {
                    pixelValue = leftMaxLimit - rulerZeroPoint;
                    mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                } else if (pixelValue + rulerZeroPoint < leftMinLimit) {
                    pixelValue = leftMinLimit - rulerZeroPoint;
                    mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                }
            } else {
                const rightMinLimit: number = rulerZeroPoint + (HelperMethods.convertPointToPixel(
                    leftMarginValue + leftIndent + firstLineIndent + minimumValue + rightIndentValue) * this.documentEditor.zoomFactor);
                const rightMaxLimit: number = rulerZeroPoint + (HelperMethods.convertPointToPixel(
                    pageWidth) * this.documentEditor.zoomFactor);
                if (pixelValue + rulerZeroPoint > rightMaxLimit) {
                    pixelValue = rightMaxLimit - rulerZeroPoint;
                    mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                } else if (pixelValue + rulerZeroPoint < rightMinLimit) {
                    pixelValue = rightMinLimit - rulerZeroPoint;
                    mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                }
            }
            this.finalmouseXRelativeToDiv = mouseXRelativeToDiv;
            const currentRightMargin: number = (HelperMethods.convertPixelToPoint(divRect.width)
                - (this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin
                    * this.documentEditor.zoomFactor));
                /* eslint-disable-next-line max-len */
            if (this.documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.numberOfColumns <= 1 && this.isHorizontalScroll) {
                /* eslint-disable-next-line max-len */
                this.resizeRulerMargins(this.isLeftRulerMargin, this.renderInitialValue, this.currentScrollLeft, currentRightMargin, this.hRuler, mouseXRelativeToDiv, true, this.documentEditor);
            }
            const rightIndent: HTMLElement = document.getElementById(this.documentEditor.element.id + '_rightIndent');
            if (this.isLeftRulerMargin) {
                const difference: number = mouseXRelativeToDiv - this.renderInitialValue;
                rightIndent.style.left = (this.initialRightMargin - HelperMethods.convertPointToPixel(difference)) + 'px';
            } else {
                const difference: number = mouseXRelativeToDiv - this.renderInitialValue;
                rightIndent.style.left = (this.initialRightMargin + HelperMethods.convertPointToPixel(difference)) + 'px';
            }
            const startValue: number = this.documentEditor.documentHelper.currentPage.boundingRectangle.x;
            const indicatorLineValue: number = startValue + pixelValue;
            const lineSvg: HTMLElement = document.getElementById(this.documentEditor.element.id + '_hRuler_indicator_svg');
            lineSvg.style.left = indicatorLineValue + 'px';
        }
    }
    public updateRulerPosition(documentEditor: DocumentEditor, isHorizontal: boolean): void {
        const rulerObj: HTMLElement = document.getElementById(documentEditor.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
        // eslint-disable-next-line
        isHorizontal ? documentEditor.hRuler.element = rulerObj : documentEditor.vRuler.element = rulerObj;
        if (rulerObj) {
            // Set the scrollLeft property to the desired value (e.g., 100 pixels)
            rulerObj.scrollLeft = 2112 - HelperMethods.convertPointToPixel(
                documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin);
        }
    }

    public updateIndicatorLines(documentEditor: DocumentEditor): void {
        const hRulerSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
        const hRulerLine: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator');
        const vRulerSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler_indicator_svg');
        const vRulerLine: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler_indicator');

        const pageContainer: HTMLElement = document.getElementById(documentEditor.element.id + '_pageContainer');
        const pageData: DOMRect = pageContainer.getBoundingClientRect() as DOMRect;
        const pageHeight: number = pageData.height;
        const pageWidth: number = pageData.width;

        hRulerSvg.style.height = pageHeight + 'px';
        hRulerLine.setAttribute('y2', `${pageHeight}`);
        vRulerSvg.style.width = pageWidth + 'px';
        vRulerLine.setAttribute('x2', `${pageWidth}`);
    }

    public createIndicatorLines(documentEditor: DocumentEditor): void {
        if (!documentEditor.enableSelection) {
            return;
        }
        const viewerContainer: HTMLElement = document.getElementById(documentEditor.element.id + '_viewerContainer');
        const pageContainer: HTMLElement = document.getElementById(documentEditor.element.id + '_pageContainer');
        // let container = document.getElementById(documentEditor.element.id);
        const data: DOMRect = viewerContainer.getBoundingClientRect() as DOMRect;
        const pageData: DOMRect = pageContainer.getBoundingClientRect() as DOMRect;
        const pageHeight: number = pageData.height;
        const pageWidth: number = pageData.width;

        this.hRuler = document.getElementById(documentEditor.element.id + '_hRuler');
        const hSvgAttr: Object = {
            id: documentEditor.element.id + '_hRuler_indicator_svg',
            width: 0.5 + 'px',
            height: pageHeight + 'px',
            style: 'position:absolute;z-index:1;display:none;'
        };
        this.hSvg = this.createSvgElement('svg', hSvgAttr);
        const verticalLineAttr: Object = { 'x1': 0, 'y1': this.hRuler.getBoundingClientRect().height + 5, 'x2': 0, 'y2': pageHeight, 'stroke-width': 0.5, 'stroke': 'black' };
        this.vLine = this.createSvgElement('line', verticalLineAttr);
        this.vLine.setAttribute('id', documentEditor.element.id + '_hRuler_indicator');
        this.hSvg.appendChild(this.vLine);
        viewerContainer.insertBefore(this.hSvg, viewerContainer.firstChild);

        const vRuler: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler');
        const vSvgAttr: Object = {
            id: documentEditor.element.id + '_vRuler_indicator_svg',
            width: pageWidth + 'px',
            height: 0.5 + 'px',
            style: 'position:absolute;z-index:1;display:none;'
        };
        this.vSvg = this.createSvgElement('svg', vSvgAttr);
        const horizontalLineAttr: Object = { 'x1': vRuler.getBoundingClientRect().width + 5, 'y1': 0, 'x2': pageWidth, 'y2': 0, 'stroke-width': 0.5, 'stroke': 'black' };
        this.hLine = this.createSvgElement('line', horizontalLineAttr);
        this.hLine.setAttribute('id', documentEditor.element.id + '_vRuler_indicator');
        this.vSvg.appendChild(this.hLine);
        viewerContainer.insertBefore(this.vSvg, viewerContainer.firstChild);
    }
    public updateIndentMarkers(documentEditor: DocumentEditor): void {
        if (isNullOrUndefined(documentEditor) || isNullOrUndefined(documentEditor.element)
            || isNullOrUndefined(documentEditor.element.id) || isNullOrUndefined(documentEditor.hRuler)
            || isNullOrUndefined(documentEditor.hRuler.zeroPosition)) {
            return;
        }
        let indent: HTMLElement = undefined;
        const ownerId: string = documentEditor.element.id;
        let rulerZeroPoint: number = HelperMethods.convertPointToPixel(1584 - documentEditor.selectionModule.sectionFormat.leftMargin);
        let currentIndentValue: number;
        let finalValue: number;
        let currentMargin: number;
        let pixelValue: string;
        // if (documentEditor.selection.end.paragraph.isInsideTable) {
        //     currentIndentValue = documentEditor.selection.paragraphFormat.leftIndent;
        //     currentMargin = documentEditor.selection.sectionFormat.leftMargin;
        //     finalValue = HelperMethods.convertPointToPixel(currentIndentValue) + currentCell.x;
        //     pixelValue = (((rulerZeroPoint + ((finalValue))) * documentEditor.zoomFactor)) + 'px';

        //     indent = document.getElementById(ownerId + '_leftIndent');
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        //     indent = document.getElementById(ownerId + '_hangingIndent');
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        //     indent = document.getElementById(ownerId + '_firstLineIndent');
        //     currentIndentValue = documentEditor.selection.paragraphFormat.firstLineIndent;
        //     currentMargin = documentEditor.selection.paragraphFormat.leftIndent;
        //     finalValue = HelperMethods.convertPointToPixel(currentIndentValue + currentMargin) + currentCell.x;
        //     pixelValue = (((rulerZeroPoint + ((finalValue))) * documentEditor.zoomFactor)) + 'px';
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        //     indent = document.getElementById(ownerId + '_rightIndent');
        //     currentIndentValue = documentEditor.selection.paragraphFormat.rightIndent;
        //     currentMargin = documentEditor.selection.sectionFormat.rightMargin;
        //     finalValue = (currentCell.x + currentCell.width) - HelperMethods.convertPointToPixel(currentIndentValue);
        //     pixelValue = ((rulerZeroPoint + finalValue - 2) * documentEditor.zoomFactor) + 'px';
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        // }
        // else {
        //     indent = document.getElementById(ownerId + '_leftIndent');
        //     currentIndentValue = documentEditor.selection.paragraphFormat.leftIndent;
        //     currentMargin = documentEditor.selection.sectionFormat.leftMargin;
        //     finalValue = currentMargin + currentIndentValue;
        //     pixelValue = (((rulerZeroPoint + (HelperMethods.convertPointToPixel(finalValue))) * documentEditor.zoomFactor) - 6) + 'px';
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        //     indent = document.getElementById(ownerId + '_hangingIndent');
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        //     indent = document.getElementById(ownerId + '_firstLineIndent');
        //     currentIndentValue = documentEditor.selection.paragraphFormat.firstLineIndent;
        //     let leftIndent = documentEditor.selection.paragraphFormat.leftIndent;
        //     let leftMargin = documentEditor.selection.sectionFormat.leftMargin;
        //     if (currentIndentValue < 0 && leftIndent < 0) {
        //         currentIndentValue = currentIndentValue < 0 ? 0 : currentIndentValue;
        //     }
        //     finalValue = leftMargin + leftIndent + currentIndentValue;
        //     pixelValue = (((rulerZeroPoint + HelperMethods.convertPointToPixel(finalValue)) * documentEditor.zoomFactor) - 6) + 'px';
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        //     indent = document.getElementById(ownerId + '_rightIndent');
        //     currentIndentValue = documentEditor.selection.paragraphFormat.rightIndent;
        //     currentMargin = documentEditor.selection.sectionFormat.rightMargin;
        //     finalValue = documentEditor.selection.sectionFormat.pageWidth - (currentIndentValue + currentMargin);
        //     pixelValue = (((rulerZeroPoint + HelperMethods.convertPointToPixel(finalValue)) * documentEditor.zoomFactor) - 6) + 'px';
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        // }
        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
        if (this.position.paragraph.paragraphFormat.bidi || (this.position.paragraph.isInsideTable
            && this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi)) {
            const rulerMarginDivWidth: number = ((rulerGeometry.width / documentEditor.zoomFactor) -
                (HelperMethods.convertPointToPixel((this.position.paragraph.bodyWidget.sectionFormat.rightMargin)
                    + (this.position.paragraph.bodyWidget.sectionFormat.leftMargin))));
            rulerZeroPoint -= rulerMarginDivWidth;
        }

        const paraStart: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['x'].toString()) : this.position.paragraph.x;
        const paraWidth: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['width'].toString()) : this.position.paragraph.width;

        let finalValueTemp: number;
        if (this.position.paragraph.paragraphFormat.bidi) {
            rulerZeroPoint = HelperMethods.convertPointToPixel(
                1584 - documentEditor.selectionModule.sectionFormat.leftMargin -
                (documentEditor.selectionModule.sectionFormat.pageWidth -
                    documentEditor.selectionModule.sectionFormat.leftMargin -
                    documentEditor.selectionModule.sectionFormat.rightMargin));
        }
        const leftIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_leftIndent');
        const rightIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_rightIndent');
        if (this.position.paragraph.paragraphFormat.bidi) {
            leftIndent.setAttribute('title', this.locale.getConstant('Right Indent'));
            rightIndent.setAttribute('title', this.locale.getConstant('Left Indent'));
            finalValueTemp = rulerZeroPoint + paraStart + paraWidth;
        } else {
            leftIndent.setAttribute('title', this.locale.getConstant('Left Indent'));
            rightIndent.setAttribute('title', this.locale.getConstant('Right Indent'));
            finalValueTemp = rulerZeroPoint + paraStart;
        }
        const firstLineIndent: number = this.position.paragraph.paragraphFormat.firstLineIndent;
        indent = document.getElementById(ownerId + '_leftIndent');
        if (!isNullOrUndefined(indent)) {
            if (documentEditor.layoutType === 'Pages') {
                indent.style.left = ((finalValueTemp * documentEditor.zoomFactor) - 6) + 'px';
            } else if (documentEditor.layoutType === 'Continuous') {
                if (this.position.paragraph.paragraphFormat.bidi) {
                    rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                        20 - documentEditor.viewer.clientArea.width;
                    finalValueTemp = rulerZeroPoint + paraStart + paraWidth;
                    indent.style.left = finalValueTemp + 'px';
                } else {
                    rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                    finalValueTemp = rulerZeroPoint + (paraStart * documentEditor.zoomFactor);
                    indent.style.left = finalValueTemp + 'px';
                }
            }
        }
        indent = document.getElementById(ownerId + '_hangingIndent');
        if (!isNullOrUndefined(indent)) {
            if (documentEditor.layoutType === 'Pages') {
                indent.style.left = ((finalValueTemp * documentEditor.zoomFactor) - 6) + 'px';
            } else if (documentEditor.layoutType === 'Continuous') {
                if (this.position.paragraph.paragraphFormat.bidi) {
                    rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                        20 - documentEditor.viewer.clientArea.width;
                    finalValueTemp = rulerZeroPoint + paraStart + paraWidth;
                    indent.style.left = finalValueTemp + 'px';
                } else {
                    rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                    finalValueTemp = rulerZeroPoint + (paraStart * documentEditor.zoomFactor);
                    indent.style.left = finalValueTemp + 'px';
                }
            }
        }
        indent = document.getElementById(ownerId + '_firstLineIndent');
        if (documentEditor.layoutType === 'Pages') {
            if (!isNullOrUndefined(indent)) {
                if (this.position.paragraph.paragraphFormat.bidi) {
                    indent.style.left = (((finalValueTemp - HelperMethods.convertPointToPixel(firstLineIndent)) * documentEditor.zoomFactor) - 6) + 'px';
                } else {
                    indent.style.left = (((finalValueTemp + HelperMethods.convertPointToPixel(firstLineIndent)) * documentEditor.zoomFactor) - 6) + 'px';
                }
            }
        } else if (documentEditor.layoutType === 'Continuous') {
            if (this.position.paragraph.paragraphFormat.bidi) {
                rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                    20 - documentEditor.viewer.clientArea.width;
                finalValueTemp = rulerZeroPoint + paraStart + paraWidth - (HelperMethods.convertPointToPixel(
                    firstLineIndent) * documentEditor.zoomFactor);
            } else {
                rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                finalValueTemp = rulerZeroPoint + ((paraStart + HelperMethods.convertPointToPixel(
                    firstLineIndent)) * documentEditor.zoomFactor);
            }
            indent.style.left = finalValueTemp + 'px';
        }
        indent = document.getElementById(ownerId + '_rightIndent');
        if (documentEditor.layoutType === 'Pages') {
            if (this.position.paragraph.paragraphFormat.bidi) {
                finalValueTemp = rulerZeroPoint + paraStart;
            } else {
                finalValueTemp = rulerZeroPoint + paraStart + paraWidth;
            }
            if (!isNullOrUndefined(indent)) {
                indent.style.left = ((finalValueTemp * documentEditor.zoomFactor) - 6) + 'px';
            }
        } else if (documentEditor.layoutType === 'Continuous') {
            if (this.position.paragraph.paragraphFormat.bidi) {
                rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                    20 - (documentEditor.viewer.clientArea.width * documentEditor.zoomFactor);
                finalValueTemp = rulerZeroPoint + paraStart;
                indent.style.left = finalValueTemp + 'px';
            } else {
                rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                finalValueTemp = rulerZeroPoint + ((paraStart + paraWidth) * documentEditor.zoomFactor);
                indent.style.left = finalValueTemp + 'px';
            }
        }
    }

    public updateTabStopMarkers(documentEditor: DocumentEditor): void {
        if (isNullOrUndefined(documentEditor) || isNullOrUndefined(documentEditor.element)
            || isNullOrUndefined(documentEditor.element.id) || isNullOrUndefined(documentEditor.hRuler)
            || isNullOrUndefined(documentEditor.hRuler.zeroPosition)) {
            return;
        }
        const locale: L10n = new L10n('documenteditor', documentEditor.defaultLocale);
        locale.setLocale(documentEditor.locale);
        const ownerId: string = documentEditor.element.id;
        this.markIndicator = document.getElementById(ownerId + '_markIndicator');
        this.markIndicator.style.display = documentEditor.layoutType === 'Pages' ? 'block' : 'none';
        const paragarph: ParagraphWidget = this.position.paragraph;
        const tabs: WTabStop[] = paragarph.paragraphFormat.tabs;
        const zoomFactor: number = documentEditor.zoomFactor;
        const rulerSize: Size = this.getRulerSize(documentEditor);
        const RenderedTabElement: HTMLElement[] = HelperMethods.convertNodeListToArray(document.querySelectorAll('.e-de-ruler-tab'));
        for (let i: number = 0; i < tabs.length; i++) {
            const tabStop: WTabStop = tabs[parseInt(i.toString(), 10)];
            const justification: TabJustification = tabStop.tabJustification;
            // const position: number = tabStop.position;
            const id: string = documentEditor.element.id + '_' + justification + 'Tab_' + i.toString();
            const tabMarker: HTMLElement = document.getElementById(id);
            if (!isNullOrUndefined(tabMarker)) {
                if (!isNullOrUndefined(RenderedTabElement) && RenderedTabElement.length > 0) {
                    RenderedTabElement.splice(RenderedTabElement.indexOf(tabMarker), 1);
                }
                const value: number = this.position.paragraph.paragraphFormat.bidi ?
                    (HelperMethods.convertPointToPixel(1584 - tabStop.position))
                    : (HelperMethods.convertPointToPixel(1584 + tabStop.position));
                if (justification === 'Center' || justification === 'Decimal') {
                    tabMarker.style.left = ((value * zoomFactor) - 4) + 'px';
                }
                else if (justification === 'Right') {
                    tabMarker.style.left = ((value * zoomFactor) - 5.5) + 'px';
                }
                else {
                    tabMarker.style.left = ((value * zoomFactor) - 1.5) + 'px';
                }
            }
            else {
                if (justification !== 'List' && !isNullOrUndefined(justification)) {
                    this.renderTab(documentEditor, rulerSize, tabStop, justification, i, locale);
                }
            }
        }
        if (!isNullOrUndefined(RenderedTabElement)) {
            for (let i: number = 0; i < RenderedTabElement.length; i++) {
                const elementToRemove: HTMLElement = RenderedTabElement[parseInt(i.toString(), 10)];
                if (!isNullOrUndefined(elementToRemove)) {
                    elementToRemove.parentNode.removeChild(elementToRemove);
                }
            }
        }
    }
    private renderRulerMargins(documentEditor: DocumentEditor, isHorizontal: boolean, rulerContainer: HTMLElement): void {
        const rulerSize: Size = this.getRulerSize(documentEditor);
        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
        const height: number = isHorizontal ? documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.x
            : (documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.y + rulerSize.height);
        // const margin: string = isHorizontal ? ('margin-left:' + height + 'px;') : ('margin-top:' + height + 'px;');

        //const leftMarginValue = 2112 - (HelperMethods.convertPointToPixel(documentEditor.selection.end.paragraph.bodyWidget.sectionFormat.leftMargin));
        const leftMarginValue: number = 2112 * documentEditor.zoomFactor;
        const rulerMargin: string = isHorizontal ? ('margin-left:' + leftMarginValue + 'px;') : ('margin-top:' + leftMarginValue + 'px;');
        const rulerHeight: number = (isHorizontal ? rulerSize.height : (rulerGeometry.height -
            (HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin
                + documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.bottomMargin) * documentEditor.zoomFactor)));
        // const rulerHeight =  (isHorizontal ? rulerSize.height : rulerGeometry.height);
        if (isHorizontal) {
            for (let i: number = 1; i <= 13; i++) {
                this.rulerMarginDiv = document.getElementById(documentEditor.element.id + '_hRuler_Margin' + i);
                if (!this.rulerMarginDiv) {
                    const rulerstyle: string = 'height:' + rulerHeight + 'px;overflow:hidden;width:' +
                        (rulerGeometry.width - (HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin + documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin) * documentEditor.zoomFactor)) + 'px;position:absolute;' + 'font-size:9px;text-align: left;z-index: -1;display: block' + rulerMargin;
                    const rulerattributes: Object = {
                        'id': documentEditor.element.id + '_hRuler_Margin' + i,
                        style: rulerstyle,
                        class: 'e-de-ruler-margin'
                    };
                    this.rulerMarginDiv = this.createHtmlElement('div', rulerattributes);
                }
                rulerContainer.appendChild(this.rulerMarginDiv);
            }
        } else {
            if (!this.verticalRulerMarginDiv) {
                this.verticalRulerMarginDiv = document.getElementById(documentEditor.element.id + '_vRuler_Margin');
                const rulerstyle: string = 'height:' + rulerHeight + 'px;overflow:hidden;width:' +
                    rulerSize.width + 'px;position:absolute;' + 'font-size:9px;text-align: left;z-index: -1;' + rulerMargin;
                const rulerattributes: Object = {
                    'id': documentEditor.element.id + '_vRuler_Margin',
                    style: rulerstyle,
                    class: 'e-de-ruler-margin'
                };
                this.verticalRulerMarginDiv = this.createHtmlElement('div', rulerattributes);
            }
            rulerContainer.appendChild(this.verticalRulerMarginDiv);
        }
    }
    private updateRulerMargins(documentEditor: DocumentEditor): void {
        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
        const leftMarginValue: number = (documentEditor.hRuler.zeroPosition) * documentEditor.zoomFactor;
        this.updateHorizontalRulerMargin(documentEditor);
        const verticalRulerMarginDiv: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler_Margin');
        const rulerMarginDivHeight: number = rulerGeometry.height - (HelperMethods.convertPointToPixel(
            (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.bottomMargin
                * documentEditor.zoomFactor) + (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin
                    * documentEditor.zoomFactor)));
        verticalRulerMarginDiv.style.marginTop = leftMarginValue + 'px';
        verticalRulerMarginDiv.style.height = rulerMarginDivHeight + 'px';
    }

    private updateHorizontalRulerMargin(documentEditor: DocumentEditor): void {
        const columns: WColumnFormat[] = documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.columns;
        let leftMarginValue: number = (documentEditor.hRuler.zeroPosition) * documentEditor.zoomFactor;
        let skipLoop: boolean = false;
        const paraBidi: boolean = this.position.paragraph.paragraphFormat.bidi;
        let tableBidi: boolean = false;
        const currnLefttMargin: number = HelperMethods.convertPointToPixel(
            documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin - 72);
        const currentRightMargin: number = HelperMethods.convertPointToPixel(
            documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin - 72);
        if (this.position.paragraph.isInsideTable) {
            tableBidi = this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi;
        }
        const rulerMarginDivWidth: number = (this.getRulerGeometry(documentEditor).width -
            (HelperMethods.convertPointToPixel((documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin
                * documentEditor.zoomFactor) + (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin
                    * documentEditor.zoomFactor))));
        if (paraBidi || tableBidi) {
            leftMarginValue = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - rulerMarginDivWidth;
        }
        for (let i: number = 0; i < 13; i++) {
            const horizontalRulerMarginDiv: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_Margin' + (i + 1));
            if (horizontalRulerMarginDiv) {
                if ((columns.length === 0 && !skipLoop) || (documentEditor.layoutType === 'Continuous' && !skipLoop)) {
                    if (paraBidi || tableBidi) {
                        const startValue: number = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - rulerMarginDivWidth;
                        horizontalRulerMarginDiv.style.marginLeft = startValue + 'px';
                    } else {
                        horizontalRulerMarginDiv.style.marginLeft = leftMarginValue + 'px';
                    }
                    horizontalRulerMarginDiv.style.display = 'block';
                    if (documentEditor.layoutType === 'Continuous') {
                        const paraWidth: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['width'].toString()) : this.position.paragraph.width;
                        horizontalRulerMarginDiv.style.width = (paraWidth * documentEditor.zoomFactor) + 'px';
                    } else {
                        horizontalRulerMarginDiv.style.width = rulerMarginDivWidth + 'px';
                    }
                    skipLoop = true;
                } else if ((columns.length >= i + 1) && documentEditor.layoutType === 'Pages') {
                    if (paraBidi || tableBidi) {
                        horizontalRulerMarginDiv.style.marginLeft = leftMarginValue + 'px';
                        leftMarginValue -= ((currnLefttMargin + currentRightMargin) / (columns.length)) * documentEditor.zoomFactor;
                        leftMarginValue = leftMarginValue + (
                            columns[parseInt(i.toString(), 10)].width +
                            columns[parseInt(i.toString(), 10)].space) * documentEditor.zoomFactor;
                    } else {
                        horizontalRulerMarginDiv.style.marginLeft = leftMarginValue + 'px';
                        leftMarginValue -= ((currnLefttMargin + currentRightMargin) / (columns.length)) * documentEditor.zoomFactor;
                        leftMarginValue = leftMarginValue + (
                            columns[parseInt(i.toString(), 10)].width +
                            columns[parseInt(i.toString(), 10)].space) * documentEditor.zoomFactor;
                    }
                    horizontalRulerMarginDiv.style.display = 'block';
                    horizontalRulerMarginDiv.style.width = (columns[parseInt(i.toString(), 10)].width - ((currnLefttMargin + currentRightMargin) / columns.length)) * documentEditor.zoomFactor + 'px';
                } else {
                    horizontalRulerMarginDiv.style.display = 'none';
                }
            }
        }
    }

    public resizeVRulerMargins(isRulerTopMargin: boolean, currentTopMargin: number, currentScrollTop: number, currentBottomMargin: number,
                               ruler: HTMLElement, mousePosition: number, documentEditor: DocumentEditor): void {
        const rulerMarginDiv: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler_Margin');
        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
        if (isRulerTopMargin) {
            rulerMarginDiv.style.height = (rulerGeometry.height - HelperMethods.convertPointToPixel((documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.bottomMargin * documentEditor.zoomFactor) + mousePosition)).toString() + 'px';

            if (currentTopMargin < mousePosition) {
                ruler.scrollTop = currentScrollTop - HelperMethods.convertPointToPixel(mousePosition - currentTopMargin);
            } else {
                ruler.scrollTop = currentScrollTop + HelperMethods.convertPointToPixel(currentTopMargin - mousePosition);
            }
        } else {
            const bottomMargin: number = HelperMethods.convertPixelToPoint(rulerGeometry.height) - mousePosition;
            rulerMarginDiv.style.height = (rulerGeometry.height - HelperMethods.convertPointToPixel((documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin * documentEditor.zoomFactor) + (bottomMargin))).toString() + 'px';

            if (currentBottomMargin < mousePosition) {
                //  ruler.scrollLeft = currentScrollLeft - HelperMethods.convertPointToPixel(mousePosition - currentRightMargin);
            } else {
                //  ruler.scrollLeft = currentScrollLeft + HelperMethods.convertPointToPixel(currentRightMargin - mousePosition);
            }
        }
    }

    private resizeRulerMargins(isRulerLeftMargin: boolean, currentLeftMargin: number, currentScrollLeft: number, currentRightMargin: number,
                               ruler: HTMLElement, mousePosition: number, isHorizontal: boolean, documentEditor: DocumentEditor): void {
        const rulerMarginDiv: HTMLElement = document.getElementById(documentEditor.element.id + (isHorizontal ? '_hRuler_Margin1' : '_vRuler_Margin'));
        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
        if (!isNullOrUndefined(isRulerLeftMargin) && isRulerLeftMargin) {
            rulerMarginDiv.style.width = (rulerGeometry.width - HelperMethods.convertPointToPixel((documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin * documentEditor.zoomFactor) + mousePosition)).toString() + 'px';

            if (currentLeftMargin < mousePosition) {
                ruler.scrollLeft = currentScrollLeft - HelperMethods.convertPointToPixel(mousePosition - currentLeftMargin);
            } else {
                ruler.scrollLeft = currentScrollLeft + HelperMethods.convertPointToPixel(currentLeftMargin - mousePosition);
            }
        } else {
            const rightMargin: number = HelperMethods.convertPixelToPoint(rulerGeometry.width) - mousePosition;
            rulerMarginDiv.style.width = (rulerGeometry.width - HelperMethods.convertPointToPixel((documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin * documentEditor.zoomFactor) + (rightMargin))).toString() + 'px';

            if (currentRightMargin < mousePosition) {
                //  ruler.scrollLeft = currentScrollLeft - HelperMethods.convertPointToPixel(mousePosition - currentRightMargin);
            } else {
                //  ruler.scrollLeft = currentScrollLeft + HelperMethods.convertPointToPixel(currentRightMargin - mousePosition);
            }
        }
    }

    public getRulerOrigin(): void {
        const range: number = 1584;
        const pixelValue: number = HelperMethods.convertPointToPixel(1584);
        //console.log('PixelValue: ', pixelValue);
        //console.log('PointsValue: ', range);
    }


    public renderIndents(documentEditor: DocumentEditor, isHorizontal: boolean, rulerSize: Size, rulerGeometry: Size, locale: L10n): void {
        this.hRuler = document.getElementById(documentEditor.element.id + '_hRuler');
        this.firstLineIndent = document.getElementById(documentEditor.element.id + '_firstLineIndent');
        if (!this.firstLineIndent) {
            const margin: string = ('left:' + (HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin) - 6) * documentEditor.zoomFactor + 'px;');
            const style: string = 'height:' + ((rulerSize.height - 3) / 2) + 'px;overflow:hidden;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 5;' + margin;
            const attributes: Object = {
                'id': documentEditor.element.id + '_firstLineIndent',
                style: style,
                'data-name': 'FirstLineIndent',
                class: 'e-de-ruler-indent'
            };
            this.firstLineIndent = this.createHtmlElement('div', attributes);
            this.firstLineIndent.setAttribute('title', locale.getConstant('First Line Indent'));
            // let svg: SVGElement;
            // Create an SVG element
            const attr: Object = {
                'id': documentEditor.element.id + '_firstLineIndent_svg',
                width: rulerSize.width + 'px',
                height: ((rulerSize.height - 3) / 2) + 'px',
                style: 'position:inherit;left:0px'
            };
            this.firstLineIndentSvg = this.createSvgElement('svg', attr);
            this.firstLineIndentSvg.setAttribute('fill', 'none');
            const pathattr: Object = {
                style: 'position:inherit;left:0px'
            };
            // Create a path element inside the SVG
            this.firstLineIndentPath = this.createSvgElement('path', pathattr);
            this.firstLineIndentPath.setAttribute('class', 'e-de-ruler-indent-svg');
            this.firstLineIndentPath.setAttribute('d', 'M 0.5 0.5 H 11.5 V 2.7128 L 6 5.4211 L 0.5 2.7128 V 0.5 Z');
            this.firstLineIndentPath.setAttribute('fill', 'white');
            this.firstLineIndentPath.setAttribute('stroke', '#A1A1A1');
            // Append the path element to the SVG element
            this.firstLineIndentSvg.appendChild(this.firstLineIndentPath);
            this.firstLineIndent.appendChild(this.firstLineIndentSvg);
            this.hRuler.append(this.firstLineIndent);
            this.firstLineIndent.addEventListener('dblclick', this.onDoubleClickHandler);
            //Draggable for first line Indent.
            this.isDraggingIndents1 = false;
            this.indentInitialValue = HelperMethods.getNumberFromString(this.firstLineIndent.style.left); // for mouse up event
            const indentsInitialValue2: number = HelperMethods.getNumberFromString(this.firstLineIndent.style.left); // for mouse move event
            this.firstLineIndent.addEventListener('mouseenter', this.onDocumentIntentTrueChangeHandler);
            this.firstLineIndent.addEventListener('mouseleave', this.onDocumentIntentFalseChangeHandler);
            this.firstLineIndent.addEventListener('mousedown', this.onFirstLineIndentMouseDownHandler);

            document.addEventListener('mousemove', this.onIndentMouseMoveHandler);

            document.addEventListener('mouseup', this.onIndentMouseUpHandler);
        }

        //Rendering HangingIndent
        this.hangingIndent = document.getElementById(documentEditor.element.id + '_hangingIndent');
        if (!this.hangingIndent) {
            const margin: string = ('left:' + (HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin) - 6) + 'px;');
            const style: string = 'height:' + (rulerSize.height / 2) + 'px;top:' + (((rulerSize.height - 3) / 2) + 1) + 'px;overflow:hidden;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 5;' + margin;
            const attributes: Object = {
                'id': documentEditor.element.id + '_hangingIndent',
                style: style,
                'data-name': 'HangingIndent',
                class: 'e-de-ruler-indent'
            };
            this.hangingIndent = this.createHtmlElement('div', attributes);
            this.hangingIndent.setAttribute('title', locale.getConstant('Hanging Indent'));
            // let hangingIndentSvg: SVGElement;

            // Create an SVG element
            const attr: Object = {
                'id': documentEditor.element.id + '_hangingIndent_svg',
                width: rulerSize.width + 'px',
                height: ((rulerSize.height - 3) / 2) + 'px',
                style: 'position:inherit;left:0px'
            };
            this.hangingIndentSvg = this.createSvgElement('svg', attr);
            this.hangingIndentSvg.setAttribute('fill', 'none');
            const pathattr: Object = {
                style: 'position:inherit;left:0px'
            };
            // Create a path element inside the SVG
            this.hangingIndentPath = this.createSvgElement('path', pathattr);
            this.hangingIndentPath.setAttribute('class', 'e-de-ruler-indent-svg');
            this.hangingIndentPath.setAttribute('d', 'M 0.5 5.3211 H 11.5 V 3.1083 L 6 0.4 L 0.5 3.1083 V 5.3211 Z');
            this.hangingIndentPath.setAttribute('fill', 'white');
            this.hangingIndentPath.setAttribute('stroke', '#A1A1A1');
            // Append the path element to the SVG element
            this.hangingIndentSvg.appendChild(this.hangingIndentPath);
            this.hangingIndent.appendChild(this.hangingIndentSvg);
            this.hRuler.append(this.hangingIndent);
            this.hangingIndent.addEventListener('dblclick', this.onDoubleClickHandler);
            this.hangingIndentInitialValue = HelperMethods.getNumberFromString(this.hangingIndent.style.left); // for mouse up event
            const initialValue2: number = HelperMethods.getNumberFromString(this.hangingIndent.style.left); // for mouse move event
            this.hangingIndent.addEventListener('mouseenter', this.onDocumentIntentTrueChangeHandler);
            this.hangingIndent.addEventListener('mouseleave', this.onDocumentIntentFalseChangeHandler);
            this.hangingIndent.addEventListener('mousedown', this.onHangIndentMouseDownHandler);

            document.addEventListener('mousemove', this.onHangIndentMouseMoveHandler);

            document.addEventListener('mouseup', this.onHangIndentMouseUpHandler);
        }

        //Rendering LeftIndent
        this.leftIndent = document.getElementById(documentEditor.element.id + '_leftIndent');
        if (!this.leftIndent) {
            const margin: string = ('left:' + (HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin) - 6) + 'px;');
            const style: string = 'height:4px;top:11px;overflow:hidden;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 5;' + margin;
            const attributes: Object = {
                'id': documentEditor.element.id + '_leftIndent',
                style: style,
                class: 'e-de-ruler-indent'
            };
            this.leftIndent = this.createHtmlElement('div', attributes);
            this.leftIndent.setAttribute('title', locale.getConstant('Left Indent'));
            // let leftIndentSvg: SVGElement;

            // Create an SVG element
            const attr: Object = {
                'id': documentEditor.element.id + '_leftIndent_svg',
                width: rulerSize.width + 'px',
                height: '4px',
                style: 'position:inherit;left:0px'
            };
            this.leftIndentSvg = this.createSvgElement('svg', attr);
            this.leftIndentSvg.setAttribute('fill', 'none');
            const pathattr: Object = {
                style: 'position:inherit;left:0px'
            };
            // Create a path element inside the SVG
            this.leftIndentPath = this.createSvgElement('path', pathattr);
            this.leftIndentPath.setAttribute('class', 'e-de-ruler-indent-svg');
            this.leftIndentPath.setAttribute('d', 'M 0.5 3.5 H 11.5 V 0.5 H 0.5 V 3.5 Z');
            this.leftIndentPath.setAttribute('fill', 'white');
            this.leftIndentPath.setAttribute('stroke', '#A1A1A1');
            // Append the path element to the SVG element
            this.leftIndentSvg.appendChild(this.leftIndentPath);
            this.leftIndent.appendChild(this.leftIndentSvg);
            this.hRuler.append(this.leftIndent);
            this.leftIndent.addEventListener('dblclick', this.onDoubleClickHandler);
            this.indentInitialValue = HelperMethods.getNumberFromString(this.leftIndent.style.left); // for mouse down event
            const initialValue2: number = HelperMethods.getNumberFromString(this.leftIndent.style.left); // for mouse move event
            this.leftIndent.addEventListener('mouseenter', this.onDocumentIntentTrueChangeHandler);
            this.leftIndent.addEventListener('mouseleave', this.onDocumentIntentFalseChangeHandler);
            this.leftIndent.addEventListener('mousedown', this.onLeftIndentMouseDownHandler);

            document.addEventListener('mousemove', this.onLeftIndentMouseMoveHandler);

            document.addEventListener('mouseup', this.onLeftIndentMouseUpHandler);
        }
        //Rendering RightIndent
        this.rightIndent = document.getElementById(documentEditor.element.id + '_rightIndent');
        if (!this.rightIndent) {
            const margin: string = ('left:' + (documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.width - HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin) - 6) + 'px;');
            const style: string = 'height:7px;top:8px;overflow:hidden;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
            const attributes: Object = {
                'id': documentEditor.element.id + '_rightIndent',
                style: style,
                class: 'e-de-ruler-indent'
            };
            this.rightIndent = this.createHtmlElement('div', attributes);
            this.rightIndent.setAttribute('title', locale.getConstant('Right Indent'));
            // let rightIndentSvg: SVGElement;

            // Create an SVG element
            const attr: Object = {
                'id': documentEditor.element.id + '_rightIndent_svg',
                width: rulerSize.width + 'px',
                height: '7px',
                style: 'position:inherit;left:0px'
            };
            this.rightIndentSvg = this.createSvgElement('svg', attr);
            this.rightIndentSvg.setAttribute('fill', 'none');
            const pathattr: Object = {
                style: 'position:inherit;left:0px'
            };
            // Create a path element inside the SVG
            this.rightIndentPath = this.createSvgElement('path', pathattr);
            this.rightIndentPath.setAttribute('class', 'e-de-ruler-indent-svg');
            this.rightIndentPath.setAttribute('d', 'M 0.5 6.5 H 11.5 V 4.2872 L 6 1.5789 L 0.5 4.2872 V 6.5 Z');
            this.rightIndentPath.setAttribute('fill', 'white');
            this.rightIndentPath.setAttribute('stroke', '#A1A1A1');
            // Append the path element to the SVG element
            this.rightIndentSvg.appendChild(this.rightIndentPath);
            this.rightIndent.appendChild(this.rightIndentSvg);
            this.hRuler.append(this.rightIndent);
            this.rightIndent.addEventListener('dblclick', this.onDoubleClickHandler);
            //Draggable for left line Indent.

            this.indentInitialValue = HelperMethods.getNumberFromString(this.rightIndent.style.left); // for mouse down event
            const initialValue2: number = HelperMethods.getNumberFromString(this.rightIndent.style.left); // for mouse move event
            this.rightIndent.addEventListener('mouseenter', this.onDocumentIntentTrueChangeHandler);
            this.rightIndent.addEventListener('mouseleave', this.onDocumentIntentFalseChangeHandler);
            this.rightIndent.addEventListener('mousedown', this.onRightIndentMouseDownHandler);

            document.addEventListener('mousemove', this.onRightIndentMouseMoveHandler);

            document.addEventListener('mouseup', this.onRightIndentMouseUpHandler);
        }
        this.updateIndentMarkers(documentEditor);
    }

    /**
     * updateRuler method
     *
     * @returns {void} updateRuler method.
     * @param {DocumentEditor} documentEditor - provide the documentEditor  value.
     * @param {boolean} rerenderRuler - provide the rerenderRuler  value.
     * @private
     */
    public updateRuler(documentEditor: DocumentEditor, rerenderRuler: boolean): void {
        /* eslint-disable-next-line max-len */
        if (documentEditor.isDestroyed || documentEditor.rulerHelper && documentEditor.documentEditorSettings && !documentEditor.documentEditorSettings.showRuler ||
            documentEditor.isReadOnlyMode) {
            return;
        }
        // const hOffset: number = - documentEditor.scroller.horizontalOffset;
        // const vOffset: number = - documentEditor.scroller.verticalOffset;
        const hOffset: number = 0;
        // const vOffset: number = - documentEditor.scroller.verticalOffset;
        if (isNullOrUndefined(documentEditor.hRuler) && isNullOrUndefined(documentEditor.vRuler)) {
            return;
        }
        if (documentEditor.selectionModule.isForward) {
            this.position = documentEditor.selectionModule.start;
        } else {
            this.position = documentEditor.selectionModule.end;
        }
        this.updateRulerDimension(documentEditor, documentEditor.hRuler, hOffset, rerenderRuler);
        this.updateRulerDimension(documentEditor, documentEditor.vRuler, hOffset, rerenderRuler);
        this.updateRulerMargins(documentEditor);
        this.updateIndentMarkers(documentEditor);
        this.updateTabStopMarkers(documentEditor);
        if (this.position.paragraph.isInsideTable) {
            this.updateTableMarkers(documentEditor, documentEditor.hRuler);
        } else {
            this.removeTableMarkers(documentEditor, documentEditor.hRuler);
        }
        this.updateIndicatorLines(documentEditor);
    }


    private removeTableMarkers(documentEditor: DocumentEditor, ruler: Ruler): void {
        const renderedTableMarkers: HTMLElement[] = HelperMethods.convertNodeListToArray(document.querySelectorAll('.e-de-ruler-table-marker'));
        if (!isNullOrUndefined(renderedTableMarkers)) {
            for (let i: number = 0; i < renderedTableMarkers.length; i++) {
                const elementToRemove: HTMLElement = renderedTableMarkers[parseInt(i.toString(), 10)];
                if (!isNullOrUndefined(elementToRemove)) {
                    elementToRemove.parentNode.removeChild(elementToRemove);
                }
            }
        }
    }

    private updateTableMarkers(documentEditor: DocumentEditor, ruler: Ruler): void {
        const renderedTableMarkers: HTMLElement[] = HelperMethods.convertNodeListToArray(document.querySelectorAll('.e-de-ruler-table-marker'));
        if (isNullOrUndefined(renderedTableMarkers)) {
            // const tablewidget: TableWidget =
            // ((documentEditor.selection.end.paragraph.containerWidget as TableCellWidget).ownerTable as TableWidget);
            // const tableColumns = ((documentEditor.selection.end.paragraph.containerWidget as TableCellWidget).ownerTable
            //  as TableWidget).tableHolder.columns.length;
            // const tableXPos: number = undefined;
            // this.hRuler = document.getElementById(documentEditor.element.id + '_hRuler');
            this.renderTableMarkers(documentEditor, ruler);
        } else if (this.position.paragraph.isInsideTable) {
            this.renderTableMarkers(documentEditor, ruler);
        }
    }
    private renderTableMarkers(documentEditor: DocumentEditor, ruler: Ruler): void {
        this.removeTableMarkers(documentEditor, documentEditor.hRuler);
        let intialPosition: number;
        const tablewidget: TableWidget = ((this.position.paragraph.containerWidget as TableCellWidget).ownerTable as TableWidget);
        const tableRowWidget: TableRowWidget = (
            (this.position.paragraph.associatedCell as TableCellWidget).ownerRow as TableRowWidget).clone();
        const cellWidgets: IWidget[] = tableRowWidget.childWidgets;
        let value: number = this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi ? cellWidgets.length : 0;
        if (this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi) {
            cellWidgets.reverse();
        }
        let tableXPos: number;
        this.hRuler = document.getElementById(documentEditor.element.id + '_hRuler');
        for (let i: number = 0; i <= cellWidgets.length; i++) {
            let tableMarker: HTMLElement = document.getElementById(documentEditor.element.id + '_tableMarker_' + value);
            //if (!tableMarker) {
            let margin: string;
            if (i === 0) {
                tableXPos = ((cellWidgets[parseInt(i.toString(), 10)] as TableCellWidget).x
                    - (cellWidgets[parseInt(i.toString(), 10)] as TableCellWidget).margin.left)
                    * documentEditor.zoomFactor + this.hRuler.scrollLeft;
                margin = ('left:' + (tableXPos - 4) + 'px;');
            }
            else {
                tableXPos = tableXPos + (((cellWidgets[i - 1] as TableCellWidget).width
                    + (cellWidgets[i - 1] as TableCellWidget).margin.left
                    + (cellWidgets[i - 1] as TableCellWidget).margin.right) * documentEditor.zoomFactor);
                margin = 'left:' + (tableXPos - 4) + 'px;';
            }
            const style: string = 'height:' + (ruler.thickness) + 'px;overflow:hidden;width:10px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
            const attributes: Object = {
                'id': documentEditor.element.id + '_tableMarker_' + value,
                'class': 'e-de-ruler-table-marker',
                style: style
            };
            tableMarker = this.createHtmlElement('div', attributes);
            const locale: L10n = new L10n('documenteditor', documentEditor.defaultLocale);
            tableMarker.setAttribute('title', locale.getConstant('Move Table Column'));
            // Create an SVG element
            const attr: Object = {
                'id': documentEditor.element.id + '_tableMarker_svg' + i,
                width: 9 + 'px',
                height: 11 + 'px',
                style: 'position:inherit;left:0px;top:3px;'
            };
            const svg: SVGElement = this.createSvgElement('svg', attr);
            svg.setAttribute('fill', 'none');
            const pathattr: Object = {
                style: 'position:inherit;left:0px;'
            };
            // Create a path element inside the SVG
            const pathElement: SVGElement = this.createSvgElement('path', pathattr);
            pathElement.setAttribute('class', 'e-de-ruler-table-svg');
            pathElement.setAttribute('d', 'M1 1V0H2V1H3V0H4V1H5V0H6V1H7V2H6V3H7V4H6V5H7V6H6V7H7V8H0V7H1V6H0V5H1V4H0V3H1V2H0V1H1ZM2 2V3H3V2H2ZM4 2V3H5V2H4ZM5 4H4V5H5V4ZM5 6H4V7H5V6ZM3 7V6H2V7H3ZM2 5H3V4H2V5Z');
            pathElement.setAttribute('fill', '#A1A1A1');
            // Append the path element to the SVG element
            svg.appendChild(pathElement);
            tableMarker.appendChild(svg);
            this.hRuler.append(tableMarker);
            // }
            if (this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi) {
                value--;
            } else {
                value++;
            }
            tableMarker.addEventListener('dblclick', function (event: MouseEvent): void {
                documentEditor.showDialog('TableProperties');
                event.stopPropagation();
            });

            let tableMarkerOffset: number;

            tableMarker.addEventListener('mousedown', (e: MouseEvent) => {
                tableMarkerOffset = e.clientX - tableMarker.getBoundingClientRect().left;
                documentEditor.startXPosition = HelperMethods.convertPixelToPoint(e.clientX);
                documentEditor.isTableMarkerDragging = true;
                const cursorPoint: Point = new Point(e.clientX, e.clientY);
                const touchPoint: Point = documentEditor.viewer.findFocusedPage(cursorPoint, true, true);
                let currentMarkerPostion: number;
                if (e.currentTarget instanceof HTMLElement) {
                    const parts: string[] = e.currentTarget.id.split('_');
                    const value: string = parts[parts.length - 1];
                    currentMarkerPostion = parseInt(value, 10);
                }
                const tableWidget: TableWidget = (
                    (documentEditor.selectionModule.end.paragraph.containerWidget as TableCellWidget).ownerTable as TableWidget);
                documentEditor.editorModule.tableResize.currentResizingTable = tableWidget;
                documentEditor.editorModule.tableResize.resizeNode = 0;
                documentEditor.editorModule.tableResize.resizerPosition = currentMarkerPostion;
                documentEditor.editorModule.tableResize.startingPoint.x = touchPoint.x;
                documentEditor.editorModule.tableResize.startingPoint.y = touchPoint.y;
                documentEditor.editorHistoryModule.initResizingHistory(touchPoint, documentEditor.editorModule.tableResize);

                const rulerZeroPoint: number = HelperMethods.convertPointToPixel(
                    1584 - documentEditor.selectionModule.sectionFormat.leftMargin) * documentEditor.zoomFactor;
                const value: number = rulerZeroPoint + e.clientX - tableMarkerOffset - this.hRuler.getBoundingClientRect().left;
                const startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
                const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                lineSvg.style.left = (indicatorLineValue - 6) + 'px';
                lineSvg.style.display = 'block';
            });
            document.addEventListener('mousemove', (e: MouseEvent) => {
                if (documentEditor.isDestroyed || !documentEditor.documentEditorSettings.showRuler) {
                    return;
                }
                if (documentEditor.isTableMarkerDragging) {
                    this.hRuler = document.getElementById(documentEditor.element.id + '_hRuler');
                    let rulerZeroPoint: number = HelperMethods.convertPointToPixel(
                        1584 - documentEditor.selectionModule.sectionFormat.leftMargin) * documentEditor.zoomFactor;
                    if (documentEditor.selectionModule.end.paragraph.associatedCell.ownerTable.tableFormat.bidi) {
                        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
                        const rulerMarginDivWidth: number = (rulerGeometry.width - (HelperMethods.convertPointToPixel(
                            (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin * documentEditor.zoomFactor)
                            + (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin
                                * documentEditor.zoomFactor))));
                        rulerZeroPoint -= rulerMarginDivWidth;
                    }
                    const value: number = rulerZeroPoint + e.clientX - tableMarkerOffset - this.hRuler.getBoundingClientRect().left;
                    tableMarker.style.left = value + 'px';

                    const startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                    const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.left = (indicatorLineValue - 6) + 'px';
                }
            });
            document.addEventListener('mouseup', (e: MouseEvent) => {
                if (documentEditor.isDestroyed || !documentEditor.documentEditorSettings.showRuler) {
                    return;
                }
                if (documentEditor.isTableMarkerDragging) {
                    const cursorPoint: Point = new Point(e.clientX, e.clientY);
                    const dragValue: number = this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi ?
                        (documentEditor.startXPosition - HelperMethods.convertPixelToPoint(e.clientX))
                        : (HelperMethods.convertPixelToPoint(e.clientX) - documentEditor.startXPosition);
                    documentEditor.editorModule.tableResize.handleResizing(cursorPoint, true, (dragValue / documentEditor.zoomFactor));
                    documentEditor.editorModule.tableResize.updateResizingHistory(
                        documentEditor.viewer.findFocusedPage(cursorPoint, true, true));
                    documentEditor.isTableMarkerDragging = false;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.display = 'none';
                }
            });
        }
    }

    /**
     * updateRulerDimension method \
     *
     * @returns {void} updateRulerDimension method .\
     * @param {DocumentEditor} documentEditor - provide the documentEditor  value.
     * @param {Ruler} ruler - provide the content  value.
     * @param {number} offset - provide the content  value.
     * @param {boolean} rerenderRuler - provide the rerenderRuler  value.
     * @private
     */
    private updateRulerDimension(documentEditor: DocumentEditor, ruler: Ruler, offset: number, rerenderRuler: boolean): void {
        const isHorizontal: boolean = ruler.orientation === 'Horizontal' ? true : false;
        const rulerSize: Size = this.getRulerSize(documentEditor);
        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
        //const documentEditorRuler: DocumentEditorRulerModel = isHorizontal ? documentEditor.documentEditorSettings.rulerSettings.horizontalRuler : documentEditor.documentEditorSettings.rulerSettings.verticalRuler;
        this.updateRulerDiv(documentEditor, rulerGeometry, isHorizontal, ruler);
        this.updateRulerSpace(documentEditor, rulerGeometry, isHorizontal, ruler);
        this.updateMargin(ruler, documentEditor, isHorizontal);
        // ruler.pageWidth = documentEditor.selection.end.paragraph.bodyWidget.page.boundingRectangle.width * documentEditor.zoomFactor;
        // ruler.pageHeight = documentEditor.selection.end.paragraph.bodyWidget.page.boundingRectangle.height * documentEditor.zoomFactor;
        ruler.length = documentEditor.zoomFactor < 1 ?
            ((ruler.zeroPosition * 2) / documentEditor.zoomFactor)
            : ((ruler.zeroPosition * 2) * documentEditor.zoomFactor);
        const rulerObj: HTMLElement = ruler.element;
        if (isHorizontal) {
            rulerObj.style.marginLeft = (documentEditor.layoutType === 'Pages' ? documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.x : 0) + 'px';
        } else {
            rulerObj.parentElement.style.display = documentEditor.layoutType === 'Pages' ? 'block' : 'none';
            rulerObj.style.marginTop = documentEditor.selectionModule.getPageTop(documentEditor.selectionModule.end.paragraph.bodyWidget.page) + 'px';
        }
        if (rerenderRuler) {
            ruler.offset = offset;
            ruler.scale = documentEditor.zoomFactor;
            // if (documentEditor.layoutType === 'Pages') {
            ruler.length = documentEditor.zoomFactor < 1 ?
                ((ruler.zeroPosition * 2) / documentEditor.zoomFactor)
                : ((ruler.zeroPosition * 2) * documentEditor.zoomFactor);
            // } else if (documentEditor.layoutType === 'Continuous') {
            //     ruler.length = (ruler.zeroPosition * 2) / documentEditor.zoomFactor;
            // }
            ruler.updateRuler();
        }
        if (isHorizontal) {
            if (documentEditor.layoutType === 'Pages') {
                const paraBidi: boolean = this.position.paragraph.paragraphFormat.bidi;
                let tableBidi: boolean = false;
                if (this.position.paragraph.isInsideTable) {
                    tableBidi = this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi;
                }
                if (paraBidi || tableBidi) {
                    const rulerMarginDivWidth: number = (rulerGeometry.width - (HelperMethods.convertPointToPixel(
                        (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin * documentEditor.zoomFactor))));
                    rulerObj.scrollLeft = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - rulerMarginDivWidth;
                } else {
                    rulerObj.scrollLeft = (ruler.zeroPosition - HelperMethods.convertPointToPixel(
                        documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin)) * documentEditor.zoomFactor;
                }
            } else {
                const paraBidi: boolean = this.position.paragraph.paragraphFormat.bidi;
                let tableBidi: boolean = false;
                if (this.position.paragraph.isInsideTable) {
                    tableBidi = this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi;
                }
                if (paraBidi || tableBidi) {
                    // const rulerMarginDivWidth = (rulerGeometry.width - 40);
                    rulerObj.scrollLeft = ((ruler.zeroPosition - documentEditor.viewer.clientActiveArea.width)
                        * documentEditor.zoomFactor) - 20;
                } else {
                    // 20 is set approximately to the web layout.
                    rulerObj.scrollLeft = (ruler.zeroPosition * documentEditor.zoomFactor) - 20;
                }
            }
        } else {
            rulerObj.scrollTop = (ruler.zeroPosition - HelperMethods.convertPointToPixel(
                documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin)) * documentEditor.zoomFactor;
        }
    }


    /**
     * updateRulerSpace method \
     *
     * @returns {void} updateRulerDiv method .\
     * @param {DocumentEditor} documentEditor - provide the documentEditor  value.
     * @param {Size} rulerGeometry - provide the content  value.
     * @param {boolean} isHorizontal - provide the content  value.
     * @param {Ruler} ruler - provide the ruler  value.
     * @private
     */
    private updateRulerSpace(documentEditor: DocumentEditor, rulerGeometry: Size, isHorizontal: boolean, ruler: Ruler): void {
        this.rulerSpaceDiv = document.getElementById(documentEditor.element.id + (isHorizontal ? '_hRuler_ruler_space' : '_vRuler_ruler_space'));
        if (this.rulerSpaceDiv && documentEditor && rulerGeometry) {
            this.rulerSpaceDiv.style.width = (isHorizontal ? (rulerGeometry.width + (ruler.segmentWidth * 2)) : ruler.thickness) + 'px';
            this.rulerSpaceDiv.style.height = (isHorizontal ? ruler.thickness : (rulerGeometry.height + (ruler.segmentWidth * 2))) + 'px';
        }
    }


    /**
     * updateRulerDiv method \
     *
     * @returns {void} updateRulerDiv method .\
     * @param {DocumentEditor} documentEditor - provide the documentEditor  value.
     * @param {Size} rulerGeometry - provide the content  value.
     * @param {boolean} isHorizontal - provide the content  value.
     * @param {Ruler} ruler - provide the ruler  value.
     * @private
     */
    public updateRulerDiv(documentEditor: DocumentEditor, rulerGeometry: Size, isHorizontal: boolean, ruler: Ruler): void {
        // parent div
        this.parentRulerDiv = document.getElementById(documentEditor.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
        if (this.parentRulerDiv && documentEditor && rulerGeometry) {
            this.parentRulerDiv.style.width = (isHorizontal ? documentEditor.layoutType === 'Continuous' ? rulerGeometry.width / documentEditor.zoomFactor : rulerGeometry.width : ruler.thickness) + 'px';
            this.parentRulerDiv.style.height = (isHorizontal ? ruler.thickness : rulerGeometry.height) + 'px';
            this.parentRulerDiv = document.getElementById(documentEditor.element.id + '_overlapRuler');
            if (this.parentRulerDiv) {
                // eslint-disable-next-line
                isHorizontal ? (this.parentRulerDiv.style.height === ruler.thickness + 'px') : (this.parentRulerDiv.style.width === ruler.thickness + 'px');
            }
        }
        if (isHorizontal) {
            if (this.hRulerBottom) {
                const pageElement: HTMLElement = document.getElementById(documentEditor.element.id + '_pageContainer');
                this.hRulerBottom.style.width = pageElement.getBoundingClientRect().width + 'px';
            }
        }
        // let vRulerDiv: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler');
        // if (vRulerDiv) {
        //     vRulerDiv.style.width = ruler.thickness + 'px';
        //     vRulerDiv.style.height =  rulerGeometry.height + 'px';
        // }
    }

    /**
     * getRulerGeometry method \
     *
     * @returns {void} getRulerGeometry method .\
     * @param { DocumentEditor} documentEditor - provide the documentEditor  value.
     * @private
     */
    private getRulerGeometry(documentEditor: DocumentEditor): Size {
        const rulerSize: Size = this.getRulerSize(documentEditor);
        const height: number = (documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.height
            * documentEditor.zoomFactor);
        const width: number = (documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.width
            * documentEditor.zoomFactor);
        return new Size(width, height);
    }

    private getVerticalHeight(documentEditor: DocumentEditor): number {
        const pageheight: number = HelperMethods.convertPixelToPoint(
            documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.height);
        const containerHeight: number = documentEditor.element.getBoundingClientRect().height;
        if (pageheight < containerHeight) {
            return pageheight;
        } else {
            return containerHeight - documentEditor.documentHelper.pages[0].boundingRectangle.y;
        }
    }

    public renderTab(documentEditor: DocumentEditor, rulerSize: Size, tabStop: WTabStop, tabJustification: TabJustification,
                     i: number, locale?: L10n): void {
        this.hRuler = document.getElementById(documentEditor.element.id + '_hRuler');
        const zoomFactor: number = documentEditor.documentHelper.zoomFactor;
        let value: number;
        switch (tabJustification) {
        case 'Left': {
            this.leftTab = document.getElementById(documentEditor.element.id + '_LeftTab' + '_' + i);
            if (!this.leftTab) {
                let style: string = '';
                if (!isNullOrUndefined(tabStop)) {
                    value = this.position.paragraph.paragraphFormat.bidi ?
                        (HelperMethods.convertPointToPixel(1584 - tabStop.position))
                        : (HelperMethods.convertPointToPixel(1584 + tabStop.position));
                    const margin: string = ('left:' + ((value - 1.5) * zoomFactor) + 'px;');
                    style = 'height:9px;overflow:hidden;top:7px;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
                }
                const attributes: Object = {
                    'id': documentEditor.element.id + '_LeftTab' + '_' + i,
                    'class': 'e-de-ruler-tab e-de-ruler-tab-left',
                    style: style,
                    'data-name': 'LeftTab'
                };
                this.leftTab = this.createHtmlElement('div', attributes);
                this.leftTab.setAttribute('title', locale.getConstant('Left Tab'));
                // let svg: SVGElement;
                // Create an SVG element
                const attr: Object = {
                    'id': documentEditor.element.id + '_leftTab_svg',
                    width: rulerSize.width / 2 + 'px',
                    height: rulerSize.height / 2 + 'px',
                    style: 'position:inherit;left:0px'
                };
                const svg: SVGElement = this.createSvgElement('svg', attr);
                svg.setAttribute('fill', 'none');
                const pathattr: Object = {
                    style: 'position:inherit;left:0px'
                };
                // Create a path element inside the SVG
                const pathElement: SVGElement = this.createSvgElement('path', pathattr);
                pathElement.setAttribute('class', 'e-de-ruler-tab-svg');
                pathElement.setAttribute('d', 'M3 5H7V7H1V1H3V5Z');
                pathElement.setAttribute('fill', '#605E5C');
                pathElement.setAttribute('stroke', '#A1A1A1');
                // Append the path element to the SVG element
                svg.appendChild(pathElement);
                this.leftTab.appendChild(svg);
                this.hRuler.append(this.leftTab);
            }
            break;
        }
        case 'Center': {
            this.centerTab = document.getElementById(documentEditor.element.id + '_CenterTab' + '_' + i);
            if (!this.centerTab) {
                let style: string = '';
                if (!isNullOrUndefined(tabStop)) {
                    value = this.position.paragraph.paragraphFormat.bidi ?
                        (HelperMethods.convertPointToPixel(1584 - tabStop.position))
                        : (HelperMethods.convertPointToPixel(1584 + tabStop.position));
                    const margin: string = ('left:' + ((value - 4) * zoomFactor) + 'px;');
                    style = 'height:9px;overflow:hidden;top:7px;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
                }
                const attributes: Object = {
                    'id': documentEditor.element.id + '_CenterTab' + '_' + i,
                    'class': 'e-de-ruler-tab e-de-ruler-tab-center',
                    style: style,
                    'data-name': 'CenterTab'
                };
                this.centerTab = this.createHtmlElement('div', attributes);
                this.centerTab.setAttribute('title', locale.getConstant('Center Tab'));
                // let svg: SVGElement;
                // Create an SVG element
                const attr: Object = {
                    'id': documentEditor.element.id + '_centerTab_svg',
                    width: rulerSize.width / 2 + 'px',
                    height: rulerSize.height / 2 + 'px',
                    style: 'position:inherit;left:0px'
                };
                const svg: SVGElement = this.createSvgElement('svg', attr);
                svg.setAttribute('fill', 'none');
                const pathattr: Object = {
                    style: 'position:inherit;left:0px'
                };
                // Create a path element inside the SVG
                const pathElement: SVGElement = this.createSvgElement('path', pathattr);
                pathElement.setAttribute('class', 'e-de-ruler-tab-svg');
                pathElement.setAttribute('d', 'M5 5H8V7H0V5H3V1H5V5Z');
                pathElement.setAttribute('fill', '#605E5C');
                pathElement.setAttribute('stroke', '#A1A1A1');
                // Append the path element to the SVG element
                svg.appendChild(pathElement);
                this.centerTab.appendChild(svg);
                this.hRuler.append(this.centerTab);
            }
            break;
        }
        case 'Right': {
            this.rightTab = document.getElementById(documentEditor.element.id + '_RightTab' + '_' + i);
            if (!this.rightTab) {
                let style: string = '';
                if (!isNullOrUndefined(tabStop)) {
                    value = this.position.paragraph.paragraphFormat.bidi ?
                        (HelperMethods.convertPointToPixel(1584 - tabStop.position))
                        : (HelperMethods.convertPointToPixel(1584 + tabStop.position));
                    const margin: string = ('left:' + ((value - 5.5) * zoomFactor) + 'px;');
                    style = 'height:9px;overflow:hidden;top:7px;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
                }
                const attributes: Object = {
                    'id': documentEditor.element.id + '_RightTab' + '_' + i,
                    'class': 'e-de-ruler-tab e-de-ruler-tab-right',
                    style: style,
                    'data-name': 'RightTab'
                };
                this.rightTab = this.createHtmlElement('div', attributes);
                this.rightTab.setAttribute('title', locale.getConstant('Right Tab'));
                // let svg: SVGElement;
                // Create an SVG element
                const attr: Object = {
                    'id': documentEditor.element.id + '_rightTab_svg',
                    width: rulerSize.width / 2 + 'px',
                    height: rulerSize.height / 2 + 'px',
                    style: 'position:inherit;left:0px'
                };
                const svg: SVGElement = this.createSvgElement('svg', attr);
                svg.setAttribute('fill', 'none');
                const pathattr: Object = {
                    style: 'position:inherit;left:0px'
                };
                // Create a path element inside the SVG
                const pathElement: SVGElement = this.createSvgElement('path', pathattr);
                pathElement.setAttribute('class', 'e-de-ruler-tab-svg');
                pathElement.setAttribute('d', 'M5 5V1H7V7H1V5H5Z');
                pathElement.setAttribute('fill', '#605E5C');
                pathElement.setAttribute('stroke', '#A1A1A1');
                // Append the path element to the SVG element
                svg.appendChild(pathElement);
                this.rightTab.appendChild(svg);
                this.hRuler.append(this.rightTab);
            }
            break;
        }
        case 'Decimal': {
            this.decimalTab = document.getElementById(documentEditor.element.id + '_DecimalTab' + '_' + i);
            if (!this.decimalTab) {
                let style: string = '';
                if (!isNullOrUndefined(tabStop)) {
                    value = this.position.paragraph.paragraphFormat.bidi ?
                        (HelperMethods.convertPointToPixel(1584 - tabStop.position))
                        : (HelperMethods.convertPointToPixel(1584 + tabStop.position));
                    const margin: string = ('left:' + ((value * zoomFactor) - 4) + 'px;');
                    style = 'height:9px;overflow:hidden;top:7px;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
                }
                const attributes: Object = {
                    'id': documentEditor.element.id + '_DecimalTab' + '_' + i,
                    'class': 'e-de-ruler-tab e-de-ruler-tab-decimal',
                    style: style,
                    'data-name': 'DecimalTab'
                };
                this.decimalTab = this.createHtmlElement('div', attributes);
                this.decimalTab.setAttribute('title', locale.getConstant('Decimal Tab'));
                // const svg: SVGElement;
                // Create an SVG element
                const attr: Object = {
                    'id': documentEditor.element.id + '_decimalTab_svg',
                    width: rulerSize.width / 2 + 'px',
                    height: rulerSize.height / 2 + 'px',
                    style: 'position:inherit;left:0px'
                };
                const svg: SVGElement = this.createSvgElement('svg', attr);
                svg.setAttribute('fill', 'none');
                const pathattr: Object = {
                    style: 'position:inherit;left:0px'
                };
                // Create a path element inside the SVG
                const pathElement: SVGElement = this.createSvgElement('path', pathattr);
                pathElement.setAttribute('class', 'e-de-ruler-tab-svg');
                pathElement.setAttribute('d', 'M6 0H4V6H0V8H4H6H10V6H6V0Z');
                pathElement.setAttribute('fill', '#605E5C');
                pathElement.setAttribute('clip-rule', 'evenodd');
                pathElement.setAttribute('fill-rule', 'evenodd');
                pathElement.setAttribute('stroke', '#A1A1A1');
                // Append the path element to the SVG element
                svg.appendChild(pathElement);
                this.decimalTab.appendChild(svg);
                this.hRuler.append(this.decimalTab);
            }
            break;
        }
        case 'Bar': {
            this.barTab = document.getElementById(documentEditor.element.id + '_BarTab' + '_' + i);
            if (!this.barTab) {
                let style: string = '';
                if (!isNullOrUndefined(tabStop)) {
                    value = this.position.paragraph.paragraphFormat.bidi ?
                        (HelperMethods.convertPointToPixel(1584 - tabStop.position))
                        : (HelperMethods.convertPointToPixel(1584 + tabStop.position));
                    const margin: string = ('left:' + ((value - 1.5) * zoomFactor) + 'px;');
                    style = 'height:9px;overflow:hidden;top:7px;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
                }
                const attributes: Object = {
                    'id': documentEditor.element.id + '_BarTab' + '_' + i,
                    'class': 'e-de-ruler-tab e-de-ruler-tab-bar',
                    style: style,
                    'data-name': 'BarTab'
                };
                this.barTab = this.createHtmlElement('div', attributes);
                this.barTab.setAttribute('title', locale.getConstant('Bar Tab'));
                // const svg: SVGElement;
                // Create an SVG element
                const attr: Object = {
                    'id': documentEditor.element.id + '_barTab_svg',
                    width: rulerSize.width / 2 + 'px',
                    height: rulerSize.height / 2 + 'px',
                    style: 'position:inherit;left:0px'
                };
                const svg: SVGElement = this.createSvgElement('svg', attr);
                svg.setAttribute('fill', 'none');
                const rectAttr: Object = {
                    style: 'position:inherit;left:0px'
                };
                const rect: SVGElement = this.createSvgElement('rect', rectAttr);
                rect.setAttribute('width', '2');
                rect.setAttribute('height', '8');
                rect.setAttribute('fill', '#605E5C');
                rect.setAttribute('stroke', '#A1A1A1');
                // Append the path element to the SVG element
                svg.appendChild(rect);
                this.barTab.appendChild(svg);
                this.hRuler.append(this.barTab);
            }
            break;
        }
        }
        if (!isNullOrUndefined(tabStop)) {
            this.tabStopElement = document.getElementById(documentEditor.element.id + '_' + tabJustification + 'Tab' + '_' + i);
            if (!isNullOrUndefined(tabStop)) {
                this.tabStopElement.addEventListener('dblclick', this.onTabStopDblClickHandler);
            }
            this.tabInitialValue = HelperMethods.getNumberFromString(this.tabStopElement.style.left); // for mouse up event
            const initialValue2: number = HelperMethods.getNumberFromString(this.tabStopElement.style.left); // for mouse move event
            this.justification = this.tabStopElement.getAttribute('data-name');
            this.currrentParagraph = this.position.paragraph;
            this.tabStopElement.addEventListener('mousedown', this.onTabStopMouseDownHandler);
            this.tabStopElement.addEventListener('mouseup', this.onTabStopMouseUpHandler);

            document.addEventListener('mousemove', this.onTabStopMouseMoveHandler);

            document.addEventListener('mouseup', this.onRenderTabStopMouseUpHandler);
        }

    }

    public updateMargin(ruler: Ruler, documentEditor: DocumentEditor, isHorizontal: boolean): void {
        if (isHorizontal) {
            ruler.startMargin = documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin;
            ruler.endMargin = documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin;
        } else {
            ruler.startMargin = documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin;
            ruler.endMargin = documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.bottomMargin;
        }
    }


    public getTabJustification(dataNameValue: string): TabJustification {
        switch (dataNameValue) {
        case 'LeftTab':
            return 'Left';
        case 'CenterTab':
            return 'Center';
        case 'RightTab':
            return 'Right';
        case 'DecimalTab':
            return 'Decimal';
        case 'BarTab':
            return 'Bar';
        }
        return 'Left';
    }

    /**
     * getRulerSize method \
     *
     * @returns {void} getRulerSize method .\
     * @param { DocumentEditor} documentEditor - provide the documentEditor  value.
     * @private
     */
    public getRulerSize(documentEditor: DocumentEditor): Size {
        let top: number = 0;
        let left: number = 0;
        //if (diagram.rulerSettings.showRulers) {
        // top = documentEditor.documentEditorSettings.rulerSettings.horizontalRuler.thickness;
        // left = documentEditor.documentEditorSettings.rulerSettings.verticalRuler.thickness;
        top = 15;
        left = 15;
        //}
        return new Size(left, top);
    }

    public destroy(): void {
        this.unWireEvents();
        this.removeHTMLElements();
        this.removeSvgElements();
    }

    private removeHTMLElements(): void {
        if (this.tabStopStwitch) {
            this.tabStopStwitch.remove();
            this.tabStopStwitch = null;
        }
        if (this.hRulerBottom) {
            this.hRulerBottom.remove();
            this.hRulerBottom = null;
        }
        if (this.vRulerBottom) {
            this.vRulerBottom.remove();
            this.vRulerBottom = null;
        }
        if (this.overlap) {
            this.overlap.remove();
            this.overlap = null;
        }
        if (this.markIndicator) {
            this.markIndicator.remove();
            this.markIndicator = null;
        }
        if (this.rulerDiv) {
            this.rulerDiv.remove();
            this.rulerDiv = null;
        }
        if (this.rulerOverlap) {
            this.rulerOverlap.remove();
            this.rulerOverlap = null;
        }
        if (this.rulerMarginDiv) {
            this.rulerMarginDiv.remove();
            this.rulerMarginDiv = null;
        }
        if (this.verticalRulerMarginDiv) {
            this.verticalRulerMarginDiv.remove();
            this.verticalRulerMarginDiv = null;
        }
        if (this.firstLineIndent) {
            this.firstLineIndent.remove();
            this.firstLineIndent = null;
        }
        if (this.hangingIndent) {
            this.hangingIndent.remove();
            this.hangingIndent = null;
        }
        if (this.leftIndent) {
            this.leftIndent.remove();
            this.leftIndent = null;
        }
        if (this.rightIndent) {
            this.rightIndent.remove();
            this.rightIndent = null;
        }

        if (this.parentRulerDiv) {
            this.parentRulerDiv.remove();
            this.parentRulerDiv = null;
        }
        if (this.rulerSpaceDiv) {
            this.rulerSpaceDiv.remove();
            this.rulerSpaceDiv = null;
        }
        if (this.firstLineIndentRuler) {
            this.firstLineIndentRuler.remove();
            this.firstLineIndentRuler = null;
        }
        if (this.hangingIndentRuler) {
            this.hangingIndentRuler.remove();
            this.hangingIndentRuler = null;
        }

        if (this.leftTab) {
            this.leftTab.childNodes.forEach((element: HTMLElement) => {
                this.leftTab.removeChild(element);
                element = null;
            });
            this.leftTab.innerHTML = '';
            this.leftTab.remove();
            this.leftTab = null;
        }
        if (this.rightTab) {
            this.rightTab.childNodes.forEach((element: HTMLElement) => {
                this.rightTab.removeChild(element);
                element = null;
            });
            this.rightTab.innerHTML = '';
            this.rightTab.remove();
            this.rightTab = null;
        }
        if (this.centerTab) {
            this.centerTab.childNodes.forEach((element: HTMLElement) => {
                this.centerTab.removeChild(element);
                element = null;
            });
            this.centerTab.innerHTML = '';
            this.centerTab.remove();
            this.centerTab = null;
        }
        if (this.decimalTab) {
            this.decimalTab.childNodes.forEach((element: HTMLElement) => {
                this.decimalTab.removeChild(element);
                element = null;
            });
            this.decimalTab.innerHTML = '';
            this.decimalTab.remove();
            this.decimalTab = null;
        }
        if (this.barTab) {
            this.barTab.childNodes.forEach((element: HTMLElement) => {
                this.barTab.removeChild(element);
                element = null;
            });
            this.barTab.innerHTML = '';
            this.barTab.remove();
            this.barTab = null;
        }
        if (this.vRuler) {
            this.vRuler.childNodes.forEach((element: HTMLElement) => {
                this.vRuler.removeChild(element);
                element = null;
            });
            this.vRuler.innerHTML = '';
            this.vRuler.remove();
            this.vRuler = null;
        }
        if (this.hRuler) {
            this.hRuler.childNodes.forEach((element: HTMLElement) => {
                this.hRuler.removeChild(element);
                element = null;
            });
            this.hRuler.innerHTML = '';
            this.hRuler.remove();
            this.hRuler = null;
        }
    }

    private removeSvgElements(): void {
        if (this.hSvg) {
            this.hSvg.remove();
            this.hSvg = null;
        }
        if (this.vLine) {
            this.vLine.remove();
            this.vLine = null;
        }
        if (this.vSvg) {
            this.vSvg.remove();
            this.vSvg = null;
        }
        if (this.hLine) {
            this.hLine.remove();
            this.hLine = null;
        }
        if (this.firstLineIndentSvg) {
            this.firstLineIndentSvg.remove();
            this.firstLineIndentSvg = null;
        }
        if (this.firstLineIndentPath) {
            this.firstLineIndentPath.remove();
            this.firstLineIndentPath = null;
        }
        if (this.hangingIndentSvg) {
            this.hangingIndentSvg.remove();
            this.hangingIndentSvg = null;
        }
        if (this.hangingIndentPath) {
            this.hangingIndentPath.remove();
            this.hangingIndentPath = null;
        }
        if (this.rightIndentSvg) {
            this.rightIndentSvg.remove();
            this.rightIndentSvg = null;
        }
        if (this.rightIndentPath) {
            this.rightIndentPath.remove();
            this.rightIndentPath = null;
        }
        if (this.leftIndentSvg) {
            this.leftIndentSvg.remove();
            this.leftIndentSvg = null;
        }
        if (this.leftIndentPath) {
            this.leftIndentPath.remove();
            this.leftIndentPath = null;
        }
    }

    private unWireEvents(): void {
        if (this.markIndicator) {
            this.markIndicator.removeEventListener('click', this.onmarkIndicatorClickHandler);
        }
        if (this.rulerDiv) {
            this.rulerDiv.removeEventListener('dblclick', this.onRulerDblClickHandler);
        }
        if (this.hRuler) {
            this.hRuler.removeEventListener('mouseenter', this.onHRulerMouseEnterHandler);
            this.hRuler.removeEventListener('mouseleave', this.onHRulerMouseLeaveHandler);
            this.hRuler.removeEventListener('mousedown', this.onHRulerMouseDownHandler);
            this.hRuler.removeEventListener('mouseup', this.onHRulerMouseUpHandler);
        }
        if (this.vRuler) {
            this.vRuler.removeEventListener('mousedown', this.onVMouseDownHandler);
        }
        if (this.firstLineIndent) {
            this.firstLineIndent.removeEventListener('dblclick', this.onDoubleClickHandler);
            this.firstLineIndent.removeEventListener('mouseenter', this.onDocumentIntentTrueChangeHandler);
            this.firstLineIndent.removeEventListener('mouseleave', this.onDocumentIntentFalseChangeHandler);
            this.firstLineIndent.removeEventListener('mousedown', this.onFirstLineIndentMouseDownHandler);
        }
        document.removeEventListener('mousemove', this.onHorizontalRulerMouseMoveHandler);
        document.removeEventListener('mouseup', this.onRulerMouseUpHandler);
        document.removeEventListener('mousemove', this.onVMouseMoveHandler);

        document.removeEventListener('mouseup', this.onVMouseUpHandler);
        document.removeEventListener('mousemove', this.onIndentMouseMoveHandler);

        document.removeEventListener('mouseup', this.onIndentMouseUpHandler);
        if (this.leftIndent) {
            this.leftIndent.removeEventListener('dblclick', this.onDoubleClickHandler);
            this.leftIndent.removeEventListener('mouseenter', this.onDocumentIntentTrueChangeHandler);
            this.leftIndent.removeEventListener('mouseleave', this.onDocumentIntentFalseChangeHandler);
            this.leftIndent.removeEventListener('mousedown', this.onLeftIndentMouseDownHandler);
        }

        document.removeEventListener('mousemove', this.onLeftIndentMouseMoveHandler);

        document.removeEventListener('mouseup', this.onLeftIndentMouseUpHandler);
        if (this.hangingIndent) {
            this.hangingIndent.removeEventListener('dblclick', this.onDoubleClickHandler);
            this.hangingIndent.removeEventListener('mouseenter', this.onDocumentIntentTrueChangeHandler);
            this.hangingIndent.removeEventListener('mouseleave', this.onDocumentIntentFalseChangeHandler);
            this.hangingIndent.removeEventListener('mousedown', this.onHangIndentMouseDownHandler);
        }

        document.removeEventListener('mousemove', this.onHangIndentMouseMoveHandler);

        document.removeEventListener('mouseup', this.onHangIndentMouseUpHandler);
        if (this.rightIndent) {
            this.rightIndent.removeEventListener('dblclick', this.onDoubleClickHandler);
            this.rightIndent.removeEventListener('mouseenter', this.onDocumentIntentTrueChangeHandler);
            this.rightIndent.removeEventListener('mouseleave', this.onDocumentIntentFalseChangeHandler);
            this.rightIndent.removeEventListener('mousedown', this.onRightIndentMouseDownHandler);
        }

        document.removeEventListener('mousemove', this.onRightIndentMouseMoveHandler);

        document.removeEventListener('mouseup', this.onRightIndentMouseUpHandler);
        if (this.tabStopElement) {
            this.tabStopElement.removeEventListener('dblclick', this.onTabStopDblClickHandler);
            this.tabStopElement.removeEventListener('mousedown', this.onTabStopMouseDownHandler);
            this.tabStopElement.removeEventListener('mouseup', this.onTabStopMouseUpHandler);
        }

        document.removeEventListener('mousemove', this.onTabStopMouseMoveHandler);

        document.removeEventListener('mouseup', this.onRenderTabStopMouseUpHandler);
        //Set the handler to undefined
        this.onmarkIndicatorClickHandler = undefined;
        // this.onHorizontalRulerMousemoveHandler = undefined;
        // this.onHRulerMouseEnterHandler = undefined;
        // this.onHRulerMouseLeaveHandler = undefined;
        // this.onHRulerMouseDownHandler = undefined;
        // this.onHRulerMouseUpHandler = undefined;
    }
}
