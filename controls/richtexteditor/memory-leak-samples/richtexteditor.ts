import { enableRipple } from '@syncfusion/ej2-base';
import { Count } from '../src/rich-text-editor/actions/count';
import { Resize } from '../src/rich-text-editor/actions/resize';
import { ToolbarType } from '../src/rich-text-editor/base/enum';
import { Toolbar } from '../src/rich-text-editor/actions/toolbar';
import { Link } from '../src/rich-text-editor/renderer/link-module';
import { Table } from '../src/rich-text-editor/renderer/table-module';
import { Image } from '../src/rich-text-editor/renderer/image-module';
import { HtmlEditor } from '../src/rich-text-editor/actions/html-editor';
import { QuickToolbar } from '../src/rich-text-editor/actions/quick-toolbar';
import { RichTextEditor } from '../src/rich-text-editor/base/rich-text-editor';
import { ImportExport } from '../src/rich-text-editor/actions/import-export';
import { FormatPainter } from '../src/rich-text-editor/actions/format-painter';
import { EmojiPicker } from '../src/rich-text-editor/actions/emoji-picker';
import { Audio } from '../src/rich-text-editor/renderer/audio-module';
import { Video } from '../src/rich-text-editor/renderer/video-module';

enableRipple(true);

RichTextEditor.Inject(Link);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(Table);
RichTextEditor.Inject(Count);
RichTextEditor.Inject(Resize);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(QuickToolbar);
RichTextEditor.Inject(ImportExport);
RichTextEditor.Inject(FormatPainter);
RichTextEditor.Inject(EmojiPicker);
RichTextEditor.Inject(Audio);
RichTextEditor.Inject(Video);

let rte: RichTextEditor;
let date1: number, date2: number, date3: number;
let flag: boolean = true;

document.getElementById('render')!.addEventListener('click', renderRTE);
document.getElementById('destroy')!.addEventListener('click', destroyRTE);

let innerHTML: string = `<h1>Welcome to the Syncfusion Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-imginline" /></p>`;
function renderRTE(): void {
    date1 = new Date().getTime();
    rte = new RichTextEditor({
        height: 400,
        toolbarSettings: {
            items: ['Undo', 'Redo', '|',
                'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                'SubScript', 'SuperScript', '|',
                'LowerCase', 'UpperCase', '|', 
                'Formats', 'Alignments', 'Blockquote', '|', 'OrderedList', 'UnorderedList', '|',
                'Indent', 'Outdent', '|',
                'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                'SourceCode', '|', 'FormatPainter', '|', 'ClearFormat', '|', 'EmojiPicker', '|', 'Print', 'InsertCode', 'Audio', 'Video']
        },
        value: innerHTML,
        created: function () {
            date1 = new Date().getTime();
        },
        actionBegin: function (args?: any) {
            if (args.requestType === 'Bold' || args.requestType === 'Italic' || args.requestType === 'Underline') {
                date3 = new Date().getTime();
            }
        },
        actionComplete: function (args?: any) {
            if (date3) {
                const dateAction: number = new Date().getTime();
                document.getElementById('performanceTime1')!.innerText =
                    'Editor Action Taken Time: ' + (dateAction - date3) + 'ms';
            }
        },
        change: hide
    });
    rte.appendTo('#richTextEditor');
}

function hide(): void {
    if (flag && date1) {
        date2 = new Date().getTime();
        document.getElementById('performanceTime')!.innerText =
            'Time Taken: ' + (date2 - date1) + 'ms';
        flag = false;
    }
}

function destroyRTE(): void {
    if (rte && !rte.isDestroyed) {
        rte.destroy();
        rte = null;
    }
}
