import type WrapBlox from "../index.js";
import type { RawFriendRequest } from "../index.js";
import type AuthedUser from "./AuthedUser.js";

class FriendRequest {
	client : WrapBlox;
	rawdata : RawFriendRequest;
	senderId : number;
	created : Date;
	target : AuthedUser;
	constructor(client : WrapBlox, rawdata : RawFriendRequest, target : AuthedUser) {
		this.client = client;
		this.rawdata = rawdata;
		this.senderId = rawdata.friendRequest.senderId;
		this.created = new Date(rawdata.friendRequest.sentAt);
		this.target = target;
	}
	
	async fetchUser() {
		return await this.client.fetchUser(this.senderId);
	}
	
	async accept() : Promise<void> {
		return await this.client.fetchHandler.fetch('POST', 'Friends', `/users/${this.senderId}/accept-friend-request`, {cookie : this.target.cookie});
	}
	
	async decline() : Promise<void> {
		return await this.client.fetchHandler.fetch('POST', 'Friends', `/users/${this.senderId}/decline-friend-request`, {cookie : this.target.cookie});
	}
	
	
	
}

export default FriendRequest;