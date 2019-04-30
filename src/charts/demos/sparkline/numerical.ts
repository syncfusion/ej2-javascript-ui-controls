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
        { x: 1, yval: 5 },
        { x: 2, yval: 6 },
        { x: 3, yval: 5 },
        { x: 4, yval: 7 },
        { x: 5, yval: 4 },
        { x: 6, yval: 3 },
        { x: 7, yval: 9 },
        { x: 8, yval: 5 },
        { x: 9, yval: 6 },
        { x: 10, yval: 5 },
        { x: 11, yval: 7 },
        { x: 12, yval: 8 },
        { x: 13, yval: 4 },
        { x: 14, yval: 5 },
        { x: 15, yval: 3 },
        { x: 16, yval: 4 },
        { x: 17, yval: 11 },
        { x: 18, yval: 10 },
        { x: 19, yval: 2 },
        { x: 20, yval: 12 },
        { x: 21, yval: 4 },
        { x: 22, yval: 7 },
        { x: 23, yval: 6 },
        { x: 24, yval: 8 },

    ],
    xName: 'x', yName: 'yval'
});
sparkline.appendTo('#container');
document.getElementById('label').onchange= (args: Event) =>{
    var value = (<HTMLInputElement>document.getElementById('label')).value;
    sparkline.type =<SparklineType>value;
    sparkline.refresh();
}
