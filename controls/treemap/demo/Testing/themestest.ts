import { TreeMap } from '../../src/treemap/treemap';
import { TreeMapTooltip } from '../../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../../src/treemap/layout/legend';
import { TreeMapTheme } from '../../src';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend);
let treemap: TreeMap = new TreeMap({
    titleSettings: {
        text: 'TreeMap Testing',
        subtitleSettings: {
            text: 'Theme Testing'
        }
    },
    tooltipSettings: {
        visible: true,
    },
    dataSource: [{ fruit: 'Apple', count: 5000, visibility: true, color: '#71B081' },
    { fruit: 'Orange', count: 3000, visibility: false, color: '#5A9A77' },
    { fruit: 'Apple', count: 2300, visibility: true, color: '#498770' },
    { fruit: 'Banana', count: 500, visibility: false, color: '#39776C' },
    { fruit: 'Mango', count: 4300, visibility: true, color: '#266665' },
    { fruit: 'Papaya', count: 1200, visibility: false, color: '#124F5E' }
    ],
    weightValuePath: 'count',
    colorValuePath: 'color',
    palette: [],
    legendSettings: {
        visible: true,
        valuePath: 'fruit',
        title: {
            text: 'Legend Settings'
        }
    },
    leafItemSettings: {
        labelPath: 'fruit'
    }
});
treemap.appendTo("#container");
function treemapmethod(): TreeMap {
    let treemap: TreeMap = new TreeMap({
        titleSettings: {
            text: 'TreeMap Testing',
            subtitleSettings: {
                text: 'Theme Testing'
            }
        },
        tooltipSettings: {
            visible: true,
        },
        dataSource: [{ fruit: 'Apple', count: 5000, visibility: true, color: '#71B081' },
        { fruit: 'Orange', count: 3000, visibility: false, color: '#5A9A77' },
        { fruit: 'Apple', count: 2300, visibility: true, color: '#498770' },
        { fruit: 'Banana', count: 500, visibility: false, color: '#39776C' },
        { fruit: 'Mango', count: 4300, visibility: true, color: '#266665' },
        { fruit: 'Papaya', count: 1200, visibility: false, color: '#124F5E' }
        ],
        weightValuePath: 'count',
        colorValuePath: 'color',
        palette: [],
        legendSettings: {
            visible: true,
            valuePath: 'fruit',
            title: {
                text: 'Legend Settings'
            }
        },
        leafItemSettings: {
            labelPath: 'fruit'
        }
    });
    return treemap;
}

document.getElementById('Material').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'white';
    treemap.theme = 'Material';
    treemap.appendTo("#container");
};
document.getElementById('Fabric').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'white';
    treemap.theme = 'Fabric';
    treemap.appendTo("#container");
};
document.getElementById('Bootstrap').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'white';
    treemap.theme = 'Bootstrap';
    treemap.appendTo("#container");
};
document.getElementById('Highcontrast').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'white';
    treemap.theme = 'HighContrast'
    treemap.appendTo("#container");
};
document.getElementById('HighContrastLight').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'white';
    treemap.theme = 'HighContrastLight'
    treemap.appendTo("#container");
};
document.getElementById('MaterialDark').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'white';
    treemap.theme = 'MaterialDark';
    treemap.appendTo("#container");
};
document.getElementById('FabricDark').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'white';
    treemap.theme = 'FabricDark';
    treemap.appendTo("#container");
};
document.getElementById('BootstrapDark').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'black';
    treemap.theme = 'BootstrapDark';
    treemap.appendTo("#container");
};
document.getElementById('Bootstrap4').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'white';
    treemap.theme = 'Bootstrap4';
    treemap.appendTo("#container");
};
document.getElementById('Bootstrap5Dark').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'black';
    treemap.theme = 'Bootstrap5Dark';
    treemap.appendTo("#container");
};
document.getElementById('Bootstrap5').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'white';
    treemap.theme = 'Bootstrap5';
    treemap.appendTo("#container");
};
document.getElementById('Fluent').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'white';
    treemap.theme = 'Fluent';
    treemap.appendTo("#container");
};
document.getElementById('FluentDark').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'black';
    treemap.theme = 'FluentDark';
    treemap.appendTo("#container");
};
document.getElementById('Tailwind').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'white';
    treemap.theme = 'Tailwind';
    treemap.appendTo("#container");
};
document.getElementById('TailwindDark').onclick = () => {
    treemap.destroy();
    treemap = treemapmethod();
    document.body.style.backgroundColor = 'black';
    treemap.theme = 'TailwindDark';
    treemap.appendTo("#container");
};