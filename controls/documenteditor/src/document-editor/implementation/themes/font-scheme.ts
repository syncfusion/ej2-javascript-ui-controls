import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { MajorMinorFontScheme } from './major-minor-font-scheme';

/**
 * @private
 */
export class FontScheme {
    private schemeName: string;
    private majFontScheme: MajorMinorFontScheme;
    private minFontScheme: MajorMinorFontScheme;
    public get fontSchemeName(): string {
        return this.schemeName;
    }
    public set fontSchemeName(value: string) {
        this.schemeName = value;
    }
    public get majorFontScheme(): MajorMinorFontScheme {
        return this.majFontScheme;
    }
    public set majorFontScheme(value: MajorMinorFontScheme) {
        this.majFontScheme = value;
    }

    public get minorFontScheme(): MajorMinorFontScheme {
        return this.minFontScheme;
    }
    public set minorFontScheme(value: MajorMinorFontScheme) {
        this.minFontScheme = value;
    }
    public constructor(node?: Object) {
        this.majFontScheme = new MajorMinorFontScheme();
        this.minFontScheme = new MajorMinorFontScheme();
    }

    public copyFormat(fontScheme: FontScheme): void {
        if (!isNullOrUndefined(fontScheme)) {
            this.schemeName = fontScheme.schemeName;
            this.majFontScheme.copyFormat(fontScheme.majFontScheme);
            this.minFontScheme.copyFormat(fontScheme.minFontScheme);
        }
    }
    public destroy(): void {
        this.schemeName = undefined;
        this.majFontScheme = undefined;
        this.minFontScheme = undefined;
    }

}


/**
 * @private
 */
export class FontSchemeStruct {
    private fontName: string;
    private fontTypeface: string;
    private pnose: string;

    public get name(): string {
        return this.fontName;
    }
    public set name(value: string) {
        this.fontName = value;
    }

    public get typeface(): string {
        return this.fontTypeface;
    }
    public set typeface(value: string) {
        this.fontTypeface = value;
    }

    public get panose(): string {
        return this.pnose;
    }
    public set panose(value: string) {
        this.pnose = value;
    }
    public copyFormat(fontSchemeStructure: FontSchemeStruct): void {
        if (!isNullOrUndefined(fontSchemeStructure)) {
            this.fontName = fontSchemeStructure.fontName;
            this.fontTypeface = fontSchemeStructure.fontTypeface;
            this.pnose = fontSchemeStructure.panose;
        }
    }
    public destroy(): void {
        this.fontName = undefined;
        this.fontTypeface = undefined;
        this.pnose = undefined;
    }

}
