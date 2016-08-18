/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-08-18
 * @author Liang <liang@maichong.it>
 */

import React from 'react';
import Select from 'alaska-field-select/lib/Select';
import _map from 'lodash/map';
import _forEach from 'lodash/forEach';
import _filter from 'lodash/filter';
import _cloneDeep from 'lodash/cloneDeep';

const { array, any, bool, func } = React.PropTypes;

export default class MultiLevelSelect extends React.Component {

  static propTypes = {
    options: array,
    onChange: func,
    value: any,
    disabled: bool
  };

  componentWillMount() {
    this.state = {
      levels: []
    };
    this.init(this.props);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    let options = _cloneDeep(props.options);
    let levels = [];
    let optionsMap = {};
    if (!options || !options.length) {
      levels.push({
        options: []
      });
    } else {
      _forEach(options, o => {
        optionsMap[o.value] = o;
      });

      _forEach(options, o => {
        if (o.parent && optionsMap[o.parent]) {
          if (!optionsMap[o.parent].subs) {
            optionsMap[o.parent].subs = [];
          }
          optionsMap[o.parent].subs.push(o);
        } else {
          delete o.parent;
        }
      });

      options = _filter(options, o => !o.parent);

      if (props.value) {
        let value = props.value;
        while (value) {
          let option = optionsMap[value];
          if (!option) {
            break;
          }
          levels.unshift({
            options: _filter(optionsMap, o => o.parent === option.parent),
            value
          });
          value = option.parent;
        }
      }
      if (!levels.length) {
        levels.unshift({
          options: _filter(optionsMap, o => !o.parent),
          value: props.value
        });
      } else if (props.value) {
        let option = optionsMap[props.value];
        if (option && option.subs && option.subs.length) {
          levels.push({
            options: option.subs,
            value: undefined
          });
        }
      }
    }
    this.setState({ levels, options, optionsMap });
  }

  handleChange = (level, value) => {
    if (!value) {
      let v = this.props.value;
      if (v) {
        let l = this.state.levels[level - 1];
        if (l && l.value) {
          value = l.value;
        }
      }
    } else {
      value = value.value || value;
    }
    this.props.onChange(value);
  };

  render() {
    const { disabled } = this.props;
    const { levels } = this.state;
    return (
      <div className="row multi-level-select">
        {_map(levels, (level, index) => {
          return (<div className="col-sm-4" key={index}>
            <Select
              disabled={disabled}
              options={level.options}
              value={level.value}
              onChange={value => this.handleChange(index, value)}
            />
          </div>);
        })}
      </div>
    );
  }
}
