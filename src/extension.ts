// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

let logOutputChannel: vscode.LogOutputChannel;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "word-divider" is now active!');

  const extensionDisplayName = "Word Divider";
  logOutputChannel = vscode.window.createOutputChannel(extensionDisplayName, {
    log: true,
  });

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "word-divider.cursorWordLeft",
      cursorWordLeft,
    ),
    vscode.commands.registerCommand(
      "word-divider.cursorWordEndRight",
      cursorWordEndRight,
    ),
    vscode.commands.registerCommand(
      "word-divider.cursorWordLeftSelect",
      cursorWordLeftSelect,
    ),
    vscode.commands.registerCommand(
      "word-divider.cursorWordEndRightSelect",
      cursorWordEndRightSelect,
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "word-divider.deleteWordLeft",
      deleteWordLeft,
    ),
  );
}

export function cursorWordLeft() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  editor.selections = editor.selections.map((selection) => {
    const position = selection.active;

    const line = position.line;
    const lineText = editor.document.lineAt(line).text;

    const segments = stringToSegments(
      splitByAll([lineText]),
      PURPOSE.selectLeft,
    );

    const wordLeftPos = wordLeftCharacter(segments, position.character);

    if (wordLeftPos === -1) {
      if (line === 0) {
        return selection;
      } else {
        const previousLine = line - 1;
        const lineText = editor.document.lineAt(previousLine).text;

        const segments = stringToSegments(
          splitByAll([lineText]),
          PURPOSE.selectLeft,
        );

        let wordLeftPos = wordLeftCharacter(segments, lineText.length);

        if (wordLeftPos === -1) {
          wordLeftPos = 0;
        }

        const newPosition = new vscode.Position(previousLine, wordLeftPos);

        const newSelection = new vscode.Selection(newPosition, newPosition);

        return newSelection;
      }
    }

    const newPosition = position.with({
      character: wordLeftPos,
    });

    const newSelection = new vscode.Selection(newPosition, newPosition);

    return newSelection;
  });
}

export function cursorWordEndRight() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  editor.selections = editor.selections.map((selection) => {
    const position = selection.active;

    const line = position.line;
    const lineText = editor.document.lineAt(line).text;

    const segments = stringToSegments(
      splitByAll([lineText]),
      PURPOSE.selectRight,
    );

    const wordEndRightPos = wordEndRightCharacter(segments, position.character);

    if (wordEndRightPos === -1) {
      if (line === editor.document.lineCount - 1) {
        return selection;
      } else {
        const nextLine = line + 1;
        const lineText = editor.document.lineAt(nextLine).text;

        const segments = stringToSegments(
          splitByAll([lineText]),
          PURPOSE.selectRight,
        );

        let wordEndRightPos = wordEndRightCharacter(segments, 0);

        if (wordEndRightPos === -1) {
          wordEndRightPos = lineText.length;
        }

        const newPosition = new vscode.Position(nextLine, wordEndRightPos);

        const newSelection = new vscode.Selection(newPosition, newPosition);

        return newSelection;
      }
    }

    const newPosition = position.with({
      character: wordEndRightPos,
    });

    const newSelection = new vscode.Selection(newPosition, newPosition);

    return newSelection;
  });
}

export function cursorWordLeftSelect() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  editor.selections = editor.selections.map((selection) => {
    const position = selection.active;

    const line = position.line;
    const lineText = editor.document.lineAt(line).text;

    const segments = stringToSegments(
      splitByAll([lineText]),
      PURPOSE.selectLeft,
    );

    const character = wordLeftCharacter(segments, position.character);

    if (character === -1) {
      if (line === 0) {
        return selection;
      } else {
        const previousLine = line - 1;
        const lineText = editor.document.lineAt(previousLine).text;

        const segments = stringToSegments(
          splitByAll([lineText]),
          PURPOSE.selectLeft,
        );

        let wordLeftPos = wordLeftCharacter(segments, lineText.length);

        if (wordLeftPos === -1) {
          wordLeftPos = 0;
        }

        const newPosition = new vscode.Position(previousLine, wordLeftPos);

        const newSelection = new vscode.Selection(
          selection.anchor,
          newPosition,
        );

        return newSelection;
      }
    }

    const newPosition = position.with({
      character: character,
    });

    const newSelection = new vscode.Selection(selection.anchor, newPosition);

    return newSelection;
  });
}

export function cursorWordEndRightSelect() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  editor.selections = editor.selections.map((selection) => {
    const position = selection.active;

    const line = position.line;
    const lineText = editor.document.lineAt(line).text;

    const segments = stringToSegments(
      splitByAll([lineText]),
      PURPOSE.selectRight,
    );

    const character = wordEndRightCharacter(segments, position.character);

    if (character === -1) {
      if (line === editor.document.lineCount - 1) {
        return selection;
      } else {
        const nextLine = line + 1;
        const lineText = editor.document.lineAt(nextLine).text;

        const segments = stringToSegments(
          splitByAll([lineText]),
          PURPOSE.selectRight,
        );

        let wordEndRightPos = wordEndRightCharacter(segments, 0);

        if (wordEndRightPos === -1) {
          wordEndRightPos = lineText.length;
        }

        const newPosition = new vscode.Position(nextLine, wordEndRightPos);

        const newSelection = new vscode.Selection(
          selection.anchor,
          newPosition,
        );

        return newSelection;
      }
    }

    const newPosition = position.with({
      character: character,
    });

    const newSelection = new vscode.Selection(selection.anchor, newPosition);

    return newSelection;
  });
}

export function deleteWordLeft() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  editor.selections.map((selection) => {
    const position = selection.active;

    if (selection.anchor.compareTo(selection.active)) {
      // 選択されている場合は、選択範囲を削除する
      editor.edit((editBuilder) => {
        editBuilder.delete(selection);
      });
      return;
    }

    const line = position.line;
    const lineText = editor.document.lineAt(line).text;

    const segments = stringToSegments(splitByAll([lineText]), PURPOSE.delete);

    const character = wordLeftCharacter(segments, position.character);

    if (character === -1) {
      if (line === 0) {
        return;
      } else {
        const previousLine = line - 1;
        const lineText = editor.document.lineAt(previousLine).text;

        const newPosition = new vscode.Position(previousLine, lineText.length);

        const newSelection = new vscode.Selection(
          selection.anchor,
          newPosition,
        );

        editor.edit((editBuilder) => {
          editBuilder.delete(newSelection);
        });

        return;
      }
    }

    const newPosition = position.with({
      character: character,
    });

    const newSelection = new vscode.Selection(selection.anchor, newPosition);

    editor.edit((editBuilder) => {
      editBuilder.delete(newSelection);
    });
    return;
  });
}

/**
 * 指定した位置から見た単語の先頭の位置を取得する
 * - 単語の先頭の位置がない場合は-1を返す
 * @param segments 文字列をSegmentに変換した配列
 * @param character 位置
 * @returns
 */
export function wordLeftCharacter(segments: Segment[], character: number) {
  if (character <= 0) {
    return -1;
  }

  let result = 0;
  let currentCharacter = 0;
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    if (segment.isWord) {
      if (currentCharacter < character) {
        result = currentCharacter;
      } else {
        return result;
      }
    }

    currentCharacter += segment.segment.length;
  }

  return result;
}

/**
 * 指定した位置から見た単語の終わりの位置を取得する
 * - 単語の終わりの位置がない場合は-1を返す
 * @param segments 文字列をSegmentに変換した配列
 * @param character 位置
 */
export function wordEndRightCharacter(segments: Segment[], character: number) {
  if (segments.length === 0) {
    return -1;
  }

  let currentCharacter = 0;
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    currentCharacter += segment.segment.length;
    if (segment.isWord) {
      if (currentCharacter <= character) {
        // 単語の終わりの位置を取得する
      } else {
        return currentCharacter;
      }
    }

    if (i === segments.length - 1 && currentCharacter === character) {
      return -1;
    }
  }

  return currentCharacter;
}

interface Segment {
  segment: string;
  isWord: boolean;
}

export const PURPOSE = {
  selectRight: 0,
  selectLeft: 1,
  delete: 2,
} as const;
type Purpose = (typeof PURPOSE)[keyof typeof PURPOSE];

/**
 * 文字列をSegmentに変換する
 * - 空白文字はisWord=false
 * - editor.wordSeparators中の1文字からなる要素はisWord=false
 *   - ただし、isRight=true の時は前が空白文字の場合はisWord=true
 *   - ただし、isRight=falseの時は後が空白文字の場合はisWord=true
 * - それ以外はisWord=true
 * @param strings
 * @returns Segmentの配列
 */
export function stringToSegments(strings: string[], purpose: Purpose) {
  const result: Segment[] = [];

  const wordSeparators = getWordSeparators();
  const wordSeparatorsRegExp = getWordSeparatorsRegExp(
    escapeRegExp(wordSeparators),
  );

  for (let i = 0; i < strings.length; i++) {
    const string = strings[i];

    if (string.match(/^\s+$/g)) {
      result.push({ segment: string, isWord: false });
      continue;
    }

    if (!wordSeparatorsRegExp.test(string)) {
      result.push({ segment: string, isWord: true });
      continue;
    }

    if (string.length !== 1) {
      result.push({ segment: string, isWord: true });
      continue;
    }

    if (
      purpose === PURPOSE.selectLeft &&
      0 < i &&
      strings[i - 1].match(/^\s+$/g)
    ) {
      result.push({ segment: string, isWord: true });
      continue;
    } else if (
      purpose === PURPOSE.selectRight &&
      i < strings.length - 1 &&
      strings[i + 1].match(/^\s+$/g)
    ) {
      result.push({ segment: string, isWord: true });
      continue;
    } else if (purpose === PURPOSE.delete) {
      result.push({ segment: string, isWord: true });
      continue;
    } else {
      result.push({ segment: string, isWord: false });
      continue;
    }
  }

  return result;
}

/**
 * 正規表現用にエスケープする
 * @param string エスケープする文字列
 */
export function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 単語の区切り文字の正規表現を取得する
 * @param wordSeparators 単語の区切り文字
 */
export function getWordSeparatorsRegExp(wordSeparators: string) {
  const wordSeparatorsArray = wordSeparators.split("");
  let wordSeparatorsRegExp = "([";

  for (const wordSeparator of wordSeparatorsArray) {
    wordSeparatorsRegExp += escapeRegExp(wordSeparator);
  }

  wordSeparatorsRegExp += "]+)";

  return new RegExp(wordSeparatorsRegExp, "g");
}

/**
 * editor.wordSeparators を取得する
 * - editor.wordSeparators が文字列でない場合や取得できない場合は空文字を返す
 * @returns editor.wordSeparators
 */
export function getWordSeparators() {
  const config = vscode.workspace.getConfiguration("editor");
  const wordSeparators = config.get("wordSeparators");

  if (typeof wordSeparators !== "string") {
    logOutputChannel.warn(
      'Could not get editor.wordSeparators.\nContinue processing as editor.wordSeparators="".',
    );
    return "";
  }

  return wordSeparators;
}

export function splitByWordSeparators(strings: string[]) {
  const wordSeparators = getWordSeparators();
  const wordSeparatorsRegExp = getWordSeparatorsRegExp(
    escapeRegExp(wordSeparators),
  );

  let result: string[] = [];

  for (const string of strings) {
    result = result.concat(
      string.split(wordSeparatorsRegExp).filter((word) => word),
    );
  }

  // 区切り文字のみの要素が連続している場合に、連続した区切り文字の要素を1つにまとめる
  // 入力: ["a", ".", ".", "b", "!", "?", "c"]
  // 期待値: ["a", "..", "b", "!?", "c"]
  result = combileConsecutiveElements(
    result,
    new RegExp(wordSeparatorsRegExp.source),
  );

  return result;
}

/**
 * スペースで分割する
 * - スペースは残る
 * - スペースのみの要素が連続している場合に、連続したスペースの要素を1つにまとめる
 * @param strings スペースで分割する文字列の配列
 */
export function splitBySpace(strings: string[]) {
  let result: string[] = [];

  for (const string of strings) {
    result = result.concat(string.split(/([\s]+)/g).filter((word) => word));
  }

  // スペースのみの要素が連続している場合に、連続したスペースの要素を1つにまとめる
  result = combileConsecutiveElements(result, /^([\s]+)$/);

  return result;
}

/**
 * 指定した条件に一致する要素を結合する
 * @param strings 結合する文字列の配列
 * @param pettern 結合する条件
 * @returns 結合した文字列の配列
 */
export function combileConsecutiveElements(strings: string[], pettern: RegExp) {
  for (let i = 0; i < strings.length - 1; i++) {
    if (pettern.test(strings[i])) {
      while (pettern.test(strings[i + 1])) {
        strings[i] = strings[i] + strings[i + 1];
        strings.splice(i + 1, 1);
      }
    }
  }

  return strings;
}

/**
 * 単語で分割する
 * @param strings 単語で分割する文字列の配列
 * @returns 単語で分割した文字列の配列
 * @todo  Intl.Segmenterのlocaleを指定できるようにする
 */
export function splitByWord(strings: string[]) {
  const segmenter = new Intl.Segmenter("ja", { granularity: "word" });

  const result: string[] = [];

  for (const string of strings) {
    const segments = segmenter.segment(string);

    for (const segment of segments) {
      result.push(segment.segment);
    }
  }

  return result;
}

/**
 * 文字列を分割する
 * - editor.wordSeparators で指定された文字で分割する
 * - スペースで分割する
 * - 単語で分割する
 * @param strings 分割する文字列の配列
 * @returns 分割した文字列の配列
 */
export function splitByAll(strings: string[]) {
  let result = splitByWordSeparators(strings);
  result = splitBySpace(result);
  result = splitByWord(result);

  // SplitByWord()を実行した後に、記号が分割されてしまうので、記号をまとめる
  // 入力: ["a", ".", ".", "b", "!", "?", "c"]
  // 期待値: ["a", "..", "b", "!?", "c"]
  const wordSeparators = getWordSeparators();
  const wordSeparatorsRegExp = getWordSeparatorsRegExp(
    escapeRegExp(wordSeparators),
  );
  console.log(wordSeparatorsRegExp.source);

  result = combileConsecutiveElements(
    result,
    new RegExp(wordSeparatorsRegExp.source),
  );

  return result;
}

// This method is called when your extension is deactivated
export function deactivate() {}
