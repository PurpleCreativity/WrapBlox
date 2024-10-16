import AuthedUser from "./Classes/AuthedUser.js";

import FetchHandler from "./Classes/Internal/fetchHandler.js";
import Badge from "./Classes/Badge.js";
import Group from "./Classes/Group.js";
import Place from "./Classes/Place.js";
import Universe from "./Classes/Universe.js";
import User from "./Classes/User.js";

import { RawGroupData } from "./Types/GroupTypes.js";
import { RawBadgeData } from "./Types/BadgeTypes.js";
import { RawUniverseData } from "./Types/UniverseTypes.js";
import { RawUserData } from "./Types/UserTypes.js";

export { Badge, Group, Place, Universe, User };

export type * from "./Types/BaseTypes.js";
export type * from "./Types/BadgeTypes.js";
export type * from "./Types/GroupTypes.js";
export type * from "./Types/InventoryTypes.js";
export type * from "./Types/PlaceTypes.js";
export type * from "./Types/UniverseTypes.js";
export type * from "./Types/UserTypes.js";
export * from "./Types/Enums.js";

class WrapBlox {
	fetchHandler : FetchHandler;
	self : AuthedUser | null = null;
	
	
	constructor() {
		this.fetchHandler = new FetchHandler();
	}
	
	login = async (cookie : string) => {
		this.fetchHandler.cookie = cookie;
		const userInfo = await this.fetchHandler.fetchEndpoint('GET', 'Users', '/users/authenticated');
		const realUserData = await this.fetchRawUser(userInfo.id);
		this.self = new AuthedUser(this, realUserData, cookie);
		return this.self;
	}

	fetchAuthedUser = async (cookie : string) => {
		const userInfo = await this.fetchHandler.fetchEndpoint('GET', 'Users', '/users/authenticated', {cookie});
		const realUserData = await this.fetchRawUser(userInfo.id);
		return new AuthedUser(this, realUserData, cookie);
	}

	isLoggedIn = () : this is {self : AuthedUser} => {
		return this.self !== null;
	}
	
	//? Users

	private fetchRawUser = async (query : string | number, useCache = true) : Promise<RawUserData> => {
		if (typeof(query) === "number") {
			return await this.fetchHandler.fetchEndpoint('GET', 'Users', `/users/${query}`, { useCache: useCache });
		}

		const userId = (await this.fetchHandler.fetchEndpoint("POST", "Users", "/usernames/users", {
			useCache: useCache,
			body: {
				usernames: [query],
				excludeBannedUsers: false
			}
		})).data[0]?.id;
		if (!userId) throw new Error("User not found");

		return await this.fetchRawUser(userId, useCache);
	}
	
	fetchUser = async (query : string | number, useCache = true): Promise<User> => {
		const rawData = await this.fetchRawUser(query, useCache);
		if (!rawData) throw new Error("User not found");

		return new User(this, rawData);
	}

	//? Badges

	private fetchRawBadge = async (badgeId: number, useCache = true): Promise<RawBadgeData> => {
		return await this.fetchHandler.fetchEndpoint("GET", "Badges", `/badges/${badgeId}`, { useCache: useCache });
	};

	fetchBadge = async (badgeId: number, useCache = true): Promise<Badge> => {
		const rawData = await this.fetchRawBadge(badgeId, useCache);
		if (!rawData) throw new Error("Badge not found");

		return new Badge(this, rawData);
	};

	//? Groups

	private fetchRawGroup = async (query: string | number, useCache = true): Promise<RawGroupData> => {
		if (typeof(query) === "number") {
			return (await this.fetchHandler.fetchEndpoint("GET", "GroupsV2", "/groups", {
				useCache: useCache,
				params: {
					groupIds: [query]
				}
			})).data[0];
		}

		const groupId = (await this.fetchHandler.fetchEndpoint("GET", "Groups", "/groups/search/lookup", {
			useCache: useCache,
			params: {
				groupName: query
			}
		}))?.data[0]?.id;

		if (!groupId) throw new Error("No results found");

		return await this.fetchRawGroup(groupId, useCache);
	};

	fetchGroup = async (query: string | number, useCache = true): Promise<Group> => {
		const rawData = await this.fetchRawGroup(query, useCache);
		if (!rawData) throw new Error("Group not found");

		return new Group(this, rawData);
	};

	//? Games
	
	private fetchRawUniverse = async (universeId: number, useCache = true) : Promise<RawUniverseData> => {
		return (await this.fetchHandler.fetchEndpoint('GET', 'Games', "/games", {
			useCache: useCache,
			params: {
				universeIds: [universeId]
			}
		})).data[0];
	};

	fetchUniverse = async (universeId: number, useCache = true): Promise<Universe> => {
		const rawData = await this.fetchRawUniverse(universeId, useCache);
		if (!rawData) throw new Error("Universe not found");

		return new Universe(this, rawData);
	};
}


export default WrapBlox;