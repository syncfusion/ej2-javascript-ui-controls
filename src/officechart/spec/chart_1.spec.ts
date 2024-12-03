import { ChartComponent } from '../src/office-chart/chart';
import { createElement } from '@syncfusion/ej2-base';
/**
 * Office Chart spec
 */
describe('bubble chart _1', () => {
    let chartObj: ChartComponent;

    beforeAll(() => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(elem);
        chartObj = new ChartComponent();
        chartObj.chartRender(getJson());
        chartObj.chart.appendTo('#container');

    });

    afterAll((): void => {
        chartObj.destroy();
        document.body.removeChild(document.getElementById('container'));
    });
    it('Rendering bubble charts', () => {
        let chartData: any = getJson();
        chartObj.chartRender(chartData);
    });
    function getJson(): any {
        let json: any = {
            "chartCategory": [
                {
                    "chartData": [
                        {
                            "yValue": 2,
                            "size": 10
                        }
                    ],
                    "categoryXName": "1"
                },
                {
                    "chartData": [
                        {
                            "yValue": 3,
                            "size": 4
                        }
                    ],
                    "categoryXName": "2"
                },
                {
                    "chartData": [
                        {
                            "yValue": 1,
                            "size": 8
                        }
                    ],
                    "categoryXName": "3"
                }
            ],
            "chartSeries": [
                {
                    "seriesName": "Y-Values",
                    "dataLabel": {
                        "position": "Center",
                        "fontName": "+mn-lt",
                        "fontColor": "404040",
                        "fontSize": 9,
                        "isLegendKey": false,
                        "isBubbleSize": false,
                        "isCategoryName": false,
                        "isSeriesName": false,
                        "isValue": true,
                        "isPercentage": false,
                        "isLeaderLines": false
                    },
                    "seriesFormat": {
                        "fill": {
                            "foreColor": "#4472C4FF",
                            "rgb": "#4472C4FF"
                        },
                        "markerSize": 0
                    },
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "ff4472c4",
                                "rgb": "#4472C4"
                            },
                            "line": {
                                "color": "#000000"
                            }
                        }
                    ]
                }
            ],
            "chartArea": {
                "foreColor": "#FFFFFFFF"
            },
            "chartTitleArea": {
                "layout": {
                    "layoutX": 0,
                    "layoutY": 0
                },
                "fontName": "+mn-lt",
                "fontSize": 14,
                "dataFormat": {
                    "id": 0,
                    "fill": {
                        "foreColor": "000000",
                        "rgb": "#000000"
                    },
                    "line": {
                        "color": "000000",
                        "rgb": "#000000"
                    }
                }
            },
            "plotArea": {
                "foreColor": "#000000FF"
            },
            "chartLegend": {
                "position": null,
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": null,
                    "fontSize": 0,
                    "dataFormat": {
                        "id": 0,
                        "fill": {},
                        "line": {}
                    }
                }
            },
            "chartPrimaryCategoryAxis": {
                "chartTitle": "Axis",
                "fontSize": 9,
                "fontName": "+mn-lt",
                "categoryType": "Automatic",
                "numberFormat": "General",
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": "+mn-lt",
                    "fontSize": 10,
                    "dataFormat": {
                        "id": 0,
                        "fill": {
                            "foreColor": "000000",
                            "rgb": "#000000"
                        },
                        "line": {
                            "color": "000000",
                            "rgb": "#000000"
                        }
                    }
                },
                "minimumValue": 0.5,
                "maximumValue": 3.5,
                "majorUnit": 1,
                "hasMajorGridLines": true,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartPrimaryValueAxis": {
                "chartTitle": "Axis",
                "fontSize": 9,
                "fontName": "+mn-lt",
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": "+mn-lt",
                    "fontSize": 10,
                    "dataFormat": {
                        "id": 0,
                        "fill": {
                            "foreColor": "000000",
                            "rgb": "#000000"
                        },
                        "line": {
                            "color": "000000",
                            "rgb": "#000000"
                        }
                    }
                },
                "minimumValue": 0.5,
                "maximumValue": 4,
                "isAutoMajor": false,
                "majorUnit": 1,
                "hasMajorGridLines": true,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartTitle": "Y-Values",
            "chartType": "Bubble",
            "height": 252,
            "width": 432,
            "gapWidth": 0,
            "overlap": 0,
            "chartDataTable": null
        };
        return json;
    }
});

describe(' Pie chart 2', () => {
    let chartObj: ChartComponent;

    beforeAll(() => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(elem);
        chartObj = new ChartComponent();
        chartObj.chartRender(getJson());
        chartObj.chart.appendTo('#container');

    });

    afterAll((): void => {
        chartObj.destroy();
        document.body.removeChild(document.getElementById('container'));
    });
    it('Rendering Pie charts', () => {
        let chartData: any = getJson();
        chartObj.chartRender(chartData);
    });
    function getJson(): any {
        let json: any = {
            "chartCategory": [
                {
                    "chartData": [
                        {
                            "yValue": 8.2
                        }
                    ],
                    "categoryXName": "1st Qtr"
                },
                {
                    "chartData": [
                        {
                            "yValue": 3.2
                        }
                    ],
                    "categoryXName": "2nd Qtr"
                },
                {
                    "chartData": [
                        {
                            "yValue": 1.4
                        }
                    ],
                    "categoryXName": "3rd Qtr"
                },
                {
                    "chartData": [
                        {
                            "yValue": 1.2
                        }
                    ],
                    "categoryXName": "4th Qtr"
                }
            ],
            "chartSeries": [
                {
                    "seriesName": "Sales",
                    "seriesFormat": {
                        "fill": {
                            "foreColor": "#4472C4FF",
                            "rgb": "#4472C4FF"
                        },
                        "markerSize": 0
                    },
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "ffd668",
                                "rgb": "#ffd668"
                            },
                            "line": {
                                "color": "ffffff",
                                "rgb": "#ffffff"
                            }
                        },
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "4472c4",
                                "rgb": "#4472c4"
                            },
                            "line": {
                                "color": "ffffff",
                                "rgb": "#ffffff"
                            }
                        },
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "ed7d31",
                                "rgb": "#ed7d31"
                            },
                            "line": {
                                "color": "ffffff",
                                "rgb": "#ffffff"
                            }
                        },
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "7030a0",
                                "rgb": "#7030a0"
                            },
                            "line": {
                                "color": "ffffff",
                                "rgb": "#ffffff"
                            }
                        }
                    ]
                }
            ],
            "chartArea": {
                "foreColor": "#FFFFFFFF"
            },
            "chartTitleArea": {
                "layout": {
                    "layoutX": 0,
                    "layoutY": 0
                },
                "fontName": "+mn-lt",
                "fontSize": 14,
                "dataFormat": {
                    "id": 0,
                    "fill": {
                        "foreColor": "000000",
                        "rgb": "#000000"
                    },
                    "line": {
                        "color": "000000",
                        "rgb": "#000000"
                    }
                }
            },
            "plotArea": {
                "foreColor": "#000000FF"
            },
            "chartLegend": {
                "position": "Bottom",
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": "+mn-lt",
                    "fontSize": 9,
                    "dataFormat": {
                        "id": 0,
                        "fill": {
                            "foreColor": "000000",
                            "rgb": "#000000"
                        },
                        "line": {
                            "color": "808080",
                            "rgb": "#808080"
                        }
                    }
                }
            },
            "chartPrimaryCategoryAxis": {
                "chartTitle": null,
                "fontSize": 11,
                "fontName": "Calibri",
                "categoryType": "Automatic",
                "numberFormat": "General",
                "minimumValue": 0,
                "maximumValue": 0,
                "majorUnit": 0,
                "hasMajorGridLines": false,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_Outside",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartPrimaryValueAxis": {
                "chartTitle": null,
                "fontSize": 11,
                "fontName": "Calibri",
                "minimumValue": 0,
                "maximumValue": 0,
                "isAutoMajor": true,
                "majorUnit": 5,
                "hasMajorGridLines": false,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_Outside",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartTitle": "Sales",
            "chartType": "Pie",
            "height": 252,
            "width": 432,
            "gapWidth": 0,
            "overlap": 0,
            "chartDataTable": null
        };
        return json;
    }
});

describe('Doughnut chart 3', () => {
    let chartObj: ChartComponent;

    beforeAll(() => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(elem);
        chartObj = new ChartComponent();
        chartObj.chartRender(getJson());
        chartObj.chart.appendTo('#container');

    });

    afterAll((): void => {
        chartObj.destroy();
        document.body.removeChild(document.getElementById('container'));
    });
    it('Rendering Doughnut charts', () => {
        let chartData: any = getJson();
        chartObj.chartRender(chartData);
    });
    function getJson(): any {
        let json: any = {
            "chartCategory": [
                {
                    "chartData": [
                        {
                            "yValue": 8.2
                        }
                    ],
                    "categoryXName": "1st Qtr"
                },
                {
                    "chartData": [
                        {
                            "yValue": 3.2
                        }
                    ],
                    "categoryXName": "2nd Qtr"
                },
                {
                    "chartData": [
                        {
                            "yValue": 1.4
                        }
                    ],
                    "categoryXName": "3rd Qtr"
                },
                {
                    "chartData": [
                        {
                            "yValue": 1.2
                        }
                    ],
                    "categoryXName": "4th Qtr"
                }
            ],
            "chartSeries": [
                {
                    "seriesName": "Sales",
                    "dataLabel": {
                        "position": "Automatic",
                        "fontName": "+mn-lt",
                        "fontColor": "595959",
                        "fontSize": 9,
                        "isLegendKey": false,
                        "isBubbleSize": false,
                        "isCategoryName": true,
                        "isSeriesName": false,
                        "isValue": true,
                        "isPercentage": true,
                        "isLeaderLines": false
                    },
                    "seriesFormat": {
                        "fill": {
                            "foreColor": "#000000FF",
                            "rgb": "#000000FF"
                        },
                        "markerSize": 0
                    },
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "4472c4",
                                "rgb": "#4472c4"
                            },
                            "line": {
                                "color": "ffffff",
                                "rgb": "#ffffff"
                            }
                        },
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "ed7d31",
                                "rgb": "#ed7d31"
                            },
                            "line": {
                                "color": "ffffff",
                                "rgb": "#ffffff"
                            }
                        },
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "a5a5a5",
                                "rgb": "#a5a5a5"
                            },
                            "line": {
                                "color": "ffffff",
                                "rgb": "#ffffff"
                            }
                        },
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "ffc000",
                                "rgb": "#ffc000"
                            },
                            "line": {
                                "color": "ffffff",
                                "rgb": "#ffffff"
                            }
                        }
                    ],
                    "firstSliceAngle": 5,
                    "holeSize": 75
                }
            ],
            "chartArea": {
                "foreColor": "#FFFFFFFF"
            },
            "chartTitleArea": {
                "layout": {
                    "layoutX": 0,
                    "layoutY": 0
                },
                "fontName": "+mn-lt",
                "fontSize": 14,
                "dataFormat": {
                    "id": 0,
                    "fill": {
                        "foreColor": "000000",
                        "rgb": "#000000"
                    },
                    "line": {
                        "color": "000000",
                        "rgb": "#000000"
                    }
                }
            },
            "plotArea": {
                "foreColor": "#000000FF"
            },
            "chartLegend": {
                "position": "Bottom",
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": "+mn-lt",
                    "fontSize": 9,
                    "dataFormat": {
                        "id": 0,
                        "fill": {
                            "foreColor": "000000",
                            "rgb": "#000000"
                        },
                        "line": {
                            "color": "808080",
                            "rgb": "#808080"
                        }
                    }
                }
            },
            "chartPrimaryCategoryAxis": {
                "chartTitle": null,
                "fontSize": 11,
                "fontName": "Calibri",
                "categoryType": "Automatic",
                "numberFormat": "General",
                "minimumValue": 0,
                "maximumValue": 0,
                "majorUnit": 0,
                "hasMajorGridLines": false,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_Outside",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartPrimaryValueAxis": {
                "chartTitle": null,
                "fontSize": 11,
                "fontName": "Calibri",
                "minimumValue": 0,
                "maximumValue": 0,
                "isAutoMajor": true,
                "majorUnit": 0,
                "hasMajorGridLines": false,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_Outside",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartTitle": "Sales",
            "chartType": "Doughnut",
            "height": 252,
            "width": 432,
            "gapWidth": 0,
            "overlap": 0,
            "chartDataTable": null
        };
        return json;
    }
});

describe('Column clustered', () => {
    let chartObj: ChartComponent;

    beforeAll(() => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(elem);
        chartObj = new ChartComponent();
        chartObj.chartRender(getJson());
        chartObj.chart.appendTo('#container');

    });

    afterAll((): void => {
        chartObj.destroy();
        document.body.removeChild(document.getElementById('container'));
    });
    it('Rendering Column clustered charts', () => {
        let chartData: any = getJson();
        chartObj.chartRender(chartData);
    });
    function getJson(): any {
        let json: any = {
            "chartCategory": [
                {
                    "chartData": [
                        {
                            "yValue": 4.3
                        },
                        {
                            "yValue": 2.4
                        },
                        {
                            "yValue": 2
                        }
                    ],
                    "categoryXName": "Category 1"
                },
                {
                    "chartData": [
                        {
                            "yValue": 2.5
                        },
                        {
                            "yValue": 4.4
                        },
                        {
                            "yValue": 2
                        }
                    ],
                    "categoryXName": "Category 2"
                },
                {
                    "chartData": [
                        {
                            "yValue": 3.5
                        },
                        {
                            "yValue": 1.8
                        },
                        {
                            "yValue": 3
                        }
                    ],
                    "categoryXName": "Category 3"
                },
                {
                    "chartData": [
                        {
                            "yValue": 4.5
                        },
                        {
                            "yValue": 2.8
                        },
                        {
                            "yValue": 5
                        }
                    ],
                    "categoryXName": "Category 4"
                }
            ],
            "chartSeries": [
                {
                    "seriesName": "Series 1",
                    "seriesFormat": {
                        "fill": {
                            "foreColor": "#4472C4FF",
                            "rgb": "#4472C4FF"
                        },
                        "markerSize": 0
                    },
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "ff4472c4",
                                "rgb": "#4472C4"
                            },
                            "line": {
                                "color": "#000000"
                            }
                        }
                    ]
                },
                {
                    "seriesName": "Series 2",
                    "seriesFormat": {
                        "fill": {
                            "foreColor": "#ED7D31FF",
                            "rgb": "#ED7D31FF"
                        },
                        "markerSize": 0
                    },
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "ffed7d31",
                                "rgb": "#ED7D31"
                            },
                            "line": {
                                "color": "#000000"
                            }
                        }
                    ]
                },
                {
                    "seriesName": "Series 3",
                    "seriesFormat": {
                        "fill": {
                            "foreColor": "#A5A5A5FF",
                            "rgb": "#A5A5A5FF"
                        },
                        "markerSize": 0
                    },
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "ffa5a5a5",
                                "rgb": "#A5A5A5"
                            },
                            "line": {
                                "color": "#000000"
                            }
                        }
                    ]
                }
            ],
            "chartArea": {
                "foreColor": "#FFFFFFFF"
            },
            "chartTitleArea": {
                "layout": {
                    "layoutX": 0,
                    "layoutY": 0
                },
                "fontName": "+mn-lt",
                "fontSize": 14,
                "dataFormat": {
                    "id": 0,
                    "fill": {
                        "foreColor": "000000",
                        "rgb": "#000000"
                    },
                    "line": {
                        "color": "000000",
                        "rgb": "#000000"
                    }
                }
            },
            "plotArea": {
                "foreColor": "#000000FF"
            },
            "chartLegend": {
                "position": "Bottom",
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": "+mn-lt",
                    "fontSize": 9,
                    "dataFormat": {
                        "id": 0,
                        "fill": {
                            "foreColor": "000000",
                            "rgb": "#000000"
                        },
                        "line": {
                            "color": "808080",
                            "rgb": "#808080"
                        }
                    }
                }
            },
            "chartPrimaryCategoryAxis": {
                "chartTitle": null,
                "fontSize": 9,
                "fontName": "+mn-lt",
                "categoryType": "Automatic",
                "numberFormat": "General",
                "minimumValue": 0,
                "maximumValue": 0,
                "majorUnit": 0,
                "hasMajorGridLines": false,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartPrimaryValueAxis": {
                "chartTitle": null,
                "fontSize": 9,
                "fontName": "+mn-lt",
                "minimumValue": 0,
                "maximumValue": 0,
                "isAutoMajor": true,
                "majorUnit": 1,
                "hasMajorGridLines": true,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartTitle": "Chart Title",
            "chartType": "Column_Clustered",
            "height": 252,
            "width": 432,
            "gapWidth": 219,
            "overlap": -27,
            "chartDataTable": null
        };
        return json;
    }
});
describe('Area chart 5', () => {
    let chartObj: ChartComponent;

    beforeAll(() => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(elem);
        chartObj = new ChartComponent();
        chartObj.chartRender(getJson());
        chartObj.chart.appendTo('#container');

    });

    afterAll((): void => {
        chartObj.destroy();
        document.body.removeChild(document.getElementById('container'));
    });
    it('Rendering Area charts', () => {
        let chartData: any = getJson();
        chartObj.chartRender(chartData);
    });
    function getJson(): any {
        let json: any = {
            "chartCategory": [
                {
                    "chartData": [
                        {
                            "yValue": 32
                        },
                        {
                            "yValue": 12
                        }
                    ],
                    "categoryXName": " "
                },
                {
                    "chartData": [
                        {
                            "yValue": 32
                        },
                        {
                            "yValue": 12
                        }
                    ],
                    "categoryXName": "  "
                },
                {
                    "chartData": [
                        {
                            "yValue": 28
                        },
                        {
                            "yValue": 12
                        }
                    ],
                    "categoryXName": "    "
                },
                {
                    "chartData": [
                        {
                            "yValue": 12
                        },
                        {
                            "yValue": 21
                        }
                    ],
                    "categoryXName": "        "
                },
                {
                    "chartData": [
                        {
                            "yValue": 15
                        },
                        {
                            "yValue": 28
                        }
                    ],
                    "categoryXName": "                "
                }
            ],
            "chartSeries": [
                {
                    "seriesName": "Series 1",
                    "seriesFormat": {
                        "fill": {
                            "foreColor": "#4472C4FF",
                            "rgb": "#4472C4FF"
                        },
                        "markerSize": 0
                    },
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "ff4472c4",
                                "rgb": "#4472C4"
                            },
                            "line": {
                                "color": "#000000"
                            }
                        }
                    ]
                },
                {
                    "seriesName": "Series 2",
                    "seriesFormat": {
                        "fill": {
                            "foreColor": "#ED7D31FF",
                            "rgb": "#ED7D31FF"
                        },
                        "markerSize": 0
                    },
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "ffed7d31",
                                "rgb": "#ED7D31"
                            },
                            "line": {
                                "color": "#000000"
                            }
                        }
                    ]
                }
            ],
            "chartArea": {
                "foreColor": "#FFFFFFFF"
            },
            "chartTitleArea": {
                "layout": {
                    "layoutX": 0,
                    "layoutY": 0
                },
                "fontName": "+mn-lt",
                "fontSize": 14,
                "dataFormat": {
                    "id": 0,
                    "fill": {
                        "foreColor": "000000",
                        "rgb": "#000000"
                    },
                    "line": {
                        "color": "000000",
                        "rgb": "#000000"
                    }
                }
            },
            "plotArea": {
                "foreColor": "#000000FF"
            },
            "chartLegend": {
                "position": "Bottom",
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": "+mn-lt",
                    "fontSize": 9,
                    "dataFormat": {
                        "id": 0,
                        "fill": {
                            "foreColor": "000000",
                            "rgb": "#000000"
                        },
                        "line": {
                            "color": "808080",
                            "rgb": "#808080"
                        }
                    }
                }
            },
            "chartPrimaryCategoryAxis": {
                "chartTitle": null,
                "fontSize": 9,
                "fontName": "+mn-lt",
                "categoryType": "Time",
                "numberFormat": "m/d/yyyy",
                "minimumValue": 0,
                "maximumValue": 0,
                "majorUnit": 0,
                "hasMajorGridLines": false,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_Outside",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartPrimaryValueAxis": {
                "chartTitle": null,
                "fontSize": 9,
                "fontName": "+mn-lt",
                "minimumValue": 0,
                "maximumValue": 0,
                "isAutoMajor": true,
                "majorUnit": 5,
                "hasMajorGridLines": true,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartTitle": "Chart Title",
            "chartType": "Area",
            "height": 252,
            "width": 432,
            "gapWidth": 0,
            "overlap": 0,
            "chartDataTable": null
        };
        return json;
    }
});
describe('scatters markers', () => {
    let chartObj: ChartComponent;

    beforeAll(() => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(elem);
        chartObj = new ChartComponent();
        chartObj.chartRender(getJson());
        chartObj.chart.appendTo('#container');

    });

    afterAll((): void => {
        chartObj.destroy();
        document.body.removeChild(document.getElementById('container'));
    });
    it('Rendering scatters markers charts', () => {
        let chartData: any = getJson();
        chartObj.chartRender(chartData);
    });
    function getJson(): any {
        let json: any = {
            "chartCategory": [
                {
                    "chartData": [
                        {
                            "yValue": 2.7
                        }
                    ],
                    "categoryXName": "0.7"
                },
                {
                    "chartData": [
                        {
                            "yValue": 3.2
                        }
                    ],
                    "categoryXName": "1.8"
                },
                {
                    "chartData": [
                        {
                            "yValue": 0.8
                        }
                    ],
                    "categoryXName": "2.6"
                }
            ],
            "chartSeries": [
                {
                    "seriesName": "Y-Values",
                    "seriesFormat": {
                        "fill": {
                            "foreColor": "#000000FF",
                            "rgb": "#000000FF"
                        },
                        "markerSize": 0
                    },
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "4f81be",
                                "rgb": "#4f81be"
                            },
                            "line": {
                                "color": "4f81be",
                                "rgb": "#4f81be"
                            }
                        }
                    ]
                }
            ],
            "chartArea": {
                "foreColor": "#FFFFFFFF"
            },
            "chartTitleArea": {
                "layout": {
                    "layoutX": 0,
                    "layoutY": 0
                },
                "fontName": "+mn-lt",
                "fontSize": 14,
                "dataFormat": {
                    "id": 0,
                    "fill": {
                        "foreColor": "000000",
                        "rgb": "#000000"
                    },
                    "line": {
                        "color": "000000",
                        "rgb": "#000000"
                    }
                }
            },
            "plotArea": {
                "foreColor": "#000000FF"
            },
            "chartLegend": {
                "position": null,
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": null,
                    "fontSize": 0,
                    "dataFormat": {
                        "id": 0,
                        "fill": {},
                        "line": {}
                    }
                }
            },
            "chartPrimaryCategoryAxis": {
                "chartTitle": null,
                "fontSize": 9,
                "fontName": "+mn-lt",
                "categoryType": "Automatic",
                "numberFormat": "General",
                "minimumValue": 0,
                "maximumValue": 0,
                "majorUnit": 0,
                "hasMajorGridLines": true,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartPrimaryValueAxis": {
                "chartTitle": null,
                "fontSize": 9,
                "fontName": "+mn-lt",
                "minimumValue": 0,
                "maximumValue": 0,
                "isAutoMajor": true,
                "majorUnit": 0.5,
                "hasMajorGridLines": true,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartTitle": "Y-Values",
            "chartType": "Scatter_Markers",
            "height": 252,
            "width": 432,
            "gapWidth": 0,
            "overlap": 0,
            "chartDataTable": null
        };
        return json;
    }
});

describe('bar clustered chart 7', () => {
    let chartObj: ChartComponent;

    beforeAll(() => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(elem);
        chartObj = new ChartComponent();
        chartObj.chartRender(getJson());
        chartObj.chart.appendTo('#container');

    });

    afterAll((): void => {
        chartObj.destroy();
        document.body.removeChild(document.getElementById('container'));
    });
    it('Rendering bar clustered chart charts', () => {
        let chartData: any = getJson();
        chartObj.chartRender(chartData);
    });
    function getJson(): any {
        let json: any = {
            "chartCategory": [
                {
                    "chartData": [
                        {
                            "yValue": 4.3
                        },
                        {
                            "yValue": 2.4
                        },
                        {
                            "yValue": 2
                        }
                    ],
                    "categoryXName": "Category 1"
                },
                {
                    "chartData": [
                        {
                            "yValue": 2.5
                        },
                        {
                            "yValue": 4.4
                        },
                        {
                            "yValue": 2
                        }
                    ],
                    "categoryXName": "Category 2"
                },
                {
                    "chartData": [
                        {
                            "yValue": 3.5
                        },
                        {
                            "yValue": 1.8
                        },
                        {
                            "yValue": 3
                        }
                    ],
                    "categoryXName": "Category 3"
                },
                {
                    "chartData": [
                        {
                            "yValue": 4.5
                        },
                        {
                            "yValue": 2.8
                        },
                        {
                            "yValue": 5
                        }
                    ],
                    "categoryXName": "Category 4"
                }
            ],
            "chartSeries": [
                {
                    "seriesName": "Series 1",
                    "seriesFormat": {
                        "fill": {
                            "foreColor": "#5B9BD5FF",
                            "rgb": "#5B9BD5FF"
                        },
                        "markerSize": 0
                    },
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "ff5b9bd5",
                                "rgb": "#5B9BD5"
                            },
                            "line": {
                                "color": "#000000"
                            }
                        }
                    ]
                },
                {
                    "seriesName": "Series 2",
                    "seriesFormat": {
                        "fill": {
                            "foreColor": "#ED7D31FF",
                            "rgb": "#ED7D31FF"
                        },
                        "markerSize": 0
                    },
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "ffed7d31",
                                "rgb": "#ED7D31"
                            },
                            "line": {
                                "color": "#000000"
                            }
                        }
                    ]
                },
                {
                    "seriesName": "Series 3",
                    "seriesFormat": {
                        "fill": {
                            "foreColor": "#A5A5A5FF",
                            "rgb": "#A5A5A5FF"
                        },
                        "markerSize": 0
                    },
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "ffa5a5a5",
                                "rgb": "#A5A5A5"
                            },
                            "line": {
                                "color": "#000000"
                            }
                        }
                    ]
                }
            ],
            "chartArea": {
                "foreColor": "#FFFFFFFF"
            },
            "chartTitleArea": {
                "layout": {
                    "layoutX": 0,
                    "layoutY": 0
                },
                "fontName": "+mn-lt",
                "fontSize": 14,
                "dataFormat": {
                    "id": 0,
                    "fill": {
                        "foreColor": "000000",
                        "rgb": "#000000"
                    },
                    "line": {
                        "color": "000000",
                        "rgb": "#000000"
                    }
                }
            },
            "plotArea": {
                "foreColor": "#000000FF"
            },
            "chartLegend": {
                "position": "Bottom",
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": "+mn-lt",
                    "fontSize": 9,
                    "dataFormat": {
                        "id": 0,
                        "fill": {
                            "foreColor": "000000",
                            "rgb": "#000000"
                        },
                        "line": {
                            "color": "808080",
                            "rgb": "#808080"
                        }
                    }
                }
            },
            "chartPrimaryCategoryAxis": {
                "chartTitle": null,
                "fontSize": 9,
                "fontName": "+mn-lt",
                "categoryType": "Automatic",
                "numberFormat": "General",
                "minimumValue": 0,
                "maximumValue": 0,
                "majorUnit": 0,
                "hasMajorGridLines": false,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartPrimaryValueAxis": {
                "chartTitle": null,
                "fontSize": 9,
                "fontName": "+mn-lt",
                "minimumValue": 0,
                "maximumValue": 0,
                "isAutoMajor": true,
                "majorUnit": 1,
                "hasMajorGridLines": true,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartTitle": "Chart Title",
            "chartType": "Bar_Clustered",
            "height": 252,
            "width": 432,
            "gapWidth": 182,
            "overlap": 0,
            "chartDataTable": null
        };
        return json;
    }
});


describe('Line chart', () => {
    let chartObj: ChartComponent;

    beforeAll(() => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(elem);
        chartObj = new ChartComponent();
        chartObj.chartRender(getJson());
        chartObj.chart.appendTo('#container');

    });

    afterAll((): void => {
        chartObj.destroy();
        document.body.removeChild(document.getElementById('container'));
    });
    it('Rendering Line charts', () => {
        let chartData: any = getJson();
        chartObj.chartRender(chartData);
    });
    function getJson(): any {
        let json: any = {
            "chartCategory": [
                {
                    "chartData": [
                        {
                            "yValue": 4.3
                        },
                        {
                            "yValue": 2.4
                        },
                        {
                            "yValue": 2
                        }
                    ],
                    "categoryXName": "Category 1"
                },
                {
                    "chartData": [
                        {
                            "yValue": 2.5
                        },
                        {
                            "yValue": 4.4
                        },
                        {
                            "yValue": 2
                        }
                    ],
                    "categoryXName": "Category 2"
                },
                {
                    "chartData": [
                        {
                            "yValue": 3.5
                        },
                        {
                            "yValue": 1.8
                        },
                        {
                            "yValue": 3
                        }
                    ],
                    "categoryXName": "Category 3"
                },
                {
                    "chartData": [
                        {
                            "yValue": 4.5
                        },
                        {
                            "yValue": 2.8
                        },
                        {
                            "yValue": 5
                        }
                    ],
                    "categoryXName": "Category 4"
                }
            ],
            "chartSeries": [
                {
                    "seriesName": "Series 1",
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "4f81be",
                                "rgb": "#4f81be"
                            },
                            "line": {
                                "color": "4f81be",
                                "rgb": "#4f81be"
                            }
                        }
                    ]
                },
                {
                    "seriesName": "Series 2",
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "c0504e",
                                "rgb": "#c0504e"
                            },
                            "line": {
                                "color": "c0504e",
                                "rgb": "#c0504e"
                            }
                        }
                    ]
                },
                {
                    "seriesName": "Series 3",
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "9dbc59",
                                "rgb": "#9dbc59"
                            },
                            "line": {
                                "color": "9dbc59",
                                "rgb": "#9dbc59"
                            }
                        }
                    ]
                }
            ],
            "chartArea": {
                "foreColor": "#000000FF"
            },
            "chartTitleArea": {
                "layout": {
                    "layoutX": 0,
                    "layoutY": 0
                },
                "fontName": "+mn-lt",
                "fontSize": 16,
                "dataFormat": {
                    "id": 0,
                    "fill": {
                        "foreColor": "000000",
                        "rgb": "#000000"
                    },
                    "line": {
                        "color": "000000",
                        "rgb": "#000000"
                    }
                }
            },
            "plotArea": {
                "foreColor": "#000000FF"
            },
            "chartLegend": {
                "position": "Bottom",
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": "+mn-lt",
                    "fontSize": 9,
                    "dataFormat": {
                        "id": 0,
                        "fill": {
                            "foreColor": "000000",
                            "rgb": "#000000"
                        },
                        "line": {
                            "color": "808080",
                            "rgb": "#808080"
                        }
                    }
                }
            },
            "chartPrimaryCategoryAxis": {
                "chartTitle": null,
                "fontSize": 9,
                "fontName": "+mn-lt",
                "categoryType": "Automatic",
                "numberFormat": "General",
                "minimumValue": 0,
                "maximumValue": 0,
                "majorUnit": 0,
                "hasMajorGridLines": false,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartPrimaryValueAxis": {
                "chartTitle": null,
                "fontSize": 9,
                "fontName": "+mn-lt",
                "minimumValue": 0,
                "maximumValue": 0,
                "isAutoMajor": true,
                "majorUnit": 1,
                "hasMajorGridLines": true,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartTitle": "Chart Title",
            "chartType": "Line",
            "height": 252,
            "width": 432,
            "gapWidth": 0,
            "overlap": 0,
            "chartDataTable": null
        };
        return json;
    }
});



describe('Line stacked chart', () => {
    let chartObj: ChartComponent;

    beforeAll(() => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(elem);
        chartObj = new ChartComponent();
        chartObj.chartRender(getJson());
        chartObj.chart.appendTo('#container');

    });

    afterAll((): void => {
        chartObj.destroy();
        document.body.removeChild(document.getElementById('container'));
    });
    it('Rendering Line stacked charts', () => {
        let chartData: any = getJson();
        chartObj.chartRender(chartData);
    });
    function getJson(): any {
        let json: any = {
            "chartCategory": [
                {
                    "chartData": [
                        {
                            "yValue": 4.3
                        },
                        {
                            "yValue": 2.4
                        },
                        {
                            "yValue": 2
                        }
                    ],
                    "categoryXName": "Category 1"
                },
                {
                    "chartData": [
                        {
                            "yValue": 2.5
                        },
                        {
                            "yValue": 4.4
                        },
                        {
                            "yValue": 2
                        }
                    ],
                    "categoryXName": "Category 2"
                },
                {
                    "chartData": [
                        {
                            "yValue": 3.5
                        },
                        {
                            "yValue": 1.8
                        },
                        {
                            "yValue": 3
                        }
                    ],
                    "categoryXName": "Category 3"
                },
                {
                    "chartData": [
                        {
                            "yValue": 4.5
                        },
                        {
                            "yValue": 2.8
                        },
                        {
                            "yValue": 5
                        }
                    ],
                    "categoryXName": "Category 4"
                }
            ],
            "chartSeries": [
                {
                    "seriesName": "Series 1",
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "4f81be",
                                "rgb": "#4f81be"
                            },
                            "line": {
                                "color": "4f81be",
                                "rgb": "#4f81be"
                            }
                        }
                    ]
                },
                {
                    "seriesName": "Series 2",
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "c0504e",
                                "rgb": "#c0504e"
                            },
                            "line": {
                                "color": "c0504e",
                                "rgb": "#c0504e"
                            }
                        }
                    ]
                },
                {
                    "seriesName": "Series 3",
                    "dataPoints": [
                        {
                            "id": 0,
                            "fill": {
                                "foreColor": "9dbc59",
                                "rgb": "#9dbc59"
                            },
                            "line": {
                                "color": "9dbc59",
                                "rgb": "#9dbc59"
                            }
                        }
                    ]
                }
            ],
            "chartArea": {
                "foreColor": "#FFFFFFFF"
            },
            "chartTitleArea": {
                "layout": {
                    "layoutX": 0,
                    "layoutY": 0
                },
                "fontName": "+mn-lt",
                "fontSize": 14,
                "dataFormat": {
                    "id": 0,
                    "fill": {
                        "foreColor": "000000",
                        "rgb": "#000000"
                    },
                    "line": {
                        "color": "000000",
                        "rgb": "#000000"
                    }
                }
            },
            "plotArea": {
                "foreColor": "#000000FF"
            },
            "chartLegend": {
                "position": "Bottom",
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": "+mn-lt",
                    "fontSize": 9,
                    "dataFormat": {
                        "id": 0,
                        "fill": {
                            "foreColor": "000000",
                            "rgb": "#000000"
                        },
                        "line": {
                            "color": "808080",
                            "rgb": "#808080"
                        }
                    }
                }
            },
            "chartPrimaryCategoryAxis": {
                "chartTitle": null,
                "fontSize": 9,
                "fontName": "+mn-lt",
                "categoryType": "Automatic",
                "numberFormat": "General",
                "minimumValue": 0,
                "maximumValue": 0,
                "majorUnit": 0,
                "hasMajorGridLines": false,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartPrimaryValueAxis": {
                "chartTitle": null,
                "fontSize": 9,
                "fontName": "+mn-lt",
                "minimumValue": 0,
                "maximumValue": 0,
                "isAutoMajor": true,
                "majorUnit": 2,
                "hasMajorGridLines": true,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartTitle": "Chart Title",
            "chartType": "Line_Stacked",
            "height": 252,
            "width": 432,
            "gapWidth": 0,
            "overlap": 0,
            "chartDataTable": null
        };
        return json;
    }
});


describe('Column stacked chart', () => {
    let chartObj: ChartComponent;

    beforeAll(() => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(elem);
        chartObj = new ChartComponent();
        chartObj.chartRender(getJson());
        chartObj.chart.appendTo('#container');

    });

    afterAll((): void => {
        chartObj.destroy();
        document.body.removeChild(document.getElementById('container'));
    });
    it('Rendering Column stacked charts', () => {
        let chartData: any = getJson();
        chartObj.chartRender(chartData);
    });
    function getJson(): any {
        let json: any = {
            "chartCategory": [
                {
                    "chartData": [
                        {
                            "yValue": 5
                        }
                    ],
                    "categoryXName": "High"
                },
                {
                    "chartData": [
                        {
                            "yValue": 4
                        }
                    ],
                    "categoryXName": "Medium-High"
                },
                {
                    "chartData": [
                        {
                            "yValue": 5
                        }
                    ],
                    "categoryXName": "Medium"
                },
                {
                    "chartData": [
                        {
                            "yValue": 3
                        }
                    ],
                    "categoryXName": "Low-Medium"
                },
                {
                    "chartData": [
                        {
                            "yValue": 1
                        }
                    ],
                    "categoryXName": "Low"
                }
            ],
            "chartSeries": [
                {
                    "seriesName": "Number of Systems",
                    "seriesFormat": {
                        "fill": {
                            "foreColor": "#334F7900",
                            "rgb": "#334F7900"
                        },
                        "markerSize": 0
                    },
                    "dataPoints": [
                        {
                            "id": 1,
                            "fill": {
                                "foreColor": "f86562",
                                "rgb": "#f86562"
                            },
                            "line": {
                                "color": "000000",
                                "rgb": "#000000"
                            }
                        },
                        {
                            "id": 2,
                            "fill": {
                                "foreColor": "afc6bf",
                                "rgb": "#afc6bf"
                            },
                            "line": {
                                "color": "000000",
                                "rgb": "#000000"
                            }
                        },
                        {
                            "id": 3,
                            "fill": {
                                "foreColor": "ffab5d",
                                "rgb": "#ffab5d"
                            },
                            "line": {
                                "color": "000000",
                                "rgb": "#000000"
                            }
                        },
                        {
                            "id": 4,
                            "fill": {
                                "foreColor": "c86a0e",
                                "rgb": "#c86a0e"
                            },
                            "line": {
                                "color": "000000",
                                "rgb": "#000000"
                            }
                        }
                    ]
                }
            ],
            "chartArea": {
                "foreColor": "#FFFFFFFF"
            },
            "chartTitleArea": {
                "layout": {
                    "layoutX": 0,
                    "layoutY": 0
                },
                "fontName": "+mn-lt",
                "fontSize": 14,
                "dataFormat": {
                    "id": 0,
                    "fill": {
                        "foreColor": "000000",
                        "rgb": "#000000"
                    },
                    "line": {
                        "color": "000000",
                        "rgb": "#000000"
                    }
                }
            },
            "plotArea": {
                "foreColor": "#000000FF"
            },
            "chartLegend": {
                "position": null,
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": null,
                    "fontSize": 0,
                    "dataFormat": {
                        "id": 0,
                        "fill": {},
                        "line": {}
                    }
                }
            },
            "chartPrimaryCategoryAxis": {
                "chartTitle": "Y Axis",
                "fontSize": 11,
                "fontName": "Calibri",
                "categoryType": "Automatic",
                "numberFormat": "General",
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": "Calibri",
                    "fontSize": 10,
                    "dataFormat": {
                        "id": 0,
                        "fill": {
                            "foreColor": "000000",
                            "rgb": "#000000"
                        },
                        "line": {
                            "color": "808080",
                            "rgb": "#808080"
                        }
                    }
                },
                "minimumValue": 0,
                "maximumValue": 0,
                "majorUnit": 0,
                "hasMajorGridLines": false,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartPrimaryValueAxis": {
                "chartTitle": "X Axis",
                "fontSize": 11,
                "fontName": "Calibri",
                "chartTitleArea": {
                    "layout": {
                        "layoutX": 0,
                        "layoutY": 0
                    },
                    "fontName": "Calibri",
                    "fontSize": 10,
                    "dataFormat": {
                        "id": 0,
                        "fill": {
                            "foreColor": "000000",
                            "rgb": "#000000"
                        },
                        "line": {
                            "color": "808080",
                            "rgb": "#808080"
                        }
                    }
                },
                "minimumValue": 0,
                "maximumValue": 0,
                "isAutoMajor": true,
                "majorUnit": 2,
                "hasMajorGridLines": false,
                "hasMinorGridLines": false,
                "majorTickMark": "TickMark_None",
                "minorTickMark": "TickMark_None",
                "tickLabelPosition": "TickLabelPosition_NextToAxis"
            },
            "chartTitle": "Title",
            "chartType": "Column_Stacked",
            "height": 252,
            "width": 450,
            "gapWidth": 22,
            "overlap": 100,
            "chartDataTable": null
        };
        return json;
    }
});