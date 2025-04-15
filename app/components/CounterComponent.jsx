import React from "react";

import { Button, Dimensions, View } from 'react-native';
import { TextInput } from "react-native-web";

const { width, height } = Dimensions.get('screen');
const tabHeight = 50;

function CounterComponent() {
    const [foodCounter, setFoodCounter] = useState(0);

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Button title={"-"} />
            <TextInput style={{
                color: "purple",
            }}></TextInput>
            <Button title={"+"} />
        </View>
    );
}

export default CounterComponent;