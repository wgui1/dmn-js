import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import {
  deconflictPosition,
  getConnectedDistance
} from 'diagram-js/lib/features/auto-place/AutoPlaceUtil';

import { asTRBL, getMid } from 'diagram-js/lib/layout/LayoutUtil';


export function getNewShapePosition(source, element) {

  if (is(element, 'dmn:TextAnnotation')) {
    return getTextAnnotationPosition(source, element);
  }

  if (is(element, 'dmn:DRGElement')) {
    return getDRGElementPosition(source, element);
  }
}

/**
 * Always try to place text annotations top right of source.
 */
function getTextAnnotationPosition(source, element) {

  var sourceTrbl = asTRBL(source);

  var position = {
    x: sourceTrbl.right + element.width / 2,
    y: sourceTrbl.top - 50 - element.height / 2
  };

  var escapeDirection = {
    y: {
      margin: -30,
      rowSize: 20
    }
  };

  return deconflictPosition(source, element, position, escapeDirection);
}

/**
 * Always try to place element bottom of source;
 * compute actual distance from previous nodes in flow.
 */
function getDRGElementPosition(source, element) {
  var sourceTrbl = asTRBL(source),
      sourceMid = getMid(source);

  function getWeight(connection) {
    return connection.target === source ? 5 : 1;
  }

  var verticalDistance = getConnectedDistance(source, {
    defaultDistance: 180,
    direction: 's',
    getWeight: getWeight,
    filter: filter,
    reference: 'center'
  });

  var position = {
    x: sourceMid.x,
    y: sourceTrbl.bottom + verticalDistance
  };

  var escapeDirection = {
    x: {
      margin: 60,
      rowSize: 180
    }
  };

  return deconflictPosition(source, element, position, escapeDirection);
}


// helpers //////////

function filter(connection) {
  return !is(connection, 'dmn:Association');
}