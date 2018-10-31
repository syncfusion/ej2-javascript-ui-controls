/**
 * Selection Testcase
 */
import { usMap, World_Map, unCountries, randomcountriesData1 } from '../data/data.spec';
import { createElement, remove } from '@syncfusion/ej2-base';
import { MouseEvents } from '../base/events.spec';
import { getElement } from '../../../src/maps/utils/helper';
import { ILoadedEventArgs, Selection, Maps, Legend } from '../../../src/maps/index';
Maps.Inject(Selection);
describe('Selection Settings', () => {
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
                spec = getElement('container_LayerIndex_0_ShapeIndex_2_dataIndex_undefined');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
                done();
            };
            select.appendTo('#' + id);
        });
        it('Checking unselect using click', (done: Function) => {
            spec = getElement('container_LayerIndex_0_ShapeIndex_2_dataIndex_undefined');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('class')).toBe(null);
            done();
        });
        it('Switching selection element in click', (done: Function) => {
            spec = getElement('container_LayerIndex_0_ShapeIndex_3_dataIndex_undefined');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
            done();
        });
        it('selection element in click', (done: Function) => {
            spec = getElement('container_LayerIndex_0_ShapeIndex_3_dataIndex_undefined');  
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
            spec = getElement('container_LayerIndex_0_ShapeIndex_1_dataIndex_undefined');
            expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
            done();
        });
        it('Checking unselect using public method', (done: Function) => {
            select.selectionModule.addSelection(0, 'Minnesota', false);
            spec = getElement('container_LayerIndex_0_ShapeIndex_1_dataIndex_undefined');
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
        // it('Legend selection checking', (done: Function) => {
        //     worldmap.loaded = (args: ILoadedEventArgs) => {
        //         spec = getElement('container_Legend_Shape_Index_0');
        //         trigger.clickEvent(spec);
        //         expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
        //         done();
        //     };
        //     worldmap.appendTo('#' + id);
        // });
        // it('Removing legend selection', (done: Function) => {
        //     spec = getElement('container_LayerIndex_0_ShapeIndex_26_dataIndex_null');
        //     trigger.clickEvent(spec);
        //     expect(getElement('container_Legend_Shape_Index_0').getAttribute('class')).toBe(null);
        //     done();
        // });
        // it('Checking with multiselection', (done: Function) => {
        //     worldmap.layers[0].selectionSettings.enableMultiSelect = true;
        //     worldmap.refresh();
        //     spec = getElement('container_Legend_Shape_Index_0');
        //     trigger.clickEvent(spec);
        //     expect(spec.getAttribute('class')).toBe(null);
        //     spec = getElement('container_LayerIndex_0_ShapeIndex_26_dataIndex_null');
        //     trigger.clickEvent(spec);
        //     expect(spec.getAttribute('class')).toBe('ShapeselectionMapStyle');
        //     done();
        // });
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
        //         expect(getElement('maps_LayerIndex_0_ShapeIndex_167_dataIndex_4').getAttribute('opacity')).toBe('0');
        //         trigger.clickEvent(spec);
        //         expect(getElement('maps_LayerIndex_0_ShapeIndex_167_dataIndex_4').getAttribute('opacity')).toBe('1');
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
                        spec = getElement('container_LayerIndex_0_MarkerIndex_0_DataIndex_3');
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
                    spec = getElement('container_LayerIndex_0_ShapeIndex_64_dataIndex_undefined');
                    trigger.clickEvent(spec);
                    expect(spec.getAttribute('class')).toBe(null);
                    done();
                };
                world.refresh();
            });
        });
    });
});