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

const { any, func, object } = React.PropTypes;

export default class CategoryFieldFilter extends React.Component {

  static propTypes = {
    value: any,
    field: object,
    onChange: func,
    onClose: func,
  };

  static contextTypes = {
    t: func
  };

  constructor(props) {
    super(props);
    let value = props.value || {};
    if (typeof value === 'string') {
      value = { value };
    }
    this.state = {
      value: value.value,
      inverse: value.inverse,
      error: value.value === undefined,
      options: null
    };
  }

  componentWillMount() {
    this.init();
  }

  componentWillReceiveProps(props) {
    if (props.value !== this.props.value) {
      let value = props.value;
      if (typeof value === 'string') {
        value = { value };
      }
      this.setState(value);
    }
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

  handleInverse = () => {
    this.setState({ inverse: !this.state.inverse }, () => this.handleBlur());
  };

  handleChange = value => {
    this.setState({ value }, this.handleBlur);
  };

  handleBlur = () => {
    let { value, inverse } = this.state;
    if (value === undefined) {
      this.setState({ error: true });
      return;
    }
    this.setState({ error: false });

    this.props.onChange(inverse ? { value, inverse } : value);
  };

  render() {
    const t = this.context.t;
    const { field, onClose } = this.props;
    const { value, inverse, error, options } = this.state;
    const buttonClassName = 'btn btn-default';
    const buttonClassNameActive = buttonClassName + ' btn-success';
    let className = 'row field-filter category-field-filter' + (error ? ' error' : '');
    return (
      <div className={className}>
        <label className="col-xs-2 control-label text-right">{field.label}</label>
        <div className="col-xs-10">
          <MultiLevelSelect
            options={options}
            loadOptions={this.handleSearch}
            value={value}
            onChange={this.handleChange}
          />
          <a
            className={inverse ? buttonClassNameActive : buttonClassName}
            onClick={this.handleInverse}>{t('inverse')}
          </a>
        </div>
        <a className="btn field-filter-close" onClick={onClose}><i className="fa fa-close"/></a>
      </div>
    );
  }
}
