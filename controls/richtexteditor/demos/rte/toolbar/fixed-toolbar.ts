// tslint:disable-next-line:missing-jsdoc
import { Browser } from '@syncfusion/ej2-base';
import { RichTextEditor, Toolbar, HtmlEditor } from './../../../src/index';
RichTextEditor.Inject(Toolbar, HtmlEditor);

let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
"AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";

Browser.userAgent = mobileUA;

let defaultRTE: RichTextEditor = new RichTextEditor({
    height: 400,
    toolbarSettings: {
        items: ['Bold', 'Italic', 'Underline', '|', 'Cut', 'Copy', 'Paste', '|', 'FullScreen']
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
        items: ['Bold', 'Italic', 'Underline', '|', 'FullScreen']
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