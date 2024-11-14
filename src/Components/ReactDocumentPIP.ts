import {
	ReactNode,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react'

import { createPortal } from 'react-dom'

export interface ReactDocumentPIPProps {
	children: ReactNode
	onClose?: (event: PageTransitionEvent) => void
	onOpen?: (event: DocumentPictureInPictureEvent) => void
	allowReopen?: boolean
	disallowReturnToOpener?: boolean
	preferInitialWindowPlacement?: boolean
	width?: number
	height?: number
}

export interface ReactDocumentPIPHandle {
	open: () => Promise<boolean>
	close: () => boolean
}

const ReactDocumentPIP = forwardRef<
	ReactDocumentPIPHandle,
	ReactDocumentPIPProps
>(function ReactDocumentPIP(
	{
		children,
		onClose,
		onOpen,
		allowReopen = false,
		disallowReturnToOpener = false,
		preferInitialWindowPlacement = false,
		width = 200,
		height = 200,
	},
	ref,
) {
	const [Container, SetContainer] = useState<HTMLElement | null>(null)

	useEffect(() => {
		const eventHandler = (event: DocumentPictureInPictureEvent) => {
			onOpen?.(event)
		}

		window.documentPictureInPicture?.addEventListener('enter', eventHandler)

		return () =>
			window.documentPictureInPicture?.removeEventListener(
				'enter',
				eventHandler,
			)
	}, [onOpen])

	const ReloadPIPWindowStyles = useCallback(() => {
		if (!window.documentPictureInPicture) return

		const previousStyleNodes =
			window.documentPictureInPicture.window.document.querySelectorAll(
				'[data-injected-pip-style]',
			)

		for (const previousStyleNode of previousStyleNodes) {
			previousStyleNode.remove()
		}

		for (const styleSheet of document.styleSheets) {
			try {
				const cssRules = [...styleSheet.cssRules]
					.map(rule => rule.cssText)
					.join('')

				const style = document.createElement('style')

				style.dataset['injectedPipStyle'] = 'true'

				style.textContent = cssRules

				window.documentPictureInPicture.window.document.head.appendChild(
					style,
				)
			} catch {
				const link = document.createElement('link')

				link.rel = 'stylesheet'
				link.type = styleSheet.type
				link.dataset['injectedPipStyle'] = 'true'

				if (styleSheet.media) link.media = styleSheet.media.toString()
				if (styleSheet.href) link.href = styleSheet.href

				window.documentPictureInPicture.window.document.head.appendChild(
					link,
				)
			}
		}
	}, [])

	useEffect(() => {
		const anyStyleChanged = (mutation: MutationRecord) => {
			if (mutation.target.nodeName === 'STYLE') return true

			for (const addedNode of mutation.addedNodes) {
				if (addedNode.nodeName === 'STYLE') return true
			}

			for (const removedNode of mutation.removedNodes) {
				if (removedNode.nodeName === 'STYLE') return true
			}

			return false
		}

		const observer = new MutationObserver(mutationList => {
			for (const mutation of mutationList) {
				if (mutation.type !== 'childList') continue

				if (anyStyleChanged(mutation)) {
					ReloadPIPWindowStyles()

					break
				}
			}
		})

		observer.observe(document, {
			attributes: false,
			subtree: true,
			childList: true,
		})

		return () => observer.disconnect()
	}, [ReloadPIPWindowStyles])

	const Open = useCallback(async () => {
		if (window.documentPictureInPicture?.window && !allowReopen)
			return false

		const pipWindow = await window.documentPictureInPicture?.requestWindow({
			width,
			height,
			disallowReturnToOpener,
			preferInitialWindowPlacement,
		})

		if (!pipWindow) return false

		pipWindow?.addEventListener('pagehide', event => {
			onClose?.(event)
		})

		ReloadPIPWindowStyles()

		SetContainer(pipWindow?.document.body ?? null)

		return true
	}, [
		ReloadPIPWindowStyles,
		allowReopen,
		disallowReturnToOpener,
		height,
		onClose,
		preferInitialWindowPlacement,
		width,
	])

	const Close = useCallback(() => {
		if (!window.documentPictureInPicture) return false

		window.documentPictureInPicture?.window?.close()

		SetContainer(null)

		return true
	}, [])

	useImperativeHandle(ref, () => ({
		open: Open,
		close: Close,
	}))

	return Container ? createPortal(children, Container) : null
})

export default ReactDocumentPIP
