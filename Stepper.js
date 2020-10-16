const stepperTemplate = document.createElement("template")
stepperTemplate.innerHTML = 
  `
  <style>
  :host{
    display:inline-block;
  }
  :host > div{
    transition: background-color 0.2s linear;
    height: 30px;
    width: 16px;
    border-radius: 15px;
    overflow: hidden;
    backdrop-filter:blur(10px)
  }
  :host([darkmode=false]) > div{
    background-color: rgba(174,174,178,0.5) !important;
  }
  :host([darkmode=true]) > div{
    background-color: rgba(99,99,102,0.5) !important;
  }
  :host > div > div{
    height: 15px;
    width: 16px;
    display: flex;
    align-items:center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s linear;
  }
  :host([darkmode=false]) > div > div:hover{
    background-color: rgb(0,122,255);
  }
  :host([darkmode=true]) > div > div:hover{
    background-color: rgb(10,132,255);
  }
  :host([darkmode=false]) > div > div::after{
    border-color:#414141
  }
  :host([darkmode=true]) > div > div::after{
    border-color:#000000
  }
  :host > div > div::after{
    border-right: 2px solid; 
    border-bottom: 2px solid;
    height: 6px;
    width: 6px;
    box-sizing: border-box;
    content: "";
    transition:border-color 0.1s linear;
  }
  :host > div > div:nth-of-type(1)::after{
    transform: rotate(-135deg);
    margin-top: 3px;
  }
  :host > div > div:nth-of-type(2)::after{
    transform: rotate(45deg);
    margin-top: -3px;
  }
  :host > div > div:hover::after{
    border-color: white;
  }
  </style>

  <div>
      <div></div>
      <div></div>
  </div>
  `
class stepper extends HTMLElement{
  constructor(){
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(stepperTemplate.content.cloneNode(true))
    this.longSetTimeOut
    this.longSetInterval
  }

  get value(){
    return Number(this.getAttribute("value"))
  }

  set value(value){
    this.setAttribute("value",value)
  }

  get step(){
    return Number(this.getAttribute("step"))
  }

  set step(step){
    this.setAttribute("step",step)
  }

  get min(){
    return this.getAttribute("min")
  }

  set min(min){
    this.setAttribute("min",min)
  }

  get max(){
    return this.getAttribute("max")
  }

  set max(max){
    this.setAttribute("max",max)
  }

  get darkmode(){
    return this.getAttribute("darkmode")
  }

  set darkmode(bool){
    this.setAttribute("darkmode",bool)
  }

  get onchange(){
    return this.getAttribute("onchange")
  }

  set onchange(event){
    this.setAttribute("onchange",event)
  }

  static get observedAttributes(){
    return ["value"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch (attr) {
      case "value":
        if(this.isConnected && this.onchange) eval(this.onchange.replace(`()`,`(${this.value})`))
      break;
    }
  }

  add = () =>{
    if(this.max)
    if(this.value < this.max ) this.value += this.step
    if(!this.max) this.value += this.step
  }

  subtract = () =>{
    if(this.min)
    if(this.value > this.min) this.value -= this.step
    if(!this.min) this.value -= this.step
  }

  maxCalculator = () =>{
    this.max = Number(this.min) + (this.step*(Math.floor((this.max - Number(this.min)) / this.step)))
  }

  onLongPressDown = (type) =>{
    this.longSetTimeOut = setTimeout(()=>{
      if(type=="add") this.longSetInterval = setInterval(()=>{this.add()},150)
      if(type=="subtract") this.longSetInterval = setInterval(()=>{this.subtract()},150)
    },200)
    return false
  }

  onLongPressUp = () =>{
    clearTimeout(this.longSetTimeOut)
    clearInterval(this.longSetInterval)
  }

  connectedCallback(){
    if(this.max) this.maxCalculator()
    if(!this.step) this.step = 1
    if(!this.value) this.value = this.min ? this.min : 0
    if(!this.darkmode) this.darkmode = false
    let addButton = this.shadow.querySelector(":host>div>div:nth-of-type(1)")
    let subtractButton = this.shadow.querySelector(":host>div>div:nth-of-type(2)") 
    addButton.addEventListener("click",this.add)
    addButton.addEventListener("mousedown",()=>this.onLongPressDown("add"))
    addButton.addEventListener("mouseup",this.onLongPressUp)
    addButton.addEventListener("mouseleave",this.onLongPressUp)
    subtractButton.addEventListener("click",this.subtract)
    subtractButton.addEventListener("mousedown",()=>this.onLongPressDown("subtract"))
    subtractButton.addEventListener("mouseup",this.onLongPressUp)
    subtractButton.addEventListener("mouseleave",this.onLongPressUp)
  }

}

customElements.define("rode-stepper",stepper)