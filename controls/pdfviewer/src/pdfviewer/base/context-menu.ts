import { createElement, Browser } from '@syncfusion/ej2-base';
import { ContextMenu as Context, MenuEventArgs, MenuItemModel, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { PdfViewer, PdfViewerBase } from '../index';

/**
 * ContextMenu module is used to handle the context menus used in the control.
 * @hidden
 */
export class ContextMenu {

    /**
     * @private
     */
    public contextMenuObj: Context;
    /**
     * @private
     */
    public contextMenuElement: HTMLElement;
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private copyContextMenu: MenuItemModel[] = [];
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
        this.copyContextMenu = [{ text: this.pdfViewer.localeObj.getConstant('Copy'), iconCss: 'e-pv-copy-icon' },
        { text: this.pdfViewer.localeObj.getConstant('Highlight context'), iconCss: 'e-pv-highlight-icon' },
        { text: this.pdfViewer.localeObj.getConstant('Underline context'), iconCss: 'e-pv-underline-icon' },
        { text: this.pdfViewer.localeObj.getConstant('Strikethrough context'), iconCss: 'e-pv-strikethrough-icon' }];
    }
    /**
     * @private
     */
    public createContextMenu(): void {
        this.contextMenuElement = createElement('ul', { id: this.pdfViewer.element.id + '_context_menu' });
        this.pdfViewer.element.appendChild(this.contextMenuElement);
        this.contextMenuObj = new Context({
            target: '#' + this.pdfViewerBase.viewerContainer.id, items: this.copyContextMenu,
            beforeOpen: this.contextMenuOnBeforeOpen.bind(this), select: this.onMenuItemSelect.bind(this),
            created: this.contextMenuOnCreated.bind(this)
        });
        if (this.pdfViewer.enableRtl) {
            this.contextMenuObj.enableRtl = true;
        }
        this.contextMenuObj.appendTo(this.contextMenuElement);
        if (Browser.isDevice) {
            this.contextMenuObj.animationSettings.effect = 'ZoomIn';
        } else {
            this.contextMenuObj.animationSettings.effect = 'SlideDown';
        }
    }

    private contextMenuOnCreated(args: Event): void {
        // tslint:disable-next-line:max-line-length
        let items: string[] = [this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'),
        this.pdfViewer.localeObj.getConstant('Strikethrough context')];
        if (this.pdfViewer.annotationModule) {
            if (!this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
                this.contextMenuObj.enableItems(items, false);
            }
        } else {
            this.contextMenuObj.enableItems(items, false);
        }
    }

    private contextMenuOnBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        if (this.pdfViewer.textSelectionModule) {
            if (args.event) {
                let isClickWithinSelectionBounds: boolean = this.isClickWithinSelectionBounds(args.event);
                // tslint:disable-next-line:max-line-length
                if (isClickWithinSelectionBounds) {
                     // tslint:disable-next-line:max-line-length
                    if ((!(args.event.target as HTMLElement).classList.contains('e-pv-maintaincontent') && (args.event.target as HTMLElement).classList.contains('e-pv-text') || (args.event.target as HTMLElement).classList.contains('e-pv-text-layer'))) {
                        args.cancel = true;
                        // tslint:disable-next-line:max-line-length
                    } else if ((Browser.isIE || Browser.info.name === 'edge') && (args.event.target as HTMLElement).classList.contains('e-pv-page-container')) {
                        args.cancel = true;
                    }
                } else {
                    args.cancel = true;
                }
            }
        } else {
            args.cancel = true;
        }
    }

    // tslint:disable-next-line
    private isClickWithinSelectionBounds(event: any): boolean {
        let isWithin: boolean = false;
        let bounds: ClientRect = this.pdfViewer.textSelectionModule.getCurrentSelectionBounds(this.pdfViewerBase.currentPageNumber - 1);
        if (bounds) {
            let currentBound: ClientRect = bounds;
            if (this.getHorizontalValue(currentBound.left) < event.clientX && this.getHorizontalValue(currentBound.right) >
                event.clientX && this.getVerticalValue(currentBound.top) < event.clientY &&
                this.getVerticalValue(currentBound.bottom) > event.clientY) {
                isWithin = true;
            }
        }
        if ((Browser.isIE || Browser.info.name === 'edge') && bounds) {
            isWithin = true;
        }
        return isWithin;
    }

    private getHorizontalClientValue(value: number): number {
        let pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        let pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value - pageBounds.left);
    }

    private getVerticalClientValue(value: number): number {
        let pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        let pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value - pageBounds.top);
    }

    private getHorizontalValue(value: number): number {
        let pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        let pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value * this.pdfViewerBase.getZoomFactor()) + pageBounds.left;
    }

    private getVerticalValue(value: number): number {
        let pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        let pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value * this.pdfViewerBase.getZoomFactor()) + pageBounds.top;
    }

    private onMenuItemSelect(args: MenuEventArgs): void {
        switch (args.item.text) {
            case this.pdfViewer.localeObj.getConstant('Copy'):
                if (this.pdfViewer.textSelectionModule) {
                    this.pdfViewer.textSelectionModule.copyText();
                    this.contextMenuObj.close();
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Highlight context'):
                if (this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Highlight');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Underline context'):
                if (this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Underline');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Strikethrough context'):
                if (this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Strikethrough');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                }
                break;
            default:
                break;
        }
    }

    /**
     * @private
     */
    public destroy(): void {
        this.contextMenuObj.destroy();
    }
}