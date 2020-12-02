var darkColor = [
  "10,132,255",
  "48,209,88",
  "94,92,230",
  "255,159,10",
  "255,55,95",
  "191,90,242",
  "255,69,58",
  "100,210,255",
  "255,214,10"
]
var lightColor = [
  "0,122,255",
  "52,199,89",
  "88,86,214",
  "255,149,0",
  "255,45,85",
  "175,82,222",
  "255,59,48",
  "90,200,250",
  "255,204,0"
]

const storageTemplate = document.createElement("template")
storageTemplate.innerHTML = 
`
<style>
:host{
  display:block;
  font-family:Arial, Helvetica, sans-serif;
  padding:10px;
  border-radius:15px;
  position:relative;
  transition: background-color 0.2s linear;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
:host([darkmode=false]) {
  background-color: rgba(174,174,178,0.2);
}
:host([darkmode=true]) {
  background-color: rgba(99,99,102,0.2);
}
:host > div:nth-of-type(1) {
  width:100%;
  margin-bottom:5px;
  display:flex;
  justify-content:space-between;
  font-size:13px;
  color:rgba(72,72,74,1);
}
:host > div:nth-of-type(1) > div:nth-of-type(1) {
  width:calc(100% - 100px);
  text-align:left;
  opacity:0;
  transition:opacity .2s linear;
  white-space:nowrap; 
  text-overflow: ellipsis;
  overflow:hidden;
}
:host > div:nth-of-type(1) > div:nth-of-type(2) {
  width:auto;
  text-align:right;
}
:host > div:nth-of-type(2) {
  width:100%;
  height:15px;
  border-radius:15px;
  display:flex;
  overflow:hidden;
  transition: background-color 0.2s linear;
}
:host([darkmode=false]) > div:nth-of-type(2){
  background-color: rgba(174,174,178,0.5);
}
:host([darkmode=true]) > div:nth-of-type(2){
  background-color: rgba(99,99,102,0.5);
}
:host > div:nth-of-type(2) > div {
  height:100%;
  cursor:pointer;
  transition: background-color 0.2s linear;
}
</style>
<style></style>
<style> :host>div:nth-of-type(1)>div:nth-of-type(1){}  </style>
<div>
  <div></div>
  <div></div>
</div>
<div></div>
`
class storage extends HTMLElement{
  constructor(){
    super();
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(storageTemplate.content.cloneNode(true))
  }

  get items(){
    return this.getAttribute("items")
  }

  get hasItems(){
    return this.hasAttribute("items")
  }

  set items(items){
    this.setAttribute("items",items)
  }

  get unit(){
    return this.getAttribute("unit")
  }

  get hasUnit(){
    return this.hasAttribute("unit")
  }

  set unit(value){
    this.setAttribute("unit",value)
  }

  get total(){
    return this.getAttribute("total")
  }

  get hasTotal(){
    return this.hasAttribute("total")
  }

  set total(value){
    this.setAttribute("total",value)
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

  getRules = () => {
    let sheets = this.shadow.styleSheets[2]
    let rules = sheets.cssRules || sheets.rules
    return rules
  }

  itemsAnalyzer = () => {
    let itemList = eval(this.items)
    let sum = itemList.map(i=>i.value).reduce(function(a,b){return(a+b)})
    let itemContainer = this.shadow.querySelector(":host>div:nth-of-type(2)")
    Array.from(itemList).forEach((item,index)=>{
      let div = document.createElement("div")
      div.addEventListener("mouseenter",this.showName.bind(this))
      div.addEventListener("mouseleave",this.hideName.bind(this))
      this.shadow.styleSheets[1].addRule(`:host>div:nth-of-type(2)>div:nth-of-type(${index+1})`,`min-width:${this.hasTotal ? item.value*100/this.total : item.value*100/sum}%;`,0)
      this.shadow.styleSheets[1].addRule(`:host([darkmode=false])>div:nth-of-type(2)>div:nth-of-type(${index+1})`,`background-color:rgb(${lightColor[index]})`,0)
      this.shadow.styleSheets[1].addRule(`:host([darkmode=true])>div:nth-of-type(2)>div:nth-of-type(${index+1})`,`background-color:rgb(${darkColor[index]})`,0)
      itemContainer.appendChild(div)
    })
    this.shadow.querySelector(":host>div:nth-of-type(1)>div:nth-of-type(2)").innerHTML = `${sum}${this.unit} / ${this.hasTotal ? this.total : sum}${this.unit}`
  }

  showName = (event) =>{
    var index = Array.from(this.shadow.querySelectorAll(":host>div:nth-of-type(2)>div")).indexOf(event.target)
    this.getRules()[0].style.opacity = `1`
    this.shadow.querySelector(":host>div:nth-of-type(1)>div:nth-of-type(1)").innerHTML = `<b>${eval(this.items)[index].name}</b> ${eval(this.items)[index].value+this.unit}`
  }

  hideName = () => {
    this.getRules()[0].style.opacity = `0`
  }

  connectedCallback(){
    if(!this.hasUnit) this.unit = ""
    if(!this.hasDarkmode) this.darkmode = false
    this.itemsAnalyzer()
  }
}

storage.prototype.darkswitcher = true

customElements.define("ro-storage",storage)