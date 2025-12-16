/**
 * Creates a function to validate dateTime components.
 *
 * @param {string} unitName - The name of the dateTime unit (e.g., 'day', 'month').
 * @param {number} min - The minimum allowable value for this unit.
 * @param {number} max - The maximum allowable value for this unit.
 * @returns {(function(string, number): void)} A function that validates a dateTime component.
 * @throws {Error} Throws an error if the value is not an integer or is out of bounds.
 */
export function _validateDateTimeComponent(unitName: string, min: number, max: number):
(dataType: string, value: number) => void {
    return function (dataType: string, value: number): void {
        if (!Number.isInteger(value)) {
            throw new Error(`Non-integral ${unitName} supplied to ${dataType}.`);
        }
        if (value > max) {
            throw new Error(`Encountered ${unitName} greater than ${max} in ${dataType}.`);
        }
        if (value < min) {
            throw new Error(`Encountered ${unitName} less than ${min} in ${dataType}.`);
        }
    };
}
/**
 * Determines if a given character code represents a general character in the ASCII range.
 *
 * @param {number} characterCode The character code to evaluate.
 * @returns {boolean} boolean - Returns true if the character code is in the ASCII range (0 - 127);
 * false otherwise.
 */
export function _isGeneralCharacter (characterCode: number): boolean {
    return (characterCode <= 0x7F);
}
/**
 * Evaluates whether the provided character code corresponds to a graphic character
 * within the standard ASCII range.
 *
 * @param {number} characterCode The character code to evaluate.
 * @returns {boolean} - Returns true if the character code represents a graphic character;
 * false if it does not.
 */
export function _isGraphicCharacter (characterCode: number): boolean {
    return (characterCode >= 0x20 && characterCode <= 0x7E);
}
/**
 * Checks if the provided character code corresponds to a printable character.
 *
 * @param {number} characterCode The character code to evaluate.
 * @returns {boolean} - Returns true if the character code is considered printable
 * according to the defined ranges and conditions; false otherwise.
 */
export function _isPrintableCharacter (characterCode: number): boolean {
    return (
        (characterCode >= 0x27 && characterCode <= 0x39 && characterCode !== 0x2A) // '()+,-./ AND 0 - 9 BUT NOT *
        || (characterCode >= 0x41 && characterCode <= 0x5A) // A - Z
        || (characterCode >= 0x61 && characterCode <= 0x7A) // a - z
        || (characterCode === 0x20) // SPACE
        || (characterCode === 0x3A) // :
        || (characterCode === 0x3D) // =
        || (characterCode === 0x3F) // ?
    );
}
/**
 * Validates the given date components to ensure they form a legitimate date.
 *
 * @param {string} dataType string - A descriptive label for the type of data being validated.
 * @param {number} year - The year part of the date, which must be a safe integer.
 * @param {number} month - The month part of the date, ranging from 0 (January) to 11 (December).
 * @param {number} date - The day part of the date, required to be a valid day in the given month.
 * @returns {void} This function does not return a value.
 * @throws Will throw an error if any components do not together make a valid date.
 */
export function _validateDate (
    dataType: string,
    year: number,
    month: number,
    date: number
): void {
    if (!Number.isSafeInteger(year)) {
        throw new Error(`Invalid year in ${dataType}`);
    }
    if (!Number.isSafeInteger(month)) {
        throw new Error(`Invalid month in ${dataType}`);
    }
    if (!Number.isSafeInteger(date) || (date < 1)) {
        throw new Error(`Invalid day in ${dataType}`);
    }
    switch (month) {
    case 0: // January
    case 2: // March
    case 4: // May
    case 6: // July
    case 7: // August
    case 9: // October
    case 11: { // December
        if (date > 31) {
            throw new Error(`Day > 31 encountered in ${dataType} with 31-day month.`);
        }
        break;
    }
    // 30-day months
    case 3: // April
    case 5: // June
    case 8: // September
    case 10: { // November
        if (date > 30) {
            throw new Error(`Day > 31 encountered in ${dataType} with 30-day month.`);
        }
        break;
    }
    case 1: {
        const isLeapYear: boolean = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
        if (isLeapYear) {
            if (date > 29) {
                throw new Error(
                    `Day > 29 encountered in ${dataType} with month of February in leap year.`);
            }
        } else if (date > 28) {
            throw new Error(
                `Day > 28 encountered in ${dataType} with month of February and non leap year.`);
        }
        break;
    }
    default:
        throw new Error(`Invalid month in ${dataType}`);
    }
}
/**
 * Validates the given time components to ensure they form a legitimate time.
 *
 * @param {string} dataType - A descriptive label for the type of data being validated.
 * @param {number} hours - The hour component of the time, which must be a safe integer from 0 to 23.
 * @param {number} minutes - The minute component of the time, which must be a safe integer from 0 to 59.
 * @param {number} seconds - The second component of the time, which must be a safe integer from 0 to 59.
 * @returns {void} This function does not return a value.
 * @throws Will throw an error if the time components do not form a valid time representation.
 */
export function _validateTime (
    dataType: string,
    hours: number,
    minutes: number,
    seconds: number
): void {
    if (!Number.isSafeInteger(hours)) {
        throw new Error(`Invalid hours in ${dataType}`);
    }
    if (!Number.isSafeInteger(minutes)) {
        throw new Error(`Invalid minutes in ${dataType}`);
    }
    if (!Number.isSafeInteger(seconds) || (seconds < 0)) {
        throw new Error(`Invalid seconds in ${dataType}`);
    }
    if (hours > 23) {
        throw new Error(`Hours > 23 encountered in ${dataType}.`);
    }
    if (minutes > 59) {
        throw new Error(`Minutes > 60 encountered in ${dataType}.`);
    }
    if (seconds > 59) {
        throw new Error(`Seconds > 60 encountered in ${dataType}.`);
    }
}
/**
 * Validates a full date and time specification to ensure it is legitimate.
 *
 * @param {string} dataType string - A descriptive label for the type of data being validated.
 * @param {number} year number - The year component of the date.
 * @param {number} month number - The month component of the date, 0-based (0 for January, 11 for December).
 * @param {number} date number - The day of the month.
 * @param {number} hours number - The hour component of the time.
 * @param {number} minutes number - The minute component of the time.
 * @param {number} seconds number - The second component of the time.
 * @returns {void} This function does not return a value.
 * @throws Will throw an error if any of the date or time components are invalid.
 */
export function _validateDateTime (
    dataType: string,
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number
): void {
    _validateDate(dataType, year, month, date);
    _validateTime(dataType, hours, minutes, seconds);
}
/**
 * Determines if the given character code corresponds to a numeric character
 * or a space character in the ASCII range.
 *
 * @param {number} characterCode number - The character code to evaluate.
 * @returns {boolean} - Returns true if the character code is a numeric character (0-9)
 * or a space; false otherwise.
 */
export function isNumericString (characterCode: number): boolean {
    return ((characterCode >= 0x30 && characterCode <= 0x39) || characterCode === 0x20);
}
