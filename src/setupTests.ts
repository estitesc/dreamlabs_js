/**
 * Defines the React 16 Adapter for Enzyme. 
 *
 * @link http://airbnb.io/enzyme/docs/installation/#working-with-react-16
 * @copyright 2017 Airbnb, Inc.
 */

const enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

enzyme.configure({ adapter: new Adapter() });

// Can solve this later but unless this loads correctly you are going to get a warning message
// Any time that you run your tests. Problem is it doesn't work well with Typescript.

global.requestAnimationFrame = function(callback) {
    setTimeout(callback, 0);
};