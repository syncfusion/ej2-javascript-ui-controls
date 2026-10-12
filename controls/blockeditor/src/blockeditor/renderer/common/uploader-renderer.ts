import { Uploader } from '@syncfusion/ej2-inputs';
import { BlockEditor } from '../../base/index';
import { IUploaderRendererOptions } from '../../../common/interface';

/**
 * `Uploader renderer` module is used to render Uploader control in BlockEditor.
 *
 * @hidden
 */
export class UploaderRenderer {
    private editor: BlockEditor;

    constructor(editor?: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders the uploader control in BlockEditor.
     *
     * @param {IUploaderRendererOptions} args - specifies the arguments.
     * @returns {Uploader} - returns the uploader object.
     * @hidden
     */
    public renderUploader(args?: IUploaderRendererOptions): Uploader {
        return new Uploader({
            asyncSettings: args.asyncSettings,
            multiple: args.multiple,
            allowedExtensions: args.allowedExtensions,
            maxFileSize: args.maxFileSize,
            dropArea: args.dropArea,
            enableRtl: this.editor.enableRtl,
            cssClass: args.cssClass,
            selected: args.selected,
            uploading: args.uploading,
            progress: args.progress,
            success: args.success,
            failure: args.failure,
            beforeUpload: args.beforeUpload,
            removing: args.removing
        } as Uploader, args.element);
    }
}
