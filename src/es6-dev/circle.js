import PDollarRecognizer from './recognizer';
import Unit from './unit.js';
import * as coord from './coord.js';
import Point from './point.js';
import RenderedElement from './renderedElement.js';
import Rune from './rune.js';
import SAT from './SAT.js';
export default class Circle extends Unit {
	constructor(points, id, player, root = false) {
		//Close the circle
		let position = coord.centroid(points);
		let rootObj = (root)? {
			"tags": [
				"root"
			]
		} : {};
		super("Circle", id, player, position, rootObj);
		this.points = points;
		this.hasBinded = [];
		this.bindPointsCoord = [];
		this.bindPointsDegrees = [];
		this.bindPointConfig = 2;
		this.getConvexHull();
		this.setHealth();
		this.deductHealth();
		this.toSATPolygon();
	}
	setHealth() {
		this.points.pop();
		//Find the average distance (radius)
		let distances = 0;
		this.position = coord.centroid(this.points);
		for (let i = 0; i < this.points.length; i++) {
			distances += coord.distance(this.position, this.points[i]);
		}
		let radius = distances / this.points.length;
		this.radius = radius;

		const MAX = Math.round(this.radius) * 10; //Health is related to the number of points (10 health per point) which is the Radius. E.g bigger circle = more points = more health
		let health = MAX;
		this.attributes.possibleHealth = MAX;
		this.attributes.health = health;
	}
	deductHealth() {
		let health = this.attributes.health;
		for (let i = 0; i < this.points.length; i++) { //Deduct health for each point that's off center.
			let distance = coord.distance(this.points[i], this.position);
			health -= (distance / this.radius);
			//This means that a big circle will allow for more error.
		}
		this.points.push(this.points[0]);
		this.attributes.maxHealth = health;
		this.attributes.health = health;
	}
	getConvexHull() { //When someone draws lines they can be complex (self-intersecting) which makes it impossible to detect collisions.
		//We need to make a hull of the polygon which is convex: http://www.cs.jhu.edu/~misha/Fall05/09.13.05.pdf
		let firstPoint = new Point(Infinity, Infinity);
		for (let i = 0; i < this.points.length; i++) { //Get the leftmost point to start
			if (this.points[i].x < firstPoint.x) {
				firstPoint = this.points[i];
			}
		}
		let currentPoint = firstPoint;
		let hull = [];
		do {
			hull.push(currentPoint);
			//Using the gift-wrapping algorithm
			let nextPoint;
			nextPoint = this.points[0];
			while (nextPoint == currentPoint) { //Make sure the first point we use isn't the currentPoint o that we aren't stuck in infinite loop.
				nextPoint = this.points[Math.round(Math.random() * this.points.length) - 1];
			}
			//BUG: This whole function might get stuck in an infinite loop. It has in the past, BUT hopefully the above while loop will fix it. If it pops up again look here.
			for (let i = 0; i < this.points.length; i++) {
				const orientation = ((nextPoint.x - currentPoint.x) * (this.points[i].y - currentPoint.y) - (nextPoint.y - currentPoint.y) * (this.points[i].x - currentPoint.x));
				if (orientation > 0) { //We found a most that is to the left (more outer) than our nextPoint
					nextPoint = this.points[i];
				}
			}
			if (currentPoint == nextPoint) {
				//Shit, stuck in an infinite loop
				alert("Oh shit, IT HAPPENED AGAIN");
				break;
			}
			currentPoint = nextPoint;
		}
		while (currentPoint != firstPoint);
		hull.push(firstPoint); //Finish the loop
		this.points = hull;
		this.position = coord.centroid(this.points);
	}
	toSATPolygon() {
		let P = SAT.Polygon; //Shortening for easier typing
		let V = SAT.Vector;
		let pointArray = [];
		for (let i = 0; i < this.points.length; i++) {
			pointArray.push(new V(this.points[i].x, this.points[i].y));
		}
		let polygon = new P(new V(), pointArray);
		//Now check to see if we are clockwise or counter-clockwise : http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
		this.collisionPolygon = polygon;
	}
	averageDistanceFromCenter() {
		let distances = 0;
		for (let i = 0; i < this.points.length; i++) {
			distances += coord.distance(new Point(this.position.x, this.position.y), this.points[i]);
		}
		let avgDistance = distances / this.points.length;
		return avgDistance;
	}
	moveTo(point) {
		this.points = coord.translateTo(this.points, point);
		this.position = point;
	}
	getBinded(object) { //depth-first search to find all objects of type object
		let binded = [];
		this.getBindedIncursion(this, object, binded);
		return binded;
	}
	getBindedIncursion(circle, object, binded) {
		if (circle.hasBinded.length !== 0) {
			for (let i = 0; i < circle.hasBinded.length; i++) {
				if (typeof object == "undefined" || circle.hasBinded[i].constructor.name == object || circle.hasBinded[i].constructor.name == "Circle") {
					binded.push(circle.hasBinded[i]);
					this.getBindedIncursion(circle.hasBinded[i], object, binded);
				} else {

				}
			}
		} else {
			binded.push(circle);
		}
	}
	bindRune(rune) {
		let pointOfBinding = coord.movePointAlongLine(this.position, rune.position, this.radius);
		pointOfBinding.id = 1;
		const pointInDegrees = Math.atan((pointOfBinding.y - this.position.y) / (pointOfBinding.x - this.position.x)) * (180 / Math.PI);
		this.bindPointsCoord.push(pointOfBinding);
		this.bindPointsDegrees.push(pointInDegrees);
		this.hasBinded.push(rune);
		if (this.bindPointsDegrees.length > 1) {
			const offset = this.bindPointsDegrees[0];
			let pointsOffsetCoord = [];
			for (let point in this.bindPointsDegrees) {
				pointsOffsetCoord.push(this.getDegreePoint(this.bindPointsDegrees[point] - offset));
			}
			const recognizer = new PDollarRecognizer();
			if (this.hasBinded.length <= 6) {
				recognizer.addGesture("six", [new Point(300, 150), new Point(225, 280), new Point(75, 280), new Point(0, 150), new Point(75, 20), new Point(225, 20)]);
			}
			if (this.hasBinded.length <= 4) {
				recognizer.addGesture("four", [new Point(2, 1), new Point(1, 2), new Point(0, 1), new Point(1, 0)]);
			}
			if (this.hasBinded.length <= 2) {
				recognizer.addGesture("two", [new Point(2, 1), new Point(0, 1)]);
			}
			let bestConfigAccuracy = recognizer.recognize(pointsOffsetCoord).score / 2;
			if (bestConfigAccuracy < 1) {
				bestConfigAccuracy++;
			}
			rune.attributes.health /= bestConfigAccuracy;
			rune.attributes.maxHealth /= bestConfigAccuracy;
		}
	}
	getDegreePoint(angleInDegrees) {
		let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
		return new Point(
			this.position.x + (this.radius * Math.cos(angleInRadians)),
			this.position.y + (this.radius * Math.sin(angleInRadians)),
			1
		);
	}
	makeArcGraphic(startRad, endRad, color) {
		let graphic = new PIXI.Graphics();	
		graphic.lineStyle(devConfig.circleHealthStrokeWidth, color);
		graphic.arc(this.position.x, this.position.y, this.radius, startRad, endRad);
		return graphic;
	}
	/**
	 * Updates the given grid with walkable positions of this circle
	 * @param  {PF.Grid} currentGrid The navmesh to be updated
	 * @return {void}             
	 */
	generateNavMesh(currentGrid){
		for(let i = 0; i<this.points.length; i++){ //Color in all lines around the circle
			const p1 = this.points[i];
			let p2;
			if(i == this.points.length-1){
				p2 = this.points[0];
			}
			else{
				p2 = this.points[i+1];
			}
			const dx = p2.x - p1.x;
			const dy = p2.y - p1.y;
			const steps = (Math.abs(dy/dx) > 1)? Math.abs(dy) : Math.abs(dx)
			//If the slope is greater than one, we need to check every y coord from y1 to y2. 
			//If the slope is less than one, we check every x values from x1 to x2.
			const unit = devConfig.collisionGridUnitSize;
			const xIncrement = unit * (dx/steps);
			const yIncrement = unit * (dy/steps); 
			let tempX = p1.x;
			let tempY = p1.y;
			for(let j = 0; j<steps/unit; j++){
				tempX += xIncrement;
				tempY += yIncrement;
				const gridX = Math.floor(tempX/unit);
				const gridY = Math.floor(tempY/unit);
				currentGrid[gridY][gridX] = 1;
			}
		}
	}
	renderBinded() {
		let renderString = '';
		let binded = getBinded(this);
		for (let i = 0; i < binded; i++) {
			renderString = +(binded[i].render());
		}
		return renderString;
	}
	render() {
		let radius = this.radius;
		let r = radius.toString();
		
		let healthRatio = 1 - (this.attributes.health / this.attributes.maxHealth);
		const swidth = devConfig.circleHealthStrokeWidth;
		const deductRatio = 2 * Math.PI * (1 - (this.attributes.maxHealth / this.attributes.possibleHealth));
		let realCircle = new Rune(this.points).render();
		return [new RenderedElement(this.makeArcGraphic(0, deductRatio, 0xffffff), "CircleTrue"), new RenderedElement(this.makeArcGraphic(deductRatio, 6.28, 0xff0000), "CircleTrue"), new RenderedElement(this.makeArcGraphic(deductRatio + healthRatio * (6.28-deductRatio), 6.28, 0x00ff00), "CircleTrue"), realCircle[0]];
	}
}
