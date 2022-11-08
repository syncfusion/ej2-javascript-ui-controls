import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { FontScheme } from "./font-scheme";

/**
 * @private
 */
export class Themes {
    private fntScheme: FontScheme;

    public get fontScheme(): FontScheme {
        return this.fntScheme;
    }
    public set fontScheme(value: FontScheme) {
        this.fntScheme = value;
    }

    public constructor(node?: Object) {
        this.fntScheme = new FontScheme();
    }
    public copyFormat(themes: Themes): void {
        if (!isNullOrUndefined(themes)) {
            this.fntScheme.copyFormat(themes.fntScheme);
        }
    }
    public destroy(): void {
        this.fntScheme = undefined;
    }
}