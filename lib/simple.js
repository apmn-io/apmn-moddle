import {
  assign
} from 'min-dash';

import ApmnModdle from './bpmn-moddle';

import ApmnPackage from '../resources/bpmn/json/apmn.json';
import ApmnDiPackage from '../resources/bpmn/json/apmndi.json';
import DcPackage from '../resources/bpmn/json/dc.json';
import DiPackage from '../resources/bpmn/json/di.json';
import BiocPackage from '../resources/bpmn-io/json/bioc.json';

var packages = {
  apmn: ApmnPackage,
  apmndi: ApmnDiPackage,
  dc: DcPackage,
  di: DiPackage,
  bioc: BiocPackage
};

export default function(additionalPackages, options) {
  var pks = assign({}, packages, additionalPackages);

  return new ApmnModdle(pks, options);
}
