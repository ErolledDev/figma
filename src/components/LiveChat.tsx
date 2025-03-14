import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Message {
  id: string;
  content: string;
  sender_type: 'business' | 'visitor';
  created_at: string;
}

interface ChatSession {
  id: string;
  visitor_id: string;
  status: 'active' | 'closed';
  messages: Message[];
}

export const LiveChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    initializeBusiness();
  }, []);

  const initializeBusiness = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Try to get existing business
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id);

      if (businesses && businesses.length > 0) {
        setBusinessId(businesses[0].id);
        await loadChatSessions(businesses[0].id);
      } else {
        // Create new business if none exists
        const { data: newBusiness, error: createError } = await supabase
          .from('businesses')
          .insert({
            user_id: user.id,
            business_name: 'My Business', // Default name
            representative_name: 'Representative', // Default name
          })
          .select('id')
          .single();

        if (createError) throw createError;
        if (newBusiness) {
          setBusinessId(newBusiness.id);
          await loadChatSessions(newBusiness.id);
        }
      }
    } catch (error) {
      console.error('Error initializing business:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatSessions = async (businessId: string) => {
    try {
      const { data: sessions } = await supabase
        .from('chat_sessions')
        .select(`
          id,
          visitor_id,
          status,
          messages (
            id,
            content,
            sender_type,
            created_at
          )
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      setSessions(sessions || []);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const subscribeToNewSessions = () => {
    const subscription = supabase
      .channel('chat_sessions')
      .on('INSERT', (payload) => {
        setSessions((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const subscribeToNewMessages = () => {
    const subscription = supabase
      .channel('messages')
      .on('INSERT', (payload) => {
        setSessions((prev) =>
          prev.map((session) =>
            session.id === payload.new.session_id
              ? {
                  ...session,
                  messages: [...(session.messages || []), payload.new],
                }
              : session
          )
        );
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || !message.trim()) return;

    try {
      await supabase.from('messages').insert({
        session_id: selectedSession,
        content: message,
        sender_type: 'business',
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Chat Sessions List */}
      <div className="col-span-4 space-y-4">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className={`cursor-pointer ${
              selectedSession === session.id ? 'border-blue-500' : ''
            }`}
            onClick={() => setSelectedSession(session.id)}
          >
            <CardContent className="p-4">
              <div className="font-semibold">Visitor: {session.visitor_id}</div>
              <div className="text-sm text-gray-500">
                Status: {session.status}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="col-span-8">
        {selectedSession ? (
          <div className="h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {sessions
                .find((s) => s.id === selectedSession)
                ?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-2 rounded-lg ${
                      message.sender_type === 'business'
                        ? 'bg-blue-100 ml-auto'
                        : 'bg-gray-100'
                    } max-w-[70%]`}
                  >
                    {message.content}
                  </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <Button type="submit">Send</Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="h-[600px] flex items-center justify-center text-gray-500">
            Select a chat session to start messaging
          </div>
        )}
      </div>
    </div>
  );
};