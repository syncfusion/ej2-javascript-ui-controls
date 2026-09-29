import { L10n, isNullOrUndefined as isNOU, EventHandler, Browser, createElement } from '@syncfusion/ej2-base';
import { FileInfo } from '@syncfusion/ej2-inputs';
import { RichTextEditorUI } from '../richtexteditor-ui';
import { ImageSettingsModel } from '../model/image-settings-model';
import { EditorDialog, EditorDialogModel } from '../../base/renderer/editor-dialog';
import { EditorUploadPopup } from '../../base/renderer/editor-upload-popup';
import { BeforeDialogCloseEventArgs, BeforeFileUploadEventArgs, FileUploadingEventArgs, FileSelectedEventArgs, FileUploadSuccessEventArgs, FileUploadFailedEventArgs, FileRemovingEventArgs } from '../../common/interface';
import { EditorCommandName, ImageInsertCommand, ImageUpdateCommand } from '../../controller/interface';
import { ImageEventArgs } from '../../base/renderer/toolbar-action-handler';
import * as events from '../../common/constant';
import { ToolbarItem } from '../model/toolbar.types';

// ImageModule — renders the Insert Image dialog and forwards the picked file to the headless editor's image extension.
export class ImageModule {

    /** The dialog sub component, lazily created on first `show()`. */
    public dialog: EditorDialog | null;

    /** Quick Toolbar `AltText` dialog instance, lazily created. */
    private altTextDialog: EditorDialog | null;

    /** Quick Toolbar `Dimension` dialog instance, lazily created. */
    private dimensionDialog: EditorDialog | null;

    /** Quick Toolbar `Replace` dialog instance, lazily created. */
    private replaceDialog: EditorDialog | null;

    /** The shared upload popup that owns the EJ2 `Uploader`. */
    private uploadPopup: EditorUploadPopup | null;

    /** Drop-area element painted inside the dialog body. */
    private dropArea: HTMLElement | null;

    /** Hidden file `<input>` rendered inside the drop area. */
    private fileInput: HTMLInputElement | null;

    /** URL payload row input element (the "provide a link from the web" row). */
    private urlInput: HTMLInputElement | null;

    public parent: RichTextEditorUI;
    private locale: L10n;

    /*
     * Staged file payload: populated by the Uploader's `selected` callback,
     * consumed by the Insert button's `click` handler.
     */
    private pending: {
        name: string;
        type: string;
        size: number;
        /** Resolved URL (`data:` URI for Base64 mode, `blob:` URL otherwise). */
        url: string;
        /** Alt text derived from the file name. */
        alt: string;
    } | null;

    /** Set of object URLs (Blob mode) that need to be revoked on destroy. */
    private blobUrls: Set<string>;

    /** Image currently marked as selected for the Image quick toolbar. */
    private selectedImage: HTMLImageElement | null;

    private selectedImageClass: string = 'e-rte-ui-image-selected';

    constructor(parent: RichTextEditorUI, locale: L10n) {
        this.parent = parent;
        this.locale = locale;
        this.dialog = null;
        this.uploadPopup = null;
        this.dropArea = null;
        this.fileInput = null;
        this.urlInput = null;
        this.pending = null;
        this.blobUrls = new Set<string>();
        this.selectedImage = null;
        this.addEventListener();
        // Toolbar Image-item click → this module's `show()`.
        this.parent.openImageDialog = (): void => {
            this.show();
        };
    }

    /**
     * Module identifier used by the RTE module loader.
     *
     * @returns {string} The unique module name registered with `Component.Inject`.
     */
    public getModuleName(): string {
        return 'image';
    }

    /**
     * Returns the configured image Quick Toolbar items.
     *
     * @returns {ToolbarItem[]} Image Quick Toolbar items.
     */
    public getQuickToolbarItems(): ToolbarItem[] {
        const configured: ToolbarItem[] | null | undefined = this.parent.quickToolbarSettings.image;
        return configured || [];
    }

    /**
     * Executes an Image Quick Toolbar command and dispatches it through
     * the `ImageFormats` plugin to the headless editor.
     *
     * @param {string} command - Image toolbar command name.
     * @param {unknown} value - Optional command value.
     * @returns {void}
     */
    public executeQuickToolbarAction(command: string, value?: unknown): void {
        if (this.parent.isDestroyed) {
            return;
        }
        const execute: (name: EditorCommandName, payload?: unknown) => void =
            (name: EditorCommandName, payload?: unknown): void => {
                const controller: { execute?: (cmd: EditorCommandName, val?: unknown) => void } =
                    this.parent.editorController as unknown as {
                        execute?: (cmd: EditorCommandName, val?: unknown) => void;
                    };
                if (controller && typeof controller.execute === 'function') {
                    controller.execute(name, payload);
                }
            };
        switch (command) {
        // ── Attribute update commands (headless `updateImage`) ──────
        case 'altText':
            this.openAltTextDialog();
            break;
        // ── Layout commands (headless `setImageAlign`) ──────────────
        case 'alignImage':
        case 'setAlignImage':
            execute('setAlignImage', value);
            break;
        // ── Layout commands (headless `setImageWrap`) ────────────────
        case 'wrapTextImage':
        case 'setWrapTextImage':
            execute('setWrapTextImage', value);
            break;
        // ── Layout commands (headless `setImageDisplay`) ────────────
        case 'displayImage':
            execute('displayImage', value);
            break;
        case 'inlineImage':
            execute('inlineImage');
            break;
        case 'breakImage':
            execute('breakImage');
            break;
        // ── Dimension command (headless `setImageDimension`) ────────
        case 'dimensionImage':
            this.openDimensionDialog();
            break;
        // ── Replace command (headless `updateImage` with `src`) ─────
        case 'replaceImage':
            this.openReplaceDialog();
            break;
        // ── Remove command (headless `removeImage`) ────────────────
        case 'removeImage':
            execute('removeImage');
            break;
        // ── Caption command (reserved — no headless caption yet) ────
        case 'caption':
            execute('caption');
            break;
        default:
            return;
        }
        this.parent.quickToolbarModule.hideQuickToolbars(true);
    }

    /**
     * Returns the `<img>` element currently selected in the editor (the
     * headless editor marks NodeSelection with the
     * `ProseMirror-selectednode` class), or `null` when no image is
     * selected.
     *
     * @returns {HTMLImageElement | null} The selected image element, or null.
     */
    private getSelectedImage(): HTMLImageElement | null {
        if (!this.parent || !this.parent.inputElement) {
            return null;
        }
        const selectedNode: Element | null =
            this.parent.inputElement.querySelector('.e-rte-ui-image-selected');
        if (selectedNode && selectedNode.tagName === 'IMG') {
            return selectedNode as HTMLImageElement;
        }
        // The block-image node wraps the `<img>` inside a wrapper `<div>`;
        // the ProseMirror selection class may sit on the wrapper.
        if (selectedNode) {
            const inner: HTMLImageElement | null = selectedNode.querySelector('img');
            if (inner) {
                return inner;
            }
        }
        return null;
    }

    public setSelectedImage(image: HTMLImageElement): void {
        this.clearSelectedImage();
        this.selectedImage = image;
        this.selectedImage.classList.add(this.selectedImageClass);
    }

    public clearSelectedImage(): void {
        if (this.selectedImage) {
            this.selectedImage.classList.remove(this.selectedImageClass);
            this.selectedImage = null;
        }
    }

    /**
     * Commits the alt text from the AltText dialog through the editor
     * controller. Routed by the `ImageFormats` plugin to the headless
     * `updateImage` command.
     *
     * @param {string} alt - The alt text to apply.
     * @returns {void}
     */
    private commitAltText(alt: string): void {
        const payload: ImageUpdateCommand = { alt: alt };
        const controller: { execute?: (cmd: EditorCommandName, val?: unknown) => void } =
            this.parent.editorController as unknown as {
                execute?: (cmd: EditorCommandName, val?: unknown) => void;
            };
        if (controller && typeof controller.execute === 'function') {
            controller.execute('altText', payload);
        }
    }

    /**
     * Commits the dimensions from the Dimension dialog through the editor
     * controller. Routed by the `ImageFormats` plugin to the headless
     * `setImageDimension` command.
     *
     * @param {number | null} width - Width in pixels; `null` clears.
     * @param {number | null} height - Height in pixels; `null` clears.
     * @returns {void}
     */
    private commitDimensions(width: number | null, height: number | null): void {
        const payload: { width?: number | null; height?: number | null } = { width: width, height: height };
        const controller: { execute?: (cmd: EditorCommandName, val?: unknown) => void } =
            this.parent.editorController as unknown as {
                execute?: (cmd: EditorCommandName, val?: unknown) => void;
            };
        if (controller && typeof controller.execute === 'function') {
            controller.execute('dimensionImage', payload);
        }
    }

    /**
     * Commits the replace flow: fires the cancellable editor-level
     * `fileRemoving` event, then (unless cancelled) updates the selected
     * image's `src` through the editor controller. Routed by the
     * `ImageFormats` plugin to the headless `updateImage` command.
     *
     * @param {string} src - The new image source.
     * @returns {void}
     */
    private commitReplace(src: string): void {
        if (!src) {
            return;
        }
        const selected: HTMLImageElement | null = this.getSelectedImage();
        const removeArgs: { name: string; subType: string; src: string; cancel: boolean } = {
            name: 'fileRemoving',
            subType: 'Image',
            src: selected ? (selected.getAttribute('src') || '') : src,
            cancel: false
        };
        this.parent.trigger('fileRemoving', removeArgs as FileRemovingEventArgs, (args: { cancel?: boolean }): void => {
            if (args && args.cancel) {
                return;
            }
            const payload: ImageUpdateCommand = { src: src };
            const controller: { execute?: (cmd: EditorCommandName, val?: unknown) => void } =
                this.parent.editorController as unknown as {
                    execute?: (cmd: EditorCommandName, val?: unknown) => void;
                };
            if (controller && typeof controller.execute === 'function') {
                controller.execute('replaceImage', payload);
            }
        });
    }

    /**
     * Opens the Quick Toolbar `AltText` dialog (`EditorDialog` sub
     * component). The dialog pre-fills the selected image's current `alt`
     * text; its Update button dispatches the `altText` command through the
     * editor controller.
     *
     * @returns {void}
     */
    private openAltTextDialog(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.destroyDialog((ref: EditorDialog | null) => this.altTextDialog = ref, 'altTextDialog');
        const editorId: string = (this.parent.element && this.parent.element.id) ? this.parent.element.id : 'rte';
        const dialogId: string = editorId + '_image_altText';
        const selected: HTMLImageElement | null = this.getSelectedImage();
        const currentAlt: string = selected ? (selected.getAttribute('alt') || '') : '';
        const body: HTMLElement = createElement('div', { className: 'e-img-altwrap' });
        const input: HTMLInputElement = createElement('input', {
            attrs: { type: 'text', spellcheck: 'false', placeholder: this.locale.getConstant('alternativeText') || 'Alternative Text' },
            className: 'e-input e-img-alt'
        }) as HTMLInputElement;
        input.value = currentAlt;
        body.appendChild(input);
        const updateLabel: string = this.locale.getConstant('dialogUpdate') || 'Update';
        const cancelLabel: string = this.locale.getConstant('dialogCancel') || 'Cancel';
        const isTesting: boolean = this.parent.element && this.parent.element.dataset && this.parent.element.dataset.rteUnitTesting === 'true';
        const dialogModel: EditorDialogModel = {
            header: this.locale.getConstant('alternativeText') || 'Alternative Text',
            content: body,
            width: '300px',
            isModal: (Browser.isDevice as boolean),
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            cssClass: 'e-rte-ui-image-alt-dialog',
            subType: 'Image',
            animationSettings: isTesting ? { effect: 'None', duration: 0 } : { effect: 'None' },
            buttons: [
                {
                    buttonModel: { content: updateLabel, isPrimary: true },
                    click: (): void => {
                        const value: string = (input.value || '').trim();
                        if (value !== '') {
                            this.commitAltText(value);
                        }
                        if (this.altTextDialog) {
                            this.altTextDialog.hide();
                        }
                    }
                },
                {
                    buttonModel: { content: cancelLabel },
                    click: (): void => {
                        if (this.altTextDialog) {
                            this.altTextDialog.hide();
                        }
                    }
                }
            ],
            beforeDialogClose: (args: BeforeDialogCloseEventArgs): void => {
                if (!args || !args.cancel) {
                    this.destroyDialog((ref: EditorDialog | null) => this.altTextDialog = ref, 'altTextDialog');
                    this.altTextDialog = null;
                }
                this.parent.inputElement.focus({ preventScroll: true });
            }
        };
        const target: HTMLElement = (Browser.isDevice) ? document.body : this.parent.element;
        this.altTextDialog = new EditorDialog(this.parent, dialogId, target, dialogModel);
        this.altTextDialog.show();
        input.focus();
    }

    /**
     * Opens the Quick Toolbar `Dimension` dialog (`EditorDialog` sub
     * component). The dialog pre-fills the selected image's rendered
     * width / height; its Update button dispatches the `dimensionImage`
     * command (headless `setImageDimension`) through the editor
     * controller.
     *
     * @returns {void}
     */
    private openDimensionDialog(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.destroyDialog((ref: EditorDialog | null) => this.altTextDialog = ref, 'altTextDialog');
        const editorId: string = (this.parent.element && this.parent.element.id) ? this.parent.element.id : 'rte';
        const dialogId: string = editorId + '_image_dimension';
        const selected: HTMLImageElement | null = this.getSelectedImage();
        const currentWidth: string = selected ? (selected.getAttribute('width') || String(Math.round(selected.getBoundingClientRect().width))) : '';
        const currentHeight: string = selected ? (selected.getAttribute('height') || String(Math.round(selected.getBoundingClientRect().height))) : '';
        const body: HTMLElement = createElement('div', { className: 'e-img-sizewrap' });
        const widthLabel: string = this.locale.getConstant('imageWidth') || 'Width';
        const heightLabel: string = this.locale.getConstant('imageHeight') || 'Height';
        const fields: { input: HTMLInputElement; label: string; cls: string; initial: string }[] = [
            {
                input: null, label: widthLabel, cls: 'e-img-width', initial: currentWidth
            },
            {
                input: null, label: heightLabel, cls: 'e-img-height', initial: currentHeight
            }
        ];
        const inputs: HTMLInputElement[] = [];
        for (const field of fields) {
            const label: HTMLElement = createElement('div', { className: 'e-rte-ui-label', innerHTML: field.label });
            const fieldWrap: HTMLElement = createElement('div', { className: 'e-rte-ui-field' });
            field.input = createElement('input', {
                attrs: { type: 'text', spellcheck: 'false', placeholder: field.label },
                className: 'e-input ' + field.cls
            }) as HTMLInputElement;
            field.input.value = field.initial;
            fieldWrap.appendChild(field.input);
            body.appendChild(label);
            body.appendChild(fieldWrap);
            inputs.push(field.input);
        }
        const updateLabel: string = this.locale.getConstant('dialogUpdate') || 'Update';
        const cancelLabel: string = this.locale.getConstant('dialogCancel') || 'Cancel';
        const isTesting: boolean = this.parent.element && this.parent.element.dataset && this.parent.element.dataset.rteUnitTesting === 'true';
        const dialogModel: EditorDialogModel = {
            header: this.locale.getConstant('changeSize') || 'Image Size',
            content: body,
            width: '300px',
            isModal: (Browser.isDevice as boolean),
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            cssClass: 'e-rte-ui-image-dimension-dialog',
            subType: 'Image',
            animationSettings: isTesting ? { effect: 'None', duration: 0 } : { effect: 'None' },
            buttons: [
                {
                    buttonModel: { content: updateLabel, isPrimary: true },
                    click: (): void => {
                        const widthInput: HTMLInputElement = inputs[0];
                        const heightInput: HTMLInputElement = inputs[1];
                        const width: number | null = widthInput.value.trim() === '' ? null : Number(widthInput.value);
                        const height: number | null = heightInput.value.trim() === '' ? null : Number(heightInput.value);
                        if ((width === null || isFinite(width)) && (height === null || isFinite(height))) {
                            this.commitDimensions(width, height);
                        }
                        if (this.dimensionDialog) {
                            this.dimensionDialog.hide();
                        }
                    }
                },
                {
                    buttonModel: { content: cancelLabel },
                    click: (): void => {
                        if (this.dimensionDialog) {
                            this.dimensionDialog.hide();
                        }
                    }
                }
            ],
            beforeDialogClose: (args: BeforeDialogCloseEventArgs): void => {
                if (!args || !args.cancel) {
                    this.destroyDialog((ref: EditorDialog | null) => this.dimensionDialog = ref, 'dimensionDialog');
                    this.dimensionDialog = null;
                }
                this.parent.inputElement.focus({ preventScroll: true });
            }
        };
        const target: HTMLElement = (Browser.isDevice) ? document.body : this.parent.element;
        this.dimensionDialog = new EditorDialog(this.parent, dialogId, target, dialogModel);
        this.dimensionDialog.show();
        if (inputs[0]) {
            inputs[0].focus();
        }
    }

    /**
     * Opens the Quick Toolbar `Replace` dialog (`EditorDialog` sub
     * component). The dialog offers a web-address input (mirroring the
     * Insert Image dialog's URL row); its Update button runs the
     * cancellable `fileRemoving` flow and then dispatches the
     * `replaceImage` command (headless `updateImage` carrying `src`)
     * through the editor controller.
     *
     * @returns {void}
     */
    private openReplaceDialog(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.destroyDialog((ref: EditorDialog | null) => this.replaceDialog = ref, 'replaceDialog');
        const editorId: string = (this.parent.element && this.parent.element.id) ? this.parent.element.id : 'rte';
        const dialogId: string = editorId + '_image_replace';
        const dropArea: HTMLElement = createElement('div', {
            className: 'e-img-uploadwrap e-droparea'
        });
        this.dropArea = dropArea;
        const message: HTMLElement = createElement('span', { className: 'e-droptext' });
        const messageText: HTMLElement = createElement('span', {
            className: 'e-rte-ui-upload-text',
            innerHTML: (Browser.isDevice ? 'Tap to upload' : 'Drop image here or browse to upload')
        });
        message.appendChild(messageText);
        const browseBtn: HTMLElement = createElement('button', {
            className: 'e-browsebtn e-control e-btn e-lib',
            attrs: { id: editorId + '_replaceImage', type: 'button', autofocus: 'true' }
        });
        browseBtn.textContent = this.locale.getConstant('browse') || 'Browse';
        message.appendChild(browseBtn);
        dropArea.appendChild(message);
        EventHandler.add(browseBtn, 'click', (): void => {
            if (this.fileInput) {
                this.fileInput.click();
            }
        });
        EventHandler.add(dropArea, 'click', (ev: Event): void => {
            if (ev.target !== browseBtn && this.fileInput) {
                this.fileInput.click();
            }
        });
        const urlLabel: HTMLElement = createElement('div', {
            className: 'e-linkheader',
            innerHTML: this.locale.getConstant('provideLink') || 'You can also provide a link from the web'
        });
        const urlRow: HTMLElement = createElement('div', { className: 'imgUrl' });
        const urlInput: HTMLInputElement = createElement('input', {
            attrs: {
                type: 'text', spellcheck: 'false', placeholder: 'https://example.com/image.png',
                'aria-label': 'You can also provide a link from the web'
            },
            className: 'e-input e-img-url'
        }) as HTMLInputElement;
        this.urlInput = urlInput;
        urlRow.appendChild(urlInput);
        EventHandler.add(urlInput, 'input', this.refreshInsertButtonState, this);
        EventHandler.add(urlInput, 'keyup', this.refreshInsertButtonState, this);
        const body: HTMLElement = createElement('div', { className: 'e-img-content' });
        body.appendChild(dropArea);
        body.appendChild(urlLabel);
        body.appendChild(urlRow);
        this.ensureUploadPopup(editorId, dropArea);
        this.fileInput = this.uploadPopup ? this.uploadPopup.getInputElement() : null;
        if (this.fileInput) {
            this.fileInput.id = editorId + '_replace_upload';
            this.fileInput.classList.add('e-rte-ui-image-file-input');
        }
        const updateLabel: string = this.locale.getConstant('dialogUpdate') || 'Update';
        const cancelLabel: string = this.locale.getConstant('dialogCancel') || 'Cancel';
        const isTesting: boolean = this.parent.element && this.parent.element.dataset && this.parent.element.dataset.rteUnitTesting === 'true';
        const dialogModel: EditorDialogModel = {
            header: this.locale.getConstant('replaceImage') || 'Edit Image',
            content: body,
            width: (Browser.isDevice) ? '290px' : '340px',
            isModal: (Browser.isDevice as boolean),
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            cssClass: 'e-rte-ui-img-dialog e-rte-ui-image-replace-dialog',
            subType: 'Image',
            animationSettings: isTesting ? { effect: 'None', duration: 0 } : { effect: 'None' },
            buttons: [
                {
                    buttonModel: { content: updateLabel, isPrimary: true, disabled: true },
                    click: (): void => {
                        const value: string = (urlInput.value || '').trim() || (this.pending ? this.pending.url : '');
                        if (value !== '') {
                            this.commitReplace(value);
                        }
                        if (this.replaceDialog) {
                            this.replaceDialog.hide();
                        }
                    }
                },
                {
                    buttonModel: { content: cancelLabel },
                    click: (): void => {
                        if (this.replaceDialog) {
                            this.replaceDialog.hide();
                        }
                    }
                }
            ],
            beforeDialogOpen: (): void => {
                this.pending = null;
                urlInput.value = '';
                if (this.fileInput) {
                    this.fileInput.value = '';
                }
                if (this.uploadPopup) {
                    this.uploadPopup.show();
                }
                this.refreshInsertButtonState();
            },
            beforeDialogClose: (args: BeforeDialogCloseEventArgs): void => {
                if (!args || !args.cancel) {
                    if (this.uploadPopup) {
                        this.uploadPopup.hide();
                        this.uploadPopup.destroy();
                        this.uploadPopup = null;
                    }
                    this.destroyDialog((ref: EditorDialog | null) => this.replaceDialog = ref, 'replaceDialog');
                    this.replaceDialog = null;
                }
                this.parent.inputElement.focus({ preventScroll: true });
            }
        };
        const target: HTMLElement = (Browser.isDevice) ? document.body : this.parent.element;
        this.replaceDialog = new EditorDialog(this.parent, dialogId, target, dialogModel);
        this.replaceDialog.show();
        urlInput.focus();
    }

    private destroyDialog(setter: (ref: EditorDialog | null) => void, fieldName: string): void {
        const record: Record<string, EditorDialog | null> = this as unknown as Record<string, EditorDialog | null>;
        const existing: EditorDialog | null | undefined = record[fieldName as string];
        if (existing) {
            existing.destroy();
        }
        setter(null);
    }

    /**
     * Wires `beforeImageSelect` / destroy listeners.
     *
     * @returns {void}
     */
    private addEventListener(): void {
        this.parent.on(events.imageOperations, this.handleImageQuickToolbarCommand, this);
        this.parent.on(events.editorKeydown, this.onKeyboardShortcut, this);
        this.parent.on(events.insertImage, this.show, this);
        this.parent.on(events.closeImageDialog, this.hide, this);
        if (this.parent.element) {
            this.parent.element.addEventListener('mousedown', this.onResizeStart, true);
            this.parent.element.addEventListener('touchstart', this.onResizeStart, true);
        }
    }

    /**
     * Removes any module-specific listeners. Today: no-op.
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        this.parent.off(events.imageOperations, this.handleImageQuickToolbarCommand);
        this.parent.off(events.insertImage, this.show);
        this.parent.off(events.editorKeydown, this.onKeyboardShortcut);
        this.parent.off(events.closeImageDialog, this.hide);
        if (this.parent.element) {
            this.parent.element.removeEventListener('mousedown', this.onResizeStart, true);
            this.parent.element.removeEventListener('touchstart', this.onResizeStart, true);
        }
    }

    private onResizeStart = (event: MouseEvent | TouchEvent): void => {
        const target: Element | null = event.target instanceof Element ? event.target : null;
        if (!target || !this.parent.inputElement || !this.parent.inputElement.contains(target) ||
            !target.closest('[data-resize-handle]')) {
            return;
        }
        this.parent.quickToolbarModule.hideQuickToolbars(true);
    };

    private handleImageQuickToolbarCommand(args: ImageEventArgs): void {
        if (!args || !args.item || !args.item.command) {
            return;
        }
        this.executeQuickToolbarAction(args.item.command, args.value);
        this.parent.off(events.editorKeydown, this.onKeyboardShortcut);
    }

    private onKeyboardShortcut(args: { originalEvent?: KeyboardEvent; action?: string }): void {
        if (!args || args.action !== 'image' || this.parent.isDestroyed || !this.parent.enable ||
            this.parent.readonly || !this.parent.isSelectionInRTE()) {
            return;
        }
        const event: KeyboardEvent | undefined = args.originalEvent;
        if (!event) {
            return;
        }
        event.preventDefault();
        this.show();
    }

    /**
     * Opens the Insert Image dialog. Lazily builds the dialog and the
     * underlying `EditorUploadPopup` on the first call; subsequent calls reuse them.
     *
     * @returns {void}
     */
    public show(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        if (!this.dialog) {
            this.buildDialog();
        }
        if (this.dialog) {
            this.dialog.show();
        }
    }

    /**
     * Closes the dialog if it is open. Idempotent.
     *
     * @returns {void}
     */
    public hide(): void {
        if (this.dialog) {
            this.dialog.hide();
        }
    }

    /**
     * Lazily builds the `EditorDialog` (with its drop area + Browse + URL row
     * + Insert / Cancel footer buttons) and the shared `EditorUploadPopup`
     * that owns the hidden `<input type="file">`.
     *
     * @returns {void}
     * @private
     */
    private buildDialog(): void {
        const editorId: string = (this.parent.element && this.parent.element.id) ? this.parent.element.id : 'rte';
        const dialogId: string = editorId + '_image';

        // --- Drop area + Browse button + hidden <input> ---------------
        const dropArea: HTMLElement = createElement('div', {
            className: 'e-img-uploadwrap e-droparea'
        });
        this.dropArea = dropArea;

        const message: HTMLElement = createElement('span', {
            className: 'e-droptext'
        });
        const messageText: HTMLElement = createElement('span', {
            className: 'e-rte-ui-upload-text',
            innerHTML: (Browser.isDevice ? 'Tap to upload' : 'Drop image here or browse to upload')
        });
        message.appendChild(messageText);
        dropArea.appendChild(message);

        const browseBtn: HTMLElement = createElement('button', {
            className: 'e-browsebtn e-control e-btn e-lib',
            attrs: { id: editorId + '_insertImage', type: 'button', autofocus: 'true' }
        });
        browseBtn.textContent = (this.locale && typeof this.locale.getConstant === 'function')
            ? (this.locale.getConstant('browse') || 'Browse')
            : 'Browse';
        message.appendChild(browseBtn);

        // The Browse button delegates to the hidden file input.
        EventHandler.add(browseBtn, 'click', (): void => {
            if (this.fileInput) {
                this.fileInput.click();
            }
        });
        // Clicking the drop area itself (anywhere outside the Browse button)
        // also opens the file picker — mirrors the legacy ej2 RTE flow.
        EventHandler.add(dropArea, 'click', (ev: Event): void => {
            if (ev.target === browseBtn) { return; }
            if (this.fileInput) {
                this.fileInput.click();
            }
        });

        // --- Optional URL row ---------------------------------------
        const urlLabel: HTMLElement = createElement('div', {
            className: 'e-linkheader',
            innerHTML: 'You can also provide a link from the web'
        });
        const urlRow: HTMLElement = createElement('div', {
            className: 'imgUrl'
        });
        this.urlInput = createElement('input', {
            attrs: { type: 'text', placeholder: 'https://example.com/image.png', spellcheck: 'false', 'aria-label': 'You can also provide a link from the web' },
            className: 'e-input e-img-url'
        }) as HTMLInputElement;
        urlRow.appendChild(this.urlInput);
        EventHandler.add(this.urlInput, 'input', this.refreshInsertButtonState, this);
        EventHandler.add(this.urlInput, 'keyup', this.refreshInsertButtonState, this);

        // --- Dialog body wraps drop area + url row -------------------
        const body: HTMLElement = createElement('div', {
            className: 'e-img-content'
        });
        body.appendChild(dropArea);
        body.appendChild(urlLabel);
        body.appendChild(urlRow);
        const isTesting: boolean = this.parent.element && this.parent.element.dataset && this.parent.element.dataset.rteUnitTesting === 'true';
        const dialogModel: EditorDialogModel = {
            header: this.locale.getConstant('insertImage') || 'Insert Image',
            content: body,
            width: (Browser.isDevice) ? '290px' : '340px',
            isModal: (Browser.isDevice as boolean),
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            cssClass: 'e-rte-ui-img-dialog',
            subType: 'Image',
            animationSettings: isTesting ? { effect: 'None', duration: 0 } : { effect: 'None' },
            buttons: [
                {
                    buttonModel: { content: 'Insert', isPrimary: true, disabled: true },
                    click: (): void => {
                        this.commitSelection();
                    }
                },
                {
                    buttonModel: { content: 'Cancel' },
                    click: (): void => {
                        if (this.dialog) {
                            this.dialog.hide();
                        }
                    }
                }
            ],
            beforeDialogOpen: (): void => {
                if (this.uploadPopup) {
                    this.uploadPopup.show();
                }
                // Reset staged state for a fresh open.
                this.pending = null;
                if (this.urlInput) {
                    this.urlInput.value = '';
                }
                if (this.fileInput) {
                    this.fileInput.value = '';
                }
                this.refreshInsertButtonState();
            },
            beforeDialogClose: (args: BeforeDialogCloseEventArgs): void => {
                if (this.uploadPopup) {
                    this.uploadPopup.hide();
                    this.uploadPopup.destroy();
                    this.uploadPopup = null;
                }
                this.dialog = null;
            }
        };
        this.ensureUploadPopup(editorId, dropArea);
        this.fileInput = this.uploadPopup ? this.uploadPopup.getInputElement() : null;
        if (this.fileInput) {
            this.fileInput.id = editorId + '_upload';
            this.fileInput.classList.add('e-rte-ui-image-file-input');
        }
        const target: HTMLElement = (Browser.isDevice) ? document.body : this.parent.element;
        this.dialog = new EditorDialog(this.parent, dialogId, target, dialogModel);
    }

    /**
     * Lazily constructs the shared `EditorUploadPopup` that owns the hidden
     * file input and Uploader. Idempotent: subsequent calls re-sync the live
     * popup's settings (extensions, max size) from the latest `imageSettings`.
     *
     * @param {string} editorId - Editor element id used to namespace the popup.
     * @param {HTMLElement} relateTo - Element used to position the popup.
     *
     * @returns {void}
     * @private
     */
    private ensureUploadPopup(editorId: string, relateTo: HTMLElement): void {
        const settings: ImageSettingsModel = this.parent.imageSettings || ({} as ImageSettingsModel);
        if (this.uploadPopup) {
            this.syncUploadPopupSettings(this.uploadPopup, settings);
            return;
        }
        this.uploadPopup = new EditorUploadPopup(this.parent, editorId + '_image_upload', relateTo, {
            type: 'Images',
            relateTo: relateTo,
            inline: true,
            viewPortElement: this.parent.element,
            saveUrl: settings.uploadUrl || '',
            removeUrl: settings.removeUrl || '',
            allowedExtensions: (settings.allowedTypes && settings.allowedTypes.length > 0)
                ? (settings.allowedTypes.join(',') as string & string[])
                : 'image/*',
            maxFileSize: (typeof settings.maxFileSize === 'number') ? settings.maxFileSize : 30000000,
            beforeFileUpload: (args: BeforeFileUploadEventArgs): void => {
                this.parent.trigger('beforeFileUpload', args);
            },
            fileUploading: (args: FileUploadingEventArgs): void => {
                this.parent.trigger('fileUploading', args);
            },
            fileSelected: (args: FileSelectedEventArgs): void => {
                this.parent.trigger('fileSelected', args, (args: FileSelectedEventArgs) => {
                    if (!args.cancel) {
                        if (!args || !args.filesData || !args.filesData[0]) {
                            this.refreshInsertButtonState();
                            return;
                        }
                        const file: FileInfo = args.filesData[0];
                        if (!this.parent.imageSettings.uploadUrl) {
                            this.stageFile(file);
                        } else {
                            this.pending = null;
                            this.refreshInsertButtonState();
                        }
                    }
                });
            },
            fileUploadSuccess: (args: FileUploadSuccessEventArgs): void => {
                this.parent.trigger('fileUploadSuccess', args, (e: FileUploadSuccessEventArgs) => {
                    if (e && e.operation && e.operation.toLowerCase() === 'upload') {
                        this.handleUploadSuccess(e);
                    }
                });
            },
            fileUploadFailed: (args: FileUploadFailedEventArgs): void => {
                this.parent.trigger('fileUploadFailed', args);
            },
            fileRemoving: (args: FileRemovingEventArgs): void => {
                this.parent.trigger('fileRemoving', args);
            }
        });
    }

    /**
     * Resolves a successful server upload and stages the resulting image.
     * The server endpoint receives the file; imageUrl is the public path used
     * by the document, matching the legacy RTE image upload contract. The
     * image is inserted only when the dialog Insert button is clicked.
     *
     * @param {FileUploadSuccessEventArgs} args - Successful upload arguments.
     * @returns {void}
     */
    private handleUploadSuccess(args: FileUploadSuccessEventArgs): void {
        if (!args || !args.file) {
            return;
        }
        const file: FileInfo = args.file;
        const settings: ImageSettingsModel = this.parent.imageSettings || ({} as ImageSettingsModel);
        const imageUrl: string = settings.imageUrl || '';
        const returnedSource: string = typeof file.fileSource === 'string' ? file.fileSource : '';
        const src: string = imageUrl ? imageUrl + file.name : returnedSource;
        if (!src) {
            this.parent.trigger('fileUploadFailed', {
                name: 'fileUploadFailed',
                subType: 'Image',
                message: 'imageUrl is not configured for the uploaded image.'
            });
            return;
        }
        const alt: string = (file.name || 'image').replace(/\.[a-zA-Z0-9]+$/, '');
        this.pending = {
            name: file.name || 'image',
            type: file.type || 'image/png',
            size: typeof file.size === 'number' ? file.size : 0,
            url: src,
            alt: alt
        };
        this.refreshInsertButtonState();
    }

    private syncUploadPopupSettings(uploadPopup: EditorUploadPopup, settings: ImageSettingsModel): void {
        if (settings.allowedTypes && settings.allowedTypes.length > 0) {
            uploadPopup.allowedExtensions = settings.allowedTypes.join(',') as string & string[];
        }
        if (typeof settings.maxFileSize === 'number') {
            uploadPopup.maxFileSize = settings.maxFileSize;
        }
        uploadPopup.saveUrl = settings.uploadUrl || '';
        uploadPopup.removeUrl = settings.removeUrl || '';
    }

    /**
     * Uploads binary data through the module-owned uploader. This is the
     * bridge used by RichTextEditorUI.uploadFile().
     *
     * @param {Blob} blob - Binary image data to upload.
     * @param {string} fileType - Image MIME type or extension.
     * @returns {void}
     */
    public uploadFileShow(blob: Blob, fileType: string): void {
        if (this.parent.isDestroyed || !blob) {
            return;
        }
        const editorId: string = (this.parent.element && this.parent.element.id) ? this.parent.element.id : 'rte';
        const relateTo: HTMLElement = this.parent.inputElement || this.parent.element;
        this.ensureUploadPopup(editorId, relateTo);
        if (!this.uploadPopup) {
            return;
        }
        const extension: string = (fileType || blob.type || 'image/png').split('/').pop() || 'png';
        const file: File = new File([blob], 'image.' + extension.replace(/[^a-z0-9]+/gi, ''), {
            type: blob.type || fileType || 'image/png'
        });
        this.uploadPopup.show(file);
    }

    /**
     * Reads the picked file and stages its `data:` URI (Base64 mode) or
     * `blob:` URL (Blob mode) on `this.pending`. After the reader resolves
     * the dialog's Insert button is re-enabled.
     *
     * @param {FileInfo} fileInfo - FileInfo from the Uploader's `selected` event.
     * @returns {void}
     * @private
     */
    private stageFile(fileInfo: FileInfo): void {
        const settings: ImageSettingsModel = this.parent.imageSettings || ({} as ImageSettingsModel);
        const rawFile: Blob | undefined = fileInfo.rawFile as Blob;
        if (!rawFile) {
            this.refreshInsertButtonState();
            return;
        }
        const name: string = fileInfo.name || 'image';
        const type: string = (fileInfo.type || 'image/png').toLowerCase();
        const size: number = typeof fileInfo.size === 'number' ? fileInfo.size : rawFile.size;
        const alt: string = name.replace(/\.[a-zA-Z0-9]+$/, '');
        let url: string;
        if (this.parent.imageSettings.imageUrl) {
            url = this.parent.imageSettings.imageUrl + name;
        }
        if (settings.saveFormat === 'Base64') {
            const reader: FileReader = new FileReader();
            reader.onload = (): void => {
                const dataUrl: string = url ? url : typeof reader.result === 'string' ? reader.result : '';
                this.pending = { name: name, type: type, size: size, url: dataUrl, alt: alt };
                this.refreshInsertButtonState();
            };
            reader.onerror = (): void => {
                this.parent.trigger('imageUploadFailed', {
                    name: 'imageUploadFailed',
                    message: 'Failed to read the selected file.'
                });
                this.refreshInsertButtonState();
            };
            reader.readAsDataURL(rawFile);
            return;
        }
        // Blob mode: object URL.
        try {
            let blobUrl: string = URL.createObjectURL(rawFile);
            this.blobUrls.add(blobUrl);
            blobUrl = url ? url : blobUrl;
            this.pending = { name: name, type: type, size: size, url: blobUrl, alt: alt };
            this.refreshInsertButtonState();
        } catch (_e) {
            this.parent.trigger('imageUploadFailed', {
                name: 'imageUploadFailed',
                message: 'Failed to create a local URL for the selected file.'
            });
            this.refreshInsertButtonState();
        }
    }

    /**
     * Toggles the Insert button's `disabled` state based on whether a
     * file has been staged or the URL row contains a non-empty value.
     *
     * @returns {void}
     * @private
     */
    private refreshInsertButtonState(): void {
        const activeDialog: EditorDialog | null = this.dialog || this.replaceDialog;
        if (!activeDialog) { return; }
        const fromUrl: boolean = !!(this.urlInput && (this.urlInput.value || '').trim() !== '');
        const ready: boolean = !!this.pending || fromUrl;
        // The underlying `Dialog` instance keeps the same `buttons` array;
        // mutate the first entry's `disabled` flag and surface to the
        // sub-component via `getButtons()` if available.
        const inner: { buttons?: { buttonModel: { disabled?: boolean } }[]; getButtons?(): { disabled: boolean }[] }
            = activeDialog as unknown as {
                buttons?: { buttonModel: { disabled?: boolean } }[];
                getButtons?(): { disabled: boolean }[];
            };
        const buttons: { buttonModel: { disabled?: boolean } }[] | undefined = inner.buttons;
        if (buttons && buttons.length > 0) {
            buttons[0].buttonModel.disabled = !ready;
        }
        if (typeof inner.getButtons === 'function') {
            const ej2Buttons: { disabled: boolean }[] = inner.getButtons();
            if (ej2Buttons && ej2Buttons[0]) {
                ej2Buttons[0].disabled = !ready;
            }
        }
        if (this.urlInput) {
            this.urlInput.disabled = !!this.pending;
        }
    }

    /**
     * Commits the staged selection (file or URL) into the editor by
     * invoking the headless editor's typed
     * `editor.commands.insertImage(payload)` facade.
     *
     * Mirrors the dispatch pattern in
     * `src/core/plugins/image-formats.ts` (the `ImageFormats` core
     * plugin): payload is shaped against the shared
     * {@link ImageInsertCommand} type, the call reaches through
     * `baseEditorCore.editor.commands.insertImage`, and the typed
     * facade originates from the `imageExtension` registered by this
     * module. Routing through the typed facade keeps the module
     * inside the same contract the editor core plugin exposes — no
     * duplicate type, no controller round-trip.
     *
     * After insert returns, the dialog is hidden and the staged state
     * is reset.
     *
     * @returns {void}
     * @private
     */
    private commitSelection(): void {
        let src: string | null = this.pending ? this.pending.url : null;
        let alt: string | undefined = this.pending ? this.pending.alt : undefined;
        // Manual URL input takes precedence over the staged file when both
        // are set — the user can override the picked file by typing a URL.
        if (this.urlInput && (this.urlInput.value || '').trim() !== '') {
            src = (this.urlInput.value || '').trim();
            alt = undefined;
        }
        if (!src) { return; }
        const settings: ImageSettingsModel = this.parent.imageSettings || ({} as ImageSettingsModel);
        const payload: ImageInsertCommand = {
            src: src,
            display: settings.display === 'break' ? 'block' : 'inline'
        };
        if (alt) { payload.alt = alt; }
        const dim: {
            width?: string | number; height?: string | number;
            minWidth?: string | number; maxWidth?: string | number | null;
            minHeight?: string | number; maxHeight?: string | number | null
        } = (settings.dimension) ? settings.dimension : {};
        const widthPx: number | undefined = this.coerceDimensionPx(dim.width);
        const heightPx: number | undefined = this.coerceDimensionPx(dim.height);
        if (typeof widthPx === 'number') { payload.width = widthPx; }
        if (typeof heightPx === 'number') { payload.height = heightPx; }
        this.insertImagePayload(payload);

        // Reset staged state and close.
        this.pending = null;
        if (this.urlInput) {
            this.urlInput.value = '';
        }
        if (this.dialog) {
            this.dialog.hide();
        }
    }

    /**
     * Inserts an image through the typed headless command facade.
     *
     * @param {ImageInsertCommand} payload - Image insertion payload.
     * @returns {void}
     */
    private insertImagePayload(payload: ImageInsertCommand): void {
        // Invoke the headless editor's image-insert facade directly.
        // Do this via the same access pattern used by the editor's
        const coreShape: { editor?: { commands?: { insertImage?: (payload: ImageInsertCommand) => boolean } } } =
            this.parent as unknown as {
                editor?: { commands?: { insertImage?: (payload: ImageInsertCommand) => boolean } };
            };
        // The core's `editor` is the same instance the parent reads
        // through `baseEditorCore`. Alias through the same accessor
        // path as `ImageFormats`.
        const parentPeek: { baseEditorCore?: { editor?: { commands?: { insertImage?: (payload: ImageInsertCommand) => boolean } } } } =
            this.parent as unknown as {
                baseEditorCore?: { editor?: { commands?: { insertImage?: (payload: ImageInsertCommand) => boolean } } };
            };
        const commands: { insertImage?: (payload: ImageInsertCommand) => boolean } | undefined =
            (coreShape.editor && coreShape.editor.commands)
            || (parentPeek.baseEditorCore && parentPeek.baseEditorCore.editor && parentPeek.baseEditorCore.editor.commands);
        const insertImage: ((payload: ImageInsertCommand) => boolean) | undefined =
            commands && typeof commands.insertImage === 'function' ? commands.insertImage : undefined;
        if (insertImage) {
            insertImage(payload);
            this.scheduleImageLoadActions(payload.src);
        }
    }

    /**
     * Runs image toolbar and resize selection logic after the image loads.
     *
     * @param {string} src - Source of the inserted image.
     * @returns {void}
     */
    private scheduleImageLoadActions(src: string): void {
        const image: HTMLImageElement | null = Array.from(this.parent.inputElement.querySelectorAll('img'))
            .reverse().find((candidate: HTMLImageElement): boolean => candidate.getAttribute('src') === src) || null;
        if (!image) {
            return;
        }
        const onLoad: () => void = (): void => {
            const quickToolbarModule: { showImageToolbarAfterLoad?: (target: HTMLImageElement) => void } =
                this.parent.quickToolbarModule as unknown as {
                    showImageToolbarAfterLoad?: (target: HTMLImageElement) => void
                };
            if (quickToolbarModule && typeof quickToolbarModule.showImageToolbarAfterLoad === 'function') {
                quickToolbarModule.showImageToolbarAfterLoad(image);
            }
        };
        if (image.complete) {
            queueMicrotask(onLoad);
        } else {
            image.addEventListener('load', onLoad, { once: true });
        }
    }

    /**
     * Coerces a dimension value to a numeric CSS pixel count. Strings
     * containing CSS units (`"100%"`, `"auto"`) collapse to `undefined`
     * so the headless editor doesn't crash at its `width: number` typing.
     *
     * @param {string | number | null | undefined} value - Dimension value to coerce.
     * @returns {number | undefined} Numeric pixel value, or `undefined` when unsupported.
     */
    private coerceDimensionPx(value: string | number | null | undefined): number | undefined {
        if (typeof value === 'number' && isFinite(value)) {
            return Math.round(value);
        }
        if (typeof value === 'string') {
            const trimmed: string = value.trim();
            if (trimmed === '' || trimmed === 'auto' || /%$/.test(trimmed)) {
                return undefined;
            }
            const parsed: number = Number(trimmed.replace(/px$/i, ''));
            if (isFinite(parsed)) { return Math.round(parsed); }
        }
        return undefined;
    }

    /**
     * Tears down the dialog, uploader, tracked blob URLs and any
     * keyboard shortcut. Idempotent.
     *
     * @returns {void}
     */
    protected destroyModule(): void {
        this.clearSelectedImage();
        // Revoke any tracked object URLs.
        this.blobUrls.forEach((url: string): void => {
            try { URL.revokeObjectURL(url); } catch (_err) { /* swallow */ }
        });
        this.blobUrls.clear();
        // Tear down the shared upload popup and its Uploader.
        if (this.uploadPopup) {
            try { this.uploadPopup.destroy(); } catch (_err) { /* swallow */ }
            this.uploadPopup = null;
        }
        // Tear down the dialog.
        if (this.dialog) {
            try { this.dialog.destroy(); } catch (_err) { /* swallow */ }
            this.dialog = null;
        }
        // Detach the URL input listeners.
        if (this.urlInput) {
            try {
                EventHandler.remove(this.urlInput, 'input', this.refreshInsertButtonState);
                EventHandler.remove(this.urlInput, 'keyup', this.refreshInsertButtonState);
            } catch (_err) { /* swallow */ }
            this.urlInput = null;
        }
        this.fileInput = null;
        this.dropArea = null;
        this.pending = null;
        // Tear down the Quick Toolbar feature dialogs.
        if (this.altTextDialog) {
            try { this.altTextDialog.destroy(); } catch (_err) { /* swallow */ }
        }
        this.altTextDialog = null;
        if (this.dimensionDialog) {
            try { this.dimensionDialog.destroy(); } catch (_err) { /* swallow */ }
        }
        this.dimensionDialog = null;
        if (this.replaceDialog) {
            try { this.replaceDialog.destroy(); } catch (_err) { /* swallow */ }
        }
        this.replaceDialog = null;
        if (this.parent && typeof this.parent.openImageDialog !== 'undefined') {
            this.parent.openImageDialog = undefined;
        }
        this.removeEventListener();
    }
}
