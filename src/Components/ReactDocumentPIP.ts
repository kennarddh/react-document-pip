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
}

export interface ReactDocumentPIPHandle {
	open: () => Promise<boolean>
	close: () => boolean
}

const ReactDocumentPIP = forwardRef<
	ReactDocumentPIPHandle,
	ReactDocumentPIPProps
>(function ReactDocumentPIP(
	{ children, onClose, onOpen, allowReopen = false },
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

	const Open = useCallback(async () => {
		if (window.documentPictureInPicture?.window && !allowReopen)
			return false

		const pipWindow = await window.documentPictureInPicture?.requestWindow({
			width: 200,
			height: 200,
		})

		if (!pipWindow) return false

		pipWindow?.addEventListener('pagehide', event => {
			onClose?.(event)
		})

		SetContainer(pipWindow?.document.body ?? null)

		return true
	}, [allowReopen, onClose])

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
