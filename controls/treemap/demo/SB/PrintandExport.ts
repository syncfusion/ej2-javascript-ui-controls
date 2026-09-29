import { TreeMap } from '../../src/treemap/treemap';
import { TreeMapTooltip } from '../../src/treemap/user-interaction/tooltip';
import { TreeMapLegend } from '../../src/treemap/layout/legend';
import { ProductSale } from '../treemapData/product';
import { Print, ImageExport, PdfExport } from '../../src/index';
TreeMap.Inject(TreeMapTooltip, TreeMapLegend, Print, ImageExport, PdfExport);


let treemap: TreeMap = new TreeMap({
    titleSettings: {
        text: 'Top 10 best selling smartphone brands - 2017',
        textStyle: { size: '15px' }
    },
    allowPrint: true,
    allowImageExport: true,
    allowPdfExport: true,
    dataSource: ProductSale,
    layoutType: 'SliceAndDiceVertical',
    weightValuePath: 'Percentage',
    rangeColorValuePath: 'Percentage',
    tooltipSettings: {
        visible: true,
        format: '${Product} (+${Percentage}) %'
    },
    leafItemSettings: {
        labelPath: 'Product',
        fill: '#6699cc',
        border: { color: 'black', width: 0.5 },
        labelPosition: 'Center',
        interSectAction: 'Hide',
        labelFormat: '${Product} (+${Percentage}) %',
        colorMapping: [
            {
                from: 1.3,
                to: 22,
                color: '#FAB665',
                minOpacity: 0.5,
                maxOpacity: 1
            }
        ]
    },
});
treemap.appendTo('#container');

document.getElementById('print').onclick = () => {
    treemap.print();
};
document.getElementById('export').onclick = () => {
    treemap.export("JPEG", "TreeMap");
};
document.getElementById('export1').onclick = () => {
    treemap.export("PNG", "TreeMap");
};
document.getElementById('export2').onclick = () => {
    treemap.export("SVG", "TreeMap");
};
document.getElementById('export3').onclick = () => {
    treemap.export("PDF", "TreeMap");
};