import { Component } from 'inferno';

import {
  HeaderCell,
  SelectionAware,
  mixin,
  classNames,
  inject
} from 'table-js/lib/components';


export default class HitPolicyCell extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = { };

    mixin(this, SelectionAware);

    inject(this);
  }

  onClick = (event) => {
    this.eventBus.fire('hitPolicy.edit', {
      event
    });
  }

  onElementsChanged = () => {
    this.forceUpdate();
  }

  componentWillMount() {
    const root = this.sheet.getRoot();

    this.changeSupport.onElementsChanged(root.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const root = this.sheet.getRoot();

    this.changeSupport.offElementsChanged(root.id, this.onElementsChanged);
  }

  render() {
    const root = this.sheet.getRoot(),
          businessObject = root.businessObject,
          hitPolicy = businessObject.hitPolicy.charAt(0),
          aggregation = businessObject.aggregation;

    const aggregationLabel = getAggregationLabel(aggregation);

    const className = classNames(
      this.getSelectionClasses(),
      'hit-policy',
      'header'
    );

    return (
      <HeaderCell
        className={ className }
        elementId={ root.id + '__hitpolicy' }
        data-hit-policy="true"
        onClick={ this.onClick }
        rowspan="3"
        tabindex="0">{ hitPolicy }{ aggregationLabel }</HeaderCell>
    );
  }
}

HitPolicyCell.$inject = [
  'sheet',
  'changeSupport',
  'eventBus'
];


// helpers //////////////////////

function getAggregationLabel(aggregation) {
  switch (aggregation) {
  case 'SUM': return '+';
  case 'MIN': return '<';
  case 'MAX': return '>';
  case 'COUNT': return '#';
  default: return '';
  }
}