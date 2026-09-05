import { readFile } from "node:fs/promises";
import ts from "typescript";

// Compile the real source in memory; keep tests independent of the UI bundler.
export async function loadTs(path, replacements = {}) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  for (const [specifier, url] of Object.entries(replacements))
    outputText = outputText.replaceAll(`"${specifier}"`, JSON.stringify(url));
  const url = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  return { module: await import(url), url };
}
