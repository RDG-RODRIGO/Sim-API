module.exports = {
  config: {
    name: "imgur",
    version: "1.0",
    author: "Jubayer", 
    countDown: 5, 
    role: 0,
    shortDescription: "Upload image or video to Imgur",
    longDescription: "Uploads an image or video from a provided link or reply attachment to Imgur and returns the Imgur link.",
    category: "utility",
    guide: " [reply to image] "
  },

  onStart: async function ({ api, event, args, message }) {
    const axios = global.nodemodule['axios'];

    
    let linkanh = event.messageReply?.attachments[0]?.url || args.join(" ");
    if (!linkanh) {
      return api.sendMessage('[⚜️]➜ Please provide an image or video link or reply to an attachment.', event.threadID, event.messageID);
    }

    try {
      // Clean and validate URL
      linkanh = linkanh.replace(/\s/g, '');
      if (!/^https?:\/\//.test(linkanh)) {
        return api.sendMessage('[⚜️]➜ Invalid URL: URL must start with http:// or https://', event.threadID, event.messageID);
      }

      
      const attachments = event.messageReply?.attachments || [{ url: linkanh }];

      
      const apis = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
      const n = apis.data.api;

      
      const allPromises = attachments.map(item => {
        const encodedItemUrl = encodeURIComponent(item.url);
        return axios.get(`${n}/imgur?url=${encodedItemUrl}`);
      });

      const results = await Promise.all(allPromises);

      
      const imgurLinks = results.map(result => result.data.success ? result.data.link : 'Upload failed');

     
      console.log(`[IMGUR] Uploaded ${imgurLinks.length} files for thread ${event.threadID}`);

    
      return api.sendMessage(`Uploaded Imgur Links:\n${imgurLinks.join('\n')}`, event.threadID, event.messageID);
    } catch (e) {
      // Log error to console
      console.error(`[IMGUR ERROR] Failed to upload for thread ${event.threadID}:`, e);

      
      return api.sendMessage('[⚜️]➜ An error occurred while uploading the image or video.', event.threadID, event.messageID);
    }
  }
};
