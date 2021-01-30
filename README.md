# RodeLib
This library enables the use of new html tags thanks to web components. The purpose of this library is to facilitate the use of repetitive objects and to integrate components. These elements;
- Switch Button
- Slider Bar
- Progress Bar
- Circle Pogress
- Stepper

## Switch Button
#### Usage
```html
<ro-switchbutton></ro-switchbutton>
```
To use it is sufficient to use this html tag. If no attributes are specified, some attributes are determined automatically. Two of them are darkmode and value.
Darkmode and value initial value are false. When the html tag tree opens, this component will look like this.
```html
<ro-switchbutton value="false" dark="false"></ro-switchbutton>
```
#### Attributes
##### • checked
The checked attribute does not take a value. Ckecked or not.
```html
<ro-switchbutton checked></ro-switchbutton>
```
##### • dark
Darkmode can have two values; true or false
```html
<ro-switchbutton dark="true||false"></ro-switchbutton>
```
##### • disabled
The disabled attribute does not take a value. This attribute disables the tag. Disabled or not.
```html
<ro-switchbutton disabled></ro-switchbutton>
```
#### Events
The SwitchButton has only one event. 
##### • change
It can observe with addEventListener
```html
<ro-switchbutton id="switchButton"></ro-switchbutton>
```
```js
document.querySelector("switchButton").addEventListener("change",function(event){
  return event.detail.checked // Returns true or false
})
```
