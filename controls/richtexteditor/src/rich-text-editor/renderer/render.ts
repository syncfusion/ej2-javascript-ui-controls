import { IRichTextEditor, NotifyArgs } from '../base/interface';
import { RenderType } from '../base/enum';
import * as events from '../base/constant';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { ContentRender } from '../renderer/content-renderer';

/**
 * Content module is used to render RichTextEditor content
 * @hidden
 */
export class Render {
    //Module declarations
    private parent: IRichTextEditor;
    private locator: ServiceLocator;
    private contentRenderer: ContentRender;
    private renderer: RendererFactory;

    /**
     * Constructor for render module
     */
    constructor(parent?: IRichTextEditor, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.renderer = this.locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
    }

    /**
     * To initialize RichTextEditor header, content and footer rendering
     */
    public render(): void {
        let rteObj: IRichTextEditor = this.parent;
        this.contentRenderer = <ContentRender>this.renderer.getRenderer(RenderType.Content);
        this.contentRenderer.renderPanel();
    }

    /** 
     * Refresh the entire RichTextEditor. 
     * @return {void} 
     */
    public refresh(e: NotifyArgs = { requestType: 'refresh' }): void {
        this.parent.notify(`${e.requestType}-begin`, e);
    }
    /** 
     * Destroy the entire RichTextEditor. 
     * @return {void} 
     */
    public destroy(): void {
        this.removeEventListener();
    }

    private addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.modelChanged, this.refresh, this);
        this.parent.on(events.keyUp, this.keyUp, this);
    }
    private removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.modelChanged, this.refresh);
        this.parent.off(events.keyUp, this.keyUp);
    }
    private keyUp(e: NotifyArgs): void {
        if (this.parent.editorMode === 'HTML') {
            switch ((e.args as MouseEvent).which) {
                case 46:
                case 8:
                    let childNodes: Element[] = <NodeListOf<Element> & Element[]>this.parent.contentModule.getEditPanel().childNodes;
                    if ((childNodes.length === 0) ||
                        (childNodes.length === 1 && (((childNodes[0] as Element).tagName === 'BR') ||
                            ((childNodes[0] as Element).tagName === 'P' &&
                                ( childNodes[0].childNodes.length === 0 ||  childNodes[0].textContent === ''))))) {
                        let node: Element = this.parent.contentModule.getEditPanel();
                        node.innerHTML = '<p><br/></p>';
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.contentModule.getDocument(), node.childNodes[0] as Element, 0);
                    }
                    break;
            }
        }
    }
}

