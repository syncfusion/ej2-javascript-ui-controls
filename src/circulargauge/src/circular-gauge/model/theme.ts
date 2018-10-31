import { IFontMapping } from './interface';
/**
 * Specifies gauge Themes
 */
export namespace Theme {
    /** @private */
    export let axisLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export let axisLineColor: string = null;
    /** @private */
    export let tickLineColor: string = null;
    /** @private */
    export let pointerColor: string = null;
}
/** @private */
export function getRangePalette(theme: string): string[] {
    let palette: string[] = ['#50c917', '#27d5ff', '#fcde0b', '#ffb133', '#ff5985'];
    // switch (theme) {
    //     case 'Material':
    //         palette = ['#50c917', '#27d5ff', '#fcde0b', '#ffb133', '#ff5985'];
    //         break;
    //      case 'Fabric':
    //         palette = ['#50c917', '#27d5ff', '#fcde0b', '#ffb133', '#ff5985'];
    //         break;
    // }
    return palette;
}