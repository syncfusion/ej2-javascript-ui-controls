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
        { xDate: new Date(2018, 0, 1), x: 0, yval: 4 },
        { xDate: new Date(2018, 0, 2), x: 1, yval: 4.5 },
        { xDate: new Date(2018, 0, 3), x: 2, yval: 8 },
        { xDate: new Date(2018, 0, 4), x: 3, yval: 7 },
        { xDate: new Date(2018, 0, 5), x: 4, yval: 6 },
        { xDate: new Date(2018, 0, 8), x: 5, yval: 8 },
        { xDate: new Date(2018, 0, 9), x: 6, yval: 8 },
        { xDate: new Date(2018, 0, 10), x: 7, yval: 6.5 },
        { xDate: new Date(2018, 0, 11), x: 8, yval: 4 },
        { xDate: new Date(2018, 0, 12), x: 9, yval: 5.5 },
        { xDate: new Date(2018, 0, 15), x: 10, yval: 8 },
        { xDate: new Date(2018, 0, 16), x: 11, yval: 6 },
        { xDate: new Date(2018, 0, 17), x: 12, yval: 6.5 },
        { xDate: new Date(2018, 0, 18), x: 13, yval: 7.5 },
        { xDate: new Date(2018, 0, 19), x: 14, yval: 7.5 },
        { xDate: new Date(2018, 0, 22), x: 15, yval: 4 },
        { xDate: new Date(2018, 0, 23), x: 16, yval: 8 },
        { xDate: new Date(2018, 0, 24), x: 17, yval: 6 },
        { xDate: new Date(2018, 0, 25), x: 18, yval: 7.5 },
        { xDate: new Date(2018, 0, 26), x: 19, yval: 4.5 },
        { xDate: new Date(2018, 0, 29), x: 20, yval: 6 },
        { xDate: new Date(2018, 0, 30), x: 21, yval: 5 },
        { xDate: new Date(2018, 0, 31), x: 22, yval: 7 }
    ],
    xName: 'xDate', yName: 'yval'
});
sparkline.appendTo('#container');
document.getElementById('label').onchange= (args: Event) =>{
    var value = (<HTMLInputElement>document.getElementById('label')).value;
    sparkline.type =<SparklineType>value;
    sparkline.refresh();
}
