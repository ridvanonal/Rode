class Map{
  constructor(existingRangeMinValue,existingRangeMaxValue,desiredRangeMinValue,desiredRangeMaxValue){
    this.existingRangeMinValue = existingRangeMinValue
    this.existingRangeMaxValue = existingRangeMaxValue
    this.desiredRangeMinValue = desiredRangeMinValue
    this.desiredRangeMaxValue = desiredRangeMaxValue
  }
  map(desiredValue){
    return (this.desiredRangeMinValue+(this.desiredRangeMaxValue-this.desiredRangeMinValue)*(desiredValue-this.existingRangeMinValue)/(this.existingRangeMaxValue-this.existingRangeMinValue))
  }
  remap(desiredValue){
    return (this.existingRangeMinValue+(this.existingRangeMaxValue-this.existingRangeMinValue)*(desiredValue-this.desiredRangeMinValue)/(this.desiredRangeMaxValue-this.desiredRangeMinValue))
  }
  static map(desiredValue,existingRangeMinValue,existingRangeMaxValue,desiredRangeMinValue,desiredRangeMaxValue){
    return (desiredRangeMinValue+(desiredRangeMaxValue-desiredRangeMinValue)*(desiredValue-existingRangeMinValue)/(existingRangeMaxValue-existingRangeMinValue))
  }
}