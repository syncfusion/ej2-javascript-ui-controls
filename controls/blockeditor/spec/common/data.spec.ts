import { BlockModel } from "../../src/models/index";
import { BlockType, ContentType } from '../../src/models/enums';

export const allTypesOfBlock: BlockModel[] = [
    {
        id: 'demo-heading',
        blockType: BlockType.Heading,
        properties: { level: 2 },
        content: [
            { id: 'demo-heading-content', contentType: ContentType.Text, content: 'Welcome to the Block Editor Demo!' }
        ]
    },

    {
        id: 'demo-intro',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'intro-t1', contentType: ContentType.Text, content: 'Welcome to the ' },
            { id: 'intro-bold', contentType: ContentType.Text, content: 'Block Editor', properties: { styles: { bold: true } } },
            { id: 'intro-t2', contentType: ContentType.Text, content: '! This demo highlights all supported block types and inline formatting options. Each section below explains the purpose of the block and shows how it appears in the editor.' }
        ]
    },

    {
        id: 'heading-paragraph',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-paragraph-content', contentType: ContentType.Text, content: 'Paragraph' }]
    },

    {
        id: 'paragraph-explainer',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'p-ex-1', contentType: ContentType.Text, content: 'Paragraph blocks are used for writing regular text. They are the most common block type and support inline formatting to enhance readability and emphasis.' }
        ]
    },

    {
        id: 'heading-inline-formatting',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [
            { id: 'heading-inline-formatting-content', contentType: ContentType.Text, content: 'Inline Formatting' }
        ]
    },

    // Core emphasis styles combined
    {
        id: 'inline-core-styles',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'ics-1', contentType: ContentType.Text, content: 'Use ' },
            { id: 'ics-bold', contentType: ContentType.Text, content: 'bold', properties: { styles: { bold: true } } },
            { id: 'ics-2', contentType: ContentType.Text, content: ', ' },
            { id: 'ics-italic', contentType: ContentType.Text, content: 'italic', properties: { styles: { italic: true } } },
            { id: 'ics-3', contentType: ContentType.Text, content: ', and ' },
            { id: 'ics-underline', contentType: ContentType.Text, content: 'underline', properties: { styles: { underline: true } } },
            { id: 'ics-4', contentType: ContentType.Text, content: ' for emphasis; or ' },
            { id: 'ics-strike', contentType: ContentType.Text, content: 'strikethrough', properties: { styles: { strikethrough: true } } },
            { id: 'ics-5', contentType: ContentType.Text, content: ' to indicate removals or outdated text.' }
        ]
    },

    // Technical/semantic styles together
    {
        id: 'inline-technical-semantic',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'its-1', contentType: ContentType.Text, content: 'Math and chemistry: E = mc' },
            { id: 'its-sup', contentType: ContentType.Text, content: '2', properties: { styles: { superscript: true } } },
            { id: 'its-2', contentType: ContentType.Text, content: ', H' },
            { id: 'its-sub', contentType: ContentType.Text, content: '2', properties: { styles: { subscript: true } } },
            { id: 'its-3', contentType: ContentType.Text, content: 'O - with superscript and subscript. Add inline code ' },
            { id: 'its-4', contentType: ContentType.Text, content: ' and helpful ' },
            { id: 'its-link', contentType: ContentType.Link, content: 'links', properties: { url: 'https://ej2.syncfusion.com/documentation/block-editor/getting-started' } },
            { id: 'its-5', contentType: ContentType.Text, content: ' for quick references.' }
        ]
    },

    // Transform and color styles, plus mention/label in one line
    {
        id: 'inline-transforms-colors',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'itc-1', contentType: ContentType.Text, content: 'Transform text to ' },
            { id: 'itc-upper', contentType: ContentType.Text, content: 'uppercase', properties: { styles: { uppercase: true } } },
            { id: 'itc-2', contentType: ContentType.Text, content: ' or ' },
            { id: 'itc-lower', contentType: ContentType.Text, content: 'LOWERCASE', properties: { styles: { lowercase: true } } },
            { id: 'itc-3', contentType: ContentType.Text, content: '. Add ' },
            { id: 'itc-color', contentType: ContentType.Text, content: 'color', properties: { styles: { color: 'green' } } },
            { id: 'itc-4', contentType: ContentType.Text, content: ' or ' },
            { id: 'itc-bg', contentType: ContentType.Text, content: 'background highlights', properties: { styles: { backgroundColor: '#FEF3C7', color: '#92400E' } } },
            { id: 'itc-5', contentType: ContentType.Text, content: ' as needed. Mention ' },
            { id: 'itc-mention', contentType: ContentType.Mention, properties: { userId: 'user1' } },
            { id: 'itc-6', contentType: ContentType.Text, content: ' and tag with ' },
            { id: 'itc-label', contentType: ContentType.Label, properties: { labelId: 'progress' } },
            { id: 'itc-7', contentType: ContentType.Text, content: ' to add context.' }
        ]
    },

    {
        id: 'heading-headings',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-headings-content', contentType: ContentType.Text, content: 'Headings' }]
    },
    {
        id: 'headings-paragraph',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'hp-1', contentType: ContentType.Text, content: 'Headings help organize content into sections. Use different levels ' },
            { id: 'hp-2', contentType: ContentType.Text, content: '(h1, h2, h3 or h4)', properties: { styles: { bold: true } } },
            { id: 'hp-3', contentType: ContentType.Text, content: ' to create a hierarchy:' }
        ]
    },

    {
        id: 'heading-quote',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-quote-content', contentType: ContentType.Text, content: 'Quote' }]
    },

    {
        id: 'quote-explainer',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'q-ex-1', contentType: ContentType.Text, content: 'Use quote blocks to emphasize important statements or references.' }
        ]
    },

    {
        id: 'quote-block',
        blockType: BlockType.Quote,
        content: [
            { id: 'quote-text', contentType: ContentType.Text, content: '“Quotes are perfect for highlighting key messages or testimonials.”' }
        ]
    },

    {
        id: 'heading-callout',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-callout-content', contentType: ContentType.Text, content: 'Callout' }]
    },

    {
        id: 'callout-explainer',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'co-ex-1', contentType: ContentType.Text, content: 'Callouts are great for tips, warnings, or notes that need attention.' }
        ]
    },

    {
        id: 'callout-tip',
        blockType: BlockType.Callout,
        properties: {
            children: [
                {
                    id: 'callout-tip-p',
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'co-1', contentType: ContentType.Text, content: 'Tip: ', properties: { styles: { bold: true } } },
                        { id: 'co-2', contentType: ContentType.Text, content: 'Use the ' },
                        { id: 'co-4', contentType: ContentType.Text, content: 'command to quickly insert blocks like headings, lists, or code.' }
                    ]
                }
            ]
        }
    },

    {
        id: 'heading-checklist',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-checklist-content', contentType: ContentType.Text, content: 'Checklist' }]
    },

    {
        id: 'checklist-desc',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'cl-d-1', contentType: ContentType.Text, content: 'Checklists help track tasks or steps:' }
        ]
    },

    {
        id: 'checklist-item-2',
        blockType: BlockType.Checklist,
        properties: { isChecked: true },
        content: [{ id: 'cli-2', contentType: ContentType.Text, content: 'Apply inline formatting' }]
    },
    {
        id: 'checklist-item-3',
        blockType: BlockType.Checklist,
        content: [
            { id: 'cli-3-t1', contentType: ContentType.Text, content: 'Invite reviewer ' },
            { id: 'cli-3-mention', contentType: ContentType.Mention, properties: { userId: 'user-john' } }
        ]
    },
    {
        id: 'checklist-item-4',
        blockType: BlockType.Checklist,
        content: [
            { id: 'cli-4-t1', contentType: ContentType.Text, content: 'Publish guide and share ' },
            { id: 'cli-4-link', contentType: ContentType.Link, content: 'the link', properties: { url: 'https://ej2.syncfusion.com/documentation/block-editor/getting-started' } }
        ]
    },

    {
        id: 'heading-lists',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-lists-content', contentType: ContentType.Text, content: 'Lists' }]
    },

    {
        id: 'lists-desc',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'ld-1', contentType: ContentType.Text, content: 'Lists organize information clearly:' }
        ]
    },

    {
        id: 'bullet-item-head',
        blockType: BlockType.BulletList,
        content: [{ id: 'bl-head-t', contentType: ContentType.Text, content: 'Unordered List', properties: { styles: { bold: true } } }]
    },
    {
        id: 'bullet-item-1',
        blockType: BlockType.BulletList,
        indent: 1,
        content: [{ id: 'bl-1-t', contentType: ContentType.Text, content: 'Concise points for quick scanning' }]
    },
    {
        id: 'bullet-item-2',
        blockType: BlockType.BulletList,
        indent: 1,
        content: [{ id: 'bl-2-t', contentType: ContentType.Text, content: 'Great for features or tips' }]
    },
    {
        id: 'bullet-item-3',
        blockType: BlockType.BulletList,
        indent: 1,
        content: [{ id: 'bl-3-t', contentType: ContentType.Text, content: 'Easy to reorder and nest' }]
    },

    {
        id: 'numbered-item-head',
        blockType: BlockType.NumberedList,
        content: [{ id: 'nl-head-t', contentType: ContentType.Text, content: 'Ordered List', properties: { styles: { bold: true } } }]
    },
    {
        id: 'numbered-item-1',
        blockType: BlockType.NumberedList,
        indent: 1,
        content: [{ id: 'nl-1-t', contentType: ContentType.Text, content: 'Start a new document' }]
    },
    {
        id: 'numbered-item-2',
        blockType: BlockType.NumberedList,
        indent: 1,
        content: [{ id: 'nl-2-t', contentType: ContentType.Text, content: 'Add structure with headings' }]
    },
    {
        id: 'numbered-item-3',
        blockType: BlockType.NumberedList,
        indent: 1,
        content: [{ id: 'nl-3-t', contentType: ContentType.Text, content: 'Fill in content and review' }]
    },

    {
        id: 'heading-code-block',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-code-block-content', contentType: ContentType.Text, content: 'Code Block' }]
    },

    {
        id: 'code-desc',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'cd-1', contentType: ContentType.Text, content: 'Use code blocks to display syntax-highlighted code snippets for technical documentation or tutorials.' }
        ]
    },

    {
        id: 'code-snippet',
        blockType: BlockType.Code,
        content: [
            {
                id: 'code-snippet-code',
                contentType: ContentType.Text,
                content: "function greet(name) {\n  return `Hello, ${name}!`;\n}"
            }
        ]
    },

    {
        id: 'heading-image',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-image-content', contentType: ContentType.Text, content: 'Image Block' }]
    },

    {
        id: 'image-desc',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'img-d-1', contentType: ContentType.Text, content: 'Image blocks allow you to insert visuals to support or enhance your content.' }
        ]
    },

    {
        id: 'image-block',
        blockType: BlockType.Image,
        properties: {
            src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
            alt: 'Block Editor Image'
        }
    },

    {
        id: 'heading-toggle',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-toggle-content', contentType: ContentType.Text, content: 'Toggle Block' }]
    },

    {
        id: 'toggle-desc',
        blockType: BlockType.Paragraph,
        content: [{ id: 'tc-2', contentType: ContentType.Text, content: 'Toggle blocks are interactive and help manage long or optional content.' }]
    },

    {
        id: 'toggle-block',
        blockType: BlockType.CollapsibleParagraph,
        content: [
            { id: 'toggle-title', contentType: ContentType.Text, content: 'Click to expand', properties: { styles: { bold: true } } }
        ],
        properties: {
            isExpanded: false,
            children: [
                {
                    id: 'toggle-child-1',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'tc-1', contentType: ContentType.Text, content: 'This is a toggle block. You can hide or show content as needed. Useful for FAQs or detailed sections.' }]
                }
            ]
        }
    },

    {
        id: 'heading-divider',
        blockType: BlockType.Heading,
        properties: { level: 3 },
        content: [{ id: 'heading-divider-content', contentType: ContentType.Text, content: 'Divider' }]
    },


    {
        id: 'divider-desc',
        blockType: BlockType.Paragraph,
        content: [
            { id: 'dd-1', contentType: ContentType.Text, content: 'Dividers are horizontal lines used to separate sections or indicate a break in content.' }
        ]
    },

    { id: 'demo-divider-2', blockType: BlockType.Divider },

    { id: 'new-empty', blockType: BlockType.Paragraph },
];

// Spec data
export const mswordContentType1: string = `
<html>
<body>
<!--StartFragment--><div class="OutlineElement Ltr SCXW147821562 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web&quot;, Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW147821562 BCX8" paraid="2111087194" paraeid="{3f835b9a-e264-439b-af62-8fbde06d7c6a}{135}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 12px 0px; padding: 0px; user-select: text; overflow-wrap: break-word; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW147821562 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 18px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif; font-weight: bold;"><span class="NormalTextRun SCXW147821562 BCX8" data-ccp-parastyle="First Paragraph" data-ccp-parastyle-defn="{&quot;ObjectId&quot;:&quot;276295ed-5df2-5456-988c-5fdbab071054|1&quot;,&quot;ClassId&quot;:1073872969,&quot;Properties&quot;:[469777841,&quot;Aptos&quot;,469777842,&quot;Arial&quot;,469777843,&quot;Aptos&quot;,469777844,&quot;Aptos&quot;,469769226,&quot;Aptos,Arial&quot;,335559705,&quot;1033&quot;,335559740,&quot;240&quot;,201341983,&quot;0&quot;,335559739,&quot;180&quot;,201342446,&quot;1&quot;,201342447,&quot;5&quot;,201342448,&quot;1&quot;,201342449,&quot;1&quot;,201341986,&quot;1&quot;,268442635,&quot;24&quot;,335559738,&quot;180&quot;,469775450,&quot;First Paragraph&quot;,201340122,&quot;2&quot;,134234082,&quot;true&quot;,134233614,&quot;true&quot;,469778129,&quot;FirstParagraph&quot;,335572020,&quot;1&quot;,469775498,&quot;Body Text&quot;,469778324,&quot;Body Text&quot;]}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">Collision Detection:</span></span><span class="EOP SCXW147821562 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559738&quot;:180,&quot;335559739&quot;:180,&quot;335559740&quot;:240}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 18px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif;"> </span></p></div><div class="ListContainerWrapper SCXW147821562 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; position: relative; color: rgb(0, 0, 0); font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web&quot;, Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ul class="BulletListStyle1 SCXW147821562 BCX8" role="list" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; list-style-type: disc; cursor: text; font-family: verdana; overflow: visible;"><li aria-setsize="-1" data-leveltext="" data-font="Symbol" data-listid="71" data-list-defn-props="{&quot;335552541&quot;:1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769226&quot;:&quot;Symbol&quot;,&quot;469769242&quot;:[8226],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;&quot;,&quot;469777815&quot;:&quot;multilevel&quot;}" data-aria-posinset="19" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW147821562 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 0px 24px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Aptos, Aptos_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW147821562 BCX8" paraid="1634032753" paraeid="{3f835b9a-e264-439b-af62-8fbde06d7c6a}{141}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; overflow-wrap: break-word; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW147821562 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 12pt; line-height: 18px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW147821562 BCX8" data-ccp-parastyle="Compact" data-ccp-parastyle-defn="{&quot;ObjectId&quot;:&quot;eafb41c0-47a4-52dc-ac6b-3b5a7536b560|1&quot;,&quot;ClassId&quot;:1073872969,&quot;Properties&quot;:[469777841,&quot;Aptos&quot;,469777842,&quot;Arial&quot;,469777843,&quot;Aptos&quot;,469777844,&quot;Aptos&quot;,469769226,&quot;Aptos,Arial&quot;,335559705,&quot;1033&quot;,335559740,&quot;240&quot;,201341983,&quot;0&quot;,335559739,&quot;36&quot;,201342446,&quot;1&quot;,201342447,&quot;5&quot;,201342448,&quot;1&quot;,201342449,&quot;1&quot;,201341986,&quot;1&quot;,268442635,&quot;24&quot;,335559738,&quot;36&quot;,469775450,&quot;Compact&quot;,201340122,&quot;2&quot;,134234082,&quot;true&quot;,134233614,&quot;true&quot;,469778129,&quot;Compact&quot;,335572020,&quot;1&quot;,469778324,&quot;Body Text&quot;]}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">If tooltip would go off-screen → Move to other side</span></span><span class="EOP SCXW147821562 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559738&quot;:36,&quot;335559739&quot;:36,&quot;335559740&quot;:240}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 18px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif;"> </span></p></li></ul></div><!--EndFragment-->
</body>
</html>
`;

export const mswordContentType2: string = `
<html>
<body>
<!--StartFragment--><div class="OutlineElement Ltr SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web&quot;, Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW256032421 BCX8" role="heading" aria-level="5" paraid="534131920" paraeid="{6502c8ca-b26e-4688-9430-e0498d95617e}{174}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 5.33333px 0px 2.66667px; padding: 0px; user-select: text; overflow-wrap: break-word; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: rgb(15, 71, 97); text-align: left; text-indent: 0px;"><span data-contrast="none" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; color: rgb(15, 71, 97); font-size: 12pt; line-height: 18px; font-family: &quot;Times New Roman&quot;, &quot;Times New Roman_EmbeddedFont&quot;, &quot;Times New Roman_MSFontService&quot;, serif;"><span class="NormalTextRun BookmarkStart SCXW256032421 BCX8" data-ccp-parastyle="heading 5" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">Toolbar Item Tooltips</span></span><span class="EOP SCXW256032421 BCX8" data-ccp-props="{&quot;134245418&quot;:true,&quot;134245529&quot;:true,&quot;201341983&quot;:0,&quot;335559738&quot;:80,&quot;335559739&quot;:40,&quot;335559740&quot;:240}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 12pt; line-height: 18px; font-family: &quot;Times New Roman&quot;, &quot;Times New Roman_EmbeddedFont&quot;, &quot;Times New Roman_MSFontService&quot;, serif; color: rgb(15, 71, 97);"> </span></p></div><div class="OutlineElement Ltr SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; clear: both; cursor: text; overflow: visible; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web&quot;, Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW256032421 BCX8" paraid="2008340541" paraeid="{6502c8ca-b26e-4688-9430-e0498d95617e}{182}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px 0px 13.3333px; padding: 0px; user-select: text; overflow-wrap: break-word; font-weight: normal; font-style: italic; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="none" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; color: rgb(0, 112, 32); font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace; font-weight: bold;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="KeywordTok" data-ccp-charstyle-defn="{&quot;ObjectId&quot;:&quot;11c5b9ba-e526-5815-97b3-6c32bfebec73|1&quot;,&quot;ClassId&quot;:1073872969,&quot;Properties&quot;:[201342446,&quot;1&quot;,201342447,&quot;5&quot;,201342448,&quot;1&quot;,201342449,&quot;1&quot;,469777841,&quot;Consolas&quot;,469777842,&quot;Arial&quot;,469777843,&quot;Aptos&quot;,469777844,&quot;Consolas&quot;,201341986,&quot;1&quot;,469769226,&quot;Consolas,Aptos&quot;,268442635,&quot;22&quot;,134224901,&quot;true&quot;,335559705,&quot;1033&quot;,469775450,&quot;KeywordTok&quot;,201340122,&quot;1&quot;,134233614,&quot;true&quot;,469778129,&quot;KeywordTok&quot;,335572020,&quot;1&quot;,134224900,&quot;true&quot;,335551500,&quot;2125824&quot;,469778324,&quot;Verbatim Char&quot;]}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">new</span></span><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="NormalTok" data-ccp-charstyle-defn="{&quot;ObjectId&quot;:&quot;703889ea-e5b9-560e-8d0b-611abda5dddf|1&quot;,&quot;ClassId&quot;:1073872969,&quot;Properties&quot;:[201342446,&quot;1&quot;,201342447,&quot;5&quot;,201342448,&quot;1&quot;,201342449,&quot;1&quot;,469777841,&quot;Consolas&quot;,469777842,&quot;Arial&quot;,469777843,&quot;Aptos&quot;,469777844,&quot;Consolas&quot;,201341986,&quot;1&quot;,469769226,&quot;Consolas,Aptos&quot;,268442635,&quot;22&quot;,134224901,&quot;true&quot;,335559705,&quot;1033&quot;,469775450,&quot;NormalTok&quot;,201340122,&quot;1&quot;,134233614,&quot;true&quot;,469778129,&quot;NormalTok&quot;,335572020,&quot;1&quot;,469778324,&quot;Verbatim Char&quot;]}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;"><span> </span></span><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="NormalTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">InlineToolbarItemModel</span></span><span class="LineBreakBlob BlobObject DragDrop SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 11pt; line-height: 17px; font-family: WordVisiCarriageReturn_MSFontService, Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; white-space: pre !important;"> </span><br class="SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; white-space: pre !important;"></span><span data-contrast="none" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; color: rgb(102, 102, 102); font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="OperatorTok" data-ccp-charstyle-defn="{&quot;ObjectId&quot;:&quot;b295992f-ab79-51ac-9c31-f0793cdd84d8|1&quot;,&quot;ClassId&quot;:1073872969,&quot;Properties&quot;:[201342446,&quot;1&quot;,201342447,&quot;5&quot;,201342448,&quot;1&quot;,201342449,&quot;1&quot;,469777841,&quot;Consolas&quot;,469777842,&quot;Arial&quot;,469777843,&quot;Aptos&quot;,469777844,&quot;Consolas&quot;,201341986,&quot;1&quot;,469769226,&quot;Consolas,Aptos&quot;,268442635,&quot;22&quot;,134224901,&quot;true&quot;,335559705,&quot;1033&quot;,469775450,&quot;OperatorTok&quot;,201340122,&quot;1&quot;,134233614,&quot;true&quot;,469778129,&quot;OperatorTok&quot;,335572020,&quot;1&quot;,335551500,&quot;6710886&quot;,469778324,&quot;Verbatim Char&quot;]}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">{</span></span><span class="LineBreakBlob BlobObject DragDrop SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 11pt; line-height: 17px; font-family: WordVisiCarriageReturn_MSFontService, Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace; color: rgb(102, 102, 102);"><span class="SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; white-space: pre !important;"> </span><br class="SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; white-space: pre !important;"></span><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="NormalTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">    ID<span> </span></span></span><span data-contrast="none" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; color: rgb(102, 102, 102); font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="OperatorTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">=</span></span><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="NormalTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;"><span> </span></span></span><span data-contrast="none" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; color: rgb(64, 112, 160); font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="StringTok" data-ccp-charstyle-defn="{&quot;ObjectId&quot;:&quot;6532d04d-1e3a-5295-a7ef-ff35172b7296|1&quot;,&quot;ClassId&quot;:1073872969,&quot;Properties&quot;:[201342446,&quot;1&quot;,201342447,&quot;5&quot;,201342448,&quot;1&quot;,201342449,&quot;1&quot;,469777841,&quot;Consolas&quot;,469777842,&quot;Arial&quot;,469777843,&quot;Aptos&quot;,469777844,&quot;Consolas&quot;,201341986,&quot;1&quot;,469769226,&quot;Consolas,Aptos&quot;,268442635,&quot;22&quot;,134224901,&quot;true&quot;,335559705,&quot;1033&quot;,469775450,&quot;StringTok&quot;,201340122,&quot;1&quot;,134233614,&quot;true&quot;,469778129,&quot;StringTok&quot;,335572020,&quot;1&quot;,335551500,&quot;10514496&quot;,469778324,&quot;Verbatim Char&quot;]}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">"bold"</span></span><span data-contrast="none" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; color: rgb(102, 102, 102); font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="OperatorTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">,</span></span><span class="LineBreakBlob BlobObject DragDrop SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 11pt; line-height: 17px; font-family: WordVisiCarriageReturn_MSFontService, Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace; color: rgb(102, 102, 102);"><span class="SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; white-space: pre !important;"> </span><br class="SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; white-space: pre !important;"></span><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="NormalTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">    Tooltip<span> </span></span></span><span data-contrast="none" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; color: rgb(102, 102, 102); font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="OperatorTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">=</span></span><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="NormalTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;"><span> </span></span></span><span data-contrast="none" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; color: rgb(64, 112, 160); font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="StringTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">"Bold (</span><span class="NormalTextRun SpellingErrorV2Themed SCXW256032421 BCX8" data-ccp-charstyle="StringTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; background-position: 0px 100%; background-repeat: repeat-x; background-image: url(&quot;data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjQiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggc3Ryb2tlPSIjRTM3RDgxIiBkPSJNMCAzYzEuMjUgMCAxLjI1LTIgMi41LTJTMy43NSAzIDUgMyIvPjxwYXRoIGQ9Ik0wIDBoNXY0SDB6Ii8+PC9nPjwvc3ZnPg==&quot;); border-bottom: 1px solid transparent;">Ctrl+B</span><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="StringTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">)"</span></span><span data-contrast="none" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; color: rgb(102, 102, 102); font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="OperatorTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">,</span></span><span class="LineBreakBlob BlobObject DragDrop SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 11pt; line-height: 17px; font-family: WordVisiCarriageReturn_MSFontService, Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace; color: rgb(102, 102, 102);"><span class="SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; white-space: pre !important;"> </span><br class="SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; white-space: pre !important;"></span><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="NormalTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">   <span> </span></span><span class="NormalTextRun SpellingErrorV2Themed SCXW256032421 BCX8" data-ccp-charstyle="NormalTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; background-position: 0px 100%; background-repeat: repeat-x; background-image: url(&quot;data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjQiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggc3Ryb2tlPSIjRTM3RDgxIiBkPSJNMCAzYzEuMjUgMCAxLjI1LTIgMi41LTJTMy43NSAzIDUgMyIvPjxwYXRoIGQ9Ik0wIDBoNXY0SDB6Ii8+PC9nPjwvc3ZnPg==&quot;); border-bottom: 1px solid transparent;">IconCss</span><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="NormalTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;"><span> </span></span></span><span data-contrast="none" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; color: rgb(102, 102, 102); font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="OperatorTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">=</span></span><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="NormalTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;"><span> </span></span></span><span data-contrast="none" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; color: rgb(64, 112, 160); font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="StringTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">"e-icons e-bold"</span></span><span class="LineBreakBlob BlobObject DragDrop SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 11pt; line-height: 17px; font-family: WordVisiCarriageReturn_MSFontService, Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace; color: rgb(64, 112, 160);"><span class="SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; white-space: pre !important;"> </span><br class="SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; white-space: pre !important;"></span><span data-contrast="none" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW256032421 BCX8" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-variant-ligatures: none !important; color: rgb(102, 102, 102); font-size: 11pt; font-style: normal; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace;"><span class="NormalTextRun SCXW256032421 BCX8" data-ccp-charstyle="OperatorTok" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text;">}</span></span><span class="EOP SCXW256032421 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559739&quot;:200,&quot;335559740&quot;:240}" style="-webkit-user-drag: none; -webkit-tap-highlight-color: transparent; margin: 0px; padding: 0px; user-select: text; font-size: 11pt; line-height: 17px; font-family: Consolas, Consolas_EmbeddedFont, Consolas_MSFontService, monospace; color: rgb(102, 102, 102);"> </span></p></div><!--EndFragment-->
</body>
</html>
`;

export const vscodeContentType1: string = `
<html>
<body>
<!--StartFragment--><div style="color: #d6deeb;background-color: #011627;font-family: Consolas, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 16px;white-space: pre;"><div><span style="color: #c792ea;font-style: italic;">export</span><span style="color: #d6deeb;"> </span><span style="color: #c792ea;">function</span><span style="color: #d6deeb;"> </span><span style="color: #82aaff;font-style: italic;">isMacOS</span><span style="color: #d9f5dd;">()</span><span style="color: #7fdbca;">:</span><span style="color: #d6deeb;"> </span><span style="color: #c5e478;">boolean</span><span style="color: #d6deeb;"> {</span></div><div><span style="color: #d6deeb;">&#160; &#160; </span><span style="color: #c792ea;">const</span><span style="color: #c792ea;font-style: italic;"> </span><span style="color: #82aaff;font-style: italic;">userAgent</span><span style="color: #7fdbca;">:</span><span style="color: #c792ea;font-style: italic;"> </span><span style="color: #c5e478;font-style: italic;">string</span><span style="color: #c792ea;font-style: italic;"> </span><span style="color: #c792ea;">=</span><span style="color: #c792ea;font-style: italic;"> </span><span style="color: #d6deeb;font-style: italic;">navigator</span><span style="color: #c792ea;font-style: italic;">.</span><span style="color: #baebe2;font-style: italic;">userAgent</span><span style="color: #d6deeb;">;</span></div><div><span style="color: #d6deeb;">&#160; &#160; </span><span style="color: #c792ea;font-style: italic;">return</span><span style="color: #d6deeb;"> userAgent</span><span style="color: #c792ea;font-style: italic;">.</span><span style="color: #82aaff;font-style: italic;">indexOf</span><span style="color: #d6deeb;">(</span><span style="color: #d9f5dd;">'</span><span style="color: #ecc48d;">Mac OS</span><span style="color: #d9f5dd;">'</span><span style="color: #d6deeb;">) </span><span style="color: #c792ea;">!==</span><span style="color: #d6deeb;"> </span><span style="color: #c792ea;">-</span><span style="color: #f78c6c;">1</span><span style="color: #d6deeb;">;</span></div><div><span style="color: #d6deeb;">}</span></div></div><!--EndFragment-->
</body>
</html>
`