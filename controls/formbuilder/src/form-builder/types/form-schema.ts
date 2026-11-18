import { ComponentCategory, CustomFormTemplate } from "../model/base";

/**
 * @private
 */
export interface PaletteComponent {
  /** The type identifier of the component (e.g., 'textbox', 'dropdown') */
  type: string;

  /** Display label shown in the palette UI */
  label: string;

  /** Optional CSS icon class for the component representation in the palette */
  icon?: string;

  /** Category grouping for the palette ('basic', 'layout', 'advanced', 'data', or 'templates') */
  category?: 'basic' | 'layout' | 'advanced' | 'data' | 'templates';

  /** Indicates if this palette item is a pre-defined template */
  isTemplate?: boolean;

  /** Template data associated with the item, if `isTemplate` is true */
  templateData?: CustomFormTemplate;
}

/**
 * Minimal representation of a palette item, containing only the component type.
 * @private
 */
export type PaletteItem = Pick<PaletteComponent, 'type'>;

/** @private */
export interface LocalNavigator extends Navigator {
  clipboard: any;
}
