"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  MessageCircle,
  X,
  Clock,
  Check,
  CheckCheck,
  Info,
  Phone,
  ArrowLeft,
  Sparkles,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { VehicleListing, Message, Conversation, User } from "@/types";
import { cn } from "@/lib/utils";

interface ChatWithOwnerProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleListing;
}

const ChatWithOwner = ({ isOpen, onClose, vehicle }: ChatWithOwnerProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const isGuest = !currentUser;

  const quickReplies = [
    "Is this still available?",
    "What is the final price?",
    "Can I come for a test drive?",
    "Is the document clear?"
  ];

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  useEffect(() => {
    if (isOpen && currentUser && vehicle) {
      loadConversation();
    }
  }, [isOpen, currentUser, vehicle]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100);
      }
    }
  }, [messages, isSending]);

  const loadConversation = () => {
    if (!currentUser) return;
    const conversations: Conversation[] = JSON.parse(localStorage.getItem("conversations") || "[]");
    const storedMessages: Message[] = JSON.parse(localStorage.getItem("messages") || "[]");

    let existingConv = conversations.find(
      (c) =>
        c.vehicleId === vehicle.id &&
        c.participants.some((p) => p.userId === currentUser.id) &&
        c.participants.some((p) => p.userId === vehicle.userId)
    );

    if (existingConv) {
      setConversation(existingConv);
      const convMessages = storedMessages
        .filter((m) => m.conversationId === existingConv.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setMessages(convMessages);

      // Mark as read
      const updatedMessages = storedMessages.map((m) => {
        if (m.conversationId === existingConv.id && m.receiverId === currentUser.id) {
          return { ...m, read: true };
        }
        return m;
      });
      localStorage.setItem("messages", JSON.stringify(updatedMessages));

      const updatedConvs = conversations.map(c => {
        if (c.id === existingConv.id) return { ...c, unreadCount: 0 };
        return c;
      });
      localStorage.setItem("conversations", JSON.stringify(updatedConvs));
    } else {
      setConversation(null);
      setMessages([]);
    }
  };

  const handleSendMessage = (content: string = messageContent) => {
    if (!content.trim() || !currentUser || !vehicle) return;

    setIsSending(true);

    const conversations: Conversation[] = JSON.parse(localStorage.getItem("conversations") || "[]");
    const storedMessages: Message[] = JSON.parse(localStorage.getItem("messages") || "[]");

    let currentConv = conversation;

    if (!currentConv) {
      currentConv = {
        id: crypto.randomUUID(),
        participants: [
          { userId: currentUser.id, userName: currentUser.name, userEmail: currentUser.email },
          { userId: vehicle.userId, userName: vehicle.userName, userEmail: vehicle.userEmail },
        ],
        vehicleId: vehicle.id,
        vehicleTitle: vehicle.title,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
      };
      conversations.push(currentConv);
      setConversation(currentConv);
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      conversationId: currentConv.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderEmail: currentUser.email,
      receiverId: vehicle.userId,
      receiverName: vehicle.userName,
      receiverEmail: vehicle.userEmail,
      vehicleId: vehicle.id,
      vehicleTitle: vehicle.title,
      content: content.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    storedMessages.push(newMessage);
    
    const updatedConvs = conversations.map(c => {
      if (c.id === currentConv?.id) {
        return {
          ...c,
          lastMessage: newMessage.content,
          lastMessageAt: newMessage.createdAt,
          unreadCount: (c.unreadCount || 0) + 1
        };
      }
      return c;
    });

    localStorage.setItem("messages", JSON.stringify(storedMessages));
    localStorage.setItem("conversations", JSON.stringify(updatedConvs));

    setMessages(prev => [...prev, newMessage]);
    setMessageContent("");
    setIsSending(false);

    // Auto-reply
    if (messages.length === 0) {
      setTimeout(() => {
        const allAutoReplies = JSON.parse(localStorage.getItem("userAutoReplies") || "{}");
        const settings = allAutoReplies[vehicle.userId];
        
        // Only send if enabled (default is false if not set, or check settings.enabled)
        if (settings && settings.enabled) {
          const autoReply: Message = {
            id: crypto.randomUUID(),
            conversationId: currentConv!.id,
            senderId: vehicle.userId,
            senderName: vehicle.userName,
            senderEmail: vehicle.userEmail,
            receiverId: currentUser.id,
            receiverName: currentUser.name,
            receiverEmail: currentUser.email,
            vehicleId: vehicle.id,
            vehicleTitle: vehicle.title,
            content: settings.message || `Hi ${currentUser.name.split(' ')[0]}, thanks for your interest in my ${vehicle.make} ${vehicle.model}! I'll get back to you shortly.`,
            read: false,
            createdAt: new Date().toISOString(),
          };
          const latestMessages = JSON.parse(localStorage.getItem("messages") || "[]");
          latestMessages.push(autoReply);
          localStorage.setItem("messages", JSON.stringify(latestMessages));
          setMessages(prev => [...prev, autoReply]);
        }
      }, 1500);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden sm:max-w-lg h-[85vh] flex flex-col gap-0 border-none shadow-2xl [&>button]:hidden">
        {/* Premium Header */}
        <div className="bg-primary p-4 text-primary-foreground shadow-lg shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="sm:hidden text-primary-foreground hover:bg-white/10" onClick={onClose}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Avatar className="h-10 w-10 border-2 border-white/20">
              <AvatarFallback className="bg-white/10 text-white">
                {getInitials(vehicle.userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <DialogTitle className="font-bold truncate text-base">{vehicle.userName}</DialogTitle>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <p className="text-xs text-white/70 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Online
              </p>
            </div>
            <div className="flex items-center gap-1">
               <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10 hidden sm:flex">
                 <Phone className="w-4 h-4" />
               </Button>
               <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10" onClick={onClose}>
                 <X className="w-5 h-5" />
               </Button>
            </div>
          </div>
        </div>

        {/* Vehicle Quick Info Strip */}
        <div className="bg-muted/30 p-3 border-b flex items-center justify-between gap-4 px-4 transition-all hover:bg-muted/50 duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border bg-background shadow-sm">
              <img src={vehicle.images[0]} alt={vehicle.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold truncate leading-tight group-hover:text-primary transition-colors">{vehicle.title}</h4>
              <p className="text-xs font-black text-primary mt-0.5">{formatCurrency(vehicle.price)}</p>
              <div className="flex gap-2 mt-1 opacity-70">
                 <span className="text-[10px] flex items-center gap-0.5"><Calendar className="w-2 h-2"/> {vehicle.year}</span>
                 <span className="text-[10px] flex items-center gap-0.5"><Gauge className="w-2 h-2"/> {vehicle.mileage.toLocaleString()} km</span>
              </div>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] whitespace-nowrap">
            PREMIUM AD
          </Badge>
        </div>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-4 bg-[#f8f9fa] relative" ref={scrollAreaRef}>
          <div className="space-y-4">
            <div className="flex justify-center my-6">
              <div className="bg-blue-50 text-blue-700 text-[10px] px-3 py-1 rounded-full border border-blue-100 flex items-center gap-2">
                <Info className="w-3 h-3" />
                Messages are protected by TradeHub Encryption
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <MessageCircle className="w-10 h-10 text-primary/40" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg">Send an Inquiry</h4>
                <p className="text-sm text-muted-foreground max-w-[240px] mt-2">
                  Be the first to message {vehicle.userName.split(' ')[0]} about this listing!
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const effectivelyIsMe = currentUser && msg.senderId === currentUser.id && 
                                      (msg.senderEmail !== vehicle.userEmail || idx === 0);

                return (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-3 duration-500",
                      effectivelyIsMe ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    {!effectivelyIsMe && (
                      <span className="text-[10px] text-muted-foreground font-bold mb-1 ml-1">{msg.senderName}</span>
                    )}
                    <div 
                      className={cn(
                        "px-4 py-2.5 rounded-2xl text-sm shadow-sm transition-all duration-300 relative overflow-hidden",
                        effectivelyIsMe 
                          ? "bg-primary text-primary-foreground rounded-tr-none hover:shadow-md" 
                          : "bg-white text-black border border-gray-100 rounded-tl-none hover:border-gray-200 shadow-sm"
                      )}
                    >
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 px-1">
                      <span className="text-[10px] text-muted-foreground font-medium">{formatTime(msg.createdAt)}</span>
                      {effectivelyIsMe && (
                        msg.read ? (
                          <CheckCheck className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Check className="w-3 h-3 text-muted-foreground" />
                        )
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {isSending && (
               <div className="flex items-start mr-auto max-w-[85%] animate-pulse">
                 <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5">
                   <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                   <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                 </div>
               </div>
            )}

            {isGuest && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border max-w-[320px] animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserIcon className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="font-bold text-xl mb-2">Join the Conversation</h4>
                  <p className="text-sm text-muted-foreground mb-8">
                    Sign in to message {vehicle.userName.split(' ')[0]} and track your inquiries.
                  </p>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl text-md font-bold shadow-lg"
                    onClick={() => router.push("/auth")}
                  >
                    Login / Sign Up
                  </Button>
                  <p className="text-[10px] text-muted-foreground mt-4">
                    Takes less than 30 seconds to get started!
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input & Interaction Bar */}
        <div className="p-4 bg-white border-t space-y-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {/* Quick Replies */}
          {messages.length === 0 && !isGuest && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-2 px-2">
              {quickReplies.map((reply, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full text-[11px] font-semibold whitespace-nowrap bg-muted/20 hover:bg-primary hover:text-white transition-all duration-300"
                  onClick={() => handleSendMessage(reply)}
                >
                  {reply}
                </Button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1 bg-muted/30 rounded-2xl p-1 focus-within:bg-muted/50 transition-colors border border-transparent focus-within:border-primary/10">
              <Textarea
                placeholder="Write a message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="min-h-[44px] max-h-[120px] resize-none border-none focus-visible:ring-0 bg-transparent p-3 text-sm"
                rows={1}
                disabled={isGuest}
              />
            </div>
            <Button 
              size="icon" 
              className={cn(
                "rounded-2xl h-[44px] w-[44px] shrink-0 transition-all duration-500 shadow-lg",
                messageContent.trim() ? "bg-primary rotate-0 scale-100" : "bg-muted text-muted-foreground -rotate-12 scale-90 opacity-40"
              )}
              onClick={() => handleSendMessage()}
              disabled={!messageContent.trim() || isSending || isGuest}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium px-1">
             <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                Smart Assist Active
             </div>
             <div>Press Enter to send</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatWithOwner;
