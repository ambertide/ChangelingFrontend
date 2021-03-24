import { extend } from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import getContent from './language'


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
						<input type="text" placeholder={getContent('name')} className="loginFormMember"  id="username"/>
						<button className="loginFormMember" id="hostGameButton"
							onClick={this.hostGame}>
								{getContent('host_button_text')}
							</button>
						<input type="text" className="loginFormMember"  placeholder={getContent('room_id')} id="roomID"/>
						<button id="joinGameButton" className="loginFormMember" 
								onClick={this.joinGame}>
									{getContent('join_button_text')}
								</button>
					</div>
				</div>
			</div>
		);
	}
}


function SwitchLanguage(props) {
	let flag = 'tr';
	let ariaLabel = 'Turkish';
	let callback = () => {props.setLanguage('tr')};
	if (document.languageCode === 'tr') {
		flag = 'gb';
		ariaLabel = 'English';
		callback = () => {props.setLanguage('en')};
	}
	return <button className="languageSwitchButton" onClick={callback} aria-label={ariaLabel}><img className="countryFlag" alt={flag} src={`media/country_flags/${flag}.svg`}/></button>;
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
					<h1>{getContent('title')}</h1>
					<h3>{getContent('subtitle')}</h3>
				</div>
                <LoginScreen hostGameCallback={this.state.hostGameCallback}
							 joinGameCallback={this.state.joinGameCallback}/>
				<div className="gameRules">
					{getContent('game_rules').map((paragraph) => <p>{paragraph}</p>)}
				</div>
				<SwitchLanguage setLanguage={this.props.languageSwitchCallback}/>
            </div>
        )
    }
}






export default GuestView;