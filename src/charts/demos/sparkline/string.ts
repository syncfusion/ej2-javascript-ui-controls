/**
 * sparkline sample 
 */
import { Sparkline, } from '../../src/sparkline/sparkline';
import { SparklineType } from '../../src/sparkline/model/enum';

let sparkline: Sparkline = new Sparkline({
    height: '50px',
    width: '90%',
    valueType: 'Numeric',
    dataSource: [
        { x: 1, xval: 'Jan', yval: 10 },
        { x: 2, xval: 'Feb', yval: 6 },
        { x: 3, xval: 'Mar', yval: 8 },
        { x: 4, xval: 'Apr', yval: -5 },
        { x: 5, xval: 'May', yval: 11 },
        { x: 6, xval: 'Jun', yval: 5 },
        { x: 7, xval: 'Jul', yval: -2 },
        { x: 8, xval: 'Aug', yval: 7 },
        { x: 9, xval: 'Sep', yval: -3 },
        { x: 10, xval: 'Oct', yval: 6 },
        { x: 11, xval: 'Nov', yval: 8 },
        { x: 12, xval: 'Dec', yval: 10 },
    ],
    xName: 'xval', yName: 'yval'
});
sparkline.appendTo('#container');
document.getElementById('label').onchange= (args: Event) =>{
    var value = (<HTMLInputElement>document.getElementById('label')).value;
    sparkline.type =<SparklineType>value;
    sparkline.refresh();
}
