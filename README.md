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

## Extension Settings

none

## Known Issues

- Cannot double click to select a word.

## Release Notes

See [CHANGELOG.md](CHANGELOG.md)

## Inspired By

This extension is inspired by [sgryjp/japanese-word-handler](https://github.com/sgryjp/japanese-word-handler).
