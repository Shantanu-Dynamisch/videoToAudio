import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Text, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import Permissions from 'react-native-permissions';
import Voice from '@react-native-voice/voice';
// import axios from 'axios';

const VideoToAudioConverter = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVideoUri, setSelectedVideoUri] = useState(null);
  const [transcription, setTranscription] = useState('');

  useEffect(() => {
    Permissions.check('android.permission.WRITE_EXTERNAL_STORAGE').then(response => {
      console.warn(response)
      if (response !== 'authorized') {
        console.warn('if hiii')
        requestStoragePermission();
      }
    });

    // Set up voice recognition
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;

    return () => {
      // Clean up voice recognition listeners
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    setIsProcessing(true);
    console.warn('Started listening');
  };

  const onSpeechPartialResults = (event: { value: any; }) => {
    const { value } = event;
    if (value && value.length > 0) {
      setTranscription(value[0]);
      console.warn('Recognized Text:', value[0]);
    }
  };

  const onSpeechEnd = () => {
    setIsProcessing(false);
    console.warn('Stopped listening');
  };

  const onSpeechError = (event: { error: any; }) => {
    console.warn('Speech recognition error:', event.error);
  };

  const requestStoragePermission = () => {
    Permissions.request('android.permission.WRITE_EXTERNAL_STORAGE').then(response => {
      if (response !== 'authorized') {
        console.log('Permission to write to external storage denied.');
      }
    });
  };

  const handleVideoSelection = () => {
    const options = {
      mediaType: 'video',
      videoQuality: 'high',
    };

    launchImageLibrary(options, response => {
      console.log(response)
      if (response.didCancel) {
        console.log('User cancelled the video selection');
      } else if (response.uri) {
        console.log('Selected video URI:', response.uri);
        setSelectedVideoUri(response.uri);
      } else if (response.assets && response.assets.length > 0) {
        const selectedVideo = response.assets[0];
        console.log('Selected video URI:', selectedVideo.uri);
        setSelectedVideoUri(selectedVideo.uri);
      } else {
        console.error('Error selecting video: No assets found in the response');
      }
    });
  };

  const extractAudioFromVideo = async () => {
    try {
      setIsProcessing(true);

      const inputVideoPath = selectedVideoUri;
      const outputAudioPath = `${RNFS.ExternalDirectoryPath}/a4.aac`;

      const ffmpegCommand = `-i ${inputVideoPath} -vn -acodec aac ${outputAudioPath}`;

      console.log('FFmpeg command:', ffmpegCommand);

      const result = await FFmpegKit.executeAsync(ffmpegCommand);

      console.log('FFmpeg execution result:', result);

      if (result.getReturnCode() === FFmpegKit.RETURN_CODE_SUCCESS) {
        Alert.alert('Extraction completed successfully.');
        transcribeAudio(outputAudioPath);
        console.warn(outputAudioPath)
      } else {
        Alert.alert('Extraction process failed.');
      }
    } catch (error) {
      console.error('Error during extraction:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const transcribeAudio = async (audioPath: string) => {
    try {
      setTranscription('');
  
      Voice.onSpeechResults = onSpeechResults;
  
      Voice.start('en-US');
  
      setTimeout(async () => {
        await Voice.stop();
      }, 5000); // Adjust the duration as needed
    } catch (error) {
      console.error('Error during transcription:', error);
    }
  };
  
  const onSpeechResults = (event: { value: any; }) => {
    const { value } = event;
    if (value && value.length > 0) {
      setTranscription(value[0]);
      console.warn('Transcription Result:', value[0]);
    }
  };
  
  return (
    <View>
      {selectedVideoUri ? (
        <Video
          source={{ uri: selectedVideoUri }}
          style={{ width: 320, height: 240 }}
          resizeMode="contain"
          controls
          paused={isProcessing}
          onLoad={() => {
            setIsProcessing(false);
          }}
        />
      ) : null}
      <Button title="Select Video" onPress={handleVideoSelection} disabled={isProcessing} />
      {selectedVideoUri && (
        <Button title="Extract Audio" onPress={extractAudioFromVideo} disabled={isProcessing} />
      )}
      {transcription ? <Text>Transcription: {transcription}</Text> : null}
    </View>
  );
};

export default VideoToAudioConverter;
