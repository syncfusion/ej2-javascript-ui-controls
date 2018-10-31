/**
 * sparkline sample 
 */
import { Sparkline, } from '../../src/sparkline/sparkline';
import { SparklineType } from '../../src/sparkline/model/enum';

let sparkline: Sparkline = new Sparkline({
    height: '50px',
    width: '90%',
    valueType: 'Numeric',
    dataSource: [0, 6, 4, 1, 3, 2, 5]
});
sparkline.appendTo('#container');
document.getElementById('label').onchange= (args: Event) =>{
    var value = (<HTMLInputElement>document.getElementById('label')).value;
    sparkline.type =<SparklineType>value;
    sparkline.refresh();
}
