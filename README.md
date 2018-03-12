# mithril-timepicker

Pick a time! But only if you're using Mithril, and only for flexbox-capable browsers.

### Demo

[mithril-timepicker at flems.io](https://tinyurl.com/y74cyanu)

### Installation

via npm:

```
$> npm install mithril-timepicker
```

You'll want to bring in either src/style.sass or src/style.css, depending on your workflow.

### Usage

```
const TimePicker = require('mithril-timepicker')

// make a reference to an object with {h, m}
const myTime = { 
    h: mySpecialDate.getHours(), 
    m: mySpecialDate.getMinutes() 
}

m(TimePicker, {
    time: myTime, // time passed in MUST be a reference, not a literal
    onchange: ({h, m}) => {
        mySpecialDate.setHours(h, m, 0, 0)
    })     
})

// if you want to wipe the slate clean
TimePicker.reset(myTime)

```

### API

`attrs` to pass to the component instance:

| ATTRIBUTE    | TYPE             | Required? | DESCRIPTION              |
| :--          | :--              | :--       | :--                      |
| `time`       | Object reference | YES       | {h, m} e.g. `{ h: 23, m: 59 }`. Hour is always 0-23 |
| `tfh`        | Boolean          | no        | 24-hour time, defaults to false |
| `increment`  | Int              | no        | 5- or 15- minute options per hour, defaults to 5 |
| `onchange`   | Function         | no        | Handler. Receives { h, m } as its argument|



### Theming

You can change the appearance easily by editing either style.css or style.sass, whichever fits your workflow. If you're using SASS, you can make a few quick UI changes based on variables at the top of the document.
