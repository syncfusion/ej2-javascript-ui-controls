import { TextExport, DocumentHelper } from '../../src/index';
import { createElement, } from '@syncfusion/ej2-base';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { SfdtExport } from '../../src/document-editor/implementation/writer/sfdt-export';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TestHelper } from '../test-helper.spec';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { Layout } from '../../src/document-editor/implementation/viewer/layout';
let json: object =
{
    "sections": [
        {
            "blocks": [
                {
                    "rows": [
                        {
                            "rowFormat": {
                                "allowBreakAcrossPages": true,
                                "isHeader": false,
                                "height": 67.3499984741211,
                                "heightType": "AtLeast",
                                "borders": {
                                    "left": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "right": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "top": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "bottom": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "vertical": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "horizontal": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalDown": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalUp": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    }
                                }
                            },
                            "gridBeforeWidth": 0,
                            "gridAfterWidth": 0,
                            "gridBefore": 0,
                            "gridAfter": 0,
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "imageString": "data:image/jpeg;base64,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",
                                                    "length": 1,
                                                    "width": 57.931419372558594,
                                                    "height": 47.34779357910156,
                                                    "isInlineImage": true,
                                                    "isMetaFile": false
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "cellWidth": 216.5,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 216.5,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            }
                                        }
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "imageString": "data:image/png;base64,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",
                                                    "length": 1,
                                                    "width": 101.69015502929688,
                                                    "height": 51.652122497558594,
                                                    "isInlineImage": true,
                                                    "isMetaFile": false
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "cellWidth": 216.5,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 216.5,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            }
                                        }
                                    },
                                    "columnIndex": 0
                                }
                            ]
                        },
                        {
                            "rowFormat": {
                                "allowBreakAcrossPages": true,
                                "isHeader": false,
                                "height": 65.3499984741211,
                                "heightType": "AtLeast",
                                "borders": {
                                    "left": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "right": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "top": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "bottom": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "vertical": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "horizontal": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalDown": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    },
                                    "diagonalUp": {
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0,
                                        "hasNoneStyle": false
                                    }
                                }
                            },
                            "gridBeforeWidth": 0,
                            "gridAfterWidth": 0,
                            "gridBefore": 0,
                            "gridAfter": 0,
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "characterFormat": {
                                                "bold": true
                                            },
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "text": "Hai ",
                                                    "characterFormat": {
                                                        "bold": true
                                                    }
                                                },
                                                {
                                                    "text": "Java",
                                                    "characterFormat": {
                                                        "bold": true
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            "characterFormat": {
                                                "bold": true,
                                                "italic": true,
                                                "underline": "Single"
                                            },
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "text": "Oops concepts",
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "italic": true,
                                                        "underline": "Single"
                                                    }
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "cellWidth": 216.5,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 216.5,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            }
                                        }
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "characterFormat": {
                                                "italic": true
                                            },
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "text": "H",
                                                    "characterFormat": {
                                                        "italic": true
                                                    }
                                                },
                                                {
                                                    "text": "ello",
                                                    "characterFormat": {
                                                        "italic": true
                                                    }
                                                },
                                                {
                                                    "text": " ",
                                                    "characterFormat": {
                                                        "italic": true
                                                    }
                                                },
                                                {
                                                    "text": "JavaScript",
                                                    "characterFormat": {
                                                        "italic": true
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "hasFieldEnd": true,
                                                    "fieldType": 0
                                                },
                                                {
                                                    "text": "HYPERLINK \"http://www.w3schools.com\" "
                                                },
                                                {
                                                    "fieldType": 2
                                                },
                                                {
                                                    "text": "www.w3schools.com",
                                                    "characterFormat": {
                                                        "styleName": "Hyperlink"
                                                    }
                                                },
                                                {
                                                    "fieldType": 1
                                                }
                                            ]
                                        },
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "cellWidth": 216.5,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 216.5,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "borders": {
                                            "left": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0,
                                                "hasNoneStyle": false
                                            }
                                        }
                                    },
                                    "columnIndex": 0
                                }
                            ]
                        }
                    ],
                    "title": null,
                    "description": null,
                    "tableFormat": {
                        "allowAutoFit": true,
                        "leftIndent": 0,
                        "tableAlignment": "Left",
                        "preferredWidth": 433,
                        "preferredWidthType": "Point",
                        "borders": {
                            "left": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0,
                                "hasNoneStyle": false
                            },
                            "right": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0,
                                "hasNoneStyle": false
                            },
                            "top": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0,
                                "hasNoneStyle": false
                            },
                            "bottom": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0,
                                "hasNoneStyle": false
                            },
                            "vertical": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0,
                                "hasNoneStyle": false
                            },
                            "horizontal": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0,
                                "hasNoneStyle": false
                            },
                            "diagonalDown": {
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0,
                                "hasNoneStyle": false
                            },
                            "diagonalUp": {
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0,
                                "hasNoneStyle": false
                            }
                        }
                    }
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Typescript is a typed superset of JavaScript."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Link "
                        },
                        {
                            "hasFieldEnd": true,
                            "fieldType": 0
                        },
                        {
                            "text": "HYPERLINK \"http://www.google.com\" "
                        },
                        {
                            "fieldType": 2
                        },
                        {
                            "text": "Google",
                            "characterFormat": {
                                "styleName": "Hyperlink"
                            }
                        },
                        {
                            "fieldType": 1
                        },
                        {
                            "text": " "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "hasFieldEnd": true,
                            "fieldType": 0
                        },
                        {
                            "text": "HYPERLINK \"http://www.bing.com\" "
                        },
                        {
                            "fieldType": 2
                        },
                        {
                            "text": "www.bing.com",
                            "characterFormat": {
                                "styleName": "Hyperlink"
                            }
                        },
                        {
                            "fieldType": 1
                        },
                        {
                            "text": " "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Hello world"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Justify",
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Java",
                            "characterFormat": {
                                "bold": true
                            }
                        },
                        {
                            "text": " is "
                        },
                        {
                            "text": "a"
                        },
                        {
                            "text": " "
                        },
                        {
                            "text": "object oriented programming language",
                            "characterFormat": {
                                "italic": true
                            }
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "JavaScript ",
                            "characterFormat": {
                                "bold": true
                            }
                        },
                        {
                            "text": "is "
                        },
                        {
                            "text": "a"
                        },
                        {
                            "text": " "
                        },
                        {
                            "text": "object based language.",
                            "characterFormat": {
                                "underline": "Single"
                            }
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "hasFieldEnd": true,
                            "fieldType": 0
                        },
                        {
                            "text": "HYPERLINK \"http://www.google.com\" "
                        },
                        {
                            "fieldType": 2
                        },
                        {
                            "text": "www",
                            "characterFormat": {
                                "bold": true,
                                "styleName": "Hyperlink"
                            }
                        },
                        {
                            "text": ".",
                            "characterFormat": {
                                "styleName": "Hyperlink"
                            }
                        },
                        {
                            "text": "google",
                            "characterFormat": {
                                "italic": true,
                                "styleName": "Hyperlink"
                            }
                        },
                        {
                            "text": ".com",
                            "characterFormat": {
                                "styleName": "Hyperlink"
                            }
                        },
                        {
                            "fieldType": 1
                        },
                        {
                            "text": " "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "JavaScript",
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "fontFamily": "Arial",
                                "fontColor": "#FF6A6A6A",
                                "styleName": "Emphasis"
                            }
                        },
                        {
                            "text": " is a ",
                            "characterFormat": {
                                "fontFamily": "Arial",
                                "fontColor": "#FF545454"
                            }
                        },
                        {
                            "text": "scripting language",
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "fontFamily": "Arial",
                                "fontColor": "#FF6A6A6A",
                                "styleName": "Emphasis"
                            }
                        },
                        {
                            "text": " widely used for client-side web development",
                            "characterFormat": {
                                "fontFamily": "Arial",
                                "fontColor": "#FF545454"
                            }
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 88.1500015258789
                            }
                        ]
                    },
                    "inlines": [
                        {
                            "text": "\t"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 88.1500015258789
                            }
                        ]
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 88.1500015258789
                            }
                        ]
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 88.1500015258789
                            }
                        ]
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 88.1500015258789
                            }
                        ]
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 88.1500015258789
                            }
                        ]
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 88.1500015258789
                            }
                        ]
                    },
                    "inlines": [
                        {
                            "name": "_GoBack",
                            "bookmarkType": 0
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 1
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 88.1500015258789
                            }
                        ]
                    },
                    "inlines": []
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "Header"
                            },
                            "inlines": [
                                {
                                    "text": "Odd header test"
                                }
                            ]
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "Footer"
                            },
                            "inlines": [
                                {
                                    "text": "Odd footer test"
                                }
                            ]
                        }
                    ]
                },
                "evenHeader": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "Header"
                            },
                            "inlines": [
                                {
                                    "text": "Even Header test "
                                }
                            ]
                        }
                    ]
                },
                "evenFooter": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "Footer"
                            },
                            "inlines": [
                                {
                                    "text": "Even footer test"
                                }
                            ]
                        }
                    ]
                },
                "firstPageHeader": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "Header"
                            },
                            "inlines": [
                                {
                                    "text": "First page header test"
                                }
                            ]
                        }
                    ]
                },
                "firstPageFooter": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "Footer"
                            },
                            "inlines": [
                                {
                                    "text": "First page footer test"
                                }
                            ]
                        }
                    ]
                }
            },
            "sectionFormat": {
                "headerDistance": 36,
                "footerDistance": 36,
                "pageWidth": 612,
                "pageHeight": 792,
                "leftMargin": 72,
                "rightMargin": 72,
                "topMargin": 72,
                "bottomMargin": 72,
                "differentFirstPage": true,
                "differentOddAndEvenPages": true
            }
        }
    ],
    "characterFormat": {
        "fontSize": 11,
        "fontFamily": "Calibri"
    },
    "paragraphFormat": {
        "afterSpacing": 8,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple"
    },
    "background": {
        "color": "#FFFFFFFF"
    },
    "styles": [
        {
            "type": "Paragraph",
            "name": "Normal",
            "next": "Normal"
        },
        {
            "type": "Character",
            "name": "Default Paragraph Font"
        },
        {
            "type": "Paragraph",
            "name": "Header",
            "basedOn": "Normal",
            "next": "Normal",
            "link": "Header Char",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "tabs": [
                    {
                        "tabJustification": "Center",
                        "position": 234
                    },
                    {
                        "tabJustification": "Right",
                        "position": 468
                    }
                ]
            }
        },
        {
            "type": "Character",
            "name": "Header Char",
            "basedOn": "Default Paragraph Font"
        },
        {
            "type": "Paragraph",
            "name": "Footer",
            "basedOn": "Normal",
            "next": "Normal",
            "link": "Footer Char",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "tabs": [
                    {
                        "tabJustification": "Center",
                        "position": 234
                    },
                    {
                        "tabJustification": "Right",
                        "position": 468
                    }
                ]
            }
        },
        {
            "type": "Character",
            "name": "Footer Char",
            "basedOn": "Default Paragraph Font"
        },
        {
            "type": "Character",
            "name": "Hyperlink",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "underline": "Single",
                "fontColor": "#FF0563C1"
            }
        },
        {
            "type": "Character",
            "name": "Unresolved Mention",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "#FF808080"
            }
        },
        {
            "type": "Character",
            "name": "FollowedHyperlink",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "underline": "Single",
                "fontColor": "#FF954F72"
            }
        },
        {
            "type": "Character",
            "name": "Emphasis",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "italic": true
            }
        }
    ]
};
describe('Text Export module testing', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    let textExport: TextExport;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TextExport, SfdtExport);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableTextExport: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(json));
        documentHelper = editor.documentHelper;
        textExport = editor.textExportModule;
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });

    it('text export module testing ', () => {
console.log('text export module testing ');
        documentHelper = editor.documentHelper;
        editor.save('sample', 'Txt');
    });
});


