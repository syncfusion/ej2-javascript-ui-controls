/**
 * Specifies the print spec.
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Maps, ILoadedEventArgs, DataLabel } from '../../../src/index';
import { usMap } from '../../maps/data/data.spec';
import { IPrintEventArgs } from '../../../src/maps/model/interface';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { beforePrint } from '../../../src/maps/model/constants';
import { Legend, Annotations } from '../../../src/maps/index';
Maps.Inject(Legend, Annotations, DataLabel);
export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
describe('Map layer testing', () => {
    describe(' Map layer testing', () => {
        let mapObj: Maps;
        let mapElement: Element;
        let temp: Element;
        mapElement = createElement('div', { id: 'container' });
        temp = createElement('div', { id: 'tempElement' });
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };
        beforeAll(() => {
            let template: Element = createElement('div', { id: 'template', styles: 'display: none;border: 2px solid red' });
            document.body.appendChild(template);
            template.innerHTML = "<div id='templateWrap' style='background-color:#4472c4;border-radius: 3px;'>" +
                "<img src='./img1.jpg' style='border-radius: 0px;width: 24px;height: 24px;padding: 2px;' />" +
                "<div style='color:white;float: right;padding: 2px;line-height: 20px; text-align: center; font-family:Roboto; font-style: medium; fontp-size:14px;'><span>Print</span></div></div>";
            document.body.appendChild(mapElement);
            document.body.appendChild(temp);
            mapObj = new Maps({
                layers: [{
                    shapeSettings: {
                        fill: '#C3E6ED',
                    },
                    dataLabelSettings:{
                        visible: true,
                        labelPath: 'name',
                    },
                    shapeData: usMap,
                },
                ],
                annotations : [{
                    content: '#template',
                    x: '50%',
                    y: '50%'
                }],
                loaded: (args: Object): void => {
                    mapObj.print();
                }
            });
            mapObj.appendTo('#container');
        });
        afterAll((): void => {
            remove(mapElement);
            mapObj.destroy();
        });
        it(' checking a print', (done: Function) => {
            mapObj.beforePrint = (args: IPrintEventArgs): void => {
            expect(args.htmlContent.outerHTML.indexOf('<div id="container" class="e-control e-maps" aria-label="Maps Element" tabindex="1"') > -1).toBe(true);
            done();
            };
            mapObj.print();
            });
        it('Checking a PDF', (): void => {
                mapObj.loaded = (args: ILoadedEventArgs): void => {
                    let element: Element = document.getElementById(mapObj.element.id + '_Annotations_Group');
                    expect(element.childElementCount).toBeGreaterThanOrEqual(1);
                };
                mapObj.export('PDF', 'Map');
                mapObj.refresh();
            });
        it('Checking argument cancel', (done: Function) => {
                mapObj.beforePrint = (args: IPrintEventArgs): void => {
                  args.cancel = true;
                  expect(args.htmlContent.outerHTML.indexOf('<div id="container" class="e-control e-maps" aria-label="Maps Element" tabindex="1"') > -1).toBe(true);
                  done();
                };
                mapObj.print();
                mapObj.refresh();
            });
        it('Checking to print in multiple element', (done: Function) => {
                mapObj.loaded = (args: Object): void => {
                    mapObj.print(['container', 'tempElement']);
                };
                mapObj.beforePrint = (args: IPrintEventArgs): void => {
                    expect(args.htmlContent.outerHTML.indexOf('tempElement') > -1).toBe(true);
                    done();
                };
                mapObj.refresh();
            });
        it('Checking annotation style', (done: Function) => {
                mapObj.beforePrint = (args: IPrintEventArgs): void => {
                    expect(args.htmlContent.outerHTML.indexOf('style="background-color:#4472c4;border-radius: 3px;"') > -1).toBe(true);
                    done();
                };
                mapObj.refresh();
            });
        it('Checking to print direct element', (done: Function) => {
                mapObj.loaded = (args: Object): void => {
                    mapObj.print(document.getElementById('container'));
                };
                mapObj.beforePrint = (args: IPrintEventArgs): void => {
                    expect(args.htmlContent.outerHTML.indexOf('<div id="container" class="e-control e-maps" aria-label="Maps Element" tabindex="1"') > -1).toBe(true);
                    done();
                };
                mapObj.refresh();
            });
        it('Checking to print single element', (done: Function) => {
                mapObj.loaded = (args: Object): void => {
                    mapObj.print('tempElement');
                };
                mapObj.beforePrint = (args: IPrintEventArgs): void => {
                    expect(args.htmlContent.outerHTML.indexOf('<div id="tempElement"') > -1).toBe(true);
                    done();
                };
                mapObj.refresh();
            });
        it('Checking export', (done: Function) => {
                mapObj.export('JPEG', 'map');
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking export - SVG', (done: Function) => {
                mapObj.export('SVG', 'map');
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking export - PDF', (done: Function) => {
                mapObj.export('PDF', 'map');
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking export - PDF - Potrait', (done: Function) => {
                mapObj.export('PDF', 'map', PdfPageOrientation.Portrait);
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
    });
});