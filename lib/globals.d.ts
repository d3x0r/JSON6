export {};

declare global {
	// Optional global hook some external serializers (e.g. JSOX) attach;
	// when present, JSON6.stringify defers object encoding decisions to it.
	var toJSOX: (() => void) | undefined;
}
