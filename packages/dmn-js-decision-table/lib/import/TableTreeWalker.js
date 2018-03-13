import { forEach } from 'min-dash/lib/collection';

import { elementToString } from './Util';

export default function TableTreeWalker(handler, options) {

  function visit(element, ctx, definitions) {

    var gfx = element.gfx;

    // avoid multiple rendering of elements
    if (gfx) {
      throw new Error(`already rendered ${ elementToString(element) }`);
    }

    // call handler
    return handler.element(element, ctx, definitions);
  }

  function visitTable(element) {
    return handler.table(element);
  }


  // Semantic handling //////////////////////

  function handleDecision(decision) {

    if (!decision.id) {
      decision.id = 'decision';
    }

    const table = decision.decisionTable;

    if (table) {

      if (!table.input) {
        throw new Error(`missing input for ${ elementToString(table) }`);
      }

      if (!table.output) {
        throw new Error(`missing output for ${ elementToString(table) }`);
      }

      const ctx = visitTable(table);

      handleClauses(table.input, ctx, table);
      handleClauses(table.output, ctx, table);

      // if any input or output clauses (columns) were added
      // make sure that for each rule the according input/output entry is created
      return handleRules(table.rule, ctx, table);
    } else {
      throw new Error(`no table for ${ elementToString(decision) }`);
    }

  }

  function handleClauses(inputs, context, definitions) {
    forEach(inputs, function(e) {
      visit(e, context, definitions);
    });
  }

  function handleRules(rules, context, definitions) {

    return iterator(rules, function(rule) {
      visit(rule, context, definitions);

      handleEntry(rule.inputEntry, rule);

      handleEntry(rule.outputEntry, rule);
    });
  }

  function handleEntry(entry, context, definitions) {
    forEach(entry, function(e) {
      visit(e, context, definitions);
    });
  }


  // API //////////////////////

  return {
    handleDecision: handleDecision
  };
}



// helpers ///////////////////////

function iterator(elements, handleFn) {

  let badge = 150;

  let idx = 0;

  return {
    index() {
      return idx;
    },

    next() {

      console.log('next!');

      do {
        const e = elements[idx++];

        console.log(idx, e);

        if (e) {
          handleFn(e);
        } else {
          return false;
        }
      } while (idx % badge !== 0);
    }
  };

}