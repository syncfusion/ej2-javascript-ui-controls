// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor, Toolbar, Link, Image, HtmlEditor } from './../../../src/index';
import { L10n } from '@syncfusion/ej2-base';

RichTextEditor.Inject(HtmlEditor, Toolbar, Link, Image);

L10n.load({
    'de-DE': {
        'richtexteditor': {
            alignments: 'Alignments',
            justifyLeft: 'Ausrichten von Text links',
            justifyCenter: "Text-Zentrum",
            justifyRight: "Ausrichten von Text rechts",
            justifyFull: "rechtfertigen",
            fontName: "Wählen Sie Schriftfamilie",
            fontSize: "Wählen Sie Schriftgröße",
            fontColor: "Wählen Sie die Farbe",
            backgroundColor: "Hintergrundfarbe",
            bold: "fett",
            italic: "kursiv",
            underline: "unterstreichen",
            strikethrough: "Durchgestrichen",
            clearAll: "Alles",
            clearFormat: "Klar Format",
            cut: "schneiden",
            copy: "Kopieren",
            paste: "Paste",
            unorderedList: "Legen Sie ungeordnete Liste",
            orderedList: "Geordnete Liste einfügen",
            indent: "Einzug",
            outdent: "Einzug verkleinern",
            undo: "lösen",
            redo: "Wiederherstellen",
            superscript: "Überschrift",
            subscript: "index",
            createLink: "Einfügen / Hyperlink Bearbeiten",
            removeLink: "fjern Hyperlink",
            openLink: "Open link",
            editLink: "Edit link",
            image: "Bild einfügen",
            replace: 'ersetzen',
            align: 'ausrichten',
            caption: 'Bildbeschriftung',
            formats: 'Formats',
            remove: 'Löschen',
            insertLink: 'Link einfügen',
            display: 'Anzeige',
            alttext: 'alternativer Text',
            dimension: 'Größe',
            fullscreen: 'Vollbild',
            maximize: 'Maximieren',
            minimize: 'minimieren',
            zoomIn: 'hineinzoomen',
            zoomOut: 'Rauszoomen',
            upperCase: "Großbuchstaben",
            lowerCase: "Kleinbuchstaben",
            print: 'Drucken',
            sourcecode: 'Quellcode',
            preview: 'Vorschau',
            viewside: 'Seite anzeigen',
            insertcode: 'Code eingeben',
			linkText: 'Displaytekst',
			linkTooltipLabel: 'tooltip',
			linkWebUrl: 'Webadres',
			linkOpenInNewWindow: 'Open de link in een nieuw venster',
			linkHeader: 'Link invoegen',
			dialogInsert: 'invoegen',
			dialogCancel: 'Annuleer',
			dialogUpdate: 'Bijwerken',
			imageHeader: 'Voeg afbeelding in',
			imageLinkHeader: 'U kunt ook een link van internet opgeven',
			imageUploadMessage: 'Zet hier een afbeelding neer of klik om te uploaden',
			imageDeviceUploadMessage: 'Klik hier om te uploaden',
			imageAlternateText: 'Alternatieve tekst',
			alternateHeader: 'Alternatieve tekst',
			browse: 'Blader',
			imageUrl: 'URL',
			imageCaption: 'onderschrift',
			imageSizeHeader: 'Afbeeldingsgrootte',
			imageHeight: 'Hoogte',
			imageWidth: 'Breedte'
           }
       },
    'en-US': {
        'richtexteditor': {
            alignments: 'Alignments',
            justifyleft: 'JustifyLeft',
            justifycenter: "JustifyCenter",
            justifyright: "Justify Right",
            justifyfull: "Justify Full",
            formats: 'Formats',
            fontname: "Font Name",
            fontsize: "Font Size",
            fontcolor: "Font Color",
            backgroundcolor: "Background color",
            bold: "Bold",
            italic: "Italic",
            underline: "Underline",
            strikethrough: "Strikethrough",
            clearall: "Clear All",
            clearformat: "Clear Format",
            cut: "Cut",
            copy: "Copy",
            paste: "Paste",
            unorderedlist: "unordered list",
            orderedlist: "ordered list",
            indent: "Increase Indent",
            outdent: "Decrease Indent",
            undo: "Undo",
            redo: "Redo",
            superscript: "Superscript",
            subscript: "Subscript",
            createlink: "Insert link",
            removelink: "remove link",
            openlink: "Open link",
            editlink: "Edit link",
            image: "Insert image",
            replace: 'Replace',
            align: 'Align',
            caption: 'Caption',
            remove: 'Remove',
            insertlink: 'insertlink',
            display: 'Display',
            alttext: 'Alternative Text',
            dimension: 'Dimension',
            fullscreen: 'Full Screen',
            maximize: 'Maximize',
            minimize: 'Minimize',
            zoomin: 'Zoom In',
            zoomout: 'Zoom Out',
            uppercase: "Upper Case",
            lowercase: "Lower Case",
            print: 'Print',
            sourcecode: 'Source Code',
            preview: 'Preview',
            viewside: 'View Side',
            insertcode: 'Insert Code'
        }
    }
});
let defaultRTE: RichTextEditor;
let iframeRTE: RichTextEditor;

let innerHTML:string=`<p><b>Description:</b></p>
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
navigation support.</p></li></ol>`;
defaultRTE = new RichTextEditor({
    locale: 'de-DE',
    toolbarSettings: {
        items: ['|', 'Undo', 'Redo', '|',
        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
        'SubScript', 'SuperScript', '|',
        'LowerCase', 'UpperCase', '|',
        'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
        'Indent', 'Outdent', '|', 'CreateLink', '|', 'Image', '|', 'SourceCode']
    }
});
defaultRTE.appendTo("#defaultRTE");
defaultRTE.contentModule.getEditPanel().innerHTML=innerHTML;
defaultRTE.formatter.saveData();

iframeRTE = new RichTextEditor({
    locale: 'de-DE',
    iframeSettings: {
        enable: true
    },
    toolbarSettings: {
        items: ['|', 'Undo', 'Redo', '|', 'Bold', 'Italic', 'Underline', 'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'Indent', 'Outdent', '|', 'CreateLink', '|', 'Image', '|', 'SourceCode']
    }
});
iframeRTE.appendTo("#iframeRTE");
iframeRTE.contentModule.getEditPanel().innerHTML=innerHTML;
iframeRTE.formatter.saveData();