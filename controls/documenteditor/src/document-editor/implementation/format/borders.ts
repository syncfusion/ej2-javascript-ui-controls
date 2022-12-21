import { LineStyle } from '../../base/types';
import { WBorder } from './border';
import { isNullOrUndefined , Property } from '@syncfusion/ej2-base';
import { BlockContainer, IWidget, ParagraphWidget } from '../viewer/page';
import { WParagraphFormat } from './paragraph-format';
import { WParagraphStyle } from './style';
/**
 * @private
 */
export class WBorders implements IWidget {
    private leftIn: WBorder = new WBorder(this);
    private rightIn: WBorder = new WBorder(this);
    private topIn: WBorder = new WBorder(this);
    private bottomIn: WBorder = new WBorder(this);
    private horizontalIn: WBorder = new WBorder(this);
    private verticalIn: WBorder = new WBorder(this);
    private diagonalUpIn: WBorder = new WBorder(this);
    private diagonalDownIn: WBorder = new WBorder(this);
    public isParsing: boolean = false;
    public ownerBase: Object;

    public get left(): WBorder {
        if (this.ownerBase instanceof WParagraphFormat) {
            return this.getPropertyValue('left') as WBorder;
        }
        return this.leftIn;
    }
    public set left(value: WBorder) {
        this.leftIn = value;
    }
    public get right(): WBorder {
        if (this.ownerBase instanceof WParagraphFormat) {
            return this.getPropertyValue('right') as WBorder;
        }
        return this.rightIn;
    }
    public set right(value: WBorder) {
        this.rightIn = value;
    }
    public get top(): WBorder {
        if (this.ownerBase instanceof WParagraphFormat) {
            return this.getPropertyValue('top') as WBorder;
        }
        return this.topIn;
    }
    public set top(value: WBorder) {
        this.topIn = value;
    }
    public get bottom(): WBorder {
        if (this.ownerBase instanceof WParagraphFormat) {
            return this.getPropertyValue('bottom') as WBorder;
        }
        return this.bottomIn;
    }
    public set bottom(value: WBorder) {
        this.bottomIn = value;
    }
    public get horizontal(): WBorder {
        if (this.ownerBase instanceof WParagraphFormat) {
            return this.getPropertyValue('horizontal') as WBorder;
        }
        return this.horizontalIn;
    }
    public set horizontal(value: WBorder) {
        this.horizontalIn = value;
    }
    public get vertical(): WBorder {
        if (this.ownerBase instanceof WParagraphFormat) {
            return this.getPropertyValue('vertical') as WBorder;
        }
        return this.verticalIn;
    }
    public set vertical(value: WBorder) {
        this.verticalIn = value;
    }
    public get diagonalUp(): WBorder {
        return this.diagonalUpIn;
    }
    public set diagonalUp(value: WBorder) {
        this.diagonalUpIn = value;
    }
    public get diagonalDown(): WBorder {
        return this.diagonalDownIn;
    }
    public set diagonalDown(value: WBorder) {
        this.diagonalDownIn = value;
    }

    public constructor(node?: Object) {
        this.ownerBase = node;
    }
    private getPropertyValue(property: string): Object {
        let border: WBorder = this.getBorder(property);
        if (this.isParsing) {
            return border;
        }
        if (!border.hasValues()) {
            let baseStyle: WParagraphStyle = (this.ownerBase as WParagraphFormat).baseStyle as WParagraphStyle;
            if (!isNullOrUndefined(baseStyle)) {
                let currentFormat: WBorders = this;
                while (!isNullOrUndefined(baseStyle)) {
                    let listParaFormat: WParagraphFormat;
                    if (!(this.ownerBase as WParagraphFormat).listFormat.hasValue('listId')) {
                        listParaFormat = baseStyle.paragraphFormat.getListPargaraphFormat(property);
                    }
                    if (baseStyle.paragraphFormat.borders.getBorder(property).hasValues()) {
                        currentFormat = baseStyle.paragraphFormat.borders;
                        break;
                    } else if (!isNullOrUndefined(listParaFormat) &&
                        ((listParaFormat as WParagraphFormat).borders.getBorder(property).hasValues())) {
                        currentFormat = listParaFormat.borders;
                        break;
                    } else {
                        baseStyle = baseStyle.basedOn as WParagraphStyle;
                    }
                }
                if (!isNullOrUndefined(baseStyle)) {
                    return currentFormat.getBorder(property);
                }
            }
        } else {
            return border;
        }
        return this.getDefaultValue(property);
    }
    private getDefaultValue(property: string): Object {
        const docParagraphFormat: WParagraphFormat = this.documentParagraphFormat();
        let border: WBorder;
        if (!isNullOrUndefined(docParagraphFormat) && !isNullOrUndefined(docParagraphFormat.borders)) {
            border = docParagraphFormat.borders.getBorder(property);
        }
        return border;
    }
    private documentParagraphFormat(): WParagraphFormat {
        let docParagraphFormat: WParagraphFormat;
        if (this.ownerBase instanceof WParagraphFormat) {
            docParagraphFormat = (this.ownerBase as WParagraphFormat).getDocumentParagraphFormat();
        }
        return docParagraphFormat;
    }
    public getBorder(property: string): WBorder {
        let value: WBorder = undefined;
        switch (property) {
            case 'left':
                return this.leftIn;
            case 'right':
                return this.rightIn;
            case 'top':
                return this.topIn;
            case 'bottom':
                return this.bottomIn;
            case 'vertical':
                return this.verticalIn;
            case 'horizontal':
                return this.horizontalIn;
        }
        return value;
    }
    /**
     * @private
     */
    public clearFormat(): void {
        if (!isNullOrUndefined(this.leftIn)) {
            this.leftIn.clearFormat();
        }
        if (!isNullOrUndefined(this.topIn)) {
            this.topIn.clearFormat();
        }
        if (!isNullOrUndefined(this.bottomIn)) {
            this.bottomIn.clearFormat();
        }
        if (!isNullOrUndefined(this.rightIn)) {
            this.rightIn.clearFormat();
        }
        if (!isNullOrUndefined(this.horizontalIn)) {
            this.horizontalIn.clearFormat();
        }
        if (!isNullOrUndefined(this.verticalIn)) {
            this.verticalIn.clearFormat();
        }
        if (!isNullOrUndefined(this.diagonalDown)) {
            this.diagonalDown.clearFormat();
        }
        if (!isNullOrUndefined(this.diagonalUp)) {
            this.diagonalUp.clearFormat();
        }
    }
    /* eslint-enable */
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.leftIn)) {
            this.leftIn.destroy();
        }
        if (!isNullOrUndefined(this.topIn)) {
            this.topIn.destroy();
        }
        if (!isNullOrUndefined(this.bottomIn)) {
            this.bottomIn.destroy();
        }
        if (!isNullOrUndefined(this.rightIn)) {
            this.rightIn.destroy();
        }
        if (!isNullOrUndefined(this.horizontalIn)) {
            this.horizontalIn.destroy();
        }
        if (!isNullOrUndefined(this.verticalIn)) {
            this.verticalIn.destroy();
        }
        if (!isNullOrUndefined(this.diagonalDown)) {
            this.diagonalDown.destroy();
        }
        if (!isNullOrUndefined(this.diagonalUp)) {
            this.diagonalUp.destroy();
        }
        this.topIn = undefined;
        this.bottomIn = undefined;
        this.leftIn = undefined;
        this.rightIn = undefined;
        this.horizontalIn = undefined;
        this.verticalIn = undefined;
        this.diagonalDownIn = undefined;
        this.diagonalUpIn = undefined;
        this.ownerBase = undefined;
    }
    public cloneFormat(): WBorders {
        const borders: WBorders = new WBorders(undefined);
        borders.top = isNullOrUndefined(this.topIn) ? undefined : this.topIn.cloneFormat();
        borders.bottom = isNullOrUndefined(this.bottomIn) ? undefined : this.bottomIn.cloneFormat();
        borders.left = isNullOrUndefined(this.leftIn) ? undefined : this.leftIn.cloneFormat();
        borders.right = isNullOrUndefined(this.rightIn) ? undefined : this.rightIn.cloneFormat();
        borders.horizontal = isNullOrUndefined(this.horizontalIn) ? undefined : this.horizontalIn.cloneFormat();
        borders.vertical = isNullOrUndefined(this.verticalIn) ? undefined : this.verticalIn.cloneFormat();
        borders.diagonalUp = isNullOrUndefined(this.diagonalUp) ? undefined : this.diagonalUp.cloneFormat();
        borders.diagonalDown = isNullOrUndefined(this.diagonalDown) ? undefined : this.diagonalDown.cloneFormat();
        return borders;
    }
    public copyFormat(borders: WBorders): void {
        if (!isNullOrUndefined(borders.getBorder('left')) && borders.getBorder('left') instanceof WBorder) {
            let left: WBorder = new WBorder(this);
            left.copyFormat(borders.getBorder('left'));
            this.left = left;
        }
        if (!isNullOrUndefined(borders.getBorder('right')) && borders.getBorder('right') instanceof WBorder) {
            let right: WBorder = new WBorder(this);
            (right as WBorder).copyFormat(borders.getBorder('right'));
            this.right = right;
        }
        if (!isNullOrUndefined(borders.getBorder('top')) && borders.getBorder('top') instanceof WBorder) {
            let top: WBorder = new WBorder(this);
            (top as WBorder).copyFormat(borders.getBorder('top'));
            this.top = top;
        }
        if (!isNullOrUndefined(borders.getBorder('bottom')) && borders.getBorder('bottom') instanceof WBorder) {
            let bottom: WBorder = new WBorder(this);
            (bottom as WBorder).copyFormat(borders.getBorder('bottom'));
            this.bottom = bottom;
        }
        if (!isNullOrUndefined(borders.getBorder('horizontal')) && borders.getBorder('horizontal') instanceof WBorder) {
            let horizontal: WBorder = new WBorder(this);
            (horizontal as WBorder).copyFormat(borders.getBorder('horizontal'));
            this.horizontal = horizontal;
        }
        if (!isNullOrUndefined(borders.getBorder('vertical')) && borders.getBorder('vertical') instanceof WBorder) {
            let vertical: WBorder = new WBorder(this);
            (vertical as WBorder).copyFormat(borders.getBorder('vertical'));
            this.vertical = vertical;
        }
        if (!isNullOrUndefined(borders.diagonalDown) && borders.diagonalDown instanceof WBorder) {
            this.diagonalDown = new WBorder(this);
            (this.diagonalDown as WBorder).copyFormat(borders.diagonalDown);
        }
        if (!isNullOrUndefined(borders.diagonalUp) && borders.diagonalUp instanceof WBorder) {
            this.diagonalUp = new WBorder(this);
            (this.diagonalUp as WBorder).copyFormat(borders.diagonalUp);
        }
    }
}
