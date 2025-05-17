// components/Select.js
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet, View, SafeAreaView } from 'react-native';

const Select = ({ title = "Select Option", data = [], onSelect, defaultValue = "", zIndex }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
const [items, setItems] = useState(data);

  const handleChange = (value) => {
    setValue(value);
    if (onSelect) onSelect(value);
  };

  return (
    <View style={[styles.container, { zIndex: zIndex }]}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={title}
        style={styles.dropdown}
        textStyle={styles.text}
        dropDownContainerStyle={styles.dropdownContainer}
        onChangeValue={handleChange}
        listMode="SCROLLVIEW" // Performans için daha uygun
      />
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({
  container: {
    width: "80%",
    borderRadius: 10,
    marginTop: 20,
  },
  dropdown: {
    backgroundColor: "#3A3B3C",
    borderColor: "#3A3B3C",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  text: {
    color: "#b0b0b0",
    fontSize: 16,
  },
  dropdownContainer: {
    backgroundColor: "#3A3B3C",
    borderColor: "#3A3B3C",
    borderRadius: 10,
  },
});
