import React, {Component} from 'react';
import Particles from 'react-tsparticles';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';

const particlesOptions = {
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 2,
      },
      repulse: {
        distance: 150,
      },
    },
  },
  particles: {
    color: {
      value: "#AA3F39",
    },
    links: {
      color: "#403075",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 0.5,
    },
    collisions: {
      enable: true,
    },
    move: {
      enable: true,
      outMode: "bounce",
      speed: 0.5,
    },
    number: {
      density: {
        enable: true,
        value_area: 800,
      },
      value: 100,
    },
    opacity: {
      value: 0.75,
    },
  },
  detectRetina: true,
};

const innitialState =  {
  input:'',
  imageUrl:'',
  box:{},
  route: 'signIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = innitialState
  }

loadUser = (data) => {
  this.setState({
    user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }
  })
}

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  this.setState({box: box})
}

onInputChange = (event) => {
  this.setState({input: event.target.value});
}

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
  fetch('https://desolate-temple-40756.herokuapp.com/imageurl', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
    input: this.state.input
    })
  })
  .then(response => response.json())
  .then(response => {
    if (response) {
      fetch('https://desolate-temple-40756.herokuapp.com/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
        id: this.state.user.id
        })
      })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, {entries: count}))
      })
      .catch(console.log)
    }
    this.displayFaceBox(this.calculateFaceLocation(response))
    })
  // loop to detect multiple faces
    // let respLength = response.outputs[0].data.regions.length;
    // for (let i=0; i<respLength; i++) {
    //   console.log(response.outputs[0].data.regions[i].region_info.bounding_box);
    // }
  .catch(err => console.log(err))
}

onRouteChange = (route) => {
  if (route === 'signOut') {
    this.setState(innitialState)
  } else if (route === 'home'){
    this.setState({isSignedIn: true})
  }
  this.setState({route: route})
}

render() {
  const {isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
      <Particles className='particles'
        options={particlesOptions}
      />
      <Navigation
      isSignedIn={isSignedIn} 
      onRouteChange={this.onRouteChange}
      />
      {
        route === 'home' ?
        <div>
          <Logo/>
          <Rank 
          name={this.state.user.name} 
          entries={this.state.user.entries}
          />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition
            box={box}
            imageUrl={imageUrl}
          />
        </div>
        : (
          route === 'signIn' ?
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          :
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;