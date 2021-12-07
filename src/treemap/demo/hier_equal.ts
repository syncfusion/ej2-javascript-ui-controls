import { TreeMap } from '../src/treemap/treemap';
import { hierarchical_samedatas } from '../demo/Data/hierarchical';
/**
 * Default sample
 */

let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: hierarchical_samedatas,
    weightValuePath: 'value',
    equalColorValuePath:'value',
    levels:[
        {groupPath:'Country', headerFormat:'${CountryName}',colorMapping:[
            {
               value:'60',
               color:'blue'
           },
           {
            value:'100',
            color:'grey'
        },{
            value:'80',
            color:'yellow'
        },
           {
               value:'50',
               color:'green'
           },
           {
            value:'70',
            color:'red'
        }
        ]
    },
    ],
    leafItemSettings:{
        labelPath:'Name',
        colorMapping:[
            {
               value:'60',
               color:'blue'
           },
           {
            value:'100',
            color:'grey'
        },{
            value:'80',
            color:'yellow'
        },
           {
               value:'50',
               color:'green'
           },
           {
            value:'70',
            color:'red'
        }
        ]
    }
});
treemap.appendTo('#container');


