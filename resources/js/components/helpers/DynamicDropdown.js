import React, { useEffect, useState, useRef, Fragment } from 'react';

const DynamicDropdown = ({data, optionKey, optionValue, selectName, defaultValueSelected, pleaseSelectMessage, onChangeCallback}) => {

  //console.log('from dd: ' + defaultValueSelected);

  let items = [];
  let itemName = '';
  let key = '';
  let defaultValue = '';
  let defaultKey = '';

  if (selectName == null) {
    selectName = optionKey;
  }

  console.log('please select message: ' + pleaseSelectMessage);

  if (pleaseSelectMessage !== undefined) {
    items.push(<option key="-" value="-">{pleaseSelectMessage}</option>);   
  }

  for (var item in data) {
    itemName = data[item][optionValue];
    key = data[item][optionKey];

    if (itemName == defaultValueSelected) {
      defaultKey = key;
    }

    items.push(<option key={key} value={key}>{itemName}</option>);   
  }

  return(
    <div key={defaultValueSelected}>
    <select name={selectName} id={selectName} className="form-control" onChange={onChangeCallback} key={defaultValueSelected} value={defaultValueSelected}>
    {items}
    </select>
    </div>
  )  
}

export default DynamicDropdown;