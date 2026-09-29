import { PdfCrossReferenceType } from "../src/pdf/core/enumerator";
import { PdfFileStructure } from "../src/pdf/core/pdf-file-structure";
describe('PdfFileStructure property mutations', () => {
    it('crossReferenceType getter returns the value assigned by the setter', () => {
        // Arrange
        const fileStructure: PdfFileStructure = new PdfFileStructure();
        const previousCrossReferenceType: PdfCrossReferenceType = fileStructure.crossReferenceType;
        const crossReferenceType: PdfCrossReferenceType = PdfCrossReferenceType.stream;
        // Act
        fileStructure.crossReferenceType = crossReferenceType;
        // Assert
        expect(fileStructure.crossReferenceType).toBe(PdfCrossReferenceType.stream);
        expect(fileStructure.crossReferenceType).toBe(crossReferenceType);
        expect(fileStructure._crossReferenceType).toBe(crossReferenceType);
        // Restore
        fileStructure.crossReferenceType = previousCrossReferenceType;
        expect(fileStructure.crossReferenceType).toBe(previousCrossReferenceType);
    });
    it('isIncrementalUpdate getter returns the value assigned by the setter', () => {
        // Arrange
        const fileStructure: PdfFileStructure = new PdfFileStructure();
        const previousIncrementalUpdate: boolean = fileStructure.isIncrementalUpdate;
        // Act
        fileStructure.isIncrementalUpdate = false;
        // Assert
        expect(fileStructure.isIncrementalUpdate).toBeFalsy();
        expect(fileStructure.isIncrementalUpdate).toBeFalsy();
        expect(fileStructure._incrementalUpdate).toBeFalsy();
        // Act
        fileStructure.isIncrementalUpdate = true;
        // Assert
        expect(fileStructure.isIncrementalUpdate).toBeTruthy();
        expect(fileStructure.isIncrementalUpdate).toBeTruthy();
        expect(fileStructure._incrementalUpdate).toBeTruthy();
        // Restore
        fileStructure.isIncrementalUpdate = previousIncrementalUpdate;
        expect(fileStructure.isIncrementalUpdate).toBe(previousIncrementalUpdate);
    });
});