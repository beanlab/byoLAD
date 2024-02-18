# `providers` Directory

This directory contains all of the webview-related code that will be executed within the extension context. It can be thought of as the place where all of the "backend" code of a webview is contained.

Types of content that can be contained here:

Individual JavaScript / TypeScript files that contain a class which manages the state and behavior of a given webview panel. Each class is usually in charge of:

- Providing for the webview
- Setting message listeners so data can be passed between the webview and extension
- Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
