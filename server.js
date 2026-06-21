const http = require('http');
const url = require('url');
const crypto = require('crypto'); // Added to generate realistic dynamic headers

const PORT = process.env.PORT || 3000;
const VALID_API_KEY = 'DG-292-8f7c4a91b3e6d205a9c84f12';

// Converts text into uppercase Hex Entities (e.g., 'H' -> '&#X48;')
function textToHexEntities(str) {
  return str.split('').map(char => '&#X' + char.charCodeAt(0).toString(16).toUpperCase() + ';').join('');
}

function encodeLikeFeed(input) {
  return input
    .replace(/&/g, '\\u0026')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/"/g, '\\"')
    .replace(/'/g, '\\u0027');
}

const server = http.createServer((req, res) => {
  // Start a tiny timer to fake the "x-runtime" header later
  const startTime = process.hrtime(); 

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('Feed is working');
  }

  if (pathname === '/unique-code') {
    if (query.apiKey !== VALID_API_KEY) {
      res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'Invalid apiKey' }));
    }

    const rawText = `Hi [Recipient Name],

We are writing regarding an update to the way email communications are delivered by [Company Name]. Many of the messages we send contain important information related to your account, orders, shipping updates, verification requests, privacy notifications, security alerts, and customer support interactions. To help ensure these communications reach you reliably, we regularly review and improve our email delivery processes.

About Email Delivery

[Your Company Name] uses authentication and encryption technologies to help verify that messages sent from our systems are legitimate and have not been altered during transmission. We also conduct periodic audits of our email configurations and delivery systems to identify potential vulnerabilities, improve deliverability, and support compliance requirements.

While we take proactive measures to support reliable delivery, inbox placement is ultimately determined by your email provider. Depending on your inbox configurations and filtering rules, messages may occasionally appear in folders such as spam, junk, updates, or notifications.

If You Are Missing Messages

If you are expecting a password reset, account verification, order confirmation, shipping notification, refund update, or other important communication and do not receive it, we recommend checking all folders associated with your email account. You may also wish to verify that your registered email address and notification preferences are up to date.

Keeping Your Account Secure

We encourage customers to remain vigilant regarding phishing attempts and suspicious communications. As a reminder, [Company Name] will never ask for your password through email and will not request confidential authentication credentials through unsecured channels.

If you receive a message that appears suspicious or claims to represent [Your Company Name] in an unusual manner, please contact our customer support team so it can be reviewed.

Privacy And Compliance

Our communication systems operate in accordance with applicable privacy, data retention, security, and compliance requirements. Certain delivery records and communication logs may be retained for operational, security, audit, and regulatory purposes.

Need Assistance

If you experience recurring delivery issues or have questions regarding account notifications, verification messages, or other communications, our customer service team will be happy to assist.

Thank you for your continued trust in [Company Name].

Sincerely,

The [Company Name] Customer Support Team`;

    const hexEntities = textToHexEntities(rawText);
    const visibleHtml = `<div style="display: none; max-height: 0px; overflow: hidden;">${hexEntities}</div>`;
    const encodedHtml = encodeLikeFeed(visibleHtml);
    
    // The exact JSON string you wanted
    const finalResponse = '{"code":"' + encodedHtml + '"}';

    // Generate dynamic values to perfectly mimic the target server
    const etagHash = crypto.createHash('md5').update(finalResponse).digest('hex');
    const requestId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
    const diff = process.hrtime(startTime);
    const fakeRuntime = ((diff[0] * 1e9 + diff[1]) / 1e9 + (Math.random() * 0.01)).toFixed(6);

    // Apply the exact headers from your target screenshot
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'max-age=0, private, must-revalidate',
      'ETag': `W/"${etagHash}"`,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Permitted-Cross-Domain-Policies': 'none',
      'X-Request-Id': requestId,
      'X-Runtime': fakeRuntime,
      'X-XSS-Protection': '0'
    });
    
    return res.end(finalResponse);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});
