# Word Divider

[![Format](https://github.com/yutotnh/word-divider/actions/workflows/format.yml/badge.svg)](https://github.com/yutotnh/word-divider/actions/workflows/format.yml)
[![Lint](https://github.com/yutotnh/word-divider/actions/workflows/lint.yml/badge.svg)](https://github.com/yutotnh/word-divider/actions/workflows/lint.yml)
[![Publish](https://github.com/yutotnh/word-divider/actions/workflows/publish.yml/badge.svg)](https://github.com/yutotnh/word-divider/actions/workflows/publish.yml)
[![Test](https://github.com/yutotnh/word-divider/actions/workflows/test.yml/badge.svg)](https://github.com/yutotnh/word-divider/actions/workflows/test.yml)
[![CodeQL](https://github.com/yutotnh/word-divider/actions/workflows/codeql.yml/badge.svg)](https://github.com/yutotnh/word-divider/actions/workflows/codeql.yml)

[![Create package](https://github.com/yutotnh/word-divider/actions/workflows/package.yml/badge.svg)](https://github.com/yutotnh/word-divider/actions/workflows/package.yml)
[![Dependency Review](https://github.com/yutotnh/word-divider/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/yutotnh/word-divider/actions/workflows/dependency-review.yml)
[![Dev Containers](https://github.com/yutotnh/word-divider/actions/workflows/devcontainer.yml/badge.svg)](https://github.com/yutotnh/word-divider/actions/workflows/devcontainer.yml)

Enable cursor movement in Japanese sentences on a word-by-word basis.

![examples](./docs/examples.gif)

## Features

| Command                               | Keybinding for Windows and Linux | Keybinding for Mac | Command to be overwritten | Description                      |
| ------------------------------------- | -------------------------------- | ------------------ | ------------------------- | -------------------------------- |
| word-divider.cursorWordLeft           | `Ctrl`+`LeftArrow`               | `⌥` `←`            | cursorWordLeft            | Move cursor to the previous word |
| word-divider.cursorWordEndRight       | `Ctrl`+`RightArrow`              | `⌥` `→`            | cursorWordEndRight        | Move cursor to the next word     |
| word-divider.cursorWordLeftSelect     | `Ctrl`+`Shift`+`LeftArrow`       | `⇧` `⌥` `←`        | cursorWordLeftSelect      | Select the previous word         |
| word-divider.cursorWordEndRightSelect | `Ctrl`+`Shift`+`RightArrow`      | `⇧` `⌥` `→`        | cursorWordEndRightSelect  | Select the next word             |
| word-divider.deleteWordLeft           | `Ctrl`+`Backspace`               | `⌥` `Backspace`    | deleteWordLeft            | Remove the previous word         |
| word-divider.deleteWordEndRight       | `Ctrl`+`Delete`                  | `⌥` `Delete`       | deleteWordRight           | Remove the next word             |

## Differences from Japanese Word Handler

This extension is inspired by [sgryjp/japanese-word-handler](https://github.com/sgryjp/japanese-word-handler).

Japanese Word Handler move based on character type, while Word Divider move based on word recognition.

### Using Word Handler

![examples](./docs/examples.gif)

### Using Japanese Word Handler

While Word Divider divides `拡張機能` into `拡張` and `機能`, and `使うと` into `使う` and `と`, we can see that the Japanese word handler treats `拡張機能` as `拡張機能` and `使うと` as `使` and `と`.

![japanese word handler examples](./docs/examples-japanese-word-handler.gif)

## Extension Settings

none

## Known Issues

- Cannot double click to select a word. [#50](https://github.com/yutotnh/word-divider/issues/50)
- Cannot move word by word in SOURCE CONTROL message box. [#48](https://github.com/yutotnh/word-divider/issues/48)

## Release Notes

See [CHANGELOG.md](CHANGELOG.md)
