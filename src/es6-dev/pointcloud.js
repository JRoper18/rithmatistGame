import * as coord from './coord.js';
import Point from './point.js';
const NumPoints = 32;

const Origin = new Point(0, 0, 0);

export default class PointCloud {
	constructor(name, points) {
		this.Name = name;
		this.Points = coord.Resample(points, NumPoints);
		this.Points = coord.Scale(this.Points);
		this.Points = coord.TranslateTo(this.Points, Origin);
	}
}
