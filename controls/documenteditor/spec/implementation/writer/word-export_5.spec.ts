import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { PageLayoutViewer, LayoutViewer } from '../../../src/document-editor/implementation/viewer/viewer';;
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { WordExport } from '../../../src/document-editor/implementation/writer/word-export';
import { SfdtExport } from '../../../src/document-editor/implementation/writer/sfdt-export';
import { TextElementBox } from '../../../src/document-editor/implementation/viewer/page';
import { XmlWriter } from '@syncfusion/ej2-file-utils';
import { Dictionary } from '../../../src/document-editor/base/dictionary';
let rowSpanJson: any = {
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
                    "rows": [
                        {
                            "cells": [
                                {
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
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "color": "#ED7D31FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {
                                            "backgroundColor": "#ffffff",
                                            "foregroundColor": "empty",
                                            "textureStyle": "TextureNone"
                                        },
                                        "preferredWidth": 311.6499938964844,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 311.6499938964844,
                                        "columnSpan": 2,
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
                                                "listFormat": {
                                                }
                                            },
                                            "characterFormat": {
                                            },
                                            "inlines": [
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "color": "#ED7D31FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "color": "#ED7D31FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "color": "#ED7D31FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {
                                            "backgroundColor": "#ffffff",
                                            "foregroundColor": "empty",
                                            "textureStyle": "TextureNone"
                                        },
                                        "preferredWidth": 155.85000610351562,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 155.8500213623047,
                                        "columnSpan": 1,
                                        "rowSpan": 2,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 2
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalDown": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalUp": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridBeforeWidth": 0,
                                "gridBeforeWidthType": "Point",
                                "gridAfter": 0,
                                "gridAfterWidth": 0,
                                "gridAfterWidthType": "Point",
                                "leftIndent": 0
                            }
                        },
                        {
                            "cells": [
                                {
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
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "color": "#ED7D31FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {
                                            "backgroundColor": "#ffffff",
                                            "foregroundColor": "empty",
                                            "textureStyle": "TextureNone"
                                        },
                                        "preferredWidth": 311.6499938964844,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 311.6499938964844,
                                        "columnSpan": 2,
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
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalDown": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalUp": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridBeforeWidth": 0,
                                "gridBeforeWidthType": "Point",
                                "gridAfter": 0,
                                "gridAfterWidth": 0,
                                "gridAfterWidthType": "Point",
                                "leftIndent": 0
                            }
                        },
                        {
                            "cells": [
                                {
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
                                                    "bookmarkType": 0,
                                                    "name": "_GoBack"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "color": "#FF0000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {
                                            "backgroundColor": "#ffffff",
                                            "foregroundColor": "empty",
                                            "textureStyle": "TextureNone"
                                        },
                                        "preferredWidth": 155.8000030517578,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 155.8000030517578,
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
                                                "listFormat": {
                                                }
                                            },
                                            "characterFormat": {
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                    },
                                                    "bookmarkType": 1,
                                                    "name": "_GoBack"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "color": "#FF0000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "color": "#FF0000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "color": "#ED7D31FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "color": "#FF0000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "color": "#000000",
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {
                                            "backgroundColor": "#ffffff",
                                            "foregroundColor": "empty",
                                            "textureStyle": "TextureNone"
                                        },
                                        "preferredWidth": 311.70001220703125,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 311.70001220703125,
                                        "columnSpan": 2,
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
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalDown": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalUp": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {
                                        "color": "#000000",
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridBeforeWidth": 0,
                                "gridBeforeWidthType": "Point",
                                "gridAfter": 0,
                                "gridAfterWidth": 0,
                                "gridAfterWidthType": "Point",
                                "leftIndent": 0
                            }
                        }
                    ],
                    "grid": [
                        155.8000030517578,
                        155.84999084472656,
                        155.8500213623047
                    ],
                    "tableFormat": {
                        "borders": {
                            "top": {
                                "color": "#000000",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "color": "#000000",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "color": "#000000",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "color": "#000000",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0
                            },
                            "diagonalDown": {
                                "color": "#000000",
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "diagonalUp": {
                                "color": "#000000",
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "color": "#000000",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {
                                "color": "#000000",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0
                            }
                        },
                        "shading": {
                            "backgroundColor": "#ffffff",
                            "foregroundColor": "empty",
                            "textureStyle": "TextureNone"
                        },
                        "cellSpacing": 0,
                        "leftIndent": 0,
                        "tableAlignment": "Left",
                        "topMargin": 0,
                        "rightMargin": 5.4,
                        "leftMargin": 5.4,
                        "bottomMargin": 0,
                        "preferredWidth": 0,
                        "preferredWidthType": "Auto",
                        "bidi": false,
                        "allowAutoFit": true
                    },
                    "description": null,
                    "title": null
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
    ]
};
let rowMerge: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":78,"rightMargin":66.25,"topMargin":92.1500015258789,"bottomMargin":56.70000076293945,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":14.149999618530273,"footerDistance":0,"bidi":false},"blocks":[{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Arial","fontSizeBidi":12,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"_Hlk32573758"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"_GoBack"},{"characterFormat":{},"bookmarkType":1,"name":"_GoBack"},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"Costo "},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"de "},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"Implementación "}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":262.25,"preferredWidthType":"Point","cellWidth":262.25,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"Duración estimada"},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"\u000b"},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"en semanas"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":102.5,"preferredWidthType":"Point","cellWidth":102.5,"columnSpan":1,"rowSpan":2,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":" "}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":47.70000076293945,"preferredWidthType":"Point","cellWidth":47.70000076293945,"columnSpan":1,"rowSpan":2,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":" "}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":47.70000076293945,"preferredWidthType":"Point","cellWidth":47.70000076293945,"columnSpan":1,"rowSpan":2,"verticalAlignment":"Center"},"columnIndex":3}],"rowFormat":{"height":15.5,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":3.5,"topMargin":0,"rightMargin":3.5,"bottomMargin":0,"leftIndent":6.6}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"(relevamiento, "},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"diseño, "},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"desarrollo, "},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"pruebas, "},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"producción)"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":262.25,"preferredWidthType":"Point","cellWidth":262.25,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0}],"rowFormat":{"height":15.5,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":3.5,"topMargin":0,"rightMargin":3.5,"bottomMargin":0,"leftIndent":6.6}},{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"Costo "},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"de "},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"desarrollo "},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"de "},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"formulario "},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"no "},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"contemplado "},{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":"inicialmente"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":262.25,"preferredWidthType":"Point","cellWidth":262.25,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":" "}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":102.5,"preferredWidthType":"Point","cellWidth":102.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":" "}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":47.70000076293945,"preferredWidthType":"Point","cellWidth":47.70000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{},"bookmarkType":1,"name":"_Hlk32573758"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":47.70000076293945,"preferredWidthType":"Point","cellWidth":47.70000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3}],"rowFormat":{"height":15.5,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":3.5,"topMargin":0,"rightMargin":3.5,"bottomMargin":0,"leftIndent":6.6}}],"grid":[262.25,102.5,47.70000076293945,47.70000076293945],"tableFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":6.599999904632568,"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":460.1499938964844,"preferredWidthType":"Point","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":4},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"headersFooters":{"firstPageHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bold":true,"fontSize":16,"fontColor":"#32535FFF"},"text":"RFP Servicio PMO"},{"characterFormat":{"bold":true,"fontSize":16,"fontColor":"#32535FFF"},"text":"\t"},{"characterFormat":{"bold":true,"fontSize":16,"fontColor":"#32535FFF"},"text":"\t"},{"characterFormat":{"bold":true,"fontSize":16,"fontColor":"#32535FFF"},"text":"      "},{"characterFormat":{},"imageString":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALkAAABBCAIAAAACDpJ/AAAAAXNSR0IArs4c6QAAEVJJREFUeF7tXHlwG9UZX92yLNvy7fhWbCc+FTsOzuEkzuWcJBDCEUIChUDpdNq/2s7AlBkypTPMwEw79JpSICQkIZRQcpEDSEhi5/R9xvcZS7ZlyZJsS74kub/V2o4P7WoFYYTJLjseg7/3fd/73u9913sLb2xsjOAezgIsLMBnQcORcBYgLcBhhcMBWwtwWGFrKY6Ox+UrP3UQUAklfvJ45Ev/UCQUOSMhaCaSVLDEP+wezq+ws5OnqCYXFb/Y7ONAcKYM/j5ZpNjsY3amkoUiJH+OkYR2lpPjsMLSUJ4gs1PgcLgTvmOlaGpW+AmsOeUfKO/DABUKHDzqIXjA2BSYMU2Tw4onQMBSJulISKiMQ0BAu1j2MQLvZNwR8EkU0D1wOo4/kxQ8HiPpdBYcVliumyfIZiw4fSOMXPkp4HDVMiN9yf35AGTsUhYut/UECFjKxJpT7oLMWh0BiAxGzj0GSUjmrBQd6TXgMZzKgV+hYhCVL2MMn8fKZbAiYjk1juwBW2Ay9QAQKKDQRxbqL8haJjIcWlJHmkLCysEU4GJbB3F+5QGv74NnR66p64KZkmu3j1Epq8vHgSmSLYcVl7biCNy2ABeD3DbZQzuAw8pDu/RuT5zDitsme2gHcFh5aJfe7YlzWHHbZA/tAA4rD+3Suz1xDitum+yhHcBh5aFdercn7qJvazAa1ZpOq802o7snEgkXJsQLBAIGgTp9r7qzE73ByIjwwAB/l6qNjIzUNjSO2e0O+gCX9E4J9L29HepOtK3nhYaGBAexYaLu7NLp9AH+irCw0Nq6ejt6nwQhFAiDAgPCQkPYcICVNJ1dVqt14lB4fJC3tyx+vpKOwz21prfXIJVKFsTHsWq1OhgNDQ/XNzah6xoVEQGd2ag3g6alra2vbwAS4+OUMi8v9hyYsFJb33Dhm8tt9zpsduoUe+LhESKB4K03XpfJaCVhMh8cOlJZUwusqFKSXn5hr0tzaLU9b737F5yS79iyccPaHPZzmKSE0I8+OVZedRdYSYyP//UrL7oUCmT89Z//butQZ6SlPLHj0QNvv2u12sAQ2yAowD8zY9GaVdleUimDMnUNjecufntPo6EG3jcSjx/o7/fm63+gG/vBoaOwj1wmhSWZd91UDth+7773L8z0ycceXbVimbtWMpn63nnv7339A3y+YMeWTevXrGLPgTYGDZjNHx85fuLU2cKSsg6NpkM9/dV0AkAMYnp0+pNnz98pLL5TVHzy7Dltj86lToNDQwXFJYWlZfBkLomdEvQaDCfPnLtdVHy7sPjM+Qvd2h6XfGw2e/6NWwUlZU0tbXabrbWtvbmltaW1rbis/MyFrz88fOxa/k3aK0YEYerrP3jk0xOnzhQWl2JUM/m2TrxAoIYZZLBtSVmFW9dYzZZBWKmgpBRby+XsZhNUVN+9fDUf9rldWHT63IUZ+GZmSIuVtvaO/Fu3R62jOSuXv7xvz/7np7x797z8/HNSiZiBNWzdazB6e3l5SSV6g7G4tMzlxOADcIyOGMR+k83gCbv36PUSkUgsFBpMfQXFpS6FggByIRQ/ZTLZi3uf3f/8c3if3rlD7i3DJvn85OmRkVE6PrV1Dfk3bwNwuWtzMOrl50nLUO/+fc/u3f0UgwKI45ArFjOZcfZwykTf20p5N25itAye0m6vrql1a1vSYqVLq6U8x9aNG7Zt3rhtU+79d3Nu7ro1IpGIzhBw7FfyrmMRli7JXLxIheW4duMWdW3ix3uwO6/m3yCFZmaMC70Ou7gWSsUpm80mkUh2bN38xI5tO7dvfeHZZ5IXLgBPuJnBoWE6tVvb26mbrYhfGLVzO8ZOvltzVq748eb7PTjD72L/QGEsZWhIyIDFUlBUzJ4PLVaQqVFG9PPxYc+OooTzL6+swuAtues3rFmN7KGsoopNRHBX0FR6RL2S8grovG3Txk0b1kL3yuq72h62jnrGnVOkpdjx4OavUIiEQjrFRkZHsBMwlk3y/kNm90DGlpRXdvfo4C/3PL1LlZpM8Phwio6UnNVDixUKKNhYRlMf8nxAcuLF70ZmAQjDCOTQKS01aVFaqlQsBpOCIlYRgZXWzoiKSkp7jSZ417TU5AxVmpdEAh3uFJWwZIi7YaOjo4hiRaXlSAi+PHOupq5BLvfevnWTlD63pa4NQQRsMsNKRpOJjVdjqd4PJ8NSXruO3Iu3IE6JSnPJ4nSsbnVdPXNSNVUuLVbG71cRxOnzF5GxT74ffnL0w8NHGZwEYHQlLx/3zlFUY1PC1ymjo3h8Pv4jam+GOUMiAj91q89d0yCCXLpyDQkPatQAf3+Uy/OVMRB66Uoey32DFMdisRw69hly1Y+OHP/46HFdryEqPHz7lo18mmuL1F6i6uTPvjg5w0ooA/sHBhgmQiKJxyOn7M5DSnTcl3PXSqTfLauAqEcyF+MntpNULDJbLNdvF7CUT4sVgYAvEYtQLt4qKETCfPb819R75vxFlBgGo4lOQJe2p6auXiwSLc9agm2HDG7F0kfwr7X1jT2M1RCIJRIxKL9Hbgvs3q1rwOgVy7KguVAIoVnghoZNZ1c3K1vweAjkWF1Tf7/ZbEY2hvuo/QPm0vJKhopPKBBAYalEcvX6jWlWOncRtsJKMIiGCLFICCVZqTdBBCtBHITyqa9AWD+lFZWYmtzbC0kkBoXPC0tckCAWieFE0dliw0Zw4MABp3SAr4+3HBEkLSVJlZKC8Hb/TUlekpEu9/Z2OtBstmCx09NS165eqfDzA41CofD1kSctTEhauIBuFLVHYQRVcnJmhgqOgY32kzRmixm2y1ClroNQBSXUD5lW4sIEuDdf+pQLm/uLU2eAjtjoSNQy6L+lp6UgNU5LTrIMWhCG0LlKV6Uy9AbREMMeTU1OnGallCSMWpyuQr7MMJHI8HmZ6Ysw1mUfaCoTbAmoByWDggLZWwkpREhQcNbijOzlSwFTrBEsFDFvnjImKiVxIZv9SevKUE3dvFMIVbKXZSGUTNcJiypxims4fBQj2E/wktjcE58t8VF7A3zo3a1dlU1XQPX192Os3WZPTUliaHfOtg4CEAbCJUAlcs6OEAbrI+QBCkAn6hE6oaOj1mde2K/u1q5bnf32m29MZV5QVPK7P74Jghf37n71pRecrkpjU3NpRRVq/fWrV01Pa8hIAQfAAILi0nL0ObGL1uWsYu8kTH19eTduYcrpqrTY6CiWWNH3Gm7dKYA9+AKI4o+biE+maGAVExWFrqNLVrQZflNL69ET/8PKYWvCX7lkRBGg1X3wyPHh4WHohDqeiqlk44RPBmZsiHhl7HxlrFNuaCke/vQzHl+wl9jlFlYQZSAUrTxEH7JDP/5B77hQNNGVsTFxNEInNZl9RTklORE9pJFRa0NTM930y6uqj5340m63kTvKzY77t1euFZaWw+UCKyzNC7LeXuPR/36BTSDzkrHHClqFh49/jo8T8SUImSc5TEQB1Ga3RYSFOSbL5AJJejotLYOD6Ax2a7VD9N2F2WPRpW1ua8NJR3BQ0PzYGMCCfGNj8K9qtaa1/R7ahQx2AdTgz8hTJHceRNym1lb0zYICA8clOoQirVZrNM2t7TfvuE7fZn+nWVNbj8MXKEJFUqcPuttIlbq6exB53VGZpEVQ0HR1td/rYJl9U/zRpoJ5YSX27QCA47u8/Ha1BpVaTFR0XKxjUZSxytho4EOt6UIq09zS5lJ/Wr8C0JFugfzQiMUXBA45aBijXsfGRrNh/749U0+LgLyWlla90QT/+eTjO5w2K/38fAP9A7R6PZxz/s1b2DfTtOcRWP5Z0RBCrVcdPTd/X180lxFxJgoE3tDQUFNzi95ggFa7d+1kaB6SmwY1s9VaVV3j8Exj6P9+deGb4eERRJaVy5fS2TE4MNBhJDsKLpTNcGyTX/Rh62IlkKXRpQIR4fPQfsVW/OriNzGIJtM+BSSQOTl1Gwo/X7TCkXRjWzoW+/5ZFeAO74iTSB8f+VSFtTpdRVU1ZKUmJ6GbPFnn4xe4zD+/+9dRq+36rdvJiQuY4UKLFYSxiZ4726IOByIoRqDB4kVps+PfIlXqlfybdY3NiG5Icmer5SOX56xa8cWpr2rqGz44fMxbNg0ryESefnz77E4ofFV1TR2EIg1Hxj2DLRLAS9fyG5paGhqbk5MWOrUFMhLESWwJ1MwHjx4H+AAWnDzfU6uBvNx1OQyxPC0lWRkd2dTadurchZKKyslsCYKQsHhLJX964zW09ZzKzV6a9fWlK6jMD3/6+cwoz+OnJCb85pf7Zw/08/UlB16+WlpZNWC2TE2SADbs8F+9uE+VmjJ1IM67jKZ+mGhtzsoZgIgMD3//4Cdanf67a3l7ntqFfhIDXGjroK5uLapcIHRDzmqWVcmdgqKKu7W+vj44TJmdlGC/1jU2IimOiYxcuCB+tk6YzLzQEOQ6yEmRqPb3D/SbB8hfyBc+3pKaiHFxMwai21ZZXUMJdZbljGEWyJNQcTgFKLiVVVQiKUlMiEflcvzEl2gbQpxIKIAsVEbwgghtdBZEheUj90GoGhoe6sO4cW1JnQcGzNZR67bNuXQnPvC+SDRHrKMWyyDy+imTxcTNgQq/1dlOjgiAhrCQEMvQIOwJiaRxJqwEiTDTiqVLUN1MVfj0ufPGvv6wkOBf7Nk9oySEbriSYTAYkeSuXLGM+ZIDbR0ErJRVVsG9Ls1cHMDi9gmUQ4BvbGlFGovehr+jcJ36IFiisAJDZXQ0Mik66yOEgw0mff9/EeAghZNDcRkVGTFjIHo5cFTAGdo56MLN+KvRaIJQxPjY6GiUpk6F4vwBuQ52WFLigu+uondnQ3cNDYyQkOCEuPkMRT7FDQ74bm09EiOEsBn84RpXZy9HPUg3WaCkurYWh/CzO7xREeGodOgGtrXfw5k2sDHLSrxljyxB/Jo6EPEFJ6lymRfANzsgNja14PIJ4ldW5mJmp+B2+4/BR3F/+nlbwL3e38/bFtzsmC3AYYVDCFsLcFhhaymOjstXPIkBi9mi05G3S0NCQxhuPpAqNnUS1+8SIzYiNphYk0aIaPNlo9l6uczUa7IqfIQbMvz85bSUaAtVmPLVww1CnjhFvjxClsBsCw4rHsPK4OBgVUWVXqeHBsGhwapFKtpuYY+JeO0QcaWKwG1OZTjx2uPEtiynelttY387oz70bb/eYPFXyJ5b4/37XZEiofPoUWnMO6I90NbfIBKKVdLsV5Tv+IuZDnO4GOQxrHR3deMWuK4HnkXX1NCEX2hVKW4kjuYRrd2ERkfcqCH+c5GO0jBgfe+kprJ5QKOzVLf0/+N0V4+J9rLwWc37ZQNXtZYOzUDz5b5Pa/pcnIRwWPEYVhCA0JLHLUz0wdBfIVtKdA/8Ctm7wd0o9INtRActqgZHbBrdMGHHMZaVsA33GK2WYdq2u2awxW4bI0aJsWFiTGQzjGi5OshjaGAWHBQS5CXzQqeOvEqiUAQxfPmmiiXignHLgxgTkJnKOtr7AwFy0fp0X75AQvC9eELp0iRZsB/tFfplgdskPBnfixDIiBAiJl7u4loCbY//J2rgn5FaSGZxMU7qJQ0MDMSNrODgYNrLLgE+hL83IRASyjAidxHx6hYiyNepJcQifmyo1EYIIoO9sxJlv30sLCWG9ognTKrk2QhfmSJOnrZZ8VJmQK4AcKR/uNzWk+jDiQcyXGiAT5Nc6IGrJ9VtxNAoERVEhLn44Le5a0jfZ1fIeQnhLj5B7RvRd422iAhxjCyZzwgUqMdhxZNYmVuyudx2bq2XJ7XlsOJJ688t2RxW5tZ6eVJbDiuetP7cks1hZW6tlye15bDiSevPLdkcVubWenlSWw4rnrT+3JLNYWVurZcnteWw4knrzy3ZHFbm1np5UlsOK560/tySzWFlbq2XJ7XlsOJJ688t2RxW5tZ6eVLb/wN+oFPSRZrvOQAAAABJRU5ErkJggg==","width":93.63282999999998,"height":25.5},{"characterFormat":{"bold":true,"fontSize":16,"fontColor":"#32535FFF"},"text":"                                                                          "}]}]},"firstPageFooter":{"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":"Medios de contacto del Canal de Integridad Argentina"}]},{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":"Email: "},{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{},"text":"HYPERLINK \"mailto:contactoargentina@gerenciadeetica.com\" "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":"contactoargentina@gerenciadeetica.com"},{"characterFormat":{},"fieldType":1}]},{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":"Teléfono: "},{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{},"text":"HYPERLINK \"https://nam01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.sodimac.com.ar%2Fsodimac-ar%2F&data=02%7C01%7Clrey%40falabella.com.ar%7C8b959a70474f41e8aae308d750b28504%7Cc4a8886bf140478bac47249555c30afd%7C0%7C0%7C637066602075286658&sdata=CaO3LAKvZO0cYghjhzDBzIGRR%2FoMX8PfVav9xGJCC5g%3D&reserved=0\" "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":"0810"},{"characterFormat":{},"fieldType":1},{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":" 666 5588"}]},{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.75},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.75},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#ffffff","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":243.89999389648438,"preferredWidthType":"Point","cellWidth":243.89999389648438,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"rightIndent":-3.5,"styleName":"Header","listFormat":{}},"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":"VERSIÓN PLANTILLA : V1.1"}]}],"cellFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.75},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.75},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#ffffff","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":101.05000305175781,"preferredWidthType":"Point","cellWidth":101.05000305175781,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.75},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.75},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#ffffff","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":29.649999618530273,"preferredWidthType":"Point","cellWidth":29.649999618530273,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Header","listFormat":{}},"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":"PAG : "},{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","styleName":"Page Number","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":" PAGE "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","styleName":"Page Number","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":"2"},{"characterFormat":{},"fieldType":1},{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","styleName":"Page Number","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":" - "},{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","styleName":"Page Number","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":" NUMPAGES "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontSize":6,"fontFamily":"Verdana","styleName":"Page Number","fontSizeBidi":6,"fontFamilyBidi":"Arial"},"text":"1"},{"characterFormat":{},"fieldType":1}]}],"cellFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.75},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.75},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#ffffff","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":89,"preferredWidthType":"Point","cellWidth":89,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":3}],"rowFormat":{"height":18.200000762939453,"allowBreakAcrossPages":false,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.75},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.75},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftMargin":3.5,"topMargin":0,"rightMargin":3.5,"bottomMargin":0,"leftIndent":3.5}}],"grid":[],"tableFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.75},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.75},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"leftIndent":3.5,"topMargin":0,"rightMargin":3.5,"leftMargin":3.5,"bottomMargin":0,"preferredWidth":463.6000061035156,"preferredWidthType":"Point","bidi":false,"allowAutoFit":false},"description":null,"title":null,"columnCount":0},{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"lineSpacing":2,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Times New Roman"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","beforeSpacing":24,"afterSpacing":12,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"bold":true,"fontSize":16,"fontFamily":"Arial","fontColor":"#365F91FF","boldBidi":true,"fontSizeBidi":16,"fontFamilyBidi":"Arial"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"bold":true,"fontSize":16,"fontFamily":"Arial","fontColor":"#365F91FF","boldBidi":true,"fontSizeBidi":16,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"#808080FF","boldBidi":true,"italicBidi":true,"fontSizeBidi":13,"fontFamilyBidi":"Arial"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"#808080FF","boldBidi":true,"italicBidi":true,"fontSizeBidi":13,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Hyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#0000FFFF"},"basedOn":"Default Paragraph Font"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"Header","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":220.9499969482422,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":441.8999938964844,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":220.9499969482422,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":441.8999938964844,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontFamily":"Calibri","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Page Number","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"TOC Heading","type":"Paragraph","paragraphFormat":{"textAlignment":"Left","afterSpacing":0,"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","outlineLevel":"BodyText","listFormat":{}},"characterFormat":{"fontSize":14,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"basedOn":"Heading 1","next":"Normal"},{"name":"TOC 1","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":22,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":531.5999755859375,"deletePosition":0,"tabJustification":"Right","tabLeader":"Dot"}]},"characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Calibri","boldBidi":true,"fontSizeBidi":10},"basedOn":"Normal","next":"Normal"},{"name":"TOC 2","type":"Paragraph","paragraphFormat":{"leftIndent":21.299999237060547,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":524.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":539.5,"deletePosition":0,"tabJustification":"Right","tabLeader":"Dot"}]},"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontSizeBidi":10},"basedOn":"Normal","next":"Normal"},{"name":"Title","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":true},"characterFormat":{"fontSize":28,"fontFamily":"Calibri Light","fontSizeBidi":28,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Title Char","next":"Normal"},{"name":"Title Char","type":"Character","characterFormat":{"fontSize":28,"fontFamily":"Calibri Light","fontSizeBidi":28,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[]}
describe('Word export module with row span validation', () => {
    let editor: DocumentEditor;
    let writer: XmlWriter;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport,SfdtExport);
        editor = new DocumentEditor({ enableWordExport: true, enableEditor: true, isReadOnly: false, enableSelection: true });
        editor.acceptTab = true;
        editor.characterFormat = {
            fontSize: 12
        };
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        writer = new XmlWriter();
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
    it('Row column span in firt row last cell', () => {
        editor.open(JSON.stringify(rowSpanJson));
        expect(() => { editor.save('rowColSpan', 'Docx'); }).not.toThrowError();
    });
    it('Row column span merge validation', () => {
        editor.open(JSON.stringify(rowMerge));
        expect(() => { editor.save('rowMerge', 'Docx'); }).not.toThrowError();
    });
    it('Row column span merge open validation', () => {;
        expect(() => { editor.open(JSON.stringify(rowMerge)); }).not.toThrowError();
    })
});


describe('Table grid span validation', () => {
    let editor: DocumentEditor;
    let writer: XmlWriter;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport,SfdtExport);
        editor = new DocumentEditor({ enableWordExport: true,enableSfdtExport:true, enableEditor: true, isReadOnly: false, enableSelection: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        writer = new XmlWriter();
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
    it('export grid span', () => {
        editor.editorModule.insertTable(2, 2);
        let table = (editor.sfdtExportModule as any).createTable(editor.selection.tableFormat.table);
        (editor.wordExportModule as any).serializeGridColumns(writer, table.grid);
        expect((writer as any).bufferText.match(/gridCol/g).length).toBe(2);
    });
});

let sfdtText:any={"sections":[{"sectionFormat":{"pageWidth":792,"pageHeight":612,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":233.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":233.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}}],"grid":[233.75,233.75],"tableFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":2}],"headersFooters":{}},{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":106.18568693419469,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"AsaSAsaSA"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"SAsAS"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"SAs"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"aS"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":233.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}}],"grid":[106.18568693419469,233.75],"tableFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":2},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[]};
describe('Serialize section propertes validation', () => {
    let editor: DocumentEditor;
    let writer: XmlWriter;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport,SfdtExport);
        editor = new DocumentEditor({ enableWordExport: true,enableSfdtExport:true, enableEditor: true, isReadOnly: false, enableSelection: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        writer = new XmlWriter();
        editor.open(JSON.stringify(sfdtText));
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        writer.destroy();
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('When section break inside table validation', () => {
       let document=editor.documentHelper.owner.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(document);
        (editor.wordExportModule as any).mVerticalMerge = new Dictionary<number, number>();
        (editor.wordExportModule as any).mGridSpans = new Dictionary<number, number>();
        (editor.wordExportModule as any).serializeDocumentBody(writer);
        expect((writer as any).bufferText.match(/sectPr/g).length).toBe(4);
    });
});

let shapeDoc: any = {"sections":[{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Whitney Medium","fontSizeBidi":11.0},"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal"},"inlines":[{"shapeId":11,"name":"AutoShape 4","alternativeText":null,"title":null,"visible":true,"width":504.75,"height":0.0,"widthScale":100.0,"heightScale":100.0,"lineFormat":{"lineFormatType":"Solid","color":"#000000FF","weight":1.0,"lineStyle":"Solid"},"verticalPosition":16.5,"verticalOrigin":"Paragraph","verticalAlignment":"None","horizontalPosition":1.0,"horizontalOrigin":"Column","horizontalAlignment":"None","zOrderPosition":251660288,"allowOverlap":true,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","textFrame":{"textVerticalAlignment":"Top","leftMargin":7.087,"rightMargin":7.087,"topMargin":3.685,"bottomMargin":3.685,"blocks":[]}}]},{"paragraphFormat":{"styleName":"Normal","tabs":[{"tabJustification":"Left","position":132.5,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"\t"},{"name":"_GoBack","bookmarkType":0},{"name":"_GoBack","bookmarkType":1}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"fontSize":10.0,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":12.0},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"}},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":36.0,"formatting":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false}
describe('Serialize Shape validation', () => {
    let editor: DocumentEditor;
    let writer: XmlWriter;
    let json: any;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport, SfdtExport);
        editor = new DocumentEditor({ enableWordExport: true, enableSfdtExport: true, enableEditor: true, isReadOnly: false, enableSelection: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        writer = new XmlWriter();
        editor.open(JSON.stringify(shapeDoc));
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        writer.destroy();
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Serialize AutoShape StraightConnector validation', () => {
        json = editor.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(json);
        (editor.wordExportModule as any).section = (editor.wordExportModule as any).document.sections[0];
        let block : any =json.sections[0].blocks[0].inlines[0];
        (editor.wordExportModule as any).serializeInlinePictureAndShape(writer,block);
        expect((writer as any).bufferText.indexOf('<wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0" relativeHeight="251660288" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<wp:simplePos x="0" y="0" ')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<wp:positionH relativeFrom="column"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<wp:positionV relativeFrom="paragraph"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<wp:docPr id="11" name="AutoShape 4" title=""')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<a:cxnSpLocks noChangeShapeType="1"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<wps:spPr bwMode="auto"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<a:off x="0" y="0"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<a:ext cx="6410325" cy="0"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<a:prstGeom prst="straightConnector1"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<a:srgbClr val="000000"')).not.toBe(-1);
    });
});