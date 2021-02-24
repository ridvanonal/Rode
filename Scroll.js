class holdDrag{
  constructor(element,dragX,dragY){
    this.element = element
    this.dragX = dragX ? true : false 
    this.dragY = dragY ? true : false
    this.position = {top : 0,left : 0,x : 0,y : 0}
    
    this.mouseDown = this.mouseDownHandler.bind(this)
    this.mouseMove = this.mouseMoveHandler.bind(this)
    this.mouseUp = this.mouseUpHandler.bind(this)

    this.touchStart = this.touchStartHandler.bind(this)
    this.touchMove = this.touchMoveHandler.bind(this)
    this.touchEnd = this.touchEndHandler.bind(this)

    this.element.addEventListener('mousedown', this.mouseDown)
    this.element.addEventListener('touchstart', this.touchStart)
    this.element.addEventListener("touchmove",(event)=> event.preventDefault())
  }

  mouseDownHandler(event){
    this.position = {
      left : this.element.scrollLeft,
      top : this.element.scrollTop,
      x : event.clientX,
      y : event.clientY 
    }
    document.addEventListener('mousemove', this.mouseMove)
    document.addEventListener('mouseup', this.mouseUp) 
  }

  mouseMoveHandler(event){
    const distanceX = event.clientX - this.position.x 
    const distanceY = event.clientY - this.position.y

    if(this.dragY) this.element.scrollTop = this.position.top - distanceY
    if(this.dragX) this.element.scrollLeft = this.position.left - distanceX

    this.element.style.pointerEvents = "none"
    this.element.style.userSelect = 'none'

    const dragging = new CustomEvent("dragging",{detail:{left : this.element.scrollLeft,top : this.element.scrollTop}})
    this.element.dispatchEvent(dragging)
  }

  mouseUpHandler(){
    this.element.style.removeProperty("pointer-events")
    this.element.style.removeProperty("user-select")

    document.removeEventListener('mousemove', this.mouseMove)   
    document.removeEventListener('mouseup', this.mouseUp)
  }

  touchStartHandler(event){
    this.position = {
      left : this.element.scrollLeft,
      top : this.element.scrollTop,
      x : event.changedTouches[0].clientX,
      y : event.changedTouches[0].clientY 
    }
    document.addEventListener('touchmove', this.touchMove)
    document.addEventListener('touchend', this.touchEnd)  
  }

  touchMoveHandler(event){
    const distanceX = event.changedTouches[0].clientX - this.position.x 
    const distanceY = event.changedTouches[0].clientY - this.position.y

    if(this.dragY) this.element.scrollTop = this.position.top - distanceY
    if(this.dragX) this.element.scrollLeft = this.position.left - distanceX

    const dragging = new CustomEvent("dragging",{detail:{left : this.element.scrollLeft,top : this.element.scrollTop}})
    this.element.dispatchEvent(dragging)
  }

  touchEndHandler(){
    document.removeEventListener('touchmove', this.touchMove)
    document.removeEventListener('touchend', this.touchEnd)
  }
}