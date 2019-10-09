import { Splitter } from '../../src/splitter/splitter';

let splitObj: Splitter = new Splitter({
    height: '250px',
    paneSettings: [
        { size: '30%', content: "<div class='content'>Left pane</div>" },
        { size: '40%', content: "<div class='content'>Middle pane</div>" },
        { size: '30%', content: "<div class='content'>Right pane</div>" }
    ],
    width: '100%'
});
splitObj.appendTo('#splitter');