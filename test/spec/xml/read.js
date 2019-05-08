import expect from '../../expect';

import {
  createModdle,
  readFile
} from '../../helper';


describe('apmn-moddle - read', function() {

  var moddle = createModdle();

  function read(xml, root, opts, callback) {
    return moddle.fromXML(xml, root, opts, callback);
  }

  function fromFile(file, root, opts, callback) {
    var contents = readFile(file);
    return read(contents, root, opts, callback);
  }


  describe('should import types', function() {

    describe('apmn', function() {

      it('SubProcess#flowElements', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/sub-process-flow-nodes.part.bpmn', 'apmn:SubProcess', function(err, result) {

          var expected = {
            $type: 'apmn:SubProcess',
            id: 'SubProcess_1',
            name: 'Sub Process 1',

            flowElements: [
              { $type: 'apmn:StartEvent', id: 'StartEvent_1', name: 'Start Event 1' },
              { $type: 'apmn:Task', id: 'Task_1', name: 'Task' },
              { $type: 'apmn:SequenceFlow', id: 'SequenceFlow_1', name: '' }
            ]
          };

          // then
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('SubProcess#flowElements (nested references)', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/sub-process.part.bpmn', 'apmn:SubProcess', function(err, result) {

          var expected = {
            $type: 'apmn:SubProcess',
            id: 'SubProcess_1',
            name: 'Sub Process 1',

            flowElements: [
              { $type: 'apmn:StartEvent', id: 'StartEvent_1', name: 'Start Event 1' },
              { $type: 'apmn:Task', id: 'Task_1', name: 'Task' },
              { $type: 'apmn:SequenceFlow', id: 'SequenceFlow_1', name: '' }
            ]
          };

          // then
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('CompensateEventDefinition', function(done) {

        // when
        fromFile('test/fixtures/bpmn/compensate-event-definition.part.bpmn', 'apmn:CompensateEventDefinition', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'apmn:CompensateEventDefinition'
          });

          expect(result.waitForCompletion).to.be.true;

          done(err);
        });
      });


      it('SubProcess#incoming', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/subprocess-flow-nodes-outgoing.part.bpmn', 'apmn:Process', function(err, result) {

          var expectedSequenceFlow = {
            $type: 'apmn:SequenceFlow',
            id: 'SequenceFlow_1'
          };

          var expectedSubProcess = {
            $type: 'apmn:SubProcess',
            id: 'SubProcess_1',
            name: 'Sub Process 1',

            flowElements: [
              { $type: 'apmn:Task', id: 'Task_1', name: 'Task' }
            ]
          };

          var expected = {
            $type: 'apmn:Process',
            flowElements: [
              expectedSubProcess,
              expectedSequenceFlow
            ]
          };

          // then
          expect(result).to.jsonEqual(expected);


          var subProcess = result.flowElements[0];
          var sequenceFlow = result.flowElements[1];

          // expect correctly resolved references
          expect(subProcess.incoming).to.jsonEqual([ expectedSequenceFlow ]);
          expect(subProcess.outgoing).to.jsonEqual([ expectedSequenceFlow ]);

          expect(sequenceFlow.sourceRef).to.jsonEqual(expectedSubProcess);
          expect(sequenceFlow.targetRef).to.jsonEqual(expectedSubProcess);

          done(err);
        });
      });


      it('TimerEventDefinition#expression', function(done) {

        // given
        var file = 'test/fixtures/bpmn/timerEventDefinition.part.bpmn';

        // when
        fromFile(file, 'apmn:TimerEventDefinition', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'apmn:TimerEventDefinition',
            id: 'Definition_1',
            timeCycle: {
              $type: 'apmn:FormalExpression',
              id: 'TimeCycle_1',
              body: '1w'
            }
          });

          done(err);
        });

      });


      it('Documentation', function(done) {

        // when
        fromFile('test/fixtures/bpmn/documentation.bpmn', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'apmn:Definitions',
            id: 'documentation',
            targetNamespace: 'http://apmn.io/schema/apmn',
            rootElements: [
              {
                $type: 'apmn:Process',
                id: 'Process_1',
                documentation: [
                  { $type : 'apmn:Documentation', text : 'THIS IS A PROCESS' }
                ],
                flowElements: [
                  {
                    $type : 'apmn:SubProcess',
                    id: 'SubProcess_1',
                    name : 'Sub Process 1',
                    documentation : [
                      {
                        $type : 'apmn:Documentation',
                        text : '\n        <h1>THIS IS HTML</h1>\n      '
                      }
                    ]
                  }
                ]
              }
            ]
          });

          done(err);
        });

      });


      it('ThrowEvent#dataInputAssociations', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/throw-event-dataInputAssociations.part.bpmn', 'apmn:EndEvent', function(err, result) {

          var expected = {
            $type: 'apmn:EndEvent',
            id: 'EndEvent_1',

            dataInputAssociations: [
              { $type: 'apmn:DataInputAssociation', id: 'DataInputAssociation_1' }
            ]
          };

          // then
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('CatchEvent#dataOutputAssociations', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/catch-event-dataOutputAssociations.part.bpmn', 'apmn:StartEvent', function(err, result) {

          var expected = {
            $type: 'apmn:StartEvent',
            id: 'StartEvent_1',

            dataOutputAssociations: [
              { $type: 'apmn:DataOutputAssociation', id: 'DataOutputAssociation_1' }
            ]
          };

          // then
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('Escalation + Error', function(done) {

        // when
        fromFile('test/fixtures/bpmn/escalation-error.bpmn', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'apmn:Definitions',
            id: 'test',
            targetNamespace: 'http://apmn.io/schema/apmn',
            rootElements: [
              { $type : 'apmn:Escalation', id : 'escalation' },
              { $type : 'apmn:Error', id : 'error' }
            ]
          });

          done(err);
        });
      });


      it('ExtensionElements', function(done) {

        // when
        fromFile('test/fixtures/bpmn/extension-elements.bpmn', function(err, result) {

          expect(result).to.jsonEqual({
            $type: 'apmn:Definitions',
            id: 'test',
            targetNamespace: 'http://apmn.io/schema/apmn',
            extensionElements: {
              $type : 'apmn:ExtensionElements',
              values : [
                { $type: 'vendor:info', key: 'bgcolor', value: '#ffffff' },
                { $type: 'vendor:info', key: 'role', value: '[]' }
              ]
            }
          });

          done(err);
        });
      });


      it('ScriptTask', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/scriptTask-script.part.bpmn', 'apmn:ScriptTask', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'apmn:ScriptTask',
            id : 'ScriptTask_4',
            scriptFormat: 'Javascript',
            script: 'context.set("FOO", "BAR");'
          });

          done(err);
        });
      });


      it('CallActivity#calledElement', function(done) {

        // when
        fromFile('test/fixtures/bpmn/callActivity-calledElement.part.bpmn', 'apmn:CallActivity', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'apmn:CallActivity',
            id: 'CallActivity_1',
            calledElement: 'otherProcess'
          });

          done(err);
        });
      });


      it('ItemDefinition#structureRef', function(done) {

        // when
        fromFile('test/fixtures/bpmn/itemDefinition-structureRef.part.bpmn', 'apmn:ItemDefinition', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'apmn:ItemDefinition',
            id: 'itemDefinition',
            structureRef: 'foo:Service'
          });

          done(err);
        });
      });


      it('Operation#implementationRef', function(done) {

        // when
        fromFile('test/fixtures/bpmn/operation-implementationRef.part.bpmn', 'apmn:Operation', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'apmn:Operation',
            id: 'operation',
            implementationRef: 'foo:operation'
          });

          done(err);
        });
      });


      it('Interface#implementationRef', function(done) {

        // when
        fromFile('test/fixtures/bpmn/interface-implementationRef.part.bpmn', 'apmn:Interface', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'apmn:Interface',
            id: 'interface',
            implementationRef: 'foo:interface'
          });

          done(err);
        });
      });


      it('Lane#childLaneSet', function(done) {

        // when
        fromFile('test/fixtures/bpmn/lane-childLaneSets.part.bpmn', 'apmn:Lane', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'apmn:Lane',
            id: 'Lane_1',
            name: 'Lane',
            childLaneSet: {
              $type: 'apmn:LaneSet',
              id: 'LaneSet_2',
              lanes: [
                {
                  $type: 'apmn:Lane',
                  id: 'Lane_2',
                  name: 'Nested Lane'
                }
              ]
            }
          });

          done(err);
        });
      });


      it('SequenceFlow#conditionExpression', function(done) {

        // when
        fromFile('test/fixtures/bpmn/sequenceFlow-conditionExpression.part.bpmn', 'apmn:SequenceFlow', function(err, result) {

          if (err) {
            return done(err);
          }

          // then
          expect(result).to.jsonEqual({
            $type: 'apmn:SequenceFlow',
            id: 'SequenceFlow_1',
            conditionExpression: {
              $type: 'apmn:FormalExpression',
              body: '${foo > bar}'
            }
          });

          done(err);
        });
      });


      it('Category', function(done) {

        // when
        fromFile('test/fixtures/bpmn/category.bpmn', function(err, result) {

          if (err) {
            return done(err);
          }

          var category = result.rootElements[0];

          // then
          expect(category).to.jsonEqual({
            $type: 'apmn:Category',
            id: 'sid-ccc7e63e-916e-4bd0-a9f0-98cbff749195',
            categoryValue: [
              {
                $type: 'apmn:CategoryValue',
                id: 'sid-afd7e63e-916e-4bd0-a9f0-98cbff749193',
                value: 'group with label'
              }
            ]
          });

          done(err);
        });
      });


      it('MultiInstanceLoopCharacteristics#completionCondition', function(done) {

        // when
        fromFile('test/fixtures/bpmn/multiInstanceLoopCharacteristics-completionCondition.part.bpmn', 'apmn:MultiInstanceLoopCharacteristics', function(err, result) {

          if (err) {
            return done(err);
          }

          // then
          expect(result).to.jsonEqual({
            $type: 'apmn:MultiInstanceLoopCharacteristics',
            completionCondition: {
              $type: 'apmn:FormalExpression',
              body: '${foo > bar}'
            }
          });

          done(err);
        });
      });


      it('Operation#messageRef', function(done) {

        // when
        fromFile('test/fixtures/bpmn/operation-messageRef.bpmn', 'apmn:Definitions', function(err, result, context) {

          var inMessage = {
            property: 'apmn:inMessageRef',
            id: 'fooInMessage',
            element: { $type: 'apmn:Operation', id: 'operation', name: 'foo' }
          };

          var outMessage = {
            property: 'apmn:outMessageRef',
            id: 'fooOutMessage',
            element: { $type: 'apmn:Operation', id: 'operation', name: 'foo' }
          };

          var references = context.references;

          // then
          expect(references).to.jsonEqual([ inMessage, outMessage ]);

          done(err);
        });
      });


      it('Association#associationDirection', function(done) {

        // when
        fromFile('test/fixtures/bpmn/association.part.bpmn', 'apmn:Association', function(err, result, context) {

          // then
          expect(result).to.jsonEqual({
            '$type': 'apmn:Association',
            associationDirection: 'None',
            id: 'association'
          });

          done(err);
        });

      });

    });


    describe('apmndi', function() {

      it('Extensions', function(done) {

        // when
        fromFile('test/fixtures/bpmn/di/bpmnDiagram-extension.part.bpmn', 'apmndi:APMNDiagram', function(err, result) {

          if (err) {
            return done(err);
          }

          var expected = {
            $type: 'apmndi:APMNDiagram',
            id: 'BPMNDiagram_1',
            plane: {
              $type: 'apmndi:APMNPlane',
              id: 'BPMNPlane_1',
              extension: {
                $type: 'di:Extension',
                values: [
                  {
                    $type: 'vendor:baz',
                    baz: 'BAZ'
                  }
                ]
              },
              planeElement: [
                {
                  $type: 'apmndi:APMNShape',
                  id: 'BPMNShape_1',
                  extension: {
                    $type: 'di:Extension',
                    values: [
                      {
                        $type: 'vendor:bar',
                        $body: 'BAR'
                      }
                    ]
                  }
                },
                {
                  $type: 'apmndi:APMNEdge',
                  id: 'BPMNEdge_1',
                  extension: {
                    $type: 'di:Extension'
                  }
                }
              ]
            }
          };

          // then
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('APMNShape#bounds (non-ns-attributes)', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/di/bpmnShape.part.bpmn', 'apmndi:APMNShape', function(err, result) {

          var expected = {
            $type: 'apmndi:APMNShape',
            id: 'BPMNShape_1',
            isExpanded: true,
            bounds: { $type: 'dc:Bounds', height: 300.0, width: 300.0, x: 300.0, y: 80.0 }
          };

          // then
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('APMNEdge#waypoint', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/di/bpmnEdge-waypoint.part.bpmn', 'apmndi:APMNEdge', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'apmndi:APMNEdge',
            id : 'sid-2365FF07-4092-4B79-976A-AD192FE4E4E9_gui',
            waypoint: [
              { $type: 'dc:Point', x: 4905.0, y: 1545.0 },
              { $type: 'dc:Point', x: 4950.0, y: 1545.0 }
            ]
          });

          done(err);
        });
      });


      it('Participant#participantMultiplicity', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/participantMultiplicity.part.bpmn', 'apmn:Participant', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'apmn:Participant',
            participantMultiplicity: {
              $type: 'apmn:ParticipantMultiplicity',
              id: 'sid-a4e85590-bd67-418d-a617-53bcfcfde620',
              maximum: 2,
              minimum: 2
            }
          });

          done(err);
        });
      });


      it('APMNEdge#waypoint (explicit xsi:type)', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/di/bpmnEdge.part.bpmn', 'apmndi:APMNEdge', function(err, result) {

          var expected = {
            $type: 'apmndi:APMNEdge',
            id: 'BPMNEdge_1',
            waypoint: [
              { $type: 'dc:Point', x: 388.0, y: 260.0 },
              { $type: 'dc:Point', x: 420.0, y: 260.0 }
            ]
          };

          // then
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('APMNDiagram (nested elements)', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/di/bpmnDiagram.part.bpmn', 'apmndi:APMNDiagram', function(err, result) {

          var expected = {
            $type: 'apmndi:APMNDiagram',
            id: 'BPMNDiagram_1',
            plane: {
              $type: 'apmndi:APMNPlane',
              id: 'BPMNPlane_1',
              planeElement: [
                {
                  $type: 'apmndi:APMNShape',
                  id: 'BPMNShape_1',
                  isExpanded: true,
                  bounds: { $type: 'dc:Bounds', height: 300.0, width: 300.0, x: 300.0, y: 80.0 }
                },
                {
                  $type: 'apmndi:APMNEdge',
                  id: 'BPMNEdge_1',
                  waypoint: [
                    { $type: 'dc:Point', x: 388.0, y: 260.0 },
                    { $type: 'dc:Point', x: 420.0, y: 260.0 }
                  ]
                }
              ]
            }
          };

          // then
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });

    });

  });


  describe('should import references', function() {

    it('via attributes', function(done) {

      // given
      var xml = '<apmn:sequenceFlow xmlns:apmn="http://apmn.io/spec/APMN/MODEL" sourceRef="FOO_BAR" />';

      // when
      read(xml, 'apmn:SequenceFlow', function(err, result, context) {

        var expectedReference = {
          element: {
            $type: 'apmn:SequenceFlow'
          },
          property: 'apmn:sourceRef',
          id: 'FOO_BAR'
        };

        var references = context.references;

        // then
        expect(references).to.jsonEqual([ expectedReference ]);

        done(err);
      });
    });


    it('via elements', function(done) {

      // given
      var xml =
        '<apmn:serviceTask xmlns:apmn="http://apmn.io/spec/APMN/MODEL">' +
          '<apmn:outgoing>OUT_1</apmn:outgoing>' +
          '<apmn:outgoing>OUT_2</apmn:outgoing>' +
        '</apmn:serviceTask>';

      // when
      read(xml, 'apmn:ServiceTask', function(err, result, context) {

        var reference1 = {
          property: 'apmn:outgoing',
          id: 'OUT_1',
          element: { $type: 'apmn:ServiceTask' }
        };

        var reference2 = {
          property: 'apmn:outgoing',
          id: 'OUT_2',
          element: { $type: 'apmn:ServiceTask' }
        };

        var references = context.references;

        // then
        expect(references).to.jsonEqual([ reference1, reference2 ]);

        done(err);
      });
    });
  });


  describe('should import extensions', function() {

    it('attributes on root', function(done) {

      // given
      var xml = '<apmn:sequenceFlow xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                                   'xmlns:foo="http://foobar" foo:bar="BAR" />';

      // when
      read(xml, 'apmn:SequenceFlow', function(err, result, context) {

        // then
        expect(result.$attrs['foo:bar']).to.eql('BAR');

        done(err);
      });

    });


    it('elements via apmn:extensionElements', function(done) {

      // when
      fromFile('test/fixtures/bpmn/extension-elements.bpmn', function(err, result) {

        expect(result).to.jsonEqual({
          $type: 'apmn:Definitions',
          id: 'test',
          targetNamespace: 'http://apmn.io/schema/apmn',
          extensionElements: {
            $type : 'apmn:ExtensionElements',
            values : [
              { $type: 'vendor:info', key: 'bgcolor', value: '#ffffff' },
              { $type: 'vendor:info', key: 'role', value: '[]' }
            ]
          }
        });

        done(err);
      });

    });

  });


  describe('should read xml documents', function() {

    it('empty definitions', function(done) {

      // given

      // when
      fromFile('test/fixtures/bpmn/empty-definitions.bpmn', function(err, result) {

        var expected = {
          $type: 'apmn:Definitions',
          id: 'empty-definitions',
          targetNamespace: 'http://apmn.io/schema/apmn'
        };

        // then
        expect(result).to.jsonEqual(expected);

        done(err);
      });
    });


    it('empty definitions (default ns)', function(done) {

      // given

      // when
      fromFile('test/fixtures/bpmn/empty-definitions-default-ns.bpmn', function(err, result) {

        var expected = {
          $type: 'apmn:Definitions',
          id: 'empty-definitions',
          targetNamespace: 'http://apmn.io/schema/apmn'
        };

        // then
        expect(result).to.jsonEqual(expected);

        done(err);
      });
    });


    it('simple process', function(done) {

      // given

      // when
      fromFile('test/fixtures/bpmn/simple.bpmn', function(err, result) {

        // then
        expect(result.id).to.equal('simple');

        done(err);
      });
    });


    it('simple process (default ns)', function(done) {

      // given

      // when
      fromFile('test/fixtures/bpmn/simple-default-ns.bpmn', function(err, result) {

        expect(result.id).to.equal('simple');

        done(err);
      });
    });

  });


  describe('should handle errors', function() {

    it('when importing non-xml text', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/no-xml.txt', function(err, result) {

        expect(err).to.exist;

        done();
      });
    });


    it('when importing non-apmn xml', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/not-bpmn.bpmn', function(err, result, context) {

        var warnings = context.warnings;
        var warning = warnings[0];

        expect(err).to.exist;
        expect(err.message).to.match(/failed to parse document as <apmn:Definitions>/);

        expect(result).not.to.exist;

        expect(warnings).to.have.length(1);
        expect(warning.message).to.match(/unparsable content <definitions> detected/);

        done();
      });
    });


    it('when importing binary', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/binary.png', function(err, result) {

        expect(err).to.exist;

        done();
      });

    });


    it('when importing apmn:Extension (missing definition)', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/extension-definition-missing.bpmn', function(err, result, context) {

        var warnings = context.warnings;

        // then
        expect(warnings).to.have.length(1);

        expect(warnings[0].message).to.eql('unresolved reference <ino:tInnovator>');

        expect(err).not.to.exist;

        done();
      });
    });


    it('when importing invalid apmn', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/undeclared-ns-child.bpmn', function(err, result, context) {

        var warnings = context.warnings;

        expect(err).not.to.exist;
        expect(warnings).to.have.length(1);

        done();
      });
    });


    it('when importing invalid categoryValue / reference', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/categoryValue.bpmn', function(err, result, context) {

        var warnings = context.warnings;

        // then
        expect(err).not.to.exist;

        // wrong <categoryValue> + unresolvable reference
        expect(warnings).to.have.length(2);

        var invalidElementWarning = warnings[0];
        var unresolvableReferenceWarning = warnings[1];

        expect(invalidElementWarning.message).to.eql(
          'unparsable content <categoryValue> detected\n\t' +
              'line: 2\n\t' +
              'column: 2\n\t' +
              'nested error: unrecognized element <apmn:categoryValue>');

        expect(unresolvableReferenceWarning.message).to.eql(
          'unresolved reference <sid-afd7e63e-916e-4bd0-a9f0-98cbff749193>');

        done();
      });
    });


    it('when importing valid apmn / unrecognized element', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/unrecognized-child.bpmn', function(err, result, context) {

        var warnings = context.warnings;

        expect(err).not.to.exist;
        expect(warnings).to.have.length(1);

        done();
      });
    });


    it('when importing duplicate ids', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/duplicate-ids.bpmn', function(err, result, context) {

        var warnings = context.warnings;

        expect(err).not.to.exist;
        expect(warnings).to.have.length(1);
        expect(warnings[0].message).to.contain('duplicate ID <test>');

        done();
      });
    });


    it('when importing non UTF-8 files', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/bad-encoding.bpmn', function(err, result, context) {

        var warnings = context.warnings;

        expect(err).not.to.exist;
        expect(warnings).to.have.length(1);
        expect(warnings[0].message).to.match(/unsupported document encoding <windows-1252>/);

        done();
      });

    });


    it('when importing broken diagram / xmlns redeclaration', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/xmlns-redeclaration.bpmn', function(err, result, context) {

        expect(err).not.to.exist;

        expect(context.warnings).to.have.length(2);
        expect(context.warnings[0].message).to.match(/attribute <xmlns> already defined/);
        expect(context.warnings[1].message).to.match(/attribute <id> already defined/);

        expect(result.$attrs.xmlns).to.eql('http://apmn.io/spec/APMN/MODEL');
        expect(result.id).to.eql('10');

        done();
      });
    });


    it('when importing invalid attributes', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/invalid-attributes.bpmn', function(err, result, context) {

        expect(err).not.to.exist;

        expect(context.warnings).to.have.length(2);
        expect(context.warnings[0].message).to.match(/illegal first char attribute name/);
        expect(context.warnings[1].message).to.match(/missing attribute value/);

        expect(result.rootElements).to.jsonEqual([
          {
            $type: 'apmn:Process',
            id: 'Process_1'
          }
        ]);

        done();
      });
    });

  });


  describe('should read attributes', function() {

    it('when importing non-xml text', function(done) {

      // when
      fromFile('test/fixtures/bpmn/attrs.bpmn', function(err, result, context) {

        var warnings = context.warnings;

        expect(err).not.to.exist;
        expect(warnings).to.have.length(1);

        expect(warnings[0].message).to.match(
          /illegal first char attribute name/
        );

        expect(result.$attrs).to.jsonEqual({
          'xmlns:bpmn2': 'http://apmn.io/spec/APMN/MODEL',
          'xmlns:color_1.0': 'http://colors',
          'xmlns:.color': 'http://colors'
        });

        expect(result).to.jsonEqual({
          $type: 'apmn:Definitions'
        });

        done();
      });
    });

  });

});
