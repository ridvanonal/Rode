const stepperTemplate = document.createElement("template")
stepperTemplate.innerHTML = 
  `
  <style>
  :host{}
  :host > div{
    display: flex;
    justify-content: flex-start;
    -webkit-touch-callout: none; 
    -webkit-user-select: none;
    -khtml-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
  }
  :host > div > input{
    transition: background-color .2s linear,
                color .2s linear;
    width:150px;
    height:30px;
    border:0px;
    box-sizing:border-box;
    outline:none;
    padding:0px 10px;
    box-shadow:0px 0px 5px rgba(0,0,0,0.2);
    border-radius:10px;
  }
  :host > div > div{
    transition: background-color 0.2s linear;
    height: 30px;
    width: 16px;
    border-radius: 15px;
    overflow: hidden;
    margin-left: 5px;
    backdrop-filter:blur(10px)
  }
  :host([darkmode=false]) > div > div{
    background-color: rgba(174,174,178,0.5) !important;
  }
  :host([darkmode=true]) > div > div{
    background-color: rgba(99,99,102,0.5) !important;
  }
  :host([darkmode=false]) > div > input{
    background-color:rgba(255,255,255,0.9) !important;
    color:rgba(28,28,30,1) !important;
  }
  :host([darkmode=true]) > div > input{
    background-color:rgba(28,28,30,0.9) !important;
    color:rgba(255,255,255,1) !important;
  }
  :host > div > div > div{
    height: 15px;
    width: 16px;
    display: flex;
    align-items:center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s linear;
  }
  :host([darkmode=false]) > div > div > div:hover{
    background-color: rgb(0,122,255);
  }
  :host([darkmode=true]) > div > div > div:hover{
    background-color: rgb(10,132,255);
  }
  :host([darkmode=false]) > div > div > div::after{
    border-color:#414141
  }
  :host([darkmode=true]) > div > div > div::after{
    border-color:#000000
  }
  :host > div > div > div::after{
    border-right: 2px solid; 
    border-bottom: 2px solid;
    height: 6px;
    width: 6px;
    box-sizing: border-box;
    content: "";
    transition:border-color 0.1s linear;
  }
  :host > div > div > div:nth-of-type(1)::after{
    transform: rotate(-135deg);
    margin-top: 3px;
  }
  :host > div > div > div:nth-of-type(2)::after{
    transform: rotate(45deg);
    margin-top: -3px;
  }
  :host > div > div > div:hover::after{
    border-color: white;
  }
  </style>

  <div>
    <input type="text" readonly>
    <div>
        <div></div>
        <div></div>
    </div>
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

  static get observedAttributes(){
    return ["value"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch (attr) {
      case "value":
        this.valueChange()
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

  valueChange = () =>{
    this.shadow.querySelector(":host>div>input").value = this.value
  }

  onKeyPress = (event) =>{
    if(event.keyCode == 38){
      this.add()
      event.preventDefault()
    }
    else if(event.keyCode == 40){
      this.subtract()
      event.preventDefault()
    }
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
    let addButton = this.shadow.querySelector(":host>div>div>div:nth-of-type(1)")
    let subtractButton = this.shadow.querySelector(":host>div>div>div:nth-of-type(2)")
    let input = this.shadow.querySelector(":host>div>input")
    addButton.addEventListener("click",this.add)
    addButton.addEventListener("mousedown",()=>this.onLongPressDown("add"))
    addButton.addEventListener("mouseup",this.onLongPressUp)
    addButton.addEventListener("mouseleave",this.onLongPressUp)
    subtractButton.addEventListener("click",this.subtract)
    subtractButton.addEventListener("mousedown",()=>this.onLongPressDown("subtract"))
    subtractButton.addEventListener("mouseup",this.onLongPressUp)
    subtractButton.addEventListener("mouseleave",this.onLongPressUp)
    input.addEventListener("keydown",this.onKeyPress.bind(this))
  }

}

customElements.define("rode-stepper",stepper)