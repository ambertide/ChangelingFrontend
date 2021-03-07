import { extend } from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {Player, playerType, Turn, turnType} from './gameInternals';
import getContent from './language'

/**
 * A ReactJS JSX Component that represents a portrait
 * for a player character, consists of an avatar and character
 * name as well as character role.
 *  
 * @param {List} props 	Dictionary of properties.
 * @property {String} characterPortrait Name of the avatar used for
 * a character.
 * @property {String} characterName Name of the player.
 * @property {String} playerRole Role of the player. 
 */
function Portrait(props) {
		return (<div className={props.playerRole ? "characterPortrait " + props.playerRole : "characterPortrait"}>
			<img className="characterPortraitImage"
				alt={"Character portrait for " + props.characterName}
				src={"media/portraits/" + props.portraitName + ".jpg"}/>
			<p className="characterName">{props.characterName} </p>
		</div>);
} 

/**
 * A Component for a dock that holds many players.
 * 
 * @param {List} props Dictionary of properties
 * @property {List[Player]} players contains a JSON style list with character information. 
 */
function Dock (props) {
	return (
		<div className="characterDock">
			{props.players.map((player) =>
					<Portrait portraitName={player.portraitName}
							  characterName={player.name}
							  playerRole={player.playerRole}/>)
			}
			{<div className="dockButtonWrapper">
				<button className={"dockButton" + (props.showButton ? "" : " hiddenButton")}
						onClick={props.buttonOnClick}>
					{props.buttonText}
				</button>
			</div>}
		</div>);
}


/**
 * Stateless react component to start the game (for admins) and
 * view the Room ID in the lobby.
 * 
 * @param {} props 
 * @property {Player} player: Player object representing the current player.
 * @property {Turn} turn: Turn object represent which turn the game is.
 */
class MainCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: props.player,
			turn: props.turn
		}
	}

	render() {
		let playerRole = this.state.player?.playerRole;
		if (playerRole === undefined) {
			playerRole = playerType.UNASSIGNED;
		}
		switch (this.state.turn.turnType) {
			case turnType.CAMPFIRE_OUT_VOTER:
				// Return the eliminate UI.
				break;
			case turnType.BURN_CAMPER:
				// Return the voting UI.
				break;
			default: // For all other cases, we just have text.
				return (
						<div className={"mainCard " + playerRole +"Card"}>
							<div className="cardContent">
								<div className="cardTitle">
									<h3>{getContent('en', playerRole + '_card_title')}</h3>
								</div>
								<div className="cardExp">
									{getContent('en', playerRole + '_card_exp').map((paragraph) => <p>{paragraph}</p>)}
								</div>
							</div>
						</div>);
		}
	}
}




function TopDock(props) {
	if (props.gameStarted) {
		return (<div className="topDock turnsRemaining">
			<p className="turnsRemainingTitle">Remaining Turns</p>
			<p className="turnsRemainingNumber">{props.turnsRemaining}</p>
		</div>)
	} else {
		return (<div className="topDock">
			<p className="roomIDText">
				{props.roomID}
			</p>
		</div>)
	}
}

export {
	Dock,
	MainCard,
	TopDock
}
