/**
 * Generated, unique identifier for users. Currently generated by Firestore
 * auth.
 */
export type Uid = string;

/**
 * Unique identifier derived from user name
 */
export type Username = string;

/**
 * Generated, general id for everything but users.
 * TODO: ideally we should just use these, instead of Uids
 */
export type Id = string;
