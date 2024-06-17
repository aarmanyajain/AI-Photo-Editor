import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {captureScreen} from 'react-native-view-shot';
import Share from 'react-native-share';
import * as CameraRoll from '@react-native-camera-roll/camera-roll'; // Correct import
import RNFS from 'react-native-fs';




const enhancedImageUri = require('../assets/aesthetic3.png');

const ImageEditingScreen = ({route}) => {
  const {imageUri} = route.params;
  const [editedImageUri, setEditedImageUri] = useState(imageUri);
  const [textInputVisible, setTextInputVisible] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [appliedTexts, setAppliedTexts] = useState([]);
  const [enhancedImageVisible, setEnhancedImageVisible] = useState(false);
  const [aiEnhancerDisabled, setAiEnhancerDisabled] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity onPress={handleSave}>
            <Image
              source={require('../assets/downloads.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare}>
            <Image
              source={require('../assets/share.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const handleAddText = () => {
    setTextInputVisible(true);
  };

  const handleApplyText = () => {
    const newText = {
      id: Date.now(),
      text: textValue,
      position: {x: 0, y: 0},
    };
    setAppliedTexts([...appliedTexts, newText]);
    setTextValue('');
    setTextInputVisible(false);
  };

  const handleDeleteText = id => {
    const updatedTexts = appliedTexts.filter(text => text.id !== id);
    setAppliedTexts(updatedTexts);
  };

  const handleTextPress = (id, event) => {
    const {locationX, locationY} = event.nativeEvent;
    const updatedTexts = appliedTexts.map(text =>
      text.id === id ? {...text, position: {x: locationX, y: locationY}} : text,
    );
    setAppliedTexts(updatedTexts);
  };

  const handleAIEnhancer = () => {
    console.log('AI Enhancer button pressed');
    setEnhancedImageVisible(true);
    setAiEnhancerDisabled(true);
  };

  const handleDisable = () => {
    console.log('Disable button pressed');
    setAiEnhancerDisabled(false);
    setEnhancedImageVisible(false);
  };

  const handleSave = async () => {
    try {
      const uri = await captureScreen({
        format: 'png',
        quality: 0.8,
      });
      console.log('Image captured:', uri);

      // Get the directory path for saving the image
      const galleryDir = Platform.select({
        ios: RNFS.LibraryDirectoryPath,
        android: RNFS.ExternalDirectoryPath + '/Pictures', // Or use 'DCIM/Pictures' for some devices
      });

      // Construct the destination path
      const imageName = 'edited_image.png'; // You can change the name if needed
      const destinationPath = `${galleryDir}/${imageName}`;

      // Move the image file to the gallery directory
      await RNFS.moveFile(uri, destinationPath);

      // Notify user that image has been saved
      alert('Image saved to gallery');

      // Handle opening with the default photo viewer (works for iOS)
      if (Platform.OS === 'ios') {
        Linking.openURL(destinationPath);
      }
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const handleShare = async () => {
    try {
      const shareOptions = {
        message: 'Check out this awesome edited image!',
        url: editedImageUri,
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  const mergeAllEdits = imageUri => {
    // Merge all edits (applied texts, AI enhancement, etc.) with the captured image
    // You can implement this function based on your specific requirements
    // For React Native, you may need to use a library or native modules for image processing
    // This example assumes a browser environment for canvas usage
    // Adjust as needed for React Native environment
    // This function should return the merged image URI
    return imageUri; // Placeholder implementation
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setTextInputVisible(false)}>
        <Image source={{uri: editedImageUri}} style={styles.image} />
        {appliedTexts.map(appliedText => (
          <TouchableOpacity
            key={appliedText.id}
            onPress={event => handleTextPress(appliedText.id, event)}
            style={[
              styles.appliedTextContainer,
              {left: appliedText.position.x, top: appliedText.position.y},
            ]}>
            <Text style={styles.appliedText}>{appliedText.text}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteText(appliedText.id)}>
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <Image
          source={enhancedImageUri}
          style={[
            styles.image,
            styles.enhancedImage,
            {display: enhancedImageVisible ? 'flex' : 'none'},
          ]}
        />
      </TouchableOpacity>

      {textInputVisible && (
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type something..."
            placeholderTextColor={'black'}
            value={textValue}
            onChangeText={text => setTextValue(text)}
            autoFocus={true}
          />
          <TouchableOpacity
            onPress={handleApplyText}
            style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      )}

      <Button title="Add Text" onPress={handleAddText} />

      {aiEnhancerDisabled ? (
        <Button title="Disable" onPress={handleDisable} />
      ) : (
        <Button
          title="AI Aesthetic Enhancer"
          onPress={handleAIEnhancer}
          disabled={aiEnhancerDisabled}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  textInputContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 5,
    backgroundColor: 'white',
    color: 'black',
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  appliedTextContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  appliedText: {
    color: 'black',
    fontSize: 30,
  },
  deleteButton: {
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  enhancedImage: {
    width: 300,
    height: 300,
    position: 'absolute',
    opacity: 0.3,
  },
  headerRightContainer: {
    flexDirection: 'row',
    marginRight: 10,
    marginTop: Platform.OS === 'android' ? 0 : 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
});

export default ImageEditingScreen;
