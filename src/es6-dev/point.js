 	export default class Point {
 		constructor(x, y, id = 1) {
 			this.x = x;
 			this.y = y;
 			this.id = id; // stroke ID to which this point belongs (1,2,...)
 		}
 		add(point) {
 			return new Point(this.x + point.x, this.y + point.y);
 		}
 		subtract(point) {
 			return new Point(this.x - point.x, this.y - point.y);
 		}
 		crossProduct(point) {
 			return (this.x * point.y) - (this.y * point.x);
 		}
 		scale(factor) {
 			return new Point(this.x * factor, this.y * factor);
 		}
 		isZero() {
 			return (this.x === 0 && this.y === 0);
 		}
 		round() {
 			return new Point(Math.round(this.x), Math.round(this.y));
 		}
 	}
