/**
 * Selection Testcase
 */
import { usMap, World_Map, unCountries, randomcountriesData1, africa } from '../data/data.spec';
import { Population_Density } from '../data/PopulationDensity.spec';
import { createElement, remove } from '@syncfusion/ej2-base';
import { MouseEvents } from '../base/events.spec';
import { getElement } from '../../../src/maps/utils/helper';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
import { ILoadedEventArgs, Selection, Maps, Legend, Highlight } from '../../../src/maps/index';
Maps.Inject(Selection, Legend, Highlight);
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
        let select: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            select = new Maps({
                titleSettings: {
                    text: 'US Map',
                },
                layers: [
                    {
                        highlightSettings: {
                            enable: true
                        },
                        selectionSettings:{
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
            select.destroy();
        });
        it('Selection checking', (done: Function) => {
            select.loaded = (args: ILoadedEventArgs) => {
                spec = getElement('container_LayerIndex_0_shapeIndex_2_dataIndex_undefined');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                done();
            };
            select.appendTo('#' + id);
        });
        it('Checking unselect using click', (done: Function) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_2_dataIndex_undefined');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('class')).toBe(null);
            done();
        });
        it('Switching selection element in click', (done: Function) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_3_dataIndex_undefined');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
            done();
        });
        it('selection element in click', (done: Function) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_3_dataIndex_undefined');  
            let ele: object = {};
            ele['type'] = 'touchend';
            ele['target'] = spec;
            let selection : Selection = new Selection(select);
            selection['mouseClick'] (<Element>ele);
            expect(true).toBe(true);
            done();
        });
        it('Selection checking using public method', (done: Function) => {
            select.selectionModule.addSelection(0, 'Minnesota', true);
            spec = getElement('container_LayerIndex_0_shapeIndex_1_dataIndex_undefined');
            expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
            done();
        });
        it('Checking unselect using public method', (done: Function) => {
            select.selectionModule.addSelection(0, 'Minnesota', false);
            spec = getElement('container_LayerIndex_0_shapeIndex_1_dataIndex_undefined');
            expect(spec.getAttribute('class')).toBe(null);
            done();
        });
        it('Checking selection not getting applied for other than map shape', (done: Function) => {
            spec = getElement(id);
            trigger.clickEvent(spec);
            expect(spec.getAttribute('class')).not.toBe('ShapeselectionMapStyle');
            done();
        });
        it('Checking with destroyed map', (done: Function) => {
            select.isDestroyed = true;
            let selection : Selection = new Selection(select);
            spec = getElement(id);
            expect(spec.getAttribute('class')).not.toBe('ShapeselectionMapStyle');
            done();
        });
    });
    describe('Testcases for legend selection', () => {
        let id: string = 'container';
        let worldmap: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            worldmap = new Maps({
                legendSettings: {
                    visible: true,
                    toggleVisibility: false,
                },
                layers: [
                    {
                selectionSettings: {
                    enable: true,
                    enableMultiSelect: false,
                    border:{
                        width: 2,
                        color: "red",
                        opacity: 0.7
                    }
                },
                        shapeDataPath: 'Country',
                        shapePropertyPath: 'name',
                        dataSource : unCountries,
                        shapeData: World_Map,
                        shapeSettings: {
                            colorMapping: [
                                {
                                    value: 'Permanent',
                                    color : '#F05837'
                                },
                                {
                                    value: 'Non-Permanent',
                                    color: '#00743F'
                                }
                            ],
                            colorValuePath: 'Membership'
                        }
                    }
                ]
            });
        });
        afterAll(() => {
            remove(ele);
            worldmap.destroy();
        });
        it('Legend selection checking', (done: Function) => {
            worldmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElement('container_Legend_Shape_Index_0');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                done();
            };
            worldmap.appendTo('#' + id);
        });
        it('Removing legend selection', (done: Function) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_82_dataIndex_9');
            trigger.clickEvent(spec);
            expect(getElement('container_Legend_Shape_Index_0').getAttribute('class')).toBe(null);
            done();
        });
        it('Checking with multiselection between shape and legend', () => {
          worldmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElement('container_Legend_Shape_Index_0');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                spec = getElement('container_LayerIndex_0_shapeIndex_82_dataIndex_9');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');                
            };
            worldmap.layers[0].selectionSettings.enableMultiSelect = true;
            worldmap.refresh();
        });
        it('Checking with multiselection of legend', () => {
            worldmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElement('container_Legend_Shape_Index_1');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                spec = getElement('container_Legend_Shape_Index_0');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                trigger.clickEvent(getElement('container_Legend_Shape_Index_1'));
                trigger.clickEvent(getElement('container_LayerIndex_0_shapeIndex_134_dataIndex_2'));
                trigger.clickEvent(getElement('container_LayerIndex_0_shapeIndex_29_dataIndex_0'));
            };
            worldmap.refresh();
        });
        it('Testing selection by changing enbalemultiselect value dynamically', () => {
            worldmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElement('container_LayerIndex_0_shapeIndex_167_dataIndex_4');
                trigger.clickEvent(spec);
                spec = getElement('container_LayerIndex_0_shapeIndex_29_dataIndex_0');
                expect(spec.getAttribute('class')).toBe(null);
            };
            worldmap.layers[0].selectionSettings.enableMultiSelect = false;
            worldmap.refresh();
        });
    });
    describe('Testing selection is applied or not', () => {
        let id: string = 'maps';
        let world: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            world = new Maps({
                legendSettings: {
                    visible: true,
                    toggleVisibility: true
                },
                layers: [
                    {
                        selectionSettings: {
                            enable: true,
                            enableMultiSelect: false,
                        },
                        shapeDataPath: 'Country',
                        shapePropertyPath: 'name',
                        dataSource : unCountries,
                        shapeData: World_Map,
                        shapeSettings: {
                            colorMapping: [
                                {
                                    value: 'Permanent',
                                    color : '#F05837'
                                },
                                {
                                    value: 'Non-Permanent',
                                    color: '#00743F'
                                }
                            ],
                            colorValuePath: 'Membership'
                        }
                    }
                ]
            });
        });
        afterAll(() => {
            remove(ele);
            world.destroy();
        });
        // it('Legend selection checking', (done: Function) => {
        //     world.loaded = (args: ILoadedEventArgs) => {
        //         spec = getElement('maps_Legend_Shape_Index_0');
        //         trigger.clickEvent(spec);
        //         expect(spec.getAttribute('opacity')).toBe('1');
        //         expect(getElement('maps_LayerIndex_0_shapeIndex_167_dataIndex_4').getAttribute('opacity')).toBe('0');
        //         trigger.clickEvent(spec);
        //         expect(getElement('maps_LayerIndex_0_shapeIndex_167_dataIndex_4').getAttribute('opacity')).toBe('1');
        //         done();
        //     };
        //     world.appendTo('#' + id);
        // });
        describe('Testing bubble, marker and navigation line selection', () => {
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
                                            width: 4
                                        }
                                    },
                                    highlightSettings: {
                                        enable: false,
                                        border: {
                                            color: 'red',
                                            width: 4
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
                                enable: false
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
                                    enable: true
                                },
                                highlightSettings: {
                                    enable: false
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
                                        enable: true
                                    },
                                    highlightSettings: {
                                        enable: false
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
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('class')).toBe('BubbleselectionMapStyle');
                        spec = getElement('container_LayerIndex_0_MarkerIndex_0_dataIndex_3');
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('class')).toBe('MarkerselectionMapStyle');
                        spec = getElement('container_LayerIndex_0_NavigationIndex_0_Line0');
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('class')).toBe('navigationlineselectionMapStyle');
                        spec = getElement('container_LayerIndex_0_NavigationIndex_0_Line1');
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('class')).toBe('navigationlineselectionMapStyle');
                        spec = getElement('container_LayerIndex_0_NavigationIndex_0_Line1');
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('class')).toBe(null);
                        spec = getElement('container');
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('class')).not.toBe('navigationlineselectionMapStyle');
                        done();
                    };
                    world.appendTo('#' + id);
                });
            it('Disabling selection', (done: Function) => {
                world.layers[0].selectionSettings.enable = false;
                world.loaded = (args: ILoadedEventArgs) => {
                    spec = getElement('container_LayerIndex_0_shapeIndex_64_dataIndex_undefined');
                    trigger.clickEvent(spec);
                    expect(spec.getAttribute('class')).toBe(null);
                    done();
                };
                world.refresh();
            });
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
        let selection: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        let spec1: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            selection = new Maps({
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
                        fill: 'red'
                    },
                    initialShapeSelection: [{ shapePath: 'name', shapeValue: 'India'}],
                    selectionSettings: {
                        enable: true,
                        fill: 'green',
                    },
                    shapeData: World_Map,
                    shapeDataPath: 'name',
                    shapePropertyPath: 'name',
                    dataSource: Population_Density,
                    shapeSettings: {
                        colorValuePath: 'density',
                        fill: '#E5E5E5',
                        colorMapping: [
                            {
                                from: 0.00001, to: 100, color: 'yellow', label: '<100'
                            },
                            {
                                from: 100, to: 200, color: 'blue', label: '100 - 200'
                            },
                            {
                                from: 200, to: 300, color: 'pink', label: '200 - 300'
                            },
                            {
                                from: 300, to: 500, color: 'violet', label: '300 - 500'
                            },
                            {
                                from: 500, to: 19000, color: 'orange', label: '>500'
                            }
                        ]
                    }
                }],
            });
        });
        afterAll(() => {
            remove(ele);
            selection.destroy();
        });
        it('Selection checking for legends on shapes', (done: Function) => {
            selection.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_64_dataIndex_56');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('fill')).toBe('yellow');
            done();
        };
            selection.appendTo('#' + id);
        });
        it('Selection checking for shapes on legends', (done: Function) => {
            selection.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_Legend_Shape_Index_2');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('fill')).toBe('pink');
            done();
        };
            selection.refresh();
        });
        it('Dual selection on same legends', (done: Function) => {
            selection.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_Legend_Shape_Index_1');
            trigger.clickEvent(spec);
            trigger.clickEvent(spec);
            expect(spec.getAttribute('fill')).toBe('blue');
            done();
        };
            selection.refresh();
        });
        it('Dual selection on same shapes', (done: Function) => {
            selection.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_92_dataIndex_87');
            trigger.clickEvent(spec);
            trigger.clickEvent(spec);
            expect(spec.getAttribute('fill')).toBe('yellow');
            done();
        };
            selection.refresh();
        });
        it('Different shape selection', (done: Function) => {
            selection.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_72_dataIndex_65');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('fill')).toBe('violet');
            spec = getElement('container_LayerIndex_0_shapeIndex_26_dataIndex_25');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('fill')).toBe('yellow');
            done();
        };
            selection.refresh();
        });
        it('Different legend selection with intearactive legend along with shape highlight', (done: Function) => {
            selection.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_Legend_Index_4');
            trigger.clickEvent(spec);
            spec = getElement('container_Legend_Index_3');
            trigger.clickEvent(spec);
            spec = getElement('container_Legend_Index_4');
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            spec = getElement('container_Legend_Index_0');
            trigger.clickEvent(spec);
            spec = getElement('container_LayerIndex_0_shapeIndex_29_dataIndex_29');
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            spec = getElement('container_LayerIndex_0_shapeIndex_134_dataIndex_125');
            trigger.mousemoveEvent(spec, 0, 0, 0, 0);
            done();
        };
            selection.legendSettings.mode = 'Interactive';
            selection.refresh();
        });
    });

    describe('Testing api based selection', () => {
        let id: string = 'container';
        let selections: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        let spec1: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            selections = new Maps({
                titleSettings: {
                    text: 'WorldMap',
                },
                legendSettings: {
                    visible: true,
                    position: 'Top',
                    mode: "Interactive"
                },
                layers: [{
                    highlightSettings: {
                        enable: true,
                        fill: 'red'
                    },
                    initialShapeSelection: [{ shapePath: 'name', shapeValue: 'India'}],
                    selectionSettings: {
                        enable: true,
                        fill: 'green'
                    },
                    shapeData: World_Map,
                    shapeDataPath: 'name',
                    dataSource: Population_Density,
                    shapeSettings: {
                        colorValuePath: 'density',
                        fill: '#E5E5E5',
                        colorMapping: [
                            {
                                from: 0.00001, to: 100, color: 'yellow', label: '<100'
                            },
                            {
                                from: 100, to: 200, color: 'blue', label: '100 - 200'
                            },
                            {
                                from: 200, to: 300, color: 'pink', label: '200 - 300'
                            },
                            {
                                from: 300, to: 500, color: 'violet', label: '300 - 500'
                            },
                            {
                                from: 500, to: 19000, color: 'orange', label: '>500'
                            }
                        ]
                    }
                }],
            });
        });
        afterAll(() => {
            remove(ele);
            selections.destroy();
        });
        it('Check shape is selected or not', (done: Function) => {
            selections.loaded = (args: ILoadedEventArgs) => {
            spec = getElement('container_LayerIndex_0_shapeIndex_72_dataIndex_65');
            expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
            spec = getElement('container_Legend_Index_3');
            expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
            done();
        };
            selections.appendTo('#' + id);
        });
    });
   
    describe('Testing selection with baselayers', () => {
        let id: string = 'container';
        let selections: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        let spec1: Element;
      
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            selections = new Maps({
                titleSettings: {
                    text: 'WorldMap',
                },
                layers: [{
                    layerType: 'Geometry',
                    shapeData: World_Map,
                    shapeSettings: {
                        fill: '#80306A',
                        colorValuePath: 'drillColor'
                    },
                    highlightSettings: {
                        enable: true,
                        fill: '#80306A'
                    },
                    selectionSettings: {
                        enable: true,
                        fill: 'red',
                        opacity: 1,
                        border: {
                            color: 'yellow', width: 1
                        }
                    },
                    tooltipSettings: {
                        visible: true,
                        valuePath: 'name'
                    }
                },
                {
                    layerType: 'Geometry',
                    shapeData: africa,
                    shapeSettings: {
                        fill: '#80306A',
                        colorValuePath: 'drillColor'
                    },
                    highlightSettings: {
                        enable: true,
                        fill: '#80306A'
                    },
                    selectionSettings: {
                        enable: true,
                        fill: 'red',
                        opacity: 1,
                        border: {
                            color: 'yellow', width: 1
                        }
                    },
                    tooltipSettings: {
                        visible: true,
                        valuePath: 'name'
                    }
                }]
            });
        });
        afterAll(() => {
            remove(ele);
            selections.destroy();
        });
        it('Check shape is selected or not using baseLayerIndex', (done: Function) => {
            selections.loaded = (args: ILoadedEventArgs) => {
                selections.shapeSelection(selections.baseLayerIndex, 'admin', 'Angola', true);
                spec = getElement('container_LayerIndex_0_shapeIndex_1_dataIndex_null');
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                done();
            }
            selections.appendTo('#' + id);
        });
        it('Set the layer type as sublayer', (done: Function) => {
            selections.loaded = (args: ILoadedEventArgs) => {
                selections.shapeSelection(1, 'admin', 'Angola', true);
                spec = getElement('container_LayerIndex_1_shapeIndex_0_dataIndex_null');
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                done();
            }
            selections.layers[1].type = 'SubLayer',
            selections.refresh();
            selections.appendTo('#' + id);
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