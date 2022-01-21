import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
	return(
		<Tilt style={{ height: '150px', width: '150px', backgroundColor: 'royalblue' }} className = 'ma4 mt0 br2 shadow-2'>
	      <div className="pa2">
	        <img alt = 'logo' src = {brain}/>
	      </div>
	    </Tilt>
		)
}

export default Logo;

