export const collect = (container: object, searchKey: string): unknown[] => {
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
