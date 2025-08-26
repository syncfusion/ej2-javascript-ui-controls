import { Splitter } from '../src/splitter/splitter';
let expandObj: Splitter;
let horizondalLayoutObj: Splitter;
let verticalObj: Splitter;

function renderSplitters(): void {
    expandObj = new Splitter({
        height: '250px',
        paneSettings: [
            { collapsible: true, size: '30%' },
            { collapsible: true, size: '40%' },
            { collapsible: true, size: '30%' }
        ],
        width: '100%'
    });
    expandObj.appendTo('#expandCollapseSplitter');

    horizondalLayoutObj = new Splitter({
        height: '250px',
        paneSettings: [
            { size: '200px' },
            { size: '200px' },
            { size: '200px' }
        ],
        width: '600px'
    });
    horizondalLayoutObj.appendTo('#Horizontal_layout_splitter');

    verticalObj = new Splitter({
        height: '305px',
        paneSettings: [
            { size: '100px' },
            { size: '100px' },
            { size: '100px' }
        ],
        width: '600px',
        orientation: 'Vertical'
    });
    verticalObj.appendTo('#vartical_splitter');
}

function destroySplitters(): void {
    [expandObj, horizondalLayoutObj, verticalObj].forEach((instance, index) => {
        if (instance) {
            instance.destroy();
            instance = null;
        }
    });
}

document.getElementById('render').addEventListener('click', renderSplitters);
document.getElementById('destroy').addEventListener('click', destroySplitters);