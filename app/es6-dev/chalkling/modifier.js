export default class Modifier{
  /*
  Takes a condition(function with the first param is the chalkling). If true, change the attribute.
  Attribute is a function also with first param as the chalkling it's affecting.
  */
  constructor(condition, attributeChange){
    this.Condition = condition;
    this.AttributeChange = attributeChange;
  }
  /* Example Modifier: On critical hit, restore all health. 
    new Modifier(function(chalkling){
      return (chalkling.CurrentAction == "CRITICAL";)
    }, function(chalkling){
      chalkling.Attributes.Health = chalkling.Attributes.MaxHealth;
    });
  */
}
