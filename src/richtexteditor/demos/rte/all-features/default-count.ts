// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor, Toolbar, Link, Count, HtmlEditor } from './../../../src/index';
RichTextEditor.Inject(Toolbar, Count, HtmlEditor);
RichTextEditor.Inject(Link);

let innerHTML:string=`<p><b>Description:</b></p>
<p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
the displayed content. </p>`;
let defaultRTE: RichTextEditor = new RichTextEditor({
    toolbarSettings: {
        items: ['Undo', 'Redo', '|', 'Bold', 'Italic', 'Underline', '|', 'OrderedList', 'UnorderedList', '|', 'Indent', 'Outdent', '|', 'CreateLink', '|', 'Image', '|', 'SourceCode']
    },
    showCharCount: true,
    maxLength: 200
});
defaultRTE.appendTo("#defaultRTE");
defaultRTE.contentModule.getEditPanel().innerHTML=innerHTML;

let iframeRTE: RichTextEditor = new RichTextEditor({
    iframeSettings: {
        enable: true
    },
    toolbarSettings: {
        items: ['Undo', 'Redo', '|', 'Bold', 'Italic', 'Underline', '|', 'OrderedList', 'UnorderedList', '|', 'Indent', 'Outdent', '|', 'CreateLink', '|', 'Image', '|', 'SourceCode']
    },
    showCharCount: true,
    maxLength: 200
});
iframeRTE.appendTo("#iframeRTE");
iframeRTE.contentModule.getEditPanel().innerHTML=innerHTML;