const { BlobServiceClient } = require("@azure/storage-blob");

async function uploadToAzureBlobStorage(file) {
  // Create a blob service client
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  );

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(
    process.env.AZURE_STORAGE_CONTAINER_NAME
  );

  // Get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);

  // Upload the blob
  await blockBlobClient.upload(file.buffer, file.buffer.length);

  // Return the URL of the uploaded blob
  return blockBlobClient.url;
}

async function deleteFromAzureBlobStorage(fileURL) {
  // Create a blob service client
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  );

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(
    process.env.AZURE_STORAGE_CONTAINER_NAME
  );

  // Parse the fileURL to get the blob name
  const url = new URL(fileURL);
  const blobName = url.pathname.substring(url.pathname.lastIndexOf("/") + 1);

  // Get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Delete the blob
  await blockBlobClient.delete();
}

module.exports = { uploadToAzureBlobStorage, deleteFromAzureBlobStorage };
