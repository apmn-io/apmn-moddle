import expect from './expect';

import SchemaValidator from 'xsd-schema-validator';

import {
  readFile
} from './helper';

var APMN_XSD = 'test/fixtures/xsd/APMN.xsd';


export function fromFile(moddle, file, done) {
  return fromFilePart(moddle, file, 'apmn:Definitions', done);
}

export function fromFilePart(moddle, file, type, done) {
  var fileContents = readFile(file);

  moddle.fromXML(fileContents, type, done);
}

export function fromValidFile(moddle, file, done) {
  var fileContents = readFile(file);

  validate(null, fileContents, function(err) {

    if (err) {
      return done(err);
    }

    moddle.fromXML(fileContents, 'apmn:Definitions', done);
  });
}


export function toXML(element, opts, done) {
  element.$model.toXML(element, opts, done);
}


export function validate(err, xml, done) {

  if (err) {
    return done(err);
  }

  if (!xml) {
    return done(new Error('XML is not defined'));
  }

  SchemaValidator.validateXML(xml, APMN_XSD, function(err, result) {

    if (err) {
      return done(err);
    }

    expect(result.valid).to.be.true;
    done();
  });
}