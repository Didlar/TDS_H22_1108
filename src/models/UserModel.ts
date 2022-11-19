/*
 Interface for login og registrering av bruker.
 */

export interface Iuser {
  firstName: string,
  email: string,
  avatar: string;
  description: string,
  password: string
}

/*
Interface for å hente ut brukerdata. 
*/

export interface IuserData {
  first_name: string,
  email: string,
  description: string,
  avatar: string
}

export interface IUserResponse {
  retro_games: IuserData[];
}
