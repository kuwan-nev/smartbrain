import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
	return(
		<div>
			<p className='f3'>
				This Magic Brain detect faces in pictures
			</p>
			<div>
				<div className='form pa4 br3 shadow-5 center w-80'>
					<input className='f4 pa2 w-80' type='text' onChange={onInputChange}/>
					<button
					 className='w-20 grow f4 link ph3 pv2 dib white bg-gray'
					 onClick={onButtonSubmit}
					>Detect</button>
				</div>
			</div>
		</div>
	)
}

export default ImageLinkForm;