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
    // tslint:disable-next-line
    private currentTarget: any;
    /**
     * @private
     */
    public previousAction: string;
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
        this.copyContextMenu = [{ text: this.pdfViewer.localeObj.getConstant('Cut'), iconCss: 'e-pv-cut-icon' },
        { text: this.pdfViewer.localeObj.getConstant('Copy'), iconCss: 'e-pv-copy-icon' },
        { text: this.pdfViewer.localeObj.getConstant('Highlight context'), iconCss: 'e-pv-highlight-icon' },
        { text: this.pdfViewer.localeObj.getConstant('Underline context'), iconCss: 'e-pv-underline-icon' },
        { text: this.pdfViewer.localeObj.getConstant('Strikethrough context'), iconCss: 'e-pv-strikethrough-icon' },
        { text: this.pdfViewer.localeObj.getConstant('Paste'), iconCss: 'e-pv-paste-icon' },
        { text: this.pdfViewer.localeObj.getConstant('Delete Context'), iconCss: 'e-pv-delete-icon' },
        { text: this.pdfViewer.localeObj.getConstant('Scale Ratio'), iconCss: 'e-pv-scale-ratio-icon' },
        { separator: true, id: pdfViewer.element.id + '_context_menu_comment_separator' },
        { text: this.pdfViewer.localeObj.getConstant('Comment'), iconCss: 'e-pv-comment-icon' },
        { separator: true, id: pdfViewer.element.id + '_context_menu_separator' },
        { text: this.pdfViewer.localeObj.getConstant('Properties') }
        ];
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

    private setTarget(args: BeforeOpenCloseMenuEventArgs): HTMLElement {
        let target: HTMLElement = null;
        if (args.event && args.event.target) {
            target = args.event.target as HTMLElement;
            this.currentTarget = target;
        }
        return target;
    }

    private contextMenuOnBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        let target: HTMLElement = this.setTarget(args);
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus && target && target.className === 'free-text-input' && target.tagName === 'TEXTAREA') {
            this.pdfViewerBase.isFreeTextContextMenu = true;
        }
        // tslint:disable-next-line:max-line-length
        this.contextMenuObj.showItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Copy'), this.pdfViewer.localeObj.getConstant('Paste'),
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'), this.pdfViewer.localeObj.getConstant('Strikethrough context'),
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Scale Ratio'), this.pdfViewer.localeObj.getConstant('Comment'), this.pdfViewer.localeObj.getConstant('Properties')]);
        this.pdfViewerBase.getElement('_context_menu_separator').classList.remove('e-menu-hide');
        this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.remove('e-menu-hide');
        // tslint:disable-next-line:max-line-length
        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Copy'), this.pdfViewer.localeObj.getConstant('Paste'), this.pdfViewer.localeObj.getConstant('Delete Context')], true);
        if (this.pdfViewer.textSelectionModule || this.pdfViewerBase.isShapeBasedAnnotationsEnabled()) {
            if (args.event) {
                let isClickWithinSelectionBounds: boolean = this.isClickWithinSelectionBounds(args.event);
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewerBase.isFreeTextContextMenu) {
                    this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'), this.pdfViewer.localeObj.getConstant('Strikethrough context'), this.pdfViewer.localeObj.getConstant('Properties'), this.pdfViewer.localeObj.getConstant('Comment'),
                    this.pdfViewer.localeObj.getConstant('Scale Ratio'), this.pdfViewer.localeObj.getConstant('Delete Context')]);
                    this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
                    this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.add('e-menu-hide');
                    // tslint:disable-next-line:max-line-length
                    if (this.pdfViewer.annotation.freeTextAnnotationModule && this.pdfViewer.annotation.freeTextAnnotationModule.isTextSelected) {
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Copy')], true);
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Cut')], true);
                    } else {
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Copy')], false);
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Cut')], false);
                        window.getSelection().removeAllRanges();
                    }
                    // tslint:disable-next-line:max-line-length
                    if (this.pdfViewer.annotation.freeTextAnnotationModule && this.pdfViewer.annotation.freeTextAnnotationModule.selectedText !== '') {
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Paste')], true);
                    } else {
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Paste')], false);
                    }
                } else if (isClickWithinSelectionBounds && this.pdfViewer.textSelectionModule) {
                    // tslint:disable-next-line:max-line-length
                    if ((!(args.event.target as HTMLElement).classList.contains('e-pv-maintaincontent') && (args.event.target as HTMLElement).classList.contains('e-pv-text') || (args.event.target as HTMLElement).classList.contains('e-pv-text-layer'))) {
                        args.cancel = true;
                        // tslint:disable-next-line:max-line-length
                    } else if ((Browser.isIE || Browser.info.name === 'edge') && (args.event.target as HTMLElement).classList.contains('e-pv-page-container')) {
                        args.cancel = true;
                    }
                    // tslint:disable-next-line:max-line-length
                    this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Paste'), this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Scale Ratio'), this.pdfViewer.localeObj.getConstant('Comment'), this.pdfViewer.localeObj.getConstant('Properties')]);
                    this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
                    this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.add('e-menu-hide');
                    // tslint:disable-next-line:max-line-length
                } else if (this.pdfViewer.selectedItems.annotations.length !== 0 && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature') {
                    this.onOpeningForShape(false, true);
                    // tslint:disable-next-line:max-line-length
                } else if (this.pdfViewer.selectedItems.annotations.length !== 0 && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType !== 'Path') {
                    this.onOpeningForShape(true);
                } else {
                    // tslint:disable-next-line:max-line-length
                    if (this.pdfViewer.annotation && this.pdfViewer.annotation.isShapeCopied && ((args.event.target as HTMLElement).classList.contains('e-pv-text-layer') ||
                        (args.event.target as HTMLElement).classList.contains('e-pv-text')) && !this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        this.onOpeningForShape(false);
                        // tslint:disable-next-line:max-line-length
                    } else if (this.pdfViewerBase.isCalibrateAnnotationModule() && this.pdfViewer.annotationModule.measureAnnotationModule.currentAnnotationMode !== '') {
                        // tslint:disable-next-line:max-line-length
                        this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'), this.pdfViewer.localeObj.getConstant('Strikethrough context'), this.pdfViewer.localeObj.getConstant('Properties')]);
                        this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
                        this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.remove('e-menu-hide');
                        // tslint:disable-next-line:max-line-length
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Copy'), this.pdfViewer.localeObj.getConstant('Paste'), this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Comment')], false);
                    } else if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        // tslint:disable-next-line:max-line-length
                        this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'), this.pdfViewer.localeObj.getConstant('Strikethrough context'), this.pdfViewer.localeObj.getConstant('Properties'), this.pdfViewer.localeObj.getConstant('Cut'),
                        this.pdfViewer.localeObj.getConstant('Copy'), this.pdfViewer.localeObj.getConstant('Paste'), this.pdfViewer.localeObj.getConstant('Scale Ratio')]);
                        this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
                        this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.remove('e-menu-hide');
                        // tslint:disable-next-line:max-line-length
                        this.contextMenuObj.showItems([this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Comment')], false);
                    } else {
                        args.cancel = true;
                    }
                }
            } else if (this.pdfViewer.textSelectionModule && (this.pdfViewer.contextMenuOption === 'MouseUp')) {
                // tslint:disable-next-line:max-line-length
                this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Paste'), this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Scale Ratio'), this.pdfViewer.localeObj.getConstant('Comment'), this.pdfViewer.localeObj.getConstant('Properties')]);
                this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
                this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.add('e-menu-hide');
            } else {
                this.hideContextItems();
            }
            this.enableCommentPanelItem();
        } else {
            args.cancel = true;
        }
        if (this.pdfViewer.contextMenuOption === 'None') {
            args.cancel = true;
        }
    }
    private hideContextItems(): void {
        if (this.pdfViewer.selectedItems.annotations.length === 0) {
            // tslint:disable-next-line:max-line-length
            this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Paste'), this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Scale Ratio'), this.pdfViewer.localeObj.getConstant('Properties')]);
            this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
        }
    }

    private enableCommentPanelItem(): void {
        if (this.pdfViewer.enableCommentPanel) {
            this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Comment')], true);
        } else {
            this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Comment')], false);
        }
    }

    private onOpeningForShape(isProp: boolean, isSignature?: boolean): void {
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.isShapeCopied) {
            this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Paste')], true);
        } else {
            this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Paste')], false);
        }
        // tslint:disable-next-line:max-line-length
        this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'), this.pdfViewer.localeObj.getConstant('Strikethrough context'), this.pdfViewer.localeObj.getConstant('Scale Ratio')]);
        if (isProp) {
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewer.selectedItems.annotations.length !== 0 && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead' ||
                this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance')) {
                this.contextMenuObj.showItems([this.pdfViewer.localeObj.getConstant('Properties')]);
            } else {
                this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Properties')]);
                this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
            }
        } else if (isSignature) {
            // tslint:disable-next-line:max-line-length
            this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Properties'), this.pdfViewer.localeObj.getConstant('Comment')]);
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
            this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.add('e-menu-hide');
        } else {
            this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Copy'),
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Properties'), this.pdfViewer.localeObj.getConstant('Comment')]);
            this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
            this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.add('e-menu-hide');
        }
    }

    // tslint:disable-next-line
    private isClickWithinSelectionBounds(event: any): boolean {
        let isWithin: boolean = false;
        if (this.pdfViewer.textSelectionModule) {
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
        // tslint:disable-next-line
        let target: any = this.currentTarget;
        switch (args.item.text) {
            case this.pdfViewer.localeObj.getConstant('Copy'):
                let isSkip: boolean = false;
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewerBase.isFreeTextContextMenu || (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus)) {
                    this.pdfViewer.annotation.freeTextAnnotationModule.copySelectedText();
                    this.contextMenuObj.close();
                    isSkip = true;
                } else if (this.pdfViewer.textSelectionModule) {
                    this.pdfViewer.textSelectionModule.copyText();
                    this.contextMenuObj.close();
                }
                if (this.pdfViewer.selectedItems.annotations.length && !isSkip) {
                    this.pdfViewer.copy();
                    this.previousAction = 'Copy';
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Highlight context'):
                if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Highlight');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Underline context'):
                if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Underline');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Strikethrough context'):
                if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Strikethrough');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Properties'):
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead' ||
                    this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
                    this.pdfViewer.annotation.createPropertiesWindow();
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Cut'):
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewerBase.isFreeTextContextMenu || this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus && (target && target.className === 'free-text-input' && target.tagName === 'TEXTAREA')) {
                    this.pdfViewer.annotation.freeTextAnnotationModule.cutSelectedText(target);
                    this.contextMenuObj.close();
                } else if (this.pdfViewer.selectedItems.annotations.length === 1) {
                    let pageIndex: number = this.pdfViewer.selectedItems.annotations[0].pageIndex;
                    this.pdfViewer.cut();
                    this.pdfViewer.clearSelection(pageIndex);
                    this.previousAction = 'Cut';
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Paste'):
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewerBase.isFreeTextContextMenu || this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus && (target && target.className === 'free-text-input' && target.tagName === 'TEXTAREA')) {
                    this.pdfViewer.annotation.freeTextAnnotationModule.pasteSelectedText(target);
                    this.contextMenuObj.close();
                } else {
                    this.pdfViewer.paste();
                    this.previousAction = 'Paste';
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Delete Context'):
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.deleteAnnotation();
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Scale Ratio'):
                if (this.pdfViewerBase.isCalibrateAnnotationModule()) {
                    this.pdfViewer.annotation.measureAnnotationModule.createScaleRatioWindow();
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Comment'):
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.showCommentsPanel();
                    if (this.pdfViewer.selectedItems.annotations.length !== 0 ||
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        // tslint:disable-next-line
                        let currentAnnotation: any;
                        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                            currentAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
                        } else {
                            currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
                        }
                        // tslint:disable-next-line
                        let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                        if (accordionExpand) {
                            accordionExpand.ej2_instances[0].expandItem(true);
                        }
                        // tslint:disable-next-line
                        let commentsDiv: any = document.getElementById(currentAnnotation.annotName);
                        if (commentsDiv) {
                            if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                                commentsDiv.firstChild.click();
                            }
                        }
                    }
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
        if (this.contextMenuObj) {
            this.previousAction = '';
            this.contextMenuObj.destroy();
        }
    }
}