
import React, { useState } from 'react';
import { MessageSquare, Users, TrendingUp, Calendar, Filter, Plus, ChevronRight, ThumbsUp, MessageCircle, Link, FileText, CheckCircle, X, Send } from 'lucide-react';
import { SOP } from '../types';

interface CommunitiesProps {
  sops?: SOP[];
}

export const Communities: React.FC<CommunitiesProps> = ({ sops = [] }) => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'events' | 'members'>('discussions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock Data for "Purchased" Protocols (in reality would come from user profile/purchases)
  const purchasedProtocols = sops.slice(0, 3); // Assume first 3 are purchased for demo
  
  const [newPost, setNewPost] = useState({ title: '', content: '', linkedSopId: '' });

  const topics = ['Operations Excellence', 'Risk & Compliance', 'HR Workflows', 'Tech Stack Integration', 'Creator Monetization'];
  
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "How are you handling the new EU AI Act compliance in your SOPs?",
      author: "Sarah J.",
      role: "Compliance Officer",
      avatar: "S",
      likes: 42,
      comments: 18,
      tags: ["Compliance", "Legal"],
      time: "2h ago",
      linkedSop: null as SOP | null,
      likedByMe: false,
      commentsExpanded: false
    },
    {
      id: 2,
      title: "Best practice for automated refund approvals > $1k?",
      author: "Mike T.",
      role: "Finance Director",
      avatar: "M",
      likes: 28,
      comments: 12,
      tags: ["Finance", "Automation"],
      time: "5h ago",
      linkedSop: purchasedProtocols[1] || null,
      likedByMe: false,
      commentsExpanded: false
    },
    {
      id: 3,
      title: "Transitioning from Notion to Protocolly: My migration strategy",
      author: "Davina R.",
      role: "Ops Manager",
      avatar: "D",
      likes: 156,
      comments: 45,
      tags: ["Productivity", "Case Study"],
      time: "1d ago",
      linkedSop: null,
      likedByMe: false,
      commentsExpanded: false
    }
  ]);

  const events = [
    {
      id: 1,
      title: "Masterclass: Building Self-Healing Operations",
      date: "Oct 28, 2:00 PM EST",
      host: "Protocolly Academy",
      attendees: 340
    },
    {
      id: 2,
      title: "Creator Roundtable: Pricing Your SOPs",
      date: "Nov 02, 11:00 AM EST",
      host: "Creator Fund",
      attendees: 125
    }
  ];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title) return;

    const linkedProtocol = purchasedProtocols.find(p => p.id === newPost.linkedSopId) || null;

    const post = {
      id: Date.now(),
      title: newPost.title,
      author: "You",
      role: "Operator",
      avatar: "Y",
      likes: 0,
      comments: 0,
      tags: ["General"],
      time: "Just now",
      linkedSop: linkedProtocol,
      likedByMe: false,
      commentsExpanded: false
    };

    setDiscussions([post, ...discussions]);
    setNewPost({ title: '', content: '', linkedSopId: '' });
    setIsModalOpen(false);
  };

  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDiscussions(prev => prev.map(post => {
      if (post.id === id) {
        const isLiked = !post.likedByMe;
        return {
          ...post,
          likedByMe: isLiked,
          likes: isLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const handleCommentClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDiscussions(prev => prev.map(post => {
      if (post.id === id) {
        return { ...post, commentsExpanded: !post.commentsExpanded };
      }
      return post;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Operator Communities</h1>
          <p className="text-slate-500">Connect, learn, and scale with 15,000+ operational leaders.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gold-500 hover:text-slate-900 transition-colors flex items-center shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" /> Start Discussion
        </button>
      </div>

      {/* Responsive Modal for New Discussion */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">Start New Discussion</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handlePostSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Discussion Title</label>
                        <input 
                            type="text" 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                            placeholder="e.g. Best practices for quarterly reviews?"
                            value={newPost.title}
                            onChange={e => setNewPost({...newPost, title: e.target.value})}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Link a Purchased Protocol (Optional)</label>
                        <div className="relative">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <select 
                                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm text-slate-700 appearance-none"
                                value={newPost.linkedSopId}
                                onChange={e => setNewPost({...newPost, linkedSopId: e.target.value})}
                            >
                                <option value="">-- Select a Protocol to Discuss --</option>
                                {purchasedProtocols.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                            Linking a protocol allows other members to see what you are working on and provide specific advice.
                        </p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Content</label>
                        <textarea 
                            rows={4}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none resize-none"
                            placeholder="Share your context or question..."
                            value={newPost.content}
                            onChange={e => setNewPost({...newPost, content: e.target.value})}
                        />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-gold-500 hover:text-slate-900 transition-colors">
                            Post to Community
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2 text-slate-400" /> Topics
            </h3>
            <div className="space-y-2">
              {topics.map((topic, i) => (
                <button key={i} className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex justify-between items-center group">
                  {topic}
                  <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full group-hover:bg-white group-hover:text-gold-600 transition-colors">12</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl text-white shadow-lg">
             <h3 className="font-bold text-lg text-gold-500 mb-2">Upcoming Event</h3>
             <p className="text-sm font-bold mb-4">Operations Summit 2024</p>
             <div className="flex items-center text-xs text-slate-300 mb-6">
                <Calendar className="w-4 h-4 mr-2" /> Nov 15th • Virtual
             </div>
             <button className="w-full bg-white text-slate-900 py-2 rounded-lg text-xs font-bold hover:bg-gold-500 transition-colors">
                Register Free
             </button>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-6 overflow-x-auto scrollbar-hide">
             <button 
                onClick={() => setActiveTab('discussions')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'discussions' ? 'border-gold-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
                Discussions
             </button>
             <button 
                onClick={() => setActiveTab('events')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'events' ? 'border-gold-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
                Events
             </button>
             <button 
                onClick={() => setActiveTab('members')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'members' ? 'border-gold-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
                Top Contributors
             </button>
          </div>

          {activeTab === 'discussions' && (
            <div className="space-y-4">
               {discussions.map(post => (
                  <div key={post.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0">
                           {post.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-bold text-slate-900 text-sm">{post.author}</span>
                              <span className="text-xs text-slate-500">• {post.role}</span>
                              <span className="text-xs text-slate-400">• {post.time}</span>
                           </div>
                           
                           <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-gold-600 transition-colors">{post.title}</h3>
                           
                           {/* Linked Protocol Card */}
                           {post.linkedSop && (
                               <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-3 hover:border-gold-300 transition-colors max-w-xl">
                                   <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-gold-600 shadow-sm">
                                       <FileText className="w-4 h-4" />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                       <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Discussing Protocol</div>
                                       <div className="text-sm font-bold text-slate-900 truncate">{post.linkedSop.title}</div>
                                   </div>
                                   <button className="text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-900 hover:text-white transition-colors flex items-center shrink-0">
                                       <CheckCircle className="w-3 h-3 mr-1" /> Follow Procedure
                                   </button>
                               </div>
                           )}

                           <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag, t) => (
                                 <span key={t} className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] uppercase font-bold tracking-wide rounded border border-slate-100">
                                    {tag}
                                 </span>
                              ))}
                           </div>
                           <div className="flex items-center gap-6 text-sm text-slate-500">
                              <button 
                                onClick={(e) => handleLike(e, post.id)} 
                                className={`flex items-center gap-1 transition-colors ${post.likedByMe ? 'text-blue-600 font-bold' : 'hover:text-slate-900'}`}
                              >
                                <ThumbsUp className={`w-4 h-4 ${post.likedByMe ? 'fill-blue-600' : ''}`} /> {post.likes}
                              </button>
                              <button 
                                onClick={(e) => handleCommentClick(e, post.id)}
                                className={`flex items-center gap-1 transition-colors ${post.commentsExpanded ? 'text-blue-600 font-bold' : 'hover:text-slate-900'}`}
                              >
                                <MessageCircle className={`w-4 h-4 ${post.commentsExpanded ? 'fill-blue-100' : ''}`} /> {post.comments}
                              </button>
                           </div>

                           {post.commentsExpanded && (
                             <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in cursor-default" onClick={e => e.stopPropagation()}>
                                 <div className="space-y-3 mb-4">
                                    <div className="flex gap-3 text-sm">
                                       <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">JD</div>
                                       <div>
                                          <span className="font-bold text-slate-900 mr-2">Jane Doe</span>
                                          <span className="text-slate-600">Great point! We're doing the same thing.</span>
                                       </div>
                                    </div>
                                    {post.comments === 0 && (
                                        <p className="text-xs text-slate-400 italic">No comments yet. Be the first!</p>
                                    )}
                                 </div>
                                 <div className="flex gap-2">
                                    <input type="text" placeholder="Write a comment..." className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" onClick={e => e.stopPropagation()} />
                                    <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-gold-500 hover:text-slate-900 transition-colors">
                                       <Send className="w-4 h-4" />
                                    </button>
                                 </div>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          )}

          {activeTab === 'events' && (
             <div className="grid md:grid-cols-2 gap-6">
                {events.map(evt => (
                   <div key={evt.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-gold-300 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                         <div className="bg-slate-100 p-3 rounded-lg text-center">
                            <span className="block text-xs font-bold text-slate-500 uppercase">{evt.date.split(',')[0].split(' ')[0]}</span>
                            <span className="block text-xl font-bold text-slate-900">{evt.date.split(',')[0].split(' ')[1]}</span>
                         </div>
                         <button className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-gold-500 hover:text-slate-900 transition-colors">RSVP</button>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">{evt.title}</h3>
                      <p className="text-xs text-slate-500 mb-4">Hosted by {evt.host}</p>
                      <div className="flex items-center text-xs text-slate-500">
                         <Users className="w-4 h-4 mr-1" /> {evt.attendees} attending
                      </div>
                   </div>
                ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
