import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Filter } from '../actions/filter';
import { Sort } from '../actions/sort';
import { ColumnChooser } from '../actions/column-chooser';
import { ResponsiveDialogAction } from '../base/enum';
import { ResponsiveDialogRenderer } from '../renderer/responsive-dialog-renderer';
import { ColumnMenu } from '../..';

/**
 * ServiceLocator
 *
 * @hidden
 */
export class ServiceLocator {

    private services: { [x: string]: Object } = {};

    public register<T>(name: string, type: T): void {
        if (isNullOrUndefined(this.services[`${name}`])) {
            this.services[`${name}`] = type;
        }
    }

    public getService<T>(name: string): T {
        if (isNullOrUndefined(this.services[`${name}`])) {
            // eslint-disable-next-line no-throw-literal
            throw `The service ${name} is not registered`;
        }

        return <T>this.services[`${name}`];
    }

    public registerAdaptiveService(type: Filter | Sort | ColumnChooser | ColumnMenu, isAdaptiveUI: boolean,
                                   action: ResponsiveDialogAction): void {
        if (isAdaptiveUI) {
            type.responsiveDialogRenderer = new ResponsiveDialogRenderer(type.parent, type.serviceLocator);
            type.responsiveDialogRenderer.action = action;
        } else {
            if (type.responsiveDialogRenderer) {
                type.responsiveDialogRenderer.removeEventListener();
                type.responsiveDialogRenderer = undefined;
            }
        }
    }
}
