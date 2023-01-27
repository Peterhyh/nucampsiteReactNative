import { useState } from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Switch,
    Button,
    Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';

const ReservationScreen = () => {
    //tracking the value in our reservation form. One state variable for each input
    const [campers, setCampers] = useState(1);
    const [hikeIn, setHikeIn] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    //Using a local state to see if the Modal will be shown or not. True=Modal shown False=Modal hidden
    const [showModal, setShowModal] = useState(false);

    //when a date is selected, we will be setting the date state variable with the setDate function
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowCalendar(Platform.OS === 'ios');
        setDate(currentDate);
    };

    //Logging the form values from the state, to the console, then displaying the Modal.
    //We use '!showModal' because the default was set to 'false' above (useState).
    const handleReservation = () => {
        //This will echo back values using console.log. 
        console.log('campers:', campers);
        console.log('hikeIn:', hikeIn);
        console.log('date:', date);
        setShowModal(!showModal);
    };
    //Resetting the state to its initial values
    const resetForm = () => {
        setCampers(1);
        setHikeIn(false);
        setDate(new Date());
        setShowCalendar(false);
    };

    //returning a ScrollView, using View component with formRow style for each of our inputs, 
    //Text components will label each of our inputs, giving the user an option to choose 1-6 by using picker component
    return (
        <ScrollView>
            <Animatable.View
                animation='zoomIn'
                duration={2000}
                delay={1000}
            >
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Campers:</Text>
                    <Picker
                        style={styles.formItem}
                        //The picker component comes with the built-in prop called selectedValue and onValueChange.
                        selectedValue={campers}
                        //This will set to a callback function that gets called each time the user makes a selection with picker. 
                        //The parameter will be the new item value that the user selected. We can use this new item value to set 
                        //our local state variable 'Campers' with setCampers function.
                        onValueChange={(itemValue) => setCampers(itemValue)}
                    >
                        <Picker.Item
                            //label is what the user can see and value is what is being passed to the onValueChange prop when the 
                            //user makes a selection.
                            label='1'
                            value={1}
                        />
                        <Picker.Item
                            label='2'
                            value={2}
                        />
                        <Picker.Item
                            label='3'
                            value={3}
                        />
                        <Picker.Item
                            label='4'
                            value={4}
                        />
                        <Picker.Item
                            label='5'
                            value={5}
                        />
                        <Picker.Item
                            label='6'
                            value={6}
                        />
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Hike In?</Text>
                    <Switch
                        style={styles.formItem}
                        //Switch props: value and trackColor
                        value={hikeIn}
                        trackColor={{ true: '#5637DD', false: null }}
                        //On value change prop works much like picker, which will trigger once the user changes the value. 
                        onValueChange={(value) => setHikeIn(value)}
                    />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date:</Text>
                    <Button
                        //To toggle the showCalendar state variable by using !showCalendar
                        onPress={() => setShowCalendar(!showCalendar)}
                        //title will containt the date state variable to the US value (month, day and year).
                        title={date.toLocaleDateString('en-US')}
                        color='#5637DD'
                        //To help with screen readers
                        accessibilityLabel='Tap me to select a reservation date'
                    />
                </View>
                <View //Setting up the DateTimePicker component, to give user a way to select the date of reservation on the calendar. NOTE: only show the DateTimePicker if the show calendar state variable is set to TRUE from the user clicking the button above. If showCalendar is false, the DateTimePicker will not show at all. This is a conditional statement without using the If statement
                >
                    {showCalendar && (
                        <DateTimePicker
                            style={styles.formItem}
                            value={date}
                            mode='date'
                            display='default'
                            onChange={onDateChange}
                        />
                    )}
                </View>
                <View //Button creation to submit
                    style={styles.formRow}
                >
                    <Button
                        onPress={() => Alert.alert('Begin Search?',
                            'Number of Campers: ' + campers + '\n\nHike-In? ' + hikeIn + '\n\nDate: ' + date.toLocaleDateString(),
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('')
                                },
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        handleReservation();
                                        resetForm();
                                    }
                                }
                            ]
                        )}
                        title='Search Availability'
                        color='#5637DD'
                        accessibilityLabel='Tap me to search for availiable campsites to reserve'
                    />
                </View>
            </Animatable.View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#5637DD',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default ReservationScreen;