import { IEditorCoreOptions } from '../base/interface';
import * as events from '../constants';
import { EditorCommandName, ImageInsertCommand, ImageUpdateCommand } from '../../controller/interface';

/**
 * Image execution payload mirrored across the action pipeline.
 *
 * @hidden
 */
interface ImageExecutionPayload {
    command: EditorCommandName;
    args?: unknown;
    callBack?: Function
}

// Typed headless image command payload shapes consumed by `translate`.
interface SetImageAlignPayload { align: 'left' | 'center' | 'right' | 'none'; }
interface SetImageWrapPayload { wrap: 'left' | 'right' | 'none'; }
interface SetImageDisplayPayload { mode: 'block' | 'inline'; }
interface SetImageDimensionPayload { width?: number | null; height?: number | null; }

/** Seam through which the headless `editor.commands` typed surface is read. */
interface HeadlessImageCommands {
    insertImage?: (payload: ImageInsertCommand | readonly ImageInsertCommand[]) => boolean;
    updateImage?: (payload: ImageUpdateCommand) => boolean;
    removeImage?: () => boolean;
    setImageAlign?: (payload: SetImageAlignPayload) => boolean;
    setImageWrap?: (payload: SetImageWrapPayload) => boolean;
    setImageDisplay?: (payload: SetImageDisplayPayload) => boolean;
    setImageDimension?: (payload: SetImageDimensionPayload) => boolean;
}

/**
 * `value` bag shape forwarded by `ToolbarActionHandler` /
 * `ImageModule` for the attribute-carrying image sub-commands.
 */
interface ImageActionValue {
    attribute?: string;
    value?: unknown;
    src?: string;
    alt?: string;
    width?: number | null;
    height?: number | null;
    mode?: 'block' | 'inline';
}

/**
 * ImageFormats - routes image-related controller commands to the
 * headless editor's typed `editor.commands` command surface.
 *
 * Mirrors the `BlockFormats` / `ListFormats` / `Alignment` plugin
 * pattern: subscribes to its dedicated observer event
 * (`image-executeAction`) and dispatches to the typed command facade.
 *
 * Each editor-level command maps to the exact headless command that
 * owns that operation:
 *  - `imageInsert`            → `insertImage`
 *  - `imageUpdate`            → `updateImage`
 *  - `removeImage`            → `removeImage`
 *  - `altText`                → `updateImage` (sets `alt`)
 *  - `replaceImage`          → `updateImage` (sets `src`)
 *  - `dimensionImage`         → `setImageDimension`
 *  - `alignImage` / `setAlignImage` → `setImageAlign`
 *  - `wrapTextImage` / `setWrapTextImage` → `setImageWrap`
 *  - `displayImage` / `inlineImage` / `breakImage` → `setImageDisplay`
 *  - `caption`                → reserved (no headless caption node yet)
 *
 * @hidden
 */
export class ImageFormats {
    public parent: IEditorCoreOptions;

    constructor(parent?: IEditorCoreOptions) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(events.imageExecution, this.applyImageFormats, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(events.imageExecution, this.applyImageFormats);
    }

    /**
     * Returns the headless editor's typed image command surface.
     *
     * @returns {HeadlessImageCommands} The image commands (possibly partial
     * when the image extension is not registered).
     */
    private getCommands(): HeadlessImageCommands {
        const editorRecord: { editor?: { commands?: object } } = this.parent as unknown as { editor?: { commands?: object } };
        const editor: { commands?: object } | undefined = editorRecord && editorRecord.editor;
        if (!editor || !editor.commands) {
            return {};
        }
        return editor.commands as unknown as HeadlessImageCommands;
    }

    private applyImageFormats(args: ImageExecutionPayload): void {
        const command: EditorCommandName = (args && typeof args.command === 'string')
            ? args.command as EditorCommandName
            : '' as EditorCommandName;
        if (!this.parent.editor) {
            return;
        }
        const commands: HeadlessImageCommands = this.getCommands();
        const value: ImageActionValue = (args.args && typeof args.args === 'object'
            && !Array.isArray(args.args))
            ? args.args as ImageActionValue
            : {} as ImageActionValue;
        switch (command) {
        case 'imageInsert': {
            const payload: ImageInsertCommand = (args.args as ImageInsertCommand) || ({} as ImageInsertCommand);
            if (commands.insertImage) {
                commands.insertImage(payload);
            }
            break;
        }
        case 'imageUpdate': {
            const payload: ImageUpdateCommand = (args.args as ImageUpdateCommand) || ({} as ImageUpdateCommand);
            if (commands.updateImage) {
                commands.updateImage(payload);
            }
            break;
        }
        case 'removeImage':
            if (commands.removeImage) {
                commands.removeImage();
            }
            break;
        case 'altText': {
            // Alt text is an attribute update on the selected image node.
            const payload: ImageUpdateCommand = (value && typeof value.alt === 'string')
                ? { alt: value.alt } as ImageUpdateCommand
                : (args.args as ImageUpdateCommand) || ({} as ImageUpdateCommand);
            if (commands.updateImage && payload.alt !== undefined) {
                commands.updateImage(payload);
            }
            break;
        }
        case 'replaceImage': {
            // Replace swaps the `src` on the selected image node.
            const payload: ImageUpdateCommand = (value && typeof value.src === 'string')
                ? { src: value.src } as ImageUpdateCommand
                : (args.args as ImageUpdateCommand) || ({} as ImageUpdateCommand);
            if (commands.updateImage && payload.src !== undefined) {
                commands.updateImage(payload);
            }
            break;
        }
        case 'dimensionImage': {
            // Dimension updates have their own headless command.
            const payload: SetImageDimensionPayload = { width: value.width, height: value.height };
            if (commands.setImageDimension &&
                (payload.width !== undefined || payload.height !== undefined)) {
                commands.setImageDimension(payload);
            }
            break;
        }
        case 'alignImage':
        case 'setAlignImage': {
            const align: unknown = value.value;
            if (commands.setImageAlign && (align === 'left' || align === 'center' || align === 'right' || align === 'none')) {
                commands.setImageAlign({ align: align });
            }
            break;
        }
        case 'wrapTextImage':
        case 'setWrapTextImage': {
            const wrap: unknown = value.value;
            if (commands.setImageWrap && (wrap === 'left' || wrap === 'right' || wrap === 'none')) {
                commands.setImageWrap({ wrap: wrap });
            }
            break;
        }
        case 'displayImage':
        case 'inlineImage':
        case 'breakImage': {
            // `inlineImage` / `breakImage` are the sub-item shortcuts for
            // the explicit display modes; `displayImage` carries the mode
            // in `value.mode`.
            const mode: 'block' | 'inline' = command === 'inlineImage'
                ? 'inline'
                : (command === 'breakImage' ? 'block' : (value.mode === 'inline' ? 'inline' : 'block'));
            if (commands.setImageDisplay) {
                commands.setImageDisplay({ mode: mode });
            }
            break;
        }
        case 'caption':
            // The headless image extension does not yet model a caption
            // node (`<figcaption>` story). Reserved so the toolbar command
            // has a stable home once that lands — for now it is a no-op.
            break;
        default:
            break;
        }
        if (typeof args.callBack === 'function') {
            args.callBack(this.parent.editor);
        }
    }

    private destroy(): void {
        this.removeEventListener();
    }
}
