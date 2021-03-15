/**
 * Represents a class name that will be added should the
 *  condition is met.
 *
 * @param {boolean} condition a condition that has to be met.
 * @param {string} className Name of the class if condition is met.
 * @constructor
 */
export function ClassNameCondition (condition, className) {
    this.condition = condition;
    this.className = className;
}

/**
 * Construct a conditional class name, which is the root name
 * concatenated with further descriptors if they meet conditions.
 *
 * @param {String} rootClassName Root of the class name that will exist no matter what.
 * @param {ClassNameCondition} conditions a list of conditions
 * @return {String} the name of the class.
 */
export function constructConditionalClassName(rootClassName, ...conditions) {
    let extraClassNames = conditions.filter( // Filter to those who meet the condition.
        (condition) => condition.condition).map(  // Convert to names.
            (condition) => condition.className).join(' ') // Join the names to a single string.
    return extraClassNames ? [rootClassName, extraClassNames].join(" ") : rootClassName // Return constructed className.
}