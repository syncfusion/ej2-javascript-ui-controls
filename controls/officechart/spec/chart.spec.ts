import { ChartComponent } from '../src/office-chart/chart';
import { createElement } from '@syncfusion/ej2-base';
/**
 * Office Chart spec
 */
describe('office chart to EJ2-chart-conversion', () => {
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
  it('Rendering Bar charts', () => {
    let chartData: any = getJson();
    chartObj.chartRender(chartData);
  });
  function getJson(): any {
    let json: any = {
      "chartLegend": {
        "position": "Bottom",
        "chartTitleArea": {
          "fontName": "+mn-lt",
          "fontSize": 9,
          "layout": {
            "layoutX": 0,
            "layoutY": 0
          },
          "dataFormat": {
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
      "chartTitleArea": {
        "fontName": "+mn-lt",
        "fontSize": 14,
        "layout": {
          "layoutX": 0,
          "layoutY": 0
        },
        "dataFormat": {
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
      "chartArea": {
        "foreColor": "#FFFFFF00"
      },
      "plotArea": {
        "foreColor": "#000000FF"
      },
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
          "dataPoints": [
            {
              "fill": {
                "foreColor": "4472c4",
                "rgb": "#4472c4"
              },
              "line": {
                "color": "000000",
                "rgb": "#000000"
              }
            }
          ],
          "seriesName": "Series 1",
          "dataLabel": {
            "position": "Outside",
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
          "errorBar": {
            "type": "StandardError",
            "direction": "Both",
            "endStyle": "Cap",
            "errorValue": 10
          },
          "trendLines": [
            {
              "name": "Linear (Series 1)",
              "type": "Linear",
              "forward": 0,
              "backward": 0,
              "intercept": 2,
              "isDisplayEquation": true,
              "isDisplayRSquared": true
            }
          ]
        },
        {
          "dataPoints": [
            {
              "fill": {
                "foreColor": "ed7d31",
                "rgb": "#ed7d31"
              },
              "line": {
                "color": "000000",
                "rgb": "#000000"
              }
            }
          ],
          "seriesName": "Series 2",
          "dataLabel": {
            "position": "Outside",
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
          "errorBar": {
            "type": "StandardError",
            "direction": "Both",
            "endStyle": "Cap",
            "errorValue": 10
          }
        },
        {
          "dataPoints": [
            {
              "fill": {
                "foreColor": "a5a5a5",
                "rgb": "#a5a5a5"
              },
              "line": {
                "color": "000000",
                "rgb": "#000000"
              }
            }
          ],
          "seriesName": "Series 3",
          "dataLabel": {
            "position": "Outside",
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
          "errorBar": {
            "type": "StandardError",
            "direction": "Both",
            "endStyle": "Cap",
            "errorValue": 10
          }
        }
      ],
      "chartPrimaryCategoryAxis": {
        "chartTitle": null,
        "chartTitleArea": {
          "layout": {
          },
          "dataFormat": {
            "fill": {
            },
            "line": {
            }
          }
        },
        "categoryType": "Automatic",
        "fontSize": 9,
        "fontName": "Calibri",
        "numberFormat": "General",
        "maximumValue": 0,
        "minimumValue": 0,
        "majorUnit": 0,
        "hasMajorGridLines": false,
        "hasMinorGridLines": false,
        "majorTickMark": "TickMark_None",
        "minorTickMark": "TickMark_None",
        "tickLabelPosition": "TickLabelPosition_NextToAxis"
      },
      "chartPrimaryValueAxis": {
        "chartTitle": null,
        "chartTitleArea": {
          "layout": {
          },
          "dataFormat": {
            "fill": {
            },
            "line": {
            }
          }
        },
        "fontSize": 9,
        "fontName": "Calibri",
        "maximumValue": 6,
        "minimumValue": 0,
        "majorUnit": 1,
        "hasMajorGridLines": true,
        "hasMinorGridLines": false,
        "majorTickMark": "TickMark_None",
        "minorTickMark": "TickMark_None",
        "tickLabelPosition": "TickLabelPosition_NextToAxis"
      },
      "chartTitle": "ClusterBar",
      "chartType": "Bar_Clustered",
      "gapWidth": 182,
      "overlap": 0,
      "height": 252,
      "width": 432
    };
    return json;
  }
});
describe('office chart to EJ2-chart-conversion', () => {
  let chartObj: ChartComponent;

  beforeAll(() => {
    let elem: HTMLElement = createElement('div', { id: 'container' });
    document.body.appendChild(elem);
    chartObj = new ChartComponent();
    chartObj.chartRender(getJson(), 1);
    chartObj.chart.appendTo('#container');

  });

  afterAll((): void => {
    chartObj.destroy();
    document.body.removeChild(document.getElementById('container'));
  });
  it('Rendering Bar charts', () => {
    let chartData: any = getJson();
    chartObj.chartRender(chartData, 1);
  });
  function getJson(): any {
    let json: any = {
      "c": [
        {
          "chd": [
            {
              "y": 286.0
            },
            {
              "y": 1300.0
            }
          ],
          "cx": "Gravad lax "
        },
        {
          "chd": [
            {
              "y": 680.0
            },
            {
              "y": 700.0
            }
          ],
          "cx": "Louisiana Hot spiced Okara  "
        },
        {
          "chd": [
            {
              "y": 288.0
            },
            {
              "y": 1280.0
            }
          ],
          "cx": "Mascarpone Fabioli    "
        },
        {
          "chd": [
            {
              "y": 200.0
            },
            {
              "y": 1200.0
            }
          ],
          "cx": "Wimmers gute SemmelKnodel        "
        },
        {
          "chd": [
            {
              "y": 731.0
            },
            {
              "y": 2660.0
            }
          ],
          "cx": "Maxilaku                "
        }
      ],
      "cs": [
        {
          "sn": "Sum of Purchases",
          "sf": {
            "f": {
              "fc": "#000000FF",
              "rgb": "#000000FF"
            },
            "msz": 0.0
          },
          "dp": [
            {
              "i": 0,
              "f": {
                "fc": "4f81be",
                "rgb": "#4f81be"
              },
              "l": {
                "c": "4f81be",
                "rgb": "#4f81be"
              }
            }
          ]
        },
        {
          "sn": "Sum of Future Expenses",
          "sf": {
            "f": {
              "fc": "#000000FF",
              "rgb": "#000000FF"
            },
            "msz": 0.0
          },
          "dp": [
            {
              "i": 0,
              "f": {
                "fc": "c0504e",
                "rgb": "#c0504e"
              },
              "l": {
                "c": "c0504e",
                "rgb": "#c0504e"
              }
            }
          ]
        }
      ],
      "ca": {
        "fc": "#D0CECE00"
      },
      "cta": {
        "l": {
          "x": 0.0,
          "y": 0.0
        },
        "fn": "Calibri (Body)",
        "fsz": 14.0,
        "df": {
          "i": 0,
          "f": {
            "fc": "000000",
            "rgb": "#000000"
          },
          "l": {
            "c": "000000",
            "rgb": "#000000"
          }
        }
      },
      "pa": {
        "fc": "#D0CECE00"
      },
      "cl": {
        "p": null,
        "cta": {
          "l": {
            "x": 0.0,
            "y": 0.0
          },
          "fn": null,
          "fsz": 0.0,
          "df": {
            "i": 0,
            "f": {},
            "l": {}
          }
        }
      },
      "cpca": {
        "ctt": null,
        "fsz": 10.0,
        "fn": "Calibri",
        "ct": "Automatic",
        "nf": "General",
        "minv": 0.0,
        "maxv": 0.0,
        "maju": 0.0,
        "hmajgl": 0,
        "hmingl": 0,
        "majtm": "TickMark_Outside",
        "mintm": "TickMark_None",
        "tlp": "TickLabelPosition_NextToAxis"
      },
      "cpva": {
        "ctt": null,
        "fsz": 10.0,
        "fn": "Calibri",
        "minv": 0.0,
        "maxv": 0.0,
        "maju": 1.0,
        "hmajgl": 1,
        "hmingl": 0,
        "majtm": "TickMark_Outside",
        "mintm": "TickMark_None",
        "tlp": "TickLabelPosition_Low"
      },
      "ctt": "Purchase Details",
      "ct": "Bar_Clustered",
      "h": 300.0,
      "w": 470.0
    };
    return json;
  }
});
