# <a href='https://dallasmorningnews.github.io/chartwerk/'><img src='logo.png' height='55'></a>


### What is Chartwerk?

Chartwerk is an application for developing data visualizations and publishing them as embeddable, flat pages to a hosting service such as Amazon S3.

### Why Chartwerk?

Like many other chart builders, Chartwerk provides an interface for non-coders to easily create interactive and static charts. However, you may find, like we did, that most chart makers are set-and-forget systems that aren't well designed to grow with the needs of your team.

Chartwerk was designed to be a more collaborative tool between coders and non-coders. It lets developers easily build and modify charts on the fly directly alongside users by exposing a robust internal API that translates tabular data into discrete dataviz properties. 

Because chart templates in Chartwerk are arbitrary functions written to consume Chartwerk's API, developers have complete control of the logic used to draw charts and the freedom to use any third-party libraries they like.

In the newsroom, Chartwerk helps us develop dataviz quickly in response to the needs of beat reporters and scale our development time multiplied by every chart our reporters build from the templates we create.

That said, Chartwerk may not be the best choice among all other chart builders for your team if you don't have at least one developer to help build up your chart template set.

### What's in it?

Chartwerk actually consists of **two** applications:

1. A backend app that maintains RESTFUL endpoints for charts and chart templates, serves navigational pages for users to select the type of chart they'd like to build and handles logic for user accounts and for "baking" charts to S3 or another flat storage service.
2. A front-end app to create and manipulate charts and chart templates before saving them to the backend.

Chartwerk-editor represents the latter. You can find an example of the former at [django-chartwerk](https://github.com/DallasMorningNews/django-chartwerk).

### OK, so "chartwerk-editor?"

chartwerk-editor is a React/Redux-based editor for charts and chart templates. It is the heart of Chartwerk.

It's designed to be flexible for both non-coding chart creators and chart template developers so they can build almost any chart type that can be represented with tabular/spreadsheet data.

Read on in these docs to learn more about how it works and how you can integrate it into your own application or into a backend like `django-chartwerk`.

### Contents

- [How Chartwerk makes charts](/docs/how-chartwerk-makes-charts.md)
- [Chart template basics](/docs/template-basics.md)
- [Chartwerk's API](/docs/chartwerk_api.md)
- [Integrating chartwerk-editor with a backend](/docs/chartwerk-backend.md)
- [Embedding Chartwerk charts in your CMS](/docs/embedding.md)
- [Developing chartwerk-editor](/docs/developing.md)




