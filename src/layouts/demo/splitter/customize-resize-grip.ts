import { Splitter } from '../../src/splitter/splitter';

let splitObj: Splitter = new Splitter({
    height: '250px',
    paneSettings: [
        { size: '30%', min: '20%', max: '60%' },
        { size: '40%', min: '20%', max: '90%' },
        { size: '30%', min: '20%', max: '70%' }
    ],
    width: '100%'
});
splitObj.appendTo('#splitter');