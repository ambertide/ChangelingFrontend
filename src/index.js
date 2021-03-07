import { extend } from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import GuestView from './GuestView';
import {Dock, MainCard, TopDock} from './GameView';
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
			player: null, // The player.
			showButton: false,
			buttonText: "Start Game",
			buttonCallback: this.requestGameStart,
			currentTurn: new Turn()
		};
		this.requestGameJoin = this.requestGameJoin.bind(this);
		this.requestGameCreation = this.requestGameCreation.bind(this);
		this.acknowledgeGameHost = this.acknowledgeGameHost.bind(this);
		this.acknowledgePlayerJoin = this.acknowledgePlayerJoin.bind(this);
		this.acknowledgeGameJoin = this.acknowledgeGameJoin.bind(this);
		props.socket.on("resp_ack_host", (data) => {
			this.acknowledgeGameHost(data)
		});
		props.socket.on("resp_player_join", (data) => {
			this.acknowledgePlayerJoin(data)
		});
		props.socket.on("resp_ack_join", (data) => {
			this.acknowledgeGameJoin(data) // Acknowledge that *this* player joined a game.
		});
	}


	requestGameCreation(name, portrait)
	{
		// Create web socket connection
		// Get the ID for the created room.
		var payload = {
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
		this.acknowledgeGameStart();
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
				buttonOnClick: this.requestNextTurn,
				showButton: false
			}
		);
		this.setState((prevState) => this.state.player.playerRole = playerType.CHANGELING);
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
		this.setState(
			{
				gameState: gameStateType.LOBBY,
				roomID: payload["roomID"]
			}
		);
	}

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
			showButton: true
		});
	}

	acknowledgePlayerJoin(data)
	{
		let json_data = JSON.parse(data); // Get it as data.
		let new_player = new Player(json_data["user_id"], json_data["name"],
			json_data["portraitName"], json_data["playerRole"],
			json_data["admin"]);
		this.setState(prevState => ({
			players: [...prevState.players, new_player]
		}));
		if (json_data["is_you"]) { // If this player is us.
			this.setState({
				player: new_player // Set it as us.
			});
		}
	}

	render()
	{
		switch (this.state.gameState) {
			case gameStateType.PENDING:
				return (<GuestView joinGameCallback={this.requestGameJoin}
								   hostGameCallback={this.requestGameCreation}/>);
			default: // Means we are either on the lobby or in the game.
				return (
					<div className="gameViewWrapper">
						<Dock players={this.state.players}
							  showButton={this.state.showButton}
							  buttonText={this.state.buttonText}
							  buttonOnClick={this.state.buttonCallback.bind(this)}
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

ReactDOM.render(
	<ChangelingGame socket={socket}/>,
	document.getElementById('root')
);
