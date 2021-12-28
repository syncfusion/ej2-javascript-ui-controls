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
    // ele.setAttribute("style", "width: 1500px");
    document.body.appendChild(ele);
    DocumentEditor.Inject(Selection, Editor)
    editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, layoutType: 'Continuous' });
    (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.width = '1500px';
    editor.appendTo('#container');
  });
  afterAll((done) => {
    editor.destroy();
    document.body.removeChild(document.getElementById('container'));
    editor = undefined;
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('Width validation', () => {
    console.log('Width validation');
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
    // ele.setAttribute("style", "width: 1000px");
    document.body.appendChild(ele);
    DocumentEditor.Inject(Selection, Editor)
    editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, layoutType: 'Continuous' });
    (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.width = '1000px';
    editor.appendTo('#container');
  });
  afterAll((done) => {
    editor.destroy();
    document.body.removeChild(document.getElementById('container'));
    editor = undefined;
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('Width validation', () => {
    console.log('Width validation');
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
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('SectionBreak validation', () => {
    console.log('SectionBreak validation');
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
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('pagebreak validation', () => {
    console.log('pagebreak validation');
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
    document.body.innerHTML = '';
    documentHelper = undefined;
    setTimeout(() => {
      done();
    }, 1000);
  });
  it('paragraph height validation', () => {
    console.log('paragraph height validation');
    let paragraph: ParagraphWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
    let height: number = paragraph.height;
    let paray: number = height;
    expect(height).toBeCloseTo(paray);
  });
  it('table height validation', () => {
    console.log('table height validation');
    let table: TableWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
    let row: TableRowWidget = (documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget;
    let height: number = (table.containerWidget.height + row.height) / 2;
    let tableheight: number = table.containerWidget.height;
    expect(tableheight).toBeCloseTo(height);
  });
  it('table Container height validation', () => {
    console.log('table Container height validation');
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
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('comment mark position validation', () => {
    console.log('comment mark position validation');
    let leftpos: string = (editor.documentHelper.visibleBounds.width) - ((editor.viewer as WebLayoutViewer).padding.right * 2) - ((editor.viewer as WebLayoutViewer).padding.left * 2) + 'px';
    let left: string = leftpos;
    expect(leftpos).toEqual(left);
  });
});

/**
 * Layout left alignment with splitting validation
 */

// let leftAlignDoc:any={"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":true,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"_GoBack"},{"characterFormat":{},"bookmarkType":1,"name":"_GoBack"},{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{},"text":"HYPERLINK \\l \"_Toc23324325\""},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"SCHEDULE 1 "},{"characterFormat":{},"text":"SHAREHOLDER OF THE COMPANY AND RESPECTIVE "},{"characterFormat":{},"text":"SHAREHOLDIN.."},{"characterFormat":{},"text":".............22"},{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{},"text":"HYPERLINK \\l \"_Toc23324326\""},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"SCHEDULE 2 "},{"characterFormat":{},"text":"FOUNDER "},{"characterFormat":{},"text":"VESTING"},{"characterFormat":{},"text":"....................................................................................................."},{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{},"text":" PAGEREF _Toc23324326 \\h "},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"23"},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"fieldType":1}]},{"paragraphFormat":{"textAlignment":"Center","afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSizeBidi":10},"inlines":[{"characterFormat":{},"fieldType":1}]}],"headersFooters":{"footer":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Footer","listFormat":{}},"characterFormat":{"fontSizeBidi":10},"inlines":[{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSizeBidi":10},"text":" PAGE   \\* MERGEFORMAT "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontSizeBidi":10},"text":"2"},{"characterFormat":{},"fieldType":1}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSizeBidi":10},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Footer","listFormat":{}},"characterFormat":{"fontSizeBidi":10},"inlines":[]},{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":10,"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Arial"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"textAlignment":"Justify","afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{"listId":0}},"characterFormat":{"bold":true,"fontFamily":"Arial Bold","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Arial Bold","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level2","listFormat":{"listLevelNumber":1}},"characterFormat":{"fontFamily":"Arial"},"basedOn":"Heading 1","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{"listId":0,"listLevelNumber":2}},"characterFormat":{"boldBidi":true},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontColor":"#000000FF","boldBidi":true,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{"listId":0,"listLevelNumber":3}},"characterFormat":{"boldBidi":true,"italicBidi":true},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","boldBidi":true,"italicBidi":true,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{"listId":0,"listLevelNumber":4}},"characterFormat":{"fontSize":10,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{"listId":0,"listLevelNumber":5}},"characterFormat":{"fontSize":10,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Appendix Number","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","beforeSpacing":6,"afterSpacing":0,"lineSpacing":2,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{"listId":5}},"characterFormat":{"bold":true,"fontFamily":"Arial Bold","boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"RTZ Appendix Number"},{"name":"RTZ Appendix Title","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","beforeSpacing":6,"afterSpacing":0,"lineSpacing":2,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true,"fontSizeBidi":10},"basedOn":"Normal","next":"RTZ Appendix Title"},{"name":"RTZ Body Text 1","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","next":"Normal"},{"name":"RTZ Body Text 2","type":"Paragraph","paragraphFormat":{"leftIndent":36,"beforeSpacing":0,"afterSpacing":0,"listFormat":{}},"characterFormat":{},"basedOn":"RTZ Body Text 1","next":"Normal"},{"name":"RTZ Body Text 3","type":"Paragraph","paragraphFormat":{"leftIndent":72,"listFormat":{}},"characterFormat":{},"basedOn":"RTZ Body Text 2","next":"RTZ Body Text 3"},{"name":"RTZ Body Text 4","type":"Paragraph","paragraphFormat":{"leftIndent":108,"listFormat":{}},"characterFormat":{},"basedOn":"RTZ Body Text 3","next":"RTZ Body Text 4"},{"name":"RTZ Body Text 5","type":"Paragraph","paragraphFormat":{"leftIndent":144,"listFormat":{}},"characterFormat":{},"basedOn":"RTZ Body Text 4","next":"RTZ Body Text 5"},{"name":"RTZ Body Text 6","type":"Paragraph","paragraphFormat":{"leftIndent":180,"listFormat":{}},"characterFormat":{},"basedOn":"RTZ Body Text 5","next":"RTZ Body Text 6"},{"name":"RTZ Body Text Gen","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":56.70000076293945,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Times New Roman","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"RTZ Body Text Gen Char","next":"RTZ Body Text Gen"},{"name":"RTZ Body Text Gen Char","type":"Character","characterFormat":{"fontFamily":"Times New Roman","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Document Title","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","beforeSpacing":18,"afterSpacing":18,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true,"fontSizeBidi":10},"basedOn":"Normal","next":"RTZ Document Title"},{"name":"RTZ Heading 1","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{"listId":3}},"characterFormat":{"bold":true,"fontSizeBidi":10},"basedOn":"Normal","link":"RTZ Heading 1 Char","next":"Normal"},{"name":"RTZ Heading 1 Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Heading 2","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","outlineLevel":"BodyText","listFormat":{"listLevelNumber":1}},"characterFormat":{"bold":false},"basedOn":"RTZ Heading 1","next":"RTZ Body Text 2"},{"name":"RTZ Heading 3","type":"Paragraph","paragraphFormat":{"listFormat":{"listLevelNumber":2}},"characterFormat":{},"basedOn":"RTZ Heading 2","next":"Normal"},{"name":"RTZ Heading 4","type":"Paragraph","paragraphFormat":{"listFormat":{"listLevelNumber":3}},"characterFormat":{},"basedOn":"RTZ Heading 3","next":"Normal"},{"name":"RTZ Heading 6","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{"listId":3,"listLevelNumber":5}},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","link":"RTZ Heading 6 Char","next":"RTZ Heading 6"},{"name":"RTZ Heading 6 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Heading 5","type":"Paragraph","paragraphFormat":{"listFormat":{"listLevelNumber":4}},"characterFormat":{},"basedOn":"RTZ Heading 6","next":"RTZ Heading 5"},{"name":"RTZ Heading 7","type":"Paragraph","paragraphFormat":{"leftIndent":216,"firstLineIndent":-36,"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","next":"RTZ Heading 7"},{"name":"RTZ Notice - Party Names","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":24,"afterSpacing":5,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true,"fontSizeBidi":10},"basedOn":"Body Text 2","next":"RTZ Notice - Party Names"},{"name":"Body Text 2","type":"Paragraph","paragraphFormat":{"afterSpacing":6,"lineSpacing":2,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{},"basedOn":"Normal","link":"Body Text 2 Char","next":"Normal"},{"name":"Body Text 2 Char","type":"Character","characterFormat":{"fontFamily":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Party & Recital Headings","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":56.70000076293945,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"boldBidi":true,"fontSizeBidi":10},"basedOn":"Normal","next":"RTZ Party & Recital Headings"},{"name":"RTZ Party Names","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{"listId":4},"tabs":[{"position":0,"deletePosition":36,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"boldBidi":true,"fontSizeBidi":10},"basedOn":"Normal","next":"Normal"},{"name":"RTZ Recitals","type":"Paragraph","paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{"listId":2}},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","next":"Normal"},{"name":"RTZ Schedule1 Number & Title","type":"Paragraph","paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"textAlignment":"Center","beforeSpacing":6,"afterSpacing":6,"lineSpacing":2,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{"listId":1}},"characterFormat":{"bold":true,"fontSizeBidi":10},"basedOn":"Normal","next":"Normal"},{"name":"RTZ Schedule2 Part Number & Title","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level2","listFormat":{"listLevelNumber":1}},"characterFormat":{"fontFamily":"Arial Bold","underline":"Single"},"basedOn":"RTZ Schedule1 Number & Title","next":"Normal"},{"name":"RTZ Schedule3 SubHeading 1","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":2}},"characterFormat":{"bold":true,"fontSizeBidi":10},"basedOn":"Normal","link":"RTZ Schedule3 SubHeading 1 Char","next":"Normal"},{"name":"RTZ Schedule3 SubHeading 1 Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Schedule4 SubHeading 2","type":"Paragraph","paragraphFormat":{"listFormat":{"listLevelNumber":3}},"characterFormat":{},"basedOn":"RTZ Schedule3 SubHeading 1","link":"RTZ Schedule4 SubHeading 2 Char","next":"Body Text 2"},{"name":"RTZ Schedule4 SubHeading 2 Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"RTZ Schedule3 SubHeading 1 Char"},{"name":"RTZ Schedule5 SubHeading 3","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level3","listFormat":{"listLevelNumber":4}},"characterFormat":{"bold":false},"basedOn":"RTZ Schedule4 SubHeading 2","link":"RTZ Schedule5 SubHeading 3 Char","next":"RTZ Schedule5 SubHeading 3"},{"name":"RTZ Schedule5 SubHeading 3 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Schedule6 SubHeading 4","type":"Paragraph","paragraphFormat":{"beforeSpacing":0,"afterSpacing":0,"outlineLevel":"Level4","listFormat":{"listLevelNumber":5}},"characterFormat":{},"basedOn":"RTZ Schedule5 SubHeading 3","next":"RTZ Schedule6 SubHeading 4"},{"name":"RTZ Schedule7 SubHeading 5","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level5","listFormat":{"listLevelNumber":6}},"characterFormat":{},"basedOn":"RTZ Schedule5 SubHeading 3","link":"RTZ Schedule7 SubHeading 5 Char","next":"RTZ Schedule7 SubHeading 5"},{"name":"RTZ Schedule7 SubHeading 5 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"RTZ Schedule5 SubHeading 3 Char"},{"name":"RTZ Schedule8 SubHeading 6","type":"Paragraph","paragraphFormat":{"listFormat":{"listLevelNumber":7}},"characterFormat":{},"basedOn":"RTZ Schedule7 SubHeading 5","next":"RTZ Schedule8 SubHeading 6"},{"name":"Header","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Hyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#0000FFFF"},"basedOn":"Default Paragraph Font"},{"name":"Unresolved Mention","type":"Character","characterFormat":{"fontColor":"#605E5CFF"},"basedOn":"Default Paragraph Font"},{"name":"TOC 1","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":5,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":22.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":450.75,"deletePosition":0,"tabJustification":"Right","tabLeader":"Dot"}]},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"List Bullet Table","type":"Paragraph","paragraphFormat":{"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":6}},"characterFormat":{"fontSize":9,"fontSizeBidi":10},"basedOn":"Normal","next":"List Bullet Table"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"annotation reference","type":"Character","characterFormat":{"fontSize":8,"fontSizeBidi":8},"basedOn":"Default Paragraph Font"},{"name":"annotation text","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","link":"Comment Text Char","next":"annotation text"},{"name":"Comment Text Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Default Paragraph Font"},{"name":"TOC 9","type":"Paragraph","paragraphFormat":{"leftIndent":88,"afterSpacing":5,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":225.60000610351562,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.25,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Normal"},{"name":"Footer Char","type":"Character","characterFormat":{"fontFamily":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"TOC Heading","type":"Paragraph","paragraphFormat":{"textAlignment":"Left","beforeSpacing":12,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"BodyText","listFormat":{"listId":-1,"listLevelNumber":0}},"characterFormat":{"bold":false,"fontSize":16,"fontFamily":"Cambria","fontColor":"#365F91FF","fontSizeBidi":16},"basedOn":"Heading 1","next":"Normal"},{"name":"TOC 2","type":"Paragraph","paragraphFormat":{"leftIndent":11,"afterSpacing":5,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"TOC 3","type":"Paragraph","paragraphFormat":{"leftIndent":22,"afterSpacing":5,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"TOC 5","type":"Paragraph","paragraphFormat":{"leftIndent":44,"afterSpacing":5,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"Index Link","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 84","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 83","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 82","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 81","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 80","type":"Character","characterFormat":{"bold":true,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 79","type":"Character","characterFormat":{"bold":true,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 78","type":"Character","characterFormat":{"bold":true,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 77","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 76","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 75","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 74","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 73","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 72","type":"Character","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 71","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 70","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 69","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 68","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 67","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 66","type":"Character","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 65","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 64","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 63","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 62","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 61","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 60","type":"Character","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 59","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 58","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 57","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 56","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 55","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 54","type":"Character","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 53","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 52","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 51","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 50","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 49","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 48","type":"Character","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 47","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 46","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 45","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 44","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 43","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 42","type":"Character","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 41","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 40","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 39","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 38","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 37","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 36","type":"Character","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 35","type":"Character","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 34","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 33","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 32","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 31","type":"Character","characterFormat":{"bold":true,"italic":false,"fontSize":8.5,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":8.5},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 30","type":"Character","characterFormat":{"bold":true,"italic":false,"fontSize":10.5,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10.5},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 29","type":"Character","characterFormat":{"bold":true,"italic":false,"fontSize":11,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":11},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 28","type":"Character","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 27","type":"Character","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 26","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 25","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":8,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":8},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 24","type":"Character","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 23","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 22","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 21","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 20","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 19","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 18","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 17","type":"Character","characterFormat":{"bold":true,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 16","type":"Character","characterFormat":{"bold":true,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 15","type":"Character","characterFormat":{"bold":true,"italic":false,"fontSize":10,"underline":"Single","strikethrough":"None","highlightColor":"Black","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 14","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","highlightColor":"Black","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 13","type":"Character","characterFormat":{"bold":true,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 12","type":"Character","characterFormat":{"bold":true,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 11","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 10","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 9","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 8","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 7","type":"Character","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 6","type":"Character","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 5","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":11,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":11},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 4","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 3","type":"Character","characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 2","type":"Character","characterFormat":{"bold":true,"italic":false,"fontSize":10,"strikethrough":"None","fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"ListLabel 1","type":"Character","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"Internet Link","type":"Character","characterFormat":{"bold":false,"italic":false,"underline":"Single","strikethrough":"None","fontColor":"#0000FFFF"},"basedOn":"Default Paragraph Font"},{"name":"Contents 5","type":"Paragraph","paragraphFormat":{"leftIndent":44,"afterSpacing":5,"listFormat":{}},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","next":"Contents 5"},{"name":"Contents 3","type":"Paragraph","paragraphFormat":{"leftIndent":22,"afterSpacing":5,"listFormat":{}},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","next":"Contents 3"},{"name":"Contents 2","type":"Paragraph","paragraphFormat":{"leftIndent":11,"afterSpacing":5,"listFormat":{}},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","next":"Contents 2"},{"name":"Contents 9","type":"Paragraph","paragraphFormat":{"leftIndent":88,"afterSpacing":5,"listFormat":{}},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","next":"Contents 9"},{"name":"Contents 1","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":5,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":22.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":450.75,"deletePosition":0,"tabJustification":"Right","tabLeader":"Dot"}]},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","next":"Contents 1"},{"name":"Index","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","next":"Index"},{"name":"Caption","type":"Paragraph","paragraphFormat":{"beforeSpacing":6,"afterSpacing":6,"listFormat":{}},"characterFormat":{"italic":true,"fontSize":12,"fontSizeBidi":12},"basedOn":"Normal","next":"Caption"},{"name":"List","type":"Paragraph","paragraphFormat":{"afterSpacing":7,"listFormat":{}},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","next":"List"},{"name":"Text Body","type":"Paragraph","paragraphFormat":{"afterSpacing":7,"listFormat":{}},"characterFormat":{"fontSizeBidi":10},"basedOn":"Normal","next":"Text Body"},{"name":"Heading","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"afterSpacing":6,"listFormat":{}},"characterFormat":{"fontSize":14,"fontFamily":"Liberation Sans","fontSizeBidi":14,"fontFamilyBidi":"Liberation Sans"},"basedOn":"Normal","next":"Heading"}],"lists":[{"abstractListId":0,"levelOverrides":[],"listId":0},{"abstractListId":1,"levelOverrides":[],"listId":1},{"abstractListId":2,"levelOverrides":[],"listId":2},{"abstractListId":3,"levelOverrides":[],"listId":3},{"abstractListId":4,"levelOverrides":[],"listId":4},{"abstractListId":5,"levelOverrides":[],"listId":5},{"abstractListId":6,"levelOverrides":[],"listId":6}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","italicBidi":false},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{"bold":true,"fontColor":"#000000FF"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"(%3)","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%4)","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":108,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"UpLetter","numberFormat":"(%5)","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"UpRoman","numberFormat":"(%6)","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":90,"firstLineIndent":-90,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":90,"firstLineIndent":-90,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-108,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8.%9","restartLevel":8,"startAt":1}]},{"abstractListId":1,"levels":[{"characterFormat":{"bold":true,"italic":false,"fontSize":10,"fontFamily":"Arial Bold"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"None","listLevelPattern":"Arabic","numberFormat":"Schedule %1","restartLevel":0,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"UpLetter","numberFormat":"Part %2","restartLevel":1,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%3.%4","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"(%5)","restartLevel":4,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%6)","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{}},"followCharacter":"None","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{}},"followCharacter":"None","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{}},"followCharacter":"None","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0}]},{"abstractListId":2,"levels":[{"characterFormat":{"bold":true,"italic":false,"fontSize":10,"fontFamily":"Arial Bold","strikethrough":"None","baselineAlignment":"Normal","italicBidi":false,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"UpLetter","numberFormat":"(%1)","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":3,"levels":[{"characterFormat":{"bold":true,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","italicBidi":false},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","italicBidi":false},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2","restartLevel":1,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","italicBidi":false},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":72,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"(%3)","restartLevel":2,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":108,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%4)","restartLevel":3,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":144,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"UpLetter","numberFormat":"(%5)","restartLevel":4,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":180,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"UpRoman","numberFormat":"(%6)","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":252,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0}]},{"abstractListId":4,"levels":[{"characterFormat":{"bold":true,"italic":false,"fontSize":10,"fontFamily":"Arial Bold"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"(%1)","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":72,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{},"tabs":[{"position":108,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":144,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":180,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":252,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":288,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{},"tabs":[{"position":324,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":5,"levels":[{"characterFormat":{"bold":true,"italic":false,"fontSize":10,"fontFamily":"Arial Bold","strikethrough":"None","baselineAlignment":"Normal","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{}},"followCharacter":"None","listLevelPattern":"UpLetter","numberFormat":"Appendix %1","restartLevel":0,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial","strikethrough":"None","baselineAlignment":"Normal","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"(%3)","restartLevel":2,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Times New Roman"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":72,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":108,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":144,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":180,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":252,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0}]},{"abstractListId":6,"levels":[{"characterFormat":{"bold":false,"italic":false,"fontSize":8,"fontFamily":"Symbol","fontSizeBidi":8},"paragraphFormat":{"leftIndent":14.199999809265137,"firstLineIndent":-14.199999809265137,"listFormat":{},"tabs":[{"position":14.149999618530273,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]}],"comments":[]};
// let header:any={"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"asdf"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Name"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"Status"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":1}],"rowFormat":{"height":0,"heightType":"Auto","isHeader":true,"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"A"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"-"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":1}],"rowFormat":{"height":0,"heightType":"Auto","isHeader":true,"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"B"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"P"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":1}],"rowFormat":{"height":0,"heightType":"Auto","isHeader":true,"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"C"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"-"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":1}],"rowFormat":{"height":0,"heightType":"Auto","isHeader":true,"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"D"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"F"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":234,"cellWidth":234,"columnSpan":1,"rowSpan":1},"columnIndex":1}],"rowFormat":{"height":0,"heightType":"Auto","isHeader":true,"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}}],"grid":[234,234],"tableFormat":{"borders":{"top":{"lineStyle":"Single","lineWidth":0.5},"left":{"lineStyle":"Single","lineWidth":0.5},"right":{"lineStyle":"Single","lineWidth":0.5},"bottom":{"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{},"diagonalUp":{},"horizontal":{"lineStyle":"Single","lineWidth":0.5},"vertical":{"lineStyle":"Single","lineWidth":0.5}},"shading":{},"topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto"},"columnCount":2},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Calibri"},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"afterSpacing":0,"outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"afterSpacing":6,"outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[]};
// describe('Width validation', () => {
//   let editor: DocumentEditor = undefined;
//   beforeAll(() => {
//     let ele: HTMLElement = createElement('div', { id: 'container' });
//     ele.setAttribute("style", "width: 1000px");
//     document.body.appendChild(ele);
//     DocumentEditor.Inject(Selection, Editor)
//     editor = new DocumentEditor({ isReadOnly: false, enableEditor: true });
//     (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//     (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//     (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//     (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//     editor.appendTo('#container');

//   });
//   afterAll((done) => {
//     editor.destroy();
//     document.body.removeChild(document.getElementById('container'));
//     editor = undefined;
//     setTimeout(function () {
//       done();
//     }, 1000);
//   });
//   it('Width validation', () => {
//     editor.open(JSON.stringify(leftAlignDoc))
//     expect(editor.selection.start.paragraph.childWidgets.length).toBe(3);
//   });
//   // it('Header table validation', () => {
//   //   editor.open(JSON.stringify(header));
//   //   let header1: TableRowWidget = editor.documentHelper.layout.getHeader(editor.documentHelper.pages[1].bodyWidgets[0].childWidgets[0] as TableWidget);
//   //   expect(header1).not.toBe(undefined);
//   // });
// });

let checkboxWithStyle: any = {
  "sections": [
    {
      "sectionFormat": {
        "pageWidth": 612,
        "pageHeight": 792,
        "leftMargin": 54,
        "rightMargin": 54,
        "topMargin": 41.04999923706055,
        "bottomMargin": 72,
        "differentFirstPage": true,
        "differentOddAndEvenPages": false,
        "headerDistance": 25.200000762939453,
        "footerDistance": 25.200000762939453,
        "bidi": false,
        "restartPageNumbering": true,
        "pageStartingNumber": 1
      },
      "blocks": [
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {}
          },
          "characterFormat": {
            "fontSize": 9,
            "fontFamily": "Arial Narrow",
            "fontSizeBidi": 9,
            "fontFamilyBidi": "Arial Narrow"
          },
          "inlines": [
            {
              "characterFormat": {
                "styleName": "DPSTNR8 Char"
              },
              "fieldType": 0,
              "hasFieldEnd": true,
              "formFieldData": {
                "name": "Check16",
                "enabled": true,
                "helpText": "",
                "statusText": "",
                "checkBox": {
                  "sizeType": "Auto",
                  "size": 20,
                  "defaultValue": false,
                  "checked": false
                }
              }
            },
            {
              "characterFormat": {
                "styleName": "DPSTNR8 Char"
              },
              "text": " FORMCHECKBOX "
            },
            {
              "characterFormat": {},
              "fieldType": 2
            },
            {
              "characterFormat": {},
              "fieldType": 1
            },
            {
              "characterFormat": {
                "fontSize": 9,
                "fontFamily": "Arial Narrow",
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Arial Narrow"
              },
              "text": "  "
            },
            {
              "characterFormat": {
                "styleName": "DPSTNR8 Char"
              },
              "text": "INJURED"
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "DPSTNR8",
            "listFormat": {}
          },
          "characterFormat": {},
          "inlines": [
            {
              "characterFormat": {},
              "fieldType": 0,
              "hasFieldEnd": true,
              "formFieldData": {
                "name": "Check16",
                "enabled": true,
                "helpText": "",
                "statusText": "",
                "checkBox": {
                  "sizeType": "Auto",
                  "size": 20,
                  "defaultValue": false,
                  "checked": false
                }
              }
            },
            {
              "characterFormat": {},
              "text": " FORMCHECKBOX "
            },
            {
              "characterFormat": {},
              "fieldType": 2
            },
            {
              "characterFormat": {},
              "fieldType": 1
            },
            {
              "characterFormat": {},
              "text": "  "
            },
            {
              "characterFormat": {},
              "text": "DECEASED"
            }
          ]
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {}
          },
          "characterFormat": {},
          "inlines": [
            {
              "characterFormat": {},
              "text": " "
            }
          ]
        }
      ],
      "headersFooters": {
        "header": {
          "blocks": [
            {
              "paragraphFormat": {
                "listFormat": {}
              },
              "characterFormat": {},
              "inlines": []
            }
          ]
        },
        "footer": {
          "blocks": [
            {
              "paragraphFormat": {
                "textAlignment": "Center",
                "styleName": "DPSTNR10",
                "listFormat": {}
              },
              "characterFormat": {
                "fontSize": 11,
                "fontFamily": "Cambria",
                "fontSizeBidi": 11,
                "fontFamilyBidi": "Cambria"
              },
              "inlines": [
                {
                  "characterFormat": {
                    "fontSize": 11,
                    "fontFamily": "Cambria",
                    "fontSizeBidi": 11,
                    "fontFamilyBidi": "Cambria"
                  },
                  "text": "000181401225 "
                }
              ]
            }
          ]
        },
        "evenHeader": {
          "blocks": [
            {
              "paragraphFormat": {
                "listFormat": {}
              },
              "characterFormat": {},
              "inlines": []
            }
          ]
        },
        "evenFooter": {
          "blocks": [
            {
              "paragraphFormat": {
                "textAlignment": "Center",
                "styleName": "DPSTNR10",
                "listFormat": {}
              },
              "characterFormat": {
                "fontSize": 11,
                "fontFamily": "Cambria",
                "fontSizeBidi": 11,
                "fontFamilyBidi": "Cambria"
              },
              "inlines": [
                {
                  "characterFormat": {
                    "fontSize": 11,
                    "fontFamily": "Cambria",
                    "fontSizeBidi": 11,
                    "fontFamilyBidi": "Cambria"
                  },
                  "text": "000181401225 "
                }
              ]
            }
          ]
        },
        "firstPageHeader": {
          "blocks": [
            {
              "paragraphFormat": {
                "listFormat": {}
              },
              "characterFormat": {},
              "inlines": []
            }
          ]
        },
        "firstPageFooter": {
          "blocks": [
            {
              "paragraphFormat": {
                "textAlignment": "Center",
                "styleName": "DPSTNR10",
                "listFormat": {}
              },
              "characterFormat": {
                "fontSize": 11,
                "fontFamily": "Cambria",
                "fontSizeBidi": 11,
                "fontFamilyBidi": "Cambria"
              },
              "inlines": [
                {
                  "characterFormat": {
                    "fontSize": 11,
                    "fontFamily": "Cambria",
                    "fontSizeBidi": 11,
                    "fontFamilyBidi": "Cambria"
                  },
                  "text": "000181401225 "
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
    "fontSize": 12,
    "fontFamily": "Arial",
    "underline": "None",
    "strikethrough": "None",
    "baselineAlignment": "Normal",
    "highlightColor": "NoColor",
    "fontColor": "empty",
    "boldBidi": false,
    "italicBidi": false,
    "fontSizeBidi": 12,
    "fontFamilyBidi": "Arial",
    "allCaps": false
  },
  "paragraphFormat": {
    "leftIndent": 0,
    "rightIndent": 0,
    "firstLineIndent": 0,
    "textAlignment": "Left",
    "beforeSpacing": 0,
    "afterSpacing": 0,
    "lineSpacing": 1,
    "lineSpacingType": "Multiple",
    "listFormat": {},
    "bidi": false
  },
  "defaultTabWidth": 35.400001525878906,
  "trackChanges": false,
  "enforcement": false,
  "hashValue": "",
  "saltValue": "",
  "formatting": false,
  "protectionType": "NoProtection",
  "dontUseHTMLParagraphAutoSpacing": false,
  "formFieldShading": true,
  "styles": [
    {
      "name": "Normal",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "next": "Normal"
    },
    {
      "name": "Heading 1",
      "type": "Paragraph",
      "paragraphFormat": {
        "outlineLevel": "Level1",
        "listFormat": {}
      },
      "characterFormat": {
        "bold": true,
        "fontSize": 12,
        "boldBidi": true,
        "fontSizeBidi": 12
      },
      "basedOn": "Normal",
      "link": "Heading 1 Char",
      "next": "Normal"
    },
    {
      "name": "Heading 1 Char",
      "type": "Character",
      "characterFormat": {
        "bold": true,
        "fontSize": 10,
        "fontColor": "#3366FFFF",
        "boldBidi": true,
        "fontSizeBidi": 10
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Default Paragraph Font",
      "type": "Character",
      "characterFormat": {
        "fontColor": "empty"
      }
    },
    {
      "name": "Heading 2",
      "type": "Paragraph",
      "paragraphFormat": {
        "outlineLevel": "Level2",
        "listFormat": {}
      },
      "characterFormat": {
        "bold": true,
        "fontSize": 36,
        "fontFamily": "Imago Book",
        "boldBidi": true,
        "fontSizeBidi": 36,
        "fontFamilyBidi": "Imago Book"
      },
      "basedOn": "Normal",
      "next": "Normal"
    },
    {
      "name": "Heading 3",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 144,
        "firstLineIndent": 36,
        "textAlignment": "Right",
        "outlineLevel": "Level3",
        "listFormat": {}
      },
      "characterFormat": {
        "bold": true,
        "boldBidi": true
      },
      "basedOn": "Normal",
      "next": "Normal"
    },
    {
      "name": "Heading 4",
      "type": "Paragraph",
      "paragraphFormat": {
        "textAlignment": "Center",
        "outlineLevel": "Level4",
        "listFormat": {}
      },
      "characterFormat": {
        "bold": true,
        "fontSize": 8,
        "boldBidi": true,
        "fontSizeBidi": 8
      },
      "basedOn": "Normal",
      "next": "Normal"
    },
    {
      "name": "Heading 5",
      "type": "Paragraph",
      "paragraphFormat": {
        "textAlignment": "Center",
        "outlineLevel": "Level5",
        "listFormat": {}
      },
      "characterFormat": {
        "bold": true,
        "boldBidi": true
      },
      "basedOn": "Normal",
      "next": "Normal"
    },
    {
      "name": "Heading 6",
      "type": "Paragraph",
      "paragraphFormat": {
        "outlineLevel": "Level6",
        "listFormat": {},
        "tabs": [
          {
            "position": 0,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 36,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 108,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 234,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 288,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          }
        ]
      },
      "characterFormat": {
        "bold": true,
        "fontSize": 8,
        "fontFamily": "Arial",
        "boldBidi": true,
        "fontSizeBidi": 8,
        "fontFamilyBidi": "Arial"
      },
      "basedOn": "Normal",
      "next": "Normal"
    },
    {
      "name": "DPSAR11BOLDCENTERCar",
      "type": "Character",
      "characterFormat": {
        "bold": true,
        "fontSize": 11,
        "fontFamily": "Arial",
        "fontColor": "#000000FF",
        "boldBidi": true,
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Arial"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSAR11BOLDCENTER",
      "type": "Paragraph",
      "paragraphFormat": {
        "textAlignment": "Center",
        "listFormat": {}
      },
      "characterFormat": {
        "bold": true,
        "fontSize": 11,
        "fontColor": "#000000FF",
        "boldBidi": true,
        "fontSizeBidi": 11
      },
      "link": "DPSAR11BOLDCENTERCar",
      "next": "DPSAR11BOLDCENTER"
    },
    {
      "name": "DPSAR11LISTNUMBERUPPERCASECar",
      "type": "Character",
      "characterFormat": {
        "fontSize": 11,
        "fontFamily": "Arial",
        "fontColor": "#000000FF",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Arial"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSAR11LISTNUMBERUPPERCASE",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 11,
        "fontColor": "#000000FF",
        "fontSizeBidi": 11
      },
      "link": "DPSAR11LISTNUMBERUPPERCASECar",
      "next": "DPSAR11LISTNUMBERUPPERCASE"
    },
    {
      "name": "DPSTMR10Column2Car",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSTMR10Column2",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "link": "DPSTMR10Column2Car",
      "next": "DPSTMR10Column2"
    },
    {
      "name": "DPSTNR1011Car",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSTNR1011",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "link": "DPSTNR1011Car",
      "next": "DPSTNR1011"
    },
    {
      "name": "DPSTNR1011ptCar",
      "type": "Character",
      "characterFormat": {
        "fontSize": 11,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSTNR1011pt",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 11,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Times New Roman"
      },
      "link": "DPSTNR1011ptCar",
      "next": "DPSTNR1011pt"
    },
    {
      "name": "DPSTNR10UPPERCASECar",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman",
        "allCaps": true
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSTNR10UPPERCASE",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman",
        "allCaps": true
      },
      "link": "DPSTNR10UPPERCASECar",
      "next": "DPSTNR10UPPERCASE"
    },
    {
      "name": "DPSTNR11Car",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSTNR11",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "link": "DPSTNR11Car",
      "next": "DPSTNR11"
    },
    {
      "name": "Style023Car",
      "type": "Character",
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontColor": "#000000FF",
        "fontSizeBidi": 12,
        "fontFamilyBidi": "Arial"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Style023",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontColor": "#000000FF"
      },
      "link": "Style023Car",
      "next": "Style023"
    },
    {
      "name": "TableTextCar",
      "type": "Character",
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 12,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "TableText",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontFamilyBidi": "Times New Roman"
      },
      "link": "TableTextCar",
      "next": "TableText"
    },
    {
      "name": "heading1Car",
      "type": "Character",
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 12,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "heading1",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontFamilyBidi": "Times New Roman"
      },
      "next": "heading1"
    },
    {
      "name": "Placeholder Text",
      "type": "Character",
      "characterFormat": {
        "fontColor": "#808080FF"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "TOC 1",
      "type": "Paragraph",
      "paragraphFormat": {
        "afterSpacing": 5,
        "lineSpacing": 1.1999999284744263,
        "lineSpacingType": "Multiple",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontColor": "#000000FF",
        "fontSizeBidi": 10
      },
      "next": "TOC 1"
    },
    {
      "name": "TOC 2",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 11.050000190734863,
        "afterSpacing": 5,
        "lineSpacing": 1.1999999284744263,
        "lineSpacingType": "Multiple",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontColor": "#000000FF",
        "fontSizeBidi": 10
      },
      "next": "TOC 2"
    },
    {
      "name": "TOC 3",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 22.100000381469727,
        "afterSpacing": 5,
        "lineSpacing": 1.1999999284744263,
        "lineSpacingType": "Multiple",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontColor": "#000000FF",
        "fontSizeBidi": 10
      },
      "next": "TOC 3"
    },
    {
      "name": "TOC 4",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 32.900001525878906,
        "afterSpacing": 5,
        "lineSpacing": 1.1999999284744263,
        "lineSpacingType": "Multiple",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontColor": "#000000FF",
        "fontSizeBidi": 10
      },
      "next": "TOC 4"
    },
    {
      "name": "TOC 5",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 43.95000076293945,
        "afterSpacing": 5,
        "lineSpacing": 1.1999999284744263,
        "lineSpacingType": "Multiple",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontColor": "#000000FF",
        "fontSizeBidi": 10
      },
      "next": "TOC 5"
    },
    {
      "name": "TOC 6",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 55,
        "afterSpacing": 5,
        "lineSpacing": 1.1999999284744263,
        "lineSpacingType": "Multiple",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontColor": "#000000FF",
        "fontSizeBidi": 10
      },
      "next": "TOC 6"
    },
    {
      "name": "TOC 7",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 66.05000305175781,
        "afterSpacing": 5,
        "lineSpacing": 1.1999999284744263,
        "lineSpacingType": "Multiple",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontColor": "#000000FF",
        "fontSizeBidi": 10
      },
      "next": "TOC 7"
    },
    {
      "name": "TOC 8",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 77.0999984741211,
        "afterSpacing": 5,
        "lineSpacing": 1.1999999284744263,
        "lineSpacingType": "Multiple",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontColor": "#000000FF",
        "fontSizeBidi": 10
      },
      "next": "TOC 8"
    },
    {
      "name": "TOC 9",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 87.9000015258789,
        "afterSpacing": 5,
        "lineSpacing": 1.1999999284744263,
        "lineSpacingType": "Multiple",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontColor": "#000000FF",
        "fontSizeBidi": 10
      },
      "next": "TOC 9"
    },
    {
      "name": "Header",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {},
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
      "characterFormat": {},
      "basedOn": "Normal",
      "link": "Header Char",
      "next": "Header"
    },
    {
      "name": "Header Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Footer",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {},
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
      "characterFormat": {},
      "basedOn": "Normal",
      "link": "Footer Char",
      "next": "Footer"
    },
    {
      "name": "Footer Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSTNR10B01",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {
          "listId": 5
        }
      },
      "characterFormat": {},
      "basedOn": "DPSTNR10",
      "next": "DPSTNR10B01"
    },
    {
      "name": "DPSTNR10",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "link": "DPSTNR10 Char",
      "next": "DPSTNR10"
    },
    {
      "name": "DPSTNR10 Char",
      "type": "Character",
      "characterFormat": {
        "fontColor": "empty"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSTNR10B02",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 36,
        "firstLineIndent": -36,
        "listFormat": {},
        "tabs": [
          {
            "position": 36,
            "deletePosition": 0,
            "tabJustification": "List",
            "tabLeader": "None"
          }
        ]
      },
      "characterFormat": {},
      "basedOn": "DPSTNR10",
      "next": "DPSTNR10B02"
    },
    {
      "name": "DPSTNR10B03",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 36,
        "firstLineIndent": -36,
        "listFormat": {},
        "tabs": [
          {
            "position": 36,
            "deletePosition": 0,
            "tabJustification": "List",
            "tabLeader": "None"
          }
        ]
      },
      "characterFormat": {},
      "basedOn": "DPSTNR10",
      "next": "DPSTNR10B03"
    },
    {
      "name": "DPSTNR10B04",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 36,
        "firstLineIndent": -36,
        "listFormat": {},
        "tabs": [
          {
            "position": 36,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 72,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 108,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 144,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 180,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 216,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 252,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 288,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 324,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 360,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 396,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 432,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 468,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          }
        ]
      },
      "characterFormat": {},
      "basedOn": "DPSTNR10",
      "next": "DPSTNR10B04"
    },
    {
      "name": "DPSTNR10LISTNUMBER",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 36,
        "firstLineIndent": -36,
        "listFormat": {},
        "tabs": [
          {
            "position": 36,
            "deletePosition": 0,
            "tabJustification": "List",
            "tabLeader": "None"
          }
        ]
      },
      "characterFormat": {},
      "basedOn": "Normal",
      "next": "DPSTNR10LISTNUMBER"
    },
    {
      "name": "DPSTNR10LIST",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 36,
        "firstLineIndent": -36,
        "afterSpacing": 0,
        "listFormat": {},
        "tabs": [
          {
            "position": 36,
            "deletePosition": 0,
            "tabJustification": "List",
            "tabLeader": "None"
          },
          {
            "position": 432,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 468,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          }
        ]
      },
      "characterFormat": {},
      "basedOn": "List Continue",
      "next": "DPSTNR10LIST"
    },
    {
      "name": "List Continue",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 14.149999618530273,
        "afterSpacing": 6,
        "listFormat": {}
      },
      "characterFormat": {},
      "basedOn": "DPSTNR10",
      "next": "List Continue"
    },
    {
      "name": "DPSTNR10Column2",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontColor": "empty"
      },
      "next": "DPSTNR10Column2"
    },
    {
      "name": "DPSTNR10LISTLETTER",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 36,
        "firstLineIndent": -36,
        "listFormat": {},
        "tabs": [
          {
            "position": 36,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 72,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 108,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 144,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 180,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 216,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 252,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 288,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 324,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 360,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 396,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 432,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          }
        ]
      },
      "characterFormat": {},
      "basedOn": "Normal",
      "next": "DPSTNR10LISTLETTER"
    },
    {
      "name": "Signature",
      "type": "Paragraph",
      "paragraphFormat": {
        "afterSpacing": 6,
        "listFormat": {}
      },
      "characterFormat": {
        "bold": true,
        "fontSize": 30,
        "fontFamily": "Script",
        "fontColor": "empty",
        "boldBidi": true,
        "fontSizeBidi": 30,
        "fontFamilyBidi": "Script"
      },
      "link": "Signature Char",
      "next": "Signature"
    },
    {
      "name": "Signature Char",
      "type": "Character",
      "characterFormat": {
        "bold": true,
        "fontSize": 30,
        "fontFamily": "Script",
        "fontColor": "#000000FF",
        "boldBidi": true,
        "fontSizeBidi": 30,
        "fontFamilyBidi": "Script"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Balloon Text",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 8,
        "fontFamily": "Tahoma",
        "fontSizeBidi": 8,
        "fontFamilyBidi": "Tahoma"
      },
      "basedOn": "Normal",
      "link": "Balloon Text Char",
      "next": "Balloon Text"
    },
    {
      "name": "Balloon Text Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 8,
        "fontFamily": "Tahoma",
        "fontColor": "empty",
        "fontSizeBidi": 8,
        "fontFamilyBidi": "Tahoma"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Salutation",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {},
      "basedOn": "Normal",
      "link": "Salutation Char",
      "next": "Normal"
    },
    {
      "name": "Salutation Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Hyperlink",
      "type": "Character",
      "characterFormat": {
        "underline": "Single",
        "fontColor": "#0000FFFF"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Body Text Indent",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 36,
        "listFormat": {},
        "tabs": [
          {
            "position": 36,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 72,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 108,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 144,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 180,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 216,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 252,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 288,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 324,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 360,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 396,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 432,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 468,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          }
        ]
      },
      "characterFormat": {},
      "basedOn": "Normal",
      "link": "Body Text Indent Char",
      "next": "Body Text Indent"
    },
    {
      "name": "Body Text Indent Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Body Text",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {},
      "basedOn": "Normal",
      "link": "Body Text Char",
      "next": "Body Text"
    },
    {
      "name": "Body Text Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Body Text Indent 2",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 36,
        "textAlignment": "Justify",
        "listFormat": {},
        "tabs": [
          {
            "position": 21.600000381469727,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 36,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 72,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 108,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 144,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 180,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 216,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 252,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 288,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 324,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 360,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 396,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 432,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          },
          {
            "position": 468,
            "deletePosition": 0,
            "tabJustification": "Left",
            "tabLeader": "None"
          }
        ]
      },
      "characterFormat": {},
      "basedOn": "Normal",
      "link": "Body Text Indent 2 Char",
      "next": "Body Text Indent 2"
    },
    {
      "name": "Body Text Indent 2 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Title",
      "type": "Paragraph",
      "paragraphFormat": {
        "textAlignment": "Center",
        "listFormat": {}
      },
      "characterFormat": {
        "bold": true,
        "boldBidi": true
      },
      "basedOn": "Normal",
      "link": "Title Char",
      "next": "Title"
    },
    {
      "name": "Title Char",
      "type": "Character",
      "characterFormat": {
        "bold": true,
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "boldBidi": true,
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "List Paragraph",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 36,
        "afterSpacing": 8,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "listFormat": {},
        "contextualSpacing": true
      },
      "characterFormat": {
        "fontSize": 11,
        "fontFamily": "Calibri",
        "fontColor": "#00000000",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Calibri"
      },
      "basedOn": "Normal",
      "next": "List Paragraph"
    },
    {
      "name": "Body Text 0.0",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 11,
        "fontFamily": "Arial",
        "fontColor": "#00000000",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Arial"
      },
      "basedOn": "Body Text",
      "next": "Body Text 0.0"
    },
    {
      "name": "Body Text Centered",
      "type": "Paragraph",
      "paragraphFormat": {
        "textAlignment": "Center",
        "beforeSpacing": 12,
        "lineSpacing": 12,
        "lineSpacingType": "Exactly",
        "listFormat": {}
      },
      "characterFormat": {
        "fontFamily": "Arial",
        "fontColor": "#00000000",
        "fontFamilyBidi": "Arial"
      },
      "basedOn": "Body Text",
      "next": "Body Text Centered"
    },
    {
      "name": "Block Text",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": -9,
        "rightIndent": -36,
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 9,
        "fontSizeBidi": 9
      },
      "basedOn": "Normal",
      "next": "Block Text"
    },
    {
      "name": "DPSTNR8 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 8,
        "fontColor": "empty",
        "fontSizeBidi": 8
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSTNR8ArialNarrow",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 9,
        "fontFamily": "Arial Narrow",
        "fontSizeBidi": 9,
        "fontFamilyBidi": "Arial Narrow"
      },
      "basedOn": "Normal",
      "next": "DPSTNR8ArialNarrow"
    },
    {
      "name": "DPSTNR8Arialnarrow",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {},
      "basedOn": "DPSTNR8",
      "next": "DPSTNR8Arialnarrow"
    },
    {
      "name": "DPSTNR8",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 8,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 8,
        "fontFamilyBidi": "Times New Roman"
      },
      "link": "DPSTNR8Car",
      "next": "DPSTNR8"
    },
    {
      "name": "DPSTNR8Car",
      "type": "Character",
      "characterFormat": {
        "fontSize": 8,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 8,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Subtitle",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "bold": true,
        "fontSize": 12,
        "fontFamily": "Arial",
        "boldBidi": true,
        "fontSizeBidi": 12,
        "fontFamilyBidi": "Arial"
      },
      "basedOn": "Normal",
      "link": "Subtitle Char",
      "next": "Subtitle"
    },
    {
      "name": "Subtitle Char",
      "type": "Character",
      "characterFormat": {
        "bold": true,
        "fontColor": "#000000FF",
        "boldBidi": true
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Body Text 2",
      "type": "Paragraph",
      "paragraphFormat": {
        "afterSpacing": 6,
        "lineSpacing": 2,
        "lineSpacingType": "Multiple",
        "listFormat": {}
      },
      "characterFormat": {},
      "basedOn": "Normal",
      "next": "Body Text 2"
    },
    {
      "name": "DPSTNR12 Char",
      "type": "Character",
      "characterFormat": {
        "fontSize": 12,
        "fontColor": "empty",
        "fontSizeBidi": 12
      },
      "basedOn": "DPSTNR10 Char"
    },
    {
      "name": "DPSTNR10Car",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSCOURRIERCar",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Calibri",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Calibri"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSCOURRIER",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Calibri",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Calibri"
      },
      "link": "DPSCOURRIERCar",
      "next": "DPSCOURRIER"
    },
    {
      "name": "DPSTNR10RIGHTCar",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSTNR10RIGHT",
      "type": "Paragraph",
      "paragraphFormat": {
        "textAlignment": "Right",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "link": "DPSTNR10RIGHTCar",
      "next": "DPSTNR10RIGHT"
    },
    {
      "name": "DPSTNR8ArialnarrowArialNarrow8ptCar",
      "type": "Character",
      "characterFormat": {
        "fontSize": 7,
        "fontFamily": "Arial Narrow",
        "fontColor": "#000000FF",
        "fontSizeBidi": 7,
        "fontFamilyBidi": "Arial Narrow"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSTNR8ArialnarrowArialNarrow8pt",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 7,
        "fontFamily": "Arial Narrow",
        "fontColor": "#000000FF",
        "fontSizeBidi": 7,
        "fontFamilyBidi": "Arial Narrow"
      },
      "link": "DPSTNR8ArialnarrowArialNarrow8ptCar",
      "next": "DPSTNR8ArialnarrowArialNarrow8pt"
    },
    {
      "name": "DPSTNR8BoldCenteredCar",
      "type": "Character",
      "characterFormat": {
        "bold": true,
        "fontSize": 8,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "boldBidi": true,
        "fontSizeBidi": 8,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSTNR8BoldCentered",
      "type": "Paragraph",
      "paragraphFormat": {
        "textAlignment": "Center",
        "listFormat": {}
      },
      "characterFormat": {
        "bold": true,
        "fontSize": 8,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "boldBidi": true,
        "fontSizeBidi": 8,
        "fontFamilyBidi": "Times New Roman"
      },
      "link": "DPSTNR8BoldCenteredCar",
      "next": "DPSTNR8BoldCentered"
    },
    {
      "name": "DPSTNR12Car",
      "type": "Character",
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 12,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSTNR12",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontFamilyBidi": "Times New Roman"
      },
      "link": "DPSTNR12 Char",
      "next": "DPSTNR12"
    },
    {
      "name": "DPSTM10Column2Car",
      "type": "Character",
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "DPSTM10Column2",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 10,
        "fontFamily": "Times New Roman",
        "fontColor": "#000000FF",
        "fontSizeBidi": 10,
        "fontFamilyBidi": "Times New Roman"
      },
      "link": "DPSTM10Column2Car",
      "next": "DPSTM10Column2"
    },
    {
      "name": "NormalSubCar",
      "type": "Character",
      "characterFormat": {
        "fontColor": "empty"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "H1",
      "type": "Paragraph",
      "paragraphFormat": {
        "beforeSpacing": 12,
        "listFormat": {
          "listId": 0
        }
      },
      "characterFormat": {
        "fontSize": 16,
        "fontColor": "#000000FF",
        "fontSizeBidi": 16
      },
      "next": "H1"
    },
    {
      "name": "H2",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 36,
        "beforeSpacing": 2,
        "listFormat": {
          "listId": 0,
          "listLevelNumber": 1
        }
      },
      "characterFormat": {
        "fontSize": 13,
        "fontColor": "#000000FF",
        "fontSizeBidi": 13
      },
      "next": "H2"
    },
    {
      "name": "H3",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 72,
        "beforeSpacing": 2,
        "listFormat": {
          "listId": 0,
          "listLevelNumber": 2
        }
      },
      "characterFormat": {
        "fontColor": "#000000FF"
      },
      "next": "H3"
    },
    {
      "name": "H4",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 108,
        "beforeSpacing": 2,
        "listFormat": {
          "listId": 0,
          "listLevelNumber": 3
        }
      },
      "characterFormat": {
        "fontColor": "#000000FF"
      },
      "next": "H4"
    },
    {
      "name": "H5",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 144,
        "beforeSpacing": 2,
        "listFormat": {
          "listId": 0,
          "listLevelNumber": 4
        }
      },
      "characterFormat": {
        "fontColor": "#000000FF"
      },
      "next": "H5"
    },
    {
      "name": "H6",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 180,
        "beforeSpacing": 2,
        "listFormat": {
          "listId": 0,
          "listLevelNumber": 5
        }
      },
      "characterFormat": {
        "fontColor": "#000000FF"
      },
      "next": "H6"
    },
    {
      "name": "H7",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 216.0500030517578,
        "beforeSpacing": 2,
        "listFormat": {
          "listId": 0,
          "listLevelNumber": 6
        }
      },
      "characterFormat": {
        "fontColor": "#000000FF"
      },
      "next": "H7"
    },
    {
      "name": "H8",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 252.0500030517578,
        "beforeSpacing": 2,
        "listFormat": {
          "listId": 0,
          "listLevelNumber": 7
        }
      },
      "characterFormat": {
        "fontColor": "#000000FF"
      },
      "next": "H8"
    },
    {
      "name": "H9",
      "type": "Paragraph",
      "paragraphFormat": {
        "leftIndent": 288.04998779296875,
        "beforeSpacing": 2,
        "listFormat": {
          "listId": 0,
          "listLevelNumber": 8
        }
      },
      "characterFormat": {
        "fontColor": "#000000FF"
      },
      "next": "H9"
    }
  ],
  "lists": [
    {
      "abstractListId": 0,
      "levelOverrides": [],
      "listId": 0
    },
    {
      "abstractListId": 5,
      "levelOverrides": [],
      "listId": 5
    }
  ],
  "abstractLists": [
    {
      "abstractListId": 0,
      "levels": [
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "listFormat": {}
          },
          "followCharacter": "None",
          "listLevelPattern": "Arabic",
          "numberFormat": "%1) ",
          "restartLevel": 0,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "listFormat": {}
          },
          "followCharacter": "None",
          "listLevelPattern": "LowLetter",
          "numberFormat": "%2) ",
          "restartLevel": 1,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "listFormat": {}
          },
          "followCharacter": "None",
          "listLevelPattern": "LowRoman",
          "numberFormat": "%3) ",
          "restartLevel": 2,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "listFormat": {}
          },
          "followCharacter": "None",
          "listLevelPattern": "Arabic",
          "numberFormat": "(%4) ",
          "restartLevel": 3,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "listFormat": {}
          },
          "followCharacter": "None",
          "listLevelPattern": "LowLetter",
          "numberFormat": "(%5) ",
          "restartLevel": 4,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "listFormat": {}
          },
          "followCharacter": "None",
          "listLevelPattern": "LowRoman",
          "numberFormat": "(%6) ",
          "restartLevel": 5,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "listFormat": {}
          },
          "followCharacter": "None",
          "listLevelPattern": "Arabic",
          "numberFormat": "%7. ",
          "restartLevel": 6,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "listFormat": {}
          },
          "followCharacter": "None",
          "listLevelPattern": "LowLetter",
          "numberFormat": "%8. ",
          "restartLevel": 7,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "listFormat": {}
          },
          "followCharacter": "None",
          "listLevelPattern": "LowRoman",
          "numberFormat": "%9. ",
          "restartLevel": 8,
          "startAt": 1
        }
      ]
    },
    {
      "abstractListId": 5,
      "levels": [
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 36,
            "firstLineIndent": -36,
            "listFormat": {},
            "tabs": [
              {
                "position": 36,
                "deletePosition": 0,
                "tabJustification": "List",
                "tabLeader": "None"
              }
            ]
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "%1.",
          "restartLevel": 0,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 72,
            "firstLineIndent": -36,
            "listFormat": {},
            "tabs": [
              {
                "position": 72,
                "deletePosition": 0,
                "tabJustification": "List",
                "tabLeader": "None"
              }
            ]
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "%2.",
          "restartLevel": 1,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 108,
            "firstLineIndent": -36,
            "listFormat": {},
            "tabs": [
              {
                "position": 108,
                "deletePosition": 0,
                "tabJustification": "List",
                "tabLeader": "None"
              }
            ]
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "%3.",
          "restartLevel": 2,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 144,
            "firstLineIndent": -36,
            "listFormat": {},
            "tabs": [
              {
                "position": 144,
                "deletePosition": 0,
                "tabJustification": "List",
                "tabLeader": "None"
              }
            ]
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "%4.",
          "restartLevel": 3,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 180,
            "firstLineIndent": -36,
            "listFormat": {},
            "tabs": [
              {
                "position": 180,
                "deletePosition": 0,
                "tabJustification": "List",
                "tabLeader": "None"
              }
            ]
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "%5.",
          "restartLevel": 4,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 216,
            "firstLineIndent": -36,
            "listFormat": {},
            "tabs": [
              {
                "position": 216,
                "deletePosition": 0,
                "tabJustification": "List",
                "tabLeader": "None"
              }
            ]
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "%6.",
          "restartLevel": 5,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 252,
            "firstLineIndent": -36,
            "listFormat": {},
            "tabs": [
              {
                "position": 252,
                "deletePosition": 0,
                "tabJustification": "List",
                "tabLeader": "None"
              }
            ]
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "%7.",
          "restartLevel": 6,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 288,
            "firstLineIndent": -36,
            "listFormat": {},
            "tabs": [
              {
                "position": 288,
                "deletePosition": 0,
                "tabJustification": "List",
                "tabLeader": "None"
              }
            ]
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "%8.",
          "restartLevel": 7,
          "startAt": 1
        },
        {
          "characterFormat": {
            "fontColor": "empty"
          },
          "paragraphFormat": {
            "leftIndent": 324,
            "firstLineIndent": -36,
            "listFormat": {},
            "tabs": [
              {
                "position": 324,
                "deletePosition": 0,
                "tabJustification": "List",
                "tabLeader": "None"
              }
            ]
          },
          "followCharacter": "Tab",
          "listLevelPattern": "Arabic",
          "numberFormat": "%9.",
          "restartLevel": 8,
          "startAt": 1
        }
      ]
    }
  ],
  "comments": [],
  "revisions": [],
  "customXml": [],
  "footnotes": {
    "separator": [
      {
        "paragraphFormat": {
          "styleName": "Normal",
          "listFormat": {}
        },
        "characterFormat": {},
        "inlines": [
          {
            "characterFormat": {},
            "text": "\u0003"
          }
        ]
      }
    ],
    "continuationSeparator": [
      {
        "paragraphFormat": {
          "styleName": "Normal",
          "listFormat": {}
        },
        "characterFormat": {},
        "inlines": [
          {
            "characterFormat": {},
            "text": "\u0004"
          }
        ]
      }
    ],
    "continuationNotice": [
      {
        "paragraphFormat": {
          "listFormat": {}
        },
        "characterFormat": {},
        "inlines": []
      }
    ]
  },
  "endnotes": {
    "separator": [
      {
        "paragraphFormat": {
          "styleName": "Normal",
          "listFormat": {}
        },
        "characterFormat": {},
        "inlines": [
          {
            "characterFormat": {},
            "text": "\u0003"
          }
        ]
      }
    ],
    "continuationSeparator": [
      {
        "paragraphFormat": {
          "styleName": "Normal",
          "listFormat": {}
        },
        "characterFormat": {},
        "inlines": [
          {
            "characterFormat": {},
            "text": "\u0004"
          }
        ]
      }
    ],
    "continuationNotice": [
      {
        "paragraphFormat": {
          "listFormat": {}
        },
        "characterFormat": {},
        "inlines": []
      }
    ]
  }
};
describe('Check box with character style and paragraph character validation', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    let ele: HTMLElement = createElement('div', { id: 'container' });
    // ele.setAttribute("style", "width: 1000px");
    document.body.appendChild(ele);
    DocumentEditor.Inject(Selection, Editor)
    editor = new DocumentEditor({ isReadOnly: false, enableEditor: true });
    (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.width = '1000px';
    editor.appendTo('#container');
  });
  afterAll((done) => {
    editor.destroy();
    document.body.removeChild(document.getElementById('container'));
    editor = undefined;
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  // it('Checkbox with character style validation', () => {
  //   editor.open(JSON.stringify(checkboxWithStyle));
  //   expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0].characterFormat.fontSize).toBe(9.6);
  // });
  // it('Checkbox with paragraph character format validation', () => {
  //   editor.open(JSON.stringify(checkboxWithStyle));
  //   expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).childWidgets[0] as LineWidget).children[0].characterFormat.fontSize).toBe(9.6);
  // });
});

let splitTable: any = { "sections": [{ "sectionFormat": { "pageWidth": 841.9000244140625, "pageHeight": 595.2999877929688, "leftMargin": 49.650001525878906, "rightMargin": 20, "topMargin": 50, "bottomMargin": 20, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "styleName": "MyStyle", "listFormat": {} }, "characterFormat": { "fontColor": "empty" }, "inlines": [{ "characterFormat": { "fontColor": "empty" }, "text": "Part  3" }, { "characterFormat": { "fontColor": "empty" }, "text": "        Technical Compliance " }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontColor": "empty" }, "inlines": [] }, { "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Sr." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Description" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 6, "lineSpacing": 1.1999999284744263, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "TLG" }, { "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": " Compliance " }, { "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "(Yes/ No)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 35.20000076293945, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": true, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "1" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "beforeSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Vintage of Equipment" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": The equipment should be of the latest manufacture with full defined life available. The " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "year of manufacture should be clearly mentioned." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 37.5, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 9, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "2" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Deliverables" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": The list of deliverable for development of VR training facility is as follows:" }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [] }, { "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Sr." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 36.70000076293945, "preferredWidthType": "Point", "cellWidth": 36.70000076293945, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Item" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 389.79998779296875, "preferredWidthType": "Point", "cellWidth": 389.79998779296875, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Type" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 92.1500015258789, "preferredWidthType": "Point", "cellWidth": 92.1500015258789, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Qty." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 79.55000305175781, "preferredWidthType": "Point", "cellWidth": 79.55000305175781, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 3 }], "rowFormat": { "height": 22.700000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(a)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 36.70000076293945, "preferredWidthType": "Point", "cellWidth": 36.70000076293945, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "leftIndent": 2.8499999046325684, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "MPP Emulator of Equipment Space Software (loaded on VR device)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 389.79998779296875, "preferredWidthType": "Point", "cellWidth": 389.79998779296875, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Software" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 92.1500015258789, "preferredWidthType": "Point", "cellWidth": 92.1500015258789, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "01" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 79.55000305175781, "preferredWidthType": "Point", "cellWidth": 79.55000305175781, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 3 }], "rowFormat": { "height": 22.700000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(b)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 36.70000076293945, "preferredWidthType": "Point", "cellWidth": 36.70000076293945, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "leftIndent": 2.8499999046325684, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Instructor Console and Server" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 389.79998779296875, "preferredWidthType": "Point", "cellWidth": 389.79998779296875, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Hardware" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 92.1500015258789, "preferredWidthType": "Point", "cellWidth": 92.1500015258789, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "01" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 79.55000305175781, "preferredWidthType": "Point", "cellWidth": 79.55000305175781, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 3 }], "rowFormat": { "height": 22.700000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(c)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 36.70000076293945, "preferredWidthType": "Point", "cellWidth": 36.70000076293945, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "leftIndent": 2.8499999046325684, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "VR Device (Headset, Controller)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 389.79998779296875, "preferredWidthType": "Point", "cellWidth": 389.79998779296875, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Hardware" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 92.1500015258789, "preferredWidthType": "Point", "cellWidth": 92.1500015258789, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "03" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 79.55000305175781, "preferredWidthType": "Point", "cellWidth": 79.55000305175781, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 3 }], "rowFormat": { "height": 22.700000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(d)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 36.70000076293945, "preferredWidthType": "Point", "cellWidth": 36.70000076293945, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "leftIndent": 2.8499999046325684, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "LED/ LCD Screen - 65”" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 389.79998779296875, "preferredWidthType": "Point", "cellWidth": 389.79998779296875, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Hardware" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 92.1500015258789, "preferredWidthType": "Point", "cellWidth": 92.1500015258789, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "01" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 79.55000305175781, "preferredWidthType": "Point", "cellWidth": 79.55000305175781, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 3 }], "rowFormat": { "height": 22.700000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(e)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 36.70000076293945, "preferredWidthType": "Point", "cellWidth": 36.70000076293945, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "leftIndent": 2.8499999046325684, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "VR suit akin to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Holo" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": " suit or having equivalent functionality" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 389.79998779296875, "preferredWidthType": "Point", "cellWidth": 389.79998779296875, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Hardware" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 92.1500015258789, "preferredWidthType": "Point", "cellWidth": 92.1500015258789, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "01" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 79.55000305175781, "preferredWidthType": "Point", "cellWidth": 79.55000305175781, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 3 }], "rowFormat": { "height": 22.700000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(f)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 36.70000076293945, "preferredWidthType": "Point", "cellWidth": 36.70000076293945, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "leftIndent": 2.8499999046325684, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Comprehensive warranty" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 389.79998779296875, "preferredWidthType": "Point", "cellWidth": 389.79998779296875, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Service" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 92.1500015258789, "preferredWidthType": "Point", "cellWidth": 92.1500015258789, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "01 Year" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 79.55000305175781, "preferredWidthType": "Point", "cellWidth": 79.55000305175781, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 3 }], "rowFormat": { "height": 22.700000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(g)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 36.70000076293945, "preferredWidthType": "Point", "cellWidth": 36.70000076293945, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "leftIndent": 2.8499999046325684, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Comprehensive AMC" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 389.79998779296875, "preferredWidthType": "Point", "cellWidth": 389.79998779296875, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Service" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 92.1500015258789, "preferredWidthType": "Point", "cellWidth": 92.1500015258789, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "03 Years" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 79.55000305175781, "preferredWidthType": "Point", "cellWidth": 79.55000305175781, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 3 }], "rowFormat": { "height": 22.700000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "gridBefore": 0, "gridAfter": 0 } }], "grid": [36.70000076293945, 389.79998779296875, 92.1500015258789, 79.55000305175781], "tableFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "shading": {}, "leftIndent": 0, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 5.4, "leftMargin": 5.4, "bottomMargin": 0, "preferredWidthType": "Auto", "bidi": false, "allowAutoFit": true }, "description": null, "title": null, "columnCount": 4 }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 231.89999389648438, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 6, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "3" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 30, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Scope of Work" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": The VR training facility should provide the means for following:" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes " }] }, { "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [] }, { "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [] }, { "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [] }, { "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 30, "verticalAlignment": "Top" }, "columnIndex": 2 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 34, "firstLineIndent": -34, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(a) Managing training sessions by creating new or by using predefined and stored training scenarios" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 34, "firstLineIndent": -34, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(b) Editing/ modifying training scenarios prior to and during training session" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 19.850000381469727, "firstLineIndent": -19.850000381469727, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(c) Insert or delete events, accidental events or modify environmental parameters prior to or during training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "session" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 34.29999923706055, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 19.850000381469727, "firstLineIndent": -19.850000381469727, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(d) Capture and load a snapshot of the trainee view" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 19.850000381469727, "firstLineIndent": -19.850000381469727, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(e) Execute training scenarios for the following:" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 34.849998474121094, "firstLineIndent": -17.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 6, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Evolutions " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "during " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Reactor " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "operation" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 4, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Sampling " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "primary " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "water" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 4, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Transfer " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "HP " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Gas" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 4, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Isolation " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "primary " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "loop " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "in " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "case " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "leaks" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 34.849998474121094, "firstLineIndent": -17.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 6, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Evolutions " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "prior " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Start-up " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Reactor" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 3, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Checklisting" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": " of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "valves" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 3, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Venting " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Primary " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Loop" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 3, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Venting " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Control " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Rod " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Drive " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Mechanisms" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 3, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Preparation " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Emergency " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Cooling " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Down " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "System " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "for " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "operation" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 3, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Inspection " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Automatic " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Safety " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Devices" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 34.849998474121094, "firstLineIndent": -17.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 6, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Evolutions " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "during " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Emergencies" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 1, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Actions " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "by " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Radiation " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Emergency " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Team" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 1, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Actions " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "by " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Decontamination " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Team" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 1, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Actions " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "in " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "case " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "HP " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Gas " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "leak " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "in " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Equipment " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Space" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 1, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Actions " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "in " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "case " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Loss " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Coolant " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Accident " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(LOCA)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 34.849998474121094, "firstLineIndent": -17.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 6, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Evolutions " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "during " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Maintenance" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 0, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Manual " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "operation " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "valves" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 0, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Pressure " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "testing " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Primary " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "loop" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 0, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Charging " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "HP " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Gas " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "from " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "shore" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 0, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Replacement " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "3K " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "inventory" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 19.850000381469727, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(f) " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "See " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "screens " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "observe " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "trainees " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "actions " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "operate " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "local " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "commands " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "on " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "simulated " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "installations." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 19.850000381469727, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(g) " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "View " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "current " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "session " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "stop " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "session " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "for " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "safety " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "or " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "pedagogical " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "reasons" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 19.850000381469727, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(h) " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Watch " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "hear " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "current " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "session " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "by " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "video/ " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "audio " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "means " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(with " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "an " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "option " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "mute) " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "for " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "evaluation " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "safety " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "purpose" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 37.5, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 19.850000381469727, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 5, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Recording " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "for " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "100 " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "hours " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "re-play " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(with " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "options " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "skip " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "a " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "specific " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "or " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "controllable " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "speeds/ " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "time) " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "evaluation " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "sessions " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "manage " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "recorded " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "sessions." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }], "rowFormat": { "height": 40.5, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 6, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "4" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Justify", "beforeSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Acceptance " }, { "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Criteria" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "The " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "VR " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "facility " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "will " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "be " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "accepted " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "based " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "on " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "approved " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "User " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Acceptance " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Criteria " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "as " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "promulgated " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "by " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "INS " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Satavahana" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "/ " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "SAUW. " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "These " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "may " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "include " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Factory " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Acceptance " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Trials " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(FATs) " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "at " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "OEMs " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "premises, " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Setting " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Work " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(STW) " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Commissioning " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "for " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "all " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "performance " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "parameters " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "system. " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "User " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "acceptance " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "criteria " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "for " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "all " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "performance " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "parameters " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "are " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "be " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "mutually " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "decided " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "between " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "OEM " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "user " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "{INS " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Satavahana" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "/ " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "SAUW}. " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "The " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "seller " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "is " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "submit " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Acceptance " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Test " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Procedure " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "for " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "VR " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "facility " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "within " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "30 " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "days " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "signing " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "contract. " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "After " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "commissioning " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "VR " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "facility " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "at " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "INS " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Satavahana" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "/ " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "SAUW, " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "acceptance " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "test " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "will " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "be " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "carried " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "out " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "as " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "per " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "mutually " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "agreed " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Test " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "document. " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "These " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "acceptance " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "tests " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "like " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "STW " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "& " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Functional " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Checks " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "will " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "be " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "carried " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "out " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "jointly " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "by " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Seller " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Buyer " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "representatives." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 165.4499969482422, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 6, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "5" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "beforeSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Requirement of Installation/ Commissioning" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": The SUPPLIER at his expense will cater for Commissioning of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "VR Training facility at INS " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Satavahana" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "/ SAUW including electrical and civil works." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 36, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 6, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "6" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "beforeSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Factory Acceptance Trials (FATs)" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": FATs will be done on the VR Training facility GUI software / hardware at " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "OEM premises as per the approved Acceptance Test Procedure." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 36.75, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 12, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "7" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "beforeSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Documentation" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": Softcopy and hard copy (03 sets) of documentation should be sufficient for training of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "operators and maintenance staff is to be supplied by the SELLER. Documentation to be supplied by the Seller is " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "tabulated below:" }] }, { "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Sr." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 43.79999923706055, "preferredWidthType": "Point", "cellWidth": 100.2738284741211, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Document Details" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 191.35000610351562, "preferredWidthType": "Point", "cellWidth": 445.4070422070313, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Qty." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 63.79999923706055, "preferredWidthType": "Point", "cellWidth": 147.6039084741211, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 19.850000381469727, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(a)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 43.79999923706055, "preferredWidthType": "Point", "cellWidth": 100.2738284741211, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "QMP Document" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 191.35000610351562, "preferredWidthType": "Point", "cellWidth": 445.4070422070313, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "01" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 63.79999923706055, "preferredWidthType": "Point", "cellWidth": 147.6039084741211, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 19.850000381469727, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(b)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 43.79999923706055, "preferredWidthType": "Point", "cellWidth": 100.2738284741211, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "MPP User Manual" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 191.35000610351562, "preferredWidthType": "Point", "cellWidth": 445.4070422070313, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "01" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 63.79999923706055, "preferredWidthType": "Point", "cellWidth": 147.6039084741211, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 19.850000381469727, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(c)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 43.79999923706055, "preferredWidthType": "Point", "cellWidth": 100.2738284741211, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Acceptance test plan" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 191.35000610351562, "preferredWidthType": "Point", "cellWidth": 445.4070422070313, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "01" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 63.79999923706055, "preferredWidthType": "Point", "cellWidth": 147.6039084741211, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 19.850000381469727, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "gridBefore": 0, "gridAfter": 0 } }], "grid": [100.2738284741211, 445.4070422070313, 147.6039084741211], "tableFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "shading": {}, "leftIndent": 0, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 5.4, "leftMargin": 5.4, "bottomMargin": 0, "preferredWidthType": "Auto", "bidi": false, "allowAutoFit": true }, "description": null, "title": null, "columnCount": 3 }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 45.45000076293945, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "8" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Justify", "beforeSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Training" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "The " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "place " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "(OEM " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "or " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "customer's " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "premises) " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "duration " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "will " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "be " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "mutually " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "agreed. " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Detailed " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "draft " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "schedule " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "shall " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "be " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "prepared " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "by " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Supplier " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "for " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "this " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "purpose " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "approved " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "by " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Customer. " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "The " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "material " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "shall " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "also " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "be " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "provided " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "by " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Supplier. " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "The " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "shall " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "be " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "divided " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "into " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "batches " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "with " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "date " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "start " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "each " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "batch, " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "duration " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "etc, " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "as " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "will " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "be " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "agreed " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "upon " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "by " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Seller " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Buyer " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "subject " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "overall " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "schedule. " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Details " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "programme " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "recommended " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "by " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Seller " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "shall " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "be " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "provided " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "as " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "an " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "annexure " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "proposal. " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "is " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "be " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "imparted " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "IN " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "personnel " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "for " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "operation, " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "exploitation " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "maintenance." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 105, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "9" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "beforeSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Product Support" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": The Supplier shall provide product support in terms of maintenance activities, repairs and " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "spares for a period of 10 years. On expiry of the said mandatory period or at any stage, the Supplier shall notify " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the Customer prior to closing the production line so as to enable Life Time Buy of spares. The said aspect would " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "also form an integral part of the contract." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 68.25, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "10" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "beforeSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Comprehensive Warranty" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "01 year" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": " comprehensive warranty for all equipment is to be provided from the date of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Installation & Commissioning (I&C) of the VR Training facility. Adequate spares are to be stocked by the Seller in " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "India in order to ensure the minimum down time during the warranty. Seller is to furnish details accordingly." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 54.75, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "11" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "beforeSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Comprehensive AMC" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": Three years comprehensive AMC, post expiry of warranty period, should be provided at " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the expense of the SUPPLIER." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 24.200000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "12" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "beforeSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Monitoring of Projects/ Pre Site Inspection" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": After placement of order the Buyer at his own expense may " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "depute to the site of installation at quarterly (or as considered necessary) intervals, teams of representatives to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "review and coordinate the progress of the commitments made by both the sides under the contract." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 54.75, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "13" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "beforeSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Secrecy" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": It is emphasized that the information provided in the RFP and its enclosures is to be treated with " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Confidentiality and access to information be restricted to only a select few personnel associated directly with the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Project. No copies of the RFP and its enclosures will be made." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 51.75, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 6, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "14" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 3, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "beforeSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Evaluation of the Seller" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": The seller will be evaluated on the following criteria:" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 19.850000381469727, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 6, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 2, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "The " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "seller " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "should " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "be " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "from " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "a " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "security " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "cleared " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "firm " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "by " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Indian " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Navy " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "because " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "seller " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "will " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "have " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "an " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "access " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "sensitive " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "data " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "pertaining " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "to " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "systems " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "for " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "VR " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Training " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "facility." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 40.29999923706055, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 19.850000381469727, "firstLineIndent": -19.850000381469727, "textAlignment": "Justify", "beforeSpacing": 6, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": { "listId": 2, "listLevelNumber": 0 } }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "The " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "seller " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "should " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "have " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "prior " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "work " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "experience " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "on " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "projects " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Indian " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Navy/ " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "HQATVP." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 24.950000762939453, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "15" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 42.599998474121094, "preferredWidthType": "Point", "cellWidth": 42.5999997597706, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "beforeSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Arial", "underline": "Single", "fontColor": "empty", "boldBidi": true, "fontFamilyBidi": "Arial" }, "text": "Scope of Civil works" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": ": All Civil works towards successful installation and commissioning of VR Training facility at " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "SAUW, INS " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Satavahana" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": " is to be undertaken by the SUPPLIER. The cost of this civil works is to be borne by the " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "SUPPLIER." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": { "backgroundColor": "empty", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 609.5, "preferredWidthType": "Point", "cellWidth": 609.500018394446, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 3, "lineSpacing": 1.3000000715255737, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Yes" }] }, { "paragraphFormat": { "textAlignment": "Center", "lineSpacing": 1.3000000715255737, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "Scope as per " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "para 3(e) of " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "enclosure to Staff " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "officer SMS " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "438/VR dated " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "text": "08-Mar-21." }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 106.30000305175781, "preferredWidthType": "Point", "cellWidth": 106.30000625984586, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 45, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0 } }], "grid": [42.5999997597706, 609.500018394446, 106.30000625984586], "tableFormat": { "borders": { "top": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "leftIndent": -8.800000190734863, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 5.4, "leftMargin": 5.4, "bottomMargin": 0, "preferredWidth": 758.4000244140625, "preferredWidthType": "Point", "bidi": false, "allowAutoFit": true }, "description": null, "title": null, "columnCount": 3 }, { "paragraphFormat": { "leftIndent": 21.600000381469727, "textAlignment": "Justify", "beforeSpacing": 2, "afterSpacing": 2, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontColor": "empty", "fontFamilyBidi": "Arial" }, "inlines": [] }, { "paragraphFormat": { "firstLineIndent": 7.099999904632568, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontColor": "empty" }, "inlines": [] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "beforeSpacing": 8, "afterSpacing": 8, "lineSpacing": 0.6666666865348816, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {}, "tabs": [{ "position": 523, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": { "fontColor": "empty" }, "inlines": [{ "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "E03210081/T" }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "\t" }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "    " }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "\t" }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "\t" }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "\t" }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "\t" }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "TLG" }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": " " }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "CORP" }] }, { "paragraphFormat": { "beforeSpacing": 8, "afterSpacing": 8, "lineSpacing": 0.6666666865348816, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {}, "tabs": [{ "position": 523, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": { "fontColor": "empty" }, "inlines": [{ "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "30 APRIL 2021 " }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "\t" }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "\t" }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "\t" }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "\t" }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "\t" }, { "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "TECHNICAL BID" }] }, { "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 8, "afterSpacing": 8, "lineSpacing": 0.6666666865348816, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {}, "tabs": [{ "position": 523, "deletePosition": 0, "tabJustification": "Center", "tabLeader": "None" }] }, "characterFormat": { "fontColor": "empty" }, "inlines": [{ "characterFormat": { "fontColor": "empty" }, "text": "Part  3" }, { "characterFormat": { "fontColor": "empty" }, "text": "        Technical Compliance " }] }] }, "footer": { "blocks": [{ "paragraphFormat": { "beforeSpacing": 8, "afterSpacing": 8, "lineSpacing": 0.6666666865348816, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {}, "tabs": [{ "position": 523, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": { "fontColor": "empty" }, "inlines": [{ "characterFormat": { "bold": true, "fontColor": "empty", "boldBidi": true }, "text": "COMMERCIAL IN CONFIDENCE " }] }, { "paragraphFormat": { "textAlignment": "Right", "styleName": "Normal", "listFormat": {}, "tabs": [{ "position": 523, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": { "fontColor": "empty" }, "inlines": [{ "characterFormat": { "fontColor": "empty" }, "text": "Page " }, { "characterFormat": { "fontColor": "empty" }, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": { "fontColor": "empty" }, "text": "PAGE 1" }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "fontColor": "empty" }, "text": "7" }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": { "fontColor": "empty" }, "text": " of " }, { "characterFormat": { "fontColor": "empty" }, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": { "fontColor": "empty" }, "text": "NUMPAGES 1" }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "fontColor": "empty" }, "text": "7" }, { "characterFormat": {}, "fieldType": 1 }] }] }, "evenHeader": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenFooter": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "firstPageHeader": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "firstPageFooter": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] } } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "empty", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "trackChanges": false, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "dontUseHTMLParagraphAutoSpacing": false, "formFieldShading": true, "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Times New Roman", "fontColor": "empty", "fontSizeBidi": 12, "fontFamilyBidi": "Times New Roman" }, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 12, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": { "fontColor": "empty" } }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 2, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 2, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontSizeBidi": 12, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 2, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 2, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 2, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "MyStyle", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontSize": 14, "fontFamily": "Verdana", "fontColor": "empty", "fontSizeBidi": 14, "fontFamilyBidi": "Verdana" }, "basedOn": "Normal", "next": "MyStyle" }, { "name": "Header", "type": "Paragraph", "paragraphFormat": { "listFormat": {}, "tabs": [{ "position": 225.64999389648438, "deletePosition": 0, "tabJustification": "Center", "tabLeader": "None" }, { "position": 451.29998779296875, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": { "fontColor": "empty" }, "basedOn": "Normal", "link": "Header Char", "next": "Header" }, { "name": "Header Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Times New Roman", "fontColor": "empty", "fontSizeBidi": 12, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Default Paragraph Font" }, { "name": "Footer", "type": "Paragraph", "paragraphFormat": { "listFormat": {}, "tabs": [{ "position": 225.64999389648438, "deletePosition": 0, "tabJustification": "Center", "tabLeader": "None" }, { "position": 451.29998779296875, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": { "fontColor": "empty" }, "basedOn": "Normal", "link": "Footer Char", "next": "Footer" }, { "name": "Footer Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Times New Roman", "fontColor": "empty", "fontSizeBidi": 12, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Default Paragraph Font" }], "lists": [{ "abstractListId": 0, "levelOverrides": [], "listId": 0 }, { "abstractListId": 1, "levelOverrides": [], "listId": 1 }, { "abstractListId": 2, "levelOverrides": [], "listId": 2 }, { "abstractListId": 3, "levelOverrides": [], "listId": 3 }, { "abstractListId": 4, "levelOverrides": [], "listId": 4 }, { "abstractListId": 5, "levelOverrides": [], "listId": 5 }, { "abstractListId": 6, "levelOverrides": [], "listId": 6 }], "abstractLists": [{ "abstractListId": 0, "levels": [{ "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 54, "firstLineIndent": -36, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "(%1)", "restartLevel": 0, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%9.", "restartLevel": 8, "startAt": 1 }] }, { "abstractListId": 1, "levels": [{ "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 54, "firstLineIndent": -36, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "(%1)", "restartLevel": 0, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%9.", "restartLevel": 8, "startAt": 1 }] }, { "abstractListId": 2, "levels": [{ "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 54, "firstLineIndent": -36, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "(%1)", "restartLevel": 0, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%9.", "restartLevel": 8, "startAt": 1 }] }, { "abstractListId": 3, "levels": [{ "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 54, "firstLineIndent": -36, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "(%1)", "restartLevel": 0, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%9.", "restartLevel": 8, "startAt": 1 }] }, { "abstractListId": 4, "levels": [{ "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 54, "firstLineIndent": -36, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "(%1)", "restartLevel": 0, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%9.", "restartLevel": 8, "startAt": 1 }] }, { "abstractListId": 5, "levels": [{ "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 54, "firstLineIndent": -36, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "(%1)", "restartLevel": 0, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%9.", "restartLevel": 8, "startAt": 1 }] }, { "abstractListId": 6, "levels": [{ "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "(%1)", "restartLevel": 0, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": { "fontColor": "empty" }, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%9.", "restartLevel": 8, "startAt": 1 }] }], "comments": [], "revisions": [], "customXml": [], "footnotes": { "separator": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontColor": "empty" }, "inlines": [{ "characterFormat": { "fontColor": "empty" }, "text": "\u0003" }] }], "continuationSeparator": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontColor": "empty" }, "inlines": [{ "characterFormat": { "fontColor": "empty" }, "text": "\u0004" }] }], "continuationNotice": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "endnotes": { "separator": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontColor": "empty" }, "inlines": [{ "characterFormat": { "fontColor": "empty" }, "text": "\u0003" }] }], "continuationSeparator": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontColor": "empty" }, "inlines": [{ "characterFormat": { "fontColor": "empty" }, "text": "\u0004" }] }], "continuationNotice": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] } };
describe('Editing cases on splitted tables', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    let ele: HTMLElement = createElement('div', { id: 'container' });
    // ele.setAttribute("style", "width: 1000px");
    document.body.appendChild(ele);
    DocumentEditor.Inject(Selection, Editor)
    editor = new DocumentEditor({ isReadOnly: false, enableEditor: true });
    (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.width = '1000px';
    editor.appendTo('#container');
  });
  afterAll((done) => {
    editor.destroy();
    document.body.removeChild(document.getElementById('container'));
    editor = undefined;
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  // it('Validation on table splitting when removing row affected by row spanned cells ', () => {
  //   editor.open(splitTable);
  //   for (let i: number = 0; i < 6; i++) {
  //     editor.selection.moveDown();
  //   }
  //   editor.selection.handleRightKey();
  //   editor.selection.handleRightKey();
  //   editor.selection.handleDownKey();
  //   editor.editor.handleBackKey();
  //   expect(editor.documentHelper.pages.length).toBe(7);
  // });  
  // it('Validate selection when removing row affected by row spanned cells ', () => {    
  //   editor.selection.handleDownKey();
  //   editor.selection.handleShiftEndKey();
  //   editor.editor.handleBackKey();
  //   expect(editor.selection.start.paragraph.associatedCell.index).toBe(0);
  // });  
});


let doc5: any = {
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
            "listFormat": {}
          },
          "characterFormat": {
            "fontColor": "empty"
          },
          "inlines": [
            {
              "characterFormat": {},
              "shapeId": 1,
              "name": "Straight Connector 1",
              "visible": true,
              "width": 957,
              "height": 0,
              "widthScale": 100,
              "heightScale": 100,
              "verticalPosition": 23.5,
              "verticalOrigin": "Paragraph",
              "verticalAlignment": "None",
              "verticalRelativePercent": -3.4028235E38,
              "horizontalPosition": -7,
              "horizontalOrigin": "Column",
              "horizontalAlignment": "None",
              "horizontalRelativePercent": -3.4028235E38,
              "zOrderPosition": 251659264,
              "allowOverlap": true,
              "textWrappingStyle": "InFrontOfText",
              "textWrappingType": "Both",
              "distanceBottom": 0,
              "distanceLeft": 9,
              "distanceRight": 9,
              "distanceTop": 0,
              "layoutInCell": true,
              "lockAnchor": false,
              "autoShapeType": "StraightConnector",
              "fillFormat": {
                "color": "#FFFFFFFF",
                "fill": true
              },
              "lineFormat": {
                "color": "#4472C4FF",
                "weight": 0.5,
                "lineStyle": "Solid",
                "line": true
              },
              "textFrame": {
                "textVerticalAlignment": "Top",
                "leftMargin": 5.31525,
                "rightMargin": 5.31525,
                "topMargin": 2.76375,
                "bottomMargin": 2.76375,
                "blocks": [
                  {
                    "paragraphFormat": {
                      "listFormat": {}
                    },
                    "characterFormat": {},
                    "inlines": []
                  }
                ]
              }
            },
            {
              "characterFormat": {
                "fontColor": "empty"
              },
              "text": "Syncfusion"
            },
            {
              "characterFormat": {
                "fontColor": "empty"
              },
              "text": " Arun kumar "
            },
            {
              "characterFormat": {},
              "shapeId": 1,
              "name": "Straight Connector 1",
              "visible": true,
              "width": 957,
              "height": 0,
              "widthScale": 100,
              "heightScale": 100,
              "verticalPosition": 23.5,
              "verticalOrigin": "Paragraph",
              "verticalAlignment": "None",
              "verticalRelativePercent": -3.4028235E38,
              "horizontalPosition": -7,
              "horizontalOrigin": "Column",
              "horizontalAlignment": "None",
              "horizontalRelativePercent": -3.4028235E38,
              "zOrderPosition": 251659264,
              "allowOverlap": true,
              "textWrappingStyle": "InFrontOfText",
              "textWrappingType": "Both",
              "distanceBottom": 0,
              "distanceLeft": 9,
              "distanceRight": 9,
              "distanceTop": 0,
              "layoutInCell": true,
              "lockAnchor": false,
              "autoShapeType": "StraightConnector",
              "fillFormat": {
                "color": "#FFFFFFFF",
                "fill": true
              },
              "lineFormat": {
                "color": "#4472C4FF",
                "weight": 0.5,
                "lineStyle": "Solid",
                "line": true
              },
              "textFrame": {
                "textVerticalAlignment": "Top",
                "leftMargin": 5.31525,
                "rightMargin": 5.31525,
                "topMargin": 2.76375,
                "bottomMargin": 2.76375,
                "blocks": [
                  {
                    "paragraphFormat": {
                      "listFormat": {}
                    },
                    "characterFormat": {},
                    "inlines": []
                  }
                ]
              }
            }
          ]
        },
        {
          "rows": [
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            },
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            },
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            },
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            },
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            }
          ],
          "grid": [
            116.85,
            116.85
          ],
          "tableFormat": {
            "borders": {
              "top": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "left": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "right": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "bottom": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "diagonalDown": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0
              },
              "diagonalUp": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0
              },
              "horizontal": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "vertical": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              }
            },
            "shading": {},
            "leftIndent": 0,
            "tableAlignment": "Left",
            "topMargin": 0,
            "rightMargin": 5.4,
            "leftMargin": 5.4,
            "bottomMargin": 0,
            "preferredWidthType": "Auto",
            "bidi": false,
            "allowAutoFit": true
          },
          "description": null,
          "title": null,
          "columnCount": 2,
          "wrapTextAround": true,
          "positioning": {
            "allowOverlap": false,
            "distanceBottom": 0,
            "distanceLeft": 9.35,
            "distanceRight": 9.35,
            "distanceTop": 0,
            "verticalAlignment": "Bottom",
            "verticalOrigin": "Page",
            "verticalPosition": -12,
            "horizontalAlignment": "Right",
            "horizontalOrigin": "Page",
            "horizontalPosition": -8
          }
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {}
          },
          "characterFormat": {
            "fontColor": "empty"
          },
          "inlines": [
            {
              "characterFormat": {
                "fontColor": "empty"
              },
              "text": "End of the document"
            }
          ]
        }
      ],
      "headersFooters": {
        "header": {
          "blocks": [
            {
              "paragraphFormat": {
                "listFormat": {}
              },
              "characterFormat": {},
              "inlines": []
            }
          ]
        },
        "footer": {
          "blocks": [
            {
              "paragraphFormat": {
                "listFormat": {}
              },
              "characterFormat": {},
              "inlines": []
            }
          ]
        },
        "evenHeader": {
          "blocks": [
            {
              "paragraphFormat": {
                "listFormat": {}
              },
              "characterFormat": {},
              "inlines": []
            }
          ]
        },
        "evenFooter": {
          "blocks": [
            {
              "paragraphFormat": {
                "listFormat": {}
              },
              "characterFormat": {},
              "inlines": []
            }
          ]
        },
        "firstPageHeader": {
          "blocks": [
            {
              "paragraphFormat": {
                "listFormat": {}
              },
              "characterFormat": {},
              "inlines": []
            }
          ]
        },
        "firstPageFooter": {
          "blocks": [
            {
              "paragraphFormat": {
                "listFormat": {}
              },
              "characterFormat": {},
              "inlines": []
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
    "fontColor": "empty",
    "boldBidi": false,
    "italicBidi": false,
    "fontSizeBidi": 11,
    "fontFamilyBidi": "Calibri",
    "allCaps": false
  },
  "paragraphFormat": {
    "leftIndent": 0,
    "rightIndent": 0,
    "firstLineIndent": 0,
    "textAlignment": "Left",
    "beforeSpacing": 0,
    "afterSpacing": 8,
    "lineSpacing": 1.0791667,
    "lineSpacingType": "Multiple",
    "listFormat": {},
    "bidi": false
  },
  "defaultTabWidth": 36,
  "trackChanges": false,
  "enforcement": false,
  "hashValue": "",
  "saltValue": "",
  "formatting": false,
  "protectionType": "NoProtection",
  "dontUseHTMLParagraphAutoSpacing": false,
  "formFieldShading": true,
  "compatibilityMode": "Word2013",
  "styles": [
    {
      "name": "Normal",
      "type": "Paragraph",
      "paragraphFormat": {
        "listFormat": {}
      },
      "characterFormat": {
        "fontColor": "empty"
      },
      "next": "Normal"
    },
    {
      "name": "Default Paragraph Font",
      "type": "Character",
      "characterFormat": {
        "fontColor": "empty"
      }
    },
    {
      "name": "Placeholder Text",
      "type": "Character",
      "characterFormat": {
        "fontColor": "#808080FF"
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
        "lineSpacing": 1.0791667,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level1",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 16,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496",
        "fontSizeBidi": 16,
        "fontFamilyBidi": "Calibri Light"
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
        "fontColor": "#2F5496",
        "fontSizeBidi": 16,
        "fontFamilyBidi": "Calibri Light"
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
        "lineSpacing": 1.0791667,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level2",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 13,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496",
        "fontSizeBidi": 13,
        "fontFamilyBidi": "Calibri Light"
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
        "fontColor": "#2F5496",
        "fontSizeBidi": 13,
        "fontFamilyBidi": "Calibri Light"
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
        "lineSpacing": 1.0791667,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level3",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763",
        "fontSizeBidi": 12,
        "fontFamilyBidi": "Calibri Light"
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
        "fontColor": "#1F3763",
        "fontSizeBidi": 12,
        "fontFamilyBidi": "Calibri Light"
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
        "lineSpacing": 1.0791667,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level4",
        "listFormat": {}
      },
      "characterFormat": {
        "italic": true,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496",
        "italicBidi": true,
        "fontFamilyBidi": "Calibri Light"
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
        "fontColor": "#2F5496",
        "italicBidi": true,
        "fontFamilyBidi": "Calibri Light"
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
        "lineSpacing": 1.0791667,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level5",
        "listFormat": {}
      },
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496",
        "fontFamilyBidi": "Calibri Light"
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
        "fontColor": "#2F5496",
        "fontFamilyBidi": "Calibri Light"
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
        "lineSpacing": 1.0791667,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level6",
        "listFormat": {}
      },
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763",
        "fontFamilyBidi": "Calibri Light"
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
        "fontColor": "#1F3763",
        "fontFamilyBidi": "Calibri Light"
      },
      "basedOn": "Default Paragraph Font"
    }
  ],
  "lists": [],
  "abstractLists": [],
  "comments": [],
  "revisions": [],
  "customXml": [],
  "footnotes": {
    "separator": [
      {
        "paragraphFormat": {
          "styleName": "Normal",
          "listFormat": {}
        },
        "characterFormat": {
          "fontColor": "empty"
        },
        "inlines": [
          {
            "characterFormat": {
              "fontColor": "empty"
            },
            "text": "\u0003"
          }
        ]
      }
    ],
    "continuationSeparator": [
      {
        "paragraphFormat": {
          "styleName": "Normal",
          "listFormat": {}
        },
        "characterFormat": {
          "fontColor": "empty"
        },
        "inlines": [
          {
            "characterFormat": {
              "fontColor": "empty"
            },
            "text": "\u0004"
          }
        ]
      }
    ],
    "continuationNotice": [
      {
        "paragraphFormat": {
          "listFormat": {}
        },
        "characterFormat": {},
        "inlines": []
      }
    ]
  },
  "endnotes": {
    "separator": [
      {
        "paragraphFormat": {
          "styleName": "Normal",
          "listFormat": {}
        },
        "characterFormat": {
          "fontColor": "empty"
        },
        "inlines": [
          {
            "characterFormat": {
              "fontColor": "empty"
            },
            "text": "\u0003"
          }
        ]
      }
    ],
    "continuationSeparator": [
      {
        "paragraphFormat": {
          "styleName": "Normal",
          "listFormat": {}
        },
        "characterFormat": {
          "fontColor": "empty"
        },
        "inlines": [
          {
            "characterFormat": {
              "fontColor": "empty"
            },
            "text": "\u0004"
          }
        ]
      }
    ],
    "continuationNotice": [
      {
        "paragraphFormat": {
          "listFormat": {}
        },
        "characterFormat": {},
        "inlines": []
      }
    ]
  }
};
describe('horizontal right', () => {
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
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('weblayout horizontal right', () => {
    editor.open(JSON.stringify(doc5));
    let table: TableWidget = editor.documentHelper.pages[0].bodyWidgets[0].floatingElements[2] as TableWidget;
    let tableWidth: number = table.getTableCellWidth();
    let x = editor.documentHelper.viewer.clientArea.width - tableWidth;
    let y = editor.documentHelper.pages[0].bodyWidgets[0].floatingElements[2].x;
    expect(x).toEqual(y);
  });
});


describe('Left horizontal', () => {
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
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('weblayout left horizontal', () => {
    editor.open(JSON.stringify(doc6));
    let x = editor.documentHelper.viewer.clientArea.x;
    let y = editor.documentHelper.pages[0].bodyWidgets[0].floatingElements[0].x;
    expect(x).toEqual(y);
  });
});

let doc6: any = {
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
            "beforeSpacing": 18,
            "afterSpacing": 30,
            "styleName": "Heading 1",
            "listFormat": {}
          },
          "characterFormat": {
            "fontSize": 18,
            "fontFamily": "Calibri",
            "fontSizeBidi": 18,
            "fontFamilyBidi": "Calibri"
          },
          "inlines": [
            {
              "characterFormat": {
                "fontSize": 18,
                "fontFamily": "Calibri",
                "fontSizeBidi": 18,
                "fontFamilyBidi": "Calibri"
              },
              "text": "Adventure Works Cycles"
            }
          ]
        },
        {
          "rows": [
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            },
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            },
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontColor": "empty"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            }
          ],
          "grid": [
            116.85,
            116.85
          ],
          "tableFormat": {
            "borders": {
              "top": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "left": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "right": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "bottom": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "diagonalDown": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0
              },
              "diagonalUp": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0
              },
              "horizontal": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "vertical": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              }
            },
            "shading": {},
            "leftIndent": 0,
            "tableAlignment": "Left",
            "topMargin": 0,
            "rightMargin": 5.4,
            "leftMargin": 5.4,
            "bottomMargin": 0,
            "preferredWidthType": "Auto",
            "bidi": false,
            "allowAutoFit": true
          },
          "description": null,
          "title": null,
          "columnCount": 2,
          "wrapTextAround": true,
          "positioning": {
            "allowOverlap": false,
            "distanceBottom": 0,
            "distanceLeft": 9.35,
            "distanceRight": 9.35,
            "distanceTop": 0,
            "verticalAlignment": "Center",
            "verticalOrigin": "Page",
            "verticalPosition": -8,
            "horizontalAlignment": "Center",
            "horizontalOrigin": "Margin",
            "horizontalPosition": -4
          }
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {}
          },
          "characterFormat": {
            "fontColor": "empty"
          },
          "inlines": []
        },
        {
          "paragraphFormat": {
            "firstLineIndent": 36,
            "afterSpacing": 6,
            "styleName": "Normal",
            "listFormat": {}
          },
          "characterFormat": {
            "fontSize": 12,
            "fontColor": "empty",
            "fontSizeBidi": 12
          },
          "inlines": [
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "Adventure Works Cycles, the fictitious company on which the Adventure Works "
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "sample databases are based, is a large, multinational manufacturing company. The company "
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "manufactures and sells metal and composite bicycles to North American, "
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "European"
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": " and Asian "
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "commercial markets. While its base operation "
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "is located in"
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": " Bothell, Washington with 290 employees, several regional sales teams are located "
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "throughout their market base"
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "."
            }
          ]
        },
        {
          "paragraphFormat": {
            "firstLineIndent": 36,
            "afterSpacing": 6,
            "styleName": "Normal",
            "listFormat": {}
          },
          "characterFormat": {
            "fontSize": 12,
            "fontColor": "empty",
            "fontSizeBidi": 12
          },
          "inlines": [
            {
              "characterFormat": {},
              "shapeId": 1,
              "name": "Text Box 5",
              "visible": true,
              "width": 99.36,
              "height": 38.16,
              "widthScale": 100,
              "heightScale": 100,
              "verticalPosition": -55.5,
              "verticalOrigin": "Paragraph",
              "verticalAlignment": "None",
              "verticalRelativePercent": -3.4028235E38,
              "horizontalPosition": 0,
              "horizontalOrigin": "Margin",
              "horizontalAlignment": "Center",
              "horizontalRelativePercent": -3.4028235E38,
              "zOrderPosition": 251659264,
              "allowOverlap": true,
              "textWrappingStyle": "Square",
              "textWrappingType": "Both",
              "distanceBottom": 0,
              "distanceLeft": 9,
              "distanceRight": 9,
              "distanceTop": 0,
              "layoutInCell": true,
              "lockAnchor": false,
              "autoShapeType": "Rectangle",
              "fillFormat": {
                "color": "#FFFFFFFF",
                "fill": true
              },
              "lineFormat": {
                "lineFormatType": "Solid",
                "color": "#000000FF",
                "weight": 1,
                "lineStyle": "Solid",
                "line": true
              },
              "textFrame": {
                "textVerticalAlignment": "Top",
                "leftMargin": 1.70858,
                "rightMargin": 1.70858,
                "topMargin": 0.85429,
                "bottomMargin": 0.85429,
                "blocks": [
                  {
                    "paragraphFormat": {
                      "styleName": "Normal",
                      "listFormat": {}
                    },
                    "characterFormat": {
                      "fontColor": "empty"
                    },
                    "inlines": []
                  }
                ]
              }
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "In 2000, Adventure Works Cycles bought a small "
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "manufacturing plant, "
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "Importadores"
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": " Neptuno, located in "
            },
            {
              "characterFormat": {},
              "shapeId": 1,
              "name": "Text Box 5",
              "visible": true,
              "width": 99.36,
              "height": 38.16,
              "widthScale": 100,
              "heightScale": 100,
              "verticalPosition": -55.5,
              "verticalOrigin": "Paragraph",
              "verticalAlignment": "None",
              "verticalRelativePercent": -3.4028235E38,
              "horizontalPosition": 0,
              "horizontalOrigin": "Margin",
              "horizontalAlignment": "Center",
              "horizontalRelativePercent": -3.4028235E38,
              "zOrderPosition": 251659264,
              "allowOverlap": true,
              "textWrappingStyle": "Square",
              "textWrappingType": "Both",
              "distanceBottom": 0,
              "distanceLeft": 9,
              "distanceRight": 9,
              "distanceTop": 0,
              "layoutInCell": true,
              "lockAnchor": false,
              "autoShapeType": "Rectangle",
              "fillFormat": {
                "color": "#FFFFFFFF",
                "fill": true
              },
              "lineFormat": {
                "lineFormatType": "Solid",
                "color": "#000000FF",
                "weight": 1,
                "lineStyle": "Solid",
                "line": true
              },
              "textFrame": {
                "textVerticalAlignment": "Top",
                "leftMargin": 1.70858,
                "rightMargin": 1.70858,
                "topMargin": 0.85429,
                "bottomMargin": 0.85429,
                "blocks": [
                  {
                    "paragraphFormat": {
                      "styleName": "Normal",
                      "listFormat": {}
                    },
                    "characterFormat": {
                      "fontColor": "empty"
                    },
                    "inlines": []
                  }
                ]
              }
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "Mexico. Import adores Neptuno manufactures several "
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "critical subcomponents for the Adventure Works Cycles "
            },
            {
              "characterFormat": {},
              "shapeId": 1,
              "name": "Text Box 5",
              "visible": true,
              "width": 99.36,
              "height": 38.16,
              "widthScale": 100,
              "heightScale": 100,
              "verticalPosition": -55.5,
              "verticalOrigin": "Paragraph",
              "verticalAlignment": "None",
              "verticalRelativePercent": -3.4028235E38,
              "horizontalPosition": 0,
              "horizontalOrigin": "Margin",
              "horizontalAlignment": "Center",
              "horizontalRelativePercent": -3.4028235E38,
              "zOrderPosition": 251659264,
              "allowOverlap": true,
              "textWrappingStyle": "Square",
              "textWrappingType": "Both",
              "distanceBottom": 0,
              "distanceLeft": 9,
              "distanceRight": 9,
              "distanceTop": 0,
              "layoutInCell": true,
              "lockAnchor": false,
              "autoShapeType": "Rectangle",
              "fillFormat": {
                "color": "#FFFFFFFF",
                "fill": true
              },
              "lineFormat": {
                "lineFormatType": "Solid",
                "color": "#000000FF",
                "weight": 1,
                "lineStyle": "Solid",
                "line": true
              },
              "textFrame": {
                "textVerticalAlignment": "Top",
                "leftMargin": 1.70858,
                "rightMargin": 1.70858,
                "topMargin": 0.85429,
                "bottomMargin": 0.85429,
                "blocks": [
                  {
                    "paragraphFormat": {
                      "styleName": "Normal",
                      "listFormat": {}
                    },
                    "characterFormat": {
                      "fontColor": "empty"
                    },
                    "inlines": []
                  }
                ]
              }
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "product line. These subcomponents are shipped to the "
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "Bothell location for final product assembly. In 2001, "
            },
            {
              "characterFormat": {},
              "shapeId": 1,
              "name": "Text Box 5",
              "visible": true,
              "width": 99.36,
              "height": 38.16,
              "widthScale": 100,
              "heightScale": 100,
              "verticalPosition": -55.5,
              "verticalOrigin": "Paragraph",
              "verticalAlignment": "None",
              "verticalRelativePercent": -3.4028235E38,
              "horizontalPosition": 0,
              "horizontalOrigin": "Margin",
              "horizontalAlignment": "Center",
              "horizontalRelativePercent": -3.4028235E38,
              "zOrderPosition": 251659264,
              "allowOverlap": true,
              "textWrappingStyle": "Square",
              "textWrappingType": "Both",
              "distanceBottom": 0,
              "distanceLeft": 9,
              "distanceRight": 9,
              "distanceTop": 0,
              "layoutInCell": true,
              "lockAnchor": false,
              "autoShapeType": "Rectangle",
              "fillFormat": {
                "color": "#FFFFFFFF",
                "fill": true
              },
              "lineFormat": {
                "lineFormatType": "Solid",
                "color": "#000000FF",
                "weight": 1,
                "lineStyle": "Solid",
                "line": true
              },
              "textFrame": {
                "textVerticalAlignment": "Top",
                "leftMargin": 1.70858,
                "rightMargin": 1.70858,
                "topMargin": 0.85429,
                "bottomMargin": 0.85429,
                "blocks": [
                  {
                    "paragraphFormat": {
                      "styleName": "Normal",
                      "listFormat": {}
                    },
                    "characterFormat": {
                      "fontColor": "empty"
                    },
                    "inlines": []
                  }
                ]
              }
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": "Importadores"
            },
            {
              "characterFormat": {
                "fontSize": 12,
                "fontColor": "empty",
                "fontSizeBidi": 12
              },
              "text": " Neptuno, became the sole manufacturer and distributor of the touring bicycle product group."
            },
            {
              "characterFormat": {},
              "shapeId": 1,
              "name": "Text Box 5",
              "visible": true,
              "width": 99.36,
              "height": 38.16,
              "widthScale": 100,
              "heightScale": 100,
              "verticalPosition": -55.5,
              "verticalOrigin": "Paragraph",
              "verticalAlignment": "None",
              "verticalRelativePercent": -3.4028235E38,
              "horizontalPosition": 0,
              "horizontalOrigin": "Margin",
              "horizontalAlignment": "Center",
              "horizontalRelativePercent": -3.4028235E38,
              "zOrderPosition": 251659264,
              "allowOverlap": true,
              "textWrappingStyle": "Square",
              "textWrappingType": "Both",
              "distanceBottom": 0,
              "distanceLeft": 9,
              "distanceRight": 9,
              "distanceTop": 0,
              "layoutInCell": true,
              "lockAnchor": false,
              "autoShapeType": "Rectangle",
              "fillFormat": {
                "color": "#FFFFFFFF",
                "fill": true
              },
              "lineFormat": {
                "lineFormatType": "Solid",
                "color": "#000000FF",
                "weight": 1,
                "lineStyle": "Solid",
                "line": true
              },
              "textFrame": {
                "textVerticalAlignment": "Top",
                "leftMargin": 1.70858,
                "rightMargin": 1.70858,
                "topMargin": 0.85429,
                "bottomMargin": 0.85429,
                "blocks": [
                  {
                    "paragraphFormat": {
                      "styleName": "Normal",
                      "listFormat": {}
                    },
                    "characterFormat": {
                      "fontColor": "empty"
                    },
                    "inlines": []
                  }
                ]
              }
            }
          ]
        },
        {
          "rows": [
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "afterSpacing": 6,
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "afterSpacing": 6,
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            },
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "afterSpacing": 6,
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "afterSpacing": 6,
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            },
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "afterSpacing": 6,
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "afterSpacing": 6,
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            },
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "afterSpacing": 6,
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "afterSpacing": 6,
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {},
                    "preferredWidth": 116.85,
                    "preferredWidthType": "Point",
                    "cellWidth": 116.85,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            }
          ],
          "grid": [
            116.85,
            116.85
          ],
          "tableFormat": {
            "borders": {
              "top": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "left": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "right": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "bottom": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "diagonalDown": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0
              },
              "diagonalUp": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0
              },
              "horizontal": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "vertical": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              }
            },
            "shading": {},
            "leftIndent": 0,
            "tableAlignment": "Left",
            "topMargin": 0,
            "rightMargin": 5.4,
            "leftMargin": 5.4,
            "bottomMargin": 0,
            "preferredWidthType": "Auto",
            "bidi": false,
            "allowAutoFit": true
          },
          "description": null,
          "title": null,
          "columnCount": 2,
          "wrapTextAround": true,
          "positioning": {
            "allowOverlap": false,
            "distanceBottom": 0,
            "distanceLeft": 9.35,
            "distanceRight": 9.35,
            "distanceTop": 0,
            "verticalAlignment": "Top",
            "verticalOrigin": "Margin",
            "verticalPosition": -4,
            "horizontalAlignment": "Left",
            "horizontalOrigin": "Page",
            "horizontalPosition": 0
          }
        },
        {
          "paragraphFormat": {
            "firstLineIndent": 36,
            "afterSpacing": 6,
            "styleName": "Normal",
            "listFormat": {}
          },
          "characterFormat": {
            "fontSize": 12,
            "fontColor": "empty",
            "fontSizeBidi": 12
          },
          "inlines": []
        },
        {
          "paragraphFormat": {
            "styleName": "Heading 1",
            "listFormat": {}
          },
          "characterFormat": {
            "fontFamily": "Calibri",
            "fontFamilyBidi": "Calibri"
          },
          "inlines": [
            {
              "characterFormat": {
                "fontFamily": "Calibri",
                "fontFamilyBidi": "Calibri"
              },
              "text": "Product Overview"
            }
          ]
        },
        {
          "rows": [
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "textAlignment": "Center",
                        "beforeSpacing": 6,
                        "afterSpacing": 0,
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": [
                        {
                          "characterFormat": {},
                          "imageString": "data:image/gif;base64,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",
                          "isMetaFile": false,
                          "width": 142.2,
                          "height": 88.28252,
                          "iscrop": false,
                          "name": "Picture 2",
                          "visible": true,
                          "widthScale": 79,
                          "heightScale": 79.000015,
                          "verticalPosition": 0,
                          "verticalOrigin": "Margin",
                          "verticalAlignment": "None",
                          "horizontalPosition": 0,
                          "horizontalOrigin": "Margin",
                          "horizontalAlignment": "None",
                          "allowOverlap": true,
                          "textWrappingStyle": "Inline",
                          "textWrappingType": "Both",
                          "layoutInCell": true,
                          "zOrderPosition": 2147483647
                        }
                      ]
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {
                      "backgroundColor": "empty",
                      "foregroundColor": "empty",
                      "textureStyle": "TextureNone"
                    },
                    "preferredWidth": 234,
                    "preferredWidthType": "Point",
                    "cellWidth": 234,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "beforeSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Heading 1",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontFamily": "Calibri",
                        "fontFamilyBidi": "Calibri"
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontFamily": "Calibri",
                            "fontFamilyBidi": "Calibri"
                          },
                          "text": "Mountain-200"
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontSize": 12,
                            "fontColor": "empty",
                            "fontSizeBidi": 12
                          },
                          "text": "Product No: BK-M68B-38"
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontSize": 12,
                            "fontColor": "empty",
                            "fontSizeBidi": 12
                          },
                          "text": "Size: 38"
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontSize": 12,
                            "fontColor": "empty",
                            "fontSizeBidi": 12
                          },
                          "text": "Weight: 25"
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontSize": 12,
                            "fontColor": "empty",
                            "fontSizeBidi": 12
                          },
                          "text": "Price: $2,294.99"
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {
                      "backgroundColor": "empty",
                      "foregroundColor": "empty",
                      "textureStyle": "TextureNone"
                    },
                    "preferredWidth": 234,
                    "preferredWidthType": "Point",
                    "cellWidth": 234,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            },
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "beforeSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Heading 1",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontFamily": "Calibri",
                        "fontFamilyBidi": "Calibri"
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontFamily": "Calibri",
                            "fontFamilyBidi": "Calibri"
                          },
                          "text": "Mountain-300 "
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontSize": 12,
                            "fontColor": "empty",
                            "fontSizeBidi": 12
                          },
                          "text": "Product No: BK-M47B-38"
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontSize": 12,
                            "fontColor": "empty",
                            "fontSizeBidi": 12
                          },
                          "text": "Size: 35"
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontSize": 12,
                            "fontColor": "empty",
                            "fontSizeBidi": 12
                          },
                          "text": "Weight: 22"
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontSize": 12,
                            "fontColor": "empty",
                            "fontSizeBidi": 12
                          },
                          "text": "Price: $1,079.99"
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {
                      "backgroundColor": "empty",
                      "foregroundColor": "empty",
                      "textureStyle": "TextureNone"
                    },
                    "preferredWidth": 234,
                    "preferredWidthType": "Point",
                    "cellWidth": 234,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "textAlignment": "Center",
                        "beforeSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Heading 1",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontFamily": "Calibri",
                        "fontFamilyBidi": "Calibri"
                      },
                      "inlines": [
                        {
                          "characterFormat": {},
                          "imageString": "data:image/gif;base64,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",
                          "isMetaFile": false,
                          "width": 135,
                          "height": 83.81252,
                          "iscrop": false,
                          "name": "Picture 3",
                          "visible": true,
                          "widthScale": 75,
                          "heightScale": 75.000015,
                          "verticalPosition": 0,
                          "verticalOrigin": "Margin",
                          "verticalAlignment": "None",
                          "horizontalPosition": 0,
                          "horizontalOrigin": "Margin",
                          "horizontalAlignment": "None",
                          "allowOverlap": true,
                          "textWrappingStyle": "Inline",
                          "textWrappingType": "Both",
                          "layoutInCell": true,
                          "zOrderPosition": 2147483647
                        }
                      ]
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {
                      "backgroundColor": "empty",
                      "foregroundColor": "empty",
                      "textureStyle": "TextureNone"
                    },
                    "preferredWidth": 234,
                    "preferredWidthType": "Point",
                    "cellWidth": 234,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            },
            {
              "cells": [
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "textAlignment": "Center",
                        "beforeSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Heading 1",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontFamily": "Calibri",
                        "fontFamilyBidi": "Calibri"
                      },
                      "inlines": [
                        {
                          "characterFormat": {},
                          "imageString": "data:image/gif;base64,R0lGODlh8ACVAPcAAERFScrK+NTk8Ovs/tTPDtPT/uLj/tjX6Nzd/vLz88XI26Smqfn1j4SFiFNVWpSbq7jEzZiZnPbrAPTucG+ay3Z6hPn6+j1CSfr7/Ts8QYuq0e3w+lhaYHZ3eerr7WVlafP0ycfH7Zqjsc7NjfLrULm7x+/nLvf5/NHRrNPOLXSNrSxlmdvd36mssKupjeLaB2hnEtHOTNLPabbQ4uHi43mDjSYmKtLT1YmKkUlKT+3spuzt8F1haHqBP8vMzk1yrImGaJNua7KyMry9v7SwEWZqc+Pk6c3R1sPEy8DCxO3jAvv9+/b3/zI0OTk5Pq6wtfX2+P39+gkKC+/w/73Is9PU9quoQ8K9LlNrkpeYSrGzs97f49LU3TIxNU5QVXFuRdzc9C5NZPn53uLi9pCTmLKxbvr69ry91D8/RNfa3CorL+jp636BEq2QiLK0v8C/wqS2w5OVKWFdZG5yesy3seTfSKasw+fo/1mJujQ4Pcfb5SwxNbe6vcbIywtTev3zAby6Vwo7bOzjGPHy+N7ZJru7mc/O18La8Z+gmVVsQ/Tr5eLlzNbZ/X5+gWZ8psPDXqy/1rCusd/u9fP1/tXY1vj3+vPpFURajJWVhp+foyQ0bT08Bu/u9Q42T+LeY+jn6vHg2XtVVBcYGu/w8OLgjcDA5M/P6tzdtUdHLZi+zllKYdnLwvb49SEiJfL2+XakxHd3ZMnIzsXIxfz7/y4uNMzLxbu+t5KJhYWfwa+prf36+tjU1DY2Os/P+woYS25uctjY/qKeDvf39pm44Ofj5Nzb2dfX28jExYiOiLi2urW4to+Ok/vxHV51XcfCExwcI6ShcVpFSlpUTKe2nJ6y1GpqaitceNbZ7zgyNejo8y8sLE5TGfTz+ejo+9fX9iVCU+zu4M7P0QkgZOXn5h4dHvv9/f3///3//f39//v///v9//39/f///fv//Pn9/f/9//n9//n//Pj////9/PLz/uLfdj06Op/G5USEoTU8KWuDui5HgoebarW0t/////z+/iH5BAAAAAAALAAAAADwAJUAAAj/AP8JHEiwoMGDCAv6W8iwocOHDs0VLIfB3UB/5sqVc4cBQ7mEIEOKHEmypMmTKFOqVAmxpcuFEglqxPAPg7kdafzV1Liyp8+fQIMKFfqyaMOYAykqNWeBjBxK5nT+4+hxqNWrWLNqRWi0a0FzURvSAKCmwxAWFnTSpLm1rdu3cEF2LYr0H1gLxoaE84GjkYM5czp46eDDJoYldeMqXsz459yXBKPu6uDAho1WoqR4+ZCjUQcnNhqkTdy4tOnTXB9DVIgpGjZy5OxJ69C5QwYHHKrJ4dVgDWnUwIMvVv0QKdhw2shx6FABWxc09jjcajAnhxo0y8lY+C28u/erxB1G/z7R71cmbp/I0PICQA72Pk84OCH3awcUtt/z6ycanqFBfxicQMkCHYjShTbYYCMHB2o4kUw4CWC034QUrtRfQwZFlQANSVSTQyuyfUgOGjssVCFPGwlkkUz/fFRhhReK9xVDN3ghBzaz5aDFCS/aJRBYMcr4I1hEFklkj0EFedRE5Sy0zAcXkDFOAzdkNCFY77yjJETvEOkVko5tyVBdFizhDwsc1IAHBAu0kAB3qAEppphghjknTC22aOYyOeCBhywLjCOVd3LeqWSdPhmKIUX/+PMJGh/gAUcLyZjoYpyKzoloT5mOWc4SaWXSSg0q+IXDJxnxZFpYnR66KUutLv9EkT+jAIBGDU0A8AEfAKpaGquxLoQOca/CGqw5ZkaiRgMcYJNDJDr52hiwsTJFbLEoBevQKDg40AAaz6Jz6araxohttuUuFMsyDnTwQQdbzGIBfr+m29+5Jxmp7778gmVXkQL5M04sLmRRgQPLZOJBqphGZFym1LaEb2NVyYTBLAf08IIzBxNW007CsRqZXV2Z484JrmwgyRpbcAEBFxh+OTFqGp3QgjN/OANLA1L6Y0F+ETNUjiuSCKDHITNAksrSuKiADz5YWGNNGBk0sUcg1kgypswzn+ZPC9qw8YcEztRyH1vjBoeRJDOk8goe+Kwg99R+1O3HN3lYvcc3eDv/YU8GF3wThh+BzHBt16Y1+USubLwgAQr+LEFT2nFGdQg+dXeieRhhfNOEE4ELfkHggYeBxuiDB6J655AcjvhiHyE2jRDWfPMFES5E+9G40g7njyQrBOKHNXhEMEQau2QinxNonI7G4HaP/nzdWETw4CCuvz7cGo04k4g1OBRBg1qTe2Q+vXGx+kogr8ygxwasopMGDgA44QTg3/jB+TcXQPfNK3rwQJPupb2sUG4g5nAFH+YQByKEAQsigMKYBKIRRpWmIRqAAAZcso5YNCAHzctAGC4AgM6h4RuBwAVMLlRAxvgDAjzgBz+cwbkSFIdhpsFIRk7QlQRsYQ5NeF4Y/6xxtzx0wg+p0CELW3iVcpwAfQGzQw8I0AxnxMEBxHgJnN4CEyNhpCUnwIIaUKg51QViBTOQB8m6GDCuMVEoHTmIPyiQiBdkoQdxUMFckLK7Fl0Kio5Zh78Q2CiIhBEADtAfFl6RihloTSL+QeBc3mgVF/1MIVQIAxG8xwaYqUYm44rjUKwkR4iYgxNGGEIHGtAILeEpLHUJWiQpiZWPYMAC5YiJPw5whW9MsQdCGMOFkFIxOwGJO7LEyBoy0QA5LCMieIoMZGh5FY+4SJT+cIMQ2HABIrChHlvy1wFNkswurqONLfnEFhrRAC8YQWIzcgk1q6mUmeTSHBGABQEScf87Z4hhTlscySTXCBELuKwDgYFnPBU6z6BQBG008ccOXKACIXiPAEQAp6JiMs4M7fEiLTHCEbTglyGY8iD9GmRDtdIkOKQAGd8IhjOUoARn6KBTFJzJRCQ5UII+xAeUiEA1PhChh6z0O+bYAD+UcIUw5MMZEpDAC1Jghlb5q3wu+kg5jYrOh6yhH2logAMicNKjdscfaRDCH/4ghGY4Lqov8ESXgoVS1SBFYtkYAg4qwIESFceswdGIOVBAgKhKoLCGlQAhQBCTrSopVeFpbEuEsYMWVOADOGhJQAHL0qloRB3ocAEBaCqBsSVWCZ4wQ54Kaa89Fuohn6AEKx0QDs3/clYxKKpIOSywDkTwYBpXGG1iDSsIBpxDHWVibWuDhIEjIAGhv3DJZm8rFKW4ox1RYIc/0CEHKeRhDllwxluHawIdCGQJWl1ukNbQB1VyQAvSpS5cNDILd5hBF2s4ghF+oQ0piCIHcSDAeBNb3Cg8TL396UMaIlAEDowivvJ1S0dm0Q5W9IMHzQhCEBDRGinA4AUCHm5UBTEBMUgTwaoZxBOSwKxM/DXCimHKErKRhQATAQjLaAQPnsEBcIAgBsIdrhImoNo+/gjFRslGOFbphQdHBMbzdYfkshkHJRDgD2zYjBek4IBK+AMcQFaCiC2hA3SoY7UgRTJEoOCBJ+g4/7MvhrJb3KERfzQgGDRVwjaeUY0OSIEXa8DIOMIsYhOIgaMnVrNDjMCFvnihtnGW81bo7A8awOIFNCVCJxrBAQ60ghefiNw/FpGCAUdVCXU4NOUU7RALhOMIjfhFNdISaUlnxSJUloCY2fCNW5ABGY2IwINBpQ5Sm1rXqa6rdB3bn4iNow9v6MB7bWvrknQ0Ie4wxywaANXS5qMCxVjDKNyhuyUsQR2nKLWIUa1qH+kyvuUqRzb4QJ0P0LrWQ6mg9ip4mCX8w9xGPshu21GCHoj5D8GwRlWjGRkMkCLIp021RMrkb58+uVzC+EQEOO3iowCsJOYO+U76uDt7AhJbFf/7lMh327uoBIwFcui2BLbxCnaADKXweLiYhUyIdldcucUpFw3CerDxYUglIv+3kSu4dO1Z82dHEiQo/QFUhmTiC1HN2TcE4I929K7h9cC0iAkQAwP7itmtWgcSbtCIDzSCqynpiEcy4nKPs6hrrzXHmee129dSIgf0yQQOqhGMrLMBCzz8yIoQYg4xeOLYViaFhBSC4h2EAwlzcIAP4I4SYP3jBAlIwChGEXqPDIvhxQLWhgC1gAZ0oO0dcBfPjBeOUWTiF8iohhM+cOmxKYENKtTIEuIRknKAoA6QJ8BNPYrgIywgAh/4wGpKonofDGEBjWhENTrtgO5zIDDIiMT/8YQxwQwBJ7eHaRFMdpAEZrKHF2qghRrUoA1t2EANlrkMLZrghSLgIBbJoEpWYFhK0AN6IBU/BxLmAAKEAHlXQAk+Y0sfgWDCsAUNgAMfcAw69HEEIXKSI1j+UA5r4APY5wAAwAtOwAu0IAcAAAC/4AQ5AABdkAM5kAd5AAA80AELcANOBhYVZAE/o28Uo3K5tF3j0AK/4AX3N3+0gIJdwAtQmAEpiAYZgAZ7wAtokBwfEAFOsBwp8Adi9gL8wAQ5dXKRYQ460IDD9QcE8AUDEIK+ol7CkAYVsEomEhIUp3QLsQNIwC7YQYM8gB0dgAY84AVo4ADgkgO58gEcEIgZ/8ADKfgBZIAEG4QsQCgQHpGAcXFLc2cOCdAHc4AGlmE/aOAE9eMAKagN9mA1edAFTbB/TdAFTtAENhAJH9AFGQANlqAEmBYMcAAga3FtBHEOOhBip5Yzl3APnMAO88JT9mIMC3BZ0EJBCbFbU9Eo5UADT/ABGYBIj+gAGQBCGeAFsziLKKiKvNAEF2CKvAA4LggA+1cNCxBoqWJPjVFx/uABC4CKNpCOusILHNA8TdgEBEkLe/CK2kB/8acGXfBpfHAZDhADUoVpPWA4vWJBImEOUaADKUAAgiABKVAPLkANbmAHO3AO6OWMJYN2DrEFEGAEmQAYoYZmCDEr5cACEf/gBXngBV5Ag7OYAV1AC674OVD4hE6QN3mQgthgD+2YAeMIKRyQjhyQCe8Eh8KoFVEBBZmwGzaQA+PoBc8BhbRgkE2QNwRplk2QAXkghWVpA7+wDKLQCj1gCWQTBzAQBl6AA4IiEVeZFKMmA4QgATFgBz+gAaVwCXbACefQDonmFSzJEEnwAGH1AS4WcAgxLOOAAzlwARyQA15wAVYDhXvwhFXDCzZolntwkGUZiwRpNZ8zgxwAAHMAADYwlSXCl3BxGBFVCXxQDQyZA4hogg4Af7CYB3ugBlYzf6lpGQxJkHtwg0/gAFKgBlbAhj2wB1IQBgnpAAsgQXkihAq4CIT/kAKwoACHcA+aoAn6gAsPJi1op5JFsQQlYAc+ABgsEILuIA9K4UflIAy45Ikt8AE86ZloIH9peT9VkzdqUDXzF5Rj6YpdkJpqsJap2ZplOTq/IIpeoAVedgKsoFNa4Z9NQgkVAH+8AABeUIWoCJTGuQf35wRewAONgANk8ACZEAFksAwNUAFFkAOioAYLIAegcQUSoGlScIW4qIIf8AZRQRPJFRLIQgooAAQlcAh4IA54QAE/wAO7MHlpVhSNyUFH8ABkgANzEAFr4AGnlxEYIC6HsR1QkAScdgGM6ATxh4u2An+WkQc5IKPIEAELsABPoAUtsACZQAax5gBeOaFo/5mUOfALLXiCH9AHGMGJfZkSTgQgmeCV9qOoKaqWNoh/tMABDdACfXADRyALQ9ACmYAIiBABmdACykAFHTAqyJAPDtAFOGMFAAALt+AFTfiEspgJElQzJMEOygADMWALGqACFIAHl+ALuIAEl4QfMvMYnOACQoAJiPAFkSACXlABCmAEnDAsuvAOEbUDmYCInZkBxymLzdMFNjCDc4AIyqAMhLoAZFCmfYEMy0AGsfoEfMAHJTiWyGk/VYgG7EGLAJAJEVJMWOEPFniisek8OokGtMgLW9gHLECC0taTOFgN0iANQ4UG0gAEX4AKsiAHz2AD9vCR1QALJDACaMCQsv/oBEL5Aff5daA0JJ7gDCkwDcOgDz/gC46ABZowA2lBL+UkEY85CoXlDARwBQegAAoACdSgAiqgAdTwALGwEDdQDZsRgwaasLTQlQ2wAElgC4hwC8sAq7mQCfR5DIhQC7EQAThwqKxEBlogC/QGlsyTASh4Og4AiWrwAYFmhj4RFWnAAwt6iIFIhRirDQCAAwr2BsxiIzjwIC1TAJOgCIrgD5VQDJ+gAI3QBrkAAPYgBdigBDGQA9DADD1AC9gQi13whAXKAbFAk4khLRYwARuDAhrwA/uAB77wAz+gAjz0H5r1mExwChJAl5YACC6wDDfADsTgAUZwAHYwQkOQBAL/ypM42yClOH8OkAlv8ARkcAu/kAuUsANt6g8nAAwncF/+QA8F4GVL4AGU8AQVUA3LwAfh0ALVgAZYKIUX0H0AAJQcsHmXOhL15A9DAJbAiQYtSEIZoAYAEAEssGCd+ZYH0BDCIAwDMAAGZg484g8iQAsfUA02oAULIA1KYAUcQAjM8AU20IROEJRNwAu42w8YQRGgAqVM4AlKQAinUAUasA/7QAHigAW4MD7UeGRKggFI8AiWYAKCQAiPcAVWgAkLgAYNsBCV8AYq4AggxIJ2esBq0AocsABIkAmNQAZDQAzeYAAYkQ7pYA7cUACuYAbswA4DEAA2QTJT4A2xQCBz/5AJ4aAF3IgNVAg4MZjBaIAEQexHPpHCfNA8nrnAJ3qCGYADW7AF9DOVWYQABlDI/5AAwjAF3aBdFKFdPIADlECbclANQGAJXxAHf2AFr2od7Xi7XbCW7bgAiHFLuFSNuTQKdXDEIwAHGkAB6enEuHAC23FzWxIOTxADJlAHJkAA0zANIAYNjdAEchBoCTAEIuAIF3C77YixGhwBSdB6C2AM5OcPYNALPDJ3fcwN2SXIAbAdG2EOwIDHtPIGsdYCxtACHEALCduNJgij/YAs6HVJFlIOmdCCPNBpThmDh+sDNIADGTCpTWIO73ANhGwlCcAKrnwOOmEB7DAIHIAEb/+QGfaADdCQAjnwAkIAnJEgp12woOkIhe1IC2TQKOkHEvOiDuBgAlbmCQpAAVigD/ugCa+gD62zn1QsSMSxDk9gC3VAAhPADM6gAqVABcwgAYDQAKqbCQvQChnQALgQBs/wHGogCrxwfTiwDCUwLEyxDoN8AuZAE3zsuexgDgAt0BRRAGNwDtsBILHQwi2wBZmQAbQQyT3Zf07QAhhh0SoBFi3wHIXYBDxAg2WZCWvQArqiBYFWE7NQDpwQAFPgtCs9BQaAkofhD1xwATQwFsuwDB2wC3cmAV/QAMugDR0QDptqA/aDgveTgstwS8LIKAtoAoclA0gwAz8gDsS7D5D/MAMn4G8q9ZgMQQMLgAJ1MAETYALQEAQV8ANUsItX4Fs2AAAXgCAdgAtYYANSQA5eoA3ySAzv4A3AwHRTEAD0MNh20ceTMBXnMMg0EQ/lgL+v3CI2wQ5G4AZFUAMekAZyYAPNY4oOcAG0oA0LEIKenS0tYA9osH0p2II24AVJYAQdAAAtkBZ9sAWpggFQEAAGkCoJYAa2HQXoZSbZQMv/0ACxsC65gHXOkAPv5APSkAP9AL42UIXt+M5NcOI/UpOTIxAgYAIgRgp2QA3Pqg+OsA8/MAmD/Z9f6hX+gAT9MALpPQF18AZYIA77MAxwUA+8GAMNQOLP8AytoA1zwM79/90ItdWmsd0NTjsIIXAHVlLYDb4ED57S1zUABcAE52A+6FAJwHAHCeAUxlAODbCgC6yw1WAPNmBSKjGBRwCPMeqUFtwK1cAyOVANHhCC/+ABb5AA+kbg5/ARrmABtr0O6IUBD47Hx1ANkXAM2CAFm/AHcTAHGRGCy9CwPtAIyFmKtM4LF2BSSoFelIMi/6ADYk4I9VAIGjADAvADmuAI+kANCoAEQxAhFqdFdnECCyALnjABDMAAnlAM+6AKjZClw1AIV0YIyMADoiAK/D0bjiCjD4AFIawRKE2Gu1UFCHAOA8HgHn/pAt0OBtALS9AO6IUOFoAACDBAQ8ABJvUEav9woqboIeTgBDfA64rLIk2CJuPYgsyDBq3QAEzQB7yAA+ogEXN3A7LgR+cwBr0wCf5W7LYdExtkAAbADrGwoblggkQgCNIg7udwBwaQDOTQAEdABq4YySk4jsbgM3kIEuWgDugOYleACRBAARpwCCuApY5QAXngYq8FYY3CAi2A3gHPACMwCnqgpaFwCRpwD50QDGwIBIAvBVJQ403gCEcrAvtQAhlRCb2AAP+2BATubiBvFxCOiQgADOcQD4wZBWAADFAwxP5gCBvsD3xgP6neiDy26xqR4jVpJgnwCxr8Aakuis/0BLyACJNQAFPgdfOCAUmg4zQxCAEwAOdgDlD/YOw/fhGh7tI0EAkPUNVZQAhfwAnmcA7dwNi6YAy5fgMR0IT1Q+tOwAOhBoQpWY3mABCsSAl6QQBQgwcCKFB45UiVvkscEhjB4M/iRYz+/m3k6I9PvxGeGDAghUKdv2GXnvnCpQGLKBgvlFhZlkMKuS4filzS42PZJQUWswUY8G8JmCqTzP0zx63ApHP/2A0IgGEpE0bd/LnDwK5br0lLlmDAUE6Ygjk4/CXhlQEALwccujxr9K8c2XIc9e79Z8FCA145vHhxggZAKzL+MqG54c+CgQIn7JZzl0DWqH9kexnI68rCFARLy5Uz1+vOkiijcjnSJI5fHLX/NvTqlsCc/78E1eTcyMSLFwAnTtryaqDRL9+9ef+NqiehIKBMNTQMoKYKC4VDPhrkypjRnPKOCVrUqjeSJKXbo/ZdqnDpxzUHvmJKcIZpDq9+nMJwiCDCjqMtzMHgHG96kWyDAKZYqqmnopqqqu8m6WWQ7/wZpJcBzhGrHAuEGcCAQRroYBY+eEEDjd944ICWBfzBIDPk+PJHmeA44MAtAGwoLpMMWPDnBHQqAQYY0kbzhwUfXjQHKdI8A000C2YpYIpz/LnBDn1W+KEQaY7wh54CxjDDRQtc1O2ICJwAAA0nMnATjX78WcKCJWLcaDSmmHMuhREWiICaHy6BRIAknJDije4sEv/tRb38SaMFFEQaaYQdjBRAH018ceQVFXjJg4gXnAOihhYiKEITKXi4hAs5zVgCigAQOAcDosxxh0GoSKMqL3Om6IUJc4LcrJ12xsKAlW6AAdacRopbQA0AMkCDBzRa6aIx8PgCzx8aOOBlMADCpaUDj9AoxsXRMHDKAGM38iENjagCForPQjPKAiaAoYepEuy4xw8NMvnAghMKMKBMDNzJzB8oPpgjDRy6WFO4JgL7xDE7+TInAROUeIEQGfjo75VUIpBCCnuGSFQjo7Jlio8kRihvJBQGuesff1RgTxVNDsHBhm2sIEAJZ3oAoppGcLgECxHgyMuCroai0hTOXnT/CqoXdyXNAGBOQgcYBCyIxx2xhDEAgRNmNaeSDlpchpZoM+DBgVaqsSrGuzCwAOeIAfggBwBygKuSG+yJRc4XRztnXQHvgiKJUfxhIoBuNjZjCmDSSccv0JgwwwIRRBjmnkOe0MKfAsJ2kazMKvoEDWTS+AXuDEwEjgwLXLaTV3As8fgFGXyw4yVRpLBBlGoS5ahOvcwZZTwZGACBgXpOgaejBrDYx5frXvmFFzswEUImAqyooYM01FnHDjhmmQW1dQo84RpG8lpikALoWeqcXY1ixAB2rAMMBWDCP9xRjiVU4mwWiALz/DEGL/DBHB+QWAZykIMu2KBFujMKXvwR/44TCQYNOciAE1hggRw0YIBQyd0SyjGPAUwJHWTxxziSADVGeIMdULhc5tIhjHncARjuaMcGVCAOcehjGDegAQKAUaZynOAueYNCAs7ghRbIwgu/YRMvCpMEf3AwRhhQhw4E4RxC1AMFiEDFyU6mwYpcRC8u+yCkJEUSI0xmLZ7axyt+4AsVaGABgzRCDJTgHCt0QAQecAz73mEUdAwiAAYYQy+scr/8mWMJ/KvKOdxhMHaAIUHrGM2cEIA2sVilHFx7Agd2sIUTsQkNDsgBGnYQRr6UxSoNawIPPhBCNWTCH3OYgz9GYYr8RWUyuoBMAXNnjhs0ppIY4CHmyrE5dv9w7RxRUIA+KLCPfczgGEOqRBgTZ78OGcAAbsiBD1pguzYBoAkdSMdSMjbHKA5EAoKogxofQYRtFE8KokCUOQw6x+ZhIBnKCMlIJjCCDdjFHBaohgUvsb1oOEIDNCADI0chAwJIQAJXyAImYpEZO0AiWF2ppAECQI+o4E9//+BfL8pxjklUgR5UGYCAKuEXBLBLk1Y5AQICwAnF/MIfLYBbcGhJjgjgci9lKYc/+tAFNAxmhF1Qagu8kACLJMAUGNJQZsphBidiYAnpiKIsPECPBAnDDDHEkz/Oxo4oiAAPeKDAMCBRCgKuzi5UdZETmeCPRvwiAQ2QGBpK2BYw3pP/I+lCxwlQECp+kmIEdVBCHIpHhrvd0x9rWIAsZDCBkXjiBlCo0BAyYKMm7EMDjviBJDQACcegAx19sMIhX3AFIDzAA+9gHynFUoUAmKIb57AA/qBC0wH0YhZT0ekkv6O3EwCDXVTNDAImdI5gdUCYv8BqPG2AhsghhzQW+N4cOGCYaG3BA2gIB7o2NtaebqQsFtBu40abBCjQRq50RaA51OkPRVxAE3t9xQOMwAR24CVxUpkE2Db5Dig4IBk08MIIHZsBWlSAKXi6Z+6s4g4UEGKfddBsHQQRB2T4w56i9cETUBAD1E7gEVvIHYeq0QQHoIEWHPiBJn6gATwIoBIY/3CfOapQiFBJgABZQEYsZpHSR55DkpNkrnOLVdPpGqAXVfCGOihjASHdYTRrxoB3ucEOrvhjCxygAQsKwyYvAEAULdBItu7yQTV9IMhesMEy/NGB4pi1IsI4gGkifJdXFeAOrfMHJcKBgCpAIQrR/U4lZoGAAbDjCJjiHgWOEQW8rFlh7NiAwUZMmic4AAoR6ALg3KSmxuhNjMgRkAxCZQJPkIIUJBBECkAwYzsJqB9vaOgETHCKAWjEH0jIgBd+AYA8ZCAMGliBONpgBw2wrCIGSAJnJaAEIQDhCZxI6Qz/MYZY0Ql/rnBQdNFhDqMa6DusSHNU8NTmXrBWl2WKQP8j/NEAWqDIMDb4Kroma5cGZOADeV4TGjwAQkaSxVjmMENLjWIXM7SaSkSVRaNdsele9CUB2aVHFLSHh+sYYhfryJ1ZN2KObhQgQ6NBxwC064VMfKKWJGwTLYqjS8k2Twwj+HWwhy0IExxbtDR4AhWixwASEKAQXEjAP04wu8FIqy2O2AcW9PEDU0gCCoP9tCn0KeUskCENcIDALN6BgV78qrlPkai9y1GAAGyAQ8LgBjAyRBYLmCO7BSinLo00jhzcIA2FiWcGbICoKd7JUYb5RZBzQAu1VIMMG9hCO8h0AqtEIRubIQ1Z5prMvIwCCbSZSgH0BgUm9AIeRtDH9i7/ETAPzLBd7ECHEzewPyY4kRsfdIAHyNCENUnLCc3/zq6Rk/hByEAJSgC2sElggqhn7DZ9eMIIojcBZrzAGVeAhQoe0ASsqoEWvLDBB+CACzyIAxfXwIMkVkcWb/CGRTC3F6AyNxCBoPiHobiDvcsVc6CKXgmAMdAkVhgEwzuHp/E6YCgAC3i0uxAQFtiCBjC4OcAGNIA+J7ABchEQRqmqBaCFwQAc4KCBG/ACKLiD5NqBJRCQWfA0dtiBXkAARlErriEqczCCMwADf4gh1MOXAjCHB7gECvgBR4CEJ/CHJUOgrsguYEgbDbmDAvAGKPAHdPCHX8gEI8iBC4gbXmiC/0gII+ZJOpv7qBeAunogBR34PhMQA2RrHih4giEohPLIsTpghmDYhE2AgTzYAxvIgwughV+IAEfQEgqQg99zhVlgsru4BgRIgHo4o98CgggQLoYJgAIYhKupt17wB2B4KQtghQ0ABioxq3PILkawirJgilnwACQwBG4YhA9IAx9oghN0i4SjgTBSDnNoGF6oBg4InC4wuEgMIyZwKW8YhHOYhSliB07ohS7EQDQ7pSnyhzdQmSkgILGgBwTYAArIFCkUgV0II3eQDHaYBIMhDZxCgALoBnbwB/exKjk4ARxwAhI6ESeYgwmTw8nIC3DwNSXoJx3IQxOYADPow43glv8WoIJHIAVnswRBIAGSYIAJqINgYINg2AY12AMHICZH0AdVCAUc0AcjyAgM8AYwUIdFIIRDKp9GIIOuM4VYgYIGsYopiJUQqIITmCtg2IBZKYtzgIIh2UGyuA0oMAQk+IR3KMMIMDQ5IMbfcAI1OJ1GOQIUyQEHCJwmOAIjaD50IA1zmASjAoPl08ZZWIdRqAJlERALgMo7iArn4YMEAJNBKJMpuIMn2IcpvARqyATbQLzau4N2GBswDBt2SBdVqoY+CIfAcSzHyoEtcBGF3AtzAIdHkAkW0wEGqIM60AEzMLO98Ich4INCwDFmkIAUiIE6SAFCIAESQC0dqIcYcAb/GNiEbdgEB8AFFeArfcABMnADQ9iCQSBDBJjAUfCEUEE3ICADY/AGwIMMeqiTcyjKEIiVTdMXDMyMc2CCAgCGJSAl0vgHGkCCGyini0yDarCAF0QRN1GDDpgMplCMIeOAC3otfyg4dKFLc6AHYOiFMTiBdZghdkgA7qSHddAbMDk8f5CFBcAcekiAc7iDAdAAd8QDOzidcpgFdMimKQEvBZ2SeTCONVuHAm0ADPiluMmALrjC0NSYRYiBOjxN4KwHcFCYRkmAJ0ACQJAAIoABAlgEEC2GU4AGGICBOPCEeojICZgAT8gCDqiA5FyBZkiBOOgBo0maBUCCUmhQd9AB/xMQqSlrBDtAAFHqBSO4gQRgBxw8AIPxuUmIgrxZnPV80ErYiFHwgXBIr8RRB3PogCSYLxQhSG2wOIzxB1f4gG/hAcHogqiSg2SQsYXEgHubgirYjBNwjHMwmylZglnYtExagh2IAC5AAHrQNAMoBYa4BE3ABbkLFnb4NGBwhQiDDAOoiLbkLnZggilQAC94VYK8gBHKA7WIwx21i384hSuoQxIQNhmIAU9YhP/0Bxm9gY9wBiWAASnoAhqggdvwhyJ4BlqwAW3Ih20AhEcogzKQgRFAgSGAA0QABEHYvu1zBiIY2DgAAmiYhhKwhRQQqRcQAjKwg1gIgV7IhAUYB/96yDtOcCIEYIJZsYt2sEcEWAev+w4WSAIaQIfJOCfFMLQiMJHh6AIkwKUaOhEOoCXBuYFxYAyLYIdgKQfdQqBy+Ara0BuaE7Oe6hAhOgHFa4ESkEUoyCZqwFW+ooZcaMJ8QZtzUFB9kbEokop1OAHMCYFSOAAHSIIbuKBwQYMu4AHWktbQvAsUu9aPvEMZIIQYEIAj2coGwAEWwAEiuAIY5IVwAKvRAssmoAVaUANReAAFyIRaOAUXwIQyIIF+ytIs5U1myNzfIQAiEAIhcIYXkIkr6IAaKIEC6IBq2IEF7QUh6UKoKSUwQQBVPVEP8IEbYAUW/AdF9Qd22CQaoKf/TIA+E7G8qLrIJMgDL+iAC5qlcsiEaniHnb2I2wgW6A3aXtjHcsCrr2BAYXgMBEgHdwiHAwgBelgDDGAEJPuBGTgEEViGn4qhO5gHdxDWMkSHWfiHdGCCATCqUlAAQ7iYvT0BHggXNwEAL/ARt1VIDlnGEbgCAjCBfhqBGJCARxCBRkCGgiODJFiGRugHFqCEB4ADSXCFaXuGlLQBxFUDN3iC+hKQBNiBGyiEEXiER5CBeuBN1BLJy61NkVICAgBdZwACHCgBHEAGMDAFQzAYS6qTu8ja1NnBSDIGH2AkGQMvdrCAHcgGA7iGsXoAGjiCNrEdG1CqsvAHMoAbDhgM/yeQxqiahElgglkwh35MFAyoJJ1L0eiatATSLthUgAJwgwY4gAD4AXFYgVcYhgiIhEqIoQ1gB8wBhknYWa+bAkbohRAwBCPwAFZ4B+h9g4BsgMApIbdAlGlFKHPwgEK4AkL4SBRogR7gBxFgziKwkbjggbnBgRmYgQdohGSAAFxIhVSogZrlAGVAhDU4AXeAXumlByNYhFMYgTJQZUIgBBMASfMgAd8hAAIIXSvAgQjIBByogExQgBAwABlzISceA4ShgXCgAZE9gZ0aA28YkiqoAgS4A3pggmV4gh0gDHtwAi9oghy4mNtoADX4BUwVnEiwAA7wAdAYErBRJxCdgv9JAFUZdQx4k8UowB/OEAaonIJaeAIDwIEOqNUppAZI0IA5eAMncoUlgIw76Me1uQOjCoED2IIE0IWNSAcX4pYc2IEWCGXH6gJhsshpPeURWFgCgIVliIAn6AAvEAwHKAIH4IGovoCodgAkWIBPWAYA6AAcwIFloFgyiAAISAUReIMkMFsWYIFPgIIl091JyIZwKARAkIErcIZq7k0t9YRHIFchaAAyqIEfwIG0GIIbWANzCM9eAIN5OEIkUAB7RgBvwEt16oYpsIrFPocqWQAcEGAvKgxihJeNoaC4GNAb2IKGE5ATYII3Lsw7UKezkegBmAIwOIMAqAIWMITNqIT/BBgDYNiCZEAAEUCGbgoE2YIEEWiBIHQHBd1YF5mCAqmCA8iGBCiTO3EHIjqgE+CAcPABwVgTEsIBpihl0dyYMniBYOABRGiAAS6CzisBr6qGqXYA+4ZZH+gDLzCeZ7ABJ0CMN9CCV8rMJOiHfhiC0EkFOMiEfjgGN+ADFhCAFuhFWSgEaMgCIUiBOjAB3/kDAugANbCBPVjhG1iAFuADZQADYAgBU0CusdKuAaCHSZAizlYvf4iFX5iERmgC4UCRLugDixA6gI7qcFmDJOCBuzEoJY+KOrmNGWKCnRqA2F7QACgFiS2Aa8DtKjAEbzAFRHiAs6MASMCFGqiCOzAD/8gYg3mYBMhg0GzYQXNIB3kwKO+wCPEaBwfIM1GeA9Yy771YAn/IBmioAFxoAC/o0jlQEXBehg/ggEZIgjkwywgwAhZoAOOhhTZRg35Ya3+IAnbgbH/QhSjYAEkodRoghi3Qg/XVA1s4hkhYhhLwgQhogAiAhR6wAkAQAiLogFZ4BikgA4r9bhYgZztQAAMwBRaohO8YC165mTvJliMpgjWIAB7/jQxQg071aQCYAyLnAAxYgBWcoxbUvAWhKX87gUEQpQIAvCoIgRAAhhLggSLAAuuwgxlwg1sgBp9jcVM4gxJ4zlM3AmIYeIIfB4KngS2ggWKohEaoi4kDDsPggf/08nO9sIB1YAIjMHQeqIFfkAMBbQBKkIVGeIMIuIFaeIA8a4FR4AMvEAVayIALyIMbaAEcOIMzQAKbVwAF4IIDOIAx6IYBqG2hF/puMARDIAYa4AMueILoqAEVEKiTwQRMiIBcONP+jYWxZqRyV3KMmF6RvTl/8IAiSIMnaAtivPYW+aCs8vhaSh4caAQO8dSDKu+FXDO7Hw1zmIdsKAVTRIAteIMzFoVveAV9+ADEJINkAMoqVy4WOHWELwbIj3zJh/xdoIRioIQEwAGl4vYcUJMc4IFbovjliYJ1qIRMqOoKmIO4SH0eEJEPUIYSrwVOKIILmIMGqIAkaAUbuID/C8gBFmgBLqCHKQh64i9+4wf6AeiGMfj5N8gE242ABeCDBWj4qCaH4mkETGiEWkiCFkgCJEDs5l+DlRn/iyiHBrgBtsDRcCk0ixjGD4DqWiKXDkiMMuHdfvz0KlFyc5BR4gOIdf/K/VtC0J8wQ3YCGHAjyga5ORTwaPiBi0yAXiHADFpyjp2/j+c+shtpkl1JlCHN+XtSzV+jHF6coHECYIu/fzp38uzps+eSKJ+K5ODAIYcDBxyKcKiArMGHcJVyOShC5sKFRoMqiAKAxsGaBThRki1rtqS5kkssLPHnAckNY5GSJKlQIdMvcnukSLMVKZKsN3y2WPDnL02LBOYG/xokyNPc4nLlFvvD0EAWlwv2eGVwogaH4SS8cnzw4iVDA3+/Ivlj4vo17NhMTpyQPYnJpAGGnpTC0YVcxB8r9InAsexBrFHmTpY06fw583P+hsjxhwxpBq8AWOT86f17uXNmFnjhMARHhCcV5vDAUqRIBTIVcHzg9evEBwdqftWwAQAAD6OI5c9ZBZY1UloqWRDOEEP00wIOjSzDgRQVhvFAPxHQ5UMlzfnjwxD/mNNOO9CdA5lJ/0TBziyN2GIIGvZggwYAajTAkhY2FOVFDk6AVs0TkxgwJJFFGjnkHUMicGQVpiQzhBf+VeMFFj88cMsvuSDRzR1dJuklmGGKCf/mGXKUgwwADqDR2U3dffdmT+Z80sEFDXziww0RLIBDEVgYxcMcF3hRhBYdsLKATM+I0kQOF3yQwBMHDDAmpWJy2eUAZ5zRRyYR4JAJGVh8E8Y3nfTRgS1pnDHGFK22WgIYU2zgKq211oqDMrHQyAtNrTSCznQ2OPCBTBmA9gFrI0UxEjvLkVRWFOskOA9ZwnhQTCaZ3BCLPTb84gU5anzQCLlPKGAIF2CM0c0AUwzwLrzt2uoqvPQgIQc6y6TZWRNOpOEmnHCW4w8L1eRQQQM4DKFFBBXwcIFSXgBaBA81ODBOH0jZ0EoXAFzAA6SmJHkkySUPGUIIvZwxhBsLtBD/gTJotMJLF6K0gIwtPpgCDM89VxFCz0ELPTQCONiiQA4AcMaLDY2wNEQX2DhgWgbI+INsSCYtARnXIi4GmYg7pTOwnEhwQc8O9IjgwC9yyAEANrwcUwklChhwBz3lQBvFPMweiBLXCPrDBw/+4GCaExlkkAMNAAf8pjnGFKHUAy000kEHcxTFgwNzVNWUF8iuwbkTtDCKBg+uDAjZgc8C7uw5OhkmDBchIHBDEhG48akWynxgQxcXiIJIBLawcAMLYBOEzhA7LDGQTyRKr5M5lVSQBBIXKI0GGjak5k8SraBhsBcANOJPNQv4YwAC7bsPDCOMwM9IFd5Ucf/99ntj/wrKIRTQi0ZCIAI0aMMBSltGXDyAgW70ogAIAIYBpjAJDICkHFvjGgYNY5h3GOYJv4AJ4mgGgHE47nE/acsbOoeDPCxAGBGYAwcGlQktxNALcujDEBrQiDPMwQtqaEUT/sMBV7RgF/7g4BE1yBINKhEywErADUoRgAMUwxZaeMIT3EAGMkRAC7/4ABZqgAhkKOAanwhHMRJAIMMYgwWOWQz1EgTHJbRlFL+4AR9o1C8ntGIZhrmBNpwQwxygYQ4waQQTDNCNRd5hkY50JCd2kA1JTnIUo6BBFkNQihB44wAKOAMSfhG1DJAhGYYwRjh2MI8pFKBdd0BAASB4ByaER/8lYPPaP9CxFn9kogP+8FyPnMALAKyhhCYEyuByUIQNFCEDjYChF+ZQhF/ggAd5EMET5JAELhCLKV1QQ8cAkIMd8OEGOZGM1zAYp8n4YxRnKAUCOEEDLhzAFCsbQgQysYBGyOEDHcAEJrQQggAEwBtnWEA4dGGYUSTBAktkIkSZWAkyGGEB2WkCGpiWCcNQogvaSFPSCkeGaiznLBGdxxL6xo51MGEKVQhAFYAxBnpAwQID6EUABlDRTHABASXIxQFu4IFRmIGVAzhHOZhAj1c+EAEDoAcGFvM8nZQDA7tsQGomBwAnOKEJHFDjMd/UFi4cxQjZy0ARHHEB+WSABxz/uIAP+ECGRrzBCDUojxO6ELykraEPffCHZBzTk8BioLDrWMIWUnY3nsHyDC3ggw+eMARlvLAR1cDEAmQhiwMEwBQI0Ig3BsCEUYTDgusobDnQodrAouMf0vKHMebgigjYhFdOsAFr/LEFXqjBCw7IgUwSoIUPLE+1rY1TszAwiW48sBRnAEM3KuE1dSAgACUwhSluEIlkDKKzxzCFAQYx1HNkoxdjsAAGHLoYenTDAIyNIAb0xo5/tKMwc1jACXhQPmGqgQdQMGZYddIWIxClrkVIRqByIAKHPcC3ZOCDByIghzW04AI5oIUNmgAxf1FCCwDeCUtihw5uXGOgAQiB/wJY1cktLAMHFbDhf3KAiF8sQAuUSMMawBAATnignqXohf0m+Dw4UhWd5XDHP/xxKng0gntdoJkakmCYBHhBFGjgEXBpEI4cQMEcgX1jif6RGwPE1ABjSEIfRtGsdLijHZMoQAiMQAlgnGEwLWBBAUyxBUOUwgD+QMcJ/lFeMHCiEsKoadaSOoX28ewOA5hEYRLggBukISk1yQAtGhC2AP/EAv+AAhnQgINKNKIBS6nBAxxAhgcUJQJpOIIWFkAGzn2gCXnIgxMcwAs+fKIF6BDs11hnjhNsYAAGwGlnDXGDLSTgBAjYADvQIQeOiVMa0rDhG47QDxYkYGsGKMAgaP9gDCRkMgAFMMCj9TYSOi6hHe6Irz9kjZ8cYJq3XTAnSz5gZR55AQ1IGEUO/lXVC5bjBFNgnwOf+g4P1IIFnubJTU3BiQQYogpu2MEYTPGGzjq8DyG4wxJmEZ4NVAGAYOCGLhKQAGEsoRIWmIc5WvrKRnMBAKMYAnYy0AQ1tODDAV6LOXxwlDTwAAByiAAcKuCAI9y1CHMgw+Sg3oRGLMB0t3ZAHiJwgkwMQoMWtAAUBpENb/CsF6bYZDyhoEt2MAEBU/gHN2KRCUQoIwoJYAElbNGIX1AiCTQgMiwxIKJxLKCchngnTN2OAXVwTTKzMEcDtLCGqTlBG13wjxEAazj/cly5WBHwhxzUtwR2nMDYwHDgGLgxi3n4Awo3OEYxqxpoDBggBAcQxjvWcIA4+6MKCNhCAM5AwlEoIKfDFjw34FyFc0/ieQnYgcpHIYwo+KPl9BhACzjgjwhQrTNqSIbPw0pHcyQAGRfgwAe4gAMOiIAHmUiDHWjNCzSM67d8WECGbW3ACrTEGAnYAgscQD2lDAJAVyUkVi8MgOChQ4fQAwLQwzmgQwTwgQXYgi3cwA1QAiXQAAuQASWEw8cNBEEEnpKlwQ4cAbexQDgggQIMVAHcwRScgECUQwL8Agv4AHB1AS10QSv8guANTDK0AjbIRNJ80DJ8kHsBgzdE0Amg/4RBvAMxvIExOBQGnMASsBQwxNkSoMM7sIAdFIA6YIApjIE5AIMdbAFkeIACFMAUnEN8nQMUAANHeIMDTQJL0GACgJ0H7AAUtIWE+EMH8AiujcYaeBmnndD4ycIHAMgadOAD3FELFIGo6VAabAAOAMAcQMERWB2jmIYr5JAClIIUAQMM2iE7JEDtIAATFBYGQMEqqeJiQAFqhIMsJAEHdIEtUMI+5aIWHMALIpWXPRAL9AEGtF443MB/VcIo7IAReFLKVIEBYEAfzMEJRMB/dEET8OBGHcQ4yIhpABcAnCAA9FQ3YMA6UItOYEA6WMDrcQJgWUA5lMgUaMQOsIOnVf/CArgBAvzDCYRAN/gDAjyAOUXVOKyhHcbXpwHDPu4AGPSC23lEZLhDOVRCAoyCF4SDB8iBAXGVDfAA9ByiT7TbZECBG3AALXgBEjxADeDAFuCArPGCH43CHOSBA/yLRWZYHqABB+RBLKxBBNwNE5iD4EGGBRhBytwBBjDgCVjAOrzSCcSOOaCDF2jDAvRDMnwAOXRAA9jA8CTBEMQCPbChP0DGCQTfJ6yFiNBAHxgBS6DDLBzW/x3A/dRABKQDsaDBk5lOOLiJBXzARwGXrvGBOuSAhwllYEmkOazBMdxAfMGj4LnDHXTWf0UVFPhAJojMEkyC8fnUEwBWVBVDKQD/wwkIZUHEITDMQhSMwjX0AjAMQHiI4MAInTq8QVFsVQZ8Rvj9HPVAQQSgwTN4gQjMAR+4AQT4wxEAQAmUgAEVgQm2Qzl0gA3gWgaoyectAAkRhGSYA+3YziS4YRWOHvvM3hIkEg6QQ1G0AgesQSZgQzgkgz34ABJ4IBgUwFKywFfyjEEUljlU5g04FEEgpjkswQ58gA/QAHDlVRO0ggNAAfSwRASIT9LMxPlglT8sJQbIA5JhgDEcAzEA1rtZkLPZnn+2XhJsSwKyXQDQQxQggCksQ+ZJxoLYTiXEVzmAHc8wATuk5nySYlRVleGAxjL4VgZAGRJUhmCB5E+Yww4g/wI24IAI2OAD6AkPZIAX3JqrCQNlLEAXJI4T8AgPnAD2+MMsPB46rMFADYAFoJdjsAP7RJU5vlkVyIEoIMMu4MC/QEExsQDfAQDH8AoOyMIQsMA5nIBCzoMFxYM5WMAuHMMO5IRVLaU/hMMcmEMLLA420gI5kAFgOUakdoE9RCiPkNaCloMwZOcOLGYl/BoGIGZYxtk6oANlvsEWvAESAAM9sAM9BEB3GoA3vMEbKMZaJISMxldhCQMsBeU/WEACgEFMzZI/JAAH+MAo8EDRcVXHfAJgIembTIYwZEJwZoIC1AAQ5QHEzAEandPAsAAa7EEeZAcHoMER7MAClMMs/P+DMOweMBzkP8RXtLUPVbGUA6mGKBzDJ2zBDhBEZGTDAeDALziA29gBGS7GoDrQOliAO6zFwh0DJVChBZyAPzRAJphDNXgFNgKPD7wj9bCCA0AoAMxEz3FAzxVjJYTDGxDDr4mgpw1AZzVqYaEDFCABC+xAL6oiO2RDAAQl+5ygD8CjQyUAEjDEP4hcehlrAdBD1KKD3TFrK7lB4fQDB0ypzqmB01jQkWorT1iQORjBAxTBG4gAU0RAA7xBGvzXO2YnFNQaACiOAaXGAlCCP9DAQCElK+onBkCQQVxhWIIBSMzBM2jBKLTRYkhkOXDC/4BB4/jDm91B7HjamxkAUln/wIyigzDcgA94QGWYwxbwgBH4AJU2wQ4qKINWlYBtHzlkhzgVhT9EggMUhhEkgw8IA2AZREHQXghwQewSRAIkgcP1ZPssR0M+JfsMQhqEAyUYppIiQS/cwUSeQFVZwLdNQWMk6hpkgwHMwRNYADRlQB7sAS1IWdmarU+cQAKQwTLwATIMASW8wQzJQhpwWzFGRks0QWc4wY5sgTHwFNDQwxKkl5qSHgRR1TlMQi+AwTr8mTjVAjtwAVvua1VVQgEGABgE6BIYFVJZ0Aac2zzUKzqlLf8WxjKkxhxkx5Px4OdR1eymgUf9x77wgT8QpgfwQYeagztgaDxOQhZuQWMU/yMUKC9s3QA7tM+JXEMVYMA53AEjnMARGEESeEBkyIkCJKBjzsJafC87VNVBRIIXmMMQOMDDWGsODEJkwO8JweMo4IAWkMECqJYFjAILzAAkLMDCKAMlrMEo+MM41EgTaBgPoMHn7dAUCF56pVeSMQEpxg4VJ+461CsUZFoaGQK2km05QAECVELJnUAUmMEIt5JQxkM7nPAYlLFkrOp+hgMNVJoBL05X7VwTcAc6paOX/YINoAEh9dsH5K4TsEAlbCo8EsQ8hsAaWHJS/uy/JMCvJgACaK4/eAMj6MQAVAEUGPAnIMEs3OzfriE9GCY/WgADDQCbtZkwqEIuAKJb1f/E5W0jQsrxYE1GGuBACdQATqjXWLLZKKQBmilDC0AADTRAj/yQ4gAAJxjDvM7CCVgVHfkDK90BLJ/DPIKBG3qsEdBCLLxBMRhCMRWETogyBgxCCHgurEbBALDhfP2DRveCAUTbP7gDTi+BO8ADB6RGA1wUL/BCVo5lTxSWPxxDIOnwTLxBD38ejQqeBUSmKSgGQRhEJSCBMRiGD6QBO2yArcq0A43ETUHBKPxVOAjcvv5D3eSrG+4rBrh09i4wL3mBPyDBsPRIBnRBBjSO4OFzkpbDA0RCBIiAPxzWYyzHErmCJAiAEfQBGSiDMnQADtRABnxeJuwlHUUVO7z0URn/1kafQ5pG6i3OwQxQgiEohwWdNAKkV/FNgTnMQiWYwUu79kDMdDewQxXidDH2gQN4wBYszpBmow3spU8QhAXMwge0gjgJ8wW8RBJ0QeNIBhwiQAgYgzDAKjxqZxIYwzuYA0NVQhTMI1TT9EjM4yCUQyzsgAUkwQ4MBNP6gO0E2pdFwQbQtD98Ahr0gTnAkAMkToL6UTq+rxyzhDE8mD9Xxk0X9QpHgUJVQgc4wQf8wgOkAhy0wCgoAzKMAiuwAoHMtpeVwzrM4yvL9RbkwDPotQqMgyEohkl/GgIEmjEAzUTDtk1VrVSdg85mw3wdGfk5QM/NARpcADYKtRxElU9A/3Kw2IQ49Zv6dAAHGMQ5tKrDrQN2amcfGAMrxsI0M9dkuAJDlESucoM/UJpuESNBUGYsBMBqu3VhLcEJT4Ec8K1SXEBO0oITNA4H97JfJ5kFiIC3qk9B4HQ+G/laDEwsNAHwgFN5NAALKEMk6IEAnEDtccHKmUF4m5dQwqo/vAEtoMEvDClmsLhJi7LHsgAL0PSHu9xLQ6BOVHEvZIOhpgPkfVA/1BYv5AEttEI/AFjPWkA1kAMBL3kOsMAJiJo/RKYCeMA7iNwsRNV6V29U0QASeJkoG4CIqHQ3jESu/tca+IDg9YHfDq939wFDxI6RUR8O5IAFkFUMCdMetAJoGP/Zw+15kqVBDfBBDTQOUw5xPpsxjKrWHAQRGuQBr9jAEPASHAgAIxSADyzAGyQBBByCeZlBl2lePzxDDpBBHohCJHyCdEFyKL84waRBNwTAFMAqBsT2S08CLKdDZOp4vHkBH3NPXuWVKFSDkX9HWxwDL3xq0hjQL5hDOKjBEyCA8SYqWu5rH5RWYCFBIf6DLrTSfHFCCAyAiEjwJLReHyiGBQyBcgxEfI1DLGRvCcPberKAKzg5B/CLjpDQ2eIzWg4MBuAAF4kAO9CRGXvHkaZrj2DF4vAKIf/CzrC8skrCITDEKPSDLMzADOBYI6jB4ugk8MhCZeB0yHt0OFiAKdD/J736rDC8NBOcwwIvwR28eh8AwLR/gE1w1W3dG4J/B2TARDATYX/70QK0gt8aNx2dSB+crI9O7zsOAjBMQbMY7TmbgwTTw1jewN/5gxG8weJxcDm3Emj/lzHYw8GTwdduFc3YQAsQGb1ndpLxQQ5EQBHsZWCl9eOwxDKogcdwDwfYgPbRwANkw6YuwU3d9jpU5BYAhB4IxyLJwdbFXoc5clj4K+fuRDluCE78gxLrBKcABtbNwmCOm7ABBaCcW1Ku3J1eABb4a9AlR4YMvLpIieAQwz+dO3nq9EcDQBc0OYg6yKDFZYYd/ixgKJfTh49y6MpZTDJKJ6tuCJiYO5et/1dFc0x6TfFnjsYNcxj8hVOb08I/c5QUFJjSzp+RDGT8tXDAIwcaJ11azTmxtmdixYt7VvXnEIecD79arPvnNCfjxP5GcchzAc1QDuQa+BuCA4o5dwN6jTn31II5f5V8jMqbLJIsVhZYWHjq7unEiuViQfE3JsCUy1MTJBgAjMllf2t4LPOXiRYAJ05kPnOQYK05zTqX+ItkgxcaLznWA7jh7wMA2xhmlevjg6oFC/5uhHNoIQoDgNHpnDF6yWmsKgY4K4E+oKjKgjfWMOepqjCQpS4MaEBjDn/6yEEOL2RqQg0njPHnhMzGWzExcz5J5gkcqqmGAwfQaGAHc8zxjf9Fncrx5xhaMrhAJgc4eCYT83DgZpJeutEJg5x+9IGFc8xhYQ1/2GEHinCg+McCd/45QbiqYlkDHQtMKWC4JTBo7rlB/PnEgUb8ScKJmLqQSY0u/GtKRcbKieKfRtADoChE04APjYYwiCWWpsqBopId3uAmynKEMQCBc9wpsAAfmaiiG390CscICqdDQpgxK0zABwOqyOEXf3ww0qgMnKBFDaTK8a2qHoU1Z4cFvBBSJjQyoCWCcigMlsWT/ImgCydAc6JGNSLpaxkuBvjnqUz/6U+nE45Y458lLBikD2Fm+UdMMimSy5g03iE2BAPIO2kH5+5Iwws7fbiA4CacQIP/llZacke/QBfDoLwEeCDHHqLYG2qLfzqwoY8EjEEJ5Hf6oGFHDCwYBYE72qkKjCp2OsGbMRzyZwtKKPzHH2N8WAuzHyNxwjofvPDCKCeaSBiHs6SEVlgWzUlgmS7U4MUBwgBIBuSmUVqrg1ZCG5IDL7T1BwkO+vAHs0rmfONLi4oD1xxOYmEF3KqgSICiJcwx4oizljggOTOachMKdJ7Yi2wAFM9DV2xsWMZZeJnWzGR/0kCDYqIAENGL98gQxTqeP6IhibhyOoebXuhpJ50lTEHgZgxiNtWcUY6oDyVh3qAB7Y+mFSVJJIZ2gEhe1BDlF2FMbZr55Tzs4AMHAHAA/4edUYpLWAvz4kCNIYd0IIcmWuCvkWR0xAAdYYb4hHYP+shJ70HmFk8nbvA+QW8PYlHntUrWNF0dpsIBLfrhDz5kYCiCQYM9yFEN4+iEfiwClK204TWLiQgAbzCNGjpgnKeg4xi824kwNhCWdozJFAa4mToYgQCHVMUHnCDPT/gABbZ4oBra0KAWinKBPPCiCTYAQJaa1zyUOOUfCVgDlnBWIYgJawkn+RELckCLr13AAcfiyxoaEQHjmCMW/qnKlcS4hCiMohZxCVYCBkERKyUgCeDJSTbyJR5/sKAaOXhPJpqgOCIJRg0cGAdTiggctmhBFGoYiuK8IJhMuMgLvP9IwmOIcQyU+CgBW3FHPNJxghB0g37lAAYw/OGmfxyhISAzxw084I9caMMLn8BABKYXttA0QRRoeM8Sisg8QMlFNmdZzmUcNp4oZspDaGjCZ0BTIyf8gn2Z+IWD0mCBiODsBouC2DlGIQspyWUU9zvHZZCQI6ecA3AnsMAC0NCIu3UAJkRCYAbIAYBivLB5cIkNOxAhilbYQ3EWa8IcWrkMNfDgBtzghmp8ZAEE6KscnQzAAF7jLASQcmtG6EO69PaYIQDABjdhwRyml0UACMYGtJAFU3jUy6Y5pSpHxExDoWgGN2HgBKY52pBA4wUeDIUPOWuEA2LxGB/1YULl0Fv/NpCQNWKhDH96i0WqTEY3MNjBAQ6Y5IeakAMf5kEwrdDjf4q5IjdVJYrTIgd60BDQHOQpqFuohhrk4J+zrEUYBbjDONWVnHYsYRbvuKhD3NGOBAwhAY+5kwNa0QEj+EML0jNpBgDAi2egwQeljKJLtbaTrPnoMuCCIph89KMh5MAGTZBJnjiQAzVUYBTlSEYHGhCLH1VCAYM4hy70JgAk/HUJ7agdJ/KGgXfcwGbmYEcUVqEKlpRjB40wWExUqytR5ECbn2VeKB2jDDWQA4Furewv3sMCeHqhBUthRyUQsIHLnGMHydnRCeIxWHjIg5M7qNQCAMBB9t3gF0ORnrJm/2ID7C5vcpxVcPPEQz9J8Uds3FEWAGokFC+iYwgduAUddlEMc8TDHe64UlGjRJ9wIqASYTKHB2jwDlDQIQhBWEA6KhEBNPACADPZjrIaOEi5LLi0puWFKPakOES9NQMNaAgNcGCPLlQjE2kI5mOQw4R3YAAe5jAAIxTrj2I5QBtdaADvjNGAtg7tpNvJQwOz9CzRAhnOLn1KeWjwgWfwgmBDIpprAZAJ46ziFqEIwipAwQp2eHmQ6dCRQ7hhAAwcOgqgaEMQBP0GVrBiAa51AhDzwLgMNIEcHRiFOXgJZ5myhRI5EAUtDjaUoeWAFxloxInU9wsn1+kJPkjDAbxhZf8tRSEbBwDFKgrRhmhgoxq2KI8hOiAY9gRmmUG0AWoYGqwExxnbK/qVU/zhgUaooY/KugB7bKQGAETgsaN4QxuAAAQX0AHeoFAEMRRRjD5kwg44WMCkg9CBSIxDHkZ4wAVsABogxpqyrQipcZCI7Uv+aAcdEAU5mjCUHCDKCwBoQhM+8IQsoeMGEahGIxm3OTk0gtKhULk0qoGJWpiBMy34wHY0lwcn/JAWd26BjjZ77Wz/XFBOMR1TFhBEmSDwzMRDTxE8Lg9XFOMYLmD3LW4RBFhIQ3EOkEMDIuGDT7hDAJH4AIkqrqtlAlKsQyglsIBelXOcpQW8kAJ422qxi+//ikNPYAFb/MENFvRBGblABCIW0AI+HEESTICHK1jQgjmEzwmI0s7NadIKUXyAEsL8a2mB3vnxgAw4s5CNDz7QilZQ9ujs8cIFvksLDuBgdztwRTrikYAd0MADasOpB1hwGg50wQZ7aAJNlunpDJi+EUuxwEno4/kf00zireiC5I185E+jgQddbMEQfECJLdDACFs4AhKUsQAczIF4N7+A4gTDi003wfIsYcXynF9/I7IFCplWQ/fkOSTNZUANnqEVuscBfqEBcAAHlgEBG6EIOKC/FG4PEGjTeKHTbG4PTK8aZIF+Isj5KuRH+IMD/AmI2qqt1k9zjGaZwsvu0GD9/9DA5tbPyFyw0yiwFZ7BBhohsZ7C/naQeZxCNkYhAniBHNSAcZQlNNoKAEAjD9SgBp/hGciBHERBFAQwpRgHNL4mNIyGFqLQC/rhgS6JB88qJ0xFGbxAFKRAGwwmWULjyOyuKNaDaF7NYvxo0/IA/tZqDm4AXEzG53hwB0EGED3rR2hgGTAntY4OEXnqCo8QEY0vWZSQRKQQvRJrOcqq83gkU5yFKZSBA1ph7sBt0x7x4sZtDt2qPfwox3gh51atASgBZ0Srpfyw7QBRXfSjKboMF5fjA78MClthD25OVzptO7YDEYmRGDPA5jKgCxJGFGyAA4bggTLREoEuUMJFLv8c4gYawR6kUAr7RFdCMQYXCRWz0AmYkBxawQEiYBx0JJimDBfpTxYVDBB/xRYtQBjcscsoBB3QZyr8AQpkodlsYOL6pNOirSAPcviaQPiYsBu9gAy2IKeIqRrjUTFE7DFGQRkaQdWkgCOpcP8UkrJOiibKUQ1sQApsQBs4IALCYT8eAx/f0ago0uEA0SJh0iYVS90a4PfIwQkHcAD3ILVsYADPsQZNDw2gjBL47q7YkULERSYVQxOZghK0oAO8oAvOkCOzkhzmjiMtzx627g22oCVv8iaf0v7IEhcX7THWYRz4YBlGThugkBuloBXIwQkc4AMaIRN8oJUU6yUfwwJbKqESpnEH0fIxEqAYZEEZBo8xB28BFiAXtCAJiiEBysMwydIs2w6JLtMwR+EGZOEYhuAN3mAIZIGVODMXtUsmUZM170ou0AGY2LEPMzPO5hFaWhM3cxMeeykgAAA7",
                          "isMetaFile": false,
                          "width": 165.6,
                          "height": 102.81,
                          "iscrop": false,
                          "name": "Picture 4",
                          "visible": true,
                          "widthScale": 92,
                          "heightScale": 92,
                          "verticalPosition": 0,
                          "verticalOrigin": "Margin",
                          "verticalAlignment": "None",
                          "horizontalPosition": 0,
                          "horizontalOrigin": "Margin",
                          "horizontalAlignment": "None",
                          "allowOverlap": true,
                          "textWrappingStyle": "Inline",
                          "textWrappingType": "Both",
                          "layoutInCell": true,
                          "zOrderPosition": 2147483647
                        }
                      ]
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {
                      "backgroundColor": "empty",
                      "foregroundColor": "empty",
                      "textureStyle": "TextureNone"
                    },
                    "preferredWidth": 234,
                    "preferredWidthType": "Point",
                    "cellWidth": 234,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 0
                },
                {
                  "blocks": [
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "beforeSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Heading 1",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontFamily": "Calibri",
                        "fontFamilyBidi": "Calibri"
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontFamily": "Calibri",
                            "fontFamilyBidi": "Calibri"
                          },
                          "text": "Road-150 "
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontSize": 12,
                            "fontColor": "empty",
                            "fontSizeBidi": 12
                          },
                          "text": "Product No: BK-R93R-44"
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontSize": 12,
                            "fontColor": "empty",
                            "fontSizeBidi": 12
                          },
                          "text": "Size: 44"
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontSize": 12,
                            "fontColor": "empty",
                            "fontSizeBidi": 12
                          },
                          "text": "Weight: 14"
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "leftIndent": 36,
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                      },
                      "inlines": [
                        {
                          "characterFormat": {
                            "fontSize": 12,
                            "fontColor": "empty",
                            "fontSizeBidi": 12
                          },
                          "text": "Price: $3,578.27"
                        }
                      ]
                    },
                    {
                      "paragraphFormat": {
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Heading 1",
                        "listFormat": {}
                      },
                      "characterFormat": {
                        "fontFamily": "Calibri",
                        "fontFamilyBidi": "Calibri"
                      },
                      "inlines": []
                    }
                  ],
                  "cellFormat": {
                    "borders": {
                      "top": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "left": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "right": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "bottom": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalDown": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "diagonalUp": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "horizontal": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      },
                      "vertical": {
                        "hasNoneStyle": false,
                        "lineStyle": "None",
                        "lineWidth": 0
                      }
                    },
                    "shading": {
                      "backgroundColor": "empty",
                      "foregroundColor": "empty",
                      "textureStyle": "TextureNone"
                    },
                    "preferredWidth": 234,
                    "preferredWidthType": "Point",
                    "cellWidth": 234,
                    "columnSpan": 1,
                    "rowSpan": 1,
                    "verticalAlignment": "Top"
                  },
                  "columnIndex": 1
                }
              ],
              "rowFormat": {
                "height": 1,
                "allowBreakAcrossPages": true,
                "heightType": "AtLeast",
                "isHeader": false,
                "borders": {
                  "top": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "left": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "right": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "bottom": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "diagonalDown": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "diagonalUp": {
                    "hasNoneStyle": false,
                    "lineStyle": "None",
                    "lineWidth": 0
                  },
                  "horizontal": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  },
                  "vertical": {
                    "hasNoneStyle": false,
                    "lineStyle": "Single",
                    "lineWidth": 0.5
                  }
                },
                "gridBefore": 0,
                "gridAfter": 0
              }
            }
          ],
          "grid": [
            234,
            234
          ],
          "tableFormat": {
            "borders": {
              "top": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "left": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "right": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "bottom": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "diagonalDown": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0
              },
              "diagonalUp": {
                "hasNoneStyle": false,
                "lineStyle": "None",
                "lineWidth": 0
              },
              "horizontal": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              },
              "vertical": {
                "hasNoneStyle": false,
                "lineStyle": "Single",
                "lineWidth": 0.5
              }
            },
            "shading": {},
            "leftIndent": 0,
            "tableAlignment": "Left",
            "topMargin": 0,
            "rightMargin": 5.4,
            "leftMargin": 5.4,
            "bottomMargin": 0,
            "preferredWidthType": "Auto",
            "bidi": false,
            "allowAutoFit": true
          },
          "description": null,
          "title": null,
          "columnCount": 2
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {}
          },
          "characterFormat": {
            "fontColor": "empty"
          },
          "inlines": []
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {}
          },
          "characterFormat": {
            "fontColor": "empty"
          },
          "inlines": []
        },
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {}
          },
          "characterFormat": {
            "fontColor": "empty"
          },
          "inlines": []
        }
      ],
      "headersFooters": {
        "header": {
          "blocks": [
            {
              "paragraphFormat": {
                "styleName": "Normal",
                "listFormat": {}
              },
              "characterFormat": {
                "fontColor": "empty"
              },
              "inlines": []
            }
          ]
        },
        "footer": {
          "blocks": [
            {
              "paragraphFormat": {
                "styleName": "Normal",
                "listFormat": {}
              },
              "characterFormat": {
                "fontColor": "empty"
              },
              "inlines": []
            }
          ]
        },
        "evenHeader": {
          "blocks": [
            {
              "paragraphFormat": {
                "styleName": "Normal",
                "listFormat": {}
              },
              "characterFormat": {
                "fontColor": "empty"
              },
              "inlines": []
            }
          ]
        },
        "evenFooter": {
          "blocks": [
            {
              "paragraphFormat": {
                "styleName": "Normal",
                "listFormat": {}
              },
              "characterFormat": {
                "fontColor": "empty"
              },
              "inlines": []
            }
          ]
        },
        "firstPageHeader": {
          "blocks": [
            {
              "paragraphFormat": {
                "styleName": "Normal",
                "listFormat": {}
              },
              "characterFormat": {
                "fontColor": "empty"
              },
              "inlines": []
            }
          ]
        },
        "firstPageFooter": {
          "blocks": [
            {
              "paragraphFormat": {
                "styleName": "Normal",
                "listFormat": {}
              },
              "characterFormat": {
                "fontColor": "empty"
              },
              "inlines": []
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
    "fontColor": "empty",
    "boldBidi": false,
    "italicBidi": false,
    "fontSizeBidi": 11,
    "fontFamilyBidi": "Calibri",
    "allCaps": false
  },
  "paragraphFormat": {
    "leftIndent": 0,
    "rightIndent": 0,
    "firstLineIndent": 0,
    "textAlignment": "Left",
    "beforeSpacing": 0,
    "afterSpacing": 8,
    "lineSpacing": 1.0791667,
    "lineSpacingType": "Multiple",
    "listFormat": {},
    "bidi": false
  },
  "defaultTabWidth": 36,
  "trackChanges": false,
  "enforcement": false,
  "hashValue": "",
  "saltValue": "",
  "formatting": false,
  "protectionType": "NoProtection",
  "dontUseHTMLParagraphAutoSpacing": false,
  "formFieldShading": true,
  "compatibilityMode": "Word2013",
  "styles": [
    {
      "name": "Normal",
      "type": "Paragraph",
      "paragraphFormat": {
        "lineSpacing": 1.15,
        "lineSpacingType": "Multiple",
        "listFormat": {}
      },
      "characterFormat": {
        "fontFamily": "Calibri",
        "fontColor": "empty",
        "fontFamilyBidi": "Calibri"
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
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 16,
        "fontFamily": "Calibri Light",
        "fontColor": "#2E74B5FF",
        "fontSizeBidi": 16,
        "fontFamilyBidi": "Calibri Light"
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
        "fontColor": "#2E74B5FF",
        "fontSizeBidi": 16,
        "fontFamilyBidi": "Calibri Light"
      },
      "basedOn": "Default Paragraph Font"
    },
    {
      "name": "Default Paragraph Font",
      "type": "Character",
      "characterFormat": {
        "fontColor": "empty"
      }
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
        "lineSpacing": 1.0791667,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level2",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 13,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496",
        "fontSizeBidi": 13,
        "fontFamilyBidi": "Calibri Light"
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
        "fontColor": "#2F5496",
        "fontSizeBidi": 13,
        "fontFamilyBidi": "Calibri Light"
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
        "lineSpacing": 1.0791667,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level3",
        "listFormat": {}
      },
      "characterFormat": {
        "fontSize": 12,
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763",
        "fontSizeBidi": 12,
        "fontFamilyBidi": "Calibri Light"
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
        "fontColor": "#1F3763",
        "fontSizeBidi": 12,
        "fontFamilyBidi": "Calibri Light"
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
        "lineSpacing": 1.0791667,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level4",
        "listFormat": {}
      },
      "characterFormat": {
        "italic": true,
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496",
        "italicBidi": true,
        "fontFamilyBidi": "Calibri Light"
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
        "fontColor": "#2F5496",
        "italicBidi": true,
        "fontFamilyBidi": "Calibri Light"
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
        "lineSpacing": 1.0791667,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level5",
        "listFormat": {}
      },
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#2F5496",
        "fontFamilyBidi": "Calibri Light"
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
        "fontColor": "#2F5496",
        "fontFamilyBidi": "Calibri Light"
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
        "lineSpacing": 1.0791667,
        "lineSpacingType": "Multiple",
        "outlineLevel": "Level6",
        "listFormat": {}
      },
      "characterFormat": {
        "fontFamily": "Calibri Light",
        "fontColor": "#1F3763",
        "fontFamilyBidi": "Calibri Light"
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
        "fontColor": "#1F3763",
        "fontFamilyBidi": "Calibri Light"
      },
      "basedOn": "Default Paragraph Font"
    }
  ],
  "lists": [],
  "abstractLists": [],
  "comments": [],
  "revisions": [],
  "customXml": [],
  "footnotes": {
    "separator": [
      {
        "paragraphFormat": {
          "afterSpacing": 0,
          "lineSpacing": 1,
          "lineSpacingType": "Multiple",
          "styleName": "Normal",
          "listFormat": {}
        },
        "characterFormat": {
          "fontColor": "empty"
        },
        "inlines": [
          {
            "characterFormat": {
              "fontColor": "empty"
            },
            "text": "\u0003"
          }
        ]
      }
    ],
    "continuationSeparator": [
      {
        "paragraphFormat": {
          "afterSpacing": 0,
          "lineSpacing": 1,
          "lineSpacingType": "Multiple",
          "styleName": "Normal",
          "listFormat": {}
        },
        "characterFormat": {
          "fontColor": "empty"
        },
        "inlines": [
          {
            "characterFormat": {
              "fontColor": "empty"
            },
            "text": "\u0004"
          }
        ]
      }
    ],
    "continuationNotice": [
      {
        "paragraphFormat": {
          "listFormat": {}
        },
        "characterFormat": {},
        "inlines": []
      }
    ]
  },
  "endnotes": {
    "separator": [
      {
        "paragraphFormat": {
          "afterSpacing": 0,
          "lineSpacing": 1,
          "lineSpacingType": "Multiple",
          "styleName": "Normal",
          "listFormat": {}
        },
        "characterFormat": {
          "fontColor": "empty"
        },
        "inlines": [
          {
            "characterFormat": {
              "fontColor": "empty"
            },
            "text": "\u0003"
          }
        ]
      }
    ],
    "continuationSeparator": [
      {
        "paragraphFormat": {
          "afterSpacing": 0,
          "lineSpacing": 1,
          "lineSpacingType": "Multiple",
          "styleName": "Normal",
          "listFormat": {}
        },
        "characterFormat": {
          "fontColor": "empty"
        },
        "inlines": [
          {
            "characterFormat": {
              "fontColor": "empty"
            },
            "text": "\u0004"
          }
        ]
      }
    ],
    "continuationNotice": [
      {
        "paragraphFormat": {
          "listFormat": {}
        },
        "characterFormat": {},
        "inlines": []
      }
    ]
  }
};

let tableWrap: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":54,"rightMargin":54,"topMargin":41.04999923706055,"bottomMargin":72,"differentFirstPage":true,"differentOddAndEvenPages":false,"headerDistance":25.200000762939453,"footerDistance":25.200000762939453,"bidi":false,"restartPageNumbering":true,"pageStartingNumber":1},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":1,"fontSizeBidi":1},"inlines":[{"characterFormat":{"fontSize":1,"fontColor":"#FFFFFFFF","fontSizeBidi":1},"text":"%%"},{"characterFormat":{"fontSize":1,"fontColor":"#FFFFFFFF","fontSizeBidi":1},"text":"DPS::"},{"characterFormat":{"fontSize":1,"fontColor":"#FFFFFFFF","fontSizeBidi":1},"text":"SIMPLEX"},{"characterFormat":{"fontSize":1,"fontColor":"#FFFFFFFF","fontSizeBidi":1},"text":" "}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":28,"fontSizeBidi":28},"inlines":[{"characterFormat":{"fontSize":28,"fontSizeBidi":28},"text":"H"},{"characterFormat":{"fontSize":28,"fontSizeBidi":28},"text":"elpful hints for your medical claim"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"imageString":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8AAADgAADY2Njl5eVcXFxjY2NZWVl/f3+wsLCmpqb4+PiioqKpqam7u7vV1dX2uLj2wsLhFRXzpKT3vb30sbHhCwv74+P40dH+9vbkIyO2trbBwcHLy8tsbGycnJz529v4zMzrbGzlLS3qZmblNzfrdXXoRkbvi4vvgYHlHh7CZsBOAAADpUlEQVR4nO3da1faQBSF4ekAUQlUEFs14AXxVv7/D6yaQiZx5mSEYXF2ut+PNKzyyK5diYDmR9czx34AB49C/CjE759w3jvvWr15Tdgz3atXE54f++EcIArxoxA/CvGjED8K8aMQPwrxoxA/CvGLEeZ9jPJdhfk4GyCUjb3ECGE/Q6m/q3DwfudjP0ERZYN9hKdn2hvd3+0jHJz5/kBVuTk96bbQUEjhYR9ckiikUH8UUqg/CinUH4UU6o9CCvVHIYX6o5BC/VFIof4opFB/FFKoPwop1B+FFOqPQgrjyxfjVC38Lxk9tnAxGqZqdKtSOE4GHA5/fuNJpDCtcNHbv4VqYYqPLjgfUViPQgrjozA2CptRSGF8/59w+Wrt+rr1btNna1cPzg0wwuXavncxabnX7PfHYYXzlYARvlobQZyUR9mXm+1NMEK7SSLONgcVV9vb8IQXv4J3KSeKKlxXxNCzONkeYp8AV3p9UT1+P3FWHVAsq5thhGZSEb1DrSZq7dS5HUdoLiuBZ6jORG3tCwAkNJfCUJ2Jrqe1P0ESCkMNTdSACYNDDU7UoAkDQw1P1MAJvUMVJmrwhJ6hShM1gMIvQxUnahCFjaHKEzWQQneoxR95ogZTWBuqPFEDKnSHKk/UoArdoYoTNbDC5lBDEzW4QjMpYiZqgIXG/S76JhwHK5zVVipcnkIVuv/RW/HyFKhwYhuFr6NiCmdNoDBUSGFjovJQEYXuRN9ahwoorJ8uSZenPsMTNk+X2q6jwgm/ntHL11HhhL4zenmoYEL/Gb04VCxh6KKTNFQoYfiikzBUJKF00Sk8VCChfF00OFQcYdt10dBQYYRT5xn0n9G7Q0X8GfCzNNEyZ6iPgD/HlydaVg11DfhajJaJlm2HugIUrlomWrYZKuJKHz6vHhbSM/hROdRnxNe1meuXYvW0DB6+aflYrB7dlzDiCM3N1dVN6GDhMCDhjlHYjEIK46MwNgqbUUhhfJ/vA07wO8N1vw94ONo/3e/lTpVOYfc/UyG//ZmqW52fi/FuTNW3/lZ+eguF+qOQQv1RSKH+KKRQfxRSqD8KKdQfhRTqj0IK9UchhfqjkEL9UUih/iikUH8UUqg/CmXh6Hsv3jlK+wnvD/vgkrSHMMuyu1P9ZdmuwnycDQYn+svG3n9KEUKT9zHyf6+IEWJHIX4U4kchfhTiRyF+FOJHIX4U4kchfnVhijeZa6sunCf4ZdPamteEHY5C/CjEr/vCv0ec0g+AtS1QAAAAAElFTkSuQmCC","isMetaFile":false,"width":204.75,"height":36,"iscrop":false,"name":"Picture 1","visible":true,"widthScale":780,"heightScale":141.17647,"verticalPosition":0,"verticalOrigin":"Margin","verticalAlignment":"None","horizontalPosition":0,"horizontalOrigin":"Margin","horizontalAlignment":"None","allowOverlap":true,"textWrappingStyle":"Inline","textWrappingType":"Both","layoutInCell":true,"zOrderPosition":2147483647}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#000000FF","foregroundColor":"empty","textureStyle":"TextureSolid"},"preferredWidth":215.5,"preferredWidthType":"Point","cellWidth":217.8000030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"Where do I send documents related to my"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"medical claim?"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"Please send"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":" copies of documents related to treatment"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"as a result of the m"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"otor vehicle accident on "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"March 05, "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"2020"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":" to:"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"123 Main"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":" "}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"New York"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":","},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"NY"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"12345"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"Please write your claim number "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"0180731242"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"on"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"each "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"document so we can quickly identify it as being"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"part of your claim. Or,"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":" if it is more convenient, you can"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"fax your medical correspondence to"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"If I have a prescription bill, what should I do?"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"Please send us prescription receipts that include ﬁll date,"},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"quantity, prescribing doctor and prescription name."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"Will the "},{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"medical payments be mailed to me or"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"my provider?"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"Payment is paid in accordance with "},{"characterFormat":{"fontSize":9,"fontSizeBidi":9},"text":"local regulations. For "},{"characterFormat":{"fontSize":9,"fontSizeBidi":9},"text":"your convenience, Allstate will direct payment to your "},{"characterFormat":{"fontSize":9,"fontSizeBidi":9},"text":"provider. We will gladly consider other payment "},{"characterFormat":{"fontSize":9,"fontSizeBidi":9},"text":"arrangements you may desire, in the absence of"},{"characterFormat":{"fontSize":9,"fontSizeBidi":9},"text":" "},{"characterFormat":{"fontSize":9,"fontSizeBidi":9},"text":"regulatory requirements, liens or assignment of benefits "},{"characterFormat":{"fontSize":9,"fontSizeBidi":9},"text":"which may exist on the claim."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"How long will it take for my bills to be handled?"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"In general, we handle a bill within 30 days. If we"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"need additional information, we will work with you"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"and your provid"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"er."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"How will I know when the handling of my medical"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"bills is complete and what was paid?"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"With the handling of each bill, you and your provider"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"will receive an Explanation of Beneﬁts, which provides"},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"details regarding the handling of your "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"particular bill."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"What do I do if I receive a balance due bill from"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"my provider?"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"Send us the bill or call us at "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"800-255-7828"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":215.5,"preferredWidthType":"Point","cellWidth":217.8000030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":421.75,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}}],"grid":[215.5],"tableFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":215.5,"preferredWidthType":"Point","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":1,"wrapTextAround":true,"positioning":{"allowOverlap":false,"distanceBottom":0,"distanceLeft":9,"distanceRight":9,"distanceTop":0,"verticalOrigin":"Paragraph","verticalPosition":0.05,"horizontalAlignment":"Left","horizontalOrigin":"Column","horizontalPosition":0}},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"imageString":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8AAADgAADY2Njl5eVcXFxjY2NZWVl/f3+wsLCmpqb4+PiioqKpqam7u7vV1dX2uLj2wsLhFRXzpKT3vb30sbHhCwv74+P40dH+9vbkIyO2trbBwcHLy8tsbGycnJz529v4zMzrbGzlLS3qZmblNzfrdXXoRkbvi4vvgYHlHh7CZsBOAAADpUlEQVR4nO3da1faQBSF4ekAUQlUEFs14AXxVv7/D6yaQiZx5mSEYXF2ut+PNKzyyK5diYDmR9czx34AB49C/CjE759w3jvvWr15Tdgz3atXE54f++EcIArxoxA/CvGjED8K8aMQPwrxoxA/CvGLEeZ9jPJdhfk4GyCUjb3ECGE/Q6m/q3DwfudjP0ERZYN9hKdn2hvd3+0jHJz5/kBVuTk96bbQUEjhYR9ckiikUH8UUqg/CinUH4UU6o9CCvVHIYX6o5BC/VFIof4opFB/FFKoPwop1B+FFOqPQgrjyxfjVC38Lxk9tnAxGqZqdKtSOE4GHA5/fuNJpDCtcNHbv4VqYYqPLjgfUViPQgrjozA2CptRSGF8/59w+Wrt+rr1btNna1cPzg0wwuXavncxabnX7PfHYYXzlYARvlobQZyUR9mXm+1NMEK7SSLONgcVV9vb8IQXv4J3KSeKKlxXxNCzONkeYp8AV3p9UT1+P3FWHVAsq5thhGZSEb1DrSZq7dS5HUdoLiuBZ6jORG3tCwAkNJfCUJ2Jrqe1P0ESCkMNTdSACYNDDU7UoAkDQw1P1MAJvUMVJmrwhJ6hShM1gMIvQxUnahCFjaHKEzWQQneoxR95ogZTWBuqPFEDKnSHKk/UoArdoYoTNbDC5lBDEzW4QjMpYiZqgIXG/S76JhwHK5zVVipcnkIVuv/RW/HyFKhwYhuFr6NiCmdNoDBUSGFjovJQEYXuRN9ahwoorJ8uSZenPsMTNk+X2q6jwgm/ntHL11HhhL4zenmoYEL/Gb04VCxh6KKTNFQoYfiikzBUJKF00Sk8VCChfF00OFQcYdt10dBQYYRT5xn0n9G7Q0X8GfCzNNEyZ6iPgD/HlydaVg11DfhajJaJlm2HugIUrlomWrYZKuJKHz6vHhbSM/hROdRnxNe1meuXYvW0DB6+aflYrB7dlzDiCM3N1dVN6GDhMCDhjlHYjEIK46MwNgqbUUhhfJ/vA07wO8N1vw94ONo/3e/lTpVOYfc/UyG//ZmqW52fi/FuTNW3/lZ+eguF+qOQQv1RSKH+KKRQfxRSqD8KKdQfhRTqj0IK9UchhfqjkEL9UUih/iikUH8UUqg/CmXh6Hsv3jlK+wnvD/vgkrSHMMuyu1P9ZdmuwnycDQYn+svG3n9KEUKT9zHyf6+IEWJHIX4U4kchfhTiRyF+FOJHIX4U4kchfnVhijeZa6sunCf4ZdPamteEHY5C/CjEr/vCv0ec0g+AtS1QAAAAAElFTkSuQmCC","isMetaFile":false,"width":189.75,"height":37.5,"iscrop":false,"name":"Picture 2","visible":true,"widthScale":722.8571,"heightScale":147.05882,"verticalPosition":0,"verticalOrigin":"Margin","verticalAlignment":"None","horizontalPosition":0,"horizontalOrigin":"Margin","horizontalAlignment":"None","allowOverlap":true,"textWrappingStyle":"Inline","textWrappingType":"Both","layoutInCell":true,"zOrderPosition":2147483647}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#000000FF","foregroundColor":"empty","textureStyle":"TextureSolid"},"preferredWidth":100,"preferredWidthType":"Percent","cellWidth":203.39999389648438,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":27.850000381469727,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftIndent":14.4}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"What costs are included in my medical"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"payments coverage?"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"In general, most policies cover the reasonable and"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"necessary medical expenses, subject to policy limits,"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"that you have incurred as a result of the accident."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"Please contact me if you would like speciﬁc details"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"about your coverage."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"What if I have medical bills and charges that"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"exceed the coverage limit unde"},{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"r my policy?"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"All policies contain a limit that represents the most "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"that"},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"we can pay. If you have medical bills that "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"exceed the"},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"policy limit, the handling of those bills "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"will have to be"},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"coordinated with any other medical "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"insurance you may"},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"have available to y"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"ou, such as a "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"personal health policy."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"Why would my medical bills not be paid in full?"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"Sometimes we may not be able to pay a bill in full; "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"for"},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"example, if the bill is a duplicate or if you have"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"exhausted your policy limit. You and your provider "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"will"},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"receive an Explanation of Beneﬁts (EOB) with "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"the"},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"speciﬁc reason. Please call us with any questions."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"Will you reimburse me for my health insurance "},{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"co-pay?"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"Yes. We will reimburse you for co-pays for "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"reasonable"},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"medical expenses related to the accident "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"within"},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":" the"},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"policy limit. Just send us a copy of the "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"bill."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":100,"preferredWidthType":"Percent","cellWidth":203.39999389648438,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":16.600000381469727,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftIndent":14.4}}],"grid":[203.39999389648438],"tableFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":14.399999618530273,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":203.39999389648438,"preferredWidthType":"Point","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":1},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"imageString":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8AAADgAADY2Njl5eVcXFxjY2NZWVl/f3+wsLCmpqb4+PiioqKpqam7u7vV1dX2uLj2wsLhFRXzpKT3vb30sbHhCwv74+P40dH+9vbkIyO2trbBwcHLy8tsbGycnJz529v4zMzrbGzlLS3qZmblNzfrdXXoRkbvi4vvgYHlHh7CZsBOAAADpUlEQVR4nO3da1faQBSF4ekAUQlUEFs14AXxVv7/D6yaQiZx5mSEYXF2ut+PNKzyyK5diYDmR9czx34AB49C/CjE759w3jvvWr15Tdgz3atXE54f++EcIArxoxA/CvGjED8K8aMQPwrxoxA/CvGLEeZ9jPJdhfk4GyCUjb3ECGE/Q6m/q3DwfudjP0ERZYN9hKdn2hvd3+0jHJz5/kBVuTk96bbQUEjhYR9ckiikUH8UUqg/CinUH4UU6o9CCvVHIYX6o5BC/VFIof4opFB/FFKoPwop1B+FFOqPQgrjyxfjVC38Lxk9tnAxGqZqdKtSOE4GHA5/fuNJpDCtcNHbv4VqYYqPLjgfUViPQgrjozA2CptRSGF8/59w+Wrt+rr1btNna1cPzg0wwuXavncxabnX7PfHYYXzlYARvlobQZyUR9mXm+1NMEK7SSLONgcVV9vb8IQXv4J3KSeKKlxXxNCzONkeYp8AV3p9UT1+P3FWHVAsq5thhGZSEb1DrSZq7dS5HUdoLiuBZ6jORG3tCwAkNJfCUJ2Jrqe1P0ESCkMNTdSACYNDDU7UoAkDQw1P1MAJvUMVJmrwhJ6hShM1gMIvQxUnahCFjaHKEzWQQneoxR95ogZTWBuqPFEDKnSHKk/UoArdoYoTNbDC5lBDEzW4QjMpYiZqgIXG/S76JhwHK5zVVipcnkIVuv/RW/HyFKhwYhuFr6NiCmdNoDBUSGFjovJQEYXuRN9ahwoorJ8uSZenPsMTNk+X2q6jwgm/ntHL11HhhL4zenmoYEL/Gb04VCxh6KKTNFQoYfiikzBUJKF00Sk8VCChfF00OFQcYdt10dBQYYRT5xn0n9G7Q0X8GfCzNNEyZ6iPgD/HlydaVg11DfhajJaJlm2HugIUrlomWrYZKuJKHz6vHhbSM/hROdRnxNe1meuXYvW0DB6+aflYrB7dlzDiCM3N1dVN6GDhMCDhjlHYjEIK46MwNgqbUUhhfJ/vA07wO8N1vw94ONo/3e/lTpVOYfc/UyG//ZmqW52fi/FuTNW3/lZ+eguF+qOQQv1RSKH+KKRQfxRSqD8KKdQfhRTqj0IK9UchhfqjkEL9UUih/iikUH8UUqg/CmXh6Hsv3jlK+wnvD/vgkrSHMMuyu1P9ZdmuwnycDQYn+svG3n9KEUKT9zHyf6+IEWJHIX4U4kchfhTiRyF+FOJHIX4U4kchfnVhijeZa6sunCf4ZdPamteEHY5C/CjEr/vCv0ec0g+AtS1QAAAAAElFTkSuQmCC","isMetaFile":false,"width":156,"height":30,"iscrop":false,"name":"Picture 3","visible":true,"widthScale":594.2857,"heightScale":117.64706,"verticalPosition":0,"verticalOrigin":"Margin","verticalAlignment":"None","horizontalPosition":0,"horizontalOrigin":"Margin","horizontalAlignment":"None","allowOverlap":true,"textWrappingStyle":"Inline","textWrappingType":"Both","layoutInCell":true,"zOrderPosition":2147483647}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#000000FF","foregroundColor":"empty","textureStyle":"TextureSolid"},"preferredWidth":203.39999389648438,"preferredWidthType":"Point","cellWidth":203.39999389648438,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftIndent":14.4}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"boldBidi":true,"fontSizeBidi":12},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontColor":"#231F1FFF","boldBidi":true,"fontSizeBidi":9},"text":"When will I hear from Allstate?"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"We will contact you periodically to discuss the status"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"inlines":[{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"of your claim, or if we have any questions. Feel free "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"to"},{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":9,"fontColor":"#231F1FFF","fontSizeBidi":9},"text":"call us anytime regarding your medical claim."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":203.39999389648438,"preferredWidthType":"Point","cellWidth":203.39999389648438,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":58,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftIndent":14.4}}],"grid":[489.6000003814697],"tableFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":14.399999618530273,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":1},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u000b"},{"characterFormat":{},"text":"\u000b"},{"characterFormat":{},"text":"\u000b"},{"characterFormat":{},"text":"\u000b"}]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"imageString":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8AAADgAADY2Njl5eVcXFxjY2NZWVl/f3+wsLCmpqb4+PiioqKpqam7u7vV1dX2uLj2wsLhFRXzpKT3vb30sbHhCwv74+P40dH+9vbkIyO2trbBwcHLy8tsbGycnJz529v4zMzrbGzlLS3qZmblNzfrdXXoRkbvi4vvgYHlHh7CZsBOAAADpUlEQVR4nO3da1faQBSF4ekAUQlUEFs14AXxVv7/D6yaQiZx5mSEYXF2ut+PNKzyyK5diYDmR9czx34AB49C/CjE759w3jvvWr15Tdgz3atXE54f++EcIArxoxA/CvGjED8K8aMQPwrxoxA/CvGLEeZ9jPJdhfk4GyCUjb3ECGE/Q6m/q3DwfudjP0ERZYN9hKdn2hvd3+0jHJz5/kBVuTk96bbQUEjhYR9ckiikUH8UUqg/CinUH4UU6o9CCvVHIYX6o5BC/VFIof4opFB/FFKoPwop1B+FFOqPQgrjyxfjVC38Lxk9tnAxGqZqdKtSOE4GHA5/fuNJpDCtcNHbv4VqYYqPLjgfUViPQgrjozA2CptRSGF8/59w+Wrt+rr1btNna1cPzg0wwuXavncxabnX7PfHYYXzlYARvlobQZyUR9mXm+1NMEK7SSLONgcVV9vb8IQXv4J3KSeKKlxXxNCzONkeYp8AV3p9UT1+P3FWHVAsq5thhGZSEb1DrSZq7dS5HUdoLiuBZ6jORG3tCwAkNJfCUJ2Jrqe1P0ESCkMNTdSACYNDDU7UoAkDQw1P1MAJvUMVJmrwhJ6hShM1gMIvQxUnahCFjaHKEzWQQneoxR95ogZTWBuqPFEDKnSHKk/UoArdoYoTNbDC5lBDEzW4QjMpYiZqgIXG/S76JhwHK5zVVipcnkIVuv/RW/HyFKhwYhuFr6NiCmdNoDBUSGFjovJQEYXuRN9ahwoorJ8uSZenPsMTNk+X2q6jwgm/ntHL11HhhL4zenmoYEL/Gb04VCxh6KKTNFQoYfiikzBUJKF00Sk8VCChfF00OFQcYdt10dBQYYRT5xn0n9G7Q0X8GfCzNNEyZ6iPgD/HlydaVg11DfhajJaJlm2HugIUrlomWrYZKuJKHz6vHhbSM/hROdRnxNe1meuXYvW0DB6+aflYrB7dlzDiCM3N1dVN6GDhMCDhjlHYjEIK46MwNgqbUUhhfJ/vA07wO8N1vw94ONo/3e/lTpVOYfc/UyG//ZmqW52fi/FuTNW3/lZ+eguF+qOQQv1RSKH+KKRQfxRSqD8KKdQfhRTqj0IK9UchhfqjkEL9UUih/iikUH8UUqg/CmXh6Hsv3jlK+wnvD/vgkrSHMMuyu1P9ZdmuwnycDQYn+svG3n9KEUKT9zHyf6+IEWJHIX4U4kchfhTiRyF+FOJHIX4U4kchfnVhijeZa6sunCf4ZdPamteEHY5C/CjEr/vCv0ec0g+AtS1QAAAAAElFTkSuQmCC","isMetaFile":false,"width":116.25,"height":32.99999000000001,"iscrop":false,"name":"Picture 4","alternativeText":"Allstate","visible":true,"widthScale":442.85715,"heightScale":129.41176,"verticalPosition":0,"verticalOrigin":"Margin","verticalAlignment":"None","horizontalPosition":0,"horizontalOrigin":"Margin","horizontalAlignment":"None","allowOverlap":true,"textWrappingStyle":"Inline","textWrappingType":"Both","layoutInCell":true,"zOrderPosition":2147483647}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"fontSize":6,"fontFamily":"Cambria","fontColor":"#231F1FFF","fontSizeBidi":6,"fontFamilyBidi":"Cambria"},"text":"©2012 Allstate Insurance Company. allstate.com 03/12"},{"characterFormat":{"fontSize":6,"fontFamily":"Cambria","fontColor":"#231F1FFF","fontSizeBidi":6,"fontFamilyBidi":"Cambria"},"text":"\u000b"},{"characterFormat":{"fontSize":6,"fontFamily":"Cambria","fontColor":"#231F1FFF","fontSizeBidi":6,"fontFamilyBidi":"Cambria"},"text":"D10753"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":221.39999389648438,"preferredWidthType":"Point","cellWidth":221.39999389648438,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":221.39999389648438,"preferredWidthType":"Point","cellWidth":221.39999389648438,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}}],"grid":[221.39999389648438,221.39999389648438],"tableFormat":{"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":2},{"paragraphFormat":{"leftIndent":216,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":1,"fontSizeBidi":1},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":504,"height":10.3275,"widthScale":100,"heightScale":100,"verticalPosition":707.75,"verticalOrigin":"Margin","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":0,"horizontalOrigin":"Margin","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251657216,"allowOverlap":true,"textWrappingStyle":"InFrontOfText","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"RoundedRectangle","fillFormat":{"color":"#FFFFFFFF","fill":false},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":false},"textFrame":{"textVerticalAlignment":"Top","leftMargin":0,"rightMargin":0,"topMargin":0,"bottomMargin":0,"blocks":[{"paragraphFormat":{"styleName":"DPSTNR101","listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"inlines":[{"characterFormat":{"fontSize":9,"fontSizeBidi":9},"text":"CP1F073"}]}]}}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":1,"fontSizeBidi":1},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"DPSTNR101","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Cambria","fontSizeBidi":11,"fontFamilyBidi":"Cambria"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Cambria","fontSizeBidi":11,"fontFamilyBidi":"Cambria"},"text":"0180731242 AE9"}]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"DPSTNR101","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Cambria","fontSizeBidi":11,"fontFamilyBidi":"Cambria"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Cambria","fontSizeBidi":11,"fontFamilyBidi":"Cambria"},"text":"0180731242 AE9"}]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"DPSTNR101","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Cambria","fontSizeBidi":11,"fontFamilyBidi":"Cambria"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Cambria","fontSizeBidi":11,"fontFamilyBidi":"Cambria"},"text":"0180731242 AE9"}]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":12,"fontFamily":"Arial","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","boldBidi":false,"italicBidi":false,"fontSizeBidi":12,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":1,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level1","listFormat":{},"keepWithNext":true},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Normal","next":"Normal"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level2","listFormat":{},"keepWithNext":true},"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","boldBidi":true,"fontFamilyBidi":"Arial"},"basedOn":"Normal","next":"Normal"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level3","listFormat":{},"keepWithNext":true},"characterFormat":{"fontSize":8,"fontSizeBidi":8},"basedOn":"Normal","next":"Normal"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level4","listFormat":{},"keepWithNext":true},"characterFormat":{"bold":true,"fontSize":9,"boldBidi":true,"fontSizeBidi":9},"basedOn":"Normal","next":"Normal"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","outlineLevel":"Level5","listFormat":{},"keepWithNext":true},"characterFormat":{"bold":true,"fontSize":8,"boldBidi":true,"fontSizeBidi":8},"basedOn":"Normal","next":"Normal"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","outlineLevel":"Level6","listFormat":{},"keepWithNext":true},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Normal","next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"empty"}},{"name":"DPSAR11BOLDCENTERCar","type":"Character","characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"DPSAR11BOLDCENTER","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":11},"link":"DPSAR11BOLDCENTERCar","next":"DPSAR11BOLDCENTER"},{"name":"DPSAR11LISTNUMBERUPPERCASECar","type":"Character","characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"DPSAR11LISTNUMBERUPPERCASE","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":11,"fontColor":"#000000FF","fontSizeBidi":11},"link":"DPSAR11LISTNUMBERUPPERCASECar","next":"DPSAR11LISTNUMBERUPPERCASE"},{"name":"DPSTM10Column2Car","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTM10Column2","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"link":"DPSTM10Column2Car","next":"DPSTM10Column2"},{"name":"DPSTMR10Column2Car","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTMR10Column2","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"link":"DPSTMR10Column2Car","next":"DPSTMR10Column2"},{"name":"DPSTNR1011Car","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR1011","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR1011Car","next":"DPSTNR1011"},{"name":"DPSTNR1011ptCar","type":"Character","characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR1011pt","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR1011ptCar","next":"DPSTNR1011pt"},{"name":"DPSTNR10RIGHTCar","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR10RIGHT","type":"Paragraph","paragraphFormat":{"textAlignment":"Right","listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR10RIGHTCar","next":"DPSTNR10RIGHT"},{"name":"DPSTNR10UPPERCASECar","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman","allCaps":true},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR10UPPERCASE","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman","allCaps":true},"link":"DPSTNR10UPPERCASECar","next":"DPSTNR10UPPERCASE"},{"name":"DPSTNR11Car","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR11","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR11Car","next":"DPSTNR11"},{"name":"DPSTNR12Car","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR12","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"#000000FF","fontFamilyBidi":"Times New Roman"},"link":"DPSTNR12Car","next":"DPSTNR12"},{"name":"DPSTNR8ArialnarrowArialNarrow8ptCar","type":"Character","characterFormat":{"fontSize":7,"fontFamily":"Arial Narrow","fontColor":"#000000FF","fontSizeBidi":7,"fontFamilyBidi":"Arial Narrow"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR8ArialnarrowArialNarrow8pt","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":7,"fontFamily":"Arial Narrow","fontColor":"#000000FF","fontSizeBidi":7,"fontFamilyBidi":"Arial Narrow"},"link":"DPSTNR8ArialnarrowArialNarrow8ptCar","next":"DPSTNR8ArialnarrowArialNarrow8pt"},{"name":"DPSTNR8BoldCenteredCar","type":"Character","characterFormat":{"bold":true,"fontSize":8,"fontFamily":"Times New Roman","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":8,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR8BoldCentered","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","listFormat":{}},"characterFormat":{"bold":true,"fontSize":8,"fontFamily":"Times New Roman","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":8,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR8BoldCenteredCar","next":"DPSTNR8BoldCentered"},{"name":"Style023Car","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":12,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Style023","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontColor":"#000000FF"},"link":"Style023Car","next":"Style023"},{"name":"TableTextCar","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"TableText","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"#000000FF","fontFamilyBidi":"Times New Roman"},"link":"TableTextCar","next":"TableText"},{"name":"heading1Car","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"heading1","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"#000000FF","fontFamilyBidi":"Times New Roman"},"next":"heading1"},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"TOC 1","type":"Paragraph","paragraphFormat":{"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 1"},{"name":"TOC 2","type":"Paragraph","paragraphFormat":{"leftIndent":11.050000190734863,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 2"},{"name":"TOC 3","type":"Paragraph","paragraphFormat":{"leftIndent":22.100000381469727,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 3"},{"name":"TOC 4","type":"Paragraph","paragraphFormat":{"leftIndent":32.900001525878906,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 4"},{"name":"TOC 5","type":"Paragraph","paragraphFormat":{"leftIndent":43.95000076293945,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 5"},{"name":"TOC 6","type":"Paragraph","paragraphFormat":{"leftIndent":55,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 6"},{"name":"TOC 7","type":"Paragraph","paragraphFormat":{"leftIndent":66.05000305175781,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 7"},{"name":"TOC 8","type":"Paragraph","paragraphFormat":{"leftIndent":77.0999984741211,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 8"},{"name":"TOC 9","type":"Paragraph","paragraphFormat":{"leftIndent":87.9000015258789,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 9"},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR10B01","type":"Paragraph","paragraphFormat":{"listFormat":{"listId":2}},"characterFormat":{},"basedOn":"DPSTNR101","next":"DPSTNR10B01"},{"name":"DPSTNR101","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"next":"DPSTNR101"},{"name":"DPSTNR10B02","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{},"basedOn":"DPSTNR101","next":"DPSTNR10B02"},{"name":"DPSTNR10B03","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{},"basedOn":"DPSTNR101","next":"DPSTNR10B03"},{"name":"DPSTNR10B04","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":72,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":108,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":144,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":180,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":216,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":252,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":288,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":324,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":360,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":396,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"basedOn":"DPSTNR101","next":"DPSTNR10B04"},{"name":"DPSTNR10LISTNUMBER","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","next":"DPSTNR10LISTNUMBER"},{"name":"DPSTNR10LIST","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"afterSpacing":0,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"basedOn":"List Continue","next":"DPSTNR10LIST"},{"name":"List Continue","type":"Paragraph","paragraphFormat":{"leftIndent":14.149999618530273,"afterSpacing":6,"listFormat":{}},"characterFormat":{},"basedOn":"DPSTNR101","next":"List Continue"},{"name":"DPSTNR10Column2","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontColor":"empty"},"next":"DPSTNR10Column2"},{"name":"DPSTNR10LISTLETTER","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":72,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":108,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":144,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":180,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":216,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":252,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":288,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":324,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":360,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":396,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","next":"DPSTNR10LISTLETTER"},{"name":"Signature","type":"Paragraph","paragraphFormat":{"afterSpacing":6,"listFormat":{}},"characterFormat":{"bold":true,"fontSize":30,"fontFamily":"Script","fontColor":"empty","boldBidi":true,"fontSizeBidi":30,"fontFamilyBidi":"Script"},"next":"Signature"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Tahoma","fontSizeBidi":8,"fontFamilyBidi":"Tahoma"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":8,"fontFamily":"Tahoma","fontColor":"empty","fontSizeBidi":8,"fontFamilyBidi":"Tahoma"},"basedOn":"Default Paragraph Font"},{"name":"Salutation","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"Block Text","type":"Paragraph","paragraphFormat":{"leftIndent":7.199999809265137,"rightIndent":7.199999809265137,"listFormat":{},"keepLinesTogether":true},"characterFormat":{"fontSize":14,"fontSizeBidi":14},"basedOn":"Normal","next":"Block Text"},{"name":"DPSTNR10 Char","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"Re Caption","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#00000000","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"basedOn":"Normal","next":"Re Caption"},{"name":"Body Text Left","type":"Paragraph","paragraphFormat":{"beforeSpacing":6,"afterSpacing":6,"listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#00000000","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"basedOn":"Normal","next":"Body Text Left"},{"name":"Body Text Indent","type":"Paragraph","paragraphFormat":{"leftIndent":-27,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":72,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":108,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":144,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":180,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":216,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":252,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":288,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":324,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":360,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":396,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","next":"Body Text Indent"},{"name":"Body Text 2","type":"Paragraph","paragraphFormat":{"rightIndent":-18,"listFormat":{},"tabs":[{"position":9,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":9,"boldBidi":true,"fontSizeBidi":9},"basedOn":"Normal","next":"Body Text 2"},{"name":"DPSTNR10","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR10Car","next":"DPSTNR10"},{"name":"DPSTNR10Car","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Hyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#0000FFFF"},"basedOn":"Default Paragraph Font"},{"name":"Default","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Allstate Sans","fontColor":"#000000FF","fontFamilyBidi":"Allstate Sans"},"next":"Default"},{"name":"annotation reference","type":"Character","characterFormat":{"fontSize":8,"fontColor":"empty","fontSizeBidi":8},"basedOn":"Default Paragraph Font"},{"name":"annotation text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"basedOn":"Normal","link":"Comment Text Char","next":"annotation text"},{"name":"Comment Text Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"annotation subject","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"annotation text","link":"Comment Subject Char","next":"annotation text"},{"name":"Comment Subject Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Comment Text Char"},{"name":"Title","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","lineSpacing":24,"lineSpacingType":"AtLeast","listFormat":{},"tabs":[{"position":21.600000381469727,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":72,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":108,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":144,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":180,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":216,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":252,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":288,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":324,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":360,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":396,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Normal","next":"Title"},{"name":"Body Text","type":"Paragraph","paragraphFormat":{"rightIndent":-40.5,"listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"basedOn":"Normal","next":"Body Text"},{"name":"Body Text Indent 2","type":"Paragraph","paragraphFormat":{"leftIndent":72,"firstLineIndent":-72,"lineSpacing":12,"lineSpacingType":"AtLeast","listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":108,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":144,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":180,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":216,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":252,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":288,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":324,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":360,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":396,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":504,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":540,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":576,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":612,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":648,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":684,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":720,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"basedOn":"Normal","next":"Body Text Indent 2"},{"name":"Body Text 3","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"basedOn":"Normal","next":"Body Text 3"},{"name":"heading11","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"#000000FF","fontFamilyBidi":"Times New Roman"},"link":"heading1Car","next":"heading11"},{"name":"BodyTextCentered","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","beforeSpacing":12,"lineSpacing":12,"lineSpacingType":"Exactly","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"basedOn":"Body Text","next":"BodyTextCentered"},{"name":"BodyText00","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":9,"fontFamily":"Century Schoolbook","boldBidi":true,"fontSizeBidi":9,"fontFamilyBidi":"Century Schoolbook"},"basedOn":"Body Text","next":"BodyText00"},{"name":"BodyText00Bold","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"basedOn":"BodyText00","next":"BodyText00Bold"},{"name":"HeaderCenteredBold0012","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","lineSpacing":12,"lineSpacingType":"Exactly","listFormat":{},"tabs":[{"position":282,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":564,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":12,"fontFamily":"CG Times","boldBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"CG Times"},"basedOn":"Normal","next":"HeaderCenteredBold0012"},{"name":"Plain Text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"#2F5496FF","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"basedOn":"Normal","link":"Plain Text Char","next":"Plain Text"},{"name":"Plain Text Char","type":"Character","characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"#2F5496FF","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"basedOn":"Default Paragraph Font"},{"name":"Caption","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Normal","next":"Normal"},{"name":"DPSCOURRIERCar","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"basedOn":"Default Paragraph Font"},{"name":"DPSCOURRIER","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"link":"DPSCOURRIERCar","next":"DPSCOURRIER"},{"name":"DPSTNR8Car","type":"Character","characterFormat":{"fontSize":8,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":8,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR8","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":8,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR8Car","next":"DPSTNR8"},{"name":"NormalSubCar","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"H1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"listFormat":{"listId":0}},"characterFormat":{"fontSize":16,"fontColor":"#000000FF","fontSizeBidi":16},"next":"H1"},{"name":"H2","type":"Paragraph","paragraphFormat":{"leftIndent":36,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":1}},"characterFormat":{"fontSize":13,"fontColor":"#000000FF","fontSizeBidi":13},"next":"H2"},{"name":"H3","type":"Paragraph","paragraphFormat":{"leftIndent":72,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":2}},"characterFormat":{"fontColor":"#000000FF"},"next":"H3"},{"name":"H4","type":"Paragraph","paragraphFormat":{"leftIndent":108,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":3}},"characterFormat":{"fontColor":"#000000FF"},"next":"H4"},{"name":"H5","type":"Paragraph","paragraphFormat":{"leftIndent":144,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":4}},"characterFormat":{"fontColor":"#000000FF"},"next":"H5"},{"name":"H6","type":"Paragraph","paragraphFormat":{"leftIndent":180,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":5}},"characterFormat":{"fontColor":"#000000FF"},"next":"H6"},{"name":"H7","type":"Paragraph","paragraphFormat":{"leftIndent":216.0500030517578,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":6}},"characterFormat":{"fontColor":"#000000FF"},"next":"H7"},{"name":"H8","type":"Paragraph","paragraphFormat":{"leftIndent":252.0500030517578,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":7}},"characterFormat":{"fontColor":"#000000FF"},"next":"H8"},{"name":"H9","type":"Paragraph","paragraphFormat":{"leftIndent":288.04998779296875,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":8}},"characterFormat":{"fontColor":"#000000FF"},"next":"H9"}],"lists":[{"abstractListId":0,"levelOverrides":[],"listId":0},{"abstractListId":2,"levelOverrides":[],"listId":2}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"Arabic","numberFormat":"%1) ","restartLevel":0,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"LowLetter","numberFormat":"%2) ","restartLevel":1,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"LowRoman","numberFormat":"%3) ","restartLevel":2,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"Arabic","numberFormat":"(%4) ","restartLevel":3,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"LowLetter","numberFormat":"(%5) ","restartLevel":4,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"LowRoman","numberFormat":"(%6) ","restartLevel":5,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"Arabic","numberFormat":"%7. ","restartLevel":6,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"LowLetter","numberFormat":"%8. ","restartLevel":7,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"LowRoman","numberFormat":"%9. ","restartLevel":8,"startAt":1}]},{"abstractListId":2,"levels":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":72,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":108,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":144,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":180,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":252,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":288,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":324,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%9.","restartLevel":8,"startAt":1}]}],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Table position after table wrap validation', () => {
  let editor: DocumentEditor = undefined;
  beforeAll(() => {
    let ele: HTMLElement = createElement('div', { id: 'container' });
    // ele.setAttribute("style", "width: 1500px");
    document.body.appendChild(ele);
    DocumentEditor.Inject(Selection, Editor)
    editor = new DocumentEditor({ isReadOnly: false, enableEditor: true});
    (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.width = '1500px';
    editor.appendTo('#container');
  });
  afterAll((done) => {
    editor.destroy();
    document.body.removeChild(document.getElementById('container'));
    editor = undefined;
    document.body.innerHTML = '';
    setTimeout(function () {
      done();
    }, 1000);
  });
  it('Table position after table wrap validation', () => {
    editor.open(JSON.stringify(tableWrap));
    expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[8] as TableWidget).x).toBeLessThan(90);
  });
});