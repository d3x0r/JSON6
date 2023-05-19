export {};

declare global {
	var toJSOX: (() => void) | undefined;
	interface Object {
		ttt?: () => void;
	}
}
