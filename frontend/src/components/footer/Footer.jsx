import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-primary">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">
                SmartWaste
                <span className="text-primary">Manager</span>
              </h2>
            </div>
            <p className="text-sm opacity-75">
              Building Cleaner Cities Together
            </p>
          </div>

          {/* Quick Links */}
          <nav>
            <h6 className="footer-title">Quick Links</h6> 
            <div className="grid gap-2">
              <a className="link link-hover">Home</a>
              <a className="link link-hover">About</a>
              <a className="link link-hover">Contact</a>
              <a className="link link-hover">Privacy Policy</a>
            </div>
          </nav>

          {/* Contact Information */}
          <nav>
            <h6 className="footer-title">Contact</h6> 
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@smartwaste.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>GreenTech Park, Mumbai</span>
              </div>
            </div>
          </nav>

          {/* Social & Newsletter */}
          <div className="space-y-4">
            <h6 className="footer-title">Follow Us</h6> 
            <div className="flex gap-4">
              {/* <a className="btn btn-circle btn-sm btn-ghost">
                <Github className="w-5 h-5" />
              </a>
              <a className="btn btn-circle btn-sm btn-ghost">
                <Linkedin className="w-5 h-5" />
              </a>
              <a className="btn btn-circle btn-sm btn-ghost">
                <Twitter className="w-5 h-5" />
              </a> */}
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Subscribe to our newsletter</span>
              </label>
              <div className="join">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="input input-bordered join-item" 
                />
                <button className="btn btn-primary join-item">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-base-300 text-center">
          <p className="text-sm opacity-75">
            © 2024 SmartWaste Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
