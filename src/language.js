const content = {
    "en": {
        "title": "Changeling",
        "subtitle": "the Social Deception Game",
        "unassigned_card_title": "Mystery",
        "unassigned_card_exp": ["Your role tonight is yet a mystery, once the game starts, you will be assigned a role.",
                                "Either a Changeling, a powerful fae that can take the form of other living creatures trying to trick the campers",
                                "or a camper, who foolishly came to these woods and will pay the price."],
        "changeling_card_title": "Changeling",
        "changeling_card_exp": ["You are a Changeling! A powerful fae that can take the form of other creatures, hell bent on punishing the humans who dare enter your forrest tonight.",
                                "you don't know the answers to questions being asked, so you must lie, when it is your turn, try to ask questions that will make others lie.",
                                "Campfire may go out every once in five turns, when this happens, the youngest changeling will chose the next camper to be turned, to win, outnumber the campers."]
    },
    "tr": {}
}


/**
 * Primary function to get textual content.
 * @param {*} languageCode ISO631 Language code.
 * @param {*} contentName Key name of the content
 */
function getContent(languageCode, contentName) {
    return content[languageCode][contentName];
}

export default getContent;