import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { Dialog, AnimationSettingsModel } from '@syncfusion/ej2-popups';
import { RichTextEditorUI } from '../../richtexteditor-ui';
import {
    BeforeDialogOpenEventArgs,
    BeforeDialogCloseEventArgs
} from '../../common/interface';

/**
 * Options used to configure an `EditorDialog`. This is the `model` argument
 * on the `EditorDialog` constructor.
 *
 * It is a strict subset of `DialogModel` — the sub component owns the
 * `visible` (always `false` until `show()` is called), `showCloseIcon`
 * (always `true`) and `enableRtl` (mirrors the parent editor) properties, so
 * callers configure only the dialog-specific bits: header, content, sizing,
 * buttons, animation and the editor-facing `beforeDialogOpen` /
 * `beforeDialogClose` callbacks.
 *
 * The callbacks are NOT named `beforeOpen` / `beforeClose` (the raw ej2-popups
 * `DialogModel` names) so that callers do not collide with the editor-level
 * dialog events surfaced on `RichTextEditor` (`beforeDialogOpen` /
 * `beforeDialogClose`).
 */
export interface EditorDialogModel {
    /** Dialog header (text or markup). */
    header?: string | HTMLElement;
    /** Dialog body content (text or markup). */
    content?: string | HTMLElement;
    /** Dialog width. */
    width?: string | number;
    /** Dialog height. */
    height?: string | number;
    /** Whether the dialog blocks interaction with the underlying page. */
    isModal?: boolean;
    /** Whether the dialog can be dragged by its header. */
    allowDragging?: boolean;
    /** Action buttons rendered in the dialog footer. */
    buttons?: { buttonModel: Object; click: (args: Object) => void }[];
    /** Animation applied while opening / closing the dialog. */
    animationSettings?: AnimationSettingsModel;
    /** Additional CSS class to apply to the dialog root. */
    cssClass?: string;
    /** Position of the dialog relative to the target element. */
    position?: { X: string | number; Y: string | number };
    /**
     * Editor feature the dialog belongs to (e.g. `'Link'`, `'Image'`,
     * `'Table'`). Surfaced on every `beforeDialogOpen` /
     * `beforeDialogClose` event as `subType` so a single handler can branch
     * on the feature. Omitted for generic dialogs that are not tied to a
     * specific feature.
     */
    subType?: string;
    /** Raised when the dialog is created. */
    created?: () => void;
    /** Raised when the dialog is opened. */
    open?: () => void;
    /** Raised before the dialog opens. */
    beforeDialogOpen?: (args: BeforeDialogOpenEventArgs) => void;
    /** Raised before the dialog closes. */
    beforeDialogClose?: (args: BeforeDialogCloseEventArgs) => void;
}

/**
 * EditorDialog — a dialog sub component owned by the editor.
 *
 * Follows the sub-component convention:
 *  - Named `Editor<Thing>`, no `Renderer` suffix.
 *  - Constructor takes `(editor, id, target, model)`.
 *  - Public surface is `show()`, `hide()`, `destroy()`.
 *  - Saves the editor selection before opening and restores it after closing
 *    using the shared `editor-selection-utils` (no base-class inheritance).
 *
 * This is the reference implementation other sub components should copy.
 */
export class EditorDialog {
    /** The editor instance the dialog belongs to. */
    protected parent: RichTextEditorUI;
    /** Element the dialog root is appended to. */
    protected target: HTMLElement;
    /** Caller-supplied dialog options (header, content, width, etc.). */
    protected model: EditorDialogModel;
    /** Unique id of the rendered dialog root element. */
    public id: string;
    /** The underlying Syncfusion Dialog instance. */
    public dialog: Dialog;
    /** Destroyed guard. */
    private isDestroyed: boolean = false;
    private clickHandler: (event: MouseEvent) => void;
    public element: HTMLElement;
    private saveSelection: any;

    constructor(editor: RichTextEditorUI, id: string, target: HTMLElement, model: EditorDialogModel) {
        this.parent = editor;
        this.target = target;
        this.id = id;
        this.model = model;
        this.render();
    }

    /**
     * Builds the dialog root element and the underlying `Dialog` instance,
     * wiring `beforeDialogOpen`/`beforeDialogClose` so the selection is saved/restored
     * and any caller-supplied callbacks still run.
     *
     * @returns {void}
     */
    private render(): void {
        const dialogRoot: HTMLElement = this.parent.createElement('div', {
            id: this.id,
            className: 'e-editor-dialog-root'
        });
        this.target.appendChild(dialogRoot);
        this.dialog = new Dialog({
            target: this.target,
            header: this.model.header,
            content: this.model.content,
            width: this.model.width,
            height: this.model.height ? this.model.height : 'auto',
            position: this.model.position,
            visible: false,
            showCloseIcon: true,
            isModal: this.model.isModal,
            allowDragging: this.model.allowDragging,
            buttons: this.model.buttons,
            animationSettings: this.model.animationSettings,
            cssClass: this.model.cssClass,
            enableRtl: this.parent.enableRtl,
            created: this.model.created,
            beforeOpen: this.beforeDialogOpen.bind(this),
            beforeClose: this.beforeDialogClose.bind(this),
            overlayClick: this.onOverlayClick.bind(this),
            open: this.model.open
        });
        this.dialog.isStringTemplate = true;
        this.dialog.appendTo(dialogRoot);
        (this.dialog.element as HTMLElement).style.maxHeight = 'inherit';
        this.element = this.dialog.element;
        this.clickHandler = this.onDocumentClick.bind(this);
        if (this.parent && this.parent.inputElement) {
            this.parent.inputElement.ownerDocument.addEventListener('mousedown', this.clickHandler);
        }
    }

    /**
     * Shows the dialog. Delegates to the underlying `Dialog.show()`.
     *
     * @returns {void}
     */
    public show(): void {
        if (!isNOU(this.dialog)) {
            this.dialog.show();
        }
    }

    /**
     * Hides the dialog. Delegates to the underlying `Dialog.hide()`.
     *
     * @returns {void}
     */
    public hide(): void {
        if (!isNOU(this.dialog)) {
            this.dialog.hide();
        }
    }

    /**
     * Returns the live EJ2 `Button` instances backing the dialog footer so
     * callers can set their `disabled` state (or any other mutable
     * property) without going through the model-to-instance mirror.
     *
     * @param {number} [index] - Optional button index; returns a single
     *   `Button` when supplied.
     * @returns {Button[] | Button | null} Live button instances, or `null`
     *   when the dialog has been destroyed / not yet constructed.
     */
    public getButtons(index?: number): object | object[] | null {
        if (isNOU(this.dialog)) {
            return null;
        }
        const raw: { getButtons(i?: number): object | object[] } =
            this.dialog as unknown as { getButtons(i?: number): object | object[] };
        if (typeof raw.getButtons !== 'function') {
            return null;
        }
        return raw.getButtons(index);
    }

    /**
     * `beforeOpen` hook: snaps the editor selection first (so it survives the
     * focus transfer into the dialog), then hands control to any caller-
     * supplied `model.beforeDialogOpen`.
     *
     * @param {BeforeOpenEventArgs} args - Dialog before-open event args.
     * @returns {void}
     */
    private beforeDialogOpen(args: BeforeDialogOpenEventArgs): void {
        if (this.parent && this.parent.baseEditorCore) {
            this.saveSelection = this.parent.baseEditorCore.saveSelection();
        }
        args.subType = this.model.subType;
        if (typeof this.model.beforeDialogOpen === 'function') {
            this.model.beforeDialogOpen(args);
        }
    }

    /**
     * `beforeClose` hook: lets the caller's `model.beforeDialogClose` run first so it
     * can cancel the close, then restores the editor selection (unless the
     * caller cancelled).
     *
     * @param {BeforeCloseEventArgs} args - Dialog before-close event args.
     * @returns {void}
     */
    private beforeDialogClose(args: BeforeDialogCloseEventArgs): void {
        // Stamp the same subType as the open event so close handlers can
        // branch identically.
        (args as { subType?: string }).subType = this.model.subType;
        if (typeof this.model.beforeDialogClose === 'function') {
            this.model.beforeDialogClose(args);
        }
        this.destroy();
        if (this.parent && this.parent.baseEditorCore) {
            this.parent.baseEditorCore.restoreSelection(this.saveSelection);
        }
    }

    /**
     * Closes the dialog when its modal overlay is clicked.
     *
     * @returns {void}
     */
    private onOverlayClick(): void {
        this.hide();
    }

    private onDocumentClick(event: MouseEvent): void {
        if (this.element && this.element.classList.contains('e-popup-open') && !this.element.contains(event.target as Node) &&
            !(event.target as HTMLElement).closest('.e-rte-ui-elements')) {
            this.hide();
        }
    }

    /**
     * Destroys the dialog and frees references. Idempotent.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        if (this.clickHandler) {
            this.parent.inputElement.ownerDocument.removeEventListener('mousedown', this.clickHandler);
            this.clickHandler = null;
        }
        if (this.dialog && !this.dialog.isDestroyed) {
            this.dialog.destroy();
        }
        // Dialog re-parents the root to document.body during appendTo, so
        // detach it from wherever it currently lives to avoid leaking an
        // empty host element after destroy.
        const root: HTMLElement = document.getElementById(this.id);
        if (root && root.parentNode) {
            root.parentNode.removeChild(root);
        }
        this.dialog = null;
        this.parent = null;
        this.target = null;
        this.model = null;
        this.isDestroyed = true;
    }
}
