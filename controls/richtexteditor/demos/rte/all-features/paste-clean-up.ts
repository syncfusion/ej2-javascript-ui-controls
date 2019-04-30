// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor } from "./../../../src/rich-text-editor/base/rich-text-editor";
import { ToolbarType } from "./../../../src/rich-text-editor/base/enum";
import { Link } from "./../../../src/rich-text-editor/renderer/link-module";
import { Image } from "./../../../src/rich-text-editor/renderer/image-module";
import { HtmlEditor } from "./../../../src/rich-text-editor/actions/html-editor";
import { Toolbar } from "./../../../src/rich-text-editor/actions/toolbar";
import { QuickToolbar } from "./../../../src/rich-text-editor/actions/quick-toolbar";
import { Table } from "./../../../src/rich-text-editor/renderer/table-module";
import { PasteCleanup } from "./../../../src/rich-text-editor/actions/paste-clean-up";

RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(QuickToolbar);
RichTextEditor.Inject(Table);
RichTextEditor.Inject(PasteCleanup);

let innerHTML: string = `<p><b>Description:</b></p>
<p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
the displayed content. A rich text editor control provides users with a toolbar
that helps them to apply rich text formats to the text entered in the text
area. </p>
<p>
`;
let defaultRTE: RichTextEditor = new RichTextEditor({
  height: 400,
  toolbarSettings: {
    items: [
      "Undo",
      "Redo",
      "|",
      "Bold",
      "Italic",
      "Underline",
      "StrikeThrough",
      "|",
      "FontName",
      "FontSize",
      "FontColor",
      "BackgroundColor",
      "|",
      "SubScript",
      "SuperScript",
      "|",
      "LowerCase",
      "UpperCase",
      "|",
      "Formats",
      "Alignments",
      "|",
      "OrderedList",
      "UnorderedList",
      "|",
      "Indent",
      "Outdent",
      "|",
      "CreateTable",
      "|",
      "CreateLink",
      "|",
      "Image",
      "|",
      "SourceCode",
      "|",
      "ClearFormat"
    ]
  },
  pasteCleanupSettings: {
    allowedStyleProps: ['margin', 'color', 'width'],
    deniedAttrs: ['class', 'title'],
    deniedTags: ['a[!href]'],
    prompt: true
  },
  value: innerHTML
});
defaultRTE.appendTo("#defaultRTE");

  let promptElem = document.getElementById("prompt");
  let plainTextElem = document.getElementById("plainText");
  let keepFormatElem = document.getElementById("keepFormat");
  let allowedStylePropsElem = document.getElementById("allowedStyleProps");
  let deniedTagsElem = document.getElementById("deniedTags");
  let deniedAttrsElem = document.getElementById("deniedAttrs");
  allowedStylePropsElem.addEventListener('blur', (e) => {
    defaultRTE.pasteCleanupSettings.allowedStyleProps= eval((e.target as HTMLInputElement).value);
    defaultRTE.dataBind();
  });
  deniedAttrsElem.addEventListener('blur', (e) => {
    defaultRTE.pasteCleanupSettings.deniedAttrs= eval((e.target as HTMLInputElement).value);
    defaultRTE.dataBind();
  });
  deniedTagsElem.addEventListener('blur', (e) => {
    defaultRTE.pasteCleanupSettings.deniedTags= eval((e.target as HTMLInputElement).value);
    defaultRTE.dataBind();
  })
  promptElem.onclick = (e) => {
    defaultRTE.pasteCleanupSettings.prompt = ((e.target as HTMLInputElement).checked);
    if(defaultRTE.pasteCleanupSettings.prompt) {
      keepFormatElem.setAttribute('disabled','disabled');
      plainTextElem.setAttribute('disabled','disabled');
    } else {
      if (plainTextElem.hasAttribute('disabled')) {
        plainTextElem.removeAttribute('disabled');
      }
      if(keepFormatElem.hasAttribute('disabled')) {
        keepFormatElem.removeAttribute('disabled');
      } 
    }
    defaultRTE.dataBind();
  };
  plainTextElem.onclick = (e) => {
    defaultRTE.pasteCleanupSettings.plainText = ((e.target as HTMLInputElement).checked);
    if(defaultRTE.pasteCleanupSettings.plainText) {
      promptElem.setAttribute('disabled','disabled');
      keepFormatElem.setAttribute('disabled','disabled');
      defaultRTE.pasteCleanupSettings.prompt = false;
    } else {
      if (promptElem.hasAttribute('disabled')) {
        promptElem.removeAttribute('disabled');
      }
      if(keepFormatElem.hasAttribute('disabled')) {
        keepFormatElem.removeAttribute('disabled');
      }
    }
    defaultRTE.dataBind();
  };
  keepFormatElem.onclick = (e) => {
    defaultRTE.pasteCleanupSettings.keepFormat = ((e.target as HTMLInputElement).checked);
    if(defaultRTE.pasteCleanupSettings.keepFormat) {
      promptElem.setAttribute('disabled','disabled');
      plainTextElem.setAttribute('disabled','disabled');
      defaultRTE.pasteCleanupSettings.prompt = false;
      defaultRTE.pasteCleanupSettings.plainText = false;
    } else {
      if (promptElem.hasAttribute('disabled')) {
        promptElem.removeAttribute('disabled');
      }
      if(plainTextElem.hasAttribute('disabled')) {
        plainTextElem.removeAttribute('disabled');
      }
    }
    defaultRTE.dataBind();
  }; 