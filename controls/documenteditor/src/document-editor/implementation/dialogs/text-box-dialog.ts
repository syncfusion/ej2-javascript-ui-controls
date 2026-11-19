import { L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { Button, CheckBox, RadioButton, ChangeArgs } from '@syncfusion/ej2-buttons';
import { DropDownList, PopupEventArgs } from '@syncfusion/ej2-dropdowns';
import { DocumentHelper } from '../viewer';
import { DialogUtility, OpenEventArgs } from '@syncfusion/ej2-popups';
import { TextBoxTemplateOptions, createDefaultTextBoxOptions } from '../editor/text-box-template';
import { Tab, TabItemModel } from '@syncfusion/ej2-navigations';

export class TextBoxDialog {
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    private target: HTMLElement;
    private positionTarget: HTMLElement;
    private nameInput: HTMLInputElement;
    private contentInput: HTMLTextAreaElement;
    private widthInput: HTMLInputElement;
    private heightInput: HTMLInputElement;
    private widthBox: NumericTextBox;
    private heightBox: NumericTextBox;
    private horizontalAbsoluteBox: NumericTextBox;
    private verticalAbsoluteBox: NumericTextBox;
    private horizontalAlignmentRadio: RadioButton;
    private horizontalAbsoluteRadio: RadioButton;
    private verticalAlignmentRadio: RadioButton;
    private verticalAbsoluteRadio: RadioButton;
    private horizontalAlignmentDropDown: DropDownList;
    private horizontalAlignmentRelativeDropDown: DropDownList;
    private horizontalAbsoluteRelativeDropDown: DropDownList;
    private verticalAlignmentDropDown: DropDownList;
    private verticalAlignmentRelativeDropDown: DropDownList;
    private verticalAbsoluteRelativeDropDown: DropDownList;
    private wrappingStyle: string = 'InFrontOfText';
    private wrappingButtons: HTMLDivElement[] = [];
    private wrapBothRadio: RadioButton;
    private wrapLeftRadio: RadioButton;
    private wrapRightRadio: RadioButton;
    private wrapLargestRadio: RadioButton;
    private wrapTextContainer: HTMLElement;
    private distanceLeftBox: NumericTextBox;
    private distanceRightBox: NumericTextBox;
    private distanceTopBox: NumericTextBox;
    private distanceBottomBox: NumericTextBox;
    private distanceContainer: HTMLElement;
    private options: TextBoxTemplateOptions;
    private localeValue: L10n;
    private tabObj: Tab = undefined;

    // Size tab
    private scaleWidthBox: NumericTextBox;
    private scaleHeightBox: NumericTextBox;
    private lockAspectRatio: CheckBox;
    private originalHeight: number = 74.88;
    private originalWidth: number = 185.76;
    private sizeSyncing: boolean = false;

    private positionButton: Button;
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    private getModuleName(): string {
        return 'TextBoxDialog';
    }

    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        const localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        this.localeValue = localValue;
        this.options = createDefaultTextBoxOptions();
        if (!this.target) {
            this.initTextBoxDialog(localValue);
        }
        this.resetValues();
        if (this.documentHelper.selection.caret.style.display !== 'none') {
            this.documentHelper.selection.caret.style.display = 'none';
        }
        this.documentHelper.dialog.header = localValue.getConstant('Insert Text Box');
        this.applyInsertDialogSize(this.documentHelper.dialog);
        this.documentHelper.dialog.allowDragging = true;
        this.documentHelper.dialog.zIndex = 1999;
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = this.documentHelper.updateFocus;
        this.documentHelper.dialog.close = this.documentHelper.updateFocus;
        this.documentHelper.dialog.buttons = [{
            click: this.onInsertTextBoxClick,
            buttonModel: {
                content: localValue.getConstant('Insert Text Box'),
                cssClass: 'e-flat e-text-box-insert',
                isPrimary: true
            }
        }, {
            click: this.onCancelButtonClick,
            buttonModel: { content: localValue.getConstant('Cancel'), cssClass: 'e-flat e-text-box-cancel' }
        }];
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.show();
        this.nameInput.focus();
    }

    /**
     * @private
     * @returns {void}
     */
    public onCancelButtonClick = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.updateFocus();
    };

    /**
     * Pastes the template only after Insert Text Box is clicked.
     *
     * @private
     * @returns {void}
     */
    public onInsertTextBoxClick = (): void => {
        const options: TextBoxTemplateOptions = this.collectOptions();
        if (!this.validateSize(options)) {
            return;
        }
        this.documentHelper.owner.editorModule.insertTextBoxInternal(options);
        this.documentHelper.hideDialog();
    };

    private initTextBoxDialog(localValue: L10n): void {
        // Dialog Box Small: spacing-16 inset, Small controls at 32px (form-Mouse).
        this.target = createElement('div', {
            className: 'e-de-insert-text-box'
        });
        this.nameInput = this.addTextField(this.target, localValue.getConstant('Text Box Name'), 'text');
        this.contentInput = this.addTextArea(this.target, localValue.getConstant('Text Content'), localValue.getConstant('Enter text box content'));
        const layoutRow: HTMLElement = createElement('div', {
            className: 'e-de-container-row'
        });
        const layoutHost: HTMLElement = createElement('button', {
            attrs: { type: 'button' }
        });
        layoutRow.appendChild(layoutHost);
        this.target.appendChild(layoutRow);
        this.positionButton = new Button({
            content: localValue.getConstant('Layout') + '...',
            cssClass: 'e-small e-outline'
        });
        this.positionButton.appendTo(layoutHost);
        this.positionButton.element.addEventListener('click', this.showLayoutDialog);
        this.initLayoutDialog(localValue);
    }

    private showLayoutDialog = (): void => {
        const localValue: L10n = this.localeValue;

        this.loadPositionValues();

        this.documentHelper.dialog3.header = localValue.getConstant('Layout');
        this.applyDialogSize(this.documentHelper.dialog3);
        this.documentHelper.dialog3.content = this.positionTarget;

        this.documentHelper.dialog3.buttons = [{
            click: this.onPositionOk,
            buttonModel: {
                content: localValue.getConstant('Ok'),
                cssClass: 'e-flat e-text-box-layout-ok',
                isPrimary: true
            }
        }, {
            click: this.onPositionCancel,
            buttonModel: {
                content: localValue.getConstant('Cancel'),
                cssClass: 'e-flat e-text-box-layout-cancel'
            }
        }];

        this.documentHelper.dialog3.dataBind();
        this.documentHelper.dialog3.show();

        this.tabObj.selectedItem = 0; // Position tab by default
    };

    private initLayoutDialog(localValue: L10n): void {
        this.positionTarget = createElement('div', {
            className: 'e-de-text-box-layout'
        });
        const tabContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-text-box-layout-tabs'
        });
        this.positionTarget.appendChild(tabContainer);
        const positionTab: HTMLDivElement = <HTMLDivElement>createElement('div');
        const wrappingTab: HTMLDivElement = <HTMLDivElement>createElement('div');
        const sizeTab: HTMLDivElement = <HTMLDivElement>createElement('div');

        const positionContent: HTMLDivElement = <HTMLDivElement>createElement('div');
        const wrappingContent: HTMLDivElement = <HTMLDivElement>createElement('div');
        const sizeContent: HTMLDivElement = <HTMLDivElement>createElement('div');

        positionContent.appendChild(positionTab);
        wrappingContent.appendChild(wrappingTab);
        sizeContent.appendChild(sizeTab);

        const items: TabItemModel[] = [
            {
                header: { text: localValue.getConstant('Position') },
                content: positionContent
            },
            {
                header: { text: localValue.getConstant('Text Wrapping') },
                content: wrappingContent
            },
            {
                header: { text: localValue.getConstant('Size') },
                content: sizeContent
            }
        ];

        this.tabObj = new Tab({
            items: items,
            heightAdjustMode: 'Auto',
            enableRtl: this.documentHelper.owner.enableRtl
        });
        this.tabObj.appendTo(tabContainer);

        // Initialize each tab
        this.initPositionTab(positionTab, localValue);
        this.initTextWrappingTab(wrappingTab, localValue);
        this.initSizeTab(sizeTab, localValue);
    }
    private initPositionTab(target: HTMLElement, localValue: L10n): void {
        const isRtl: boolean = this.documentHelper.owner.enableRtl;
        target.classList.add('e-de-text-box-position');
        this.applyTabPaneStyle(target);

        const horizontalAlignItems: { text: string; value: string }[] = [
            { text: localValue.getConstant('Left'), value: 'Left' },
            { text: localValue.getConstant('Centered'), value: 'Center' },
            { text: localValue.getConstant('Right'), value: 'Right' }
        ];
        const horizontalAlignRelative: { text: string; value: string }[] = [
            { text: localValue.getConstant('Column'), value: 'Column' },
            { text: localValue.getConstant('Margin'), value: 'Margin' },
            { text: localValue.getConstant('Page'), value: 'Page' },
            { text: localValue.getConstant('Character'), value: 'Character' },
            { text: localValue.getConstant('Left Margin'), value: 'LeftMargin' },
            { text: localValue.getConstant('Right Margin'), value: 'RightMargin' },
            { text: localValue.getConstant('Inside Margin'), value: 'InsideMargin' },
            { text: localValue.getConstant('Outside Margin'), value: 'OutsideMargin' }
        ];
        const absoluteRelative: { text: string; value: string }[] = [
            { text: localValue.getConstant('Margin'), value: 'Margin' },
            { text: localValue.getConstant('Page'), value: 'Page' },
            { text: localValue.getConstant('Column'), value: 'Column' },
            { text: localValue.getConstant('Character'), value: 'Character' },
            { text: localValue.getConstant('Left Margin'), value: 'LeftMargin' },
            { text: localValue.getConstant('Right Margin'), value: 'RightMargin' },
            { text: localValue.getConstant('Inside Margin'), value: 'InsideMargin' },
            { text: localValue.getConstant('Outside Margin'), value: 'OutsideMargin' }
        ];
        const positionGrid: HTMLElement = this.createPositionGrid(target);
        this.appendPositionHeading(positionGrid, localValue.getConstant('Horizontal'));
        const horizontalAlignmentRow: HTMLElement = this.createPositionRow(positionGrid);
        this.horizontalAlignmentRadio = this.createModeRadio(
            horizontalAlignmentRow, localValue.getConstant('Alignment'), 'horizontal-position', 'Alignment', false, isRtl);
        const horizontalAlignmentHost: HTMLInputElement = this.createInlineDropDownHost(horizontalAlignmentRow);
        this.createInlineLabel(horizontalAlignmentRow, localValue.getConstant('relative to'));
        const horizontalAlignmentRelativeHost: HTMLInputElement = this.createInlineDropDownHost(horizontalAlignmentRow);
        this.horizontalAlignmentDropDown = this.createInlineDropDown(horizontalAlignmentHost, horizontalAlignItems, 'Left', isRtl);
        this.horizontalAlignmentRelativeDropDown = this.createInlineDropDown(
            horizontalAlignmentRelativeHost, horizontalAlignRelative, 'Column', isRtl);

        const horizontalAbsoluteRow: HTMLElement = this.createPositionRow(positionGrid);
        this.horizontalAbsoluteRadio = this.createModeRadio(
            horizontalAbsoluteRow, localValue.getConstant('Absolute position'), 'horizontal-position', 'Absolute', true, isRtl);
        const horizontalAbsoluteHost: HTMLInputElement = this.createInlineNumericHost(horizontalAbsoluteRow, localValue.getConstant('Absolute position'));
        this.createInlineLabel(horizontalAbsoluteRow, localValue.getConstant('to the right of'));
        const horizontalAbsoluteRelativeHost: HTMLInputElement = this.createInlineDropDownHost(horizontalAbsoluteRow);
        this.horizontalAbsoluteBox = this.createInlineNumeric(horizontalAbsoluteHost, -3.75, isRtl);
        this.horizontalAbsoluteRelativeDropDown = this.createInlineDropDown(
            horizontalAbsoluteRelativeHost, absoluteRelative, 'Column', isRtl);

        this.appendPositionHeading(positionGrid, localValue.getConstant('Vertical'));
        const verticalAlignItems: { text: string; value: string }[] = [
            { text: localValue.getConstant('Top'), value: 'Top' },
            { text: localValue.getConstant('Centered'), value: 'Center' },
            { text: localValue.getConstant('Bottom'), value: 'Bottom' },
            { text: localValue.getConstant('Inside'), value: 'Inside' },
            { text: localValue.getConstant('Outside'), value: 'Outside' }
        ];
        const verticalAlignRelative: { text: string; value: string }[] = [
            { text: localValue.getConstant('Margin'), value: 'Margin' },
            { text: localValue.getConstant('Page'), value: 'Page' },
            { text: localValue.getConstant('Line'), value: 'Line' },
            { text: localValue.getConstant('Top Margin'), value: 'TopMargin' },
            { text: localValue.getConstant('Bottom Margin'), value: 'BottomMargin' },
            { text: localValue.getConstant('Inside Margin'), value: 'InsideMargin' },
            { text: localValue.getConstant('Outside Margin'), value: 'OutsideMargin' }
        ];
        const verticalAbsoluteRelative: { text: string; value: string }[] = [
            { text: localValue.getConstant('Margin'), value: 'Margin' },
            { text: localValue.getConstant('Page'), value: 'Page' },
            { text: localValue.getConstant('Paragraph'), value: 'Paragraph' },
            { text: localValue.getConstant('Line'), value: 'Line' },
            { text: localValue.getConstant('Top Margin'), value: 'TopMargin' },
            { text: localValue.getConstant('Bottom Margin'), value: 'BottomMargin' },
            { text: localValue.getConstant('Inside Margin'), value: 'InsideMargin' },
            { text: localValue.getConstant('Outside Margin'), value: 'OutsideMargin' }
        ];

        const verticalAlignmentRow: HTMLElement = this.createPositionRow(positionGrid);
        this.verticalAlignmentRadio = this.createModeRadio(
            verticalAlignmentRow, localValue.getConstant('Alignment'), 'vertical-position', 'Alignment', false, isRtl);
        const verticalAlignmentHost: HTMLInputElement = this.createInlineDropDownHost(verticalAlignmentRow);
        this.createInlineLabel(verticalAlignmentRow, localValue.getConstant('relative to'));
        const verticalAlignmentRelativeHost: HTMLInputElement = this.createInlineDropDownHost(verticalAlignmentRow);
        this.verticalAlignmentDropDown = this.createInlineDropDown(verticalAlignmentHost, verticalAlignItems, 'Top', isRtl);
        this.verticalAlignmentRelativeDropDown = this.createInlineDropDown(
            verticalAlignmentRelativeHost, verticalAlignRelative, 'Page', isRtl);

        const verticalAbsoluteRow: HTMLElement = this.createPositionRow(positionGrid);
        this.verticalAbsoluteRadio = this.createModeRadio(
            verticalAbsoluteRow, localValue.getConstant('Absolute position'), 'vertical-position', 'Absolute', true, isRtl);
        const verticalAbsoluteHost: HTMLInputElement = this.createInlineNumericHost(verticalAbsoluteRow, localValue.getConstant('Absolute position'));
        this.createInlineLabel(verticalAbsoluteRow, localValue.getConstant('below'));
        const verticalAbsoluteRelativeHost: HTMLInputElement = this.createInlineDropDownHost(verticalAbsoluteRow);
        this.verticalAbsoluteBox = this.createInlineNumeric(verticalAbsoluteHost, 1.5, isRtl);
        this.verticalAbsoluteRelativeDropDown = this.createInlineDropDown(
            verticalAbsoluteRelativeHost, verticalAbsoluteRelative, 'Paragraph', isRtl);
        this.updatePositionModeState();
    }

    private initTextWrappingTab(target: HTMLElement, localValue: L10n): void {
        const isRtl: boolean = this.documentHelper.owner.enableRtl;
        target.classList.add('e-de-text-box-wrapping');
        this.applyTabPaneStyle(target);
        this.appendSectionHeading(target, localValue.getConstant('Wrapping style'));
        const styles: { label: string; value: string; icon: string }[] = [
            { label: localValue.getConstant('In line with text'), value: 'Inline', icon: 'e-icons e-inline-wrap' },
            { label: localValue.getConstant('Square'), value: 'Square', icon: 'e-icons e-square-wrap' },
            { label: localValue.getConstant('Top and bottom'), value: 'TopAndBottom', icon: 'e-icons e-top-bottom-wrap' },
            { label: localValue.getConstant('Behind text'), value: 'Behind', icon: 'e-icons e-behind-wrap' },
            { label: localValue.getConstant('In front of text'), value: 'InFrontOfText', icon: 'e-icons e-infront-wrap' }
        ];
        const styleRow: HTMLElement = createElement('div', {
            className: 'e-de-container-row e-de-text-box-wrap-styles'
        });
        target.appendChild(styleRow);
        this.wrappingButtons = [];
        for (let i: number = 0; i < styles.length; i++) {
            this.wrappingButtons.push(this.createWrappingStyleButton(
                styleRow, styles[i as number].label, styles[i as number].value, styles[i as number].icon));
        }
        this.appendSectionHeading(target, localValue.getConstant('Wrap text'));
        this.wrapTextContainer = createElement('div', {
            className: 'e-de-dlg-row e-de-text-box-wrap-text'
        });
        target.appendChild(this.wrapTextContainer);
        this.wrapBothRadio = this.createWrapRadio(
            this.wrapTextContainer, localValue.getConstant('Both sides'), 'Both', true, isRtl);
        this.wrapLeftRadio = this.createWrapRadio(
            this.wrapTextContainer, localValue.getConstant('Left only'), 'Left', false, isRtl);
        this.wrapRightRadio = this.createWrapRadio(
            this.wrapTextContainer, localValue.getConstant('Right only'), 'Right', false, isRtl);
        this.wrapLargestRadio = this.createWrapRadio(
            this.wrapTextContainer, localValue.getConstant('Largest only'), 'Largest', false, isRtl);
        this.appendSectionHeading(target, localValue.getConstant('Distance from text'));
        this.distanceContainer = createElement('div', {
            className: 'e-de-text-box-distance'
        });
        target.appendChild(this.distanceContainer);
        const topHost: HTMLInputElement = this.createDistanceHost(this.distanceContainer, localValue.getConstant('Top'));
        const leftHost: HTMLInputElement = this.createDistanceHost(this.distanceContainer, localValue.getConstant('Left'));
        const bottomHost: HTMLInputElement = this.createDistanceHost(this.distanceContainer, localValue.getConstant('Bottom'));
        const rightHost: HTMLInputElement = this.createDistanceHost(this.distanceContainer, localValue.getConstant('Right'));
        this.distanceTopBox = this.createDistanceBox(topHost, 0, isRtl);
        this.distanceLeftBox = this.createDistanceBox(leftHost, 9, isRtl);
        this.distanceBottomBox = this.createDistanceBox(bottomHost, 0, isRtl);
        this.distanceRightBox = this.createDistanceBox(rightHost, 9, isRtl);
        this.selectWrappingStyle('InFrontOfText');
    }

    private initSizeTab(target: HTMLElement, localValue: L10n): void {
        const isRtl: boolean = this.documentHelper.owner.enableRtl;
        target.classList.add('e-de-text-box-size');
        this.applyTabPaneStyle(target);
        this.appendSectionHeading(target, localValue.getConstant('Height'));
        const heightAbsoluteRow: HTMLElement = this.createSizeRow(target);
        heightAbsoluteRow.appendChild(createElement('label', {
            innerHTML: localValue.getConstant('Absolute'),
            className: 'e-de-text-box-field-label'
        }));
        this.heightInput = this.createInlineNumericHost(heightAbsoluteRow, localValue.getConstant('Height'));
        this.heightBox = this.createInlineNumeric(this.heightInput, 74.88, isRtl);
        this.heightBox.change = this.onSizeValueChange;
        this.appendSectionHeading(target, localValue.getConstant('Width'));
        const widthAbsoluteRow: HTMLElement = this.createSizeRow(target);
        widthAbsoluteRow.appendChild(createElement('label', {
            innerHTML: localValue.getConstant('Absolute'),
            className: 'e-de-text-box-field-label'
        }));
        this.widthInput = this.createInlineNumericHost(widthAbsoluteRow, localValue.getConstant('Width'));
        this.widthBox = this.createInlineNumeric(this.widthInput, 185.76, isRtl);
        this.widthBox.change = this.onSizeValueChange;
        this.appendSectionHeading(target, localValue.getConstant('Scale'));
        const scaleRow: HTMLElement = this.createScaleRow(target);
        scaleRow.appendChild(createElement('label', {
            innerHTML: localValue.getConstant('Height') + ':',
            className: 'e-de-text-box-field-label'
        }));
        const scaleHeightHost: HTMLInputElement = this.createInlineNumericHost(scaleRow, localValue.getConstant('Height'));
        this.createInlineLabel(scaleRow, localValue.getConstant('Width') + ':');
        const scaleWidthHost: HTMLInputElement = this.createInlineNumericHost(scaleRow, localValue.getConstant('Width'));
        this.scaleHeightBox = this.createInlineNumeric(scaleHeightHost, 100, isRtl);
        this.scaleWidthBox = this.createInlineNumeric(scaleWidthHost, 100, isRtl);
        this.scaleHeightBox.format = 'n0';
        this.scaleWidthBox.format = 'n0';
        this.scaleHeightBox.decimals = 0;
        this.scaleWidthBox.decimals = 0;
        this.scaleHeightBox.min = 1;
        this.scaleWidthBox.min = 1;
        this.scaleHeightBox.change = this.onScaleChange;
        this.scaleWidthBox.change = this.onScaleChange;
        const scaleOptions: HTMLElement = createElement('div', {
            className: 'e-de-text-box-scale-options'
        });
        target.appendChild(scaleOptions);
        this.lockAspectRatio = this.createOptionCheck(scaleOptions, localValue.getConstant('Lock aspect ratio'), false, isRtl);
        this.lockAspectRatio.change = this.onLockAspectChange;
        this.updateSizeModeState();
    }

    private onPositionOk = (): void => {
        this.applyHorizontalPosition();
        this.applyVerticalPosition();
        this.options.textWrappingStyle = this.wrappingStyle;
        this.options.textWrappingType = this.selectedPositionMode([
            this.wrapBothRadio, this.wrapLeftRadio, this.wrapRightRadio, this.wrapLargestRadio
        ], 'Both');
        this.options.distanceLeft = this.distanceLeftBox.value;
        this.options.distanceRight = this.distanceRightBox.value;
        this.options.distanceTop = this.distanceTopBox.value;
        this.options.distanceBottom = this.distanceBottomBox.value;
        this.applySize();
        if (this.wrappingStyle === 'Inline') {
            this.applyInlineTextLayout();
        }
        this.documentHelper.dialog3.hide();
    };

    private onPositionCancel = (): void => {
        this.documentHelper.dialog3.hide();
    };

    private onWrappingStyleClick = (event: MouseEvent): void => {
        const button: HTMLDivElement = event.currentTarget as HTMLDivElement;
        if (!isNullOrUndefined(button)) {
            this.selectWrappingStyle(button.getAttribute('data-wrap'));
        }
    };

    private selectWrappingStyle(style: string): void {
        this.wrappingStyle = style || 'InFrontOfText';
        for (let i: number = 0; i < this.wrappingButtons.length; i++) {
            const selected: boolean = this.wrappingButtons[i as number].getAttribute('data-wrap') === this.wrappingStyle;
            if (selected) {
                this.wrappingButtons[i as number].classList.add('e-de-table-alignment-active');
            } else {
                this.wrappingButtons[i as number].classList.remove('e-de-table-alignment-active');
            }
            this.wrappingButtons[i as number].setAttribute('aria-pressed', selected ? 'true' : 'false');
        }
        const inline: boolean = this.wrappingStyle === 'Inline';
        const sideWrap: boolean = this.wrappingStyle === 'Square';
        const verticalDistance: boolean = sideWrap || this.wrappingStyle === 'TopAndBottom';
        this.setWrapRadiosEnabled(sideWrap);
        this.setNumericEnabled(this.distanceLeftBox, sideWrap);
        this.setNumericEnabled(this.distanceRightBox, sideWrap);
        this.setNumericEnabled(this.distanceTopBox, verticalDistance);
        this.setNumericEnabled(this.distanceBottomBox, verticalDistance);
        if (!isNullOrUndefined(this.horizontalAlignmentRadio)) {
            this.updatePositionModeState();
        }
        if (inline) {
            this.distanceLeftBox.value = 0;
            this.distanceRightBox.value = 0;
            this.distanceTopBox.value = 0;
            this.distanceBottomBox.value = 0;
        }
    }

    /**
     * Inline wrapping has no floating position. Zero the values Word clears
     * and keep relative width from being written as a floating measurement.
     *
     * @returns {void}
     */
    private applyInlineTextLayout(): void {
        this.options.horizontalPosition = 0;
        this.options.verticalPosition = 0;
        this.options.horizontalRelativePercent = 0;
        this.options.verticalRelativePercent = 0;
        this.options.widthRelativePercent = 0;
        this.options.distanceLeft = 0;
        this.options.distanceRight = 0;
        this.options.distanceTop = 0;
        this.options.distanceBottom = 0;
        this.options.horizontalAlignment = 'None';
        this.options.verticalAlignment = 'None';
        this.options.horizontalPositionMode = 'Absolute';
        this.options.verticalPositionMode = 'Absolute';
    }

    private setWrapRadiosEnabled(enabled: boolean): void {
        const radios: RadioButton[] = [this.wrapBothRadio, this.wrapLeftRadio, this.wrapRightRadio, this.wrapLargestRadio];
        for (let i: number = 0; i < radios.length; i++) {
            if (!isNullOrUndefined(radios[i as number])) {
                radios[i as number].disabled = !enabled;
                radios[i as number].dataBind();
            }
        }
    }

    private collectOptions(): TextBoxTemplateOptions {
        const options: TextBoxTemplateOptions = { ...this.options };
        options.name = this.nameInput.value.trim() || 'Text Box';
        options.text = this.contentInput.value;
        const width: { value: number; relative: boolean } = this.parseSize(String(this.options.width), 185.76);
        const height: { value: number; relative: boolean } = this.parseSize(String(this.options.height), 74.88);
        options.width = width.relative ? 0 : width.value;
        options.height = height.relative ? 0 : height.value;
        options.widthRelativePercent = width.relative ? width.value : this.options.widthRelativePercent;
        options.heightRelativePercent = height.relative ? height.value : this.options.heightRelativePercent;
        if (options.textWrappingStyle === 'Inline') {
            options.horizontalPosition = 0;
            options.verticalPosition = 0;
            options.horizontalRelativePercent = 0;
            options.verticalRelativePercent = 0;
            options.widthRelativePercent = 0;
            options.distanceLeft = 0;
            options.distanceRight = 0;
            options.distanceTop = 0;
            options.distanceBottom = 0;
        }
        return options;
    }

    private parseSize(raw: string, fallback: number): { value: number; relative: boolean } {
        const value: string = (raw || '').trim();
        if (value.length > 0 && value.charAt(value.length - 1) === '%') {
            return { value: parseFloat(value), relative: true };
        }
        const parsed: number = parseFloat(value);
        return { value: isNaN(parsed) ? fallback : parsed, relative: false };
    }

    private validateSize(options: TextBoxTemplateOptions): boolean {
        const inline: boolean = options.textWrappingStyle === 'Inline';
        const widthValid: boolean = options.width > 0 || (!inline && options.widthRelativePercent > 0);
        const heightValid: boolean = options.height > 0 || (!inline && options.heightRelativePercent > 0);
        if (widthValid && heightValid) {
            return true;
        }
        const isAngularModal: boolean = this.documentHelper.owner.isModalDialog;
        DialogUtility.alert({
            content: this.localeValue.getConstant('The number must be between'),
            open: (e: OpenEventArgs) => {
                if (isAngularModal) {
                    this.documentHelper.owner.moveAlertToCdkOverlay(e);
                }
            }
        }).enableRtl = this.documentHelper.owner.enableRtl;
        return false;
    }

    private resetValues(): void {
        this.nameInput.value = 'Text Box';
        this.contentInput.value = '';
        if (this.widthBox) {
            this.widthBox.value = 185.76;
            this.heightBox.value = 74.88;
            this.horizontalAbsoluteBox.value = -3.75;
            this.verticalAbsoluteBox.value = 1.5;
            this.horizontalAbsoluteRadio.checked = true;
            this.horizontalAlignmentRadio.checked = false;
            this.verticalAbsoluteRadio.checked = true;
            this.verticalAlignmentRadio.checked = false;
            this.horizontalAlignmentDropDown.value = 'Left';
            this.horizontalAlignmentRelativeDropDown.value = 'Column';
            this.horizontalAbsoluteRelativeDropDown.value = 'Column';
            this.verticalAlignmentDropDown.value = 'Top';
            this.verticalAlignmentRelativeDropDown.value = 'Page';
            this.verticalAbsoluteRelativeDropDown.value = 'Paragraph';
            this.updatePositionModeState();
            this.selectWrappingStyle('InFrontOfText');
            this.wrapBothRadio.checked = true;
            this.wrapLeftRadio.checked = false;
            this.wrapRightRadio.checked = false;
            this.wrapLargestRadio.checked = false;
            this.distanceLeftBox.value = 9;
            this.distanceRightBox.value = 9;
            this.distanceTopBox.value = 0;
            this.distanceBottomBox.value = 0;

            this.scaleHeightBox.value = 100;
            this.scaleWidthBox.value = 100;
            this.lockAspectRatio.checked = false;
            this.updateSizeModeState();
        }
    }

    private loadPositionValues(): void {
        this.widthBox.value = this.options.width;
        this.heightBox.value = this.options.height;
        this.loadHorizontalPosition();
        this.loadVerticalPosition();
        this.updatePositionModeState();
        this.selectWrappingStyle(this.options.textWrappingStyle);
        const wrapType: string = this.options.textWrappingType || 'Both';
        this.wrapBothRadio.checked = wrapType === 'Both';
        this.wrapLeftRadio.checked = wrapType === 'Left';
        this.wrapRightRadio.checked = wrapType === 'Right';
        this.wrapLargestRadio.checked = wrapType === 'Largest';
        this.distanceLeftBox.value = this.options.distanceLeft;
        this.distanceRightBox.value = this.options.distanceRight;
        this.distanceTopBox.value = this.options.distanceTop;
        this.distanceBottomBox.value = this.options.distanceBottom;
        this.loadSize();
    }

    private addTextField(parent: HTMLElement, label: string, type: string): HTMLInputElement {
        const row: HTMLElement = createElement('div', {
            className: 'e-de-container-row e-de-text-box-field'
        });
        const labelElement: HTMLElement = createElement('label', {
            className: 'e-de-text-box-field-label',
            innerHTML: label + ':'
        });
        const input: HTMLInputElement = createElement('input', {
            className: 'e-input',
            attrs: { type: type, 'aria-label': label }
        }) as HTMLInputElement;
        row.appendChild(labelElement);
        row.appendChild(input);
        parent.appendChild(row);
        return input;
    }

    private addTextArea(parent: HTMLElement, label: string, placeholder: string): HTMLTextAreaElement {
        const row: HTMLElement = createElement('div', {
            className: 'e-de-container-row e-de-text-box-field'
        });
        const labelElement: HTMLElement = createElement('label', {
            className: 'e-de-text-box-field-label',
            innerHTML: label + ':'
        });
        const input: HTMLTextAreaElement = createElement('textarea', {
            className: 'e-input',
            attrs: {
                placeholder: placeholder
            }
        }) as HTMLTextAreaElement;
        input.setAttribute('aria-label', label);
        row.appendChild(labelElement);
        row.appendChild(input);
        parent.appendChild(row);
        return input;
    }

    private applyInsertDialogSize(dialog: { width: string | number; height: string | number }): void {
        dialog.width = '480px';
        dialog.height = 'auto';
    }

    private applyDialogSize(dialog: { width: string | number; height: string | number }): void {
        dialog.width = '540px';
        dialog.height = '500px';
    }

    private applyTabPaneStyle(target: HTMLElement): void {
        target.classList.add('e-de-text-box-pane');
    }

    private appendSectionHeading(parent: HTMLElement, text: string): void {
        const heading: HTMLElement = createElement('div', {
            className: 'e-de-para-dlg-heading',
            innerHTML: text
        });
        parent.appendChild(heading);
    }

    private appendPositionHeading(grid: HTMLElement, text: string): void {
        const heading: HTMLElement = createElement('div', {
            className: 'e-de-para-dlg-heading',
            innerHTML: text
        });
        grid.appendChild(heading);
    }

    private createPositionGrid(parent: HTMLElement): HTMLElement {
        const grid: HTMLElement = createElement('div', {
            className: 'e-de-text-box-position-grid'
        });
        parent.appendChild(grid);
        return grid;
    }

    private createPositionRow(parent: HTMLElement): HTMLElement {
        const row: HTMLElement = createElement('div', {
            className: 'e-de-dlg-row e-de-text-box-position-row'
        });
        parent.appendChild(row);
        return row;
    }

    private createScaleRow(parent: HTMLElement): HTMLElement {
        const row: HTMLElement = createElement('div', {
            className: 'e-de-dlg-row e-de-text-box-scale-row'
        });
        parent.appendChild(row);
        return row;
    }

    private createSizeRow(parent: HTMLElement): HTMLElement {
        const row: HTMLElement = createElement('div', {
            className: 'e-de-dlg-row e-de-text-box-size-row'
        });
        parent.appendChild(row);
        return row;
    }

    private createModeRadio(
        row: HTMLElement, label: string, name: string, value: string, checked: boolean, isRtl: boolean): RadioButton {
        const hostWrap: HTMLElement = createElement('div', {
            className: 'e-de-text-box-mode'
        });
        const host: HTMLInputElement = createElement('input', {
            attrs: { type: 'radio', 'aria-label': label }
        }) as HTMLInputElement;
        hostWrap.appendChild(host);
        row.appendChild(hostWrap);
        const radio: RadioButton = new RadioButton({
            label: label,
            name: name,
            value: value,
            checked: checked,
            cssClass: 'e-small',
            enableRtl: isRtl,
            change: name.indexOf('position') !== -1 ? this.onPositionModeChange : this.onSizeModeChange
        });
        radio.appendTo(host);
        return radio;
    }

    private createInlineLabel(row: HTMLElement, text: string): void {
        row.appendChild(createElement('label', {
            innerHTML: text,
            className: 'e-de-text-box-inline-label'
        }));
    }

    private createInlineDropDownHost(row: HTMLElement): HTMLInputElement {
        const host: HTMLInputElement = createElement('input', {
            attrs: { type: 'text' }
        }) as HTMLInputElement;

        const wrap: HTMLElement = createElement('div', {
            className: 'e-de-text-box-control'
        });

        wrap.appendChild(host);
        row.appendChild(wrap);

        return host;
    }

    private createInlineDropDown(
        host: HTMLInputElement,
        dataSource: { text: string; value: string }[],
        value: string,
        isRtl: boolean
    ): DropDownList {

        const dropDown: DropDownList = new DropDownList({
            dataSource,
            fields: { text: 'text', value: 'value' },
            value,
            width: '100%',
            popupHeight: '200px',
            cssClass: 'e-de-text-box-ddl-popup',
            enableRtl: isRtl
        });

        dropDown.appendTo(host);
        return dropDown;
    }

    private createInlineNumericHost(row: HTMLElement, label: string): HTMLInputElement {
        const host: HTMLInputElement = createElement('input', {
            attrs: { type: 'text', 'aria-label': label }
        }) as HTMLInputElement;
        const wrap: HTMLElement = createElement('div', {
            className: 'e-de-text-box-control'
        });
        wrap.appendChild(host);
        row.appendChild(wrap);
        return host;
    }

    private createInlineNumeric(host: HTMLInputElement, value: number, isRtl: boolean): NumericTextBox {
        const box: NumericTextBox = new NumericTextBox({
            value: value,
            format: 'n2',
            decimals: 2,
            width: '100%',
            cssClass: 'e-small',
            enableRtl: isRtl
        });
        box.appendTo(host);
        return box;
    }

    private createOptionCheck(parent: HTMLElement, label: string, checked: boolean, isRtl: boolean): CheckBox {
        const host: HTMLInputElement = createElement('input', {
            attrs: { type: 'checkbox', 'aria-label': label }
        }) as HTMLInputElement;
        parent.appendChild(host);
        const box: CheckBox = new CheckBox({
            label: label,
            checked: checked,
            enableRtl: isRtl,
            cssClass: 'e-small'
        });
        box.appendTo(host);
        return box;
    }


    private updateSizeModeState(): void {
        this.setNumericEnabled(this.heightBox, true);
        this.setNumericEnabled(this.widthBox, true);
    }

    private applySize(): void {
        this.options.heightScale = this.scaleHeightBox.value;
        this.options.widthScale = this.scaleWidthBox.value;
        this.options.lockAspectRatio = this.lockAspectRatio.checked;
        this.options.height = this.heightBox.value;
        this.options.heightRelativePercent = -3.4028235e38;
        this.options.width = this.widthBox.value;
        this.options.widthRelativePercent = -3.4028235e38;
    }

    private loadSize(): void {
        this.scaleHeightBox.value = isNaN(this.options.heightScale) ? 100 : this.options.heightScale;
        this.scaleWidthBox.value = isNaN(this.options.widthScale) ? 100 : this.options.widthScale;
        this.lockAspectRatio.checked = this.options.lockAspectRatio === true;
        this.updateSizeModeState();
    }

    private onSizeValueChange = (): void => {
        if (this.sizeSyncing || this.originalHeight === 0) {
            return;
        }
        this.sizeSyncing = true;
        if (this.heightBox.enabled) {
            this.scaleHeightBox.value = Math.round((this.heightBox.value / this.originalHeight) * 100);
        }
        if (this.widthBox.enabled) {
            this.scaleWidthBox.value = Math.round((this.widthBox.value / this.originalWidth) * 100);
        }
        this.sizeSyncing = false;
    };

    private onScaleChange = (args: { event?: Event }): void => {
        if (this.sizeSyncing || isNullOrUndefined(args) || isNullOrUndefined(args.event)) {
            return;
        }
        this.sizeSyncing = true;
        const heightScale: number = this.scaleHeightBox.value || 100;
        const widthScale: number = this.scaleWidthBox.value || 100;
        if (this.lockAspectRatio.checked && args.event.target) {
            const fromHeight: boolean = (args.event.target as HTMLElement).getAttribute('aria-label') === this.localeValue.getConstant('Height');
            if (fromHeight) {
                this.scaleWidthBox.value = heightScale;
            } else {
                this.scaleHeightBox.value = widthScale;
            }
        }
        if (this.heightBox.enabled) {
            this.heightBox.value = this.originalHeight * (this.scaleHeightBox.value / 100);
        }
        if (this.widthBox.enabled) {
            this.widthBox.value = this.originalWidth * (this.scaleWidthBox.value / 100);
        }
        this.sizeSyncing = false;
    };

    private onLockAspectChange = (): void => {
        if (this.lockAspectRatio.checked) {
            this.sizeSyncing = true;
            this.scaleWidthBox.value = this.scaleHeightBox.value;
            if (this.widthBox.enabled) {
                this.widthBox.value = this.originalWidth * (this.scaleWidthBox.value / 100);
            }
            this.sizeSyncing = false;
        }
    };

    private createWrappingStyleButton(parent: HTMLElement, label: string, value: string, iconClass: string): HTMLDivElement {
        const tile: HTMLDivElement = createElement('div', {
            className: 'e-de-text-box-wrap-tile'
        }) as HTMLDivElement;
        const box: HTMLDivElement = createElement('div', {
            className: 'e-de-table-dia-align-div',
            attrs: { 'data-wrap': value, title: label, 'aria-label': label, role: 'button', tabindex: '0' }
        }) as HTMLDivElement;
        const icon: HTMLDivElement = createElement('div', {
            className: iconClass + ' e-de-text-box-wrap-icon'
        }) as HTMLDivElement;
        box.appendChild(icon);
        tile.appendChild(box);
        tile.appendChild(createElement('label', {
            innerHTML: label,
            className: 'e-de-table-dia-align-label'
        }));
        box.addEventListener('click', this.onWrappingStyleClick);
        parent.appendChild(tile);
        return box;
    }

    private createWrapRadio(parent: HTMLElement, label: string, value: string, checked: boolean, isRtl: boolean): RadioButton {
        const host: HTMLInputElement = createElement('input', {
            attrs: { type: 'radio', 'aria-label': label }
        }) as HTMLInputElement;
        parent.appendChild(host);
        const radio: RadioButton = new RadioButton({
            label: label,
            name: 'wrap-text',
            value: value,
            checked: checked,
            cssClass: 'e-small',
            enableRtl: isRtl
        });
        radio.appendTo(host);
        return radio;
    }

    private createDistanceHost(parent: HTMLElement, label: string): HTMLInputElement {
        const row: HTMLElement = createElement('div', {
            className: 'e-de-text-box-distance-row'
        });
        row.appendChild(createElement('label', {
            innerHTML: label
        }));
        const host: HTMLInputElement = createElement('input', {
            attrs: { type: 'text', 'aria-label': label }
        }) as HTMLInputElement;
        const wrap: HTMLElement = createElement('div');
        wrap.appendChild(host);
        row.appendChild(wrap);
        parent.appendChild(row);
        return host;
    }

    private createDistanceBox(host: HTMLInputElement, value: number, isRtl: boolean): NumericTextBox {
        const box: NumericTextBox = new NumericTextBox({
            value: value,
            min: 0,
            format: 'n2',
            decimals: 2,
            width: '100%',
            cssClass: 'e-small',
            enableRtl: isRtl
        });
        box.appendTo(host);
        return box;
    }

    private onPositionModeChange = (args: ChangeArgs): void => {
        if (!isNullOrUndefined(args.value)) {
            this.updatePositionModeState();
        }
    };

    private onSizeModeChange = (args: ChangeArgs): void => {
        if (!isNullOrUndefined(args.value)) {
            this.updateSizeModeState();
        }
    };

    private updatePositionModeState(): void {
        const inline: boolean = this.wrappingStyle === 'Inline';
        const horizontalMode: string = this.selectedPositionMode([
            this.horizontalAlignmentRadio, this.horizontalAbsoluteRadio
        ], 'Absolute');
        const verticalMode: string = this.selectedPositionMode([
            this.verticalAlignmentRadio, this.verticalAbsoluteRadio
        ], 'Absolute');
        this.setRadioEnabled(this.horizontalAlignmentRadio, !inline);
        this.setRadioEnabled(this.horizontalAbsoluteRadio, !inline);
        this.setRadioEnabled(this.verticalAlignmentRadio, !inline);
        this.setRadioEnabled(this.verticalAbsoluteRadio, !inline);
        this.setDropDownEnabled(this.horizontalAlignmentDropDown, !inline && horizontalMode === 'Alignment');
        this.setDropDownEnabled(this.horizontalAlignmentRelativeDropDown, !inline && horizontalMode === 'Alignment');
        this.setNumericEnabled(this.horizontalAbsoluteBox, !inline && horizontalMode === 'Absolute');
        this.setDropDownEnabled(this.horizontalAbsoluteRelativeDropDown, !inline && horizontalMode === 'Absolute');
        this.setDropDownEnabled(this.verticalAlignmentDropDown, !inline && verticalMode === 'Alignment');
        this.setDropDownEnabled(this.verticalAlignmentRelativeDropDown, !inline && verticalMode === 'Alignment');
        this.setNumericEnabled(this.verticalAbsoluteBox, !inline && verticalMode === 'Absolute');
        this.setDropDownEnabled(this.verticalAbsoluteRelativeDropDown, !inline && verticalMode === 'Absolute');
    }

    private setRadioEnabled(radio: RadioButton, enabled: boolean): void {
        if (!isNullOrUndefined(radio)) {
            radio.disabled = !enabled;
            radio.dataBind();
        }
    }

    private selectedPositionMode(radios: RadioButton[], fallback: string): string {
        for (let i: number = 0; i < radios.length; i++) {
            if (radios[i as number] && radios[i as number].checked) {
                return radios[i as number].value;
            }
        }
        return fallback;
    }

    private setDropDownEnabled(dropDown: DropDownList, enabled: boolean): void {
        if (!isNullOrUndefined(dropDown)) {
            dropDown.enabled = enabled;
            dropDown.dataBind();
        }
    }

    private setNumericEnabled(box: NumericTextBox, enabled: boolean): void {
        if (!isNullOrUndefined(box)) {
            box.enabled = enabled;
            box.dataBind();
        }
    }

    private applyHorizontalPosition(): void {
        const mode: string = this.selectedPositionMode([
            this.horizontalAlignmentRadio, this.horizontalAbsoluteRadio
        ], 'Absolute');
        this.options.horizontalPositionMode = mode;
        this.options.horizontalRelativePercent = -3.4028235e38;
        this.options.horizontalAlignment = 'None';
        if (mode === 'Alignment') {
            this.options.horizontalAlignment = this.horizontalAlignmentDropDown.value as string;
            this.options.horizontalOrigin = this.horizontalAlignmentRelativeDropDown.value as string;
            this.options.horizontalPosition = 0;
        } else {
            this.options.horizontalOrigin = this.horizontalAbsoluteRelativeDropDown.value as string;
            this.options.horizontalPosition = this.horizontalAbsoluteBox.value;
        }
    }

    private applyVerticalPosition(): void {
        const mode: string = this.selectedPositionMode([
            this.verticalAlignmentRadio, this.verticalAbsoluteRadio
        ], 'Absolute');
        this.options.verticalPositionMode = mode;
        this.options.verticalRelativePercent = -3.4028235e38;
        this.options.verticalAlignment = 'None';
        if (mode === 'Alignment') {
            this.options.verticalAlignment = this.verticalAlignmentDropDown.value as string;
            this.options.verticalOrigin = this.verticalAlignmentRelativeDropDown.value as string;
            this.options.verticalPosition = 0;
        } else {
            this.options.verticalOrigin = this.verticalAbsoluteRelativeDropDown.value as string;
            this.options.verticalPosition = this.verticalAbsoluteBox.value;
        }
    }

    private loadHorizontalPosition(): void {
        const mode: string = this.options.horizontalPositionMode
            || (this.options.horizontalAlignment && this.options.horizontalAlignment !== 'None' ? 'Alignment' : 'Absolute');
        this.horizontalAlignmentRadio.checked = mode === 'Alignment';
        this.horizontalAbsoluteRadio.checked = mode === 'Absolute';
        if (this.horizontalAlignmentRadio.checked) {
            this.horizontalAlignmentDropDown.value = this.options.horizontalAlignment || 'Left';
            this.horizontalAlignmentRelativeDropDown.value = this.options.horizontalOrigin || 'Column';
        }
        this.horizontalAbsoluteBox.value = this.options.horizontalPosition;
        this.horizontalAbsoluteRelativeDropDown.value = mode === 'Absolute'
            ? (this.options.horizontalOrigin || 'Column') : this.horizontalAbsoluteRelativeDropDown.value;
    }

    private loadVerticalPosition(): void {
        const mode: string = this.options.verticalPositionMode
            || (this.options.verticalAlignment && this.options.verticalAlignment !== 'None' ? 'Alignment' : 'Absolute');
        this.verticalAlignmentRadio.checked = mode === 'Alignment';
        this.verticalAbsoluteRadio.checked = mode === 'Absolute';
        if (mode === 'Alignment') {
            this.verticalAlignmentDropDown.value = this.options.verticalAlignment || 'Top';
            this.verticalAlignmentRelativeDropDown.value = this.options.verticalOrigin || 'Page';
        }
        this.verticalAbsoluteBox.value = this.options.verticalPosition;
        if (mode === 'Absolute') {
            this.verticalAbsoluteRelativeDropDown.value = this.options.verticalOrigin || 'Paragraph';
        }
    }

    private destroyComponent(component: { destroy: () => void }): void {
        if (!isNullOrUndefined(component)) {
            component.destroy();
        }
    }

    private removeElement(element: HTMLElement): void {
        if (!isNullOrUndefined(element)) {
            if (element.parentElement) {
                element.parentElement.removeChild(element);
            }
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.destroyComponent(this.positionButton);
        this.destroyComponent(this.widthBox);
        this.destroyComponent(this.heightBox);
        this.destroyComponent(this.horizontalAbsoluteBox);
        this.destroyComponent(this.verticalAbsoluteBox);
        this.destroyComponent(this.horizontalAlignmentRadio);
        this.destroyComponent(this.horizontalAbsoluteRadio);
        this.destroyComponent(this.verticalAlignmentRadio);
        this.destroyComponent(this.verticalAbsoluteRadio);
        this.destroyComponent(this.horizontalAlignmentDropDown);
        this.destroyComponent(this.horizontalAlignmentRelativeDropDown);
        this.destroyComponent(this.horizontalAbsoluteRelativeDropDown);
        this.destroyComponent(this.verticalAlignmentDropDown);
        this.destroyComponent(this.verticalAlignmentRelativeDropDown);
        this.destroyComponent(this.verticalAbsoluteRelativeDropDown);
        this.destroyComponent(this.wrapBothRadio);
        this.destroyComponent(this.wrapLeftRadio);
        this.destroyComponent(this.wrapRightRadio);
        this.destroyComponent(this.wrapLargestRadio);
        this.destroyComponent(this.distanceLeftBox);
        this.destroyComponent(this.distanceRightBox);
        this.destroyComponent(this.distanceTopBox);
        this.destroyComponent(this.distanceBottomBox);
        this.destroyComponent(this.scaleHeightBox);
        this.destroyComponent(this.scaleWidthBox);
        this.destroyComponent(this.lockAspectRatio);
        this.removeElement(this.target);
        this.removeElement(this.positionTarget);
        this.target = undefined;
        this.positionTarget = undefined;
        this.nameInput = undefined;
        this.contentInput = undefined;
        this.documentHelper = undefined;
        this.options = undefined;
    }
}
