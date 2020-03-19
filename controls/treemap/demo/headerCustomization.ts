import { TreeMap } from '../src/treemap/treemap';
import { TreeMapTooltip } from '../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../src/treemap/layout/legend';
import { DrillDown } from '../demo/Data/Drilldown_Sample';
import { EmitType } from '@syncfusion/ej2-base';
import { CarSales } from './treemapData/Car_Sale';
import{ IItemRenderingEventArgs , IItemClickEventArgs} from '../src/treemap/model/interface';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({
    palette: ["#f44336", "#29b6f6", "#ab47bc", "#ffc107", "#5c6bc0", "#009688"],
    dataSource:[
        { Category: 'Employees', Country: 'USA', JobDescription: 'Sales', JobGroup: 'Executive', EmployeesCount: 20 },
        { Category: 'Employees', Country: 'USA', JobDescription: 'Sales', JobGroup: 'Analyst', EmployeesCount: 30 },
        { Category: 'Employees', Country: 'USA', JobDescription: 'Marketing', EmployeesCount: 40 },
        { Category: 'Employees', Country: 'USA', JobDescription: 'Management', EmployeesCount: 80 },
        { Category: 'Employees', Country: 'India', JobDescription: 'Technical', JobGroup: 'Testers', EmployeesCount: 100 },
        { Category: 'Employees', Country: 'India', JobDescription: 'HR Executives', EmployeesCount: 30 },
        { Category: 'Employees', Country: 'India', JobDescription: 'Accounts', EmployeesCount: 40 },
        { Category: 'Employees', Country: 'Germany', JobDescription: 'Sales', JobGroup: 'Executive', EmployeesCount: 50 },
        { Category: 'Employees', Country: 'Germany', JobDescription: 'Sales', JobGroup: 'Analyst', EmployeesCount: 60 },
        { Category: 'Employees', Country: 'Germany', JobDescription: 'Marketing', EmployeesCount: 70 },
        { Category: 'Employees', Country: 'Germany', JobDescription: 'Technical', JobGroup: 'Testers', EmployeesCount: 80 },
        { Category: 'Employees', Country: 'Germany', JobDescription: 'Management', EmployeesCount: 10 },
        { Category: 'Employees', Country: 'Germany', JobDescription: 'Accounts', EmployeesCount: 20 },
        { Category: 'Employees', Country: 'UK', JobDescription: 'Technical', JobGroup: 'Testers', EmployeesCount: 30 },
        { Category: 'Employees', Country: 'UK', JobDescription: 'HR Executives', EmployeesCount: 50 },
        { Category: 'Employees', Country: 'UK', JobDescription: 'Accounts', EmployeesCount: 60 },
        { Category: 'Employees', Country: 'France', JobDescription: 'Technical', JobGroup: 'Testers', EmployeesCount: 70 },
        { Category: 'Employees', Country: 'France', JobDescription: 'Marketing', EmployeesCount: 100 }
    ],
    weightValuePath: 'EmployeesCount',
    levels: [
        { groupPath: 'Country', headerFormat:'${Country}-${EmployeesCount}',
        headerAlignment:'Center', border: { color: 'black', width: 0.5 } },
        { groupPath: 'JobDescription',headerFormat:'${JobDescription}-${EmployeesCount}', headerAlignment:'Far', border: { color: 'black', width: 0.5 } },
        { groupPath: 'JobGroup', headerAlignment:'Near',
        headerFormat:'${JobGroup}-${EmployeesCount}', border: { color: 'black', width: 0.5 } },
    ],
    itemRendering: (args: IItemRenderingEventArgs) => {  
        if(args['currentItem']['groupIndex'] === 0) {
            args.text = '${Country}' + ' - ' + args['currentItem']['weight'];
         }
    },
    itemClick: (args: IItemClickEventArgs) => {
        args.text = '${Country}';
    }
});
treemap.appendTo('#container');


