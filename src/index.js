import { extend } from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import GuestView from './GuestView';
import {ChangelingSelectView, Dock, MainCard, PlayerVoteView, TopDock} from './GameView';
import {Player, playerType, Turn, turnType} from './gameInternals';
import {io} from "socket.io-client";

const socket = io.connect("localhost:5000");

const gameStateType = {
	PENDING: "pending", // For waiting login,
	LOBBY: "lobby", // For waiting game start by admin
	GAME: "game", // For in game.
	END: "end" // After game is won.
}


class ChangelingGame extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			players: [],
			gameState: gameStateType.PENDING,
			roomID: "00000", // Placeholder,
			player: null, // The client player.
			selectedPlayer: null, // Player selected for voting or "conversion".
			turn_owner: null, // Owner of the turn in speaking.
			buttonText: "Start Game",
			buttonCallback: this.requestGameStart,
			currentTurn: new Turn()
		};
		this.requestGameJoin = this.requestGameJoin.bind(this);  // req_game_join
		this.requestGameCreation = this.requestGameCreation.bind(this);  // req_game_host
		this.requestGameStart = this.requestGameStart.bind(this);  // req_game_start
		this.acknowledgeGameHost = this.acknowledgeGameHost.bind(this); // resp_ack_host
		this.acknowledgeSyncPlayer = this.acknowledgeSyncPlayer.bind(this);  // resp_sync_players
		this.acknowledgeGameJoin = this.acknowledgeGameJoin.bind(this);  // resp_ack_join
		this.acknowledgeGameStart = this.acknowledgeGameStart.bind(this); // Bound to ackGameStateChange
		this.acknowledgeGameStateChange = this.acknowledgeGameStateChange.bind(this); // resp_sync_gamestate
		this.setSelectedPlayer = this.setSelectedPlayer.bind(this);
		this.shouldButtonShown = this.shouldButtonShown.bind(this);
		props.socket.on("resp_ack_host", (data) => {
			this.acknowledgeGameHost(data)
		});
		props.socket.on("resp_sync_players", (data) => {
			this.acknowledgeSyncPlayer(data)
		});
		props.socket.on("resp_ack_join", (data) => {
			this.acknowledgeGameJoin(data) // Acknowledge that *this* player joined a game.
		});
		props.socket.on("resp_sync_gamestate", (data) => {
			this.acknowledgeGameStateChange(data);
		});
		props.socket.on("resp_start_game", () => {
			this.acknowledgeGameStart();
		});
	}

	/**
	 * Set the selected player to the playerID,
	 * 	this is a callback function to be passed into the
	 * 	Dock for hoisting the selected player state.
	 * @param playerID
	 */
	setSelectedPlayer(playerID) {
		this.setState({
			selectedPlayer: playerID
		});
	}

	/**
	 * Indicates wheter or not the button should be show.
	 *
	 * @return {boolean}
	 */
	shouldButtonShown() {
		return this.state.player.user_id === this.state.turn_owner;
	}

	/**
	 * Request the server to create a game.
	 *
	 * @param name Name of the player.
	 * @param portrait Portrait of the player.
	 */
	requestGameCreation(name, portrait)
	{
		// Create web socket connection
		// Get the ID for the created room.
		const payload = {
			"name": name,
			"portrait": portrait
		};
		console.debug(payload);
		socket.emit("req_host_game", JSON.stringify(payload));
	}

	/**
	 * Request to join a game from the server.
	 *
	 * @param roomID ID of the room to join.
	 * @param name Name of the player joining.
	 * @param portrait Portrait of the player to join.
	 */
	requestGameJoin(roomID, name, portrait)
	{
		this.setState({
			roomID: roomID  // This is invisible if server doesn't give okay, but if it gives okay it will autojoin.
		});
		socket.emit("req_join_game", JSON.stringify(
			{
				"name": name,
				"portrait": portrait,
				"roomID": roomID
			})
		);
	}

	requestNextTurn()
	{
	}

	/**
	 * Request game to start from the server.
	 */
	requestGameStart()
	{
		socket.emit("req_start_game");
	}


	/**
	 * Event for server response indicating game state
	 * change.
	 *
	 * @param data Data holding the new game state.
	 */
	acknowledgeGameStateChange(data) {
		console.log(data);
		const payload = JSON.parse(data);
		console.log(payload);
		const newGameState = payload["game_state"];
		this.setState({
			currentTurn: new Turn(payload["turn_count"], newGameState),
			turn_owner: payload["ownership"],
		});
		switch (newGameState) {
			case turnType.NORMAL:  // If signals start of the game.
				this.acknowledgeGameStart(); // start the game.
				break;
			default: // Error condition.
				break;
		}
	}

	/**
	 * Event for server response indicating game start.
	 */
	acknowledgeGameStart()
	{
		this.setState(
			{
				gameState: gameStateType.GAME,
				buttonText: "Next",
				buttonOnClick: this.requestNextTurn
			}
		);
	}

	/**
	 * Event for websocket response indicating
	 *    joining to game lobby.
	 *
	 *    @param data {dictionary} the ID for the room to join.
	 */
	acknowledgeGameJoin(data)
	{
		let payload = JSON.parse(data);
		let playerInfo = payload["player"]
		this.setState(
			{
				gameState: gameStateType.LOBBY,
				roomID: payload["roomID"],
				player: new Player(playerInfo["user_id"], playerInfo["name"],
					playerInfo["portraitName"],
					playerInfo["playerRole"], playerInfo["admin"]
				)
			}
		);
	}

	/**
	 * Callback for the acknowledgement of the hosting event.
	 * @param data
	 */
	acknowledgeGameHost(data)
	{
		let json_data = JSON.parse(data); // Get it as data
		console.debug(json_data);
		let new_player = new Player(json_data["user_id"], json_data["name"],
			json_data["portraitName"], json_data["playerRole"],
			json_data["admin"]);
		this.setState(prevState => ({
			players: [...prevState.players, new_player]
		}));
		this.setState({
			roomID: json_data["room_id"],
			gameState: gameStateType.LOBBY,
			player: new_player,
			turn_owner: json_data["user_id"]
		});
	}

	/**
	 * Acknowledge server update to sync player state.
	 *
	 * @param data Data including an array of players.
	 */
	acknowledgeSyncPlayer(data)
	{
		console.debug(data);
		let players = JSON.parse(data)["players"]; // Get it as data.
		const player_objects = players.map((player) => (
			new Player(player["user_id"], player["name"],
			player["portraitName"], player["playerRole"],
			player["admin"])
		));
		this.setState({ // Renew the players.
			players: player_objects
		});
		this.setState((prevState) => ({ // Set our player character.
			player: player_objects.filter((player_) => player_.user_id === prevState.player.user_id)[0]
		}));
	}

	render()
	{
		switch (this.state.gameState) {
			case gameStateType.PENDING:
				return (<GuestView joinGameCallback={this.requestGameJoin}
								   hostGameCallback={this.requestGameCreation}/>);
			default: // Means we are either on the lobby or in the game.
				switch (this.state.currentTurn.turnType) {
					case turnType.BURN_CAMPER:
						return (<div className="gameViewWrapper">
							<PlayerVoteView players={players}
											showButton={true}
											buttonOnClick={(player) => console.log("PRINT!")}
											onPlayerSelectHoist={(player) => console.log(player.user_id)}
											turnType_={turnType.BURN_CAMPER}
											turnOwner={players[4]}
							/>
						</div> );
					default:
					return (
							<div className="gameViewWrapper">
								<Dock players={this.state.players}
									  showButton={this.shouldButtonShown()}
									  buttonText={this.state.buttonText}
									  buttonOnClick={this.state.buttonCallback.bind(this)}
									  onPlayerSelectHoist={this.setSelectedPlayer}
									  turnType_={this.state.currentTurn.turnType}
									  turnOwner={this.state.turn_owner}
								/>
								<MainCard player={this.state.player} turn={this.state.currentTurn}/>
								<TopDock gameStarted={this.state.gameState === gameStateType.GAME}
										 turnsRemaining={40 - this.state.currentTurn.turnCount}
										 roomID={this.state.roomID}
								/>
							</div>
						);
				}
		}
	}
}

const players = [
	new Player("A124", "Elsa", "f_2", playerType.CAMPER, true),
	new Player("A123", "Henry", "m_1", playerType.CAMPER, false),
	new Player("A122", "Albert", "m_2", playerType.CAMPER, false),
	new Player("A121", "Charlie", "m_3", playerType.CHANGELING, false),
	new Player("A120", "Charlotte", "f_3", playerType.CAMPER, false)
];

ReactDOM.render(
	<ChangelingGame socket={socket}/>,
	document.getElementById('root')
);
