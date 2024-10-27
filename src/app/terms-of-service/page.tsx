import Link from 'next/link';
import React from 'react';

const TermsOfServicePage = () => {
    return (
        <div className={`font-montserrat mx-auto`}>
            <div className="sticky top-0 z-50 pt-4 px-10 border-b pb-2 bg-[#FAFCFA]">
                <div className="bg-opacity-20 backdrop-filter py-2">
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

            <h1 className="text-4xl font-bold mb-6 text-[#545454] text-center mt-10">Terms of Service</h1>

            <div className='mx-52 mb-10'>
                <p className="text-sm text-gray-600 mb-4">
                    <strong>Effective Date</strong>: 20/10/2024
                </p>
                <p className="mb-6 text-[#545454]">
                    Welcome to <strong>Overtly.io</strong> (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;). These Terms of Service (&quot;Terms&quot;) govern your use of our website located at <a href="https://overtly.io" className="text-blue-500 underline">https://overtly.io</a> (the &quot;Site&quot;) and our AI-based public relations automation platform and services (collectively, the &quot;Service&quot;). By accessing or using our Service, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, you must not access or use our Service.
                </p>
                <p className="mb-6 text-[#545454]">
                    Please read these Terms carefully.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">1. Definitions</h2>
                <ul className="list-disc list-inside mb-6 text-[#545454]">
                    <li><strong>&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;</strong> refers to any person or entity using or accessing the Service.</li>
                    <li><strong>&quot;Service&quot;</strong> refers to the <strong>Overtly.io</strong> platform and any associated features, products, or services.</li>
                    <li><strong>&quot;Account&quot;</strong> refers to the registered user account created by you to access the Service.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">2. Eligibility</h2>
                <p className="mb-4 text-[#545454]">
                    You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you are legally capable of entering into binding contracts and that all registration information you submit is accurate, truthful, and current.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">3. Account Registration and Security</h2>
                <p className="mb-4 text-[#545454]">
                    To use certain features of the Service, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside mb-6 text-[#545454]">
                    <li>Provide accurate and complete registration information.</li>
                    <li>Maintain the confidentiality of your account credentials.</li>
                    <li>Immediately notify us of any unauthorized use or suspected breach of your account.</li>
                </ul>
                <p className="mb-4 text-[#545454]">
                    You are responsible for all activities that occur under your account. We reserve the right to suspend or terminate your account if we suspect any breach of security or misuse of the Service.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">4. Use of the Service</h2>
                <p className="mb-4 text-[#545454]">
                    You agree to use the Service only for lawful purposes and in accordance with these Terms. By using the Service, you agree not to:
                </p>
                <ul className="list-disc list-inside mb-6 text-[#545454]">
                    <li>Violate any applicable laws or regulations.</li>
                    <li>Use the Service to transmit, distribute, or store material that is harmful, threatening, or violates the rights of others.</li>
                    <li>Interfere with or disrupt the integrity or performance of the Service.</li>
                    <li>Attempt to gain unauthorized access to any part of the Service, related systems, or networks.</li>
                    <li>Reverse-engineer, decompile, or attempt to discover the source code or underlying algorithms of any part of the Service.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">5. Payment and Subscription</h2>
                <h3 className="text-xl font-semibold mb-2 text-[#2C2C2C]">Subscription Fees</h3>
                <p className="mb-4 text-[#545454]">
                    Certain features of the Service are available on a subscription basis. By subscribing, you agree to pay the fees specified in your subscription plan. All fees are non-refundable unless otherwise stated.
                </p>
                <h3 className="text-xl font-semibold mb-2 text-[#2C2C2C]">Billing</h3>
                <p className="mb-4 text-[#545454]">
                    Subscription fees will be billed in advance on a recurring basis (monthly or annually, depending on your plan). You authorize us or our third-party payment provider to charge your payment method for all applicable fees. Failure to pay fees may result in suspension or termination of your access to the Service.
                </p>
                <h3 className="text-xl font-semibold mb-2 text-[#2C2C2C]">Changes to Fees</h3>
                <p className="mb-4 text-[#545454]">
                    We reserve the right to change the fees for our Service. If the fees for your subscription plan change, we will provide you with advance notice. Continued use of the Service after the fee change constitutes acceptance of the new fees.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">6. Intellectual Property</h2>
                <h3 className="text-xl font-semibold mb-2 text-[#2C2C2C]">Ownership</h3>
                <p className="mb-4 text-[#545454]">
                    All content, materials, and software on the Service, including but not limited to text, graphics, logos, icons, images, and code, are owned by <strong>Overtly.io</strong> or its licensors and are protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works from any content or materials on the Service without our prior written consent.
                </p>
                <h3 className="text-xl font-semibold mb-2 text-[#2C2C2C]">User-Generated Content</h3>
                <p className="mb-4 text-[#545454]">
                    If you submit or upload any content to the Service (e.g., public relations data, reports), you retain ownership of your content. By submitting content, you grant us a worldwide, non-exclusive, royalty-free, and transferable license to use, store, display, and reproduce your content for the purpose of operating and improving the Service.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">7. Confidentiality</h2>
                <p className="mb-4 text-[#545454]">
                    You agree not to disclose or use any confidential information obtained from the Service for any purpose outside the scope of these Terms without our prior written consent. Confidential information includes, but is not limited to, any business plans, technical information, and non-public data related to the Service.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">8. Data Privacy</h2>
                <p className="mb-4 text-[#545454]">
                    Your use of the Service is also governed by our <strong>Privacy Policy</strong>, which explains how we collect, use, and protect your personal information. By using the Service, you consent to our data practices as described in the Privacy Policy.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">9. Termination</h2>
                <p className="mb-4 text-[#545454]">
                    We may terminate or suspend your access to the Service, with or without notice, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease, and any data associated with your account may be deleted.
                </p>
                <p className="mb-4 text-[#545454]">
                    You may cancel your subscription and terminate your account at any time by contacting us at <a href="mailto:contact@overtly.io" className="text-blue-500 underline">contact@overtly.io</a>. Termination does not relieve you of your obligation to pay any outstanding fees.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">10. Disclaimer of Warranties</h2>
                <p className="mb-4 text-[#545454]">
                    The Service is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis, without any warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, secure, or error-free, or that any defects will be corrected.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">11. Limitation of Liability</h2>
                <p className="mb-4 text-[#545454]">
                    To the maximum extent permitted by law, <strong>Overtly.io</strong>, its affiliates, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, lost revenue, or data loss, arising out of or related to your use of the Service, even if we have been advised of the possibility of such damages.
                </p>
                <p className="mb-4 text-[#545454]">
                    Our total liability for any claims related to the Service is limited to the amount you paid us, if any, in the 12 months preceding the claim.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">12. Indemnification</h2>
                <p className="mb-4 text-[#545454]">
                    You agree to indemnify, defend, and hold harmless <strong>Overtly.io</strong> and its affiliates, employees, and agents from any and all claims, damages, losses, liabilities, and expenses (including attorneys’ fees) arising out of or in connection with your use of the Service, your violation of these Terms, or your violation of any rights of a third party.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">13. Modifications to the Service and Terms</h2>
                <p className="mb-4 text-[#545454]">
                    We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time with or without notice. We also reserve the right to modify these Terms at any time. We will provide notice of material changes, and continued use of the Service after such modifications will constitute your acceptance of the updated Terms.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">14. Governing Law and Dispute Resolution</h2>
                <p className="mb-4 text-[#545454]">
                    These Terms and any disputes arising out of or related to the Service shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
                </p>
                <p className="mb-4 text-[#545454]">
                    Any disputes shall be resolved through binding arbitration, conducted in India. You waive the right to participate in a class action lawsuit or class-wide arbitration.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">15. Miscellaneous</h2>
                <ul className="list-disc list-inside mb-6 text-[#545454]">
                    <li><strong>Entire Agreement</strong>: These Terms, along with the Privacy Policy, constitute the entire agreement between you and <strong>Overtly.io</strong> with respect to the Service.</li>
                    <li><strong>Severability</strong>: If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</li>
                    <li><strong>Waiver</strong>: Our failure to enforce any right or provision of these Terms shall not be deemed a waiver of those rights.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2C2C2C]">16. Contact Information</h2>
                <p className="mb-4 text-[#545454]">
                    If you have any questions about these Terms or the Service, please contact us at:
                </p>
                <p className="mb-4 text-[#545454]">
                    <strong>Overtly.io</strong><br />
                    Email: <a href="mailto:contact@overtly.io" className="text-blue-500 underline">contact@overtly.io</a>
                </p>
            </div>
        </div>
    );
};

export default TermsOfServicePage;

