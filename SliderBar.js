const sliderBarTemplate = document.createElement("template")
sliderBarTemplate.innerHTML = 
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
    border: 2px solid transparent;
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
    background-color:rgba(255,255,255,0.9) !important;
  }
  :host([darkmode=true]) > div{
    background-color: rgba(99,99,102,0.5) !important;
  }
  :host([darkmode=true]) > div::after{
    background-color:rgba(28,28,30,0.9) !important;
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
class sliderBar extends HTMLElement{
  constructor(){
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(sliderBarTemplate.content.cloneNode(true))
  }

  get name(){
    return this.getAttribute("name")
  }

  get hasName(){
    return this.hasAttribute("name")
  }

  set name(name){
    this.setAttribute("name",name)
  }

  get min(){
    return Number(this.getAttribute("min"))
  }

  get hasMin(){
    return this.hasAttribute("min")
  }

  set min(minValue){
    this.setAttribute("min",minValue)
  }

  get max(){
    return Number(this.getAttribute("max"))
  }

  get hasMax(){
    return this.hasAttribute("max")
  }

  set max(maxValue){
    this.setAttribute("max",maxValue)
  }

  get step(){
    return Number(this.getAttribute("step"))
  }

  get hasStep(){
    return this.hasAttribute("step")
  }

  set step(stepValue){
    this.setAttribute("step",this.stepCheck(stepValue))
  }

  get value(){
    return Number(this.getAttribute("value"))
  }

  get hasValue(){
    return this.hasAttribute("value")
  }

  set value(value){
    if(this.async) this.setAttribute("value",this.asyncValueCheck(value))
    else this.setAttribute("value",this.syncValueCheck(value))
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
        if(this.isConnected && this.hasName) this.querySelector("input").value = this.value
        if(this.isConnected && this.hasOnchange) eval(this.onchange.replace(`()`,`(${this.value})`))
        if(this.isConnected && this.hasOnvalue && Number(this.onvalue.split(",")[0]) == this.value) eval(this.onvalue.split(",")[1])
      break;
      case 'name':
        if(this.isConnected && this.hasName) this.querySelector("input").name = this.name
      break;
    }
  }

  onClick = (event) =>{
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

  asyncMaxCalculator = () =>{
    this.max = this.min + (this.step*this.shred())
  }

  valueToWidth = () =>{
    return this.step*((0+(100-0)*(this.value-this.min)/(this.max-this.min))/this.step)
  }
  
  onValueChange = () =>{
      let sheets = this.shadow.styleSheets[1]
      let rules = sheets.cssRules || sheets.rules
      rules[0].style.width = `${this.valueToWidth()}%` 
  }

  syncValueCheck = (value) =>{
    if(value <= this.max && value >= this.min && value % this.step==0) return value
    else return this.min 
  }

  asyncValueCheck = (value) =>{
    if(value <= this.max && value >= this.min && (value-this.min) % this.step == 0) return value
    else return this.min
  }

  stepCheck = (step) =>{
    if(step <= 0) return 1
    else return step
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
    if(!this.hasDarkmode) this.darkmode = false   
    if(!this.hasMin) this.min=0
    if(!this.hasMax) this.max=100
    if(!this.hasStep) this.step=1
    if(this.hasStep) this.step = this.stepCheck(this.step)
    if(!this.async) this.syncMinCalculator()
    if(!this.async) this.syncMaxCalculator()
    else this.asyncMaxCalculator()
    if(this.hasName) this.innerHTML = `<input type="hidden" name=${this.name} value=${this.value} />`
    if(!this.hasValue) this.value=this.min
    else if(this.hasValue && !this.async) this.value=this.syncValueCheck(this.value)
    else if(this.hasValue && this.async) this.value=this.asyncValueCheck(this.value)
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

sliderBar.prototype.darkswitcher = true

customElements.define("ro-sliderbar",sliderBar)