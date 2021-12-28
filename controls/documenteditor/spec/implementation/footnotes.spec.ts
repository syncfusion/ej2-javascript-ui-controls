import { DocumentEditor } from '../../src/document-editor/document-editor';
import { DocumentHelper } from '../../src/document-editor/implementation/viewer/viewer';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { Editor } from '../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { Selection } from '../../src/document-editor/implementation/selection/selection';
import { WordExport } from '../../src/document-editor/implementation/writer/word-export';
import { SfdtExport } from '../../src/document-editor/implementation/writer/sfdt-export';
import { TableCellWidget, TableRowWidget, TableWidget } from '../../src';

let sfdtFileWithMultiPageFootNotes: any = {
    "sections": [
      {
        "sectionFormat": {
          "pageWidth": 595.4500122070312,
          "pageHeight": 841.7000122070312,
          "leftMargin": 70.9000015258789,
          "rightMargin": 70.9000015258789,
          "topMargin": 174.35000610351562,
          "bottomMargin": 63.79999923706055,
          "differentFirstPage": false,
          "differentOddAndEvenPages": false,
          "headerDistance": 35.45000076293945,
          "footerDistance": 35.45000076293945,
          "bidi": false,
          "endnoteNumberFormat": "LowerCaseRoman",
          "footNoteNumberFormat": "Arabic",
          "restartIndexForFootnotes": "DoNotRestart",
          "restartIndexForEndnotes": "DoNotRestart",
          "initialFootNoteNumber": 1,
          "initialEndNoteNumber": 1
        },
        "blocks": [
          {
            "paragraphFormat": {
              "styleName": "Normal",
              "listFormat": {
              }
            },
            "characterFormat": {
              "bold": true,
              "fontSize": 11,
              "fontColor": "empty",
              "boldBidi": true,
              "fontSizeBidi": 11
            },
            "inlines": [
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 11,
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 11
                },
                "text": "TEST1"
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
                          "leftIndent": 0,
                          "firstLineIndent": 0,
                          "afterSpacing": 0,
                          "lineSpacing": 1,
                          "lineSpacingType": "Multiple",
                          "styleName": "Message Header",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "fontColor": "empty"
                        },
                        "inlines": [
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "adresat1"
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "adresat1"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "${"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "SzanownaPani"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "}"
                          }
                        ]
                      },
                      {
                        "paragraphFormat": {
                          "leftIndent": 0,
                          "firstLineIndent": 0,
                          "afterSpacing": 0,
                          "lineSpacing": 1,
                          "lineSpacingType": "Multiple",
                          "styleName": "Message Header",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "fontColor": "empty"
                        },
                        "inlines": [
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "${"
                          },
                          {
                            "characterFormat": {
                              "highlightColor": "Yellow",
                              "fontColor": "empty"
                            },
                            "text": "adresat1"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "}"
                          }
                        ]
                      },
                      {
                        "paragraphFormat": {
                          "leftIndent": 0,
                          "firstLineIndent": 0,
                          "afterSpacing": 0,
                          "lineSpacing": 1,
                          "lineSpacingType": "Multiple",
                          "styleName": "Message Header",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "fontColor": "empty"
                        },
                        "inlines": [
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "adresat2"
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "adresat2"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "${"
                          },
                          {
                            "characterFormat": {
                              "highlightColor": "Yellow",
                              "fontColor": "empty"
                            },
                            "text": "adresat2"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "}"
                          }
                        ]
                      },
                      {
                        "paragraphFormat": {
                          "leftIndent": 0,
                          "firstLineIndent": 0,
                          "afterSpacing": 0,
                          "lineSpacing": 1,
                          "lineSpacingType": "Multiple",
                          "styleName": "Message Header",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "fontColor": "empty"
                        },
                        "inlines": [
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "adresat3"
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "adresat3"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "${"
                          },
                          {
                            "characterFormat": {
                              "highlightColor": "Yellow",
                              "fontColor": "empty"
                            },
                            "text": "adresat3"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "}"
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
                      },
                      "topMargin": 0,
                      "rightMargin": 0,
                      "leftMargin": 0,
                      "bottomMargin": 0,
                      "preferredWidth": 191.39999389648438,
                      "preferredWidthType": "Point",
                      "cellWidth": 191.39999389648438,
                      "columnSpan": 1,
                      "rowSpan": 1,
                      "verticalAlignment": "Top"
                    },
                    "columnIndex": 0
                  }
                ],
                "rowFormat": {
                  "height": 87.9000015258789,
                  "allowBreakAcrossPages": true,
                  "heightType": "AtLeast",
                  "isHeader": false,
                  "borders": {
                    "top": {
                      "hasNoneStyle": true,
                      "lineStyle": "None",
                      "lineWidth": 0
                    },
                    "left": {
                      "hasNoneStyle": true,
                      "lineStyle": "None",
                      "lineWidth": 0
                    },
                    "right": {
                      "hasNoneStyle": true,
                      "lineStyle": "None",
                      "lineWidth": 0
                    },
                    "bottom": {
                      "hasNoneStyle": true,
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
                      "hasNoneStyle": true,
                      "lineStyle": "None",
                      "lineWidth": 0
                    },
                    "vertical": {
                      "hasNoneStyle": true,
                      "lineStyle": "None",
                      "lineWidth": 0
                    }
                  },
                  "gridBefore": 0,
                  "gridAfter": 0,
                  "leftMargin": 14.2,
                  "topMargin": 14.2,
                  "rightMargin": 14.2,
                  "bottomMargin": 14.2
                }
              }
            ],
            "grid": [
              191.39999389648438
            ],
            "tableFormat": {
              "borders": {
                "top": {
                  "hasNoneStyle": true,
                  "lineStyle": "None",
                  "lineWidth": 0
                },
                "left": {
                  "hasNoneStyle": true,
                  "lineStyle": "None",
                  "lineWidth": 0
                },
                "right": {
                  "hasNoneStyle": true,
                  "lineStyle": "None",
                  "lineWidth": 0
                },
                "bottom": {
                  "hasNoneStyle": true,
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
                  "hasNoneStyle": true,
                  "lineStyle": "None",
                  "lineWidth": 0
                },
                "vertical": {
                  "hasNoneStyle": true,
                  "lineStyle": "None",
                  "lineWidth": 0
                }
              },
              "shading": {
              },
              "leftIndent": 0,
              "tableAlignment": "Left",
              "topMargin": 14.199999809265137,
              "rightMargin": 14.199999809265137,
              "leftMargin": 14.199999809265137,
              "bottomMargin": 14.199999809265137,
              "preferredWidthType": "Auto",
              "bidi": false,
              "allowAutoFit": false
            },
            "description": null,
            "title": null,
            "columnCount": 1
          },
          {
            "paragraphFormat": {
              "leftIndent": 0,
              "firstLineIndent": 0,
              "beforeSpacing": 18,
              "afterSpacing": 24,
              "lineSpacing": 1,
              "lineSpacingType": "Multiple",
              "styleName": "Message Header",
              "listFormat": {
              }
            },
            "characterFormat": {
              "fontColor": "empty"
            },
            "inlines": [
              {
                "characterFormat": {
                  "fontColor": "empty"
                },
                "text": "Sopot, "
              },
              {
                "characterFormat": {
                  "fontColor": "empty"
                },
                "fieldType": 0,
                "hasFieldEnd": true
              },
              {
                "characterFormat": {
                  "fontColor": "empty"
                },
                "text": " TIME \\@ \"yyyy-MM-dd\" "
              },
              {
                "characterFormat": {
                },
                "fieldType": 2
              },
              {
                "characterFormat": {
                  "fontColor": "empty"
                },
                "text": "2021-04-26"
              },
              {
                "characterFormat": {
                },
                "fieldType": 1
              }
            ]
          },
          {
            "paragraphFormat": {
              "firstLineIndent": 0.15000000596046448,
              "styleName": "Normal",
              "listFormat": {
              }
            },
            "characterFormat": {
              "bold": true,
              "fontSize": 12,
              "fontColor": "empty",
              "boldBidi": true,
              "fontSizeBidi": 12
            },
            "inlines": [
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "Dotyczy: szkody nr "
              },
              {
                "characterFormat": {
                },
                "bookmarkType": 0,
                "name": "numerSzkodyLik"
              },
              {
                "characterFormat": {
                },
                "bookmarkType": 1,
                "name": "numerSzkodyLik"
              },
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "${"
              },
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "highlightColor": "Yellow",
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "numerSzkody"
              },
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "} z dnia "
              },
              {
                "characterFormat": {
                },
                "bookmarkType": 0,
                "name": "dataZdarzenia"
              },
              {
                "characterFormat": {
                },
                "bookmarkType": 1,
                "name": "dataZdarzenia"
              },
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "${"
              },
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "highlightColor": "Yellow",
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "dataZdarzenia"
              },
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "}"
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
              "bold": true,
              "fontSize": 12,
              "fontColor": "empty",
              "boldBidi": true,
              "fontSizeBidi": 12
            },
            "inlines": [
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "Opiekun szkody: ${"
              },
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "highlightColor": "Yellow",
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "likwidator"
              },
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "}"
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
              "bold": true,
              "fontSize": 12,
              "fontColor": "empty",
              "boldBidi": true,
              "fontSizeBidi": 12
            },
            "inlines": [
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "Tel. ${"
              },
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "highlightColor": "Yellow",
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "likwidatorTelSluzbowy"
              },
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "}, ${"
              },
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "highlightColor": "Yellow",
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "likwidatorMail"
              },
              {
                "characterFormat": {
                  "bold": true,
                  "fontSize": 12,
                  "fontColor": "empty",
                  "boldBidi": true,
                  "fontSizeBidi": 12
                },
                "text": "}"
              }
            ]
          },
          {
            "paragraphFormat": {
              "leftIndent": 106.30000305175781,
              "firstLineIndent": -106.30000305175781,
              "afterSpacing": 12,
              "styleName": "Normal",
              "listFormat": {
              }
            },
            "characterFormat": {
              "fontSize": 11,
              "fontColor": "empty",
              "fontSizeBidi": 11
            },
            "inlines": [
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
                          "lineSpacing": 1.150000015894572,
                          "lineSpacingType": "Multiple",
                          "styleName": "Normal",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "bold": true,
                          "fontColor": "empty",
                          "boldBidi": true
                        },
                        "inlines": [
                          {
                            "characterFormat": {
                              "bold": true,
                              "fontColor": "empty",
                              "boldBidi": true
                            },
                            "text": "Dlaczego dostaję to pismo?"
                          }
                        ]
                      },
                      {
                        "paragraphFormat": {
                          "lineSpacing": 1.150000015894572,
                          "lineSpacingType": "Multiple",
                          "styleName": "Normal",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "fontColor": "empty"
                        },
                        "inlines": [
                        ]
                      },
                      {
                        "paragraphFormat": {
                          "lineSpacing": 1.5,
                          "lineSpacingType": "Multiple",
                          "styleName": "Normal",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "fontSize": 12,
                          "fontColor": "empty",
                          "fontSizeBidi": 12
                        },
                        "inlines": [
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "Informujemy o przyznaniu "
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "doplata"
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "doplata"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "odszkodowania w wysokości:"
                          },
                          {
                            "characterFormat": {
                              "bold": true,
                              "fontColor": "empty",
                              "boldBidi": true
                            },
                            "text": " "
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "kwotaUznana"
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "kwotaUznana"
                          },
                          {
                            "characterFormat": {
                              "bold": true,
                              "fontColor": "empty",
                              "boldBidi": true
                            },
                            "text": "${"
                          },
                          {
                            "characterFormat": {
                              "bold": true,
                              "highlightColor": "Yellow",
                              "fontColor": "empty",
                              "boldBidi": true
                            },
                            "text": "kwotaUznana"
                          },
                          {
                            "characterFormat": {
                              "bold": true,
                              "fontColor": "empty",
                              "boldBidi": true
                            },
                            "text": "} zł "
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "bruttoNetto"
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "bruttoNetto"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "(słownie: "
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "kwotaUznanaSlownie"
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "kwotaUznanaSlownie"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "${"
                          },
                          {
                            "characterFormat": {
                              "highlightColor": "Yellow",
                              "fontColor": "empty"
                            },
                            "text": "kwotaUznanaSlownie"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "})"
                          },
                          {
                            "characterFormat": {
                              "baselineAlignment": "Superscript",
                              "fontColor": "empty"
                            },
                            "text": " "
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "ustalonego w oparciu o "
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "podstawaDecyzji"
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "podstawaDecyzji"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": " "
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "wyliczenie kosztorysowe."
                          },
                          {
                            "characterFormat": {
                              "fontSize": 12,
                              "fontColor": "empty",
                              "fontSizeBidi": 12
                            },
                            "text": " "
                          }
                        ]
                      },
                      {
                        "paragraphFormat": {
                          "lineSpacing": 1.150000015894572,
                          "lineSpacingType": "Multiple",
                          "styleName": "Normal",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "fontColor": "#000000FF"
                        },
                        "inlines": [
                          {
                            "characterFormat": {
                              "fontColor": "#000000FF"
                            },
                            "text": "${"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "#000000FF"
                            },
                            "text": "odmowaWyplaty"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "#000000FF"
                            },
                            "text": "}"
                          }
                        ]
                      },
                      {
                        "paragraphFormat": {
                          "lineSpacing": 1.150000015894572,
                          "lineSpacingType": "Multiple",
                          "styleName": "Normal",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "fontColor": "#000000FF"
                        },
                        "inlines": [
                          {
                            "characterFormat": {
                              "fontColor": "#000000FF"
                            },
                            "text": " "
                          },
                          {
                            "characterFormat": {
                              "fontColor": "#000000FF"
                            },
                            "text": " "
                          },
                          {
                            "characterFormat": {
                              "fontColor": "#000000FF"
                            },
                            "text": "${"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "#000000FF"
                            },
                            "text": "anulowanaSzkoda"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "#000000FF"
                            },
                            "text": "}"
                          }
                        ]
                      },
                      {
                        "paragraphFormat": {
                          "lineSpacing": 1.150000015894572,
                          "lineSpacingType": "Multiple",
                          "styleName": "Normal",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "fontColor": "#000000FF"
                        },
                        "inlines": [
                        ]
                      },
                      {
                        "paragraphFormat": {
                          "styleName": "Normal",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "fontSize": 12,
                          "fontColor": "empty",
                          "fontSizeBidi": 12
                        },
                        "inlines": [
                          {
                            "characterFormat": {
                              "fontColor": "#000000FF"
                            },
                            "text": "Suma ubezpieczenia został pomniejszona o kwotę wypłaconego odszkodowania"
                          },
                          {
                            "footnoteType": "Footnote",
                            "characterFormat": {
                              "fontColor": "#000000FF",
                              "styleName": "Footnote Reference"
                            },
                            "blocks": [
                              {
                                "paragraphFormat": {
                                  "styleName": "Footnote Text",
                                  "listFormat": {
                                  }
                                },
                                "characterFormat": {
                                  "fontFamily": "Calibri",
                                  "fontColor": "empty",
                                  "fontFamilyBidi": "Calibri"
                                },
                                "inlines": [
                                  {
                                    "characterFormat": {
                                      "fontFamily": "Times New Roman",
                                      "fontColor": "empty",
                                      "styleName": "Footnote Reference",
                                      "fontFamilyBidi": "Times New Roman"
                                    },
                                    "text": "1"
                                  },
                                  {
                                    "characterFormat": {
                                      "fontFamily": "Times New Roman",
                                      "fontColor": "empty",
                                      "fontFamilyBidi": "Times New Roman"
                                    },
                                    "text": " "
                                  },
                                  {
                                    "characterFormat": {
                                      "fontFamily": "Calibri",
                                      "fontColor": "empty",
                                      "fontFamilyBidi": "Calibri"
                                    },
                                    "text": "Footnote"
                                  },
                                  {
                                    "characterFormat": {
                                      "fontFamily": "Calibri",
                                      "fontColor": "empty",
                                      "fontFamilyBidi": "Calibri"
                                    },
                                    "text": " test "
                                  },
                                  {
                                    "characterFormat": {
                                      "fontFamily": "Calibri",
                                      "fontColor": "empty",
                                      "fontFamilyBidi": "Calibri"
                                    },
                                    "text": "footnote"
                                  },
                                  {
                                    "characterFormat": {
                                      "fontFamily": "Calibri",
                                      "fontColor": "empty",
                                      "fontFamilyBidi": "Calibri"
                                    },
                                    "text": " test"
                                  }
                                ]
                              }
                            ],
                            "symbolCode": 0
                          },
                          {
                            "characterFormat": {
                              "fontSize": 12,
                              "fontColor": "empty",
                              "fontSizeBidi": 12
                            },
                            "text": " "
                          }
                        ]
                      }
                    ],
                    "cellFormat": {
                      "borders": {
                        "top": {
                          "color": "#D9D9D9FF",
                          "hasNoneStyle": false,
                          "lineStyle": "Single",
                          "lineWidth": 0.5
                        },
                        "left": {
                          "color": "#D9D9D9FF",
                          "hasNoneStyle": false,
                          "lineStyle": "Single",
                          "lineWidth": 0.5
                        },
                        "right": {
                          "color": "#D9D9D9FF",
                          "hasNoneStyle": false,
                          "lineStyle": "Single",
                          "lineWidth": 0.5
                        },
                        "bottom": {
                          "color": "#D9D9D9FF",
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
                      },
                      "preferredWidth": 487.3500061035156,
                      "preferredWidthType": "Point",
                      "cellWidth": 487.3500061035156,
                      "columnSpan": 1,
                      "rowSpan": 1,
                      "verticalAlignment": "Top"
                    },
                    "columnIndex": 0
                  }
                ],
                "rowFormat": {
                  "height": 1,
                  "allowBreakAcrossPages": true,
                  "heightType": "AtLeast",
                  "isHeader": false,
                  "borders": {
                    "top": {
                      "color": "#D9D9D9FF",
                      "hasNoneStyle": false,
                      "lineStyle": "Single",
                      "lineWidth": 0.5
                    },
                    "left": {
                      "color": "#D9D9D9FF",
                      "hasNoneStyle": false,
                      "lineStyle": "Single",
                      "lineWidth": 0.5
                    },
                    "right": {
                      "color": "#D9D9D9FF",
                      "hasNoneStyle": false,
                      "lineStyle": "Single",
                      "lineWidth": 0.5
                    },
                    "bottom": {
                      "color": "#D9D9D9FF",
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
                      "color": "#D9D9D9FF",
                      "hasNoneStyle": false,
                      "lineStyle": "Single",
                      "lineWidth": 0.5
                    },
                    "vertical": {
                      "color": "#D9D9D9FF",
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
              487.3500061035156
            ],
            "tableFormat": {
              "borders": {
                "top": {
                  "color": "#D9D9D9FF",
                  "hasNoneStyle": false,
                  "lineStyle": "Single",
                  "lineWidth": 0.5
                },
                "left": {
                  "color": "#D9D9D9FF",
                  "hasNoneStyle": false,
                  "lineStyle": "Single",
                  "lineWidth": 0.5
                },
                "right": {
                  "color": "#D9D9D9FF",
                  "hasNoneStyle": false,
                  "lineStyle": "Single",
                  "lineWidth": 0.5
                },
                "bottom": {
                  "color": "#D9D9D9FF",
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
                  "color": "#D9D9D9FF",
                  "hasNoneStyle": false,
                  "lineStyle": "Single",
                  "lineWidth": 0.5
                },
                "vertical": {
                  "color": "#D9D9D9FF",
                  "hasNoneStyle": false,
                  "lineStyle": "Single",
                  "lineWidth": 0.5
                }
              },
              "shading": {
              },
              "leftIndent": 0,
              "tableAlignment": "Left",
              "topMargin": 0,
              "rightMargin": 5.4,
              "leftMargin": 5.4,
              "bottomMargin": 0,
              "preferredWidth": 487.3500061035156,
              "preferredWidthType": "Point",
              "bidi": false,
              "allowAutoFit": true
            },
            "description": null,
            "title": null,
            "columnCount": 1
          },
          {
            "paragraphFormat": {
              "styleName": "Normal",
              "listFormat": {
              }
            },
            "characterFormat": {
              "fontColor": "empty"
            },
            "inlines": [
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
                          "lineSpacing": 1.150000015894572,
                          "lineSpacingType": "Multiple",
                          "styleName": "Normal",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "bold": true,
                          "fontColor": "empty",
                          "boldBidi": true
                        },
                        "inlines": [
                          {
                            "characterFormat": {
                              "bold": true,
                              "fontColor": "empty",
                              "boldBidi": true
                            },
                            "text": "Co należy zrobić?"
                          }
                        ]
                      },
                      {
                        "paragraphFormat": {
                          "afterSpacing": 6,
                          "styleName": "Normal",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "fontColor": "empty"
                        },
                        "inlines": [
                          {
                            "characterFormat": {
                              "fontColor": "#000000FF"
                            },
                            "text": "Dodatkowo informujemy"
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": " o możliwości wniesienia odwołania od powyższej decyzji do Zarządu "
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "ERGO Hestii lub dochodzenia roszczeń na drodze sądowej. "
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "zdanie2BLS"
                          },
                          {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "zdanie2BLS"
                          }
                        ]
                      },
                      {
                        "paragraphFormat": {
                          "afterSpacing": 6,
                          "styleName": "Normal",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "fontColor": "empty"
                        },
                        "inlines": [
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "Zachęcamy do skorzystania z dedykowanego formularza na stronie www.ergohestia.pl "
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "obsługiwanego przez zespół naszych ekspertów. Dokonają oni ponownej analizy zebranej "
                          },
                          {
                            "characterFormat": {
                              "fontColor": "empty"
                            },
                            "text": "dokumentacji i szczegółowo odniosą się do treści odwołania."
                          },
                          {
                            "footnoteType": "Footnote",
                            "characterFormat": {
                              "fontColor": "empty",
                              "styleName": "Footnote Reference"
                            },
                            "blocks": [
                              {
                                "paragraphFormat": {
                                  "styleName": "Footnote Text",
                                  "listFormat": {
                                  }
                                },
                                "characterFormat": {
                                  "fontFamily": "Calibri",
                                  "fontColor": "empty",
                                  "fontFamilyBidi": "Calibri"
                                },
                                "inlines": [
                                  {
                                    "characterFormat": {
                                      "fontFamily": "Times New Roman",
                                      "fontColor": "empty",
                                      "styleName": "Footnote Reference",
                                      "fontFamilyBidi": "Times New Roman"
                                    },
                                    "text": "2"
                                  },
                                  {
                                    "characterFormat": {
                                      "fontFamily": "Times New Roman",
                                      "fontColor": "empty",
                                      "fontFamilyBidi": "Times New Roman"
                                    },
                                    "text": " "
                                  },
                                  {
                                    "characterFormat": {
                                      "fontFamily": "Calibri",
                                      "fontColor": "empty",
                                      "fontFamilyBidi": "Calibri"
                                    },
                                    "text": "Footnote"
                                  },
                                  {
                                    "characterFormat": {
                                      "fontFamily": "Calibri",
                                      "fontColor": "empty",
                                      "fontFamilyBidi": "Calibri"
                                    },
                                    "text": " 2 "
                                  },
                                  {
                                    "characterFormat": {
                                      "fontFamily": "Calibri",
                                      "fontColor": "empty",
                                      "fontFamilyBidi": "Calibri"
                                    },
                                    "text": "Footnote"
                                  },
                                  {
                                    "characterFormat": {
                                      "fontFamily": "Calibri",
                                      "fontColor": "empty",
                                      "fontFamilyBidi": "Calibri"
                                    },
                                    "text": " 2 "
                                  },
                                  {
                                    "characterFormat": {
                                      "fontFamily": "Calibri",
                                      "fontColor": "empty",
                                      "fontFamilyBidi": "Calibri"
                                    },
                                    "text": " "
                                  }
                                ]
                              }
                            ],
                            "symbolCode": 0
                          }
                        ]
                      },
                      {
                        "paragraphFormat": {
                          "lineSpacing": 1.150000015894572,
                          "lineSpacingType": "Multiple",
                          "styleName": "Normal",
                          "listFormat": {
                          }
                        },
                        "characterFormat": {
                          "fontColor": "#000000FF"
                        },
                        "inlines": [
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
                      },
                      "preferredWidth": 487.3500061035156,
                      "preferredWidthType": "Point",
                      "cellWidth": 487.3500061035156,
                      "columnSpan": 1,
                      "rowSpan": 1,
                      "verticalAlignment": "Top"
                    },
                    "columnIndex": 0
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
              487.3500061035156
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
              "shading": {
              },
              "leftIndent": 0,
              "tableAlignment": "Left",
              "topMargin": 0,
              "rightMargin": 5.4,
              "leftMargin": 5.4,
              "bottomMargin": 0,
              "preferredWidth": 487.3500061035156,
              "preferredWidthType": "Point",
              "bidi": false,
              "allowAutoFit": true
            },
            "description": null,
            "title": null,
            "columnCount": 1
          },
          {
            "paragraphFormat": {
              "beforeSpacing": 6,
              "styleName": "Normal",
              "listFormat": {
              }
            },
            "characterFormat": {
              "fontColor": "empty"
            },
            "inlines": [
            ]
          },
          {
            "paragraphFormat": {
              "textAlignment": "Justify",
              "beforeSpacing": 0,
              "afterSpacing": 11.25,
              "styleName": "Normal (Web)",
              "listFormat": {
              }
            },
            "characterFormat": {
              "fontSize": 10.5,
              "fontFamily": "Arial",
              "fontColor": "#000000FF",
              "fontSizeBidi": 10.5,
              "fontFamilyBidi": "Arial"
            },
            "inlines": [
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "Lorem"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "ipsum"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "dolor"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " sit "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "amet"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": ", "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "consectetur"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "adipiscing"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " elit. "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "Integer"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "nec"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "viverra"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "lorem"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": ". "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "Aliquam"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "eu"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "laoreet"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "mauris"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": ". "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "In "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "eu"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "rhoncus"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "magna"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": ". "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "Maecenas"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "fringilla"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "ac"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "dolor"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " vel "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "finibus"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": ". "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "Donec"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " sit "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "amet"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "interdum"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "augue"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": ". "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "Cras"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "est"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "lacus"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": ", "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "volutpat"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "ut"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "tellus"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " vel, "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "feugiat"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "commodo"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "dolor"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": ". "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "Aliquam"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " id "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "feugiat"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "augue"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": ", "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "nec"
              }
            ]
          },
          {
            "paragraphFormat": {
              "textAlignment": "Justify",
              "beforeSpacing": 0,
              "afterSpacing": 11.25,
              "styleName": "Normal (Web)",
              "listFormat": {
              }
            },
            "characterFormat": {
              "fontSize": 10.5,
              "fontFamily": "Arial",
              "fontColor": "#000000FF",
              "fontSizeBidi": 10.5,
              "fontFamilyBidi": "Arial"
            },
            "inlines": [
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "cursus"
              },
              {
                "footnoteType": "Footnote",
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "styleName": "Footnote Reference",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "blocks": [
                  {
                    "paragraphFormat": {
                      "styleName": "Footnote Text",
                      "listFormat": {
                      }
                    },
                    "characterFormat": {
                      "fontFamily": "Times New Roman",
                      "fontColor": "empty",
                      "fontFamilyBidi": "Times New Roman"
                    },
                    "inlines": [
                      {
                        "characterFormat": {
                          "fontFamily": "Times New Roman",
                          "fontColor": "empty",
                          "styleName": "Footnote Reference",
                          "fontFamilyBidi": "Times New Roman"
                        },
                        "text": "3"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Times New Roman",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Times New Roman"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "Footnote"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " 3 "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "long"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "text"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "Footnote"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " 3 "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "long"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "text"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "Footnote"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " 3 "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "long"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "text"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "Footnote"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " 3 "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "long"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "text"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "Footnote"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " 3 "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "long"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "text"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "Footnote"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " 3 "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "long"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "text"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "Footnote"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " 3 "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "long"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "text"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "Footnote"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " 3 "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "long"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "text"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "Footnote"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " 3 "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "long"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": "text"
                      },
                      {
                        "characterFormat": {
                          "fontFamily": "Calibri",
                          "fontColor": "empty",
                          "fontFamilyBidi": "Calibri"
                        },
                        "text": " "
                      }
                    ]
                  }
                ],
                "symbolCode": 0
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "magna"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": ". "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "Vivaus"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "quis"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "molestie"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "felis"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": ". "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "Aliquam"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "venenatis"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": " "
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "o"
              },
              {
                "characterFormat": {
                  "fontSize": 10.5,
                  "fontFamily": "Arial",
                  "fontColor": "#000000FF",
                  "fontSizeBidi": 10.5,
                  "fontFamilyBidi": "Arial"
                },
                "text": "asdasdasdasdasd"
              }
            ]
          }
        ],
        "headersFooters": {
          "header": {
            "blocks": [
              {
                "paragraphFormat": {
                  "styleName": "Header",
                  "listFormat": {
                  }
                },
                "characterFormat": {
                  "fontColor": "empty"
                },
                "inlines": [
                  {
                    "characterFormat": {
                    },
                    "imageString": "data:image/png;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAC0BNkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiikzQAtFJuHrS0AFFFFABRRSbh60ALRRRQAUUUm4etAC0UmaWgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCC6YpbysDghSQffFflb/wANo/Gb/odJP/Bdaf8Axqv1RvB/os/+438q/EGuDFSlG3K7H6nwRg8Ni/rH1imp25d0n37ntv8Aw2j8Zv8AodJP/Bfaf/GqP+G0PjN/0Okn/gvtP/jVfVXwn/Y4+Fnir4YeEta1HRbiXUNQ0m1uriRdQnUNJJCjOcB8DJJOBwK6z/hhf4P/APQBuf8AwZT/APxdSqVf+Y9KpnvDlObg8Jt/ciT/ALLXxL8R/EL4Dy+IvEOonUtYWa6H2gwxx8J90bUVV4+lfDWp/thfF/VWJl8ZXEKnottawRY9gVTP5nNfpL4b+Gug/Cj4d3+heG7V7TTVjnlEbzPIdzKSTuYk1+OtKu5QUVcXC1DA5hicXW9inG6cU0tE7/cepQ/tRfFaGQSL451Qtn+J1YfkQR+lep/DP/goB458OahDH4tjt/FOmFsSuIlt7pB6qUAQ4HOCvP8AeHWvqD4c/sy/DDxB8L/DM9/4N06a4vNLtpZ5wrLI7tEpZt4IYEknoa+Hf2rPg7p3wT+K0mi6PLI+lXdnHf28czbmhVndPLLdWAaMkE84IBJxkzKNaiubmud+DxWRZ5Xlgfq3LLWzslt2a1P1A8B+ONI+I/hXT/EWhXQu9NvU3xv0IIOGVh2YEEEdiDWD8Y/jX4b+CPhk6tr9w2+UlLWxhAaa5cDlUUkdO5JAGevIr5o/4Ju+JbmTw/450eaQ/YrGa3vItx4VpVkV+fT9yv618t/tC/Fy7+Mn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WPoA0ePq49a4oylOnO7vY/Q8Zh8Fl+b4GVGmoKXOtEl0VvzPKP8AgnjYwXfxzvppQrSWuizyxZ6hjNCpI/Bj+dfpKBmvyS/Zh+KkHwf+MWka3fMV0mYNZXzKCSsUmPm+isEY4GSFIAziv1j0/ULbVLKC8s547i1nRZIpoXDI6kZDAjggjnIrrwsk4WXQ+F43w9WGZKtJe7JK3y6f13H3lvFeWc0EyCSGRGR0YZDKQQQfbFfiZqlslnqd3bxtvjhmeNW65AYgH8hX62ftDfGCw+Dfw11PV5rlF1OaJoNNtyRuluGUhcDuF+83oAfavyOt7eW8uI4IUaaeZgiRoCWZicAADkkkgY96xxb1S6n0PAdGpTpYivPSDtb5Xv8AmfrH+yXdyXv7O/giSbO9bIxjP91XZV/RRXrnauP+EPg9vAPwx8M+HpNpn0/T4YZivQyBRvI9i2fzrsa743UUmflGOqRq4qrUhs5Nr7wpaKKs4gooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAjcbkZe5Ffjj8Xvhnqnwl8e6p4f1O1lgWGZjazOp23EBY7JEPQgjGcHg5BwQQP2QrL17wxpHii0+y6xpdnqtvnPk3tuky59cMDXPWpKrbofVcP57LI6sp8nNGS1XpsfjTo/jXxD4ftjbaVr2p6ZbsxYxWd5JEhJ6khWAz71e/4Wp40/wChv17/AMGU/wD8VX6w/wDChvht/wBCD4Z/8FFv/wDEUf8AChfht/0IPhn/AMFFv/8AEVz/AFV/zH2suNsHJtywt2/T/I8B/Yb8Rar4k+CvjSbVtSvNUmS+mRZby4aZlX7PGcAsTxkk4HGSa/PSv2o8PeCfD/hGxmstD0TT9Is52Ly29jaxwxyMQASyqACcADJ7CsD/AIUP8Nuv/CA+Gf8AwUW//wARWk8O5RSvseNl/FVHA4nEV1RuqrWl7WsWvhCob4S+D1YZB0e0GD/1wSvzT/a1+E8Xwl+MWo2ljD5Ojakv9o2KKMLGrkhox2wrqwA7Lt9a/VWzs4NPtILW1hjtraFFjjhiUKiIBgKAOAAOMD0rF8T/AA98MeNpIJNf8O6XrcluCsTahZxzmMEgkKXU4BwOnpWtWl7SNjw8lzyWU4yeI5bxle6/L7j4X/4J4/Ex9F8d6n4KuZsWesxG6tUY9LiMfMAPVo8kn/pkK7v9sj9ku/8AF2p3HjrwXafatRkXOpaVFgPPtGBNGO74ABUctgEc5B+n9H+D/gXw9qUGoaZ4O0HT7+Bt8V1a6bDFKhwRlWVQQcE9D3rsOMVKo+5yTdzoxHEUlmn9pYKPI2tU9U/60PxOsr7V/B+tCa0uL3RdWtHK+ZC7wTwt0I4IYHqCOK7PU/2i/iZrGmvYXfjbWJLV02Mi3BQsuOQWXBPBIOTyDzX6p+LPhX4P8eMH8QeGtL1eVRtEt1aI8ij0DEZH4GuWtf2W/hTZzeangbSWbPSWHzF/75YkVz/Vpx0jLQ+t/wBc8vxCU8VhbzXo/wAWflT4T8G65461aPTfD+lXWr3zkDybWMvtBOMseigd2JAHciv2K8WeDdO8d+DL7w7rVv8AaNPvrbyJ4+/Tgg9mBwQexANXdD8N6V4ZsVs9I0yz0u0XlYbOBYkH0CgCtPpXRRoqmmr3ufIZ7xFPOKtOcIcns72116f5H5K/Hb9m/wAUfA/WpxeW0l/4eeQi11iFCYnUnhZOvlv7HgnOCRXNeDvjV46+H9ibPw/4p1LTbLki2jmzEuTklUbKqSeTgAmv2JurWG8gkhniSaKQbWjdQVYHqCDXmuq/sx/CzWrgz3PgfSRITkm3g8kE+pCYzWMsNZ3g7H0uF40pVKKpZlQ57ddNfkz8p/EXirxD8QNYS61rU7/XtRkPlxtcytM/J4VBk4GTwoAGTwK+xf2Pv2QtR07WrLx144smsmtSJtM0mdcSeZ/DNKD93b/Cp5zyQMAH6y8I/B3wV4CmE3h/wvpel3GNv2i3tUEuPQvjcR+NdBrGuWHh6zFxqFwtvDu2gkFix64VQCScAnAHQH0q6eHUXzSd2cGbcXyxWHeEwNP2cH99uytsaXSlqpp+oW+qWqXVrKs0D5wy56g4II6ggggg8ggg1brsPzkKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCvdwSXNrLFHcSWrupVZoQpdCejDcCuR7gj1FfEPxg+PPxV+H/7RVp8OtN8Xxz6dfXVlDBdXWmWzTRrcFVO7agVipY9AAQBwK+5q/N/9rDV7Pw7+2xoOq6hN9n0+xn0m6uJtpby40kVmbCgk4AJwASccAmgD9EtJsZ9PsYoLnUbjVJlzuurpI1kfJzyI0RRjpwo6fjXi37WXivxd8LfhrqHjPwv4lmspbOe3R9PuLS3mgZHdYztJj3hssDksR1GBkVN/w218Ff8Aodk/8Ft5/wDGa8d/az/ae+GXxJ+BeveH/DniddS1e5ltmhthZXEe4LPGzHc8YUYVSeSM4wOaAPUP2QPHPjD4ufD5vFvinxFJdySXk1rFY29pbwwKqhQGYhN5bJJGGAxjg15P+2F8aPiZ8AfGGiWvh7xvc3On6nZtOY9Q06yd43V9pwywLlSCvUEg55OQB6P/AME+v+TdbT/sJXX/AKEK8Q/4Kaf8jh4I/wCvC4/9GLQB9Ar8OfjlfaJDeWXxttGuZ4FlSGbwpaomWUEAuGbA99p+navQ/hfq2t6b8H9L1PxzdO+tW9nJc6pcSRKhBUszHaqqAAo4wBwBXB6P+2R8HNP0Gwjn8awLJDbRq6LZ3LEEKARgRHJzXq9nc6d8T/h/FcRiYaR4g00OvmLsk8ieLIyOx2v0oA+dvg/4n8aftbDXvEr+MNS8C+DrO+bT7DSvDwiS7cqiuXlndWOdrpwBgknAGMnWk8PfFL4T+NNVtrXxhq3jnQbvw3qN1plrfxRyXUd/EIxGjMF+bJkGCMA/MCvAJ+Wvh38TfGH7DvxU1fwvrli+o6FNMGubUfKJ4wSEurdj3K9jwcFWwVBX9Ffh38RvD/xU8LWviDw3fpf6dPxkcPE4xmN16qwyMg/XkEGgDxnw/wDCr9oSHToF1D402EM+wB418P29ztOORvZVLY9SOa8R8P8Axm+Nmu/tHS/CgfEe3hkju7m0/tY6DasCYYpJN3lbQefLxjdxnOTjB++6/Oz4ff8AKSW6/wCwxqn/AKST0Ae5fETwL+0ZofhXUdQ0n4sWesy2kLTmzj0CC2mmVQSVQhHyxA4HGTgZFcf+2d8YviR8BvE2gDw140uTY6xBNI1teafZSeSyOvCMIASuHAwxJ4JJOePtGvgf/gp1/wAhn4fH/phe/wDoUNAH2Z8M7bVY/BulXGta5da/qN3awzzXFzDBEFdowWCLFGgC5JxncenNdZWN4L/5E7Qv+vCD/wBFrXDftLfE3/hUvwa8Q65BJs1N4vsen7fvG5l+VCvqVyX+iGgDxz4a/tVS+LP2vPEvhKS93+FrlG07SkyNgubfJZwf+mhE3PcCMc4FfRvjTwrL4kW1eGTbJCdrR+c8O9PNikIEiAsjboUwwB43DjII/Pb4+fBC9/Zy8M/CLxnpKfZtYtY411KUDpqCsblC394ndInP8MKiv0R8A+MLP4geC9E8Saec2mp2kdyi5yU3AEqfdTlT7g0AL4O8Ov4Z0dbaSVZJmKl/LGEG2NI1A+ixrk8ZOTgZwN+iigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvzr/aZw37d3hMEZH27RgQeRjzU4NfofNIIYXkKs+1S21BljjnAHc18B/HL4Z/Ejxt+0xB490XwHq9xothdWMsPm+VFLKsHlsxCs+RllYDPbBOM4AB99fYbf/nhH/3wK8C/bqt4Yv2Z/E7LEit51mAwUA/8fUVe4aDrX9u2ZuPsN7p5DbTDfwmJ+gPTJyOeoPUGvEv2ytH8Q+OvhPeeEfDHh3Udb1K+nt5Ge3RVhjjSTeSXZgM5QDA55FAGZ/wT6/5N1tP+wldf+hCvD/8Agpr/AMjh4I/68Lj/ANGLXtv7Fuj+Jvhn8OT4S8V+FtW0m+GoyzRTtEskDRuqkEujHaQQ2cgDpgnPHmf7aXwj+Ivxw8caPceGPBV/Npul2b27XFxcW0XmSNISSqmXJXAXBIBJJ445APsHTtB03WvB9lZX1hbXlpPZRxywzxKyOpQAggjkYqXSbLT/AAB4O0+xe68nTNJs4bRZ7ggfIiqiliO+AOnevD/D/wAZ/i7ovhvT7LUPgbqV1qFtbpDJLb6zbiOVlUAsBglQcZxzjPU1oTeGviH8Rv2d/GUOr2I0fxp4gkuJ7bS5LkEWihlWGEOCQDsjU545bJxk0Ad18Z/gd4X+OXhk6X4gtP38YY2eowgC4tHP8SN3BwMqeDgZHAI+L/2S18RfAn9rLUPhlfzmW3vhPbXCIT5Uhjga4hnUHoSi8dwJCD04+j/DHxy+KNlocFl4k+DOvXPiOGMRyTadc25tLhwMb95bCAnkgbgM8EiqvwV+BPiR/i/rnxf+IcdrZeJ9RUxWOi2cglSwj2LGC8g4ZxGoT5SRgsScnCgH0dX51/D1h/w8kuj/ANRjUx/5KTiv0J1O8fT7OW4S1nvWjGRb2wUyPz0XcQPzI6V8H+FfhD8UtF/awf4n3Hw/1D+xJdYu7owpd2hnWCZZIwdvnYLBXBIz1BANAH33XwP/AMFOf+Qz8Ph/073v/oUNfdml3z6jYx3D2k9iz5zBdBRIuCRztJHOM8E9RXxn+2v8J/iF8cfFWgf8It4Lv57HSLeaJ7m4uLWISO7gnYGlyRhByQM56cUAfX/gv/kT9C/68IP/AEWtfL37RSa38cP2h/Cnw38MXVpAPC8I8Q6hLfRmW3ScFTEsiAjdgFABnkTnPSvbPDPjXXtI8B6XDceAPEDava2EUUlkj2mGmSMKVEnn7dpI+8e3OM8V5n+yp4L8ZeHfGXj3xH4+8L3mmeIvE16JxdedBNBHAAzCMMkhZQC23GOQq+nABn/G74K/Gb4mfDfVtI1nxP4Y1W3RPtcdraaVJHM8sQLKqPuIVmwVyQRhjXO/8E4fij/a/g/WvAt5Lm50iX7dZKx5NvIcSKB6LIcn3lFfZlfBFv8AA/4n/B39qLU/GXgrwZdan4WN/K4hS6tohPbTYMsaqZQQAWO3IHKKSOooA+96KzND1WXWbFbiXTbzSnJx9mvhGJBwDk7GYd8dexrToAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//2Q==",
                    "metaFileImageString": null,
                    "isMetaFile": false,
                    "isCompressed": false,
                    "width": 453.30002,
                    "height": 65.75,
                    "iscrop": false,
                    "name": "Obraz 3",
                    "visible": true,
                    "widthScale": 48.70266,
                    "heightScale": 48.7037048,
                    "verticalPosition": -25.47,
                    "verticalOrigin": "Paragraph",
                    "verticalAlignment": "None",
                    "horizontalPosition": 53.07000000000001,
                    "horizontalOrigin": "Column",
                    "horizontalAlignment": "None",
                    "allowOverlap": true,
                    "textWrappingStyle": "Square",
                    "textWrappingType": "Both",
                    "layoutInCell": true
                  }
                ]
              }
            ]
          },
          "footer": {
            "blocks": [
              {
                "paragraphFormat": {
                  "listFormat": {
                  }
                },
                "characterFormat": {
                },
                "inlines": [
                ]
              }
            ]
          },
          "evenHeader": {
            "blocks": [
              {
                "paragraphFormat": {
                  "listFormat": {
                  }
                },
                "characterFormat": {
                },
                "inlines": [
                ]
              }
            ]
          },
          "evenFooter": {
            "blocks": [
              {
                "paragraphFormat": {
                  "listFormat": {
                  }
                },
                "characterFormat": {
                },
                "inlines": [
                ]
              }
            ]
          },
          "firstPageHeader": {
            "blocks": [
              {
                "paragraphFormat": {
                  "listFormat": {
                  }
                },
                "characterFormat": {
                },
                "inlines": [
                ]
              }
            ]
          },
          "firstPageFooter": {
            "blocks": [
              {
                "paragraphFormat": {
                  "listFormat": {
                  }
                },
                "characterFormat": {
                },
                "inlines": [
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
      "fontFamily": "Times New Roman",
      "underline": "None",
      "strikethrough": "None",
      "baselineAlignment": "Normal",
      "highlightColor": "NoColor",
      "fontColor": "empty",
      "boldBidi": false,
      "italicBidi": false,
      "fontSizeBidi": 11,
      "fontFamilyBidi": "Times New Roman",
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
      "listFormat": {
      },
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
    "formFieldShading": false,
    "styles": [
      {
        "name": "Normal",
        "type": "Paragraph",
        "paragraphFormat": {
          "listFormat": {
          }
        },
        "characterFormat": {
          "fontFamily": "Arial",
          "fontColor": "empty",
          "fontFamilyBidi": "Arial"
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
        "name": "Message Header",
        "type": "Paragraph",
        "paragraphFormat": {
          "leftIndent": 42.54999923706055,
          "firstLineIndent": -42.54999923706055,
          "lineSpacing": 9,
          "lineSpacingType": "AtLeast",
          "listFormat": {
          }
        },
        "characterFormat": {
          "fontColor": "empty"
        },
        "basedOn": "Body Text",
        "link": "Nagłówek wiadomości Znak",
        "next": "Message Header"
      },
      {
        "name": "Body Text",
        "type": "Paragraph",
        "paragraphFormat": {
          "afterSpacing": 6,
          "listFormat": {
          }
        },
        "characterFormat": {
          "fontColor": "empty"
        },
        "basedOn": "Normal",
        "next": "Body Text"
      },
      {
        "name": "Nagłówek wiadomości Znak",
        "type": "Character",
        "characterFormat": {
          "fontFamily": "Arial",
          "fontColor": "empty",
          "fontFamilyBidi": "Arial"
        },
        "basedOn": "Default Paragraph Font"
      },
      {
        "name": "Body Text 2",
        "type": "Paragraph",
        "paragraphFormat": {
          "textAlignment": "Justify",
          "listFormat": {
          }
        },
        "characterFormat": {
          "fontSize": 11,
          "fontColor": "empty",
          "fontSizeBidi": 11
        },
        "basedOn": "Normal",
        "next": "Body Text 2"
      },
      {
        "name": "Footnote Text",
        "type": "Paragraph",
        "paragraphFormat": {
          "listFormat": {
          }
        },
        "characterFormat": {
          "fontFamily": "Times New Roman",
          "fontColor": "empty",
          "fontFamilyBidi": "Times New Roman"
        },
        "basedOn": "Normal",
        "link": "Tekst przypisu dolnego Znak",
        "next": "Footnote Text"
      },
      {
        "name": "Tekst przypisu dolnego Znak",
        "type": "Character",
        "characterFormat": {
          "fontFamily": "Times New Roman",
          "fontColor": "empty",
          "fontFamilyBidi": "Times New Roman"
        },
        "basedOn": "Default Paragraph Font"
      },
      {
        "name": "Footnote Reference",
        "type": "Character",
        "characterFormat": {
          "baselineAlignment": "Superscript",
          "fontColor": "empty"
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
        "name": "Document Map",
        "type": "Paragraph",
        "paragraphFormat": {
          "listFormat": {
          }
        },
        "characterFormat": {
          "fontFamily": "Tahoma",
          "fontColor": "empty",
          "fontFamilyBidi": "Tahoma"
        },
        "basedOn": "Normal",
        "next": "Document Map"
      },
      {
        "name": "Header",
        "type": "Paragraph",
        "paragraphFormat": {
          "listFormat": {
          },
          "tabs": [
            {
              "position": 226.8000030517578,
              "deletePosition": 0,
              "tabJustification": "Center",
              "tabLeader": "None"
            },
            {
              "position": 453.6000061035156,
              "deletePosition": 0,
              "tabJustification": "Right",
              "tabLeader": "None"
            }
          ]
        },
        "characterFormat": {
          "fontColor": "empty"
        },
        "basedOn": "Normal",
        "next": "Header"
      },
      {
        "name": "Footer",
        "type": "Paragraph",
        "paragraphFormat": {
          "listFormat": {
          },
          "tabs": [
            {
              "position": 226.8000030517578,
              "deletePosition": 0,
              "tabJustification": "Center",
              "tabLeader": "None"
            },
            {
              "position": 453.6000061035156,
              "deletePosition": 0,
              "tabJustification": "Right",
              "tabLeader": "None"
            }
          ]
        },
        "characterFormat": {
          "fontColor": "empty"
        },
        "basedOn": "Normal",
        "next": "Footer"
      },
      {
        "name": "Balloon Text",
        "type": "Paragraph",
        "paragraphFormat": {
          "listFormat": {
          }
        },
        "characterFormat": {
          "fontSize": 8,
          "fontFamily": "Tahoma",
          "fontColor": "empty",
          "fontSizeBidi": 8,
          "fontFamilyBidi": "Tahoma"
        },
        "basedOn": "Normal",
        "link": "Tekst dymka Znak",
        "next": "Balloon Text"
      },
      {
        "name": "Tekst dymka Znak",
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
        "name": "Body Text Indent 2",
        "type": "Paragraph",
        "paragraphFormat": {
          "leftIndent": 14.149999618530273,
          "afterSpacing": 6,
          "lineSpacing": 2,
          "lineSpacingType": "Multiple",
          "listFormat": {
          }
        },
        "characterFormat": {
          "fontColor": "empty"
        },
        "basedOn": "Normal",
        "link": "Tekst podstawowy wcięty 2 Znak",
        "next": "Body Text Indent 2"
      },
      {
        "name": "Tekst podstawowy wcięty 2 Znak",
        "type": "Character",
        "characterFormat": {
          "fontFamily": "Arial",
          "fontColor": "empty",
          "fontFamilyBidi": "Arial"
        },
        "basedOn": "Default Paragraph Font"
      },
      {
        "name": "List Paragraph",
        "type": "Paragraph",
        "paragraphFormat": {
          "leftIndent": 36,
          "listFormat": {
          },
          "contextualSpacing": true
        },
        "characterFormat": {
          "fontFamily": "Times New Roman",
          "fontColor": "empty",
          "fontFamilyBidi": "Times New Roman"
        },
        "basedOn": "Normal",
        "next": "List Paragraph"
      },
      {
        "name": "Normal (Web)",
        "type": "Paragraph",
        "paragraphFormat": {
          "beforeSpacing": 5,
          "afterSpacing": 5,
          "listFormat": {
          }
        },
        "characterFormat": {
          "fontSize": 12,
          "fontFamily": "Times New Roman",
          "fontColor": "empty",
          "fontSizeBidi": 12,
          "fontFamilyBidi": "Times New Roman"
        },
        "basedOn": "Normal",
        "next": "Normal (Web)"
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
          "lineSpacing": 1.0791666507720947,
          "lineSpacingType": "Multiple",
          "outlineLevel": "Level2",
          "listFormat": {
          }
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
          "lineSpacing": 1.0791666507720947,
          "lineSpacingType": "Multiple",
          "outlineLevel": "Level3",
          "listFormat": {
          }
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
          "lineSpacing": 1.0791666507720947,
          "lineSpacingType": "Multiple",
          "outlineLevel": "Level4",
          "listFormat": {
          }
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
          "lineSpacing": 1.0791666507720947,
          "lineSpacingType": "Multiple",
          "outlineLevel": "Level5",
          "listFormat": {
          }
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
          "lineSpacing": 1.0791666507720947,
          "lineSpacingType": "Multiple",
          "outlineLevel": "Level6",
          "listFormat": {
          }
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
    "lists": [
    ],
    "abstractLists": [
    ],
    "comments": [
    ],
    "revisions": [
    ],
    "customXml": [
    ],
    "footnotes": {
      "separator": [
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
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
            "listFormat": {
            }
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
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
          ]
        }
      ]
    },
    "endnotes": {
      "separator": [
        {
          "paragraphFormat": {
            "styleName": "Normal",
            "listFormat": {
            }
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
            "listFormat": {
            }
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
            "listFormat": {
            }
          },
          "characterFormat": {
          },
          "inlines": [
          ]
        }
      ]
    }
  }

describe('Footnotes validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport, SfdtExport, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableWordExport: true, enableEditor: true, isReadOnly: false, enableSelection: true, enableSfdtExport: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    // it('Foot notes splitted on a paragraph in two pages', () => {
    //     console.log('Foot notes splitted on a paragraph in two pages');
    //     expect(() => { editor.open(JSON.stringify(sfdtFileWithMultiPageFootNotes)); }).not.toThrowError();
    // });
});

let tableFootNotes: any = {
  "sections": [
      {
          "blocks": [
              {
                  "rows": [
                      {
                          "rowFormat": {
                              "allowBreakAcrossPages": true,
                              "isHeader": false,
                              "height": 87.9000015258789,
                              "heightType": "Exactly",
                              "borders": {
                                  "left": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": true
                                  },
                                  "right": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": true
                                  },
                                  "top": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": true
                                  },
                                  "bottom": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": true
                                  },
                                  "vertical": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": true
                                  },
                                  "horizontal": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": true
                                  },
                                  "diagonalDown": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false
                                  },
                                  "diagonalUp": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false
                                  }
                              },
                              "leftMargin": 14.2,
                              "rightMargin": 14.2,
                              "topMargin": 14.2,
                              "bottomMargin": 14.2
                          },
                          "cells": [
                              {
                                  "blocks": [
                                      {
                                          "paragraphFormat": {
                                              "leftIndent": 0.0,
                                              "firstLineIndent": 0.0,
                                              "afterSpacing": 0.0,
                                              "lineSpacing": 1.0,
                                              "lineSpacingType": "Multiple",
                                              "styleName": "Message Header",
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "${"
                                              },
                                              {
                                                  "text": "zwrotGrzecznosciowyPelny1",
                                                  "characterFormat": {
                                                      "highlightColor": "Yellow"
                                                  }
                                              },
                                              {
                                                  "text": "}"
                                              }
                                          ]
                                      },
                                      {
                                          "paragraphFormat": {
                                              "leftIndent": 0.0,
                                              "firstLineIndent": 0.0,
                                              "afterSpacing": 0.0,
                                              "lineSpacing": 1.0,
                                              "lineSpacingType": "Multiple",
                                              "styleName": "Message Header",
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "name": "adresat1",
                                                  "bookmarkType": 0
                                              },
                                              {
                                                  "name": "adresat1",
                                                  "bookmarkType": 1
                                              },
                                              {
                                                  "text": "${"
                                              },
                                              {
                                                  "text": "adresat1",
                                                  "characterFormat": {
                                                      "highlightColor": "Yellow"
                                                  }
                                              },
                                              {
                                                  "text": "}"
                                              }
                                          ]
                                      },
                                      {
                                          "paragraphFormat": {
                                              "leftIndent": 0.0,
                                              "firstLineIndent": 0.0,
                                              "afterSpacing": 0.0,
                                              "lineSpacing": 1.0,
                                              "lineSpacingType": "Multiple",
                                              "styleName": "Message Header",
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "name": "adresat2",
                                                  "bookmarkType": 0
                                              },
                                              {
                                                  "name": "adresat2",
                                                  "bookmarkType": 1
                                              },
                                              {
                                                  "text": "${"
                                              },
                                              {
                                                  "text": "adresat2",
                                                  "characterFormat": {
                                                      "highlightColor": "Yellow"
                                                  }
                                              },
                                              {
                                                  "text": "}"
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontSize": 9.0,
                                              "fontSizeBidi": 9.0
                                          },
                                          "paragraphFormat": {
                                              "leftIndent": 0.0,
                                              "firstLineIndent": 0.0,
                                              "afterSpacing": 0.0,
                                              "lineSpacing": 1.0,
                                              "lineSpacingType": "Multiple",
                                              "styleName": "Message Header",
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "name": "adresat3",
                                                  "bookmarkType": 0
                                              },
                                              {
                                                  "name": "adresat3",
                                                  "bookmarkType": 1
                                              },
                                              {
                                                  "text": "${"
                                              },
                                              {
                                                  "text": "adresat3",
                                                  "characterFormat": {
                                                      "highlightColor": "Yellow"
                                                  }
                                              },
                                              {
                                                  "text": "}"
                                              }
                                          ]
                                      }
                                  ],
                                  "cellFormat": {
                                      "leftMargin": 0.0,
                                      "rightMargin": 0.0,
                                      "topMargin": 0.0,
                                      "bottomMargin": 0.0,
                                      "columnSpan": 1,
                                      "rowSpan": 1,
                                      "preferredWidth": 191.39999389648438,
                                      "preferredWidthType": "Point",
                                      "verticalAlignment": "Top",
                                      "borders": {
                                          "left": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "right": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "top": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "bottom": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "vertical": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "horizontal": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalDown": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalUp": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          }
                                      },
                                      "shading": {
                                          "texture": "TextureNone"
                                      },
                                      "cellWidth": 191.39999389648438
                                  }
                              }
                          ]
                      }
                  ],
                  "title": null,
                  "description": null,
                  "tableFormat": {
                      "allowAutoFit": false,
                      "leftMargin": 14.199999809265137,
                      "rightMargin": 14.199999809265137,
                      "topMargin": 14.199999809265137,
                      "bottomMargin": 14.199999809265137,
                      "leftIndent": 0.0,
                      "tableAlignment": "Left",
                      "preferredWidthType": "Auto",
                      "borders": {
                          "left": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": true
                          },
                          "right": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": true
                          },
                          "top": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": true
                          },
                          "bottom": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": true
                          },
                          "vertical": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": true
                          },
                          "horizontal": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": true
                          },
                          "diagonalDown": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false
                          },
                          "diagonalUp": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false
                          }
                      },
                      "bidi": false,
                      "horizontalPositionAbs": "Left",
                      "horizontalPosition": 0.0
                  }
              },
              {
                  "characterFormat": {
                      "fontFamily": "Arial",
                      "fontFamilyBidi": "Arial"
                  },
                  "paragraphFormat": {
                      "beforeSpacing": 24.0,
                      "afterSpacing": 12.0,
                      "widowControl": false
                  },
                  "inlines": [
                      {
                          "text": "Sopot, ",
                          "characterFormat": {
                              "fontFamily": "Arial",
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "hasFieldEnd": true,
                          "characterFormat": {
                              "fontFamily": "Arial",
                              "fontFamilyBidi": "Arial"
                          },
                          "fieldType": 0
                      },
                      {
                          "text": " TIME \\\\@ \\yyyy-MM-dd\\ ",
                          "characterFormat": {
                              "fontFamily": "Arial",
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "fieldType": 2
                      },
                      {
                          "text": "2021-12-21",
                          "characterFormat": {
                              "fontFamily": "Arial",
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "fieldType": 1
                      }
                  ]
              },
              {
                  "characterFormat": {
                      "bold": true,
                      "fontSize": 11.0,
                      "fontFamily": "Arial",
                      "boldBidi": true,
                      "fontSizeBidi": 11.0,
                      "fontFamilyBidi": "Arial"
                  },
                  "paragraphFormat": {
                      "firstLineIndent": 0.15000000596046448,
                      "widowControl": false
                  },
                  "inlines": [
                      {
                          "text": "Dotyczy: szkody nr ",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "name": "numerSzkodyLik",
                          "bookmarkType": 0
                      },
                      {
                          "name": "numerSzkodyLik",
                          "bookmarkType": 1
                      },
                      {
                          "text": "${",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "numerSzkody",
                          "characterFormat": {
                              "bold": true,
                              "highlightColor": "Yellow",
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "} z dnia ",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "name": "dataZdarzenia",
                          "bookmarkType": 0
                      },
                      {
                          "name": "dataZdarzenia",
                          "bookmarkType": 1
                      },
                      {
                          "text": "${",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "dataZdarzenia",
                          "characterFormat": {
                              "bold": true,
                              "highlightColor": "Yellow",
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "}",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      }
                  ]
              },
              {
                  "characterFormat": {
                      "bold": true,
                      "fontSize": 11.0,
                      "fontFamily": "Arial",
                      "boldBidi": true,
                      "fontSizeBidi": 11.0,
                      "fontFamilyBidi": "Arial"
                  },
                  "paragraphFormat": {
                      "firstLineIndent": 0.15000000596046448,
                      "widowControl": false
                  },
                  "inlines": []
              },
              {
                  "characterFormat": {
                      "bold": true,
                      "fontSize": 11.0,
                      "fontFamily": "Arial",
                      "boldBidi": true,
                      "fontSizeBidi": 11.0,
                      "fontFamilyBidi": "Arial"
                  },
                  "paragraphFormat": {
                      "firstLineIndent": 0.15000000596046448,
                      "widowControl": false
                  },
                  "inlines": [
                      {
                          "text": "Poszkodowany: ",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "name": "poszkodowanyNazwa",
                          "bookmarkType": 0
                      },
                      {
                          "name": "poszkodowanyNazwa",
                          "bookmarkType": 1
                      },
                      {
                          "text": "${",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "poszkodowanyNazwa",
                          "characterFormat": {
                              "bold": true,
                              "highlightColor": "Yellow",
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "}",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      }
                  ]
              },
              {
                  "characterFormat": {
                      "bold": true,
                      "fontSize": 11.0,
                      "fontFamily": "Arial",
                      "boldBidi": true,
                      "fontSizeBidi": 11.0,
                      "fontFamilyBidi": "Arial"
                  },
                  "paragraphFormat": {
                      "leftIndent": 106.19999694824219,
                      "firstLineIndent": -106.19999694824219,
                      "widowControl": false
                  },
                  "inlines": [
                      {
                          "text": "Pojazd: ",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "name": "markaPojPoszk",
                          "bookmarkType": 0
                      },
                      {
                          "name": "markaPojPoszk",
                          "bookmarkType": 1
                      },
                      {
                          "text": "${",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "pojazdPoszkodowany",
                          "characterFormat": {
                              "bold": true,
                              "highlightColor": "Yellow",
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "}",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      }
                  ]
              },
              {
                  "characterFormat": {
                      "bold": true,
                      "fontSize": 11.0,
                      "fontFamily": "Arial",
                      "boldBidi": true,
                      "fontSizeBidi": 11.0,
                      "fontFamilyBidi": "Arial"
                  },
                  "paragraphFormat": {
                      "leftIndent": 106.19999694824219,
                      "firstLineIndent": -106.19999694824219,
                      "widowControl": false
                  },
                  "inlines": []
              },
              {
                  "characterFormat": {
                      "bold": true,
                      "fontSize": 11.0,
                      "fontFamily": "Arial",
                      "boldBidi": true,
                      "fontSizeBidi": 11.0,
                      "fontFamilyBidi": "Arial"
                  },
                  "paragraphFormat": {
                      "widowControl": false
                  },
                  "inlines": [
                      {
                          "text": "Opiekun szkody: ${",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "likwidator",
                          "characterFormat": {
                              "bold": true,
                              "highlightColor": "Yellow",
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "}",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      }
                  ]
              },
              {
                  "characterFormat": {
                      "bold": true,
                      "fontSize": 11.0,
                      "fontFamily": "Arial",
                      "boldBidi": true,
                      "fontSizeBidi": 11.0,
                      "fontFamilyBidi": "Arial"
                  },
                  "paragraphFormat": {
                      "widowControl": false
                  },
                  "inlines": [
                      {
                          "text": "Tel. ${",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "likwidatorTelSluzbowy",
                          "characterFormat": {
                              "bold": true,
                              "highlightColor": "Yellow",
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "}, ${",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "likwidatorMail",
                          "characterFormat": {
                              "bold": true,
                              "highlightColor": "Yellow",
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "}",
                          "characterFormat": {
                              "bold": true,
                              "fontSize": 11.0,
                              "fontFamily": "Arial",
                              "boldBidi": true,
                              "fontSizeBidi": 11.0,
                              "fontFamilyBidi": "Arial"
                          }
                      }
                  ]
              },
              {
                  "characterFormat": {
                      "fontSize": 13.5,
                      "fontSizeBidi": 13.5
                  },
                  "paragraphFormat": {
                      "beforeSpacing": 6.0,
                      "lineSpacing": 1.0,
                      "lineSpacingType": "Multiple",
                      "styleName": "Message Header",
                      "listFormat": {
                          "listLevelNumber": 0,
                          "listId": 0
                      },
                      "tabs": [
                          {
                              "tabJustification": "Left",
                              "position": 0.0,
                              "tabLeader": "None",
                              "deletePosition": 0.0
                          }
                      ],
                      "widowControl": false
                  },
                  "inlines": [
                      {
                          "text": "${",
                          "characterFormat": {
                              "fontSize": 9.0,
                              "fontSizeBidi": 9.0
                          }
                      },
                      {
                          "text": "pojazdPoszkodowany",
                          "characterFormat": {
                              "highlightColor": "Yellow",
                              "fontSize": 9.0,
                              "fontSizeBidi": 9.0
                          }
                      },
                      {
                          "text": "}",
                          "characterFormat": {
                              "fontSize": 9.0,
                              "fontSizeBidi": 9.0
                          }
                      }
                  ]
              },
              {
                  "rows": [
                      {
                          "rowFormat": {
                              "allowBreakAcrossPages": false,
                              "isHeader": false,
                              "height": 1.0,
                              "heightType": "AtLeast",
                              "borders": {
                                  "left": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "right": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "top": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "bottom": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "vertical": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "horizontal": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "diagonalDown": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false
                                  },
                                  "diagonalUp": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false
                                  }
                              }
                          },
                          "cells": [
                              {
                                  "blocks": [
                                      {
                                          "characterFormat": {
                                              "fontSize": 13.5,
                                              "fontSizeBidi": 13.5
                                          },
                                          "paragraphFormat": {
                                              "leftIndent": 0.0,
                                              "firstLineIndent": 0.0,
                                              "beforeSpacing": 6.0,
                                              "lineSpacing": 1.0,
                                              "lineSpacingType": "Multiple",
                                              "styleName": "Message Header",
                                              "tabs": [
                                                  {
                                                      "tabJustification": "Left",
                                                      "position": 0.0,
                                                      "tabLeader": "None",
                                                      "deletePosition": 0.0
                                                  }
                                              ],
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "${pojazdPoszkodowany}",
                                                  "characterFormat": {
                                                      "fontSize": 13.5,
                                                      "fontSizeBidi": 13.5
                                                  }
                                              }
                                          ]
                                      }
                                  ],
                                  "cellFormat": {
                                      "leftMargin": 5.400000095367432,
                                      "rightMargin": 5.400000095367432,
                                      "topMargin": 0.0,
                                      "bottomMargin": 0.0,
                                      "columnSpan": 1,
                                      "rowSpan": 1,
                                      "preferredWidth": 158.3000030517578,
                                      "preferredWidthType": "Point",
                                      "verticalAlignment": "Top",
                                      "borders": {
                                          "left": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "right": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "top": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "bottom": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "vertical": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "horizontal": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalDown": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalUp": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          }
                                      },
                                      "shading": {
                                          "texture": "TextureNone"
                                      },
                                      "cellWidth": 158.3000030517578
                                  }
                              },
                              {
                                  "blocks": [
                                      {
                                          "characterFormat": {
                                              "fontSize": 13.5,
                                              "fontSizeBidi": 13.5
                                          },
                                          "paragraphFormat": {
                                              "beforeSpacing": 6.0,
                                              "lineSpacing": 1.0,
                                              "lineSpacingType": "Multiple",
                                              "styleName": "Message Header",
                                              "listFormat": {
                                                  "listLevelNumber": 0,
                                                  "listId": 2
                                              },
                                              "tabs": [
                                                  {
                                                      "tabJustification": "Left",
                                                      "position": 0.0,
                                                      "tabLeader": "None",
                                                      "deletePosition": 0.0
                                                  }
                                              ],
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "${pojazdPoszkodowany}",
                                                  "characterFormat": {
                                                      "fontSize": 13.5,
                                                      "fontSizeBidi": 13.5
                                                  }
                                              }
                                          ]
                                      }
                                  ],
                                  "cellFormat": {
                                      "leftMargin": 5.400000095367432,
                                      "rightMargin": 5.400000095367432,
                                      "topMargin": 0.0,
                                      "bottomMargin": 0.0,
                                      "columnSpan": 1,
                                      "rowSpan": 1,
                                      "preferredWidth": 158.3000030517578,
                                      "preferredWidthType": "Point",
                                      "verticalAlignment": "Top",
                                      "borders": {
                                          "left": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "right": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "top": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "bottom": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "vertical": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "horizontal": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalDown": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalUp": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          }
                                      },
                                      "shading": {
                                          "texture": "TextureNone"
                                      },
                                      "cellWidth": 158.3000030517578
                                  }
                              },
                              {
                                  "blocks": [
                                      {
                                          "characterFormat": {
                                              "fontSize": 13.5,
                                              "fontSizeBidi": 13.5
                                          },
                                          "paragraphFormat": {
                                              "leftIndent": 0.0,
                                              "firstLineIndent": 0.0,
                                              "beforeSpacing": 6.0,
                                              "lineSpacing": 1.0,
                                              "lineSpacingType": "Multiple",
                                              "styleName": "Message Header",
                                              "tabs": [
                                                  {
                                                      "tabJustification": "Left",
                                                      "position": 0.0,
                                                      "tabLeader": "None",
                                                      "deletePosition": 0.0
                                                  }
                                              ],
                                              "widowControl": false
                                          },
                                          "inlines": []
                                      }
                                  ],
                                  "cellFormat": {
                                      "leftMargin": 5.400000095367432,
                                      "rightMargin": 5.400000095367432,
                                      "topMargin": 0.0,
                                      "bottomMargin": 0.0,
                                      "columnSpan": 1,
                                      "rowSpan": 1,
                                      "preferredWidth": 158.3000030517578,
                                      "preferredWidthType": "Point",
                                      "verticalAlignment": "Top",
                                      "borders": {
                                          "left": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "right": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "top": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "bottom": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "vertical": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "horizontal": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalDown": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalUp": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          }
                                      },
                                      "shading": {
                                          "texture": "TextureNone"
                                      },
                                      "cellWidth": 158.3000030517578
                                  }
                              }
                          ]
                      },
                      {
                          "rowFormat": {
                              "allowBreakAcrossPages": false,
                              "isHeader": false,
                              "height": 1.0,
                              "heightType": "AtLeast",
                              "borders": {
                                  "left": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "right": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "top": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "bottom": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "vertical": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "horizontal": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "diagonalDown": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false
                                  },
                                  "diagonalUp": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false
                                  }
                              }
                          },
                          "cells": [
                              {
                                  "blocks": [
                                      {
                                          "characterFormat": {
                                              "fontSize": 13.5,
                                              "fontSizeBidi": 13.5
                                          },
                                          "paragraphFormat": {
                                              "leftIndent": 0.0,
                                              "firstLineIndent": 0.0,
                                              "beforeSpacing": 6.0,
                                              "lineSpacing": 1.0,
                                              "lineSpacingType": "Multiple",
                                              "styleName": "Message Header",
                                              "tabs": [
                                                  {
                                                      "tabJustification": "Left",
                                                      "position": 0.0,
                                                      "tabLeader": "None",
                                                      "deletePosition": 0.0
                                                  }
                                              ],
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "${pojazdPoszkodowany}",
                                                  "characterFormat": {
                                                      "fontSize": 13.5,
                                                      "fontSizeBidi": 13.5
                                                  }
                                              }
                                          ]
                                      }
                                  ],
                                  "cellFormat": {
                                      "leftMargin": 5.400000095367432,
                                      "rightMargin": 5.400000095367432,
                                      "topMargin": 0.0,
                                      "bottomMargin": 0.0,
                                      "columnSpan": 1,
                                      "rowSpan": 1,
                                      "preferredWidth": 158.3000030517578,
                                      "preferredWidthType": "Point",
                                      "verticalAlignment": "Top",
                                      "borders": {
                                          "left": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "right": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "top": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "bottom": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "vertical": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "horizontal": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalDown": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalUp": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          }
                                      },
                                      "shading": {
                                          "texture": "TextureNone"
                                      },
                                      "cellWidth": 158.3000030517578
                                  }
                              },
                              {
                                  "blocks": [
                                      {
                                          "characterFormat": {
                                              "fontSize": 13.5,
                                              "fontSizeBidi": 13.5
                                          },
                                          "paragraphFormat": {
                                              "beforeSpacing": 6.0,
                                              "lineSpacing": 1.0,
                                              "lineSpacingType": "Multiple",
                                              "styleName": "Message Header",
                                              "listFormat": {
                                                  "listLevelNumber": 0,
                                                  "listId": 4
                                              },
                                              "tabs": [
                                                  {
                                                      "tabJustification": "Left",
                                                      "position": 0.0,
                                                      "tabLeader": "None",
                                                      "deletePosition": 0.0
                                                  }
                                              ],
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "${pojazdPoszkodowany}",
                                                  "characterFormat": {
                                                      "fontSize": 13.5,
                                                      "fontSizeBidi": 13.5
                                                  }
                                              }
                                          ]
                                      }
                                  ],
                                  "cellFormat": {
                                      "leftMargin": 5.400000095367432,
                                      "rightMargin": 5.400000095367432,
                                      "topMargin": 0.0,
                                      "bottomMargin": 0.0,
                                      "columnSpan": 1,
                                      "rowSpan": 1,
                                      "preferredWidth": 158.3000030517578,
                                      "preferredWidthType": "Point",
                                      "verticalAlignment": "Top",
                                      "borders": {
                                          "left": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "right": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "top": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "bottom": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "vertical": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "horizontal": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalDown": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalUp": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          }
                                      },
                                      "shading": {
                                          "texture": "TextureNone"
                                      },
                                      "cellWidth": 158.3000030517578
                                  }
                              },
                              {
                                  "blocks": [
                                      {
                                          "characterFormat": {
                                              "fontSize": 13.5,
                                              "fontSizeBidi": 13.5
                                          },
                                          "paragraphFormat": {
                                              "leftIndent": 0.0,
                                              "firstLineIndent": 0.0,
                                              "beforeSpacing": 6.0,
                                              "lineSpacing": 1.0,
                                              "lineSpacingType": "Multiple",
                                              "styleName": "Message Header",
                                              "tabs": [
                                                  {
                                                      "tabJustification": "Left",
                                                      "position": 0.0,
                                                      "tabLeader": "None",
                                                      "deletePosition": 0.0
                                                  }
                                              ],
                                              "widowControl": false
                                          },
                                          "inlines": []
                                      }
                                  ],
                                  "cellFormat": {
                                      "leftMargin": 5.400000095367432,
                                      "rightMargin": 5.400000095367432,
                                      "topMargin": 0.0,
                                      "bottomMargin": 0.0,
                                      "columnSpan": 1,
                                      "rowSpan": 1,
                                      "preferredWidth": 158.3000030517578,
                                      "preferredWidthType": "Point",
                                      "verticalAlignment": "Top",
                                      "borders": {
                                          "left": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "right": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "top": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "bottom": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "vertical": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "horizontal": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalDown": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalUp": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          }
                                      },
                                      "shading": {
                                          "texture": "TextureNone"
                                      },
                                      "cellWidth": 158.3000030517578
                                  }
                              }
                          ]
                      },
                      {
                          "rowFormat": {
                              "allowBreakAcrossPages": false,
                              "isHeader": false,
                              "height": 1.0,
                              "heightType": "AtLeast",
                              "borders": {
                                  "left": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "right": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "top": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "bottom": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "vertical": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "horizontal": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "diagonalDown": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false
                                  },
                                  "diagonalUp": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false
                                  }
                              }
                          },
                          "cells": [
                              {
                                  "blocks": [
                                      {
                                          "characterFormat": {
                                              "fontSize": 13.5,
                                              "fontSizeBidi": 13.5
                                          },
                                          "paragraphFormat": {
                                              "leftIndent": 0.0,
                                              "firstLineIndent": 0.0,
                                              "beforeSpacing": 6.0,
                                              "lineSpacing": 1.0,
                                              "lineSpacingType": "Multiple",
                                              "styleName": "Message Header",
                                              "tabs": [
                                                  {
                                                      "tabJustification": "Left",
                                                      "position": 0.0,
                                                      "tabLeader": "None",
                                                      "deletePosition": 0.0
                                                  }
                                              ],
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "${pojazdPoszkodowany}",
                                                  "characterFormat": {
                                                      "fontSize": 13.5,
                                                      "fontSizeBidi": 13.5
                                                  }
                                              }
                                          ]
                                      }
                                  ],
                                  "cellFormat": {
                                      "leftMargin": 5.400000095367432,
                                      "rightMargin": 5.400000095367432,
                                      "topMargin": 0.0,
                                      "bottomMargin": 0.0,
                                      "columnSpan": 1,
                                      "rowSpan": 1,
                                      "preferredWidth": 158.3000030517578,
                                      "preferredWidthType": "Point",
                                      "verticalAlignment": "Top",
                                      "borders": {
                                          "left": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "right": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "top": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "bottom": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "vertical": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "horizontal": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalDown": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalUp": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          }
                                      },
                                      "shading": {
                                          "texture": "TextureNone"
                                      },
                                      "cellWidth": 158.3000030517578
                                  }
                              },
                              {
                                  "blocks": [
                                      {
                                          "characterFormat": {
                                              "fontSize": 13.5,
                                              "fontSizeBidi": 13.5
                                          },
                                          "paragraphFormat": {
                                              "beforeSpacing": 6.0,
                                              "lineSpacing": 1.0,
                                              "lineSpacingType": "Multiple",
                                              "styleName": "Message Header",
                                              "listFormat": {
                                                  "listLevelNumber": 0,
                                                  "listId": 1
                                              },
                                              "tabs": [
                                                  {
                                                      "tabJustification": "Left",
                                                      "position": 0.0,
                                                      "tabLeader": "None",
                                                      "deletePosition": 0.0
                                                  }
                                              ],
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "${pojazdPoszkodowany}",
                                                  "characterFormat": {
                                                      "fontSize": 13.5,
                                                      "fontSizeBidi": 13.5
                                                  }
                                              }
                                          ]
                                      }
                                  ],
                                  "cellFormat": {
                                      "leftMargin": 5.400000095367432,
                                      "rightMargin": 5.400000095367432,
                                      "topMargin": 0.0,
                                      "bottomMargin": 0.0,
                                      "columnSpan": 1,
                                      "rowSpan": 1,
                                      "preferredWidth": 158.3000030517578,
                                      "preferredWidthType": "Point",
                                      "verticalAlignment": "Top",
                                      "borders": {
                                          "left": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "right": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "top": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "bottom": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "vertical": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "horizontal": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalDown": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalUp": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          }
                                      },
                                      "shading": {
                                          "texture": "TextureNone"
                                      },
                                      "cellWidth": 158.3000030517578
                                  }
                              },
                              {
                                  "blocks": [
                                      {
                                          "characterFormat": {
                                              "fontSize": 13.5,
                                              "fontSizeBidi": 13.5
                                          },
                                          "paragraphFormat": {
                                              "leftIndent": 0.0,
                                              "firstLineIndent": 0.0,
                                              "beforeSpacing": 6.0,
                                              "lineSpacing": 1.0,
                                              "lineSpacingType": "Multiple",
                                              "styleName": "Message Header",
                                              "tabs": [
                                                  {
                                                      "tabJustification": "Left",
                                                      "position": 0.0,
                                                      "tabLeader": "None",
                                                      "deletePosition": 0.0
                                                  }
                                              ],
                                              "widowControl": false
                                          },
                                          "inlines": []
                                      }
                                  ],
                                  "cellFormat": {
                                      "leftMargin": 5.400000095367432,
                                      "rightMargin": 5.400000095367432,
                                      "topMargin": 0.0,
                                      "bottomMargin": 0.0,
                                      "columnSpan": 1,
                                      "rowSpan": 1,
                                      "preferredWidth": 158.3000030517578,
                                      "preferredWidthType": "Point",
                                      "verticalAlignment": "Top",
                                      "borders": {
                                          "left": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "right": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "top": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "bottom": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "vertical": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "horizontal": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalDown": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalUp": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          }
                                      },
                                      "shading": {
                                          "texture": "TextureNone"
                                      },
                                      "cellWidth": 158.3000030517578
                                  }
                              }
                          ]
                      }
                  ],
                  "title": null,
                  "description": null,
                  "tableFormat": {
                      "allowAutoFit": false,
                      "leftIndent": 0.0,
                      "tableAlignment": "Left",
                      "preferredWidthType": "Auto",
                      "borders": {
                          "left": {
                              "lineStyle": "Single",
                              "lineWidth": 0.5,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false,
                              "color": "#000000FF"
                          },
                          "right": {
                              "lineStyle": "Single",
                              "lineWidth": 0.5,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false,
                              "color": "#000000FF"
                          },
                          "top": {
                              "lineStyle": "Single",
                              "lineWidth": 0.5,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false,
                              "color": "#000000FF"
                          },
                          "bottom": {
                              "lineStyle": "Single",
                              "lineWidth": 0.5,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false,
                              "color": "#000000FF"
                          },
                          "vertical": {
                              "lineStyle": "Single",
                              "lineWidth": 0.5,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false,
                              "color": "#000000FF"
                          },
                          "horizontal": {
                              "lineStyle": "Single",
                              "lineWidth": 0.5,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false,
                              "color": "#000000FF"
                          },
                          "diagonalDown": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false
                          },
                          "diagonalUp": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false
                          }
                      },
                      "bidi": false,
                      "horizontalPositionAbs": "Left",
                      "horizontalPosition": 0.0
                  }
              },
              {
                  "characterFormat": {
                      "fontSize": 13.5,
                      "fontSizeBidi": 13.5
                  },
                  "paragraphFormat": {
                      "leftIndent": 0.0,
                      "firstLineIndent": 0.0,
                      "beforeSpacing": 6.0,
                      "lineSpacing": 1.0,
                      "lineSpacingType": "Multiple",
                      "styleName": "Message Header",
                      "tabs": [
                          {
                              "tabJustification": "Left",
                              "position": 0.0,
                              "tabLeader": "None",
                              "deletePosition": 0.0
                          }
                      ],
                      "widowControl": false
                  },
                  "inlines": []
              },
              {
                  "rows": [
                      {
                          "rowFormat": {
                              "allowBreakAcrossPages": true,
                              "isHeader": false,
                              "height": 1.0,
                              "heightType": "AtLeast",
                              "borders": {
                                  "left": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "right": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "top": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "bottom": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "vertical": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "horizontal": {
                                      "lineStyle": "Single",
                                      "lineWidth": 0.5,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false,
                                      "color": "#000000FF"
                                  },
                                  "diagonalDown": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false
                                  },
                                  "diagonalUp": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false
                                  }
                              },
                              "leftMargin": 7.1,
                              "rightMargin": 7.1,
                              "topMargin": 3.7,
                              "bottomMargin": 3.7
                          },
                          "cells": [
                              {
                                  "blocks": [
                                      {
                                          "characterFormat": {
                                              "bold": true,
                                              "fontFamily": "Arial",
                                              "boldBidi": true,
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "afterSpacing": 6.0,
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "Dlaczego wysłaliśmy to pismo?",
                                                  "characterFormat": {
                                                      "bold": true,
                                                      "fontFamily": "Arial",
                                                      "boldBidi": true,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontFamily": "Arial",
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "afterSpacing": 6.0,
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "Informujemy, że jesteśmy w trakcie likwidacji zgłoszonej szkody.",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontFamily": "Arial",
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "afterSpacing": 6.0,
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "Niestety nie jesteśmy w stanie zakończyć jej w terminie 30 dni, ponieważ nie dysponujemy wszystkimi potrzebnymi informacjami. Decyzja w sprawie odszkodowania zos",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "tanie przekazana w ciągu 14 dni od otrzymania kompletu dokumentów",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "[",
                                                  "characterFormat": {
                                                      "baselineAlignment": "Superscript",
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "footnoteType": "Footnote",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  },
                                                  "blocks": [
                                                      {
                                                          "paragraphFormat": {
                                                              "styleName": "Footnote Text"
                                                          },
                                                          "inlines": [
                                                              {
                                                                  "text": "\\u0002"
                                                              },
                                                              {
                                                                  "text": " "
                                                              },
                                                              {
                                                                  "text": "Zgodnie z art. 29 ust. 4 ustawy z 11 września 2015 r. o działalności ubezpieczeniowej i reasekuracyjnej (Dz.U. z 2015 r., poz. 1844) w zw. z art. 817 § 1 i § 2 ustawy z 23 kwietnia 1964 r. Kodeks cywilny (t.j. Dz.U. z 2014 r., poz. 121).",
                                                                  "characterFormat": {
                                                                      "fontSize": 8.0,
                                                                      "fontFamily": "Arial",
                                                                      "fontSizeBidi": 8.0,
                                                                      "fontFamilyBidi": "Arial"
                                                                  }
                                                              }
                                                          ]
                                                      }
                                                  ],
                                                  "symbolCode": 0,
                                                  "symbolFontName": "Symbol"
                                              },
                                              {
                                                  "text": "]",
                                                  "characterFormat": {
                                                      "baselineAlignment": "Superscript",
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": ".",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontFamily": "Arial",
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "Poniżej przedstawiamy wykaz niezbędnych dokumentów:",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontFamily": "Arial",
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "listFormat": {
                                                  "listLevelNumber": 0,
                                                  "listId": 3
                                              },
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "notatka policji lub potwierdzenie okoliczności przez sprawcę zdarzenia,",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontFamily": "Arial",
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "listFormat": {
                                                  "listLevelNumber": 0,
                                                  "listId": 3
                                              },
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "dowód rejestracyjny pojazdu (kopia obu stron dokumentu lub wypis z wydziału komunikacji),",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontSize": 10.0,
                                              "fontFamily": "Arial",
                                              "fontSizeBidi": 10.0,
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "styleName": "List Paragraph",
                                              "listFormat": {
                                                  "listLevelNumber": 0,
                                                  "listId": 3
                                              },
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "dane kierującego pojazdem, jeśli pojazd był w ruchu (imię, nazwisko, PESEL, adres zamieszkania",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "),",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontSize": 10.0,
                                              "fontFamily": "Arial",
                                              "fontSizeBidi": 10.0,
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "styleName": "List Paragraph",
                                              "listFormat": {
                                                  "listLevelNumber": 0,
                                                  "listId": 3
                                              },
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "oświadczenie kierującego o posiadaniu uprawnień do kierowania pojazdem wraz z informacją o uzyskanych kategoriach prawa jazdy,",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontFamily": "Arial",
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "listFormat": {
                                                  "listLevelNumber": 0,
                                                  "listId": 3
                                              },
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "dyspozycja wypłaty odszkodowania (podpisana przez wszystkich współwłaścicieli pojazdu),",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontFamily": "Arial",
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "listFormat": {
                                                  "listLevelNumber": 0,
                                                  "listId": 3
                                              },
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "zgoda banku lub leasingu na wypłatę odszkodowania podmiotowi wskazanemu do jego odebrania,",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontFamily": "Arial",
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "listFormat": {
                                                  "listLevelNumber": 0,
                                                  "listId": 3
                                              },
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "dowody poniesienia kosztów naprawy – sporządzony przez serwis kosztorys oraz ",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "faktura.",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontSize": 9.0,
                                              "fontFamily": "Arial",
                                              "fontSizeBidi": 9.0,
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "widowControl": false
                                          },
                                          "inlines": []
                                      }
                                  ],
                                  "cellFormat": {
                                      "leftMargin": 7.099999904632568,
                                      "rightMargin": 7.099999904632568,
                                      "topMargin": 3.700000047683716,
                                      "bottomMargin": 3.700000047683716,
                                      "columnSpan": 1,
                                      "rowSpan": 1,
                                      "preferredWidth": 100.0,
                                      "preferredWidthType": "Percent",
                                      "verticalAlignment": "Top",
                                      "borders": {
                                          "left": {
                                              "lineStyle": "Single",
                                              "lineWidth": 0.5,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false,
                                              "color": "#D9D9D9FF"
                                          },
                                          "right": {
                                              "lineStyle": "Single",
                                              "lineWidth": 0.5,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false,
                                              "color": "#D9D9D9FF"
                                          },
                                          "top": {
                                              "lineStyle": "Single",
                                              "lineWidth": 0.5,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false,
                                              "color": "#D9D9D9FF"
                                          },
                                          "bottom": {
                                              "lineStyle": "Single",
                                              "lineWidth": 0.5,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false,
                                              "color": "#D9D9D9FF"
                                          },
                                          "vertical": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "horizontal": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalDown": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalUp": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          }
                                      },
                                      "shading": {
                                          "texture": "TextureNone"
                                      },
                                      "cellWidth": 482.78192138671875
                                  }
                              }
                          ]
                      }
                  ],
                  "title": null,
                  "description": null,
                  "tableFormat": {
                      "allowAutoFit": true,
                      "leftMargin": 7.099999904632568,
                      "rightMargin": 7.099999904632568,
                      "topMargin": 3.700000047683716,
                      "bottomMargin": 3.700000047683716,
                      "leftIndent": 0.0,
                      "tableAlignment": "Left",
                      "preferredWidth": 98.68000030517578,
                      "preferredWidthType": "Percent",
                      "borders": {
                          "left": {
                              "lineStyle": "Single",
                              "lineWidth": 0.5,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false,
                              "color": "#000000FF"
                          },
                          "right": {
                              "lineStyle": "Single",
                              "lineWidth": 0.5,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false,
                              "color": "#000000FF"
                          },
                          "top": {
                              "lineStyle": "Single",
                              "lineWidth": 0.5,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false,
                              "color": "#000000FF"
                          },
                          "bottom": {
                              "lineStyle": "Single",
                              "lineWidth": 0.5,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false,
                              "color": "#000000FF"
                          },
                          "vertical": {
                              "lineStyle": "Single",
                              "lineWidth": 0.5,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false,
                              "color": "#000000FF"
                          },
                          "horizontal": {
                              "lineStyle": "Single",
                              "lineWidth": 0.5,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false,
                              "color": "#000000FF"
                          },
                          "diagonalDown": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false
                          },
                          "diagonalUp": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false
                          }
                      },
                      "bidi": false,
                      "horizontalPositionAbs": "Left",
                      "horizontalPosition": 0.0
                  }
              },
              {
                  "characterFormat": {
                      "fontFamily": "Arial",
                      "fontFamilyBidi": "Arial"
                  },
                  "paragraphFormat": {
                      "widowControl": false
                  },
                  "inlines": []
              },
              {
                  "rows": [
                      {
                          "rowFormat": {
                              "allowBreakAcrossPages": true,
                              "isHeader": false,
                              "height": 1.0,
                              "heightType": "AtLeast",
                              "borders": {
                                  "left": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": true
                                  },
                                  "right": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": true
                                  },
                                  "top": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": true
                                  },
                                  "bottom": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": true
                                  },
                                  "vertical": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": true
                                  },
                                  "horizontal": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": true
                                  },
                                  "diagonalDown": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false
                                  },
                                  "diagonalUp": {
                                      "lineStyle": "None",
                                      "lineWidth": 0.0,
                                      "shadow": false,
                                      "space": 0.0,
                                      "hasNoneStyle": false
                                  }
                              },
                              "leftMargin": 0.0,
                              "rightMargin": 0.0
                          },
                          "cells": [
                              {
                                  "blocks": [
                                      {
                                          "characterFormat": {
                                              "bold": true,
                                              "fontFamily": "Arial",
                                              "boldBidi": true,
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "afterSpacing": 6.0,
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "Co należy zrobić?",
                                                  "characterFormat": {
                                                      "bold": true,
                                                      "fontFamily": "Arial",
                                                      "boldBidi": true,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontFamily": "Arial",
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "Prosimy o przesłanie dokumentów oznaczonych nr ",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "___",
                                                  "characterFormat": {
                                                      "highlightColor": "Yellow",
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": " w najwygodniejszy sposób:",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontSize": 10.0,
                                              "fontFamily": "Arial",
                                              "fontSizeBidi": 10.0,
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "leftIndent": 14.199999809265137,
                                              "styleName": "List Paragraph",
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": " ",
                                                  "characterFormat": {
                                                      "fontSize": 9.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 9.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "samodzielnie na stronie:",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "      ",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "www.ergohestia.pl",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontSize": 10.0,
                                              "fontFamily": "Arial",
                                              "fontSizeBidi": 10.0,
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "leftIndent": 14.199999809265137,
                                              "styleName": "List Paragraph",
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": " ",
                                                  "characterFormat": {
                                                      "fontSize": 9.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 9.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "pocztą elektroniczną (jako skan, zdjęcie) na adres: ",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "${",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "likwidatorMail",
                                                  "characterFormat": {
                                                      "highlightColor": "Yellow",
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "}",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontSize": 10.0,
                                              "fontFamily": "Arial",
                                              "fontSizeBidi": 10.0,
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "leftIndent": 14.199999809265137,
                                              "rightIndent": -6.349999904632568,
                                              "styleName": "List Paragraph",
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": " ",
                                                  "characterFormat": {
                                                      "fontSize": 9.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 9.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "pocztą tradycyjną na adres:",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "STU ERGO Hestia SA",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontSize": 10.0,
                                              "fontFamily": "Arial",
                                              "fontSizeBidi": 10.0,
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "leftIndent": 14.199999809265137,
                                              "rightIndent": -6.349999904632568,
                                              "firstLineIndent": 269.29998779296875,
                                              "styleName": "List Paragraph",
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "Biuro Operacji i Likwidacji Szkód",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\u000b",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "\\t",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "ul. Hestii 1, 81-731 Sopot",
                                                  "characterFormat": {
                                                      "fontSize": 10.0,
                                                      "fontFamily": "Arial",
                                                      "fontSizeBidi": 10.0,
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontFamily": "Arial",
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "beforeSpacing": 6.0,
                                              "afterSpacing": 6.0,
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "Uprzejmie prosimy o ich pilne uzupełnienie. O pozostałe dokument",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              },
                                              {
                                                  "text": "y wystąpiliśmy do właściwych podmiotów i oczekujemy na ich dostarczenie. W korespondencji prosimy powoływać się na numer szkody podany powyżej.",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      },
                                      {
                                          "characterFormat": {
                                              "fontFamily": "Arial",
                                              "fontFamilyBidi": "Arial"
                                          },
                                          "paragraphFormat": {
                                              "beforeSpacing": 6.0,
                                              "afterSpacing": 6.0,
                                              "widowControl": false
                                          },
                                          "inlines": [
                                              {
                                                  "text": "Prosimy o nieprzesyłanie obrazów dokumentów z wizerunkiem.",
                                                  "characterFormat": {
                                                      "fontFamily": "Arial",
                                                      "fontFamilyBidi": "Arial"
                                                  }
                                              }
                                          ]
                                      }
                                  ],
                                  "cellFormat": {
                                      "leftMargin": 7.099999904632568,
                                      "rightMargin": 7.099999904632568,
                                      "topMargin": 3.700000047683716,
                                      "bottomMargin": 3.700000047683716,
                                      "columnSpan": 1,
                                      "rowSpan": 1,
                                      "preferredWidth": 100.0,
                                      "preferredWidthType": "Percent",
                                      "verticalAlignment": "Top",
                                      "borders": {
                                          "left": {
                                              "lineStyle": "Single",
                                              "lineWidth": 1.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false,
                                              "color": "#D9D9D9FF"
                                          },
                                          "right": {
                                              "lineStyle": "Single",
                                              "lineWidth": 1.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false,
                                              "color": "#D9D9D9FF"
                                          },
                                          "top": {
                                              "lineStyle": "Single",
                                              "lineWidth": 1.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false,
                                              "color": "#D9D9D9FF"
                                          },
                                          "bottom": {
                                              "lineStyle": "Single",
                                              "lineWidth": 1.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false,
                                              "color": "#D9D9D9FF"
                                          },
                                          "vertical": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "horizontal": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalDown": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          },
                                          "diagonalUp": {
                                              "lineStyle": "None",
                                              "lineWidth": 0.0,
                                              "shadow": false,
                                              "space": 0.0,
                                              "hasNoneStyle": false
                                          }
                                      },
                                      "shading": {
                                          "texture": "TextureNone"
                                      },
                                      "cellWidth": 482.78192138671875
                                  }
                              }
                          ]
                      }
                  ],
                  "title": null,
                  "description": null,
                  "tableFormat": {
                      "allowAutoFit": true,
                      "leftMargin": 0.0,
                      "rightMargin": 0.0,
                      "leftIndent": 0.0,
                      "tableAlignment": "Left",
                      "preferredWidth": 98.68000030517578,
                      "preferredWidthType": "Percent",
                      "borders": {
                          "left": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": true
                          },
                          "right": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": true
                          },
                          "top": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": true
                          },
                          "bottom": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": true
                          },
                          "vertical": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": true
                          },
                          "horizontal": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": true
                          },
                          "diagonalDown": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false
                          },
                          "diagonalUp": {
                              "lineStyle": "None",
                              "lineWidth": 0.0,
                              "shadow": false,
                              "space": 0.0,
                              "hasNoneStyle": false
                          }
                      },
                      "bidi": false,
                      "horizontalPositionAbs": "Left",
                      "horizontalPosition": 0.0
                  }
              },
              {
                  "characterFormat": {
                      "fontFamily": "Arial",
                      "fontFamilyBidi": "Arial"
                  },
                  "paragraphFormat": {
                      "beforeSpacing": 6.0,
                      "widowControl": false
                  },
                  "inlines": [
                      {
                          "text": "Z wyrazami szacunku",
                          "characterFormat": {
                              "fontFamily": "Arial",
                              "fontFamilyBidi": "Arial"
                          }
                      }
                  ]
              },
              {
                  "characterFormat": {
                      "fontFamily": "Arial",
                      "fontFamilyBidi": "Arial"
                  },
                  "paragraphFormat": {
                      "widowControl": false
                  },
                  "inlines": [
                      {
                          "text": "${",
                          "characterFormat": {
                              "fontFamily": "Arial",
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "faksymileUzytkownika",
                          "characterFormat": {
                              "highlightColor": "Yellow",
                              "fontFamily": "Arial",
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "}",
                          "characterFormat": {
                              "fontFamily": "Arial",
                              "fontFamilyBidi": "Arial"
                          }
                      }
                  ]
              },
              {
                  "characterFormat": {
                      "fontFamily": "Arial",
                      "fontFamilyBidi": "Arial"
                  },
                  "paragraphFormat": {
                      "widowControl": false
                  },
                  "inlines": [
                      {
                          "text": "${",
                          "characterFormat": {
                              "fontFamily": "Arial",
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "imieNazwiskoZalogowanego",
                          "characterFormat": {
                              "highlightColor": "Yellow",
                              "fontFamily": "Arial",
                              "fontFamilyBidi": "Arial"
                          }
                      },
                      {
                          "text": "}",
                          "characterFormat": {
                              "fontFamily": "Arial",
                              "fontFamilyBidi": "Arial"
                          }
                      }
                  ]
              },
              {
                  "characterFormat": {
                      "fontSize": 9.0,
                      "fontFamily": "Arial",
                      "fontSizeBidi": 9.0,
                      "fontFamilyBidi": "Arial"
                  },
                  "paragraphFormat": {
                      "widowControl": false
                  },
                  "inlines": [
                      {
                          "text": "Biuro Operacji i Likwidacji Szkód  ",
                          "characterFormat": {
                              "fontFamily": "Arial",
                              "fontFamilyBidi": "Arial"
                          }
                      }
                  ]
              }
          ],
          "headersFooters": {
              "header": {
                  "blocks": [
                      {
                          "paragraphFormat": {
                              "textAlignment": "Right"
                          },
                          "inlines": [
                              {
                                  "name": "1",
                                  "visible": true,
                                  "width": 243.35023,
                                  "height": 110.04977,
                                  "widthScale": 64.63486,
                                  "heightScale": 38.613953,
                                  "textWrappingStyle": "Inline",
                                  "textWrappingType": "Both",
                                  "verticalPosition": 0.0,
                                  "verticalOrigin": "Margin",
                                  "verticalAlignment": "None",
                                  "verticalRelativePercent": 0.0,
                                  "horizontalPosition": 0.0,
                                  "horizontalOrigin": "Margin",
                                  "horizontalAlignment": "None",
                                  "horizontalRelativePercent": 0.0,
                                  "zOrderPosition": 2147483647,
                                  "allowOverlap": true,
                                  "layoutInCell": true,
                                  "distanceBottom": 0.0,
                                  "distanceLeft": 9.0,
                                  "distanceRight": 9.0,
                                  "distanceTop": 0.0,
                                  "imageString": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfYAAAF8CAYAAAA9wJkCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4M0U1QTBGNDIyNUMxMUU4QTY2NkFDMUQ1REM4NThGRiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4M0U1QTBGMzIyNUMxMUU4QTY2NkFDMUQ1REM4NThGRiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iNUI2MUEwMTczNzYwNUZFOTdGMDZDNkE5QUM4NjUyQTMiIHN0UmVmOmRvY3VtZW50SUQ9IjVCNjFBMDE3Mzc2MDVGRTk3RjA2QzZBOUFDODY1MkEzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8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",
                                  "length": 1,
                                  "isInlineImage": true,
                                  "isMetaFile": false,
                                  "top": 0.0,
                                  "bottom": 0.0,
                                  "right": 0.0,
                                  "left": 0.0,
                                  "getimageheight": 0.0,
                                  "getimagewidth": 0.0
                              }
                          ]
                      }
                  ]
              },
              "footer": {
                  "blocks": [
                      {
                          "inlines": []
                      }
                  ]
              },
              "evenHeader": {
                  "blocks": [
                      {
                          "inlines": []
                      }
                  ]
              },
              "evenFooter": {
                  "blocks": [
                      {
                          "inlines": []
                      }
                  ]
              },
              "firstPageHeader": {
                  "blocks": [
                      {
                          "inlines": []
                      }
                  ]
              },
              "firstPageFooter": {
                  "blocks": [
                      {
                          "inlines": []
                      }
                  ]
              }
          },
          "sectionFormat": {
              "headerDistance": 35.45000076293945,
              "footerDistance": 72.0,
              "pageWidth": 595.3499755859375,
              "pageHeight": 842.0,
              "leftMargin": 70.9000015258789,
              "rightMargin": 49.599998474121094,
              "topMargin": 127.5999984741211,
              "bottomMargin": 49.599998474121094,
              "differentFirstPage": false,
              "differentOddAndEvenPages": false,
              "bidi": false,
              "restartPageNumbering": false,
              "pageStartingNumber": 0,
              "endnoteNumberFormat": "LowerCaseRoman",
              "footNoteNumberFormat": "Arabic",
              "restartIndexForFootnotes": "DoNotRestart",
              "restartIndexForEndnotes": "DoNotRestart",
              "columns": {
                  "column": [
                      {
                          "width": 474.8500061035156,
                          "space": 0.0
                      }
                  ],
                  "numberOfColumns": 1,
                  "equalWidth": true
              }
          }
      }
  ],
  "fontSubstitutionTable": {
      "SimHei": "黑体",
      "SimSun": "宋体"
  },
  "characterFormat": {
      "fontSize": 11.0,
      "fontFamily": "Calibri",
      "fontColor": "#000000FF",
      "fontSizeBidi": 11.0,
      "fontFamilyBidi": "Calibri"
  },
  "lists": [
      {
          "listId": 0,
          "abstractListId": 0
      },
      {
          "listId": 1,
          "abstractListId": 1
      },
      {
          "listId": 2,
          "abstractListId": 2
      },
      {
          "listId": 3,
          "abstractListId": 3
      },
      {
          "listId": 4,
          "abstractListId": 4
      }
  ],
  "abstractLists": [
      {
          "abstractListId": 0,
          "levels": [
              {
                  "listLevelPattern": "Bullet",
                  "followCharacter": "Tab",
                  "numberFormat": "",
                  "characterFormat": {
                      "fontFamily": "Symbol",
                      "fontFamilyBidi": "Symbol"
                  },
                  "paragraphFormat": {
                      "leftIndent": 36.0,
                      "firstLineIndent": -18.0
                  }
              },
              {
                  "startAt": 0,
                  "restartLevel": 1,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 2,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 3,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 4,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 5,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 6,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 7,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 8,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              }
          ]
      },
      {
          "abstractListId": 1,
          "levels": [
              {
                  "listLevelPattern": "Bullet",
                  "followCharacter": "Tab",
                  "numberFormat": "",
                  "characterFormat": {
                      "fontFamily": "Symbol",
                      "fontFamilyBidi": "Symbol"
                  },
                  "paragraphFormat": {
                      "leftIndent": 36.0,
                      "firstLineIndent": -18.0
                  }
              },
              {
                  "startAt": 0,
                  "restartLevel": 1,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 2,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 3,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 4,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 5,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 6,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 7,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 8,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              }
          ]
      },
      {
          "abstractListId": 2,
          "levels": [
              {
                  "listLevelPattern": "Bullet",
                  "followCharacter": "Tab",
                  "numberFormat": "",
                  "characterFormat": {
                      "fontFamily": "Symbol",
                      "fontFamilyBidi": "Symbol"
                  },
                  "paragraphFormat": {
                      "leftIndent": 36.0,
                      "firstLineIndent": -18.0
                  }
              },
              {
                  "startAt": 0,
                  "restartLevel": 1,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 2,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 3,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 4,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 5,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 6,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 7,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 8,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              }
          ]
      },
      {
          "abstractListId": 3,
          "levels": [
              {
                  "startAt": 1,
                  "restartLevel": 0,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab",
                  "numberFormat": "%1.",
                  "characterFormat": {
                      "fontColor": "#000000FF"
                  },
                  "paragraphFormat": {
                      "leftIndent": 17.0,
                      "firstLineIndent": -17.0,
                      "tabs": [
                          {
                              "tabJustification": "List",
                              "position": 17.0,
                              "tabLeader": "None",
                              "deletePosition": 0.0
                          }
                      ]
                  }
              },
              {
                  "startAt": 1,
                  "restartLevel": 1,
                  "listLevelPattern": "LowLetter",
                  "followCharacter": "Tab",
                  "numberFormat": "%2.",
                  "characterFormat": {
                      "fontColor": "#000000FF"
                  },
                  "paragraphFormat": {
                      "leftIndent": 72.0,
                      "firstLineIndent": -18.0,
                      "tabs": [
                          {
                              "tabJustification": "List",
                              "position": 72.0,
                              "tabLeader": "None",
                              "deletePosition": 0.0
                          }
                      ]
                  }
              },
              {
                  "startAt": 1,
                  "restartLevel": 2,
                  "listLevelPattern": "LowRoman",
                  "followCharacter": "Tab",
                  "numberFormat": "%3.",
                  "characterFormat": {
                      "fontColor": "#000000FF"
                  },
                  "paragraphFormat": {
                      "leftIndent": 108.0,
                      "firstLineIndent": -9.0,
                      "tabs": [
                          {
                              "tabJustification": "List",
                              "position": 108.0,
                              "tabLeader": "None",
                              "deletePosition": 0.0
                          }
                      ]
                  }
              },
              {
                  "startAt": 1,
                  "restartLevel": 3,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab",
                  "numberFormat": "%4.",
                  "characterFormat": {
                      "fontColor": "#000000FF"
                  },
                  "paragraphFormat": {
                      "leftIndent": 144.0,
                      "firstLineIndent": -18.0,
                      "tabs": [
                          {
                              "tabJustification": "List",
                              "position": 144.0,
                              "tabLeader": "None",
                              "deletePosition": 0.0
                          }
                      ]
                  }
              },
              {
                  "startAt": 1,
                  "restartLevel": 4,
                  "listLevelPattern": "LowLetter",
                  "followCharacter": "Tab",
                  "numberFormat": "%5.",
                  "characterFormat": {
                      "fontColor": "#000000FF"
                  },
                  "paragraphFormat": {
                      "leftIndent": 180.0,
                      "firstLineIndent": -18.0,
                      "tabs": [
                          {
                              "tabJustification": "List",
                              "position": 180.0,
                              "tabLeader": "None",
                              "deletePosition": 0.0
                          }
                      ]
                  }
              },
              {
                  "startAt": 1,
                  "restartLevel": 5,
                  "listLevelPattern": "LowRoman",
                  "followCharacter": "Tab",
                  "numberFormat": "%6.",
                  "characterFormat": {
                      "fontColor": "#000000FF"
                  },
                  "paragraphFormat": {
                      "leftIndent": 216.0,
                      "firstLineIndent": -9.0,
                      "tabs": [
                          {
                              "tabJustification": "List",
                              "position": 216.0,
                              "tabLeader": "None",
                              "deletePosition": 0.0
                          }
                      ]
                  }
              },
              {
                  "startAt": 1,
                  "restartLevel": 6,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab",
                  "numberFormat": "%7.",
                  "characterFormat": {
                      "fontColor": "#000000FF"
                  },
                  "paragraphFormat": {
                      "leftIndent": 252.0,
                      "firstLineIndent": -18.0,
                      "tabs": [
                          {
                              "tabJustification": "List",
                              "position": 252.0,
                              "tabLeader": "None",
                              "deletePosition": 0.0
                          }
                      ]
                  }
              },
              {
                  "startAt": 1,
                  "restartLevel": 7,
                  "listLevelPattern": "LowLetter",
                  "followCharacter": "Tab",
                  "numberFormat": "%8.",
                  "characterFormat": {
                      "fontColor": "#000000FF"
                  },
                  "paragraphFormat": {
                      "leftIndent": 288.0,
                      "firstLineIndent": -18.0,
                      "tabs": [
                          {
                              "tabJustification": "List",
                              "position": 288.0,
                              "tabLeader": "None",
                              "deletePosition": 0.0
                          }
                      ]
                  }
              },
              {
                  "startAt": 1,
                  "restartLevel": 8,
                  "listLevelPattern": "LowRoman",
                  "followCharacter": "Tab",
                  "numberFormat": "%9.",
                  "characterFormat": {
                      "fontColor": "#000000FF"
                  },
                  "paragraphFormat": {
                      "leftIndent": 324.0,
                      "firstLineIndent": -9.0,
                      "tabs": [
                          {
                              "tabJustification": "List",
                              "position": 324.0,
                              "tabLeader": "None",
                              "deletePosition": 0.0
                          }
                      ]
                  }
              }
          ]
      },
      {
          "abstractListId": 4,
          "levels": [
              {
                  "listLevelPattern": "Bullet",
                  "followCharacter": "Tab",
                  "numberFormat": "",
                  "characterFormat": {
                      "fontFamily": "Symbol",
                      "fontFamilyBidi": "Symbol"
                  },
                  "paragraphFormat": {
                      "leftIndent": 36.0,
                      "firstLineIndent": -18.0
                  }
              },
              {
                  "startAt": 0,
                  "restartLevel": 1,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 2,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 3,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 4,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 5,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 6,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 7,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              },
              {
                  "startAt": 0,
                  "restartLevel": 8,
                  "listLevelPattern": "Arabic",
                  "followCharacter": "Tab"
              }
          ]
      }
  ],
  "background": {
      "color": "#FFFFFFFF"
  },
  "styles": [
      {
          "type": "Paragraph",
          "name": "Normal",
          "next": "Normal",
          "characterFormat": {
              "fontSize": 10.0,
              "fontFamily": "Times New Roman",
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Times New Roman"
          }
      },
      {
          "type": "Paragraph",
          "name": "Heading 1",
          "basedOn": "Normal",
          "next": "Normal",
          "characterFormat": {
              "fontSize": 12.0,
              "fontSizeBidi": 12.0
          },
          "paragraphFormat": {
              "lineSpacing": 2.0,
              "lineSpacingType": "Multiple",
              "outlineLevel": "Level1"
          }
      },
      {
          "type": "Paragraph",
          "name": "Heading 2",
          "basedOn": "Normal",
          "next": "Normal",
          "characterFormat": {
              "fontSize": 13.0,
              "fontFamily": "Calibri Light",
              "fontColor": "#2F5496FF",
              "fontSizeBidi": 13.0,
              "fontFamilyBidi": "Calibri Light"
          },
          "paragraphFormat": {
              "beforeSpacing": 2.0,
              "lineSpacing": 1.0791666507720947,
              "lineSpacingType": "Multiple",
              "outlineLevel": "Level2"
          }
      },
      {
          "type": "Paragraph",
          "name": "Heading 3",
          "basedOn": "Normal",
          "next": "Normal",
          "characterFormat": {
              "fontSize": 12.0,
              "fontFamily": "Calibri Light",
              "fontColor": "#1F3763FF",
              "fontSizeBidi": 12.0,
              "fontFamilyBidi": "Calibri Light"
          },
          "paragraphFormat": {
              "beforeSpacing": 2.0,
              "lineSpacing": 1.0791666507720947,
              "lineSpacingType": "Multiple",
              "outlineLevel": "Level3"
          }
      },
      {
          "type": "Paragraph",
          "name": "Heading 4",
          "basedOn": "Normal",
          "next": "Normal",
          "characterFormat": {
              "italic": true,
              "fontFamily": "Calibri Light",
              "fontColor": "#2F5496FF",
              "italicBidi": true,
              "fontFamilyBidi": "Calibri Light"
          },
          "paragraphFormat": {
              "beforeSpacing": 2.0,
              "lineSpacing": 1.0791666507720947,
              "lineSpacingType": "Multiple",
              "outlineLevel": "Level4"
          }
      },
      {
          "type": "Paragraph",
          "name": "Heading 5",
          "basedOn": "Normal",
          "next": "Normal",
          "characterFormat": {
              "fontFamily": "Calibri Light",
              "fontColor": "#2F5496FF",
              "fontFamilyBidi": "Calibri Light"
          },
          "paragraphFormat": {
              "beforeSpacing": 2.0,
              "lineSpacing": 1.0791666507720947,
              "lineSpacingType": "Multiple",
              "outlineLevel": "Level5"
          }
      },
      {
          "type": "Paragraph",
          "name": "Heading 6",
          "basedOn": "Normal",
          "next": "Normal",
          "characterFormat": {
              "fontFamily": "Calibri Light",
              "fontColor": "#1F3763FF",
              "fontFamilyBidi": "Calibri Light"
          },
          "paragraphFormat": {
              "beforeSpacing": 2.0,
              "lineSpacing": 1.0791666507720947,
              "lineSpacingType": "Multiple",
              "outlineLevel": "Level6"
          }
      },
      {
          "type": "Character",
          "name": "Default Paragraph Font"
      },
      {
          "type": "Paragraph",
          "name": "Message Header",
          "basedOn": "Body Text",
          "next": "Message Header",
          "characterFormat": {
              "fontFamily": "Arial",
              "fontFamilyBidi": "Arial"
          },
          "paragraphFormat": {
              "leftIndent": 42.54999923706055,
              "firstLineIndent": -42.54999923706055,
              "lineSpacing": 9.0,
              "lineSpacingType": "AtLeast"
          }
      },
      {
          "type": "Paragraph",
          "name": "Body Text",
          "basedOn": "Normal",
          "next": "Body Text",
          "paragraphFormat": {
              "afterSpacing": 6.0
          }
      },
      {
          "type": "Character",
          "name": "Tekst podstawowy Znak",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 10.0,
              "fontFamily": "Times New Roman",
              "fontColor": "#000000FF",
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Times New Roman"
          }
      },
      {
          "type": "Character",
          "name": "Nagłówek wiadomości Znak",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 10.0,
              "fontFamily": "Arial",
              "fontColor": "#000000FF",
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Arial"
          }
      },
      {
          "type": "Paragraph",
          "name": "Body Text Indent",
          "basedOn": "Normal",
          "next": "Body Text Indent",
          "paragraphFormat": {
              "leftIndent": 14.149999618530273,
              "afterSpacing": 6.0
          }
      },
      {
          "type": "Character",
          "name": "Tekst podstawowy wcięty Znak",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 10.0,
              "fontFamily": "Times New Roman",
              "fontColor": "#000000FF",
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Times New Roman"
          }
      },
      {
          "type": "Character",
          "name": "Nagłówek 1 Znak",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 12.0,
              "fontFamily": "Times New Roman",
              "fontColor": "#000000FF",
              "fontSizeBidi": 12.0,
              "fontFamilyBidi": "Times New Roman"
          }
      },
      {
          "type": "Paragraph",
          "name": "Footnote Text",
          "basedOn": "Normal",
          "next": "Footnote Text"
      },
      {
          "type": "Character",
          "name": "Tekst przypisu dolnego Znak",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 10.0,
              "fontFamily": "Times New Roman",
              "fontColor": "#000000FF",
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Times New Roman"
          }
      },
      {
          "type": "Character",
          "name": "Footnote Reference",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "baselineAlignment": "Superscript",
              "fontSize": 10.0,
              "fontFamily": "Calibri",
              "fontColor": "#000000FF",
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Calibri"
          }
      },
      {
          "type": "Paragraph",
          "name": "Body Text Indent 3",
          "basedOn": "Normal",
          "next": "Body Text Indent 3",
          "characterFormat": {
              "fontSize": 8.0,
              "fontSizeBidi": 8.0
          },
          "paragraphFormat": {
              "leftIndent": 14.149999618530273,
              "afterSpacing": 6.0
          }
      },
      {
          "type": "Character",
          "name": "Tekst podstawowy wcięty 3 Znak",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 8.0,
              "fontFamily": "Times New Roman",
              "fontColor": "#000000FF",
              "fontSizeBidi": 8.0,
              "fontFamilyBidi": "Times New Roman"
          }
      },
      {
          "type": "Character",
          "name": "Comment Reference1",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 8.0,
              "fontFamily": "Calibri",
              "fontColor": "#000000FF",
              "fontSizeBidi": 8.0,
              "fontFamilyBidi": "Calibri"
          }
      },
      {
          "type": "Paragraph",
          "name": "Comment Text1",
          "basedOn": "Normal",
          "next": "Comment Text1"
      },
      {
          "type": "Character",
          "name": "Tekst komentarza Znak",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 10.0,
              "fontFamily": "Times New Roman",
              "fontColor": "#000000FF",
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Times New Roman"
          }
      },
      {
          "type": "Paragraph",
          "name": "Comment Subject1",
          "basedOn": "Comment Text1",
          "next": "Comment Text1",
          "characterFormat": {
              "bold": true,
              "boldBidi": true
          }
      },
      {
          "type": "Character",
          "name": "Temat komentarza Znak",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "bold": true,
              "fontSize": 10.0,
              "fontFamily": "Times New Roman",
              "fontColor": "#000000FF",
              "boldBidi": true,
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Times New Roman"
          }
      },
      {
          "type": "Paragraph",
          "name": "Balloon Text",
          "basedOn": "Normal",
          "next": "Balloon Text",
          "characterFormat": {
              "fontSize": 8.0,
              "fontFamily": "Tahoma",
              "fontSizeBidi": 8.0,
              "fontFamilyBidi": "Tahoma"
          }
      },
      {
          "type": "Character",
          "name": "Tekst dymka Znak",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 8.0,
              "fontFamily": "Tahoma",
              "fontColor": "#000000FF",
              "fontSizeBidi": 8.0,
              "fontFamilyBidi": "Tahoma"
          }
      },
      {
          "type": "Paragraph",
          "name": "Body Text Indent 2",
          "basedOn": "Normal",
          "next": "Body Text Indent 2",
          "paragraphFormat": {
              "leftIndent": 14.149999618530273,
              "afterSpacing": 6.0,
              "lineSpacing": 2.0,
              "lineSpacingType": "Multiple"
          }
      },
      {
          "type": "Character",
          "name": "Tekst podstawowy wcięty 2 Znak",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 10.0,
              "fontFamily": "Times New Roman",
              "fontColor": "#000000FF",
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Times New Roman"
          }
      },
      {
          "type": "Paragraph",
          "name": "Endnote Text",
          "basedOn": "Normal",
          "next": "Endnote Text"
      },
      {
          "type": "Character",
          "name": "Tekst przypisu końcowego Znak",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 10.0,
              "fontFamily": "Times New Roman",
              "fontColor": "#000000FF",
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Times New Roman"
          }
      },
      {
          "type": "Character",
          "name": "Endnote Reference",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "baselineAlignment": "Superscript",
              "fontSize": 10.0,
              "fontFamily": "Calibri",
              "fontColor": "#000000FF",
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Calibri"
          }
      },
      {
          "type": "Paragraph",
          "name": "List Paragraph",
          "basedOn": "Normal",
          "next": "List Paragraph",
          "characterFormat": {
              "fontSize": 12.0,
              "fontSizeBidi": 12.0
          },
          "paragraphFormat": {
              "leftIndent": 36.0,
              "contextualSpacing": true
          }
      },
      {
          "type": "Character",
          "name": "Heading 2 Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 13.0,
              "fontFamily": "Calibri Light",
              "fontColor": "#2F5496FF",
              "fontSizeBidi": 13.0,
              "fontFamilyBidi": "Calibri Light"
          }
      },
      {
          "type": "Character",
          "name": "Heading 3 Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 12.0,
              "fontFamily": "Calibri Light",
              "fontColor": "#1F3763FF",
              "fontSizeBidi": 12.0,
              "fontFamilyBidi": "Calibri Light"
          }
      },
      {
          "type": "Character",
          "name": "Heading 4 Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "italic": true,
              "fontSize": 10.0,
              "fontFamily": "Calibri Light",
              "fontColor": "#2F5496FF",
              "italicBidi": true,
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Calibri Light"
          }
      },
      {
          "type": "Character",
          "name": "Heading 5 Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 10.0,
              "fontFamily": "Calibri Light",
              "fontColor": "#2F5496FF",
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Calibri Light"
          }
      },
      {
          "type": "Character",
          "name": "Heading 6 Char",
          "basedOn": "Default Paragraph Font",
          "characterFormat": {
              "fontSize": 10.0,
              "fontFamily": "Calibri Light",
              "fontColor": "#1F3763FF",
              "fontSizeBidi": 10.0,
              "fontFamilyBidi": "Calibri Light"
          }
      }
  ],
  "defaultTabWidth": 35.400001525878906,
  "formatting": false,
  "trackChanges": false,
  "protectionType": "NoProtection",
  "enforcement": false,
  "dontUseHTMLParagraphAutoSpacing": false,
  "alignTablesRowByRow": false,
  "formFieldShading": true,
  "footnotes": {
      "separator": [
          {
              "inlines": [
                  {
                      "text": "\\u0003"
                  }
              ]
          }
      ],
      "continuationSeparator": [
          {
              "inlines": [
                  {
                      "text": "\\u0004"
                  }
              ]
          }
      ],
      "continuationNotice": [
          {
              "inlines": []
          }
      ]
  },
  "endnotes": {
      "separator": [
          {
              "inlines": [
                  {
                      "text": "\\u0003"
                  }
              ]
          }
      ],
      "continuationSeparator": [
          {
              "inlines": [
                  {
                      "text": "\\u0004"
                  }
              ]
          }
      ],
      "continuationNotice": [
          {
              "inlines": []
          }
      ]
  },
  "compatibilityMode": "Word2013"
}

describe('Table Footnotes validation', () => {
  let editor: DocumentEditor;
  let documentHelper: DocumentHelper;
  beforeAll((): void => {
    document.body.appendChild(createElement('div', { id: 'container' }));
    DocumentEditor.Inject(Editor, Selection, WordExport, SfdtExport, EditorHistory);
    editor = new DocumentEditor({ enableEditorHistory: true, enableWordExport: true, enableEditor: true, isReadOnly: false, enableSelection: true, enableSfdtExport: true });
    editor.acceptTab = true;
    (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
    (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
    (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
    (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
    editor.appendTo('#container');
    documentHelper = editor.documentHelper;
  });
  afterAll((done): void => {
    editor.destroy();
    document.body.removeChild(document.getElementById('container'));
    editor = undefined;
    setTimeout(function () {
      document.body.innerHTML = '';
      done();
    }, 1000);
  });

  it('Table Footnotes validation', () => {
    editor.open(tableFootNotes);
    let table: TableWidget = documentHelper.pages[0].bodyWidgets[0].lastChild as TableWidget;
    editor.selection.select('0;12;0;0;3;51', '0;12;0;0;3;51');
    editor.editor.onEnter();
  });
});