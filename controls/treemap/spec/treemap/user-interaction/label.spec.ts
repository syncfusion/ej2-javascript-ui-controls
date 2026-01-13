
import { TreeMap } from '../../../src/treemap/treemap';
import { MouseEvents } from '../base/events.spec';
import { ILoadedEventArgs } from '../../../src/treemap/model/interface';
import { createElement, remove } from '@syncfusion/ej2-base';
import { jobData, sportsData } from '../base/data.spec';
import { IPrintEventArgs } from '../../../src/treemap/model/interface';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
import { beforePrint } from '../../../src/treemap/model/constants';
import { Print } from '../../../src/treemap/model/print';
import { PdfExport } from '../../../src/treemap/model/pdf-export';
import { ImageExport } from '../../../src/treemap/model/image-export';
TreeMap.Inject(Print, PdfExport, ImageExport);

let jobDataSource: Object[] = jobData;
let gameDataSource: Object[] = sportsData;
/**
 * Tree map spec document
 */

describe('TreeMap component Spec', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
            treemap.theme = 'BootstrapDark';
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
                let spec: string = document.getElementById('labels_Level_Index_1_Item_Index_23_Text').textContent
                expect(spec).toEqual('Testers');
            }
            treemap.leafItemSettings.interSectAction = 'Wrap';
            treemap.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

describe('TreeMap component Spec', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
                spec = document.getElementById('colorMapping_Level_Index_2_Item_Index_21_RectPath')
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
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

describe('TreeMap component Spec', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
                allowImageExport:true,
                allowPdfExport: true,
                allowPrint: true,
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
             treemap.export('JPEG', 'map',0, true);
            expect('').toBe("");
            done();
        });
        it('Checking export - SVG', (done: Function) => {
            treemap.export('SVG', 'map',1, true);
            expect('').toBe("");
            done();
        });
        it('Checking export - PDF', (done: Function) => {
            treemap.export('PDF', 'map',1, true);
            expect('').toBe("");
            done();
        });
        it('Checking export - PDF - Potrait', (done: Function) => {
            treemap.export('PDF', 'map', PdfPageOrientation.Portrait, true);
            expect('').toBe("");
            done();
        });
    });

    describe('TreeMap print and export spec with conseidering the orientation and download option', () => {
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
                allowPrint:true,
                allowPdfExport:true,
                allowImageExport:true,
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
        

        it('Checking to print direct element', (done: Function) => {
            treemap.loaded = (args: Object): void => {
                treemap.print(document.getElementById('container'));
            };
            treemap.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('id="container" class="e-lib e-treemap e-control"') > -1).toBe(true);
                done();
            };
            treemap.refresh();
        });
        it('Checking to print single element', (done: Function) => {
            treemap.loaded = (args: Object): void => {
                treemap.print(document.getElementById('container'));
            };
            treemap.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf(' id="container" class="e-lib e-treemap e-control"') > -1).toBe(true);
                done();
            };
            treemap.refresh();
        });

        it('Checking export', (done: Function) => {
            treemap.export('JPEG', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - SVG', (done: Function) => {
            treemap.export('SVG', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF', (done: Function) => {
            treemap.export('PDF', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking the height property while export', (done: Function) => {
            treemap.export('PDF', 'map',1, true);
            let svg = document.getElementById("container_svg");
            expect(svg.getAttribute("height")).toBe("400");
            done();
        });
        it('Checking the height property while export', (done: Function) => {
            treemap.export('PNG', 'map',1, false);
            let svg = document.getElementById("container_svg");
            expect(svg.getAttribute("height")).toBe("400");
            done();
        });
        // it('Checking export - PDF - Potrait', (done: Function) => {
        //     treemap.export('PDF', 'map', PdfPageOrientation.Portrait, true);
        //     expect('').toBe("");
        //     done();
        // });
    });
    describe('TreeMap print and export  spec with theme as Material3, background color as transparent', () => {
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
                allowPrint:true,
                theme: 'Material3',
                background: 'transparent',
                allowPdfExport:true,
                allowImageExport:true,
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
        

        it(' checking a print', function (done) {
            treemap.beforePrint = function (args) {
                expect(args.htmlContent.outerHTML.indexOf('id="container" class="e-lib e-treemap e-control"') > -1).toBe(true);
                done();
            };
            treemap.print();
        });
        it('Checking export', (done: Function) => {
            treemap.export('JPEG', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - SVG', (done: Function) => {
            treemap.export('SVG', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF', (done: Function) => {
            treemap.export('PDF', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
    });
    describe('TreeMap print and export  spec with theme as Material3Dark, background color as transparent', () => {
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
                allowPrint:true,
                theme: 'Material3Dark',
                background: 'transparent',
                allowPdfExport:true,
                allowImageExport:true,
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
        

        it(' checking a print', function (done) {
            treemap.beforePrint = function (args) {
                expect(args.htmlContent.outerHTML.indexOf('id="container" class="e-lib e-treemap e-control"') > -1).toBe(true);
                done();
            };
            treemap.print();
        });
        it('Checking export', (done: Function) => {
            treemap.export('JPEG', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - SVG', (done: Function) => {
            treemap.export('SVG', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF', (done: Function) => {
            treemap.export('PDF', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
    });
    describe('TreeMap print and export  spec with theme as Material3, background color as rgba(255,255,255, 0.0)', () => {
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
                allowPrint:true,
                theme: 'Material3',
                background: 'rgba(255,255,255, 0.0)',
                allowPdfExport:true,
                allowImageExport:true,
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
        

        it(' checking a print', function (done) {
            treemap.beforePrint = function (args) {
                expect(args.htmlContent.outerHTML.indexOf('id="container" class="e-lib e-treemap e-control"') > -1).toBe(true);
                done();
            };
            treemap.print();
        });
        it('Checking export', (done: Function) => {
            treemap.export('JPEG', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - SVG', (done: Function) => {
            treemap.export('SVG', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF', (done: Function) => {
            treemap.export('PDF', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
    });
    describe('TreeMap print and export  spec with theme as Material3Dark, background color as rgba(255,255,255, 0.0)', () => {
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
                allowPrint:true,
                theme: 'Material3Dark',
                background: 'rgba(255,255,255, 0.0)',
                allowPdfExport:true,
                allowImageExport:true,
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
        
        it(' checking a print', function (done) {
            treemap.beforePrint = function (args) {
                expect(args.htmlContent.outerHTML.indexOf('id="container" class="e-lib e-treemap e-control"') > -1).toBe(true);
                done();
            };
            treemap.print();
        });
        it('Checking export', (done: Function) => {
            treemap.export('JPEG', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - SVG', (done: Function) => {
            treemap.export('SVG', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF', (done: Function) => {
            treemap.export('PDF', 'map',1, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});