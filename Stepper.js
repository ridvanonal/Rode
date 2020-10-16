const counterTemplate = document.createElement("template")
counterTemplate.innerHTML = 
`
<style>
  :host{
    display:inline-block;
  }
  :host > div{
    height:30px;
    width:100px;
    min-width:100px;
    background-color:red;
    border-radius:15px;
    backdrop-filter:blur(10px);
    padding:2px;
    box-sizing:border-box;
    display:flex;
  }
  :host([darkmode=true]) > div{
    background-color: rgba(99,99,102,0.5) !important;
  }  
  :host([darkmode=false]) > div{
    background-color: rgba(174,174,178,0.5) !important;
  }
  :host > div > button{
    width:22px;
    border:0px;
    height:22px;
    padding:0px;
    display:block;
    outline:none;
    position:absolute;
    border-radius:100%;
    top:4px;
    cursor:pointer;
  }
  :host > div > button:nth-of-type(1){ left:4px; }
  :host > div > button:nth-of-type(2){ right:4px; }
  :host > div > input{
    height:100%;
    border:0px;
    box-sizing:border-box;
    padding:0px 28px;
    outline:none;
    display:block;
    text-align:center;
    width:100%;
    border-radius:13px;
  }
  </style>

  <div>
    <button>-</button>
    <input type="text" readonly>
    <button>+</button>
  <div>
`
class counter extends HTMLElement{
  constructor(){
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(counterTemplate.content.cloneNode(true))
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
    let addButton = this.shadow.querySelector(":host>div>button:nth-of-type(2)")
    let subtractButton = this.shadow.querySelector(":host>div>button:nth-of-type(1)")
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

customElements.define("rode-counter",counter)