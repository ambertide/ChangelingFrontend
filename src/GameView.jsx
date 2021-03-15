import { extend } from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {Player, playerType, Turn, turnType} from './gameInternals';
import getContent from './language'
import {ClassNameCondition, constructConditionalClassName} from "./utility";

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
			<div className="characterPortraitImageWrapper">
				<img className="characterPortraitImage"
					alt={"Character portrait for " + props.characterName}
					src={"media/portraits/" + props.portraitName + ".jpg"}
				/>
				<button
					id={props.characterID + "Button"}
					className={constructConditionalClassName(
						"characterSelectButton",
						new ClassNameCondition(props.pressed, "pressed"),
						new ClassNameCondition(props.isTurnOwner, "turnOwnerPortrait")
					)}
					onClick={() => props.onClickCallback(props.characterID)}
					disabled={props.disabled}
				/>
			</div>
			<p className="characterName">{props.characterName} </p>
		</div>);
} 

/**
 * A Component for a dock that holds many players.
 * 
 * @param {List} props Dictionary of properties
 * @property {List[Player]} players contains a JSON style list with character information. 
 */
class Dock extends React.Component {
	constructor(props) {
		super(props);
		this.onPlayerSelect = this.onPlayerSelect.bind(this);
		this.state = {
			selectedPlayer: "" // Currently selected player, if any.
		};
	}

	/**
	 * Callback to do upon player select.
	 *
	 * @param player ID of the player selected.
	 */
	onPlayerSelect(player) {
		this.setState({
			selectedPlayer: player
		});
		// There should be callback to a function passed as props
		this.props.onPlayerSelectHoist(player); // That sends the selected player
		// To the up.
	}

	render() {
		let portraits = this.props.players.map( // For the players generate the portraits.
			(player) => <Portrait portraitName={player.portraitName}
								  characterID={player.user_id}
								  characterName={player.name}
								  playerRole={player.playerRole}
								  disabled={!this.props.flatDock} // Flatdock is for voting.
								  pressed={this.state.selectedPlayer === player.user_id}
								  isTurnOwner={this.props.turnOwner === player.user_id}
								  onClickCallback={this.onPlayerSelect}
			/>)
		if (this.props.flatDock) { // This is a flat style dock that doesn't use grid.
			return <div className="flatDock">
				<div className="flatDockPlayers">
					{portraits}
				</div>
				<div className="flatDockButtonWrapper">
					<button className={constructConditionalClassName("dockButton",
							new ClassNameCondition(!this.props.showButton, "hiddenButton"))}
							onClick={this.props.buttonOnClick}>
						{this.props.buttonText}
					</button>
				</div>
			</div>
		}
		else {
			portraits = portraits.concat(Array(9 - this.props.players.length).fill(
				<div className="portraitPlaceholder"/>
			));
			return (
				<div className="characterDock">
					{portraits}
					<div className="dockButtonWrapper">
						<button className={constructConditionalClassName("dockButton",
							new ClassNameCondition(!this.props.showButton, "hiddenButton"))}
								onClick={this.props.buttonOnClick}>
							{this.props.buttonText}
						</button>
					</div>
				</div>);
		}
	}
}


/**
 * Stateless react component to start the game (for admins) and
 * view the Room ID in the lobby.
 * 
 * @param {} props 
 * @property {Player} player: Player object representing the current player.
 * @property {Turn} turn: Turn object represent which turn the game is.
 */

function MainCard(props) {
	let playerRole = props.player?.playerRole;
	if (playerRole === undefined) {
		playerRole = playerType.UNASSIGNED;
	}
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


/**
 * This class holds the UI for selecting the next changeling.
 * @property players {Player[]} List of players.
 */
export function ChangelingSelectView(props) {
	// Filter to only campers.
	let campersOnly = props.players.filter((player) => player.playerRole === playerType.CAMPER);
	return <div className="selectView changelingSelectView">
		<p className="selectText changelingSelectText">
			{getContent("en", "changeling_select_text")}
		</p>
		<Dock players={campersOnly}
				 showButton={false}
				 buttonText={getContent("en", "replace_button")}
				 buttonOnClick={props.buttonOnClick}
				 onPlayerSelectHoist={props.onPlayerSelectHoist}
				 turnType_={props.turnType_}
				 turnOwner={props.turn_owner}
				 flatDock
			/>
	</div>

}


export function PlayerVoteView(props) {
	//Filter to only living members.
	let livingOnly = props.players.filter((player) => player.playerRole !== playerType.DEAD);
	return <div className="selectView camperVoteView">
		<p className="selectText camperVoteText">
			{getContent("en", "camper_vote_view").map((paragraph) => <p>{paragraph}</p>)}
		</p>
		<Dock
			players={livingOnly}
			buttonText={getContent("en","vote_button")}
			buttonOnClick={props.buttonOnClick}
			onPlayerSelectHoist={props.onPlayerSelectHoist}
			turnType_={props.turnType}
			turnOwner={props.turn_owner}
			flatDock
		/>
	</div>
}

export {
	Dock,
	MainCard,
	TopDock
}