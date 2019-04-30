// tslint:disable-next-line:missing-jsdoc
import { enableRipple } from '@syncfusion/ej2-base';
import { RichTextEditor, Toolbar, ToolbarType, HtmlEditor, QuickToolbar, IToolbarItems, Image, Link } from './../../../src/index';
RichTextEditor.Inject(Toolbar, HtmlEditor, QuickToolbar, Image, Link);

enableRipple(true);

let items: (string | IToolbarItems)[] = [
    'Undo', 'Redo', 'Bold', 'Italic', 'Underline', '-',
    'Cut', 'Copy', 'Paste', 'SuperScript', 'SubScript', '-',
    'LowerCase', 'UpperCase', 'UnorderedList', 'OrderedList', 'Indent', 'Outdent', '-',
    'CreateLink', 'Image', 'SourceCode', 'ClearFormat', 'ClearAll', 'Print', '-',
    'Formats', 'Alignments', 'FontSize', 'FullScreen'
];

let defaultRTE: RichTextEditor = new RichTextEditor({
    height: 400,
    toolbarSettings: {
        type: ToolbarType.Expand,
        items: items
    },
    inlineMode: {
        enable: true
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
        type: ToolbarType.Expand,
        items: items
    },
    inlineMode: {
        enable: true
    },
    value: document.getElementById("trgContent").innerHTML
});
iframeRTE.appendTo("#iframeRTE");

let absoluteRTE: RichTextEditor = new RichTextEditor({
    height: 400,
    toolbarSettings: {
        type: ToolbarType.Expand,
        items: items
    },
    inlineMode: {
        enable: true
    },
    value: document.getElementById("trgContent").innerHTML
});
absoluteRTE.appendTo("#absoluteRTE");

document.getElementById('btn_touch').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
};

document.getElementById("btn_show").onclick = (e : Event) => {
    document.querySelector(".absolute-section").classList.add("e-show");
};
document.getElementById('btn_hide').onclick = (e : Event) => {
    document.querySelector(".absolute-section").classList.remove("e-show");
};

document.getElementById("btn_select_true").onclick = (e : Event) => {
    defaultRTE.inlineMode.onSelection = true;
    defaultRTE.dataBind();
    iframeRTE.inlineMode.onSelection = true;
    iframeRTE.dataBind();
    absoluteRTE.inlineMode.onSelection = true;
    absoluteRTE.dataBind();
};
document.getElementById('btn_select_false').onclick = (e : Event) => {
    defaultRTE.inlineMode.onSelection = false;
    defaultRTE.dataBind();
    iframeRTE.inlineMode.onSelection = false;
    iframeRTE.dataBind();
    absoluteRTE.inlineMode.onSelection = false;
    absoluteRTE.dataBind();
};