import * as Y from '../yjs-types';
import { detach, createElement, addClass, removeClass } from '@syncfusion/ej2-base';
import {
    CursorPluginOptions,
    CursorState,
    AwarenessState,
    CursorDecoration,
    DomPosition,
    DerivedColor,
    AbsolutePosition,
    InternalYRuntime
} from '../base/interface';
import { throttle } from '../utils/mutex';
import { BlockManager } from '../../../block-manager/base/block-manager';
import { findClosestParent } from '../../../common/utils/dom';
import { getBlockContentElement } from '../../../common/utils/block';
import { Collaboration } from '../base/collaboration';
import { UserModel } from '../../../models/common/user-model';
import { deriveCursorColors } from '../utils/color';
import { BlockEditorBinding } from './sync-plugin';

/** Throttle window for local selection broadcasts (ms) */
const SELECTION_THROTTLE_MS: number = 50;

/** Throttle window for scroll/resize re-renders (ms ≈ 60 fps) */
const RENDER_THROTTLE_MS: number = 16;

export class CursorPlugin {
    private parent: Collaboration;
    private syncPlugin: BlockEditorBinding;
    private yFragment: Y.XmlFragment;
    private yDoc: Y.Doc;
    private awareness: Y.Awareness;

    private blockManager: BlockManager;
    private localUser: UserModel;

    private overlayContainer: HTMLElement | null = null;
    private decorations: Map<number, CursorDecoration> = new Map();
    private isDestroyed: boolean = false;

    private YRuntime: InternalYRuntime;

    private throttledSelectionUpdate: () => void;
    private throttledRerender: () => void;
    private boundSelectionChange: () => void;
    private boundScrollResize: () => void;
    private yjsDeepObserver: (events: Y.YEvent<any>[]) => void;
    private resizeObserver: any;

    constructor(
        yFragment: Y.XmlFragment,
        options: CursorPluginOptions
    ) {
        this.parent = options.parent;
        this.blockManager = options.blockManager;
        this.syncPlugin = this.parent.syncBinding;
        this.yFragment = yFragment;
        this.yDoc = yFragment.doc!;
        this.awareness = options.awareness;

        this.YRuntime = this.parent.getYRuntime();
        this.localUser = this.blockManager.getCurrentUserModel();

        this.throttledSelectionUpdate = throttle(
            () => this.updateLocalCursor(),
            SELECTION_THROTTLE_MS
        );
        this.throttledRerender = throttle(
            () => this.renderRemoteCursors(),
            RENDER_THROTTLE_MS
        );

        this.boundSelectionChange = () => { this.throttledSelectionUpdate(); };
        this.boundScrollResize = () => { this.throttledRerender(); };

        // Only re-render cursor overlays for layout/scroll changes; awareness
        // change events already handle cursor-position updates synchronously.
        this.yjsDeepObserver = (_events: Y.YEvent<any>[]) => {
            requestAnimationFrame(() => { this.throttledRerender(); });
        };

        this.resizeObserver = new (window as any).ResizeObserver(() => {
            requestAnimationFrame(() => {
                this.throttledRerender();
            });
        });

        this.initAwareness();

        this.init();
    }

    private init(): void {
        this.createOverlayContainer();

        this.blockManager.observer.on('selectionchange', this.boundSelectionChange, this);
        window.addEventListener('scroll', this.boundScrollResize, true /* capture */);
        window.addEventListener('resize', this.boundScrollResize);

        this.yFragment.observeDeep(this.yjsDeepObserver);
        this.resizeObserver.observe(this.blockManager.rootEditorElement);

        this.renderRemoteCursors();
        this.syncUsersToEditor();
    }

    private initAwareness(): void {
        this.awareness.setLocalStateField('user', this.localUser);
        this.awareness.setLocalStateField('cursor', null);
        this.awareness.on('change', this.onAwarenessChange);
    }

    private onAwarenessChange = (
        changes: { added: number[]; updated: number[]; removed: number[] }
    ): void => {
        // Remove disconnected clients
        for (const clientId of changes.removed) {
            this.decorations.delete(clientId);
        }

        const states: Map<number, AwarenessState> = this.awareness.getStates() as Map<number, AwarenessState>;
        const localClientId: number = this.awareness.clientID;

        // Upsert active remote clients
        for (const clientId of [...changes.added, ...changes.updated]) {
            if (clientId === localClientId) { continue; }

            const state: AwarenessState | undefined = states.get(clientId);
            if (!state || !state.user) {
                // Peer exists but hasn't set user info yet — remove stale entry
                this.decorations.delete(clientId);
                continue;
            }

            this.decorations.set(clientId, {
                clientId,
                user: state.user,
                // cursor may be null when peer has no active selection
                cursor: (state.cursor as CursorState)
            });
        }

        this.renderRemoteCursors();
        this.syncUsersToEditor();
    };

    private updateLocalCursor(): void {
        const sel: { anchor: any; head: any } | null = this.getEditorSelection();

        if (!sel) {
            this.awareness.setLocalStateField('cursor', null);
            return;
        }

        const anchor: Y.RelativePosition | null = this.parent.syncBinding.yjsPosition.absolutePositionToRelativePosition(
            sel.anchor,
            this.yFragment
        );
        const head: Y.RelativePosition | null = this.parent.syncBinding.yjsPosition.absolutePositionToRelativePosition(
            sel.head,
            this.yFragment
        );

        if (!anchor || !head) {
            this.awareness.setLocalStateField('cursor', null);
            return;
        }

        const cursor: CursorState = { anchor, head };
        this.awareness.setLocalStateField('cursor', cursor);
    }

    private getEditorSelection(): { anchor: any; head: any } | null {
        const domSel: Selection | null = document.getSelection();
        if (!domSel || domSel.rangeCount === 0) { return null; }

        const editorEl: HTMLElement = this.blockManager.rootEditorElement as HTMLElement;

        const anchorInEditor: boolean = editorEl.contains(domSel.anchorNode);
        const focusInEditor: boolean = editorEl.contains(domSel.focusNode);

        if (!anchorInEditor && !focusInEditor) { return null; }

        const anchor: AbsolutePosition | null = this.domNodeToAbsPos(domSel.anchorNode, domSel.anchorOffset);
        const head: AbsolutePosition | null = this.domNodeToAbsPos(domSel.focusNode, domSel.focusOffset);

        if (!anchor || !head) { return null; }
        return { anchor, head };
    }

    private domNodeToAbsPos(node: Node, offset: number): AbsolutePosition | null {
        const blockEl: HTMLElement = findClosestParent(node, '.e-block') as HTMLElement;
        if (!blockEl) { return null; }
        const contentEl: HTMLElement = getBlockContentElement(blockEl) as HTMLElement;
        if (!contentEl) { return null; }
        const absoluteOffset: number = this.cumulativeTextOffset(contentEl, node, offset);

        return {
            blockIndex: this.syncPlugin.yBlockHelper.findBlockIndex(blockEl.id, this.yFragment),
            blockId: blockEl.id,
            offset: absoluteOffset
        };
    }

    private cumulativeTextOffset(
        container: HTMLElement,
        targetNode: Node,
        targetOffset: number
    ): number {
        let accumulated: number = 0;
        const walker: TreeWalker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        let node: Node | null = walker.nextNode();

        while (node) {
            if (node === targetNode) { return accumulated + targetOffset; }
            accumulated += (node as Text).textContent.length;

            node = walker.nextNode();
        }

        // targetNode not found inside container (e.g. collapsed at container end)
        return accumulated;
    }

    private createOverlayContainer(): void {
        this.overlayContainer = createElement('div', {
            className: 'e-be-cursor-overlay'
        });

        this.blockManager.rootEditorElement.appendChild(this.overlayContainer);
    }

    private renderRemoteCursors(): void {
        // Wipe previous render
        this.overlayContainer.innerHTML = '';

        const editorEl: HTMLElement = this.blockManager.rootEditorElement as HTMLElement;
        // Editor rect used to convert viewport-relative DOMRects to editor-relative offsets
        const editorRect: DOMRect = editorEl.getBoundingClientRect() as DOMRect;
        const scrollTop: number = editorEl.scrollTop;
        const scrollLeft: number = editorEl.scrollLeft;

        this.decorations.forEach((decoration: CursorDecoration) => {
            const { user, cursor } = decoration;
            if (!cursor || !cursor.head) { return; } // peer connected but no selection

            // ── 1. Resolve head relative position → absolute position ─────
            const headAbs: AbsolutePosition | null = this.parent.syncBinding.yjsPosition.relativePositionToAbsolutePosition(
                cursor.head,
                this.yDoc,
                this.yFragment
            );
            if (!headAbs) { return; }

            const colors: DerivedColor = deriveCursorColors(user.avatarBgColor as string);

            // ── 2. Selection highlight (rendered below caret in z-order) ──
            const hasRange: boolean | null =
                cursor.anchor &&
                !this.parent.syncBinding.yjsPosition.compareRelativePositions(cursor.anchor, cursor.head);

            if (hasRange) {
                const anchorAbs: AbsolutePosition | null = this.parent.syncBinding.yjsPosition.relativePositionToAbsolutePosition(
                    cursor.anchor!,
                    this.yDoc,
                    this.yFragment
                );

                if (anchorAbs) {
                    this.paintSelectionHighlight(
                        user,
                        colors,
                        anchorAbs,
                        headAbs,
                        editorRect,
                        scrollTop,
                        scrollLeft
                    );
                }
            }

            // ── 3. Caret ──────────────────────────────────────────────────
            this.paintCaret(user, colors, headAbs, editorRect, scrollTop, scrollLeft);
        });
    }

    private paintCaret(
        user: UserModel,
        colors: DerivedColor,
        absPos: AbsolutePosition | null,
        editorRect: DOMRect | null,
        scrollTop: number,
        scrollLeft: number
    ): void {
        const caretRect: DOMRect | null = this.caretRectForAbsPos(absPos);
        if (!caretRect) { return; }

        const el: HTMLElement = this.buildDefaultCaret(user, colors, caretRect, editorRect, scrollTop, scrollLeft);

        this.overlayContainer!.appendChild(el);
    }

    private buildDefaultCaret(
        user: UserModel,
        color: DerivedColor,
        caretRect: DOMRect,
        editorRect: DOMRect | null,
        scrollTop: number,
        scrollLeft: number
    ): HTMLElement {
        const { left, top, height } = this.toEditorRelative(
            caretRect,
            editorRect,
            scrollTop,
            scrollLeft
        );

        const caretHeight: number = Math.max(height, 16);

        // ── Outer wrapper ── position only; all other styles via e-be-cursor
        const wrapper: HTMLElement = createElement('div', {
            className: 'e-be-cursor',
            styles: `left: ${left}px; top: ${top}px`
        });

        // ── Vertical line ── height and colour are runtime-computed
        const line: HTMLElement = createElement('div', {
            className: 'e-be-cursor-line',
            styles: `height: ${caretHeight}px; background: ${color.caret}`
        });
        wrapper.appendChild(line);

        // ── Head (dot + label row) ── pointer-events:auto punch-through via class
        const head: HTMLElement = createElement('div', {
            className: 'e-be-cursor-head'
        });
        wrapper.appendChild(head);

        // ── Dot ── colour is runtime-computed
        const dot: HTMLElement = createElement('div', {
            className: 'e-be-cursor-dot',
            styles: `background: ${color.caret}`
        });
        head.appendChild(dot);

        // ── Label ── colour is runtime-computed; visibility toggled via e-active
        const label: HTMLElement = createElement('div', {
            className:  'e-be-cursor-label',
            styles: `background: ${color.caret}`
        });
        label.textContent = user.user as string;
        head.appendChild(label);

        // ── Hover logic ── 80 ms enter-delay, 1000 ms leave-delay
        let hoverTimer: ReturnType<typeof setTimeout> | null = null;

        head.addEventListener('mouseenter', () => {
            if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
            hoverTimer = setTimeout(() => {
                hoverTimer = null;
                addClass([label], 'e-active');
            }, 80);
        });

        head.addEventListener('mouseleave', () => {
            if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
            hoverTimer = setTimeout(() => {
                hoverTimer = null;
                removeClass([label], 'e-active');
            }, 1000);
        });

        return wrapper;
    }

    private paintSelectionHighlight(
        user: UserModel,
        colors: DerivedColor,
        anchorAbs: AbsolutePosition,
        headAbs: AbsolutePosition,
        editorRect: DOMRect | null,
        scrollTop: number,
        scrollLeft: number
    ): void {
        const range: Range | null = this.buildRangeForSelection(anchorAbs, headAbs);
        const rects: DOMRect[] = Array.from(range.getClientRects()) as DOMRect[];

        for (const rect of rects) {
            if (rect.width < 1 || rect.height < 1) { continue; }
            if (this.syncPlugin.yBlockHelper.isBlockLevelRect(rect, range)) { continue; }

            const rel: { left: number; top: number; width: number; height: number } = this.toEditorRelative(
                rect, editorRect, scrollTop, scrollLeft
            );
            const highlight: HTMLElement = createElement('div', {
                className: 'e-be-sel-highlight',
                styles: `
                left: ${rel.left}px;
                top: ${rel.top}px;
                width: ${rel.width}px;
                height: ${rel.height}px;
                background: ${colors.selection}`
            });
            this.overlayContainer!.appendChild(highlight);
        }
    }

    private buildRangeForSelection(anchorAbs: AbsolutePosition, headAbs: AbsolutePosition): Range | null {
        const anchorDom: DomPosition | null = this.resolveAbsPosToDom(anchorAbs);
        const headDom: DomPosition | null = this.resolveAbsPosToDom(headAbs);
        if (!anchorDom || !headDom) { return null; }

        const range: Range = document.createRange();
        const position: number = anchorDom.node.compareDocumentPosition(headDom.node);
        const anchorFirst: number | boolean =
            position & Node.DOCUMENT_POSITION_FOLLOWING ||
            (anchorDom.node === headDom.node && anchorDom.offset <= headDom.offset);
        if (anchorFirst) {
            range.setStart(anchorDom.node, anchorDom.offset);
            range.setEnd(headDom.node, headDom.offset);
        } else {
            range.setStart(headDom.node, headDom.offset);
            range.setEnd(anchorDom.node, anchorDom.offset);
        }

        return range;
    }

    private resolveAbsPosToDom(absPos: AbsolutePosition): DomPosition | null {
        if (!absPos.blockId) { return null; }

        const blockEl: HTMLElement = this.blockManager.getBlockElementById(absPos.blockId) as HTMLElement;
        const contentEl: HTMLElement = getBlockContentElement(blockEl) as HTMLElement;

        const targetOffset: number = absPos.offset;
        let accumulated: number = 0;
        let lastNode: Text | null = null;

        const walker: TreeWalker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT);
        let node: Node | null = walker.nextNode();

        while (node) {
            const textNode: Text = node as Text;
            const len: number = textNode.length;
            lastNode = textNode;

            if (accumulated + len >= targetOffset) {
                return { node: textNode, offset: targetOffset - accumulated };
            }
            accumulated += len;

            node = walker.nextNode();
        }

        // Clamp: offset is past the end of all text
        if (lastNode) { return { node: lastNode, offset: lastNode.length }; }

        // No text nodes at all — use content element
        return { node: contentEl, offset: contentEl.childNodes.length };
    }

    private caretRectForAbsPos(absPos: any): DOMRect | null {
        const dom: DomPosition | null = this.resolveAbsPosToDom(absPos);
        if (!dom) { return null; }

        const range: Range = document.createRange();
        range.setStart(dom.node, Math.min(dom.offset, (dom.node as Text).length));
        range.collapse(true);
        const rect: DOMRect = range.getBoundingClientRect() as DOMRect;

        if (rect.width === 0 && rect.height === 0) {
            const element: HTMLElement | null = dom.node instanceof HTMLElement ? dom.node : dom.node.parentElement;
            return element.getBoundingClientRect() as DOMRect;
        }

        return rect;
    }

    private toEditorRelative(
        rect: DOMRect,
        editorRect: DOMRect | null,
        scrollTop: number,
        scrollLeft: number
    ): { left: number; top: number; width: number; height: number } {
        return {
            left: rect.left - editorRect.left + scrollLeft,
            top: rect.top - editorRect.top + scrollTop,
            width: rect.width,
            height: rect.height
        };
    }

    private syncUsersToEditor(): void {
        const states: Map<number, AwarenessState> = this.awareness.getStates() as Map<number, AwarenessState>;
        const users: UserModel[] = [];

        states.forEach((state: AwarenessState) => {
            if (state.user) { users.push(state.user); }
        });

        this.blockManager.users = users;
        this.blockManager.stateManager.updateEditorContext();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Returns the list of all active remote users in the session
     *
     * @returns {UserModel[]} Array of active user models
     * @hidden
     */
    getUsers(): UserModel[] {
        const states: Map<number, AwarenessState> = this.awareness.getStates() as Map<number, AwarenessState>;
        const users: UserModel[] = [];
        states.forEach((s: AwarenessState) => { if (s.user) { users.push(s.user); }});
        return users;
    }

    /**
     * Returns the current local user model
     *
     * @returns {UserModel} Local user model
     * @hidden
     */
    getLocalUser(): UserModel {
        return { ...this.localUser };
    }

    /**
     * Updates the local user model with partial properties
     *
     * @param {Partial<UserModel>} user - Partial user properties to update
     * @hidden
     * @returns {void}
     */
    setLocalUser(user: Partial<UserModel>): void {
        this.localUser = { ...this.localUser, ...user };
        this.awareness.setLocalStateField('user', this.localUser);
        this.syncUsersToEditor();
    }

    /**
     * Forces a re-render of all remote cursor decorations
     *
     * @hidden
     * @returns {void}
     */
    forceRerender(): void {
        this.renderRemoteCursors();
    }

    destroy(): void {
        if (this.isDestroyed) { return; }
        this.isDestroyed = true;

        this.blockManager.observer.off('selectionchange', this.boundSelectionChange);

        window.removeEventListener('scroll', this.boundScrollResize, true);
        window.removeEventListener('resize', this.boundScrollResize);

        this.yFragment.unobserveDeep(this.yjsDeepObserver);
        this.resizeObserver.disconnect();

        this.awareness.off('change', this.onAwarenessChange);
        this.awareness.setLocalState(null);

        detach(this.overlayContainer as HTMLElement);
        this.decorations.clear();
    }
}
