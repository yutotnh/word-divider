import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import * as extension from "../extension";
// import * as myExtension from '../../extension';

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });

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
    assert.deepStrictEqual(
      [" ", "a", " ", "b", " ", "c", " "],
      extension.splitBySpace([" a b c "]),
    );

    // スペースで分割されるか確認する
    assert.deepStrictEqual(
      [" ", "a", "b", "c"],
      extension.splitBySpace([" a", "b", "c"]),
    );

    // スペースで分割されるか確認する
    assert.deepStrictEqual(
      ["a", " ", "b", "c"],
      extension.splitBySpace(["a ", "b", "c"]),
    );

    // スペースで分割されるか確認する
    assert.deepStrictEqual(
      ["a", " ", "b", "c"],
      extension.splitBySpace(["a", " b", "c"]),
    );

    // スペースで分割されるか確認する
    assert.deepStrictEqual(
      ["a", "b", " ", "c"],
      extension.splitBySpace(["a", "b ", "c"]),
    );

    // スペースで分割されるか確認する
    assert.deepStrictEqual(
      ["a", "b", " ", "c"],
      extension.splitBySpace(["a", "b", " c"]),
    );

    // スペースで分割されるか確認する
    assert.deepStrictEqual(
      ["a", "b", "c", " "],
      extension.splitBySpace(["a", "b", "c "]),
    );

    // スペースで分割されるか確認する
    assert.deepStrictEqual(
      ["a", " ", "b", " ", "c"],
      extension.splitBySpace(["a", " b ", "c"]),
    );

    // スペースで分割されるか確認する
    assert.deepStrictEqual(
      ["a", "   ", "b", "c"],
      extension.splitBySpace(["a ", "  b", "c"]),
    );
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

    // 生成した正規表現で文字列が分割されるか確認する
    assert.deepStrictEqual(
      ["a", ".", "b", ".", "c"],
      "a.b.c".split(extension.getWordSeparatorsRegExp(".*")),
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
  test("splitByWordSeparetors", async () => {
    // テストで用いる区切り文字を設定するためデフォルトのeditor.wordSeparatorsを設定する
    await setDefaultWordSeparators();

    // 区切り文字で分割されることを確認する
    assert.deepStrictEqual(
      ["a", ",", "b", "c"],
      extension.splitByWordSeparetors(["a,", "b", "c"]),
    );

    // 区切り文字で分割されることを確認する
    assert.deepStrictEqual(
      [".", "a", "b", "c"],
      extension.splitByWordSeparetors([".a", "b", "c"]),
    );

    // 区切り文字が連続しているときに一つの要素にまとめられることを確認する
    assert.deepStrictEqual(
      ["a", ".|", "b", "c"],
      extension.splitByWordSeparetors(["a.", "|b", "c"]),
    );
  }).timeout("20s");

  test("splitByWord", () => {
    // 単語で分割されることを確認する
    assert.deepStrictEqual(
      ["単語", "で", "分割"],
      extension.splitByWord(["単語で分割"]),
    );

    // 複数の単語で分割されることを確認する
    assert.deepStrictEqual(
      ["分かち書き", "は", "素晴らしい", "!"],
      extension.splitByWord(["分かち書きは", "素晴らしい!"]),
    );

    // 連結した英単語は分割されないことを確認する
    assert.deepStrictEqual(
      ["concatenatedWords"],
      extension.splitByWord(["concatenatedWords"]),
    );
  });

  // vscodeの設定を変更・取得するのは時間がかかりデフォルトのタイムアウト時間では間に合わない場合がある
  // そのため、確実にテストが完了するようにテストのタイムアウト時間を20sにする
  test("split", async () => {
    // テストで用いる区切り文字を設定するためデフォルトのeditor.wordSeparatorsを設定する
    await setDefaultWordSeparators();

    assert.deepStrictEqual(
      ["a", " ", "b", " ", "c"],
      extension.splitByAll(["a b c"]),
    );

    assert.deepStrictEqual(
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
      extension.splitByAll(["editor.wordSeparatorsで指定された文字で分割する"]),
    );
  }).timeout("20s");

  test("wordLeftPosition", () => {
    const segments = [
      { segment: "abc", isWord: true },
      { segment: " ", isWord: false },
      { segment: "def", isWord: true },
    ];

    assert.deepStrictEqual(extension.wordLeftPosition(segments, 0), -1);
    assert.deepStrictEqual(extension.wordLeftPosition(segments, 1), 0);
    assert.deepStrictEqual(extension.wordLeftPosition(segments, 2), 0);
    assert.deepStrictEqual(extension.wordLeftPosition(segments, 3), 0);

    assert.deepStrictEqual(extension.wordLeftPosition(segments, 4), 0);
    assert.deepStrictEqual(extension.wordLeftPosition(segments, 5), 4);
    assert.deepStrictEqual(extension.wordLeftPosition(segments, 6), 4);
    assert.deepStrictEqual(extension.wordLeftPosition(segments, 7), 4);

    // 空行の場合は-1を返すことの確認
    assert.deepStrictEqual(extension.wordLeftPosition([], 0), -1);
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
    assert.deepStrictEqual(extension.wordEndRightPosition(segments, 0), 3);
    assert.deepStrictEqual(extension.wordEndRightPosition(segments, 1), 3);
    assert.deepStrictEqual(extension.wordEndRightPosition(segments, 2), 3);

    // "."
    assert.deepStrictEqual(extension.wordEndRightPosition(segments, 3), 4);

    // " "
    assert.deepStrictEqual(extension.wordEndRightPosition(segments, 4), 8);

    // "def"
    assert.deepStrictEqual(extension.wordEndRightPosition(segments, 5), 8);
    assert.deepStrictEqual(extension.wordEndRightPosition(segments, 6), 8);
    assert.deepStrictEqual(extension.wordEndRightPosition(segments, 7), 8);
    assert.deepStrictEqual(extension.wordEndRightPosition(segments, 8), 9);

    // " "
    assert.deepStrictEqual(extension.wordEndRightPosition(segments, 9), -1);

    // 空行の場合は-1を返すことの確認
    assert.deepStrictEqual(extension.wordEndRightPosition([], 0), -1, "empty");
  });

  test("stringToSegments", () => {
    assert.deepStrictEqual(
      [
        { segment: "abc", isWord: true },
        { segment: " ", isWord: false },
        { segment: "def", isWord: true },
      ],
      extension.stringToSegments(["abc", " ", "def"], 1),
    );

    assert.deepStrictEqual(
      [
        { segment: "abc", isWord: true },
        { segment: "!", isWord: false },
        { segment: "def", isWord: true },
      ],
      extension.stringToSegments(
        ["abc", "!", "def"],
        extension.Purpose.SelectLeft,
      ),
    );

    assert.deepStrictEqual(
      [
        { segment: "abc", isWord: true },
        { segment: "!", isWord: false },
        { segment: " ", isWord: false },
        { segment: "def", isWord: true },
      ],
      extension.stringToSegments(
        ["abc", "!", " ", "def"],
        extension.Purpose.SelectLeft,
      ),
    );

    assert.deepStrictEqual(
      [
        { segment: "abc", isWord: true },
        { segment: "!", isWord: true },
        { segment: " ", isWord: false },
        { segment: "def", isWord: true },
      ],
      extension.stringToSegments(
        ["abc", "!", " ", "def"],
        extension.Purpose.SelectRight,
      ),
    );

    assert.deepStrictEqual(
      [
        { segment: "abc", isWord: true },
        { segment: "!/", isWord: true },
        { segment: " ", isWord: false },
        { segment: "def", isWord: true },
      ],
      extension.stringToSegments(
        ["abc", "!/", " ", "def"],
        extension.Purpose.SelectLeft,
      ),
    );

    assert.deepStrictEqual(
      [
        { segment: "abc", isWord: true },
        { segment: "!/", isWord: true },
        { segment: "def", isWord: true },
      ],
      extension.stringToSegments(
        ["abc", "!/", "def"],
        extension.Purpose.SelectRight,
      ),
    );

    assert.deepStrictEqual(
      [
        { segment: "abc", isWord: true },
        { segment: " ", isWord: false },
        { segment: "!", isWord: true },
        { segment: " ", isWord: false },
        { segment: "def", isWord: true },
      ],
      extension.stringToSegments(
        ["abc", " ", "!", " ", "def"],
        extension.Purpose.SelectLeft,
      ),
    );

    assert.deepStrictEqual(
      [
        { segment: "abc", isWord: true },
        { segment: "!", isWord: true },
        { segment: "def", isWord: true },
      ],
      extension.stringToSegments(["abc", "!", "def"], extension.Purpose.Delete),
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
