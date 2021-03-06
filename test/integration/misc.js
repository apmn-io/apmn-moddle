import expect from '../expect';

import {
  createModdle,
  readFile
} from '../helper';

import droolsPackage from '../fixtures/json/model/drools';

import {
  assign,
  isFunction
} from 'min-dash';


describe('apmn-moddle - integration', function() {

  describe('drools:import element', function() {

    var moddle = createModdle({ drools: droolsPackage });

    function read(xml, root, opts, callback) {
      return moddle.fromXML(xml, root, opts, callback);
    }

    function fromFile(file, root, opts, callback) {
      var contents = readFile('test/fixtures/bpmn/' + file);
      return read(contents, root, opts, callback);
    }

    function write(element, options, callback) {
      if (isFunction(options)) {
        callback = options;
        options = {};
      }

      // skip preamble for tests
      options = assign({ preamble: false }, options);

      moddle.toXML(element, options, callback);
    }


    it('should import', function(done) {

      // when
      fromFile('extension/drools.part.bpmn', 'apmn:Process', function(err, result) {

        var expected = {
          $type: 'apmn:Process',
          id: 'Evaluation',
          isExecutable: false,
          extensionElements: {
            $type: 'apmn:ExtensionElements',
            values: [
              {
                $type: 'drools:Import',
                name: 'com.example.model.User'
              }
            ]
          }
        };

        // then
        expect(result).to.jsonEqual(expected);

        done(err);
      });

    });


    it('should export', function(done) {

      // given
      var importElement = moddle.create('drools:Import', {
        name: 'com.example.model.User'
      });

      var processElement = moddle.create('apmn:Process', {
        extensionElements: moddle.create('apmn:ExtensionElements', {
          values: [
            importElement
          ]
        })
      });

      var expectedXML =
        '<apmn:process xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                      'xmlns:drools="http://www.jboss.org/drools">' +
          '<apmn:extensionElements>' +
            '<drools:import name="com.example.model.User" />' +
          '</apmn:extensionElements>' +
        '</apmn:process>';

      // when
      write(processElement, function(err, result) {

        if (err) {
          return done(err);
        }

        // then
        expect(result).to.eql(expectedXML);

        done(err);
      });
    });

  });

});