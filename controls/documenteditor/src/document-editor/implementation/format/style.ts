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
    public destroy(): void {
        this.characterFormat.destroy();
        this.paragraphFormat.destroy();
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
    public destroy(): void {
        this.characterFormat.destroy();
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
export class WStyles {
    private collection: Object[] = [];
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
            return this.collection[index];
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
        while (this.collection.length > 0) {
            this.collection.pop();
        }
    }
    public findByName(name: string, type?: StyleType): Object {
        let returnStyle: Object;
        for (const value of this.collection) {
            if ((value as WStyle).name === name) {
                returnStyle = value;
                if (!isNullOrUndefined(type) && (value as WStyle).type === type) {
                    returnStyle = value;
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
            returnStyleObject.characterFormat = {};
            HelperMethods.writeCharacterFormat(returnStyleObject.characterFormat, true, (style as any).characterFormat);
            returnStyle.name = style.name;
            returnStyle.style = JSON.stringify(returnStyleObject);
            styleObjects.push(returnStyle);
        }
        return styleObjects;
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
}
