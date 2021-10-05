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
console.log('Row column span in firt row last cell');
        editor.open(JSON.stringify(rowSpanJson));
        expect(() => { editor.save('rowColSpan', 'Docx'); }).not.toThrowError();
    });
    it('Row column span merge validation', () => {
console.log('Row column span merge validation');
        editor.open(JSON.stringify(rowMerge));
        expect(() => { editor.save('rowMerge', 'Docx'); }).not.toThrowError();
    });
    it('Row column span merge open validation', () => {;
console.log('Row column span merge open validation');
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
console.log('export grid span');
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
console.log('When section break inside table validation');
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
console.log('Serialize AutoShape StraightConnector validation');
        json = editor.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(json);
        (editor.wordExportModule as any).section = (editor.wordExportModule as any).document.sections[0];
        let block : any =json.sections[0].blocks[0].inlines[0];
        (editor.wordExportModule as any).serializeWrappingPictureAndShape(writer,block);
        expect((writer as any).bufferText.indexOf('<wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0" relativeHeight="251660288" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<wp:simplePos x="0" y="0" ')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<wp:positionH relativeFrom="column"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<wp:positionV relativeFrom="paragraph"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<wp:docPr id="1" name="AutoShape 4" title=""')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<a:cxnSpLocks noChangeShapeType="1"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<wps:spPr bwMode="auto"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<a:off x="0" y="0"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<a:ext cx="6410325" cy="0"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<a:prstGeom prst="straightConnector1"')).not.toBe(-1);
        expect((writer as any).bufferText.indexOf('<a:srgbClr val="000000"')).not.toBe(-1);
    });
});

let shapeSquareJson: any = {
    "sections": [
        {
            "blocks": [
                {
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 1,
                            "name": "Text Box 1",
                            "alternativeText": null,
                            "title": null,
                            "visible": true,
                            "width": 60.92307,
                            "height": 33.7846451,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.5,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "verticalPosition": 2.17,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 36.51,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251659264,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "textWrappingStyle": "Square",
                            "textWrappingType": "Both",
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "characterFormat": {
                                            "fontColor": "empty"
                                        },
                                        "paragraphFormat": {
                                            "styleName": "Normal"
                                        },
                                        "inlines": [
                                            {
                                                "text": "Square",
                                                "characterFormat": {
                                                    "fontColor": "empty"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "text": "Test Doc",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 2,
                            "name": "Text Box 2",
                            "alternativeText": null,
                            "title": null,
                            "visible": true,
                            "width": 91.38457,
                            "height": 43.7538567,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.5,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "verticalPosition": 6.85,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 156.18,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251660288,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "textWrappingStyle": "TopAndBottom",
                            "textWrappingType": "Both",
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "characterFormat": {
                                            "fontColor": "empty"
                                        },
                                        "paragraphFormat": {
                                            "styleName": "Normal"
                                        },
                                        "inlines": [
                                            {
                                                "text": "Top & bottom",
                                                "characterFormat": {
                                                    "fontColor": "empty"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "text": "Test Top and Bottom",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "fontColor": "empty"
                    },
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 3,
                            "name": "Text Box 3",
                            "alternativeText": null,
                            "title": null,
                            "visible": true,
                            "width": 70.89228,
                            "height": 29.9077168,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "lineFormatType": "Solid",
                                "color": "#000000FF",
                                "weight": 0.5,
                                "lineStyle": "Solid"
                            },
                            "fillFormat": {
                                "color": "#FFFFFFFF",
                                "fill": true
                            },
                            "verticalPosition": 7.8,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 63.63,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251661312,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "textWrappingStyle": "Tight",
                            "textWrappingType": "Left",
                            "distanceBottom": 0.0,
                            "distanceLeft": 9.0,
                            "distanceRight": 9.0,
                            "distanceTop": 0.0,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "characterFormat": {
                                            "fontColor": "empty"
                                        },
                                        "paragraphFormat": {
                                            "styleName": "Normal"
                                        },
                                        "inlines": [
                                            {
                                                "text": "Tight",
                                                "characterFormat": {
                                                    "fontColor": "empty"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "text": "Tight",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        }
                    ]
                }
            ],
            "headersFooters": {},
            "sectionFormat": {
                "headerDistance": 36.0,
                "footerDistance": 36.0,
                "pageWidth": 612.0,
                "pageHeight": 792.0,
                "leftMargin": 72.0,
                "rightMargin": 72.0,
                "topMargin": 72.0,
                "bottomMargin": 72.0,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "bidi": false,
                "restartPageNumbering": false,
                "pageStartingNumber": 0,
                "endnoteNumberFormat": "LowerCaseRoman",
                "footNoteNumberFormat": "Arabic",
                "restartIndexForFootnotes": "DoNotRestart",
                "restartIndexForEndnotes": "DoNotRestart"
            }
        }
    ],
    "characterFormat": {
        "fontSize": 11.0,
        "fontFamily": "Calibri",
        "fontColor": "empty",
        "fontSizeBidi": 11.0,
        "fontFamilyBidi": "Arial"
    },
    "paragraphFormat": {
        "afterSpacing": 8.0,
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
            "next": "Normal",
            "characterFormat": {
                "fontColor": "empty"
            }
        },
        {
            "type": "Character",
            "name": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "empty"
            }
        }
    ],
    "defaultTabWidth": 36.0,
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
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ]
    },
    "endnotes": {
        "separator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0003",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "characterFormat": {
                    "fontColor": "empty"
                },
                "paragraphFormat": {
                    "styleName": "Normal"
                },
                "inlines": [
                    {
                        "text": "\u0004",
                        "characterFormat": {
                            "fontColor": "empty"
                        }
                    }
                ]
            }
        ]
    }
};

describe('Shape Serialize validation', () => {
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
        editor.open(JSON.stringify(shapeSquareJson));
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
    it('Serialize Square, TopAndBottom, Tight Shape', () => {
        json = editor.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(json);
        (editor.wordExportModule as any).section = (editor.wordExportModule as any).document.sections[0];
        let block: any = json.sections[0].blocks[0].inlines[0];
        (editor.wordExportModule as any).serializeShapeDrawingGraphics(writer, block);
        expect((writer as any).bufferText.includes('<wp:wrapSquare wrapText="bothSides"')).toBe(true);
        block = json.sections[0].blocks[1].inlines[0];
        (editor.wordExportModule as any).serializeShapeDrawingGraphics(writer, block);
        expect((writer as any).bufferText.includes('<wp:wrapTopAndBottom wrapText="bothSides"')).toBe(true);
    });
});
let obj: any = {
	"sections": [
		{
			"sectionFormat": {
				"pageWidth": 595.2999877929688,
				"pageHeight": 841.9000244140625,
				"leftMargin": 85.05000305175781,
				"rightMargin": 85.05000305175781,
				"topMargin": 70.8499984741211,
				"bottomMargin": 70.8499984741211,
				"differentFirstPage": true,
				"differentOddAndEvenPages": false,
				"headerDistance": 35.400001525878909,
				"footerDistance": 23.25,
				"bidi": false,
				"restartPageNumbering": true,
				"pageStartingNumber": 0
			},
			"blocks": [
				{
					"paragraphFormat": {
						"textAlignment": "Right",
						"styleName": "Normal",
						"listFormat": {},
						"bidi": true
					},
					"characterFormat": {
						"fontColor": "empty"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontColor": "empty",
								"bidi": true
							},
							"text": "dfgdfgdfgdfg"
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
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontColor": "empty"
							},
							"inlines": [
								{
									"characterFormat": {},
									"imageString": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAd8CAMAAABdkso/AAAAAXNSR0ICQMB9xQAAAThQTFRFAAAAf39/ioqKkZGRkJCQkpKSi4uLjIyMl5eXnp6em5ubnZ2dnJycmZmZmJiYiYmJmpqajo6OjY2Nk5OTlZWVlJSUlpaWj4+Pn5+fhoaGiIiIhYWFh4eHt7e3sbGxr6+vsrKyrKyssLCwq6urqampp6enoKCgs7Ozpqamrq6utLS0qqqqo6OjpaWlra2toqKioaGhqKiopKSktbW1tra2u7u7vLy8ubm5urq6vr6+v7+/uLi4vb292dnZ2tra3t7e29vb39/f3d3d1NTU1dXV2NjY1tbW19fX3Nzc0dHR0tLS0NDQx8fHzs7Ow8PDxMTEwcHBwsLCwMDAxsbGy8vL09PTyMjIycnJz8/PzMzMysrKxcXFzc3N4+Pj5OTk5eXl4eHh4ODg6urq6Ojo5ubm5+fn4uLi6enpp4PyEwAAAAF0Uk5TAEDm2GYAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAE1pY3Jvc29mdCBPZmZpY2V/7TVxAABvSElEQVR42u29CWPTSLMFqhdZibq6pbStxf54F0JWEkiIE4YdkhC2sAwQGJZhzULI//8HT71KjiVLtiXnu/e5hn1sHfXeXX3qlGGM7f+S/fjx89ePXz9+/ox+/DwYKfTBD+PihBlZzTKtmmmZk5eM/t/g8OevQcCPLk3VajYCTAgBHP1HCHbMqZk+H/NwynQHQL88TSM8TDAB9pO9RPRXhN2J2b7Q65hC3/gzkzbGDLnDohoAjJyp4i+w1YheHBG7P/Q5j6FRBQviRVg1sD8h2pgvWvNRraHou34f4LNTDsISWJccOmrCXyj0pMmoCLzb0OL1PxtgXdvyHXD8F2nBYoEnbfuqBHhpAHRV+q5OQACF+fg7Dfnt6IFQsPrnPMA0CRSVHQM52xZFyj8BGOtKhKAQ/BU76lsd6ARUDXbAo3A5p+q96NuYDZfoe9GfipR/nlV9svR8+GHobHkxHPze+KzXR28PquLAy0W/5CMG1tnUmKN3/CPm85Ddq/8/ClgVqdeOvj+7kgt/1ZZVBQoNE+rQyByHdrZ99FZOjwceT6JkZ0G0wFy14vFplv/Aooh0aX6B27VV2jH/sTZ11zIfteuT5Gil1wu0/CUXJwZ8hO6stx/rKWw9eoPOTgBuVvMfT4jxxiY9VptF0FdC3VB8rDir7SedRQKns19kVumRKboMq8GoOxWapC+5cWNFf6D2067BhNuU4LgCqHMtA96CaK1mnZitU6uFlrkwbqzoa9R5mtahHd0no6cjN6NWDy1djKgui1S9cdmJKzb6jrOV+qkDF1CijpyN1KZvYjk62bxRqPDX/Y5eZT3L6tMWlRMiK5k7k1H3mKrJChdq+TknsdBhCB9mfO7QZlMZmx/YPsBJ7XzHlhqf0QfXi6Czbo/1RAHuVuYnD23KJxLeBhljzwMsd4mYFoK/4sSrEyHW816LicWKj0Qb0LSq/e0l1uyNYnUvBhRvMDB7wR+GGBO1B3FTav+kqao+etxyoVFnRwXBYnMQ9alwq9eH/5igB2jayD8x+VPEPqHIvsi4HM23LSACHHsPe374Twjx7sNZSO15gLDY6KwVmvFovDAjMHd6f/rABFW7xOlu/N+W6MasAmiR0s84wKtLzDhWDrrxyMSikzKQldTSq20qrBWre7nCshKZWzkfP/DE89k3UpadEw/0GIYipb/sqGMM+6+WBx/Vvp6jUuB/W3y14zVZpPBztqoqHE0m+egaPr30x5beoUKRcTfjYDlN8TnnYWH4CN+5njLwsNqn4iJdb85NbKQKFF7D49TaP7FAHK6Y5Rf/El+dxCRNiVUcHvhJNAVeDHnW/HS5QN0LdH6koX2Unh9goQv+t4nZWiP6XhF4Md6jbXlU+F2jeOVHCx9OWXP5kiMqPx/+ilg7xUjG/cGzUnb3vSM17wDkV/5K8lRFmnuF4EEddwDmU+CxdodA3oKb2OcANh8aReAtokd2ysA/sqRXgI28nK3eZZo4NxJruwj8YU1NFNGikjKxeaBOhRg2ez9qvqPuG1tF4NmKD+I4AikL/vFUi4DeuV7rWfiO42zPbU6i9CaR6Om7rZ8WlZ6x6DSwXrjwYBbp98ZPF7BsXaBphWONH41jvh/uecK7QRPVhPHUTrGeB9prlHrM5mc87djp0flmadJpZT0tVPcHZuKcl1b606kOZ8BsdstHm7LYeWT+KYL+y0meclOrdtdDiRegGa7gG3x/IYZQNHvjqYLDTi1nUcU5qVV7PNXhDaKpjpC/1I5VLo+ZB7szw87iXm6x28hw8BwEnZ6o2bTJHkt3Kd/fEjJVqN//4Ft47mKPNrpZ7TqJ44Nw9MfuXclfVIxMuWMlxHtcCB3nN31k2wF0+EGd652f/Et6/KTHMKr/iUItv91MenjtzFGVKL44j8P8dTVFXZ6/DpTER7FolCKvUMv/bAHFsbsue0bd9jsdcVFNUWd2fn5lfnaWuMpPJ5YO5iuZKDLqfmIX9PkyatIetyuTSHWQjjdwXO4jFL2HL8rc6RoUafk/LVefB9jz7B67ib1JRHoY5n4vkC2Dpg8KoYsdKeEzOvR2Vu42cNJnQTrvCWS7I14S1HhRAB3Zwsktp3zs9j7EPGzgNHd0x3twV05r4mUu+KPZDTf20kbFT5/vk7ZlY+UGSTOgonnwZD668eo/oKpSTtV+7j5y0ouHH05pfnGqnipQ84bxOlA+1ajs0Ys713K/8mOnjnuUXtwVTP1daK5/Od1StxrAuoxf5Pj6sIl7df+o9BOFyh7Zmyks1hq2jUB2IZeZsTNlpfZ76cfyCvS6GB/pLzoFLxONH9t1S/VywLFbhpdi6tkPo7i9mcTS9YfDhcLferRbr8mNp3IkiM2VWbjidfejYsZ12/187dGhadY8S96EsMqzTGvi2Z/t/tCNrf/wrQm2V/v84vafw4MDi7MBTNOqTT48OOgXm9nbBtuYhGvGILa7t723vbsb/dgzBrR3deQ0No1zs/3/LP76dX7wxtPfxtjGNraR2819aW/e/z169N0LgR94ATMzy232/vUHZf+UDH+ovfmZx4zjycD32fv5vg+jhz/1MJZEL7I6enjDio/X5wHvxafQvNXx46fPyt4UgT/Ihz/y9IYuF36hJrpxZBd2SoK39Mkut/JnYuKAtVcO/Gl8usmHp3oTau6VVvmkeOljn+7uGH4MP4Yfw4/hx/Bj+DH8GH4MP4Yfw4/hx/Bj+DH8GH4MP4b/b4AnheCFC7hWEB4XhYc+So+hKEdZUWd6wksaXh78XMyHqRW51P7DmZicc5JX+ugNaD9tX8Sne1gjimfYG55Hzuc61GcUtQXALFL6AwsX63qC3JVX+usqKIfgvIgcbrumDsrMqXzMiUHU5ea4Z82xnehf4zHCgsUdx3YzjX3cdeJA5fy2J5jgs5yxM5ag1AH0/iySn8dF2r5yG8OP4cfw/0XwPBS2cnSg2aUHXDl6pgLBcdN1e8zdJZnt96UAM7axjW1sYxvb/1Zr3zpH8LWN8Pr5obdch/YJf2lmbmVmbmZlZmFI7NPFazbJkHxJtZWZyCg7pLIf9srKzMri4OALLgtTcOaKfX5+ZsUGFgyG+SGVK0g51J0d7AWO2zblkWROodLPXLYdR6j1sSgdHgTHN8LUX+m/85zMz7vCt4QLwc+7jgim4WEVUq5HBuk69vX+usHv+fmQql10gbafmXNpUqROxqaD8hFQf7kf9CWm9yMj3bCb2/bXXJsruSj5MqWABbIGIrPni+6X/8wvOPprUV06edJls7Y6E0DSh6L+kb0TxtTbKFb09ZAWOuXo0eYTogOZzsCDDO9if7ELDIGDlQUbknJUhOR1vRrpVKxLwANJRApCPS8Q9GDumu8msHkPcHtX/hwAST1rqq6IRQw0yQ2u+7HpOcBbKv5+1PPncqoea3HGhP8M4iKoP+Cg1/jbvjob6niuRDv27no1Pspl6aGj7rsjROuZoWnbN655LhsxFJ8J7bV7BUddcuTwBBXxGv25xiKyzGYcd46kFFyWYJrxZ9N0EZUaOnENIEwaPRUr66rSsQqINL36bmTbe3+cZk22hxBxYApPqc2/c3shRExZJlYQEpKLTr39s1d/vUTFJMPLxoAsc3d7R/7PR9s/nJqcQcSMgHDjUfdDHq2aTGVUyNURpSYR/SFc/9E7kLCOue4LiPIBCXY77yoOflARDU2o6ArmwdlHbN1Z8HmVI/4Z/gI8lpA223nThKelaBmE6e90feKXy6dQwLxp4ewo3r27YDlItR9oeU1Mm5uHefPEVb4uyeBLQvbS9ER+YRcJ7U5e/KmO2n+0aTlyXlAiH+IF/OVHP3PnyEY8zKIhk6EqehJtOhDItZjYM0dxl7u7HEr5JRkmLlveniq0QgaYP1N8189SkvmxRuWzWQVo2Y+HbxYtl0eXgA4c5aPErS/sFpLH8BDRayrayfzYuouFbA/7zZN3Odvrpos7V0jxKsHy3s8i4MZfbjzZ0R56wn8W44ssLG4xn75Z5v0dSylltS5gZ6rwzkRoD4gGa/WSVVi2xSaQVVN4mXW5tufgswsUmxanrj0/KArvASixK+g5Rv+sxYsPnjrc/rQWCgkpLOQb+b44+i2Yf/7HKGxWrAHo9NYynrHjpTC8u1bjE7TSj5RLMnanFo6MPsyS9Rn9bPeWtFh2QY9q5DsghPmE8JSStZlcedpPrLZxy6FS5S33HnF3DaSYhOxumFc83x7yf0He/Muf/YAbxxNCNIytdZB/h0x0Q7H2pjpKPaoERJyp+b7q3RDXCcA1+6IfufAJSU+pa4HVZjBq9Jk+i67hiVRrLAyv3kKfSrA39+WPYQwCr3QSlvLkBWYcqQcnJ0mqbkmR25g/NYyB4RE73uSGi8/IZVdPMbwjsnq/9Pdgwd7qBpsUCQfc8NnqhOPGp7wHWnOfBg32lvQBUgj+6abT0ehMJAvbzevHhjEUvHhWfqz+ZefsUSBsXHk9RJy7hi8k53vJBS1mwld178rnE8MwSin9apHS66Utan27PuwF1UDwYtNnN6+8PT4PeC6KZ115c2QY5wEfzc8onBkefNDS04LEoapKT4qxtqoqPT7X0kcj3tw9T3hyrvBkDH+u8NvnCI/Pt/T4/1Tls41+EXjNfoTSS4/zN1uXXOXeweXO+UxHvX3y+9evXz+zzZh1sUoME/x78rO4/TntAS9VI6FWq5m9rEaVQkj0wzeLW6223LP0oA/ppFtk8CwFSso89kP1yvLnq9JjUuR5ON5h90c0y7pG7CDM5XPHECGkf4obzvTnC4p4YXjtXe+T5ZZV+tMxWfIc4a0RgGPIusM9CjA+x9KfejCK4mdyNS2HQvWWeYvZWri2sVC1bWzcMcY2trGNbWxjG9t/v8073fuigrlLhrQNCgRwyiGMcVPA/Fgl9qIgLkLq4YlQdu4C61U12MukxXP5iPxMaQGQ/GoLCApLV01d5dd74kBPUk/UKpkFy6aBwq9lgreWNALJkPZXXE7JOEJ+aS+wuc5IQp25dbtegTO81I2+SMRYzgusC1YCFklKIBM/OQhkctFvQ4O327pZFa0j3esCsVNEXYMTBG+HQ0c4TvLTzSGUwHE6B/kKkuvH8t++GQJ8aVWwITj5LcPzkcj5DJ0vJFwpg5d/1ZHkH12b0qPShY87216zM1kKWPRuwOHG+5ogaaqwbN0FuhNdxy+YfFfA1NkfrMerYZRMHyC9STaXPI5+htFvYRj4DueKqVRXpIMZ7A7QAKugUoYRRaDk7jTAEeLUwdmPX2yGgcwxgLDK7CobAty+R2CbJGhRiREV+lOZnJQ7U4GjGIpxQ+BoBnL7rP9VBydSO6nMp7ZXz+Eh3Zz0KE6SbEW+DCB9DcBNGq9iMncFhqBZiJtwb9IV7B09QfLFuA/8dUo1uzcC5jQJv1aYDrM/6YhwDoinaAr3iqMD6pjNEcVWX8SIb00Ceg1U47Ig/hqFs5NK0OyTlvFu2j7rbQ6vFvtqR7Yq3u9qA9CQ9uucMajGAeuLhYb/KkDnyh6YA5ET3tZRYirkaZIKTL9rbtTbUKLurUHpMPvTIUouUDi8lP8li0BHILo5BC/j0yTCycACnFv9y3yj5BA1cq2hWCFvpzrCGyB3/1NTlEexeQiGzPaxP4USl1I4LyLpGpWhVyIAKhiWC2R89RK1T2ird/WbYqbjwQGYotNh0Y1nE6rsvEO5PalVi1SyfcX9nG8Mb9+meD9CsglQr7m/yTLJUcQDn4jjl5JjJmp+Kq8lo1/dHtmaFhy5PPIls11SkpnPntis8F4FS6+zC0/UJhH3pqj3ZVvTKHE2s7OL7yVXqKC09D6vfRD9mfQMSJt1xX6eLxCt8vL7PJxG8a4Ylj6lf+q4rvMBM965UZ69mUxcOLtZgWQeAb1BWSo1udGnQKUmzE43uuIQBOrE4pSJbuyZCRfIUurJ+2hKH5UAt3+UCv/wPzo2LJpPUukLRxYoHwLgspOWfPBBLiM4IznjqRmvjJSUDM/09WS0TloGdoPxgECdpKB9WDL87nS86Ulddk7rgECtd+tG2fbWBt326/+kNT3Wgdal56sxjD81fUzEaeGQUc+TJ9Rog0xLhz+w+ITKD45pCXGT5IH17dLhtyaInlPS8mAfmSIOjk18y0b59i5U+ZtTR95FN3ZMVAGfkLZMgf81Jb1jrHkqhcdp2YhPrNg/WC181L7rH7PgeerQKuHZNs5Zyyw9OwqSSktPoHva1fBR87efVguPu/uernxcTcfvKH02PHu5tSrh2azbPe8k4On6swrh2ZLfrRuQLL2Lqiw9ScuuzuGxULiobNwrp3R3BvoTk6gQWFpJ3xMp6MXI727d39MYRIwZxbSa0oMS/kjLbH/f5esdq5tK4A8tfRGUtd6L6sdQxcg7qKnCo3R4ULvsSrre3VBfBKZtN04tGbvdomR1p3T0vWkky5a+0WdbTZHgG4PjlA7/pxZfMqRt9CN4IRbALlHKTxx8YOnLAeKmNO5pgwsaiHuYpb2y4fd90LH1S99TPnDFJfoiEsqu/b0LWFwAQtYZj3tzpdwLLfuY8zbUF5tAU7mip1biyrLkQ97DC/qiE7CbOq0c1SmI+mEbgnJrf9cEeSHFvEbpF/ssrpmjMzmRcv0Lb31xgunJ0eZJSamIzcB2iegPp2WvY33fznAtnTYT1wiwVGLW7g9BfKtIsxxrxnU7wc8o0bO2X1f6J8xTnO3Sb+JEuEerrOJHVR+rU/Vyql53IIEflNT7Pvk6fCrq1q1slzIrfuJFvXKqfhJphbAMx46yazTBzwB0UgL6s+nYTx3t5JZ63qY0Oy5PvRI8q5+8+DY9Wkt6K+NtQAcpY/irpG+TmOgZBwDl8AhMtR0WUkX+kPW/38BIi2lgkitut+BgLRWEo9nXGgr/XR0rzSqu4eN8yPuGeSbOaZju/7Yh5nDVl3A+hWPZJZ16bt7A5X/TUJkVhNxXWETUkd/lqS03234OWP/7F/jWmsY36LgQf8OKY+1Eu3m1Aebfuw3BfdHaS4CKsXdWKUFURyVyJ2+979vU/aZm3ki2mVuQPMEYBEjHJPIrQOQ1+5qB3kzbKLF88X0ELUydWaW4gwTGZ8BG4Rd4N+3GpBl5f0mhD+JOm8rDbnytiIg/VagPvp90UeK1Vb/ri7a0SsWBR32bNwPyG7l98P20y8ZazOPldMO+ys5sk3YGuPJNKsZ+MNVDxejWVMC8BAiAJGsf+iw7s3UMycrXNDTs+37joPvzF+t+4HBCnRCMSpKXB2FMtimimEjij+Jy8ItGgkPGErSDcPLXjWYYhIEfQSPJTtRHNVV7QAejKyaibLFk0yRZmuw4wBS+9HqKtdqUpHMKzgAdkK26GRN4IIUfjGN2rNImi19Wic1Fq9zAXNUWX7BAaVye5aimkZUThE7OfkKtIZi6rVVBS41/SeAApMCD1L+K3hRF480Zkie9Cbofp+X06KZqQ/waUeE/GUPaUpsfOnWLFjKx0oXDU8TZDNiONyyQ1/RyjEa/tegnoxxbX49nvp7wWsAWI+ezUZ6ttckZkd/0kGHunIKltv3dKNc2EeooezdBH+RQR2HZ2MI2+DUozRZbYGOkKnBui6TVajk4dQwi3AoeG9XbdZpWevOZMbaxDWRHQQsjYa3V84CPA0w2zwHeiwPO1s8HXu4T4bwqX+KfS+ULMVhGlD2P0seZIc+x7cl5tb0Xq82fY+WP4cfwY/gx/Bh+DD+GH8OP4cfwY/j/a/DcGX6upWe8qgcPHtyqxu587gUvWSZ+WJUF13qWHpNqBSZ7SrqSZErEauDzBW0rLD/kaqriauGLyPmea+VXWfzzFrTNLX2VwrIZPNlOFfHq4HFO5UuS03m1veCJm1ZVlqMizvFbL168qsi+bPWedKFQup6qFlxe+ecHz8lOq+cLf44uZR6ueH5tjwukSKsMvmCerP+j8Lzv0fEpZww/hh/D/2+Hf7q9K2xv78fo4Xf/01QZY+rLo4c/rOkclu7M6OEPLEm4A1zkgF02/LalcmiCs3IOpTf1Yu6cU+ULOi2cC3wsfdC76/HjHa0Q/pxLnwePzw8en3vp4dwrH5PzgOfaFyKr8HnA1xzqcKNue/TwxsLK3AyzuZm5v84BvkIbw4/hx/Bj+DH8GH4MP4Yfw4/hx/BVwWM4T3iZEOCc4FUejfOBhzzPVpX2x9R8kHMpfU3EyJ4XvAW5Aw821zdXy7Z19mNtnWo+RmYyYovnGqsmB3BB7gZUQFrpjNz+L82DfWqdK/z/z5OQJxPQnxc8nBu8Wcmw64LPvkoaQRL0bMKcNYKmx9ml9+kICp+ROsEwji8EpmdVbEGtuZix4h2fHhlHldvwGYjGNraxjW1sYxvb2MbWv91883a/FLu1OwD66RTL7jysBUFo1+Zf7795sNMf/FFQximD5V9HbvQa3vKnuw/7gfdKOeKxRNTCg2bVNv7ZL/wGp1aJJ0yRc4p65vKngrmHTj0o64gpRR+ZHqBbW/30sFjl41Ian8Q5uPmvjrn6/WmhrldSyTtyGbNTZW3pUYHSl3KCFYganaVGwiRsHRZo+3L8Cwk1XfFC0d/c3Ewg5Xi2QBVaV79ojbCVU/9HFiqh8DLtiUo2h3UyDrvdG/90wgosb0gLTBvFWqs895NKy+e2emf9e/v589fPw9qX6/XoLWysc5RwaCYMjGxUdsLJFDt4++n133NNzxW9AEDpcRPs4oPRrN2/3v59uREiTHAiCX1U//iRYYzqDS41bNn6WOmRh2uGMboXuNKMakDlv+LSxssHo8M3fr+5XENahpdVg7tsjNSumyKgXeiAg7P8Z7T48wlfbfS7vTZaeGPWwkKRnStS0+WfI8dP7iPsEbe+cXTdBaJvKujKiOGNrQaOkxHQxV+jxp8XadDF/GuPPOLqdNYBrZjqzI4a3ng0qeXsMV07Hjn+vCMqnzE43NHHOB/U1PIf/Tc/cvhDE4S6P8vRNnr4R3XQG9FzgD9advS8dw5dX2YF5ZteOBd4lUcjKz9ftY1vqomXwsbo4f/UqFx1oh3n6ANdD0wMKsE8vX4e8PE5cPQj70Dn5cTnMfAPZV5Onr5pZfSlN1XeR0zPofSCMCjyidCFc6h8lf4o+nFz9OPe1J4bZ/RNH624cT6V0Te98UR7juAclpztSZk1LGp75/yGPet+57DeP/dUBqe0DOyV1/1UnPEHw5XRF16lRYgmvmujRt+bQqrfUzz65fZZwFMuic3GyDv+syaOfXzYGXHT7zSStxQjJ0k/s5L54kYN/7QpU3yJuqejrfsndXnDIvx7o93pPK5rr7LIF0dujLLoJqaAEncdoxz0z5qJBKs8Iwm4l0cF/qIGeplRhXcujQb7VWKwxVdMzkjK/q/HE37jTmZ+NPoqhn8bqIzP8hIJddyx9UQ/tQANc3WL+d297miYEpXVkIjcrjndzhruEpNvpXjcE+ZJKjuSGTJXeu+UsKf+ECRpAJU8UP3CZzntygTi5ky2Q93hYqLz3/KGZ/FfmEfDSJmhMC8dbknRCVGl087hxmrCyp1ry7lAZx0eyYRX8haHQFggE3BJpYdEokCZEzW4aIwMXvZDUOdpxywmYVIOvEgKy+6ORCrD5kXDGCE8KzFCIvs2DZv3C8+YZVU+Lzx2Qr9+q58Juxx4ZAd+6IeN9/2uF8eNEhhj/uRrY2xjG9vYxja2sf2ftsdzV2/E9tfVuS8DPOTiYNivZm6v2m7CHDdcvT/3b5+PmXVv9Y/94tL91TAkOHGk5wKhtt++2ldi7jmfOHf7RX/S8n3uRwHQBCH5DuC3L/5T+EErfrRLpvf6K/rFVVccb3DKvpdQv/WqMHp0UkDUedAH+suWT4nwTSB8Fpw78V1cDP9SwK86Mbb3C6M/i54uNtlw9rBF5O0Rdpfu/Z3/pMs+4Vet0fHIfld0sCGXM0KBnefhTL2r9qcQkBe5j6rH7HqAouh2ilMEhINBESXZLw7OmwSuOIlTMi5U/c+QK+7n4lQrwn8pxiCOuVrEzrtAS/r9AYdFqv+KrzjY8nYe6eLG409cY8H6y56PuuF0eAGxm+99frZKRVVzVrpmhHcw5GXQAMaU9mz+KaylFzi1y3yeO9sgBxLuLJCdXfGyI1gq/IxcSyXqmz3w77vJHFHYsfIjSuZ8eUFFJDWBQFjzzIDH2pu+cHPF/x/Z2ZSd06mODFUQ5qM/36SYQFzRUfeauLj7/Omz58+fPH2+e3MiJApa1Ci0M4t/1ZVOQPG8YM/IL3yAZUXLItYubh0l/v9T/gLA5iNZCW6W9sDJhPSEipbyC4TSPFyjotvLL+Fml7v+4806FnMJCF/X2uP0ZzHnBohRShFtPc9HN677uMOh1rycNpyawtEjP2pnFP82Fd5I1gIUnCJTzg03XuGiLtZM99rejsoPejaF1ZdZHY9IKj+GpWdGkbqHpEu3djnrLZs4vtqA9OKfekhE8PAE9LRI4Rf85CwfZm/R7oSJdSj9FpNJnmDhDgUo1PLPo46XmNsms2fUhxMolluC1Sdp8JZeqoAUKvy1AGKBGuz32p/eD9n0J9vf3kytfO2Ph/bjIvCXncSEQyY/9vjo1kR8sZDOHLlny2Ux+qUQg357U9YnX1ft3n7j2zbB6iI1jT7wa0KtHFHVF4KfD5N3F+ZW73edVlM/a/zuGe24pibmoqW/TFXEI7sum8gZqX/ZclGMfkvhaJ940vvPbmCKwB8uU74rFPcX9uWcjycU7tIkb04SGcpIEfiFUC7y/LJyKm+kbk8Seb9C0qgrJ4nwDUoKwM85siXZ/rrAvfR9W63myEmFlxsWIOtP8tEPlh0ima9R41tb+V8w1cqYxlg7iYN36GqB2I1lW7Y7pyBOPC8AL5KWsD3HbEbpceHKn3F0vF80j80ZxUovp7XNR6mll4EzBQbej2XQWxyCzYdF4ONtbzdJ+sRis7Isfz78mgvyBMOmnalnheH5Zrx72v3VUJMIFJl2ZmwsdjCs9zkrR32Unu2muhv/sitS07F799zUhCeLEF/RYrOI2IBSVeW3fN3w0XqPRXkKzPlrdnyUxbi+ZfRRenYSToHXb4dhPSdg89dighkATiEqjio9Oz2lwVuSSMpoVTkbzfWQsSKw/IK12w88+46znAIfbxvz0mJed7TfJJpDp/qCZyOv9bXrf5/GZE4M7Z4Rg8fLMsaGF98txvc+NCV2atMbxoorItb4ukt7PWnVEQdp4Towi4lsvPZVqipI3W0dWYjyvQNEJ7L2SfaDjhYpSYy7RiFlhd0LWJ3500t/2iQYSSIvUDf7ScQRLBFeAUA3CoW3Hdak44Ht5mezOpSI2YreoJ256rUcSZMRVjsoVPdfA5Adi2QJ/JnRPkuzbvysiXSZsr0dVlHljUJB7bsTKhKarWnpx6ymdInwuRf804yqRyyaXnoNo/N6Ibm+7+wMReWigt6kfuYajXc8zBH7O+UzzIGJSRxX2iwU0b41jbFO7505SzaJZnSyLuB147va98XIOVGBlgsVnre8PmNmsZQXKRZ8E7njD446xt+x4SSiybnVCxX+4XSSCpdNkq4RGbEohTu84OTkmNfB8e9jA2rcQ5JwXNLV42KFT/oLUaazfsNGRJ9GEOsKlmeaP0+OjdC0apT760HRc6JXaf4ogv6hkbjiwL1Yyss04QtHnPoT1YFn8fUI0QQJjI28cKnANsf4p5HQic2YcpVZejZVExsfZugsl447LNtF+t3rKQTJCx7ci1Kz7OrDi1TtEAuRGDcdbwG1IlX/uiGc3epqJycuZJUSHbdHIOEViI+AsvM5qEDV/9uI5kia7Hg5t2TrLgakFifAGJ+9IBH/E7tL+eAf/98QJRusSEDUpoOoOOxD9zWFZD/iQujGNnaQ7ENM+oB9Mf+KcDP2FkIaH4xnOCyCHi012FHuXt4CbpGIoDY4AMIZn8ZH4014VAje2BIRoI7QRydQKBRucwOg4y6qo/YJUGwUtEcOZSVB4mm06O3oOoDugGfpiHSjbRS2Q0rFnhCiXVLxu8mlzagFaBc+xe4aNvqxbYfKvVF/7Pj28iJJas9Hf6R0bW3J6NMOXDFvAe03BnJzeXmZ7Wuj9gMn+uNa2xjAdk1+dIK7g3zZWN5sb25uriJjUDu0adRo7TvGOVmE79w1zs8OgwfG2MY2trGNbWz/JXbkt1ALVW6QseU6DUaRNQRnRsJ6I0jYEm1Ws8731giSlkTn+6x7JwsPE45YzABnJ6xJBC9WV3qaCQ8jyBiDR5OsKPbPnDkoZ8IHBJVefCBwxkGRnQMdlzfyYk3ds490sgde6bXP4IpXPsXlggsKFHRUQRb8yYTve0FJ5otfPEXYK1D5VdizIGaLjRx+b32Nnu19o4Pfw07HhMc7xajgtxbXXO0ZBIyouHnM4guWbDvITuwfeGAuc9WZm6MAf7iw6KAzZGF2P9YeTcXjkHaKqTN8pzkSNdvnG2sOEx9Idvmo5kckpLyDbUdEQ3doqY9IyXYLsSsJxO9j467n1EeC/mRlzZF03/jmgWB/NAJLz3Gotxl848i3b87kSDTlHl9ZtDXPHLO+z3cw3qxxNIqiswAZrCiEQvkDkDM1kop/eWXVRUSI64AM14hexhyNpNlz5FNW36AjW1g9uJOjEdh50uKrG5b5MqSemXl9JMrBL25vuhIbdJAMIG80RX/a8hx9ucwvt9kCF06OpNlf3Fx11aIWHaJEtWNUm/sxijyIT1qWQ+LRLoY7DidGsqv5++66i7XIjzzCE1y78WMU6M+WPKrPZpL1A8QdTdF5MBzokCB5ukLWld1RgH95t2QTRX2Or33N0ahZPUMeFdFbqtexX+zJuZEU/RvfVnTu5lif2xnF6vYYe5xfp2n/nMAWTo5Evu7FV150sabJVS7aXtT+ejKKmeYZsShWFDTxCghHrT6Sov/9GVNQfpuYvFa7/XEU6B8hcDFWJ0YsidW4edUYCTp1KItTVj4TscCOqM+9+u64SBHbBDpmfe7Ol5EU3QkoxO43EEQaf3IkgokvX9ggJzkxx1I+xZt3/hkF+jPXUsqorM4Rb3VwGyMp+pcXDhAah9hjiljR67dGUvTnoUWTXloeVYzDxmiG2zObcupegscSHSlqNz+Mps+FNOmfFVRGUlA9bWj0wFJOUqJjy7FfvzgK8MdPeIfXK5ucbmp33oxkpgm08L7mxUNU9JFU/MeXHsXJ0HAxxVs390eB/sS0ol7mIHVw49WAwtpoJHkfm7K0MkJZ7K7MOyMhAT2J0IVDWlLexP6mNhpB3id1SzJ2FVuWB795l0cBvvWsSWKuuBCUiP7m3RkJ8exl3dLh+ERlmgTbG8kU//xxHWvR8dgpG9y8NQr0x1Nc8B0SgqyR2dZozm4fGaOd6sBR7PCtTXD/9ijA955INj8oCRHE5np/NMPt46SFiCT2igUOMCW2PZKKP3w2KYNnlFIPPz3af42k7C+mvRbBZy+dbX8kU/yf55M4eQcrdpXYvjGSee5k2uqQ25GZPN0RCc5z2ZEYn/K4WOfqRWN08J3XblEV3DdGZl5yUyP+2DJYWNLvXyel2XFWoN+RhZP37GLKs2pezTKtmlWWmbWNrMpP0nZAaRVIR+UoiDO4o/GlaBIGXCaVbDS8nTH8GH4M/78C3oIRGHGzmKqt5cXlqm1xbW1UK/jYxja2sY1tbGMbyi45Z/cw5tZokOcBoTO0Z76LwS2E/CeVQm+QFhJu3jNy1UpQBSNsv6oGe5G0sEwClHbgZQJZ/L6nhfzvpYMvt7noIxYUnTPhO1JCWHnfMXK+lw+utGgITik9k9EhjL4hrh1a9Gtp4JvrtAM2/biPHeERZHWAgLTo51LA2+2zjQwk5j9DpzhGXC1MEunb0OCrmwCQILprT6uWfumA7VAoofawFdAGKlThdBVLxgJV/wadfK0EOvNL46FuOtfh7FOlv1c4m6jS5oE4IV/8nqz81H07eJdb1nrcyS7Wwb0Wr6L0yxKOOamaBK32u0ErXt0Xd3R1qa+PcaymqztHx2tKyi513gxY8UykhXt2O1Mcsor2gyAMVHKq0GeMEprMBaku3Dn+AA2wTLGS18UdswwOPd+b3O789NV6EAQUJfj4JL58BafvEbhJITGo4nyLfjB5kPWd+3WL4kQbIJlFIqqYN/3WPMU6kA/Ec6Ia9+s/e3/v1pTT0TdlfkRK+rpvX3V0yeUAwwR59SJ867sNl62LtGNSwhT6qP9NJ04tqEQMw8mTgt9+P8112LhOFo9E4qpw8KY4OnTI0rMn1E76qLz3Ezaf9bleEBMsjP5Y/B7Q0jwFWXM4aPbJc38zzfXKRJCAnJUKDr8NkQlB5zzBxPrVPwPzfUNkDmBFQawqKBRKXbdsczZWTDsmtYEo/vsNPu9xoR3h0IMi3d/qWDox8WoDBhi8a6Bk9496bwHi9jWKY/pn1Gze8e9Bl6x7UypPqyRgLOU2/0Yobm64wGY0bryBwVn561iTqFkjuLn7HzN5eMAkODGGsf2GYNxgmQgmT3R5QUfRcQIsGpZz/I4rtSKxGtJo9e9d/TWk1Ox4E3jGsLY/FZNPohFlz/fud0SmMOCVNVTDqwmoIfKlSFLvUq/Wb6pq55J+ZaDL8qvoCXB7xGetdGaMKSm443WsaIEx7dH5Gmp/xGV3w3LQjYcXEht1WPqU+cFAR7hE6MHvkuCj4id2a25m57vskDi/xlJ5cTVb08k2RRlJy04b8YkCO6FRnn0LEjvwTO3lpPrA+kGJ8E8nCtxksX5PlS47Ncq0b3Zi55Te+U5j5VPA7cNS4YWerqr91BB0rePNBumqUa699eNlP11XVPJm+PJInZLhD2pc2ZKvvOl6uldt7SAiS2WHdO1Oc11XPqc5afPuUSN2ntCy6z5aeX2ZNy1CaKfkijsycRzlUr5CwEE8qsFZSx31UqAgeg2ndPhDUyeLo2ki5qcWIB4yH9VP+2Hp8LvT2vmSqqGe0M+nVagz3A11nGwa/H1HLclAqwjUP4g3sSnwvwVTkDltC+bLGRQ+auHukffb0gc7XCk8w+gOjT42VXBdtL9frLT0xFnvyjJyYnJqmEinU2np2WmjO2eKFxOiHVwdPHeT0fnu0ovUinzGf1xh6fnp7XpK6aVHAdNKJGES8CkZY0S6HrHitZ9WAW/FToPugX9iYiEeHv3qoCrgazqWjHanjvgtXk54garo+X9MmdiJ7Xe6lrxjS9/TUFyFMswjC8t9bFp20F9TepOPaRXwUdeTGWagx5LDA2wXKyk9ZPc8g7tVsAwGqG7S5dup1O2Gpy8vKul6+6G6BsJO+nZDhiIgur5XOvruhYTyT8ZuR+qRYXCrm/TS81QJqqS8Qahgt8Xh5ZVUSqok47iBVTw7hqXDsuHf+ETzvttpkbuXqbo0Yh8pGX2Ppy0Rad1oun+jRrRHsfRjzgFPg4VI9hlP9D0xOHD7V7nwH0IxrFnru6nj+riB9JpUMClqYXv4P/p+AKCdfq897ybuqdd/lwn/Osh3rhh+QpsL7DILP5243czya542VLIU9uHWzwoKz6gv7awrnesU4ntT6pc35qdirTfsZntVmzhxe7dUlkbU1gW9y4uGlZMtd3bN0QGQ0c+wpN73VUa8iJTsqEfEvtfBk/BKQX8ziVU6TsZP73Wf0ExSLwgqQ77l2bTwaclG7XmbsmyDpuREvwYlKOd89pOEhpxcQQsUk0REkj9093vbUJqufN5DOffYJuaqCqoKguNh0XFCmSVbRVrZopMQhIzGYTBU+3+bSvA+WB723GtMi2+1RfpKVmfWUOiIaP5J9CJufjTtcnLhYa8w+EXmu4bMWavuMYtc4bc5WUfIyvBWqA2I/rouL4OxWurvFfmax486VNw7su9Z5gAdcH/ajqlmvBhhsZDWNUcSseJ1otl3B3xT1/QLvc8oSB5Z54knQcaf8x7bJ3nj9YSNZBixzoZJ3xf9dpsQPVFIAg5pFp8B30zanRQ3Th95V/ztQywz7YLWIge/WWwFvDfpxFRKeRmNAfqhTbUd1mEd0W+VoBW1w3puH3g36UjmgSITsySofZVd4KsjER+CWOZGC/1Gjzq4W/cdnEitBoq3R/tDN4ylaOeBqGKNSXcn/932J9O2gRebfkDlCVXu2RT7hvZPmDM21xgk1bwPrmAoxhEK/SD0Q8XZu9pkvEFHkl2kaALEufWADsTXXIKEEDQmcFYMHtvRO0Q/HFDAfL6SujxEj3v7nTGQtbm0Eii3QydrEUBJiEKCzIp1Dcg03RjcgaVx2lqOOTsIOuv/yE2z4w5BVcarMi95J1c4ZqJ2kcV1B4m6DWUz5nCyQKuMb0EwScGPowRwZ6yAyKfIJP/soXWwVttYZKTsjgrApFdgPNMRLkOFa51oKjScbfTulsfKR4Ps10Y5ttTK6mWppWdvgMKywHkTdJHwIUkgxpo9LSnb4VejXFuTeoIJPj7WrjKteyfeI/hsVGCbcaE5cRjkzSN06AJZ343KbJGrQ3BBGj0jyxmej/jaC6NquwaExP4CEBlUo//MZ8YI7VLoUG7NPWNsYxvbf5ntOujdOaLblAyw3SvpQmHPZwRlt9+MqG2YLwV+i99g9XvMYYesMhIu7DmUL0W0L/wlyvaXG0Oj7zB0IQlJi9d/i8ezQGvomndo7KMqjN+mMtZ2yNwDW9QRobOciVbUvbHO1JKZWC4M1/22KGVhagjrY0kROc4lSqVHIvrGMPB/T6L47Mnqs4hG36bD0i5Ep2i+rR9Ki/5tI3ZrYX5Uy3fsmUTpNPNM60M1/+t6fDzg+1HIa/5VGWOqTs5D4jcSwVVRidyc2lx2QN65yBMV1IaBN96KSywRnBT9oXUvp+qxDqjkm3dvyAuVT5PSRyXewlnJ6Xcyqll6kvyhr3M+cZc+1RHDvRa/JlI3D2IrHxjD26eGJCKy8Ercqy9tOIQm+6pXyk3ivz6/y+KayNGZJLv4JiYJMVHqlZMHgcdGgHSOYHe2B3wy2Y9d1i0qr34i2QHZl1kL+uKFlHWJKOyzr87DjI6XsZCc1gArr2T0a4mxIVsXEsXvIXJGlUh5hF5mkqOvQeyGglZ655t1QIb3R7WwXip3ZNfCMQvZTt1FnTY5RV04ziktE52FhhDtg4XU/E2nntaLJqR9Uip8VPuxl5+mws+6qtdHv62Xi87o+fImM1r20kb+6ZRwVIlXpCXDG9/CmB+fRtw58ng+NTHft0vPs3Rgxk7ANMYaI07w+AVWS+VHphxY2hUG6cERcdwzLT80ZO+CHvkYUumCUro16h/t0ul6PCxKu7pTuv5lW8WfVsRStkAmf8BON/yPBsaar1YF/GFNLKep9HzOz9fu6SpYyoeWLl3Kmsco4mI/gNMHxtDwOjQEoN2VXOckGQlZEUdbUUiwu5kNzy58K4RnE2tKbIYVb+6XtiqEZ3pR3YvOSax5gCtJXpoIiiJZsRkyTvllpaVPDYxJdD2Kqi09QK/SVzPwJDz3Wrir2fBVx2RF1b/aFXnzcxrF+NXG46UGQ95LxClXBQ9CAyX1mGnJszWuCN5Sl56px7xos6U4D7hdgUzfHV9fNNIMeLEgIih5l89sb1rw1iArMMYSN7K0mr3eH1Mp8pPUIOeTSRmWw34pf8l7EOosjrCU1rb3bcmRjN5xqew44N04AD91o2twjSNFPih9yY12evrGOYOoLCJjOEEIt0qOgH/nq7R2BNLn9OOpZKLHcvv+1rQ+Y0Rn979TP3PDTTBjyt1y3AtjmgfN8CxGBw1GrROOrVKDI7amUewrzfLrnjIHFMKi+0Fru8SWDxOEDyfriuiqi2L+R4nFl5EhkkvWzkxh6SkeP2uA8jr/vk/k6bmX5omIDtDdH4KSDprvGyjBM2tnZ3Kcc/n5XqXdtErBfzIhU2jyUWf3upxsIJ3OmTWTVQb8fhDtXYmIkABo9aIzXac6kzivhhJ8LPcaMo0oP172aHlmpkoIJ2TZrKHx3zdUXAr/Zak3nep6gIkiB7PyW4+GQ7/L7jKQcKdHfd9eyfn8dR4ZRPWe2DwYBv1BQ9FseePDUm4C05q485Le7wj/x+ANcK+OYop8tM1xr+d+Zd6WrkW5PwCrNmgF3KqruAjRnxz6Kf9Ls5RKqVjZCaE20Pg/fl+Xa4heRQvR+CwEJMlCjPB/9h+cd2s6RCKgXxG97cuFvrjgdhEzzWa/FfC+1qkxi4lTVFz5mhtTcln3Y1xp81E/4XH3pkMCycAQJjNamEE5b2t2uNgeR3/xGodFX+DWREiSBHlBqfxU/O03IKmK3BJ16NUPjwoEaNycpljpmqs4wOjc1Ad6tPI7cd/jar5cHtu3pvaMXvccp8bNCXZcQAQnhTmjGacvdOParKODHEDk/BY9OGBvcJRyy3V6emRcnDIdVWCS0L6m0B+6we9z5UJFIaFmHP0xCKzpLnrmpbrneZQkEwuqCAXSb9kVvqo76BSoZgFOlifNsrzofSxHBgTENGIan6oG4ksvUCHKnkzcFnPz44YFSKOq69p3YEDO8qIjAkvO0O/PqGrryfGMtDtfYRFxyMAs+cUFiuEM+V9nve/gqONuujonLNH22idjcFsGSjqUhYU4aScSljTpzvAFtm9znGHAWQe8lth798iSB10VEM01rc3hefJRBZxt7tTXiAVlJAFiqfXJKMEWFkHlok5TFU+2SjxKAdzSiPKLi4LyJ5LkZpReCtRRsUVZav1rlGeLq+ssN4KQhIfUkBB5PGQScq1NKBNcLAPtzbSUHWdmAKBok1SUuWNlfRVToCQ1cQVbG5ylTeejUaHNLrXbaRUApNVeWrcfG9XbZdTusnX3qTG2sY1tbGMb29jGNraxjW1sYxvb2MY2trGNbWxjG9vYsu3jnXvv790/Ph/wV+/XvND3zbmbv0YP/uX9ukc5u9aubZyOHH6uJsCZDJs5fzJi9MerOjE1gZa3MFr8Z9hNyhjixt8jhV/xO5XX3JWRNv9fbuL+mEZ9oPFllPA3HCKVHeStvvV4pPD2mStk6+OIS59gZUXVYI609H+5CbU9dnftvRwl/KzI+afibQieGunIe7RIZUJBobFpXzFGarOhzDrHL7XR1KvRwh+2QtHq/CVqK8aIbadtcjERpiBanxn9kvf8300z8IPAr994fS47joffvn76+vnzmxNjbGMb29jGNraxjW1sYxvb2MY2trGNbWxjG9vYxja2sf2vsA8BTWgYEn+gBG0DZqzY93mec0iGppLwXr+P8ekgGmvvQqUHrBJxYp50HUh4q5/n2INI2r53uA4y6MyEwLNPiPx+zoPiD+JXY33Kqr63EagU1nFMtA6eB+zc7AsdyGYf6LdsXu8Qy9+TOJOXUPF1i+H7Mu0XkOISfw/sBIFCxcKLHJFCNgTYE+lfBR4VxBIDRdU137taoIPEuQ/OyAMwLYDbuY9ypHAAe1JBJfEHrsydnJB3ifFFDg5RN87F3E7P5ZxF2uiCzX8xVNoyIPUeIEEn4UKamJeIuHkX3J68DpdVWaT731NiFNChfSCzH/OrfRkxH/X/v/KqHuJMsNH38vHfO1TyNsQ7Y61/gVVNAlZJRQHu93qWRVBSZAJsml/1bixdx5qM8olOqPThZG/g9UHpjexHUZV6WGjJQwEp85uQEN3ArOURob5th+xH6GIlfCN0MAjuoTV16oGmoHAJxnz0u9RBWtaHlRY7QSNOP/v3hIuwSskstYMyR58YbzpfSxEZ9xu2Si4jFBFx/Yy6y9/TruBVyJGRnbPl1FSKWLwR3QLod+NMuDzPDap1q7u8qneokeCs3ndkirQNXI2u2Jxz1dWLO5thcT1N3eXfRqzYx4qf1foWlhm1eDsWgb/hxmk6o/ZtpOvqfKl3LoXpi0+LJbBVJJRCE94t0qEI5WXJjPzdSEpFpLf+UU3NXUxZq5Cm6iU7IXyDyFQmX+yllVCscdPhLSJTS2AKhQp/LyH3E32xni1ptDOZXABbt1PhE8lqCnW8K64a08y8XtJ5L4LEYpCqKHtkYr1ToaQI/GWV65x/Z7oXWY1n7NFia2l6umtOrIhWqO73VX4ZLgaYkwf2RYC1QlLa0DtpJgTtCu0zZ5z4GxH8Ts8Pb09glbAn+tm99T8x4+W6GHxU91SmgIp2cpM56WBfBHHnTxF1/e1JuSJcUEX8Q4uqdo822UGeZuOBSeS6n5oyRki4y8QSReBnXLWnZJJuE3m5cLcn9B4WpyWu8FSOefbMInXvYnGSYNNUgeTHrwIsFW1JStISVnoQMkmFOv4HFKdfR8Tcyf3CoQUqM4Yzm1H5YruOCxyL5129jETjbiI/D7HOHJFdevl/i2iYz1A1jKPF1C8go5bIm0GW3mSUXuxd8ms/6vex7DUxtwrD8513t67ssRlrEdL849VCXPdRY1141k/powW1a9H7OY3VlqjIrDfjxFVJvCICeip1A99vd4+8F75M8B39lwv/aYnGeZ1wbdfor/JTRNzles+PornTzjU7Ia2Hp58a/VQ+pE170XqvlUQzc8hJ+7yUOM/h4JvRF3zU9VLWPAtRLXybs9FcdLTgLxN83usPPtpMd29nWI4yXaKcgT+fEHvEaHqnGLzWvKRr3RFEp9PseCl12lDPeeR7O6nhGLwpgs6yBYm6hdREVcYnWyx4/Ezcc9FZo8mDvFVM630mxNz1xgRWU08apjxasmWvV/H/XUrUPaALhcTVHk0prwekp4g7mZY7ZrEsZ1e9AwknAPbfFSr8gRW7fNJzY762xSQm5Ooyi79OeXZVVXrzT7G6dzU6pB/zjoJYQxmom3Fq+N6CpKwnulBI5357KiFw67TTPnKsd6PspE/tVE3MFw7tkJb0iyVYvhqCXFOi/cxmujDzBxv0zjmqiDBFFvOLzO0MMr0Ini5U+J3JxBtn5gW9gETWZhD5Ibvx/6ZUeX+Ev7pg4Xn+N612mnXCf+MIN7iK8vI/dzTAl38odEoU4+lCEu9bk3HLY3AzT5ATTDQ/9lgQz//0+bOogy+f/qWW3t+I7oftYlcVN0KcEAZfy5yk37o8OaXeeSDiB0Hw+vPXT19dP6BICAaD9mNNHxRBv2SihBqrO5P9yQnCy9+pmMleIWC6qvKQBnLo4WYhJ/1lUzaZiNm0e+wm3jV50lyhuN+pmxlrusrxg+07RdCvNBOOdYKdtV770nd1LG8CZGohnHQVq+JjnhNgooiw+hWmI09jQXW7904uKr8S8E0VrhU+TPaBAlV/+s/9Jkivp3zYZs7m5G6061Irf5pqMGHJnKJ3q13ML/qX/8dG0lEnvOsZ6WCTds/EiOlXAz6rWq3UotmMVytyNRMdRLU3W9wTbOYvz+9rAAR6aCZH3a5I2SP7OCGzO7PeHE2YYZELolseW1NBTf9Y9EBQDu/oUVYxdONoxRIy4MwBBNghz4p8617N535a6T2A+EqIZW3FfrMgemSzJh8pIhvK5rNiX3q7bwWJ8Z5c4nFYv/vOKG4rngiWjN7ALp5O/s1bM/TlbQym+kIEh+aDfsAZvon4DQt28PM+vvb+3b7nB6GvZw0/DCLwu0a/Nudy/5eL+43Sffdmf/9dEIYMOLAe7O/vPzD6t50p7komz4xB7M27N5Ht7783BrXZ6ABnovNTO77WXH//5dzQjaMbL4yxjW1s5djxoz+7o0f9dcDs8M/xWrN24fNv/ueDw+0RIJ/8+P3DaDct06xZZo1dZQU1M/qbaVrTb09/HlSK/fOU1mpmTSSKV9f2ih5EQsu8cM/49acS7F8/ImyeXhLOZHBJnt/CWm3iZvkqAD+P7aZFVbazzAQe/O3s6ZtGqa1wfBTWIOa09MgeIo4otjd5pzTw02PfxIL5onyp0PUGoK61KL/fwPb0jXJKfhJYgGWGt8TxPq3qmclNMUalvMCRZWF1RurIx5Jy+hLcCyq7AMbFDkK96v3UAxIneSOYZLe9TOYqb8t4Pjp3cigZkpOaB8qL1lFeANxdeKxIc5I+xSrAujRExZuS+SRJWIBj8hukpSzRhEFB0OJetKnLg3Y6K1nNOJE2TR+0qUMURxKprEGxF0d8zZsZsObPlFHnd2THT6AUqLs814p+j/7sOKpqIEESZD0RkDkzWNlxwnXMn8gfTl3qblyfnZ+dn189Nt4urly7Pj87O7NEacxhInFVsOxu/UvBHHv8wg13zKfcJ7m4cC3NL/h5/dq1JUcn44u7YvRb0G8HPK3x9044zkVCrsWFXqSW7+vzbQd00ysNIgxBf+U/rp2ZWLG4es2/W3612hb9EWLmX/Srf70vdEh68bBwNGwWY45/QUv6ugNkGwCEc8XRmx2tLebytaXC33+F1vmFC88TRijiiab8oq6Fk6ZIDZm4onbW1o1+7Blq08T3eRcsWv4a6LlOkE0o6Z+w/9jny5/k4LHHFJShOrIJTtyRRl9faw8wbzwOgALW1NOoMsIi3f+kgUWzqYzssG4MZM/okkwKymqBtWc4n/+tumSkYMWeGzwZ/VPbwcl9INj5wy+IlzPcB1E8HT+M96XsYU7u7NeUE7xa5YdBN4yHHsgJU3hD3ZzefxTEl3Rs7K0aw9lDXy9BjF7n5MBbPJiDqNiSJWNY27Go9CZn8haSLZ/sK6RtDG8PPTmF8anM6Tn4TL5FwNJlj0pAN/ZMkkgZCc71nnWf2E22SoE3tkxI8Hl7Fd9LRFUAWTLKse1askWd7K2XheI8srBeEnpU/RB35+xbxCMrEVAAuF0WvLFrxVtgkjn2jjwMOoMvLBnl2Z6ZzAs8lwUPfIMgludWifC7zficQjIa/yiIg1sKMQYHaH42A2TBW4nkxWSpVPhtC6uIDww0deE5taT/gh3P1ktFN3bqBClmKc4grnhUnNwAkZLrnnX+OD7HTt11UBpH2FBUMvyjhj4YY5q25z0y1Q19dIDcNMq2vZo6eEY/LqXVvXaRAF0tHf7AiifeFKomYytqv1GxuJT+4GOyYmrfO7KUU6YgQb7PoTeJQG3jIK3vWYpA3l8YaFHb8pRbBqUtukeWnped5QrgD2tIuh4ppBBVFVeF7Q2qgP9Tk/NutK6k8PMtyVNh71BB27Ourw6uKaStYxNL5xVUAy+oooL8AV3sg99e7J2rpPIPzDg2kl7rrvyYH1/6lNs58COI2Sx4ziY0qoPne3g3E57NCmsVwkM6YVCXHjBdrrT0rAPOZ7Y9+3m/wrZnHEua3fasblYrhOeduxc8VDTw4qNrN1szho86X7XwBLpZa78msHSYRyf8KkbeoTpqpEaGGB9tFQNLYLGK0luagkbTF1xxQ4MqWXBPNx0dfZDKULc0QRqjB6XDP6qLCY+7OFL3evoqiOJW6fCi54mrqfS9Ht8OIH5huF4+fC0WJUhjSZ/8R0V1Yigf/miD3zUJX21q13rBwgWRWBXQ+5Lht6di91I6afDI44xGMTbLXvH/WNDzlCF8K2I3BAUj0Puo+2tufPedHh5wPK1uKFkPfFMq/E4Da9IvttN71vcQK3RSqm8lUXgW75aR1IcdMlXcEkFvyy18HG1GMzxrxxcQ6/mC/A9QIvyK1gYBBJkU9e+u3o6VWvy9hjpAsG698Tvrc17y9s7+VBb8nKO8JijqeJnr2dGEVp7gToayWn5KujX4lcbaz8wPfrWTXAT0rRT0oxk3wW9wel3mT2Ptf4qaKXxdBvx1EykdG8bn6bWX+OZy9xsS/j+wy0C3gEqnSbSa0rWe8RyTkv0iXLt46N53tOKx2Ck+otmVZth7I/XVxkqph/VAf1j8x1P8Gkke3gEWD3p/fgLxuCCpBAD+5+HgL7tawIg9MlzI+fxbm8T3aNHvwVD4K1Z8GU0wslFuJM8kjvlXbBIYHP/k040aRvElPnYW8+OI3jc17UfcqVnfvw4GPzMVIn07w6X2rhX41js36qv8SkmEZ2HP+neQPn/djHU+BJezVShauo5Fxcuo4Gj2tT732wIn3y83kaTNqDvc5WJU2vcmH/uUqmmaEK/ZZwXMTIaIU0qx3mSFRblT70zQIVxKo6r5T/H8YycvLzejlqPJ20vi4sI84vc1RYwUd+9sygjq/3wv9OVfLy9Pua3EKsNpP/ZSH3Tq/Zrs+XzYygDaoPn1VV4b/Pj32dyEi7tCydylvjjU92rC/ap0v0Rl+Fbzn8fZURY/Xm2tNEw7GT8oI9pdtGf0ZXdN2fCYJEYPRoE5+enxy+5UbAevPm7NNiw3lkJRJ8roL3Z7p99x+87jbD0dFsgIkEJuwre8iU9PHn9U9vLlx8dbC3XLdHnEHZbzBS83jwQL2wPQ6G8FOogSJ7ag4kYgsCzTkhb9oWa6SAiKgj4pqBMTsVtbxgB2NzjDR8VYh7Mm5Qc4L4yo7VxMOxGTjmsuDYQejT8WDpYQaRTZT9klJ0UQc6O1gCYmZzod2y9v7j8ZdM26e9ePr/RV0Dl0SkfqdpERqtDxr+7SjjGEPQjtM4xw3EXQjvfmUs5HnlIBO9b6ljGU3X0fxmKpOEFHT6Noyw8IhQniWGv3nhvDWtQDsGadxoHAqcEBoKUGkWMu3islBO7uLdeFOBxSyVOcZUnrYxx7S9fbuPPcKMke3HLCUMXcQ4f2QgdrXErmENdavL1llGh3b92L3kDWbnZ8NOslbmAt3Nkxyra79+9Q286OTeCt49jews3L5YOLN7h4h4aubWOa0vaO67retZuXKw2T2r94//YdcEP7rHnzNy/ev/TIGIG9v3qjy1YOjbGNbWxjq9COj5SdRj+NEScC3qxZHjfLCzwrsKa/jwi4ZQaWZ53ZbmFiW6bnTX4wjiqEBiuoOV1rPhYXAOyYYVtTb6sCd8w41iZBvJXyOyBlquxg6m752NTz9BYfQ4dGvVSgURFAgG1/stw3cAItPdIZf5dQstEKMcwr6U7dKw089LIjX0lKeCTflDuNkmJhQ4yzt3epMZlcNhybZdyDs0MGEEz6MX7ojU4a9dtDo2uNn8zddVfp2U/E3PfEGq4BPBuKlfvswQOLWEKgzSEqwKcQ+7YLN7y6NxHaxMHAscCBuNTBkFLHkDAWc5D0f+jy828FVwdDt3Asd3QGmdLVhG2urS5R8Rrar4X1m2B/oFBkFh2FHEyUqrsIxI7+tLS03j6rrv8O2u11JMUBVM2rzulfHAQdsHaYcNIDohjBeptmfuUtXUJC2zu+j+P9pn/8QAThaq1Brhe91ANb2Gd3FYvoN+Vo4L/4fcbCh2zUsjqnQmuUl94t9NWvbJ5C0gmhYofDvjh4PueQYDl6mdcu6gaFv/0l5FHScv3jd0l2X/C2cFGpERe9C+2r8l54eiUGsRux+6h+j82aoFx6LOa7P3SmTYxIQg+DVX/h4RdKR6UKVyD9gjN75Ul5Vhla6BaefTyxcaHsQoS9xCDohvHRInpLxlrALTj7BmpPJSauPvpcp72UkXjqHdxize8THUPE6m1Q9KgD1ORtkJi0i/W+UHtoKb/EMwa3x00S5wyICnKlCDrXq8ViphuSP/OxRnQwVLT/vFxothX1LsIojOHso6cU/vk75Pe+ALDaU+PhiWvP6lg5Y6OOnB8G7HY4qIenLj2rxzMPhtxUXQHgWOKiDOLUExntxJVA81pfX0TxtEcloBtP6yJbFPAlmF7NnfCUObQMeOOJnEQFW24mv+PJa9N2KejG8zrmQiV8LNGeUcgdO9qyAhKfWfKahcvA3O9Z97HnoDzK2CSXYRXqyz2DsIPEJVVJdc9an9G/pThuLy3hJSDxwcItDX7XFAlBMI1K3wPewvqGskya9s4EAqV/kZUoisPHHotSedKPLX3L1isE3adYKcVAu0T4XVMt/D35ghYCeTwDcMqEr6lkeT1CwJk0vWKrkFI56g8nYgGbzMpnwlLaeVYuRf6VpdWfMMlwujH9fN305XLEeePLMUUzlG+OLFn1uPTApN1a7J3KmnhEILCMzSkZPqEp4fSEVzN+qfDbiYwlTk7podQJn9vWBa1rUAS+9AD4V76mIOXBVxESdxg743vDCwWAsuF1VFCh0pcOf1gr1vWkG6mC0kPBnl9F6RPBgGP4MfwYfgw/hh/Dj+H/j8L/OV/4w/+CyscF4KG60uNCpcfn3fWgfPgaFD7jQW5qyP7hLX3Czj/jYdL++OJVafbly+N3Ie6j5xPQgR9lmGkFhPQFD30wdXL5HB1/LQJPoPt7Q+Ann1Sg52fkJxvAFPHinOC7aT2jhj+Tca2Qa6k6yznfnxe8uEqp3LK0F46sEVQ9zkyLeRqQUViWR/10KvTD6s3KikW+8/7uvart7r0H/xhjG9vYRm27J+cI/vPjf5bPDfzHiws+zJwP9uHpqwsB6nmDX52dvrhgBZiQPPZIFfbL+Pt/fNxTR7s6O/o6bQVIbd9HDf/v//iSBNV7s1WBnRhfp32R5UelkRkh/KcLni9IxkRKhI8Q/u2FUERpiE2e5OyNCP71hC9zVimqvribHwX8m2nPxp3n1UJaU6XY+2k35XQsY6fcuYpLPmGnHjJV8oQq4e81PCfDL8CTuOdkzhjO7kzxvMOOavC46UXycKBofvF+VeB1h5G9MODU0xqmgDf/qgj7Yi2gnA4r09fjjiAZdrZDC6u3KwK/X3OkbyDWlkrUP2AHrd6tCNu4UXe0BwcSrhyVWZBCa/NeRdiXa6GT1tYYSc4poM3Wg6rATcCpA03GMkUjrfWuqlqfM1kUEEB6YFzU1dEmqio0dcXjueAw4FT06KVazreqCj7DiUBsF4FTHbC01aYfKsKe913ZqxELX8LQNdRwUBW2cc3m3D8sYhggkRAy0fP8iuAX3Z6OK2WVlH7dpemrWZcntgL4TQd3rmUqeSOWYTSJFygdftWRAk/JeQZk4Bvw8DuoCr4tI8wRTneVR/9sPTc+BJXAt4W8NouxA9I1yTLuv8nlfd5WAd9e4il2EUmNhubBvlLY6HXp8C3cips5dW1p7ugPv/XLhceJtKTpBa8lhfPKbfvWeiK3pQjrAymZx8M93MYZeZ8S4fFSOyEpRdURUR4XKXa6wEuEJ0uJ7OZ8epHrqhAbxbT+I+VbJcFDm+3Kk7HXgHWqJYwcu5kuSVwGPKyv8lBm3CkvIeP6AIeNTMfg8PBknSpJVwfB2c0bDsP67+wvDwlPN9cdkFEUgJPjXHRCt9Y7ufxQ8Giz8+K6Mw80+EEzT1hmGPiOG2xxMJKC5iysxq8VeER58InFDEUFrxV6RImlB5EHOxrinln0EeXByzga7AVW8UeUCM9X9SDo6xGlwYsAKr/PR5TY9VjjG+cHzybZlZnRwbNwPKUbKKd3CrOzsyOCP/WITKEm+z13g9nOyuxo4AOK4eyuKuoADp29PgL440mUzBwf4wN1rq/MVw1vPJvwkHZ/CnXQaOIjLa6cYM/MVQxvnDyc9BDE6UVApjBmzjrs2CtXZyuFN4zfO5NmkFSxkvs8fhNDbXtutlJ4w/h1sjsV6AwGUjhFtAYTqQ1nZiuFj+znzhSj8Ig5APQ2TxJP/Mt/zVYKbxg/thuWKjAToOjYBDl2mNUNS9vn/3hUN3mG2q7DFduQOX76C5R4yjl89Khmyhnw7FII2Aku3Z+rEj6yg+2mCOWiXd5SiKbjYOVKpfCG8eigZprkjOMOCzGg6A28mcunVcJHNXDw07POyolrrW43mLk597tCeFYFj/xa4kjf+Sauba389btK+KgbHvrNjrInXXjYqc3cvcHf4FtAQB5VyvVsPTpwTeY9FwJykOgHXL45tFZuR4feD15lfr3dh4+cJr+SFZ4OqqWE+CLp1lZuGf8ElcHzTsBeQKnXxROC+M2tXb4eXyFW4tPdfQRNKsY9VnLeKokxRraDq4U3jL09XDMdmU9FTEPRUYwK9yKu1KUsa+DpNmpS6emSnU+lVYxdntVdJ0SdYK/VdNR6hCGhqVl96blt767XalTqRMj7ww5/vrtRrbD27sut9TplSZjYTIOVaoN2M/sL/+zvVPoGj56uNmQnAOikOEcLkhuYG68fVvoC2083p+xUTXk+O7nN5X/fPa/yBfYeL9drIrtXsvx8o8jUjSxz85+tKl/g8PuzhQaFM6cjrNNoQFQFT6t8AWP78Ubd7nT3c3EfzhqKtszNzVdvK22D7S/X6i7uOBpqfTO2JpvN9ReVdsPDV/MNz+XnEoqBkDMEDgBz/ePXKhvh8PPL2YbdEhfLqHsoOJaFXjypsgr+fFlp2Cjt7gXzOwlq4o/PKn2Bryu8EwDFZ0aCyJ8D9UWjUvv5ebbuubz5O7aEMmdXT6mrUuzHt++XGnbnbaNsDIxGQpT98+0SawPcUXiRVWQ0dMFfb+dqgd3po2V/oKMiS/56//VKzRYZfkELbNIRMlV/37tUszGmiSPSaHm6p/euNG2uT8pPpjByjvbR3aumH7aUm3r0FPGjm99umDaX1yOVczXT7fbVGmcynhNB3jDu3LBcNMKB12W3blihfX7whnHj1o3mvHGeduW1MbaxjW1sg9gJs98nRe349+8y0a81LC/6r6h5plffKPrs379P8z5yGc7cM+QYy+pdUK7yoGHSXHinz4DtaKNnFyr/owZGEObBu7ivaHnm/CkiI25sN/jeOMwtfb8aBUBni6BLAfkwF75QlSf/Yuenop7AUlGXhgXgC5Uf9FV47vHy0Jby8QiDX6T0BV5AOZ+jHpVzun40RWTSEZa7wCtS+T3VQVT+EBEsAzRnpzXVAop4ogz+HT8XPo2e3jXi+KcYxZc6PaNwf4biWVRpkNby4KG7h50Fh0RN9D5kTEqPBAbJTb2WA4+FxyTTKCRDNwDTXjSQn764tJaUYAwLBdoeyPricg9bXNfJrNkBt8fM18CdnWaj0Lg3cxKB7tYSE1S2lLPxM4AOzhQySoE/dBK9s0ftN5LxVAhgoxx4IaWsi5/11BOPJtdHsmmUBL/dTDiZsrwbp/VOQviCURY8n0nVg92MiffI63CJLxmlwRvbVvzcrGXvl98xfS2XCV9LDCg3tVqPm8nYg1wZ8b7gD+04OTh2Uud9pneDZDRjZItlwhsHVpxL3Emt/SOT5YWK0KNFh8CaUS68KRmAzKecOvJPAsX9Z5Pucrnwh6bYF/Ns8WnryGkNpOOVvUP+lrg/+Kj4VBHusbOQ1vS851HhdF8tG/7QIiqLN06r/VOmsk6RCIIoH/7AxCLFW/RfWt878oCn9OLpRQqI9/dbejMe1Gk7rlMrvnwromHed+mJvuNPm/eOZH4BXGDCZXbFUWEz2CqS+DshbZlW+iNPDo1og71mFCk9luEaYD7qA57lLOruese+zj9JSZGrrssUlOR5kcrX2pLsW90D/8TS/xPjIqW/5Kh7Uupt9wGPU9e8Ewt0QjhaBP6Kq+Pjan2WPmXN+W3JMCBoFZhxeenl2wLpt/QELne1vSnpJyyxX5HSz3iu69os6b07tdcPPLvMutZd+vjEAlXIEenKT80ac5KAd9crhE/veydWTPqo5IpZw7O+1w1vjgqeDa0u+GNLHoRQdLidqxCe9bzuk0487URNs1Zl6dkpv2vgn3iS/ceI8ItVwrN71OXucS/FQtjUX23pMe3ebP2aTGwHKi19tK6mLLjbgY5KgY0q4C3tYoLU7QanX7KtJt0sH/0EOcJtA+nurSNBhueRIRVMuocmIordnuZhOApkz2Mbriulw0f7fJmMJhpbKZV/KreiPIXqUunwjyzNnUmt/OMJmXyYYuSWX/sHlshRxzCctI30lk6OR6H0Je93m8qNNob0cc1PWUKYi6CyNYke1bVjG2ccsOMlF2i7gp6nqeSpB+zjCzjmNuFyVZF+rzpKiwhIxo3S80Cgs/0rLbf1d5uxZyvLUaulnFkPKHXVOdl0iPIrZ/J2TkXeceBeZVJm7e/VVVJr5tzI2MwcTwtylZj9UImFX0vc+eEwa1J5GcrktVxJpzxlqp06Bkll7+lQn05EOhC3LFmu4w03cd/Rg7D20SaxXxXjkuB3G7FaCgY3ezU/msZyYs5JoNnXmF929fEp2kX32sp8CUXYD+v8CJxbZfS7RU9MN+K+ze45ogOsCdaMWldGwwdCJwT4G9CNo16fno7jn9lZ9N7wZWep4JGKn4LehTe+N7Ai97KAi/DdkPCPpyRNHxCLJqIbOVLCr1yicveyIFB7uPKfXHNjp0L01HAh7xvTREe6sF/898M0/KKn+dlsRNOFXE7GvzYk76VxsD/4kLvm4Y5rVnsh/0sTuDPYLxiw/n/dnQnERCsidjAOUQHuzOc6Ai3Cyb4e7g/SAX9vNBVHW/pqnWuFmDvf6528dhIE/c8/v5Y9dg2vkytHP72CIgJfz9IysLX/pi/wn29XPHUTLuMHsb/0q+C349OuGAEYAmu/eBc8fDtXs6WYpqIP4KBdFN342kxqcgLnV/tmwRc4/Ha96aqocVDOtHC1D8rW5xoiXdR+v/k2P8bu4Ov1uq1rjaqF3m//7KfxvtYgpiSJCzBAxK+9+dpLrHH725fZhou5UpNYOqWILl3401/P/dzkl+gUxQOAPdEPavtfU6Uq9z58+jJf9xwc81WE5l30BGfyUr8j55NJEZYxz0rhig9g32/sf/n33+/f/xV8353P0R+/f1yseZ6DpBKZaK9ooWsxGdlg7Uv/MWmvrVgBIhZi5h0p8ILA8oKpB1++//txsxb90TRtxJS5MI+SJSJEWFybEXv9jzGAffKoyNwOcX2KHsHvIqP+4AemZfEigw79oBKaRSuzf8Xh+o/BZu1/awFJVoAUhFbhttwRh7g2AFbGPPIdbCYcbv4xBrTXrz0igzwJ1mq1WB2EmNShGBKEIsCYJORKpEKa21z9YQxuH4JAaJuRBKuCG1KLCWCQkSeYN4Lso1yH0Vv8d88Yxr5+DkBqLwCoABusJgVQ9yn6mkSuMXyUus21H8aw9iEMhN4ZFW5XtRrjbm6akCiRjCunufB6zxjePnzwfSXAHoeckzNS1SwcOKoVKvuf05z/8Mgox15/8gM5sqTKHcHptDwswt7sCHzbKM8+fXIt32FOJyBKDukMIRLxUGg22r0SS65rYP8DBIFIOCZ1uiFxIBU786jcfnP29a1dowL79O4DDfyAQlIRCbQgDLK9oHb924MKI88/vdv/QDw/CP3Ad9SK6oahH/1T/dKH97f+GFXbZ5FR6W0regnfDm3z8jv+Lxd/GqO0fx+w1Evv794+NcY2trH9/8NOHh1wO/yzN1Lc458/ov+MzboZmRX9uPD56Gf0LwcjKPKvH0ar5tUs06J6tcF+jb3G/7wxflT5Csc/jpymabpSTZlf+Un/P9/w+lFFPDCqWXROfxtQM+NQA73PVfx/5q0myLemHxilrz0np6FZY1IiIEQNADrS0YBUAeR7fNuaKDcvycmRb2r5AOGdVZdyetsRay9FrWJP3CmvyY8CKz3YBHBy49sRJWJPXiwF/MgILEBd0R+KKgjdWpTS3IkSXuDIMtOfLhPNYgLpgSFMZHzi8pDgxzWS9Xwp1g84IzYrqhZkXR0KvWZJnVFIiXeR2lIi2iml9GxH7k5dHqLi5cEG09TSUXXqoumVT9n/9gelQB2ZnLRLILXx2SGSOpQZJmm1I6oEgTdYwLupjnVpx1kmbrh8bWFhY+HafIu9REriDip8g2gQ/GNLuZKwOlIqWTugDHhhSV0Kvd2M/rYx36aUkFiNVxFJo68Gfdf/cT2WtsU09q5H5VzcaKd+5evq7LpLschEpxxRvBaw1yf+SRPheGFBQk6OydptLLR7fO375rUlh8qrKCyVidmdUDjbF3wT1OmVdyGR4A42l/MJNV9aSw6Q5HrAV6i++v+prUkkUlk1+rnZLvblv9ttyg/bUoQRgKkE+8X732mdKB+NWlABWsXf/mOrTZUXFtSKEBRVfDiq4aRmHJ9V1/tAZy9AW5BI8iGE/wuqDNWAxEqqMCCV4WModyTx6LULtf9pqKcQsaGjRVu9uwIgXhujFbjQ9G9qN6Z0pQ3KH3sWylQX0hOI/QJXWTXNWcRCLKxtDGqMCES0FyyaP+z87m/F+ez4yB8cnbPQiBq3XOMqt/o9SKa3Azwcc+9hoAKNhMpXXvE9cXlO5PUdHpY3+NTTYm9cgzjnTieUW0c5bQ/PWtwKtPeXTWVuz8FvJTeumJTBmdwyE7sz6A0fQPLypBTe1EMzsTnF0FPmysKJ+/6SaFsPvYTiJ+4F76l0Vxy9LMreDqfoKqHHHjHgllxmcTnd7mzz80U4U2jqKASVNJa9Q7s0+L2adrxDtrzeUaBvwlhUuVGe7VkyDJ6HYmaM/SMTiXbnb9ouE74mt429+r6tFAdIoXDEAVqfj6uM2j+yCFW5oAgtl6W9VxdF450rvfYZS1kylqB0lvSuKS652NPT43A5S1nkKyCwWjL8H0uoSfDtfyq8o/alfJNRMvz2FNKHrlTtjSNLL3SUlF34aOqztA8qNezoyENivmVbrPLh/5igZ960xhdRyNGJBLFkwqXDyzBgPq2m1r6phemrCAvanooPTW5abIYnHSmkksgUtu6qOS219JYEj1q/CvhDS8a5RoteStuLwBAxN1URFPWnJhVlUyNTTkzFSigYCtp/39NeorQ4XI9gJX5dSSjooSmTK7L1vMvhLMIBkZhyK4lIk4suK2J3RJwKBeUbAlwB/B9TxVhHzTufAq9SIVbS9DwgLjsK+sQD7SnfrAQ+EQibEotZ0zv8Soa9gue9Ly0QVntBCLpdYel5Apqu/dYvTxzn+dhfrRCexRumxWCDZlyRagNhMXFX03q+ZH1hp0p4Nut1x2f8nEbxnUWlAfDpkagffR2UU2X8PfTQ3VDvV0Hlny47oOIOMuCl/yla9W+WDv+orqJD0ivfsJQjkfTlPy5c96CS72E3PQqZN36rmoEfTfnq1hnSxBWOJ0QEA58Uy4e/FidudxbTQoO++/F14dJ+yejbjdjBQDPOeMBZzmzTR1HJ8GzYgbqbST1hn1o6GCRqgzelop/OO6CTC6XrKx5f4OnkpUe13OLvJYX7wvTT+1c7ziBf8gF/NkzsNZbTgzROvYQIInpbZuEntb4lZEZDnkwk8oxQKA/9aCWZTSUzEvWTrVKiModueamWdiZxgu+wmMnb9hCJb9DCb2UVfsZN0Hn97OV0Wi3ITNOUlFX9O1M4wSJfzOYUfQg125rll/9UDvxlh2CdPwV6OdSTnY9QuxT8FQs4s1qQmuxeW5lvtgwsED/sEqTur1s6awc7w671ZJRNaJoK33iEQ6PPmZjEGcR6dTxefFcVHjO5Mfx12LLXlJeau81slEOcn8SSBShY+MHnIWsexQlLotV0OY+2/7Yucg9yB2z0mz9M95uxiM4lyUqfHwdrvHO57oq8u0fgf/9niF6HeCy/DKhyFgsETEwlSWEsCbo5IP6KR3SoEL9HDQrEwRr7Nc07kLfP3gD4J39fMeWFqNxBELtVKFrknSODtnkwHus55ve/+y76hC0d6OpwY7cK8nkbZ3lw2DK/f+kD+/eLSzWssrTJgC66VpRN/F4cCZLCxmA1Cg/Bk49zk2FMnkKiKf3i+akeWKBZaDorc/PL41cFvnv87PKkHdNHVVRm2OojIPGehUlnvrnofQKz8c/LnC/+ejY3KTJ0CRKf6vb2Ul9E7vcW1kF4fO/Di4C8qa9PMqvg56uPOzOTtriwRSQZw2cv7fTXc+/VxKqH1YqBxSwYeFOfH3/8eLYj/nn5cWe2YZmuysaFMIo5O/5S3yT2B5YiDXVyEaOHNS1r8p+nz589ffb8+fOnz58/e7Z9reFZdryjE5QtxQOwWztG3/bAk7rfHZnehAMKY88zLcvkv1g1Lyo1Br2V7qAMRjN9e6C0gHeDUKQCh7Mi8QCYJGLi5O4EJyNAiZTBx665tGMMZPceBCIJeGfORU2ESAi0aMTESzEdfGJv3n088Ip5ywex+if56HGYs+7dCBRTHUP8E2HHWxoqH+MDO0hnKYNSn40nKBLTE8XNCNjLQxSd281bYdjR92I+GZypkJigIRIFU6tdQirKW3fdsJuhrrsazkgd4Fhrt8rJAnn3get3hAFDOmVcVT8T7rQ2bpaXA/PuLdtNLECplOyEWIETbNzZMcq0W/dpaIMaWpBGl8ciNtzx/cWL5ecfvXvxDrVDmwriagplnCdEt/3FW5d3jErs3v2Lt8AOXTsF3Q3dMLh28/albaNKu3f1rxu3W7Z7xoJr9/+6uFIttLb9qzfO2MoPY2xjG9vYxjZquzXpeV5gRT+9qdujxq57LtLJ1xG1/MbFUWHfngpcolMOYypOQ7R+YxTgVxpOdLBQ4k4ggyRZqLBTv1w5+mVLBUGA9uKpW1Og9cFlyQPfZ7IWntnrQzcCltOM+VEg3vVKZSJ2Ng8GisnzwiCM72D8oH6c+rFLdarOllJjiagc6Fj+q983vuX7Z7a0mNh+vVss7HIgmG4YY3XywsolrjfCfn+Zz2shJw13pO3iR+3aWZWNKz7ESEBxhyBKbHY/+DK3UVcMKPPMTnXKM/5laxlW7o2GmI/c4ZsKV/pBh46zYzK+AdeTt0GXfDXYmRcCKELy1ANw5vthwf5/1MRKwCbtLBfh/+moeiC60QXHGOscb4mjITgFxcEtRBHNzHjHKrapO+BFR8aCQ0yB1yHKuMMtkaHhfLbsPEIDEZGzvBNZuWxw86eqenzm1VB7aX19damNmOBXZ3wuFMm+bgJWp8i0s6wQOiA1Uf9XqSoa96i02qHye750263EsZc3jFNAaC5QqdrjCB1N+lBevui5NVb/V22S0EFEQacr5YmvA5zkSpSf/zyevKWXRqt4yfEkz/gWu4W/YROqFKgg6PYnPLQwQDwCsXslH12qeSFKqNRWxXFcpPKrYWz+Nq6EWAXxYBI8T3ncU048B+njJZBX+z7IXgugvIdYRpqLmB2pEAoM/i9KxatG/2g+T33elikjibkOFXWu5zU8SYh2CQ+V+F+b7FWQ9Gix9/CM2zbCIkIZe1nu+i1Tad7xiLiZHHhIeO7Yrx3/e40LsWPk8BsW47Yrqa/UzPambFl6TkDEzYOPPZbRb93crQXOeEPqBUWvRl6Pqwpe/TJtA+2VGDJq+TgKkq8iKR9ZptKPKUJohAhHrZcraa8Wu90w7QXv4YTbDtLJystibZF0dpEsqbcja8+KR3/PmccTYdNCSTqLNbdAOydiDPXe10S7ps7ajHs1vqv9pNArHO+aE8+m7HWtHC/eTj0xe9OrvQqPpXYKhmye+ALtXAzMPIfWjgVFNNQ9JhEI4g6oF2vqmoOTa1B9Jwd+z9IKNb2m/QCJcF3Gm2v3eNxKoviYWrke1K1GvPL2SIds6aUx6to9HrfmJOQFUYEMbU9NPZtkV74dX5vnBCOuJOSOwcvXEtwz9bKbOe8ceXok5YWkzSZy8YKVf0e4a+rMDQBXesDLHVoO/KVk6Qtk59s2cW7tc3gsiDPQOyprw4X4TqVAgritSX0djJ2VnpXP14c8puz1RHbnqZ1ceONhEF/y9Cq9VKzKC89YiSde62M+unFYy93uqq4HBWjKM/3lhWQRWWqb2BNe5g7IhY9Jx81CyflqxbqeyLGQG5ozE19sebtFK18sezmVzxuo7MqPIzPG8GP4MfwYfgw/hh/D/y+ErxVLRax9RvnwUBweg1koFXFNO/hzNlvc8na6M3qnWzALdpxsOL/0mLTf30u39/fu3r13780q1Ycs++q7u1mfVl9695eNi7d9tNcNfT9MM1/8lzxhu+mfjL/CHgXF4GNJvQx3/tkbDslizTTlc9UPzCt9Uh0y/UKBos7/DT0+HMu+FoOX/tuMEom7EtpxTQHQ42Vl9pK4ZJn+BUs7FYH0YaBc3sUsE95L3CFUZ5mVHySUQzPrUl+W9uiOA8Gfen1V4tm3KmpuZtfDmFRumS79I4tA5S8APXo+IiMof1blH18ILMuzqrZ6VnTOP6++vKrcvnwpn8U6trGNbWy97O+t88P+8uTD/yyeF/iT1xNm4MycE/iHiSDadDpz54D98uG3iZAt6EBXRg6+9W3CDCUVaeSVv7X/P35LScLj0cI/e7Q/7eP42IJH2fY796ZNRh5C8cXb6Ep/eO+CLxIWJk5ZI4Lf+fmA13pnNOOI4A/vTDdtfAY5X025HPt180KIgCj+FU6w/4BW3PW2T29P2y0QOuDddMtqp52TGxNRrXdyXJN/AXe+OvCj2xdclb5Qin3odK5c0YHa8KEi7D/GjemQJ0nV/gxFVpLJQl279dd+ReiXJk0bnXUP8DhVST0MW/evvK2o4DMTDlGJHjpdTdwdBLa99Ne3igo+N2U6kvkACclyWRNR6SPslara/Pqki+MMEYKXjxPRyBC2L3+qBvqXMd9wEEiykVZbiLkV4ITrc18rKvhGw6S4Mw4Yy0RGov+5S5fmP1cG7uAsJxwjXjl2+3pFBT81Fusy3TakeLiiDuC2Ly38W1HBV2sWwTooF6f4UlcXX1WEbazVZbQ77siTlrSgqnFmbNYSEj6qDpQUsTK/GvgWywt4xpue1v+8KuBbFgCJeXVKGlprPsSv4b0uHRxZSc5n3ONlvQvGtqyTstueWAEoGRFJKcVa1YXlsFq9dm0dKup6NABN8gdQMW8yuQoAddbRDksaXgk8BHIpgU4nvkzoQ9cXMb/N++aXD+8GvuhpOuoEg9ZDZ7ka21jdo5Zf+jAUd0WcyKYyv2A92uj6qhOnfn7tlQrv2bZI3gI6MKFjG+W0aYdm2usyS8+j4Vgno1im3CBxdvnoH5Y24Ux8WomV70XnFCSqGlO1fdNyLgBt6M4AXRa857hiakm5WWOn1HY7TEs/XQ68ZStOL5X3ZlJeRtxvwpKb8cUy4JsO6HSfoPcQ2j/RbjuZXx0anmcuwRo9VvoC0euQ3+vbQ8LXZEiQLK7cs4lJFrG0Em7v7w8Df2SyhROp3H48REOrfLLTgp37iKHgAy62m7iOpzKfAN/CF9FZHA5epU9QhzWk5lhiF3vEUPDdd7hS15oWfcQw8Kde5xZORFTjfhKYDFf6Mz4oFo1G+3pEafBy6PX5iNLg+Waub0Hl8uD5RqbdXhodfNChp8V9sQT19QLD9fyES0irYRK8VDwn53Clx8oNpVY4YLqiUT2sL42g9A1InJzYqJP6EewAs4qqhjd+NwMh0xdHm4plj58p19dxtfCRnTRCJKOelbAhVpk9o2MUqRg+eoF6iEnsNUimQ8aUrrUrhmd5kPlRCYnlFokth/JZ0bVFXC181AmbfoilcIaW1+R/QSwb8xqqFp69Qd3TiqhnnFbIocvrFcNHZiryJOiUytq14CxfW6oYPtr2ekRnkeEdQaYWYOcuIJvtLhGS1yWfcD0/EKnNEqKKWgvfWV5Y+llh6bn5lvRhdOr68a5J3cXNXxWWnlsQSI8dxWcENpmaxeJmfMb+EFbiXLG9gDJ6LEUd+wFx2HXXVlYPK6t8PgyPDId5E2NGcEJqGIMTLm4csM+9rQaeG62d0b8BHd4JEC5vbEel96uDNwxSS94TSU0MqUTiuMtzl9YoVtVTAfxRVANWfDMJWume68cSx429vbgSj/bpiYGbjk6aq3V9IKGXIT3ar41K7NRYqlF5aZbw4Z5V+wyqurSLrF1zSOzoSwzGih3quhOsN5s0XgUTN7aVtn3cBH+MzabTuRZ3nI+djUtPqnyBqAo2phycRWfH1N+89LHSFzg+XpykJB4FnVwFFL3ArSuvKn2B041GzVWbgrgHCC1nAqG/evtLlS9weng023DPtr46L0VnlegF/jYqrYKfs5MuRvpYgmOREe4l8tbf36+2Cn7OTtUcCau8/kI7n00PTtQGt75X+gJ7P2cmfKQ2Afr+nkoXIQ2W3t/+t8o3OPp5eSLE3Ze56j3CEN39p9IqeDQ3YUvfc4eTTq7L1Gu9+1ppDWxfmWzaSF79JBziMgUOBPh9tU3w7M/F6VCmTkjWv1Tzp96CUa2dbt2PeqGWCtNueUGqGAVh7uFfjJdKsJ6R5WgYGV1w6/6k6SORRAKSTeGOiKv55en9yRCpiseS44FHyNN9eWciFE2OsTobuqNkKX+8OWEmebIjpwn//fzBpE/iIEd35BztL7cmQ6GRCb2VtiqrgruTUosPzocg//f7CcvD5Bwo4tJe//1+KsDkHAjyyr7em/Jhxjg/+7w/tWycp717Yoztv8D+PyiWV0S5NLfcAAAAAElFTkSuQmCC",
									"isMetaFile": false,
									"width": 30,
									"height": 424,
									"iscrop": false,
									"name": "Imagen 2",
									"alternativeText": "C:\\Users\\Alvaro.ARPA\\Desktop\\aboga-consult.gif",
									"visible": true,
									"widthScale": 31.74603,
									"heightScale": 29.505915,
									"verticalPosition": 59.95,
									"verticalOrigin": "Paragraph",
									"verticalAlignment": "None",
									"horizontalPosition": -76.5,
									"horizontalOrigin": "Column",
									"horizontalAlignment": "None",
									"allowOverlap": true,
									"textWrappingStyle": "InFrontOfText",
									"textWrappingType": "Both",
									"layoutInCell": true,
									"zOrderPosition": -251659264
								}
							]
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
		"listFormat": {},
		"bidi": false,
		"keepLinesTogether": false,
		"keepWithNext": false,
		"widowControl": true
	},
	"defaultTabWidth": 5.650000095367432,
	"trackChanges": false,
	"enforcement": false,
	"hashValue": "",
	"saltValue": "",
	"formatting": false,
	"protectionType": "NoProtection",
	"dontUseHTMLParagraphAutoSpacing": false,
	"formFieldShading": true,
	"compatibilityMode": 3,
	"styles": [
		{
			"name": "Normal",
			"type": "Paragraph",
			"paragraphFormat": {
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
				"afterSpacing": 3,
				"lineSpacing": 1.149999976158142,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level1",
				"listFormat": {},
				"keepWithNext": true
			},
			"characterFormat": {
				"bold": true,
				"fontFamily": "Vrinda",
				"fontColor": "empty",
				"boldBidi": true,
				"fontFamilyBidi": "Vrinda"
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
				"fontSize": 12,
				"fontFamily": "Vrinda",
				"fontColor": "#00000000",
				"boldBidi": true,
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Vrinda"
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
				"beforeSpacing": 12,
				"afterSpacing": 3,
				"lineSpacing": 1.149999976158142,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level2",
				"listFormat": {},
				"keepWithNext": true
			},
			"characterFormat": {
				"bold": true,
				"italic": true,
				"fontSize": 14,
				"fontFamily": "Calibri Light",
				"fontColor": "empty",
				"boldBidi": true,
				"italicBidi": true,
				"fontSizeBidi": 14,
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
				"bold": true,
				"italic": true,
				"fontSize": 14,
				"fontFamily": "Calibri Light",
				"fontColor": "#00000000",
				"boldBidi": true,
				"italicBidi": true,
				"fontSizeBidi": 14,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 3",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 12,
				"afterSpacing": 3,
				"lineSpacing": 1.149999976158142,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level3",
				"listFormat": {},
				"keepWithNext": true
			},
			"characterFormat": {
				"bold": true,
				"fontSize": 13,
				"fontFamily": "Calibri Light",
				"fontColor": "empty",
				"boldBidi": true,
				"fontSizeBidi": 13,
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
				"bold": true,
				"fontSize": 13,
				"fontFamily": "Calibri Light",
				"fontColor": "#00000000",
				"boldBidi": true,
				"fontSizeBidi": 13,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 4",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level4",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
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
				"fontColor": "#2F5496FF",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 5",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level5",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
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
				"fontColor": "#2F5496FF",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 6",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level6",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763FF",
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
				"fontColor": "#1F3763FF",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Header",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {},
				"tabs": [
					{
						"position": 212.60000610351563,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 425.20001220703127,
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
			"link": "Header Char",
			"next": "Header"
		},
		{
			"name": "Header Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 11,
				"fontFamily": "Calibri",
				"fontColor": "#00000000",
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Calibri"
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
						"position": 212.60000610351563,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 425.20001220703127,
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
			"link": "Footer Char",
			"next": "Footer"
		},
		{
			"name": "Footer Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 12,
				"fontColor": "#00000000",
				"fontSizeBidi": 12
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Body Text Indent 2",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 14.149999618530274,
				"afterSpacing": 6,
				"lineSpacing": 2,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Normal",
			"link": "Body Text Indent 2 Char",
			"next": "Body Text Indent 2"
		},
		{
			"name": "Body Text Indent 2 Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 11,
				"fontFamily": "Calibri",
				"fontColor": "#00000000",
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "TOC 1",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 10,
				"lineSpacing": 1.149999976158142,
				"lineSpacingType": "Multiple",
				"listFormat": {},
				"tabs": [
					{
						"position": 453.1000061035156,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "Dot"
					}
				]
			},
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Normal",
			"next": "Normal"
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
			"name": "Balloon Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 8,
				"fontFamily": "Tahoma",
				"fontColor": "empty",
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
				"fontColor": "#00000000",
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Tahoma"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Normal (Web)",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 5,
				"afterSpacing": 5,
				"listFormat": {}
			},
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Normal",
			"next": "Normal (Web)"
		},
		{
			"name": "Strong",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"fontColor": "#00000000",
				"boldBidi": true
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "List Paragraph",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"afterSpacing": 10,
				"lineSpacing": 1.149999976158142,
				"lineSpacingType": "Multiple",
				"listFormat": {},
				"contextualSpacing": true
			},
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Normal",
			"next": "List Paragraph"
		},
		{
			"name": "Body Text Indent",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 14.149999618530274,
				"afterSpacing": 6,
				"listFormat": {}
			},
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Normal",
			"link": "Body Text Indent Char",
			"next": "Body Text Indent"
		},
		{
			"name": "Body Text Indent Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 12,
				"fontColor": "#00000000",
				"fontSizeBidi": 12
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "apple-style-span",
			"type": "Character",
			"characterFormat": {
				"fontColor": "#00000000"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "x_msonormal",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 5,
				"afterSpacing": 5,
				"listFormat": {}
			},
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Normal",
			"next": "x_msonormal"
		},
		{
			"name": "apple-converted-space",
			"type": "Character",
			"characterFormat": {
				"fontColor": "#00000000"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "x_estilo19",
			"type": "Character",
			"characterFormat": {
				"fontColor": "#00000000"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "x_estilo2",
			"type": "Character",
			"characterFormat": {
				"fontColor": "#00000000"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Footnote Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 10,
				"fontColor": "empty",
				"fontSizeBidi": 10
			},
			"basedOn": "Normal",
			"link": "Footnote Text Char",
			"next": "Footnote Text"
		},
		{
			"name": "Footnote Text Char",
			"type": "Character",
			"characterFormat": {
				"fontColor": "#00000000"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Footnote Reference",
			"type": "Character",
			"characterFormat": {
				"baselineAlignment": "Superscript",
				"fontColor": "#00000000"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "eacep1",
			"type": "Character",
			"characterFormat": {
				"fontColor": "#000000FF"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Default",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Calibri",
				"fontColor": "#000000FF",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Calibri"
			},
			"next": "Default"
		},
		{
			"name": "Body Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 6,
				"lineSpacing": 1.149999976158142,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Normal",
			"link": "Body Text Char",
			"next": "Body Text"
		},
		{
			"name": "Body Text Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 11,
				"fontFamily": "Calibri",
				"fontColor": "#00000000",
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Table Paragraph",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Arial",
				"fontColor": "empty",
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "Table Paragraph"
		},
		{
			"name": "Hipervínculo1",
			"type": "Character",
			"characterFormat": {
				"underline": "Single",
				"fontColor": "#0000FFFF"
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
}
describe('Zorder Validation', () => {
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
        editor.open(JSON.stringify(shapeSquareJson));
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
    it('Zorder Validation', () => {
        json = editor.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(obj);
        (editor.wordExportModule as any).section = (editor.wordExportModule as any).document.sections[0];
        let block: any = json.sections[0].blocks[0].inlines[0];
        expect(block.zOrderPosition).toBeGreaterThanOrEqual(0);
    });
});
describe('Header with track changes Validation', () => {
    let editor: DocumentEditor;
    let writer: XmlWriter;
    let json: any;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport, SfdtExport);
        editor = new DocumentEditor({ enableWordExport: true, enableSfdtExport: true, enableEditor: true, isReadOnly: false, enableSelection: true, enableTrackChanges: true });
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
        writer.destroy();
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('header Validation', () => {
        editor.selection.goToHeader();
        editor.editor.insertText('one');
        expect(() => { editor.save('header', 'Docx'); }).not.toThrowError();
    });
    it('header Table Validation', () => {
        editor.selection.goToHeader();
        editor.editor.insertTable(2,2);
        editor.editor.insertText('one');
        expect(() => { editor.save('headerTable', 'Docx'); }).not.toThrowError();
    });
});