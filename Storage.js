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

const storageTemplate = document.createElement("template")
storageTemplate.innerHTML = 
`
<style>
:host{
  width:500px;
  display:block;
}
:host > div:nth-of-type(1) {
  width:500px;
  height:15px;
  border-radius:15px;
  background-color: rgba(174,174,178,0.5) !important;
  backdrop-filter:blur(10px);
  display:flex;
  overflow:hidden;
}
:host > div:nth-of-type(1) > div {
  height:100%;
} 
</style>
<style></style>
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

  get total(){
    return this.getAttribute("total")
  }

  get hasTotal(){
    return this.hasAttribute("total")
  }

  set total(value){
    this.setAttribute("total",value)
  }

  itemsAnalyzer = () => {
    let itemList = eval(this.items)
    let sum = itemList.map(i=>i.value).reduce(function(a,b){return(a+b)})
    let itemContainer = this.shadow.querySelector(":host>div")
    Array.from(itemList).forEach((item,index)=>{
      let div = document.createElement("div")
      this.shadow.styleSheets[1].addRule(`:host>div:nth-of-type(1)>div:nth-of-type(${index+1})`,`min-width:${this.hasTotal ? item.value*100/this.total : item.value*100/sum}%;background-color:rgb(${darkColor[index]});`,0)
      itemContainer.appendChild(div)
    })
  }

  connectedCallback(){
    this.itemsAnalyzer()
  }
}

customElements.define("ro-storage",storage)