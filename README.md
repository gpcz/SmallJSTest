SmallJSTest
===========

Tiny (one file) JavaScript unit test framework.

It was originally written for simple unit tests on Google Apps Script, but it's
designed to be easy to modify for other JavaScript environments by changing a
few simple I/O functions.

Here's an example of how to use it:

    // The function to test.  Adds two numbers.
    function addNums(x,y) {
      return x+y;
    }
    
  function sample_category() {
    var cat = new TestCategory();
    // Params: function, list of inputs, expected return value
    cat.assert_equal(addNums,[2,2],4);
    cat.cleanup = sample_category_cleanup;
    return cat;
  }
  
  function sample_category_cleanup() {
    // Put code for cleaning up the environment here (freeing handles, setting
    // things back to what they were, etc).
  }
  
  function main() {
    var suites = [sample_category];
    run_test_suites(suites);
  }