import { TreeMap } from '../src/treemap/treemap';
import { hierarchicalDatas } from '../demo/Data/hierarchical';
let prevTime: Date; let curTime: Date;
let treemap: TreeMap = new TreeMap({  
    dataSource: hierarchicalDatas,
    weightValuePath: 'value',
    rangeColorValuePath:'value',
    levels:[
        {groupPath:'Country', headerFormat:'${CountryName}',
        colorMapping:[
            {
               from:0,
               to:30,
               color:'orange'
           },
           {
               from:30,
               to:50,
               color:'green'
           },
           {
            from:50,
            to:90,
            color:'yellow'
        },
        {
            from:90,
            to:120,
            color:'red'
        }
        ]
    },
    ],
    leafItemSettings:{
        labelPath:'Name',
        colorMapping:[
            {
               from:0,
               to:30,
               color:'orange'
           },
           {
               from:30,
               to:50,
               color:'green'
           },
           {
            from:50,
            to:90,
            color:'yellow'
        },
        {
            from:90,
            to:120,
            color:'red'
        }
        ]
    }
});
treemap.appendTo('#container');


