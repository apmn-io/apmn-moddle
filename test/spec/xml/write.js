import expect from '../../expect';

import {
  assign,
  isFunction
} from 'min-dash';

import {
  createModdle
} from '../../helper';


describe('apmn-moddle - write', function() {

  var moddle = createModdle();


  function write(element, options, callback) {
    if (isFunction(options)) {
      callback = options;
      options = {};
    }

    // skip preamble for tests
    options = assign({ preamble: false }, options);

    moddle.toXML(element, options, callback);
  }



  describe('should export types', function() {

    describe('apmn', function() {

      it('Definitions (empty)', function(done) {

        // given
        var definitions = moddle.create('apmn:Definitions');

        var expectedXML =
          '<apmn:definitions xmlns:apmn="http://apmn.io/spec/APMN/MODEL" />';

        // when
        write(definitions, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('Definitions (participant + interface)', function(done) {

        // given
        var interfaceElement = moddle.create('apmn:Interface', {
          id: 'Interface_1'
        });

        var participantElement = moddle.create('apmn:Participant', {
          id: 'Process_1',
          interfaceRef: [
            interfaceElement
          ]
        });

        var collaborationElement = moddle.create('apmn:Collaboration', {
          participants: [
            participantElement
          ]
        });

        var definitions = moddle.create('apmn:Definitions', {
          targetNamespace: 'http://apmn.io/apmn',
          rootElements: [
            interfaceElement,
            collaborationElement
          ]
        });

        var expectedXML =
          '<apmn:definitions xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                  'targetNamespace="http://apmn.io/apmn">' +
            '<apmn:interface id="Interface_1" />' +
            '<apmn:collaboration>' +
              '<apmn:participant id="Process_1">' +
                '<apmn:interfaceRef>Interface_1</apmn:interfaceRef>' +
              '</apmn:participant>' +
            '</apmn:collaboration>' +
          '</apmn:definitions>';

        // when
        write(definitions, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('ScriptTask#script', function(done) {

        // given
        var scriptTask = moddle.create('apmn:ScriptTask', {
          id: 'ScriptTask_1',
          scriptFormat: 'JavaScript',
          script: 'context.set("FOO", "&nbsp;");'
        });

        var expectedXML =
          '<apmn:scriptTask xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                           'id="ScriptTask_1" scriptFormat="JavaScript">' +
            '<apmn:script>context.set("FOO", "&amp;nbsp;");</apmn:script>' +
          '</apmn:scriptTask>';

        // when
        write(scriptTask, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('Task with null property', function(done) {

        // given
        var task = moddle.create('apmn:Task', {
          id: 'Task_1',
          default: null
        });

        // when
        var expectedXML =
          '<apmn:task xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                           'id="Task_1" />';

        // then
        write(task, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('SequenceFlow#conditionExpression', function(done) {

        // given
        var sequenceFlow = moddle.create('apmn:SequenceFlow', {
          id: 'SequenceFlow_1'
        });

        sequenceFlow.conditionExpression = moddle.create('apmn:FormalExpression', { body: '${ foo < bar }' });

        var expectedXML =
          '<apmn:sequenceFlow xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                             'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                             'id="SequenceFlow_1">\n' +
          '  <apmn:conditionExpression xsi:type="apmn:tFormalExpression">${ foo &lt; bar }</apmn:conditionExpression>\n' +
          '</apmn:sequenceFlow>\n';

        // when
        write(sequenceFlow, { format: true }, function(err, result) {
          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('MultiInstanceLoopCharacteristics', function(done) {

        // given
        var loopCharacteristics = moddle.create('apmn:MultiInstanceLoopCharacteristics', {
          loopCardinality: moddle.create('apmn:FormalExpression', { body: '${ foo < bar }' }),
          loopDataInputRef: moddle.create('apmn:Property', { id: 'loopDataInputRef' }),
          loopDataOutputRef: moddle.create('apmn:Property', { id: 'loopDataOutputRef' }),
          inputDataItem: moddle.create('apmn:DataInput', { id: 'inputDataItem' }),
          outputDataItem: moddle.create('apmn:DataOutput', { id: 'outputDataItem' }),
          complexBehaviorDefinition: [
            moddle.create('apmn:ComplexBehaviorDefinition', { id: 'complexBehaviorDefinition' })
          ],
          completionCondition: moddle.create('apmn:FormalExpression', { body: '${ done }' }),
          isSequential: true,
          behavior: 'One',
          oneBehaviorEventRef: moddle.create('apmn:CancelEventDefinition', { id: 'oneBehaviorEventRef' }),
          noneBehaviorEventRef: moddle.create('apmn:MessageEventDefinition', { id: 'noneBehaviorEventRef' })
        });

        var expectedXML =
          '<apmn:multiInstanceLoopCharacteristics xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                                                 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                                                 'isSequential="true" ' +
                                                 'behavior="One" ' +
                                                 'oneBehaviorEventRef="oneBehaviorEventRef" ' +
                                                 'noneBehaviorEventRef="noneBehaviorEventRef">' +
              '<apmn:loopCardinality xsi:type="apmn:tFormalExpression">${ foo &lt; bar }</apmn:loopCardinality>' +
              '<apmn:loopDataInputRef>loopDataInputRef</apmn:loopDataInputRef>' +
              '<apmn:loopDataOutputRef>loopDataOutputRef</apmn:loopDataOutputRef>' +
              '<apmn:inputDataItem id="inputDataItem" />' +
              '<apmn:outputDataItem id="outputDataItem" />' +
              '<apmn:complexBehaviorDefinition id="complexBehaviorDefinition" />' +
              '<apmn:completionCondition xsi:type="apmn:tFormalExpression">${ done }</apmn:completionCondition>' +
          '</apmn:multiInstanceLoopCharacteristics>';

        // when
        write(loopCharacteristics, function(err, result) {
          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('StandardLoopCharacteristics', function(done) {

        // given
        var loopCharacteristics = moddle.create('apmn:StandardLoopCharacteristics', {
          testBefore: true,
          loopMaximum: 100,
          loopCondition: moddle.create('apmn:FormalExpression', {
            body: '${ foo < bar }'
          })
        });

        var expectedXML =
          '<apmn:standardLoopCharacteristics xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                                            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                                            'testBefore="true" ' +
                                            'loopMaximum="100">' +
              '<apmn:loopCondition xsi:type="apmn:tFormalExpression">${ foo &lt; bar }</apmn:loopCondition>' +
          '</apmn:standardLoopCharacteristics>';

        // when
        write(loopCharacteristics, function(err, result) {

          if (err) {
            return done(err);
          }

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('Process', function(done) {

        // given
        var processElement = moddle.create('apmn:Process', {
          id: 'Process_1',
          flowElements: [
            moddle.create('apmn:Task', { id: 'Task_1' })
          ],
          properties: [
            moddle.create('apmn:Property', { name: 'foo' })
          ],
          laneSets: [
            moddle.create('apmn:LaneSet', { id: 'LaneSet_1' })
          ],
          monitoring: moddle.create('apmn:Monitoring'),
          artifacts: [
            moddle.create('apmn:TextAnnotation', {
              id: 'TextAnnotation_1',
              text: 'FOOBAR'
            })
          ],
          resources: [
            moddle.create('apmn:PotentialOwner', { name: 'Walter' })
          ]
        });

        var expectedXML =
          '<apmn:process xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                        'id="Process_1">' +
            '<apmn:monitoring />' +
            '<apmn:property name="foo" />' +
            '<apmn:laneSet id="LaneSet_1" />' +
            '<apmn:task id="Task_1" />' +
            '<apmn:textAnnotation id="TextAnnotation_1">' +
              '<apmn:text>FOOBAR</apmn:text>' +
            '</apmn:textAnnotation>' +
            '<apmn:potentialOwner name="Walter" />' +
          '</apmn:process>';

        // when
        write(processElement, function(err, result) {
          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('Activity', function(done) {

        // given
        var activity = moddle.create('apmn:Activity', {
          id: 'Activity_1',
          properties: [
            moddle.create('apmn:Property', { name: 'FOO' }),
            moddle.create('apmn:Property', { name: 'BAR' })
          ],
          resources: [
            moddle.create('apmn:HumanPerformer', { name: 'Walter' } )
          ],
          dataInputAssociations: [
            moddle.create('apmn:DataInputAssociation', { id: 'Input_1' })
          ],
          dataOutputAssociations: [
            moddle.create('apmn:DataOutputAssociation', { id: 'Output_1' })
          ],
          ioSpecification: moddle.create('apmn:InputOutputSpecification')
        });

        var expectedXML =
          '<apmn:activity xmlns:apmn="http://apmn.io/spec/APMN/MODEL" id="Activity_1">' +
            '<apmn:ioSpecification />' +
            '<apmn:property name="FOO" />' +
            '<apmn:property name="BAR" />' +
            '<apmn:dataInputAssociation id="Input_1" />' +
            '<apmn:dataOutputAssociation id="Output_1" />' +
            '<apmn:humanPerformer name="Walter" />' +
          '</apmn:activity>';

        // when
        write(activity, function(err, result) {
          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('BaseElement#documentation', function(done) {

        // given
        var defs = moddle.create('apmn:Definitions', {
          id: 'Definitions_1'
        });

        var docs = defs.get('documentation');

        docs.push(moddle.create('apmn:Documentation', { textFormat: 'xyz', text: 'FOO\nBAR' }));
        docs.push(moddle.create('apmn:Documentation', { text: '<some /><html></html>' }));

        var expectedXML =
          '<apmn:definitions xmlns:apmn="http://apmn.io/spec/APMN/MODEL" id="Definitions_1">' +
             '<apmn:documentation textFormat="xyz">FOO\nBAR</apmn:documentation>' +
             '<apmn:documentation>&lt;some /&gt;&lt;html&gt;&lt;/html&gt;</apmn:documentation>' +
          '</apmn:definitions>';

        // when
        write(defs, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('CallableElement#ioSpecification', function(done) {

        // given
        var callableElement = moddle.create('apmn:CallableElement', {
          id: 'Callable_1',
          ioSpecification: moddle.create('apmn:InputOutputSpecification')
        });

        var expectedXML =
          '<apmn:callableElement xmlns:apmn="http://apmn.io/spec/APMN/MODEL" id="Callable_1">' +
            '<apmn:ioSpecification />' +
          '</apmn:callableElement>';

        // when
        write(callableElement, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done();
        });
      });


      it('ResourceRole#resourceRef', function(done) {

        // given
        var role = moddle.create('apmn:ResourceRole', {
          id: 'Callable_1',
          resourceRef: moddle.create('apmn:Resource', { id: 'REF' })
        });

        var expectedXML =
          '<apmn:resourceRole xmlns:apmn="http://apmn.io/spec/APMN/MODEL" id="Callable_1">' +
            '<apmn:resourceRef>REF</apmn:resourceRef>' +
          '</apmn:resourceRole>';

        // when
        write(role, function(err, result) {

          // then
          expect(err).not.to.exist;

          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('ResourceAssignmentExpression', function(done) {

        // given
        var expression = moddle.create('apmn:FormalExpression', { body: '${ foo < bar }' });

        var assignmentExpression =
              moddle.create('apmn:ResourceAssignmentExpression', {
                id: 'FOO BAR',
                expression: expression
              });

        var expectedXML =
          '<apmn:resourceAssignmentExpression ' +
                    'xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                    'id="FOO BAR">' +
            '<apmn:expression xsi:type="apmn:tFormalExpression">' +
              '${ foo &lt; bar }' +
            '</apmn:expression>' +
          '</apmn:resourceAssignmentExpression>';

        // when
        write(assignmentExpression, function(err, result, context) {
          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });

      });


      it('CallActivity#calledElement', function(done) {

        // given
        var callActivity = moddle.create('apmn:CallActivity', {
          id: 'CallActivity_1',
          calledElement: 'otherProcess'
        });

        var expectedXML =
          '<apmn:callActivity ' +
              'xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
              'id="CallActivity_1" calledElement="otherProcess" />';

        // when
        write(callActivity, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('ItemDefinition#structureRef', function(done) {

        // given
        var itemDefinition = moddle.create('apmn:ItemDefinition', {
          id: 'serviceInput',
          structureRef: 'service:CelsiusToFahrenheitSoapIn'
        });

        var expectedXML =
          '<apmn:itemDefinition xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                  'id="serviceInput" ' +
                  'structureRef="service:CelsiusToFahrenheitSoapIn" />';

        // when
        write(itemDefinition, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('ItemDefinition#structureRef with ns', function(done) {

        // given
        var itemDefinition = moddle.create('apmn:ItemDefinition', {
          'xmlns:xs': 'http://xml-types',
          id: 'xsdBool',
          isCollection: true,
          itemKind: 'Information',
          structureRef: 'xs:tBool'
        });

        var expectedXML =
          '<apmn:itemDefinition xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                               'xmlns:xs="http://xml-types" ' +
                               'id="xsdBool" ' +
                               'itemKind="Information" ' +
                               'structureRef="xs:tBool" ' +
                               'isCollection="true" />';


        // when
        write(itemDefinition, function(err, result) {
          // then
          expect(result).to.eql(expectedXML);

          done();
        });
      });


      it('Operation#implementationRef', function(done) {

        // given
        var operation = moddle.create('apmn:Operation', {
          id: 'operation',
          implementationRef: 'foo:operation'
        });

        var expectedXML =
          '<apmn:operation xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                  'id="operation" ' +
                  'implementationRef="foo:operation" />';

        // when
        write(operation, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('Interface#implementationRef', function(done) {

        // given
        var iface = moddle.create('apmn:Interface', {
          id: 'interface',
          implementationRef: 'foo:interface'
        });

        var expectedXML =
          '<apmn:interface xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                  'id="interface" ' +
                  'implementationRef="foo:interface" />';

        // when
        write(iface, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('Collaboration', function(done) {

        // given

        var participant = moddle.create('apmn:Participant', {
          id: 'Participant_1'
        });

        var textAnnotation = moddle.create('apmn:TextAnnotation', {
          id: 'TextAnnotation_1'
        });

        var collaboration = moddle.create('apmn:Collaboration', {
          id: 'Collaboration_1',
          participants: [ participant ],
          artifacts: [ textAnnotation ]
        });

        var expectedXML =
          '<apmn:collaboration xmlns:apmn="http://apmn.io/spec/APMN/MODEL" id="Collaboration_1">' +
            '<apmn:participant id="Participant_1" />' +
            '<apmn:textAnnotation id="TextAnnotation_1" />' +
          '</apmn:collaboration>';


        // when
        write(collaboration, function(err, result) {
          // then
          expect(result).to.eql(expectedXML);

          done();
        });
      });


      it('ExtensionElements', function(done) {

        // given
        var extensionElements = moddle.create('apmn:ExtensionElements');

        var foo = moddle.createAny('vendor:foo', 'http://vendor', {
          key: 'FOO',
          value: 'BAR'
        });

        extensionElements.get('values').push(foo);

        var definitions = moddle.create('apmn:Definitions', {
          extensionElements: extensionElements
        });

        var expectedXML =
          '<apmn:definitions xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                            'xmlns:vendor="http://vendor">' +
            '<apmn:extensionElements>' +
              '<vendor:foo key="FOO" value="BAR" />' +
            '</apmn:extensionElements>' +
          '</apmn:definitions>';


        // when
        write(definitions, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('Operation#messageRef', function(done) {
        // given
        var inMessage = moddle.create('apmn:Message', {
          id: 'fooInMessage'
        });

        var outMessage = moddle.create('apmn:Message', {
          id: 'fooOutMessage'
        });

        var operation = moddle.create('apmn:Operation', {
          id: 'operation',
          inMessageRef: inMessage,
          outMessageRef: outMessage
        });

        var expectedXML =
          '<apmn:operation xmlns:apmn="http://apmn.io/spec/APMN/MODEL" id="operation">' +
            '<apmn:inMessageRef>fooInMessage</apmn:inMessageRef>' +
            '<apmn:outMessageRef>fooOutMessage</apmn:outMessageRef>' +
          '</apmn:operation>';

        // when
        write(operation, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });
    });


    describe('apmndi', function() {

      it('APMNDiagram', function(done) {

        // given
        var diagram = moddle.create('apmndi:APMNDiagram', { name: 'FOO', resolution: 96.5 });

        var expectedXML =
          '<apmndi:APMNDiagram xmlns:apmndi="http://apmn.io/spec/APMN/DI" ' +
                              'name="FOO" ' +
                              'resolution="96.5" />';

        // when
        write(diagram, function(err, result) {
          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('APMNShape', function(done) {

        // given
        var bounds = moddle.create('dc:Bounds', { x: 100.0, y: 200.0, width: 50.0, height: 50.0 });
        var apmnShape = moddle.create('apmndi:APMNShape', { bounds: bounds });

        var expectedXML =
          '<apmndi:APMNShape xmlns:apmndi="http://apmn.io/spec/APMN/DI" ' +
                            'xmlns:dc="http://apmn.io/spec/DD/DC">' +
            '<dc:Bounds x="100" y="200" width="50" height="50" />' +
          '</apmndi:APMNShape>';

        // when
        write(apmnShape, function(err, result) {
          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });

      it('APMNShape (colored)', function(done) {

        // given
        var apmnShape = moddle.create('apmndi:APMNShape', {
          fill: '#ff0000',
          stroke: '#00ff00'
        });

        var expectedXML =
          '<apmndi:APMNShape xmlns:apmndi="http://apmn.io/spec/APMN/DI" ' +
                            'xmlns:bioc="http://apmn.io/schema/apmn/biocolor/1.0" ' +
                            'bioc:stroke="#00ff00" bioc:fill="#ff0000" />';

        // when
        write(apmnShape, function(err, result) {

          if (err) {
            done(err);
          }

          // then
          expect(result).to.eql(expectedXML);

          done();
        });
      });

      it('APMNEdge (colored)', function(done) {

        // given
        var apmnEdge = moddle.create('apmndi:APMNEdge', {
          fill: '#ff0000',
          stroke: '#00ff00'
        });

        var expectedXML =
          '<apmndi:APMNEdge xmlns:apmndi="http://apmn.io/spec/APMN/DI" ' +
                            'xmlns:bioc="http://apmn.io/schema/apmn/biocolor/1.0" ' +
                            'bioc:stroke="#00ff00" bioc:fill="#ff0000" />';

        // when
        write(apmnEdge, function(err, result) {

          if (err) {
            done(err);
          }

          // then
          expect(result).to.eql(expectedXML);

          done();
        });
      });

    });

  });


  describe('should export extensions', function() {

    it('manually added custom namespace', function(done) {

      // given
      var definitions = moddle.create('apmn:Definitions');

      definitions.set('xmlns:foo', 'http://foobar');

      // or alternatively directly assign it to definitions.$attrs

      var expectedXML =
        '<apmn:definitions xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                          'xmlns:foo="http://foobar" />';

      // when
      write(definitions, function(err, result) {

        if (err) {
          return done(err);
        }

        // then
        expect(result).to.eql(expectedXML);

        done(err);
      });
    });


    it('attributes on root', function(done) {

      // given
      var definitions = moddle.create('apmn:Definitions');

      definitions.set('xmlns:foo', 'http://foobar');
      definitions.set('foo:bar', 'BAR');

      // or alternatively directly assign it to definitions.$attrs

      var expectedXML =
        '<apmn:definitions xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                          'xmlns:foo="http://foobar" foo:bar="BAR" />';

      // when
      write(definitions, function(err, result) {

        // then
        expect(result).to.eql(expectedXML);

        done(err);
      });
    });


    it('attributes on nested element', function(done) {

      // given
      var signal = moddle.create('apmn:Signal', {
        'foo:bar': 'BAR'
      });

      var definitions = moddle.create('apmn:Definitions', {
        rootElements: [ signal ],
        'xmlns:foo': 'http://foobar'
      });

      var expectedXML =
        '<apmn:definitions xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                          'xmlns:foo="http://foobar">' +
          '<apmn:signal foo:bar="BAR" />' +
        '</apmn:definitions>';

      // when
      write(definitions, function(err, result) {

        // then
        expect(result).to.eql(expectedXML);

        done(err);
      });
    });


    it('attributes and namespace on nested element', function(done) {

      // given
      var signal = moddle.create('apmn:Signal', {
        'xmlns:foo': 'http://foobar',
        'foo:bar': 'BAR'
      });

      var definitions = moddle.create('apmn:Definitions', {
        rootElements: [ signal ]
      });

      var expectedXML =
        '<apmn:definitions xmlns:apmn="http://apmn.io/spec/APMN/MODEL">' +
          '<apmn:signal xmlns:foo="http://foobar" foo:bar="BAR" />' +
        '</apmn:definitions>';

      // when
      write(definitions, function(err, result) {

        // then
        expect(result).to.eql(expectedXML);

        done(err);
      });
    });


    it('attributes and namespace on root + nested element', function(done) {

      // given
      var signal = moddle.create('apmn:Signal', {
        'xmlns:foo': 'http://foobar',
        'foo:bar': 'BAR'
      });

      var definitions = moddle.create('apmn:Definitions', {
        'xmlns:foo': 'http://foobar',
        rootElements: [ signal ]
      });

      var expectedXML =
        '<apmn:definitions xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                          'xmlns:foo="http://foobar">' +
          '<apmn:signal foo:bar="BAR" />' +
        '</apmn:definitions>';

      // when
      write(definitions, function(err, result) {

        // then
        expect(result).to.eql(expectedXML);

        done(err);
      });
    });


    it('elements via apmn:extensionElements', function(done) {

      // given

      var vendorBgColor = moddle.createAny('vendor:info', 'http://vendor', {
        key: 'bgcolor',
        value: '#ffffff'
      });

      var vendorRole = moddle.createAny('vendor:info', 'http://vendor', {
        key: 'role',
        value: '[]'
      });

      var extensionElements = moddle.create('apmn:ExtensionElements', {
        values: [ vendorBgColor, vendorRole ]
      });

      var definitions = moddle.create('apmn:Definitions', { extensionElements: extensionElements });

      var expectedXML =
        '<apmn:definitions xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                          'xmlns:vendor="http://vendor">' +
          '<apmn:extensionElements>' +
            '<vendor:info key="bgcolor" value="#ffffff" />' +
            '<vendor:info key="role" value="[]" />' +
          '</apmn:extensionElements>' +
        '</apmn:definitions>';


      // when
      write(definitions, function(err, result) {

        if (err) {
          return done(err);
        }

        // then
        expect(result).to.eql(expectedXML);

        done();
      });
    });


    it('nested elements via apmn:extensionElements', function(done) {

      var camundaNs = 'http://camunda.org/schema/1.0/bpmn';

      // when

      var inputParameter = moddle.createAny('camunda:inputParameter', camundaNs, {
        name: 'assigneeEntity',
        $body: 'user'
      });

      var inputOutput = moddle.createAny('camunda:inputOutput', camundaNs, {
        $children: [
          inputParameter
        ]
      });

      var extensionElements = moddle.create('apmn:ExtensionElements', {
        values: [ inputOutput ]
      });

      var userTask = moddle.create('apmn:UserTask', {
        extensionElements: extensionElements
      });

      var expectedXML =
          '<apmn:userTask xmlns:apmn="http://apmn.io/spec/APMN/MODEL" ' +
                         'xmlns:camunda="' + camundaNs + '">' +
            '<apmn:extensionElements>' +
              '<camunda:inputOutput>' +
                '<camunda:inputParameter name="assigneeEntity">user</camunda:inputParameter>' +
              '</camunda:inputOutput>' +
            '</apmn:extensionElements>' +
          '</apmn:userTask>';

      // when
      write(userTask, function(err, result) {

        if (err) {
          return done(err);
        }

        // then
        expect(result).to.eql(expectedXML);

        done();
      });
    });

  });

});
