import { FC, useRef, useState } from 'react'

import styled from 'styled-components'

import ReactDocumentPIP, {
	ReactDocumentPIPHandle,
} from 'Components/ReactDocumentPIP'

import './style.css'

const StyledPIPTitle = styled.h2`
	color: green;
`

const PIPSet: FC = () => {
	const [IsOpen, SetIsOpen] = useState(false)

	const ReactDocumentPIPRef = useRef<ReactDocumentPIPHandle>(null)

	return (
		<>
			<p>Currently {IsOpen ? 'opened' : 'closed'}</p>
			<button
				onClick={async () => {
					console.log(
						'Open PIP with handle',
						await ReactDocumentPIPRef.current?.open({
							allowReopen: true,
						}),
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
				<StyledPIPTitle>It&apos;s real!!!</StyledPIPTitle>
				<p className='pipParagraph'>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Tempora aliquam unde rem repudiandae assumenda dolorum,
					soluta nam modi doloremque quas.
				</p>
			</ReactDocumentPIP>
		</>
	)
}

const App: FC = () => {
	return (
		<div>
			<h1>Document Picture In Picture</h1>
			<PIPSet />
		</div>
	)
}

export default App
