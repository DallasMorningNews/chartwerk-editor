# Chartwerk's API

The Chartwerk API is a complete JSON representation of every chart  Chartwerk makes, from the raw data a user pastes into the Editor to the individual options she chooses for things like colors and text labels to the template code that parses those options to create the chart.

The entire UI state in the Editor is also represented in the API's JSON, making charts extremely portable.

In the Editor, the API is accessed via the `chartwerk` global object. When you write template code, you'll get chart data and options through that object. For example:

```javascript
var myChartData = chartwerk.data;
```

Chart creators will likely never see the API, but template developers will interact with it directly, as it contains all the key information necessary to build a chart.

Most chart templates will only use a portion of the data and options specified in the API, but in its entirety, the spec is robust enough to build dozens of chart types.

#### Learning the API

Complete documentation for the API is included here, but **the best way to understand how the API works is to observe it in the Editor.**

Open the full screen JavaScript editor on the Code tab and check out the API tree chart. There you can see the API populated with real data parsed by the template and how those properties change with user input in the Editor.

<img src="img/screenshots/api_tree.png" class="screenshot" />