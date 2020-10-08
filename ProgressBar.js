const progressBarTemplate = document.createElement("template")
progressBarTemplate.innerHTML =
  `
  <style>
  :host {
    display:block;
    height:15px;
  }
  :host > div{
    width:100%;
    height:100%;
    box-sizing: border-box;
    border-radius: 15px;
    overflow: hidden;
    backdrop-filter: blur(10px);
  }
  :host > div::after{
    content: "";
    height: 100%;
    display: block;
    transition: width .2s linear;
  }
  :host([darkmode=false]) > div{
    background-color: rgba(174,174,178,0.5) !important;
  }
  :host([darkmode=false]) > div::after{
    background-color:rgba(0,122,255,0.9) !important;
  }
  :host([darkmode=true]) > div{
    background-color: rgba(99,99,102,0.5) !important;
  }
  :host([darkmode=true]) > div::after{
    background-color:rgba(10,132,255,0.9) !important;
  }
  </style>
  <style> :host > div::after{ width:0% } </style>

  <div></div>
  `
class progressBar extends HTMLElement{
  constructor(){
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(progressBarTemplate.content.cloneNode(true))
  }

  get darkmode(){
    return this.getAttribute("darkmode")
  }

  set darkmode(bool){
    this.setAttribute("darkmode",bool)
  }

  get value(){
    return Number(this.getAttribute("value"))
  }

  set value(value){
    this.setAttribute("value",this.valueCheck(value))
  }

  static get observedAttributes(){
    return ["value","name"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch(attr){
      case 'value':
        if(this.isConnected) this.onValueChange()
      break;
    }
  }

  onValueChange = () => {
    let sheets = this.shadow.styleSheets[1]
    let rules = sheets.cssRules || sheets.rules
    rules[0].style.width = `${this.value}%` 
  }

  valueCheck = (value) => {
    if(!Number.isInteger(value)) return 0
    else if(value > 100) return 100
    else if(value < 0) return 0
    else return value
  }

  connectedCallback(){
    if(!this.darkmode) this.darkmode = false
    if(!this.value) this.value = 0
    this.onValueChange()
  }
}

customElements.define("rode-progressbar",progressBar)