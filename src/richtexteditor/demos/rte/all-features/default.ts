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

RichTextEditor.Inject(Toolbar);
 RichTextEditor.Inject(Link);
 RichTextEditor.Inject(Image);
RichTextEditor.Inject(HtmlEditor);
 RichTextEditor.Inject(QuickToolbar);
 RichTextEditor.Inject(Table);

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
            'Indent', 'Outdent', '|', 'CreateTable', '|', 'CreateLink', '|', 'Image', '|', 'SourceCode',
            '|', 'ClearFormat']
    },
    value: innerHTML
});
defaultRTE.appendTo("#defaultRTE");

let iframeRTE: RichTextEditor = new RichTextEditor({
    height: 400,
    iframeSettings: {
        enable: true
    },
    toolbarSettings: {
        items: ['Undo', 'Redo', '|', 'Bold', 'Italic', 'Underline', 'Formats', 'Alignments', '|',
            'FontColor', 'BackgroundColor', '|', 'OrderedList', 'UnorderedList', '|', 'Indent',
            'Outdent', '|', 'CreateTable', '|', 'CreateLink', '|', 'Image', '|', 'SourceCode']
    },
    value:innerHTML
});
iframeRTE.appendTo("#iframeRTE");

document.getElementById('type').addEventListener('change', function(e: any): void {
    let type: ToolbarType;
    switch (e.target.value) {
        case "1":
            type = ToolbarType.Expand;
            break;
        case "2":
            type = ToolbarType.MultiRow;
            break;
    }
    defaultRTE.toolbarSettings.type = type;
    defaultRTE.dataBind();
    iframeRTE.toolbarSettings.type = type;
    iframeRTE.dataBind();
}, true);

document.getElementById('floating').addEventListener('change', function(e: any): void {
    let value: boolean;
    switch (e.target.value) {
        case "1":
            value = true;
            break;
        case "2":
            value = false;
            break;
    }
    defaultRTE.toolbarSettings.enableFloating = value;
    defaultRTE.dataBind();
    iframeRTE.toolbarSettings.enableFloating = value;
    iframeRTE.dataBind();
}, true);

document.getElementById('htmlEncode').addEventListener('change', function(e: any): void {
    let value: boolean;
    switch (e.target.value) {
        case "1":
            value = true;
            break;
        case "2":
            value = false;
            break;
    }
    defaultRTE.enableHtmlEncode = value;
    defaultRTE.dataBind();
    iframeRTE.enableHtmlEncode = value;
    iframeRTE.dataBind();
}, true);

document.getElementById('btn_touch').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.remove('e-bigger');
};

document.getElementById('btn_material').onclick = (e : Event) => {
    document.head.getElementsByTagName('link')[0].href = "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
    document.head.getElementsByTagName('link')[1].href = "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
    document.head.getElementsByTagName('link')[2].href = "../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
    document.head.getElementsByTagName('link')[3].href = "../../../node_modules/@syncfusion/ej2-lists/styles/material.css";
    document.head.getElementsByTagName('link')[4].href = "../../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
    document.head.getElementsByTagName('link')[5].href = "../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
    document.head.getElementsByTagName('link')[6].href = "../../../styles/material.css";
};
document.getElementById('btn_fabric').onclick = (e : Event) => {
    document.head.getElementsByTagName('link')[0].href = "../../../node_modules/@syncfusion/ej2-base/styles/fabric.css";
    document.head.getElementsByTagName('link')[1].href = "../../../node_modules/@syncfusion/ej2-inputs/styles/fabric.css";
    document.head.getElementsByTagName('link')[2].href = "../../../node_modules/@syncfusion/ej2-popups/styles/fabric.css";
    document.head.getElementsByTagName('link')[3].href = "../../../node_modules/@syncfusion/ej2-lists/styles/fabric.css";
    document.head.getElementsByTagName('link')[4].href = "../../../node_modules/@syncfusion/ej2-navigations/styles/fabric.css";
    document.head.getElementsByTagName('link')[5].href = "../../../node_modules/@syncfusion/ej2-splitbuttons/styles/fabric.css";
    document.head.getElementsByTagName('link')[6].href = "../../../styles/fabric.css";
};
document.getElementById('btn_bootstrap').onclick = (e : Event) => {
    document.head.getElementsByTagName('link')[0].href = "../../../node_modules/@syncfusion/ej2-base/styles/bootstrap.css";
    document.head.getElementsByTagName('link')[1].href = "../../../node_modules/@syncfusion/ej2-inputs/styles/bootstrap.css";
    document.head.getElementsByTagName('link')[2].href = "../../../node_modules/@syncfusion/ej2-popups/styles/bootstrap.css";
    document.head.getElementsByTagName('link')[3].href = "../../../node_modules/@syncfusion/ej2-lists/styles/bootstrap.css";
    document.head.getElementsByTagName('link')[4].href = "../../../node_modules/@syncfusion/ej2-navigations/styles/bootstrap.css";
    document.head.getElementsByTagName('link')[5].href = "../../../node_modules/@syncfusion/ej2-splitbuttons/styles/bootstrap.css";
    document.head.getElementsByTagName('link')[6].href = "../../../styles/bootstrap.css";
};
document.getElementById('btn_high_contrast').onclick = (e : Event) => {
    document.head.getElementsByTagName('link')[0].href = "../../../node_modules/@syncfusion/ej2-base/styles/highcontrast.css";
    document.head.getElementsByTagName('link')[1].href = "../../../node_modules/@syncfusion/ej2-inputs/styles/highcontrast.css";
    document.head.getElementsByTagName('link')[2].href = "../../../node_modules/@syncfusion/ej2-popups/styles/highcontrast.css";
    document.head.getElementsByTagName('link')[3].href = "../../../node_modules/@syncfusion/ej2-lists/styles/highcontrast.css";
    document.head.getElementsByTagName('link')[4].href = "../../../node_modules/@syncfusion/ej2-navigations/styles/highcontrast.css";
    document.head.getElementsByTagName('link')[5].href = "../../../node_modules/@syncfusion/ej2-splitbuttons/styles/highcontrast.css";
    document.head.getElementsByTagName('link')[6].href = "../../../styles/highcontrast.css";
};

document.getElementById('btn_div_html').onclick = (e : Event) => {
    alert(defaultRTE.getHtml());
};
document.getElementById('btn_iframe_html').onclick = (e : Event) => {
    alert(iframeRTE.getHtml());
};