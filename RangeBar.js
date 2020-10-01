const rangeBarTemplate = document.createElement("template")
rangeBarTemplate.innerHTML = 
`
<style>
:host{
  display:block;
  height:50px;
  width:300px;
}
:host > div{
  width:100%;
  height:100%;
  border-radius:15px;
  overflow: hidden;
  background-color: rgba(174,174,178,0.5) !important;
  border: 0px solid transparent;
  box-sizing: border-box;
  transition: border .09s linear;
}
:host > div:hover{
  border-width: 5px;
}
:host > div::after{
  height: 100%;
  content: "";
  display: block;
  background-color:rgba(242,242,247,0.5);
  transition: width .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
<style> :host > div::after{ width:0% } </style>
<div></div>
`
class rangeBar extends HTMLElement{
  constructor(){
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(rangeBarTemplate.content.cloneNode(true))
  }

  get min(){
    return this.getAttribute("min")
  }

  set min(minValue){
    this.setAttribute("min",minValue)
  }

  get max(){
    return this.getAttribute("max")
  }

  set max(maxValue){
    this.setAttribute("max",maxValue)
  }

  get value(){
    return this.getAttribute("value")
  }

  set value(value){
    this.setAttribute("value",value)
  }

  get step(){
    return this.getAttribute("step")
  }

  set step(stepValue){
    this.setAttribute("step",stepValue)
  }

  minCalculator = () => {
    this.min = (this.step) * Math.ceil(this.min / this.step)
  }

  maxCalculator = () => {
    this.max = (this.step) * Math.floor(this.max / this.step)
  }

  static get observedAttributes(){
    return ["value"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch(attr){
      case 'value':
        if(newValue % this.step == 0 && this.isConnected) this.valueChanged() 
        else {console.log('%c Invalid Value! ', 'color: rgb(255,59,48)')
              if(oldValue) this.value=oldValue}
      break;
    }
  };

  onClick = (event) => {
    let sheets = this.shadow.styleSheets[1]
    let rules = sheets.cssRules || sheets.rules
    let clickedPoint = (event.offsetX / (this.offsetWidth-10)) * 100
    clickedPoint > 100 ? clickedPoint=100 : null
    clickedPoint < 0 ? clickedPoint=0 : null
    let divider = 100 / ((this.max - this.min) / this.step)
    let newBarValue = divider * Math.round(clickedPoint / divider)
    rules[0].style.width = `${newBarValue}%`
    if(this.widthToValue(newBarValue) >= this.min && this.widthToValue(newBarValue) <= this.max) this.value = this.widthToValue(newBarValue)
  }

  valueToWidth = () =>{
    return this.step*((0+(100-0)*(this.value-this.min)/(this.max-this.min))/this.step)
  }

  widthToValue = (width) =>{
    return this.step*Math.round((parseInt(this.min)+(this.max-this.min)*(width-0)/(100-0))/this.step)
  }

  valueChanged = () => {
      let sheets = this.shadow.styleSheets[1]
      let rules = sheets.cssRules || sheets.rules
      rules[0].style.width = `${this.valueToWidth()}%` 
  }

  onScroll = (event) => {
    let sheets = this.shadow.styleSheets[1]
    let rules = sheets.cssRules || sheets.rules
    if(event.wheelDelta < 0 && this.value!=this.min){
      this.value = parseInt(this.value) - parseInt(this.step)
    }
    else if(event.wheelDelta>0 && this.value != this.max){
      this.value = parseInt(this.value) + parseInt(this.step)
    }
    rules[0].style.width = `${this.valueToWidth()}%`
  }

  connectedCallback(){
    this.minCalculator()
    this.maxCalculator()
    if(!this.value) this.value=this.min
    if(!this.min) this.min=1
    if(!this.max) this.max=100
    if(!this.step) this.step=1
    let bar = this.shadow.querySelector(":host>div")
    let mousedown = false
    bar.addEventListener("click",this.onClick.bind(this))
    bar.addEventListener("mousemove",(event) => mousedown && this.onClick(event))
    bar.addEventListener("mousedown",()=>mousedown=true)
    bar.addEventListener("mouseup",()=>mousedown=false)
    bar.addEventListener("mouseout",()=>mousedown=false)
    bar.addEventListener("mousewheel",this.onScroll.bind(this))
  }
}

customElements.define("rode-rangebar",rangeBar)