/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';

let documenteditor: DocumentEditor = new DocumentEditor({    
});
documenteditor.appendTo('#container');
function getJson() {
    let wordDocument: any = {
        "sections": [
            {
                "blocks": [
                    {
                        "characterFormat": {
                            "bold": false,
                            "italic": false,
                            "strikethrough": "None",
                            "baselineAlignment": "Normal",
                            "fontSize": 11,
                            "fontFamily": "Calibri"
                        },
                        "paragraphFormat": {
                            "leftIndent": 0,
                            "rightIndent": 0,
                            "firstLineIndent": 0,
                            "beforeSpacing": 0,
                            "afterSpacing": 8,
                            "lineSpacing": 1.0791666507720947,
                            "lineSpacingType": "Multiple",
                            "textAlignment": "Left"
                        },
                        "inlines": [
                            {
                                "text": "Adventure",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 11,
                                    "fontFamily": "Calibri"
                                }
                            },
                            {
                                "text": "\t",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 11,
                                    "fontFamily": "Calibri"
                                }
                            },
                            {
                                "text": "works cycles",
                                "characterFormat": {
                                    "bold": false,
                                    "italic": false,
                                    "strikethrough": "None",
                                    "baselineAlignment": "Normal",
                                    "fontSize": 11,
                                    "fontFamily": "Calibri"
                                }
                            }
                        ]
                    }
                ],
                "headersFooters": {},
                "sectionFormat": {
                    "headerDistance": 36,
                    "footerDistance": 36,
                    "pageWidth": 612,
                    "pageHeight": 792,
                    "leftMargin": 72,
                    "rightMargin": 72,
                    "topMargin": 72,
                    "bottomMargin": 72,
                    "differentFirstPage": false,
                    "differentOddAndEvenPages": false
                }
            }
        ],
        "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "baselineAlignment": "Normal",
            "fontSize": 11,
            "fontFamily": "Calibri"
        }
    };
    return JSON.stringify(wordDocument);
}
documenteditor.open(getJson());