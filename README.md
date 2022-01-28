# adapt-sysadmin-serverlog

This is an Adapt **authoring tool plugin** which displays the server log messages.

The feature is accessed from the [sysadmin](https://github.com/taylortom/adapt-sysadmin) page.

Features:
- Log messages can be filtered by type
- Adds support for logging to the database (MongoDB only)

## Installation

1. Copy all sub-folders in `/routes/` to `/routes/` in your authoring tool folder.
2. Copy all sub-folders in `/frontend/` to `/frontend/src/plugins/` in your authoring tool folder.

## Dependencies

I recommend looking at the winston-mongodb README for information about compatibility, but I’ve had success with v2 of winston and v3.0.2 of winston-mongodb.

- [adapt-sysadmin](https://github.com/taylortom/adapt-sysadmin)
- [winston-mongodb](https://github.com/winstonjs/winston-mongodb) NPM module
