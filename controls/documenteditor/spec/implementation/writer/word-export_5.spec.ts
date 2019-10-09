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
describe('Word export module with row span validation', () => {
    let editor: DocumentEditor;
    let writer: XmlWriter;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport);
        editor = new DocumentEditor({ enableWordExport: true, enableEditor: true, isReadOnly: false, enableSelection: true });
        editor.acceptTab = true;
        editor.characterFormat = {
            fontSize: 12
        };
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
});