// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor, HtmlEditor, Toolbar, Link, Image, Table, QuickToolbar, FileManager } from './../../../src/rich-text-editor';
import { SelectedEventArgs, UploadingEventArgs, RemovingEventArgs } from '@syncfusion/ej2-inputs';

RichTextEditor.Inject(HtmlEditor, Toolbar, Link, Table, Image, QuickToolbar, FileManager);

let innerHTML: string = `<p><b>Description:</b></p>
<p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
the displayed content. A rich text editor control provides users with a toolbar
that helps them to apply rich text formats to the text entered in the text
area. </p>
`;

let hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/';

let defaultRTE: RichTextEditor = new RichTextEditor({
    height: 400,
    toolbarSettings: {
        items: ['FileManager', 'Image']
    },
    fileManagerSettings: {
        enable: true,
        path: '/Pictures/Food',
        ajaxSettings: {
            url: hostUrl + 'api/FileManager/FileOperations',
            getImageUrl: hostUrl + 'api/FileManager/GetImage',
            uploadUrl: hostUrl + 'api/FileManager/Upload',
            downloadUrl: hostUrl + 'api/FileManager/Download'
        }
    },
    value: innerHTML,
    focus: focus,
    blur: blur,
    imageSelected: onFileSelected,
    imageUploading: onImageUploading,
    imageUploadSuccess: onImageUploadSuccess,
    imageUploadFailed: onImageUploadFailed,
    imageRemoving: onImageRemoving,
});
defaultRTE.appendTo("#defaultRTE");

function focus(args: any): void {
    console.log("Focus triggered");
}
function blur(args: any): void {
    console.log("Blur triggered");
}
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
document.getElementById('themes').addEventListener('change', (e: any) => {
    let container: HTMLElement = <HTMLElement>document.querySelector('.sample-container');
    container.style.background = ((e.target.value.indexOf('dark') > 0 || e.target.value.indexOf('contrast') > 0) ? 'black' : 'initial');
    document.getElementsByTagName('link')[0].href = '../../themes/' + e.target.value + '.css';
});