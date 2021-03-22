export const playerType = {
	UNASSIGNED: "unassigned",
	CHANGELING: "changeling",
	CAMPER: "camper",
    DEAD: "dead"
}

/**
 * A pure JavaScript constructor for player objects,
 * these describe the states of a player.
 * @param {String} name Name of the player.
 * @param {String} portraitName Name of the portrait image sans extension.
 * @param {String} playerRole Role of the player if necessary.
 */
export function Player(user_id, name, portraitName, playerRole, isAdmin) {
	this.user_id = user_id
	this.name = name;
	this.portraitName = portraitName;
	this.playerRole = playerRole;
    this.isAdmin = isAdmin;
}


export const turnType = {
	LOBBY: 0,  // The initial turn waiting for game start.
	NORMAL: 1, // A normal turn.
	CAMPFIRE_OUT: 2, // Campfire goes out, next changeling selected.
	CAMPFIRE_OUT_VOTER: 3, // Campfire out and YOU select the changeling.
	BURN_CAMPER: 4,  // Select camper to burn.
	CAMPER_VICTORY: 5, // Campers survived! Sort of...
	CHANGELING_VICTORY: 6 // Changelings won.
}

/**
 * A constructor that creates a Turn object,
 * a turn object represents the state of a turn.
 */
export function Turn(turnCount, turnType) {
	this.turnCount = turnCount;	// Which turn is it.
	this.turnType = turnType; // What type of turn is it.
}

/**
 *	Campfire out comes in two distinct flavours. If the player is the room owner
 *	during a campfire out, they can turn people to changelings.
 *
 * @param gameState {turnType} State of the turn.
 * @param roomOwner {Player} Client user.
 * @param userID {String} ID of the user who is the turn owner.
 * @return {turnType} The type the turn will be in.
 */
export function generateTurnType(gameState, roomOwner, userID) {
	if (turnType === turnType.CAMPFIRE_OUT && userID === roomOwner.user_id) {
		return turnType.CAMPFIRE_OUT_VOTER;
	}
	return gameState; // Otherwise return normal.
}