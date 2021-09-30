import { DocumentEditor } from '../../src/document-editor/document-editor';
import { DocumentHelper } from '../../src/document-editor/implementation/viewer/viewer';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { Editor } from '../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { Selection } from '../../src/document-editor/implementation/selection/selection';
import { WordExport } from '../../src/document-editor/implementation/writer/word-export';
import { SfdtExport } from '../../src/document-editor/implementation/writer/sfdt-export';

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
                    "imageString": "data:image/png;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAC0BNkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiikzQAtFJuHrS0AFFFFABRRSbh60ALRRRQAUUUm4etAC0UmaWgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCC6YpbysDghSQffFflb/wANo/Gb/odJP/Bdaf8Axqv1RvB/os/+438q/EGuDFSlG3K7H6nwRg8Ni/rH1imp25d0n37ntv8Aw2j8Zv8AodJP/Bfaf/GqP+G0PjN/0Okn/gvtP/jVfVXwn/Y4+Fnir4YeEta1HRbiXUNQ0m1uriRdQnUNJJCjOcB8DJJOBwK6z/hhf4P/APQBuf8AwZT/APxdSqVf+Y9KpnvDlObg8Jt/ciT/ALLXxL8R/EL4Dy+IvEOonUtYWa6H2gwxx8J90bUVV4+lfDWp/thfF/VWJl8ZXEKnottawRY9gVTP5nNfpL4b+Gug/Cj4d3+heG7V7TTVjnlEbzPIdzKSTuYk1+OtKu5QUVcXC1DA5hicXW9inG6cU0tE7/cepQ/tRfFaGQSL451Qtn+J1YfkQR+lep/DP/goB458OahDH4tjt/FOmFsSuIlt7pB6qUAQ4HOCvP8AeHWvqD4c/sy/DDxB8L/DM9/4N06a4vNLtpZ5wrLI7tEpZt4IYEknoa+Hf2rPg7p3wT+K0mi6PLI+lXdnHf28czbmhVndPLLdWAaMkE84IBJxkzKNaiubmud+DxWRZ5Xlgfq3LLWzslt2a1P1A8B+ONI+I/hXT/EWhXQu9NvU3xv0IIOGVh2YEEEdiDWD8Y/jX4b+CPhk6tr9w2+UlLWxhAaa5cDlUUkdO5JAGevIr5o/4Ju+JbmTw/450eaQ/YrGa3vItx4VpVkV+fT9yv618t/tC/Fy7+MnxO1XWpJmbTY5GttNhydsdupIUgerfePu2OgGN5Yi1NT6s+RwfC3t83q4OT/d0931s9Uj0j4hft5fEjxVeSroc1v4U04khIrWNZpivbfJIpyfdQtedL+018VEm80eOdYL/wC1Plf++SMfpXtH7Kv7Gtp8UPD8Xi/xjNcRaNO7Cy0+3by3uVUlS7t1CEggAYJxnOMZ+oG/Yt+DrWwh/wCEPUDH3hfXO78/MzWSp1qi5nK1z6XEZtw9lNR4SOH5uXRtRT/F7nzD+zv+1t8WPFHxI0Dwtc3Vr4lg1C5WKT7ZbrHJDEAWkcPGF5VQzfMDnGO4r9DOgyeK8a+Ff7Kngn4PeNrnxLoC3q3M1sbaO3up/NjgUsCxTI3ZO0DknjpjJrA/ba+Ll18MPhK9ppkzW+sa9KbKGaNsPFHtJldffbhQRyC4I6V1Q5qUG5u9j4bMXhc6zGnSyynyKVltbXq7LscR+0F+3dZeCdSuvD/ga2t9Z1SBjHcalOSbWFwcFUCkGRhzk5CjH8XIHynrn7WHxZ1+6M0/jS+g5ysdmqW6AdgAijIHvk+pNcJ8P/A+pfEnxnpPhrSEV7/UZvKQt91Bglnb/ZVQzHHOAcZPFfpR4C/Yr+GPg/RYba+0OPxFf7AJ77UizGRu5VM7UHoAM9Mk9a5IurX1Tsj73ERyPhenClVpe0qNdk3667Hxd4L/AG2Pir4Ruo2uNcXxBZqRutdUhVww74dQr5x0+YjPY191fs+/tLeHfj3psi2inSvEFqm660qZwzKuceZG2BvTJAzgEEjIGRnwf9qX9i3QdI8H3/i3wHaPp1xp0ZuLvSlkaSKWFeXeMMSVZRzgHBAxjPX44+HfjzU/hn400rxJpMpS8sJhJtyQJU6NG3+yykr+PrihVKlGSU3dE1MsyribBSxGXw5Kkflr2aWmvc/aHNFZnhnXrXxT4e0zWLF/Ms9Qto7qFvVHUMp/I1p/WvTPxSUXFuMt0OooooEFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAEF9/x6T/AO438jX4gV+397/x6T/7jfyNfiBXnYz7J+v+H/8AzE/9u/qdXY/FrxxptnBaWfjPxBaWkCLFFBBqk6JGigBVVQ4AAHYDAwAK0NN+M3j99StFbxz4lZTMoIbV7g5BIyD89foz8B/hv4C8Q/BjwRfy+GNBv55dHtfOuHsIHZ5ViVZNzbeW3hs55zmu9T4P+AUZWXwd4fVlOQw02DIP/fNUsPLRqRGI4qwMJzpPBq6bV9P8jode/wCRb1D/AK9ZP/QDX4m1+2fiEj/hHdSwf+XaT/0E1+JlRi94mvAPw4m/939T7q8K/wDBQTwt4T8A6LpMfhrWL3UdPsILUhzFHE7pGqn5wzEAkH+H8K+S/jB8VtV+NHju88S6rGkMswWGC1iJKwRLnagJ5PJJJPUsTgAgD1vxX+xPr+jfCOz8caPrEevCSxi1C401bUxSxRPGHYod7CQqD0wpIBxk8V4h8P8Axrc/DvxhpniG0tLO+uLGUSrBfQiWJiPY8gjqGByCBWNSVR2jU0R9RlGDyqn7XF5Wueeq1b37a7fcfbvwF+FOq/Bn9ln4ga/qUL2Ov6xpNzeiBgVkgijt38lWHUNku2Oo3AEAgivgCv178F+M9H/aG+Dkl9Yny7TWLKWzuIGO57eQoUkjb3BJ+oIPQivyR1rR7rw/rF9pd9EYL2yne2njP8MiMVYfmDWmIioxjbY8vhTFVMTica8SrVW1dferfI/YL4N2MGm/CPwda23EMWj2irjv+5Xn8a+Dfid+2N8V/DvxJ8WaTp/iOOGwsNWu7W3jNhbttjSZ1UZKEnAA5JJOOa+ov2MfjFpvxD+Eul6K9yia/oMC2VzaMwDNEgCxSrk5KlQoJ/vAj0Jv/EL9lP4V6hZ+I9en8LpJq1wtxeyXH224G6Zgzl8eZgZYk4AA7dK6pc1SCdN2PhMDUwuV5lWp5pR57tpKyet99e58U/8ADcHxj/6GeL/wXW3/AMbr1L/gpFfSza94DgZsxJZ3Eo9NzNHk/wDjor41r72/4KKeC59S8D+EfE8EbNHpkr2lwVGcLMqlWPoA0ePq49a4oylOnO7vY/Q8Zh8Fl+b4GVGmoKXOtEl0VvzPKP8AgnjYwXfxzvppQrSWuizyxZ6hjNCpI/Bj+dfpKBmvyS/Zh+KkHwf+MWka3fMV0mYNZXzKCSsUmPm+isEY4GSFIAziv1j0/ULbVLKC8s547i1nRZIpoXDI6kZDAjggjnIrrwsk4WXQ+F43w9WGZKtJe7JK3y6f13H3lvFeWc0EyCSGRGR0YZDKQQQfbFfiZqlslnqd3bxtvjhmeNW65AYgH8hX62ftDfGCw+Dfw11PV5rlF1OaJoNNtyRuluGUhcDuF+83oAfavyOt7eW8uI4IUaaeZgiRoCWZicAADkkkgY96xxb1S6n0PAdGpTpYivPSDtb5Xv8AmfrH+yXdyXv7O/giSbO9bIxjP91XZV/RRXrnauP+EPg9vAPwx8M+HpNpn0/T4YZivQyBRvI9i2fzrsa743UUmflGOqRq4qrUhs5Nr7wpaKKs4gooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAjcbkZe5Ffjj8Xvhnqnwl8e6p4f1O1lgWGZjazOp23EBY7JEPQgjGcHg5BwQQP2QrL17wxpHii0+y6xpdnqtvnPk3tuky59cMDXPWpKrbofVcP57LI6sp8nNGS1XpsfjTo/jXxD4ftjbaVr2p6ZbsxYxWd5JEhJ6khWAz71e/4Wp40/wChv17/AMGU/wD8VX6w/wDChvht/wBCD4Z/8FFv/wDEUf8AChfht/0IPhn/AMFFv/8AEVz/AFV/zH2suNsHJtywt2/T/I8B/Yb8Rar4k+CvjSbVtSvNUmS+mRZby4aZlX7PGcAsTxkk4HGSa/PSv2o8PeCfD/hGxmstD0TT9Is52Ly29jaxwxyMQASyqACcADJ7CsD/AIUP8Nuv/CA+Gf8AwUW//wARWk8O5RSvseNl/FVHA4nEV1RuqrWl7WsWvhCob4S+D1YZB0e0GD/1wSvzT/a1+E8Xwl+MWo2ljD5Ojakv9o2KKMLGrkhox2wrqwA7Lt9a/VWzs4NPtILW1hjtraFFjjhiUKiIBgKAOAAOMD0rF8T/AA98MeNpIJNf8O6XrcluCsTahZxzmMEgkKXU4BwOnpWtWl7SNjw8lzyWU4yeI5bxle6/L7j4X/4J4/Ex9F8d6n4KuZsWesxG6tUY9LiMfMAPVo8kn/pkK7v9sj9ku/8AF2p3HjrwXafatRkXOpaVFgPPtGBNGO74ABUctgEc5B+n9H+D/gXw9qUGoaZ4O0HT7+Bt8V1a6bDFKhwRlWVQQcE9D3rsOMVKo+5yTdzoxHEUlmn9pYKPI2tU9U/60PxOsr7V/B+tCa0uL3RdWtHK+ZC7wTwt0I4IYHqCOK7PU/2i/iZrGmvYXfjbWJLV02Mi3BQsuOQWXBPBIOTyDzX6p+LPhX4P8eMH8QeGtL1eVRtEt1aI8ij0DEZH4GuWtf2W/hTZzeangbSWbPSWHzF/75YkVz/Vpx0jLQ+t/wBc8vxCU8VhbzXo/wAWflT4T8G65461aPTfD+lXWr3zkDybWMvtBOMseigd2JAHciv2K8WeDdO8d+DL7w7rVv8AaNPvrbyJ4+/Tgg9mBwQexANXdD8N6V4ZsVs9I0yz0u0XlYbOBYkH0CgCtPpXRRoqmmr3ufIZ7xFPOKtOcIcns72116f5H5K/Hb9m/wAUfA/WpxeW0l/4eeQi11iFCYnUnhZOvlv7HgnOCRXNeDvjV46+H9ibPw/4p1LTbLki2jmzEuTklUbKqSeTgAmv2JurWG8gkhniSaKQbWjdQVYHqCDXmuq/sx/CzWrgz3PgfSRITkm3g8kE+pCYzWMsNZ3g7H0uF40pVKKpZlQ57ddNfkz8p/EXirxD8QNYS61rU7/XtRkPlxtcytM/J4VBk4GTwoAGTwK+xf2Pv2QtR07WrLx144smsmtSJtM0mdcSeZ/DNKD93b/Cp5zyQMAH6y8I/B3wV4CmE3h/wvpel3GNv2i3tUEuPQvjcR+NdBrGuWHh6zFxqFwtvDu2gkFix64VQCScAnAHQH0q6eHUXzSd2cGbcXyxWHeEwNP2cH99uytsaXSlqpp+oW+qWqXVrKs0D5wy56g4II6ggggg8ggg1brsPzkKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCvdwSXNrLFHcSWrupVZoQpdCejDcCuR7gj1FfEPxg+PPxV+H/7RVp8OtN8Xxz6dfXVlDBdXWmWzTRrcFVO7agVipY9AAQBwK+5q/N/9rDV7Pw7+2xoOq6hN9n0+xn0m6uJtpby40kVmbCgk4AJwASccAmgD9EtJsZ9PsYoLnUbjVJlzuurpI1kfJzyI0RRjpwo6fjXi37WXivxd8LfhrqHjPwv4lmspbOe3R9PuLS3mgZHdYztJj3hssDksR1GBkVN/w218Ff8Aodk/8Ft5/wDGa8d/az/ae+GXxJ+BeveH/DniddS1e5ltmhthZXEe4LPGzHc8YUYVSeSM4wOaAPUP2QPHPjD4ufD5vFvinxFJdySXk1rFY29pbwwKqhQGYhN5bJJGGAxjg15P+2F8aPiZ8AfGGiWvh7xvc3On6nZtOY9Q06yd43V9pwywLlSCvUEg55OQB6P/AME+v+TdbT/sJXX/AKEK8Q/4Kaf8jh4I/wCvC4/9GLQB9Ar8OfjlfaJDeWXxttGuZ4FlSGbwpaomWUEAuGbA99p+navQ/hfq2t6b8H9L1PxzdO+tW9nJc6pcSRKhBUszHaqqAAo4wBwBXB6P+2R8HNP0Gwjn8awLJDbRq6LZ3LEEKARgRHJzXq9nc6d8T/h/FcRiYaR4g00OvmLsk8ieLIyOx2v0oA+dvg/4n8aftbDXvEr+MNS8C+DrO+bT7DSvDwiS7cqiuXlndWOdrpwBgknAGMnWk8PfFL4T+NNVtrXxhq3jnQbvw3qN1plrfxRyXUd/EIxGjMF+bJkGCMA/MCvAJ+Wvh38TfGH7DvxU1fwvrli+o6FNMGubUfKJ4wSEurdj3K9jwcFWwVBX9Ffh38RvD/xU8LWviDw3fpf6dPxkcPE4xmN16qwyMg/XkEGgDxnw/wDCr9oSHToF1D402EM+wB418P29ztOORvZVLY9SOa8R8P8Axm+Nmu/tHS/CgfEe3hkju7m0/tY6DasCYYpJN3lbQefLxjdxnOTjB++6/Oz4ff8AKSW6/wCwxqn/AKST0Ae5fETwL+0ZofhXUdQ0n4sWesy2kLTmzj0CC2mmVQSVQhHyxA4HGTgZFcf+2d8YviR8BvE2gDw140uTY6xBNI1teafZSeSyOvCMIASuHAwxJ4JJOePtGvgf/gp1/wAhn4fH/phe/wDoUNAH2Z8M7bVY/BulXGta5da/qN3awzzXFzDBEFdowWCLFGgC5JxncenNdZWN4L/5E7Qv+vCD/wBFrXDftLfE3/hUvwa8Q65BJs1N4vsen7fvG5l+VCvqVyX+iGgDxz4a/tVS+LP2vPEvhKS93+FrlG07SkyNgubfJZwf+mhE3PcCMc4FfRvjTwrL4kW1eGTbJCdrR+c8O9PNikIEiAsjboUwwB43DjII/Pb4+fBC9/Zy8M/CLxnpKfZtYtY411KUDpqCsblC394ndInP8MKiv0R8A+MLP4geC9E8Saec2mp2kdyi5yU3AEqfdTlT7g0AL4O8Ov4Z0dbaSVZJmKl/LGEG2NI1A+ixrk8ZOTgZwN+iigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvzr/aZw37d3hMEZH27RgQeRjzU4NfofNIIYXkKs+1S21BljjnAHc18B/HL4Z/Ejxt+0xB490XwHq9xothdWMsPm+VFLKsHlsxCs+RllYDPbBOM4AB99fYbf/nhH/3wK8C/bqt4Yv2Z/E7LEit51mAwUA/8fUVe4aDrX9u2ZuPsN7p5DbTDfwmJ+gPTJyOeoPUGvEv2ytH8Q+OvhPeeEfDHh3Udb1K+nt5Ge3RVhjjSTeSXZgM5QDA55FAGZ/wT6/5N1tP+wldf+hCvD/8Agpr/AMjh4I/68Lj/ANGLXtv7Fuj+Jvhn8OT4S8V+FtW0m+GoyzRTtEskDRuqkEujHaQQ2cgDpgnPHmf7aXwj+Ivxw8caPceGPBV/Npul2b27XFxcW0XmSNISSqmXJXAXBIBJJ445APsHTtB03WvB9lZX1hbXlpPZRxywzxKyOpQAggjkYqXSbLT/AAB4O0+xe68nTNJs4bRZ7ggfIiqiliO+AOnevD/D/wAZ/i7ovhvT7LUPgbqV1qFtbpDJLb6zbiOVlUAsBglQcZxzjPU1oTeGviH8Rv2d/GUOr2I0fxp4gkuJ7bS5LkEWihlWGEOCQDsjU545bJxk0Ad18Z/gd4X+OXhk6X4gtP38YY2eowgC4tHP8SN3BwMqeDgZHAI+L/2S18RfAn9rLUPhlfzmW3vhPbXCIT5Uhjga4hnUHoSi8dwJCD04+j/DHxy+KNlocFl4k+DOvXPiOGMRyTadc25tLhwMb95bCAnkgbgM8EiqvwV+BPiR/i/rnxf+IcdrZeJ9RUxWOi2cglSwj2LGC8g4ZxGoT5SRgsScnCgH0dX51/D1h/w8kuj/ANRjUx/5KTiv0J1O8fT7OW4S1nvWjGRb2wUyPz0XcQPzI6V8H+FfhD8UtF/awf4n3Hw/1D+xJdYu7owpd2hnWCZZIwdvnYLBXBIz1BANAH33XwP/AMFOf+Qz8Ph/073v/oUNfdml3z6jYx3D2k9iz5zBdBRIuCRztJHOM8E9RXxn+2v8J/iF8cfFWgf8It4Lv57HSLeaJ7m4uLWISO7gnYGlyRhByQM56cUAfX/gv/kT9C/68IP/AEWtfL37RSa38cP2h/Cnw38MXVpAPC8I8Q6hLfRmW3ScFTEsiAjdgFABnkTnPSvbPDPjXXtI8B6XDceAPEDava2EUUlkj2mGmSMKVEnn7dpI+8e3OM8V5n+yp4L8ZeHfGXj3xH4+8L3mmeIvE16JxdedBNBHAAzCMMkhZQC23GOQq+nABn/G74K/Gb4mfDfVtI1nxP4Y1W3RPtcdraaVJHM8sQLKqPuIVmwVyQRhjXO/8E4fij/a/g/WvAt5Lm50iX7dZKx5NvIcSKB6LIcn3lFfZlfBFv8AA/4n/B39qLU/GXgrwZdan4WN/K4hS6tohPbTYMsaqZQQAWO3IHKKSOooA+96KzND1WXWbFbiXTbzSnJx9mvhGJBwDk7GYd8dexrToAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//2Q==",
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