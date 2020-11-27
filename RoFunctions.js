setDark = () => {
  Array.from(document.querySelectorAll("body *")).filter(i=>i.darkswitcher==true).forEach(i=>i.darkmode=true)
}

setLight = () => {
  Array.from(document.querySelectorAll("body *")).filter(i=>i.darkswitcher==true).forEach(i=>i.darkmode=false)
}

class tabItems{
  constructor(){this.items}
  static get defaultItem(){
    return ["Use the tabItems class in RoFunctions"]
  }
}