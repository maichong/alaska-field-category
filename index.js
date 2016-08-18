/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-08-18
 * @author Liang <liang@maichong.it>
 */

'use strict';

const _ = require('lodash');
const RelationshipField = require('alaska-field-relationship');

class CategoryField extends RelationshipField {
}

CategoryField.views = _.defaults({
  view: {
    name: 'CategoryFieldView',
    path: __dirname + '/lib/view.js'
  },
  filter: {
    name: 'CategoryFieldFilter',
    path: __dirname + '/lib/filter.js'
  }
}, RelationshipField.views);

CategoryField.viewOptions = ['filters', 'service', 'model', 'multi', function (options, field) {
  let Model = field.ref;
  if (Model) {
    options.key = Model.key;
    options.title = Model.title;
  }
}];

module.exports = CategoryField;
