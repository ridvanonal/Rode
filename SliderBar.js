const rangeBarTemplate = document.createElement("template")
rangeBarTemplate.innerHTML = 
  `
  <style>
  :host{
    display:block;
    height:50px;
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
                        background-color .2s linear,
                        opacity .2s linear;
    -ms-transition: width .3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                    background-color .2s linear,
                    opacity .2s linear;
    transition: width .3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                background-color .2s linear,
                opacity .2s linear;
  }
  :host([darkmode=false]) > div{
    background-color: rgba(174,174,178,0.5) !important;
  }
  :host([darkmode=false]) > div::after{
    background-color:rgba(242,242,247,0.75) !important;
  }
  :host([darkmode=true]) > div{
    background-color: rgba(99,99,102,0.5) !important;
  }
  :host([darkmode=true]) > div::after{
    background-color:rgba(28,28,30,0.75) !important;
  }
  :host([disabled]) > div{
    pointer-events: none !important;
  }
  :host([disabled]) > div::after {
    opacity:0.5 !important;
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
    if(this.async) this.setAttribute("value",this.asyncValueCheck(value))
    else this.setAttribute("value",this.syncValueCheck(value))
  }

  get darkMode(){
    return this.getAttribute("darkmode")
  }

  set darkMode(bool){
    this.setAttribute("darkmode",bool)
  }

  get onChange(){
    return this.getAttribute("onchange")
  }

  set onChange(event){
    this.setAttribute("onchange",event)
  }

  get onValue(){
    return this.getAttribute("onvalue")
  }

  set onValue(event){
    this.setAttribute("onvalue",event)
  }

  get disabled(){
    return this.hasAttribute("disabled")
  } 

  set disabled(bool){
    if(bool) this.setAttribute("disabled","")
    else this.removeAttribute("disabled")
  }

  get async(){
    return this.hasAttribute("async")
  } 

  set async(bool){
    if(bool) this.setAttribute("async","")
    else this.removeAttribute("async")
  }

  static get observedAttributes(){
    return ["value","name"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch(attr){
      case 'value':
        if(this.isConnected) this.onValueChange()
        if(this.isConnected && this.name) this.querySelector("input").value = this.value
        if(this.isConnected && this.onChange) eval(this.onChange)
        if(this.isConnected && this.onValue && Number(this.onValue.split(",")[0]) == this.value) eval(this.onValue.split(",")[1])
      break;
      case 'name':
        if(this.isConnected && this.name) this.querySelector("input").name = this.name
      break;
    }
  }

  onClick = (event) => {
    if(event.offsetX<=this.offsetWidth-10) this.value = this.min + this.step*this.piece(event.offsetX)
  }

  shred = () =>{
    return Math.floor((this.max - this.min) / this.step)
  }

  piece = (clickX) =>{
    return Math.round(0+(this.shred()-0)*(clickX-0)/((this.offsetWidth-10)-0))
  }

  syncMaxCalculator = () =>{
    this.max = (this.step) * Math.floor(this.max / this.step)
  }

  syncMinCalculator = () =>{
    this.min = (this.step) * Math.ceil(this.min / this.step)
  }

  asyncMaxCalculator = () => {
    this.max = this.min + (this.step*this.shred())
  }

  valueToWidth = () =>{
    return this.step*((0+(100-0)*(this.value-this.min)/(this.max-this.min))/this.step)
  }
  
  onValueChange = () => {
      let sheets = this.shadow.styleSheets[1]
      let rules = sheets.cssRules || sheets.rules
      rules[0].style.width = `${this.valueToWidth()}%` 
  }

  syncValueCheck = (value) => {
    if(value <= this.max && value >= this.min && value % this.step==0) return value
    else return this.min 
  }

  asyncValueCheck = (value) =>{
    if(value <= this.max && value >= this.min && (value-this.min) % this.step == 0) return value
    else return this.min
  }

  onScroll = (event) => {
    if(event.deltaY > 0 && this.value > this.min){
      this.value = this.value - this.step
    }
    else if(event.deltaY < 0 && this.value < this.max){
      this.value = this.value + this.step
    }
  }

  connectedCallback(){
    if(!this.async) this.syncMinCalculator()
    if(!this.async) this.syncMaxCalculator()
    else this.asyncMaxCalculator()
    if(!this.darkMode) this.darkMode = false   
    if(!this.min) this.min=1
    if(!this.max) this.max=100
    if(!this.step) this.step=1
    if(this.name) this.innerHTML = `<input type="hidden" name=${this.name} value=${this.value} />`
    if(!this.value) this.value=this.min
    else if(this.value && !this.async) this.value=this.syncValueCheck(this.value)
    else if(this.value && this.async) this.value=this.asyncValueCheck(this.value)
    let bar = this.shadow.querySelector(":host>div")
    let mousedown = false
    bar.addEventListener("click",this.onClick.bind(this))
    bar.addEventListener("mousemove",(event) => mousedown && this.onClick(event))
    bar.addEventListener("mousedown",()=>mousedown=true)
    bar.addEventListener("mouseup",()=>mousedown=false)
    bar.addEventListener("mouseout",()=>mousedown=false)
    bar.addEventListener("wheel",this.onScroll.bind(this))
  }
}

customElements.define("rode-rangebar",rangeBar)
