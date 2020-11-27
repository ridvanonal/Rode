const tabBarTemplate = document.createElement("template")
tabBarTemplate.innerHTML = 
`
<style>
  :host{
    cursor: pointer;
    -webkit-touch-callout: none; 
    -webkit-user-select: none;
    -khtml-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
    display:flex;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size:14px;
  }
  :host > div{
    border-radius: 10px;
    padding: 3px;
    box-sizing: border-box;
    position: relative;
    transition: background-color .2s linear;
  }
  :host([darkmode=false]) > div {
    background-color: rgba(242,242,247,1);
  }
  :host([darkmode=true]) > div {
    background-color: rgba(28,28,30,1);
  }
  :host > div > div:nth-of-type(1){
    border-radius: 7px;
    background-color: white;
    height: calc(100% - 6px);
    position: absolute;
    z-index: 0;
    box-shadow: 0px 1px 3px rgba(0,0,0,0.15);
    transition: margin-left .2s linear,
                width .2s linear,
                background-color .2s linear;
  }
  :host([darkmode=false])> div > div:nth-of-type(1){
    background-color:rgba(255,255,255,1);
  }
  :host([darkmode=true])> div > div:nth-of-type(1){
    background-color:rgba(99,99,102,1);
  }
  :host > div > div:nth-of-type(2){
    position: relative;
    z-index: 1;
    display: flex;
  }
  :host > div > div:nth-of-type(2) > div{
    padding: 5px 10px;
    white-space: nowrap;
    transition: color .2s linear;
  }
  :host([darkmode=false]) > div > div:nth-of-type(2) > div{
    color: rgba(0,0,0,0.5);
  }
  :host([darkmode=false]) > div > div:nth-of-type(2) > div[rode-selected]{
    color:rgba(0,0,0,1);
  }
  :host([darkmode=true]) > div > div:nth-of-type(2) > div{
    color: rgba(255,255,255,0.5);
  }
  :host([darkmode=true]) > div > div:nth-of-type(2) > div[rode-selected]{
    color:rgba(255,255,255,1);
  }
</style>

<style>
  :host > div > div:nth-of-type(1){
    width:0px;
    margin-left:0px;
  }
  :host > div{
    width:auto
  }
</style>

<div>
  <div></div>
  <div></div>
</div>
`
class tabBar extends HTMLElement{
  constructor() {
    super()
    this.shadow = this.attachShadow({mode:"closed"})
    this.shadow.appendChild(tabBarTemplate.content.cloneNode(true))
    this.itemWidths = []
    this.itemLefts = []
    this.itemList
  }

  get selectedtab(){
    return this.getAttribute("selectedtab")
  }

  get hasSelectedtab(){
    return this.hasAttribute("selectedtab")
  }

  set selectedtab(index){
    this.setAttribute("selectedtab",index)
  }

  get items(){
    return this.getAttribute("items")
  }

  get hasItems(){
    return this.hasAttribute("items")
  }

  set items(itemArray){
    this.setAttribute("items",itemArray)
  }

  static get observedAttributes(){
    return ["selectedtab"]
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

  attributeChangedCallback(attr,oldValue,newValue){
    switch (attr) {
      case "selectedtab":
        if(this.isConnected) this.moveSelected()
      break;
    }
  }

  itemCalculator = () =>{
    this.itemList = this.shadow.querySelectorAll(":host>div>div:nth-of-type(2)>div")
    Array.from(this.itemList).forEach(item => {
      item.addEventListener("click",this.onClick.bind(this))
      this.itemWidths.push(item.getBoundingClientRect().width)
      this.itemLefts.push(item.offsetLeft)
    })
  }

  setContainerWidth = () =>{
    let sheets = this.shadow.styleSheets[1]
    let rules = sheets.cssRules || sheets.rules
    const arrSum = arr => arr.reduce((a,b) => a + b, 0)
    rules[1].style.width = arrSum(this.itemWidths) + 6 + "px"
  }

  onClick = (event) =>{
    this.selectedtab = Array.from(this.itemList).indexOf(event.target)
  }

  moveSelected = () =>{
    let sheets = this.shadow.styleSheets[1]
    let rules = sheets.cssRules || sheets.rules
    Array.from(this.itemList).forEach(item=>item.removeAttribute("rode-selected"))
    this.itemList[this.selectedtab].setAttribute("rode-selected","")
    rules[0].style.width = this.itemWidths[this.selectedtab] + "px"
    rules[0].style.marginLeft = this.itemLefts[this.selectedtab] + "px"
  }

  tabAdd = () =>{
    let itemContainer = this.shadow.querySelector(":host>div>div:nth-of-type(2)")
    let itemName = eval(this.items) ? eval(this.items).items : tabItems.defaultItem
    itemName.forEach(item=>{
      let div = document.createElement("div")
      div.innerHTML = item
      itemContainer.appendChild(div)
    })
  }

  connectedCallback(){
    if(!this.hasItems) this.items = tabItems.default
    if(this.hasItems) this.tabAdd()
    this.itemCalculator()
    this.setContainerWidth()
    if(!this.hasSelectedtab) this.selectedtab = 0
    if(!this.hasDarkmode) this.darkmode = false
  }
}

tabBar.prototype.darkswitcher = true

customElements.define("ro-tabbar",tabBar)