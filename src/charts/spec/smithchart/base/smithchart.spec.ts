
import { Smithchart, ISmithchartLoadedEventArgs } from '../../../src/smithchart/index';
import { createElement, remove } from '@syncfusion/ej2-base';

/**
 * Title spec
 */
describe('Smithchart title properties tesing', () => {
    describe('Title testing', () => {
        let id: string = 'title';
        let smithchart: Smithchart;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            smithchart = new Smithchart({
                title: {
                    visible: true,
                    text : 'Transmission lines applied for both impedance and impedance',
                    subtitle: {
                    visible: true
                    }
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            smithchart.destroy();
        });
        it('Checking size as null', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_svg');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.width = null;
            smithchart.height = null;
            smithchart.refresh();
        });
        it('Checking size in percentage', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_svg');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.width = '50%';
            smithchart.height = '100%';
            smithchart.refresh();
        });
        it('Checking size with onPropertyChanged', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_svg');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.width = '500';
            smithchart.height = '500';
            smithchart.dataBind();
        });
        it('Checking border with onPropertyChanged', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_svg');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.border.width = 2;
            smithchart.dataBind();
        });
        it('Checking background with onPropertyChanged', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_svg');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.background = '';
            smithchart.dataBind();
        });
        it('Checking title element', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.text = 'Transmission lines applied for both impedance and impedance';
            smithchart.title.visible = true;
            smithchart.refresh();
        });
        it('Checking title element with description', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.text = 'Transmission lines applied for both impedance and impedance';
            smithchart.title.description = 'It represents the smithchart title';
            smithchart.title.visible = true;
            smithchart.refresh();
        });
        it('Checking sub-title element', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(2);
            };
            smithchart.title.subtitle.text = 'Smithchart subtitle';
            smithchart.title.subtitle.visible = true;
            smithchart.refresh();
        });
        it('Checking sub-title element with description', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(2);
            };
            smithchart.title.subtitle.text = 'Smithchart subtitle';
            smithchart.title.subtitle.description = 'It represents the smithchart subtitle';
            smithchart.title.subtitle.visible = true;
            smithchart.refresh();
        });

        it('Title alignment as Near', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.textAlignment = 'Near';
            smithchart.refresh();
        });
        it('Title alignment as Center', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.textAlignment = 'Center';
            smithchart.refresh();
        });

        it('Title alignment as Far', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.textAlignment = 'Far';
            smithchart.refresh();
        });
        it('Title alignment as Near - set enableTrim as True - set maximumWidth', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.textAlignment = 'Near';
            smithchart.title.enableTrim = true;
            smithchart.title.maximumWidth = 100;
            smithchart.refresh();
        });
        it('Title alignment as Center - set enableTrim as True - set maximumWidth', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.textAlignment = 'Center';
            smithchart.title.enableTrim = true;
            smithchart.title.maximumWidth = 100;
            smithchart.refresh();
        });
        it('Title alignment as Center - set enableTrim as True - set maximum width as 250', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.textAlignment = 'Center';
            smithchart.title.enableTrim = true;
            smithchart.title.text = 'SmithchartTitle';
            smithchart.title.maximumWidth = 200;
            smithchart.refresh();
        });
        it('Title alignment as Far - set enableTrim as True - set maximumWidth', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.textAlignment = 'Far';
            smithchart.title.enableTrim = true;
            smithchart.title.maximumWidth = 100;
            smithchart.refresh();
        });


        it('SubTitle alignment as Near', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.subtitle.textAlignment = 'Near';
            smithchart.refresh();
        });
        it('SubTitle alignment as Far', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.subtitle.textAlignment = 'Far';
            smithchart.refresh();
        });
        it('SubTitle alignment as Center', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.subtitle.textAlignment = 'Center';
            smithchart.refresh();
        });
        it('SubTitle alignment as Near - set enableTrim as True - set maximumWidth', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.subtitle.textAlignment = 'Near';
            smithchart.title.subtitle.enableTrim = true;
            smithchart.title.subtitle.maximumWidth = 50;
            smithchart.refresh();
        });
        it('SubTitle alignment as Far - set enableTrim as True - set maximumWidth', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.subtitle.textAlignment = 'Far';
            smithchart.title.subtitle.enableTrim = true;
            smithchart.title.subtitle.maximumWidth = 50;
            smithchart.refresh();
        });
        it('SubTitle alignment as Center - set enableTrim as True - set maximumWidth', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.title.subtitle.textAlignment = 'Center';
            smithchart.title.subtitle.enableTrim = true;
            smithchart.title.subtitle.maximumWidth = 50;
            smithchart.refresh();
        });
        it('Checking border width for smithchart', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithchart.border.width = 2;
            smithchart.refresh();
        });

    });
});