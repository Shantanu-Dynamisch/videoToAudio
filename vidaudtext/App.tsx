// // FINAL CODE 
// import React, { useState } from 'react';
// import { View, Button, Alert } from 'react-native';
// import Video from 'react-native-video';
// import { launchImageLibrary } from 'react-native-image-picker';
// import RNFS from 'react-native-fs';
// import { FFmpegKit } from 'ffmpeg-kit-react-native';

// const VideoToAudioConverter = () => {
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [selectedVideoUri, setSelectedVideoUri] = useState(null);

//   const handleVideoSelection = () => {
//     const options = {
//       mediaType: 'video',
//       videoQuality: 'high',
//     };

//     launchImageLibrary(options, response => {
//       console.log(response)
//       if (response.didCancel) {
//         console.log('User cancelled the video selection');
//       } else if (response.uri) {
//         console.log('Selected video URI:', response.uri);
//         setSelectedVideoUri(response.uri);
//       } else if (response.assets && response.assets.length > 0) {
//         const selectedVideo = response.assets[0];
//         console.log('Selected video URI:', selectedVideo.uri);
//         setSelectedVideoUri(selectedVideo.uri);
//       } else {
//         console.error('Error selecting video: No assets found in the response');
//       }
//     });
//   };

//   // const extractAudioFromVideo = async () => {
//   //   try {
//   //     setIsProcessing(true);

//   //     const inputVideoPath = selectedVideoUri;
//   //     const outputAudioPath = `${RNFS.DocumentDirectoryPath}/outputAudio.aac`;

//   //     const ffmpegCommand = `-i ${inputVideoPath} -vn -acodec aac ${outputAudioPath}`;

//   //     console.log('FFmpeg command:', ffmpegCommand);

//   //     const result = await FFmpegKit.executeAsync(ffmpegCommand);

//   //     console.log('FFmpeg execution result:', result);

//   //     if (result.getReturnCode() === FFmpegKit.RETURN_CODE_SUCCESS) {
//   //       Alert.alert('Extraction completed successfully.');
//   //     } else {
//   //       Alert.alert('Extraction process failed.');
//   //     }
//   //   } catch (error) {
//   //     console.error('Error during extraction:', error);
//   //   } finally {
//   //     setIsProcessing(false);
//   //   }
//   // };

//   const extractAudioFromVideo = async () => {
//     try {
//       setIsProcessing(true);
  
//       const inputVideoPath = selectedVideoUri;
//       const outputAudioPath = `${RNFS.ExternalDirectoryPath}/outputAudio.aac`;
  
//       const ffmpegCommand = `-i ${inputVideoPath} -vn -acodec aac ${outputAudioPath}`;
  
//       console.log('FFmpeg command:', ffmpegCommand);
  
//       const result = await FFmpegKit.executeAsync(ffmpegCommand);
  
//       console.log('FFmpeg execution result:', result);
  
//       if (result.getReturnCode() === FFmpegKit.RETURN_CODE_SUCCESS) {
//         Alert.alert('Extraction completed successfully.');
//       } else {
//         Alert.alert('Extraction process failed.');
//       }
//     } catch (error) {
//       console.error('Error during extraction:', error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };
  

//   return (
//     <View>
//       {selectedVideoUri ? (
//         <Video
//           source={{ uri: selectedVideoUri }}
//           style={{ width: 320, height: 240 }}
//           resizeMode="contain"
//           controls
//           paused={isProcessing}
//           onLoad={() => {
//             setIsProcessing(false);
//           }}
//         />
//       ) : null}
//       <Button title="Select Video" onPress={handleVideoSelection} disabled={isProcessing} />
//       {selectedVideoUri && (
//         <Button title="Extract Audio" onPress={extractAudioFromVideo} disabled={isProcessing} />
//       )}
//     </View>
//   );
// };

// export default VideoToAudioConverter;



// FINAL CODE 
// import React, { useState, useEffect } from 'react';
// import { View, Button, Alert } from 'react-native';
// import Video from 'react-native-video';
// import { launchImageLibrary } from 'react-native-image-picker';
// import RNFS from 'react-native-fs';
// import { FFmpegKit } from 'ffmpeg-kit-react-native';
// import Permissions from 'react-native-permissions';

// const VideoToAudioConverter = () => {
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [selectedVideoUri, setSelectedVideoUri] = useState(null);


//     // Request permission to write to external storage (Downloads directory)
//     useEffect(() => {
//       Permissions.request('android.permission.WRITE_EXTERNAL_STORAGE').then(response => {
//         if (response !== 'authorized') {
//           console.log('Permission to write to external storage denied.');
//         }
//       });
//     }, []);

import React, { useState, useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import Permissions from 'react-native-permissions';

const VideoToAudioConverter = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVideoUri, setSelectedVideoUri] = useState(null);


  useEffect(() => {
    Permissions.check('android.permission.WRITE_EXTERNAL_STORAGE').then(response => {
      console.warn(response)
      if (response !== 'authorized') {
        console.warn('if hiii')
        requestStoragePermission();
      }
    });
  }, []);

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
      const outputAudioPath = `${RNFS.ExternalDirectoryPath}/Download/outputAudio.mp3`;

      const ffmpegCommand = `-i ${inputVideoPath} -vn -acodec libmp3lame ${outputAudioPath}`;

      console.log('FFmpeg command:', ffmpegCommand);

      const result = await FFmpegKit.executeAsync(ffmpegCommand);

      console.log('FFmpeg execution result:', result);

      if (result.getReturnCode() === FFmpegKit.RETURN_CODE_SUCCESS) {
        Alert.alert('Extraction completed successfully.');
      } else {
        Alert.alert('Extraction process failed.');
      }
    } catch (error) {
      console.error('Error during extraction:', error);
    } finally {
      setIsProcessing(false);
    }
  };


  // const extractAudioFromVideo = async () => {
  //   try {
  //     setIsProcessing(true);

  //     const inputVideoPath = selectedVideoUri;
  //     const outputAudioPath = `${RNFS.DocumentDirectoryPath}/outputAudio.aac`;

  //     const ffmpegCommand = `-i ${inputVideoPath} -vn -acodec aac ${outputAudioPath}`;

  //     console.log('FFmpeg command:', ffmpegCommand);

  //     const result = await FFmpegKit.executeAsync(ffmpegCommand);

  //     console.log('FFmpeg execution result:', result);

  //     if (result.getReturnCode() === FFmpegKit.RETURN_CODE_SUCCESS) {
  //       Alert.alert('Extraction completed successfully.');
  //     } else {
  //       Alert.alert('Extraction process failed.');
  //     }
  //   } catch (error) {
  //     console.error('Error during extraction:', error);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  // const extractAudioFromVideo = async () => {
  //   try {
  //     setIsProcessing(true);
  
  //     const inputVideoPath = selectedVideoUri;
  //     const outputAudioPath = `${RNFS.ExternalDirectoryPath}/outputAudio.aac`;
  
  //     const ffmpegCommand = `-i ${inputVideoPath} -vn -acodec aac ${outputAudioPath}`;
  
  //     console.log('FFmpeg command:', ffmpegCommand);
  
  //     const result = await FFmpegKit.executeAsync(ffmpegCommand);
  
  //     console.log('FFmpeg execution result:', result);
  
  //     if (result.getReturnCode() === FFmpegKit.RETURN_CODE_SUCCESS) {
  //       Alert.alert('Extraction completed successfully.');
  //     } else {
  //       Alert.alert('Extraction process failed.');
  //     }
  //   } catch (error) {
  //     console.error('Error during extraction:', error);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };
  

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
    </View>
  );
};

export default VideoToAudioConverter;
