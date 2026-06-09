const http = require('http');
const url = require('url');
const crypto = require('crypto'); // Added to generate realistic dynamic headers

const PORT = process.env.PORT || 3000;
const VALID_API_KEY = 'TEV-01-6a89f2d4e1b57c938a20f9e7d6c4b1a0';

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
I am writing to provide an important update regarding the privacy policy and data governance protocols at [Company Name]. This notification serves as a formal reminder of our standard regulatory compliance schedule and outlines the modifications taking effect in the coming weeks. We conduct a routine audit of our internal policies to align with updated legal frameworks, and we are contacting you to ensure you have complete information concerning how your confidential information is managed. Please review the details below carefully, as they pertain directly to your account and the data associated with your orders, shipping, and delivery records.
Modifications to Information Collection Practices
In the process of providing customer service and managing your account, [Your Company Name] collects specific categories of data. The updated policy clarifies the precise nature of this information. We record transaction details, which include your billing address, shipping destinations, and tracking numbers for your previous and current orders. Additionally, we log device configurations and communication preferences to ensure optimal deliverability of our messages to your inbox. We do not collect extraneous data beyond what is strictly necessary for order processing, account verification, and standard customer support functions. The revised document provides an exhaustive inventory of these data points, ensuring procedural transparency regarding the information required to maintain your active profile.
Data Retention and Storage Limitations
A significant portion of the update addresses our data retention schedules. We maintain transaction records, including shipping and delivery confirmations, only for the duration required by applicable tax and regulatory mandates. Once this eligibility period expires, your data is subjected to a secure, permanent deletion protocol. During the retention period, all confidential information is safeguarded using advanced encryption standards. Our infrastructure undergoes a rigorous audit cycle to verify that storage mechanisms comply with current privacy regulations. You can find the specific retention timelines for different categories of information, from routine customer service interactions to complex dispute resolution cases involving a return or refund, detailed extensively in the policy text.
Account Security and Authentication Protocols
Protecting your account from unauthorized access remains a central focus of our operational strategy. The new policy details how our security infrastructure interacts with your personal data. We utilize stringent authentication measures, including mandatory password complexity rules and support for multi-factor authentication, commonly referred to as MFA. These configurations are designed to verify your identity accurately before granting access to sensitive profile sections. By maintaining strict access controls, we protect your account against vulnerability exploitation and unauthorized data retrieval. We strongly encourage all users to enable two-factor verification to maximize the protection of their personal details.
Phishing Prevention and Communications
The policy outlines our communication standards and alerts you to potential fraud vectors. We monitor deliverability metrics closely to ensure legitimate messages from [Company Name] reach you without interference. However, we urge you to remain vigilant against phishing attempts. Please remember that we will never ask you for sensitive information such as your credit card number, expiry date, or CVV via email. Any message requesting such details or prompting you to verify your password through an unverified link should be treated as highly suspicious. Our official notifications regarding your account, orders, or privacy updates will always originate from our verified corporate domains.
Incident Management and Notification Procedures
While we employ proactive defense mechanisms, the updated policy formally codifies our incident notification procedures. If an event or potential breach involving your confidential information is detected, our internal protocols dictate an immediate investigation. Should we confirm that unauthorized access has occurred, we will issue an alert directly to your registered email address. This notification will contain specific guidance on how to secure your account, the exact nature of the data involved, and the steps we are taking to mitigate the issue. Our customer support team is trained to handle these scenarios with precision, ensuring you receive accurate and timely information without unnecessary delay.
Information Sharing and Third-Party Processing
[Your Company Name] relies on select operational partners to facilitate order processing, shipping logistics, and payment verification. The privacy update provides further detail on how data is transmitted to these entities. We require all third-party vendors to adhere to strict confidentiality agreements and demonstrate regulatory conformance. Information is only shared when it is a functional requirement for fulfilling your orders or providing customer service. Furthermore, we conduct periodic reviews of our partners to confirm they maintain adequate protection levels against fraud and unauthorized data processing.
Accessibility and Policy Conformance
We recognize that reviewing legal and regulatory documents can be difficult. [Company Name] maintains a strict adherence to accessibility standards to ensure all customers can understand their privacy rights. The updated policy document has been formatted for conformance with current accessibility guidelines, ensuring it is fully readable by assistive technologies. If you require an alternative format or need a specific accommodation to review this information, our customer service personnel are ready to assist. We consider the communication of data protection protocols to be an essential function that must remain an accessible process for every individual who uses our services.
Exercising Your Privacy Rights
With regards to your privacy rights, the final major addition to the policy involves your options for data access and modification. Depending on your jurisdiction, you may have the right to request a complete export of the data associated with your account, request corrections to your address or verification details, or ask for the deletion of your profile. The policy includes a dedicated section explaining the eligibility criteria for these requests and the operational steps to submit them. Our support team is available to assist you with these processes. If you encounter an issue or wish to initiate a dispute regarding data handling, the policy outlines the formal resolution pathway. We aim to process all privacy-related requests promptly and in full compliance with relevant legal standards.
Thank you for reviewing these updates. Maintaining a safe environment for your account and your orders requires careful attention to detail, and we appreciate your ongoing cooperation. If you have any questions regarding the new policy, your account configurations, or general privacy protections, please contact our support desk at your earliest convenience to notify us of your concerns.
Sincerely,
The [Company Name] Privacy Team`;

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
