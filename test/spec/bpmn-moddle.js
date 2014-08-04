'use strict';

var Helper = require('../helper');

var moddle = Helper.createModdle();


describe('bpmn-moddle', function() {


  describe('parsing', function() {

    it('should publish type', function() {
      // when
      var type = moddle.getType('bpmn:Process');

      // then
      expect(type).to.exist;
      expect(type.$descriptor).to.exist;
    });


    it('should redefine property', function() {

      // when
      var type = moddle.getType('bpmndi:BPMNShape');

      // then
      expect(type).to.exist;

      var descriptor = type.$descriptor;

      expect(descriptor).to.exist;
      expect(descriptor.propertiesByName['di:modelElement']).to.eql(descriptor.propertiesByName['bpmndi:bpmnElement']);
    });

  });


  describe('creation', function() {

    it('should create SequenceFlow', function() {
      var sequenceFlow = moddle.create('bpmn:SequenceFlow');

      expect(sequenceFlow.$type).to.eql('bpmn:SequenceFlow');
    });


    it('should create Definitions', function() {
      var definitions = moddle.create('bpmn:Definitions');

      expect(definitions.$type).to.eql('bpmn:Definitions');
    });

  });


  describe('property access', function() {

    describe('singleton properties', function() {

      it('should set attribute', function() {

        // given
        var process = moddle.create('bpmn:Process');

        // assume
        expect(process.get('isExecutable')).not.to.exist;

        // when
        process.set('isExecutable', true);

        // then
        expect(process).to.jsonEqual({
          $type: 'bpmn:Process',
          isExecutable: true
        });
      });


      it('should set attribute (ns)', function() {

        // given
        var process = moddle.create('bpmn:Process');

        // when
        process.set('bpmn:isExecutable', true);

        // then
        expect(process).to.jsonEqual({
          $type: 'bpmn:Process',
          isExecutable: true
        });
      });


      it('should set id attribute', function() {

        // given
        var definitions = moddle.create('bpmn:Definitions');

        // when
        definitions.set('id', 10);

        // then
        expect(definitions).to.jsonEqual({
          $type: 'bpmn:Definitions',
          id: 10
        });
      });
    });


    describe('builder', function() {

      it('should create simple hierarchy', function() {

        // given
        var definitions = moddle.create('bpmn:Definitions');
        var rootElements = definitions.get('bpmn:rootElements');

        var process = moddle.create('bpmn:Process');
        var collaboration = moddle.create('bpmn:Collaboration');

        // when
        rootElements.push(collaboration);
        rootElements.push(process);

        // then
        expect(rootElements).to.eql([ collaboration, process ]);
        expect(definitions.rootElements).to.eql([ collaboration, process ]);

        expect(definitions).to.jsonEqual({
          $type: 'bpmn:Definitions',
          rootElements: [
            { $type: 'bpmn:Collaboration' },
            { $type: 'bpmn:Process' }
          ]
        });
      });

    });
  });
});