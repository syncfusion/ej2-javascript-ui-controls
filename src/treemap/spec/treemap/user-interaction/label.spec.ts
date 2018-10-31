
import { TreeMap } from '../../../src/treemap/treemap';
import { MouseEvents } from '../base/events.spec';
import { ILoadedEventArgs } from '../../../src/treemap/model/interface';
import { createElement, remove } from '@syncfusion/ej2-base';
import { jobData, sportsData } from '../base/data.spec';
import { IPrintEventArgs } from '../../../src/treemap/model/interface';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { beforePrint } from '../../../src/treemap/model/constants';

let jobDataSource: Object[] = jobData;
let gameDataSource: Object[] = sportsData;
/**
 * Tree map spec document
 */

describe('TreeMap component Spec', () => {
    describe('TreeMap label spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        let id: string = 'labels';
        let spec: Element;
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            treemap = new TreeMap({
                border: {
                    color: 'red',
                    width: 2
                },
                titleSettings: {
                    text: 'Tree Map control',
                },
                dataSource: jobData,
                weightValuePath: 'EmployeesCount',
                leafItemSettings: {
                    showLabels: true,
                    labelPath: 'JobGroup',
                    fill: '#6699cc',
                    labelPosition: 'BottomRight',
                    border: { color: 'black', width: 2 }
                },
                levels: [
                    { groupPath: 'Country', fill: '#336699', border: { color: 'black', width: 2 } },

                ]
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });
        it('Checking a label with interSectAction: Trim ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('labels_Level_Index_0_Item_Index_2_Text').textContent
                expect(spec).toEqual('Germany');
            }
            treemap.leafItemSettings.interSectAction = 'Trim';
            treemap.refresh();
        });

        it('Checking a label with interSectAction: Hide ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('labels_Level_Index_0_Item_Index_2_Text').textContent
                expect(spec).toEqual('Germany');
            }
            treemap.leafItemSettings.interSectAction = 'Hide';
            treemap.refresh();
        });

        it('Checking a label with interSectAction: Wrap ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('labels_Level_Index_0_Item_Index_2_Text').textContent
                expect(spec).toEqual('Germany');
            }
            treemap.leafItemSettings.interSectAction = 'WrapByWord';
            treemap.refresh();
        });

        it('Checking a label with interSectAction: WrapText ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let spec: string = document.getElementById('labels_Level_Index_1_Item_Index_18_Text').textContent
                expect(spec).toEqual('Testers');
            }
            treemap.leafItemSettings.interSectAction = 'Wrap';
            treemap.refresh();
        });

    });
});

describe('TreeMap component Spec', () => {
    describe('TreeMap colorMapping  spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        let id: string = 'colorMapping';
        let spec: Element;
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            treemap = new TreeMap({
                border: {
                    color: 'red',
                    width: 2
                },
                titleSettings: {
                    text: 'Tree Map control',
                },
                dataSource: jobData,
                weightValuePath: 'EmployeesCount',
                leafItemSettings: {
                    labelPath: 'JobGroup',
                    fill: '#6699cc',
                    labelPosition: 'BottomRight',
                    border: { color: 'black', width: 2 }
                },
                levels: [
                    { groupPath: 'Country', fill: '#336699', border: { color: 'black', width: 2 } },
                    { groupPath: 'JobDescription', fill: '#336699', border: { color: 'black', width: 2 } }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            treemap.destroy();
            document.getElementById(id).remove();
        });

        it('color value path and Range color Mapping', (done: Function) => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById('colorMapping_Level_Index_2_Item_Index_18_RectPath')
                //expect(spec.getAttribute('fill')).toBe('#6699cc');
                expect(spec.getAttribute('fill')).toBe('green');
                done();
            };
            treemap.rangeColorValuePath = 'EmployeesCount';
            treemap.leafItemSettings.colorMapping = [
                {
                    from: 1,
                    to: 70,
                    color: 'green'
                },
                {
                    from: 70,
                    to: 200,
                    color: 'yellow'
                }
            ]
            treemap.refresh();
        });

        it('color value path and Equal color Mapping', (done: Function) => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById('colorMapping_Level_Index_2_Item_Index_12_RectPath')
                // expect(spec.getAttribute('fill')).toBe('#6699cc');
                expect(spec.getAttribute('fill')).toBe('green');
                done();
            };
            treemap.equalColorValuePath = 'JobDescription';
            treemap.leafItemSettings.colorMapping = [
                {
                    value: 'Sales',
                    color: 'green'
                },

            ]
            treemap.refresh();
        });
        it('color value path and null value', (done: Function) => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById('colorMapping_Level_Index_0_Item_Index_0_RectPath')
                expect(spec.getAttribute('fill')).toBe('#336699');
                done();
            };
            treemap.equalColorValuePath = 'EmployeesCount';
            treemap.leafItemSettings.colorMapping = [
                {
                    value: null,
                    color: 'green',
                },

            ]
            treemap.refresh();
        });
        it('color value path and null ', (done: Function) => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById('colorMapping_Level_Index_0_Item_Index_0_RectPath')
                expect(spec.getAttribute('fill')).toBe('#336699');
                done();
            };
            treemap.equalColorValuePath = 'JobDescription';
            treemap.rangeColorValuePath = 'EmployeesCount'
            treemap.leafItemSettings.colorMapping = [
                {
                    from: 1,
                    to: 80,
                    value: 'Technical',
                    color: 'green',
                    minOpacity: 0.1,
                    maxOpacity: 1
                },
            ];
            treemap.refresh();
        });
    });
});

describe('TreeMap component Spec', () => {
    describe('TreeMap print and export  spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let temp: Element;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        let id: string = 'container';
        temp = createElement('div', { id: 'tempElement' });
        let spec: Element;
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };
        beforeAll(() => {
            element = createElement('div', { id: id });
            let template: Element = createElement('div', { id: 'template', styles: 'display: none;border: 2px solid red' });
            document.body.appendChild(template);
            template.innerHTML = "<div id='templateWrap' style='background-color:#4472c4;border-radius: 3px;'>" +
                "<img src='./img1.jpg' style='border-radius: 0px;width: 24px;height: 24px;padding: 2px;' />" +
                "<div style='color:white;float: right;padding: 2px;line-height: 20px; text-align: center; font-family:Roboto; font-style: medium; fontp-size:14px;'><span>Print</span></div></div>";
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            document.body.appendChild(temp);
            treemap = new TreeMap({
                border: {
                    color: 'red',
                    width: 2
                },
                titleSettings: {
                    text: 'Tree Map control',
                },
                dataSource: jobData,
                weightValuePath: 'EmployeesCount',
                leafItemSettings: {
                    labelPath: 'JobGroup',
                    fill: '#6699cc',
                    labelPosition: 'BottomRight',
                    border: { color: 'black', width: 2 }
                },
                levels: [
                    { groupPath: 'Country', fill: '#336699', border: { color: 'black', width: 2 } },
                    { groupPath: 'JobDescription', fill: '#336699', border: { color: 'black', width: 2 } }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            treemap.destroy();
            document.getElementById(id).remove();
        });
        it(' checking a print', (done: Function) => {
            treemap.beforePrint = (args: IPrintEventArgs): void => {
                //  expect(args.htmlContent.outerHTML.indexOf('<div id="container" class="e-control e-treemap" style="width: 600px; height: 400px;"') > -1).toBe(true);
                done();
            };
            treemap.print();
        });

        it('Checking a PDF', (): void => {
            treemap.loaded = (args: ILoadedEventArgs): void => {
                let element: Element = document.getElementById('container_Level_Index_0_Item_Index_0_Group');
                // expect(element.childElementCount).toBeGreaterThanOrEqual(2);
            };
            treemap.export('PDF', 'Map');
            treemap.refresh();
        });

        it('Checking argument cancel', (done: Function) => {
            treemap.beforePrint = (args: IPrintEventArgs): void => {
                args.cancel = true;
                //  expect(args.htmlContent.outerHTML.indexOf('<div id="container" class="e-control e-treemap" style="width: 600px; height: 400px;"') > -1).toBe(true);
                done();
            };
            treemap.print();
            treemap.refresh();
        });
        it('Checking to print in multiple element', (done: Function) => {
            treemap.loaded = (args: Object): void => {
                treemap.print(['container', 'tempElement']);
            };
            treemap.beforePrint = (args: IPrintEventArgs): void => {
                // expect(args.htmlContent.outerHTML.indexOf('tempElement') > -1).toBe(true);
                done();
            };
            treemap.refresh();
        });

        it('Checking to print direct element', (done: Function) => {
            treemap.loaded = (args: Object): void => {
                treemap.print(document.getElementById('container'));
            };
            treemap.beforePrint = (args: IPrintEventArgs): void => {
                //expect(args.htmlContent.outerHTML.indexOf('<div id="container" class="e-control e-treemap" style="width: 600px; height: 400px;"') > -1).toBe(true);
                done();
            };
            treemap.refresh();
        });
        it('Checking to print single element', (done: Function) => {
            treemap.loaded = (args: Object): void => {
                treemap.print('tempElement');
            };
            treemap.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('<div id="tempElement"') > -1).toBe(true);
                done();
            };
            treemap.refresh();
        });

        it('Checking export', (done: Function) => {
            treemap.export('JPEG', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - SVG', (done: Function) => {
            treemap.export('SVG', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF', (done: Function) => {
            treemap.export('PDF', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF - Potrait', (done: Function) => {
            treemap.export('PDF', 'map', PdfPageOrientation.Portrait);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
    });
});


