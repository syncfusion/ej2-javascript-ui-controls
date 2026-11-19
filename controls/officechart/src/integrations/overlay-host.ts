/**
 * Interface and models for overlay rendering and management across Office components (Spreadsheet, Document Editor, Presentation).
 */

import { createElement as ej2CreateElement, getComponent } from '@syncfusion/ej2-base';

export type OverlayHandleMode = 4 | 8;

export interface IOverlayCompleteEventArgs {
    id: string;
    prevTop: number;
    prevLeft: number;
    currentTop: number;
    currentLeft: number;
    prevHeight: number;
    prevWidth: number;
    currentHeight: number;
    currentWidth: number;
    actionType?: 'move' | 'resize' | 'none';
    resizerHandle?: string;
    requestType?: string;
    isChart?: boolean;
    element: HTMLElement;
}

export interface IOverlayHost {
    /**
     * Target parent container to append or reposition the overlay.
     */
    getParentElement(isFreezePane?: boolean, inSheetContent?: boolean): HTMLElement;

    /**
     * The root host element (e.g. Spreadsheet.element).
     */
    getRootElement(): HTMLElement;

    /**
     * Optional element creation method (e.g. parent.createElement).
     */
    createElement?<K extends keyof HTMLElementTagNameMap>(tagName: K, properties?: Object): HTMLElementTagNameMap[K];
    createElement?(tagName: string, properties?: Object): HTMLElement;

    /**
     * Boundary offset constraints [topOffset, leftOffset] for dragging/resizing.
     */
    getCheckOffset?(): [number, number];

    /**
     * Check if the host is protected (e.g. sheet protected).
     */
    isProtected?(): boolean;

    /**
     * Check if the host allows editing (e.g. allowEditing).
     */
    isAllowEditing?(): boolean;

    /**
     * Custom validation for drag targets.
     */
    isValidDragTarget?(target: HTMLElement): boolean;

    /**
     * Reparenting when clicking inside frozen panes.
     */
    onFreezePaneClick?(overlayElem: HTMLElement): void;

    /**
     * Callback when overlay or handle is selected / activated.
     */
    onOverlaySelect?(id: string, isChart: boolean, isResizer: boolean, prevActiveId?: string): void;

    /**
     * Continuous callback during resizing to update content preview (e.g. refreshChartSize).
     */
    onOverlayResizeProgress?(id: string, width: string, height: string, element: HTMLElement): void;

    /**
     * Reparenting / position adjustment when dropping outside freeze pane headers.
     */
    onFreezePaneDrop?(overlayElem: HTMLElement, currentRowIdx?: number, currentColIdx?: number): void;

    /**
     * Dedicated callback fired when overlay dragging / moving completes.
     */
    onOverlayMoved?(args: IOverlayCompleteEventArgs): void;

    /**
     * Dedicated callback fired when overlay resizing completes.
     */
    onOverlayResized?(args: IOverlayCompleteEventArgs): void;

    /**
     * Callback on mouse-up / touch-end after drag or resize completes.
     */
    onOverlayComplete?(args: IOverlayCompleteEventArgs): void;

    /**
     * Optional cleanup method when the host is destroyed or detached.
     */
    destroy?(): void;
}

/**
 * Ready-to-use base implementation of IOverlayHost for Doc / PPTX consumers.
 */
export class DefaultOverlayHost implements IOverlayHost {
    private rootElement: HTMLElement;

    constructor(rootElement: HTMLElement) {
        this.rootElement = rootElement;
    }

    public getParentElement(isFreezePane?: boolean, inSheetContent?: boolean): HTMLElement {
        void isFreezePane;
        void inSheetContent;
        return this.rootElement;
    }

    public getRootElement(): HTMLElement {
        return this.rootElement;
    }

    public createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, properties?: Object): HTMLElementTagNameMap[K];
    public createElement(tagName: string, properties?: Object): HTMLElement {
        return ej2CreateElement(tagName, properties as { [key: string]: Object });
    }

    public isValidDragTarget(target: HTMLElement): boolean {
        return this.rootElement ? this.rootElement.contains(target) : false;
    }

    public onOverlayResizeProgress(id: string, width: string, height: string, element: HTMLElement): void {
        void id;
        const chartSelector: string = '.e-datavisualization-chart, .e-control.e-chart, .e-control.e-accumulationchart';
        const chartEl: HTMLElement = element.querySelector(chartSelector) || (element.firstElementChild as HTMLElement);
        if (chartEl) {
            const compObj: { height?: string, width?: string } =
                getComponent(chartEl, 'chart') || getComponent(chartEl, 'accumulationchart');
            if (compObj) {
                compObj.height = height;
                compObj.width = width;
            }
        }
    }

    public onOverlayResized(args: IOverlayCompleteEventArgs): void {
        if (args && args.element) {
            this.refreshChart(args.element);
        }
    }

    public onOverlayMoved(args: IOverlayCompleteEventArgs): void {
        void args;
    }

    public onOverlayComplete(args: IOverlayCompleteEventArgs): void {
        if (args && args.element && args.actionType !== 'move') {
            this.refreshChart(args.element);
        }
    }

    private refreshChart(element: HTMLElement): void {
        const chartSelector: string = '.e-datavisualization-chart, .e-control.e-chart, .e-control.e-accumulationchart';
        const chartEl: HTMLElement = element.querySelector(chartSelector) || (element.firstElementChild as HTMLElement);
        if (chartEl) {
            const compObj: { refresh?: () => void } = getComponent(chartEl, 'chart') || getComponent(chartEl, 'accumulationchart');
            if (compObj) {
                compObj.refresh();
            }
        }
    }

    public destroy(): void {
        this.rootElement = null;
    }
}
