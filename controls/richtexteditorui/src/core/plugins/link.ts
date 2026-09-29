import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { EditorCommandName, LinkCommand } from '../../controller/interface';
import { IEditorCoreOptions } from '../base/interface';
import * as events from '../constants';

interface LinkExecutionPayload {
    command: EditorCommandName;
    args: ExecuteLinkAttributes;
    callback?: Function;
}

export interface ExecuteLinkAttributes {
    operation?: 'insert' | 'edit' | 'remove' | 'open' | 'copy';
    href: string;
    title?: string | null;
    target?: string | null;
    rel?: string | null;
    displayText?: string;
    element?: HTMLElement
}

export class Link {
    public parent: IEditorCoreOptions;

    constructor(parent?: IEditorCoreOptions) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(events.linkExecution, this.applyLinkOperations, this);
        this.parent.observer.on(events.destroyCore, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(events.linkExecution, this.applyLinkOperations);
        this.parent.observer.off(events.destroyCore, this.destroy);
    }

    private applyLinkOperations(args: LinkExecutionPayload): void {
        const operation: 'insert' | 'edit' | 'remove' | 'open' | 'copy' | null | undefined = args.args.operation;
        if (operation === 'remove') {
            this.parent.editor.commands.unsetLink();
            this.invokeCallback(args.callback);
            return;
        }
        if (operation === 'open') {
            this.openLink(args.args.href, args.args.target);
            this.invokeCallback(args.callback);
            return;
        }
        if (operation === 'copy') {
            this.copyLink(args.args.href, args.callback);
            return;
        }
        const linkAttributes: ExecuteLinkAttributes | null = this.getLinkAttributes(args.args as LinkCommand);
        if (!linkAttributes || !linkAttributes.href) {
            return;
        }
        this.parent.editor.commands.setLink({
            href: linkAttributes.href,
            title: linkAttributes.title,
            target: linkAttributes.target,
            rel: linkAttributes.rel,
            displayText: linkAttributes.displayText
        });
        this.invokeCallback(args.callback);
    }

    private getLinkAttributes(value: LinkCommand | undefined): ExecuteLinkAttributes | null {
        if (!value || (value.operation !== 'insert' && value.operation !== 'edit')) {
            return null;
        }
        const url: string = ((value.href || value.url) || '').trim();
        if (isNullOrUndefined(url) || !url) {
            return null;
        }
        const displayText: string = typeof value.displayText === 'string'
            ? value.displayText
            : (typeof value.text === 'string' ? value.text : '');
        return {
            href: url,
            title: value.title ?? null,
            target: value.target ?? null,
            rel: value.rel ?? null,
            displayText: displayText && displayText.trim() ? displayText : undefined
        };
    }

    private openLink(href: string, target?: string | null): void {
        if (href) {
            window.open(href, target || '_blank');
        }
    }

    private copyLink(href: string, callBack?: Function): void {
        if (!href) {
            return;
        }
        if (navigator.clipboard && navigator.clipboard.write && typeof ClipboardItem !== 'undefined') {
            const linkElement: HTMLAnchorElement = document.createElement('a');
            linkElement.href = href;
            linkElement.textContent = href;
            const clipboardItem: ClipboardItem = new ClipboardItem({
                'text/plain': new Blob([href], { type: 'text/plain' }),
                'text/html': new Blob([linkElement.outerHTML], { type: 'text/html' })
            });
            navigator.clipboard.write([clipboardItem]).then((): void => {
                this.invokeCallback(callBack);
            }).catch((): void => undefined);
            return;
        }
    }

    private invokeCallback(callBack?: Function): void {
        if (callBack) {
            callBack();
        }
    }

    /**
     * Clean up link plugin resources
     *
     * @returns {void}
     */
    private destroy(): void {
        this.removeEventListener();
    }
}
