import Link from 'next/link';
import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className={` font-montserrat mx-auto`}>


            <div className="sticky top-0 z-50 pt-4 px-10 border-b pb-2 bg-[#FAFCFA]">
                <div className=" bg-opacity-20  backdrop-filter py-2">
                    <div className="container flex justify-between px-2 items-center">
                        <Link href="/dashboard">
                            <div className="flex items-center justify-center text-lg cursor-pointer">
                                <img src="/fullimage.png" className="w-36 ml-3" alt="Logo" />
                            </div>
                        </Link>

                        <div className="flex items-center gap-10">
                            <Link href="/login">
                                <button className="bg-[#333333] text-white px-4 py-2 rounded-full">Login</button>
                            </Link>
                            <Link href="/signup">
                                <button className="bg-[#333333] text-white px-4 py-2 rounded-full">Get started</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>


            <h1 className="text-4xl font-bold mb-6 text-[#545454] text-center mt-10 ">Privacy Policy</h1>

            <div className='mx-52 mb-10'>
                <p className="text-sm text-gray-600 mb-4">
                    <strong>Effective Date</strong>: 20/10/2024
                </p>
                <p className="mb-6 text-[#545454]">
                    At <strong>Overtly.io</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), we are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://overtly.io" className="text-blue-500 underline">https://overtly.io</a> (the &quot;Site&quot;) and use our AI-based software-as-a-service platform (&quot;Service&quot;). Please read this Privacy Policy carefully to understand our views and practices regarding your personal data and how we treat it.
                </p>
                <p className="mb-6 text-[#545454]">
                    By using our Site or Service, you agree to the collection and use of information in accordance with this policy.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">1. Information We Collect</h2>
                <h3 className="text-xl font-semibold mb-2 text-[#2C2C2C]">Personal Data</h3>
                <p className="mb-4 text-[#545454]">
                    When you use our Service, we may collect the following personal data:
                </p>
                <ul className="list-disc list-inside mb-6 text-[#545454]">
                    <li><strong>Contact Information</strong>: Name, email address, phone number, company name, job title, etc.</li>
                    <li><strong>Account Information</strong>: Username, password, and other information you provide to register for an account.</li>
                    <li><strong>Billing Information</strong>: Payment details such as credit card numbers and billing addresses (collected and processed through third-party payment providers).</li>
                    <li><strong>Communications</strong>: Any information you provide when contacting customer support, including emails and other messages.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-[#2C2C2C]">Automatically Collected Data</h3>
                <p className="mb-4 text-[#545454]">
                    We may automatically collect information about your device and usage of our Site and Service through cookies, log files, and similar technologies:
                </p>
                <ul className="list-disc list-inside mb-6 text-[#545454]">
                    <li><strong>Device Information</strong>: IP address, browser type, operating system, etc.</li>
                    <li><strong>Usage Data</strong>: Pages viewed, time spent on pages, clicks, and other interactions with the Site or Service.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-[#2C2C2C]">Data from Third Parties</h3>
                <p className="mb-6 text-[#545454]">
                    We may receive information about you from third-party services you integrate with our platform (e.g., social media accounts or public relations tools) or data providers that enhance our AI models.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">2. How We Use Your Data</h2>
                <p className="mb-4 text-[#545454]">
                    We use the data we collect for the following purposes:
                </p>
                <ul className="list-disc list-inside mb-6 text-[#545454]">
                    <li>To provide and maintain our Service, including the automation of public relations workflows.</li>
                    <li>To personalize your experience, including offering customized features and content.</li>
                    <li>To process payments for our Service.</li>
                    <li>To communicate with you regarding updates, promotions, customer support, and Service changes.</li>
                    <li>To improve our Service through analytics, research, and feedback.</li>
                    <li>To ensure legal compliance, including enforcing our Terms of Service.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">3. How We Share Your Data</h2>
                <p className="mb-4 text-[#545454]">
                    We do not sell your personal data. However, we may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside mb-6 text-[#545454]">
                    <li><strong>Service Providers</strong>: We may share your data with third-party providers who perform services on our behalf (e.g., cloud hosting, payment processing, analytics).</li>
                    <li><strong>Business Transfers</strong>: In the event of a merger, acquisition, or asset sale, your data may be transferred to the new owners.</li>
                    <li><strong>Legal Requirements</strong>: We may disclose your data if required by law or in response to valid legal requests from public authorities (e.g., law enforcement).</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">4. Security</h2>
                <p className="mb-4 text-[#545454]">
                    We take reasonable measures to protect your data, including encryption, access control, and secure servers. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">5. Data Retention</h2>
                <p className="mb-4 text-[#545454]">
                    We retain your personal data only for as long as necessary to provide our Service or as required by law. If you wish to delete your account or request that we delete your data, please contact us at <a href="mailto:contact@overtly.io" className="text-blue-500 underline">contact@overtly.io</a>.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">6. Cookies and Tracking Technologies</h2>
                <p className="mb-4 text-[#545454]">
                    We use cookies and similar tracking technologies to collect information and improve our Service. You can control the use of cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our Site.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">7. User Rights</h2>
                <p className="mb-4 text-[#545454]">
                    You have the following rights regarding your data:
                </p>
                <ul className="list-disc list-inside mb-6 text-[#545454]">
                    <li><strong>Access</strong>: Request a copy of the personal data we hold about you.</li>
                    <li><strong>Rectification</strong>: Correct any inaccuracies in your data.</li>
                    <li><strong>Deletion</strong>: Request the deletion of your personal data.</li>
                    <li><strong>Data Portability</strong>: Request your data in a structured, commonly used, and machine-readable format.</li>
                    <li><strong>Objection</strong>: Object to our processing of your data under certain circumstances.</li>
                </ul>
                <p className="mb-4 text-[#545454]">
                    To exercise any of these rights, please contact us at <a href="mailto:contact@overtly.io" className="text-blue-500 underline">contact@overtly.io</a>.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">8. International Data Transfers</h2>
                <p className="mb-4 text-[#545454]">
                    If you are located outside of the United States, your data may be transferred to and processed in the U.S. or other countries where our service providers are located. We take steps to ensure appropriate safeguards are in place when transferring data internationally.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">9. Children&apos;s Privacy</h2>
                <p className="mb-4 text-[#545454]">
                    Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal data from children. If we become aware that we have collected personal data from a child without verification of parental consent, we will take steps to delete that information.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">10. Changes to This Privacy Policy</h2>
                <p className="mb-4 text-[#545454]">
                    We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on our Site and updating the &quot;Effective Date&quot; at the top of this document. You are encouraged to review this Privacy Policy periodically.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">11. Contact Us</h2>
                <p className="mb-4 text-[#545454]">
                    If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="mb-4 text-[#545454]">
                    <strong>Overtly.io</strong><br />
                    Email: <a href="mailto:contact@overtly.io" className="text-blue-500 underline">contact@overtly.io</a>
                </p>
            </div>


        </div>
    );
};

export default PrivacyPolicyPage;
