// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor, Toolbar } from '../../../src/index';
RichTextEditor.Inject(Toolbar);

let defaultRTE: RichTextEditor = new RichTextEditor({
    toolbarSettings: {
        items: ['Bold', 'Italic', 'Underline', 'Print']
    }
});
defaultRTE.appendTo("#defaultRTE");

let iframeRTE: RichTextEditor = new RichTextEditor({
    iframeSettings: {
        enable: true
    },
    toolbarSettings: {
        items: ['Bold', 'Italic', 'Underline', 'Print']
    }
});
iframeRTE.appendTo("#iframeRTE");

document.querySelectorAll(".e-content")[0].innerHTML = document.getElementById("trgContent1").innerHTML;
let iframeContentElement: HTMLIFrameElement = <HTMLIFrameElement>document.querySelector("iframe.e-rte-content");
iframeContentElement.contentDocument.body.innerHTML = document.getElementById("trgContent2").innerHTML;