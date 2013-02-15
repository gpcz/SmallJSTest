SmallJSTest
===========

Tiny (one file) JavaScript unit testing framework.

It was originally written for simple unit tests on Google Apps Script with the
following goals in mind:

* __Portability__: The framework should be usable in any JavaScript environment
  after rewriting a single printing function.
* __Size__: Only one file, no dependencies.
* __Ease of Use__: It doesn't do everything, but it does enough to be helpful.

Here's an example of how to use it:

    // The function to test.  Adds two numbers.
    function addNums(x,y) {
      return x+y;
    }
    
    // Makes a test category.  Categories are good for organizing similar tests.
    function sample_category() {
      var cat = new TestCategory(); // Creates a new suite of tests.
    
      // Params: function, list of inputs, expected return value
      cat.assert_equal(addNums,[2,2],4);

      // You have to define a cleanup function even if you don't use it.
      cat.cleanup = sample_category_cleanup;
      return cat;
    }
    
    function sample_category_cleanup() {
      // Put code for cleaning up the environment here (freeing handles,
      // setting pages & things back to how they were before the test, etc).
    }
    
    function main() {
      var suites = [sample_category];
      run_test_suites(suites);
    }

The output you should get in the Google Apps Script log (or whichever output
medium you program it to use) is:

    Tests : 1/1 passed

This file was designed to scratch my own itch while trying to be more rigorous
about a Google Apps Script automation project I was working on, but I would
welcome any suggestions, bugfixes, or additional features as long as the system
is still compact, one file, and mostly portable when implemented.