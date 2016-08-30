import Chalkling from './chalkling.js';

export class Testling extends Chalkling {
	constructor(id, player, position) {
		super("Testling", id, player, position, {
			"MaxHealth": 100,
			"Attack": 10,
			"AttackRange": 200,
			"MovementSpeed": 100,
			"ViewRange": 3000,
			"AnimationData": {
				"IDLE": {
					"Frames": 1,
					"Time": 1000,
					"Size": {
						"X": 259,
						"Y": 194
					}
				},
				"WALK": {
					"Frames": 6,
					"Time": 800,
					"Size": {
						"X": 1500,
						"Y": 250
					}
				},
				"ATTACK": {
					"Frames": 17,
					"Time": 2000,
					"Size": {
						"X": 10850,
						"Y": 374
					}
				},
				"DYING": {
					"Frames": 19,
					"Time": 1000,
					"Size": {
						"X": 6650,
						"Y": 250
					}
				}
			},
			"Tags": [
        "Mobile",
        "Destructible",
      ]
		});
	}
}
