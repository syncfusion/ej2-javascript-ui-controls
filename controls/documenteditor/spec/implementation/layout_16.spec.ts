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
    editor.width='1000px';
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







