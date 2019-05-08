import expect from '../../expect';

import {
  createModdle
} from '../../helper';

import {
  fromValidFile,
  fromFilePart,
  toXML,
  validate
} from '../../xml-helper';


describe('apmn-moddle - roundtrip', function() {

  var moddle = createModdle();

  function fromFile(file, done) {
    fromValidFile(moddle, file, done);
  }


  describe('should serialize valid APMN xml after read', function() {

    this.timeout(15000);


    it('home-made apmn model', function(done) {

      var definitions = moddle.create('apmn:Definitions', { targetNamespace: 'http://foo' });

      var processElement = moddle.create('apmn:Process');
      var serviceTask = moddle.create('apmn:ServiceTask', { name: 'MyService Task' });

      processElement.get('flowElements').push(serviceTask);
      definitions.get('rootElements').push(processElement);

      // when
      toXML(definitions, { format: true }, function(err, xml) {

        // then
        validate(err, xml, done);
      });
    });


    it('obscure ids model', function(done) {

      var definitions = moddle.create('apmn:Definitions', {
        'xmlns:foo': 'http://foo-ns',
        targetNamespace: 'http://foo',
        rootElements: [
          moddle.create('apmn:Message', { id: 'foo_bar' }),
          moddle.create('apmn:Message', { id: 'foo-bar' }),
          moddle.create('apmn:Message', { id: 'foo1bar' }),
          moddle.create('apmn:Message', { id: 'Foo1bar' }),
          moddle.create('apmn:Message', { id: '_foo_bar' }),
          moddle.create('apmn:Message', { id: '_foo-bar' }),
          moddle.create('apmn:Message', { id: '_11' })
          // invalid
          // moddle.create('apmn:Message', { id: '-foo-bar' }),
          // moddle.create('apmn:Message', { id: 'foo:_foo_bar' }),
          // moddle.create('apmn:Message', { id: '1foo_bar' })
        ]
      });

      // when
      toXML(definitions, { format: true }, function(err, xml) {

        // then
        validate(err, xml, done);
      });
    });


    it('ioSpecification', function(done) {

      // given
      var definitions = moddle.create('apmn:Definitions', { targetNamespace: 'http://foo' });

      var processElement = moddle.create('apmn:Process');

      var dataInput = moddle.create('apmn:DataInput', { id: 'DataInput_FOO' });

      var inputSet = moddle.create('apmn:InputSet', {
        dataInputRefs: [ dataInput ]
      });

      var outputSet = moddle.create('apmn:OutputSet');

      var ioSpecification = moddle.create('apmn:InputOutputSpecification', {
        inputSets: [ inputSet ],
        outputSets: [ outputSet ],
        dataInputs: [ dataInput ]
      });

      var serviceTask = moddle.create('apmn:ServiceTask', {
        name: 'MyService Task',
        ioSpecification: ioSpecification
      });

      processElement.get('flowElements').push(serviceTask);
      definitions.get('rootElements').push(processElement);

      // when
      toXML(definitions, { format: true }, function(err, xml) {

        // then
        validate(err, xml, done);
      });
    });


    it('properties', function(done) {

      // given
      var definitions = moddle.create('apmn:Definitions', { targetNamespace: 'http://foo' });

      var processElement = moddle.create('apmn:Process');

      var property = moddle.create('apmn:Property', {
        id: 'Property_112',
        name: '__targetRef_placeholder'
      });

      var serviceTask = moddle.create('apmn:ServiceTask', {
        name: 'MyService Task',
        properties: [ property ]
      });

      processElement.get('flowElements').push(serviceTask);
      definitions.get('rootElements').push(processElement);

      // when
      toXML(definitions, { format: true }, function(err, xml) {

        // then
        validate(err, xml, done);
      });
    });


    it('extension attributes', function(done) {

      // given
      fromFile('test/fixtures/bpmn/extension-attributes.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('extension attributes on expression', function(done) {

      // given
      fromFilePart(moddle, 'test/fixtures/bpmn/expression-extension.part.bpmn', 'apmn:ResourceAssignmentExpression', function(err, result, context) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          expect(xml).to.contain(
            '<bpmn:expression ' +
                'id="ID_0hnlswl" ' +
                'myNs:expressionType="Constant">' +
              'fgdfgdfg' +
            '</bpmn:expression>'
          );

          validate(err, xml, done);
        });
      });
    });


    it('multi instance loop characteristics', function(done) {

      // given
      fromFile('test/fixtures/bpmn/multiInstanceLoopCharacteristics.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('Expression without xsi:type', function(done) {

      // given
      fromFile('test/fixtures/bpmn/expression-plain.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          if (err) {
            return done(err);
          }

          // we are serializing xsi:type, even though
          // it is the default
          expect(xml).not.to.contain('xsi:type="apmn:tExpression');

          validate(err, xml, done);
        });
      });

    });


    it('documentation / extensionElements order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/documentation-extension-elements.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('activity children order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/activity-children.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('lane children order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/lane-children.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('conversation children order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/conversation-children.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('process children order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/process-children.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('definitions children order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/definitions-children.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('ioSpecification children order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/inputOutputSpecification-children.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('Participant#interfaceRef', function(done) {

      // given
      fromFile('test/fixtures/bpmn/participant-interfaceRef.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('ResourceRole#resourceRef', function(done) {

      // given
      fromFile('test/fixtures/bpmn/potentialOwner.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('Operation#messageRef', function(done) {

      // given
      fromFile('test/fixtures/bpmn/operation-messageRef.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          // then
          expect(xml).to.contain('<bpmn:inMessageRef>fooInMessage</bpmn:inMessageRef>');

          validate(err, xml, done);
        });
      });
    });


    it('di extensions', function(done) {

      // given
      fromFile('test/fixtures/bpmn/di-extension.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          expect(xml).to.contain('<vendor:baz baz="BAZ" />');
          expect(xml).to.contain('<vendor:bar>BAR</vendor:bar>');
          expect(xml).to.contain('<di:extension />');

          validate(err, xml, done);
        });
      });
    });


    it('complex processElement / extensionElements', function(done) {

      // given
      fromFile('test/fixtures/bpmn/complex.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('category', function(done) {

      // given
      fromFile('test/fixtures/bpmn/category.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          expect(xml).to.contain('sid-afd7e63e-916e-4bd0-a9f0-98cbff749193');
          expect(xml).to.contain('group with label');

          validate(err, xml, done);
        });
      });

    });


    it('choreography task', function(done) {

      // given
      fromFile('test/fixtures/bpmn/choreography-task.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          validate(err, xml, done);
        });
      });

    });


    it('simple processElement', function(done) {

      // given
      fromFile('test/fixtures/bpmn/simple.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('xsi:type', function(done) {

      // given
      fromFile('test/fixtures/bpmn/xsi-type.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('colors', function(done) {

      fromFile('test/fixtures/bpmn/example-colors.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          validate(err, xml, done);
        });
      });
    });


    it('nested default namespace prefix', function(done) {

      // given
      fromFile('test/fixtures/bpmn/nested-default-namespace-prefix.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          if (err) {
            return done(err);
          }

          // then
          expect(xml).to.contain('<Entry key="A" value="B" />');

          validate(err, xml, done);
        });
      });
    });


    it('nested elements no (default) namespace prefix', function(done) {

      // given
      fromFile('test/fixtures/bpmn/nested-no-namespace-prefix.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          if (err) {
            return done(err);
          }

          // then
          expect(xml).to.contain('<Entry key="A" value="B" />');

          validate(err, xml, done);
        });
      });
    });


    it('conflicting ns prefix', function(done) {

      // given
      fromFile('test/fixtures/bpmn/namespace-prefix-collision.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          if (err) {
            return done(err);
          }

          // then
          validate(err, xml, done);
        });
      });
    });

  });


  describe('vendor', function() {

    describe('signavio', function() {

      it('complex processElement', function(done) {

        // given
        fromFile('test/fixtures/bpmn/vendor/signavio-complex-no-extensions.bpmn', function(err, result) {

          if (err) {
            return done(err);
          }

          // when
          toXML(result, { format: true }, function(err, xml) {
            validate(err, xml, done);
          });
        });
      });

    });


    describe('yaoqiang', function() {

      it('event definitions', function(done) {

        // given
        fromFile('test/fixtures/bpmn/vendor/yaoqiang-event-definitions.bpmn', function(err, result, context) {

          if (err) {
            return done(err);
          }

          var warningsStr = context.warnings.map(function(w) {
            return '\n\t- ' + w.message;
          }).join('');

          if (warningsStr) {
            return done(new Error('import warnings: ' + warningsStr));
          }

          // when
          toXML(result, { format: true }, function(err, xml) {
            validate(err, xml, done);
          });
        });
      });

    });


    describe('bizagi', function() {

      it('event definitions', function(done) {

        // given
        fromFile('test/fixtures/bpmn/vendor/bizagi-nested-ns-definition.bpmn', function(err, result, context) {

          if (err) {
            return done(err);
          }

          var warningsStr = context.warnings.map(function(w) {
            return '\n\t- ' + w.message;
          }).join('');

          if (warningsStr) {
            return done(new Error('import warnings: ' + warningsStr));
          }

          // when
          toXML(result, { format: true }, function(err, xml) {
            validate(err, xml, done);
          });
        });
      });

    });

  });

});
