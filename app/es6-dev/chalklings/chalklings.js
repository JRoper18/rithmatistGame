import Chalkling from '../chalkling/chalkling.js';
import AttributeSet from '../chalkling/attributeSet.js';
import ChalklingCommand from '../chalkling/chalklingCommand.js';
import Point from '../point.js';

export const Testling = new Chalkling("Testling", 1, "blue", new Point(300,300), new AttributeSet(
  100,
  10,
  1000,
  600,
  300,
  100
));
export const EnemyTestling = new Chalkling("Enemy Testling", 2, "red", new Point(500,300), new AttributeSet(
  100,
  10,
  1000,
  3000,
  200,
  100
));
