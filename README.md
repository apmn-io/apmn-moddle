> As of version `5.0.0` this library exposes [ES modules](http://exploringjs.com/es6/ch_modules.html#sec_basics-of-es6-modules). Use [esm](https://github.com/standard-things/esm) to consume it or an ES module aware bundler such as [Webpack](https://webpack.js.org) or [Rollup](https://rollupjs.org) to bundle it for the browser.


# apmn-moddle

Read and write APMN diagram files in NodeJS and the browser.

__apmn-moddle__ uses the [APMN meta-model](http://apmn.io/spec/APMN/) to validate the input and produce correct APMN XML. The library is built on top of [moddle](https://github.com/bpmn-io/moddle) and [moddle-xml](https://github.com/bpmn-io/moddle-xml).


## Usage

Get the library via [npm package](https://www.npmjs.org/package/apmn-moddle). Bundle it for the web using [webpack](https://webpack.github.io).

```javascript
import ApmnModdle from 'apmn-moddle';

var moddle = new ApmnModdle();

var xmlStr =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<apmn:definitions xmlns:apmn="http://apmn/spec/APMN/MODEL" ' +
                     'id="empty-definitions" ' +
                     'targetNamespace="http://apmn.io/schema/apmn">' +
  '</apmn:definitions>';


moddle.fromXML(xmlStr, function(err, definitions) {

  // update id attribute
  definitions.set('id', 'NEW ID');

  // add a root element
  var apmnProcess = moddle.create('apmn:Process', { id: 'MyProcess_1' });
  definitions.get('rootElements').push(apmnProcess);

  moddle.toXML(definitions, function(err, xmlStrUpdated) {

    // xmlStrUpdated contains new id and the added process

  });

});
```


## Resources

* [Issues](https://github.com/apmn-io/apmn-moddle/issues)
* [Examples](https://github.com/apmn-io/apmn-moddle/tree/master/test/spec/xml)
* [Changelog](./CHANGELOG.md)


## Building the Project

To run the test suite that includes XSD schema validation you must have a Java JDK installed and properly exposed through the `JAVA_HOME` variable.

Execute the test via

```
npm test
```

Perform a complete build of the application via

```
npm run all
```


## License

Use under the terms of the [MIT license](http://opensource.org/licenses/MIT).
