import {
  bootstrapModeler,
  inject
} from '../../../TestHelper';

import bendpointsModule from 'diagram-js/lib/features/bendpoints';
import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';
import snappingModule from 'src/features/snapping';

import {
  createCanvasEvent as canvasEvent
} from 'test/util/MockEvents';

import { getMid } from 'diagram-js/lib/layout/LayoutUtil';


describe('features/snapping - drd bendpoint snapping', function() {

  var testModules = [
    bendpointsModule,
    coreModule,
    modelingModule,
    snappingModule
  ];

  var diagramXML = require('./DrdBendpointSnapping.dmn');

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  describe('reconnect start', function() {

    it('should snap', inject(function(bendpointMove, dragging, elementRegistry) {

      // given
      var decision4 = elementRegistry.get('Decision_4'),
          informationRequirement = elementRegistry.get('InformationRequirement_1');

      // when
      bendpointMove.start(
        canvasEvent(getFirstWaypoint(informationRequirement)),
        informationRequirement,
        0
      );

      dragging.hover({ element: decision4, gfx: elementRegistry.getGraphics(decision4) });

      dragging.move(canvasEvent(getMid(decision4)));

      dragging.end();

      // then
      expect(informationRequirement.waypoints).to.eql([
        {
          original: {
            x: 500,
            y: 160
          },
          x: 500,
          y: 160
        },
        {
          x: 360,
          y: 140
        },
        {
          original: {
            x: 340,
            y: 140
          },
          x: 340,
          y: 140
        }
      ]);
    }));

  });


  describe('reconnect end', function() {

    it('should snap', inject(function(bendpointMove, dragging, elementRegistry) {

      // given
      var decision3 = elementRegistry.get('Decision_3'),
          informationRequirement = elementRegistry.get('InformationRequirement_1');

      // when
      bendpointMove.start(
        canvasEvent(getLastWaypoint(informationRequirement)),
        informationRequirement,
        getLastWaypointIndex(informationRequirement)
      );

      dragging.hover({ element: decision3, gfx: elementRegistry.getGraphics(decision3) });

      dragging.move(canvasEvent(getMid(decision3)));

      dragging.end();

      // then
      expect(informationRequirement.waypoints).to.eql([
        {
          original: {
            x: 360,
            y: 300
          },
          x: 360,
          y: 300
        },
        {
          x: 500,
          y: 320
        },
        {
          original: {
            x: 520,
            y: 320
          },
          x: 520,
          y: 320
        }
      ]);
    }));

  });

});


// helpers //////////

function getFirstWaypoint(connection) {
  var waypoints = connection.waypoints;

  return waypoints[ 0 ];
}

function getLastWaypoint(connection) {
  var waypoints = connection.waypoints;

  return waypoints[ getLastWaypointIndex(connection) ];
}

function getLastWaypointIndex(connection) {
  var waypoints = connection.waypoints;

  return waypoints.length - 1;
}