import { Draggable, isNullOrUndefined } from "@syncfusion/ej2-base";
import { Accordion, AccordionItemModel, Tab, TabItemModel } from "@syncfusion/ej2-navigations";
import { L10n } from "@syncfusion/ej2-base";
import { PaletteComponent } from "../../types/form-schema";
import { ComponentCategory, CustomFormTemplate, ToolboxCategoryConfig } from "../../model/base";
import { FormNode, generateId, generateName } from "@syncfusion/ej2-form-renderer";
import { defaultPalette } from "../../default-palette";
import {
  TextBoxIconSvg,
  TextAreaIconSvg,
  NumericIconSvg,
  EmailIconSvg,
  UrlIconSvg,
  PhoneIconSvg,
  PasswordIconSvg,
  CheckboxIconSvg,
  CheckboxGroupIconSvg,
  RadioIconSvg,
  DropdownIconSvg,
  MultiSelectIconSvg,
  ButtonIconSvg,
  DatePickerIconSvg,
  DateTimePickerIconSvg,
  TimePickerIconSvg,
  DateRangeIconSvg,
  SwitchIconSvg,
  SignatureIconSvg,
  RatingIconSvg,
  ImageEditorIconSvg,
  FileUploadIconSvg,
  RangeSliderIconSvg,
  ColorPickerIconSvg,
  InputMaskIconSvg,
  MessageIconSvg,
  PanelIconSvg,
  TableIconSvg,
  DataGridIconSvg,
  TabsIconSvg,
  TemplateIconSvg,
  CardIconSvg,
  SplitButtonIconSvg,
  RichTextEditorIconSvg,
  StaticHtmlIconSvg,
  LookupIconSvg,
  OrderNumberIconSvg,
} from "../icons/component-icons";
import { FieldDragStartEventArgs } from "../../form-builder";
import { extractTemplateComponents } from "./main-section";
import { ChangedEventArgs, TextBox } from "@syncfusion/ej2-inputs";

/** @private */
export interface LeftPaneProps {
  /** @private */
  className?: string;
  /** @private */
  templates?: CustomFormTemplate[];
  /** @private */
  paletteConfig?: ToolboxCategoryConfig;
  /** @private */
  mode?: "Simple" | "Developer";
  /** @private */
  locale?: string;
  /** @private */
  enableRtl?: boolean;
  /** @private */
  containerWidth?: number;
  /** @private */
  onDrop?: (
    component: FormNode,
    dropTargetIndex?: number | null,
    dropPosition?: "before" | "after" | null,
  ) => void;
  /** @private */
  onFieldDragStarted?: (args: FieldDragStartEventArgs) => void;
}

/** @private */
export var simpleModeHiddenTypes: Set<string> = new Set<string>([
  "splitButton",
  "imageEditor",
  "dataGrid",
  "richTextEditor",
  "lookup",
  "autoNumber",
  "colorPicker",
  "signature",
]);

/** @private */
export function floatFocus(args: Event): void {
  var target: HTMLElement = args.target as HTMLElement;
  if (target && target.parentElement) {
    target.parentElement.classList.add("e-input-focus");
  }
}

/** @private */
export function floatBlur(args: Event): void {
  var target: HTMLElement = args.target as HTMLElement;
  if (target && target.parentElement) {
    target.parentElement.classList.remove("e-input-focus");
  }
}


/** @private */
export function getIconMarkup(type: string): string {
  switch (type) {
    case "textbox":
      return TextBoxIconSvg;
    case "textarea":
      return TextAreaIconSvg;
    case "number":
      return NumericIconSvg;
    case "email":
      return EmailIconSvg;
    case "url":
      return UrlIconSvg;
    case "phone":
      return PhoneIconSvg;
    case "password":
      return PasswordIconSvg;
    case "checkbox":
      return CheckboxIconSvg;
    case "checkboxGroup":
      return CheckboxGroupIconSvg;

    case "radio":
      return RadioIconSvg;
    case "dropdown":
      return DropdownIconSvg;
    case "multiselect":
      return MultiSelectIconSvg;
    case "button":
      return ButtonIconSvg;
    case "date":
      return DatePickerIconSvg;
    case "dateTime":
      return DateTimePickerIconSvg;
    case "time":
      return TimePickerIconSvg;
    case "dateRange":
      return DateRangeIconSvg;
    case "switch":
      return SwitchIconSvg;
    case "signature":
      return SignatureIconSvg;
    case "rating":
      return RatingIconSvg;
    case "imageEditor":
      return ImageEditorIconSvg;
    case "fileUpload":
      return FileUploadIconSvg;
    case "rangeSlider":
      return RangeSliderIconSvg;
    case "colorPicker":
      return ColorPickerIconSvg;
    case "inputMask":
      return InputMaskIconSvg;
    case "message":
      return MessageIconSvg;
    case "panel":
      return PanelIconSvg;
    case "table":
      return TableIconSvg;
    case "dataGrid":
      return DataGridIconSvg;
    case "tabs":
      return TabsIconSvg;
    case "card":
      return CardIconSvg;
    case "splitButton":
      return SplitButtonIconSvg;
    case "richTextEditor":
      return RichTextEditorIconSvg;
    case "lookup":
      return LookupIconSvg;
    case "staticHtml":
      return StaticHtmlIconSvg;
    case "autoNumber":
      return OrderNumberIconSvg;
    case "template":
      return TemplateIconSvg;
    default:
      return "";
  }
}

/** @private */
export class LeftPane {
  /** @private */
  public element: HTMLElement;
  /** @private */
  public props: LeftPaneProps;
  private l10n: L10n;
  private accordionObj: Accordion | null;
  private draggableObj: Draggable | null;
  private tabObj: Tab | null;
  private cloneHelperElement: HTMLElement | null;
  private draggedComponent: PaletteComponent | null;
  private searchInput: string;
  private templateSearchInput: string;
  private showSplitView: boolean;
  private destroyed: boolean;
  private cloneTracker: boolean;

  constructor(element: HTMLElement, props: LeftPaneProps, l10n: L10n) {
    this.element = element;
    this.props = props;
    this.l10n = l10n;
    this.accordionObj = null;
    this.draggableObj = null;
    this.tabObj = null;
    this.cloneHelperElement = null;
    this.draggedComponent = null;
    this.searchInput = "";
    this.templateSearchInput = "";
    this.showSplitView = false;
    this.destroyed = false;
    this.render();
  }

  private isMobile(): boolean {
    return (this.props.containerWidth || 1024) <= 820;
  }

  private getPalette(): Record<string, PaletteComponent[]> {
    var merged: Record<string, PaletteComponent[]> = {};
    var defaultPaletteMap: Record<string, PaletteComponent[]> = defaultPalette as Record<
      string,
      PaletteComponent[]
    >;
    var paletteConfig: any = this.props.paletteConfig;
    var configuredCategories: any[] = Array.isArray(paletteConfig)
      ? paletteConfig
      : paletteConfig
        ? Object.keys(paletteConfig).map(function (category: string): any {
            return {
              category: category,
              items: paletteConfig[category]
            };
          })
        : [];
    Object.keys(defaultPaletteMap).forEach(function (key: string): void {
      merged[key as string] = defaultPaletteMap[key as string].slice();
    });
    configuredCategories.forEach(function (paletteCategory: any): void {
      if (!paletteCategory || !paletteCategory.category || !Array.isArray(paletteCategory.items)) {
        return;
      }
      if (!paletteCategory.items.length) {
        delete merged[paletteCategory.category];
        return;
      }
      merged[paletteCategory.category] = paletteCategory.items.map(function (item: any): PaletteComponent {
        return { type: typeof item === 'string' ? item : item.type, label: '' };
      });
    });
    if (this.props.mode === "Simple" && merged[ComponentCategory.Advanced]) {
      merged[ComponentCategory.Advanced] = merged[
        ComponentCategory.Advanced
      ].filter(function (comp: PaletteComponent): boolean {
        return !simpleModeHiddenTypes.has(comp.type);
      });
    }
    var result: Record<string, PaletteComponent[]> = {};
    Object.keys(merged).forEach(function (category: string): void {
      result[category as string] = (merged[category as string] || []).map(function (
        component: PaletteComponent,
      ): PaletteComponent {
        return {
          ...component,
          label:
            component.label ||
            this.l10n.getConstant(component.type) ||
            component.type,
        };
      }, this);
    }, this);
    return result;
  }

  private getComponentLabel(component: PaletteComponent): string {
    if (component.label) {
      return component.label;
    }
    return this.l10n.getConstant(component.type) || component.type;
  }

  private getBasicComponents(): PaletteComponent[] {
    var palette = this.getPalette();
    return palette[ComponentCategory.Basic] || [];
  }

  private getAdvancedComponents(): PaletteComponent[] {
    var palette = this.getPalette();
    return palette[ComponentCategory.Advanced] || [];
  }

  private getLayoutComponents(): PaletteComponent[] {
    var palette = this.getPalette();
    return palette[ComponentCategory.Layout] || [];
  }

  private getAllComponents(): PaletteComponent[] {
    var palette = this.getPalette();
    var components: PaletteComponent[] = [];
    Object.keys(palette).forEach(function (category: string): void {
      components = components.concat(palette[category as string] || []);
    });
    return components;
  }

  private getFilteredComponents(): PaletteComponent[] {
    if (!this.searchInput || !this.searchInput.trim()) {
      return [];
    }
    var search = this.searchInput.toLowerCase();
    return this.getAllComponents().filter(function (
      component: PaletteComponent,
    ): boolean {
      return (
        (component.label || "").toLowerCase().indexOf(search) >= 0 ||
        component.type.toLowerCase().indexOf(search) >= 0
      );
    });
  }

  private render(): void {
    this.element.innerHTML = "";
    if(this.props.className) {
      this.element.classList.add(this.props.className || "");
    }
    this.element.setAttribute(
      "aria-label",
      this.l10n.getConstant("fields") || "fields",
    );
    if (this.isMobile()) {
      this.element.classList.add("mobile-screen");
    }
    this.renderHeader();
    this.renderCloneHelper();
    this.initializeDraggable();
  }

  private renderHeader(): void {
    if (this.tabObj) {
      this.tabObj.destroy();
      this.tabObj = null;
    }
    var header = document.createElement("div");
    header.className = "left-pane-header";
    header.style.height = "100%";
    this.element.appendChild(header);
    var tabsHost: HTMLElement = document.createElement("div");
    tabsHost.className = "left-pane-tabs";
    header.appendChild(tabsHost);
    var items: TabItemModel[] = [
      {
        header: { text: this.l10n.getConstant("fields") || "Fields" },
        content: ""
      }
    ];
    if (this.props.mode === "Developer" && this.props.templates && this.props.templates.length > 0) {
      items.push({
        header: { text: this.l10n.getConstant("templates") || "Templates" },
        content: ""
      });
    }
    var self: LeftPane = this;
    this.tabObj = new Tab({
      items: items,
      enableRtl: this.props.enableRtl,
      loadOn: "Init",
      selectedItem: this.showSplitView && items.length > 1 ? 1 : 0,
      created: function (): void {
        self.populateTabContents();
      },
      selected: function (args: any): void {
        var idx: number =
          args && typeof args.selectedIndex === "number"
            ? args.selectedIndex
            : 0;
        self.showSplitView = idx === 1;
      }
    });
    this.tabObj.appendTo(tabsHost);
  }

  private populateTabContents(): void {
    if (!this.tabObj) {
      return;
    }
    var contentWrapper: HTMLElement | null = this.element.querySelector(
      ".e-content"
    );
    if (!contentWrapper) {
      return;
    }
    var items: TabItemModel[] = this.tabObj.items as TabItemModel[];
    for (var i: number = 0; i < items.length; i++) {
      var pane: HTMLElement | null = contentWrapper.children[
        i
      ] as HTMLElement | null;
      if (!pane) {
        continue;
      }
      var view: "fields" | "templates" =
        i === 1 && this.props.mode === "Developer"
          ? "templates"
          : "fields";
      this.renderBody(pane, view);
    }
  }

  private renderBody(
    host: HTMLElement,
    view: "fields" | "templates"
  ): void {
    host.classList.add("palette-container", "fb-scrollbar");
    this.renderSearchBox(host);
    var contentHost: HTMLElement = document.createElement("div");
    contentHost.className = "palette-content";
    host.appendChild(contentHost);
    if (view === "templates") {
      this.renderTemplates(contentHost);
    } else {
      this.renderFields(contentHost);
    }
  }

  private getActiveContentHost(): HTMLElement | null {
    if (!this.tabObj) {
      return null;
    }
    var contentWrapper: HTMLElement | null = this.element.querySelector(
      ".e-content"
    );
    if (!contentWrapper) {
      return null;
    }
    var activePane: HTMLElement | null = contentWrapper.querySelector(
      ".e-item.e-active"
    );
    if (!activePane) {
      var idx: number =
        typeof this.tabObj.selectedItem === "number"
          ? this.tabObj.selectedItem
          : 0;
      activePane = contentWrapper.children[idx] as HTMLElement | null;
    }
    if (!activePane) {
      return null;
    }
    return activePane.querySelector(".palette-content") as HTMLElement | null;
  }

  private rebuildActiveContent(): void {
    if (this.accordionObj) {
      this.accordionObj.destroy();
      this.accordionObj = null;
    }
    var contentHost: HTMLElement | null = this.getActiveContentHost();
    if (!contentHost) {
      return;
    }
    contentHost.innerHTML = "";
    var view: "fields" | "templates" = this.showSplitView
      ? "templates"
      : "fields";
    if (view === "templates") {
      this.renderTemplates(contentHost);
    } else {
      this.renderFields(contentHost);
    }
  }

  private renderSearchBox(container: HTMLElement): void {
    var group: HTMLElement = document.createElement("div");
    group.style.marginBottom = "10px";
    container.appendChild(group);
    var input: HTMLInputElement = document.createElement("input");
    input.type = "text";
    group.appendChild(input);
    let searchTextBox = new TextBox({
      placeholder: this.l10n.getConstant("search") || "Search",
      floatLabelType: "Never",
      value: this.showSplitView ? this.templateSearchInput : this.searchInput,
      change: this.handleSearchInput.bind(this),
      created: () => {
        searchTextBox.addIcon("append", "e-icons e-search");
      },
    });

    searchTextBox.appendTo(input);
    input.setAttribute(
      "aria-label",
      this.l10n.getConstant("search") || "Search",
    );
  }

  private renderFields(container: HTMLElement): void {
    if (this.searchInput && this.searchInput.trim()) {
      var items = this.getFilteredComponents();
      this.renderPaletteItems(container, items);
      return;
    }
    var palette = this.getPalette();
    var accordionHost = document.createElement("div");
    container.appendChild(accordionHost);
    var accordionItems: AccordionItemModel[] = [];
    var self: LeftPane = this;
    Object.keys(palette).forEach(function (category: string): void {
      var components = palette[category as string] || [];
      if (!components.length) {
        return;
      }
      var label = self.l10n.getConstant(category) || category;
      accordionItems.push({
        header: label,
        content: self.createCategoryHtml(components),
        expanded: accordionItems.length === 0,
      });
    });
    if (!accordionItems.length) {
      return;
    }
    this.accordionObj = new Accordion({
      expandMode: "Single",
      items: accordionItems as AccordionItemModel[],
      enableRtl: this.props.enableRtl,
      expanded: (): void => {
        this.wirePaletteHandlers(accordionHost);
      },
    });
    this.accordionObj.appendTo(accordionHost);
    this.wirePaletteHandlers(accordionHost);
  }

  private renderTemplates(container: HTMLElement): void {
    var host = document.createElement("div");
    host.className = "palette-items";
    host.setAttribute("role", "tabpanel");
    container.appendChild(host);
    var templates = this.getFilteredTemplates();
    if (!templates.length) {
      var empty = document.createElement("div");
      empty.setAttribute("role", "status");
      empty.setAttribute("aria-live", "polite");
      empty.innerHTML = "No templates found";
      host.appendChild(empty);
      return;
    }
    for (var i = 0; i < templates.length; i++) {
      var t = templates[i as number];
      var item = document.createElement("div");
      item.className = "palette-item template-item";
      item.tabIndex = 0;
      item.setAttribute("data-template-id", t.id);
      item.innerHTML =
        '<span class="palette-item-icon">' +
        TemplateIconSvg +
        "</span>" +
        '<span class="palette-item-label">' +
        (this.l10n.getConstant(t.id) || t.title) +
        "</span>";
      host.appendChild(item);
    }
    this.wirePaletteHandlers(host);
  }

  private renderPaletteItems(
    container: HTMLElement,
    components: PaletteComponent[],
  ): void {
    var host = document.createElement("div");
    host.className = "palette-items";
    container.appendChild(host);
    if (!components.length) {
      var empty = document.createElement("div");
      empty.setAttribute("role", "status");
      empty.setAttribute("aria-live", "polite");
      empty.innerHTML = "No results found";
      host.appendChild(empty);
      return;
    }
    for (var i = 0; i < components.length; i++) {
      host.appendChild(this.createPaletteItem(components[i as number]));
    }
  }

  private createPaletteItem(component: PaletteComponent): HTMLElement {
    var item = document.createElement("div");
    item.className = "palette-item";
    item.tabIndex = 0;
    item.setAttribute("data-component-type", component.type);
    item.setAttribute("aria-label", this.getComponentLabel(component));
    item.innerHTML =
      '<span class="palette-item-icon">' +
      getIconMarkup(component.type) +
      "</span>" +
      '<span class="palette-item-label">' +
      this.getComponentLabel(component) +
      "</span>";
    item.onclick = this.handlePaletteItemClick.bind(this, component);
    item.onkeydown = this.handlePaletteItemKeyDown.bind(this, component);
    return item;
  }

  private helper(args: any): HTMLElement {
    var target = args.sender.target as HTMLElement;
    var paletteItem = target.closest(".palette-item") as HTMLElement;
    if (!paletteItem) {
      return this.cloneHelperElement!;
    }
    //
    // TEMPLATE CASE
    //
    var templateId = paletteItem.getAttribute("data-template-id");
    var templates = this.props.templates || [];
    if (templateId && templates.length) {
      for (var t = 0; t < templates.length; t++) {
        if (templates[t as number].id === templateId) {
          this.draggedComponent = {
            type: "template",
            label: this.l10n.getConstant(templates[t as number].id) || templates[t as number].title,

            isTemplate: true,
            templateData: templates[t as number],
          } as any as PaletteComponent;
          return this.cloneHelperElement!;
        }
      }
    }
    //
    // COMPONENT CASE
    //
    var componentType = paletteItem.getAttribute("data-component-type");
    if (componentType) {
      var components = this.getAllComponents();
      for (var i = 0; i < components.length; i++) {
        if (components[i as number].type === componentType) {
          this.draggedComponent = components[i as number];
          break;
        }
      }
    }
    return this.cloneHelperElement!;
  }

  private syncDragStart(args: any): void {
    if (this.isMobile()) {
      args.cancel = true;
      return;
    }
    var dragTarget: Element | null = (args && (args.target as Element)) || null;
    var paletteItem: Element | null = dragTarget ? dragTarget.closest(".palette-item") : null;
    if (!paletteItem) {
      this.cloneTracker = false;
    }
    else {
      this.cloneTracker = true;
    }
    this.cloneHelperElement.style.display = "flex";
    var dc: any = this.draggedComponent as any;
    if (dc && dc.isTemplate === true) {
      this.cloneHelperElement.setAttribute(
        "data-template-json",
        JSON.stringify(dc),
      );
      this.cloneHelperElement.removeAttribute("data-component-json");
    } else {
      this.cloneHelperElement.setAttribute(
        "data-component-json",
        JSON.stringify(this.draggedComponent),
      );
      this.cloneHelperElement.removeAttribute("data-template-json");
    }
    var iconSpan = this.cloneHelperElement.querySelector(
      ".palette-item-icon",
    ) as HTMLElement;
    if (iconSpan) {
      if (dc && dc.isTemplate === true) {
        iconSpan.innerHTML = "";
      } else {
        var sourceItem = this.element.querySelector(
          '.palette-item[data-component-type="' + (dc && dc.type ? dc.type : '') + '"]',
        );
        var sourceIcon = sourceItem
          ? (sourceItem.querySelector(".palette-item-icon") as HTMLElement)
          : null;
        if (sourceIcon) {
          iconSpan.innerHTML = sourceIcon.innerHTML;
        } else {
          iconSpan.innerHTML = getIconMarkup(dc && dc.type ? dc.type : '');
        }
      }
    }
    var label = this.cloneHelperElement.querySelector(
      ".clone-label",
    ) as HTMLElement;
    if (label) {
      label.textContent = this.draggedComponent && this.draggedComponent.label ? this.draggedComponent.label: "";
    }
    if (this.props.onFieldDragStarted) {
      this.props.onFieldDragStarted({
        componentName: null,
        componentType: this.draggedComponent && this.draggedComponent.type ? this.draggedComponent.type : "",
        sourceContainerId: "palette",
        isNested: false,
      });
    }
  }

  private syncDrag(): void {
    if (this.cloneHelperElement && this.cloneTracker) {
      this.cloneHelperElement.style.opacity = "0.97";
       this.cloneHelperElement.classList.add('palette-item-clone');
    }
    else {
      this.cloneHelperElement.classList.remove('palette-item-clone');
    }
  }

  private syncDragStop(): void {
    var self = this;
    window.setTimeout(function (): void {
      if (self.cloneHelperElement) {
        self.cloneHelperElement.style.display = "none";
        self.cloneHelperElement.style.opacity = "0";
        self.cloneHelperElement.removeAttribute("data-component-json");
        self.cloneHelperElement.removeAttribute("data-template-json");
      }
    }, 100);
    this.draggedComponent = null;
  }

  private handlePaletteItemClick(component: PaletteComponent): void {
    if (!this.isMobile() || !this.props.onDrop) {
      return;
    }
    var newComponent: FormNode = {
      id: generateId(component.type as any),
      type: component.type as any,
      label: component.label || "",
      name: generateName(component.type as any),
    };
    this.props.onDrop(newComponent);
  }

  private handlePaletteItemKeyDown(
    component: PaletteComponent,
    e: KeyboardEvent,
  ): void {
    if (e.key !== "Enter") {
      return;
    }
    e.preventDefault();
    if (isNullOrUndefined(this.props.onDrop)) {
      return;
    }
    var newComponent: FormNode = {
      id: generateId(component.type as any),
      type: component.type as any,
      label: component.label || "",
      name: generateName(component.type as any),
    };
    this.props.onDrop(newComponent);
  }
  
  /** @private */
  public destroy(): void {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    if (this.draggableObj) {
      this.draggableObj.destroy();
      this.draggableObj = null;
    }
    if (this.accordionObj) {
      this.accordionObj.destroy();
      this.accordionObj = null;
    }
    if (this.tabObj) {
      this.tabObj.destroy();
      this.tabObj = null;
    }
    this.draggedComponent = null;
    this.cloneHelperElement = null;
    this.element.innerHTML = "";
  }

  private handleSearchInput(e: ChangedEventArgs): void {
    if (isNullOrUndefined(e.value)) {
      return;
    }
    if (this.showSplitView) {
      this.templateSearchInput = e.value;
    } else {
      this.searchInput = e.value;
    }
    this.rebuildActiveContent();
  }

  private getFilteredTemplates(): CustomFormTemplate[] {
    var templates = this.props.templates || [];
    if (!this.templateSearchInput || !this.templateSearchInput.trim()) {
      return templates;
    }
    var search = this.templateSearchInput.toLowerCase();
    return templates.filter(function (template: CustomFormTemplate): boolean {
      var localized = this.l10n.getConstant(template.id) || template.title;
      return (
        localized.toLowerCase().indexOf(search) >= 0 ||
        template.id.toLowerCase().indexOf(search) >= 0
      );
    }, this);
  }

  private createCategoryHtml(components: PaletteComponent[]): string {
    var html: string = '<div class="palette-items">';
    for (var i = 0; i < components.length; i++) {
      var component = components[i as number];
      html +=
        "<div " +
        'class="palette-item" ' +
        'tabindex="0" ' +
        'data-component-type="' +
        component.type +
        '" ' +
        'aria-label="' +
        this.getComponentLabel(component) +
        '">' +
        '<span class="palette-item-icon">' +
        getIconMarkup(component.type) +
        "</span>" +
        '<span class="palette-item-label">' +
        this.getComponentLabel(component) +
        "</span>" +
        "</div>";
    }
    html += "</div>";
    return html;
  }

  private wirePaletteHandlers(accordionHost: HTMLElement): void {
    var items = accordionHost.querySelectorAll(".palette-item");
    var self = this;
    for (var i = 0; i < items.length; i++) {
      (function (index: number) {
        var item = items[index as number] as HTMLElement;
        var type = item.getAttribute("data-component-type");
        var templateId = item.getAttribute("data-template-id");
        if (type) {
          var component = self.findPaletteComponent(type);
          if (!component) {
            return;
          }
          item.onclick = function (): void {
            self.handlePaletteItemClick(component);
          };
          item.onkeydown = function (e: KeyboardEvent): void {
            self.handlePaletteItemKeyDown(component, e);
          };
        } else if (templateId) {
          var template = self.findTemplateById(templateId);
          if (!template) {
            return;
          }
          item.onclick = function (): void {
            self.handleTemplateClick(template);
          };
          item.onkeydown = function (e: KeyboardEvent): void {
            self.handleTemplateKeyDown(template, e);
          };
        }
      })(i);
    }
  }

  private findPaletteComponent(type: string): PaletteComponent | null {
    var components = this.getAllComponents();
    for (var i = 0; i < components.length; i++) {
      if (components[i as number].type === type) {
        return components[i as number];
      }
    }
    return null;
  }

  private findTemplateById(id: string): CustomFormTemplate | null {
    var templates = this.props.templates || [];
    for (var i = 0; i < templates.length; i++) {
      if (templates[i as number].id === id) {
        return templates[i as number];
      }
    }
    return null;
  }

  private handleTemplateClick(template: CustomFormTemplate): void {
    if (!this.isMobile() || !this.props.onDrop) {
      return;
    }
    this.dropTemplate(template);
  }

  private handleTemplateKeyDown(
    template: CustomFormTemplate,
    e: KeyboardEvent,
  ): void {
    if (e.key !== "Enter" && e.key !== " " && e.code !== "Enter" && e.code !== "Space") {
      return;
    }
    e.preventDefault();
    this.dropTemplate(template);
  }

  private dropTemplate(template: CustomFormTemplate): void {
    if (!this.props.onDrop) {
      return;
    }
    const components: FormNode[] = extractTemplateComponents(template);
    for (let i = 0; i < components.length; i++) {
      this.props.onDrop(components[i as number]);
    }
  }

  private renderCloneHelper(): void {
    var helper = document.createElement("div");
    helper.className = "palette-item-clone";
    helper.setAttribute("aria-hidden", "true");
    helper.style.opacity = "0";
    helper.style.display = "none";
    helper.style.zIndex = "10000";
    helper.style.justifyContent = "center";
    helper.style.alignItems = "center";
    helper.style.gap = "8px";
    helper.style.height = "37px";
    helper.style.minWidth = "120px";
    helper.style.padding = "8px 12px";
    helper.style.borderRadius = "8px";
    helper.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    helper.style.pointerEvents = "none";
    helper.innerHTML =
      "<span " +
      'class="palette-item-icon">' +
      "</span>" +
      "<span " +
      'class="clone-label">' +
      "</span>";
    this.cloneHelperElement = helper;
    this.element.appendChild(helper);
  }

  private initializeDraggable(): void {
    if (this.draggableObj) {
      this.draggableObj = null;
    }
    var self: LeftPane = this;
    requestAnimationFrame(function (): void {
      if (self.destroyed) {
        return;
      }
      self.draggableObj = new Draggable(self.element, {
        clone: true,
        helper: self.helper.bind(self),
        dragStart: self.syncDragStart.bind(self),
        drag: self.syncDrag.bind(self),
        dragStop: self.syncDragStop.bind(self),
        enableTailMode: true,
        isPreventSelect: true,
      });
    });
  }

  private isBlockedInSimpleMode(type: string): boolean {
    return this.props.mode === "Simple" && simpleModeHiddenTypes.has(type);
  }
}
