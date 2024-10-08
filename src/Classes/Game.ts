import { APICreator, APIGameData } from "../Types/GameTypes.js";
import WrapBlox from "../index.js";

// TODO: Turn into a "Universe"

class Game {
	rawdata : APIGameData;
	name : string;
	id : number;
	description : string;
	creator : APICreator;
	client : WrapBlox;
	playing : number;
	visits : number;
	maxPlayers : number;
	created : Date;
	updated : Date;
	constructor(client : WrapBlox, rawdata : APIGameData) {
		this.rawdata = rawdata;
		this.name = rawdata.name;
		this.id = rawdata.id;
		this.description = rawdata.description;
		this.creator = rawdata.creator;
		this.client = client;
		this.playing = rawdata.playing;
		this.visits = rawdata.visits;
		this.maxPlayers = rawdata.maxPlayers;
		
		this.created = new Date(rawdata.created);
		this.updated = new Date(rawdata.updated);
	}
	
	async fetchCreator() {
		
		return await this.client.fetchUser(this.creator.id);
	}
	
	async favorite() {
		return await this.client.fetchHandler.fetch('POST', 'Games', `/games/${this.id}/favorites`);
	}
	
	async fetchFavoriteCount() {
		return (await this.client.fetchHandler.fetch('GET', 'Games', `/games/${this.id}/favorites/count`)).count;
	}
	
}

export default Game;