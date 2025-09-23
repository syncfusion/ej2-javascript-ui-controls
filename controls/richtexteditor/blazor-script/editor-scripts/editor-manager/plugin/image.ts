import { createElement, isNullOrUndefined as isNOU, detach, closest, addClass, removeClass, select, Browser, formatUnit } from '../../../../base'; /*externalscript*/
import * as CONSTANT from './../base/constant';
import * as classes from './../base/classes';
import { IHtmlItem } from './../base/interface';
import { InsertHtml } from './inserthtml';
import * as EVENTS from './../../common/constant';
import { scrollToCursor } from '../../common/util';
import { IEditorModel } from '../../common/interface';

/**
 * Link internal component
 *
 * @hidden
 * @deprecated
 */
export class ImageCommand {
    private parent: IEditorModel;
    /**
     * Constructor for creating the Formats plugin
     *
     * @param {IEditorModel} parent - specifies the parent element
     * @hidden
     * @deprecated
     */
    public constructor(parent: IEditorModel) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.IMAGE, this.imageCommand, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.IMAGE, this.imageCommand);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }
    /**
     * imageCommand method
     *
     * @param {IHtmlItem} e - specifies the element
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public imageCommand(e: IHtmlItem): void {
        switch (e.value.toString().toLowerCase()) {
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
        let isReplaced: boolean = false;
        e.item.url = isNOU(e.item.url) || e.item.url === 'undefined' ? e.item.src : e.item.url;
        if (!isNOU(e.item.selectParent) && (e.item.selectParent[0] as HTMLElement).tagName === 'IMG') {
            const imgEle: HTMLElement = e.item.selectParent[0] as HTMLElement;
            isReplaced = true;
            this.setStyle(imgEle, e, isReplaced);
        } else {
            const imgElement: HTMLElement = createElement('img');
            this.setStyle(imgElement, e);
            if (!isNOU(e.item.selection)) {
                e.item.selection.restore();
            }
            if (!isNOU(e.selector) && e.selector === 'pasteCleanupModule') {
                if (!isNOU(this.parent.currentDocument)) {
                    e.callBack({ requestType: 'Images',
                        editorMode: 'HTML',
                        event: e.event,
                        range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                        elements: [imgElement]
                    });
                }
            } else {
                InsertHtml.Insert(this.parent.currentDocument, imgElement, this.parent.editableElement);
            }
        }
        if (e.callBack && (isNOU(e.selector) || !isNOU(e.selector) && e.selector !== 'pasteCleanupModule')) {
            const selectedNode: Node = this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)[0];
            const imgElm: Element = (e.value === 'Replace' || isReplaced) ? (e.item.selectParent[0] as Element) :
                (Browser.isIE ? (selectedNode.previousSibling as Element) : (selectedNode as Element).previousElementSibling);
            const onImageLoadEvent: () => void = () => {
                if (!isNOU(this.parent.currentDocument)) {
                    if (this.parent.userAgentData.isSafari()) {
                        scrollToCursor(this.parent.currentDocument, this.parent.editableElement as HTMLElement);
                    }
                    const imgWidth: string = imgElm.getAttribute('width');
                    const imgHeight: string = imgElm.getAttribute('height');
                    if (isNOU(imgWidth) || imgWidth === 'auto') {
                        imgElm.setAttribute('width', (imgElm as HTMLElement).offsetWidth.toString());
                    }
                    if (isNOU(imgHeight) || imgHeight === 'auto') {
                        imgElm.setAttribute('height', (imgElm as HTMLElement).offsetHeight.toString());
                    }
                    e.callBack({
                        requestType: (e.value === 'Replace') ? (e.item.subCommand = 'Replace', 'Replace') : 'Images',
                        editorMode: 'HTML',
                        event: e.event,
                        range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                        elements: [imgElm]
                    });
                }
                imgElm.removeEventListener('load', onImageLoadEvent);
            };
            imgElm.addEventListener('load', onImageLoadEvent);
        }
    }
    private setStyle(imgElement: HTMLElement, e: IHtmlItem, imgReplace?: boolean): void {
        if (!isNOU(e.item.url)) {
            imgElement.setAttribute('src', e.item.url);
        }
        let alignClassName : string;
        if (imgReplace) {
            const alignClass: { [key: string]: string} = {
                'e-imgcenter': 'e-imgcenter',
                'e-imgright': 'e-imgright',
                'e-imgleft': 'e-imgleft'
            };
            const imgClassList: DOMTokenList = imgElement.classList;
            for (let i: number = 0; i < imgClassList.length; i++) {
                if (!isNOU(alignClass[imgClassList[i as number]])) {
                    alignClassName = alignClass[imgClassList[i as number]];
                }
            }
        }
        imgElement.setAttribute('class', 'e-rte-image' + (isNOU(e.item.cssClass) ? '' :  ' ' + e.item.cssClass)
        + (isNOU(alignClassName) ? '' : ' ' + alignClassName));
        if (!isNOU(e.item.altText)) {
            imgElement.setAttribute('alt', e.item.altText.replace(/\.[a-zA-Z0-9]+$/, ''));
        }
        if (!isNOU(e.item.width) && !isNOU(e.item.width.width)) {
            imgElement.setAttribute('width', this.calculateStyleValue(e.item.width.width));
        }
        if (!isNOU(e.item.height) && !isNOU(e.item.height.height)) {
            imgElement.setAttribute('height', this.calculateStyleValue(e.item.height.height));
        }
        if (!isNOU(e.item.width) && !isNOU(e.item.width.minWidth)) {
            imgElement.style.minWidth = this.calculateStyleValue(e.item.width.minWidth);
        }
        if (!isNOU(e.item.width) && !isNOU(e.item.width.maxWidth)) {
            imgElement.style.maxWidth = this.calculateStyleValue(e.item.width.maxWidth);
        }
        if (!isNOU(e.item.height) && !isNOU(e.item.height.minHeight)) {
            imgElement.style.minHeight = this.calculateStyleValue(e.item.height.minHeight);
        }
        if (!isNOU(e.item.height) && !isNOU(e.item.height.maxHeight)) {
            imgElement.style.maxHeight = this.calculateStyleValue(e.item.height.maxHeight);
        }
    }
    private calculateStyleValue(value: string | number): string {
        let styleValue: string;
        if (typeof(value) === 'string') {
            if (value.indexOf('px') !== -1 || value.indexOf('%') !== -1 || value.indexOf('auto') !== -1) {
                styleValue = value;
            } else {
                styleValue = value + 'px';
            }
        } else {
            styleValue = value + 'px';
        }
        return styleValue;
    }
    private insertImageLink(e: IHtmlItem): void {
        const anchor: HTMLElement = createElement('a', {
            attrs: {
                href: e.item.url
            }
        });
        if (e.item.selectNode[0].parentElement.classList.contains('e-img-wrap')) {
            e.item.selection.restore();
            anchor.setAttribute('contenteditable', 'true');
        }
        anchor.appendChild(e.item.selectNode[0]);
        if (!isNOU(e.item.target)) {
            anchor.setAttribute('target', e.item.target);
        }
        if (!isNOU(e.item.ariaLabel)) {
            anchor.setAttribute('aria-label', e.item.ariaLabel);
        }
        InsertHtml.Insert(this.parent.currentDocument, anchor, this.parent.editableElement);
        this.callBack(e);
    }
    private openImageLink(e: IHtmlItem): void {
        document.defaultView.open(e.item.url, e.item.target);
        this.callBack(e);
    }
    private removeImageLink(e: IHtmlItem): void {
        const selectParent: HTMLElement = e.item.selectParent[0] as HTMLElement;
        if (selectParent.classList.contains('e-img-caption')) {
            const capImgWrap: Element = select('.e-img-wrap', selectParent);
            const textEle: Element = select('.e-img-inner', selectParent);
            const newTextEle: Node = textEle.cloneNode(true);
            detach(select('a', selectParent));
            detach(textEle);
            capImgWrap.appendChild(e.item.insertElement);
            capImgWrap.appendChild(newTextEle);
        } else {
            detach(selectParent);
            if (Browser.isIE && e.item.selection) {
                e.item.selection.restore();
            }
            InsertHtml.Insert(this.parent.currentDocument, e.item.insertElement, this.parent.editableElement);
        }
        this.callBack(e);
    }
    private editImageLink(e: IHtmlItem): void {
        (e.item.selectNode[0].parentElement as HTMLAnchorElement).href = e.item.url;
        if (isNOU(e.item.target)) {
            (e.item.selectNode[0].parentElement as HTMLAnchorElement).removeAttribute('target');
            (e.item.selectNode[0].parentElement as HTMLAnchorElement).removeAttribute('aria-label');
        } else {
            (e.item.selectNode[0].parentElement as HTMLAnchorElement).target = e.item.target;
            (e.item.selectNode[0].parentElement as HTMLElement).setAttribute('aria-label', e.item.ariaLabel);
        }
        this.callBack(e);
    }
    private removeImage(e: IHtmlItem): void {
        if (closest(e.item.selectNode[0], 'a')) {
            if (e.item.selectNode[0].parentElement.nodeName === 'A' && !isNOU(e.item.selectNode[0].parentElement.innerText)) {
                if (!isNOU(closest(e.item.selectNode[0], '.' + classes.CLASS_CAPTION))) {
                    detach(closest(e.item.selectNode[0], '.' + classes.CLASS_CAPTION));
                } else {
                    detach(e.item.selectNode[0]);
                }
            } else {
                detach(closest(e.item.selectNode[0], 'a'));
            }
        } else if (!isNOU(closest(e.item.selectNode[0], '.' + classes.CLASS_CAPTION))) {
            detach(closest(e.item.selectNode[0], '.' + classes.CLASS_CAPTION));
        } else {
            const imgParentElem: HTMLElement = e.item.selectNode[0].parentElement;
            detach(e.item.selectNode[0]);
            if (imgParentElem.childNodes.length === 0) {
                imgParentElem.appendChild(document.createElement('br'));
            }
        }
        this.callBack(e);
    }
    private insertAltTextImage(e: IHtmlItem): void {
        (e.item.selectNode[0] as HTMLElement).setAttribute('alt', e.item.altText);
        this.callBack(e);
    }
    private imageDimension(e: IHtmlItem): void {
        const selectNode: HTMLImageElement = e.item.selectNode[0] as HTMLImageElement;
        selectNode.style.height = '';
        selectNode.style.width = '';
        if (e.item.width !== 'auto') {
            selectNode.style.width =  formatUnit(e.item.width as number);
        } else {
            selectNode.removeAttribute('width');
        }
        if (e.item.height !== 'auto') {
            selectNode.style.height = formatUnit(e.item.height as number);
        } else {
            selectNode.removeAttribute('height');
        }
        this.callBack(e);
    }
    private imageCaption(e: IHtmlItem): void {
        InsertHtml.Insert(this.parent.currentDocument, e.item.insertElement, this.parent.editableElement);
        this.callBack(e);
    }
    private imageJustifyLeft(e: IHtmlItem): void {
        const selectNode: HTMLElement = e.item.selectNode[0] as HTMLElement;
        if (!isNOU(selectNode)) {
            selectNode.removeAttribute('class');
            addClass([selectNode], 'e-rte-image');
            if (!isNOU(closest(selectNode, '.' + classes.CLASS_CAPTION))) {
                removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_RIGHT);
                addClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_LEFT);
            }
            if (selectNode.parentElement.nodeName === 'A') {
                removeClass([selectNode.parentElement], classes.CLASS_IMAGE_RIGHT);
                addClass([selectNode.parentElement], classes.CLASS_IMAGE_LEFT);
                addClass([selectNode], classes.CLASS_IMAGE_LEFT);
            } else if (selectNode.parentElement.nextElementSibling != null) {
                addClass([selectNode], classes.CLASS_IMAGE_LEFT);
                (selectNode.parentElement.nextElementSibling as HTMLElement).style.clear = 'left';
            } else {
                addClass([selectNode], classes.CLASS_IMAGE_LEFT);
            }
            this.callBack(e);
        }
    }
    private imageJustifyCenter(e: IHtmlItem): void {
        const selectNode: HTMLElement = e.item.selectNode[0] as HTMLElement;
        if (!isNOU(selectNode)) {
            selectNode.removeAttribute('class');
            addClass([selectNode], 'e-rte-image');
            if (!isNOU(closest(selectNode, '.' + classes.CLASS_CAPTION))) {
                removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_LEFT);
                removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_RIGHT);
                addClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_CENTER);
            }
            if (selectNode.parentElement.nodeName === 'A') {
                removeClass([selectNode.parentElement], classes.CLASS_IMAGE_LEFT);
                removeClass([selectNode.parentElement], classes.CLASS_IMAGE_RIGHT);
                addClass([selectNode.parentElement], classes.CLASS_IMAGE_CENTER);
                addClass([selectNode], classes.CLASS_IMAGE_CENTER);
            } else {
                addClass([selectNode], classes.CLASS_IMAGE_CENTER);
            }
            this.callBack(e);
        }
    }
    private imageJustifyRight(e: IHtmlItem): void {
        const selectNode: HTMLElement = e.item.selectNode[0] as HTMLElement;
        if (!isNOU(selectNode)) {
            selectNode.removeAttribute('class');
            addClass([selectNode], 'e-rte-image');
            if (!isNOU(closest(selectNode, '.' + classes.CLASS_CAPTION))) {
                removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_LEFT);
                addClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_RIGHT);
            }
            if (selectNode.parentElement.nodeName === 'A') {
                removeClass([selectNode.parentElement], classes.CLASS_IMAGE_LEFT);
                addClass([selectNode.parentElement], classes.CLASS_IMAGE_RIGHT);
                addClass([selectNode], classes.CLASS_IMAGE_RIGHT);
            } else if (selectNode.parentElement.nextElementSibling != null) {
                addClass([selectNode], classes.CLASS_IMAGE_RIGHT);
                (selectNode.parentElement.nextElementSibling as HTMLElement).style.clear = 'right';
            } else {
                addClass([selectNode], classes.CLASS_IMAGE_RIGHT);
            }
            this.callBack(e);
        }
    }
    private imageInline(e: IHtmlItem): void {
        const selectNode: HTMLElement = e.item.selectNode[0] as HTMLElement;
        selectNode.removeAttribute('class');
        addClass([selectNode], 'e-rte-image');
        addClass([selectNode], classes.CLASS_IMAGE_INLINE);
        if (!isNOU(closest(selectNode, '.' + classes.CLASS_CAPTION))) {
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_BREAK);
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_CENTER);
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_LEFT);
            removeClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_IMAGE_RIGHT);
            addClass([closest(selectNode, '.' + classes.CLASS_CAPTION)], classes.CLASS_CAPTION_INLINE);
        }
        this.callBack(e);
    }
    private imageBreak(e: IHtmlItem): void {
        const selectNode: HTMLElement = e.item.selectNode[0] as HTMLElement;
        selectNode.removeAttribute('class');
        addClass([selectNode], classes.CLASS_IMAGE_BREAK);
        addClass([selectNode], 'e-rte-image');
        if (!isNOU(closest(selectNode, '.' + classes.CLASS_CAPTION))) {
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

    public destroy(): void {
        this.removeEventListener();
    }
}
