import TestContainer from 'mocha-test-container-support';

import DmnDecisionTableEditor from '../helper/DecisionTableEditor';

import TestDecision from './performance.dmn';

describe('DecisionTable', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function createDecisionTableEditor(xml, done) {
    const dmnDecisionTableEditor = new DmnDecisionTableEditor({
      container: testContainer
    });

    console.time('import');
    dmnDecisionTableEditor.importXML(xml, (err, warnings) => {

      console.timeEnd('import');
      done(err, warnings, dmnDecisionTableEditor);
    });
  }


  this.timeout(30000);

  it.only('should import simple decision', function(done) {
    createDecisionTableEditor(TestDecision, done);
  });

});