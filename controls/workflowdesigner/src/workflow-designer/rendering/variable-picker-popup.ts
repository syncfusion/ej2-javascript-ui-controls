import { Button } from '@syncfusion/ej2-buttons';
import { Dialog } from '@syncfusion/ej2-popups';
import { LocaleContext } from '../localization/locale-context';
import { WorkflowSuggestionEntry, WorkflowSuggestionGroup } from '../simulation/suggestion-builder';

/**
 * Revamped variable-picker popup (T-revamp).
 *
 * Renders a single draggable popup with one collapsible card per upstream
 * source. Each card shows the data captured from that source as an
 * expandable JSON tree (Object(n) / Array(n) rows with clickable key
 * buttons and type badges) — the same affordance the reference component
 * uses, so authors can navigate real response shapes instead of searching
 * a flat list of `$.nodes["..."]` strings.
 *
 * The popup is self-contained: it builds, positions, opens, and disposes
 * itself. The host only needs to call `open(anchor, groups, onPick)` and
 * `close()`.
 *
 * @private
 */

export interface VariablePickerOptions {
    /** Anchor element (the `{{...}}` button next to a field) for positioning. */
    anchor: HTMLElement;
    /** Groups to render — produced by `SuggestionBuilder.build`. */
    groups: WorkflowSuggestionGroup[];
    /** Called when the user picks a path. The popup stays open on picks. */
    onPick: (expression: string, label: string) => void;
    /** Optional: called when the user clicks the "x" or outside the popup. */
    onClose?: () => void;
    /** Z-index of the popup. */
    zIndex?: number;
    /** Optional title shown in the header. Defaults to "Insert variable". */
    title?: string;
}

const SAFE_KEY_PATTERN: RegExp = /^[A-Za-z0-9_$]+$/;
const UNSAFE_KEYS: ReadonlyArray<string> = ['__proto__', 'prototype', 'constructor'];

/* ------------------------------------------------------------------ */
/* Tree node model                                                     */
/* ------------------------------------------------------------------ */

interface TreeNode {
    name: string | number;
    key: string | number;     // key as it appears on the source object
    value: unknown;
    path: string;             // fully qualified expression ($.a.b[0])
    type: 'object' | 'array' | string;
    children: TreeNode[];
}

/* ------------------------------------------------------------------ */
/* Path utilities                                                      */
/* ------------------------------------------------------------------ */

function encodeKey(key: string | number): string {
    if (typeof key === 'number') {
        return '[' + key + ']';
    }
    if (SAFE_KEY_PATTERN.test(key)) {
        return '.' + key;
    }
    return '["' + String(key).replace(/"/g, '\\"') + '"]';
}

function joinPath(base: string, key: string | number): string {
    if (typeof key === 'number') {
        return base + '[' + key + ']';
    }
    if (base === '$') {
        return '$' + encodeKey(key);
    }
    return base + encodeKey(key);
}

function isUnsafeKey(key: string): boolean {
    return UNSAFE_KEYS.indexOf(key) !== -1 || key.charAt(0) === '_';
}

function valueType(value: unknown): 'object' | 'array' | string {
    if (Array.isArray(value)) { return 'array'; }
    if (value !== null && typeof value === 'object') { return 'object'; }
    if (value === null) { return 'null'; }
    return typeof value;
}

function formatPreview(value: unknown): string {
    if (value === null) { return 'null'; }
    if (value === undefined) { return 'undefined'; }
    const type: string = typeof value;
    if (type === 'string') {
        const trimmed: string = (value as string).trim();
        return trimmed.length > 60 ? trimmed.slice(0, 60) + '…' : trimmed;
    }
    if (type === 'number' || type === 'boolean') { return String(value); }
    try {
        const json: string = JSON.stringify(value);
        return json.length > 60 ? json.slice(0, 60) + '…' : json;
    } catch {
        return String(value);
    }
}

function buildTree(value: unknown, basePath: string, name: string | number): TreeNode {
    const type: 'object' | 'array' | string = valueType(value);
    const node: TreeNode = {
        name: name,
        key: name,
        value: value,
        path: basePath,
        type: type,
        children: []
    };
    if (type === 'array') {
        const arr: unknown[] = value as unknown[];
        arr.forEach((child: unknown, idx: number) => {
            node.children.push(buildTree(child, joinPath(basePath, idx), idx));
        });
    } else if (type === 'object') {
        const obj: Record<string, unknown> = value as Record<string, unknown>;
        Object.keys(obj).forEach((k: string) => {
            if (isUnsafeKey(k)) { return; }
            const descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(obj, k);
            const child: unknown = descriptor ? descriptor.value : undefined;
            // Skip DOM / function / circular-ish values for safety.
            if (child !== null && typeof child === 'object') {
                try {
                    JSON.stringify(child);
                } catch {
                    return;
                }
            }
            node.children.push(buildTree(child, joinPath(basePath, k), k));
        });
    }
    return node;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * Variable Picker Popup.
 *
 * @private
 */
export class VariablePickerPopup {
    private root: HTMLDivElement | null = null;
    /** The EJ2 Dialog that owns the popup chrome, drag and positioning. */
    private dialog: Dialog | null = null;
    /** Throwaway mount element for the Dialog. */
    private target: HTMLDivElement | null = null;
    private current: VariablePickerOptions | null = null;
    private outsideHandler: ((event: MouseEvent) => void) | null = null;
    private keyHandler: ((event: KeyboardEvent) => void) | null = null;
    private repositionHandler: (() => void) | null = null;
    /** collapse state per group root, persisted while popup is mounted */
    private collapsed: { [root: string]: boolean } = {};

    /**
     * Opens the popup. Idempotent: re-calling rebuilds contents.
     *
     * @param {VariablePickerOptions} options Popup configuration.
     * @returns {void}
     * @private
     */
    public open(options: VariablePickerOptions): void {
        this.close();
        this.current = options;
        const content: HTMLDivElement = this.build();
        const target: HTMLDivElement = document.createElement('div');
        document.body.appendChild(target);
        this.target = target;

        const rect: ClientRect = options.anchor.getBoundingClientRect();
        const dialog: Dialog = new Dialog({
            header: this.headerText(),
            content: content,
            // Non-modal: the author keeps typing in the field behind the
            // popup while picking a path, which is the whole point of it.
            isModal: false,
            allowDragging: true,
            showCloseIcon: true,
            closeOnEscape: true,
            width: '360px',
            cssClass: 'e-wf-varpicker',
            zIndex: options.zIndex || 1000010,
            // Opened beside the anchoring `{{ }}` button; the Dialog keeps
            // itself inside the viewport from there and owns dragging after.
            position: { X: Math.round(rect.left), Y: Math.round(rect.bottom + 6) },
            close: (): void => this.close()
        });
        dialog.appendTo(target);
        this.dialog = dialog;
        this.root = dialog.element as HTMLDivElement;
        this.positionPopup(this.root, options.anchor);
        this.bindDismissal(dialog.element, options.anchor);
    }

    /**
     * Returns the popup heading.
     *
     * @returns {string} The heading text.
     */
    private headerText(): string {
        const title: string = this.current && this.current.title ? this.current.title : 'Insert variable';
        return String(title)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /**
     * Close.
     *
     * @returns {void} Nothing.
     * @private
     */
    public close(): void {
        if (this.outsideHandler) {
            document.removeEventListener('mousedown', this.outsideHandler, true);
            this.outsideHandler = null;
        }
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler, true);
            this.keyHandler = null;
        }
        if (this.repositionHandler) {
            window.removeEventListener('resize', this.repositionHandler);
            this.repositionHandler = null;
        }
        this.root = null;
        // Deferred by one task: `close` is reached from inside the Dialog's
        // own close handler, which is still using the element.
        const dialog: Dialog | null = this.dialog;
        const target: HTMLDivElement | null = this.target;
        this.dialog = null;
        this.target = null;
        if (dialog || target) {
            window.setTimeout(() => {
                if (dialog) {
                    try {
                        dialog.destroy();
                    } catch (error) {
                        // Already disposed.
                    }
                }
                if (target && target.parentNode) {
                    target.parentNode.removeChild(target);
                }
            }, 0);
            if (dialog) {
                dialog.hide();
            }
        }
        const current: VariablePickerOptions | null = this.current;
        this.current = null;
        this.collapsed = {};
        if (current && current.onClose) {
            current.onClose();
        }
    }

    /**
     * Is Open.
     *
     * @returns {boolean} The result.
     * @private
     */
    public isOpen(): boolean {
        return !!this.root;
    }

    /**
     * Get Root.
     *
     * @returns {HTMLDivElement} The result.
     * @private
     */
    public getRoot(): HTMLDivElement | null {
        return this.root;
    }

    /* -------------------------------------------------------------- */
    /* Build                                                          */
    /* -------------------------------------------------------------- */

    private build(): HTMLDivElement {
        const root: HTMLDivElement = document.createElement('div');
        root.className = 'e-wf-varpicker-content';
        root.appendChild(this.buildBody());
        // Prevent textbox caret stealing mousedown inside the popup.
        root.addEventListener('mousedown', (e: MouseEvent) => {
            const target: EventTarget | null = e.target;
            if (target instanceof HTMLElement && target.closest('input,textarea,button.e-wf-varpicker-key')) {
                return;
            }
            e.preventDefault();
        });
        return root;
    }

    private buildBody(): HTMLDivElement {
        const body: HTMLDivElement = document.createElement('div');
        body.className = 'e-wf-varpicker-body';
        const groups: WorkflowSuggestionGroup[] = (this.current && this.current.groups) || [];
        if (!groups.length) {
            const empty: HTMLDivElement = document.createElement('div');
            empty.className = 'e-wf-varpicker-empty';
            empty.textContent = LocaleContext.text('variablePickerNoUpstream');
            body.appendChild(empty);
            return body;
        }
        groups.forEach((group: WorkflowSuggestionGroup) => {
            body.appendChild(this.buildGroup(group));
        });
        return body;
    }

    private buildGroup(group: WorkflowSuggestionGroup): HTMLDivElement {
        const wrap: HTMLDivElement = document.createElement('div');
        wrap.className = 'e-wf-varpicker-group';
        const isCollapsed: boolean = this.collapsed[group.root] === true;
        // Header row (clickable to collapse/expand)
        const header: HTMLDivElement = document.createElement('div');
        header.className = 'e-wf-varpicker-group-header';
        const caret: HTMLSpanElement = document.createElement('span');
        caret.className = 'e-wf-varpicker-caret';
        const caretIcon: HTMLSpanElement = this.createChevronIcon(isCollapsed ? 'e-chevron-right' : 'e-chevron-down');
        caret.appendChild(caretIcon);
        const title: HTMLSpanElement = document.createElement('span');
        title.className = 'e-wf-varpicker-group-title';
        title.textContent = group.label;
        const subtitle: HTMLSpanElement = document.createElement('span');
        subtitle.className = 'e-wf-varpicker-group-subtitle';
        const subtitleText: string = group.subtitle || group.kind || '';
        subtitle.textContent = subtitleText;
        const spacer: HTMLDivElement = document.createElement('div');
        spacer.className = 'e-wf-varpicker-group-spacer';
        header.appendChild(caret);
        header.appendChild(title);
        if (subtitleText) {
            header.appendChild(subtitle);
        }
        header.appendChild(spacer);
        wrap.appendChild(header);
        // Body
        const body: HTMLDivElement = document.createElement('div');
        body.className = 'e-wf-varpicker-group-body';
        if (isCollapsed) {
            body.style.display = 'none';
        }
        if (group.flatList || group.tree === null || group.tree === undefined) {
            body.appendChild(this.buildFlatList(group));
        } else {
            body.appendChild(this.buildTree(group));
        }
        wrap.appendChild(body);
        header.addEventListener('click', () => {
            const next: boolean = body.style.display === 'none';
            body.style.display = next ? '' : 'none';
            this.setChevronDirection(caret, next ? 'e-chevron-down' : 'e-chevron-right');
            this.collapsed[group.root] = !next;
        });
        return wrap;
    }

    private buildFlatList(
        group: WorkflowSuggestionGroup
    ): HTMLDivElement {
        const list: HTMLDivElement =
            document.createElement('div');

        list.className = 'e-wf-varpicker-flatlist';

        group.entries.forEach(
            (entry: WorkflowSuggestionEntry): void => {
                const chip: HTMLButtonElement =
                    this.createKeyButton(
                        entry.label,
                        entry.expression + ' — click to insert'
                    );

                chip.addEventListener(
                    'click',
                    (): void => {
                        this.pick(
                            entry.expression,
                            entry.label
                        );
                    }
                );

                list.appendChild(chip);
            }
        );

        return list;
    }

    private buildTree(group: WorkflowSuggestionGroup): HTMLDivElement {
        const tree: TreeNode = buildTree(group.tree, group.root, '$');
        return this.renderTreeNode(tree, 0, group.selectRoot === true, group.rootLabel);
    }

    private renderTreeNode(
        node: TreeNode,
        depth: number,
        selectRoot: boolean = false,
        rootLabel?: string
    ): HTMLDivElement {
        const container: boolean = node.type === 'object' || node.type === 'array';
        const isRoot: boolean = depth === 0;
        const row: HTMLDivElement = document.createElement('div');
        row.className = 'e-wf-varpicker-row';
        row.style.paddingLeft = (depth * 16 + 8) + 'px';
        // caret slot
        const slot: HTMLSpanElement = document.createElement('span');
        slot.className = 'e-wf-varpicker-tree-slot';
        if (container) {
            const toggle: HTMLSpanElement = document.createElement('span');
            toggle.className = 'e-wf-varpicker-tree-toggle';
            const toggleIcon: HTMLSpanElement = this.createChevronIcon('e-chevron-down');
            toggle.appendChild(toggleIcon);
            toggle.addEventListener('click', (e: MouseEvent) => {
                e.stopPropagation();
                this.toggleChildren(toggle, childrenHost, node);
            });
            slot.appendChild(toggle);
        }
        row.appendChild(slot);
        if (isRoot && !selectRoot) {
            // Root row is a visual marker (mirrors the reference's circled
            // $ icon). It is not a clickable key — inserting the whole
            // object as a value is almost never what the author wants.
            const marker: HTMLSpanElement = document.createElement('span');
            marker.className = 'e-wf-varpicker-root-marker';
            marker.textContent = '$';
            marker.title = 'Response root';
            row.appendChild(marker);
        } else {
            // key chip
            const label: string = isRoot
                ? (rootLabel || 'Array current item')
                : (typeof node.name === 'number' ? '[' + node.name + ']' : String(node.name));
            const chip: HTMLButtonElement = this.createKeyButton(label, node.path + ' — click to insert');
            chip.addEventListener('click', (e: MouseEvent) => {
                e.stopPropagation();
                this.pick(node.path, label);
            });
            row.appendChild(chip);
        }
        // value preview
        const preview: HTMLSpanElement = document.createElement('span');
        preview.className = 'e-wf-varpicker-preview';
        if (container) {
            const count: number = node.type === 'array'
                ? (node.value as unknown[]).length
                : Object.keys(node.value as Record<string, unknown>).length;
            preview.textContent = node.type === 'array' ? 'Array(' + count + ')' : 'Object(' + count + ')';
        } else {
            preview.textContent = formatPreview(node.value);
        }
        row.appendChild(preview);
        // type badge
        const badge: HTMLSpanElement = document.createElement('span');
        badge.className = 'e-wf-varpicker-type';
        badge.textContent = node.type;
        row.appendChild(badge);
        // children
        const childrenHost: HTMLDivElement = document.createElement('div');
        childrenHost.className = 'e-wf-varpicker-children';
        if (container && node.children.length) {
            node.children.forEach((child: TreeNode, idx: number) => {
                const childEl: HTMLDivElement = this.renderTreeNode(child, depth + 1, false);
                childrenHost.appendChild(childEl);
            });
        }
        const wrap: HTMLDivElement = document.createElement('div');
        wrap.className = 'e-wf-varpicker-node';
        wrap.appendChild(row);
        if (container) {
            wrap.appendChild(childrenHost);
        }
        return wrap;
    }

    private createKeyButton(label: string, title: string): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.title = title;
        new Button({
            cssClass: 'e-wf-varpicker-key e-outline',
            isPrimary: true
        }).appendTo(button);
        return button;
    }

    private createChevronIcon(direction: string): HTMLSpanElement {
        const icon: HTMLSpanElement = document.createElement('span');
        icon.className = 'e-wf-varpicker-chevron e-btn-icon e-icons ' + direction;
        return icon;
    }

    private setChevronDirection(container: HTMLElement, direction: string): void {
        const icon: Element | null = container.querySelector('.e-wf-varpicker-chevron');
        if (!icon) { return; }
        icon.classList.remove('e-chevron-right', 'e-chevron-down');
        icon.classList.add(direction);
    }

    private toggleChildren(toggle: HTMLElement, host: HTMLElement, _node: TreeNode): void {
        const hidden: boolean = host.style.display === 'none' || host.children.length === 0;
        // Walk through and show/hide auto-collapsed siblings.
        Array.from(host.children).forEach((child: Element) => {
            const el: HTMLElement = child as HTMLElement;
            if (el.classList.contains('e-wf-varpicker-collapsed')) {
                el.style.display = hidden ? '' : 'none';
            }
        });
        if (hidden) {
            host.style.display = '';
            this.setChevronDirection(toggle, 'e-chevron-down');
        } else {
            host.style.display = 'none';
            this.setChevronDirection(toggle, 'e-chevron-right');
        }
    }

    private pick(expression: string, label: string): void {
        if (this.current && this.current.onPick) {
            this.current.onPick(expression, label);
        }
    }

    /* -------------------------------------------------------------- */
    /* Positioning / dismissal                                        */
    /* -------------------------------------------------------------- */

    /**
     * Anchor-aware positioning. The popup is `position: fixed`, so it does
     * NOT need to track document scroll — the only thing that should move it
     * after open is a window resize or the user dragging the header. A
     * previous version of this method registered a capture-phase `scroll`
     * listener on `window`, which fired on every internal scroll of the
     * popup body and forced synchronous layout via `getBoundingClientRect`
     * + style writes — that combination was the root cause of the page
     * freezing the moment the user scrolled variables.
     *
     * The popup body is wrapped in a scrollable container (.e-wf-varpicker-scroll-wrapper
     * with flex: 1 1 auto and overflow: auto), allowing large datasets to be scrolled
     * while keeping the popup within viewport bounds via a fixed max-height.
     *
     * @param {HTMLDivElement} root The popup root element.
     * @param {HTMLElement} anchor The anchor element.
     * @returns {void}
     */
    private positionPopup(root: HTMLDivElement, anchor: HTMLElement): void {
        const rect: ClientRect = anchor.getBoundingClientRect();
        const gap: number = 8;
        const width: number = 360;
        const panel: Element | null = anchor.closest('.e-wf-property-section');
        const panelRect: ClientRect | null = panel ? panel.getBoundingClientRect() : null;

        // Calculate available vertical space: use large fixed height, but cap at viewport
        const viewportGap: number = 16;
        const targetHeight: number = 520;  // Fixed tall height for good scrolling
        const availableHeight: number = window.innerHeight - viewportGap;
        const maxHeight: number = Math.min(targetHeight, availableHeight);

        // Position left/right: prefer left of panel if space; otherwise right
        let left: number;
        if (panelRect) {
            const leftOfPanelSpace: number = panelRect.left - width - gap;
            const rightOfPanelSpace: number = window.innerWidth - (panelRect.right + gap + width);

            if (leftOfPanelSpace >= gap) {
                // Enough space to the left of panel without clipping
                left = leftOfPanelSpace;
            } else if (rightOfPanelSpace >= gap) {
                // Not enough left, try right of panel
                left = panelRect.right + gap;
            } else {
                // Neither fits; center or push to safest edge
                left = Math.max(gap, (window.innerWidth - width) / 2);
            }
        } else {
            // No panel; default to right of anchor
            left = rect.right + gap;
        }

        // Clamp left to viewport bounds with proper spacing
        if (left + width > window.innerWidth - gap) {
            left = Math.max(gap, window.innerWidth - width - gap);
        }
        if (left < gap) {
            left = gap;
        }

        // Position vertically: anchor top, but ensure stays within viewport
        let top: number = rect.top;

        // If popup would extend below viewport, shift up (but keep some margin)
        if (top + maxHeight > window.innerHeight - gap) {
            top = Math.max(gap, window.innerHeight - maxHeight - gap);
        }

        // Apply fixed max-height with scrollable content wrapper inside
        root.style.maxHeight = maxHeight + 'px';
        root.style.left = Math.round(left) + 'px';
        root.style.top = Math.round(top) + 'px';

        // Reposition on window resize
        let rafId: number | null = null;
        const reposition: () => void = () => {
            if (rafId !== null) { return; }
            rafId = window.requestAnimationFrame(() => {
                rafId = null;
                if (!this.root) { return; }
                this.positionPopup(this.root, anchor);
            });
        };
        this.repositionHandler = reposition;
        window.addEventListener('resize', reposition);
    }

    /**
     * Keeps the popup dismissable by an outside click.
     *
     * A non-modal Dialog renders no overlay, so outside-click dismissal is
     * still the popup's own responsibility. Escape and dragging are handled
     * by the component.
     *
     * @param {HTMLElement} root The dialog element.
     * @param {HTMLElement} anchor The anchor that opened the popup.
     * @returns {void}
     */
    private bindDismissal(root: HTMLElement, anchor: HTMLElement): void {
        this.outsideHandler = (event: MouseEvent): void => {
            const target: EventTarget | null = event.target;
            if (!(target instanceof Node)) {
                return;
            }
            if (root.contains(target) || anchor.contains(target)) {
                return;
            }
            this.close();
        };
        document.addEventListener('mousedown', this.outsideHandler, true);
    }
}
