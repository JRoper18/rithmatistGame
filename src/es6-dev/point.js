export default class Point {
	constructor(x, y, id) {
		this.X = x;
		this.Y = y;
		this.ID = id; // stroke ID to which this point belongs (1,2,...)
	}
	add(point) {
		return new Point(this.X + point.X, this.Y + point.Y);
	}
	subtract(point) {
		return new Point(this.X - point.X, this.Y - point.Y);
	}
	crossProduct(point) {
		return (this.X * point.Y) - (this.Y * point.X)
	}
	scale(factor) {
		return new Point(this.X * factor, this.Y * factor);
	}
	isZero() {
		return (this.X === 0 && this.Y === 0);
	}
}
