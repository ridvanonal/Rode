const observeElements = function(itemToBeObserved){
  return new Promise(function(resolve,reject){
    let listOfObservedItem = []
    let observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        listOfObservedItem.push(mutation)
      })
    })
    observer.observe(itemToBeObserved, { childList: true })
    resolve(listOfObservedItem)
  })
}

class observeElementsTag extends HTMLElement{
  constructor(){
    super()
    observeElements(this).then(result=>{this.listOfObservedItem=result})
    this.shadow = this.attachShadow({mode:"closed"})
  }
  connectedCallback(){
    console.log(this.listOfObservedItem)
  }
}

customElements.define("observe-elements",observeElementsTag)
