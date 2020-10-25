const switchButtonTemplate = document.createElement("template")
switchButtonTemplate.innerHTML = 
  `
  <style>
  :host{
    width:38px;
    height:24px;
    display:block;
  }
  :host > div{
    height: 24px;
    width: 38px;
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
    this.selector = this.attachShadow({mode:"closed"})
    this.selector.appendChild(switchButtonTemplate.content.cloneNode(true))
  }

  get value(){
    return this.getAttribute("value")
  }
  
  get hasValue(){
    return this.hasAttribute("value")
  }

  set value(bool){
    this.setAttribute("value",bool)
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

  get darkmode(){
    return this.getAttribute("darkmode")
  }

  get hasDarkMode(){
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
    return this.getAttribute("ontrue")
  }

  get hasOntrue(){
    return this.hasAttribute("ontrue")
  }

  set ontrue(event){
    this.setAttribute("ontrue",event)
  }

  get onfalse(){
    return this.getAttribute("onfalse")
  }

  get hasOnFalse(){
    return this.hasAttribute("onfalse")
  }

  set onfalse(event){
    this.setAttribute("onfalse",event)
  }

  static get observedAttributes(){
    return ["value","name","darkmode","disabled","ontrue","onfalse"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch(attr){
      case 'value':
        if(this.isConnected && this.hasName) this.querySelector("input").value = this.value
        if(this.isConnected && this.hasOntrue && newValue == "true") try{eval(this.ontrue)}catch{console.log("%c onTrue : Function Error","color:rgb(255,59,48);font-weight:bold")}
        if(this.isConnected && this.hasOnFalse && newValue == "false") try{eval(this.onfalse)}catch{console.log("%c onFalse : Function Error","color:rgb(255,59,48);font-weight:bold")}
      break
      case 'name':
        if(this.isConnected && this.hasName) this.querySelector("input").name = this.name
      break
    }
  }

  #onClick = () => {
    if(this.value == "true") this.value = "false"
    else if(this.value == "false") this.value = "true"
  }
  
  connectedCallback(){   
    if(this.hasName) this.innerHTML = `<input type="hidden" name=${this.name} value=${this.value} />`
    if(!this.hasValue) this.value = false
    if(!this.hasDarkMode) this.darkmode = false
    this.selector.querySelector(":host>div").addEventListener("click",this.#onClick.bind(this))
  }
}
customElements.define("rode-switchbutton",switchButton)