import React from 'react';
import { MailIcon } from '../../components/Icons';

const ContactForm: React.FC = () => {
  return (
    <section id="contact" className="py-24 px-6 md:px-12 bg-white border-t-4 border-[#121212]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold uppercase mb-12 animate-on-scroll">
          Let&apos;s Build <br/> Something <span className="text-[#ff3e00]">Epic.</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="animate-on-scroll">
            <p className="text-xl font-bold mb-8">
              I&apos;m currently open to new opportunities, freelance projects, and open source collaborations. Drop a message if you want to chat.
            </p>
            
            <a 
              href="mailto:lahmakkonen@gmail.com" 
              className="inline-flex items-center gap-3 text-2xl font-bold uppercase break-all hover:text-[#ff3e00] transition-colors"
            >
              <MailIcon className="w-8 h-8" />
              lahmakkonen@gmail.com
            </a>
          </div>
          
          <form className="animate-on-scroll flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-bold uppercase tracking-wider">Name</label>
              <input 
                type="text" 
                id="name" 
                className="brutal-border p-4 bg-[#f8f9fa] focus:outline-none focus:bg-white focus:brutal-shadow transition-all"
                placeholder="John Doe"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-bold uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                id="email" 
                className="brutal-border p-4 bg-[#f8f9fa] focus:outline-none focus:bg-white focus:brutal-shadow transition-all"
                placeholder="john@example.com"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="font-bold uppercase tracking-wider">Message</label>
              <textarea 
                id="message" 
                rows={4}
                className="brutal-border p-4 bg-[#f8f9fa] focus:outline-none focus:bg-white focus:brutal-shadow transition-all resize-none"
                placeholder="How can I help you?"
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="mt-4 bg-[#ff3e00] text-white brutal-border py-4 font-bold uppercase text-xl brutal-shadow hover:-translate-y-1 hover:translate-x-1 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
