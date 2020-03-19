# Changelog

## [Unreleased]

## 17.4.41 (2020-01-07)

### DataManager

#### Bug Fixes

- `258307` - Expand property is now properly added to the Query class in `ODataV4Adaptor`.

## 17.3.26 (2019-11-05)

### DataManager

#### Bug Fixes

- `252550` - DataManager performance issue has been fixed.
- `251226`, `252997` - Complex field primary key column is not working while the column type is string.

## 17.3.19 (2019-10-22)

### DataManager

#### Bug Fixes

- `250531`, `148065`, `251052` - Date time values are now properly `serialized`.

## 17.3.14 (2019-10-03)

### DataManager

#### Breaking Changes

- `#235197`, `#249206` - By default UTC time zone values are converted into local time zones without the use of `serverTimezoneOffset`.

## 17.2.39 (2019-07-30)

### DataManager

#### Bug Fixes

- `242189` - CRUD Operations now function properly when using Batch Edit mode in `OdataV4Adaptor`.
- Support to enable or disable the date object parsing with `serverTimeZoneOffset` is now handled with `timeZoneHandling` property or `DataUtil.timeZoneHandling` globally.

## 17.2.36 (2019-07-24)

### DataManager

#### Bug Fixes

- `241939` - In Predicate or function , Date type has been added to give support for filtering Date values.

## 17.2.35 (2019-07-17)

### DataManager

#### Bug Fixes

- `#144418`, `#234444`, `#238765`, `#241262`, `#241163` - Date value is handled based on the server time zone offset.

## 17.2.28-beta (2019-06-27)

### DataManager

#### Bug Fixes

- #237039 - Delete operation is working properly when date column is assigned as primary key field.

## 17.1.50 (2019-06-04)

### DataManager

#### Bug Fixes

- #233040- Provided support to get the service root url from `odata` context field to use during batch operation.

## 17.1.41 (2019-04-16)

### DataManager

#### Bug Fixes

- #226615- Script error thrown in `UrlAdaptor` when `saveChanges` method is called without Query is resolved.

## 16.4.52 (2019-02-05)

### DataManager

#### Bug Fixes

- Provided `addParams` CRUD support in `RemoteSaveAdaptor`.
- Need to parse the server response data in `UrlAdaptor` is resolved.
- Provided option in `DataManger` to define CRUD url in `OdataV4Adaptor` in Grid all edit modes.
- Additional parameters should be send in `params` property is fixed.

## 16.4.48 (2019-01-22)

### DataManager

#### Bug Fixes

- Provided `addParams` CRUD support in `RemoteSaveAdaptor`.
- Need to parse the server response data in `UrlAdaptor` is resolved.

## 16.4.47 (2019-01-16)

### DataManager

#### Bug Fixes

- Provided option in `DataManger` to define CRUD url in `OdataV4Adaptor` in Grid all edit modes.

## 16.4.45 (2019-01-02)

### DataManager

#### Bug Fixes

- Additional parameters should be send in `params` property is fixed.

## 16.4.40-beta (2018-12-10)

### DataManager

#### Bug Fixes

- Script error thrown in `batch-deleting` while server returns no data is resolved.
- Provided option in `DataManger` to define CRUD url in `OdataV4Adaptor`.

## 16.3.30 (2018-11-01)

### DataManager

#### Bug Fixes

- Filter value is not encoded properly in `WebApiAdaptor` is resolved.

## 16.3.27 (2018-10-23)

### DataManager

#### Bug Fixes

- Script error while parsing the ODataV4 batch response is fixed.

## 16.3.25 (2018-10-15)

### DataManager

#### Bug Fixes

  `ODataV4` - Skip the `expand` and `select` when using `$apply` query
  `range delete support` - Provided the support for range delete in batch mode.

## 16.3.24 (2018-10-09)

### DataManager

#### Bug Fixes

- `addParams` is not properly sent while performing `crud` fixed.

## 16.3.22 (2018-09-25)

### DataManager

#### Bug Fixes

- `ODataV4` - Added get distinct data support using `groupby` option.

## 16.3.21 (2018-09-22)

### DataManager

#### Bug Fixes

- `ODataV4` - Now `ETag` information is skipped while perform PATCH update.
- `ODataV4` - Using `Guid` key field failed issue resolved.

## 16.2.51 (2018-09-04)

### DataManager

#### Bug Fixes

- `ODataV4` - Added `ETag` information for CRUD operations.

## 16.2.50 (2018-08-28)

### DataManager

#### Bug Fixes

- `ODataV4` - Added `ETag` information for CRUD operations.
- `ODataV4` - Resolved `404 Not Found` error, during update and delete when having string value as primary key.

## 16.2.49 (2018-08-21)

### DataManager

#### Bug Fixes

- `RemoteSaveAdaptor` - Provide support to use the updated records.

## 16.2.48 (2018-08-14)

### DataManager

#### Bug Fixes

- `ODataV4` - Script error when using local time zone offset fixed.
- `ODataV4` - Multiple select query in expanded entity is not proper fixed.

## 16.2.47 (2018-08-07)

### DataManager

#### Bug Fixes

- `ODataV4` - Provided support to send date with time zone offset.
- `ODataV4` - Added `ETag` information while performing CRUD operations.
- `ODataV4` - Getting undefined promise object in update and insert action is fixed.
- `ODataV4` - Added expand query while using complex field selecting.
- Sending server request undefined `url` property is fixed.

## 16.2.46 (2018-07-30)

### DataManager

#### Bug Fixes

- `ODataV4` - Added preference header information while performing CRUD operations.
- `ODataV4` - Changed update type from `PUT` to `PATCH` and provided option to change type.

#### Breaking Changes

- To conform `ODataV4` standard, now update operation uses `PATCH` type instead of `PUT`. It can be changed using `updateType` option of the `ODataV4Adaptor`.

## 16.2.45 (2018-07-17)

### DataManager

#### Bug Fixes

- Predicate and shows type error with date object.

## 16.2.43 (2018-07-03)

### DataManager

#### Bug Fixes

- Grouping by format is resolved.

## 16.1.42 (2018-05-15)

### DataManager

#### Bug Fixes

- Provide ignore accent support for Search feature.

## 16.1.39 (2018-05-05)

### DataManager

#### Bug Fixes

- Memory leak issue resolved.

## 16.1.32 (2018-03-29)

### DataManager

#### Bug Fixes

- In `RemoteSaveAdaptor` insert and delete operations are not performed locally issue resolved.

## 16.1.28 (2018-03-09)

### DataManager

#### Bug Fixes

- `saveChanges` & `update` method promise arguments changed.

## 15.4.30-preview (2018-02-14)

### DataManager

#### New Features

- Diacritic filtering support added.

## 15.4.23-preview (2017-12-27)

### DataManager

#### New Features

- Added typing file for ES5 global scripts (`dist/global/index.d.ts`)

#### Breaking Changes

- Modified the module bundle file name for ES6 bundling

## 15.4.22-preview (2017-12-14)

### DataManager

#### New Features

- Upgraded TypeScript version to 2.6.2

#### Bug Fixes

- Renamed `Query.requireCounts` property as `Query.isCountRequired`.
- Promise uncaught error for failure cases fixed.

## 15.4.17-preview (2017-11-13)

### DataManager

DataManager communicates with data source and returns the desired result based on the Query provided.

- **Query** – DataManager have APIs for generating JavaScript data query with ease.
- **CRUD in individual requests and Batch** – CRUD operations are fully supported.
 The options are enabled to commit the data as a single or multiple requests.
- **Adaptors** – Adaptors are specific dataSource type interfaces that are used by
  DataManager to communicate with DataSource.
  DataManager have three in-built adaptors. They are, ODataAdaptor, JsonAdaptor and UrlAdaptor.
- Calculates and maintains aggregates, sorting order and paging.
