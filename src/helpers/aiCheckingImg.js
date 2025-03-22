const axios = require('axios');
/**
 * Gửi ảnh lên API SightEngine để kiểm tra nội dung
 * @param {string} imagePath - Đường dẫn tới file ảnh
 * @returns {Promise<Object>} - Kết quả phân tích từ API
 */
const checkImage = async (imagePath) => {
  try {
    const response = await axios.get(
      'https://api.sightengine.com/1.0/check-workflow.json',
      {
        params: {
          url: imagePath,
          workflow: 'wfl_i82TKxJD9c9oVBe9cQW2k',
          api_user: '1222006132',
          api_secret: 'RX7Rro7YXqvzRhPnvwNsVWfUEQyin8Xt',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(' API Error:', error.response.data);
    } else {
      console.error(' Network/Error:', error.message);
    }
    throw error;
  }
};

// //index.js file

// /////////////////////////////////////////////////////////////////////////////////
// // In this section, we set the user authentication, app ID, workflow ID, and
// // image URL. Change these strings to run your own example.
// ////////////////////////////////////////////////////////////////////////////////

// const USER_ID = '9tebqgjhz4uk';
// // Your PAT (Personal Access Token) can be found in the Account's Security section
// const PAT = 'f031519200dc4892a179ac476205bba6';
// const APP_ID = 'Happyhunt';
// // Change these to make your own predictions
// const WORKFLOW_ID = 'General';
// const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

// /////////////////////////////////////////////////////////////////////////////
// // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
// /////////////////////////////////////////////////////////////////////////////

// const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

// const stub = ClarifaiStub.grpc();

// // This will be used by every Clarifai endpoint call
// const metadata = new grpc.Metadata();
// metadata.set('authorization', 'Key ' + PAT);

// stub.PostWorkflowResults(
//   {
//     user_app_id: {
//       user_id: USER_ID,
//       app_id: APP_ID,
//     },
//     workflow_id: WORKFLOW_ID,
//     inputs: [
//       {
//         data: {
//           image: {
//             url: 'http://res.cloudinary.com/dilansmo4/image/upload/v1742570638/happyhunt-1742570638461.jpg',
//           },
//         },
//       },
//     ],
//   },
//   metadata,
//   (err, response) => {
//     if (err) {
//       throw new Error(err);
//     }

//     if (response.status.code !== 10000) {
//       throw new Error(
//         'Post workflow results failed, status: ' + response.status.description
//       );
//     }

//     // We'll get one WorkflowResult for each input we used above. Because of one input, we have here
//     // one WorkflowResult.
//     const results = response.results[0];

//     // Each model we have in the workflow will produce one output.
//     for (const output of results.outputs) {
//       const model = output.model;

//       console.log('Predicted concepts for the model `' + model.id + '`:');
//       for (const concept of output.data.concepts) {
//         console.log('\t' + concept.name + ' ' + concept.value);
//       }
//     }
//   }
// );

module.exports = checkImage;
