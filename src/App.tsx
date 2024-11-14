import { FC, useRef, useState } from 'react'

import ReactDocumentPIP, {
	ReactDocumentPIPHandle,
} from 'Components/ReactDocumentPIP'

const App: FC = () => {
	const [IsOpen, SetIsOpen] = useState(false)

	const ReactDocumentPIPRef = useRef<ReactDocumentPIPHandle>(null)

	return (
		<div>
			<h1>Document Picture In Picture</h1>
			<p>Currently {IsOpen ? 'opened' : 'closed'}</p>
			<button
				onClick={async () => {
					console.log(
						'Open PIP with handle',
						await ReactDocumentPIPRef.current?.open(),
					)
				}}
			>
				Open!
			</button>
			<button
				onClick={() =>
					console.log(
						'Close PIP with handle',
						ReactDocumentPIPRef.current?.close(),
					)
				}
			>
				Close!
			</button>
			<ReactDocumentPIP
				ref={ReactDocumentPIPRef}
				onOpen={event => {
					console.log('Open PIP', event)

					SetIsOpen(true)
				}}
				onClose={event => {
					console.log('Close PIP', event)

					SetIsOpen(false)
				}}
			>
				<h2>It&apos;s real!!!</h2>
			</ReactDocumentPIP>
		</div>
	)
}

export default App
