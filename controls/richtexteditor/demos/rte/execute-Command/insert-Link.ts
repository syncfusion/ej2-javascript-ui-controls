// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor } from './../../../src/rich-text-editor/base/rich-text-editor';
import { ToolbarType } from './../../../src/rich-text-editor/base/enum';
import { Link } from './../../../src/rich-text-editor/renderer/link-module';
import { Image } from './../../../src/rich-text-editor/renderer/image-module';
import { HtmlEditor } from './../../../src/rich-text-editor/actions/html-editor';
// import { MarkdownEditor } from './../../../src/rich-text-editor/actions/markdown-editor';
import { Toolbar } from './../../../src/rich-text-editor/actions/toolbar';
import { QuickToolbar } from './../../../src/rich-text-editor/actions/quick-toolbar';
import { Table } from './../../../src/rich-text-editor/renderer/table-module';
import { NodeSelection } from '../../../src/index';
 
RichTextEditor.Inject(Toolbar);
 RichTextEditor.Inject(Link);
 RichTextEditor.Inject(Image);
RichTextEditor.Inject(HtmlEditor);
 RichTextEditor.Inject(QuickToolbar);
 RichTextEditor.Inject(Table);
 
let innerHTML: string = `<p><b>Description:</b></p>
<p>The Rich Text Editor (RTE) control <a class="e-rte-anchor" href="https://www.google.com" title="google" target="_blank">hello this is google link</a> is an easy to render in
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
        items: [{
                tooltipText: 'Insert Image',
                template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%">'
                + '<div class="e-tbar-btn-text" style="font-weight: 500;"> &#937;</div></button>'
            }, '|', 'Undo', 'Redo', '|',
            'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
            'SubScript', 'SuperScript', '|',
            'LowerCase', 'UpperCase', '|', 
            'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
            'Indent', 'Outdent', '|', 'CreateTable', '|', 'CreateLink', '|', 'Image', '|', 'SourceCode',
            '|', 'ClearFormat', 'Print', 'InsertCode']
    },
    value: innerHTML,
    created: onCreate,
    actionComplete: onActionComplete,
    insertImageSettings: {
        width: '300px',
        minHeight: '200px'
    }
});
defaultRTE.appendTo("#defaultRTE");
 
function onActionComplete(args: any): void {
    if (args.requestType === 'SourceCode') {
        defaultRTE.getToolbar().querySelector('#custom_tbar').parentElement.classList.add('e-overlay');
    } else if (args.requestType === 'Preview') {
        defaultRTE.getToolbar().querySelector('#custom_tbar').parentElement.classList.remove('e-overlay');
    }
}
 
function onCreate() {
 let customBtn = defaultRTE.element.querySelector('#custom_tbar') as HTMLElement;
    customBtn.onclick = () => {
        let selection: NodeSelection = new NodeSelection();
        let ranges: Range;
        let a = defaultRTE.inputElement.querySelector('a');
        let linkElm: Node[] = [];
        linkElm.push(a);   
        let saveSelection: NodeSelection;
        ranges = selection.getRange(document);
        saveSelection = selection.save(ranges, document);        
        saveSelection.restore();
        defaultRTE.executeCommand('editLink', {
            url: 'https://www.syncfusion.com',
            title: 'google',
            selection: selection,
            selectParent: linkElm
        });
        defaultRTE.executeCommand('createLink', {
            url: 'https://www.facebook.com',
            title: 'facebook',
            selection: selection,
            text: 'hello this is facebook link'
        });
    };
}