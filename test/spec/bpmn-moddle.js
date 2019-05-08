import expect from '../expect';

import {
  createModdle
} from '../helper';


describe('apmn-moddle', function() {

  var moddle = createModdle();


  describe('parsing', function() {

    it('should publish type', function() {
      // when
      var type = moddle.getType('apmn:Process');

      // then
      expect(type).to.exist;
      expect(type.$descriptor).to.exist;
    });


    it('should redefine property', function() {

      // when
      var type = moddle.getType('apmndi:APMNShape');

      // then
      expect(type).to.exist;

      var descriptor = type.$descriptor;

      expect(descriptor).to.exist;
      expect(
        descriptor.propertiesByName['di:modelElement']
      ).to.eql(
        descriptor.propertiesByName['apmndi:apmnElement']
      );
    });

  });


  describe('creation', function() {

    it('should create SequenceFlow', function() {
      var sequenceFlow = moddle.create('apmn:SequenceFlow');

      expect(sequenceFlow.$type).to.eql('apmn:SequenceFlow');
    });


    it('should create Definitions', function() {
      var definitions = moddle.create('apmn:Definitions');

      expect(definitions.$type).to.eql('apmn:Definitions');
    });


    it('should create Process', function() {
      var process = moddle.create('apmn:Process');

      expect(process.$type).to.eql('apmn:Process');
      expect(process.$instanceOf('apmn:FlowElementsContainer')).to.be.true;
    });


    it('should create SubProcess', function() {
      var subProcess = moddle.create('apmn:SubProcess');

      expect(subProcess.$type).to.eql('apmn:SubProcess');
      expect(subProcess.$instanceOf('apmn:InteractionNode')).to.be.true;
    });


    describe('defaults', function() {

      it('should init Gateway', function() {
        var gateway = moddle.create('apmn:Gateway');

        expect(gateway.gatewayDirection).to.eql('Unspecified');
      });


      it('should init APMNShape', function() {
        var apmnEdge = moddle.create('apmndi:APMNEdge');

        expect(apmnEdge.messageVisibleKind).to.eql('initiating');
      });


      it('should init EventBasedGateway', function() {
        var gateway = moddle.create('apmn:EventBasedGateway');

        expect(gateway.eventGatewayType).to.eql('Exclusive');
      });


      it('should init CatchEvent', function() {
        var event = moddle.create('apmn:CatchEvent');

        expect(event.parallelMultiple).to.eql(false);
      });


      it('should init ParticipantMultiplicity', function() {
        var participantMultiplicity = moddle.create('apmn:ParticipantMultiplicity');

        expect(participantMultiplicity.minimum).to.eql(0);
        expect(participantMultiplicity.maximum).to.eql(1);
      });


      it('should init Activity', function() {
        var activity = moddle.create('apmn:Activity');

        expect(activity.startQuantity).to.eql(1);
        expect(activity.completionQuantity).to.eql(1);
      });

    });

  });


  describe('property access', function() {

    describe('singleton properties', function() {

      it('should set attribute', function() {

        // given
        var process = moddle.create('apmn:Process');

        // assume
        expect(process.get('isExecutable')).not.to.exist;

        // when
        process.set('isExecutable', true);

        // then
        expect(process).to.jsonEqual({
          $type: 'apmn:Process',
          isExecutable: true
        });
      });


      it('should set attribute (ns)', function() {

        // given
        var process = moddle.create('apmn:Process');

        // when
        process.set('apmn:isExecutable', true);

        // then
        expect(process).to.jsonEqual({
          $type: 'apmn:Process',
          isExecutable: true
        });
      });


      it('should set id attribute', function() {

        // given
        var definitions = moddle.create('apmn:Definitions');

        // when
        definitions.set('id', 10);

        // then
        expect(definitions).to.jsonEqual({
          $type: 'apmn:Definitions',
          id: 10
        });
      });
    });


    describe('builder', function() {

      it('should create simple hierarchy', function() {

        // given
        var definitions = moddle.create('apmn:Definitions');
        var rootElements = definitions.get('apmn:rootElements');

        var process = moddle.create('apmn:Process');
        var collaboration = moddle.create('apmn:Collaboration');

        // when
        rootElements.push(collaboration);
        rootElements.push(process);

        // then
        expect(rootElements).to.eql([ collaboration, process ]);
        expect(definitions.rootElements).to.eql([ collaboration, process ]);

        expect(definitions).to.jsonEqual({
          $type: 'apmn:Definitions',
          rootElements: [
            { $type: 'apmn:Collaboration' },
            { $type: 'apmn:Process' }
          ]
        });
      });

    });

  });

});