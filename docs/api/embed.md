# chartwerk.embed

Properties used to specify an embed code for a chart.

- [embed.dimensions](#embed)

#### embed.dimensions {#embed}

The dimensions in pixels of the chart at both the single and double-wide size. 

These are queried in the DOM while saving a chart in the editor. They are used in a child embed script to set the dimensions of the iframe and are passed to the client when using the oEmbed endpoint for chart embeds. 

```JSON
{
  single: {
    width: 270,
    height: 527
  },
  double: {
    width: 560,
    height: 436
  }
}
```