import {
    Diagram, GridPanel
} from '../../src/diagram/index';

/**
 * Simple Grid
 */
let grid: GridPanel = new GridPanel();
grid.offsetX = 300;
grid.offsetY = 200;
grid.width = 100;
grid.height = 100;
grid.style.fill = 'red';
let diagram: Diagram = new Diagram({
    width: 1000, height: 1000, basicElements: [grid]
});
diagram.appendTo('#diagram');
document.getElementById('bgcolor').onchange = () => {
    diagram.nodes[0].style.strokeColor = (document.getElementById('bgcolor') as HTMLSelectElement).value;
    diagram.dataBind();
};