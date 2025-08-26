import { HeatMap, Legend, Tooltip } from '../src/index';
HeatMap.Inject(Tooltip, Legend);

let heatmap: HeatMap;
const heatmapData: any[] = [
    [52, 65, 67, 45, 37, 52, 32, 76, 60, 64, 82, 91],
    [68, 52, 63, 51, 30, 51, 51, 81, 70, 60, 88, 80],
    [60, 50, 42, 53, 66, 70, 41, 69, 76, 74, 86, 97],
    [66, 64, 46, 40, 47, 41, 45, 76, 83, 69, 92, 84],
    [65, 42, 58, 32, 36, 44, 49, 79, 83, 69, 83, 93],
    [54, 46, 61, 46, 40, 39, 41, 69, 61, 84, 84, 87],
    [48, 46, 61, 47, 49, 41, 41, 67, 78, 83, 98, 87],
    [69, 52, 41, 44, 41, 52, 46, 71, 63, 84, 83, 91],
    [50, 59, 44, 43, 27, 42, 26, 64, 76, 65, 81, 86],
    [47, 49, 66, 53, 50, 34, 31, 79, 78, 79, 89, 95],
    [61, 40, 62, 26, 34, 54, 56, 74, 83, 78, 95, 98]
];

document.getElementById('render').addEventListener('click', renderHeatMap);
document.getElementById('destroy').addEventListener('click', destroyHeatMap);

function renderHeatMap(): void {
    heatmap = new HeatMap
        ({
            description: 'TreeMap first element',
            theme: 'Material3',
            allowSelection: true,
            titleSettings: {
                text: 'Product wise Monthly sales revenue for a e-commerce website',
                textStyle: {
                    size: '15px',
                    fontWeight: '500',
                    fontStyle: 'Normal',
                    fontFamily: 'Segoe UI'
                }
            },
            xAxis: {
                labels: ['Laptop', 'Mobile', 'Gaming', 'Cosmetics', 'Fragnance', 'Watches', 'Handbags', 'Apparels',
                    'Kitchenware', 'Furniture', 'Home Decor'],
                multiLevelLabels: [
                    {
                        overflow: 'Trim',
                        alignment: 'Near',
                        textStyle: {
                            color: 'black',
                            fontWeight: 'Bold'
                        },
                        border: { type: 'Rectangle', color: '#a19d9d' },
                        categories: [
                            { start: 0, end: 2, text: 'Electronics', },
                            { start: 3, end: 4, text: 'Beauty and personal care' },
                            { start: 5, end: 7, text: 'Fashion', },
                            { start: 8, end: 10, text: 'Household', }
                        ]
                    },
                ]
            },
            yAxis: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                multiLevelLabels: [
                    {
                        border: { type: 'Brace', color: '#a19d9d' },
                        categories: [
                            { start: 0, end: 2, text: 'Q1' },
                            { start: 3, end: 5, text: 'Q2' },
                            { start: 6, end: 8, text: 'Q3' },
                            { start: 9, end: 11, text: 'Q4' }
                        ]
                    },
                    {
                        border: { type: 'Brace', color: '#a19d9d' },
                        categories: [
                            { start: 0, end: 5, text: 'First Half Yearly' },
                            {
                                start: 6,
                                end: 11,
                                text: 'Second Half Yearly'
                            }
                        ]
                    },
                    {
                        border: { type: 'Brace', color: '#a19d9d' },
                        categories: [
                            { start: 0, end: 11, text: 'Yearly' }
                        ]
                    }
                ]
            },
            legendSettings: {
                visible: true
            },
            showTooltip: true,
            tooltipSettings: {
                fill: '#696295',
                textStyle: {
                    color: '#FFFFFF',
                    size: '12px'
                },
                border: {
                    width: 2,
                    color: '#F0C27B'
                }
            },
            cellSettings: {
                showLabel: true,
                labelTemplate:
                    '<div style="width:25px;height:20px;text-align:center;padding-top:2px;background-color:#5BBB9C; border: 1px solid #000000; border-radius:50%;font-weight:bold;">${value}</div>',
            },
            paletteSettings: {
                palette: [{ color: '#F0C27B' },
                { color: '#4B1248' }
                ]
            },
            dataSource: heatmapData
        });
    heatmap.appendTo('#heatmap');
}

function destroyHeatMap(): void {
    if (heatmap && !heatmap.isDestroyed) {
        heatmap.destroy();
    }
}