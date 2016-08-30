export default class Point {
	constructor(x, y, id) {
		this.X = x;
		this.Y = y;
		this.ID = id; // stroke ID to which this point belongs (1,2,...)
	}
	add(point) {
		this.X = (this.X + point.X);
		this.Y = (this.Y + point.Y);
		return this;
	}
	subtract(point) {
		this.X = (this.X - point.X);
		this.Y = (this.Y - point.Y);
		return this;
	}
	multiply(point) {
		this.X = (this.X * point.X);
		this.Y = (this.Y * point.Y);
		return this;
	}
	divide(point) {
		this.X = (this.X / point.X);
		this.Y = (this.Y / point.Y);
		return this;
	}
	isZero() {
		return (this.X === 0 && this.Y === 0);
	}
}
