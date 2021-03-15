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
                                "Campfire may go out every once in five turns, when this happens, the youngest changeling will chose the next camper to be turned, to win, outnumber the campers."],
        "camper_card_title": "Camper",
        "camper_card_exp": ["It was a mistake to the go the forest in your town that was claimed to be haunted, as shortly after, one of you was replaced by a Changeling. To find who is the changeling, you and your friends decide to play a game.",
                            "Each turn, one of you will ask a question, everyone in the group must answer, changelings cannot tell the truth about their host, so they will lie, if the question is too personal, you may lie too, but beware...",
                            "...For every five turns, you will vote to burn one of your fellow campers in the campfire, if it is a changeling, good, otherwise, big mistake. Alternatively, there is a chance the campfire will go out, another one of you will be replace by a Changeling.",
                            "Either kill all the changelings or survive until dawn to win, you will lose if the changelings become the majority."],
        "replace_button": "Replace.",
        "changeling_select_text": "As the last turned Changeling, it is your responsibility to change the next camper to be replaced, make your choice strategically, whoever knows you best, should be the one to go.",
        "camper_vote_view": ["In this turn, you'll vote for which Camper to throw into fire.",
                             "Select the camper you are most suspicious of being the Changeling."]
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