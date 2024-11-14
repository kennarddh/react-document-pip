import { FC, useRef } from 'react'

import ReactDocumentPIP, {
	ReactDocumentPIPHandle,
} from 'Components/ReactDocumentPIP'

const App: FC = () => {
	const ReactDocumentPIPRef = useRef<ReactDocumentPIPHandle>(null)

	return (
		<div>
			<h1>Document Picture In Picture</h1>
			<button
				onClick={() =>
					console.log(
						'Open PIP with handle',
						ReactDocumentPIPRef.current?.Open(),
					)
				}
			>
				Open!
			</button>
			<button
				onClick={() =>
					console.log(
						'Close PIP with handle',
						ReactDocumentPIPRef.current?.Close(),
					)
				}
			>
				Close!
			</button>
			<ReactDocumentPIP
				ref={ReactDocumentPIPRef}
				onOpen={event => console.log('Open PIP', event)}
				onClose={event => console.log('Close PIP', event)}
			>
				<h2>It&apos;s real!!!</h2>
			</ReactDocumentPIP>
		</div>
	)
}

export default App
