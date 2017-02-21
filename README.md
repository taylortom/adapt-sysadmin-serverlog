# adapt-serverLog

This is an Adapt **authoring tool plugin** which displays the server log messages.

The feature is accessed from the [System info](https://github.com/taylortom/adapt-systemInfo) sidebar.

Features:
- Log messages can be filtered by type
- Adds support for logging to the database (MongoDB only)

## Installation

1. Copy all sub-folders in `/routes/` to `/routes/` in your authoring tool folder.
2. Copy all sub-folders in `/frontend/` to `/frontend/src/plugins/` in your authoring tool folder.
3. Copy contents of `/schema/` to `lib/dml/schema/system/`

## Dependencies

- [adapt-systemInfo](https://github.com/taylortom/adapt-systemInfo)
