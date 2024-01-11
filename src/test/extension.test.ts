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
});
