const Footer = () => {
    return (
        <footer className="bg-blue-900 text-white py-10 px-4 mt-auto shadow-inner">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logos - Left Section */}
                    

                    {/* Footer Content */}
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm md:text-base text-blue-100">
                        {/* About Us */}
                        <div>
                            <h4 className="text-lg md:text-xl font-semibold text-white mb-3 border-b border-blue-300 pb-2">About Us</h4>
                            <ul className="space-y-1">
                                <li>We are a private education platform</li>
                                <li>Offering smart tools for learning</li>
                                <li>Based in Sri Lanka</li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-lg md:text-xl font-semibold text-white mb-3 border-b border-blue-300 pb-2">Contact</h4>
                            <ul className="space-y-2">
                                <li>📞 <span className="font-medium">Phone:</span> <a href="tel:+9411222333" className="hover:text-white">+94 11 222 333</a></li>
                                <li>📧 <span className="font-medium">Email:</span> <a href="mailto:info@smartedu.lk" className="hover:text-white">info@smartedu.lk</a></li>
                            </ul>
                        </div>

                        {/* Useful Links */}
                        <div>
                            <h4 className="text-lg md:text-xl font-semibold text-white mb-3 border-b border-blue-300 pb-2">Useful Links</h4>
                            <ul className="space-y-2">
                                <li><a href="https://moe.gov.lk" target="_blank" className="hover:text-white">Ministry of Education</a></li>
                                <li><a href="https://www.e-thaksalawa.moe.gov.lk" target="_blank" className="hover:text-white">E-Thaksalawa</a></li>
                                <li><a href="https://www.nie.lk" target="_blank" className="hover:text-white">National Institute of Education</a></li>
                                <li><a href="https://ugc.ac.lk" target="_blank" className="hover:text-white">University Grants Commission</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-10 border-t border-blue-400 pt-4 text-center text-blue-200 text-sm">
                    &copy; {new Date().getFullYear()} <span className="font-semibold">Smart Education Platform</span>. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
