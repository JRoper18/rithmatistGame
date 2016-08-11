export default class AttributeSet{
  constructor(health, attack, attackRate, viewRange, attackRange, speed, modifiers){
    this.MaxHealth = health;
    this.Health = health;
    this.Attack = attack;
    this.AttackRate = attackRate;
    this.ViewRange = viewRange;
    this.AttackRange = attackRange;
    this.MovementSpeed = speed;
    this.Modifiers = modifiers;
  }
}
