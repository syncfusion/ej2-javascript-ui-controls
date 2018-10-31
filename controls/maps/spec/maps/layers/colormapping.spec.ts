/**
 * Bing map layer testing
 */
import { Maps, ILoadedEventArgs, Zoom } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { electiondata } from '../data/us-data.spec';
import { usMap, usState } from '../data/data.spec';
Maps.Inject(Zoom)
export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
describe('Map layer testing', () => {
    describe('Color Map testing', () => {
        let id: string = 'color-map';
        let colormap: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            colormap = new Maps({
                theme: 'Highcontrast',
                zoomSettings:{
                    enable: true
                },
                layers: [
                    {
                        shapeData: usMap,
                        dataSource: electiondata,
                        shapeDataPath: 'State',
                        shapePropertyPath: 'name',
                        shapeSettings: {
                            valuePath: 'Electors',
                            fill: 'Orange',
                            colorValuePath: 'Candidate',
                            colorMapping: [
                                {
                                    value: 'Romney', color: '#33CCFF'
                                },
                                {
                                    value: 'Obama', color: '#FF4500'
                                }
                            ]
                        }
                    }
                ],
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            colormap.destroy();
        });
        it('Equal color mappping testing spec', (done: Function) => {
            spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_10_dataIndex_28');
            expect(spec.getAttribute('fill')).toBe('#FF4500');
            // spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_50_dataIndex_undefined');
            // expect(spec.getAttribute('fill')).toBe('#33CCFF');
            done();
        });
        it('Range color mappping testing spec', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_10_dataIndex_28');
                expect(spec.getAttribute('fill')).toBe('#33CCFF');
                // spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_50_dataIndex_undefined');
                // expect(spec.getAttribute('fill')).toBe('#33CCFF');
                // spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_20_dataIndex_undefined');
                // expect(spec.getAttribute('fill')).toBe('#33CCFF');
                // spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_41_dataIndex_undefined');
                // expect(spec.getAttribute('fill')).toBe('#33CCFF');
                done();
            };
            colormap.layers[0].shapeSettings.colorValuePath = 'Electors';
            colormap.layers[0].shapeSettings.colorMapping = [
                {
                    from: 1, to: 7, color: '#33CCFF'
                },
                {
                    from: 8, to: 15, color: '#FF4500'
                },
                {
                    from: 16, to: 30, color: '#A500FF'
                },
                {
                    from: 31, to: 99, color: '#00FFA5'
                },
            ];
            colormap.refresh();
        });
        it('color value path and value path null color mappping testing spec', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_10_dataIndex_undefined');
                expect(spec.getAttribute('fill')).toBe('Orange');
                done();
            };
            colormap.layers[0].shapeSettings.colorValuePath = null;
            colormap.layers[0].shapeSettings.valuePath = null;
            colormap.refresh();
        });
        it('shape data auto fill testing spec', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_10_dataIndex_undefined');
                expect(spec.getAttribute('fill')).not.toBe('Orange');
                done();
            };
            colormap.layers[0].shapeSettings.autofill = true;
            colormap.refresh();
        });
        it('shape data color value path bindiing testing spec', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_10_dataIndex_28');
                expect(spec.getAttribute('fill')).toBe('#B5E485');
                done();
            };
            colormap.layers[0].shapeSettings.colorValuePath = 'color';
            colormap.refresh();
        });
        it('shape data color property checking', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_0_dataIndex_null');
                expect(spec.getAttribute('fill')).toBe('red');
                spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_2_dataIndex_null');
                expect(spec.getAttribute('fill')).toBe('aqua');
                spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_1_dataIndex_null');
                expect(spec.getAttribute('fill')).toBe('orange');
                spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_3_dataIndex_null');
                expect(spec.getAttribute('fill')).toBe('teal');
                spec = getElementByID(id + '_LayerIndex_0_ShapeIndex_4_dataIndex_null');
                expect(spec.getAttribute('fill')).toBe('purple');
                done();
            };
            colormap.layers[0].shapeData = usState;
            colormap.layers[0].shapeSettings.colorValuePath = 'color';
            colormap.layers[0].shapeSettings.autofill = false;
            colormap.layers[0].shapeSettings.valuePath = null;
            colormap.layers[0].shapeSettings.fill = null;
            colormap.layers[0].dataSource = [];
            colormap.layers[0].shapeSettings.colorMapping = [];
            colormap.refresh();
        });
    });
});