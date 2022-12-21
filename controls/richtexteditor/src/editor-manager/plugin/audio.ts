import { createElement, isNullOrUndefined as isNOU, detach, addClass, Browser } from '@syncfusion/ej2-base';
import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import * as classes from './../base/classes';
import { IHtmlItem } from './../base/interface';
import { InsertHtml } from './inserthtml';
/**
 * Audio internal component
 *
 * @hidden
 * @deprecated
 */
export class AudioCommand {
    private parent: EditorManager;
    /**
     * Constructor for creating the Audio plugin
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
        this.parent.observer.on(CONSTANT.AUDIO, this.audioCommand, this);
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
        const value: string = e.value.toString().toLowerCase();
        if (value === 'inline' || value === 'break' || value === 'audioremove') {
            selectNode = e.item.selectNode[0] as HTMLElement;
        }
        switch (value) {
        case 'audio':
        case 'audioreplace':
            this.createAudio(e);
            break;
        case 'inline':
            selectNode.removeAttribute('class');
            (selectNode.closest('.' + classes.CLASS_AUDIO_WRAP) as HTMLElement).style.display = 'inline-block';
            addClass([selectNode], [classes.CLASS_AUDIO, classes.CLASS_AUDIO_INLINE, classes.CLASS_AUDIO_FOCUS]);
            this.callBack(e);
            break;
        case 'break':
            selectNode.removeAttribute('class');
            (selectNode.closest('.' + classes.CLASS_AUDIO_WRAP) as HTMLElement).style.display = 'block';
            addClass([selectNode], [classes.CLASS_AUDIO_BREAK, classes.CLASS_AUDIO, classes.CLASS_AUDIO_FOCUS]);
            this.callBack(e);
            break;
        case 'audioremove':
            detach(selectNode);
            this.callBack(e);
            break;
        }
    }

    private createAudio(e: IHtmlItem): void {
        let isReplaced: boolean = false;
        let wrapElement: HTMLElement;
        if (!isNOU(e.item.selectParent) && (e.item.selectParent[0] as HTMLElement).classList &&
        ((e.item.selectParent[0] as HTMLElement).classList.contains(classes.CLASS_CLICK_ELEM) ||
        (e.item.selectParent[0] as HTMLElement).classList.contains(classes.CLASS_AUDIO_WRAP))) {
            const audioEle: HTMLSourceElement = (e.item.selectParent[0] as HTMLElement).querySelector('source') as HTMLSourceElement;
            this.setStyle(audioEle, e);
            isReplaced = true;
        } else {
            wrapElement = createElement('span', { className: classes.CLASS_AUDIO_WRAP, attrs: { contentEditable: 'false', title: e.item.fileName }});
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
            if (wrapElement.nextElementSibling === null) {
                const insertElem: HTMLElement = createElement('br');
                wrapElement.parentNode.insertBefore(insertElem, wrapElement.nextSibling);
            }
        }
        if (e.callBack && (isNOU(e.selector) || !isNOU(e.selector) && e.selector !== 'pasteCleanupModule')) {
            const selectedNode: Node = this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)[0];
            const audioElm: Element = (e.value === 'AudioReplace' || isReplaced) ? (e.item.selectParent[0] as Element).querySelector('audio')
                : (Browser.isIE ? (selectedNode as Element) : (selectedNode as Element).querySelector('audio'));
            audioElm.addEventListener('loadeddata', () => {
                if (e.value !== 'AudioReplace' || !isReplaced) {
                    e.callBack({
                        requestType: 'Audios',
                        editorMode: 'HTML',
                        event: e.event,
                        range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                        elements: [audioElm]
                    });
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
        sourceElement.type = e.item.fileName && e.item.fileName.split('.').length > 0 ?
            'audio/' + e.item.fileName.split('.')[e.item.fileName.split('.').length - 1] :
            e.item.url && e.item.url.split('.').length > 0 ? 'audio/' + e.item.url.split('.')[e.item.url.split('.').length - 1]  : '';
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
