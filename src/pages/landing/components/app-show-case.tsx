import { Monitor } from 'lucide-react';
import React from 'react';

export const AppShowcase: React.FC = () => {
  return (
    <section className="py-24 bg-[#111111] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-blue-500 tracking-[0.2em] uppercase mb-4">
            CUSTOM BRANDED APPS
          </h2>
          
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 relative inline-block">
            Webpage, iOS, Android
            {/* Blue highlight underline */}
            <div className="absolute bottom-2 left-0 w-full h-3 z-[-1]">
               <div className="w-full h-full bg-blue-600/30 -skew-x-12 transform origin-left scale-x-105"></div>
            </div>
          </h3>

          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Showcase your brand, schedule appointments in seconds and get your app listed in app stores or embedded on your webpage.
          </p>

          {/* Platform Icons */}
          <div className="flex justify-center items-center gap-8 mb-16">
            <div className="flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-default">
                <Monitor className="h-8 w-8" />
                <span className="text-xs font-medium">Web</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-default">
                {/* Apple Icon SVG */}
                <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.74-3.03 1.59-.67.79-1.25 1.95-1.1 3.09 1.17.09 2.36-.73 3.06-1.57"/></svg>
                <span className="text-xs font-medium">iOS</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-default">
                {/* Android Icon SVG */}
                <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4213 13.8533 8.0854 12 8.0854s-3.5902.3359-5.1367.9644L4.841 5.5467a.4161.4161 0 00-.5676-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/></svg>
                <span className="text-xs font-medium">Android</span>
            </div>
          </div>

        </div>

        {/* Mockups Display */}
        <div className="relative mt-12 flex justify-center">
             {/* Glow Effect */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-900/20 rounded-full blur-[100px]"></div>

             <div className="relative w-full max-w-5xl h-[400px] sm:h-[500px] md:h-[600px] flex justify-center items-end">
                
                {/* Desktop/Web Background Mockup */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] md:w-[800px] h-[300px] md:h-[500px] bg-[#1a1a1a] rounded-t-3xl border-t-8 border-x-8 border-[#2a2a2a] shadow-2xl opacity-40 transform scale-95 translate-y-10 z-0 overflow-hidden">
                    <div className="w-full h-8 bg-[#2a2a2a] flex items-center gap-2 px-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="ml-4 w-64 h-4 bg-[#3a3a3a] rounded-full opacity-50"></div>
                    </div>
                    <div className="p-8">
                        <div className="w-full h-full bg-[#111] rounded-lg opacity-50 flex flex-col gap-4 p-4">
                             <div className="w-1/3 h-8 bg-[#333] rounded mb-8"></div>
                             <div className="flex gap-4">
                                 <div className="w-1/3 h-40 bg-[#333] rounded-lg"></div>
                                 <div className="w-1/3 h-40 bg-[#333] rounded-lg"></div>
                                 <div className="w-1/3 h-40 bg-[#333] rounded-lg"></div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Left Phone - iOS Style */}
                <div className="absolute bottom-[-20px] left-1/2 -translate-x-[110%] md:-translate-x-[140%] z-10 transform rotate-[-12deg] hover:rotate-0 transition-transform duration-500">
                    <div className="w-[160px] md:w-[240px] h-[320px] md:h-[480px] bg-black rounded-[2rem] border-[6px] border-[#333] shadow-2xl overflow-hidden relative">
                         {/* Dynamic Notch */}
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-24 bg-black rounded-b-xl z-20"></div>
                         
                         {/* Screen */}
                         <div className="w-full h-full bg-white flex flex-col pt-8">
                             <div className="p-4">
                                 <div className="h-8 w-8 bg-gray-200 rounded-full mb-4"></div>
                                 <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                                 <div className="h-4 w-1/2 bg-gray-100 rounded mb-6"></div>
                                 
                                 <div className="grid grid-cols-2 gap-3">
                                     <div className="aspect-square bg-blue-50 rounded-xl p-3">
                                         <div className="h-6 w-6 bg-blue-200 rounded mb-2"></div>
                                         <div className="h-3 w-16 bg-blue-100 rounded"></div>
                                     </div>
                                     <div className="aspect-square bg-gray-50 rounded-xl p-3">
                                         <div className="h-6 w-6 bg-gray-200 rounded mb-2"></div>
                                         <div className="h-3 w-16 bg-gray-100 rounded"></div>
                                     </div>
                                     <div className="aspect-square bg-gray-50 rounded-xl p-3">
                                         <div className="h-6 w-6 bg-gray-200 rounded mb-2"></div>
                                         <div className="h-3 w-16 bg-gray-100 rounded"></div>
                                     </div>
                                     <div className="aspect-square bg-gray-50 rounded-xl p-3">
                                         <div className="h-6 w-6 bg-gray-200 rounded mb-2"></div>
                                         <div className="h-3 w-16 bg-gray-100 rounded"></div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Right Phone - Android Style */}
                <div className="absolute bottom-[-40px] left-1/2 translate-x-[10%] md:translate-x-[40%] z-20 transform rotate-[6deg] hover:rotate-0 transition-transform duration-500">
                     <div className="w-[170px] md:w-[260px] h-[340px] md:h-[520px] bg-black rounded-[2.5rem] border-[6px] border-[#333] shadow-2xl overflow-hidden relative">
                         {/* Camera Punch Hole */}
                         <div className="absolute top-4 left-1/2 -translate-x-1/2 h-4 w-4 bg-black rounded-full z-20"></div>

                         {/* Screen */}
                         <div className="w-full h-full bg-white flex flex-col pt-10">
                              {/* Hero Image in App */}
                              <div className="h-32 bg-gray-200 w-full mb-4 relative">
                                  <div className="absolute bottom-[-16px] left-4 h-12 w-12 bg-white rounded-full border-2 border-white flex items-center justify-center">
                                      <div className="h-10 w-10 bg-blue-600 rounded-full"></div>
                                  </div>
                              </div>
                              <div className="px-4 pt-4">
                                  <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <div className="h-5 w-24 bg-gray-200 rounded mb-1"></div>
                                        <div className="h-3 w-16 bg-gray-100 rounded"></div>
                                      </div>
                                      <div className="h-8 w-20 bg-blue-600 rounded-full"></div>
                                  </div>
                                  <div className="h-px bg-gray-100 w-full my-4"></div>
                                  <div className="space-y-3">
                                      <div className="h-16 bg-gray-50 rounded-xl w-full border border-gray-100"></div>
                                      <div className="h-16 bg-gray-50 rounded-xl w-full border border-gray-100"></div>
                                      <div className="h-16 bg-gray-50 rounded-xl w-full border border-gray-100"></div>
                                  </div>
                              </div>
                         </div>
                     </div>
                </div>

             </div>
        </div>

      </div>
    </section>
  );
};
