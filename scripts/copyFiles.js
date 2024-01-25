const description = "ここにこのプロジェクトの説明を記述すること。";

import fs from "fs";
import path from "path";
import clipboardy from "clipboardy";

// コピペから除外するファイル又はディレクトリ
const excludeFiles = [
  "node_modules",
  ".git",
  "dist",
  "blog",
  ".github",
  ".vscode",
  "biome.json",
  ".DS_Store",
  "Thumbs.db",
  "package-lock.json",
  "favicon.ico",
  ".gitignore",
  "tsconfig.json",
  "scripts",
  "vite.config.ts",
  "vite-env.d.ts",
  "tsconfig.node.json",
  "open-props.min.css",
];

function directoryContents(dir, depth = 0) {
  let output = "";

  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (excludeFiles.includes(file)) continue;

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      output += `${" ".repeat(depth * 2)}Dir: ${file}\n`;
      output += directoryContents(filePath, depth + 1);
    } else {
      output += `${" ".repeat(depth * 2)}File: ${file}\n${fs.readFileSync(
        filePath,
        "utf8",
      )}\n`;
    }
  }

  return output;
}

const excludeTreeFiles = ["node_modules", ".git", "dist", ".DS_Store"];

function tree(dir, indent = 0) {
  let output = "";
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (excludeTreeFiles.includes(file)) continue;

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    output += `${" ".repeat(indent * 2)}${
      stat.isDirectory() ? "Dir" : "File"
    }: ${file}\n`;

    if (stat.isDirectory()) {
      output += tree(filePath, indent + 1);
    }
  }

  return output;
}

const treeOutput = tree(process.cwd());
const contents = directoryContents(process.cwd());
const combinedOutput = `${description}\n\n${treeOutput}\n\n${contents}`;

clipboardy.writeSync(combinedOutput);
console.log("コピーしました");
