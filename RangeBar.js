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
    border: 0px solid transparent;
    box-sizing: border-box;
    -webkit-transition: border .09s linear,
                        background-color .2s linear ;
    -ms-transition: border .09s linear,
                    background-color .2s linear;
    transition: border .09s linear,
                background-color .2s linear !important;
  }
  :host > div:hover{
    border-width: 5px;
  }
  :host > div::after{
    height: 100%;
    content: "";
    display: block;
    -webkit-transition: width .3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                        background-color .2s linear;
    -ms-transition: width .3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                    background-color .2s linear;
    transition: width .3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                background-color .2s linear;
  }
  :host([darkmode=false]) > div{
    background-color: rgba(174,174,178,0.5) !important;
  }
  :host([darkmode=false]) > div::after{
    background-color:rgba(242,242,247,0.5) !important;
  }
  :host([darkmode=true]) > div{
    background-color: rgba(99,99,102,0.5) !important;
  }
  :host([darkmode=true]) > div::after{
    background-color:rgba(28,28,30,0.5) !important;
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

  get name(){
    return this.getAttribute("name")
  }

  set name(name){
    this.setAttribute("name",name)
  }

  get min(){
    return Number(this.getAttribute("min"))
  }

  set min(minValue){
    this.setAttribute("min",minValue)
  }

  get max(){
    return Number(this.getAttribute("max"))
  }

  set max(maxValue){
    this.setAttribute("max",maxValue)
  }

  get step(){
    return Number(this.getAttribute("step"))
  }

  set step(stepValue){
    this.setAttribute("step",stepValue)
  }

  get value(){
    return Number(this.getAttribute("value"))
  }

  set value(value){
    this.setAttribute("value",this.valueChecked(value))
  }

  get darkMode(){
    return this.getAttribute("darkMode")
  }

  set darkMode(bool){
    this.setAttribute("darkMode",bool)
  }

  get onChange(){
    return this.getAttribute("onChange")
  }

  set onChange(event){
    this.setAttribute("onChange",event)
  }

  get onValue(){
    return this.getAttribute("onValue")
  }

  set onValue(event){
    this.setAttribute("onValue",event)
  }

  minCalculator = () => {
    this.min = (this.step) * Math.ceil(this.min / this.step)
  }

  maxCalculator = () => {
    this.max = (this.step) * Math.floor(this.max / this.step)
  }

  static get observedAttributes(){
    return ["value","name"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch(attr){
      case 'value':
        if(this.isConnected) this.onValueChanged()
        if(this.isConnected && this.name) this.querySelector("input").value = this.value
        if(this.isConnected && this.onChange) eval(this.onChange)
        if(this.isConnected && this.onValue && Number(this.onValue.split(",")[0]) == this.value) eval(this.onValue.split(",")[1])
      break;
      case 'name':
        if(this.isConnected && this.name) this.querySelector("input").name = this.name
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
    return this.step*Math.round((this.min+(this.max-this.min)*(width-0)/(100-0))/this.step)
  }

  onValueChanged = () => {
      let sheets = this.shadow.styleSheets[1]
      let rules = sheets.cssRules || sheets.rules
      rules[0].style.width = `${this.valueToWidth()}%` 
  }

  valueChecked = (value) => {
    if(value <= this.max && value >= this.min && value % this.step==0) return value
    else return this.min 
  }

  onScroll = (event) => {
    let sheets = this.shadow.styleSheets[1]
    let rules = sheets.cssRules || sheets.rules
    if(event.wheelDelta < 0 && this.value!=this.min){
      this.value = this.value - this.step
    }
    else if(event.wheelDelta>0 && this.value != this.max){
      this.value = this.value + this.step
    }
    rules[0].style.width = `${this.valueToWidth()}%`
  }

  connectedCallback(){
    this.minCalculator()
    this.maxCalculator()
    if(!this.darkMode) this.darkMode = false   
    if(!this.min) this.min=1
    if(!this.max) this.max=100
    if(!this.step) this.step=1
    if(!this.value) this.value=this.min
    if(this.name) this.innerHTML = `<input type="hidden" name=${this.name} value=${this.value} />`
    else this.value=this.valueChecked(this.value)
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