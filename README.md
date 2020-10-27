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
<rode-switchbutton></rode-switchbutton>
```
To use it is sufficient to use this html tag. If no attributes are specified, some attributes are determined automatically.Two of them are bold mode and value.
Darmode and value initial value are false. When the html tag tree opens, this component will look like this.
```html
<rode-switchbutton value="false" darkmode="false"></rode-switchbutton>
```
#### Attributes of this HTML tag
##### value
Value can have two values; true or false
```html
<rode-switchbutton value="true||false"></rode-switchbutton>
```
##### darkmode
Darkmode can have two values; true or false
```html
<rode-switchbutton darkmode="true||false"></rode-switchbutton>
```
##### name
When the name attribute is specified, a hidden input is created and the value is written to this input. Thus, it becomes easier to use in a form.
```html
<rode-switchbutton name="someName"></rode-switchbutton>
```
##### disabled <br>
The disabled attribute does not take a value. This attribute disables the tag.
```html
<rode-switchbutton disabled></rode-switchbutton>
```
##### ontrue
This attribute runs the defined function when the tag value is true.
```html
<rode-switchbutton ontrue="someFunciton()"></rode-switchbutton>
```
##### onfalse
This attribute runs the defined function when the tag value is false.
```html
<rode-switchbutton onfalse="someFunciton()"></rode-switchbutton>
```
