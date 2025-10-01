import { ProgressBar } from '../src/index';

let progressBar: ProgressBar;
document.getElementById('render').addEventListener('click', renderBulletChart);
document.getElementById('destroy').addEventListener('click', destroyBulletChart);
function renderBulletChart(): void {
    progressBar = new ProgressBar({
        type: 'Linear',
        height: '60',
        value: 100,
        width: '600',
        progressThickness: 10,
        trackThickness: 10,
        tooltip: { enable: true },
        theme: 'Material3',
        animation: {
            enable: true,
            duration: 2000,
            delay: 0,
        }
    });
    progressBar.appendTo('#container');
}


function destroyBulletChart(): void {
    if (progressBar) {
        progressBar.destroy();
    }
}