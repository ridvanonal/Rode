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
  }
  :host > div{
    border-radius: 10px;
    background-color: rgba(240,240,240,1);
    padding: 3px;
    box-sizing: border-box;
    position: relative;
  }
  :host > div > div:nth-of-type(1){
    border-radius: 7px;
    background-color: white;
    height: calc(100% - 6px);
    position: absolute;
    z-index: 0;
    box-shadow: 0px 1px 3px rgba(0,0,0,0.15);
    transition: margin-left .2s linear,
                width .2s linear;
  }
  :host > div > div:nth-of-type(2){
    position: relative;
    z-index: 1;
    display: flex;
  }
  :host > div > div:nth-of-type(2) > div{
    padding: 5px 10px;
    white-space: nowrap;
    color: rgba(0,0,0,0.5);
    transition: color .2s linear;
  }
  :host > div > div:nth-of-type(2) > div[rode-selected]{
    color:rgba(0,0,0,1);
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



  attributeChangedCallback(attr,oldValue,newValue){
    switch (attr) {
      case "selectedtab":
        if(this.isConnected) this.#moveSelected()
      break;
    }
  }

  #itemCalculator = () =>{
    this.itemList = this.shadow.querySelectorAll(":host>div>div:nth-of-type(2)>div")
    Array.from(this.itemList).forEach(item => {
      item.addEventListener("click",this.#onClick.bind(this))
      this.itemWidths.push(item.getBoundingClientRect().width)
      this.itemLefts.push(item.offsetLeft)
    })
  }

  #setContainerWidth = () =>{
    let sheets = this.shadow.styleSheets[1]
    let rules = sheets.cssRules || sheets.rules
    const arrSum = arr => arr.reduce((a,b) => a + b, 0)
    rules[1].style.width = Math.ceil(arrSum(this.itemWidths) +6) + "px"
  }

  #onClick = (event) =>{
    this.selectedtab = Array.from(this.itemList).indexOf(event.target)
  }

  #moveSelected = () =>{
    let sheets = this.shadow.styleSheets[1]
    let rules = sheets.cssRules || sheets.rules
    Array.from(this.itemList).forEach(item=>item.removeAttribute("rode-selected"))
    this.itemList[this.selectedtab].setAttribute("rode-selected","")
    rules[0].style.width = this.itemWidths[this.selectedtab] + "px"
    rules[0].style.marginLeft = this.itemLefts[this.selectedtab] + "px"
  }

  #tabAdd = () =>{
    let itemContainer = this.shadow.querySelector(":host>div>div:nth-of-type(2)")
    let itemName = this.items.split(";")
    itemName.forEach(item=>{
      let div = document.createElement("div")
      div.innerHTML = item
      itemContainer.appendChild(div)
    })
  }

  connectedCallback(){
    if(this.hasItems) this.#tabAdd()
    this.#itemCalculator()
    this.#setContainerWidth()
    if(!this.hasSelectedtab) this.selectedtab = 0
  }
}

customElements.define("rode-tabbar",tabBar)