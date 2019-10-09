// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor, Toolbar } from './../../../src/index';
import { SelectionCommands } from './../../../src/editor-manager/plugin/selection-commands';
RichTextEditor.Inject(Toolbar);

let defaultRTE: RichTextEditor = new RichTextEditor({
    toolbarSettings: {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
        'SubScript', 'SuperScript', '|',
        'LowerCase', 'UpperCase']
    }
});
defaultRTE.appendTo("#defaultRTE");

let iframeRTE: RichTextEditor = new RichTextEditor({
    iframeSettings: {
        enable: true
    },
    toolbarSettings: {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
        'SubScript', 'SuperScript', '|',
        'LowerCase', 'UpperCase']
    }
});
iframeRTE.appendTo("#iframeRTE");

this.oncolor = ()=> {
    SelectionCommands.applyFormat(
        document, 'fontcolor',
        document.getElementById('defaultRTE'),
        (document.getElementById('fontcolor') as HTMLInputElement).value );
};
this.onbackcolor = ()=> {
    SelectionCommands.applyFormat(
        document, 'backgroundcolor',
        document.getElementById('defaultRTE'),
        (document.getElementById('backcolor') as HTMLInputElement).value );
};
document.getElementById('fontbtn').onclick = this.oncolor;
document.getElementById('backbtn').onclick = this.onbackcolor;