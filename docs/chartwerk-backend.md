# Integrating chartwerk-editor with a backend

Chartwerk-editor is simply an interface for creating and editing charts and templates. It needs a backend, which manages the logic of saving and storing charts and templates, managing user charts and baking charts as flat files to AWS or another hosting service, among other important functions.

These docs are not meant to be an exhaustive guide to how to build a backend for Chartwerk. They simply explain the basic assumptions chartwerk-editor makes about the backend and what it does.

We'll make mention of [django-chartwerk](https://github.com/DallasMorningNews/django-chartwerk/), a Django-based backend for Chartwerk, in a couple places by way of example, not as a way to describe how the backend _must_ behave.

- [Backend API](#api)
- [Context supplied to chartwerk-editor](#context)
- [Baking Chartwerk charts](#baking)

### Backend API {#api}

Chartwerk-editor presumes your backend provides a RESTful API. Specifically, you'll need endpoints for charts, templates and template tags. For example:

Charts
> `api/charts/<chart ID>/`

Templates
> `api/templates/<template ID>/`

Embed codes
> `api/embeds/<chart ID>/`

Template tags
> `api/template-tags/<template tag ID>/`

The roots of each of these endpoints are provided to chartwerk-editor as [context](#context).

[Django-chartwerk](https://github.com/DallasMorningNews/django-chartwerk/) utilizes the excellent [Django REST Framework](http://www.django-rest-framework.org/) to provide a full API for Chartwerk charts and templates.

### Context supplied to chartwerk-editor {#context}

- `user` - Chart creator's username
- `chart_id` - Chart ID or a blank string if creating from template
- `template_id` - Template ID
- `chart_api` - RESTful API root endpoint for charts
- `template_api` - RESTful API root endpoint for templates
- `embed_api` - RESTful API root endpoint for embed codes
- `template_tags_api` - RESTful API root endpoint for template tags
- `oembed` - Boolean whether to return an oEmbed URL to user as embed code.
- `color_schemes` - JavaScript object of color schemes. If this object is empty, chartwerk-editor will us a default color scheme.

#### color_schemes

Color schemes should specify keys for categorical, sequential and diverging scheme collections. Categorical must include a scheme called `default`. All other schemes can be called whatever you like. Format them like this:

```javascript
{
  categorical: {
    default: [
          '#AAAAAA',
          '#BBB',
          // etc.
      ],
  },
  sequential: {
      reds: [
          '#FF0000',
          '#8B0000',
          // etc.
      ],
      blues: [
          '#0000FF',
          '#000080',
          // etc.
      ],
  },
  diverging: {
      redBlue: [
          '#FF0000',
          '#0000FF',
          // etc.
      ],
  },
}
```




### Baking Chartwerk charts {#baking}

The backend is responsible for "baking" charts to AWS S3 or another flat storage solution.

By "baking," we just mean the process of creating a single HTML page that includes all the scripts and styles necessary to draw a Chartwerk chart.

The backend is responsible for creating that page and uploading it to your preferred file storage.

In django-chartwerk, we do this via a post-save signal on the chart model, using [Celery](http://www.celeryproject.org/) to complete the task asynchronously. We also inline as many of the styles and dependency scripts as possible to reduce the number of separate HTTP calls a chart must make before rendering.

The chart scripts themselves are also inlined. A `chartwerk` global object is created which the draw function ingests. In that way, a chart is rendered in the baked page almost identically as it is rendered in chartwerk-editor for previewing.

Here's an example from django-chartwerk (using Django's templating syntax) of how we bake a chart's scripts into a single script tag:

```html
<script type="text/javascript">
{% autoescape off %}
// Werk object
var chartwerk = {{werk.data|jsonify}};
// Helper script
{{werk.scripts.helper}}
// Draw script
{{werk.scripts.draw}}
// Renderer
{{werk.client.scripts}}
{% endautoescape %}
</script>
```

\* `jsonify` is a custom template filter that simply dumps JSON using Python's standard module
