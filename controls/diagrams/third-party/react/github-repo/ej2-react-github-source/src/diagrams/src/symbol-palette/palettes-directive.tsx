import { ComplexBase } from '@syncfusion/ej2-react-base';
import { PaletteModel } from '@syncfusion/ej2-diagrams';


/**
 * `Palette` directive represent a axis palette of the react SymbolPalette. 
 * It must be contained in a SymbolPalette component(`SymbolPaletteComponent`). 
 * ```ts
 * <SymbolPaletteComponent> 
 * <PalettesDirective>
 * <PaletteDirective></PaletteDirective>
 * </PalettesDirective>
 * </SymbolPaletteComponent>
 * ```
 */
export class PaletteDirective extends ComplexBase<PaletteModel & { children?: React.ReactNode }, PaletteModel> {
    public static moduleName: string = 'palette';
}

export class PalettesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'palettes';
    public static moduleName: string = 'palettes';
}
