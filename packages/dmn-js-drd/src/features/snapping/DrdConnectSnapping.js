import {
  asTRBL,
  getMid,
  getOrientation
} from 'diagram-js/lib/layout/LayoutUtil';

var HIGH_PRIORITY = 2000;


export default function DrdConnectSnapping(eventBus) {
  eventBus.on([
    'connect.hover',
    'connect.move',
    'connect.end',
  ], HIGH_PRIORITY, function(event) {
    var context = event.context,
        canExecute = context.canExecute,
        source = context.source,
        target = context.target;

    if (canExecute && canExecute.type === 'dmn:InformationRequirement') {
      var orientation = getOrientation(source, target);

      // snap source
      context.connectionStart = getMid(source);

      // snap target
      context.connectionEnd = getMid(target);

      if (orientation.includes('bottom')) {
        context.connectionStart.y = asTRBL(source).top;
        context.connectionEnd.y = asTRBL(target).bottom;
      } else if (orientation.includes('top')) {
        context.connectionStart.y = asTRBL(source).bottom;
        context.connectionEnd.y = asTRBL(target).top;
      } else if (orientation.includes('right')) {
        context.connectionStart.x = asTRBL(source).left;
        context.connectionEnd.x = asTRBL(target).right;
      } else {
        context.connectionStart.x = asTRBL(source).right;
        context.connectionEnd.x = asTRBL(target).left;
      }
    } else {
      delete context.connectionStart;
      delete context.connectionEnd;
    }
  });
}

DrdConnectSnapping.$inject = [ 'eventBus' ];