const circleProgressTemplate = document.createElement("template")
circleProgressTemplate.innerHTML = 
  `
  <style>
  :host > div{
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(10px);
    transform: rotate(-90deg);
    transition: background-color 0.2s linear;
  }
  :host > div > svg{
    position: relative;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
  }
  :host > div > svg > circle{
    fill: none;
    stroke-width: 10;
    stroke-linecap: round;
    transition: stroke-dashoffset .5s linear,
                stroke 0.2s linear;
  }
  :host > div > svg > circle:nth-of-type(1){
    stroke-dashoffset: 0;
  }
  :host([darkmode=false]) > div{
    background-color: rgba(174,174,178,0.5) !important;
  }
  :host([darkmode=true]) > div{
    background-color: rgba(99,99,102,0.5) !important;
  }
  :host([darkmode=false]) > div > svg > circle:nth-of-type(1) {
    stroke: rgba(0,0,0,0.07);
  }
  :host([darkmode=true]) > div > svg > circle:nth-of-type(1) {
    stroke: rgba(255,255,255,0.1);
  }
  :host([darkmode=false]) > div > svg > circle:nth-of-type(2) {
    stroke: rgb(52,199,89);
  }
  :host([darkmode=true]) > div > svg > circle:nth-of-type(2) {
    stroke: rgb(48,209,88);
  }
  </style>

  <style> :host > div { width:100px ; height:100px } </style>

  <style> :host > div > svg > circle:nth-of-type(2) { stroke-dasharray: 282.7433388230814; }  </style>

  <style> :host > div > svg > circle:nth-of-type(2) { stroke-dashoffset: 282.7433388230814; }  </style>

  <div><svg><circle></circle><circle></circle></svg></div>
  `
class circleProgress extends HTMLElement{
  constructor() {
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(circleProgressTemplate.content.cloneNode(true))
  }

  get width(){
    return this.getAttribute("width")
  }

  set width(width){
    this.setAttribute("width",width)
  }

  get darkmode(){
    return this.getAttribute("darkmode")
  }

  set darkmode(bool){
    this.setAttribute("darkmode",bool)
  }

  get percent(){
    return this.getAttribute("percent")
  }

  set percent(percent){
    this.setAttribute("percent", this.percentCheck(percent))
  }

  static get observedAttributes(){
    return ["percent"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch (attr) {
      case "percent":
        if(this.isConnected) this.setPercentage(newValue)
      break;
    }
  }

  circleDraw = () =>{
    let sheets = this.shadow.styleSheets[1]
    let rules = sheets.cssRules || sheets.rules
    rules[0].style.width = `${this.width ? this.width : 100}px`
    rules[0].style.height =  `${this.width ? this.width : 100}px`
    let circleOne = this.shadow.querySelector(":host>div>svg>circle:nth-of-type(1)")
    let circleTwo = this.shadow.querySelector(":host>div>svg>circle:nth-of-type(2)")
    circleOne.setAttribute("cx",this.width ? (this.width-10) /2 : 45)
    circleOne.setAttribute("cy",this.width ? (this.width-10) /2 : 45)
    circleOne.setAttribute("r",this.width ? (this.width-10) /2 - 5 : 40)
    circleTwo.setAttribute("cx",this.width ? (this.width-10) /2 : 45)
    circleTwo.setAttribute("cy",this.width ? (this.width-10) /2 : 45)
    circleTwo.setAttribute("r",this.width ? (this.width-10) /2 - 5 : 40)
  }

  getCircumference = () =>{
    let circle = this.shadow.querySelector(":host>div>svg>circle:nth-of-type(2)")
    let radius = circle.r.baseVal.value
    let circumference = radius * 2 * Math.PI
    return circumference
  }

  setStrokedasharray = () => {
    let sheets = this.shadow.styleSheets[2]
    let rules = sheets.cssRules || sheets.rules
    rules[0].style.strokeDasharray = this.getCircumference()
  }

  setPercentage(percent){
    let sheets = this.shadow.styleSheets[3]
    let rules = sheets.cssRules || sheets.rules
    rules[0].style.strokeDashoffset = this.getCircumference() - (percent / 100) * this.getCircumference()
  }

  percentCheck = (percent) => {
    return Math.min(Math.max(percent,0),100)
  }

  connectedCallback(){
    if(!this.percent) this.percent=0
    else this.percent = this.percentCheck(this.percent)
    this.circleDraw()
    this.setStrokedasharray()
    this.setPercentage(this.percent)
    if(!this.darkmode) this.darkmode = false
  }
}

customElements.define("rode-circleprogress",circleProgress)