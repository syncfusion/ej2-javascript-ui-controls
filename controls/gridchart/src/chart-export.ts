import { createElement } from '@syncfusion/ej2-base';
import { ExportType } from '@syncfusion/ej2-charts';
import { Button } from '@syncfusion/ej2-buttons';
import { BeforeOpenCloseMenuEventArgs, ContextMenu, MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { GridChart } from './grid-chart';

export class ChartExport {

    private defaultExportMenuItems: MenuItemModel[];
    private gridChart: GridChart;
    private exportButtonElement: HTMLElement;
    private exportButton: Button;
    private exportMenuElement: HTMLElement;
    private exportMenu: ContextMenu;
    private boundOpenExportMenu: (event: Event) => void;
    private menuId: string = 'e_grid_chart_export_cmenu_';

    constructor(gridChart: GridChart) {
        this.gridChart = gridChart;
        this.initProperties();
        return this;
    }

    private initProperties(): void {
        this.defaultExportMenuItems = [
            { text: this.gridChart.getLocaleText('Print'), id: this.generateID('Print'), iconCss: 'e-grid-chart-print e-icons' },
            { text: this.gridChart.getLocaleText('JPEG'), id: this.generateID('JPEG'), iconCss: 'e-grid-chart-jpeg e-icons' },
            { text: this.gridChart.getLocaleText('PNG'), id: this.generateID('PNG'), iconCss: 'e-grid-chart-png e-icons' },
            { text: this.gridChart.getLocaleText('SVG'), id: this.generateID('SVG'), iconCss: 'e-grid-chart-svg e-icons' },
            { text: this.gridChart.getLocaleText('PDF'), id: this.generateID('PDF'), iconCss: 'e-grid-chart-pdf e-icons' },
            { text: this.gridChart.getLocaleText('XLSX'), id: this.generateID('XLSX'), iconCss: 'e-grid-chart-xlsx e-icons' },
            { text: this.gridChart.getLocaleText('CSV'), id: this.generateID('CSV'), iconCss: 'e-grid-chart-csv e-icons' }
        ];
    }

    /**
     * @hidden
     * @returns {void}
     */
    public addExportButton(): void {
        this.exportButtonElement = createElement('button', { id: 'e-grid-chart-export-btn' });
        this.gridChart.exportContainer.append(this.exportButtonElement);
        this.exportButton = new Button({
            iconCss: 'e-grid-chart-export-icon e-icons',
            content: this.gridChart.getLocaleText('Export'),
            cssClass: this.gridChart.chartSettings.cssClass,
            locale: this.gridChart.chartSettings.locale,
            enableRtl: this.gridChart.enableRtl
        });
        this.exportButton.appendTo(this.exportButtonElement);
        this.exportButton.element.setAttribute('title', this.gridChart.getLocaleText('ExportTitle'));
        this.exportMenuElement = createElement('ul');
        this.gridChart.exportContainer.append(this.exportMenuElement);
        let exportMenuItems: MenuItemModel[] = [];
        if (this.gridChart.chartSettings.chartExportItems.length) {
            for (const item of this.gridChart.chartSettings.chartExportItems) {
                const tempItem: MenuItemModel = this.defaultExportMenuItems.find((data: MenuItemModel) => data.text === item);
                if (tempItem) {
                    exportMenuItems.push(tempItem);
                }
            }
        } else {
            exportMenuItems = this.defaultExportMenuItems;
        }
        this.exportMenu = new ContextMenu({
            items: exportMenuItems,
            select: (args: MenuEventArgs) => {
                if (this.getKeyFromId(args.item.id) === 'Print') {
                    this.gridChart.currentChart.print();
                } else {
                    this.gridChart.currentChart.exportModule.export(this.getKeyFromId(args.item.id) as ExportType, 'Chart');
                }
            },
            cssClass: this.gridChart.chartSettings.cssClass,
            locale: this.gridChart.chartSettings.locale,
            enableRtl: this.gridChart.enableRtl,
            target: '#e-grid-chart-export-btn',
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
                if (args && args.event && (<{ button?: number }>args.event).button === 2) {
                    args.cancel = true;
                }
            }
        });
        this.exportMenu.appendTo(this.exportMenuElement);
        this.boundOpenExportMenu = this.openExportMenu.bind(this);
        this.exportButton.element.addEventListener('click', this.boundOpenExportMenu);
    }

    private openExportMenu(args: MouseEvent): void {
        this.exportMenu.open(args.pageY, args.pageX, args.target as HTMLElement);
    }

    private generateID(item: string): string {
        return this.menuId + item;
    }

    private getKeyFromId(id: string): string {
        return id.replace(this.menuId, '');
    }

    /**
     * @hidden
     * @returns {void}
     */
    public destroy(): void {
        this.exportMenu.destroy();
        this.exportMenu = null;
        this.exportMenuElement.remove();
        this.exportMenuElement = null;
        this.exportButton.element.removeEventListener('click', this.boundOpenExportMenu);
        this.boundOpenExportMenu = null;
        this.exportButton.destroy();
        this.exportButton = null;
        this.exportButtonElement.remove();
        this.exportButtonElement = null;
    }
}
