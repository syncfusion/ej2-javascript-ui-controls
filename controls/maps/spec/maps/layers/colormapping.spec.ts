/**
 * Bing map layer testing
 */
import { Maps, ILoadedEventArgs, Zoom } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { electiondata } from '../data/us-data.spec';
import { usMap, usState } from '../data/data.spec';
import  {profile , inMB, getMemoryProfile, sampleMemoryMB} from '../common.spec';
Maps.Inject(Zoom)
export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
describe('Map layer testing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Color Map testing', () => {
        let id: string = 'color-map';
        let colormap: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            colormap = new Maps({
                theme: 'HighContrast',
                zoomSettings: {
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
            spec = getElementByID(id + '_LayerIndex_0_shapeIndex_10_dataIndex_28');
            expect(spec.getAttribute('fill')).toBe('#FF4500');
            // spec = getElementByID(id + '_LayerIndex_0_shapeIndex_50_dataIndex_undefined');
            // expect(spec.getAttribute('fill')).toBe('#33CCFF');
            done();
        });
        it('Range color mappping testing spec', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_10_dataIndex_28');
                expect(spec.getAttribute('fill')).toBe('#33CCFF');
                // spec = getElementByID(id + '_LayerIndex_0_shapeIndex_50_dataIndex_undefined');
                // expect(spec.getAttribute('fill')).toBe('#33CCFF');
                // spec = getElementByID(id + '_LayerIndex_0_shapeIndex_20_dataIndex_undefined');
                // expect(spec.getAttribute('fill')).toBe('#33CCFF');
                // spec = getElementByID(id + '_LayerIndex_0_shapeIndex_41_dataIndex_undefined');
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
        it('Desaturation color mappping testing spec', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_10_dataIndex_28');
                expect(spec.getAttribute('fill')).toBe('#33CCFF');
                // spec = getElementByID(id + '_LayerIndex_0_shapeIndex_50_dataIndex_undefined');
                // expect(spec.getAttribute('fill')).toBe('#33CCFF');
                // spec = getElementByID(id + '_LayerIndex_0_shapeIndex_20_dataIndex_undefined');
                // expect(spec.getAttribute('fill')).toBe('#33CCFF');
                // spec = getElementByID(id + '_LayerIndex_0_shapeIndex_41_dataIndex_undefined');
                // expect(spec.getAttribute('fill')).toBe('#33CCFF');
                done();
            };
            colormap.layers[0].shapeSettings.colorValuePath = 'Electors';
            colormap.layers[0].shapeSettings.colorMapping = [
                {
                    from: 1, to: 7, color: '#33CCFF', minOpacity: 0.25, maxOpacity: 1
                },
                {
                    from: 8, to: 15, color: '#FF4500', minOpacity: 0.5, maxOpacity: 1
                },
                {
                    from: 16, to: 30, color: '#A500FF', minOpacity: 0.75, maxOpacity: 1
                },
                {
                    from: 31, to: 99, color: '#00FFA5', minOpacity: 0.85, maxOpacity: 1
                },
            ];
            colormap.refresh();
        });

        it('color value path and value path null color mappping testing spec', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_10_dataIndex_undefined');
                expect(spec.getAttribute('fill')).toBe('Orange');
                done();
            };
            colormap.layers[0].shapeSettings.colorValuePath = null;
            colormap.layers[0].shapeSettings.valuePath = null;
            colormap.refresh();
        });
        it('shape data auto fill testing spec', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_10_dataIndex_undefined');
                expect(spec.getAttribute('fill')).not.toBe('Orange');
                done();
            };
            colormap.layers[0].shapeSettings.autofill = true;
            colormap.refresh();
        });
        it('shape data color value path bindiing testing spec', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_10_dataIndex_28');
                expect(spec.getAttribute('fill')).toBe('#B5E485');
                done();
            };
            colormap.layers[0].shapeSettings.colorValuePath = 'color';
            colormap.refresh();
        });
        it('shape data color property checking', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_0_dataIndex_null');
                expect(spec.getAttribute('fill')).toBe('red');
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_2_dataIndex_null');
                expect(spec.getAttribute('fill')).toBe('aqua');
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_1_dataIndex_null');
                expect(spec.getAttribute('fill')).toBe('orange');
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_3_dataIndex_null');
                expect(spec.getAttribute('fill')).toBe('teal');
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_4_dataIndex_null');
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

    describe('Generate Legend for out of the range in Color Map testing', () => {
        let id: string = 'color-map';
        let colormap: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            colormap = new Maps({
                theme: 'HighContrast',
                zoomSettings: {
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
                                    color: '#FF4500'
                                }
                            ]
                        }
                    }
                ],
                legendSettings: {
                    visible: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            colormap.destroy();
        });

        it('Equal color mappping testing spec for out of the ranges', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID('color-map_LayerIndex_0_shapeIndex_10_dataIndex_28');
                expect(spec.getAttribute('fill')).toBe('#FF4500');
                done();
            };
            colormap.refresh();
        });

        it('Range color mappping testing spec for out of the ranges', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID('color-map_LayerIndex_0_shapeIndex_8_dataIndex_4');
                expect(spec.getAttribute('fill')).toBe('violet');
                done();
            };
            colormap.layers[0].shapeSettings.colorValuePath = 'Electors';
            colormap.layers[0].shapeSettings.colorMapping = [
                {
                    from: 1, to: 7, color: ['red', 'green']
                },
                {
                    from: 8, to: 15, color: ['pink', 'white', 'blue']
                },
                {
                    from: 16, to: 30, color: ['brown', 'yellow', 'orange', 'skyblue']
                },
                {
                    color: 'violet'
                },
            ];
            colormap.refresh();
        });

    });

    describe('Generate Multi Colors for Range Desaturation and Equal Color Map testing', () => {
        let id: string = 'color-map';
        let colormap: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            colormap = new Maps({
                theme: 'HighContrast',
                zoomSettings: {
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
                                    value: 'Obama', color: ['red', 'blue']
                                }
                            ]
                        }
                    }
                ],
                legendSettings: {
                    visible: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            colormap.destroy();
        });

        it('Equal color mappping testing spec with multi colors', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_9_dataIndex_5');
                expect(spec.getAttribute('fill')).toBe('red');
                done();
            };
            colormap.refresh();
        });

        it('Range color mappping testing spec with multi colors', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_19_dataIndex_27');
                expect(spec.getAttribute('fill')).toBe('#555500');
                let spec1: Element = getElementByID(id + '_LayerIndex_0_shapeIndex_16_dataIndex_15');
                expect(spec1.getAttribute('fill')).toBe('#2b6b00');
                done();
            };
            colormap.layers[0].shapeSettings.colorValuePath = 'Electors';
            colormap.layers[0].shapeSettings.colorMapping = [
                {
                    from: 1, to: 7, color: ['red', 'green']
                },
                {
                    from: 8, to: 15, color: ['pink', 'orange', 'violet']
                },
                {
                    from: 16, to: 40, color: ['brown', 'yellow', 'blue', 'skyblue']
                },
            ];
            colormap.refresh();
        });

        it('Desaturation color mappping testing spec with multi colors', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_14_dataIndex_50');
                expect(spec.getAttribute('fill')).toBe('#aa2b00');
                expect(spec.getAttribute('fill-opacity')).toBe('0.5');
                let specanother: Element = getElementByID(id + '_LayerIndex_0_shapeIndex_34_dataIndex_14');
                expect(specanother.getAttribute('fill')).toBe('#24f6f8');
                expect(specanother.getAttribute('fill-opacity')).toBe('0.7142857142857143');
                done();
            };
            colormap.layers[0].shapeSettings.colorValuePath = 'Electors';
            colormap.layers[0].shapeSettings.colorMapping = [
                {
                    from: 1, to: 7, color: ['#FF0000', '#008000'], minOpacity: 0.25, maxOpacity: 1
                },
                {
                    from: 8, to: 15, color: ['#FFC0CB', '#00FFFF', '#FFB6C1'], minOpacity: 0.5, maxOpacity: 1
                },
                {
                    from: 16, to: 40, color: ['#A52A2A', '#FFFF00', '#9f8170', '#3d2b1f'], minOpacity: 0.75, maxOpacity: 1
                },
            ];
            colormap.refresh();
        });
        it('Desaturation color mappping testing spec with multi colors', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_14_dataIndex_50');
                expect(spec.getAttribute('fill')).toBe('#FF0000');
                done();
            };
            colormap.layers[0].shapeSettings.colorValuePath = 'Candidate';
            colormap.layers[0].shapeSettings.valuePath = 'Electors';
            colormap.layers[0].shapeSettings.colorMapping = [
                {
                    from: 1, to: 7, value: 'Romney', color: ['#FF0000', '#008000'], minOpacity: 0.25, maxOpacity: 1
                }
            ];
            colormap.refresh();
        });
        it('color value as null and color as object', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_14_dataIndex_50');
                expect(spec.getAttribute('fill')).toBe('#33CCFF');
                done();
            };
            colormap.layers[0].shapeSettings.colorValuePath = 'Candidate';
            colormap.layers[0].shapeSettings.colorMapping = [
                {
                    value: 'Romney', color: '#33CCFF'
                },
                {
                    color: ['red', 'blue']
                }
            ];
            colormap.refresh();
        });
        it('shapeData path value is wrong', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_6_dataIndex_0');
                expect(spec.getAttribute('fill')).toBe('#FF0000');
                done();
            };
            colormap.layers[0].shapeDataPath = 'State1';
            colormap.layers[0].shapeSettings.valuePath = 'Electors';
            colormap.layers[0].shapeSettings.colorValuePath = 'Candidate';
            colormap.layers[0].shapeSettings.colorMapping = [
                {
                    from: 1, to: 7, value: 'Romney', color: ['#FF0000', '#008000'], minOpacity: 0.25, maxOpacity: 1
                }
            ];
            colormap.refresh();
        });
        it('shape property path value is wrong', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_6_dataIndex_0');
                expect(spec.getAttribute('fill')).toBe('#FF0000');
                done();
            };
            colormap.layers[0].shapeDataPath = 'State1';
            colormap.layers[0].shapePropertyPath = 'States';
            colormap.layers[0].shapeSettings.valuePath = 'Electors';
            colormap.layers[0].shapeSettings.colorValuePath = 'Candidate';
            colormap.layers[0].shapeSettings.colorMapping = [
                {
                    from: 1, to: 7, value: 'Romney', color: ['#FF0000', '#008000'], minOpacity: 0.25, maxOpacity: 1
                }
            ];
            colormap.refresh();
        });
        it('datasource as null', (done: Function) => {
            colormap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_LayerIndex_0_shapeIndex_0_dataIndex_null');
                expect(spec.getAttribute('fill')).toBe('Orange');
                done();
            };
            colormap.layers[0].dataSource = null;
            colormap.layers[0].shapeDataPath = 'State';
            colormap.layers[0].shapePropertyPath = 'name';            
            colormap.refresh();
        });
    });
    it('memory leak', async () => {
        // Warm-up to stabilize memory reporting
        await sampleMemoryMB();
        await sampleMemoryMB();
    
        // Baseline
        const start = await sampleMemoryMB();
        // End measurement
        const end = await sampleMemoryMB();
    
        const delta = end - start;
        const relative = start > 0 ? (delta / start) : 0;
    
        expect(relative).toBeLessThan(0.20);
        expect(delta).toBeLessThan(30);
    });
});

describe('Equal color mapping testing spec for out of range at starting', () => {
    let id: string = 'maps';
    let colormap: Maps;
    let ele: HTMLDivElement;
    let spec: Element;
    beforeAll(() => {
        ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
        document.body.appendChild(ele);
        colormap = new Maps({
            theme: 'HighContrast',
            zoomSettings: {
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
                                color: '#FF4500'
                            },
                            {
                                value: 'Romney', color: '#33CCFF'
                            },
                        ]
                    }
                }
            ],
            legendSettings: {
                visible: true,
                toggleLegendSettings: {
                    enable: true,
                }
            }
        }, '#' + id);
    });
    afterAll(() => {
        remove(ele);
        colormap.destroy();
    });
    it('Equal color mappping testing spec for out of the ranges at start', (done: Function) => {
        colormap.loaded = (args: ILoadedEventArgs) => {
            spec = getElementByID(id + '_LayerIndex_0_shapeIndex_10_dataIndex_28');
            expect(spec.getAttribute('fill')).toBe('#FF4500');
            done();
        };
        colormap.refresh();
    });
});