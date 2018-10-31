// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor } from './../../../src/rich-text-editor/base/rich-text-editor';
import { ToolbarType } from './../../../src/rich-text-editor/base/enum';
import { Link } from './../../../src/rich-text-editor/renderer/link-module';
import { Image } from './../../../src/rich-text-editor/renderer/image-module';
import { HtmlEditor } from './../../../src/rich-text-editor/actions/html-editor';
import { Toolbar } from './../../../src/rich-text-editor/actions/toolbar';
import { QuickToolbar } from './../../../src/rich-text-editor/actions/quick-toolbar';
import { Count } from './../../../src/rich-text-editor/actions/count';
import { MouseEventArgs } from '@syncfusion/ej2-base';
import { ActionBeginEventArgs, ActionCompleteEventArgs, ChangeEventArgs } from '../../../src/components';

RichTextEditor.Inject(Toolbar);
 RichTextEditor.Inject(Link);
 RichTextEditor.Inject(Image);
RichTextEditor.Inject(HtmlEditor);
 RichTextEditor.Inject(QuickToolbar);
 RichTextEditor.Inject(Count);

let innerHTML: string = `<p><b>Description:</b></p>
<p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
the displayed content. A rich text editor control provides users with a toolbar
that helps them to apply rich text formats to the text entered in the text
area. </p>
<p><b>Functional
Specifications/Requirements:</b></p>
<ol><li><p>Provide
the tool bar support, it’s also customizable.</p></li><li><p>Options
to get the HTML elements with styles.</p></li><li><p>Support
to insert image from a defined path.</p></li><li><p>Footer
elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
the editor support.</p></li><li><p>Provide
efficient public methods and client side events.</p></li><li><p>Keyboard
navigation support.</p></li></ol>
<p><b>Description:</b></p>
<p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
the displayed content. A rich text editor control provides users with a toolbar
that helps them to apply rich text formats to the text entered in the text
area. </p>
<p><b>Functional
Specifications/Requirements:</b></p>
<ol><li><p>Provide
the tool bar support, it’s also customizable.</p></li><li><p>Options
to get the HTML elements with styles.</p></li><li><p>Support
to insert image from a defined path.</p></li><li><p>Footer
elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
the editor support.</p></li><li><p>Provide
efficient public methods and client side events.</p></li><li><p>Keyboard
navigation support.</p></li></ol>
`;
let defaultRTE: RichTextEditor = new RichTextEditor({
    height: 400,
    toolbarSettings: {
        items: ['Undo', 'Redo', '|',
            'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
            'SubScript', 'SuperScript', '|',
            'LowerCase', 'UpperCase', '|',
            'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
            'Indent', 'Outdent', '|', 'CreateLink', '|', 'Image', '|', 'SourceCode',
            '|', 'ClearFormat']
    }, format: {
         width: '50px'
    },
    value: innerHTML,
    showCharCount: true,
    created: create,
    actionBegin: actionBegin,
    actionComplete: actionComplete,
    focus: focus,
    blur: blur,
    change: change

});
defaultRTE.appendTo("#defaultRTE");
document.getElementById('clear').onclick = ((): void => {
    document.querySelector('.EventLog').innerHTML = '';
    document.querySelector('.NameLog').innerHTML = '';
    document.querySelector('.ValueLog').innerHTML = '';
    document.querySelector('.EditLog').innerHTML = '';
    document.querySelector('.ElementLog').innerHTML = '';
    document.querySelector('.EventArgsLog').innerHTML = '';
    document.querySelector('.RequestTypeLog').innerHTML = '';
    document.querySelector('.RangeeLog').innerHTML = '';
});
function createSpanElement(content: string): HTMLSpanElement {
    let node: HTMLSpanElement = document.createElement('span');
    node.innerHTML = content;
    return node;
}
function create(args: Object): void {
    document.querySelector('.EventLog').appendChild(
        createSpanElement('<b>create</b><hr>')
    );
    document.querySelector('.NameLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.ValueLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.EditLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.ElementLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.EventArgsLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.RequestTypeLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.RangeeLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
}
function actionBegin(args: ActionBeginEventArgs): void {
    document.querySelector('.EventLog').appendChild(
        createSpanElement('<b>actionBegin</b><hr>')
    );
    document.querySelector('.NameLog').appendChild(
        createSpanElement('<b>' + args.name + '</b><hr>')
    );
    document.querySelector('.ValueLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.EditLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.ElementLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.EventArgsLog').appendChild(
        createSpanElement('<b>' + args.originalEvent.detail.toString() + '</b><hr>')
    );
    document.querySelector('.RequestTypeLog').appendChild(
        createSpanElement('<b>' + args.requestType + '</b><hr>' )
    );
    document.querySelector('.RangeeLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
}
function actionComplete(args: ActionCompleteEventArgs): void {
    document.querySelector('.EventLog').appendChild(
        createSpanElement('<b>actionComplete</b><hr>')
    );
    document.querySelector('.NameLog').appendChild(
        createSpanElement('<b>' + args.name + '</b><hr>')
    );
    document.querySelector('.ValueLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.EditLog').appendChild(
        createSpanElement('<b>' + args.editorMode + '</b><hr>' )
    );
    document.querySelector('.ElementLog').appendChild(
        createSpanElement('<b>' + args.elements[0].nodeValue + '</b><hr>')
    );
    document.querySelector('.EventArgsLog').appendChild(
        createSpanElement('<b>' + args.event.detail.toLocaleString() + '</b><hr>')
    );
    document.querySelector('.RequestTypeLog').appendChild(
        createSpanElement('<b>' + args.requestType + '</b><hr>')
    );
    document.querySelector('.RangeeLog').appendChild(
        createSpanElement('<b>' + args.range.toString() + '</b><hr>')
    );
}
function focus(args: object): void {
    document.querySelector('.EventLog').appendChild(
        createSpanElement('<b>focus</b><hr>')
    );
    document.querySelector('.NameLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.ValueLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.EditLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.ElementLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.EventArgsLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.RequestTypeLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.RangeeLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
}
function blur(args: object): void {
    document.querySelector('.EventLog').appendChild(
        createSpanElement('<b>blur</b><hr>')
    );
    document.querySelector('.NameLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.ValueLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.EditLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.ElementLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.EventArgsLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.RequestTypeLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.RangeeLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
}
function change(args: ChangeEventArgs): void {
    document.querySelector('.EventLog').appendChild(
        createSpanElement('<b>change</b><hr>')
    );
    document.querySelector('.NameLog').appendChild(
        createSpanElement('<b>' + args.name + '</b><hr>')
    );
    document.querySelector('.ValueLog').appendChild(
        createSpanElement('<b>' + args.value + '</b><hr>')
    );
    document.querySelector('.EditLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.ElementLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.EventArgsLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.RequestTypeLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
    document.querySelector('.RangeeLog').appendChild(
        createSpanElement('<b>None</b><hr>')
    );
}
