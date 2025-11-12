import { runBuild } from "hohoro/legacy";

await runBuild({
	rootDirectory: process.cwd(),
	logger: console,
});
