import { PdfViewer, IContextMenu } from '../index';
import { PdfViewerBase } from './pdfviewer-base';

/**
 * ContextMenu module is used to handle the context menus used in the control.
 *
 * @hidden
 */
export class BlazorContextMenu implements IContextMenu {
    /**
     * @private
     */
    public contextMenuElement: HTMLElement;
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    public currentTarget: any;

    /**
     * @private
     */
    public previousAction: string;
    /**
     * Initialize the constructor of blazorcontext
     *
     * @param { PdfViewer } pdfViewer - Specified PdfViewer class.
     * @param { PdfViewerBase } pdfViewerBase - The pdfViewerBase.
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * Create the context menu.
     *
     * @returns {void}
     */
    public createContextMenu(): void {
        const htmlCollection: HTMLCollection = document.getElementsByClassName( this.pdfViewer.element.id + '_context_menu');
        if (htmlCollection) {
            this.contextMenuElement = htmlCollection[0] as HTMLElement;
            if (this.contextMenuElement.children && this.contextMenuElement.children.length > 0) {
                const htmlElement: HTMLElement = this.contextMenuElement.children[0] as HTMLElement;
                htmlElement.className = htmlElement.className + ' ' + 'e-pv-context-menu';
            }
        }
    }
    /**
     * open the context menu.
     *
     * @param {number} top - The top.
     * @param {number} left - The left.
     * @param {HTMLElement} target - The target.
     * @returns {void}
     */
    public open(top: number, left: number, target: HTMLElement): void {
        this.pdfViewer._dotnetInstance.invokeMethodAsync('OpenContextMenu', top, left);
    }
    /**
     * close the context menu.
     *
     * @returns {void}
     */
    public close(): void {
        this.pdfViewer._dotnetInstance.invokeMethodAsync('CloseContextMenu');
    }
    /**
     * destroy the context menu.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.previousAction = '';
        this.contextMenuElement =  null;
    }

    public OnItemSelected(selectedMenu: any): void {
        if (typeof selectedMenu === 'string') {
            this.pdfViewerBase.OnItemSelected(selectedMenu);
        } else {
            this.pdfViewerBase.OnItemSelected(selectedMenu[0]);
        }
    }
}
