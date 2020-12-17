// tslint:disable-next-line:missing-jsdoc
import { getUniqueID } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../../src/rich-text-editor/base/rich-text-editor';
import { ToolbarType } from './../../../src/rich-text-editor/base/enum';
import { Link } from './../../../src/rich-text-editor/renderer/link-module';
import { Image } from './../../../src/rich-text-editor/renderer/image-module';
import { HtmlEditor } from './../../../src/rich-text-editor/actions/html-editor';
// import { MarkdownEditor } from './../../../src/rich-text-editor/actions/markdown-editor';
import { Toolbar } from './../../../src/rich-text-editor/actions/toolbar';
import { QuickToolbar } from './../../../src/rich-text-editor/actions/quick-toolbar';
import { Table } from './../../../src/rich-text-editor/renderer/table-module';
import { SelectedEventArgs, UploadingEventArgs, RemovingEventArgs } from '@syncfusion/ej2-inputs';
import { RemoveEventArgs } from '@syncfusion/ej2-navigations';

RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(QuickToolbar);

let innerHTML: string = `<p><b>Description:</b></p>
<p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
the displayed content. A rich text editor control provides users with a toolbar
that helps them to apply rich text formats to the text entered in the text
area. </p>
`;
let defaultRTE: RichTextEditor = new RichTextEditor({
    height: 400,
    toolbarSettings: {
        items: ['Undo', 'Redo', '|',
            'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
            'SubScript', 'SuperScript', '|',
            'LowerCase', 'UpperCase', '|', 
            'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
            'Indent', 'Outdent', '|',  'Image', '|', 'SourceCode',
            '|', 'ClearFormat', 'Print']
    },
    insertImageSettings: {
        saveUrl:"http://localhost:62869/api/RichTextEditor/RenameFile",
        removeUrl:"http://localhost:62869/api/RichTextEditor/RemoveFile",
        path: "../Images/"
    },
    value: innerHTML,
    imageSelected: onFileSelected,
    imageUploading: onImageUploading,
    imageUploadSuccess: onImageUploadSuccess,
    imageUploadFailed: onImageUploadFailed,
    imageRemoving: onImageRemoving,
});
defaultRTE.appendTo("#defaultRTE");

function onFileSelected(args: SelectedEventArgs): void {
    console.log("file is selected");
}
function onImageUploading(args: UploadingEventArgs): void {
    console.log("file is uploading");
}
function onImageUploadSuccess(args: any): void {
    if (args.e.currentTarget.getResponseHeader('name') != null) {
        args.file.name = args.e.currentTarget.getResponseHeader('name');
        let filename:  any = document.querySelectorAll(".e-file-name")[0];
        filename.innerHTML = args.file.name.replace(document.querySelectorAll(".e-file-type")[0].innerHTML, '');
        filename.title = args.file.name;
    }
    console.log("file upload Success");
}
function onImageUploadFailed(args: SelectedEventArgs): void {
    console.log("file upload failed");
}
function onImageRemoving(args: RemovingEventArgs): void {
    console.log("file is cleared");
}
