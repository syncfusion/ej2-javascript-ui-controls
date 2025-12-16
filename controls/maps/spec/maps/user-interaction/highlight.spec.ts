/**
 * Highlight Testcase
 */
import { usMap, World_Map, randomcountriesData1 } from '../data/data.spec';
import { Population_Density } from '../data/PopulationDensity.spec';
import { createElement, remove } from '@syncfusion/ej2-base';
import { MouseEvents } from '../base/events.spec';
import { getElement } from '../../../src/maps/utils/helper';
import  {profile , inMB, getMemoryProfile, sampleMemoryMB} from '../common.spec';
import { ILoadedEventArgs, Highlight, Maps, Legend, Selection } from '../../../src/maps/index';
Maps.Inject(Highlight, Legend, Selection);
describe('Selection Settings', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Testing selection is applied or not', () => {
        let id: string = 'container';
        let highlight: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            highlight = new Maps({
                titleSettings: {
                    text: 'US Map',
                },
                layers: [
                    {
                        highlightSettings: {
                            enable: true
                        },
                        selectionSettings: {
                            enable: true,
                            enableMultiSelect: false
                        },
                        shapeData: usMap,
                    }
                ],
            });
        });
        afterAll(() => {
            remove(ele);
            highlight.destroy();
        });
        it('Highlight checking', (done: Function) => {
            highlight.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_2_dataIndex_undefined');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            expect(spec.getAttribute('class')).toBe('highlightMapStyle');
            done();
        };
            highlight.appendTo('#' + id);
        });
        it('Highlight same element', (done: Function) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_2_dataIndex_undefined');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            expect(spec.getAttribute('class')).toBe('highlightMapStyle');
            done();
        });
        it('Moving to next element in highlight', (done: Function) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_4_dataIndex_undefined');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            expect(spec.getAttribute('class')).toBe('highlightMapStyle');
            done();
        });
        it('Checking highlight not getting applied for other than map shape', (done: Function) => {
            spec = getElement(id);
            trigger.mousemoveEvent(spec, 0 , 0 , 0 , 0);
            expect(spec.getAttribute('class')).not.toBe('selectionMapStyle');
            done();
        });
        it('Highlight checking using public method', (done: Function) => {
            highlight.highlightModule.addHighlight(0, 'Minnesota', true);
            spec = getElement('container_LayerIndex_0_shapeIndex_1_dataIndex_undefined');
            expect(spec.getAttribute('class')).toBe('highlightMapStyle');
            done();
        });
        it('Checking remove highlight using public method', (done: Function) => {
            highlight.highlightModule.addHighlight(0, 'Minnesota', false);
            spec = getElement('container_LayerIndex_0_shapeIndex_1_dataIndex_undefined');
            expect(spec.getAttribute('class')).toBe(null);
            done();
        });
    });
});

describe('Testing bubble, marker and navigation line highlight', () => {
    let id: string = 'container';
    let world: Maps;
    let trigger: MouseEvents = new MouseEvents();
    let ele: HTMLDivElement;
    let spec: Element;
    beforeAll(() => {
        ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
        document.body.appendChild(ele);
        world = new Maps({
            titleSettings: {
                text: 'World Map'
            },
            layers: [
                {
                    navigationLineSettings: [
                        {
                            selectionSettings: {
                                enable: true,
                                enableMultiSelect: false,
                                border: {
                                    color: 'red',
                                    width: 4,
                                    opacity: 0.7
                                }
                            },
                            highlightSettings: {
                                enable: true,
                                border: {
                                    color: 'red',
                                    width: 4,
                                    opacity: 0.7
                                }
                            },
                            color: 'purple',
                            width: 4,
                            latitude: [37.16031654673677, 23.885837699862005, 71.85622888185527, 66.65297740055279],
                            longitude: [-97.734375, 78.046875, -39.7265625, 86.8359375],
                            visible: true,
                            angle: 0.8
                        }
                    ],
                    highlightSettings: {
                        enable: true
                    },
                    selectionSettings: {
                        enable: true,
                        enableMultiSelect: true
                    },
                    shapeData: World_Map,
                    shapePropertyPath: 'continent',
                    shapeDataPath: 'continent',
                    dataSource: randomcountriesData1,
                    bubbleSettings: [{
                        selectionSettings: {
                            enable: true,
                            border: {
                                color: 'red',
                                width: 4,
                                opacity: 0.7
                            }
                        },
                        highlightSettings: {
                            enable: true,
                            border: {
                                color: 'red',
                                width: 4,
                                opacity: 0.7
                            }
                        },
                        visible: true,
                        dataSource: randomcountriesData1,
                        bubbleType: 'Square',
                        valuePath: 'Sales',
                        minRadius: 20,
                        maxRadius: 30,
                        fill: '#379F64',
                    }],
                    markerSettings: [
                        {
                            selectionSettings: {
                                enable: true,
                                border: {
                                    color: 'red',
                                    width: 4,
                                    opacity: 0.7
                                }
                            },
                            highlightSettings: {
                                enable: true,
                                border: {
                                    color: 'red',
                                    width: 4,
                                    opacity: 0.7
                                }
                            },
                            fill: '#A569BD',
                            height: 30,
                            width: 30,
                            visible: true,
                            shape: 'Circle',
                            dataSource: [
                                { Name: 'USA', latitude: 38.8833, longitude: -77.0167 },
                                { Name: 'Brazil', latitude: -15.7833, longitude: -47.8667 },
                                { Name: 'India', latitude: 21.0000, longitude: 78.0000 },
                                { Name: 'China', latitude: 35.0000, longitude: 103.0000 },
                                { Name: 'Indonesia', latitude: -6.1750, longitude: 106.8283 }
                            ]
                    }]
                }
            ]
        });
    });
    afterAll(() => {
        remove(ele);
        world.destroy();
    });
    it('Over all selection checking', (done: Function) => {
            world.loaded = (args: ILoadedEventArgs) => {
                spec = getElement('container_LayerIndex_0_BubbleIndex_0_dataIndex_2');
                trigger.mousemoveEvent(spec, 0, 0, 0, 0);
                expect(spec.getAttribute('class')).toBe('highlightMapStyle');
                spec = getElement('container_LayerIndex_0_MarkerIndex_0_dataIndex_3');
                trigger.mousemoveEvent(spec, 0, 0, 0, 0);
                expect(spec.getAttribute('class')).toBe('highlightMapStyle');
                spec = getElement('container_LayerIndex_0_NavigationIndex_0_Line0');
                trigger.mousemoveEvent(spec, 0, 0, 0, 0);
                expect(spec.getAttribute('class')).toBe('highlightMapStyle');
                spec = getElement('container_LayerIndex_0_NavigationIndex_0_Line1');
                trigger.mousemoveEvent(spec, 0, 0, 0, 0);
                expect(spec.getAttribute('class')).toBe('highlightMapStyle');
                spec = getElement('container_MapAreaBorder');
                trigger.mousemoveEvent(spec, 0, 0, 0, 0);
                expect(spec.getAttribute('class')).toBe(null);
                spec = getElement('container');
                trigger.mousemoveEvent(spec, 0, 0, 0, 0);
                expect(spec.getAttribute('class')).not.toBe('highlightMapStyle');
                done();
            };
            world.appendTo('#' + id);
        });
    it('Disabling selection', (done: Function) => {
        world.layers[0].highlightSettings.enable = false;
        world.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_64_dataIndex_undefined');
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            expect(spec.getAttribute('class')).not.toBe('highlightMapStyle');
            done();
        };
        world.refresh();
    });
    it('Disabling bubble highlight', (done: Function) => {
        world.layers[0].bubbleSettings[0].highlightSettings.enable = false;
        world.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_NavigationIndex_0_Line0');
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            spec = getElement('container_LayerIndex_0_BubbleIndex_0_dataIndex_6');
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            expect(spec.getAttribute('class')).toBe(null);
            done();
        };
        world.refresh();
    });

});
describe('Highlight Settings', () => {
    describe('Testing highlight is applied or not', () => {
        let id: string = 'container';
        let highlight: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            highlight = new Maps({
                titleSettings: {
                    text: 'WorldMap',
                },
                legendSettings: {
                    visible: true,
                    position: 'Top',
                    shapeBorder: { color: 'orange', width: 1, opacity: 0.7},
                    border: {
                        width: 2,
                        color:"red",
                        opacity:0.5  
                    }
                },
                layers: [{
                    highlightSettings: {
                        enable: true,
                        fill: 'red',
                        border: { color: 'green', width: 3}
                    },
                    selectionSettings: {
                        enable: true,
                        fill: 'green'
                    },
                    shapeData: World_Map,
                    shapeDataPath: 'name',
                    dataSource: Population_Density,
                    shapeSettings: {
                        colorValuePath: 'density',
                        border: { color: 'lime', width: 2},
                        fill: '#E5E5E5',
                        colorMapping: [
                            {
                                from: 0.00001, to: 100, color: 'rgb(153,174,214)', label: '<100'
                            },
                            {
                                from: 100, to: 200, color: 'rgb(115,143,199)', label: '100 - 200'
                            },
                            {
                                from: 200, to: 300, color: 'rgb(77,112,184)', label: '200 - 300'
                            },
                            {
                                from: 300, to: 500, color: 'rgb(38,82,168)', label: '300 - 500'
                            },
                            {
                                from: 500, to: 19000, color: 'rgb(0,51,153)', label: '>500'
                            }
                        ]
                    }
                }],
            });
        });
        afterAll(() => {
            remove(ele);
            highlight.destroy();
        });
        it('Highlight checking for legends on shapes', (done: Function) => {
            highlight.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_134_dataIndex_125');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            done();
        };
            highlight.appendTo('#' + id);
        });
        it('Highlight checking for shapes on legends', (done: Function) => {
            highlight.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_Legend_Shape_Index_0');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            done();
        };
            highlight.refresh();
        });
        it('Highlight checking for shapes on legends', (done: Function) => {
            highlight.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_Legend_Shape_Index_0');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            spec = getElement('container_MapAreaBorder');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            spec = getElement('container_Legend_Shape_Index_1');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            spec = getElement('container_Legend_Shape_Index_1');
            trigger.clickEvent(spec);
            spec = getElement('container_MapAreaBorder');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            spec = getElement('container_Legend_Shape_Index_1');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            done();
        };
            highlight.refresh();
        });
        it('Highlight after selection on the legends', (done: Function) => {
            highlight.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_Legend_Shape_Index_2');
            trigger.clickEvent(spec);
            spec = getElement('container_Legend_Shape_Index_2');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            spec = getElement('container_Legend_Shape_Index_1');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            done();
        };
            highlight.refresh();
        });
        it('Highlight after selection on shapes', (done: Function) => {
            highlight.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_26_dataIndex_25');
            trigger.clickEvent(spec);
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            expect(spec.getAttribute('class') === 'ShapeselectionMapStyle').toBe(true);
            spec = getElement('container_LayerIndex_0_shapeIndex_108_dataIndex_95');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            spec = getElement('container_MapAreaBorder');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            spec = getElement('container_LayerIndex_0_shapeIndex_29_dataIndex_29');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            spec = getElement('container_LayerIndex_0_shapeIndex_26_dataIndex_25');
            trigger.clickEvent(spec);
            done();
        };
            highlight.refresh();
        });
        it('Legend selection and highlight in interactive legend', (done: Function) => {
            highlight.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_Legend_Index_0');
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            expect(spec.getAttribute('stroke') === 'green').toBe(true);
            let shapeEle = getElement('container_LayerIndex_0_shapeIndex_4_dataIndex_4');
            expect(shapeEle.getAttribute('stroke') === 'green').toBe(true);
            trigger.mousemoveEvent(getElement('container_Legend_Index_1'), 0, 0, 0, 0);
            expect(spec.getAttribute('stroke') === 'orange').toBe(true);
            expect(shapeEle.getAttribute('stroke') === 'lime').toBe(true);
            trigger.clickEvent(spec);
            spec = getElement('container_Legend_Index_1');
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            spec = getElement('container_MapAreaBorder');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            spec = getElement('container_Legend_Index_0');
            trigger.clickEvent(spec);
            done();
        };
            highlight.legendSettings.mode = 'Interactive';
            highlight.refresh();
        });
        it('Legend and shape highlight with toggled legend', (done: Function) => {
            highlight.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_Legend_Index_0');
            trigger.clickEvent(spec);
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            expect(spec.getAttribute('stroke') === 'orange').toBe(false);
            let shapeEle = getElement('container_LayerIndex_0_shapeIndex_4_dataIndex_4');
            trigger.mousemoveEvent(shapeEle, 0, 0, 0, 0);
            expect(shapeEle.getAttribute('stroke') === 'lime').toBe(true);
            expect(shapeEle.getAttribute('stroke-opacity') === '1').toBe(true);
            spec = getElement('container_Legend_Index_0');
            trigger.clickEvent(spec);
            let shapeOpacity = getElement('container_Legend_Index_0');            
            expect(shapeOpacity.getAttribute('fill-opacity') === '1').toBe(true);
            expect(shapeOpacity.getAttribute('stroke-opacity') === '0.7').toBe(true);
            done();
        };
            highlight.legendSettings.toggleLegendSettings.enable = true;
            highlight.refresh();
        });
        it('Shape highlight with other window', (done: Function) => {
            highlight.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_29_dataIndex_29');
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            let eventObj: Object = {};
            eventObj = {
                target: spec,
                type: 'mousemove',
                pageX: spec.getBoundingClientRect().left,
                pageY: (spec.getBoundingClientRect().top + 10)
            };
            highlight.mouseLeaveOnMap(<PointerEvent>eventObj);
            done();
        };
            highlight.legendSettings.toggleLegendSettings.enable = true;
            highlight.legendSettings.mode = 'Interactive';
            highlight.refresh();
        });
        it('Checking opacity with null value', (done: Function) => {
            highlight.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_29_dataIndex_29');
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            let eventObj: Object = {};
            eventObj = {
                target: spec,
                type: 'mousemove',
                pageX: spec.getBoundingClientRect().left,
                pageY: (spec.getBoundingClientRect().top + 10)
            };
            highlight.mouseLeaveOnMap(<PointerEvent>eventObj);
            done();
        };
            highlight.layers[0].highlightSettings.opacity = null;
            highlight.layers[0].highlightSettings.border.opacity = null;
            highlight.refresh();
        });
    });
    describe('Highlight Settings', () => {
        describe('Testing highlight is applied or not', () => {
            let id: string = 'container';
            let highlight: Maps;
            let trigger: MouseEvents = new MouseEvents();
            let ele: HTMLDivElement;
            let spec: Element;
            beforeAll(() => {
                ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
                document.body.appendChild(ele);
                highlight = new Maps({
                    titleSettings: {
                        text: 'WorldMap',
                    },
                    legendSettings: {
                        visible: true,
                        position: 'Top',
                    },
                    layers: [{
                        highlightSettings: {
                            enable: true,
                        },
                        selectionSettings: {
                            enable: true,
                            enableMultiSelect: true
                        },
                        shapeData: World_Map,
                        shapeDataPath: 'name',
                        dataSource: Population_Density,
                        shapeSettings: {
                            colorValuePath: 'density',
                            fill: '#E5E5E5',
                            colorMapping: [
                                {
                                    from: 0.00001, to: 100, color: 'rgb(153,174,214)', label: '<100'
                                },
                                {
                                    from: 100, to: 200, color: 'rgb(115,143,199)', label: '100 - 200'
                                },
                                {
                                    from: 200, to: 300, color: 'rgb(77,112,184)', label: '200 - 300'
                                },
                                {
                                    from: 300, to: 500, color: 'rgb(38,82,168)', label: '300 - 500'
                                },
                                {
                                    from: 500, to: 19000, color: 'rgb(0,51,153)', label: '>500'
                                }
                            ]
                        }
                    }],
                });
            });
            afterAll(() => {
                remove(ele);
                highlight.destroy();
            });
            it('Highlight checking if highlight fill color as null', (done: Function) => {
                highlight.loaded = (args: ILoadedEventArgs) => {
                spec = getElement('container_LayerIndex_0_shapeIndex_72_dataIndex_65');
                trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
                expect(spec.getAttribute('fill')).toBe('rgb(38,82,168)');
                done();
            };
                highlight.appendTo('#' + id);
            });
            it('Selection settings default fill color as null', (done: Function) => {
                spec = getElement('container_LayerIndex_0_shapeIndex_72_dataIndex_65');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('fill')).toBe('rgb(38,82,168)');
                trigger.clickEvent(spec);
                done();
            });
            it('Check highlight with multiple legend selection', (done: Function) => {
                trigger.clickEvent(getElement('container_Legend_Shape_Index_3'));
                trigger.clickEvent(getElement('container_Legend_Shape_Index_4'));
                spec = getElement('container_LayerIndex_0_shapeIndex_72_dataIndex_65');
                trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                done();
            });
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