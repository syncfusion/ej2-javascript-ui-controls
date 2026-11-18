import { ProgressBar } from '@syncfusion/ej2-progressbar';
import { BlockEditor } from '../../base/index';
import { IProgressBarRendererOptions } from '../../../common/interface';

/**
 * `Progressbar renderer` module is used to render Progressbar control in BlockEditor.
 *
 * @hidden
 */
export class ProgressBarRenderer {
    private editor: BlockEditor;

    constructor(editor?: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders the progressbar control in BlockEditor.
     *
     * @param {IProgressBarRendererOptions} args - specifies the arguments.
     * @returns {ProgressBar} - returns the progressbar object.
     * @hidden
     */
    public renderProgressBar(args?: IProgressBarRendererOptions): ProgressBar {
        const progressBarObj: ProgressBar = new ProgressBar({
            type: args.type,
            value: args.value,
            height: args.height,
            width: args.width,
            trackThickness: args.trackThickness,
            progressThickness: args.progressThickness,
            showProgressValue: args.showProgressValue,
            animation: args.animation,
            margin: args.margin,
            minimum: args.minimum,
            maximum: args.maximum,
            enableRtl: this.editor.enableRtl
        } as ProgressBar);
        progressBarObj.appendTo(args.element);
        return progressBarObj;
    }
}
