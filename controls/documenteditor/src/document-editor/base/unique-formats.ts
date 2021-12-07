/* eslint-disable */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WUniqueFormat } from './unique-format';
import { Dictionary } from './dictionary';
/**
 * @private
 */
export class WUniqueFormats {
    /**
     * @private
     */
    public items: WUniqueFormat[];

    public constructor() {
        this.items = [];
    }

    /**
     * @private
     */
    public addUniqueFormat(format: Dictionary<number, object>, type: number): WUniqueFormat {
        let matchedFormat: WUniqueFormat = undefined;
        for (let i: number = 0; i < this.items.length; i++) {
            if (this.items[i].isEqual(format, undefined, undefined)) {
                matchedFormat = this.items[i];
                break;
            }
        }
        if (isNullOrUndefined(matchedFormat)) {
            matchedFormat = new WUniqueFormat(type);
            matchedFormat.propertiesHash = format;
            matchedFormat.referenceCount = 1;
            this.items.push(matchedFormat);
        } else {
            matchedFormat.referenceCount++;
        }
        return matchedFormat;
    }
    /**
     * @private
     */
    public updateUniqueFormat(uniqueFormat: WUniqueFormat, property: string, value: object): WUniqueFormat {
        let matchedFormat: WUniqueFormat = undefined;
        for (let i: number = 0; i < this.items.length; i++) {
            if (this.items[i].isEqual(uniqueFormat.propertiesHash, property, value)) {
                matchedFormat = this.items[i];
                break;
            }
        }
        if (isNullOrUndefined(matchedFormat)) {
            matchedFormat = new WUniqueFormat(uniqueFormat.uniqueFormatType);
            matchedFormat.cloneItems(uniqueFormat, property, value, uniqueFormat.uniqueFormatType);
            matchedFormat.referenceCount = 1;
            this.items.push(matchedFormat);
        } else {
            matchedFormat.referenceCount++;
        }
        this.remove(uniqueFormat);
        uniqueFormat = undefined;
        return matchedFormat;
    }
    /**
     * @private
     */
    public remove(uniqueFormat: WUniqueFormat): void {
        uniqueFormat.referenceCount--;
        if (uniqueFormat.referenceCount <= 0) {
            this.items.splice(this.items.indexOf(uniqueFormat), 1);
            uniqueFormat.destroy();
            uniqueFormat = undefined;
        }
    }
    /**
     * @private
     */
    public clear(): void {
        if (isNullOrUndefined(this.items)) {
            for (let i: number = 0; i < this.items.length; i++) {
                this.items[i].destroy();
            }
        }
        this.items = [];
    }
    /**
     * @private
     */
    public destroy(): void {
        this.clear();
        this.items = undefined;
    }
}
