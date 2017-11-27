export default class Renderer {
	constructor(element){
		this.queue = [];
		this.element = element;
		this.stage;
		this.renderer;
	}
	setup(callback){
		this.renderer = PIXI.autoDetectRenderer(1000, 500);
		this.renderer.backgroundColor = 0xffffff;
		document.getElementById(this.element).append(this.renderer.view);
		this.stage = new PIXI.Container();
		PIXI.loader
			.add("./chalklings/Testling/Animations/Idle.png")
			.add("./chalklings/Testling/Animations/Dying.png")
			.add("./chalklings/Testling/Animations/Attack.png")
			.add("./chalklings/Testling/Animations/Walk.png")
			.load(callback);
	}
	addToRenderQueue(graphicsArray){
		this.queue = this.queue.concat(graphicsArray);
	}
	render(){
		if(this.stage.children.length != 0){
			this.stage.removeChildren();
		}
		let elementOrderHashtable = {};
		//Make a dictionary of the render order as the key and the elements with that order as the data. 
		for (let renderedElement of this.queue) {
			const num = devConfig.renderOrder[renderedElement.type];
			if(elementOrderHashtable[num] === undefined){
				elementOrderHashtable[num] = [renderedElement.displayObj]
			}
			else{
				elementOrderHashtable[num].push(renderedElement.displayObj)
			}
		}
		const orderedKeys = Object.keys(elementOrderHashtable).sort(function(a, b){ 
			return a-b
		});
		//"But you could use quick sort or merge sort!" I'm thinking that because the array is so small, it might not matter that I'm using this. 
		//TODO: Test other sorting methods to see if there's a difference. 
		for(let key of orderedKeys){
			let displayLayer = elementOrderHashtable[key];
			for(let displayObj of displayLayer){
				this.stage.addChild(displayObj);
			}
		}
		this.renderer.render(this.stage);
 		this.queue = [];
	}
}