# mithril-timepicker

Pick a time! But only if you're using Mithril, and only for flexbox-capable browsers.

### Demo

[mithril-timepicker at flems.io](https://tinyurl.com/yd593dvd)

### Installation

via npm:

```
$> npm install mithril-timepicker
```

You'll want to bring in either src/style.sass or src/style.css, depending on your workflow.

### Usage

```
const TimePicker = require('path/to/mithril-timepicker.js')

m(TimePicker, { tfh: true, increment: 15, onchange: myTimeHandler })
```

### API

Optional `attrs` to pass to the component instance:

| ATTRIBUTE            | TYPE     | DESCRIPTION              |
| :------------------- | :------  | :----------------------- |
| `time`           | Object   | {h, m} e.g. `{ h: 23, m: 59 }`. Hour is always 0-23 |
| `tfh`            | Boolean  | 24-hour time, defaults to false |
| `increment`      | Int  | 5- or 15- minute options per hour, defaults to 5 |
| `onchange`            | Function  | Handler. Receives { h, m } as its argument|

### Theming

You can change the appearance easily by editing either style.css or style.sass, whichever fits your workflow. If you're using SASS, you can make a few quick UI changes based on variables at the top of the document.
