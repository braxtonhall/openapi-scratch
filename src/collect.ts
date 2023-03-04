export const collect = (container: object, searchKey: string): unknown[] =>
	deduplicate(collectWithDuplicates(container, searchKey));

const deduplicate = <T>(values: T[]): T[] => [...new Set(values)];

const collectWithDuplicates = (container: object, searchKey: string): unknown[] => {
	try {
		return Object.entries(container).flatMap(([key, value]) => {
			if (key === searchKey) {
				return value;
			} else if (container && typeof container === "object") {
				return collect(value, searchKey);
			} else {
				return [];
			}
		});
	} catch {
		return [];
	}
};
