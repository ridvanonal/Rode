const counterTemplate = document.createElement("template")
counterTemplate.innerHTML = 
  `
  <style>
  :host{
    display:inline-block;
  }
  :host > div:nth-of-type(1){
    height: 30px;
    width: 16px;
    border-radius: 16px;
    backdrop-filter: blur(10px); 
    -webkit-backdrop-filter:blur(10px);
    transition:background-color .2s linear;
    cursor: pointer;
    -webkit-touch-callout: none; 
    -webkit-user-select: none;
    -khtml-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
  }
  :host([darkmode=false]) > div:nth-of-type(1){
    background-color: rgba(174,174,178,0.5);
  }
  :host([darkmode=true]) > div:nth-of-type(1){
    background-color: rgba(99,99,102,0.5);
  }
  :host > div:nth-of-type(1) > div{
    height: 15px;
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:background-color .2s linear;
  }
  :host([darkmode=false]) > div:nth-of-type(1) > div:hover{
    background-color: rgb(0,122,255);
  }
  :host([darkmode=true]) > div:nth-of-type(1) > div:hover{
    background-color: rgb(10,132,255);
  }
  :host > div:nth-of-type(1) > div:nth-of-type(1){
    border-radius: 16px 16px 0px 0px;
  }
  :host > div:nth-of-type(1) > div:nth-of-type(2){
    border-radius: 0px 0px 16px 16px;
  }
  :host > div:nth-of-type(1) > div > svg {
    height: 5px;
    width: 10px;
  }
  :host > div:nth-of-type(1) > div > svg line {
    stroke-width: 2;
    stroke-linecap: round;
    transition:stroke .2s linear;
  }
  :host([darkmode=false]) > div:nth-of-type(1) > div > svg line {
    stroke: rgba(65,65,65,1);
  }
  :host([darkmode=true]) > div:nth-of-type(1) > div > svg line {
    stroke: rgba(0,0,0,1);
  }
  :host > div:nth-of-type(1) > div:hover > svg line{
    stroke: rgba(255,255,255,1);
  }
  </style>

  <div>  
      <div>
        <svg>
          <line x1="20%" y1="80%" x2="50%" y2="20%"></line>
          <line x1="80%" y1="80%" x2="50%" y2="20%"></line>
        </svg>
      </div>
      <div>
        <svg>
          <line x1="20%" y1="20%" x2="50%" y2="80%"></line>
          <line x1="80%" y1="20%" x2="50%" y2="80%"></line>
        </svg>
      </div>
    </div> 
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

  get hasValue(){
    return this.hasAttribute("value")
  }

  set value(value){
    this.setAttribute("value",value)
  }

  get step(){
    return Number(this.getAttribute("step"))
  }

  get hasStep(){
    return this.hasAttribute("step")
  }

  set step(step){
    this.setAttribute("step",step)
  }

  get min(){
    return Number(this.getAttribute("min"))
  }

  get hasMin(){
    return this.hasAttribute("min")
  }

  set min(min){
    this.setAttribute("min",min)
  }

  get max(){
    return Number(this.getAttribute("max"))
  }

  get hasMax(){
    return this.hasAttribute("max")
  }

  set max(max){
    this.setAttribute("max",max)
  }

  get darkmode(){
    return this.getAttribute("darkmode")
  }

  get hasDarkmode(){
    return this.hasAttribute("darkmode")
  }

  set darkmode(bool){
    this.setAttribute("darkmode",bool)
  }

  get onchange(){
    return this.getAttribute("onchange")
  }

  get hasOnchange(){
    return this.hasAttribute("onchange")
  }

  set onchange(event){
    this.setAttribute("onchange",event)
  }

  get onvalue(){
    return this.getAttribute("onvalue")
  }

  get hasOnvalue(){
    return this.hasAttribute("onvalue")
  }

  set onvalue(event){
    this.setAttribute("onvalue",event)
  }

  static get observedAttributes(){
    return ["value"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch (attr) {
      case "value":
        if(this.isConnected && this.hasOnchange) try{eval(this.onchange.replace(`()`,`(${this.value})`))}catch{}
        if(this.isConnected && this.hasOnvalue && Number(this.onvalue.split(",")[0]) == this.value) try{eval(this.onvalue.split(",")[1])}catch{}
      break;
    }
  }

  add = () =>{
    if(this.hasMax)
    if(this.value < this.max ) this.value += this.step
    if(!this.hasMax) this.value += this.step
  }

  subtract = () =>{
    if(this.hasMin)
    if(this.value > this.min) this.value -= this.step
    if(!this.hasMin) this.value -= this.step
  }

  maxCalculator = () =>{
    this.max = this.min + (this.step*(Math.floor((this.max - this.min) / this.step)))
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
    if(!this.hasStep) this.step = 1
    if(this.hasMax) this.maxCalculator()
    if(!this.hasValue) this.value = this.min ? this.min : 0
    if(!this.hasDarkmode) this.darkmode = false
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

counter.prototype.darkswitcher = true

customElements.define("ro-counter",counter)
