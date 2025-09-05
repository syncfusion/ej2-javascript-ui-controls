import { createElement, isNullOrUndefined as isNOU, detach, addClass, Browser } from '@syncfusion/ej2-base';
import * as CONSTANT from './../base/constant';
import * as classes from './../base/classes';
import { IHtmlItem } from './../base/interface';
import { InsertHtml } from './inserthtml';
import * as EVENTS from './../../common/constant';
import { scrollToCursor } from '../../common/util';
import { IEditorModel } from '../../common/interface';

/**
 * Audio internal component
 *
 * @hidden
 * @deprecated
 */
export class AudioCommand {
    private parent: IEditorModel;
    /**
     * Constructor for creating the Audio plugin
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
        this.parent.observer.on(CONSTANT.AUDIO, this.audioCommand, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }
    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.AUDIO, this.audioCommand);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }
    /**
     * audioCommand method
     *
     * @param {IHtmlItem} e - specifies the element
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public audioCommand(e: IHtmlItem): void {
        let selectNode: HTMLElement;
        let audiowrapper: HTMLElement;
        const value: string = e.value.toString().toLowerCase();
        if (value === 'inline' || value === 'break' || value === 'audioremove') {
            selectNode = e.item.selectNode[0] as HTMLElement;
            audiowrapper = selectNode.closest('.' + classes.CLASS_AUDIO_WRAP) as HTMLElement;
        }
        switch (value) {
        case 'audio':
        case 'audioreplace':
            this.createAudio(e);
            break;
        case 'inline':
            selectNode.removeAttribute('class');
            audiowrapper.style.display = 'inline-block';
            addClass([selectNode], [classes.CLASS_AUDIO, classes.CLASS_AUDIO_INLINE, classes.CLASS_AUDIO_FOCUS]);
            this.callBack(e);
            break;
        case 'break':
            selectNode.removeAttribute('class');
            audiowrapper.style.display = 'block';
            addClass([selectNode], [classes.CLASS_AUDIO_BREAK, classes.CLASS_AUDIO, classes.CLASS_AUDIO_FOCUS]);
            this.callBack(e);
            break;
        case 'audioremove':
            if (audiowrapper) {
                detach(audiowrapper);
            } else {
                detach(selectNode);
            }
            this.callBack(e);
            break;
        }
    }

    private createAudio(e: IHtmlItem): void {
        let isReplaced: boolean = false;
        let wrapElement: HTMLElement;
        if (!isNOU(e.item.selectParent) && (e.item.selectParent[0] as HTMLElement).classList &&
        ((e.item.selectParent[0] as HTMLElement).classList.contains(classes.CLASS_CLICK_ELEM) ||
        (e.item.selectParent[0] as HTMLElement).classList.contains(classes.CLASS_AUDIO_WRAP) || (e.item.selectParent[0] as HTMLElement).tagName === 'AUDIO')) {
            const audioEle: HTMLSourceElement = (e.item.selectParent[0] as HTMLElement).querySelector('source') as HTMLSourceElement;
            this.setStyle(audioEle, e);
            isReplaced = true;
        } else {
            wrapElement = createElement('span', { className: classes.CLASS_AUDIO_WRAP, attrs: { contentEditable: 'false', title: ((!isNOU(e.item.title)) ? e.item.title : (!isNOU(e.item.fileName) ? e.item.fileName : '')) }});
            const audElement: HTMLElement = createElement('audio', { className: classes.CLASS_AUDIO + ' ' + classes.CLASS_AUDIO_INLINE, attrs: { controls: '' }});
            const sourceElement: HTMLElement = createElement('source');
            const clickElement: HTMLElement = createElement('span', { className: classes.CLASS_CLICK_ELEM});
            this.setStyle((sourceElement as HTMLSourceElement), e);
            audElement.appendChild(sourceElement);
            clickElement.appendChild(audElement);
            wrapElement.appendChild(clickElement);
            if (!isNOU(e.item.selection)) {
                e.item.selection.restore();
            }
            InsertHtml.Insert(this.parent.currentDocument, wrapElement, this.parent.editableElement);
            if (!isNOU(e.item.selection)) {
                const range: Range = e.item.selection.getRange(this.parent.currentDocument);
                const focusNode: Node = document.createTextNode(' ');
                const node: Node = this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)[0];
                wrapElement.parentNode.insertBefore(focusNode, node.nextSibling);
                e.item.selection.save(range, this.parent.currentDocument);
            }
        }
        if (e.callBack && (isNOU(e.selector) || !isNOU(e.selector) && e.selector !== 'pasteCleanupModule')) {
            const selectedNode: Node = this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)[0];
            const audioElm: Element = (e.value === 'AudioReplace' || isReplaced) ? (((e.item.selectParent[0] as Element).tagName.toLowerCase() === 'audio') ? e.item.selectParent[0] as Element : (e.item.selectParent[0] as Element).querySelector('audio'))
                : (Browser.isIE ? (selectedNode as Element) : (selectedNode as Element).querySelector('audio'));
            audioElm.addEventListener('loadeddata', () => {
                if (e.value !== 'AudioReplace' || !isReplaced) {
                    if (!isNOU(this.parent.currentDocument)) {
                        if (this.parent.userAgentData.isSafari()) {
                            scrollToCursor(this.parent.currentDocument, this.parent.editableElement as HTMLElement);
                        }
                        e.callBack({
                            requestType: 'Audios',
                            editorMode: 'HTML',
                            event: e.event,
                            range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                            elements: [audioElm]
                        });
                    }
                }
            });
            if (isReplaced) {
                (audioElm as HTMLAudioElement).load();
            }
        }
    }

    private setStyle(sourceElement: HTMLSourceElement, e: IHtmlItem): void {
        if (!isNOU(e.item.url)) {
            sourceElement.setAttribute('src', e.item.url);
        }
        const fileExtension: string = e.item.fileName ? e.item.fileName.split('.').pop().toLowerCase() :
            e.item.url ? e.item.url.split('.').pop().toLowerCase() : '';
        if (fileExtension === 'opus') {
            sourceElement.type = 'audio/ogg';
        } else if (fileExtension === 'm4a') {
            sourceElement.type = 'audio/mp4';
        } else {
            sourceElement.type = e.item.fileName && e.item.fileName.split('.').length > 0 ?
                'audio/' + e.item.fileName.split('.')[e.item.fileName.split('.').length - 1] :
                e.item.url && e.item.url.split('.').length > 0 ? 'audio/' + e.item.url.split('.')[e.item.url.split('.').length - 1] : '';
        }
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
