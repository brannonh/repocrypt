# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Types of Changes

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

## [Unreleased]

### Fixed

- Addressed issue writing a file as an entry in <sources>.

## [0.5.2] - 2024-06-17

### Fixed

- Stopped generating invalid secrets.

## [0.5.1] - 2024-06-17

### Fixed

- Stopped HTML-encoding of entities in config secrets.

## [0.5.0] - 2024-06-17

### Added

- Added force (`--force`, `-f`) option for every command.

### Changed

- Improved logging around commands.

## [0.4.1] - 2024-06-17

### Fixed

- Config template was in the wrong location.

## [0.4.0] - 2024-06-17

### Added

- Added `repocrypt init` command to generate configuration file.

## [0.3.0] - 2024-06-17

### Changed

- Updated prompts for better visibility of affected files.

### Fixed

- Updated config file extension for CommonJS.

## [0.2.0] - 2024-06-17

### Fixed

- Addressed build issues.

## [0.1.0] - 2024-06-14

### Added

- Added `release-it` to the release process.

### Changed

- Updated README.md.

## [0.0.1] - 2024-06-14

### Added

- Released.

[unreleased]: https://github.com/brannonh/repocrypt/compare/v0.5.2...HEAD
[0.1.0]: https://github.com/brannonh/repocrypt/releases/tag/v0.1.0
[0.0.1]: https://github.com/brannonh/repocrypt/releases/tag/v0.0.1

[0.5.2]: https://github.com/brannonh/repocrypt/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/brannonh/repocrypt/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/brannonh/repocrypt/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/brannonh/repocrypt/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/brannonh/repocrypt/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/brannonh/repocrypt/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/brannonh/repocrypt/releases/tag/v0.2.0
