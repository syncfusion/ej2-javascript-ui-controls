import { WBorder } from '../../../src/document-editor/implementation/format/border';
describe('Border Validation Testing', () => {
    let border: WBorder;
    beforeEach(() => {
        border = new WBorder();
    });
    afterEach(() => {
        border.destroy();
        WBorder.clear();
    });
    it('set property value undefined', () => {
console.log('set property value undefined');
        border.shadow = undefined;
        expect(border.shadow).toBe(false);
    });
    it('Copy Format Testing', () => {
console.log('Copy Format Testing');
        let border1: WBorder = new WBorder();
        border.shadow = true;
        border.space = 10;
        border.shadow = false;
        border.space = 20;
        border.copyFormat(border);
        expect('').toBe('');
        border1.destroy();
    });
    it('Copy Format undefined Testing', () => {
console.log('Copy Format undefined Testing');
        border.copyFormat(border);
        expect('').toBe('');
    });
    it('destroy Testing', () => {
console.log('destroy Testing');
        border.destroy();
        expect('').toBe('');
        border.cloneFormat();
        expect(() => { border.destroy() }).not.toThrowError();
    });
    it('Clone Format Testing', () => {
console.log('Clone Format Testing');
        border.shadow = true;
        border.space = 10;
        border.shadow = false;
        border.space = 20;
        let returnBorder: WBorder = border.cloneFormat();
        expect(returnBorder.space).toBe(20);
        expect(returnBorder.shadow).toBe(false);
        returnBorder.destroy();
    });
    it('Border lineWidth for line style Engrave3D', () => {
console.log('Border lineWidth for line style Engrave3D');
        border.lineStyle = 'Engrave3D';
        border.getLineWidth();
        expect('').toBe('');
    });
    it('Border lineWidth for line style Thick', () => {
console.log('Border lineWidth for line style Thick');
        border.lineStyle = 'Thick';
        border.getLineWidth();
        expect('').toBe('');
    });
    it('Border lineWidth for line style SingleWavy', () => {
console.log('Border lineWidth for line style SingleWavy');
        border.lineStyle = 'SingleWavy';
        border.getLineWidth();
        expect('').toBe('');
    });
    it('Border lineWidth for line style DoubleWavy', () => {
console.log('Border lineWidth for line style DoubleWavy');
        border.lineStyle = 'DoubleWavy';
        border.getLineWidth();
        expect('').toBe('');
    });
    it('Border lineWidth for line style Outset', () => {
console.log('Border lineWidth for line style Outset');
        border.lineStyle = 'Outset';
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border lineWidth for line style ThinThickLargeGap', () => {
console.log('Border lineWidth for line style ThinThickLargeGap');
        border.lineStyle = 'ThinThickLargeGap';
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border lineWidth for line style ThickThinLargeGap', () => {
console.log('Border lineWidth for line style ThickThinLargeGap');
        border.lineStyle = 'ThickThinLargeGap';
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border lineWidth for line style ThinThickThinMediumGap', () => {
console.log('Border lineWidth for line style ThinThickThinMediumGap');
        border.lineStyle = 'ThinThickThinMediumGap';
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border lineWidth for line style ThinThickThinLargeGap', () => {
console.log('Border lineWidth for line style ThinThickThinLargeGap');
        border.lineStyle = 'ThinThickThinLargeGap';
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border lineWidth for line style Emboss3D', () => {
console.log('Border lineWidth for line style Emboss3D');
        border.lineStyle = 'Emboss3D';
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Thick', () => {
console.log('Border Weight for line style Thick');
        border.lineStyle = 'Thick';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DashLargeGap', () => {
console.log('Border Weight for line style DashLargeGap');
        border.lineStyle = 'DashLargeGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Single', () => {
console.log('Border Weight for line style Single');
        border.lineStyle = 'Single';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Double', () => {
console.log('Border Weight for line style Double');
        border.lineStyle = 'Double';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Dot', () => {
console.log('Border Weight for line style Dot');
        border.lineStyle = 'Dot';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DashLargeGap', () => {
console.log('Border Weight for line style DashLargeGap');
        border.lineStyle = 'DashLargeGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DashDot', () => {
console.log('Border Weight for line style DashDot');
        border.lineStyle = 'DashDot';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DashDotDot', () => {
console.log('Border Weight for line style DashDotDot');
        border.lineStyle = 'DashDotDot';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Triple', () => {
console.log('Border Weight for line style Triple');
        border.lineStyle = 'Triple';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThinThickSmallGap', () => {
console.log('Border Weight for line style ThinThickSmallGap');
        border.lineStyle = 'ThinThickSmallGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThickThinSmallGap', () => {
console.log('Border Weight for line style ThickThinSmallGap');
        border.lineStyle = 'ThickThinSmallGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThinThickThinSmallGap', () => {
console.log('Border Weight for line style ThinThickThinSmallGap');
        border.lineStyle = 'ThinThickThinSmallGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThinThickMediumGap', () => {
console.log('Border Weight for line style ThinThickMediumGap');
        border.lineStyle = 'ThinThickMediumGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThickThinMediumGap', () => {
console.log('Border Weight for line style ThickThinMediumGap');
        border.lineStyle = 'ThickThinMediumGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThinThickThinMediumGap', () => {
console.log('Border Weight for line style ThinThickThinMediumGap');
        border.lineStyle = 'ThinThickThinMediumGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThinThickLargeGap', () => {
console.log('Border Weight for line style ThinThickLargeGap');
        border.lineStyle = 'ThinThickLargeGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThickThinLargeGap', () => {
console.log('Border Weight for line style ThickThinLargeGap');
        border.lineStyle = 'ThickThinLargeGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style ThinThickThinLargeGap', () => {
console.log('Border Weight for line style ThinThickThinLargeGap');
        border.lineStyle = 'ThinThickThinLargeGap';
        border.getBorderWeight();
        border.getLineWidth();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style SingleWavy', () => {
console.log('Border Weight for line style SingleWavy');
        border.lineStyle = 'SingleWavy';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DoubleWavy', () => {
console.log('Border Weight for line style DoubleWavy');
        border.lineStyle = 'DoubleWavy';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DashSmallGap', () => {
console.log('Border Weight for line style DashSmallGap');
        border.lineStyle = 'DashSmallGap';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style DashDotStroked', () => {
console.log('Border Weight for line style DashDotStroked');
        border.lineStyle = 'DashDotStroked';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Emboss3D', () => {
console.log('Border Weight for line style Emboss3D');
        border.lineStyle = 'Emboss3D';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Engrave3D', () => {
console.log('Border Weight for line style Engrave3D');
        border.lineStyle = 'Engrave3D';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Outset', () => {
console.log('Border Weight for line style Outset');
        border.lineStyle = 'Outset';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
    it('Border Weight for line style Inset', () => {
console.log('Border Weight for line style Inset');
        border.lineStyle = 'Inset';
        border.getLineWidth();
        border.getBorderWeight();
        border.getPrecedence();
        expect('').toBe('');
    });
});
