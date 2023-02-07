import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { CheckBox, Input, Button, Icon } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { baseUrl } from '../shared/baseUrl';
import logo from '../assets/images/logo.png';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';


const LoginTab = ({ navigation }) => {

    //local state variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);


    //when the login button is pressed, we will use this event handler.
    const handleLogin = () => {
        console.log('username:', username);
        console.log('password:', password);
        console.log('remember:', remember);

        //secure me function to see if the "remember me" box is checked, if so, we save the username and password to SecureStore. ALL SECRURE STORE RETURNS A PROMISE
        if (remember) {
            SecureStore.setItemAsync(
                //first argument is the key
                'userinfo',
                //second argument is the password and username value we want to store. First they need to be converted to a JSON string
                JSON.stringify({ username, password })
                //We can check for a rejected promise by adding a .catch at the end 
            ).catch((error) => console.log('Could not save user info', error))
            //deleting the stored password and username if the "remember me" is not checked
        } else {
            SecureStore.deleteItemAsync('userinfo').catch((error) => console.log('Could not delete user info', error));
        }
    };


    //'userinfo' is deleted if the 'remember me' box is unchecked
    //ensuring user info is retreived from SecureStore buy using useEffect. Only runs when the component first mounts
    // SecureStore.getItemAsync('userinfo) to check if there is any data saved under the key, 'userinfo'. This will return a promise if it resolves will return the value stored under that key
    //We can access the value in the 'userinfo' key with the .then() method. Parameter: data return from the SecureStore as a JSON string with the username and password.
    //We can call the parameter userdata and change it back to a javascript object using JSON.parse method
    //check to see if userinfo return a non-null truthy value. If so, we will update the login screen state with the username and password from the userinfo object.
    useEffect(() => {
        SecureStore.getItemAsync('userinfo').then((userdata) => {
            const userinfo = JSON.parse(userdata);
            if (userinfo) {
                setUsername(userinfo.username);
                setPassword(userinfo.password);
                setRemember(true);
            }
        })
    }, []);



    //setting up the login form
    return (
        <View style={styles.container}>
            <Input
                placeholder='Username'
                leftIcon={{ type: 'font-awesome', name: 'user-o' }}

                //whenever the text value is changed, this will update the username state variable, using the setting function, setUsername
                onChangeText={(text) => setUsername(text)}
                value={username}
                containerStyle={styles.formInput}
                leftIconContainerStyle={styles.formIcon}
            />
            <Input
                placeholder='Password'
                leftIcon={{ type: 'font-awesome', name: 'key' }}
                onChangeText={(text) => setPassword(text)}
                value={password}
                containerStyle={styles.formInput}
                leftIconContainerStyle={styles.formIcon}
            />

            <CheckBox
                title='Remember Me'
                center
                //similar to the value prop
                checked={remember}
                //use onPress prop to change the state to the opposite value
                onPress={() => setRemember(!remember)}
                containerStyle={styles.formCheckBox}
            />
            <View style={styles.formButton}>
                <Button
                    onPress={() => handleLogin()}
                    title='login'
                    color='#5637DD'
                    icon={
                        <Icon
                            name='sign-in'
                            type='font-awesome'
                            color='#fff'
                            iconStyle={{ marginRight: 10 }}
                        />
                    }
                    buttonStyle={{ backgroundColor: '#5637DD' }}
                />
            </View>
            <View style={styles.formButton}>
                <Button
                    onPress={() => navigation.navigate('Register')}
                    title='Register'
                    type='clear'
                    icon={
                        <Icon
                            name='user-plus'
                            type='font-awesome'
                            color='blue'
                            iconStyle={{ marginRight: 10 }}
                        />
                    }
                    titleStyle={{ color: 'blue' }}
                />
            </View>
        </View>
    )
};

const RegisterTab = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [remember, setRemember] = useState(false);
    const [imageUrl, setImageUrl] = useState(baseUrl + 'images/logo.png');

    const handleRegister = () => {
        const userInfo = {
            username,
            password,
            firstName,
            lastName,
            email,
            remember
        };
        console.log(JSON.stringify(userInfo));
        if (remember) {
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({ username, password })
            ).catch((error) => console.log('Could not save user info', error))
        } else {
            SecureStore.deleteItemAsync('userinfo').catch((error) => console.log('Could not delete user info', error));
        }
    };

    const getImageFromCamera = async () => {
        const cameraPermission =
            await ImagePicker.requestCameraPermissionsAsync();

        if (cameraPermission.status === 'granted') {
            const capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1]
            });
            if (!capturedImage.cancelled) {
                console.log(capturedImage);
                processImage(capturedImage.uri);
            }
        }
    };

    const processImage = async (imgUri) => {
        const processedImage = await ImageManipulator.manipulateAsync(
            imgUri,
            [{ resize: { width: 400 } }],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );
        console.log(processedImage);
        setImageUrl(processedImage.uri);
        await MediaLibrary.saveToLibraryAsync(processedImage.uri);
    };

    const getImageFromGallery = async () => {
        const mediaLibraryPermissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (mediaLibraryPermissions.status === 'granted') {
            const capturedImage = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1]
            });
            if (!capturedImage.cancelled) {
                console.log(capturedImage);
                processImage(capturedImage.uri);
            }
        };
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: imageUrl }}
                        loadingIndicatorSource={logo}
                        style={styles.image}
                    />
                    <Button title='Camera' onPress={getImageFromCamera} />
                    <Button title='Gallery' onPress={getImageFromGallery} />
                </View>
                <Input
                    placeholder='Username'
                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}

                    //whenever the text value is changed, this will update the username state variable, using the setting function, setUsername
                    onChangeText={(text) => setUsername(text)}
                    value={username}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />
                <Input
                    placeholder='Password'
                    leftIcon={{ type: 'font-awesome', name: 'key' }}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />
                <Input
                    placeholder='First Name'
                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                    onChangeText={(text) => setFirstName(text)}
                    value={firstName}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />
                <Input
                    placeholder='Last Name'
                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                    onChangeText={(text) => setLastName(text)}
                    value={lastName}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />
                <Input
                    placeholder='Email'
                    leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />

                <CheckBox
                    title='Remember Me'
                    center
                    //similar to the value prop
                    checked={remember}
                    //use onPress prop to change the state to the opposite value
                    onPress={() => setRemember(!remember)}
                    containerStyle={styles.formCheckBox}
                />
                <View style={styles.formButton}>
                    <Button
                        onPress={() => handleRegister()}
                        title='Register'
                        color='#5637DD'
                        icon={
                            <Icon
                                name='user-plus'
                                type='font-awesome'
                                color='#fff'
                                iconStyle={{ marginRight: 10 }}
                            />
                        }
                        buttonStyle={{ backgroundColor: '#5637DD' }}
                    />
                </View>
            </View>
        </ScrollView>
    )
};

const Tab = createBottomTabNavigator();

const LoginScreen = () => {
    const tabBarOptions = {
        activeBackgroundColor: '#5637DD',
        inactiveBAckgroundColor: 'CEC8FF',
        activeTintColor: '#fff',
        inactiveTintColor: '#808080',
        labelStyle: { fontSize: 16 }
    }
    return (
        <Tab.Navigator tabBarOptions={tabBarOptions}>
            <Tab.Screen
                name='Login'
                component={LoginTab}
                options={{
                    tabBarIcon: (props) => {
                        return (
                            <Icon
                                name='sign-in'
                                type='font-awesome'
                                color={props.color}
                            />
                        )
                    }
                }}
            />
            <Tab.Screen
                name='Register'
                component={RegisterTab}
                options={{
                    tabBarIcon: (props) => {
                        return (
                            <Icon
                                name='user-plus'
                                type='font-awesome'
                                color={props.color}
                            />
                        )
                    }
                }}
            />
        </Tab.Navigator>
    )
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 10
    },
    formIcon: {
        marginRight: 10
    },
    formInput: {
        padding: 8,
        height: 60
    },
    formCheckBox: {
        margin: 8,
        backgroundColor: null
    },
    formButton: {
        margin: 20,
        marginRight: 40,
        marginLeft: 40
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: 10
    },
    image: {
        width: 60,
        height: 60
    }
});


export default LoginScreen;