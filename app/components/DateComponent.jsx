import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, SafeAreaView, View, TouchableOpacity, Text, TextInput } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

function DateComponent({ onChange, reset }) {
    const [form, setForm] = useState({});
    const [input, setInput] = useState('');

    useEffect(() => {
        if (reset) {
            setInput('');
        }
    }, [reset]);

    const handleInputChange = value => {
        setInput(value);

        if (value.length === 8) {
            try {
                const year = parseInt(value.slice(4, 8), 10);

                if (Number.isNaN(year) || year < 2020 || year > 2100) {
                    throw new Error('Invalid year.');
                }

                const month = parseInt(value.slice(2, 4), 10);

                if (Number.isNaN(month) || month < 1 || month > 12) {
                    throw new Error('Invalid month.');
                }

                const day = parseInt(value.slice(0, 2), 10);
                const maxDaysInMonth = new Date(year, month, 0).getDate();

                if (Number.isNaN(day) || day < 1 || day > maxDaysInMonth) {
                    throw new Error('Invalid day.');
                }

                const newDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                setForm({ expirationDate: newDate });
                console.log("date : ", newDate);
                if (onChange) {
                    onChange(newDate);
                }
            } catch (_) {
                console.log("Date incorrecte.")
                Alert.alert('Invalid date entered, try again.');
                setInput('');
            }
        }
    };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
        <View /*style={styles.container}*/>
            <View /*style={styles.header}*/>
                
            </View>
            <View /*style={styles.form}*/>
                <View /*style={styles.input}*/>
                    <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus={true}
                    caretHidden={true}
                    keyboardType="number-pad"
                    maxLength={8}
                    onChangeText={handleInputChange}
                    returnKeyType="done"
                    style={styles.inputControl}
                    value={input} />

                    <View style={styles.inputOverflow}>
                        {'DD/MM/YYYY'.split('').map((placeholder, index, arr) => {
                        const countDelimiters = arr
                        .slice(0, index)
                        .filter(char => char === '/').length;
                        const indexWithoutDelimeter = index - countDelimiters;
                        const current = input[indexWithoutDelimeter];

                        return (
                            <Text key={index} style={styles.inputChar}>
                                {placeholder === '/' || !current ? (
                                <Text style={styles.inputCharEmpty}>{placeholder}</Text>
                                ) : (
                                current
                                )}
                            </Text>
                            );
                        })}
                     </View>
                </View>
            </View>
        </View>
    </SafeAreaView>
    );
}

export default DateComponent;

const styles = StyleSheet.create({
    
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8027d6',
    marginBottom: 6,
  },/*
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginTop: 24,
  },*/
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerBack: {
    padding: 8,
    paddingTop: 0,
    position: 'relative',
    marginLeft: -16,
  },
  /** Input */
  input: {
    marginBottom: 16,
    position: 'relative',
  },
  inputControl: {
    height: 50,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: 'transparent',
    borderWidth: 1,
    borderColor: '#d17af6',
    borderStyle: 'solid',
    zIndex: 2,
  },
  inputOverflow: {
    backgroundColor: '#edeced',
    borderRadius: 12,
    zIndex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  inputChar: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    lineHeight: 50,
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '600',
    color: '#8027d6'
  },
  inputCharEmpty: {
    color: '#e7b7ff',
    fontWeight: '400',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#075eec',
    borderColor: '#075eec',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});

