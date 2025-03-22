const cron = require('node-cron');
const { Post } = require('../../models');
const evaluateImageContent = require('../../helpers/checkingImgaePoint');
require('dotenv').config();
const dayjs = require('dayjs');
const checkImage = require('../../helpers/aiCheckingImg');

cron.schedule('*/1 * * * *', async () => {
  try {
    console.log(' Checking posts with status WAITING...');
    const posts = await Post.find({ status: 'WAITING' });
    if (!posts.length) {
      console.log(' No posts to check.');
      return;
    }

    for (const post of posts) {
      let aiCheckFailed = false;
      let allApproved = true;
      const updatedImages = [];

      console.log(` Checking post ID: ${post._id}`);

      const checkResults = await Promise.allSettled(
        post.images.map(async (image) => {
          const reasonReject = [];
          try {
            const result = await checkImage(image.url);
            if (!result || result.status !== 'success') {
              throw new Error(`Invalid API response for ${image.url}`);
            }

            const evaluation = evaluateImageContent(result, {});
            if (!evaluation || typeof evaluation.approved === 'undefined') {
              throw new Error(`Evaluation failed for ${image.url}`);
            }

            if (!evaluation.approved) {
              reasonReject.push(...evaluation.reasons);
              allApproved = false;
              console.log(
                ` Image ${image.url} rejected: ${evaluation.reasons.join(', ')}`
              );
            }
          } catch (error) {
            console.error(
              ` Error checking image ${image.url}:`,
              error.message
            );
            reasonReject.push(error.message);
            aiCheckFailed = true;
            allApproved = false;
          }

          return {
            url: image.url,
            index: image.index,
            reasonReject: reasonReject.length > 0 ? reasonReject : [],
          };
        })
      );

      checkResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          updatedImages.push(result.value);
        } else {
          console.error(` Image check failed unexpectedly:`, result.reason);

          updatedImages.push({
            url: result.reason.image?.url || 'unknown',
            index: result.reason.image?.index || 0,
            reasonReject: [result.reason.message || 'Unknown error'],
          });
          aiCheckFailed = true;
          allApproved = false;
        }
      });

      let newStatus = allApproved ? 'SELLING' : 'REJECTED';
      if (aiCheckFailed) {
        newStatus = 'WAITING|AI_CHECKING_FAILED';
      }
      await Post.findByIdAndUpdate(
        post._id,
        {
          status: newStatus,
          ...(newStatus === 'SELLING' && {
            expiredAt: dayjs().add(2, 'months').toDate(),
          }),
          images: updatedImages,
        },
        { new: true }
      );

      console.log(` Post ID: ${post._id} updated to ${newStatus}`);
    }
  } catch (error) {
    console.error(' Error checking posts:', error);
  }
});



cron.schedule('*/5 * * * *', async () => {
  console.log(' Checking posts with status WAITING|AI_CHECKING_FAILED...');
  try {
    const posts = await Post.find({
      status: { $in: ['WAITING', 'WAITING|AI_CHECKING_FAILED', 'REJECTED'] },
    });
    for (const post of posts) {
      if (dayjs().diff(dayjs(post.createdAt), 'days') > 1) {
        const deletePost = await Post.deletyById(post._id);
        if (!deletePost) {
          console.log(` Delete post ${post._id} failed`);
        } else {
          console.log(`✅ Delete post ${post._id} successfully`);
        }
      }
    }
  } catch (error) {
    console.error(' Error checking posts:', error);
  }
});
cron.schedule('*/5 * * * *', async () => {
  console.log(' Checking posts with status SELLING');
  try {
    const posts = await Post.find({
      status: 'SELLING',
    });
    for (const post of posts) {
      if (dayjs().diff(dayjs(post.expiredAt), 'days') > 0) {
        const updatePost = await Post.findByIdAndUpdate(post._id, {
          status: 'EXPIRED',
        });
        if (!updatePost) {
          console.log(` Update post ${post._id} failed`);
        } else {
          console.log(` Update post ${post._id} successfully`);
        }
      }
    }
  } catch (error) {
    console.error(' Error checking posts:', error);
  }
});
module.exports = cron;
