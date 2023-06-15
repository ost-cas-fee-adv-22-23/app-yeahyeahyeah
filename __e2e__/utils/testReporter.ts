import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

class MyReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite): void {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
    console.log('---------------------------------');
  }

  onTestBegin(test: TestCase): void {
    console.log(`Starting test ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const ms = result.duration;
    console.log(`Finished test: ${result.status}`);
    console.log('Testing duration:', new Date(ms).toISOString().slice(11, 19));
    console.log('---------------------------------');
  }

  onEnd(result: FullResult): void {
    console.log('---------------------------------');
    console.log(`Finished the run: ${result.status}`);
  }
}

export default MyReporter;
