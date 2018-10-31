// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor, Toolbar, HtmlEditor } from '../../../src/index';
RichTextEditor.Inject(Toolbar, HtmlEditor);

let rteObj: RichTextEditor = new RichTextEditor({
    height: 400,
    iframeSettings: {
        enable: true
    },
    value: document.getElementById("trgContent").innerHTML
});
rteObj.appendTo("#RichTextEditor");

document.getElementById('btn_touch').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
};