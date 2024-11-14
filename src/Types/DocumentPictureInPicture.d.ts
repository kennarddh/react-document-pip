/* eslint-disable @typescript-eslint/no-explicit-any */
// https://wicg.github.io/document-picture-in-picture/

declare global {
	interface DocumentPictureInPictureEventMap {
		enter: DocumentPictureInPictureEvent
	}

	interface DocumentPictureInPictureEvent extends Event {
		window: Window
	}

	interface DocumentPictureInPictureEventInit extends EventInit {
		window: Window
	}

	// eslint-disable-next-line no-redeclare
	declare const DocumentPictureInPictureEvent: {
		prototype: DocumentPictureInPictureEvent
		new (
			type: string,
			eventInitDict?: DocumentPictureInPictureEventInit,
		): DocumentPictureInPictureEvent
	}

	interface DocumentPictureInPictureOptions {
		width?: number
		height?: number
		disallowReturnToOpener?: boolean
		preferInitialWindowPlacement?: boolean
	}

	interface DocumentPictureInPicture extends EventTarget {
		window: Window

		requestWindow: (
			options?: DocumentPictureInPictureOptions,
		) => Promise<Window>

		onenter:
			| ((
					this: DocumentPictureInPicture,
					ev: DocumentPictureInPictureEvent,
			  ) => any)
			| null

		addEventListener<K extends keyof DocumentPictureInPictureEventMap>(
			type: K,
			listener: (
				this: Document,
				ev: DocumentPictureInPictureEventMap[K],
			) => any,
			options?: boolean | AddEventListenerOptions,
		): void
		addEventListener(
			type: string,
			listener: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions,
		): void
		removeEventListener<K extends keyof DocumentPictureInPictureEventMap>(
			type: K,
			listener: (
				this: Document,
				ev: DocumentPictureInPictureEventMap[K],
			) => any,
			options?: boolean | EventListenerOptions,
		): void
		removeEventListener(
			type: string,
			listener: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions,
		): void
	}

	interface Window {
		documentPictureInPicture?: DocumentPictureInPicture
	}
}

export {}
