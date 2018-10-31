
import { Smithchart, SmithchartLegend, ISmithchartLoadedEventArgs } from '../../../src/smithchart/index';
import { createElement, remove } from '@syncfusion/ej2-base';

Smithchart.Inject(SmithchartLegend);

/**
 * Legend spec
 */
describe('Smithchart legend properties tesing', () => {
    describe('Legend testing', () => {
        let id: string = 'legend';
        let smithchart: Smithchart;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            smithchart = new Smithchart({
            series: [
         {
            points: [
                { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 }, 
                { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 }, 
                { resistance: 0, reactance: 0.05 }, { resistance: 0.3, reactance: 0.1 },
                { resistance: 0.3, reactance: 0.1 }, { resistance: 0.3, reactance: 0.1 }, 
                { resistance: 0.3, reactance: 0.1 }, { resistance: 0.5, reactance: 0.2 }, 
                { resistance: 1.0, reactance: 0.4 },
                { resistance: 1.5, reactance: 0.5 }, { resistance: 2.0, reactance: 0.5 },
                { resistance: 2.5, reactance: 0.4 }, { resistance: 3.5, reactance: 0.0 },
                { resistance: 4.5, reactance: -0.5 }, { resistance: 5.0, reactance: -1.0 }

             ],
    fill: 'red',
    name: 'Transmission1'
},
{
                            points: [{ resistance: 0, reactance: 0.15 }, { resistance: 0.3, reactance: 0.2 },
                                         { resistance: 0.5, reactance: 0.4 }, { resistance: 1.0, reactance: 0.8 },
                                         { resistance: 1.5, reactance: 1.0 }, { resistance: 2.0, reactance: 1.2 },
                                         { resistance: 2.5, reactance: 1.3 }, { resistance: 3.5, reactance: 1.6 },
                                         { resistance: 4.5, reactance: 2.0 }, { resistance: 6.0, reactance: 4.5 },
                                         { resistance: 8, reactance: 6 }, { resistance: 10, reactance: 25 }],
                            name: 'Transmission2',
                            fill: 'blue'
                        }
],
                legendSettings: {
                    visible: true,
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            smithchart.destroy();
        });

        it('Checking with legend  with description', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.description = 'It represents to show and hide the legend series';
            smithchart.refresh();
        });
        it('Legend position as top', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.position = 'Top';
            smithchart.refresh();
        });

        it('Legend position as left', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.position = 'Left';
            smithchart.refresh();
        });

        it('Legend position as right', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.position = 'Right';
            smithchart.refresh();
        });

        it('Legend position as Bottom', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.position = 'Bottom';
            smithchart.refresh();
        });

        it('Legend alignment as Near - bottom position', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.alignment = 'Near';
            smithchart.refresh();
        });

        it('Legend alignment as Far - bottom position', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.alignment = 'Far';
            smithchart.refresh();
        });

        it('Legend alignment as Far - Left position', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.position = 'Left';
            smithchart.refresh();
        });

        it('Legend alignment as Near - left position', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.alignment = 'Near';
            smithchart.refresh();
        });

        it('Checking with legend size - left position', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.height = 300;
            smithchart.legendSettings.width = 300;
            smithchart.legendSettings.position = 'Left';
            smithchart.refresh();
        });
        it('Checking with legend size - top position', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.height = null;
            smithchart.legendSettings.width = null;
            smithchart.width = '300';
            smithchart.height = '200';
            smithchart.legendSettings.position = 'Top';
            smithchart.refresh();
        });
        it('Checking with legend size - bottom position', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.height = null;
            smithchart.legendSettings.width = null;
            smithchart.width = '180';
            smithchart.height = '200';
            smithchart.legendSettings.position = 'Bottom';
            smithchart.refresh();
        });
        it('Checking with legend size - right position', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.height = null;
            smithchart.legendSettings.width = null;
            smithchart.width = '500';
            smithchart.height = '500';
            smithchart.legendSettings.position = 'Right';
            smithchart.refresh();
        });
        it('Checking with legend item padding', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.itemPadding = 0;
            smithchart.refresh();
        });
        it('Legend position as custom without location', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.position = 'Custom';
            smithchart.refresh();
        });
        it('Legend position as custom', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.position = 'Custom';
            smithchart.legendSettings.location.x = 100;
            smithchart.legendSettings.location.y = 200;
            smithchart.refresh();
        });
        it('Checking with legend title', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.title.text = 'legendgroup';
            smithchart.refresh();
        });
        it('Checking with legend title with description', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.title.text = 'legendgroup';
            smithchart.legendSettings.title.description = 'It represents the legend title';
            smithchart.refresh();
        });
        it('Checking with rowCount with position as left ', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.rowCount = 2;
            smithchart.legendSettings.position = 'Left';
            smithchart.refresh();
        });
        it('Checking with columnCount with position as top', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.columnCount = 2;
            smithchart.legendSettings.position = 'Top';
            smithchart.refresh();
        });
        it('Checking with rowCount and columnCount', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.rowCount = 2;
            smithchart.legendSettings.columnCount = 2;
            smithchart.refresh();
        });
        it('Checking with rowCount and columnCount with position as top & legend title', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.rowCount = 1;
            smithchart.legendSettings.columnCount = 2;
            smithchart.legendSettings.title.text = 'legend';
            smithchart.legendSettings.position = 'Top';
            smithchart.refresh();
        });
        it('Checking with rowCount and columnCount with position as left & legend title', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.rowCount = 1;
            smithchart.legendSettings.columnCount = 2;
            smithchart.legendSettings.title.text = 'legend';
            smithchart.legendSettings.position = 'Left';
            smithchart.refresh();
        });
        it('Checking with rowCount greater than columnCount', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.rowCount = 2;
            smithchart.legendSettings.columnCount = 1;
            smithchart.refresh();
        });
        it('Checking with rowCount less than columnCount', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.rowCount = 1;
            smithchart.legendSettings.columnCount = 2;
            smithchart.refresh();
        });
        it('Legend shape as Rectangle ', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.shape = 'Rectangle';
            smithchart.refresh();
        });
        it('Legend shape as Triangle ', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.shape = 'Triangle';
            smithchart.refresh();
        });
        it('Legend shape as Pentagon ', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.shape = 'Pentagon';
            smithchart.refresh();
        });
        it('Legend shape as Diamond ', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.shape = 'Diamond';
            smithchart.refresh();
        });
        it('checking legend title with alignement far ', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.title.text = 'legendtitle';
            smithchart.legendSettings.title.textAlignment = 'Far';
            smithchart.refresh();
        });
        it('checking legend title with alignement Near ', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.title.text = 'legendtitle';
            smithchart.legendSettings.title.textAlignment = 'Near';
            smithchart.refresh();
        });
        it('checking legend title with alignement center ', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.legendSettings.title.text = 'smithchartlegendtitlegrouptextrendering';
            smithchart.legendSettings.title.textAlignment = 'Center';
            smithchart.refresh();
        });
        it('checking with legend without giving name to series', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.series[0].name = '';
            smithchart.series[1].name = '';
            smithchart.refresh();
        });
        it('checking with legend without giving color to series', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.series[0].fill = '';
            smithchart.series[1].fill = '';
            smithchart.refresh();
        });
        it('checking with series visibility as hidden', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_legend_group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.series[0].visibility = 'hidden';
            smithchart.refresh();
        });
        it('checking with legend visibility as false', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
                let color: string = element.getAttribute('stroke');
                expect(color).toEqual('#00bdae');
            };
            smithchart.legendSettings.visible = false;
            smithchart.refresh();
        });
    });
});