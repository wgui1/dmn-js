import {
  bootstrapModeler,
  inject
} from '../../../TestHelper';

import connectModule from 'diagram-js/lib/features/connect';
import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';
import snappingModule from 'src/features/snapping';

import {
  createCanvasEvent as canvasEvent
} from 'test/util/MockEvents';

import { getMid } from 'diagram-js/lib/layout/LayoutUtil';


describe('features/snapping - drd connect snapping', function() {

  var testModules = [
    connectModule,
    coreModule,
    modelingModule,
    snappingModule
  ];

  var diagramXML = require('./DrdConnectSnapping.dmn');

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  it('should snap', inject(function(connect, dragging, elementRegistry) {

    // given
    var decision1 = elementRegistry.get('Decision_1'),
        decision4 = elementRegistry.get('Decision_4');

    // when
    connect.start(canvasEvent(getMid(decision1)), decision1, true);

    dragging.move(canvasEvent(getMid(decision4)));

    dragging.hover({ element: decision4, gfx: elementRegistry.getGraphics(decision4) });

    dragging.end();

    // then
    expect(decision1.outgoing[ 0 ].waypoints).to.eql([
      {
        original: {
          x: 610,
          y: 240
        },
        x: 610,
        y: 240
      },
      {
        x: 590,
        y: 180
      },
      {
        original: {
          x: 590,
          y: 160
        },
        x: 590,
        y: 160
      }
    ]);
  }));


  it('should unsnap', inject(function(connect, dragging, elementRegistry) {

    // given
    var decision1 = elementRegistry.get('Decision_1'),
        decision4 = elementRegistry.get('Decision_4'),
        knowledgeSource = elementRegistry.get('KnowledgeSource_1');

    connect.start(canvasEvent(getMid(decision1)), decision1, true);

    dragging.move(canvasEvent(getMid(decision4)));

    dragging.hover({ element: decision4, gfx: elementRegistry.getGraphics(decision4) });

    // when
    dragging.move(canvasEvent(getMid(knowledgeSource)));

    dragging.hover({
      element: knowledgeSource,
      gfx: elementRegistry.getGraphics(knowledgeSource)
    });

    dragging.end();

    // then
    expect(decision1.outgoing[ 0 ].waypoints[ 0 ].original).to.eql(getMid(decision1));
    expect(decision1.outgoing[ 0 ].waypoints[ 1 ].original).to.eql(getMid(knowledgeSource));
  }));

});