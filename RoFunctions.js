setDark = () => {
  Array.from(document.querySelectorAll("body *")).filter(i=>i.darkswitcher==true).forEach(i=>i.darkmode=true)
}

setLight = () => {
  Array.from(document.querySelectorAll("body *")).filter(i=>i.darkswitcher==true).forEach(i=>i.darkmode=false)
}