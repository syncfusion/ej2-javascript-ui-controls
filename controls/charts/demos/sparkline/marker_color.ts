/**
 * sparkline sample 
 */
import { Sparkline, } from '../../src/sparkline/sparkline';
import { IMarkerRenderingEventArgs, SparklineTooltip, SparklineTheme} from '../../src/sparkline/index'
import { EmitType } from '@syncfusion/ej2-base';
Sparkline.Inject(SparklineTooltip);

let sparkline: Sparkline = new Sparkline({
    height: '50px',
    width: '90%',
    lineWidth: 2,
    type: 'Line',
    valueType: 'Category',
    fill: '#3C78EF',
    negativePointColor: '#fc5070',
    format: 'n',
    useGroupingSeparator: true,
    dataSource: [2,3,6,0,-2,-5,8,1,-1],
    dataLabelSettings:{
        visible:['All']
    },
    highPointColor:'blue',
    lowPointColor:'yellow',
    tiePointColor:'black',
    startPointColor:'red',
    endPointColor:'green',
    markerSettings:{
       visible:['All']
    },
    xName: 'xval', yName: 'yval'
});
sparkline.appendTo('#container');
