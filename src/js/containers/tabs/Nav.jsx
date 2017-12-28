import React from 'react';

export default () => (
  <ul className="nav nav-tabs" role="tablist">
    <li role="presentation">
      <a href="#data" data-target="#data" aria-controls="data"
        role="tab" data-toggle="tab" className="active"
      >Data</a>
    </li>
    <li role="presentation">
      <a href="#axes" data-target="#axes" aria-controls="axes"
        role="tab" data-toggle="tab"
      >Axes</a>
    </li>
    <li role="presentation">
      <a href="#layout" data-target="#layout" aria-controls="layout"
        role="tab" data-toggle="tab"
      >Layout</a></li>
    <li role="presentation">
      <a href="#text" data-target="#text" aria-controls="text"
        role="tab" data-toggle="tab"
      >Text</a></li>
    <li role="presentation">
      <a href="#annotations" data-target="#annotations"
        aria-controls="annotations" role="tab" data-toggle="tab"
      >Annotations</a></li>
    <li role="presentation">
      <a href="#code" data-target="#code" aria-controls="code"
        role="tab" data-toggle="tab"
      >Code</a></li>
    <li role="presentation">
      <a href="#publish" data-target="#publish" aria-controls="publish"
        role="tab" data-toggle="tab"
      >Publish</a></li>
  </ul>
);
