import { StyleType } from '../../base/index';
import { WParagraphFormat } from './paragraph-format';
import { WCharacterFormat } from './character-format';
import { HelperMethods } from '../editor/editor-helper';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * @private
 */
export abstract class WStyle {
    public ownerBase: Object;
    public type: StyleType;
    public next: WStyle;
    public basedOn: WStyle;
    public link: WStyle;
    public name: string;
}
/**
 * @private
 */
export class WParagraphStyle extends WStyle {
    /**
     * Specifies the paragraph format
     *
     * @default undefined
     */
    public paragraphFormat: WParagraphFormat;
    /**
     * Specifies the character format
     *
     * @default undefined
     */
    public characterFormat: WCharacterFormat;
    public constructor(node?: Object) {
        super();
        this.ownerBase = node;
        this.paragraphFormat = new WParagraphFormat(this);
        this.characterFormat = new WCharacterFormat(this);
    }
    /**
     * @private
     * @returns {void}
     */
    public clear(): void {
        if (this.characterFormat) {
            this.characterFormat.clearFormat();
        }
        if (this.paragraphFormat) {
            this.paragraphFormat.clearFormat();
        }
    }
    /**
     * Disposes the internal objects which are maintained.
     *
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.characterFormat) {
            this.characterFormat.destroy();
            this.characterFormat = undefined;
        }
        if (this.paragraphFormat) {
            this.paragraphFormat.destroy();
            this.paragraphFormat = undefined;
        }
        this.ownerBase = undefined;
        this.name = undefined;
        this.next = undefined;
        this.basedOn = undefined;
        this.link = undefined;
    }
    public copyStyle(paraStyle: WParagraphStyle): void {
        this.name = paraStyle.name;
        this.ownerBase = paraStyle.ownerBase;
        this.type = paraStyle.type;
        this.next = paraStyle.next;
        this.basedOn = paraStyle.basedOn;
        this.link = paraStyle.link;
        this.characterFormat.copyFormat(paraStyle.characterFormat);
        this.paragraphFormat.copyFormat(paraStyle.paragraphFormat);
    }
}
/**
 * @private
 */
export class WCharacterStyle extends WStyle {
    /**
     * Specifies the character format
     *
     * @default undefined
     */
    public characterFormat: WCharacterFormat;
    public constructor(node?: Object) {
        super();
        this.ownerBase = node;
        this.characterFormat = new WCharacterFormat(this);
    }
    /**
     * @private
     * @returns {void}
     */
    public clear(): void {
        if (this.characterFormat) {
            this.characterFormat.clearFormat();
        }
    }
    /**
     * Disposes the internal objects which are maintained.
     *
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.characterFormat) {
            this.characterFormat.destroy();
            this.characterFormat = undefined;
        }
        this.ownerBase = undefined;
        this.name = undefined;
        this.next = undefined;
        this.basedOn = undefined;
        this.link = undefined;
    }
    public copyStyle(charStyle: WCharacterStyle): void {
        this.name = charStyle.name;
        this.ownerBase = charStyle.ownerBase;
        this.type = charStyle.type;
        this.next = charStyle.next;
        this.basedOn = charStyle.basedOn;
        this.characterFormat.copyFormat(charStyle.characterFormat);
    }
}
/**
 * @private
 */
export class WTableStyle extends WStyle {
    public constructor(node?: Object) {
        super();
        this.ownerBase = node;
    }
    /**
     * Disposes the internal objects which are maintained.
     *
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.ownerBase = undefined;
        this.name = undefined;
        this.next = undefined;
        this.basedOn = undefined;
        this.link = undefined;
    }
}
/**
 * @private
 */
export class WStyles {
    public collection: Object[] = [];
    public get length(): number {
        return this.collection.length;
    }
    public remove(item: WParagraphStyle | WCharacterStyle): void {
        this.collection = this.collection.filter((a: WStyle) => (a.name !== item.name));
    }
    public push(item: WParagraphStyle | WCharacterStyle): number {
        if (item != null && item !== undefined) {
            this.collection.push(item);
        }
        return 1;
    }
    public getItem(index: number): Object {
        if (this.collection.length > index) {
            return this.collection[parseInt(index.toString(), 10)];
        }
        return null;
    }
    public indexOf(item: WParagraphStyle | WCharacterStyle): number {
        return this.collection.indexOf(item);
    }
    public contains(item: WParagraphStyle | WCharacterStyle): boolean {
        const index: number = this.collection.indexOf(item);
        return index > -1 && index < this.collection.length;
    }
    public clear(): void {
        if (this.collection && this.collection.length > 0) {
            for (let i: number = 0; i < this.collection.length; i++) {
                const style: Object = this.collection[parseInt(i.toString(), 10)];
                if (style instanceof WCharacterStyle) {
                    (style as WCharacterStyle).clear();
                } else if (style instanceof WParagraphStyle) {
                    (style as WParagraphStyle).clear();
                }
            }
        }
        this.collection = [];
    }
    public findByName(name: string, type?: StyleType): Object {
        let returnStyle: Object;
        for (const value of this.collection) {
            if ((value as WStyle).name === name) {
                returnStyle = value;
                if (!isNullOrUndefined(type)) {
                    if ((value as WStyle).type !== type) {
                        returnStyle = undefined;
                    }
                }
            }
        }
        return returnStyle;
    }
    public getStyleNames(type?: StyleType): string[] {
        return this.collection.filter((a: WStyle) => (a.type === type)).map((a: WStyle) => {
            return a.name;
        });
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public getStyles(type?: StyleType): Object[] {
        const styles: WStyle[] = this.collection.filter((a: WStyle) => (a.type === type)).map((a: WStyle) => {
            return a;
        });
        const styleObjects: any = [];
        for (const style of styles) {
            const returnStyle: any = {};
            const returnStyleObject: any = {};
            if (type === 'Paragraph') {
                returnStyleObject.paragraphFormat = {};
                HelperMethods.writeParagraphFormat(returnStyleObject.paragraphFormat, true, (style as any).paragraphFormat);
            }
            if (type !== 'Table') {
                returnStyleObject.characterFormat = {};
                HelperMethods.writeCharacterFormat(returnStyleObject.characterFormat, true, (style as any).characterFormat);
            }
            returnStyle.name = style.name;
            returnStyle.style = JSON.stringify(returnStyleObject);
            if (!isNullOrUndefined(type)) {
                returnStyle.type = type;
                if (returnStyle.type === 'Paragraph' && !isNullOrUndefined(style.link)){
                    returnStyle.type = 'Linked';
                }
            }
            styleObjects.push(returnStyle);
        }
        return styleObjects;
    }

    /**
     * Disposes the internal objects which are maintained.
     *
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.collection && this.collection.length > 0) {
            for (let i: number = 0; i < this.collection.length; i++) {
                const style: Object = this.collection[parseInt(i.toString(), 10)];
                if (style instanceof WCharacterStyle) {
                    (style as WCharacterStyle).destroy();
                } else if (style instanceof WParagraphStyle) {
                    (style as WParagraphStyle).destroy();
                } else if (style instanceof WTableStyle) {
                    (style as WTableStyle).destroy();
                }
            }
        }
        this.collection = [];
        this.collection = undefined;
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
}
