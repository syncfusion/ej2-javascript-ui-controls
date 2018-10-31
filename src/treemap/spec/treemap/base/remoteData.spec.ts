
import { TreeMap } from '../../../src/treemap/treemap';
import { TreeMapLegend } from '../../../src/treemap/layout/legend';
import { ILoadedEventArgs } from '../../../src/treemap/model/interface';
import { createElement, remove } from '@syncfusion/ej2-base';
import { jobData, sportsData, hierarchicalData, Country_Population } from '../base/data.spec';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { TreeMapAjax } from '../../../src/treemap/utils/helper';
TreeMap.Inject(TreeMapLegend);

let jobDataSource: Object[] = jobData;
let gameDataSource: Object[] = sportsData;
let hierarchyData: Object[] = hierarchicalData;
let popuationData: Object[] = Country_Population;
/**
 * Tree map spec document
 */
describe('TreeMap Component Spec', () => {
    describe('TreeMap Data Manager support spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'data-container';
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            treemap = new TreeMap({
                palette: ['#9999ff', '#CCFF99', '#FFFF99', '#FF9999', '#FF99FF', '#FFCC66'],
                weightValuePath: 'EmployeeID',
                leafItemSettings: {
                    labelPath: 'FirstName',
                    border: { color: 'black', width: 0.5 }
                }
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });
        it('Checking with remote data using data manager support', () => {
            let employeesData: JSON[] = ([{ EmployeeID: 1, LastName: "Davolio", FirstName: "Nancy", Title: "Sales Representative" },
            { EmployeeID: 2, LastName: "Fuller", FirstName: "Andrew", Title: "Vice President, Sales" },
            { EmployeeID: 3, LastName: "Leverling", FirstName: "Janet", Title: "Sales Representative" },
            { EmployeeID: 4, LastName: "Peacock", FirstName: "Margaret", Title: "Sales Representative" },
            { EmployeeID: 5, LastName: "Fuller", FirstName: "Andrew", Title: "Vice President, Sales" },
            { EmployeeID: 6, LastName: "Leverling", FirstName: "Janet", Title: "Sales Representative" },
            { EmployeeID: 7, LastName: "Peacock", FirstName: "Margaret", Title: "Sales Representative" },
            { EmployeeID: 8, LastName: "Fuller", FirstName: "Andrew", Title: "Vice President, Sales" },
            { EmployeeID: 9, LastName: "Leverling", FirstName: "Janet", Title: "Sales Representative" }
            ] as Object) as JSON[];
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(args.treemap.element.id + ' _TreeMap_Squarified_Layout');
                expect(element.childElementCount).toBeGreaterThan(1);
            };
            treemap.dataSource = new DataManager(employeesData);
            treemap.refresh();
        });

        it('Checking with query to filter data', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                // put the spec here //
            };
            treemap.query = new Query().select(['EmployeeID', 'FirstName', 'LastName', 'Title']).take(3);
            treemap.refresh();
        });

        it('Checking with ajax to get and binding the data', (done: Function) => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                // put the spec here //
                done();
            };
            treemap.dataSource = new TreeMapAjax(location.origin + '/base/spec/treemap/data/population.json');
            treemap.refresh();
        });
    });
});