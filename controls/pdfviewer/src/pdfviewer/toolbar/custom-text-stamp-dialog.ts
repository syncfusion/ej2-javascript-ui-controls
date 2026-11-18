import { Browser, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { CustomStampTextModel, PdfViewer, PdfViewerBase } from '../../index';
import { TextBox, ColorPicker, ColorPickerEventArgs, InputEventArgs } from '@syncfusion/ej2-inputs';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { ChangeEventArgs, CheckBox, ChangeEventArgs as CheckBoxChangeEventArgs } from '@syncfusion/ej2-buttons';

/**
 * CustomTextStampDialog - UI dialog for creating custom text stamps.
 * @hidden
 */
export class CustomTextStampDialog {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private textStampDialog: Dialog | null = null;
    private dialogContainer: HTMLElement | null = null;
    private previewContainer: HTMLElement | null = null;
    private stampTextBox: TextBox | null = null;
    private stampTextContainer: HTMLElement | null = null;
    private customTextStampContainer: HTMLElement | null = null;
    private customTextStampContentContainer: HTMLElement | null = null;
    private fontFamilyDropDown: DropDownList | null = null;
    private fontStyleButtonContainer: HTMLDivElement | null = null;
    private boldInput: HTMLInputElement | null = null;
    private italicInput: HTMLInputElement | null = null;
    private strikeoutInput: HTMLInputElement | null = null;
    private underlineInput: HTMLInputElement | null = null;
    private userNameCheckBox: CheckBox | null = null;
    private dateCheckBox: CheckBox | null = null;
    private timeCheckBox: CheckBox | null = null;
    private dateFormatDropDown: DropDownList | null = null;

    private readonly defaultStampOptions: CustomStampTextModel = {
        title: 'Draft',
        subtitle: '[$author] DD/MM/YYYY h:mm A',
        fontFamily: 'Calibri',
        bold: true,
        italic: false,
        underline: false,
        strikeout: false,
        textColor: '#000000',
        backgroundColor: '#A3F6FF'
    };
    private readonly defaultFontFamilies: string[] = [
        'Calibri',
        'Helvetica',
        'Times New Roman',
        'Courier New',
        'Symbol'
    ];
    private stampOptions: CustomStampTextModel = { ...this.defaultStampOptions };
    /**
     * @private
     */
    public isTextStampDialogOpen: boolean = false;
    /**
     * Constructor for CustomTextStampDialog
     * @param {PdfViewer} pdfViewer - The PDF Viewer instance.
     * @param {PdfViewerBase} pdfViewerBase - The PDF Viewer Base instance used for core viewer operations.
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * Public entry point to show the dialog.
     * Branches between desktop and mobile implementations based on device type.
     * @private
     * @returns {void}
     */
    public showDialog(): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.createDialogWindow();  // desktop branch
        } else {
            this.createMobileDialogWindow();   // mobile branch
        }
    }

    /**
     * Create desktop dialog window.
     * @returns {void}
     */
    private createDialogWindow(): void {
        const elementID: string = this.pdfViewer.element.id;
        const dialogDiv: HTMLElement = createElement('div', {
            id: elementID + '_customTextStampDialog',
            className: 'e-dialog e-lib e-pv-custom-text-stamp-dialog e-dlg-modal e-popup e-control e-popup-open'
        });
        if (this.pdfViewerBase && this.pdfViewerBase.pageContainer) {
            this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
            this.dialogContainer = dialogDiv;
            this.textStampDialog = new Dialog({
                showCloseIcon: true,
                closeOnEscape: true,
                isModal: true,
                header: this.pdfViewer.localeObj.getConstant('Create new text stamp'),
                height: 'auto',
                target: this.pdfViewer.element,
                content: this.createTextStampProperties(),
                beforeOpen: (): void => {
                    this.isTextStampDialogOpen = true;
                    this.updatePreview();
                },
                allowDragging: false,
                close: (): void => {
                    this.destroyDialog();
                    this.isTextStampDialogOpen = false;
                }
            });
            this.textStampDialog.buttons = [
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') },
                    click: this.onCancelClicked.bind(this)
                },
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Create'), isPrimary: true },
                    click: this.onCreateClicked.bind(this)
                }
            ];
            if (this.pdfViewer.enableRtl) {
                this.textStampDialog.enableRtl = true;
            }
            this.textStampDialog.appendTo(dialogDiv);
        }
    }

    /**
     * Creates the Custom Text Stamp dialog content.
     * @returns {HTMLDivElement} Dialog content container.
     */
    private createTextStampProperties(): HTMLDivElement {
        const contentContainer: HTMLDivElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-content'
        }) as HTMLDivElement;
        this.previewContainer = createElement('div', {
            className: 'e-pv-custom-text-stamp-preview-container'
        }) as HTMLDivElement;
        contentContainer.appendChild(this.previewContainer);
        // Stamp Text Label
        const stampTextLabel: HTMLSpanElement = createElement('span', { className: 'e-pv-custom-text-stamp-label' }) as HTMLSpanElement;
        stampTextLabel.textContent = this.pdfViewer.localeObj.getConstant('Stamp text');
        contentContainer.appendChild(stampTextLabel);
        // Stamp Text Input Container
        this.stampTextContainer = createElement('div', { className: 'e-pv-custom-text-stamp-textbox-container' }) as HTMLDivElement;
        const stampTextInput: HTMLInputElement = createElement('input', { attrs: { type: 'text' } }) as HTMLInputElement;
        this.stampTextContainer.appendChild(stampTextInput);
        this.stampTextBox = new TextBox({
            value: this.stampOptions.title || this.defaultStampOptions.title || 'Draft',
            floatLabelType: 'Never',
            cssClass: 'e-pv-custom-text-stamp-textbox',
            input: (args: any): void => {
                this.stampOptions.title = args.value;
                this.updatePreview();
            }
        });
        this.stampTextBox.appendTo(stampTextInput);
        contentContainer.appendChild(this.stampTextContainer);
        contentContainer.appendChild(this.createFontStyleSection());
        contentContainer.appendChild(this.createColorPickerSection());
        contentContainer.appendChild(this.createStampPropertiesSection());
        contentContainer.appendChild(this.createDateFormatSection());
        return contentContainer;
    }

    /**
     * Creates the Color Picker section with background and text color options.
     * @returns {HTMLDivElement} Color picker section element.
     */
    private createColorPickerSection(): HTMLDivElement {
        const section: HTMLDivElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-color-section'
        }) as HTMLDivElement;
        section.appendChild(
            this.createColorPickerItem(
                this.pdfViewer.localeObj.getConstant('Background color'),
                this.stampOptions.backgroundColor || this.defaultStampOptions.backgroundColor || '#00BCD4',
                this.onBackgroundColorChanged.bind(this)
            )
        );
        section.appendChild(
            this.createColorPickerItem(
                this.pdfViewer.localeObj.getConstant('Text color'),
                this.stampOptions.textColor || this.defaultStampOptions.textColor || '#000000',
                this.onTextColorChanged.bind(this)
            )
        );
        return section;
    }

    /**
     * Creates a color picker item.
     * @param {string} labelText - Specifies the display text for the color picker.
     * @param {string} colorValue - Specifies the initial color value.
     * @param {Function} changeHandler - Specifies the event handler triggered when the color changes.
     * @returns {HTMLDivElement} Color picker container.
     */
    private createColorPickerItem(labelText: string, colorValue: string, changeHandler: (args: ColorPickerEventArgs)
    => void): HTMLDivElement {
        const colorItem: HTMLDivElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-color-item'
        }) as HTMLDivElement;
        const label: HTMLSpanElement = createElement('span', {
            className: 'e-pv-custom-text-stamp-color-label'
        }) as HTMLSpanElement;
        label.textContent = labelText;
        colorItem.appendChild(label);
        const colorPickerContainer: HTMLDivElement = createElement('div', {
            className: 'e-colorpicker-container e-hide-opacity e-pv-custom-text-stamp-color-picker'
        }) as HTMLDivElement;
        const inputElement: HTMLInputElement =
            createElement('input') as HTMLInputElement;
        colorPickerContainer.appendChild(inputElement);
        const colorPicker: ColorPicker = new ColorPicker({
            mode: 'Picker',
            enableOpacity: false,
            value: colorValue,
            showButtons: false,
            modeSwitcher: false,
            change: changeHandler,
            enableRtl: this.pdfViewer.enableRtl
        });
        colorPicker.appendTo(inputElement);
        colorItem.appendChild(colorPickerContainer);
        return colorItem;
    }

    /**
     * Handles background color changes.
     * @param {ColorPickerEventArgs} args Contains information about the selected background color.
     * @returns {void}
     */
    private onBackgroundColorChanged(args: ColorPickerEventArgs): void {
        this.stampOptions.backgroundColor = args.currentValue.hex;
        this.updatePreview();
    }

    /**
     * Handles text color changes.
     * @param {ColorPickerEventArgs} args Contains information about the selected text color.
     * @returns {void}
     */
    private onTextColorChanged(args: ColorPickerEventArgs): void {
        this.stampOptions.textColor = args.currentValue.hex;
        this.updatePreview();
    }

    /**
     * Creates the stamp properties section.
     * @returns {HTMLDivElement} Stamp properties section.
     */
    private createStampPropertiesSection(): HTMLDivElement {
        const section: HTMLDivElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-properties-section'
        }) as HTMLDivElement;
        const title: HTMLDivElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-properties-title'
        }) as HTMLDivElement;
        title.textContent = this.pdfViewer.localeObj.getConstant('Stamp properties');
        section.appendChild(title);
        const checkBoxContainer: HTMLDivElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-checkbox-container'
        }) as HTMLDivElement;
        const userNameWrapper: HTMLElement = createElement('div', {
            className: 'e-checkbox-wrapper e-wrapper e-pv-custom-text-stamp-checkbox'
        });
        this.userNameCheckBox = new CheckBox({
            label: this.pdfViewer.localeObj.getConstant('Username'),
            checked: true,
            cssClass: 'e-pv-custom-text-stamp-checkbox',
            change: (args: CheckBoxChangeEventArgs): void => this.onStampPropertyChange(args)
        });
        checkBoxContainer.appendChild(userNameWrapper);
        this.userNameCheckBox.appendTo(userNameWrapper);
        const dateWrapper: HTMLElement = createElement('div', {
            className: 'e-checkbox-wrapper e-wrapper e-pv-custom-text-stamp-checkbox'
        });
        this.dateCheckBox = new CheckBox({
            label: this.pdfViewer.localeObj.getConstant('Date'),
            checked: true,
            cssClass: 'e-pv-custom-text-stamp-checkbox',
            change: (args: CheckBoxChangeEventArgs): void => this.onStampPropertyChange(args)
        });
        checkBoxContainer.appendChild(dateWrapper);
        this.dateCheckBox.appendTo(dateWrapper);
        const timeWrapper: HTMLElement = createElement('div', {
            className: 'e-checkbox-wrapper e-wrapper e-pv-custom-text-stamp-checkbox'
        });
        this.timeCheckBox = new CheckBox({
            label: this.pdfViewer.localeObj.getConstant('Time'),
            checked: true,
            cssClass: 'e-pv-custom-text-stamp-checkbox',
            change: (args: CheckBoxChangeEventArgs): void => this.onStampPropertyChange(args)
        });
        checkBoxContainer.appendChild(timeWrapper);
        this.timeCheckBox.appendTo(timeWrapper);
        section.appendChild(checkBoxContainer);
        return section;
    }

    /**
     * Handles Username / Date / Time checkbox changes.
     * @param {CheckBoxChangeEventArgs} args Contains the checkbox state and change event details.
     * @returns {void} Updates the selected stamp options based on the checkbox state.
     */
    private onStampPropertyChange(args: CheckBoxChangeEventArgs): void {
        const includeUser: boolean = this.userNameCheckBox ? this.userNameCheckBox.checked : false;
        const includeDate: boolean = this.dateCheckBox ? this.dateCheckBox.checked : false;
        const includeTime: boolean = this.timeCheckBox ? this.timeCheckBox.checked : false;
        const authorToken: string = includeUser ? '[$author]' : '';
        const dateToken: string = this.getDateToken(includeDate, includeTime);
        this.stampOptions.subtitle = `${authorToken} ${dateToken}`.trim();
        if (this.dateFormatDropDown) {
            const newOptions: string[] = this.getDateFormatOptions();
            this.dateFormatDropDown.dataSource = newOptions;
            if (newOptions.length > 0) {
                this.dateFormatDropDown.value = newOptions[0];
            }
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.updateDateFormatVisibility();
        } else {
            this.updateMobileDateFormatVisibility();
        }
        this.updatePreview();
    }

    /**
     * Shows or hides the date format section based on Date/Time checkbox state.
     * @returns {void}
     */
    private updateDateFormatVisibility(): void {
        if (!this.dialogContainer || !this.textStampDialog) { return; }
        const includeDate: boolean = this.dateCheckBox ? this.dateCheckBox.checked : false;
        const includeTime: boolean = this.timeCheckBox ? this.timeCheckBox.checked : false;
        const shouldShow: boolean = includeDate || includeTime;
        const dateFormatSection: HTMLElement = this.dialogContainer.querySelector(
            '.e-pv-custom-text-stamp-date-format-section') as HTMLElement;
        if (dateFormatSection) {
            dateFormatSection.style.display = shouldShow ? '' : 'none';
        }
    }

    /**
     * Builds the date/time token portion of the subtitle.
     * @param {boolean} includeDate - Indicates whether the date token should be included.
     * @param {boolean} includeTime - Indicates whether the time token should be included.
     * @returns {string} Token string like 'DD/MMMM/YYYY h:mm A'.
     */
    private getDateToken(includeDate: boolean, includeTime: boolean): string {
        if (includeDate && includeTime) {
            return 'DD/MMMM/YYYY h:mm A';
        }
        if (includeDate) {
            return 'DD/MMMM/YYYY';
        }
        if (includeTime) {
            return 'h:mm A';
        }
        return '';
    }

    /**
     * Creates the date format section.
     * @returns {HTMLDivElement} Date format section element.
     */
    private createDateFormatSection(): HTMLDivElement {
        const section: HTMLDivElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-date-format-section'
        }) as HTMLDivElement;
        const label: HTMLDivElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-label'
        }) as HTMLDivElement;
        label.textContent = this.pdfViewer.localeObj.getConstant('Date/Time format');
        section.appendChild(label);
        const dateFormatContainer: HTMLDivElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-date-format-container'
        }) as HTMLDivElement;
        const inputElement: HTMLInputElement = createElement('input') as HTMLInputElement;
        dateFormatContainer.appendChild(inputElement);
        this.dateFormatDropDown = new DropDownList({
            dataSource: this.getDateFormatOptions(),
            value: 'DD/MM/YYYY h:mm A',
            popupHeight: '220px',
            change: (args: any): void => this.onDateFormatChange(args)
        });
        this.dateFormatDropDown.appendTo(inputElement);
        section.appendChild(dateFormatContainer);
        return section;
    }

    /**
     * Gets available date format options based on
     * Date and Time checkbox selections.
     * @returns {string[]} Date format options.
     */
    private getDateFormatOptions(): string[] {
        const isDateChecked: boolean = this.dateCheckBox ? this.dateCheckBox.checked : true;
        const isTimeChecked: boolean = this.timeCheckBox ? this.timeCheckBox.checked : true;
        if (isDateChecked && isTimeChecked) {
            return [
                'DD/MM/YYYY h:mm A',
                'DD/MM/YYYY HH:mm',
                'YYYY/MM/DD h:mm A',
                'YYYY/MM/DD HH:mm',
                'DD MMMM YYYY h:mm A',
                'DD MMMM YYYY HH:mm',
                'DD MMM YYYY HH:mm',
                'MMMM DD, YYYY h:mm A',
                'MMMM DD, YYYY HH:mm',
                'MMMM DD YYYY h:mm A'
            ];
        }
        if (isDateChecked) {
            return [
                'DD/MM/YYYY',
                'YYYY/MM/DD',
                'DD MMMM YYYY',
                'MMMM DD, YYYY',
                'MMMM DD YYYY'
            ];
        }
        if (isTimeChecked) {
            return [
                'h:mm A',
                'HH:mm'
            ];
        }
        return [];
    }

    /**
     * Handles Date Format dropdown change.
     * Updates the subtitle token's date format portion and refreshes the preview.
     * @param {any} args Contains the selected date format value and related dropdown change event details.
     * @returns {void}
     */
    private onDateFormatChange(args: any): void {
        const format: string = args.value;
        if (!format) { return; }
        const includeUser: boolean = this.userNameCheckBox ? this.userNameCheckBox.checked : false;
        const includeDate: boolean = this.dateCheckBox ? this.dateCheckBox.checked : false;
        const includeTime: boolean = this.timeCheckBox ? this.timeCheckBox.checked : false;
        const authorToken: string = includeUser ? '[$author]' : '';
        this.stampOptions.subtitle = `${authorToken} ${format}`.trim();
        this.updatePreview();
    }

    /**
     * Update preview with current stamp settings by calling
     * Uses the canvas-based method directly for fast live preview updates.
     * @returns {void}
     */
    private updatePreview(): void {
        if (!this.previewContainer) { return; }
        this.previewContainer.innerHTML = '';
        if (!this.pdfViewer.annotation || !this.pdfViewer.annotation.stampAnnotationModule) { return; }

        const stampModule: any = this.pdfViewer.annotation.stampAnnotationModule;
        const author: string = (this.pdfViewer.annotationSettings && this.pdfViewer.annotationSettings.author)
            ? this.pdfViewer.annotationSettings.author
            : (this.pdfViewer.customStampSettings && this.pdfViewer.customStampSettings.author)
                ? this.pdfViewer.customStampSettings.author : 'Guest';
        // Prefer the new canvas-based method (fast — no base64 conversion)
        if (typeof stampModule.generateTextStamp === 'function') {
            const previewCanvas: HTMLCanvasElement = stampModule.generateTextStamp(
                this.stampOptions, author, new Date(), 210, 70
            );
            if (previewCanvas) {
                previewCanvas.classList.add('e-pv-custom-text-stamp-preview');
                this.previewContainer.appendChild(previewCanvas);
            }
            return;
        }
    }

    /**
     * Creates the Font Style section containing the font family
     * dropdown and text formatting option buttons.
     * @returns {HTMLDivElement} Font style section element.
     */
    private createFontStyleSection(): HTMLDivElement {
        const section: HTMLDivElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-font-style-section'
        }) as HTMLDivElement;
        const label: HTMLSpanElement = createElement('span', {
            className: 'e-pv-custom-text-stamp-label'
        }) as HTMLSpanElement;
        label.textContent = this.pdfViewer.localeObj.getConstant('Font style');
        section.appendChild(label);
        const rowContainer: HTMLDivElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-font-style-row'
        }) as HTMLDivElement;
        const fontFamilyContainer: HTMLDivElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-font-family-container'
        }) as HTMLDivElement;
        const fontFamilyInput: HTMLInputElement = createElement('input') as HTMLInputElement;
        fontFamilyContainer.appendChild(fontFamilyInput);
        const fontFamilies: string[] = this.getFontFamilies();
        this.stampOptions.fontFamily = fontFamilies[0];
        this.fontFamilyDropDown = new DropDownList({
            dataSource: fontFamilies,
            value: fontFamilies[0],
            popupHeight: '200px',
            change: (args: any): void => {
                this.stampOptions.fontFamily = args.value;
                this.updatePreview();
            }
        });
        this.fontFamilyDropDown.appendTo(fontFamilyInput);
        rowContainer.appendChild(fontFamilyContainer);
        const fontStyleGroup: HTMLDivElement = createElement('div', {
            className: 'e-btn-group e-pv-custom-text-stamp-format-group'
        }) as HTMLDivElement;
        this.boldInput = createElement('input', {
            attrs: { type: 'checkbox', id: this.pdfViewer.element.id + '_bold' }
        }) as HTMLInputElement;
        this.boldInput.checked = this.stampOptions.bold === true;
        this.boldInput.addEventListener('change', this.onFontStyleChange.bind(this));
        const boldLabel: HTMLLabelElement = createElement('label', {
            className: 'e-btn', attrs: { for: this.pdfViewer.element.id + '_bold' }
        }) as HTMLLabelElement;
        boldLabel.title = 'Bold';
        boldLabel.appendChild(createElement('span', { className: 'e-btn-icon bg-icons e-pv-bold-icon' }));
        this.italicInput = createElement('input', {
            attrs: { type: 'checkbox', id: this.pdfViewer.element.id + '_italic' }
        }) as HTMLInputElement;
        this.italicInput.checked = this.stampOptions.italic === true;
        this.italicInput.addEventListener('change', this.onFontStyleChange.bind(this));
        const italicLabel: HTMLLabelElement = createElement('label', {
            className: 'e-btn', attrs: { for: this.pdfViewer.element.id + '_italic' }
        }) as HTMLLabelElement;
        italicLabel.title = 'Italic';
        italicLabel.appendChild(createElement('span', { className: 'e-btn-icon bg-icons e-pv-italic-icon' }));
        this.strikeoutInput = createElement('input', {
            attrs: { type: 'checkbox', id: this.pdfViewer.element.id + '_strikeout' }
        }) as HTMLInputElement;
        this.strikeoutInput.checked = this.stampOptions.strikeout === true;
        this.strikeoutInput.addEventListener('change', this.onFontStyleChange.bind(this));
        const strikeLabel: HTMLLabelElement = createElement('label', {
            className: 'e-btn', attrs: { for: this.pdfViewer.element.id + '_strikeout' }
        }) as HTMLLabelElement;
        strikeLabel.title = 'Strikethrough';
        strikeLabel.appendChild(createElement('span', { className: 'e-btn-icon bg-icons e-pv-strikeout-icon' }));
        this.underlineInput = createElement('input', {
            attrs: { type: 'checkbox', id: this.pdfViewer.element.id + '_line' }
        }) as HTMLInputElement;
        this.underlineInput.checked = this.stampOptions.underline === true;
        this.underlineInput.addEventListener('change', this.onFontStyleChange.bind(this));
        const underlineLabel: HTMLLabelElement = createElement('label', {
            className: 'e-btn', attrs: { for: this.pdfViewer.element.id + '_line' }
        }) as HTMLLabelElement;
        underlineLabel.title = 'Underline';
        underlineLabel.appendChild(createElement('span', { className: 'e-btn-icon bg-icons e-pv-underline-icon' }));
        fontStyleGroup.appendChild(this.boldInput);
        fontStyleGroup.appendChild(boldLabel);
        fontStyleGroup.appendChild(this.italicInput);
        fontStyleGroup.appendChild(italicLabel);
        fontStyleGroup.appendChild(this.strikeoutInput);
        fontStyleGroup.appendChild(strikeLabel);
        fontStyleGroup.appendChild(this.underlineInput);
        fontStyleGroup.appendChild(underlineLabel);
        rowContainer.appendChild(fontStyleGroup);
        section.appendChild(rowContainer);
        return section;
    }

    /**
     * Combines the default font families with any user-provided
     * additionalFontFamilies from customStampSettings.
     * @returns {string[]} Merged font family list.
     */
    private getFontFamilies(): string[] {
        const customFonts: string[] = (
            this.pdfViewer.customStampSettings && Array.isArray(this.pdfViewer.customStampSettings.fontFamilyCollection))
            ? this.pdfViewer.customStampSettings.fontFamilyCollection.
                filter((f: string) => typeof f === 'string' && f.trim().length > 0) : [];
        return customFonts.length > 0 ? Array.from(new Set(customFonts)) : this.defaultFontFamilies;
    }

    /**
     * Handles Bold/Italic/Strikeout/Underline checkbox changes.
     * Updates the stampOptions object and triggers preview refresh.
     * @returns {void}
     */
    private onFontStyleChange(): void {
        this.stampOptions.bold = !!(this.boldInput && this.boldInput.checked);
        this.stampOptions.italic = !!(this.italicInput && this.italicInput.checked);
        this.stampOptions.strikeout = !!(this.strikeoutInput && this.strikeoutInput.checked);
        this.stampOptions.underline = !!(this.underlineInput && this.underlineInput.checked);
        this.updatePreview();
    }

    /**
     * Creates and displays the custom text stamp mobile panel.
     * @private
     * @returns {void}
     */
    private createMobileDialogWindow(): void {
        if (this.customTextStampContainer) {
            this.destroyMobileDialogWindow();
        }
        this.customTextStampContainer = createElement('div', {
            id: this.pdfViewer.element.id + '_customTextStampPanel',
            className: 'e-pv-custom-text-stamp-mobile-dialog'
        });
        this.customTextStampContainer.style.position = 'absolute';
        this.customTextStampContainer.style.display = 'flex';
        this.customTextStampContainer.style.flexDirection = 'column';
        this.customTextStampContainer.style.top = '0px';
        this.customTextStampContainer.style.left = '0px';
        this.customTextStampContainer.style.bottom = '0px';
        this.customTextStampContainer.style.right = '0px';
        this.customTextStampContainer.style.zIndex = '1001';
        if (this.pdfViewer.enableRtl) {
            this.customTextStampContainer.style.direction = 'rtl';
        }
        this.pdfViewerBase.mainContainer.appendChild(this.customTextStampContainer);
        this.createMobileHeader();
        this.createMobilePreviewSection();
        this.customTextStampContentContainer = createElement('div', {
            id: this.pdfViewer.element.id + '_customTextStampContentContainer',
            className: 'e-pv-custom-text-stamp-mobile-content'
        });
        this.customTextStampContainer.appendChild(this.customTextStampContentContainer);
        this.createMobileStampTextSection();
        this.createMobileFontStyleSection();
        this.createMobileColorPickerSection();
        this.createMobileStampPropertiesSection();
        this.createMobileDateFormatSection();
        this.createMobileFooter();
        this.updatePreview();
    }

    /**
     * Creates the header section of the custom text stamp mobile panel.
     * The header contains the close button and dialog title.
     * @private
     * @returns {void}
     */
    private createMobileHeader(): void {
        const headerContainer: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-header'
        });
        const closeButton: HTMLElement = createElement('span', {
            className: 'e-pv-custom-text-stamp-close-icon'
        });
        closeButton.addEventListener(
            'click',
            this.onCancelClicked.bind(this)
        );
        const title: HTMLElement = createElement('span', {
            className: 'e-pv-custom-text-stamp-mobile-title'
        });
        title.textContent =
            this.pdfViewer.localeObj.getConstant('Create new text stamp');

        headerContainer.appendChild(closeButton);
        headerContainer.appendChild(title);
        this.customTextStampContainer.appendChild(headerContainer);
    }

    /**
     * Creates the footer section of the custom text stamp mobile panel.
     * The footer contains the Cancel and Create action buttons.
     * @private
     * @returns {void}
     */
    private createMobileFooter(): void {
        const footerContainer: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-footer'
        });
        const cancelButton: HTMLElement = createElement('button', {
            className: 'e-pv-custom-text-stamp-cancel-btn'
        });
        cancelButton.textContent = this.pdfViewer.localeObj.getConstant('Cancel');
        cancelButton.addEventListener('click', this.onCancelClicked.bind(this));
        const createButton: HTMLElement = createElement('button', {
            className: 'e-pv-custom-text-stamp-create-btn'
        });
        createButton.textContent = this.pdfViewer.localeObj.getConstant('Create');
        createButton.addEventListener('click', this.onCreateClicked.bind(this));
        footerContainer.appendChild(cancelButton);
        footerContainer.appendChild(createButton);
        this.customTextStampContainer.appendChild(footerContainer);
    }

    /**
     * Creates the preview section for the custom text stamp mobile panel.
     * @private
     * @returns {void}
     */
    private createMobilePreviewSection(): void {
        const previewWrapper: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-preview-wrapper'
        });
        this.previewContainer = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-preview-container'
        });
        previewWrapper.appendChild(this.previewContainer);
        this.customTextStampContainer.appendChild(previewWrapper);
    }

    /**
     * Creates the stamp text section for the custom text stamp mobile panel.
     * @private
     * @returns {void}
     */
    private createMobileStampTextSection(): void {
        const section: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-text-section'
        });
        const label: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-label'
        });
        label.textContent = this.pdfViewer.localeObj.getConstant('Stamp text');
        section.appendChild(label);
        this.stampTextContainer = createElement('div', {
            className: 'e-pv-custom-text-stamp-textbox-mobile-container'
        });
        const inputElement: HTMLInputElement = createElement('input', {
            attrs: { type: 'text' }
        }) as HTMLInputElement;
        this.stampTextContainer.appendChild(inputElement);
        this.stampTextBox = new TextBox({
            value: this.stampOptions.title || this.defaultStampOptions.title,
            floatLabelType: 'Never',
            cssClass: 'e-pv-custom-text-stamp-mobile-textbox',
            input: (args: InputEventArgs) => {
                this.stampOptions.title = args.value;
                this.updatePreview();
            }
        });
        this.stampTextBox.appendTo(inputElement);
        section.appendChild(this.stampTextContainer);
        this.customTextStampContentContainer.appendChild(section);
    }

    /**
     * Creates the color customization section for the custom text stamp mobile panel.
     * @private
     * @returns {void}
     */
    private createMobileColorPickerSection(): void {
        const section: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-color-section'
        });
        section.appendChild(
            this.createMobileColorPickerItem(
                this.pdfViewer.localeObj.getConstant('Background color'),
                this.stampOptions.backgroundColor || this.defaultStampOptions.backgroundColor || '#00BCD4',
                this.onBackgroundColorChanged.bind(this)
            ));
        section.appendChild(
            this.createMobileColorPickerItem(
                this.pdfViewer.localeObj.getConstant('Text color'),
                this.stampOptions.textColor || this.defaultStampOptions.textColor || '#000000',
                this.onTextColorChanged.bind(this)
            )
        );
        this.customTextStampContentContainer.appendChild(section);
    }

    /**
     * Creates a color picker item with a label and color picker control.
     * @param {string} labelText - Specifies the display text for the color picker.
     * @param {string} colorValue - Specifies the initial color value.
     * @param {Function} changeHandler - Specifies the event handler triggered when the color changes.
     * @returns {HTMLElement} Returns the color picker item element.
     * @private
     */
    private createMobileColorPickerItem(labelText: string, colorValue: string, changeHandler: Function): HTMLElement {
        const colorItem: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-color-item'
        });
        const label: HTMLElement = createElement('span', {
            className: 'e-pv-custom-text-stamp-mobile-label'
        });
        label.textContent = labelText;
        colorItem.appendChild(label);
        const colorPickerContainer: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-color-picker'
        });
        const inputElement: HTMLElement = createElement('input');
        colorPickerContainer.appendChild(inputElement);
        const colorPicker: ColorPicker = new ColorPicker({
            mode: 'Picker',
            enableOpacity: false,
            value: colorValue,
            showButtons: false,
            modeSwitcher: false,
            change: changeHandler as any,
            enableRtl: this.pdfViewer.enableRtl
        });
        colorPicker.appendTo(inputElement);
        colorItem.appendChild(colorPickerContainer);
        return colorItem;
    }

    /**
     * Creates the stamp properties section for the custom text stamp mobile panel.
     * @private
     * @returns {void}
     */
    private createMobileStampPropertiesSection(): void {
        const section: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-properties-section'
        });
        const title: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-properties-title'
        });
        title.textContent =
            this.pdfViewer.localeObj.getConstant('Stamp properties');

        section.appendChild(title);
        const checkBoxContainer: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-checkbox-container'
        });
        const userNameWrapper: HTMLElement = createElement('div', {
            className: 'e-checkbox-wrapper e-wrapper e-pv-custom-text-stamp-checkbox'
        });
        this.userNameCheckBox = new CheckBox({
            label: this.pdfViewer.localeObj.getConstant('Username'),
            checked: true,
            cssClass: 'e-pv-custom-text-stamp-checkbox',
            change: (args: CheckBoxChangeEventArgs): void => {
                this.onStampPropertyChange(args);
            }
        });
        checkBoxContainer.appendChild(userNameWrapper);
        this.userNameCheckBox.appendTo(userNameWrapper);
        const dateWrapper: HTMLElement = createElement('div', {
            className: 'e-checkbox-wrapper e-wrapper e-pv-custom-text-stamp-checkbox'
        });
        this.dateCheckBox = new CheckBox({
            label: this.pdfViewer.localeObj.getConstant('Date'),
            checked: true,
            cssClass: 'e-pv-custom-text-stamp-checkbox',
            change: (args: CheckBoxChangeEventArgs): void => {
                this.onStampPropertyChange(args);
            }
        });
        checkBoxContainer.appendChild(dateWrapper);
        this.dateCheckBox.appendTo(dateWrapper);
        const timeWrapper: HTMLElement = createElement('div', {
            className: 'e-checkbox-wrapper e-wrapper e-pv-custom-text-stamp-checkbox'
        });
        this.timeCheckBox = new CheckBox({
            label: this.pdfViewer.localeObj.getConstant('Time'),
            checked: true,
            cssClass: 'e-pv-custom-text-stamp-checkbox',
            change: (args: CheckBoxChangeEventArgs): void => {
                this.onStampPropertyChange(args);
            }
        });
        checkBoxContainer.appendChild(timeWrapper);
        this.timeCheckBox.appendTo(timeWrapper);
        section.appendChild(checkBoxContainer);
        this.customTextStampContentContainer.appendChild(section);
    }

    /**
     * Creates the font style section for the custom text stamp mobile panel.
     * @private
     * @returns {void}
     */
    private createMobileFontStyleSection(): void {
        const section: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-font-style-section'
        });
        const label: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-label'
        });
        label.textContent = this.pdfViewer.localeObj.getConstant('Font style');
        section.appendChild(label);
        const rowContainer: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-font-style-row'
        });
        const fontFamilyContainer: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-font-family-container'
        });
        const fontFamilyInput: HTMLElement = createElement('input');
        fontFamilyContainer.appendChild(fontFamilyInput);
        const fontFamilies: string[] = this.getFontFamilies();
        this.stampOptions.fontFamily = fontFamilies[0];
        this.fontFamilyDropDown = new DropDownList({
            dataSource: fontFamilies,
            value: fontFamilies[0],
            popupHeight: '150px',
            change: (args: any) => {
                this.stampOptions.fontFamily = args.value as string;
                this.updatePreview();
            }
        });
        this.fontFamilyDropDown.appendTo(fontFamilyInput);
        rowContainer.appendChild(fontFamilyContainer);
        const fontStyleGroup: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-format-group'
        });
        this.boldInput = createElement('input', {
            attrs: {
                type: 'checkbox',
                id: this.pdfViewer.element.id + '_mobile_bold'
            }
        }) as HTMLInputElement;
        this.boldInput.checked = this.stampOptions.bold === true;
        const boldLabel: HTMLElement = createElement('label', {
            className: 'e-btn',
            attrs: {
                for: this.pdfViewer.element.id + '_mobile_bold'
            }
        });
        boldLabel.title = 'Bold';
        boldLabel.appendChild(createElement('span', {
            className: 'e-btn-icon bg-icons e-pv-bold-icon'
        }));
        this.italicInput = createElement('input', {
            attrs: {
                type: 'checkbox',
                id: this.pdfViewer.element.id + '_mobile_italic'
            }
        }) as HTMLInputElement;
        this.italicInput.checked = this.stampOptions.italic === true;
        const italicLabel: HTMLElement = createElement('label', {
            className: 'e-btn',
            attrs: {
                for: this.pdfViewer.element.id + '_mobile_italic'
            }
        });
        italicLabel.title = 'Italic';
        italicLabel.appendChild(createElement('span', {
            className: 'e-btn-icon bg-icons e-pv-italic-icon'
        }));
        this.strikeoutInput = createElement('input', {
            attrs: {
                type: 'checkbox',
                id: this.pdfViewer.element.id + '_mobile_strikeout'
            }
        }) as HTMLInputElement;
        this.strikeoutInput.checked = this.stampOptions.strikeout === true;
        const strikeLabel: HTMLElement = createElement('label', {
            className: 'e-btn',
            attrs: {
                for: this.pdfViewer.element.id + '_mobile_strikeout'
            }
        });
        strikeLabel.title = 'Strikethrough';
        strikeLabel.appendChild(createElement('span', {
            className: 'e-btn-icon bg-icons e-pv-strikeout-icon'
        }));
        this.underlineInput = createElement('input', {
            attrs: {
                type: 'checkbox',
                id: this.pdfViewer.element.id + '_mobile_underline'
            }
        }) as HTMLInputElement;
        this.underlineInput.checked = this.stampOptions.underline === true;
        const underlineLabel: HTMLElement = createElement('label', {
            className: 'e-btn',
            attrs: {
                for: this.pdfViewer.element.id + '_mobile_underline'
            }
        });
        underlineLabel.title = 'Underline';
        underlineLabel.appendChild(createElement('span', {
            className: 'e-btn-icon bg-icons e-pv-underline-icon'
        }));
        this.boldInput.addEventListener('change', this.onFontStyleChange.bind(this));
        this.italicInput.addEventListener('change', this.onFontStyleChange.bind(this));
        this.strikeoutInput.addEventListener('change', this.onFontStyleChange.bind(this));
        this.underlineInput.addEventListener('change', this.onFontStyleChange.bind(this));
        fontStyleGroup.appendChild(this.boldInput);
        fontStyleGroup.appendChild(boldLabel);
        fontStyleGroup.appendChild(this.italicInput);
        fontStyleGroup.appendChild(italicLabel);
        fontStyleGroup.appendChild(this.strikeoutInput);
        fontStyleGroup.appendChild(strikeLabel);
        fontStyleGroup.appendChild(this.underlineInput);
        fontStyleGroup.appendChild(underlineLabel);
        rowContainer.appendChild(fontStyleGroup);
        section.appendChild(rowContainer);
        this.customTextStampContentContainer.appendChild(section);
    }

    /**
     * Creates the date format section for the custom text stamp mobile panel.
     * @private
     * @returns {void}
     */
    private createMobileDateFormatSection(): void {
        const section: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-date-format-section'
        });
        const label: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-label'
        });
        label.textContent = this.pdfViewer.localeObj.getConstant('Date/Time format');
        section.appendChild(label);
        const dateFormatContainer: HTMLElement = createElement('div', {
            className: 'e-pv-custom-text-stamp-mobile-date-format-container'
        });
        const inputElement: HTMLElement = createElement('input');
        dateFormatContainer.appendChild(inputElement);
        this.dateFormatDropDown = new DropDownList({
            dataSource: this.getDateFormatOptions(),
            value: 'DD/MM/YYYY h:mm A',
            popupHeight: '220px',
            change: (args: ChangeEventArgs): void => {
                this.onDateFormatChange(args);
            }
        });
        this.dateFormatDropDown.appendTo(inputElement);
        section.appendChild(dateFormatContainer);
        this.customTextStampContentContainer.appendChild(section);
        this.updateMobileDateFormatVisibility();
    }

    /**
     * Updates the visibility of the date format section in mobile view.
     * @private
     * @returns {void}
     */
    private updateMobileDateFormatVisibility(): void {
        const includeDate: boolean = this.dateCheckBox ? this.dateCheckBox.checked : false;
        const includeTime: boolean = this.timeCheckBox ? this.timeCheckBox.checked : false;
        const shouldShow: boolean = includeDate || includeTime;
        const dateFormatSection: HTMLElement | null = this.customTextStampContentContainer ?
            this.customTextStampContentContainer.querySelector(
                '.e-pv-custom-text-stamp-mobile-date-format-section') as HTMLElement : null;
        if (dateFormatSection) {
            dateFormatSection.style.display = shouldShow ? '' : 'none';
        }
    }

    /**
     * Placeholder handler for the Cancel button (desktop branch).
     * @returns {void}
     */
    private onCancelClicked(): void {
        if (this.textStampDialog) {
            this.textStampDialog.hide();
        }
        if (this.customTextStampContainer) {
            this.stampOptions = { ...this.defaultStampOptions };
            this.destroyMobileDialogWindow();
        }
    }

    /**
     * Placeholder handler for the Create button (desktop + mobile branches).
     * @returns {void}
     */
    private onCreateClicked(): void {
        if (!this.pdfViewer.annotation || !this.pdfViewer.annotation.stampAnnotationModule ||
            typeof this.pdfViewer.annotation.stampAnnotationModule.generateTextStampBase64 !== 'function') {
            if (this.textStampDialog) {
                this.textStampDialog.hide();
            }
            return;
        }
        const author: string = (this.pdfViewer.annotationSettings && this.pdfViewer.annotationSettings.author)
            ? this.pdfViewer.annotationSettings.author
            : (this.pdfViewer.customStampSettings && this.pdfViewer.customStampSettings.author)
                ? this.pdfViewer.customStampSettings.author : 'Guest';
        const textBase64: string = this.pdfViewer.annotation.stampAnnotationModule.generateTextStampBase64(
            this.stampOptions,
            author,
            new Date()
        );
        if (textBase64) {
            this.pdfViewer.customStamp = [{
                customStampName: this.stampOptions.title,
                customStampImageSource: textBase64
            }];
            if (!this.pdfViewer.customStampSettings) {
                this.pdfViewer.customStampSettings = {};
            }
            this.pdfViewer.customStampSettings.isTextStamp = true;
            this.pdfViewer.customStampSettings.pageNumber = this.pdfViewer.currentPageNumber;
            if (typeof (this.pdfViewer as any).renderCustomerStamp === 'function') {
                this.pdfViewer.stampSettings.customData = { ...this.stampOptions };
                (this.pdfViewer as any).renderCustomerStamp(this.pdfViewer.customStamp[0]);
            }
            const stampName: string = this.stampOptions.title;
            const uniqueCustomStampName: string = this.pdfViewerBase.getCustomTextStampItemId(stampName);
            if (!this.pdfViewer.customStampSettings.customTextStamps) {
                (this.pdfViewer.customStampSettings as any).customTextStamps = [];
            }
            (this.pdfViewer.customStampSettings as any).customTextStamps.push({ ...this.stampOptions });
            if (this.pdfViewerBase.customTextStampCollection) {
                this.pdfViewerBase.customTextStampCollection.push({
                    customStampName: uniqueCustomStampName,
                    customStampText: { ...this.stampOptions },
                    customStampTitle: this.stampOptions.title || ''
                });
            }
        }
        this.stampOptions = { ...this.defaultStampOptions };
        if (this.textStampDialog) {
            this.textStampDialog.hide();
        }
        if (this.customTextStampContainer) {
            this.destroyMobileDialogWindow();
        }
    }

    /**
     * Destroys all EJ2 components owned by the mobile panel and clears references.
     * @returns {void}
     */
    private destroyMobileDialogWindow(): void {
        if (this.stampTextBox) { this.stampTextBox.destroy(); this.stampTextBox = null; }
        if (this.fontFamilyDropDown) { this.fontFamilyDropDown.destroy(); this.fontFamilyDropDown = null; }
        if (this.dateFormatDropDown) { this.dateFormatDropDown.destroy(); this.dateFormatDropDown = null; }
        if (this.userNameCheckBox) { this.userNameCheckBox.destroy(); this.userNameCheckBox = null; }
        if (this.dateCheckBox) { this.dateCheckBox.destroy(); this.dateCheckBox = null; }
        if (this.timeCheckBox) { this.timeCheckBox.destroy(); this.timeCheckBox = null; }
        if (this.customTextStampContainer) {
            const wrappers: NodeListOf<HTMLElement> =
                this.customTextStampContainer.querySelectorAll(
                    '.e-pv-custom-text-stamp-mobile-color-picker input');
            wrappers.forEach((input: HTMLElement) => {
                const inst: any = (input as any).ej2_instances && (input as any).ej2_instances[0];
                if (inst && typeof inst.destroy === 'function') {
                    inst.destroy();
                }
            });
        }
        if (this.customTextStampContainer && this.customTextStampContainer.parentElement) {
            this.customTextStampContainer.parentElement.removeChild(this.customTextStampContainer);
        }
        this.customTextStampContainer = null;
        this.customTextStampContentContainer = null;
        this.previewContainer = null;
        this.boldInput = null;
        this.italicInput = null;
        this.strikeoutInput = null;
        this.underlineInput = null;
    }

    /**
     * Close and destroy the dialog.
     * @returns {void}
     */
    private destroyDialog(): void {
        if (this.customTextStampContainer) {
            this.destroyMobileDialogWindow();
        }
        if (this.textStampDialog) {
            this.textStampDialog.destroy();
            this.textStampDialog = null;
        }
        this.stampOptions = { ...this.defaultStampOptions };
        this.dialogContainer = null;
    }
}
