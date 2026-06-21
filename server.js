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

We are writing regarding an update to the way email communications are processed and delivered by [Company Name]. This notice is intended to provide additional information about message delivery, inbox placement, account-related notifications, and the steps we take to help ensure that important communications reach you reliably and securely.

Many of the messages sent by [Your Company Name] contain information related to your account, order activity, verification requests, shipping updates, privacy notifications, security alerts, support case correspondence, and other operational communications. Because these messages often contain important information, we continuously review our email infrastructure, authentication configurations, and delivery procedures to improve deliverability and reduce the likelihood of messages being delayed, filtered, or misclassified.

Purpose Of This Notice

Over the past several months, our teams have conducted a series of reviews related to message routing, sender authentication, inbox placement, and communication reliability. These reviews included technical audits of email authentication records, delivery patterns, bounce handling procedures, and communication preferences associated with customer accounts.

As part of this ongoing work, [Company Name] has refined several internal processes used to support email delivery. While no action is required on your part, we wanted to provide a detailed explanation of how these systems function and what you can do if expected messages do not arrive as anticipated.

Message Authentication

When [Your Company Name] sends an email, multiple verification procedures occur behind the scenes before the message reaches your inbox. These authentication processes help receiving mail providers determine whether a message genuinely originated from our systems and whether it has been altered during transmission.

Authentication technologies work alongside encryption mechanisms and delivery validation procedures to support message integrity. While no communication method can eliminate every possible risk, authentication helps reduce exposure to phishing attempts, fraud, unauthorized communications, and impersonation activity.

In addition to these protections, we routinely review sender configurations, transmission records, and delivery metrics. Internal audit procedures are conducted periodically to identify configuration issues, potential vulnerabilities, and unusual delivery behavior that may affect communications.

Inbox Placement And Deliverability

Email providers use a variety of factors when deciding where a message should appear. Depending on your inbox configurations, email history, engagement patterns, provider policies, and filtering rules, a message may be delivered to an inbox, updates folder, notifications category, archive folder, or spam folder.

Although [Company Name] carefully monitors deliverability performance, inbox placement ultimately depends on systems that are operated by third-party email providers. As a result, a message can occasionally be delayed or routed differently than expected.

If you believe you are missing communications from us, we recommend reviewing all available folders associated with your email account, including spam, junk, archive, promotions, updates, notifications, and quarantine folders where applicable.

You may also wish to verify that messages from [Your Company Name] have not been blocked by custom filtering rules, forwarding configurations, mailbox retention settings, or organizational email policies administered by your employer or service provider.

Expected Communications

Customers commonly receive communications regarding account verification, authentication requests, password changes, order processing, shipping updates, delivery notifications, customer support inquiries, privacy notices, policy updates, dispute resolution correspondence, refund processing, return eligibility reviews, and security-related alerts.

Certain communications may be transactional in nature and therefore continue to be delivered even if marketing preferences have been modified. These operational messages help ensure that customers receive important information regarding their accounts, orders, privacy rights, security notifications, and customer service interactions.

If you recently requested a password reset, verification message, order confirmation, shipping update, or account notification and do not receive it within a reasonable period of time, we encourage you to verify your email address, review inbox filtering settings, and contact customer support if assistance is required.

Security Awareness

Because email remains a common target for phishing campaigns and fraud attempts, we encourage customers to remain vigilant when reviewing messages that appear to originate from any company, including [Company Name].

Official communications should be reviewed carefully before responding to requests for information. If a message appears suspicious, contains unexpected attachments, requests confidential information, or directs you to unfamiliar websites, we recommend exercising caution until the communication can be verified.

As a reminder, [Company Name] will never request your password via email. We also do not ask customers to provide sensitive authentication credentials through unsecured communications channels.

If you receive a suspicious message claiming to represent [Your Company Name], please notify our support team so that the communication can be reviewed. Reports from customers help us identify unauthorized activity, investigate potential fraud attempts, and improve protection measures.

Account Information Accuracy

Reliable delivery depends heavily on accurate account information. Customers should periodically verify that their registered email address, contact information, and notification preferences remain current.

An outdated email address may prevent delivery of security notifications, order updates, verification requests, refund communications, dispute resolution correspondence, and other important notices. If contact information changes, we encourage you to update your account records as soon as practical.

Verification processes may occasionally be used to confirm account ownership before certain changes can be completed. These procedures help protect customer data and reduce the risk of unauthorized account access.

Monitoring And Compliance

[Your Company Name] maintains policies related to privacy, data handling, retention, communication security, and regulatory compliance. These policies are reviewed periodically and may be updated to reflect operational requirements, legal obligations, technology changes, or customer feedback.

Delivery records, transmission logs, authentication outcomes, and communication metadata may be retained for limited periods to support troubleshooting, audit activities, fraud investigations, compliance obligations, and service reliability analysis.

These processes assist our teams in identifying delivery anomalies, investigating reported incidents, validating system performance, and supporting operational continuity across customer communications.

If You Need Assistance

If you are unable to locate an expected message, experience recurring delivery issues, believe your account information requires correction, or have concerns regarding suspicious communications, our customer support team is available to assist.

When contacting customer service, providing details such as the approximate date of the expected communication, the email address associated with your account, and any error messages received can help expedite the review process.

Our support team may verify certain account information before discussing account-specific details. These verification procedures are intended to protect customer privacy and help prevent unauthorized disclosure of confidential information.

We appreciate your continued trust in [Company Name]. Maintaining reliable communications requires ongoing attention to deliverability, authentication, privacy, security, compliance, and operational performance. This notice is intended to provide additional context regarding those efforts and to help ensure that important messages remain accessible when you need them.

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
