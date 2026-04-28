import { Ribbon, ItemOrientation, RibbonItemSize, RibbonItemType, RibbonTabModel, RibbonColorPicker, DisplayMode, RibbonGroupButtonSelection, RibbonFileMenu, BackstageItemModel, RibbonBackstage, LauncherClickEventArgs, RibbonContextualTabSettingsModel, RibbonContextualTab, RibbonKeyTip } from "../src/index";
import { ListView, SelectEventArgs as SelectListEventArgs } from "@syncfusion/ej2-lists";
import { MenuEventArgs } from "@syncfusion/ej2-navigations";
import { SelectEventArgs } from "@syncfusion/ej2-dropdowns";
import { ColorPickerEventArgs } from '@syncfusion/ej2-inputs';

Ribbon.Inject(RibbonFileMenu, RibbonColorPicker, RibbonBackstage, RibbonContextualTab, RibbonKeyTip );

interface DocumentItem {
    fileName: string;
    location: string;
}

interface DataOption {
    icon: string;
    title: string;
    description: string;
}

interface DataOptions {
    [key: string]: DataOption[]; // Allow dynamic keys
    info: DataOption[];
    save: DataOption[];
    export: DataOption[];
    print: DataOption[];
    share: DataOption[];
    account: DataOption[];
    feedback: DataOption[];
}

interface DataStructure {
    recentDocuments: DocumentItem[];
    dataOptions: DataOptions;
}

const data: DataStructure = {
    recentDocuments: [
        { fileName: "Classic_layout.docx", location: "EJ2 >> Components >> Navigations >> Ribbon >> layouts" },
        { fileName: "Simplified_layout.docx", location: "EJ2 >> Components >> Navigations >> Ribbon >> layouts" },
        { fileName: "Ribbon_resize.docx", location: "EJ2 >> Components >> Navigations >> Ribbon >> resize" },
        { fileName: "Ribbon_backstage.docx", location: "EJ2 >> Components >> Navigations >> Ribbon >> backstage" },
        { fileName: "Ribbon_overflow.docx", location: "EJ2 >> Components >> Navigations >> Ribbon >> overflow" },
        { fileName: "Custom_items.docx", location: "EJ2 >> Components >> Navigations >> Ribbon >> items" }
    ],
    dataOptions: {
        info: [
            { icon: "e-open-link", title: "Open in Desktop App", description: "Use the full functionality of Ribbon" },
            { icon: "e-protect-sheet", title: "Protect Document", description: "To prevent accidental changes, this document has been set to open as view-only." },
            { icon: "e-send-to-back", title: "Version History", description: "View previous versions" }
        ],
        save: [
            { icon: "e-save", title: "Save as", description: "Save a copy online" },
            { icon: "e-rename", title: "Rename", description: "Rename this file" },
            { icon: "e-download", title: "Download a Copy", description: "Download a local copy" },
            { icon: "e-export-pdf", title: "Download as PDF", description: "Download a copy as PDF file" },
            { icon: "e-chevron-down-fill", title: "Download as ODT", description: "Download a copy as ODT file" }
        ],
        export: [
            { icon: "e-transform-right", title: "Transform to Web Page", description: "Transform your document into an interactive webpage" },
            { icon: "e-export", title: "Export to PowerPoint presentation", description: "Export your document into a multi-slide presentation" },
            { icon: "e-protect-workbook", title: "Send documents to Kindle", description: "Send documents to your Kindle device to read and annotate the documents" }
        ],
        print: [
            { icon: "e-print-layout", title: "Print", description: "Print this document" }
        ],
        share: [
            { icon: "e-arrow-right-up", title: "Share with People", description: "Invite other people to view or edit this document" },
            { icon: "e-protect-workbook", title: "Embed", description: "Embed this document in your blog or website" }
        ],
        account: [
            { icon: "e-people", title: "Account type", description: "Administrator" },
            { icon: "e-password", title: "Password protected", description: "Yes" },
            { icon: "e-text-that-contains", title: "E-mail", description: "abc@gmail.com" }
        ],
        feedback: [
            { icon: "e-check", title: "I Like Something", description: "It's nice to know when we have made a positive change." },
            { icon: "e-close", title: "I Don't Like Something", description: "If something's not right we'd like to know so we can fix it." },
            { icon: "e-comment-add", title: "I Have a Suggestion", description: "Do you have an idea for a new feature or an improvement ?" }
        ]
    }
};

let ribbon: Ribbon;
let fontSize: string[] = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72', '96'];
let fontStyle: string[] = ['Algerian', 'Arial', 'Calibri', 'Cambria', 'Cambria Math', 'Courier New', 'Candara', 'Georgia', 'Impact', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Symbol', 'Times New Roman', 'Verdana', 'Windings'
];
document.getElementById('render').addEventListener('click', renderRibbon);
document.getElementById('destroy').addEventListener('click', destoryRibbon);
let tableContextualTab: RibbonContextualTabSettingsModel = ({
    visible: true,
    tabs: [{
        id: 'TableDesign',
        header: 'Table Design',
        groups: [{
            header: 'Table Style',
            groupIconCss: 'e-icons e-field-settings',
            collections: [{
                items: [{
                    type: RibbonItemType.DropDown,
                    allowedSizes: RibbonItemSize.Large,
                    dropDownSettings: {
                        content: 'Table Style',
                        iconCss: 'e-icons e-field-settings',
                        items: [{ text: 'Header Row' },
                        { text: 'Banded Rows' },
                        { text: 'Banded Columns' }
                    ]
                    }
                }]
            }]
        },{
            header: 'Borders style',
            groupIconCss: 'e-icons e-field-settings',
            collections: [{
                items: [{
                    type: RibbonItemType.DropDown,
                    allowedSizes: RibbonItemSize.Large,
                    dropDownSettings: {
                        content: 'Borders',
                        iconCss: 'e-icons e-border-all',
                        items: [
                        { text: 'Border Right', iconCss: 'e-icons e-border-right' },
                        { text: 'Border Left', iconCss: 'e-icons e-border-left' },
                        { text: 'Border Bottom', iconCss: 'e-icons e-border-bottom' },
                        { text: 'Border Top', iconCss: 'e-icons e-border-top' }
                    ]
                    }
                }]
            }]
        }]
    },
    {
        header: 'Table Layout',
        id: 'TableLayout',
        groups: [{
            header: 'Data',
            groupIconCss: 'e-icons e-custom-sort',
            collections: [{
                items: [{
                    type: RibbonItemType.Button,
                    allowedSizes: RibbonItemSize.Large,
                    buttonSettings: {
                        iconCss: 'e-icons e-sort-ascending',
                        content: 'Sort Table Ascending'
                    }
                }]
            }, {
                items: [{
                    type: RibbonItemType.Button,
                    allowedSizes: RibbonItemSize.Large,
                    buttonSettings: {
                        iconCss: 'e-icons e-sort-descending',
                        content: 'Sort Table Descending'
                    }
                }]
            }]
        }, {
            header: 'Merge',
            groupIconCss: 'e-icons e-merge-cells',
            collections: [{
                items: [{
                    type: RibbonItemType.DropDown,
                    allowedSizes: RibbonItemSize.Large,
                    dropDownSettings: {
                        content: 'Merge',
                        iconCss: 'e-icons e-merge-cells',
                        items: [{ text: 'Merge Cells', iconCss: 'e-icons e-merge-cells' },
                        { text: 'Split Cells', iconCss: 'e-icons e-split-horizontal' }
                    ]
                    }
                }]
            }]
        }]
    }]
});
let tabs: RibbonTabModel[] = [{
    header: "Home",
    keyTip: 'H',    
    groups: [{
        id: 'clipboard',
        header: "Clipboard",
        showLauncherIcon: true,
        groupIconCss: 'e-icons e-paste',
        collections: [{
            items: [{
                type: RibbonItemType.SplitButton,
                allowedSizes: RibbonItemSize.Large,
                keyTip: 'V',
                disabled: true,
                id: 'pastebtn',
                splitButtonSettings: {
                    iconCss: 'e-icons e-paste',
                    items: [{ text: 'Keep Source Format' }, { text: 'Merge Format' }, { text: 'Keep Text Only' }],
                    content: 'Paste'
                }
            }]
        }, {
            items: [{
                type: RibbonItemType.Button,
                keyTip: 'X',
                buttonSettings: {
                    content: 'Cut',
                    iconCss: 'e-icons e-cut'
                }
            }, {
                type: RibbonItemType.Button,
                keyTip: 'C',
                buttonSettings: {
                    content: 'Copy',
                    iconCss: 'e-icons e-copy'
                }
            }, {
                type: RibbonItemType.Button,
                keyTip: 'FP',
                buttonSettings: {
                    content: 'Format Painter',
                    iconCss: 'e-icons e-format-painter'
                }
            }]
        }]
    }, {
        header: "Font",
        isCollapsible: false,
        enableGroupOverflow: true,
        orientation: ItemOrientation.Row,
        overflowHeader: 'More Font Options',
        groupIconCss: 'e-icons e-bold',
        cssClass: 'font-group',
        collections: [{
            items: [{
                type: RibbonItemType.ComboBox,
                keyTip: 'FF',
                comboBoxSettings: {
                    dataSource: fontStyle,
                    label: 'Font Style',
                    index: 3,
                    allowFiltering: true,
                    width: '115px',
                    popupWidth: '150px'
                }
            }, {
                type: RibbonItemType.ComboBox,
                keyTip: 'FS',
                comboBoxSettings: {
                    dataSource: fontSize,
                    label: 'Font Size',
                    index: 3,
                    width: '65px',
                    popupWidth: '85px',
                    allowFiltering: true
                }
            }]
        }, {
            items: [{
                type: RibbonItemType.ColorPicker,
                keyTip: 'CP',
                allowedSizes: RibbonItemSize.Small,
                displayOptions: DisplayMode.Simplified | DisplayMode.Classic,
                colorPickerSettings: {
                    value: '#123456'
                }
            }, {
                type: RibbonItemType.Button,
                keyTip: '1',
                allowedSizes: RibbonItemSize.Small,
                buttonSettings: {
                    content: 'Bold',
                    iconCss: 'e-icons e-bold',
                    isToggle: true
                }
            }, {
                type: RibbonItemType.Button,
                keyTip: '2',
                allowedSizes: RibbonItemSize.Small,
                buttonSettings: {
                    content: 'Italic',
                    iconCss: 'e-icons e-italic',
                    isToggle: true
                }
            }, {
                type: RibbonItemType.Button,
                keyTip: '3',
                allowedSizes: RibbonItemSize.Small,
                buttonSettings: {
                    content: 'Underline',
                    iconCss: 'e-icons e-underline',
                    isToggle: true
                }
            }, {
                allowedSizes: RibbonItemSize.Small,
                keyTip: '4',
                type: RibbonItemType.Button,
                buttonSettings: {
                    content: 'Strikethrough',
                    iconCss: 'e-icons e-strikethrough',
                    isToggle: true
                }
            }, {
                type: RibbonItemType.Button,
                keyTip: '5',
                allowedSizes: RibbonItemSize.Small,
                buttonSettings: {
                    content: 'Change Case',
                    iconCss: 'e-icons e-change-case',
                    isToggle: true
                }
            }]
        }]
    }, {
        id: 'paragraph',
        header: "Paragraph",
        orientation: ItemOrientation.Row,
        groupIconCss: 'e-icons e-align-center',
        collections: [{
            items: [{
                type: RibbonItemType.Button,
                keyTip: 'AO',
                allowedSizes: RibbonItemSize.Small,
                buttonSettings: {
                    iconCss: 'e-icons e-decrease-indent',
                    content: 'Decrease Indent'
                }
            }, {
                type: RibbonItemType.Button,
                keyTip: 'AI',
                allowedSizes: RibbonItemSize.Small,
                buttonSettings: {
                    iconCss: 'e-icons e-increase-indent',
                    content: 'Increase Indent'
                }
            }, {
                type: RibbonItemType.Button,
                keyTip: 'FM',
                allowedSizes: RibbonItemSize.Small,
                buttonSettings: {
                    iconCss: 'e-icons e-paragraph',
                    content: 'Paragraph'
                }
            }]
        }, {
            items: [{
                type: RibbonItemType.GroupButton,
                allowedSizes: RibbonItemSize.Small,
                groupButtonSettings: {
                    selection: RibbonGroupButtonSelection.Single,
                    header: 'Alignment',
                    items: [{
                        iconCss: 'e-icons e-align-left',
                        selected: true,
                        keyTip: 'AL',
                    },
                    {
                        iconCss: 'e-icons e-align-center',
                        keyTip: 'AC',
                    },
                    {
                        iconCss: 'e-icons e-align-right',
                        keyTip: 'AR',
                    },
                    {
                        iconCss: 'e-icons e-justify',
                        keyTip: 'AJ',
                    }]
                }
            }]
        }]
    }, {
        header: "Editing",
        groupIconCss: 'e-icons e-edit',
        orientation: ItemOrientation.Column,
        collections: [{
            items: [{
                type: RibbonItemType.SplitButton,
                splitButtonSettings: {
                    iconCss: 'e-icons e-search',
                    content: 'Find',
                    items: [
                        { text: 'Find', iconCss: 'e-icons e-search' },
                        { text: 'Advanced Find', iconCss: 'e-icons e-search' },
                        { text: 'Go to', iconCss: 'e-icons e-arrow-right' }
                    ]
                }
            }, {
                type: RibbonItemType.Button,
                buttonSettings: {
                    content: 'Replace',
                    iconCss: 'e-icons e-replace'
                }
            }, {
                type: RibbonItemType.SplitButton,
                splitButtonSettings: {
                    iconCss: 'e-icons e-mouse-pointer',
                    content: 'Select',
                    items: [{ text: 'Select All' },
                    { text: 'Select Objects' }]
                }
            }]
        }]
    }, {
        header: "Voice",
        isCollapsible: false,
        groupIconCss: 'sf-icon-dictate',
        collections: [{
            items: [{
                type: RibbonItemType.SplitButton,
                allowedSizes: RibbonItemSize.Large,
                splitButtonSettings: {
                    content: 'Dictate',
                    iconCss: 'sf-icon-dictate',
                    items: [{ text: 'Chinese' }, { text: 'English' }, { text: 'German' }, { text: 'French' }]
                }
            }]
        }]
    }, {
        header: "Editor",
        isCollapsible: false,
        groupIconCss: 'sf-icon-editor',
        collections: [{
            items: [{
                type: RibbonItemType.Button,
                allowedSizes: RibbonItemSize.Large,
                buttonSettings: {
                    content: 'Editor',
                    iconCss: 'sf-icon-editor'
                }
            }]
        }]
    }, {
        header: "Reuse Files",
        isCollapsible: false,
        groupIconCss: 'sf-icon-reuse',
        collections: [{
            items: [{
                type: RibbonItemType.Button,
                allowedSizes: RibbonItemSize.Large,
                disabled: true,
                buttonSettings: {
                    iconCss: 'sf-icon-reuse',
                    content: 'Reuse Files'
                }
            }]
        }]
    }]
}, {
    header: 'Insert',
    groups: [{
        header: 'Tables',
        isCollapsible: false,
        collections: [{
            items: [{
                type: RibbonItemType.DropDown,
                allowedSizes: RibbonItemSize.Large,
                dropDownSettings: {
                    iconCss: 'e-icons e-table',
                    content: 'Table',
                    items: [
                        { text: 'Insert Table' }, { text: 'Draw Table' },
                        { text: 'Convert Table' }, { text: 'Excel Spreadsheet' }
                    ]
                }
            }]
        }]
    }, {
        id: 'illustration',
        header: 'Illustrations',
        showLauncherIcon: true,
        orientation: ItemOrientation.Row,
        enableGroupOverflow: true,
        overflowHeader: 'Illustrations',
        groupIconCss: 'e-icons e-image',
        collections: [{
            items: [{
                type: RibbonItemType.DropDown,
                dropDownSettings: {
                    content: 'Shapes',
                    iconCss: 'sf-icon-shapes',
                    items: [{ text: 'Lines' }, { text: 'Rectangles' }, { text: 'Basic Arrows' }, { text: 'Basic Shapes' }, { text: 'FlowChart' }],
                }
            }, {
                type: RibbonItemType.Button,
                buttonSettings: {
                    content: '3D Models',
                    iconCss: 'sf-icon-3d-model'
                }
            }, {
                type: RibbonItemType.Button,
                buttonSettings: {
                    iconCss: 'sf-icon-smart-art',
                    content: 'SmartArt'
                }
            }, {
                type: RibbonItemType.Button,
                buttonSettings: {
                    content: 'Chart',
                    iconCss: 'sf-icon-chart'
                }
            }, {
                type: RibbonItemType.Button,
                buttonSettings: {
                    content: 'Screenshot',
                    iconCss: 'sf-icon-screenshot'
                }
            }]
        }]
    }, {
        id: 'header_footer',
        header: 'Header & Footer',
        showLauncherIcon: true,
        orientation: ItemOrientation.Column,
        groupIconCss: 'e-icons e-table',
        collections: [{
            items: [{
                type: RibbonItemType.DropDown,
                dropDownSettings: {
                    content: 'Header',
                    iconCss: 'e-icons e-header',
                    items: [{ text: 'Insert Header' }, { text: 'Edit Header' }, { text: 'Remove Header' }]
                }
            }, {
                type: RibbonItemType.DropDown,
                dropDownSettings: {
                    iconCss: 'e-icons e-footer',
                    content: 'Footer',
                    items: [{ text: 'Insert Footer' }, { text: 'Edit Footer' }, { text: 'Remove Footer' }]
                }
            }, {
                type: RibbonItemType.DropDown,
                dropDownSettings: {
                    content: 'Page Number',
                    iconCss: 'e-icons e-page-numbering',
                    items: [{ text: 'Insert Top of page' }, { text: 'Insert Bottom of page' }, { text: 'Format Page Number' }, { text: 'Remove Page Number' }],
                }
            }]
        }]
    },
    {
        header: 'Comments',
        isCollapsible: false,
        collections: [{
            items: [{
                type: RibbonItemType.Button,
                allowedSizes: RibbonItemSize.Large,
                buttonSettings: {
                    content: 'New Comment',
                    iconCss: 'e-icons e-comment-add'
                }
            }]
        }]
    }, {
        header: 'Links',
        groupIconCss: 'e-icons e-link',
        isCollapsible: false,
        collections: [{
            items: [{
                type: RibbonItemType.DropDown,
                allowedSizes: RibbonItemSize.Large,
                dropDownSettings: {
                    content: 'Link',
                    iconCss: 'e-icons e-link',
                    items: [{ text: 'Insert Link', iconCss: 'e-icons e-link' },
                    { text: 'Recent Links', iconCss: 'e-icons e-clock' },
                    { text: 'Bookmarks', iconCss: 'e-icons e-bookmark' }
                    ]
                }
            }]
        }]
    }]
}];
let menuItems: BackstageItemModel[] = [
    { id: 'home', text: 'Home', iconCss: 'e-icons e-home', content: getBackstageContent('home') },
    { id: 'new', text: 'New', iconCss: 'e-icons e-file-new', content: getBackstageContent('new') },
    { id: 'open', text: 'Open', iconCss: 'e-icons e-folder-open', content: getBackstageContent('open') },
    { separator: true },
    { text: 'Info', content: getBackstageContent('info') },
    { text: 'Save as', content: getBackstageContent('save') },
    { text: 'Export', content: getBackstageContent('export') },
    { text: 'Print', backStageItemClick: backstageClickHandler },
    { text: 'Share', content: getBackstageContent('share') },
    { separator: true, isFooter: true },
    { text: 'Account', isFooter: true, content: getBackstageContent('account') },
    { text: 'Feedback', isFooter: true, content: getBackstageContent('feedback') }
];

let isBackstageOpened = false;

function handleClickInsideBackstageContent(e: any) {
    e.stopPropagation();
    let cName: string = e.target.className;
    if (cName !== "section-title" && cName !== "home-wrapper" && cName !== "new-wrapper" && cName !== "block-wrapper" && cName !== "e-ribbon-backstage-content") {
        ribbon.ribbonBackstageModule.hideBackstage();
        ribbon.element.querySelector('.e-ribbon-backstage-content').removeEventListener('click', handleClickInsideBackstageContent);
    }
}
if (!isBackstageOpened) {
    ribbon.element.querySelector('.e-ribbon-backstage').addEventListener('click', () => {
        isBackstageOpened = true;
        ribbon.element.querySelector('.e-ribbon-backstage-content').addEventListener('click', handleClickInsideBackstageContent);
    });
}

function backstageClickHandler() {
    ribbon.ribbonBackstageModule.hideBackstage(); 
}

let isPasteDisabled: boolean = true;
function enablePaste() {
    if (!isPasteDisabled) { return; }
    ribbon.enableItem('pastebtn')
    isPasteDisabled = false;
}
function getBackstageContent(item: string): string {
    let homeContentTemplate = `
    <div class="home-wrapper">
        {{newSection}}
        {{recentSection}}
    </div>`;
    let newSection = `
    <div class='new-wrapper'>
        <div class="section-title"> New </div>
        <div class="category_container">
            <div class="doc_category_image"></div> <span class="doc_category_text"> New document </span>
        </div>
    </div>`;
    let recentSection = `
    <div class="block-wrapper">
        <div class="section-title"> Recent </div>
        {{recentWrapper}}
    </div>`;
    let recentWrapper = `
    <div class="section-content">
        <table>
            <tbody>
                <tr>
                    <td> <span class="doc_icon e-icons {{icon}}"></span> </td>
                    <td> 
                        <span style="display: block; font-size: 14px"> {{title}} </span>
                        <span style="font-size: 12px"> {{description}} </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>`;
    let blockSection = "<div class='block-wrapper'> <div class='section-title'> {{blockTitle}} </div> {{blockSection}} </div>";
    let content = "";
    switch (item) {
        case 'home': {
            let recentDocUpdatedString = "";
            data['recentDocuments'].slice(0,3).forEach((doc: any) => recentDocUpdatedString += recentWrapper.replace(/{{icon}}/g, 'e-notes').replace(/{{title}}/g, doc.fileName).replace(/{{description}}/g, doc.location));
            let updatedRecentSection = recentSection.replace(/{{recentWrapper}}/g, recentDocUpdatedString);
            content = homeContentTemplate.replace(/{{newSection}}/g, newSection).replace(/{{recentSection}}/g, updatedRecentSection);
            break;
        }
        case 'new': {
            content = newSection;
            break;
        }
        case 'open': {
            let recentDocUpdatedString = "";
            data['recentDocuments'].forEach((doc: any) => recentDocUpdatedString += recentWrapper.replace(/{{icon}}/g, 'e-notes').replace(/{{title}}/g, doc.fileName).replace(/{{description}}/g, doc.location));
            content = recentSection.replace(/{{recentWrapper}}/g, recentDocUpdatedString);
            break;
        }
        default:
            let infoUpdatedString = "";
            (data['dataOptions'] as Record<string, DataOption[]>)[item].forEach((doc: any) => 
                infoUpdatedString += recentWrapper
                    .replace(/{{icon}}/g, doc.icon)
                    .replace(/{{title}}/g, doc.title)
                    .replace(/{{description}}/g, doc.description)
            );
            content = blockSection.replace(/{{blockSection}}/g, infoUpdatedString).replace(/{{blockTitle}}/g, (item.charAt(0).toUpperCase() + item.slice(1)));
            break;
    }
    return content;
}
function renderRibbon(): void {
    ribbon = new Ribbon({
        tabs: tabs,
        contextualTabs: [tableContextualTab],
        enableKeyTips: true,
        backStageMenu: {
            text: 'File',
            visible: true,
            items: menuItems,
            backButton: {
                text: 'Close',
            }
        },
        created: () => {
            ribbon.ribbonKeyTipModule.showKeyTips();
        }
    });
    ribbon.appendTo("#ribbon");
}
function destoryRibbon(): void {
    if (ribbon && !ribbon.isDestroyed) {
       ribbon.destroy();
    }
}
