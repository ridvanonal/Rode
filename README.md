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
<ro-switchbutton value="false" darkmode="false"></ro-switchbutton>
```
#### Attributes of this HTML tag
##### value
Value can have two values; true or false
```html
<ro-switchbutton value="true||false"></ro-switchbutton>
```
##### darkmode
Darkmode can have two values; true or false
```html
<ro-switchbutton darkmode="true||false"></ro-switchbutton>
```
##### name
When the name attribute is specified, a hidden input is created and the value is written to this input. Thus, it becomes easier to use in a form.
```html
<ro-switchbutton name="someName"></ro-switchbutton>
```
##### disabled <br>
The disabled attribute does not take a value. This attribute disables the tag.
```html
<ro-switchbutton disabled></ro-switchbutton>
```
##### ontrue
This attribute runs the defined function when the tag value is true.
```html
<ro-switchbutton ontrue="someFunciton()"></ro-switchbutton>
```
##### onfalse
This attribute runs the defined function when the tag value is false.
```html
<ro-switchbutton onfalse="someFunciton()"></ro-switchbutton>
```
