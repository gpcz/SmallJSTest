/**
 * @file Small JavaScript unit-testing framework.
 * @author Gregory Czerniak
 * @version 20121219
 */

// These are here to increase readability in run_tests().  The idea is that
// we have a "pack" array with the entire test description, and these describe
// the indices of the pack array.
var THE_OP = 0; // Function pointer to the operation used to compare the
                // test function's output to the desired output (usually
                // the good_equal() function).
var THE_NEGSTRING = 1; // String representation of the opposite of the right
                       // thing happening (for equality, "!=" would be this).
var THE_FUNC = 2; // Function pointer to the function to test.
var THE_IN = 3; // The input for the test.
var THE_OUT = 4; // The output the function should produce.
var THE_ERR = 4; // The exception type if the test is a crash-test.
var THE_PASSCRASH = 5; // Set to string 'crash' if it's a crash test.

/**
 * Prints a string.  This function must be customized for your environment.
 *
 * @param {string} theString The string to print.
 */
function printLine(theString) {
  Logger.log(theString);
}

/**
 * Checks two arrays for equality (every item is equal).
 *
 * @param {object} a An array.
 * @param {object} b An array.
 */
function array_equal(a,b) {
  var i;
  for ( i=0; i < a.length; i++ )
    if ( typeof(a) == 'object' && typeof(a.length) == 'number' ){
      if ( !good_equal(a[i],b[i]) )
        return false;
    }
    else
      if ( a[i] != b[i] )
        return false;
  return true;
}

/**
 * Tries to check for (test) equality as robustly as possible.
 *
 * @param {object} a Thing to compare against b.
 * @param {object} b Thing to compare against a.
 */
function good_equal(a,b) {
  if (!a && !b) // null = null
    return true;
  if (a && b && typeof(a) == 'object' && typeof(b) == 'object' )
    if (typeof(a.length) == 'number' && typeof(b.length) == 'number' &&
        a.length == b.length) // Do we have an array?
      return array_equal(a,b); // If so, we have a special check for this.
  return a == b; // Otherwise, a simple equality check should be good.
}

/**
 * Adds an equality test to the specified category.
 *
 * @param {function} The function to test.
 * @param {Array} The input parameters for the function.
 * @param {object} The expected output value.
 */
function assert_equal(theFunc,theIn,theOut) {
  this.tests.push([good_equal,'!=',theFunc,theIn,theOut,'work']);
}

/**
 * Adds a crash test to the specified category.
 *
 * @param {function} The function to test.
 * @param {Array} The input parameters for the function.
 * @param {object} The expected error type.
 */
function assert_crash(theFunc,theIn,theErr) {
  this.tests.push([good_equal,'!=',theFunc,theIn,theErr,'crash']);
}

/**
 * Simple equality test (doesn't call a function).
 *
 * @param {Array} The value to check.
 * @param {object} The expected value.
 */
function assert_simple_equal(theIn,theOut) {
  this.tests.push([good_equal,'!=',function(a){return a;},theIn,theOut,'work']);
}

/**
 * Runs the unit tests in this test category.
 */
function run_tests() {
  var passcount = 0;
  for ( var i = 0; i < this.tests.length; i++ ) {
    var pack = this.tests[i];
    try {
      var theVal = pack[THE_FUNC].apply(null,pack[THE_IN]);

      if ( pack[THE_PASSCRASH] != 'crash' && !pack[THE_OP](theVal,pack[THE_OUT]) )
        printLine('Test ' + i + ' failed:\n' + pack[THE_OUT] + '\n' +
                  pack[THE_NEGSTRING] + '\n' + theVal );
      else if ( pack[THE_PASSCRASH] == 'crash' )
        printLine('Test ' + i + ' was expected to crash with error ' +
                  pack[THE_ERR] + ' but did not.')
      else
        passcount += 1;
    }
    catch (err) {
      if ( pack[THE_PASSCRASH] == 'crash' && err == pack[THE_OUT] )
        passcount += 1;
      else if ( pack[THE_PASSCRASH] == 'crash' )
        printLine('Test ' + i + ' was expected to crash with error ' +
                  pack[THE_ERR] + ' but crashed with '+ err +'.')
      else
        printLine('Test ' + i + ' crashed with error: '+err+'.');
    }
  }
  printLine( 'Tests : ' + passcount + "/" + this.tests.length + ' passed' );
}

/**
 * Runs a set of unit test suites.
 *
 * @param {object} suites An array of unit test suites to run.
 */
function run_test_suites(suites) {
  for ( var i = 0; i < suites.length; i++ ) {
    var tests = suites[i]();
    tests.run_tests();
    tests.cleanup();
  }
}

/**
 * Constructor for a unit test suite (category).
 */
function TestCategory()
{
  this.tests = new Array();
  this.assert_equal = assert_equal;
  this.assert_simple_equal = assert_simple_equal;
  this.assert_crash = assert_crash;
  this.run_tests = run_tests;
}
