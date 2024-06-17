import React from 'react';
import {
  View,
  Button,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
  ImageBackground,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';

const HomeScreen = ({navigation}) => {
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        handleTakePhoto();
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission Denied',
          'You have denied camera permission. Please go to app settings and enable camera permission manually.',
          [
            {
              text: 'Go to Settings',
              onPress: () => {
                Linking.openSettings();
              },
            },
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
          ],
        );
      } else {
        Alert.alert(
          'Permission Denied',
          'You need to grant camera permission to take photos.',
        );
      }
    } catch (err) {
      console.warn('Error requesting camera permission:', err);
    }
  };

  const requestGalleryPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Gallery Permission',
            message: 'App needs access to your gallery',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          handleChooseFromGallery();
        } else {
          Alert.alert(
            'Permission Denied',
            'You need to grant gallery permission to choose photos.',
          );
        }
      } else {
        handleChooseFromGallery();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleTakePhoto = () => {
    ImageCropPicker.openCamera({
      width: 800,
      height: 600,
      cropping: true,
    })
      .then(image => {
        navigation.navigate('ImageEditing', {imageUri: image.path});
      })
      .catch(error => {
        console.log('ImagePicker Error: ', error);
      });
  };

  const handleChooseFromGallery = () => {
    ImageCropPicker.openPicker({
      width: 800,
      height: 600,
      cropping: true,
    })
      .then(image => {
        navigation.navigate('ImageEditing', {imageUri: image.path});
      })
      .catch(error => {
        console.log('ImagePicker Error: ', error);
      });
  };

  return (
    <ImageBackground
      source={require('../assets/bg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            title="Take Photo"
            onPress={requestCameraPermission}
            color="transparent"

          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Choose from Gallery"
            onPress={requestGalleryPermission}
            color="transparent"
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 250,
    height: 250,
    marginVertical: 10,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
