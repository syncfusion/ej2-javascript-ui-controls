/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
import { addClass, detach, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { FileInfo, Uploader } from '@syncfusion/ej2-inputs';
import { RichTextEditorUI } from '../../richtexteditor-ui';
import {
    BeforeFileUploadEventArgs,
    FileUploadingEventArgs,
    FileSelectedEventArgs,
    FileUploadSuccessEventArgs,
    FileUploadFailedEventArgs,
    FileRemovingEventArgs
} from '../../common/interface';

/**
 * Type of media the upload popup handles. Kept local so the sub component does
 * not depend on the (still-incomplete) RTE-level enums; mirrors `MediaType`.
 */
export type MediaUploadType = 'Images';

/**
 * Options used to configure an `EditorUploadPopup`. This is the `model`
 * argument on the `EditorUploadPopup` constructor.
 */
export interface UploadPopupModel {
    /** Media type the popup is for — drives classes, allowed extensions, etc. */
    type: MediaUploadType;
    /** Server endpoint that receives the uploaded file. */
    saveUrl?: string;
    /** Server endpoint that removes a previously uploaded file. */
    removeUrl?: string;
    /** Comma-separated list of allowed file extensions (e.g. `.png,.jpg`). */
    allowedExtensions?: string;
    /** Maximum upload size in bytes. */
    maxFileSize?: number;
    /** Element the popup should be positioned relative to. */
    relateTo: HTMLElement;
    /** Element used as the popup's viewport so it stays clipped inside the editor. */
    viewPortElement?: HTMLElement;
    /** Optional CSS class(es) to add to the uploader inside the popup. */
    cssClass?: string;
    /** The HTML element for the drop area. */
    dropArea?: HTMLElement;
    /** Renders the uploader inside the supplied dialog content instead of as a floating popup. */
    inline?: boolean;
    /** Raised before the file is sent to the server. */
    beforeFileUpload?: (args: BeforeFileUploadEventArgs) => void;
    /** Raised while the file is being sent to the server. */
    fileUploading?: (args: FileUploadingEventArgs) => void;
    /** Raised when files are selected by the user. */
    fileSelected?: (args: FileSelectedEventArgs) => void;
    /** Raised when the upload succeeds. */
    fileUploadSuccess?: (args: FileUploadSuccessEventArgs) => void;
    /** Raised when the upload fails. */
    fileUploadFailed?: (args: FileUploadFailedEventArgs) => void;
    /** Raised when removing the files */
    fileRemoving?: (args: FileRemovingEventArgs) => void;
}

/**
 * EditorUploadPopup — an upload-popup sub component owned by the editor.
 *
 * Follows the sub-component convention documented in `docs/convention/sub-components.md`:
 *  - Named `Editor<Thing>`, no `Renderer` suffix.
 *  - Constructor takes `(editor, id, target, model)`.
 *  - Public surface is `show()`, `hide()`, `destroy()`.
 *  - Saves the editor selection before opening and restores it after closing
 *    using the shared `editor-selection-utils` (no base-class inheritance).
 *
 * The popup embeds an `Uploader` instance and feeds it the supplied file. The
 * type-specific class (`e-rte-image-upload-popup`, `e-rte-video-upload-popup` or
 * `e-rte-audio-upload-popup`) is applied to the popup root so existing styles
 * keep working.
 */
export class EditorUploadPopup {
    /** The editor instance the popup belongs to. */
    protected parent: RichTextEditorUI;
    /** Element the popup root is appended to. */
    protected target: HTMLElement;
    /** Caller-supplied upload options. */
    protected model: UploadPopupModel;
    /** Unique id of the rendered popup root element. */
    public id: string;
    /** The underlying `Popup` instance. */
    private popup: Popup;
    /** The underlying `Uploader` instance. */
    private uploader: Uploader;
    /** The native file input owned by the uploader. */
    private uploadElement: HTMLInputElement;
    /** Destroyed guard. */
    private isDestroyed: boolean = false;
    private saveSelection: any;

    constructor(editor: RichTextEditorUI, id: string, target: HTMLElement, model: UploadPopupModel) {
        this.parent = editor;
        this.target = target;
        this.id = id;
        this.model = model;
        this.render();
    }

    /**
     * Updates `saveUrl` on the live `Uploader` so the popup follows the most
     * recent `imageSettings.uploadUrl`. No-op after destroy.
     */
    public set saveUrl(value: string) {
        if (this.isDestroyed) { return; }
        if (this.model) { this.model.saveUrl = value; }
        if (this.uploader && this.uploader.asyncSettings && typeof value === 'string') {
            this.uploader.asyncSettings.saveUrl = value;
            this.updateUploadStatusVisibility();
        }
    }
    /** Returns the live `saveUrl`. */
    public get saveUrl(): string {
        return (this.model && this.model.saveUrl) ? this.model.saveUrl :
            (this.uploader && this.uploader.asyncSettings ? this.uploader.asyncSettings.saveUrl : '');
    }

    /**
     * Updates `removeUrl` on the live `Uploader`. No-op after destroy.
     */
    public set removeUrl(value: string) {
        if (this.isDestroyed) { return; }
        if (this.model) { this.model.removeUrl = value; }
        if (this.uploader && this.uploader.asyncSettings && typeof value === 'string') {
            this.uploader.asyncSettings.removeUrl = value;
        }
    }
    /** Returns the live `removeUrl`. */
    public get removeUrl(): string {
        return (this.model && this.model.removeUrl) ? this.model.removeUrl :
            (this.uploader && this.uploader.asyncSettings ? this.uploader.asyncSettings.removeUrl : '');
    }

    /**
     * Updates `allowedExtensions` on the live `Uploader`. Pass `undefined`
     * to clear. No-op after destroy.
     */
    public set allowedExtensions(value: string | undefined) {
        if (this.isDestroyed) { return; }
        if (this.model) { this.model.allowedExtensions = value; }
        if (this.uploader && typeof value === 'string') {
            this.uploader.allowedExtensions = value;
        }
    }
    /** Returns the live `allowedExtensions`. */
    public get allowedExtensions(): string | undefined {
        return this.model ? this.model.allowedExtensions :
            (this.uploader ? this.uploader.allowedExtensions : undefined);
    }

    /**
     * Updates `maxFileSize` on the live `Uploader`. Pass `undefined` to
     * clear. No-op after destroy.
     */
    public set maxFileSize(value: number | undefined) {
        if (this.isDestroyed) { return; }
        if (this.model) { this.model.maxFileSize = value; }
        if (this.uploader && typeof value === 'number') {
            this.uploader.maxFileSize = value;
        }
    }
    /** Returns the live `maxFileSize`. */
    public get maxFileSize(): number | undefined {
        return this.model ? this.model.maxFileSize :
            (this.uploader ? this.uploader.maxFileSize : undefined);
    }

    /**
     * Builds the popup root, the embedded `<input type="file">`, the `Popup`
     * wrapper and the `Uploader`, wiring the relevant upload events out to the
     * caller-supplied callbacks. The popup starts hidden; `show()` reveals it.
     *
     * @returns {void}
     */
    private render(): void {
        const popupElement: HTMLElement = this.parent.createElement('div', {
            id: this.id,
            className: 'e-rte-upload-popup'
        });
        this.target.appendChild(popupElement);
        // Apply the type-specific class so existing RTE styles keep working.
        switch (this.model.type) {
        case 'Images':
            addClass([popupElement], ['e-rte-image-upload-popup']);
            break;
        default:
            break;
        }
        if (!isNOU(this.parent.cssClass) && this.parent.cssClass.replace(/\s+/g, ' ').trim() !== '') {
            addClass([popupElement], this.parent.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }
        // The input that the Uploader will own.
        const uploadEle: HTMLInputElement = this.parent.createElement('input', {
            id: this.id + '_input',
            attrs: { type: 'File', name: 'UploadFiles' }
        }) as HTMLInputElement;
        this.uploadElement = uploadEle;
        popupElement.appendChild(uploadEle);
        // Build the Popup wrapper that hosts the input.
        this.popup = new Popup(popupElement, {
            relateTo: this.model.relateTo,
            viewPortElement: this.model.viewPortElement || this.parent.element,
            zIndex: 10001,
            content: null,
            enableRtl: this.parent.enableRtl,
            height: '85px',
            width: '300px',
            actionOnScroll: 'none'
        });
        this.popup.element.style.display = 'none';
        if (this.model.inline) {
            this.popup.element.style.position = 'static';
            this.popup.element.style.width = '100%';
            this.popup.element.style.height = 'auto';
        }
        // Build the Uploader on top of the input.
        const uploaderCss: string = 'e-rte-dialog-upload' + (this.model.cssClass ? (' ' + this.model.cssClass) : '');
        this.uploader = new Uploader({
            asyncSettings: {
                saveUrl: this.model.saveUrl,
                removeUrl: this.model.removeUrl
            },
            cssClass: uploaderCss,
            allowedExtensions: this.model.allowedExtensions,
            maxFileSize: this.model.maxFileSize,
            showFileList: true,
            multiple: false,
            dropArea: this.model.dropArea,
            enableRtl: this.parent.enableRtl,
            beforeUpload: (args: BeforeFileUploadEventArgs): void => {
                args.subType = this.model.type;
                if (typeof this.model.beforeFileUpload === 'function') {
                    this.model.beforeFileUpload(args);
                }
            },
            uploading: (args: FileUploadingEventArgs): void => {
                args.subType = this.model.type;
                if (typeof this.model.fileUploading === 'function') {
                    this.model.fileUploading(args);
                }
            },
            selected: (args: FileSelectedEventArgs): void => {
                args.subType = this.model.type;
                if (typeof this.model.fileSelected === 'function') {
                    this.model.fileSelected(args);
                }
                setTimeout(() => this.updateUploadStatusVisibility(), 0);
            },
            success: (args: FileUploadSuccessEventArgs): void => {
                args.subType = this.model.type;
                if (typeof this.model.fileUploadSuccess === 'function') {
                    this.model.fileUploadSuccess(args);
                }
            },
            failure: (args: FileUploadFailedEventArgs): void => {
                args.subType = this.model.type;
                if (typeof this.model.fileUploadFailed === 'function') {
                    this.model.fileUploadFailed(args);
                }
            },
            removing: (args: FileRemovingEventArgs): void => {
                args.subType = this.model.type;
                if (typeof this.model.fileRemoving === 'function') {
                    this.model.fileRemoving(args);
                }
            }
        });
        this.uploader.appendTo(uploadEle);
    }

    private updateUploadStatusVisibility(): void {
        if (!this.popup || !this.model) { return; }
        const showStatus: boolean = !!(this.model.saveUrl && this.model.saveUrl.trim() !== '');
        const statuses: NodeListOf<HTMLElement> = this.popup.element.querySelectorAll('.e-file-status');
        for (let i: number = 0; i < statuses.length; i++) {
            statuses[i as number].style.display = showStatus ? '' : 'none';
        }
    }

    /**
     * Returns the native file input owned by the uploader.
     *
     * @returns {HTMLInputElement | null} The uploader file input.
     */
    public getInputElement(): HTMLInputElement | null {
        return this.isDestroyed ? null : this.uploadElement;
    }

    /** Opens the native file picker for the embedded uploader. */
    public openFileDialog(): void {
        const input: HTMLInputElement = this.getInputElement();
        if (input) {
            input.click();
        }
    }

    /**
     * Snaps the editor's selection, optionally feeds the supplied file to the
     * uploader and reveals the popup. The save happens at the start so the
     * restored range is correct even if focus moves into the uploader while
     * the popup is open.
     *
     * When `file` is omitted the popup is revealed with an empty uploader so
     * the user can pick a file via its own browse button — this is the
     * button-click open path from the demo.
     *
     * @param {File} [file] - The file to upload. If not supplied the uploader
     *   is shown empty and waits for the user to choose a file.
     * @returns {void}
     */
    public show(file?: File): void {
        if (this.parent && this.parent.baseEditorCore) {
            this.saveSelection = this.parent.baseEditorCore.saveSelection();
        }
        if (!isNOU(file) && this.model.saveUrl && this.model.saveUrl.trim() !== '') {
            const fileInfo: FileInfo[] = [{
                name: file.name,
                rawFile: file,
                size: file.size,
                type: file.type,
                status: 'Ready to Upload',
                validationMessages: { minSize: '', maxSize: '' },
                statusCode: '1'
            }];
            this.uploader.createFileList(fileInfo);
            this.uploader.upload(fileInfo);
        }
        this.popup.element.style.display = 'block';
        if (!this.model.inline) {
            this.popup.refreshPosition(this.model.relateTo);
        }
    }

    /**
     * Hides the popup without destroying it; the saved selection is restored
     *
     * @returns {void}
     */
    public hide(): void {
        this.parent.trigger('beforeUploadPopupClose', {});
        this.popup.element.style.display = 'none';
        if (this.parent && this.parent.baseEditorCore) {
            this.parent.baseEditorCore.restoreSelection(this.saveSelection);
        }
    }

    /**
     * Destroys the Uploader and Popup and frees references. Idempotent.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        if (this.uploader && !this.uploader.isDestroyed) {
            this.uploader.destroy();
        }
        if (this.popup && !this.popup.isDestroyed) {
            this.popup.destroy();
        }
        if (this.popup && this.popup.element && this.popup.element.parentNode) {
            detach(this.popup.element);
        }
        this.uploader = null;
        this.uploadElement = null;
        this.popup = null;
        this.parent = null;
        this.target = null;
        this.model = null;
        this.isDestroyed = true;
    }
}
