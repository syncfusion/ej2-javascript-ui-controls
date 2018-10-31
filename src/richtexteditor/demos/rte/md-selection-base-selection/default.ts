// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor, Toolbar } from './../../../src/index';
RichTextEditor.Inject(Toolbar);

let defaultRTE: RichTextEditor = new RichTextEditor({
    toolbarSettings: {
        items: ['Undo','Redo','Bold', 'Italic', 'StrikeThrough', 'Pre', '|', 'SubScript', 'SuperScript', '|',
            'LowerCase', 'UpperCase', '|', 'Formats', '|', 'OrderedList', 'UnorderedList', '|']
    },
    editorMode: 'Markdown'

});
defaultRTE.appendTo("#defaultRTE");