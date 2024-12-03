import { TreeMap } from '../src/treemap/treemap';
import { hierarchicalDatas } from '../demo/Data/hierarchical';
import{ LegendMode }  from '../src/treemap/utils/enum';
import { TreeMapLegend } from '../src/treemap/layout/legend';
TreeMap.Inject( TreeMapLegend);

/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: hierarchicalDatas,
    equalColorValuePath:'Name',
    weightValuePath: 'value',
    levels:[
        {groupPath:'Country', headerFormat:'${CountryName}',
         colorMapping:[
             {value:'India', color:'red'},
             {value: 'United States', color:'blue'},
             {value:'Canada', color:'green'},
             {value:'China', color:'yellow'},
             {value:'France', color:'skyblue'}
            ]
        },
    ],
    legendSettings:{visible: true},
    leafItemSettings:{
        labelPath:'Name',
        colorMapping:[
            {value:'Tamil nadu', color:'green'},
            {value: 'Mumbai', color:'blue'},
            {value:'Alberta', color:'green'},
            {value:'california', color:'yellow'},
            {value:'florida', color:'skyblue'},
            {value:'Burgundy', color:'skyblue'},
            {value:'Alsace', color:'yellow'},
            {value:'Manitoba', color:'green'}
           ]
    }
});
treemap.appendTo('#container');
document.getElementById('labels').onchange = () => {
    var value = (<HTMLInputElement>document.getElementById('labels')).value;
    treemap.legendSettings.mode = <LegendMode>value; 
    treemap.refresh();
}