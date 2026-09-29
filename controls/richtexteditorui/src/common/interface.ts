import { BeforeOpenEventArgs, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';
import {
    BeforeUploadEventArgs,
    UploadingEventArgs,
    SelectedEventArgs,
    SuccessEventArgs,
    FailureEventArgs
} from '@syncfusion/ej2-inputs';
import { PopupEventArgs } from '@syncfusion/ej2-dropdowns';

export interface ICssClassArgs {
    oldCssClass: string
    cssClass: string
}

/**
 * Editor feature (`subType`) carried by every sub-component event argument
 * raised on the editor. The `subType` is a plain string set at sub-component
 * initialization (e.g. `'Link'`, `'Image'`, `'Table'`) identifying which
 * feature the dialog, popup, or upload belongs to. A single handler can
 * branch on `args.subType` rather than wiring one callback per feature.
 */
export interface SubComponentEventArgs {
    /**
     * The editor feature the sub-component belongs to. Supplied by the caller
     * when the sub-component is created. Undefined for generic sub-components
     * that are not tied to a specific feature.
     */
    subType?: string;
}

/**
 * Event args for {@link RichTextEditor.beforeDialogOpen}. Extends the ej2
 * {@link BeforeOpenEventArgs} with the `subType` field that identifies the
 * editor feature (e.g. `'Link'`, `'Image'`, `'Table'`) the dialog belongs to.
 */
export interface BeforeDialogOpenEventArgs extends BeforeOpenEventArgs, SubComponentEventArgs { }

/**
 * Event args for {@link RichTextEditor.beforeDialogClose}. Extends the ej2
 * {@link BeforeCloseEventArgs} with the `subType` field that identifies the
 * editor feature (e.g. `'Link'`, `'Image'`, `'Table'`) the dialog belongs to.
 */
export interface BeforeDialogCloseEventArgs extends BeforeCloseEventArgs, SubComponentEventArgs { }

/**
 * Event args for {@link RichTextEditor.beforePopupOpen}. Extends the ej2
 * {@link PopupEventArgs} with the `subType` field that identifies the editor
 * feature (e.g. `'Link'`, `'Image'`, `'Table'`) the popup belongs to.
 */
export interface BeforePopupOpenEventArgs extends PopupEventArgs, SubComponentEventArgs { }

/**
 * Event args for {@link RichTextEditor.beforePopupClose}. Extends the ej2
 * {@link BeforeCloseEventArgs} with the `subType` field that identifies the
 * editor feature (e.g. `'Link'`, `'Image'`, `'Table'`) the popup belongs to.
 */
export interface BeforePopupCloseEventArgs extends BeforeCloseEventArgs, SubComponentEventArgs { }

/**
 * Event args for {@link RichTextEditor.beforeFileUpload}. Extends the ej2
 * {@link BeforeUploadEventArgs} with the `subType` field that identifies the
 * editor feature the upload is for (e.g. `'Image'`).
 */
export interface BeforeFileUploadEventArgs extends BeforeUploadEventArgs, SubComponentEventArgs { }

/**
 * Event args for {@link RichTextEditor.fileUploading}. Extends the ej2
 * {@link UploadingEventArgs} with the `subType` field that identifies the
 * editor feature the upload is for.
 */
export interface FileUploadingEventArgs extends UploadingEventArgs, SubComponentEventArgs { }

/**
 * Event args for {@link RichTextEditor.fileSelected}. Extends the ej2
 * {@link SelectedEventArgs} with the `subType` field that identifies the
 * editor feature the upload is for.
 */
export interface FileSelectedEventArgs extends SelectedEventArgs, SubComponentEventArgs { }

/**
 * Event args for {@link RichTextEditor.fileUploadSuccess}. Extends the ej2
 * {@link SuccessEventArgs} with the `subType` field that identifies the
 * editor feature the upload is for.
 */
export interface FileUploadSuccessEventArgs extends SuccessEventArgs, SubComponentEventArgs { }

/**
 * Event args for {@link RichTextEditor.fileUploadFailed}. Extends the ej2
 * {@link FailureEventArgs} with the `subType` field that identifies the
 * editor feature the upload is for.
 */
export interface FileUploadFailedEventArgs extends FailureEventArgs, SubComponentEventArgs { }

/**
 * Event args for {@link RichTextEditor.fileRemoving}. Raised before a
 * previously-uploaded image is removed (client-side `URL.revokeObjectURL`
 * for `saveFormat: 'Blob'`, or before the `removeUrl` POST is sent for
 * server-side removal).
 *
 * Set `args.cancel = true` to keep the image in place; both the `Blob`
 * revocation and the `removeUrl` POST will be skipped.
 */
export interface FileRemovingEventArgs extends SubComponentEventArgs {
    /**
     * Cancels the removal. Both local `URL.revokeObjectURL` and the
     * `removeUrl` POST will be skipped.
     */
    cancel?: boolean;
    /** Source URL of the image being removed. */
    src?: string;
    /** Literal event name. */
    name: 'fileRemoving';
}

/**
 * Event args for {@link RichTextEditor.beforeFileDrop}. Raised when one or
 * more files are dropped (or pasted) onto the editable area, *before* the
 * image module routes them through the typed command pipeline.
 *
 * Set `args.cancel = true` to keep the document untouched.
 */
export interface BeforeFileDropEventArgs extends SubComponentEventArgs {
    /** Cancels the drop pipeline. */
    cancel?: boolean;
    /** Files dropped onto or pasted into the editor. */
    files: FileList;
    /** Literal event name. */
    name: 'beforeFileDrop';
}

/**
 * Event args for {@link RichTextEditor.resize}, {@link RichTextEditor.resizing},
 * and {@link RichTextEditor.resizeStop}. The headless editor's image plugin
 * invokes these via `ImageModule.beginResize(...)` / `emitResizing(...)` /
 * `endResize(...)` while the user interacts with the resize affordance.
 *
 * Per the spec, only `resize` (start) is cancellable. `resizing` and
 * `resizeStop` ignore `args.cancel`.
 */
export interface ResizeEventArgs extends SubComponentEventArgs {
    /** Cancels the resize start. Honored only when `name === 'resize'`. */
    cancel?: boolean;
    /** Source URL of the image being resized. */
    src?: string;
    /** Current width in CSS pixel units; `null` when unconstrained. */
    width?: string | number;
    /** Current height in CSS pixel units; `null` when unconstrained. */
    height?: string | number;
    /** Literal event name. */
    name: 'resize' | 'resizing' | 'resizeStop';
}

/**
 * Provides information about a BeforeSanitizeHtml event.
 */
export interface BeforeSanitizeHtmlArgs {
    /** Indicates whether the current action needs to be prevented. */
    cancel?: boolean
    /** A callback function executed before the inbuilt action, which should return HTML as a string.
     *
     * @function
     * @param {string} value - The input value.
     * @returns {string} - The HTML string.
     */
    helper?: Function
    /** Returns the selectors object containing both tags and attribute selectors to block cross-site scripting attacks.
     * It is also possible to modify the block list within this event.
     */
    selectors?: SanitizeSelectors
}

/**
 * Provides information about SanitizeSelectors.
 */
export interface SanitizeSelectors {
    /** Returns the list of tags. */
    tags?: string[]
    /** Returns the list of attributes to be removed. */
    attributes?: SanitizeRemoveAttrs[]
}

/**
 * Provides information about a SanitizeRemoveAttributes.
 */
export interface SanitizeRemoveAttrs {
    /** Defines the attribute name to sanitize. */
    attribute?: string
    /** Defines the selector that sanitizes the specified attributes within the selector. */
    selector?: string
}

/**
 * Specifies the custom slash command item configuration.
 */
export interface ISlashCommandItem {
    /** Specifies the text to be displayed in the slash command item. */
    text: string;
    /** Specifies the command to execute when the slash command item is clicked. */
    command: string;
    /** Specifies the icon class for the slash command item. */
    iconCss: string;
    /** Specifies the description to be displayed for the slash command item. */
    description?: string;
    /** Specifies the type of the slash command item. Grouping is done based on this value. */
    type: string;
}

/**
 * Provides detailed information about a SlashCommandItemSelect event.
 */
export interface SlashCommandItemSelectArgs {
    /** Returns true if the event is triggered by user interaction; otherwise false. */
    isInteracted: boolean;
    /** Returns the selected list item element of the slash command list. */
    item: HTMLLIElement;
    /** Returns the selected slash command item data. */
    itemData: ISlashCommandItem;
    /** Specifies the original event arguments (MouseEvent, KeyboardEvent, or TouchEvent). */
    originalEvent: MouseEvent | KeyboardEvent | TouchEvent;
    /** Specifies whether to cancel the default action. */
    cancel?: boolean;
}
