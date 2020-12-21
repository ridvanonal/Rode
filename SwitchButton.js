const switchButtonTemplate = document.createElement("template")
switchButtonTemplate.innerHTML = 
  `
  <style>
  :host{
    display:block;
    width:38px; 
    height:24px;
  }
  :host > div{
    height: 100%;
    width: 100%;
    border-radius: 14px;
    padding: 2px;
    box-sizing: border-box;
    -webkit-transition: background-color .2s linear;
    -ms-transition: background-color .2s linear;
    transition: background-color .2s linear;
    cursor: pointer;
    -webkit-touch-callout: none; 
    -webkit-user-select: none;
    -khtml-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  :host > div::after{
    content:"";
    display:block;
    height: 20px;
    width: 20px;
    background-color: rgba(255,255,255,1) ;
    border-radius: 100%;
    box-shadow: 0px 1px 3px rgba(0,0,0,0.15);
    -webkit-transition: margin-left .2s cubic-bezier(0.175,0.885,0.32,1.275),
                        opacity .2s linear;
    -ms-transition: margin-left .2s cubic-bezier(0.175,0.885,0.32,1.275),
                    opacity .2s linear;
    transition: margin-left .2s cubic-bezier(0.175,0.885,0.32,1.275),
                opacity .2s linear;
  }
  :host([darkmode=true]) > div{
    background-color: rgba(99,99,102,0.5) !important;
  }  
  :host([darkmode=false]) > div{
    background-color: rgba(174,174,178,0.5) !important;
  }
  :host([darkmode=true][value=true]) > div{
    background-color: rgba(48,209,88,1) !important;
  } 
  :host([darkmode=false][value=true]) > div{
    background-color: rgba(59,199,89,1) !important;
  }  
  :host([value=true]) > div::after{
    margin-left: 14px !important;
  } 
  :host([disabled]) > div{
    pointer-events: none !important;
  }
  :host([darkmode=true][value=true][disabled]) > div{
    background-color: rgba(48,209,88,0.75) !important;
  } 
  :host([darkmode=false][value=true][disabled]) > div{
    background-color: rgba(59,199,89,0.75) !important;
  }  
  :host([disabled]) > div::after{
    opacity:0.5 !important;
  }
  </style>
  <div></div>
  `
class switchButton extends HTMLElement{
  constructor(){
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(switchButtonTemplate.content.cloneNode(true))
  }

  get value(){
    switch(this.getAttribute("value").toLowerCase().trim()){
      case "true": return true;
      case "false": case null: return false;
      default: return false;
    }
  }
  
  get hasValue(){
    return this.hasAttribute("value")
  }

  set value(bool){
    this.setAttribute("value",bool)
  }

  get darkmode(){
    return this.getAttribute("darkmode")
  }

  get hasDarkmode(){
    return this.hasAttribute("dakmode")
  }

  set darkmode(bool){
    this.setAttribute("darkmode",bool)
  }

  get disabled(){
    return this.hasAttribute("disabled")
  }

  set disabled(bool){
    if(bool) this.setAttribute("disabled","")
    else this.removeAttribute("disabled")
  }

  get ontrue(){
    return this._ontrue
  }

  set ontrue(event){
    this._ontrue = event
  }

  get onfalse(){
    return this._onfalse
  }

  set onfalse(event){
    this._onfalse = event
  }

  get onchange(){
    return this._onchange
  }

  set onchange(event){
    this._onchange = event
  }

  static get observedAttributes(){
    return ["value","disabled","ontrue","onfalse"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch(attr){
      case 'value':
        if(this.isConnected && this.ontrue && newValue == "true") this.ontrue()
        if(this.isConnected && this.onfalse && newValue == "false") this.onfalse()
        if(this.isConnected && this.onchange) this.onchange()
      break
    }
  }

  onClick = () => {
    this.value = !this.value
  }
  
  connectedCallback(){ 
    if(!this.hasValue) this.value = false
    if(!this.hasDarkmode) this.darkmode = false
    this.shadow.querySelector(":host>div").addEventListener("click",this.onClick.bind(this))
  }
}

switchButton.prototype.darkswitcher = true

customElements.define("ro-switchbutton",switchButton)