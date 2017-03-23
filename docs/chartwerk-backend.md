# Integrating chartwerk-editor with a backend

chartwerk-editor is simply an interface for creating and editing charts and templates. It needs a backend, which manages the logic of saving and storing charts and templates, managing user charts and baking charts as flat files to AWS or another hosting service, among other important functions.

These docs are not meant to be an exhaustive guide to how to build a backend for Chartwerk. They simply explain the basic assumptions chartwerk-editor makes about the backend and what it does.

We'll make mention of [django-chartwerk](), a Django-based backend for Chartwerk, in a couple places by way of example, not as a way to describe how the backend _must_ behave.

- [Backend API](#api)
- [Context supplied to chartwerk-editor](#context)
- [Baking Chartwerk charts](#baking)

### Backend API {#api}

chartwerk-editor presumes your backend provides a RESTful API. Specifically, you'll need endpoints for charts, templates and template tags. For example:

Charts
> `api/charts/<chart ID>/`

Templates
> `api/templates/<template ID>/`

Template tags
> `api/template-tags/<template tag ID>/`

The roots of each of these endpoints are provided to chartwerk-editor as [context](#context).

[django-chartwerk]() utilizes the excellent django REST framework to provide a full API for Chartwerk charts and templates.

### Context supplied to chartwerk-editor {#context}

- `user` - Chart creator's username
- `chart_id` - Chart ID or a blank string if creating from template
- `template_id` - Template ID
- `chart_api` - RESTful API root endpoint for charts
- `template_api` - RESTful API root endpoint for templates
- `template_tags_api` - RESTful API root endpoint for template tags
- `oembed` - RESTful API root endpoint for oEmbeds or a blank string
- `embed_src` - URL for [parent page embed script](embedding.md#parent-embed).

### Baking Chartwerk charts {#baking}

The backend is responsible for "baking" charts to AWS S3 or another flat storage solution.

By "baking," we just mean the process of creating a single HTML page that includes all the scripts and styles necessary to draw a Chartwerk chart.

The backend is responsible for creating that page and uploading it to your preferred file storage.

In django-chartwerk, we do this via a post-save signal on the chart model, using celery to complete the task asynchronously. We also inline as many of the styles and dependency scripts as possible to reduce the number of separate HTTP calls a chart must make before rendering.

The chart scripts themselves are also inlined. A `chartwerk` global object is created which the draw function ingests. In that way, a chart is rendered in the baked page almost identically as it is rendered in chartwerk-editor.

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

\* `jsonify` simply dumps JSON using Python's standard module