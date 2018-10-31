// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor, Toolbar, HtmlEditor, ToolbarType } from '../../../src/index';
RichTextEditor.Inject(Toolbar, HtmlEditor);

let defaultRTE: RichTextEditor = new RichTextEditor({
    height: 400,
    toolbarSettings: {
        type: ToolbarType.MultiRow,
        items: [
            "Bold", "Italic", "StrikeThrough", "UnderLine", "|", "Undo", "Redo", "|",
            "Cut", "Copy", "Paste", "|", "SuperScript", "SubScript", "|", "UpperCase",
            "LowerCase", "|", "OrderedList", "UnorderedList", "|", "Indent", "Outdent", "|",
            "CreateLink", "|", "Image", "|", "SourceCode", "|", "ClearFormat", "ClearAll", "|",
            "FullScreen", "|", "ZoomIn", "ZoomOut", "|", "Print", "|", "ViewSide", "InsertCode"
        ]
    },
    value: document.getElementById("trgContent").innerHTML
});
defaultRTE.appendTo("#defaultRTE");

let iframeRTE: RichTextEditor = new RichTextEditor({
    height: 400,
    iframeSettings: {
        enable: true
    },
    toolbarSettings: {
        type: ToolbarType.MultiRow,
        items: [
            "Bold", "Italic", "StrikeThrough", "UnderLine", "|", "Undo", "Redo", "|",
            "Cut", "Copy", "Paste", "|", "SuperScript", "SubScript", "|", "UpperCase",
            "LowerCase", "|", "OrderedList", "UnorderedList", "|", "Indent", "Outdent", "|",
            "CreateLink", "|", "Image", "|", "SourceCode", "|", "ClearFormat", "ClearAll", "|",
            "FullScreen", "|", "Print", "|", "ViewSide", "InsertCode"
        ]
    },
    value: document.getElementById("trgContent").innerHTML
});
iframeRTE.appendTo("#iframeRTE");

document.getElementById('btn_touch').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
};