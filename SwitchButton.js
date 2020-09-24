class SwitchButton extends HTMLElement{
    constructor(){
        super();
        this.selector = this.attachShadow({mode:"open"})
    }

    get value(){
        return this.getAttribute("value");
    }

    set value(Bool){
        this.setAttribute("value",Bool);
    }

    get name(){
        return this.getAttribute("name");
    }

    set name(name){
        this.setAttribute("name",name);
    }

    get darkmode(){
        return this.getAttribute("darkmode")
    }

    set darkmode(Bool){
        return this.setAttribute("darkmode",Bool)
    }

    set disabled(Bool){
         if(Bool){
             this.setAttribute("disabled",Bool);
         }else{
             this.removeAttribute("disabled");
         }
    }

    get disabled(){
        return this.getAttribute("disabled")
    }

    static get observedAttributes(){
        return ["value","name","darkmode","disabled"]
    }

    attributeChangedCallback(Attr,oldValue,newValue){
        switch(Attr){
            case 'value': 
                if(newValue == "true" && oldValue=="false"){
                    this.AddActive();
                }
                if(newValue == "false" && oldValue=="true"){
                    this.RemoveActive();
                }
                break;
            case 'darkmode':
                if(newValue == "true" && oldValue=="false"){
                    this.Dark();
                }
                if(newValue == "false" && oldValue=="true"){
                    this.Light();
                }
                break;  
                case 'disabled':  
                      
            }     
            
    };

    AddActive(){
        this.selector.querySelector(".switchbutton").classList.add("active") 
        this.selector.querySelector(".dot").classList.add("active")
    }

    RemoveActive(){
        this.selector.querySelector(".switchbutton").classList.remove("active") 
        this.selector.querySelector(".dot").classList.remove("active")       
    }

    Dark(){
        this.selector.querySelector(".switchbutton").classList.remove("light") 
        this.selector.querySelector(".dot").classList.remove("light")  
        this.selector.querySelector(".switchbutton").classList.add("dark") 
        this.selector.querySelector(".dot").classList.add("dark")
    }

    Light(){
        this.selector.querySelector(".switchbutton").classList.remove("dark") 
        this.selector.querySelector(".dot").classList.remove("dark")  
        this.selector.querySelector(".switchbutton").classList.add("light") 
        this.selector.querySelector(".dot").classList.add("light")
    }

    Click(){
        if(this.value=="false"){
            this.AddActive();
            this.value = "true";    
           
        }else{
           this.RemoveActive();
            this.value = "false";
        }
    }

    connectedCallback(){    
        this.selector.innerHTML=`
            <style>
            .switchbutton{
                height: 24px !important;
                width: 40px !important;
                border-radius: 15px !important;
                backdrop-filter:blur(10px);
                padding: 2px !important;
                box-sizing: border-box !important;
                -webkit-transition: background-color .2s linear !important;
                -ms-transition: background-color .2s linear !important;
                transition: background-color .2s linear !important;
                cursor: pointer !important;
              }
              .switchbutton .dot{
                height: 20px !important;
                width: 20px !important;
                background-color: rgba(255,255, 255, 1) !important;
                border-radius: 100% !important;
                box-shadow: 0px 1px 3px rgba(0,0,0,0.15) !important;
                -webkit-transition: margin-left .2s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                -ms-transition: margin-left .2s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                transition: margin-left .2s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
              }
              .switchbutton.dark{
                background-color: rgba(72,72, 74, 0.5) !important;
              }  
              .switchbutton.light{
                background-color: rgba(174,174, 178, 0.25) !important;
              }
              .switchbutton.light.active{
                background-color: rgba(59,199, 89, 1) !important;
              }
              .switchbutton.dark.active{
                background-color: rgba(48,209, 88, 1) !important;
              }   
              .switchbutton .dot.active{
                margin-left: 16px !important;
              } 
            </style>
        <div class="switchbutton light"><div class="dot"></div></div>
        `;

        if(this.value == 'true'){
           this.AddActive();
        }
        if(this.darkmode == 'true'){
            this.Dark();
        }
        this.selector.querySelector(".switchbutton").addEventListener("click",this.Click.bind(this));
    }



}
customElements.define("rode-switchbutton",SwitchButton);

