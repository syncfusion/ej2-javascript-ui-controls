import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { BodyWidget, ParagraphWidget, ElementBox, LineWidget, TextElementBox, TabElementBox, HeaderFooters, Page, TableWidget, TableRowWidget } from '../../src/document-editor/implementation/viewer/page';
import { WSectionFormat, WParagraphFormat, WCharacterFormat, WParagraphStyle, WStyle, WTabStop } from '../../src/document-editor/implementation/format/index';
import { Selection, Editor, HelperMethods, WebLayoutViewer, DocumentHelper } from '../../src/document-editor/index';
import { TestHelper } from '../test-helper.spec';
let WordDocument: any = {
  "sections": [
    {
      "sectionFormat": {
        "pageWidth": 612,
        "pageHeight": 792,
        "leftMargin": 72,
        "rightMargin": 72,
        "topMargin": 72,
        "bottomMargin": 72,
        "differentFirstPage": false,
        "differentOddAndEvenPages": false,
        "headerDistance": 36,
        "footerDistance": 36,
        "bidi": false
      },
      "blocks": [
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
            "fontFamily": "Helvetica",
            "fontColor": "#4C4C4CFF",
            "fontFamilyBidi": "Helvetica"
          },
          "inlines": [
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd1",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "Sunday is my favorite day because I spend the day watching football with my "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd1",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "dad."
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "On"
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": " Sunday, unlike the other days of the week when he works, my "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "dad spends the whole day with me watching football on TV. We even eat lunch together while watching. The highlight of the day is watching the "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "Dolphins game. Dad and I get so excited, we yell and cheer "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "together."
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd3",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "On"
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd3",
                "fontFamilyBidi": "Helvetica"
              },
              "text": " Sundays, I get to combine watching my favorite sport and spending time "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd3",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "with my favorite person—what a great day!"
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd1",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "Sunday is my favorite day of the week."
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": " I like it because on Sunday, I watch football. On other days, I also get to watch football but not all day. "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "There "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "are other sports on other days to watch on TV."
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": " Sunday lunch is a favorite of mine because I eat with my father in front of the TV. All the other days, I "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "have to"
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": " eat at the table which is less fun. "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "Some days my dad doesn’t make it home from work until after I’m in bed."
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": " Some weeks my dad travels, "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "and I don’t see him for several days. The highlight of the day is when we watch the Dolphins play. Dad and I get so excited, we yell and cheer "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "together. "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd3",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "The thing that I like to do best in the world is watch TV with my dad."
            },
            {
              "characterFormat": {
              },
              "bookmarkType": 0,
              "name": "_GoBack"
            },
            {
              "characterFormat": {
              },
              "bookmarkType": 1,
              "name": "_GoBack"
            }
          ]
        }
      ],
      "headersFooters": {
      }
    }
  ],
  "characterFormat": {
    "bold": false,
    "italic": false,
    "fontSize": 11,
    "fontFamily": "Calibri",
    "underline": "None",
    "strikethrough": "None",
    "baselineAlignment": "Normal",
    "highlightColor": "NoColor",
    "fontColor": "#000000",
    "fontSizeBidi": 11,
    "fontFamilyBidi": "Arial"
  },
  "paragraphFormat": {
    "leftIndent": 0,
    "rightIndent": 0,
    "firstLineIndent": 0,
    "textAlignment": "Left",
    "beforeSpacing": 0,
    "afterSpacing": 8,
    "lineSpacing": 1.0791666507720947,
    "lineSpacingType": "Multiple",
    "listFormat": {
    },
    "bidi": false
  },
  "defaultTabWidth": 36,
  "enforcement": false,
  "hashValue": "",
  "saltValue": "",
  "formatting": false,
  "protectionType": "NoProtection",
  "styles": [
    {
      "name": "Normal",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {
        }
      },
      "characterFormat": {
      },
      "next": "Normal"
    },
    {
      "name": "Default Paragraph Font",
      "type": "Character",
      "characterFormat": {
      }
    },
    {
      "name": "exbkgd1",
      "type": "Character",
      "characterFormat": {
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "exbkgd2",
      "type": "Character",
      "characterFormat": {
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "exbkgd3",
      "type": "Character",
      "characterFormat": {
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 1",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 12,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level1",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontSize": 16,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Normal",
      "link": "Heading 1 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 1 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 16,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 2",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level2",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontSize": 13,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Normal",
      "link": "Heading 2 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 2 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 13,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 3",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level3",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763"
      },
      "basedOn": "Normal",
      "link": "Heading 3 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 3 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 4",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level4",
        "listFormat": {
        }
      },
      "characterFormat": {
        "italic": true,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Normal",
      "link": "Heading 4 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 4 Char",
      "type": "Character",
      "characterFormat": {
        "italic": true,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 5",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level5",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Normal",
      "link": "Heading 5 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 5 Char",
      "type": "Character",
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 6",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level6",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763"
      },
      "basedOn": "Normal",
      "link": "Heading 6 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 6 Char",
      "type": "Character",
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763"
      },
      "basedOn": "Default Paragraph Font"
    }
  ],
  "lists": [
  ],
  "abstractLists": [
  ],
  "comments": [
  ]
}
describe('Width validation', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    let ele: HTMLElement = createElement('div', { id: 'container' });
    ele.setAttribute("style", "width: 1500px");
    document.body.appendChild(ele);
    DocumentEditor.Inject(Selection, Editor)
    editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, layoutType: 'Continuous' });
    (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.appendTo('#container');
  });
  afterAll((done) => {
    editor.destroy();
    document.body.removeChild(document.getElementById('container'));
    editor = undefined;
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('Width validation', () => {
    editor.open(JSON.stringify(WordDocument))
    expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets.length).toBe(3);
  });
});
let jsonDocument: any = {
  "sections": [
    {
      "sectionFormat": {
        "pageWidth": 612,
        "pageHeight": 792,
        "leftMargin": 72,
        "rightMargin": 72,
        "topMargin": 72,
        "bottomMargin": 72,
        "differentFirstPage": false,
        "differentOddAndEvenPages": false,
        "headerDistance": 36,
        "footerDistance": 36,
        "bidi": false
      },
      "blocks": [
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
            "fontFamily": "Helvetica",
            "fontColor": "#4C4C4CFF",
            "fontFamilyBidi": "Helvetica"
          },
          "inlines": [
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd1",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "Sunday is my favorite day because I spend the day watching football with my "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd1",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "dad."
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "On"
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": " Sunday, unlike the other days of the week when he works, my "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "dad spends the whole day with me watching football on TV. We even eat lunch together while watching. The highlight of the day is watching the "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "Dolphins game. Dad and I get so excited, we yell and cheer "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "together."
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd3",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "On"
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd3",
                "fontFamilyBidi": "Helvetica"
              },
              "text": " Sundays, I get to combine watching my favorite sport and spending time "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd3",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "with my favorite person—what a great day!"
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd1",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "Sunday is my favorite day of the week."
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": " I like it because on Sunday, I watch football. On other days, I also get to watch football but not all day. "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "There "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "are other sports on other days to watch on TV."
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": " Sunday lunch is a favorite of mine because I eat with my father in front of the TV. All the other days, I "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "have to"
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": " eat at the table which is less fun. "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd2",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "Some days my dad doesn’t make it home from work until after I’m in bed."
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": " Some weeks my dad travels, "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "and I don’t see him for several days. The highlight of the day is when we watch the Dolphins play. Dad and I get so excited, we yell and cheer "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "together. "
            },
            {
              "characterFormat": {
                "fontFamily": "Helvetica",
                "fontColor": "#4C4C4CFF",
                "styleName": "exbkgd3",
                "fontFamilyBidi": "Helvetica"
              },
              "text": "The thing that I like to do best in the world is watch TV with my dad."
            },
            {
              "characterFormat": {
              },
              "bookmarkType": 0,
              "name": "_GoBack"
            },
            {
              "characterFormat": {
              },
              "bookmarkType": 1,
              "name": "_GoBack"
            }
          ]
        }
      ],
      "headersFooters": {
      }
    }
  ],
  "characterFormat": {
    "bold": false,
    "italic": false,
    "fontSize": 11,
    "fontFamily": "Calibri",
    "underline": "None",
    "strikethrough": "None",
    "baselineAlignment": "Normal",
    "highlightColor": "NoColor",
    "fontColor": "#000000",
    "fontSizeBidi": 11,
    "fontFamilyBidi": "Arial"
  },
  "paragraphFormat": {
    "leftIndent": 0,
    "rightIndent": 0,
    "firstLineIndent": 0,
    "textAlignment": "Left",
    "beforeSpacing": 0,
    "afterSpacing": 8,
    "lineSpacing": 1.0791666507720947,
    "lineSpacingType": "Multiple",
    "listFormat": {
    },
    "bidi": false
  },
  "defaultTabWidth": 36,
  "enforcement": false,
  "hashValue": "",
  "saltValue": "",
  "formatting": false,
  "protectionType": "NoProtection",
  "styles": [
    {
      "name": "Normal",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {
        }
      },
      "characterFormat": {
      },
      "next": "Normal"
    },
    {
      "name": "Default Paragraph Font",
      "type": "Character",
      "characterFormat": {
      }
    },
    {
      "name": "exbkgd1",
      "type": "Character",
      "characterFormat": {
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "exbkgd2",
      "type": "Character",
      "characterFormat": {
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "exbkgd3",
      "type": "Character",
      "characterFormat": {
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 1",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 12,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level1",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontSize": 16,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Normal",
      "link": "Heading 1 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 1 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 16,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 2",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level2",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontSize": 13,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Normal",
      "link": "Heading 2 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 2 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 13,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 3",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level3",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763"
      },
      "basedOn": "Normal",
      "link": "Heading 3 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 3 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 4",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level4",
        "listFormat": {
        }
      },
      "characterFormat": {
        "italic": true,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Normal",
      "link": "Heading 4 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 4 Char",
      "type": "Character",
      "characterFormat": {
        "italic": true,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 5",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level5",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Normal",
      "link": "Heading 5 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 5 Char",
      "type": "Character",
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 6",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level6",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763"
      },
      "basedOn": "Normal",
      "link": "Heading 6 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 6 Char",
      "type": "Character",
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763"
      },
      "basedOn": "Default Paragraph Font"
    }
  ],
  "lists": [
  ],
  "abstractLists": [
  ],
  "comments": [
  ]
}
describe('Width validation', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    let ele: HTMLElement = createElement('div', { id: 'container' });
    ele.setAttribute("style", "width: 1000px");
    document.body.appendChild(ele);
    DocumentEditor.Inject(Selection, Editor)
    editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, layoutType: 'Continuous' });
    (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.appendTo('#container');
  });
  afterAll((done) => {
    editor.destroy();
    document.body.removeChild(document.getElementById('container'));
    editor = undefined;
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('Width validation', () => {
    editor.open(JSON.stringify(jsonDocument))
    expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets.length).toBe(4);
  });
});

let sectionBreakDocument: any = {
  "sections": [
    {
      "sectionFormat": {
        "pageWidth": 595.2999877929688,
        "pageHeight": 841.9000244140625,
        "leftMargin": 54,
        "rightMargin": 54,
        "topMargin": 72,
        "bottomMargin": 72,
        "differentFirstPage": false,
        "differentOddAndEvenPages": false,
        "headerDistance": 54,
        "footerDistance": 36,
        "bidi": false
      },
      "blocks": [
        {
          "paragraphFormat": {
            "styleName": "Title",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "First Section"
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Subtitle",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "Size 816x1056px (Portrait)"
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Subtitle",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "Margin 96px (top and bottom) 72px (left and right)"
            }
          ]
        },
        {
          "paragraphFormat": {
            "afterSpacing": 0,
            "lineSpacing": 1,
            "lineSpacingType": "Multiple",
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "Lorem ipsum dolor sit "
            },
            {
              "characterFormat": {
              },
              "text": "amet"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "consectetur"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "adipiscing"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "elit"
            },
            {
              "characterFormat": {
              },
              "text": ", sed do "
            },
            {
              "characterFormat": {
              },
              "text": "eiusmod"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "tempor"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "incididunt"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "labore"
            },
            {
              "characterFormat": {
              },
              "text": " et dolore magna "
            },
            {
              "characterFormat": {
              },
              "text": "aliqua"
            },
            {
              "characterFormat": {
              },
              "text": ". Ut "
            },
            {
              "characterFormat": {
              },
              "text": "enim"
            },
            {
              "characterFormat": {
              },
              "text": " ad minim "
            },
            {
              "characterFormat": {
              },
              "text": "veniam"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "quis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "nostrud"
            },
            {
              "characterFormat": {
              },
              "text": " exercitation "
            },
            {
              "characterFormat": {
              },
              "text": "ullamco"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "laboris"
            },
            {
              "characterFormat": {
              },
              "text": " nisi "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aliquip"
            },
            {
              "characterFormat": {
              },
              "text": " ex "
            },
            {
              "characterFormat": {
              },
              "text": "ea"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "commodo"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "consequat"
            },
            {
              "characterFormat": {
              },
              "text": ". Duis "
            },
            {
              "characterFormat": {
              },
              "text": "aute"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "irure"
            },
            {
              "characterFormat": {
              },
              "text": " dolor in "
            },
            {
              "characterFormat": {
              },
              "text": "reprehenderit"
            },
            {
              "characterFormat": {
              },
              "text": " in "
            },
            {
              "characterFormat": {
              },
              "text": "voluptate"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "velit"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "esse"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "cillum"
            },
            {
              "characterFormat": {
              },
              "text": " dolore "
            },
            {
              "characterFormat": {
              },
              "text": "eu"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "fugiat"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "nulla"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "pariatur"
            },
            {
              "characterFormat": {
              },
              "text": ". "
            },
            {
              "characterFormat": {
              },
              "text": "Excepteur"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "sint"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "occaecat"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "cupidatat"
            },
            {
              "characterFormat": {
              },
              "text": " non "
            },
            {
              "characterFormat": {
              },
              "text": "proident"
            },
            {
              "characterFormat": {
              },
              "text": ", sunt in culpa qui "
            },
            {
              "characterFormat": {
              },
              "text": "officia"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "deserunt"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "mollit"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "anim"
            },
            {
              "characterFormat": {
              },
              "text": " id "
            },
            {
              "characterFormat": {
              },
              "text": "est"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "laborum"
            },
            {
              "characterFormat": {
              },
              "text": "."
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
          ]
        }
      ],
      "headersFooters": {
        "header": {
          "blocks": [
            {
              "paragraphFormat": {
                "textAlignment": "Right",
                "styleName": "Header",
                "listFormat": {
                }
              },
              "characterFormat": {
              },
              "inlines": [
                {
                  "characterFormat": {
                  },
                  "text": "Header distance from top is 72px"
                }
              ]
            }
          ]
        },
        "footer": {
          "blocks": [
            {
              "paragraphFormat": {
                "textAlignment": "Right",
                "styleName": "Footer",
                "listFormat": {
                },
                "tabs": [
                  {
                    "position": 0,
                    "deletePosition": 234,
                    "tabJustification": "Left",
                    "tabLeader": "None"
                  }
                ]
              },
              "characterFormat": {
              },
              "inlines": [
                {
                  "characterFormat": {
                  },
                  "text": "Footer distance from bottom is 48px"
                }
              ]
            }
          ]
        }
      }
    },
    {
      "sectionFormat": {
        "pageWidth": 792,
        "pageHeight": 612,
        "leftMargin": 36,
        "rightMargin": 36,
        "topMargin": 36,
        "bottomMargin": 36,
        "differentFirstPage": false,
        "differentOddAndEvenPages": false,
        "headerDistance": 18,
        "footerDistance": 18,
        "bidi": false
      },
      "blocks": [
        {
          "paragraphFormat": {
            "afterSpacing": 0,
            "lineSpacing": 1,
            "lineSpacingType": "Multiple",
            "styleName": "Subtitle",
            "listFormat": {
            }
          },
          "characterFormat": {
            "fontSize": 14,
            "fontFamily": "Calibri Light",
            "fontColor": "#000000FF",
            "fontSizeBidi": 14,
            "fontFamilyBidi": "Calibri Light"
          },
          "inlines": [
            {
              "characterFormat": {
                "fontSize": 14,
                "fontFamily": "Calibri Light",
                "fontColor": "#000000FF",
                "fontSizeBidi": 14,
                "fontFamilyBidi": "Calibri Light"
              },
              "text": "SEC"
            },
            {
              "characterFormat": {
              },
              "bookmarkType": 0,
              "name": "_GoBack"
            },
            {
              "characterFormat": {
              },
              "bookmarkType": 1,
              "name": "_GoBack"
            },
            {
              "characterFormat": {
                "fontSize": 14,
                "fontFamily": "Calibri Light",
                "fontColor": "#000000FF",
                "fontSizeBidi": 14,
                "fontFamilyBidi": "Calibri Light"
              },
              "text": "OND SECTION"
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Subtitle",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "Size 1056x816px (Landscape)"
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Subtitle",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "Margin 48px (on all sides)"
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "Lorem ipsum dolor sit "
            },
            {
              "characterFormat": {
              },
              "text": "amet"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "consectetur"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "adipiscing"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "elit"
            },
            {
              "characterFormat": {
              },
              "text": ", sed do "
            },
            {
              "characterFormat": {
              },
              "text": "eiusmod"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "tempor"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "incididunt"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "labore"
            },
            {
              "characterFormat": {
              },
              "text": " et dolore magna "
            },
            {
              "characterFormat": {
              },
              "text": "aliqua"
            },
            {
              "characterFormat": {
              },
              "text": ". Ut "
            },
            {
              "characterFormat": {
              },
              "text": "enim"
            },
            {
              "characterFormat": {
              },
              "text": " ad minim "
            },
            {
              "characterFormat": {
              },
              "text": "veniam"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "quis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "nostrud"
            },
            {
              "characterFormat": {
              },
              "text": " exercitation "
            },
            {
              "characterFormat": {
              },
              "text": "ullamco"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "laboris"
            },
            {
              "characterFormat": {
              },
              "text": " nisi "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aliquip"
            },
            {
              "characterFormat": {
              },
              "text": " ex "
            },
            {
              "characterFormat": {
              },
              "text": "ea"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "commodo"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "consequat"
            },
            {
              "characterFormat": {
              },
              "text": ". Duis "
            },
            {
              "characterFormat": {
              },
              "text": "aute"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "irure"
            },
            {
              "characterFormat": {
              },
              "text": " dolor in "
            },
            {
              "characterFormat": {
              },
              "text": "reprehenderit"
            },
            {
              "characterFormat": {
              },
              "text": " in "
            },
            {
              "characterFormat": {
              },
              "text": "voluptate"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "velit"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "esse"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "cillum"
            },
            {
              "characterFormat": {
              },
              "text": " dolore "
            },
            {
              "characterFormat": {
              },
              "text": "eu"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "fugiat"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "nulla"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "pariatur"
            },
            {
              "characterFormat": {
              },
              "text": ". "
            },
            {
              "characterFormat": {
              },
              "text": "Excepteur"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "sint"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "occaecat"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "cupidatat"
            },
            {
              "characterFormat": {
              },
              "text": " non "
            },
            {
              "characterFormat": {
              },
              "text": "proident"
            },
            {
              "characterFormat": {
              },
              "text": ", sunt in culpa qui "
            },
            {
              "characterFormat": {
              },
              "text": "officia"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "deserunt"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "mollit"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "anim"
            },
            {
              "characterFormat": {
              },
              "text": " id "
            },
            {
              "characterFormat": {
              },
              "text": "est"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "laborum"
            },
            {
              "characterFormat": {
              },
              "text": "."
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "Sed "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "perspiciatis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "unde"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "omnis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "iste"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "natus"
            },
            {
              "characterFormat": {
              },
              "text": " error sit "
            },
            {
              "characterFormat": {
              },
              "text": "voluptatem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "accusantium"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "doloremque"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "laudantium"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "totam"
            },
            {
              "characterFormat": {
              },
              "text": " rem "
            },
            {
              "characterFormat": {
              },
              "text": "aperiam"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "eaque"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ipsa"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quae"
            },
            {
              "characterFormat": {
              },
              "text": " ab "
            },
            {
              "characterFormat": {
              },
              "text": "illo"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "inventore"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "veritatis"
            },
            {
              "characterFormat": {
              },
              "text": " et quasi "
            },
            {
              "characterFormat": {
              },
              "text": "architecto"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "beatae"
            },
            {
              "characterFormat": {
              },
              "text": " vitae dicta sunt "
            },
            {
              "characterFormat": {
              },
              "text": "explicabo"
            },
            {
              "characterFormat": {
              },
              "text": ". Nemo "
            },
            {
              "characterFormat": {
              },
              "text": "enim"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ipsam"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptatem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quia"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptas"
            },
            {
              "characterFormat": {
              },
              "text": " sit "
            },
            {
              "characterFormat": {
              },
              "text": "aspernatur"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "odit"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aut"
            },
            {
              "characterFormat": {
              },
              "text": " fugit, sed "
            },
            {
              "characterFormat": {
              },
              "text": "quia"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "consequuntur"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "magni"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "dolores"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "eos"
            },
            {
              "characterFormat": {
              },
              "text": " qui "
            },
            {
              "characterFormat": {
              },
              "text": "ratione"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptatem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "sequi"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "nesciunt"
            },
            {
              "characterFormat": {
              },
              "text": ". "
            },
            {
              "characterFormat": {
              },
              "text": "Neque"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "porro"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quisquam"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "est"
            },
            {
              "characterFormat": {
              },
              "text": ", qui "
            },
            {
              "characterFormat": {
              },
              "text": "dolorem"
            },
            {
              "characterFormat": {
              },
              "text": " ipsum "
            },
            {
              "characterFormat": {
              },
              "text": "quia"
            },
            {
              "characterFormat": {
              },
              "text": " dolor sit "
            },
            {
              "characterFormat": {
              },
              "text": "amet"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "consectetur"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "adipisci"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "velit"
            },
            {
              "characterFormat": {
              },
              "text": ", sed "
            },
            {
              "characterFormat": {
              },
              "text": "quia"
            },
            {
              "characterFormat": {
              },
              "text": " non "
            },
            {
              "characterFormat": {
              },
              "text": "numquam"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "eius"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "modi"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "tempora"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "incidunt"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "labore"
            },
            {
              "characterFormat": {
              },
              "text": " et dolore "
            },
            {
              "characterFormat": {
              },
              "text": "magnam"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aliquam"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quaerat"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptatem"
            },
            {
              "characterFormat": {
              },
              "text": ". Ut "
            },
            {
              "characterFormat": {
              },
              "text": "enim"
            },
            {
              "characterFormat": {
              },
              "text": " ad minima "
            },
            {
              "characterFormat": {
              },
              "text": "veniam"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "quis"
            },
            {
              "characterFormat": {
              },
              "text": " nostrum "
            },
            {
              "characterFormat": {
              },
              "text": "exercitationem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ullam"
            },
            {
              "characterFormat": {
              },
              "text": " corporis "
            },
            {
              "characterFormat": {
              },
              "text": "suscipit"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "laboriosam"
            },
            {
              "characterFormat": {
              },
              "text": ", nisi "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aliquid"
            },
            {
              "characterFormat": {
              },
              "text": " ex "
            },
            {
              "characterFormat": {
              },
              "text": "ea"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "commodi"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "consequatur"
            },
            {
              "characterFormat": {
              },
              "text": "? "
            },
            {
              "characterFormat": {
              },
              "text": "Quis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "autem"
            },
            {
              "characterFormat": {
              },
              "text": " vel "
            },
            {
              "characterFormat": {
              },
              "text": "eum"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "iure"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "reprehenderit"
            },
            {
              "characterFormat": {
              },
              "text": " qui in "
            },
            {
              "characterFormat": {
              },
              "text": "ea"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptate"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "velit"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "esse"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quam"
            },
            {
              "characterFormat": {
              },
              "text": " nihil "
            },
            {
              "characterFormat": {
              },
              "text": "molestiae"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "consequatur"
            },
            {
              "characterFormat": {
              },
              "text": ", vel "
            },
            {
              "characterFormat": {
              },
              "text": "illum"
            },
            {
              "characterFormat": {
              },
              "text": " qui "
            },
            {
              "characterFormat": {
              },
              "text": "dolorem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "eum"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "fugiat"
            },
            {
              "characterFormat": {
              },
              "text": " quo "
            },
            {
              "characterFormat": {
              },
              "text": "voluptas"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "nulla"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "pariatur"
            },
            {
              "characterFormat": {
              },
              "text": "?"
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "At "
            },
            {
              "characterFormat": {
              },
              "text": "vero"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "eos"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "accusamus"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "iusto"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "odio"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "dignissimos"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ducimus"
            },
            {
              "characterFormat": {
              },
              "text": " qui "
            },
            {
              "characterFormat": {
              },
              "text": "blanditiis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "praesentium"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptatum"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "deleniti"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "atque"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "corrupti"
            },
            {
              "characterFormat": {
              },
              "text": " quos "
            },
            {
              "characterFormat": {
              },
              "text": "dolores"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "quas"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "molestias"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "excepturi"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "sint"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "occaecati"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "cupiditate"
            },
            {
              "characterFormat": {
              },
              "text": " non provident, "
            },
            {
              "characterFormat": {
              },
              "text": "similique"
            },
            {
              "characterFormat": {
              },
              "text": " sunt in culpa qui "
            },
            {
              "characterFormat": {
              },
              "text": "officia"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "deserunt"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "mollitia"
            },
            {
              "characterFormat": {
              },
              "text": " animi, id "
            },
            {
              "characterFormat": {
              },
              "text": "est"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "laborum"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "dolorum"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "fuga"
            },
            {
              "characterFormat": {
              },
              "text": ". Et "
            },
            {
              "characterFormat": {
              },
              "text": "harum"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quidem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "rerum facilis "
            },
            {
              "characterFormat": {
              },
              "text": "est"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "expedita"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "distinctio"
            },
            {
              "characterFormat": {
              },
              "text": ". Nam libero tempore, cum "
            },
            {
              "characterFormat": {
              },
              "text": "soluta"
            },
            {
              "characterFormat": {
              },
              "text": " nobis "
            },
            {
              "characterFormat": {
              },
              "text": "est"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "eligendi"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "optio"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "cumque"
            },
            {
              "characterFormat": {
              },
              "text": " nihil "
            },
            {
              "characterFormat": {
              },
              "text": "impedit"
            },
            {
              "characterFormat": {
              },
              "text": " quo minus id quod "
            },
            {
              "characterFormat": {
              },
              "text": "maxime"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "placeat"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "facere"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "possimus"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "omnis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptas"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "assumenda"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "est"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "omnis"
            },
            {
              "characterFormat": {
              },
              "text": " dolor "
            },
            {
              "characterFormat": {
              },
              "text": "repellendus"
            },
            {
              "characterFormat": {
              },
              "text": ". "
            },
            {
              "characterFormat": {
              },
              "text": "Temporibus"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "autem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quibusdam"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "aut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "officiis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "debitis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aut"
            },
            {
              "characterFormat": {
              },
              "text": " rerum "
            },
            {
              "characterFormat": {
              },
              "text": "necessitatibus"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "saepe"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "eveniet"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "voluptates"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "repudiandae"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "sint"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "molestiae"
            },
            {
              "characterFormat": {
              },
              "text": " non "
            },
            {
              "characterFormat": {
              },
              "text": "recusandae"
            },
            {
              "characterFormat": {
              },
              "text": ". "
            },
            {
              "characterFormat": {
              },
              "text": "Itaque"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "earum"
            },
            {
              "characterFormat": {
              },
              "text": " rerum hic "
            },
            {
              "characterFormat": {
              },
              "text": "tenetur"
            },
            {
              "characterFormat": {
              },
              "text": " a "
            },
            {
              "characterFormat": {
              },
              "text": "sapiente"
            },
            {
              "characterFormat": {
              },
              "text": " delectus, "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "reiciendis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptatibus"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "maiores"
            },
            {
              "characterFormat": {
              },
              "text": " alias "
            },
            {
              "characterFormat": {
              },
              "text": "consequatur"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "perferendis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "doloribus"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "asperiores"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "repellat"
            },
            {
              "characterFormat": {
              },
              "text": "."
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
          ]
        }
      ],
      "headersFooters": {
        "header": {
          "blocks": [
            {
              "paragraphFormat": {
                "textAlignment": "Right",
                "styleName": "Header",
                "listFormat": {
                }
              },
              "characterFormat": {
              },
              "inlines": [
                {
                  "characterFormat": {
                  },
                  "text": "Header distance from top is 24px"
                }
              ]
            }
          ]
        },
        "footer": {
          "blocks": [
            {
              "paragraphFormat": {
                "textAlignment": "Right",
                "styleName": "Footer",
                "listFormat": {
                },
                "tabs": [
                  {
                    "position": 0,
                    "deletePosition": 234,
                    "tabJustification": "Left",
                    "tabLeader": "None"
                  }
                ]
              },
              "characterFormat": {
              },
              "inlines": [
                {
                  "characterFormat": {
                  },
                  "text": "Footer distance from bottom is 24px"
                }
              ]
            }
          ]
        }
      }
    }
  ],
  "characterFormat": {
    "bold": false,
    "italic": false,
    "fontSize": 11,
    "fontFamily": "Calibri",
    "underline": "None",
    "strikethrough": "None",
    "baselineAlignment": "Normal",
    "highlightColor": "NoColor",
    "fontColor": "#000000FF",
    "fontSizeBidi": 11,
    "fontFamilyBidi": "Calibri"
  },
  "paragraphFormat": {
    "leftIndent": 0,
    "rightIndent": 0,
    "firstLineIndent": 0,
    "textAlignment": "Left",
    "beforeSpacing": 0,
    "afterSpacing": 8,
    "lineSpacing": 1.0791666507720947,
    "lineSpacingType": "Multiple",
    "listFormat": {
    },
    "bidi": false
  },
  "defaultTabWidth": 36,
  "enforcement": false,
  "hashValue": "",
  "saltValue": "",
  "formatting": false,
  "protectionType": "NoProtection",
  "styles": [
    {
      "name": "Normal",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {
        }
      },
      "characterFormat": {
      },
      "next": "Normal"
    },
    {
      "name": "Heading 1",
      "type": "Paragraph",
      "paragraphFormat": {
        "beforeSpacing": 12,
        "afterSpacing": 0,
        "outlineLevel": "Level1",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontSize": 16,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496FF"
      },
      "basedOn": "Normal",
      "link": "Heading 1 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 1 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 16,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496FF"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Default Paragraph Font",
      "type": "Character",
      "characterFormat": {
      }
    },
    {
      "name": "Heading 2",
      "type": "Paragraph",
      "paragraphFormat": {
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "outlineLevel": "Level2",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontSize": 13,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496FF"
      },
      "basedOn": "Normal",
      "link": "Heading 2 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 2 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 13,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496FF"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 3",
      "type": "Paragraph",
      "paragraphFormat": {
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "outlineLevel": "Level3",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763FF"
      },
      "basedOn": "Normal",
      "link": "Heading 3 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 3 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763FF"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 4",
      "type": "Paragraph",
      "paragraphFormat": {
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "outlineLevel": "Level4",
        "listFormat": {
        }
      },
      "characterFormat": {
        "italic": true,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496FF"
      },
      "basedOn": "Normal",
      "link": "Heading 4 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 4 Char",
      "type": "Character",
      "characterFormat": {
        "italic": true,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496FF"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 5",
      "type": "Paragraph",
      "paragraphFormat": {
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "outlineLevel": "Level5",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496FF"
      },
      "basedOn": "Normal",
      "link": "Heading 5 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 5 Char",
      "type": "Character",
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496FF"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 6",
      "type": "Paragraph",
      "paragraphFormat": {
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "outlineLevel": "Level6",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763FF"
      },
      "basedOn": "Normal",
      "link": "Heading 6 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 6 Char",
      "type": "Character",
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763FF"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Notes",
      "type": "Paragraph",
      "paragraphFormat": {
        "afterSpacing": 6,
        "lineSpacing": 1,
        "lineSpacingType": "Multiple",
        "listFormat": {
        }
      },
      "characterFormat": {
        "bold": true
      },
      "basedOn": "Normal",
      "next": "Normal"
    },
    {
      "name": "Title",
      "type": "Paragraph",
      "paragraphFormat": {
        "afterSpacing": 0,
        "lineSpacing": 1,
        "lineSpacingType": "Multiple",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontSize": 28,
        "fontFamily": "Calibri Light"
      },
      "basedOn": "Normal",
      "link": "Title Char",
      "next": "Normal"
    },
    {
      "name": "Title Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 28,
        "fontFamily": "Calibri Light"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Subtitle",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontColor": "#5A5A5AFF"
      },
      "basedOn": "Normal",
      "link": "Subtitle Char",
      "next": "Normal"
    },
    {
      "name": "Subtitle Char",
      "type": "Character",
      "characterFormat": {
        "fontColor": "#5A5A5AFF"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Header",
      "type": "Paragraph",
      "paragraphFormat": {
        "afterSpacing": 0,
        "lineSpacing": 1,
        "lineSpacingType": "Multiple",
        "listFormat": {
        },
        "tabs": [
          {
            "position": 234,
            "deletePosition": 0,
            "tabJustification": "Center",
            "tabLeader": "None"
          },
          {
            "position": 468,
            "deletePosition": 0,
            "tabJustification": "Right",
            "tabLeader": "None"
          }
        ]
      },
      "characterFormat": {
      },
      "basedOn": "Normal",
      "link": "Header Char",
      "next": "Normal"
    },
    {
      "name": "Header Char",
      "type": "Character",
      "characterFormat": {
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Footer",
      "type": "Paragraph",
      "paragraphFormat": {
        "afterSpacing": 0,
        "lineSpacing": 1,
        "lineSpacingType": "Multiple",
        "listFormat": {
        },
        "tabs": [
          {
            "position": 234,
            "deletePosition": 0,
            "tabJustification": "Center",
            "tabLeader": "None"
          },
          {
            "position": 468,
            "deletePosition": 0,
            "tabJustification": "Right",
            "tabLeader": "None"
          }
        ]
      },
      "characterFormat": {
      },
      "basedOn": "Normal",
      "link": "Footer Char",
      "next": "Normal"
    },
    {
      "name": "Footer Char",
      "type": "Character",
      "characterFormat": {
      },
      "basedOn": "Default Paragraph Font"
    }
  ],
  "lists": [
  ],
  "abstractLists": [
  ],
  "comments": [
  ]
}
describe('SectionBreak validation', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    DocumentEditor.Inject(Selection, Editor)
    editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, layoutType: 'Continuous' });
    (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.appendTo('#container');
  });
  afterAll((done) => {
    editor.destroy();
    document.body.removeChild(document.getElementById('container'));
    editor = undefined;
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('SectionBreak validation', () => {
    editor.open(JSON.stringify(sectionBreakDocument));
    let page: Page = editor.documentHelper.pages[0];
    expect(editor.documentHelper.pages.length).toBeGreaterThan(1);
  });
});
let pagebreakDocument: any = {
  "sections": [
    {
      "sectionFormat": {
        "pageWidth": 612,
        "pageHeight": 792,
        "leftMargin": 72,
        "rightMargin": 72,
        "topMargin": 72,
        "bottomMargin": 72,
        "differentFirstPage": false,
        "differentOddAndEvenPages": false,
        "headerDistance": 36,
        "footerDistance": 36,
        "bidi": false
      },
      "blocks": [
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "Lorem ipsum dolor sit "
            },
            {
              "characterFormat": {
              },
              "text": "amet"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "consectetur"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "adipiscing"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "elit"
            },
            {
              "characterFormat": {
              },
              "text": ", sed do "
            },
            {
              "characterFormat": {
              },
              "text": "eiusmod"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "tempor"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "incididunt"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "labore"
            },
            {
              "characterFormat": {
              },
              "text": " et dolore magna "
            },
            {
              "characterFormat": {
              },
              "text": "aliqua"
            },
            {
              "characterFormat": {
              },
              "text": ". Ut "
            },
            {
              "characterFormat": {
              },
              "text": "enim"
            },
            {
              "characterFormat": {
              },
              "text": " ad minim "
            },
            {
              "characterFormat": {
              },
              "text": "veniam"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "quis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "nostrud"
            },
            {
              "characterFormat": {
              },
              "text": " exercitation "
            },
            {
              "characterFormat": {
              },
              "text": "ullamco"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "laboris"
            },
            {
              "characterFormat": {
              },
              "text": " nisi "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aliquip"
            },
            {
              "characterFormat": {
              },
              "text": " ex "
            },
            {
              "characterFormat": {
              },
              "text": "ea"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "commodo"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "consequat"
            },
            {
              "characterFormat": {
              },
              "text": ". Duis "
            },
            {
              "characterFormat": {
              },
              "text": "aute"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "irure"
            },
            {
              "characterFormat": {
              },
              "text": " dolor in "
            },
            {
              "characterFormat": {
              },
              "text": "reprehenderit"
            },
            {
              "characterFormat": {
              },
              "text": " in "
            },
            {
              "characterFormat": {
              },
              "text": "voluptate"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "velit"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "esse"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "cillum"
            },
            {
              "characterFormat": {
              },
              "text": " dolore "
            },
            {
              "characterFormat": {
              },
              "text": "eu"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "fugiat"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "nulla"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "pariatur"
            },
            {
              "characterFormat": {
              },
              "text": ". "
            },
            {
              "characterFormat": {
              },
              "text": "Excepteur"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "sint"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "occaecat"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "cupidatat"
            },
            {
              "characterFormat": {
              },
              "text": " non "
            },
            {
              "characterFormat": {
              },
              "text": "proident"
            },
            {
              "characterFormat": {
              },
              "text": ", sunt in culpa qui "
            },
            {
              "characterFormat": {
              },
              "text": "officia"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "deserunt"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "mollit"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "anim"
            },
            {
              "characterFormat": {
              },
              "text": " id "
            },
            {
              "characterFormat": {
              },
              "text": "est"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "laborum"
            },
            {
              "characterFormat": {
              },
              "text": "."
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "\f"
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "Sed "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "perspiciatis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "unde"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "omnis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "iste"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "natus"
            },
            {
              "characterFormat": {
              },
              "text": " error sit "
            },
            {
              "characterFormat": {
              },
              "text": "voluptatem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "accusantium"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "doloremque"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "laudantium"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "totam"
            },
            {
              "characterFormat": {
              },
              "text": " rem "
            },
            {
              "characterFormat": {
              },
              "text": "aperiam"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "eaque"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ipsa"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quae"
            },
            {
              "characterFormat": {
              },
              "text": " ab "
            },
            {
              "characterFormat": {
              },
              "text": "illo"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "inventore"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "veritatis"
            },
            {
              "characterFormat": {
              },
              "text": " et quasi "
            },
            {
              "characterFormat": {
              },
              "text": "architecto"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "beatae"
            },
            {
              "characterFormat": {
              },
              "text": " vitae dicta sunt "
            },
            {
              "characterFormat": {
              },
              "text": "explicabo"
            },
            {
              "characterFormat": {
              },
              "text": ". Nemo "
            },
            {
              "characterFormat": {
              },
              "text": "enim"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ipsam"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptatem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quia"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptas"
            },
            {
              "characterFormat": {
              },
              "text": " sit "
            },
            {
              "characterFormat": {
              },
              "text": "aspernatur"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "odit"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aut"
            },
            {
              "characterFormat": {
              },
              "text": " fugit, sed "
            },
            {
              "characterFormat": {
              },
              "text": "quia"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "consequuntur"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "magni"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "dolores"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "eos"
            },
            {
              "characterFormat": {
              },
              "text": " qui "
            },
            {
              "characterFormat": {
              },
              "text": "ratione"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptatem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "sequi"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "nesciunt"
            },
            {
              "characterFormat": {
              },
              "text": ". "
            },
            {
              "characterFormat": {
              },
              "text": "Neque"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "porro"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quisquam"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "est"
            },
            {
              "characterFormat": {
              },
              "text": ", qui "
            },
            {
              "characterFormat": {
              },
              "text": "dolorem"
            },
            {
              "characterFormat": {
              },
              "text": " ipsum "
            },
            {
              "characterFormat": {
              },
              "text": "quia"
            },
            {
              "characterFormat": {
              },
              "text": " dolor sit "
            },
            {
              "characterFormat": {
              },
              "text": "amet"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "consectetur"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "adipisci"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "velit"
            },
            {
              "characterFormat": {
              },
              "text": ", sed "
            },
            {
              "characterFormat": {
              },
              "text": "quia"
            },
            {
              "characterFormat": {
              },
              "text": " non "
            },
            {
              "characterFormat": {
              },
              "text": "numquam"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "eius"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "modi"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "tempora"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "incidunt"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "labore"
            },
            {
              "characterFormat": {
              },
              "text": " et dolore "
            },
            {
              "characterFormat": {
              },
              "text": "magnam"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aliquam"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quaerat"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptatem"
            },
            {
              "characterFormat": {
              },
              "text": ". Ut "
            },
            {
              "characterFormat": {
              },
              "text": "enim"
            },
            {
              "characterFormat": {
              },
              "text": " ad minima "
            },
            {
              "characterFormat": {
              },
              "text": "veniam"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "quis"
            },
            {
              "characterFormat": {
              },
              "text": " nostrum "
            },
            {
              "characterFormat": {
              },
              "text": "exercitationem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ullam"
            },
            {
              "characterFormat": {
              },
              "text": " corporis "
            },
            {
              "characterFormat": {
              },
              "text": "suscipit"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "laboriosam"
            },
            {
              "characterFormat": {
              },
              "text": ", nisi "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aliquid"
            },
            {
              "characterFormat": {
              },
              "text": " ex "
            },
            {
              "characterFormat": {
              },
              "text": "ea"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "commodi"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "consequatur"
            },
            {
              "characterFormat": {
              },
              "text": "? "
            },
            {
              "characterFormat": {
              },
              "text": "Quis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "autem"
            },
            {
              "characterFormat": {
              },
              "text": " vel "
            },
            {
              "characterFormat": {
              },
              "text": "eum"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "iure"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "reprehenderit"
            },
            {
              "characterFormat": {
              },
              "text": " qui in "
            },
            {
              "characterFormat": {
              },
              "text": "ea"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptate"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "velit"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "esse"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quam"
            },
            {
              "characterFormat": {
              },
              "text": " nihil "
            },
            {
              "characterFormat": {
              },
              "text": "molestiae"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "consequatur"
            },
            {
              "characterFormat": {
              },
              "text": ", vel "
            },
            {
              "characterFormat": {
              },
              "text": "illum"
            },
            {
              "characterFormat": {
              },
              "text": " qui "
            },
            {
              "characterFormat": {
              },
              "text": "dolorem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "eum"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "fugiat"
            },
            {
              "characterFormat": {
              },
              "text": " quo "
            },
            {
              "characterFormat": {
              },
              "text": "voluptas"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "nulla"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "pariatur"
            },
            {
              "characterFormat": {
              },
              "text": "?"
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "text": "\f"
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
            {
              "characterFormat": {
              },
              "bookmarkType": 0,
              "name": "_GoBack"
            },
            {
              "characterFormat": {
              },
              "bookmarkType": 1,
              "name": "_GoBack"
            },
            {
              "characterFormat": {
              },
              "text": "At "
            },
            {
              "characterFormat": {
              },
              "text": "vero"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "eos"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "accusamus"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "iusto"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "odio"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "dignissimos"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ducimus"
            },
            {
              "characterFormat": {
              },
              "text": " qui "
            },
            {
              "characterFormat": {
              },
              "text": "blanditiis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "praesentium"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptatum"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "deleniti"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "atque"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "corrupti"
            },
            {
              "characterFormat": {
              },
              "text": " quos "
            },
            {
              "characterFormat": {
              },
              "text": "dolores"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "quas"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "molestias"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "excepturi"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "sint"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "occaecati"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "cupiditate"
            },
            {
              "characterFormat": {
              },
              "text": " non provident, "
            },
            {
              "characterFormat": {
              },
              "text": "similique"
            },
            {
              "characterFormat": {
              },
              "text": " sunt in culpa qui "
            },
            {
              "characterFormat": {
              },
              "text": "officia"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "deserunt"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "mollitia"
            },
            {
              "characterFormat": {
              },
              "text": " animi, id "
            },
            {
              "characterFormat": {
              },
              "text": "est"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "laborum"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "dolorum"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "fuga"
            },
            {
              "characterFormat": {
              },
              "text": ". Et "
            },
            {
              "characterFormat": {
              },
              "text": "harum"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quidem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "rerum facilis "
            },
            {
              "characterFormat": {
              },
              "text": "est"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "expedita"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "distinctio"
            },
            {
              "characterFormat": {
              },
              "text": ". Nam libero tempore, cum "
            },
            {
              "characterFormat": {
              },
              "text": "soluta"
            },
            {
              "characterFormat": {
              },
              "text": " nobis "
            },
            {
              "characterFormat": {
              },
              "text": "est"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "eligendi"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "optio"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "cumque"
            },
            {
              "characterFormat": {
              },
              "text": " nihil "
            },
            {
              "characterFormat": {
              },
              "text": "impedit"
            },
            {
              "characterFormat": {
              },
              "text": " quo minus id quod "
            },
            {
              "characterFormat": {
              },
              "text": "maxime"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "placeat"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "facere"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "possimus"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "omnis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptas"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "assumenda"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "est"
            },
            {
              "characterFormat": {
              },
              "text": ", "
            },
            {
              "characterFormat": {
              },
              "text": "omnis"
            },
            {
              "characterFormat": {
              },
              "text": " dolor "
            },
            {
              "characterFormat": {
              },
              "text": "repellendus"
            },
            {
              "characterFormat": {
              },
              "text": ". "
            },
            {
              "characterFormat": {
              },
              "text": "Temporibus"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "autem"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "quibusdam"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "aut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "officiis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "debitis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aut"
            },
            {
              "characterFormat": {
              },
              "text": " rerum "
            },
            {
              "characterFormat": {
              },
              "text": "necessitatibus"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "saepe"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "eveniet"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "voluptates"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "repudiandae"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "sint"
            },
            {
              "characterFormat": {
              },
              "text": " et "
            },
            {
              "characterFormat": {
              },
              "text": "molestiae"
            },
            {
              "characterFormat": {
              },
              "text": " non "
            },
            {
              "characterFormat": {
              },
              "text": "recusandae"
            },
            {
              "characterFormat": {
              },
              "text": ". "
            },
            {
              "characterFormat": {
              },
              "text": "Itaque"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "earum"
            },
            {
              "characterFormat": {
              },
              "text": " rerum hic "
            },
            {
              "characterFormat": {
              },
              "text": "tenetur"
            },
            {
              "characterFormat": {
              },
              "text": " a "
            },
            {
              "characterFormat": {
              },
              "text": "sapiente"
            },
            {
              "characterFormat": {
              },
              "text": " delectus, "
            },
            {
              "characterFormat": {
              },
              "text": "ut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "reiciendis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "voluptatibus"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "maiores"
            },
            {
              "characterFormat": {
              },
              "text": " alias "
            },
            {
              "characterFormat": {
              },
              "text": "consequatur"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "aut"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "perferendis"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "doloribus"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "asperiores"
            },
            {
              "characterFormat": {
              },
              "text": " "
            },
            {
              "characterFormat": {
              },
              "text": "repellat"
            },
            {
              "characterFormat": {
              },
              "text": "."
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
          ]
        }
      ],
      "headersFooters": {
      }
    }
  ],
  "characterFormat": {
    "bold": false,
    "italic": false,
    "fontSize": 11,
    "fontFamily": "Calibri",
    "underline": "None",
    "strikethrough": "None",
    "baselineAlignment": "Normal",
    "highlightColor": "NoColor",
    "fontColor": "#000000",
    "fontSizeBidi": 11,
    "fontFamilyBidi": "Arial"
  },
  "paragraphFormat": {
    "leftIndent": 0,
    "rightIndent": 0,
    "firstLineIndent": 0,
    "textAlignment": "Left",
    "beforeSpacing": 0,
    "afterSpacing": 8,
    "lineSpacing": 1.0791666507720947,
    "lineSpacingType": "Multiple",
    "listFormat": {
    },
    "bidi": false
  },
  "defaultTabWidth": 36,
  "enforcement": false,
  "hashValue": "",
  "saltValue": "",
  "formatting": false,
  "protectionType": "NoProtection",
  "styles": [
    {
      "name": "Normal",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontFamily": "Calibri",
        "fontColor": "#000000FF",
        "fontFamilyBidi": "Calibri"
      },
      "next": "Normal"
    },
    {
      "name": "Default Paragraph Font",
      "type": "Character",
      "characterFormat": {
      }
    },
    {
      "name": "Heading 1",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 12,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level1",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontSize": 16,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Normal",
      "link": "Heading 1 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 1 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 16,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 2",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level2",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontSize": 13,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Normal",
      "link": "Heading 2 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 2 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 13,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 3",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level3",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763"
      },
      "basedOn": "Normal",
      "link": "Heading 3 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 3 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 4",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level4",
        "listFormat": {
        }
      },
      "characterFormat": {
        "italic": true,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Normal",
      "link": "Heading 4 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 4 Char",
      "type": "Character",
      "characterFormat": {
        "italic": true,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 5",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level5",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Normal",
      "link": "Heading 5 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 5 Char",
      "type": "Character",
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Heading 6",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 2,
        "afterSpacing": 0,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level6",
        "listFormat": {
        }
      },
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763"
      },
      "basedOn": "Normal",
      "link": "Heading 6 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 6 Char",
      "type": "Character",
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763"
      },
      "basedOn": "Default Paragraph Font"
    }
  ],
  "lists": [
  ],
  "abstractLists": [
  ],
  "comments": [
  ]
}
describe('Document Layout behaviour validation', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    DocumentEditor.Inject(Selection, Editor)
    editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, layoutType: 'Continuous' });
    (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.appendTo('#container');
  });
  afterAll((done) => {
    editor.destroy();
    document.body.removeChild(document.getElementById('container'));
    editor = undefined;
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('pagebreak validation', () => {
    editor.open(JSON.stringify(pagebreakDocument));
    let paragraph: ParagraphWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget);
    let isFirstElmIsparagraph: boolean = editor.documentHelper.layout.isFirstElementWithPageBreak(paragraph);
    expect(isFirstElmIsparagraph).toBe(false);
  });
});
describe('Para and table height validation weblayout', () => {
  let editor: DocumentEditor;
  let documentHelper: DocumentHelper;
  beforeAll(() => {
    let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
    document.body.innerHTML = '';
    document.body.appendChild(ele);
    DocumentEditor.Inject(Editor, Selection);
    editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true, layoutType: 'Continuous' });
    (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.appendTo('#container');
    editor.selection.selectAll();
    documentHelper = editor.documentHelper;
  });
  beforeEach(() => {
  });
  afterAll((done) => {
    editor.destroy();
    document.body.removeChild(document.getElementById('container'));
    editor = undefined;
    documentHelper = undefined;
    setTimeout(() => {
      done();
    }, 1000);
  });
  it('paragraph height validation', () => {
    let paragraph: ParagraphWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
    let height: number = paragraph.height;
    let paray: number = height;
    expect(height).toBeCloseTo(paray);
  });
  it('table height validation', () => {
    let table: TableWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
    let row: TableRowWidget = (documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget;
    let height: number = (table.containerWidget.height + row.height) / 2;
    let tableheight: number = table.containerWidget.height;
    expect(tableheight).toBeCloseTo(height);
  });
  it('table Container height validation', () => {
    let table: TableWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
    let height: number = (table.containerWidget.height + table.height) / 2;
    let tableheight: number = table.containerWidget.height;
    expect(tableheight).toBeCloseTo(height);
  });
});
describe('comment mark position validation', () => {
  let editor: DocumentEditor = undefined;
  let viewer: WebLayoutViewer;
  beforeAll(() => {
    let ele: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(ele);
    DocumentEditor.Inject(Selection, Editor)
    editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true, layoutType: 'Continuous' });
    (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.appendTo('#container');
  });
  afterAll((done) => {
    editor.destroy();
    document.body.removeChild(document.getElementById('container'));
    editor = undefined;
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('comment mark position validation', () => {
    let leftpos: string = (editor.documentHelper.visibleBounds.width) - ((editor.viewer as WebLayoutViewer).padding.right * 2) - ((editor.viewer as WebLayoutViewer).padding.left * 2) + 'px';
    let left: string = leftpos;
    expect(leftpos).toEqual(left);
  });
});







