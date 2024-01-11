// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "word-divider" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "word-divider.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from Word Divider!");
    },
  );

  context.subscriptions.push(disposable);
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
 * @param wordSeparetors 単語の区切り文字
 */
export function getWordSeparatorsRegExp(wordSeparetors: string) {
  const wordSeparatorsArray = wordSeparetors.split("");
  let wordSeparatorsRegExp = "([";

  for (const wordSeparator of wordSeparatorsArray) {
    wordSeparatorsRegExp += escapeRegExp(wordSeparator);
  }

  wordSeparatorsRegExp += "]+)";

  return new RegExp(wordSeparatorsRegExp, "g");
}

/**
 * スペースで分割する
 * - スペースは残る
 * - スペースのみの要素が連続している場合に、連続したスペースの要素を1つにまとめる
 * @param stringArray スペースで分割する文字列の配列
 *
 * @todo スペースのみの要素が連続している場合に、連続したスペースの要素を1つにまとめる
 */
export function splitBySpace(stringArray: string[]) {
  let result: string[] = [];

  for (const string of stringArray) {
    result = result.concat(string.split(/([\s]+)/g).filter((word) => word));
  }

  // スペースのみの要素が連続している場合に、連続したスペースの要素を1つにまとめる
  // 入力: [" ", " ", "a", " ", " ", "b", " ", " ", "c", " "]
  // 期待値: ["  ", "a", "  ", "b", "  ", "c", " "]

  const pattern = /^\s+$/g;
  for (let i = 0; i < result.length - 1; i++) {
    if (result[i].match(pattern)) {
      if (result[i + 1].match(pattern)) {
        result[i] = result[i] + result[i + 1];
        result.splice(i + 1, 1);
      }
    }
  }

  return result;
}

// This method is called when your extension is deactivated
export function deactivate() {}
