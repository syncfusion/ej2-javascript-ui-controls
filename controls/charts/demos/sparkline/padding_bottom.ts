/**
 * sparkline sample 
 */
import { Sparkline, } from '../../src/sparkline/sparkline';
import { SparklineType } from '../../src/sparkline/model/enum';

let sparkline: Sparkline = new Sparkline({
    height: '50px',
    width: '90%',
    valueType: 'Numeric',
    padding:{
       bottom:20
    },
    dataSource: [
        { x: 0, xval: '2005', yval: 32805040 },
        { x: 1, xval: '2006', yval: 33098930 },
        { x: 2, xval: '2007', yval: 33390140 },
        { x: 3, xval: '2008', yval: 33212700 },
        { x: 4, xval: '2009', yval: 33487210 },
        { x: 5, xval: '2010', yval: 33759740 },
        { x: 6, xval: '2011', yval: 34030590 },
        { x: 7, xval: '2012', yval: 34300080 },
        { x: 8, xval: '2013', yval: 34568210 },
        { x: 9, xval: '2014', yval: 34834840 },

    ],
    xName: 'xval', yName: 'yval'
});
sparkline.appendTo('#container');