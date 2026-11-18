/**
 * File menu model builders for the editor ribbon.
 *
 * The File entry is the EJ2 Ribbon `fileMenu` (a drop-down in the tab row), not
 * a tab: Open, Export and Print.
 *
 * @module @syncfusion/ej2-pptxeditor/ribbon/file-tab
 */

import { FileMenuSettingsModel } from '@syncfusion/ej2-ribbon';
import { MenuItemModel } from '@syncfusion/ej2-navigations';
import { RibbonItemId, RibbonHost } from './types';
import { localize } from '../localization/localization';

/**
 * Actions the File menu delegates back to the ribbon owner.
 */
export interface FileMenuActions {
    /** Opens the device file picker. */
    openDevice(): void;
}

/**
 * Builds the File menu item list.
 *
 * @param {RibbonHost} host - Editor ribbon host
 * @returns {MenuItemModel[]} Menu items (Open, Export, Print)
 */
export function buildFileMenuItems(host: RibbonHost): MenuItemModel[] {
    const printDisabled: boolean = host.enablePrint === false || host.hasPrintModule === false;
    return [
        { id: RibbonItemId.OpenDevice, text: localize(host.locale, 'Open'), iconCss: 'e-icons e-folder-open' },
        {
            id: RibbonItemId.Download,
            text: localize(host.locale, 'Export'),
            iconCss: 'e-icons e-export',
            disabled: host.enableDownload === false
        } as MenuItemModel,
        {
            id: RibbonItemId.PrintAll,
            text: localize(host.locale, 'Print'),
            iconCss: 'e-icons e-print',
            disabled: printDisabled
        } as MenuItemModel
    ];
}

/**
 * Builds the EJ2 Ribbon `fileMenu` settings and routes selections to the host.
 *
 * @param {RibbonHost} host - Editor ribbon host
 * @param {FileMenuActions} actions - Actions owned by the ribbon
 * @returns {FileMenuSettingsModel} File menu settings
 */
export function buildFileMenu(
    host: RibbonHost,
    actions: FileMenuActions
): FileMenuSettingsModel {
    return {
        visible: true,
        text: localize(host.locale, 'File'),
        menuItems: buildFileMenuItems(host),
        select: (args: { item?: { id?: string } }): void => {
            const id: string | undefined = args && args.item ? args.item.id : undefined;
            switch (id) {
            case RibbonItemId.OpenDevice:
                actions.openDevice();
                break;
            case RibbonItemId.Download:
                if (host.enableDownload !== false) {
                    host.download();
                }
                break;
            case RibbonItemId.PrintAll:
                if (host.enablePrint !== false && host.hasPrintModule !== false) {
                    host.print();
                }
                break;
            default:
                break;
            }
        }
    };
}
