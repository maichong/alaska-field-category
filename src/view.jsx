/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-08-18
 * @author Liang <liang@maichong.it>
 */

import React from 'react';
import qs from 'qs';
import { shallowEqual, api, PREFIX } from 'alaska-admin-view';
import _find from 'lodash/find';
import _forEach from 'lodash/forEach';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import _clone from 'lodash/clone';
import MultiLevelSelect from './MultiLevelSelect';
import '../category.less';

const { bool, object, any, func, string } = React.PropTypes;

export default class CategoryFieldView extends React.Component {

  static propTypes = {
    model: object,
    field: object,
    data: object,
    errorText: string,
    disabled: bool,
    value: any,
    onChange: func,
  };

  constructor(props) {
    super(props);
    this.state = {
      options: [],
      value: null
    };
  }

  componentWillMount() {
    this.init();
  }

  shouldComponentUpdate(props, state) {
    return !shallowEqual(props, this.props, 'data', 'onChange', 'search') || this.state.options !== state.options;
  }

  init() {
    let field = this.props.field;
    let query = qs.stringify({
      service: field.service,
      model: field.model,
      search: '',
      filters: field.filters,
      all: 1
    });
    api.post(PREFIX + '/api/relation?' + query).then(res => {
      this.setState({ options: res.results });
    });
  }

  handleChange = (index, value) => {
    const { field, onChange } = this.props;
    if (!field.multi) {
      onChange(value);
    } else {
      let values = _clone(this.props.value);
      if (!Array.isArray(values)) {
        values = [values];
      }
      values[index] = value;
      onChange(values);
    }
  };

  handleAdd = () => {
    const { onChange } = this.props;
    let values = _clone(this.props.value);
    if (!Array.isArray(values)) {
      values = [values];
    } else {
      values.push(null);
    }
    onChange(values);
  };

  render() {
    let { field, value, disabled, errorText } = this.props;
    let help = field.help;
    let className = 'form-group category-field';
    if (errorText) {
      className += ' has-error';
      help = errorText;
    }
    let helpElement = help ? <p className="help-block">{help}</p> : null;
    let inputElement;

    if (field.multi) {
      className += ' category-field-multi';
      if (!Array.isArray(value)) {
        value = [value];
      }
      if (!value.length) {
        value.push(null);
      }
      inputElement = _map(value, (v, index) => {
        return <MultiLevelSelect
          key={index}
          value={v || ''}
          disabled={disabled}
          onChange={(v) => this.handleChange(index, v)}
          options={this.state.options}
        />;
      });
      if (!disabled) {
        inputElement.push(<div className="btn btn-success" key="add" onClick={this.handleAdd}>
          <i className="fa fa-plus"/>
        </div>);
      }
    } else {
      inputElement = (
        <MultiLevelSelect
          value={value || ''}
          disabled={disabled}
          onChange={(v) => this.handleChange(0, v)}
          options={this.state.options}
        />
      );
    }

    let label = field.nolabel ? '' : field.label;

    if (field.horizontal === false) {
      let labelElement = label ? (
        <label className="control-label">{label}</label>
      ) : null;
      return (
        <div className={className}>
          {labelElement}
          {inputElement}
          {helpElement}
        </div>
      );
    }
    return (
      <div className={className}>
        <label className="col-sm-2 control-label">{label}</label>
        <div className="col-sm-10">
          {inputElement}
          {helpElement}
        </div>
      </div>
    );
  }
}
