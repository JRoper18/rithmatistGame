export default class Unit {
	constructor(name, id, player, position, attributes) {
		this.name = name;
		this.id = id;
		this.player = player;
		this.position = position;
		this.attributes = attributes;
		this.attributes.health = this.attributes.maxHealth;
	}
	hasTags(...tags) {
		let tagsMatch = 0;
		for (let i = 0; i < this.attributes.tags; i++) {
			for (let j = 0; j < tagslength; j++) {
				if (this.attributes.tags[i] == tags[j]) {
					tagsMatch++;
					if (tagsMatch == tags.length) {
						return true;
					}
				}
			}
		}
		return false;
	}
	hasTag(tag) {
			for (let i = 0; i < this.attributes.tags.length; i++) {
				if (this.attributes.tags[i] == tag) {
					return true;
				}
			}
			return false;
		}
		/*
		Possible Tags include:
		  Hidden
		  Mobile
		  Destructible
			Root
		*/
}
