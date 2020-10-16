const counterTemplate = document.createElement("template")
counterTemplate.innerHTML = 
`
<input type="text">
<button>+</button>
<button>-</button>
`
class counter extends HTMLElement{
  constructor(){
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(counterTemplate.content.cloneNode(true))
    this.countStep = 0
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
    return Number(this.getAttribute("min"))
  }

  set min(min){
    this.setAttribute("min",min)
  }

  get max(){
    return Number(this.getAttribute("max"))
  }

  set max(max){
    this.setAttribute("max",max)
  }

  add = () =>{
    if(this.max)
    if(this.value < this.max ) this.countStep ++
    if(!this.max) this.countStep++
    this.value = this.min + this.countStep * this.step 
  }

  subtract = () =>{
    if(this.min)
    if(this.value > this.min) this.countStep --
    if(!this.min) this.countStep --
    this.value = this.min + this.countStep * this.step 
  }

  maxCalculator = () =>{
    this.max = this.min + (this.step*(Math.floor((this.max - this.min) / this.step)))
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

  connectedCallback(){
    if(this.max) this.maxCalculator()
    if(!this.step) this.step = 1
    if(!this.value) this.value =  this.min + this.countStep * this.step
    let addButton = this.shadow.querySelector(":host>button:nth-of-type(1)")
    let subtractButton = this.shadow.querySelector(":host>button:nth-of-type(2)")
    let input = this.shadow.querySelector(":host>input")
    addButton.addEventListener("click",this.add)
    subtractButton.addEventListener("click",this.subtract)
    input.addEventListener("keydown",this.onKeyPress.bind(this))
  }

}

customElements.define("rode-counter",counter)