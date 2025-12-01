'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MoreHorizontal, Plus, Sparkles, CheckCircle2, Globe } from 'lucide-react';
import { QuestionTooltip } from '@/shared/components/QuestionTooltip';
import { Platform } from '@/shared/types';
import { useBrand } from '@/features/brand-management';
import { useScheduler, type ScheduledPost } from '@/features/scheduling';

const getPlatformColor = (platform: string) => {
  switch(platform) {
    case Platform.INSTAGRAM: return 'bg-pink-100 text-pink-700 border-pink-200';
    case Platform.TWITTER: return 'bg-slate-100 text-slate-700 border-slate-200';
    case Platform.TIKTOK: return 'bg-teal-100 text-teal-700 border-teal-200';
    case Platform.FACEBOOK: return 'bg-blue-100 text-blue-700 border-blue-200';
    case Platform.LINKEDIN: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SchedulePage() {
  const { activeProfile } = useBrand();
  const { scheduledPosts, updatePostDate } = useScheduler();
  const [currentDate] = useState(new Date());
  const [dragOverDateKey, setDragOverDateKey] = useState<string | null>(null);
  const [targetTime, setTargetTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      try {
        const time = new Date().toLocaleTimeString('en-US', {
          timeZone: activeProfile?.timezone || 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        setTargetTime(time);
      } catch {
        setTargetTime('Invalid Zone');
      }
    };
    
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, [activeProfile?.timezone]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const calendarDays = getDaysInMonth(currentDate);

  const postsByDate = scheduledPosts.reduce((acc, post) => {
    const dateKey = post.date.toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(post);
    return acc;
  }, {} as Record<string, ScheduledPost[]>);

  const handleDragStart = (e: React.DragEvent, postId: string) => {
    e.dataTransfer.setData('text/plain', postId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault();
    setDragOverDateKey(dateKey);
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    setDragOverDateKey(null);
    const postId = e.dataTransfer.getData('text/plain');
    if (postId) {
      updatePostDate(postId, date);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Content Calendar</h1>
          <p className="text-slate-500">Plan and schedule your upcoming posts.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 shadow-sm transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
            <Sparkles className="w-4 h-4" />
            <span>Auto-Fill Month</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-4">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-500" />
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                <Globe className="w-3 h-3 text-indigo-500" />
                <span>Showing Local Time</span>
                <span className="w-px h-3 bg-slate-200 mx-1"></span>
                <span className="font-semibold text-indigo-700">Target: {targetTime}</span>
              </div>
            </div>
            <QuestionTooltip text="Calendar shows YOUR local time. The 'Target' clock shows time in your selected audience timezone." />
          </div>
          
          <div className="grid grid-cols-7 border-b border-slate-100">
            {weekDays.map(day => (
              <div key={day} className="py-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 auto-rows-fr bg-slate-50 gap-px border-l border-slate-100">
            {calendarDays.map((date, idx) => {
              const dateKey = date ? date.toISOString().split('T')[0] : `empty-${idx}`;
              const posts = date ? postsByDate[dateKey] || [] : [];
              const isToday = date && new Date().toDateString() === date.toDateString();
              const isDragOver = dragOverDateKey === dateKey;

              return (
                <div 
                  key={idx}
                  onDragOver={(e) => date && handleDragOver(e)}
                  onDragEnter={(e) => date && handleDragEnter(e, dateKey)}
                  onDrop={(e) => date && handleDrop(e, date)}
                  className={`min-h-[120px] bg-white p-2 relative group transition-colors 
                    ${!date ? 'bg-slate-50/50' : ''} 
                    ${isDragOver ? 'bg-indigo-100 ring-2 ring-inset ring-indigo-400 z-10' : 'hover:bg-indigo-50/30'}
                  `}
                >
                  {date && (
                    <>
                      <div className="flex justify-between items-start mb-2 pointer-events-none">
                        <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}>
                          {date.getDate()}
                        </span>
                        {(date.getDay() === 2 || date.getDay() === 4) && (
                          <div title="High Engagement Day" className="text-amber-400 opacity-50">
                            <Sparkles className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1.5">
                        {posts.map(post => (
                          <div 
                            key={post.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, post.id)}
                            className={`text-[10px] p-1.5 rounded border ${getPlatformColor(post.platform)} cursor-grab active:cursor-grabbing hover:opacity-80 transition-opacity truncate shadow-sm`}
                            title={post.title}
                          >
                            <span className="font-bold mr-1">{post.platform.charAt(0)}:</span>
                            {post.title}
                          </div>
                        ))}
                      </div>

                      <button className="absolute bottom-2 right-2 p-1 bg-indigo-100 text-indigo-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Queue */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-50">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Globe className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Target Audience</h3>
                <p className="text-xs text-slate-400">{activeProfile?.timezone || 'UTC'}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-mono font-bold text-slate-800 tracking-tight">{targetTime}</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">Live Time</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Upcoming Queue
            </h3>
            
            {scheduledPosts.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                <p>No posts scheduled.</p>
                <p className="mt-1">Go to <b>Content AI</b> to create some!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledPosts.slice(0, 5).map(post => (
                  <div key={post.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:border-indigo-200 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold text-slate-500">
                        {post.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {post.date.toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <MoreHorizontal className="w-4 h-4 text-slate-300 cursor-pointer hover:text-indigo-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-800 line-clamp-2">{post.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${getPlatformColor(post.platform)}`}>
                        {post.platform}
                      </span>
                      {post.status === 'scheduled' && (
                        <span className="text-[10px] flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" /> Ready
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button className="w-full mt-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
              View All Queue
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-5 rounded-xl text-white">
            <div className="flex items-center gap-2 mb-2 text-indigo-200">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Tip</span>
            </div>
            <p className="text-sm font-medium leading-relaxed">
              Your audience in <span className="font-bold">{activeProfile?.timezone?.split('/')[1] || 'your timezone'}</span> is most active around <span className="text-white font-bold">10 AM</span> their time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
