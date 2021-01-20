import React, { Fragment } from 'react';

const DynamicDropdown = ({data, optionKey, optionValue, defaultValueSelected, onChangeCallback}) => {

  let items = [];
  let itemName = '';
  let key = '';
  let defaultValue = '';

  defaultValue = 'PHP';

  for (var item in data) {
    itemName = data[item][optionValue];
    key = data[item][optionKey];

    items.push(<option key={key} value={key}>{itemName}</option>);   
  }

  return(
    <select id="currency_id" name="currency_id" className="form-control" onChange={onChangeCallback} defaultValue={defaultValueSelected}>
    {items}
    </select>
  )  
}

export default DynamicDropdown;