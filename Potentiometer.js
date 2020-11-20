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
  height: 150px;
  width: 150px;
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
}
:host > div > svg{
  height:210px;
  width:210px;
  transform: rotateZ(-240deg);
  border-radius: 100%;
  position: absolute;
}
:host > div > svg > circle{
  stroke-dasharray: 597;
  stroke-width: 20;
  stroke: rgba(255,255,255,0.5);
  stroke-dashoffset: 99.5;
  stroke-linecap: round;
  fill:transparent;
}
:host > div > div:nth-of-type(3){
  height: 210px;
  width: 210px;
  position: absolute;
  background-color: rgba(0,0,0,0);
  border-radius: 100%;
}
:host > div > div:nth-of-type(2){
  position: absolute;
  height: 90px;
  width: 90px;
  border-radius: 100%;
  box-shadow: 0px 0px 40px -10px rgba(174,174,178,0.5);
}
</style>
<style>
  :host > div > svg {}
</style>
<div><svg><circle></circle></svg><div></div><div></div><div></div></div>
`
class potentiometer extends HTMLElement{
  constructor(){
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(potentiometerTemplate.content.cloneNode(true))
  }

  #getRules = () =>{
    let sheets = this.shadow.styleSheets[1]
    let rules = sheets.cssRules || sheets.rules
    return rules
  }

  #setSvg(){
    var circle = this.shadow.querySelector(":host>div>svg>circle")
    circle.setAttribute("cy",105)
    circle.setAttribute("cx",105)
    circle.setAttribute("r",95)
  }

  #getPos = (e) => {
  let potan = this.shadow.querySelector(":host>div>div:nth-of-type(1)")
  var centerX = e.target.offsetWidth / 2 
  var centerY = e.target.offsetHeight / 2
  var clickY = e.offsetY-centerY
  var clickX = e.offsetX-centerX
  var slope = (e.offsetY-centerY)/(e.offsetX-centerX)
  var degree = Math.atan(slope)*180/Math.PI
  var angle = 0
  if ((clickX>0 && clickY>0)||clickX>0 && clickY<0){angle = 90 + degree}
  else if ((clickX<0 && clickY>0)||(clickX<0 && clickY<0)){angle = -90 + degree}
  else if (clickY == 0 && clickX<0) {angle = -90}
  else if (clickY == 0 && clickX>0) {angle = 90}
  else if (clickX ==0 && clickY<0) angle = 0
  else if (clickX ==0 && clickY>0) angle = 150

  if(angle+150<0) { angle = -150}
  if(angle+150>300) { angle = 150}

  potan.style.transform = `rotateZ(${angle}deg)`
  }

  connectedCallback(){
    this.#setSvg()
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