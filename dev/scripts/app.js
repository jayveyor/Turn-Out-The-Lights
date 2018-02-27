import React from 'react';
import ReactDOM from 'react-dom';
import Game from './game';
import User from './user';
import Flashlight from './flashlight';
import Overlay from './Overlay';


var config = {
  apiKey: "AIzaSyDWFMkKgdoclhdeAYPJNIZpOWvJnOGrrIQ",
  authDomain: "turn-out-the-lights.firebaseapp.com",
  databaseURL: "https://turn-out-the-lights.firebaseio.com",
  projectId: "turn-out-the-lights",
  storageBucket: "turn-out-the-lights.appspot.com",
  messagingSenderId: "556999435071"
};

firebase.initializeApp(config);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      createEmail: '',
      createPassword: '',
      loginEmail: '',
      loginPassword: '',
      loggedIn: false,
      characterName: '',
      newUser: false,
      health:5,
      battery: 1,
      flashlight: true,
      batteryLife: 4,
      locationX: 0,
      locationY: 0,
      pain:1,
      objectGathered: false,
      // nameCharacter: ''
      mute:false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.createUser = this.createUser.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.addName = this.addName.bind(this);
    this.clickFlashlight = this.clickFlashlight.bind(this);
    this.moveForward = this.moveForward.bind(this);
    this.moveBack = this.moveBack.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.decreasePower = this.decreasePower.bind(this);
    this.decreaseHealth = this.decreaseHealth.bind(this);
    this.youLose = this.youLose.bind(this);
    this.youWin = this.youWin.bind(this);
    this.resetLocation = this.resetLocation.bind(this);
    this.collectBattery = this.collectBattery.bind(this);
    this.objectGathered = this.objectGathered.bind(this);
    this.mute = this.mute.bind(this);

  }
  handleChange(event, field) {
    const newState = Object.assign({}, this.state);
    newState[field] = event.target.value;
    this.setState(newState);
  }

  addName(event) {
    event.preventDefault();
    this.state.newUser= false;
    const characterName = this.state.characterName;
    const dbref = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`);
      dbref.push(this.state.characterName);
    return characterName;
  }

  signOut() {
    firebase.auth().signOut().then(function (success) {
      console.log('Signed out!')
    }, function (error) {
      console.log(error);
    });
    // this.setState({
    //   newUser: true,
    // });
  }

  createUser(event) {
    event.preventDefault();
    const email = this.state.createEmail;
    const password = this.state.createPassword;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch((error) => console.log(error.code, error.message));

  }
  signIn(event) {
    event.preventDefault();
    const email = this.state.loginEmail;
    const password = this.state.loginPassword;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((success) => {
        console.log(`Logged in as ${success.email}`);
      }), (error) => {
        console.log(error);
      }
    provider.setCustomParameters({
      prompt: 'select_account'
    });
  }

  loginPage(event) {
    event.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;

      // Get the signed-in user info.
      const user = result.user;
      // ...
    }).catch(function (error) {
      // Error handling goes in here.
      console.log(error)
    });
  }
// To be imlemented in the future for the user page/character text
  // typeIn () {
  //   //function call to make typing happen will have to place into window init function
  //   sort('letter1', 300);
  //   sort('letter2', 800);
    

  //   //function for copying letters in paragragh to array and starting the typing method call
  //   function sort(className, delay) {
  //     let letters1 = $(`.${className}`).text().split('');
  //     $(`.${className}`).text('');
  //     setTimeout(typing, delay, `${className}`, letters1);
  //   }

  //   //function to star pushing characters to be typed
  //   function typing(para, letters) {

  //     function type(input, inputArray) {

  //       $(`.${input}`).append(`<span>${inputArray[index]}</span>`);
  //       index = index + 1;

  //       if (index == inputArray.length) {
  //         //stop call of setInterval Method
  //         clearInterval(interval);
  //       }
  //     }

  //     //variables for tracking
  //     const counter = 0;
  //     var index;

  //     index = counter;
  //     var interval = setInterval(type, 80, para, letters);
  //   }
  // }

  componentDidMount() {
    
    var obj = document.createElement("audio");
    obj.src = "../../background4.wav";
    obj.volume = .7;
    obj.loop = true;
    obj.preLoad = true;
    if (this.state.mute === true) {
      obj.pause();
      console.log('wow')
    } else {
      obj.play();
      console.log('wowasdas')
    }
    firebase.auth().onAuthStateChanged((user) => {
      
      if (user) {
       const dbref = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`);
        dbref.on('value', (snapshot) => {
            const data = snapshot.val();
            console.log(data);

            const state = [];
            for (let key in data) {
              state.push(data[key]);
            }
            this.setState({
              loggedIn: true,
              characterName: state,      
            });
        });
        
      } else {
        this.setState({ 
          loggedIn: false,
            newUser: true,
          });
      }
    });
  }

  clickFlashlight(){
    if (this.state.flashlight) {
      this.setState({
        flashlight: false,
      });
    } else {
      this.setState({
        flashlight: true,
      });
    }
     let flashlight = this.state.flashlight;
      console.log(flashlight);
      return flashlight;
  }

  decreasePower() {
    this.setState({
      pain: 1,
    });
    if (this.state.batteryLife <= 1) {
      if (this.state.battery <= 0) {
        this.setState({
          batteryLife: this.state.batteryLife - 1,
        });
      } else {
      this.setState({
        battery: this.state.battery - 1,
        });
        this.setState({
          batteryLife: 4,
        });
      }
    } else {
    this.setState({
      batteryLife: this.state.batteryLife - 1,
    });
    
  }
  }

  decreaseHealth() {

    var obj = document.createElement("audio");
    obj.src = "../../pain.wav";
    obj.volume = 1;
    obj.autoPlay = false;
    obj.preLoad = true;
    obj.play();
    this.setState({
      health: this.state.health - 1,
    });
    if (this.state.health <= 1 ) {
      this.youLose();
    }

    if (this.state.pain === 1) {
      this.setState({
        pain: 2,
      });
    } else if(this.state.pain === 2) {
      this.setState({
        pain: 3,
      });
  } else {
      this.setState({
        pain: 2,
      });
  }

}
  moveForward(event) {
    event.preventDefault();
    this.setState({
      locationY: this.state.locationY + 1 ,
    });

    console.log(this.state.locationY);
    if (this.state.flashlight === false) {
      this.decreaseHealth();
    }
    else if (this.state.batteryLife <= 0 ) {
      this.decreaseHealth();
    } else {
      this.decreasePower();
    }

    this.setState({
      objectGathered: false,
    });
      }

  moveRight(event) {
    event.preventDefault();
    this.setState({
      locationX: this.state.locationX + 1,
    });
    if (this.state.flashlight === false) {
      this.decreaseHealth();
    }
    else if (this.state.batteryLife <= 0) {
      this.decreaseHealth();
    } else {
      this.decreasePower();
    }
    this.setState({
      objectGathered: false,
    });
  };

  moveBack(event) {
    event.preventDefault();
    this.setState({
      locationY: this.state.locationY - 1,
    });
    if (this.state.flashlight === false) {
      this.decreaseHealth();
    }
    else if (this.state.batteryLife <= 0) {
      this.decreaseHealth();
    } else {
      this.decreasePower();
    }
    this.setState({
      objectGathered: false,
    });
  }

  moveLeft(event) {
    event.preventDefault();
    this.setState({
      locationX: this.state.locationX - 1,
    });
    if (this.state.flashlight === false) {
      this.decreaseHealth();
    }
    else if (this.state.batteryLife <= 0) {
      this.decreaseHealth();
    } else {
      this.decreasePower();
    }
    this.setState({
      objectGathered: false,
    });
  };

  resetLocation(){
    this.setState({
      locationX: 0,
      locationY: 0,
    });
  }
  youWin(){
    alert("you win?");
  }
  youLose() {
    alert("you lose");
  }

  collectBattery(){
    if (this.state.battery === 0) {
      this.setState({
        batteryLife: 4,
      });
    } else {
    this.setState({
      battery: this.state.battery + 1,
    });}
    this.objectGathered();
  }

  objectGathered() {
    this.setState({
      objectGathered: true,
    });
  }

  mute() {

    if (this.state.mute) {
      this.setState({
        mute: false,
      })

    }else {
      this.setState({
        mute: true,
      })
    }

  }


  render() {
    let signOut = (<button className="signOut" onClick={this.signOut}>Sign Out</button>)
    let objCont;

    if (this.state.objectGathered) {
     objCont = (
       'hide'
     )
    } else {
      objCont = (
        'show'
      )
    };

    let painOverlay;
    if (this.state.pain === 1) {
      painOverlay = (
          <div className="fine">
          </div>
      )
    } else if (this.state.pain === 2){
      painOverlay = (
        <div className="pain">
        </div>
      )
  } else {
      painOverlay = (
        <div className="pain2">
        </div>
      )
  }

    let onOffImg;
      if (this.state.flashlight) {
        onOffImg = (<img src="../../flashlight-on.png" alt="your flashlight" />)
      } else {
        onOffImg = (<img src="../../flashlight-off.png" alt="your flashlight" />)
      };
      let onOff;
      if (this.state.flashlight) {
        onOff = (`light`)
      } else {
        onOff = (`dark`)
      };
    let gameObject;
   let location;
   let buttons;
    if (this.state.locationX === 0 && this.state.locationY === 0 ) {
      // start point
      location = ( <div className="background location1"></div>
      )
      buttons = (
      <div className="navigation">
        <div className="grid">
            <button className="moveForward" onClick={this.moveForward}>up</button>
            <button disabled className="moveLeft" onClick={this.moveLeft}>left</button>
            <button disabled className="moveRight" onClick={this.moveRight}>right</button>
            <button disabled className="moveBack" onClick={this.moveBack}>back</button>
        </div></div>
      )

    } else if (this.state.locationX === 0 && this.state.locationY === 1 ){
      location = (<div className="background location5"></div>
      )
      // empty hall
      buttons = (
        <div className="navigation">
          <div className="grid">
            <button className="moveForward" onClick={this.moveForward}>up</button>
            <button disabled className="moveLeft" onClick={this.moveLeft}>left</button>
            <button disabled className="moveRight" onClick={this.moveRight}>right</button>
            <button className="moveBack" onClick={this.moveBack}>back</button>
          </div></div>
      )
    } else if (this.state.locationX === 0 && this.state.locationY === 2){
      location = (<div className="background location2"></div>
      )
      // right door
      buttons = (
        <div className="navigation">
          <div className="grid">
            <button  className="moveForward" onClick={this.moveForward}>up</button>
            <button  disabled className="moveLeft" onClick={this.moveLeft}>left</button>
            <button  className="moveRight" onClick={this.moveRight}>right</button>
            <button  className="moveBack" onClick={this.moveBack}>back</button>
          </div></div>
      )
    } else if (this.state.locationX === 1 && this.state.locationY === 2) {
      location = (<div className="background location3"></div>
      )
      // first room
      buttons = (
        <div className="navigation">
          <div className="grid">
            <button className="moveForward" onClick={this.moveForward}>up</button>
            <button className="moveLeft" onClick={this.moveLeft}>left</button>
            <button disabled className="moveRight" onClick={this.moveRight}>right</button>
            <button disabled className="moveBack" onClick={this.moveBack}>back</button>
          </div></div>
      )
    } else if (this.state.locationX === 1 && this.state.locationY === 3) {
      location = (<div className="background location4"></div>
      )
      // battery room
      gameObject = (<img className="battery" onClick={this.collectBattery} src="../../battery.png" alt="A Battery!" />)

      buttons = (
        <div className="navigation">
          <div className="grid">
            <button disabled className="moveForward" onClick={this.moveForward}>up</button>
            <button disabled className="moveLeft" onClick={this.moveLeft}>left</button>
            <button disabled className="moveRight" onClick={this.moveRight}>right</button>
            <button className="moveBack" onClick={this.moveBack}>back</button>
          </div></div>
      )
    } else if (this.state.locationX === 0 && this.state.locationY === 3) {
      location = (<div className="background location5"></div>
      )
      // empty hall
      buttons = (
        <div className="navigation">
          <div className="grid">
            <button className="moveForward" onClick={this.moveForward}>up</button>
            <button disabled className="moveLeft" onClick={this.moveLeft}>left</button>
            <button disabled className="moveRight" onClick={this.moveRight}>right</button>
            <button className="moveBack" onClick={this.moveBack}>back</button>
          </div></div>
      ) 
    } else if (this.state.locationX === 0 && this.state.locationY === 4) {
      location = (<div className="background location6"></div>
      )
      // left door 
      buttons = (
        <div className="navigation">
          <div className="grid">
            <button className="moveForward" onClick={this.moveForward}>up</button>
            <button className="moveLeft" onClick={this.moveLeft}>left</button>
            <button disabled className="moveRight" onClick={this.moveRight}>right</button>
            <button className="moveBack" onClick={this.moveBack}>back</button>
          </div></div>
      )
    }  else if (this.state.locationX === -1 && this.state.locationY === 4) {
      gameObject = (<img className ="ghoul" onClick={this.youWin} src="../../Ghoul.png" alt="Someone"/> )
      location = (<div className="background location7"></div>
      )
      // end room
      buttons = (
        <div className="navigation">
          <div className="grid">
            <button disabled className="moveForward" onClick={this.moveForward}>up</button>
            <button disabled className="moveLeft" onClick={this.moveLeft}>left</button>
            <button disabled className="moveRight" onClick={this.moveRight}>right</button>
            <button disabled className="moveBack" onClick={this.moveBack}>back</button>
          </div></div>
      )
    } else {
      this.resetLocation();

    }

    

    let batteryLife;
    if (this.state.batteryLife === 1) {
      batteryLife = (<div className="batteryLife"> <div className="powerLevel lowBattery"></div></div>
      )
    } else if (this.state.batteryLife === 2){
      batteryLife = (<div className="batteryLife"><div className="powerLevel"></div> <div className="powerLevel"></div>
       </div>
      )
    } else if (this.state.batteryLife === 3) {
      batteryLife = (<div className="batteryLife"><div className="powerLevel"></div><div className="powerLevel"></div> <div className="powerLevel"></div>
      </div>
      )
    } else if (this.state.batteryLife === 4) {
      batteryLife = (<div className="batteryLife"><div className="powerLevel"></div><div className="powerLevel"></div><div className="powerLevel"></div> <div className="powerLevel"></div>
      </div>
      )
    } else {
      batteryLife = (<div className="batteryLife"><div className="powerLevel noBattery"></div>
      </div>
      )
    };

    let flashlightImg;
    let overlay;
    if (this.state.batteryLife >= 1) {
      overlay = (
        <Overlay onOff={onOff} />
      )
      flashlightImg = (
        <Flashlight onOffImg={onOffImg} />
      )
    } else {
      overlay = (
        <div className="dark" > </div>
      )
      flashlightImg = (
        <img src="../../flashlight-off.png" alt="your flashlight" />
      )
    };

    let login;
    let display;
    if (this.state.newUser) {
      display = (
      <div className="new">
      <div className="wrap">
      <div className="flex">
     
              <h1 className="letter1">Hello</h1>
            <h2 className="letter2">Would you tell us your name?</h2>
              {/* {this.typeIn()} */}
        <form onSubmit={(event) => this.addName(event)}>
        <div className="wrap">
        <div className="flex">
        <input className="nameInput" type="text" onChange={(event) => this.handleChange(event, "characterName")} />
          <input className="nameButton"value="Tell Them Your Name" type="submit" />
          </div>
          </div>
        </form>
      </div >
      </div>
      </div>
      )
    } else {
      display = (
        <div className="mainpage">
        <div className="wrap">
        <div className="grid">
              <Game objCont={objCont} gameObject={gameObject} painOverlay={painOverlay} buttons={buttons} overlay={overlay} location={location} flashlight={this.state.flashlight} signOut={signOut}/>
              <User Mute={this.mute} flashlightImg={flashlightImg} flashlight={this.state.flashlight} clickFlashlight={this.clickFlashlight} characterName={this.state.characterName} battery={this.state.battery} batteryLife={batteryLife} health={this.state.health}/>
        </div>
        </div>
        </div>
      )
    }
    if (this.state.loggedIn === false) {
      login = (
        <div className ="entry">
          <div className="wrap">
          <div className="flex">
          <h1>Turn Out The Lights</h1>
          <img src="../../lamp.gif" alt="a lamp" />
                <form onSubmit={(event) => this.loginPage(event)}>
                <input value="Enter" type="submit" />
          </form>
      {/* leaving this here so I can put usernames back in later */}
        {/* <div className="create-user">
            <form onSubmit={(event) => this.createUser(event)}>
              <input type="text" placeholder="Please enter your e-mail address" onChange={(event) => this.handleChange(event, "createEmail")} />
              <input type="password" placeholder="Please enter your desired password" onChange={(event) => this.handleChange(event, "createPassword")} />
              <button>Create User</button>
            </form>
          </div> */}
          {/* <form onSubmit={(event) => this.signIn(event)}>
            <input type="text" placeholder="Please enter your e-mail address" onChange={(event) => this.handleChange(event, "loginEmail")} />
            <input type="password" placeholder="Please enter your desired password" onChange={(event) => this.handleChange(event, "loginPassword")} />
            <button>Login</button>
          </form> */}
        </div>
        </div>
        </div>
      )
    } else{
      login = (
        display
      )
    } 
    return (
      <div className="main">
      {login}
      </div>
    )
  }

}
ReactDOM.render(<App />, document.getElementById('app'));
