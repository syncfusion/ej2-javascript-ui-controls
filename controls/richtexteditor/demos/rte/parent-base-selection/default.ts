// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor, Toolbar, MarkdownFormatter, Link, Image } from './../../../src/index';
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Image);

let defaultRTE: RichTextEditor = new RichTextEditor({
    toolbarSettings: {
        items: ['Undo','Redo','Bold', 'Italic', 'StrikeThrough', '|', 'SubScript', 'SuperScript', '|',
            'LowerCase', 'UpperCase', '|', 'Formats', '|', 'OrderedList', 'UnorderedList', '|', 'Image', '|', 'CreateLink']
    },
    editorMode: 'Markdown',
    formatter: new MarkdownFormatter({ listTags: { 'OL': '1. ', 'UL': '> ', } })

});
defaultRTE.appendTo("#defaultRTE");