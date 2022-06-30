import { Maps, ILoadedEventArgs } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { usMap } from '../data/data.spec';
import { electiondata, populationData } from '../data/us-data.spec';
import { ITooltipRenderEventArgs, DataLabel, MapsTooltip, Legend, Zoom, Marker, LayerSettingsModel, MapLocation } from '../../../src/maps/index';
import { MouseEvents } from '../base/events.spec';
import { getElement, timeout } from '../../../src/maps/utils/helper';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
Maps.Inject( MapsTooltip, Legend, DataLabel, Marker );
export function getShape(i: number): string {
    return 'mapst_LayerIndex_0_shapeIndex_' + i + '_dataIndex_undefined';
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
    describe('Checking the default theme', () => {
        let id: string = 'container';
        let maps: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let element: Element;
        let tooltipElements: HTMLCollection;
        let tooltipElement: HTMLElement;
        let markerId: string = id + '_LayerIndex_0_MarkerIndex_0_dataIndex_';
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            maps = new Maps({
                titleSettings:{
                    text: 'US Map',
                    subtitleSettings:{
                        text:'-2016'
                    }
                },
                zoomSettings:{
                    enable: true
                },
                legendSettings:{
                    visible: true,
                    title:{
                        text:'election report'
                    }
                },
                layers: [{
                    tooltipSettings: {
                        visible: true,
                        valuePath: 'Electors'
                    },
                    dataLabelSettings:{
                        visible: true,
                        labelPath: 'Candidate'
                    },
                    shapeData: usMap,
                    dataSource: electiondata,
                    shapeDataPath: 'State',
                    shapePropertyPath: 'name',
                    markerSettings: [
                        {
                            visible: true,
                            tooltipSettings: {
                                visible: true,
                                valuePath: 'Name',
                                format: '${Name} <br> Lat ${latitude} <br> Marker',
                            },
                            height: 30,
                            width: 30,
                            shape: 'Triangle',
                            dataSource: [
                                { Name: 'California', latitude: 36.7783, longitude: -119.4179 },
                                { Name: 'Colorado', latitude: 39.5501, longitude: -105.7821 },
                                { Name: 'New York', latitude: 40.7128, longitude: -74.0060 },
                            ]
                        }
                    ],
                    shapeSettings: {
                        colorValuePath: 'Candidate',
                        colorMapping: [
                            {
                                value: 'Obama', color: '#D84444'
                            },
                            {
                                value: 'Romney', color: '#316DB5'
                            }
                        ]
                    }
                }]
            }, '#' + id);
        });
        afterAll(() => {
            maps.destroy();
            maps.mapsTooltipModule = new MapsTooltip(maps);
            maps.mapsTooltipModule.destroy(maps);
            remove(ele);
        });

        it('Checking with Background  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_MapAreaBorder');
                expect(element.getAttribute('fill')).toBe('#FFFFFF');
            };
            maps.refresh();
        });
        it('Checking with maps Area', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_MapBorder');
                expect(element.getAttribute('fill')).toBe('#FFFFFF');
            };
            maps.refresh();
        });
        it('Checking with maps Title  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_title');
                expect(element.getAttribute('fill')).toBe('#424242');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('14px');
            };
            maps.refresh();
        });
        it('Checking with maps Title font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_title');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
            };
            maps.refresh();
        });
        it('Checking with maps SubTitle  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_subtitle');
                expect(element.getAttribute('fill')).toBe('#424242');
            };
            maps.refresh();
        });
        it('Checking with maps SubTitle font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_subtitle');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('13px');
            };
            maps.refresh();
        });
        it('Checking with maps Legend text  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Legend_Text_Index_0');
                expect(element.getAttribute('fill')).toBe('#757575');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('12px');
            };
            maps.refresh();
        });
        it('Checking with maps Legend text font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Legend_Text_Index_0');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('12px');
            };
            maps.refresh();
        });
        it('maps Legend title  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LegendTitle');
                expect(element.getAttribute('fill')).toBe('#757575');
            };
            maps.refresh();
        });
        it('Checking with maps Legend title font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LegendTitle');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('12px');
            };
            maps.refresh();
        });
        it('Checking with maps DataLabel  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LayerIndex_0_shapeIndex_0_LabelIndex_0');
                expect(element.getAttribute('fill')).toBe('#000000');
            };
            maps.refresh();
        });
        it('Checking with maps DataLabel font family ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LayerIndex_0_shapeIndex_0_LabelIndex_0');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('12px');
            };
            maps.refresh();
        });
        it('Checking with maps zoom', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Zooming_ToolBar_ZoomIn_Rect');
                expect(element.getAttribute('stroke')).toBe('#737373');
            };
            maps.refresh();
        });
        it('Checking with tooltip text color', () => {
            element = getElement(markerId + 1);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            maps.mapsTooltipModule['isTouch'] = false;
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            tooltipElement = document.getElementById('container_mapsTooltip_text');
            expect(tooltipElement.querySelector('tspan').getAttribute('fill')).toBe('#FFFFFF');
        });
        it('Checking with tooltip color', () => {
            element = getElement(markerId + 1);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            maps.mapsTooltipModule['isTouch'] = false;
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            tooltipElement = document.getElementById('container_mapsTooltip_path');
            expect(tooltipElement.getAttribute('fill')).toBe('#000000');
            expect(tooltipElement.getAttribute('opacity')).toBe('0.75');
        });

        it('checking with MaterialDarkBackground  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_MapAreaBorder');
                expect(element.getAttribute('fill')).toBe('#303030');
            };
			maps.theme ='MaterialDark';
            maps.refresh();
        });
        it('checking with MaterialDarkmaps Area', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_MapBorder');
                expect(element.getAttribute('fill')).toBe('#303030');
            };
			maps.theme ='MaterialDark';
            maps.refresh();
        });
        it('checking with MaterialDarkmaps Title  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_title');
                expect(element.getAttribute('fill')).toBe('#FFFFFF');
            };
			maps.theme ='MaterialDark';
            maps.refresh();
        });
        it('checking with MaterialDarkmaps Title font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_title');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('14px');
            };
			maps.theme ='MaterialDark';
            maps.refresh();
        });
        it('checking with MaterialDarkmaps SubTitle  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_subtitle');
                expect(element.getAttribute('fill')).toBe('#FFFFFF');
            };
			maps.theme ='MaterialDark';
            maps.refresh();
        });
        it('checking with MaterialDarkmaps SubTitle font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_subtitle');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('13px');
            };
			maps.theme ='MaterialDark';
            maps.refresh();
        });
        it('checking with MaterialDarkmaps Legend text  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Legend_Text_Index_0');
                expect(element.getAttribute('fill')).toBe('#DADADA');
            };
			maps.theme ='MaterialDark';
            maps.refresh();
        });
        it('checking with MaterialDarkmaps Legend text font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Legend_Text_Index_0');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('12px');
            };
			maps.theme ='MaterialDark';
            maps.refresh();
        });
        it('maps Legend title  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LegendTitle');
                expect(element.getAttribute('fill')).toBe('#DADADA');
            };
			maps.theme ='MaterialDark';
            maps.refresh();
        });
        it('checking with MaterialDarkmaps Legend title font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LegendTitle');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('12px');
            };
			maps.theme ='MaterialDark';
            maps.refresh();
        });
        it('checking with MaterialDarkmaps DataLabel  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LayerIndex_0_shapeIndex_0_LabelIndex_0');
                expect(element.getAttribute('fill')).toBe('#DADADA');
            };
			maps.theme ='MaterialDark';
            maps.refresh();
        });
        it('checking with MaterialDarkmaps DataLabel font family ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LayerIndex_0_shapeIndex_0_LabelIndex_0');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('12px');
            };
			maps.theme ='MaterialDark';
            maps.refresh();
        });
        it('checking with MaterialDarkmaps zoom', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Zooming_ToolBar_ZoomIn_Rect');
                expect(element.getAttribute('stroke')).toBe('#FFFFFF');
            };
			maps.theme ='MaterialDark';
            maps.refresh();
        });
        it('checking with MaterialDarktooltip text color', () => {
            element = getElement(markerId + 1);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            maps.mapsTooltipModule['isTouch'] = false;
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            tooltipElement = document.getElementById('container_mapsTooltip_text');
            expect(tooltipElement.querySelector('tspan').getAttribute('fill')).toBe('#FFFFFF');
        });
        it('checking with MaterialDarktooltip color', () => {
            element = getElement(markerId + 1);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            maps.mapsTooltipModule['isTouch'] = false;
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            tooltipElement = document.getElementById('container_mapsTooltip_path');
            expect(tooltipElement.getAttribute('fill')).toBe('#363F4C');
            expect(tooltipElement.getAttribute('opacity')).toBe('0.75');
        });


        it('checking with HighcontrastBackground  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_MapAreaBorder');
                expect(element.getAttribute('fill')).toBe('#000000');
            };
			maps.theme ='HighContrast';
            maps.refresh();
        });
        it('checking with Highcontrastmaps Area', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_MapBorder');
                expect(element.getAttribute('fill')).toBe('#000000');
            };
			maps.theme ='HighContrast';
            maps.refresh();
        });
        it('checking with Highcontrastmaps Title  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_title');
                expect(element.getAttribute('fill')).toBe('#FFFFFF');
            };
			maps.theme ='HighContrast';
            maps.refresh();
        });
        it('checking with Highcontrastmaps Title font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_title');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('14px');
            };
			maps.theme ='HighContrast';
            maps.refresh();
        });
        it('checking with Highcontrastmaps SubTitle  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_subtitle');
                expect(element.getAttribute('fill')).toBe('#FFFFFF');
            };
			maps.theme ='HighContrast';
            maps.refresh();
        });
        it('checking with Highcontrastmaps SubTitle font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_subtitle');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('13px');
            };
			maps.theme ='HighContrast';
            maps.refresh();
        });
        it('checking with Highcontrastmaps Legend text  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Legend_Text_Index_0');
                expect(element.getAttribute('fill')).toBe('#FFFFFF');
            };
			maps.theme ='HighContrast';
            maps.refresh();
        });
        it('checking with Highcontrastmaps Legend text font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Legend_Text_Index_0');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('12px');
            };
			maps.theme ='HighContrast';
            maps.refresh();
        });
        it('maps Legend title  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LegendTitle');
                expect(element.getAttribute('fill')).toBe('#FFFFFF');
            };
			maps.theme ='HighContrast';
            maps.refresh();
        });
        it('checking with Highcontrastmaps Legend title font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LegendTitle');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('12px');
            };
			maps.theme ='HighContrast';
            maps.refresh();
        });
        it('checking with Highcontrastmaps DataLabel  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LayerIndex_0_shapeIndex_0_LabelIndex_0');
                expect(element.getAttribute('fill')).toBe('#000000');
            };
			maps.theme ='HighContrast';
            maps.refresh();
        });
        it('checking with Highcontrastmaps DataLabel font family ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LayerIndex_0_shapeIndex_0_LabelIndex_0');
                expect(element.getAttribute('font-family')).toBe('Roboto, Noto, Sans-serif');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('12px');
            };
			maps.theme ='HighContrast';
            maps.refresh();
        });
        it('checking with Highcontrastmaps zoom', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Zooming_ToolBar_ZoomIn_Rect');
                expect(element.getAttribute('stroke')).toBe('#FFFFFF');
            };
			maps.theme ='HighContrast';
            maps.refresh();
        });
        it('checking with Highcontrasttooltip text color', () => {
            element = getElement(markerId + 1);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            maps.mapsTooltipModule['isTouch'] = false;
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            tooltipElement = document.getElementById('container_mapsTooltip_text');
            expect(tooltipElement.querySelector('tspan').getAttribute('fill')).toBe('#000000');
        });
        it('checking with Highcontrast tooltip default color', () => {
            element = getElement(markerId + 1);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            maps.mapsTooltipModule['isTouch'] = false;
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            tooltipElement = document.getElementById('container_mapsTooltip_path');
            expect(tooltipElement.getAttribute('fill')).toBe('#ffffff');
            expect(tooltipElement.getAttribute('opacity')).toBe('0.75');
        });
        it('checking with Bootstrap4Background  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_MapAreaBorder');
                expect(element.getAttribute('fill')).toBe('#FFFFFF');
            };
			maps.theme ='Bootstrap4';
            maps.refresh();
        });
        it('checking with Bootstrap4maps Area', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_MapBorder');
                expect(element.getAttribute('fill')).toBe('#FFFFFF');
            };
			maps.theme ='Bootstrap4';
            maps.refresh();
        });
        it('checking with Bootstrap4maps Title  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_title');
                expect(element.getAttribute('fill')).toBe('#212529');
            };
			maps.theme ='Bootstrap4';
            maps.refresh();
        });
        it('checking with Bootstrap4maps Title font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_title');
                expect(element.getAttribute('font-family')).toBe('HelveticaNeue-Medium');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('16px');
            };
			maps.theme ='Bootstrap4';
            maps.refresh();
        });
        it('checking with Bootstrap4maps SubTitle  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_subtitle');
                expect(element.getAttribute('fill')).toBe('#212529');
            };
			maps.theme ='Bootstrap4';
            maps.refresh();
        });
        it('checking with Bootstrap4maps SubTitle font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Map_subtitle');
                expect(element.getAttribute('font-family')).toBe('HelveticaNeue-Medium');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('13px');
            };
			maps.theme ='Bootstrap4';
            maps.refresh();
        });
        it('checking with Bootstrap4maps Legend text  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Legend_Text_Index_0');
                expect(element.getAttribute('fill')).toBe('#212529');
            };
			maps.theme ='Bootstrap4';
            maps.refresh();
        });
        it('checking with Bootstrap4maps Legend text font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Legend_Text_Index_0');
                expect(element.getAttribute('font-family')).toBe('HelveticaNeue-Medium');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('14px');
            };
			maps.theme ='Bootstrap4';
            maps.refresh();
        });
        it('maps Legend title  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LegendTitle');
                expect(element.getAttribute('fill')).toBe('#212529');
            };
			maps.theme ='Bootstrap4';
            maps.refresh();
        });
        it('checking with Bootstrap4maps Legend title font family  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LegendTitle');
                expect(element.getAttribute('font-family')).toBe('HelveticaNeue-Medium');
            };
			maps.theme ='Bootstrap4';
            maps.refresh();
        });
        it('checking with Bootstrap4maps DataLabel  ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LayerIndex_0_shapeIndex_0_LabelIndex_0');
                expect(element.getAttribute('fill')).toBe('#212529');
            };
			maps.theme ='Bootstrap4';
            maps.refresh();
        });
        it('checking with Bootstrap4maps DataLabel font family ', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_LayerIndex_0_shapeIndex_0_LabelIndex_0');
                expect(element.getAttribute('font-family')).toBe('HelveticaNeue-Medium');
                expect(element.getAttribute('font-weight')).toBe('Medium');
                expect(element.getAttribute('font-size')).toBe('12px');
            };
			maps.theme ='Bootstrap4';
            maps.refresh();
        });
        it('checking with Bootstrap4maps zoom', () => {
            maps.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Zooming_ToolBar_ZoomIn_Rect');
                expect(element.getAttribute('stroke')).toBe('#5B6269');
            };
			maps.theme ='Bootstrap4';
            maps.refresh();
        });
        it('checking with Bootstrap4tooltip text default color', () => {
            element = getElement(markerId + 1);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            maps.mapsTooltipModule['isTouch'] = false;
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            tooltipElement = document.getElementById('container_mapsTooltip_text');
            expect(tooltipElement.querySelector('tspan').getAttribute('fill')).toBe('#FFFFFF');
        });
        it('checking with Bootstrap4tooltip default color', () => {
            element = getElement(markerId + 1);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            maps.mapsTooltipModule['isTouch'] = false;
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            trigger.mousemoveEvent(element, 0, 0, 190, 230);
            tooltipElement = document.getElementById('container_mapsTooltip_path');
            expect(tooltipElement.getAttribute('fill')).toBe('#000000');
            expect(tooltipElement.getAttribute('opacity')).toBe('1');
        });
    });
    
});