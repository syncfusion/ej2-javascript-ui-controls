// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor, Toolbar, ToolbarType, HtmlEditor } from './../../../src/index';
RichTextEditor.Inject(Toolbar, HtmlEditor);

let defaultRTE: RichTextEditor;
let iframeRTE: RichTextEditor;

renderWithoutOffset();

function renderWithOffset(): void {
    defaultRTE = new RichTextEditor({
        height: 400,
        toolbarSettings: {
            enableFloating: true
        },
        floatingToolbarOffset: 50,
        value: document.getElementById("trgContent").innerHTML
    });
    defaultRTE.appendTo("#defaultRTE");

    iframeRTE = new RichTextEditor({
        height: 400,
        floatingToolbarOffset: 50,
        iframeSettings: {
            enable: true
        },
        toolbarSettings: {
            enableFloating: true,
            items: ['Undo', 'Redo', '|',
                'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                'SubScript', 'SuperScript', '|',
                'LowerCase', 'UpperCase', '|',
                'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                'Indent', 'Outdent', '|', 'CreateLink', '|', 'Image', '|', 'SourceCode',
                '|', 'ClearFormat']
        },
        value: document.getElementById("trgContent").innerHTML
    });
    iframeRTE.appendTo("#iframeRTE");
}

function renderWithoutOffset(): void {
    defaultRTE = new RichTextEditor({
        height: 400,
        toolbarSettings: {
            enableFloating: true
        },
        value: document.getElementById("trgContent").innerHTML
    });
    defaultRTE.appendTo("#defaultRTE");

    iframeRTE = new RichTextEditor({
        height: 400,
        iframeSettings: {
            enable: true
        },
        toolbarSettings: {
            enableFloating: true,
            items: ['Undo', 'Redo', '|',
                'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                'SubScript', 'SuperScript', '|',
                'LowerCase', 'UpperCase', '|',
                'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                'Indent', 'Outdent', '|', 'CreateLink', '|', 'Image', '|', 'SourceCode',
                '|', 'ClearFormat']
        },
        value: document.getElementById("trgContent").innerHTML
    });
    iframeRTE.appendTo("#iframeRTE");
}

document.getElementById('btn_touch').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
};

document.getElementById('btn_add').onclick = (e : Event) => {
    defaultRTE.destroy();
    iframeRTE.destroy();
    renderWithOffset();
};
document.getElementById('btn_remove').onclick = (e : Event) => {
    defaultRTE.destroy();
    iframeRTE.destroy();
    renderWithoutOffset();
};