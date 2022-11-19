/*
Interface for å hente ut spill. Bruker Typescript for å sette datatyper.
*/ 

export interface IGames{
      id: number,
      title: string,
      description: string,
      platform: string,
      price: number,
      condition: string,
      address: string,
      city: string,
      zipCode: number,
      image: {
        id: string
      },
      user_created: {
        first_name: string,
        email: string

      }
}

/*
Interface for å hente ut spill basert på ID.
*/ 

export interface IGameResponse {
  retro_games_by_id: IGames[]
}

/*
Interface for å sette datamodellen til IGames interfacet.
*/ 

export interface IGamesResponse {
  retro_games: IGames[];
}

/*
Interface som setter data typer for spill som skal bli lastet opp.
*/ 

 export interface INewGame {
  title: string,
  description: string,
  platform: string,
  price: number,
  condition: string,
  address: string,
  city: string,
  zipCode: number,
  image: string
}






