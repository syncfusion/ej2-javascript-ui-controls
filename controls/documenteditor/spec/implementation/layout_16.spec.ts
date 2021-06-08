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
  it('Checkbox with character style validation', () => {
    editor.open(JSON.stringify(checkboxWithStyle));
    expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0].characterFormat.fontSize).toBe(9.6);
  });
  it('Checkbox with paragraph character format validation', () => {
    editor.open(JSON.stringify(checkboxWithStyle));
    expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).childWidgets[0] as LineWidget).children[0].characterFormat.fontSize).toBe(9.6);
  });
});

let splitTable: any = {"sections":[{"sectionFormat":{"pageWidth":841.9000244140625,"pageHeight":595.2999877929688,"leftMargin":49.650001525878906,"rightMargin":20,"topMargin":50,"bottomMargin":20,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"MyStyle","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Part  3"},{"characterFormat":{"fontColor":"empty"},"text":"        Technical Compliance "}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Sr."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Description"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":6,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"TLG"},{"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":" Compliance "},{"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"(Yes/ No)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":35.20000076293945,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":true,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"1"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Vintage of Equipment"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": The equipment should be of the latest manufacture with full defined life available. The "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"year of manufacture should be clearly mentioned."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":37.5,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":9,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"2"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Deliverables"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": The list of deliverable for development of VR training facility is as follows:"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Sr."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":36.70000076293945,"preferredWidthType":"Point","cellWidth":36.70000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Item"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":389.79998779296875,"preferredWidthType":"Point","cellWidth":389.79998779296875,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Type"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":92.1500015258789,"preferredWidthType":"Point","cellWidth":92.1500015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Qty."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":79.55000305175781,"preferredWidthType":"Point","cellWidth":79.55000305175781,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3}],"rowFormat":{"height":22.700000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(a)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":36.70000076293945,"preferredWidthType":"Point","cellWidth":36.70000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":2.8499999046325684,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"MPP Emulator of Equipment Space Software (loaded on VR device)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":389.79998779296875,"preferredWidthType":"Point","cellWidth":389.79998779296875,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Software"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":92.1500015258789,"preferredWidthType":"Point","cellWidth":92.1500015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"01"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":79.55000305175781,"preferredWidthType":"Point","cellWidth":79.55000305175781,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3}],"rowFormat":{"height":22.700000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(b)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":36.70000076293945,"preferredWidthType":"Point","cellWidth":36.70000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":2.8499999046325684,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Instructor Console and Server"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":389.79998779296875,"preferredWidthType":"Point","cellWidth":389.79998779296875,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Hardware"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":92.1500015258789,"preferredWidthType":"Point","cellWidth":92.1500015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"01"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":79.55000305175781,"preferredWidthType":"Point","cellWidth":79.55000305175781,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3}],"rowFormat":{"height":22.700000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(c)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":36.70000076293945,"preferredWidthType":"Point","cellWidth":36.70000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":2.8499999046325684,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"VR Device (Headset, Controller)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":389.79998779296875,"preferredWidthType":"Point","cellWidth":389.79998779296875,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Hardware"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":92.1500015258789,"preferredWidthType":"Point","cellWidth":92.1500015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"03"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":79.55000305175781,"preferredWidthType":"Point","cellWidth":79.55000305175781,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3}],"rowFormat":{"height":22.700000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(d)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":36.70000076293945,"preferredWidthType":"Point","cellWidth":36.70000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":2.8499999046325684,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"LED/ LCD Screen - 65”"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":389.79998779296875,"preferredWidthType":"Point","cellWidth":389.79998779296875,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Hardware"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":92.1500015258789,"preferredWidthType":"Point","cellWidth":92.1500015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"01"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":79.55000305175781,"preferredWidthType":"Point","cellWidth":79.55000305175781,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3}],"rowFormat":{"height":22.700000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(e)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":36.70000076293945,"preferredWidthType":"Point","cellWidth":36.70000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":2.8499999046325684,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"VR suit akin to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Holo"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":" suit or having equivalent functionality"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":389.79998779296875,"preferredWidthType":"Point","cellWidth":389.79998779296875,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Hardware"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":92.1500015258789,"preferredWidthType":"Point","cellWidth":92.1500015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"01"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":79.55000305175781,"preferredWidthType":"Point","cellWidth":79.55000305175781,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3}],"rowFormat":{"height":22.700000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(f)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":36.70000076293945,"preferredWidthType":"Point","cellWidth":36.70000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":2.8499999046325684,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Comprehensive warranty"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":389.79998779296875,"preferredWidthType":"Point","cellWidth":389.79998779296875,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Service"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":92.1500015258789,"preferredWidthType":"Point","cellWidth":92.1500015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"01 Year"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":79.55000305175781,"preferredWidthType":"Point","cellWidth":79.55000305175781,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3}],"rowFormat":{"height":22.700000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(g)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":36.70000076293945,"preferredWidthType":"Point","cellWidth":36.70000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":2.8499999046325684,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Comprehensive AMC"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":389.79998779296875,"preferredWidthType":"Point","cellWidth":389.79998779296875,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Service"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":92.1500015258789,"preferredWidthType":"Point","cellWidth":92.1500015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"03 Years"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":79.55000305175781,"preferredWidthType":"Point","cellWidth":79.55000305175781,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3}],"rowFormat":{"height":22.700000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}}],"grid":[36.70000076293945,389.79998779296875,92.1500015258789,79.55000305175781],"tableFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":4},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":231.89999389648438,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":6,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"3"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":30,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Scope of Work"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": The VR training facility should provide the means for following:"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes "}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":30,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":34,"firstLineIndent":-34,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(a) Managing training sessions by creating new or by using predefined and stored training scenarios"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":34,"firstLineIndent":-34,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(b) Editing/ modifying training scenarios prior to and during training session"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":19.850000381469727,"firstLineIndent":-19.850000381469727,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(c) Insert or delete events, accidental events or modify environmental parameters prior to or during training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"session"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":34.29999923706055,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":19.850000381469727,"firstLineIndent":-19.850000381469727,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(d) Capture and load a snapshot of the trainee view"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":19.850000381469727,"firstLineIndent":-19.850000381469727,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(e) Execute training scenarios for the following:"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":34.849998474121094,"firstLineIndent":-17.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":6,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Evolutions "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"during "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Reactor "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"operation"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":4,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Sampling "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"primary "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"water"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":4,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Transfer "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"HP "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Gas"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":4,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Isolation "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"primary "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"loop "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"case "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"leaks"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":34.849998474121094,"firstLineIndent":-17.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":6,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Evolutions "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"prior "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Start-up "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Reactor"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":3,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Checklisting"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":" of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"valves"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":3,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Venting "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Primary "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Loop"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":3,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Venting "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Control "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Rod "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Drive "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Mechanisms"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":3,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Preparation "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Emergency "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Cooling "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Down "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"System "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"operation"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":3,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Inspection "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Automatic "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Safety "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Devices"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":34.849998474121094,"firstLineIndent":-17.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":6,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Evolutions "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"during "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Emergencies"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Actions "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Radiation "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Emergency "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Team"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Actions "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Decontamination "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Team"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Actions "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"case "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"HP "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Gas "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"leak "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Equipment "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Space"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Actions "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"case "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Loss "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Coolant "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Accident "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(LOCA)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":34.849998474121094,"firstLineIndent":-17.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":6,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Evolutions "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"during "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Maintenance"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":0,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Manual "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"operation "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"valves"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":0,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Pressure "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"testing "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Primary "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"loop"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":0,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Charging "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"HP "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Gas "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"shore"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":51.04999923706055,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":0,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Replacement "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"3K "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"inventory"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":19.850000381469727,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(f) "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"See "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"screens "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"observe "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"trainees "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"actions "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"operate "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"local "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"commands "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"simulated "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"installations."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":19.850000381469727,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(g) "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"View "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"current "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"session "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"stop "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"session "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"safety "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"pedagogical "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"reasons"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":19.850000381469727,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(h) "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Watch "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"hear "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"current "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"session "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"video/ "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"audio "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"means "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(with "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"an "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"option "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"mute) "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"evaluation "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"safety "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"purpose"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":37.5,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":19.850000381469727,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":5,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Recording "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"100 "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"hours "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"re-play "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(with "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"options "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"skip "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"specific "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"controllable "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"speeds/ "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"time) "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"evaluation "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"sessions "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"manage "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"recorded "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"sessions."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":40.5,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":6,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"4"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Acceptance "},{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Criteria"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"VR "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"facility "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"will "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"accepted "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"based "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"approved "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"User "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Acceptance "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Criteria "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"promulgated "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"INS "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Satavahana"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"/ "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"SAUW. "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"These "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"may "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"include "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Factory "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Acceptance "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Trials "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(FATs) "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"OEMs "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"premises, "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Setting "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Work "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(STW) "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Commissioning "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"all "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"performance "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"parameters "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"system. "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"User "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"acceptance "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"criteria "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"all "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"performance "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"parameters "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"are "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"mutually "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"decided "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"between "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"OEM "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"user "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"{INS "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Satavahana"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"/ "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"SAUW}. "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"seller "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"submit "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Acceptance "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Test "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Procedure "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"VR "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"facility "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"within "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"30 "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"days "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"signing "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"contract. "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"After "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"commissioning "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"VR "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"facility "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"INS "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Satavahana"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"/ "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"SAUW, "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"acceptance "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"test "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"will "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"carried "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"out "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"per "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"mutually "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"agreed "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Test "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"document. "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"These "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"acceptance "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"tests "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"like "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"STW "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"& "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Functional "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Checks "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"will "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"carried "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"out "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"jointly "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Seller "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Buyer "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"representatives."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":165.4499969482422,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":6,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"5"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Requirement of Installation/ Commissioning"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": The SUPPLIER at his expense will cater for Commissioning of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"VR Training facility at INS "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Satavahana"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"/ SAUW including electrical and civil works."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":36,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":6,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"6"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Factory Acceptance Trials (FATs)"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": FATs will be done on the VR Training facility GUI software / hardware at "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"OEM premises as per the approved Acceptance Test Procedure."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":36.75,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":12,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"7"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Documentation"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": Softcopy and hard copy (03 sets) of documentation should be sufficient for training of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"operators and maintenance staff is to be supplied by the SELLER. Documentation to be supplied by the Seller is "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"tabulated below:"}]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Sr."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":43.79999923706055,"preferredWidthType":"Point","cellWidth":100.2738284741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Document Details"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":191.35000610351562,"preferredWidthType":"Point","cellWidth":445.4070422070313,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Qty."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":63.79999923706055,"preferredWidthType":"Point","cellWidth":147.6039084741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":19.850000381469727,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(a)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":43.79999923706055,"preferredWidthType":"Point","cellWidth":100.2738284741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"QMP Document"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":191.35000610351562,"preferredWidthType":"Point","cellWidth":445.4070422070313,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"01"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":63.79999923706055,"preferredWidthType":"Point","cellWidth":147.6039084741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":19.850000381469727,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(b)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":43.79999923706055,"preferredWidthType":"Point","cellWidth":100.2738284741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"MPP User Manual"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":191.35000610351562,"preferredWidthType":"Point","cellWidth":445.4070422070313,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"01"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":63.79999923706055,"preferredWidthType":"Point","cellWidth":147.6039084741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":19.850000381469727,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(c)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":43.79999923706055,"preferredWidthType":"Point","cellWidth":100.2738284741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Acceptance test plan"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":191.35000610351562,"preferredWidthType":"Point","cellWidth":445.4070422070313,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"01"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":63.79999923706055,"preferredWidthType":"Point","cellWidth":147.6039084741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":19.850000381469727,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}}],"grid":[100.2738284741211,445.4070422070313,147.6039084741211],"tableFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":3},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":45.45000076293945,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"8"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Training"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"place "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"(OEM "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"customer's "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"premises) "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"duration "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"will "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"mutually "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"agreed. "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Detailed "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"draft "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"schedule "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"shall "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"prepared "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Supplier "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"this "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"purpose "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"approved "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Customer. "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"material "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"shall "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"also "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"provided "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Supplier. "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"shall "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"divided "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"into "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"batches "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"date "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"start "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"each "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"batch, "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"duration "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"etc, "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"will "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"agreed "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"upon "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Seller "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Buyer "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"subject "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"overall "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"schedule. "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Details "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"programme "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"recommended "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Seller "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"shall "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"provided "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"an "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"annexure "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"proposal. "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"imparted "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"IN "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"personnel "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"operation, "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"exploitation "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"maintenance."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":105,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"9"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Product Support"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": The Supplier shall provide product support in terms of maintenance activities, repairs and "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"spares for a period of 10 years. On expiry of the said mandatory period or at any stage, the Supplier shall notify "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the Customer prior to closing the production line so as to enable Life Time Buy of spares. The said aspect would "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"also form an integral part of the contract."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":68.25,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"10"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Comprehensive Warranty"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"01 year"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":" comprehensive warranty for all equipment is to be provided from the date of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Installation & Commissioning (I&C) of the VR Training facility. Adequate spares are to be stocked by the Seller in "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"India in order to ensure the minimum down time during the warranty. Seller is to furnish details accordingly."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":54.75,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"11"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Comprehensive AMC"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": Three years comprehensive AMC, post expiry of warranty period, should be provided at "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the expense of the SUPPLIER."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":24.200000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"12"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Monitoring of Projects/ Pre Site Inspection"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": After placement of order the Buyer at his own expense may "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"depute to the site of installation at quarterly (or as considered necessary) intervals, teams of representatives to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"review and coordinate the progress of the commitments made by both the sides under the contract."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":54.75,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"13"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Secrecy"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": It is emphasized that the information provided in the RFP and its enclosures is to be treated with "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Confidentiality and access to information be restricted to only a select few personnel associated directly with the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Project. No copies of the RFP and its enclosures will be made."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":51.75,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":6,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"14"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":3,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Evaluation of the Seller"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": The seller will be evaluated on the following criteria:"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":19.850000381469727,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":2,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"seller "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"should "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"security "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"cleared "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"firm "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Indian "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Navy "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"because "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"seller "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"will "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"have "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"an "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"access "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"sensitive "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"data "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"pertaining "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"systems "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"VR "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Training "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"facility."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":40.29999923706055,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":19.850000381469727,"firstLineIndent":-19.850000381469727,"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{"listId":2,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"seller "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"should "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"have "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"prior "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"work "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"experience "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"projects "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Indian "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Navy/ "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"HQATVP."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":24.950000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"15"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":1},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":42.599998474121094,"preferredWidthType":"Point","cellWidth":42.5999997597706,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"beforeSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","fontColor":"empty","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Scope of Civil works"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":": All Civil works towards successful installation and commissioning of VR Training facility at "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"SAUW, INS "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Satavahana"},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":" is to be undertaken by the SUPPLIER. The cost of this civil works is to be borne by the "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"SUPPLIER."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":1},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":609.5,"preferredWidthType":"Point","cellWidth":609.500018394446,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":3,"lineSpacing":1.3000000715255737,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Yes"}]},{"paragraphFormat":{"textAlignment":"Center","lineSpacing":1.3000000715255737,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"Scope as per "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"para 3(e) of "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"enclosure to Staff "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"officer SMS "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"438/VR dated "},{"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"text":"08-Mar-21."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":1},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":106.30000305175781,"preferredWidthType":"Point","cellWidth":106.30000625984586,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2}],"rowFormat":{"height":45,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}}],"grid":[42.5999997597706,609.500018394446,106.30000625984586],"tableFormat":{"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"shading":{},"leftIndent":-8.800000190734863,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":758.4000244140625,"preferredWidthType":"Point","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":3},{"paragraphFormat":{"leftIndent":21.600000381469727,"textAlignment":"Justify","beforeSpacing":2,"afterSpacing":2,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"empty","fontFamilyBidi":"Arial"},"inlines":[]},{"paragraphFormat":{"firstLineIndent":7.099999904632568,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"beforeSpacing":8,"afterSpacing":8,"lineSpacing":0.6666666865348816,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"E03210081/T"},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"\t"},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"    "},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"\t"},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"\t"},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"\t"},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"\t"},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"TLG"},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":" "},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"CORP"}]},{"paragraphFormat":{"beforeSpacing":8,"afterSpacing":8,"lineSpacing":0.6666666865348816,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"30 APRIL 2021 "},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"\t"},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"\t"},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"\t"},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"\t"},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"\t"},{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"TECHNICAL BID"}]},{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":8,"afterSpacing":8,"lineSpacing":0.6666666865348816,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Part  3"},{"characterFormat":{"fontColor":"empty"},"text":"        Technical Compliance "}]}]},"footer":{"blocks":[{"paragraphFormat":{"beforeSpacing":8,"afterSpacing":8,"lineSpacing":0.6666666865348816,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"bold":true,"fontColor":"empty","boldBidi":true},"text":"COMMERCIAL IN CONFIDENCE "}]},{"paragraphFormat":{"textAlignment":"Right","styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Page "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"PAGE 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"7"},{"characterFormat":{},"fieldType":1},{"characterFormat":{"fontColor":"empty"},"text":" of "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"NUMPAGES 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"7"},{"characterFormat":{},"fieldType":1}]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"empty"}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"MyStyle","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":14,"fontFamily":"Verdana","fontColor":"empty","fontSizeBidi":14,"fontFamilyBidi":"Verdana"},"basedOn":"Normal","next":"MyStyle"},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":225.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":225.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"}],"lists":[{"abstractListId":0,"levelOverrides":[],"listId":0},{"abstractListId":1,"levelOverrides":[],"listId":1},{"abstractListId":2,"levelOverrides":[],"listId":2},{"abstractListId":3,"levelOverrides":[],"listId":3},{"abstractListId":4,"levelOverrides":[],"listId":4},{"abstractListId":5,"levelOverrides":[],"listId":5},{"abstractListId":6,"levelOverrides":[],"listId":6}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%1)","restartLevel":0,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":1,"levels":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%1)","restartLevel":0,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":2,"levels":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%1)","restartLevel":0,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":3,"levels":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%1)","restartLevel":0,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":4,"levels":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%1)","restartLevel":0,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":5,"levels":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%1)","restartLevel":0,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":6,"levels":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"(%1)","restartLevel":0,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]}],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}};
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
  it('Validation on table splitting when removing row affected by row spanned cells ', () => {
    editor.open(splitTable);
    for (let i: number = 0; i < 6; i++) {
      editor.selection.moveDown();
    }
    editor.selection.handleRightKey();
    editor.selection.handleRightKey();
    editor.selection.handleDownKey();
    editor.editor.handleBackKey();
    expect(editor.documentHelper.pages.length).toBe(7);
  });  
  it('Validate selection when removing row affected by row spanned cells ', () => {    
    editor.selection.handleDownKey();
    editor.selection.handleShiftEndKey();
    editor.editor.handleBackKey();
    expect(editor.selection.start.paragraph.associatedCell.index).toBe(0);
  });  
});