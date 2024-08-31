const base64url = (str) => {
    // Convert string to base64
    const base64 = Buffer.from(str).toString('base64');
    // Replace characters to make it URL-safe
    return base64.replace(/\+/g, '_').replace(/\//g, '_').replace(/=+$/, '');
  };
  
  module.exports = { base64url };
  