import * as vscode from "vscode";

let logOutputChannel: vscode.LogOutputChannel;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const extensionDisplayName = "Word Divider";
  logOutputChannel = vscode.window.createOutputChannel(extensionDisplayName, {
    log: true,
  });

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
    vscode.commands.registerCommand(
      "word-divider.deleteWordLeft",
      deleteWordLeft,
    ),
    vscode.commands.registerCommand(
      "word-divider.deleteWordRight",
      deleteWordRight,
    ),
  );
}

/**
 * カーソルを単語の先頭に移動する
 */
export function cursorWordLeft() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    logOutputChannel.warn(
      "Could not get active text editor. Cannot move the cursor.",
    );
    return;
  }

  editor.selections = editor.selections.map((selection) => {
    const position = selection.active;
    let line = position.line;

    const lineText = editor.document.lineAt(line).text;

    let character = wordLeftCharacter(
      stringToSegments(splitByAll([lineText]), PURPOSE.selectLeft),
      position.character,
    );

    // 単語の先頭の位置がない場合は、前の行の最後単語の始めに移動する
    if (character === -1) {
      if (line === 0) {
        // 1行目の場合はその前には単語がないので何もしない
        return selection;
      }

      line -= 1;
      const lineText = editor.document.lineAt(line).text;

      character = wordLeftCharacter(
        stringToSegments(splitByAll([lineText]), PURPOSE.selectLeft),
        lineText.length,
      );

      // 前の行に単語がない場合は、前の行の先頭に移動する
      if (character === -1) {
        character = 0;
      }
    }

    const newPosition = new vscode.Position(line, character);

    return new vscode.Selection(newPosition, newPosition);
  });
}

/**
 * カーソルを単語の終わりに移動する
 */
export function cursorWordEndRight() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    logOutputChannel.warn(
      "Could not get active text editor. Cannot move the cursor.",
    );
    return;
  }

  editor.selections = editor.selections.map((selection) => {
    const position = selection.active;
    let line = position.line;
    const lineText = editor.document.lineAt(line).text;

    let character = wordEndRightCharacter(
      stringToSegments(splitByAll([lineText]), PURPOSE.selectRight),
      position.character,
    );

    if (character === -1) {
      if (line === editor.document.lineCount - 1) {
        // 最終行の行末の場合は何もしない
        return selection;
      }

      line += 1;
      const lineText = editor.document.lineAt(line).text;

      character = wordEndRightCharacter(
        stringToSegments(splitByAll([lineText]), PURPOSE.selectRight),
        0,
      );

      // 次の行に単語がない場合は、次の行の行末に移動する
      if (character === -1) {
        character = lineText.length;
      }
    }

    const newPosition = new vscode.Position(line, character);

    return new vscode.Selection(newPosition, newPosition);
  });
}

/**
 * カーソルを単語の先頭まで選択する
 */
export function cursorWordLeftSelect() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    logOutputChannel.warn("Could not get active text editor. Cannot select");
    return;
  }

  editor.selections = editor.selections.map((selection) => {
    const position = selection.active;
    let line = position.line;

    const lineText = editor.document.lineAt(line).text;

    let character = wordLeftCharacter(
      stringToSegments(splitByAll([lineText]), PURPOSE.selectLeft),
      position.character,
    );

    // 単語の先頭の位置がない場合は、前の行の最後単語の始めに移動する
    if (character === -1) {
      if (line === 0) {
        // 1行目の場合はその前には単語がないので何もしない
        return selection;
      }

      line -= 1;
      const lineText = editor.document.lineAt(line).text;

      character = wordLeftCharacter(
        stringToSegments(splitByAll([lineText]), PURPOSE.selectLeft),
        lineText.length,
      );

      // 前の行に単語がない場合は、前の行の先頭に移動する
      if (character === -1) {
        character = 0;
      }
    }

    const newPosition = new vscode.Position(line, character);

    return new vscode.Selection(selection.anchor, newPosition);
  });
}

/**
 * カーソルを単語の終わりまで選択する
 */
export function cursorWordEndRightSelect() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    logOutputChannel.warn("Could not get active text editor. Cannot select");
    return;
  }

  editor.selections = editor.selections.map((selection) => {
    const position = selection.active;
    let line = position.line;
    const lineText = editor.document.lineAt(line).text;

    let character = wordEndRightCharacter(
      stringToSegments(splitByAll([lineText]), PURPOSE.selectRight),
      position.character,
    );

    if (character === -1) {
      if (line === editor.document.lineCount - 1) {
        // 最終行の行末の場合は何もしない
        return selection;
      }

      line += 1;
      const lineText = editor.document.lineAt(line).text;

      character = wordEndRightCharacter(
        stringToSegments(splitByAll([lineText]), PURPOSE.selectRight),
        0,
      );

      // 次の行に単語がない場合は、次の行の行末に移動する
      if (character === -1) {
        character = lineText.length;
      }
    }

    const newPosition = new vscode.Position(line, character);

    return new vscode.Selection(selection.anchor, newPosition);
  });
}

/**
 * カーソルの左側の単語を削除する
 */
export function deleteWordLeft() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    logOutputChannel.warn("Could not get active text editor. Cannot delete.");
    return;
  }

  const selections = editor.selections.map((selection) => {
    if (selection.anchor.compareTo(selection.active) !== 0) {
      // 選択されている場合は、選択範囲を削除する
      return selection;
    }

    const position = selection.active;
    let line = position.line;

    const lineText = editor.document.lineAt(line).text;

    let character = wordLeftCharacter(
      stringToSegments(splitByAll([lineText]), PURPOSE.delete),
      position.character,
    );

    // 単語の先頭の位置がない場合は、前の行の最後に移動する
    if (character === -1) {
      if (line === 0) {
        // 1行目の場合はその前には単語がないので何もしない
        return new vscode.Selection(selection.anchor, selection.anchor);
      } else {
        line -= 1;
        const lineText = editor.document.lineAt(line).text;
        character = lineText.length;
      }
    }

    const newPosition = new vscode.Position(line, character);

    return new vscode.Selection(selection.anchor, newPosition);
  });

  // 選択範囲を削除する
  // editor.edit()の中でselectionをループさせないと、最初のselectionのみが削除される
  return editor.edit((editBuilder) => {
    selections.forEach((selection) => {
      editBuilder.delete(selection);
    });
  });
}

/**
 * カーソルの右側の単語を削除する
 */
export function deleteWordRight() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    logOutputChannel.warn("Could not get active text editor. Cannot delete.");
    return;
  }

  const selections = editor.selections.map((selection) => {
    if (selection.anchor.compareTo(selection.active) !== 0) {
      // 選択されている場合は、選択範囲を削除する
      return selection;
    }

    const position = selection.active;
    let line = position.line;

    const lineText = editor.document.lineAt(line).text;

    let character = wordEndRightCharacter(
      stringToSegments(splitByAll([lineText]), PURPOSE.delete),
      position.character,
    );

    // 単語の先頭の位置がない場合は、前の行の最後単語の始めに移動する
    if (character === -1) {
      if (line === editor.document.lineCount - 1) {
        // 最終行の行末の場合は何もしない
        return new vscode.Selection(selection.active, selection.active);
      }

      line += 1;
      const lineText = editor.document.lineAt(line).text;
      character = wordEndRightCharacter(
        stringToSegments(splitByAll([lineText]), PURPOSE.delete),
        0,
      );
    }

    const newPosition = new vscode.Position(line, character);

    return new vscode.Selection(selection.anchor, newPosition);
  });

  // 選択範囲を削除する
  // editor.edit()の中でselectionをループさせないと、最初のselectionのみが削除される
  return editor.edit((editBuilder) => {
    selections.forEach((selection) => {
      editBuilder.delete(selection);
    });
  });
}

/**
 * 指定した位置から見た単語の先頭の位置を取得する
 * - 単語の先頭の位置がない場合は-1を返す
 * @param segments 文字列をSegmentに変換した配列
 * @param character 位置
 * @returns 単語の先頭の位置
 */
export function wordLeftCharacter(segments: Segment[], character: number) {
  // 位置が0以下の場合は、必ず左側に単語がないので-1を返す
  if (character <= 0) {
    return -1;
  }

  let result = 0;
  let currentCharacter = 0;
  for (const segment of segments) {
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
  // 文字列の長さが0以下の場合は、必ず右側に単語がないので-1を返す
  if (segments.length === 0) {
    return -1;
  }

  let currentCharacter = 0;
  for (const segment of segments) {
    currentCharacter += segment.segment.length;
    if (segment.isWord) {
      if (character < currentCharacter) {
        return currentCharacter;
      }
    }
  }

  // 全てのセグメントをループしても単語の終わりの位置が見つからず、
  // characterとcurrentCharacterが同じ場合は、行末にいるので-1を返す
  if (currentCharacter === character) {
    return -1;
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
 *   - だたし、purpose=PURPOSE.delete     の時は空白文字が2つ以上の場合はisWord=true
 * - editor.wordSeparators中の1文字からなる要素はisWord=false
 *   - ただし、purpose=PURPOSE.selectRightの時は後が空白文字の場合はisWord=true
 *   - ただし、purpose=PURPOSE.selectLeft の時は前が空白文字の場合はisWord=true
 *   - ただし、purpose=PURPOSE.delete     の時はisWord=true
 *   - ただし、purpose=PURPOSE.delete     の時は行の先頭に空白文字がある場合はその空白はisWord=true
 * - それ以外はisWord=true
 * @param strings
 * @returns Segmentの配列
 */
export function stringToSegments(strings: string[], purpose: Purpose) {
  const segments: Segment[] = [];

  const wordSeparatorsRegExp = getWordSeparatorsRegExp(
    escapeRegExp(getWordSeparators()),
  );

  const spaceOnlyRegExp = /^[\s]+$/;

  for (let i = 0; i < strings.length; i++) {
    const string = strings[i];

    // 空白文字のみの要素はisWord=false
    if (spaceOnlyRegExp.test(string)) {
      // ただし、purpose=PURPOSE.deleteの時は空白文字が2つ以上の場合はisWord=true
      // ただし、purpose=PURPOSE.deleteの時は行の先頭に空白文字がある場合はその空白はisWord=true
      if (purpose === PURPOSE.delete) {
        if (1 < string.length) {
          segments.push({ segment: string, isWord: true });
          continue;
        }
        if (i === 0) {
          segments.push({ segment: string, isWord: true });
          continue;
        }
      }
      segments.push({ segment: string, isWord: false });
      continue;
    }

    // 空白文字でもなく、editor.wordSeparators中の文字でもない要素はisWord=true
    if (!wordSeparatorsRegExp.test(string)) {
      segments.push({ segment: string, isWord: true });
      continue;
    }

    // editor.wordSeparators中の1文字からなる要素はisWord=false
    if (string.length !== 1) {
      segments.push({ segment: string, isWord: true });
      continue;
    }

    // editor.wordSeparators中の1文字からなる要素はisWord=false
    switch (purpose) {
      case PURPOSE.selectRight:
        // ただし、purpose=PURPOSE.selectRightの時は後が空白文字の場合はisWord=true
        if (i < strings.length - 1 && spaceOnlyRegExp.test(strings[i + 1])) {
          segments.push({ segment: string, isWord: true });
          continue;
        } else {
          segments.push({ segment: string, isWord: false });
          continue;
        }
      case PURPOSE.selectLeft:
        // ただし、purpose=PURPOSE.selectLeftの時は前が空白文字の場合はisWord=true
        if (0 < i && spaceOnlyRegExp.test(strings[i - 1])) {
          segments.push({ segment: string, isWord: true });
          continue;
        } else {
          segments.push({ segment: string, isWord: false });
          continue;
        }
      case PURPOSE.delete:
        // ただし、purpose=PURPOSE.deleteの時はisWord=true
        segments.push({ segment: string, isWord: true });
        continue;
      default:
        logOutputChannel.error(`Invalid purpose (${purpose}).`);
        continue;
    }
  }

  return segments;
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
      'Could not get editor.wordSeparators. Continue processing as editor.wordSeparators="".',
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
  // 期待: ["a", "..", "b", "!?", "c"]
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
  // 期待: ["a", "..", "b", "!?", "c"]
  const wordSeparators = getWordSeparators();
  const wordSeparatorsRegExp = getWordSeparatorsRegExp(
    escapeRegExp(wordSeparators),
  );

  result = combileConsecutiveElements(
    result,
    // globalフラグがついているとマッチしなくなるのでフラグを外す
    new RegExp(wordSeparatorsRegExp.source),
  );

  // SplitBySpace()を実行した後に、タブとスペースが分割されてしまうので、タブとスペースをまとめる
  result = combileConsecutiveElements(result, /^[\s]+$/);

  return result;
}

// This method is called when your extension is deactivated
export function deactivate() {}
