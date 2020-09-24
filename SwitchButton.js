const SwitchButtonTemplate = document.createElement("template")
SwitchButtonTemplate.innerHTML = 
  `
  <style>
  :host{
    width:38px;
    height:24px;
    display:block;
  }
  :host div{
    height: 24px !important;
    width: 38px !important;
    border-radius: 15px !important;
    backdrop-filter:blur(10px);
    padding: 2px !important;
    box-sizing: border-box !important;
    -webkit-transition: background-color .2s linear !important;
    -ms-transition: background-color .2s linear !important;
    transition: background-color .2s linear !important;
    cursor: pointer !important;
    -webkit-touch-callout: none !important; 
    -webkit-user-select: none !important;
    -khtml-user-select: none !important; 
    -moz-user-select: none !important; 
    -ms-user-select: none !important; 
    user-select: none !important;
    }
  :host div > div{
    height: 20px !important;
    width: 20px !important;
    background-color: rgba(255,255,255,1) !important;
    border-radius: 100% !important;
    box-shadow: 0px 1px 3px rgba(0,0,0,0.15) !important;
    -webkit-transition: margin-left .2s cubic-bezier(0.175,0.885,0.32,1.275) !important;
    -ms-transition: margin-left .2s cubic-bezier(0.175,0.885,0.32,1.275) !important;
    transition: margin-left .2s cubic-bezier(0.175,0.885,0.32,1.275) !important;
  }
  :host([darkmode=true]) > div{
    background-color: rgba(72,72,74,0.5) !important;
  }  
  :host([darkmode=false]) > div{
    background-color: rgba(174,174,178,0.25) !important;
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
class SwitchButton extends HTMLElement{
  constructor(){
    super();
    this.selector = this.attachShadow({mode:"open"})
    this.selector.appendChild(SwitchButtonTemplate.content.cloneNode(true))
    this.isLoad = false
  }

  get value(){
    return this.getAttribute("value")
  }

  set value(Bool){
    this.setAttribute("value",Bool)
  }

  get name(){
    return this.getAttribute("name")
  }

  set name(Name){
    this.setAttribute("name",Name)
  }

  get darkmode(){
    return this.getAttribute("darkmode")
  }

  set darkmode(Bool){
    return this.setAttribute("darkmode",Bool)
  }

  get disabled(){
    return this.hasAttribute("disabled")
  }

  set disabled(Bool){
    if(Bool) this.setAttribute("disabled","")
    else this.removeAttribute("disabled")
  }

  static get observedAttributes(){
    return ["value","name","darkmode","disabled"]
  }

  attributeChangedCallback(Attr,oldValue,newValue){
    switch(Attr){
      case 'value':
        if(this.name && this.isLoad) this.querySelector("input").value = this.value
      break;
      case 'name':
        if(this.name && this.isLoad) this.querySelector("input").name = this.name
      break;
    }
  };

  Click(){
    if (this.value == "true") this.value = "false"
    else if (this.value == "false") this.value = "true"
    if(this.name) this.querySelector("input").value = this.value
  }

  connectedCallback(){    
    if (!this.value) this.value = false;
    if (!this.darkmode) this.darkmode = false;
    if (this.name) this.innerHTML = `<input type="hidden" name=${this.name} value=${this.value} />`
    this.selector.querySelector(":host>div").addEventListener("click",this.Click.bind(this))
    this.isLoad = true;
  }
}
customElements.define("rode-switchbutton",SwitchButton)

