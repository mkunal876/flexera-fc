import {useState} from 'react';
import { Radio } from 'antd';
const RadioButtonBuilder = ({handleRadioChange, value }) => {
    return (
      <Radio.Group onChange={handleRadioChange} value={value}>
        <Radio value={1}>Search By HostName</Radio>
        <Radio value={2}>Search By Stack ID</Radio>
      </Radio.Group>
    );



}

export default RadioButtonBuilder;