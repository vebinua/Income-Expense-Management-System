import React, { Fragment } from 'react';

const DynamicDropdown = ({data, optionKey, optionValue}) => {

  let items = [];
  let itemName = '';
  let key = '';

  for (var item in data) {
    itemName = data[item][optionValue];
    key = data[item][optionKey];

    items.push(<option key={key} value={key}>{itemName}</option>);   
  }

  return(
    <Fragment>
    {items}
  </Fragment>
  )  
}

export default DynamicDropdown;