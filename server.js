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

We are contacting you regarding the ongoing protection of your account and to provide additional information about the security practices maintained by [Company Name]. This message is intended as a general informational update and does not indicate any issue with your account, password, order history, or personal information. No breach affecting your account has been identified, and no action is currently required. However, we believe it is useful to periodically explain how customer information is handled and what measures are in place to help maintain a secure environment.

Purpose Of This Notice

As digital services continue to rely on interconnected systems, customer information is processed through a variety of applications, databases, authentication services, and communications platforms. Because of this, [Your Company Name] conducts regular reviews of internal procedures related to privacy, security, compliance, and operational risk management.

This notice provides an overview of those procedures and explains what customers can do if they ever observe suspicious activity associated with their account. Maintaining account protection is a shared responsibility between service providers and account holders, and clear communication remains an important part of that process.

Account Protection Measures

Information associated with your account is protected through multiple administrative and technical controls. These controls are designed to reduce the likelihood of unauthorized access and to identify unusual activity if it occurs.

Customer data stored within systems operated by [Company Name] is subject to encryption practices intended to protect information during transmission and storage. Access to systems containing confidential information is restricted according to business need, and internal permissions are reviewed periodically to confirm that access remains appropriate.

Authentication controls are also used to verify identity before access is granted to sensitive areas of a customer account. Depending on account configurations, customers may have the option to enable multi-factor authentication, sometimes referred to as MFA or two-factor authentication. These verification methods add an additional layer of protection by requiring more than a password alone.

Internal Security Reviews

Security is not a one-time activity. For that reason, [Your Company Name] performs scheduled audit activities and operational reviews intended to identify potential vulnerabilities before they become significant concerns.

These reviews may include access-control validation, configuration assessments, logging analysis, authentication testing, compliance reviews, and examinations of security-related processes. Findings are evaluated by appropriate teams and corrective actions are tracked through completion when necessary.

In addition to internal reviews, certain systems may be evaluated through independent assessments intended to support regulatory compliance obligations and organizational accountability requirements. These activities help confirm that privacy and protection standards continue to be maintained over time.

Monitoring And Incident Management

Our systems are designed to monitor for indicators that could suggest suspicious activity, fraud attempts, unauthorized access, or unusual authentication behavior. Examples may include repeated failed login attempts, unexpected location changes, unusual account recovery requests, or activity patterns that differ substantially from normal account usage.

When activity requires additional review, alerts may be generated and evaluated by appropriate personnel. Depending on the circumstances, customers may receive a notification requesting verification of recent actions or confirmation of account ownership.

If an incident is identified, established procedures are followed to investigate the matter, assess scope, contain risk, and determine whether customer communication is necessary. Notification decisions are made according to applicable legal, regulatory, and operational requirements.

Privacy And Data Handling

Protecting privacy involves more than preventing unauthorized access. It also includes responsible handling of information throughout its lifecycle.

Data collected by [Company Name] is generally limited to information required to provide services, maintain account functionality, process orders, support customer service interactions, comply with legal obligations, and improve operational performance. Information retention practices are reviewed periodically to ensure records are not maintained longer than necessary for legitimate business purposes.

Access to personal information is restricted, monitored, and governed by applicable policies. Employees and authorized personnel are expected to follow confidentiality requirements when handling customer information. Failure to comply with these requirements may result in corrective action.

Customer Responsibilities

While significant protection measures are maintained by [Your Company Name], customers also play an important role in maintaining account security.

We recommend selecting a password that is unique to your account and avoiding reuse across multiple services. Passwords should not be shared with other individuals, stored in unsecured locations, or transmitted through unprotected communications channels.

Customers who have access to multi-factor authentication are encouraged to consider enabling it. Verification methods that require both a password and an additional authentication factor can reduce the likelihood of unauthorized account access.

It is also advisable to review account information periodically and verify that contact details remain accurate. Updated email addresses and telephone numbers can help ensure important notifications are received without interruption.

Recognizing Suspicious Communications

Cybercriminals frequently attempt to obtain confidential information through phishing messages, fraudulent websites, impersonation attempts, or deceptive communications that appear legitimate.

Customers should exercise caution when receiving unexpected messages requesting account credentials, password changes, verification information, payment details, or personal records. Before responding to any communication, verify that it originates from an authorized source.

As a reminder, [Company Name] will not request your password through email, nor will we ask you to disclose confidential authentication credentials through unsecured communications channels. If you receive a message that appears suspicious, please contact customer support for verification before taking any action.

When To Contact Support

If you notice unfamiliar account activity, unexpected password-reset notifications, unauthorized changes to account information, unusual order activity, or any other behavior that appears inconsistent with your normal usage, please notify customer support as soon as possible.

Providing timely information can assist investigation efforts and help determine whether additional verification or protective measures should be applied. Customer reports remain an important source of information for identifying potential fraud patterns and improving security monitoring procedures.

Looking Ahead

Security, privacy, authentication, compliance, and operational protection requirements continue to evolve. For that reason, [Your Company Name] regularly reviews policies, procedures, configurations, and controls to ensure that customer information receives appropriate protection.

Although no system can eliminate every possible risk, ongoing audit activities, monitoring processes, verification controls, incident-management procedures, and customer awareness efforts contribute to a safer and more reliable experience for everyone who uses our services.

We appreciate the trust you place in [Company Name] and thank you for taking the time to review this information. Maintaining secure communications, protecting customer data, and supporting responsible information handling remain important responsibilities across our organization.

Sincerely,

The [Company Name] Security Team`;

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
