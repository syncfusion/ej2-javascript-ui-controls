# Changelog

## [Unreleased]

## 16.4.40-beta (2018-12-10)

### DataManager

#### Bug Fixes

- Script error thrown in `batch-deleting` while server returns no data is resolved.
- Provided option in `DataManger` to define CRUD url in `OdataV4Adaptor`.

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
