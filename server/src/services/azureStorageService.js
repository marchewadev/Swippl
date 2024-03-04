const path = require("path");
const sharp = require("sharp");
const crypto = require("crypto");
const { BlobServiceClient } = require("@azure/storage-blob");

async function uploadToAzureBlobStorage(file) {
  try {
    // Create a blob service client
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(
      process.env.AZURE_STORAGE_CONTAINER_NAME
    );

    // Generate a random string to use as the blob name safe for use in URLs
    const randomString = crypto.randomBytes(15).toString("base64url");
    // Use the random string as the blob name
    const blobName = `avatar_${randomString}${path.extname(file.originalname)}`;
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Resize and reduce quality of the image to save storage space
    const processedBuffer = await sharp(file.buffer)
      .resize(300, 300, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload the blob
    await blockBlobClient.upload(processedBuffer, processedBuffer.length);

    // Return the URL of the uploaded blob
    return blockBlobClient.url;
  } catch (e) {
    throw new Error(
      "Wystąpił błąd podczas przesyłania pliku. Spróbuj ponownie."
    );
  }
}

async function deleteFromAzureBlobStorage(fileURL) {
  try {
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
  } catch (e) {
    throw new Error("Wystąpił błąd podczas usuwania pliku. Spróbuj ponownie.");
  }
}

module.exports = { uploadToAzureBlobStorage, deleteFromAzureBlobStorage };
