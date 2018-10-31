
import { TreeMap } from '../../../src/treemap/treemap';
import { ILoadedEventArgs, IResizeEventArgs } from '../../../src/treemap/model/interface';
import { createElement, remove } from '@syncfusion/ej2-base';
import { jobData, sportsData, hierarchicalData, Country_Population } from '../base/data.spec';

let jobDataSource: Object[] = jobData;
let gameDataSource: Object[] = sportsData;
let hierarchyData: Object[] = hierarchicalData;
let popuationData: Object[] = Country_Population;
/**
 * Tree map spec document
 */

describe('TreeMap Component Base Spec', () => {
    describe('TreeMap testing spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'container';
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            treemap = new TreeMap({}, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            remove(treemap.element);
        });

        it('Checking with height and width in percentage ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_svg');
                expect(element != null).toBe(true);
            };
            treemap.height = '80%';
            treemap.width = '50%';
            treemap.titleSettings.textStyle.color = null;
            treemap.titleSettings.subtitleSettings.textStyle.color = null;
            treemap.legendSettings.textStyle.color = null;
            treemap.legendSettings.titleStyle.color = null;
            treemap.theme = 'Material';
            treemap.refresh();
        });

        it('Checking with height and width in pixel ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_svg');
                expect(element != null).toBe(true);
            };
            treemap.height = '350px';
            treemap.width = '500px';
            treemap.titleSettings.textStyle.color = null;
            treemap.titleSettings.subtitleSettings.textStyle.color = null;
            treemap.legendSettings.textStyle.color = null;
            treemap.legendSettings.titleStyle.color = null;
            treemap.theme = 'Fabric';
            treemap.refresh();
        });

        it('Checking with background ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_svg');
                expect(element != null).toBe(true);
            };
            treemap.background = 'red';
            treemap.titleSettings.textStyle.color = null;
            treemap.titleSettings.subtitleSettings.textStyle.color = null;
            treemap.legendSettings.textStyle.color = null;
            treemap.legendSettings.titleStyle.color = null;
            treemap.theme = 'Bootstrap';
            treemap.refresh();
        });

        it('Checking with tree map data', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout');
                expect(element.childElementCount).toBeGreaterThan(1);
            };
            treemap.dataSource = jobData;
            treemap.weightValuePath = 'EmployeesCount';
            treemap.leafItemSettings = {
                labelPath: 'JobGroup',
                fill: '#6699cc',
                border: { color: 'black', width: 2 }
            };
            treemap.levels = [
                { groupPath: 'Country', fill: '#336699', border: { color: 'black', width: 2 } },
                { groupPath: 'JobDescription', fill: '#336699', border: { color: 'black', width: 2 } }
            ];
            treemap.titleSettings.textStyle.color = null;
            treemap.titleSettings.subtitleSettings.textStyle.color = null;
            treemap.legendSettings.textStyle.color = null;
            treemap.legendSettings.titleStyle.color = null;
            treemap.theme = 'Highcontrast';
            treemap.refresh();
        });

        it('Checking with label template', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout');
                expect(element.childElementCount).toBeGreaterThan(1);
            };
            treemap.dataSource = gameDataSource;
            treemap.weightValuePath = 'TotalMedals';
            treemap.leafItemSettings = {
                showLabels: true,
                labelPath: 'GameName',
                fill: '#006699',
                border: {
                    color: 'black',
                    width: 2
                },
                labelTemplate: '<div><img src="https://js.syncfusion.com/demos/web/images/treemap/{{:GameImage}}"></img></div>'
            };
            treemap.levels = [];
            treemap.refresh();
        });

        it('Checking with react label template', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                
                //let element: Element = document.getElementById(args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout');
                //expect(element.childElementCount).toBeGreaterThan(1);
                let color: string = treemap.layout['getSaturatedColor']('transparent');
                expect(color.length).toBeGreaterThan(1);
            };
            treemap.dataSource = gameDataSource;
            treemap.weightValuePath = 'TotalMedals';
            treemap.leafItemSettings = {
                showLabels: true,
                labelPath: 'GameName',
                fill: '#006699',
                border: {
                    color: 'black',
                    width: 2
                }                
            };
            let label: string = "labelTemplate";
            
            treemap.levels = [];
            treemap.refresh();
        });

        it('Checking with horizontal layout', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout');
                expect(element.childElementCount).toBeGreaterThan(1);
            };
            treemap.dataSource = gameDataSource;
            treemap.weightValuePath = 'TotalMedals';
            treemap.leafItemSettings = {
                showLabels: true,
                labelPath: '',
                fill: '#006699',
                border: {
                    color: 'black',
                    width: 2
                },
                labelTemplate: ''
            };
            treemap.layoutType = 'SliceAndDiceHorizontal';
            treemap.levels = [{ groupPath: 'GameName', headerTemplate: '<div><p>{{:GameName}}</p></div>' }];
            treemap.refresh();
        });

        it('Checking with vertical layout ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout');
                expect(element.childElementCount).toBeGreaterThan(1);
            };
            treemap.dataSource = jobDataSource;
            treemap.layoutType = 'SliceAndDiceVertical';
            treemap.weightValuePath = 'EmployeesCount';
            treemap.leafItemSettings = {
                labelPath: 'JobGroup',
                labelPosition: 'TopCenter',
                fill: '#6699cc',
                autoFill: true,
                border: {
                    color: 'black',
                    width: 2
                }
            };
            treemap.levels = [{
                headerAlignment: 'Center',
                groupPath: 'Country',
                fill: '#336699',
                autoFill: true,
                border: {
                    color: 'black',
                    width: 2
                }
            },
            {
                headerAlignment: 'Far',
                groupPath: 'JobDescription',
                fill: '#336699',
                border: {
                    color: 'black',
                    width: 2
                }
            }
            ];
            treemap.refresh();
        });

        it('Checking with auto layout ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout');
                expect(element.childElementCount).toBeGreaterThan(1);
            };
            treemap.layoutType = 'SliceAndDiceAuto';
            treemap.enableDrillDown = true;
            treemap.refresh();
        });


        it('Checking with hierarchical data', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout');
                expect(element.childElementCount).toBeGreaterThan(1);
            };
            treemap.dataSource = hierarchyData;
            treemap.layoutType = 'Squarified';
            treemap.weightValuePath = 'value';
            treemap.leafItemSettings = {
                labelPath: 'name'
            };
            treemap.levels = [
                { groupPath: 'Country', fill: '#336699', border: { color: 'black', width: 2 } },
                { groupPath: 'State', fill: '#6699cc', border: { color: 'black', width: 2 } }
            ];
            treemap.refresh();
        });
        it('Checking with population data', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout');
                expect(element.childElementCount).toBeGreaterThan(1);
            };
            treemap.dataSource = popuationData;
            treemap.layoutType = 'Squarified';
            treemap.weightValuePath = 'Population';
            treemap.leafItemSettings = {
                labelPath: 'Country',
                autoFill: true
            };
            treemap.refresh();
        });
    });
    describe('TreeMap title testing spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'title-container';
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
                dataSource: [{
                    Country: [{
                        Name: 'North America',
                        Popuation: '34343425'
                    },
                    {
                        Name: 'S0uth America',
                        Popuation: '34343425'
                    }]
                }],
                weightValuePath: 'Popuation',
                levels: [{
                    groupPath: 'Country',
                    fill: '#336699',
                    border: {
                        color: 'black',
                        width: 2
                    }
                }]
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            remove(treemap.element);
        });

        it('check title element', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_Title_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            treemap.refresh();
        });

        it('check title alignment near', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_Title_Group');
                let rect: ClientRect = element.children[0].getBoundingClientRect();
                expect(rect.left).toBeLessThan(args.treemap.availableSize.width / 2);
            };
            treemap.titleSettings.alignment = 'Near';
            treemap.refresh();
        });

        it('check title alignment Center ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_Title_Group');
                let rect: ClientRect = element.children[0].getBoundingClientRect();
                expect((rect.left + rect.width)).toBeGreaterThan(args.treemap.availableSize.width / 2);
            };
            treemap.titleSettings.alignment = 'Center';
            treemap.refresh();
        });

        it('check title alignment Far ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_Title_Group');
                let rect: ClientRect = element.children[0].getBoundingClientRect();
                expect((rect.left)).toBeGreaterThan(args.treemap.availableSize.width / 2);
            };
            treemap.titleSettings.alignment = 'Far';
            treemap.refresh();
        });

        it('Check subtitle element', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_Title_Group');
                let titleRect: ClientRect = element.children[0].getBoundingClientRect();
                expect(element.childElementCount).toBeGreaterThanOrEqual(2);
            };
            treemap.titleSettings.subtitleSettings.text = 'Popuation by 2017';
            treemap.refresh();
        });

        it('Check subtitle alignment with Near', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_Title_Group');
                let titleRect: ClientRect = element.children[0].getBoundingClientRect();
                let subTitleRect: ClientRect = element.children[1].getBoundingClientRect();
                expect(subTitleRect.left).toBeLessThanOrEqual((titleRect.left + titleRect.width / 2));
            };
            treemap.titleSettings.subtitleSettings.alignment = 'Near';
            treemap.refresh();
        });

        it('Check subtitle alignment with Center', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_Title_Group');
                let titleRect: ClientRect = element.children[0].getBoundingClientRect();
                let subTitleRect: ClientRect = element.children[1].getBoundingClientRect();
                expect(subTitleRect.left + subTitleRect.width).toBeGreaterThanOrEqual((titleRect.left + titleRect.width / 2));
            };
            treemap.titleSettings.subtitleSettings.alignment = 'Center';
            treemap.refresh();
        });

        it('Check subtitle alignment with Far', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + '_Title_Group');
                let titleRect: ClientRect = element.children[0].getBoundingClientRect();
                let subTitleRect: ClientRect = element.children[1].getBoundingClientRect();
                expect(subTitleRect.left).toBeGreaterThanOrEqual(477);
            };
            treemap.titleSettings.subtitleSettings.alignment = 'Far';
            treemap.refresh();
        });

        it('Treemap resize event checking', (done: Function) => {
            treemap.resizeOnTreeMap(null);
            treemap.resize = (args: IResizeEventArgs) => {
                expect(args.name).toBe('resize');
                done();
            };
            treemap.resizeOnTreeMap(<Event>{});
            treemap.getPersistData();
        });
    });
});