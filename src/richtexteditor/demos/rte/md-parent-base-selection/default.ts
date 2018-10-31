// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor, Toolbar, MarkdownFormatter, Link, Image,MarkdownEditor } from './../../../src/index';
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(MarkdownEditor);

let defaultRTE: RichTextEditor = new RichTextEditor({
    toolbarSettings: {
        items: ['Undo', 'Redo', 'Bold', 'Italic', 'StrikeThrough', '|', 'SubScript', 'SuperScript', '|',
            'LowerCase', 'UpperCase', '|', 'Formats', '|', 'OrderedList', 'UnorderedList', '|', 'Image', '|', 'CreateLink',
        '|', 'ClearFormat']
    },
    editorMode: 'Markdown',
    formatter: new MarkdownFormatter({ listTags: { 'OL': '1. ', 'UL': '> ', } })

});
defaultRTE.appendTo("#defaultRTE");