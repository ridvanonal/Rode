const switchButtonTemplate = document.createElement("template")
switchButtonTemplate.innerHTML = 
  `
  <style>
  :host{
    width:38px;
    height:24px;
    display:block;
  }
  :host div{
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
  :host div > div{
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
  :host([value=true]) > div > div{
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
  :host([disabled]) > div > div{
    opacity:0.5 !important;
  }
  </style>
  
  <div><div></div></div>
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

  set value(bool){
    this.setAttribute("value",bool)
  }

  get name(){
    return this.getAttribute("name")
  }

  set name(name){
    this.setAttribute("name",name)
  }

  get darkMode(){
    return this.getAttribute("darkMode")
  }

  set darkMode(bool){
    this.setAttribute("darkMode",bool)
  }

  get disabled(){
    return this.hasAttribute("disabled")
  }

  set disabled(bool){
    if(bool) this.setAttribute("disabled","")
    else this.removeAttribute("disabled")
  }

  get onTrue(){
    return this.getAttribute("onTrue")
  }

  set onTrue(event){
    this.setAttribute("onTrue",event)
  }

  get onFalse(){
    return this.getAttribute("onFalse")
  }

  set onFalse(event){
    this.setAttribute("onFalse",event)
  }

  static get observedAttributes(){
    return ["value","name","darkMode","disabled","onTrue","onFalse"]
  }

  attributeChangedCallback(attr,oldValue,newValue){
    switch(attr){
      case 'value':
        if(this.isConnected && this.name) this.querySelector("input").value = this.value
        if(this.isConnected && this.onTrue && newValue == "true") eval(this.onTrue)
        if(this.isConnected && this.onFalse && newValue == "false") eval(this.onFalse)
      break;
      case 'name':
        if(this.isConnected && this.name) this.querySelector("input").name = this.name
      break;
    }
  };

  onClick = () => {
    if(this.value == "true") this.value = "false"
    else if(this.value == "false") this.value = "true"
    if(this.name) this.querySelector("input").value = this.value
  }

  connectedCallback(){    
    if(!this.value) this.value = false
    if(!this.darkMode) this.darkMode = false
    if(this.name) this.innerHTML = `<input type="hidden" name=${this.name} value=${this.value} />`
    this.selector.querySelector(":host>div").addEventListener("click",this.onClick.bind(this))
  }
}
customElements.define("rode-switchbutton",switchButton)