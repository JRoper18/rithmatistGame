import * as coord from './coord.js';
import Point from './point.js';
import RenderedElement from './renderedElement.js';
import Unit from './unit.js';

export default class Chalkling extends Unit {
	constructor(name, id, player, position, attributeSet) {
		super(name, id, player, position, attributeSet);
		this.currentAction = "IDLE";
		this.frame = 0;
		this.sees = [];
		this.timeSinceAnimationStarted = 0;
		this.target = null;
		this.path = [];
		this.topLeft = new Point(this.position.x - 50, this.position.y - 50);
	}
	getAnimation() { //Example path: ./chalklings/Testling/Animations/Idle/X
		let pathToAnimation = '';
		switch (this.currentAction) {
			/*
			The reason for the frame+1 and parenthesis is because I can take a group of png files, selected them all, and then rename using f2/
			If I put no name in, it names them (1), (2), etc.
			 */
			case "IDLE":
				pathToAnimation = './chalklings/' + this.name + '/Animations/Idle.png';
				break;
			case "WALK":
				pathToAnimation = './chalklings/' + this.name + '/Animations/Walk.png';
				break;
			case "ATTACK":
				pathToAnimation = './chalklings/' + this.name + '/Animations/Attack.png';
				break;
			case "DYING":
				pathToAnimation = './chalklings/' + this.name + '/Animations/Dying.png';
				break;
			case "DEATH":
				break;
			case "FINISHER":
				pathToAnimation = './chalklings/' + this.name + '/Animations/Finishers/' + this.target.name + '/' + this.frame + ".png";
				break;
			case "CRITICAL":
				pathToAnimation = './chalklings/' + this.name + '/Animations/Critical/' + this.frame + ".png";
				break;
			default:
				pathToAnimation = './chalklings/' + this.name + '/Animations/Idle/' + this.frame + ".png";
		}
		return pathToAnimation;
	};
	moveTo(position) {
		this.target = null;
		this.currentAction = "WALK";
		this.path = [position];
	}
	moveAlongPath(path) { //Path is array of points
		this.target = null;
		this.currentAction = "WALK";
		this.path = path;
	}
	die() {
		this.currentAction = "DYING";
		this.frame = 0;
		this.timeSinceAnimationStarted = 0;
		console.log("A " + this.player + " " + this.name + " has died!");
	}
	getNearbyEnemies() {
		let enemies = [];
		for (let i = 0; i < this.sees.length; i++) {
			if (this.sees[i].player != this.player) {
				enemies.push(this.sees[i]);
			}
		}
		return enemies;
	}
	override() {
		this.currentAction = "IDLE";
		this.path = [];
		this.frame = 0;
		this.target = null;
	}
	update(time) {
		//Update topleft
		this.topLeft = new Point(this.position.x - 50, this.position.y - 50);
		//Calculate the current frame.
		let newTime = (this.timeSinceAnimationStarted + time); //Get the new time since the animation started
		let numFrames = this.attributes.animationData[this.currentAction].frames;
		let animationTime = this.attributes.animationData[this.currentAction].time;
		let framesPerSecond = numFrames / animationTime;
		this.frame = Math.min(Math.round(newTime * framesPerSecond), numFrames - 1); //Don't round up if we're out of frames. The -1 is because we start at frame 0;
		this.timeSinceAnimationStarted = newTime;

		if (newTime > animationTime) { //Is my animation done?
			if (this.currentAction == "ATTACK") { //So I'm attacking someone and I just finished an attack animation. Should I continue?
				if (this.target.attributes.health > 0) { //My enemy is alive! Time to finish the job.
					this.target.attributes.health -= this.attributes.attack;
				} else {
					this.currentAction = "IDLE";
				}
			} else if (this.currentAction == "DYING") {
				this.currentAction = "DEATH";
			}
			this.frame = 0;
			this.timeSinceAnimationStarted = 0;

		}
		if (this.currentAction == "DYING" || this.currentAction == "DEATH") {
			return;
		}
		if (this.attributes.health <= 0 && this.currentAction != "DYING") { //Is it dead?
			this.die();
			return;
		}

		for (let i = 0; i < this.attributes.modifiers; i++) { //Can any of it's modifiers be applied?
			let currentModifier = this.attributes.modifiers[i];
			if (currentModifier.condition(this) === true) {
				currentModifier.attributeChange(this);
			}
		}
		if (this.path.length !== 0) { //Am I currently going somewhere?
			let distanceToMove = (time / 1000) * this.attributes.movementSpeed;
			this.position = coord.movePointAlongLine(this.position, this.path[0], distanceToMove);
			if (coord.distance(this.position, this.path[0]) < distanceToMove) { //Did I make it where I need to go?
				this.path.shift();
			}
		} else { //Finished my path, go into idle.
			this.currentAction = "IDLE";
		}
		if ((this.target === null && this.getNearbyEnemies().length !== 0) && this.currentAction == "IDLE") { //Is there a nearby enemy I can attack?
			let nearbyEnemies = this.getNearbyEnemies();
			let closestEnemy = null;
			let closestEnemyDistance = Infinity;
			for (let i = 0; i < nearbyEnemies.length; i++) {
				if (nearbyEnemies[i].hasTag("Hidden")) { //Don't bother looking at nearby people if they're hidden.
					continue;
				}
				let currentDistance = coord.distance(this.position, nearbyEnemies[i].position);
				if (currentDistance < closestEnemyDistance) {
					closestEnemy = nearbyEnemies[i];
					closestEnemyDistance = currentDistance;
				}
			}
			this.target = closestEnemy;
		}
		if (this.target !== null) { //If there's a target:
			if (this.target.currentAction == "DEATH" || this.target.attributes.health <= 0) { //Whoops, he's dead. Lets not bother him any more.
				this.target = null;
			} else if (coord.distance(this.target.position, this.position) >= this.attributes.viewRange) { //Can i still see the target?
				this.target = null;
				this.currentAction = "IDLE";
			} else if (coord.distance(this.target.position, this.position) <= this.attributes.attackRange) { //Should I move to follow my target?
				if (this.currentAction != "ATTACK") { //If we aren't already attacking...
					this.path = [];
					this.currentAction = "ATTACK";
				}
			} else { //Follow him!
				this.currentAction = "WALK";
				this.path = [this.target.position];
			}
		}
	}
	getCollisionGrid(){

	}
	render() {
		//The way we render only a section of the spritesheet is to embed it in another svg and set the viewbox.
		//Other methods here: http://stackoverflow.com/questions/16983442/how-to-specify-the-portion-of-the-image-to-be-rendered-inside-svgimage-tag
		if (this.currentAction == "DEATH") {
			return [];
		}
		const totalWidth = this.attributes.animationData[this.currentAction].size.x;
		const frameWidth = (totalWidth / this.attributes.animationData[this.currentAction].frames);
		const frameHeight = this.attributes.animationData[this.currentAction].size.y;
		const viewBox = (frameWidth * this.frame).toString() + " 0 " + frameWidth.toString() + " " + frameHeight.toString();
		const chalklingImage = "<svg x=\"" + this.topLeft.x + "\" y=\"" + this.topLeft.y + "\" width=\"100px\" height=\"100px\" viewBox=\"" + viewBox + "\">" + "<image x=\"0px\" y=\"0px\" width=\"" + totalWidth.toString() + "\" height=\"" + frameHeight + "\" xlink:href=\"" + this.getAnimation() + "\"" + "/></svg>";
		const healthBarOutside = '<rect x="' + (this.topLeft.x).toString() + '" y="' + (this.topLeft.y + 110).toString() + '" width="100" height="5" fill="green"/>';
		const healthRatio = Math.max(0, (((this.attributes.maxHealth - this.attributes.health) / this.attributes.maxHealth) * 100));
		const healthBarLeft = '<rect x="' + ((this.topLeft.x) + (100 - healthRatio)).toString() + '" y="' + (this.topLeft.y + 110).toString() + '" width="' + healthRatio.toString() + '" height="5" fill="red"/>';
		const healthBarTotal = healthBarOutside + healthBarLeft;
		return [new RenderedElement(chalklingImage, "ChalklingImage"), new RenderedElement(healthBarTotal, "ChalklingHealth")];
	}
}
