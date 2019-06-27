import { createElement } from '@syncfusion/ej2-base';
import { DrawingRenderer } from '../src/drawing/rendering/renderer';
import { Matrix, rotateMatrix, identityMatrix, scaleMatrix, transformPointByMatrix, transformPointsByMatrix, translateMatrix } from '../src/drawing/primitives/matrix';
import { PointModel } from '../src/drawing/primitives/point-model';
describe('Diagram Control', () => {
    let renderer = new DrawingRenderer('diagram', false);

    describe('Simple canvas panel with children', () => {
        let ele: HTMLElement; let diagram: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                return;
            }
            diagram = createElement('div', { id: 'diagram' });
            document.body.appendChild(diagram);

        });
        afterAll((): void => {
            diagram = undefined;
            ele.remove();
        });

        it('Checking scale matrix1', function (done) {
            var matrix = identityMatrix();
            rotateMatrix(matrix, -50, 150, 150);
            scaleMatrix(matrix, .5, .5, 150, 150);
            done();
        });
        it('Checking checking transformPointByMatrix', function (done) {
            var matrix = identityMatrix();
            rotateMatrix(matrix, 45, 250, 150);
            var rotatedPoint = transformPointByMatrix(matrix, { x: 275, y: 150 });
            var newPoint1 = { x: rotatedPoint.x, y: rotatedPoint.y };
            done();
        });
        it('Checking checking transformPointsByMatrix', function (done) {
            var matrix = identityMatrix();
            rotateMatrix(matrix, 45, 250, 150);
            var rotatedPoints = transformPointsByMatrix(matrix, [{ x: 275, y: 150 }, { x: 290, y: 170 }]);
            done();
        });
        it('Checking checking transformPointsByMatrix', function (done) {
            let matrix: Matrix = identityMatrix();
            scaleMatrix(matrix, this.currentZoom, this.currentZoom);
            translateMatrix(matrix, this.horizontalOffset, this.verticalOffset);
            let focusPoint: PointModel = {
                x: 250,
                y: 150
            };
            focusPoint = transformPointByMatrix(matrix, focusPoint);
            done();
        });
    });


});