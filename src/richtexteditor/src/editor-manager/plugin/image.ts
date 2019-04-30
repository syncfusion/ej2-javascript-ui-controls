import { createElement, isNullOrUndefined, detach, closest, addClass, removeClass } from '@syncfusion/ej2-base';
import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import * as classes from './../base/classes';
import { IHtmlItem } from './../base/interface';
import { InsertHtml } from './inserthtml';
/**
 * Link internal component
 * @hidden
 */
export class ImageCommand {
    private parent: EditorManager;
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.IMAGE, this.imageCommand, this);
    }
    private imageCommand(e: IHtmlItem): void {
        switch (e.value.toString().toLocaleLowerCase()) {
            case 'image':
            case 'replace':
                this.createImage(e);
                break;
            case 'insertlink':
                this.insertImageLink(e);
                break;
            case 'openimagelink':
                this.openImageLink(e);
                break;
            case 'editimagelink':
                this.editImageLink(e);
                break;
            case 'removeimagelink':
                this.removeImageLink(e);
                break;
            case 'remove':
                this.removeImage(e);
                break;
            case 'alttext':
                this.insertAltTextImage(e);
                break;
            case 'dimension':
                this.imageDimension(e);
                break;
            case 'caption':
                this.imageCaption(e);
                break;
            case 'justifyleft':
                this.imageJustifyLeft(e);
                break;
            case 'justifycenter':
                this.imageJustifyCenter(e);
                break;
            case 'justifyright':
                this.imageJustifyRight(e);
                break;
            case 'inline':
                this.imageInline(e);
                break;
            case 'break':
                this.imageBreak(e);
                break;
        }
    }

    private createImage(e: IHtmlItem): void {
        if (!isNullOrUndefined(e.item.selectParent) && (e.item.selectParent[0] as HTMLElement).tagName === 'IMG') {
            let imgEle: HTMLElement = e.item.selectParent[0] as HTMLElement;
            imgEle.setAttribute('src', e.item.url);
            imgEle.setAttribute('alt', e.item.altText);
        } else {
            let imgElement: HTMLElement = createElement('img', {
                className: 'e-rte-image ' + e.item.cssClass, attrs: {
                    width: (isNullOrUndefined(e.item.width) || isNullOrUndefined(e.item.width.width)) ? 'auto' :
                        e.item.width.width as string,
                    height: (isNullOrUndefined(e.item.height) || isNullOrUndefined(e.item.height.height)) ? 'auto' :
                        e.item.height.height as string,
                    alt: (e.item.altText !== '') ? e.item.altText : ''
                }
            });
            imgElement.setAttribute('src', isNullOrUndefined(e.item.url) ? '' : e.item.url);
            imgElement.style.minWidth = (isNullOrUndefined(e.item.width) || isNullOrUndefined(e.item.width.minWidth)) ? 0 + 'px' :
                e.item.width.minWidth + 'px';
            imgElement.style.maxWidth = (isNullOrUndefined(e.item.width) || isNullOrUndefined(e.item.width.maxWidth)) ? null :
                e.item.width.maxWidth + 'px';
            imgElement.style.minHeight = (isNullOrUndefined(e.item.height) || isNullOrUndefined(e.item.height.minHeight)) ? 0 + 'px' :
                e.item.height.minHeight + 'px';
            imgElement.style.maxHeight = (isNullOrUndefined(e.item.height) || isNullOrUndefined(e.item.height.maxHeight)) ? null :
                e.item.height.maxHeight + 'px';
            if (!isNullOrUndefined(e.item.selection)) {
                e.item.selection.restore();
            }
            InsertHtml.Insert(this.parent.currentDocument, imgElement, this.parent.editableElement);
        }
        if (e.callBack) {
            e.callBack({
                requestType: 'Image',
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }
    private insertImageLink(e: IHtmlItem): void {
        let anchor: HTMLElement = createElement('a', {
            attrs: {
                href: e.item.url
            }
        });
        anchor.appendChild(e.item.selectNode[0]);
        if (!isNullOrUndefined(e.item.target)) {
            anchor.setAttribute('target', e.item.target);
        }
        InsertHtml.Insert(this.parent.currentDocument, anchor, this.parent.editableElement);
        this.callBack(e);
    }
    private openImageLink(e: IHtmlItem): void {
        document.defaultView.open(e.item.url, e.item.target);
        this.callBack(e);
    }
    private removeImageLink(e: IHtmlItem): void {
        detach(closest(e.item.selectParent[0], 'a'));
        InsertHtml.Insert(this.parent.currentDocument, e.item.insertElement, this.parent.editableElement);
        this.callBack(e);
    }
    private editImageLink(e: IHtmlItem): void {
        (e.item.selectNode[0].parentElement as HTMLAnchorElement).href = e.item.url;
        if (isNullOrUndefined(e.item.target)) {
            (e.item.selectNode[0].parentElement as HTMLAnchorElement).removeAttribute('target');
        } else {
            (e.item.selectNode[0].parentElement as HTMLAnchorElement).target = e.item.target;
        }
        this.callBack(e);
    }
    private removeImage(e: IHtmlItem): void {
        if (closest(e.item.selectNode[0], 'a')) {
            detach(closest(e.item.selectNode[0], 'a'));
        } else if (!isNullOrUndefined(closest(e.item.selectNode[0], '.' + classes.CLASS_CAPTION))) {
            detach(closest(e.item.selectNode[0], '.' + classes.CLASS_CAPTION));
        } else {
            detach(e.item.selectNode[0]);
        }
        this.callBack(e);
    }
    private insertAltTextImage(e: IHtmlItem): void {
        (e.item.selectNode[0] as HTMLElement).setAttribute('alt', e.item.altText);
        this.callBack(e);
    }
    private imageDimension(e: IHtmlItem): void {
        let selectNode: HTMLImageElement = e.item.selectNode[0] as HTMLImageElement;
        selectNode.style.height = '';
        selectNode.style.width = '';
        selectNode.width = e.item.width as number;
        selectNode.height = e.item.height as number;
        this.callBack(e);
    }
    private imageCaption(e: IHtmlItem): void {
        InsertHtml.Insert(this.parent.currentDocument, e.item.insertElement, this.parent.editableElement);
        this.callBack(e);
    }
    private imageJustifyLeft(e: IHtmlItem): void {
        let selectNode: HTMLElement = e.item.selectNode[0] as HTMLElement;
        selectNode.removeAttribute('class');
        addClass([selectNode], 'e-rte-image');
        if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLASS_CAPTION))) {
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_RIGHT);
            addClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_LEFT);
        }
        if (selectNode.parentElement.nodeName === 'A') {
            removeClass([selectNode.parentElement], classes.CLASS_IMAGE_RIGHT);
            addClass([selectNode.parentElement], classes.CLASS_IMAGE_LEFT);
        } else {
            addClass([selectNode], classes.CLASS_IMAGE_LEFT);
        }
        this.callBack(e);
    }
    private imageJustifyCenter(e: IHtmlItem): void {
        let selectNode: HTMLElement = e.item.selectNode[0] as HTMLElement;
        selectNode.removeAttribute('class');
        addClass([selectNode], 'e-rte-image');
        if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLASS_CAPTION))) {
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_LEFT);
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_RIGHT);
            addClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_CENTER);
        }
        if (selectNode.parentElement.nodeName === 'A') {
            removeClass([selectNode.parentElement], classes.CLASS_IMAGE_LEFT);
            removeClass([selectNode.parentElement], classes.CLASS_IMAGE_RIGHT);
            addClass([selectNode.parentElement], classes.CLASS_IMAGE_CENTER);
        } else {
            addClass([selectNode], classes.CLASS_IMAGE_CENTER);
        }
        this.callBack(e);
    }
    private imageJustifyRight(e: IHtmlItem): void {
        let selectNode: HTMLElement = e.item.selectNode[0] as HTMLElement;
        selectNode.removeAttribute('class');
        addClass([selectNode], 'e-rte-image');
        if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLASS_CAPTION))) {
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_LEFT);
            addClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_RIGHT);
        }
        if (selectNode.parentElement.nodeName === 'A') {
            removeClass([selectNode.parentElement], classes.CLASS_IMAGE_LEFT);
            addClass([selectNode.parentElement], classes.CLASS_IMAGE_RIGHT);
        } else {
            addClass([selectNode], classes.CLASS_IMAGE_RIGHT);
        }
        this.callBack(e);
    }
    private imageInline(e: IHtmlItem): void {
        let selectNode: HTMLElement = e.item.selectNode[0] as HTMLElement;
        selectNode.removeAttribute('class');
        addClass([selectNode], 'e-rte-image');
        addClass([selectNode], classes.CLASS_IMAGE_INLINE);
        if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLASS_CAPTION))) {
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_BREAK);
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_CENTER);
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_LEFT);
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_RIGHT);
            addClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_CAPTION_INLINE);
        }
        this.callBack(e);
    }
    private imageBreak(e: IHtmlItem): void {
        let selectNode: HTMLElement = e.item.selectNode[0] as HTMLElement;
        selectNode.removeAttribute('class');
        addClass([selectNode], classes.CLASS_IMAGE_BREAK);
        addClass([selectNode], 'e-rte-image');
        if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLASS_CAPTION))) {
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_CAPTION_INLINE);
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_CENTER);
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_LEFT);
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_RIGHT);
            addClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_BREAK);
        }
        this.callBack(e);
    }
    private callBack(e: IHtmlItem): void {
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }
}