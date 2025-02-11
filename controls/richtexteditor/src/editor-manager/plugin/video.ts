import { createElement, isNullOrUndefined as isNOU, detach, addClass, Browser, formatUnit, removeClass } from '@syncfusion/ej2-base';
import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import * as classes from './../base/classes';
import { IHtmlItem } from './../base/interface';
import { InsertHtml } from './inserthtml';
import * as EVENTS from './../../common/constant';
import { NodeSelection } from '../../selection';

/**
 * Video internal component
 *
 * @hidden
 * @deprecated
 */
export class VideoCommand {
    private parent: EditorManager;
    private vidElement: HTMLElement;
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
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }
    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.VIDEO, this.videoCommand);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
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
        let embededClass: string = '';
        const value: string = e.value.toString().toLowerCase();
        if (value !== 'video' && value !== 'videoreplace') {
            selectNode = e.item.selectNode[0] as HTMLElement;
            videoWrapNode = selectNode.closest('.' + classes.CLASS_EMBED_VIDEO_WRAP) as HTMLElement;
            videoClickElem = selectNode.closest('.' + classes.CLASS_VIDEO_CLICK_ELEM) as HTMLElement;
        }
        if (selectNode) {
            embededClass = selectNode.classList.contains('e-rte-embed-url') ? 'e-rte-embed-url' : '';
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
            } else if (selectNode.parentElement.nextElementSibling != null) {
                addClass([selectNode], embededClass === '' ? [classes.CLASS_VIDEO, classes.CLASS_VIDEO_LEFT] : [classes.CLASS_VIDEO, classes.CLASS_VIDEO_LEFT, embededClass]);
                (selectNode.parentElement.nextElementSibling as HTMLElement).style.clear = 'left';
            } else {
                addClass([selectNode], embededClass === '' ? [classes.CLASS_VIDEO, classes.CLASS_VIDEO_LEFT] : [classes.CLASS_VIDEO, classes.CLASS_VIDEO_LEFT, embededClass]);
            }
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
            addClass([selectNode], embededClass === '' ? [classes.CLASS_VIDEO, classes.CLASS_VIDEO_CENTER] : [classes.CLASS_VIDEO, classes.CLASS_VIDEO_CENTER, embededClass]);
            this.callBack(e);
            break;
        case 'justifyright':
            selectNode.removeAttribute('class');
            if (videoWrapNode) {
                videoWrapNode.style.display = 'block';
            }
            if (videoClickElem) {
                selectNode.parentElement.style.cssFloat = 'right';
            } else if (selectNode.parentElement.nextElementSibling != null) {
                addClass([selectNode], embededClass === '' ? [classes.CLASS_VIDEO, classes.CLASS_VIDEO_RIGHT] : [classes.CLASS_VIDEO, classes.CLASS_VIDEO_LEFT, embededClass]);
                (selectNode.parentElement.nextElementSibling as HTMLElement).style.clear = 'right';
            } else {
                addClass([selectNode], embededClass === '' ? [classes.CLASS_VIDEO, classes.CLASS_VIDEO_RIGHT] : [classes.CLASS_VIDEO, classes.CLASS_VIDEO_RIGHT, embededClass]);
            }
            this.callBack(e);
            break;
        case 'videoremove':
            detach(selectNode.parentElement);
            this.callBack(e);
            break;
        }
    }
    private wrapVideo( e: IHtmlItem ): HTMLElement {
        let wrapElement: HTMLElement;
        let sourceElement: HTMLElement;
        if (e.item.isEmbedUrl) {
            wrapElement = createElement('span', { className: classes.CLASS_EMBED_VIDEO_WRAP, attrs: { contentEditable: 'false' }});
            const clickElement: HTMLElement = createElement('span', { className: classes.CLASS_VIDEO_CLICK_ELEM });
            const temp: HTMLElement = createElement('template');
            temp.innerHTML = e.item.fileName;
            clickElement.appendChild((temp as HTMLTemplateElement).content);
            this.vidElement = sourceElement = clickElement.firstElementChild as HTMLElement;
            this.setStyle((sourceElement as HTMLSourceElement), e, this.vidElement);
            wrapElement.style.display = (e.item.cssClass === classes.CLASS_VIDEO_INLINE) ? 'inline-block' : 'block';
            wrapElement.appendChild(clickElement);
        }
        else {
            wrapElement = createElement('span', { className: classes.CLASS_VIDEO_WRAP, attrs: { contentEditable: 'false', title: ((!isNOU(e.item.title)) ? e.item.title : (!isNOU(e.item.fileName) ? e.item.fileName : '')) }});            this.vidElement = createElement('video', { className: classes.CLASS_VIDEO + ' ' + classes.CLASS_VIDEO_INLINE, attrs: { controls: '' }});
            sourceElement = createElement('source');
            this.setStyle((sourceElement as HTMLSourceElement), e, this.vidElement);
            this.vidElement.appendChild(sourceElement);
            wrapElement.appendChild(this.vidElement);
        }
        return wrapElement;
    }

    private createVideo(e: IHtmlItem): void {
        let isReplaced: boolean = false;
        let wrapElement: HTMLElement;
        if (e.value === 'VideoReplace' && !isNOU(e.item.selectParent) && ((e.item.selectParent[0] as HTMLElement).tagName === 'VIDEO')) {
            if (e.item.isEmbedUrl) {
                wrapElement = this.wrapVideo(e);
                const oldEle : HTMLElement = e.item.selection.range.startContainer as HTMLElement;
                oldEle.parentNode.replaceChild(wrapElement, oldEle);
            } else {
                const videoEle: HTMLSourceElement = (e.item.selectParent[0] as HTMLElement).querySelector('source') as HTMLSourceElement;
                this.setStyle(videoEle, e, videoEle);
                isReplaced = true;
            }
        } else if (e.value === 'VideoReplace' && !isNOU(e.item.selectParent) && isNOU((e.item.selectParent[0] as HTMLElement).querySelector('iframe')) &&
        (e.item.selectParent[0] as HTMLElement).classList &&
        (e.item.selectParent[0] as HTMLElement).classList.contains(classes.CLASS_VIDEO_CLICK_ELEM)) {
            (e.item.selectParent[0] as HTMLElement).innerHTML = e.item.fileName;
            this.setStyle(((e.item.selectParent[0] as HTMLElement).firstElementChild as HTMLIFrameElement), e,
                          ((e.item.selectParent[0] as HTMLElement).firstElementChild as HTMLIFrameElement));
        } else if (e.value === 'VideoReplace' && !isNOU(e.item.selectParent) && !isNOU((e.item.selectParent[0] as HTMLElement).querySelector('iframe')) &&
        !e.item.isEmbedUrl) {
            wrapElement = this.wrapVideo(e);
            const oldEle : HTMLElement = e.item.selection.range.startContainer as HTMLElement;
            oldEle.parentNode.replaceChild(wrapElement, oldEle);
        }
        else {
            if (!e.item.isEmbedUrl) {
                if (e.value === 'VideoReplace'){
                    const closestEmbedVideoWrap : HTMLElement = (e.item.selection.range.startContainer as HTMLElement).closest('.e-embed-video-wrap') as HTMLElement | null;
                    if (!isNOU(closestEmbedVideoWrap)) {
                        closestEmbedVideoWrap.remove();
                    }
                }
                wrapElement = this.wrapVideo(e);
            } else {
                wrapElement = this.wrapVideo(e);
            }
            if (!isNOU(e.item.selection)) {
                e.item.selection.restore();
            }
            InsertHtml.Insert(this.parent.currentDocument, wrapElement, this.parent.editableElement);
            if (!isNOU(e.item.selection)) {
                const range: Range = e.item.selection.getRange(this.parent.currentDocument);
                const save: NodeSelection = e.item.selection.save(range, this.parent.currentDocument);
            }
            if (wrapElement.nextElementSibling === null) {
                const insertElem: HTMLElement = createElement('br');
                wrapElement.parentNode.insertBefore(insertElem, wrapElement.nextSibling);
            }
        }
        if (e.callBack && (isNOU(e.selector) || !isNOU(e.selector) && e.selector !== 'pasteCleanupModule')) {
            const selectedNode: Node = this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)[0];
            let videoElm: Element;
            if (e.value === 'VideoReplace' || isReplaced) {
                if (!e.item.isEmbedUrl) {
                    videoElm = e.item.selectParent[0] as Element;
                } else if (e.item.isEmbedUrl){
                    if (!isNOU(wrapElement)) {
                        videoElm = wrapElement.querySelector('iframe');
                    }
                } else {
                    videoElm = (e.item.selectParent[0] as Element).querySelector('iframe');
                }
            } else {
                videoElm = !e.item.isEmbedUrl ? (selectedNode as Element).tagName === 'VIDEO' ? (selectedNode as Element) : (selectedNode as Element).lastElementChild : (selectedNode as Element).querySelector('iframe');
            }
            videoElm.addEventListener(videoElm.tagName !== 'IFRAME' ? 'loadeddata' : 'load', () => {
                if (e.value !== 'VideoReplace' || !isReplaced) {
                    if (e.item.isEmbedUrl && videoElm) {
                        videoElm.classList.add('e-rte-embed-url');
                    }
                    if (!isNOU(this.parent.currentDocument)) {
                        e.callBack({
                            requestType: 'Videos',
                            editorMode: 'HTML',
                            event: e.event,
                            range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                            elements: [videoElm]
                        });
                    }
                }
            });
            if (isReplaced) {
                (videoElm as HTMLVideoElement).load();
            }
            if (Browser.userAgent.indexOf('Firefox') !== -1) {
                this.vidElement.addEventListener('play', () => { this.editAreaVideoClick(e); });
                this.vidElement.addEventListener('pause', () => { this.editAreaVideoClick(e); });
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
        if (e.item.url !== '' && !isNOU(e.item.url) && isNOU(sourceElement) ? false : sourceElement.nodeName.toLowerCase() !== 'iframe') {
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
        if (!isNOU(e.item.cssClass)) {
            if (e.item.cssClass === classes.CLASS_VIDEO_BREAK) {
                addClass([videoEle], [classes.CLASS_VIDEO_BREAK]);
                removeClass([videoEle], [classes.CLASS_VIDEO_INLINE]);
            }
            else {
                addClass([videoEle], [classes.CLASS_VIDEO_INLINE]);
                removeClass([videoEle], [classes.CLASS_VIDEO_BREAK]);
            }
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
        }
        if (e.item.height !== 'auto') {
            selectNode.style.height = formatUnit(e.item.height as number);
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
