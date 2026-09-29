import {
    Matrix, MatrixTypes, identityMatrix, transformPointByMatrix, transformPointsByMatrix,
    rotateMatrix, scaleMatrix, translateMatrix, multiplyMatrix
} from '../../../src/diagram/primitives/matrix';

describe('Matrix', () => {
    it('creates identity and translation matrices', () => {
        const identity: Matrix = identityMatrix();
        expect(identity.m11).toBe(1);
        expect(identity.m12).toBe(0);
        expect(identity.m21).toBe(0);
        expect(identity.m22).toBe(1);
        expect(identity.offsetX).toBe(0);
        expect(identity.offsetY).toBe(0);
        expect(identity.type).toBe(MatrixTypes.Identity);

        translateMatrix(identity, 12, -7);
        expect(identity.offsetX).toBe(12);
        expect(identity.offsetY).toBe(-7);
        expect(identity.type & MatrixTypes.Translation).toBe(MatrixTypes.Translation);
        expect(transformPointByMatrix(identity, { x: 3, y: 4 })).toEqual({ x: 15, y: -3 });

        const defaultType: Matrix = new Matrix(1, 0, 0, 1, 0, 0);
        expect(defaultType.type).toBeUndefined();
        expect(transformPointByMatrix(defaultType, { x: 2, y: 3 })).toEqual({ x: 2, y: 3 });
    });

    it('transforms points with scaling and rounds results', () => {
        const matrix: Matrix = new Matrix(2, 0, 0, 3, 5, -4, MatrixTypes.Translation | MatrixTypes.Scaling);
        expect(transformPointByMatrix(matrix, { x: 1.234, y: 2.345 })).toEqual({ x: 7.47, y: 3.04 });
        expect(transformPointsByMatrix(matrix, [{ x: 0, y: 0 }, { x: 2, y: -1 }])).toEqual([
            { x: 5, y: -4 }, { x: 9, y: -7 }
        ]);
    });

    it('scales around the origin and around a center', () => {
        const origin: Matrix = identityMatrix();
        scaleMatrix(origin, 2, 3);
        expect(transformPointByMatrix(origin, { x: 4, y: 5 })).toEqual({ x: 8, y: 15 });

        const centered: Matrix = identityMatrix();
        scaleMatrix(centered, 2, 3, 10, 20);
        expect(transformPointByMatrix(centered, { x: 10, y: 20 })).toEqual({ x: 10, y: 20 });
        expect(transformPointByMatrix(centered, { x: 11, y: 21 })).toEqual({ x: 12, y: 23 });

        const xCentered: Matrix = identityMatrix();
        scaleMatrix(xCentered, 2, 3, 10, 0);
        expect(transformPointByMatrix(xCentered, { x: 11, y: 1 })).toEqual({ x: 12, y: 3 });
        const yCentered: Matrix = identityMatrix();
        scaleMatrix(yCentered, 2, 3, 0, 20);
        expect(transformPointByMatrix(yCentered, { x: 1, y: 21 })).toEqual({ x: 2, y: 23 });
    });

    it('rotates around the origin and around a center', () => {
        const origin: Matrix = identityMatrix();
        rotateMatrix(origin, 90, 0, 0);
        const rotated = transformPointByMatrix(origin, { x: 2, y: 0 });
        expect(rotated.x).toBeCloseTo(0, 10);
        expect(rotated.y).toBeCloseTo(2, 10);

        const centered: Matrix = identityMatrix();
        rotateMatrix(centered, 90, 10, 10);
        const centeredPoint = transformPointByMatrix(centered, { x: 11, y: 10 });
        expect(centeredPoint.x).toBeCloseTo(10, 10);
        expect(centeredPoint.y).toBeCloseTo(11, 10);

        const xCentered: Matrix = identityMatrix();
        rotateMatrix(xCentered, 90, 10, 0);
        const xCenteredPoint = transformPointByMatrix(xCentered, { x: 11, y: 0 });
        expect(xCenteredPoint.x).toBeCloseTo(10, 10);
        expect(xCenteredPoint.y).toBeCloseTo(1, 10);

        const yCentered: Matrix = identityMatrix();
        rotateMatrix(yCentered, 90, 0, 10);
        const yCenteredPoint = transformPointByMatrix(yCentered, { x: 0, y: 11 });
        expect(yCenteredPoint.x).toBeCloseTo(-1, 10);
        expect(yCenteredPoint.y).toBeCloseTo(10, 10);

        const normalized: Matrix = identityMatrix();
        rotateMatrix(normalized, 450, 0, 0);
        const normalizedPoint = transformPointByMatrix(normalized, { x: 1, y: 0 });
        expect(normalizedPoint.x).toBeCloseTo(0, 10);
        expect(normalizedPoint.y).toBeCloseTo(1, 10);
    });

    it('multiplies identity, translation, scaling, and general matrices', () => {
        const copied: Matrix = identityMatrix();
        const translation: Matrix = new Matrix(1, 0, 0, 1, 8, 9, MatrixTypes.Translation);
        multiplyMatrix(copied, translation);
        expect(copied.offsetX).toBe(8);
        expect(copied.offsetY).toBe(9);
        expect(copied.type).toBe(MatrixTypes.Translation);

        const scaling: Matrix = new Matrix(2, 0, 0, 3, 0, 0, MatrixTypes.Scaling);
        const secondScaling: Matrix = new Matrix(4, 0, 0, 5, 0, 0, MatrixTypes.Scaling);
        const rotation: Matrix = new Matrix(0, 1, -1, 0, 0, 0, MatrixTypes.Unknown);
        multiplyMatrix(scaling, secondScaling);
        expect(scaling.m11).toBe(2);
        expect(scaling.m22).toBe(3);

        const combinedScaling: Matrix = new Matrix(2, 0, 0, 3, 4, 5,
            MatrixTypes.Translation | MatrixTypes.Scaling);
        multiplyMatrix(combinedScaling, secondScaling);
        expect(combinedScaling.m11).toBe(8);
        expect(combinedScaling.m22).toBe(15);
        expect(combinedScaling.offsetX).toBe(16);
        expect(combinedScaling.offsetY).toBe(25);

        const combinedScalingAndTranslation: Matrix = new Matrix(2, 0, 0, 3, 4, 5,
            MatrixTypes.Translation | MatrixTypes.Scaling);
        const combinedTranslationMatrix: Matrix = new Matrix(4, 0, 0, 5, 6, 7,
            MatrixTypes.Translation | MatrixTypes.Scaling);
        multiplyMatrix(combinedScalingAndTranslation, combinedTranslationMatrix);
        expect(combinedScalingAndTranslation.m11).toBe(8);
        expect(combinedScalingAndTranslation.m22).toBe(15);
        expect(combinedScalingAndTranslation.offsetX).toBe(22);
        expect(combinedScalingAndTranslation.offsetY).toBe(32);

        const combinedTranslation: Matrix = new Matrix(2, 0, 0, 3, 4, 5,
            MatrixTypes.Translation | MatrixTypes.Scaling);
        multiplyMatrix(combinedTranslation, translation);
        expect(combinedTranslation.m11).toBe(2);
        expect(combinedTranslation.m22).toBe(3);
        expect(combinedTranslation.offsetX).toBe(4);
        expect(combinedTranslation.offsetY).toBe(5);

        const combinedUnknown: Matrix = new Matrix(2, 0, 0, 3, 4, 5,
            MatrixTypes.Translation | MatrixTypes.Scaling);
        multiplyMatrix(combinedUnknown, rotation);
        expect(combinedUnknown.m11).toBe(0);
        expect(combinedUnknown.m12).toBe(2);
        expect(combinedUnknown.m21).toBe(-3);
        expect(combinedUnknown.m22).toBe(0);
        expect(combinedUnknown.offsetX).toBe(-5);
        expect(combinedUnknown.offsetY).toBe(4);

        const general: Matrix = new Matrix(1, 2, 3, 4, 5, 6, MatrixTypes.Unknown);
        multiplyMatrix(general, rotation);
        expect(general.m11).toBe(-2);
        expect(general.m12).toBe(1);
        expect(general.m21).toBe(-4);
        expect(general.m22).toBe(3);
        expect(general.offsetX).toBe(-6);
        expect(general.offsetY).toBe(5);

        const unknownScaling: Matrix = new Matrix(1, 2, 3, 4, 5, 6, MatrixTypes.Unknown);
        multiplyMatrix(unknownScaling, secondScaling);
        expect(unknownScaling.m11).toBe(4);
        expect(unknownScaling.m12).toBe(10);
        expect(unknownScaling.m21).toBe(12);
        expect(unknownScaling.m22).toBe(20);

        const unknownCombined: Matrix = new Matrix(1, 2, 3, 4, 5, 6, MatrixTypes.Unknown);
        multiplyMatrix(unknownCombined, combinedTranslationMatrix);
        expect(unknownCombined.m11).toBe(4);
        expect(unknownCombined.m12).toBe(10);
        expect(unknownCombined.m21).toBe(12);
        expect(unknownCombined.m22).toBe(20);

        const translationScaling: Matrix = new Matrix(1, 0, 0, 1, 10, 20, MatrixTypes.Translation);
        multiplyMatrix(translationScaling, secondScaling);
        expect(translationScaling.offsetX).toBe(40);
        expect(translationScaling.offsetY).toBe(100);
        expect(translationScaling.type).toBe(MatrixTypes.Translation | MatrixTypes.Scaling);

        const translated: Matrix = new Matrix(1, 0, 0, 1, 10, 20, MatrixTypes.Translation);
        multiplyMatrix(translated, rotation);
        expect(translated.offsetX).toBe(-20);
        expect(translated.offsetY).toBe(10);
        expect(translated.type).toBe(MatrixTypes.Unknown);

        const translatedGeneral: Matrix = new Matrix(1, 0, 0, 1, 10, 20, MatrixTypes.Translation);
        const generalTransform: Matrix = new Matrix(2, 1, 3, 4, 5, 6, MatrixTypes.Unknown);
        multiplyMatrix(translatedGeneral, generalTransform);
        expect(translatedGeneral.offsetX).toBe(85);
        expect(translatedGeneral.offsetY).toBe(96);
        expect(translatedGeneral.type).toBe(MatrixTypes.Unknown);
    });
});
