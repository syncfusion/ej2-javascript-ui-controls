# Changelog

## [Unreleased]

## 35.1.42 (2026-10-27)

### Calculate

#### Bug fixes

- `#I881881` - Issue with "spreadsheet formula calculations returning corrupted text when an `IF` formula used the `&` operator to concatenate text with a nested `TEXT` function result" has been resolved.

## 35.1.41 (2026-10-20)

### Calculate

#### Bug fixes

- `#I877983` - Issue with "the package entry point causing Common JS `require` to fail" has been resolved.
- `#I878460` - Issue with "nested `IF` formula text values containing a colon being incorrectly treated as cell ranges, resulting in a `#NAME!` error" has been resolved.

## 35.1.39 (2026-10-07)

### Calculate

#### Bug fixes

- `#I872748` - Issue with "`VLOOKUP` formulas not being calculated properly when they contain inline table array values" has been resolved.