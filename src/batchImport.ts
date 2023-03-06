import { promises as fs, existsSync } from 'fs';
import path from "path";

type Import = Record<string | symbol, unknown>;

/**
 * Recursively lists all files in a directory, with the files full path starting with
 * the provided `path`
 * @param path
 */
const fileSystemList = async (path: string): Promise<string[]> => {
	if (existsSync(path)) {
		return listDirectoryEntry(path);
	} else if (existsSync(`${path}.ts`)) {
		return [`${path}.ts`];
	} else if (existsSync(`${path}.js`)) {
		return [`${path}.js`];
	} else {
		throw new Error(`Supplied module/directory "${path}" does not exist`);
	}
};

const listDirectory = async (directory: string): Promise<string[]> => {
	try {
		const shallowEntries = await fs.readdir(directory);
		const futureEntries = shallowEntries
			.map((entry) => `${directory}/${entry}`)
			.map(listDirectoryEntry);
		return Promise.all(futureEntries).then((entries) => entries.flat());
	} catch (error) {
		console.error(`Could not read directory "${directory}"`, error);
		throw new Error(`Supplied path "${directory}" could not be read as a directory`);
	}
};

const listDirectoryEntry = async (path: string) => {
	const stats = await fs.stat(path);
	if (stats.isDirectory()) {
		return listDirectory(path);
	} else {
		return [path];
	}
};

/**
 * Chooses which files should be used to import.
 * @param files
 */
const selectFiles = (files: string[]): string[] => {
	const postfix = /\.[jt]s$/;
	const nodeFiles = files.filter((name) => name.match(postfix)).map((name) => name.replace(postfix, ''));
	return [...new Set(nodeFiles)];
};

const importFile = (file: string): Promise<Import> =>
	import(file).catch((error) => {
		// istanbul ignore next: this really should never happen
		console.error(`Could not import "${file}"`, error);
		// istanbul ignore next: this really should never happen
		return {};
	});

const batchImport = async (directory: string): Promise<Import[]> => {
	if (path.isAbsolute(directory)) {
		const files = await fileSystemList(directory).then(selectFiles);
		const futureImportedFiles = files.map(importFile);
		return Promise.all(futureImportedFiles);
	} else {
		throw new Error("Argument bound to directory must be absolute");
	}
};

export { batchImport };
