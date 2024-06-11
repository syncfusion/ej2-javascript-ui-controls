import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary, FontSchemeStruct } from '../../index';

/**
 * @private
 */
export class MajorMinorFontScheme {
    private fntTypeface: Dictionary<string, string> = new Dictionary<string, string>();
    private fntSchemeList: FontSchemeStruct[] = [];

    public get fontTypeface(): Dictionary<string, string> {
        return this.fntTypeface;
    }
    public set fontTypeface(value: Dictionary<string, string>) {
        this.fntTypeface = value;
    }

    public get fontSchemeList(): FontSchemeStruct[] {
        return this.fntSchemeList;
    }
    public set fontSchemeList(value: FontSchemeStruct[]) {
        this.fntSchemeList = value;
    }
    public constructor() {
        this.fntTypeface = new Dictionary<string, string>();
        this.fntSchemeList = [];
    }
    public copyFormat(majorMinor: MajorMinorFontScheme): void {
        if (!isNullOrUndefined(majorMinor)) {
            this.fntTypeface = majorMinor.fntTypeface;
            this.fntSchemeList = majorMinor.fntSchemeList;
        }
    }
    public destroy(): void {
        this.fntTypeface = undefined;
        this.fntSchemeList = undefined;
    }
}
