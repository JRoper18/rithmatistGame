import * as coord from './coord.js';
import Point from './point.js';
import Rune from './rune.js';
import Circle from './circle.js';
import {
	Testling
} from './chalklings.js';
import Chalkling from './chalkling.js';
import Line from './line.js';
import RenderedElement from './renderedElement.js';
import SelectedOverlay from './selectedOverlay.js';
import SAT from './SAT.js';

export default class GameState {
	constructor(size) {
			this.contains = [new Circle([new Point(100, 0, 1), new Point(170, 39, 1), new Point(200, 100, 1), new Point(170, 170, 1), new Point(100, 200, 1), new Point(39, 170, 1), new Point(0, 100, 1), new Point(39, 39, 1), new Point(100, 0, 1)
    ], 2, "red", true)];
			this.contains.push(new Testling(2, "red", new Point(500, 200)));
			this.contains[0].attributes.health = 20;
			this.selected = [];
			this.size = size;
			this.contains[0].moveTo(new Point(300, 300));
			this.idGenerator = this.getId();
			this.navMesh = this.generateNavMesh();
			this.pathfinder = new PF.AStarFinder();
	} *
	getId() {
		let index = 3;
		while (true) {
			yield index++;
		}
	}
	generateNavMesh(){
		const unit = devConfig.collisionGridUnitSize;
		let matrix = new Array(Math.ceil(this.size.y/unit));
		for(let i = 0; i<matrix.length; i++){
			matrix[i] = new Array(Math.ceil(this.size.x/unit)).fill(0);
		}
		for(let i = 0; i<this.contains.length; i++){
			this.contains[i].generateNavMesh(matrix);
		}
		return new PF.Grid(matrix);
	}
	getCircles() {
		let circles = [];
		this.getBinded((rune) => {
			if (rune.constructor.name == "Circle") {
				circles.push(rune);
			}
		});
		return circles;
	}
	newCircle(circle) {
		let allCircles = this.getCircles();
		let mostLikelyCircle;
		let mostLikelyCircleError = Infinity;
		for (let i = 0; i < allCircles.length; i++) {
			let tempCircle = allCircles[i];
			let currentDistance = coord.distance(tempCircle.position, circle.position);
			let tempCircleError = currentDistance - (circle.radius + tempCircle.radius); //Measures to see how close the new circle is to touching the outside of the current one.
			if (tempCircleError < mostLikelyCircleError) { //The ideal error is 0 (they are perfectly tangent circles)
				mostLikelyCircleError = tempCircleError;
				mostLikelyCircle = tempCircle;
			}
		}
		if (mostLikelyCircleError > 50) { //If the error is too high (>50 pixels);
			//Don't bind it, just make it unbinded.
			this.contains.push(circle);
		} else { //It's probably binded to the mostLikelyCircle
			let currentToBinded = coord.distance(circle.position, mostLikelyCircle.position);
			let error = currentToBinded - circle.radius - mostLikelyCircle.radius;
			circle.moveTo(coord.movePointAlongLine(circle.position, mostLikelyCircle.position, error));
			mostLikelyCircle.bindRune(circle);
		}
	}
	newRune(name, points, team) {
		switch (name) {
			case "circle":
				let circle = new Circle(points, this.idGenerator.next(), "blue");
				this.newCircle(circle);
				break;
			case "attack":
				this.contains.push(new Testling(this.idGenerator.next(), team, new Point(coord.centroid(points).x, coord.centroid(points).y)));
				break;
			case "line":
				let distance = coord.distance(points[0], points[1]);
				let lines = [];
				for (let i = 0; i < distance / 10; i++) {
					let point1 = coord.movePointAlongLine(points[0], points[1], i * 10);
					let point2 = coord.movePointAlongLine(points[0], points[1], (i + 1) * 10);
					let line = new Line(point1, point2, this.idGenerator.next(), team);
					lines.push(line);
					//TODO:20 Don't just push it randomly, bind it
					this.contains.push(line);
				}
				//TODO:0 Check the first, last, and middle lines to circle bind points and then bind them.
				break;
			default:
		}
	}
	moveSelectedAlongPath(path) {
		if (this.selected[0] !== null) {
			for (let i = 0; i < this.selected.length; i++) {
				let currentSelected = this.selected[i];
				currentSelected.moveAlongPath(path);
			}
		}
	}
	getBinded(callback = function() {}, parent = false) { //depth-first search.
		//If parent is true, the callback will be function(parent, child)
		let binded = [];
		for (let i = 0; i < this.contains.length; i++) {
			this.getBindedIncursion(this.contains[i], binded, callback, parent);
		}
		return binded;
	}
	getBindedIncursion(rune, binded, callback, parent) {
		if (typeof rune.hasBinded != "undefined") { //has binded stuff, find it recursively
			if (parent) {
				callback(rune);
			}
			for (let i = 0; i < rune.hasBinded.length; i++) {
				this.getBindedIncursion(rune.hasBinded[i], binded, callback, parent);
			}
			binded.push(rune);
		} else {
			binded.push(rune);
		}
		if (!parent) {
			callback(rune);
		}
	}
	removeDeadChalklings() {
		this.getBinded((rune) => {
			if (this.isChalkling(rune)) {
				if (rune.currentAction == "DEATH") {
					this.contains.splice(this.contains.indexOf(rune), 1); //If the chalkling is dead, removes is from board.
					this.selected.splice(this.contains.indexOf(rune), 1); //Also, make sure you unselect it.
				}
			}
		});
	}
	updateChalklingView() { //Updates what each chalkling can see.
		let runes = this.getBinded();
		for (let j = 0; j < runes.length; j++) {
			let newSees = [];
			for (let k = 0; k < runes.length; k++) {
				if (j == k) { //Don't add ourselves to what we see.
					continue;
				}
				if (this.isChalkling(runes[j])) {
					let currentDistance = coord.distance(runes[j].position, runes[k].position);
					if (currentDistance < runes[j].attributes.viewRange) {
						newSees.push(runes[k]);
					}
				}

			}
			runes[j].sees = newSees;
		}
	}
	doCircleChalklingCollision(circle, chalkling) { //TODO:10 Count how many collisions each chalkling has recently had so we don't end up with an endless-ly bouncing chalkling.
		let response = new SAT.Response();
		let currentlyTestedPolygon = circle.collisionPolygon;
		const BOUNCE = devConfig.chalklingCollisionBounce;
		let chalklingBox = new SAT.Box(new SAT.Vector(chalkling.topLeft.x, chalkling.topLeft.y), 100, 100).toPolygon();
		if (SAT.testPolygonPolygon(chalklingBox, currentlyTestedPolygon, response)) {
			chalkling.position.x -= (response.overlapV.x);
			chalkling.position.y -= (response.overlapV.y);
			chalkling.position = coord.movePointAlongLine(chalkling.position, circle.position, -1); //Fallback if we ever get a collision of 0 (we usually do, our library is faulty)
			chalkling.path.unshift(coord.movePointAlongLine(chalkling.position, circle.position, -1 * BOUNCE));
			chalkling.override();
		}
		response.clear();
	}
	updateHitboxes() {
		let runes = this.getBinded();
		for (let i = 0; i < runes.length; i++) {
			for (let j = 0; j < runes.length; j++) {
				if (i == j) { //Don't want to compare to ourselves.
					continue;
				}
				let entity1 = runes[i];
				let entity2 = runes[j];
				if (entity1.constructor.name == "Circle" || entity2.constructor.name == "Circle") { //One's a circle
					if (entity1.constructor.name == "Circle" && entity2.constructor.name == "Circle") { //Both circles

					} else if (entity1.constructor.name == "Circle") {
						if (this.isChalkling(entity2)) { //2 is chalkling, 1 is circle
							this.doCircleChalklingCollision(entity1, entity2);
						}

					} else if (entity2.constructor.name == "Circle") {
						if (this.isChalkling(entity1)) { //1 is chalkling, 2 is circle
							this.doCircleChalklingCollision(entity2, entity1);
						}
					} else if (entity1.constructor.name == "Line") {

					} else { //God help us everything is broken

					}
				} else if (this.isChalkling(entity1) && this.isChalkling(entity2)) { //Both are chalklings

					//For now, it's ok for them to overlap. Uncomment if you want them not to.
					/*
					//Create a bounding box around chalkling
					let firstChalklingBox = new B(new V(entity1.topLeft.x, entity1.topLeft.y), 100, 100).toPolygon();
					let secondChalklingBox = new B(new V(entity2.topLeft.x, entity2.topLeft.y), 100, 100).toPolygon();
					let collided = SAT.testPolygonPolygon(firstChalklingBox, secondChalklingBox, response);
					if(collided){
					  let collidedVector = response.overlapV.scale(0.5); //How much they overlap
					  entity1.position.x -=collidedVector.x;
					  entity1.position.y -=collidedVector.y;
					  entity2.position.x +=collidedVector.x;
					  entity2.position.y +=collidedVector.y;
					}
					*/
				}
			}
		}
	}
	removeDeadBindedRunes(runeType) {
		for (let j = 0; j < this.contains.length; j++) {
			if (this.contains[j].constructor.name == runeType) {
				if (this.contains[j].attributes.health <= 0) {
					if(this.contains[j].player == playerData)
					this.contains.splice(j, 1);
				}
			}
		}
		this.getBinded(function(parent) { //This will remove circles that are binded. We also need to check the top-level circles as well (done above).
			for (let i = 0; i < parent.hasBinded.length; i++) {
				if (parent.hasBinded[i].attributes.health <= 0) {
					parent.hasBinded.splice(i, 1);
				}
			}
		}, true);
	}
	selectChalklingAtPoint(point) {
		let V = SAT.vector;
		let B = SAT.Box;
		let vecPoint = new V(point.x, point.y);
		let chalkling = null;
		this.getBinded((rune) => {
			if (this.isChalkling(rune)) {
				if (SAT.pointInPolygon(vecPoint, new B(new V(rune.topLeft.x, rune.topLeft.y), 100, 100).toPolygon())) {
					chalkling = rune;
				}
			}
		});
		this.selected = [chalkling];
	}
	selectChalklingsInRect(point1, point2) {
		let V = SAT.Vector;
		let B = SAT.Box;
		let lesserX = (point1.x > point2.x) ? point2.x : point1.x;
		let lesserY = (point1.y > point2.y) ? point2.y : point1.y;
		let greaterX = (point1.x < point2.x) ? point2.x : point1.x;
		let greaterY = (point1.y < point2.y) ? point2.y : point1.y;
		let selected = [];
		this.getBinded((rune) => {
			if (this.isChalkling(rune)) {
				let vecPoint = new V(rune.position.x, rune.position.y);
				if (SAT.pointInPolygon(vecPoint, new B(new V(lesserX, lesserY), greaterX - lesserX, greaterY - lesserY).toPolygon())) {
					selected.push(rune);
				}
			}
		});
		this.selected = selected;
	}
	isChalkling(rune) {
		return (rune.__proto__ instanceof Chalkling)
	}
	renderSelected() {
		let selectedArray = [];
		for (let i = 0; i < this.selected.length; i++) {
			let currentRunePosition = this.selected[i].topLeft;
			selectedArray.push(new SelectedOverlay(currentRunePosition));
		}
		return selectedArray;
	}
	updateChalklingPaths(){

	}
	update(time) {
		this.removeDeadChalklings();
		this.updateHitboxes();
		this.updateChalklingView();
		this.removeDeadBindedRunes("Circle");
		this.removeDeadBindedRunes("Line");
		this.getBinded((rune) => {
			if (typeof rune.update != "undefined") {
				rune.update(time);
			}
		});
	}
	render() {
		let renderedElements = [];

		let allRunes = this.getBinded();
		allRunes = allRunes.concat(this.renderSelected());
		for(let rune of allRunes){
			renderedElements = renderedElements.concat(rune.render())
		}
		if(devConfig.showCollisionGrid){
			const unit = devConfig.collisionGridUnitSize;
			let navunit = new PIXI.Graphics();
			for(let i = 0; i<this.size.x/unit; i++){
				for(let j = 0; j<this.size.y/unit; j++){
					let xRender = i*unit;
					let yRender = j*unit;
					if(!this.navMesh.isWalkableAt(i, j)){
						navunit.beginFill(0xff0000, 0.5);
					}
					else{
						navunit.beginFill(0x00ff00, 0.5);
					}
					navunit.drawRect(xRender, yRender, unit, unit);
					navunit.endFill();
				}
			}
			renderedElements.push(new RenderedElement(navunit, "NavmeshOverlay"))	
		}
		return renderedElements;
	}
}
