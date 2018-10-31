/**
 * sparkline sample 
 */
import { Sparkline, } from '../../src/sparkline/sparkline';
import { SparklineType } from '../../src/sparkline/model/enum';

let sparkline: Sparkline = new Sparkline({
    height: '50px',
    width: '90%',
    valueType: 'Numeric',
    rangeBandSettings:[{
        startRange:1,
        endRange:5,
        color:'blue',
        opacity:0.2
    }],
    dataSource:[0, 6, 4, 1, 3, 2, 5],

});
sparkline.appendTo('#container');