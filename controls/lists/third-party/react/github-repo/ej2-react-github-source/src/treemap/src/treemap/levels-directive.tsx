import { ComplexBase } from '@syncfusion/ej2-react-base';
import { LevelSettingsModel } from '@syncfusion/ej2-treemap';

export interface LevelSettingsDirTypecast {
    headerTemplate?: string | Function | any;
}
/**
 * Represents the directive to configure and render level leaf items in the treemap. 
 * ```
 * <TreeMapComponent>
 * <LevelsDirective>
 * <LevelDirective></LevelDirective>
 * </LevelsDirective>
 * </TreeMapComponent>
 * ```
 */
export class LevelDirective extends ComplexBase<LevelSettingsModel| LevelSettingsDirTypecast & { children?: React.ReactNode }, LevelSettingsModel| LevelSettingsDirTypecast> {
    public static moduleName: string = 'level';
}

export class LevelsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'levels';
    public static moduleName: string = 'levels';
}
