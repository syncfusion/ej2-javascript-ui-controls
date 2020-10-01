import { PdfViewer, IContextMenu } from '../index';
import { PdfViewerBase } from './pdfviewer-base';

/**
 * ContextMenu module is used to handle the context menus used in the control.
 * @hidden
 */
export class BlazorContextMenu implements IContextMenu {

    /**
     * @private
     */
    public contextMenuElement: HTMLElement;
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    // tslint:disable-next-line
    public currentTarget: any;

    /**
     * @private
     */
    public previousAction: string;

    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    public createContextMenu(): void {
        let htmlCollection: HTMLCollection = document.getElementsByClassName( this.pdfViewer.element.id + '_context_menu');
        if (htmlCollection) {
            this.contextMenuElement = htmlCollection[0] as HTMLElement;
            if (this.contextMenuElement.children && this.contextMenuElement.children.length > 0) {
                let htmlElement: HTMLElement = this.contextMenuElement.children[0] as HTMLElement;
                htmlElement.className = htmlElement.className + ' ' + 'e-pv-context-menu';
            }
        }
    }
    public open(top: number, left: number, target: HTMLElement): void {
        this.pdfViewer._dotnetInstance.invokeMethodAsync('OpenContextMenu', top, left);
    }
    public close(): void {
        this.pdfViewer._dotnetInstance.invokeMethodAsync('CloseContextMenu');
    }
    public destroy(): void {
        this.previousAction = '';
        this.contextMenuElement =  null;
    }

    // tslint:disable-next-line
    public OnItemSelected(selectedMenu: any): void {
        if (typeof selectedMenu === 'string') {
            this.pdfViewerBase.OnItemSelected(selectedMenu);
        } else {
            this.pdfViewerBase.OnItemSelected(selectedMenu[0]);
        }
    }
} 