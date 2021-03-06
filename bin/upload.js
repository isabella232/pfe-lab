/*
  An S3 uploader with some useful default settings for Zooniverse static files.
  Accepts a local path and an S3 path, relative to zooniverse-static, as its arguments.
  Usage example: node upload.js dist preview.zooniverse.org/pfe-lab/cache-control
*/
const Uploader = require('s3-batch-upload').default;

const args = process.argv.slice(2);
const [ localPath, remotePath ] = args;

async function uploadBuild() {
  const uploader = new Uploader({
    bucket: 'zooniverse-static',
    localPath,
    remotePath,
    concurrency: '200',
    cacheControl: {
      '**/index.html': 'max-age=60',
      '**/*.*': 'public, max-age=604800, immutable'
    },
    accessControlLevel: 'public-read'
  });

  const files = await uploader.upload();
  console.log('Uploaded to S3');
  console.log(files.join('\n'));
}

uploadBuild();