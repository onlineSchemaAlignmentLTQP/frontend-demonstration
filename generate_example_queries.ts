import { readdir } from "node:fs/promises";
import { join } from "node:path";
import config from "./config.json";

const multipleVocabHostName:string = config["multipleVocabHostName"];
const originalQueryHostName = "http://localhost:4099";

async function readQueriesFromFiles(folderPath: string): Promise<Record<string, string>>  {
  const files = await readdir(folderPath, { withFileTypes: true });

  const fileContents: Record<string, string> = {};

  for (const file of files) {
    if (file.isFile()) {
      const filePath = join(folderPath, file.name);
      const text = await Bun.file(filePath).text();
      fileContents[file.name.replace(".rq", "")] = text.replaceAll(originalQueryHostName, multipleVocabHostName);
    }
  }

  return fileContents;
}

async function readQueriesWithRulesFromFiles(folderPath: string): Promise<Record<string, {query:string, rules:string}>>  {
  const files = await readdir(folderPath, { withFileTypes: true });

  const fileContents: Record<string, {query:string, rules:string}> = {};

  for (const file of files) {
    if (file.isFile()) {
      const filePath = join(folderPath, file.name);
      const filePathRules = join(folderPath, "rules", file.name.replace(".rq", ".ttl"));
      const text = await Bun.file(filePath).text();
      const rules = await Bun.file(filePathRules).text();

      fileContents[file.name.replace(".rq", "")] = {
          query:text.replaceAll(originalQueryHostName, multipleVocabHostName),
          rules:rules.replaceAll(originalQueryHostName, multipleVocabHostName)
        };
    }
  }

  return fileContents;
}

const folderQuery = "./example_queries/queries";
const folderQueryDifferentVocab = "./example_queries/queries_multiple_vocab";
const queryJson = await readQueriesFromFiles(folderQuery);
const queryWithRulesJson = await readQueriesWithRulesFromFiles(folderQueryDifferentVocab);

const queryStringJson = JSON.stringify(queryJson, null, 2);
const queryWithRuleJson = JSON.stringify(queryWithRulesJson, null, 2);

await Bun.write("./example_queries/network.json", queryStringJson);
await Bun.write("./example_queries/multipleVocab.json", queryWithRuleJson);
