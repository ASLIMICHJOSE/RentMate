import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { STUDENT_NAV } from '../../layouts/dashboardNav';
import { AppStore, type ChatConversation, type ChatMessage } from '../../services/store';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { formatTime, getInitials } from '../../utils/format';

const QUICK_REPLIES = [
  'Yes, that time works perfectly!',
  'Could you share more photos of the kitchen?',
  'Is parking space included in the rent?',
  'I have submitted a visit request on RentMate.',
];

export default function MessagesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    const list = AppStore.getConversations();
    setConversations(list);

    // If navigated with state.activeConversationId
    const targetId = (location.state as { activeConversationId?: string } | null)?.activeConversationId;
    if (targetId && list.some((c) => c.id === targetId)) {
      setActiveConvId(targetId);
    } else if (list.length > 0) {
      setActiveConvId(list[0].id);
    }
  }, [location.state]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConvId) {
      setMessages(AppStore.getMessages(activeConvId));
    }
  }, [activeConvId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const filteredConversations = conversations.filter((c) =>
    `${c.participantName} ${c.title} ${c.lastMessage}`.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function handleSendMessage(textToSend?: string) {
    const text = (textToSend ?? inputText).trim();
    if (!text || !activeConvId) return;

    const currentUserId = user?.id ?? 'user-101';
    const currentUserName = user?.name ?? 'Aditya Sharma';

    const sent = AppStore.sendMessage(activeConvId, currentUserId, currentUserName, text);
    setMessages((prev) => [...prev, sent]);
    setInputText('');
    setConversations(AppStore.getConversations());

    // Trigger simulated realistic reply after 1.5 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyTexts = [
        `Thanks for your message, ${currentUserName.split(' ')[0]}! Looking forward to meeting you.`,
        'Sounds good! Let me know if you need directions or have any other questions.',
        'Got it. The flat is in great condition and ready for immediate move-in.',
        'Confirmed! I will make sure the room is available for you to inspect.',
      ];
      const randomReply = replyTexts[Math.floor(Math.random() * replyTexts.length)];
      const replyMsg = AppStore.sendMessage(
        activeConvId,
        activeConv?.participantId ?? 'owner-1',
        activeConv?.participantName ?? 'Owner',
        randomReply,
      );
      setMessages((prev) => [...prev, replyMsg]);
      setConversations(AppStore.getConversations());
    }, 1500);
  }

  return (
    <DashboardLayout nav={STUDENT_NAV} navLabel="Student dashboard">
      <PageHeader
        eyebrow="Messages"
        title="Live Messages & Enquiries"
        description="Direct communication with verified property owners and prospective roommates."
      />

      <div className="mt-6 grid h-[680px] grid-cols-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 md:grid-cols-[340px_1fr]">
        {/* Left: Conversations List */}
        <div className="flex flex-col border-r border-slate-200 bg-slate-50/50">
          <div className="border-b border-slate-200 p-4 bg-white">
            <h2 className="font-heading text-base font-bold text-slate-900">Conversations</h2>
            <div className="mt-2 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-brand-600 border border-transparent focus:border-brand-500"
              />
            </div>
          </div>

          <ul className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {filteredConversations.length === 0 ? (
              <li className="py-8 text-center text-xs text-slate-400">No conversations found</li>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConvId;
                return (
                  <li key={conv.id}>
                    <button
                      type="button"
                      onClick={() => setActiveConvId(conv.id)}
                      className={`w-full text-left rounded-xl p-3 transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-white shadow-sm ring-1 ring-slate-200'
                          : 'hover:bg-slate-100/70'
                      }`}
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                        {getInitials(conv.participantName)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-bold text-xs text-slate-900 truncate">
                            {conv.participantName}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                            {formatTime(conv.updatedAt)}
                          </span>
                        </div>
                        {conv.propertyTitle && (
                          <p className="text-[10px] font-semibold text-brand-600 truncate mt-0.5">
                            🏠 {conv.propertyTitle}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 truncate mt-1">{conv.lastMessage}</p>
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Right: Active Chat Thread */}
        {activeConv ? (
          <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3.5 bg-white">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                  {getInitials(activeConv.participantName)}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{activeConv.participantName}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {activeConv.participantRole}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                    </span>
                  </div>
                  {activeConv.propertyId && (
                    <Link
                      to={`/properties/${activeConv.propertyId}`}
                      className="text-xs text-brand-600 font-semibold hover:underline block truncate max-w-sm"
                    >
                      Ref: {activeConv.propertyTitle ?? 'View Property'} →
                    </Link>
                  )}
                </div>
              </div>

              {activeConv.propertyId && (
                <Link
                  to={`/properties/${activeConv.propertyId}`}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  View Listing
                </Link>
              )}
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
              <div className="text-center">
                <span className="rounded-full bg-slate-200/60 px-3 py-1 text-[10px] font-semibold text-slate-500">
                  Protected & verified chat thread
                </span>
              </div>

              {messages.map((msg) => {
                const isMe = msg.senderId === (user?.id ?? 'user-101');
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {!isMe && (
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                          {getInitials(msg.senderName)}
                        </span>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-brand-600 text-white rounded-br-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    </div>
                    <span className="mt-1 text-[10px] text-slate-400 px-1 font-medium">
                      {formatTime(msg.createdAt)} {isMe && '· Delivered ✓✓'}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                    {getInitials(activeConv.participantName)}
                  </span>
                  <div className="rounded-2xl bg-white border border-slate-200 px-3 py-2 text-xs text-slate-400 shadow-xs flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-slate-400 animate-bounce" />
                    <span className="size-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="size-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[10px] font-medium ml-1">typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies Carousel */}
            <div className="border-t border-slate-100 bg-white px-4 py-2 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Quick:
              </span>
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => handleSendMessage(reply)}
                  className="rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700 whitespace-nowrap transition"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 border-t border-slate-200 p-4 bg-white"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type a message to ${activeConv.participantName}...`}
                className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-brand-600 border border-transparent focus:border-brand-500"
              />
              <Button type="submit" size="sm" className="font-bold px-4">
                Send ↵
              </Button>
            </form>
          </div>
        ) : (
          <div className="grid place-items-center p-8">
            <EmptyState
              title="No active chat"
              message="Select a conversation from the left or contact an owner from any property details page."
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
