const potentiometerTemplate = document.createElement("template")
potentiometerTemplate.innerHTML = 
`
<style>
:host{
  display:inline-block;
}
:host > div{
  height: 220px;
  width: 220px;
  background-color: rgba(174,174,178,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border-radius: 100%;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
}
:host > div > div:nth-of-type(1){
  background-color: rgba(255, 255, 255, 1);
  border-radius: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
}
:host > div > div:nth-of-type(1)::after{
  content: "";
  display: block;
  background-color: rgba(255,255,255,1);
  width: 10px;
  height: 10px;
  position: absolute;
  top: -3px;
  transform: rotateZ(45deg);
  border-radius: 2px;
}
:host > div > div:nth-of-type(1)::before{
  content: "";
  display: block;
  height: 16px;
  width: 4px;
  background-color: white;
  position: absolute;
  top: -28px;
  border-radius: 4px;
  box-shadow:0px 0px 2px 0px rgba(0,0,0,0.1);
}
:host > div > svg{
  height:210px;
  width:210px;
  transform: rotateZ(-240deg);
  border-radius: 100%;
  position: absolute;
}
:host > div > svg > circle{
  stroke-width: 20;
  stroke: rgba(255,255,255,0.5);
  stroke-linecap: round;
  fill:transparent;
}
:host > div > div:nth-of-type(3){
  position: absolute;
  background-color: rgba(0,0,0,0);
  border-radius: 100%;
}
:host > div > div:nth-of-type(2){
  position: absolute;
  border-radius: 100%;
}
</style>
<style>
  :host > div {}
  :host > div > div:nth-of-type(1){}
  :host > div > svg {}
  :host > div > svg > circle{}
  :host > div > div:nth-of-type(3){}
  :host > div > div:nth-of-type(2){}
</style>
<div><svg><circle></circle></svg><div></div><div></div><div></div></div>
`
class potentiometer extends HTMLElement{
  constructor(){
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(potentiometerTemplate.content.cloneNode(true))
  }

  get width(){
    return Number(this.getAttribute("width"))
  }

  get hasWidth(){
    return this.hasAttribute("width")
  }

  set width(width){
    this.setAttribute("width",width)
  }

  get percent(){
    return this.getAttribute("percent")
  }

  get hasPercent(){
    return this.hasAttribute("percent")
  }

  set percent(percent){
    this.setAttribute("percent",percent)
  }

  #widthCheck = (width) => {
    return Math.min(Math.max(width,100),500)
  }

  #getRules = () =>{
    let sheets = this.shadow.styleSheets[1]
    let rules = sheets.cssRules || sheets.rules
    return rules
  }

  #shapeCalculator = () => {
    this.#getRules()[0].style.width = `${this.width}px`
    this.#getRules()[0].style.height = `${this.width}px`

    this.#getRules()[1].style.width = `${this.width-70}px`
    this.#getRules()[1].style.height = `${this.width-70}px`

    this.#getRules()[2].style.width = `${this.width-10}px`
    this.#getRules()[2].style.height = `${this.width-10}px`

    var circle = this.shadow.querySelector(":host>div>svg>circle")
    circle.setAttribute("cy",(this.width-10)/2)
    circle.setAttribute("cx",(this.width-10)/2)
    circle.setAttribute("r",(this.width-10)/2-10)

    let circumference = 2*((this.width-10)/2-10)*Math.PI
    this.#getRules()[3].style.strokeDasharray = `${circumference}`
    this.#getRules()[3].style.strokeDashoffset = `${circumference-circumference*300/360}`
  
    this.#getRules()[4].style.width = `${this.width}px`
    this.#getRules()[4].style.height = `${this.width}px`

    this.#getRules()[5].style.width = `${this.width/2-30}px`
    this.#getRules()[5].style.height = `${this.width/2-30}px`
    this.#getRules()[5].style.boxShadow = `0px 0px ${Math.round(this.width/10)}px -${Math.round(this.width/20)}px rgba(0,0,0,0.5)`
  }

  static get observedAttributes(){
    return ["percent"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch (attr) {
      case "percent":
        if(this.isConnected) this.#percentToAngle()
      break;
    }
  }

  #angleToPercent = (angle) =>{
    return (0+(100-0)*(angle-0)/(300-0)).toFixed(2)
  }

  #percentToAngle = () => {
    this.#getRules()[1].style.transform = `rotateZ(${(0+(300-0)*(this.percent-0)/(100-0))-150}deg)`
  }

  #getPos = (e) =>{
    var centerX = e.target.offsetWidth / 2 
    var centerY = e.target.offsetHeight / 2
    var clickY = e.offsetY-centerY
    var clickX = e.offsetX-centerX
    var slope = (e.offsetY-centerY)/(e.offsetX-centerX)
    var degree = Math.atan(slope)*180/Math.PI
    let angle = 0
    if ((clickX>0 && clickY>0)||clickX>0 && clickY<0) angle = 90 + degree
    else if ((clickX<0 && clickY>0)||(clickX<0 && clickY<0)) angle = -90 + degree
    else if (clickY == 0 && clickX<0) angle = -90
    else if (clickY == 0 && clickX>0) angle = 90
    else if (clickX ==0 && clickY<0) angle = 0
    else if (clickX ==0 && clickY>0) angle = 150

    if(angle+150<0) angle = -150
    if(angle+150>300) angle = 150

    this.percent = this.#angleToPercent(angle+150)
  }

  connectedCallback(){
    this.width = this.#widthCheck(this.width)
    if(!this.percent) this.percent = (0).toFixed(2)
    else this.#percentToAngle()
    this.#shapeCalculator()
    let area = this.shadow.querySelector(":host>div>div:nth-of-type(3)")
    let mousedown = false
    area.addEventListener("mousemove",(event)=>mousedown && this.#getPos(event))
    area.addEventListener("mousedown",()=>mousedown=true)
    area.addEventListener("mousedown",(event)=>this.#getPos(event))
    area.addEventListener("mouseup",()=>mousedown=false)
    area.addEventListener("mouseout",()=>mousedown=false)
    
  }
}

potentiometer.prototype.darkswitcher = true

customElements.define("ro-potentiometer",potentiometer)