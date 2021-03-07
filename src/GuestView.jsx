import { extend } from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

class PortraitSelect extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			portraitNames: ["f_1", "m_1", "f_2", "m_2",
							"f_3", "m_3"],
			portraitIndex: 0
		}
	}

	changePortrait(index_offset) {
		this.setState((state, counter) => ({portraitIndex: (state.portraitIndex + index_offset) % state.portraitNames.length}));
	}

	render () {
		return (<div className="characterPortrait" id="portraitSelector">
			<img className="characterPortraitSelectorImage"
				alt="Select a character portait"
				src={"media/portraits/" + this.state.portraitNames[this.state.portraitIndex] + ".jpg"}/>
			<div className="portraitSwitch">
				<a className="previousPortrait"
					onClick={() => this.changePortrait(-1)}>
						{"<"}
					</a>
				<a className="nextPortrait"
					onClick={() => this.changePortrait(1)}>
						{">"}
				</a>
			</div>
		</div>);
		
	}
}

/**
 * The login screen dialog component.
 * @property hostGameCallback - Function to set up game hosting.
 * @property joinGameCallback - Function to Set up game joining.
 */
class LoginScreen extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			hostGameCallback: props.hostGameCallback,
			joinGameCallback: props.joinGameCallback
		};
		this.joinGame = this.joinGame.bind(this);
		this.hostGame = this.hostGame.bind(this);
	}

	joinGame() {
		let roomIDInput = document.getElementById("roomID"); // Find the input for roomID
		let roomID = roomIDInput.value; // Get the entered RoomID
		console.log(this.state.joinGameCallback);
		let name = document.getElementById("username").value;
		let portrait_id = document.getElementsByClassName("characterPortraitSelectorImage")[0].src.split("/").reverse()[0];
		// Gets the portrait image name
		portrait_id = portrait_id.replace(".jpg", "");
		this.state.joinGameCallback(roomID, name, portrait_id); // Join the game via the callback.
	}

	/**
	 * A wrapper function arround the hostGameCallback
	 * that finds the apporiprate values for it.
	 */
	hostGame() {
		let name = document.getElementById("username").value;
		let portrait_id = document.getElementsByClassName("characterPortraitSelectorImage")[0].src.split("/").reverse()[0];
		// Gets the portrait image name
		portrait_id = portrait_id.replace(".jpg", ""); // Leaves only the id.
		this.state.hostGameCallback(name, portrait_id);
	}

	render () {
		return (
			<div className="loginScreen">
				<PortraitSelect/> 
				<div className="loginScreenForm">
					<div className="loginScreenFormArea">
						<input type="text" placeholder="Name" className="loginFormMember"  id="username"/>
						<button className="loginFormMember" id="hostGameButton"
							onClick={this.hostGame}>
								Host Game
							</button>
						<input type="text" className="loginFormMember"  placeholder="Room ID" id="roomID"/>
						<button id="joinGameButton" className="loginFormMember" 
								onClick={this.joinGame}>
									Join
								</button>
					</div>
				</div>
			</div>
		);
	}
}



/**
 * Holds view for the User when they first
 * enter the website prior to logging in.
 */
class GuestView extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
			hostGameCallback: props.hostGameCallback,
			joinGameCallback: props.joinGameCallback
		};
    }

    render() {
        return (
            <div className="guestView">
				<div className="gameTitle">
					<h1>Changeling</h1>
					<h3>the Social Deception Game</h3>
				</div>
                <LoginScreen hostGameCallback={this.state.hostGameCallback}
							 joinGameCallback={this.state.joinGameCallback}/>
				<div className="gameRules">
					<p>
						You and a group of your friends have decided to travel into the woods near your town,
							while setting up your camp for the night, one of you have been replaced by a Changeling,
							as you realise the strange hapenings going on around you, you decide to ask each other questions
							only the real "you" can know, can you reveal the changeling?
					</p>
					<p>
						Players take turns asking questions to every other player the Changeling must always lie! Other players,
						 may <em>choose</em> to lie if they are too emberassed to answer truthfully, they should be ready to face the
						 consequences, for every five turns, there is a one in a three chance the campfire will go out and another one of you, chosen by the most recent changeling
						 will replaced by a changeling, otherwise, vote to select a camper to throw to the fire, if they are a changeling, they will
						 melt away, if they are not... well, pity.
					</p>
					<p>
						Win as campers by eliminating all the changelings or by surviving for forty turns, win as changelings by becoming the majority.
					</p>
				</div>
            </div>
        )
    }
}



export default GuestView;