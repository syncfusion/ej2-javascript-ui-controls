/**
 * spec document for PdfTransformationMatrix.ts class
 */
import { PdfTransformationMatrix, Matrix, SizeF, PointF } from "../../../../src/index";
describe('PdfTransformationMatrix.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfTransformationMatrix = new PdfTransformationMatrix();
        it('-Matrix != undefined', () => {
            expect(t1.matrix).not.toBeUndefined();
        })
        it('-Set Matrix', () => {
            t1.matrix = new Matrix();
            expect(t1.matrix).not.toBeUndefined();
        })
        let t2 : PdfTransformationMatrix = new PdfTransformationMatrix(false);
        t1.translate(10, 10);
        t1.scale(10, 10);
        t2.scale(10, 10);
        it('-this.Scale(number, number) method calling', () => {
            let matrix : PdfTransformationMatrix = new PdfTransformationMatrix();
            matrix.matrix = new Matrix();
            t2.multiply(matrix);
            expect(matrix).not.toBeUndefined();
        })
        t1.rotate(90);
        t1.radiansToDegrees(10);
        PdfTransformationMatrix.degreesToRadians(20);
    })
})
describe('Matrix.ts', () => {
    describe('Constructor initializing',()=> {
        let t3 : Matrix = new Matrix();
        t3.transform(new PointF(10, 10));
        it('-t3.Transform(PointF) method calling', () => {
            let x2 : number;
            let y2 : number;
            let point : PointF = new PointF(x2, y2);
            expect(point).not.toBeUndefined();
        });
        t3.dispose();
        it('-t3.Dispose() method calling', () => {
            expect(t3.elements).toBeNull();
        })
        t3.clone();
        it('-t3.Clone() method calling', () => {
            let m : Matrix = new Matrix(t3.elements);
            expect(m).not.toBeUndefined();
        })
    })
})