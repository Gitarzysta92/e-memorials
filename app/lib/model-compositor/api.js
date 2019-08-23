const menu = require('./partials/menu');
const title = require('./partials/title');
const text = require('./partials/text');
const image = require('./partials/image');
const button = require('./partials/button');
const link = require('./partials/link');

const composer = require('./composer');



module.exports = (function(){
  composer.registerModel({ name: 'menu', type: 'partials'}, menu);
  composer.registerModel({ name: 'title', type: 'partials'}, title);
  composer.registerModel({ name: 'text', type: 'partials'}, text);
  composer.registerModel({ name: 'image', type: 'partials'}, image);
  composer.registerModel({ name: 'button', type: 'partials'}, button);
  composer.registerModel({ name: 'link', type: 'partials'}, link);

  const preparePageModel = function(pageData) {
    try {
      return composer.createPageData(pageData);
    } catch (err) {
      console.warn(err);
    }
  }
  return { preparePageModel };
})();