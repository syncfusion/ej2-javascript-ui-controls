// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor, Toolbar, HtmlEditor } from './../../../src/index';
RichTextEditor.Inject(Toolbar, HtmlEditor);

let defaultRTE: RichTextEditor = new RichTextEditor({
    height: 400,
    toolbarSettings: {
        items: ['Bold', 'Italic', 'Underline', '|', 'Cut', 'Copy', 'Paste', '|', 'Formats', 'Alignments']
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
        items: ['Bold', 'Italic', 'Underline', '|', 'Cut', 'Copy', 'Paste', '|', 'Formats', 'Alignments']
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