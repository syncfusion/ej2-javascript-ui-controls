/**
 * @private
 */
export interface MinMaxRangeItem {
  enabled: boolean;
  minValue?: number | string | { field: string };
  maxValue?: number | string | { field: string };
}

/**
 * @private
 */
export interface MinMaxConstraints {
  minValue?: number | string;
  maxValue?: number | string;
  minDate?: string;
  maxDate?: string;
  minTime?: string;
  maxTime?: string;
}
/**
 * Extract min/max constraints from minMaxRange array
 * @private
 */
export class MinMaxRuleEngine {
  /**
   * Extract min/max constraints from minMaxRange array
   * Handles three cases:
   * 1. Direct values (enabled: false)
   * 2. Single field reference (enabled: true, 1 range)
   * 3. Multiple ranges (enabled: true, 2+ ranges) - takes UTMOST
   * @private
   * @param minMaxRange - Array of range configurations
   * @param formValues - Current form state values (id → value)
   * @param componentType - 'number' | 'date' | 'dateRange'
   * @returns Constraints object with appropriate keys
   */
  static getConstraints(
    minMaxRange: MinMaxRangeItem[] | undefined,
    formValues: Record<string, any>,
    componentType: string = 'number'
  ): MinMaxConstraints {
    // No ranges provided
    if (!minMaxRange || minMaxRange.length === 0) {
      return this.getEmptyConstraints(componentType);
    }

    // First, check for CASE 1: Direct values (enabled: false)
    const directValueRange = minMaxRange.find(range => range.enabled === false);
    if (directValueRange) {
      // Use direct values without field lookup
      const minValue = this.resolveValue(directValueRange.minValue, {});
      const maxValue = this.resolveValue(directValueRange.maxValue, {});

      if (componentType === 'date' || componentType === 'dateRange') {
        return {
          minValue: undefined,
          maxValue: undefined,
          minDate: minValue,
          maxDate: maxValue,
          minTime: undefined,
          maxTime: undefined
        };
      }

      if (componentType === 'time') {
        return {
          minValue: undefined,
          maxValue: undefined,
          minDate: undefined,
          maxDate: undefined,
          minTime: minValue,
          maxTime: maxValue
        };
      }

      return {
        minValue,
        maxValue,
        minDate: undefined,
        maxDate: undefined,
        minTime: undefined,
        maxTime: undefined
      };
    }

    // CASE 2 & 3: Field references (enabled: true)
    const enabledRanges = minMaxRange.filter(range => range.enabled === true);

    // No enabled ranges - return empty
    if (enabledRanges.length === 0) {
      return this.getEmptyConstraints(componentType);
    }

    // Extract resolved values from each enabled range
    const resolvedRanges = enabledRanges
      .map(range => ({
        min: this.resolveValue(range.minValue, formValues),
        max: this.resolveValue(range.maxValue, formValues)
      }))
      .filter(range => range.min !== undefined || range.max !== undefined);

    // No valid ranges
    if (resolvedRanges.length === 0) {
      return this.getEmptyConstraints(componentType);
    }

    // Combine multiple ranges using UTMOST (most permissive)
    const finalMin = this.getPermissiveMin(resolvedRanges, componentType);
    const finalMax = this.getPermissiveMax(resolvedRanges, componentType);

    // Return appropriate keys based on component type
    if (componentType === 'date' || componentType === 'dateRange') {
      return {
        minValue: undefined,
        maxValue: undefined,
        minDate: finalMin,
        maxDate: finalMax,
        minTime: undefined,
        maxTime: undefined
      };
    }

    if (componentType === 'time') {
      return {
        minValue: undefined,
        maxValue: undefined,
        minDate: undefined,
        maxDate: undefined,
        minTime: finalMin,
        maxTime: finalMax
      };
    }

    return {
      minValue: finalMin,
      maxValue: finalMax,
      minDate: undefined,
      maxDate: undefined,
      minTime: undefined,
      maxTime: undefined
    };
  }

  /**
   * Resolve a single value - either direct or field reference
   *
   * @param value - Direct value or field reference object
   * @param formValues - Form state values for field lookup
   * @returns Resolved value or undefined
   */
  private static resolveValue(
    value: any,
    formValues: Record<string, any>
  ): any {
    // Direct value (number or string)
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      return value;
    }

    // Field reference object
    if (value && typeof value === 'object' && value.field) {
      const fieldId = value.field;
      const fieldValue = formValues[fieldId as string];
      return fieldValue !== undefined ? fieldValue : undefined;
    }

    return undefined;
  }

  /**
   * Get the most permissive (widest) minimum value
   * For numbers: MIN of all mins
   * For dates: earliest date (MIN string comparison on ISO format)
   * For times: earliest time (MIN string comparison on 24-hour format)
   *
   * @param ranges - Array of {min, max} values
   * @param componentType - Type of component
   * @returns Most permissive minimum value
   */
  private static getPermissiveMin(
    ranges: Array<{ min: any; max: any }>,
    componentType: string
  ): any {
    if (ranges.length === 0) return undefined;

    if (componentType === 'date' || componentType === 'dateRange') {
      // For dates, find earliest (minimum) date
      return ranges.reduce((earliest: any, current: { min: any; max: any }) => {
        if (!current.min) return earliest;
        if (!earliest) return current.min;

        const earliestIso = this.convertToISO(earliest);
        const currentIso = this.convertToISO(current.min);

        return currentIso < earliestIso ? current.min : earliest;
      }, undefined as any);
    }

    if (componentType === 'time') {
      // For times, find earliest (minimum) time
      return ranges.reduce((earliest: any, current: { min: any; max: any }) => {
        if (!current.min) return earliest;
        if (!earliest) return current.min;

        const earliest24 = this.convertTimeTo24Hour(earliest);
        const current24 = this.convertTimeTo24Hour(current.min);

        return current24 < earliest24 ? current.min : earliest;
      }, undefined as any);
    }

    // For numbers, find minimum (skip undefined values)
    const minValues = ranges.map(r => r.min).filter(v => v !== undefined);
    return minValues.length > 0 ? Math.min(...minValues) : undefined;
  }

  /**
   * Get the most permissive (widest) maximum value
   * For numbers: MAX of all maxs
   * For dates: latest date (MAX string comparison on ISO format)
   * For times: latest time (MAX string comparison on 24-hour format)
   *
   * @param ranges - Array of {min, max} values
   * @param componentType - Type of component
   * @returns Most permissive maximum value
   */
  private static getPermissiveMax(
    ranges: Array<{ min: any; max: any }>,
    componentType: string
  ): any {
    if (ranges.length === 0) return undefined;

    if (componentType === 'date' || componentType === 'dateRange') {
      // For dates, find latest (maximum) date
      return ranges.reduce((latest: any, current: { min: any; max: any }) => {
        if (!current.max) return latest;
        if (!latest) return current.max;

        const latestIso = this.convertToISO(latest);
        const currentIso = this.convertToISO(current.max);

        return currentIso > latestIso ? current.max : latest;
      }, undefined as any);
    }

    if (componentType === 'time') {
      // For times, find latest (maximum) time
      return ranges.reduce((latest: any, current: { min: any; max: any }) => {
        if (!current.max) return latest;
        if (!latest) return current.max;

        const latest24 = this.convertTimeTo24Hour(latest);
        const current24 = this.convertTimeTo24Hour(current.max);

        return current24 > latest24 ? current.max : latest;
      }, undefined as any);
    }

    // For numbers, find maximum (skip undefined values)
    const maxValues = ranges.map(r => r.max).filter(v => v !== undefined);
    return maxValues.length > 0 ? Math.max(...maxValues) : undefined;
  }

  /**
   * Convert MM/DD/YYYY date format to ISO (YYYY-MM-DD) for comparison
   * Handles both formats gracefully
   *
   * @param dateString - Date in MM/DD/YYYY or ISO format
   * @returns ISO date string (YYYY-MM-DD)
   */
  private static convertToISO(dateString: string): string {
    if (!dateString) return '';
    // Already ISO format (YYYY-MM-DD)
    if (dateString.includes('-') && dateString.length === 10) {
      return dateString;
    }
    // MM/DD/YYYY format
    if (dateString.indexOf('/') !== -1) {
      const parts: string[] = dateString.split('/');
      const month: string = parts[0];
      const day: string = parts[1];
      const year: string = parts[2];
      if (!month || !day || !year) return dateString;

      const monthPadded: string = month.length < 2 ? '0' + month : month;
      const dayPadded: string = day.length < 2 ? '0' + day : day;
      return `${year}-${monthPadded}-${dayPadded}`;
    }

    return dateString;
  }

  /**
   * Convert 12-hour time format to 24-hour format for comparison
   * Handles both 12-hour (hh:mm a) and 24-hour (HH:mm) formats
   *
   * @param timeString - Time in 12-hour (hh:mm a/p) or 24-hour (HH:mm) format
   * @returns 24-hour format time string (HH:mm)
   */
  private static convertTimeTo24Hour(timeString: string): string {
    if (!timeString) return '';

    // Check if it contains AM/PM (12-hour format)
    const isPM = /PM/i.test(timeString);
    const isAM = /AM/i.test(timeString);

    if (isAM || isPM) {
      // Extract time part (before AM/PM)
      const timePart = timeString.replace(/\s*(AM|PM)/i, '').trim();
      const [hours, minutes] = timePart.split(':');

      if (!hours || !minutes) return timeString;

      let hour = parseInt(hours, 10);

      if (isPM && hour !== 12) {
        hour += 12; // Convert PM hours (except 12) to 24-hour
      } else if (isAM && hour === 12) {
        hour = 0; // Convert 12 AM to 00:00
      }

      const hourStr: string = String(hour);
      const hourPadded: string = hourStr.length < 2 ? '0' + hourStr : hourStr;
      return `${hourPadded}:${minutes}`;
    }

    // Already in 24-hour format or unknown format
    return timeString;
  }

  /**
   * Get empty constraints object based on component type
   */
  private static getEmptyConstraints(componentType: string): MinMaxConstraints {
    if (componentType === 'date' || componentType === 'dateRange') {
      return {
        minValue: undefined,
        maxValue: undefined,
        minDate: undefined,
        maxDate: undefined,
        minTime: undefined,
        maxTime: undefined
      };
    }

    if (componentType === 'time') {
      return {
        minValue: undefined,
        maxValue: undefined,
        minDate: undefined,
        maxDate: undefined,
        minTime: undefined,
        maxTime: undefined
      };
    }

    return {
      minValue: undefined,
      maxValue: undefined,
      minDate: undefined,
      maxDate: undefined,
      minTime: undefined,
      maxTime: undefined
    };
  }

  /**
   * Validate if a value passes all min/max constraints (optional)
   * Can be used for client-side validation before submission
   *
   * @param value - Value to validate
   * @param constraints - Constraints to check against
   * @param componentType - Type of component
   * @returns Validation result with error message if invalid
   */
  static validateValue(
    value: any,
    constraints: MinMaxConstraints,
    componentType: string
  ): { isValid: boolean; error?: string } {
    if (value === undefined || value === null || value === '') {
      return { isValid: true }; // Empty values pass (required handled separately)
    }

    if (componentType === 'date' || componentType === 'dateRange') {
      if (constraints.minDate) {
        const minIso = this.convertToISO(constraints.minDate);
        const valueIso = this.convertToISO(value);

        if (valueIso < minIso) {
          return { isValid: false, error: `Date must be on or after ${constraints.minDate}` };
        }
      }

      if (constraints.maxDate) {
        const maxIso = this.convertToISO(constraints.maxDate);
        const valueIso = this.convertToISO(value);

        if (valueIso > maxIso) {
          return { isValid: false, error: `Date must be on or before ${constraints.maxDate}` };
        }
      }
    } else if (componentType === 'time') {
      if (constraints.minTime) {
        if (value < constraints.minTime) {
          return { isValid: false, error: `Time must be on or after ${constraints.minTime}` };
        }
      }

      if (constraints.maxTime) {
        if (value > constraints.maxTime) {
          return { isValid: false, error: `Time must be on or before ${constraints.maxTime}` };
        }
      }
    } else {
      // Number type
      const numValue = Number(value);

      if (constraints.minValue !== undefined) {
        const minNum = Number(constraints.minValue);
        if (numValue < minNum) {
          return {
            isValid: false,
            error: `Value must be at least ${constraints.minValue}`
          };
        }
      }

      if (constraints.maxValue !== undefined) {
        const maxNum = Number(constraints.maxValue);
        if (numValue > maxNum) {
          return {
            isValid: false,
            error: `Value must be at most ${constraints.maxValue}`
          };
        }
      }
    }

    return { isValid: true };
  }
}
