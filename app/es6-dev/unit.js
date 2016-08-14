export default class Unit{
  constructor(name, id, player, position, attributes){
    this.Name = name;
    this.ID = id;
    this.Player = player;
    this.Position = position;
    this.Attributes = attributes;
    this.Attributes.Health = this.Attributes.MaxHealth;
  }
  hasTags(...tags){
    let tagsMatch = 0;
    for(let i = 0; i<this.Attributes.Tags;i++){
      for(let j = 0; j<tagslength; j++){
        if(this.Attributes.Tags[i] == tags[j]){
          tagsMatch++;
          if(tagsMatch == tags.length){
            return true
          }
        }
      }
    }
    return false;
  }
  hasTag(tag){
    for(let i = 0; i<this.Attributes.Tags;i++){
      if(this.Attributes.Tags[i] == tag){
        return true;
      }
    }
    return false;
  }
}
