//ts-lint disable
import { Maps, ILoadedEventArgs } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { internetUsers, usa, Africa_Continent,  topPopulation, electionData } from '../events/eventdata.spec';
import { World_Map } from '../data/data.spec';
import { MouseEvents } from '../../../spec/maps/base/events.spec';
import { getElement } from '../../../src/maps/utils/helper';
import { Legend, Marker, IBubbleRenderingEventArgs, ILabelRenderingEventArgs, IAnnotationRenderingEventArgs, IMarkerRenderingEventArgs, ISelectionEventArgs, IShapeRenderingEventArgs } from '../../../src/maps/index';
Maps.Inject(Legend, Marker);

export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
describe('Map Events tesing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Map datalabel  event testing', () => {
        let id: string = 'datalabel';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                zoomSettings: {
                    enable: false
                },
                layers: [
                    {
                        dataLabelSettings: {
                            visible: true,
                            labelPath: 'name',
                            smartLabelMode: 'Trim'
                        },
                        shapeData: usa,
                        shapeSettings: {
                            autofill: true
                        },
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'name'
                        },
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('checking datalabel event border', (done: Function) => {
            map.dataLabelRendering = (args: ILabelRenderingEventArgs): void => {
                if (args.text === 'Alaska') {
                    args.text ='Event';
                }
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('datalabel_Layer_Collections');
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('datalabel_LayerIndex_0_dataLableIndex_Group');
                expect(spec.childElementCount).toBe(51);
                spec = document.getElementById('datalabel_LayerIndex_0_shapeIndex_50_LabelIndex_50');
                expect(spec.textContent).toBe("Event");
                done();
            };
            map.refresh();
        });
        // it('checking datalabel event cancel', (done: Function) => {
        //     map.dataLabelRendering = (args: ILabelRenderingEventArgs): void => {
        //         if (args.text === 'Alaska') {
        //             args.datalabel.visible = false;
        //         } else {
        //             args.datalabel.visible = true;
        //         }
        //     };
        //     map.loaded = (args: ILoadedEventArgs): void => {
        //         spec = document.getElementById('datalabel_Layer_Collections');
        //         expect(spec.childElementCount).toBe(2);
        //         spec = document.getElementById('datalabel_LayerIndex_0_dataLableIndex_Group');
        //         expect(spec != null).toBe(true);
        //         done();
        //     };
        //     map.refresh();
        // });
        it('checking datalabel event fill', (done: Function) => {
            map.dataLabelRendering = (args: ILabelRenderingEventArgs): void => {
                args.fill = 'Blue';
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('datalabel_Layer_Collections');
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('datalabel_LayerIndex_0_dataLableIndex_Group');
                expect(spec.childElementCount).toBe(51);
                spec = document.getElementById('datalabel_LayerIndex_0_shapeIndex_2_LabelIndex_2');
                expect(spec.textContent).toBe("Montana");
                done();
            };
            map.layers[0].dataLabelSettings.visible = true;
            map.refresh();
        });
        it('checking datalabel event Border', (done: Function) => {
            map.dataLabelRendering = (args: ILabelRenderingEventArgs): void => {
                args.border.width = 2;
                args.border.color = 'red';
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('datalabel_svg');
                expect(spec.childElementCount).toBe(3);
                spec = document.getElementById('datalabel_MapBorder');
                expect(spec.getAttribute('stroke')).toBe("#DDDDDD");
                spec = document.getElementById('datalabel_MapAreaBorder');
                expect(spec.getAttribute('stroke-width')).toBe("1");
                done();
            };
            map.layers[0].dataLabelSettings.visible = true;
            map.refresh();
        });
        it('checking datalabel event label', (done: Function) => {
            map.dataLabelRendering = (args: ILabelRenderingEventArgs): void => {
                if (args.text === 'Alaska') {
                    args.template = '<div>Datalabel Event</div>';
                    }
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('datalabel_Layer_Collections');
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('datalabel_LayerIndex_0_dataLableIndex_Group');
                expect(spec != null).toBe(true);
                done();
            };
            map.layers[0].dataLabelSettings.visible = true;
            map.refresh();
        });
    });
    describe('Bubble testing', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                format: 'n',
        useGroupingSeparator: true,
        zoomSettings: {
            enable: true,
            horizontalAlignment: 'Near',
            toolBarOrientation: 'Vertical',
            pinchZooming: true
        },
        titleSettings: {
            text: 'Top 30 countries with highest Internet users',
            textStyle: {
                size: '16px'
            }
        },
        layers: [
            {
                shapeDataPath: 'name',
                shapePropertyPath: 'name',
                shapeData: World_Map,
                shapeSettings: {
                    fill: '#E5E5E5'
                },
                bubbleSettings: [
                    {
                        visible: true,
                        valuePath: 'value',
                        colorValuePath: 'color',
                        animationDuration:0,
                        minRadius: 3,
                        maxRadius: 70,
                        opacity: 0.8,
                        dataSource: internetUsers,
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'population',
                            template: '#template'
                        },
                    }
                ]
            }
        ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('checking bubble event border', (done: Function) => {
            map.bubbleRendering = (args: IBubbleRenderingEventArgs): void => {
                args.border.color = 'red';
                args.border.width =3;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('container_LayerIndex_0_bubble_Group_0');
                expect(spec.childElementCount).toBe(30);
                spec = document.getElementById('container_LayerIndex_0_BubbleIndex_0_dataIndex_1');
                expect(spec.getAttribute('stroke')).toBe("red");
                expect(spec.getAttribute('stroke-width')).toBe("3");
                done();
            };
            map.refresh();
        });
        it('checking bubble event fill', (done: Function) => {
            map.bubbleRendering = (args: IBubbleRenderingEventArgs): void => {
                if(args.data['name'] === 'India') {
                    args.fill = 'yellow';
                }
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('container_LayerIndex_0_bubble_Group_0');
                expect(spec.childElementCount).toBe(30);
                spec = document.getElementById('container_LayerIndex_0_BubbleIndex_0_dataIndex_1');
                expect(spec.getAttribute('fill')).toBe("yellow");
                done();
            };
            map.refresh();
        });
        it('checking bubble event cx', (done: Function) => {
            map.bubbleRendering = (args: IBubbleRenderingEventArgs): void => {
                if(args.data['name'] === 'India') {
                    args.cx = 100;
                }
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('container_LayerIndex_0_bubble_Group_0');
                expect(spec.childElementCount).toBe(30);
                spec = document.getElementById('container_LayerIndex_0_BubbleIndex_0_dataIndex_0');
                expect(spec.getAttribute('r')).toBe("70");
                done();
            };
            map.refresh();
        });
        it('checking bubble event cy', (done: Function) => {
            map.bubbleRendering = (args: IBubbleRenderingEventArgs): void => {
                if(args.data['name'] === 'India') {
                    args.cy = 100;
                }
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('container_LayerIndex_0_bubble_Group_0');
                expect(spec.childElementCount).toBe(30);
                spec = document.getElementById('container_LayerIndex_0_BubbleIndex_0_dataIndex_1');
                expect(spec !== null).toBe(true);
                done();
            };
            map.refresh();
        });
        it('checking bubble event radius', (done: Function) => {
            map.bubbleRendering = (args: IBubbleRenderingEventArgs): void => {
                args.radius = 15;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('container_LayerIndex_0_bubble_Group_0');
                expect(spec.childElementCount).toBe(30);
                spec = document.getElementById('container_LayerIndex_0_BubbleIndex_0_dataIndex_1');
                expect(spec.getAttribute('r')).toBe("15");
                done();
            };
            map.refresh();
        });
        it('checking bubble event radius', (done: Function) => {
            map.bubbleRendering = (args: IBubbleRenderingEventArgs): void => {
                if(args.data['name'] === 'India') {
                    args.cancel =true;
                }
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('container_LayerIndex_0_bubble_Group_0');
                expect(spec.childElementCount).toBe(29);
                expect(spec != null).toBe(true);
                done();
            };
            map.refresh();
        });
    });
    describe('Annotation testing', () => {
        let id: string = 'maps';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                zoomSettings: {
                    enable: false
                },
                annotations: [
                    {
                        content: '#maps-annotation',
                        x: '0%', y: '50%'
                    }, {
                        content: '#compass-maps',
                        x: '80%', y: '5%'
                    }
                ],
                layers: [
                    {
                        shapeDataPath: 'name',
                        shapePropertyPath: 'name',
                        shapeData: Africa_Continent,
                        shapeSettings: {
                            fill: 'url(#grad1)'
                        },
                        markerSettings: [
                            {
                                visible: true,
                                template: '<h3 style="color:white">{{:name}}</h3>',
                                animationDuration: 1,
                                dataSource: [{
                                    name: 'Africa', latitude: 13.97274101999902, longitude: 20.390625
                                }]
                            }
                        ]
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('checking Annotation event content', (done: Function) => {
            map.annotationRendering = (args: IAnnotationRenderingEventArgs): void => {
                if (args.content === '#compass-maps') {
                    args.content = 'Annotation Event';
                }
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('maps_Annotations_Group') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('maps_Annotation_1');
                expect(spec.textContent).toBe("Annotation Event");
                done();
            };
            map.refresh();
        });
        it('checking Annotation event content', (done: Function) => {
            map.annotationRendering = (args: IAnnotationRenderingEventArgs): void => {
                if (args.content === '#compass-maps') {
                    args.cancel = true;
                }
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('maps_Annotations_Group') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('maps_Annotation_1');
                expect(spec !== null).toBe(true);
                done();
            };
            map.refresh();
        });
    });
    describe('Marker testing', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                useGroupingSeparator: true,
                format: 'n',
                zoomSettings: {
                    enable: false
                },
                titleSettings: {
                    text: 'Top 25 populated cities in the world',
                    textStyle: {
                        size: '16px'
                    }
                },
                layers: [
                    {
                        shapeData: World_Map,
                        dataSource: topPopulation,
                        shapeSettings: {
                            fill: '#C3E6ED'
                        },
                        markerSettings: [
                            {
                                dataSource: topPopulation,
                                visible: true,
                                animationDuration: 0,
                                shape: 'Circle',
                                fill: 'white',
                                width: 3,
                                border: { width: 2, color: '#285255' },
                                tooltipSettings: {
                                    template: '#template',
                                    visible: true,
                                    valuePath: 'population',
                                }
                            },
                        ]
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('checking marker event height', (done: Function) => {
            map.markerRendering = (args: IMarkerRenderingEventArgs): void => {
                args.height = 10;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('container_Markers_Group');
                expect(spec.childElementCount).toBe(25);
                spec = document.getElementById('container_LayerIndex_0_MarkerIndex_0_dataIndex_4');
                expect(spec.getAttribute('r')).toBe("3.25");
                done();
            };
            map.refresh();
        });
        it('checking marker event width', (done: Function) => {
            map.markerRendering = (args: IMarkerRenderingEventArgs): void => {
                args.width = 10;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('container_Markers_Group');
                expect(spec.childElementCount).toBe(25);
                spec = document.getElementById('container_LayerIndex_0_MarkerIndex_0_dataIndex_4');
                expect(spec.getAttribute('r')).toBe("5");
                done();
            };
            map.refresh();
        });
        it('checking marker event shape', (done: Function) => {
            map.markerRendering = (args: IMarkerRenderingEventArgs): void => {
                args.shape = "Rectangle";
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('container_Markers_Group');
                expect(spec.childElementCount).toBe(25);
                spec = document.getElementById('container_LayerIndex_0_MarkerIndex_0_dataIndex_0');
                expect(spec.getAttribute('height')).toBe("10");
                expect(spec.getAttribute('width')).toBe("3");
                done();
            };
            map.refresh();
        });
        it('checking marker event image', (done: Function) => {
            map.markerRendering = (args: IMarkerRenderingEventArgs): void => {
                args.imageUrl = "./images/atm.png";
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('container_Markers_Group');
                expect(spec !== null).toBe(true);
                done();
            };
            map.refresh();
        });
        it('checking marker event border', (done: Function) => {
            map.markerRendering = (args: IMarkerRenderingEventArgs): void => {
                args.border.color = "lime";
                args.border.width = 2.5;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('container_Markers_Group');
                expect(spec.childElementCount).toBe(25);
                spec = document.getElementById('container_LayerIndex_0_MarkerIndex_0_dataIndex_1');
                expect(spec.getAttribute('stroke')).toBe("lime");
                expect(spec.getAttribute('stroke-width')).toBe("2.5");
                done();
            };
            map.refresh();
        });
        it('checking marker event template', (done: Function) => {
            map.markerRendering = (args: IMarkerRenderingEventArgs): void => {
                if (args.data['name'] === 'Los Angeles') {
                    args.template = '<div>Event</div>'
                }
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                expect(spec !== null).toBe(true);
                done();
            };
            map.refresh();
        });
        it('checking marker event cancel', (done: Function) => {
            map.markerRendering = (args: IMarkerRenderingEventArgs): void => {
                if (args.data['name'] === 'Tokyo') {
                    args.cancel = true;
                }
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                spec = document.getElementById('container_Markers_Group');
                expect(spec.childElementCount).toBe(24);
                expect(spec !== null).toBe(true);
                done();
            };
            map.refresh();
        });

        it('checking loaded event with args', (done: Function) => {
            map.loaded = (args: ILoadedEventArgs): void => {
                args.isResized = false;
                spec = document.getElementById('container_Layer_Collections') 
                expect(spec.childElementCount).toBe(2);
                done();
            };
            map.refresh();
        });
    });
    describe('Shape Highlight testing', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let trigger: MouseEvents = new MouseEvents();
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                titleSettings: {
                    text: 'USA Election Results - 2016',
                    textStyle: {
                        size: '16px'
                    }
                },
                legendSettings: {
                    visible: true,
                    mode: 'Interactive',
                    position: 'Top',
                    width: '80%',
                        textStyle: {
                            fontWeight: '400',
                            size: '14px'
                        }
                },
                zoomSettings: {
                    enable: false
                },
                layers: [
                    {
                        shapeData: usa,
                        shapePropertyPath:  'name',
                        shapeDataPath:  'State',
                        dataSource : electionData,
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'State'
                        },
                        highlightSettings: {
                            enable: true,
                            fill: '#A3B0D0'
                        },
                        selectionSettings: {
                            enable: true,
                            fill: '#4C515B ',
                            opacity: 1
                        },
                        shapeSettings: {
                        colorValuePath: 'Candidate',
                        colorMapping: [
                        {
                            value: 'Trump', color: '#D84444'
                        },
                        {
                            value: 'Clinton', color: '#316DB5'
                        }
                    ]
                }
            }
            ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('checking shape highlight fill', (done: Function) => {
            map.shapeHighlight = (args: ISelectionEventArgs): void => {
                args.fill = "green";
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = getElement('container_LayerIndex_0_shapeIndex_2_dataIndex_26');
                trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
                expect(spec.getAttribute('fill')).toBe('#D84444');
                done();
            };
            map.refresh();
        });
        it('checking shape highlight opacity', (done: Function) => {
            map.shapeHighlight = (args: ISelectionEventArgs): void => {
                args.opacity = 0.5;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = getElement('container_LayerIndex_0_shapeIndex_2_dataIndex_26');
                trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
                expect(spec.getAttribute('fill-opacity')).toBe('1');
                done();
            };
            map.refresh();
        });
        it('checking shape highlight border', (done: Function) => {
            map.shapeHighlight = (args: ISelectionEventArgs): void => {
                args.border.color = 'green';
                args.border.width = 2;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = getElement('container_LayerIndex_0_shapeIndex_2_dataIndex_26');
                trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
                expect(spec.getAttribute('stroke-width')).toBe('0');
                done();
            };
            map.refresh();
        });
    });
    describe('Shape Rendering testing', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let trigger: MouseEvents = new MouseEvents();
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                titleSettings: {
                    text: 'YouTube office locations',
                    textStyle: {
                        size: '16px'
                    }
                },
                layers: [
                    {
                        shapeData: World_Map,
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'continent',
                    },
                ],
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('checking shape Render border', (done: Function) => {
            map.shapeRendering = (args: IShapeRenderingEventArgs): void => {
                args.border.width = 2; 
                args.border.color = 'red';
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_LayerIndex_0_Polygon_Group');
                expect(spec.childElementCount).toBe(176);
                spec = document.getElementById('container_LayerIndex_0_shapeIndex_0_dataIndex_undefined');
                expect(spec.getAttribute('stroke')).toBe("red");
                done();
            };
            map.refresh();
        });
        // it('checking shape Render shape', (done: Function) => {
        //     map.shapeRendering = (args: IShapeRenderingEventArgs): void => {
        //         args.shape.border.width = 2; 
        //         args.shape.border.color = 'blue';
        //         args.shape.fill = 'red';
        //     };
        //     map.loaded = (args: ILoadedEventArgs): void => {
        //         spec = document.getElementById('container_LayerIndex_0_Polygon_Group');
        //         expect(spec.childElementCount).toBe(176);
        //         spec = document.getElementById('container_LayerIndex_0_shapeIndex_0_dataIndex_undefined');
        //         expect(spec.getAttribute('fill')).toBe("#A6A6A6");
        //         expect(spec.getAttribute('stroke')).toBe('#000000');
        //         done();
        //     };
        //     map.refresh();
        // });
        it('checking shape Render shape', (done: Function) => {
            map.shapeRendering = (args: IShapeRenderingEventArgs): void => {
                args.cancel = true;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = document.getElementById('container_LayerIndex_0_Polygon_Group');
                expect(spec.childElementCount).toBe(176);
                spec = document.getElementById('container_LayerIndex_0_shapeIndex_0_dataIndex_undefined');
                expect(spec !== null).toBe(true);
                done();
            };
            map.refresh();
        });
    });
    describe('Item Highhlight testing', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let trigger: MouseEvents = new MouseEvents();
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                titleSettings: {
                    text: 'USA Election Results - 2016',
                    textStyle: {
                        size: '16px'
                    }
                },
                legendSettings: {
                    visible: true,
                    mode: 'Interactive',
                    position: 'Top',
                    width: '80%',
                        textStyle: {
                            fontWeight: '400',
                            size: '14px'
                        }
                },
                zoomSettings: {
                    enable: false
                },
                layers: [
                    {
                        shapeData: usa,
                        shapePropertyPath:  'name',
                        shapeDataPath:  'State',
                        dataSource : electionData,
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'State'
                        },
                        highlightSettings: {
                            enable: true,
                            fill: '#A3B0D0'
                        },
                        selectionSettings: {
                            enable: true,
                            fill: 'lime',
                            opacity: 1
                        },
                        shapeSettings: {
                        colorValuePath: 'Candidate',
                        colorMapping: [
                        {
                            value: 'Trump', color: '#D84444'
                        },
                        {
                            value: 'Clinton', color: '#316DB5'
                        }
                    ]
                }
            }
            ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('checking Item highlight fill', (done: Function) => {
            map.itemHighlight = (args: ISelectionEventArgs): void => {
                args.fill = 'yellow';
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = getElement('container_LayerIndex_0_shapeIndex_2_dataIndex_26');
                trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
                expect(spec.getAttribute('fill')).toBe('#D84444');
                done();
            };
            map.refresh();
        });
        it('checking Item highlight opacity', (done: Function) => {
            map.itemHighlight = (args: ISelectionEventArgs): void => {
                args.opacity = 0.5;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = getElement('container_LayerIndex_0_shapeIndex_2_dataIndex_26');
                trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
                expect(spec.getAttribute('fill-opacity')).toBe('1');
                done();
            };
            map.refresh();
        });
        it('checking Item highlight border', (done: Function) => {
            map.itemHighlight = (args: ISelectionEventArgs): void => {
                args.border.color = 'green';
                args.border.width = 2;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = getElement('container_LayerIndex_0_shapeIndex_2_dataIndex_26');
                trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
                expect(spec.getAttribute('stroke-width')).toBe('0');
                expect(spec.getAttribute('stroke')).toBe('#000000');
                done();
            };
            map.refresh();
        });
        it('checking Item highlight border', (done: Function) => {
            map.itemHighlight = (args: ISelectionEventArgs): void => {
                args.cancel = true;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = getElement('container_LayerIndex_0_shapeIndex_2_dataIndex_26');
                trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
                expect(spec !== null).toBe(true);
                done();
            };
            map.refresh();
        });
    });
    describe('Item Selection testing', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let trigger: MouseEvents = new MouseEvents();
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                titleSettings: {
                    text: 'USA Election Results - 2016',
                    textStyle: {
                        size: '16px'
                    }
                },
                legendSettings: {
                    visible: true,
                    mode: 'Interactive',
                    position: 'Top',
                    width: '80%',
                        textStyle: {
                            fontWeight: '400',
                            size: '14px'
                        }
                },
                zoomSettings: {
                    enable: false
                },
                layers: [
                    {
                        shapeData: usa,
                        shapePropertyPath:  'name',
                        shapeDataPath:  'State',
                        dataSource : electionData,
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'State'
                        },
                        highlightSettings: {
                            enable: true,
                            fill: '#A3B0D0'
                        },
                        selectionSettings: {
                            enable: true,
                            fill: '#4C515B ',
                            opacity: 1
                        },
                        shapeSettings: {
                        colorValuePath: 'Candidate',
                        colorMapping: [
                        {
                            value: 'Trump', color: '#D84444'
                        },
                        {
                            value: 'Clinton', color: '#316DB5'
                        }
                    ]
                }
            }
            ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('checking Item selection opacity', (done: Function) => {
            map.itemSelection = (args: ISelectionEventArgs): void => {
                args.opacity = 0.5;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = getElement('container_LayerIndex_0_shapeIndex_9_dataIndex_5');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('fill-opacity')).toBe('1');
                done();
            };
            map.refresh();
        });
        it('checking Item selection border', (done: Function) => {
            map.itemSelection = (args: ISelectionEventArgs): void => {
                args.border.color = 'green';
                args.border.width = 2;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = getElement('container_LayerIndex_0_shapeIndex_9_dataIndex_5');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('stroke-width')).toBe('0');
                done();
            };
            map.refresh();
        });
        it('checking Item selection cancel', (done: Function) => {
            map.itemSelection = (args: ISelectionEventArgs): void => {
                args.cancel = true;
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = getElement('container_LayerIndex_0_shapeIndex_9_dataIndex_5');
                trigger.clickEvent(spec);
                expect(spec !== null).toBe(true);
                done();
            };
            map.refresh();
        });
        it('checking Item selection fill', (done: Function) => {
            map.itemSelection = (args: ISelectionEventArgs): void => {
                args.fill = 'green';
            };
            map.loaded = (args: ILoadedEventArgs): void => {
                spec = getElement('container_LayerIndex_0_shapeIndex_9_dataIndex_5');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('fill')).toBe('#316DB5');
                done();
            };
            map.refresh();
        });
    });
});
