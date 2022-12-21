import { createElement, isNullOrUndefined as isNOU, detach, addClass, Browser, formatUnit } from '@syncfusion/ej2-base';
import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import * as classes from './../base/classes';
import { IHtmlItem } from './../base/interface';
import { InsertHtml } from './inserthtml';
/**
 * Video internal component
 *
 * @hidden
 * @deprecated
 */
export class VideoCommand {
    private parent: EditorManager;
    /**
     * Constructor for creating the Video plugin
     *
     * @param {EditorManager} parent - specifies the parent element
     * @hidden
     * @deprecated
     */
    public constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.VIDEO, this.videoCommand, this);
    }
    /**
     * videoCommand method
     *
     * @param {IHtmlItem} e - specifies the element
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public videoCommand(e: IHtmlItem): void {
        let selectNode: HTMLElement;
        let videoWrapNode: HTMLElement;
        let videoClickElem: HTMLElement;
        const value: string = e.value.toString().toLowerCase();
        if (value !== 'video' && value !== 'videoreplace') {
            selectNode = e.item.selectNode[0] as HTMLElement;
            videoWrapNode = selectNode.closest('.' + classes.CLASS_EMBED_VIDEO_WRAP) as HTMLElement;
            videoClickElem = selectNode.closest('.' + classes.CLASS_VIDEO_CLICK_ELEM) as HTMLElement;
        }
        switch (value) {
        case 'video':
        case 'videoreplace':
            this.createVideo(e);
            break;
        case 'videodimension':
            this.videoDimension(e);
            break;
        case 'inline':
            selectNode.removeAttribute('class');
            if (videoWrapNode) {
                videoWrapNode.style.display = 'inline-block';
            }
            if (videoClickElem) {
                selectNode.parentElement.style.cssFloat = '';
            }
            addClass([selectNode], [classes.CLASS_VIDEO, classes.CLASS_VIDEO_INLINE, classes.CLASS_VIDEO_FOCUS]);
            this.callBack(e);
            break;
        case 'break':
            selectNode.removeAttribute('class');
            if (videoWrapNode) {
                videoWrapNode.style.display = 'block';
            }
            if (videoClickElem) {
                selectNode.parentElement.style.cssFloat = '';
            }
            addClass([selectNode], [classes.CLASS_VIDEO_BREAK, classes.CLASS_VIDEO, classes.CLASS_VIDEO_FOCUS]);
            this.callBack(e);
            break;
        case 'justifyleft':
            selectNode.removeAttribute('class');
            if (videoWrapNode) {
                videoWrapNode.style.display = 'block';
            }
            if (videoClickElem) {
                selectNode.parentElement.style.cssFloat = 'left';
            }
            addClass([selectNode], [classes.CLASS_VIDEO, classes.CLASS_VIDEO_LEFT]);
            this.callBack(e);
            break;
        case 'justifycenter':
            selectNode.removeAttribute('class');
            if (videoWrapNode) {
                videoWrapNode.style.display = 'block';
            }
            if (videoClickElem) {
                selectNode.parentElement.style.cssFloat = '';
            }
            addClass([selectNode], [classes.CLASS_VIDEO, classes.CLASS_VIDEO_CENTER]);
            this.callBack(e);
            break;
        case 'justifyright':
            selectNode.removeAttribute('class');
            if (videoWrapNode) {
                videoWrapNode.style.display = 'block';
            }
            if (videoClickElem) {
                selectNode.parentElement.style.cssFloat = 'right';
            }
            addClass([selectNode], [classes.CLASS_VIDEO, classes.CLASS_VIDEO_RIGHT]);
            this.callBack(e);
            break;
        case 'videoremove':
            detach(selectNode.parentElement);
            this.callBack(e);
            break;
        }
    }

    private createVideo(e: IHtmlItem): void {
        let isReplaced: boolean = false;
        let wrapElement: HTMLElement;
        let vidElement: HTMLElement;
        let sourceElement: HTMLElement;
        if (e.value === 'VideoReplace' && !isNOU(e.item.selectParent) && ((e.item.selectParent[0] as HTMLElement).tagName === 'VIDEO')) {
            const videoEle: HTMLSourceElement = (e.item.selectParent[0] as HTMLElement).querySelector('source') as HTMLSourceElement;
            this.setStyle(videoEle, e, videoEle);
            isReplaced = true;
        } else if (e.value === 'VideoReplace' && !isNOU(e.item.selectParent) &&
        (e.item.selectParent[0] as HTMLElement).classList &&
        (e.item.selectParent[0] as HTMLElement).classList.contains(classes.CLASS_VIDEO_CLICK_ELEM)) {
            (e.item.selectParent[0] as HTMLElement).innerHTML = e.item.fileName;
            this.setStyle(((e.item.selectParent[0] as HTMLElement).firstElementChild as HTMLIFrameElement), e,
                          ((e.item.selectParent[0] as HTMLElement).firstElementChild as HTMLIFrameElement));
        } else {
            if (!e.item.isEmbedUrl) {
                wrapElement = createElement('span', { className: classes.CLASS_VIDEO_WRAP, attrs: { contentEditable: 'false', title: e.item.fileName }});
                vidElement = createElement('video', { className: classes.CLASS_VIDEO + ' ' + classes.CLASS_VIDEO_INLINE, attrs: { controls: '' }});
                sourceElement = createElement('source');
                this.setStyle((sourceElement as HTMLSourceElement), e, vidElement);
                vidElement.appendChild(sourceElement);
                wrapElement.appendChild(vidElement);
            } else {
                wrapElement = createElement('span', { className: classes.CLASS_EMBED_VIDEO_WRAP, attrs: { contentEditable: 'false' }});
                const clickElement: HTMLElement = createElement('span', { className: classes.CLASS_VIDEO_CLICK_ELEM });
                const temp: HTMLElement = createElement('template');
                temp.innerHTML = e.item.fileName;
                clickElement.appendChild((temp as HTMLTemplateElement).content);
                vidElement = sourceElement = clickElement.firstElementChild as HTMLElement;
                this.setStyle((sourceElement as HTMLSourceElement), e, vidElement);
                wrapElement.appendChild(clickElement);
            }
            if (!isNOU(e.item.selection)) {
                e.item.selection.restore();
            }
            InsertHtml.Insert(this.parent.currentDocument, wrapElement, this.parent.editableElement);
            if (wrapElement.nextElementSibling === null) {
                const insertElem: HTMLElement = createElement('br');
                wrapElement.parentNode.insertBefore(insertElem, wrapElement.nextSibling);
            }
        }
        if (e.callBack && (isNOU(e.selector) || !isNOU(e.selector) && e.selector !== 'pasteCleanupModule')) {
            const selectedNode: Node = this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)[0];
            const videoElm: Element = (e.value === 'VideoReplace' || isReplaced) ? !e.item.isEmbedUrl ? (e.item.selectParent[0] as Element) : (e.item.selectParent[0] as Element).querySelector('iframe')
                : (Browser.isIE ? (selectedNode as Element) : !e.item.isEmbedUrl ? (selectedNode as Element).lastElementChild : (selectedNode as Element).querySelector('iframe'));
            videoElm.addEventListener(videoElm.tagName !== 'IFRAME' ? 'loadeddata' : 'load', () => {
                if (e.value !== 'VideoReplace' || !isReplaced) {
                    e.callBack({
                        requestType: 'Videos',
                        editorMode: 'HTML',
                        event: e.event,
                        range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                        elements: [videoElm]
                    });
                }
            });
            if (isReplaced) {
                (videoElm as HTMLVideoElement).load();
            }
            if (Browser.userAgent.indexOf('Firefox') !== -1) {
                vidElement.addEventListener('play', () => { this.editAreaVideoClick(e); });
                vidElement.addEventListener('pause', () => { this.editAreaVideoClick(e); });
            }
        }
    }
    private editAreaVideoClick(e: IHtmlItem) : void {
        e.callBack({
            requestType: 'VideosPlayPause',
            editorMode: 'HTML',
            event: e.event
        });
    }
    private setStyle(sourceElement: HTMLSourceElement | HTMLElement | HTMLIFrameElement,
                     e: IHtmlItem, videoEle: HTMLSourceElement | HTMLElement | HTMLIFrameElement): void {
        if (e.item.url !== '' && !isNOU(e.item.url)) {
            sourceElement.setAttribute('src', e.item.url);
        }
        if (!e.item.isEmbedUrl) {
            (sourceElement as HTMLSourceElement).type = e.item.fileName && e.item.fileName.split('.').length > 0 ?
                'video/' + e.item.fileName.split('.')[e.item.fileName.split('.').length - 1] :
                e.item.url && e.item.url.split('.').length > 0  ? 'video/' + e.item.url.split('.')[e.item.url.split('.').length - 1] : '';
        }
        if (!isNOU(e.item.width) && !isNOU(e.item.width.width)) {
            videoEle.setAttribute('width', formatUnit(e.item.width.width));
        }
        if (!isNOU(e.item.height) && !isNOU(e.item.height.height)) {
            videoEle.setAttribute('height', formatUnit(e.item.height.height));
        }
        if (!isNOU(e.item.width) && !isNOU(e.item.width.minWidth)) {
            videoEle.style.minWidth = formatUnit(e.item.width.minWidth);
        }
        if (!isNOU(e.item.width) && !isNOU(e.item.width.maxWidth)) {
            videoEle.style.maxWidth = formatUnit(e.item.width.maxWidth);
        }
        if (!isNOU(e.item.height) && !isNOU(e.item.height.minHeight)) {
            videoEle.style.minHeight = formatUnit(e.item.height.minHeight);
        }
        if (!isNOU(e.item.height) && !isNOU(e.item.height.maxHeight)) {
            videoEle.style.maxHeight = formatUnit(e.item.height.maxHeight);
        }
    }

    private videoDimension(e: IHtmlItem): void {
        const selectNode: HTMLVideoElement | HTMLIFrameElement = !((e.item.selectNode[0] as HTMLVideoElement).classList.contains(
            classes.CLASS_VIDEO_CLICK_ELEM)) ? e.item.selectNode[0] as HTMLVideoElement :
            (e.item.selectNode[0] as HTMLVideoElement).querySelector('iframe');
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
