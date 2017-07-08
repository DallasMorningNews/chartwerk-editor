# Chart template basics

This section will walk you through the basics of writing the code behind a chart template in Chartwerk.

* [The "draw" function](#draw-function)
* [The "helper" object](#helper-object)
* [Chart styles](#chart-styles)
* [Including dependencies](#dependencies)
* [Ownership of annotations](#ownership-annotations)
* [Best practices](#best-practices)

### The "draw" function {#draw-function}

Chartwerk will call a single, named global function to draw your chart.

This function **must be** named "draw", as in:

```javascript
function draw(){
  // your chart code here...
}
```

The function will be called in the Editor every time a user makes a selection in the Editor's UI.

##### Idempotence

Though the draw function is called multiple times in the Editor, it _does not necessarily_ need to be [idempotent](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning), i.e., producing the same result no matter how many times called. Chartwerk presumes your chart function will only be called once in the embeddable page and tolerates multiple calls in the Editor by [removing all children](https://github.com/DallasMorningNews/chartwerk-editor/blob/master/src/js/misc/api.js#L67-L74) of the `#chart` preview container before each call, basically giving you a blank slate each time.

### The "helper" object {#helper-object}

Often, it's helpful to move boilerplate code you know won't change away from code you think you may tweak as users build charts with your template.

Chartwerk gives you a space to define an object with helpful methods to do rudimentary tasks like parse data or define scales and axes.

For example, you might have a helper object like this:

```javascript
var werkHelper = {
  parseData: function() {
    // Parses data into correctly formatted data types,
    // e.g., dates and numbers instead of strings, etc.
  },
  scales: function() {
    // Defines some d3.js scales
  }
}
```

... which you could them call within your draw function like this:

```javascript
function draw() {
  werkHelper.parseData();
}
```

See the Best Practices section on passing data to and from the helper object for a real example of a typical exchange between the draw function and helper object.

### Chart styles {#chart-styles}

You can write any CSS you need in the Editor to style your chart. Those styles will be inlined in the embeddable page.

Since your chart will be embedded via an iframe, you generally don't need to worry about class name collisions, but it's beneficial in the Editor to prefix styles with the container element of the chart preview \`\#chart\`.

### Including dependencies {#dependencies}

<img src="./img/screenshots/dependencies.png" class="screenshot" />

On the `Code` tab of the editor, you can inject any third-party scripts or stylesheets you need to draw your chart. Just add them by a CDN link or any link you host yourself.

Stylesheets and scripts are injected in the order shown in the Editor, preceding styles or scripts written directly in the template.

One common practice is to develop parts of your template code into standalone libraries, for example, methods you would otherwise hang on the `helper` object.

### Ownership of annotations {#ownership-annotations}

Chartwerk assumes ownership of many parts of the annotation layer for charts.

Specifically, Chartwerk handles:

* Color legends
* Free annotations
* The headline
* Chatter
* Footnote
* Source line
* Author/attribution line

The rendering scripts for these features are built into the Editor preview.

A separate script, `client.bundle.js`, will render [these](https://github.com/DallasMorningNews/chartwerk-editor/blob/master/src/js/client/legend.js) [text](https://github.com/DallasMorningNews/chartwerk-editor/blob/master/src/js/client/annotations.js) [elements](https://github.com/DallasMorningNews/chartwerk-editor/blob/master/src/js/client/text.js) in the embeddable page and should be inlined on that page by the backend app.

### Best practices {#best-practices}

#### Writing template code to accommodate arbitrary user data.

Chart templates should anticipate any data users can throw at them without relying on set header names in the data schema.

You can use the [datamap API](/docs/api/datamap.md) to write templates that are agnostic to how your user's data is formatted.

Take some user data about fatality rates at different ages for a scatterplot that, after parseing, looks like this:

```javascript
[
  {
    age: 23,
    fatality: .0005
  },
  {
    age: 28,
    fatality: .0012
  }
]
```

Obviously, writing template code with explicit calls to the `age` and `fatality` properties is a bad idea for reusability.

Instead, we could recast our data to have predictable properties like `x` and `y` that will make our template code abstractable across any arbitrary data scheme.

So how do we know which property in the original user data belongs to `x` and which to `y`?

Use the datamap API!

In our case, `chartwerk.datamap.base` would represent the `x` property, which is `age`. And `chartwerk.datamap.value` would be our `y` property, `fatality`.

```javascript
chartwerk.datamap.base
// 'age'
chartwerk.datamap.value
// 'fatality'
```

Putting it all together, we can accomodate any arbitrary user data using a pattern like this:

```javascript
// Recast data as an array of objects with predictable properties.
var chartData = chartwerk.data.map(function(d){
  return {
    x: d[chartwerk.datamap.base],
    y: d[chartwerk.datamap.value]
  };
});


// Pass the new array as data to draw SVG elements.
var circles = d3.selectAll("circle")
                .data(chartData);

// Use the new properties to access the data you need.
circles
  .append("circle")
    .attr("r", 5)
    .attr("cx", function(d){ return d.x; })
    .attr("cy", function(d){ return d.y; });
```

The different properties in the datamap API can be used to create template code for dozens of chart types that can handle any arbitrary tabular data. Read those [API docs](/docs/api/datamap.md)!

#### Writing template code to handle both chart sizes

Your chart template must accommodate both single and double-wide chart sizes. But you shouldn't need to write large blocks of code or lengthy if/then statements. You can write objects that use the API's active chart size key at `chartwerk.ui.size` to access the appropriate properties for your chart.

For example:

```javascript
// An object with SVG dimensions for both single and
// double-wide chart sizes.
var dims = {
  single: { width: 260, height: 225 },
  double: { width: 540, height: 250}
};

// Now in your template access the appropriate property
// by the size key.
d3.select("#chart").append("svg")
  .attr("width", dims[chartwerk.ui.size].width)
  .attr("height", dims[chartwerk.ui.size].height);
```

The above code will now work regardless of which chart size is active.

\(Switching the `chartwerk.ui.size` property is also how Chartwerk's backend bakes out each chart size, so it's important your template's code responds to it.\)

#### Working with the helper object

In most cases, we use the helper object to do parsing tasks we need before we can begin to draw a chart, for example setting up SVG axes or defining scales in d3.js. Relegating these tasks to helper object methods keeps our draw function cleaner and its code more explicitly tied to actually drawing SVG elements.

Most of these helper methods can be performed in sequence once and then the data handed back to the draw function. To do this easily, we often write the helper object with a single method that calls all others, like the `build` method below:

```javascript
var werkHelper = {
  parse: function(werk) {
    // ...
  },

  scales: function (werk) {
    // ...
  },

  // etc.

  build: function(werk) {
    this.parse(werk);
    this.scales(werk);
    // etc.
    return werk;
  }
}
```

You'll notice the `werk` parameter is passed to all the methods above. This is usually an object we can hang various properties on, like d3 scale functions and axes. We'll usually create that object in the draw function with any initial properties we know upfront:

```javascript
function draw(){
  // An object that you can pass to the helper object
  // with any initial properties you know, for example,
  // chart dimensions we'll need to define our scale ranges.
  var initialProps = {
        dims: {
          single: { width: 260, height: 225 },
          double: { width: 540, height: 250}
        },
    };
  // Pass the object to the build method on the helper object.   
  var werk = werkHelper.build(initialProps);  
}
```

Then we'll hang named properties on that object in the helper.

Here's a complete example using the above `initialProps` and defining parsed data and scales on the `werk` object:

```javascript
var werkHelper = {

  // Method that parses raw user data into an array of
  // data objects our template can use.
  parse: function(werk) {
    // First, define some parsers for our data formats.
    // Dates for the x axis, numbers for the y.
    werk.parsers = {
      x: d3.timeParse( chartwerk.axes.base.dateFormat ),
      y: function(d){ return +d; }
    };

    // Now use those parsers to create a new array of data objects
    // which have properties x & y.
    // * Checkout the datamap API section if datamap.base/value are confusing.
    werk.data = chartwerk.data.map(function(d){
      return {
        x: werk.parsers.x(d[chartwerk.datamap.base]),
        y: werk.parsers.y(d[chartwerk.datamap.value[0]])
      };
    })

  },

  // Method that defines d3 scales for both axes in our chart
  scales: function(werk) {
    // Get the max dimensions of the chart, based on which
    // preview size is active.
    var s = chartwerk.ui.size,
        w = werk.dims[s].width,
        h = werk.dims[s].height;

    // Get the extents (min/max) of the X & Y data. 
    var xExtent = d3.extent(werk.data, function(d) { return d.x; }),
        yExtent = d3.extent(werk.data, function(d) { return d.y; });

    // Define scales and hang them on the werk object.
    werk.scales = {
      x: d3.scaleTime()
          .domain(xExtent)
          .range([0, w]),
      y: d3.scaleLinear()
          .domain(yExtent)
          .range([h, 0])
    };
  },

  // Build function that calls each of the above methods
  build: function(werk) {
    this.parse(werk);
    this.scales(werk);
    return werk;
  }
}
```

#### Dealing with date formatting

Date formatting is always a finicky part of every chart template. It's important that users have some flexibility to choose date formats appropriate for their chart.

The code below is a complete example of a chart that has a date-typed X axis and uses Chartwerk's API to appropriately format dates for tick labels along the axis.

You'll notice heavy doses of d3's [datetime formatting](https://github.com/d3/d3-time-format/blob/master/README.md#locale_format), [locales](https://github.com/d3/d3-time-format/blob/master/README.md#locales) and [multi-scale time formats](https://github.com/d3/d3-time-format#d3-time-format), so you may need to read up on their use to understand what's going on in this snippet. You'll also want to take a look at the [base axis format API](/docs/api/axes.md#base-format-dateString) to see how users can specify their preferred formatting options.

This code is usually part of a helper object method but could easily be abstracted into a dependency script.

```javascript
 if (chartwerk.axes.base.type !== 'date') {
    return;
}

// Define a custom locale according to our house style.
var customLocale = {
  "dateTime": "%x, %X",
  "date": "%-m/%-d/%Y",
  "time": "%-I:%M:%S %p",
  "periods": ["AM", "PM"],
  "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "shortDays": ["S", "M", "T", "W", "T", "F", "S"],
  "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
}

d3.timeFormatDefaultLocale(customLocale);

// Set up default formats for each time unit which users can later override.
var formatMillisecond = d3.timeFormat(".%L"),
    formatSecond = d3.timeFormat(":%S"),
    formatMinute = d3.timeFormat("%I:%M"),
    formatHour = d3.timeFormat("%I %p"),
    formatDay = d3.timeFormat("%a %d"),
    formatWeek = d3.timeFormat("%b %d"),
    formatMonth = d3.timeFormat("%B"),
    formatYear = d3.timeFormat("%Y");


// Use user's preferred formats to overwrite defaults.
var s = chartwerk.ui.size;
var dateTick; // Will use this to specify frequency of date ticks later
switch(chartwerk.axes.base.format[s].dateString) {
    case 'Y': // Long year
        dateTick = d3.timeYear;
        formatYear = d3.timeFormat("%Y");
        break;
    case 'y': // Short year
        dateTick = d3.timeYear;
        formatYear = d3.timeFormat("'%y");
        break;
    case 'M': // etc. ...
        dateTick = d3.timeMonth;
        formatMonth = d3.timeFormat("%B");
        formatYear = d3.timeFormat("Jan. '%y");
        break;
    case 'm':
        dateTick = d3.timeMonth;
        formatMonth = d3.timeFormat("%b.");
        formatYear = d3.timeFormat("J/%y");
        break;
    case 'W':
    case 'w':
        dateTick = d3.timeWeek;
        formatMonth = d3.timeFormat("%b.");
        formatYear = d3.timeFormat("J/%y");
        break;
    case 'D':
        dateTick = d3.timeDay;
        formatMonth = d3.timeFormat("%b.");
        formatYear = d3.timeFormat("J/%y");
}

// Multi-scale time format using formats defined above
function multiFormat(date) {
  return (d3.timeSecond(date) < date ? formatMillisecond
      : d3.timeMinute(date) < date ? formatSecond
      : d3.timeHour(date) < date ? formatMinute
      : d3.timeDay(date) < date ? formatHour
      : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
      : d3.timeYear(date) < date ? formatMonth
      : formatYear)(date);
}

werk.axes.x.tickFormat(multiFormat)

// Set tick frequency on axis
werk.axes.x.ticks(
    dateTick.every( chartwerk.axes.base.format[s].frequency )
);
```



