# Boilerplate Configurable Widget
 
This widget is factored from essence of material from  [Add a dashboard widget](https://www.visualstudio.com/en-us/docs/integrate/extensions/develop/add-dashboard-widget) tutorial and [Widget Samples](https://github.com/Microsoft/vsts-extension-samples/), to help get into efficient Widget development inner loop as quickly as possible, based on existing Widget patterns.

# Critical steps
Critical Steps to start testing your widget:

From the repo directory:
1. (Command Line: get current bits with bower) bower install
2. Override the publisher in vss-extension.json with your publisher Id. Learn to [create a publisher](https://www.visualstudio.com/en-us/docs/integrate/extensions/publish/overview).
3. (Command Line: Create your extension) tfx extension create --manifest-globs vss-extension.json --rev-version
4. Publish your extension from [Marketplace])(https://marketplace.visualstudio.com/manage/publishers)
5. Share your extension to your test account
6. From your account, "Manage Extensions", select "Boilerplate Configuration Widget" and "Install" it


#Customization steps
These are not critical until you are packaging a widget for public consumption.
1. Line 3- Override the publisher-unique extension "id". This is the identity of the extension for it's lifespan.
2. Line 5-Override the extension "name", this is the user facing name of the extension from the gallery.
3. Line 6-Override the user facing extension "description".
4. Line 14-Update the catalog image users see for your extension.
5. Line 19 - Override the unique id of your widget contribution.
6. Line 43 - Override the unique id of your config contribution. Apply this name to line 23.
7. Line 26 - Override the user facing widget name. This is what is visible in the widget Catalog.
8. Line 27 - Override the user facing widget description, as seen in the widget Catalog.
9. Line 28 & 29 - Override the catalog and loading images.
10. Line 31 - Specify the range of allowed Sizes for your widget. Currently 1-10 in each dimension is supported.
