import * as assert from "assert";

import * as vscode from "vscode";
import * as extension from "../extension";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("cursorWordLeft", async () => {
    // テストで用いる区切り文字を設定するためデフォルトのeditor.wordSeparatorsを設定する
    await setDefaultWordSeparators();

    // カーソルが単語の先頭に移動することを確認する
    let testNumber = 0;
    const testCases = [
      {
        testNumber: `${testNumber++}`,
        input: { text: [" "], position: { line: 0, character: 1 } },
        expected: { text: [" "], position: { line: 0, character: 0 } },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["abc", " ", "def"],
          position: { line: 0, character: 3 },
        },
        expected: {
          text: ["abc", " ", "def"],
          position: { line: 0, character: 0 },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["abc", " ", "def"],
          position: { line: 0, character: 4 },
        },
        expected: {
          text: ["abc", " ", "def"],
          position: { line: 0, character: 0 },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["abc", " ", "def"],
          position: { line: 1, character: 0 },
        },
        expected: {
          text: ["abc", " ", "def"],
          position: { line: 0, character: 0 },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["分かち書きです", ""],
          position: { line: 0, character: 7 },
        },
        expected: {
          text: ["分かち書きです", ""],
          position: { line: 0, character: 5 },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["分かち書きです", ""],
          position: { line: 1, character: 0 },
        },
        expected: {
          text: ["分かち書きです", ""],
          position: { line: 0, character: 5 },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: { text: ["  ", ""], position: { line: 1, character: 0 } },
        expected: { text: ["  ", ""], position: { line: 0, character: 0 } },
      },
    ];

    for (const testCase of testCases) {
      // VS Codeのエディタ領域にテキストを設定する
      const document = await vscode.workspace.openTextDocument({
        content: testCase.input.text.join("\n"),
      });

      const editor = await vscode.window.showTextDocument(document);

      // カーソルを設定する
      editor.selection = new vscode.Selection(
        new vscode.Position(
          testCase.input.position.line,
          testCase.input.position.character,
        ),
        new vscode.Position(
          testCase.input.position.line,
          testCase.input.position.character,
        ),
      );

      // カーソルが単語の先頭に移動することを確認する
      extension.cursorWordLeft();
      assert.deepStrictEqual(
        editor.selection.active,
        new vscode.Position(
          testCase.expected.position.line,
          testCase.expected.position.character,
        ),
        `testCase.testNumber: ${testCase.testNumber}`,
      );

      // テキストが変更されていないことを確認する
      assert.strictEqual(
        document.getText(),
        testCase.expected.text.join("\n"),
        `testCase.testNumber: ${testCase.testNumber}`,
      );
    }
  }).timeout("20s");

  test("cursorWordEndRight", async () => {
    // テストで用いる区切り文字を設定するためデフォルトのeditor.wordSeparatorsを設定する
    await setDefaultWordSeparators();

    // カーソルが単語の末尾に移動することを確認する
    let testNumber = 0;
    const testCases = [
      {
        testNumber: `${testNumber++}`,
        input: { text: [" "], position: { line: 0, character: 1 } },
        expected: { text: [" "], position: { line: 0, character: 1 } },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["abc", " ", "def"],
          position: { line: 0, character: 0 },
        },
        expected: {
          text: ["abc", " ", "def"],
          position: { line: 0, character: 3 },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["abc", " ", "def"],
          position: { line: 1, character: 1 },
        },
        expected: {
          text: ["abc", " ", "def"],
          position: { line: 2, character: 3 },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["分かち書きです", ""],
          position: { line: 0, character: 0 },
        },
        expected: {
          text: ["分かち書きです", ""],
          position: { line: 0, character: 5 },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: { text: ["", "   "], position: { line: 0, character: 0 } },
        expected: { text: ["", "   "], position: { line: 1, character: 3 } },
      },
    ];

    for (const testCase of testCases) {
      // VS Codeのエディタ領域にテキストを設定する
      const document = await vscode.workspace.openTextDocument({
        content: testCase.input.text.join("\n"),
      });

      const editor = await vscode.window.showTextDocument(document);

      // カーソルを設定する
      editor.selection = new vscode.Selection(
        new vscode.Position(
          testCase.input.position.line,
          testCase.input.position.character,
        ),
        new vscode.Position(
          testCase.input.position.line,
          testCase.input.position.character,
        ),
      );

      // カーソルが単語の末尾に移動することを確認する
      extension.cursorWordEndRight();
      assert.deepStrictEqual(
        editor.selection.active,
        new vscode.Position(
          testCase.expected.position.line,
          testCase.expected.position.character,
        ),
        `testCase.testNumber: ${testCase.testNumber}`,
      );

      // テキストが変更されていないことを確認する
      assert.strictEqual(
        document.getText(),
        testCase.expected.text.join("\n"),
        `testCase.testNumber: ${testCase.testNumber}`,
      );
    }
  }).timeout("20s");

  test("cursorWordLeftSelect", async () => {
    // カーソルが単語の先頭に移動することを確認する
    let testNumber = 0;
    const testCases = [
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["abc", " ", "def"],
          selection: {
            anchor: { line: 0, character: 3 },
            active: { line: 0, character: 2 },
          },
        },
        expected: {
          text: ["abc", " ", "def"],
          selection: {
            anchor: { line: 0, character: 3 },
            active: { line: 0, character: 0 },
          },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["分かち書きです"],
          selection: {
            anchor: { line: 0, character: 7 },
            active: { line: 0, character: 6 },
          },
        },
        expected: {
          text: ["分かち書きです"],
          selection: {
            anchor: { line: 0, character: 7 },
            active: { line: 0, character: 5 },
          },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["分かち書きです", "", " "],
          selection: {
            anchor: { line: 2, character: 1 },
            active: { line: 1, character: 0 },
          },
        },
        expected: {
          text: ["分かち書きです", "", " "],
          selection: {
            anchor: { line: 2, character: 1 },
            active: { line: 0, character: 5 },
          },
        },
      },
    ];

    for (const testCase of testCases) {
      // VS Codeのエディタ領域にテキストを設定する
      const document = await vscode.workspace.openTextDocument({
        content: testCase.input.text.join("\n"),
      });

      const editor = await vscode.window.showTextDocument(document);

      // カーソルを設定する
      editor.selection = new vscode.Selection(
        new vscode.Position(
          testCase.input.selection.anchor.line,
          testCase.input.selection.anchor.character,
        ),
        new vscode.Position(
          testCase.input.selection.active.line,
          testCase.input.selection.active.character,
        ),
      );

      // 選択範囲が単語の先頭に移動することを確認する
      extension.cursorWordLeftSelect();

      assert.deepStrictEqual(
        editor.selection.anchor,
        new vscode.Position(
          testCase.expected.selection.anchor.line,
          testCase.expected.selection.anchor.character,
        ),
        `testCase.testNumber(anchor): ${testCase.testNumber}`,
      );

      assert.deepStrictEqual(
        editor.selection.active,
        new vscode.Position(
          testCase.expected.selection.active.line,
          testCase.expected.selection.active.character,
        ),
        `testCase.testNumber(active): ${testCase.testNumber}`,
      );

      // テキストが変更されていないことを確認する
      assert.strictEqual(
        document.getText(),
        testCase.expected.text.join("\n"),
        `testCase.testNumber(text): ${testCase.testNumber}`,
      );
    }
  }).timeout("20s");

  test("cursorWordEndRightSelect", async () => {
    // カーソルが単語の先頭に移動することを確認する
    let testNumber = 0;
    const testCases = [
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["abc", " ", "def"],
          selection: {
            anchor: { line: 0, character: 2 },
            active: { line: 2, character: 3 },
          },
        },
        expected: {
          text: ["abc", " ", "def"],
          selection: {
            anchor: { line: 0, character: 2 },
            active: { line: 2, character: 3 },
          },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["abc", " ", "def"],
          selection: {
            anchor: { line: 0, character: 2 },
            active: { line: 0, character: 3 },
          },
        },
        expected: {
          text: ["abc", " ", "def"],
          selection: {
            anchor: { line: 0, character: 2 },
            active: { line: 1, character: 1 },
          },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["分かち書きです"],
          selection: {
            anchor: { line: 0, character: 3 },
            active: { line: 0, character: 3 },
          },
        },
        expected: {
          text: ["分かち書きです"],
          selection: {
            anchor: { line: 0, character: 3 },
            active: { line: 0, character: 5 },
          },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["分かち書きです", "", " こんにちは"],
          selection: {
            anchor: { line: 0, character: 7 },
            active: { line: 1, character: 0 },
          },
        },
        expected: {
          text: ["分かち書きです", "", " こんにちは"],
          selection: {
            anchor: { line: 0, character: 7 },
            active: { line: 2, character: 6 },
          },
        },
      },
    ];

    for (const testCase of testCases) {
      // VS Codeのエディタ領域にテキストを設定する
      const document = await vscode.workspace.openTextDocument({
        content: testCase.input.text.join("\n"),
      });

      const editor = await vscode.window.showTextDocument(document);

      // カーソルを設定する
      editor.selection = new vscode.Selection(
        new vscode.Position(
          testCase.input.selection.anchor.line,
          testCase.input.selection.anchor.character,
        ),
        new vscode.Position(
          testCase.input.selection.active.line,
          testCase.input.selection.active.character,
        ),
      );

      // 選択範囲が単語の後ろに移動することを確認する
      extension.cursorWordEndRightSelect();

      assert.deepStrictEqual(
        editor.selection.anchor,
        new vscode.Position(
          testCase.expected.selection.anchor.line,
          testCase.expected.selection.anchor.character,
        ),
        `testCase.testNumber(anchor): ${testCase.testNumber}`,
      );

      assert.deepStrictEqual(
        editor.selection.active,
        new vscode.Position(
          testCase.expected.selection.active.line,
          testCase.expected.selection.active.character,
        ),
        `testCase.testNumber(active): ${testCase.testNumber}`,
      );

      // テキストが変更されていないことを確認する
      assert.strictEqual(
        document.getText(),
        testCase.expected.text.join("\n"),
        `testCase.testNumber(text): ${testCase.testNumber}`,
      );
    }
  }).timeout("20s");

  test("deleteWordLeft", async () => {
    // カーソルが単語の先頭に移動することを確認する
    let testNumber = 0;
    const testCases = [
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["分かち書きです"],
          selection: {
            anchor: { line: 0, character: 7 },
            active: { line: 0, character: 7 },
          },
        },
        expected: {
          text: ["分かち書き"],
          selection: {
            anchor: { line: 0, character: 5 },
            active: { line: 0, character: 5 },
          },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["分かち書きです"],
          selection: {
            anchor: { line: 0, character: 5 },
            active: { line: 0, character: 6 },
          },
        },
        expected: {
          text: ["分かち書きす"],
          selection: {
            anchor: { line: 0, character: 5 },
            active: { line: 0, character: 5 },
          },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: [" ", ""],
          selection: {
            anchor: { line: 1, character: 0 },
            active: { line: 1, character: 0 },
          },
        },
        expected: {
          text: [" "],
          selection: {
            anchor: { line: 0, character: 1 },
            active: { line: 0, character: 1 },
          },
        },
      },
    ];

    for (const testCase of testCases) {
      // VS Codeのエディタ領域にテキストを設定する
      const document = await vscode.workspace.openTextDocument({
        content: testCase.input.text.join("\n"),
      });

      const editor = await vscode.window.showTextDocument(document);

      // カーソルを設定する
      editor.selection = new vscode.Selection(
        new vscode.Position(
          testCase.input.selection.anchor.line,
          testCase.input.selection.anchor.character,
        ),
        new vscode.Position(
          testCase.input.selection.active.line,
          testCase.input.selection.active.character,
        ),
      );

      // 選択範囲が単語の後ろに移動することを確認する
      await extension.deleteWordLeft();

      assert.deepStrictEqual(
        editor.selection.anchor,
        new vscode.Position(
          testCase.expected.selection.anchor.line,
          testCase.expected.selection.anchor.character,
        ),
        `testCase.testNumber(anchor): ${testCase.testNumber}`,
      );

      assert.deepStrictEqual(
        editor.selection.active,
        new vscode.Position(
          testCase.expected.selection.active.line,
          testCase.expected.selection.active.character,
        ),
        `testCase.testNumber(active): ${testCase.testNumber}`,
      );

      // テキストが変更されていないことを確認する
      assert.strictEqual(
        document.getText(),
        testCase.expected.text.join("\n"),
        `testCase.testNumber(text): ${testCase.testNumber}`,
      );
    }
  }).timeout("20s");

  test("deleteWordRight", async () => {
    // カーソルが単語の先頭に移動することを確認する
    let testNumber = 0;
    const testCases = [
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["分かち書きです"],
          selection: {
            anchor: { line: 0, character: 5 },
            active: { line: 0, character: 5 },
          },
        },
        expected: {
          text: ["分かち書き"],
          selection: {
            anchor: { line: 0, character: 5 },
            active: { line: 0, character: 5 },
          },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["分かち書きです"],
          selection: {
            anchor: { line: 0, character: 2 },
            active: { line: 0, character: 4 },
          },
        },
        expected: {
          text: ["分かきです"],
          selection: {
            anchor: { line: 0, character: 2 },
            active: { line: 0, character: 2 },
          },
        },
      },
      {
        testNumber: `${testNumber++}`,
        input: {
          text: ["a", " b"],
          selection: {
            anchor: { line: 0, character: 1 },
            active: { line: 0, character: 1 },
          },
        },
        expected: {
          text: ["ab"],
          selection: {
            anchor: { line: 0, character: 1 },
            active: { line: 0, character: 1 },
          },
        },
      },
    ];

    for (const testCase of testCases) {
      // VS Codeのエディタ領域にテキストを設定する
      const document = await vscode.workspace.openTextDocument({
        content: testCase.input.text.join("\n"),
      });

      const editor = await vscode.window.showTextDocument(document);

      // カーソルを設定する
      editor.selection = new vscode.Selection(
        new vscode.Position(
          testCase.input.selection.anchor.line,
          testCase.input.selection.anchor.character,
        ),
        new vscode.Position(
          testCase.input.selection.active.line,
          testCase.input.selection.active.character,
        ),
      );

      // 選択範囲が単語の後ろに移動することを確認する
      await extension.deleteWordRight();

      assert.deepStrictEqual(
        editor.selection.anchor,
        new vscode.Position(
          testCase.expected.selection.anchor.line,
          testCase.expected.selection.anchor.character,
        ),
        `testCase.testNumber(anchor): ${testCase.testNumber}`,
      );

      assert.deepStrictEqual(
        editor.selection.active,
        new vscode.Position(
          testCase.expected.selection.active.line,
          testCase.expected.selection.active.character,
        ),
        `testCase.testNumber(active): ${testCase.testNumber}`,
      );

      // テキストが変更されていないことを確認する
      assert.strictEqual(
        document.getText(),
        testCase.expected.text.join("\n"),
        `testCase.testNumber(text): ${testCase.testNumber}`,
      );
    }
  }).timeout("20s");

  test("escapeRegExp", () => {
    // 正規表現でエスケープが必要な以下の文字がエスケープされているか確認する
    // . * + ? ^ $ { } ( ) | [ ] \
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_Expressions
    assert.strictEqual(extension.escapeRegExp("."), "\\."); // . -> \.
    assert.strictEqual(extension.escapeRegExp("*"), "\\*"); // * -> \*
    assert.strictEqual(extension.escapeRegExp("+"), "\\+"); // + -> \+
    assert.strictEqual(extension.escapeRegExp("?"), "\\?"); // ? -> \?
    assert.strictEqual(extension.escapeRegExp("^"), "\\^"); // ^ -> \^
    assert.strictEqual(extension.escapeRegExp("$"), "\\$"); // $ -> \$
    assert.strictEqual(extension.escapeRegExp("{"), "\\{"); // { -> \{
    assert.strictEqual(extension.escapeRegExp("}"), "\\}"); // } -> \}
    assert.strictEqual(extension.escapeRegExp("("), "\\("); // ( -> \(
    assert.strictEqual(extension.escapeRegExp(")"), "\\)"); // ) -> \)
    assert.strictEqual(extension.escapeRegExp("|"), "\\|"); // | -> \|
    assert.strictEqual(extension.escapeRegExp("["), "\\["); // [ -> \[
    assert.strictEqual(extension.escapeRegExp("]"), "\\]"); // ] -> \]
    assert.strictEqual(extension.escapeRegExp("\\"), "\\\\"); // \ -> \\

    // エスケープが必要な文字はエスケープされていて、それ以外はエスケープされていないか確認する
    assert.strictEqual(extension.escapeRegExp("a."), "a\\.");
    // 複数文字のエスケープが正しく行われているか確認する
    assert.strictEqual(extension.escapeRegExp(".*"), "\\.\\*");

    // 以下はエスケープの必要がない文字なので、そのまま出力される
    assert.strictEqual(extension.escapeRegExp(""), "");
    assert.strictEqual(extension.escapeRegExp("a"), "a");
    assert.strictEqual(extension.escapeRegExp("1"), "1");
    assert.strictEqual(extension.escapeRegExp("あ"), "あ");
    assert.strictEqual(extension.escapeRegExp("ア"), "ア");
    assert.strictEqual(extension.escapeRegExp("🍣"), "🍣");
  });

  test("splitBySpace", () => {
    // スペースで分割されるか確認する
    assert.deepStrictEqual(extension.splitBySpace([" a b c "]), [
      " ",
      "a",
      " ",
      "b",
      " ",
      "c",
      " ",
    ]);

    // スペースで分割されるか確認する
    assert.deepStrictEqual(extension.splitBySpace([" a", "b", "c"]), [
      " ",
      "a",
      "b",
      "c",
    ]);

    // スペースで分割されるか確認する
    assert.deepStrictEqual(extension.splitBySpace(["a ", "b", "c"]), [
      "a",
      " ",
      "b",
      "c",
    ]);

    // スペースで分割されるか確認する
    assert.deepStrictEqual(extension.splitBySpace(["a", " b", "c"]), [
      "a",
      " ",
      "b",
      "c",
    ]);

    // スペースで分割されるか確認する
    assert.deepStrictEqual(extension.splitBySpace(["a", "b ", "c"]), [
      "a",
      "b",
      " ",
      "c",
    ]);

    // スペースで分割されるか確認する
    assert.deepStrictEqual(extension.splitBySpace(["a", "b", " c"]), [
      "a",
      "b",
      " ",
      "c",
    ]);

    // スペースで分割されるか確認する
    assert.deepStrictEqual(extension.splitBySpace(["a", "b", "c "]), [
      "a",
      "b",
      "c",
      " ",
    ]);

    // スペースで分割されるか確認する
    assert.deepStrictEqual(extension.splitBySpace(["a", " b ", "c"]), [
      "a",
      " ",
      "b",
      " ",
      "c",
    ]);

    // スペースで分割されるか確認する
    assert.deepStrictEqual(extension.splitBySpace(["a ", "  b", "c"]), [
      "a",
      "   ",
      "b",
      "c",
    ]);

    // タブで分割されるか確認する
    assert.deepStrictEqual(extension.splitBySpace(["a", "\t \tb", "c"]), [
      "a",
      "\t \t",
      "b",
      "c",
    ]);
  });

  test("getWordSeparatorsRegExp", () => {
    // 区切り文字の正規表現が正しく生成されるか確認する
    assert.deepStrictEqual(
      new RegExp("([\\.]+)", "g"),
      extension.getWordSeparatorsRegExp("."),
    );

    // 複数文字の区切り文字の正規表現が正しく生成されるか確認する
    assert.deepStrictEqual(
      new RegExp("([\\.\\*]+)", "g"),
      extension.getWordSeparatorsRegExp(".*"),
    );
  });

  test("combineConsecutiveElements", () => {
    // 連続した要素がまとめられることを確認する
    assert.deepStrictEqual(
      extension.combineConsecutiveElements([".", "|"], /[\\.|!]+/),
      [".|"],
    );

    assert.deepStrictEqual(
      extension.combineConsecutiveElements(["  ", " "], /^([\s]+)$/),
      ["   "],
    );

    assert.deepStrictEqual(
      extension.combineConsecutiveElements(["\t", " ", "\t"], /^([\s]+)$/),
      ["\t \t"],
    );

    assert.deepStrictEqual(
      extension.combineConsecutiveElements([".", "|", "!"], /[\\.|!]+/),
      [".|!"],
    );

    assert.deepStrictEqual(
      extension.combineConsecutiveElements(
        ["a", ".", "|", "!", "b", "c"],
        /[(\\.|!)]+/,
      ),
      ["a", ".|!", "b", "c"],
    );
  });

  // vscodeの設定を変更・取得するのは時間がかかりデフォルトのタイムアウト時間では間に合わない場合がある
  // そのため、確実にテストが完了するようにテストのタイムアウト時間を20sにする
  test("getWordSeparators", async () => {
    // 区切り文字が取得できることを確認する
    const wordSeparatorsList = ["`~!", "@#$%^&*()"];

    for (const wordSeparators of wordSeparatorsList) {
      const waveDashUnifyConfig = vscode.workspace.getConfiguration("editor");
      await waveDashUnifyConfig.update(
        "wordSeparators",
        wordSeparators,
        vscode.ConfigurationTarget.Global,
      );

      assert.strictEqual(wordSeparators, extension.getWordSeparators());
    }
  }).timeout("20s");

  // vscodeの設定を変更・取得するのは時間がかかりデフォルトのタイムアウト時間では間に合わない場合がある
  // そのため、確実にテストが完了するようにテストのタイムアウト時間を20sにする
  test("splitByWordSeparators", async () => {
    // テストで用いる区切り文字を設定するためデフォルトのeditor.wordSeparatorsを設定する
    await setDefaultWordSeparators();

    // 区切り文字で分割されることを確認する
    assert.deepStrictEqual(extension.splitByWordSeparators(["a,", "b", "c"]), [
      "a",
      ",",
      "b",
      "c",
    ]);

    // 区切り文字で分割されることを確認する
    assert.deepStrictEqual(extension.splitByWordSeparators([".a", "b", "c"]), [
      ".",
      "a",
      "b",
      "c",
    ]);

    // 区切り文字が連続しているときに一つの要素にまとめられることを確認する
    assert.deepStrictEqual(extension.splitByWordSeparators(["a.", "|b", "c"]), [
      "a",
      ".|",
      "b",
      "c",
    ]);

    // 区切り文字が連続しているときに一つの要素にまとめられることを確認する
    assert.deepStrictEqual(
      extension.splitByWordSeparators(["a.", "|", ".b", "c"]),
      ["a", ".|.", "b", "c"],
    );

    // 数値+英語でもつながっている場合はそのまま単語として認識されることを確認する
    assert.deepStrictEqual(extension.splitByWordSeparators(["string1"]), [
      "string1",
    ]);
  }).timeout("20s");

  // vscodeの設定を変更・取得するのは時間がかかりデフォルトのタイムアウト時間では間に合わない場合がある
  // そのため、確実にテストが完了するようにテストのタイムアウト時間を20sにする
  test("splitByWord", () => {
    const locale = "ja";

    // 単語で分割されることを確認する
    assert.deepStrictEqual(extension.splitByWord(["単語で分割"], locale), [
      "単語",
      "で",
      "分割",
    ]);

    // 複数の単語で分割されることを確認する
    assert.deepStrictEqual(
      extension.splitByWord(["分かち書きは", "素晴らしい!"], locale),
      ["分かち書き", "は", "素晴らしい", "!"],
    );

    // 連結した英単語は分割されないことを確認する
    assert.deepStrictEqual(
      ["concatenatedWords"],
      extension.splitByWord(["concatenatedWords"], locale),
    );
  }).timeout("20s");

  test("readWordDivideLocale", async () => {
    // デフォルトの言語が取得できることを確認する
    const config = vscode.workspace.getConfiguration("wordDivider");
    // 今の設定を保存しておき、テストが終わったら元に戻す
    const locale = config.get<string>("locale", "auto");
    await config.update("locale", "auto", vscode.ConfigurationTarget.Global);

    // 多分デフォルトの言語はenなのでenが取得できることを確認する
    assert.strictEqual(extension.readWordDivideLocale(), "en");

    // 言語をjaに変更してjaが取得できることを確認する
    await config.update("locale", "ja", vscode.ConfigurationTarget.Global);
    assert.strictEqual(extension.readWordDivideLocale(), "ja");

    // 言語をzh-CNに変更してzh-CNが取得できることを確認する
    await config.update("locale", "zh-CN", vscode.ConfigurationTarget.Global);
    assert.strictEqual(extension.readWordDivideLocale(), "zh-CN");

    // 言語をzh-TWに変更してzh-TWが取得できることを確認する
    await config.update("locale", "zh-TW", vscode.ConfigurationTarget.Global);
    assert.strictEqual(extension.readWordDivideLocale(), "zh-TW");

    // 言語を元に戻す
    await config.update("locale", locale, vscode.ConfigurationTarget.Global);
  });

  // vscodeの設定を変更・取得するのは時間がかかりデフォルトのタイムアウト時間では間に合わない場合がある
  // そのため、確実にテストが完了するようにテストのタイムアウト時間を20sにする
  test("splitByAll", async () => {
    // テストで用いる区切り文字を設定するためデフォルトのeditor.wordSeparatorsを設定する
    await setDefaultWordSeparators();

    assert.deepStrictEqual(extension.splitByAll(["a b c"]), [
      "a",
      " ",
      "b",
      " ",
      "c",
    ]);

    assert.deepStrictEqual(
      extension.splitByAll(["editor.wordSeparatorsで指定された文字で分割する"]),
      [
        "editor",
        ".",
        "wordSeparators",
        "で",
        "指定",
        "さ",
        "れ",
        "た",
        "文字",
        "で",
        "分割",
        "する",
      ],
    );

    assert.deepStrictEqual(["  ", "});"], extension.splitByAll(["  });"]));

    assert.deepStrictEqual(extension.splitByAll(["a\t", " ", "\tb"]), [
      "a",
      "\t \t",
      "b",
    ]);

    assert.deepStrictEqual(extension.splitByAll(["string1"]), ["string1"]);
  }).timeout("20s");

  test("wordLeftPosition", () => {
    const segments = [
      { segment: "abc", isWord: true },
      { segment: " ", isWord: false },
      { segment: "def", isWord: true },
    ];

    assert.deepStrictEqual(extension.wordLeftCharacter(segments, 0), -1);
    assert.deepStrictEqual(extension.wordLeftCharacter(segments, 1), 0);
    assert.deepStrictEqual(extension.wordLeftCharacter(segments, 2), 0);
    assert.deepStrictEqual(extension.wordLeftCharacter(segments, 3), 0);

    assert.deepStrictEqual(extension.wordLeftCharacter(segments, 4), 0);
    assert.deepStrictEqual(extension.wordLeftCharacter(segments, 5), 4);
    assert.deepStrictEqual(extension.wordLeftCharacter(segments, 6), 4);
    assert.deepStrictEqual(extension.wordLeftCharacter(segments, 7), 4);

    // 空行の場合は-1を返すことの確認
    assert.deepStrictEqual(extension.wordLeftCharacter([], 0), -1);
  });

  test("wordEndRightPosition", () => {
    const segments = [
      { segment: "abc", isWord: true },
      { segment: ".", isWord: true },
      { segment: " ", isWord: false },
      { segment: "def", isWord: true },
      { segment: " ", isWord: false },
    ];

    // "abc"
    assert.deepStrictEqual(extension.wordEndRightCharacter(segments, 0), 3);
    assert.deepStrictEqual(extension.wordEndRightCharacter(segments, 1), 3);
    assert.deepStrictEqual(extension.wordEndRightCharacter(segments, 2), 3);

    // "."
    assert.deepStrictEqual(extension.wordEndRightCharacter(segments, 3), 4);

    // " "
    assert.deepStrictEqual(extension.wordEndRightCharacter(segments, 4), 8);

    // "def"
    assert.deepStrictEqual(extension.wordEndRightCharacter(segments, 5), 8);
    assert.deepStrictEqual(extension.wordEndRightCharacter(segments, 6), 8);
    assert.deepStrictEqual(extension.wordEndRightCharacter(segments, 7), 8);
    assert.deepStrictEqual(extension.wordEndRightCharacter(segments, 8), 9);

    // " "
    assert.deepStrictEqual(extension.wordEndRightCharacter(segments, 9), -1);

    // 空行の場合は-1を返すことの確認
    assert.deepStrictEqual(extension.wordEndRightCharacter([], 0), -1, "empty");
  });

  test("stringToSegments", async () => {
    // テストで用いる区切り文字を設定するためデフォルトのeditor.wordSeparatorsを設定する
    await setDefaultWordSeparators();

    assert.deepStrictEqual(extension.stringToSegments(["abc", " ", "def"], 1), [
      { segment: "abc", isWord: true },
      { segment: " ", isWord: false },
      { segment: "def", isWord: true },
    ]);

    assert.deepStrictEqual(
      extension.stringToSegments(
        ["abc", "!", "def"],
        extension.PURPOSE.selectLeft,
      ),
      [
        { segment: "abc", isWord: true },
        { segment: "!", isWord: false },
        { segment: "def", isWord: true },
      ],
    );

    assert.deepStrictEqual(
      extension.stringToSegments(
        ["abc", "!", " ", "def"],
        extension.PURPOSE.selectLeft,
      ),
      [
        { segment: "abc", isWord: true },
        { segment: "!", isWord: false },
        { segment: " ", isWord: false },
        { segment: "def", isWord: true },
      ],
    );

    assert.deepStrictEqual(
      extension.stringToSegments(
        ["abc", "!", " ", "def"],
        extension.PURPOSE.selectRight,
      ),
      [
        { segment: "abc", isWord: true },
        { segment: "!", isWord: true },
        { segment: " ", isWord: false },
        { segment: "def", isWord: true },
      ],
    );

    assert.deepStrictEqual(
      extension.stringToSegments(
        ["abc", "!/", " ", "def"],
        extension.PURPOSE.selectLeft,
      ),
      [
        { segment: "abc", isWord: true },
        { segment: "!/", isWord: true },
        { segment: " ", isWord: false },
        { segment: "def", isWord: true },
      ],
    );

    assert.deepStrictEqual(
      extension.stringToSegments(
        ["abc", "!/", "def"],
        extension.PURPOSE.selectRight,
      ),
      [
        { segment: "abc", isWord: true },
        { segment: "!/", isWord: true },
        { segment: "def", isWord: true },
      ],
    );

    assert.deepStrictEqual(
      extension.stringToSegments(
        ["abc", " ", "!", " ", "def"],
        extension.PURPOSE.selectLeft,
      ),
      [
        { segment: "abc", isWord: true },
        { segment: " ", isWord: false },
        { segment: "!", isWord: true },
        { segment: " ", isWord: false },
        { segment: "def", isWord: true },
      ],
    );

    assert.deepStrictEqual(
      extension.stringToSegments(["abc", "!", "def"], extension.PURPOSE.delete),
      [
        { segment: "abc", isWord: true },
        { segment: "!", isWord: true },
        { segment: "def", isWord: true },
      ],
    );

    assert.deepStrictEqual(
      extension.stringToSegments(["abc", " ", "def"], extension.PURPOSE.delete),
      [
        { segment: "abc", isWord: true },
        { segment: " ", isWord: false },
        { segment: "def", isWord: true },
      ],
    );

    assert.deepStrictEqual(
      extension.stringToSegments(
        ["abc", "  ", "def"],
        extension.PURPOSE.delete,
      ),
      [
        { segment: "abc", isWord: true },
        { segment: "  ", isWord: true },
        { segment: "def", isWord: true },
      ],
    );

    assert.deepStrictEqual(
      extension.stringToSegments(
        ["abc", "\t\t", "def"],
        extension.PURPOSE.delete,
      ),
      [
        { segment: "abc", isWord: true },
        { segment: "\t\t", isWord: true },
        { segment: "def", isWord: true },
      ],
    );

    assert.deepStrictEqual(
      extension.stringToSegments(["-", "1"], extension.PURPOSE.selectLeft),
      [
        { segment: "-", isWord: false },
        { segment: "1", isWord: true },
      ],
    );
  });
});

async function setDefaultWordSeparators() {
  const waveDashUnifyConfig = vscode.workspace.getConfiguration("editor");
  await waveDashUnifyConfig.update(
    "wordSeparators",
    "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?",
    vscode.ConfigurationTarget.Global,
  );
}
