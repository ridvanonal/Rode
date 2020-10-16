const counterTemplate = document.createElement("template")
counterTemplate.innerHTML = 
`
<button>-</button>
<input type="text">
<button>+</button>
`
class counter extends HTMLElement{
  constructor(){
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(counterTemplate.content.cloneNode(true))
    this.countStep = 0
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
    if(this.value < this.max ) this.countStep ++
    if(!this.max) this.countStep++
    this.valueCalculator()
  }

  subtract = () =>{
    if(this.min)
    if(this.value > this.min) this.countStep --
    if(!this.min) this.countStep --
    this.valueCalculator()
  }

  valueCalculator = () =>{
    this.value = Number(this.min) + this.countStep * this.step 
  }

  maxCalculator = () =>{
    this.max = Number(this.min) + (this.step*(Math.floor((this.max - Number(this.min)) / this.step)))
  }

  valueChange = () =>{
    this.shadow.querySelector(":host>input").value = this.value
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
    if(!this.value) this.valueCalculator()
    let addButton = this.shadow.querySelector(":host>button:nth-of-type(2)")
    let subtractButton = this.shadow.querySelector(":host>button:nth-of-type(1)")
    let input = this.shadow.querySelector(":host>input")
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